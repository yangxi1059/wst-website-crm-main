<!--
 * @Author: 杨曦
 * @Date: 2022-12-06 14:53:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-06 15:09:29
 * @Version:
 * @Description:
-->
<!--
 * @Author: kaan
 * @Date: 2022-01-07 09:23:43
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-05 17:06:25
 * @Version:
 * @Description:
-->
<template>
    <el-dialog
      :close-on-click-modal="false"
      title="渠道评价"
      :visible.sync="sourceFeedBackVisible"
      width="800px"
      append-to-body
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="menteeDetail"
        :rules="rules2"
        ref="ruleForm"
        label-width="200px"
      >
          <el-form-item label="购买力" prop="purchasingPowerScore">
            <el-rate v-model="menteeDetail.purchasingPowerScore" :max="10" style="line-height:2"></el-rate>
          </el-form-item>
          <el-form-item label="求职项目意向度" prop="careerIntentionScore">
            <el-rate v-model="menteeDetail.careerIntentionScore" :max="10" style="line-height:2"></el-rate>
          </el-form-item>
          <el-form-item label="求职内容感兴趣度" prop="careerAttractionScore">
            <el-rate v-model="menteeDetail.careerAttractionScore" :max="10" style="line-height:2"></el-rate>
          </el-form-item>
          <el-form-item label="用户背景与产品契合度" prop="wstIntegratingScore">
            <el-rate v-model="menteeDetail.wstIntegratingScore" :max="10" style="line-height:2"></el-rate>
          </el-form-item>
          <el-form-item label="学生渠道评分" prop="sourceFromScore">
            <el-rate v-model="menteeDetail.sourceFromScore" :max="10" style="line-height:2"></el-rate>
          </el-form-item>
          <el-form-item label="学生渠道评价" prop="sourceFromNote">
            <el-input
              style="width:540px"
              resize="none"
              maxlength="200"
              show-word-limit
              :rows="3"
              type="textarea"
              v-model="menteeDetail.sourceFromNote"
            ></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="validSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </template>

<script>
import api from '@/api/assistant.js'
export default {
  name: 'MenteeInput',
  props: {
    sourceFeedBackVisible: {
      type: Boolean,
      default: false
    },
    menteeId: {}
  },
  data () {
    return {
      menteeDetail: {
        purchasingPowerScore: null,
        careerIntentionScore: null,
        careerAttractionScore: null,
        wstIntegratingScore: null,
        sourceFromScore: null,
        sourceFromNote: ''
      },
      rules2: {
        purchasingPowerScore: [{ required: true, message: '必填', trigger: 'blur' }],
        careerIntentionScore: [{ required: true, message: '必填', trigger: 'blur' }],
        careerAttractionScore: [{ required: true, message: '必填', trigger: 'blur' }],
        wstIntegratingScore: [{ required: true, message: '必填', trigger: 'blur' }],
        sourceFromNote: [{ required: true, message: '必填', trigger: 'blur' }],
        sourceFromScore: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    sourceFeedBackVisible: function (val) {
      if (val) {

      }
    }
  },
  mounted () {
  },
  methods: {
    handleClose () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.$refs.ruleForm.resetFields()
    },
    validSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.menteeDetail.menteeId = this.menteeId
        api.setSourceFormfeedback(this.menteeDetail).then(res => {
          this.clear()
          this.$emit('submit')
          this.$message.success('提交成功！！')
        })
      })
    }
  }
}

</script>
