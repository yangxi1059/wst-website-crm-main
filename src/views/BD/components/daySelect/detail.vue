<!--
 * @Author: 杨曦
 * @Date: 2023-01-13 11:13:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-13 15:54:20
 * @Version:
 * @Description:
-->
<template>
    <div>
      <el-dialog :close-on-click-modal="false" :title="`（${dayDetailData.date}）BD渠道详情`" :visible.sync="dayDetailVisible" :before-close="close" width="1300px">
        <div>
            <div class="mb20" v-if="dayDetailData.signList.length > 0">
                <div style="margin-bottom:20px">新增签约 - {{dayDetailData.signList.length}}人</div>
                <el-table  border :data="dayDetailData.signList" size="mini" >
                    <el-table-column align="center" prop="menteeName" label="学生"></el-table-column>
                    <el-table-column align="center" prop="orderId" label="订单ID"></el-table-column>
                    <el-table-column align="center" prop="orderPrice" label="订单金额CNY"></el-table-column>
                    <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
                    <el-table-column align="center" prop="wxName" label="微信昵称"></el-table-column>
                    <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
                    <el-table-column align="center" prop="schoolChiName" label="学校"></el-table-column>
                    <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
                    <el-table-column align="center" prop="contactName" label="主联系人"></el-table-column>
                    <el-table-column align="center" prop="counselorName" label="分配顾问"></el-table-column>
                    <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
                    <el-table-column align="center" prop="cooperatorName" label="合作商"></el-table-column>
                    <el-table-column align="center" prop="cooperatorManageByName" label="合作商管理人"></el-table-column>
                </el-table>
            </div>
            <div class="mb20" v-if="dayDetailData.counselorList.length > 0">
                <div style="margin-bottom:20px">分配顾问 - {{dayDetailData.counselorList.length}}人</div>
                <el-table border :data="dayDetailData.counselorList" size="mini" >
                    <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
                    <el-table-column align="center" prop="menteeName" label="姓名"></el-table-column>
                    <el-table-column align="center" prop="wxName" label="微信昵称"></el-table-column>
                    <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
                    <el-table-column align="center" prop="schoolChiName" label="学校"></el-table-column>
                    <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
                    <el-table-column align="center" prop="signStatusName" label="签约状态"></el-table-column>
                    <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
                    <el-table-column align="center" prop="counselorName" label="分配顾问"></el-table-column>
                    <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
                    <el-table-column align="center" prop="cooperatorName" label="合作商"></el-table-column>
                    <el-table-column align="center" prop="cooperatorManageByName" label="合作商管理人"></el-table-column>
                </el-table>
            </div>
            <div class="mb20" v-if="dayDetailData.addList.length > 0">
                <div style="margin-bottom:20px">新增录入 - {{dayDetailData.addList.length}}人</div>
                <el-table border :data="dayDetailData.addList" size="mini" >
                    <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
                    <el-table-column align="center" prop="menteeName" label="姓名"></el-table-column>
                    <el-table-column align="center" prop="wxName" label="微信昵称"></el-table-column>
                    <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
                    <el-table-column align="center" prop="schoolChiName" label="学校"></el-table-column>
                    <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
                    <el-table-column align="center" prop="signStatusName" label="签约状态"></el-table-column>
                    <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
                    <el-table-column align="center" prop="counselorName" label="分配顾问"></el-table-column>
                    <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
                    <el-table-column align="center" prop="cooperatorName" label="合作商"></el-table-column>
                    <el-table-column align="center" prop="cooperatorManageByName" label="合作商管理人"></el-table-column>
                </el-table>
            </div>
        </div>
      </el-dialog>
    </div>
  </template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import { mapState } from 'vuex'

export default {
  name: 'activity-detail',
  mixins: [mixins],
  props: {
    dayDetailVisible: Boolean,
    dayDetailData: Object
  },
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  data: () => {
    return {
      detailData: {},
      dateArr1: [],
      dateArr2: [],
      dateArr3: [],
    }
  },
  watch: {
    dayDetailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      
    },
    close () {
      this.$emit('close')
    },
  }
}
</script>

  <style lang="scss" scoped>
  </style>
