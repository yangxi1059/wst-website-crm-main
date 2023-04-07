<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'offer申请'"
      :visible.sync="signOfferVisible"
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
        <el-col :span="4" class="_item-name">凭证</el-col>
        <el-col :span="4" class="_item-value">
          <el-button @click="download(refundData.content.file[0].url)" size="mini">查看</el-button>
        </el-col>
        <el-col :span="4" class="_item-name">好评图</el-col>
        <el-col :span="4" class="_item-value">
          <el-button @click="download(refundData.content.file[1].url)" size="mini">查看</el-button>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval"></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
export default {
  name: 'signRefund',
  props: {
    applyData: {
      type: Object
    },
    signOfferVisible: {
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
        approval: []
      },
      approval: '',
      account: '',
      totalRefund: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝']
    }
  },
  watch: {
    signOfferVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情 yx ****44', this.applyData)
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
          console.log('详情数据', JSON.parse(res.data.apply.content))
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
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${v.approverName} - <span class='${this.Myclass[v.approveStatus]} mb10'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime || ''}</p>`
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
    },
    download (val) {
      downloadFun(val)
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
