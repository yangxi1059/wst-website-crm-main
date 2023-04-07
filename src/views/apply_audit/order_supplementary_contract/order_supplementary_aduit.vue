<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'签约补充协议审核'"
      :visible.sync="orderSupplementaryAuditVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
        <el-col :span="6" class="_item-name">申请人</el-col>
        <el-col :span="6" class="_item-value">{{refundData.apply.createByName}}</el-col>
        <el-col :span="6" class="_item-name">申请状态</el-col>
        <el-col :span="6" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
        <el-col :span="24">
          <el-col :span="6" class="_item-name">申请时间</el-col>
          <el-col :span="18" class="_item-value">{{refundData.apply.createTime}}</el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="6" class="_item-name">订单详情</el-col>
          <el-col :span="18" class="_item-value">
            <a size="mini" v-if="refundData.apply.applyStatus == '2'" @click="viewOrderDeatil(refundData.apply.keyId)">{{refundData.apply.keyId}}</a>
            <a size="mini" v-else>{{refundData.apply.keyId}}</a>
          </el-col>
        </el-col>
      </el-row>
        <span v-if="refundData.content">
          <el-col :span="24" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col :span="6" class="_item-name">{{item.label}}</el-col>
            <el-col :span="18" class="_item-value">
              <span :title="item.value">{{item.value || '无'}}</span>
            </el-col>
          </el-col>
        </span>

      <el-row class="mb10" v-if="refundData.content">
        <span v-for="(item,i) in refundData.content.file" :key="i">
          <el-col :span="6" class="_item-name">凭证 {{++i}}</el-col>
          <el-col :span="18" class="_item-value">
            <el-button @click="download(item.url)" size="mini">查看</el-button>
          </el-col>
        </span>
      </el-row>

      <el-row class="mb10">
        <el-col :span="6" class="_item-name">审核人</el-col>
        <el-col :span="18" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="6" class="_item-name">抄送人</el-col>
        <el-col :span="18" class="_item-value">{{copyTo}}</el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
      </span>
    </el-dialog>
    <orderDetail
      :detailVisible="detailVisible"
      :orderId="orderId"
      @close="orderDetailClose"
    ></orderDetail>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import orderDetail from '../../sales/components/order_detail.vue'
import util from '@/libs/util'
export default {
  name: 'orderEntryAudit',
  components: { orderDetail },
  props: {
    applyData: {
      type: Object
    },
    orderSupplementaryAuditVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: []
      },
      USERINFO: util.sessions.get('userInfo'),
      approval: '',
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      detailVisible: false,
      orderId: ''
    }
  },
  computed: {},
  watch: {
    orderSupplementaryAuditVisible: function (newData, oldData) {
      if (newData) {
        this.pageInit()
      }
    }
  },
  mounted () {},
  methods: {
    pageInit () {
      console.log('applyData详情', this.applyData)
      api.getApplyDetailByApplyId(this.applyData.applyId).then((res) => {
        console.log('详情数据yx1111111111', res.data)
        this.refundData = {
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval
        }
        this.approval = ''
        let point = true
        res.data.approval.forEach((v) => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${
            v.approveTime || ''
          } ${v.msg || ''}</p>`
          if (point && v.approveStatus == 0) {
            if (v.approverId === this.USERINFO.userId || v.approverId.indexOf(this.USERINFO.userId) != '-1') {
              this.canSubmit = true
            }
            point = false
          }
        })
        this.copyTo = ''
        res.data.copyTo.forEach((v) => {
          this.copyTo += v.copyToName + '; '
        })
      })
    },
    // 关闭
    handleClose () {
      this.$emit('close')
      this.refundData = {
        apply: {},
        content: {},
        copyTo: [],
        approval: []
      }
      this.approval = ''
      this.copyTo = ''
      this.canSubmit = false
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
        content.text.push()
        const data = {
          applyId: this.refundData.apply.applyId,
          approveStatus: '1'
        }
        console.log(data, '提交审核的数据yx*******')
        api
          .setAuditRefund(data)
          .then((res) => {
            this.$message({
              message: '审核已通过，如需修改请点击订单号在订单详情中修改签约信息！！',
              type: 'success'
            })
            this.$emit('submit')
            this.pageInit()
            this.$loading().close()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '审核失败'
            })
            this.$loading().close()
            this.$emit('submit')
            this.pageInit()
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
          // let p = {
          //     label: "驳回理由",
          //     value: value
          //   }
          //   this.refundData.content.text.push(p)
          const data = {
            applyId: this.refundData.apply.applyId,
            // text: this.refundData.content.text,
            approveStatus: '2',
            msg: value
          }
          console.log(data, this.refundData.content.text)
          api
            .setAuditRefund(data)
            .then((res) => {
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
    viewOrderDeatil (orderId) {
      console.log(orderId)
      this.orderId = orderId
      this.detailVisible = true
    },
    orderDetailClose () {
      console.log('order detail close')
      this.detailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select .el-input {
    width: 130px;
  }
.el-input-group__prepend{
  width: 120px !important;
}
</style>
