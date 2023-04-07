<!--
 * @Author: 库建华
 * @Date: 2020-06-23 13:26:00
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-17 15:17:53
 * @Version: 1
 * @Description:
-->
<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false" title="活动经费申请"  :visible.sync="applyVisible" width="1200px" :before-close="close">
      <!-- <el-switch
        style="position:absolute;top:22px;right:80px"
        v-model="reimbursementFlag"
        size="small"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="expenditureAmountChange"
        active-text="不走报销流程"
        inactive-text="走报销流程"
        active-value="0"
        inactive-value="1">
      </el-switch> -->
      <el-form ref="modelTable" :model="modelData" :rules="rules" :inline="true" label-width="150px">
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
            @input="expenditureAmountChange"
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
        <el-card v-if="reimbursementFlag == 1" class="mb20">
            <el-form-item label="报销人" prop="reimbursementBy">
                <el-select
                  :style="{width:'200px'}"
                  v-model="modelData.reimbursementBy"
                  size="mini"
                  filterable
                  placeholder="请选择"
                >
                <el-option
                  v-for="item in user"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
          </el-select>
            </el-form-item>
            <el-form-item label="报销费用（cny）" prop="reimbursementTotalWage">
              <el-input-number
                :style="{width:'200px'}"
                :controls="false"
                :disabled="true"
                v-model="modelData.reimbursementTotalWage"
                size="mini"
                placeholder
              ></el-input-number>
            </el-form-item>
            <el-form-item label="报销事由" prop="reimbursementReason">
              <el-input :style="{width:'920px'}" size="mini" v-model="modelData.reimbursementReason"></el-input>
            </el-form-item>
        </el-card>
        <el-form-item label="备注">
          <el-input :style="{width:'920px'}" size="mini" maxlength="255" show-word-limit v-model="note" type="textarea"></el-input>
        </el-form-item>
        <!-- <el-form :inline="true" label-width="150px"> -->
        <el-form-item label="材料">
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
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import apiU from '@/api/user'
import api from '@/api/bd.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    applyVisible: {
      type: Boolean,
      default: false
    },
    activityData: {
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
      rules: {
        reimbursementBy: [{ required: true, message: '必填', trigger: 'blur' }],
        reimbursementReason: [{ required: true, message: '必填', trigger: 'blur' }],
        reimbursementTotalWage: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      reimbursementFlag: '0',
      modelData: {
        reimbursementBy: '',
        reimbursementReason: '',
        reimbursementTotalWage: ''
      },
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
      paymentList: []
    }
  },
  computed: {
    ...mapState('role', ['userInfo'])
  },
  watch: {
    applyVisible: function (val) {
      if (val) {
        console.log('yx11111111111')
        this.getCooperatorPaymentListByCooperatorIdNew()
        if (!this.user.length) {
          this.modelData.reimbursementBy = this.userInfo.userId
          this.pageInit()
        }
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      apiU
        .userList({
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
          this.user.forEach(v => {
            if (v.entryStatus == 2) {
              v.name += ' (离职)'
            }
          })
        })
      apiDic.getAuditorListByApplyType('bd_expenditure').then(res => {
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
    getRate () {
      apiDic.getRate({ currencyType: this.currencyType }).then(res => {
        this.exchangeRate = res.data ? res.data.exchangeRate : 1
        this.expenditureAmountChange()
      })
    },
    getCooperatorPaymentListByCooperatorIdNew () {
      api
        .getCooperatorPaymentListByCooperatorIdNew(this.activityData.cooperatorId)
        .then(res => {
          this.paymentList = res.data
        })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.payAccountId = ''
      this.expenditureAmount = null
      this.modelData = {
        reimbursementBy: '',
        reimbursementReason: '',
        reimbursementTotalWage: ''
      },
      this.currencyType = null
      this.exchangeRate = 0
      this.note = null
      this.fileList = []
      this.reimbursementFlag = '0'
      this.$refs.upload1.clearFiles()
      this.auditor = []
      this.copyTo = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    expenditureAmountChange () {
      this.modelData.reimbursementTotalWage = this.exchangeRate * 1 * this.expenditureAmount
    },
    submit () {
      console.log(
        'submit',
        this.fileList,
        this.auditor,
        this.copy,
        this.orderData
      )
      console.log(this.payAccountId)
      this.$refs.modelTable.validate(valid => {
        if (!valid) return
        // 验证
        if (!this.expenditureAmount) {
          this.$message('金额不能为空')
          return
        }
        if (this.reimbursementFlag == 0) {
          if (!this.payAccountId) {
            this.$message('收款账号不能为空')
            return
          }
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
        let a = ''
        if (this.reimbursementFlag == '0') {
          a = '否'
        } else {
          a = '是'
        }
        // this.payAccountId = Number(this.payAccountId)
        const data = {
          keyId: this.activityData.activityId,
          applyType: 'bd_expenditure',
          applyTitle: `BD[${this.activityData.cooperatorName}]活动(${this.activityData.activityName})的经费申请`,
          copyTo: copyTo,
          approval: approval,
          content: {
            file: [
              //  {name: '合同',
              //   url: this.activityData.contractVoucher
              //  }
            ],
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
                label: '合作商',
                value: this.activityData.cooperatorName
              },
              // {
              //   label: "合同名",
              //   value: this.activityData.contractName
              // },
              // {
              //   label: "合同ID",
              //   value: this.activityData.contractId
              // },
              {
                label: '申请时对应货币汇率',
                value: this.exchangeRate
              },
              {
                label: '备注',
                value: this.note
              },
              {
                label: '是否走报销流程',
                value: a
              }
            ],
            info: {
              reimbursementInfo: {
                reimbursementBy: this.modelData.reimbursementBy,
                reimbursementReason: this.modelData.reimbursementReason,
                reimbursementTotalWage: this.modelData.reimbursementTotalWage
              },
              reimbursementFlag: this.reimbursementFlag,
              note: this.note,
              fundType: this.currencyType,
              payAccount: '',
              fundWage: this.expenditureAmount,
              exchangeRate: this.exchangeRate,
              payAccountId: this.payAccountId,
              activityId: this.activityData.activityId,
              activityName: this.activityData.activityName,
              cooperatorId: this.activityData.cooperatorId,
              cooperatorName: this.activityData.cooperatorName
            }
          }
        }
        if (this.reimbursementFlag == '1') {
          let name = ''
          for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userId == this.modelData.reimbursementBy) {
              name = this.user[i].name
            }
          }
          data.content.text.push(
            { label: '报销人', value: name },
            { label: '报销事由', value: this.modelData.reimbursementReason },
            { label: '报销金额（￥）', value: this.modelData.reimbursementTotalWage }
          )
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
            uploadFunBySys(file.raw, `voucher/db/${this.activityData.activityId}_${~~(Math.random() * 1000)}`, url => {
              console.log(url)
              data.content.file.push({
                name: file.name,
                url: url
              })
              if (data.content.file.length === this.fileList.length) {
                console.log('bd_contract参数', data)
                api.applyContractPayment(data).then(res => {
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
          console.log(JSON.stringify(data))
          api.applyContractPayment(data).then(res => {
            console.log('bd_contract，', res)
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
