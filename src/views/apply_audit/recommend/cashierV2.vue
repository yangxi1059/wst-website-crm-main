
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'支付'"
      :visible.sync="recommendCashierV2Visible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-card class="mb20">
        <pay-status :flags='payStatusFlags'/>
        <el-row >
          <el-col :span="4" class="_item-name">申请人</el-col>
          <el-col :span="4" class="_item-value">{{refundData.apply.createByName}}</el-col>
          <el-col :span="4" class="_item-name">申请状态</el-col>
          <el-col :span="4" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
          <el-col :span="4" class="_item-name">申请时间</el-col>
          <el-col :span="4" class="_item-value">{{refundData.apply.createTime}}</el-col>
        </el-row>
        <el-row  v-if="refundData.content">
          <el-col :span="8" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col :span="12" class="_item-name">{{item.label}}</el-col>
            <el-col :span="12" class="_item-value" :title="item.value">{{item.value || '无'}}</el-col>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="4" class="_item-name">审核人</el-col>
          <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
        </el-row>
        <el-row  v-if="copyTo">
          <el-col :span="4" class="_item-name">抄送人</el-col>
          <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
        </el-row>
        <el-row  v-if="refundData.pay">
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

        <el-row >
          <el-col :span="4" class="_item-name" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">支付异常原因</el-col>
          <el-col :span="20" class="_item-value" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">{{refundData.pay.errorReason}}</el-col>
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
        <el-form-item label="出账汇率:" prop="payRate">
          <span class="programName">{{submitData.payRate}}</span>
          <el-input :style="{width:'200px'}" size="mini" v-model="submitData.payRate" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="实际付款金额:" prop="payAmount">
          <el-input :style="{width:'200px'}" size="mini" v-model="submitData.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            :style="{width:'200px'}"
            v-model="submitData.payDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手续费:" prop="commissionAmount">
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
            :style="{width:'570px'}"
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
      <span slot="footer" class="dialog-footer" v-if="refundData.pay && refundData.apply.applyStatus != 7">
        <el-button type="danger" @click="errorBtn">支付异常</el-button>
      </span>
    </el-dialog>
    <errorApply :errorDetailVisible="errorDetailVisible" :applyId="applyId" :payId="payId" @close="errorApplyClose" @submit="errorApplysubmit" />
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import upload from '@/components/upload'
import errorApply from '../components/error_apply.vue'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'

export default {
  components: { upload, errorApply },
  name: 'recommend',
  props: {
    payData: {
      type: Object
    },
    recommendCashierV2Visible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixins],
  data () {
    return {
      widths: '230px',
      rules: {
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        commissionAmount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
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
      payId: '',
      errorDetailVisible: false,
      applyId: '',
      approval: '',
      copyTo: '',
      payment_account: [],
      bill_currency_type: [],
      applyAmount: 0,
      applyAmountType: 'cny',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      payStatusFlags: ''
    }
  },
  watch: {
    recommendCashierV2Visible: function (newData, oldData) {
      if (newData) {
        console.log('payData详情yx**********', this.payData)
        this.applyId = this.payData.applyId
        this.payStatusFlags = this.payData.applyId
        console.log('payStatusFlags', this.payStatusFlags)
        this.Topage()
        this.pageInit()
        // 付款日期，默认今天
        this.submitData.payDate = new Date()
      }
    },
    payAmount: function (val) {

    },
    payAmountType: function (val) {
      this.getLastRate()
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
        console.log('详情数据yx*******出纳', res)
        if (res.data.pay) {
          this.payId = res.data.pay.payId
        }
        this.refundData = {
          pay: res.data.pay,
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval
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
        this.applyAmount = (this.refundData.content.info.fundWage || this.refundData.content.info.fee)
        this.submitData.payType = this.applyAmountType = JSON.parse(JSON.stringify(this.refundData.content.info.fundType || this.refundData.content.info.feeType))
        this.getLastRate()
        // 初始化对应的RMB值
        if (this.applyAmountType == 'cny') {
          this.submitData.payAmountCny = (this.refundData.content.info.fundWage || this.refundData.content.info.fee)
        } else if (this.applyAmountType == 'usd') {
          this.submitData.payAmountCny =
            Math.round(
              ((this.refundData.content.info.fundWage || this.refundData.content.info.fee) * this.refundData.content.info.exchangeRate) * 100
            ) / 100
        }
        // this.submitData.payAmount = this.refundData.content.info.bonusAmount;
        // this.submitData.payType = this.refundData.content.info.bonusType;
      })
    },
    // 旧获取汇率方法  21-7-5 长时间不用可删除
    // getRate(payType){
    //   apiDic.getRate({ currencyType: payType }).then((res) => {
    //     if(res.data){
    //       this.submitData.payRate = res.data.exchangeRate;
    //       this.submitData.payAmount = Math.round(
    //         this.submitData.payAmountCny / this.submitData.payRate * 100
    //       ) / 100
    //     }else{
    //       this.submitData.payRate = null
    //       this.$message({
    //         message: "无该货币汇率",
    //         type: "error"
    //       });
    //     }
    //   })
    // },
    getLastRate () {
      const fromCurrency = this.applyAmountType // 申请项货币类型
      const toCurrency = this.submitData.payType // 付款货币类型
      if (fromCurrency == toCurrency) {
        this.submitData.payRate = 1
        this.submitData.payAmount = this.applyAmount
        return
      }
      apiDic.getLatestSysRate({ fromCurrency: fromCurrency, toCurrency: toCurrency }).then((res) => {
        if (res.data) {
          this.submitData.payRate = res.data.rate
          this.submitData.payAmount = Math.round(
            this.applyAmount * this.submitData.payRate * 100
          ) / 100
        } else {
          this.submitData.payRate = null
          this.submitData.payAmount = null
          this.$message({
            message: '无该货币汇率',
            type: 'error'
          })
        }
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
      this.payId = ''
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
      this.payStatusFlags = ''
    },
    // 确认
    submit () {
      this.$refs.submitData.validate(valid => {
        if (!valid) return
        this.submitData.applyId = this.payData.applyId
        const data = {
          applyId: this.payData.applyId,
          payAmount: this.submitData.payAmount,
          payType: this.submitData.payType,
          commissionAmount: this.submitData.commissionAmount,
          commissionFor: this.submitData.commissionFor,
          payAcc: this.refundData.content.info.payAcc,
          payAccType: this.refundData.content.info.payAccType,
          payDate: this.submitData.payDate,
          paymentAccount: this.submitData.paymentAccount,
          payRemark: this.submitData.payRemark,
          voucherList: []
        }
        // this.$loading({ background: 'rgba(0,0,0,.5)' })
        if (!this.file) {
          console.log(data)
          api.setApplyPayV2(data).then(res => {
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
          uploadFunBySys(this.file, 'voucher/recommend_cashier', url => {
            console.log(url)
            // if (!data.addList) {
            //   data.uptList[0].payVoucher = url;
            // } else {
            data.voucherList.push({ voucherName: this.file.name, voucherPath: url })
            data.payVoucher = url
            this.$refs.upload.clearFiles()
            this.file = null
            console.log(data)
            api.setApplyPayV2(data).then(res => {
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
._item-value{
  white-space: nowrap;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
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
