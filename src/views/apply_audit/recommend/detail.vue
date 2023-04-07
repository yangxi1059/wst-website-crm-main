<!--
 * @Author: 库建华
 * @Date: 2019-11-25 14:56:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-08 17:29:08
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'申请详情'"
      :visible.sync="recommendDetailVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">申请人</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createByName}}</el-col>
        <el-col :span="4" class="_item-name">申请状态</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
        <el-col :span="4" class="_item-name">申请时间</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createTime}}</el-col>
      </el-row>

      <el-card>
        <el-row class="mb10" v-if="refundData.content">
          <div v-if="applyData.applyType == 'application_letter_task_payment'">
            <el-col :span="6" class="_item-name">查看详情</el-col>
            <el-col :span="6" class="_item-value" >
              <el-button v-if="refundData.content.info && refundData.content.info.taskId" type="text" @click="detailPay(refundData.content.info.taskId)" style="padding:0px">{{refundData.content.info.taskId}}</el-button>
            </el-col>
          </div>
          <div style="display:flex;" v-for="(item,i) in refundData.content.text" :key="i">
            <div style="display:flex;width:50%">
              <el-col style="flex:1" class="_item-name">{{item.label || '空'}}</el-col>
              <el-col style="flex:1" class="_item-value" :title="item.value">{{item.value || '无'}}</el-col>
            </div>
          </div>
        </el-row>
        <el-card class="mb10" v-if="applyData && applyData.applyType == 'interviewee_info' && interviewStatus">
            <el-table
              v-if="interviewStatus"
              :data="refundData.content.info.intervieweeArr"
              size="mini"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column prop="sort" align="center"   label="面试轮次" min-width="20"></el-table-column>
              <el-table-column prop="interviewerName" align="center"   label="面试人" min-width="20"></el-table-column>
              <el-table-column prop="interviewTime" align="center"   label="面试时间" min-width="20"></el-table-column>

            </el-table>
        </el-card>
        <el-row class="mb10" v-if="refundData.content">
          <div v-if="refundData.content.info && refundData.content.info.originalResume">
              <el-col :span="6" class="_item-name">修改前文书</el-col>
              <el-col :span="16" class="_item-value">
                <div class="mb10" >
                  <el-button @click="download(refundData.content.info.originalResume)" size="mini">{{ refundData.content.info.originalResumeName || '修改前文书'}}</el-button>
                  <el-button type="primary" icon="el-icon-download" @click="downloadD(refundData.content.info.originalResume)" size="mini"></el-button>
                </div>
              </el-col>
              <el-col :span="6" class="_item-name">修改后文书</el-col>
              <el-col :span="16" class="_item-value">
                <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
                  <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
                  <el-button type="primary" icon="el-icon-download" @click="downloadD(item.url)" size="mini"></el-button>
                </div>
              </el-col>
          </div>
          <div v-else>
            <el-col :span="6" class="_item-name" v-if="refundData.content.file && refundData.content.file.length > 0">文件</el-col>
            <el-col :span="16" class="_item-value">
              <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
                <div style="display:flex">
                  <div style="flex:1;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">审查文件 {{++i}} - {{item.name}}</div>
                  <div style="width:130px">
                    <el-button @click="download(item.url)" size="mini">查看</el-button>
                    <el-button @click="downloadD(item.url)" v-if="refundData.apply.applyType == 'document_review'" size="mini">下载</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-card>
      <el-row class="mt10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="4" class="_item-name">抄送人</el-col>
        <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="refundData.pay">
        <el-col :span="4" class="_item-name">出账账户</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.paymentAccountName">{{refundData.pay.paymentAccountName}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">实际支付金额</el-col>
        <el-col :span="4" class="_item-value">
          <span
            :title="refundData.pay.payAmount"
          >{{refundData.pay.payTypeName}}：{{refundData.pay.payAmount}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">手续费</el-col>
        <el-col :span="4" class="_item-value">
          <span
            :title="refundData.pay.commissionAmount"
          >{{refundData.pay.payTypeName}}：{{refundData.pay.commissionAmount}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">手续费说明</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.commissionFor">{{refundData.pay.commissionFor||'无'}}</span>
        </el-col>
        <span v-if="refundData.pay.payVoucher">
          <el-col :span="4" class="_item-name">支付凭证</el-col>
          <el-col :span="4" class="_item-value">
            <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
          </el-col>
        </span>
        <el-col :span="4" class="_item-name">支付备注</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.payRemark">{{refundData.pay.payRemark}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">支付日期</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.payDate">{{refundData.pay.payDate}}</span>
        </el-col>
        <el-col :span="4" class="_item-name" v-if="refundData.pay && refundData.pay.errorStatus == 1" style="color:red;fontWeight:600">支付异常原因</el-col>
        <el-col :span="20" class="_item-value" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">
          <span :title="refundData.pay.errorReason" >{{refundData.pay.errorReason}}</span>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
         <el-button
            type="primary"
            v-if="applyData.applyStatus == '1' && recall"
            @click="recall(applyData)"
          >撤回</el-button>
          <el-button
            type="primary"
            v-if="applyData.applyStatus == '3' && reapplyList.includes(applyData.applyType)"
            @click="reapply(applyData)"
          >重申</el-button>
      </span>
    </el-dialog>
    <detailApplication :taskId="taskId" :showCommon="showCommon" :showApply="showApply" :showApply2="showApply2" :detailVisible="detailVisible" @close="detailApplicationClose" @update="updateApplication"></detailApplication>
  </div>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file'
import api from '@/api/vip.js'
import detailApplication from '../../vip/mentee_file_mentor/detail.vue'
export default {
  name: 'recommend',
  components: { detailApplication },
  props: {
    applyData: {
      type: Object
    },
    recommendDetailVisible: {
      type: Boolean,
      default: false
    },
    recall: Function,
    reapply: Function,
    reapplyList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        approverid: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      },
      approval: '',
      detailVisible: false,
      taskId: '',
      showCommon: true,
      showApply: false,
      showApply2: false,
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      interviewStatus: false
    }
  },
  watch: {
    recommendDetailVisible: function (newData, oldData) {
      if (newData) {
        api.getApplyDetailByApplyId(this.applyData.applyId).then((res) => {
          console.log('applyData详情 yx***', this.applyData, res.data.apply.content)
          this.refundData = {
            pay: res.data.pay,
            apply: res.data.apply,
            content: res.data.apply.content ? JSON.parse(res.data.apply.content) : '',
            copyTo: res.data.copyTo,
            approval: res.data.approval
          }
          this.approval = ''
          res.data.approval.forEach((v) => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
          })
          this.copyTo = ''
          res.data.copyTo.forEach((v) => {
            this.copyTo += v.copyToName + '; '
          })
          console.log('详情数据yxdetail *****', this.refundData)
          if (this.refundData && this.refundData.content && this.refundData.content.info && this.refundData.content.info.intervieweeArr && this.refundData.content.info.intervieweeArr.length > 0) {
            this.interviewStatus = true
          } else {
            this.interviewStatus = false
          }
        })
      }
    }
  },
  mounted () {},
  methods: {
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.$emit('close')
      this.interviewStatus = false
      this.refundData = {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      }
    },
    download (val) {
      downloadFun(val)
    },
    downloadD (val) {
      downloadFunD(val, (url) => {
        window.open(url)
      })
    },
    detailPay (data) {
      this.taskId = data
      this.showApply = false
      this.showApply2 = false
      this.detailVisible = true
    },
    detailApplicationClose () {
      this.detailVisible = false
    },
    updateApplication () {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
