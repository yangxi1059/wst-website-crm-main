<template>
  <el-upload
    :before-upload="beforeUpload"
    :http-request="Upload"
    :disabled="disabled"
    :on-change="handleChange"
    :file-list="fileList"
    :on-remove="handleRemove"
    class="upload"
    ref="elupload"
    action
    drag
  >
    <slot/>
  </el-upload>
</template>

<script>
const IMAGE_MIME_TYPE = ["image/jpeg", "image/png", "image/gif"];
const EXCEL_MIME_TYPE = [
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default {
  name: "upload",
  props: {
    type: {
      type: String,
      default: "word" //
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 5 // M
    },
    path: {
      type: String,
      default: "contract"
    },
    menteeId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fileList: []
    };
  },

  computed: {
    fileAccept() {
      return this.type === "word"
        ? EXCEL_MIME_TYPE.join()
        : IMAGE_MIME_TYPE.join();
    }
  },

  methods: {
    beforeUpload(file) {
      if (!this.menteeId) {
        this.$emit("callbackfile", file);
        return false;
      }
      //   const emitBeforeUpload = result =>
      //     this.$emit("before-upload", { result, type: this.type });
      //   // 格式限制（因为传了accept参数，这里实际上会始终满足限制）
      //   let errMsg = "";
      //   let isAccept = false;
      //   if (this.type === "excel") {
      //     isAccept = EXCEL_MIME_TYPE.includes(file.type);
      //     // FIXME .xls 文件格式file.type为空字符串
      //     if (!isAccept && file.name.split(".")[1] === "xls") {
      //       isAccept = true;
      //     }
      //   } else if (this.type === "image") {
      //     isAccept = IMAGE_MIME_TYPE.includes(file.type);
      //   }
      //   const typeText = this.type === "image" ? "图片" : "文件";
      //   if (!isAccept) {
      //     errMsg = `上传${typeText}必须是 ${IMAGE_MIME_TYPE.map(
      //       i => i.split("/")[1]
      //     ).join("/")} 格式!`;
      //     this.$message.error(errMsg);
      //     emitBeforeUpload(false);
      //     return false;
      //   }
      //   // 大小限制
      //   const mineSize = file.size / 1024 / 1024 < this.maxSize;
      //   errMsg = `上传${typeText}大小不能超过 ${this.maxSize}MB!`;
      //   if (this.type === "image" && !mineSize) {
      //     this.$message.error(errMsg);
      //     emitBeforeUpload(false);
      //     return false;
      //   }
      //   return isAccept;
    },
    Upload({ file }) {
      this.$emit("upLoadF", file);
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    clearFiles() {
      this.$refs.elupload.clearFiles();
    },
    handleRemove(file, fileList) {
      this.$emit("onsuccess", "");
    }
  }
};
</script>

<style lang="scss">
.upload {
  align-items: center;
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
  .el-upload-dragger{
    width: 400px !important;
  }
}
</style>
