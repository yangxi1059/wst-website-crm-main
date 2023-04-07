<!--
 * @Author: 杨曦
 * @Date: 2020-03-11 15:01:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-06 14:23:12
 * @Version:
 * @Description: 文书修改统计弹窗
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="文书修改统计" :visible.sync="statisticsVisible" width="700px" :before-close="close">
      <el-date-picker v-model="fromDate" type="date" class="mr10" size="mini" placeholder="选择开始日期"></el-date-picker>
      <el-date-picker v-model="toDate" type="date" class="mr10" size="mini" placeholder="选择结束日期"></el-date-picker>
      <el-button icon="el-icon-edit-outline" class="mr10" size="mini" plain @click="initPage">GO</el-button>
      <el-table :data="tableData" size="mini" highlight-current-row>
        <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
        <el-table-column align="center" label="修改文件数" prop="modifyCount"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
export default {
  props: {
    statisticsVisible: {
      type: Boolean,
      default: false
    },
    user: {
      type: String
    }
  },
  data () {
    return {
      fromDate: null,
      toDate: null,
      tableData: []
    }
  },
  watch: {
    statisticsVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  mounted () {},
  methods: {
    initPage () {
      const params = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        userId: this.user
      }
      this.$loading()
      api.getSignLetterCounts(params).then(res => {
        this.$loading().close()
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
