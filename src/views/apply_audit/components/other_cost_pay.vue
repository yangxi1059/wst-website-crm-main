<!--
 * @Author: 库建华
 * @Date: 2019-09-29 11:01:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-28 11:06:21
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog
      :title="'其他运营成本'"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="submitData"
        :rules="rules"
        ref="submitData"
        label-width="160px"
      >
        <el-form-item label="运营成本类型:" prop="operateType">
          <el-select :style="{width:'200px'}" v-model="submitData.operateType">
            <el-option
              v-for="(item) in operate_cost_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '&&' + item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成本说明:">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="submitData.content"
            :maxlength="200"
            placeholder="200字以内"
          ></el-input>
        </el-form-item>
        <el-form-item label="周期:" prop="period">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="submitData.period"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收款账户类型:" prop="payAccType">
          <el-select :style="{width:'200px'}" v-model="submitData.payAccType">
            <el-option
              v-for="(item) in payment_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '&&' + item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款账号:" prop="payAcc">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="submitData.payAcc"
          ></el-input>
        </el-form-item>
        <el-form-item label="出账账户:" prop="paymentAccount">
          <el-select :style="{width:'200px'}" v-model="submitData.paymentAccount">
            <el-option
              v-for="(item) in payment_account"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '&&' + item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款货币类型:" prop="payType">
          <el-select :style="{width:'200px'}" v-model="submitData.payType">
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '&&' + item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇率:" prop="payRate">
          <span class="programName">{{submitData.payRate}}</span>
        </el-form-item>
        <el-form-item label="实际付款金额:" prop="payAmount">
          <el-input-number
            :controls="false"
            :style="{width:'200px'}"
            size="mini"
            v-model="submitData.payAmount"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="支付日期:" prop="payDate">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="submitData.payDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手续费:" prop="commissionAmount">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              更新实际付款金额自动计算手续费，更新手续费不影响付款金额
              <br />两者货币类型保持一致
            </div>
            <el-input :style="{width:'200px'}" size="mini" v-model="submitData.commissionAmount"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="手续费说明:">
          <el-input
            :style="{width:'200px'}"
            size="mini"
            v-model="submitData.commissionFor"
            :maxlength="200"
            placeholder="200字以内"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付备注:" prop="payRemark">
          <el-input
            :style="{width:'570px'}"
            type="textarea"
            size="mini"
            v-model="submitData.payRemark"
          ></el-input>
        </el-form-item>
        <el-form-item label="凭证材料:">
          <p v-for="item in uploadFileList" :key="item.name">{{item.voucherName}}</p>
          <el-upload
            :http-request="uploadFileAxios"
            :file-list="fileList"
            class="upload"
            ref="elupload"
            :action="action"
            drag
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="支付凭证:">
          <p v-for="item in uploadFileList2" :key="item.name">{{item.name}}</p>
          <el-upload
            :http-request="uploadFileAxios2"
            :file-list="fileList2"
            class="upload"
            ref="elupload2"
            :action="action"
            drag
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import upload from '@/components/upload'
import { uploadFunBySys } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  components: { upload },
  name: 'brokerage',
  mixins: [mixins],
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        operateType: [{ required: true, message: '必填', trigger: 'blur' }],
        payAccType: [{ required: true, message: '必填', trigger: 'blur' }],
        period: [{ required: true, message: '必填', trigger: 'blur' }],
        payAcc: [{ required: true, message: '必填', trigger: 'blur' }],
        paymentAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }],
        commissionAmount: [{ required: true, message: '必填', trigger: 'blur' }]
      },

      submitData: {
        operateType: null,
        content: null,
        period: null,
        payAccType: null,
        payAcc: null,
        paymentAccount: null,
        applyId: null,
        payAmount: null,
        payType: null,
        payRate: 1,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0',
        commissionAmount: 0,
        commissionFor: ''
      },
      approval: '',
      copyTo: '',
      payment_type: [],
      payment_account: [],
      bill_currency_type: [],
      operate_cost_type: [],

      fileList: [],
      fileList2: [],
      uploadFileList: [],
      uploadFileList2: [],
      uploadFileList3: [],
      action: '',
      header: {
        Authorization: ''
      }
    }
  },
  watch: {

  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.payment_type = await this.getDictionary('payment_type')
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.payment_account = await this.getDictionary('payment_account')
      this.operate_cost_type = await this.getDictionary('operate_cost_type')
    },
    // 关闭
    handleClose () {
      // this.$refs.brokerageData.resetFields();
      this.$emit('close')
      this.clear()
    },
    upLoadF (v) {
      console.log('upLoadF', v)
      this.file = v
    },
    callbackfile (val) {
      console.log('callbackfile', val)
      this.file = val
    },
    clear () {
      this.submitData = {
        operateType: null,
        content: null,
        period: null,
        payAccType: null,
        payAcc: null,
        paymentAccount: null,
        applyId: null,
        payAmount: null,
        payType: null,
        payRate: 1,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0',
        commissionAmount: 0,
        commissionFor: ''
      }
      this.uploadFileList = []
      this.uploadFileList2 = []
      this.uploadFileList3 = []
    },
    // 确认
    submit () {
      this.$refs.submitData.validate(valid => {
        if (!valid) return
        if (!this.uploadFileList2.length) {
          this.$message({
            message: '支付凭证必传',
            type: 'error'
          })
          return
        }
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          applyTitle: '其他运营费用-成本类型',
          // copyTo: copyTo,
          // approval: approval,
          content: {
            file: this.uploadFileList3,
            text: [
              {
                label: '运营成本类型',
                value: this.submitData.operateType.split('&&')[1]
              }, {
                label: '成本说明',
                value: this.submitData.content
              },
              {
                label: '周期',
                value: this.submitData.period
              },
              {
                label: '汇率',
                value: this.submitData.payRate
              },
              {
                label: '付款货币类型',
                value: this.submitData.payType.split('&&')[1]
              },
              {
                label: '付款金额',
                value: this.submitData.payAmount
              },
              {
                label: '收款账户类型',
                value: this.submitData.payAccType.split('&&')[1]
              },
              {
                label: '收款账户',
                value: this.submitData.payAcc
              },
              {
                label: '支付备注',
                value: this.submitData.payRemark
              },
              {
                label: '支付日期',
                value: this.submitData.payDate
              }
            ],
            info: {
              period: this.submitData.period,
              content: this.submitData.content,
              operateType: this.submitData.operateType.split('&&')[0],
              currencyType: this.submitData.payType.split('&&')[0],
              currencyAmount: this.submitData.payAmount,
              rate: this.submitData.payRate,
              paymentAccount: this.submitData.paymentAccount.split('&&')[0],
              paymentDate: this.submitData.payDate,
              voucherArr: this.uploadFileList
            }
          },
          pay: {
            payType: this.submitData.payType.split('&&')[0],
            payAmount: this.submitData.payAmount,
            payRate: this.submitData.payRate,
            payAccType: this.submitData.payAccType.split('&&')[0],
            payAcc: this.submitData.payAcc,
            payDate: this.submitData.payDate,
            payRemark: this.submitData.payRemark,
            payVoucher: this.uploadFileList2[0].url,
            paymentAccount: this.submitData.paymentAccount.split('&&')[0],
            commissionAmount: this.submitData.commissionAmount
          }
        }
        console.log('addMoneyOut参数', data)
        api.setOtherOperateCostPay(data).then(res => {
          console.log('addMoneyOut', res)
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.$loading().close()
          this.clear()
          this.$emit('submit')
        })
      })
    },
    // 支付凭证
    uploadFileAxios2 (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, 'voucher/money_out_casher', url => {
        this.uploadFileList2 = [
          {
            url: url,
            name: file.file.name
          }
        ]
        this.$loading().close()
        this.$refs.elupload2.clearFiles()
      })
    },
    // 凭证上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, 'voucher/money_out', url => {
        this.uploadFileList.push({
          voucherPath: url,
          voucherName: file.file.name
        })
        this.uploadFileList3.push({
          url: url,
          name: file.file.name
        })
        this.$loading().close()
        this.$refs.elupload.clearFiles()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.programName {
  border-radius: 5px;
  padding: 0px 15px;
  border: 1px #dcdfe6 dashed;
  min-width: 168px;
  height: 26px;
  display: inline-block;
  // @extend %mm;
}
</style>
