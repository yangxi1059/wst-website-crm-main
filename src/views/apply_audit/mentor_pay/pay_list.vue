<!--
 * @Author: 库建华
 * @Date: 2019-07-02 09:27:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-08 17:26:44
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'导师支付'"
      :visible.sync="mentorPayListVisible"
      width="1200px"
      :before-close="handleClose"
    >
     <div v-loading="loading">
      <pay-status :flags="payStatusFlags" />
      <el-button type="primary" class="mb10" size="mini" v-if="listClick.length < mentorPayDataList.length" @click="clickAll">一键全选</el-button>
      <el-button type="danger" class="mb10" size="mini" v-else @click="clickNone">一键取消</el-button>
      <template v-for="(mentorPayData,i) in mentorPayDataList">
        <div class="box" :key="i" @click="chooseApply(mentorPayData)">
          <el-card
            class="mb20 relative"
            :class="{'red-border':mentorPayData.choose}"
            v-if="mentorPayData.mentorPayment"
          >
            <el-form :inline="true" size="mini" label-width="160px">
              <el-form-item label="导师姓名:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.mentorName}}</p>
              </el-form-item>
              <el-form-item label="学员姓名:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.menteeName}}</p>
              </el-form-item>
              <el-form-item label="签约ID:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.signId}}</p>
              </el-form-item>
              <el-form-item label="课号:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.lessonTimesIds}}</p>
              </el-form-item>
              <el-form-item label="课时数:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.payLessonHours}}</p>
              </el-form-item>
              <el-form-item label="课时备注:">
                <p :style="{width:'200px'}">{{mentorPayData.apply.note}}</p>
              </el-form-item>
              <el-form-item label="申请金额:">
                <p
                  :style="{width:'200px'}"
                >{{mentorPayData.mentorPayment.compensationType == 'cny' ? ('￥'+mentorPayData.mentorPayment.paymentAmountCny) :('$'+mentorPayData.mentorPayment.paymentAmountUsd)}}</p>
              </el-form-item>
              <el-form-item label="账户类型:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.paymentTypeName}}</p>
              </el-form-item>
              <el-form-item label="recipientAddress:" v-if="mentorPayData.mentorPayment.paymentType.includes('Company Account')">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.recipientAddress}}</p>
              </el-form-item>
              <el-form-item label="账号ID:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.payAcc}}</p>
              </el-form-item>
              <el-form-item label="账号所属人姓名:" v-if="mentorPayData.mentorPayment.realName">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.realName}}</p>
              </el-form-item>
              <el-form-item label="账号所属人身份证:" v-if="mentorPayData.mentorPayment.idCard">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.idCard}}</p>
              </el-form-item>
              <el-form-item label="银行名:" v-if="mentorPayData.mentorPayment.bankName">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.bankName}}</p>
              </el-form-item>
              <el-form-item label="银行地址:" v-if="mentorPayData.mentorPayment.bankAddress">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.bankAddress}}</p>
              </el-form-item>
              <el-form-item label="Swift Code:" v-if="mentorPayData.mentorPayment.swiftCode">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.swiftCode}}</p>
              </el-form-item>
              <el-form-item label="zip:" v-if="mentorPayData.mentorPayment.zip">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.zip}}</p>
              </el-form-item>
              <el-form-item
                label="Routing Number:"
                v-if="mentorPayData.mentorPayment.routingNumber"
              >
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.routingNumber}}</p>
              </el-form-item>
              <el-form-item label="账号备注:">
                <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.mentorPaymentRemark}}</p>
              </el-form-item>
              <el-form-item label="审核人:">
                <p>{{mentorPayData.approvalNames}}</p>
              </el-form-item>
            </el-form>
            <el-tag class="rateContent" type="info">
              <p>汇率</p>
              <p class="rate_flag">
                 <img class="rate_icon" :src="currencyList[mentorPayData.mentorPayment.compensationType]"> :
                 <img class="rate_icon" :src="currencyList[mentorPaySubmitData.payType]">
              </p>
              <p class="rate_text">1 : {{mentorPayData.mentorPayment.payRate}}</p>
            </el-tag>
          </el-card>
          <el-card
            class="mb20 relative"
            :class="{'red-border':mentorPayData.choose}"
            style="padding:0 40px "
            v-if="mentorPayData.mentorPaymentExtra"
          >
            <el-row class="mb10">
              <el-col :span="4" class="_item-name" v-if="mentorPayData.apply.createByName">申请人</el-col>
              <el-col :span="4" class="_item-value" v-if="mentorPayData.apply.createByName">{{mentorPayData.apply.createByName}}</el-col>
              <el-col :span="4" class="_item-name">申请状态</el-col>
              <el-col :span="4" class="_item-value">{{mentorPayData.apply.applyStatusName}}</el-col>
              <el-col :span="4" class="_item-name">申请时间</el-col>
              <el-col :span="4" class="_item-value">{{mentorPayData.apply.createTime}}</el-col>
            </el-row>
            <el-row class="mb10" v-if="mentorPayData.content">
              <span v-for="(item,i) in mentorPayData.content.text" :key="i">
                <el-col :span="4" class="_item-name">{{item.label}}</el-col>
                <el-col :span="20" class="_item-value">
                  <span :title="item.value">{{item.value}}</span>
                </el-col>
              </span>
            </el-row>
            <el-row class="mb10" v-if="mentorPayData.approvalNames">
              <el-col :span="4" class="_item-name">审核人</el-col>
              <el-col :span="20" class="_item-value">{{mentorPayData.approvalNames}}</el-col>
            </el-row>
            <el-tag class="rateContent" type="info">
              <p>汇率</p>
              <p class="rate_flag">
                  <img class="rate_icon" :src="currencyList[mentorPayData.mentorPaymentExtra.fundType]"> :
                  <img class="rate_icon" :src="currencyList[mentorPaySubmitData.payType]">
              </p>
              <p class="rate_text">1 : {{mentorPayData.mentorPaymentExtra.payRate}}</p>
            </el-tag>
          </el-card>
        </div>
      </template>
      <el-form
        v-if="!payData.showDetail"
        :inline="true"
        size="mini"
        :model="mentorPaySubmitData"
        :rules="rules"
        ref="mentorPaySubmitData"
        label-width="160px"
      >

        <el-form-item label="导师账户:" v-if="payData.showError" prop="mentorPaymentPayPkId">
          <el-select :style="{width:'200px'}" v-model="mentorPaySubmitData.mentorPaymentPayPkId">
            <el-option
              v-for="(item) in mentorPaymentPayList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="付款账户:" prop="paymentAccount">
          <el-select :style="{width:'200px'}" filterable v-model="mentorPaySubmitData.paymentAccount">
            <el-option
              v-for="(item) in payment_account"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款货币类型:" prop="payType">
          <el-select :style="{width:'200px'}" v-model="mentorPaySubmitData.payType" @change="getRate">
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
          <el-input :style="{width:'200px'}" size="mini" v-model="mentorPaySubmitData.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            :style="{width:'200px'}"
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
              :style="{width:'200px'}"
              size="mini"
              v-model="mentorPaySubmitData.commissionAmount"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="手续费说明:">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="mentorPaySubmitData.commissionFor"
            :maxlength="200"
            placeholder="200字以内"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付备注:" prop>
          <el-input
            :style="{width:'570px'}"
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
          </upload>进 度：
          <el-progress :style="{width:'400px'}" :percentage="progress" :color="customColors"></el-progress>
        </el-form-item>
      </el-form>
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"  v-if="!payData.showDetail" @click="submit">{{!this.payData.payId ? "提 交" : "更 新"}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/components/upload'
import { uploadFun, downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'

export default {
  components: { upload },
  name: 'mentorPay',
  mixins: [mixins],
  props: {
    payData: {
      type: Object
    },
    mentorPayListVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      widths: '230px',
      listClick: [],
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
        payType: null,
        payRate: null,
        payAccType: null,
        payAcc: null,
        payDate: null,
        payVoucher: null,
        paymentAccount: null,
        payRemark: null,
        commissionAmount: 0,
        commissionFor: ''
      },
      payment_account: [],
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
    mentorPayListVisible: function (newData) {
      if (newData) {
        this.pageInit()
        api.getPaymentDefaultNew(this.payData.mentorId).then(res => {
          console.log('payData详情', this.payData, res.data)
          if (res.data.accountId == this.payData.pkId) {
            this.payData.showError = false
          } else {
            this.payData.showError = true
          }
          let account = ''
          for (const item in res.data) {
            switch (item) {
              case 'paymentType': {
                account += '付款类型：' + res.data[item] + '  ;  '
                break
              }
              case 'payAcc': {
                account += ' 账户：' + res.data[item] + '  ;  '
                break
              }
              case 'bankName': {
                account += ' 银行：' + res.data[item] + '  ;  '
                break
              }
              case 'realName': {
                account += ' 收款人姓名：' + res.data[item] + '  ;  '
                break
              }
              case 'idCard': {
                account += ' 收款人身份证号：' + res.data[item] + '  ;  '
                break
              }
              case 'bankAddress': {
                account += ' Bank Address：' + res.data[item] + '  ;  '
                break
              }
              case 'zip': {
                account += ' ZIP：' + res.data[item] + '  ;  '
                break
              }
              case 'routingNumber': {
                account += ' Routing Number：' + res.data[item] + '  ;  '
                break
              }
              case 'swiftCode': {
                account += ' Swift Code：' + res.data[item] + '  ;  '
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
          this.mentorPaymentPayList = [
            { itemName: account, itemValue: res.data.accountId },
            { itemName: account2, itemValue: this.payData.pkId }
          ]
          if (this.payData.applyIds) {
            this.payStatusFlags = this.payData.applyIds
          } else {
            this.payStatusFlags = this.payData.applyId
          }
          this.Topage()
        })
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.payment_account = await this.getDictionary('payment_account')
    },
    Topage () {
      this.listClick = []
      this.loading = true
      let data = ''
      if (this.payData.applyIds) {
        data = this.payData.applyIds
      } else {
        data = this.payData.applyId
      }
      api.getApplyListByApplyIds(data).then(res => {
        console.log('详情数据 位置apply_aduit/mentor_pay/pay_list.vue', res)
        this.mentorPayDataList = res.data.map(v => {
          v.choose = false
          v.content = JSON.parse(v.apply.content || '{}')
          v.approvalNames = ''
          v.approval.forEach(vv => {
            v.approvalNames += vv.approverName + '; '
          })
          if (v.commMentorWithdrawal) {
            v.mentorPaymentExtra = v.commMentorWithdrawal
          }
          // 根据汇率计算对应金额cny,usd
          if (v.mentorPayment) {
            if (!v.mentorPayment.paymentAmountCny) {
              v.mentorPayment.paymentAmountCny =
                Math.round(
                  v.mentorPayment.rate * v.mentorPayment.paymentAmountUsd * 100
                ) / 100
            }
            console.log(
              v.mentorPayment.paymentAmountCny,
              v.mentorPayment.rate,
              v.mentorPayment.paymentAmountUsd
            )
            if (!v.mentorPayment.paymentAmountUsd) {
              v.mentorPayment.paymentAmountUsd =
                Math.round(
                  (v.mentorPayment.paymentAmountCny / v.mentorPayment.rate) *
                    100
                ) / 100
            }
          } else if (v.mentorPaymentExtra) {
            if (v.mentorPaymentExtra.fundType != 'cny') {
              v.mentorPaymentExtra.fundWageCny =
                Math.round(
                  v.mentorPaymentExtra.fundWage *
                    v.mentorPaymentExtra.exchangeRate *
                    100
                ) / 100
              v.mentorPaymentExtra.fundWageUsd =
                v.mentorPaymentExtra.fundWage * 1
            } else {
              v.mentorPaymentExtra.fundWageCny =
                v.mentorPaymentExtra.fundWage * 1
              v.mentorPaymentExtra.fundWageUsd =
                Math.round(
                  (v.mentorPaymentExtra.fundWage /
                    v.mentorPaymentExtra.exchangeRate) *
                    100
                ) / 100
            }
            /*          为了在页面同时适用升学导师薪资，导师薪资，导师佣金，so升学导师薪资后台处理后返回
            将字段academicMentorBonus 同步为mentorPaymentExtra以适用该页面
            } else if (v.academicMentorBonus) {
            if (v.academicMentorBonus.fundType != "cny") {
              v.academicMentorBonus.fundWageCny =
                Math.round(
                  v.academicMentorBonus.fundWage *
                    v.academicMentorBonus.exchangeRate *
                    100
                ) / 100;
              v.academicMentorBonus.fundWageUsd =
                v.academicMentorBonus.fundWage * 1;
            } else {
              v.academicMentorBonus.fundWageCny =
                v.academicMentorBonus.fundWage * 1;
              v.academicMentorBonus.fundWageUsd =
                Math.round(
                  (v.academicMentorBonus.fundWage /
                    v.academicMentorBonus.exchangeRate) *
                    100
                ) / 100;
            } */
          } 
          return v
        })

        const resData = res.data[0]
        this.mentorPaySubmitData.payDate = new Date()

        // 获取收款账户的货币类型
        if (resData.mentorPayment) {
          this.mentorPaySubmitData.applyId = resData.mentorPayment.applyId
          this.mentorPaySubmitData.payAccType =
            resData.mentorPayment.paymentType
        } else if (resData.mentorPaymentExtra) {
          this.mentorPaySubmitData.applyId = resData.mentorPaymentExtra.applyId
          this.mentorPaySubmitData.payAccType =
            resData.mentorPaymentExtra.paymentType
          /*        为了在页面同时适用升学导师薪资，导师薪资，导师佣金，so升学导师薪资后台处理后返回
          将字段academicMentorBonus 同步为mentorPaymentExtra以适用该页面
         } else if (resData.academicMentorBonus) {
          this.mentorPaySubmitData.applyId = resData.academicMentorBonus.applyId;
          this.mentorPaySubmitData.payAccType =
            resData.academicMentorBonus.payType; */
        }
        if (
          ['alipay', 'bank', 'wechatpay'].includes(
            this.mentorPaySubmitData.payAccType
          )
        ) {
          this.mentorPaySubmitData.payType = 'cny'
        } else {
          this.mentorPaySubmitData.payType = 'usd'
        }

        this.mentorPaySubmitData.payAmount = 0

        // this.approval = "";
        // resData.approval.forEach(v => {
        //   this.approval += `<p class='mb10'>${v.approverName} - <span class='${
        //     this.Myclass[v.approveStatus]
        //   }'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime ||
        //     ""}</p>`;
        // });
        console.log(this.mentorPayDataList, 3333333333333333)
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
        payType: null,
        payRate: 0,
        rate: 0,
        payAccType: null,
        payAcc: null,
        payDate: null,
        payVoucher: null,
        paymentAccount: this.mentorPaySubmitData.paymentAccount,
        payRemark: null,
        commissionAmount: 0,
        commissionFor: ''
      }
      this.progress = 0
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
      list.forEach(v => {
        let payAmount = 0
        let payRate = 0
        if (v.mentorPayment) {
          // 此处计算只有cny或usd
          payAmount = v.mentorPayment.compensationType == 'usd' ? v.mentorPayment.paymentAmountUsd : v.mentorPayment.paymentAmountCny
          payRate = v.mentorPayment.payRate
        } else if (v.mentorPaymentExtra) {
          payAmount = v.mentorPaymentExtra.fundWage
          payRate = v.mentorPaymentExtra.payRate
        }
        this.mentorPaySubmitData.payAmount += payAmount * payRate
        this.mentorPaySubmitData.payAmount =
          Math.round(this.mentorPaySubmitData.payAmount * 100) / 100
        console.log(this.mentorPaySubmitData, v.mentorPayment, 333333333333)
        this.auto_note += v.mentorPayment
          ? ` 导师佣金：${v.mentorPayment.menteeName}, [${v.mentorPayment.lessonTimesIds}],${v.mentorPayment.compensationType == 'cny' ? `￥${v.mentorPayment.paymentAmountCny}` : `$${v.mentorPayment.paymentAmountUsd}`};`
          : '导师薪资：' +
            v.mentorPaymentExtra.fundType +
            v.mentorPaymentExtra.fundWage +
            '; '
        this.applyIdArr.push({
          applyId: v.apply.applyId,
          payRate: payRate,
          payType: this.mentorPaySubmitData.payType,
          payAmount: payAmount * payRate
        })
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
        if (v.mentorPayment) {
          // 此处计算只有cny或usd
          payAmount = v.mentorPayment.compensationType == 'usd' ? v.mentorPayment.paymentAmountUsd : v.mentorPayment.paymentAmountCny
          payRate = v.mentorPayment.payRate
        } else if (v.mentorPaymentExtra) {
          payAmount = v.mentorPaymentExtra.fundWage
          payRate = v.mentorPaymentExtra.payRate
        }
        this.mentorPaySubmitData.payAmount += payAmount * payRate
        this.mentorPaySubmitData.payAmount =
          Math.round(this.mentorPaySubmitData.payAmount * 100) / 100
        console.log(this.mentorPaySubmitData, v.mentorPayment, 333333333333)
        this.auto_note += v.mentorPayment
          ? ` 导师佣金：${v.mentorPayment.menteeName}, [${v.mentorPayment.lessonTimesIds}],${v.mentorPayment.compensationType == 'cny' ? `￥${v.mentorPayment.paymentAmountCny}` : `$${v.mentorPayment.paymentAmountUsd}`};`
          : '导师薪资：' +
            v.mentorPaymentExtra.fundType +
            v.mentorPaymentExtra.fundWage +
            '; '
        this.applyIdArr.push({
          applyId: v.apply.applyId,
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
        if (v.mentorPayment) {
          // 此处计算只有cny或usd
          payAmount = v.mentorPayment.compensationType == 'usd' ? v.mentorPayment.paymentAmountUsd : v.mentorPayment.paymentAmountCny
          payRate = v.mentorPayment.payRate
        } else if (v.mentorPaymentExtra) {
          payAmount = v.mentorPaymentExtra.fundWage
          payRate = v.mentorPaymentExtra.payRate
        }
        this.mentorPaySubmitData.payAmount += payAmount * payRate
        this.mentorPaySubmitData.payAmount =
          Math.round(this.mentorPaySubmitData.payAmount * 100) / 100
        this.auto_note += v.mentorPayment
          ? ` 导师佣金：${v.mentorPayment.menteeName}, [${v.mentorPayment.lessonTimesIds}],${v.mentorPayment.compensationType == 'cny' ? `￥${v.mentorPayment.paymentAmountCny}` : `$${v.mentorPayment.paymentAmountUsd}`};`
          : '导师薪资：' +
            v.mentorPaymentExtra.fundType +
            v.mentorPaymentExtra.fundWage +
            '; '
        this.applyIdArr.push({
          applyId: v.apply.applyId,
          payRate: payRate,
          payType: this.mentorPaySubmitData.payType,
          payAmount: payAmount * payRate
        })
      })
    },
    getRate () {
      this.mentorPayDataList.forEach(v => {
        let loop = ''
        let fromCurrency = ''
        const toCurrency = this.mentorPaySubmitData.payType
        if (v.mentorPayment) {
          loop = 'mentorPayment'
          fromCurrency = v[loop].compensationType
        } else if (v.mentorPaymentExtra) {
          loop = 'mentorPaymentExtra'
          fromCurrency = v[loop].fundType
        } 
        if (fromCurrency == toCurrency) {
          this.$set(v[loop], 'payRate', 1)
          this.chooseApply({ choose: false })
          return
        }
        apiDic.getLatestSysRate({ fromCurrency: fromCurrency, toCurrency: toCurrency }).then((res) => {
          if (res.data) {
            this.$set(v[loop], 'payRate', res.data.rate)
            this.chooseApply({ choose: false })
          } else {
            this.$set(v[loop], 'payRate', null)
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
        console.log(this.mentorPaySubmitData.payAccType)
        if (!this.file && this.mentorPaySubmitData.payAccType !== 'bank' && this.mentorPaySubmitData.payAccType !== 'alipay') {
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
          if (list[i].mentorPayment && list[i].mentorPayment.payRate == null) {
            this.$message({
              message: '有异常汇率，请检查',
              type: 'warning'
            })
            return
          } else if (list[i].mentorPaymentExtra && list[i].mentorPaymentExtra.payRate == null) {
            this.$message({
              message: '有异常汇率，请检查',
              type: 'warning'
            })
            return
          }
          this.mentorPaySubmitData.applyId = list[i].apply.applyId
          data.addList.push({ ...this.mentorPaySubmitData })
        }
        // list.forEach(v => {
        // this.mentorPaySubmitData.applyId = v.apply.applyId;
        // if (this.mentorPaySubmitData.payType === "cny") {
        //   this.mentorPaySubmitData.paymentAmount = v.mentorPayment
        //     ? v.mentorPayment.paymentAmountCny * 1
        //     : v.mentorPaymentExtra.fundWageCny * 1;
        // } else {
        //   this.mentorPaySubmitData.paymentAmount = v.mentorPayment
        //     ? v.mentorPayment.paymentAmountUsd * 1
        //     : v.mentorPaymentExtra.fundWageUsd * 1;
        // }
        // v.mentorPayment &&
        //   (this.mentorPaySubmitData.payRate = v.mentorPayment.rate);
        // v.mentorPaymentExtra &&
        //   (this.mentorPaySubmitData.payRate =
        //     v.mentorPaymentExtra.exchangeRate);
        //   data.addList.push({ ...this.mentorPaySubmitData });
        // });

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
          payType: '',
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
</style>
