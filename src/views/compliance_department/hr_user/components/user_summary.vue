<!--
 * @Author: 杨曦
 * @Date: 2020-11-17 15:30:37
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-04-06 14:32:55
 * @Version:
 * @Description:
-->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      title="在职员工分布统计"
      :visible.sync="userSummaryVisible"
      width="900px"
      :before-close="close"
    >
        <el-table
          border
          :data="tableList"
          highlight-current-row
          style="width: 100%"
        >
            <el-table-column prop="name" min-width="200px" align="center" label="年龄分布区间"></el-table-column>
            <el-table-column prop="value" min-width="200px" align="center" label="此区间人数"></el-table-column>
        </el-table>
        <el-table
          class="mt20"
          border
          :data="tableList2"
          highlight-current-row
          style="width: 100%"
        >
            <el-table-column prop="deptName" min-width="200px" align="center" label="部门"></el-table-column>
            <el-table-column prop="deptNum" min-width="200px" align="center" label="部门人数"></el-table-column>
            <!-- <el-table-column prop="deptUserName" align="center" label="部门成员"></el-table-column> -->
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/hr.js'
export default {
  name: 'edit',
  props: {
    userSummaryVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableList: [],
      tableList2: []
    }
  },
  watch: {
    userSummaryVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      const dataArr = new Array(5).fill(null)
      api.getUserSummary().then(res => {
        console.log(res.data)
        for (const item in res.data.ageSummary) {
          if (item == 'averAge') {
            dataArr[0] = {
              name: '平均年龄',
              value: res.data.ageSummary[item]
            }
          }
          if (item == 'before90') {
            dataArr[1] = {
              name: '90年以前',
              value: res.data.ageSummary[item]
            }
          }
          if (item == '90To95') {
            dataArr[2] = {
              name: '90年到95年',
              value: res.data.ageSummary[item]
            }
          }
          if (item == '95To00') {
            dataArr[3] = {
              name: '95年到00年',
              value: res.data.ageSummary[item]
            }
          }
          if (item == 'after00') {
            dataArr[4] = {
              name: '00后',
              value: res.data.ageSummary[item]
            }
          }
        }
        let arr = res.data.deptSummary
        let arr2 = []
        arr.forEach(item => {
          item.deptUser.forEach(item2 => {
            item.deptUserName += `${item2.userName} ,`
          })
          arr2.push({
            deptName: item.deptName,
            deptNum: item.deptUser.length,
            deptUserName: item.deptUserName
          })
        })
        console.log(arr2)
        this.tableList2 = arr2
        this.$nextTick(() => {
          this.tableList = dataArr
        })
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
