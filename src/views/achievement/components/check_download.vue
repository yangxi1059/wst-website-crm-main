<!--
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 14:00:14
 * @Version:
 * @Description:
-->
<!--
 * @Author: 库建华
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: 库建华
 * @LastEditTime: 2020-04-21 17:07:45
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="`下载情况`"
      :visible.sync="downLoadVisible"
      width="900px"
      :before-close="close"
    >
        <el-table
          stripe
          :data="consultingData"
          v-loading = "pictLoading"
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
          <el-table-column
            label="下载人"
            prop="downloadByName"
          >
          </el-table-column>
          <el-table-column
            label="下载时间"
            prop="downloadTime"
          >
          </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
export default {
  props: {
    downLoadVisible: {
      type: Boolean,
      default: false
    },
    downLoadData: {
      type: Object
    }
  },
  data () {
    return {
      pictLoading: false,
      consultingData: []
    }
  },
  watch: {
    downLoadVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      this.pictLoading = true
      if (this.downLoadData.downloadType) {
        const data = {
          keyId: this.downLoadData.pkId,
          downloadType: this.downLoadData.downloadType,
          contentType: this.downLoadData.contentType
        }
        console.log(data)
        apiDic.getDownLoad(data).then(res => {
          this.consultingData = res.data
          this.pictLoading = false
        })
      } else {
        const data = { schoolId: this.downLoadData.schoolId }
        apiDic.getMenteeDownLoad(data).then(res => {
          this.consultingData = res.data
          this.pictLoading = false
        })
      }
    },
    close () {
      this.$emit('close')
      this.consultingData = []
      this.pictLoading = false
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
