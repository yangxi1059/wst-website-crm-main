<!--
 * @Author: 库建华
 * @Date: 2020-05-28 16:46:32
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-23 09:39:39
 * @Version: 1
 * @Description:
-->
<template>
  <div>
   <el-drawer
    :visible.sync="vipRecommenderVisible"
    size="90%"
    :before-close="followUpItemClose2"
    title="转介绍学生"
   >
    <div v-loading="loading" style="padding:20px;box-sizing:border-box">
      <div class="search_page" ref="search">
        <div class="search">
          <el-date-picker
            v-model="daterange0"
            class="mb10 mr10"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button icon="el-icon-search"  size="mini" plain @click="Topage()">GO</el-button>
        </div>
      </div>
      <el-table
        :data="tableList"
        size="mini"
        highlight-current-row
        border
      >
        <el-table-column type="index" align="center" width="30"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="学员名" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column align="center" prop="wxId" label="微信ID" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="wxName" label="微信名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="finishYear" label="学生毕业年份" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" sortable prop="signStatusName" label="签约状态" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="sourceFromName" label="渠道来源" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="firstAskDate" label="首次咨询日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="counselorDate" label="分配顾问日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="counselorName" label="顾问姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="vipRecommenderName" label="VIP转介绍人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
   </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'

export default {
  name: 'vipRecommender',
  mixins: [mixins],
  props: {
    vipRecommenderVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pageSize: 100,
      pageNum: 1,
      total: 0,
      userId: '',
      tableHeight: 'auto',
      loading: false,
      tableList: [],
      userList: [],
      daterange0: '',
      fromDate: '',
      toDate: ''
    }
  },
  watch: {
    vipRecommenderVisible: function (val) {
      if (val) {
        this.Topage()
      }
    },
    total: function (val, old) {
      this.$nextTick(function () {
        this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
      })
    }
  },
  mounted () {

  },
  methods: {
    followUpItemClose2 () {
      this.$emit('close')
    },
    Topage () {
      console.log(this.daterange0)
      this.loading = true
      if (this.daterange0 != null) {
        this.fromDate = this.daterange0[0] || ''
        this.toDate = this.daterange0[1] || ''
      } else {
        this.fromDate = ''
        this.toDate = ''
      }
      api.vipRecommenderList(this.userId, this.fromDate, this.toDate, '').then(res => {
        console.log(res.data)
        this.loading = false
        this.tableList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
