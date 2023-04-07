<!--
 * @Author: 库建华
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-12 10:09:27
 * @Version: 
 * @Description: 
-->
<template>
  <div>
    <el-drawer
      :title="`预排课核验`"
      :visible.sync="checkLessonsVisible"
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
              <el-select class="mr10 mb10" style="width:160px"  v-model="checkStatus" clearable placeholder="核验状态">
                  <el-option
                  v-for="item in checkStatusList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                  </el-option>
              </el-select>
              <mySelect
                v-if="checkLessonsVisible"
                :role="role"
                :showStatus="showStatus"
                @change="changeSelect"
              />
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
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text"  @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column  label="签约ID" prop="signId"></el-table-column>
          <el-table-column  label="课程类型" prop="lessonTypeName"></el-table-column>
          <el-table-column sortable label="学生姓名" prop="menteeName"></el-table-column>
          <el-table-column sortable label="导师姓名" prop="mentorName"></el-table-column>
          <el-table-column  label="Strategist/PM" prop="manageByName" show-overflow-tooltip></el-table-column>
          <el-table-column  label="核验状态" prop="checkStatusName"></el-table-column>
          <el-table-column  label="核验备注" prop="checkNote" show-overflow-tooltip></el-table-column>
          <el-table-column  label="核验人" prop="checkByName"></el-table-column>
          <el-table-column sortable label="核验时间" prop="checkTime" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <detail :detailVisible="detailVisible" :pkId="pkId" @close="detailClose" @submit="detailSubmit" />
  </div>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/vip.js";
import { mapState } from 'vuex';
import mySelect from '@/components/my-select.vue'
import detail from './detailCheckLessons.vue'
export default {
  props: {
    checkLessonsVisible: {
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
    mySelect, detail
  },
  mixins: [mixins],
  data() {
    return {
      pageNum: 1,
      pageSize: 400,
      pictLoading: false,
      search: '',
      userId: '',
      groupId: '',
      checkStatus: '',
      checkStatusList: [],
      sortCol: '',
      sort: '',
      tableList:[],
      total:0,
      showStatus:true,
      role:'0',
      detailVisible: false,
      pkId: ''
    };
  },
  watch: {
    checkLessonsVisible: function(val) {
      if (val) {
        this.pageInit()
        this.userId = this.userInfo.userId
        this.init()
      }
    }
  },
  mounted() {
    if(this.roleInfo.includes("home_vip_checklessons_allData")){
      this.role = '1'
    }else{
      this.role = '0'
    }
  },
  methods: {
    init(){
      console.log(11)
      this.pictLoading = true
      let data = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        search:this.search,
        userId:this.userId,
        groupId:this.groupId,
        checkStatus:this.checkStatus,
        sortCol:this.sortCol,
        sort:this.sort,
      }
      console.log(data)
      api.getCheckLessons(data).then(res => {
        this.tableList = res.data.rows
        this.total = res.data.total
        console.log(res.data.rows)
          this.pictLoading = false
      })
    },
    async pageInit () {
      this.checkStatusList = await this.getDictionary('lesson_schedule_check_status')
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
      this.search = ''
      this.userId = ''
      this.groupId = ''
      this.checkStatus = ''
      this.sortCol = ''
      this.sort = ''
    },
    changeSelect(data){
      this.groupId = data.groupId
      this.userId = data.user
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.init()
    },
    detail(row){
      console.log(row)
      this.pkId = row.pkId
      this.detailVisible = true
    },
    detailClose(){
      this.detailVisible = false
    },
    detailSubmit(){
      this.detailVisible = false
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
    },
  }
};
</script>

<style lang="scss" scoped>
</style>

