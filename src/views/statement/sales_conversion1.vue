<!--
 * @Author: 杨曦
 * @Date: 2020-10-19 16:31:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-24 16:51:22
 * @Version:
 * @Description:
-->
<template>
  <d2-container >
    <div class="sales_conversion">
        <div class="search_page" style="margin-top:20px">
            <div class="search">
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
                <el-select
                    class="mr10"
                    size="mini"
                    filterable
                    v-model="queryDay"
                    placeholder="请选择查询的天数"
                    @change="change()"
                >
                    <el-option
                        v-for="item in queryDayList"
                        :key="item.itemValue"
                        :label="item.itemName"
                        :value="item.itemValue"
                    ></el-option>
                </el-select>
                <el-button
                    v-if="groupStatus"
                    icon="el-icon-view"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    plain
                    @click="Topage()"
                >切换到个人</el-button>
                <el-button
                    v-else-if="!groupStatus && roleInfo.includes('sales_conversion_changeBtn')"
                    icon="el-icon-view"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    plain
                    @click="Topage2()"
                >切换到小组</el-button>
                <el-button
                    icon="el-icon-download"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    type="success"
                    @click="exportFile()"
                >导出</el-button>

            </div>
        </div>
        <el-table
          stripe
          v-if="!groupStatus"
          :data="consultingData"
          v-loading = "pictLoading"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
            <el-table-column
              label="销售人员"
              prop="userName"
            >
            </el-table-column>
            <el-table-column
              :sortable = true
              sort-by="分配学员"
              v-if="roleInfo.includes('sales_conversion_assignStudents')"
              label="分配学员"
              prop="分配学员"
            >
            </el-table-column>
            <el-table-column
              sort-by="签约学员"
              :sortable = true
              v-if="roleInfo.includes('sales_conversion_signStudent')"
              label="签约学员"
              prop="签约学员"
            >
            </el-table-column>
            <el-table-column
              sortable
              label="签约转化率"
              v-if="roleInfo.includes('sales_conversion_signStudentRate')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.consVersionRate && scope.row.consVersionRate != 'NaN'">{{ scope.row.consVersionRate }}%</span>
                <span v-else>0.00%</span>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              label="KPI总数"
              prop="KPI总数"
              v-if="roleInfo.includes('sales_conversion_kpiAll')"
            >
            </el-table-column>
            <el-table-column
              sortable
              label="KPI转化率"
              v-if="roleInfo.includes('sales_conversion_kpiRate')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.kpiRate && scope.row.kpiRate != 'NaN'">{{ scope.row.kpiRate }}</span>
                <span v-else>0.00</span>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              label="入账金额"
              prop="入账金额"
              v-if="roleInfo.includes('sales_conversion_entry')"
            >
            </el-table-column>
            <el-table-column
              sortable
              label="入账签约比"
              v-if="roleInfo.includes('sales_conversion_entryRate')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.entryRate && scope.row.entryRate != 'NaN'">{{ scope.row.entryRate }}</span>
                <span v-else>0.00</span>
              </template>
            </el-table-column>
        </el-table>
        <el-table
          stripe
          v-else
          :data="consultingData2"
          v-loading = "pictLoading2"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
            <el-table-column
              label="销售组名"
              prop="groupName"
            >
            </el-table-column>
            <el-table-column
              v-if="roleInfo.includes('sales_conversion_assignStudentsGroup')"
              label="分配学员"
              prop="分配学员"
            >
            </el-table-column>
            <el-table-column
              v-if="roleInfo.includes('sales_conversion_signStudentGroup')"
              label="签约学员"
              prop="签约学员"
            >
            </el-table-column>
            <el-table-column
              label="签约转化率"
              v-if="roleInfo.includes('sales_conversion_signStudentRateGroup')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.consVersionRate && scope.row.consVersionRate != 'NaN'">{{ scope.row.consVersionRate }}%</span>
                <span v-else>0.00%</span>
              </template>
            </el-table-column>
            <el-table-column
              label="KPI总数"
              prop="KPI总数"
              v-if="roleInfo.includes('sales_conversion_kpiAllGroup')"
            >
            </el-table-column>
            <el-table-column
              label="KPI转化率"
              v-if="roleInfo.includes('sales_conversion_kpiRateGroup')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.kpiRate && scope.row.kpiRate != 'NaN'">{{ scope.row.kpiRate }}</span>
                <span v-else>0.00</span>
              </template>
            </el-table-column>
            <el-table-column
              label="入账金额"
              prop="入账金额"
              v-if="roleInfo.includes('sales_conversion_entryGroup')"
            >
            </el-table-column>
            <el-table-column
              label="入账签约比"
              v-if="roleInfo.includes('sales_conversion_entryRateGroup')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.entryRate && scope.row.entryRate != 'NaN'">{{ scope.row.entryRate }}</span>
                <span v-else>0.00</span>
              </template>
            </el-table-column>
        </el-table>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      groupStatus: false,
      endDate: new Date(),
      queryDay: '90',
      queryDayList: [
        { itemName: '90天', itemValue: '90' },
        { itemName: '180天', itemValue: '180' },
        { itemName: '365天', itemValue: '365' }
      ],
      consultingData: [],
      consultingData2: [],
      pictLoading: false,
      pictLoading2: false,
      exportData: []
    }
  },
  created () {},
  mounted () {
    this.endDate = this.getCurrentMonthFirst()
    this.Topage()
  },
  methods: {
    Topage () {
      this.groupStatus = false
      this.pictLoading = true
      const data = {
        endDate: this.endDate,
        queryDay: this.queryDay
      }
      console.log(data)
      api.getSalesConversionRate(data).then(res => {
        console.log(res, 'yx*******')
        const data = res.data
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].countArr.length; j++) {
            data[i][data[i].countArr[j].label] = data[i].countArr[j].value
          }
        }
        for (let i = 0; i < data.length; i++) {
          data[i].consVersionRate = (parseFloat(data[i]['签约学员']) / parseFloat(data[i]['分配学员']) * 100).toFixed(2)
          data[i].kpiRate = (parseFloat(data[i]['KPI总数']) / parseFloat(data[i]['签约学员'])).toFixed(2)
          data[i].entryRate = (parseFloat(data[i]['入账金额']) / parseFloat(data[i]['签约学员'])).toFixed(2)
        }
        this.consultingData = data
        this.exportData = data
        this.pictLoading = false
        console.log(this.consultingData)
      })
    },
    Topage2 () {
      this.groupStatus = true
      this.pictLoading2 = true
      const data = {
        endDate: this.endDate,
        queryDay: this.queryDay
      }
      console.log(data)
      api.getSalesGroupConversionRate(data).then(res => {
        console.log(res, 'yx*******')
        const data = res.data
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].countArr.length; j++) {
            data[i][data[i].countArr[j].label] = data[i].countArr[j].value
          }
        }
        for (let i = 0; i < data.length; i++) {
          data[i].consVersionRate = (parseFloat(data[i]['签约学员']) / parseFloat(data[i]['分配学员']) * 100).toFixed(2)
          data[i].kpiRate = (parseFloat(data[i]['KPI总数']) / parseFloat(data[i]['签约学员'])).toFixed(2)
          data[i].entryRate = (parseFloat(data[i]['入账金额']) / parseFloat(data[i]['签约学员'])).toFixed(2)
        }
        this.consultingData2 = data
        this.exportData = data
        // console.log(this.consultingData2)
        this.pictLoading2 = false
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
    exportFile () { // 导出
    },
    exportFile2 () {
      const year = this.year2.getFullYear()
      const { export_json_to_excel } = require('./js/Export2Excel2') // 引入文件
      const multiHeader = [[
        '学校名',
        'Q1',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Q2',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Q3',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Q4',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '汇总',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]] // 对应表格输出的title
      const tHeader = [['学校名', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '', '新增学员', '', '咨询学员', '', '签约学员', '', '转化率(%)', '']] // 对应表格输出的title
      const tHeader2 = [['学校名', year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1, year, year - 1]] // 对应表格输出的title
      console.log(multiHeader, tHeader, tHeader2, this.year2.getFullYear())
      const filterVal = [
        'schoolName',
        'thisYearQ1Add',
        'lastYearQ1Add',
        'thisYearQ1Counselor',
        'lastYearQ1Counselor',
        'thisYearQ1Sign',
        'lastYearQ1Sign',
        'thisYearQ1Consulting',
        'lastYearQ1Consulting',
        'thisYearQ2Add',
        'lastYearQ2Add',
        'thisYearQ2Counselor',
        'lastYearQ2Counselor',
        'thisYearQ2Sign',
        'lastYearQ2Sign',
        'thisYearQ2Consulting',
        'lastYearQ2Consulting',
        'thisYearQ3Add',
        'lastYearQ3Add',
        'thisYearQ3Counselor',
        'lastYearQ3Counselor',
        'thisYearQ3Sign',
        'lastYearQ3Sign',
        'thisYearQ3Consulting',
        'lastYearQ3Consulting',
        'thisYearQ4Add',
        'lastYearQ4Add',
        'thisYearQ4Counselor',
        'lastYearQ4Counselor',
        'thisYearQ4Sign',
        'lastYearQ4Sign',
        'thisYearQ4Consulting',
        'lastYearQ4Consulting',
        'thisYearAdd',
        'lastYearAdd',
        'thisYearCounselor',
        'lastYearCounselor',
        'thisYearSign',
        'lastYearSign',
        'thisYearConsulting',
        'lastYearConsulting'] // 对应表格tableData输出的数据
      const header = []
      // 进行所有表头的单元格合并，建议一行一行来，不然容易整乱
      const merges = [
        'A1:A2',
        'B1:B2',
        'C1:D1',
        'E1:G1',
        'H1:J1',
        'K1:M1',
        'N1:N2',
        'O1:O2',
        'P1:P2'
      ]
      const list = this.settings.data
      const data = this.formatJson(filterVal, list)
      this.$nextTick(() => {
        export_json_to_excel(multiHeader, tHeader, tHeader2, header, data, '不同学校各季度新增咨询转化签约报表', merges)
      })
      // this.downloadLoading = false // 加载遮罩层结束
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
