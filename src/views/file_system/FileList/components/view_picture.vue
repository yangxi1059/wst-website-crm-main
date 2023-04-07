<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :visible="viewPictrueVisible"
      :before-close="viewFileClose"
      fullscreen
    >
      <div class="header" title="Ctrl+鼠标滑轮：可缩放Chrome浏览器网页；  Shift+鼠标滑轮可左右滑动滚动条（如果有左右滚动条）">
        图片查看
        <i class="el-icon-circle-close" @click="viewFileClose"></i>
        <i class="el-icon-zoom-in" @click="width+=10"></i>
        {{width + '%'}}
        <i class="el-icon-zoom-out" @click="width-=10"></i>
      </div>
      <div class="img-box" @click.stop>
        <div class="img" :style="{width:width+'%'}">
          <img class="iframe" :src="url" frameborder="0" />
        </div>
        <div class="img-over"></div>
      </div>
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
    viewPictrueVisible: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      src: '',
      width: 100
    }
  },
  // watch: {
  //   viewPictrueVisible: function(val, old) {
  //     if (val) {
  //       console.log(this.url);
  //       this.getFilePreviewUrlByUrl(this.url);
  //       console.log(this.src);
  //     }
  //   }
  // },
  methods: {
    viewFileClose () {
      this.src = ''
      this.$emit('close')
      this.width = 100
    },
    getFilePreviewUrlByUrl (url) {
      console.log('预览路径参数', this.url)
      api.getFilePreviewUrlByUrl({ objectKey: url }).then(res => {
        console.log('预览路径', res)
        this.src = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 1000px;
  height: 10px;
  background-color: #fff;
  position: fixed;
  margin-top: -70px;
  padding: 0 20px;
  font-size: 30px;
  line-height: 80px;
  background-color: rgba(0, 0, 0, 0);
}

.cui-viewerchrome .cui-topBar2 {
  display: none;
}
.img-box {
  position: relative;
  width: 100%;
}
.img {
  position: relative;
  margin: 0 auto;
}
.iframe {
  width: 100%;
  // height: 600px;
}
.img-over {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
}
</style>
