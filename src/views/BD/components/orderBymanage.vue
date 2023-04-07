<!--
 * @Author: 库建华
 * @Date: 2020-05-25 15:04:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-09 14:40:49
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer title="followUp" :visible.sync="showOrderArrVisible" size="90%" :before-close="close">
      <div class="header" slot="title">合作商转介绍订单 <el-tag size="medium" type="primary">仅展示2022-10-20后签约的订单信息</el-tag></div>
      <el-table style="margin:0 20px;" :data="showOrderArr" size="mini" highlight-current-row >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="cooperatorName" label="合作商名称"></el-table-column>
        <el-table-column align="center" prop="orderId" label="订单ID" min-width="80"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="学员名"></el-table-column>
        <el-table-column align="center" prop="signDate" label="签约日期"></el-table-column>
        <el-table-column align="center" prop="orderPrice" label="订单金额"></el-table-column>
        <el-table-column align="center" prop="payStatusName" label="订单支付状态" min-width="90"></el-table-column>
        <el-table-column align="center" prop="counselorName" label="主联系人"></el-table-column>
        <el-table-column align="center" prop="bdUserName" label="BD管理提成"></el-table-column>
        <el-table-column align="center"  label="返佣状态">
          <template slot-scope="scope">
            <el-link v-if="scope.row.applyStatusName" type="primary" @click="applyDetail(scope.row)" >{{scope.row.applyStatusName}}</el-link>
            <el-button type="primary" size="mini" @click="toBroken(scope.row)" v-else>发起返佣申请</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <Rebate
      :brokerageVisible="rebateVisible"
      :orderId="orderId"
      :pretalk="pretalkData"
      @close="rebateClose"
      @submit="rebateSubmit"
    />
    <recommendDetail
      :recommendDetailVisible="recommendDetailVisible"
      :applyData="applyData"
      @close="recommendDetailClose"
    />
  </div>
</template>

<script>
import api from '@/api/bd'
import apiVip from '@/api/vip'
import mixins from '@/plugin/mixins'
import Rebate from '../../sales/order/components/RebateApply'
import recommendDetail from '../../apply_audit/recommend/detail.vue'

export default {
  name: 'showOrderArr',
  mixins: [mixins],
  props: {
    showOrderArrVisible: {
      type: Boolean,
      default: false
    },
    showOrderArr:{},
    manageBy: {}
  },
  data () {
    return {
      rebateVisible:false,
      pretalkData: {},
      recommendDetailVisible:false,
      applyData:{
        applyId:'',
        applyType:'',
      },
      orderId:'',
    }
  },
  watch: {
    showOrderArrVisible: function (val) {
      if (val) {
        // this.Topage()
      }
    }
  },
  components:{Rebate,recommendDetail},
  methods: {
    
    close () {
      this.$emit('close')
    },
    toBroken (data) {
      this.orderId = data.orderId
      console.log(data)
      this.rebateVisible = true
    },
    rebateSubmit () {
      this.rebateVisible = false
      this.$emit('update')
      this.Topage()
    },
    rebateClose () {
      this.rebateVisible = false
    },
    applyDetail(data){
      apiVip.getApplyDetailByApplyId(data.applyId).then(res =>{
        this.applyData = {
          applyId: data.applyId,
          applyType: res.data.apply.applyType
        }
        this.recommendDetailVisible = true
      this.$emit('update')
        console.log(data)
      })
    },
    recommendDetailClose () {
      this.recommendDetailVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
