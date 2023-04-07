<template>
  <d2-container v-loading="loading" >
    <div class="accounting_audit">
        <div class="search_page">
        <div class="search">
            <el-date-picker
            style="width:150px"
            v-if="roleInfo.includes(`operate_search`)"
            class="mr10"
            filterable
            value-format="yyyy-MM"
            v-model="period"
            type="month"
            size="mini"
            @change="Topage(1)"
            placeholder="请选择周期">
            </el-date-picker>
            <el-select
            style="width:150px"
            clearable
            class="mr10"
            size="mini"
            v-model="paymentAccount"
            placeholder="请选择出账账户"
            @change="Topage(1)"
            v-if="roleInfo.includes(`operate_user_select`)"
            >
            <el-option
                v-for="item in payment_account"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            style="width:150px"
            clearable
            class="mr10"
            size="mini"
            v-model="operateType"
            placeholder="请选择类型"
            @change="Topage(1)"
            v-if="roleInfo.includes(`operate_type_select`)"
            >
            <el-option
                v-for="item in operate_cost_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-button
            v-if="roleInfo.includes(`operate_import`)"
            class=""
            size="mini"
            plain
            @click="upload()"
            >导入</el-button>
            <el-button
            v-if="roleInfo.includes(`operate_download`)"
            class=""
            size="mini"
            plain
            @click="download()"
            >导出</el-button>
        </div>
        <pagination
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <hot-table :settings="settings" ref="salary" licenseKey="non-commercial-and-evaluation"></hot-table>
        <upload :uploadVisible="uploadVisible" @close="uploadClose" @submit="uploadSubmit" />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/hr.js'
import axios from '@/api/sales_month_new'
import mixins from '@/plugin/mixins'
import upload from './components/upload_file_operatecost.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { upload },
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  data () {
    return {
      search: '',
      total: 0,
      pageNum: 1,
      pageSize: 400,
      operateType: '',
      payment_account: [],
      operate_cost_type: [],
      paymentAccount: '',
      month: [],
      period: '',
      idList: [],
      settings: {
        copyable: false,
        height: document.documentElement.clientHeight - 190,
        fixedColumnsLeft: 1,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        
        fillHandle: false,
        columnSorting: true,
        // readOnly: true,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '周期',
          '内容',
          '支出（人民币）',
          '支出（美金）',
          '类型',
          '汇率',
          '出账账户',
          '出账日期'
        ],
        columns: [
          {
            readOnly: true,
            data: 'period'
          },
          {
            readOnly: true,
            data: 'content'
          },
          {
            readOnly: true,
            data: 'fundCny',
            type: 'numeric'
          },
          {
            readOnly: true,
            data: 'fundUsd',
            type: 'numeric'
          },
          {
            readOnly: true,
            data: 'operateTypeName',
            type: 'text'
          },
          {
            readOnly: true,
            data: 'rate',
            type: 'numeric'
          },
          {
            readOnly: true,
            data: 'paymentAccountName',
            type: 'text'
          },
          {
            readOnly: true,
            data: 'paymentDate',
            type: 'text'
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
        // beforeChange: item => {
        //   console.log(item, this.idList, this.APIData);
        //   if (this.APIData[item[0][0]]["period"] === "CURRENT_MONTH") {
        //     this.$message("当前周期不可修改");
        //     return false;
        //   }
        //   this.idList.push(item[0][0]);
        // }
      },
      loading: false,
      APIData: [],
      uploadVisible: false
    }
  },
  created () {},
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.payment_account = await this.getDictionary('payment_account')
      this.operate_cost_type = await this.getDictionary('operate_cost_type')
      this.Topage(1)
    },
    Topage () {
      const data = {
        operateType: this.operateType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sortCol: this.sortCol,
        sort: this.sort,
        paymentAccount: this.paymentAccount,
        period: this.period || ''
      }
      console.log('获取薪资列表参数：', JSON.stringify(data))
      this.loading = true
      axios
        .getOperateCostList(data)
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
    save () {
      const idListOnly = [...new Set(this.idList)]
      const data = []
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
    },
    download () {
      console.log('导出')
      const handsontable = this.$refs.salary.$data.hotInstance
      const fileName = '运营开支_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // columnDelimiter: ',',
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
