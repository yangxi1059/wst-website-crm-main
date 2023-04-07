<!--
 * @Author: Kaan
 * @Date: 2022-04-11 14:40:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-31 16:45:53
 * @version: 
 * @Descripttion: 
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyYear"
            clearable
            filterable
            multiple
            placeholder="年份"
          >
            <el-option
              v-for="(year) in yearList" :key="year" :label="year" :value="year"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyType"
            clearable
            filterable
            multiple
            placeholder="类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyTrack"
            clearable
            filterable
            multiple
            placeholder="行业"
          >
            <el-option
              v-for="item in trackList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyCountry"
            clearable
            filterable
            multiple
            placeholder="地区"
          >
            <el-option
              v-for="item in countryList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class="mr10 mb10"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            v-if="roleInfo.includes(`vip_apply_season_add`)"
            class="mr10 mb10"
            size="mini"
            plain
            @click="addApply"
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
        border
        @row-dblclick="dblclick"
      >
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="roleInfo.includes(`vip_apply_season_edit`)" 
              @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" v-if="roleInfo.includes(`vip_apply_season_delete`)"
              @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="applyYear" label="年份" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyTypeName" label="类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyTrackName" label="行业" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyCountryName" label="地区" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="申请季时间" width="140">
          <template slot-scope="scope">
            {{scope.row.startMonth|| "无"}} 至 {{scope.row.endMonth || "无"}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="updateByName" label="修改人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="updateTime" label="修改时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <ApplyInput
      :detailVisible = "detailVisible" 
      :seasonId = "seasonId"
      @success="applySuccess"
      @close="applyClose"
    />
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import ApplyInput from './components/ApplyInput'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import files from '@/libs/file'
export default {
  mixins: [mixins],
  name: 'applySeason',
  components:{ApplyInput},
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      loading:false,
      // 搜索栏数据
      widths: '180px',
      applyYear:  "",
      applyType:  "",
      applyTrack:  "",
      applyCountry:  "",
      rangeMonth:[],
      startMonth:  "",
      endMonth:  "",
      yearList: ['2022','2023','2024','2025','2026'],
      typeList:[],
      trackList:[],
      countryList:[],

      pageSize: 50,
      pageNum: 1,
      total:  0,
      tableHeight: 'auto',
      tableData:[],

      detailVisible: false,
      seasonId:"",

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
      this.trackList = await this.getDictionary('mentee_track')
      this.countryList = await this.getDictionary('country')
      this.typeList = await this.getDictionary('internship_or_full_time')
    },
    Topage(i){
      i==1 ? this.pageNum =1 : ""
      let params={
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applyYear: this.applyYear.join(),
        applyType: this.applyType.join(),
        applyTrack: this.applyTrack.join(),
        applyCountry: this.applyCountry.join(),
      }
      this.loading = true
      api.getApplyList(params).then(res => {
        console.log(res.data.rows)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    dblclick (row, column, event) {
      console.log(row, column, event)
    },
    edit(row){
      this.detailVisible = true
      this.seasonId = row.seasonId
    },
    del(row){
      this.$confirm('确认删除该申请季嘛？', '提示').then((vv) => {
        if (vv) {
          this.loading = true
          api.delApplySeason(row.seasonId).then((res) => {
            console.log(res)
            this.$message.success("删除成功")
            this.loading = false
            this.Topage(1)
          }).catch(err => {
            this.loading = false
            this.$message.warning(err)
            console.log(err)
          });
        }
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
    addApply(){
      this.detailVisible = true
    },
    applyClose(){
      this.detailVisible = false
      this.seasonId = ""
    },
    applySuccess(){
      this.detailVisible = false
      this.seasonId = ""
      this.Topage(1)
    }
  }
}
</script>