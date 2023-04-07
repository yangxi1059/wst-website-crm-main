<!--
 * @Author: 杨曦
 * @Date: 2021-07-14 13:21:44
 * @LastEditors: kaan
 * @LastEditTime: 2022-04-06 14:07:47
 * @Version: 
 * @Description: 
-->
<template>
  <div class="inputInformation_yx_body">
    <el-dialog
      :visible.sync="settingPostVisible"
      :before-close="handleClose"
      :append-to-body="true"
      width="600px"
      center
    >
      <div slot="title">
        <div style="display:flex">
          <div style="font-size:18px;font-weight:500;text-align:center;flex:1">公告设置</div>
        </div>
      </div>
      <!-- <div>
        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="postData.noticeContent"></el-input>
      </div> -->
      <div>
        <ckeditor
            :style="{'width':'100%'}"
            :config="editorConfig"
            v-model="postData.noticeContent"
          ></ckeditor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" class="mr20" @click="handleDelete()">删除</el-button>
        <el-button type="primary" @click="handleSumbit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import { fmtDate } from "@/libs/util";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  data() {
    return {
      postData:{
        noticeContent:''
      },
      editorConfig: {
        toolbar: [
          // [ 'Styles', 'Format', 'Font', 'FontSize' ],
          ["Bold", "Italic"],
          ["Undo", "Redo"],
          ["Source"],
          ["Maximize"],
        ]
      },
    };
  },
  props:{
    settingPostVisible: {
      type: Boolean,
      default: false
    },
    settingData:{}
  },
  mounted() {
  },
  // 根据学校联动国家
  watch: {
    settingPostVisible: function(newData) {
      if (newData) {
        
        this.postData = JSON.parse(JSON.stringify(this.settingData))
        console.log(this.settingData);
      } 
    },
  },
  methods: {
    handleClose(){
      this.$emit('close')
    },
    handleDelete(){
      api.delOverviewNotice().then(() => {
        this.$message.success('删除成功！！')
        this.postData = {
          noticeContent:''
        }
        this.$emit('submit')
      })
    },
    handleSumbit(){
      if(this.postData.noticeContent){
        let data = {
          createByName:this.userInfo.userName,
          noticeContent:this.postData.noticeContent,
          createTime:fmtDate(new Date(), ("yyyy-MM-dd hh:mm:ss"))
        }
        console.log(data)
        api.postOverviewNotice(data).then(() => {
          this.$message.success('保存成功！！')
          this.postData = {
            noticeContent:''
          }
          this.$emit('submit')
        })
      }else{
        this.$message.error('保存时活动形式不可为空，若需删除公告请点击左侧删除按钮！！')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .text_intership{
    white-space:pre-wrap;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 15px;
  }
  .text_intership2{
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
<style >
  .inputInformation_yx_body .el-dialog__header{
    background-color: #FF8C00 !important;
    color: #fff;
    padding: 20px;
  }
  .inputInformation_yx_body .el-dialog__headerbtn{
    color: #fff;
  }
  .inputInformation_yx_body .el-dialog__footer {
    padding: 10px;
    background-color: #e9eef3;
  }
  
  .inputInformation_yx_body .el-dialog__headerbtn{
    top: 22px;
    color: #fff !important;
  }
  .inputInformation_yx_body .el-dialog__headerbtn .el-dialog__close{
    color: #fff !important;
  }
</style>
