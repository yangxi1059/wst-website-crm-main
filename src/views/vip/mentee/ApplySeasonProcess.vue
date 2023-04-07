<!--
 * @Author: Kaan
 * @Date: 2022-04-11 14:40:56
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-26 14:34:15
 * @version: 
 * @Descripttion: 
-->
<template>
  <div>
    <d2-container v-loading="loading">
      <div class="d2_container" ref="d2">
        <div class="search_page" ref="search">
          <div class="search">
            <el-input
              class="mr10 mb10"
              v-model="search"
              clearable
              placeholder="支持姓名、微信ID"
              @keyup.enter.native="Topage()"
              :style="{width:widths}"
            ></el-input>
            <el-cascader
              class="mr10 mb10"
              :style="{width:widths}"
              v-model="role"
              ref="role"
              :options="userList"
              :props="{ checkStrictly: true,expandTrigger:'hover' }"
              clearable
              @change="roleChange()"
            >
              <p slot-scope="{data}" @click="clickNode">{{ data.label }}</p>
            </el-cascader>
            <el-select
              :style="{width:widths}"
              class="mr10 mb10"
              v-model="applyYear"
              clearable
              filterable
              multiple
              placeholder="年份"
            >
              <el-option
                v-for="(year) in yearList" :key="year" :label="year" :value="year"
              ></el-option>
            </el-select>
            <el-select
              :style="{width:widths}"
              class="mr10 mb10"
              v-model="applyType"
              clearable
              filterable
              multiple
              placeholder="类型"
            >
              <el-option
                v-for="item in typeList"
                :key="item.itemValue"
                :value="item.itemValue"
                :label="item.itemName"
              ></el-option>
            </el-select>
            <el-select
              :style="{width:widths}"
              class="mr10 mb10"
              v-model="applyTrack"
              clearable
              filterable
              multiple
              placeholder="行业"
            >
              <el-option
                v-for="item in trackList"
                :key="item.itemValue"
                :value="item.itemValue"
                :label="item.itemName"
              ></el-option>
            </el-select>
            <el-select
              :style="{width:widths}"
              class="mr10 mb10"
              v-model="applyCountry"
              clearable
              filterable
              multiple
              placeholder="地区"
            >
              <el-option
                v-for="item in countryList"
                :key="item.itemValue"
                :value="item.itemValue"
                :label="item.itemName"
              ></el-option>
            </el-select>
            <el-button
              icon="el-icon-search"
              class="mr10 mb10"
              size="mini"
              plain
              @click="Topage(1)"
            >搜索</el-button>
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
          :max-height="tableHeight"
          size="mini"
          border
          @row-dblclick="dblclick"
          @sort-change="sortChange"
        >
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text"  @click="edit(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" prop="menteeName" label="学员姓名" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="申请季" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.applyYear|| "无"}}/{{scope.row.applyTypeName || "无"}}/{{scope.row.applyTrackName || "无"}}/{{scope.row.applyCountryName || "无"}}
            </template>
          </el-table-column>
          <el-table-column sortable align="center" prop="finishCount" label="准备进度" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.finishCount || "无"}}/{{scope.row.typeCount || "无"}}
            </template>
          </el-table-column>
          <el-table-column sortable align="center" prop="programName" label="签约项目" show-overflow-tooltip></el-table-column>
          <el-table-column sortable align="center" prop="extendedEndDate" label="项目结束日期" show-overflow-tooltip></el-table-column>
          <el-table-column sortable align="center" prop="strategistName" label="规划导师" show-overflow-tooltip></el-table-column>
          <el-table-column sortable align="center" prop="pmName" label="PM" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>

    </d2-container>
    <ApplySeasonEdit
      :editVisible="editVisible"
      :menteeId="menteeId"
      :editPkId="editPkId"
      :editList="editList"
      @close="closeEdit"
      @submit="submitEdit"
    />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import ApplySeasonEdit from './components/ApplySeasonEdit'

export default {
  mixins: [mixins],
  name: 'ApplySeasonProcess',
  components:{ApplySeasonEdit},
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      loading:false,
      // 搜索栏数据
      widths: '160px',
      search: "",
      role: '',
      groupId:"",
      userId:"",
      applyYear:  "",
      applyType:  "",
      applyTrack:  "",
      applyCountry:  "",
      userList:[],
      startMonth:  "",
      endMonth:  "",
      yearList: ['2022','2023','2024','2025','2026'],
      typeList:[{
        itemName: "实习",
        itemValue: "0",
      },{
        itemName: "全职",
        itemValue: "1",
      },{
        itemName: "Event",
        itemValue: "event",
      },{
        itemName: "Spring Week",
        itemValue: "spring_week",
      }],
      trackList:[],
      countryList:[],

      pageSize: 50,
      pageNum: 1,
      total:  0,
      sortCol: '',
      sort: '',
      tableHeight: 'auto',
      tableData:[],

      editVisible: false,
      menteeId:"",
      editPkId:"",
      editList:[],

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
    this.Topage(1)
  },
  methods: {
    async pageInit () {
      this.trackList = await this.getDictionary('track')
      this.countryList = await this.getDictionary('country')
      this.userList = await this.getUserList('vip_mentee_all_mentee_data')
      this.userInfo = this.$store.state.role.userInfo
      this.role = this.userInfo.userId
    },
    Topage(i){
      i==1 ? this.pageNum =1 : ""
      let params={
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        groupId: this.groupId,
        applyYear: this.applyYear.join(),
        applyType: this.applyType.join(),
        applyTrack: this.applyTrack.join(),
        applyCountry: this.applyCountry.join(),
        sortCol: this.sortCol,
        sort: this.sort
      }
      this.loading = true
      api.getApplySeasonProgress(params).then(res => {
        console.log(res.data.rows)
        this.tableData = res.data.rows
        this.total = 100
        this.loading = false
      })
    },
    dblclick (row, column, event) {
      console.log(row, column, event)
    },
    edit(row){
      this.editPkId = row.pkId
      this.menteeId = row.menteeId
      this.loading = true
      api.getSignApplyList(row.signId).then(res => {
        console.log(res)
        this.loading = false
        this.editList = res.data
        this.editVisible = true
      })
    },
    closeEdit(){
      this.editVisible = false
    },
    submitEdit(){
      this.Topage()
      this.editVisible = false
    },
    // 下拉选单击选中
    clickNode ($event) {
      $event.target.parentElement.parentElement.firstElementChild.click()
    },
    // 下拉选选中时自动收起展开
    roleChange () {
      console.log(this.role)
      const tempObj = this.$refs.role.getCheckedNodes()[0]
      console.log(this.$refs.role.getCheckedNodes()[0])
      if (tempObj) {
        if (tempObj.hasChildren) {
          this.groupId = tempObj.value
          this.userId = ''
        } else {
          this.groupId = ''
          this.userId = tempObj.value
        }
      } else {
        this.groupId = ''
        this.userId = ''
      }
      this.$refs.role.dropDownVisible = false
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
    sortChange (column, prop) {
      console.log(column, prop)
      this.sortCol = column.prop
      if (column.order == 'descending') {
        this.sort = 'desc'
        this.sortCol = column.prop
      } else if (column.order == 'descending') {
        this.sort = 'asc'
        this.sortCol = column.prop
      } else {
        this.sort = ''
        this.sortCol = ''
      }
      this.Topage()
    }
  }
}
</script>