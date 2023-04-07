<!--
 * @Author: 库建华
 * @Date: 2020-01-15 14:12:16
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-22 16:28:01
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container >
    <div class="feedback" v-loading="loading">
      <div class="search_page">
        <div class="search">
          <el-date-picker
            v-model="applySeason"
            class="mr10"
            size="mini"
            value-format="yyyy"
            type="year"
            @change="Topage(1)"
            placeholder="请选择ApplySeason"
          ></el-date-picker>
          <el-select
            class="mr10"
            size="mini"
            v-model="division1"
            clearable
            filterable
            placeholder="请选择Division"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in division"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            v-model="location"
            clearable
            filterable
            placeholder="请选择Location"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in city"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
          <el-button icon="el-icon-edit" class="mr10" size="mini" plain v-if="roleInfo.includes('interview_history_add')" @click="addInterview()">新增</el-button>
  
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="offerList"
        size="mini"
        highlight-current-row
        border
      >
        <el-table-column align="center" prop="menteeName" label="编辑" min-width="50px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="el-icon-edit"
              v-if="roleInfo.includes('interview_history_edit')"
              @click="edit(scope.row)"
              title="编辑"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName" label="Mentee"></el-table-column>
        <el-table-column align="center" prop="companyName" label="Company"></el-table-column>
        <el-table-column align="center" prop="divisionName" label="Division"></el-table-column>
        <el-table-column align="center" prop="interviewDate" label="面试时间"></el-table-column>
        <el-table-column align="center" prop="schoolName" label="学校"></el-table-column>
        <el-table-column align="center" prop="applySeason" label="Apply Season"></el-table-column>
        <el-table-column align="center" prop="cityName" label="城市"></el-table-column>
      </el-table>
      <interviewHistory :offerData="offerData" :settingVisible="settingVisible" @close="closeDetail" @submit="submitInterview"></interviewHistory>
    </div>
  </d2-container>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/vip.js";
import apiDic from "@/api/dictionary.js";
import interviewHistory from './components/checkInterviewHistory.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: "feedback",
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components:{interviewHistory},
  data() {
    return {
      offerList: [],
      pageNum: 1,
      total: 0,
      division: [],
      pageSize: 400,
      applySeason: null,
      location: null,
      division1: null,
      schools: [],
      city: [],
      loading: false,
      widths: "250px",
      settingVisible: false,
      offerData:{}
    };
  },

  mounted() {
    api.getCompanyList().then(res => {
      console.log("company", res);
      this.company = res.data;
    });
    this.pageInit()
    this.init();
    this.Topage(1);
  },
  methods: {
    init() {
      let params = {
        pageNum: 1,
        pageSize: 9999
      };
      apiDic.getSchoolDicList(params).then(res => {
        console.log(res);
        this.schools = res.data.rows;
      });
    },
    async pageInit () {
      // 获取用户组内成员列表
      this.city = await this.getDictionary('city')
      this.division = await this.getDictionary('division')
    },
    Topage() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applySeason: this.applySeason,
        location: this.location,
        division: this.division1
      };
      console.log("offer列表参数", this.division, params);
      this.loading = true
      api.getHistoryList(params).then(res => {
        console.log("offer列表", res);
        this.offerList = res.data.rows;
        this.total = res.data.total;
        this.loading = false
      });
    },
    addInterview(){
      this.offerData = {};
      this.settingVisible = true;
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.Topage(this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.Topage(this.pageNum);
    },
    edit(data){
      console.log(data)
      this.offerData = data;
      this.settingVisible = true;
    },
    closeDetail(){
      this.settingVisible = false;
    },
    submitInterview(){
      this.settingVisible = false
      this.Topage()
    }
  }
};
</script>

<style lang="scss" scoped>
</style>