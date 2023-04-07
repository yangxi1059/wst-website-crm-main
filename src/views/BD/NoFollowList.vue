<template>
  <d2-container v-loading="loading">
    <div>
      <div class="search_page">
        <div class="search">
          <el-date-picker
            style="width:300px"
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
          <el-select
            class="mr10"
            size="mini"
            style="width:150px"
            filterable
            v-model="userId"
            placeholder="请选择"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-switch
            class="mr10"
            v-model="followType"
            active-color="#13ce66"
            inactive-color="#409EFF"
            active-text="校园大使"
            inactive-text="合作商"
            @change="Topage()"
          ></el-switch>
          <el-button icon="el-icon-search" class="ml0" size="mini" plain @click="Topage(1)">GO</el-button>
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
        <template v-if="followType">
          <el-table-column prop="ambassadorId" align="center" label="校园大使ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ambassadorName" align="center" label="校园大使名称" show-overflow-tooltip></el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="cooperatorId" align="center" label="合作商ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cooperatorName" align="center" label="合作商名称" show-overflow-tooltip></el-table-column>
        </template>
        <el-table-column prop="beginDate" align="center" label="follow开始日期" min-width="100"></el-table-column>
        <el-table-column prop="endDate" align="center" label="follow截止日期" min-width="100"></el-table-column>
        <el-table-column prop="manageByName" align="center" label="管理人姓名" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/bd'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', ['userInfo'])
  },
  data: () => {
    return {
      pageSize: 100,
      myDate: [],
      userId: 'ALL',
      users: [],
      total: 0,
      pageNum: 1,
      tableData: [],
      followType: true,
      loading: false
    }
  },
  mounted () {
    api.subordinate(this.userInfo.userId).then(({ data }) => {
      console.log('获取用户列表', data)
      const users = [
        { userId: 'ALL', userName: 'ALL' }
      ]
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
        manageBy: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        fromDate: this.myDate && this.myDate[0],
        toDate: this.myDate && this.myDate[1]
      }
      if (this.followType) {
        api.getAmbassadorNoFollowUpList(params).then(res => {
          console.log('getAmbassadorNoFollowUpList未follow列表', res.data)
          this.total = res.data.total
          this.tableData = res.data.rows
          this.loading = false
        })
      } else {
        api.getCooperatorNoFollowUpList(params).then(res => {
          console.log('getCooperatorNoFollowUpList未follow列表', res.data)
          this.total = res.data.total
          this.tableData = res.data.rows
          this.loading = false
        })
      }
    },
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
