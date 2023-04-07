<template>
  <div class="add">
    <el-dialog :close-on-click-modal="false"
      title="编辑文书修改"
      class="info yx_form"
      :visible.sync="editVisible"
      width="1220px"
      :before-close="handleClose"
    >
      
      <el-form
        :inline="true"
        :model="modelData"
        :rules="rules"
        ref="ruleForm"
        label-width="160px"
      >
        <!-- <div class="mb20" style="margin-left:80px">
          <el-input

            :style="{width:'220px'}"
            v-model="mentorNameSearch"
            size="mini"
            clearable
            placeholder="注意名字中间空格"
            @keyup.enter.native="searchMentorByMentorName"
          ></el-input>
          <el-button type="primary" @click="searchMentorByMentorName" size="mini">查询导师</el-button>
        </div> -->
        <el-form-item label="导师姓名:"  >
            <el-input  :disabled="true" style="width:220px"  v-model="mentorName" ></el-input>
        </el-form-item>
        <el-form-item label="学员姓名:"  >
            <el-input  :disabled="true" style="width:220px"  v-model="menteeName" ></el-input>
        </el-form-item>
        <el-form-item label="简历类型:"  prop="resumeType">
            <el-select :disabled="true" style="width:220px" @change="changeSelect()" v-model="modelData.resumeType" clearable placeholder="请选择">
                <el-option
                v-for="item in resumeTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="任务金额:"  >
            <el-input  :disabled="true" style="width:220px"  v-model="price" ></el-input>
        </el-form-item>
        <!-- <el-form-item label="货币类型"  prop="taskFundType">
            <el-select style="width:220px" v-model="modelData.taskFundType" clearable placeholder="请选择">
                <el-option
                v-for="item in taskFundTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="截止日期:"  prop="deadline">
            <el-date-picker
                style="width:220px"
                value-format="yyyy-MM-dd"
                v-model="modelData.deadline"
                class="mr10"
                type="date"
                placeholder="截止日期"
        ></el-date-picker>
        </el-form-item>
        <el-form-item label="修改要求:"  prop="requirement">
            <el-input type="textarea" :autosize="{ minRows: 2}" style="width:212px"  v-model="modelData.requirement" ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="原始简历:"  >
          <div style="display:flex;width:1000px;flex-wrap:wrap;">
            <div
              class="yxHover"
              type="text"
              @click="selectAll(item,i)"
              v-for="(item,i) in resumeList"  :key="item.fileUrl"
              :style="{width:'148px','text-align':'center','margin':'0 10px 10px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #67C23A dashed','overflow':'hidden','display':'inline-block'}"
              icon="el-icon-download"
            > 
              <el-tag type="danger" size="mini" v-if="item.showSelected">已选中</el-tag>
              <div style="line-height:16px;margin-top:30px">{{item.fileName}}</div>
              <div class="yxHoverDiv"  style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
                <div style="display:flex">
                  <div style="width:50%;height:50%;line-height:148px">
                    <el-button
                      @click.stop
                      type="primary"
                      icon="el-icon-view" circle
                      title="预览"
                      @click="download(item.fileUrl)"></el-button>
                  </div>
                  <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    @click.stop
                    type="success"
                    icon="el-icon-download" circle
                    title="下载"
                    @click="downloadD(item.fileUrl)"></el-button>
                </div>
                </div>
              </div>
            </div>
            <el-upload
              style="display:inline-block;width:148px;height:148px"
              action
              :show-file-list="false"
              :http-request="uploadFileAxios1"
              class="upload-btn"
              ref="elupload1"
              :on-change="change1"
              :on-remove="remove1"
              :limit="3"
              :file-list="fileList1"
              drag
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <!-- <el-form-item label="上传新简历:"  >
          <div
            class="yxHover"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #F56C6C dashed','overflow':'hidden','display':'inline-block'}"
            v-for="(detail,i) in fileList1"
            :key="i"
          >
            <div>{{detail.name}}<span style="color:#c32e47">【待上传】</span></div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:100%;height:100%;line-height:148px">
                  <el-button
                    type="danger"
                    icon="el-icon-delete" circle
                    title="删除"
                    @click="delete1(i)"></el-button>
                </div>
              </div>
            </div>
          </div>
          
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="validSubmit">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
      title="行业导师"
      :visible.sync="mentorListVisible"
      width="700px"
      :before-close="mentorListClose"
    >
      <el-row v-for="(mentor,i) in mentorSearchList" :key="mentor.mentorId">
        <el-col :span="2">
          <el-button size="mini" @click="chooseMentor(i)" type="primary">选择</el-button>
        </el-col>
        <el-col :span="4" class="_item-name">姓名</el-col>
        <el-col :span="6" class="_item-value">{{mentor.mentorName}}</el-col>
        <el-col :span="4" class="_item-name">微信ID</el-col>
        <el-col :span="6" class="_item-value">{{mentor.wxId}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import apiVip from "@/api/vip.js";
import apiDic from "@/api/dictionary.js";
import { mapState } from 'vuex';
import { downloadFun, downloadFunD, uploadFunBySys } from "@/libs/file";

export default {
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  name: "add",
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    taskId:{},
   
  },
  data() {
    return {
      checkedCities:[],
      price:'',
      mentorListVisible:false,
      mentorSearchList:[],
      mentorName:'',
      mentorNameSearch: "",
      modelData:{
          signId:'',
          mentorId:'',
          resumeType:'',
          taskFundType:'',
          taskFundWage:'',
          deadline:'',
          requirement:'',
          originalResume:'',
      },
      menteeName:'',
      resumeList:[],
      fileList1:[],
      resumeTypeList:[
          {label:'中文简历',value:'chi'},
          {label:'英文简历',value:'eng'},
          {label:'Cover Letter',value:'cl'},
      ],
      taskFundTypeList:[
          {label:'人民币',value:'cny'},
          {label:'美金',value:'usd'},
      ],
      rules:{
          resumeType: [{ required: true, message: "必填", trigger: "blur" }],
          taskFundType: [{ required: true, message: "必填", trigger: "blur" }],
          taskFundWage: [{ required: true, message: "必填", trigger: "blur" }],
          deadline: [{ required: true, message: "必填", trigger: "blur" }],
          requirement: [{ required: true, message: "必填", trigger: "blur" }],
          mentorId: [{ required: true, message: "必填", trigger: "blur" }],
      }
    };
  },
  watch: {
    editVisible: function(val) {
      if (val) {
        apiVip.detailApplicationLetterTask(this.taskId).then(res => {
          console.log(res.data)
          this.modelData.taskId = this.taskId;
          this.mentorName = res.data.mentorName;
          this.modelData.resumeType = res.data.resumeType;
          this.modelData.mentorId = res.data.mentorId;
          this.menteeId = res.data.menteeId;
          this.menteeName = res.data.menteeName;
          this.modelData.deadline = res.data.deadline;
          this.modelData.taskFundWage = res.data.taskFundWage;
          this.modelData.taskFundType = res.data.taskFundType;
          this.price = `${res.data.taskFundType=='usd'?'$':'￥'}${res.data.taskFundWage}`
          this.modelData.taskStatus = res.data.taskStatus;
          this.modelData.requirement = res.data.requirement;
          this.modelData.originalResume = res.data.originalResume;
          delete this.modelData.signId;
          apiDic.getMenteeFileList({menteeId:this.menteeId,fileType:'resume'}).then(res => {
            this.resumeList = res.data;
            let a = 0;
            this.resumeList.forEach(item => {
              if(item.fileUrl == this.modelData.originalResume){
                a = 1;
                item.showSelected = true;
                this.$forceUpdate()
              }
            })
            console.log(a)
            if(a == 0){
              this.resumeList.push({fileUrl:this.modelData.originalResume,fileName:this.getFileName(this.modelData.originalResume),showSelected:true})
            }
            console.log(this.resumeList,222222222222222)
          })
        })

      }
    }
  },
  mounted() {
  },
  methods:{
    handleClose(){
        this.clear()
        this.$emit('close')
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
    validSubmit(){
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
          this.$loading();
          if(this.modelData.taskFundType && this.modelData.taskFundWage){
              let arr = [];
              this.resumeList.forEach(item => {
                if(item.showSelected){
                  arr.push(item.fileUrl)
                }
              })
            if(arr.length <1){
              this.$message.error('请上传原始简历')
              this.$loading().close();
              return false;
            }else{
              this.modelData.originalResume = arr.join(',')
              console.log(this.modelData,this.checkedCities)
              apiVip.editApplicationLetterTask(this.modelData).then(res => {
                this.clear()
                this.$message.success('申请成功！！')
                this.$emit('submit')
                this.$loading().close();
              }).catch(err => {
                this.$loading().close();
                return false
              })
            }
          }else{
            this.$message.error('请去导师管理处，设置此导师的文书修改佣金 ！！')
            this.$loading().close();
          }
      })
    },
    clear(){
      this.mentorName = '';
      this.fileList1 = [];
      this.resumeList = [];
      this.modelData = {
          signId:'',
          mentorId:'',
          resumeType:'',
          taskFundType:'',
          taskFundWage:'',
          deadline:'',
          requirement:'',
          originalResume:'',
      }
    },
    searchMentorByMentorName() {
      if (!this.mentorNameSearch) {
        this.$message({
          type: "warning",
          message: "别闹~~~"
        });
        return;
      }
      apiVip.searchMentorByMentorName({mentorName:this.mentorNameSearch}).then(res => {
        console.log(res.data);
        if (!res.data.length) {
          this.$message({
            type: "warning",
            message: "无该姓名的导师"
          });
          return;
        }else{
          this.$message({
            type: "success",
            message: "搜索成功请在下方导师下拉中选择！"
          });
        }
        this.mentorSearchList = res.data;
        this.modelData.mentorId = '';
        // this.mentorListVisible = true;
      });
    },
    chooseMentor(i) {
      this.modelData.mentorId = this.mentorSearchList[i].mentorId;
      this.mentorName = this.mentorSearchList[i].mentorName;
      this.mentorListClose();
    },
    mentorListClose() {
      this.mentorListVisible = false;
      this.mentorSearchList = [];
    },
    change1(file, fileList) {
      console.log(file,fileList)
      this.fileList1 = fileList;
    },
    remove1(){
      this.fileList1 = []
    },
    uploadFileAxios1(file,fileList) {
      console.log(file, fileList,this.fileList1);
      this.$loading()
      uploadFunBySys(file.file, `resume/${this.menteeId}`, url => {
        console.log(url)
        this.resumeList.push({fileName:file.file.name,fileUrl:url})
      });
    },
    delete1(i){
      this.fileList1.splice(i,1);
      console.log(i,this.fileList1)
    },
    download(val) {
      downloadFun(val)
    },
    downloadD(val) {
      downloadFunD(val, url => {
        window.open(url);
      });
    },
    selectAll(item,i){
      console.log(item,i);
      if(this.resumeList[i].showSelected){
        this.resumeList[i].showSelected = false;
      }else{
        this.resumeList[i].showSelected = true;
      }
      this.resumeList.forEach(item2 => {
        if(item2.fileUrl != item.fileUrl){
          item2.showSelected = false;
        }
      })
      this.$forceUpdate()
    },
    changeSelect(){
      console.log(this.modelData.resumeType)
      if(this.modelData.mentorId){
        this.mentorSearchList.forEach(item => {
          if(item.mentorId == this.modelData.mentorId){
            if(!item.letterModifyCompensationType){
              this.$message.error('请去导师管理处，设置此导师的文书修改佣金 ！！')
              return false
            }
            if(this.modelData.resumeType == 'cl'){
              this.price = `${item.letterModifyCompensationType == 'usd'?'$':'￥'}${item.letterModifyCompensationCoverLetter}`;
              this.modelData.taskFundType = item.letterModifyCompensationType;
              this.modelData.taskFundWage = item.letterModifyCompensationCoverLetter;
            }else if(this.modelData.resumeType == 'chi'){
              this.price = `${item.letterModifyCompensationType == 'usd'?'$':'￥'}${item.letterModifyCompensationResumeZh}`;
              this.modelData.taskFundType = item.letterModifyCompensationType;
              this.modelData.taskFundWage = item.letterModifyCompensationResumeZh;
            }else if(this.modelData.resumeType == 'eng'){
              this.price = `${item.letterModifyCompensationType == 'usd'?'$':'￥'}${item.letterModifyCompensationResumeEn}`;
              this.modelData.taskFundType = item.letterModifyCompensationType;
              this.modelData.taskFundWage = item.letterModifyCompensationResumeEn;
            }
          }
        })
      }else{
        this.$message.error('请先选择导师！！')
      }
    }
  }
};
</script>



<style lang="scss" scoped>
.yxHoverDiv{
  display: none;
}
.yxHover:hover .yxHoverDiv{
    display: block;
}
.yx_form .el-upload-dragger{
  width: 148px;
  height: 148px;
}
</style>
<style>
  .yx_form .el-upload-dragger{
    width: 148px;
    height: 148px;
  }
  .yx_form .el-upload-dragger .el-icon-plus{
    font-size: 28px;
    color: #8c939d;
    line-height:146px;
  }
  .showRed{
    background-color: #c32e47;
  }
</style>