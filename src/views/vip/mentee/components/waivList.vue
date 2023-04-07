<!--
 * @Author: 库建华
 * @Date: 2020-05-28 16:46:32
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-26 15:10:54
 * @Version: 1
 * @Description:
-->
<template>
  <div>
   <el-drawer
    :visible.sync="waivListVisible"
    size="90%"
    :before-close="followUpItemClose2"
    title="放弃实习名单"
   >
    <div v-loading="loading" style="padding:20px;box-sizing:border-box">
      <div class="search_page" ref="search">
        <div class="search">
          <el-button icon="el-icon-search"  size="mini" plain @click="Topage()">GO</el-button>
        </div>
      </div>
      <el-table
        :data="tableList"
        size="mini"
        highlight-current-row
      >
        <el-table-column label="操作"  >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderId" label="订单ID" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="学员姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="signDate" label="签约日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="endDate" label="项目结束日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="internshipStatusName" label="实习状态" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="internshipNote" label="实习说明" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
   </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'

export default {
  name: 'waivList',
  mixins: [mixins],
  props: {
    waivListVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableHeight: 'auto',
      loading: false,
      tableList: []
    }
  },
  watch: {
    waivListVisible: function (val) {
      if (val) {
        this.Topage()
      }
    },
    total: function (val, old) {
      this.$nextTick(function () {
        this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
      })
    },
  },
  mounted () {
    
    },
  methods: {
    detail (data) {
      this.$emit('close')
      this.$router.push({ name: 'UserDetail', query: { menteeId: data.menteeId } })
    },
    followUpItemClose2 () {
      this.$emit('close')
    },
    Topage () {
      api.getWaivList().then(res => {
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
