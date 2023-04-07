<!--
 * @Author: 库建华
 * @Date: 2019-08-14 20:47:46
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-28 11:45:06
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'导师佣金出纳'"
      :visible.sync="mentorPaymentExtraVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-card class="mb20">
        <el-row class="mb10">
          <el-col :span="4" class="_item-name" v-if="refundData.apply.createByName">申请人</el-col>
          <el-col :span="4" class="_item-value" v-if="refundData.apply.createByName">{{refundData.apply.createByName}}</el-col>
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
        <el-col :span="4" class="_item-name">当前系统汇率</el-col>
        <el-col :span="20" class="_item-value">{{rate}}</el-col>
        <!-- <el-col :span="4" class="_item-name">对应人民币金额</el-col>
        <el-col :span="20" class="_item-value">{{refundData.mentorPaymentExtra.fundWageCny}}</el-col> -->
      </el-row>
        <el-row class="mb10" v-if="approval">
          <el-col :span="4" class="_item-name">审核人</el-col>
          <el-col :span="20" class="_item-value">{{approval}}</el-col>
        </el-row>
        <el-row class="mb10" v-if="copyTo">
          <el-col :span="4" class="_item-name">抄送人</el-col>
          <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
        </el-row>
        <el-row class="mb10" v-if="refundData.pay">
          <span v-if="refundData.pay.payVoucher">
            <el-col :span="4" class="_item-name">支付凭证</el-col>
            <el-col :span="4" class="_item-value">
              <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
            </el-col>
          </span>
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

        <el-row class="mb10">
          <el-col :span="4" class="_item-name" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">支付异常原因</el-col>
          <el-col :span="20" class="_item-value" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">{{refundData.pay.errorReason}}</el-col>
        </el-row>

      </el-card>
      <el-form
        :inline="true"
        size="mini"
        :model="brokerageSubmitData"
        :rules="rules"
        ref="brokerageSubmitData"
        label-width="160px"
        v-if="!refundData.pay"
      >
        <el-form-item label="汇率:" prop="payRate">
          <el-input
            :disabled="true"
            :style="{width:'200px'}"
            size="mini"
            v-model="brokerageSubmitData.payRate"
          ></el-input>
        </el-form-item>
        <el-form-item label="付款货币类型:" prop="payType">
          <el-select :style="{width:'200px'}" v-model="brokerageSubmitData.payType">
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际付款金额:" prop="payAmount">
          <el-input :style="{width:'200px'}" size="mini" v-model="brokerageSubmitData.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="brokerageSubmitData.payDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="对应人民币金额:" v-if="brokerageSubmitData.payType == 'usd'">
          <el-input :style="{width:'200px'}" size="mini" v-model="brokerageSubmitData.payAmountCny"></el-input>
        </el-form-item>-->
        <el-form-item label="支付备注:" prop="payRemark">
          <el-input
            :style="{width:'600px'}"
            type="textarea"
            size="mini"
            v-model="brokerageSubmitData.payRemark"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付凭证:">
          <el-button
            type="text"
            @click="download(brokerageSubmitData.payVoucher)"
            icon="el-icon-download"
            v-if="brokerageSubmitData.payVoucher"
          >{{'上传时间：'+brokerageSubmitData.payVoucher.split('/').splice(-2).join('; 文件名：')}}</el-button>
          <upload ref="upload" @callbackfile="callbackfile" @upLoadF="upLoadF">
            <el-button type="text" icon="el-icon-upload">选择文件</el-button>
          </upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <!-- <el-button
          v-if="!refundData.pay"
          type="primary"
          @click="submit"
        >{{"提 交"}}</el-button>-->
        <el-button
          @click="check"
          v-if="refundData.pay"
        >{{this.refundData.mentorPaymentExtra.recordStatus == '0' ? '确认记录':'已记录'}}</el-button>

        <el-button type="danger" v-if="refundData.pay && refundData.apply.applyStatus != 7" @click="errorBtn">支付异常</el-button>

      </span>
    </el-dialog>
    <errorApply :errorDetailVisible="errorDetailVisible" :applyId="refundData.apply.applyId" :payId="payId" @close="errorApplyClose" @submit="errorApplysubmit" />
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import upload from '@/components/upload'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import errorApply from '../components/error_apply.vue'
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'

export default {
  components: { upload, errorApply },
  name: 'brokerage',
  mixins: [mixins],
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
      errorDetailVisible: false,
      widths: '230px',
      rules: {
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      payId: '',
      brokerageData: {
        brokeragement: {},
        apply: {},
        pay: {},
        approval: []
      },
      rejectMsg: '',
      brokerageSubmitData: {
        applyId: null,
        payAmount: null,
        payType: null,
        payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0'
      },
      refundData: {
        apply: {},
        mentorPaymentExtra: {},
        content: {},
        copyTo: [],
        approval: []
      },
      approval: '',
      copyTo: '',
      account: '',
      totalRefund: '',
      bill_currency_type: [],
      rate: null
    }
  },
  watch: {
    mentorPaymentExtraVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
        if (this.payData.payId) {
          this.payId = this.payData.payId
          this.getPayDetailByPayId()
        }
        apiDic.getRate({ currencyType: 'usd' }).then(res => {
          console.log(res)
          this.brokerageSubmitData.payRate = res.data.exchangeRate
          this.rate = res.data.exchangeRate
        })
        this.pageInit()
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    Topage () {
      api.getApplyDetailByApplyId(this.payData.applyId).then(res => {
        this.refundData = {
          pay: res.data.pay,
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          mentorPaymentExtra: res.data.mentorPaymentExtra,
          approval: res.data.approval
        }
        console.log('详情数据yx***********', this.refundData)
        if (this.refundData.mentorPaymentExtra.fundType == 'usd') {
          this.refundData.mentorPaymentExtra.fundWageCny =
            Math.round(this.refundData.mentorPaymentExtra.fundWage * this.rate * 100
            ) / 100
        } else {
          this.refundData.mentorPaymentExtra.fundWageCny = this.refundData.mentorPaymentExtra.fundWage
        }
        this.account = this.refundData.content.info.payAccount
        this.totalRefund =
          this.refundData.content.info.expenditureType +
          this.refundData.content.info.expenditureAmount
        this.approval = ''
        res.data.approval.forEach(v => {
          this.approval += v.approverName + '; '
        })
        this.copyTo = ''
        res.data.copyTo.forEach(v => {
          this.copyTo += v.copyToName + '; '
        })
      })
    },
    getPayDetailByPayId () {
      api.getPayDetailByPayId(this.payData.payId).then(res => {
        console.log(res)
        this.brokerageSubmitData = res.data
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
      this.payId = ''
      this.$emit('close')
      this.brokerageData = {
        brokeragement: {},
        apply: {},
        approval: []
      }
      this.brokerageSubmitData = {
        payId: undefined,
        applyId: null,
        payAmount: null,
        payAmountCny: null,
        payType: null,
        payRate: this.brokerageSubmitData.payRate,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0'
      }
    },
    // 确认
    submit () {
      this.$refs.brokerageSubmitData.validate(valid => {
        if (!valid) return
        const applyId = this.payData.applyId
        this.brokerageSubmitData.applyId = this.payData.applyId
        this.brokerageSubmitData.payAcc = this.account
        const data = {}
        if (!this.brokerageSubmitData.payId) {
          data.addList = [this.brokerageSubmitData]
        } else {
          data.uptList = [this.brokerageSubmitData]
        }
        // if (!this.file && !this.brokerageSubmitData.payVoucher) {
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
          uploadFunBySys(this.file, 'voucher/db_cashier', url => {
            console.log(url)
            if (!data.addList) {
              data.uptList[0].payVoucher = url
            } else {
              data.addList[0].payVoucher = url
            }
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
          })
        }
      })
    },
    // 确认记录
    check () {
      api
        .recordMentorPayment(this.refundData.mentorPaymentExtra.applyId)
        .then(res => {
          this.$message({
            type: 'success',
            message: '标记成功'
          })
          this.$emit('submit')
        })
        .catch(err => {
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
