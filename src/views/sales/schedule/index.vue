
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <el-calendar v-model="selectDate">
        <template slot="dateCell" slot-scope="{date, data}">
          <div class="calendar-box">
            {{new Date(date).getDate()}}日 ({{workDay[data.day] && workDay[data.day].filter(v=>v.weekdayStatus == 1).length || 0}}人值班)
            <!-- {{data.day}} -->
            <div class="activity-item" v-if="workDay[data.day]" @click="view(data.day)">
              <p
                v-for="item in workDay[data.day]"
                :key="item.pkId"
              >{{item.userName}}({{weekdayStatus[item.weekdayStatus]}})</p>
            </div>
          </div>
        </template>
      </el-calendar>
      <el-drawer
        :size="size"
        :title="day"
        :visible.sync="editVisible"
        :direction="direction"
        :before-close="close"
      >
        <el-card class="m10">
          <div>
            <el-row>
              <el-col :span="12" class="_item-name" v-for="item in itemData" :key="item.pkId">
                <el-switch
                  class="mr10"
                  v-model="item.weekdayStatus"
                  active-text=""
                  inactive-text=""
                  active-value="1"
                  inactive-value="0"
                  @change="changeWorkStatus(item)"
                ></el-switch>
                {{item.userName
                }} ({{item.office}})
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-drawer>
    </div>
  </d2-container>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/sales_assistant.js";
export default {
  mixins: [mixins],
  name: "SalesSchedule",
  data() {
    return {
      height: document.documentElement.clientHeight - 120,
      office_list: [],
      salesList: [],
      office: null,

      loading: false,
      editVisible: false,
      itemData: [],
      workDay: {},
      widths: "250px",
      size: "750px",
      todayData: "",
      direction: "rtl",
      month: "",
      day: "",
      selectDate: new Date(),
      weekdayStatus: {
        1: "值班",
        0: "休息"
      },
      choose: [1],
      choose2: [1]
    };
  },
  watch: {
    selectDate: function(v) {
      let dd = new Date(v);
      let month =
        dd.getFullYear() + "-" + ("0" + (dd.getMonth() + 1)).slice(-2);
      console.log(dd, month);
      if (month !== this.month) {
        this.month = month;
        this.Topage();
      }
    }
  },
  mounted() {
    let date = new Date();
    this.todayData =
      date.getFullYear() +
      "年" +
      (date.getMonth() + 1) +
      "月" +
      date.getDate() +
      "日";
    this.month =
      date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2);
    // this.init();
    this.Topage();
  },
  methods: {
    Topage() {
      let params = {
        month: this.month
      };
      this.loading = true;
      api.getSalesWeekly(params).then(res => {
        console.log("workDay", res);
        this.workDay = res.data;
        this.loading = false;
      });
    },
    close() {
      this.itemData = [];
      this.office = '';
      this.editVisible = false;
    },
    view(v) {
      this.day = v;
      this.itemData = [...this.workDay[v]];
      console.log(v, this.itemData);
      this.editVisible = true;
    },
    changeWorkStatus(v){
      console.log(v);
      let data = [{
        pkId:v.pkId,
        userId:v.userId,
        date:this.day,
        weekdayStatus:v.weekdayStatus,
      }];
      api.uptSalesWeekly(data).then(() => {
        this.$message({
          type: "success",
          message: "更新成功"
        });
        this.Topage();
      });
    },
  }
};
</script>
<style scoped>
.activity-item {
  height: 55px;
  overflow: hidden;
}
</style>
