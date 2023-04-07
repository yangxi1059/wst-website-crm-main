<template>
  <d2-container v-loading="loading" >
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
      <div class="search">
          <el-select
          style="width:150px"
          v-if="roleInfo.includes(`wx_select`)"
          class="mr10"
          size="mini"
          filterable
          clearable
          v-model="userId"
          placeholder="请选择"
          @change="Topage(1)"
          >
          <el-option-group
              v-for="group in users"
              :key="group.userName"
              :label="group.userName">
              <el-option
              v-for="item in group.options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
              </el-option>
          </el-option-group>
          </el-select>
          <el-input
          class="mr10"
          v-if="roleInfo.includes(`wx_search`)"
          size="mini"
          style="width:150px"
          v-model="search"
          clearable
          placeholder="支持微信ID"
          @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-button
          v-if="roleInfo.includes(`wx_search`)"
          icon="el-icon-search"
          class=""
          size="mini"
          plain
          @click="Topage(1)"
          >GO</el-button>
          <el-button
          icon="el-icon-edit"
          v-if="roleInfo.includes(`wx_entry`)"
          class=""
          size="mini"
          plain
          @click="display = true"
          >新增</el-button>
          <el-button
          icon="el-icon-printer"
          v-if="roleInfo.includes(`wx_outFile`)"
          class=""
          size="mini"
          plain
          @click="exportFile('table')"
          >导出</el-button>
      </div>
      <pagination
          v-if="roleInfo.includes(`wx_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
      ></pagination>
      </div>
      <hot-table :settings="settings" licenseKey="non-commercial-and-evaluation" ref="table"></hot-table>
      <el-dialog :close-on-click-modal="false" title="分配历史" @submit.native.prevent :visible.sync="historyVisit" width="400px">
      <el-timeline :reverse="reverse">
          <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.allotTime"
          >由 {{activity.operator}} 分配给 {{activity.manager}}</el-timeline-item>
      </el-timeline>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="display" width="900px" :before-close="handleClose">
      <el-form
          :inline="true"
          size="mini"
          :model="ruleForm"
          :rules="wxIdrules"
          ref="ruleForm"
          label-width="160px"
      >
          <el-form-item label="所持微信号的名字" prop="wxName">
          <el-input :style="{width:widths}" v-model="ruleForm.accountName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="微信ID:" prop="wxId">
          <el-input :style="{width:widths}" v-model="ruleForm.wxId" maxlength="59"></el-input>
          </el-form-item>
          <el-form-item label="使用者账号" prop>
          <el-select
              :style="{width:widths}"
              v-model="ruleForm.manageBy"
              filterable
              placeholder="请选择使用者"
          >
              <el-option-group
              v-for="group in user"
              :key="group.userName"
              :label="group.userName">
              <el-option
                  v-for="item in group.options"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
              </el-option>
              </el-option-group>
          </el-select>
          </el-form-item>
          <el-form-item label="状态" prop>
          <el-select
              :style="{width:widths}"
              v-model="ruleForm.accountStatus"
              filterable
              placeholder="请选择状态"
          >
              <el-option
              v-for="item in Common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
              ></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop>
          <el-select
              :style="{width:widths}"
              v-model="ruleForm.dept"
              filterable
              placeholder="请选择使用者"
          >
              <el-option
              v-for="item in wst_department"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
              ></el-option>
          </el-select>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="分配" :visible.sync="dialogVisible" width="900px" :before-close="handleClose">
        <el-form :inline="true" size="mini" :model="ruleForm" ref="ruleForm" label-width="160px">
            <el-form-item label="账号ID" prop="mobile">
            <el-input :style="{width:widths}" :disabled="true" v-model="ruleForm.accountId"></el-input>
            </el-form-item>
            <el-form-item label="所持微信号的名字" prop="wxName">
            <el-input :style="{width:widths}" v-model="ruleForm.accountName" maxlength="59"></el-input>
            </el-form-item>
            <el-form-item label="微信ID:" prop>
            <el-input :style="{width:widths}" :disabled="true" v-model="ruleForm.wxId"></el-input>
            </el-form-item>
            <el-form-item label="使用者账号" prop>
            <el-select
                :style="{width:widths}"
                v-model="ruleForm.manageBy"
                filterable
                placeholder="请选择使用者"
            >
                <el-option-group
                v-for="group in user"
                :key="group.userName"
                :label="group.userName">
                <el-option
                    v-for="item in group.options"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
                </el-option>
                </el-option-group>
            </el-select>
            </el-form-item>
            <el-form-item label="微信密码" prop="password">
            <el-input :style="{width:widths}" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop>
            <el-select
                :style="{width:widths}"
                v-model="ruleForm.accountStatus"
                filterable
                placeholder="请选择状态"
            >
                <el-option
                v-for="item in Common_yes_or_no"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible" width="900px" :before-close="editClose">
        <el-form :inline="true" size="mini" :model="ruleForm" ref="ruleForm" label-width="160px">
            <el-form-item label="账号ID" prop="mobile">
            <el-input :style="{width:widths}" :disabled="true" v-model="ruleForm.accountId"></el-input>
            </el-form-item>
            <el-form-item label="绑定手机号" prop="mobile">
            <el-input :style="{width:widths}" v-model="ruleForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="微信ID:" prop="wxId">
            <el-input :style="{width:widths}" v-model="ruleForm.wxId" maxlength="59"></el-input>
            </el-form-item>
            <!-- <el-form-item label="微信ID:" prop>{{ruleForm.wxId}}</el-form-item> -->
            <el-form-item label="好友人数" prop="friendNum">
            <el-input-number :controls="false" :style="{width:widths}" v-model="ruleForm.friendNum"></el-input-number>
            </el-form-item>
            <el-form-item label="所属部门" prop>
            <el-select
                :style="{width:widths}"
                v-model="ruleForm.dept"
                filterable
                placeholder="请选择使用者"
            >
                <el-option
                v-for="item in wst_department"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editClose">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import Handsontable from 'handsontable'
import api from '@/api/sales_assistant'
import api2 from '@/api/user.js'
import mixins from '@/plugin/mixins'
import { renderShortText } from '@/libs/tableRender.js'
import { setTimeout } from 'timers'
import { fmtDate } from '@/libs/file'
import util from '@/libs/util'
import { mapState } from 'vuex'
const roleInfo = util.sessions.get('roleInfo')
console.log(roleInfo)
const hotbutton = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  if (roleInfo.includes('wx_edit')) { td.innerHTML += `<el-button type="primary" class='hot-button mr10' onclick='streamWxEdit(${row})'><i class="el-icon-edit"></i>编辑</el-button>` }
  if (roleInfo.includes('wx_allot')) { td.innerHTML += `<el-button type="primary" class='hot-button mr10' onclick='streamWxAllot(${row})'><i class="el-icon-edit"></i>分配</el-button>` }
  if (roleInfo.includes('wx_view')) { td.innerHTML += `<el-button type="primary" class='hot-button mr10' onclick='streamWxView(${row})'><i class="el-icon-view"></i>查看</el-button>` }
  if (roleInfo.includes('wx_view')) { td.innerHTML += `<el-button type="primary" class='hot-button' onclick='streamWxDelete(${row})'><i class="el-icon-view"></i>删除</el-button>` }
  return td
}
const accountStatus = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  if (value == 1) {
    td.innerHTML = '是'
  } else if (value == 0) {
    td.innerHTML = '否'
  }
  return td
}

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.settings.height = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  data () {
    return {
      loading: false,
      Common_yes_or_no: [],
      search: '',
      sort: '',
      sortCol: '',
      userId: '',
      users: [],
      user: [],
      pageSize: 400,
      pageNum: 1,
      total: 0,
      settingsAPIData: [],
      settings: {
        height: 'auto',
        copyable: false,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        columnSorting: true,
        
        fillHandle: false,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '操作',
          '账号ID',
          '微信ID',
          '微信名',
          '是否启用',
          '绑定手机号',
          '好友人数',
          '所属部门',
          '所有者',
          '创建人',
          '创建时间',
          '最近修改人',
          '最近操作时间'
        ],
        readOnly: true,
        columns: [
          {
            data: 'hotbutton',
            renderer: hotbutton
          },
          {
            data: 'accountId',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'wxId',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'accountName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'accountStatus',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: accountStatus
          },
          {
            data: 'mobile',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'friendNum',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'deptName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'manageByName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'createByName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "创建人",
          },
          {
            data: 'createTime',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "创建时间",
          },
          {
            data: 'updateByName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "最近修改人",
          },
          {
            data: 'updateTime',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "最近操作时间",
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.Topage(this.pageNum)
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data
            this.sort = newVal[0].sortOrder
            this.settings.data = []
            // 解决默认排序事件导致的数据闪屏
            for (let i = 0; i < this.pageSize; i++) {
              this.settings.data.push({})
            }
            if (this.sortCol === 'hotbutton') return
            this.Topage(this.pageNum)
          }
        }
      },
      display: false,
      wxIdrules: {
        wxId: [{ required: true, message: '请输入微信ID', trigger: 'blur' }]
      },
      dialogVisible: false,
      editVisible: false,
      widths: '230px',
      ruleForm: {
        accountName: '', // 微信名
        accountId: '', // 微信ID
        wxId: '', // 微信ID
        password: '', // password
        accountStatus: '1', // 微信状态
        manageBy: '', // 使用者
        dept: ''
      },
      reverse: true,
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ],
      historyVisit: false,
      wst_department: []
    }
  },
  created () {
    if (
      !this.roleInfo.includes('wx_edit') &&
      !this.roleInfo.includes('wx_view') &&
      !this.roleInfo.includes('wx_allot')
    ) {
      this.settings.colHeaders.splice(0, 1)
      this.settings.columns.splice(0, 1)
    }
    this.loading = true
  },
  mounted () {
    this.pageInit()
    window.streamWxEdit = row => this.streamWxEdit(row)
    window.streamWxAllot = row => this.streamWxAllot(row)
    window.streamWxView = row => this.streamWxView(row)
    window.streamWxDelete = row => this.streamWxDelete(row)
    this.axios()
    this.Topage(1)
    api2.getDeptList().then(res => {
      console.log('getDeptList', res)
      this.wst_department = res.data
    })
  },
  methods: {
    async pageInit () {
      this.Common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    axios () {
      const data = {
        pageNum: 1,
        pageSize: 9999
      }
      const arr1 = []
      const arr2 = []
      const arr3 = []
      api.getAllUserList(data).then(res => {
        console.log(res.data.rows, 11111111111111)
        for (let i = 0; i < res.data.rows.length; i++) {
          if (res.data.rows[i].entryStatus == 1) {
            arr1.push(res.data.rows[i])
          }
          if (res.data.rows[i].entryStatus == 0) {
            arr2.push(res.data.rows[i])
          }
          if (res.data.rows[i].entryStatus == 2) {
            arr3.push(res.data.rows[i])
          }
        }
        console.log(arr1, arr2, arr3, 222222222222)
        this.users = [{
          userName: '在职的',
          options: arr1
        },
        {
          userName: '待入职',
          options: arr2
        },
        {
          userName: '已离职',
          options: arr3
        }]
        this.user = JSON.parse(JSON.stringify(this.users))
        console.log(this.user)
      })
    },
    Topage () {
      this.loading = true
      const data = {
        sort: this.sort,
        sortCol: this.sortCol,
        search: this.search,
        userId: this.userId || 'ALL_Data',
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      api.getOfficialAccountList(data).then(({ data }) => {
        this.pageNum = data.page
        const rows = data.rows
        this.settingsAPIData = JSON.parse(JSON.stringify(data.rows))
        this.settings.data = rows
        console.log(this.settings.data)
        this.total = data.total
        this.updatelist = []
        this.$forceUpdate()
        this.loading = false
      })
    },
    streamWxDelete (row) {
      const data = this.settingsAPIData[row]
      console.log(data)
      const submitData = {
        accountId: data.accountId,
        delFlag: 1
      }
      this.$confirm('此操作删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.updateAccount(submitData).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.Topage()
        })
      })
    },
    // 打开分配微信号弹框
    streamWxAllot (row) {
      const data = this.settingsAPIData[row]
      console.log(data)
      api.getAccountDetailByAccountId(data.accountId).then(res => {
        console.log(res)
        this.ruleForm = {
          accountName: res.data.accountName, // 微信名
          password: res.data.password, //
          accountId: res.data.accountId, // 微信ID
          wxId: res.data.wxId, // 微信ID
          accountStatus: res.data.accountStatus, // 微信状态
          manageBy: res.data.manageBy // 使用者
        }
      })

      this.dialogVisible = true
    },
    // 打开编辑微信号弹框
    streamWxEdit (row) {
      const data = this.settingsAPIData[row]
      console.log(data)
      this.ruleForm = {
        mobile: data.mobile, // 微信名
        accountId: data.accountId, // 微信ID
        wxId: data.wxId, // 微信ID
        friendNum: data.friendNum, // 微信状态
        dept: data.dept // 使用者
      }

      this.editVisible = true
    },
    // 查看微信分配历史
    streamWxView (row) {
      const data = this.settings.data[row]
      console.log(data)
      api.getAccountHistoryListByAccountId(data.accountId).then(res => {
        console.log('微信分配历史：', res)
        res.data.forEach(v => {
          v.allotTime = fmtDate(v.allotTime, 'yyyy-MM-dd,hh:mm')
        })
        this.activities = res.data
        this.historyVisit = true
      })
    },

    cencel () {
      this.display = false
    },
    // 录入微信号
    confirm () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        // 引用型数据直接深层赋值，会导致无法响应
        console.log(this.ruleForm)
        this.ruleForm.accountId = this.ruleForm.wxId
        api
          .createAccount(this.ruleForm)
          .then(res => {
            console.log('创建', res)
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.Topage(1)
            this.handleClose()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '创建失败，请确认该微信是否已存在'
            })
          })
      })
    },
    handleClose () {
      this.dialogVisible = false
      this.display = false
      setTimeout(() => {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {
          accountName: '', // 微信名
          accountId: '', // 微信ID
          wxId: '', // 微信ID
          password: '', //
          accountStatus: '1', // 微信状态
          manageBy: '' // 使用者
        }
      }, 200)
    },
    editClose () {
      this.editVisible = false
      setTimeout(() => {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {}
      }, 200)
    },
    editSubmit () {
      console.log(this.ruleForm)
      api.updateAccount(this.ruleForm).then(res => {
        console.log('更新微信', res)
        this.Topage(1)
      })
      this.editClose()
    },
    // 编辑
    submit () {
      const data = JSON.parse(JSON.stringify(this.ruleForm))
      console.log(data)
      for (let i = 0; i < this.settingsAPIData.length; i++) {
        if (data.accountId === this.settingsAPIData[i].accountId) {
          if (data.manageBy !== this.settingsAPIData[i].manageBy) {
            api
              .updateAccountManager({
                accountId: data.accountId,
                manageBy: data.manageBy
              })
              .then(res => {
                console.log('使用者更新', res)
                this.Topage(1)
              })
          } else {
            api
              .updateAccount({
                accountId: data.accountId,
                accountStatus: data.accountStatus,
                password: data.password,
                accountName: data.accountName
              })
              .then(res => {
                console.log('更新微信', res)
                this.Topage(1)
              })
          }
          this.handleClose()
          break
        }
      }
      // setTimeout(this.Topage(1), 1000);
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 导出文件
    exportFile (e) {
        // 拿handsontable实例
      const handsontable = this.$refs[e].$data.hotInstance
      console.log(handsontable)
      const fileName = '导流微信列表_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename:
          fileName +
          this.userInfo.userName +
          '_' +
          this.userId +
          '_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    }
  }
}
</script>

<style lang="scss">
.sales_assistant {
  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
</style>
