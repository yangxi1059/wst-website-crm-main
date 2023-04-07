<template>
  <d2-container>
    <div class="mentor-commisson-apply">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:160px"
            v-model="search"
            clearable
            placeholder="支持申请标题、申请ID"
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-select
            style="width:160px"
            v-model="applyType"
            size="mini"
            clearable
            filterable
            class="mr10"
            placeholder="申请类型"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in apply_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" class="" size="mini" plain @click="Topage(1)">GO</el-button>
          <el-button icon="el-icon-plus" class="" size="mini" plain @click="otherCost()"
            v-if="roleInfo.includes(`cashier_other_cost_pay`)">其他运营成本(手动录入)</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="approveList"
        size="mini"
        v-loading="loading"
        highlight-current-row
        @row-dblclick="detail"
        style="width: 100%"
      >
        <el-table-column prop="applyId" align="center" label="申请ID" min-width="100"></el-table-column>
        <el-table-column prop="" align="center" label="申请类型" min-width="100">
          <template slot-scope="scope">
            {{scope.row.applyType | showApplyType }}
          </template>
        </el-table-column>
        <el-table-column prop="applyTitle" align="center" label="申请标题" min-width="100"></el-table-column>
        <el-table-column prop="applyStatus" align="center" label="申请状态" min-width="100">
          <template slot-scope="scope">{{applyStatusS[scope.row.applyStatus].itemName}}</template>
        </el-table-column>
        <el-table-column prop="applyerName" align="center" label="申请人" min-width="100"></el-table-column>
        <el-table-column prop="applyTime" align="center" label="申请时间" min-width="100"></el-table-column>
      </el-table>
      <mentor-pay
        :mentorPayVisible="mentorPayVisible"
        :payData="payData"
        @close="mentorPayClose"
        @submit="mentorPaySubmit"
      ></mentor-pay>
      <recommend-cashier
        :recommendCashierVisible="recommendCashierVisible"
        :payData="payData"
        @close="recommendCashierClose"
        @submit="recommendCashierSubmit"
      />
      <recommendCashierV2
        :recommendCashierV2Visible="recommendCashierV2Visible"
        :payData="payData"
        @close="recommendCashierV2Close"
        @submit="recommendCashierV2Submit"
      />
      <sign-refund-cashier
        :signRefundCashierVisible="signRefundCashierVisible"
        :payData="payData"
        @close="signRefundCashierClose"
        @submit="signRefundCashierSubmit"
      />
      <pay-record-detail
        :payRecordDetailVisible="payRecordDetailVisible"
        :applyData="payData"
        @close="payRecordDetailClose"
      />
      <other-cost-pay :addVisible="addVisible" @close="addClose" @submit="addSubmit" />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import mentorPay from './components/mentor_pay.vue'
import recommendCashier from './recommend/cashier.vue'
import recommendCashierV2 from './recommend/cashierV2.vue'
import signRefundCashier from './components/sign_refund_cashier.vue'
import payRecordDetail from './components/pay_record_detail.vue'
import otherCostPay from './components/other_cost_pay.vue'
import mixins from '@/plugin/mixins'

var _this = ''
export default {
  name: 'audit',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: {
    mentorPay,
    recommendCashier,
    recommendCashierV2,
    payRecordDetail,
    signRefundCashier,
    otherCostPay
  },
  mixins: [mixins],
  data () {
    _this = this
    return {
      approveList: [],
      loading: false,
      pageSize: 400,
      search: '',
      pageNum: 1,
      total: 0,
      userId: 'ALL',
      users: [],
      applyStatusS: [],
      apply_type: [],
      applyStatus: '',
      applyType: '',

      mentorPayApproveVisible: false,
      applyData: {},
      mentorPayVisible: false,
      // mentorPaymentExtraVisible: false,
      // brokerageCashierVisible: false,
      recommendCashierVisible: false,
      recommendCashierV2Visible: false,
      // bdCashierVisible: false,
      signRefundCashierVisible: false,
      payRecordDetailVisible: false,
      payData: {},
      addVisible: false
    }
  },
  filters: {
    showApplyType: function (value) {
      let val = ''
      _this.apply_type.forEach(v => {
        if (v.itemValue == value) val = v.itemName
      })
      return val
    }
  },
  mounted () {
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.apply_type = await this.getDictionary('apply_type')
      this.applyStatusS = await this.getDictionary('apply_status')
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: 'ALL_Data',
        applyStatus: this.applyStatus,
        applyType: this.applyType
      }
      console.log(data)
      this.loading = true
      api.getCashierList(data).then(res => {
        console.log('审核列表', res)
        this.total = res.data.total
        this.loading = false
        this.approveList = res.data.rows
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    detail (v) {
      console.log('详情', v)
      if (v.applyType == 'brokerage') {
        // this.brokerageCashierVisible = true;
        this.recommendCashierVisible = true
      } else if (v.applyType == 'recommend_bonus') {
        this.recommendCashierVisible = true
      } else if (v.applyType == 'bd_expenditure') {
        this.recommendCashierVisible = true
        // this.bdCashierVisible = true;
      } else if (v.applyType == 'cooperator_contract_fund') {
        this.recommendCashierVisible = true
      } else if (v.applyType == 'ambassador_salary') {
        this.recommendCashierVisible = true
      } else if (v.applyType == 'academic_mentor_bonus') {
        this.recommendCashierVisible = true
      } else if (v.applyType == 'sign_refund') {
        this.recommendCashierVisible = true
        // this.signRefundCashierVisible = true;
      } else if (v.applyType == 'other_operate_cost') {
        this.recommendCashierVisible = true
      } else if (v.applyType == 'pretalk_brokerage') {
        this.recommendCashierVisible = true
      } else if (v.applyType == 'job_interview_fee') {
        this.recommendCashierV2Visible = true
      } else if (v.applyType == 'job_offer_fee') {
        this.recommendCashierV2Visible = true
      } else if (v.applyType == 'pay_record') {
        // 财务录入的支付记录
        this.payRecordDetailVisible = true
        // } else if (v.applyType == "mentor_payment") {
        //   this.mentorPayVisible = true;
        // } else if (v.applyType == "mentor_payment_extra") {
        // this.mentorPaymentExtraVisible = true;
      }
      this.payData = v
    },
    payRecordDetailClose () {
      console.log('payRecordDetail关闭')
      this.payRecordDetailVisible = false
    },
    reject (v) {
      console.log('驳回', v)
    },
    mentorPayApproveClose () {
      console.log('审核导师酬金关闭')
      this.mentorPayApproveVisible = false
    },
    mentorPayApproveSubmit () {
      console.log('审核导师酬金提交')
      this.Topage(1)
      this.mentorPayApproveClose()
    },
    mentorPayApproveSubmitToPay () {
      console.log('审核导师酬金提交转支付')
      this.mentorPayApproveClose()
      this.mentorPayVisible = true
      this.payData = this.applyData
    },
    mentorPayClose () {
      console.log('导师酬金支付关闭')
      this.mentorPayVisible = false
    },
    mentorPaySubmit () {
      console.log('导师酬金支付提交')
      this.Topage(1)
      this.mentorPayClose()
    },
    // mentorPaymentExtraClose() {
    //   console.log("导师薪资关闭");
    //   this.mentorPaymentExtraVisible = false;
    // },
    // mentorPaymentExtraSubmit() {
    //   console.log("导师薪资提交");
    //   this.Topage(1);
    //   this.mentorPaymentExtraClose();
    // },
    // brokerageCashierClose() {
    //   console.log("返佣支付关闭");
    //   this.brokerageCashierVisible = false;
    // },
    // brokerageCashierSubmit() {
    //   console.log("返佣支付提交");
    //   this.Topage(1);
    //   this.brokerageCashierClose();
    // },
    recommendCashierV2Close () {
      this.recommendCashierV2Visible = false
    },
    recommendCashierClose () {
      this.recommendCashierVisible = false
    },
    recommendCashierV2Submit () {
      this.Topage(1)
      this.recommendCashierV2Close()
    },
    recommendCashierSubmit () {
      this.Topage(1)
      this.recommendCashierClose()
    },
    // bdCashierClose() {
    //   console.log("bd支付关闭");
    //   this.bdCashierVisible = false;
    // },
    // bdCashierSubmit() {
    //   console.log("bd支付提交");
    //   this.Topage(1);
    //   this.bdCashierClose();
    // },
    signRefundCashierClose () {
      console.log('退款出纳关闭')
      this.signRefundCashierVisible = false
    },
    signRefundCashierSubmit () {
      console.log('退款出纳提交')
      this.Topage(1)
      this.signRefundCashierClose()
    },
    /**
     * @description: 增加其他运营成本
     * @param {*}
     * @return {*}
     */
    otherCost () {
      this.addVisible = true
    },
    addClose () {
      this.addVisible = false
    },
    addSubmit () {
      this.addClose()
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
