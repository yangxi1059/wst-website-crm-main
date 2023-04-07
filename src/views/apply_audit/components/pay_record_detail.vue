<!--
 * @Author: 库建华
 * @Date: 2019-09-29 15:50:14
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 10:50:23
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'支付记录'"
      :visible.sync="payRecordDetailVisible"
      width="1000px"
      :before-close="handleClose"
    >
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
      <el-row class="mb10" v-if="refundData.pay && refundData.pay.payVoucher">
        <el-col :span="4" class="_item-name">支付凭证</el-col>
        <el-col :span="4" class="_item-value">
          <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
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
    payRecordDetailVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      refundData: {
        content: {},
        pay: {}
      }
    }
  },
  watch: {
    payRecordDetailVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情', this.applyData)
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
          console.log('详情数据', res)
          this.refundData.content = JSON.parse(res.data.apply.content)
          this.refundData.pay = res.data.pay
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
        content: {},
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
