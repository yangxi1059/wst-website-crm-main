<!--
 * @Author: 库建华
 * @Date: 2020-05-27 10:24:04
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-25 17:23:07
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="mentor-commisson-apply">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持申请标题、申请ID"
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="userId"
            clearable
            placeholder="选择大使"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
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
        :data="approveList"
        size="mini"
        highlight-current-row

        style="width: 100%"
      >
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="applyId" align="center" label="申请ID" min-width="100"></el-table-column>
        <el-table-column prop="applyTitle" align="center" label="申请标题" min-width="100"></el-table-column>
        <el-table-column prop="applyStatus" align="center" label="申请状态" min-width="100">
          <template slot-scope="scope">{{applyStatusS[scope.row.applyStatus].itemName}}</template>
        </el-table-column>
        <el-table-column prop="applyerName" align="center" label="申请人" min-width="100"></el-table-column>
        <el-table-column prop="applyTime" align="center" label="申请时间" min-width="100"></el-table-column>
      </el-table>
    </div>
    <recommend-cashier
      :recommendCashierVisible="recommendCashierVisible"
      :payData="payData"
      @close="recommendCashierClose"
      @submit="recommendCashierSubmit"
    />
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import recommendCashier from '../apply_audit/recommend/cashier.vue'
import { mapState } from 'vuex'
export default {
  name: 'audit',
  mixins: [mixins],
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  components: {
    recommendCashier
  },
  data () {
    return {
      approveList: [],
      loading: false,
      pageSize: 400,
      search: '',
      pageNum: 1,
      total: 0,
      userId: '',
      users: [],
      applyStatusS: [],
      applyStatus: '',
      applyType: '',
      applyData: {},
      recommendCashierVisible: false,
      payData: {}
    }
  },
  mounted () {
    this.pageInit()
    this.getUserList()
  },
  methods: {
    async pageInit () {
      this.applyStatusS = await this.getDictionary('apply_status')
    },
    getUserList () {
      api.subordinate(this.userInfo.userId, '').then(({ data }) => {
        const users = [
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('ambassador_cashier_ALL_Data')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      this.loading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        applyStatus: this.applyStatus,
        applyType: 'ambassador_salary'
      }
      console.log(data)
      api.getCashierList(data).then(res => {
        this.loading = false
        console.log('审核列表', res)
        this.total = res.data.total
        this.approveList = res.data.rows
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
    detail (v) {
      console.log('详情', v)
      this.recommendCashierVisible = true
      this.payData = v
    },
    recommendCashierClose () {
      this.recommendCashierVisible = false
    },
    recommendCashierSubmit () {
      this.Topage(1)
      this.recommendCashierClose()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
