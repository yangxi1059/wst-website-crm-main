<!--
 * @Author: 库建华
 * @Date: 2019-08-14 20:47:46
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 11:02:19
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'实习单位出纳查看'"
      :visible.sync="mentorPaymentExtraVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-card class="mb20">
        <el-row class="mb10">
          <el-col :span="4" class="_item-name">申请人</el-col>
          <el-col :span="4" class="_item-value">{{refundData.apply.createByName}}</el-col>
          <el-col :span="4" class="_item-name">申请状态</el-col>
          <el-col :span="4" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
          <el-col :span="4" class="_item-name">申请时间</el-col>
          <el-col :span="4" class="_item-value">{{refundData.apply.createTime}}</el-col>
        </el-row>
        <el-row class="mb10" v-if="refundData.content">
          <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
            <el-col style="flex:20" class="_item-value">
              <span :title="item.value">{{item.value || '无'}}</span>
            </el-col>
          </div>
        </el-row>
        <el-row class="mb10">
          <el-col :span="4" class="_item-name">合同</el-col>
          <el-col :span="20" class="_item-value">
            <div class="mb10" v-for="item in refundData.contractList" :key="item.pkId">
              <el-button size="mini" @click="download(item.contractPath)">{{item.contractName}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb10">
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
          <el-col :span="4" class="_item-name">实际支付汇率</el-col>
          <el-col :span="4" class="_item-value">
            <span
              :title="refundData.pay.payRate"
            >{{refundData.pay.payRate}}</span>
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
          <el-col :span="4" class="_item-name">支付日期</el-col>
          <el-col :span="4" class="_item-value">
            <span :title="refundData.pay.payDate">{{refundData.pay.payDate}}</span>
          </el-col>
          <span v-if="refundData.pay.payVoucher">
            <el-col :span="4" class="_item-name">支付凭证</el-col>
            <el-col :span="4" class="_item-value">
              <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
            </el-col>
          </span>
          <br />
          <el-col :span="4" class="_item-name">支付备注</el-col>
          <el-col :span="14" class="_item-value">
            <span :title="refundData.pay.payRemark">{{refundData.pay.payRemark}}</span>
          </el-col>
        </el-row>

        <el-row class="mb10">
          <el-col :span="4" class="_item-name" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">支付异常原因</el-col>
          <el-col :span="20" class="_item-value" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">{{refundData.pay.errorReason}}</el-col>
        </el-row>

      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          v-if="refundData.pay"
          @click="check"
        >{{this.payData.recordStatus == '0' ? '确认记录':'已记录'}}</el-button>

        <el-button type="danger" v-if="refundData.pay && refundData.apply.applyStatus != 7" @click="errorBtn">支付异常</el-button>
      </span>
    </el-dialog>

    <errorApply :errorDetailVisible="errorDetailVisible" :applyId="refundData.apply.applyId" :payId="payId" @close="errorApplyClose" @submit="errorApplysubmit" />

  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import errorApply from '../components/error_apply.vue'

import api from '@/api/vip.js'
export default {
  components: { errorApply },
  name: 'brokerage',
  props: {
    payData: {
      type: Object
    },
    mentorPaymentExtraVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      payId: '',
      errorDetailVisible: false,
      widths: '230px',
      rules: {
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        contractList: [],
        approval: []
      },
      approval: '',
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝']
    }
  },
  watch: {
    mentorPaymentExtraVisible: function (newData) {
      if (newData) {
        if (this.payData.payId) {
          this.payId = this.payData.payId
        }
        console.log('payData详情', this.payData)
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    Topage () {
      api.getApplyDetailByApplyId(this.payData.applyId).then(res => {
        console.log('详情数据', res)

        this.refundData = {
          pay: res.data.pay,
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo || [],
          contractList: res.data.contractList || [],
          approval: res.data.approval || []
        }
        this.approval = ''
        res.data.approval.forEach(v => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime ||
            ''}</p>`
        })
        this.copyTo = ''
        res.data.copyTo.forEach(v => {
          this.copyTo += v.copyToName + '; '
        })
      })
    },
    download (val) {
      downloadFun(val)
    },
    upLoadF (v) {
      console.log('upLoadF', v)
      this.file = v
    },
    callbackfile (val) {
      console.log('callbackfile', val)
      this.file = val
    },
    // 关闭
    handleClose () {
      this.payId = ''
      this.$emit('close')
    },
    // 确认记录
    check () {
      api
        .recordMentorPayment(this.brokerageSubmitData.applyId)
        .then(() => {
          this.$message({
            type: 'success',
            message: '标记成功'
          })
          this.$emit('submit')
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '标记失败'
          })
        })
    },
    errorBtn () {
      this.errorDetailVisible = true
    },
    errorApplyClose () {
      this.errorDetailVisible = false
    },
    errorApplysubmit () {
      this.$emit('submit')
      this.errorDetailVisible = false
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
