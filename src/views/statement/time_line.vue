<!--
 * @Author: 库建华
 * @Date: 2019-08-26 11:24:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 16:04:17
 * @Version:
 * @Description:
 -->
<template>
  <d2-container >
    <div>
      <div class="search_page">
        <div class="search">
          <el-select
            class="mr10"
            style="width:100px"
            size="mini"
            v-model="time"
            placeholder="请选择"
            @change="change"
          >
            <el-option v-for="item in timeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-date-picker
            v-show="time == '自然年'"
            class="mr10"
            size="mini"
            v-model="Mydate[0]"
            :clearable="false"
            value-format="yyyy"
            type="year"
            placeholder="开始年"
          ></el-date-picker>
          <el-date-picker
            v-show="time == '自然年'"
            class="mr10"
            size="mini"
            v-model="Mydate[1]"
            :clearable="false"
            value-format="yyyy"
            type="year"
            placeholder="结束年"
          ></el-date-picker>
          <el-date-picker
            v-show="time == '财务月' || time == '自然月'"
            class="mr10"
            size="mini"
            v-model="Mydate"
            type="monthrange"
            :clearable="false"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-date-picker
            v-show="time == '日'"
            class="mr10"
            size="mini"
            v-model="Mydate"
            type="daterange"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage()">查看</el-button>
        </div>
      </div>
      <div class="table-box" id="table-box">
        <div style="text-align:left">
          <el-button type="primary" size="mini" @click="change1()" >销售助理报表切换</el-button>
        </div>
        <div class="inb leng" v-loading="loading">
          <v-chart :options="option" v-if="status1" />
          <v-chart :options="option3"  v-else/>
        </div>
        <div style="text-align:left">
          <el-button type="primary" size="mini" @click="change2()" >销售报表切换</el-button>
        </div>
        <div class="inb leng" v-loading="loading2">
          <v-chart :options="option2" v-if="status2" />
          <v-chart :options="option4"  v-else/>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import ECharts from 'vue-echarts'
// 手动引入 ECharts 各模块来减小打包体积
// import "echarts/lib/chart/bar";
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import api from '@/api/statement.js'
export default {
  components: {
    'v-chart': ECharts
  },
  data () {
    const date = new Date()

    const myEndDate = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).substr(-2, 2) + '-' + ('0' + date.getDate()).substr(-2, 2)
    // date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return {
      loading: false,
      loading2: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      status1: true,
      status2: true,
      counselorGroupList: ['ALL', '一部', '二部'],
      timeList: ['日', '财务月', '自然月', '自然年'],
      counselorGroup: 'ALL',
      time: '日',
      Mydate: [],
      option: {
        title: {
          text: '销售助理新增学员数'
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
        color: ['#FF5D00', '#B9C800', '#00D2AB', '#FF8893', '#FFD5B1', '#57D4EB', '#6236FF', '#6EACFF', '#E68DFF', '#DC5066', '#107A87', '#D60000', '#B59052', '#914044', '#BBD4DD', '#725037', '#F4D79D', '#143EFB', '#FEF200', '#BAE2BC'],
        legend: {
          x: 'left' | 200,
          data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '未录入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },

        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }

        ],
        yAxis: [
          {}
        ],
        series: [
          {
            name: '2012',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2013',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2014',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2015',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2016',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2017',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2018',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2019',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2020',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2021',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2022',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2023',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2024',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2025',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2026',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2027',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2028',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '未录入',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          }
        ]
      },
      option3: {
        title: {
          text: '销售助理咨询学员数'
        },
        color: ['#FF5D00', '#B9C800', '#00D2AB', '#FF8893', '#FFD5B1', '#57D4EB', '#6236FF', '#6EACFF', '#E68DFF', '#DC5066', '#107A87', '#D60000', '#B59052', '#914044', '#BBD4DD', '#725037', '#F4D79D', '#143EFB', '#FEF200', '#BAE2BC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          x: 'left' | 200,
          data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '未录入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },

        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }

        ],
        yAxis: [
          {}
        ],
        series: [
          {
            name: '2012',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2013',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2014',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2015',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2016',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2017',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2018',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2019',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2020',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2021',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2022',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2023',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2024',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2025',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2026',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2027',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2028',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '未录入',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          }
        ]
      },
      option2: {
        title: {
          text: '销售签约金额'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        color: ['#FF5D00', '#B9C800', '#00D2AB', '#FF8893', '#FFD5B1', '#57D4EB', '#6236FF', '#6EACFF', '#E68DFF', '#DC5066', '#107A87', '#D60000', '#B59052', '#914044', '#BBD4DD', '#725037', '#F4D79D', '#143EFB', '#FEF200', '#BAE2BC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          x: 'left' | 200,
          data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '未录入', '订单', '项目']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }

        ],
        yAxis: [
          {
            type: 'value',
            name: '销售签约金额'

          },
          {
            type: 'value',
            name: '签约项目订单数量'

          }
        ],
        series: [
          {
            name: '2012',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2013',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2014',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2015',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2016',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2017',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2018',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2019',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2020',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2021',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2022',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2023',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2024',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2025',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2026',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2027',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2028',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '未录入',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '订单',
            type: 'line',
            yAxisIndex: 1,
            data: []
          },
          {
            name: '项目',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      option4: {
        title: {
          text: '销售签约人数'
        },
        color: ['#FF5D00', '#B9C800', '#00D2AB', '#FF8893', '#FFD5B1', '#57D4EB', '#6236FF', '#6EACFF', '#E68DFF', '#DC5066', '#107A87', '#D60000', '#B59052', '#914044', '#BBD4DD', '#725037', '#F4D79D', '#143EFB', '#FEF200', '#BAE2BC'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
        legend: {
          x: 'left' | 200,
          data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '未录入', '订单', '项目']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }

        ],
        yAxis: [
          {
            type: 'value',
            name: '销售签约人数'

          },
          {
            type: 'value',
            name: '签约项目订单数量'

          }
        ],
        series: [
          {
            name: '2012',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2013',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2014',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2015',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2016',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2017',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2018',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2019',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2020',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2021',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2022',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2023',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2024',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2025',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2026',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2027',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '2028',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '未录入',
            type: 'bar',
            stack: '广告',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '订单',
            type: 'line',
            yAxisIndex: 1,
            data: []
          },
          {
            name: '项目',
            yAxisIndex: 1,
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    // this.Topage();
  },
  methods: {
    Topage () {
      for (let n = 0; n < this.option.series.length; n++) {
        this.option.series[n].data = []
      }
      for (let n = 0; n < this.option2.series.length; n++) {
        this.option2.series[n].data = []
      }
      for (let n = 0; n < this.option3.series.length; n++) {
        this.option3.series[n].data = []
      }
      for (let n = 0; n < this.option4.series.length; n++) {
        this.option4.series[n].data = []
      }
      if (!this.Mydate[0] || !this.Mydate[1]) {
        this.$message({
          type: 'warning',
          message: '请选择日期'
        })
        return
      }
      const data = {
        period: this.time,
        // counselorGroup: this.counselorGroup,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1]
      }
      console.log(data)
      api.getTimeLine(data).then(res => {
        console.log(res)
        /// //////////////////////////////////////
        const addStatementOverviewName = []
        const addStatementOverviewNum = []
        const addStatementOverview = res.data.addStatementOverview
        res.data.addStatementOverview.forEach(v => {
          // addStatementOverviewName.push(`${v.date} 总人数（${v.num}）`);
          addStatementOverviewName.push(`${v.date}`)
          addStatementOverviewNum.push(v.num)
        })
        for (let i = 0; i < addStatementOverview.length; i++) {
          for (let m = 0; m < addStatementOverview[i].finishYearList.length; m++) {
            for (let n = 0; n < this.option.series.length; n++) {
              if (this.option.series[n].name == `${addStatementOverview[i].finishYearList[m].finishYear}`) {
                this.option.series[n].data.push(addStatementOverview[i].finishYearList[m].num)
              }
            }
          }
        }
        console.log(this.option.series, 2222222222222)
        this.option.xAxis[0].data = addStatementOverviewName
        /// ///////////////////////////////////////////////////////
        const addStatementOverviewName2 = []
        const addStatementOverviewNum2 = []
        const counselorStatementOverview = res.data.counselorStatementOverview
        res.data.counselorStatementOverview.forEach(v => {
          // addStatementOverviewName2.push(`${v.date} 总人数（${v.num}）`);
          addStatementOverviewName2.push(`${v.date}`)
          addStatementOverviewNum2.push(v.num)
        })
        for (let i = 0; i < counselorStatementOverview.length; i++) {
          for (let m = 0; m < counselorStatementOverview[i].finishYearList.length; m++) {
            for (let n = 0; n < this.option3.series.length; n++) {
              if (this.option3.series[n].name == `${counselorStatementOverview[i].finishYearList[m].finishYear}`) {
                this.option3.series[n].data.push(counselorStatementOverview[i].finishYearList[m].num)
              }
            }
          }
        }
        console.log(this.option3.series, 2222222222222)
        this.option3.xAxis[0].data = addStatementOverviewName2

        /// ////////////////////////////////////
        const addStatementOverviewName3 = []
        const addStatementOverviewNum3 = []
        const signPriceStatementOverview = res.data.signPriceStatementOverview
        res.data.signPriceStatementOverview.forEach(v => {
          addStatementOverviewName3.push(`${v.date} 总金额（${v.num}）`)
          addStatementOverviewNum3.push(v.num)
        })
        for (let i = 0; i < signPriceStatementOverview.length; i++) {
          for (let m = 0; m < signPriceStatementOverview[i].finishYearList.length; m++) {
            for (let n = 0; n < this.option2.series.length; n++) {
              if (this.option2.series[n].name == `${signPriceStatementOverview[i].finishYearList[m].finishYear}`) {
                this.option2.series[n].data.push(signPriceStatementOverview[i].finishYearList[m].num)
              }
            }
          }
        }
        /// //////////////////////////////////////////
        const addStatementOverviewName4 = []
        const addStatementOverviewNum4 = []
        const signMenteeStatementOverview = res.data.signMenteeStatementOverview
        res.data.signMenteeStatementOverview.forEach(v => {
          addStatementOverviewName4.push(`${v.date} 订单数（${v.num}）`)
          addStatementOverviewNum4.push(v.num)
        })
        for (let i = 0; i < signMenteeStatementOverview.length; i++) {
          for (let m = 0; m < signMenteeStatementOverview[i].finishYearList.length; m++) {
            for (let n = 0; n < this.option4.series.length; n++) {
              if (this.option4.series[n].name == `${signMenteeStatementOverview[i].finishYearList[m].finishYear}`) {
                this.option4.series[n].data.push(signMenteeStatementOverview[i].finishYearList[m].num)
              }
            }
          }
        }
        /// ////////////////////////////
        const signOrderStatementOverviewName = []
        const signOrderStatementOverviewName1 = []
        const signOrderStatementOverviewNum = []
        const signMenteeStatementOverviewNum = []
        res.data.signOrderStatementOverview.forEach(v => {
          signOrderStatementOverviewName.push(`${v.date} 总订单数（${v.num}）`)
          signOrderStatementOverviewName1.push(`${v.date} 总订单数（${v.num}）`)
          signOrderStatementOverviewNum.push(v.num)
        })
        for (let i = 0; i < signOrderStatementOverviewName.length; i++) {
          signOrderStatementOverviewName[i] =
`
${res.data.signOrderStatementOverview[i].date} 
`
// 总金额（${res.data.signPriceStatementOverview[i].num}）
// 总订单数（${res.data.signOrderStatementOverview[i].num}）
// 总项目数（${res.data.signSignStatementOverview[i].num}）
          signOrderStatementOverviewName1[i] =
`
${res.data.signOrderStatementOverview[i].date} 
`
// 总人数（${res.data.signMenteeStatementOverview[i].num}）
// 总订单数（${res.data.signOrderStatementOverview[i].num}）
// 总项目数（${res.data.signSignStatementOverview[i].num}）
        }
        res.data.signSignStatementOverview.forEach(v => {
          signMenteeStatementOverviewNum.push(v.num)
        })
        console.log(signOrderStatementOverviewNum, signMenteeStatementOverviewNum)
        this.option2.xAxis[0].data = signOrderStatementOverviewName
        this.option4.xAxis[0].data = signOrderStatementOverviewName1
        this.option2.series[18].data = signOrderStatementOverviewNum
        this.option4.series[18].data = signOrderStatementOverviewNum
        this.option2.series[19].data = signMenteeStatementOverviewNum
        this.option4.series[19].data = signMenteeStatementOverviewNum
      })
    },
    change1 () {
      this.loading = true
      this.status1 = !this.status1
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    change2 () {
      this.loading2 = true
      this.status2 = !this.status2
      setTimeout(() => {
        this.loading2 = false
      }, 500)
    },
    change () {
      this.Mydate = []
    },
    onClick (params) {
      console.log(params.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.inb {
  display: inline-block;
  width: 600px;
}
.leng {
  width: 100%;
}
.echarts {
  width: 100%;
  height: 600px;
}
.table-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
