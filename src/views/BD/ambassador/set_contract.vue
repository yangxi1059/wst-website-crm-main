<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="cacheContractData.contractId ? '编辑合同':'新增合同'"
      :visible.sync="setContractVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheContractData"
        :rules="rules"
        ref="cacheContractData"
        label-width="120px"
      >
        <el-form-item label="开始日期" prop="contractStartDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheContractData.contractStartDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="contractEndDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheContractData.contractEndDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同周期" prop="contractDuration">
          <el-input
            :style="{width:widths}"
            v-model="cacheContractData.contractDuration"
            maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同签订日期" prop="contractSignDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheContractData.contractSignDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同金额类型" prop="salaryType">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheContractData.salaryType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同金额" prop="salary">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheContractData.salary"
            maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input :style="{width:widths}" v-model="cacheContractData.contractName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合同简介" prop="contractIntroduction">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheContractData.contractIntroduction"
            :autosize="{minRows:3}"
            maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同上传">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys } from '@/libs/file'

export default {
  name: 'setContract',
  mixins: [mixins],
  props: {
    setContractVisible: {
      type: Boolean,
      default: false
    },
    contractData: {
      type: Object
    }
  },
  data () {
    return {
      cacheContractData: {
        cooperatorId: null,
        contractStartDate: null,
        contractEndDate: null,
        contractDuration: null,
        contractSignDate: null,
        salaryType: null,
        salary: null,
        contractName: null,
        contractIntroduction: null
        // contractStatus: null
      },

      bill_currency_type: [],
      sign_way_type: [],

      widths: '250px',
      rules: {
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'blur' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        contractStartDate: [{ required: true, message: '必填', trigger: 'blur' }],
        contractEndDate: [{ required: true, message: '必填', trigger: 'blur' }],
        contractDuration: [{ required: true, message: '必填', trigger: 'blur' }],
        contractSignDate: [{ required: true, message: '必填', trigger: 'blur' }],
        salaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        salary: [{ required: true, message: '必填', trigger: 'blur' }],
        contractName: [{ required: true, message: '必填', trigger: 'blur' }],
        contractIntroduction: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  computed: {},
  watch: {
    setContractVisible: function (val) {
      if (val) {
        this.cacheContractData = { ...this.contractData }
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.sign_way_type = await this.getDictionary('sign_way_type')
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.$refs.cacheContractData.resetFields()
      this.cacheContractData = {
        cooperatorId: null,
        contractStartDate: null,
        contractEndDate: null,
        contractDuration: null,
        contractSignDate: null,
        salaryType: null,
        salary: null,
        contractName: null,
        contractIntroduction: null
        // contractStatus: null
      }
      this.fileList = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList.slice(-1)
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheContractData,
        this.cacheContractData
      )
      if (!this.fileList.length && !this.cacheContractData.contractVoucher) {
        this.$message({
          message: '合同必传',
          type: 'error'
        })
        return
      }
      this.$refs.cacheContractData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        if (this.fileList.length) {
          const file = this.fileList[0]
          uploadFunBySys(
            file.raw,
            `cooperatorContract/${this.cacheContractData.cooperatorId}`,
            url => {
              console.log(url)
              this.cacheContractData.contractVoucher = url
              this.setContract()
            }
          )
        } else {
          this.setContract()
        }
      })
    },
    setContract () {
      if (this.cacheContractData.contractId) {
        api
          .uptAmbassadorContract(this.cacheContractData)
          .then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      } else {
        api
          .addAmbassadorContract(this.cacheContractData)
          .then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '失败',
              type: 'error'
            })
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
