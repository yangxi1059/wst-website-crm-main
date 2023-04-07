<!--
 * @Author: Kaan
 * @Date: 2022-04-11 14:40:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-15 16:56:22
 * @version:
 * @Descripttion:
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
            <el-input
                class="mr10"
                v-model="search"
                clearable
                size="mini"
                style="width:150px"
                placeholder="查询的access code"
            ></el-input>
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="manageBy"
            placeholder="创建用户"
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
            size="mini"
            plain
            @click="Topage()"
          >搜索</el-button>
          <el-button
            v-if="roleInfo.includes(`accessCode_add`)"
            icon="el-icon-plus"
            size="mini"
            plain
            @click="addAccessCode"
          >新增</el-button>
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
        :data="tableData"
        :max-height="tableHeight"
        size="mini"
        align="center"
        @row-dblclick="dblclick"
      >
        <el-table-column min-width="180" prop="accessCode" label="code"  show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.accessCode}}
            </template>
        </el-table-column>
        <el-table-column
            prop="allocateStatusName"
            label="是否已分配"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="allocateTime" label="分配时间"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="codeTypeName" label="可用模式"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="appName" label="适用应用"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="enableStatusName" label="是否可用" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isUsed" label="是否已用" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickName" label="微信昵称"  show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.useDetail"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.useDetail">
              <span slot="reference">{{scope.row.nickName}}</span>
            </el-popover>
            <span slot="reference" v-else>{{scope.row.nickName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstUseTime" label="首次使用时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="expirationDate" label="过期时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <addAccessCode :addCodeVisible="addCodeVisible" @close="addCodeClose" @submit="addCodeSubmit" />
    <detailAccessCode :detailCodeVisible="detailCodeVisible" :accessCode="accessCode" @close="detailCodeClose" @update="updateCode"  />

  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import addAccessCode from './components/add_accessCode.vue'
import detailAccessCode from './components/detail_accessCode.vue'
import mixins from '@/plugin/mixins'
import apiUser from '@/api/sales_assistant'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  name: 'AccessCode',
  components: { addAccessCode, detailAccessCode },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    return {
      loading: false,
      accessCode: '',
      detailCodeVisible: false,
      // 搜索栏数据
      widths: '180px',
      pageSize: 100,
      pageNum: 1,
      total: 0,
      tableHeight: 'auto',
      addCodeVisible: false,
      tableData: [],
      search: '',
      isExpired: '',
      manageBy: 'ALL',
      users: []
    }
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
        this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
      })
    }
  },
  mounted () {
    this.pageInit()
    this.Topage(1)
  },
  methods: {
    async pageInit () {
      apiUser.subordinate(this.userInfo.userId, '').then(({ data }) => {
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
      })
    },
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        isExpired: this.isExpired,
        manageBy: this.manageBy
      }
      this.loading = true
      api.getAccessCodeList(params).then(res => {
        console.log(res.data.rows)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    dblclick (row, column, event) {
      this.detailCodeVisible = true
      this.accessCode = row.accessCode
      console.log(row, column, event)
    },
    detailCodeClose () {
      this.detailCodeVisible = false
    },
    addAccessCode () {
      this.addCodeVisible = true
    },
    addCodeClose () {
      this.addCodeVisible = false
    },
    addCodeSubmit () {
      this.Topage()
      this.addCodeVisible = false
    },
    updateCode () {
      this.Topage()
    }
  }
}
</script>
