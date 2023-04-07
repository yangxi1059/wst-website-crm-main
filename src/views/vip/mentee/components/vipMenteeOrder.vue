<!--
 * @Author: 库建华
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-02 17:29:32
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-drawer
      :title="`学生订单列表`"
      :visible.sync="vipMenteeOrderVisible"
      size="80%"
      :modal="false"
      class="yx_my_select"
      :before-close="close"
    >
      <div style="margin:0 20px">
        <div class="search_page">
          <div class="search">
              <el-input
                class="mr10 mb10"
                v-model="search"
                size="mini"
                clearable
                placeholder="学生姓名"
                :style="{width:'160px'}"
              ></el-input>
              <el-select class="mr10 mb10" style="width:160px"  v-model="payStatus" clearable placeholder="核验状态">
                  <el-option
                  v-for="item in payStatusList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                  </el-option>
              </el-select>
              <el-button
                icon="el-icon-search"
                size="mini"
                plain
                @click="init()"
              >GO</el-button>
          </div>
          <el-pagination
            class="pagination mb10"
            background
            @current-change="handleCurrentChange"
            :pager-count="5"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="total"
            layout="total,prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
        <el-table
          stripe
          @sort-change="sortTable"
          size="small"
          :data="tableList"
          border
          v-loading = "pictLoading"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
          <el-table-column  label="订单ID" prop="orderId"></el-table-column>
          <el-table-column sortable label="学员姓名" prop="menteeName">
            <template slot-scope="scope">
                <el-link type="primary" @click="toDetail(scope.row.menteeId)">{{scope.row.menteeName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column sortable label="签约日期" prop="signDate" show-overflow-tooltip></el-table-column>
          <el-table-column sortable label="项目名称" prop="programName"></el-table-column>
          <el-table-column  label="付款状态" prop="payStatusName" show-overflow-tooltip>
            <template slot-scope="scope">
                <span v-if="scope.row.payStatus == '0'" style="color:#409EFF">{{scope.row.payStatusName || "无"}}</span>
                <span v-if="scope.row.payStatus == '1'" style="color:#67C23A">{{scope.row.payStatusName || "无"}}</span>
                <span v-if="scope.row.payStatus == '2'" style="color:#E6A23C">{{scope.row.payStatusName || "无"}}</span>
                <span v-if="scope.row.payStatus == '3'" style="color:#F56C6C">{{scope.row.payStatusName || "无"}}</span>
                <span v-if="scope.row.payStatus == '4'" style="color:#FF8C00">{{scope.row.payStatusName || "无"}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
export default {
  props: {
    vipMenteeOrderVisible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixins],
  data () {
    return {
      pageNum: 1,
      pageSize: 400,
      pictLoading: false,
      search: '',
      payStatus: '0',
      payStatusList: [],
      sortCol: '',
      sort: '',
      tableList: [],
      total: 0,
      showStatus: true
    }
  },
  watch: {
    vipMenteeOrderVisible: function (val) {
      if (val) {
        this.pageInit()
        // this.init()
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      console.log(11)
      this.pictLoading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        payStatus: this.payStatus,
        sortCol: this.sortCol,
        sort: this.sort
      }
      console.log(data)
      api.getMenteeOrder(data).then(res => {
        this.tableList = res.data.rows
        this.total = res.data.total
        console.log(res.data.rows)
        this.pictLoading = false
      })
    },
    async pageInit () {
      this.payStatusList = await this.getDictionary('order_pay_status')
    },
    close () {
    //   this.clear()
      this.$emit('close')
    },
    toDetail (menteeId) {
    //   this.close()
      this.$emit('toDetail', menteeId)
    },
    clear () {
      this.search = ''
      this.payStatus = ''
      this.sortCol = ''
      this.sort = ''
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.init()
    },
    sortTable (v) {
      console.log(v.order, v.prop)
      const orderToSort = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.sort = orderToSort[v.order] || null
      this.sortCol = v.prop
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
