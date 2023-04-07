<!--
 * @Author: 库建华
 * @Date: 2020-05-13 16:58:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-15 17:27:32
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"  title="课程申请列表" :visible.sync="applyVisible" width="1200px" :before-close="close">
      <div class="header" slot="title">
        课程申请列表：
        <el-button
          class="add-offer-btn mr10"
          @click="exportExcel"
          type="primary"
          plain
          round
          size="small"
        >导出</el-button>
      </div>
      <el-table :data="tableData" size="mini" highlight-current-row id="export_table">
        <el-table-column align="center" prop="pkId" label="编号"></el-table-column>
        <el-table-column align="center" prop="realName" label="学员名"></el-table-column>
        <el-table-column align="center" prop="programName" label="项目名"></el-table-column>
        <el-table-column align="center" prop="programLevel" label="programLevel"></el-table-column>
        <el-table-column align="center" prop="programGroup" label="programGroup"></el-table-column>
        <el-table-column align="center" prop="menteeId" label="学员ID"></el-table-column>
        <el-table-column align="center" prop="createTime" label="申请时间"></el-table-column>
        <el-table-column align="center" prop="email" label="Email"></el-table-column>
        <el-table-column align="center" prop="sessionApplyStatusName" label="订阅状态"></el-table-column>
        <el-table-column align="center" prop="vipName" label="Strategist/PM"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'

// 导出表格
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  props: {
    applyVisible: {
      type: Boolean,
      default: false
    },
    sessionId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: [],
      sessionName: ''
    }
  },
  watch: {
    applyVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      this.$loading()
      api.getApplyListBySessionId(this.sessionId).then(res => {
        this.tableData = res.data || []
        this.sessionName = this.tableData[0] && this.tableData[0].sessionTopic
        this.$loading().close()
      })
    },
    close () {
      this.tableData = []
      this.$emit('close')
    },
    // 定义导出Excel表格事件
    exportExcel () {
      if (!this.tableData.length) {
        this.$message({
          type: 'error',
          message: '无数据可导出！！！'
        })
        return
      }
      const fileName = this.sessionName + '_' + new Date().toLocaleDateString()
      console.log(fileName)
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#export_table')
      )
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          '课程[' + fileName + '].xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
