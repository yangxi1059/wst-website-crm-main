<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'合作商合同金额审核'"
      :visible.sync="recommendVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">申请人</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createByName}}</el-col>
        <el-col :span="4" class="_item-name">申请状态</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
        <el-col :span="4" class="_item-name">申请时间</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createTime}}</el-col>
      </el-row>
      <el-card>
        <el-row class="mb10" v-if="refundData.content">
          <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
            <el-col style="flex:20" class="_item-value">
              <span :title="item.value">{{item.value || '无'}}</span>
            </el-col>
          </div>
        </el-row>
        <el-row class="mb10" v-if="refundData.content">
          <div>
            <el-col :span="6" class="_item-name">文件</el-col>
            <el-col :span="16" class="_item-value">
              <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
                <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>

                <el-button
                  @click="downloadD(item.url)"
                  size="mini"
                  v-if="roleInfo.includes('bd_audit_bd_contractAmount_download')"
                  title="下载"
                  type="text"
                  icon="el-icon-download"
                ></el-button>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-card>

      <el-row class="mb10">
        <el-col :span="6" class="_item-name">审核人</el-col>
        <el-col :span="16" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="6" class="_item-name">抄送人</el-col>
        <el-col :span="16" class="_item-value">{{copyTo}}</el-col>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="applyList">历史申请</el-button>
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
      </span>
    </el-dialog>
    <applyList
      :contractData="contractData"
      :applyListVisible="applyListVisible"
      @close="applyListClose"
    />
  </div>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file'
import util from '@/libs/util'
import api from '@/api/vip.js'
import { mapState } from 'vuex'

import applyList from '../../BD/components/apply_list.vue'

export default {
  name: 'brokerageAudit',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { applyList },
  props: {
    applyData: {
      type: Object
    },
    recommendVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        approverid: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      },
      approval: '',
      copyTo: '',
      USERINFO: util.sessions.get('userInfo'),
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      applyListVisible: false,
      contractData: {}
    }
  },
  watch: {
    recommendVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情', this.applyData)
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
          console.log('详情数据', res)
          this.refundData = {
            pay: res.data.pay,
            apply: res.data.apply,
            content: JSON.parse(res.data.apply.content),
            copyTo: res.data.copyTo,
            approval: res.data.approval
          }
          this.approval = ''
          let point = true
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
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
        pay: {}
      }
    },
    download (val) {
      downloadFun(val)
    },
    downloadD (path) {
      console.log(path)
      downloadFunD(path, (url) => {
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
            // if (res.data == "待支付") {
            //   this.$emit("submitToPay");
            // } else {
            //   }
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
    },
    applyList () {
      console.log(this.refundData.content.info.contractId)
      this.contractData = {
        contractId: this.refundData.content.info.contractId
      }
      this.applyListVisible = true
    },
    applyListClose () {
      this.applyListVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
