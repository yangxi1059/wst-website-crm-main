<!--
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-08 13:18:47
 * @Version: 
 * @Description: 
-->
<template>
  <div>
    <el-drawer
      :title="`VIP项目到期统计`"
      :visible.sync="vipDeadlineVisible"
      size="1000px"
      :before-close="close"
    >
      <div class="pl10">
        <div class="search_page">
            <div class="search">
                <el-date-picker
                class="mr10"
                v-model="fromDate"
                :clearable="false"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                placeholder="选择起始日期">
                </el-date-picker>
                <el-date-picker
                v-model="toDate"
                class="mr10"
                type="date"
                :clearable="false"
                size="small"
                value-format="yyyy-MM-dd"
                placeholder="选择截止日期">
                </el-date-picker>
                <el-select
                v-model="user"
                class="mr10"
                size="small"
                :style="{width:'160px'}"
                >
                <el-option
                    v-for="(item,i) in userList"
                    :key="i"
                    :label="item.userName"
                    :value="item.userId"
                ></el-option>
                </el-select>
                <el-button
                  icon="el-icon-search"
                  class="mr10"
                  size="small"
                  plain
                  @click="initPage()"
                >GO</el-button>
            </div>
            <div class="mr20">共 {{consultingData.length}} 条</div>
        </div>
        <el-table
          stripe
          :data="consultingData"
          v-loading = "pictLoading"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
          <el-table-column
            width="200"
            label="项目名称"
            prop="programName"
          >
          </el-table-column>
          <el-table-column
            label="学员名"
            prop="menteeName"
          >
          </el-table-column>
          <el-table-column
            label="微信ID"
            prop="wxId"
          >
          </el-table-column>
          <el-table-column
            label="微信名"
            prop="wxName"
          >
          </el-table-column>
          <el-table-column
            label="strategist"
            prop="strategistName"
          >
          </el-table-column>
          <el-table-column
            label="PM"
            prop="programManagerName"
          >
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop="startDate"
          >
          </el-table-column>
          <el-table-column
            label="结束时间"
            prop="extendedEndDate"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/vip.js";
import { mapState } from 'vuex';
export default {
  props: {
    vipDeadlineVisible: {
      type: Boolean,
      default: false
    },
  },
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data() {
    return {
        pageNum:1,
        pageSize:9999,
        user: "ALL",
        fromDate:'',
        toDate:'',
        userId:'',
        userList: [],
        consultingData:[],
        pictLoading: false
    };
  },
  watch: {
    vipDeadlineVisible: function(val) {
      if (val) {
        this.fromDate = this.getCurrentMonthFirst();
        this.init()
        this.initPage();
      }
    }
  },
  mounted() {
    this.fromDate = this.getCurrentMonthFirst();
    this.init()
    this.initPage();
  },
  methods: {
    init(){
      api.getVIPList().then(res => {
        console.log(res,'yx****************')
        this.userList = res.data;
        this.userList.unshift({ userId: "ALL", userName: "ALL（本人及下属）" });
        if (this.roleInfo.includes("vip_mentee_all_mentee_data")) {
          this.userList.unshift({
            userId: "ALL_Data",
            userName: "全数据"
          });
        }
      });
    },
    initPage() {
      if(new Date(this.fromDate) >= new Date(this.toDate)){
        this.$message({
          type: 'warning',
          message: '起始日期不能大于截止日期'
        });
        return
      }
      this.pictLoading = true;
      let data = {
          fromDate: this.fromDate,
          toDate: this.toDate,
          userId: this.user,
      }
      console.log(data)
      api.getVipDeadlineData(data).then(res => {
        console.log(res)
        let data = res.data;
        this.consultingData = data;
        this.pictLoading = false;
      })
    },
    close() {
      this.consultingData = [];
      this.user = "ALL";
      this.fromDate = '';
      this.toDate = '';
      this.userId = '';
      this.userList = [];
      this.$emit("close");
    },
    getCurrentMonthFirst(){
        var date = new Date();
        date.setDate(1);
        var month = parseInt(date.getMonth()+1);
        var day = date.getDate();
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return date.getFullYear() + '-' + month + '-' + day;
    },
    handleSizeChange(){

    },
    handleCurrentChange(){

    }
  }
};
</script>

<style lang="scss" scoped>
</style>

