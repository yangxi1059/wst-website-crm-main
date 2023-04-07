<template>
  <d2-container v-loading="loading">
    <div class="mentor-commisson-apply">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持申请标题、申请ID"
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
            v-model="userId"
            filterable
            class="mr10"
            size="mini"
            :style="{width:'120px'}"
            @change="Topage(1)"
            >
            <el-option
                v-for="(item,i) in userList"
                :key="i"
                :label="item.userName"
                :value="item.userId"
            ></el-option>
            </el-select>
            <el-select
            v-model="paymentType"
            size="mini"
            clearable
            style="width:150px"
            filterable
            class="mr10"
            placeholder="账户类型"
            @change="Topage(1)"
            >
            <el-option
                v-for="item in mentor_pay_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            v-model="applyStatus"
            v-if="!pageType"
            size="mini"
            clearable
            filterable
            style="width:150px"
            class="mr10"
            placeholder="支付状态"
            @change="Topage(1)"
            >
            <el-option
                v-for="item in applyStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
            <el-switch v-model="pageType" active-text="支付" inactive-text="查看" @change="Topage()"></el-switch>
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
        highlight-current-row
        style="width: 100%"
        stripe
        @sort-change="sortTable"
        >
        <!-- border -->
        <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
            </template>
        </el-table-column>
        <el-table-column
            v-if="!pageType"
            sortable="custom"
            prop="applyId"
            align="center"
            label="申请ID"
            min-width="100"
        ></el-table-column>
        <el-table-column
            v-else
            sortable="custom"
            show-overflow-tooltip
            prop="applyIds"
            align="center"
            label="申请ID"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            prop="applyTitle"
            align="center"
            label="申请标题"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            prop="paymentTypeName"
            align="center"
            label="账户类型"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="applyStatus"
            align="center"
            label="申请状态"
            min-width="100"
        >
            <template slot-scope="scope">{{applyStatusS[scope.row.applyStatus] ? applyStatusS[scope.row.applyStatus].itemName:""}}</template>
        </el-table-column>
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="applyerName"
            align="center"
            label="申请人"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="applyTime"
            align="center"
            label="申请时间"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="payRecordCreateTime"
            align="center"
            label="付款时间"
            min-width="100"
        ></el-table-column>
        <!-- <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="confirmStatus"
            align="center"
            label="确认到账"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="confirmTime"
            align="center"
            label="到账时间"
            min-width="100"
        ></el-table-column>-->
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="paymentAccountName"
            align="center"
            label="付款账户"
            min-width="100"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="recordStatus"
            align="center"
            label="确认记录"
            min-width="100"
        >
            <template slot-scope="scope">{{'1' == scope.row.recordStatus ? '已确认':''}}</template>
        </el-table-column>
        </el-table>
        <mentor-pay
        :mentorPayVisible="mentorPayVisible"
        :payData="payData"
        @close="mentorPayClose"
        @submit="mentorPaySubmit"
        ></mentor-pay>
        <internshipUnitPayList
        :internshipUnitPayListVisible="internshipUnitPayListVisible"
        :payData="payData"
        @close="internshipUnitPayListClose"
        @submit="internshipUnitPayListSubmit"
        />
        <mentorPaymentExtra
        :mentorPaymentExtraVisible="mentorPaymentExtraVisible"
        :payData="payData"
        @close="mentorPaymentExtraClose"
        @submit="mentorPaymentExtraSubmit"
        ></mentorPaymentExtra>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import mentorPay from '../../apply_audit/components/mentor_pay.vue'
import apiU from '@/api/user'
import mentorPaymentExtra from '../../apply_audit/mentor_payment_extra/internship_cashier.vue'
import internshipUnitPayList from '../../apply_audit/mentor_payment_extra/internship_list_cashier.vue'
import mixins from '@/plugin/mixins'

export default {
  name: 'audit',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: {
    mentorPay,
    mentorPaymentExtra,
    internshipUnitPayList
  },
  data () {
    return {
      approveList: [],
      loading: false,
      search: '',
      paymentType: '',
      mentor_pay_type: [],
      pageSize: 400,
      pageNum: 1,
      total: 0,
      userId: null,
      userList: [],
      applyStatusS: [],
      applyWeek: null,
      applyStatus: '4',
      timeList: [
        { itemValue: null, itemName: '全部' },
        { itemValue: '上上周', itemName: '上上周' },
        { itemValue: '上周', itemName: '上周' },
        { itemValue: '本周', itemName: '本周' }
      ],
      applyStatusList: [
        { itemValue: '', itemName: '全部' },
        { itemValue: '4', itemName: '未支付' },
        { itemValue: '5', itemName: '已支付' }
      ],

      mentorPayVisible: false,
      mentorPayListVisible: false,
      payData: {},
      pageType: true,
      sort: null,
      sortCol: null,
      mentorPaymentExtraVisible: false,
      internshipUnitPayListVisible: false
    }
  },
  mounted () {
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.userList = await this.userListCommon('1', 'strategist,service', '')
      this.userList.unshift({ userName: 'ALL', userId: null })
      this.mentor_pay_type = await this.getDictionary('mentor_pay_type')
      this.mentor_pay_type.unshift({ itemValue: '', itemName: '全部账户类型' })
      this.applyStatusS = await this.getDictionary('apply_status')

    },
    Topage () {
      const data = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        applyStatus: this.applyStatus,
        paymentType: this.paymentType,
        sort: this.sort,
        sortCol: this.sortCol
      }
      console.log(data)
      this.loading = true
      if (this.pageType) {
        data.applyStatus = '4'
        api.getInternshipUnitPayListCashier(data).then(res => {
          console.log('批量审核列表', res)
          this.total = res.data.total
          this.approveList = res.data.rows
          this.loading = false
        })
      } else {
        api.getInternshipUnitPayCashier(data).then(res => {
          console.log('审核列表', res)
          this.total = res.data.total
          this.approveList = res.data.rows
          this.loading = false
        })
      }
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
      console.log('详情', v, this.pageType)
      if (!this.pageType) {
        this.mentorPaymentExtraVisible = true
      } else {
        this.internshipUnitPayListVisible = true
      }
      this.payData = v
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
    mentorPayListClose () {
      this.mentorPayListVisible = false
    },
    mentorPayListSubmit () {
      this.Topage(1)
      this.mentorPayListClose()
    },
    sortTable (v) {
      console.log(v.order, v.prop)
      const orderToSort = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.sort = orderToSort[v.order] || null
      this.sortCol = v.prop
      this.Topage()
    },
    mentorPaymentExtraClose () {
      console.log('导师薪资关闭')
      this.mentorPaymentExtraVisible = false
    },
    mentorPaymentExtraSubmit () {
      console.log('导师薪资提交')
      this.Topage(1)
      this.mentorPaymentExtraClose()
    },
    internshipUnitPayListClose () {
      this.internshipUnitPayListVisible = false
    },
    internshipUnitPayListSubmit () {
      this.Topage(1)
      this.internshipUnitPayListClose()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
