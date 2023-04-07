<!--
 * @Author: 杨曦
 * @Date: 2020-09-23 10:20:42
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 11:36:53
 * @Version:
 * @Description:
-->
<template>
  <div class="fileAlert">
    <el-dialog :visible.sync="fileVisible" width="1000px" :close-on-click-modal="false"
    :title="`实习【${this.internshipId2.internshipName || '无'}】的文档`"
    :before-close="close">
      <el-card >
          <el-col class="mb10" v-for="(item,i) in resumeFile" :key="i">
            <el-button
              size="mini"
              @click="download(item.filePath)"
            >预览</el-button>
            <el-button
              size="mini"
              @click="downloadD(item.filePath)"
            >下载</el-button>
            <el-button
              size="mini"
              @click="deleteFile(item.pkId)"
            >删除</el-button>
            {{item.fileName}} --上传者：{{item.createByName}} -- 时间：{{item.createTime}}
          </el-col>
          <el-col >
            <el-upload

              :http-request="uploadFileAxios"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              class="upload yxuploaddas mt20"
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
            <el-progress :style="{width:'400px'}" class="mb20" :percentage="progress" :color="customColors"></el-progress>
          </el-col>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary.js'
import { typeString } from '@/libs/filter/typeMatch'
import { uploadFun, downloadFun, downloadFunD } from '@/libs/file'
export default {
  props: {
    fileVisible: {
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
      resumeFile: [],
      fileData: {}
    }
  },
  watch: {
    fileVisible: function (val, old) {
      if (val) {
        this.Topage()
      }
    }
  },
  mounted () {

  },
  methods: {
    Topage () {
      api.getInternshipFile(this.internshipId2.internshipId).then(res => {
        this.resumeFile = res.data
        console.log(res, 'yux45645465')
      })
    },
    close () {
      this.resumeFile = []
      this.fileList = []
      this.$emit('close')
    },
    uploadFileAxios (file, fileList) {
      // this.$loading();
      console.info(file, fileList)
      const that = this
      uploadFun(
        file.file,
        `internShip/${this.internshipId2.internshipId}`,
        p => {
          that.progress = p
        },
        url => {
          console.log(url)
          const data = {
            internshipId: this.internshipId2.internshipId,
            fileName: file.file.name,
            filePath: url,
            fileType: typeString(file.file.name),
            fileSize: file.file.size
          }
          console.log(data)
          api.addInternshipFile(data).then(res => {
            console.log('新增文件', res)
            this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
            this.progress = 0
            this.$loading().close()
            this.$emit('submit')
            this.Topage()
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
      if (!fileList.length) {
        this.fileData = {}
      }
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
    deleteFile (Id) {
      console.log(Id)
      api.deleteInternshipFile(Id).then(res => {
        console.log(res)
        this.Topage()
        this.$emit('submit')
      })
    }
  }
}
</script>

<style >
  .yxuploaddas .el-upload{
    width: 300px;
    height: 180px;
  }
</style>
