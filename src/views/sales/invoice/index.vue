<!--
 * @Author: 库建华
 * @Date: 2020-06-09 09:52:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-14 10:23:28
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:250px"
            v-model="search"
            clearable
            placeholder="支持订单号、学生姓名、发票抬头"
            v-if="roleInfo.includes(`invoice_search`)"
            @keyup.enter.native="Topage()"
          ></el-input>
          <el-select
            class="mr10"
            size="mini"
            filterable
            v-model="userId"
            placeholder="订单创建人"
            @change="Topage()"
            v-if="roleInfo.includes(`invoice_select`)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            clearable
            v-model="invoiceMode"
            placeholder="开票模式"
            @change="Topage()"
            v-if="roleInfo.includes(`invoice_select`)"
          >
            <el-option
              v-for="item in invoice_mode"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            filterable
            v-model="invoiceStatus"
            placeholder="是否已开票"
            clearable
            v-if="roleInfo.includes(`invoice_select`)"
            @change="Topage()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            filterable
            v-model="isSend"
            placeholder="是否已寄出"
            clearable
            v-if="roleInfo.includes(`invoice_select`)"
            @change="Topage()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="Topage()"
            v-if="roleInfo.includes(`invoice_search`)"
          >GO</el-button>
          <el-button
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="exportFile()"
            v-if="roleInfo.includes(`invoice_download`)"
          >下载</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        :max-height="tableHeight"
        style="width: 100%"
        @row-dblclick="detail"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="invoiceStatusName" align="center" label="是否已开票" min-width="110px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.invoiceStatus"
              active-color="#13ce66"
              inactive-color="#E6A23C"
              active-value="1"
              inactive-value="0"
              active-text="是"
              inactive-text="否"
              @change="setInvoiceStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="isSendName" align="center" label="是否已寄出" min-width="110px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isSend"
              active-color="#13ce66"
              inactive-color="#E6A23C"
              active-value="1"
              inactive-value="0"
              active-text="是"
              inactive-text="否"
              @change="setInvoiceIsSend(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" align="center" label="订单号" min-width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="orderDetail(scope.row)">{{scope.row.orderId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceTypeName" align="center" label="发票类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="invoiceModeName" align="center" label="开票模式" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.invoiceModeName == '电子发票'" type="text" @click="toEmail(scope.row)">{{scope.row.invoiceModeName}}</el-button>
            <span v-else>{{scope.row.invoiceModeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceFund" align="center" label="金额" min-width="100"></el-table-column>
        <el-table-column
          prop="menteeName"
          align="center"
          label="购买学生姓名"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="invoiceTitle"
          align="center"
          label="发票抬头/个人姓名"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="invoiceAccount"
          align="center"
          label="税号/个人证件"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="recipientName" align="center" label="收件人" min-width="100"></el-table-column>
        <el-table-column prop="recipientPhone" align="center" label="收件人电话" min-width="100"></el-table-column>
        <el-table-column
          prop="recipientAddr"
          align="center"
          label="发票收件地址"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="recipientEmail"
          align="center"
          label="发票收件邮箱"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="invoiceCompanyName"
          align="center"
          label="开票公司"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createByName"
          align="center"
          label="订单创建人"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="invoiceByName"
          align="center"
          label="开票人"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="invoiceTime"
          align="center"
          label="开票时间"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <InvoiceDetail
        :detailVisible="detailVisible"
        :invoiceId="invoiceId"
        @close="detailClose"
        @submit="detailSubmit"
      />
      <OrderDetail
        :orderId="orderId"
        :detailVisible="orderVisible"
        @close="orderClose"
        @submit="orderSubmit"
      />
      <toEmailDetail
        :toEmailVisible="toEmailVisible"
        @close="toEmailClose"
        @submit="submitEmail"
        :emailData="emailData"
      />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/sales_assistant'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import util from '@/libs/util'

import OrderDetail from '../order/components/OrderDetail'
import InvoiceDetail from './components/InvoiceDetail'
import toEmailDetail from './components/toEmail'

import { mapState } from 'vuex'
export default {
  name: 'SalesInvoice',
  mixins: [mixins],
  components: { InvoiceDetail, OrderDetail, toEmailDetail },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data: () => {
    return {
      invoice_mode: [],
      loading: false,
      myDate: [],
      userId: 'ALL',
      search: null,
      invoiceType: null,
      invoiceStatus: null,
      invoiceMode: null,
      isSend: null,
      users: [],
      total: 0,
      pageNum: 1,
      pageSize: 50,
      toEmailVisible: false,
      emailData: {},
      tableHeight: 'auto',
      tableData: [],
      common_yes_or_no: [],
      invoiceId: '',
      detailVisible: false,
      orderVisible: false,
      orderId: '',
      multipleSelection: []
    }
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted () {
    this.pageInit()
    api.subordinate(this.userInfo.userId).then(({ data }) => {
      console.log('获取用户列表', data)
      const users = [{ userId: 'ALL', userName: 'ALL' }]
      if (this.roleInfo.includes('invoice_All_Data')) {
        users.unshift({ userId: 'ALL_Data', userName: '全数据' })
      }
      data.forEach((e) => {
        if (!users.some((em) => em.userId == e.userId)) {
          users.push(e)
        }
      })
      this.users = users
    })
    apiDic.getDicDropdown('common_yes_or_no').then((res) => {
      console.log(res)
      this.common_yes_or_no = res.data.common_yes_or_no
    })
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.invoice_mode = await this.getDictionary('invoice_mode')
    },
    Topage () {
      const params = {
        search: this.search,
        invoiceType: this.invoiceType,
        invoiceStatus: this.invoiceStatus,
        invoiceMode: this.invoiceMode,
        isSend: this.isSend,
        createBy: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      api.getInvoiceList(params).then((res) => {
        console.log('getInvoiceList', res.data)
        this.total = res.data.total
        this.tableData = res.data.rows
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
    },
    detail (row, column, event) {
      console.log(row, column, event)
      this.invoiceId = row.invoiceId
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSubmit () {
      this.Topage()
    },
    orderDetail (v) {
      this.orderId = v.orderId
      this.orderVisible = true
    },
    orderClose () {
      this.orderVisible = false
    },
    orderSubmit () {
      // this.orderClose();
      this.Topage()
    },
    setInvoiceIsSend (v) {
      api.uptInvoice(v).then(() => {
        this.$message({
          type: 'success',
          message: '发票更新成功'
        })
        this.Topage()
      })
    },
    setInvoiceStatus (v) {
      if (v.invoiceStatus == '1' && !v.invoiceBy) {
        v.invoiceBy = this.userInfo.userId
        v.invoiceTime = new Date()
      }
      api.uptInvoice(v).then(() => {
        this.$message({
          type: 'success',
          message: '发票更新成功'
        })
        this.Topage()
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    toEmail (data) {
      this.toEmailVisible = true
      this.emailData = data
      console.log(data)
    },
    toEmailClose () {
      this.toEmailVisible = false
    },
    submitEmail () {
      console.log(1111111)
      this.Topage()
    },
    exportFile () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请先勾选需要下载的发票'
        })
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
      const invoiceIds = this.multipleSelection.map((v) => v.invoiceId).join(',')
      // api.downloadInvoice(invoiceIds).then(res=>{
      //   console.log(res);
      // })
      const fileName = '发票' + new Date()
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}invoice/download?invoiceIds=` + invoiceIds,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.zip' // 如123.xls
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
    }
  }
}
</script>

<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%
}
</style>
