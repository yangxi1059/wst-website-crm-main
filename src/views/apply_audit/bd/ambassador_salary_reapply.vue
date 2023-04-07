<!--
 * @Author: 库建华
 * @Date: 2020-08-05 10:08:37
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-02 10:10:15
 * @Version: 1
 * @Description:
-->

<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false"
      title="校园大使薪资申请"
      :visible.sync="reapplyAmbassadorSalaryVisible"
      width="1200px"
      :before-close="close"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="拒绝理由">
          <p>{{reject}}</p>
        </el-form-item>
        <br />
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
        <el-form-item label="当前系统汇率">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            :disabled="true"
            v-model="exchangeRate"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>
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
          <div v-for="(item,i) in file" :key="i">
            <el-button size="mini" type="text" @click="download(item.url)">{{item.name}}</el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteItem(i)"
              icon="el-icon-delete"
              title="删除本文件件"
            ></el-button>
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

import { uploadFunBySys, downloadFun } from '@/libs/file'
export default {
  name: 'ambassador_salary_reapply',
  mixins: [mixins],
  props: {
    reapplyAmbassadorSalaryVisible: {
      type: Boolean,
      default: false
    },
    applyContent: {
      type: Object
    },
    reject: String
  },
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
      file: []
    }
  },
  computed: {},
  watch: {
    reapplyAmbassadorSalaryVisible: function (val) {
      if (val) {
        this.setData()
        this.getCooperatorPaymentListByCooperatorIdNew()
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
        apiDic.getAuditorListByApplyType('ambassador_salary').then((res) => {
          console.log('getAuditorListByApplyType', res.data)
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
      }
    }
  },
  mounted () {

  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    setData () {
      console.log(this.applyContent, this.applyContent.info)
      this.currencyType = this.applyContent.info.fundType
      this.expenditureAmount = this.applyContent.info.fundWage
      this.exchangeRate = this.applyContent.info.exchangeRate
      this.payAccountId = this.applyContent.info.payAccountId
      this.note = this.applyContent.info.note
      this.file = this.applyContent.file || []
    },
    getRate () {
      apiDic.getRate({ currencyType: this.currencyType }).then((res) => {
        this.exchangeRate = res.data ? res.data.exchangeRate : 1
      })
    },
    getCooperatorPaymentListByCooperatorIdNew () {
      api
        .getCooperatorPaymentListByCooperatorIdNew(this.applyContent.info.ambassadorId)
        .then((res) => {
          console.log(res.data)
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
      this.payAccountId = null
      this.fileList = []
      this.auditor = []
      this.copyTo = []
      this.paymentList = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
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
      const copyTo = []
      this.copy.forEach((v) => {
        copyTo.push({ copyTo: v })
      })
      console.log(this.applyContent.info)
      const data = {
        keyId: this.applyContent.info.ambassadorId,
        applyType: 'ambassador_salary',
        applyTitle: `校园大使[${this.applyContent.info.ambassadorName}]的薪资申请`,
        copyTo: copyTo,
        approval: approval,
        voucher: [],
        content: {
          file: this.file,
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
              value: this.applyContent.info.ambassadorName
            },
            {
              label: '校园大使类型',
              value: this.applyContent.info.ambassadorTypeName
            },
            {
              label: '申请时对应货币汇率',
              value: this.exchangeRate
            },
            {
              label: '备注',
              value: this.note
            },
            {
              label: '上次拒绝理由',
              value: this.reject
            }
          ],
          info: {
            note: this.note,
            fundType: this.currencyType,
            payAccount: '',
            fundWage: this.expenditureAmount,
            exchangeRate: this.exchangeRate,
            payAccountId: this.payAccountId,
            ambassadorId: this.applyContent.info.ambassadorId,
            ambassadorName: this.applyContent.info.ambassadorName,
            ambassadorTypeName: this.applyContent.info.ambassadorTypeName
          }
        }
      }
      const payWay = this.paymentList.filter(
        (v) => v.accountId == this.payAccountId
      )[0]
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
        let fileLength = 0
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, `voucher/db_ambassador_salary/${this.applyContent.info.ambassadorId}_${~~(Math.random() * 10 ** 3)}`, (url) => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            data.voucher.push({
              voucherPath: url,
              voucherName: file.name
            })
            fileLength++
            if (fileLength === this.fileList.length) {
              console.log('bd_contract参数', data)
              api.applyAmbassadorPayment(data).then((res) => {
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
        api.applyAmbassadorPayment(data).then((res) => {
          console.log('bd_contract，', res)
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
      }
    },
    download (val) {
      downloadFun(val)
    },
    deleteItem (i) {
      this.file.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
