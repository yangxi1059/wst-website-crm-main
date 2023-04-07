<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <!-- <el-input
            class="mr10"
            size="mini"
            style="width:250px"
            v-model="search"
            clearable
            placeholder="支持姓名、微信名、微信ID"
            @keyup.enter.native="Topage(1)"
          ></el-input>-->
          <el-date-picker
            v-model="myDate"
            class="mr10"
            type="daterange"
            size="mini"
            :unlink-panels="true"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @keyup.enter.native="Topage()"
          ></el-date-picker>
          <el-select class="mr10" size="mini" filterable v-model="userId" placeholder="请选择" @change="Topage(1)">
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
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
        :data="tableData"
        size="mini"
        highlight-current-row
        :max-height="tableHeight"
        style="width: 100%"
      >
        <el-table-column prop="wxId" align="center" label="学生微信ID"></el-table-column>
        <el-table-column prop="wxName" align="center" label="微信名"></el-table-column>
        <el-table-column prop="parentWx1" align="center" label="家长一微信ID"></el-table-column>
        <el-table-column prop="parentWxName1" align="center" label="家长一微信名"></el-table-column>
        <el-table-column prop="parentWx2" align="center" label="家长二微信ID"></el-table-column>
        <el-table-column prop="parentWxName2" align="center" label="家长二微信名"></el-table-column>
        <!-- <el-table-column prop="realName" align="center" label="学生名"></el-table-column> -->
        <el-table-column prop="endDate" align="center" label="follow截止日期" min-width="100"></el-table-column>
        <el-table-column prop="followByName" align="center" label="follow人" min-width="100"></el-table-column>
        <el-table-column prop="schoolChiName" align="center" label="学校" min-width="100"></el-table-column>
        <el-table-column prop="finishYear" align="center" label="Graduation Year" min-width="100"></el-table-column>
        <el-table-column prop="countryName" align="center" label="国家" min-width="100"></el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from "@/api/sales_assistant";
import mixins from "@/plugin/mixins";
import { mapState } from 'vuex';
export default {
  name:"SalesNoFollowedList",
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data: () => {
    return {
      loading:false,
      myDate: [],
      userId: "ALL",
      users: [],
      total: 0,
      pageNum: 1,
      pageSize:50,
      tableHeight:"auto",
      tableData: []
    };
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted() {
    api.subordinate(this.userInfo.userId, "sales").then(({ data }) => {
      console.log("获取用户列表", data);
      let users = [
        { userId: "ALL", userName: "ALL" }
        // { userId: this.userInfo.userId, userName: this.userInfo.userName }
      ];
      if (this.roleInfo.includes(`sales_no_follow_up_all_data`)) {
        users.unshift({ userId: "ALL_Data", userName: "ALL（全部数据）" });
      }
      data.forEach(e => {
        if (!users.some(em => em.userId == e.userId)) {
          users.push(e);
        }
      });
      this.users = users;
    });
    this.Topage();
  },
  methods: {
    Topage() {
      let params = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        beginDate: this.myDate && this.myDate[0],
        endDate: this.myDate && this.myDate[1],
        position: "sales"
      };
      this.loading = true
      console.log(params,'yx筛选条件*****************')
      api.getNofollowList(params).then(res => {
        this.loading = false
        console.log("未follow列表", res.data);
        this.total = res.data.total;
        this.tableData = res.data.rows;
      });
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.Topage(this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.Topage(this.pageNum);
    }
  }
};
</script>

<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%;
}
</style>