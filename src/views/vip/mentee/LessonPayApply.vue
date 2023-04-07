<!--
 * @Author: kaan
 * @Date: 2021-12-10 13:28:11
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-03 14:27:20
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="lesson_pay_apply_container">
      <div class="mentor_area mr10">
        <el-descriptions :title="payData.mentorName" size="medium" :column="1" :contentStyle="{flex:1}">
          <!-- <el-descriptions-item label="导师姓名"></el-descriptions-item> -->
          <el-descriptions-item label="佣金规则">{{payData.compensationRule}}</el-descriptions-item>
          <el-descriptions-item label="导师已付课时数" v-if="payData.paidLessonHours">{{payData.paidLessonHours}}</el-descriptions-item>
          <el-descriptions-item label="课程单价">{{payData.compensationType=='usd'?'$':'￥'}}{{payData.compensation}}(基础)
            +{{payData.compensationType=='usd'?'$':'￥'}}{{payData.meritCompensation}}(绩效)</el-descriptions-item>
          <el-descriptions-item label="选中课时数">{{lessonNum||0}}</el-descriptions-item>
          <el-descriptions-item label="总价">{{totalPrice||0}}</el-descriptions-item>
          <el-descriptions-item label="课时备注">
            <template>
              <el-input v-model="note" size="mini" :style="{width:widths}"></el-input>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="收款账户">
            <template>
              <ul :style="{width:widths}" v-if="payData.paymentArr[0] !== null">
                <!-- 支付宝 -->
                <li v-for="(item,i) in payData.paymentArr" :key="i" >
                  <!-- 后台的返回会存在[null]这种结构 故此处多+一处判断 -->
                  <div class="pay_card_box mb10" v-if="item"
                    :class="[{active:categoryIndex==i}]" @click="payClick(item,i)"
                  >
                    <div class="pay_card_default" v-if="item.priority == 1">默认账户</div>
                    <div class="pay_card_img" >
                      <img :src="`${require('@/assets/img/pay/'+item.paymentType+'.png')}`"/>
                    </div>
                    <div class="pay_card_content">
                      <p>{{item.paymentTypeName}}</p>
                      <p>账户/邮箱：{{item.payAcc}}</p>
                      <p class="pay_card_name">收款人：{{item.realName}}</p>
                    </div>
                  </div>
                </li>

              </ul>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="收款凭证">
            <template>
              <el-upload
                action
                class="upload-btn"
                ref="upload1"
                multiple
                :auto-upload="false"
                :file-list="fileList"
                :on-change="handleChange"
                :on-remove="handleChange"
                :style="{width:widths}"
                drag
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button> -->
              </el-upload>
            </template>
          </el-descriptions-item>
          <el-descriptions-item v-for="(item,i) in auditorList" :label="item.confirmCol" :key="i" :labelStyle="{width:'60px'}">
            <template>
              <el-select
                :style="{width:widths}"
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
            </template>
          </el-descriptions-item>
        </el-descriptions>
        <el-button class="mentor_area_btn" type="primary" @click="submit" >提交申请</el-button>
      </div>
      <div class="lesson_area">
        <el-table
          :data="lessonData"
          ref="table"
          highlight-current-row
          @select="selectChange"
          @select-all="selectAllChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-descriptions title="" :column="1" style="padding-left:50px" :contentStyle="{flex:1}">
                <el-descriptions-item label="课程详情">{{scope.row.lessonContent}}</el-descriptions-item>
                <el-descriptions-item label="课程材料" >
                  <el-link type="primary" v-if="scope.row.materials" @click="preview(scope.row.materials)">预览</el-link>
                </el-descriptions-item>
            </el-descriptions>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column sortable align="center" prop="lessonTimes" label="课号"></el-table-column>
          <el-table-column align="center" prop="lessonDate" label="上课时间"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="lessonName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="lessonHours" label="课时(小时)"></el-table-column>
          <el-table-column  align="center" prop="feedbackRemark" label="反馈(星级)">
            <template slot-scope="scope">
              <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark" v-if="scope.row.orginalFeedbackStar">
                <p class="w80" slot="reference">{{scope.row.feedbackStar || '暂未评分'}}</p>
              </el-popover>
              <el-input v-else
                v-model="scope.row.feedbackStar"
                size="mini"
                @change="feedbackStarChange(scope.row)"
                :style="{width:'80px'}"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="compensation" label="课程佣金(基本)"></el-table-column>
          <el-table-column align="center" prop="meritCompensation" label="课程佣金(绩效)">
            <template slot-scope="scope">
              <span>{{scope.row.meritCompensation || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="compensation" :label="`本课价格(${payData.compensationType== 'usd' ? '$' : '￥'})`">
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
      </div>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import files from '@/libs/file'
export default {
  name: 'LessonPayApply',
  data: () => {
    return {
      widths: '360px',
      pkId: '',
      payData: {paymentArr:[]},

      categoryIndex: -1,
      note: '',
      account: '',
      lessonNum: 0,
      totalPrice: '0',
      priceTotalUsd: 0,
      priceTotalCny: 0,
      // 课时单价
      classPrice: 0,
      fileList: [],
      auditorList: [],

      lessonData: [],
      multipleSelection: []
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    pageInit () {
      this.pkId = this.$route.query.pkId
      this.getPaymentApply()
      // 审批列表
      apiDic.getAuditorListByApplyType('mentor_payment').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    getPaymentApply () {
      api.getPaymentApply({ pkId: this.pkId }).then(res => {
        console.log('getPaymentApply', res)
        this.payData = res.data
        if(this.payData.paymentArr[0] == null){
          this.$message({
            type: 'error',
            message: '该导师未绑定收款账户'
          })
        }
        this.lessonData = res.data.lessonArr
        this.lessonData.forEach(v => {
          if (v.feedbackStar) this.feedbackStarChange(v)
        })
      })
    },
    /**
     * @description: 选择收款账户
     * @param {*} item
     * @param {*} i
     * @return {*}
     */
    payClick (item, i) {
      this.categoryIndex = i
      this.account = item
    },
    /**
     * @description: 收款凭证
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    handleChange (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },

    /**
     * @description: 处理table多选
     * @param {*} val
     * @return {*}
     */
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
    /**
     * @description: 根据星级返回课程佣金
     * @param {*} row
     * @return {*}
     */
    feedbackStarChange (row) {
      console.log(row)
      if (row.feedbackStar >= 6 && row.feedbackStar < 8) {
        this.$set(row, 'compensation', this.payData.compensation * row.lessonHours)
        this.$set(row, 'meritCompensation', 0)
        // row.compensation = this.payData.compensation * row.lessonHours;
        // row.meritCompensation = 0;
        row.n_price = row.compensation
      } else if (row.feedbackStar >= 1 && row.feedbackStar < 6) {
        row.n_price = 0
        row.compensation = 0
        row.meritCompensation = 0
      } else if (row.feedbackStar >= 8) {
        this.$set(row, 'meritCompensation', this.payData.meritCompensation * row.lessonHours)
        this.$set(row, 'compensation', this.payData.compensation * row.lessonHours)
        // row.meritCompensation = this.payData.meritCompensation * row.lessonHours
        // row.compensation = this.payData.compensation * row.lessonHours;
        row.n_price = (row.compensation + row.meritCompensation)
      } else {
        row.n_price = 0
        row.compensation = 0
        row.meritCompensation = 0
      }
      this.toTotalPrice()
    },
    /**
     * @description: 计算总价
     * @param {*}
     * @return {*}
     */
    toTotalPrice () {
      this.lessonNum = 0
      this.priceTotal = 0
      this.classPrice = ''
      this.multipleSelection.forEach(v => {
        if (!v.n_price) v.n_price = 0
        this.lessonNum += v.lessonHours
        this.priceTotal += v.n_price
        this.classPrice +=
          '课时数：' +
          v.lessonHours +
          '，评分：' +
          (v.feedbackStar || '无') +
          ', 导师佣金：' +
          (this.payData.compensationType == 'usd' ? '$' : '￥') +
          v.compensation + '+' + v.meritCompensation
      })
      let applyTotalHours = JSON.parse(JSON.stringify(this.payData.paidLessonHours || 0))
      console.log(applyTotalHours)
      if ( this.lessonNum >= 1) {
        this.note = (applyTotalHours + 1) + ' ~ ' + (applyTotalHours + this.lessonNum)
      } else {
        this.note = ''
      }

      if (this.payData.compensationType == 'usd') {
        this.priceTotalUsd = this.priceTotal
        this.totalPrice = '美金' + this.priceTotal
      } else {
        this.priceTotalCny = this.priceTotal
        this.totalPrice = '人民币' + this.priceTotal
      }
    },
    // 预览
    preview (url) {
      file.preview(url)
    },
    submit () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '列表左边选择课时'
        })
        return
      }
      if (!this.note) {
        this.$message({
          type: 'error',
          message: '课时备注必填'
        })
        return
      }
      let lessonIds = ''
      const reg = new RegExp('^([1-9]|10)$')
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
        this.auditorList[i].auditor.forEach(v => {
          approval.push({ approverid: v })
        })
      }
      if (!this.account.accountId) {
        this.$message({
          type: 'error',
          message: '请选择收款账户'
        })
        return
      }
      // if (this.feedbackStatus && !this.feedbackDate) {
      //   this.$message({
      //     type: "error",
      //     message: "学生反馈日期不可为空"
      //   });
      //   return;
      // }
      // if (this.feedbackStatus && !this.fileList.length) {
      //   this.$message({
      //     type: "error",
      //     message: "反馈凭证必填"
      //   });
      //   return;
      // }
      const lessonFeeArr = []
      let num = 0
      this.multipleSelection.forEach(item => {
        num = num + (this.payData.compensation + this.payData.meritCompensation) * item.lessonHours
        lessonFeeArr.push({
          lessonId: item.lessonId,
          feedbackStar: item.feedbackStar,
          lessonFee: item.n_price,
          lessonFeeType: this.payData.compensationType
        })
      })
      let data = {}
      data = {
        apply: {
          applyType: this.payData.applyType,
          applyTitle: this.payData.applyTitle,
          content: '',
          note: this.note
        },
        mentorPayment: {
          remark: this.classPrice,
          note: this.note,
          mentorId: this.payData.mentorId,
          menteeId: this.payData.menteeId,
          signId: this.payData.signId,
          lessonIds: lessonIds,
          payLessonHours: this.lessonNum,
          paymentAmountCny: this.priceTotalCny,
          paymentAmountUsd: this.priceTotalUsd,
          compensationType: this.payData.compensationType,
          payType: this.account.accountId
        },
        voucher: [],
        approval: approval,
        lessonFeeArr: lessonFeeArr
      }
      // if (this.feedbackStatus) {
      //   data.mentorPayment.feedbackOrder = "1";
      //   // 反馈序号
      //   data.mentorPayment.feedbackHelpScore = this.feedbackHelpScore;
      //   // 行业导师是否有帮助得分 1-10
      //   data.mentorPayment.feedbackSatisfactionScore = this.feedbackSatisfactionScore;
      //   // 对行业导师满意度得分 1-10
      //   data.mentorPayment.feedbackAttitudeScore = this.feedbackAttitudeScore;
      //   // 行业导师态度打分 1-10
      //   data.mentorPayment.feedbackDate = this.feedbackDate;
      //   data.mentorPayment.feedbackRemark = this.feedbackRemark;
      // }

      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('div', null, `此次申请共${this.lessonNum}课时 `),
          h('i', { style: 'color: #E6A23C' }, `理论金额${this.payData.compensationType == 'usd' ? '美金' : '人民币'}${num} ，`),
          h('i', { style: 'color: #E6A23C' }, `实际金额${this.totalPrice}`),
          h('div', { style: 'color: #c32e47' }, '请注意学员评分')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$loading()
        console.log(data, 222222222222222222222222222222222)
        console.table(this.fileList)
        if (this.fileList.length) {
          for (let i = 0; i < this.fileList.length; ++i) {
            const file = this.fileList[i]
            files.uploadFunBySys(file.raw, 'apply/mentor_payment', url => {
              data.voucher.push({ voucherPath: url, voucherName: file.name })
              if (data.voucher.length === this.fileList.length) {
                api.applyMentorPay(data)
                  .then((res) => {
                    this.$loading().close()
                    if(res.code!==200){
                      this.$message.warning(res.message)
                      return
                    }
                    this.$message({
                      type: 'success',
                      message: '提交成功，可在‘我的申请’中查看'
                    })
                    this.getPaymentApply()
                  })
                  .catch(err => {
                    this.$message({
                      type: 'error',
                      message: err
                    })
                  })
              }
            })
          }
        } else {
          api.applyMentorPay(data)
            .then((res) => {
              this.$loading().close()
              if(res.code!==200){
                this.$message.warning(res.message)
                return
              }
              this.$message({
                type: 'success',
                message: '提交成功，可在‘我的申请’中查看'
              })
              this.getPaymentApply()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.lesson_pay_apply_container{
  display: flex;
  height: calc(100%);
  .pay_card_box{
    position: relative;
    padding:10px 20px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    cursor: pointer;
    .pay_card_default{
      position: absolute;
      top:0;
      right:0;
      padding:0 10px;
      color:tomato;
      background: rgb(252, 207, 207);
      border-top-right-radius: 4px;
    }
    .pay_card_img{
      width:50px;
      height:50px;
      margin-right:20px;
      display: flex;
      align-items: center;
      img{
        width:100%;
        background-size:contain ;
      }
    }
    .pay_card_content{
      flex: 1;
      .pay_card_name{
        color:#999
      }
      p{
        line-height:1;
      }
    }
  }
  .pay_card_box.active{
    border:1px solid #ffa333;
    background:rgba($color: #ffa333, $alpha: 0.1)
  }
  .mentor_area{
    position: relative;
    width: 500px;
    height:100%;
    padding:10px;
    background: #FFF;
    border-radius: 10px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .mentor_area_btn{
      width:80%;
      line-height:1.8;
      margin-left:10%;
      bottom:10px;
    }
  }

  .lesson_area{
    flex: 1;
    height:100%;
    overflow: auto;
    background: #FFF;
    border-radius: 10px;
  }
}

.course_area{
  flex: 1;
  height:100%;
  margin-left:20px;
  padding:10px;
  background: #FFF;
  border-radius: 10px;
}
</style>
