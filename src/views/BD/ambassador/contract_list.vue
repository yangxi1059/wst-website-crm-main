<!--
 * @Author: 库建华
 * @Date: 2020-02-11 12:03:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 10:07:19
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
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="apply(scope.row)">经费申请</el-button> -->
            <el-button type="text" size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="unwind(scope.row)">解约</el-button>
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
          align="center"
          label="合同状态"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
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
          label="合同文件"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button @click="download(scope.row.contractVoucher)" size="mini">查看</el-button>
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
  </div>
</template>

<script>
import api from '@/api/bd.js'
import setContract from './set_contract.vue'
import { downloadFun } from '@/libs/file'

export default {
  name: 'contract',
  components: { setContract },
  props: {
    contractVisible: {
      type: Boolean,
      default: false
    },
    ambassadorId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      listData: [],
      setContractVisible: false,
      contractData: {},
      contractId: '',
      bdApplyVisible: false,
      applyListVisible: false
    }
  },
  watch: {
    contractVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getContractByAmbassadorId(this.ambassadorId).then(res => {
        console.log(res)
        this.listData = res.data
      })
    },
    close () {
      this.$emit('close')
      this.listData = []
    },
    addContract () {
      this.contractData = { ambassadorId: this.ambassadorId }
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
      this.contractData = v
      this.setContractVisible = true
    },
    unwind (v) {
      this.$confirm(
        `您将解约该合同【${v.contractName}】,是否继续？`,
        '提示'
      ).then(() => {
        const data = {
          ambassadorId: v.ambassadorId,
          contractId: v.contractId,
          contractStatus: '2'
        }
        api.uptAmbassadorContract(data).then(() => {
          this.$message({
            type: 'success',
            message: '解约成功!'
          })
          this.Topage()
        })
      })
    },
    apply (v) {
      console.log(v)
      this.contractId = v.contractId
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
      this.contractId = v.contractId
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
