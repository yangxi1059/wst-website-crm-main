<!--
 * @Author: 库建华
 * @Date: 2019-07-02 09:27:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-28 11:05:21
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'导师佣金支付'"
      :visible.sync="mentorPayVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="mentorPaySubmitData"
        :rules="rules"
        ref="mentorPaySubmitData"
        label-width="160px"
      >
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
        <!-- <el-form-item label="申请时汇率:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.rate}}</p>
        </el-form-item>-->
        <!-- <el-form-item label="导师时薪:">
          <p
            :style="{width:'200px'}"
          >{{mentorPayData.mentorPayment.compensationType == 'cny' ? '￥' : '$'}}{{mentorPayData.mentorPayment.compensation}}</p>
        </el-form-item>-->
        <el-form-item label="申请金额:">
          <p
            :style="{width:'200px'}"
          >{{mentorPayData.mentorPayment.paymentAmountCny ? ('￥' + mentorPayData.mentorPayment.paymentAmountCny) : ('$' + mentorPayData.mentorPayment.paymentAmountUsd)}}</p>
        </el-form-item>
        <!-- <el-form-item label="对应人民币金额:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.paymentAmountCny2}}</p>
        </el-form-item>-->
        <el-form-item label="账户类型:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.paymentType}}</p>
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
        <el-form-item label="Routing Number:" v-if="mentorPayData.mentorPayment.routingNumber">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.routingNumber}}</p>
        </el-form-item>
        <el-form-item label="审核人:">
          <p v-html="approval"></p>
        </el-form-item>
        <br />
        <!-- <el-form-item label="汇率:" prop="payRate">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="mentorPaySubmitData.payRate"
            :disabled="true"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="付款货币类型:" prop="payType">
          <el-select
            :style="{width:'200px'}"
            v-model="mentorPaySubmitData.payType"
            :disabled="true"
          >
            <el-option
              v-for="(item) in [{id:'cny',value:'人民币'},{id:'usd',value:'美金'}]"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时汇率:" prop="payAmount">
          <el-input
            :disabled="true"
            :style="{width:'200px'}"
            size="mini"
            v-model="mentorPaySubmitData.rate"
          ></el-input>
        </el-form-item>
        <el-form-item label="实际付款金额:" prop="payAmount">
          <el-input :style="{width:'200px'}" size="mini" v-model="mentorPaySubmitData.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="手续费:" prop="commissionAmount">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="mentorPaySubmitData.commissionAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="手续费说明:" prop="commissionFor">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="mentorPaySubmitData.commissionFor"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="mentorPaySubmitData.payDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="付款账户:" prop="paymentAccount">
          <el-select :style="{width:'200px'}" v-model="mentorPaySubmitData.paymentAccount">
            <el-option
              v-for="(item) in payment_account"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="对应人民币金额:" v-if="mentorPaySubmitData.payType == 'usd'">
          <el-input :style="{width:'200px'}" size="mini" v-model="mentorPaySubmitData.payAmountCny"></el-input>
        </el-form-item>-->
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
          </upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="check"
          v-if="this.payData.payId"
        >{{this.payData.recordStatus == '0' ? '确认记录':'已记录'}}</el-button>
        <el-button @click="handleClose">取 消</el-button>
        <!-- <el-button type="primary" @click="submit">{{!this.payData.payId ? "提 交" : "更 新"}}</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/components/upload'
import { uploadFunBySys, downloadFun } from '@/libs/file'
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
    mentorPayVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      mentorPayData: {
        mentorPayment: {},
        apply: {},
        approval: []
      },
      approval: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
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
        payRemark: null,
        paymentAccount: null
      },
      payment_account: [],
      rate: null
    }
  },
  watch: {
    mentorPayVisible: function (newData) {
      if (newData) {
        console.log('payData详情', this.payData)
        this.Topage()
        this.pageInit()
        if (this.payData.payId) {
          this.getPayDetailByPayId()
        }
      }
    }
  },
  mounted () {
    apiDic.getRate({ currencyType: 'usd' }).then(res => {
      this.mentorPaySubmitData.payRate = res.data.exchangeRate
      this.rate = res.data.exchangeRate
    })
  },
  methods: {
    async pageInit () {
      this.payment_account = await this.getDictionary('payment_account')
    },
    Topage () {
      this.$loading()
      api.getApplyDetailByApplyId(this.payData.applyId).then(res => {
        console.log('详情数据', res)
        this.mentorPayData = res.data
        this.mentorPaySubmitData.applyId = res.data.mentorPayment.applyId
        this.mentorPaySubmitData.payAccType =
          res.data.mentorPayment.paymentType
        this.mentorPaySubmitData.payAcc = res.data.mentorPayment.payAcc
        this.mentorPaySubmitData.payDate = new Date()
        if (
          ['alipay', 'bank', 'wechatpay'].includes(
            this.mentorPaySubmitData.payAccType
          )
        ) {
          this.mentorPaySubmitData.payType = 'cny'
          this.mentorPaySubmitData.payAmount =
            res.data.mentorPayment.paymentAmountCny
        } else {
          this.mentorPaySubmitData.payType = 'usd'
          this.mentorPaySubmitData.payAmount =
            res.data.mentorPayment.paymentAmountUsd
        }
        if (this.mentorPayData.mentorPayment.paymentAmountUsd) {
          this.mentorPayData.mentorPayment.paymentAmountCny2 =
            Math.round(
              this.mentorPayData.mentorPayment.paymentAmountUsd *
                this.rate *
                100
            ) / 100
        } else {
          this.mentorPayData.mentorPayment.paymentAmountCny2 = this.mentorPayData.mentorPayment.paymentAmountCny
        }
        console.log(this.mentorPaySubmitData.payDate)
        if (res.data.pay) {
          this.mentorPaySubmitData.payId = res.data.pay.payId
          this.mentorPaySubmitData.payAmount = res.data.pay.payAmount
          this.mentorPaySubmitData.payType = res.data.pay.payType
          this.mentorPaySubmitData.payDate = res.data.pay.payDate
          this.mentorPaySubmitData.payRemark = res.data.pay.payRemark
          this.mentorPaySubmitData.paymentAccount = res.data.pay.paymentAccount
          this.mentorPaySubmitData.payVoucher = res.data.pay.payVoucher
          this.mentorPaySubmitData.confirmTime = res.data.pay.confirmTime
          this.mentorPaySubmitData.rate = res.data.pay.payRate
          this.mentorPaySubmitData.commissionAmount =
            res.data.pay.commissionAmount
          this.mentorPaySubmitData.commissionFor = res.data.pay.commissionFor
        }
        // this.mentorPaySubmitData.payRate = !res.data.pay
        //   ? res.data.mentorPayment.rate
        //   : res.data.pay.payRate;
        this.approval = ''
        res.data.approval.forEach(v => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime ||
            ''}</p>`
        })
        this.$loading().close()
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
      // this.$refs.mentorPayData.resetFields();
      this.$emit('close')
      this.mentorPayData = {
        mentorPayment: {},
        apply: {},
        approval: []
      }
      this.mentorPaySubmitData = {
        payId: null,
        applyId: null,
        payAmount: null,
        payAmountCny: null,
        payType: null,
        payRate: this.mentorPaySubmitData.payRate,
        payAccType: null,
        payAcc: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        paymentAccount: null
      }
    },
    // 确认
    submit () {
      this.$refs.mentorPaySubmitData.validate(valid => {
        if (!valid) return
        const applyId = this.mentorPaySubmitData.applyId
        const data = {}
        if (!this.mentorPaySubmitData.payId) {
          data.addList = [this.mentorPaySubmitData]
        } else {
          data.uptList = [this.mentorPaySubmitData]
        }
        if (!this.file) {
          this.$message({
            message: '凭证必传',
            type: 'error'
          })
          // api.setMentorPayment(data).then(res => {
          //   console.log("支付导师酬金", res);
          //   this.$message({
          //     message: "提交成功",
          //     type: "success"
          //   });
          //   this.$emit("submit");
          //   this.$loading().close();
          //   this.handleClose();
          // });
        } else {
          this.$loading({ background: 'rgba(0,0,0,.5)' })

          uploadFunBySys(this.file, `voucher/mentor_pay/${applyId}`, url => {
            console.log(url)
            if (!data.addList) {
              data.uptList[0].payVoucher = url
            } else {
              data.addList[0].payVoucher = url
            }
            this.$refs.upload.clearFiles()
            this.file = null
            console.log(data)
            api.setMentorPayment(data).then(res => {
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
    check () {
      api
        .recordMentorPayment(this.mentorPaySubmitData.applyId)
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
