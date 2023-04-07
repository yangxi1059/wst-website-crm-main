<!--
 * @Author: 库建华
 * @Date: 2019-06-25 16:36:00
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-17 10:14:57
 * @Version: 2
 * @Description:
 导师佣金申请
 offer申请
 升学offer的申请入口vip/学员/ offer && 排课;

 入账申请 来源sales/订单管理/详情/申请入账

 唯一入口本页新增
 报销申请 来源 apply_aduit/reimbursement/apply.vue
 请假申请 来源 apply_aduit/vacate/apply.vue
 加班申请 来源 apply_aduit/overtime/apply.vue
 采购申请
 推荐奖金申请

 订单退款申请 唯一入口VIP/学员/排课/退
 导师酬金申请 唯一入口VIP/学员/排课/酬金申请
 全职导师课程申请 唯一入口VIP/学员/排课/全职导师排课
 文书修改申请 唯一入口VIP/文书修改/修改文书按钮
 面试人员录入申请 唯一入口HR面试人员新增按钮
 BD合作商活动经费申请 唯一入口BD/合作商/活动/经费申请
 BD合作商合同申请 唯一入口BD/合作商/合同/签约
 BD合作商合同金额申请 唯一入口BD/合作商/合同/经费申请
 BD合作商合同状态申请 唯一入口BD/合作商活动/筹备|完成|执行
 BD校园大使薪资神器 唯一入口BD/校园大使/薪资/薪资申请
 -->
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
            v-model="applyType1"
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
          <el-button icon="el-icon-plus" class="ml0"  size="mini" plain @click="add">新增</el-button>
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
        :data="applyList"
        size="mini"
        v-loading="loading"
        highlight-current-row
        style="width: 100%"
        stripe
        @row-dblclick="detail"
      >
        <!-- <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.applyStatus == '0'" @click="apply(scope.row)">申请</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.applyStatus == '1'"
              @click="recall(scope.row)"
            >撤回</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.applyStatus == '3' && reapplyList.includes(scope.row.applyType)"
              @click="reapply(scope.row)"
            >重申</el-button>
            <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>-->
        <el-table-column prop="applyId" align="center" label="申请ID" min-width="110"></el-table-column>
        <el-table-column prop="" align="center" label="申请类型" min-width="100">
          <template slot-scope="scope">
            {{scope.row.applyType | showApplyType }}
          </template>
        </el-table-column>
        <el-table-column prop="applyTitle" align="center" label="申请标题" min-width="300"></el-table-column>
        <el-table-column prop="applyStatus" align="center" label="申请状态" min-width="50">
          <!-- 0待申请 1申请中 2通过 3拒绝 4未支付 5已支付 6已取消 -->
          <template slot-scope="scope">
            <span :class="MyClass[scope.row.applyStatus]">{{applyStatusS[scope.row.applyStatus].itemName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="applyType1 == 'mentor_payment'"
          prop="unConfirmHours"
          align="center"
          label="已支付待确认"
          min-width="80"
        >
          <template slot-scope="scope">
            <span :class="{colorR:scope.row.unConfirmHours > 0}">{{scope.row.unConfirmHours}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" align="center" label="申请人" min-width="100"></el-table-column>
        <el-table-column prop="createTime" align="center" label="申请时间" min-width="100"></el-table-column>
        <!-- <el-table-column prop="updateTime" align="center" label="审核人" min-width="100"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="审核时间" min-width="100"></el-table-column>-->
      </el-table>
      <el-dialog
        width="500px"
        title="申请类型"
        :close-on-click-modal="false"
        :visible.sync="applyTypeVisible"
        :before-close="beforeApplyTypeClose"
      >
        <el-form :inline="true" label-width="130px">
          <el-form-item label="申请类型">
            <el-select filterable v-model="applyTypeAdd">
              <el-option
                v-for="(item) in apply_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="beforeApplyTypeClose">取 消</el-button>
          <el-button type="primary" @click="applyTypeSubmit">确 认</el-button>
        </span>
      </el-dialog>
      <mentor-pay-apply
        :mentorPayVisible="mentorPayVisible"
        :applyData="applyData"
        @close="mentorPayClose"
        @submit="mentorPaySubmit"
        @recall="mentorRecell"
      ></mentor-pay-apply>
      <!-- <sign-refund-apply
        :signRefundVisible="signRefundVisible"
        :applyData="applyData"
        @close="signRefundClose"
      ></sign-refund-apply>-->
      <brokerage-apply
        :brokerageVisible="brokerageVisible"
        @close="brokerageClose"
        @submit="brokerageSubmit"
      ></brokerage-apply>
      <!-- <brokerage-detail
        :brokerageDetailVisible="brokerageDetailVisible"
        :applyData="applyData"
        @close="brokerageDetailClose"
      ></brokerage-detail>-->
      <bd-apply :bdApplyVisible="bdApplyVisible" @close="bdApplyClose" @submit="bdApplySubmit" />
      <!-- <bd-detail :bdDetailVisible="bdDetailVisible" :applyData="applyData" @close="bdDetailClose" /> -->
      <!-- <order-entry-detail
        :orderEntryDetailVisible="orderEntryDetailVisible"
        :applyData="applyData"
        @close="orderEntryDetailClose"
      />-->
      <!-- <signOffer :signOfferVisible="signOfferVisible" :applyData="applyData" @close="signOfferClose" /> -->
      <reimbursement-apply
        :reimbursementApplyVisible="reimbursementApplyVisible"
        @close="reimbursementApplyClose"
        @submit="reimbursementApplySubmit"
      />
      <!-- <reimbursement-detail
        :reimbursementDetailVisible="reimbursementDetailVisible"
        :applyData="applyData"
        @close="reimbursementDetailClose"
      />-->
      <vacate-apply
        :vacateApplyVisible="vacateApplyVisible"
        @close="vacateApplyClose"
        @submit="vacateApplySubmit"
      />
      <!-- <vacate-detail
        :vacateDetailVisible="vacateDetailVisible"
        :applyData="applyData"
        @close="vacateDetailClose"
      />-->
      <overtime-apply
        :overtimeApplyVisible="overtimeApplyVisible"
        @close="overtimeApplyClose"
        @submit="overtimeApplySubmit"
      />
      <!-- <overtime-detail
        :overtimeDetailVisible="overtimeDetailVisible"
        :applyData="applyData"
        @close="overtimeDetailClose"
      />-->
      <purchase-apply
        :purchaseApplyVisible="purchaseApplyVisible"
        @close="purchaseApplyClose"
        @submit="purchaseApplySubmit"
      />
      <!-- <purchase-detail
        :purchaseDetailVisible="purchaseDetailVisible"
        :applyData="applyData"
        @close="purchaseDetailClose"
      />-->
      <!-- <pay-record-detail
        :payRecordDetailVisible="payRecordDetailVisible"
        :applyData="applyData"
        @close="payRecordDetailClose"
      />-->
      <user-adjust-salary-apply
        :userAdjustSalaryApplyVisible="userAdjustSalaryApplyVisible"
        :deptList="deptList"
        @close="userAdjustSalaryApplyClose"
        @submit="userAdjustSalaryApplySubmit"
      />
      <reapplyOffer
        :reapplyOfferVisible="reapplyOfferVisible"
        :applyId="applyData.applyId"
        @close="reapplyOfferClose"
        @submit="reapplyOfferSubmit"
      />
      <reapplyStory
        :reapplyStoryVisible="reapplyStoryVisible"
        :interviewData="applyData"
        @close="reapplyStoryClose"
        @submit="reapplyStorySubmit"
      />
      <reapplyInterview
        :applyInterviewVisible="applyInterviewVisible"
        :applyId="applyData.applyId"
        @close="reapplyInterviewClose"
        @submit="reapplyInterviewSubmit"
      />
      <resignpraise
        :applySignPraiseVisible="applySignPraiseVisible"
        :applyId="applyData.applyId"
        @close="reapplySignPraiseClose"
        @submit="reapplySignPraiseSubmit"
      />
      <reapplyEduOffer
        :reapplyOfferVisible="reapplyEduOfferVisible"
        :applyId="applyData.applyId"
        @close="reapplyEduOfferClose"
        @submit="reapplyEduOfferSubmit"
      />
      <reapplyCooperatorContractInfo
        :reapplyCooperatorContractInfoVisible="reapplyCooperatorContractInfoVisible"
        :contractData="contractData"
        @close="reapplyCooperatorContractInfoClose"
        @submit="reapplyCooperatorContractInfoSubmit"
      />
      <reapplyCooperatorContractFund
        :reapplyCooperatorContractFundVisible="reapplyCooperatorContractFundVisible"
        :contractData="contractData"
        @close="reapplyCooperatorContractFundClose"
        @submit="reapplyCooperatorContractFundSubmit"
      />
      <reapplyCooperatorActivityFund
        :reapplyCooperatorActivityFundVisible="reapplyCooperatorActivityFundVisible"
        :contractData="contractData"
        @close="reapplyCooperatorActivityFundClose"
        @submit="reapplyCooperatorActivityFundSubmit"
      />
      <reapplyAmbassadorSalary
        :reapplyAmbassadorSalaryVisible="reapplyAmbassadorSalaryVisible"
        :applyContent="applyContent"
        :reject="reject"
        @close="reapplyAmbassadorSalaryClose"
        @submit="reapplyAmbassadorSalarySubmit"
      />
      <!-- <strategistListDetail
        :strategistListDetailVisible="strategistListDetailVisible"
        :applyData="applyData"
        @close="strategistListDetailClose"
      />-->
      <recommend-apply
        :recommendApplyVisible="recommendApplyVisible"
        @close="recommendApplyClose"
        @submit="recommendDetailSubmit"
      />
      <recommend-detail
        :recommendDetailVisible="recommendDetailVisible"
        :applyData="applyData"
        :recall="recall"
        :reapply="reapply"
        :reapplyList="reapplyList"
        @close="recommendDetailClose"
      />
      <mentorPaymentExtraApply
        :mentorPaymentExtraApplyVisible="mentorPaymentExtraApplyVisible"
        @close="mentorPaymentExtraApplyClose"
        @submit="mentorPaymentExtraApplySubmit"
      />
      <documentReview
        :documentReviewVisible="documentReviewVisible"
        :applyData="applyData"
        @close="documentReviewClose"
        @submit="documentReviewSubmit"
      />
      <!-- <mentorPaymentExtraDetail
        :mentorPaymentExtraDetailVisible="mentorPaymentExtraDetailVisible"
        :applyData="applyData"
        @close="mentorPaymentExtraDetailClose"
      />-->
      <menteeFileDetail
        :menteeFileVisible="menteeFileVisible"
        :applyData="applyData"
        @close="menteeFileClose"
      />
      <orderSupplementary
        :orderSupplementaryVisible="orderSupplementaryVisible"
        :applyData="applyData"
        :recall="recall"
        @close="orderSupplementaryClose"
      />
      <oneTooneDetail
        :oneTooneDetailVisible="oneTooneDetailVisible"
        :applyData="applyData"
        :recall="recall"
        @close="oneTooneClose"
      />

    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
// import signOffer from "./offer/apply.vue";
import mentorPayApply from './components/mentor_pay_apply.vue'
// import signRefundApply from "./components/sign_refund_detail.vue";
import brokerageApply from './components/brokerage_apply.vue'
// import brokerageDetail from "./components/brokerage_detail.vue";
// import payRecordDetail from "./components/pay_record_detail.vue";
// import bdDetail from "./bd/detail.vue";
import bdApply from './bd/apply.vue'
import reimbursementApply from './reimbursement/apply.vue'
// import reimbursementDetail from "./reimbursement/detail.vue";
import vacateApply from './vacate/apply.vue'
// import vacateDetail from "./vacate/detail.vue";
import overtimeApply from './overtime/apply.vue'
// import overtimeDetail from "./overtime/detail.vue";
import purchaseApply from './purchase/apply.vue'
// import purchaseDetail from "./purchase/detail.vue";
// import orderEntryDetail from "./order_entry/detail.vue";
// import strategistListDetail from "./strategist_lesson/detail.vue";
import recommendApply from './recommend/apply.vue'
import recommendDetail from './recommend/detail.vue'
import mentorPaymentExtraApply from './mentor_payment_extra/apply.vue'
import documentReview from './documentReview/apply.vue'
// import mentorPaymentExtraDetail from "./mentor_payment_extra/detail.vue";
import menteeFileDetail from './mentee_file/detail.vue'

import resignpraise from './offer/reapply_praise.vue'

import oneTooneDetail from './oneToone/oneTooneDetail.vue'
import reapplyOffer from './offer/reapply.vue'
import reapplyEduOffer from './offer/edu_reapply.vue'
import reapplyStory from './offer/reapply_story.vue'
import reapplyCooperatorContractInfo from './bd/cooperator_contract_info_reapply.vue'
import reapplyInterview from './offer/reapplyInterview.vue'

import reapplyCooperatorContractFund from './bd/cooperator_contract_fund_reapply.vue'
import reapplyCooperatorActivityFund from './bd/cooperator_activity_fund_reapply.vue'
import reapplyAmbassadorSalary from './bd/ambassador_salary_reapply.vue'
import orderSupplementary from './order_supplementary_contract/order_supplementary_contract.vue'
import userAdjustSalaryApply from './user_adjust_salary/apply.vue'
import mixins from '@/plugin/mixins'

var _this = ''
export default {
  name: 'apply',
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
    // signOffer,
    mentorPayApply,
    // signRefundApply,
    brokerageApply,
    // brokerageDetail,
    // bdDetail,
    bdApply,
    // orderEntryDetail,
    reimbursementApply,
    // reimbursementDetail,
    vacateApply,
    // vacateDetail,
    overtimeApply,
    // overtimeDetail,
    purchaseApply,
    // purchaseDetail,
    // payRecordDetail,
    reapplyInterview,
    resignpraise,
    reapplyOffer,
    reapplyStory,
    reapplyEduOffer,
    reapplyCooperatorContractInfo,
    reapplyCooperatorContractFund,
    reapplyCooperatorActivityFund,
    reapplyAmbassadorSalary,
    orderSupplementary,
    oneTooneDetail,
    documentReview,
    // strategistListDetail,
    recommendApply,
    recommendDetail,
    mentorPaymentExtraApply,
    // mentorPaymentExtraDetail,
    menteeFileDetail,
    userAdjustSalaryApply
  },
  data () {
    _this = this
    return {
      applyList: [],
      loading: false,

      search: '',
      pageNum: 1,
      pageSize: 400,
      total: 0,

      applyTypeAddList: [],
      applyTypeAdd: null,

      applyTypeVisible: false,
      applyStatusS: [],


      mentorPayVisible: false,
      applyData: {},

      // signRefundVisible: false,
      oneTooneDetailVisible: false,
      brokerageVisible: false,
      // brokerageDetailVisible: false,

      bdApplyVisible: false,
      // bdDetailVisible: false,

      reimbursementApplyVisible: false,
      // reimbursementDetailVisible: false,

      vacateApplyVisible: false,
      // vacateDetailVisible: false,

      overtimeApplyVisible: false,
      // overtimeDetailVisible: false,

      purchaseApplyVisible: false,
      // purchaseDetailVisible: false,

      recommendApplyVisible: false,
      recommendDetailVisible: false,

      mentorPaymentExtraApplyVisible: false,
      // mentorPaymentExtraDetailVisible: false,
      documentReviewVisible: false,
      menteeFileVisible: false,
      orderSupplementaryVisible: false,
      // orderEntryDetailVisible: false,

      // signOfferVisible: false,

      // payRecordDetailVisible: false,

      userAdjustSalaryApplyVisible: false,
      deptList: [],

      applyType1: '',
      apply_type: [],
      applyStatus: '',
      apply_status: [],

      MyClass: [
        'colorWST',
        'colorB',
        'colorG',
        'colorR',
        'colorG',
        'colorG',
        '',
        'colorR'
      ],

      applyContent: {},
      reject: '',
      reapplyOfferVisible: false,
      reapplyStoryVisible: false,
      applyInterviewVisible: false,
      applySignPraiseVisible: false,
      reapplyEduOfferVisible: false,
      contractData: null,
      reapplyCooperatorContractInfoVisible: false,
      reapplyCooperatorContractFundVisible: false,
      reapplyCooperatorActivityFundVisible: false,
      reapplyAmbassadorSalaryVisible: false,
      // strategistListDetailVisible: false,

      reapplyList: [
        'offer_apply',
        'mentee_offer_story',
        'mentee_entrance_offer_story',
        'entrance_offer_apply',
        'cooperator_contract_info',
        'cooperator_contract_fund',
        'bd_expenditure',
        'ambassador_salary',
        'mentee_interview',
        'sign_praise'
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
    this.pageInit()
    this.Topage(1)
  },
  methods: {
    async pageInit () {
      this.apply_type = await this.getDictionary('apply_type')
      this.applyTypeAddList = await this.getDictionary('apply_type')
      this.apply_status = await this.getDictionary('apply_status')
      this.applyStatusS = await this.getDictionary('apply_status')
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        applyType: this.applyType1,
        applyStatus: this.applyStatus
      }
      this.loading = true
      api.getApplyListByUserId(this.userInfo.userId, data).then((res) => {
        console.log('申请列表', res.data)
        this.total = res.data.total
        this.applyList = res.data.rows
        this.loading = false
      })
    },
    add () {
      this.applyTypeVisible = true
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
    beforeApplyTypeClose () {
      this.applyTypeVisible = false
      this.applyType1 = null
    },
    applyTypeSubmit () {
      console.log(this.applyTypeAdd,this.applyTypeAdd === 'document_review')
      if (!this.applyTypeAdd) {
        this.$message({
          type: 'warning',
          message: '你得选一个申请类型，不然我很为难的o(╥﹏╥)o'
        })
      }
      if (this.applyTypeAdd === 'brokerage') {
        this.$message({
          type: 'warning',
          message: '请到订单页面提交返佣！！'
        })
        // 返佣
        // this.brokerageVisible = true
        // } else if (this.applyTypeAdd === "bd_expenditure") {
        //   this.bdApplyVisible = true;
      } else if (this.applyTypeAdd === 'reimbursement') {
        // 报销
        this.reimbursementApplyVisible = true
      } else if (this.applyTypeAdd === 'vacate') {
        // 请假
        this.vacateApplyVisible = true
      } else if (this.applyTypeAdd === 'overtime_working') {
        // 加班
        this.overtimeApplyVisible = true
      } else if (this.applyTypeAdd === 'purchase') {
        // 采购
        this.purchaseApplyVisible = true
      } else if (this.applyTypeAdd === 'document_review') {
        console.log(11111111111)
        // 文件审查
        this.documentReviewVisible = true
      } else if (this.applyTypeAdd === 'recommend_bonus') {
        // 推荐奖励
        this.recommendApplyVisible = true
      } else if (this.applyTypeAdd === 'mentor_payment_extra') {
        // 导师酬金
        this.mentorPaymentExtraApplyVisible = true
      } else if (this.applyTypeAdd === 'user_adjust_salary') {
        // 员工调薪申请
        api.verifyDeptLeader().then((res) => {
          console.log('验证自己是不是部门leader', res)
          if (res.data.isLeader) {
            this.deptList = res.data.deptList
            this.userAdjustSalaryApplyVisible = true
          } else {
            this.$message({
              type: 'warning',
              message: '该申请类型仅部门leader使用'
            })
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '该申请类型不在此处提交,请去到相应模块'
        })
      }
      this.applyTypeVisible = false
    },
    apply (v) {
      console.log('申请', v)
    },
    detail (v) {
      console.log('详情', v)
      this.applyData = v
      if (v.applyType == 'mentor_payment') {
        this.mentorPayVisible = true
        // } else if (v.applyType == "offer_apply") {
        //   this.signOfferVisible = true;
        // } else if (v.applyType == "entrance_offer_apply") {
        //   this.signOfferVisible = true;
        // } else if (v.applyType == "sign_refund") {
        //   // this.signRefundVisible = true;
        //   this.recommendDetailVisible = true;
        // } else if (v.applyType == "brokerage") {
        //   this.recommendDetailVisible = true;
        //   // this.brokerageDetailVisible = true;
        // } else if (v.applyType == "bd_expenditure") {
        //   this.recommendDetailVisible = true;
        //   // this.bdDetailVisible = true;
        // } else if (v.applyType == "cooperator_salary") {
        //   this.recommendDetailVisible = true;
        // } else if (v.applyType == "reimbursement") {
        //   this.reimbursementDetailVisible = true;
        // } else if (v.applyType == "vacate") {
        //   this.vacateDetailVisible = true;
        // } else if (v.applyType == "overtime_working") {
        //   this.overtimeDetailVisible = true;
        // } else if (v.applyType == "order_entry") {
        //   this.orderEntryDetailVisible = true;
        // } else if (v.applyType == "pay_record") {
        //   this.payRecordDetailVisible = true;
        // } else if (v.applyType == "purchase") {
        //   this.purchaseDetailVisible = true;
        // } else if (v.applyType == "vip_lesson") {
        //   this.strategistListDetailVisible = true;
        // } else if (v.applyType == "recommend_bonus") {
        //   this.recommendDetailVisible = true;
        // } else if (v.applyType == "mentor_payment_extra") {
        //   this.recommendDetailVisible = true;
        // this.mentorPaymentExtraDetailVisible = true;

        // } else if (v.applyType == "internship_offer_payment") {
        //   this.recommendDetailVisible = true;
        // } else if (v.applyType == "ambassador_salary") {
        //   this.recommendDetailVisible = true;
        // } else if (v.applyType == "cooperator_contract_fund") {
        //   this.recommendDetailVisible = true;
        // } else if (v.applyType == "cooperator_activity_status_change") {
        //   this.recommendDetailVisible = true;
      } else if (v.applyType == 'application_letter') {
        this.menteeFileVisible = true
      } else if (v.applyType == 'order_supplementary_contract') {
        this.orderSupplementaryVisible = true
      } else if (v.applyType == 'vip_office_hour_lesson') {
        this.oneTooneDetailVisible = true
      } else {
        this.recommendDetailVisible = true
      }
    },
    recall (v) {
      console.log('撤回', v)
      this.$confirm('此操作将撤回该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.cancelApplyByApplyId(v.applyId).then((res) => {
            console.log('撤回返回', res)
            this.recommendDetailVisible = false
            this.oneTooneDetailVisible = false
            this.orderSupplementaryVisible = false
            this.Topage(1)
          })
        })
        .catch(() => {})
    },

    mentorPayClose () {
      console.log('导师酬金关闭')
      this.mentorPayVisible = false
    },
    mentorRecell () {
      console.log('导师酬金撤回')
      this.Topage(1)
      this.mentorPayClose()
    },
    mentorPaySubmit () {
      console.log('导师酬金提交')
      this.Topage(1)
      this.mentorPayClose()
    },
    // signRefundClose() {
    //   console.log("退款关闭");
    //   this.signRefundVisible = false;
    // },
    brokerageClose () {
      console.log('返佣关闭')
      this.brokerageVisible = false
    },
    // brokerageDetailClose() {
    //   console.log("返佣Detail关闭");
    //   this.brokerageDetailVisible = false;
    // },
    brokerageSubmit () {
      console.log('返佣提交')
      this.brokerageClose()
      this.Topage(1)
    },
    bdApplyClose () {
      console.log('BD经费关闭')
      this.bdApplyVisible = false
    },
    // bdDetailClose() {
    //   console.log("BD经费Detail关闭");
    //   this.bdDetailVisible = false;
    // },
    // orderEntryDetailClose() {
    //   console.log("orderEntryDetail关闭");
    //   this.orderEntryDetailVisible = false;
    // },
    bdApplySubmit () {
      console.log('BD经费提交')
      this.bdApplyClose()
      this.Topage(1)
    },
    reimbursementApplyClose () {
      console.log('reimbursement关闭')
      this.reimbursementApplyVisible = false
    },
    // reimbursementDetailClose() {
    //   console.log("reimbursementDetail关闭");
    //   this.reimbursementDetailVisible = false;
    // },
    reimbursementApplySubmit () {
      console.log('reimbursement提交')
      this.reimbursementApplyClose()
      this.Topage(1)
    },
    vacateApplyClose () {
      console.log('vacate关闭')
      this.vacateApplyVisible = false
    },
    // vacateDetailClose() {
    //   console.log("vacateDetail关闭");
    //   this.vacateDetailVisible = false;
    // },
    vacateApplySubmit () {
      console.log('vacate提交')
      this.vacateApplyClose()
      this.Topage(1)
    },
    overtimeApplyClose () {
      console.log('overtime关闭')
      this.overtimeApplyVisible = false
    },
    // overtimeDetailClose() {
    //   console.log("overtimeDetail关闭");
    //   this.overtimeDetailVisible = false;
    // },
    purchaseApplyClose () {
      console.log('purchase关闭')
      this.purchaseApplyVisible = false
    },
    // purchaseDetailClose() {
    //   console.log("purchaseDetail关闭");
    //   this.purchaseDetailVisible = false;
    // },
    purchaseApplySubmit () {
      console.log('purchase提交')
      this.purchaseApplyClose()
      this.Topage(1)
    },
    userAdjustSalaryApplyClose () {
      console.log('purchase关闭')
      this.userAdjustSalaryApplyVisible = false
    },
    userAdjustSalaryApplySubmit () {
      console.log('userAdjustSalary提交')
      this.userAdjustSalaryApplyClose()
      this.Topage(1)
    },
    // payRecordDetailClose() {
    //   console.log("payRecordDetail关闭");
    //   this.payRecordDetailVisible = false;
    // },
    overtimeApplySubmit () {
      console.log('overtime提交')
      this.overtimeApplyClose()
      this.Topage(1)
    },
    // signOfferClose() {
    //   console.log("offer关闭");
    //   this.signOfferVisible = false;
    // },
    /**
     * @Date: 2019-10-31 15:31:57
     * @Description: 重新申请
     */
    reapply (v) {
      console.log('重新申请', v)
      this.applyData = v
      if (this.applyData.applyType == 'cooperator_contract_info') {
        // 合作商合同
        this.contractData = JSON.parse(v.content)
        this.reapplyCooperatorContractInfoVisible = true
      } else if (this.applyData.applyType == 'cooperator_contract_fund') {
        // 合作商合同金额
        this.contractData = JSON.parse(v.content)
        this.reapplyCooperatorContractFundVisible = true
      } else if (this.applyData.applyType == 'bd_expenditure') {
        // 合作商活动经费
        this.contractData = JSON.parse(v.content)
        this.reapplyCooperatorActivityFundVisible = true
      } else if (this.applyData.applyType == 'offer_apply') {
        // 求职offer
        this.reapplyOfferVisible = true
      } else if (this.applyData.applyType == 'mentee_offer_story' || this.applyData.applyType == 'mentee_entrance_offer_story') {
        // 小故事
        this.reapplyStoryVisible = true
      } else if (this.applyData.applyType == 'entrance_offer_apply') {
        // 升学offer
        this.reapplyEduOfferVisible = true
      } else if (this.applyData.applyType == 'mentee_interview') {
        // 面试offer
        this.applyInterviewVisible = true
      } else if (this.applyData.applyType == 'sign_praise') {
        // 好评图
        this.applySignPraiseVisible = true
      } else if (this.applyData.applyType == 'ambassador_salary') {
        // 校园大使薪资
        this.applyContent = JSON.parse(v.content)
        this.reject = JSON.parse(v.content).text.pop().value
        // console.log(this.applyContent,v);
        this.reapplyAmbassadorSalaryVisible = true
      }
    },
    reapplyOfferClose () {
      console.log('reapplyOffer关闭')
      this.reapplyOfferVisible = false
    },
    reapplyOfferSubmit () {
      console.log('reapplyOfferSubmit')
      this.reapplyOfferClose()
      this.Topage(1)
    },
    reapplyStoryClose () {
      console.log('reapplyStory关闭')
      this.reapplyStoryVisible = false
    },
    reapplyStorySubmit () {
      console.log('reapplyStorySubmit')
      this.reapplyStoryClose()
      this.Topage(1)
    },
    reapplyInterviewClose () {
      console.log('reapplyOffer关闭')
      this.applyInterviewVisible = false
    },
    reapplyInterviewSubmit () {
      this.reapplyInterviewClose()
      this.recommendDetailVisible = false
      this.Topage(1)
    },
    reapplySignPraiseClose () {
      this.applySignPraiseVisible = false
    },
    reapplySignPraiseSubmit () {
      this.reapplySignPraiseClose()
      this.recommendDetailVisible = false
      this.Topage(1)
    },
    reapplyEduOfferClose () {
      console.log('reapplyEduOffer关闭')
      this.reapplyEduOfferVisible = false
    },
    reapplyEduOfferSubmit () {
      console.log('reapplyEduOfferSubmit')
      this.reapplyEduOfferClose()
      this.Topage(1)
    },
    reapplyCooperatorContractInfoClose () {
      console.log('reapplyCooperatorContractInfo关闭')
      this.reapplyCooperatorContractInfoVisible = false
    },
    reapplyCooperatorContractInfoSubmit () {
      console.log('reapplyCooperatorContractInfoSubmit')
      this.reapplyCooperatorContractInfoClose()
      this.Topage(1)
    },
    reapplyCooperatorContractFundClose () {
      console.log('reapplyCooperatorContractFund关闭')
      this.reapplyCooperatorContractFundVisible = false
    },
    reapplyCooperatorContractFundSubmit () {
      console.log('reapplyCooperatorContractFundSubmit')
      this.reapplyCooperatorContractFundClose()
      this.Topage(1)
    },
    reapplyCooperatorActivityFundClose () {
      console.log('reapplyCooperatorActivityFund关闭')
      this.reapplyCooperatorActivityFundVisible = false
    },
    reapplyCooperatorActivityFundSubmit () {
      console.log('reapplyCooperatorActivityFundSubmit')
      this.reapplyCooperatorActivityFundClose()
      this.Topage(1)
    },
    reapplyAmbassadorSalaryClose () {
      console.log('reapplyAmbassadorSalary关闭')
      this.reapplyAmbassadorSalaryVisible = false
    },
    reapplyAmbassadorSalarySubmit () {
      console.log('reapplyAmbassadorSalarySubmit')
      this.reapplyAmbassadorSalaryClose()
      this.Topage(1)
    },
    // bdApplySubmit() {
    //   console.log("BD经费提交");
    //   this.bdApplyClose();
    //   this.Topage(1);
    // }
    // strategistListDetailClose() {
    //   console.log("全职导师申请关闭");
    //   this.strategistListDetailVisible = false;
    // },
    recommendApplyClose () {
      this.recommendApplyVisible = false
    },
    recommendDetailSubmit () {
      this.recommendApplyClose()
      this.Topage()
    },
    recommendDetailClose () {
      this.recommendDetailVisible = false
    },
    mentorPaymentExtraApplyClose () {
      this.mentorPaymentExtraApplyVisible = false
    },
    mentorPaymentExtraApplySubmit () {
      this.mentorPaymentExtraApplyClose()
      this.Topage()
    },
    // mentorPaymentExtraDetailClose() {
    //   this.mentorPaymentExtraDetailVisible = false;
    // },
    menteeFileClose () {
      this.menteeFileVisible = false
    },
    orderSupplementaryClose () {
      this.orderSupplementaryVisible = false
    },
    oneTooneClose () {
      this.oneTooneDetailVisible = false
    },
    documentReviewClose () {
      this.documentReviewVisible = false
    },
    documentReviewSubmit () {
      this.Topage()
      this.documentReviewVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
