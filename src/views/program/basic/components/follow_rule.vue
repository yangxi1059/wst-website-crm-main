<!--
 * @Author: 库建华
 * @Date: 2020-05-26 09:40:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 13:54:11
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="(followUpItem.programId ? '编辑' : '新增') + 'follow up规则'"
      :visible.sync="followUpVisible"
      width="500px"
      :before-close="followUpItemClose"
    >
      <el-form
        size="medium"
        inline
        :model="followUpItem"
        :rules="rules"
        ref="followUp"
        label-width="120px"
      >
        <el-form-item label="间隔天数" prop="intervalDay">
          <el-input-number
            :controls="false"
            :style="{width:'200px'}"
            v-model="followUpItem.intervalDay"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="容错天数" prop="tolerateDay">
          <el-input-number
            :controls="false"
            :style="{width:'200px'}"
            v-model="followUpItem.tolerateDay"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="更新时间" prop>
          <el-input :disabled="true" :style="{width:'200px'}" v-model="followUpItem.updateTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followUpItemClose">取 消</el-button>
        <el-button type="primary" @click="followUpItemSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'

export default {
  name: 'followUpRuleList',
  props: {
    followUpVisible: {
      type: Boolean,
      default: false
    },
    programId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      followUpItem: {},
      rules: {
        intervalDay: [{ required: true, message: '必填', trigger: 'blur' }],
        tolerateDay: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    followUpVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getFollowUpRule({ programId: this.programId }).then(res => {
        console.info(res)
        this.followUpItem = res.data || {}
      })
    },
    followUpItemClose () {
      this.followUpItem = {}
      this.$refs.followUp.resetFields()
      this.$emit('close')
    },
    followUpItemSubmit () {
      console.log(this.followUpItem)
      this.$refs.followUp.validate(valid => {
        if (!valid) return
        const data = {
          programId: this.programId,
          intervalDay: this.followUpItem.intervalDay,
          tolerateDay: this.followUpItem.tolerateDay
        }
        console.log(data)
        if (this.followUpItem.programId) {
          api
            .uptFollowUpRule(data)
            .then(res => {
              console.log(res)
              this.Topage()
              this.followUpItemClose()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
        } else {
          api
            .addFollowUpRule(data)
            .then(res => {
              console.log(res)
              this.Topage()
              this.followUpItemClose()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
