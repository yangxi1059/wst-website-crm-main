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
          <el-select
            style="width:160px"
            v-model="applyStatus"
            size="mini"
            clearable
            filterable
            class="mr10"
            placeholder="申请状态"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in apply_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
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
        @row-dblclick="detail"
        highlight-current-row
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
          <template slot-scope="scope">{{applyStatusS.length && applyStatusS[scope.row.applyStatus].itemName}}</template>
        </el-table-column>
        <el-table-column prop="createByName" align="center" label="申请人" min-width="100"></el-table-column>
        <el-table-column prop="createTime" align="center" label="申请时间" min-width="100"></el-table-column>
      </el-table>
      <mentor-pay :mentorPayVisible="mentorPayVisible" :applyData="applyData" @close="mentorPayClose"></mentor-pay>
      <!-- <brokerage-detail
        :brokerageDetailVisible="brokerageDetailVisible"
        :applyData="applyData"
        @close="brokerageDetailClose"
      />-->
      <bd-detail :bdDetailVisible="bdDetailVisible" :applyData="applyData" @close="bdDetailClose" />
      <sign-refund-detail
        :signRefundVisible="signRefundVisible"
        :applyData="applyData"
        @close="signRefundDetailClose"
      />
      <order-entry-detail
        :orderEntryDetailVisible="orderEntryDetailVisible"
        :applyData="applyData"
        @close="orderEntryDetailClose"
      />
      <signOffer :signOfferVisible="signOfferVisible" :applyData="applyData" @close="signOfferClose" />
      <reimbursement-detail
        :reimbursementDetailVisible="reimbursementDetailVisible"
        :applyData="applyData"
        @close="reimbursementDetailClose"
      />
      <vacate-detail
        :vacateDetailVisible="vacateDetailVisible"
        :applyData="applyData"
        @close="vacateDetailClose"
      />
      <overtime-detail
        :overtimeDetailVisible="overtimeDetailVisible"
        :applyData="applyData"
        @close="overtimeDetailClose"
      />
      <pay-record-detail
        :payRecordDetailVisible="payRecordDetailVisible"
        :applyData="applyData"
        @close="payRecordDetailClose"
      />
      <recommendDetail
        :recommendDetailVisible="recommendDetailVisible"
        :applyData="applyData"
        @close="recommendDetailClose"
      />
      <menteeFileDetail
        :menteeFileVisible="menteeFileVisible"
        :applyData="applyData"
        @close="menteeFileClose"
      />
      <!-- <mentorPaymentExtraDetail
        :mentorPaymentExtraDetailVisible="mentorPaymentExtraDetailVisible"
        :applyData="applyData"
        @close="mentorPaymentExtraDetailClose"
      />-->
      <oneTooneDetail
        :oneTooneDetailVisible="oneTooneDetailVisible"
        :applyData="applyData"
        @close="oneTooneClose"
      />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import mentorPay from './components/mentor_pay_apply.vue'
// import brokerageDetail from "./components/brokerage_detail.vue";
import signRefundDetail from './components/sign_refund_detail.vue'
import bdDetail from './bd/detail'
import orderEntryDetail from './order_entry/detail'
import signOffer from './offer/apply.vue'
import reimbursementDetail from './reimbursement/detail.vue'
import vacateDetail from './vacate/detail.vue'
import payRecordDetail from './components/pay_record_detail.vue'
import overtimeDetail from './overtime/detail.vue'
import recommendDetail from './recommend/detail.vue'
import menteeFileDetail from './mentee_file/detail.vue'
import oneTooneDetail from './oneToone/oneTooneDetail.vue'
import mixins from '@/plugin/mixins'

// import mentorPaymentExtraDetail from "./mentor_payment_extra/detail.vue";
var _this = this
export default {
  name: 'audit',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: {
    mentorPay,
    // brokerageDetail,
    bdDetail,
    signRefundDetail,
    orderEntryDetail,
    signOffer,
    reimbursementDetail,
    vacateDetail,
    payRecordDetail,
    overtimeDetail,
    recommendDetail,
    menteeFileDetail,
    oneTooneDetail
    // mentorPaymentExtraDetail
  },
  mixins: [mixins],
  data () {
    _this = this
    return {
      approveList: [],
      loading: false,
      search: '',
      pageNum: 1,
      total: 0,
      userId: 'ALL',
      pageSize: 400,
      users: [],
      applyType: null,
      applyStatusS: [],
      mentorPayApproveVisible: false,
      applyData: {},
      mentorPayVisible: false,
      // brokerageDetailVisible: false,
      bdDetailVisible: false,
      signRefundVisible: false,
      orderEntryDetailVisible: false,
      signOfferVisible: false,
      reimbursementDetailVisible: false,
      vacateDetailVisible: false,
      overtimeDetailVisible: false,
      payRecordDetailVisible: false,
      recommendDetailVisible: false,
      oneTooneDetailVisible: false,
      // mentorPaymentExtraDetailVisible: false,
      menteeFileVisible: false,

      apply_type: [],
      applyStatus: '',
      apply_status: []
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
      this.apply_status = await this.getDictionary('apply_status')
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        applyType: this.applyType,
        userId: 'ALL',
        applyStatus: this.applyStatus,
        allApplyType: this.roleInfo.split(',')
          .filter((v) => /^all_audit/.test(v))
          .join(',')
      }
      this.loading = true
      console.log(data)
      api.getApproveListByApplyId('ALL', data).then((res) => {
        console.log('全部申请列表', res)
        this.total = res.data.total
        this.approveList = res.data.rows
        this.loading = false
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
      if (v.applyType == 'sign_refund') {
        // this.signRefundVisible = true;
        this.recommendDetailVisible = true
      } else if (v.applyType == 'brokerage') {
        this.recommendDetailVisible = true
        // this.brokerageDetailVisible = true;
      } else if (v.applyType == 'bd_expenditure') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'cooperator_salary') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'order_entry') {
        this.orderEntryDetailVisible = true
      } else if (v.applyType == 'offer_apply') {
        this.signOfferVisible = true
      } else if (v.applyType == 'reimbursement') {
        // 报销
        this.reimbursementDetailVisible = true
      } else if (v.applyType == 'vacate') {
        this.vacateDetailVisible = true
      } else if (v.applyType == 'overtime_working') {
        this.overtimeDetailVisible = true
      } else if (v.applyType == 'mentor_payment') {
        this.mentorPayVisible = true
      } else if (v.applyType == 'pay_record') {
        this.payRecordDetailVisible = true
      } else if (v.applyType == 'vip_lesson') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'recommend_bonus') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'mentor_payment_extra') {
        this.recommendDetailVisible = true
        // this.mentorPaymentExtraDetailVisible = true;
      } else if (v.applyType == 'internship_offer_payment') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'application_letter') {
        this.menteeFileVisible = true
      } else if (v.applyType == 'ambassador_salary') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'cooperator_contract_fund') {
        this.recommendDetailVisible = true
      } else if (v.applyType == 'vip_office_hour_lesson') {
        this.oneTooneDetailVisible = true
      } else {
        this.recommendDetailVisible = true
      }
      this.applyData = v
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
    mentorPayClose () {
      console.log('导师酬金支付关闭')
      this.mentorPayVisible = false
    },
    // brokerageDetailClose() {
    //   console.log("返佣支付关闭");
    //   this.brokerageDetailVisible = false;
    // },
    bdDetailClose () {
      console.log('bd支付关闭')
      this.bdDetailVisible = false
    },
    signRefundDetailClose () {
      console.log('退款出纳关闭')
      this.signRefundVisible = false
    },
    orderEntryDetailClose () {
      this.orderEntryDetailVisible = false
    },
    signOfferClose () {
      console.log('offer关闭')
      this.signOfferVisible = false
    },
    reimbursementDetailClose () {
      console.log('reimbursementDetail关闭')
      this.reimbursementDetailVisible = false
    },
    vacateDetailClose () {
      console.log('vacateDetail关闭')
      this.vacateDetailVisible = false
    },
    overtimeDetailClose () {
      console.log('overtimeDetail关闭')
      this.overtimeDetailVisible = false
    },
    recommendDetailClose () {
      console.log('overtimeDetail关闭')
      this.recommendDetailVisible = false
    },
    menteeFileClose () {
      this.menteeFileVisible = false
    },
    oneTooneClose () {
      this.oneTooneDetailVisible = false
    }
    // mentorPaymentExtraDetailClose() {
    //   this.mentorPaymentExtraDetailVisible = false;
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
