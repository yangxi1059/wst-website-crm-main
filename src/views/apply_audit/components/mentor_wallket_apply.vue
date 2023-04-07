<!--
 * @Author: kaan
 * @Date: 2021-05-26 16:56:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-17 15:08:46
 * @Version:
 * @Description:
-->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'钱包提现审核'"
      :visible.sync="commMentorWithdrawalVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-descriptions title="" size="medium" :column='2'>
          <el-descriptions-item label="申请人">{{refundData.apply.createByName}}</el-descriptions-item>
          <el-descriptions-item label="申请状态">{{refundData.apply.applyStatusName}}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{refundData.apply.createTime}}</el-descriptions-item>
      </el-descriptions>
      <el-card>
        <el-row class="mb10" v-if="refundData.content">
          <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
            <el-col style="flex:20" class="_item-value">
              <span :title="item.value">{{item.value || '无'}}</span>
            </el-col>
          </div>
        </el-row>
        <el-card class="mb10" v-if="applyData && applyData.applyType == 'interviewee_info' && interviewStatus">
            <el-table
              v-if="interviewStatus"
              :data="refundData.content.info.intervieweeArr"
              size="mini"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column prop="sort" align="center"   label="面试轮次" min-width="20"></el-table-column>
              <el-table-column prop="interviewerName" align="center"   label="面试人" min-width="20"></el-table-column>
              <el-table-column prop="interviewTime" align="center"   label="面试时间" min-width="20"></el-table-column>

            </el-table>
        </el-card>
        <el-row class="mb10" v-if="refundData.content.file && refundData.content.file.length > 0 ">
          <div>
            <el-col :span="6" class="_item-name">文件</el-col>
            <el-col :span="16" class="_item-value">
              <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
                <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-card>
      <el-form ref="mentorList" label-width="130px" class="mt10" :model="refundData.content.info" size="mini" :rules="rules"  v-if="feeAmountStatus">
        <!-- <el-form-item label="金额类型：" prop="fundType">
          <el-select
            v-model="refundData.content.info.fundType"
            size="mini"
            placeholder="请选择"
            @change="feeInCny"
          >
            <el-option
              v-for="(item) in [{id:'cny',value:'人民币'},{id:'usd',value:'美金'}]"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现金额：" prop="fundWage">
          <el-input
            size="mini"
            :style="{width:'185px'}"
            v-model="refundData.content.info.fundWage"
            placeholder="请输入"
            @change="feeInCny"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="汇率：" prop="rate">
          <el-input
            size="mini"
            :style="{width:'185px'}"
            v-model="refundData.content.info.rate"
            placeholder="请输入"
            @change="feeInCny"
          ></el-input>
            :disabled="fundType"
        </el-form-item> -->
        <!-- <el-form-item label="等值人民币：" prop="feeInCny">
          <el-input
            size="mini"
            :style="{width:'185px'}"
            v-model="refundData.content.info.feeInCny"
            placeholder="请输入汇率自动计算"
            disabled
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="是否提现：" prop="isPay">
          <el-select
            v-model="refundData.content.info.isPay"
            size="mini"
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="(item) in [{id:'0',value:'否'},{id:'1',value:'是'}]"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="提现支付方式："   prop="payType">
          <el-select
            v-model="refundData.content.info.payType"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in payWayList"
              :key="item.accountId"
              :label="item.paymentTypeName + ':' + item.payAcc"
              :value="item.accountId "
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-descriptions class="mt10" title=""  size="medium" :column='2'>
          <el-descriptions-item label="审核人">
            <span  class="" v-html="approval"></span>
          </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mb10" v-if="copyTo" title=""  size="medium" :column='2'>
          <el-descriptions-item label="抄送人">
            <span  class="" >{{copyTo}}</span>
          </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mb10" v-if="refundData.pay" title=""  size="medium" :column='2'>
          <el-descriptions-item label="出账账户">
            <span :title="refundData.pay.paymentAccountName">{{refundData.pay.paymentAccountName}}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实际支付金额">
            <span :title="refundData.pay.payAmount">{{refundData.pay.payTypeName}}：{{refundData.pay.payAmount}}</span>
          </el-descriptions-item>
          <el-descriptions-item label="手续费">
            <span :title="refundData.pay.commissionAmount">{{refundData.pay.payTypeName}}：{{refundData.pay.commissionAmount}}</span>
          </el-descriptions-item>
          <el-descriptions-item label="手续费说明">
            <span :title="refundData.pay.commissionFor">{{refundData.pay.commissionFor||'无'}}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付凭证">
            <el-button @click="download(refundData.pay.payVoucher)" size="mini">查看</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="支付备注">
            <span :title="refundData.pay.payRemark">{{refundData.pay.payRemark}}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付日期">
            <span :title="refundData.pay.payDate">{{refundData.pay.payDate}}</span>
          </el-descriptions-item>
      </el-descriptions>

      <el-descriptions class="mb10" title=""  size="medium" :column='2'>
        <el-descriptions-item v-if="refundData.pay && refundData.pay.errorReason" label="支付异常原因">
          <span style="color:red;fontWeight:600">{{refundData.pay.errorReason}}</span>
        </el-descriptions-item>
      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="pmSubmit" v-if="feeAmountStatus">提 交</el-button>
          <el-button type="primary" @click="submit" v-else>通 过</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
import util from '@/libs/util'
export default {
  name: 'mentorRecommendApply',
  props: {
    applyData: {
      type: Object
    },
    commMentorWithdrawalVisible: {
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
      fundeData: {},
      refundData: {
        apply: {},
        content: {
          file: [],
          info: {}
        },
        copyTo: [],
        approval: [],
        pay: {}
      },
      approval: '',
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      interviewStatus: false,
      feeAmountStatus: false,
      payWayList: [],
      fundType: false,
      rules: {
        fundType: [{ required: true, message: '必填', trigger: 'blur' }],
        fundWage: [{ required: true, message: '必填', trigger: 'blur' }],
        rate: [{ required: true, message: '必填', trigger: 'blur' }],
        feeInCny: [{ required: true, message: '必填', trigger: 'blur' }],
        isPay: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    commMentorWithdrawalVisible: function (newData, oldData) {
      if (newData) {
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
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
          console.log('applyData详情返佣yx*********', res)

          this.copyTo = ''
          res.data.copyTo.forEach(v => {
            this.copyTo += v.copyToName + '; '
          })
          this.$nextTick(() => {
            const a = JSON.parse(JSON.stringify(res.data))
            this.refundData = {
              apply: a.apply,
              content: JSON.parse(a.apply.content),
              copyTo: a.copyTo,
              approval: a.approval
            }
            console.log('详情数据', this.refundData)
            // if( this.refundData && this.refundData.content && this.refundData.content.info && this.refundData.content.info.intervieweeArr && this.refundData.content.info.intervieweeArr.length > 0){
            //   this.interviewStatus = true
            // }else{
            //   this.interviewStatus = false
            // }
            if (!this.refundData.content.info.payType) {
              this.feeAmountStatus = true
              this.pageInit()
            } else {
              this.feeAmountStatus = false
            }
          })
        })
      }
    }
  },
  mounted () {},
  methods: {
    pageInit () {
      api.getCooperatorPaymentListByCooperatorIdNew(this.refundData.content.info.mentorId, true).then(res => {
        this.payWayList = res.data
      })
    },
    feeInCny () {
      if (this.refundData.content.info.fundType == 'cny') {
        this.fundType = true
        this.$set(this.refundData.content.info, 'rate', 1)
      } else if (this.refundData.content.info.fundType == 'usd') {
        this.fundType = false
      }
      const fundWage = this.refundData.content.info.fundWage
      const rate = this.refundData.content.info.rate
      if (fundWage !== '' && fundWage !== undefined && rate !== '' && rate !== undefined) {
        const cash = parseFloat(this.refundData.content.info.fundWage) * parseFloat(this.refundData.content.info.rate)
        this.$set(this.refundData.content.info, 'feeInCny', cash)
      }
    },
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.interviewStatus = false
      this.$emit('close')
      this.refundData = {
        apply: {},
        copyTo: [],
        approval: [],
        content: {
          file: [],
          info: {}
        },
        pay: {}
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
    pmSubmit () {
      let data = {}
      this.$refs.mentorList.validate(valid => {
        console.log(valid)
        if (!valid) return
        console.log(this.refundData)
        data = JSON.parse(JSON.stringify(this.refundData))
        data.applyId = this.refundData.apply.applyId
        data.approveStatus = 1
        data.content.text.push(
        )
        let payWay = {}
        this.payWayList.forEach(item => {
          console.log(this.applyData.payType, item)
          if (item.accountId == this.refundData.content.info.payType) {
            payWay = item
          }
        })
        console.log(payWay, this.payWayList)

        let account = ''
        console.log(payWay)
        for (const item in payWay) {
          switch (item) {
            case 'paymentType': {
              if (payWay[item]) {
                account += '付款类型：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'payAcc': {
              if (payWay[item]) {
                account += ' 账户：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'bankName': {
              if (payWay[item]) {
                account += ' 银行：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'realName': {
              if (payWay[item]) {
                account += ' 收款人姓名：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'idCard': {
              if (payWay[item]) {
                account += ' 收款人身份证号：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'bankAddress': {
              if (payWay[item]) {
                account += ' Bank Address：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'zip': {
              if (payWay[item]) {
                account += ' ZIP：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'routingNumber': {
              if (payWay[item]) {
                account += ' Routing Number：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'swiftCode': {
              if (payWay[item]) {
                account += ' Swift Code：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'cc': {
              if (payWay[item]) {
                account += ' C C：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'bsb': {
              if (payWay[item]) {
                account += ' Bsb：' + payWay[item] + '  ;  '
              }
              break
            }
            case 'iban': {
              if (payWay[item]) {
                account += ' Iban：' + payWay[item] + '  ;  '
              }
              break
            }
          }
        }
        console.log(account)
        if (account !== '') data.content.text.push({ label: '提现支付方式', value: account })
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
