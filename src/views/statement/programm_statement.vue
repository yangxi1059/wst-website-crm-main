<!--
 * @Author: 杨曦
 * @Date: 2020-10-30 13:19:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-24 16:51:13
 * @Version:
 * @Description:
-->
<!--
 * @Author: 杨曦
 * @Date: 2020-10-19 16:31:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-11-03 11:09:43
 * @Version:
 * @Description:
-->
<template>
  <d2-container  >
    <div class="sales_conversion">
        <div class="search_page" style="margin-top:20px">
            <div class="search">
              <el-input
                class="mr10"
                size="mini"
                placeholder="请输入搜索内容"
                style="width:180px"
                v-model="search"
                clearable>
              </el-input>
              <el-select class="mr10" v-model="programType" clearable  @change="Topage()" size="mini" placeholder="请选择项目类型">
                <el-option
                  v-for="item in typeProgram"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
              <el-button
                  class="mr10"
                  style="margin:0 10px 0 0"
                  size="mini"
                  type="primary"
                  @click="Topage()"
              >GO</el-button>
              <el-button
                  v-if="roleInfo.includes('programm_statement_out')"
                  icon="el-icon-download"
                  class="mr10"
                  style="margin:0 10px 0 0"
                  size="mini"
                  type="success"
                  @click="exportFile()"
              >导出</el-button>
              <el-tag effect="dark" size="medium" type="danger" class="mr10" >订单总金额（有入账记录）: ￥{{price.cnyOrder.toFixed(2)}}</el-tag>
              <el-tag effect="dark" size="medium" type="danger">入账总金额（包含退款）: ${{price.cnyBill.toFixed(2)}}</el-tag>
            </div>
            <pagination
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></pagination>
        </div>
        <div class="table mt10" >
          <hot-table
            :settings="settings"
            ref="moneyTable"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
        </div>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import Handsontable from 'handsontable'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  data () {
    return {
      price: {
        cnyOrder: 0,
        cnyBill: 0
      },
      pageNum: 1,
      pageSize: 100,
      programType: '',
      pictLoading: false,
      search: '',
      total: 0,
      typeProgram: [],
      exportData: [],

      settings: {
        //   height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        height: () => {
          return document.documentElement.clientHeight - 150
        },
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          { data: 'orderId' },
          { data: 'menteeName' },
          { data: 'degree' },
          { data: 'major' },
          { data: 'finishYear' },
          { data: 'schoolName' },
          { data: 'countryName' },
          { data: 'signDate' },
          { data: 'startDate' },
          { data: 'endDate' },
          { data: 'kpiPeriod' },
          { data: 'contact1Name' },
          { data: 'contact2Name' },
          { data: 'programPriceCny' },
          { data: 'programPriceUsd' },
          { data: 'orderPrice' },
          { data: 'programName' },
          { data: 'revenueCny' },
          { data: 'programTypeName' }
        ],
        beforeColumnSort: (oldVal, newVal) => {
        },
        colHeaders: [
          '订单号',
          '学员名',
          'Degree',
          '专业',
          '毕业年份',
          '学校名',
          '国家名',
          '订单签约日期',
          '项目开始日期',
          '项目结束日期',
          'KPI周期',
          '联系人一',
          '联系人二',
          '项目价格人民币',
          '项目价格美金',
          '订单金额',
          '项目名',
          '已入账金额',
          '项目类型'
        ]
      }
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  created () {},
  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.typeProgram = await this.getDictionary('program_type')
    },
    Topage () {
      this.total = 0
      console.log(this.endDate, this.beginDate)
      this.pictLoading = true
      let data = {}
      data = {
        programType: this.programType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search
      }
      console.log(data)
      api.statementProgram(data).then(res => {
        this.total = res.data.total
        console.log(res.data)
        this.settings.data = res.data.rows
      })
      api.getSignBillAccount().then(res => {
        if (res.data) {
          this.price.cnyOrder = res.data.cnyOrder
          this.price.cnyBill = res.data.cnyBill
        } else {
          this.price = {
            cnyOrder: 0,
            cnyBill: 0
          }
        }
      })
    },
    exportFile () { // 导出
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      let fileName = ''
      fileName = '项目_统计报表'
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
    // 分页插件回调：页码，每页条数
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

<style lang="scss" scoped>
.sales_assistant {
  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
.el-card_teyx123{
  .el-card__body{
    padding:10px 10px 0 10px !important
  }
}
.elementHeightyx{
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-collapse-item__wrap{
    border-bottom: none;
  }
}
.table {
  width: 100%;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
}
.sale-revenue {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 99;
  background-color: #fff;
}
.revenue-head {
  font-size: 20px;
  margin: 5px 30px;
}
.info {
  text-overflow: ellipsis;
}
</style>
