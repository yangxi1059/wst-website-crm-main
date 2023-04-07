<!--
 * @Author: 库建华
 * @Date: 2019-08-14 20:39:46
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-17 15:08:50
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <!-- 导师酬金 -->
    <el-dialog :close-on-click-modal="false"
      :title="'审核'"
      :visible.sync="internshipPayVisible"
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
      <span v-if="refundData.content">
        <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
          <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
          <el-col style="flex:20" class="_item-value">
            <span :title="item.value">{{item.value || '无'}}</span>
          </el-col>
        </div>
      </span>
      <el-row class="mb10">
        <el-col :span="4" class="_item-name" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">支付异常原因</el-col>
        <el-col :span="20" class="_item-value" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">{{refundData.pay.errorReason}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="refundData.content">
        <el-col :span="4" class="_item-name">文件</el-col>
        <el-col :span="20" class="_item-value">
          <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
            <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="24" class="_item-name">合同</el-col>
        <!-- <el-col :span="20"> -->
        <div class="mb10 ml160" v-for="item in contractList" :key="item.pkId">
          <el-button size="mini" @click="download(item.contractPath)">{{item.contractName}}</el-button>
          上传时间:{{item.createTime}} [{{item.contractTypeName}}]
        </div>
        <!-- </el-col> -->
      </el-row>
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="4" class="_item-name">抄送人</el-col>
        <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
      </el-row>

      <el-row class="mb10" v-if="refundData.pay && refundData.pay.payVoucher">
        <el-col :span="4" class="_item-name">支付凭证</el-col>
        <el-col :span="4" class="_item-value">
          <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
        </el-col>
        <el-col :span="4" class="_item-name">支付金额</el-col>
        <el-col :span="4" class="_item-value">
          <span
            :title="refundData.pay.payAmount"
          >{{refundData.pay.payType + refundData.pay.payAmount}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">支付备注</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.payRemark">{{refundData.pay.payRemark}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">支付时间</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.payDate">{{refundData.pay.payDate}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="_item-name">历史支付记录：</el-col>
      </el-row>
      <el-table v-if="offerPaymentHistory.length > 0" :data="offerPaymentHistory" style="width: 100%">
        <el-table-column prop="internshipDesc" label="实习单位"></el-table-column>
        <el-table-column prop="internshipName" label="实习名称"></el-table-column>
        <el-table-column prop="internshipLocationName" label="实习地址"></el-table-column>
        <el-table-column prop="internshipTimeName" label="实习时长"></el-table-column>
        <el-table-column prop="offerReceiveDate" label="收到实习Offer日期"></el-table-column>
        <el-table-column prop="payDate" label="付款日期"></el-table-column>
        <el-table-column prop="payAmount" label="付款金额"></el-table-column>
        <el-table-column prop="payRemark" label="付款备注" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
        <template v-if="refundData.apply.applyStatus == 4">
          <!-- <el-button type="primary" @click="submit">付 款</el-button> -->
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import util from '@/libs/util'

import api from '@/api/vip.js'
export default {
  name: 'brokerageAudit',
  props: {
    applyData: {
      type: Object
    },
    internshipPayVisible: {
      type: Boolean,
      default: false
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
      contractList: [{}],
      approval: '',
      copyTo: '',
      account: '',
      totalRefund: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      offerPaymentHistory: []
    }
  },
  watch: {
    internshipPayVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情yxhfguwh4444******', this.applyData)
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    Topage () {
      this.$loading()
      api
        .getApplyDetailByApplyId(this.applyData.applyId)
        .then(res => {
          console.info('详情数据', res);
          (this.contractList = res.data.contractList || [{}]),
          (this.refundData = {
            pay: res.data.pay,
            apply: res.data.apply,
            content: JSON.parse(res.data.apply.content),
            copyTo: res.data.copyTo || [],
            approval: res.data.approval
          })
          if (res.data.offerPaymentHistory) {
            this.offerPaymentHistory = res.data.offerPaymentHistory
          }
          console.log(this.refundData.content.info, 21312312312321)
          // this.account = this.refundData.content.info.payAccount;
          // this.totalRefund =
          //   this.refundData.content.info.expenditureType +
          //   this.refundData.content.info.expenditureAmount;
          this.approval = ''
          // res.data.approval.forEach(v => {
          //   this.approval += v.approverName + "; ";
          // });
          let point = true
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
            if (point && v.approveStatus == 0) {
              if (v.approverId === util.sessions.get('userInfo').userId || v.approverId.indexOf(util.sessions.get('userInfo').userId) != '-1') {
                this.canSubmit = true
              }
              point = false
            }
          })
          this.copyTo = ''
          if (res.data.copyTo && res.data.copyTo.length > 0) {
            res.data.copyTo.forEach(v => {
              this.copyTo += v.copyToName + '; '
            })
          }
          this.$loading().close()
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: `${err}_${this.applyData.applyId || ''}`
          })
        })
    },
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.$emit('close')
      this.refundData = {
        apply: {},
        copyTo: [],
        approval: [],
        pay: {},
        content: {}
      }
      this.contractList = [{}]
      this.canSubmit = false
    },
    download (val) {
      downloadFun(val)
    },
    // 确认
    submit () {
      this.$confirm('是否确认通过此审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          applyId: this.refundData.apply.applyId,
          approveStatus: '1'
        }
        console.log(data)
        api
          .setAuditRefund(data)
          .then(res => {
            console.log('审核bd申请', res)
            this.$message({
              message: '审核通过',
              type: 'success'
            })
            // if (res.data == "待支付") {
            //   this.$emit("submitToPay");
            // } else {
            //   }
            this.$emit('submit')
            this.$loading().close()
            this.handleClose()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '审核失败'
            })
            this.$loading().close()
            this.$emit('submit')
            this.handleClose()
          })
      })
    },
    // 驳回
    reject () {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '驳回理由字数需在1~200个字符'
      })
        .then(({ value }) => {
          this.$loading({ background: 'rgba(0,0,0,.5)' })
          // let p = {
          //     label: "驳回理由",
          //     value: value
          //   }
          //   this.refundData.content.text.push(p)
          const data = {
            applyId: this.refundData.apply.applyId,
            // text: this.refundData.content.text,
            approveStatus: '2',
            msg: value
          }
          console.log(data, this.refundData.content.text)
          api
            .setAuditRefund(data)
            .then(res => {
              console.log('审核导师酬金申请', res)
              this.$message({
                message: '驳回成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.handleClose()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '驳回失败'
              })
              this.$loading().close()
              this.$emit('submit')
              this.handleClose()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消驳回'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.ml160 {
  margin-left: 160px;
}
</style>
