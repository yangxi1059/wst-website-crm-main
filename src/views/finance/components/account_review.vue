<template>
  <div class="account-review">
    <el-dialog
      title="入账信息"
      class="info"
      v-loading="loading"
      :visible.sync="accountReviewVisible"
      width="1500px"
      :before-close="accountReviewClose"
    >
      <div class="header">
        <!-- <div class="inl title">订单信息：</div> -->
        <el-row>
          <el-col class="inl">订单ID : {{accountReviewListData.order.orderId}}</el-col>
          <el-col class="inl">订单总金额 : <span class="num-text">{{accountReviewListData.order.orderPrice}}</span></el-col>
          <el-col class="inl">总入账(含本笔) : <span class="num-text">{{enteredPrice}}</span></el-col>
          <el-col class="inl">签约日期 : {{accountReviewListData.order.signDate}}</el-col>
          <el-col class="inl"
            :class="{'redBlod':accountReviewListData.order.orderType == 1}"
          >订单类型 : {{accountReviewListData.order.orderType == 1 ? '节假日订单' : '普通订单'}}</el-col>
        </el-row>
        <el-row>
          <el-col class="inl">父母职业 : {{transition.parentJob}}</el-col>
          <el-col class="inl">性格类型 : <span >{{transition.parentPersonality}}</span></el-col>
          <el-col class="inl">父母对小孩的期望 : <span >{{transition.parentExpectation}}</span></el-col>
          <el-col class="inl">对小孩人生的介入程度 : {{transition.parentControl}}</el-col>
          <el-col class="inl">购买力 : {{transition.parentPurchasingPower}}</el-col>
        </el-row>
        <el-row>
          <el-col class="inl">对行业的了解程度 : {{transition.menteeIndustryLevel}}</el-col>
          <el-col class="inl">学生心理状态 : <span >{{transition.menteeMentality}}</span></el-col>
          <el-col class="inl">需要后期综合注意的点 : <span >{{transition.notice}}</span></el-col>
        </el-row>
        <el-row>
          <el-col class="inl" v-for="(item,index) in programList " :key="index">
            <el-card class="box-card "  >
              <div slot="header" class="clearfix">
                <span>{{item.programTypeName}}🚩</span>
              </div>
              <div class="program-text">
                <p class="program-text-title">{{item.programName}}</p>
                {{item.startDate + '~' + item.endDate}}<br>
                （{{(item.extendedEndDate == item.endDate  || !item.extendedEndDate) ? '无延长' :'延长至'+item.extendedEndDate}}）
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="accountReviewListData.accountList"
        size="mini"
        highlight-current-row
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="revenueDate" align="center" label="入账时间" min-width="90"></el-table-column>
        <el-table-column prop="revenueType" align="center" label="入账货币类型（申请）" min-width="90"></el-table-column>
        <el-table-column prop="exchangeRate" align="center" label="汇率" min-width="90">
          <template slot-scope="scope">
            <div v-if="rateCircle && scope.row.remark == remark">{{scope.row.exchangeRate}}( 汇率区间：{{rateCircle}} )</div>
            <div v-else>{{scope.row.exchangeRate}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="revenue" align="center" label="入账金额" min-width="90"></el-table-column>
        <el-table-column prop="account" align="center" label="入账账户" min-width="90"></el-table-column>
        <el-table-column prop="transfer" align="center" label="付款人" min-width="90"></el-table-column>
        <el-table-column prop="remark" align="center" label="备注" min-width="90"></el-table-column>
        <el-table-column prop="totalInCny" align="center" label="总金额（￥）" min-width="90"></el-table-column>
        <el-table-column prop="voucherNum" align="center" label="凭证" min-width="90">
          <template slot-scope="scope">
            <a @click="viewVoucher(scope.row.billId,scope.row.orderId,scope.row.applyId)">
              <i class="el-icon-view"></i>
              <span style="margin-left: 10px">查看（{{ scope.row.voucherNum }}）</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" align="center" label="财务确认的本笔到账金额" min-width="90"></el-table-column>
      </el-table>
      <span class="tips">👆👆👆黄底为本次审核数据</span>
      <el-form
        :inline="true"
        label-position="left"
        :model="accountReviewSubmitData"
        ref="rule"
        :rules="rule"
        label-width="130px"
        style="margin:30px"
      >
          <el-form-item label="本笔到账金额:" class="form-width">
            <el-input  size="medium" style=""  placeholder="请输入金额" clearable v-model="accountReviewSubmitData.actualAmount" >
              <el-select size="mini" v-model="accountReviewSubmitData.revenueType" slot="prepend" placeholder="请选择" style="width:100px;">
              <el-option
                v-for="item in bill_currency_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="是否已收齐:" class="form-width">
            <!-- <el-popover
              placement="bottom"
              width="150"
              trigger="manual"
              content="入账金额已达到总金额"
              v-model="tipVisible"
            >
            </el-popover> -->
            <el-switch
              v-model="payStatus"
              active-value="1"
              active-text="已收齐"
              inactive-value="0"
              inactive-color="#45a"
              inactive-text="未收齐"
            ></el-switch>
            <span class="pay-status" v-if="tipVisible">入账金额已达到总金额</span>
          </el-form-item>
          <el-form-item label="KPI周期:" class="form-width">
            <template v-if="setPeriod">
              <el-switch
                v-model="periodFlag"
                active-value="1"
                active-text="上周期"
                inactive-value="0"
                inactive-color="#45a"
                inactive-text="本周期"
              ></el-switch>
            </template>
            <template v-else>周期:{{kpiPeriod}}</template>
            <span class="pay-status pay-status-long" v-if="periodFlag == 1">上个周期月报已生成，如有需要请联系管理员更新</span>
          </el-form-item>
          <el-form-item label="是否'VIP同事推荐':"  v-if="vipModel"class="form-width">
              <el-switch
                class="mr20 "
                v-model="vipStatus"
                active-value="1"
                :active-text="'是 ( ' + vipRecommenderName + ' )'"
                inactive-value="0"
                inactive-color="#45a"
                inactive-text="否"
                :disabled ="!setPeriod"
              ></el-switch>
          </el-form-item>
          <el-form-item label="是否有折扣:" v-if="discountVisible" class="form-width">
            <el-switch
              class="mr20"
              v-model="discountFlag"
              active-value="1"
              active-text="有折扣"
              inactive-value="0"
              inactive-color="#45a"
              inactive-text="无折扣"
              :disabled="discountFlag2"
            ></el-switch>
          </el-form-item>
          <el-form-item label="是否是节假日订单：" v-if="orderTypeModel" label-width='180px'>
            <el-switch
              class="mr20"
              v-model="accountReviewListData.order.orderType"
              active-value="1"
              active-text="是"
              inactive-value="0"
              inactive-color="#45a"
              inactive-text="否"
            ></el-switch>
          </el-form-item>

          <template v-if="discountFlag == 1">
            <el-form-item label="折扣比例(%):" class="form-width">
              <el-input-number
                :controls="false"
                size="medium"
                v-model="discountProportion"
                style="width:230px"
                :disabled="discountFlag2"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="折扣说明:" class="form-width">
              <el-input
                size="medium"
                v-model="discountInfo"
                style="width:230px"
                :disabled="discountFlag2"
              ></el-input>
            </el-form-item>
          </template>
          <template v-if="gift && gift.giftArr.length">
            <div v-for="(item,i) in gift.giftArr" :key="i" style="width:100%">
              <el-form-item label="礼物名称:" class="form-width">
                <span>{{item.giftName}}</span>
              </el-form-item>
              <el-form-item label="礼物数量:" class="form-width">
                <span>{{item.giftNum}}</span>
              </el-form-item>
            </div>
          </template>
        <br>
        <el-form-item label="" style="margin:0 auto;display:block;width:75px">
          <el-button type="primary" @click="submit">确 认</el-button>
        </el-form-item>
        <span class="message" v-show="messageVisited">有相同金额入账，请注意！</span>
      </el-form>
    </el-dialog>
    <voucher-view
      :voucherViewVisible="voucherViewVisible"
      :voucherViewData="voucherViewData"
      @close="voucherViewClose"
    ></voucher-view>
  </div>
</template>
<script>
import api from '@/api/sales_assistant'
import voucherView from './voucher_view.vue'
import { fmtDate, priceToM } from '@/libs/util.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  components: { voucherView },
  name: 'accountReview',
  props: {
    accountReviewData: {
      type: Object
    },
    accountReviewVisible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String
    }
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      programList: [],
      accountReviewSubmitData: {
        revenueType: 'cny',
        actualAmount: null,
        payStatus: '1',
        periodFlag: '0'
      },
      accountReviewListData: {
        order: {},
        accountList: []
      },
      rule: {
        actualAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payStatus: [
          { required: true, message: '必填', trigger: 'blur' },
          { required: true, message: '必填', trigger: 'change' }
        ],
        commissionAmount: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      rateCircle: '',
      remark: '',
      vipStatus: '',
      vipModel: false,
      orderTypeModel: false,
      vipRecommenderName: '',
      messageVisited: false,
      // 财务收款
      confirmTime1: false,
      // 凭证弹框
      voucherViewData: {},
      voucherViewVisible: false,
      gift: {
        giftArr: []
      },
      transition: {},
      payStatus: '0',
      periodFlag: '0',
      kpiPeriod: null,
      setPeriod: true,

      discountFlag: '0',
      discountProportion: 0,
      discountInfo: '',
      discountVisible: false,
      discountFlag2: false,

      orderPrice: 0,
      enteredPrice: 0,
      loading: false,
      bill_currency_type: []
    }
  },
  computed: {
    tipVisible: {
      get: function () {
        const n = this.payStatus == 0 && this.orderPrice <= this.enteredPrice
        console.log(n, this.payStatus, this.orderPrice, this.enteredPrice)
        return n
      },
      set: function () {}
    }
  },
  watch: {
    accountReviewVisible: function (newData, oldData) {
      this.vipModel = false
      this.vipStatus = ''
      if (newData) {
        this.loading = true
        this.Togage()
        if (!this.bill_currency_type.length) {
          this.pageInit()
        }
        this.confirmTime1 = this.accountReviewData.confirmTime1
      }
    }
  },
  created () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex == this.accountReviewListData.accountList.length - 1) {
        return 'my-warning'
      }
      return ''
    },
    Togage () {
      console.log('弹框数据')
      this.getListData()
      this.getApplyDetailByApplyId()
    },
    accountReviewClose () {
      this.programList = []
      this.gift = {
        giftArr: []
      }
      this.transition = {}
      this.remark = ''
      this.rateCircle = ''
      this.orderTypeModel = false
      this.messageVisited = false
      this.periodFlag = '0'
      this.payStatus = '0'
      this.$refs.rule && this.$refs.rule.resetFields()
      this.$emit('close')
      this.discountFlag = '0'
      this.discountProportion = 0
      this.discountInfo = ''
      this.discountVisible = false
      this.discountFlag2 = false
    },
    submit () {
      this.$refs.rule.validate((valid) => {
        if (!valid) return
        this.setAccountReview()
      })
    },
    getListData () {
      api.getOrderDetailByOrderId(this.accountReviewData.orderId).then(res => {
        console.log(res.data, '订单详细数据1111111111111111')
        this.accountReviewListData.order = res.data.orderInfo
        this.programList = res.data.programInfo
        this.gift = res.data.gift
        this.transition = res.data.transition
        this.accountReviewListData.order.signDate = fmtDate(
          this.accountReviewListData.order.signDate,
          'yyyy-MM-dd'
        )
        this.orderPrice = this.accountReviewListData.order.orderPrice
        this.accountReviewListData.order.orderPrice = priceToM(
          this.accountReviewListData.order.orderPrice,
          '￥'
        )
        this.loading = false
      })
      // api
      //   .getOrderDataByOrderId(this.accountReviewData.orderId)
      //   .then((res) => {
      //     console.log("订单数据：", res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      api
        .getbillList(this.accountReviewData.orderId, {
          pageSize: 1000,
          pageNum: 1,
          confirmStatus: '1'
        })
        .then((res) => {
          console.log('订单的已入账列表', res)
          this.accountReviewListData.accountList = res.data.rows
          // 查重复
          this.accountReviewListData.accountList.forEach((v) => {
            if (v.totalInCny == this.accountReviewData.totalInCny) {
              this.messageVisited = true
            }
          })

          // this.accountReviewSubmitData.actualAmount = this.accountReviewData.actualAmount.substr(
          // 1
          // );
          // this.accountReviewSubmitData.payStatus = this.payStatus;
          this.enteredPrice = 0
          this.accountReviewListData.accountList.push({
            ...this.accountReviewData
          })
          this.accountReviewListData.accountList.forEach((v, index) => {
            this.enteredPrice += v.totalInCny * 1
            console.log('v.revenue, v.revenueType', v.revenue, v.revenueType)

            // if (v.revenueType == "usd") {
            //   v.revenueType = "美金";
            //   v.revenue = priceToM(v.revenue, "$");
            //   v.actualAmount = priceToM(v.actualAmount, "$");
            // } else if (v.revenueType == "cny") {
            //   v.revenueType = "人民币";
            //   v.revenue = priceToM(v.revenue, "￥");
            //   v.actualAmount = priceToM(v.actualAmount, "￥");
            // }
            if (this.accountReviewListData.accountList.length < index) {
              // 本次审核数据的入账金额无需格式转换，过往记录需要转换
              v.revenue = priceToM(v.revenue, '')
            }
            v.actualAmount = priceToM(v.actualAmount, v.currencyType)
            v.totalInCny = priceToM(v.totalInCny, '￥')
          })
          // this.accountReviewData.totalInCny = priceToM(this.accountReviewData.totalInCny, "￥");

          // this.enteredPrice +=
          //   this.accountReviewData.totalInCny * 1;

          this.enteredPrice = priceToM(
            Math.round(this.enteredPrice * 10) / 10,
            '￥'
          )
          if (this.accountReviewListData.accountList && this.accountReviewListData.accountList[this.accountReviewListData.accountList.length - 1].revenueType) {
            apiDic.getRate({ currencyType: this.accountReviewListData.accountList[this.accountReviewListData.accountList.length - 1].revenueType }).then(res => {
              if (res.data) {
                this.remark = this.accountReviewListData.accountList[this.accountReviewListData.accountList.length - 1].remark
                this.rateCircle = res.data.orderRate1 + ' - ' + res.data.orderRate2
              }
            })
          }
          console.log(this.accountReviewListData.accountList, 'yx456464564654')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getApplyDetailByApplyId () {
      console.log('accountReviewData详情', this.accountReviewData)
      api
        .getApplyDetailByApplyId(this.accountReviewData.applyId)
        .then((res) => {
          console.log('详情数据yx989898989', res)
          this.vipStatus = res.data.orderInfo.vipRecommendStatus
          if (res.data.orderInfo.orderType == 1) {
            this.orderTypeModel = true
          }
          this.vipRecommenderName = res.data.orderInfo.vipRecommenderName
          if (this.vipStatus == 1) {
            this.vipModel = true
          }
          this.accountReviewData.content = JSON.parse(res.data.apply.content)
          this.payStatus = this.accountReviewData.content.info.payStatus || '0'
          this.periodFlag =
            this.accountReviewData.content.info.periodFlag || '0'
          if (!res.data.kpiPeriod) {
            this.setPeriod = true
          } else {
            this.setPeriod = false
            this.kpiPeriod = res.data.kpiPeriod
          }
          // 判断是否金额折扣（第一审核人）
          if (res.data.revenueThis) {
            this.discountVisible = true
            if (
              res.data.revenueThis + res.data.revenueTotal <
              res.data.orderPrice
            ) {
              this.discountFlag = '1'
              this.discountProportion = res.data.orderInfo.discountProportion
              this.discountInfo = res.data.orderInfo.discountInfo
            }
          }
          // 判断折扣状态，（非第一审核人）
          if (
            this.accountReviewData.content.info.discountFlag == 0 ||
            this.accountReviewData.content.info.discountFlag == 1
          ) {
            this.discountFlag2 = true
            this.discountFlag = this.accountReviewData.content.info.discountFlag
            this.discountProportion = this.accountReviewData.content.info.discountProportion
            this.discountInfo = this.accountReviewData.content.info.discountInfo
          }
          this.accountReviewSubmitData.revenueType = this.accountReviewData.content.info.revenueType
        })
    },
    // 走审批流程的提交
    setAccountReview () {
      if (!this.accountReviewSubmitData.actualAmount) {
        this.$message({
          type: 'warning',
          message: '到账金额必填'
        })
        return
      }
      if (
        this.discountFlag == 1 &&
        (!this.discountProportion || !this.discountInfo)
      ) {
        this.$message({
          type: 'warning',
          message: '折扣比例与说明必填'
        })
        return
      }
      const content = this.accountReviewData.content
      const payStatus = ['未收齐', '已收齐']
      const periodFlag = ['本周期', '上周期']
      // if (this.otherData) {
      content.text.push(
        {
          label: '确认到账金额',
          value:
            this.accountReviewSubmitData.revenueType +
            ':' +
            this.accountReviewSubmitData.actualAmount
        },
        {
          label: '是否收齐',
          value: payStatus[this.payStatus]
        },
        {
          label: '订单KPI周期',
          value: !this.accountReviewSubmitData.kpiPeriod
            ? periodFlag[this.accountReviewSubmitData.periodFlag]
            : this.accountReviewSubmitData.kpiPeriod
        }
      )
      content.info.actualAmount = this.accountReviewSubmitData.actualAmount.replace(/,/g, '')
      content.info.payStatus = this.payStatus
      console.log(this.setPeriod, this.periodFlag)
      this.setPeriod && (content.info.periodFlag = this.periodFlag)
      content.info.discountFlag = this.discountFlag
      if (this.discountFlag == 1) {
        content.info.discountProportion = this.discountProportion
        content.info.discountInfo = this.discountInfo
      }
      content.info.vipRecommendStatus = this.vipStatus
      content.info.orderType = this.accountReviewListData.order.orderType
      const data = {
        applyId: this.accountReviewData.applyId,
        currencyType: this.accountReviewSubmitData.revenueType,
        approveStatus: '1',
        content: content
      }
      // let data = this.accountReviewSubmitData;
      console.log(data, '提交审核的数据yx*******')
      this.$loading()
      api.setCommAudit(data).then((res) => {
        console.log(res.data)
        this.$message({
          type: 'success',
          message: '确定成功!'
        })
        this.accountReviewSubmitData = {
          payStatus: null,
          actualAmount: null
        }
        this.$loading().close()
        this.$emit('submit')
        this.accountReviewClose()
      })
    },
    // 凭证弹框
    viewVoucher (billId, orderId, applyId) {
      this.voucherViewData.applyId = applyId
      this.voucherViewData.billId = billId
      this.voucherViewData.orderId = orderId
      this.voucherViewVisible = true
    },
    // 凭证弹框关闭
    voucherViewClose () {
      this.voucherViewVisible = false
      this.voucherViewData = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer222 {
  text-align: center;
}
.header {
  margin-bottom: 20px;
  padding:0 20px;
}
.inl {
  margin: 5px 0px;
  padding-right:10px;
  display: inline-block;
  width: 20%;
  color: #222;
  .num-text{
    font-size:20px;
    font-weight:700;
  }
}
 .el-card__header{
  padding: 7px 15px
}
.program-text{
  height:72px;
  text-align:center;
}
.program-text-title{
  height:36px;
  margin-bottom:5px;
  font-weight:600;
}
.item {
  color: red;
}
.title {
  /* font-size: 16px; */
  color: #222;
  width: 250px;
}
.redBlod {
  color: red;
}
.my-warning {
  background-color: red;
  color: red;
}
.tips {
  text-align: right;
  margin: 0 50px;
  color: darkgray;
}
.message {
  color: #fff;
  background-color: #89001d;
  margin-left: 20px;
  padding: 5px;
}
.pay-status {
  position: absolute;
  top: -40px;
  left: -10px;
  width: 150px;
  padding: 0 10px;
  /* background-color: #89001d; */
  border: 1px #89001d dashed;
  background-color: #fff;
  z-index: 9;
}
.pay-status-long {
  width: 320px;
}
.form-width{
  width:450px;
}
</style>
