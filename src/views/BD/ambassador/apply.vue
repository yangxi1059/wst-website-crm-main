<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false"  title="校园大使薪资申请" :visible.sync="applyVisible" width="1200px" :before-close="close">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="金额类型">
          <el-select
            :style="{width:'200px'}"
            v-model="currencyType"
            size="mini"
            placeholder="请选择"
            @change="getRate"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            v-model="expenditureAmount"
            size="mini"
            :disabled="!currencyType"
            placeholder
          ></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="当前系统汇率">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            :disabled="true"
            v-model="exchangeRate"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item> -->
        <el-form-item label="收款账号">
          <el-select :style="{width:'200px'}" v-model="payAccountId" size="mini" placeholder="请选择">
            <el-option
              v-for="item in paymentList"
              :key="item.accountId"
              :label="item.paymentTypeName + item.payAcc"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :style="{width:'920px'}" size="mini" v-model="note" type="textarea"></el-input>
        </el-form-item>
        <!-- <el-form :inline="true" label-width="150px"> -->
        <el-form-item label="材料">
          <div v-for="(temp,i) in tempFile" :key="i">
            <el-button size="mini" @click="temp.url">{{temp.name}}</el-button>
          </div>
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'500px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
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
        <el-form-item label="抄送">
          <el-select :style="{width:'200px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-tooltip effect="dark" content="仅支持备注与材料" placement="top">
          <el-button type="primary" @click="temp">暂 存</el-button>
        </el-tooltip>
        <el-button type="primary" @click="submit">申 请</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import apiU from '@/api/user'
import api from '@/api/bd.js'
import mixins from '@/plugin/mixins'

import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    applyVisible: {
      type: Boolean,
      default: false
    },
    ambassadorData: {
      type: Object
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      user: [],
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: null,
      note: '',
      payAccountId: '',
      expenditureAmount: 0,
      exchangeRate: 0,
      bill_currency_type: [],
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
      paymentList: [],
      tempFile: [],
      tempId: null
    }
  },
  computed: {},
  watch: {
    applyVisible: function (val) {
      if (val) {
        this.getCooperatorPaymentListByCooperatorIdNew()
        this.getTemp()
        this.pageInit()
        apiU.userList({
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
        apiDic.getAuditorListByApplyType('ambassador_salary').then(res => {
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
      }
    }
  },
  mounted () {

  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    getRate () {
      apiDic.getRate({ currencyType: this.currencyType }).then(res => {
        this.exchangeRate = res.data ? res.data.exchangeRate : 1
      })
    },
    getCooperatorPaymentListByCooperatorIdNew () {
      api
        .getCooperatorPaymentListByCooperatorIdNew(this.ambassadorData.ambassadorId)
        .then(res => {
          console.log(res.data,4444444444444444444444)
          this.paymentList = res.data
        })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.expenditureAmount = null
      this.currencyType = null
      this.exchangeRate = 0
      this.note = null
      this.tempId = null
      this.fileList = []
      this.auditor = []
      this.copyTo = []
      this.paymentList = []
      this.tempFile = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    getTemp () {
      api.getTemp(this.ambassadorData.ambassadorId).then(res => {
        console.log(res)
        this.tempId = res.data.tempId
        this.note = res.data.note
        this.tempFile = res.data.content
          ? JSON.parse(res.data.content).file || []
          : []
        console.log(this.tempFile)
      })
    },
    temp () {
      const tempData = {
        note: this.note,
        content: {
          file: this.tempFile
        },
        applyType: 'ambassador_salary',
        tempId: this.tempId,
        keyId: this.ambassadorData.ambassadorId
      }
      if (this.fileList.length) {
        const uploadFile = []
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/db', url => {
            console.log(url)
            uploadFile.push({
              name: file.name,
              url: url
            })
            if (uploadFile.length === this.fileList.length) {
              tempData.content.file = this.tempFile.concat(uploadFile)
              console.log('tempData', tempData)
              api.setTemp(tempData).then(() => {
                this.$loading().close()
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        console.log('tempData', tempData)
        api.setTemp(tempData).then(() => {
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
      }
    },
    submit () {
      console.log(
        'submit',
        this.fileList,
        this.auditor,
        this.copy,
        this.orderData
      )
      // 验证
      if (!this.expenditureAmount) {
        this.$message('金额不能为空')
        return
      }
      if (!this.payAccountId) {
        this.$message('收款账号不能为空')
        return
      }
      // if (!this.fileList.length) {
      //   this.$message("凭证材料不能为空");
      //   return;
      // }
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
      const copyTo = []
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v })
      })
      console.log(this.ambassadorData)
      const data = {
        tempId: this.tempId,
        keyId: this.ambassadorData.ambassadorId,
        applyType: 'ambassador_salary',
        applyTitle: `校园大使[${this.ambassadorData.ambassadorName}]的薪资申请`,
        copyTo: copyTo,
        approval: approval,
        voucher: [],
        content: {
          file: [],
          text: [
            {
              label: '申请金额',
              value: this.currencyType + this.expenditureAmount
            },
            {
              label: '收款账户',
              value: ''
            },
            {
              label: '校园大使名',
              value: this.ambassadorData.ambassadorName
            },
            {
              label: '校园大使类型',
              value: this.ambassadorData.ambassadorTypeName
            },
            {
              label: '申请时对应货币汇率',
              value: this.exchangeRate
            },
            {
              label: '备注',
              value: this.note
            }
          ],
          info: {
            note: this.note,
            fundType: this.currencyType,
            payAccount: '',
            fundWage: this.expenditureAmount,
            exchangeRate: this.exchangeRate,
            payAccountId: this.payAccountId,
            ambassadorId: this.ambassadorData.ambassadorId,
            ambassadorTypeName: this.ambassadorData.ambassadorTypeName,
            ...this.ambassadorData
          }
        }
      }
      const payWay = this.paymentList.filter(v => v.accountId == this.payAccountId)[0]
      let account = ''
      for (const item in payWay) {
        console.log(item, payWay[item])
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
      data.content.text[1].value = account
      data.content.info.payAccount = account
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/db', url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            data.voucher.push({
              voucherPath: url,
              voucherName: file.name
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('bd_contract参数', data)
              data.content.file = data.content.file.concat(this.tempFile)
              data.voucher = data.voucher.concat(
                this.tempFile.map(v => {
                  return { voucherName: v.name, voucherPath: v.url }
                })
              )
              api.applyAmbassadorPayment(data).then(res => {
                console.log('bd_contract，', res)
                this.$loading().close()
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        console.log('data', data)
        data.voucher = this.tempFile.map(v => {
          return { voucherName: v.name, voucherPath: v.url }
        })
        data.content.file = this.tempFile
        api.applyAmbassadorPayment(data).then(res => {
          console.log('bd_contract，', res)
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
