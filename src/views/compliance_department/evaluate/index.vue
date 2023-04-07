
<template>
  <d2-container v-loading="loading" >
    <div class="user">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容"
            v-if="roleInfo.includes(`evaluate_search`)"
            clearable
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="userId"
            clearable
            placeholder="员工选择"
            @change="Topage(1)"
            v-if="roleInfo.includes(`evaluate_user_select`)"
            >
            <el-option
                v-for="item in users"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
            ></el-option>
            </el-select>
            <el-date-picker
            style="width:150px"
            class="mr10"
            size="mini"
            value-format="yyyy-MM"
            v-model="evaluatePeriod"
            type="month"
            filterable
            v-if="roleInfo.includes(`evaluate_period_select`)"
            @change="Topage(1)"
            placeholder="周期选择">
        </el-date-picker>
            <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="evaluateType"
            clearable
            placeholder="类型选择"
            @change="Topage(1)"
            v-if="roleInfo.includes(`evaluate_type_select`)"
            >
            <el-option
                v-for="item in evaluate_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="evaluateStatus"
            clearable
            placeholder="状态选择"
            @change="Topage(1)"
            v-if="roleInfo.includes(`evaluate_status_select`)"
            >
            <el-option
                v-for="item in [{itemValue:'1',itemName:'已考评'},{itemValue:'0',itemName:'待考评'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-button
            icon="el-icon-search"
            class="ml0 mr10"
            v-if="roleInfo.includes(`evaluate_search`)"
            size="mini"
            plain
            @click="Topage(1)"
            >搜索</el-button>
            <el-button
            icon="el-icon-search"
            class="ml0"
            v-if="roleInfo.includes(`evaluate_add`)"
            size="mini"
            plain
            @click="addNew()"
            >新增</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`evaluate_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table
        :data="rows"
        size="mini"
        highlight-current-row
        style="width: 100%"
        >
        <el-table-column min-width="100px" align="center" label="操作" width="150">
            <template slot-scope="scope">
            <el-button
                v-if="roleInfo.includes(`evaluate_edit`)"
                type="text"
                @click="editor(scope.row)"
                title="评估"
                class="el-icon-edit"
            ></el-button>
            </template>
        </el-table-column>
        <el-table-column prop="userName" min-width="100px" align="center" label="姓名"></el-table-column>
        <el-table-column prop="evaluateStatus" min-width="100px" align="center" label="考评状态">
            <template slot-scope="scope">{{scope.row.evaluateStatus === '1' ? '已考评' : '待考评'}}</template>
        </el-table-column>
        <el-table-column prop="evaluatePeriod" min-width="100px" align="center" label="考评周期"></el-table-column>
        <el-table-column prop="evaluateTypeName" min-width="100px" align="center" label="考评类型"></el-table-column>
        <el-table-column prop="evaluateDate" min-width="100px" align="center" label="考评时间"></el-table-column>
        <el-table-column prop="evaluatorName" min-width="100px" align="center" label="考评人"></el-table-column>
        <el-table-column prop="evaluateLevelName" min-width="100px" align="center" label="考评级别"></el-table-column>
        <el-table-column prop="evaluateContent" min-width="100px" align="center" label="考评内容">
            <template slot-scope="scope">
            <el-popover width="400" trigger="hover" :content="scope.row.evaluateContent">
                <span class="w80" slot="reference">{{scope.row.evaluateContent}}</span>
            </el-popover>
            </template>
        </el-table-column>
        <el-table-column prop="evaluateAmount" min-width="100px" align="center" label="考评金额"></el-table-column>
        </el-table>
        <edit :editVisible="editVisible" :userData1="userData" @close="editClose" @submit="editSubmit" />
    </div>
  </d2-container>
</template>
<script>
import xhr from '@/api/sales_assistant'
import api from '@/api/hr'
import mixins from '@/plugin/mixins'
import edit from './components/evaluate_edit.vue'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  mixins: [mixins],
  components: { edit },
  data () {
    return {
      sys_user_type: [],
      roleList: [],
      search: '',
      positionType: '',
      pageNum: 1,
      total: 0,
      pageSize: 400,
      loading: false,
      rows: [],
      editVisible: false,
      widths: '240px',
      userId: '',
      evaluatePeriod: '',
      evaluateType: '',
      evaluateStatus: '',
      userData: {},
      evaluate_level: [],
      evaluate_type: [],
      users: []
    }
  },
  created () {},
  mounted () {
    this.pageInit()
    this.Topage(1)
    xhr.getUserList().then(({ data }) => {
      console.log('人员列表', data)
      const users = [{ userId: '', userName: 'ALL' }, ...data]
      this.users = users
    })
  },
  methods: {
    async pageInit () {
      this.evaluate_type = await this.getDictionary('evaluate_type')
      this.evaluate_level = await this.getDictionary('evaluate_level')
      this.sys_user_type = await this.getDictionary('sys_user_type')
    },
    Topage () {
      const data = {
        search: this.search,
        evaluatePeriod: this.evaluatePeriod,
        evaluateType: this.evaluateType,
        evaluateStatus: this.evaluateStatus,
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.loading = true
      api
        .getEvaluateList(data)
        .then(({ data }) => {
          console.log(data)
          this.pageNum = data.page
          this.total = data.total
          this.rows = data.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    editor (userData) {
      this.userData = userData // ID
      this.editVisible = true
    },
    addNew () {
      this.userId = null
      this.userData = {} // ID
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage(1)
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
<style lang='scss'>
.user {
  .el-table--mini td {
    padding: 0;
  }
}
</style>
