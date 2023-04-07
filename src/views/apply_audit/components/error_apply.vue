<!--
 * @Author: 杨曦
 * @Date: 2020-08-24 09:56:01
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-21 17:47:06
 * @Version: 
 * @Description: 
-->
<template>
  <div class="mentor-delete">
      <el-dialog :close-on-click-modal="false"
      :title="'支付错误申请'"
      :visible.sync="errorDetailVisible"
      width="1000px"
      
      :before-close="handleClose"
    >
       <el-form
        :model="ruleForm"
        :inline="true"
        :rules="rules"
        size="mini"
        ref="ruleForm"
        label-width="160px"
      >
         <el-form-item label="出错原因" prop="errorRetuenMsg">
          <el-input style="width:700px" v-model="ruleForm.errorRetuenMsg" type="textarea" show-word-limit maxlength="255" :rows="4" placeholder="请输入错误理由"></el-input>
        </el-form-item>
       </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip.js";
export default {
  name: "errorApply",
  props: {
    errorDetailVisible: {
      type: Boolean,
      default: false
    },
    applyId: {
      type: String
    },
    payId:{
    }
  },
  data(){
    return{
      ruleForm:{
        errorRetuenMsg:'',
      },
      rules: {
        errorRetuenMsg: [{ required: true, message: '请输入出错原因', trigger: 'blur' }]
      }
    }
  },
  watch: {
    errorDetailVisible: function(val) {
      if (val) {
        console.log("当前的申请Id", this.applyId);
        this.Topage();
      }
    }
  },
  methods:{
    Topage(){
      console.log(this.applyId)
    },
    handleClose(){
      this.ruleForm.errorRetuenMsg = '';
      this.$emit('close')
    },
    submit(){
      this.$refs.ruleForm.validate((valid) => {
        if(!valid){
          return
        }
        let data = {
          applyId: this.applyId,
          payId: this.payId,
          errorReason: this.ruleForm.errorRetuenMsg
        }
        console.log(data)
        api.errorApproveMentorPayment(data).then((res)=>{
          console.log(res,'申请支付错误成功')
          this.$message({
              message: "申请支付异常成功",
              type: "success"
          });
          this.ruleForm.errorRetuenMsg = '';
          this.$emit('submit')
        }).catch(err=>{
          console.log(err,"申请支付异常失败")
          this.$message({
              message: "申请支付异常失败",
              type: "error"
          });
        })
      })
    }
  }
}
</script>