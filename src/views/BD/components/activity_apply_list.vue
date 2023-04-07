<!--
 * @Author: 库建华
 * @Date: 2020-06-23 13:26:23
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 10:58:31
 * @Version: 1
 * @Description:
-->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false" 
      :title="'活动经费申请'"
      :visible.sync="applyListVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-card class="mb20" v-for="(itemData,ii) in listData" :key="ii">
        <el-row class="mb10">
          <el-col :span="4" class="_item-name">申请人</el-col>
          <el-col :span="4" class="_item-value">{{itemData.refundData.apply.createByName}}</el-col>
          <el-col :span="4" class="_item-name">申请状态</el-col>
          <el-col :span="4" class="_item-value">{{itemData.refundData.apply.applyStatusName}}</el-col>
          <el-col :span="4" class="_item-name">申请时间</el-col>
          <el-col :span="4" class="_item-value">{{itemData.refundData.apply.createTime}}</el-col>
        </el-row>
        <span v-if="itemData.refundData.content">
          <el-row class="mb10" v-for="(item,i) in itemData.refundData.content.text" :key="i">
            <el-col :span="4" class="_item-name">{{item.label}}</el-col>
            <el-col :span="20" class="_item-value">
              <span :title="item.value">{{item.value}}</span>
            </el-col>
          </el-row>
        </span>
        <!-- <el-row class="mb10" v-if="itemData.refundData.content">
          <span v-for="(item,i) in itemData.refundData.content.file" :key="i">
            <el-col :span="4" class="_item-name">合同</el-col>
            <el-col :span="4" class="_item-value">
              <el-button @click="download(item.url)" size="mini">查看</el-button>
            </el-col>
          </span>
        </el-row> -->
        <el-row class="mb10">
          <el-col :span="4" class="_item-name">审核人</el-col>
          <el-col :span="20" class="_item-value" v-html="itemData.approval">{{}}</el-col>
        </el-row>
        <el-row class="mb10" v-if="itemData.copyTo">
          <el-col :span="4" class="_item-name">抄送人</el-col>
          <el-col :span="20" class="_item-value">{{itemData.copyTo}}</el-col>
        </el-row>
        <el-row class="mb10" v-if="itemData.refundData.pay">
          <el-col :span="4" class="_item-name">出账账户</el-col>
          <el-col :span="4" class="_item-value">
            <span
              :title="itemData.refundData.pay.paymentAccountName"
            >{{itemData.refundData.pay.paymentAccountName}}</span>
          </el-col>
          <el-col :span="4" class="_item-name">实际支付金额</el-col>
          <el-col :span="4" class="_item-value">
            <span
              :title="itemData.refundData.pay.payAmount"
            >{{itemData.refundData.pay.payTypeName}}：{{itemData.refundData.pay.payAmount}}</span>
          </el-col>
          <el-col :span="4" class="_item-name">手续费</el-col>
          <el-col :span="4" class="_item-value">
            <span
              :title="itemData.refundData.pay.commissionAmount"
            >{{itemData.refundData.pay.payTypeName}}：{{itemData.refundData.pay.commissionAmount}}</span>
          </el-col>
          <el-col :span="4" class="_item-name">手续费说明</el-col>
          <el-col :span="4" class="_item-value">
            <span
              :title="itemData.refundData.pay.commissionFor"
            >{{itemData.refundData.pay.commissionFor||'无'}}</span>
          </el-col>
          <span v-if="itemData.refundData.pay.payVoucher">
            <el-col :span="4" class="_item-name">支付凭证</el-col>
            <el-col :span="4" class="_item-value">
              <el-button @click="download(itemData.refundData.pay.payVoucher)" size="mini">查看</el-button>
            </el-col>
          </span>
          <el-col :span="4" class="_item-name">支付备注</el-col>
          <el-col :span="4" class="_item-value">
            <span :title="itemData.refundData.pay.payRemark">{{itemData.refundData.pay.payRemark}}</span>
          </el-col>
          <el-col :span="4" class="_item-name">支付日期</el-col>
          <el-col :span="4" class="_item-value">
            <span :title="itemData.refundData.pay.payDate">{{itemData.refundData.pay.payDate}}</span>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/bd.js'
export default {
  name: 'applyList',
  props: {
    activityData: {
      type: Object
    },
    applyListVisible: {
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
      listData: [
        {
          refundData: {
            apply: {},
            content: {},
            copyTo: [],
            approval: [],
            pay: {}
          },
          approval: '',
          copyTo: '',
          account: '',
          totalRefund: ''
        }
      ],

      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝']
    }
  },
  watch: {
    applyListVisible: function (newData) {
      if (newData) {
        this.$loading()
        api.getActivityPayApplyListByActivityId(this.activityData.activityId).then(res => {
          console.log('详情数据', res)
          if (!res.data || !res.data.length) {
            this.$message({
              type: 'warning',
              message: '暂无申请'
            })
            this.$emit('close')
            this.$loading().close()
            return
          }
          for (let i = 0; i < res.data.length; i++) {
            const v = res.data[i]
            const refundData = {
              pay: v.pay,
              apply: v.apply,
              content: JSON.parse(v.apply.content),
              copyTo: v.copyTo,
              approval: v.approval
            }
            const account = refundData.content.info.payAccount
            const totalRefund =
              refundData.content.info.fundType +
              refundData.content.info.fundWage
            let approval = ''
            v.approval.forEach(v => {
              approval += `<p class='mb10'>${v.approverName} - <span class='${
                this.Myclass[v.approveStatus]
              }'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime ||
                ''}</p>`
            })
            let copyTo = ''
            v.copyTo.forEach(v => {
              copyTo += v.copyToName + '; '
            })
            this.listData.push({
              refundData: refundData,
              account: account,
              totalRefund: totalRefund,
              approval: approval,
              copyTo: copyTo
            })
          }
          this.listData.shift()
          this.$loading().close()
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
      this.listData = [
        {
          refundData: {
            apply: {},
            content: {},
            copyTo: [],
            approval: [],
            pay: {}
          },
          approval: '',
          copyTo: '',
          account: '',
          totalRefund: ''
        }
      ]
    },
    download (val) {
      downloadFun(val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
