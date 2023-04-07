<!--
 * @Author: 杨曦
 * @Date: 2020-09-23 10:20:42
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-08 09:27:51
 * @Version:
 * @Description:
-->
<template>
    <div class="fileAlert">
      <el-dialog :visible.sync="uploadSpeedVisible" width="500px" :close-on-click-modal="false"
      title="上传音频"
      :before-close="close">
        <div>
            <el-upload
              :http-request="uploadFileAxios"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              class="upload yxuploaddas mt20"
              ref="elupload1"
              action
              :limit= 1
              accept=".MP3,.MP4,.mp4,.WAVE,.mp3,.wave,.wma,.WMA,.aac,.AAC,.M4A,.m4a,.WAV,.wav"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__text">仅支持部分类型文件：WAV、MP3、M4A、WMA、ACC、OGG、AMR、FLAC</div>
            </el-upload>进 度：
            <el-progress :style="{width:'400px'}" class="mb20" :percentage="progress" :color="customColors"></el-progress>
        </div>
      </el-dialog>
    </div>
  </template>

<script>
import api from '@/api/dictionary.js'
import { typeString } from '@/libs/filter/typeMatch'
import { uploadFunSpeed } from '@/libs/file'
export default {
  props: {
    uploadSpeedVisible: {
      type: Boolean,
      default: false
    },
    internshipId2: {
      type: Object
    }
  },
  data: () => {
    return {
      fileList: [],
      progress: 0,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
    }
  },
  watch: {
    uploadSpeedVisible: function (val, old) {
      if (val) {
      }
    }
  },
  mounted () {

  },
  methods: {
    close () {
      this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
      this.fileList = []
      this.$emit('close')
    },
    uploadFileAxios (file, fileList) {
      // this.$loading();
      console.info(file, fileList)
      const that = this
      uploadFunSpeed(
        file.file,
          `asr`,
          p => {
            that.progress = p
          },
          url => {
            console.log(url)
            const data = {
              fileName: file.file.name,
              filePath: url,
              fileSize: file.file.size
            }
            console.log(data)
            api.addSpeechRecognition(data).then(res => {
              this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
              this.progress = 0
              this.$loading().close()
              this.$emit('submit')
            })
          }
      )
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    clearFiles () {
      this.$refs.elupload && this.$refs.elupload.clearFiles()
    },
    handleRemove (file, fileList) {
      console.log('handleRemove', file, fileList)
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
