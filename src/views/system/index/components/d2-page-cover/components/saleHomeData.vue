
<template>
  <div>
    <el-drawer  :visible.sync="saleHomeDataVisible" size="90%" :before-close="close">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="本周期" name="first">
          <div style="display:flex;min-width:400px;max-width:600px;justify-content:space-between;padding:10px">
            <div style="flex:1">
              <p v-if="homeData.salesLevel">销售级别：Lv.{{homeData.salesLevel || '**'}}</p>
              <p v-if="!homeData.isComplete" style="color:#F56C6C">是否达标：未达标
                <template v-if="homeData.info">
                  <el-tooltip placement="top">
                    <div slot="content" style="white-space: pre-line;">
                      {{homeData.info}}
                    </div>
                    <el-button style="padding:5px 0px" type="text" class="el-icon-info"></el-button>
                  </el-tooltip>
                </template>
              </p>
              <p v-else-if="homeData.isComplete" style="color:#67C23A">是否达标：已达标
                <template v-if="homeData.info">
                  <el-tooltip placement="top">
                    <div slot="content" style="white-space: pre-line;">{{homeData.info}}</div>
                    <el-button type="text" class="el-icon-info"></el-button>
                  </el-tooltip>
                </template>
              </p>
              <p>考核周期：{{homeData.historyMonth}} （从 {{homeData.fromDate}} 至 {{homeData.toDate}}）</p>
              <p v-if="homeData.brokerageRate">提成比例：{{homeData.brokerageRate || '**'}}%</p>
              <p type="primary">销售提成：<span style="font-size:12px;text-decoration:underline;color:#FF8C00;cursor:pointer" @click="detailSalesKpiFn()" > {{homeData.brokerageTotal }} </span></p>
              <p v-if="homeData.targetKpi && homeData.targetKpi > 0">月度KPI：{{homeData.kpi}}/{{homeData.targetKpi}}<br>
                <el-progress  :percentage="Math.round(homeData.kpi/homeData.targetKpi*100)" :color="customColor"></el-progress>
              </p>
              <p v-if="homeData.kpiTarget && homeData.kpiTarget != 0" type="primary">月度签约KPI：{{homeData.kpi}}/{{homeData.kpiTarget}}<br>
                <el-progress  :percentage="Math.round(homeData.kpi/homeData.kpiTarget*100)" :color="customColor"></el-progress>
              </p>
              <p type="primary">月度入账KPI：{{homeData.monthlyRevenueKpi}}/{{homeData.monthlyRevenueKpiTarget}}<br>
                <el-progress v-if="homeData.monthlyRevenueKpiTarget && homeData.monthlyRevenueKpiTarget != 0" :percentage="Math.round(homeData.monthlyRevenueKpi/homeData.monthlyRevenueKpiTarget*100)" :color="customColor"></el-progress>
              </p>
              <!-- salesWeekDayInSevenDays 工作日安排从minxins中直接获取 -->
              <div  style="display: flex; flex-direction: row; justify-content: flex-start;">
                <div style="display:inline-block;width:80px">工作日安排:</div>
                <div style="display:inline-block;width:auto">
                  <table width="100%" align="center" border="1" bordercolor="#b3c0d1">
                    <tr>
                      <td v-for="(item,index) in salesWeekDayInSevenDays" :key="index" style="text-align:center;padding:0 3px">
                        {{item.date}} <br> {{item.weekdayStatus | weekdayStatusToText}}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="" style="margin-left:20px;min-width:120px" v-if="homeData.currencyArr && homeData.currencyArr.length > 0">
              <div class="" style="height:40px;line-height:40px;">仅限订单 汇率参考</div>
              <div v-for="(item,i) in homeData.currencyArr" :key="i">
                  {{item.currencyType}}: {{item.orderRate1}} - {{item.orderRate2}}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上周期" name="second" v-if="preHomeData">
          <div style="display:flex;min-width:400px;padding:10px">
            <div style="">
              <p v-if="preHomeData.info && preHomeData.info.indexOf('未达标') != '-1'" style="color:#F56C6C">是否达标：未达标
                <template v-if="preHomeData.info">
                  <el-tooltip placement="top">
                    <div slot="content" style="white-space: pre-line;">
                      {{preHomeData.info}}
                    </div>
                    <el-button style="padding:5px 0px" type="text" class="el-icon-info"></el-button>
                  </el-tooltip>
                </template>
              </p>
              <p v-else-if="preHomeData.info && preHomeData.info.indexOf('未达标') == '-1'" style="color:#67C23A">是否达标：已达标
                <template v-if="preHomeData.info">
                  <el-tooltip placement="top">
                    <div slot="content" style="white-space: pre-line;">{{preHomeData.info}}</div>
                    <el-button type="text" class="el-icon-info"></el-button>
                  </el-tooltip>
                </template>
              </p>
              <p>考核周期：{{preHomeData.historyMonth}} （从 {{preHomeData.fromDate}} 至 {{preHomeData.toDate}}）</p>
              <p v-if="preHomeData.brokerageRate">提成比例：{{preHomeData.brokerageRate || '**'}}%</p>
              <p v-if="preHomeData.brokerageRate">VIP推荐提成比例：{{preHomeData.vipBrokerageRate || '**'}}%</p>
              <p  type="primary">汇总提成：<span style="font-size:12px;text-decoration:underline;color:#FF8C00;"  > {{preHomeData.brokerageTotal }} </span></p>
              <p v-if="preHomeData.targetKpi && preHomeData.targetKpi > 0">月度KPI：{{preHomeData.kpi}}/{{preHomeData.targetKpi}}<br>
                <el-progress  :percentage="Math.round(preHomeData.kpi/preHomeData.targetKpi*100)" :color="customColor"></el-progress>
              </p>
              <p v-if="preHomeData.kpiTarget && preHomeData.kpiTarget != 0" type="primary">月度签约KPI：{{preHomeData.kpi}}/{{preHomeData.kpiTarget}}<br>
                <el-progress  :percentage="Math.round(preHomeData.kpi/preHomeData.kpiTarget*100)" :color="customColor"></el-progress>
              </p>
              <p   type="primary">月度入账KPI：{{preHomeData.monthlyRevenueKpi}}/{{preHomeData.monthlyRevenueKpiTarget}}<br>
                <el-progress v-if="preHomeData.monthlyRevenueKpiTarget && preHomeData.monthlyRevenueKpiTarget != 0" :percentage="Math.round(preHomeData.monthlyRevenueKpi/preHomeData.monthlyRevenueKpiTarget*100)" :color="customColor"></el-progress>
              </p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="年度团队入账" name="third" v-if="teamRevenueData.length > 0">
          <div style="padding:10px">
            <div class="create-cant-program-model" v-for="(item,i) in teamRevenueData" style="margin-bottom:20px" :key="i">
              <div class="program-model-title">{{item.title}}</div>
              <div >
                  <div style="font-size:12px;line-height:28px;">
                    <p>考核周期： <span style="color:#FF8C00">{{item.fromPeriod}} 至 {{item.toPeriod}}</span></p>
                    <p>团队累计入账： <span style="text-decoration:underline;color:#FF8C00;cursor:pointer" @click="detailGroup(item.revenueList)">{{item.revenueTotal}}</span></p>
                  </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="出入账一览" name="forth" >
          <div style="padding:10px">
            <div>
              <el-date-picker
                v-model="myDate"
                class="mr10"
                type="daterange"
                size="mini"
                :unlink-panels="true"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button icon="el-icon-search" class="" plain @click="GOBillList()">GO</el-button>
                <el-button v-if="myDate.length == 2" icon="el-icon-search" class="mr10" plain @click="exportBillList()">导出</el-button>
            </div>
            <div>
              <el-table :data="billList" style="width: 100%" v-loading="loadingBill" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="orderId" label="订单ID" ></el-table-column>
                <el-table-column prop="signDate" label="签约日期" ></el-table-column>
                <el-table-column prop="revenueDate" label="交易日期" ></el-table-column>
                <el-table-column prop="billType" label="交易类型"
                :filters="filsterList" :filter-method="filterTag" filter-placement="bottom-end"></el-table-column>
                <el-table-column prop="transfer" label="付款人" ></el-table-column>
                <el-table-column prop="revenueType" label="交易货币" ></el-table-column>
                <el-table-column prop="revenue" label="交易金额" ></el-table-column>
                <el-table-column prop="account" label="到账账户" ></el-table-column>
                <el-table-column prop="exchangeRate" label="订单汇率" ></el-table-column>
                <el-table-column prop="totalInCny" label="等值人民币" ></el-table-column>
                <el-table-column prop="currencyType" label="到账货币" ></el-table-column>
                <el-table-column prop="actualAmount" label="到账金额" ></el-table-column>
                <el-table-column prop="createByName" label="申请人" ></el-table-column>
                <el-table-column prop="createTime" label="申请时间" ></el-table-column>
                <el-table-column prop="contactName1" label="主联系人" ></el-table-column>
                <el-table-column prop="contactName2" label="副联系人" ></el-table-column>
                <el-table-column prop="contactRate" label="分单比例" ></el-table-column>
                <el-table-column prop="kpiPeriod" label="交易周期" ></el-table-column>
                <el-table-column prop="brokerageRate" label="提成比例" ></el-table-column>
                <el-table-column prop="brokerageAmount" label="提成金额估算" ></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <detailSaleKpi :detailSaleKpiVisible="detailSaleKpiVisible" :salesData="salesData" @close="closeSalesKpi" />
    <groupSaleKpi :groupKpiVisible="groupKpiVisible" :teamRevenueArr="teamRevenueArr" @close="closeGroupKpi" />

  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import detailSaleKpi from './salesKpi'
import groupSaleKpi from './groupKpiDetail'
import mixins from '@/plugin/mixins'

export default {
  name: 'saleHomeData',
  mixins: [mixins],
  components: {
    detailSaleKpi, groupSaleKpi
  },
  props: {
    saleHomeDataVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    saleHomeDataVisible: function (val) {
      if (val) {
        this.activeName = 'first'
        this.initPage()
      }
    }
  },
  data () {
    return {
      activeName: 'first',
      salesData: {},
      loadingBill: false,
      homeData: {},
      teamRevenueData: [],
      preHomeData: {},
      salesWeekDayInSevenDays: [],
      detailSaleKpiVisible: false,
      groupKpiVisible: false,
      teamRevenueArr: [],
      billList: [],
      filsterList: [],
      myDate: [],
      customColor: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    async initPage () {
      api.saleHomeData().then(res => {
        console.log('首页数据', res)
        this.salesData = res.data.currentPeriod
        this.homeData = res.data.currentPeriod
        this.teamRevenueData = res.data.teamRevenueData
        this.preHomeData = res.data.prePeriodData || false
      })
      this.salesWeekDayInSevenDays = await this.getDictionary('sales_week_day_in_seven_days')
    },
    GOBillList () {
      this.loadingBill = true
      const data = {
        fromDate: this.myDate[0],
        toDate: this.myDate[1]
      }
      api.saleHomeBillList(data).then(res => {
        console.log(res)
        let arr = []
        const arr2 = []
        res.data.forEach(item => {
          arr.push(item.billType)
        })
        arr = new Set(arr)
        for (const value of arr.values()) {
          arr2.push({ text: value, value: value })
        }
        this.filsterList = arr2
        this.billList = res.data
        this.loadingBill = false
      })
    },
    filterTag (value, row) {
      return row.billType === value
    },
    detailSalesKpiFn () {
      this.detailSaleKpiVisible = true
    },
    closeSalesKpi () {
      this.detailSaleKpiVisible = false
    },
    detailGroup (arr) {
      this.teamRevenueArr = arr
      this.groupKpiVisible = true
      console.log(arr)
    },
    closeGroupKpi () {
      this.groupKpiVisible = false
    },
    exportBillList () {
      const fileName = '销售出入账列表列表'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}kpi/sales/bill/list/export?fromDate=${this.myDate[0] || ''}&toDate=${this.myDate[1] || ''}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = this.$store.state.role.token
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.xlsx' // 如123.xlsx
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
          a = null
        }
      }
      // 发送请求
      xhr.send()
    }
  }
}
</script>
<style  scoped>
    .weightFont{
        font-weight: 700;
    }
</style>
