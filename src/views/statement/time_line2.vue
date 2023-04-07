<!--
 * @Author: 库建华
 * @Date: 2019-08-26 11:24:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 16:02:06
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
            v-model="counselorGroup"
            placeholder="请选择"
          >
            <el-option v-for="item in counselorGroupList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
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
        <div class="inb leng">
          <v-chart :options="option" />
        </div>
        <div class="inb leng">
          <v-chart :options="option2" />
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
      counselorGroupList: ['ALL', '一部', '二部'],
      timeList: ['日', '财务月', '自然月', '自然年'],
      counselorGroup: 'ALL',
      time: '日',
      Mydate: [],
      option: {
        title: {
          text: '销售助理'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['加人', '咨询']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '咨询',
            type: 'line',
            tiled: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            // areaStyle: {},
            data: []
          },
          {
            name: '加人',
            type: 'line',
            tiled: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            // areaStyle: { normal: {} },
            data: []
          }
        ]
      },
      option2: {
        title: {
          text: '销售签约'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['项目', '订单', '学员', '金额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          data: []
        },
        yAxis: [
          {
            type: 'value'
          },
          {}
        ],
        series: [
          {
            name: '项目',
            type: 'line',
            tiled: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            // areaStyle: { normal: {} },
            data: []
          },
          {
            name: '订单',
            type: 'line',
            tiled: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            // areaStyle: { normal: {} },
            data: []
          },
          {
            name: '学员',
            type: 'line',
            tiled: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            // areaStyle: { normal: {} },
            data: []
          },
          {
            name: '金额',
            type: 'bar',
            tiled: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: 1,
            // areaStyle: { normal: {} },
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
      if (!this.Mydate[0] || !this.Mydate[1]) {
        this.$message({
          type: 'warning',
          message: '请选择日期'
        })
        return
      }
      const data = {
        period: this.time,
        counselorGroup: this.counselorGroup,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1]
      }
      console.log(data)
      api.getTimeLine(data).then(res => {
        console.log(res)
        const addStatementOverviewName = []
        const addStatementOverviewNum = []
        res.data.addStatementOverview.forEach(v => {
          addStatementOverviewName.push(v.date)
          addStatementOverviewNum.push(v.num)
        })
        this.option.xAxis.data = addStatementOverviewName
        this.option.series[1].data = addStatementOverviewNum

        const counselorStatementOverviewNum = []
        res.data.counselorStatementOverview.forEach(v => {
          counselorStatementOverviewNum.push(v.num)
        })
        this.option.series[0].data = counselorStatementOverviewNum

        const signOrderStatementOverviewName = []
        const signOrderStatementOverviewNum = []
        res.data.signOrderStatementOverview.forEach(v => {
          signOrderStatementOverviewName.push(v.date)
          signOrderStatementOverviewNum.push(v.num)
        })
        this.option2.xAxis.data = signOrderStatementOverviewName
        this.option2.series[1].data = signOrderStatementOverviewNum

        const signSignStatementOverviewNum = []
        res.data.signSignStatementOverview.forEach(v => {
          signSignStatementOverviewNum.push(v.num)
        })
        this.option2.series[0].data = signSignStatementOverviewNum

        const signMenteeStatementOverviewNum = []
        res.data.signMenteeStatementOverview.forEach(v => {
          signMenteeStatementOverviewNum.push(v.num)
        })
        this.option2.series[2].data = signMenteeStatementOverviewNum

        const signPriceStatementOverviewNum = []
        res.data.signPriceStatementOverview.forEach(v => {
          signPriceStatementOverviewNum.push(v.num)
        })
        this.option2.series[3].data = signPriceStatementOverviewNum
      })
    },
    change () {
      this.Mydate = []
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
  height: 300px;
}
.table-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
