<!--
 * @Author: 库建华
 * @Date: 2019-11-25 14:56:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-15 15:27:54
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'详情'"
      :visible.sync="detailVisible"
      width="800px"
      style="width: 100%"
      :before-close="handleClose"
    >
      <div 
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 1)">
        <el-row class="mb20">
          <el-col :span="6" class="_item-name">任务状态</el-col>
          <el-col :span="6" class="_item-value">{{detailData.taskStatusName}}</el-col>
          <el-col :span="6" class="_item-name">导师名</el-col>
          <el-col :span="6" class="_item-value">{{detailData.mentorName}}</el-col>
          <el-col :span="6" class="_item-name">学员名</el-col>
          <el-col :span="6" class="_item-value">{{detailData.menteeName}}</el-col>
          <el-col :span="6" class="_item-name">简历类型</el-col>
          <el-col :span="6" class="_item-value">{{detailData.resumeTypeName || detailData.resumeType}}</el-col>
          <el-col :span="6" class="_item-name">任务金额</el-col>
          <el-col :span="6" class="_item-value">{{detailData.taskFundType=='usd'?'$':'￥'}}{{detailData.taskFundWage}}</el-col>
          <el-col :span="6" class="_item-name">截止日期</el-col>
          <el-col :span="6" class="_item-value">{{detailData.deadline}}</el-col>
          <el-col :span="6" class="_item-name">修改要求</el-col>
          <el-col :span="6" class="_item-value2" style="color:#666;margin:10px 0;white-space: pre-line;">{{detailData.requirement}}</el-col>
          <el-col :span="6" class="_item-name">原始简历</el-col>
          <el-col :span="6" class="_item-value">
              <el-button type="text" size="mini" v-if="roleInfo.includes('mentee_file_mentor_preview')" @click="preview(detailData.originalResume)">预览</el-button>
              <el-button type="text" size="mini" v-if="roleInfo.includes('mentee_file_mentor_down')" @click="downloadD(detailData.originalResume)">下载</el-button>
          </el-col>
          <el-col :span="6" class="_item-name" v-if="detailData.modifiedResume">修改后简历</el-col>
          <el-col :span="6" class="_item-value" v-if="detailData.modifiedResume">
              <el-button type="text" size="mini" v-if="roleInfo.includes('mentee_file_mentor_preview')" @click="preview(detailData.modifiedResume)">预览</el-button>
              <el-button type="text" size="mini" v-if="roleInfo.includes('mentee_file_mentor_down')" @click="downloadD(detailData.modifiedResume)">下载</el-button>
          </el-col>
        </el-row>
        <div class="block" v-if="detailData.eventArr && detailData.eventArr.length > 0">
          <el-timeline v-for="(item,i) in detailData.eventArr" :key="item.pkId">
              <el-timeline-item :timestamp="item.eventTime" placement="top">
                  <el-card>
                      <h4>{{item.eventByName}} {{item.eventTypeName}} {{item.content?`拒绝理由：${item.content}`:''}}</h4>
                  </el-card>
              </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <span v-if="!showCommon" class="ml10">
            <el-button type="info" @click="toConnect(detailData)">小程序码</el-button>
            <el-button type="success"  v-if="detailData.taskStatus == 'on_going' && roleInfo.includes('mentee_file_resume_apply')" @click="apply2(detailData)">文书修改申请</el-button>
            <el-button type="success"  v-if="detailData.canApplyStatus == '1' && roleInfo.includes('mentee_file_rebate_apply')" @click="applyRebate(detailData)">文书佣金申请</el-button>
            <el-button type="primary" v-if="roleInfo.includes('mentee_file_mentor_edit')" @click="edit(detailData)">编辑</el-button>
            <el-button type="danger" v-if="detailData.taskStatus != 'cancel' && roleInfo.includes('mentee_file_mentor_delete')" @click="deleteIt(detailData)">删除</el-button>
          </span>
      </span>
    </el-dialog>
    <apply :detailData="detailData" :rebateApply="rebateApply" :resumeApply="resumeApply" :applyVisible="applyVisible" @close="applyClose" @submit="applySubmit"></apply>
    <edit :editVisible="editVisible" :taskId="taskId"  @close="editClose" @submit="editSubmit"  />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from "@/api/vip.js";
import {  downloadFun, downloadFunD } from "@/libs/file";
import edit from "./edit.vue"
import apply from './apply.vue'
export default {
  name: "recommend",
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    taskId: {},
    detailVisible:{},
    showApply:{},
    showApply2:{},
    showCommon:{}
  },
  data() {
    return {
        detailData:{},
        applyVisible:false,
        loading:false,
        rebateApply:false,
        resumeApply:false,
        editVisible:false,
    };
  },
  components:{apply,edit},
  watch: {
    detailVisible: function (newData, oldData) {
      if (newData) {
        this.toPage()
      }
    },
  },
  mounted() {},
  methods: {
    toPage(){
       console.log(this.showApply)
       this.loading = true;
        api.detailApplicationLetterTask(this.taskId).then(res => {
          console.log(res)
          this.detailData = res.data;
          this.loading = false;
        })
    },
    handleClose() {
      this.detailData = {}
      this.$emit("close");
    },
    preview(path){
      downloadFun(path)
    },
    downloadD(val) {
      downloadFunD(val, url => {
        window.open(url);
      });
    },

    applyClose(){
      this.applyVisible = false;
    },
    applySubmit(){
      this.applyVisible = false;
      this.toPage()
      this.$emit('update')
    },

    
    edit(data){
      this.taskId = data.taskId
      this.editVisible = true;
    },
    editClose(){
      this.editVisible = false;
    },
    editSubmit(){
      this.editVisible = false;
      this.$emit('update')
      this.toPage()
    },
    deleteIt(data){
      this.$confirm('此操作将永久删除此文书修改任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delApplicationLetterTask(data.taskId).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.toPage();
            this.$emit('update')
          })
        })
    },
    toConnect(data){
      api.getApplicationLetterAr(data.taskId).then(res => {
        console.log(res)
        let imageHtml = `<div style="width: 100%; height: 200px;text-align:center">
                          <img
                          style="width: 200px; height: 200px"
                          src="${res.data}"/>
                        </div>
                        <div style="text-align:center;color:#409EFF;margin-top:20px" >请截图后分享给导师</div>`

        this.$alert(imageHtml, '导师小程序文书修改任务邀请码', {
          showConfirmButton: false,
          dangerouslyUseHTMLString: true
        });
        
      })
    },

    apply2(){
      this.resumeApply = true;
      this.rebateApply = false;
      this.applyVisible = true;
    },
    applyRebate(){
      this.rebateApply = true;
      this.resumeApply = false;
      this.applyVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>