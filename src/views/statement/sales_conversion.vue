<!--
 * @Author: 杨曦
 * @Date: 2020-10-19 16:31:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-18 09:50:11
 * @Version:
 * @Description:
-->
<template>
  <d2-container  v-loading="loading">
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

                <el-select v-model="query" @change="change" class="mr10" size="mini" placeholder="数据权限">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-switch
                  class="mr20"
                  v-model="groupStatus"
                  @change="change"
                  active-text="小组"
                  inactive-text="个人">
                </el-switch>
                <!-- <el-button
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
                >切换到小组</el-button> -->
                <el-button
                v-if="roleInfo.includes('sales_conversion_downExecl')"
                    icon="el-icon-download"
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    type="success"
                    @click="exportFile()"
                >导出</el-button>

            </div>
        </div>
        <el-card>
          <div style="color:#c32e47;white-space: pre-line;font-size:12px">tips:
            分配学员数：分配给对应顾问的学员数量（顾问微信管辖人，在分配顾问时所属组，去掉spy与被删除的学员，去掉无效咨询的学员）
            签约学员数：首笔订单的首次入账时间在查询周期内的学员数量（合单/2，订单在下单时对顾问所在组进行了绑定）
            kpi总数：每笔订单的首次入账时间在查询周期内的购买项目数量（合单/2，包含退款订单）
            入账总金额：入账时间在查询周期内的所有等值人民币入账金额（合单/2，不包含退款订单，按照入账时汇率计算等值人民币）
          </div>
        </el-card>
        <div class="table mt10" v-if="!groupStatus">
          <hot-table
            :settings="settings"
            ref="moneyTable"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
        </div>
        <div class="table mt10" v-else>
          <hot-table :settings="settings2" licenseKey="non-commercial-and-evaluation" ref="moneyTable" ></hot-table>
        </div>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import Handsontable from 'handsontable'
import { mapState } from 'vuex'

const renderEffective = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  td.innerHTML = `${value}%`
  return td
}
export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      options: [],
      query: 'ALL',
      groupStatus: false,
      endDate: new Date(),
      queryDay: '30',
      queryDayList: [
        { itemName: '7天', itemValue: '7' },
        { itemName: '30天', itemValue: '30' },
        { itemName: '45天', itemValue: '45' },
        { itemName: '90天', itemValue: '90' },
        { itemName: '180天', itemValue: '180' },
        { itemName: '365天', itemValue: '365' }
      ],
      consultingData: [],
      consultingData2: [],
      pictLoading: false,
      pictLoading2: false,
      exportData: [],
      loading: false,
      settings: {
        height: document.documentElement.clientHeight - 300,
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
            data: 'userName',
            type: 'text'
          },
          {
            data: 'deptLevel',
            type: 'text'
          },
          {
            data: '分配学员'
          },
          {
            data: 'menteeAllQuery'
          },
          {
            data: '分配学员（Bruce帮聊）'
          },
          {
            data: '分配学员（Jerry帮聊）'
          },
          {
            data: '签约学员'

          },
          {
            data: '签约学员（Bruce帮聊）'
          },
          {
            data: '签约学员（Jerry帮聊）'
          },
          {
            data: 'consVersionRate',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderEffective
          },
          {
            data: 'KPI总数'
          },
          {
            data: 'kpiRate'
          },
          {
            data: '入账金额'
          },
          {
            data: '转换天数'
          },
          {
            data: 'entryRate'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          
        },
        colHeaders: [
          '销售人员',
          '部门级别',
          '分配学员',
          '周期内平均每日分配学员',
          '分配学员（Bruce帮聊）',
          '分配学员（Jerry帮聊）',
          '签约学员',
          '签约学员（Bruce帮聊）',
          '签约学员（Jerry帮聊）',
          '签约转化率',
          'KPI总数',
          'KPI签约学生比',
          '入账金额',
          '平均转化天数',
          '￥平均每位客户入账金额'
        ]
      },
      settings2: {
        height: document.documentElement.clientHeight - 300,
        // fixedColumnsLeft: 1,
        data: [],
        stretchH: 'all',
        columnSorting: {
          indicator: true
        },
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            width: 200,
            data: 'groupName'
          },
          {
            width: 200,
            data: 'userName'
          },
          {
            width: 200,
            data: 'dataTime'
          },
          {
            width: 200,
            data: 'allocateNum'
          },
          {
            width: 200,
            data: 'signMenteeNum'
          },
          {
            width: 200,
            data: 'signPriod'
          },
          {
            width: 200,
            data: 'kpi'
          },
          {
            width: 200,
            data: 'kpiPriod'
          },
          {
            width: 200,
            data: 'totalInCny'
          },
          {
            width: 200,
            data: 'totalInPriod'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '销售小组组名',
          '用户名',
          // "是否Leader",
          '统计时间',
          '分配学员数',
          '签约学员数',
          '签约转化率',
          'KPI',
          'KPI签约学生比',
          '入账总金额',
          '平均每位客户入账金额（￥）'
        ]
      }
    }
  },
  created () {},
  mounted () {
    this.options = []
    if (this.roleInfo.includes('sales_conversion_all_user')) {
      this.options.push({
        value: 'ALL_Data',
        label: '全数据ALL'
      })
    }
    this.options.push({ value: 'ALL', label: '本人及下属' })
    this.endDate = this.getCurrentMonthFirst()
    this.Topage()
    console.log(this.endDate, '1111111111111111111')
  },
  methods: {
    Topage () {
      this.loading = true
      this.settings.hiddenColumns.columns = []
      if (!this.roleInfo.includes('sales_conversion_assignStudents')) {
        this.settings.hiddenColumns.columns.push(2)
        // this.settings.columns.splice(1,1)
        // this.settings.colHeaders.splice(1,1)
      }
      if (!this.roleInfo.includes('sales_conversion_signStudent')) {
        this.settings.hiddenColumns.columns.push(6)
        // this.settings.columns.splice(2,1)
        // this.settings.colHeaders.splice(2,1)
      }
      if (!this.roleInfo.includes('sales_conversion_signStudentRate')) {
        this.settings.hiddenColumns.columns.push(9)
        //  this.settings.columns.splice(3,1)
        // this.settings.colHeaders.splice(3,1)
      }
      if (!this.roleInfo.includes('sales_conversion_kpiAll')) {
        this.settings.hiddenColumns.columns.push(10)
        //  this.settings.columns.splice(4,1)
        // this.settings.colHeaders.splice(4,1)
      }
      if (!this.roleInfo.includes('sales_conversion_kpiRate')) {
        this.settings.hiddenColumns.columns.push(11)
        //  this.settings.columns.splice(5,1)
        // this.settings.colHeaders.splice(5,1)
      }
      if (!this.roleInfo.includes('sales_conversion_entry')) {
        this.settings.hiddenColumns.columns.push(12)
        //  this.settings.columns.splice(6,1)
        // this.settings.colHeaders.splice(6,1)
      }
      if (!this.roleInfo.includes('sales_conversion_days')) {
        this.settings.hiddenColumns.columns.push(13)
        //  this.settings.columns.splice(7,1)
        // this.settings.colHeaders.splice(7,1)
      }
      if (!this.roleInfo.includes('sales_conversion_entryRate')) {
        this.settings.hiddenColumns.columns.push(14)
        //  this.settings.columns.splice(7,1)
        // this.settings.colHeaders.splice(7,1)
      }
      this.groupStatus = false
      this.pictLoading = true
      const data = {
        endDate: this.endDate,
        queryDay: this.queryDay,
        query: this.query
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
          if (parseFloat(data[i]['分配学员']) > 0) {
            data[i].menteeAllQuery = (parseFloat(data[i]['分配学员']) / parseFloat(this.queryDay)).toFixed(2)
            data[i].consVersionRate = (parseFloat(data[i]['签约学员']) / parseFloat(data[i]['分配学员']) * 100).toFixed(2)
          } else {
            data[i].menteeAllQuery = '0.00'
            data[i].consVersionRate = '0.00'
          }
          if (parseFloat(data[i]['签约学员']) > 0) {
            data[i].kpiRate = (parseFloat(data[i]['KPI总数']) / parseFloat(data[i]['签约学员'])).toFixed(2)
            data[i].entryRate = (parseFloat(data[i]['入账金额']) / parseFloat(data[i]['签约学员'])).toFixed(2)
          } else {
            data[i].kpiRate = '0.00'
            data[i].entryRate = '0.00'
          }
        }
        this.settings.data = data
        console.log(this.settings.data)
        // this.consultingData = data;
        // this.exportData = data;
        // console.log(this.consultingData)
        this.pictLoading = false
        this.loading = false
      })
    },
    Topage2 () {
      this.loading = true
      this.settings2.hiddenColumns.columns = []
      if (!this.roleInfo.includes('sales_conversion_assignStudentsGroup')) {
        this.settings2.hiddenColumns.columns.push(4)
      }
      if (!this.roleInfo.includes('sales_conversion_signStudentGroup')) {
        this.settings2.hiddenColumns.columns.push(5)
      }
      if (!this.roleInfo.includes('sales_conversion_signStudentRateGroup')) {
        this.settings2.hiddenColumns.columns.push(6)
      }
      if (!this.roleInfo.includes('sales_conversion_kpiAllGroup')) {
        this.settings2.hiddenColumns.columns.push(7)
      }
      if (!this.roleInfo.includes('sales_conversion_kpiRateGroup')) {
        this.settings2.hiddenColumns.columns.push(8)
      }
      if (!this.roleInfo.includes('sales_conversion_entryGroup')) {
        this.settings2.hiddenColumns.columns.push(9)
      }
      if (!this.roleInfo.includes('sales_conversion_entryRateGroup')) {
        this.settings2.hiddenColumns.columns.push(10)
      }
      this.groupStatus = true
      this.pictLoading2 = true
      const data = {
        endDate: this.endDate,
        queryDay: this.queryDay,
        query: this.query
      }
      console.log(data)
      api.getSalesGroupConversionRate(data).then(res => {
        console.log(res, 'yx*******')
        if (res.data.length > 0) {
          const dataArr = []
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < res.data[i].countArr.length; j++) {
              res.data[i].countArr[j].groupName = res.data[i].groupName
              dataArr.push({
                allocateNum: res.data[i].countArr[j].allocateNum,
                fromDate: res.data[i].countArr[j].fromDate,
                dataTime: `${res.data[i].countArr[j].fromDate || '空'} 至 ${res.data[i].countArr[j].toDate || '空'}`,
                isLeader: res.data[i].countArr[j].isLeader,
                kpi: res.data[i].countArr[j].kpi,
                signMenteeNum: res.data[i].countArr[j].signMenteeNum,
                toDate: res.data[i].countArr[j].toDate,
                totalInCny: res.data[i].countArr[j].totalInCny,
                userName: res.data[i].countArr[j].isLeader == '1' ? `${res.data[i].countArr[j].userName}☆` : res.data[i].countArr[j].userName,
                groupName: res.data[i].countArr[j].groupName,
                signPriod: res.data[i].countArr[j].allocateNum ? `${(res.data[i].countArr[j].signMenteeNum / res.data[i].countArr[j].allocateNum * 100).toFixed(2)}%` : '--',
                kpiPriod: res.data[i].countArr[j].signMenteeNum ? (res.data[i].countArr[j].kpi / res.data[i].countArr[j].signMenteeNum).toFixed(2) : '--',
                totalInPriod: res.data[i].countArr[j].signMenteeNum ? (res.data[i].countArr[j].totalInCny / res.data[i].countArr[j].signMenteeNum).toFixed(2) : '--'
              })
            }
          }
          console.log(dataArr)
          this.$nextTick(() => {
            this.settings2.data = dataArr
          })
        } else {
          this.settings2.data = []
          this.$message.error('暂无数据')
        }
        // let data = res.data;
        // for(let i=0;i<data.length;i++){
        //     for(let j=0;j<data[i].countArr.length;j++){
        //         data[i][data[i].countArr[j].label] = data[i].countArr[j].value;
        //     }
        // }
        // for(let i=0;i<data.length;i++){
        //   if(parseFloat(data[i]['分配学员']) > 0){
        //     data[i].consVersionRate = (parseFloat(data[i]['签约学员'])/parseFloat(data[i]['分配学员'])*100).toFixed(2)
        //   }else{
        //     data[i].consVersionRate='0.00'
        //   }
        //   if(parseFloat(data[i]['签约学员']) > 0){
        //     data[i].kpiRate = (parseFloat(data[i]['KPI总数'])/parseFloat(data[i]['签约学员'])).toFixed(2)
        //     data[i].entryRate = (parseFloat(data[i]['入账金额'])/parseFloat(data[i]['签约学员'])).toFixed(2)
        //   }else{
        //     data[i].kpiRate = '0.00'
        //     data[i].entryRate = '0.00'
        //   }
        // }
        // this.consultingData2 = data;

        this.pictLoading2 = false
        this.loading = false
      })
    },
    // changePosition(val){
    //   console.log(val)
    //   if(val){
    //     console.log(val.indexOf('group' != -1))
    //     if(val.indexOf('group' != -1)){
    //       this.groupStatus = false;
    //       this.Topage()
    //     }else{
    //       this.groupStatus = true;
    //       this.Topage2()
    //     }
    //   }else{
    //     this.groupStatus = false;
    //     this.Topage()
    //   }
    // },
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
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      const fileName = '销售转化率_'
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
