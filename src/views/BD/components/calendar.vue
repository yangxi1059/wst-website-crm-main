<!--
 * @Author: 库建华
 * @Date: 2020-07-01 20:51:27
 * @LastEditors: 库建华
 * @LastEditTime: 2020-07-02 11:08:29
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="日历表" :visible.sync="calendarVisible" width="1400px" :before-close="close">
      <el-calendar v-model="selectDate">
        <template slot="dateCell" slot-scope="{date, data}">
          <div class="calendar-box" @click="changeDay(data)">
            {{new Date(date).getDate()}}日
            <!-- {{data}} -->
            <div
              @click.stop="viewDetail(data.day)"
              class="calendar-content"
              v-for="(item,i) in tableData[data.day]"
              :key="i"
            >
              <p class="activity-item">[{{item.activityStatusName}}]{{item.activityName}}</p>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
      :title="'日程表:'+day"
      :visible.sync="detailVisible"
      width="800px"
      :before-close="detailClose"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item,i) in detailData"
          :key="i"
          :timestamp="item.activityBeginTime"
          placement="top"
          :color="activityColor[item.activityStatus]"
        >
          <el-card>
            <h4>[{{item.activityStatusName}}]{{item.activityName}}</h4>
            <p>{{item.activityAddr}}</p>
            <p>{{item.activityResponsiblePersonName}}</p>
            <p>{{item.activityBeginTime}}~{{item.activityEndTime}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/bd.js";
export default {
  name: "calendar",
  props: {
    calendarVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: {},
      selectDate: new Date(),
      detailData: {},
      detailVisible: false,
      activityColor: {
        not_audit: "#BAD9F9",
        prepare: "#95C4F5",
        execute: "#62AAF5",
        finish: "#3595F9"
      },
      month: "",
      day: ""
    };
  },
  watch: {
    calendarVisible: function(v) {
      if (v) {
        this.selectDate = new Date();
      }
    },
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
  mounted() {},
  methods: {
    Topage() {
      let params = {
        month: this.month
      };
      api.getCalendarData(params).then(res => {
        console.log(res.data);
        this.tableData = res.data;
      });
    },
    close() {
      this.$emit("close");
    },
    viewDetail(day) {
      console.log(day);
      this.day = day;
      this.detailData = this.tableData[day];
      this.detailVisible = true;
    },
    detailClose() {
      this.detailVisible = false;
    },
    changeDay(data) {
      console.log(data, this.selectDate);
      let month = data.day.slice(0, 7);
      if (this.month !== month) {
        this.month = month;
        this.Topage();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar-box {
  overflow: hidden;
  height: 73px;
}
.calendar-content {
  padding-left: 10px;
}
.activity-item {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>