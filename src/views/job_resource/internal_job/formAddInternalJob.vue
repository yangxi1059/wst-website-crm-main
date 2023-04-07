<!--
 * @Author: 杨曦
 * @Date: 2022-08-29 10:34:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-01 15:49:25
 * @Version:
 * @Description:
-->
<template>
  <div class="internal-edit ">
    <el-dialog v-loading="loading"  append-to-body :close-on-click-modal="false" :visible.sync="formVisible" width="640px" :before-close="close">
      <div >
        <el-form :inline="true" :model="internalData" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="微信号" prop="wxId">
                <el-input style="width:150px" :disabled="internalData.providerType == 'mentor'" v-model="internalData.wxId"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input style="width:150px" :disabled="internalData.providerType == 'mentor'" v-model="internalData.email"></el-input>
            </el-form-item>
            <el-form-item label="公司" prop="companyId">
                <el-select style="width:150px" filterable :disabled="internalData.providerType == 'mentor'" v-model="internalData.companyId" placeholder="">
                    <el-option v-for="item in companyList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提供人姓名" prop="providerName">
                <el-input style="width:150px" :disabled="internalData.providerType == 'mentor'" v-model="internalData.providerName"></el-input>
            </el-form-item>
            <el-form-item label="offer费用货币" prop="offerFeeType">
                <el-select style="width:150px" v-model="internalData.offerFeeType" placeholder="请选择">
                    <el-option v-for="item in feeType" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="offer费用金额" prop="offerFee">
                <el-input-number style="width:150px" :controls="false" v-model="internalData.offerFee"></el-input-number>
            </el-form-item>
            <el-form-item label="面试费用货币" prop="interviewFeeType">
                <el-select style="width:150px" v-model="internalData.interviewFeeType" placeholder="请选择">
                    <el-option v-for="item in feeType" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="面试费用金额" prop="interviewFee">
                <el-input-number style="width:150px" :controls="false" v-model="internalData.interviewFee"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="提供人类型" prop="providerType">
                <el-select style="width:150px" :disabled="internalData.providerType == 'mentor'" v-model="internalData.providerType" placeholder="请选择">
                    <el-option v-for="item in providerTypeList" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="启用状态" prop="providerStatus">
              <el-radio-group style="width:150px" v-model="internalData.providerStatus">
                <el-radio v-for="item in providerStatusList" :key="item.itemValue" :label="item.itemValue" >{{item.itemName}}</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" v-if="!internalData.providerId" @click="submit" >新 增</el-button>
        <el-button type="primary" v-if="internalData.providerId" @click="update" >更新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    formVisible: {
      type: Boolean,
      default: false
    },
    internalData1: {}
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { },
  data: () => {
    return {
      loading: false,
      rules: {
        providerType: [{ required: true, message: '必填', trigger: 'blur' }],
        wxId: [{ required: true, message: '必填', trigger: 'blur' }],
        // email: [{ required: true, message: '必填', trigger: 'blur' }],
        // companyId: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewFeeType: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewFee: [{ required: true, message: '必填', trigger: 'blur' }],
        offerFeeType: [{ required: true, message: '必填', trigger: 'blur' }],
        providerName: [{ required: true, message: '必填', trigger: 'blur' }],
        offerFee: [{ required: true, message: '必填', trigger: 'blur' }],
        providerStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      mentorId: '',
      feeType: [
        { itemName: '人民币', itemValue: 'cny' },
        { itemName: '美金', itemValue: 'usd' }
      ],
      providerTypeList: [
        { itemName: '导师', itemValue: 'mentor' },
        { itemName: '其他', itemValue: 'other' }
      ],
      providerStatusList: [
        { itemName: '禁用', itemValue: '1' },
        { itemName: '启用', itemValue: '0' }
      ],
      companyList: [],
      internalData: {
        providerId: '',
        providerType: '',
        referId: '',
        providerName: '',
        wxId: '',
        email: '',
        companyId: '',
        interviewFeeType: '',
        interviewFee: '',
        offerFeeType: '',
        offerFee: '',
        providerStatus: ''
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    formVisible: function (val) {
      if (val) {
        this.internalData = JSON.parse(JSON.stringify(this.internalData1))
      }
    }
  },
  methods: {
    async pageInit () {
      this.companyList = await this.getCompany()
    },
    close () {
      this.clear()
      this.$refs.ruleForm.resetFields()
      this.$emit('close')
    },
    clear () {
      this.internalData = {
        providerId: '',
        providerType: '',
        referId: '',
        providerName: '',
        wxId: '',
        email: '',
        companyId: '',
        interviewFeeType: '',
        interviewFee: '',
        offerFeeType: '',
        offerFee: '',
        providerStatus: ''
      }
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = {
            providerType: this.internalData.providerType,
            referId: this.internalData.referId,
            providerName: this.internalData.providerName,
            providerStatus: this.internalData.providerStatus,
            wxId: this.internalData.wxId,
            email: this.internalData.email,
            companyId: this.internalData.companyId,
            interviewFeeType: this.internalData.interviewFeeType,
            interviewFee: this.internalData.interviewFee,
            offerFeeType: this.internalData.offerFeeType,
            offerFee: this.internalData.offerFee
          }
          this.loading = true
          console.log(data)
          api.addInternalJob(data).then(res => {
            this.clear()
            this.$emit('submit')
            this.$message.success('新增成功！！')
            this.loading = false
          })
        }
      })
    },
    update () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = {
            providerId: this.internalData.providerId,
            providerType: this.internalData.providerType,
            referId: this.internalData.referId,
            providerName: this.internalData.providerName,
            providerStatus: this.internalData.providerStatus,
            wxId: this.internalData.wxId,
            email: this.internalData.email,
            companyId: this.internalData.companyId,
            interviewFeeType: this.internalData.interviewFeeType,
            interviewFee: this.internalData.interviewFee,
            offerFeeType: this.internalData.offerFeeType,
            offerFee: this.internalData.offerFee
          }
          this.loading = true
          console.log(data)
          api.upDateInternalJob(data).then(res => {
            this.clear()
            this.$emit('submit')
            this.$message.success('更新成功！！')
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
