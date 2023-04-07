
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'实习单位批量出纳'"
      :visible.sync="internshipUnitPayListVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <pay-status :flags='payStatusFlags'/>
      <template v-for="(refundData,i) in refundDataList">
        <div class="box" :key="i" @click="chooseApply(refundData)">
          <el-card class="mb20 relative" :class="{'red-border':refundData.choose}">
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
                  <span :title="item.value">{{item.value || '未填写'}}</span>
                </el-col>
              </div>
            </el-row>
            <el-row class="mb10">
              <el-col :span="4" class="_item-name">合同</el-col>
              <el-col :span="20" class="_item-value">
                <div v-for="item in refundData.contractList" :key="item.pkId" class="mb20">
                  <el-button size="mini" @click="download(item.contractPath)">{{item.contractName}}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="4" class="_item-name">审核人</el-col>
              <el-col :span="20" class="_item-value">{{refundData.approval}}</el-col>
            </el-row>
            <el-row class="mb10" v-if="copyTo">
              <el-col :span="4" class="_item-name">抄送人</el-col>
              <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
            </el-row>
            <el-tag class="rateContent" type="info">
              <p>汇率</p>
              <p class="rate_flag">
                 <img class="rate_icon" :src="refundData.content.info ? currencyList[refundData.content.info.fundType.toLowerCase()] :''"> :
                 <img class="rate_icon" :src="currencyList[brokerageSubmitData.payType]">
              </p>
              <p class="rate_text">1 : {{refundData.content.info ? refundData.content.info.payRate :""}}</p>
            </el-tag>
          </el-card>
        </div>
      </template>
      <el-form
        :inline="true"
        size="mini"
        :model="brokerageSubmitData"
        :rules="rules"
        ref="brokerageSubmitData"
        label-width="160px"
      >
        <!-- <el-form-item label="出账汇率:" prop="payRate">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="brokerageSubmitData.payRate"
            :disabled="true"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="付款账户:" prop="paymentAccount">
          <el-select :style="{width:'200px'}" v-model="brokerageSubmitData.paymentAccount">
            <el-option
              v-for="(item) in payment_account"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款货币类型:" prop="payType">
          <el-select
            :style="{width:'200px'}"
            v-model="brokerageSubmitData.payType"
            @change="getRate"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="出账汇率:" prop="payRate">
          <span class="programName">{{brokerageSubmitData.payRate}}</span>
          <el-input :style="{width:'200px'}" size="mini" v-model="brokerageSubmitData.payRate" v-show="false"></el-input>
        </el-form-item> -->
        <el-form-item label="申请总金额:" prop="payAmount">
            <!-- :disabled="true" -->
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="brokerageSubmitData.payAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="brokerageSubmitData.payDate"
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
              v-model="brokerageSubmitData.commissionAmount"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="手续费说明:">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="brokerageSubmitData.commissionFor"
            :maxlength="200"
            placeholder="200字以内"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付备注:" prop>
          <el-input
            :style="{width:'570px'}"
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
          </upload>进 度：
          <el-progress :style="{width:'400px'}" :percentage="progress" :color="customColors"></el-progress>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">{{ "提 交"}}</el-button>
        <!-- <el-button  v-else type="primary" @click="submitPayStatus">{{!this.payData.payId ? "付款确认" : "已确认"}}</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import upload from '@/components/upload'
import { uploadFun, downloadFun } from '@/libs/file'
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
    internshipUnitPayListVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        commissionAmount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        // payRate: [{ required: true, message: "必填", trigger: "blur" }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      brokerageSubmitData: {
        applyId: null,
        payAmount: null,
        payType: null,
        paymentAccount: null,
        payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0',
        commissionAmount: 0,
        commissionFor: ''
      },
      refundDataList: [
        {
          apply: {},
          content: {},
          copyTo: [],
          approval: []
        }
      ],
      approval: '',
      copyTo: '',
      account: '',
      applyIdArr: [],
      bill_currency_type: [],
      payment_account: [],
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
    internshipUnitPayListVisible: function (newData) {
      if (newData) {
        console.log('payData详情', this.payData)
        this.payStatusFlags = this.payData.applyIds
        this.Topage()
        this.pageInit()
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
      api.getApplyListByApplyIds(this.payData.applyIds).then(res => {
        console.log('详情数据', res)
        console.log(res)
        this.refundDataList = []
        res.data.forEach(data => {
          console.log(data,data.apply.content)
          const refundData = {
            choose: false,
            pay: data.pay,
            apply: data.apply,
            content: JSON.parse((data.apply.content)),
            copyTo: data.copyTo,
            contractList: data.contractList,
            approval: data.approval
          }
          refundData.approval = ''
          data.approval.forEach(v => {
            refundData.approval += v.approverName + '; '
          })
          refundData.copyTo = ''
          data.copyTo.forEach(v => {
            refundData.copyTo += v.copyToName + '; '
          })
          if (refundData.content.info.fundType.toLowerCase() == 'cny') {
            refundData.content.info.fundWageCny =
              refundData.content.info.fundWage * 1
            refundData.content.info.fundWageUsd =
              Math.round(
                (refundData.content.info.fundType /
                  refundData.content.info.exchangeRate) *
                  100
              ) / 100
          } else {
            refundData.content.info.fundWageCny =
              Math.round(
                refundData.content.info.fundWage *
                  refundData.content.info.exchangeRate *
                  100
              ) / 100
            refundData.content.info.fundWageUsd =
              refundData.content.info.fundWage * 1
          }

          this.refundDataList.push(refundData)
        })
        const refundData = this.refundDataList[0]
        console.log(refundData)
        this.brokerageSubmitData.payType = refundData.content.info.fundType.toLowerCase()
        this.brokerageSubmitData.payAmount = 0
        this.brokerageSubmitData.payDate = new Date()
        this.getRate()
      })
    },
    getPayDetailByPayId () {
      api.getPayDetailByPayId(this.payData.payId).then(res => {
        console.log('brokerageSubmitData', res)
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
      this.$emit('close')
      this.brokerageSubmitData = {
        payId: undefined,
        applyId: null,
        payAmount: null,
        payAmountCny: null,
        payType: null,
        paymentAccount: null,
        // payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0',
        commissionAmount: 0,
        commissionFor: ''
      }
      this.progress = 0
      this.payStatusFlags = ''
      this.applyIdArr = []
    },
    chooseApply (refundData) {
      if (refundData) {
        refundData.choose = !refundData.choose
      }
      const list = this.refundDataList.filter(v => v.choose)
      console.log(list)
      this.applyIdArr = []
      // if(list.length > 0){
      //   for(let i=0;i<list.length;i++){
      //     this.applyIdArr.push({applyId:list[i].apply.applyId})
      //   }
      // }else{
      //   this.applyIdArr = [];
      // }
      this.brokerageSubmitData.payAmount = 0
      this.auto_note = ''
      list.forEach(v => {
        this.brokerageSubmitData.payAmount += v.content.info.fundWage * v.content.info.payRate
        this.brokerageSubmitData.payAmount =
          Math.round(this.brokerageSubmitData.payAmount * 100) / 100
        // if (this.brokerageSubmitData.payType.toLowerCase() == "cny") {
        //   this.brokerageSubmitData.payAmount += v.content.info.fundWageCny;
        // } else {
        //   this.brokerageSubmitData.payAmount += v.content.info.fundWageUsd;
        // }
        this.auto_note +=
          '学员[' +
          v.content.text[0].value +
          ']实习单位[' +
          v.content.text[1].value +
          ']申请金额：' +
          v.content.info.fundType +
          v.content.info.fundWage +
          '; '
        this.applyIdArr.push({
          applyId: v.apply.applyId,
          payRate: v.content.info.payRate,
          payType: this.brokerageSubmitData.payType,
          payAmount: v.content.info.fundWage * v.content.info.payRate
        })
      })
    },
    getRate () {
      this.refundDataList.forEach(v => {
        const fromCurrency = v.content.info.fundType.toLowerCase()
        const toCurrency = this.brokerageSubmitData.payType
        console.log(fromCurrency)
        console.log(toCurrency)
        if (fromCurrency == toCurrency) {
          this.$set(v.content.info, 'payRate', 1)
          this.chooseApply({ choose: false })
          return
        }
        apiDic.getLatestSysRate({ fromCurrency: fromCurrency, toCurrency: toCurrency }).then((res) => {
          if (res.data) {
            // this.brokerageSubmitData.payRate = res.data.rate
            this.$set(v.content.info, 'payRate', res.data.rate)
            this.chooseApply({ choose: false })
          } else {
            this.$set(v.content.info, 'payRate', null)
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
      this.brokerageSubmitData.payRemark = ''
      this.$refs.brokerageSubmitData.validate(valid => {
        if (!valid) return
        // console.log(this.brokerageSubmitData.payAccType,this.payData.paymentType)
        if (!this.file && this.payData.paymentType !== 'bank') {
          this.$message({
            message: '收款账户非银行账户，凭证必传',
            type: 'error'
          })
          return
        }
        // this.brokerageSubmitData.applyId = this.payData.applyId;
        // this.brokerageSubmitData.payAcc = this.account;
        const data = {}
        data.addList = []
        const list = this.refundDataList.filter(v => v.choose)
        // if (list.length > 1) {
        this.brokerageSubmitData.payRemark =
          (this.brokerageSubmitData.payRemark || '') +
          ' 【系统备注：' +
          this.auto_note +
          '】'
        // }
        this.brokerageSubmitData.payAmount =
          this.brokerageSubmitData.payAmount * 1 +
          this.brokerageSubmitData.commissionAmount * 1

        // 手续费
        // this.brokerageSubmitData.commissionAmount =
        //   Math.round(
        //     (this.brokerageSubmitData.commissionAmount / list.length) * 100
        //   ) / 100;
        for (let i = 0; i < list.length; i++) {
          if (list[i].content.info.payRate == null) {
            this.$message({
              message: '有异常汇率，请检查',
              type: 'warning'
            })
            return
          }
          this.brokerageSubmitData.applyId = list[i].apply.applyId
          data.addList.push({ ...this.brokerageSubmitData })
        }
        // forEach中return无法跳出循环
        // list.forEach(v => {
        //   if(v.content.info.payRate == null){
        //     this.$message({
        //       message: '有异常汇率，请检查',
        //       type: 'warning'
        //     });
        //   }
        //   this.brokerageSubmitData.applyId = v.apply.applyId;
        //   data.addList.push({ ...this.brokerageSubmitData });
        // });
        const applyData = {
          applyIdArr: [],
          voucherArr: [],
          payRemark: '',
          payVoucher: '',
          payDate: '',
          payStatus: '',
          payAcc: '',
          payAccType: '',
          payRate: '',
          payType: '',
          payAmount: '',
          commissionAmount: '',
          commissionFor: '',
          paymentAccount: ''
        }
        console.log(this.brokerageSubmitData, '12121312yxxx')
        applyData.applyIdArr = this.applyIdArr
        applyData.payRemark = this.brokerageSubmitData.payRemark
        applyData.payDate = this.brokerageSubmitData.payDate
        applyData.payStatus = this.brokerageSubmitData.payStatus
        applyData.payAcc = this.payData.payAcc
        applyData.payAccType = this.payData.paymentType
        applyData.payRate = this.brokerageSubmitData.payRate
        applyData.payType = this.brokerageSubmitData.payType
        applyData.payAmount = this.brokerageSubmitData.payAmount
        applyData.commissionAmount = this.brokerageSubmitData.commissionAmount
        applyData.commissionFor = this.brokerageSubmitData.commissionFor
        applyData.paymentAccount = this.brokerageSubmitData.paymentAccount

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
          return
        }
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        if (!this.file) {
          console.log(applyData)
          api.postPayNew(applyData).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$emit('submit')
            this.$loading().close()
            this.handleClose()
          })
        } else {
          uploadFun(
            this.file,
            'voucher/internship_unit_pay',
            p => {
              this.progress = p
            },
            url => {
              applyData.payVoucher = url
              applyData.voucherArr.push({
                voucherName: this.file.name,
                voucherPath: url
              })
              console.log(applyData, 'YX11123236217836')
              // data.addList.forEach(v => {
              //   v.payVoucher = url;
              // });
              this.$refs.upload.clearFiles()
              this.file = null
              api.postPayNew(applyData).then(() => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.relative{
  position:relative;
  padding:0 40px
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
