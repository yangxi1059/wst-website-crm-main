<!--
 * @Author: 杨曦
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-23 17:57:04
 * @Version: 
 * @Description: 
-->
<template>
  <div>
    <el-drawer
      :title="`VIP签约拉群公示栏`"
      :visible.sync="vipShowVisible"
      size="50%"
      class="yx_my_select"
      :append-to-body="true"
      :before-close="close"
    >
      <div style="margin:0 20px">
        <div class="board_top mb10">
          <div class="mr10" >本周期总计 {{countTotal}}</div>
          <el-button type="primary" icon="el-icon-refresh" @click="init()">刷新</el-button>
        </div>
         <ul v-loading="pictLoading" >
          <li class="board_item"  v-for="(item,i) in tableList" :key="i">
            <div class="board_item_name">{{item.userName}}</div>
            <div class="">
              <span class="colorA mr20" v-if="item.dayArr && item.dayArr.length > 0" >
                <el-button size="meduim" @click="detailArr(item.dayArr)" type="text">{{item.dayArr?item.dayArr.length:0}}(今日拉群签约项目)</el-button>
              </span>
              <span class="colorA mr20" v-else>{{item.dayArr?item.dayArr.length:0}}(今日拉群签约项目)</span>
              <span class="colorA" v-if="item.monthArr && item.monthArr.length > 0">
                <el-button size="meduim" @click="detailArr(item.monthArr)" type="text"> {{item.monthArr?item.monthArr.length:0}}(本周期拉群签约项目)</el-button>
              </span>
              <span class="colorA" v-else>{{item.monthArr?item.monthArr.length:0}}(本周期拉群签约项目)</span>
            </div>
          </li>
        </ul>
      </div>
    </el-drawer>
    <el-dialog
      :title="`签约详情`"
      :visible.sync="detailVisible"
      width="1200px"
      :before-close="detailClose"
      :close-on-click-modal="false"
    >
        <el-table
          :data="tableDetail"
          v-loading = "pictLoading2"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
          <el-table-column show-overflow-tooltip label="订单ID" prop="orderId"></el-table-column>
          <el-table-column show-overflow-tooltip label="学院名" prop="menteeName"></el-table-column>
          <el-table-column show-overflow-tooltip label="项目名" prop="programName"></el-table-column>
          <el-table-column show-overflow-tooltip label="PM" prop="pmName"></el-table-column>
          <el-table-column show-overflow-tooltip label="Strategist" prop="strategistName"></el-table-column>
          <el-table-column show-overflow-tooltip label="拉群日期" prop="vipGroupDate"></el-table-column>
          <el-table-column show-overflow-tooltip label="签约日期" prop="signDate"></el-table-column>
          <el-table-column show-overflow-tooltip label="联系人" prop="contactName"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/vip.js";
import { mapState } from 'vuex';
export default {
  props: {
    vipShowVisible: {
      type: Boolean,
      default: false
    },
    vipShowStatus:{
      type: Number,
      default: 0
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
  mixins: [mixins],
  data() {
    return {
      tableList:[],
      pictLoading: false,
      pictLoading2: false,
      detailVisible: false,
      countTotal: 0,
      tableDetail: [],
    };
  },
  watch: {
    vipShowVisible: function(val) {
      if (val) {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    init(){
      this.pictLoading = true
      api.getAllot().then(res => {
        console.log(res.data)
        this.countTotal = res.data.signArr.length || 0
        this.tableList = res.data.userArr
        this.pictLoading = false
      })
    },
    close() {
      this.clear()
      this.$emit("close");
    },
    clear(){
      this.tableList = []
    },
    detailArr(data){
      if(this.vipShowStatus == 0){
        this.detailVisible = true
        this.tableDetail = data
        console.log(data)
      }
    },
    detailClose(){
      this.tableDetail = []
      this.detailVisible = false
    }
  }
};
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
    line-height: 40px;
    white-space: nowrap;
  }
  .colorA{
    color:#c32e47;
    line-height: 40px;
  }
  .colorB{
    color:#409EFF;
    line-height: 40px;
  }
  .colorC{
    color:#E6A23C;
    line-height: 40px;
  }
  .colorD{
    color:#67C23A;
  }
}
::v-deep .my-total{
  font-weight: 900;
}
</style>


