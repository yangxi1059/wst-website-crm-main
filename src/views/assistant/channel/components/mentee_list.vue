<!--
 * @Author: 杨曦
 * @Date: 2022-02-21 14:06:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-22 16:30:01
 * @Version:
 * @Description:
-->
<template>
  <div class="inputInformation">
    <el-drawer
      v-loading="loading"
      :title="`咨询学员列表 （${menteeArr.length || '0'}个）`"
      class="info"
      ref="filterTable"
      :visible.sync="menteeListVisible"
      size="80%"
      :before-close="handleClose"
    >
    <div class="search_page">
      <div class="search">
        <el-select
            style="150px"
            size="mini"
            class="ml20"
            v-model="sourceId"
            clearable
            @change="toPage()"
            placeholder="请选择渠道来源"
        >
            <el-option
            v-for="item in sourceList"
            :key="item.sourceId"
            :label="item.sourceName"
            :value="item.sourceId"
            ></el-option>
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
        <el-table :data="menteeArr" size="mini" highlight-current-row>
            <el-table-column align="center" prop="menteeName" label="menteeName" min-width="80"></el-table-column>
            <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
            <el-table-column align="center" prop="wxName" label="微信名"></el-table-column>
            <el-table-column align="center" prop="finishYear" label="学生毕业年份"></el-table-column>
            <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90"></el-table-column>
            <el-table-column align="center" prop="signStatusName" :filters="[{ text: '已签约', value: '已签约' }, { text: '未签约', value: '未签约' }]"
              :filter-method="filterTag"
              filter-placement="bottom-end" label="签约状态" min-width="80"></el-table-column>
            <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
            <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
            <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
            <el-table-column align="center" prop="counselorName" label="顾问姓名"></el-table-column>
        </el-table>
    </el-drawer>
  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  name: 'inputInformation',
  props: {
    channelId: {
      type: String,
      default: ''
    },
    sourceList: {},
    menteeListVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 50,
      menteeArr: [],
      loading: false,
      sourceId: ''
    }
  },
  mounted () {
  },
  watch: {
    menteeListVisible: function (newData) {
      if (newData) {
        console.log(this.sourceList)
        this.toPage()
      }
    }
  },
  methods: {
    toPage () {
      this.loading = true
      this.menteeArr = []
      const data = {
        sourceId: this.sourceId,
        channelId: this.channelId,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      api.getMenteeListNew(data).then(res => {
        this.menteeArr = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    filterTag (value, row) {
      console.log(value)
      return row.signStatusName === value
    },
    // 录入信息，关闭
    handleClose () {
      this.sourceId = ''
      this.$emit('close')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.toPage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.toPage(this.pageNum)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
