<template>
  <div class="add">
    <el-dialog
      title="新增文书修改"
      class="info yx_form"
      :visible.sync="addVisible"
      :close-on-click-modal="false"
      width="70%"
      :before-close="handleClose"
    >

      <el-form
        :inline="true"
        :model="modelData"
        :rules="rules"
        ref="ruleForm"
        label-width="160px"
      >
        <el-form-item label="导师姓名:"  prop="mentorId">
          <el-select
            style="width:220px"
            v-model="modelData.mentorId"
            filterable
            remote
            reserve-keyword
            @change="changeSelect2()"
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in mentorSearchList"
              :key="item.mentorId"
              :label="item.mentorName"
              :value="item.mentorId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员姓名:"  >
            <el-input  :disabled="true" style="width:220px"  v-model="menteeName" ></el-input>
        </el-form-item>
        <el-form-item label="简历类型:"  prop="resumeType">
            <el-select style="width:220px" @change="changeSelect()" v-model="modelData.resumeType" clearable placeholder="请选择">
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
          <div style="display:flex;width:100%;flex-wrap:wrap;padding-left:90px;box-sizing:border-box">
            <div
              class="yxHover"
              type="text"
              @click="selectAll(item,i)"
              v-for="(item,i) in resumeList"  :key="i"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="validSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiVip from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import file from '@/libs/file'
import { downloadFunD, uploadFunBySys } from '@/libs/file'

export default {
  name: 'add',
  props: {
    addVisible: {
      type: Boolean,
      default: false
    },
    signId: {},
    menteeId: {},
    menteeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkedCities: [],
      price: '请先选择简历类型',
      mentorListVisible: false,
      mentorSearchList: [],
      mentorName: '',
      mentorNameSearch: '',
      modelData: {
        signId: '',
        mentorId: '',
        resumeType: '',
        taskFundType: '',
        taskFundWage: '',
        deadline: '',
        requirement: '',
        originalResume: ''
      },
      resumeList: [],
      fileList1: [],
      resumeTypeList: [
        { label: '中文简历', value: 'chi' },
        { label: '英文简历', value: 'eng' },
        { label: 'Cover Letter', value: 'cl' }
      ],
      taskFundTypeList: [
        { label: '人民币', value: 'cny' },
        { label: '美金', value: 'usd' }
      ],
      rules: {
        resumeType: [{ required: true, message: '必填', trigger: 'blur' }],
        taskFundType: [{ required: true, message: '必填', trigger: 'blur' }],
        taskFundWage: [{ required: true, message: '必填', trigger: 'blur' }],
        deadline: [{ required: true, message: '必填', trigger: 'blur' }],
        requirement: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorId: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      loading: false
    }
  },
  watch: {
    addVisible: function (val) {
      if (val) {
        apiDic.getMenteeFileList({ menteeId: this.menteeId, fileType: 'resume' }).then(res => {
          this.resumeList = res.data
          console.log(res)
        })
      }
    }
  },
  mounted () {
  },
  methods: {
    handleClose () {
      this.clear()
      this.$emit('close')
    },
    validSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.$loading()
        this.modelData.signId = this.signId
        if (this.modelData.taskFundType && this.modelData.taskFundWage) {
          const arr = []
          this.resumeList.forEach(item => {
            if (item.showSelected) {
              arr.push(item.fileUrl)
            }
          })
          if (arr.length < 1) {
            this.$message.error('请上传原始简历')
            this.$loading().close()
            return false
          } else {
            this.modelData.originalResume = arr.join(',')
            console.log(this.modelData, this.checkedCities)
            apiVip.addApplicationLetterTask(this.modelData).then(res => {
              this.clear()
              this.$message.success('申请成功！！')
              this.$emit('submit')
              this.$loading().close()
            }).catch(err => {
              this.$loading().close()
              return false
            })
          }
        } else {
          this.$message.error('请去导师管理处，设置此导师的文书修改佣金 ！！')
          this.$loading().close()
        }
      })
    },
    clear () {
      this.mentorName = ''
      this.fileList1 = []
      this.resumeList = []
      this.price = '请先选择简历类型',
      this.mentorNameSearch = ''
      this.mentorSearchList = []
      this.modelData = {
        signId: '',
        mentorId: '',
        resumeType: '',
        taskFundType: '',
        taskFundWage: '',
        deadline: '',
        requirement: '',
        originalResume: ''
      }
    },
    searchMentorByMentorName () {
      if (!this.mentorNameSearch) {
        this.$message({
          type: 'warning',
          message: '别闹~~~'
        })
        return
      }
      apiVip.searchMentorByMentorName({ mentorName: this.mentorNameSearch }).then(res => {
        console.log(res.data)
        if (!res.data.length) {
          this.$message({
            type: 'warning',
            message: '无该姓名的导师'
          })
          return
        } else {
          this.$message({
            type: 'success',
            message: '搜索成功请在下方导师下拉中选择！'
          })
        }
        this.mentorSearchList = res.data
        this.modelData.mentorId = ''
        // this.mentorListVisible = true;
      })
    },
    chooseMentor (i) {
      this.modelData.mentorId = this.mentorSearchList[i].mentorId
      this.mentorName = this.mentorSearchList[i].mentorName
      this.mentorListClose()
    },
    mentorListClose () {
      this.mentorListVisible = false
      this.mentorSearchList = []
    },
    change1 (file, fileList) {
      console.log(file, fileList)
      this.fileList1 = fileList
    },
    remove1 () {
      this.fileList1 = []
    },
    uploadFileAxios1 (file, fileList) {
      console.log(file, fileList, this.fileList1)
      this.$loading()
      uploadFunBySys(file.file, `resume/${this.menteeId}`, url => {
        console.log(url)
        this.resumeList.forEach(item => {
          item.showSelected = false
        })
        this.resumeList.push({ fileName: file.file.name, fileUrl: url, showSelected: true })
      })
    },
    delete1 (i) {
      this.fileList1.splice(i, 1)
      console.log(i, this.fileList1)
    },
    download (val) {
      file.preview(val)
    },
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },
    selectAll (item, i) {
      console.log(item, i)
      if (this.resumeList[i].showSelected) {
        this.resumeList[i].showSelected = false
      } else {
        this.resumeList[i].showSelected = true
      }
      this.resumeList.forEach(item2 => {
        if (item2.fileUrl != item.fileUrl) {
          item2.showSelected = false
        }
      })
      this.$forceUpdate()
    },
    changeSelect2 () {
      console.log(111111111111)
    },
    changeSelect () {
      console.log(this.modelData.resumeType)
      if (this.modelData.mentorId) {
        this.mentorSearchList.forEach(item => {
          if (item.mentorId == this.modelData.mentorId) {
            if (!item.letterModifyCompensationType) {
              this.$message.error('请去导师管理处，设置此导师的文书修改佣金 ！！')
              return false
            }
            if (this.modelData.resumeType == 'cl') {
              this.price = `${item.letterModifyCompensationType == 'usd' ? '$' : '￥'}${item.letterModifyCompensationCoverLetter}`
              this.modelData.taskFundType = item.letterModifyCompensationType
              this.modelData.taskFundWage = item.letterModifyCompensationCoverLetter
            } else if (this.modelData.resumeType == 'chi') {
              this.price = `${item.letterModifyCompensationType == 'usd' ? '$' : '￥'}${item.letterModifyCompensationResumeZh}`
              this.modelData.taskFundType = item.letterModifyCompensationType
              this.modelData.taskFundWage = item.letterModifyCompensationResumeZh
            } else if (this.modelData.resumeType == 'eng') {
              this.price = `${item.letterModifyCompensationType == 'usd' ? '$' : '￥'}${item.letterModifyCompensationResumeEn}`
              this.modelData.taskFundType = item.letterModifyCompensationType
              this.modelData.taskFundWage = item.letterModifyCompensationResumeEn
            }
          }
        })
      } else {
        this.$message.error('请先选择导师！！')
      }
    },
    remoteMethod (query) {
      console.log(query)
      if (query !== '') {
        this.loading = true
        apiVip.searchMentorByMentorName({ mentorName: query }).then(res => {
          console.log(res.data)
          // if (!res.data.length) {
          //   this.$message({
          //     type: "warning",
          //     message: "无该姓名的导师"
          //   });
          //   return;
          // }else{
          //   this.$message({
          //     type: "success",
          //     message: "搜索成功请在下方导师下拉中选择！"
          //   });
          // }
          this.mentorSearchList = res.data
          // this.modelData.mentorId = '';
          this.$forceUpdate()
          this.loading = false
        // this.mentorListVisible = true;
        })
      } else {
        this.mentorSearchList = []
      }
    }
  }
}
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
