<!--
 * @Author: 库建华
 * @Date: 2020-04-22 15:57:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-25 16:51:13
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="user">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="Topage()"
          ></el-input>
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="manageBy"
            placeholder="选择用户"
            @change="Topage()"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>

          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="kolStatus"
            clearable
            placeholder="是否启用"
            @change="Topage()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="schoolId"
            clearable
            placeholder="学校"
            @change="Topage()"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>

          <el-button
            icon="el-icon-search"
            class="mr10 ml0"
            size="mini"
            plain
            @click="Topage()"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="ml0"
            size="mini"
            plain
            @click="newSelect"
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
        :data="rows"
        size="small"
        v-loading="loading"
        highlight-current-row

        style="width: 100%"
        @cell-dblclick="dblclick"
      >

        <el-table-column prop="kolId" align="center"  label="KOL编号"></el-table-column>
        <el-table-column prop="kolTypeName" align="center"  label="身份"></el-table-column>
        <el-table-column prop="code" align="center"  label="Code"></el-table-column>
        <el-table-column prop="kolName" align="center"  label="姓名"></el-table-column>
        <el-table-column prop="wxName" align="center"  label="微信名"></el-table-column>
        <el-table-column prop="wxId" align="center"  label="微信ID"></el-table-column>
        <el-table-column prop="note" align="center"  label="简介"></el-table-column>
        <el-table-column prop="kolStatus" align="center"  label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.kolStatus == '1'?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="manageByName" align="center"  label="管理者"></el-table-column>
      </el-table>
    </div>
    <addKol :addVisible="addVisible" @close="addClose()" @success="success()" />
    <detailKol :detailVisible="detailVisible" :kolId="kolId" @close="detailClose()" @success="detailSuccess()" />
  </d2-container>
</template>
<script>
import api from '@/api/bd'
import apiUser from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import addKol from './kolComponents/addKol.vue'
import detailKol from './kolComponents/detailKol.vue'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  components: { addKol, detailKol },
  data () {
    return {
      pageSize: 400,
      common_yes_or_no: [],
      search: '',
      manageBy: 'ALL',
      users: [],
      pageNum: 1,
      total: 0,
      loading: false,
      schoolId: '',
      kolStatus: '',
      schoolList: [],
      rows: [],
      widths: '240px',
      userId: '', // ID
      kolId: '',
      addVisible: false,
      detailVisible: false
    }
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  created () {
    this.axios()
  },
  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.schoolList = await this.getSchool("school")
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    axios () {
      this.manageBy = this.userInfo.userId
      apiUser.subordinate(this.manageBy, '').then(({ data }) => {
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
        if (this.roleInfo.includes('kol_cashier_ALL_Data')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      const data = {
        search: this.search,
        manageBy: this.manageBy,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        kolStatus: this.kolStatus,
        schoolId: this.schoolId
      }
      this.loading = true
      api
        .getKolList(data)
        .then(({ data }) => {
          console.log(data)
          this.pageNum = data.page
          this.total = data.total
          this.rows = data.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    newSelect () {
      this.addVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    dblclick (row) {
      this.kolId = row.kolId
      this.detailVisible = true
      console.log(row)
    },
    addClose () {
      this.addVisible = false
    },
    success () {
      this.addVisible = false
      this.Topage()
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSuccess () {
      this.detailVisible = false
      this.Topage()
    }

  }
}
</script>
<style lang='scss'>
.user {
  .el-table--mini td {
    padding: 0;
  }
}
.radio{
  line-height:50px;
}
</style>
