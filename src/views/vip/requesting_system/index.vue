<!--
 * @Author: 杨曦
 * @Date: 2020-11-12 13:21:02
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-11 11:53:55
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="mentor_apply">
      <div class="search_page">
        <div class="search">
          <el-select style="width:150px" v-model="requestStatus" size="mini" @change="Topage()" clearable placeholder="Requset状态">
              <el-option
              v-for="item in options1"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
              </el-option>
          </el-select>
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
        :data="tableList"
        :stripe="true"
        size="mini"
        highlight-current-row
        :max-height="height"
      >
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="view(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="requestStatusName" show-overflow-tooltip label="状态"></el-table-column>
        <el-table-column align="center" prop="requestTrackName" show-overflow-tooltip label="方向"></el-table-column>
        <el-table-column align="center" prop="inviteCount" label="已发邮件数"></el-table-column>
        <el-table-column align="center" prop="acceptCount" label="接受导师数"></el-table-column>
        <el-table-column align="center" prop="requestTime" show-overflow-tooltip label="request时间"></el-table-column>
        <el-table-column align="center" prop="requestDeadLine" show-overflow-tooltip label="request截止时间"></el-table-column>
        <el-table-column align="center" prop="realName" show-overflow-tooltip label="学员名"></el-table-column>
        <el-table-column align="center" prop="schoolName" show-overflow-tooltip label="学校名"></el-table-column>
        <el-table-column align="center" prop="locationNames" show-overflow-tooltip label="地区"></el-table-column>
        <el-table-column align="center" prop="companyNames" show-overflow-tooltip label="公司名"></el-table-column>
        <el-table-column align="center" prop="requestCompanyRemark" show-overflow-tooltip label="申请公司备注"></el-table-column>
        <el-table-column align="center" prop="requestDetail" show-overflow-tooltip label="request详情"></el-table-column>
      </el-table>
      <requestSystemDetail :followUpVisible="followUpVisible" :requestId="requestId" @close="requestSystemDetailClose()"></requestSystemDetail>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import requestSystemDetail from './components/request_system_detail.vue'

export default {
  components: { requestSystemDetail },
  mixins: [mixins],
  data () {
    return {
      options1: [

      ],
      search: '',
      requestStatus: '',
      sort: '',
      sortCol: '',
      pageSize: 100,
      followUpVisible: false,
      pageNum: 1,
      requestId: '',
      total: 0,
      loading: false,
      purchaseDetailVisible: false,
      height: document.documentElement.clientHeight - 190,
      tableList: []
    }
  },
  // 根据学校联动国家
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.Topage()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.options1 = await this.getDictionary('mentee_request_status')
    },
    Topage () {
      this.loading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        requestStatus: this.requestStatus
      }
      api.getRequestData(data).then(res => {
        this.loading = false
        this.tableList = res.data.rows
        this.total = res.data.total
        console.log(this.tableList)
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
    view (val) {
      this.requestId = val.requestId
      this.followUpVisible = true
    },
    mentorApplyClose () {
      this.purchaseDetailVisible = false
    },
    requestSystemDetailClose () {
      this.followUpVisible = false
    }
  }
}
</script>

<style lang="scss">
.mentor {
  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
</style>
