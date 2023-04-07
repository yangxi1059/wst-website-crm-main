<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'offer审核'"
      :visible.sync="offerVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-descriptions title="" size="medium" :column='2'>
          <el-descriptions-item label="申请人">{{refundData.apply.createBy}}</el-descriptions-item>
          <el-descriptions-item label="申请状态">{{applyStatus[refundData.apply.applyStatus]}}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{refundData.apply.createTime}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" v-if="refundData.content" size="medium" :column='2'>
          <el-descriptions-item :label="item.label" v-for="(item,i) in refundData.content.text" :key="i">{{item.value || '无'}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" v-if="refundData.content" size="medium" :column='2'>
          <el-descriptions-item :label="item.name" v-for="(item,i) in refundData.content.file" :key="i">
            <el-button @click="download(item.url)" size="mini">查看</el-button>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="好评图">
            <el-button @click="download(refundData.content.file[1].url)" size="mini">查看</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="学生通知截图" v-if="refundData.content.file && refundData.content.file[2]">
            <el-button @click="download(refundData.content.file[2].url)" size="mini">查看</el-button>
          </el-descriptions-item> -->
      </el-descriptions>
      <el-descriptions class="mt10" title=""  size="medium" :column='2'>
          <el-descriptions-item label="审核人">
            <span  class="" v-html="approval"></span>
          </el-descriptions-item>
      </el-descriptions>
      <el-row class="mb10" v-if="canSubmit && refundData.apply.applyStatus == 1">
        <el-input type="textarea" :autosize="{minRows:2}" v-model="rejectMsg" placeholder="驳回时，在此处添加驳回理由"></el-input>
      </el-row>
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
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import util from '@/libs/util.js'

export default {
  name: 'signRefund',
  props: {
    applyData: {
      type: Object
    },
    offerVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      applyStatus: [
        '待申请',
        '申请中',
        '通过',
        '拒绝',
        '未支付',
        '已支付',
        '已取消'
      ],
      widths: '230px',
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        approverid: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: []
      },
      approval: '',
      account: '',
      totalRefund: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      rejectMsg: ''
    }
  },
  watch: {
    offerVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情', this.applyData)
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
          console.log('详情数据', res)
          this.refundData = {
            apply: res.data.apply,
            content: JSON.parse(res.data.apply.content),
            copyTo: res.data.copyTo,
            approval: res.data.approval
          }
          this.account = this.refundData.content.info.account
          this.totalRefund =
            this.refundData.content.info.currencyType +
            this.refundData.content.info.totalRefund
          this.approval = ''
          let point = true
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
            if (point && v.approveStatus == 0) {
              if (v.approverId === util.sessions.get('userInfo').userId || v.approverId.indexOf(util.sessions.get('userInfo').userId) != '-1') {
                this.canSubmit = true
              }
              point = false
            }
          })
        })
      }
    }
  },
  mounted () {},
  methods: {
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.$emit('close')
      this.refundData = {
        apply: {},
        content: {},
        copyTo: [],
        approval: []
      }
      this.canSubmit = false
      this.rejectMsg = ''
    },
    download (val) {
      downloadFun(val)
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
          approveStatus: '1'
        }
        console.log(data)
        api
          .setAuditRefund(data)
          .then(res => {
            console.log('审核导师酬金申请', res)
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
            this.$emit('submit')
            this.$loading().close()
            this.handleClose()
          })
      })
    },
    // 驳回
    reject () {
      // this.$prompt("请输入驳回理由", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //    inputPattern: /^.{1,200}$/,
      //   inputErrorMessage: "驳回理由字数需在1~200个字符"
      // })
      //   .then(({ value }) => {
      if (this.rejectMsg.length < 1) {
        this.$message({
          type: 'error',
          message: '驳回理由不可为空！'
        })
        return
      }
      this.$loading({ background: 'rgba(0,0,0,.5)' })
      const data = {
        applyId: this.refundData.apply.applyId,
        approveStatus: '2',
        msg: this.rejectMsg
      }
      console.log(data)
      api
        .setAuditRefund(data)
        .then(res => {
          console.log('审核导师酬金申请', res)
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
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "取消驳回"
      //   });
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
