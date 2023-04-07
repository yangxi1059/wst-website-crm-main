<!--
 * @Author: 杨曦
 * @Date: 2021-12-07 17:23:05
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-08 10:54:10
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-dialog  width="420px" :show-close="closeStatue?true:false" :close-on-click-modal="closeStatue?true:false" :close-on-press-escape="closeStatue?true:false" :visible.sync="showVisible" :before-close="userClosed">
        <div>
            <div style="font-size:14px">此身份为销售助理可以设置其提成比例，必填</div>
            <div style="margin-top: 15px;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                    <el-form-item  prop="bdBrokerageRate2">
                        <el-input placeholder="请输入0-100数字" v-model="ruleForm.bdBrokerageRate2" >
                            <template slot="append">%</template>
                        </el-input>
                </el-form-item>
                </el-form>
            </div>
        </div>
        <div slot="footer"  class="dialog-footer">
            <el-button size="mini" type="danger" @click="userClosed2">取消提成</el-button>
            <el-button size="mini" type="primary"  @click="submit">设置</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'setUser',
  props: {
    bdBrokerageRate: {},
    showVisible: {
      type: Boolean,
      default: false
    },
    closeStatue: {}
  },
  watch: {
    showVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  data () {
    return {
      ruleForm: {
        bdBrokerageRate2: ''
      },
      rules: {
        bdBrokerageRate2: [{ pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/, message: '0-100数字,小数点保留2位', trigger: 'blur' }]
      }
    }
  },
  mounted () {

  },
  methods: {
    Topage () {
      if (this.bdBrokerageRate) {
        this.ruleForm.bdBrokerageRate2 = this.bdBrokerageRate * 100
      } else {
        this.ruleForm.bdBrokerageRate2 = ''
      }
    },
    clear () {
      this.ruleForm.bdBrokerageRate2 = ''
    },
    userClosed () {
      this.$emit('close', 0)
      this.clear()
    },
    userClosed2 () {
      this.$emit('submit', 0)
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.ruleForm.bdBrokerageRate2)
          this.clear()
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.yx_user .el-transfer-panel__header .el-checkbox{
  display: none !important;
}
</style>
