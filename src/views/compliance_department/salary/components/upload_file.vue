<template>
  <el-dialog :close-on-click-modal="false" :visible="uploadVisible" :title="'导入文件HR薪资'" :before-close="uploadFileClose">
    <el-form ref="formTable" :rules="rules" :model="ruleForm">
      <el-form-item prop="period" label="周 期：" label-width="160px">
        <el-date-picker
          v-model="ruleForm.period"
          type="month"
          value-format="yyyy-MM"
          placeholder="请选择周期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文 件：" label-width="160px">
        <!-- :http-request="Upload" -->
        <el-upload
          :http-request="uploadFileAxios"
          :file-list="fileList"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :headers="header"
          class="upload"
          ref="elupload"
          :action="action"
          drag
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__text">只能上传xlsx格式文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="uploadFileClose">取 消</el-button>
      <el-button type="primary" @click="submitXlsx">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import { URL } from '@/plugin/axios'
const OSS = require('ali-oss')

export default {
  name: 'uploadFile',
  props: {
    uploadVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: [],
      fileData: {},
      rules: {
        period: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      ruleForm: {
        period: ''
      },
      data: null,
      uploadFile: null,
      action: '',
      url: 'http://192.168.0.199:1113/api-dev/file/upload2?path=',
      header: {
        Authorization: ''
      }
    }
  },
  computed: {},
  mounted () {
    this.header.Authorization = sessionStorage.getItem('token')
  },
  watch: {
    uploadVisible: function (val, old) {}
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
      this.fileData.file = file
      this.fileData.size = file.size
      this.fileData.type = file.type
      this.fileData.name = file.name
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
      this.data = null
      this.uploadFile = null
      this.ruleForm.period = ''
      this.$refs.elupload.clearFiles()
      this.fileList = []
      this.$emit('close')
    },

    submitXlsx () {
      if (!this.data) {
        this.$message.error('文件为必传~~')
        return false
      }
      this.$refs.formTable.validate((valid) => {
        console.log(valid)
        if (valid) {
          const a = JSON.parse(JSON.stringify(this.ruleForm.period))
          this.action = URL + `imp/impSalary?period=${a}`
          const formData = {
            uploadFile: this.data,
            period: a
          }
          if (!/\.xlsx$/.test(this.data.get('uploadFile').name)) {
            this.$message({
              type: 'error',
              message: '格式不支持，请先另存为xlsx格式文件'
            })
            this.$refs.elupload.clearFiles()
            this.fileList = []
            return
          }
          console.log(formData)
          this.$loading()
          axios
            .post(
              this.action,
              this.data,
              // { source: data },
              {
                headers: {
                  Authorization: sessionStorage.getItem('token'),
                  version: this.$apiVersion,
                  'Content-Type': 'multipart/form-data'
                }
              }
            )
            .then(res => {
              console.log(res)
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '上传成功'
                })
                this.ruleForm.period = ''
                this.data = null
                this.uploadFile = null
                this.$refs.elupload.clearFiles()
                this.fileList = []
                this.$loading().close()
                this.$emit('submit')
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
                this.data = null
                this.uploadFile = null
                this.$refs.elupload.clearFiles()
                this.fileList = []
                this.$loading().close()
              }
            })
        }
      })
    },
    uploadFileAxios (file, fileList) {
      console.log(file, fileList)
      this.data = new FormData()
      this.data.append('uploadFile', file.file)
      this.uploadFile = file.file
      // data.append("file", file.file);
      console.log(file, this.data, this.data.get('uploadFile'))
    }
  }
}
</script>

<style lang="scss">
.upload {
  display: block;
  align-items: center;
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
}
</style>
