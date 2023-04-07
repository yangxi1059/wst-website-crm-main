<!--
 * @Author: 库建华
 * @Date: 2020-05-13 16:58:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-15 17:55:02
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" v-loading="loading" title="" :visible.sync="invitationVisible" width="1400px" :before-close="close">
      <div class="search_page">
        <div class="search">
          <el-button @click="addInvitation" type="primary" size="small">生成邀请码</el-button>
          <el-button @click="exportExcel" type="danger" size="small">导出</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table  :data="tableData" size="mini" highlight-current-row id="export_table222">
        <el-table-column align="center" prop="codeId" label="邀请码"></el-table-column>
        <el-table-column align="center" prop="seminarName" label="线下课名称"></el-table-column>
        <el-table-column align="center" prop="sessionTopic" label="订阅课程"></el-table-column>
        <el-table-column align="center" prop="subscribeTime" label="订阅时间"></el-table-column>
        <el-table-column align="center" prop="codeId" label="微信头像">
          <template slot-scope="scope">
            <div>
              <div v-show="false">{{scope.row.headImage}}</div>
              <el-avatar :size="20" :src="scope.row.headImage" ></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nickName" label="微信昵称"></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer ">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import util from '@/libs/util'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  props: {
    invitationVisible: {
      type: Boolean,
      default: false
    },
    seminarId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: [],
      sessionName: '',
      loading: false,
      total: 0,
      pageNum: 1,
      pageSize: 400,
      sort: '',
      sortCol: ''
    }
  },
  watch: {
    invitationVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      this.loading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        seminarId: this.seminarId,
        sortCol: this.sortCol,
        sort: this.sort
      }
      api.getInvitationCodeList(data).then(res => {
        console.log(res.data)
        this.tableData = res.data.rows || []
        this.total = res.data.total
        this.loading = false
      })
    },
    close () {
      this.tableData = []
      this.$emit('close')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    addInvitation () {
      this.$prompt('请输入新增邀请码的数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9][0-9]*$/,
        inputErrorMessage: '需为大于0的正整数'
      }).then(({ value }) => {
        if (!value) {
          this.$message({
            message: '不可为空 或者 0',
            type: 'error'
          })
          return false
        }
        this.$loading()
        const data = {
          count: value,
          seminarId: this.seminarId
        }
        this.exportFile(value)
        // api.addInvitationCode(data).then(res => {
        //   const fileName = `邀请码${this.seminarId}_${util.guid()}.zip`
        //   const blob = new Blob([res], { type: 'text/html' })
        //   var a = document.createElement('a')
        //   console.log(blob)
        //   var url = URL.createObjectURL(blob)
        //   a.href = url
        //   a.download = fileName
        //   a.click()
        //   // 释放之前创建的URL对象
        //   window.URL.revokeObjectURL(url)
        //   this.$message.success('新增成功，开始下载压缩包！！')
        //   this.$loading().close()
        //   this.Topage()
        // }).catch(err => {
        //   console.log(err)
        //   this.$message.error(err.message)
        //   this.$loading().close()
        //   this.Topage()
        // })
      })
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
      const fileName = this.seminarId + '_' + new Date().toLocaleDateString()
      console.log(fileName)
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#export_table222')
      )
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          '邀请码[' + fileName + '].xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    exportFile (value) {
      const fileName = `邀请码${this.seminarId}_${util.guid()}.zip`
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open('POST', `${this.$apiUrl}seminar/invitationCode/batch`, true)
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          console.log(blob)
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = fileName
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      // 发送请求
      xhr.send(JSON.stringify({
        count: value,
        seminarId: this.seminarId
      }))
      this.$message.success('新增成功，开始下载压缩包！！')
      this.$loading().close()
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
