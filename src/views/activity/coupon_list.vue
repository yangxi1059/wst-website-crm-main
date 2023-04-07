<!--
 * @Author: kaan
 * @Date: 2021-03-12 15:18:58
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-09 16:31:19
 * @Version:
 * @Description:
-->

<template>
  <d2-container v-loading="loading">
    <div class="activity-container">
      
      <div class="search_page">
        <div class="search">
          <el-button
            class="mr10 mb10"
            icon="el-icon-back"
            size="mini"
            plain
            @click="backPage"
          >返回
          </el-button>
          <el-input class="mr10" style="width:150px" v-model="searchData.search" size="mini" placeholder="券名称"></el-input>
          <el-select size="mini"
            class="mr10"
            style="width: 150px"
            v-model="searchData.discountStatus"
            filterable
            clearable
            placeholder="卡券状态"
            @change="Topage(1)"
          >
            <el-option
              v-for="(item,index) in discountStatus"
              :key="index"
              :label="item.label"
              :value="item.val"
            ></el-option>
          </el-select>
          <el-select size="mini"
            class="mr10"
            style="width:150px"
            v-model="searchData.programId"
            filterable
            clearable
            placeholder="全部"
            @change="Topage(1)"
          >
            <el-option
              v-for="(item,index) in programList"
              :key="index"
              :label="item.programName"
              :value="item.programId"
            ></el-option>
          </el-select>
          <el-select
            v-if="roleInfo.includes(`interview_user_select`)"
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="searchData.receiveBy"
            clearable
            placeholder="领券人"
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
            v-if="roleInfo.includes(`activity_list`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="searchData.pageNum"
          :page-size="searchData.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="couponList"
        size="mini"
        highlight-current-row
        style="width: 100%"
        ref="table"
        id="export_table"
      >
        <el-table-column min-width="130px" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`coupon_list_copy`)"
              type="text"
              @click="copyCode(scope.row.couponCode)"
            >复制券码</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="discountName" min-width="150px" align="center" label="券名称"></el-table-column>
        <el-table-column prop="beginDate" min-width="100px" align="center" label="开始时间"></el-table-column>
        <el-table-column prop="endDate" min-width="100px" align="center" label="结束时间"></el-table-column>
        <el-table-column prop="couponStatusName" min-width="100px" align="center" label="券使用状态"></el-table-column>
        </el-table-column>
        <el-table-column prop="wxId" min-width="100px" align="center" label="使用人微信"></el-table-column>
        <el-table-column prop="webAccount" min-width="100px" align="center" label="客户WST账户"></el-table-column>
        <el-table-column prop="orderProgramNames" min-width="150px" align="center" label="所用项目"></el-table-column>
        <el-table-column prop="couponCode" min-width="150px" align="center" label="券码"></el-table-column>
        <el-table-column prop="receiveByName" min-width="150px" align="center" label="领券人"></el-table-column>
        <el-table-column prop="programNames" min-width="150px" align="center" label="适用范围"></el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>
<script>
import api from '@/api/activity.js'
import mixins from '@/plugin/mixins'
import apiUser from '@/api/sales_assistant'
import apiDic from '@/api/dictionary.js'
import { mapState } from 'vuex'

export default {
  name: 'activityList',
  mixins: [mixins],
  data () {
    return {
      loading: false,
      searchData: {
        pageNum: 1,
        pageSize: 100,
        receiveBy: '',
        search: '',
        discountId: '',
        programId: '',
        discountStatus: '', /* 卡券状态 前端可以写死  取值"未开始" "进行中" "已结束" */
        activeStatus: '', /* 活动状态 是否激活 0否 1是  */
        couponStatus: '',
        sortCol: '',
        sort: ''
      },
      total: 0,
      users: [],
      programList: [],
      discountStatus: [
        { val: '未开始', label: '未开始' },
        { val: '进行中', label: '进行中' },
        { val: '已结束', label: '已结束' }
      ],
      activeStatus: [
        { val: '0', label: '否' },
        { val: '1', label: '是' }
      ],
      couponList: []

    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  mounted () {
    this.searchData.receiveBy = this.userInfo.userId
    this.getProgramDicList()
    this.getUserList()
    this.Topage()
  },
  methods: {
    getProgramDicList () {
      const params = {
        pageNum: 1,
        pageSize: 100,
        programStatus: '1'
      }
      apiDic.getProgramDicList(params).then((res) => {
        console.log('getProgramList', res)
        this.programList = res.data.rows
      })
    },
    getUserList () {
      apiUser.subordinate(this.searchData.receiveBy, '').then(({ data }) => {
        const users = [
          // { userId: "ALL", userName: "ALL" },
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('coupon_list_all_user')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      this.loading = true
      api.getCouponList(this.searchData).then(res => {
        this.loading = false
        console.log('InfoList', res.data)
        this.couponList = res.data.rows
      })
    },
    copyCode (code) {
      this.$copyText(code).then(() => {
        this.$confirm('券码已复制成功', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    backPage () {
      this.$router.go(-1)// 返回上一层
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.searchData.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.searchData.pageNum)
    }
  }
}

</script>
