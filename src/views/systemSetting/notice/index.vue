<!--
 * @Author: 库建华
 * @Date: 2019-11-14 14:05:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 11:44:56
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="notice">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            v-if="roleInfo.includes(`notice_search`)"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="initTable()"
          ></el-input>
          <el-select
            v-model="noticeStatus"
            class="mr10"
            size="mini"
            v-if="roleInfo.includes(`notice_select`)"
            style="width:150px"
            placeholder="请选择"
            @change="initTable()"
          >
            <el-option
              v-for="item in notice_status"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`notice_search`)"
            class=""
            size="mini"
            plain
            @click="initTable()"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            v-if="roleInfo.includes(`notice_new`)"
            class="mr10"
            size="mini"
            plain
            @click="addNotice"
          >新增</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`notice_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table :data="tableData" size="mini"  border stripe>
        <el-table-column prop="noticeId" label="操作" v-if="roleInfo.includes(`notice_edit`)">
          <template slot-scope="scope">
            <el-button type="text" @click="editNotice(scope.row.noticeId)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="noticeTitle" label="标题" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="noticeContent" label="内容" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="noticeStatusName" label="状态"></el-table-column>
        <el-table-column prop="createByName" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
    </div>
    <edit
      :noticeVisible="noticeVisible"
      :noticeId="noticeId"
      @close="noticeClose"
      @submit="noticeSubmit"
    />
  </d2-container>
</template>

<script>
import api from '@/api/login.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import edit from './components/edit.vue'

export default {
  name: 'notice',
  mixins: [mixins],
  components: { edit },
  data: () => {
    return {
      notice_status: [],
      total: 0,
      pageNum: 0,
      pageSize: 400,
      loading: false,
      search: '',
      noticeStatus: '',
      tableData: [],
      noticeVisible: false,
      noticeId: null
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
  },
  mounted () {
    this.pageInit()
    this.initTable()
  },
  methods: {
    async pageInit () {
      this.notice_status = await this.getDictionary('notice_status')
      this.notice_status.unshift({ itemName: 'ALL', itemValue: '' })
    },
    initTable () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        noticeStatus: this.noticeStatus
        // sort:'',
        // sortCol:'',
      }
      this.loading = true
      api.getNoticeData(params).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initTable(this.pageNum)
    },
    clean () {
      this.notice_status = []
      this.total = 0
      this.pageNum = 0
      this.search = ''
      this.noticeStatus = ''
      this.tableData = []
      this.noticeVisible = false
      this.noticeId = null
    },
    addNotice () {
      this.noticeVisible = true
      this.noticeId = null
    },
    noticeClose () {
      this.noticeVisible = false
      this.noticeId = null
    },
    noticeSubmit () {
      this.noticeClose()
      this.initTable()
    },
    editNotice (v) {
      this.noticeId = v
      this.noticeVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
