<template>
  <d2-container v-loading="loading" >
    <div class="d2_container" ref="d2">
        <div class="search_page" ref="search">
        <div class="search">
            <el-date-picker
            v-model="historyMonth"
            style="width:150px"
            type="month"
            @change="Topage(1)"
            v-if="roleInfo.includes(`salary_user_select`)"
            size="mini"
            filterable
            value-format="yyyy-MM"
            class="mr10"
            placeholder="请选择周期">
            </el-date-picker>
            <el-select
            class="mr10"
            style="width:150px"
            filterable
            size="mini"
            v-model="userId"
            placeholder="请选择用户"
            @change="Topage(1)"
            v-if="roleInfo.includes(`salary_monthly_select`)"
            >
            <el-option
                v-for="item in users"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
            ></el-option>
            </el-select>
            <el-button
            v-if="roleInfo.includes(`salary_import`)"
            size="mini"
            plain
            @click="upload()"
            >导入</el-button>
            <el-button
            v-if="roleInfo.includes(`salary_download`)"
            size="mini"
            plain
            @click="download()"
            >导出</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`salary_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <hot-table :settings="settings" ref="salary" licenseKey="non-commercial-and-evaluation"></hot-table>
        <upload :uploadVisible="uploadVisible" @close="uploadClose" @submit="uploadSubmit" />
        <salaryDeduct :salaryListVisible="salaryListVisible" :salaryId="salaryId" @close="salaryClose" />
    </div>
  </d2-container>
</template>

<script>
import Handsontable from 'handsontable'
import api from '@/api/hr.js'
import axios from '@/api/sales_month_new'
import api2 from '@/api/sales_assistant.js'
import mixins from '@/plugin/mixins'
import upload from './components/upload_file.vue'
import salaryDeduct from './components/salary_deduct.vue'
import { mapState } from 'vuex'

const hotbutton = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  let innerHTML = ''
  if (value != 0) {
    innerHTML += `<el-button class='hot-button ' onclick='toDetailMentee(${row})' title='详情'>${value}</el-button>`
  } else {
    innerHTML += `${value}`
  }
  td.innerHTML = innerHTML
  return td
}
export default {
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  mixins: [mixins],
  components: { upload, salaryDeduct },
  data () {
    return {
      loading: false,
      pageSize: 400,
      search: '',
      total: 0,
      pageNum: 1,
      users: [],
      userId: 'ALL',
      month: [],
      historyMonth: '',
      idList: [],
      settings: {
        copyable: false,
        height: document.documentElement.clientHeight - 190,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        
        fillHandle: false,
        columnSorting: true,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '周期',
          '签约公司',
          '部门',
          '用户名称',
          '入职时间',
          'Base',
          '身份证',
          '银行信息',
          '银行卡号',
          '扣款原因',
          '基本工资', // 10
          '岗位津贴',
          '加班费',
          '应发工资（五险一金及税前）',
          '养老保险个人缴费',
          '医疗保险个人缴费',
          '失业保险个人缴费',
          '公积金个人缴费',
          '税前工资',
          '个税',
          '实发工资（第一笔）', // 20
          '养老保险单位缴费',
          '医疗保险单位缴费',
          '失业保险单位缴费',
          '工伤保险单位缴费',
          '生育保险单位缴费',
          '五险单位总缴费用',
          '公积金单位缴费',
          '备注',
          '五险一金单位+个人总缴费用',
          '五险一金基数',
          '奖金',
          '奖金原因',
          '扣款',
          '当月报销',
          '工资差额',
          '代发报销（第二笔）'

        ],
        columns: [
          {
            readOnly: true,
            data: 'period'
          },
          {
            readOnly: true,
            data: 'contractCompanyName'
          },
          {
            readOnly: true,
            data: 'deptName'
          },
          {
            readOnly: true,
            data: 'userName'
          },
          {
            readOnly: true,
            data: 'hiredate'
          },

          {
            readOnly: true,
            data: 'basic'
          },
          {
            readOnly: true,
            data: 'idCard',
            type: 'text'
          },
          // {
          //   readOnly: true,
          //   data: "wstLevel"
          // },
          {
            readOnly: true,
            data: 'bankName'
          },
          {
            readOnly: true,
            data: 'bankAcc'
          },
          {
            readOnly: true,
            data: 'deductReason'
          },
          {
            readOnly: true,
            data: 'bogusWage'
          },
          {
            readOnly: true,
            data: 'jobCompensation'
          },
          {
            readOnly: true,
            data: 'overtimeCompensation'
          },
          {
            readOnly: true,
            data: 'totalWage'
          },
          {
            readOnly: true,
            data: 'endowmentInsuranceUser'
          },
          {
            readOnly: true,
            data: 'medicalInsuranceUser'
          },
          {
            readOnly: true,
            data: 'unemploymentInsuranceUser'
          },
          {
            readOnly: true,
            data: 'houseFundUser'
          },
          {
            readOnly: true,
            data: 'withoutTaxWage'
          },
          {
            readOnly: true,
            data: 'incomeTax'
          },
          {
            readOnly: true,
            data: 'realWage'
          },
          {
            readOnly: true,
            data: 'endowmentInsuranceWst'
          },
          {
            readOnly: true,
            data: 'medicalInsuranceWst'
          },
          {
            readOnly: true,
            data: 'unemploymentInsuranceWst'
          },
          {
            readOnly: true,
            data: 'injuryInsuranceWst'
          },
          {
            readOnly: true,
            data: 'birthInsuranceWst'
          },
          {
            readOnly: true,
            data: 'fiveInsuranceWst'
          },
          {
            readOnly: true,
            data: 'houseFundWst'
          },
          {
            readOnly: true,
            data: 'note'
          },
          {
            readOnly: true,
            data: 'insuranceHouseAll'
          },
          {
            readOnly: true,
            data: 'insuranceHouseBasic'
          },

          {
            readOnly: true,
            data: 'bonus'
          },
          {
            readOnly: true,
            data: 'bonusReason'
          },
          {
            readOnly: true,
            data: 'deduct',
            renderer: hotbutton
          },
          {
            readOnly: true,
            data: 'reimbursement'
          },
          {
            readOnly: true,
            data: 'differenceWage'
          },
          {
            readOnly: true,
            data: 'reimbursementWage'
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
      APIData: [],
      salaryId: '',
      salaryListVisible: false,
      uploadVisible: false
    }
  },
  created () {},
  mounted () {
    window.toDetailMentee = row => this.toDetailMentee(row)
    this.getSalesList()
  },
  methods: {
    getSalesList () {
      api2.getUserList().then(({ data }) => {
        console.log('人员列表', data)
        this.$nextTick(() => {
          const users = [{ userId: 'ALL_Data', userName: '全数据' }, { userId: '', userName: 'ALL' }, ...data]
          this.users = users
        })
      })
      axios
        .salesHistoryMonth()
        .then(response => {
          console.log('销售kpi已统计月份数据：', response.data)
          this.month = response.data
          this.month.unshift('CURRENT_MONTH')
          this.month.unshift('ALL')
        })
        .catch(err => {
          console.log(err)
        })
      this.Topage(1)
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sortCol: this.sortCol,
        sort: this.sort,
        userId: this.userId,
        period: this.historyMonth || ''
      }
      console.log('获取薪资列表参数：', JSON.stringify(data))
      this.loading = true
      api
        .getSalaryList(data)
        .then(({ data }) => {
          console.log('获取薪资列表：', data)
          this.pageNum = data.page
          this.total = data.total
          this.settings.data = data.rows
          this.APIData = data.rows
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          console.log(err)
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
    toDetailMentee (row) {
      console.log(this.settings.data[row])
      this.salaryId = this.settings.data[row].salaryId
      this.salaryListVisible = true
    },
    salaryClose () {
      this.salaryListVisible = false
    },
    save () {
      const idListOnly = [...new Set(this.idList)]
      const data = []
      if (this.idList.length > 0) {
        idListOnly.forEach(v => {
          data.push(this.APIData[v])
        })
        console.log(this.idList, this.APIData, idListOnly, data)
        api
          .setSalary({ uptList: data })
          .then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.idList = []
            this.Topage()
          })
          .catch(err => {
            this.message({
              type: 'error',
              message: err
            })
          })
      } else {
        return false
      }
    },
    download () {
      console.log('导出')
      const handsontable = this.$refs.salary.$data.hotInstance
      const fileName = '薪资列表_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename: fileName + '[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    },
    upload () {
      console.log('导入')
      this.uploadVisible = true
    },
    uploadClose () {
      this.uploadVisible = false
    },
    uploadSubmit () {
      this.uploadClose()
      this.Topage()
    }
  }
}
</script>
