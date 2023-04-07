<!--
 * @Author: 库建华
 * @Date: 2020-03-18 11:27:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-01 16:16:10
 * @Version:
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-input
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_search`)"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持公司名 岗位名"
            @keyup.enter.native="initTable()"
          ></el-input>
          <el-select
            v-model="createBy"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_select`)"
            style="width:150px"
            placeholder="创建人"
            @change="initTable()"
          >
            <el-option
              v-for="item in user_list"
              :key="item.userId"
              :value="item.userId"
              :label="item.userName"
            ></el-option>
          </el-select>
          <el-select
            v-model="recordStatus"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_select`)"
            clearable
            style="width:100px"
            placeholder="状态"
            @change="initTable()"
          >
            <el-option
              v-for="item in internal_job_status"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="displayStatus"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_select`)"
            style="width:100px"
            clearable
            placeholder="官网展示"
            @change="initTable()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="jobType"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_select`)"
            style="width:100px"
            clearable
            placeholder="岗位类型"
            @change="initTable()"
          >
            <el-option
              v-for="item in internship_or_full_time"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="locationType"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_select`)"
            style="width:100px"
            clearable
            placeholder="远程/实地"
            @change="initTable()"
          >
            <el-option
              v-for="item in internship_location_type"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            class="mr10 mb10"
            style="width:100px"
            size="mini"
            filterable
            v-model="companyId"
            clearable
            placeholder="公司"
          >
            <el-option
              v-for="item in companyList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <el-select
            v-model="countrys"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`internal_job_select`)"
            style="width:100px"
            filterable
            clearable
            placeholder="地区"
            @change="initTable()"
          >
            <el-option
              v-for="item in country_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-select
            v-model="track"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="Track"
            @change="initTable()"
          >
            <el-option
              v-for="item in trackList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-select
            v-model="degrees"
            collapse-tags
            multiple
            class="mr10 mb10 "
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="学历要求"
          >
            <el-option
              v-for="item in degree"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-date-picker
            v-if="roleInfo.includes(`internal_job_select`)"
            class="mr10 mb10"
            size="mini"
            v-model="applySeason"
            type="year"
            clearable
            style="width:100px"
            value-format="yyyy"
            @change="initTable()"
            placeholder="申请季"
          ></el-date-picker>
          <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`internal_job_search`)"
            class="mr10 mb10"
            size="mini"
            plain
            @click="initTable()"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            v-if="roleInfo.includes(`internal_job_new`)"
            class="mr10 mb10"
            size="mini"
            style="margin-left:0px"
            plain
            @click="addinternal"
          >新增</el-button>
          <el-button
            v-if="roleInfo.includes(`internal_job_provider`)"
            class=" mb10"
            size="mini"
            type="primary"
            style="margin-left:0px"
            @click="internalJobList"
          >岗位提供人管理</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`internal_job_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>

      <el-table
        :data="tableData"
        :max-height="tableHeight"
        size="mini"
        border
        stripe
        @row-dblclick="dblclick"
      >
        <el-table-column align="center" prop="logo" label="公司logo" show-overflow-tooltip>
          <template slot-scope="scope">
            <img v-if="scope.row.logo" :src="scope.row.logo" alt="logo" />
            <p v-else>无logo</p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="companyName"
          label="公司名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="jobName"
          label="岗位名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="displayStatusName"
          label="是否在官网展示"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="recordStatusName" label="状态" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="hasDeadLineName" label="是否有截止日期" show-overflow-tooltip></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="deadLine"
          label="截止日期"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.hasDeadLine == '1'?scope.row.deadLine:'暂无'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="applySeason" label="申请季" show-overflow-tooltip></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="jobInformation"
          label="岗位介绍"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="jobRequirements"
          label="岗位要求"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="jobCount" label="岗位数量" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="tracksName" label="Track" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="degreesName" label="学历要求" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="countryName" label="地区" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="cityName" label="城市" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="jobTypeName" label="岗位类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="locationTypeName" label="远程/实地" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="providerName" label="内推提供人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="面试费用" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.interviewFeeType}} {{scope.row.interviewFee}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="offer费用" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.offerFeeType}} {{scope.row.offerFee}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column
          min-width="100px"
          align="center"
          prop="manageByName"
          label="管理人"
          show-overflow-tooltip
        ></el-table-column>-->
        <!-- <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column> -->
      </el-table>
    </div>
    <edit
      :internalVisible="internalVisible"
      :internalData="internalData"
      :userInfo="userInfo"
      @close="internalClose"
      @submit="internalSubmit"
    />
    <students
      :studentsVisible="studentsVisible"
      :internalData="internalData"
      @close="studentsClose"
      @submit="studentsSubmit"
    />
    <detail
      :detailVisible="detailVisible"
      :internalData="internalData"
      @success="detailSuccess"
      @close="detailClose"
      @submit="detailSubmit"
    />
    <internalJobList
      :internalJobListVisible="internalJobListVisible"
      @close="internalJobListClose"
    />
  </d2-container>
</template>

<script>
import api from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'

import detail from './internal_job/detail.vue'
import edit from './internal_job/internal_job_edit.vue'
import students from './internal_job/internal_job_students.vue'
import internalJobList from './internal_job/internalJobList.vue'
import { mapState } from 'vuex'

export default {
  name: 'internal',
  mixins: [mixins],
  components: { edit, students, detail, internalJobList },
  data: () => {
    return {
      user_list: [],
      internal_job_status: [],
      common_yes_or_no: [],
      internship_or_full_time: [],
      internship_location_type: [],
      degrees: [],
      degree: [],
      tableData: [],
      companyList: [],
      country_list: [],
      trackList: [],
      total: 0,
      tableHeight: 'auto',
      loading: false,
      pageSize: 400,
      pageNum: 0,
      createBy: 'ALL',
      search: '',
      recordStatus: '',
      displayStatus: '',
      applySeason: '',
      jobType: '',
      track: '',
      locationType: '',
      countrys: '',
      companyId: '',
      internalVisible: false,
      studentsVisible: false,
      internalData: {},
      detailVisible: false,
      internalJobListVisible: false
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
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted () {
    this.initDic()
    this.initTable()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.companyList = await this.getCompany()
      this.degree = await this.getDictionary('degree')
      this.trackList = await this.getDictionary('track')
      this.internal_job_status = await this.getDictionary('internal_job_status')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.internship_location_type = await this.getDictionary('internship_location_type')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.country_list = await this.getDictionary('country')
    },
    initDic () {
      api.getUserList('').then(res => {
        this.user_list = res.data
        this.user_list.unshift({ userName: 'ALL(本人及下属)', userId: 'ALL' })
        if (this.roleInfo.includes('internal_job_all_data')) {
          this.user_list.unshift({
            userName: 'ALL(全部数据)',
            userId: 'ALL_DATA'
          })
        }
      })
    },
    initTable () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        createBy: this.createBy,
        search: this.search,
        recordStatus: this.recordStatus,
        displayStatus: this.displayStatus,
        applySeason: this.applySeason,
        track: this.track,
        degrees: this.degrees.join(','),
        jobType: this.jobType,
        locationType: this.locationType,
        country: this.countrys,
        companyId: this.companyId
        // sort:'',
        // sortCol:'',
      }
      this.loading = true
      api.getInternalJobList(params).then(res => {
        this.tableData = res.data.rows
        console.log(this.tableData)
        this.total = res.data.total
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initTable(this.pageNum)
    },
    addinternal () {
      this.internalVisible = true
      this.internalData = {}
    },
    internalClose () {
      this.internalVisible = false
      this.internalData = {}
    },
    internalSubmit () {
      this.internalClose()
      this.initTable()
    },
    editInternal (v) {
      this.internalData = { ...v }
      console.log(this.internalData)
      this.internalVisible = true
    },
    students (v) {
      this.internalData = { ...v }
      console.log(this.internalData)
      this.studentsVisible = true
    },
    studentsClose () {
      this.studentsVisible = false
      this.internalData = {}
    },
    studentsSubmit () {
      this.studentsClose()
      this.initTable()
    },
    deleteInternal (v) {
      this.$confirm('此操作将永久删除该内推, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteInternalJob(v.jobId)
        })
        .then(res => {
          console.log('更新', res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.initTable()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    dblclick (row, column, event) {
      console.log(row, column, event)
      this.internalData = { ...row }
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSubmit () {
      this.detailClose()
      this.editInternal(this.internalData)
    },
    detailSuccess () {
      this.detailVisible = false
      this.initTable()
    },
    internalJobList () {
      this.internalJobListVisible = true
    },
    internalJobListClose () {
      this.internalJobListVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  max-width: 50px;
  max-height: 50px;
}
.d2_container{
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column
}

</style>
