<!--
 * @Author: 库建华
 * @Date: 2020-06-09 14:45:00
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-11 09:33:42
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog title="发票详情" :visible.sync="detailVisible" width="1500px" :before-close="close">
      <el-row class="mb10" v-if="!editVisible">
        <!-- <el-col :span="4" class="_item-name">是否开票</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceStatusName || '无'}}</el-col>-->
        <!-- <el-col :span="4" class="_item-name">订单ID</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.orderId || '无'}}</el-col>-->
        <el-col :span="4" class="_item-name">签约公司</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.signCompanyName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">开票公司</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceCompanyName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">开票金额</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceFund || '无'}}</el-col>
        <el-col :span="4" class="_item-name">发票类型</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceTypeName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">开票模式</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceModeName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">发票抬头/个人姓名</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceTitle || '无'}}</el-col>
        <el-col :span="4" class="_item-name">税号/身份证号</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceAccount || '无'}}</el-col>
        <el-col :span="4" class="_item-name">发票地址：</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceAddr || '无'}}</el-col>
        <el-col :span="4" class="_item-name">发票电话：</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoicePhone || '无'}}</el-col>
        <el-col :span="4" class="_item-name">开户行</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceBank || '无'}}</el-col>
        <el-col :span="4" class="_item-name">开户行账号</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceBankAccount || '无'}}</el-col>
        <!-- <el-col :span="4" class="_item-name">开票人</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceByName || '无'}}</el-col>
         <el-col :span="4" class="_item-name">开票时间</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.invoiceTime || '无'}}</el-col>
        <el-col :span="4" class="_item-name">创建人</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.createByName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">是否寄出</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.isSendName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">学员姓名</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.menteeName || '无'}}</el-col>-->
        <el-col :span="4" class="_item-name">收件人邮箱</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.recipientEmail || '无'}}</el-col>
        <el-col :span="4" class="_item-name">收件人姓名</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.recipientName || '无'}}</el-col>
        <el-col :span="4" class="_item-name">收件人电话</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.recipientPhone || '无'}}</el-col>
        <el-col :span="4" class="_item-name">收件人地址</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.recipientAddr || '无'}}</el-col>
        <el-col :span="4" class="_item-name">备注</el-col>
        <el-col :span="4" class="_item-value">{{invoiceData.remark || '无'}}</el-col>
      </el-row>
      <el-form
        v-else
        :inline="true"
        label-width="140px"
        :model="invoiceData"
        :rules="rules"
        ref="rule"
      >
        <el-form-item label="发票类型：" prop="invoiceType">
          <el-radio-group :style="{width: '530px'}" @change="changeInvoiceType2"  v-model="invoiceData.invoiceType">
            <el-radio v-for="item in invoice_type"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票公司：" prop="invoiceCompany">
          <el-select
            v-model="invoiceData.invoiceCompany"
            filterable
            placeholder="请选择"
            :style="{width:'530px'}"
          >
            <el-option
              v-for="item in wst_company"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票金额：" prop="invoiceFund">
          <el-input-number
            :controls="false"
            :style="{width: '530px'}"
            v-model="invoiceData.invoiceFund"
            :maxlength="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="开票方式" prop="invoiceMode">
          <el-radio-group :style="{width: '530px'}" :disabled="invoiceData.invoiceType == 'VAT_special_invoice'" v-model="invoiceData.invoiceMode">
            <el-radio  v-for="item in invoice_mode"
            :key="item.itemValue"
            :label="item.itemValue"
          >{{item.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名/公司抬头：" prop="invoiceTitle">
          <el-input :style="{width: '530px'}" v-model="invoiceData.invoiceTitle" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="身份证号/税号：" prop="invoiceAccount">
          <el-input :style="{width: '530px'}" v-model="invoiceData.invoiceAccount" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="发票地址：" prop="invoiceAddr">
          <el-input :style="{width: '530px'}" v-model="invoiceData.invoiceAddr" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="发票电话：" prop="invoicePhone">
          <el-input :style="{width: '530px'}" v-model="invoiceData.invoicePhone" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="开户行：" prop="invoiceBank">
          <el-input :style="{width: '530px'}" v-model="invoiceData.invoiceBank" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="开户行账号：" prop="invoiceBankAccount">
          <el-input
            :style="{width: '530px'}"
            v-model="invoiceData.invoiceBankAccount"
            :maxlength="100"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item v-if="invoiceData.invoiceMode == 'paper'" label="收货人名：" prop="recipientName">
          <el-input :style="{width: '530px'}" v-model="invoiceData.recipientName"></el-input>
        </el-form-item>
        <el-form-item v-if="invoiceData.invoiceMode == 'paper'" label="收货人电话：" prop="recipientPhone">
          <el-input :style="{width: '530px'}" v-model="invoiceData.recipientPhone"></el-input>
        </el-form-item>
        <el-form-item  v-if="invoiceData.invoiceMode == 'paper'" label="收货人地址：" prop="recipientAddr">
          <el-input :style="{width: '530px'}" v-model="invoiceData.recipientAddr"></el-input>
        </el-form-item>
        <el-form-item v-if="invoiceData.invoiceMode == 'electronic'" label="收件邮箱：" prop="recipientEmail">
          <el-input  :style="{width: '530px'}" v-model="invoiceData.recipientEmail"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop>
          <el-input :style="{width: '530px'}" v-model="invoiceData.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">发票对应入账</el-divider>
      <el-row v-for="bill in billList" :key="bill.applyId">
        <el-col :span="4" class="_item-name">入账账户</el-col>
        <el-col :span="4" class="_item-value">{{bill.account || '无'}}</el-col>
        <el-col :span="4" class="_item-name">入账金额</el-col>
        <el-col :span="4" class="_item-value">{{bill.revenue || '无'}}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" v-if="!editVisible" @click="edit">编辑</el-button>
        <el-button type="primary" v-else @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/sales_assistant.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
export default {
  name: 'invoice-detail',
  mixins: [mixins],
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    invoiceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      invoiceData: {
        invoiceType: '',
        invoiceMode: ''
      },
      billList: [],
      editVisible: false,
      invoice_mode: [],
      invoice_type: [],
      wst_company: [],
      rules: {
        invoiceType: { required: true, message: '必填', trigger: 'blur' },
        invoiceCompany: { required: true, message: '必填', trigger: 'blur' },
        invoiceFund: { required: true, message: '必填', trigger: 'blur' },
        invoiceTitle: { required: true, message: '必填', trigger: 'blur' },
        invoiceAccount: { required: true, message: '必填', trigger: 'blur' },
        recipientName: { required: true, message: '必填', trigger: 'blur' },
        invoiceMode: { required: true, message: "必填", trigger: "blur" },
        recipientEmail: { required: true, message: '必填', trigger: 'blur' },
        recipientPhone: { required: true, message: '必填', trigger: 'blur' },
        recipientAddr: { required: true, message: '必填', trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.getInvoiceDetailById()
        if (!this.wst_company.length) {
          this.init()
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.invoice_mode = await this.getDictionary('invoice_mode')
    },
    init () {
      apiDic.getDicDropdown('invoice_type,wst_company').then(res => {
        this.invoice_type = res.data.invoice_type
        this.wst_company = res.data.wst_company
      })
    },
    getInvoiceDetailById () {
      api.getInvoiceById(this.invoiceId).then(res => {
        console.log(res)
        this.invoiceData = res.data
        this.billList = res.data.billList
      })
    },
    close () {
      this.$emit('close')
      this.invoiceData = {
        invoiceType: '',
        invoiceMode: ''
      }
      this.editVisible = false
    },
    edit () {
      this.editVisible = true
    },
    changeInvoiceType2 () {
      if (this.invoiceData.invoiceType == 'VAT_special_invoice') {
        this.invoiceData.invoiceMode = 'paper'
      } else {
        this.invoiceData.invoiceMode = ''
      }
    },
    submit () {
      console.log(this.invoiceData)
      this.$refs.rule.validate(valid => {
        if (!valid) return

        api.uptInvoice(this.invoiceData).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.editVisible = false
          this.getInvoiceDetailById()
          this.$emit('submit')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
