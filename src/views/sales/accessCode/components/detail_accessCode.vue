<!--
 * @Author: 杨曦
 * @Date: 2022-08-09 09:09:38
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-09 16:28:37
 * @Version:
 * @Description:
-->
<template>
  <div class="accesscode-out">
    <el-dialog  :visible.sync="detailCodeVisible" width="1000px" :before-close="close" :append-to-body="true" :close-on-click-modal="false">
      <div class="mb20">
          <el-descriptions title="code详情" direction="vertical" :column="2" border>
            <el-descriptions-item label="Code">{{info.codeInfo.accessCode || ''}}</el-descriptions-item>
            <el-descriptions-item label="是否已用">{{info.codeInfo.isUsed}}</el-descriptions-item>
            <el-descriptions-item label="是否可用" >
              <el-radio-group v-if="roleInfo.includes(`accessCode_edit`)" size="mini" @change="changeStatus(info.codeInfo.enableStatus)" v-model="info.codeInfo.enableStatus">
                <el-radio-button label="0">否</el-radio-button>
                <el-radio-button label="1">是</el-radio-button>
              </el-radio-group>
              <div v-else>{{info.codeInfo.enableStatusName}}</div>
            </el-descriptions-item>
            <el-descriptions-item label="适用应用">{{info.codeInfo.appName}}</el-descriptions-item>
            <el-descriptions-item label="是否分配">{{info.codeInfo.allocateStatusName}}</el-descriptions-item>
            <el-descriptions-item label="微信昵称">{{info.codeInfo.nickName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="首次使用时间">{{info.codeInfo.firstUseTime || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="过期时间">{{info.codeInfo.expirationDate}}</el-descriptions-item>
            <el-descriptions-item label="更新人">{{info.codeInfo.updateByName}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{info.codeInfo.updateTime}}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{info.codeInfo.createByName}}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{info.codeInfo.createTime}}</el-descriptions-item>
          </el-descriptions>
      </div>
      <div style="display:flex">
        <div v-if="info.codeInfo.qrPath" style="flex:1">
          <div style="text-align:center">
            <el-image  class="mr20" style="width: 300px; height: auto; " :preview-src-list="[info.codeInfo.qrPath || '']" :src="info.codeInfo.qrPath || ''" fit="cover"></el-image>
            <div>
              <el-button type="primary" @click="downImg(info.codeInfo.qrPath)">下载</el-button>
            </div>
          </div>
        </div>
        <div v-if="lessonList.length > 0" style="flex:1">
            <div v-for="(item,i) in lessonList" :key="i + '1'">
                <div>{{item.courseTitle}}</div>
                <div class="ml20" v-for="(item2,k) in item.sectionList" :key="k+'1'">
                    <div>{{item2.sectionName}}</div>
                    <div class="ml20"  v-for="(item3,j) in item2.lessonList" :key="j+'1'">
                        <el-checkbox :disabled="true" class="mr20" v-model="!!item3.lessonId"></el-checkbox>
                        <span>{{item3.videoTitle}}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import { mapState } from 'vuex'

export default {
  name: 'accessCode_detail',
  props: {
    detailCodeVisible: {
      type: Boolean,
      default: false
    },
    accessCode: {}
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    return {
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      lessonList: [],
      info: {
        codeInfo: {
          accessCode: '',
          isUsed: '',
          enableStatusName: '',
          appName: '',
          updateByName: '',
          updateTime: '',
          createByName: '',
          createTime: ''
        }
      }
    }
  },
  watch: {
    detailCodeVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getAccessCodeInfo(this.accessCode).then(res => {
        this.lessonList = res.data.courseList
        this.info = res.data
        console.log(res.data)
      })
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    downImg (url) {
      window.open(url)
    },
    changeStatus (status) {
      console.log(status)
      const data = {
        enableStatus: status,
        accessCode: this.accessCode
      }
      api.accessCodePut(data).then(res => {
        this.$message.success('更新成功 ！！')
        this.$emit('update')
        this.Topage()
      })
    },
    clear () {
      this.lessonList = []
      this.info = {
        codeInfo: {
          accessCode: '',
          isUsed: '',
          enableStatusName: '',
          appName: '',
          updateByName: '',
          updateTime: '',
          createByName: '',
          createTime: ''
        }
      }
    }
  }
}
</script>

<style  >
.accesscode-out  .el-descriptions-item__cell{
  width: 50% !important;
}
</style>
