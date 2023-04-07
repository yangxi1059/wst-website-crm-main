<!--
 * @Author: 杨曦
 * @Date: 2022-11-28 10:39:12
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-12 11:06:30
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="user">
      <div class="search_page mb10">
        <div class="search">
          <el-input
          class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持项目名"
            @keyup.enter.native="Topage()"
            ></el-input>
          <el-cascader
          :style="{width:'120px'}"
            size="mini"
            class="mr10 mb10"
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
            size="mini"
            class="mr10"
            style="width:150px"
            v-model="signStatus"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in  mentee_sign_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-date-picker
            style="width:300px"
            class="mr10"
            size="mini"
            v-model="Mydate"
            clearable
            value-format="yyyy-MM-dd"
            type="daterange"
            placeholder="咨询日期-结束"
          ></el-date-picker>
          <el-button
            size="mini"
            icon="el-icon-search"
            class=""
            plain
            @click="Topage()"
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
      <!-- <el-tag class="" type="warnning" size="medium">仅展示近60条数据</el-tag>
      <el-tag class=""  type="danger" size="medium">列表学生签约须满足BD管理提成规则方可得到提成</el-tag> -->
      <el-table class="" size="small" :data="showMenteeArr"  highlight-current-row >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="cooperatorName" label="合作商名称"></el-table-column>
        <el-table-column align="center" prop="manageByName" label="合作商管理人"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="menteeName" min-width="80"></el-table-column>
        <el-table-column align="center"  label="微信ID">
          <template slot-scope="scope">
            <div :title="scope.row.wxId2">{{scope.row.wxId}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wxName" label="微信名"></el-table-column>
        <el-table-column align="center" prop="finishYear" label="学生毕业年份"></el-table-column>
        <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90"></el-table-column>
        <!-- <el-table-column align="center" prop="signStatusName" label="签约状态" min-width="80"
          :filters="signStatusList"
          :filter-method="filterTag"
          column-key="filterStatus"
          filter-placement="bottom-end"
        ></el-table-column> -->
        <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
        <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
        <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
        <el-table-column align="center" prop="counselorName" label="顾问姓名"></el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/bd'
import mixins from '@/plugin/mixins'

export default {
  name: 'showMenteeArr',
  mixins: [mixins],
  props: {
  },
  data () {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      showMenteeArr: [],
      signStatusList: [],
      loading: false,
      search: '',
      manageBy: '',
      userList: [],
      manageGroup: '',
      signStatus: '',
      Mydate: [],
      fromDate: '',
      toDate: '',
      mentee_sign_status: [],
      role: ''
    }
  },
  mounted () {
    this.userList = []
    this.init()
    this.Topage()
  },
  methods: {
    async init () {
      this.role = ''
      this.userList = await this.getUserList()
      this.signStatusList = []
      this.mentee_sign_status = await this.getDictionary('mentee_sign_status')
      // mentee_sign_status.forEach(v => {
      //   this.signStatusList.push({ text: v.itemName, value: v.itemName })
      // })
    },
    Topage () {
      this.loading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        manageBy: this.manageBy,
        manageGroup: this.manageGroup,
        signStatus: this.signStatus,
        fromDate: this.Mydate[0],
        toDate: this.Mydate[1]
      }
      api.menteeArrBymanageNew(data).then(res => {
        console.log(res.data)
        this.total = res.data.total
        this.showMenteeArr = res.data.rows || []
        this.loading = false
      })
    },
    clickNode ($event) {
      $event.target.parentElement.parentElement.firstElementChild.click()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    roleChange () {
      console.log(this.role)
      const tempObj = this.$refs.role.getCheckedNodes()[0]
      console.log(this.$refs.role.getCheckedNodes()[0])
      if (tempObj) {
        if (tempObj.hasChildren) {
          this.manageGroup = tempObj.value
          this.manageBy = ''
        } else {
          this.manageGroup = ''
          this.manageBy = tempObj.value
        }
      } else {
        this.manageGroup = ''
        this.manageBy = ''
      }
      this.$refs.role.dropDownVisible = false
    },
    close () {
      this.$emit('close')
    },
    filterTag (value, row) {
      console.log(value)
      return row.signStatusName === value
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
