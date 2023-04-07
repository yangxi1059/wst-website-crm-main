<template>
  <d2-container>
    <div class="mentor-commisson-apply">
      <div class="search_page">
        <div class="search">
          <el-input
            style="width:160px"
            class="mr10"
            size="mini"
            v-model="search"
            clearable
            placeholder="支持申请标题、申请ID、申请人"
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
          <el-select
            style="width:160px"
            v-model="approveStatus"
            size="mini"
            filterable
            clearable
            class="mr10"
            placeholder="审核状态"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in approve_status"
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
          <template slot-scope="scope">
            <span :class="Myclass[scope.row.applyStatus]">{{applyStatusS.length && applyStatusS[scope.row.applyStatus].itemName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" align="center" label="申请人" min-width="100"></el-table-column>
        <el-table-column prop="createTime" align="center" label="申请时间" min-width="100"></el-table-column>
      </el-table>

      <mentor-pay-approve
        :mentorPayApproveVisible="mentorPayApproveVisible"
        :applyData="applyData"
        @close="mentorPayApproveClose"
        @submit="mentorPayApproveSubmit"
        @submitToPay="mentorPayApproveSubmitToPay"
      ></mentor-pay-approve>
      <sign-refund
        :signRefundVisible="signRefundVisible"
        :applyData="applyData"
        @close="signRefundClose"
        @submit="signRefundSubmit"
      ></sign-refund>
      <offer-audit
        :offerVisible="offerVisible"
        :applyData="applyData"
        @close="offerClose"
        @submit="offerSubmit"
      />
      <orderEntryAudit
        :orderEntryAuditVisible="orderEntryAuditVisible"
        :applyData="applyData"
        @close="orderEntryClose"
        @submit="orderEntrySubmit"
      />
      <orderSupplementaryAudit
        :orderSupplementaryAuditVisible="orderSupplementaryAuditVisible"
        :applyData="applyData"
        @close="orderSupplementaryAuditClose"
        @submit="orderSupplementaryAuditSubmit"
      />
      <mentor-pay
        :mentorPayVisible="mentorPayVisible"
        :payData="payData"
        @close="mentorPayClose"
        @submit="mentorPaySubmit"
      ></mentor-pay>
      <pay-record-detail
        :payRecordDetailVisible="payRecordDetailVisible"
        :applyData="applyData"
        @close="payRecordDetailClose"
      />
      <recommendAudit
        :recommendVisible="recommendVisible"
        :applyData="applyData"
        @close="recommendClose"
        @submit="recommendSubmit"
      />
      <bdExpenditure
        :recommendVisible="bdExpenditureVisible"
        :applyData="applyData"
        @close="bdExpenditureClose"
        @submit="bdExpenditureSubmit"
      />
      <contractFund
        :recommendVisible="contractFundVisible"
        :applyData="applyData"
        @close="contractFundClose"
        @submit="contractFundSubmit"
      />
      <ambassadorSalary
        :recommendVisible="ambassadorSalaryVisible"
        :applyData="applyData"
        @close="ambassadorSalaryClose"
        @submit="ambassadorSalarySubmit"
      />
      <mentorPaymentExtra
        :mentorPaymentExtraVisible="mentorPaymentExtraVisible"
        :applyData="applyData"
        @close="mentorPaymentExtraClose"
        @submit="mentorPaymentExtraSubmit"
      />
      <academicMentorBonus
        :academicMentorBonusVisible="academicMentorBonusVisible"
        :applyData="applyData"
        @close="academicMentorBonusClose"
        @submit="academicMentorBonusSubmit"
      />
      <internshipPay
        :internshipPayVisible="internshipPayVisible"
        :applyData="applyData"
        @close="internshipPayClose"
        @submit="internshipPaySubmit"
      />
      <menteeFile
        :menteeFileVisible="menteeFileVisible"
        :applyData="applyData"
        @close="menteeFileClose"
        @submit="menteeFileSubmit"
      />
      <cooperatorContractInfo
        :recommendVisible="cooperatorContractInfoVisible"
        :applyData="applyData"
        @close="cooperatorContractInfoClose"
        @submit="cooperatorContractInfoSubmit"
      />
      <oneTononeAudit
        :oneTononeAuditVisible="oneTononeAuditVisible"
        :applyData="applyData"
        @close="oneTononeAuditClose"
        @submit="oneTononeAuditSubmit"
      />
      <commMentorReferralFee
        :commMentorReferralVisible="commMentorReferralVisible"
        :applyData="applyData"
        @close="commMentorReferralClose"
        @submit="commMentorReferralSubmit"
      />
      <commMentorWithdrawal
        :commMentorWithdrawalVisible="commMentorWithdrawalVisible"
        :applyData="applyData"
        @close="commMentorWithdrawalClose"
        @submit="commMentorWithdrawalSubmit"
      />
      <documentReview
        :documentReviewVisible="documentReviewVisible"
        :applyData="applyData"
        @close="documentReviewClose"
        @submit="documentReviewSubmit"
      />

    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import mentorPayApprove from './components/mentor_pay_approve.vue'
import mentorPay from './components/mentor_pay.vue'
import signRefund from './components/sign_refund.vue'
import commMentorReferralFee from './components/mentor_recommend_apply.vue'
import commMentorWithdrawal from './components/mentor_wallket_apply.vue'
import documentReview from './documentReview/audit.vue'

import bdExpenditure from './bd/activity_fund_audit.vue'
import contractFund from './bd/contract_fund_audit.vue'
import cooperatorContractInfo from './bd/contract_audit.vue'
import ambassadorSalary from './bd/ambassador_salary_audit.vue'
import offerAudit from './offer/audit.vue'
import orderEntryAudit from './order_entry/audit.vue'
import orderSupplementaryAudit from './order_supplementary_contract/order_supplementary_aduit.vue'

import payRecordDetail from './components/pay_record_detail.vue'
import recommendAudit from './recommend/audit.vue'
import mentorPaymentExtra from './mentor_payment_extra/audit.vue'
import internshipPay from './mentor_payment_extra/internship_audit.vue'
import academicMentorBonus from './academic_mentor_bonus/audit.vue'
import menteeFile from './mentee_file/audit.vue'
import oneTononeAudit from './oneToone/oneTooneAudit.vue'
import mixins from '@/plugin/mixins'

var _this = ''
export default {
  name: 'audit',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  mixins: [mixins],
  components: {
    mentorPayApprove,
    mentorPay,
    signRefund,
    offerAudit,
    payRecordDetail,
    orderEntryAudit,
    recommendAudit,
    mentorPaymentExtra,
    academicMentorBonus,
    internshipPay,
    menteeFile,
    bdExpenditure,
    contractFund,
    ambassadorSalary,
    cooperatorContractInfo,
    oneTononeAudit,
    orderSupplementaryAudit,
    commMentorReferralFee,
    commMentorWithdrawal,
    documentReview
  },
  data () {
    _this = this
    return {
      approveList: [],
      loading: false,

      search: '',
      pageNum: 1,
      total: 0,
      applyStatusS: [],
      signRefundVisible: false,
      offerVisible: false,
      orderEntryAuditVisible: false,
      orderSupplementaryAuditVisible: false,
      mentorPayApproveVisible: false,
      purchase: false,
      applyData: {},
      mentorPayVisible: false,
      payRecordDetailVisible: false,
      oneTononeAuditVisible: false,
      recommendVisible: false,
      bdExpenditureVisible: false,
      contractFundVisible: false,
      ambassadorSalaryVisible: false,
      mentorPaymentExtraVisible: false,
      academicMentorBonusVisible: false,
      internshipPayVisible: false,
      menteeFileVisible: false,
      cooperatorContractInfoVisible: false,
      commMentorReferralVisible: false,
      commMentorWithdrawalVisible: false,
      documentReviewVisible: false,
      payData: {},
      pageSize: 400,
      applyType: '',
      apply_type: [],
      approveStatus: '0',
      applyStatus: '',
      approve_status: [],
      apply_status: [],
      Myclass: [
        'colorWST',
        'colorB',
        'colorG',
        'colorR',
        'colorG',
        'colorG',
        ''
      ]
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
      this.apply_status = await this.getDictionary('apply_status')
      this.applyStatusS = await this.getDictionary('apply_status')
      this.approve_status = await this.getDictionary('approve_status')
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        applyType: this.applyType,
        approveStatus: this.approveStatus,
        applyStatus: this.applyStatus
      }
      this.loading = true
      console.log(this.userInfo.userId, data)
      api.getApproveListByApplyId(this.userInfo.userId, data).then((res) => {
        console.log('审核列表', res)
        this.loading = false
        this.approveList = res.data.rows
        this.total = res.data.total
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
      console.log('详情', v, v.applyType)
      this.applyData = v
      this.applyData.canSubmit =
        this.applyData.approverId === this.userInfo.userId
      const applyMap = {
        sign_refund: 'signRefundVisible',
        offer_apply: 'offerVisible',
        entrance_offer_apply: 'offerVisible',
        order_entry: 'orderEntryAuditVisible',
        order_supplementary_contract: 'orderSupplementaryAuditVisible',
        pay_record: 'payRecordDetailVisible',
        mentor_payment: 'mentorPayApproveVisible',
        bd_expenditure: 'bdExpenditureVisible',
        cooperator_contract_fund: 'contractFundVisible',
        ambassador_salary: 'ambassadorSalaryVisible',
        mentor_payment_extra: 'mentorPaymentExtraVisible',
        academic_mentor_bonus: 'academicMentorBonusVisible',
        internship_offer_payment: 'internshipPayVisible',
        application_letter: 'menteeFileVisible',
        cooperator_contract_info: 'cooperatorContractInfoVisible',
        vip_office_hour_lesson: 'oneTononeAuditVisible',
        comm_mentor_referral_fee: 'commMentorReferralVisible',
        comm_mentor_withdrawal: 'commMentorWithdrawalVisible',
        document_review: 'documentReviewVisible'
      }
      this[applyMap[v.applyType] || 'recommendVisible'] = true
      // if (v.applyType == "sign_refund") {
      //   this.signRefundVisible = true;
      // } else if (v.applyType == "offer_apply") {
      //   this.offerVisible = true;
      // } else if (v.applyType == "entrance_offer_apply") {
      //   this.offerVisible = true;
      // } else if (v.applyType == "order_entry") {
      //   this.orderEntryAuditVisible = true;
      // } else if (v.applyType == "pay_record") {
      //   this.payRecordDetailVisible = true;
      // } else if (v.applyType == "mentor_payment") {
      //   this.mentorPayApproveVisible = true;
      // } else if (v.applyType == "bd_expenditure") {
      //   this.bdExpenditureVisible = true;
      // } else if (v.applyType == "cooperator_contract_fund") {
      //   this.contractFundVisible = true;
      // } else if (v.applyType == "ambassador_salary") {
      //   this.ambassadorSalaryVisible = true;
      // } else if (v.applyType == "mentor_payment_extra") {
      //   this.mentorPaymentExtraVisible = true;
      // } else if (v.applyType == "internship_offer_payment") {
      //   //审核有定制化详情
      //   this.internshipPayVisible = true;
      // } else {
      //   this.recommendVisible = true;
      // }
      // } else if (v.applyType == "brokerage") {
      //   this.recommendVisible = true;
      // this.brokerageVisible = true;
      // } else if (v.applyType == "cooperator_salary") {
      //   this.recommendVisible = true;
      // } else if (v.applyType == "reimbursement") {
      //   this.reimbursementVisible = true;
      // } else if (v.applyType == "vacate") {
      //   this.vacateVisible = true;
      // } else if (v.applyType == "overtime_working") {
      //   this.overtimeVisible = true;
      // } else if (v.applyType == "purchase") {
      //   this.purchaseVisible = true;
      // } else if (v.applyType == "vip_lesson") {
      //   this.strategistListAuditVisible = true;
      // } else if (v.applyType == "recommend_bonus") {
      //   this.recommendVisible = true;
      // } else if (v.applyType == "application_letter") {
      //   this.menteeFileVisible = true;
      // } else if (v.applyType == "cooperator_activity_status_change") {
      //   this.recommendVisible = true;
      // } else if (v.applyType == "cooperator_contract_info") {
      //   this.cooperatorContractInfoVisible = true;
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

    signRefundClose () {
      console.log('退款关闭')
      this.signRefundVisible = false
    },

    offerClose () {
      console.log('offer关闭')
      this.offerVisible = false
    },
    offerSubmit () {
      console.log('offer提交')
      this.Topage(1)
      this.offerClose()
    },
    orderEntryClose () {
      console.log('orderEntry关闭')
      this.orderEntryAuditVisible = false
    },
    orderSupplementaryAuditClose () {
      this.orderSupplementaryAuditVisible = false
    },
    orderSupplementaryAuditSubmit () {
      this.Topage(1)
    },
    orderEntrySubmit () {
      console.log('orderEntry提交')
      this.Topage(1)
      this.orderEntryClose()
    },
    mentorPayApproveSubmit () {
      console.log('审核导师酬金提交')
      this.Topage(1)
      this.mentorPayApproveClose()
    },
    signRefundSubmit () {
      console.log('退款提交')
      this.Topage(1)
      this.signRefundClose()
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
    recommendClose () {
      this.recommendVisible = false
    },
    recommendSubmit () {
      this.recommendClose()
      this.Topage(1)
    },

    bdExpenditureClose () {
      this.bdExpenditureVisible = false
    },
    bdExpenditureSubmit () {
      this.bdExpenditureClose()
      this.Topage(1)
    },
    contractFundClose () {
      this.contractFundVisible = false
    },
    contractFundSubmit () {
      this.contractFundClose()
      this.Topage(1)
    },
    ambassadorSalaryClose () {
      this.ambassadorSalaryVisible = false
    },
    ambassadorSalarySubmit () {
      this.ambassadorSalaryClose()
      this.Topage(1)
    },
    mentorPaymentExtraClose () {
      this.mentorPaymentExtraVisible = false
    },
    mentorPaymentExtraSubmit () {
      this.mentorPaymentExtraClose()
      this.Topage(1)
    },
    academicMentorBonusClose () {
      this.academicMentorBonusVisible = false
    },
    academicMentorBonusSubmit () {
      this.academicMentorBonusClose()
      this.Topage(1)
    },
    internshipPayClose () {
      this.internshipPayVisible = false
    },
    internshipPaySubmit () {
      this.internshipPayClose()
      this.Topage(1)
    },
    menteeFileClose () {
      this.menteeFileVisible = false
    },
    menteeFileSubmit () {
      this.menteeFileClose()
      this.Topage(1)
    },
    cooperatorContractInfoClose () {
      this.cooperatorContractInfoVisible = false
    },
    oneTononeAuditClose () {
      this.oneTononeAuditVisible = false
    },
    oneTononeAuditSubmit () {
      this.oneTononeAuditClose()
      this.Topage(1)
    },
    cooperatorContractInfoSubmit () {
      this.cooperatorContractInfoClose()
      this.Topage(1)
    },
    commMentorReferralClose () {
      this.commMentorReferralVisible = false
    },
    commMentorReferralSubmit () {
      this.commMentorReferralClose()
      this.Topage(1)
    },
    commMentorWithdrawalClose () {
      this.commMentorWithdrawalVisible = false
    },
    documentReviewClose () {
      this.documentReviewVisible = false
    },
    commMentorWithdrawalSubmit () {
      this.commMentorWithdrawalClose()
      this.Topage(1)
    },
    documentReviewSubmit () {
      this.documentReviewClose()
      this.Topage(1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
