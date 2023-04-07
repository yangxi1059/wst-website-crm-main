<!--
 * @Author: kaan
 * @Date: 2021-12-24 15:32:46
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-24 16:02:14
 * @Version: 
 * @Description: 
-->

<template>
  <el-drawer
    title="下载情况"
    :visible.sync="downloadVisible"
    class="drawer_bg"
    size="350px"
    @close="close"
  >
    <el-table
      stripe
      :data="consultingData"
      v-loading = "pictLoading"
      element-loading-text = "数据正在加载中"
      element-loading-spinner = "el-icon-loading"
    >
      <!-- <el-table-column
        label="下载记录ID"
        prop="logId"
      >
      </el-table-column> -->
      <el-table-column
        label="下载人"
        prop="downloadByName"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="下载时间"
        prop="downloadTime"
        align="center"
      >
      </el-table-column>
      <!-- <el-table-column
        label="下载者IP"
        prop="ip"
      >
      </el-table-column> -->
      <!-- <el-table-column
        label="IP定位"
        prop="location"
      >
      </el-table-column> -->
    </el-table>
</el-drawer>
</template>

<script>
import api from "@/api/achievement.js";
export default {
  props: {
    downloadVisible: {
      type: Boolean,
      default: false
    },
    downLoadData: {
      type: Object,
    },
  },
  data() {
    return {
        pictLoading:false,
        consultingData:[],
    };
  },
  watch: {
    downloadVisible: function(val) {
      if (val) {
        this.initPage();
      }
    }
  },
  methods: {
    initPage() {
        this.pictLoading = true
        if(this.downLoadData.downloadType){
          let data = {
              keyId: this.downLoadData.pkId,
              downloadType: this.downLoadData.downloadType,
              contentType: this.downLoadData.contentType,
          }
          console.log(data)
          api.getDownload(data).then(res => {
              this.consultingData = res.data;
              this.pictLoading = false
          })
        }else{
          let data = {schoolId: this.downLoadData.schoolId}
          api.getMenteeDownLoad(data).then(res => {
              this.consultingData = res.data;
              this.pictLoading = false
          })
        }
    },
    close() {
        this.$emit('close')
        this.consultingData = [];
        this.pictLoading = false;
    },
   
  }
};
</script>

<style lang="scss" scoped>
</style>

