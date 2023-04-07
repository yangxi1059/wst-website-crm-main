<!--
 * @Author: 库建华
 * @Date: 2019-09-02 15:39:35
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-27 14:31:12
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'退款出纳'"
      :visible.sync="signRefundCashierVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-card class="mb20">
        <el-row class="mb10">
          <el-col :span="3" class="_item-name">申请人</el-col>
          <el-col :span="5" class="_item-value">{{refundData.apply.createByName}}</el-col>
          <el-col :span="3" class="_item-name">申请状态</el-col>
          <el-col :span="5" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
          <el-col :span="3" class="_item-name">申请时间</el-col>
          <el-col :span="5" class="_item-value">{{refundData.apply.createTime}}</el-col>
        </el-row>

        <el-row class="mb10" v-if="refundData.content">
          <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
            <el-col style="flex:20" class="_item-value">
              <span :title="item.value">{{item.value || '无'}}</span>
            </el-col>
          </div>
        </el-row>
        <el-row class="mb10" v-if="refundData.content">
          <span v-for="(item,i) in refundData.content.file" :key="i">
            <el-col :span="3" class="_item-name">凭证 {{++i}}</el-col>
            <el-col :span="5" class="_item-value">
              <el-button @click="download(item.url)" size="mini">查看</el-button>
            </el-col>
          </span>
        </el-row>
        <el-row class="mb10">
          <el-col :span="3" class="_item-name">退款金额</el-col>
          <el-col :span="20" class="_item-value">{{totalRefund}}</el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="3" class="_item-name">支付账户</el-col>
          <el-col :span="20" class="_item-value">{{account}}</el-col>
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
        </el-row>
      </el-card>
      <el-form
        :inline="true"
        size="mini"
        :model="submitData"
        :rules="rules"
        ref="submitData"
        label-width="160px"
        v-if="!refundData.pay"
      >
        <el-form-item label="出账账户:" prop="paymentAccount">
          <el-select :style="{width:'200px'}" v-model="submitData.paymentAccount">
            <el-option
              v-for="(item) in payment_account"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款货币类型:" prop="payType">
          <el-select :style="{width:'200px'}" v-model="submitData.payType">
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际付款金额:" prop="payAmount">
          <el-input :style="{width:'200px'}" size="mini" v-model="submitData.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="submitData.payDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手续费:">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              更新实际付款金额自动计算手续费，更新手续费不影响付款金额
              <br />两者货币类型保持一致
            </div>
            <el-input :style="{width:'200px'}" size="mini" v-model="submitData.commissionAmount"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="手续费说明:">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="submitData.commissionFor"
            :maxlength="200"
            placeholder="200字以内"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付备注:" prop="payRemark">
          <el-input
            :style="{width:'600px'}"
            type="textarea"
            size="mini"
            v-model="submitData.payRemark"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付凭证:">
          <el-button
            type="text"
            @click="download(submitData.payVoucher)"
            icon="el-icon-download"
            v-if="submitData.payVoucher"
          >{{'上传时间：'+submitData.payVoucher.split('/').splice(-2).join('; 文件名：')}}</el-button>
          <upload ref="upload" @callbackfile="callbackfile" @upLoadF="upLoadF">
            <el-button type="text" icon="el-icon-upload">选择文件</el-button>
          </upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="!refundData.pay">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">{{!this.payData.payId ? "提 交" : "更 新"}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/components/upload'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'

export default {
  components: { upload },
  name: 'brokerage',
  mixins: [mixins],
  props: {
    payData: {
      type: Object
    },
    signRefundCashierVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      submitData: {
        applyId: null,
        paymentAccount: null,
        payAmount: null,
        payType: 'cny',
        payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0',
        commissionAmount: 0,
        commissionFor: ''
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      },
      approval: '',
      copyTo: '',
      account: '',
      totalRefund: '',
      payment_account: [],
      bill_currency_type: [],
      applyAmount: 0,
      applyAmountType: 'cny',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝']
    }
  },
  watch: {
    signRefundCashierVisible: function (newData, oldData) {
      if (newData) {
        console.log('payData详情', this.payData)
        this.Topage()
        this.pageInit()
        // 付款日期，默认今天
        this.submitData.payDate = new Date()
      }
    },
    payAmount: function (val) {
      if (this.submitData.payType == this.applyAmountType) {
        this.submitData.commissionAmount = val - this.applyAmount
      } else if (this.submitData.payType == 'usd') {
        this.submitData.commissionAmount =
          Math.round(
            (val -
              this.applyAmount / this.refundData.content.info.exchangeRate) *
              100
          ) / 100
      } else if (this.submitData.payType == 'cny') {
        this.submitData.commissionAmount =
          Math.round(
            (val -
              this.applyAmount * this.refundData.content.info.exchangeRate) *
              100
          ) / 100
      }
    },
    payAmountType: function (val) {
      if (val == this.applyAmountType) {
        this.submitData.payAmount = this.applyAmount
        this.submitData.commissionAmount = 0
      } else if (val == 'cny') {
        this.submitData.payAmount =
          Math.round(
            this.applyAmount * this.refundData.content.info.exchangeRate * 100
          ) / 100
        this.submitData.commissionAmount = 0
      } else if (val == 'usd') {
        this.submitData.payAmount =
          Math.round(
            (this.applyAmount / this.refundData.content.info.exchangeRate) * 100
          ) / 100
        this.submitData.commissionAmount = 0
      } else {
        this.$message('该货币不支持自动计算')
        this.submitData.payAmount = 0
        this.submitData.commissionAmount = 0
      }
    }
  },
  computed: {
    payAmount: function () {
      return this.submitData.payAmount
    },
    payAmountType: function () {
      return this.submitData.payType
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.payment_account = await this.getDictionary('payment_account')
    },
    Topage () {
      api.getApplyDetailByApplyId(this.payData.applyId).then(res => {
        console.log('详情数据', res)
        this.refundData = {
          pay: res.data.pay,
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval
        }
        this.account = this.refundData.content.info.account
        this.totalRefund =
          this.refundData.content.info.revenueType +
          this.refundData.content.info.totalRefund
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
        this.submitData.payAmount = this.applyAmount = this.refundData.content.info.fundWage
        this.submitData.payType = this.applyAmountType = this.refundData.content.info.fundType
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
      // this.$refs.brokerageData.resetFields();
      this.$emit('close')
      this.submitData = {
        payId: undefined,
        applyId: null,
        paymentAccount: null,
        payAmount: null,
        payAmountCny: null,
        payType: 'cny',
        payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0',
        commissionAmount: 0,
        commissionFor: ''
      }
    },
    // 确认
    submit () {
      this.$refs.submitData.validate(valid => {
        if (!valid) return
        const applyId = this.payData.applyId
        this.submitData.applyId = this.payData.applyId
        this.submitData.payAcc = this.account
        const data = {}
        data.addList = [this.submitData]
        // if (!this.file && !this.submitData.payVoucher) {
        //   this.$message({
        //     message: "凭证必传",
        //     type: "error"
        //   });
        //   return;
        // }
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        if (!this.file) {
          console.log(data)
          api.setApplyPay(data).then(res => {
            console.log('支付导师酬金', res)
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$emit('submit')
            this.$loading().close()
            this.handleClose()
          })
        } else {
          uploadFunBySys(
            this.file,
            `voucher/sign_refund_cashier${applyId}`,
            url => {
              console.log(url)
              data.addList[0].payVoucher = url
              this.$refs.upload.clearFiles()
              this.file = null
              console.log(data)
              api.setApplyPay(data).then(res => {
                console.log('支付导师酬金', res)
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$emit('submit')
                this.$loading().close()
                this.handleClose()
              })
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
