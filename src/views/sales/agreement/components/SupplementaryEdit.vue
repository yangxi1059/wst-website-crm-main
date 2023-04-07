<template>
  <div class="reimbursement">
    <el-dialog
      title="修改模板"
      :visible.sync="editVisible"
      width="600px"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <!-- </el-card> -->
      <el-form :inline="true" :model="formData" :rules="rules" ref="ruleForm" label-width="145px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input
              type="textarea"
              v-model="formData.templateName"
              maxlength="100"
              style="width:360px"
              show-word-limit
            ></el-input>
        </el-form-item>
        <el-form-item label="适用场景" prop="applicableScene">
            <el-input
              type="textarea"
              v-model="formData.applicableScene"
              maxlength="200"
              style="width:360px"
              show-word-limit
            ></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="templateStatus">
          <el-select
            style="width:360px"
            v-model="formData.templateStatus"
          >
             <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材料、凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :limit="1"
            drag
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/sales_assistant";

import { uploadFunBySys } from "@/libs/file";
export default {
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    formDataNow:{},
    pkId:{}
  },
  data: () => {
    return {
      fileList: [],
      formData:{
        templateName:'',
        applicableScene:'',
        templateStatus:''
      },
      rules:{
        templateName:{ required: true, message: '必填', trigger: 'blur' },
        applicableScene:{ required: true, message: '必填', trigger: 'blur' },
        templateStatus:{ required: true, message: '必填', trigger: 'blur' },
      },
      options: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }]
    };
  },
  computed: {
    // reimbursement: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    editVisible: function(val) {
      if (val) {
        this.toPage()
      }
    }
  },
  methods: {
    toPage(){
      this.formData = JSON.parse(JSON.stringify(this.formDataNow))
      console.log(this.formData)
    },
    close() {
      this.$emit("close");
      this.clear();
    },
    clear() {
      this.fileList = [];
      this.$refs.ruleForm.resetFields();
      this.formData = {
        templateName:'',
        applicableScene:'',
        templateStatus:''
      }
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
        // 验证
          if (this.fileList.length) {
            for (let i = this.fileList.length - 1; i >= 0; i--) {
              let file = this.fileList[i];
              if(!file.name.includes('.docx')){
                this.$message.error('请上传.docx文件！！')
                return false
              }
            if(file.name.length > 100){
              this.$message({
                type:'error',
                message:'凭证文件名不可超过100个字符'
              })
              this.$loading().close();
              return
            }
              uploadFunBySys(file.raw, `contract/temp`, url => {
                console.log(url);
                let data = {
                  pkId:this.pkId,
                  templateName: this.formData.templateName,
                  applicableScene: this.formData.applicableScene,
                  templateStatus: this.formData.templateStatus,
                  filePath: url
                }
                api.editTemplate(data).then(res => {
                  this.$message.success('修改模板成功')
                  this.clear()
                  this.$emit('submit')
                })
              });
            }
          }else{
            let data = {
              pkId:this.pkId,
              templateName: this.formData.templateName,
              applicableScene: this.formData.applicableScene,
              templateStatus: this.formData.templateStatus,
            }
            api.editTemplate(data).then(res => {
              this.$message.success('修改模板成功')
              this.clear()
              this.$emit('submit')
            })
          }

        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>