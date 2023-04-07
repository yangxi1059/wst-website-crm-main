<!--
 * @Author: 库建华
 * @Date: 2020-06-01 16:06:18
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-19 09:59:55
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer
      append-to-body
      title="学员筛选"
      class="info"
      :visible.sync="menteeNewVisible"
      size="95%"
      :before-close="handleClose"
    >
        <div style="margin-left:20px"  class="search_page">
        <div class="search">
            <el-input
            class="mr10 mb10"
            size="mini"
            style="width:200px"
            v-model="search"
            clearable
            placeholder="支持姓名、微信ID"
            @keyup.enter.native="Topage(1)"
            :style="{width:'160px'}"
            ></el-input>
            <mySelect
            :role="role"
            @change="changeSelect"
            />
            <el-select
            v-model="school"
            class="mr10 mb10 "
            size="mini"
            filterable
            clearable
            placeholder="学校"
            :style="{width:'120px'}"
            >
            <el-option
                  v-for="item in schoolList"
                  :key="item.schoolId"
                  :label="item.allName"
                  :value="item.schoolId"
                ></el-option>
            </el-select>
            <el-select
              class="mr10 mb10"
              size="mini"
              v-model="majorId"
              clearable
              filterable
              multiple
              placeholder="专业"
            >
              <el-option
                v-for="(item,i) in majorList"
                :key="i"
                :label="item.majorName"
                :value="item.majorId"
              ></el-option>
            </el-select>
            <el-select
            v-model="track1"
            class="mr10 mb10 "
            size="mini"
            filterable
            clearable
            placeholder="Track"
            :style="{width:'120px'}"
            >
            <el-option
                v-for="(item,i) in trackList"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            v-model="location1"
            class="mr10 mb10"
            size="mini"
            filterable
            clearable
            placeholder="Location"
            :style="{width:'100px'}"
            >
            <el-option
                v-for="(item,i) in locationList"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            v-model="finishYear"
            class="mr10 mb10"
            clearable
            size="mini"
            placeholder="Graduation Year"
            :style="{width:'120px'}"
            >
            <el-option v-for="(item) in 10" :key="item" :label="item+2015" :value="item+2015"></el-option>
            </el-select>
            <el-select
            v-model="signStatus"
            class="mr10 mb10"
            clearable
            size="mini"
            placeholder="项目状态"
            :style="{width:'120px'}"
            >
            <el-option
                v-for="(item,i) in signStatusList"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            v-model="internshipStatus"
            class="mr10 mb10"
            clearable
            size="mini"
            placeholder="实习状态"
            :style="{width:'120px'}"
            >
            <el-option
                v-for="(item,i) in internshipStatusList"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            v-model="programLevel"
            class="mr10 mb10"
            clearable
            size="mini"
            placeholder="项目级别"
            :style="{width:'120px'}"
            >
            <el-option
                v-for="(item,i) in program_level"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-button icon="el-icon-search" class="mr10 mb10" size="mini" plain @click="Topage(1)">GO</el-button>
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
        class="mt20"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
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
        <el-table-column align="center" prop="menteeName" label="学员名">
            <template slot-scope="scope">
            <p>
                <template v-if="scope.row.needRangeLesson">
                <el-tooltip placement="top">
                    <div slot="content">
                    该学生已经有14天内没有排课记录
                    <br />提示：请及时排课！
                    </div>
                    <el-button type="text" class="el-icon-info"></el-button>
                </el-tooltip>
                </template>
                {{scope.row.menteeName}}
            </p>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="wxId" label="学员微信"></el-table-column>
        <el-table-column align="center" prop="schoolChiName" label="学校展示"></el-table-column>
        <el-table-column align="center" prop="majorName" label="专业展示"></el-table-column>
        <el-table-column align="center" label="项目概述" min-width="300px">
            <template slot-scope="scope">
            <p style="white-space: pre-wrap;">{{scope.row.signDetail}}</p>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="strategistName" label="基础进度">
            <template slot-scope="scope">
            <p>{{scope.row.basicEndNum}}/{{scope.row.basicNum}}</p>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="strategistName" label="实习进度">
            <template slot-scope="scope">
            <p>{{scope.row.internshipEndNum}}/{{scope.row.internshipNum}}</p>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="latestSignDate" label="最近订单"></el-table-column>
        </el-table>
    </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import api from '@/api/vip.js'
import mySelect from '@/components/my-select.vue'

export default {
  name: 'menteeNew',
  components: { mySelect },
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 400,
      total: 0,
      search: '',
      loading: false,
      userId: '',
      groupId: '',
      track1: '',
      location1: '',
      finishYear: '',
      signStatus: '',
      schoolList: [],
      school: '',
      majorList: [],
      majorId: [],
      internshipStatus: '',
      programLevel: '',
      role: '0',
      trackList: [],
      locationList: [],
      program_level: [],
      signStatusList: [
        { itemName: '不限', itemValue: null },
        { itemName: '未过期', itemValue: 0 },
        { itemName: '已过期', itemValue: 1 },
        { itemName: '未过期已完成', itemValue: 2 }
      ],
      internshipStatusList: [
        { itemName: '不限', itemValue: null },
        { itemName: '未安排', itemValue: 0 },
        { itemName: '已安排', itemValue: 1 }
      ]
    }
  },
  props: {
    menteeNewVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    menteeNewVisible: function (val) {
      if (val) {
        // this.Topage()
      }
    }
  },
  mounted () {
    this.getVIPList()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.program_level = await this.getDictionary('program_level')
      this.locationList = await this.getDictionary('country')
      this.schoolList = await this.getSchool('school')
      this.trackList = await this.getDictionary('track')
      this.majorList = await this.getMajor()

      console.log(this.majorList)
    },
    getVIPList () {
      this.userId = this.userInfo.userId
      if (this.roleInfo.includes('vip_mentee_all_mentee_data')) {
        this.role = '1'
      } else {
        this.role = '0'
      }
    },
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        groupId: this.groupId,
        track: this.track1,
        location: this.location1,
        finishYear: this.finishYear,
        signStatus: this.signStatus,
        internshipStatus: this.internshipStatus,
        programLevel: this.programLevel,
        school: this.school,
        majors: this.majorId.join(',')
      }
      console.log(params, this)
      this.loading = true
      api.getMenteeList(params).then(res => {
        console.log(res.data)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    handleClose () {
      this.$emit('close')
    },
    changeSelect (data) {
      this.groupId = data.groupId
      this.userId = data.user
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    toDetail (row) {
      this.$emit('detail', row.menteeId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
