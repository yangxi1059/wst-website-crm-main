<!--
 * @Author: 库建华
 * @Date: 2019-06-27 14:25:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-03 14:29:59
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'导师佣金'"
      :visible.sync="mentorPayVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="mentorPayData"
        :rules="rules"
        ref="mentorPayData"
        label-width="160px"
      >
        <el-form-item label="导师姓名:">
          <p class="value-box">{{mentorPayData.mentorPayment.mentorName}}</p>
        </el-form-item>
        <el-form-item label="学员姓名:">
          <p class="value-box">{{mentorPayData.mentorPayment.menteeName}}</p>
        </el-form-item>
        <el-form-item label="签约ID:">
          <p class="value-box">{{mentorPayData.mentorPayment.signId}}</p>
        </el-form-item>
        <el-form-item label="课号:">
          <p class="value-box">{{mentorPayData.mentorPayment.lessonTimesIds}}</p>
        </el-form-item>
        <el-form-item label="课时数:">
          <p class="value-box">{{mentorPayData.mentorPayment.payLessonHours}}</p>
        </el-form-item>
        <el-form-item label="课时备注:">
          <p class="value-box">{{mentorPayData.apply.note}}</p>
        </el-form-item>
        <!-- <template v-if="mentorPayData.mentorFeedback">
          <el-form-item label="行业导师是否有帮助:">
            <p class="value-box">{{mentorPayData.mentorFeedback.feedbackHelpScore||'无'}}</p>
          </el-form-item>
          <el-form-item label="对行业导师满意度得分:">
            <p class="value-box">{{mentorPayData.mentorFeedback.feedbackSatisfactionScore||'无'}}</p>
          </el-form-item>
          <el-form-item label="行业导师态度打分:">
            <p class="value-box">{{mentorPayData.mentorFeedback.feedbackAttitudeScore||'无'}}</p>
          </el-form-item>
          <el-form-item label="学员反馈日期:">
            <p class="value-box">{{mentorPayData.mentorFeedback.feedbackDate||'无'}}</p>
          </el-form-item>
          <el-form-item label="反馈备注:">
            <p class="value-box">{{mentorPayData.mentorFeedback.feedbackRemark||'无'}}</p>
          </el-form-item>
          <el-form-item label="反馈凭证:">
            <el-button
              v-if="mentorPayData.mentorFeedback.feedbackVoucher"
              type="text"
              @click="download(mentorPayData.mentorFeedback.feedbackVoucher)"
            >预览</el-button>
            <p class="value-box" v-else>无</p>
          </el-form-item>
          <br />
        </template> -->
        <el-form-item label="申请金额:">
          <p
            class="value-box"
            v-if="mentorPayData.mentorPayment.compensationType == 'cny'"
          >￥{{mentorPayData.mentorPayment.paymentAmountCny}}</p>
          <p
            class="value-box"
            v-else-if="mentorPayData.mentorPayment.compensationType == 'usd'"
          >${{mentorPayData.mentorPayment.paymentAmountUsd}}</p>
        </el-form-item>
        <!-- <template v-if="!mentorPayData.approval.length">
          <el-form-item label="导师收款账户" prop="payType">
            <el-select
              :style="{width:widths}"
              v-model="mentorPayData.payType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in accountList"
                :key="item.pkId"
                :label="item.paymentType + ' : ' + item.payAcc"
                :value="item.pkId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
            <el-select
              :style="{width:'200px'}"
              v-model="item.auditor"
              multiple
              filterable
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
        </template>
        <template v-else>-->
        <el-form-item label="导师收款账户:">
          <p
            class="value-box"
          >{{mentorPayData.mentorPayment.paymentType + '-' + mentorPayData.mentorPayment.payAcc}}</p>
        </el-form-item>
        <el-form-item label="申请凭证:" v-if="mentorPayData.voucher.length">
          <div class="mb10" v-for="(item,i) in mentorPayData.voucher" :key="i">
            <el-button
              :style="{width:'100%',overflow: 'hidden'}"
              @click="download(item.voucherPath)"
              size="mini"
            >{{item.voucherName}}</el-button>
          </div>
        </el-form-item>
        <br>
        <el-form-item label="审核人:">
          <p class="value-box" v-html="approval"></p>
        </el-form-item>
        <!-- </template> -->
      </el-form>

      <span v-if="mentorPayData.apply.content">
        <el-row class="mb10">
          <el-col :offset="2" :span="4" class="_item-name">驳回理由:</el-col>
          <el-col :span="15" class="_item-value">
            <pre>{{mentorPayData.apply.content}}</pre>
          </el-col>
        </el-row>
      </span>
      <el-card v-if="mentorPayData.mentorFeedback" class="mb20">
        <el-row class="mb10">
          <el-col  :span="6" class="_item-name">行业导师是否有帮助得分:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.mentorFeedback.feedbackHelpScore || '无'}}</el-col>
          <el-col  :span="6" class="_item-name">行业导师满意得分:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.mentorFeedback.feedbackSatisfactionScore || '无'}}</el-col>
          <el-col  :span="6" class="_item-name">行业导师态度得分:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.mentorFeedback.feedbackAttitudeScore || '无'}}</el-col>
          <el-col  :span="6" class="_item-name">反馈日期:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.mentorFeedback.feedbackDate || '无'}}</el-col>
          <el-col  :span="6" class="_item-name">反馈备注:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.mentorFeedback.feedbackRemark || '无'}}</el-col>
          <el-col  :span="6" class="_item-name">凭证:</el-col>
          <el-col :span="6" class="_item-value">
            <el-button
              :style="{padding:0}"
              v-if="mentorPayData.mentorFeedback.feedbackVoucher"
              type="text"
              @click="download(mentorPayData.mentorFeedback.feedbackVoucher)"
            >预览</el-button>
            <p class="value-box" v-else>无</p></el-col>
         </el-row>
      </el-card>
      <el-card v-if="mentorPayData.pay">
        <el-row class="mb10">
          <el-col  :span="6" class="_item-name">状态:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.pay.confirmStatus}}</el-col>
          <el-col  :span="6" class="_item-name">出账账户:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.pay.paymentAccountName}}</el-col>
          <el-col  :span="6" class="_item-name">出账时间:</el-col>
          <el-col :span="6" class="_item-value">{{mentorPayData.pay.createTime}}</el-col>
          <el-col  :span="6" class="_item-name">出账金额:</el-col>
          <el-col
            :span="6"
            class="_item-value"
          >{{mentorPayData.pay.payTypeName}}-{{mentorPayData.pay.payAmount}}</el-col>
          <el-col  :span="6" class="_item-name">出账备注:</el-col>
          <el-tooltip
            effect="light"
            :content="mentorPayData.pay.payRemark"
            placement="top-start"
          >
            <el-col :span="6" class="_item-value">{{mentorPayData.pay.payRemark}}</el-col>
          </el-tooltip>
          <el-col  :span="6" class="_item-name">出账凭证:</el-col>
          <el-col :span="6" class="_item-value">
            <el-button
              :style="{padding:0}"
              v-if="mentorPayData.pay.payVoucher"
              type="text"
              @click="download(mentorPayData.pay.payVoucher)"
            >预览</el-button>
            <p class="value-box" v-else>无</p>
          </el-col>
        </el-row>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>

        <el-button
            type="primary"
            v-if="applyData.applyStatus == '1'"
            @click="recall()"
          >撤回</el-button>

        <!-- <el-button type="primary" @click="submit" v-if="!mentorPayData.approval.length">申 请</el-button> -->
        <el-button
          type="primary"
          @click="submit"
          v-if="mentorPayData.pay && mentorPayData.pay.confirmStatus == '待确认'"
        >确认到账</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import { downloadFun } from '@/libs/file'
import axios from '@/api/dictionary.js'
export default {
  name: 'mentorPay',
  props: {
    applyData: {
      type: Object
    },
    mentorPayVisible: {
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
        mentorFeedback: {},
        mentorPayment: {},
        apply: {},
        pay: {},
        voucher: [],
        approval: []
      },
      approval: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      // 导师账户列表
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
      ]
    }
  },
  watch: {
    mentorPayVisible: function (newData) {
      if (newData) {
        console.log('applyData详情yx3213123123', this.applyData)
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    Topage () {
      api.getApplyDetailByApplyId(this.applyData.applyId).then(res => {
        console.log('详情数据', res)
        this.mentorPayData = res.data
        this.approval = ''
        res.data.approval.forEach(v => {
          this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
        })
      })
    },
    recall () {
      this.$confirm('此操作将撤回该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.cancelApplyByApplyId(this.applyData.applyId).then((res) => {
            console.log('撤回返回', res)
            this.$emit('recall')
          })
        })
        .catch(() => {})
    },
    // 关闭
    handleClose () {
      // this.$refs.mentorPayData.resetFields();
      this.$emit('close')
      this.mentorPayData = {
        mentorFeedback: {},
        mentorPayment: {},
        apply: {},
        pay: {},
        voucher: [],
        approval: []
      }
    },
    download (val) {
      downloadFun(val)
    },
    // 确认
    // submit() {
    //   let approval = [];
    //   let cannot = false;
    //   this.auditorList.forEach(aa => {
    //     if (!aa.auditor.length) {
    //       cannot = true;
    //     }
    //     aa.auditor.forEach(v => {
    //       approval.push({ approverId: v });
    //     });
    //   });
    //   if (cannot) {
    //     this.$message({
    //       type: "warning",
    //       message: "审核人都为必填！"
    //     });
    //     return;
    //   }
    //   this.$refs.mentorPayData.validate(valid => {
    //     if (!valid) return;
    //     this.$loading({ background: "rgba(0,0,0,.5)" });
    //     let data = {
    //       applyId: this.mentorPayData.apply.applyId,
    //       payType: this.mentorPayData.payType,
    //       approval: approval
    //     };
    //     console.log(data);
    //     api
    //       .addMentorPayment(data)
    //       .then(res => {
    //         console.log("提交导师酬金申请", res);
    //         this.$message({
    //           message: "保存成功",
    //           type: "success"
    //         });
    //         this.$loading().close();
    //         this.$emit("submit");
    //         this.handleClose();
    //       })
    //       .catch(err => {
    //         this.$message({
    //           message: err.message,
    //           type: "error"
    //         });
    //         this.$loading().close();
    //         this.$emit("submit");
    //         this.handleClose();
    //       });
    //   });
    // },
    // 确认到账
    submit () {
      console.log(this.applyData, this.mentorPayData.pay)
      const data = {
        payId: this.mentorPayData.pay.payId,
        applyId: this.applyData.applyId
      }
      this.$loading()
      console.log('确认佣金参数', data)
      api.updateMentorPaymentDetail(data).then(res => {
        console.log('确认酬金', res)
        this.$message({
          type: 'success',
          message: '确认成功'
        })
        this.$loading().close()
        this.Topage()
        this.$emit('submit')
      })
      // let data = {
      //   uptList: [
      //     {
      //       payId: this.mentorPayData.pay.payId,
      //       applyId: this.applyData.applyId,
      //       payStatus: 1
      //     }
      //   ]
      // };
      // console.log("确认佣金参数", data);
      // this.$loading();
      // api.setMentorPayment(data).then(res => {
      //   console.log("确认佣金", res);
      //   this.$message({
      //     type: "success",
      //     message: "确认成功"
      //   });
      //   this.$loading().close();
      //   // this.Topage();
      //   this.$emit("submit");
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
.value-box {
  width: 200px;
}
</style>
