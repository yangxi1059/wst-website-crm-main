<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'返佣申请'"
      :visible.sync="brokerageDetailVisible"
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
      <el-row class="mb10" v-if="refundData.content">
        <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
          <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
          <el-col style="flex:20" class="_item-value">
            <span :title="item.value">{{item.value || '无'}}</span>
          </el-col>
        </div>
      </el-row>
      <el-row class="mb10" v-if="refundData.content">
        <span v-for="(item,i) in refundData.content.file" :key="i">
          <el-col :span="4" class="_item-name">凭证 {{++i}}</el-col>
          <el-col :span="4" class="_item-value">
            <el-button @click="download(item.url)" size="mini">查看</el-button>
          </el-col>
        </span>
      </el-row>
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="4" class="_item-name">抄送人</el-col>
        <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
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
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
export default {
  name: 'brokerageAudit',
  props: {
    applyData: {
      type: Object
    },
    brokerageDetailVisible: {
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
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝']
    }
  },
  watch: {
    brokerageDetailVisible: function (newData, oldData) {
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
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
