<!--
 * @Author: 库建华
 * @Date: 2019-11-04 10:40:18
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-18 10:10:46
 * @Version: 1
 * @Description: 实现：导师佣金申请，学生（项目）-导师列表 -> 课表 -> 选课、选账户、审核人，提交申请；
 -->
<template>
  <d2-container  v-loading="loading">
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item,i) in applyTypeList" :key="i" :label="item.itemName" :name="item.itemValue">
            <div v-if="item.itemValue == 'mentor_payment'">
            <div class="search_page">
                <div class="search">
                <el-input
                    class="mr10"
                    size="mini"
                    v-model="search"
                    clearable
                    placeholder="导师名称、学员名称、学员微信模糊查询"
                    @keyup.enter.native="Topage()"
                    :style="{width:'160px'}"
                ></el-input>
                <el-select
                    v-model="userId"
                    class="mr10"
                    size="mini"
                    v-if="item.userList"
                    :style="{width:'160px'}"
                    @change="Topage()"
                >
                    <el-option
                    v-for="(item,i) in item.userList"
                    :key="i"
                    :label="item.userName"
                    :value="item.userId"
                    ></el-option>
                </el-select>

                <el-select
                    v-model="paymentAccount"
                    size="mini"
                    clearable
                    style="width:160px"
                    filterable

                    class="mr10"
                    placeholder="账户类型"
                    @change="Topage()"
                >
                    <el-option
                    v-for="item in payment_account"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                    ></el-option>
                </el-select>
                <el-button
                    icon="el-icon-edit-outline"
                    class="mr10 "
                    size="mini"
                    plain
                    @click="Topage()"
                >GO</el-button>
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
                :row-class-name="tableRowClassName"
            >
                <el-table-column align="center" label="详情">
                <template slot-scope="scope">
                    <el-button
                    type="text"
                    size="mini"
                    @click="toDetail2(scope.row)"
                    class="el-icon-tickets"
                    >课 表</el-button>
                </template>
                </el-table-column>
                <el-table-column align="center" prop="menteeName" label="学员名" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="wxId" label="学员微信" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="mentorName" label="导师名" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="programName" label="购买项目" show-overflow-tooltip></el-table-column>
                <el-table-column
                align="center"
                prop="servicesName"
                label="Program Manager"
                show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                align="center"
                prop="strategistName"
                label="规划导师"
                show-overflow-tooltip
                ></el-table-column>
                <el-table-column align="center" prop="latestPayDate" label="最近支付日期" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="signLesson" label="分配课时" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="finishHours" label="已完成课时" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="payHours" label="已支付课时" show-overflow-tooltip></el-table-column>
                <template v-if="!pageType">
                <el-table-column
                    align="center"
                    prop="unConfirmHours"
                    label="已支付未确认课时"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="paymentAccountName"
                    label="付款账户"
                    show-overflow-tooltip
                ></el-table-column>
                </template>
                <template v-else>
                <el-table-column align="center" prop="unpayHours" label="未申请的完成课时" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="applyHours" label="申请中的完成课时" show-overflow-tooltip></el-table-column>
                </template>
            </el-table>
            </div>
            <div v-else>
            <div class="search_page">
                <div class="search">
                <el-input
                    class="mr10"
                    size="mini"
                    v-model="search"
                    clearable
                    placeholder="导师名称、学员名称、学员微信模糊查询"
                    @keyup.enter.native="Topage()"
                    :style="{width:'160px'}"
                ></el-input>
                <el-select
                    v-model="userId"
                    class="mr10"
                    size="mini"
                    v-if="item.userList"
                    :style="{width:'160px'}"
                    @change="Topage()"
                >
                    <el-option
                    v-for="(item,i) in item.userList"
                    :key="i"
                    :label="item.userName"
                    :value="item.userId"
                    ></el-option>
                </el-select>

                <el-select
                    v-model="paymentAccount"
                    size="mini"
                    clearable
                    style="width:160px"
                    filterable
                    class="mr10"
                    placeholder="账户类型"

                    @change="Topage()"
                >
                    <el-option
                    v-for="item in payment_account"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                    ></el-option>
                </el-select>
                <el-button
                    icon="el-icon-edit-outline"
                    class="mr10 "
                    size="mini"
                    plain
                    @click="Topage()"
                >GO</el-button>
                </div>
                <pagination
                :total="total"
                :current-page="pageNum"
                :page-size="pageSize"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
                ></pagination>
            </div>
            <el-table :data="tableData" size="mini" highlight-current-row >
                <el-table-column
                align="center"
                label="详情"
                >
                <template slot-scope="scope">
                    <el-button
                    type="text"
                    size="mini"
                    @click="toDetail(scope.row)"
                    class="el-icon-tickets"
                    >确认到账</el-button>
                </template>
                </el-table-column>
                <el-table-column align="center" v-if="item.itemValue == 'comm_mentor_referral_fee'" prop="mentorName" label="推荐人" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" v-if="item.itemValue == 'comm_mentor_referral_fee'" prop="recommendedMentorName" label="新入职导师" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" v-if="item.itemValue != 'comm_mentor_referral_fee'" prop="mentorName" label="导师名" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="payType" label="金额类型" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="payAmount" label="金额" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="payByName" label="付款人" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="" label="申请人" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.applyId" @click="toApplyDetail(scope.row.applyId)">{{scope.row.applyByName}}</el-button>
                    <span v-else>{{scope.row.applyByName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="payDate" label="付款日期" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="paymentAccountName" label="付款账户" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="payRemark" label="支付备注" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="payVoucher" label="支付凭证" show-overflow-tooltip>
                <template slot-scope="scope" v-if="scope.row.payVoucher">
                    <el-button size="mini" @click="download(scope.row.payVoucher)">支付凭证</el-button>
                </template>
                </el-table-column>
            </el-table>
            </div>
        </el-tab-pane>
        </el-tabs>
    </div>
    <pay
    :payVisible="payVisible"
    :signId="signId"
    :mentorId="mentorIdToLesson"
    :menteeId="menteeId"
    @close="payClose"
    @submit="paySubmit"
    />
    <pay-confirm
    :payConfirmVisible="payConfirmVisible"
    :menteeId="menteeId"
    :mentorId="mentorIdToLesson"
    @close="payConfirmClose"
    @submit="payConfirmSubmit"
    ></pay-confirm>
    <applyDetailBlock :recommendDetailVisible="recommendDetailVisible" :applyData="applyData" @close="closeDetail" />
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip'
import pay from './mentor/pay.vue'
import payConfirm from './mentor/pay_confirm.vue'
import applyDetailBlock from '../../apply_audit/recommend/detail.vue'
import apiU from '@/api/user'
import { downloadFun } from '@/libs/file'
import { mapState } from 'vuex'

export default {
  name: 'mentor_payment_extra',
  mixins: [mixins],
  components: { pay, payConfirm, applyDetailBlock },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      loading: false,
      activeName: 'mentor_payment',
      tableData: [],
      pageNum: 0,
      pageSize: 50,
      total: 0,
      search: '',
      userList: [],
      applyTypeList: [
      ],
      mentorList: [],
      mentor_pay_type: [],
      userId: 'ALL',
      mentorId: '',
      mentorIdToLesson: '',
      menteeId: '',
      payVisible: false,
      payConfirmVisible: false,
      signId: '',
      pageType: false,
      paymentType: '',
      confirmStatusList: [
        { itemName: '全部', itemValue: '' },
        { itemName: '待确认', itemValue: '0' },
        { itemName: '已确认', itemValue: '1' }
      ],
      confirmStatus: '',
      payment_account: [],
      recommendDetailVisible: false,
      applyData: {},
      paymentAccount: '',
      applyType: 'mentor_payment'
    }
  },
  created () {
    this.roleInfo.includes('mentor_payment_extra_0_tab') ? this.applyTypeList.push({
      itemName: '导师课时佣金',
      itemValue: 'mentor_payment',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_0_allData'),
      userList: []
    }) : ''
    this.roleInfo.includes('mentor_payment_extra_1_tab') ? this.applyTypeList.push({
      itemName: '行业导师薪资',
      itemValue: 'mentor_payment_extra',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_1_allData'),
      userList: []
    }) : ''
    this.roleInfo.includes('mentor_payment_extra_2_tab') ? this.applyTypeList.push({
      itemName: '升学导师薪资',
      itemValue: 'academic_mentor_bonus',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_2_allData'),
      userList: []
    }) : ''
    this.roleInfo.includes('mentor_payment_extra_3_tab') ? this.applyTypeList.push({
      itemName: '导师年度Bonus Offer',
      itemValue: 'comm_mentor_bonus',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_3_allData'),
      userList: []
    }) : ''
    this.roleInfo.includes('mentor_payment_extra_6_tab') ? this.applyTypeList.push({
      itemName: '导师年度Bonus 面试',
      itemValue: 'comm_mentor_bonus_interview',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_6_allData'),
      userList: []
    }) : ''
    this.roleInfo.includes('mentor_payment_extra_4_tab') ? this.applyTypeList.push({
      itemName: '导师推荐费',
      itemValue: 'comm_mentor_referral_fee',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_4_allData'),
      userList: []
    }) : ''
    this.roleInfo.includes('mentor_payment_extra_5_tab') ? this.applyTypeList.push({
      itemName: '导师自助提现',
      itemValue: 'comm_mentor_withdrawal',
      userListAllData: this.roleInfo.includes('mentor_payment_extra_5_allData'),
      userList: []
    }) : ''
  },
  mounted () {
    this.Topage()
    this.pageInit()
    apiU.userList({
      pageNum: 1,
      pageSize: 1000,
      entryStatus: '1'
    })
      .then(({ data }) => {
        console.log(
          'userList...........................................',
          data
        )
        this.userList = data.rows.filter(
          v =>
            v.positionIds.includes('strategist') ||
            v.positionIds.includes('service')
        )
        this.userList.unshift({ userName: 'ALL', userId: 'ALL' })
        this.applyTypeList.forEach(v => {
          if (v.hasOwnProperty('userList')) {
            v.userListAllData ? v.userList = [{ userName: 'ALL(全数据)', userId: 'ALL_Data' }].concat(this.userList) : v.userList = this.userList
          }
        })
      })
  },
  methods: {
    async pageInit () {
      this.mentor_pay_type = await this.getDictionary('mentor_pay_type')
      this.mentor_pay_type.unshift({ itemValue: '', itemName: '全部账户类型' })
      this.payment_account = await this.getDictionary('payment_account')
      this.payment_account.unshift({ itemValue: '', itemName: '全部账户类型' })
    },
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        paymentAccount: this.paymentAccount,
        userId: this.userId,
        applyType: this.applyType,
        paymentType: this.paymentType,
        sortCol: '',
        sort: ' '
      }
      console.log('列表参数', params)
      this.loading = true
      if (this.applyType == 'mentor_payment') {
        api.getLessonListUnConfirm(params).then(res => {
          this.tableData = res.data.rows
          this.total = res.data.total
          this.loading = false
        })
      } else {
        api.getMentorConfirmList(params).then(res => {
          this.tableData = res.data.rows
          this.total = res.data.total
          this.loading = false
        })
      }
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    toDetail2 (v) {
      this.signId = v.signId
      this.mentorIdToLesson = v.mentorId
      this.menteeId = v.menteeId
      this.payConfirmVisible = true
    },
    toDetail (v) {
      console.log(v)
      this.signId = v.signId
      // this.mentorIdToLesson = v.mentorId;
      this.menteeId = v.menteeId
      // if (this.pageType) {
      //   this.payVisible = true;
      // } else {
      //   this.payConfirmVisible = true;
      // }
      this.$confirm('此操作将确认该笔付款已到账, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            payId: v.payId,
            applyId: v.applyId
          }
          api.updateMentorPaymentDetail(data).then(res => {
            console.log('确认酬金', res)
            this.$message({
              type: 'success',
              message: '确认成功'
            })
            this.Topage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    payClose () {
      this.payVisible = false
    },
    handleClick (tab, event) {
      console.log(tab, event)
      this.applyType = tab.name
      this.pageNum = 1
      this.pageSize = 50
      this.search = ''
      this.mentorId = ''
      this.paymentAccount = ''
      this.userId = 'ALL'
      this.Topage()
    },
    paySubmit () {
      this.payClose()
      this.Topage()
    },
    payConfirmClose () {
      this.payConfirmVisible = false
    },
    payConfirmSubmit () {
      this.Topage()
    },
    submit () {
      console.log(this.multipleSelection)
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    toApplyDetail (applyId) {
      api.getApplyDetailByApplyId(applyId).then(res => {
        this.recommendDetailVisible = true
        this.applyData = res.data
        this.applyData.applyStatus = res.data.apply.applyStatus
        this.applyData.applyType = res.data.apply.applyType
        this.applyData.applyId = res.data.apply.applyId
        console.log(res.data)
      })
    },
    tableRowClassName ({ row }) {
      if (row.unConfirmHours > 0) {
        return 'warning-row'
      }
      return ''
    },
    closeDetail () {
      this.recommendDetailVisible = false
    }
  }
}
</script>

<style >
  .el-table tr.warning-row {
    background: oldlace;
  }
</style>
