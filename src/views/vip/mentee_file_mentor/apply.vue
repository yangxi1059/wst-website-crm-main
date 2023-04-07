<!--
 * @Author: 库建华
 * @Date: 2019-08-14 11:19:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-21 17:51:25
 * @Version:
 * @Description:
 -->
<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false" :title="resumeApply?'行业导师文书修改新简历申请':'行业导师文书修改佣金申请'" :visible.sync="applyVisible" width="800px" :before-close="close">
      <el-form :inline="true" label-width="130px">
        <el-form-item label="'新的文书上传：" v-if="resumeApply">
          <el-upload
            class="upload-demo"
            :show-file-list="true"
            :http-request="uploadFileAxios"
            :file-list="fileList"
            action
            ref="elupload"
            multiple
            drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <ul class="el-upload-list el-upload-list--text">
            <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,i) in uploadFileList" :key="item.name">
              <a class="el-upload-list__item-name">
                <i class="el-icon-document"></i>{{item.name}}
              </a>
              <label class="el-upload-list__item-status-label">
                <i class="el-icon-upload-success el-icon-circle-check"></i>
              </label>
              <i class="el-icon-close" @click="deleteFile(i)"></i>
              <i class="el-icon-close-tip">按 delete 键可删除</i>
            </li>
          </ul>
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
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";
import apiDic from "@/api/dictionary.js";

import { uploadFunBySys } from "@/libs/file";

export default {
  props: {
    applyVisible: {
      type: Boolean,
      default: false
    },
    detailData:{},
    resumeApply:{},
    rebateApply:{}
  },
  data: () => {
    return {
      user: [],
      auditor: [],
      fileList: [],
      uploadFileList: [],
      action:'',
      header: {
        Authorization: ""
      },
      type: "rate",
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
    };
  },
  computed: {
  
  },
  watch: {
    applyVisible: function(val) {
      if (val) {
        console.log(this.detailData)
        if(this.resumeApply){
          apiDic.getAuditorListByApplyType("application_letter_task").then(res => {
            res.data.forEach(v => {
              v.auditor = [];
              v.confirmorArr.forEach(value => {
                if (value.isDefult == 1) {
                  v.auditor.push(value.confirmorId);
                }
              });
            });
            this.auditorList = [...res.data];
          });
        }else{
         apiDic.getAuditorListByApplyType("application_letter_task_payment").then(res => {
            res.data.forEach(v => {
              v.auditor = [];
              v.confirmorArr.forEach(value => {
                if (value.isDefult == 1) {
                  v.auditor.push(value.confirmorId);
                }
              });
            });
            this.auditorList = [...res.data];
          });
        }
      }
    },
  },
  mounted() {
   
  },
  methods: {
    close() {
      this.$emit("close");
      this.clear();
    },
    clear() {
      this.fileList = [];
      this.auditor = [];
      this.uploadFileList = [];
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    submit() {
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
      let data = {}
      if(this.resumeApply){
        if(this.uploadFileList.length < 1){
          this.$message({
            type: "warning",
            message: "新文书文件必传！"
          });
          return false
        }
        data = {
          applyType: "application_letter_task",
          applyTitle: `导师${this.detailData.mentorName}对学员${this.detailData.menteeName}的文书修改申请`,
          approval: approval,
          keyId:this.detailData.taskId,
          voucher: this.uploadFileList.map(v => {
            return { voucherName: v.name, voucherPath: v.url };
          }),
          content: {
            file: this.uploadFileList,
            text: [
              {
                label: "任务状态",
                value: this.detailData.taskStatusName
              },
              {
                label: "学员名",
                value: this.detailData.menteeName
              },
              {
                label: "行业导师名",
                value: this.detailData.mentorName
              },
              {
                label: "简历类型",
                value: this.detailData.resumeTypeName
              },
              {
                label: "任务金额",
                value: `${this.detailData.taskFundType=='usd'?'$':'￥'}${this.detailData.taskFundWage}`
              },
              {
                label: "任务时间",
                value: this.detailData.deadline
              },
              {
                label: "修改要求",
                value: this.detailData.requirement
              },
            ],
            info: {
              taskId:this.detailData.taskId,
              modifiedResume: this.uploadFileList[0].url,
              originalResume:this.detailData.originalResume,
              originalResumeName:this.getFileName(this.detailData.originalResume)
            }
          }
        };
      }else{
        data = {
          applyType: "application_letter_task_payment",
          applyTitle: `导师${this.detailData.mentorName}对学员${this.detailData.menteeName}的文书佣金申请`,
          approval: approval,
          keyId:this.detailData.taskId,
          voucher:[],
          content: {
            file: [],
            text: [
              {
                label: "任务状态",
                value: this.detailData.taskStatusName
              },
              {
                label: "学员名",
                value: this.detailData.menteeName
              },
              {
                label: "行业导师名",
                value: this.detailData.mentorName
              },
              {
                label: "简历类型",
                value: this.detailData.resumeTypeName
              },
              {
                label: "任务金额",
                value: `${this.detailData.taskFundType=='usd'?'$':'￥'}${this.detailData.taskFundWage}`
              },
              {
                label: "任务时间",
                value: this.detailData.deadline
              },
              {
                label: "修改要求",
                value: this.detailData.requirement
              },
            ],
            info: {
              taskId:this.detailData.taskId,
            }
          }
        };
      }
      console.log(data);
      api.setRefund(data).then(res => {
        this.$message.success('申请成功！！')
        this.$emit("submit");
        this.clear();
      });
    },
    // 凭证上传
    uploadFileAxios(file, fileList) {
      this.$loading();
      console.log(file, fileList);
      this.uploadFileList = [];
      uploadFunBySys(file.file, `voucher/application_letter_task`, url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        });
        this.$loading().close();
        this.$refs.elupload.clearFiles();
        console.log(this.uploadFileList);
      });
    },
    getFileName(path){
        var pos1 = path.lastIndexOf('/');
        var pos2 = path.lastIndexOf('\\');
        var pos  = Math.max(pos1, pos2)
        if( pos<0 )
            return path;
        else
            return path.substring(pos+1);
    },
    deleteFile(){
      this.uploadFileList = [];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>