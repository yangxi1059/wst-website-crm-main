<template>
  <div class="custom-upload">
    <el-dialog
      title="图片裁剪"
      :visible.sync="showCropper"
      top="6vh"
      width="800px"
      height="400px"
      class="cropper-dialog"
      append-to-body
    >
      <vue-cropper
        v-if="showCropper"
        id="corpper"
        ref="cropper"
        :class="{'corpper-warp':showCropper}"
        v-bind="cropper"
      />
      <div v-if="showCropper" class="cropper-button">
        <el-button class="cancel-btn" size="" @click.native="showCropper=false">取消</el-button>
        <el-button size="" type="primary" :loading="loading" @click="uploadCover">完成</el-button>
      </div>
    </el-dialog>
    <el-upload
      action
      :id="id"
      :auto-upload="false"
      ref="upload"
      :on-change="onChange"
      :on-success="onChange"
      :on-error="onError"
      class="upload min-dragger"
      drag
      :show-file-list="false"
      type="file"
      >
      上传图片（可拖拽）
    </el-upload>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg文件</div>
  </div>
</template>

<script>
// 上传文件组件
import { VueCropper } from 'vue-cropper'

// 定义的接口根据自己项目更换
import { uploadImgBackUrlCropper } from '@/libs/file'

import { isImageFile, isMaxFileSize, readFile } from '@/libs/upload.js' // 见下文
import { Message } from 'element-ui'

export default {
  components: {
    VueCropper
  },
  props: {
    // 最大上传文件的大小
    maxFileSize: {
      type: Number,
      default: 10 // （MB)
    },
    // 按钮文字
    buttonName: {
      type: String,
      default: '上传图片'
    },
    // 提示内容
    tips: {
      type: String
    },
    // 图片裁剪比列
    fixedNumber: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 图片文件分辨率的宽度
    width: {
      type: Number,
      default: 460
    },
    // 图片文件分辨率的高度
    height: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      id: 'cropper-input-' + +new Date(),
      loading: false,
      showCropper: false,
      file_list: [],
      cropper: {
        img: '',
        info: true,
        size: 0.9,
        outputType: 'png',
        canScale: true,
        autoCrop: true,
        full: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        fixedBox: false,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: this.fixedNumber,
        original: false,
        canMoveBox: true,
        canMove: true
      }
    }
  },
  methods: {
    // 打开文件
    handleOpenFile () {
      const input = document.getElementById(this.id)
      // 解决同一个文件不能监听的问题
      input.addEventListener(
        'click',
        function () {
          this.value = ''
        },
        false
      )
      // 点击input
      input.click()
    },

    // 裁剪input 监听
    async onChange (file, fileList) {
      file = file.raw
      console.log(file, fileList)
      if (!file) {
        return Message.error('选择图片失败')
      }
      // 验证文件类型
      if (!isImageFile(file)) {
        return
      }
      try {
        // 读取文件
        const src = await readFile(file)
        this.showCropper = true
        this.cropper.img = src
      } catch (error) {
        console.log(error)
      }
    },
    onError (err) {
      console.log(err)
    },
    // 封面上传功能
    uploadCover () {
      this.$refs.cropper.getCropBlob(async data => {
        try {
          // 文件大小限制
          if (!isMaxFileSize(data, this.maxFileSize)) {
            return
          }
          this.loading = true
          console.log(data)
          const aTime = new Date().getTime() // 取时间戳，给文件命名
          const fileName = aTime + '.' + data.type.substr(6) // 给文件名加后缀
          const file = new window.File([data], fileName, { type: data.type })
          uploadImgBackUrlCropper(fileName, file, url => {
            console.log(url)
            setTimeout(() => {
              Message.success('上传成功')
              this.$emit('subUploadSucceed', url)
              this.loading = false
              this.showCropper = false
            }, 1000)
          })
        } catch (error) {
          console.log(error)
          this.loading = false
          this.showCropper = false
          Message.error(error.data.message)
        }
      })
    }
  }
}
</script>

<style lang="scss"  >
#corpper {
  width: 90%;
  height: 400px;
  margin: 0 auto;
  background-image: none;
  background: #fff;
  z-index: 1002;
}
.min-dragger{
  .el-upload-dragger{
    width: 160px;
    height: 40px;
  }
}
.cropper-dialog {
  height: 800px;
  text-align: center;
  .el-dialog__header {
    padding-top: 15px;
  }
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .el-dialog {
    text-align: center;
  }
}
.cropper-button {
  z-index: 1003;
  text-align: center;
  margin-top: 20px;
  .el-button {
    font-size: 16px;
    cursor: pointer;
    text-align: center;
  }
  .cancel-btn {
    color: #373737;
  }
  .el-button:last-child {
    margin-left: 100px;
  }
}
.cropper-modal {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.custom-upload {
  .tips {
    margin-top: 10px;
    color: red;
    font-size: 12px;
  }
  .clear-margin-top {
    margin-top: 0;
  }
}
</style>
