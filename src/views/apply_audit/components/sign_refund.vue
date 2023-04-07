<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'订单退款'"
      :visible.sync="signRefundVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
        <el-col :span="3" class="_item-name">申请人</el-col>
        <el-col :span="5" class="_item-value">{{refundData.apply.createByName}}</el-col>
        <el-col :span="3" class="_item-name">申请状态</el-col>
        <el-col :span="5" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
        <el-col :span="3" class="_item-name">申请时间</el-col>
        <el-col :span="5" class="_item-value">{{refundData.apply.createTime}}</el-col>
      </el-row>

      <el-row class="mb10" v-if="refundData.content">
        <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
          <el-col style="flex:3" class="_item-name">{{item.label}}</el-col>
          <el-col style="flex:21" class="_item-value">
            <span :title="item.value">{{item.value || '无'}}</span>
          </el-col>
        </div>
      </el-row>
      <el-row class="mb10" v-if="refundData.content">
        <span v-for="(item,i) in refundData.content.file" :key="i">
          <el-col :span="3" class="_item-name">凭证 {{++i}}</el-col>
          <el-col :span="5" class="_item-value">
            <el-button @click="download(item.url)" size="mini">查看</el-button>
          </el-col>
        </span>
      </el-row>
      <el-row class="mb10">
        <el-col :span="3" class="_item-name">审核人</el-col>
        <el-col :span="21" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="3" class="_item-name">抄送人</el-col>
        <el-col :span="21" class="_item-value">{{copyTo}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="refundData.pay">
        <el-col :span="4" class="_item-name">出账账户</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.paymentAccountName">{{refundData.pay.paymentAccountName}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">实际支付金额</el-col>
        <el-col :span="4" class="_item-value">
          <span
            :title="refundData.pay.payAmount"
          >{{refundData.pay.payTypeName}}：{{refundData.pay.payAmount}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">手续费</el-col>
        <el-col :span="4" class="_item-value">
          <span
            :title="refundData.pay.commissionAmount"
          >{{refundData.pay.payTypeName}}：{{refundData.pay.commissionAmount}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">手续费说明</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.commissionFor">{{refundData.pay.commissionFor||'无'}}</span>
        </el-col>
        <span v-if="refundData.pay.payVoucher">
          <el-col :span="4" class="_item-name">支付凭证</el-col>
          <el-col :span="4" class="_item-value">
            <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
          </el-col>
        </span>
        <el-col :span="4" class="_item-name">支付备注</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.payRemark">{{refundData.pay.payRemark}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">支付日期</el-col>
        <el-col :span="4" class="_item-value">
          <span :title="refundData.pay.payDate">{{refundData.pay.payDate}}</span>
        </el-col>
      </el-row>
      <el-row class="mb10"  v-if="refundData.pay">
        <el-col :span="3" class="_item-name" v-if="refundData.pay && refundData.pay.errorStatus == 1" style="color:red;fontWeight:600">支付异常原因</el-col>
        <el-col :span="20" class="_item-value" v-if="refundData.pay && refundData.pay.errorReason" style="color:red;fontWeight:600">
          <span :title="refundData.pay.errorReason" >{{refundData.pay.errorReason}}</span>
        </el-col>
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
    signRefundVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      USERINFO: util.sessions.get('userInfo'),
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        approverid: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {},
        vipArr: []
      },
      copyTo: '',
      approval: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      otherData: false,
      salesCommissionFlag: 0,
      radio: ''
    }
  },
  watch: {
    signRefundVisible: function (newData, oldData) {
      if (newData) {
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
          console.log('详情数据', res.data, JSON.parse(res.data.apply.content))
          this.refundData = {
            apply: res.data.apply,
            content: JSON.parse(res.data.apply.content),
            pay: res.data.pay,
            copyTo: res.data.copyTo,
            approval: res.data.approval,
            vipArr: res.data.vipArr
          }
          this.approval = ''
          let point = true
          if (this.refundData.content.info.vipId) {
            this.radio = this.refundData.content.info.vipId
          } else {
            this.radio = ''
          }
          this.otherData = res.data.approval[0].approveStatus == 0
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''} ${v.msg || ''}</p>`
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
        }).catch(err => {
          this.$message.error(err)
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
        approval: [],
        pay: {},
        vipArr: []
      }
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
        const content = this.refundData.content
        // const salesCommissionFlag = ['否', '是']
        // let str = ''
        // for (let i = 0; i < this.refundData.vipArr.length; i++) {
        //   if (this.radio == this.refundData.vipArr[i].userId) {
        //     str = this.refundData.vipArr[i].userName
        //   }
        // }
        // if (this.otherData) {
        //   content.text.push({
        //     label: '扣除Sales绩效',
        //     value: salesCommissionFlag[this.salesCommissionFlag]
        //   })
        //   content.text.push({
        //     label: '扣除VIP绩效',
        //     value: str || '不扣'
        //   })
        //   content.info.salesCommissionFlag = this.salesCommissionFlag
        //   content.info.vipId = this.radio
        // }
        const data = {
          applyId: this.refundData.apply.applyId,
          approveStatus: '1',
          content: content
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
            this.$loading().close()
            this.$emit('submit')
            this.handleClose()
          })
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
