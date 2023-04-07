<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'入账审核'"
      :visible.sync="orderEntryAuditVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-descriptions title="" class="mb10" size="medium" :column='2'>
        <el-descriptions-item label="申请人">{{refundData.apply.createByName}}</el-descriptions-item>
        <el-descriptions-item label="申请状态">{{refundData.apply.applyStatusName}}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{refundData.apply.createTime}}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions v-if="refundData.content" title="" class="mb10" size="medium" :column='2'>
        <el-descriptions-item v-for="(item,i) in refundData.content.text" :key="i" :label="item.label">
          <div v-if="item.label == '汇率'">
            <span v-if="rateCircle">{{item.value}} （当前汇率：{{rateCircle}}）</span>
            <span v-else>{{item.value}}</span>
          </div>
          <div v-else>
            <span>{{item.value}}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item v-if="!canSubmit" label="是否VIP同事推荐">
          <pre>{{vipStatusLst[vipStatus]}}</pre>
        </el-descriptions-item>
        <el-descriptions-item v-if="!canSubmit && vipStatus == 1" label="VIP同事推荐人">
          <pre>{{vipRecommenderName}}</pre>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mb10" v-if="refundData.content" title=""  size="medium" :column='2'>
        <el-descriptions-item :label="`凭证 ${++i}`" v-for="(item,i) in refundData.content.file" :key="i">
          <el-button @click="download(item.url)" size="mini">查看</el-button>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions class="mt10" title=""  size="medium" :column='2'>
          <el-descriptions-item label="审核人">
            <span  class="" v-html="approval"></span>
          </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mb10" v-if="copyTo" title=""  size="medium" :column='2'>
          <el-descriptions-item label="抄送人">
            <span  class="" >{{copyTo}}</span>
          </el-descriptions-item>
      </el-descriptions>

      <el-descriptions v-if="revenueThis" class="mb10"  title=""  size="medium" :column='2'>
          <el-descriptions-item label="订单总金额"><span >{{orderPrice}}</span></el-descriptions-item>
          <el-descriptions-item label="已入账金额"><span >{{revenueTotal}}</span></el-descriptions-item>
      </el-descriptions>

      <template v-if="canSubmit && otherData" class="mb10">
        <div style="width:100%;display:block;overflow:hidden;">
          <el-col :span="4" class="_item-name">本笔到账金额</el-col>
          <el-col :span="6" class="_item-value">
            <el-input placeholder="本笔到账金额" style="" v-model="accountReviewSubmitData.actualAmount" >
              <el-select v-model="accountReviewSubmitData.revenueType" slot="prepend" placeholder="本笔到账金额类型" style="width:100px;">
              <el-option
                  v-for="item in bill_currency_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-input>
          </el-col>
        </div>
        <div style="width:100%;display:block;overflow:hidden;margin-top:10px">
          <el-col :span="4" class="_item-name">是否收齐</el-col>
          <el-col :span="8" class="_item-value">
              <el-switch
                class=""
                v-model="accountReviewSubmitData.payStatus"
                active-value="1"
                active-text="已收齐"
                inactive-value="0"
                inactive-color="#45a"
                inactive-text="未收齐"
              ></el-switch>
          </el-col>
        </div>
        <div style="width:100%;display:block;overflow:hidden;margin-top:10px">
          <el-col :span="4" class="_item-name">订单KPI周期</el-col>
          <el-col :span="4" class="_item-value" v-if="!refundData.kpiPeriod">
            <el-switch
              v-model="accountReviewSubmitData.periodFlag"
              active-value="1"
              active-text="上周期"
              inactive-value="0"
              inactive-color="#45a"
              inactive-text="本周期"
            ></el-switch>
          </el-col>
          <el-col :span="4" class="_item-value" v-else>
            <div class="">{{refundData.kpiPeriod}}</div>
          </el-col>
        </div>
        <div style="width:100%;display:block;overflow:hidden;margin-top:10px">
          <el-col :span="6" class="_item-name" v-if="vipModel">是否批准此笔为“VIP同事推荐“</el-col>
          <el-col :span="12" class=" _item-value" v-if="vipModel">
            <el-switch
              class=" "
              v-model="vipStatus"
              active-value="1"
              :active-text="'批准，有VIP同事 ( ' + vipRecommenderName + ' )'"
              inactive-value="0"
              inactive-color="#45a"
              inactive-text="不批准"
              :disabled="kpiStatus"
            ></el-switch>
          </el-col>
        </div>
        <div style="width:100%;display:block;overflow:hidden;margin-top:10px">
            <el-col :span="4" class="_item-name" v-if="orderTypeModel">是否节假日订单</el-col>
            <el-col :span="4" class=" _item-value" v-if="orderTypeModel">
                <el-switch
                  class=""
                  v-model="orderType"
                  active-value="1"
                  active-text="是"
                  inactive-value="0"
                  inactive-color="#45a"
                  inactive-text="否"
                ></el-switch>
              </el-col>
        </div>
        <div style="width:100%;display:block;overflow:hidden;margin-top:10px">
            <el-col :span="4" class="_item-name" v-if="discountVisible">有无折扣</el-col>
            <el-col :span="4" class=" _item-value" v-if="discountVisible">
                <el-switch
                  class=""
                  v-model="discountFlag"
                  active-value="1"
                  active-text="有折扣"
                  inactive-value="0"
                  inactive-color="#45a"
                  inactive-text="无折扣"
                  :disabled="discountFlag2"
                ></el-switch>
              </el-col>
        </div>
        <div style="width:100%;display:block;overflow:hidden;margin-top:10px">
          <el-row class="mb10" v-if="discountFlag == 1">
            <el-col :span="4" class="_item-name">折扣比例(%)</el-col>
            <el-col :span="4" class="_item-value">
              <el-input-number
                :controls="false"
                size="mini"
                v-model="discountProportion"
                style="width:130px;margin-right:30px"
                clearable
                :disabled="discountFlag2"
              ></el-input-number>
            </el-col>
            <el-col :span="4" class="_item-name">折扣说明</el-col>
            <el-col :span="12" class="_item-value">
              <el-input
                size="mini"
                v-model="discountInfo"
                style="width:400px;margin-right:30px"
                maxlength="99"
                :disabled="discountFlag2"
              ></el-input>
            </el-col>
          </el-row>
        </div>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
      </span>
    </el-dialog>
    <orderDetail
      :orderDetailVisible="orderDetailVisible"
      :orderId="orderId"
      @close="orderDetailClose"
    ></orderDetail>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import orderDetail from '../../monthly_report/components/order_detail.vue'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'

export default {
  name: 'orderEntryAudit',
  components: { orderDetail },
  mixins: [mixins],
  props: {
    applyData: {
      type: Object
    },
    orderEntryAuditVisible: {
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
        pay: {},
        kpiPeriod: null
      },
      USERINFO: util.sessions.get('userInfo'),
      vipStatus: '',
      vipModel: false,
      orderTypeModel: false,
      orderType: '',
      vipRecommenderName: '',
      approval: '',
      copyTo: '',
      account: '',
      totalRefund: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      otherData: false,
      orderDetailVisible: false,
      orderId: '',
      vipStatusLst: ['否', '是'],
      accountReviewSubmitData: {
        revenueType: 'cny',
        actualAmount: 0,
        payStatus: 1,
        periodFlag: 1
      },
      rule: {},
      revenueThis: null,
      revenueTotal: null,
      orderPrice: null,
      discountFlag: '0',
      discountProportion: 0,
      discountInfo: '',
      discountVisible: false,
      discountFlag2: false,
      kpiStatus: false,
      bill_currency_type: [],
      rateCircle: ''
    }
  },
  computed: {},
  watch: {
    orderEntryAuditVisible: function (newData, oldData) {
      if (newData) {
        this.pageInit()
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      if (!this.bill_currency_type.length) {
        this.bill_currency_type = await this.getDictionary('bill_currency_type')
      }
      console.log('applyData详情', this.applyData)
      api.getApplyDetailByApplyId(this.applyData.applyId).then((res) => {
        console.log('详情数据yx1111111111', res.data.revenueThis)
        // 判断是否金额折扣（第一审核人）
        if (res.data.orderInfo.orderType == 1) {
          this.orderTypeModel = true
        }
        this.orderType = res.data.orderInfo.orderType
        this.vipStatus = res.data.orderInfo.vipRecommendStatus
        this.vipRecommenderName = res.data.orderInfo.vipRecommenderName
        if (this.vipStatus == 1) {
          this.vipModel = true
        }
        if (res.data.revenueThis) {
          this.discountVisible = true
          this.revenueThis = res.data.revenueThis
          this.revenueTotal = res.data.revenueTotal
          this.orderPrice = res.data.orderPrice
          if (
            res.data.revenueThis + res.data.revenueTotal <
            res.data.orderPrice
          ) {
            this.discountFlag = '1'
            this.discountProportion = res.data.orderInfo.discountProportion
            this.discountInfo = res.data.orderInfo.discountInfo
          }
        }
        if (res.data.kpiPeriod) {
          this.kpiStatus = true
        } else {
          this.kpiStatus = false
        }
        this.refundData = {
          pay: res.data.pay,
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval,
          kpiPeriod: res.data.kpiPeriod
        }
        console.log(this.refundData, 'yx*******入账审核')
        if (this.refundData.content.info && this.refundData.content.info.revenueType) {
          apiDic.getRate({ currencyType: this.refundData.content.info.revenueType }).then(res => {
            console.log(res, 'ghhrgueg*************')
            if (res.data) {
              this.rateCircle = res.data.orderRate1 + ' - ' + res.data.orderRate2
            }
          })
        } else {
          console.log(11111111111111)
        }
        // rateCircle
        // 判断折扣状态，（非第一审核人）
        if (
          this.refundData.content.info.discountFlag == 0 ||
          this.refundData.content.info.discountFlag == 1
        ) {
          this.discountFlag2 = true
          this.discountFlag = this.refundData.content.info.discountFlag
          this.discountProportion = this.refundData.content.info.discountProportion
          this.discountInfo = this.refundData.content.info.discountInfo
        }
        this.accountReviewSubmitData.revenueType = this.refundData.content.info.revenueType
        this.account = ''
        this.account = this.refundData.content.info.payAccount
        console.log(this.account, this.refundData.content.info.payAccount)
        this.totalRefund = ''
        this.totalRefund =
          this.refundData.content.info.expenditureType +
          this.refundData.content.info.expenditureAmount
        this.approval = ''
        let point = true
        this.otherData = res.data.approval[0].approveStatus == 0
        res.data.approval.forEach((v) => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${
            v.approveTime || ''
          } ${v.msg || ''}</p>`
          if (point && v.approveStatus == 0) {
            if (v.approverId === this.USERINFO.userId || v.approverId.indexOf(this.USERINFO.userId) != '-1') {
              this.canSubmit = true
            }
            point = false
          }
        })
        this.copyTo = ''
        res.data.copyTo.forEach((v) => {
          this.copyTo += v.copyToName + '; '
        })
      })
    },
    // 关闭
    handleClose () {
      this.rateCircle = ''
      this.kpiStatus = false
      this.orderType = ''
      this.orderTypeModel = false
      // this.$refs.refundData.resetFields();
      this.vipModel = false
      this.vipStatus = ''
      this.$emit('close')
      this.refundData = {
        apply: {},
        copyTo: [],
        approval: [],
        content: {},
        pay: {},
        kpiPeriod: null
      }
      this.approval = ''
      this.copyTo = ''
      this.totalRefund = ''
      this.account = ''
      this.canSubmit = false
      this.accountReviewSubmitData = {
        revenueType: 'cny',
        actualAmount: 0,
        payStatus: 1,
        periodFlag: 1
      }
      this.revenueThis = null
      this.revenueTotal = null
      this.orderPrice = null
      this.discountFlag = '0'
      this.discountProportion = 0
      this.discountInfo = ''
      this.discountVisible = false
      this.discountFlag2 = false
    },
    download (val) {
      downloadFun(val)
    },
    // 确认
    submit () {
      if (!this.accountReviewSubmitData.actualAmount && this.otherData) {
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
      this.$confirm('是否确认通过此审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const content = this.refundData.content
        const payStatus = ['未收齐', '已收齐']
        const periodFlag = ['本周期', '上周期']
        if (this.otherData) {
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
              value: payStatus[this.accountReviewSubmitData.payStatus]
            },
            {
              label: '订单KPI周期',
              value: !this.refundData.kpiPeriod
                ? periodFlag[this.accountReviewSubmitData.periodFlag]
                : this.refundData.kpiPeriod
            }
          )
          console.log(content, 'yx****45154')
          content.info.actualAmount = this.accountReviewSubmitData.actualAmount
          content.info.payStatus = this.accountReviewSubmitData.payStatus
          !this.refundData.kpiPeriod &&
            (content.info.periodFlag = this.accountReviewSubmitData.periodFlag)
          content.info.discountFlag = this.discountFlag
          if (this.discountFlag == 1) {
            content.info.discountProportion = this.discountProportion
            content.info.discountInfo = this.discountInfo
          }
          content.info.vipRecommendStatus = this.vipStatus
          content.info.orderType = this.orderType
        }
        const data = {
          applyId: this.refundData.apply.applyId,
          currencyType: this.accountReviewSubmitData.revenueType,
          approveStatus: '1',
          content: content
        }
        console.log(data, '提交审核的数据yx*******')
        api
          .setAuditRefund(data)
          .then((res) => {
            console.log('入账申请', res)
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
            .then((res) => {
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
    },
    viewOrderDeatil (orderId) {
      console.log(orderId)
      this.orderId = orderId
      this.orderDetailVisible = true
    },
    orderDetailClose () {
      console.log('order detail close')
      this.orderDetailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select .el-input {
    width: 130px;
  }
.el-input-group__prepend{
  width: 120px !important;
}
</style>
