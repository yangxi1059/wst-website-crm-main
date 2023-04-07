<!--
 * @Author: 库建华
 * @Date: 2020-02-11 12:03:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 10:03:17
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-drawer  title="合同记录" :visible.sync="contractVisible" size="90%" :before-close="close">
      <div class="header" slot="title">
        合同记录
        <el-button
          class="add-offer-btn"
          @click="addContract"
          type="primary"
          plain
          round
          size="small"
        >签约/续约</el-button>
      </div>
      <el-table  :data="listData" size="mini" highlight-current-row style="width: 100%">
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button v-if="'false' ==scope.row.applyFlag && scope.row.contractStatusName == '生效中'" type="text" size="mini" @click="apply(scope.row)">经费申请</el-button>
            <el-button type="text" size="mini" @click="applyList(scope.row)">申请记录</el-button>
            <el-button
              type="text"
              size="mini"
              @click="editItem(scope.row)"
              v-if="'false' ==scope.row.applyFlag && scope.row.contractStatusName != '完成'"
            >编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="contractId"
          align="center"
          label="合同ID"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractName"
          align="center"
          label="合同名称"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractSignDate"
          align="center"
          label="签约、续约日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractDuration"
          align="center"
          label="合同周期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractStartDate"
          align="center"
          label="开始日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractEndDate"
          align="center"
          label="结束日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractStatusName"
          align="left"
          label="合同状态"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="'false' ==scope.row.applyFlag">{{scope.row.contractStatusName}}</span>
            <span v-else title="经费申请或合同，正在审核中；审核完成后可继续操作">
              审核中<span v-show='time%5 > 1'>.</span>
              <span v-show='time%5 > 2'>.</span>
              <span v-show='time%5 > 3'>.</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contractIntroduction"
          align="center"
          label="合同概述"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="salary"
          align="center"
          label="合同金额"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="salaryType"
          align="center"
          label="合同金额类型"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contractVoucher"
          align="center"
          label="草拟合同"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.contractVoucher"  @click="download(scope.row.contractVoucher)" size="mini">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="formalContractVoucher"
          align="center"
          label="正式合同"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.formalContractVoucher" @click="download(scope.row.formalContractVoucher)" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <setContract
      :setContractVisible="setContractVisible"
      :contractData="contractData"
      @close="contractClose"
      @submit="contractSubmit"
    />
    <applyList
      :applyListVisible="applyListVisible"
      :contractData="contractData"
      @close="applyListClose"
      @submit="applyListSubmit"
    />
    <apply
      :applyVisible="applyVisible"
      :contractData="contractData"
      :cooperatorData="cooperatorData"
      @close="applyClose"
      @submit="applySubmit"
    />
  </div>
</template>

<script>
import api from '@/api/bd.js'
import setContract from './set_contract.vue'
import applyList from './apply_list.vue'
import apply from './apply.vue'
import { downloadFun } from '@/libs/file'
let time
export default {
  name: 'contract',
  components: { setContract, applyList, apply },
  props: {
    contractVisible: {
      type: Boolean,
      default: false
    },
    cooperatorData: {
      type: Object
    }
  },
  data () {
    return {
      listData: [],
      setContractVisible: false,
      contractData: {},
      contractId: '',
      applyVisible: false,
      applyListVisible: false,
      time: 0
    }
  },
  watch: {
    contractVisible: function (val) {
      if (val) {
        this.Topage()
        time = setInterval(() => { this.time++ }, 1000)
      } else {
        clearInterval(time)
      }
    }
  },
  methods: {
    Topage () {
      api
        .getContractByCooperatorId(this.cooperatorData.cooperatorId)
        .then(res => {
          console.log(res)
          this.listData = res.data
        })
    },
    close () {
      this.$emit('close')
      this.listData = []
    },
    addContract () {
      this.contractData = {
        cooperatorId: this.cooperatorData.cooperatorId,
        cooperatorName: this.cooperatorData.cooperatorName
      }
      this.setContractVisible = true
    },
    contractClose () {
      this.setContractVisible = false
      this.contractData = {}
    },
    contractSubmit () {
      this.Topage()
      this.contractClose()
    },
    editItem (v) {
      this.contractData = { ...v }
      this.setContractVisible = true
    },
    apply (v) {
      console.log(v)
      this.contractData = v
      this.applyVisible = true
    },
    applyClose () {
      this.applyVisible = false
    },
    applySubmit () {
      this.applyClose()
      this.Topage()
    },
    applyList (v) {
      console.log(v)
      this.contractData = v
      this.applyListVisible = true
    },
    applyListClose () {
      this.applyListVisible = false
    },
    applyListSubmit () {
      this.applyListClose()
      this.Topage()
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
