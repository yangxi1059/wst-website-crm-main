<!--
 * @Author: kaan
 * @Date: 2021-12-29 13:29:29
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-03 14:55:08
 * @Version: 
 * @Description: 
-->
<template>
  <d2-container >
    <div class="d2_container" ref="d2" v-loading="loading">
      <div class="mentee_tabs" ref="tabs">
        <el-button type="" @click="showAssignmentBoard(0)">顾问分配</el-button>
        <el-button v-if="roleInfo.includes(`sales_assistant_ineffectiveNum`) || roleInfo.includes(`sales_assistant_totalNum`) || roleInfo.includes(`sales_assistant_ConversionRate`)"
          type="" @click="showAssignmentBoard(1)" >助理拉群</el-button>
        <el-button type="" @click="showAssignmentBoard(2)">BD渠道</el-button>
        <el-button type="" v-if="roleInfo.includes(`sales_assistant_entry`)" @click="menteeInput">学员录入</el-button>
        <el-button type="" @click="followup">今日跟进</el-button>
        <el-button type="" @click="showAssignmentBoard(3)">十日签约</el-button>
      </div>
      <div class="search_page " ref="search">
        <div class="search">
          <el-select
            class="mr10 mb10"
            filterable
            v-model="userId"
            placeholder="请选择导流微信管理人"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-input
            class="mr10 mb10"
            v-if="roleInfo.includes(`sales_assistant_search`)"
            style="width:250px"
            v-model="search"
            clearable
            placeholder="支持姓名、微信名、微信ID、家长微信ID"
          ></el-input>
          <el-select
            class="mr10 mb10"
            filterable
            v-model="counselorStatus"
            placeholder="顾问分配"
          >
            <el-option
              v-for="item in [{itemName:'ALL',itemValue:''},{itemName:'未分配顾问',itemValue:'0'},{itemName:'已分配顾问',itemValue:'1'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
            v-if="roleInfo.includes(`sales_assistant_search`)"
            icon="el-icon-search"
            class="mr10 mb10"
            plain
            @click="Topage(1)"
          >GO</el-button>
          <el-button
            icon="el-icon-printer"
            v-if="roleInfo.includes(`sales_assistant_outFile`)"
            @click="exportExcel"
            plain
          >导出</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`sales_assistant_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table 
        :data="menteeList"
        :max-height="tableHeight"
        highlight-current-row
        @row-dblclick="toMenteeInfo"
        @sort-change="sortTable"
        border
      >
        <el-table-column align="center" label="序号" type="index" fixed="left" width="50"></el-table-column>
        <el-table-column align="center" prop="wxName" label="微信名" fixed="left" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="wxId" label="微信ID" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="menteeType" label="身份" width="70" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="parentWx1" label="家长一微信ID" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="parentWx2" label="家长二微信ID" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="telephone" label="电话"  show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="highSchoolName" label="学校（高中）" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="schoolName" label="学校（大学）" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="email" label="学校邮箱" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="degreeName" label="学历" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="finishYear" label="毕业年份" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="countryName" label="国家" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="consultingDirectionName" label="咨询方向" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="askFor" label="备注" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="signStatusName" label="签约状态" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="firstAskDate" label="首次联系日期" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="followUpDate" label="最近跟进日期" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="counselorName" label="分配顾问" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="counselorDate" label="分配顾问日期" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="intentionName" label="学员意向" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="sourceFrom" label="来源" :width="'100%'" sortable></el-table-column>
        <el-table-column align="center" prop="recommender" label="推荐人姓名" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="vipRecommendStatusName" label="是否VIP同事推荐" width="140" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="vipRecommenderName" label="VIP同事推荐人" width="130" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="sourceWx" label="导流微信号" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="specialNature" label="特殊性质（家长、讲座等）" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="counselorStatusName" label="是否分配顾问" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="counselorGroup" label="分配部门" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="canActivateStatusName" label="激活状态" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="note" label="咨询进度" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="creater" label="创建人" width="90" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="updater" label="最近修改人" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column align="center" prop="updateTime" label="最近操作时间" width="120" show-overflow-tooltip sortable></el-table-column>
      </el-table>
    </div>


    <StudentAssignmentBoard
      :assignmentBoardVisible="assignmentBoardVisible"
      :boardType="boardType"
      @close="assignmentBoardClose"
    />
    <MenteeInput
      v-if="menteeInputVisible"
      :menteeInputVisible="menteeInputVisible"
      @detail="toMenteeInfo"
      @close="menteeInputClose"
      @submit="menteeInputSubmit"
    />
    <MenteeInfo
      :menteeInfoVisible="menteeInfoVisible"
      :menteeId="menteeId"
      @close="menteeInfoClose"
    />

  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/assistant.js'
import apiUser from '@/api/user.js'
import { mapState } from 'vuex';
import StudentAssignmentBoard from './components/StudentAssignmentBoard'
import MenteeInput from './components/MenteeInput'
import MenteeInfo from './components/MenteeInfo'
export default {
  mixins: [mixins],
  name: "AssistantMentee",
  components:{StudentAssignmentBoard, MenteeInput,MenteeInfo},
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data() {
    return {
      loading:false,
      // 搜索栏数据
      userId:"ALL",
      users:[],
      search:"",
      counselorStatus:"",
      followUpIdNum:0,
      pageNum:1,
      pageSize:50,
      total:0,
      sort:"",
      sortCol:"",

      tableHeight:"auto",
      menteeList:[],
      assignmentBoardVisible:false,
      boardType:'',

      menteeInputVisible:false,
      menteeInfoVisible:false,
      menteeId:"",
    }
  },
  mounted() {
    this.pageInit();
    this.Topage(1)
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function(){
		    this.tableHeight = (this.$refs.d2.offsetHeight - this.$refs.tabs.offsetHeight - this.$refs.search.offsetHeight) +"px"
		  })
    }
  },
  methods: {
    pageInit(){
      const userInfo = this.$store.state.role.userInfo
      apiUser.subordinate(userInfo.userId, "sales_assistant").then(({ data }) => {
        let users = [
          { userId: "ALL", userName: "ALL（本人及下属）" },
          { userId: userInfo.userId, userName: userInfo.userName }
        ];
        if (this.roleInfo.includes(`sales_assistant_ALL_Data`)) {
          users.unshift({ userId: "ALL_Data", userName: "ALL（全部数据）" });
        }
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e);
          }
        });
        this.users = users;
      });
    },
    Topage(i){
      i == 1 ? this.pageNum = 1 : ''
      let data = {
        search: this.search,
        userId: this.userId,
        counselorStatus: this.counselorStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sort: this.sort,
        sortCol: this.sortCol,
        pageType: "sales_assistant"
      };
      this.loading = true
      api.getMenteeList(data).then((res) => {
        this.loading = false
        console.log(res,'列表数据yx******')
        this.total = res.data.total
        this.menteeList = res.data.rows
      })
    },
    exportExcel(){
      const fileName = '销售助理学员列表'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}mentee/list/assistant/export?search=${this.search}&userId=${this.userId}&counselorStatus=${this.counselorStatus}`+
        `&pageNum=${this.$pageNum}&pageSize=${this.$pageSize}&sortCol=&sort=`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = this.$store.state.role.token
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
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
    // 分页插件回调：页码，每页条数
    sortTable(v) {
      console.log(v.order, v.prop);
      const orderToSort = {
        ascending: "asc",
        descending: "desc"
      };
      this.sort = orderToSort[v.order] || null;
      this.sortCol = v.prop;
      this.Topage(1);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.Topage(this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.Topage(this.pageNum);
    },
    showAssignmentBoard(i){
      this.boardType = i
      this.assignmentBoardVisible = true
    },
    assignmentBoardClose(){
      this.assignmentBoardVisible = false
      this.boardType=""
    },
    /**
     * @description: 学员录入
     * @param {*}
     * @return {*}
     */    
    menteeInput(){
      this.menteeInputVisible = true
    },
    menteeInputClose(){
      this.menteeInputVisible = false
    },
    menteeInputSubmit(){
      this.menteeInputVisible = false
      this.Topage(1)
    },
    toMenteeInfo(data) {
      this.menteeId = data.menteeId
      this.menteeInfoVisible = true;
    },
    menteeInfoClose(){
      this.menteeInfoVisible = false;
    },
    followup(){
      this.$router.push({ path: '/assistant/mentee/follow' })
    }
  },
}
</script>

<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%;
  .mentee_tabs{
    padding-bottom:10px;
  }
}
</style>
