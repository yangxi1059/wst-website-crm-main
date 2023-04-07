<!--
 * @Author: kaan
 * @Date: 2021-12-29 17:09:03
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-17 15:08:56
 * @Version: 
 * @Description: 销售学生分配公示栏
-->
<template>
  <el-drawer
    :title="title"
    :visible.sync="assignmentBoardVisible"
    :size="widths"
    :before-close="close"
  >
    <div class="board_top mb10">
      <div class="mr10" v-if="boardType == 0">今日总计 {{countTotal}}</div>
      <el-button type="primary" icon="el-icon-refresh" @click="initSales(boardType)">刷新</el-button>
    </div>

    <ul v-loading="loading" v-if="boardType == 0">
      <li class="board_item"  v-for="(sales,i) in salesList" :key="i">
        <div class="board_item_name">{{sales.counselorName||'无'}}</div>
        <div class="">
          <span class="colorA mr10" v-if="roleInfo.includes(`sales_assistant_currentMonth`)" >{{sales.monthCounselorCount}}(本月累计)</span>
          <span class="colorA" :class="sales.weekdayStatus == 1 && 'colorB'">{{sales.counselorCount}}({{sales.weekdayStatus == 1 ? '值班' : '休息'}})</span>
        </div>
      </li>
    </ul>

    <ul v-loading="loading" v-if="boardType == 1">
      <li class="board_item"  v-for="(sales,i) in salesList2" :key="i">
        <div class="board_item_name">{{sales.userName||'无'}}</div>
        <div class="">
          <span class="colorB mr10" v-if="roleInfo.includes(`sales_assistant_ineffectiveNum`)" >{{sales.ineffectiveNum}}(无效咨询数)</span>
          <span class="colorC mr10" v-if="roleInfo.includes(`sales_assistant_totalNum`)" >{{sales.totalNum}}(总拉给顾问咨询数)</span>
          <span class="colorA mr10" v-if="roleInfo.includes(`sales_assistant_ConversionRate`)" >{{(sales.ineffectiveNum/sales.totalNum*100).toFixed(2)}}%(无效咨询率)</span>
          <span class="colorD " v-if="roleInfo.includes(`sales_assistant_ineffectiveNum`)" >{{sales.signMenteeNum}}(签约学员)</span>
        </div>
      </li>
    </ul>

    <ul v-if="boardType == 2">
      <li class="mb10" v-for="(item) in cooperatorArr" :key="item.name" v-loading="loading" >
        <el-table
          size="mini"
          :row-class-name="tableRowClassName" 
          :data="item.arr"
          >
          <el-table-column
            v-if="item && item.arr[0].name"
            prop="name"
            align="center"
            width="150"
            show-overflow-tooltip
          >
          </el-table-column>
            <el-table-column align="center" :label="item.name">
              <el-table-column
                align="center"
                prop="addToday"
                label="今日新增"
                width="80">
              </el-table-column>
              <el-table-column
                prop="fenToday"
                label="今日分配"
                align="center"
                width="80">
              </el-table-column>
              <el-table-column
                prop="addMonth"
                align="center"
                label="本月新增"
                width="80">
              </el-table-column>
              <el-table-column
                prop="fenMonth"
                label="本月分配"
                align="center"
                width="80">
              </el-table-column>
            </el-table-column>
        </el-table>
      </li>
    </ul>

    <ul v-loading="loading" v-if="boardType == 3" class="pl10">
      <el-table
        size="mini"
        :row-class-name="tableRowClassName" 
        :data="signedInTenDaysList"
      >
        <el-table-column prop="realName" label="学员姓名" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="wxId" label="微信ID" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="wxName" label="微信名称" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderId" label="订单id" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signDate" label="签约日期" width="90" show-overflow-tooltip></el-table-column>
      
      </el-table>
    </ul>
  </el-drawer>
</template>

<script>
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import api from '@/api/assistant.js'
export default {
  name: 'Praise',
  mixins: [
    mixins
  ],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    assignmentBoardVisible: {
      type: Boolean,
      default: false
    },
    boardType:{},
  },
  data() {
    return {
      salesList:[],
      salesList2:[],
      cooperatorArr:[],
      signedInTenDaysList:[],
      countTotal:"",
      loading:false,
      title:"",
      widths:"400px"
    }
   },
  mounted() {
    console.log("initSales")
    
  },
  watch: {
    assignmentBoardVisible: function (val) {
      if (val) {
        this.initSales(this.boardType);
        switch (this.boardType) {
          case 0:
            this.title="销售顾问学生分配公示栏"
            this.widths = "400px"
            break
          case 1:
            this.title="销售助理拉给顾问咨询情况（当月）"
            this.widths = "600px"
            break
          case 2:
            this.title="BD渠道"
            this.widths = "600px"
            break
          case 3:
            this.title="十日签约"
            this.widths = "600px"
            break
        }
        
      }
    }
  },
  methods: {
    initSales(i){
      this.loading = true
      if(i == 0 || i == -1){
        api.getSalesList().then(res => {
          this.loading = false
          console.log(res,'getSalesList')
          this.salesList = res.data;
          this.countTotal = res.data.reduce((p,e)=>p+e.counselorCount,0);
        });
      }
      if(i == 1 || i == -1){
        api.getSalesList2().then(res => {
          this.loading = false
          console.log(res,'getSalesList2')
          this.salesList2 = res.data;
        });
      }
      if(i == 2 || i == -1){
        api.getSalesList3().then(res => {
          this.loading = false
          let Arr = [];
          let obj = {}
          console.log(res.data,11111111111111111111111111111111111)
          res.data.map(item => {
            obj ={
              arr:[{
                name:'合作商（渠道）',
                addToday:item.cooperatorAddDayNum,
                fenToday:item.cooperatorCounselorDayNum,
                addMonth:item.cooperatorAddMonthNum,
                fenMonth:item.cooperatorCounselorMonthNum,
              },{
                name:'校园大使（渠道）',
                addToday:item.ambassadorAddDayNum,
                fenToday:item.ambassadorCounselorDayNum,
                addMonth:item.ambassadorAddMonthNum,
                fenMonth:item.ambassadorCounselorMonthNum,
              },{
                name:'社交（渠道）',
                addToday:item.socialAddDayNum,
                fenToday:item.socialCounselorDayNum,
                addMonth:item.socialAddMonthNum,
                fenMonth:item.socialCounselorMonthNum,
              },{
                name:'其他',
                addToday:item.otherAddDayNum,
                fenToday:item.otherCounselorDayNum,
                addMonth:item.otherAddMonthNum,
                fenMonth:item.otherCounselorMonthNum,
              },
              {
                name:'合计',
                addToday:item.totalAddDayNum,
                fenToday:item.totalCounselorDayNum,
                addMonth:item.totalAddMonthNum,
                fenMonth:item.totalCounselorMonthNum,
              }],
              name:item.userName
            }
            Arr.push(obj)
          });
          console.log(Arr)
          this.cooperatorArr = Arr
        });
      }
      if(i == 3 || i == -1){
        api.getSalesList4().then(res => {
          this.loading = false
          console.log(res,'getSalesList4')
          this.signedInTenDaysList = res.data;
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 4) {
        return "my-total";
      }
      return "";
    },
    close(){
      this.$emit("close")
    },
  }
}
</script>

<style lang="scss" scoped>
.board_top{
  padding:0 20px;
  display: flex;
  align-items: center
}
.board_item{
  display:flex;
  justify-content: space-between;
  padding:15px 10px;
  margin:10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  .board_item_name{
    overflow: hidden;
    white-space: nowrap;
  }
  .colorA{
    color:#c32e47;
  }
  .colorB{
    color:#409EFF;
  }
  .colorC{
    color:#E6A23C;
  }
  .colorD{
    color:#67C23A;
  }
}
::v-deep .my-total{
  font-weight: 900;
}
</style>
