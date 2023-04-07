<!--
 * @Author: 库建华
 * @Date: 2019-04-25 18:34:38
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-07 10:22:47
 * @Version: 2
 * @Description: BD月报
 -->
<template>
  <d2-container  >
    <div class="sales" v-loading="loading">
      <div class="sale" v-if="!MyData.sale_revenue_show">
        <el-select
          size="mini"
          class="mr10"
          filterable
          v-model="MyData.select_data"
          :value="MyData.select_data"
        >
          <el-option v-for="item in month" :key="item" :value="item">{{item}}</el-option>
        </el-select>
        <el-button @click="getBDList" size="mini">GO</el-button>
        <el-button @click="exportFile('saleTable')" size="mini">导出</el-button>
        <div class="table mt10" >
          <hot-table :settings="settings" ref="saleTable" licenseKey="non-commercial-and-evaluation"></hot-table>
        </div>
      </div>
      <!-- BD对应客户 -->
      <div class="sale-revenue" v-if="MyData.sale_revenue_show">
        <div class="mt10" :style="{display: 'flex'}">
          <div class="revenue-head">姓名：{{MyData.userName}}</div>
          <el-button  style="font-size:12px;height:32px" size="mini" type="primary" @click="changeStatic()">切换数据</el-button>
          <div class="revenue-head">月份：{{MyData.month}}</div>
          <el-button style="font-size:12px;height:32px" size="mini" @click="exportFile()">导出</el-button>
          <el-button style="font-size:12px;height:32px" size="mini" @click="back">返回</el-button>
        </div>
        <hot-table
          v-if="orderListVisible"
          :settings="settings_revenue"
          ref="saleKPITable"
          licenseKey="non-commercial-and-evaluation"
          class="mt10"
        ></hot-table>
        <hot-table
          v-else
          :settings="settings_revenue_in"
          ref="saleInKPITable"
          licenseKey="non-commercial-and-evaluation"
          class="mt10"
        ></hot-table>
      </div>
      <orderDetail
        :orderDetailVisible="orderDetailVisible"
        :orderId="orderId"
        @close="orderDetailClose"
      ></orderDetail>
      <applyDetail
        :orderEntryDetailVisible="applyDetailVisible"
        :applyData="applyData"
        @close="applyDetailClose"
      ></applyDetail>
    </div>
  </d2-container>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import axios from '@/api/sales_month_new'
// import { priceToM } from "@/utils/common.js";
import orderDetail from './components/order_detail.vue'
import applyDetail from '@/views/apply_audit/order_entry/detail'
import { renderShortText } from '@/libs/tableRender.js'
import Cookies from 'js-cookie'
import util from '@/libs/util'

// import mixins from "@/utils/mixins.js";

// editors=============================
class CustomEditor extends Handsontable.editors.TextEditor {
  constructor (props) {
    super(props)
  }

  createElements () {
    super.createElements()

    this.TEXTAREA = document.createElement('input')
    this.TEXTAREA.setAttribute('placeholder', 'Custom placeholder')
    this.TEXTAREA.className = 'handsontableInput'
    this.textareaStyle = this.TEXTAREA.style
    Handsontable.dom.empty(this.TEXTAREA_PARENT)
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA)
  }
}
// editors_end===================================

// render========================================
const renderPay = function (instance, td, row, col, prop, value, cellProperties) {
  Handsontable.dom.empty(td)
  td.innerHTML =
    "<a><span  onclick='entryInformation(" +
    value +
    ")'>订单</span></a><a><span class='ml20'  onclick='entryDetail(" +
    value +
    ")'>入账</span></a>"
  return td
}
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
  td.innerHTML = `<a><p  onclick='entryOrderDetail("${value}")'> ${value} </p></a>`
  return td
}
const renderApply = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  td.innerHTML = `<a><p  onclick='entryApplyDetail("${value}")'> ${value} </p></a>`
  return td
}
const renderInfo = function (instance, td, row, col, prop, value, cellProperties) {
  const escaped = Handsontable.helper.stringify(value)
  Handsontable.renderers.DropdownRenderer.apply(this, arguments)
  td.innerHTML = `<span title="${escaped}">${escaped}</span>`
  return td
}

// render_end=============================
export default {
  name: 'monthly',
  components: { orderDetail, HotTable, applyDetail },
  data () {
    return {
      updatedData: [],
      row_data: {},
      MyData: {
        select_data: 'CURRENT_MONTH',
        sale_revenue_show: false,
        userName: '',
        month: ''
      },
      userId: '',
      entryInformationData: '',
      entryDetailData: '',
      changeStatus: 1,
      loading: false,
      orderListVisible: true,
      settings: {
        // width: 584,
        data: [],
        copyable: false,
        fillHandle: false,
        height: () => {
          return document.documentElement.clientHeight - 200
        },
        // readOnly: true,
        minSpareRows: 0, // always add 3 empty rows at the table end
        manualColumnResize: true, // 可拖动列宽 as a boolean to enable column resize
        // manualColumnResize: [40, 50],//(column at 0 index has 40px and column at 1 index has 50px)
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userId',
            type: 'text'
          },
          {
            data: 'pkId',
            type: 'text',
            renderer: renderPay
          },
          {
            data: 'historyMonth',
            type: 'text'
          },
          {
            data: 'fromDate',
            type: 'text'
          },
          {
            data: 'toDate',
            type: 'text'
          },
          {
            data: 'userName',
            type: 'text'
          },
          {
            data: 'salesLevel',
            type: 'text'
          },
          {
            data: 'groupName',
            type: 'text'
          },
          {
            data: 'consultCount',
            type: 'text'
          },
          {
            data: 'kpiTarget',
            type: 'text'
          },
          {
            data: 'kpi',
            type: 'text'
          },
          // {
          //   data: "monthlyRevenueKpiTarget",
          //   type: "text"
          // },
          // {
          //   data: "monthlyRevenueKpi",
          //   type: "text"
          // },
          {
            data: 'info',
            type: 'text',
            width: 100,
            wordWrap: false,
            className: 'info',
            renderer: renderInfo
          },
          {
            data: 'bdBrokerageRate',
            type: 'text'
          },
          {
            data: 'basicWage',
            type: 'text'
          },
          {
            data: 'isTrial',
            type: 'text'
          },
          {
            data: 'brokerageTotal',
            type: 'text'
          },

          // {
          //   data: "quarterlyTeamConversionKpi",
          //   type: "text"
          // },
          // {
          //   data: "quarterlyTeamConversionKpiTarget",
          //   type: "text"
          // },
          // {
          //   data: "quarterlyBrokerageRate",
          //   type: "text"
          // },
          // {
          //   data: "quarterlyBrokerage",
          //   type: "text"
          // },
          {
            data: 'totalWage',
            type: 'text'
          },
          {
            data: 'createTime',
            type: 'text',
            readOnly: true,
            width: 180
          }
        ],
        stretchH: 'all',
        autoWrapRow: true,
        rowHeaders: true,
        colHeaders: [
          '',
          'BD明细',
          '月份',
          '结算起始日',
          '结算结束日',
          '姓名',
          '级别',
          'Group',
          '咨询学生人数',
          '目标KPI',
          '实际KPI',
          // "月度入账目标KPI",
          // "月度入账KPI",
          'Info',
          '提成率',
          '基础薪资',
          '是否试用',
          '提成',
          // '季度团队转化率kpi',
          // '季度团队转化率目标',
          // '季度团队转化率达标奖金比例',
          // '季度奖金',
          '实际总薪资',
          '创建时间'
        ],
        columnSorting: true,
        contextMenu: false,
        sortIndicator: true,
        dropdownMenu: true,
        filters: true,
        search: true,

        afterChange: (change, v) => {
          if (!change) return
          change.forEach(([col, row, old, newData]) => {
            if (!newData) {
              this.settings.data[col][row] = old
            } else {
              this.updatedData.push([col, row, newData])
            }
            console.log(col, row, old, newData)
          })
        }
      },
      settings_revenue: {
        data: [],
        copyable: false,
        fillHandle: false,
        height: () => {
          return document.documentElement.clientHeight - 200
        },
        width: () => {
          // return document.documentElement.clientWidth - 220;
        },
        // readOnly: true,
        minSpareRows: 0, // always add 3 empty rows at the table end
        manualColumnResize: true, // 可拖动列宽 as a boolean to enable column resize
        // manualColumnResize: [40, 50],//(column at 0 index has 40px and column at 1 index has 50px)
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {},
          {
            data: 'userName',
            readOnly: true
          },
          {
            data: 'orderId',
            renderer: renderOrder,
            readOnly: true
          },
          {
            data: 'menteeName',
            readOnly: true
          },
          {
            data: 'schoolName',
            type: 'text'
          },
          {
            data: 'countryName',
            type: 'text'
          },
          {
            data: 'degree',
            type: 'text'
          },
          {
            data: 'finishYear',
            type: 'text'
          },
          {
            data: 'sourceFrom',
            type: 'text'
          },
          {
            data: 'sourceCreateTime',
            type: 'text'
          },
          {
            data: 'menteeCreateDate',
            type: 'text'
          },
          {
            data: 'kpiPeriod',
            type: 'text'
          },
          {
            data: 'kpi',
            type: 'text'
          },
          {
            data: 'signDate',
            type: 'text'
          },
          {
            data: 'actualInCny',
            type: 'text'
          },
          {
            data: 'billDeatil',
            type: 'text'
          },
          {
            data: 'usdRevenue',
            type: 'text'
          },
          {
            data: 'usdActualRevenue',
            type: 'text'
          },
          {
            data: 'cnyRevenue',
            type: 'text'
          },
          {
            data: 'cnyActualRevenue',
            type: 'text'
          },
          {
            data: 'exchangeRate',
            type: 'text'
          },
          {
            data: 'programName',
            type: 'text'
          },
          {
            data: 'programCount',
            type: 'text'
          },
          {
            data: 'programWeight',
            type: 'text'
          },
          {
            data: 'contact1',
            type: 'text'
          },
          {
            data: 'contact2',
            type: 'text'
          },
          {
            data: 'vipRecommenderName',
            type: 'text'
          },
          {
            data: 'brokerageRate',
            type: 'text'
          },
          {
            data: 'commission',
            type: 'text'
          },
          {
            data: 'discountStatusName',
            type: 'text'
          },
          {
            data: 'payStatus',
            type: 'text'
          },
          {
            data: 'endDate',
            type: 'text'
          },
          {
            data: 'note',
            // renderer:,
            width: 200,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // type: "text"
          },
          {
            data: 'mentorHour',
            type: 'text'
          },
          {
            data: 'vipHour',
            type: 'text'
          }
        ],
        stretchH: 'all',
        autoWrapRow: true,
        rowHeaders: true,
        colHeaders: [
          '',
          '姓名',
          '订单编号',
          '学员姓名',
          'School',
          'Country',
          'Degree',
          'Graduate Year',
          'Channels',
          '渠道创建时间',
          '学员录入时间',
          'KPI月份',
          '订单KPI',
          '签约日期',
          '财务确认到账等值人民币',
          '入账详情',
          '入账（USD）',
          '人民币财务确认到账金额（USD）',
          '入账（CNY）',
          '人民币财务确认到账金额（CNY）',
          '汇率',
          '项目名',
          '项目数量',
          '项目KPI权重',
          '主联系人',
          '副联系人',
          'VIP推荐人',
          '订单提成比例',
          '提成',
          '是否折扣',
          '是否收齐',
          'Contract End Date',
          'Note',
          '行业导师一对一课时数',
          '全职导师一对一课时数'
        ],
        columnSorting: true,
        contextMenu: false,
        sortIndicator: true,

        // contextMenu: [
        //   "row_above",
        //   "row_below",
        //   "---------",
        //   "remove_row",
        //   "---------",
        //   "undo",
        //   "redo",
        //   "---------",
        //   "make_read_only",
        //   "---------",
        //   "alignment"
        // ],
        // dropdownMenu:  ['filter_by_condition', 'filter_by_value','filter_action_bar'],
        dropdownMenu: true,
        filters: true,
        // renderAllRows : true,
        search: true,
        /* cells: function (row, col, prop) {
			   var cellProperties = {};
			   cellProperties.renderer = "negativeValueRenderer";
			   return cellProperties;
                }, */
        afterChange: (change, v) => {
          if (!change) return
          change.forEach(([col, row, old, newData]) => {
            if (!newData) {
              this.settings.data[col][row] = old
            } else {
              this.updatedData.push([col, row, newData])
            }
            console.log(col, row, old, newData)
          })
        }
      },
      settings_revenue_in: {
        data: [],
        copyable: false,
        fillHandle: false,
        height: () => {
          return document.documentElement.clientHeight - 200
        },
        width: () => {
          // return document.documentElement.clientWidth - 220;
        },
        // readOnly: true,
        minSpareRows: 0, // always add 3 empty rows at the table end
        manualColumnResize: true, // 可拖动列宽 as a boolean to enable column resize
        // manualColumnResize: [40, 50],//(column at 0 index has 40px and column at 1 index has 50px)
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {},
          {
            data: 'orderId',
            width: 200,
            renderer: renderOrder
          },
          {
            data: 'applyId',
            renderer: renderApply
          },
          {
            data: 'signDate',
            type: 'text'
          },
          {
            data: 'realName',
            type: 'text'
          },
          {
            data: 'schoolName',
            width: 200,
            type: 'text'
          },
          {
            data: 'country'
          },
          {
            data: 'degree',
            type: 'text'
          },
          {
            data: 'finishYear',
            type: 'text'
          },
          {
            data: 'channels'
          },
          {
            data: 'sourceCreateTime'
          },
          {
            data: 'menteeCreateDate'
          },
          {
            data: 'programName',
            width: 300
          },
          {
            data: 'programWeight'
          },
          {
            data: 'usdAmount',
            type: 'text'
          },
          {
            data: 'usdAccount',
            type: 'text'
          },
          {
            data: 'cnyAmount',
            type: 'text'
          },
          {
            data: 'cnyAccount',
            type: 'text'
          },
          {
            data: 'totalInCny',
            type: 'text'
          },
          {
            data: 'contact1',
            type: 'text'
          },
          {
            data: 'contact2',
            type: 'text'
          },
          {
            data: 'vipRecommenderName',
            type: 'text'
          },
          {
            data: 'kpi',
            type: 'text'
          },
          {
            data: 'commission',
            type: 'text'
          },
          {
            data: 'revenueDate',
            type: 'text'
          },
          {
            data: 'payStatus',
            type: 'text'
          },
          {
            data: 'endDate',
            type: 'text'
          },
          {
            data: 'programName',
            width: 300,
            type: 'text'
          },
          {
            data: 'mentorHour',
            type: 'text'
          },
          {
            data: 'vipHour',
            type: 'text'
          },
          {
            data: 'oralLessonHour',
            type: 'text'
          },
          {
            data: 'internshipCount',
            type: 'text'
          }
        ],
        stretchH: 'all',
        autoWrapRow: true,
        rowHeaders: true,
        colHeaders: [
          '',
          'Order Id',
          'Apply Id',
          'Sign Date',
          'Client Name',
          'School',
          'Country',
          'Degree',
          'Graduation Year',
          'Channels',
          '渠道创建时间',
          '学员录入时间',
          'Program',
          '项目KPI权重',
          'Revenue(USD)',
          'USC Acct',
          'Revenue(CNY)',
          'CNY Acct',
          'Total in CNY',
          '主Contact',
          '副Contact',
          'VIP推荐人',
          'KPI统计',
          'Commission (CNY)',
          'Date Received',
          '是否收齐',
          'Contract End Date',
          'Note',
          '行业导师一对一课时数',
          '全职导师一对一课时数',
          '口语课时数',
          '实习数量'
        ],

        columnSorting: true,
        contextMenu: false,
        sortIndicator: true,

        // contextMenu: [
        //   "row_above",
        //   "row_below",
        //   "---------",
        //   "remove_row",
        //   "---------",
        //   "undo",
        //   "redo",
        //   "---------",
        //   "make_read_only",
        //   "---------",
        //   "alignment"
        // ],
        // dropdownMenu:  ['filter_by_condition', 'filter_by_value','filter_action_bar'],
        dropdownMenu: true,
        filters: true,
        // renderAllRows : true,
        search: true,
        /* cells: function (row, col, prop) {
			   var cellProperties = {};
			   cellProperties.renderer = "negativeValueRenderer";
			   return cellProperties;
                }, */
        afterChange: (change, v) => {
          if (!change) return
          change.forEach(([col, row, old, newData]) => {
            if (!newData) {
              this.settings.data[col][row] = old
            } else {
              this.updatedData.push([col, row, newData])
            }
            console.log(col, row, old, newData)
          })
        }
      },
      month: [],
      orderId: '',
      applyData: {
        applyId: ''
      },
      orderDetailVisible: false,
      applyDetailVisible: false
    }
  },
  methods: {
    // 通过时间去拿当月BD数据

    getBDList (month) {
      this.$loading()
      typeof month === 'string' || (month = this.MyData.select_data)
      axios
        .getBDList({ historyMonth: month })
        .then(response => {
          this.$loading().close()
          const data = response.data.rows
          console.log('bd列表数据：', data)

          // 处理提成比例数据（加%）
          this.settings.data = data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 从BD明细返回到BD列表

    back () {
      this.changeStatus = '1'
      this.settings_revenue.data = []
      this.settings_revenue_in.data = []
      this.MyData.sale_revenue_show = false
    },

    // 导出文件

    exportFile (v) {
      let e, fileName
      if (v) {
        e = v
        fileName = '月报统计(' + this.MyData.select_data + ')_'
      } else {
        e = 'saleKPITable'
        fileName = 'BD订单列表[' + this.MyData.userName + ']_'
        if (!this.orderListVisible) {
          e = 'saleInKPITable'
          fileName = 'BD入账列表[' + this.MyData.userName + ']_'
        }
      }
      // fileName = fileName + this.MyData.userName + "_";
      console.log(fileName, e, this.orderListVisible)
      const handsontable = this.$refs[e].$data.hotInstance

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
    entryOrderDetail (orderId) {
      console.log('orderId', orderId)
      this.orderId = orderId
      this.orderDetailVisible = true
    },
    entryApplyDetail (applyId) {
      console.log('applyId', applyId)
      this.applyData.applyId = applyId
      this.applyDetailVisible = true
    },
    orderDetailClose () {
      console.log('order detail close')
      this.orderDetailVisible = false
    },
    applyDetailClose () {
      console.log('applyDetailClose')
      this.applyDetailVisible = false
    },
    exportJerryFile () {
      console.log(this.MyData.select_data)
      // let params ={
      //   kpiPeriod:this.MyData.select_data
      // }
      // axios.getMonthRevenueForJerry(params).then(res=>{
      //   console.log(res)
      // })
      // downloadALL() {
      const fileName = 'jerry表格_' + this.MyData.select_data
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}kpi/export/excel/monthRevenueForJerry?kpiPeriod=${this.MyData.select_data}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
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
        }
      }
      // 发送请求
      xhr.send()
    // },
    },
    changeStatic () {
      if (this.changeStatus == '1') {
        this.changeStatus = '2'
        if (this.orderListVisible) {
          this.entryInformation()
        } else {
          this.entryDetail()
        }
      } else {
        this.changeStatus = '1'
        if (this.orderListVisible) {
          this.entryInformation()
        } else {
          this.entryDetail()
        }
      }
    },
    entryInformation (val) {
      console.log(val)
      this.entryInformationData = val || this.entryInformationData
      let rowData = {}
      // 请求，参数
      for (let i = 0; i < this.settings.data.length; i++) {
        if (this.entryInformationData == this.settings.data[i].pkId) {
          rowData = JSON.parse(JSON.stringify(this.settings.data[i]))
        }
      }
      this.userId = rowData.userId
      let fromDate, toDate, userId
      fromDate = rowData.fromDate
      toDate = rowData.toDate
      userId = this.changeStatus == '1' ? rowData.userId : 'ALL_Data'
      this.MyData.userName = this.changeStatus == '1' ? rowData.userName : '全数据'
      this.MyData.sale_revenue_show = true
      this.MyData.month = rowData.historyMonth
      this.orderListVisible = true
      this.$loading()
      axios
        .bdRevenue(userId, {
          fromDate: fromDate,
          toDate: toDate
        })
        .then(response => {
          this.$loading().close()
          for (let i = 0; i < response.data.rows.length; i++) {
            console.log(response.data.rows[i].billDeatil)
            if (response.data.rows[i].billDeatil) {
              response.data.rows[i].billDeatil = response.data.rows[i].billDeatil.replace(/,/g, '\n')
            }
          }
          const data = response.data.rows
          console.log('sale列表数据yx**********：', data)

          for (let i = 0; i < data.length; i++) {
            data[i].mentorHour == -1 && (data[i].mentorHour = '不限')
            data[i].vipHour == -1 && (data[i].vipHour = '不限')
          }
          this.settings_revenue.data = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    entryDetail (val) {
      // 请求，参数
      this.entryDetailData = val || this.entryDetailData
      // 请求，参数
      if (this.row_data && this.row_data.fromDate) {
        this.getEntryDetail()
      } else {
        for (let i = 0; i < this.settings.data.length; i++) {
          if (val == this.settings.data[i].pkId) {
            this.row_data = JSON.parse(JSON.stringify(this.settings.data[i]))
            this.getEntryDetail()
          }
        }
      }
    },
    getEntryDetail () {
      console.log(this.entryDetailData, this.row_data)
      let fromDate, toDate, userId
      fromDate = this.row_data.fromDate
      toDate = this.row_data.toDate
      userId = this.changeStatus == '1' ? this.row_data.userId : 'ALL_Data'
      this.MyData.userName = this.changeStatus == '1' ? this.row_data.userName : '全数据'
      // MyData：两个table之间传值
      this.MyData.sale_revenue_show = true
      this.MyData.month = this.row_data.historyMonth
      this.orderListVisible = false
      this.$loading()
      axios
        .bdRevenue2(userId, {
          fromDate: fromDate,
          toDate: toDate
        })
        .then(response => {
          this.$loading().close()
          console.log('sale列表数据：', response.data)
          const data = response.data.rows
          for (let i = 0; i < data.length; i++) {
            data[i].mentorHour == -1 && (data[i].mentorHour = '不限')
            data[i].vipHour == -1 && (data[i].vipHour = '不限')
          }
          this.settings_revenue_in.data = data
        })
        .catch(err => {
          console.log(err)
        })
    }

  },

  created () {
    // 拿可查询BD数据的月份列表
    axios
      .salesHistoryMonth()
      .then(response => {
        console.log('BDkpi已统计月份数据：', response.data)
        this.month = response.data
        this.month.unshift('CURRENT_MONTH')
      })
      .catch(err => {
        console.log(err)
      })
  },
  mounted () {
    // 请求某个BD的（当前日期范围下）BD明细
    window.entryInformation = val => this.entryInformation(val)
    window.entryDetail = val => this.entryDetail(val)
    window.entryOrderDetail = v => this.entryOrderDetail(v)
    window.entryApplyDetail = v => this.entryApplyDetail(v)
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
.sale-revenue {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 99;
  background-color: #fff;
}
.revenue-head {
  line-height: 32px;
  font-size: 14px;
  margin-right: 10px;
  margin-left: 10px;
}
.info {
  text-overflow: ellipsis;
}
</style>
