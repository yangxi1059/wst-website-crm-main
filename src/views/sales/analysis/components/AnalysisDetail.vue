<!--
 * @Author: kaan
 * @Date: 2021-10-28 10:37:05
 * @LastEditors: kaan
 * @LastEditTime: 2021-10-29 14:58:45
 * @Version: 
 * @Description: 
-->

<template>
  <div>
    <el-dialog
      :title="`${detailData.userName}-数据看板`"
      :visible.sync="detailVisible"
      width="1500px"
      :before-close="close"
      :append-to-body="true"
    >
      <el-row>
        <el-col :span="8" class="_item-name">
          <v-chart style="width:100%" :options="optionRadar" />
        </el-col>
        <el-col :span="8" class="_item-name" >
          <v-chart style="width:100%" :options="optionYear" />
        </el-col>
        <el-col :span="8" class="_item-name" v-if="tabsValue == 0">
          <v-chart style="width:100%" :options="optionLocation" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/sales_assistant";
import ECharts from "vue-echarts";
// 手动引入 ECharts 各模块来减小打包体积
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/radar";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";

let _this
export default {
  components: {
    "v-chart": ECharts
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    tabsValue:{},
    detailData: {
    },
    daterange: {
    },
    schoolId: {
    },
  },
  watch: {
    detailVisible: function(val) {
      if (val) {
        this.init()
      }
    }
  },
  data() {
    _this = this
    return {
      orderRefund:0,
      radarData:[],
      optionRadar: {
        color:['#73c0de', '#91cc75', '#fac858', '#ee6666', '#5470c6', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        title: {
          text: ''
        },
        radar: {
          // shape: 'circle',
          indicator: [{ name: '订单金额', max:0},
            { name: '入账金额', max:0},
            { name: '签约转换率', max:0},
            { name: 'KPI', max:0},
            { name: '退款', max:0}
          ]
        },
        series: [
          {
            name: '',
            type: 'radar',
            data: [
              {
                value: [0,0,0,0,0],
                name: 'date1',
                // itemStyle: {
                //   normal: {
                //     color: '#87CEFF',
                //   }
                // },
                label: {
                  show: true,
                  color: "#666",
                  formatter:function(params) {
                    return _this.getRadarData(params);
                  }
                },
                areaStyle: {},   
              },
              
            ]
          }
        ]
      },
      optionYear: {
        color:['#73c0de', '#91cc75', '#fac858', '#ee6666', '#5470c6', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
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
              color: "#666",
            },
            type: 'bar',
            barMaxWidth: '50',
          },
          {
            name: '分配人数',
            data: [],
            label: {
              show: true,
              position: 'top',
              color: "#666",
            },
            type: 'bar',
            barMaxWidth: '50',
          }
        ]
      },
      optionLocation: {
        color:['#73c0de', '#91cc75', '#fac858', '#ee6666', '#5470c6', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
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
              color: "#666",
            },
            type: 'bar',
            barMaxWidth: '50',
          },
          {
            name: '分配人数',
            data: [],
            label: {
              show: true,
              position: 'top',
              color: "#666",
            },
            type: 'bar',
            barMaxWidth: '50',
          }
        ]
      },
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      let days = this.getDaysBetween(this.daterange[0],this.daterange[1])
      // 雷达图最大值集合
      let maxArr = [25000*days, 25000*days, 20, 1*days, 2500*days]
      // 雷达图原始数据集合
      this.radarData = [this.detailData.totalOrderPrice,this.detailData.orderRevenue,this.detailData.signRate,this.detailData.kpi,this.detailData.orderRefund]
      this.optionRadar.radar.indicator = [
        { name: '订单金额', max: maxArr[0] },
        { name: '入账金额', max: maxArr[1] },
        { name: '签约转换率', max: maxArr[2] },
        { name: 'KPI', max: maxArr[3] },
        { name: '退款', max: maxArr[4] },
      ]
      this.orderRefund = 2500*days
      this.optionRadar.series[0].data[0].value = [
        this.detailData.totalOrderPrice,
        this.detailData.orderRevenue,
        this.detailData.signRate.replace('%', ''),
        this.detailData.kpi,
        this.detailData.orderRefund
      ]
      // 处理数据，超过值直接显示极值
      for(let i=0; i<5; i++){
        let d = this.optionRadar.series[0].data[0].value[i]
        if(d <0 ){
          this.optionRadar.series[0].data[0].value[i] = 0
        }else if(d > maxArr[i]){
          this.optionRadar.series[0].data[0].value[i] = maxArr[i]
        }
        if(i == 4){
          this.optionRadar.series[0].data[0].value[i] = maxArr[i] - d
        }
      }
      if(this.tabsValue == 0){
        api.getSalesDetail(this.daterange[0],this.daterange[1],this.detailData.userId).then(res => {
          console.log("获取销售数据详情",res)
          res.data.finishYear.forEach(u => {
            this.optionYear.xAxis.data.push(u.finishYear)
            this.optionYear.series[0].data.push(u.signCount)
            this.optionYear.series[1].data.push(u.menteeCount)
          });
          res.data.location.forEach(u => {
            this.optionLocation.xAxis.data.push(u.country)
            this.optionLocation.series[0].data.push(u.signCount)
            this.optionLocation.series[1].data.push(u.menteeCount)
          });
        })
      }else if(this.tabsValue == 1){
        api.getSchoolDetail(this.daterange[0],this.daterange[1],this.detailData.userId,this.schoolId).then(res => {
          console.log("获取学校数据详情",res)
          res.data.finishYear.forEach(u => {
            this.optionYear.xAxis.data.push(u.finishYear)
            this.optionYear.series[0].data.push(u.signCount)
            this.optionYear.series[1].data.push(u.menteeCount)
          });
        })
      }
    },
    /**
     * @description: 雷达图formatter展示原始数据值
     * @param {*} params
     * @return {*}
     */    
    getRadarData(params){
      let index = params.data.value.indexOf(params.value)
      return this.radarData[index]
    },
    getDaysBetween(dateString1,dateString2){
      let startDate = Date.parse(dateString1);
      let endDate = Date.parse(dateString2);
      if (startDate>endDate){
          return 0;
      }
      if (startDate==endDate){
          return 1;
      }
      let days=(endDate - startDate)/(1*24*60*60*1000);
      return  days;
    },
    close(){
      this.$emit("close")
    }
  }
}
</script>

