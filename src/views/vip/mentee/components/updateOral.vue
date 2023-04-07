<!--
 * @Author: 杨曦
 * @Date: 2022-08-10 16:35:14
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-10 17:23:18
 * @Version:
 * @Description:
-->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      class="update-dialog"
      title="设置口语课时"
      :visible.sync="updateOralVisible"
      width="600px"
      :before-close="close"
    >
      <el-form :inline="true" ref="signTable" label-width="200px" :rules="rules" :model="oralData">
        <el-form-item label="行业+口语课时（总课时）"  >
            <div class="yx_el_input">{{total}}</div>
        </el-form-item>
        <el-form-item label="行业导师一对一（求职）"  >
          <div v-if="oralData.mentorHour == -1" class="yx_el_input">{{noNumber}}</div>
          <el-input-number :disabled="true" v-else :controls="false" :style="{width:'230px'}" v-model="oralData.mentorHour"></el-input-number>
        </el-form-item>
        <el-form-item label="行业导师一对一（口语）"  prop="oralLessonHour">
          <el-input-number @change="(currentValue, oldValue) => oralChange(currentValue, oldValue)" v-if="total == '不限'" :controls="false" :style="{width:'230px'}" v-model="oralData.oralLessonHour"></el-input-number>
          <el-input-number @change="(currentValue, oldValue) => oralChange(currentValue, oldValue)"  v-else :controls="false" :style="{width:'230px'}" v-model="oralData.oralLessonHour"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
export default {
  props: {
    updateOralVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ''
    },
    mentorHour: {},
    oralLessonHour: {}
  },
  data: () => {
    return {
      noNumber: '不限',
      total: '',
      maxNum: 0,
      oralData: {
        mentorHour: 0,
        oralLessonHour: 0
      },
      rules: {
        oralLessonHour: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    updateOralVisible: function (val, old) {
      if (val) {
        this.oralData = {
          mentorHour: JSON.parse(JSON.stringify(this.mentorHour)),
          oralLessonHour: JSON.parse(JSON.stringify(this.oralLessonHour))
        }
        if (this.mentorHour == '-1') {
          this.total = '不限'
        } else {
          this.total = this.mentorHour * 1 + this.oralLessonHour * 1
          this.maxNum = this.total
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    clear () {
      this.total = ''
      this.maxNum = 0
      this.oralData = {
        mentorHour: 0,
        oralLessonHour: 0
      }
    },
    oralChange (currentValue, oldValue) {
      if (this.total == '不限') {

      } else {
        if (this.oralData.oralLessonHour > this.total) {
          this.$message.warning('口语课时超过总课时，请检查 ！！')
        } else {
          this.oralData.mentorHour = this.total - this.oralData.oralLessonHour
        }
      }
    },
    close () {
      this.clear()
      this.$emit('close')
      this.$refs.signTable.resetFields()
    },
    submit () {
      console.log('submit',this.total)
      this.$refs.signTable.validate(valid => {
        if (!valid) return
        if (this.total == '不限') {
          this.submit2()
        } else {
          if (this.oralData.oralLessonHour > this.total) {
            this.$message.warning('口语课时超过总课时，请检查 ！！')
            return false
          } else {
            this.submit2()
          }
        }
      })
    },
    submit2 () {
      const data = {
        signId: this.signId,
        oralLessonHour: this.oralData.oralLessonHour,
        mentorHour: this.oralData.mentorHour
      }
      console.log(data)
      api.updateSignData2(data).then(res => {
        this.clear()
        this.$message.success('更新成功 ！！')
        console.log('更新', res)
        this.$emit('submit')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.yx_el_input{
    text-align:center;
    width:230px;
    border-color: #E4E7ED;
    height: 28px;
    line-height: 28px;
    cursor: not-allowed;
    background-color: #F5F7FA;
    color: #C0C4CC;
    font-size: 12px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
}
.update-dialog p{
    margin: 0px !important;
}
</style>
