<!--
 * @Author: 库建华
 * @Date: 2019-07-10 08:48:50
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 10:44:57
 * @Version:
 * @Description:
 -->
<template>
  <el-dialog :close-on-click-modal="false" :visible="uploadVisible" :title="'更新文件'" :before-close="uploadFileClose" width="800px">
    <el-form>
      <el-form-item label="当前路径：" label-width="160px">{{path}}</el-form-item>
      <el-form-item label="文件名：" label-width="160px">
        <el-input v-model="fileData.name" size="mini" :style="{width:'350px'}"></el-input>
      </el-form-item>
      <el-form-item label="文 件：" label-width="160px">
        <el-upload
          :http-request="Upload"
          :file-list="fileList"
          :on-change="handleChange"
          :on-remove="handleRemove"
          class="upload"
          ref="elupload"
          action
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <!-- <div class="el-upload__text">只能上传PDF、Word、Excel文件</div> -->
        </el-upload>
        进 度：<el-progress :style="{width:'400px'}" :percentage="progress"></el-progress>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="uploadFileClose">取 消</el-button>
      <el-button type="primary" @click="uploadFileSubmit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { uploadFun } from '@/libs/file'
import api from '@/api/file_system.js'

export default {
  name: 'uploadFile',
  props: {
    uploadVisible: {
      type: Boolean,
      default: false
    },
    fileNav: {
      type: Array
    },
    updataFileData: {
      type: Object
    }
  },
  data () {
    return {
      fileList: [],
      fileData: {},
      progress: 0
    }
  },
  computed: {
    path: function () {
      let p = ''
      this.fileNav.forEach(v => {
        p += v.navigateName + ' / '
      })
      return p
    }
  },

  watch: {
    uploadVisible: function (val) {
      if (val) {
        this.fileData.name = this.updataFileData.fileName
        this.fileData.fileId = this.updataFileData.fileId
        console.log(this.updataFileData)
      }
    }
  },
  methods: {
    beforeUpload (file) {
      console.log(file)
      this.$emit('callbackfile', file)
      return false
    },
    Upload ({ file }) {
      console.log(file)
      this.fileData.file = file
      this.fileData.size = file.size
      this.fileData.type = file.type
      this.fileData.name = file.name
    },
    handleChange (file, fileList) {
      console.log(file)
      this.fileList = fileList.slice(-1)
    },
    clearFiles () {
      this.$refs.elupload.clearFiles()
    },
    handleRemove (file, fileList) {
      console.log('handleRemove', file, fileList)
      if (!fileList.length) {
        this.fileData = {}
      }
    },
    uploadFileClose () {
      console.log('uploadClose')
      this.$refs.elupload.clearFiles()
      this.$emit('close')
    },
    uploadFileSubmit () {
      console.log('uploadFileSubmit', this.fileData)
      if (!this.fileData.file) {
        this.uploadFileClose()
        return
      }
      // this.$loading();
      const that = this
      uploadFun(this.fileData.file, 'public/', p => { that.progress = p }, url => {
        const data = {
          fileType: 'document',
          fileName: this.fileData.name,
          fileId: this.fileData.fileId,
          docType: this.fileData.name.split('.').reverse()[0],
          docSize: this.fileData.size,
          ownership: 'public',
          owner: null,
          fileUrl: url,
          parentId: this.fileNav[this.fileNav.length - 1].navigateId,
          parentDir: this.path
        }
        data.url = url
        api.setFile({ uptList: [data] }).then(res => {
          this.fileData = {}
          this.$refs.elupload.clearFiles()
          this.uploadFileClose()
          // this.$loading().close();
          this.progress = 0
          this.$emit('submit')
        })
      })
    }
  }
}
</script>

<style lang="scss">
.upload {
  display: flex;
  align-items: center;
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
}
</style>
