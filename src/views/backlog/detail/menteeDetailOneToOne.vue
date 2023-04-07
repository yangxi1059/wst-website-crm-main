<!--
 * @Author: 杨曦
 * @Date: 2020-09-09 17:38:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:59:56
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="报名一对多课程的学员信息" :visible.sync="menteeDetailVisible" width="900px" :before-close="close">
        <el-form :data="dataObj" style="display:flex;">
            <el-form-item label="学员姓名：" label-width="90px">
                <p>{{dataObj.menteeInfo.realName || '暂无'}}</p>
            </el-form-item>
            <el-form-item label="学员学校：" label-width="150px">
                <p>{{dataObj.menteeInfo.schoolName || '暂无'}}</p>
            </el-form-item>
            <el-form-item label="毕业年份：" label-width="150px">
                <p>{{dataObj.menteeInfo.finishYear || '暂无'}}</p>
            </el-form-item>
        </el-form>
        <el-card class="box-card" v-if="dataObj.resumeArr.length > 0">
            <div slot="header" class="clearfix">
                <span>简历列表：</span>
            </div>
            <div  style="display:flex;width:100%;justify-content:space-between;height:40px;line-height:40px" v-for="(item,i) in dataObj.resumeArr" :key="i">
                <div style="width:400px;">{{item.fileName}}</div>
                <div style="width:100px;">{{item.uploadFrom}}</div>
                <div style="width:140px;">{{item.createTime}}</div>
                <el-link :underline="false" style="width:100px;" type="primary" :href="item.previewUrl" target="_blank" ><i class="el-icon-view el-icon--right"></i> 预览</el-link>
            </div>
        </el-card>
        <span slot="footer">
            <el-button @click="close">关 闭</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    menteeDetailVisible: {
      type: Boolean,
      default: false
    },
    menteeDetailData: {
      type: Object
    }
  },
  data () {
    return {
      dataObj: {
        menteeInfo: {
          realName: '',
          schoolName: '',
          finishYear: ''
        },
        resumeArr: []
      }
    }
  },
  watch: {
    menteeDetailVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      this.dataObj = this.menteeDetailData
      console.log(this.dataObj)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
