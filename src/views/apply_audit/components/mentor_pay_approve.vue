<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'导师佣金'"
      :visible.sync="mentorPayApproveVisible"
      width="1100px"
      :before-close="handleClose"
    >
      <el-form
        v-if="mentorPayData.mentorPayment.pmAudit == 1"
        :inline="true"
        size="mini"
        :model="mentorPayData"
        :rules="rules"
        ref="mentorPayData"
        label-width="160px"
      >
        <el-form-item label="行业导师课时总数：">
          <p :style="{width:'200px'}">{{totalHour}}</p>
        </el-form-item>
        <el-table :data="hourTableData" size="mini" class="mb20">
          <el-table-column align="center" prop="mentorType" label="导师类型">
            <template
              slot-scope="scope"
            >{{( 'strategist' == scope.row.mentorType) ? '全职导师' : '行业导师'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="mentorName" label="导师名"></el-table-column>
          <el-table-column align="center" prop="signHour" label="分配课时"></el-table-column>
          <el-table-column align="center" prop="finishHour" label="完成课时"></el-table-column>
          <el-table-column align="center" prop="paidHour" label="已支付课时">
            <template slot-scope="scope">{{( 0 > scope.row.paidHour) ? '--' : scope.row.paidHour}}</template>
          </el-table-column>
          <el-table-column align="center" prop="applyHour" label="申请中课时"></el-table-column>
          <el-table-column align="center" prop="unPayHour" label="待申请课时">
            <template slot-scope="scope">{{( 0 > scope.row.unPayHour) ? '--' : scope.row.unPayHour}}</template>
          </el-table-column>
        </el-table>
        <el-table
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
          <el-table-column sortable align="center" prop="lessonTimes" label="课号"></el-table-column>
          <el-table-column align="center" prop="lessonDate" label="上课时间"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="lessonName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="lessonHours" label="课时(小时)"></el-table-column>
          <el-table-column align="center" prop="mentorName" label="上课老师"></el-table-column>
          <el-table-column sortable align="center" prop="lessonStatusName" label="课程状态"></el-table-column>
          <el-table-column sortable align="center" prop="paymentStatusName" label="课程支付状态"></el-table-column>
          <el-table-column sortable align="center" prop="feedbackRemark" label="反馈(星级)">
            <template slot-scope="scope">
              <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark">
                <p class="w80" slot="reference">{{scope.row.feedbackStar}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" prop="compensation" label="基本薪资"></el-table-column>
          <el-table-column sortable align="center" prop="meritCompensation" label="绩效薪资"></el-table-column>
          <el-table-column align="center" prop="lessonFee" label="本课价格"></el-table-column>
        </el-table>
        <el-form-item label="导师课佣金规则:">
          <span>{{payRule}}</span>
        </el-form-item><br>
        <template v-if="mentorPayData.mentorFeedback">
          <el-card class="mb20">
            <el-form-item label="行业导师是否有帮助:">
              <p :style="{width:'200px'}">{{mentorPayData.mentorFeedback.feedbackHelpScore||'无'}}</p>
            </el-form-item>
            <el-form-item label="对行业导师满意度得分:">
              <p
                :style="{width:'200px'}"
              >{{mentorPayData.mentorFeedback.feedbackSatisfactionScore||'无'}}</p>
            </el-form-item>
            <el-form-item label="	行业导师态度打分:">
              <p :style="{width:'200px'}">{{mentorPayData.mentorFeedback.feedbackAttitudeScore||'无'}}</p>
            </el-form-item>
            <el-form-item label="学员反馈日期:">
              <p :style="{width:'200px'}">{{mentorPayData.mentorFeedback.feedbackDate||'无'}}</p>
            </el-form-item>
            <el-form-item label="反馈备注:">
              <p :style="{width:'200px'}">{{mentorPayData.mentorFeedback.feedbackRemark||'无'}}</p>
            </el-form-item>
            <el-form-item label="反馈凭证:">
              <el-button
                v-if="mentorPayData.mentorFeedback.feedbackVoucher"
                type="text"
                @click="download(mentorPayData.mentorFeedback.feedbackVoucher)"
              >预览</el-button>
              <p :style="{width:'200px'}" v-else>无</p>
            </el-form-item>
            <br />
          </el-card>
        </template>
        <el-form-item label="导师姓名:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.mentorName}}</p>
        </el-form-item>
        <el-form-item label="学员姓名:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.menteeName}}</p>
        </el-form-item>
        <el-form-item label="签约ID:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.signId}}</p>
        </el-form-item>
        <el-form-item label="课号:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.lessonTimesIds}}</p>
        </el-form-item>
        <el-form-item label="课时数:">
          <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.payLessonHours}}</p>
        </el-form-item>
        <el-form-item label="课时备注:">
          <p :style="{width:'200px'}">{{mentorPayData.apply.note}}</p>
        </el-form-item>

        <el-form-item label="申请金额:">
          <p
            :style="{width:'200px'}"
            v-if="mentorPayData.mentorPayment.compensationType == 'cny'"
          >￥{{mentorPayData.mentorPayment.paymentAmountCny}}</p>
          <p
            :style="{width:'200px'}"
            v-else-if="mentorPayData.mentorPayment.compensationType == 'usd'"
          >${{mentorPayData.mentorPayment.paymentAmountUsd}}</p>
        </el-form-item>
        <el-form-item label="导师收款账户:">
          <p
            :style="{width:'200px'}"
          >{{mentorPayData.mentorPayment.paymentType +'-'+ mentorPayData.mentorPayment.payAcc}}</p>
        </el-form-item>
        <el-form-item label="结算方式:">
          <p :style="{width:'200px'}">{{withdrawalType[mentorPayData.mentorPayment.withdrawalType]}}</p>
        </el-form-item>
        <!-- <el-form-item label="当前系统汇率:">
          <p :style="{width:'200px'}">{{rate}}</p>
        </el-form-item>
        <el-form-item label="申请人民币金额:" v-if="mentorPayData.mentorPayment.compensationType == 'usd'">
          <p :style="{width:'200px'}">
            ￥{{Math.round(mentorPayData.mentorPayment.paymentAmountUsd * rate *
            100
            ) / 100}}
          </p>
        </el-form-item> -->
        <el-form-item label="申请凭证:" v-if="mentorPayData.voucher.length">
          <div class="mb10" v-for="(item,i) in mentorPayData.voucher" :key="i">
            <el-button
              :style="{width:'100%',overflow: 'hidden'}"
              @click="download(item.voucherPath)"
              size="mini"
            >{{item.voucherName}}</el-button>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="审核人:">
          <p v-html="approval"></p>
        </el-form-item>
      </el-form>
      <div v-else-if="mentorPayData.mentorPayment.pmAudit == 0">
        <el-form>
          <el-form-item label="行业导师课时总数：">
            <p :style="{width:'200px'}">{{totalHour}}</p>
          </el-form-item>
        </el-form>
        <el-table :data="hourTableData" size="mini" class="mb20">
          <el-table-column align="center" prop="mentorType" label="导师类型">
            <template
              slot-scope="scope"
            >{{( 'strategist' == scope.row.mentorType) ? '全职导师' : '行业导师'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="mentorName" label="导师名"></el-table-column>
          <el-table-column align="center" prop="signHour" label="分配课时"></el-table-column>
          <el-table-column align="center" prop="finishHour" label="完成课时"></el-table-column>
          <el-table-column align="center" prop="paidHour" label="已支付课时">
            <template slot-scope="scope">{{( 0 > scope.row.paidHour) ? '--' : scope.row.paidHour}}</template>
          </el-table-column>
          <el-table-column align="center" prop="applyHour" label="申请中课时"></el-table-column>
          <el-table-column align="center" prop="unPayHour" label="待申请课时">
            <template slot-scope="scope">{{( 0 > scope.row.unPayHour) ? '--' : scope.row.unPayHour}}</template>
          </el-table-column>
        </el-table>
        <el-table
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
          <el-table-column sortable align="center" prop="lessonTimes" label="课号"></el-table-column>
          <el-table-column align="center" prop="lessonDate" label="上课时间"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="lessonName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="materials" label="课程材料">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.materials"
                type="text"
                @click="download(scope.row.materials)"
                icon="el-icon-download"
              >预览</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="lessonHours" label="课时(小时)"></el-table-column>
          <el-table-column align="center" prop="mentorName" label="上课老师"></el-table-column>
          <el-table-column sortable align="center" prop="lessonStatusName" label="课程状态"></el-table-column>
          <el-table-column sortable align="center" prop="paymentStatusName" label="课程支付状态"></el-table-column>
          <el-table-column sortable align="center" prop="feedbackRemark" label="反馈(星级)">
            <template slot-scope="scope">
              <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark">
                <p class="w80" slot="reference">{{scope.row.feedbackStar}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" prop="compensation" label="基本薪资"></el-table-column>
          <el-table-column sortable align="center" prop="meritCompensation" label="绩效薪资"></el-table-column>
          <el-table-column width="120px" align="center" prop="price" label="本课价格">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.n_price"
                size="mini"
                :controls="false"
                :style="{width:'80px'}"
                @change="toTotalPrice"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <el-form :inline="true" label-width="180px">
          <el-form-item label="导师已付课时数：">
            <p :style="{width:'200px'}" class="colorR">{{mentorPayData.payLessonHours}}</p>
          </el-form-item>
          <el-form-item label="导师课佣金规则：">
            <span>{{payRule}}</span>
          </el-form-item><br>
           <el-form-item label="导师姓名:">
            <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.mentorName}}</p>
          </el-form-item>
          <el-form-item label="学员姓名:">
            <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.menteeName}}</p>
          </el-form-item>
          <el-form-item label="签约ID:">
            <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.signId}}</p>
          </el-form-item>
          <el-form-item label="课号:">
            <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.lessonTimesIds}}</p>
          </el-form-item>
          <el-form-item label="课时数:">
            <p :style="{width:'200px'}">{{mentorPayData.mentorPayment.payLessonHours}}</p>
          </el-form-item>
          <el-form-item label="申请金额：">
            <p :style="{width:'200px'}">{{totalPrice||0}}</p>
          </el-form-item>
          <el-form-item label="结算方式：" v-if="mentorPayData.mentorPayment.withdrawalType == 'wallet'">
            <p :style="{width:'200px'}">{{withdrawalType[mentorPayData.mentorPayment.withdrawalType]}}</p>
          </el-form-item>
          <el-form-item label="结算方式：" v-if="mentorPayData.mentorPayment.withdrawalType == 'cash'">
            <p :style="{width:'200px'}">{{withdrawalType[mentorPayData.mentorPayment.withdrawalType]}}</p>
          </el-form-item>
          <el-form-item label="课时备注：" prop="note">
            <el-input v-model="mentorPayData.apply.note" size="mini" :style="{width:'250px'}"></el-input>
          </el-form-item>
          <el-form-item label="导师收款账户：" v-if="mentorPayData.mentorPayment.withdrawalType == 'cash'">
            <el-select size="mini" :style="{width:'250px'}" v-model="payType">
              <el-option
                v-for="item in mentorPayData.paymentArray"
                :key="item.pkId"
                :label="item.paymentTypeName + ' : ' +item.payAcc"
                :value="item.pkId"
              ></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </div>
      <span v-if="mentorPayData.apply.content">
        <el-row class="mb10">
          <el-col :offset="2" :span="4" class="_item-name">驳回理由:</el-col>
          <el-col :span="15" class="_item-value">
            <pre>{{mentorPayData.apply.content}}</pre>
          </el-col>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="applyData.canSubmit && mentorPayData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
        <template v-if="mentorPayData.apply.applyStatus == 4">
          <!-- <el-button type="primary" @click="submit">付 款</el-button> -->
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api/dictionary.js'
import api from '@/api/vip.js'
import { downloadFun } from '@/libs/file'
export default {
  name: 'mentorPay',
  props: {
    applyData: {
      type: Object,
      default: {}
    },
    mentorPayApproveVisible: {
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
      mentorPayData: {
        mentorPayment: {},
        apply: {},
        voucher: [],
        approval: []
      },
      approval: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      rejectMsg: '',
      rate: 0,
      hourTableData: [],
      withdrawalType: { wallet: '到导师钱包余额', cash: '提现' },
      showStatus: ['未开始', '进行中', '已完成', '已取消', '有争议'],
      payStatus: ['未支付', '已支付', '申请中'],
      payType: '',
      totalHour: 0,
      totalPrice: 0
    }
  },
  watch: {
    mentorPayApproveVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情', this.applyData)
        api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
          console.log('详情数据2222222222222', res)
          // this.mentorPayData.content = JSON.parse(res.data.apply.content);
          if (res.data.mentorInfo.compensationFixed == 0) {
            this.payRule = res.data.ruleInfo[0].ruleContent
            // 获取当前区段课时费
            for (let i = 0; i < res.data.ruleInfo.length; i++) {
              if (
                !res.data.ruleInfo[i].toHour ||
                res.data.ruleInfo[i].toHour > res.data.payLessonHours
              ) {
                console.log(res.data.ruleInfo[i], 33333333333)
                this.compensation = res.data.ruleInfo[i].compensation || 0
                this.meritCompensation = res.data.ruleInfo[i].meritCompensation || 0
                this.payMoneyType = res.data.ruleInfo[i].compensationType
                break
              }
            }
          } else {
            this.payRule =
              '基本' +
              res.data.mentorInfo.compensationType +
              res.data.mentorInfo.compensation +
              ' + 绩效' + res.data.mentorInfo.meritCompensation
            if (res.data.lessonArr && res.data.lessonArr.length > 0) {
              if (res.data.lessonArr[0].programType == 'oral') {
                this.compensation = res.data.mentorInfo.oralCompensation || 0
                this.meritCompensation = res.data.mentorInfo.oralMeritCompensation || 0
                this.payMoneyType = res.data.mentorInfo.oralCompensationType
              } else {
                this.compensation = res.data.mentorInfo.compensation || 0
                this.meritCompensation = res.data.mentorInfo.meritCompensation || 0
                this.payMoneyType = res.data.mentorInfo.compensationType
              }
            }
          }
          this.mentorPayData = res.data
          console.log(res.data.lessonArr, 4444444444444444444444)
          res.data.lessonArr.forEach(v => {
            v.lessonStatusName = this.showStatus[v.lessonStatus]
            v.paymentStatusName = this.payStatus[v.paymentStatus]
            v.compensation = JSON.parse(JSON.stringify(this.compensation))
            v.meritCompensation = JSON.parse(JSON.stringify(this.meritCompensation))
            if (v.feedbackStar >= 6 && v.feedbackStar < 8) {
              v.compensation = v.compensation * v.lessonHours
              v.meritCompensation = 0
              v.n_price = v.compensation
            } else if (v.feedbackStar >= 1 && v.feedbackStar < 6) {
              v.compensation = 0
              v.meritCompensation = 0
              v.n_price = 0
            } else if (v.feedbackStar >= 8) {
              v.meritCompensation = v.meritCompensation * v.lessonHours
              v.compensation = v.compensation * v.lessonHours
              v.n_price = (v.compensation + v.meritCompensation)
            } else {
              v.compensation = 0
              v.meritCompensation = 0
              v.n_price = 0
            }
          })
          this.tableData = res.data.lessonArr
          this.toTotalPrice()
          // this.rate = res.data.mentorPayment.rate * 1;
          this.approval = ''
          res.data.approval.forEach(v => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
          })
          this.getHourListBySignId(res.data.mentorPayment.signId)
        })
      }
    }
  },
  mounted () {
    axios.getRate({ currencyType: 'usd' }).then(res => {
      console.log(res,22222222222222)
      this.rate = res.data.exchangeRate
    })
  },
  methods: {
    getHourListBySignId (signId) {
      api.getHourListBySignId(signId).then(res => {
        console.log('项目导师课时列表', res, 99999999)
        this.hourTableData = res.data.lessonInfo
        this.totalHour = res.data.mentorHour
      })
    },
    // 关闭
    handleClose () {
      // this.$refs.mentorPayData.resetFields();
      this.$emit('close')
      this.mentorPayData = {
        mentorPayment: {},
        apply: {},
        voucher: [],
        approval: []
      }
      this.payType = ''
      this.totalHour = 0
      this.totalPrice = 0
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
          applyId: this.mentorPayData.apply.applyId,
          approveStatus: '1',
          rate: this.rate
        }
        if (this.mentorPayData.mentorPayment.compensationType == 'usd') {
          data.paymentAmountCny =
            Math.round(
              this.mentorPayData.mentorPayment.paymentAmountUsd * this.rate * 100
            ) / 100
        }
        if (this.mentorPayData.mentorPayment.pmAudit == 0) {
          if (this.mentorPayData.mentorPayment.withdrawalType == 'wallet') {

          } else {
            data.payType = this.payType
          }
          data.remark = this.mentorPayData.apply.note
          if (this.payMoneyType == 'usd') {
            data.paymentAmountUsd = this.priceTotalUsd
            data.paymentAmountCny =
              Math.round(
                this.priceTotalUsd * this.rate * 100
              ) / 100
          } else if (this.payMoneyType == 'cny') {
            data.paymentAmountUsd =
            Math.round(
              this.priceTotalCny / this.rate * 100
            ) / 100
            data.paymentAmountCny = this.priceTotalCny
          }
          const lessonFeeArr = []
          this.tableData.forEach(v => {
            lessonFeeArr.push({
              lessonId: v.lessonId,
              lessonFee: v.n_price,
              lessonFeeType: this.payMoneyType
            })
          })
          data.lessonFeeArr = lessonFeeArr
        }
        console.log(data)
        api
          .setApproveMentorPayment(data)
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
            applyId: this.mentorPayData.apply.applyId,
            approveStatus: '2',
            msg: value
          }
          console.log(data)
          api
            .setApproveMentorPayment(data)
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
    toTotalPrice () {
      // if (!this.rate) this.rate = 0;
      this.priceTotal = 0
      this.tableData.forEach(v => {
        if (!v.n_price) v.n_price = 0
        this.priceTotal += v.n_price
      })

      if (this.payMoneyType == 'usd') {
        this.priceTotalUsd = this.priceTotal
        this.totalPrice = '美金' + this.priceTotal
        // this.priceTotalCny = this.priceTotal * this.rate;
      } else {
        this.priceTotalCny = this.priceTotal
        this.totalPrice = '人民币' + this.priceTotal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
