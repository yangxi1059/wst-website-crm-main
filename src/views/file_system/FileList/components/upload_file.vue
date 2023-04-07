<!--
 * @Author: 杨曦
 * @Date: 2022-01-14 10:40:41
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-22 10:45:55
 * @Version:
 * @Description:
-->
<!--
 * @Author: 库建华
 * @Date: 2019-07-09 10:31:34
 * @LastEditors: kaan
 * @LastEditTime: 2021-03-09 16:45:06
 * @Version:
 * @Description:
 -->
<template>
    <el-form class="aaaaa">
        <el-upload
          :http-request="uploadFileAxios"
          :file-list="fileList"
          :on-change="handleChange"
          :on-remove="handleRemove"
          class="upload"
          ref="elupload"
          action
          drag
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
        <el-progress class="load_box" :style="{width:'300px'}" :percentage="progress" :color="customColors" v-show="showLoad"></el-progress>
    </el-form>
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
    }
  },
  data () {
    return {
      fileList: [],
      fileData: {},
      number: 0,
      progress: 0,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      showLoad: false
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
  mounted () {},
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
      this.$refs.elupload.clearFiles()
    },

    uploadFileAxios (file, fileList) {
      this.number++
      // this.$loading();
      // console.info(file, fileList);
      const that = this
      this.showLoad = true
      uploadFun(
        file.file,
        'public',
        p => {
          that.progress = p
        },
        url => {
          const data = {
            fileType: 'document',
            fileName: file.file.name,
            docType: file.file.name.split('.').reverse()[0],
            docSize: file.file.size,
            ownership: 'public',
            owner: null,
            fileUrl: url,
            parentId: this.fileNav[this.fileNav.length - 1].navigateId,
            parentDir: this.path
          }
          data.url = url
          console.log('新增文件参数', { addList: [data] })
          this.$emit('setUploadFileList', data)
          api.setFile({ addList: [data] }).then(res => {
            this.showLoad = false
            console.log('新增文件', res)
            this.fileData = {}
            this.$refs.elupload.clearFiles()
            this.uploadFileClose()
            this.number--
            if (!this.number) {
              this.progress = 0
              this.$emit('submit')
              // this.$loading().close();
            }
          })
        }
      )
    }
  }
}
</script>

<style lang="scss" >
.aaaaa{
  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
  .el-upload-dragger .el-icon-upload{
    font-size: 33px !important;
  }
  .el-upload-dragger{
    height:50px;
    display: flex;
    justify-content:center;/*x轴对齐方式*/
    align-items:center;
  }
  .el-icon-upload{
    margin:0 !important;
  }
  .el-upload__text{
    width:200px;
    display: inline-block;
  }
  .load_box{
    position:absolute;
    margin-top:-35px;
    left:50px;
    z-index: 2003;
  }
}
</style>
