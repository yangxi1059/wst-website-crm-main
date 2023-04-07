<!--
 * @Author: 杨曦
 * @Date: 2022-07-01 15:53:13
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-07 10:21:05
 * @Version:
 * @Description:
-->

<template>
  <div>
    <el-drawer  :visible.sync="saleBdDataVisible" size="90%" :before-close="close">
      <div style="margin:0 20px" v-loading="loading">
        <div style="margin-bottom:40px">
          <el-descriptions title="提成信息" direction="vertical" :column="6" border>
            <el-descriptions-item label="统计周期">{{currentPeriod.historyMonth}}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{currentPeriod.fromDate}}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{currentPeriod.toDate}}</el-descriptions-item>
            <el-descriptions-item label="咨询学生人数">{{currentPeriod.consultCount}}</el-descriptions-item>
            <el-descriptions-item label="KPI">{{currentPeriod.kpi}}</el-descriptions-item>
            <el-descriptions-item label="总提成">{{currentPeriod.brokerageTotal}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div>
          <el-table
            :data="orderList"
            size="mini"
            border
            highlight-current-row
          >
            <el-table-column align="center" prop="orderId" label="订单id" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="signDate" label="签约日期" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="orderKpiPeriod" label="订单周期" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="contract1Name" label="主联系人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="menteeName" label="学员姓名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="cooperatorName" label="合作商名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="bdManageByName" label="BD管理人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="totalInCny" label="本周期入账（折算人名币）" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="bdBrokerageRate" label="订单提成比例" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="brokerageTotal" label="订单提成金额" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'

export default {
  name: 'saleHomeData',
  mixins: [mixins],
  components: {},
  props: {
    saleBdDataVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    saleBdDataVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  data () {
    return {
      loading: false,
      currentPeriod: {
        historyMonth: '',
        fromDate: '',
        toDate: '',
        kpi: '',
        brokerageTotal: ''
      },
      orderList: []
    }
  },
  methods: {
    close () {
      this.$emit('close')
      this.orderList = []
      this.currentPeriod = {
        historyMonth: '',
        fromDate: '',
        toDate: '',
        kpi: '',
        brokerageTotal: ''
      }
    },
    async initPage () {
      this.loading = true
      api.getBDdata().then(res => {
        console.log('首页数据', res)
        this.orderList = res.data.currentPeriod.billList
        this.currentPeriod = res.data.currentPeriod
        this.loading = false
      })
    }
  }
}
</script>
<style  scoped>
    .weightFont{
        font-weight: 700;
    }
</style>
