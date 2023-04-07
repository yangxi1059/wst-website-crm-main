<template>
  <d2-container v-loading="loading" >
    <div class="vacation">
        <div class="search_page">
        <div class="search">
            <el-select
            style="width:150px"
            v-if="roleInfo.includes(`vacation_user_select`)"
            class="mr10"
            size="mini"
            filterable
            v-model="userId"
            clearable
            placeholder="请选择用户"
            @change="Topage()"
            >
            <el-option
                v-for="item in users"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
            ></el-option>
            </el-select>
            <el-select
            style="width:150px"
            v-if="roleInfo.includes(`vacation_record_select`)"
            class="mr10"
            size="mini"
            v-model="recordStatus"
            placeholder="请选择状态"
            @change="Topage()"
            >
            <el-option
                v-for="item in recordStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <!-- <el-button
            icon="el-icon-search"
            class="mr10"
            v-if="roleInfo.includes(`vacation_search`)"
            size="mini"
            plain
            @click="Topage()"
            >搜索</el-button>-->
        </div>
        <pagination
            v-if="roleInfo.includes(`vacation_page`)"
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
        <el-table-column min-width="100px" align="center" label="操作" width="150" v-if="roleInfo.includes(`vacation_edit`)">
            <template slot-scope="scope">
            <el-button
                type="text"
                @click="editor(scope.row)"
                title="编辑"
                class="el-icon-edit"
            ></el-button>
            </template>
        </el-table-column>
        <el-table-column prop="userName" min-width="200px" align="center" label="姓名"></el-table-column>
        <el-table-column prop="recordStatus" min-width="100px" align="center" label="周期状态">
            <template slot-scope="scope">{{recordStatusS[scope.row.recordStatus]}}</template>
        </el-table-column>
        <el-table-column prop="entryYear" min-width="100px" align="center" label="入职年份"></el-table-column>
        <el-table-column prop="vacationDay" min-width="100px" align="center" label="年假总天数"></el-table-column>
        <el-table-column prop="vacationUseDay" min-width="120px" align="center" label="本周期内已经使用的年假天数"></el-table-column>
        <el-table-column prop="paidSickDay" min-width="100px" align="center" label="带薪病假总天数"></el-table-column>
        <el-table-column prop="paidSickUseDay" min-width="120px" align="center" label="本周期内已经使用的带薪病假天数"></el-table-column>
        <el-table-column prop="fromDate" min-width="100px" align="center" label="	本周期开始日期"></el-table-column>
        <el-table-column prop="toDate" min-width="100px" align="center" label="	本周期结束日期"></el-table-column>
        <el-table-column prop="note" min-width="100px" align="center" label="备注说明"></el-table-column>
        </el-table>
        <edit :editVisible="editVisible" :itemData="itemData" @close="close" @submit="submit" />
    </div>
  </d2-container>
</template>
<script>
import api from '@/api/hr.js'
import api2 from '@/api/sales_assistant.js'
import mixins from '@/plugin/mixins'
import edit from './components/vacation_edit.vue'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  mixins: [mixins],
  components: { edit },
  data: function () {
    return {
      tableData: [],
      itemData: {},
      editVisible: false,
      total: 0,
      pageNum: 0,
      loading: false,
      pageSize: 400,
      userId: null,
      users: [],
      recordStatus: '0',
      recordStatusList: [
        { itemName: '本期', itemValue: '0' },
        { itemName: '往期', itemValue: '1' }
      ],
      recordStatusS: ['本期', '往期']
    }
  },
  mounted () {
    this.Topage()
    api2.getUserList().then(({ data }) => {
      console.log('人员列表', data)
      const users = [{ userId: '', userName: 'ALL' }, ...data]
      this.users = users
    })
  },
  methods: {
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: this.userId,
        recordStatus: this.recordStatus
      }
      this.loading = true
      api.getVacationList(params).then(res => {
        console.log(res)
        this.total = res.data.total
        this.tableData = res.data.rows
        this.loading = false
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
    editor (v) {
      this.itemData = { ...v }
      this.editVisible = true
      console.log(this.itemData)
    },
    close () {
      this.editVisible = false
      this.itemData = {}
    },
    submit () {
      this.close()
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
