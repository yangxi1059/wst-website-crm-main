<!--
 * @Author: kaan
 * @Date: 2021-10-27 15:36:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-22 15:46:10
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="analysis_container">
      <el-tabs type="border-card" @tab-click="handleClick" v-model="tabsValue">
        <el-tab-pane label="销售" name="0">
          <el-date-picker
            v-model="daterange0"
            class="mb10 mr10"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="init1()"
          >GO</el-button>
          <el-table
            :data="tableData0"
            size="mini"
            style="width: 100%"
            @row-dblclick="showDetail"
          >
            <el-table-column fixed prop="userName" label="姓名" width="150"></el-table-column>
            <el-table-column sortable prop="deptLevel" label="部门级别" width=""></el-table-column>
            <el-table-column sortable prop="menteeCount" label="分配学员" width=""></el-table-column>
            <el-table-column sortable prop="signCount" label="签约人数" width=""></el-table-column>
            <el-table-column sortable prop="signRateNew" label="签约转化率(%)" width=""></el-table-column>
            <el-table-column  label="一部">
              <el-table-column sortable prop="groupMenteeCount1" label="分配学员" width=""></el-table-column>
              <el-table-column sortable prop="groupSignCount1" label="签约人数" width=""></el-table-column>
              <el-table-column sortable prop="groupSignRate1New" label="转化率(%)" width=""></el-table-column>
              <el-table-column sortable prop="groupRevenueRate1New" label="入账比例(%)" width=""></el-table-column>
            </el-table-column>
            <el-table-column  label="二部">
              <el-table-column sortable prop="groupMenteeCount2" label="分配学员" width=""></el-table-column>
              <el-table-column sortable prop="groupSignCount2" label="签约人数" width=""></el-table-column>
              <el-table-column sortable prop="groupSignRate2New" label="转化率(%)" width=""></el-table-column>
              <el-table-column sortable prop="groupRevenueRate2New" label="入账比例(%)" width=""></el-table-column>
            </el-table-column>
            <el-table-column sortable prop="kpi" label="签约KPI" width=""></el-table-column>
            <el-table-column sortable prop="totalOrderPrice" label="签约订单金额(折算CNY)" width=""></el-table-column>
            <el-table-column sortable prop="orderRevenue" label="入账金额(折算CNY)" width=""></el-table-column>
            <el-table-column sortable prop="avgOrderPrice" label="签约客单价(折算CNY)" width=""></el-table-column>
            <el-table-column sortable prop="avgTransDay" label="签约平均转换天数" width=""></el-table-column>
            <el-table-column sortable prop="totalScore" label="综合竞争力评分" width=""></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="学校" name="1">
          <el-select
            class="mb10 mr10"
            :style="{width:'200px'}"
            filterable
            allow-create
            size="mini"
            v-model="schoolId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.chiName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="daterange1"
            class="mb10 mr10"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="init2()"
          >GO</el-button>
          <el-table
            :data="tableData1"
            size="mini"
            style="width: 100%"
            @row-dblclick="showDetail"
          >
            <el-table-column prop="userName" label="姓名" width="150"></el-table-column>
            <el-table-column prop="deptLevel" label="部门级别" width="" sortable></el-table-column>
            <el-table-column prop="menteeCount" label="分配学员" width="" sortable></el-table-column>
            <el-table-column prop="signCount" label="签约人数" width="" sortable></el-table-column>
            <el-table-column prop="kpi" label="签约KPI" width="" sortable></el-table-column>
            <el-table-column prop="signMentee" label="签约率(%)" width="" sortable></el-table-column>
            <el-table-column prop="totalOrderPrice" label="签约订单金额(折算CNY)" width="" sortable></el-table-column>
            <el-table-column prop="orderRevenue" label="入账金额(折算CNY)" width="" sortable></el-table-column>
            <el-table-column prop="avgOrderPrice" label="签约客单价(折算CNY)" width="" sortable></el-table-column>
            <el-table-column prop="totalScore" label="综合竞争力评分" width="" sortable></el-table-column>
          </el-table>
          <el-row >
            <el-col :span="12" >
              <v-chart style="width:100%" :options="optionSex" v-if="tabsValue=='1'"/>
            </el-col>
            <el-col :span="12" >
              <v-chart style="width:100%" :options="optionYear" v-if="tabsValue=='1' && showOptionYear"/>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="申请季" name="third"></el-tab-pane>
        <el-tab-pane label="学员画像" name="fourth"></el-tab-pane>
        <el-tab-pane label="销售趋势图" name="frith">
          <el-select v-model="userId" class="mr10" @change="init3()" placeholder="用户名" size="mini">
            <el-option-group
              v-for="group in optionsSelect"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
              </el-option>
            </el-option-group>
          </el-select>
          <el-button
            class="mr10"
            size="mini"
            type="primary"
            @click="changeInit()"
          >切换</el-button>
          <el-row class="mt20" v-if="tableStatus">
            <el-col :span="24" >
              <v-chart style="width:100%" :options="polar" />
            </el-col>
          </el-row>
          <div v-else>
            <el-table
            :data="tableData3"
            size="mini"
            style="width: 100%"
            >
              <el-table-column prop="kpiPeriod" label="KPI周期" ></el-table-column>
              <el-table-column prop="kpi" label="KPI" ></el-table-column>
              <el-table-column prop="orderMentee" label="签约人数" ></el-table-column>
              <el-table-column prop="orderPrice" label="订单价格" ></el-table-column>
              <el-table-column prop="astotalInCny" label="入账金额" ></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目" name="sixth">
          <el-date-picker
            v-model="daterange2"
            class="mb10 mr10"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-select
            class="mb10 mr10"
            :style="{width:'200px'}"
            filterable
            allow-create
            size="mini"
            v-model="programType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in program_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="init4()"
          >GO</el-button>
          <div >
          <el-row >
            <el-col :span="24" >
              <v-chart v-show="!show2"  style="width:100%" :options="optionCircle" />
            </el-col>
            <el-col :span="24" >
              <div id="echarts_graph" style="height:800px"></div>
              <!-- <v-chart  style="width:100%" :options="optionCross1" /> -->
            </el-col>
          </el-row>
            <!-- <div class="mt20"  v-loading="loading2">

            </div>
            <div class="mt20"  v-loading="loading1">

            </div> -->
          </div>
        </el-tab-pane>
      </el-tabs>

      <AnalysisDetail
        v-if="detailVisible"
        :detailVisible="detailVisible"
        :tabsValue = "tabsValue"
        :detailData = "detailData"
        :daterange = "daterange"
        :schoolId = "schoolId"
        @close="closeDetail"
      />
    </div>
  </d2-container>
</template>

<script>

import api from '@/api/sales_assistant'
import api2 from '@/api/statement.js'

import apiDic from '@/api/dictionary.js'
import AnalysisDetail from './components/AnalysisDetail'
import ECharts from 'vue-echarts'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/radar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import mixins from '@/plugin/mixins'

export default {
  name: 'SalesAnalysis',
  components: { AnalysisDetail, 'v-chart': ECharts },
  mixins: [mixins],
  data: () => {
    return {
      loading1: false,
      show2: false,
      show1: false,
      loading2: false,
      tabsValue: '0',
      schools: [],
      month: '',
      tableData3: [],
      tableStatus: true,
      userId: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      program_type: [],
      programType: '',
      daterange: '',
      daterange0: null,
      daterange2: null,
      tableData0: [],
      schoolId: '',
      daterange1: null,
      tableData1: [],
      optionSex: {
        tooltip: {
          trigger: 'item'
        },
        color: ['#73c0de', '#91cc75', '#fac858', '#ee6666', '#5470c6', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      showOptionYear: false,
      optionYear: {
        color: ['#73c0de', '#91cc75', '#fac858', '#ee6666', '#5470c6', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['签约人数', '分配人数']
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '签约人数',
            data: [],
            label: {
              show: true,
              position: 'top',
              color: '#666'
            },
            barMaxWidth: '100',
            type: 'bar'
          }
        ]
      },
      polar: {
        title: {
          text: '销售趋势图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {},
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              rotate: 40
            }
          },
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: 'kpi/签约人数',
            min: 0
          },
          {
            type: 'value',
            scale: true,
            name: '订单总金额/入账',
            min: 0
          }
        ],
        series: [
          {
            name: '入账金额',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          },
          {
            name: '订单金额',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          },
          {
            name: '签约人数',
            type: 'line',
            data: []
          },
          {
            name: 'KPI',
            type: 'line',
            data: []
          }
        ]
      },
      optionCircle: {
        title: {
          text: '签约项目金额占比',
          subtext: '根据周期内签约项目金额进行统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            label: {
              show: true,
              position: 'inner',
              formatter: '{d}%'
			      },
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      optionCross1: {
        title: {
          text: '项目Offer数量及占比'
          // subtext: '年薪大于等于70W为优质Offer',
          // left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#999'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {},
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              rotate: 40
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'offer 数量',
            min: 0
          },
          {
            type: 'value',
            name: 'offer 占比',
            min: 0
          }
        ],
        series: [
          {
            name: 'offer 数量',
            type: 'bar',
            data: []
          },
          {
            name: '年薪70W以上Offer数量',
            type: 'bar',
            data: []
          },
          {
            name: 'Offer占比（%）',
            type: 'line',
            data: []
          },
          {
            name: '年薪70W以上Offer占比（%）',
            type: 'line',
            data: []
          }
        ]
      },
      detailVisible: false,
      optionsSelect: [{
        label: '在职',
        options: []
      }, {
        label: '离职',
        options: []
      }]
    }
  },
  mounted () {
    this.userId = this.$store.state.role.userInfo.userId
    const params = {
      pageNum: 1,
      pageSize: 9999
    }
    apiDic.getSchoolDicList(params).then(res => {
      this.schools = res.data.rows
    })
    this.pageInit()
    api.getSalesListOnWork().then(res => {
      res.data.forEach(item => {
        if (item.entryStatus == '1') {
          this.optionsSelect[0].options.push(item)
        } else {
          this.optionsSelect[1].options.push(item)
        }
      })
      console.log(res)
    })
  },
  methods: {
    async pageInit () {
      this.program_type = await this.getDictionary('program_type')
    },
    init1 () {
      if (this.tabsValue !== '0') { return }
      if (this.daterange0 == null) {
        this.$message({
          type: 'warning',
          message: '搜索项均为必选项'
        })
        return
      }
      this.$loading()
      api.getSalesOverview(this.daterange0[0], this.daterange0[1]).then(res => {
        this.$loading().close()
        res.data.salesList.forEach(item => {
          item.signRateNew = parseFloat(item.signRate) || 0
          item.groupSignRate2New = parseFloat(item.groupSignRate2) || 0
          item.groupSignRate1New = parseFloat(item.groupSignRate1) || 0
          item.groupRevenueRate1New = parseFloat(item.groupRevenueRate1) || 0
          item.groupRevenueRate2New = parseFloat(item.groupRevenueRate2) || 0
        })
        this.tableData0 = res.data.salesList
        console.log('获取销售数据列表', this.tableData0)
      })
    },
    init2 () {
      if (this.tabsValue !== '1') { return }
      if (this.schoolId == '' || this.daterange1 == null) {
        this.$message({
          type: 'warning',
          message: '搜索项均为必选项'
        })
        return
      }
      this.$loading()
      this.showOptionYear = false
      api.getSchoolOverview(this.daterange1[0], this.daterange1[1], this.schoolId).then(res => {
        console.log('获取学校数据列表', res)
        // this.total = res.data.total;
        this.$loading().close()
        res.data.sex.forEach(u => {
          this.optionSex.series[0].data.push({ value: u.signCount, name: u.sex })
        })
        res.data.salesList.forEach(item => {
          item.signMentee = (item.signCount / item.menteeCount * 100) || 0
        })
        this.tableData1 = res.data.salesList
        this.showOptionYear = true
        res.data.finishYear.forEach(u => {
          this.optionYear.xAxis.data.push(u.finishYear)
          this.optionYear.series[0].data.push(u.signCount)
        })
      })
    },
    showDetail (row, rowIndex) {
      console.log(row)
      this.detailData = row
      this.detailVisible = true
      this.daterange = this[`daterange${this.tabsValue}`]
    },
    closeDetail () {
      this.detailVisible = false
    },
    init3 () {
      console.log(this.month)
      api.getSalesOverview2(this.userId).then(res => {
        this.tableData3 = res.data
        console.log(res)
        const arr1 = []
        const arr2 = []
        const arr3 = []
        const arr4 = []
        const arr5 = []
        console.log(arr1)
        res.data.forEach(item => {
          arr1.push(item.kpiPeriod)
          arr2.push(item.kpi)
          arr3.push(item.orderMentee)
          arr4.push(item.orderPrice)
          arr5.push(item.astotalInCny)
        })
        this.polar.xAxis[0].data = arr1
        this.polar.xAxis[1].data = arr1
        this.polar.series[0].data = arr5
        this.polar.series[1].data = arr4
        this.polar.series[2].data = arr3
        this.polar.series[3].data = arr2
      })
    },
    handleClick (tab) {
      console.log(tab.name)
      if (tab.name == 'frith') {
        this.init3()
      } else if (tab.name == 'sixth') {
      }
    },
    init4 () {
      this.loading1 = true
      this.loading2 = true
      if (this.daterange2 == null || !this.programType) {
        this.$message({
          type: 'warning',
          message: '时间范围 项目类型项均为必选项'
        })
        return
      }
      api.getSalesCharts(this.daterange2[0], this.daterange2[1], this.programType).then(res => {
        console.log(res.data)
        const myChart = this.$echarts.init(document.getElementById('echarts_graph'))
        if (res.data.offer && res.data.offer.length > 0) {
          this.loading1 = false
          this.show1 = false
          const optionCross1xAxis = []
          const optionCross1series0 = []
          const optionCross1series1 = []
          const optionCross1series2 = []
          const optionCross1series3 = []
          res.data.offer.forEach(item => {
            optionCross1xAxis.push(item.programName)
            optionCross1series0.push(item.offerCount)
            optionCross1series1.push(item.goodOfferCount)
            optionCross1series2.push(item.offerRate)
            optionCross1series3.push(item.goodOfferRate)
          })
          this.optionCross1.xAxis[0].data = optionCross1xAxis
          this.optionCross1.series[0].data = optionCross1series0
          this.optionCross1.series[1].data = optionCross1series1
          this.optionCross1.series[2].data = optionCross1series2
          this.optionCross1.series[3].data = optionCross1series3
          console.log(this.optionCross1)
          // 绘制图表
          myChart.clear()// 清空
          myChart.setOption(this.optionCross1)
        } else {
          myChart.clear()// 清空
          this.loading1 = false
          this.$message({ type: 'danger', message: 'offer数量暂无数据~~' })
          this.show1 = true
        }
        if (res.data.price && res.data.price.length > 0) {
          this.loading2 = false
          this.show2 = false
          const optionCircleseries = []
          res.data.price.forEach(item => {
            optionCircleseries.push({
              value: item.programAmount,
              name: item.programName
            })
          })
          this.optionCircle.series[0].data = optionCircleseries
        } else {
          this.loading2 = false
          this.$message({ type: 'warning', message: '签约项目金额暂无数据~~' })
          this.show2 = true
        }
      })
    },
    changeInit () {
      this.tableStatus = !this.tableStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.w99{
  width:99%
}
.analysis_container{
  padding-bottom:15px;
}
.chart_container{
  height:500px;
}
.inb {
  display: block;
  margin-top: 20px;
}
.leng {
  width: 100%;
}
.echartsdiv{
  min-width: 1140px !important;
}
.echarts {
  margin: 0 auto;
  width: 1200px !important;
  height: 700px !important;
}
.echarts .canvas{
  width: 100%;
}
.table-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
