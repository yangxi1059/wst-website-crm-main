<!--
 * @Author: 杨曦
 * @Date: 2020-10-30 13:19:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-24 16:51:07
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
                <el-date-picker
                    v-model="beginDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择起始日期">
                </el-date-picker>
                <el-date-picker
                    v-model="endDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择截止日期">
                </el-date-picker>
                <el-button
                    icon="el-icon-search"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    type="primary"
                    @click="Topage()"
                >查看</el-button>
            </div>
        </div>
          <hot-table
            :settings="settings"
            ref="moneyTable"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
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
      endDate: '',
      beginDate: '',
      pictLoading: false,
      exportData: [],
      settings: {
        height: document.documentElement.clientHeight - 230,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
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
          { data: 'userName' },
          // {data: "intervieweeCount"},
          { data: 'hireCount' },
          // {data: "leaveCount"},
          // {data: "probationLeaveCount"},
          { data: 'employmentRate' },
          { data: 'probationaryRate' },
          { data: 'probationLeaveRate' },
          { data: 'allLeaveRate' }
        ],
        beforeColumnSort: (oldVal, newVal) => {
        },
        colHeaders: [
          '角色',
          // "面试人数",
          '新录用人数',
          // "总离职人数",
          // "试用期内离职人数",
          '录用率',
          '过试用期率',
          '试用期内离职率',
          '总离职率'
        ]
      }
    }
  },
  created () {},
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      console.log(this.endDate, this.beginDate)
      this.pictLoading = true
      let data = {}
      data = {
        endDate: this.endDate,
        beginDate: this.beginDate
      }
      api.getHRstatement(data).then(res => {
        const data = []
        data.push({
          userName: 'HR团队',
          intervieweeCount: res.data.AllStatementObj.intervieweeCount,
          hireCount: res.data.AllStatementObj.hireCount,
          leaveCount: res.data.AllStatementObj.leaveCount,
          probationLeaveCount: res.data.AllStatementObj.probationLeaveCount,
          employmentRate: (res.data.AllStatementObj.hireCount / res.data.AllStatementObj.intervieweeCount * 100).toFixed(2) + '%',
          probationaryRate: ((res.data.AllStatementObj.hireCount - res.data.AllStatementObj.probationLeaveCount) / res.data.AllStatementObj.hireCount * 100).toFixed(2) + '%',
          probationLeaveRate: (res.data.AllStatementObj.probationLeaveCount / res.data.AllStatementObj.hireCount * 100).toFixed(2) + '%',
          allLeaveRate: (res.data.AllStatementObj.leaveCount / res.data.AllStatementObj.hireCount * 100).toFixed(2) + '%'
        })
        for (const item in res.data.UserStatementArr) {
          res.data.UserStatementArr[item].employmentRate = (res.data.UserStatementArr[item].hireCount / res.data.UserStatementArr[item].intervieweeCount * 100).toFixed(2) + '%'
          res.data.UserStatementArr[item].probationaryRate = ((res.data.UserStatementArr[item].hireCount - res.data.UserStatementArr[item].probationLeaveCount) / res.data.UserStatementArr[item].hireCount * 100).toFixed(2) + '%'
          res.data.UserStatementArr[item].probationLeaveRate = (res.data.UserStatementArr[item].probationLeaveCount / res.data.UserStatementArr[item].hireCount * 100).toFixed(2) + '%'
          res.data.UserStatementArr[item].allLeaveRate = (res.data.UserStatementArr[item].leaveCount / res.data.UserStatementArr[item].hireCount * 100).toFixed(2) + '%'
          data.push(res.data.UserStatementArr[item])
        }
        console.log(data)
        this.settings.data = data
      })
    },
    exportFile () { // 导出
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      let fileName = ''
      fileName = 'HR_统计报表'
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
