<!--
 * @Author: 库建华
 * @Date: 2020-03-09 16:06:07
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-25 18:01:05
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :title="'补充协议详情'"
      :visible.sync="detailVisible"
      width="600px"
      :before-close="close"
    >
        <el-row>
            <el-col :span="6" class="_item-name">协议名称：</el-col>
            <el-col :span="18" class="_item-value">{{data.templateName}}</el-col>
            <el-col :span="6" class="_item-name">适用场景：</el-col>
            <el-col :span="18" class="_item-value">{{data.applicableScene}}</el-col>
            <el-col :span="6" class="_item-name">模板是否启用：</el-col>
            <el-col :span="18" class="_item-value">{{data.templateStatusName}}</el-col>
            <el-col :span="6" class="_item-name">协议文档：</el-col>
            <el-col :span="18" class="_item-value">
                <div>
                    <el-button @click="preview(data.filePath)" size="mini" type="primary" icon="el-icon-view">预览</el-button>
                    <el-button @click="downLoad(data.filePath)" size="mini" type="primary" icon="el-icon-download">下载</el-button>
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="edit">编 辑</el-button>
        </span>
    </el-dialog>
    <Edit :editVisible="editVisible" :formDataNow="formDataNow" :pkId="pkId" @close="editClose" @submit="editSubmit" />
  </div>
</template>

<script>
import { downloadFun, downloadFunD } from "@/libs/file";
import api from "@/api/sales_assistant";
import Edit from './SupplementaryEdit'

export default {
  name: "setting",
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    pkId: {
    },
  },
  components:{
    Edit
  },
  data() {
    return {
      editVisible: false,
      data:{
        templateStatusName:'',
        templateName:'',
        applicableScene:'',

      },
      formDataNow:''
    };
  },
  watch: {
    detailVisible: function(val) {
      if (val) {
        this.toPage()
      }
    }
  },
  methods: {
    toPage(){
      console.log(this.pkId)
      api.infoTemplate(this.pkId).then(res => {
        console.log(res)
        this.data = res.data;
        this.formDataNow = this.data;
      })
    },
    close(){
        this.$emit('close')
        this.data = {
        templateStatusName:'',
        templateName:'',
        applicableScene:'',
      }
    },
    edit(){
      this.editVisible = true;
    },
    editClose(){
      this.editVisible = false;
    },
    editSubmit(){
      this.$emit('submit')
      this.editVisible = false;
      this.toPage()
    },
    preview(path){
        downloadFun(path, url => {
            window.open(url);
        });
    },
    downLoad(path){
      downloadFunD(path, (url) => {
        window.open(url);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>