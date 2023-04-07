<template>
  <d2-container v-loading="loading">
    <div class="sales yx-echarts">
      <div class="search_page">
        <div class="search">
          <el-date-picker
            size="mini"
            style="width:150px"
            v-model="fromDate"
            class="mr10"
            clearable
            :editable="false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            @change="Topage()"
          ></el-date-picker>
          <el-date-picker
            style="width:150px"
            size="mini"
            class="mr10"
            v-model="toDate"
            clearable
            :editable="false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            @change="Topage()"
          ></el-date-picker>
          <el-select
            style="width:150px"
            size="mini"
            class="mr10"
            clearable
            filterable
            v-model="applyType"
            placeholder="请选择出账类型"
            @change="Topage()"
          >
            <el-option
              v-for="item in apply_type_money"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            style="width:150px"
            size="mini"
            class="mr10"
            clearable
            filterable
            v-model="currencyType"
            placeholder="请选择货币类型"
            @change="Topage()"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-button @click="totalPrice()" size="mini">汇总</el-button>
          <el-button @click="exportFile()" size="mini" style="margin-right:10px">导出</el-button>
          <el-tag size="medium" type="warning"  >加权平均汇率: {{num}}</el-tag>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <div class="table mt10" v-if="'mentor_payment_all' == applyType">
        <hot-table
          :settings="settings_mentor_payment"
          ref="moneyTable"
          licenseKey="non-commercial-and-evaluation"
        ></hot-table>
      </div>
      <div class="table mt10" v-if="'internship_offer_payment' == applyType">
        <hot-table
          :settings="settings_internship_offer_payment"
          ref="moneyTable"
          licenseKey="non-commercial-and-evaluation"
        ></hot-table>
      </div>
      <div class="table mt10" v-else>
        <hot-table :settings="settings" ref="moneyTable" licenseKey="non-commercial-and-evaluation"></hot-table>
      </div>
      <el-dialog
        :title="'金额汇总'"
        :visible.sync="totalVisible"
        width="820px"
        :before-close="totalClose"
      >
        <div class="box" style="display:flex">
          <div style="width:50%"></div>
          <div></div>
        </div>
        <el-table :data="totalPriceList" row-key="id" default-expand-all  :tree-props="{children: 'children', hasChildren: 'hasChildren'}" size="mini" stripe border highlight-current-row>
          <el-table-column prop="currencyTypeName" align="center" label="货币类型" min-width="100"></el-table-column>
          <el-table-column prop="payAmount" align="center" label="金额" min-width="100"></el-table-column>
          <el-table-column prop="payAmountCny" align="center" label="等值人民币" min-width="100"></el-table-column>
        </el-table>
        <el-row class="mt10 mb20">
          <el-col :span="8" class="_item-value">汇总等值人民币：</el-col>
          <el-col :span="10" class="_item-value"></el-col>
          <el-col :span="6" class="_item-name colorG">{{totalAllPrice}}</el-col>
        </el-row>

        <div id="main" style="width: 100%;height:400px;"></div>
        <!-- <v-chart :options="polar"  id="echarts"/> -->
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import Handsontable from 'handsontable'
import api from '@/api/sales_month_new'
import { priceToM } from '@/libs/util.js'
import { renderShortText } from '@/libs/tableRender.js'
import { downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'

// import ECharts from "vue-echarts";
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

const renderOrder = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  td.innerHTML = value && `<a><p  onclick='view("${value}")'> 查看 </p></a>`
  return td
}

// render_end=============================
export default {
  name: 'money-out',
  mixins: [mixins],
  data () {
    return {
      loading: false,
      num: '',
      sort: '',
      sortCol: '',
      fromDate: '',
      toDate: '',
      applyType: '',
      currencyType: '',
      pageNum: 1,
      total: 0,
      apply_type_money: [{
        itemName: '导师出账汇总',
        itemNameEng: '导师出账汇总',
        itemValue: 'mentor_payment_all',
        parentDic: '',
        parentItem: ''
      }],
      apply_type: [],
      money_type: [],
      settings: {
        height: 700,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'applyId'
          },
          {
            data: 'applyTitle'
          },
          {
            data: 'applyTypeName'
          },
          {
            data: 'currencyTypeName',
            type: 'text'
          },
          {
            data: 'payAmount'
          },
          {
            data: 'payRate'
          },
          {
            data: 'payAcc',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'payDate'
          },
          {
            data: 'payRemark'
          },
          {
            data: 'payVoucher',
            renderer: renderOrder
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.pageNum = 1
            this.Topage(this.pageNum)
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data
            this.sort = newVal[0].sortOrder
            this.pageNum = 1
            if (this.sortCol === 'hotbutton') return
            this.Topage(this.pageNum)
          }
        },
        colHeaders: [
          '',
          '标题',
          '申请类型',
          '货币类型',
          '支付金额',
          '汇率',
          '支付账户',
          '支付日期',
          '支付备注',
          '支付凭证'
        ]
      },
      settings_mentor_payment: {
        height: document.documentElement.clientHeight - 200,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: ''
          },
          {
            data: 'mentorName'
          },
          {
            data: 'menteeName'
          },
          {
            data: 'signLesson'
          },
          {
            data: 'payLessonHours'
          },
          {
            data: 'applyTime'
          },
          {
            data: 'payDate'
          },
          {
            data: 'note',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'currencyType'
          },
          {
            data: 'paymentAccountName'
          },
          {
            data: 'Status'
          },
          {
            data: ''
          },
          {
            data: 'compensationUsd'
          },
          {
            data: 'payRate'
            // renderer: renderOrder
          },
          {
            data: ''
          },
          {
            data: 'paymentAcc'
          },
          {
            data: 'bankName'
          },
          {
            data: 'realName'
          },
          {
            data: 'idCard'
          },
          {
            data: ''
          },
          {
            data: 'paymentAmountCny'
          },
          {
            data: ''
          },
          {
            data: 'venmoAcc'
          },
          {
            data: 'chaseAcc'
          },
          {
            data: 'boaAcc'
          },
          {
            data: 'boaName'
          },
          {
            data: 'paypalAcc'
          },
          {
            data: 'paymentAmountUsd'
          },
          {
            data: ''
          },
          {
            data: 'currencyType'
          },
          {
            data: 'payAmount'
          },
          {
            data: 'payRemark'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.pageNum = 1
            this.Topage(this.pageNum)
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data
            this.sort = newVal[0].sortOrder
            this.pageNum = 1
            if (this.sortCol === 'hotbutton') return
            this.Topage(this.pageNum)
          }
        },
        colHeaders: [
          '',
          'Mentor',
          'Mentee',
          'Total Allocated Sessions',
          '# of Sessions',
          'Date reported',
          'Date paid',
          'Sessions',
          '货币类型',
          'Payer Account',
          'Status',
          '',
          '薪资（美金）',
          'Forex Rate',
          '',
          '卡号',
          '开户行',
          '姓名',
          '身份证号码',
          '单笔',
          '工资支出（CNY）',
          '',
          'Venmo',
          'Chase',
          'BOA',
          'BOA Name',
          'PayPal',
          '工资支出（USD）',
          '',
          '实际支付类型',
          '实际支付金额',
          '支付备注'
        ]
      },
      settings_internship_offer_payment: {
        height: document.documentElement.clientHeight - 200,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: ''
          },
          {
            data: 'menteeName'
          },
          {
            data: 'internshipStartDate'
          },
          {
            data: 'internshipEndDate'
          },
          {
            data: 'internshipLocation'
          },
          {
            data: 'salesName'
          },
          {
            data: 'sabrinaEmail'
          },
          // {
          //   data: "note",
          //   width: 100,
          //   wordWrap: false,
          //   className: "short-text",
          //   renderer: renderShortText
          // },
          {
            data: 'offerReceiveDate'
          },
          {
            data: 'usdFee'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'paymentAccountName'
          },
          {
            data: 'payDate'
          },
          {
            data: 'payRemark'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.pageNum = 1
            this.Topage(this.pageNum)
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data
            this.sort = newVal[0].sortOrder
            this.pageNum = 1
            if (this.sortCol === 'hotbutton') return
            this.Topage(this.pageNum)
          }
        },
        colHeaders: [
          '',
          'MenteeName',
          'StartDate',
          'EndDate',
          'OnsiteOrRemote',
          'Sales',
          'SabrinaEmail',
          'offerReceiveDate',
          'USDFee',
          'CNYFee',
          'Method',
          'PaymentDate',
          'Notes'

        ]
      },
      totalVisible: false,
      bill_currency_type: [],
      totalPriceList: [],
      pageSize: 400,
      totalAllPrice: 0,
      polar: {
        title: {
          text: '汇总表',
          subtext: '等值人民币',
          left: '0px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 30
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [

        ]
      }
    }
  },
  created () {},
  mounted () {
    this.pageInit()
    window.view = v => this.view(v)
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.apply_type = await this.getDictionary('apply_type')
      this.apply_type_money = this.apply_type_money.concat(this.apply_type)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    Topage (pageNum = 1) {
      this.loading = true
      const data = {
        sort: this.sort,
        sortCol: this.sortCol,
        fromDate: this.fromDate,
        toDate: this.toDate,
        applyType: this.applyType,
        currencyType: this.currencyType,
        pageSize: this.pageSize,
        pageNum: pageNum
      }

      const data2 = {
        fromDate: this.fromDate,
        toDate: this.toDate
      }
      api.getweightedAverageRate(data2).then(res => {
        console.log(res, '999999999999999999')
        this.num = res.data.averageRevenueRate
      })
      console.log(data)
      if (this.applyType == 'mentor_payment_all') {
        api.getMentorPaymentList(data).then(res => {
          this.settings_mentor_payment.data = res.data.rows
          this.total = res.data.total
        })
      } else if (this.applyType == 'internship_offer_payment') {
        api.getInternshipPaymentList(data).then(res => {
          console.log(res, 'yx12321312321325356')
          this.settings_internship_offer_payment.data = res.data.rows
          this.total = res.data.total
        })
      } else {
        api.getPayList(data).then(res => {
          console.log(res)
          this.settings.data = res.data.rows
          this.total = res.data.total
        })
      }
      this.loading = false

    },
    // 导出文件
    exportFile () {
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      const fileName = '出纳列表_'

      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename: fileName + '[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    },
    view (v) {
      console.log(v)
      downloadFun(v, url => {
        window.open(url)
      })
    },
    // 查看条件下汇总金额
    totalPrice () {
      this.totalVisible = true
      this.getTotalPrice()
    },
    totalClose () {
      // document.getElementById("echarts").innerHTML="";
      this.totalVisible = false
    },
    getTotalPrice () {
    //  var myChart = ECharts.init(document.getElementById('echarts'));
      const data = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        applyType: this.applyType,
        currencyType: this.currencyType
      }
      console.log(data)
      let n = 1
      api.getTotalPrice(data).then(res => {
        // console.log("查看条件下汇总金额", res.data.list);
        this.totalPriceList = res.data.list || []
        for (let i = 0; i < this.totalPriceList.length; i++) {
          this.totalPriceList[i].children = []
          this.totalPriceList[i].id = n++
          for (let j = 0; j < this.totalPriceList[i].applyTypeList.length; j++) {
            this.totalPriceList[i].children.push({
              currencyTypeName: this.totalPriceList[i].applyTypeList[j].applyTypeName,
              payAmount: this.totalPriceList[i].applyTypeList[j].payAmount,
              payAmountCny: this.totalPriceList[i].applyTypeList[j].payAmountCny,
              id: n++
            })
          }
        }
        console.log(this.totalPriceList, 'yx3748127498127')
        this.totalAllPrice = priceToM(res.data.totalInCny, '￥')
        this.polar.xAxis.data = JSON.parse(JSON.stringify([]))
        this.polar.series = JSON.parse(JSON.stringify([]))
        this.polar.legend.data = JSON.parse(JSON.stringify([]))
        const dataEcharts = JSON.parse(JSON.stringify(res.data.list))
        dataEcharts.forEach(v => {
          this.polar.xAxis.data.push(v.currencyTypeName)
        //   // this.polar.series[0].data.push(v.payAmount);
        //   this.polar.series[0].data.push(v.payAmountCny);
        })
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < dataEcharts[0].applyTypeList.length; j++) {
            this.polar.legend.data.push(dataEcharts[0].applyTypeList[j].applyTypeName)
          }
        }
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < dataEcharts[i].applyTypeList.length; j++) {
            this.polar.series.push({
              name: dataEcharts[0].applyTypeList[j].applyTypeName,
              type: 'bar',
              stack: '金额情况',
              data: []
            })
          }
        }
        for (let i = 0; i < this.polar.series.length; i++) {
          if (dataEcharts[0] && dataEcharts[0].applyTypeList[i]) {
            if (dataEcharts[0].applyTypeList[i].payAmountCny) {
              this.polar.series[i].data.push(dataEcharts[0].applyTypeList[i].payAmountCny)
            } else {
              this.polar.series[i].data.push(0)
            }
          } else {
            this.polar.series[i].data.push(0)
          }
          if (dataEcharts[1] && dataEcharts[1].applyTypeList[i]) {
            if (dataEcharts[1].applyTypeList[i].payAmountCny) {
              this.polar.series[i].data.push(dataEcharts[1].applyTypeList[i].payAmountCny)
            } else {
              this.polar.series[i].data.push(0)
            }
          } else {
            this.polar.series[i].data.push(0)
          }
          if (dataEcharts[2] && dataEcharts[2].applyTypeList[i]) {
            if (dataEcharts[2].applyTypeList[i].payAmountCny) {
              this.polar.series[i].data.push(dataEcharts[2].applyTypeList[i].payAmountCny)
            } else {
              this.polar.series[i].data.push(0)
            }
          } else {
            this.polar.series[i].data.push(0)
          }
          if (dataEcharts[3] && dataEcharts[3].applyTypeList[i]) {
            if (dataEcharts[3].applyTypeList[i].payAmountCny) {
              this.polar.series[i].data.push(dataEcharts[3].applyTypeList[i].payAmountCny)
            } else {
              this.polar.series[i].data.push(0)
            }
          } else {
            this.polar.series[i].data.push(0)
          }
          if (dataEcharts[4] && dataEcharts[4].applyTypeList[i]) {
            if (dataEcharts[4].applyTypeList[i].payAmountCny) {
              this.polar.series[i].data.push(dataEcharts[4].applyTypeList[i].payAmountCny)
            } else {
              this.polar.series[i].data.push(0)
            }
          } else {
            this.polar.series[i].data.push(0)
          }
        }
        this.$nextTick(() => {
          var myChart = echarts.init(document.getElementById('main'))
          myChart.setOption(this.polar, true)
        })
      })
    }
  }

  
}
</script>

<style scoped>
.table {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
}
.yx-echarts .echarts{
  width: 800px;
}
.yx-echarts .echarts > div{
  width: 100% !important;
}
.sale-revenue {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #fff;
}
.revenue-head {
  font-size: 20px;
  margin: 5px 30px;
}
.info {
  text-overflow: ellipsis;
}
.d2-container-full__body{
  overflow: hidden;
  overflow-y: auto;
}
</style>
