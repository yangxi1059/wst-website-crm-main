<!--
 * @Author: 杨曦
 * @Date: 2022-08-18 10:02:50
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-27 16:42:29
 * @Version:
 * @Description:
-->
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
            <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`account_list_search`)"
            size="mini"
            plain
            @click="Topage(1)"
            >搜索</el-button>
            <el-button
            icon="el-icon-plus"
            class="mr10"
            v-if="roleInfo.includes(`account_list_new`)"
            size="mini"
            plain
            @click="newdic"
            >新增</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`account_list_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <hot-table :settings="settings" licenseKey="non-commercial-and-evaluation"></hot-table>
        <el-dialog
        :title="'确认删除入账账户字典项'"
        :visible.sync="delVisible"
        width="650px"
        :before-close="clone"
        ></el-dialog>
        <el-dialog :title="'入账账户字典项'" :visible.sync="visible" width="650px" :before-close="clone">
        <el-form
            :model="ruleForm"
            :rules="rules"
            size="mini"
            ref="ruleForm"
            inline
            label-width="95px"
        >
            <el-form-item label-width="150px" label="账户名称" prop="accountName">
            <el-input style="width:300px" v-model="ruleForm.accountName" maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label-width="150px" label="账户状态" prop="accountStatus">
            <el-select
                :style="{width:'300px'}"
                v-model="ruleForm.accountStatus"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in [{itemName:'启用',itemValue:'1'},{itemName:'禁用',itemValue:'0'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label-width="150px" label="账户金额类型" prop>
            <el-select
                :style="{width:'300px'}"
                v-model="currencyType"
                filterable
                multiple
                placeholder="请选择"
            >
                <el-option
                v-for="item in bill_currency_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label-width="150px" label="账户类型" prop="accountType">
            <el-select
                :style="{width:'300px'}"
                v-model="ruleForm.accountType"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in mentor_pay_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="clone">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
        </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import Handsontable from 'handsontable'
import axios from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import util from '@/libs/util'
const roleInfo = util.sessions.get('roleInfo')

const hotbutton = function (instance, td, row, col, prop, value, cellProperties) {
  Handsontable.dom.empty(td)
  let innerHTML = ''
  roleInfo.includes('account_list_edit') &&
    (innerHTML +=
      '<button class="hot-button" onClick="dicedit(' +
      row +
      ')"><i class="el-icon-edit"></i><span>编辑</span> </button>')
  roleInfo.includes('account_list_del') &&
    (innerHTML +=
      '<button class="hot-button" onClick="dicDelete(' +
      row +
      ')"><i class="el-icon-delete"></i><span>删除</span> </button>')
  td.innerHTML = innerHTML
  return td
}
export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      COUNTRY: [],
      search: '',
      pageNum: 1,
      pageSize: 100,
      total: 0,
      loading: false,
      settings: {
        licenseKey: 'non-commercial-and-evaluation',
        height: document.documentElement.clientHeight - 126,
        data: [],
        stretchH: 'all',
        manualColumnResize: true,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '操作',
          '账户名称',
          '账户状态',
          '账户金额类型',
          '账户类型'
        ],
        columns: [
          {
            data: 'accountId',
            type: 'text',
            readOnly: true,
            renderer: hotbutton
          },
          {
            data: 'accountName',
            type: 'text'
          },
          {
            data: 'accountStatusName',
            type: 'text'
          },
          {
            data: 'currencyTypeName',
            type: 'text'
          },
          {
            data: 'accountTypeName',
            type: 'text'
          }
        ]
      },
      visible: false,
      delVisible: false,
      isedit: false,
      currencyType: [],
      ruleForm: {
        accountStatus: null,
        accountType: null,
        accountId: null,
        accountName: null
      },
      rules: {
        accountName: [{ required: true, message: '必填', trigger: 'blur' }],
        currencyType: [{ required: true, message: '必填', trigger: 'blur' }],
        accountType: [{ required: true, message: '必填', trigger: 'blur' }],
        accountStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      newdicItemValue: '',
      bill_currency_type: [],
      mentor_pay_type: []
    }
  },
  created () {
    if (
      !this.roleInfo.includes('account_list_edit') &&
      !this.roleInfo.includes('account_list_del')
    ) {
      this.settings.colHeaders.splice(0, 1)
      this.settings.columns.splice(0, 1)
    }
  },
  mounted () {
    this.Topage(1)
    this.pageInit()
    window.dicedit = row => this.dicedit(row)
    window.dicDelete = row => this.dicDelete(row)
    window.deleteNewDic = row => this.deleteNewDic(row)
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.mentor_pay_type = await this.getDictionary('mentor_pay_type')
      this.COUNTRY = await this.getDictionary('country')
    },
    Topage () {
      this.loading = true
      const Data = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      axios.getAccountDicList(Data).then(({ data }) => {
        this.loading = false
        console.log('入账账户列表数据：', data)
        this.pageNum = data.page
        const rows = data.rows
        this.settings.data = rows
        this.total = data.total
      })
    },
    newdic () {
      this.visible = true
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
      const item = this.settings.data[row]
      console.log(item, row)
      this.ruleForm = { ...item }
      this.currencyType = this.ruleForm.currencyType
        ? this.ruleForm.currencyType.split(',')
        : []
      console.log(this.ruleForm)
      this.visible = true
    },
    // 删除
    dicDelete (row) {
      const item = this.settings.data[row]
      console.log(item, row)
      this.ruleForm = { ...item }
      this.$confirm(
        `此操作将永久删除该条目, 是否继续? （${item.accountName}）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const submitData = {
            accountId: item.accountId,
            delFlag: 1
          }
          axios
            .setAccountDicItem(submitData)
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
        if (!this.currencyType.length) {
          this.$message({
            type: 'warning',
            message: '金额类型不能为空'
          })
          return
        }
        const submitData = {
          accountId: this.ruleForm.accountId,
          accountStatus: this.ruleForm.accountStatus,
          accountName: this.ruleForm.accountName,
          accountType: this.ruleForm.accountType,
          currencyArr: this.currencyType
        }
        console.log(submitData)
        this.$loading()
        if (submitData.accountId) {
          axios
            .setAccountDicItem(submitData)
            .then(res => {
              this.$loading().close()
              console.log(res)
              this.clone()
              this.Topage(1)
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          axios
            .addAccountDicItem(submitData)
            .then(res => {
              console.log(res)
              this.$loading().close()
              this.clone()
              this.Topage(1)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    clone () {
      this.visible = false
      this.currencyType = []
      this.ruleForm = {
        accountStatus: null,
        accountType: null,
        accountId: null,
        accountName: null
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
