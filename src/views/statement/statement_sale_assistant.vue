<template>
  <d2-container v-loading="loading">
    <div >
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
          <el-button icon="el-icon-search"  size="mini" plain @click="Topage(1)">查看</el-button>
        </div>
      </div>
      <div class="table-box" id="table-box" :style="style">
        <div class="inb" style="position:relative">
          <el-button type="success" :loading="btnLoading" style="position:absolute;top:0;left:50%;translate:transform(-50%,0);z-index: 8888;" v-if="this.Mydate[0] && this.Mydate[1]" icon="el-icon-download" @click="downloadPolar">导出</el-button>
          <v-chart :options="polar" />
        </div>
        <div class="inb">
          <v-chart :options="polar2" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar3" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar5" />
        </div>
        <div class="inb leng relative">
          <v-chart :options="polar10" id="polar10"/>
          <el-button v-show="showBack10" size="mini" class="back_btn" @click="back1">back</el-button>
        </div>
        <div class="inb leng relative">
          <v-chart :options="polar11" id="polar11"/>
          <el-button v-show="showBack11" size="mini" class="back_btn" @click="back2">back</el-button>
        </div>
        <template>
          <v-chart :options="polar144"></v-chart>
        </template>
        <!-- 微信管理人 -->
        <!-- <div class="inb leng">
          <v-chart :options="polar31" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar32" />
        </div>-->
        <!-- 国家 -->
        <div class="inb leng">
          <v-chart :options="polar13" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar14" />
        </div>
        <div class="inb">
          <v-chart :options="polar4" />
        </div>
        <div class="inb">
          <v-chart :options="polar6" />
        </div>
        <div class="inb">
          <v-chart :options="polar7" />
        </div>
        <div class="inb">
          <v-chart :options="polar8" />
        </div>
        <br>
        <div style="width: 570px;margin-bottom: 20px;margin-right:30px;float:left;padding-left:5px">
          <p style="font-size:18px;height:30px;font-weight:600">新增学生（微信管理人）</p>
          <el-table
            :data="tableData"
            row-key="valueId"
            border
            :row-class-name="tableRowClassName"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="valueName" label="姓名" min-width="280" show-overflow-tooltip></el-table-column>
            <el-table-column prop="valueCount" label="数量" width="100"></el-table-column>
          </el-table>
        </div>
        <div style="width: 570px;margin-bottom: 20px;float:left;padding-left:5px">
          <p style="font-size:18px;height:30px;font-weight:600">咨询学生（微信管理人）</p>
          <el-table
            :data="tableData2"
            row-key="valueId"
            border
            :row-class-name="tableRowClassName"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="valueName" label="姓名" min-width="280" show-overflow-tooltip></el-table-column>
            <el-table-column prop="valueCount" label="数量" width="100"></el-table-column>
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
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

// 手动引入Highcharts下钻图
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import mixins from '@/plugin/mixins'
import axios from '@/api/statement.js'
import { mapState } from 'vuex'

HighchartsDrilldown(Highcharts)
export default {
  mixins: [mixins],
  components: {
    'v-chart': ECharts,
    highcharts: Chart
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
      loading: false,
      btnLoading: false,
      mentee_intention: [],
      colors: ['#C23531', '#3398db', '#90ed7d', '#f7a35c', '#61a0a8', '#61a0a8', '#91c7ae', '#2f4554'],
      polar144: {
        title: {
          text: '咨询学生国家',
          x: 'left',
          y: '50px',
          subtext: '该时段人数',
          textStyle: {
            fontSize: 17,
            marginTop: '-40px'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          itemWidth: 15,
          itemHeight: 15,
          data: []
        },
        xAxis: {
          data: [],
          splitLine: {
            show: false
          }
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        series: []
      },
      dataArr: [],
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
      timeList: ['日', '自然月', '财务月', '自然年'],
      users: [],
      time: '自然月',
      Mydate: [],
      search: '',
      addCount: 110,
      newCounselorCount: 10,
      beforeCounselorCount: 110,
      style: { height: '500px' },
      tableData: [],
      tableData2: [],
      polar: {
        title: {
          text: '销售助理报表',
          subtext: '该时段人数比',
          x: 'left'
        },
        // 提示
        tooltip: {
          trigger: 'item',
          formatter: '{d}%'
        },
        // 图例
        // legend: {
        //   orient: "vertical",
        //   left: "left",
        //   data: ["到顾问人数（新增）", "新增人数（未到顾问）"]
        //   //   data: ["到顾问人数（往期）", "新增人数",]
        // },
        series: [
          {
            name: '新增人数',
            type: 'pie',
            radius: '20%',
            center: ['30%', '35%'],
            label: {
              formatter: '{b}:\n{c}({d}%)'
            },
            data: [
              { value: 0, name: '新增人数(咨询)' },
              { value: 0, name: '新增人数(未咨询)' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: '新增人数',
            type: 'pie',
            radius: '20%',
            center: ['85%', '25%'],
            label: {
              formatter: '{b}:\n{c}({d}%)'
            },
            data: [
              { value: 0, name: '咨询人数（往期）' },
              { value: 0, name: '新增人数' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: '新增人数',
            type: 'pie',
            radius: '20%',
            center: ['50%', '65%'],
            label: {
              formatter: '{b}:\n{c}({d}%)'
            },
            data: [
              { value: 0, name: '咨询人数（往期）' },
              { value: 0, name: '咨询人数（新增）' }
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
      polar2: {
        title: {
          text: '销售助理报表',
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
            data: ['新增人数', '咨询人数（新增）', '咨询人数（往期）'],
            axisTick: {
              alignWithLabel: true
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',
            barWidth: '50%',
            data: []
          }
        ]
      },
      //   新增学校
      polar3: {
        title: {
          text: '新增学校',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      //   新增专业
      polar4: {
        title: {
          text: '新增专业',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      //   新增学生 微信管理人
      // polar31: {
      //   title: {
      //     text: "新增学生（微信管理人）",
      //     subtext: "该时段人数",
      //     x: "left"
      //   },
      //   legend: {},
      //   tooltip: {
      //     // trigger: "axis",
      //     // axisPointer: {
      //     //   // 坐标轴指示器，坐标轴触发有效
      //     //   type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      //     // }
      //   },
      //   // grid: {
      //   //   left: "3%",
      //   //   right: "4%",
      //   //   bottom: "3%",
      //   //   containLabel: true
      //   // },
      //   dataset: {
      //     source: []
      //   },
      //   xAxis: {
      //     type: "category",
      //     // data: [],
      //     // axisTick: {
      //     //   alignWithLabel: true
      //     // },
      //     axisLabel: {
      //       rotate: 30
      //     }
      //   },
      //   yAxis: {
      //     type: "value"
      //   },
      //   series: []
      // },
      // //   咨询学生渠道
      // polar32: {
      //   title: {
      //     text: "咨询学生（微信管理人）",
      //     subtext: "该时段人数",
      //     x: "left"
      //   },
      //   legend: {},
      //   tooltip: {},
      //   dataset: {
      //     source: []
      //   },
      //   xAxis: {
      //     type: "category",
      //   },
      //   yAxis: {
      //     type: "value"
      //   },
      //   series: []
      // },
      //   新增学生国家
      polar13: {
        title: {
          text: '新增学生国家',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      //   咨询学生国家
      polar14: {
        title: {
          text: '咨询学生国家',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      //   咨询学校
      polar5: {
        title: {
          text: '咨询学校',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      //   咨询专业
      polar6: {
        title: {
          text: '咨询专业',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      polar7: {
        title: {
          text: '咨询学历',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      polar8: {
        title: {
          text: '咨询年级',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      polar10: {
        title: {
          text: '新增学生渠道',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      polar11: {
        title: {
          text: '咨询学生渠道',
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
            barMaxWidth: '40',
            barWidth: '50%',
            data: []
          }
        ]
      },
      orginalPolar10: {},
      showBack10: false,
      orginalPolar11: {},
      showBack11: false
    }
  },
  mounted () {
    this.getUsersList()
    console.log(this.$echarts,2222222222222222)
    this.pageInit()
    this.style.height = document.documentElement.clientHeight - 110 + 'px'
    const myChart1 = this.$echarts.init(document.getElementById('polar10'))
    const _this = this
    myChart1.getZr().on('click', function (params) {
      const index = myChart1.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
      !_this.showBack10 ? _this.fillNewData1(index) : ''
    })
    const myChart2 = this.$echarts.init(document.getElementById('polar11'))
    myChart2.getZr().on('click', function (params) {
      const index = myChart2.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
      !_this.showBack11 ? _this.fillNewData2(index) : ''
    })
  },
  methods: {
    async pageInit () {
      this.mentee_intention = await this.getDictionary('mentee_intention')
    },
    tableRowClassName ({ row }) {
      if (row.children) {
        return 'warning-row'
      }
      return ''
    },
    getUsersList () {
      axios.getUsersList().then(res => {
        const users = [
          { userId: 'ALL', userName: 'ALL' },
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        res.data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
      })
    },
    dataTodata () {
      console.log(this.dataArr)
      const a = []; const b = []; const c = []; const d = []; const e = []
      for (let i = 0; i < this.dataArr[0].channelList.length; i++) {
        d.push([])
        c.push(this.dataArr[0].channelList[i].channelName)
        b.push({
          name: this.dataArr[0].channelList[i].channelName,
          type: 'bar',
          stack: '渠道情况',
          data: [],
          itemStyle: {
            normal: {
              color: this.colors[i],
              label: {
                show: false, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: 'black',
                  fontSize: 16
                }
              }
            }
          }
        })
      }
      for (let i = 0; i < this.dataArr.length; i++) {
        e.push(this.dataArr[i].counselorCountCountry)
        a.push(this.dataArr[i].countryName)
        for (let j = 0; j < this.dataArr[i].channelList.length; j++) {
          d[j].push(this.dataArr[i].channelList[j].channelCount)
        }
      }
      for (let m = 0; m < b.length; m++) {
        b[m].data = d[m]
      }
      b.push({
        name: '总数',
        type: 'bar',
        barGap: '-70%', // 左移100%，stack不再与上面两个在一列
        barMaxWidth: '40',
        barWidth: '40%',
        label: {
          normal: {
            show: true, // 显示数值
            position: 'top', //  位置设为top
            formatter: '{c}',
            textStyle: { color: '#000' } // 设置数值颜色
          }
        },
        itemStyle: {
          normal: {
            color: 'rgba(128, 128, 128, 0)' // 设置背景颜色为透明
          }
        },
        data: e
      })
      console.log(e, b, 'ghuewghuyx**********')
      this.polar144.legend.data = c
      this.polar144.xAxis.data = a
      this.polar144.series = b
    },
    Topage () {
      this.loading = true
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
      // axios.getSchoolDate(data).then(res => {
      //   console.log(res,'yx***************咨询情况')
      // })
      axios.getSaleAssistantStatementData(data).then(res => {
        const data = res.data
        console.log(data)
        // 饼图
        this.polar.series[0].data[0].value = data.newCounselorCount
        this.polar.series[0].data[1].value =
          data.addCount - data.newCounselorCount
        this.polar.series[1].data[0].value = data.beforeCounselorCount
        this.polar.series[1].data[1].value = data.addCount
        this.polar.series[2].data[0].value = data.beforeCounselorCount
        this.polar.series[2].data[1].value = data.newCounselorCount

        this.dataArr = data.counselorCountryRows
        this.dataTodata()
        // this.polar2.xAxis[0].data = [
        //   data.addCount,
        //   data.newCounselorCount,
        //   data.beforeCounselorCount
        // ];
        this.polar2.series[0].data = [
          data.addCount,
          data.newCounselorCount,
          data.beforeCounselorCount
        ]
        //   新增学校
        const addSchoolRowsName = []
        const addSchoolRowsNum = []
        toString.call(data.addSchoolRows) === '[object Array]' &&
          data.addSchoolRows.forEach(v => {
            addSchoolRowsName.push(v.school)
            addSchoolRowsNum.push(v.addCountSchool)
          })
        this.polar3.xAxis[0].data = addSchoolRowsName
        this.polar3.series[0].data = addSchoolRowsNum

        //   新增专业
        const addMajorRowsName = []
        const addMajorRowsNum = []
        toString.call(data.addMajorRows) === '[object Array]' &&
          data.addMajorRows.forEach(v => {
            addMajorRowsName.push(v.major)
            addMajorRowsNum.push(v.addCountMajor)
          })
        this.polar4.xAxis[0].data = addMajorRowsName
        this.polar4.series[0].data = addMajorRowsNum

        //   新增学生渠道
        const addChannelRowsName = []
        const addChannelRowsNum = []
        const addChannelRowsId = []
        toString.call(data.addChannelRows) === '[object Array]' &&
          data.addChannelRows.forEach(v => {
            addChannelRowsName.push(v.channel)
            addChannelRowsNum.push(v.addCountChannel)
            addChannelRowsId.push(v.channelId)
          })
        this.polar10.xAxis[0].data = addChannelRowsName
        this.polar10.series[0].data = addChannelRowsNum
        this.orginalPolar10 = {
          name: addChannelRowsName,
          num: addChannelRowsNum,
          id: addChannelRowsId
        }

        //   咨询学生来源
        const counselorChannelRowsName = []
        const counselorChannelRowsNum = []
        const counselorChannelRowsId = []
        toString.call(data.counselorChannelRows) === '[object Array]' &&
          data.counselorChannelRows.forEach(v => {
            counselorChannelRowsName.push(v.channel)
            counselorChannelRowsNum.push(v.counselorCountChannel)
            counselorChannelRowsId.push(v.channelId)
          })
        this.polar11.xAxis[0].data = counselorChannelRowsName
        this.polar11.series[0].data = counselorChannelRowsNum
        this.orginalPolar11 = {
          name: counselorChannelRowsName,
          num: counselorChannelRowsNum,
          id: counselorChannelRowsId
        }

        //   新增学生国家
        const addCountryRowsName = []
        const addCountryRowsNum = []
        toString.call(data.addCountryRows) === '[object Array]' &&
          data.addCountryRows.forEach(v => {
            addCountryRowsName.push(v.country)
            addCountryRowsNum.push(v.addCountCountry)
          })
        this.polar13.xAxis[0].data = addCountryRowsName
        this.polar13.series[0].data = addCountryRowsNum

        //   咨询学生国家
        const counselorCountryRowsName = []
        const counselorCountryRowsNum = []
        toString.call(data.counselorCountryRows) === '[object Array]' &&
          data.counselorCountryRows.forEach(v => {
            console.log(v, 'yx4dasdsad')
            counselorCountryRowsName.push(v.countryName)
            counselorCountryRowsNum.push(v.counselorCountCountry)
          })
        this.polar14.xAxis[0].data = counselorCountryRowsName
        this.polar14.series[0].data = counselorCountryRowsNum

        //   新增学校
        const counselorSchoolRowsName = []
        const counselorSchoolRowsNum = []
        toString.call(data.counselorSchoolRows) === '[object Array]' &&
          data.counselorSchoolRows.forEach(v => {
            counselorSchoolRowsName.push(v.school)
            counselorSchoolRowsNum.push(v.counselorCountSchool)
          })
        this.polar5.xAxis[0].data = counselorSchoolRowsName
        this.polar5.series[0].data = counselorSchoolRowsNum

        //   咨询专业
        const counselorMajorRowsName = []
        const counselorMajorRowsNum = []
        toString.call(data.counselorMajorRows) === '[object Array]' &&
          data.counselorMajorRows.forEach(v => {
            counselorMajorRowsName.push(v.major)
            counselorMajorRowsNum.push(v.counselorCountMajor)
          })
        this.polar6.xAxis[0].data = counselorMajorRowsName
        this.polar6.series[0].data = counselorMajorRowsNum

        //   学历
        const degreeRowsRowsName = []
        const degreeRowsRowsNum = []
        toString.call(data.counselorDegreeRows) === '[object Array]' &&
          data.counselorDegreeRows.forEach(v => {
            degreeRowsRowsName.push(v.degree)
            degreeRowsRowsNum.push(v.counselorCountDegree)
          })
        this.polar7.xAxis[0].data = degreeRowsRowsName
        this.polar7.series[0].data = degreeRowsRowsNum

        //   年级
        const gradeRowsRowsName = []
        const gradeRowsRowsNum = []
        toString.call(data.counselorFinishYearRows) === '[object Array]' &&
          data.counselorFinishYearRows.forEach(v => {
            gradeRowsRowsName.push(v.finishYear)
            gradeRowsRowsNum.push(v.counselorCountFinishYear)
          })
        this.polar8.xAxis[0].data = gradeRowsRowsName
        this.polar8.series[0].data = gradeRowsRowsNum

        this.tableData = data.addSourceByManageByRows
        this.tableData2 = data.counselorSourceByManageByRows

        this.loading = false
      })
    },
    fillNewData1 (index) {
      const data = {
        channelId: this.orginalPolar10.id[index],
        period: this.time,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1],
        number: 20
      }
      axios.getAddSource(data).then(res => {
        this.showBack10 = true
        const d = res.data
        const name = []
        const num = []
        toString.call(d) === '[object Array]' &&
          d.forEach(v => {
            name.push(v.source)
            num.push(v.addCountSource)
          })
        this.polar10.xAxis[0].data = name
        this.polar10.series[0].data = num
      })
    },
    downloadPolar () {
      this.btnLoading = true
      const fileName = '销售报表'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}statement/assistant/sign/rate/excel?fromDate=${this.Mydate[0]}&toDate=${this.Mydate[1]}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = this.$store.state.role.token
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      let that = this
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          console.log(that)
          that.btnLoading = false
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
    },
    fillNewData2 (index) {
      const data = {
        channelId: this.orginalPolar11.id[index],
        period: this.time,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1],
        number: 20
      }
      axios.getCounselorSource(data).then(res => {
        this.showBack11 = true
        const d = res.data
        const name = []
        const num = []
        toString.call(d) === '[object Array]' &&
          d.forEach(v => {
            name.push(v.source)
            num.push(v.counselorCountSource)
          })
        this.polar11.xAxis[0].data = name
        this.polar11.series[0].data = num
      })
    },
    back1 () {
      this.showBack10 = false
      this.polar10.xAxis[0].data = this.orginalPolar10.name
      this.polar10.series[0].data = this.orginalPolar10.num
    },
    back2 () {
      this.showBack11 = false
      this.polar11.xAxis[0].data = this.orginalPolar11.name
      this.polar11.series[0].data = this.orginalPolar11.num
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
.relative{
  position:relative
}
.back_btn{
  position:absolute;
  top:5px;
  right:50px;
}
</style>
