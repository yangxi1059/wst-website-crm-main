<template>
  <d2-container v-loading="loading">
    <div class="sales_assistant">
        <div class="search_page">
        <div class="search">
            <el-select
            style="width:150px"
            class="mr10"
            size="mini"
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
            <el-input
            class="mr10"
            v-if="roleInfo.includes(`assistant_follow_up_search`)"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持姓名、微信名、微信ID、学校"
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-button
            v-if="roleInfo.includes(`assistant_follow_up_search`)"
            icon="el-icon-search"
            class="ml0 mr10"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
            <el-button
            icon="el-icon-printer"
            v-if="roleInfo.includes(`assistant_follow_up_outFile`)"
            class="ml0 mr10"
            size="mini"
            plain
            @click="exportFile('table')"
            >导出</el-button>
            <el-button
            v-if="followUpIdNum === 0"
            class="ml0 mr10"
            size="mini"
            plain
            @click="followUp()"
            >今天需跟进({{followUpIdNum}})</el-button>
            <el-button v-else class="ml0 mr10" size="mini" plain @click="followUp()">
            今天需跟进
            <span class="redBlod">({{followUpIdNum}})</span>
            </el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`assistant_follow_up_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <hot-table :settings="settings" licenseKey="non-commercial-and-evaluation" ref="table"></hot-table>
        <el-dialog
        title="录入"
        @submit.native.prevent
        v-if="roleInfo.includes(`sales_assistant_entry`)"
        :visible.sync="display"
        width="400px"
        >
        <el-form :model="wxIdruleForm" :rules="wxIdrules" ref="wxIdruleForm" label-width="80px">
            <el-form-item label="微信ID" prop="wxId">
            <el-input
                style="width:240px"
                size="mini"
                clearable
                v-model="wxIdruleForm.wxId"
                @keyup.enter.native="confirm()"
            ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cencel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 录入信息弹框 -->
        <!-- <inputInformation
        :ruleForm="ruleForm"
        :dialogVisible="dialogVisible"
        @success="inputInformationSuccess"
        @close="inputInformationClose"
        ></inputInformation> -->
        <follow_up
        :followUpMemberList="followUpMemberList"
        :followUpIdList="followUpIdList"
        :toFollowUpList="toFollowUpList"
        :followUpVisible="followUpVisible"
        :position="position"
        @close="followUpClose"
        @updata="followUpUpdata"
        ></follow_up>
        <el-drawer
        size="1400px"
        title="Follow Up详情"
        :visible.sync="followVisible"
        :before-close="closeDetail"
        >
            <follow :menteeId="menteeData.menteeId" :followVisible="followVisible" @close="followClose" @updata="followUpdata"></follow>
        </el-drawer>
    </div>
  </d2-container>
</template>

<script>
// import inputInformation from './components/inputInformation.vue'
import follow from '../mentee/components/Follow.vue'
import follow_up from './components/follow_up_new.vue'
import Handsontable from 'handsontable'
import api from '@/api/sales_assistant'
import { downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'
import { renderShortText } from '@/libs/tableRender.js'
import { mapState } from 'vuex'

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
  td.innerHTML = ''
//   td.innerHTML += `<button class='hot-button ' onclick='assistantentry(${row})' title='编辑'><i class="el-icon-edit"></i><span></span></button>`
  td.innerHTML += `<button class='hot-button ' onclick='toFollowUp(${row})' title='follow up'><i class="el-icon-mobile"></i><span></span></button>`
  return td
}
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
  components: { follow, follow_up },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      major: [],
      mentee_type: [],
      mentee_sign_status: [],
      search: '',
      sort: '',
      sortCol: '',
      userId: '',
      counselorStatus: '',
      users: [],
      pageNum: 1,
      pageSize: 400,
      loading: false,
      total: 0,
      settingsAPIData: [],
      settings: {
        height: document.documentElement.clientHeight - 120,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '操作',
          '微信名',
          '微信ID',
          '学员名',
          '家长一微信ID',
          '家长一微信名',
          '家长二微信ID',
          '家长二微信名',
          'follow人姓名',
          '开始follow日期',
          '截止follow日期',
          '导流微信号',
          '首次咨询日期'
        ],
        readOnly: true,
        columns: [
          {
            data: 'hotbutton',
            renderer: hotbutton
          },
          {
            data: 'wxName',
            // title: "微信名",
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'wxId',
            width: 50,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "微信ID",
          },
          {
            data: 'menteeName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "学员名",
          },
          {
            data: 'parentWx1',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'parentWxName1',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'parentWx2',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'parentWxName2',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'followByName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'beginDate',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'endDate',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'sourceWxName'
            // title: "分配顾问",
          },
          {
            data: 'firstAskDate'
            // title: "分配顾问日期",
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.pageNum = 1
            this.Topage(this.pageNum)
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data
            this.sort = newVal[0].sortOrder
            this.pageNum = 1
            if (this.sortCol === 'hotbutton') return
            this.Topage(this.pageNum)
          }
        }
      },
      display: false,
      wxIdruleForm: {
        wxId: ''
      },
      wxIdrules: {
        wxId: [{ required: true, message: '请输入微信ID', trigger: 'blur' }]
      },
      dialogVisible: false,
      // 录入弹框数据
      ruleForm: {
        menteeId: '', // ID
        wxName: '', // 微信名
        wxId: '', // 微信ID
        school: '', // 学校
        email: '', // 邮箱
        degree: '', // 学历
        finishYear: '', // 毕业年份
        major: [], // 专业
        country: '', // 国家
        askFor: '', // 咨询方向
        signStatus: '', // 是否签约
        firstAskDate: '', // 首次联系日期
        counselorStatus: '', // 是否分配顾问
        counselorGroup: '', // 分配部门
        counselor: '', // 分配顾问
        counselorDate: '', // 分配顾问日期
        counselorReplay: '', // 顾问是否24小时回复
        sourceFrom: '', // 来源
        sourceWx: '', // 导流微信号
        specialNature: '', // 特殊性质（家长、讲座等）
        storageStatus: '',
        resume: '', // 简历
        resume1: '', // 简历流
        note: '' // 咨询进度,
      },
      // follow up 弹框数据
      followUpVisible: false,
      followUpIdList: [],
      toFollowUpList: [],
      followUpMemberList: [],
      followUpIdNum: 0,
      position: 'sales_assistant',
      followMemberId: '',
      followVisible: false,
      menteeData: {}
    }
  },
  created () {},
  mounted () {
    window.assistantentry = row => this.assistantentry(row)
    window.toFollowUp = row => this.toFollowUp(row)
    window.assistantdel = row => this.assistantdel(row)
    window.assistantdownload = row => this.assistantdownload(row)
    this.axios()
    this.userId = 'ALL'
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.major = await this.getDictionary('major')
      this.mentee_type = await this.getDictionary('mentee_type')
      this.mentee_sign_status = await this.getDictionary('mentee_sign_status')
    },
    axios () {
      api
        .subordinate(this.userInfo.userId, 'sales_assistant')
        .then(({ data }) => {
          const users = [
            { userId: 'ALL', userName: 'ALL' },
            { userId: this.userInfo.userId, userName: this.userInfo.userName }
          ]
          if (this.roleInfo.includes('follow_up_ALL_Data')) {
            users.unshift({ userId: 'ALL_Data', userName: 'ALL（全部数据）' })
          }
          data.forEach(e => {
            if (!users.some(em => em.userId == e.userId)) {
              users.push(e)
            }
          })
          this.users = users
        })
    },
    // 拿follow up 数据
    getFollowUpMenteeIdListByUserId () {
      api
        .getFollowUpMenteeIdListByUserId({
          position: 'sales_assistant',
          userId: this.userInfo.userId
        })
        .then(res => {
          console.log('拿follow up menteeId list 数据', res)
          let number = 0
          res.data.member.forEach(v => {
            number += v.userCount
          })
          this.followUpIdNum = number
          this.followUpIdList = []
          this.toFollowUpList = []
          this.followUpMemberList = res.data.member
          // this.followUpMemberList.unshift({
          //   userName: this.userInfo.userName,
          //   userCount: res.data.count
          // });
          res.data.list.forEach(v => {
            this.followUpIdList.push(v.menteeId)
          })
          res.data.member.forEach(v => {
            v.userFollowUpList &&
              this.toFollowUpList.push(...v.userFollowUpList)
          })
        })
        .catch(err => {
          console.log('拿follow up 数据', err)
        })
    },
    Topage () {
      this.loading = true
      const data = {
        sort: this.sort,
        sortCol: this.sortCol,
        search: this.search,
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        pageType: 'sales_assistant'
      }
      console.log(data)
      this.followUpUpdata()
      api.getFollowUpListSalesAssistant(data).then(({ data }) => {
        this.pageNum = data.page
        const rows = data.rows
        this.settingsAPIData = JSON.parse(JSON.stringify(data.rows))
        console.log(rows, 'yxfollow up 787879878')
        this.settings.data = rows
        this.total = data.total
        this.loading = false
      })
    },
    // 编辑-弹框
    assistantentry (row) {
      const data = this.settingsAPIData[row]
      this.ruleForm = {
        menteeId: data.menteeId // iD
      }
      this.dialogVisible = true
    },
    // 删除该条记录
    assistantdel (row) {
      const data = this.settings.data[row]
      if (data.createBy !== this.userInfo.userName) {
        this.$message({
          type: 'warning',
          message: '无法删除，你不是该录入记录创建人！'
        })
        return
      }
      if (data.createTime) {
        let createTime = data.createTime
        createTime = createTime.replace(/-/g, '/')
        createTime = new Date(createTime).getTime() + 604800000
        if (createTime < new Date().getTime()) {
          this.$message({
            type: 'warning',
            message: '无法删除，录入时间超过一周！'
          })
          return
        }
      }
      this.$confirm('此操作将永久删除该录入记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(data.menteeId)
          api
            .deleteMenteeByMenteeId({
              delFlag: '1',
              menteeId: data.menteeId
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.Topage(this.pageNum)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查看简历
    assistantdownload (row) {
      const resume = this.settings.data[row].resume1
      downloadFun(resume, url => {
        window.open(url)
      })
    },
    // 录入微信Id，取消
    cencel () {
      this.display = false
    },
    // 录入微信Id，确认
    confirm () {
      this.$refs.wxIdruleForm.validate(valid => {
        if (!valid) return
        // 引用型数据直接深层赋值，会导致无法响应
        api.wxId(this.wxIdruleForm.wxId).then(({ data }) => {
          if (data === null) {
            this.ruleForm.wxId = this.wxIdruleForm.wxId
          } else {
            this.ruleForm = {
              menteeId: data.menteeId, // iD
              wxName: data.wxName, // 微信名
              wxId: data.wxId, // 微信ID
              menteeType: data.menteeType, // 身份
              school: data.school, // 学校
              email: data.email, // 邮箱
              degree: data.degree, // 学历
              finishYear: data.finishYear, // 毕业年份
              major: data.major, // 专业
              country: data.country, // 国家
              askFor: data.askFor, // 咨询方向
              signStatus: data.signStatus, // 是否签约
              firstAskDate: data.firstAskDate, // 首次联系日期
              counselorStatus: data.counselorStatus, // 是否分配顾问
              counselorGroup: data.counselorGroup, // 分配部门
              counselor: data.counselor, // 分配顾问
              counselorDate: data.counselorDate, // 分配顾问日期
              counselorReplay: data.counselorReplay, // 顾问是否24小时回复
              sourceFrom: data.sourceFrom, // 来源
              sourceWx: data.sourceWx, // 导流微信号
              storageStatus: data.storageStatus, // 人才库
              specialNature: data.specialNature, // 特殊性质（家长、讲座等）
              resume: data.resume, // 简历
              resume1: data.resume1, // 简历
              note: data.note // 咨询进度
            }
            if (this.ruleForm.major) {
              this.ruleForm.major = this.ruleForm.major.split(',')
            } else {
              this.ruleForm.major = []
            }
            console.log(this.ruleForm.major)
          }
          this.dialogVisible = true
        })
      })
    },
    // 录入信息弹框提交后
    inputInformationSuccess () {
      this.Topage(this.pageNum)
      this.cencel()
    },
    // 录入信息弹框关闭
    inputInformationClose () {
      this.dialogVisible = false
      this.ruleForm = {
        menteeId: '', // ID
        wxName: '', // 微信名
        wxId: '', // 微信ID
        menteeType: '',
        school: '', // 学校
        email: '', // 邮箱
        degree: '', // 学历
        finishYear: '', // 毕业年份
        major: [], // 专业
        country: '', // 国家
        askFor: '', // 咨询方向
        signStatus: '', // 是否签约
        firstAskDate: '', // 首次联系日期
        counselorStatus: '', // 是否分配顾问
        counselorGroup: '', // 分配部门
        counselor: '', // 分配顾问
        counselorDate: '', // 分配顾问日期
        counselorReplay: '', // 顾问是否24小时回复
        sourceFrom: '', // 来源
        sourceWx: '', // 导流微信号
        storageStatus: '', // 人才库
        specialNature: '', // 特殊性质（家长、讲座等）
        resume: '', // 简历
        resume1: '', // 简历
        note: '' // 咨询进度
      }
    },
    // followUp弹框关闭
    followUpClose () {
      this.followUpVisible = false
    },
    // followUp弹框更新回调
    followUpUpdata () {
      this.getFollowUpMenteeIdListByUserId()
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
    // 导出表格数据文件
    exportFile (e) {
      // 拿handsontable实例
      const handsontable = this.$refs[e].$data.hotInstance
      const fileName = '客户列表_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // columnDelimiter: ',',
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
    },
    followUp () {
      // this.$router.push({ path: '/assistant/mentee/follow' })
      this.followUpVisible = true
    },
    // 主动follow
    toFollowUp (row) {
      const data = this.settingsAPIData[row]
      console.log(data)
      this.followMemberId = data.menteeId // 学员ID
      this.followVisible = true
      this.menteeData = data
    },
    // follow弹框关闭
    followClose () {
      this.followVisible = false
    },
    // follow弹框更新回调
    followUpdata () {
      this.Topage(1)
    },
    closeDetail () {
      this.followVisible = false
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
