<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="`${refundData.apply.applyTypeName}审核`"
      :visible.sync="documentReviewVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-form  size="mini" label-width="145px">
        <el-form-item label="申请人：">{{refundData.apply.createByName}}</el-form-item>
        <el-form-item label="申请状态：">{{refundData.apply.applyStatusName}}</el-form-item>
        <el-form-item label="申请时间：">{{refundData.apply.createTime}}</el-form-item>
        <el-form-item label="申请类型：">{{refundData.apply.applyTypeName}}</el-form-item>
        <el-form-item :label="item.label + '：'" v-for="(item,i) in refundData.content.text" :key="i">
          <div style="white-space: pre-wrap;word-wrap: break-word;">
            {{item.value}}
          </div>
        </el-form-item>
        <el-form-item label="审查文件：">
          <div v-for="(item,i) in refundData.content.file" :key="i">
            <div style="display:flex">
              <div style="flex:1">审查文件 {{++i}} - {{item.name}}</div>
              <div style="width:130px">
                <el-button @click="download(item.url)" size="mini">查看</el-button>
                <el-button @click="downloadD(item.url)" size="mini">下载</el-button>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="审核人：">
          <div  v-html="approval">{{}}</div>
        </el-form-item>
        <el-form-item label="抄送人：" v-if="copyTo">
          {{copyTo}}
        </el-form-item>
        <el-form-item label="审查文件：" v-if="applyData.applyStatus == '1'">
            <el-upload
                drag
                class="upload-demo"
                action
                ref="upload1"
                multiple
                :auto-upload="false"
                :file-list="fileList"
                :on-change="change"
                :on-remove="change"
                :style="{width:'200px'}"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-form-item>
      </el-form>
      <!-- <el-row class="mb10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="4" class="_item-name">抄送人</el-col>
        <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
      </el-row> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun, downloadFunD, uploadFunBySys } from '@/libs/file'
import util from '@/libs/util'

import api from '@/api/vip.js'
export default {
  name: 'brokerageAudit',
  props: {
    applyData: {
      type: Object
    },
    documentReviewVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      USERINFO: util.sessions.get('userInfo'),
      widths: '230px',
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      },
      fileList: [],
      approval: '',
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false
    }
  },
  watch: {
    documentReviewVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情', this.applyData)
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    Topage () {
      api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
        this.refundData = {
          pay: res.data.pay,
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval
        }
        console.log('详情数据', this.refundData)
        this.approval = ''
        let point = true
        res.data.approval.forEach(v => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime ||
            ''}</p>`
          if (point && v.approveStatus == 0) {
            if (v.approverId === this.USERINFO.userId || v.approverId.indexOf(this.USERINFO.userId) != '-1') {
              this.canSubmit = true
            }
            point = false
          }
        })
        this.copyTo = ''
        res.data.copyTo.forEach(v => {
          this.copyTo += v.copyToName + '; '
        })
      })
    },
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.$emit('close')
      this.fileList = []
      this.refundData = {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      }
      this.canSubmit = false
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    download (val) {
      downloadFun(val)
    },
    downloadD (path) {
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    // 确认
    submit () {
      this.$confirm('是否确认通过此审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          applyId: this.refundData.apply.applyId,
          approveStatus: '1',
          content: JSON.parse(JSON.stringify(this.refundData.content))
        }
        const num = this.refundData.content.file.length + this.fileList.length
        if (this.fileList.length) {
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            uploadFunBySys(file.raw, 'voucher/documentReview', url => {
              console.log(url)
              data.content.file.push({
                name: `[审核人上传]-${file.name}`,
                url: url
              })
              if (data.content.file.length === num) {
                this.toAudit(data)
              }
            })
          }
        } else {
          this.toAudit(data)
        }
      })
    },
    toAudit (data) {
      console.log(data)
      api
        .setAuditRefund(data)
        .then(res => {
          this.$message({
            message: '审核通过',
            type: 'success'
          })
          this.$emit('submit')
          this.$loading().close()
          this.handleClose()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '审核失败'
          })
          this.$loading().close()
          this.$emit('submit')
          this.handleClose()
        })
    },
    // 驳回
    reject () {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '驳回理由字数需在1~200个字符'
      })
        .then(({ value }) => {
          this.$loading({ background: 'rgba(0,0,0,.5)' })
          const data = {
            applyId: this.refundData.apply.applyId,
            approveStatus: '2',
            msg: value
          }
          api
            .setAuditRefund(data)
            .then(res => {
              this.$message({
                message: '驳回成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.handleClose()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '驳回失败'
              })
              this.$loading().close()
              this.$emit('submit')
              this.handleClose()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消驳回'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
