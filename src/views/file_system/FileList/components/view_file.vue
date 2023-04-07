<!--
 * @Author: 杨曦
 * @Date: 2022-01-14 10:40:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 10:45:39
 * @Version: 
 * @Description: 
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :visible="viewFileVisible"
      :before-close="viewFileClose"
      fullscreen
    >
    <div class="header">文件查看</div>
      <iframe class="iframe" :style="{height: height + 'px'}"  :src="src" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/file_system.js'
export default {
  props: {
    url: {
      type: String
    },
    viewFileVisible: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      src: '',
      height: (document.documentElement.clientHeight - 80)
    }
  },
  watch: {
    viewFileVisible: function (val, old) {
      if (val) {
        console.log(this.url)
        this.getFilePreviewUrlByUrl(this.url)
        console.log(this.src)
      }
    }
  },
  methods: {
    viewFileClose () {
      this.src = ''
      this.$emit('close')
    },
    getFilePreviewUrlByUrl (url) {
      console.log('预览路径参数', this.url)
      api.getFilePreviewUrlByUrl({ objectKey: url })
        .then(res => {
          console.log('预览路径', res)
          this.src = res.data
          console.log(this.src)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 10px;
  background-color: #fff;
  position: absolute;
  margin-top: -50px;
  padding:0 20px;
  font-size: 30px;
  line-height: 80px;
}
.iframe{
  width: 100%;
  margin-top: -20px;
}
</style>
