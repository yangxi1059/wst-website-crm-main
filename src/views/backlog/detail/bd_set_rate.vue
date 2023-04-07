<!--
 * @Author: 库建华
 * @Date: 2020-07-31 16:02:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:54:49
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="'BD评分列表'"
      :visible.sync="bdSetRateDetailVisible"
      width="1400px"
      :before-close="close"
    >
      <el-table
        :data="tableData"
        size="mini"
        ref="table"
        highlight-current-row
      >
       <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="scope.row.isDone == 0" @click="toDetail(scope.row)">评分</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="activityName"
          label="活动名"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="activityDate"
          label="活动时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="scorerName"
          label="评分人名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="isDoneName"
          label="是否已评分"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cooperatorName"
          label="合作商"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="reminderMsg"
          label="提醒消息"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <bdSetRateInput
        :data="data"
        :detailVisible="detailVisible"
        @close="detailClose"
        @submit="detailSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/backlog.js'
import bdSetRateInput from './bd_setRate_input.vue'
export default {
  name: 'common-detail',
  components: {
    bdSetRateInput
  },
  props: {
    bdSetRateDetailVisible: Boolean,
    day: String,
    userId: String
  },
  data: () => {
    return {
      tableData: [],
      detailVisible: false,
      data: {}
    }
  },
  watch: {
    bdSetRateDetailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      const params = {
        backlogDate: this.day,
        userId: this.userId
      }
      api.getserRateDetail(params).then(res => {
        console.log(res, 'yx451345')
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
      this.tableData = []
      this.data = {}
    },
    toDetail (val) {
      this.data = val
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSubmit () {
      this.detailVisible = false
      this.data = {}
      this.initPage()
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
