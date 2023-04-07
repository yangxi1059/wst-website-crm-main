/* eslint-disable space-before-blocks */
<!--
 * @Author: 库建华
 * @Date: 2019-07-02 09:27:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-30 10:28:56
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :visible.sync="mentorPayListNewVisible"
      width="1470px"
      :before-close="handleClose"
    >
     <div v-loading="loading">
      <pay-status :flags="payStatusFlags" />
      <div class="mentor_pay_list">
        <div>
          <div style="display:flex;justify-content:space-between">
            <el-tag type="warning" size="medium">请选择支付记录</el-tag>
            <el-button type="primary" class="mb10" size="mini" v-if="listClick.length < mentorPayDataList.length" @click="clickAll">一键全选</el-button>
            <el-button type="danger" class="mb10" size="mini" v-else @click="clickNone">一键取消</el-button>
          </div>
          <div class="mentor_pay_listOverflow">
            <template v-for="(mentorPayData,i) in mentorPayDataList">
              <div class="box" :key="i" @click="chooseApply(mentorPayData)">
                <el-card
                  class="mb20 relative"
                  :class="{'red-border':mentorPayData.choose}"
                  v-if="mentorPayData"
                >
                  <el-form :inline="true" size="mini" label-width="120px">
                    <el-form-item label="申请类型:">
                      <p :style="{width:'200px'}">{{mentorPayData.applyTypeName}}
                        (<el-link @click.stop="applyDetail(mentorPayData)" type="primary">{{mentorPayData.applyId}}</el-link>)
                      </p>
                    </el-form-item>
                    <el-form-item label="申请详情:">
                      <p :style="{width:'200px'}">{{mentorPayData.applyDetail}}</p>
                    </el-form-item>
                    <el-form-item label="申请金额:">
                      <p :style="{width:'200px'}">{{mentorPayData.feeType}} - {{mentorPayData.feeAmount}}</p>
                    </el-form-item>
                    <el-form-item label="申请备注:">
                      <p :style="{width:'200px'}">{{mentorPayData.applyRemark}}</p>
                    </el-form-item>
                  </el-form>
                  <el-tag class="rateContent" type="info">
                    <p>汇率</p>
                    <p class="rate_flag">
                      <img class="rate_icon" :src="currencyList[mentorPayData.feeType]"> :
                      <img class="rate_icon" :src="currencyList[mentorPaySubmitData.payType]">
                    </p>
                    <p class="rate_text">1 : {{mentorPayData.payRate}}</p>
                  </el-tag>
                </el-card>
              </div>
            </template>
            <div v-if="listClick.length > 0" style="text-align:center"> 已选中【{{listClick.length}}】条申请，合计费用【CNY-<span class="color_red">{{cnyNum}}</span>】 USD-<span  class="color_red">{{usdNum}}</span>】</div>
          </div>
        </div>
        <div>
          <div class="box_sizing">
            <el-descriptions  title="收款账户" size="mini" direction="vertical" :column="1" border>
              <el-descriptions-item label="账户类型" v-if="paymentInitData.paymentTypeName">{{paymentInitData.paymentTypeName}}</el-descriptions-item>
              <el-descriptions-item label="账号ID" v-if="paymentInitData.payAcc">{{paymentInitData.payAcc}}</el-descriptions-item>
              <el-descriptions-item label="银行名" v-if="paymentInitData.bankName">{{paymentInitData.bankName}}</el-descriptions-item>
              <el-descriptions-item label="银行地址" v-if="paymentInitData.bankAddress">{{paymentInitData.bankAddress}}</el-descriptions-item>
              <el-descriptions-item label="Full Name" v-if="paymentInitData.realName">{{paymentInitData.realName}}</el-descriptions-item>
              <el-descriptions-item label="ID Card" v-if="paymentInitData.idCard">{{paymentInitData.idCard}}</el-descriptions-item>
              <el-descriptions-item label="Routing Number" v-if="paymentInitData.routingNumber">{{paymentInitData.routingNumber}}</el-descriptions-item>
              <el-descriptions-item label="Swift Code" v-if="paymentInitData.swiftCode">{{paymentInitData.swiftCode}}</el-descriptions-item>
              <el-descriptions-item label="Recipient Address" v-if="paymentInitData.recipientAddress">{{paymentInitData.recipientAddress}}</el-descriptions-item>
              <el-descriptions-item label="ZIP" v-if="paymentInitData.zip">{{paymentInitData.zip}}</el-descriptions-item>
              <el-descriptions-item label="Remark" v-if="paymentInitData.mentorPaymentRemark">{{paymentInitData.mentorPaymentRemark}}</el-descriptions-item>
            </el-descriptions>
          </div>
          <el-form
            v-if="!payData.showDetail"
            :inline="true"
            size="mini"
            :model="mentorPaySubmitData"
            :rules="rules"
            ref="mentorPaySubmitData"
            label-width="120px"
          >

            <el-form-item label="导师账户:" v-if="payData.showError" prop="mentorPaymentPayPkId">
              <el-select :style="{width:'400px'}" v-model="mentorPaySubmitData.mentorPaymentPayPkId">
                <el-option
                  v-for="(item) in mentorPaymentPayList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="付款账户:" prop="paymentAccount">
              <el-select :style="{width:'400px'}" filterable v-model="mentorPaySubmitData.paymentAccount">
                <el-option
                  v-for="(item) in payment_account"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款货币类型:" prop="payType">
              <el-select :style="{width:'400px'}" v-model="mentorPaySubmitData.payType" @change="getRate">
                <!-- :disabled="true" -->
                <el-option
                  v-for="(item) in bill_currency_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请总金额:" prop="payAmount">
              <!-- :disabled="true" -->
              <el-input :style="{width:'400px'}" size="mini" v-model="mentorPaySubmitData.payAmount"></el-input>
            </el-form-item>
            <el-form-item label="支付日期:" prop="payDate">
              <el-date-picker
                :style="{width:'400px'}"
                value-format="yyyy-MM-dd"
                v-model="mentorPaySubmitData.payDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="手续费:" prop="commissionAmount">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  实际付款金额应包含申请金额加手续费，请在此输入对应手续费
                  <br />两者货币类型保持一致
                </div>
                <el-input
                  :style="{width:'400px'}"
                  size="mini"
                  v-model="mentorPaySubmitData.commissionAmount"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="手续费说明:">
              <el-input
                :style="{width:'400px'}"
                size="mini"
                v-model="mentorPaySubmitData.commissionFor"
                :maxlength="200"
                placeholder="200字以内"
              ></el-input>
            </el-form-item>
            <el-form-item label="支付备注:" prop>
              <el-input
                :style="{width:'400px'}"
                type="textarea"
                size="mini"
                v-model="mentorPaySubmitData.payRemark"
              ></el-input>
            </el-form-item>
            <el-form-item label="支付凭证:">
              <el-button
                type="text"
                @click="download(mentorPaySubmitData.payVoucher)"
                icon="el-icon-download"
                v-if="mentorPaySubmitData.payVoucher"
              >{{'文件名：'+mentorPaySubmitData.payVoucher.split('/').splice(-1)[0]}}</el-button>
              <upload ref="upload" @callbackfile="callbackfile" @upLoadF="upLoadF">
                <el-button type="text" icon="el-icon-upload">选择文件</el-button>
              </upload>
              <el-progress :text-inside="true" :style="{width:'400px'}" :stroke-width="24" :percentage="progress" color="customColors"></el-progress>
            </el-form-item>
          </el-form>
        </div>
      </div>
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"  v-if="!payData.showDetail" @click="submit">{{!this.payData.payId ? "提 交" : "更 新"}}</el-button>
      </span>
    </el-dialog>
    <applyDetailBlock :mentorPayVisible="mentorPayVisible" :applyData="applyData" @close="closeDetail" />
    <recommend-detail
      :recommendDetailVisible="recommendDetailVisible"
      :applyData="applyData"
      @close="closeDetail"
    />
  </div>
</template>

<script>
import upload from '@/components/upload'
import applyDetailBlock from '../components/mentor_pay_apply.vue'
import recommendDetail from '../recommend/detail.vue'
import { uploadFun, downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'

export default {
  components: { upload, applyDetailBlock, recommendDetail },
  name: 'mentorPay',
  mixins: [mixins],
  props: {
    payData: {
      type: Object
    },
    mentorPayListNewVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      widths: '230px',
      listClick: [],
      mentorPayVisible: false,
      recommendDetailVisible: false,
      applyData: {},
      usdNum: 0,
      cnyNum: 0,
      rules: {
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorPaymentPayPkId: [{ required: true, message: '必填', trigger: 'blur' }],
        commissionAmount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      mentorPaymentPayList: [],
      mentorPayDataList: [],
      approval: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      applyIdArr: [],
      rejectMsg: '',
      mentorPaySubmitData: {
        applyId: null,
        payAmount: null,
        payAmountCny: null,
        payType: 'cny',
        payRate: null,
        payAccType: null,
        payAcc: null,
        payDate: new Date(),
        payVoucher: null,
        paymentAccount: null,
        payRemark: null,
        commissionAmount: 0,
        commissionFor: ''
      },
      payment_account: [],
      paymentInitData: {},
      bill_currency_type: [],
      auto_note: '',
      progress: 0,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      payStatusFlags: '',
      currencyList: {
        cny: require('@/assets/img/currency_CN.png'),
        usd: require('@/assets/img/currency_US.png'),
        gbp: require('@/assets/img/currency_UK.png'),
        hkd: require('@/assets/img/currency_HK.png'),
        cad: require('@/assets/img/currency_CA.png'),
        sgd: require('@/assets/img/currency_SG.png'),
        aud: require('@/assets/img/currency_AU.png')
      }
    }
  },
  watch: {
    mentorPayListNewVisible: function (newData) {
      if (newData) {
        this.pageInit()
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.payment_account = await this.getDictionary('payment_account')
    },
    paymentInit (data) {
      console.log('payData详情', this.payData, data)
      if (data.accountId == this.payData.pkId) {
        this.payData.showError = false
      } else {
        this.payData.showError = true
      }
      let account = ''
      for (const item in data) {
        switch (item) {
          case 'paymentType': {
            account += '付款类型：' + data[item] + '  ;  '
            break
          }
          case 'payAcc': {
            account += ' 账户：' + data[item] + '  ;  '
            break
          }
          case 'bankName': {
            account += ' 银行：' + data[item] + '  ;  '
            break
          }
          case 'realName': {
            account += ' 收款人姓名：' + data[item] + '  ;  '
            break
          }
          case 'idCard': {
            account += ' 收款人身份证号：' + data[item] + '  ;  '
            break
          }
          case 'bankAddress': {
            account += ' Bank Address：' + data[item] + '  ;  '
            break
          }
          case 'zip': {
            account += ' ZIP：' + data[item] + '  ;  '
            break
          }
          case 'routingNumber': {
            account += ' Routing Number：' + data[item] + '  ;  '
            break
          }
          case 'swiftCode': {
            account += ' Swift Code：' + data[item] + '  ;  '
            break
          }
        }
      }
      let account2 = ''
      for (const item in this.payData) {
        switch (item) {
          case 'paymentType': {
            account2 += '付款类型：' + this.payData[item] + '  ;  '
            break
          }
          case 'payAcc': {
            account2 += ' 账户：' + this.payData[item] + '  ;  '
            break
          }
          case 'bankName': {
            account2 += ' 银行：' + this.payData[item] + '  ;  '
            break
          }
          case 'realName': {
            account2 += ' 收款人姓名：' + this.payData[item] + '  ;  '
            break
          }
          case 'idCard': {
            account2 += ' 收款人身份证号：' + this.payData[item] + '  ;  '
            break
          }
          case 'bankAddress': {
            account2 += ' Bank Address：' + this.payData[item] + '  ;  '
            break
          }
          case 'zip': {
            account2 += ' ZIP：' + this.payData[item] + '  ;  '
            break
          }
          case 'routingNumber': {
            account2 += ' Routing Number：' + this.payData[item] + '  ;  '
            break
          }
          case 'swiftCode': {
            account2 += ' Swift Code：' + this.payData[item] + '  ;  '
            break
          }
        }
      }
      this.payData.account = account
      data.account = account
      this.mentorPaymentPayList = [
        { itemName: account, itemValue: data.accountId },
        { itemName: account2, itemValue: this.payData.pkId }
      ]
      this.paymentInitData = data
      if (this.payData.applyIds) {
        this.payStatusFlags = this.payData.applyIds
      } else {
        this.payStatusFlags = this.payData.applyId
      }
    },
    closeDetail () {
      this.mentorPayVisible = false
      this.recommendDetailVisible = false
    },
    Topage () {
      this.listClick = []
      this.loading = true
      let data = ''
      if (this.payData.applyIds) {
        data = {
          accountId: this.payData.pkId,
          applyIdList: this.payData.applyIds.split(',')
        }
      } else {
        data = {
          accountId: this.payData.pkId,
          applyIdList: this.payData.applyId.split(',')
        }
      }
      api.getApplyListByApplyIdsNew(data).then(res => {
        this.paymentInit(res.data.paymentAccount)
        console.log('详情数据 位置apply_aduit/mentor_pay/pay_list.vue', res.data)
        res.data.applyArr.forEach(item => {
          if (item.feeType == 'usd') {
            item.paymentAmountUsd = item.feeAmount
            item.paymentAmountCny = 0
          } else {
            item.paymentAmountCny = item.feeAmount
            item.paymentAmountUsd = 0
          }
          item.compensationType = item.feeType
          item.fundType = item.feeType
          item.choose = false
        })
        this.mentorPayDataList = res.data.applyArr
        this.getRate()
        this.loading = false
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
      this.$emit('close')
      this.listClick = []
      this.mentorPaySubmitData = {
        payId: null,
        applyId: null,
        payAmount: null,
        payAmountCny: null,
        payType: 'cny',
        payRate: 0,
        rate: 0,
        payAccType: null,
        payAcc: null,
        payDate: new Date(),
        payVoucher: null,
        paymentAccount: this.mentorPaySubmitData.paymentAccount,
        payRemark: null,
        commissionAmount: 0,
        commissionFor: ''
      }
      this.progress = 0
      this.usdNum = 0
      this.cnyNum = 0
      this.payStatusFlags = ''
      this.applyIdArr = []
    },
    chooseApply (mentorPayData) {
      mentorPayData.choose = !mentorPayData.choose
      const list = this.mentorPayDataList.filter(v => v.choose)
      this.listClick = list
      console.log(list)
      this.applyIdArr = []
      this.mentorPaySubmitData.payAmount = 0
      this.auto_note = ''
      this.usdNum = 0
      this.cnyNum = 0
      list.forEach(v => {
        let payAmount = 0
        let payRate = 0
        // 此处计算只有cny或usd
        payAmount = v.compensationType == 'usd' ? v.paymentAmountUsd : v.paymentAmountCny
        payRate = v.payRate
        if (v.compensationType == 'usd') {
          this.usdNum += (v.paymentAmountUsd || 0)
        } else {
          this.cnyNum += (v.paymentAmountCny || 0)
          console.log(this.cnyNum, 222222222222222222222)
        }
        this.mentorPaySubmitData.payAmount += payAmount * payRate
        this.mentorPaySubmitData.payAmount =
          Math.round(this.mentorPaySubmitData.payAmount * 100) / 100
        // this.auto_note += v.mentorPayment
        //   ? ` 导师佣金：${v.menteeName}, [${v.lessonTimesIds}],${v.compensationType == 'cny' ? `￥${v.paymentAmountCny}` : `$${v.paymentAmountUsd}`};`
        //   : '导师薪资：' +
        //     v.fundType +
        //     v.fundWage +
        //     '; '
        this.applyIdArr.push({
          applyId: v.applyId,
          payRate: payRate,
          payType: this.mentorPaySubmitData.payType,
          payAmount: payAmount * payRate
        })
      })
    },
    applyDetail (data) {
      console.log(data)
      api.getApplyDetailByApplyId(data.applyId).then(res => {
        this.applyData = res.data
        this.applyData.applyStatus = res.data.apply.applyStatus
        this.applyData.applyType = res.data.apply.applyType
        this.applyData.applyId = res.data.apply.applyId
        if (res.data.apply.applyType == 'mentor_payment') {
          this.mentorPayVisible = true
        } else {
          this.recommendDetailVisible = true
        }
        console.log(res.data)
      })
    },
    clickNone () {
      this.mentorPayDataList.forEach(item => {
        item.choose = false
      })
      const list = this.mentorPayDataList.filter(v => v.choose)
      this.listClick = list
      console.log(list)
      this.applyIdArr = []
      this.mentorPaySubmitData.payAmount = 0
      this.auto_note = ''
      list.forEach(v => {
        let payAmount = 0
        let payRate = 0
        payAmount = v.compensationType == 'usd' ? v.paymentAmountUsd : v.paymentAmountCny
        payRate = v.payRate
        this.mentorPaySubmitData.payAmount += payAmount * payRate
        this.mentorPaySubmitData.payAmount =
          Math.round(this.mentorPaySubmitData.payAmount * 100) / 100
        // this.auto_note += v.mentorPayment
        //   ? ` 导师佣金：${v.menteeName}, [${v.lessonTimesIds}],${v.compensationType == 'cny' ? `￥${v.paymentAmountCny}` : `$${v.paymentAmountUsd}`};`
        //   : '导师薪资：' +
        //     v.fundType +
        //     v.fundWage +
        //     '; '
        this.applyIdArr.push({
          applyId: v.applyId,
          payRate: payRate,
          payType: this.mentorPaySubmitData.payType,
          payAmount: payAmount * payRate
        })
      })
    },
    clickAll () {
      this.mentorPayDataList.forEach(item => {
        item.choose = true
      })
      const list = this.mentorPayDataList.filter(v => v.choose)
      this.listClick = list
      console.log(list)
      this.applyIdArr = []
      this.mentorPaySubmitData.payAmount = 0
      this.auto_note = ''
      list.forEach(v => {
        let payAmount = 0
        let payRate = 0
        payAmount = v.compensationType == 'usd' ? v.paymentAmountUsd : v.paymentAmountCny
        payRate = v.payRate
        this.mentorPaySubmitData.payAmount += payAmount * payRate
        this.mentorPaySubmitData.payAmount =
          Math.round(this.mentorPaySubmitData.payAmount * 100) / 100
        if (v.compensationType == 'usd') {
          this.usdNum += (v.paymentAmountUsd || 0)
        } else {
          this.cnyNum += (v.paymentAmountCny || 0)
        }
        // this.auto_note += v.mentorPayment
        //   ? ` 导师佣金：${v.menteeName}, [${v.lessonTimesIds}],${v.compensationType == 'cny' ? `￥${v.paymentAmountCny}` : `$${v.paymentAmountUsd}`};`
        //   : '导师薪资：' +
        //     v.fundType +
        //     v.fundWage +
        //     '; '
        this.applyIdArr.push({
          applyId: v.applyId,
          payRate: payRate,
          payType: this.mentorPaySubmitData.payType,
          payAmount: payAmount * payRate
        })
      })
    },
    getRate () {
      this.mentorPayDataList.forEach(v => {
        let fromCurrency = ''
        const toCurrency = this.mentorPaySubmitData.payType
        fromCurrency = v.compensationType
        if (fromCurrency == toCurrency) {
          v.payRate = 1
          this.chooseApply({ choose: false })
          return
        }
        apiDic.getLatestSysRate({ fromCurrency: fromCurrency, toCurrency: toCurrency }).then((res) => {
          if (res.data) {
            v.payRate = res.data.rate
            this.chooseApply({ choose: false })
          } else {
            v.payRate = null
            this.$message({
              message: '无指定货币汇率',
              type: 'error'
            })
          }
        })
      })
    },
    // 确认
    submit () {
      this.mentorPaySubmitData.payRemark = ''
      this.mentorPaySubmitData.pkId = this.payData.pkId // 导师账户id
      this.$refs.mentorPaySubmitData.validate(valid => {
        if (!valid) return
        if (!this.file && this.payData.paymentType !== 'bank' && this.payData.paymentType !== 'alipay') {
          this.$message({
            message: '凭证必传',
            type: 'error'
          })
          return
        }
        const applyId = 'applyId'
        const data = {}
        data.addList = []
        const list = this.mentorPayDataList.filter(v => v.choose)

        this.mentorPaySubmitData.payRemark =
          (this.mentorPaySubmitData.payRemark || '') +
          ' 【系统备注：' +
          this.auto_note +
          '】'

        this.mentorPaySubmitData.payAmount =
          this.mentorPaySubmitData.payAmount * 1 +
          this.mentorPaySubmitData.commissionAmount * 1
        // 平分手续费
        // this.mentorPaySubmitData.commissionAmount =
        //   Math.round(
        //     (this.mentorPaySubmitData.commissionAmount / list.length) * 100
        //   ) / 100;
        for (let i = 0; i < list.length; i++) {
          if (list[i] && list[i].payRate == null) {
            this.$message({
              message: '有异常汇率，请检查',
              type: 'warning'
            })
            return
          }
          this.mentorPaySubmitData.applyId = list[i].applyId
          data.addList.push({ ...this.mentorPaySubmitData })
        }

        const applyData = {
          applyIdArr: [],
          voucherArr: [],
          payRemark: '',
          payVoucher: '',
          payDate: '',
          payStatus: 0,
          payAcc: '',
          payAccType: '',
          payRate: '',
          payType: 'cny',
          payAmount: '',
          commissionAmount: '',
          commissionFor: '',
          paymentAccount: ''
        }
        let mentorPaymentPayAcc = ''
        if (this.payData.showError) {
          this.mentorPaymentPayList.forEach(item => {
            if (this.mentorPaySubmitData.mentorPaymentPayPkId == item.itemValue) {
              mentorPaymentPayAcc = item.itemName
            }
          })
        }
        applyData.applyIdArr = this.applyIdArr
        applyData.payRemark = this.mentorPaySubmitData.payRemark
        applyData.payDate = this.mentorPaySubmitData.payDate
        // applyData.payStatus = this.mentorPaySubmitData.payStatus;
        applyData.payAcc = this.payData.payAcc
        applyData.payAccType = this.payData.paymentType
        applyData.payRate = this.mentorPaySubmitData.payRate
        applyData.payType = this.mentorPaySubmitData.payType
        applyData.payAmount = this.mentorPaySubmitData.payAmount
        applyData.commissionAmount = this.mentorPaySubmitData.commissionAmount
        applyData.commissionFor = this.mentorPaySubmitData.commissionFor
        applyData.paymentAccount = this.mentorPaySubmitData.paymentAccount
        if (this.payData.showError) {
          applyData.mentorPaymentPayPkId = this.mentorPaySubmitData.mentorPaymentPayPkId
          applyData.mentorPaymentApplyPkId = this.payData.pkId
          applyData.mentorPaymentPayAcc = mentorPaymentPayAcc
        }

        // if (!this.file) {
        //   this.$message({
        //     message: "凭证必传",
        //     type: "error"
        //   });
        //   return;
        // }
        if (!data.addList.length) {
          this.$message({
            message: '请点击选择需支付的申请',
            type: 'error'
          })
          this.mentorPaySubmitData.payRemark = ''
          return
        }
        console.log(applyData)
        this.loading = true
        if (this.file) {
          uploadFun(
            this.file,
            `voucher/mentor_pay_list/${applyId}`,
            p => {
              this.progress = p
            },
            url => {
              this.$loading().close()
              console.log(url)
              applyData.payVoucher = url
              applyData.voucherArr.push({
                voucherName: this.file.name,
                voucherPath: url
              })
              // data.addList.forEach(v => {
              //   v.payVoucher = url;
              // });
              this.$refs.upload.clearFiles()
              this.file = null
              api.postPayNew(applyData).then(res => {
                console.log('支付导师酬金', res)
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$emit('submit')
                this.loading = false
                this.handleClose()
              })
            }
          )
        } else {
          console.log(applyData)
          api.postPayNew(applyData).then(res => {
            console.log('支付导师酬金', res)
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$emit('submit')
            this.loading = false
            this.handleClose()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.relative{
  position:relative
}
.rateContent{
  position:absolute;
  right:0;
  top:0;
  width:90px;
  height:80px;
  box-shadow: 0 2px 12px 0 rgba(0, 0 ,0 ,0.1);
}
.mentor_pay_list{
  display: flex;
  justify-content: space-between;
}
.mentor_pay_listOverflow{
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 700px;
  width: 900px;
  min-width: 900px;

}
.box_sizing{
  box-sizing: border-box;
  padding:  0 10px;
  margin-bottom: 18px;
}
.upload{
  display: block !important;
}
.el-upload-dragger{
  width: 400px !important;
}
.rate_flag{
  text-align: center;
  line-height:14px;
  .rate_icon{
    width:28px;
    height:19px;
    vertical-align:top;
  }
}
.rate_text{
  text-align: center;
}
.red-border {
  border-color: red;
  background-color: #ff000010;
}
.programName {
  border-radius: 5px;
  padding: 0px 15px;
  border: 1px #dcdfe6 dashed;
  min-width: 165px;
  height: 26px;
  display: inline-block;
  // @extend %mm;
}
.color_red{
  color: #FF8C00;
}
</style>
