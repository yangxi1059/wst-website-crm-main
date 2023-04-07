<!--
 * @Author: 杨曦
 * @Date: 2020-09-23 10:20:42
 * @LastEditors: kaan
 * @LastEditTime: 2022-04-06 14:07:47
 * @Version: 
 * @Description: 
-->
<template>
  <div class="fileAlert">
    <el-dialog :visible.sync="fileVisible" width="1000px"
    :title="`实习【${this.internshipId2.internshipName || '无'}】的文档`"
    :before-close="close"
    :append-to-body="true">
      <el-card >
          <el-col class="mb20" v-for="(item,i) in resumeFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.filePath)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.filePath)"
            >下载</el-button>
            {{item.fileName}} --上传者：{{item.createByName}} -- 时间：{{item.createTime}}
          </el-col>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/dictionary.js";
import { downloadFun, downloadFunD } from "@/libs/file";
export default {
  props: {
    fileVisible: {
      type: Boolean,
      default: false
    },
    internshipId2:{
      type: Object
    }
  },
  data: () => {
    return {
      resumeFile:[],
    };
  },
  watch: {
    fileVisible: function(val, old) {
      if (val) {
        this.Topage();
      }
    }
  },
  mounted() {

  },
  methods: {
    Topage(){
        api.getInternshipFile(this.internshipId2.internshipId).then(res => {
          this.resumeFile = res.data;
          console.log(res,'yux45645465')
        })
    },
    close(){
        this.resumeFile = [];
        this.$emit('close')
    },
    //预览
    download(val) {
      downloadFun(val, url => {
        window.open(url);
      });
    },
    //下载
    downloadD(val) {
      downloadFunD(val, url => {
        window.open(url);
      });
    },
  }
}
</script>

<style >
  .yxuploaddas .el-upload{
    width: 300px;
    height: 180px;
  }
</style>