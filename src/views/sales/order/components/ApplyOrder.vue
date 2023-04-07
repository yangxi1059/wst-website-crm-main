<template>
  <div class="reimbursement">
    <el-dialog
      title="签约补充协议申请"
      :visible.sync="orderVisible"
      width="800px"
      :before-close="close"
    >
      <el-row class="mb10">
        
      </el-row>
      <el-form :inline="true" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px">
        <el-form-item label="订单ID">
            <el-input style="width:360px" v-model="orderId" :disabled="true" size="small"></el-input>
        </el-form-item>
        <el-form-item label="协议内容" prop="agreementContent">
            <el-input style="width:360px" type="textarea" placeholder="请输入内容"  maxlength="200" show-word-limit v-model="ruleForm.agreementContent" ></el-input>
        </el-form-item>
        <el-form-item label="签约方式" prop="signWay">
            <div>
                <el-radio v-model="ruleForm.signWay" style="margin-right:0px" label="online" border>线上签约</el-radio>
                <el-radio v-model="ruleForm.signWay" label="offline" border>线下签约</el-radio>
            </div>
        </el-form-item>
        <el-form-item label="合同公司" v-if="ruleForm.signWay == 'online'" prop="companyId">
            <el-select
              style="width:360px"
              v-model="ruleForm.companyId"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in wst_company"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
                :disabled="!item.accountId"
              ></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="补充协议文件(docx,pdf)" prop="fileList">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            :on-change="change"
            :on-remove="change"
            :on-exceed="exceed" 
            drag
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="审核人" v-if="auditorList.length <= 0" prop="auditor">
          <el-select
            :style="{width:'360px'}"
            v-model="ruleForm.auditor"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
               v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-else v-for="(item,index) in auditorList" :key="index" prop="auditor">
          <el-select
            :style="{width:'360px'}"
            v-model="item.auditor"
            multiple
            filterable
            @change="change1"
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送">
          <el-select :style="{width:'360px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
import axios from "@/api/dictionary";
import apiU from "@/api/user";
import { uploadFunBySys } from "@/libs/file";
export default {
  props: {
    orderVisible: {
      type: Boolean,
      default: false
    },
    orderId:{}
  },
  data: () => {
    return {
      options:[],
      ruleForm:{
        agreementContent:'',
        signWay:'',
        companyId:'',
        auditor:[],
        fileList:[],
      },
      user: [],
      auditor: "",
      copy: [],
      fileList: [],
      rules:{
        agreementContent: [
          { required: true, message: '必填', trigger: 'blur' },
        ],
        signWay: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        auditor:[
          { required: true, message: '必填', trigger: 'blur' }
        ],
        fileList:[
          { required: true, message: '必填', trigger: 'blur' }
        ],
      },
      auditorList: [
        {
          auditor: [],
          confirmCol: "",
          confirmorArr: [
            {
              confirmorName: "",
              isDefult: "",
              confirmCol: "",
              confirmType: "",
              confirmorId: ""
            }
          ]
        }
      ],
      wst_company:[]
    };
  },

  watch: {
    orderVisible: function(val) {
      if (val) {
    axios.getDicWstCompany().then(res => {
        this.wst_company = res.data;
      });
        // 初始化审核人列表
        axios.getAuditorListByApplyType("order_supplementary_contract").then(res => {
          console.log("order_supplementary_contract", res.data[0],res.data[0]);
          res.data.forEach(v => {
            v.auditor = [];
            v.confirmorArr.forEach(value => {
              if (value.isDefult == 1) {
                v.auditor.push(value.confirmorId);
              }
            });
          });
          this.auditorList = [...res.data];
          this.ruleForm.auditor = JSON.parse(JSON.stringify(this.auditorList[0].auditor));

        });
      }
    }
  },
  mounted() {
    // 抄送人列表
    apiU.userList({pageNum: 1,pageSize: 1000,}).then(({ data }) => {
        console.log(
          "userList...........................................",
          data
        );
        this.user = data.rows;
        this.user.forEach(v=>{
          if(v.entryStatus == 2){
            v.name += ' (离职)'
          }
        })
      });
  },
    methods: {
        close() {
            this.$emit("close");
            this.clear();
        },
        clear() {
          this.$refs.ruleForm.resetFields();
          this.fileList = [];
          this.auditor = "";
          this.ruleForm = {
            agreementContent:'',
            signWay:'',
            companyId:'',
            auditor:[],
            fileList:[]
          },
          this.copy = [];
        },
        change(file, fileList) {
            console.log(file, fileList);
            this.fileList = fileList;
            this.ruleForm.fileList = fileList;
        },
        change1(val){
          console.log(val)
          this.ruleForm.auditor = val;
        },
        exceed(){
            this.$message.error('此申请单次仅能上传一个文件~~')
        },
        submit() {
            this.$refs.ruleForm.validate((valid) => {
              if(valid){
                if (!this.fileList.length) {
                    this.$message("凭证材料不能为空");
                    return;
                }
                let approval = [];
                let cannot = false;
                this.auditorList.forEach(aa => {
                if (!aa.auditor.length) {
                    cannot = true;
                }
                aa.auditor.forEach(v => {
                    approval.push({ approverId: v });
                });
                });
                if (cannot) {
                this.$message({
                    type: "warning",
                    message: "审核人都为必填！"
                });
                return;
                }
                let copyTo = [];
                this.copy.forEach(v => {
                copyTo.push({ copyTo: v });
                });
                let data = {
                    orderId: this.orderId,
                    agreementContent: this.ruleForm.agreementContent,
                    signWay: this.ruleForm.signWay,
                    companyId: this.ruleForm.companyId || '',
                    filePath: '',
                    approval:approval,
                    copyTo:copyTo
                };
    
                if (this.fileList.length) {
                    for (let i = this.fileList.length - 1; i >= 0; i--) {
                        let file = this.fileList[i];
                        if(!file.name.includes('.docx') && !file.name.includes('.pdf')){
                            this.$message.error('请上传.docx或者.pdf文件！！')
                            return false
                        }
                        if(file.name.length > 100){
                            this.$message({
                            type:'error',
                            message:'凭证文件名不可超过100个字符'
                            })
                            return
                        }
                        uploadFunBySys(file.raw, `contract/temp`, url => {
                            data.filePath = url;
                            console.log(data,2222222222)
                            api.orderSupplementaryContract(data).then(res => {
                              console.log(res)
                                this.$loading().close();
                                this.$message.success("申请成功！！")
                                if(res.data.pageUrl){
                                  this.$confirm(`【${res.data.pageUrl}】`, '线上签约地址', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                  }).then(() => {
                                    this.$emit("submit");
                                    this.close()
                                  })
                                }else{
                                  this.$emit("submit");
                                  this.close()
                                }
                            }).catch(err => {
                                this.$message.error(err.message)
                                this.$loading().close();
                            })
                        });
                    }
                } else {
                    this.$message.error('文件必传')
                }
              }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>