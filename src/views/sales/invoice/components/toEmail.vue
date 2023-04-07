<!--
 * @Author: 库建华
 * @Date: 2020-06-09 14:45:00
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-14 17:16:25
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog  :visible.sync="toEmailVisible" width="700px" :before-close="close">
      <el-tabs v-loading="loading" v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="电子发票凭证" name="first">
          <div v-for="(item,i) in emailList" :key="item.pkId">
          <div class="block_yx_emailList mb10">
            <el-button type="text" class="mr10" @click="toShow(item.voucherPath)">{{item.voucherName}}</el-button>
            <!-- <div class="email_name mr20">{{item.voucherName}}</div> -->
             <el-button type="danger" @click="deleteEmail(item)" icon="el-icon-circle-close" circle></el-button>
          </div>
        </div>
        <div>
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :style="{width:'200px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>点击、拖拽上传</el-button>
          </el-upload>
        </div>
        <div>
          <el-button type="primary" @click="sendEmail()">发送邮箱</el-button>
        </div>
        </el-tab-pane>
        <el-tab-pane label="发送历史" name="second">
          <div class="mb10" v-for="(item,i) in emailHistoryList" :key="i">
            <el-descriptions  direction="vertical" :column="2" border>
              <el-descriptions-item label="操作人">{{item.createByName}}</el-descriptions-item>
              <el-descriptions-item label="发件时间">{{item.createTime}}</el-descriptions-item>
              <el-descriptions-item :span="2" label="邮箱">{{item.email}}</el-descriptions-item>
              <el-descriptions-item :span="2" label="凭证">
                <el-button type="text" class="mr10" v-for="(detail,i) in item.voucherArr" :key="i" @click="toShow(detail.voucherPath)">{{detail.voucherName}}</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/sales_assistant.js'
import mixins from '@/plugin/mixins'
import { uploadFunBySys, downloadFun } from '@/libs/file'

export default {
  name: 'invoice-detail',
  mixins: [mixins],
  props: {
    toEmailVisible: {
      type: Boolean,
      default: false
    },
    emailData: {}
  },
  data () {
    return {
      loading: false,
      emailList: [],
      activeName: 'first',
      fileList: [],
      emailHistoryList: []
    }
  },
  mounted () {
  },
  watch: {
    toEmailVisible: function (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      api.getOrderSendHis(this.emailData.orderId).then(res => {
        console.log(res.data)
        this.emailList = res.data
        this.loading = false
      })
    },
    init2 () {
      api.sendEmailHistory(this.emailData.orderId).then(res => {
        this.emailHistoryList = res.data
      })
    },
    close () {
      this.activeName = 'first'
      this.$emit('close')
    },
    handleClick (tab, event) {
      if (tab.name == 'first') {
        this.init()
      } else {
        this.init2()
      }
    },
    toShow (val) {
      downloadFun(val)
    },
    sendEmail () {
      const str = this.emailData.recipientEmail || ''
      if (str) {
        this.$confirm(`确认往【${this.emailData.recipientEmail}】发送电子发票?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            email: str,
            invoiceId: this.emailData.invoiceId
          }
          api.sendEmail(data).then(res => {
            if (res.code == '200') {
              this.$message.success('发送成功！！')
              this.$emit('submit')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      } else {
        this.$message.error('暂无邮箱！！')
      }
    },
    change (file, fileList) {
      this.fileList = fileList.slice(-1)
      console.log(fileList)
      uploadFunBySys(
        file.raw,
        `voucher/invoice/${this.emailData.orderId}_`,
        url => {
          const data = {}
          data.orderId = this.emailData.orderId
          data.voucherName = file.name
          data.voucherPath = url
          api.uploadEmail(data).then(res => {
            this.fileList = []
            this.$message.success('上传成功！！')
            this.init()
          })
          console.log('凭证参数', data)
        }
      )
    },
    deleteEmail (data) {
      console.log(data)
      this.$confirm('此操作将永久删除该凭证, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delOrderSendHis(data.pkId).then(res => {
          this.$message.success('删除成功！！')
          this.init()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.block_yx_emailList{
  display: flex;
}
.email_name{
  line-height: 28px;
  font-size: 14px;
}
</style>
