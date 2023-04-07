<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-05 11:18:39
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      title="新增固定返佣规则"
      :close-on-click-modal="false"
      :visible.sync="addRuleVisible"
      width="500px"
      :before-close="close"
    >
        <el-form :inline="true"
         :rules="rules"
         :model="formData"
         ref="ruleForm"
         label-width="200px">
            <el-form-item label="订单金额大于等于多少美金:" prop="ge">
                <el-input-number v-model="formData.ge" :controls="false" ></el-input-number>
            </el-form-item>
            <el-form-item label="订单金额小于等于多少美金:" prop="le">
                <el-input-number v-model="formData.le" :controls="false" ></el-input-number>
            </el-form-item>
            <el-form-item label="固定返佣（美金）:" prop="fixedBrokerage">
                <el-input-number v-model="formData.fixedBrokerage" :controls="false" ></el-input-number>
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
import api from '@/api/sales_assistant.js'

export default {
  props: {
    addRuleVisible: {
      type: Boolean,
      default: false
    },
    sourceId: {}
  },
  data: () => {
    return {
      formData: {
        ge: '',
        le: '',
        fixedBrokerage: ''
      },
      rules: {
        le: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        ge: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        fixedBrokerage: [
          { required: true, message: '必填', trigger: 'blur' }
        ]

      }
    }
  },
  created () {},
  watch: {
    addRuleVisible: function (val, old) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {

    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.$refs.ruleForm.resetFields()
      this.formData = {
        ge: '',
        le: '',
        fixedBrokerage: ''
      }
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = {
            sourceId: this.sourceId,
            ge: this.formData.ge,
            le: this.formData.le,
            fixedBrokerage: this.formData.fixedBrokerage
          }
          console.log(data)
          api.editRule(data).then(() => {
            this.clear()
            this.$emit('submit')
          })
        }
      })
    }
  }
}
</script>
