<!--
 * @Author: 库建华
 * @Date: 2019-09-29 11:01:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-12 17:45:01
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog
      :title="'添加出账'"
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
        <el-form-item label="汇率:" prop="payRate">
          <el-input-number
            :controls="false"
            :style="{width:'200px'}"
            size="mini"
            v-model="submitData.payRate"
          ></el-input-number>
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
        <br>
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
        <el-form-item label="收款账户:" prop="payAcc">
          <el-input
            :style="{width:'550px'}"
            type="textarea"
            size="mini"
            v-model="submitData.payAcc"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付备注:" prop="payRemark">
          <el-input
            :style="{width:'600px'}"
            type="textarea"
            size="mini"
            v-model="submitData.payRemark"
          ></el-input>
        </el-form-item>
        <el-form-item label="凭证材料:">
          <p v-for="item in uploadFileList" :key="item.name">{{item.name}}</p>
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
import api from '@/api/sales_month_new'
import upload from '@/components/upload'
import { uploadFunBySys } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  components: { upload },
  mixins: [mixins],
  name: 'brokerage',
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
        payAmount: [{ required: true, message: '必填', trigger: 'blur' }],
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        payRate: [{ required: true, message: '必填', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payAcc: [{ required: true, message: '必填', trigger: 'blur' }],
        payRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },

      submitData: {
        applyId: null,
        payAmount: null,
        payType: null,
        payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0'
      },
      approval: '',
      copyTo: '',
      bill_currency_type: [],

      fileList: [],
      fileList2: [],
      uploadFileList: [],
      uploadFileList2: [],
      action: '',
      header: {
        Authorization: ''
      }
    }
  },
  watch: {},
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
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
        payId: undefined,
        applyId: null,
        payAmount: null,
        payAmountCny: null,
        payType: null,
        payRate: null,
        payDate: null,
        payVoucher: null,
        payRemark: null,
        payStatus: '0'
      }
      this.uploadFileList = []
      this.uploadFileList2 = []
    },
    // 确认
    submit () {
      this.$refs.submitData.validate(valid => {
        if (!valid) return
        if (!this.uploadFileList2.length || !this.uploadFileList.length) {
          this.$message({
            message: '凭证必传',
            type: 'error'
          })
          return
        }
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          applyTitle: '支付记录',
          // copyTo: copyTo,
          // approval: approval,
          content: {
            file: this.uploadFileList,
            text: [
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
            ]
          },
          pay: {
            payType: this.submitData.payType.split('&&')[0],
            payAmount: this.submitData.payAmount,
            payRate: this.submitData.payRate,
            payAcc: this.submitData.payAcc,
            payDate: this.submitData.payDate,
            payRemark: this.submitData.payRemark,
            payVoucher: this.uploadFileList2[0].url
          }
        }
        console.log('addMoneyOut参数', data)
        api.addMoneyOut(data).then(res => {
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
    // 凭证
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
</style>
