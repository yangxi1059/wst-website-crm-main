<!--
 * @Author: 杨曦
 * @Date: 2023-01-13 10:50:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-13 15:58:38
 * @Version:
 * @Description:
-->
<!--
 * @Author: 库建华
 * @Date: 2020-05-25 15:04:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-09 14:40:49
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer title="查看每日汇总" :visible.sync="daySelectVisible" size="90%" :before-close="close">
      <div class="search_page">
        <div class="search"></div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[10]"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        border
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="margin:0 20px;" :data="showOrderArr" size="mini" >
        <el-table-column align="center"  label="日期">
          <template slot-scope="scope">
            <el-link type="primary" v-if="scope.row.addList.length > 0 || scope.row.counselorList.length > 0 || scope.row.signList.length > 0" @click="toDate(scope.row)">{{scope.row.date}}</el-link>
            <div v-else>{{scope.row.date}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="新增录入">
          <template slot-scope="scope">
            <div>{{scope.row.addList.length}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="新增咨询">
          <template slot-scope="scope">
            <div>{{scope.row.counselorList.length}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="新增签约">
          <template slot-scope="scope">
            <div>{{scope.row.signList.length}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <dayDetail :dayDetailVisible="dayDetailVisible" :dayDetailData="dayDetailData" @close="toDateClose" />
  </div>
</template>

<script>
import api from '@/api/bd'
import apiVip from '@/api/vip'
import mixins from '@/plugin/mixins'
import dayDetail from './daySelect/detail.vue'

export default {
  name: 'showOrderArr',
  mixins: [mixins],
  props: {
    daySelectVisible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      loading: false,
      showOrderArr: [],
      total: 360,
      pageSize: 10,
      pageNum: 1,
      dayDetailVisible: false,
      dayDetailData: {}
    }
  },
  watch: {
    daySelectVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  components: { dayDetail },
  methods: {
    Topage () {
      this.loading = true
      let data = {
        pageNo: this.pageNum,
        pageSize: this.pageSize
      }
      api.statisticsDaliy(data).then(res => {
        console.log(res)
        this.loading = false
        this.showOrderArr = res.data
      })
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    close () {
      this.$emit('close')
    },
    toDate (data) {
      console.log(data)
      this.dayDetailData = data
      this.dayDetailVisible = true
    },
    toDateClose () {
      this.dayDetailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
