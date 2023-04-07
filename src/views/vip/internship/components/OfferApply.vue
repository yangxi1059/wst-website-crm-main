<!--
 * @Author: 库建华
 * @Date: 2019-12-17 19:16:13
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-25 15:19:04
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="internship-offer-apply">
    <el-dialog
      title="实习Offer收到，实习单位付款申请"
      :visible.sync="internshipOfferApplyVisible"
      :close-on-click-modal="false"
      width="800px"
      :before-close="close"
    >
      <el-form
        :inline="true"
        ref="signTable"
        label-width="140px"
        :rules="rules"
        :model="internshipDataC"
      >
        <el-form-item label="开始日期" prop="internshipStartDate">
          <el-date-picker
            v-model="internshipDataC.internshipStartDate"
            :style="{width:'230px'}"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="internshipEndDate">
          <el-date-picker
            v-model="internshipDataC.internshipEndDate"
            :style="{width:'230px'}"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="offer获得日期" prop="offerReceiveDate">
          <el-date-picker
            v-model="internshipDataC.offerReceiveDate"
            :style="{width:'230px'}"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择获得Offer日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收款账户" prop="payType">
          <el-select v-model="internshipDataC.payType" :style="{width:'230px'}">
            <el-option
              v-for="pay in paymentList"
              :key="pay.accountId"
              :label="pay.paymentTypeName + '--' + pay.payAcc"
              :value="pay.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请金额类型" prop="fundType">
          <el-select v-model="internshipDataC.fundType" :style="{width:'230px'}">
            <el-option
              v-for="item in fundTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请金额" prop="fundWage">
          <el-input-number
            v-model="internshipDataC.fundWage"
            :style="{width:'230px'}"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="系统汇率" prop>
          <el-input-number
            :style="{width:'230px'}"
            :controls="false"
            :disabled="true"
            v-model="exchangeRate"
            placeholder
          ></el-input-number>
        </el-form-item>
        <el-form-item label="申请备注" prop="note">
          <el-input v-model="internshipDataC.note" :style="{width:'230px'}"></el-input>
        </el-form-item>
        <el-form-item label="申请凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'230px'}"
            :draggable="true"
          >
            <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="offer凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload2"
            :auto-upload="false"
            :file-list="fileList2"
            :on-change="change2"
            :on-remove="change2"
            :style="{width:'230px'}"
            :draggable="true"
          >
            <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'230px'}"
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
        <el-form-item label="抄送">
          <el-select :style="{width:'230px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys } from '@/libs/file'
export default {
  name: 'internshipOfferApply',
  props: {
    internshipOfferApplyVisible: {
      type: Boolean,
      default: false
    },
    internshipData: {
      type: Object
    }
  },
  data () {
    return {
      internshipDataC: {
        payType: '',
        fundType: '',
        fundWage: '',
        offerVoucher: '',
        offerReceiveDate: '',
        internshipEndDate: '',
        internshipStartDate: '',
        note: ''
      },
      paymentList: [],
      fundTypeList: [
        { id: 'cny', name: 'CNY' },
        { id: 'usd', name: 'USD' }
      ],
      rules: {
        internshipStartDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        internshipEndDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        offerReceiveDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        fundWage: [{ required: true, message: '必填', trigger: 'blur' }],
        fundType: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      user: [],
      copy: [],
      exchangeRate: 0,
      fileList: [],
      fileList2: [],
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
    internshipOfferApplyVisible: function (val, old) {
      console.log('位置, vip/intership/OfferApply.vue')
      if (val) {
        this.internshipDataC.internshipStartDate =
          this.internshipData.internshipStartDate || ''
        this.internshipDataC.internshipEndDate =
          this.internshipData.internshipEndDate || ''
        // this.internshipDataC.offerReceiveDate = new Date().toLocaleDateString().replace(/\//g, "-");
        const date = new Date()
        this.internshipDataC.offerReceiveDate =
          date.getFullYear() +
          '-' +
          ('0' + (1 + date.getMonth())).substr(-2, 2) +
          '-' +
          ('0' + date.getDate()).substr(-2, 2)
        this.internshipDataC.fundType = this.internshipData.costType || ''
        this.internshipDataC.fundWage = this.internshipData.costPrice || ''
        this.internshipDataC.payType = ''
        this.internshipDataC.note = ''
        this.getPaymentListByInternshipId(this.internshipData.internship)
        this.getAuditorList()
      }
    }
  },
  methods: {
    getPaymentListByInternshipId (internshipId) {
      api.getPayListByInternshipId(internshipId).then(res => {
        console.log(res.data, 22222222222222222222)
        this.paymentList = res.data
        this.internshipDataC.payType =
          (res.data[0] && res.data[0].accountId) || '无收款账户'
      })
    },
    getAuditorList () {
      apiDic.getAuditorListByApplyType('internship_offer_payment').then(res => {
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
      apiDic.getRate({ currencyType: 'usd' }).then(res => {
        this.exchangeRate = res.data.exchangeRate
      })
      api.userList({
        pageNum: 1,
        pageSize: 1000,
        entryStatus: '1'
      })
        .then(({ data }) => {
          console.log(
            'userList...........................................',
            data
          )
          this.user = data.rows
        })
    },
    close () {
      this.$emit('close')
      this.$refs.signTable.resetFields()
      this.$refs.upload1.clearFiles()
      this.$refs.upload2.clearFiles()
    },
    clear () {
      this.fileList = []
      this.fileList2 = []
      this.auditor = []
      this.exchangeRate = 0
      this.copyTo = []
    },
    submit () {
      this.$refs.signTable.validate(valid => {
        if (!valid) return

        const approval = []
        let cannot = false
        this.auditorList.forEach(aa => {
          if (!aa.auditor.length) {
            cannot = true
          }
          aa.auditor.forEach(v => {
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
        if (this.internshipDataC.payType == '无收款账户') {
          this.$message({
            type: 'warning',
            message: '无收款账户'
          })
          return
        }
        const copyTo = []
        this.copy.forEach(v => {
          copyTo.push({ copyTo: v })
        })
        const data = {
          applyType: 'internship_offer_payment',
          applyTitle: `实习单位【${this.internshipData.internshipDesc}】付款申请`,
          copyTo: copyTo,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '学员名',
                value: this.internshipData.menteeName
              },
              {
                label: '实习单位',
                value: this.internshipData.internshipDesc
              },
              {
                label: '实习开始时间',
                value: this.internshipDataC.internshipStartDate
              },
              {
                label: '实习结束时间',
                value: this.internshipDataC.internshipEndDate
              },
              {
                label: '收到实习Offer时间',
                value: this.internshipDataC.offerReceiveDate
              },
              {
                label: '付款金额',
                value:
                  this.internshipDataC.fundType + this.internshipDataC.fundWage
              },
              {
                label: '收款账户',
                value: this.internshipDataC.payType
              },
              {
                label: '申请时汇率',
                value: this.exchangeRate
              },
              {
                label: '备注',
                value: this.internshipDataC.note
              }
            ],
            info: {
              signId: this.internshipData.signId,
              internshipId: this.internshipData.internshipId,
              // internshipOfferStatus: this.internshipDataC.internshipOfferStatus,
              offerVoucher: this.internshipDataC.offerVoucher,
              offerReceiveDate: this.internshipDataC.offerReceiveDate,
              internshipStartDate: this.internshipDataC.internshipStartDate,
              internshipEndDate: this.internshipDataC.internshipEndDate,
              payType: this.internshipDataC.payType,
              fundWage: this.internshipDataC.fundWage,
              fundType: this.internshipDataC.fundType,
              exchangeRate: this.exchangeRate,
              note: this.internshipDataC.note
            }
          }
        }
        const payWay = this.paymentList.filter(
          v => v.accountId == this.internshipDataC.payType
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
        data.content.text[6].value = account
        this.$loading()
        const that = this
        let status1 = true
        let status2 = true
        if (this.fileList.length) {
          status1 = false
        }
        if (this.fileList2.length) {
          status2 = false
        }
        if (this.fileList.length) {
          let a = 0
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            uploadFunBySys(file.raw, 'voucher/internshipOfferApply', url => {
              a++
              console.log(url)
              data.content.file.push({
                name: file.name,
                url: url
              })
              if (a == that.fileList.length) {
                status1 = true
                console.log(status1)
              }
            })
          }
        }
        if (this.fileList2.length) {
          let b = 0
          for (let i = this.fileList2.length - 1; i >= 0; i--) {
            const file2 = this.fileList2[i]
            uploadFunBySys(file2.raw, 'voucher/internshipOfferApply', url => {
              b++
              console.log(url)
              data.content.file.push({
                name: 'offer凭证',
                url: url
              })
              data.content.info.offerVoucher = url
              if (b == that.fileList2.length) {
                status2 = true
                console.log(status2)
              }
            })
          }
        }
        let timeOut = null
        timeOut = setInterval(() => {
          if (status1 && status2) {
            console.log(data)
            clearInterval(timeOut)
            api.setRefund(data).then(res => {
              console.log('res', res)
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
          }
        }, 1000)
      })
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    change2 (file, fileList) {
      console.log(file, fileList)
      if (fileList.length > 0) {
        fileList = []
        fileList.push(file)
      }
      this.fileList2 = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
