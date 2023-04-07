<!--
 * @Author: Kaan
 * @Date: 2022-05-07 11:41:00
 * @LastEditors: Kaan
 * @LastEditTime: 2022-05-07 14:17:24
 * @version: 
 * @Descripttion: 
-->

<template>
  <div>
      <div class="header" slot="title">
      </div>
      <el-table :data="listData" size="mini" 
        highlight-current-row 
        style="width: 100%"
        @row-dblclick="detail"
      >
        <el-table-column
          prop="applyId"
          align="center"
          label="订单ID"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="menteeName"
          align="center"
          label="学员姓名"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="signDate"
          align="center"
          label="签约日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="fundType"
          align="center"
          label="货币类型"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="fundWage"
          align="center"
          label="金额"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="applyStatus"
          align="center"
          label="支付状态"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="applyBy"
          align="center"
          label="申请人"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="applyTime"
          align="center"
          label="申请日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>

      <RecommendDetail
        :recommendDetailVisible="recommendDetailVisible"
        :applyData="applyData"
        :recall="recall"
        :reapply="reapply"
        :reapplyList="reapplyList"
        @close="recommendDetailClose"
      />
  </div>
</template>

<script>
import api from '@/api/bd.js'
import apiVip from '@/api/vip.js'
import RecommendDetail from '@/views/apply_audit/recommend/detail.vue'

export default {
  name: 'rebateList',
  props: {
    activeName: {
    
    },
    cooperatorData: {
      type: Object
    }
  },
  components: {RecommendDetail},
  data () {
    return {
      listData: [],
      applyData: {},
      recommendDetailVisible: false,
      reapplyList: []
    }
  },
  watch: {
    activeName: function (val) {
      if (val == 'sixth') {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getBrokerageList(this.cooperatorData.cooperatorId).then(res => {
        console.info(res)
        this.listData = res.data
      })
    },
    detail(row){
      this.applyData = row
      console.log(row.applyId)
      this.recommendDetailVisible = true
    },
    recall (v) {
      console.log('撤回', v)
      this.$confirm('此操作将撤回该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apiVip.cancelApplyByApplyId(v.applyId).then((res) => {
            console.log('撤回返回', res)
            this.recommendDetailVisible = false
            this.Topage()
          })
        })
        .catch(() => {})
    },
    reapply (v) {
      // 返佣暂无
    },
    recommendDetailClose () {
      this.recommendDetailVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
