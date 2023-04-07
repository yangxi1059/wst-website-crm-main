<!--
 * @Author: 杨曦
 * @Date: 2022-09-26 11:22:01
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-26 11:32:32
 * @Version:
 * @Description:
-->
<template>
  <div>
  <el-dialog :close-on-click-modal="false"
    :visible.sync="changeSignVisible"
    width="400px"
    :before-close="addNewClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      inline
      label-width="150px"
    >
        <el-form-item label="价格是否允许修改：" prop="priceModify">
            <el-switch
                v-model="ruleForm.priceModify"
                active-text="允许"
                inactive-text="不允许">
            </el-switch>
        </el-form-item>
        <el-form-item label="课时是否允许修改：" prop="lessonHourModify">
            <el-switch
                v-model="ruleForm.lessonHourModify"
                active-text="允许"
                inactive-text="不允许">
            </el-switch>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addNewClose">取 消</el-button>
    <el-button type="primary" @click="addNewItemSubmit">设 置</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'

export default {
  name: 'addNew',
  props: {
    changeSignVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ruleForm: {
        priceModify: false,
        lessonHourModify: false
      },
      rules: {
        priceModify: [{ required: true, message: '必填', trigger: 'blur' }],
        lessonHourModify: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    changeSignVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
        api.getChangeSign().then(res => {
            console.log(res)
            this.ruleForm = res.data
        })
    },
    clear () {
      this.ruleForm = {
        priceModify: false,
        lessonHourModify: false
      }
    },
    addNewItemSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        api.changeSign(this.ruleForm).then(res => {
            this.addNewClose()
            this.$message.success('设置成功 ！！')
        })
      })
    },
    addNewClose () {
      this.clear()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .contract-name {
    display: inline-block;
    width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .te-yangxi_ipt{
    display: flex;
  }
  .te-yangxi_ipt .el-form-item__content{
    display: flex;
  }
  .drawer_container{
    padding:0 20px;
    .drawer_footer{
      padding: 20px;
      padding-top: 10px;
      text-align: right;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
</style>
