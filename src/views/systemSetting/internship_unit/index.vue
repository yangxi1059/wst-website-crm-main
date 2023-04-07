<template>
  <d2-container v-loading="loading">
    <div class="dictionary">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-select
            v-model="recordStatus"
            class="mr10"
            size="mini"
            style="width:150px"
            @change="Topage()"
          >
            <el-option
              v-for="item in recordStatusList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class=""
            v-if="roleInfo.includes(`internship_unit_search`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="mr10"
            v-if="roleInfo.includes(`internship_unit_new`)"
            size="mini"
            plain
            @click="newdic"
          >新增</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`internship_unit_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table :data="tableData" size="mini"  stripe>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" v-if="roleInfo.includes('internship_unit_edit')" size="mini" @click="dicedit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="account(scope.row)">账户</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="internshipDesc" align="center" label="实习单位名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="internshipTimeName" align="center" label="实习周期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="costTypeName" align="center" label="实习成本货币类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="costPrice" align="center" label="实习成本金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="priceUsd" align="center" label="实习金额（$）" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
                <div>{{scope.row.recordStatus == 0?'否' : '是'}}</div>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <payWay
      :payWayVisible="accountVisible"
      :companyData="ruleForm"
      @close="payWayClose"
      @submit="payWaySubmit"
    />
    <edit
      :internshipVisible="internshipVisible"
      :internshipData="ruleForm"
      @close="internshipClose"
      @submit="internshipSubmit"
    />
  </d2-container>
</template>

<script>
import axios from '@/api/dictionary'
import payWay from './components/company_pay_way.vue'
import edit from './components/internship_unit_edit.vue'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { payWay, edit },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      tableData: [],
      COUNTRY: [],
      search: '',
      recordStatus: '1',
      pageNum: 1,
      total: 0,
      internshipVisible: false,
      delVisible: false,
      pageSize: 400,
      isedit: false,
      loading: false,
      ruleForm: {
        internshipId: null,
        internshipName: '',
        priceUsd: '',
        recordStatus: 0
      },
      rules: {
        internshipName: [{ required: true, message: '必填', trigger: 'blur' }],
        priceUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        recordStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      newdicItemValue: '',
      recordStatusList: [
        { itemName: '启用', itemValue: '1' },
        { itemName: '禁用', itemValue: '0' }
      ],
      accountVisible: false
    }
  },
  created () {},
  mounted () {
    this.pageInit()
    this.Topage(1)
    window.dicedit = row => this.dicedit(row)
    window.account = row => this.account(row)
    window.dicDelete = row => this.dicDelete(row)
    window.deleteNewDic = row => this.deleteNewDic(row)
  },
  methods: {
    async pageInit () {
      this.COUNTRY = await this.getDictionary('country')
    },
    Topage () {
      const Data = {
        search: this.search,
        pageNum: this.pageNum,
        recordStatus: this.recordStatus,
        pageSize: this.pageSize
      }
      this.loading = true
      axios.getInternshipList(Data).then(({ data }) => {
        this.loading = false
        console.log('实习单位列表数据：', data)
        this.total = data.total
        this.tableData = data.rows
      })
    },
    newdic () {
      this.internshipVisible = true
      this.ruleForm = { recordStatus: '1', internshipDesc: '' }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 编辑
    dicedit (row) {
      const item = row
      console.log(item, row)
      this.ruleForm = { ...item }
      this.internshipVisible = true
    },
    // 账户
    account (row) {
      const item = row
      console.log(item, row)
      this.ruleForm = { ...item }
      this.accountVisible = true
    },
    // 删除
    dicDelete (row) {
      const item = row
      console.log(item, row)
      this.ruleForm = { ...item }
      this.$confirm(
        `此操作将永久删除该条目, 是否继续? （${item.internshipName}）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const submitData = {
            internshipId: item.internshipId,
            delFlag: 1
          }
          axios
            .setInternshipUnitDicItem(submitData)
            .then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.Topage(1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 提交
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        const submitData = this.ruleForm
        console.log(submitData)
        axios
          .setInternshipUnitDicItem(submitData)
          .then(res => {
            console.log(res)
            this.clone()
            this.Topage(1)
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    clone () {
      this.internshipVisible = false
      this.ruleForm = {
        internshipId: null,
        internshipName: '',
        priceUsd: ''
      }
    },
    payWayClose () {
      this.accountVisible = false
    },
    payWaySubmit () {
      this.payWayClose()
      this.Topage()
    },
    internshipClose () {
      this.internshipVisible = false
    },
    internshipSubmit () {
      this.Topage()
    }
  }
}
</script>
