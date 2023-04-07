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
        </div>
      </div>
      <div class="table-box" id="table-box" :style="style">
        <!-- 销售签约人数；金额、单数 -->
        <P>该时段新增导师数：{{mentorAdd}}</P>
        <div class="inb leng">
          <v-chart :options="polar2" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar3" />
        </div>
      <div class="inb leng">
          <v-chart :options="polar4" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar5" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar6" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar7" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar8" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar9" />
        </div>
        <div class="inb leng">
          <v-chart :options="polar10" />
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
import axios from '@/api/statement.js'

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
      timeList: ['日', '自然月', '财务月', '自然年'],
      users: [],
      time: '自然月',
      Mydate: [],
      org: 'ALL',
      intention: 'ALL',
      search: '',
      addCount: 110,
      newCounselorCount: 10,
      beforeCounselorCount: 110,
      style: { height: '500px' },

      polar2: {
        title: {
          text: '导师所在公司',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar3: {
        title: {
          text: '导师所在国家/地区',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar4: {
        title: {
          text: '	导师所在部门',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar5: {
        title: {
          text: '导师男女',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar6: {
        title: {
          text: '	导师Tracks',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar7: {
        title: {
          text: '导师学校（展示最高学位）',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar8: {
        title: {
          text: '导师排名 - 已上课时Top 30',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar9: {
        title: {
          text: '导师已参与项目数',
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
            name: '',
            type: 'bar',
            barMaxWidth: '50',

            data: []
          }
        ]
      },
      polar10: {
        title: {
          text: '导师已支付金额',
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
            name: 'USD',
            type: 'bar',

            barMaxWidth: '50',
            data: []
          },
          {
            name: 'CNY',
            type: 'bar',

            barMaxWidth: '50',
            data: []
          }
        ]
      },
      mentorAdd: 0
    }
  },
  mounted () {
    this.style.height = document.documentElement.clientHeight - 110 + 'px'
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
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1],
        // 条目10条
        number: 20
      }
      axios.getMentorDate(data).then(res => {
        const data = res.data
        console.log(data)

        this.mentorAdd = data.mentorAdd
        // 饼图
        // this.polar.series[0].data[0].value = data.afterSignCount;
        // this.polar.series[0].data[1].value = data.beforeSignCount;
        // 时段签约人数
        const mentorCompanySeries = []
        const mentorCompanyXAxis = []
        data.mentorCompany.forEach(v => {
          mentorCompanySeries.push(v.companyCount)
          mentorCompanyXAxis.push(v.company)
        })
        this.polar2.series[0].data = mentorCompanySeries
        this.polar2.xAxis[0].data = mentorCompanyXAxis
        this.polar2.title.subtext = data.mentorCompanyDesc

        const mentorLocationSeries = []
        const mentorLocationXAxis = []
        data.mentorLocation.forEach(v => {
          mentorLocationSeries.push(v.locationCount)
          mentorLocationXAxis.push(v.location)
        })
        this.polar3.series[0].data = mentorLocationSeries
        this.polar3.xAxis[0].data = mentorLocationXAxis
        this.polar3.title.subtext = data.mentorLocationDesc

        const mentorDivisionSeries = []
        const mentorDivisionXAxis = []
        data.mentorDivision.forEach(v => {
          mentorDivisionSeries.push(v.divisionCount)
          mentorDivisionXAxis.push(v.division)
        })
        this.polar4.series[0].data = mentorDivisionSeries
        this.polar4.xAxis[0].data = mentorDivisionXAxis
        this.polar4.title.subtext = data.mentorDivisionDesc

        const mentorSexSeries = []
        const mentorSexXAxis = []
        data.mentorSex.forEach(v => {
          mentorSexSeries.push(v.sexCount)
          mentorSexXAxis.push(v.sex)
        })
        this.polar5.series[0].data = mentorSexSeries
        this.polar5.xAxis[0].data = mentorSexXAxis
        this.polar5.title.subtext = data.mentorSexDesc

        const mentorTrackSeries = []
        const mentorTrackXAxis = []
        data.mentorTrack.forEach(v => {
          mentorTrackSeries.push(v.trackCount)
          mentorTrackXAxis.push(v.track)
        })
        this.polar6.series[0].data = mentorTrackSeries
        this.polar6.xAxis[0].data = mentorTrackXAxis
        this.polar6.title.subtext = data.mentorTrackDesc

        const mentorSchoolSeries = []
        const mentorSchoolXAxis = []
        data.mentorSchool.forEach(v => {
          mentorSchoolSeries.push(v.schoolCount)
          mentorSchoolXAxis.push(v.school)
        })
        this.polar7.series[0].data = mentorSchoolSeries
        this.polar7.xAxis[0].data = mentorSchoolXAxis
        this.polar7.title.subtext = data.mentorSchoolDesc

        const mentorLessonSeries = []
        const mentorLessonXAxis = []
        data.mentorLesson.forEach(v => {
          mentorLessonSeries.push(v.lessonCount)
          mentorLessonXAxis.push(v.mentorName)
        })
        this.polar8.series[0].data = mentorLessonSeries
        this.polar8.xAxis[0].data = mentorLessonXAxis
        this.polar8.title.subtext = data.mentorLessonDesc

        const mentorSignSeries = []
        const mentorSignXAxis = []
        data.mentorSign.forEach(v => {
          mentorSignSeries.push(v.signCount)
          mentorSignXAxis.push(v.mentorName)
        })
        this.polar9.series[0].data = mentorSignSeries
        this.polar9.xAxis[0].data = mentorSignXAxis
        this.polar9.title.subtext = data.mentorSignDesc

        const mentorCnyPaySeries = []
        const mentorUsdPaySeries = []
        const mentorPayXAxis = []
        data.mentorPay.forEach(v => {
          mentorCnyPaySeries.push(v.cnyPayAmount)
          mentorUsdPaySeries.push(v.usdPayAmount)
          mentorPayXAxis.push(v.mentorName)
        })
        this.polar10.series[0].data = mentorCnyPaySeries
        this.polar10.series[1].data = mentorUsdPaySeries
        this.polar10.xAxis[0].data = mentorPayXAxis
        this.polar10.title.subtext = data.mentorPayDesc
      })
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
// .table-box {
//   width: 100%;
//   height: 100%;
//   overflow: auto;
// }
</style>
