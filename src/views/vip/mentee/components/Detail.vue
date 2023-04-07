<!--
 * @Author: 库建华
 * @Date: 2019-11-25 14:56:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-22 09:53:19
 * @Version: 1
 * @Description:
 -->
<template>
  <div  v-if="detailVisible">
      <div
        class="record_detail"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-descriptions title="文书详情" :column="2" :contentStyle="{flex:1}">
          <el-descriptions-item label="任务状态">{{detailData.taskStatusName}}</el-descriptions-item>
          <el-descriptions-item label="导师名">{{detailData.mentorName}}</el-descriptions-item>
          <el-descriptions-item label="学员名">{{detailData.menteeName}}</el-descriptions-item>
          <el-descriptions-item label="简历类型">{{detailData.resumeTypeName || detailData.resumeType}}</el-descriptions-item>
          <el-descriptions-item label="任务金额">{{detailData.taskFundType=='usd'?'$':'￥'}}{{detailData.taskFundWage}}</el-descriptions-item>
          <el-descriptions-item label="截止日期" >{{detailData.deadline}}</el-descriptions-item>
          <el-descriptions-item label="修改要求" :span="2">{{detailData.requirement}}</el-descriptions-item>
          <el-descriptions-item label="原始简历">
            <template >
              <el-link type="primary" v-if="roleInfo.includes('mentee_file_mentor_preview')" @click="preview(detailData.originalResume)" class="mr10">预览</el-link>
              <el-link type="primary" v-if="roleInfo.includes('mentee_file_mentor_down')" @click="downloadD(detailData.originalResume)">下载</el-link>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="修改后简历" v-if="detailData.modifiedResume">
            <template >
              <el-link type="primary" v-if="roleInfo.includes('mentee_file_mentor_preview')" @click="preview(detailData.modifiedResume)" class="mr10">预览</el-link>
              <el-link type="primary" v-if="roleInfo.includes('mentee_file_mentor_down')" @click="downloadD(detailData.modifiedResume)">下载</el-link>
            </template>
          </el-descriptions-item>
        </el-descriptions>
        <div class="block mt10" v-if="detailData.eventArr && detailData.eventArr.length > 0">
          <el-timeline >
              <el-timeline-item :timestamp="item.eventTime" placement="top" v-for="(item,i) in detailData.eventArr" :key="item.pkId">
                <h4>{{item.eventByName}} {{item.eventTypeName}} {{item.content?`拒绝理由：${item.content}`:''}}</h4>
              </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="record_detail_btn">
          <el-button @click="handleClose">取 消</el-button>
          <span v-if="!showCommon" class="ml10">
            <el-button type="info" @click="toConnect(detailData)">小程序码</el-button>
            <el-button type="success"  v-if="detailData.taskStatus == 'on_going' && roleInfo.includes('mentee_file_resume_apply')" @click="apply2(detailData)">文书修改申请</el-button>
            <el-button type="success"  v-if="detailData.canApplyStatus == '1' && roleInfo.includes('mentee_file_rebate_apply')" @click="applyRebate(detailData)">文书佣金申请</el-button>
            <el-button type="primary" v-if="roleInfo.includes('mentee_file_mentor_edit')" @click="edit(detailData)">编辑</el-button>
            <el-button type="danger" v-if="detailData.taskStatus != 'cancel' && roleInfo.includes('mentee_file_mentor_delete')" @click="deleteIt(detailData)">删除</el-button>
          </span>
      </div>
    <apply :detailData="detailData" :rebateApply="rebateApply" :resumeApply="resumeApply" :applyVisible="applyVisible" @close="applyClose" @submit="applySubmit"></apply>
    <edit :editVisible="editVisible" :taskId="taskId"  @close="editClose" @submit="editSubmit"  />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import file from '@/libs/file'
import { downloadFunD } from '@/libs/file'
import edit from './Edit.vue'
import apply from './Apply.vue'
import { mapState } from 'vuex'

export default {
  name: 'recommend',
  props: {
    detailVisible: {},
    taskId: {},
    showApply: {},
    showApply2: {},
    showCommon: {}
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      detailData: {},
      applyVisible: false,
      loading: false,
      rebateApply: false,
      resumeApply: false,
      editVisible: false
    }
  },
  components: { apply, edit },
  watch: {
    taskId: function (newData, oldData) {
      console.log(newData)
      if (newData) {
        this.toPage()
      }
    }
  },
  mounted () {
  },
  methods: {
    toPage () {
      this.loading = true
      api.detailApplicationLetterTask(this.taskId).then(res => {
        console.log(res)
        this.detailData = res.data
        this.loading = false
      })
    },
    handleClose () {
      this.detailData = {}
      this.$emit('close')
    },
    preview (path) {
      file.preview(path)
    },
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },

    applyClose () {
      this.applyVisible = false
    },
    applySubmit () {
      this.applyVisible = false
      this.toPage()
      this.$emit('update')
    },

    edit (data) {
      this.taskId = data.taskId
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editVisible = false
      this.$emit('update')
      this.toPage()
    },
    deleteIt (data) {
      this.$confirm('此操作将永久删除此文书修改任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delApplicationLetterTask(data.taskId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.toPage()
          this.$emit('update')
        })
      })
    },
    toConnect (data) {
      api.getApplicationLetterAr(data.taskId).then(res => {
        console.log(res)
        const imageHtml = `<div style="width: 100%; height: 200px;text-align:center">
                          <img
                          style="width: 200px; height: 200px"
                          src="${res.data}"/>
                        </div>
                        <div style="text-align:center;color:#409EFF;margin-top:20px" >请截图后分享给导师</div>`

        this.$alert(imageHtml, '导师小程序文书修改任务邀请码', {
          showConfirmButton: false,
          dangerouslyUseHTMLString: true
        })
      })
    },

    apply2 () {
      this.resumeApply = true
      this.rebateApply = false
      this.applyVisible = true
    },
    applyRebate () {
      this.rebateApply = true
      this.resumeApply = false
      this.applyVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
*{box-sizing: border-box;}
.record_detail{
  padding:10px;
  height: calc(100vh - 120px);
  overflow: auto;
}
.record_detail_btn{
  padding-right:20px;
  height:40px;
  float: right;
}
</style>
