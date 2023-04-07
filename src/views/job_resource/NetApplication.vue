
<!--
 * @Author: 库建华
 * @Date: 2020-04-26 13:20:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-19 16:45:35
 * @Version: 1
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
            v-if="roleInfo.includes(`net_application_search`)"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持公司名 岗位名"
          ></el-input>
          <el-select
            v-model="createBy"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`net_application_select`)"
            style="width:150px"
            placeholder="创建人"
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
            v-if="roleInfo.includes(`net_application_select`)"
            clearable
            style="width:100px"
            placeholder="状态"
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
            v-if="roleInfo.includes(`net_application_select`)"
            style="width:100px"
            clearable
            placeholder="官网展示"
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
            v-if="roleInfo.includes(`net_application_select`)"
            style="width:100px"
            clearable
            placeholder="岗位类型"
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
            v-if="roleInfo.includes(`net_application_select`)"
            style="width:100px"
            clearable
            placeholder="远程/实地"
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
            v-if="roleInfo.includes(`net_application_select`)"
            style="width:120px"
            filterable
            multiple
            clearable
            placeholder="地区"
            @change="countryChange()"
          >
            <el-option
              v-for="item in country_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="city"
            class="mr10 mb10"
            size="mini"
            v-if="roleInfo.includes(`net_application_select`)"
            style="width:100px"
            filterable
            clearable
            placeholder="城市"
          >
            <el-option
              v-for="item in city_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-select
            v-model="tracks"
            collapse-tags
            multiple
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="Track"
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
            class="mr10 mb10"
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

          <el-select
            v-model="jobUrlFlag"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="有效性"
          >
            <el-option
              v-for="item in jobUrlFlagList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-date-picker
            v-if="roleInfo.includes(`net_application_select`)"
            class="mr10 mb10"
            size="mini"
            v-model="applySeason"
            type="year"
            clearable
            style="width:100px"
            value-format="yyyy"
            placeholder="申请季"
          ></el-date-picker>
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
          ></el-date-picker>
          <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`net_application_search`)"
            class="mr10 mb10"
            size="mini"
            plain
            @click="initTable()"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            v-if="roleInfo.includes(`net_application_new`)"
            class=" mb10"
            size="mini"
            style="margin-left:0px"
            plain
            @click="addInternal"
          >新增</el-button>
          <el-button
            icon="el-icon-download"
            v-if="roleInfo.includes(`net_application_download`)"
            class="mr10 mb10"
            size="mini"
            plain
            @click="exportFile"
          >导出</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`net_application_page`)"
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
        @sort-change="changeSort"
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
        <!-- <el-table-column align="center" prop="jobUrlFlagName" label="链接是否失效" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>
              <template v-if="scope.row.jobUrlFlag && scope.row.jobUrlFlag == 1">
                <el-tooltip placement="top">
                  <div slot="content">
                    此网申链接已失效请及时更新！！
                  </div>
                  <el-button type="text" style="color:#F56C6C" class="el-icon-info"></el-button>
                </el-tooltip>
              </template>
              <span v-if="scope.row.jobUrlFlag && scope.row.jobUrlFlag == 1" style="color:#c32e47">
                {{scope.row.jobUrlFlagName}}
              </span>
              <span v-else>
                {{scope.row.jobUrlFlagName}}
              </span>
            </p>
          </template>
        </el-table-column> -->

        <el-table-column align="center" prop="recordStatusName" label="状态" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="hasDeadLineName" label="是否有截止日期" show-overflow-tooltip></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="deadLine"
          label="截止日期"
          sortable
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
          label="岗位信息"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="jobRequirements"
          label="岗位要求"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          sortable
          min-width="140px"
          align="center"
          prop="jobUrlFlagName"
          label="岗位链接有效性"
          show-overflow-tooltip
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.jobUrlFlag == 0">有效</span>
            <span v-else style="color:#c32e47">已失效</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center"  prop="jobUrl" label="岗位链接" show-overflow-tooltip>
          <template slot-scope="scope">
              <template v-if="scope.row.jobUrlFlag == 1">
                <el-tooltip placement="top">
                  <div slot="content">
                    此网申链接已失效请及时更新！！
                  </div>
                  <el-button type="text" style="color:#F56C6C" class="el-icon-info"></el-button>
                </el-tooltip>
              </template>
              <a target="_blank" @click="deala(scope.row.jobUrl)">{{scope.row.jobUrl}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="tracksName" label="Track" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="degreesName" label="学历要求" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="countryName" label="地区" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="cityName" label="城市" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="jobTypeName" label="岗位类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="fullTimeTypeName" label="全职类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="locationTypeName" label="远程/实地" show-overflow-tooltip></el-table-column>

        <el-table-column
          align="center"
          prop="displayStatusName"
          label="是否在官网展示"
          show-overflow-tooltip
        ></el-table-column>

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
      <edit
        :internalVisible="internalVisible"
        :internalData="internalData"
        :userInfo="userInfo"
        @close="internalClose"
        @submit="internalSubmit"
      />
      <detail
        :detailVisible="detailVisible"
        :internalData="internalData"
        @success="successDetaiil"
        @close="detailClose"
        @submit="detailSubmit"
      />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/job.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import util from '@/libs/util'

import edit from './net/edit.vue'
import detail from './net/detail.vue'
import { mapState } from 'vuex'

export default {
  name: 'net',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  components: { edit, detail },
  data: () => {
    return {
      user_list: [],
      internal_job_status: [],
      common_yes_or_no: [],
      internship_or_full_time: [],
      internship_location_type: [],
      country_list: [],
      city_list: [],
      trackList: [],
      pageSize: 400,
      degree: [],
      degrees: [],
      loading: false,
      jobUrlFlagList: [
        { itemName: '有效', itemValue: '0' },
        { itemName: '失效', itemValue: '1' }
      ],
      tracks: [],
      total: 0,
      pageNum: 1,
      tableHeight: 'auto',
      search: '',
      createBy: 'ALL',
      myDate: [],
      recordStatus: '',
      displayStatus: '',
      applySeason: '',
      jobType: '',
      locationType: '',
      countrys: '',
      city: '',
      jobUrlFlag: '',
      companyId: '',
      companyList: [],
      tableData: [],
      internalVisible: false,
      detailVisible: false,
      internalData: {},
      sortCol: '',
      sort: ''
    }
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted () {
    this.pageInit()
    this.sort = ''
    this.sortCol = ''
    this.initDic()
  },

  methods: {
    async pageInit () {
      this.degree = await this.getDictionary('degree')
      this.trackList = await this.getDictionary('mentee_track')
      this.internal_job_status = await this.getDictionary('internal_job_status')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.internship_location_type = await this.getDictionary('internship_location_type')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.country_list = await this.getDictionary('country')
      this.companyList = await this.getCompany()
    },
    initDic () {
      apiDic.getUserList('').then(res => {
        this.user_list = res.data
        this.user_list.unshift({ userName: 'ALL(本人及下属)', userId: 'ALL' })
        if (this.roleInfo.includes('net_application_all_data')) {
          this.user_list.unshift({
            userName: 'ALL(全部数据)',
            userId: 'ALL_DATA'
          })
        }
      })
    },
    initTable () {
      console.log(this.myDate)
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        createBy: this.createBy,
        recordStatus: this.recordStatus,
        displayStatus: this.displayStatus,
        applySeason: this.applySeason,
        jobType: this.jobType,
        tracks: this.tracks.join(','),
        degrees: this.degrees.join(','),
        locationType: this.locationType,
        countries: this.countrys.join(','),
        city: this.city,
        jobUrlFlag: this.jobUrlFlag,
        sort: this.sort,
        deadLineFrom: this.myDate[0] || '',
        deadLineTo: this.myDate[1] || '',
        sortCol: this.sort ? this.sortCol : '',
        companyId: this.companyId
      }
      console.log(params)
      this.loading = true
      api.getNetApplicationList(params).then(res => {
        console.log(res.data.rows)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 导出
    exportFile () {
      const fileName = '所有网申公司'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}internalJob/netApplication/list/export?search=${this.search}&recordStatus=${this.recordStatus}&displayStatus=${this.displayStatus}` +
        `&jobType=${this.jobType}&locationType=${this.locationType}&applySeason=${this.applySeason}&companyId=${this.companyId}&jobUrlFlag=${this.jobUrlFlag}&createBy=${this.createBy}` +
        `&tracks=${this.tracks.join(',')}&degrees=${this.degrees.join(',')}&countries=${this.countrys.join(',')}&city=${this.city}&sort=${this.sort}&sortCol=${this.sortCol || ''}&deadLineFrom=${this.myDate[0] || ''}&deadLineTo=${this.myDate[1] || ''}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
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
        }
      }
      // 发送请求
      xhr.send()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initTable(this.pageNum)
    },
    addInternal () {
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
    changeSort ({ column, prop, order }) {
      this.sortCol = prop
      if (order) {
        if (order == 'ascending') {
          this.sort = 'asc'
        } else {
          this.sort = 'desc'
        }
      } else {
        this.sort = ''
      }
      this.initTable()
      console.log(column, prop, order)
    },
    deleteInternal (v) {
      this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            netJobId: v.netJobId
          }
          console.log(params)
          api.delNetApplication(params)
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
    deala (url) {
      if (this.GetQueryString('mac')) {
        if (url.indexOf('http') != -1) {
          const shell = window.electron.shell
          window.electron.shell.openExternal(url)
        } else {
          this.$copyText(url).then(() => {
            this.$confirm(`此${url}网址未符合http/https格式，已复制到粘贴板，请至浏览器打开。`, '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        windows.open(url)
      }
    },
    GetQueryString (name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    countryChange () {
      this.city = ''
      this.getCity()
      // this.initTable()
    },
    getCity () {
      if (!this.countrys) {
        return
      }
      const params = {
        parentDic: 'country',
        parentItem: this.countrys.join(',')
      }
      apiDic.getDicByParent(params).then(res => {
        console.log(res.data, 'hgiuhguiguei')
        this.city_list = res.data
      })
    },
    successDetaiil () {
      this.detailVisible = false
      this.initTable()
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
