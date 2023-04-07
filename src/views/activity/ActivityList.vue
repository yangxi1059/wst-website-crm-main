<!--
 * @Author: kaan
 * @Date: 2021-03-09 18:30:58
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-25 16:16:17
 * @Version:
 * @Description:
-->

<template>
  <d2-container v-loading="loading">
    <div class="activity-container">
      <div class="search_page">
        <div class="search">
          <el-select size="mini"
            class="mr10"
            style="width: 150px"
            v-model="searchData.discountStatus"
            filterable
            clearable
            placeholder="卡券状态"
            @change="Topage(1)"
          >
            <el-option
              v-for="(item,index) in discountStatus"
              :key="index"
              :label="item.label"
              :value="item.val"
            ></el-option>
          </el-select>
          <el-select
            size="mini"
            class="mr10"
            style="width: 150px"
            v-model="searchData.activeStatus"
            filterable clearable
            placeholder="激活状态"
            @change="Topage(1)"
          >
            <el-option
              v-for="(item,index) in activeStatus"
              :key="index"
              :label="item.label"
              :value="item.val"
            ></el-option>
          </el-select>

          <el-button
            icon="el-icon-search"
            class=" mb10"
            v-if="roleInfo.includes(`activity_list`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class=" mb10"
            v-if="roleInfo.includes(`activity_list`)"
            size="mini"
            plain
            @click="newInfo"
          >新增</el-button>
          <!-- <el-button
            icon="el-icon-delete"
            class="mr10 mb10"
            v-if="roleInfo.includes(`activity_list`)"
            size="mini"
            plain
            @click="delInfo"
          >删除</el-button> -->
          <el-button
            icon="el-icon-view"
            class=" mb10"
            v-if="roleInfo.includes(`activity_list`)"
            size="mini"
            plain
            @click="detailInfo"
          >券详情</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="searchData.pageNum"
          :page-size="searchData.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="discountList"
        size="mini"
        highlight-current-row
        style="width: 100%"
        ref="table"
        id="export_table"
      >
        <el-table-column min-width="130px" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`activity_list_edit`)"
              type="text"
              @click="editInfo(scope.row.discountId)"
            >编辑</el-button>
            <el-button
              v-if="roleInfo.includes(`activity_list_receive`) && scope.row.activeStatus == 1"
              type="text"
              @click="receiveCoupon(scope.row)"
            >领取</el-button>
            <el-button
              v-if="roleInfo.includes(`activity_list_delete`)"
              type="text"
              @click="deleteInfo(scope.row.discountId)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="discountName" min-width="150px" align="center" label="券名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beginDate" min-width="100px" align="center" label="开始时间"></el-table-column>
        <el-table-column prop="endDate" min-width="100px" align="center" label="结束时间"></el-table-column>
        <el-table-column  min-width="100px" align="center" label="券数量">
          <template slot-scope="scope">
            {{scope.row.couponNum < 0 ?"不限量" : scope.row.couponNum}}
          </template>
        </el-table-column>
        <el-table-column prop="receiveNum" min-width="100px" align="center" label="已领券数量"></el-table-column>
        <el-table-column min-width="100px" align="center" label="优惠比例">
          <template slot-scope="scope">
            {{scope.row.discountPercent ? scope.row.discountPercent : "-"}}
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="优惠金额">
          <template slot-scope="scope">
            {{scope.row.discountAmount ? scope.row.amountType+scope.row.discountAmount : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="programNames" min-width="150px" align="center" label="适用范围" show-overflow-tooltip></el-table-column>
        <el-table-column prop="discountStatusName" min-width="100px" align="center" label="券状态"></el-table-column>
      </el-table>
      <edit :infoVisible="infoVisible" :editType="editType" :discountId="discountId" @close="infoClose" @submit="Topage"/>
      <coupon :couponVisible="couponVisible" :discountId="discountId" :restNum="restNum" :couponNum="couponNum" @close="couponClose" @submit="Topage"/>
    </div>
  </d2-container>
</template>
<script>
import api from '@/api/activity.js'
import mixins from '@/plugin/mixins'
import edit from './components/activity_edit.vue'
import coupon from './components/activity_coupon.vue'
import { mapState } from 'vuex'

export default {
  name: 'activityList',
  mixins: [mixins],
  components: { edit, coupon },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      loading: false,
      searchData: {
        pageNum: 1,
        pageSize: 100,
        programId: '',
        discountStatus: '', /* 卡券状态 前端可以写死  取值"未开始" "进行中" "已结束" */
        activeStatus: '', /* 活动状态 是否激活 0否 1是  */
        search: '',
        sortCol: '',
        sort: ''
      },
      total: 0,
      discountStatus: [
        { val: '未开始', label: '未开始' },
        { val: '进行中', label: '进行中' },
        { val: '已结束', label: '已结束' }
      ],
      activeStatus: [
        { val: '0', label: '否' },
        { val: '1', label: '是' }
      ],
      discountList: [],

      /* dialog参数 */
      infoVisible: false,
      editType: 'add',
      discountId: '',
      couponVisible: false,
      restNum: 1,
      couponNum: 0
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    /**
     * @description: 获取券列表
     * @param {*}
     * @return {*}
     */
    Topage () {
      this.loading = true
      this.discountList = []
      api.getInfoList(this.searchData).then(res => {
        this.loading = false
        console.log('InfoList', res.data)
        this.total = res.data.total
        this.discountList = res.data.rows
      })
    },

    newInfo () {
      this.infoVisible = true
      this.editType = 'add'
      console.log(this.editType)
    },
    editInfo (id) {
      this.infoVisible = true
      this.editType = 'edit'
      this.discountId = id
    },
    deleteInfo (id) {
      this.$confirm('此操作将永久删除该卡券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteInfo(id).then(res => {
          this.Topage()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    detailInfo () {
      this.$router.push('/coupon_list')
    },

    /**
     * @description: 新增/编辑弹框关闭
     * @param {*}
     * @return {*}
     */
    infoClose () {
      this.infoVisible = false
    },

    /**
     * @description: 领券弹框
     * @param {*} item 券信息
     * @return {*}
     */
    receiveCoupon (item) {
      this.discountId = item.discountId
      if (item.couponNum !== -1) {
        this.restNum = item.couponNum - item.receiveNum
      }
      this.couponNum = item.couponNum
      if (this.restNum == 0) {
        this.$message({
          type: 'warning',
          message: '券已全部领取，剩余不足'
        })
        return
      }
      this.couponVisible = true
    },

    couponClose () {
      this.couponVisible = false
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.searchData.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.searchData.pageNum)
    }
  }
}

</script>
