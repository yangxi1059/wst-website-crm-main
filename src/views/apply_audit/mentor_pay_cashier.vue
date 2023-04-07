<template>
  <div class="mentor-commisson-apply">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-if="roleInfo.includes('mentor_pay_cashier_pay')" label="待支付" name="first">
        <div class="search_page">
          <div class="search">
            <el-input
              class="mr10"
              size="mini"
              style="width:300px"
              v-model="search"
              clearable
              placeholder="支持申请标题、申请ID,导师名（bank）"
              @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
              v-model="userId"
              filterable
              class="mr10"
              clearable
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
              v-model="applyWeek"
              size="mini"
              style="width:85px"
              clearable
              filterable
              class="mr10"
              placeholder="时间"
              @change="Topage(1)"
            >
              <el-option
                v-for="item in timeList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin-right:10px" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
            <el-button
              icon="el-icon-search"
              class="mr10"
              size="mini"
              v-if="(paymentType == 'bank'||paymentType == 'alipay')  && pageType"
              plain
              @click="exportExcel"
            >下载</el-button>
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
          v-if="paymentType == 'bank' && pageType"
          id="export_table"
          :data="approveList2"
          size="mini"
          v-loading="loading"
          highlight-current-row
          :max-height="height"
          style="width: 100%"
          stripe
          @sort-change="sortTable"
        >
          <!-- border -->
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" v-if="scope.row.canPayStatus == '1'" @click="detail(scope.row)">支付</el-button>
              <el-button type="text" size="mini" @click="detail2(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="applyIds"
            align="center"
            label="申请ID"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="mentorName"
            align="center"
            label="导师姓名"
            min-width="100"
          ></el-table-column>
          <el-table-column sortable="custom" prop="payAccName" align="center" label="银行卡户名" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="payAcc" align="center" label="银行卡号" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="usdFee" align="center" label="美金合计" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="cnyFee" align="center" label="人民币合计" min-width="100"></el-table-column>
          <el-table-column
            sortable="custom"
            prop="totalCny"
            align="center"
            label="合计等值人民币"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="wstCompanyName"
            align="center"
            label="绑定wst公司名"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="minApplyTime" align="center" label="申请时间" min-width="100"></el-table-column>
          <el-table-column prop="note" align="center" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table
          v-else-if="paymentType == 'alipay' && pageType"
          id="export_table2"
          :data="approveList3"
          size="mini"
          v-loading="loading"
          highlight-current-row
          :max-height="height"
          style="width: 100%"
          stripe
          @sort-change="sortTable"
        >
          <!-- border -->
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" v-if="scope.row.canPayStatus == '1'" @click="detail(scope.row)">支付</el-button>
              <el-button type="text" size="mini" @click="detail2(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="applyIds"
            align="center"
            label="申请ID"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="mentorName"
            align="center"
            label="导师姓名"
            min-width="100"
          ></el-table-column>
          <el-table-column sortable="custom" prop="payAcc" align="center" label="支付宝卡号" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="usdFee" align="center" label="美金合计" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="cnyFee" align="center" label="人民币合计" min-width="100"></el-table-column>
          <el-table-column
            sortable="custom"
            prop="totalCny"
            align="center"
            label="合计等值人民币"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="wstCompanyName"
            align="center"
            label="绑定wst公司名"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="minApplyTime" align="center" label="申请时间" min-width="100"></el-table-column>
          <el-table-column prop="note" align="center" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table
          v-else
          :data="approveList"
          size="mini"
          v-loading="loading"
          highlight-current-row
          :max-height="height"
          style="width: 100%"
          stripe
          @sort-change="sortTable"
        >
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" v-if="scope.row.canPayStatus == '1'"  @click="detail(scope.row)">支付</el-button>
              <el-button type="text" size="mini" @click="detail2(scope.row)">详情</el-button>
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
            prop="mentorName"
            align="center"
            label="导师名"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="paymentTypeName"
            align="center"
            label="导师账户类型"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="minApplyTime" align="center" label="申请时间" min-width="100"></el-table-column>
          <el-table-column
            v-if="pageType"
            sortable="custom"
            prop="wstCompanyName"
            align="center"
            label="绑定wst公司名"
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
            <template slot-scope="scope">
              <span v-if="scope.row.applyStatus">{{applyStatusS[scope.row.applyStatus].itemName}}</span>
            </template>
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
          <el-table-column
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
          ></el-table-column>
          <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="paymentAccountName"
            align="center"
            label="出账账户"
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
      </el-tab-pane>
      <el-tab-pane v-if="roleInfo.includes('mentor_pay_cashier_check')" label="支付记录" name="second">
        <div class="search_page">
          <div class="search">
            <el-input
              class="mr10"
              size="mini"
              style="width:300px"
              v-model="search"
              clearable
              placeholder="支持申请标题、申请ID,导师名（bank）"
              @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
              v-model="userId"
              filterable
              class="mr10"
              clearable
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
              v-model="paymentAccount"
              size="mini"
              clearable
              style="width:150px"
              filterable
              class="mr10"
              placeholder="出账账户"
              @change="Topage(1)"
            >
              <el-option
                v-for="item in payment_account"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>

            <el-select
              v-model="applyWeek"
              size="mini"
              style="width:85px"
              clearable
              filterable
              class="mr10"
              placeholder="时间"
              @change="Topage(1)"
            >
              <el-option
                v-for="item in timeList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin-right:10px" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
            <el-button  class="mr10" size="mini" type="primary" @click="uploadPath">导出付款凭证</el-button>
            <el-button
              icon="el-icon-search"
              class="mr10"
              size="mini"
              v-if="(paymentType == 'bank'||paymentType == 'alipay')  && pageType"
              plain
              @click="exportExcel"
            >下载</el-button>
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
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          v-if="paymentType == 'bank' && pageType"
          id="export_table"
          :data="approveList2"
          size="mini"
          v-loading="loading"
          highlight-current-row
          :max-height="height"
          style="width: 100%"
          stripe
          @sort-change="sortTable"
        >
          <!-- border -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="applyIds"
            align="center"
            label="申请ID"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="mentorName"
            align="center"
            label="导师姓名"
            min-width="100"
          ></el-table-column>
          <el-table-column sortable="custom" prop="payAccName" align="center" label="银行卡户名" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="payAcc" align="center" label="银行卡号" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="usdFee" align="center" label="美金合计" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="cnyFee" align="center" label="人民币合计" min-width="100"></el-table-column>
          <el-table-column
            sortable="custom"
            prop="totalCny"
            align="center"
            label="合计等值人民币"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="wstCompanyName"
            align="center"
            label="绑定wst公司名"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="minApplyTime" align="center" label="申请时间" min-width="100"></el-table-column>
          <el-table-column prop="note" align="center" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          v-else-if="paymentType == 'alipay' && pageType"
          id="export_table2"
          :data="approveList3"
          size="mini"
          v-loading="loading"
          highlight-current-row
          :max-height="height"
          style="width: 100%"
          stripe
          @sort-change="sortTable"
        >
          <!-- border -->
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="applyIds"
            align="center"
            label="申请ID"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="mentorName"
            align="center"
            label="导师姓名"
            min-width="100"
          ></el-table-column>
          <el-table-column sortable="custom" prop="payAcc" align="center" label="支付宝卡号" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="usdFee" align="center" label="美金合计" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="cnyFee" align="center" label="人民币合计" min-width="100"></el-table-column>
          <el-table-column
            sortable="custom"
            prop="totalCny"
            align="center"
            label="合计等值人民币"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="wstCompanyName"
            align="center"
            label="绑定wst公司名"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="minApplyTime" align="center" label="申请时间" min-width="100"></el-table-column>
          <el-table-column prop="note" align="center" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table
          v-else
          :data="approveList"
          size="mini"
          v-loading="loading"
          highlight-current-row
          :max-height="height"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          @sort-change="sortTable"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
            prop="mentorName"
            align="center"
            label="导师名"
            min-width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="paymentTypeName"
            align="center"
            label="导师账户类型"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="minApplyTime" align="center" label="申请时间" min-width="100"></el-table-column>
          <el-table-column
            v-if="pageType"
            sortable="custom"
            prop="wstCompanyName"
            align="center"
            label="绑定wst公司名"
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
            <template slot-scope="scope">
              <span v-if="scope.row.applyStatus">{{applyStatusS[scope.row.applyStatus].itemName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="mergePayNote"
            align="center"
            label="合并付款信息"
            min-width="100"
          ></el-table-column>
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
          <el-table-column
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
          ></el-table-column>
          <el-table-column
            sortable="custom"
            v-if="!pageType"
            prop="paymentAccountName"
            align="center"
            label="出账账户"
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
      </el-tab-pane>
    </el-tabs>
    <mentor-pay
      :mentorPayVisible="mentorPayVisible"
      :payData="payData"
      @close="mentorPayClose"
      @submit="mentorPaySubmit"
    ></mentor-pay>
    <mentorPayList
      :mentorPayListVisible="mentorPayListVisible"
      :payData="payData"
      @close="mentorPayListClose"
      @submit="mentorPayListSubmit"
    />
    <mentorPaymentExtra
      :mentorPaymentExtraVisible="mentorPaymentExtraVisible"
      :payData="payData"
      @close="mentorPaymentExtraClose"
      @submit="mentorPaymentExtraSubmit"
    ></mentorPaymentExtra>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import mentorPay from './components/mentor_pay.vue'
import mentorPayList from './mentor_pay/pay_list.vue'
import apiU from '@/api/user'
import mentorPaymentExtra from './mentor_payment_extra/cashier.vue'
import mixins from '@/plugin/mixins'
import util from '@/libs/util'
// 导出表格
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

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
    mentorPayList
  },
  data () {
    return {
      activeName: 'first',
      height: document.documentElement.clientHeight - 120,
      approveList: [],
      approveList2: [],
      approveList3: [],
      loading: false,
      multipleSelection: [],
      search: '',
      paymentType: '',
      paymentAccount: '',
      mentor_pay_type: [],
      payment_account: [],
      pageNum: 1,
      total: 0,
      userId: null,
      userList: [],
      applyStatusS: JSON.parse(sessionStorage.getItem('apply_status')),
      applyWeek: null,
      applyStatus: '4',
      timeList: [
        { itemValue: '', itemName: '全部' },
        { itemValue: '上上周', itemName: '上上周' },
        { itemValue: '上周', itemName: '上周' },
        { itemValue: '本周', itemName: '本周' }
      ],
      applyStatusList: [
        { itemValue: '', itemName: '全部' },
        { itemValue: '4', itemName: '未支付' },
        { itemValue: '5', itemName: '已支付' }
      ],
      roleInfo: JSON.parse(sessionStorage.getItem('roleInfo')),
      mentorPayVisible: false,
      mentorPayListVisible: false,
      payData: {},
      pageType: true,
      sort: null,
      sortCol: null,
      mentorPaymentExtraVisible: false
    }
  },
  mounted () {
    this.activeName = this.roleInfo.includes('mentor_pay_cashier_pay') ? 'first' : 'second'
    this.pageType = !!this.roleInfo.includes('mentor_pay_cashier_pay')
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.userList = await this.userListCommon('1', 'strategist,service', '')
      this.mentor_pay_type = await this.getDictionary('mentor_pay_type')
      this.payment_account = await this.getDictionary('payment_account')
    },
    Topage () {
      this.applyStatusS = JSON.parse(sessionStorage.getItem('apply_status'))
      console.log(this.applyStatusS)
      const data = {
        createBy: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        applyStatus: '',
        paymentType: this.paymentType,
        applyWeek: this.applyWeek,
        sort: this.paymentType == 'bank' && this.sortCol == 'applyTitle' ? '' : this.sort,
        sortCol: this.paymentType == 'bank' && this.sortCol == 'applyTitle' ? '' : this.sortCol
      }
      this.loading = true
      if (this.pageType) {
        if (this.paymentType == 'bank') {
          data.applyStatus = '4'
          api.getMentorBatchPayment(data).then(res => {
            console.log('getMentorBatchPaymentBank', res)
            this.total = res.data.total
            this.approveList2 = res.data.rows.map(v => { v.payAcc = v.payAcc.slice(0, 4) + ' ' + v.payAcc.slice(4); return v })
            this.loading = false
          })
        } else if (this.paymentType == 'alipay') {
          api.getMentorBatchPayment(data).then(res => {
            console.log('getMentorBatchPayment', res)
            this.total = res.data.total
            this.approveList3 = res.data.rows
            this.loading = false
          })
        } else {
          data.applyStatus = '4'
          api.getMentorPaySList(data).then(res => {
            console.log('批量审核列表', res)
            this.total = res.data.total
            this.approveList = res.data.rows
            this.loading = false
            console.log(this.approveList, 'yx************************')
          })
        }
      } else {
        data.paymentAccount = this.paymentAccount
        api.getMentorPayList(data).then(res => {
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
      console.log('详情', v)
      if (!this.pageType) {
        if (v.applyType === 'mentor_payment') {
          this.mentorPayVisible = true
        } else {
          this.mentorPaymentExtraVisible = true
        }
      } else {
        this.mentorPayListVisible = true
        v.showDetail = false
      }
      this.payData = v
    },
    detail2 (v) {
      console.log('详情', v)
      if (!this.pageType) {
        if (v.applyType === 'mentor_payment') {
          this.mentorPayVisible = true
        } else {
          this.mentorPaymentExtraVisible = true
        }
      } else {
        this.mentorPayListVisible = true
        v.showDetail = true
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
    changePageType () {
      this.userId = null
      this.search = null
      this.applyStatus = '4'
      this.paymentType = null
      this.applyWeek = null
      this.sort = null
      this.sortCol = null
      this.Topage()
    },
    // 定义导出Excel表格事件
    exportExcel () {
      let fileName = ''
      console.log(fileName)
      /* 从表生成工作簿对象 */
      var wb = {}
      if (this.paymentType == 'bank') {
        fileName = 'bank_' + new Date().toLocaleDateString()
        wb = XLSX.utils.table_to_book(
          document.querySelector('#export_table')
        )
      } else if (this.paymentType == 'alipay') {
        fileName = 'alipay_' + new Date().toLocaleDateString()
        wb = XLSX.utils.table_to_book(
          document.querySelector('#export_table2')
        )
      }
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          '导师支付[' + fileName + '].xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    handleClick (tab, event) {
      if (tab.name == 'first') {
        this.pageType = true
      } else {
        this.pageType = false
      }
      this.userId = null
      this.search = null
      this.applyStatus = '4'
      this.paymentAccount = ''
      this.paymentType = null
      this.applyWeek = null
      this.sort = null
      this.sortCol = null
      this.pageNum = 1
      this.approveList = []
      this.approveList2 = []
      this.approveList3 = []
      this.Topage()
      console.log(tab, event)
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    uploadPath () {
      const arr = []
      this.multipleSelection.forEach(item => {
        arr.push(item.payId)
      })
      const data = [...new Set(arr)]
      console.log(this.multipleSelection, data)
      // const fileName = `合并付款凭证.xlsx`
      // var xhr = new XMLHttpRequest()
      // // GET请求,请求路径url,async(是否异步)
      // xhr.open('POST', `${this.$apiUrl}apply/pay/mentorPayment/voucher/export`, true)
      // // 设置请求头参数的方式,如果没有可忽略此行代码
      // const token = util.sessions.get('token')
      // xhr.setRequestHeader('Authorization', token)
      // xhr.setRequestHeader('version', this.$apiVersion)
      // xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
      // // 设置响应类型为 blob
      // xhr.responseType = 'blob'
      // // 关键部分
      // xhr.onload = function (e) {
      //   // 如果请求执行成功
      //   if (this.status == 200) {
      //     var blob = this.response
      //     console.log(blob)
      //     var a = document.createElement('a')
      //     // blob.type = "multipart/form-data";
      //     var url = URL.createObjectURL(blob)
      //     a.href = url
      //     a.download = fileName
      //     a.click()
      //     // 释放之前创建的URL对象
      //     window.URL.revokeObjectURL(url)
      //   }
      // }
      // // 发送请求
      // // 发送请求
      // xhr.send(JSON.stringify({
      //   idArr: data,
      // }))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
