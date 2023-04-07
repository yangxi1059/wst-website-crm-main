<!--
 * @Author: 杨曦
 * @Date: 2022-08-15 13:38:39
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-27 09:32:23
 * @Version:
 * @Description:
-->

<template>
  <div class="inputInformation">
    <el-dialog
      :close-on-click-modal="false"
      class="info"
      title="对接任务详情"
      :append-to-body="true"
      :visible.sync="detailVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-tag size="medium" type="primary">分配状态:【{{taskDetail.taskStatusName}}】   分配给:【{{taskDetail.taskUserName}}】   创建时间:【{{taskDetail.createTime}}】</el-tag>
      <div class="mt10">
        <el-tag size="medium" type="danger" >对接备注:【{{dataAll.taskRemark || '暂无'}}】</el-tag>
      </div>
      <mentorEditComponents ref="mychild" :detail2Visible="detail2Visible" :dockingType="dockingType" :taskDetail="taskDetail" :editType="1" :mentorData0="mentorData0" @submitNew="submitNew" @success="detailSuccess" />
      <div class="create-cant-program-model">
        <div class="program-model-title">入职凭证</div>
        <div>
          <div class="mb10" >
            <el-button
              size="mini"
              @click="download(mentorData0.certificate)"
            >预览</el-button>
          </div>
        </div>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">简历</div>
        <div>
          <div class="mb10" v-for="(item,i) in resumeFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.fileUrl)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.fileUrl)"
            >下载</el-button>
            <el-button
              size="mini"
              @click="deleteFile(item.pkId)"
            >删除</el-button>
            {{item.fileName}}
          </div>
          <div v-if="taskDetail.taskStatus != 'finish' && taskDetail.taskStatus != 'cancel'">
            <el-upload
              :http-request="uploadFileAxios"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              class="upload mt20"
              ref="elupload1"
              action
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
            <div style="display:flex" class="mt10">
              <span class="mr10">进 度：</span>
              <el-progress :style="{width:'330px'}" :percentage="progress" :color="customColors"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">合同</div>
        <div>
          <div class="mb10" v-for="(item,i) in contractFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.fileUrl)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.fileUrl)"
            >下载</el-button>
            <el-button
              size="mini"
              @click="deleteFile(item.pkId)"
            >删除</el-button>
            {{item.fileName}} --上传者：{{item.createByName}} -- 时间：{{item.createTime}}
          </div>
          <div v-if="taskDetail.taskStatus != 'finish' && taskDetail.taskStatus != 'cancel'">
            <el-upload
              :http-request="uploadFileAxios2"
              :file-list="fileList2"
              :on-change="handleChange"
              :on-remove="handleRemove"
              class="upload mt20"
              ref="elupload1"
              action
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
            <div style="display:flex" class="mt10">
              <span class="mr10">进 度：</span>
              <el-progress :style="{width:'330px'}" :percentage="progress1" :color="customColors"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div class="create-cant-program-model" v-if="dockingType == 1">
        <div class="program-model-title">核验</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="核验状态：" prop="taskStatus">
            <el-radio-group v-model="ruleForm.taskStatus">
              <el-radio :label="'finish'">已完成</el-radio>
              <el-radio :label="'need_edit'">需变更</el-radio>
              <el-radio :label="'cancel'">已取消</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.taskStatus == 'need_edit' || ruleForm.taskStatus == 'cancel'" label="核验备注：" prop="taskRemark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6}"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
              v-model="ruleForm.taskRemark">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" v-if="dockingType == 0 && (taskDetail.taskStatus == 'ongoing' || taskDetail.taskStatus == 'need_edit')"  @click="deleteCheck()">任务失效</el-button>
          <el-button type="primary" v-if="dockingType == 0 && (taskDetail.taskStatus == 'ongoing' || taskDetail.taskStatus == 'need_edit')"  @click="submitCheck()">提交审核</el-button>
          <el-button type="primary" v-if="dockingType == 1 && ruleForm.taskStatus == 'finish'"  @click="submitSearch()">核 验</el-button>
          <el-button type="primary" v-if="dockingType == 1 && ruleForm.taskStatus != 'finish'"  @click="submit()">核 验</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查重导师" :append-to-body="true" :close-on-click-modal="false" :visible.sync="useDockingVisible" width="600px" :before-close="closeSearch">
      <div >
        <div style="text-align:center">
          <el-tag size="small" v-if="mentorList.length > 0">查询后的导师列表</el-tag>
          <el-tag size="small" type="danger" v-else>暂无查重导师</el-tag>
        </div>
        <div class="mentorBlock" v-for="(item,i) in mentorList" :key="i">
          <div class="mentorBlock_item">导师名：{{item.mentorName}}</div>
          <div class="mentorBlock_item">微信ID：{{item.wxId}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSearch">取 消</el-button>
        <el-button type="primary"   @click="submit()">继续核验</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { uploadFun, downloadFun, downloadFunD } from '@/libs/file'
import mentorEditComponents from '../../mentor/components/mentorEditComponents.vue'
export default {
  mixins: [mixins],
  components: { mentorEditComponents },
  name: 'mentorEdit',
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    mentorId: {
      type: String
    },
    taskDetail: {
      type: Object
    },
    dockingType: {
      type: Number
    }
  },
  data () {
    return {
      mentorData0: {},
      detail2Visible: false,
      resumeFile: [],
      contractFile: [],
      progress: 0,
      progress1: 0,
      fileList: [],
      dataAll: {},
      useDockingVisible: false,
      mentorList: [],
      ruleForm: {
        taskStatus: '',
        taskRemark: ''
      },
      rules: {
        taskStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        taskRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      fileList2: [],
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  watch: {
    detailVisible: function (newData) {
      if (newData) {
        this.init()
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.initFile()
      this.initMentor()
    },
    initMentor () {
      api.dockingDetail(this.mentorId).then(res => {
        console.log(res.data)
        if (res.data) {
          this.ruleForm.taskRemark = res.data.taskRemark
          this.dataAll = res.data
          this.mentorData0 = JSON.parse(JSON.stringify(res.data.mentorInfo))
          this.mentorData0.compensationFixed = this.mentorData0.compensationFixed || '1'
          if (this.mentorData0.meritCompensation == undefined) { this.mentorData0.meritCompensation = 0 }
          this.mentorData0.careerTrackName = this.mentorData0.careerTrackName
            ? this.mentorData0.careerTrackName.split(',')
            : []
          this.mentorData0.careerTrack = this.mentorData0.careerTrack
            ? this.mentorData0.careerTrack.split(',')
            : []
          this.mentorData0.track = this.mentorData0.track
            ? this.mentorData0.track.split(',')
            : []
          this.mentorData0.trackName = this.mentorData0.trackName
            ? this.mentorData0.trackName.split(',')
            : []
          this.mentorData0.careerCountry = this.mentorData0.careerCountry
            ? this.mentorData0.careerCountry.split(',')
            : []
          this.mentorData0.gpCountry = this.mentorData0.gpCountry
            ? this.mentorData0.gpCountry.split(',')
            : []
          this.mentorData0.tutoringCountry = this.mentorData0.tutoringCountry
            ? this.mentorData0.tutoringCountry.split(',')
            : []
          this.country = this.mentorData0.country
            ? this.mentorData0.country.split(',')
            : []
          this.mentorData0.countryName = this.mentorData0.countryName
            ? this.mentorData0.countryName.split(',')
            : []
          this.mentorData0.location = this.mentorData0.location
            ? this.mentorData0.location.split(',')
            : []
          this.mentorData0.company = this.mentorData0.company
            ? this.mentorData0.company.split(',')
            : []
          this.mentorData0.division = this.mentorData0.division
            ? this.mentorData0.division.split(',')
            : []
          this.mentorData0.gpMajor = this.mentorData0.gpMajor
            ? this.mentorData0.gpMajor.split(',')
            : []
          this.mentorData0.gpMajorName = this.mentorData0.gpMajorName
            ? this.mentorData0.gpMajorName.split(',')
            : []
          this.mentorData0.tutoringSubject = this.mentorData0.tutoringSubject
            ? this.mentorData0.tutoringSubject.split(',')
            : []
          this.mentorData0.undergradMajor = this.mentorData0.undergradMajor
            ? this.mentorData0.undergradMajor.split(',')
            : []
          this.mentorData0.masterMajor = this.mentorData0.masterMajor
            ? this.mentorData0.masterMajor.split(',')
            : []
          this.mentorData0.phdMajor = this.mentorData0.phdMajor
            ? this.mentorData0.phdMajor.split(',')
            : []
          console.log('getMentorDetailById', this.mentorData0)
          this.detail2Visible = true
        }
      })
    },
    initFile () {
      api.getMentorFileByMentorId(this.mentorId).then(res => {
        console.log(res)
        this.resumeFile = res.data.filter(v => v.fileType == 'resume')
        this.contractFile = res.data.filter(v => v.fileType == 'contract')
      })
    },
    uploadFileAxios (file) {
      const that = this
      uploadFun(
        file.file,
        `mentorFile/${this.mentorId}`,
        p => {
          that.progress = p
        },
        url => {
          const data = {
            fileType: 'resume',
            fileName: file.file.name,
            fileUrl: url,
            mentorId: this.mentorId
          }
          data.url = url
          console.log(data)
          api.addMentorFile(data).then(res => {
            console.log('新增文件', res)
            this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
            this.$refs.elupload2 && this.$refs.elupload2.clearFiles()
            this.progress = 0
            this.fileList = []
            this.fileList2 = []
            this.$loading().close()
            this.initFile()
          })
        }
      )
    },
    uploadFileAxios2 (file) {
      const that = this
      uploadFun(
        file.file,
        `mentorFile/${this.mentorId}`,
        p => {
          that.progress1 = p
        },
        url => {
          const data = {
            fileType: 'contract',
            fileName: file.file.name,
            fileUrl: url,
            mentorId: this.mentorId
          }
          data.url = url
          console.log(data)
          api.addMentorFile(data).then(res => {
            console.log('新增文件', res)
            this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
            this.$refs.elupload2 && this.$refs.elupload2.clearFiles()
            this.progress1 = 0
            this.fileList = []
            this.fileList2 = []
            this.$loading().close()
            this.initFile()
          })
        }
      )
    },
    // 预览
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    closeSearch () {
      this.mentorList = []
      this.useDockingVisible = false
    },
    // 下载
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },
    deleteFile (pkId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading()
        api.delMentorFile({ pkId }).then(() => {
          this.$loading().close()
          this.initFile()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
    },
    clear () {
      this.ruleForm = {
        taskStatus: '',
        taskRemark: ''
      }
      this.dataAll = {}
      this.detail2Visible = false
      this.mentorData0 = {}
      this.resumeFile = []
      this.contractFile = []
    },
    handleClose () {
      this.clear()
      this.$emit('close')
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-1)
      this.fileList2 = fileList.slice(-1)
    },
    handleRemove (file, fileList) {
      console.log('handleRemove', file, fileList)
    },
    detailSuccess () {
      this.initMentor()
      this.detail2Visible = false
    },
    submitCheck () {
      this.$refs.mychild.submit(true)
    },
    deleteCheck () {
      const data = {
        mentorId: this.mentorId,
        taskStatus: 'cancel'
      }
      api.submitDocking(data).then(res => {
        this.$message.success('提交任务失效成功')
        this.clear()
        this.$loading().close()
        this.$emit('submit')
      })
    },
    submitNew () {
      if (this.resumeFile.length > 0 && this.contractFile.length > 0) {
        this.$confirm('此操作将提交核验，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            mentorId: this.mentorId,
            taskStatus: 'pending_check'
          }
          api.submitDocking(data).then(res => {
            this.$message.success('提交核验成功！！')
            this.clear()
            this.$loading().close()
            this.$emit('submit')
          })
        })
      } else {
        this.$message.error('至少要有一份简历和一份合同！！')
      }
    },
    submitSearch () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          api.getMentorSearch(this.dataAll.mentorName).then(res => {
            this.useDockingVisible = true
            console.log(res.data)
            this.mentorList = res.data
          })
        }
      })
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = {
            mentorId: this.mentorId,
            taskStatus: this.ruleForm.taskStatus,
            taskRemark: this.ruleForm.taskRemark
          }
          console.log(data)
          this.$loading()
          api.checkDocking(data).then(res => {
            this.$message.success('核验成功！！')
            this.clear()
            this.closeSearch()
            this.$loading().close()
            this.$emit('submit')
          }).catch(err => {
            this.$loading().close()
            this.$message.error(err.message)
          })
        }
      })
      // if (this.resumeFile.length > 0 && this.contractFile.length > 0) {
      // } else {
      //   this.$message.error('至少要有一份简历和一份合同！！')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
$color: #dcdfe6;
$margin: top;
@mixin br5 {
  border-radius: 5px;
}
@mixin br22($mar: 20) {
  border-radius: 22px;
  margin-#{$margin}: double($mar) + px;
}
.common {
  padding: 20px;
}

%m {
  display: block;
}
.currency-select ::v-deep .el-input {
    width: 60px;
  }
.mentor_check{
  padding-left:20px;
  padding-right:12px;
  width:160px;
  text-align:left;
  box-sizing: border-box;
  display: inline-block;
}
.create-cant-program-model {
  @include br22(13);
  @include br5;
  @extend .common;
  @extend %m;
  // @extend %mm;
  border: 1px $color solid;
  margin-#{$margin}: 20px;
  position: relative;
}
.program-model-title {
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: #fff;
  padding: 10px;
}
.info-position{
  position:absolute;
  top:0;
  right:-30px;
}
</style>
