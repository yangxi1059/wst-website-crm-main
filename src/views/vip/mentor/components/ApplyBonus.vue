<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-28 16:36:40
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      append-to-body
      title="Bonus Offer申请"
      :visible.sync="applyOfferVisible"
      width="600px"
      :before-close="close"
    >
        <el-form :inline="true"
         :rules="rules"
         :model="formData"
         ref="ruleForm"
         label-width="130px">

          <el-form-item label="申请金额："   >
            <span>{{applyData.fundType=="cny"?'￥':'$'}}{{applyData.fundWage}}</span>
          </el-form-item> <br>
          <el-form-item label="支付方式："   prop="payType">
            <el-select
              v-model="formData.payType"
              placeholder="请选择"
              @change="changeFundType(formData.payType)"
            >
              <el-option
                v-for="item in payWayList"
                :key="item.accountId"
                :label="item.paymentTypeName + ':' + item.payAcc"
                :value="item.accountId "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传凭证" prop="fileList">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              multiple
              :auto-upload="false"
              :file-list="fileList"
              :limit="1"
              :on-change="change"
              :on-remove="change"
              :on-exceed="exceed"
              drag
            >
              <i class="el-icon-upload"></i>
            </el-upload>
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

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">申 请</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    applyOfferVisible: {
      type: Boolean,
      default: false
    },
    applyData: {},
    mentorData: {},
    offerDataObj: {}
  },
  data: () => {
    return {
      formData: {
        remark: '',
        story: ''
      },
      fileList: [],
      auditor: [],
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      payWayList: [],
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
  created () {},
  watch: {
    applyOfferVisible: function (val, old) {
      if (val) {
        this.applyData.fundWage = this.applyData.fundWage.toFixed(2)
        console.log(this.applyData, this.offerDataObj)
        this.init()
        this.Topage()
      }
    }
  },
  methods: {
    init () {
      apiDic.getAuditorListByApplyType('comm_mentor_bonus').then((res) => {
        console.log('comm_mentor_bonus', res.data)
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
      api.getCooperatorPaymentListByCooperatorIdNew(this.mentorData.mentorId, true).then(res => {
        this.payWayList = res.data
        const arr = this.payWayList.filter(item => {
          return item.payStatus == 0
        })
        this.payWayList = arr
        console.log(this.payWayList)
      })
    },
    changeFundType (val) {
      if (this.applyData.singleType) return
      const paymentType = this.payWayList.filter(
        (v) => v.accountId == val
      )[0].paymentType
      console.log(paymentType)
      if (paymentType == 'bank' || paymentType == 'alipay' || paymentType == 'wechatpay') {
        this.applyData.fundType = 'cny'
        this.applyData.fundWage = this.applyData.fundWageCny
      } else {
        this.applyData.fundType = 'usd'
        this.applyData.fundWage = this.applyData.fundWageUsd
      }
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.payWayList = []
      this.fileList = []
      this.auditor = []
      this.formData.payType = ''
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        if (!this.fileList.length) {
          this.$message('凭证材料不能为空')
          return
        }
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
          applyType: 'comm_mentor_bonus',
          copyTo: [],
          keyId: this.mentorData.mentorId,
          applyTitle: `导师【${this.mentorData.mentorName}】的Bonus申请`,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '导师名',
                value: this.mentorData.mentorName
              },
              {
                label: '货币类型',
                value: this.applyData.fundType
              },
              {
                label: '申请Bonus金额',
                value: `${this.applyData.fundWage} ${this.applyData.fundType}`
              },
              {
                label: 'Bonus类型',
                value: this.applyData.bonusType
              },
              {
                label: 'Bonus总金额人民币',
                value: this.offerDataObj.cnyTotal || 0
              },
              {
                label: 'Bonus总金额美金',
                value: this.offerDataObj.usdTotal || 0
              },
              {
                label: '课时Offer分',
                value: this.offerDataObj.trainOfferScore || 0
              },
              {
                label: '内推Offer分',
                value: this.offerDataObj.internalOfferScore || 0
              },
              {
                label: 'Offer总分',
                value: this.offerDataObj.offerScore || 0
              },
              {
                label: '适用奖金率',
                value: `${(this.offerDataObj.bonusRate * 100) || 0}%`
              },
              {
                label: '申请周期',
                value: this.applyData.period
              }

            ],
            info: {
              mentorId: this.mentorData.mentorId,
              fundType: this.applyData.fundType,
              fundWage: this.applyData.fundWage,
              payType: this.formData.payType,
              bonusType: this.applyData.bonusType,
              period: this.applyData.period

            }
          }
        }
        const payWay = this.payWayList.filter(
          v => v.accountId == this.formData.payType
        )[0]
        let account = ''
        for (const item in payWay) {
          switch (item) {
            case 'paymentType': {
              account += '付款类型：' + payWay[item] + '  ;  '
              break
            }
            case 'payAcc': {
              account += '账户：' + payWay[item] + '  ;  '
              break
            }
            case 'bankName': {
              account += '银行：' + payWay[item] + '  ;  '
              break
            }
            case 'realName': {
              account += '收款人姓名：' + payWay[item] + '  ;  '
              break
            }
            case 'idCard': {
              account += '收款人身份证号：' + payWay[item] + '  ;  '
              break
            }
            case 'bankAddress': {
              account += 'Bank Address：' + payWay[item] + '  ;  '
              break
            }
            case 'zip': {
              account += 'ZIP：' + payWay[item] + '  ;  '
              break
            }
            case 'routingNumber': {
              account += 'Routing Number：' + payWay[item] + '  ;  '
              break
            }
            case 'swiftCode': {
              account += 'Swift Code：' + payWay[item] + '  ;  '
              break
            }
          }
        }
        if (account !== '') data.content.text.push({ label: '支付方式', value: account })
        if (this.fileList.length) {
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            if (file.name.length > 100) {
              this.$message({
                type: 'error',
                message: '凭证文件名不可超过100个字符'
              })
              return
            }
            uploadFunBySys(file.raw, 'apply/bonus', url => {
              data.voucher = [
                {
                  voucherPath: url,
                  voucherName: file.name
                }
              ]
              data.content.file = [
                {
                  url: url,
                  name: file.name
                }
              ]
              console.log(data, 2222222222)
              api.setRefund(data).then(res => {
                this.$message({
                  message: '发起申请成功',
                  type: 'success'
                })
                this.$loading().close()
                this.$emit('submit')
                this.$loading().close()
                this.clear()
              }).catch(err => {
                this.$message.error(err.message)
                this.$loading().close()
              })
            })
          }
        } else {
          this.$message.error('文件必传')
        }
      })
    },
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, 'voucher/bonus_apply', url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        })
        this.$loading().close()
        this.$refs.elupload.clearFiles()
        console.log(this.uploadFileList)
      })
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    exceed () {
      this.$message.error('此申请单次仅能上传一个文件~~')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-offer-btn {
  margin: 15px;
  left: 150px;
  position: absolute;
  top: 0px;
}
.w80 {
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
