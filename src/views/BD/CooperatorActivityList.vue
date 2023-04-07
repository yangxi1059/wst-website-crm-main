/* eslint-disable semi */
<!--
 * @Author: 库建华
 * @Date: 2020-06-29 14:14:00
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-25 17:23:20
 * @Version: 1
 * @Description:
-->

<template>
  <d2-container v-loading="loading">
    <div class="user">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="合作商活动名称"
            clearable
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-select
            class="mr10"
            size="mini"
            style="width:150px"
            filterable
            v-model="activityWay"
            clearable
            placeholder="活动方式"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in sign_way_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            style="width:100px"
            size="mini"
            filterable
            v-model="manageBy"
            placeholder="选择用户"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class=""
            v-if="roleInfo.includes(`BD_cooperator_search`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-date"
            class="mr10"
            v-if="roleInfo.includes(`BD_cooperator_calendar`)"
            size="mini"
            plain
            @click="calendar"
          >日历表</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-sizes="[50, 100, 200, 300]"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        show-header-overflow
        style="width: 100%"
        @cell-dblclick="toDetail"
      >
        <!-- :optimization="{scrollX: {gt: 0}, scrollY: {gt: 50}}" -->
        <el-table-column align="left" label="操作" width="240" fixed="left">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="apply(scope.row)">经费申请</el-button>
            <el-button type="text" size="mini" @click="applyList(scope.row)">申请记录</el-button>
            <el-button
              type="text"
              size="mini"
              v-if=" 'false'== scope.row.applyFlag && scope.row.activityStatus != 'finish'"
              @click="editItem(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="'false'== scope.row.applyFlag"
              @click="activityApply(scope.row)"
            >{{activityStatusApply[scope.row.activityStatus]}}</el-button>
            <el-button type="text" size="mini" v-if="scope.row.activityStatus == 'finish'"  @click="setRate(scope.row)">评分记录</el-button>
            <!-- ,执行,完成 -->
          </template>
        </el-table-column>
        <el-table-column
          prop="activityStatusName"
          align="left"
          label="活动状态"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="'false' ==scope.row.applyFlag">{{scope.row.activityStatusName}}</span>
            <span v-else label="正在审核中；审核完成后可继续操作">
              审核中
              <span v-show="time%5 > 1">.</span>
              <span v-show="time%5 > 2">.</span>
              <span v-show="time%5 > 3">.</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activityWayName"
          align="center"
          label="活动方式"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          fixed="left"
          prop="activityName"
          align="center"
          label="活动名称"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          fixed="left"
          prop="cooperatorName"
          align="center"
          label="合作商名称"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="scoreStatusName"
          align="center"
          label="评分状态"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="expenditureTypeName"
          align="center"
          label="活动经费类型"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="expenditure"
          align="center"
          label="活动经费"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityResponsiblePersonName"
          align="center"
          label="内部负责人"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityDate"
          align="center"
          label="活动日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityBeginTime"
          align="center"
          label="活动开始时间"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityEndTime"
          align="center"
          label="活动结束时间"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityAddr"
          align="center"
          label="活动地点"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityPrincipal"
          align="center"
          label="合作方对接人"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityPrincipalContact"
          align="center"
          label="对接人联系方式"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="onlineTypeName"
          align="center"
          label="线上方式"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="expectParticipantNum"
          align="center"
          label="预计参与人数"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          prop="expectWxGroupNum"
          align="center"
          label="预计微信群人数"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>-->
        <el-table-column
          prop="activityFeedback"
          align="center"
          label="活动反馈"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityProperty"
          align="center"
          label="活动性质"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="activityProcess"
          align="center"
          label="活动流程"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractRelatedContent"
          align="center"
          label="合同对照内容"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="publicityMeans"
          align="center"
          label="活动宣传手段"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="needWxGroupName"
          align="center"
          label="是否组微信群"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="needWxGroupOperationName"
          align="center"
          label="是否需要群运营"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="needMaterielName"
          align="center"
          label="是否需要物料"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="materielStatusName"
          align="center"
          label="物料是否准备好"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="物料"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.materielNames" @click="view1(scope.row)">{{scope.row.materielNames}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="嘉宾"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.guestNames" @click="view2(scope.row)">{{scope.row.guestNames}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="participantNum"
          align="center"
          label="实际参与人数"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="wxGroupNum"
          align="center"
          label="微信群人数"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="coordination"
          align="center"
          label="合作方配合程度"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="consultNum"
          align="center"
          label="导流咨询人数"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="signNum"
          align="center"
          label="签约人数"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="experience"
          align="center"
          label="活动经验总结"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="note" align="center" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="voucherArr"
          align="center"
          label="活动完成凭证"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.voucherNames" type="text" size="mini" @click="view3(scope.row)">{{scope.row.voucherNames}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <setActivity
      :setActivityVisible="setActivityVisible"
      :activityData="activityData"
      @close="activityClose"
      @submit="activitySubmit"
    />
    <apply
      :applyVisible="bdApplyVisible"
      :activityData="activityData"
      @close="applyClose"
      @submit="applySubmit"
    />
    <applyList
      :activityData="activityData"
      :applyListVisible="applyListVisible"
      @close="applyListClose"
      @submit="applyListSubmit"
    />
    <activityApply
      :activityApplyVisible="activityApplyVisible"
      :activityData="activityData"
      @close="activityApplyClose"
      @submit="activityApplySubmit"
    />
    <activityDetail
      :detailVisible="detailVisible"
      :activityData="activityData"
      @close="setRateClose"
    />
    <activityGuest
      :guestVisible="guestVisible"
      :guestData="guestData"
      @close="activetyGuestClose"
    />
    <activityMaterial
      :materialVisible="materialVisible"
      :guestData="guestData"
      @close="activetyGuestClose"
    />
    <activityVoucher
      :voucherVisible="voucherVisible"
      :guestData="guestData"
      @close="activetyGuestClose"
    />
    <setRateDetail :activityData="activityData" :setRateVisible="setRateVisible"  @close="setRateClose" />
    <calendar :calendarVisible="calendarVisible" @close="calendarClose" />
  </d2-container>
</template>
<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import setActivity from './components/set_activity.vue'
import apply from './components/activity_apply.vue'
import activityApply from './components/change_activity_apply.vue'
import applyList from './components/activity_apply_list.vue'
import calendar from './components/calendar.vue'
import activityDetail from './components/activity_detail.vue'
import setRateDetail from './components/bd_setRate.vue'
import { downloadFun, downloadFunD } from '@/libs/file'
import activityGuest from './components/activity_guest.vue'
import activityMaterial from './components/activity_material.vue'
import activityVoucher from './components/activity_voucher.vue'
import { mapState } from 'vuex'

let time
export default {
  components: { setActivity, apply, applyList, activityApply, calendar, activityDetail, setRateDetail, activityGuest, activityMaterial, activityVoucher },
  mixins: [mixins],
  computed:{
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  data () {
    return {
      tableData: [],
      activityWay: '',
      pageNum: 1,
      total: 0,
      search: '',
      fromDate: '',
      toDate: '',
      pageSize: 50,
      sign_way_type: [],
      loading: false,
      activityData: {},
      bdApplyVisible: false,
      setActivityVisible: false,
      detailVisible: false,
      setRateVisible: false,
      activityApplyVisible: false,
      applyListVisible: false,
      activityStatusApply: {
        not_audit: '筹备',
        prepare: '执行',
        execute: '完成'
      },
      calendarVisible: false,
      time: 0,
      manageBy: 'ALL',
      users: [],
      guestVisible: false,
      voucherVisible: false,
      materialVisible: false,
      guestData: {}
    }
  },
  created () {},
  mounted () {
    this.pageInit()
    this.init()
    this.Topage(1)
  },
  destroyed () {
    clearInterval(time)
  },
  methods: {
    async pageInit () {
      this.sign_way_type = await this.getDictionary('sign_way_type')
    },
    init () {
      time = setInterval(() => {
        this.time++
      }, 1000)
      this.manageBy = this.userInfo.userId
      api.subordinate(this.manageBy, '').then(({ data }) => {
        const users = [
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach((e) => {
          if (!users.some((em) => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('BD_cooperator_activity_all_user')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      this.loading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        activityWay: this.activityWay,
        search: this.search,
        fromDate: this.fromDate,
        manageBy: this.manageBy,
        toDate: this.toDate
      }
      api.getCooperatorActivityList(params).then((res) => {
        this.loading = false
        this.total = res.data.total
        this.tableData = res.data.rows
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    activityClose () {
      this.setActivityVisible = false
      this.activityData = {}
    },
    activitySubmit () {
      this.Topage()
      this.activityClose()
    },
    editItem (v) {
      this.activityData = { ...v }
      this.setActivityVisible = true
    },
    apply (v) {
      console.log(v)
      this.activityData = { ...v }
      this.bdApplyVisible = true
    },
    applyClose () {
      this.bdApplyVisible = false
    },
    applySubmit () {
      this.applyClose()
      this.Topage()
    },
    applyList (v) {
      console.log(v)
      this.activityData = { ...v }
      this.applyListVisible = true
    },
    applyListClose () {
      this.applyListVisible = false
    },
    applyListSubmit () {
      this.applyListClose()
      this.Topage()
    },
    activityApply (v) {
      this.activityData = { ...v }
      console.log(v)
      this.activityApplyVisible = true
    },
    activityApplyClose () {
      this.activityApplyVisible = false
    },
    activityApplySubmit () {
      this.activityApplyClose()
      this.Topage()
    },
    calendar () {
      this.calendarVisible = true
      console.log('calendar')
    },
    calendarClose () {
      this.calendarVisible = false
    },
    download (val) {
      downloadFun(val, (url) => {
        window.open(url)
      })
    },
    downloadD (val) {
      downloadFunD(val, (url) => {
        window.open(url)
      })
    },
    toDetail (row) {
      console.log(row)
      const rowData = row
      console.log(rowData)

      this.detailVisible = true
      this.activityData = { ...rowData }
    },
    activityDetailClose () {
      this.detailVisible = false
    },
    setRateClose () {
      this.setRateVisible = false
      this.detailVisible = false
    },
    setRate (row) {
      this.activityData = { ...row }
      this.setRateVisible = true
    },
    view1 (row) {
      console.log(row)
      this.guestData = row
      this.materialVisible = true
    },
    view2 (row) {
      console.log(row)
      this.guestData = row
      this.guestVisible = true
    },
    activetyGuestClose () {
      this.guestVisible = false
      this.voucherVisible = false
      this.materialVisible = false
    },
    view3 (row) {
      console.log(row)
      this.guestData = row
      this.voucherVisible = true
    }
  }
}
</script>
<style lang='scss'>
.user {
  .el-table--mini td {
    padding: 0;
  }
}
</style>
