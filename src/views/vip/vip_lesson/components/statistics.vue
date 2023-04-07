<!--
 * @Author: 库建华
 * @Date: 2020-03-12 17:46:20
 * @LastEditors: 库建华
 * @LastEditTime: 2020-03-12 17:48:17
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog title="课时统计" :close-on-click-modal="false" :visible.sync="statisticsVisible" width="700px" :before-close="close">
      <el-date-picker v-model="fromDate" type="date" class="mr10" size="mini" placeholder="选择开始日期"></el-date-picker>
      <el-date-picker v-model="toDate" type="date" class="mr10" size="mini" placeholder="选择结束日期"></el-date-picker>
      <el-button icon="el-icon-edit-outline" class="mr10" size="mini" plain @click="initPage">GO</el-button>
      <el-table :data="tableData" size="mini" highlight-current-row>
        <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
        <el-table-column align="center" label="完成课时数" prop="lessonHoursCount"></el-table-column>
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
      }
    }
  },
  mounted () {},
  methods: {
    initPage () {
      const params = {
        fromDate: this.fromDate,
        toDate: this.toDate
      }
      this.$loading()
      api.getVipLessonCounts(params).then(res => {
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
