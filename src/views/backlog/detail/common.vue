<!--
 * @Author: 库建华
 * @Date: 2020-07-29 13:35:53
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:55:14
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="day+'的待办'"
      :visible.sync="commonDetailVisible"
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
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
        <el-table-column min-width="30px" align="center" prop="isDoneName" label="是否完成">
          <template slot-scope="scope">
            <p type="text" @click="toDetail(scope.row)">{{scope.row.isDone == '1' ? '✔️' : '❌'}}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" prop="reminderMsg" label="消息内容" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="50px" align="center" prop="createByName" label="创建人"></el-table-column>
        <el-table-column min-width="50px" align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column min-width="50px" align="center" prop="updateByName" label="更新人"></el-table-column>
        <el-table-column min-width="50px" align="center" prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">标记选中待办为完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/backlog.js'
export default {
  name: 'common-detail',
  props: {
    commonDetailVisible: Boolean,
    day: String,
    userId: String
  },
  data: () => {
    return {
      tableData: [],
      multipleSelection: []
    }
  },
  watch: {
    commonDetailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      const params = {
        backlogDate: this.day,
        userId: this.userId,
        pageNum: '1',
        pageSize: '9999'
      }
      api.getBacklogCommonItemList(params).then(res => {
        console.log(res)
        this.tableData = res.data.rows
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
