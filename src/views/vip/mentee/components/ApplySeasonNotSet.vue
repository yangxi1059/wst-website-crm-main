<!--
 * @Author: Kaan
 * @Date: 2022-04-22 16:33:31
 * @LastEditors: kaan
 * @LastEditTime: 2022-06-08 16:22:01
 * @version: 
 * @Descripttion: 
-->
<template>
  <el-drawer
    :visible.sync="applySeasonNotSetVisible"
    size="950px"
    :before-close="close"
    title="申请季未设置"
  >
    <div class="containenr">
      <div class="search_page mb10">
        <div class="search">
          <el-input
            class="mr10"
            v-model="search"
            size="mini"
            clearable
            placeholder="支持姓名、微信ID"
            @keyup.enter.native="Topage()"
            :style="{width:'160px'}"
          ></el-input>
          <el-cascader
            size="mini"
            class="mr10"
            v-model="role"
            ref="role"
            :options="userList"
            :props="{ checkStrictly: true,expandTrigger:'hover' }"
            clearable
            @change="roleChange()"
          >
            <p slot-scope="{data}" @click="clickNode">{{ data.label }}</p>
          </el-cascader>
          <el-button
            size="mini"
            icon="el-icon-search"
            plain
            @click="Topage()"
          >GO</el-button>
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
        size="small"
        :data="tableList"
        border
        v-loading = "loading"
      >
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text"  @click="toDetail(scope.row.menteeId)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName" label="学员姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="programName" label="签约项目" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="extendedEndDate" label="项目结束日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="strategistName" label="规划导师" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="pmName" label="PM" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'

export default {
  name: 'ApplySeasonNotSet',
  mixins: [
    mixins
  ],
  props: {
    applySeasonNotSetVisible: {
      type: Boolean,
      default: false
    },
  },
  data: () => {
    return {
      loading:false,
      search: '',
      role: '',
      groupId:"",
      userId:"",
      userList:[],
      tableList:[],

      // 分页
      pageNum: 1,
      pageSize: 0,
      total: 0,
    }
  },
  mounted () {
    this.init()
  },
  methods:{
    async init(){
      this.userList = await this.getUserList('vip_mentee_all_mentee_data')
      this.userInfo = this.$store.state.role.userInfo
      this.role = this.userInfo.userId
    },
    Topage(){
      let params={
        pageNum: 1,
        pageSize: 500,
        search: this.search,
        userId: this.userId,
        groupId: this.groupId,
      }
      this.loading = true
      api.getApplySeasonNotSet(params).then(res => {
        console.log(res.data.rows)
        this.total = res.data.total
        this.tableList = res.data.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.warning(err)
        console.log(err)
      });
    },
    // 下拉选单击选中
    clickNode ($event) {
      $event.target.parentElement.parentElement.firstElementChild.click()
    },
    // 下拉选选中时自动收起展开
    roleChange () {
      console.log(this.role)
      const tempObj = this.$refs.role.getCheckedNodes()[0]
      console.log(this.$refs.role.getCheckedNodes()[0])
      if (tempObj) {
        if (tempObj.hasChildren) {
          this.groupId = tempObj.value
          this.userId = ''
        } else {
          this.groupId = ''
          this.userId = tempObj.value
        }
      } else {
        this.groupId = ''
        this.userId = ''
      }
      this.$refs.role.dropDownVisible = false
    },
    toDetail(id){
      this.close()
      this.$router.push({ name: 'UserDetail', query: { menteeId: id } })
    },
    close(){
      this.$emit("close")
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
  }
  
}
</script>

<style lang="scss" scoped>
.containenr{
  padding:10px
}
</style>