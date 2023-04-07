<!--
 * @Author: kaan
 * @Date: 2022-01-19 18:34:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-15 14:56:57
 * @Version:
 * @Description:
-->
<template>
  <div>
      <el-tabs type="card" @tab-click="handleClick" v-model="fileType">
        <el-tab-pane label="ALL" name="ALL" v-if="roleInfo.includes(`vip_mentor_mentorFile_ALL`)">
          <el-col class="mb10" v-for="(item,i) in menteeFile" :key="i">
            <el-select
              class="mr10"
              size="mini"
              filterable
              v-model="item.fileType"
              placeholder="请选择"
              @change="changeFileType(item)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_ALL_select`)"
            >
              <el-option
                v-for="item in file_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
            {{item.fileName}} --上传者：{{item.createByName}} -- 时间：{{item.createTime}}
          </el-col>
        </el-tab-pane>
        <el-tab-pane
          label="简历"
          name="resume"
          v-if="roleInfo.includes(`vip_mentor_mentorFile_resume`)"
        >
          <el-col class="mb10" v-for="(item,i) in resumeFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.fileUrl)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_resume_view`)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.fileUrl)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_resume_download`)"
            >下载</el-button>
            <el-button
              size="mini"
              @click="deleteFile(item.pkId)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_resume_delete`)"
            >删除</el-button>
            {{item.fileName}}
          </el-col>
          <el-col v-if="roleInfo.includes(`vip_mentor_mentorFile_resume_upload`)">
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
              <!-- <div class="el-upload__text">只能上传PDF、Word、Excel文件</div> -->
            </el-upload>进 度：
            <el-progress :style="{width:'400px'}" :percentage="progress" :color="customColors"></el-progress>
          </el-col>
        </el-tab-pane>
        <el-tab-pane
          label="合同"
          name="contract"
          v-if="roleInfo.includes(`vip_mentor_mentorFile_contract`)"
        >
          <el-col class="mb10" v-for="(item,i) in contractFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.fileUrl)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_contract_view`)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.fileUrl)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_contract_download`)"
            >下载</el-button>
            <el-button
              size="mini"
              @click="deleteFile(item.pkId)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_contract_delete`)"
            >删除</el-button>
            {{item.fileName}} --上传者：{{item.createByName}} -- 时间：{{item.createTime}}
          </el-col>
          <el-col v-if="roleInfo.includes(`vip_mentor_mentorFile_contract_upload`)">
            <el-upload
              :http-request="uploadFileAxios"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              class="upload mt20"
              ref="elupload2"
              action
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <!-- <div class="el-upload__text">只能上传PDF、Word、Excel文件</div> -->
            </el-upload>进 度：
            <el-progress :style="{width:'400px'}" :percentage="progress" :color="customColors"></el-progress>
          </el-col>
        </el-tab-pane>
        <el-tab-pane
          label="测试卡"
          name="test_card"
          v-if="roleInfo.includes(`vip_mentor_mentorFile_card`)"
        >
          <el-col class="mb10" v-for="(item,i) in test_cardFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.fileUrl)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_card_view`)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.fileUrl)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_card_download`)"
            >下载</el-button>
            <el-button
              size="mini"
              @click="deleteFile(item.pkId)"
              v-if="roleInfo.includes(`vip_mentor_mentorFile_card_delete`)"
            >删除</el-button>
            {{item.fileName}} --上传者：{{item.createByName}} -- 时间：{{item.createTime}}
          </el-col>
          <el-col v-if="roleInfo.includes(`vip_mentor_mentorFile_card_upload`)">
            <el-upload
              :http-request="uploadFileAxios"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              class="upload mt20"
              ref="elupload3"
              action
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <!-- <div class="el-upload__text">只能上传PDF、Word、Excel文件</div> -->
            </el-upload>进 度：
            <el-progress :style="{width:'400px'}" :percentage="progress" :color="customColors"></el-progress>
          </el-col>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { uploadFun, downloadFun, downloadFunD } from '@/libs/file'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  props: {
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      mentorId: '',
      fileType: 'resume',
      menteeFile: [],
      resumeFile: [],
      contractFile: [],
      test_cardFile: [],
      fileList: [],
      progress: 0,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      file_type: []
    }
  },
  watch: {
  },
  mounted () {
    this.initPage()
    console.log(this.fileType)
    if (!this.file_type.length) {
      this.init()
    }
  },
  methods: {
    async init () {
      this.file_type = await this.getDictionary('file_type')
    },
    initPage () {
      this.mentorId = this.$route.query.mentorId
      api.getMentorFileByMentorId(this.mentorId).then(res => {
        console.log(res)
        this.menteeFile = res.data
        this.resumeFile = res.data.filter(v => v.fileType == 'resume')
        this.contractFile = res.data.filter(v => v.fileType == 'contract')
        this.test_cardFile = res.data.filter(v => v.fileType == 'test_card')
      })
    },
    handleClick (tab, event) {
      console.log(tab.paneName, event)
      this.fileType = tab.paneName
    },
    close () {
      this.$emit('close')
      this.fileType = 'resume'
      this.fileList = []
    },
    callbackfile2 (val) {
      console.log('callbackfile2', val)
      this.contractFilt = val
    },
    upLoadF2 (v) {
      console.log('upLoadF2', v)
      this.contractFilt = v
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    clearFiles () {
      this.$refs.elupload && this.$refs.elupload.clearFiles()
    },
    handleRemove (file, fileList) {
      console.log('handleRemove', file, fileList)
      if (!fileList.length) {
        this.fileData = {}
      }
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
            fileType: this.fileType,
            fileName: file.file.name,
            fileUrl: url,
            mentorId: this.mentorId
          }
          data.url = url
          console.log(data)
          api.addMentorFile(data).then(res => {
            console.log('新增文件', res)
            this.fileData = {}
            this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
            this.$refs.elupload2 && this.$refs.elupload2.clearFiles()
            this.$refs.elupload3 && this.$refs.elupload3.clearFiles()
            this.progress = 0
            this.$loading().close()
            this.initPage()
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
          this.initPage()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
    },
    changeFileType (v) {
      this.$loading()
      console.log(v)
      const data = {
        pkId: v.pkId,
        fileType: v.fileType
      }
      console.log(data)
      api.uptMentorFile(data).then(() => {
        this.$loading().close()
        this.initPage()
        this.$message({
          type: 'success',
          message: '更新类型成功'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
