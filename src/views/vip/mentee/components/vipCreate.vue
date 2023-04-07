<!--
 * @Author: 库建华
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-23 17:57:04
 * @Version: 
 * @Description: 
-->
<template>
  <div>
    <el-drawer
      :title="`学员拉群一览`"
      :visible.sync="vipCreateVisible"
      size="80%"
      class="yx_my_select"
      :append-to-body="true"
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
                placeholder="学生姓名、导师姓名、学生微信"
                :style="{width:'160px'}"
              ></el-input>
              <el-select class="mr10 mb10" style="width:160px"  v-model="programType" clearable placeholder="项目类型">
                  <el-option
                  v-for="item in program_type"
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
          size="small"
          @sort-change="sortTable"
          :data="tableList"
          border
          v-loading = "pictLoading"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%;max-height: 700px;overflow-y: auto;height:700px">
          <el-table-column v-if="roleInfo.includes(`vip_create_set`)" align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text"   @click="detail(scope.row)">设置</el-button>
            </template>
          </el-table-column>
          <el-table-column sortable  label="学生姓名" prop="menteeName"></el-table-column>
          <el-table-column sortable label="微信ID" prop="wxId"></el-table-column>
          <el-table-column sortable label="项目类型" prop="programTypeName"></el-table-column>
          <el-table-column sortable label="项目名称" prop="programName" show-overflow-tooltip></el-table-column>
          <el-table-column sortable label="签约日期" prop="signDate"></el-table-column>
          <el-table-column sortable label="主联系人" prop="contact1Name" show-overflow-tooltip></el-table-column>
          <el-table-column sortable label="VIP拉群日期" prop="vipGroupDate" show-overflow-tooltip></el-table-column>
          <el-table-column sortable label="规划导师" prop="strategistName" show-overflow-tooltip></el-table-column>
          <el-table-column sortable label="PM" prop="pmName" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <vipCreateDetail :addSetVipVisible="addSetVipVisible" :signId="signId" :vipList="vipList"  @close="addClsoe" @submit="addSubmit" />
  </div>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/vip.js";
import vipCreateDetail from "./vipCreateDetail.vue";

import { mapState } from 'vuex';
export default {
  props: {
    vipCreateVisible: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  components:{
    vipCreateDetail
  },
  mixins: [mixins],
  data() {
    return {
      program_type: [],
      pageNum: 1,
      pageSize: 400,
      tableList:[],
      programType:'',
      total:0,
      pictLoading: false,
      addSetVipVisible: false,
      vipList: {},
      signId: '',
      search: '',
      sortCol:'',
      sort:''
    };
  },
  watch: {
    vipCreateVisible: function(val) {
      if (val) {
        this.init()
      }
    }
  },
  mounted() {
   this.pageInit()
  },
  methods: {
    async pageInit () {
      this.program_type = await this.getDictionary('program_type')
    },
    init(){
      console.log(11)
      this.pictLoading = true
      let data = {
       pageNum: this.pageNum,
       pageSize: this.pageSize,
       search: this.search,
       programType: this.programType,
       sortCol:this.sortCol,
       sort:this.sort,
      }
      console.log(data)
      api.getVipCreate(data).then(res => {
        console.log(res.data)
        this.tableList = res.data.rows
        this.total = res.data.total
        this.pictLoading = false
      })
    },
    sumbit(){
      this.clear()
      this.$emit("close");
    },
    close() {
      this.clear()
      this.$emit("close");
    },
    clear(){
      this.tableList = []
      this.sortCol = ''
      this.sort = ''
      this.pageNum = 1
      this.pageSize = 400
      this.search = ''
      this.total = 0
      this.programType = ''
    },
    detail(row){
      console.log(row)
      this.signId = row.signId
      this.vipList = {
        strategist: row.strategist,
        services: row.services,
        vipGroupDate: row.vipGroupDate || '',
        orderId: row.orderId || ''
      }
      this.addSetVipVisible = true
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
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.init()
    },
    addClsoe(){
      this.addSetVipVisible = false
    },
    addSubmit(){
      this.addSetVipVisible = false
      this.init()
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

