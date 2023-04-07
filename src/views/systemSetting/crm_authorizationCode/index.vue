<!--
 * @Author: 杨曦
 * @Date: 2020-12-18 09:16:10
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-26 10:31:11
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <detailAuthorization :detailVisible="detailVisible" :codeKey="codeKey" @close="detailClose" />
    <div class="code">
        <div class="search_page">
        <div class="search">
        <el-select
            class="mr10"
            size="mini"
            v-model="codeStatus"
            placeholder="授权码状态"
            style="width:150px"
            @change="initPage"
            clearable
        >
            <el-option
            v-for="item in codeStatusList"
            :label="item.itemName"
            :value="item.itemValue"
            :key="item.itemValue"
            ></el-option>
        </el-select>

        <el-button
            type="primary"
            size="mini"
            @click="initPage()"
        >GO</el-button>
        <el-button
            v-if="roleInfo.includes('authorizationCode_add')"
            type="primary"
            size="mini"
            @click="addCode()"
        >新增</el-button>
        </div>
        <pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            :pager-count="5"
            layout="total, sizes, prev, pager, next"
            :total="total"
        ></pagination>
        </div>
        <div class="home-table">
        <el-table
            size="mini"
            @row-dblclick="toDetailAuthorization"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            show-overflow-tooltip
            prop="codeKey"
            label="授权码"
            width="150">
            </el-table-column>
            <el-table-column
            prop="codeStatusName"
            label="授权码状态"
            >
            </el-table-column>
            <el-table-column
            prop="userName"
            label="使用人">
            </el-table-column>
            <el-table-column
            prop="bindTime"
            label="绑定时间">
            </el-table-column>
            <el-table-column
            prop="expirationTime"
            label="过期时间">
            </el-table-column>
            <el-table-column
            prop="machineCode"
            label="绑定机器码">
            </el-table-column>
            <el-table-column
            prop="machineName"
            label="机器名">
            </el-table-column>
        </el-table>
        </div>
    </div>
  </d2-container>
</template>

<script>

import api from '@/api/authorization.js'
import detailAuthorization from './components/detailAuthorization.vue'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  name: 'Code',
  mixins: [mixins],
  components: {
    detailAuthorization
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
  },
  data () {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 100,
      loading: false,
      userId: '',
      codeStatus: '',
      sortCol: '',
      sort: '',
      codeKey: '',
      detailVisible: false,
      addVisible: false,
      tableData: [],
      codeStatusList: [
        { itemName: '启用', itemValue: '1' },
        { itemName: '禁用', itemValue: '0' }
      ]
    }
  },
  mounted () {
    this.initPage()
    this.init()
  },
  methods: {
    initPage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: this.userId,
        codeStatus: this.codeStatus,
        sortCol: this.sortCol,
        sort: this.sort
      }
      this.loading = true
      api.getAuthorizationList(data).then(res => {
        console.log(res)
        this.total = res.data.total
        console.log(res.data.rows)
        this.loading = false
        this.tableData = res.data.rows
      })
    },
    init () {

    },
    addCode () {
      this.$confirm('是否确认新增一个授权码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.addAuthorization().then(res => {
          this.initPage()
          console.log(res)
          this.$alert(`新增成功，授权码为：<span style="color:#c32e47">${res.data.codeKey}</span>`, '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定'
          })
        })
      }).catch(() => {

      })
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.initPage()
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.initPage()
    },
    toDetailAuthorization (row) {
      this.codeKey = row.codeKey
      console.log(this.codeKey, row)
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
    },
    addClose () {
      this.addVisible = false
    },
    addSubmit () {
      this.addVisible = false
      this.initPage()
    }
  }
}
</script>

<style scoped>
</style>
