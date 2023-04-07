<!--
 * @Author: 杨曦
 * @Date: 2020-10-30 13:19:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-24 16:50:53
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
  <d2-container v-loading.fullscreen.lock="fullscreenLoading" >
    <div class="sales_conversion"  >
        <div class="search_page" >
            <div class="search">
                <el-date-picker
                    style="width:150px"
                    v-model="beginDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择起始日期">
                </el-date-picker>
                <el-date-picker
                    style="width:150px"
                    v-model="endDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择截止日期">
                </el-date-picker>
                <el-button
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    type="success"
                    @click="Topage()"
                >GO</el-button>
                  <el-tag size="medium" type="primary" effect="dark" style="margin-top:10px"  class="mr10" >￥{{totalFund}} 【BD总花费，包含校园大使与合作商（申请日期筛选）】</el-tag>
                  <el-tag size="medium" type="primary" effect="dark" style="margin-top:10px" >{{consultingNum}}人 【BD来源咨询学生数，包含校园大使与合作商（分配顾问日期筛选）】</el-tag>
            </div>
        </div>
        <div >
            <el-tag size="medium" type="danger" effect="dark" class="mr10" style="margin-top:20px">BD各个类型合作商所申请支付的费用及有效咨询学生数</el-tag>
            <hot-table :settings="settings"  ref="" style="margin-top:20px" v-if="settings.data" licenseKey="non-commercial-and-evaluation"></hot-table>
            <el-tag size="medium" type="danger" effect="dark" class="mr10" style="margin-top:20px">BD各个国家花费的金额及有效咨询学生（合作商根据国家，校园大使根据学校国家）</el-tag>
            <hot-table :settings="settings2" ref="" style="margin-top:20px" v-if="settings2.data" licenseKey="non-commercial-and-evaluation"></hot-table>
            <el-tag size="medium" type="danger" effect="dark" class="mr10" style="margin-top:20px">BD合作商每位WST员工申请金额及带来的咨询量</el-tag>
            <hot-table :settings="settings3" ref="" style="margin-top:20px;" v-if="settings3.data" licenseKey="non-commercial-and-evaluation"></hot-table>
            <el-tag size="medium" type="danger" effect="dark" class="mr10" style="margin-top:20px">BD校园大使每位WST员工申请金额及带来的咨询量</el-tag>
            <hot-table :settings="settings4" ref="" style="margin-top:20px" v-if="settings4.data" licenseKey="non-commercial-and-evaluation"></hot-table>

        </div>

    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import Handsontable from 'handsontable'
function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
export default {
  mixins: [mixins],
  data () {
    return {
      endDate: getNowFormatDate(),
      fullscreenLoading: false,
      beginDate: `${new Date().getFullYear()}-01-01`,
      consultingData: [],
      exportData: [],
      settings: {
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        colWidths: [25, 25, 25],
        columns: [
          {
            data: 'cooperatorTypeName'
          },
          {
            data: 'consultingNum'
          },
          {
            data: 'totalFund'
          },
          {
            data: 'totalPrice'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '合作商类型',
          '此合作商咨询人数',
          '总花费金额',
          '平均每个咨询花费金额比例'
        ]
      },
      settings2: {
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'cooperatorTypeName'
          },
          {
            data: 'consultingNum'
          },
          {
            data: 'totalFund'
          },
          {
            data: 'totalPrice'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '国家地区名',
          '此国家地区咨询人数',
          '总花费金额',
          '平均每个咨询花费金额比例'
        ]
      },
      settings3: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userName'
          },
          {
            data: 'consultingNum'
          },
          {
            data: 'totalFund'
          },
          {
            data: 'totalPrice'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          'BD员工名',
          '合作商咨询人数',
          '总花费金额',
          '平均每个咨询花费金额比例'
        ]
      },
      settings4: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userName'
          },
          {
            data: 'consultingNum'
          },
          {
            data: 'totalFund'
          },
          {
            data: 'totalPrice'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          'BD员工名',
          '校园大使咨询人数',
          '总花费金额',
          '平均每个咨询花费金额比例'
        ]
      },
      totalFund: 0,
      consultingNum: 0
      // cooperatorTypeStatementList:[],
      // countryStatementList:[],
      // cooperatorStatementList:[],
      // ambassadorStatementList:[],
    }
  },
  created () {},
  mounted () {
    // this.Topage()
  },
  methods: {
    Topage () {
      if ((new Date(this.endDate)).valueOf() <= (new Date(this.beginDate)).valueOf()) {
        this.$message({
          message: '起始日期不可晚于截止日期',
          type: 'warning'
        })
        return false
      }
      this.fullscreenLoading = true
      let data = {}
      data = {
        endDate: this.endDate,
        beginDate: this.beginDate,
        userId: 'ALL_Data'
      }
      api.getBdConsulting(data).then(res => {
        console.log(res, 'yx*******')

        this.totalFund = res.data.totalFund
        this.consultingNum = res.data.consultingNum
        for (let i = 0; i < res.data.cooperatorTypeStatementList.length; i++) {
          if (res.data.cooperatorTypeStatementList[i].consultingNum != 0) {
            res.data.cooperatorTypeStatementList[i].totalPrice = Math.round(res.data.cooperatorTypeStatementList[i].totalFund / res.data.cooperatorTypeStatementList[i].consultingNum * 100) / 100
          } else {
            res.data.cooperatorTypeStatementList[i].totalPrice = 0.00
          }
        }
        this.settings.data = res.data.cooperatorTypeStatementList

        for (let i = 0; i < res.data.countryStatementList.length; i++) {
          if (res.data.countryStatementList[i].consultingNum != 0) {
            res.data.countryStatementList[i].totalPrice = Math.round(res.data.countryStatementList[i].totalFund / res.data.countryStatementList[i].consultingNum * 100) / 100
          } else {
            res.data.countryStatementList[i].totalPrice = 0.00
          }
        }
        this.settings2.data = res.data.countryStatementList

        for (let i = 0; i < res.data.cooperatorStatementList.length; i++) {
          if (res.data.cooperatorStatementList[i].consultingNum != 0) {
            res.data.cooperatorStatementList[i].totalPrice = Math.round(res.data.cooperatorStatementList[i].totalFund / res.data.cooperatorStatementList[i].consultingNum * 100) / 100
          } else {
            res.data.cooperatorStatementList[i].totalPrice = 0.00
          }
        }
        this.settings3.data = res.data.cooperatorStatementList

        for (let i = 0; i < res.data.ambassadorStatementList.length; i++) {
          if (res.data.ambassadorStatementList[i].consultingNum != 0) {
            res.data.ambassadorStatementList[i].totalPrice = Math.round(res.data.ambassadorStatementList[i].totalFund / res.data.ambassadorStatementList[i].consultingNum * 100) / 100
          } else {
            res.data.ambassadorStatementList[i].totalPrice = 0.00
          }
        }
        this.settings4.data = res.data.ambassadorStatementList

        this.fullscreenLoading = false
      })
    },
    exportFile () { // 导出
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      const fileName = 'BD_咨询报表_'
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
</style>
