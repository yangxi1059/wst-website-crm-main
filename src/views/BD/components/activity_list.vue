<!--
 * @Author: 库建华
 * @Date: 2020-02-11 12:03:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-20 15:22:30
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <div class="header" slot="title">
      活动记录
      <el-button class="add-offer-btn ml10" @click="addActivity" type="primary" size="mini">新增活动</el-button>
    </div>
    <el-table
      :data="listData"
      size="mini"
      highlight-current-row
      style="width: 100%"
      @row-dblclick="toDetail"
    >
      <el-table-column align="left" label="操作" width="280">
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

          <el-button type="text" size="mini" v-if="scope.row.activityStatus == 'finish'" @click="setRate(scope.row)">评分记录</el-button>
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
          <span v-else title="正在审核中；审核完成后可继续操作">
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
        prop="activityName"
        align="center"
        label="活动名称"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
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
        min-width="100"
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
        prop="manpowerAndPosition"
        align="center"
        label="各部门需要的人数及职能"
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
      <!-- <el-table-column
        prop="materielStatusName"
        align="center"
        label="物料"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-popover placement="right" width="550" trigger="hover">
            <el-table :data="scope.row.materielArr">
              <el-table-column width="200" property="materielName" label="物料"></el-table-column>
              <el-table-column width="50" property="materielNum" label="数量" show-overflow-tooltip></el-table-column>
              <el-table-column
                width="300"
                property="materielNote"
                label="备注"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <span slot="reference">{{scope.row.materielArr.map(v=>v.materielName).join()}}</span>
          </el-popover>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="guestArr"
        align="center"
        label="嘉宾"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-popover placement="right" width="800" trigger="hover">
            <el-table :data="scope.row.guestArr">
              <el-table-column width="200" property="guestNames" label="嘉宾"></el-table-column>
              <el-table-column
                width="300"
                property="guestPrepareContent"
                label="准备内容"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column width="300" property="guestNote" label="备注" show-overflow-tooltip></el-table-column>
            </el-table>
            <span slot="reference">{{scope.row.guestArr.map(v=>v.guestName).join()}}</span>
          </el-popover>
        </template>
      </el-table-column> -->
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
      <el-table-column
        prop="note"
        align="center"
        label="备注"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
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
    <setActivity
      :setActivityVisible="setActivityVisible"
      :activityData="activityData"
      @close="activityClose"
      @submit="activitySubmit"
    />
    <apply
      :applyVisible="bdApplyVisible"
      :cooperatorData="cooperatorData"
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
      @close="activityDetailClose"
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
  </div>
</template>

<script>
import api from '@/api/bd.js'
import setActivity from './set_activity.vue'
import apply from './activity_apply.vue'
import activityApply from './change_activity_apply.vue'
import activityDetail from './activity_detail.vue'
import applyList from './activity_apply_list.vue'
import setRateDetail from './bd_setRate.vue'

import { downloadFun, downloadFunD } from '@/libs/file'
import mixins from '@/plugin/mixins'
import activityGuest from './activity_guest.vue'
import activityMaterial from './activity_material.vue'
import activityVoucher from './activity_voucher.vue'
let time
export default {
  name: 'activityList',
  components: { setActivity, apply, applyList, activityApply, activityDetail, setRateDetail, activityGuest, activityMaterial, activityVoucher },
  mixins: [mixins],
  props: {
    cooperatorData: {
      type: Object
    },
    activeName:{}
  },
  data () {
    return {
      listData: [],
      setActivityVisible: false,
      activityData: {},
      activityId: '',
      bdApplyVisible: false,
      activityApplyVisible: false,
      detailVisible: false,
      applyListVisible: false,
      setRateVisible: false,
      activityStatusApply: {
        not_audit: '筹备',
        prepare: '执行',
        execute: '完成'
      },
      time: 0,
      guestVisible: false,
      voucherVisible: false,
      materialVisible: false,
      guestData: {}
      // cooperatorData: {},
    }
  },
  watch: {
    activeName: function (val) {
      if (val == 'third') {
        this.Topage()
        time = setInterval(() => {
          this.time++
        }, 1000)
      } else {
        clearInterval(time)
      }
    }
  },
  methods: {
    Topage () {
      const params = {
        pageNum: 1,
        pageSize: 9999,
        cooperatorId: this.cooperatorData.cooperatorId
      }
      api.getCooperatorActivityList(params).then((res) => {
        console.log(res, 'yx************************************')
        this.listData = res.data.rows
      })
    },
    close () {
      this.$emit('close')
    },
    addActivity () {
      this.activityData = { cooperatorId: this.cooperatorData.cooperatorId }
      this.setActivityVisible = true
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
    toDetail (row) {
      console.log('toDetail', row)
      this.detailVisible = true
      this.activityData = { ...row }
    },
    activityDetailClose () {
      this.detailVisible = false
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
    setRateClose () {
      this.setRateVisible = false
    },
    setRate (row) {
      this.setRateVisible = true
      this.activityData = { ...row }
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
    view3 (row) {
      console.log(row)
      this.guestData = row
      this.voucherVisible = true
    },
    activetyGuestClose () {
      this.guestVisible = false
      this.voucherVisible = false
      this.materialVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
