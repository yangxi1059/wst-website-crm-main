<template>
  <d2-container v-loading="loading" >
    <div class="role">
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
            v-if="roleInfo.includes(`role_search`)"
            class=""
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            v-if="roleInfo.includes(`role_new`)"
            class=""
            size="mini"
            plain
            @click="rolevisible = true"
          >新增</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`role_page`)"
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
        :max-height="height"
        border
        style="width: 100%"
      >
        <el-table-column prop="roleName" align="center" label="角色名称" min-width="200"></el-table-column>
        <el-table-column prop="note" align="center" label="备注" min-width="180"></el-table-column>
        <el-table-column prop="creater" align="center" label="创建人" min-width="200"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" min-width="200"></el-table-column>
        <el-table-column prop="updater" align="center" label="更新人" min-width="200"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="更新时间" min-width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="400" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="roleInfo.includes(`role_edit`)" type="text" @click="editor(scope.row)">编辑</el-button>
            <el-button
              v-if="roleInfo.includes(`role_ablot`)"
              type="text"
              @click="accredit(scope.row)"
            >分配CRM权限</el-button>
            <el-button
              type="text"
              @click="mobileAccredit(scope.row)"
            >分配酒屋权限</el-button>
            <el-button
              v-if="roleInfo.includes(`role_set`)"
              type="text"
              @click="setuser(scope.row)"
            >设置用户</el-button>
            <el-button v-if="roleInfo.includes(`role_del`)" type="text" @click="Delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align label min-width="1" fixed="right"></el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false"
        :title="roleId!==''?'编辑角色':'新增角色'"
        :visible.sync="rolevisible"
        width="450px"
        :before-close="handleClose"
      >
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input :style="{width:widths}" v-model="ruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              resize="none"
              :rows="3"
              type="textarea"
              :style="{width:widths}"
              v-model="ruleForm.note"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <purviewtree
        :roleId="roleId"
        :infoRole="infoRole"
        :display="display"
        @callbackFun="callbackFun"
      />
      <mobile
        :roleId="roleId"
        :displayMobile="displayMobile"
        :roleInfoData="roleInfoData"
        @callbackFun="callbackFun1"
      />
      <set-users
        :roleId="roleId"
        :userVisible="userVisible"
        @close="setUserClose"
        @submit="setUserSubmit"
      />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/role'
import purviewtree from './components/purviewtree'
import mobile from './components/mobile'
import setUsers from './components/set_users'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { purviewtree, setUsers, mobile },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名称'))
      } else {
        callback()
      }
    }
    return {
      height: document.documentElement.clientHeight - 190,
      search: '',
      roleIds: [],
      rolevisible: false,
      pageNum: 1,
      pageSize: 100,
      total: 0,
      loading: false,
      rows: [],
      widths: '240px',
      roleId: '', // ID
      roleInfoData: '',
      ruleForm: {
        roleName: '', // 角色名称
        note: '' // 备注
      },
      rules: {
        roleName: [{ required: true, validator: validateName, trigger: 'blur' }]
      },
      display: false,
      displayMobile: false,
      infoRole: [],
      userVisible: false
    }
  },
  created () {
    this.Topage(1)
  },
  mounted () {
    // let str = ''
    // this.roleInfo.split(',').forEach(e => {
    //   str = str ? `${str},${e.roleInfo}` : e.roleInfo
    //   !this.roleIds.includes(e.roleId) && this.roleIds.push(e.roleId)
    // })
    // console.log(this.roleIds, 1111111111111111)
  },
  methods: {
    Topage () {
      this.displayMobile = false
      const data = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.loading = true
      api
        .roleList(data)
        .then(({ data }) => {
          this.pageNum = data.page
          this.total = data.total
          const rows = data.rows
          rows.map(e => {
            e.roleIds = e.roleIds === undefined ? '' : e.roleIds
            e.basicWage = e.basicWage === undefined ? '' : e.basicWage
            e.hiredate = e.hiredate === undefined ? '' : e.hiredate
          })
          this.rows = rows
          console.log('角色管理列表数据：', rows)
          this.loading = false
        })
        .catch(() => {
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
    editor (row) {
      this.roleId = row.roleId // ID
      this.ruleForm = {
        roleName: row.roleName, // 角色名称
        note: row.note // 备注
      }
      this.rolevisible = true
    },
    handleClose () {
      this.rolevisible = false
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      this.roleId = '' // ID
      this.ruleForm = {
        roleName: '', // 角色名称
        note: '' // 备注
      }
      this.infoRole = []
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        const ruleForm = this.ruleForm
        if (this.roleId === '') {
          api.saveRoler(ruleForm).then(({ data }) => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.pageNum = 1
            this.Topage(this.pageNum)
            this.handleClose()
          })
        } else {
          ruleForm.roleId = this.roleId
          api.saveRoler(ruleForm).then(({ data }) => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.Topage(this.pageNum)
            this.handleClose()
          })
        }
      })
    },
    accredit (row) {
      this.infoRole =
        !row.roleInfo || /^\ *$/.test(row.roleInfo)
          ? []
          : row.roleInfo.split(',')
      this.roleId = row.roleId
      this.display = true
    },
    mobileAccredit (row) {
      this.roleId = row.roleId
      if (row.mpRoleInfo) {
        this.roleInfoData = JSON.parse(row.mpRoleInfo)
      } else {
        this.roleInfoData = ''
      }
      console.log(row, this.displayMobile, this.roleInfoData)
      this.displayMobile = true
    },
    callbackFun (val) {
      this.display = false
      if (!val) return
      console.log(this.roleIds)
      this.Topage(this.pageNum)
      this.handleClose()
    },
    callbackFun1 (val) {
      this.displayMobile = false
      if (!val) return
      this.Topage(this.pageNum)
      this.handleClose()
    },
    setuser (row) {
      this.roleId = row.roleId
      this.userVisible = true
    },
    useropen () {},
    setUserClose () {
      console.log('setUserClose')
      this.userVisible = false
    },
    setUserSubmit () {
      console.log('setUserSubmit')
      this.setUserClose()
    },
    Delete (row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            message: '该功能暂未开放',
            type: 'warning'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang='scss'>
.role {
  .el-table--mini td {
    padding: 0;
  }
}
</style>
