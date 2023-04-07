<!--
 * @Author: 库建华
 * @Date: 2020-02-11 12:03:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-28 10:24:26
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <div class="header" slot="title">
      合同记录
      <el-button class="add-offer-btn ml10" @click="addContract" type="primary" size="mini">签约/续约</el-button>
      <el-button  @click="returnVersion" type="primary" size="mini">{{versionStatus?'返回新版':'前往旧版'}}</el-button>
    </div>
    <el-table v-show="versionStatus" :data="listData" size="mini" highlight-current-row style="width: 100%">
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
        min-width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.contractVoucher"  @click="download(scope.row.contractVoucher)" size="mini">查看</el-button>
          <el-button v-if="scope.row.contractVoucher && roleInfo.includes(`contractVoucher_down`)"  @click="downloadD(scope.row.contractVoucher)" size="mini">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="formalContractVoucher"
        align="center"
        label="正式合同"
        min-width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.formalContractVoucher" @click="download(scope.row.formalContractVoucher)" size="mini">查看</el-button>
          <el-button v-if="scope.row.formalContractVoucher && roleInfo.includes(`formalContractVoucher_down`)"  @click="downloadD(scope.row.formalContractVoucher)" size="mini">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!versionStatus">
      <el-card class="box-card mt20" v-for="(item,i) in listData" :key="i" >
        <el-descriptions class="margin-top" :column="2" >
              <el-descriptions-item label="合同ID">{{ item.contractId }}</el-descriptions-item>
              <el-descriptions-item label="合同状态">
                <span v-if="'false' ==item.applyFlag">{{item.contractStatusName}}</span>
                <span v-else title="经费申请或合同，正在审核中；审核完成后可继续操作">
                  审核中<span v-show='time%5 > 1'>.</span>
                  <span v-show='time%5 > 2'>.</span>
                  <span v-show='time%5 > 3'>.</span>
                </span>
                <el-button
                  type="text"
                  size="mini"
                  style="padding:0px"
                  @click="editItem(item)"
                  v-if="'false' ==item.applyFlag && item.contractStatusName != '完成'"
                >编辑</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="合同名称">{{ item.contractName }}</el-descriptions-item>
              <el-descriptions-item label="签约、续约日期">{{ item.contractSignDate }}</el-descriptions-item>
              <el-descriptions-item label="合同周期">{{ item.contractDuration }}</el-descriptions-item>
              <el-descriptions-item label="开始日期">{{ item.contractStartDate }}</el-descriptions-item>
              <el-descriptions-item label="结束日期">{{ item.contractEndDate }}</el-descriptions-item>
              <el-descriptions-item label="合同概述">{{ item.contractIntroduction }}</el-descriptions-item>
              <el-descriptions-item label="合同金额">{{ item.salary }}</el-descriptions-item>
              <el-descriptions-item label="合同金额类型">{{ item.salaryType }}</el-descriptions-item>
              <el-descriptions-item label="草拟合同" :span="2">
                <el-button style="padding:0px" type="text" v-if="item.contractVoucher"  @click="download(item.contractVoucher)" size="mini">查看</el-button>
                <el-button style="padding:0px" type="text" v-if="item.contractVoucher && roleInfo.includes(`contractVoucher_down`)"  @click="downloadD(item.contractVoucher)" size="mini">下载</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="正式合同" :span="2">
                <el-button style="padding:0px" type="text" v-if="item.formalContractVoucher" @click="download(item.formalContractVoucher)" size="mini">查看</el-button>
                <el-button style="padding:0px" type="text" v-if="item.formalContractVoucher && roleInfo.includes(`formalContractVoucher_down`)"  @click="downloadD(item.formalContractVoucher)" size="mini">下载</el-button>
              </el-descriptions-item>
        </el-descriptions>
        <div style="margin-bottom:8px">
          <span style="font-size:12px">申请记录：</span>
          <el-button style="padding: 3px 0" v-if="'false' ==item.applyFlag && item.contractStatusName == '生效中'" type="text" size="mini" @click="apply(item)">经费申请</el-button>
        </div>
        <div class="displayFlex">
          <div v-for="(item2,k) in item.contractFundApplyList" :key="k" class="text displayFlexitem">
            <el-link style="font-size:12px" type="primary" @click="applyDetail(item2)">{{item2.applyTitle}}</el-link>
          </div>
        </div>
      </el-card>
    </div>
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
    <recommend-detail
      :recommendDetailVisible="recommendDetailVisible"
      :applyData="applyData"
      @close="closeDetail"
    />
  </div>
</template>

<script>
import api from '@/api/bd.js'
import apiVip from '@/api/vip.js'
import setContract from './set_contract.vue'
import applyList from './apply_list.vue'
import apply from './apply.vue'
import recommendDetail from '../../apply_audit/recommend/detail.vue'
import { downloadFun, downloadFunD } from '@/libs/file'
import { mapState } from 'vuex'

let time
export default {
  name: 'contract2',
  components: { setContract, applyList, apply, recommendDetail },
  props: {
    activeName: {
    },
    cooperatorData: {
      type: Object
    }
  },
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  data () {
    return {
      listData: [],
      recommendDetailVisible: false,
      applyData: {},
      versionStatus: false,
      setContractVisible: false,
      contractData: {},
      contractId: '',
      applyVisible: false,
      applyListVisible: false,
      time: 0
    }
  },
  watch: {
    activeName: function (val) {
      if (val == 'second') {
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
        .getContractByCooperatorIdV2(this.cooperatorData.cooperatorId)
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
    },
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },
    returnVersion () {
      this.versionStatus = !this.versionStatus
    },
    applyDetail (data) {
      console.log(data)
      apiVip.getApplyDetailByApplyId(data.applyId).then(res => {
        this.applyData = res.data
        this.applyData.applyStatus = res.data.apply.applyStatus
        this.applyData.applyType = res.data.apply.applyType
        this.applyData.applyId = res.data.apply.applyId
        this.recommendDetailVisible = true
        console.log(res.data)
      })
    },
    closeDetail () {
      this.recommendDetailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .displayFlex{
    display: flex;
    flex-wrap: wrap;
  }
  .displayFlexitem{
    margin-right: 10px;
    box-sizing: border-box;
    padding:  10px;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
</style>
