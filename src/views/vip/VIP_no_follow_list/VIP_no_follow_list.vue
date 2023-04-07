<template>
  <d2-container v-loading="loading" >
    <div>
        <div class="search_page">
        <div class="search">
            <el-date-picker
            style="width：300px"
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
            <mySelect
            :role="role"
            @change="changeSelect"
            />
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
        <el-table-column prop="signId" align="center" label="signId" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menteeName" align="center" label="学员姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="programName" align="center" label="项目名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="times" align="center" label="第几次" min-width="100"></el-table-column>
        <el-table-column prop="beginDate" align="center" label="follow开始日期" min-width="100"></el-table-column>
        <el-table-column prop="endDate" align="center" label="follow截止日期" min-width="100"></el-table-column>
        <el-table-column
            prop="followByName"
            align="center"
            label="follow人姓名 "
            min-width="100"
            show-overflow-tooltip
        ></el-table-column>
        </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
import mySelect from '@/components/my-select.vue'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  components: { mySelect },
  data: () => {
    return {
      myDate: [],
      userId: '',
      groupId: '',
      role: '0',
      users: [],
      total: 0,
      pageSize: 400,
      pageNum: 1,
      tableData: [],
      followType: true,
      loading: false
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
  mounted () {
    this.userId = this.userInfo.userId
    this.role = this.roleInfo.includes('vip_no_follow_up_all_data') ? '1' : '0'
    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      const params = {
        userId: this.userId,
        groupId: this.groupId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        fromDate: this.myDate && this.myDate[0],
        toDate: this.myDate && this.myDate[1]
      }
      api.getNoFollowUpALLList(params).then(res => {
        console.log('getNoFollowUpALLList', res.data)
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
    },
    changeSelect (data) {
      this.groupId = data.groupId
      this.userId = data.user
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
