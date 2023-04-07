<template>
  <d2-container v-loading="loading">
    <div>
        <div class="search_page">
        <div class="search">
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
            <el-select style="width:150px" class="mr10" size="mini" filterable v-model="userId" placeholder="请选择" @change="Topage(1)">
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
        style="width: 100%"
        >
        <el-table-column show-overflow-tooltip prop="wxId" align="center" label="学生微信ID"></el-table-column>
        <el-table-column show-overflow-tooltip prop="wxName" align="center" label="微信名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parentWx1" align="center" label="家长一微信ID"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parentWxName1" align="center" label="家长一微信名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parentWx2" align="center" label="家长二微信ID"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parentWxName2" align="center" label="家长二微信名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="endDate" align="center" label="follow截止日期" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="followByName" align="center" label="follow人" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="schoolChiName" align="center" label="学校" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="finishYear" align="center" label="Graduation Year" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="countryName" align="center" label="国家" min-width="100"></el-table-column>
        </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
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
      myDate: [],
      userId: 'ALL',
      users: [],
      total: 0,
      pageNum: 1,
      tableData: [],
      pageSize: 400,
      loading: false
    }
  },
  mounted () {
    api
      .subordinate(this.userInfo.userId, 'sales_assistant')
      .then(({ data }) => {
        console.log('获取用户列表', data)
        const users = [
          { userId: 'ALL', userName: 'ALL' }
        ]
        if (this.roleInfo.includes('no_follow_up_ALL_Data')) {
          users.unshift({ userId: 'ALL_Data', userName: 'ALL（全部数据）' })
        }
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
      })
    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      const params = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        pageType: 'sales_assistant',
        beginDate: this.myDate && this.myDate[0],
        endDate: this.myDate && this.myDate[1],
        position: 'sales_assistant'
      }
      api.getNofollowList(params).then(res => {
        console.log('未follow列表', res.data)
        this.total = res.data.total
        this.tableData = res.data.rows
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
