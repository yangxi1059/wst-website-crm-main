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
      :visible.sync="settingVisible"
      :before-close="handleClose"
      width="600px"
    >
      <div slot="title">
        <div style="display:flex">
          <div style="font-size:18px;font-weight:500;text-align:center;flex:1">公告</div>
        </div>
      </div>
      <div class="text_intership" v-html="settingData.noticeContent"></div>
      <div class="text_intership_te">—— {{settingData.createByName}},于{{settingData.createTime}}发布</div>
      <!-- <div style="display:flex">
        <div class="text_intership" style="flex:1">创建人：{{settingData.createByName}}</div>
        <div class="text_intership" style="flex:1">创建时间：{{settingData.createTime}}</div>
      </div> -->
      <!-- <div class="text_intership2">公告内容</div> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
    };
  },
  props:{
    settingData:{

    },
    settingVisible: {
      type: Boolean,
      default: false
    },
  },
  mounted() {
  },
  // 根据学校联动国家
  watch: {
    settingVisible: function(newData) {
      if (newData) {
        console.log(this.settingData);
      } 
    },
  },
  methods: {
    handleClose(){
      this.$emit('close')
    }
  }
};
</script>

<style lang="scss" scoped>
  .text_intership{
     font-size: 16px;
    color: #333;
    text-align: left;
    line-height: 30px;
    width: 100%;
    white-space:pre-wrap;
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
  }
  .inputInformation_yx_body .el-dialog__headerbtn .el-dialog__close{
    color: #fff !important;
  }

  .inputInformation_yx_body .text_intership_te{
    margin-top: 20px;
    font-size: 16px;
    text-align: right;
  }
</style>
