<!--
 * @Author: kaan
 * @Date: 2021-09-07 15:16:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 17:06:55
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="container">
      <div class="mb10">
        <el-tag type="warning" size="medium" class="mr10" >未完成课时: {{totalSessionsRemaining}}</el-tag>
        <el-tag type="danger"  size="medium">未完成课时费用: ￥{{totalSessionsRemainingFee}}</el-tag>
      </div>
      <div class="search">
        <el-button
          v-if="roleInfo.includes('cost_mentor_downExecl')"
          icon="el-icon-download"
          class="mr10"
          style="margin:0 10px 0 0"
          size="small"
          type="success"
          @click="exportFile2()"
        >导出</el-button>
      </div>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/cost'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import util from '@/libs/util'

export default {
  name: 'intership_list',
  mixins: [mixins],
  computed:{
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      totalSessionsRemaining: '',
      totalSessionsRemainingFee: '',
      loading: false
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      const data = {}
      this.loading = true
      api.getJerryLessonData(data).then(res => {
        this.loading = false
        console.log('getJerryLessonData', res)
        this.totalSessionsRemaining = res.data.totalSessionsRemaining
        this.totalSessionsRemainingFee = res.data.totalSessionsRemainingFee
      })
    },
    exportFile () { // 导出
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      const fileName = '行业导师成本一览_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename: fileName + '[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    },
    exportFile2 () {
      const fileName = '行业导师成本一览'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}sign/export/jerryLessonData`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      this.$message({
        type: 'success',
        message: '正在创建导出'
      })
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.xlsx' // 如123.xlsx
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
    }

  }
}
</script>
