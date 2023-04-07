<template>
  <d2-container>
    <div class="d2_container" ref="d2" v-loading="loading">
      <div style="display:flex;flex-direction:column" >
        <div class="search_page" ref="search">
          <div class="search">
            <el-select
              style="width:160px"
              class="mr10"
              filterable
              size="mini"
              v-model="userId"
              placeholder="请选择"
              clearable
              @change="Topage(1)"
            >
              <el-option-group
                v-for="group in users"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
            <el-input
              class="mr10"
              size="mini"
              style="width:160px"
              clearable
              v-model="search"
              placeholder="支持orderID、学员姓名"
              @keyup.enter.native="Topage(1)"
              v-if="roleInfo.includes(`accounting_audit_search`)"
            ></el-input>
            <el-button
              icon="el-icon-search"
              v-if="roleInfo.includes(`accounting_audit_search`)"
              class="mr10"
              size="mini"
              plain
              @click="Topage(1)"
            >搜索</el-button>
            <div v-if="showTotalArr.length > 0 && status" style="display:inline-block;line-height:28px;font-size:12px;background:#909399;color:#fff;padding:0 10px;border-radius:5px;">
              待审核总金额
              <span v-for="(item,i) in showTotalArr" :key="i" >
                &nbsp&nbsp&nbsp{{ item.type }}：{{ item.total }}
              </span>
            </div>
            <div v-if="showTotalArr.length <= 0 && status" style="display:inline-block;line-height:28px;font-size:12px;background:#F56C6C;color:#fff;padding:0 10px;border-radius:5px;">
              待审核总金额：空
            </div>
          </div>
          <pagination
            v-if="roleInfo.includes(`accounting_audit_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
          ></pagination>
        </div>
        <el-table
          :data="entryData"
          :max-height="tableHeight"
          highlight-current-row
          border
        >
          <el-table-column align="center" prop="" label="操作" width="100" fixed="left" >
            <template slot-scope="scope">
              <span v-if="scope.row.confirmStatus == '待审核'">
                <span v-if="(scope.row.confirmTime1 && (scope.row.confirmor2 == userInfo.userId || scope.row.confirmor2.indexOf(userInfo.userId) != '-1')) || (!scope.row.confirmTime1 && (scope.row.confirmor1 == userInfo.userId  || scope.row.confirmor1.indexOf(userInfo.userId) != '-1'))">
                  <el-button type="text" @click="auditconfirm(scope.row)" size="mini">通过</el-button>
                  <el-button type="text" primary="danger" @click="auditconfirmno(scope.row)" size="mini">驳回</el-button>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orderId" width="200" label="订单编号"  show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="entryOrderDetail(scope.row.orderId)" size="mini">{{scope.row.orderId}}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="signWayName" label="线上签约"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="programNames" label="项目名" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="programNum" label="订单项目数" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="menteeName" label="学员姓名" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="schoolName" label="School" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="countryName" label="Country"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="degree" label="Degree" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="finishYear" label="Graduate Year" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="sourceFrom" label="Channels" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="kpiPeriod" label="KPI月份" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="revenueDate" label="入账时间" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="account" label="账号" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="transfer" label="付款人" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="" label="凭证" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="viewVoucher(scope.row)" size="mini">查看（{{scope.row.voucherNum}}）</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="revenueType" label="金额类型"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="revenue" label="金额"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="actualAmount" label="财务确认的本笔到账金额" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createByName" label="提交人"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="提交时间" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="confirmStatus" label="入账状态" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="confirmor1Name" label="审核人"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="confirmTime1" label="审核时间" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="confirmor2Name" label="财务审核人"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="confirmTime2" label="财务审核时间" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="refuseReason" label="驳回理由"  show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="请输入驳回理由" width="500px" :visible="refundVisible" :before-close="refundClose">
      <el-input ref="inputRef" v-model="refundValue" @keydown.enter.native="refundSubmit" @keydown.delete.native="backspace" placeholder="按下回车键提交"></el-input>
    </el-dialog>
    <voucher-view
      :voucherViewVisible="voucherViewVisible"
      :voucherViewData="voucherViewData"
      @close="voucherViewClose"
    ></voucher-view>
    <account-review
      :accountReviewVisible="accountReviewVisible"
      :accountReviewData="accountReviewData"
      @submit="accountReviewSubmit"
      @close="accountReviewClose"
    ></account-review>
    <orderDetail
      :orderDetailVisible="orderDetailVisible"
      :orderId="orderId"
      @close="orderDetailClose"
    ></orderDetail>
  </d2-container>
</template>

<script>
import accountReview from './components/account_review.vue'
import voucherView from './components/voucher_view.vue'
import orderDetail from '../monthly_report/components/order_detail.vue'
import api from '@/api/sales_assistant'
import api2 from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { priceToM } from '@/libs/util.js'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { accountReview, voucherView, orderDetail },
  data () {
    return {
      pageSize: 100,
      search: '',
      total: 0,
      pageNum: 1,
      users: [],
      userId: '',
      entryData: [],
      tableHeight: 'auto',
      loading: false,
      voucherVisit: false,
      voucherData: {
        list: [],
        contractlist: [],
        signId: '',
        billId: ''
      },
      accountReviewVisible: false,
      accountReviewData: null,
      voucherViewData: {},
      voucherViewVisible: false,
      orderId: '',
      orderDetailVisible: false,
      refundVisible: false,
      refundValue: '',
      applyId: '',
      showTotalArr: [],
      status: false
    }
  },
  computed: {
    ...mapState('role', [
      'userInfo'
    ]),
    ...mapState('role', [
      'roleInfo'
    ])
  },
  created () {},
  mounted () {
    this.getSalesList()
    this.Topage(1)
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
        console.log(this.tableHeight)
		  })
    }
  },
  methods: {
    getSalesList () {
      api2.getUserList2().then(({ data }) => {
        this.users = data.map((value, i) => ({
          label: value.deptName,
          options: value.userArr.map((item, j) => ({
            value: item.userId,
            label: item.userName
          }))
        }))
      })
    },
    Topage () {
      this.loading = true
      const data = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sortCol: this.sortCol,
        sort: this.sort,
        createBy: this.userId
      }
      console.log('获取入账列表参数：', JSON.stringify(data))
      api.signbillList(data).then(({ data }) => {
        let arrPayType = []
        for (let i = 0; i < data.rows.length; i++) {
          if (data.rows[i].revenueType) {
            data.rows[i].revenueType = data.rows[i].revenueType.toUpperCase()
            if (data.rows[i].confirmStatus == '待审核') {
              arrPayType.push(data.rows[i].revenueType)
            }
          }
        }
        arrPayType = Array.from(new Set(arrPayType))
        const priceArr = []
        for (let i = 0; i < arrPayType.length; i++) {
          priceArr.push({
            type: arrPayType[i],
            total: 0
          })
          for (let j = 0; j < data.rows.length; j++) {
            if (data.rows[j].confirmStatus == '待审核') {
              if (arrPayType[i] == data.rows[j].revenueType) {
                priceArr[i].total = Math.round(priceArr[i].total + data.rows[j].revenue * 1)
              }
            }
          }
        }
        this.showTotalArr = priceArr
        console.log(this.showTotalArr)
        this.pageNum = data.page
        const rows = data.rows
        this.$nextTick(() => {
          this.status = true
        })
        rows.forEach(v => {
          v.revenue = priceToM(v.revenue, '')
          v.actualAmount = priceToM(v.actualAmount, '')
        })
        rows.map(e => {
          e.hotbutton = e.confirmStatus
          e.programName =
            e.program === undefined
              ? ''
              : this.program.some(({ itemValue }) => itemValue === e.program)
                ? this.program.find(({ itemValue }) => itemValue === e.program)
                  .itemName
                : e.program
        })
        this.entryData = rows
        this.total = data.total
        this.loading = false
      })
    },
    // 通过
    auditconfirm (row) {
      this.accountReviewVisible = true
      this.accountReviewData = row
    },
    // 驳回
    auditconfirmno (row) {
      console.log('驳回')
      this.applyId = row.applyId
      this.refundVisible = true
      this.refundValue = ''
      this.$nextTick().then(() => {
        this.$refs.inputRef.$el.children[0].focus()
      })
    },
    refundClose () {
      this.refundVisible = false
      this.refundValue = ''
    },
    backspace () {
      this.refundValue = this.refundValue.substring(0, this.refundValue.length - 1)
    },
    refundSubmit () {
      if (this.refundValue.trim() == '') {
        this.$message('驳回理由不可为空')
        return
      }
      const data = {
        applyId: this.applyId,
        approveStatus: '2',
        msg: this.refundValue
      }
      console.log(data)
      api.setCommAudit(data).then(res => {
        this.$message({
          type: 'success',
          message: '驳回成功!'
        })
        this.refundClose()
        this.Topage(this.pageNum)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 弹框回调
    accountReviewClose () {
      this.accountReviewVisible = false
      this.accountReviewData = null
    },
    accountReviewSubmit () {
      this.accountReviewClose()
      this.Topage(this.pageNum)
    },
    // 凭证弹框
    viewVoucher (row) {
      this.voucherViewData.applyId = row.applyId
      this.voucherViewData.orderId = row.orderId
      this.voucherViewVisible = true
    },
    // 凭证弹框关闭
    voucherViewClose () {
      this.voucherViewVisible = false
      this.voucherViewData = {}
    },
    entryOrderDetail (orderId) {
      console.log('orderId', orderId)
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
.d2_container{
  width:100%;
  height:100%
}
</style>
