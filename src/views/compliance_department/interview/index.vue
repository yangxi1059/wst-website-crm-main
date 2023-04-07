<template>
  <d2-container v-loading="loading">
    <div class="interview">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10 mt5"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="支持面试者姓名、电话、微信"
            v-if="roleInfo.includes(`interview_user_search`)"
            clearable
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-date-picker
            style="width:150px"
            size="mini"
            class="mr10 mt5"
            v-model="fromDate"
            @change="Topage(1)"
            value-format="yyyy-MM-dd"
            placeholder="起始日期">
          </el-date-picker>
          <el-date-picker
            style="width:150px"
            size="mini"
            class="mr10 mt5"
            v-model="toDate"
            @change="Topage(1)"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>

          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="userId"
            clearable
            placeholder="角色"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="hireStatus"
            clearable
            placeholder="是否录用"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in interviewee_hire_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="arrivalStatus"
            clearable
            placeholder="是否到岗"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="interviewStatus"
            clearable
            placeholder="是否到面"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in interview_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="trainStatus"
            clearable
            placeholder="是否通过试用期"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="intervieweeResource"
            clearable
            placeholder="求职者来源"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in interviewee_resource"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10 mt5"
            style="width:150px"
            size="mini"
            filterable
            v-model="physicalExaminationStatus"
            clearable
            placeholder="是否预约体检"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-button
            icon="el-icon-search"
            class="ml0 mr10 "
            v-if="roleInfo.includes(`interview_user_search`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="ml0 mr10 "
            v-if="roleInfo.includes(`interview_user_new`)"
            size="mini"
            plain
            @click="newUser"
          >新增</el-button>
          <el-button
            icon="el-icon-plus"
            class="ml0 "
            v-if="roleInfo.includes(`interview_user_export`)"
            size="mini"
            plain
            @click="exportExcel"
          >导出</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`interview_user_page`)"
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
        style="width: 100%"
        ref="table"
        id="export_table"
      >
        <el-table-column min-width="130px" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`interview_user_edit`)"
              type="text"
              @click="editor(scope.row.intervieweeId)"
              title="编辑"
              class="el-icon-edit"
            ></el-button>
            <el-button
              v-if="(roleInfo.includes(`interview_user_entry`) && scope.row.arrivalStatus === '0' && scope.row.hireStatus == '1') || (roleInfo.includes(`interview_user_entry`) && !scope.row.arrivalStatus && scope.row.hireStatus == '1') "
              type="text"
              @click="entry(scope.row.intervieweeId)"
              title="一键到岗"
              class="el-icon-finished"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`interview_user_edit`)"
              type="text"
              @click="interviewerMsg(scope.row)"
              title="面试信息"
              class="el-icon-view"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`interview_user_edit`) && scope.row.checkStatus == '0' && scope.row.applyNum == '0' "
              type="text"
              @click="applyInterview(scope.row)"
              title="发起申请"
              class="el-icon-s-promotion"
            ></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="userId" min-width="100px" align="center" label="ID"></el-table-column> -->
        <el-table-column prop="checkStatusName" min-width="100px" align="center" label="审核状态"></el-table-column>

        <el-table-column prop="intervieweeName" min-width="100px" align="center" label="姓名"></el-table-column>
        <el-table-column prop="telephone" min-width="100px" align="center" label="电话号码"></el-table-column>
        <el-table-column prop="wxId" min-width="100px" align="center" label="微信"></el-table-column>
        <el-table-column prop="sex" min-width="100px" align="center" label="性别">
          <template slot-scope="scope">{{scope.row.sex === '1' ? '男' : '女'}}</template>
        </el-table-column>
        <el-table-column prop="age" min-width="100px" align="center" label="年龄"></el-table-column>
        <el-table-column prop="email" min-width="100px" align="center" label="邮箱">
          <template slot-scope="scope">
            <el-popover width="400" trigger="hover" :content="scope.row.email">
              <span class="w80" slot="reference">{{scope.row.email}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" min-width="100px" align="center" label="部门">
          <template slot-scope="scope">
            <el-popover width="400" trigger="hover" :content="scope.row.deptName">
              <span class="w80" slot="reference">{{scope.row.deptName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="position" min-width="100px" align="center" label="岗位"></el-table-column>
        <el-table-column prop="expectSalary" min-width="100px" align="center" label="期待薪资"></el-table-column>
        <!-- <el-table-column prop="seniority" min-width="100px" align="center" label="工龄"></el-table-column> -->
        <el-table-column prop="resume" min-width="180px" align="center" label="简历">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.resume" @click="viewResume(scope.row.resume)">预览</el-button>
            <el-button size="mini" v-if="scope.row.resume" @click="downResume(scope.row.resume)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="interviewStatusName" min-width="100px" align="center" label="到面状态"></el-table-column>
        <el-table-column prop="hireStatusName" min-width="100px" align="center" label="录用状态"></el-table-column>

        <el-table-column prop="arrivalStatus" min-width="100px" align="center" label="是否到岗">
          <template slot-scope="scope">{{scope.row.arrivalStatusName}}</template>
        </el-table-column>
        <el-table-column prop="trainStatusName" min-width="100px" align="center" label="是否通过试用期"></el-table-column>
        <el-table-column prop="physicalExaminationStatusName" min-width="100px" align="center" label="是否预约体检"></el-table-column>
        <el-table-column prop="physicalExaminationDate" min-width="100px" align="center" label="预约体检时间"></el-table-column>
        <el-table-column prop="interviewTime" min-width="100px" align="center" label="面试时间"></el-table-column>
        <el-table-column prop="arrivalDate" min-width="100px" align="center" label="到岗时间"></el-table-column>
        <el-table-column prop="manageByName" min-width="100px" align="center" label="邀约人"></el-table-column>

        <el-table-column prop="recommenderName" min-width="100px" align="center" label="推荐人">
          <template slot-scope="scope">
            <el-popover width="400" trigger="hover" :content="scope.row.recommenderName">
              <span class="w80" slot="reference">{{scope.row.recommenderName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="intervieweeResourceName" min-width="100px" align="center" label="邀约渠道"></el-table-column>
        <el-table-column prop="note" min-width="100px" align="center" label="备注"></el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false"
        :title="'到岗日期'"
        :visible.sync="arrivalVisible"
        width="400px"
        :before-close="arrivalClose"
      >
        <el-date-picker
          v-model="arriveDate"
          :clearable="false"
          :editable="false"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button @click="arrivalClose">取 消</el-button>
          <el-button type="primary" @click="arrivalSubmit">提 交</el-button>
        </span>
      </el-dialog>
      <editor
        :editVisible="editVisible"
        :intervieweeId="intervieweeId"
        @close="editClose"
        @submit="editSubmit"
      />
      <interviewerList :interviewerVisible="interviewerVisible" :intervieweeData="intervieweeData" @close="interviewerListClose" @submit="interviewerListSubmit"/>
      <add :addVisible="addVisible" @close="addClose" @submit="addSubmit" />
      <interviewApply :interviewApplyVisible="interviewApplyVisible" :intervieweeId="intervieweeId"  @close="interviewApplyClose" @submit="interviewApplySubmit" />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/hr'
import mixins from '@/plugin/mixins'
import axios from '@/api/sales_month_new'
import apiUser from '@/api/sales_assistant'

import editor from './components/interview_edit.vue'
import interviewerList from './components/interviewer_msg_list.vue'
import add from './components/interview_add.vue'
import interviewApply from './components/interviewerApply.vue'
import { downloadFun, downloadFunD } from '@/libs/file'
import { mapState } from 'vuex'

// 导出表格
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'interview',
  mixins: [mixins],
  components: { editor, add, interviewerList, interviewApply },
  data () {
    return {
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 400,
      search: '',
      interviewApplyVisible: false,
      intervieweeData: {},
      total: 0,
      selectMonth: '',
      month: [],
      users: [],
      userId: '',
      intervieweeResource: '',
      arrivalStatus: '',
      trainStatus: '',
      hireStatus: '',
      interviewStatus: '',
      interview_status: [],
      physicalExaminationStatus: '',
      fromDate: '',
      toDate: '',
      addVisible: false,
      editVisible: false,
      interviewerVisible: false,
      intervieweeId: null,
      arrivalVisible: false,
      arriveDate: '',
      interviewee_hire_status: [],
      interviewee_resource: [],
      common_yes_or_no:[],
    }
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  mounted () {
    this.userId = this.userInfo.userId
    this.Topage()
    apiUser.subordinate(this.userId, '').then(({ data }) => {
      const users = [
        // { userId: "ALL", userName: "ALL" },
        { userId: this.userInfo.userId, userName: this.userInfo.userName }
      ]
      data.forEach(e => {
        if (!users.some(em => em.userId == e.userId)) {
          users.push(e)
        }
      })
      this.users = users
      this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
      if (this.roleInfo.includes('interview_user_all_user')) {
        this.users.unshift({
          userId: 'ALL_Data',
          userName: '全数据'
        })
      }
    })
    this.pageInit()
    axios
      .salesHistoryMonth()
      .then(response => {
        console.log('销售kpi已统计月份数据：', response.data)
        this.month = response.data
        this.month.unshift('本月')
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    async pageInit () {
      this.interviewee_hire_status = await this.getDictionary('interviewee_hire_status')
      this.interview_status = await this.getDictionary('interview_status')
      this.interviewee_resource = await this.getDictionary('interviewee_resource')
      this.sex = await this.getDictionary('sex')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    Topage () {
      console.log(this.fromDate, this.toDate, 111111111)
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        hireStatus: this.hireStatus,
        arrivalStatus: this.arrivalStatus,
        trainStatus: this.trainStatus,
        interviewStatus: this.interviewStatus,
        intervieweeResource: this.intervieweeResource,
        physicalExaminationStatus: this.physicalExaminationStatus,
        manageBy: this.userId,
        fromDate: this.fromDate,
        toDate: this.toDate
      }
      this.loading = true
      api.getInterviewListNew(params).then(res => {
        console.log(res.data, 222222222222222)
        this.tableData = res.data.rows
        this.loading = false
        this.total = res.data.total
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    viewResume (url) {
      console.log(url)
      downloadFun(url, url => {
        window.open(url)
      })
    },
    downResume (url) {
      downloadFunD(url, url => {
        window.open(url)
      })
    },
    newUser () {
      console.log('新增')
      this.addVisible = true
    },
    //  面试信息列表
    interviewerMsg (data) {
      this.intervieweeData = data
      this.interviewerVisible = true
    },
    editor (intervieweeId) {
      console.log(intervieweeId)
      this.intervieweeId = intervieweeId
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
      this.intervieweeId = null
    },
    interviewApplyClose () {
      this.interviewApplyVisible = false
    },
    interviewApplySubmit () {
      this.interviewApplyClose()
      this.Topage(this.pageNum)
    },
    interviewerListClose () {
      this.interviewerVisible = false
      this.intervieweeId = null
    },
    interviewerListSubmit () {
      this.interviewerListClose()
      this.Topage(this.pageNum)
    },
    editSubmit () {
      this.editClose()
      this.Topage(this.pageNum)
    },
    addClose () {
      this.addVisible = false
      this.intervieweeId = null
    },
    addSubmit () {
      this.addClose()
      this.Topage(this.pageNum)
    },
    entry (intervieweeId) {
      this.intervieweeId = intervieweeId
      this.arrivalVisible = true
    },
    arrivalClose () {
      this.arrivalVisible = false
      this.arriveDate = ''
    },
    arrivalSubmit () {
      this.$loading()
      if (!this.arriveDate) {
        this.$message({
          type: 'error',
          message: '日期不可为空！'
        })
        return
      }
      const data = {
        intervieweeId: this.intervieweeId,
        arriveDate: this.arriveDate
      }
      api
        .setIntervieweeActive(data)
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '到岗成功'
          })
          this.$loading().close()
          this.arrivalClose()
          this.Topage()
        })
        .catch(err => {
          this.$loading().close()
          this.$message({
            type: 'error',
            message: err.message
          })
          this.arrivalClose()
        })
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    // 定义导出Excel表格事件
    exportExcel () {
      const fileName = '面试人员_' + new Date().toLocaleDateString()
      console.log(fileName)
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#export_table')
      )
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          fileName + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    applyInterview (data) {
      if (this.userInfo.userId != data.manageBy) {
        this.$message.error('当前用户非此面试者的邀约人，无法发起申请~~')
        return false
      }
      this.intervieweeId = data.intervieweeId
      this.interviewApplyVisible = true
      console.log(12312312312)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
// HR面试者录入（部分内容，进入“HR用户列表”）
// 名字*，电话号码，微信，性别*，年龄*，邮箱*，部门*（多选），期待薪资，工龄*，简历备份*，是否录用*，面试日期*，面试人*（多选）面试评价，是否到岗*，来源*（员工推荐、公司网站、公众号、boss、拉钩、58、智联、LinkedIn）
