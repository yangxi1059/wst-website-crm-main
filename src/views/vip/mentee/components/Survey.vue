<!--
 * @Author: 库建华
 * @Date: 2019-11-25 14:56:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-02 11:10:34
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog
      :title="'问卷详情'"
      :close-on-click-modal="false"
      :visible.sync="SurveyVisible"
      width="540px"
      :before-close="handleClose"
    >
      <div v-loading="loading" >
        <el-tabs v-model="activeName" type="card" >
          <el-tab-pane :label="item3.surveyTitle" :name="'first'+k" v-for="(item3,k) in surveyArr" :key="k" >
            <div v-for="(item,i) in item3.surveyContent" :key="i" >
                <div class="mb10" v-if="item.type=='input'" >
                  <div style="font-weight:600;width:500px">{{i+1}}.{{item.label}}:</div>
                  <el-input disabled v-if="item.maxLength == '20'" :maxlength="item.maxLength" size="small" style="width:500px" class="mt10"  placeholder="请输入内容" v-model="item3.submitData[item.name]" clearable></el-input>
                  <el-input disabled type="textarea" :autosize="{ minRows: 4}" show-word-limit v-if="item.maxLength == '100'" :maxlength="item.maxLength" size="small" style="width:500px" class="mt10"  placeholder="请输入内容" v-model="item3.submitData[item.name]" clearable></el-input>
                </div>
                <div class="mb10" v-if="item.type=='select'" style="width:300px">
                  <div style="font-weight:600;width:500px">{{i+1}}.{{item.label}}:</div>
                  <el-radio-group disabled style="width:300px" size="small" class="mt10" v-model="item3.submitData[item.name]">
                      <el-radio  style="margin-bottom:5px" v-for="(item2,k) in item.items" :label="item2.value" :key="k">{{item2.label}}</el-radio>
                  </el-radio-group>
                </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="toBind">小程序码</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="yx-aa"
      :visible.sync="dialogVisible"
      width="600px"
      style="text-align:center!important"
      :before-close="handleClose2">
      <div style="text-align:center">
        <el-image style="width: 320px; height: auto; "  :src="url" fit="cover"></el-image>
      </div>
      <el-button class="mt20" size="small" @click="downloadImg()">下载</el-button>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import FileSaver from 'file-saver'

export default {
  name: 'Survey',
  props: {
    signId: {},
    SurveyVisible: {},
    data:{}
  },
  data () {
    return {
      loading: false,
      surveyDetail:{},
      surveyContent: [],
      surveyArr: [],
      submitData:{},
      url: '',
      dialogVisible: false,
      activeName: 'first0'
    }
  },
  watch: {
    SurveyVisible: function (newData, oldData) {
      if (newData) {
        this.toPage()
      }
    }
  },
  mounted () {},
  methods: {
    toPage(){
        this.loading = true
        api.getSurvey(this.signId).then(res => {
          console.log(res.data)
            this.surveyDetail = res.data
            this.surveyArr = res.data.surveyArr
            this.surveyArr.forEach((item,i) => {
              item.surveyContent = item.surveyContent?item.surveyContent:[]
              item.submitData = {}
              if(res.data.resultArr && res.data.resultArr.length > 0){
                res.data.resultArr.forEach(item3 => {
                  item.submitData = res.data.resultArr[i]
                })
              }else{
                if(item.surveyContent.length > 0){
                  item.surveyContent.forEach(item2 =>{
                    this.$set(item.submitData,item2.name,'')
                  })
                }else{
                  item.surveyContent.forEach(item2 => {
                    this.$set(item.submitData,item2.name,'')
                  })
                }
              }
            })
            this.loading = false
        })
    },
    handleClose () {
      this.activeName = 'first0'
      this.surveyArr = []
      this.$emit('close')
    },
    toBind(){
      api.getSurveyQrCode(this.signId).then(res => {
        console.log(res)
        this.url = res.data
        this.dialogVisible = true
      })
    },
    handleClose2(){
      this.dialogVisible = false
    },
    downloadImg(){
      this.down(this.url)
    },
    down(url){
      let a = JSON.parse(JSON.stringify(url))
      let fileName = a.split('/').slice(-1)[0];
      console.log(url,fileName)
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          FileSaver.saveAs(xhr.response, fileName);
        }
      };
      xhr.send();
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
