<!--
 * @Author: 杨曦
 * @Date: 2020-11-18 18:08:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 16:11:55
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div >
      <div class="search_page">
        <div class="search">
          <div style="display:inline-block;margin-right:10px" v-if="!showStatus">
            <el-date-picker
              v-model="startDate"
              class="mr10"
              size="mini"
              style="width:130px"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              clearable
              placeholder="选择起始日期"
            ></el-date-picker>
            <el-date-picker
              v-model="endDate"
              class="mr10"
              size="mini"
              style="width:130px"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              clearable
              placeholder="选择终止日期"
            ></el-date-picker>
            <el-date-picker
              type="year"
              v-model="year"
              value-format="yyyy"
              @change="changeYear"
              size="mini"
              class="mr10"
              placeholder="选择年份">
            </el-date-picker>
            <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">查看</el-button>
          </div>
          <div style="display:inline-block;margin-right:10px" v-else>
            <el-date-picker
              v-model="year2"
              type="year"
              @change="changeYear2()"
              size="mini"
              class="mr10"
              placeholder="选择年">
            </el-date-picker>
            <el-button
              v-if="roleInfo.includes(`school_statement_download`)"
              icon="el-icon-printer"
              class="mr10"
              size="mini"
              plain
              @click="exportFile2('table')"
            >导出</el-button>
          </div>
          <el-button class="mr10" size="mini" v-if="showStatus" @click="returnCharts" type="primary">返回图表</el-button>
          <el-button class="mr10" size="mini" v-if="!showStatus && roleInfo.includes(`school_statement_viewTables`)" @click="goTable" type="primary">季度详细表</el-button>
        </div>
      </div>
      <div v-if="!showStatus" class="table-box" id="table-box" :style="style">
        <div class="inb">
            <v-chart :options="polar" />
        </div>
        <div class="inb">
          <v-chart :options="polar1" />
        </div>
        <div class="inb">
          <v-chart :options="polar2" />
        </div>
        <div class="inb">
          <v-chart :options="polar3" />
        </div>
      </div>
      <div v-else>
        <hot-table :settings="settings" ref="table" licenseKey="non-commercial-and-evaluation"></hot-table>
      </div>
    </div>
  </d2-container>
</template>

<script>
import ECharts from 'vue-echarts'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import axios from '@/api/statement.js'
import Handsontable from 'handsontable'
import { renderShortText } from '@/libs/tableRender.js'
import mixins from '@/plugin/mixins'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { export_json_to_excel } from './js/Export2Excel2.js'
import { mapState } from 'vuex'

function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
function compare (property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value2 - value1
  }
}
export default {
  mixins: [mixins],
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      startDate: '',
      endDate: getNowFormatDate(),
      showStatus: false,
      style: {
        height: null
      },
      year: '',
      loading: false,
      year2: 2020,
      polar: {
        title: {
          text: '历史全部人数Top30的高中统计',
          subtext: '该时段人数',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 25
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '学员人数',
            type: 'bar',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar1: {
        title: {
          text: '历史全部人数人数Top30的大学统计',
          subtext: '该时段人数',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '学员人数',
            type: 'bar',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar2: {
        title: {
          text: '新增人数Top10的大学信息',
          subtext: '该时段人数',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '学员人数',
            type: 'bar',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar3: {
        title: {
          text: '咨询人数Top10的大学信息',
          subtext: '该时段人数',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '学员人数',
            type: 'bar',
            barWidth: '40%',
            data: []
          }
        ]
      },
      settings: {
        height: document.documentElement.clientHeight - 130,
        fixedColumnsLeft: 1,
        data: [],
        stretchH: 'all',
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        rowHeaders: true,
        colHeaders: [
          '学校名',
          '国家名',
          '今年第一季新增数',
          '去年第一季新增数',
          '今年第一季咨询数',
          '去年年第一季咨询数',
          '今年第一季签约数',
          '去年第一季签约数',
          '今年第一季转化率%',
          '去年第一季转化率%',
          '今年第二季新增数',
          '去年第二季新增数',
          '今年第二季咨询数',
          '去年第二季咨询数',
          '今年第二季签约数',
          '去年第二季签约数',
          '今年第二季转化率%',
          '去年第二季转化率%',
          '今年第三季新增数',
          '去年第三季新增数',
          '今年第三季咨询数',
          '去年第三季咨询数',
          '今年第三季签约数',
          '去年第三季签约数',
          '今年第三季转化率%',
          '去年第三季转化率%',
          '今年第四季新增数',
          '去年第四季新增数',
          '今年第四季咨询数',
          '去年第四季咨询数',
          '今年第四季签约数',
          '去年第四季签约数',
          '今年第四季转化率%',
          '去年第四季转化率%',
          '今年汇总新增数',
          '去年汇总新增数',
          '今年汇总咨询数',
          '去年汇总咨询数',
          '今年汇总签约数',
          '去年汇总签约数',
          '今年汇总转化率%',
          '去年汇总转化率%'
        ],
        nestedHeaders: [
          [
            '学校名',
            '国家名',
            {
              label: 'Q1',
              colspan: 8
            },
            {
              label: 'Q2',
              colspan: 8
            },
            {
              label: 'Q3',
              colspan: 8
            },
            {
              label: 'Q4',
              colspan: 8
            },
            {
              label: '汇总',
              colspan: 8
            }
          ],
          [
            '学校名',
            '国家名',
            {
              label: '新增学员',
              colspan: 2
            },
            {
              label: '咨询学员',
              colspan: 2
            },
            {
              label: '签约学员',
              colspan: 2
            },
            {
              label: '转化率(%)',
              colspan: 2
            },
            {
              label: '新增学员',
              colspan: 2
            },
            {
              label: '咨询学员',
              colspan: 2
            },
            {
              label: '签约学员',
              colspan: 2
            },
            {
              label: '转化率(%)',
              colspan: 2
            },
            {
              label: '新增学员',
              colspan: 2
            },
            {
              label: '咨询学员',
              colspan: 2
            },
            {
              label: '签约学员',
              colspan: 2
            },
            {
              label: '转化率(%)',
              colspan: 2
            },
            {
              label: '新增学员',
              colspan: 2
            },
            {
              label: '咨询学员',
              colspan: 2
            },
            {
              label: '签约学员',
              colspan: 2
            },
            {
              label: '转化率(%)',
              colspan: 2
            },
            {
              label: '新增学员',
              colspan: 2
            },
            {
              label: '咨询学员',
              colspan: 2
            },
            {
              label: '签约学员',
              colspan: 2
            },
            {
              label: '转化率(%)',
              colspan: 2
            }
          ],
          [
            '学校名',
            '国家名',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年',
            '今年',
            '去年'
          ]
        ],
        readOnly: true,
        columns: [
          {
            data: 'schoolName',
            width: '300'
          },
          {
            data: 'country',
            width: '100'
          },
          {
            data: 'thisYearQ1Add',
            width: '80'
          },
          {
            data: 'lastYearQ1Add',
            width: '80'
          },
          {
            data: 'thisYearQ1Counselor',
            width: '80'
          },
          {
            data: 'lastYearQ1Counselor',
            width: '80'
          },
          {
            data: 'thisYearQ1Sign',
            width: '80'
          },
          {
            data: 'lastYearQ1Sign',
            width: '80'
          },
          {
            data: 'thisYearQ1Consulting',
            width: '80'
          },
          {
            data: 'lastYearQ1Consulting',
            width: '80'
          },

          {
            data: 'thisYearQ2Add',
            width: '80'
          },
          {
            data: 'lastYearQ2Add',
            width: '80'
          },
          {
            data: 'thisYearQ2Counselor',
            width: '80'
          },
          {
            data: 'lastYearQ2Counselor',
            width: '80'
          },
          {
            data: 'thisYearQ2Sign',
            width: '80'
          },
          {
            data: 'lastYearQ2Sign',
            width: '80'
          },
          {
            data: 'thisYearQ2Consulting',
            width: '80'
          },
          {
            data: 'lastYearQ2Consulting',
            width: '80'
          },

          {
            data: 'thisYearQ3Add',
            width: '80'
          },
          {
            data: 'lastYearQ3Add',
            width: '80'
          },
          {
            data: 'thisYearQ3Counselor',
            width: '80'
          },
          {
            data: 'lastYearQ3Counselor',
            width: '80'
          },
          {
            data: 'thisYearQ3Sign',
            width: '80'
          },
          {
            data: 'lastYearQ3Sign',
            width: '80'
          },
          {
            data: 'thisYearQ3Consulting',
            width: '80'
          },
          {
            data: 'lastYearQ3Consulting',
            width: '80'
          },

          {
            data: 'thisYearQ4Add',
            width: '80'
          },
          {
            data: 'lastYearQ4Add',
            width: '80'
          },
          {
            data: 'thisYearQ4Counselor',
            width: '80'
          },
          {
            data: 'lastYearQ4Counselor',
            width: '80'
          },
          {
            data: 'thisYearQ4Sign',
            width: '80'
          },
          {
            data: 'lastYearQ4Sign',
            width: '80'
          },
          {
            data: 'thisYearQ4Consulting',
            width: '80'
          },
          {
            data: 'lastYearQ4Consulting',
            width: '80'
          },

          {
            data: 'thisYearAdd',
            width: '80'
          },
          {
            data: 'lastYearAdd',
            width: '80'
          },
          {
            data: 'thisYearCounselor',
            width: '80'
          },
          {
            data: 'lastYearCounselor',
            width: '80'
          },
          {
            data: 'thisYearSign',
            width: '80'
          },
          {
            data: 'lastYearSign',
            width: '80'
          },
          {
            data: 'thisYearConsulting',
            width: '80'
          },
          {
            data: 'lastYearConsulting',
            width: '80'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          console.log(oldVal, newVal)
        }
      }
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  mounted () {
    this.Topage()
    this.style.height = document.documentElement.clientHeight - 110 + 'px'
  },
  methods: {
    Topage () {
      this.loading = true
      const data = {
        beginDate: this.startDate,
        endDate: this.endDate
      }
      console.log(data)

      this.polar.series[0].data = []
      const xAxis = []
      const polarSeriesData = []

      this.polar1.series[0].data = []
      const xAxis1 = []
      const polarSeriesData1 = []

      this.polar2.series[0].data = []
      const xAxis2 = []
      const polarSeriesData2 = []

      this.polar3.series[0].data = []
      const xAxis3 = []
      const polarSeriesData3 = []
      axios.getSchoolDate(data).then(res => {
        console.log(res.data)
        for (const i in res.data.highSchoolArr) {
          xAxis.push(res.data.highSchoolArr[i].schoolName)
          polarSeriesData.push(res.data.highSchoolArr[i].menteeNum)
        }
        for (const i in res.data.schoolArr) {
          xAxis1.push(res.data.schoolArr[i].schoolName)
          polarSeriesData1.push(res.data.schoolArr[i].menteeNum)
        }
        for (const i in res.data.addSchoolArr) {
          xAxis2.push(res.data.addSchoolArr[i].schoolName)
          polarSeriesData2.push(res.data.addSchoolArr[i].menteeNum)
        }
        for (const i in res.data.counselorSchoolArr) {
          xAxis3.push(res.data.counselorSchoolArr[i].schoolName)
          polarSeriesData3.push(res.data.counselorSchoolArr[i].menteeNum)
        }
        this.$nextTick(() => {
          this.polar.xAxis[0].data = xAxis
          this.polar.series[0].data = polarSeriesData
          this.polar1.xAxis[0].data = xAxis1
          this.polar1.series[0].data = polarSeriesData1
          this.polar2.xAxis[0].data = xAxis2
          this.polar2.series[0].data = polarSeriesData2
          this.polar3.xAxis[0].data = xAxis3
          this.polar3.series[0].data = polarSeriesData3
          this.loading = false
        })
      })
    },
    toTable () {
      this.loading = true
      console.log(this.year2)
      const year = this.year2.getFullYear()
      const data = {
        queryYear: year
      }
      this.settings.nestedHeaders[2] = [
        '学校名',
        '国家名',
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1,
        year,
        year - 1
      ]
      console.log(data, 'yx11111111111111')
      axios.getSchoolDateTabel(data).then(res => {
        let data = []
        data = JSON.parse(JSON.stringify(res.data))
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          data[i].thisYearQ1Consulting = Math.round(data[i].thisYearQ1Sign / data[i].thisYearQ1Counselor * 10000) / 100 || 0
          data[i].thisYearQ2Consulting = Math.round(data[i].thisYearQ2Sign / data[i].thisYearQ2Counselor * 10000) / 100 || 0
          data[i].thisYearQ3Consulting = Math.round(data[i].thisYearQ3Sign / data[i].thisYearQ3Counselor * 10000) / 100 || 0
          data[i].thisYearQ4Consulting = Math.round(data[i].thisYearQ4Sign / data[i].thisYearQ4Counselor * 10000) / 100 || 0
          data[i].lastYearQ1Consulting = Math.round(data[i].lastYearQ1Sign / data[i].lastYearQ1Counselor * 10000) / 100 || 0
          data[i].lastYearQ2Consulting = Math.round(data[i].lastYearQ2Sign / data[i].lastYearQ2Counselor * 10000) / 100 || 0
          data[i].lastYearQ3Consulting = Math.round(data[i].lastYearQ3Sign / data[i].lastYearQ3Counselor * 10000) / 100 || 0
          data[i].lastYearQ4Consulting = Math.round(data[i].lastYearQ4Sign / data[i].lastYearQ4Counselor * 10000) / 100 || 0
          data[i].thisYearConsulting = Math.round(data[i].thisYearSign / data[i].thisYearCounselor * 10000) / 100 || 0
          data[i].lastYearConsulting = Math.round(data[i].lastYearSign / data[i].lastYearCounselor * 10000) / 100 || 0
        }
        data = data.sort(compare('thisYearAdd'))
        this.loading = false
        // console.log(data)
        this.settings.data = data
        // this.$nextTick(() => {
        // })
      })
    },
    changeYear () {
      if (this.year) {

      } else {
        this.year = new Date().getFullYear()
      }
      console.log(this.year)
      this.startDate = `${this.year}-01-01`
      this.endDate = `${this.year}-12-31`
    },
    changeYear2 () {
      if (this.year2) {
        console.log(this.year2)
      } else {
        this.year2 = new Date()
      }
      this.toTable()
    },
    returnCharts () {
      this.showStatus = false
      this.Topage()
    },
    goTable () {
      this.year2 = new Date()
      this.showStatus = true
      this.toTable()
    },
    // 导出文件
    exportFile2 () {
      console.log(XLSX, 111111111111111)
      const year = this.year2.getFullYear()
      // 引入文件
      const multiHeader = [[
        '学校名',
        '国家名',
        'Q1',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Q2',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Q3',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Q4',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '汇总',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]] // 对应表格输出的title
      const tHeader = [['学校名', '国家名', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '']] // 对应表格输出的title
      const tHeader2 = [['学校名', '国家名', year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1]] // 对应表格输出的title
      console.log(multiHeader, tHeader, tHeader2, this.year2.getFullYear(), XLSX)
      const filterVal = [
        'schoolName',
        'country',
        'thisYearQ1Add',
        'lastYearQ1Add',
        'thisYearQ1Counselor',
        'lastYearQ1Counselor',
        'thisYearQ1Sign',
        'lastYearQ1Sign',
        'thisYearQ1Consulting',
        'lastYearQ1Consulting',
        'thisYearQ2Add',
        'lastYearQ2Add',
        'thisYearQ2Counselor',
        'lastYearQ2Counselor',
        'thisYearQ2Sign',
        'lastYearQ2Sign',
        'thisYearQ2Consulting',
        'lastYearQ2Consulting',
        'thisYearQ3Add',
        'lastYearQ3Add',
        'thisYearQ3Counselor',
        'lastYearQ3Counselor',
        'thisYearQ3Sign',
        'lastYearQ3Sign',
        'thisYearQ3Consulting',
        'lastYearQ3Consulting',
        'thisYearQ4Add',
        'lastYearQ4Add',
        'thisYearQ4Counselor',
        'lastYearQ4Counselor',
        'thisYearQ4Sign',
        'lastYearQ4Sign',
        'thisYearQ4Consulting',
        'lastYearQ4Consulting',
        'thisYearAdd',
        'lastYearAdd',
        'thisYearCounselor',
        'lastYearCounselor',
        'thisYearSign',
        'lastYearSign',
        'thisYearConsulting',
        'lastYearConsulting'] // 对应表格tableData输出的数据
      const header = []
      // 进行所有表头的单元格合并，建议一行一行来，不然容易整乱
      const merges = [
        'A1:A2',
        'B1:B2',
        'C1:D1',
        'E1:G1',
        'H1:J1',
        'K1:M1',
        'N1:N2',
        'O1:O2',
        'P1:P2'
      ]
      const list = this.settings.data
      const data = this.formatJson(filterVal, list)
      this.$nextTick(() => {
        export_json_to_excel(multiHeader, tHeader, tHeader2, header, data, `${year}不同学校各季度新增咨询转化签约报表`, merges, XLSX)
      })
      // this.downloadLoading = false // 加载遮罩层结束
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    exportFile (e) {
      // 拿handsontable实例
      const handsontable = this.$refs[e].$data.hotInstance
      const fileName = '各个学校学院报名咨询统计表_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // head: {
        //   A1: { v: "学校" },
        //   B1: { v: "Q1" },
        //   C1: { v: "" },
        //   D1: { v: "" },
        //   E1: { v: "" },
        //   F1: { v: "" },
        //   G1: { v: "" },
        //   H1: { v: "" },
        //   I1: { v: "" },
        //   J1: { v: "Q2" },
        //   K1: { v: "" },
        //   L1: { v: "" },
        //   M1: { v: "" },
        //   N1: { v: "" },
        //   O1: { v: "" },
        //   P1: { v: "" },
        //   Q1: { v: "" },
        //   R1: { v: "Q3" },
        //   S1: { v: "" },
        //   T1: { v: "" },
        //   U1: { v: "" },
        //   V1: { v: "" },
        //   W1: { v: "" },
        //   X1: { v: "" },
        //   Y1: { v: "" },
        //   Z1: { v: "Q4" },
        //   AA1: { v: "" },
        //   AB1: { v: "" },
        //   AC1: { v: "" },
        //   AD1: { v: "" },
        //   AE1: { v: "" },
        //   AF1: { v: "" },
        //   AG1: { v: "" },
        //   AH1: { v: "汇总" },
        //   AI1: { v: "" },
        //   AJ1: { v: "" },
        //   AK1: { v: "" },
        //   AL1: { v: "" },
        //   AM1: { v: "" },
        //   AN1: { v: "" },
        //   AO1: { v: "" },

        //   A2: { v: "学校名" },
        //   B2: { v: "新增学员" },
        //   C2: { v: "" },
        //   D2: { v: "咨询学员" },
        //   E2: { v: "" },
        //   F2: { v: "签约学员" },
        //   G2: { v: "" },
        //   H2: { v: "转化率%" },
        //   I2: { v: "" },
        //   J2: { v: "新增学员" },
        //   K2: { v: "" },
        //   L2: { v: "咨询学员" },
        //   M2: { v: "" },
        //   N2: { v: "签约学员" },
        //   O2: { v: "" },
        //   P2: { v: "转化率%" },
        //   Q2: { v: "" },
        //   R2: { v: "新增学员" },
        //   S2: { v: "" },
        //   T2: { v: "咨询学员" },
        //   U2: { v: "" },
        //   V2: { v: "签约学员" },
        //   W2: { v: "" },
        //   X2: { v: "转化率%" },
        //   Y2: { v: "" },
        //   Z2: { v: "新增学员" },
        //   AA2: { v: "" },
        //   AB2: { v: "咨询学员" },
        //   AC2: { v: "" },
        //   AD2: { v: "签约学员" },
        //   AE2: { v: "" },
        //   AF2: { v: "转化率%" },
        //   AG2: { v: "" },
        //   AH2: { v: "新增学员" },
        //   AI2: { v: "" },
        //   AJ2: { v: "咨询学员" },
        //   AK2: { v: "" },
        //   AL2: { v: "签约学员" },
        //   AM2: { v: "" },
        //   AN2: { v: "转化率%" },
        //   AO2: { v: "" },

        //   A4: { v: "学校名" },
        //   B4: { v: "今年" },
        //   C4: { v: "去年" },
        //   D4: { v: "今年" },
        //   E4: { v: "去年" },
        //   F4: { v: "今年" },
        //   G4: { v: "去年" },
        //   H4: { v: "今年" },
        //   I4: { v: "去年" },
        //   J4: { v: "今年" },
        //   K4: { v: "去年" },
        //   L4: { v: "今年" },
        //   M4: { v: "去年" },
        //   N4: { v: "今年" },
        //   O4: { v: "去年" },
        //   P4: { v: "今年" },
        //   Q4: { v: "去年" },
        //   R4: { v: "今年" },
        //   S4: { v: "去年" },
        //   T4: { v: "今年" },
        //   U4: { v: "去年" },
        //   V4: { v: "今年" },
        //   W4: { v: "去年" },
        //   X4: { v: "今年" },
        //   Y4: { v: "去年" },
        //   Z4: { v: "今年" },
        //   AA4: { v: "去年" },
        //   AB4: { v: "今年" },
        //   AC4: { v: "去年" },
        //   AD4: { v: "今年" },
        //   AE4: { v: "去年" },
        //   AF4: { v: "今年" },
        //   AG4: { v: "去年" },
        //   AH4: { v: "今年" },
        //   AI4: { v: "去年" },
        //   AJ4: { v: "今年" },
        //   AK4: { v: "去年" },
        //   AL4: { v: "今年" },
        //   AM4: { v: "去年" },
        //   AN4: { v: "今年" },
        //   AO4: { v: "去年" },

        //   "!merges": [
        //     { s: { c: 0, r: 0 }, e: { c: 1, r: 0 } },
        //     { s: { c: 2, r: 0 }, e: { c: 9, r: 0 } },
        //     { s: { c: 10, r: 0 }, e: { c: 17, r: 0 } },
        //     { s: { c: 18, r: 0 }, e: { c: 25, r: 0 } },
        //     { s: { c: 26, r: 0 }, e: { c: 33, r: 0 } },

        //     { s: { c: 0, r: 1 }, e: { c: 1, r: 1 } },
        //     { s: { c: 2, r: 1 }, e: { c: 3, r: 1 } },
        //     { s: { c: 4, r: 1 }, e: { c: 5, r: 1 } },
        //     { s: { c: 6, r: 1 }, e: { c: 7, r: 1 } },
        //     { s: { c: 8, r: 1 }, e: { c: 9, r: 1 } },
        //     { s: { c: 10, r: 1 }, e: { c: 11, r: 1 } },
        //     { s: { c: 12, r: 1 }, e: { c: 13, r: 1 } },
        //     { s: { c: 14, r: 1 }, e: { c: 15, r: 1 } },
        //     { s: { c: 16, r: 1 }, e: { c: 17, r: 1 } },
        //     { s: { c: 18, r: 1 }, e: { c: 19, r: 1 } },
        //     { s: { c: 20, r: 1 }, e: { c: 21, r: 1 } },
        //     { s: { c: 22, r: 1 }, e: { c: 23, r: 1 } },
        //     { s: { c: 24, r: 1 }, e: { c: 25, r: 1 } },
        //     { s: { c: 26, r: 1 }, e: { c: 27, r: 1 } },
        //     { s: { c: 28, r: 1 }, e: { c: 29, r: 1 } },
        //     { s: { c: 30, r: 1 }, e: { c: 31, r: 1 } },
        //     { s: { c: 32, r: 1 }, e: { c: 33, r: 1 } },

        //   ]
        // },
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename:
          fileName +
          this.userInfo.userName +
          '_' + '_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inb {
  display: block;
  margin-top: 20px;
}
.leng {
  width: 100%;
}
.echarts {
  width: 100%;
  height: 600px;
}
// .table-box {
//   width: 100%;
//   height: 100%;
//   overflow: auto;
// }
</style>
