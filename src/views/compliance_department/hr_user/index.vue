
<template>
  <d2-container v-loading="loading">
    <div class="user">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容"
            v-if="roleInfo.includes(`hr_user_search`)"
            clearable
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="positionType"
            clearable
            placeholder="请选择职务"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in sys_user_type"
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
            v-model="dept"
            clearable
            placeholder="请选择部门"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in wst_department"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-cascader
            class="mr10"
            style="width:150px"
            ref="owner"
            :options="entryStatusList"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            v-model="status"
            size="mini"
            clearable
            placeholder="请选择职务状态"
            @change="Topage(1)">
          </el-cascader>
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="wstLevelNum"
            clearable
            placeholder="请选择公司等级"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in wstLevel"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-button
            icon="el-icon-search"
            class="ml0 mr10"
            v-if="roleInfo.includes(`hr_user_search`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>

          <el-button
            icon="el-icon-view"
            class="ml0 mr10"
            v-if="roleInfo.includes(`hr_user_summary`)"
            size="mini"
            plain
            @click="alertSummary()"
          >统计</el-button>

          <el-button
            icon="el-icon-plus"
            class="ml0 mr10"
            v-if="roleInfo.includes(`hr_user_new`)"
            size="mini"
            plain
            @click="newuser"
          >新增</el-button>

          <el-button
            icon="el-icon-edit"
            class=" ml0"
            v-if="roleInfo.includes(`hr_user_editCourse`)"
            size="mini"
            type="primary"
            plain
            @click="editCourseTimes"
          >分配课时</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`hr_user_page`)"
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
      >
        <el-table-column min-width="100px" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`hr_user_edit`)"
              type="text"
              @click="editor(scope.row.userId)"
              title="编辑"
              class="el-icon-edit"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`hr_user_pay`)"
              type="text"
              @click="payAccount(scope.row.userId)"
              class="el-icon-bank-card"
              title="支付账号"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`hr_user_landmark`)"
              type="text"
              @click="landmark(scope.row.userId)"
              class="el-icon-medal"
              title="里程碑"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`hr_user_position`)"
              type="text"
              @click="position(scope.row.userId)"
              class="el-icon-film"
              title="职位"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`hr_user_del`)"
              type="text"
              @click="Delete(scope.row)"
              title="删除"
              class="el-icon-delete"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`hr_user_training`) && !scope.row.trainStatus"
              type="text"
              @click="pass(scope.row)"
              title="通过试用期"
              class="el-icon-check"
            ></el-button>
            <el-button
              v-if="roleInfo.includes(`hr_user_training`) && !scope.row.trainStatus"
              type="text"
              @click="noPass(scope.row)"
              title="不通过试用期"
              class="el-icon-close"
            ></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="userId" min-width="100px" align="center" label="ID"></el-table-column> -->
        <el-table-column prop="userName" min-width="150px" align="center" label="姓名"></el-table-column>
        <el-table-column prop="userAcc" min-width="100px" align="center" label="账号">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`hr_user_reset`)"
              type="text"
              @click="reset(scope.row)"
              :title="scope.row.userAcc"
            >{{scope.row.userAcc || '配置账户'}}</el-button>
            <span v-else>{{scope.row.userAcc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" min-width="100px" align="center" label="性别">
          <template slot-scope="scope">{{sexStatus[scope.row.sex]}}</template>
        </el-table-column>
        <el-table-column prop="companyEmail" min-width="100px" align="center" label="企业邮箱"></el-table-column>
        <el-table-column prop="qyUserId" min-width="100px" align="center" label="企业微信ID"></el-table-column>
        <el-table-column prop="refCode" min-width="100px" align="center" label="推广码"></el-table-column>
        <el-table-column prop="deptName" min-width="100px" align="center" label="部门"></el-table-column>
        <el-table-column prop="wstLevel" min-width="100px" align="center" label="公司级别"></el-table-column>
        <el-table-column
          v-if="roleInfo.includes(`hr_user_wage`)"
          prop="basicWage"
          min-width="100px"
          align="center"
          label="基础薪资"
        >
          <template slot-scope="scope">{{scope.row.basicWage || scope.row.deptBasicWage}}</template>
        </el-table-column>
        <el-table-column prop="office" min-width="100px" align="center" label="office"></el-table-column>
        <!-- <el-table-column prop="positionNames" min-width="150px" align="center" label="职务"></el-table-column> -->
        <el-table-column prop="roleNames" min-width="300px" align="center" label="角色权限"></el-table-column>
        <el-table-column prop="birthday" min-width="100px" align="center" label="生日"></el-table-column>
        <el-table-column prop="hiredate" min-width="100px" align="center" label="入职时间"></el-table-column>
        <el-table-column prop="contractCompanyName" min-width="100px" align="center" label="签约公司"></el-table-column>
        <el-table-column prop="leaveDate" min-width="100px" align="center" label="离职时间"></el-table-column>
        <el-table-column prop="trainStatusName" min-width="100px" align="center" label="是否通过试用期"></el-table-column>
        <el-table-column prop="entryStatus" min-width="100px" align="center" label="职务状态">
          <template slot-scope="scope">{{entryStatus[scope.row.entryStatus]}}
            {{scope.row.trainStatus ? `-` + trainStatus[scope.row.trainStatus] : ""}}</template>
        </el-table-column>
        <el-table-column prop="secondaryValidationName" min-width="100px" align="center" label="二次验证"></el-table-column>
        <el-table-column prop="userStatus" min-width="100px" align="center" label="账号状态" width="100">
          <template slot-scope="scope">{{scope.row.userStatus==1?'已启用':'已禁用'}}</template>
        </el-table-column>
        <el-table-column prop="materialsNum" min-width="100px" align="center" label="档案" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`hr_user_file`)"
              type="text"
              @click="viewFile(scope.row.userId)"
            >查看({{scope.row.materialsNum}})</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="liveToken" min-width="100px" align="center" label="直播课时数"></el-table-column>
        <el-table-column prop="courseToken" min-width="100px" align="center" label="录播课时数"></el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" title="验证秘钥" width="450px" :visible.sync="keyDisplay" :before-close="keyClose">
        <el-form size="medium" ref="formKey" label-width="120px">
          <el-form-item label="秘钥" prop>
            <el-input :style="{width:widths}" v-model="key"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="keyClose">取 消</el-button>
          <el-button type="primary" @click="verifyKey">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="重置账户" width="450px" :visible.sync="display" :before-close="passwordClose">
        <el-form size="medium" :model="formRule" :rules="Rules" ref="formRule" label-width="120px">
          <el-form-item label="用户账号" prop="userAcc">
            <el-input
              :disabled="hasAcc"
              :style="{width:widths}"
              v-model="userAcc"
              :title="'新增用户浏览器可能会自动填充用户名密码，请忽略！'"
              :maxlength="99"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" :style="{width:widths}" v-model="formRule.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input type="password" :style="{width:widths}" v-model="formRule.password2"></el-input>
          </el-form-item>
          <el-form-item label="账号状态" prop="userStatus">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="formRule.userStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in user_status"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="passwordClose">取 消</el-button>
          <el-button type="primary" @click="passwordSubmit">保 存</el-button>
        </div>
      </el-dialog>
      <edit :editVisible="editVisible" :userId="userId" @close="editClose" @submit="editSubmit" />
      <pay-account
        :payAccountVisible="payAccountVisible"
        :userId="userId"
        @close="payAccountClose"
        @submit="payAccountSubmit"
      />
      <landmark
        :landmarkVisible="landmarkVisible"
        :userId="userId"
        @close="landmarkClose"
        @submit="landmarkSubmit"
      />
      <positionList
        :positionVisible="positionVisible"
        :userId="userId"
        @close="positionClose"
        @submit="positionSubmit"
      />
      <view-file
        :viewFileVisible="viewFileVisible"
        :userId="userId"
        @close="viewFileClose"
        @submit="viewFileSubmit"
      />
      <editCourse
        :courseDetailVisible="courseDetailVisible"
        @close="editCourseClose"
        @submit="editCourseSubmit"
      />
      <userSummary
        :userSummaryVisible="userSummaryVisible"
        @close="userSummaryClose"
      />
    </div>
  </d2-container>
</template>
<script>
import xhr from '@/api/sales_assistant'
import api from '@/api/hr'
import api2 from '@/api/user.js'
import mixins from '@/plugin/mixins'
import edit from './components/edit.vue'
import payAccount from './components/pay_account.vue'
import landmark from './components/landmark.vue'
import viewFile from './components/view_file.vue'
import userSummary from './components/user_summary.vue'
import editCourse from './components/edit_course.vue'
import positionList from './components/position_list.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { edit, viewFile, payAccount, landmark, userSummary, editCourse, positionList },
  data () {
    return {
      userSummaryVisible: false,
      courseDetailVisible: false,
      sys_user_type: [],
      pageSize: 400,
      roleList: [],
      salesLevelList: [],
      search: '',
      positionType: '',
      dept: '',
      status: [],
      pageNum: 1,
      user_status: [],
      deptLevelNum: null,
      wstLevelNum: null,
      total: 0,
      loading: false,
      rows: [],
      editVisible: false,
      payAccountVisible: false,
      widths: '240px',
      userId: '', // ID
      hasAcc: '',
      userAcc: '', // 账户
      ruleForm: {
        userAcc: '', // 用户账号
        password: '', // 密码
        // password2: "", // 确认密码
        userName: '', // 姓名
        positionList: [], // 职务
        roleList: [], // 角色
        basicWage: '', // 基本薪资
        salesLevel: '', // 基本薪资
        hiredate: '', // 日期
        birthday: ''
      },
      rules: {
      },
      display: false,
      formRule: {
        password: '',
        password2: '',
        userStatus: null
      },
      Rules: {
      },
      entryStatus: ['待入职', '在职', '已离职'],
      trainStatus: ['未转正', '已转正'],
      entryStatusList: [
        {
          value: '1',
          label: '在职',
          children: [{
            value: '0',
            label: '未转正'
          }, {
            value: '1',
            label: '已转正'
          }]
        },
        { value: '2', label: '离职' }
      ],
      wstLevel: [
        { itemName: '等级一', itemValue: '1' },
        { itemName: '等级二', itemValue: '2' },
        { itemName: '等级三', itemValue: '3' },
        { itemName: '等级四', itemValue: '4' },
        { itemName: '等级五', itemValue: '5' },
        { itemName: '等级六', itemValue: '6' },
        { itemName: '等级七', itemValue: '7' },
        { itemName: '等级八', itemValue: '8' },
        { itemName: '等级九', itemValue: '9' },
        { itemName: '等级十', itemValue: '10' }
      ],
      viewFileVisible: false,
      landmarkVisible: false,
      positionVisible: false,
      key: '',
      keyDisplay: false,
      itemData: {},
      wst_department: [],
      sexStatus: ['', '男', '女']
    }
  },
  created () {
    this.axios()
  },
  computed: {
    ...mapState('role', ['roleInfo']),
  },
  mounted () {
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.user_status = await this.getDictionary('user_status')
    },
    axios () {
      xhr.dicDropdown(['sys_user_type']).then(({ data }) => {
        this.sys_user_type = data.sys_user_type
      })
      api2.getDeptList().then(res => {
        console.log('getDeptList', res)
        this.wst_department = res.data
      })
    },
    Topage () {
      const data = {
        search: this.search,
        positionType: this.positionType,
        dept: this.dept,
        entryStatus: this.status[0],
        trainStatus: this.status[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        wstLevel: this.wstLevelNum
      }
      this.loading = true
      api
        .getUserList(data)
        .then(({ data }) => {
          this.loading = false
          console.log(data)
          this.pageNum = data.page
          this.total = data.total
          this.rows = data.rows
        })
        .catch(() => {
          this.loading = false
        })
    },
    newuser () {
      this.userId = ''
      this.editVisible = true
    },
    editor (userId) {
      this.userId = userId // ID
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage(1)
    },
    payAccount (userId) {
      this.userId = userId // ID
      console.log(userId)
      this.payAccountVisible = true
    },
    payAccountClose () {
      this.payAccountVisible = false
    },
    payAccountSubmit () {
      this.payAccountClose()
      this.Topage(1)
    },
    landmark (userId) {
      this.userId = userId // ID
      this.landmarkVisible = true
    },
    landmarkClose () {
      this.landmarkVisible = false
    },
    positionClose () {
      this.positionVisible = false
    },
    landmarkSubmit () {
      this.landmarkClose()
      this.Topage(1)
    },
    positionSubmit () {
      this.positionClose()
      this.Topage(1)
    },
    alertSummary () {
      this.userSummaryVisible = true
    },
    reset (row) {
      console.log(row)
      this.itemData = { ...row }
      this.keyDisplay = true
    },
    verifyKey () {
      api
        .verifyAccessToken(this.key)
        .then(res => {
          if (res.data) {
            console.log(res)
            this.hasAcc = !!this.itemData.userAcc
            this.userAcc = this.itemData.userAcc
            this.userId = this.itemData.userId
            this.formRule.userStatus = this.itemData.userStatus
            this.display = true
            this.keyClose()
          } else {
            this.$message({
              type: 'error',
              message: '秘钥有误'
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '秘钥有误'
          })
        })
    },
    keyClose () {
      this.keyDisplay = false
      this.key = ''
      // this.passwordClose();
    },
    passwordClose () {
      this.display = false
    },
    passwordSubmit () {
      if (!this.userAcc) {
        this.$message({
          type: 'error',
          message: '账户必填'
        })
        return
      }
      if (this.formRule.password !== this.formRule.password2) {
        this.$message({
          type: 'error',
          message: '密码不一致'
        })
        return
      }
      const data = {
        userId: this.userId,
        userAcc: this.userAcc,
        userStatus: this.formRule.userStatus
      }
      if (this.hasAcc) {
        this.formRule.password && (data.password = this.formRule.password),
        api.setUser({ user: data }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.passwordClose()
          this.Topage(1)
          this.formRule = {
            password: '',
            password2: '',
            userStatus: null
          }
        })
      } else {
        api.checkUserAcc(this.userAcc).then(res => {
          console.log(res)
          if (res.data) {
            this.formRule.password && (data.password = this.formRule.password),
            api.setUser({ user: data }).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.passwordClose()
              this.Topage(1)
              this.formRule = {
                password: '',
                password2: '',
                userStatus: null
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '账户不可用!'
            })
          }
        })
      }
    },
    Delete (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          api.setUser({ user: { delFlag: '1', userId: row.userId } }).then(
            res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.Topage(this.pageNum)
            },
            err => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
              this.Topage(this.pageNum)
            }
          )
        },
        () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      )
    },
    pass (row) {
      this.$confirm('此操作将该用户通过试用期, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          api
            .setUser({
              user: {
                userId: row.userId,
                trainStatus: '1'
              }
            })
            .then(
              res => {
                this.$message({
                  type: 'success',
                  message: '通过试用期成功!'
                })
                this.Topage(this.pageNum)
              },
              err => {
                this.$message({
                  type: 'error',
                  message: '通过试用期失败!'
                })
                this.Topage(this.pageNum)
              }
            )
        },
        () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      )
    },
    noPass (row) {
      console.log(row)
      this.$confirm('此操作将该用户不通过试用期, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          api
            .setUser({
              user: {
                userId: row.userId,
                trainStatus: '0'
              }
            })
            .then(
              res => {
                this.$message({
                  type: 'success',
                  message: '不通过试用期成功!'
                })
                this.Topage(this.pageNum)
              },
              err => {
                this.$message({
                  type: 'error',
                  message: '不通过试用期失败!'
                })
                this.Topage(this.pageNum)
              }
            )
        },
        () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      )
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    viewFile (userId) {
      this.userId = userId
      this.viewFileVisible = true
    },
    viewFileClose () {
      this.viewFileVisible = false
    },
    userSummaryClose () {
      this.userSummaryVisible = false
    },
    viewFileSubmit () {
      this.viewFileClose()
      this.Topage()
    },
    editCourseTimes () {
      this.courseDetailVisible = true
    },
    editCourseClose () {
      this.courseDetailVisible = false
    },
    editCourseSubmit () {
      this.courseDetailVisible = false
      this.Topage()
    },
    position (userId) {
      this.userId = userId
      this.positionVisible = true
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
