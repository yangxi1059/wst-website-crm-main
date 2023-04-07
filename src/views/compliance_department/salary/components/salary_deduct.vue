<!--
 * @Author: 杨曦
 * @Date: 2020-12-22 18:05:11
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-09 14:03:42
 * @Version:
 * @Description:
-->
<template>
  <div class="pay-way">
    <el-dialog :close-on-click-modal="false"
      width="800px"
      title="扣款事由"
      :visible.sync="salaryListVisible"
      :before-close="close"
    >
        <el-table
        :data="tableData"
        stripe
        style="width: 100%">
            <el-table-column
                prop="deduct"
                label="扣款金额"
            >
            </el-table-column>
            <el-table-column
                prop="deductNote"
                label="扣款原因"
            >
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
        </span>
        </el-dialog>
  </div>
</template>
<script>
import api from '@/api/hr.js'
export default {
  name: 'payWay',
  props: {
    salaryListVisible: {
      type: Boolean,
      default: false
    },
    salaryId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  mounted () {

  },
  watch: {
    salaryListVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getSalaryDeduct(this.salaryId).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
