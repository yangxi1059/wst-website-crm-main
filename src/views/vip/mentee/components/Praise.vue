<!--
 * @Author: kaan
 * @Date: 2021-12-16 10:39:48
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-05 15:26:31
 * @Version: 
 * @Description: 好评图
-->

<template>
  <el-drawer
    title="好评图"
    :visible.sync="drawerVisible"
    class="drawer_bg"
    @close="close"
  >
    <div class="timeline_block">
      <div class="mb10">
        <el-button @click="addPraise" type="primary" plain >新增</el-button>
      </div>
      <el-timeline>
        <el-timeline-item :timestamp="item.praiseDate" placement="top" v-for="(item,i) in praiseList" :key="i">
          <div class="timeline_container ">
            <el-tag class="timeline_icon" type="success" size="medium" v-if="!item.pkId">待审核</el-tag>
            <div class="timeline_pic">
              <el-image class="timeline_pic_thumbnail" :src="item.preSignedUrl" :fit="'contain'"></el-image><br>
              <el-link type="primary" @click="preview(item.praiseVoucher)">查看原图</el-link>
            </div>
            <el-descriptions class="timeline_content" title="" :column="1" size="medium" >
              <el-descriptions-item label="好评类型">{{item.praiseTypeName}}</el-descriptions-item>
              <el-descriptions-item label="好评创建人">{{item.createByName}}</el-descriptions-item>
              <el-descriptions-item label="好评内容" :contentStyle="{width:'240px'}">{{item.praiseContent}}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog 
      title="新增好评信息"
      :visible.sync="addVisible" 
      :close-on-click-modal="false"
      :destroy-on-close="true"
      append-to-body
      width="530px"
    >
      <el-form 
        ref="praiseForm"
        :inline="true" 
        :rules="rules" 
        :model="praiseData"
        label-width="100px" 
        style="width:100%" 
      >
        <el-form-item label="好评日期:" prop="praiseDate">
          <el-date-picker
            :style="{width:widths}"
            value-format="yyyy-MM-dd"
            v-model="praiseData.praiseDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="内容:" prop="praiseContent">
          <el-input
            v-model="praiseData.praiseContent"
            type="textarea"
            :autosize="{minRows:2}"
            :style="{width:widths}"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="好评图:" prop="praiseFile">
          <el-input v-model="praiseData.praiseFile" v-show="false"></el-input>
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="好评类型:" prop="praiseType">
          <el-select
            :style="{width:widths}"
            v-model="praiseData.praiseType"
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in praiseTypeList"
              :key="confirmItem.itemValue"
              :label="confirmItem.itemName"
              :value="confirmItem.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <template>
          <el-form-item v-for="(i,index) in auditorList" :label="i.confirmCol" :key="index">
            <el-select
              :style="{width:widths}"
              size="mini"
              v-model="i.auditor"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="confirmItem in i.confirmorArr"
                :key="confirmItem.confirmorId"
                :label="confirmItem.confirmorName"
                :value="confirmItem.confirmorId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <div :style="{width:widths,textAlign:'right'}">
              <el-button class="el-icon-circle-close-outline" @click="cancelPraise">取消</el-button>
            <el-button class="el-icon-circle-check-outline" type="primary" @click="submit">提交</el-button>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </el-drawer>
</template>

<script>
import api from '@/api/vip.js'
import files from '@/libs/file'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
export default {
  name: 'Praise',
  mixins: [
    mixins
  ],
  props:{
    praiseVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String
    },
    menteeData:{}
  },
  data: () => {
    return {
      praiseList:[],
      drawerVisible:false,
      addVisible:false,

      widths:"360px",
      praiseData: {
        praiseDate: null,
        praiseContent: null,
        praiseType: null,
        praiseFile: null,
      },
      rules: {
        praiseDate: [ { required: true, message: '必填', trigger: 'blur' }],
        praiseContent: [ { required: true, message: '必填', trigger: 'blur' }],
        praiseType: [ { required: true, message: '必填', trigger: 'blur' }],
        praiseFile: [ { required: true, message: '必填', trigger: 'blur' }],
      },
      fileList:[],
      praiseTypeList: [],
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
    }
  },
  watch: {
    praiseVisible: function (val) {
      this.drawerVisible =  JSON.parse(JSON.stringify(val))
      if (val) {
        this.Topage()
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit(){
      this.praiseTypeList = await this.getDictionary("praise_type")
      // 审批列表
      apiDic.getAuditorListByApplyType('sign_praise').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    Topage (){
      api.getPraiseList({signId:this.signId}).then(res => {
        console.log('好评图的列表',res);
        this.praiseList = res.data;
      });
    },
    // 预览
    preview (url) {
      files.preview(url)
    },
    addPraise() {
      console.log(1)
      this.addVisible = true;
    },
    cancelPraise() {
      this.addVisible = false;
      this.praiseList = [],
      this.praiseData = {
        praiseDate: null,
        praiseContent: null,
        praiseType: null,
        praiseFile: null,
      }
      this.fileList = []
    },
    change(file, fileList) {
      this.fileList = fileList.slice(-1);
      this.praiseData.praiseFile = file.name
    },
    submit() {
      this.$refs.praiseForm.validate((v) => {
        if (!v) {return}
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
        let data = {
          applyType: "sign_praise",
          applyTitle: `学员[${this.menteeData.realName}]的好评图申请`,
          keyId:this.signId,
          approval: approval,
          copyTo: [],
          voucher: [],
          content: {
            file: [],
            text: [
              {
                label: "学员名",
                value: this.menteeData.realName
              },
              {
                label: "好评日期",
                value: this.praiseData.praiseDate
              },
              {
                label: "内容",
                value: this.praiseData.praiseContent
              }
            ],
            info: {
              signId: this.signId,
              menteeId: this.menteeData.menteeId,
              praiseDate: this.praiseData.praiseDate,
              praiseContent: this.praiseData.praiseContent,
              praiseVoucher: this.praiseData.praiseVoucher,
              praiseType: this.praiseData.praiseType
            }
          }
        };
        if(this.praiseData.praiseType){
          var str = '';
          for(let i=0;i<this.praiseTypeList.length;i++){
            if(this.praiseData.praiseType == this.praiseTypeList[i].itemValue){
              str = this.praiseTypeList[i].itemName;
            }
          }
          data.content.text.push({
            label:'好评类型',
            value:str,
          })
        }
        if (this.fileList.length) {
          // 此处只传一张图片
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            let file = this.fileList[i];
            files.uploadFunBySys(file.raw, `mentee/praiseImg/${this.signId}_` + Math.random().toString().slice(-3), (url) => {
              data.content.file.unshift({ name: "好评图", url: url });
              data.content.info.praiseVoucher = url;
              data.voucher.unshift({
                voucherName: file.name,
                voucherPath: url
              });
              console.log(data)
              this.$loading()
              api.addOfferApply(data).then(res => {
                console.log("提交后", res);
                this.$message.success("提交成功,可在申请列表查看");
                this.$loading().close();
                this.Topage()
                this.cancelPraise();
              })
              .catch(err => {
                console.log("error", err);
                this.$message.error("提交异常");
                this.$loading().close();
              });
            });
          }
        }

      })
    },
    close(){
      this.cancelPraise()
      this.$emit("close");
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer_bg ::v-deep.el-drawer{
  background-color:#F4F4F4;
}
.timeline_block{
  padding:0 20px;
  .timeline_container{
    width:100%;
    height:auto;
    padding:10px;
    overflow:hidden;
    background-color:#FFF;
    border-radius: 10px;
    display: flex;
    .timeline_icon{
      position: absolute;
      top:25px;
      right:-20px;
    }
    .timeline_pic{
      float: left;
      text-align: center;
      clear: both;
      .timeline_pic_thumbnail{
        height:120px;
        width:120px;
      }
    }
    .timeline_content{
      margin-left: 20px;
      padding-top:10px;
      flex:1
    }
  }
}
</style>