<!--
 * @Author: Kaan
 * @Date: 2022-04-11 14:40:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-07 10:47:35
 * @version:
 * @Descripttion:
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container yx_data" ref="d2">
      <div ref="search" class="yx_showApply_for_batch" style="display:flex">
          <div class="block1">您已选择【<span style="color:#c32e47">{{multipleSelection.length}}</span>/{{tableDataLength}}】条 , 累计【<span style="color:#c32e47">{{clickHour}}</span>/{{totalHour}}】课时的记录
            <!-- <el-button @click="Topage()">GO</el-button> -->
          </div>
          <div>
              <el-button class="ml20" type="primary"  @click="apply()">提交申请</el-button>
          </div>
      </div>
      <el-table
        :max-height="tableHeight"
        :data="tableData"
        size="mini"
        row-key="lessonIds"
        ref="multipleTable"
        @filter-change="filterChange"

        @selection-change="handleSelectionChange"
        tooltip-effect="dark"
        border
      >
        <el-table-column align="center" :selectable="selectable" :reserve-selection="true" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="学员姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="mentorName" label="导师姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover effect="dark" :disabled="!scope.row.defaultPayment || ( scope.row.defaultPayment && !scope.row.defaultPayment.remark)" placement="right" width="400" trigger="hover">
              <div :style="{background:'#fff'}" >{{scope.row.defaultPayment.remark}}</div>
              <p slot="reference">
                <el-badge :is-dot="!!(scope.row.defaultPayment && scope.row.defaultPayment.remark)">{{scope.row.mentorName}}</el-badge>
              </p>
            </el-popover>
            <!-- <el-popover v-if="scope.row.defaultPayment && scope.row.defaultPayment.remark" width="200" trigger="hover" :content="scope.row.defaultPayment.remark">
              <el-badge  class="item">
                <span>{{scope.row.mentorName}}</span>
              </el-badge>
            </el-popover>
            <div v-else-if="scope.row.defaultPayment && !scope.row.defaultPayment.remark">{{scope.row.mentorName}}</div>
            <div v-else>{{scope.row.mentorName}}</div> -->
          </template>
        </el-table-column>
        <el-table-column align="center" prop="totalHour" label="课时" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="" label="佣金" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.lessonFeeType}} {{scope.row.totalFee}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="lessonDate" label="课程日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center"  label="收款方式"
        :filters="filtersPayType"
        :column-key="'paymentTypeName'"
        filter-placement="bottom-end"
        :filter-method="filterHandler"
        >
        <!-- :filter-multiple="false" -->

          <template slot-scope="scope">
            <el-button type="text" @click="showPayDetail(scope.row.defaultPayment)"  v-if="scope.row.defaultPayment && scope.row.defaultPayment.paymentType">
              {{scope.row.defaultPayment.paymentTypeName}}
              <!-- <img :src="`${require('@/assets/img/pay/'+scope.row.defaultPayment.paymentType+'.png')}`"/> -->
            </el-button>
            <div v-else>暂无</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  name: 'applySeason',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      loading: false,
      // 搜索栏数据
      tableData: [],
      tableHeight: 'auto',
      multipleSelection: [],
      clickHour: 0,
      totalHour: 0,
      tableDataLength: 0,
      filtersPayType: []
    }
  },
  watch: {
    tableData: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
    },
    Topage () {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.clickHour = 0
      this.totalHour = 0
      this.tableDataLength = 0
      this.loading = true
      api.getInitLessonPaymentApplyForBatch().then(res => {
        this.tableData = res.data
        let num = 0
        const arr = []
        this.tableData.forEach(item => {
          num += item.totalHour
          item.paymentTypeName = item.defaultPayment.paymentTypeName
          arr.push({ text: item.defaultPayment.paymentTypeName, value: item.defaultPayment.paymentTypeName })
        })
        const newobj = {}
        this.filtersPayType = arr.reduce((preVal, curVal) => {
          newobj[curVal.text] ? '' : newobj[curVal.text] = preVal.push(curVal)
          return preVal
        }, [])
        this.totalHour = num
        this.tableDataLength = this.tableData.length
        console.log(this.tableData)
        this.loading = false
      })
    },
    apply () {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择一条课时记录 ！！')
      } else {
        this.loading = true
        api.postInitLessonPaymentApplyForBatch(this.multipleSelection).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$message.success('申请成功！！')
            this.Topage()
          } else {
            this.$message.error(res.message)
            this.loading = false
          }
        })
        console.log(this.multipleSelection)
      }
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
      let num = 0
      this.multipleSelection.forEach(item => {
        num += item.totalHour
      })
      this.clickHour = num
    },
    selectable (row, index) {
      if (row.defaultPayment && row.defaultPayment.accountId) {
        return true
      } else {
        return false
      }
    },
    showPayDetail (data) {
      console.log(data)
      const url = require('@/assets/img/pay/' + data.paymentType + '.png')
      console.log(url)
      const h = this.$createElement
      this.$msgbox({
        title: '账户信息',
        message: h('p', null, [
          h('div', { style: 'color: #c32e47;margin-bottom:10px' }, `${data.paymentTypeName} `),
          h('div', { style: 'width:50px;height:50px;background-image:url(' + url + ');background-size: contain;margin-bottom:10px;background-repeat: no-repeat' }),
          h('div', { style: 'color: #E6A23C;margin-bottom:10px' }, `账户/邮箱：${data.payAcc || '暂无'}`),
          h('div', { style: 'color: #E6A23C' }, `收款人：${data.realName || '暂无'}`)
        ]),
        confirmButtonText: '确定'
      })
    },
    filterChange (filters) {
      console.log(filters)
      const a = 'paymentTypeName'
      // const b = 'el-table_2_column_14'
      // console.log(filters[a], 232, '重置')
      if ((filters[a] && filters[a].length == 0)) {
        this.$refs.multipleTable.clearSelection()
        this.multipleSelection = []
        let num = 0
        this.tableData.forEach(item => {
          num += item.totalHour
        })
        this.clickHour = 0
        this.totalHour = num
        this.tableDataLength = this.tableData.length
      } else {
        let str = ''
        filters[a].forEach(item => {
          str += item
        })
        console.log(str)
        this.multipleSelection = []
        this.clickHour = 0
        this.totalHour = 0
        this.tableDataLength = 0
        this.$refs.multipleTable.clearSelection()
        this.tableData.forEach(item => {
          if (str.includes(item.paymentTypeName)) {
            this.tableDataLength += 1
            this.totalHour += item.totalHour
          }
        })
      }
    },
    filterHandler (value, row) {
      console.log(value)
      // this.multipleSelection = []
      // this.clickHour = 0
      // this.totalHour = 0
      // this.tableDataLength = 0
      // this.$refs.multipleTable.clearSelection()
      // this.tableData.forEach(item => {
      //   if (item.defaultPayment.paymentTypeName == value) {
      //     this.tableDataLength += 1
      //     this.totalHour += item.totalHour
      //   }
      // })
      return row.paymentTypeName === value
    }
  }
}
</script>

<style lang="scss" scoped>
    .yx_showApply_for_batch{
        width: 100%;
        display: flex;
        line-height: 40px;
        justify-content: space-between;
        font-size: 12px;
        padding: 5px 20px;
        box-sizing: border-box;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .yx_data{
      .el-message-box__message div{
        background-size: cover;
        background-repeat: no-repeat;
      }
    }
</style>
