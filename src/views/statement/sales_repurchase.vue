<!--
 * @Author: 杨曦
 * @Date: 2020-10-30 13:19:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-24 16:51:28
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
  <d2-container >
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
                    @change="change()"
                    placeholder="选择起始日期">
                </el-date-picker>
                <el-date-picker
                    v-model="endDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    @change="change()"
                    placeholder="选择截止日期">
                </el-date-picker>

                <el-date-picker
                  class="mr10"
                  size="mini"
                  type="year"
                  v-model="year"
                  clearable
                  value-format="yyyy"
                  @change="changeYear()"
                  placeholder="年份"
                ></el-date-picker>

                <el-button
                    v-if="groupStatus"
                    icon="el-icon-view"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    plain
                    @click="Topage()"
                >切换到Sales</el-button>
                <el-button
                    v-else-if="!groupStatus && roleInfo.includes('sales_repurchase_changeBtn')"
                    icon="el-icon-view"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    plain
                    @click="Topage2()"
                >切换到VIP</el-button>
                <el-button
                v-if="roleInfo.includes('sales_repurchase_downExecl')"
                    icon="el-icon-download"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    type="success"
                    @click="exportFile()"
                >导出</el-button>

            </div>
        </div>
        <div class="table mt10"  v-if="!groupStatus">
          <hot-table
            :settings="settings"
            ref=""
            v-if="settings.data"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
          <hot-table
            :settings="settings3"
            ref=""
            v-if="settings3.data.length"
						style="margin-top:40px"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
          <hot-table
            :settings="settings4"
            v-if="settings4.data.length"
            ref=""
						style="margin-top:40px"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
					<hot-table
            :settings="settingsTe"
            v-if="settingsTe.data.length"
            ref="moneyTable"
						style="margin-top:40px;height:0px;opacity:0;overfolw:hidden"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
        </div>
        <div class="table mt10" v-else>
          <hot-table :settings="settings2" v-if="settings2.data" licenseKey="non-commercial-and-evaluation" ref="" ></hot-table>
          <hot-table :settings="settings5" v-if="settings5.data.length" style="margin-top:40px" licenseKey="non-commercial-and-evaluation" ref="" ></hot-table>
          <hot-table :settings="settings6" v-if="settings6.data.length" style="margin-top:40px" licenseKey="non-commercial-and-evaluation" ref="" ></hot-table>
          <hot-table :settings="settingsTe2" v-if="settingsTe2.data.length" style="margin-top:40px;height:0px;opacity:0;overfolw:hidden" licenseKey="non-commercial-and-evaluation" ref="moneyTable" ></hot-table>
        </div>

    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import Handsontable from 'handsontable'
import { mapState } from 'vuex'

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
      year: null,
      groupStatus: false,
      endDate: getNowFormatDate(),
      beginDate: `${new Date().getFullYear()}-01-01`,
      consultingData: [],
      consultingData2: [],
      pictLoading: false,
      pictLoading2: false,
      exportData: [],
      settingsTe2: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140

          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          'VIP部门',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settingsTe: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140

          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          'Sales部门',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settings4: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140

          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          'Sales人员名',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settings3: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140

          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          'Sales组名',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settings: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140
          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          '部门',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settings2: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140
          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          '部门',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settings5: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140
          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          'VIP组名',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      },
      settings6: {
        //   height: document.documentElement.clientHeight - 280,
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
          {
            data: 'groupName',
            type: 'text',
            width: 140
          },
          {
            data: '分配学员'
          },
          {
            data: '入账金额'

          },
          {
            data: 'KPI总数'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          // if (!newVal.length) {
          //   this.sort = "";
          //   this.sortCol = "";
          //   this.pageNum = 1;
          //   this.Topage(this.pageNum);
          // } else {
          //   this.sortCol = this.settings.columns[newVal[0].column].data;
          //   this.sort = newVal[0].sortOrder;
          //   this.pageNum = 1;
          //   if (this.sortCol === `hotbutton`) return;
          //   this.Topage(this.pageNum);
          // }
        },
        colHeaders: [
          'VIP人员名',
          '分配学员',
          '入账金额',
          'KPI总数'
        ]
      }
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  created () {},
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      console.log(this.endDate, this.beginDate)
      if (this.endDate && this.beginDate) {

      } else {
        this.$message({
          message: '起始日期截止日期为必填项',
          type: 'warning'
        })
        return false
      }
      if ((new Date(this.endDate)).valueOf() <= (new Date(this.beginDate)).valueOf()) {
        this.$message({
          message: '起始日期不可晚于截止日期',
          type: 'warning'
        })
        return false
      }
      this.groupStatus = false
      this.pictLoading = true
      let data = {}
      data = {
        endDate: this.endDate,
        beginDate: this.beginDate
      }
      console.log(data)
      const objKong = {
        groupName: '',
        分配学员: '',
        入账金额: '',
        KPI总数: ''
      }
      api.getSalesRepurchase(data).then(res => {
        console.log(res, 'yx*******')
        const data = res.data
        const data2 = []
        for (let i = 0; i < data.salesDeptObj.countArr.length; i++) {
          data.salesDeptObj[data.salesDeptObj.countArr[i].label] = data.salesDeptObj.countArr[i].value
        }
        data2.push(data.salesDeptObj)
        if (res.data.salesGroupArr.length) {
          data2.push(objKong)
          data2.push({
            groupName: '销售小组',
            分配学员: '',
            入账金额: '',
            KPI总数: ''
          })
        }
        for (let i = 0; i < data.salesGroupArr.length; i++) {
          for (let j = 0; j < data.salesGroupArr[i].countArr.length; j++) {
            data.salesGroupArr[i][data.salesGroupArr[i].countArr[j].label] = data.salesGroupArr[i].countArr[j].value
          }
          data2.push(data.salesGroupArr[i])
        }

        data2.push(objKong)
        data2.push({
          groupName: '销售个人',
          分配学员: '',
          入账金额: '',
          KPI总数: ''
        })
        for (let i = 0; i < data.salesArr.length; i++) {
          for (let j = 0; j < data.salesArr[i].countArr.length; j++) {
            data.salesArr[i][data.salesArr[i].countArr[j].label] = data.salesArr[i].countArr[j].value
          }
          data.salesArr[i].groupName = data.salesArr[i].userName
          data2.push(data.salesArr[i])
        }

        console.log(data, data2, 'yx*////////////////////////////////')
        this.settings.data = data.salesDeptObj
        this.settings3.data = data.salesGroupArr
        this.settings4.data = data.salesArr
        this.settingsTe.data = data2
        this.pictLoading = false
      })
    },
    Topage2 () {
      if (this.endDate && this.beginDate) {
      } else {
        this.$message({
          message: '起始日期截止日期为必填项',
          type: 'warning'
        })
        return false
      }
      if ((new Date(this.endDate)).valueOf() <= (new Date(this.beginDate)).valueOf()) {
        this.$message({
          message: '起始日期不可晚于截止日期',
          type: 'warning'
        })
        return false
      }
      this.groupStatus = true
      this.pictLoading2 = true
      let data = {}
      data = {
        endDate: this.endDate,
        beginDate: this.beginDate
      }
      const objKong = {
        groupName: '',
        分配学员: '',
        入账金额: '',
        KPI总数: ''
      }
      console.log(this.endDate)
      api.getVipRepurchase(data).then(res => {
        console.log(res, 'yx*******')
        const data = res.data
        const data2 = []
        for (let i = 0; i < data.vipDeptObj.countArr.length; i++) {
          data.vipDeptObj[data.vipDeptObj.countArr[i].label] = data.vipDeptObj.countArr[i].value
        }
        data2.push(data.vipDeptObj)
        if (res.data.vipGroupArr.length) {
          data2.push(objKong)
          data2.push({
            groupName: 'VIP小组',
            分配学员: '',
            入账金额: '',
            KPI总数: ''
          })
        }
        for (let i = 0; i < data.vipGroupArr.length; i++) {
          for (let j = 0; j < data.vipGroupArr[i].countArr.length; j++) {
            data.vipGroupArr[i][data.vipGroupArr[i].countArr[j].label] = data.vipGroupArr[i].countArr[j].value
          }
          data2.push(data.vipGroupArr[i])
        }
        data2.push(objKong)
        data2.push({
          groupName: 'VIP个人',
          分配学员: '',
          入账金额: '',
          KPI总数: ''
        })
        for (let i = 0; i < data.vipArr.length; i++) {
          for (let j = 0; j < data.vipArr[i].countArr.length; j++) {
            data.vipArr[i][data.vipArr[i].countArr[j].label] = data.vipArr[i].countArr[j].value
          }
          data.vipArr[i].groupName = data.vipArr[i].userName
          data2.push(data.vipArr[i])
        }

        this.settings2.data = data.vipDeptObj
        this.settings5.data = data.vipGroupArr
        this.settings6.data = data.vipArr
        this.settingsTe2.data = data2
        console.log(this.settings2.data, 'yx*////////////////////////////////')
        this.pictLoading = false
      })
    },
    change () {
      if (this.groupStatus) {
        this.Topage2()
      } else {
        this.Topage()
      }
    },
    getCurrentMonthFirst () {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    changeYear () {
      if (!this.year) {
        this.year = new Date().getFullYear()
      }
      console.log(this.year)
      this.beginDate = `${this.year}-01-01`
      this.endDate = `${this.year}-12-31`
      if (this.groupStatus) {
        this.Topage2()
      } else {
        this.Topage()
      }
    },
    exportFile () { // 导出
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      let fileName = ''
      if (this.groupStatus) {
        fileName = 'VIP_复购报表_'
      } else {
        fileName = 'Sales_复购报表_'
      }
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
