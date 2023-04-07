<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'审核'"
      :visible.sync="recommendVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-descriptions title="" size="medium" :column='2'>
          <el-descriptions-item label="申请人">{{refundData.apply.createByName}}</el-descriptions-item>
          <el-descriptions-item label="申请状态">{{refundData.apply.applyStatusName}}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{refundData.apply.createTime}}</el-descriptions-item>
      </el-descriptions>
      <el-card>
        <el-row  class="" v-if="refundData.content">
          <div v-if="applyData.applyType == 'application_letter_task_payment'">
            <el-col :span="6" class="_item-name">查看详情</el-col>
            <el-col :span="18" class="_item-value" >
              <el-button v-if="refundData.content.info && refundData.content.info.taskId" type="text" @click="detailPay(refundData.content.info.taskId)" style="padding:0px">{{refundData.content.info.taskId}}</el-button>
            </el-col>
          </div>
          <el-descriptions title="" v-if="refundData.content" size="medium" :column='2'>
              <el-descriptions-item :label="item.label" v-for="(item,i) in refundData.content.text" :key="i"
                :label-class-name="item.label | filterLabel" :content-class-name="item.label | filterLabel"
              >{{item.value || '无'}}</el-descriptions-item>
          </el-descriptions>
          <div  class=""  v-if="applyData.applyType == 'mentee_interview_story'">
            <div style="display:flex" class="mb10">
              <div class="">面经显示：</div>
                <el-select v-model="storyStatusInfo" v-if="refundData.content.info"  placeholder="请选择" >
                  <el-option
                    v-for="item in displayStatusList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                  ></el-option>
                </el-select>
            </div>
            <div style="display:flex">
              <div class="">面经编辑：</div>
              <el-input type="textarea" :autosize="{ minRows: 3}" style="width:600px" size="small" v-if="refundData.content.info && refundData.content.info.story" placeholder="请输入内容" v-model="storyNewInfo"></el-input>
            </div>
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
        <el-row class="mb10" v-if="refundData.content && refundData.content.info">
          <div v-if="refundData.content.info && refundData.content.info.originalResume">
              <el-descriptions title="" v-if="refundData.content" size="medium" :column='2'>
                <el-descriptions-item label="修改前文书" :contentStyle="{'display': 'inline-block'}">
                  <el-button @click="download(refundData.content.info.originalResume)" size="mini">{{ refundData.content.info.originalResumeName || '修改前文书'}}</el-button>
                  <el-button type="primary" icon="el-icon-download" @click="downloadD(refundData.content.info.originalResume)" size="mini"></el-button>
                </el-descriptions-item>
                <el-descriptions-item label="修改后文书" :contentStyle="{'display': 'inline-block'}">
                  <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
                    <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
                    <el-button type="primary" icon="el-icon-download" @click="downloadD(item.url)" size="mini"></el-button>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
          </div>
          <div v-else>
            <el-descriptions v-if="refundData.content.file && refundData.content.file.length > 0" title=""  size="medium" :column='2'>
              <el-descriptions-item label="文件" :contentStyle="{'display': 'inline-block'}">
                <div class="mb10 mr10" v-for="(item,i) in refundData.content.file" :key="i">
                  <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-row>
      </el-card>
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
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
      </span>
    </el-dialog>
    <detailApplication :taskId="taskId" :showCommon="showCommon" :showApply="showApply" :showApply2="showApply2" :detailVisible="detailVisible" @close="detailApplicationClose" @update="updateApplication"></detailApplication>
  </div>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file'
import api from '@/api/vip.js'
import detailApplication from '../../vip/mentee/components/Detail.vue'
import util from '@/libs/util'
export default {
  name: 'brokerageAudit',
  props: {
    applyData: {
      type: Object
    },
    recommendVisible: {
      type: Boolean,
      default: false
    }
  },
  components: { detailApplication },
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
      displayStatusList: [
        { itemName: '不显示', itemValue: '0' },
        { itemName: '显示', itemValue: '1' }
      ],
      approval: '',
      detailVisible: false,
      taskId: '',
      showCommon: true,
      showApply: false,
      showApply2: false,
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false,
      interviewStatus: false,
      storyNewInfo: '',
      storyStatusInfo: ''
    }
  },
  filters: {
    // 上课时间过滤器
    filterLabel: function (value) {
      if (value.indexOf('修改前') != -1) {
        return 'colorB'
      } else if (value.indexOf('修改后') != -1) {
        return 'colorG'
      } else {
        return ''
      }
    }
  },
  watch: {
    recommendVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情返佣yx*********', this.applyData)
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
          this.copyTo = ''
          res.data.copyTo.forEach(v => {
            this.copyTo += v.copyToName + '; '
          })

          this.$nextTick(() => {
            this.refundData = {
              pay: res.data.pay,
              apply: res.data.apply,
              content: JSON.parse(res.data.apply.content),
              copyTo: res.data.copyTo,
              approval: res.data.approval
            }
            if (this.applyData.applyType == 'mentee_interview_story') {
              this.storyNewInfo = this.refundData.content.info.story || ''
              this.storyStatusInfo = this.refundData.content.info.storyStatus || ''
            }
            console.log('详情数据', this.refundData)
            if (this.refundData && this.refundData.content && this.refundData.content.info && this.refundData.content.info.intervieweeArr && this.refundData.content.info.intervieweeArr.length > 0) {
              this.interviewStatus = true
            } else {
              this.interviewStatus = false
            }
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
      this.interviewStatus = false
      this.storyNewInfo = ''
      this.storyStatusInfo = ''
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
    },
    // 确认
    submit () {
      this.$confirm('是否确认通过此审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        console.log(this.storyStatusInfo,this.storyStatusInfo != '0' || this.storyStatusInfo != '1')
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        if (this.applyData.applyType == 'mentee_interview_story') {
          if (this.storyStatusInfo !== '0' && this.storyStatusInfo !== '1') {
            this.$message({ message: '面经显示必选', type: 'error' })
            this.$loading().close()
            return false
          } else {
            if (this.storyNewInfo) {
              this.refundData.content.info.story = this.storyNewInfo
            }
            this.refundData.content.info.storyStatus = this.storyStatusInfo
            data = {
              applyId: this.refundData.apply.applyId,
              approveStatus: '1',
              content: this.refundData.content
            }
            this.submitFinal(data)
          }
        } else {
          data = {
            applyId: this.refundData.apply.applyId,
            approveStatus: '1'
          }
          this.submitFinal(data)
        }
      })
    },
    submitFinal (data) {
      console.log(data)
      api.setAuditRefund(data).then(res => {
        console.log('审核导师酬金申请', res)
        this.$message({
          message: '审核通过',
          type: 'success'
        })
        this.$emit('submit')
        this.$loading().close()
        this.handleClose()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '审核失败'
        })
        this.$loading().close()
        this.$emit('submit')
        this.handleClose()
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
    },
    detailPay (data) {
      this.taskId = data
      this.showApply = false
      this.showApply2 = false
      this.detailVisible = true
    },
    detailApplicationClose () {
      this.detailVisible = false
    },
    updateApplication () {
    },
    downloadD (val) {
      downloadFunD(val, (url) => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
