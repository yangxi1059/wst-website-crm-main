<!--
 * @Author: 库建华
 * @Date: 2020-06-01 14:28:24
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-18 09:47:57
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div  >
        <div class="search_page">
        <div class="search">
            <el-date-picker
            size="mini"
            style="width:160px"
            value-format="yyyy-MM-dd"
            class="mr10"
            v-model="counselorDate"
            type="date"
            placeholder="选择分配日期">
            </el-date-picker>
            <el-select class="mr10" style="width:160px" size="mini" v-model="allocateBy" clearable placeholder="选择分配人" >
            <el-option
                v-for="item in usersAll"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
            ></el-option>
            </el-select>
            <el-select class="mr10" style="width:160px" size="mini" v-model="counselorId" clearable placeholder="选择顾问" >
            <el-option-group
                v-for="group in users"
                :key="group.label"
                :label="group.label">
                <el-option
                v-for="item in group.options"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
                </el-option>
            </el-option-group>
            </el-select>
            <el-select class="mr10" style="width:160px" size="mini" filterable  v-model="school" clearable placeholder="选择学校" >
            <el-option
                v-for="item in schoolList"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
            ></el-option>
            </el-select>
            <el-button class="mr10" size="mini" type="primary" @click="Topage()">GO</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes('allocateHis_pagination')"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table @sort-change="sortChange" :data="tableList" size="mini"  stripe>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column sortable label="学员微信" prop="menteeWxId"></el-table-column>
          <el-table-column sortable label="学员邮箱" prop="email"></el-table-column>
          <el-table-column sortable label="学校" prop="schoolChiName"></el-table-column>
          <el-table-column sortable label="学历" prop="degreeName"></el-table-column>
          <el-table-column sortable label="毕业年份" prop="finishYear"></el-table-column>
          <el-table-column sortable label="首次咨询日期" prop="firstAskDate"></el-table-column>
          <el-table-column sortable label="咨询方向" prop="askFor"></el-table-column>
          <el-table-column sortable label="渠道来源" prop="sourceName" show-overflow-tooltip></el-table-column>
          <el-table-column sortable label="分配顾问" prop="counselorName"></el-table-column>
          <el-table-column sortable label="分配顾问微信" prop="counselorWxName"></el-table-column>
          <el-table-column sortable label="分配顾问日期" prop="counselorDate"></el-table-column>
          <el-table-column sortable label="分配人" prop="allocateByName"></el-table-column>
        </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/sales_assistant.js'
import mixins from '@/plugin/mixins'
import apiDic from '@/api/dictionary.js'
import { mapState } from 'vuex'
export default {
  name: 'channel',
  mixins: [mixins],
  components: {},
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      loading: false,
      tableList: [],
      pageNum: 1,
      pageSize: 50,
      counselorDate: '',
      allocateBy: '',
      schoolList: [],
      school: '',
      counselorId: '',
      total: 0,
      usersAll: [],
      users: [],
      sortCol: '',
      sort: ''
    }
  },

  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.schoolList = await this.getSchool("school")
      api.getSelectUserList('sales').then(res => {
        console.log(res.data)
        const arr = [
          {
            label: '在职',
            options: []
          },
          {
            label: '已离职',
            options: []
          }
        ]
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].entryStatus == 1) {
            arr[0].options.push(res.data[i])
          } else if (res.data.entryStatus == 2) {
            arr[1].options.push(res.data[i])
          }
        }
        this.users = arr
      })
      const params = {
        pageNum: 1,
        pageSize: 999
      }
      api.userList(params).then(({ data }) => {
        console.log(
          'userList...........................................',
          data
        )
        this.usersAll = data.rows
      })
    },

    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        counselorDate: this.counselorDate,
        allocateBy: this.allocateBy,
        counselorId: this.counselorId,
        school: this.school,
        sortCol: this.sortCol,
        sort: this.sort
      }
      this.loading = true
      api.allocateHisList(params).then(res => {
        console.log('channelList', res.data)
        this.tableList = res.data.rows
        this.loading = false
        this.total = res.data.total
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
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

<style lang="scss" scoped>
</style>
