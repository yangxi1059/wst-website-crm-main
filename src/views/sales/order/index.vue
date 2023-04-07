<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <el-collapse v-if=" roleInfo.includes(`sales_order_kpi`)" v-model="activeNames" @change="handleChange" class="elementHeight elementHeightyx" >
        <el-collapse-item  ref="elementHeight" style="" class="elementHeight elementHeightyx" title=""  name="1">
          <template slot="title" style="height:30px;line-height:30px;font-weight:600">
            本月销售情况
            <div  style="display:flex;" v-if="salesList && salesList.selfKpiInfo ">
                <div  :style="{'overflow':'hidden','white-space':'nowrap','color':'#FF8C00','margin':'0px 20px'}">{{salesList.selfKpiInfo.userName||'无'}} <span style="color:#FF8C00;">(本人)</span></div>
                <div  style="margin-right:20px;color:#FF8C00;">{{salesList.selfKpiInfo.kpi}}(KPI)</div>
                <div style="color:#FF8C00;">{{salesList.selfKpiInfo.revenue.toFixed(2)}}(入账)</div>
            </div>
          </template>
          <el-button type="success" size="mini" icon="el-icon-refresh" style="position:absolute;top:30px;left:500px" @click="initSales"></el-button>
          <div v-if="salesList && salesList.selfKpiInfo"  class="el-card_teyx123" >
            <el-row style="">
                <div style="" v-if="salesList.groupArr && salesList.groupArr.length > 0">
                  <div style="display:flex;overflow-x:auto">
                    <div  style="min-width:400px;margin-bottom:10px;margin-right:20px;margin-left:1px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)" v-for="(sales,i) in salesList.groupArr" :key="i" >
                        <ul>
                          <li style="height:30px;line-height:30px;background:#DCDFE6;display:flex">
                            <div style="width:130px"  class="" :style="{'overflow':'hidden','white-space':'nowrap','padding-left':'20px','fontWeight':'600'}">{{sales.groupName||'无'}} ({{sales.groupKindName}}汇总)</div>
                            <div  style="display:flex;flex-wrap:wrap">
                              <div  class="_item-name" style="margin:0px;width:50px;margin-right:10px;color:#c32e47;">{{sales.kpi || 0}}(KPI)</div>
                              <div  class="_item-name" style="margin:0px;width:150px;color:#c32e47;overflow:hidden" >{{sales.revenue.toFixed(2) || 0}}(入账)</div>
                            </div>
                          </li>
                          <li v-for="(item,i) in sales.memberArr" :key="i" style="display:flex;flex-wrap:wrap">
                            <div style="width:130px"  class="_item-name" :style="{'overflow':'hidden','white-space':'nowrap'}">{{item.userName||'无'}}</div>
                            <div  class="_item-name" style="width:50px;margin-right:10px;color:#FF8C00;">{{item.kpi}}(KPI)</div>
                            <div style="width:150px;color:#FF8C00;overflow:hidden" class="_item-name" >{{item.revenue.toFixed(2)}}(入账)</div>
                          </li>
                        </ul>
                    </div>
                  </div>
                </div>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="search_page" style="margin-top:10px">
        <div class="search">
          <el-select
            class="mr10"
            size="mini"
            filterable
            v-model="userId"
            placeholder="请选择"
            @change="Topage()"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-input
            v-if="roleInfo.includes(`order_search`)"
            class="mr10"
            size="mini"
            style="width:270px"
            v-model="search"
            clearable
            placeholder="搜索签约编号、学员名、微信ID、学校"
            @keyup.enter.native="Topage()"
          ></el-input>
          <el-dropdown class="mr10" v-if="roleInfo.includes(`order_search`)" split-button type="primary" @click="Topage()">
            搜索
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item ><div @click="showSearch()">更多筛选</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            icon="el-icon-printer"
            v-if="roleInfo.includes(`order_outFile`)"
            size="mini"
            plain
            @click="exportFile('table')"
          >导出</el-button>
          <el-button type="primary" plain @click="vipShow">VIP拉群一览</el-button>

          <!-- <el-button
            icon="el-icon-refresh"
            v-if="roleInfo.includes(`order_save`)"
            size="mini"
            plain
            @click="save"
          >保存</el-button>-->
        </div>
        <pagination
          v-if="roleInfo.includes(`order_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <!-- <el-card shadow="always">
      </el-card> -->
      <hot-table :settings="settings" ref="table" licenseKey="non-commercial-and-evaluation"></hot-table>

      <!-- 入账，退款，入账记录 -->
      <InAccount
        :orderId="orderId"
        :accountVisible="accountVisible"
        :isCompleted="isCompleted"
        @close="beforeBillClose"
        @hasCompleted="hasCompleted"
      />

      <!-- 订单详情 -->
      <OrderDetail
        :orderId="order.orderId"
        :detailVisible="detailVisible"
        @close="orderDetailClose"
        @submit="orderDetailSubmit"
      />

      <!-- 上传，查看合同 -->
      <UploadContract
        :orderId="orderId"
        :contractVisible="contractVisible"
        :userType="userType"
        @close="contractClose"
        @submit="contractSubmit"
      />
      <vipShow
      :vipShowVisible="vipShowVisible"
      :vipShowStatus="vipShowStatus"
      @close="vipShowClose"
    />
    <showSearch
      :showSearchVisible="showSearchVisible"
      :users="users"
      :userId="userId"
      @close="showSearchClose"
      @submit="showSearchSubmit"
    />
    </div>
  </d2-container>

</template>

<script>
import Handsontable from 'handsontable'
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import util from '@/libs/util'
import InAccount from './components/InAccount'
import OrderDetail from './components/OrderDetail'
import UploadContract from './components/UploadContract'
import vipShow from '../../vip/mentee/components/vipShow.vue'
import showSearch from './components/search'
import { renderShortText, priceCny } from '@/libs/tableRender.js'
import { mapState } from 'vuex'

const roleInfo = util.sessions.get('roleInfo')

let All_strategistList = []
let All_servicesList = []
const hotbutton = function (instance, td, row) {
  Handsontable.dom.empty(td)
  let innerHTML = ''
  if (roleInfo.includes('order_edit')) {
    innerHTML += `<button class='hot-button' onclick='accountedit(${row})'><i class="el-icon-edit" title="编辑"></i><span></span></button>`
  }
  if (roleInfo.includes('order_account')) {
    innerHTML += `<button class="hot-button" onclick='accountbooked(${row})'><i class="el-icon-goods" title="入账"></i><span></span></button>`
  }
  if (roleInfo.includes('order_del')) {
    innerHTML += `<button class='hot-button' onclick='accountdel(${row})'><i class="el-icon-delete" title="删除"></i><span></span></button>`
  }
  td.innerHTML = innerHTML
  return td
}
const contract = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  return (td.innerHTML = `<button class='hot-button' onclick='lookContractList(${row})'><i class="el-icon-view"></i><span>查看(${
    !value ? 0 : value
  })</span></button>`)
}
// 是否收齐
const renderPayStatus = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  if (value == '2') {
    td.innerHTML = '<span class=\'colorH\'>未入账</span>'
  } else if (value == '0') {
    td.innerHTML = '<span class=\'colorR\'>部分入账</span>'
  } else if (value == '1') {
    td.innerHTML = '<span class=\'colorG\'>全部入账</span>'
  } else if (value == '3') {
    td.innerHTML = '<span class=\'colorB\'>部分入账,有退款</span>'
  } else if (value == '4') {
    td.innerHTML = '<span class=\'colorB\'>已收齐,有退款</span>'
  }
  return td
}
// 订单状态
const signStatus = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  if (value == '2') {
    td.innerHTML = '<span class=\'colorH\'>其他</span>'
  } else if (value == '0') {
    td.innerHTML = '<span class=\'colorB\'>待确认</span>'
  } else if (value == '1') {
    td.innerHTML = '<span class=\'colorG\'>已确认</span>'
  }
  return td
}
// 信息完整
const vipGroupDate = function (instance, td, row, col, prop, value) {
  const signStatus = instance.getDataAtRow(row)[4]
  Handsontable.dom.empty(td)
  if (signStatus == '1') {
    if (value) {
      td.innerHTML = '<span class=\'colorG\'>已补全</span>'
    } else {
      td.innerHTML = `<span class='colorB hot-button' onclick='toCompleted(${row})'>去补全</span>`
    }
  } else {
    td.innerHTML = ''
  }
  return td
}

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { OrderDetail, UploadContract, InAccount, vipShow, showSearch },
  data () {
    return {
      userInfo: null,
      loading: false,
      users: [],
      sort: '',
      sortCol: '',
      search: '',
      userId: '',
      confirmor: null,
      salesList: {},
      total: 0,
      pageNum: 1,
      pageSize: 50,
      settingsAPIData: [],
      activeNames: [],
      //   订单列表数据
      settings: {
        height: document.documentElement.clientHeight - 120,
        fixedColumnsLeft: 3,
        data: [],
        // rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '操作',
          '合同',
          '订单ID',
          '学校',
          '订单状态',
          '信息完整',
          '购买人',
          '购买时间',
          '订单周期',
          '项目数量',
          '总金额',
          '已入账金额',
          '是否收齐',
          '签约类型',
          '有无折扣',
          '是否VIP同事推荐',
          'VIP同事推荐人',
          'BD管理人',
          'BD提成比例',
          '主联系人',
          '副联系人',
          '合同生效日期',
          '合同终止日期'
        ],
        readOnly: true,
        columns: [
          {
            data: 'hotbutton',
            width: 100,
            renderer: hotbutton
          },
          {
            data: 'contractNum',
            renderer: contract
          },
          {
            data: 'orderId',
            width: 200,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'schoolName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'signStatus',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: signStatus
          },
          {
            data: 'vipGroupDate',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: vipGroupDate
          },
          {
            data: 'realName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'signDate',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'kpiPeriod',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'programNum',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'orderPrice',
            // width: 100,
            // wordWrap: false,
            // className: "short-text",
            // renderer: renderShortText
            renderer: priceCny
          },
          {
            data: 'revenue',
            // title: "已入账金额",
            renderer: priceCny
          },
          // 是否收齐
          {
            data: 'payStatus',
            width: 110,
            // wordWrap: false,
            // className: "short-text",
            renderer: renderPayStatus
          },
          {
            data: 'signWay'
          },
          {
            data: 'discountStatusName'
          },
          {
            data: 'vipRecommendStatusName'
          },
          {
            data: 'vipRecommenderName'
          },
          { data: 'bdManageByName' },
          { data: 'bdBrokerageRate' },
          {
            data: 'contact1Name'
          },
          {
            data: 'contact2Name'
          },
          {
            data: 'startDate',
            type: 'text',
            width: 100,
            wordWrap: false,
            className: 'short-text'
          },
          {
            data: 'endDate',
            // title: "合同有效日期",
            type: 'text',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
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
      dialogVisible: false,
      vipShowVisible: false,
      vipShowStatus: 0,
      rules: {
        channel: [{ required: true, message: '请选择渠道', trigger: 'change' }], // 渠道
        channelNote: [
          { max: 60, message: '备注长度为60个字符以内', trigger: 'blur' }
        ], // 渠道备注
        program: [{ required: true, message: '请选择项目', trigger: 'change' }], // 项目
        programPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ], // 项目价格
        programPriceNote: [
          { max: 60, message: '备注长度为60个字符以内', trigger: 'blur' }
        ], // 项目价格备注
        startDate: [
          { required: true, message: '请选择签约日期', trigger: 'change' }
        ], // 签约日期
        endDate: [
          { required: true, message: '请选择合同有效日期', trigger: 'change' }
        ], // 合同有效日期
        contact1: [
          { required: true, message: '请选择主联系人', trigger: 'change' }
        ], // 主联系人
        strategist: [
          { required: true, message: '请选择全职导师', trigger: 'change' }
        ], // 全职导师
        mentorHour: [
          {
            required: true,
            message: '请输入行业导师一对一课时数',
            trigger: 'blur'
          }
        ], // 行业导师一对一课时数
        vipHour: [
          {
            required: true,
            message: '请输入全职导师一对一课时数',
            trigger: 'blur'
          }
        ], // 全职导师一对一课时数
        programType: [
          { required: true, message: '请选择项目类别', trigger: 'change' }
        ], // 项目类别
        programLevel: [
          { required: true, message: '请选择项目级别', trigger: 'change' }
        ], // 项目级别
        signGrade: [
          { required: true, message: '请选择签约年级', trigger: 'change' }
        ] // 签约年级
        // internshipLocation: "", //远程or实地(实习)
        // internshipStatus: "", //是否已安排(实习)
        // internship: "", //若已安排，实习为(实习)
        // internshipPlan: "", //若无安排，预计何时安排(实习)
        // internshipNote: "" //备注(实习)
      },
      accountVisible: false,
      isCompleted: false,
      contractVisible: false,
      showSearchVisible: false,
      //   入账列表弹框数据
      Account: {},

      //   订单详情数据
      order: {
        orderId: null,
        signStatus: null,
        realName: null,
        signDate: null,
        orderPrice: null,
        revenue: null,
        payStatus: null,
        contact1: null,
        contact2: null,
        startDate: null,
        endDate: null
      },
      //   订单详情项目列表
      orderSettings: {
        height: 200,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colHeaders: [
          //   "操作",
          '项目',
          '项目金额(￥)',
          '项目价格备注',
          '全职导师',
          '客服',
          '行业导师一对一课时',
          '全职导师一对一课时',
          '远程/实地（实习）',
          '是否已安排实习',
          '若已安排，实习为',
          '若无安排，预计何时安排（实习）',
          '备注（实习）',
          '创建人',
          '创建时间',
          '最近修改人',
          '最近操作时间'
        ],
        // readOnly: true,
        columns: [
          //   {
          //     data: "confirmStatus",
          //     renderer: accountDelBtn
          //   },

          {
            data: 'programName',
            readOnly: true
          },
          {
            data: 'programPriceCny',
            readOnly: true,
            width: 100
          },
          {
            data: 'programPriceNote'
            // title: "收入(元)",
          },
          {
            data: 'strategist',
            source: [],
            type: 'autocomplete',
            strict: true,
            allowEmpty: false,
            width: 100
          },
          {
            data: 'services',
            source: [],
            type: 'autocomplete',
            strict: true,
            allowEmpty: false,
            width: 100
          },
          {
            data: 'mentorHour',
            // title: "汇率",
            type: 'numeric'
          },
          {
            data: 'vipHour',
            // title: "总收入(元)",
            type: 'numeric'
          },
          {
            data: 'internshipLocation',
            source: ['实地', '远程'],
            type: 'autocomplete',
            strict: true
          },
          {
            data: 'internshipStatus',
            source: ['是', '否'],
            type: 'autocomplete',
            strict: true
          },
          {
            data: 'internship',
            source: [],
            type: 'autocomplete',
            strict: true
          },
          {
            data: 'internshipPlan',
            type: 'text'
          },
          {
            data: 'internshipNote',
            type: 'text'
          },
          {
            readOnly: true,
            data: 'createBy',
            type: 'text'
          },
          {
            readOnly: true,
            data: 'createTime',
            type: 'text'
          },
          {
            readOnly: true,
            data: 'updateBy',
            type: 'text'
          },
          {
            readOnly: true,
            data: 'updateTime',
            type: 'text'
          }
        ],
        afterChange: change => {
          if (!change) return
          change.forEach(([col, row, old, newData]) => {
            console.log(newData)
            // 保存更新数据
            if (old !== newData) {
              // uptList
              let hasbillId = false
              this.programChangeData.forEach(v => {
                if (this.orderSettings.data[col].signId == v.signId) {
                  v[row] = newData
                  hasbillId = true
                }
              })
              if (!hasbillId) {
                const item = {
                  signId: this.orderSettings.data[col].signId
                }
                item[row] = newData
                this.programChangeData.push(item)
              }
            }
          })
        }
      },
      // 订单项目操作数据
      programData: {},
      // 订单内项目变更数据
      programChangeData: [],
      // 入账变更数据
      billChangeData: {
        addList: [],
        uptList: [],
        delList: []
      },
      // 合同弹框数据
      contractData: {
        list: [],
        signWay: '',
        orderId: ''
      },
      // 项目字典列表
      programList: [],
      userType: 'sales',
      // 凭证弹框
      voucherVisit: false,
      // 凭证弹框数据
      voucherData: {
        list: [],
        orderId: '',
        billId: ''
      },
      // 入账账户
      accountListUsd: [],
      accountListCny: [],

      // 订单详情的签约路径
      signUrl: '签约路径',

      detailVisible: false,

      orderId: null,
      billId: null,
      row: null,
      programIds: ''
    }
  },
  created () {
    this.userInfo = this.$store.state.role.userInfo
    if (
      !this.roleInfo.includes('order_edit') &&
      !this.roleInfo.includes('order_account') &&
      !this.roleInfo.includes('order_del')
    ) {
      this.settings.colHeaders.splice(0, 1)
      this.settings.columns.splice(0, 1)
    }
    this.axios()
  },
  mounted () {
    this.userId = 'ALL'
    this.Topage()
    this.initSales()
    window.accountedit = row => this.accountedit(row)
    window.accountbooked = row => this.accountbooked(row)
    window.toCompleted = row => this.toCompleted(row)
    window.accountdel = row => this.accountdel(row)
    window.lookContractList = row => this.lookContractList(row)
    window.editAccountItem = row => this.editAccountItem(row)
    // this.getAccountList();
  },
  methods: {
    async initSales () {
      api.getSalesKpiRevenue().then(res => {
        console.log(res.data, 'getSalesKpiRevenue*---------------')
        this.salesList = res.data
        if (this.salesList && this.salesList.groupArr && this.salesList.groupArr.length > 0) {
          for (let i = 0; i < this.salesList.groupArr.length; i++) {
            this.salesList.groupArr[i].kpi = 0
            this.salesList.groupArr[i].revenue = 0
            for (let j = 0; j < this.salesList.groupArr[i].memberArr.length; j++) {
              this.salesList.groupArr[i].kpi += this.salesList.groupArr[i].memberArr[j].kpi
              this.salesList.groupArr[i].revenue += this.salesList.groupArr[i].memberArr[j].revenue
            }
          }
        }
        console.log(this.salesList)
      })
      this.confirmor = await this.getDictionary('confirmorDic')
    },
    orderDetailClose () {
      this.detailVisible = false
    },
    orderDetailSubmit () {
      this.orderDetailClose()
      this.Topage()
    },
    axios () {
      this.userId = this.userInfo.userId
      api.subordinate(this.userId, 'sales').then(({ data }) => {
        const users = [
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('order_all_mentee_data')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据（包含离职Sales名下）'
          })
        }
      })
      //   全职导师
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'strategist'
        })
        .then(res => {
          console.log('全职导师', res)
          All_strategistList = res.data.rows
          const strategistList = []
          res.data.rows.forEach(v => {
            strategistList.push(v.userName)
          })
          this.orderSettings.columns[3].source = strategistList
        })
      //   客服
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'services'
        })
        .then(res => {
          console.log('客服', res)
          All_servicesList = res.data.rows
          const servicesList = []
          res.data.rows.forEach(v => {
            servicesList.push(v.userName)
          })
          this.orderSettings.columns[4].source = servicesList
        })
      // 实习单位
      api.getInternshipList().then(res => {
        console.log('实习单位', res)
        const internshipList = []
        res.data.rows.forEach(v => {
          internshipList.push(v.internshipName)
        })
        this.orderSettings.columns[8].source = internshipList
      })
    },
    Topage (num) {
      this.loading = true
      const Data = {
        sort: this.sort,
        sortCol: this.sortCol,
        search: this.search,
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        pageType: 'sales'
      }
      this.settings.data = []
      for (let i = 0; i < this.pageSize; i++) {
        this.settings.data.push({})
      }
      let data2 = {}
      if (num == 999) {
        data2 = { programIds: this.programIds }
      } else {
        this.programIds = ''
        data2 = { programIds: '' }
      }
      api.getOrderList(Data, data2).then(({ data }) => {
        this.pageNum = data.page
        this.settingsAPIData = JSON.parse(JSON.stringify(data.rows))
        data.rows.forEach(v => {
          v.contractNum = v.accessoryContractNum + v.originalContractNum
        })
        const rows = data.rows
        console.log(data)
        this.settings.data = rows
        this.total = data.total
        let heightCard = 0
        if (document.querySelector('.elementHeight')) {
          heightCard = document.querySelector('.elementHeight').offsetHeight
        }
        this.settings.height = document.documentElement.clientHeight - 190 - heightCard
        this.loading = false
      })
    },
    // 订单项目列表弹框
    accountedit (row) {
      const dataValue = this.settings.data[row]
      const data = this.settingsAPIData[row]
      this.order = dataValue
      console.log(data, dataValue)
      this.detailVisible = true
    },
    vipShow () {
      this.vipShowVisible = true
      this.vipShowStatus = 1
    },
    vipShowClose () {
      this.vipShowVisible = false
    },
    // 入账弹框
    accountbooked (row) {
      const data = this.settings.data[row]
      console.log('入账弹框', data)
      if (data.signStatus === '未签约') {
        this.$message('办理入账前,需确认已签约完成!')
        return
      }
      if (data.contractNum == 0) {
        this.$message('办理入账前,需上传合同!')
        return
      }
      this.Account = data
      this.orderId = this.Account.orderId
      this.accountVisible = true
    },
    toCompleted (row) {
      const data = this.settings.data[row]
      this.Account = data
      this.orderId = this.Account.orderId
      this.isCompleted = true
      this.accountVisible = true
    },
    // 生成线上签约地址

    // 删除订单
    accountdel (row) {
      const data = this.settings.data[row]
      if (data.createBy !== this.userInfo.userId) {
        this.$message({
          type: 'warning',
          message: '无法删除，你不是该签约记录创建人！'
        })
        return
      }
      if (data.createTime) {
        let createTime = data.createTime
        createTime = createTime.replace(/-/g, '/')
        createTime = new Date(createTime).getTime() + 604800000
        if (createTime < new Date().getTime()) {
          this.$message({
            type: 'warning',
            message: '无法删除，创建时间超过一周！'
          })
          return
        }
      }
      this.$confirm('此操作将永久删除该入账记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(data.orderId)
          api
            .deleteOrderByOrderId(data.orderId)
            .then(res => {
              console.log('删除订单', res)
              this.$message({
                type: 'success',
                message: res.message
              })
              this.Topage(this.pageNum)
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查看合同列表
    lookContractList (row) {
      this.orderId = this.settings.data[row].orderId
      if (this.settings.data[row].signStatus != '1') {
        this.$message({
          type: 'error',
          message: '订单未确认，不可查看合同'
        })
        return
      }
      this.contractVisible = true
    },
    onSuccess (val) {
      this.programData.contract = val
    },
    contractClose () {
      this.contractVisible = false
      this.voucherVisit = false
    },
    contractSubmit () {
      this.Topage(1)
    },
    voucherClose () {
      this.contractVisible = false
      this.voucherVisit = false
    },
    voucherSubmit () {
      this.voucherClose()
    },

    beforeClose () {
      this.dialogVisible = false
    },
    submitProgramData () {
      this.$refs.orderSettings.$data.hotInstance.validateCells(valid => {
        if (!valid) return
        this.programChangeData.forEach(v => {
          // v.internshipLocation = (v.internshipLocation == '远程' ? 远程: 实地);
          v.internshipStatus &&
            (v.internshipStatus = v.internshipStatus == '是' ? 1 : 0)
          All_strategistList.forEach(vm => {
            if (vm.userName == v.strategist) {
              v.strategist = vm.userId
            }
          })
          All_servicesList.forEach(vm => {
            if (vm.userName == v.services) {
              v.services = vm.userId
            }
          })
        })
        console.log(JSON.stringify(this.programChangeData))
        this.loading = true
        api
          .uptProgramDate(this.programChangeData)
          .then(res => {
            console.log('修改订单内项目信息', res)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.programChangeData = []
            this.loading = false
            this.beforeProgramClose()
            this.Topage(this.pageNum)
          })
          .catch(() => {
            this.loading = false
            this.$message({
              message: '保存失败',
              type: 'error'
            })
          })
      })
    },
    // 添加入账
    booked () {
      console.log('添加入账', this.Account)
      const item = {
        currencyType: null,
        account: null,
        orderId: this.Account.orderId,
        billId: null,
        confirmStatus: null,
        confirmTime: null,
        confirmTime1: null,
        confirmTime2: null,
        confirmor1: null,
        confirmor2: null,
        exchangeRate: this.Account.rate,
        menteeId: null,
        menteeName: null,
        revenueDate: null,
        revenue: null,
        totalInCny: null,
        transfer: null,
        remark: null,
        voucherNum: 0,
        voucherList: []
      }
      this.dialogsettings.data.push(item)
    },
    beforeProgramClose () {
      console.log('关闭订单列表弹框')
      this.orderSettings.data = []
      this.dialogVisible = false
    },
    beforeBillClose () {
      console.log('关闭入账编辑弹框')
      this.accountVisible = false
      this.isCompleted = false
    },
    hasCompleted () {
      console.log('关闭信息补全弹框')
      this.Topage()
      this.accountVisible = false
      this.isCompleted = false
    },
    // 保存入账数据
    accountsubmit () {
      this.$refs.dialogsettings.$data.hotInstance.validateCells(valid => {
        this.dialogsettings.data.forEach(v => {
          if (!v.transfer || !v.account || !v.remark || !v.voucherNum) {
            this.$message({
              type: 'error',
              message: '付款人、收款账户、入账说明以及凭证都是不可为空'
            })
            valid = false
          }
          if (!v.billId) {
            this.billChangeData.addList.push(v)
          }
        })
        if (!valid) {
          this.billChangeData.addList = []
          return
        }
        // 查重复
        // let arr = [...this.dialogsettings.data,...this.dialogsettings1.data];
        // let price = [];
        // arr.forEach(v=>{
        //   price.push(v.totalInCny);
        // });
        // if(new Set(price).size < arr.length){
        let both = false
        let arrId = []
        const arr = [...this.dialogsettings.data, ...this.dialogsettings1.data]
        this.dialogsettings.data.forEach((v, i) => {
          for (let j = i + 1; j < arr.length; j++) {
            if (
              arr[j].totalInCny == v.totalInCny &&
              arr[j].account == v.account &&
              arr[j].transfer == v.transfer
            ) {
              arrId = [i, j]
              both = true
              break
            }
          }
        })
        if (both) {
          this.$confirm(
            `第${arrId[0] + 1}行与第${arrId[1] + 1}行，入账数据类似`,
            '有类似入账信息',
            {
              confirmButtonText: '继续提交入账',
              cancelButtonText: '回看相似入账'
            }
          )
            .then(() => {
              this.submit2()
            })
            .catch(() => {
              this.billChangeData.addList = []
            })
        } else {
          this.submit2()
        }
      })
    },
    submit2 () {
      // 审核人姓名到id的转换（新增）收款类型
      this.billChangeData.addList.length &&
        this.billChangeData.addList.forEach(v => {
          confirmor.bill_confirm[0].confirmor1.forEach((vm, i) => {
            if (vm.confirmorName == v.confirmor1) {
              v.confirmor1 = vm.confirmorId
            }
          })
          confirmor.bill_confirm[1].confirmor2.forEach((vm, i) => {
            if (vm.confirmorName == v.confirmor2) {
              v.confirmor2 = vm.confirmorId
            }
          })
          v.currencyType &&
            [
              { value: '美金', id: 'usd' },
              { value: '人民币', id: 'cny' }
            ].forEach(vm => {
              if (vm.value == v.currencyType) {
                v.currencyType = vm.id
              }
            })
        })
      // 审核人姓名到id的转换（修改）收款类型
      this.billChangeData.uptList.length &&
        this.billChangeData.uptList.forEach(v => {
          v.confirmor1 &&
            confirmor.bill_confirm[0].confirmor1.forEach(vm => {
              if (vm.confirmorName == v.confirmor1) {
                v.confirmor1 = vm.confirmorId
              }
            })
          v.confirmor2 &&
            confirmor.bill_confirm[1].confirmor2.forEach(vm => {
              if (vm.confirmorName == v.confirmor2) {
                v.confirmor2 = vm.confirmorId
              }
            })
          v.currencyType &&
            [
              { value: '美金', id: 'usd' },
              { value: '人民币', id: 'cny' }
            ].forEach(vm => {
              if (vm.value == v.currencyType) {
                v.currencyType = vm.id
              }
            })
        })
      console.log(JSON.stringify(this.billChangeData))
      api.uptBillList(this.billChangeData).then(res => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        console.log('更新入账数据', res)
        this.billChangeData = {
          addList: [],
          uptList: [],
          delList: []
        }
        this.dialogsettings.data = []
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(999)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(999)
    },
    // 导出文件
    exportFile (e) {
      // 拿handsontable实例
      const handsontable = this.$refs[e].$data.hotInstance
      const fileName = '签约管理_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename:
          fileName +
          this.userInfo.userName +
          '_' +
          this.userId +
          '_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    },
    // 转线下合同
    offLine (signId) {
      this.$confirm(`确认将${signId}转为下线？`)
        .then(() => {
          api.onLineToOffLine(signId).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '合同已转为线下签约'
            })
            this.Topage(this.pageNum)
          })
          // done();
        })
        .catch(() => {})
      this.beforeClose()
    },
    // 编辑项目信息弹框
    editAccountItem (row) {
      console.log(
        '编辑项目信息',
        row,
        JSON.stringify(this.orderSettings.data[row])
      )
      this.programData = this.orderSettings.data[row]
    },
    handleChange () {
      let timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        const heightCard = document.querySelector('.elementHeight').offsetHeight
        console.log(heightCard)
        this.settings.height = document.documentElement.clientHeight - 190 - heightCard
        document.querySelector('.handsontable').style.maxHeight = this.settings.height + 'px'
      }, 500)
    },
    // 入账账户列表
    getAccountList () {
      api.getAccountList().then(res => {
        console.log(res.data.rows)
        const account = []
        res.data.rows.forEach(v => {
          account.push(v.accountName)
        })
        this.dialogsettings.columns[4].source = account // 人民币账户
      })
      console.log(confirmor.bill_confirm)
      const confirmor1 = []
      const confirmor2 = []
      confirmor.bill_confirm[0].confirmor1.forEach(v => {
        confirmor1.push(v.confirmorName)
      })
      confirmor.bill_confirm[1].confirmor2.forEach(v => {
        confirmor2.push(v.confirmorName)
      })
      console.log(confirmor1, confirmor2)
      this.dialogsettings.columns[10].source = confirmor1
      this.dialogsettings.columns[12].source = confirmor2
    },
    showSearch () {
      this.showSearchVisible = true
    },
    showSearchClose () {
      this.showSearchVisible = false
    },
    showSearchSubmit (data) {
      this.showSearchVisible = false
      this.programIds = data.programIds
      this.search = data.search
      this.userId = data.userId
      this.Topage(999)
      console.log(data)
    }
  }
}
</script>

<style lang='scss' scoped>
.d2_container{
  width:100%;
  height:100%;
  .account {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .elementHeightyx ._item-name{
    width: 150px;
    margin: 0px 0px;
  }
  .el-collapse-item__content{
    font-size: 12px;
    padding-bottom: 10px;
  }
}
.el-card_teyx123{
  padding: 10px 10px 0px 10px;
}
.url-box {
  white-space: wrap;
  width: 300px;
  overflow: hidden;
  height: 50px;
  text-overflow: ellipsis;
}
.copy {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px #FF8C00 solid;
  color: #FF8C00;
  border-radius: 5px;
  display: inline-block;
  margin-right: 20px;
}
.copy:hover {
  background-color: #FF8C00;
  color: #fff;
}
.elementHeight ::v-deep .el-collapse-item__header {
  background-color: #FFF!important;
}
</style>
