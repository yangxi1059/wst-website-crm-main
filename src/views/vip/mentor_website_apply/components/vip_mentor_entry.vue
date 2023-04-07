<!--
 * @Author: 杨曦
 * @Date: 2020-11-12 14:10:04
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-10 10:10:06
 * @Version:
 * @Description:
-->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'导师申请详情'"
      :visible.sync="purchaseDetailVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
          <el-col :span="4" class="_item-name">申请导师名</el-col>
          <el-col :span="4" class="_item-value">{{applyData.mentorName}}</el-col>
          <el-col :span="4" class="_item-name">申请导师E-mail</el-col>
          <el-col :span="4" class="_item-value">{{applyData.email}}</el-col>
          <el-col :span="4" class="_item-name">申请导师微信ID</el-col>
          <el-col :span="4" class="_item-value">{{applyData.wxId || '无'}}</el-col>
          <el-col :span="4" class="_item-name">辅导专业</el-col>
          <el-col :span="4" class="_item-value">{{applyData.coachingSpecialties || '无'}}</el-col>
           <el-col :span="4" class="_item-name">简历</el-col>
          <el-col :span="4" class="_item-value">
            <el-button size="mini" type="text" v-if="applyData.resumePath" @click="download(applyData.resumePath)">查看</el-button>
          </el-col>
           <el-col :span="4" class="_item-name">在职凭证</el-col>
          <el-col :span="4" class="_item-value">
            <el-button size="mini" type="text" v-if="applyData.certificate" @click="download(applyData.certificate)">查看</el-button>
          </el-col>
          <el-col :span="4" class="_item-name">创建人</el-col>
          <el-col :span="4" class="_item-value">{{applyData.createByName || '无'}}</el-col>
          <el-col :span="4" class="_item-name">创建时间</el-col>
          <el-col :span="4" class="_item-value">{{applyData.createTime || '无'}}</el-col>
          <el-col :span="4" class="_item-name">更新人</el-col>
          <el-col :span="4" class="_item-value">{{applyData.updateByName || '无'}}</el-col>
          <el-col :span="4" class="_item-name">更新时间</el-col>
          <el-col :span="4" class="_item-value">{{applyData.updateTime || '无'}}</el-col>
          <el-col :span="4" class="_item-name">审核状态</el-col>
          <el-col :span="4" class="_item-value">{{applyData.auditStatusName}}</el-col>
      </el-row>
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <span>申请导师工作履历</span>
          </div>
          <div v-for="(item,i) in record" :key="i" style="display:flex">
              <el-col :span="4" class="_item-name">公司名</el-col>
              <el-col :span="4" class="_item-value">{{item.companyName || '暂无'}}</el-col>
              <el-col :span="4" class="_item-name">职位名</el-col>
              <el-col :span="4" class="_item-value">{{item.positionName || '暂无'}}</el-col>
              <el-col :span="4" class="_item-name">工作时长</el-col>
              <el-col :span="4" class="_item-value">{{item.fromDate || '暂无'}} - {{item.toDate || '暂无'}}</el-col>
          </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit(0)" v-if="applyData.auditStatus == 'wait_audit'">拒 绝</el-button>
        <el-button type="primary" @click="submit(1)" v-if="applyData.auditStatus == 'wait_audit'">通 过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import { downloadFun } from '@/libs/file'
import { mapState } from 'vuex'

export default {
  name: 'brokerageAudit',
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  props: {
    pkId: {
    },
    purchaseDetailVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      applyData: {

      },
      record: [],
      auditVisible: false,
      // 弹框，导师数据
      mentorData: {
        mentorName: '',
        email: '',
        wxId: '',
        division: [],
        company: [],
        location: [],
        country: [],
        linkedinPath: null
      }
    }
  },
  watch: {
    purchaseDetailVisible: function (val) {
      if (val) {
        console.log(this.pkId)
        this.initPage()
      }
    }
  },
  mounted () {},
  methods: {
    initPage () {
      api.getMentorEntryDetail(this.pkId).then(res => {
        this.applyData = res.data
        this.record = JSON.parse(res.data.records)
        console.log(this.applyData)
      })
    },
    mentorEditClose () {
      this.auditVisible = false
      this.handleClose()
    },
    mentorEditSubmit () {
      this.auditVisible = false
      this.$emit('submit')
    },

    handleClose () {
      this.applyData = {}
      this.record = []
      this.$emit('close')
    },
    download (path) {
      if (!this.roleInfo.includes('mentor_apply_preview')) {
        this.$message('无权限')
        return
      }
      downloadFun(path, url => {
        window.open(url)
      })
    },
    submit (type) {
      if (type == 0) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          const data = {
            pkId: this.pkId,
            auditStatus: 'not_pass',
            auditNote: value
          }
          console.log(data)
          api.mentorAudit(data).then(res => {
            console.log(res)
            this.$emit('submit')
          })
        }).catch(() => {})
      } else if (type == 1) {
        this.mentorData = {
          mentorName: this.applyData.mentorName,
          email: this.applyData.email || '',
          wxId: this.applyData.wxId || '',
          division: [],
          company: this.record,
          location: [],
          country: [],
          linkedinPath: null
        }
        const params = {
          pkId: this.pkId,
          auditStatus: 'pass',
          auditNote: '',
          mentorInfo: {}
        }
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        api.mentorAudit(params).then(({ data }) => {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.$loading().close()
          this.handleClose()
          this.$emit('submit')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
