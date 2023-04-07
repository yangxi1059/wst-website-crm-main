<!--
 * @Author: kaan
 * @Date: 2021-05-25 21:38:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-15 09:46:16
 * @Version:
 * @Description:
-->
 <template>
  <div>
    <el-dialog
      :title="'导师推荐情况'"
      :close-on-click-modal="false"
      @submit.native.prevent
      :visible.sync="mentorRecommendVisible"
      width="1000px"
      :before-close="close"
    >
      <div class="search_page">
        <div class="search">
        </div>
      </div>
      <el-table :data="tableData" size="mini" highlight-current-row id="export_table">
        <el-table-column align="center" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.canApply == 1"
              @click="apply(scope.row)"
              title="申请"
            >Apply</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="referrerName" label="推荐人" min-width="80"></el-table-column>
        <el-table-column align="center" prop="mentorName" label="导师名称" min-width="80"></el-table-column>
        <el-table-column align="center" prop="lessonHours" label="完成课时" min-width="80"></el-table-column>
        <el-table-column align="center" prop="recodeStatus" label="推荐状态" min-width="80">
          <template slot-scope="scope">
            <p v-if="scope.row.applyId" ><a class="show-apply" @click="showApply(scope.row)">{{scope.row.recodeStatus}}</a></p>
            <p v-else>{{scope.row.recodeStatus}}</p>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'导师推荐申请'"
      :visible.sync="referralVisible"
      width="1060px"
      :before-close="handleClose"
    >
      <el-form ref="mentorList" label-width="130px" :model="applyData" size="mini" :rules="rules">
        <el-form-item label="推荐人：" >{{applyData.referrerName||'无'}}</el-form-item>
        <el-form-item label="导师名称：" >{{applyData.mentorName||'无'}}</el-form-item>
        <el-form-item label="导师已上课时：" >{{applyData.lessonHours||'无'}}</el-form-item>
        <el-form-item label="金额类型：" prop="feeType">
          <el-select
            v-model="applyData.feeType"
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
        <el-form-item label="推荐费金额：" prop="feeAmount">
          <el-input
            size="mini"
            :style="{width:'185px'}"
            v-model="applyData.feeAmount"
            placeholder="请输入"
            @change="feeInCny"
          ></el-input>
        </el-form-item>

        <el-form-item label="提现支付方式："  prop="payType">
          <el-select
            v-model="applyData.payType"
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
        <el-form-item label="凭证：" >
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item v-for="(p,j) in auditorList" :label='`${p.confirmCol}：`' :key="j">
          <el-select
            v-model="p.auditor"
            multiple
            filterable
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in p.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <commMentorReferralFee
      :commMentorReferralVisible="commMentorReferralVisible"
      :applyData="showApplyData"
      @close="commMentorReferralClose"
      @submit="commMentorReferralSuccess"
    />
  </div>
</template>
<script>

import api from '@/api/vip'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import { uploadFunBySys } from '@/libs/file'
import commMentorReferralFee from '../../../apply_audit/components/mentor_recommend_apply.vue'
export default {
  name: 'wx',
  mixins: [mixins],
  components: {
    commMentorReferralFee
  },
  props: {
    mentorRecommendVisible: {
      type: Boolean,
      default: false
    },
    mentorData: {
      type: Object
    }
  },
  data: () => {
    return {
      referrerId: '',
      referrerList: [],
      tableData: [],
      referralVisible: false,
      payWayList: [],
      feeType: false,
      applyData: {
        mentorId: '',
        mentorName: '',
        referrerId: '',
        referrerName: '',
        lessonHours: '',
        feeType: 'usd',
        feeAmount: '',
        rate: '',
        feeInCny: '',
        isPay: '1',
        payType: '',
        auditor: []
      },
      fileList: [],
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
      rules: {
        feeType: [{ required: true, message: '必填', trigger: 'blur' }],
        feeAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        rate: [{ required: true, message: '必填', trigger: 'blur' }],
        feeInCny: [{ required: true, message: '必填', trigger: 'blur' }],
        isPay: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      showApplyData: {},
      commMentorReferralVisible: false
    }
  },
  watch: {
    mentorRecommendVisible: function (val, old) {
      if (val) {
        this.Topage()
        this.init()
      }
    }
  },
  mounted () {
    api.getReferrerDrop().then(res => {
      this.referrerList = res.data
    })
  },
  methods: {
    init () {
      apiDic.getAuditorListByApplyType('comm_mentor_referral_fee').then((res) => {
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
    },
    Topage () {
      const params = {
        pageNum: 1,
        pageSize: 999,
        referrerId: this.referrerId
      }
      api.getReferrerList(params).then(res => {
        this.tableData = res.data.rows
      })
    },
    showApply (row) {
      this.showApplyData = { applyId: row.applyId, applyType: 'comm_mentor_referral_fee' }
      this.commMentorReferralVisible = true
    },
    commMentorReferralClose () {
      this.commMentorReferralVisible = false
    },
    commMentorReferralSuccess () {
      this.commMentorReferralVisible = false
      this.Topage()
    },
    apply (item) {
      api.getCooperatorPaymentListByCooperatorIdNew(item.referrerId, true).then(res => {
        this.payWayList = res.data
      })
      this.applyData.mentorId = item.mentorId,
      this.applyData.mentorName = item.mentorName,
      this.applyData.referrerId = item.referrerId,
      this.applyData.referrerName = item.referrerName,
      this.applyData.lessonHours = item.lessonHours,
      this.referralVisible = true
    },
    feeInCny () {
      if (this.applyData.feeType == 'cny') {
        this.feeType = true
        this.applyData.rate = 1
      } else if (this.applyData.feeType == 'usd') {
        this.feeType = false
      }
      if (this.applyData.feeAmount !== '' && this.applyData.rate !== '') {
        this.applyData.feeInCny = parseFloat(this.applyData.feeAmount) * parseFloat(this.applyData.rate)
      }
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      this.$refs.mentorList.validate(valid => {
        if (!valid) return
        const approval = []
        let cannot = false
        this.auditorList.forEach((aa) => {
          if (!aa.auditor.length) {
            cannot = true
          }
          aa.auditor.forEach((v) => {
            approval.push({ approverId: v })
          })
        })
        if (cannot) {
          this.$message({
            type: 'warning',
            message: '审核人都为必填！'
          })
          return
        }
        if (approval && approval.length < 1) {
          this.$message.error('审核人为必填项，若无审核人下拉项请联系部门领导反馈！！')
          return false
        }
        const data = {
          applyType: 'comm_mentor_referral_fee',
          copyTo: [],
          keyId: this.applyData.mentorId,
          voucher: [],
          applyTitle: `${this.applyData.mentorName}导师的推荐费`,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '推荐人',
                value: this.applyData.referrerName || '无'
              },
              {
                label: '导师名称',
                value: this.applyData.mentorName || '无'
              },
              {
                label: '导师已上课时',
                value: this.applyData.lessonHours || '无'
              },
              {
                label: '金额类型',
                value: this.applyData.feeType || '无'
              },
              {
                label: '推荐费金额',
                value: this.applyData.feeAmount || '无'
              },
              // {
              //   label:'汇率',
              //   value:this.applyData.rate||'无'
              // },
              // {
              //   label:'等值人民币',
              //   value:this.applyData.feeInCny||'无'
              // },
              // {
              //   label:'是否提现',
              //   value:this.applyData.isPay == 1?"是":"否"
              // },
              {
                label: '提现支付方式',
                value: this.applyData.payType || '无'
              }
            ],
            info: {
              mentorId: this.applyData.mentorId,
              referrerId: this.applyData.referrerId,
              feeType: this.applyData.feeType,
              feeAmount: this.applyData.feeAmount,
              rate: this.applyData.rate,
              feeInCny: this.applyData.feeInCny,
              isPay: this.applyData.isPay,
              payType: this.applyData.payType
            }
          }
        }
        const payWay = this.payWayList.filter(
          v => v.accountId == this.applyData.payType
        )[0]
        let account = ''
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
        data.content.text[5].value = account
        let canGo = 0
        if (this.fileList && this.fileList.length > 0) {
          canGo++
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            uploadFunBySys(
              file.raw,
              `apply/recommend/${this.applyData.mentorId}_${~~(Math.random() * 1000)}`,
              (url) => {
                console.log(url, data)
                data.content.file.unshift({ name: file.name, url: url })
                data.voucher.unshift({ voucherName: file.name, voucherPath: url })
                canGo--
                if (!canGo) {
                  this.submitCommon(data)
                }
              }
            )
          }
        } else {
          this.submitCommon(data)
        }
      })
    },
    submitCommon (data) {
      console.log(data)
      api.saveCommApply(data).then(() => {
        this.$message({
          message: '发起申请成功',
          type: 'success'
        })
        this.handleClose()
        this.$emit('reload')
      })
        .catch(err => {
          this.$message({
            message: '发起申请失败',
            type: 'error'
          })
          console.log(err)
        })
    },
    handleClose () {
      this.referralVisible = false
      this.Topage()
      this.payWayList = []
      this.fileList = []
      this.feeType = false
      this.auditorList.auditor = []
      this.applyData = {
        mentorId: '',
        mentorName: '',
        referrerId: '',
        referrerName: '',
        lessonHours: '',
        feeType: 'usd',
        feeAmount: '',
        rate: '',
        feeInCny: '',
        isPay: '1',
        payType: ''
      }
    },
    close () {
      this.$emit('close')
      this.referrerId = ''
      this.tableData = []
    }

  }
}
</script>
<style lang="scss" scoped>
.red-border {
  border-color: red;
  background-color: #ff000010;
}
.show-apply{
  text-decoration:underline !important;
  cursor: pointer;
  color: #FF8C00;
}
</style>
