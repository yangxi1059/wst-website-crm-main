<!--
 * @Author: 库建华
 * @Date: 2019-11-04 14:45:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-06 10:39:54
 * @Version: 1
 * @Description: 支付
 -->

<template>
  <div class="set-course">
    <el-dialog title="口语课表" :visible.sync="payVisible" append-to-body width="1400px" :before-close="close">
      <el-table
        :data="tableData"
        size="mini"
        ref="table"
        highlight-current-row
        @select="selectChange"
        @select-all="selectAllChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable align="center" prop="lessonTimes" label="课号" width="70"></el-table-column>
        <el-table-column align="center" prop="lessonDate" label="上课时间"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="lessonName" label="课程内容"></el-table-column>
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
        <el-table-column  align="center" prop="lessonStatusName" label="课程状态"></el-table-column>
        <el-table-column  align="center" prop="paymentStatusName" label="课程支付状态"></el-table-column>
        <el-table-column  align="center" prop="feedbackRemark" label="反馈(星级)" >
          <template slot-scope="scope">
            <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark" v-if="scope.row.orginalFeedbackStar">
              <p class="w80" slot="reference">{{scope.row.feedbackStar || '暂未评分'}}</p>
            </el-popover>
            <el-input v-else
              v-model="scope.row.feedbackStar"
              :controls="false"
              size="mini"
              @change="feedbackStarChange(scope.row)"
              :style="{width:'80px'}"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column  align="center" prop="oralCompensation" label="课程佣金(基本)"></el-table-column>
        <el-table-column  align="center" prop="oralMeritCompensation" label="课程佣金(绩效)"></el-table-column>
        <el-table-column align="center" prop="price" label="本课价格">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.price"
              size="mini"
              :controls="false"
              :style="{width:'80px'}"
              @change="toTotalPrice"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <el-form :inline="true" label-width="200px">
        <!-- <el-form-item label="导师已付课时数：">
          <span class="colorR">{{payedHours}}</span>
        </el-form-item>-->
        <el-form-item label="导师口语课佣金规则：">
          <span>{{payRule}}</span>
        </el-form-item>
        <el-form-item label="选中课时数：">
          <span>{{lessonNum||0}}</span>
        </el-form-item>
        <el-form-item label="总价：">
          <span>{{totalPrice||0}}</span>
        </el-form-item>
        <!-- <el-form-item label="系统汇率：" prop>
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            :disabled="true"
            v-model="exchangeRate"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>-->
        <!-- <el-form-item label="课时备注：" prop="note">
          <el-input v-model="note" size="mini" :style="{width:'250px'}"></el-input>
        </el-form-item>-->
        <el-form-item label="导师收款账户：">
          <el-select size="mini" :style="{width:'250px'}" v-model="account">
            <el-option
              v-for="item in accountList"
              :key="item.pkId"
              :label="item.paymentTypeName + ' : ' +item.payAcc"
              :value="item.pkId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="200px">
        <el-form-item v-for="(item,i) in auditorList" :label="item.confirmCol" :key="i">
          <el-select
            :style="{width:'250px'}"
            v-model="item.auditor"
            multiple
            filterable
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-card v-if="feedbackStatus">
        <el-form :inline="true" label-width="200px">
          <el-form-item label="行业导师是否有帮助得分：" prop="feedbackHelpScore">
            <el-input-number
              v-model="feedbackHelpScore"
              size="mini"
              :style="{width:'250px'}"
              :max="10"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="对行业导师满意度得分：" prop="feedbackSatisfactionScore">
            <el-input-number
              v-model="feedbackSatisfactionScore"
              size="mini"
              :style="{width:'250px'}"
              :max="10"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="行业导师态度打分：" prop="feedbackAttitudeScore">
            <el-input-number
              v-model="feedbackAttitudeScore"
              size="mini"
              :style="{width:'250px'}"
              :max="10"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="反馈备注：" prop="feedbackRemark">
            <el-input v-model="feedbackRemark" size="mini" :style="{width:'250px'}"></el-input>
          </el-form-item>
          <el-form-item label="学员反馈日期：" prop="feedbackDate">
            <el-date-picker
              v-model="feedbackDate"
              :style="{width:'250px'}"
              size="mini"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="反馈凭证：">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="change"
              :on-remove="change"
              :style="{width:'200px'}"
              drag
            >
              <el-button slot="trigger" size="mini" type="success" plain>点击、拖拽上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer">
        <el-button class="mr10" @click="close">取 消</el-button>
        <el-button class="mr10" type="primary" :disabled="statusShow" @click="submit">提交申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'
export default {
  mixins: [mixins],
  props: {
    payVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ''
    },
    applyTotalHours: {
      type: Number,
      default: 0
    },
    mentorId: {
      type: String,
      default: ''
    },
    businessType: {},
    menteeId: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      tableData: [{}, {}],
      multipleSelection: [],
      statusShow: false,
      showStatus: ['未开始', '进行中', '已完成', '已取消', '有争议'],
      payStatus: ['未支付', '已支付', '申请中'],
      payedHours: 0,
      payRule: '',
      account: '',
      accountList: [],
      auditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ],
      payMoneyType: 'usd',
      price: 0,
      // rate: 0,
      lessonNum: 0,
      totalPrice: '0',
      priceTotal: 0,
      priceTotalUsd: 0,
      priceTotalCny: 0,
      note: '',
      feedbackOrder: 0,
      feedbackHelpScore: 0,
      feedbackSatisfactionScore: 0,
      feedbackAttitudeScore: 0,
      feedbackDate: '',
      feedbackVoucher: '',
      feedbackRemark: '',
      fileList: [],
      exchangeRate: 0,
      feedbackStatus: true,
      classPrice: '',
      oralCompensationObj: {
        oralCompensation: 0,
        oralCompensationType: 'usd',
        oralMeritCompensation: 0
      }
    }
  },
  watch: {
    payVisible: function (val, old) {
      if (val) {
        this.initPay()
      }
    }
  },
  beforeDestroy () {
    console.log('pay组件销毁')
    this.activeName = null
    this.tableData = null
    this.multipleSelection = null
    this.showStatus = null
    this.payStatus = null
    this.payedHours = null
    this.payRule = null
    this.account = null
    this.accountList = null
    this.auditorList = null
    this.payMoneyType = null
    this.price = null
    this.lessonNum = null
    this.totalPrice = null
    this.priceTotal = null
    this.priceTotalUsd = null
    this.priceTotalCny = null
    this.note = null
    this.feedbackOrder = null
    this.feedbackHelpScore = null
    this.feedbackSatisfactionScore = null
    this.feedbackAttitudeScore = null
    this.feedbackDate = null
    this.feedbackVoucher = null
    this.feedbackRemark = null
    this.fileList = null
    this.exchangeRate = null
    this.feedbackStatus = null
    this.classPrice = null
    this.oralCompensationObj = null
  },
  methods: {
    initPay () {
      this.note = this.applyTotalHours
      api.getMentorPayedByMentorId(this.mentorId).then((res) => {
        this.oralCompensationObj = res.data.mentorInfo
        this.payedHours = res.data.payLessonHours
        if (!res.data.mentorInfo.oralCompensationType) {
          this.$message.error('请设置此导师的口语规则！！')
          this.statusShow = true
        } else {
          this.statusShow = false
        }
        this.payRule = '基础' + res.data.mentorInfo.oralCompensationType + res.data.mentorInfo.oralCompensation + ';' + '绩效' + (res.data.mentorInfo.oralMeritCompensation || 0)
        this.price = res.data.mentorInfo.oralCompensation
        this.payMoneyType = res.data.mentorInfo.oralCompensationType
        this.accountList = res.data.paymentArray || []
        this.account =
          (this.accountList[0] && this.accountList[0].pkId) || null
        this.Topage()
      })
      apiDic.getAuditorListByApplyType('mentor_payment').then((res) => {
        res.data.forEach((v) => {
          v.auditor = []
          v.confirmorArr.forEach((value) => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
      apiDic.getRate({ currencyType: 'usd' }).then((res) => {
        this.exchangeRate = res.data.exchangeRate
      })
    },
    Topage () {
      const params = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$loading()
      api.getCourseListBySignId(this.signId, params).then((res) => {
        let data = JSON.parse(JSON.stringify(res.data.rows))
        data = data.filter(
          (v) =>
            v.settleMentor === this.mentorId &&
            (!v.paymentStatus || v.paymentStatus == '0') &&
            v.lessonStatus == 2
        )
        data.forEach((v) => {
          v.oralCompensation = this.oralCompensationObj.oralCompensation || 0
          v.oralMeritCompensation = this.oralCompensationObj.oralMeritCompensation || 0
          v.lessonStatusName = this.showStatus[v.lessonStatus]
          v.paymentStatusName = this.payStatus[v.paymentStatus]
          if (v.feedbackStar >= 6 && v.feedbackStar < 8) {
            v.oralCompensation = this.oralCompensationObj.oralCompensation * v.lessonHours
            v.oralMeritCompensation = 0
            v.price = v.oralCompensation
          } else if (v.feedbackStar >= 1 && v.feedbackStar < 6) {
            v.oralCompensation = 0
            v.oralMeritCompensation = 0
            v.price = 0
          } else if (v.feedbackStar >= 8) {
            v.oralCompensation = this.oralCompensationObj.oralCompensation * v.lessonHours
            v.oralMeritCompensation = this.oralCompensationObj.oralMeritCompensation * v.lessonHours
            v.price = (v.oralCompensation + v.oralMeritCompensation)
          } else {
            v.price = 0
            v.oralCompensation = 0
            v.oralMeritCompensation = 0
          }
          v.orginalFeedbackStar = v.feedbackStar
          // if(v.feedbackStar && v.feedbackStar < 9){
          //   v.price = this.oralCompensationObj.oralCompensation * v.lessonHours;
          // }else{
          //   v.price = (this.oralCompensationObj.oralCompensation+this.oralCompensationObj.oralMeritCompensation) * v.lessonHours;
          // }
        })

        this.tableData = data
        console.log(this.tableData)
        // this.total = res.data.total;
        this.$loading().close()
      })
    },
    close () {
      this.editId = 0
      this.totalHours = ''
      this.fileList = []
      this.feedbackStatus = true
      this.feedbackOrder = 0
      this.feedbackHelpScore = 0
      this.feedbackSatisfactionScore = 0
      this.feedbackAttitudeScore = 0
      this.feedbackDate = ''
      this.feedbackVoucher = ''
      this.feedbackRemark = ''
      this.priceTotalCny = 0
      this.priceTotalUsd = 0
      this.exchangeRate = 0
      this.account = ''
      this.payMoneyType = 'usd'
      this.$emit('close')
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList.slice(-1)
    },
    download (val) {
      downloadFun(val, (url) => {
        window.open(url)
      })
    },
    handleSelectionChange (val) {
      console.log('handleSelectionChange', val)
      this.multipleSelection = val
      this.toTotalPrice()
    },
    selectChange (s, v) {
      console.log(s, v)
    },
    selectAllChange (s) {
      console.log(s, this)
    },
    feedbackStarChange (row) {
      if (row.feedbackStar >= 6 && row.feedbackStar < 8) {
        row.oralCompensation = this.oralCompensationObj.oralCompensation * row.lessonHours
        row.oralMeritCompensation = 0
        row.price = row.oralCompensation
      } else if (row.feedbackStar >= 1 && row.feedbackStar < 6) {
        row.oralCompensation = 0
        row.oralMeritCompensation = 0
        row.price = 0
      } else if (row.feedbackStar >= 8) {
        row.oralCompensation = this.oralCompensationObj.oralCompensation * row.lessonHours
        row.oralMeritCompensation = this.oralCompensationObj.oralMeritCompensation * row.lessonHours
        row.price = (row.oralCompensation + row.oralMeritCompensation)
      } else {
        row.oralMeritCompensation = 0
        row.oralCompensation = 0
        row.price = 0
      }
      this.toTotalPrice()
    },
    toTotalPrice () {
      // if (!this.rate) this.rate = 0;
      this.lessonNum = 0
      this.priceTotal = 0
      this.classPrice = ''
      this.multipleSelection.forEach((v) => {
        if (!v.price) v.price = 0
        this.lessonNum += v.lessonHours
        this.priceTotal += v.price
        this.classPrice +=
          '课时数：' +
          v.lessonHours +
          '，导师Rate：' +
          (this.payMoneyType == 'usd' ? '$' : '￥') +
          v.price +
          `;
        `
      })
      let applyTotalHours = this.applyTotalHours
      if (this.applyTotalHours >= 1 && this.lessonNum >= 1) {
        // if (!(this.applyTotalHours % 1) && !(this.lessonNum % 1)) {
        applyTotalHours = this.applyTotalHours + 1
        // }
      }
      this.note =
        applyTotalHours + ' ~ ' + (this.applyTotalHours + this.lessonNum)
      if (this.payMoneyType == 'usd') {
        this.priceTotalUsd = this.priceTotal
        this.totalPrice = '美金' + this.priceTotal
        // this.priceTotalCny = this.priceTotal * this.rate;
      } else {
        this.priceTotalCny = this.priceTotal
        this.totalPrice = '人民币' + this.priceTotal
        // this.priceTotalUsd = Math.round((this.priceTotal / this.rate) * 100) / 100;
      }
      // this.totalPrice = "人民币" + this.priceTotalCny + " / " + "美金" + this.priceTotalUsd;
    },
    submit () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '列表左边选择课时'
        })
        return
      }
      // if (!this.note) {
      //   this.$message({
      //     type: "error",
      //     message: "课时备注必填"
      //   });
      //   return;
      // }
      const reg = new RegExp('^([1-9]|10)$')
      let lessonIds = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        lessonIds += ',' + this.multipleSelection[i].lessonId
        if (!reg.test(this.multipleSelection[i].feedbackStar)) {
          this.$message({
            type: 'warning',
            message: '反馈(星级)请输入1-10的整数'
          })
          return
        }
      }
      lessonIds = lessonIds.slice(1)
      const approval = []
      for (let i = 0; i < this.auditorList.length; i++) {
        if (this.auditorList[i].auditor.length === 0) {
          this.$message({
            type: 'error',
            message: '审核人不可为空'
          })
          return
        }
        this.auditorList[i].auditor.forEach((v) => {
          approval.push({ approverid: v })
        })
      }
      if (!this.account) {
        this.$message({
          type: 'error',
          message: '导师账户不可为空'
        })
        return
      }
      if (this.feedbackStatus && !this.feedbackDate) {
        this.$message({
          type: 'error',
          message: '学生反馈日期不可为空'
        })
        return
      }
      if (this.feedbackStatus && !this.fileList.length) {
        this.$message({
          type: 'error',
          message: '反馈凭证必填'
        })
        return
      }
      const lessonFeeArr = []
      let num = 0
      this.multipleSelection.forEach(item => {
        console.log(item)
        num = num + ((this.oralCompensationObj.oralCompensation || 0) + (this.oralCompensationObj.oralMeritCompensation || 0)) * item.lessonHours
        lessonFeeArr.push({
          lessonId: item.lessonId,
          lessonFee: item.price,
          feedbackStar: item.feedbackStar,
          lessonFeeType: this.payMoneyType
        })
      })
      const data = {
        apply: {
          applyType: 'mentor_payment',
          applyTitle: `导师${this.multipleSelection[0].mentorName}的佣金申请（口语课）`,
          content: '',
          // file: [],
          // text: [
          //   {
          //     label: "课时单价",
          //     value: this.classPrice,
          //   },
          //   {
          //     label: "学生名",
          //     value: this.exchangeRate
          //   },
          //   {
          //     label: "签约ID",
          //     value: this.referrer
          //   },
          //   {
          //     label: "课号",
          //     value: this.account
          //   },
          //   {
          //     label: "课时数",
          //     value: this.account
          //   },
          //   {
          //     label: "课时备注",
          //     value: this.account
          //   },
          //   {
          //     label: "行业导师是否有帮助",
          //     value: this.account
          //   },
          //   {
          //     label: "对行业导师满意度得分",
          //     value: this.account
          //   },
          //   {
          //     label: "行业导师态度打分",
          //     value: this.account
          //   },
          //   {
          //     label: "学员反馈日期",
          //     value: this.account
          //   },
          //   {
          //     label: "反馈备注",
          //     value: this.account
          //   },
          //   {
          //     label: "申请金额",
          //     value: this.account
          //   },
          //   {
          //     label: "导师收款账户",
          //     value: this.account
          //   },
          //   {
          //     label: "申请时汇率",
          //     value: this.account
          //   }
          // ]
          // },

          note: '口语课'
        },
        mentorPayment: {
          remark: this.classPrice,
          note: '口语课',
          mentorId: this.mentorId,
          menteeId: this.menteeId,
          signId: this.signId,
          lessonIds: lessonIds,
          payLessonHours: this.lessonNum,
          // 申请时当前系统汇率
          // rate: this.exchangeRate,
          // exchangeRate: this.exchangeRate,
          // compensation: "",
          paymentAmountCny: this.priceTotalCny,
          paymentAmountUsd: this.priceTotalUsd,
          compensationType: this.payMoneyType,
          payType: this.account,

          feedbackOrder: this.feedbackOrder,
          // 反馈序号
          feedbackHelpScore: this.feedbackHelpScore,
          // 行业导师是否有帮助得分 1-10
          feedbackSatisfactionScore: this.feedbackSatisfactionScore,
          // 对行业导师满意度得分 1-10
          feedbackAttitudeScore: this.feedbackAttitudeScore,
          // 行业导师态度打分 1-10
          feedbackDate: this.feedbackDate,
          feedbackRemark: this.feedbackRemark,
          // 学员反馈日期
          feedbackVoucher: null
          // 反馈凭证
        },
        approval: approval,
        lessonFeeArr: lessonFeeArr
      }
      const file = this.fileList[0]
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('div', null, `此次申请共${this.lessonNum}课时 `),
          h('i', { style: 'color: #E6A23C' }, `理论金额${this.payMoneyType == 'usd' ? '美金' : '人民币'}${num} ，`),
          h('i', { style: 'color: #E6A23C' }, `实际金额${this.totalPrice}`),
          h('div', { style: 'color: #c32e47' }, '请注意学员评分')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$loading()
        uploadFunBySys(file.raw, 'materials/mentor_feedback', (url) => {
          data.mentorPayment.feedbackVoucher = url
          api
            .applyMentorPay(data)
            .then(() => {
              this.$message({
                type: 'success',
                message: '提交成功，可在‘我的申请’中查看'
              })
              this.$loading().close()
              this.$emit('submit')
              this.close()
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: err
              })
              this.$loading().close()
            })
        })
      })
    }
  }
}
</script>
