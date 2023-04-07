<template>
  <d2-container >
    <div>
      <div class="search_page">
        <div class="search">
          <el-select class="mr10" style="width:100px" size="mini" v-model="time" placeholder="请选择">
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
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">查看</el-button>
          <!-- <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">去年同期对比</el-button> -->
        </div>
      </div>
      <div class="table-box" id="table-box" :style="style">
        <div class="inb">
          <v-chart :options="polar" />
        </div>
        <!-- 销售签约人数；金额、单数 -->
        <div class="inb relative">
          <v-chart :options="polar3" id="polar3"/>
          <el-button v-show="showBack" size="mini" class="back_btn" @click="back">back</el-button>
        </div>
        <div class="inb leng">
          <v-chart :options="polar4" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar5" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar15" />
        </div>
        <div class="inb">
          <v-chart :options="polar7" />
        </div>
        <div class="inb">
          <v-chart :options="polar18" />
        </div>
        <div class="inb">
          <v-chart :options="polar9" />
        </div>
        <div class="inb">
          <v-chart :options="polar12" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar24" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar17" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar19" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar20" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar21" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar22" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar23" />
        </div>
        <div style="width: 95%;margin-bottom: 20px;float:left;">
          <p style="font-size:18px;height:30px;font-weight:600">学历&年级转化率</p>
          <el-table
            :data="tableData"
            style="margin-left:2%"
            border
          >
            <el-table-column prop="finishYear" label="毕业年份" min-width="280" show-overflow-tooltip></el-table-column>
            <el-table-column label="本科">
              <el-table-column prop="undergradTotalSign" label="总签约人数"  ></el-table-column>
              <el-table-column prop="undergradTotalCounselor" label="总咨询人数" ></el-table-column>
              <el-table-column prop="undergradConversionRate" label="转化率" ></el-table-column>
            </el-table-column>
            <el-table-column label="研究生">
              <el-table-column prop="masterTotalSign" label="总签约人数"  ></el-table-column>
              <el-table-column prop="masterTotalCounselor" label="总咨询人数" ></el-table-column>
              <el-table-column prop="masterConversionRate" label="转化率" ></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import ECharts from 'vue-echarts'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import axios from '@/api/statement.js'
import { mapState } from 'vuex'
export default {
  components: {
    'v-chart': ECharts
  },
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    const date = new Date()
    const myEndDate =
      date.getFullYear() +
      '-' +
      ('0' + (1 + date.getMonth())).substr(-2, 2) +
      '-' +
      ('0' + date.getDate()).substr(-2, 2)
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
      showBack: false,
      timeList: ['日', '自然月', '财务月', '自然年'],
      users: [],
      time: '自然月',
      Mydate: [],
      search: '',
      addCount: 110,
      newCounselorCount: 10,
      beforeCounselorCount: 110,
      style: { height: 'auto' },
      tableData: [],
      polar: {
        title: {
          text: '销售报表',
          subtext: '该时段人数比',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{d}%'
        },
        series: [
          {
            name: '咨询人数',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            label: {
              formatter: '{b}:\n{c}({d}%)'
            },
            data: [
              { value: 0, name: '签约人数（新增）' },
              { value: 0, name: '签约人数（往期）' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        animationDuration: 1000
      },
      //
      //   签约渠道
      polar3: {
        title: {
          text: '签约渠道',
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      //   签约国家
      polar4: {
        title: {
          text: '签约国家',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      //   咨询学校
      polar5: {
        title: {
          text: '签约学校',
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      //   实习信息
      polar15: {
        title: {
          text: '实习信息',
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar7: {
        title: {
          text: '签约学历',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar18: {
        title: {
          text: '毕业年份',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar8: {
        title: {
          text: '签约年级',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar9: {
        title: {
          text: '签约性别',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar12: {
        title: {
          text: '	签约项目金额比例',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar24: {
        title: {
          text: '	签约学生来源转化率(%)',
          subtext: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (p) {
            const s =
              p[0].data.value * 1 +
              '%' +
              '<br/> 签约数量： ' +
              p[0].data.datas[0] +
              '<br/>咨询数量： ' +
              p[0].data.datas[1]
            return s
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
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '比例'
          },
          {
            type: 'value',
            name: '数量'
          }
        ],
        series: [
          {
            type: 'bar',
            name: '比例',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
          // {
          //   type: "bar",name: "签约数量",
          //   yAxisIndex:1,
          //   data: [],
          // },
          // {
          //   type: "bar",name: "咨询数量",
          //   yAxisIndex:1,
          //   data: [],
          // },
        ]
      },

      polar17: {
        title: {
          text: '项目签约方式',
          subtext: '该时段项目签数量',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar19: {
        title: {
          text: '项目平均转化天数',
          subtext: '该时段天数',
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
              rotate: 30
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
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '40%',
            data: []
          }
        ]
      },
      polar20: {
        title: {
          text: '每个项目签约信息',
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
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '项目签约数量',
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '项目签约价格',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '项目签约数量',
            type: 'bar',
            barWidth: '50%',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '项目签约价格',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      polar21: {
        title: {
          text: '项目级别',
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
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '项目级别数量',
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '项目级别价格',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '项目级别数量',
            type: 'bar',
            barWidth: '50%',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '项目级别价格',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      polar22: {
        title: {
          text: '项目类型',
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
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '项目类型数量',
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '项目类型价格',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '项目级别数量',
            type: 'bar',
            barWidth: '50%',
            barMaxWidth: '50',
            data: []
          },
          {
            name: '项目级别价格',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      polar23: {
        title: {
          text: '时段内帮聊人数',
          x: 'left'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['bruce帮聊', 'jerry帮聊', '无帮聊']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '该时段人数'
          }
        ],
        series: [
          {
            name: 'bruce帮聊',
            type: 'bar',
            barGap: 0,
            itemStyle: { // 自定义颜色
              normal: { color: '#c32e47' }
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: 'jerry帮聊',
            type: 'bar',
            itemStyle: {
              normal: { color: '#E6A23C' }
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '无帮聊',
            type: 'bar',
            itemStyle: {
              normal: { color: '#909399' }
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }

        ]
      }
    }
  },
  mounted () {
    this.getSalesUsersList()
    // this.style.height = document.documentElement.clientHeight - 110 + 'px'
    const _this = this
    const myChart = this.$echarts.init(document.getElementById('polar3'))
    myChart.getZr().on('click', function (params) {
      const index = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
      !_this.showBack ? _this.fillNewData(index) : ''
    })
  },
  methods: {
    getSalesUsersList () {
      axios.getSalesUsersList().then(res => {
        console.log(res)
        const users = [
          {
            groupId: 'ALL',
            groupName: '组',
            memberArray: [{ userName: 'ALL', memberId: 'ALL' }]
          }
        ]
        res.data.forEach(e => {
          users[0].memberArray.push({
            userName: e.groupName,
            memberId: 'g_' + e.groupId
          })
        })
        users.push(...res.data)
        console.log(users)
        this.users = users
      })
    },
    Topage () {
      this.dataArr = []
      if (!this.Mydate[0] || !this.Mydate[1]) {
        this.$message({
          type: 'warning',
          message: '请选择日期'
        })
        return
      }
      const data = {
        period: this.time,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1],
        // 条目10条
        number: 20
      }
      console.log(data)
      axios.getSalesDate(data).then(res => {
        const data = res.data
        console.log(data)

        // 饼图
        this.polar.series[0].data[0].value = data.afterSignCount
        this.polar.series[0].data[1].value = data.beforeSignCount

        // 签约渠道
        const ChannelRowsName = []
        const ChannelRowsNum = []
        const ChannelRowsId = []
        data.signChannelCount.forEach(v => {
          ChannelRowsName.push(v.signChannel)
          ChannelRowsNum.push(v.signChannelCount)
          ChannelRowsId.push(v.channelId)
        })
        this.polar3.xAxis[0].data = ChannelRowsName
        this.polar3.series[0].data = ChannelRowsNum
        this.orginalPolar = {
          name: ChannelRowsName,
          num: ChannelRowsNum,
          id: ChannelRowsId
        }
        // 签约国家
        const CountryRowsName = []
        const CountryRowsNum = []
        data.signCountryCount.forEach(v => {
          CountryRowsName.push(v.signCountry)
          CountryRowsNum.push(v.signCountryCount)
        })
        this.polar4.xAxis[0].data = CountryRowsName
        this.polar4.series[0].data = CountryRowsNum
        //   签约学校
        const SchoolRowsName = []
        const SchoolRowsNum = []
        data.signSchoolCount.forEach(v => {
          SchoolRowsName.push(v.signSchool)
          SchoolRowsNum.push(v.signSchoolCount)
        })
        this.polar5.xAxis[0].data = SchoolRowsName
        this.polar5.series[0].data = SchoolRowsNum
        //   实习信息
        const internshipRowsName = []
        const internshipRowsNum = []
        data.internshipInfo.forEach(v => {
          internshipRowsName.push(v.internship)
          internshipRowsNum.push(v.internshipCount)
        })
        this.polar15.xAxis[0].data = internshipRowsName
        this.polar15.series[0].data = internshipRowsNum
        //   学历
        const degreeRowsRowsName = []
        const degreeRowsRowsNum = []
        data.signDegreeCount.forEach(v => {
          degreeRowsRowsName.push(v.signDegree)
          degreeRowsRowsNum.push(v.signDegreeCount)
        })
        this.polar7.xAxis[0].data = degreeRowsRowsName
        this.polar7.series[0].data = degreeRowsRowsNum

        // //   年级
        // let gradeRowsRowsName = [];
        // let gradeRowsRowsNum = [];
        // data.signGradeCount.forEach(v => {
        //   gradeRowsRowsName.push(v.signGrade);
        //   gradeRowsRowsNum.push(v.signGradeCount);
        // });
        // this.polar8.xAxis[0].data = gradeRowsRowsName;
        // this.polar8.series[0].data = gradeRowsRowsNum;
        // 毕业年份
        const finishYearRowsRowsName = []
        const finishYearRowsRowsNum = []
        data.signFinishYearCount.forEach(v => {
          finishYearRowsRowsName.push(v.signFinishYear)
          finishYearRowsRowsNum.push(v.signFinishYearCount)
        })
        this.polar18.xAxis[0].data = finishYearRowsRowsName
        this.polar18.series[0].data = finishYearRowsRowsNum
        // 签约性别
        const SexRowsName = []
        const SexRowsNum = []
        data.signSexCount.forEach(v => {
          SexRowsName.push(v.signSex)
          SexRowsNum.push(v.signSexCount)
        })
        this.polar9.xAxis[0].data = SexRowsName
        this.polar9.series[0].data = SexRowsNum
        // 	签约项目金额比例
        const ProgramPriceRowsName = []
        const ProgramPriceRowsNum = []
        data.signProgramPrice.forEach(v => {
          ProgramPriceRowsName.push(v.price)
          ProgramPriceRowsNum.push(v.total)
        })
        this.polar12.xAxis[0].data = ProgramPriceRowsName
        this.polar12.series[0].data = ProgramPriceRowsNum
        // 	签约学生来源转化率
        const signSourceTransformRatioName = []
        const signSourceTransformRatioNum = []
        const signSourceTransformRatioNum1 = []
        const signSourceTransformRatioNum2 = []
        data.signChannelTransformRatio.forEach(v => {
          signSourceTransformRatioName.push(v.channelName)
          signSourceTransformRatioNum.push({
            value: v.counselorNum
              ? Math.round((v.signNum / v.counselorNum) * 10000) / 100
              : 0,
            datas: [v.signNum, v.counselorNum]
          })
          signSourceTransformRatioNum1.push(Math.round(v.signNum))
          signSourceTransformRatioNum2.push(Math.round(v.counselorNum))
        })
        this.polar24.xAxis[0].data = signSourceTransformRatioName
        this.polar24.series[0].data = signSourceTransformRatioNum
        // this.polar24.series[1].data = signSourceTransformRatioNum1;
        // this.polar24.series[2].data = signSourceTransformRatioNum2;

        // 项目签约方式
        const signWayName = []
        const signWayNum = []
        data.signWayCount.forEach(v => {
          signWayName.push(v.signWay)
          signWayNum.push(v.signWayCount)
        })
        this.polar17.xAxis[0].data = signWayName
        this.polar17.series[0].data = signWayNum

        // 项目平均转化天数
        const transDaysName = []
        const transDaysNum = []
        data.signProgramTransDays.forEach(v => {
          transDaysName.push(v.programTypeName)
          transDaysNum.push(v.transDays)
        })
        this.polar19.xAxis[0].data = transDaysName
        this.polar19.series[0].data = transDaysNum

        // 项目平均转化天数
        console.log(data.helpChatOverview, 22222222222222222)
        const transDaysNum2 = []
        const transDaysNum3 = []
        const transDaysNum4 = []
        const transDaysNum5 = []
        data.helpChatOverview.forEach(v => {
          transDaysNum2.push(v.helpChatBruce)
          transDaysNum3.push(v.helpChatJerry)
          transDaysNum4.push(v.helpChatNo)
          transDaysNum5.push(v.signStatus)
        })
        this.polar23.series[0].data = transDaysNum2
        this.polar23.series[1].data = transDaysNum3
        this.polar23.series[2].data = transDaysNum4
        this.polar23.xAxis[0].data = transDaysNum5

        // 	每个项目签约信息
        const signProgramInfoName = []
        const signProgramInfoNum1 = []
        const signProgramInfoNum2 = []
        data.signProgramInfo.forEach(v => {
          signProgramInfoName.push(v.programName)
          signProgramInfoNum1.push(v.signProgramCount)
          signProgramInfoNum2.push(v.signProgramPrice)
        })
        this.polar20.xAxis[0].data = signProgramInfoName
        this.polar20.series[0].data = signProgramInfoNum1
        this.polar20.series[1].data = signProgramInfoNum2

        // 	项目级别
        const signProgramLevelInfoName = []
        const signProgramLevelInfoNum1 = []
        const signProgramLevelInfoNum2 = []
        data.signProgramLevelInfo.forEach(v => {
          signProgramLevelInfoName.push(v.programLevel)
          signProgramLevelInfoNum1.push(v.signProgramLevelCount)
          signProgramLevelInfoNum2.push(v.signProgramLevelPrice)
        })
        this.polar21.xAxis[0].data = signProgramLevelInfoName
        this.polar21.series[0].data = signProgramLevelInfoNum1
        this.polar21.series[1].data = signProgramLevelInfoNum2

        // 	项目类型
        const signProgramTypeInfoName = []
        const signProgramTypeInfoNum1 = []
        const signProgramTypeInfoNum2 = []
        data.signProgramTypeInfo.forEach(v => {
          signProgramTypeInfoName.push(v.programTypeName)
          signProgramTypeInfoNum1.push(v.signProgramTypeCount)
          signProgramTypeInfoNum2.push(v.signProgramTypePrice)
        })
        this.polar22.xAxis[0].data = signProgramTypeInfoName
        this.polar22.series[0].data = signProgramTypeInfoNum1
        this.polar22.series[1].data = signProgramLevelInfoNum2

        this.tableData = data.signDegreeAndFinishYearTransformRatio
        this.tableData.forEach(v => {
          v.masterConversionRate = v.masterTotalCounselor == 0 ? 0 : (v.masterTotalSign * 100 / v.masterTotalCounselor).toFixed(2) + '%'
          v.undergradConversionRate = v.undergradTotalCounselor == 0 ? 0 : (v.undergradTotalSign * 100 / v.undergradTotalCounselor).toFixed(2) + '%'
        })
      })
    },
    fillNewData (index) {
      const data = {
        channelId: this.orginalPolar.id[index],
        period: this.time,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1],
        number: 20
      }
      axios.getSignSource(data).then(res => {
        this.showBack = true
        const d = res.data
        const name = []
        const num = []
        toString.call(d) === '[object Array]' &&
          d.forEach(v => {
            name.push(v.signSource)
            num.push(v.signSourceCount)
          })
        this.polar3.xAxis[0].data = name
        this.polar3.series[0].data = num
      })
    },
    back () {
      this.showBack = false
      this.polar3.xAxis[0].data = this.orginalPolar.name
      this.polar3.series[0].data = this.orginalPolar.num
    }
  }
}
</script>

<style lang="scss" scoped>
.inb {
  display: inline-block;
  width: 800px;
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
.relative{
  position:relative
}
.back_btn{
  position:absolute;
  top:5px;
  right:50px;
}
</style>
