<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-03 14:47:33
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      append-to-body
      title="Bonus面试申请"
      :visible.sync="applyBonusInterviewVisible"
      width="600px"
      :before-close="close"
    >
        <el-form :inline="true"
         :rules="rules"
         :model="formData"
         ref="ruleForm"
         label-width="130px">
          
         
          <el-form-item label="申请金额："   >
            <span>{{applyData2.fundType=="cny"?'￥':'$'}}{{applyData2.fundWage}}</span>
          </el-form-item><br>
          <el-form-item label="支付方式："   prop="payType">
            <el-select
              v-model="formData.payType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in payWayList"
                :key="item.accountId"
                :label="item.paymentTypeName + ':' + item.payAcc"
                :value="item.accountId "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传凭证" prop="fileList">
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
          <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
              <el-select
                  :style="{width:'200px'}"
                  v-model="item.auditor"
                  multiple
                  filterable
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
            
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">申 请</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from "@/api/dictionary.js";
import api from "@/api/vip.js";
import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    applyBonusInterviewVisible: {
      type: Boolean,
      default: false
    },
    applyData2:{},
    mentorData:{},
  },
  data: () => {
    return {
        formData:{
            remark:'',
            story:'',
            payType:""
        },
        fileList:[],
        auditor: [],
        rules: {
          payType: [{ required: true, message: "必填", trigger: "blur" }],
        },
        payWayList:[],
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
                confirmorId: "",
                },
            ],
            },
        ],
    };
  },
  created() {},
  watch: {
    applyBonusInterviewVisible: function(val, old) {
      if (val) {
        this.applyData2.fundWage = this.applyData2.fundWage.toFixed(2)
        console.log(this.applyData2)
        this.init();
        this.Topage();
      }
    }
  },
  methods: {
    init() {
        apiDic.getAuditorListByApplyType("comm_mentor_bonus_interview").then((res) => {
          console.log("comm_mentor_bonus_interview", res.data);
          res.data.forEach((v) => {
            v.auditor = [];
            v.confirmorArr.forEach((value) => {
              if (value.isDefult == 1) {
                v.auditor.push(value.confirmorId);
              }
            });
          });
          this.auditorList = [...res.data];
        });
    },
    Topage() {
      api.getCooperatorPaymentListByCooperatorIdNew(this.mentorData.mentorId,true).then(res => {
        this.payWayList = res.data
        let arr = this.payWayList.filter(item => {
          return item.payStatus == 0
        })
        this.payWayList = arr;
        console.log(this.payWayList)
      })
    },
    close() {
        this.clear()

      this.$emit("close");
    },
    clear(){
      this.payWayList = [];
      this.fileList = [];
      this.auditor = [];
      this.formData.payType = ""
    },
    //录入信息，确认
    submit() {
        this.$refs.ruleForm.validate(valid => {
            if (!valid) return;
            // if (!this.fileList.length) {
            //   this.$message("凭证材料不能为空");
            //   return;
            // }
            let approval = [];
            let cannot = false;
            this.auditorList.forEach((aa) => {
                if (!aa.auditor.length) {
                cannot = true;
                }
                aa.auditor.forEach((v) => {
                approval.push({ approverId: v });
                });
            });
            if (cannot) {
                this.$message({
                type: "warning",
                message: "审核人都为必填！",
                });
                return;
            }
            if(approval && approval.length < 1){
                this.$message.error('审核人为必填项，若无审核人下拉项请联系部门领导反馈！！')
                return false
            }
            this.$loading()
            let data = {
                applyType:'comm_mentor_bonus_interview',
                copyTo:[],
                keyId:this.mentorData.mentorId,
                applyTitle:`导师【${this.mentorData.mentorName}】的Bonus申请`,
                approval: approval,
                content: {
                    file: [],
                    text:[
                      {
                        label:"导师名",
                        value:this.mentorData.mentorName
                      },
                      {
                        label:"货币类型",
                        value:this.applyData2.fundType
                      },
                      {
                        label:"申请金额",
                        value:this.applyData2.fundWage
                      },
                      {
                        label:"Bonus类型",
                        value:this.applyData2.bonusType
                      },
                      
                      // {
                      //   label:"申请周期",
                      //   value:this.applyData2.period
                      // },
                      {
                        label:"面试时间",
                        value:this.applyData2.timesName
                      },
                      {
                        label:"学员名",
                        value:this.applyData2.menteeName
                      },
                      {
                        label:"城市",
                        value:this.applyData2.cityName
                      },
                      {
                        label:"公司",
                        value:this.applyData2.companyName
                      },
                      {
                        label:"部门",
                        value:this.applyData2.divisionName
                      },
                      {
                        label:"申请季",
                        value:this.applyData2.applySeason
                      },
                    ],
                    info: {
                        mentorId:this.mentorData.mentorId,
                        fundType:this.applyData2.fundType,
                        fundWage:this.applyData2.fundWage,
                        payType:this.formData.payType,
                        resultId:this.applyData2.resultId,

                    },
                },
            };
        let payWay = this.payWayList.filter(
          v => v.accountId == this.formData.payType
        )[0];
        let account = "";
        for (let item in payWay) {
          switch (item) {
            case "paymentType": {
              account += "付款类型：" + payWay[item] + "  ;  ";
              break;
            }
            case "payAcc": {
              account += "账户：" + payWay[item] + "  ;  ";
              break;
            }
            case "bankName": {
              account += "银行：" + payWay[item] + "  ;  ";
              break;
            }
            case "realName": {
              account += "收款人姓名：" + payWay[item] + "  ;  ";
              break;
            }
            case "idCard": {
              account += "收款人身份证号：" + payWay[item] + "  ;  ";
              break;
            }
            case "bankAddress": {
              account += "Bank Address：" + payWay[item] + "  ;  ";
              break;
            }
            case "zip": {
              account += "ZIP：" + payWay[item] + "  ;  ";
              break;
            }
            case "routingNumber": {
              account += "Routing Number：" + payWay[item] + "  ;  ";
              break;
            }
            case "swiftCode": {
              account += "Swift Code：" + payWay[item] + "  ;  ";
              break;
            }
          }
        }
        if(account!=="") data.content.text.push({label:'支付方式',value:account});
            if (this.fileList.length) {
                for (let i = this.fileList.length - 1; i >= 0; i--) {
                    let file = this.fileList[i];
                    if(file.name.length > 100){
                        this.$message({
                        type:'error',
                        message:'凭证文件名不可超过100个字符'
                        })
                        return
                    }
                    uploadFunBySys(file.raw, `apply/bonus`, url => {
                        data.voucher = [
                          {
                            voucherPath:url,
                            voucherName:file.name
                          }
                        ];
                        data.content.file = [
                          {
                            url:url,
                            name:file.name
                          }
                        ];
                        console.log(data,2222222222)
                        api.setRefund(data).then(res => {
                           this.$message({
                              message: '发起申请成功',
                              type: 'success'
                          });
                          this.$emit("submit");
                          this.$loading().close();
                          this.clear();
                        }).catch(err => {
                            this.$message.error(err.message)
                            this.$loading().close();
                        })
                    });
                }
            } else {
              console.log(data)
              api.setRefund(data).then(res => {
                  this.$message({
                    message: '发起申请成功',
                    type: 'success'
                });
                this.$emit("submit");
                this.$loading().close();
                this.clear();
              }).catch(err => {
                  this.$message.error(err.message)
                  this.$loading().close();
              })
            }
        })
    },
    uploadFileAxios(file, fileList) {
      this.$loading();
      console.log(file, fileList);
      uploadFunBySys(file.file, `voucher/bonus_apply`, url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        });
        this.$loading().close();
        this.$refs.elupload.clearFiles();
        console.log(this.uploadFileList);
      });
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    exceed(){
      this.$message.error('此申请单次仅能上传一个文件~~')
    },
  }
};
</script>

<style lang="scss" scoped>
.add-offer-btn {
  margin: 15px;
  left: 150px;
  position: absolute;
  top: 0px;
}
.w80 {
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>