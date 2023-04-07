<!--
 * @Author: 杨曦
 * @Date: 2022-01-06 14:05:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 16:48:39
 * @Version:
 * @Description:
-->
<!--
 * @Author: 杨曦
 * @Date: 2019-04-23 14:14:08
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-09-26 18:01:13
 * @Version:
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="mentee">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-if="roleInfo.includes('mentee_file')" label="规划导师文书修改" name="first">
            <div class="search_page">
            <div class="search">
                <el-input
                class="mr10"
                v-if="roleInfo.includes(`mentee_file_search`)"
                size="mini"
                v-model="search"
                clearable
                placeholder="支持：学员名 项目名 文书名"
                @keyup.enter.native="Topage(1)"
                :style="{width:'160px'}"
                ></el-input>
                <mySelect
                :role="role"
                ref="childMethod"
                :userId="user"
                @change="changeSelect"
                />
                <el-button
                icon="el-icon-search"
                class=""
                size="mini"
                v-if="roleInfo.includes(`mentee_file_search`)"
                plain
                @click="Topage(1)"
                >GO</el-button>
                <el-button
                v-if="roleInfo.includes(`mentee_file_add`)"
                icon="el-icon-edit-outline"
                class=""
                size="mini"
                plain
                @click="setFile"
                >修改文书</el-button>
                <el-button
                v-if="roleInfo.includes(`mentee_file_statistics`)"
                class=""
                size="mini"
                plain
                @click="statistics"
                >统计</el-button>
            </div>
            <pagination
                v-if="roleInfo.includes(`mentee_file_page`)"
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
            >
            <el-table-column align="center" label="详情">
                <template slot-scope="scope">
                <el-button
                    type="text"
                    size="mini"
                    @click="toDetail(scope.row)"
                    class="el-icon-tickets"
                >详 情</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="menteeName" label="学员名"></el-table-column>
            <el-table-column align="center" prop="wxId" label="学员微信"></el-table-column>
            <el-table-column align="center" prop="programName" label="购买项目" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="strategistName" label="全职导师" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="servicesName" label=" Manager" show-overflow-tooltip></el-table-column>
            <el-table-column
                align="center"
                prop="applicationLetterNum"
                label="对应学员的第几次修改"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                align="center"
                prop="applicationLetterModify"
                label="项目文书修改"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                <span v-if="scope.row.applicationLetterModify == -1">∞</span>
                <span v-else>{{scope.row.applicationLetterModify}}</span>

                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="applicationLetterModifyDone"
                label="已修改次数"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="createByName" label="文书修改人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" label="文书修改时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="strategistName" label="实习进度">
                <template slot-scope="scope">
                <p>{{scope.row.internshipEndNum}}/{{scope.row.internshipNum}}</p>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="latestSignDate" label="最近订单"></el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="roleInfo.includes('mentee_file_mentor')" label="行业导师文书修改" name="second">
            <div class="search_page yx_my_select">
                <div class="search">
                <mySelect
                    :role="role2"
                    :userId="user2"
                    ref="childMethod"
                    @change="changeSelect2"
                    :showStatus="showStatus"
                />
                <el-select
                    v-model="taskStatus"
                    class="mr10 "
                    size="mini"
                    filterable
                    clearable
                    placeholder="taskStatus"
                    :style="{width:'120px'}"
                >
                    <el-option
                    v-for="(item,i) in taskStatusList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                    ></el-option>
                </el-select>
                <el-button
                    icon="el-icon-search"
                    size="mini"
                    plain
                    @click="Topage(1)"
                >GO</el-button>
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
                :data="tableData2"
                size="mini"
                highlight-current-row
            >
                <el-table-column align="center" prop="" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="detail(scope.row)">详情</el-button>
                </template>
                </el-table-column>
                <el-table-column align="center" prop="mentorName" label="导师名"></el-table-column>
                <el-table-column align="center" prop="menteeName" label="学员名"></el-table-column>
                <el-table-column align="center" prop="resumeTypeName" label="简历类型"></el-table-column>
                <el-table-column align="center" prop="" label="金额">
                <template slot-scope="scope">
                    <span  >{{scope.row.taskFundType =='usd'?'$':'￥'}}{{scope.row.taskFundWage}}</span>
                </template>
                </el-table-column>
                <el-table-column align="center" prop="deadline" label="截止日期"></el-table-column>
                <el-table-column align="center" prop="taskStatusName" label="状态"></el-table-column>
            </el-table>
        </el-tab-pane>
        </el-tabs>
    </div>
    <add
    :addVisible="addVisible"
    :signId="signId"
    :menteeName="menteeName"
    @close="addClose"
    @submit="addSubmit"
    ></add>
    <detail :applyData="applyData"  :menteeFileVisible="menteeFileVisible" @close="detailClose"></detail>
    <detailApplication :taskId="taskId" :showApply="showApply" :showApply2="showApply2" :detailVisible="detailVisible" @close="detailApplicationClose" @update="updateApplication"></detailApplication>
    <statistics :statisticsVisible="statisticsVisible" :user="user" @close="statisticsClose"></statistics>
    <el-dialog
        :title="'学生项目列表'"
        :close-on-click-modal="false"
        :visible.sync="menteeListVisible"
        width="1000px"
        :before-close="menteeListClose"
    >
    <el-table :data="menteeList" size="mini">
        <el-table-column align="center" prop="mentorType" label="修改文书">
        <template slot-scope="scope">
            <el-button
            icon="el-icon-plus"
            class="mr10"
            size="mini"
            v-if="roleInfo.includes(`mentee_file_add`)"
            plain
            @click="toAddMenteeFile(scope.row.signId)"
            >新增</el-button>
        </template>
        </el-table-column>
        <el-table-column align="center" prop="wxId" label="微信id"></el-table-column>
        <!-- <el-table-column align="center" prop="wxName" label="微信名"></el-table-column> -->
        <el-table-column align="center" prop="programName" label="项目名"></el-table-column>
        <el-table-column align="center" prop="signDate" label="Sign Date"></el-table-column>
        <el-table-column align="center" prop="strategistName" label="全职导师"></el-table-column>
        <el-table-column align="center" prop="servicesName" label="Manager"></el-table-column>
    </el-table>
    </el-dialog>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import { downloadFun, downloadFunD } from '@/libs/file'
import mySelect from '@/components/my-select.vue'
import { mapState } from 'vuex'

import detail from '../../apply_audit/mentee_file/detail.vue'
import add from './components/add_mentee_file.vue'
import detailApplication from '../mentee_file_mentor/detail.vue'
import statistics from './components/statistics.vue'
import D2ContainerCard from '@/components/d2-container/components/d2-container-card.vue'

export default {
  components: {
    statistics,
    detail,
    add,
    mySelect,
    detailApplication
  },
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
      pageSize: 400,
      showStatus: true,
      taskId: '',
      detailVisible: false,
      editVisible: false,
      search: '',
      activeName: 'first',
      userList: [],
      user: '',
      user2: '',
      groupId: '',
      groupId2: '',
      pageNum: 0,
      total: 0,
      loading: false,
      tableData: [{}],
      tableData2: [],
      taskStatus: '',
      menteeName: '',
      menteeList: [],
      menteeListVisible: false,
      taskStatusList: [],
      signId: '',
      addVisible: false,
      showApply: false,
      showApply2: false,
      role: '0',
      role2: '0',
      applyId: '',
      applyData: {},
      statisticsVisible: false,
      menteeId: '',
      menteeFileVisible: false,
      menteeData: { menteeId: '' }
    }
  },
  mounted () {
    this.user = this.userInfo.userId
    this.user2 = this.userInfo.userId
    this.activeName = this.roleInfo.includes('mentee_file') ? 'first' : 'second'
    this.Topage(1)
    this.role = this.roleInfo.includes('mentee_file_all_data') ? '1' : '0'
    this.role2 = this.roleInfo.includes('mentee_file_mentor_all_data') ? '1' : '0'
    if (this.roleInfo.includes('mentee_file_select')) {
      this.getVIPList()
    }
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.taskStatusList = await this.getDictionary('application_letter_task_status')
    },
    getVIPList () {
      api
        .getMentorList({ pageNum: 1, pageSize: 10000, mentorStatus: '0' })
        .then(res => {
          sessionStorage.setItem('mentor', JSON.stringify(res.data.rows))
        })
        .catch(err => {
          console.log(err)
        })
    },
    Topage () {
      console.log(this.activeName)
      if (this.activeName == 'first') {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          search: this.search,
          userId: this.user,
          groupId: this.groupId
        }
        this.loading = true
        api.getMenteeFileList(params).then(res => {
          console.log(res, 222222222222222222222)
          this.tableData = res.data.rows
          this.total = res.data.total
          this.loading = false
        })
      } else {
        const params2 = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          mentorId: '',
          menteeId: '',
          taskStatus: this.taskStatus,
          sortCol: '',
          userId: this.user2,
          groupId: this.groupId2,
          sort: '',
          signId: ''
        }
        this.loading = true
        api.getApplicationLetterTask(params2).then(res => {
          console.log(res)
          this.tableData2 = res.data.rows
          this.total = res.data.total
          this.loading = false
        })
      }
    },
    toDetail (v) {
      console.log(v)
      this.applyId = v.applyId
      this.applyData = { applyId: v.applyId }
      this.menteeFileVisible = true
    },
    detailClose () {
      this.menteeFileVisible = false
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    setFile () { // 选中学员修改文书
      this.$prompt('请输入学员名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.menteeName = value || ''
        api
          .getFileMenteeListByMenteeName(value || '')
          .then(res => {
            console.info(res)
            this.menteeList = res.data
            console.info(this.menteeList)
            this.menteeListVisible = true
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '查无此人'
            })
          })
      })
    },
    menteeListClose () {
      this.menteeListVisible = false
      this.menteeList = []
    },
    toAddMenteeFile (signId) {
      this.signId = signId
      this.addVisible = true
      console.log(this.signId, this.menteeName)
    },
    addClose () {
      this.addVisible = false
    },
    addSubmit () {
      this.Topage(this.pageNum)
      this.addClose()
    },
    statistics () {
      this.statisticsVisible = true
    },
    statisticsClose () {
      this.statisticsVisible = false
    },
    changeSelect (data) {
      this.groupId = data.groupId
      this.user = data.user
    },
    changeSelect2 (data) {
      this.groupId2 = data.groupId
      this.user2 = data.user
    },
    handleClick (tab, event) {
      this.pageNum = 1
      this.search = ''
      this.taskStatus = ''
      this.Topage()
    },
    detail (data) {
      this.taskId = data.taskId
      this.showApply = false
      this.showApply2 = false
      this.detailVisible = true
    },
    detailApplicationClose () {
      this.detailVisible = false
    },
    preview (path) {
      downloadFun(path, url => {
        window.open(url)
      })
    },
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },
    edit (data) {
      this.taskId = data.taskId
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editVisible = false
      this.Topage()
    },
    deleteIt (data) {
      this.$confirm('此操作将永久删除此文书修改任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delApplicationLetterTask(data.taskId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.Topage()
        })
      })
    },
    apply (data) {
      this.taskId = data.taskId
      this.showApply = true
      this.showApply2 = false
      console.log(data, this.showApply)
      this.detailVisible = true
    },
    applyRebate (data) {
      this.taskId = data.taskId
      this.showApply = false
      this.showApply2 = true
      console.log(data, this.showApply)
      this.detailVisible = true
    },
    updateApplication () {
      this.Topage()
    },
    toConnect (data) {
      api.getApplicationLetterAr(data.taskId).then(res => {
        console.log(res)
        const imageHtml = `<div style="width: 100%; height: 200px;text-align:center">
                          <img
                          style="width: 200px; height: 200px"
                          src="${res.data}"/>
                        </div>
                        <div style="text-align:center;color:#409EFF;margin-top:20px" >请截图后分享给导师</div>`

        this.$alert(imageHtml, '导师小程序文书修改任务邀请码', {
          showConfirmButton: false,
          dangerouslyUseHTMLString: true
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mentee-project {
  width: 230px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
