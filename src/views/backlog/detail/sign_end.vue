<!--
 * @Author: 库建华
 * @Date: 2020-07-31 16:02:22
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-17 10:11:09
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="day+'到期的签约'"
      :visible.sync="signEndDetailVisible"
      width="1400px"
      :before-close="close"
    >
      <el-table
        :data="tableData"
        size="mini"
        ref="table"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column min-width="150px" align="center" prop="realName" label="学生姓名">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">{{scope.row.realName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="programName"
          label="项目名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column min-width="150px" align="center" prop="endDate" label="项目到期日期"></el-table-column>
        <el-table-column min-width="150px" align="center" prop="extendedEndDate" label="延长服务日期"></el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="strategistName"
          label="Strategist姓名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="programManagerName"
          label="PM姓名"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column align="center" prop="updateByName" label="更新人"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>-->
      </el-table>
    </el-dialog>
    <!-- <detail
      v-if="detailVisible"
      :menteeId="menteeId"
      :detailVisible="detailVisible"
      @close="detailClose"></detail> -->
  </div>
</template>

<script>
import api from '@/api/backlog.js'
// import detail from '../../vip/mentee/UserDetail.vue'
export default {
  name: 'common-detail',
  // components: { detail },
  props: {
    signEndDetailVisible: Boolean,
    day: String,
    userId: String
  },
  data: () => {
    return {
      tableData: [],
      multipleSelection: [],
      menteeId: '',
      // detailVisible: false
    }
  },
  provide () {
    return {
      getMenteeId: this.getMenteeId
    }
  },
  watch: {
    signEndDetailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    getMenteeId () {
      return this.menteeId
    },
    initPage () {
      const params = {
        backlogDate: this.day,
        userId: this.userId
      }
      api.getBacklogSignEndItemList(params).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
    },
    submit () {
      console.log(this.multipleSelection)
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请选择要操作的待办'
        })
        return
      }
      const data = {
        backlogType: this.multipleSelection[0].backlogType,
        ids: this.multipleSelection.map(v => v.pkId).join(',')
      }
      api.setBacklogItem(data).then(() => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.initPage()
        this.$emit('submit')
      })
    },
    handleSelectionChange (val) {
      console.log('handleSelectionChange', val)
      this.multipleSelection = val
    },
    selectable (v) {
      return v.isDone == '0'
    },
    add () {
      console.log('add')
    },
    toDetail (v) {
      console.log(v)
      this.menteeId = v.menteeId
      this.$router.push({ name: 'UserDetail', query: { menteeId: this.menteeId } })
    },
    detailClose () {
      // this.detailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
