<!--
 * @Author: kaan
 * @Date: 2021-11-23 14:44:01
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-06-28 09:59:22
 * @Version:
 * @Description: 文件预览
-->

<template>
  <div class="view-file-new-window">
    {{videoUrl}}videoUrl
    <div class="iframe" v-if="imgVisible">
      <div class="header" title="Ctrl+鼠标滑轮：可缩放Chrome浏览器网页；  Shift+鼠标滑轮可左右滑动滚动条（如果有左右滚动条）">
        图片查看
        <i class="el-icon-zoom-in" @click="width+=10"></i>
        {{width + '%'}}
        <i class="el-icon-zoom-out" @click="width-=10"></i>
      </div>
      <div class="img-box" @click.stop>
        <div class="img" :style="{width:width+'%'}">
          <img class="w100" :src="imgUrl" frameborder="0" />
        </div>
        <div class="img-over"></div>
      </div>
    </div>
    <div class="iframe" v-else-if="videoVisible">
      <div class="header" >
        视频/音频查看
      </div>
      <div class="img-box" @click.stop>
          <iframe class="iframe" :src="videoUrl" frameborder="0"></iframe>
        <div class="img-over"></div>
      </div>
    </div>
    <div class="iframe" v-else>
      <div id="container" class="containerYx"></div>
    </div>
  </div>
</template>

<script>
import api from '@/api/file.js'
import Cookies from 'js-cookie'
// 阿里云预览
import aliyun from '@/plugin/aliyun-web-office-sdk.min.js'
import util from '@/libs/util.js'
const OSS = require('ali-oss')

export default {
  data: () => {
    return {
      src: '',
      imgVisible: false,
      videoVisible: false,
      audioVisible: false,
      imgUrl: '',
      videoUrl: '',
      aduioUrl: '',
      width: 100,
      previewInfo: {}
    }
  },
  beforeCreate () {
    this.$loading({
      lock: true,
      text: '文件加载中',
      spinner: 'el-icon-loading'
    })
  },
  mounted () {
    const url = util.sessions.get('fileName')
    let url2 = ''
    // |tif|tiff 不行
    if (url.includes('?')) {
      url2 = url.split('?')[0]
    }
    console.log('预览路径参数', this.$route, url)
    if (/(png|gif|jpg|jpeg|jfif|bmp|webp)$/i.test(url)) {
      this.imgVisible = true
      const data = util.sessions.get('upload')

      let tiem
      if (data) {
        tiem = new Date(data.expiration)
      }
      const tiem2 = new Date()
      if (data === null || tiem - tiem2 < 15 * 60 * 1000) {
        api.ossStsToken().then(({ data }) => {
          const client = new OSS({
            accessKeyId: data.accessKeyId,
            accessKeySecret: data.accessKeySecret,
            stsToken: data.securityToken,
            endpoint: data.endpoint,
            bucket: data.bucketName,
            timeout: '5s'
          })
          util.sessions.set('upload', JSON.stringify(data))
          setTimeout(() => {
            util.sessions.remove('upload')
          }, 1800000)
          this.imgUrl = client.signatureUrl(url)
        })
      } else {
        const client = new OSS({
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          stsToken: data.securityToken,
          endpoint: data.endpoint,
          bucket: data.bucketName,
          timeout: '5s'
        })
        this.imgUrl = client.signatureUrl(url)
      }
      this.$loading().close()
    } else if (!url.includes('?') && /(mp3|wave|aac|cd|wma|mp4|m4v)$/i.test(url)) {
      // 不支持flv|avi|rmvb|mkv|vob|wmv|asf|asx||rm
      console.log('videoVisible', url)
      this.videoVisible = true
      const data = JSON.parse(sessionStorage.getItem('upload'))
      let tiem
      if (data) {
        tiem = new Date(data.expiration)
      }
      const tiem2 = new Date()
      if (data === null || tiem - tiem2 < 15 * 60 * 1000) {
        api.ossStsToken().then(({ data }) => {
          const client = new OSS({
            accessKeyId: data.accessKeyId,
            accessKeySecret: data.accessKeySecret,
            stsToken: data.securityToken,
            endpoint: data.endpoint,
            bucket: data.bucketName,
            timeout: '5s'
          })
          util.sessions.set('upload', JSON.stringify(data))
          setTimeout(() => {
            util.sessions.remove('upload')
          }, 1800000)
          this.videoUrl = client.signatureUrl(url)
          console.log('videoUrl', this.videoUrl)
        })
      } else {
        const client = new OSS({
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          stsToken: data.securityToken,
          endpoint: data.endpoint,
          bucket: data.bucketName,
          timeout: '5s'
        })
        this.videoUrl = client.signatureUrl(url)
        console.log('videoUrl', this.videoUrl)
      }
      this.$loading().close()
    } else if (url.includes('?') && /(mp3|wave|aac|cd|wma|mp4|m4v)$/i.test(url2)) {
      this.videoVisible = true
      this.videoUrl = url
      console.log(11111111111, this.videoUrl)
      this.$loading().close()
    } else if (/(pptx|ppt|pot|potx|pps|ppsx|dps|dpt|pptm|potm|ppsm|xls|xlt|et|ett|xlsx|xltx|csv|xlsb|xlsm|xltm|doc|dot|wps|wpt|docx|dotx|docm|dotm|pdf|txt)\s*$/i.test(url)) {
      this.imgVisible = false
      this.videoVisible = false
      console.log(url == sessionStorage.getItem('previewUrl'))
      if (sessionStorage.getItem('previewUrl') == url) {
        this.$loading().close()
        this.previewInfo = JSON.parse(sessionStorage.getItem('previewInfo'))
        const demo = aliyun.config({
          // PDF文档相关配置。
          pdfOptions: {
            isShowComment: true,
            isInSafeMode: true
          },
          mount: document.querySelector('#container'),
          url: this.previewInfo.PreviewURL // 设置文档预览URL地址。
        })
        demo.setToken({ token: this.previewInfo.AccessToken })
      } else {
        api.getPreview(url).then(res => {
          this.$loading().close()
          this.previewInfo = res.data
          const demo = aliyun.config({
            // PDF文档相关配置。
            pdfOptions: {
              isShowComment: true,
              isInSafeMode: true
            },
            mount: document.querySelector('#container'),
            url: this.previewInfo.PreviewURL // 设置文档预览URL地址。
          })
          const that = this
          demo.on('fileOpen', function (data) {
            console.log(data, '文件打开成功********************')
          })
          demo.on('error', function (data) {
            console.log(data)
            if (data.reason == 'SessionExpired') {
              api.getRefreshPreview({
                accessToken: that.previewInfo.AccessToken,
                refreshToken: that.previewInfo.refreshToken
              }).then(res => {
                demo.setToken({ token: res.data.AccessToken })
                that.previewInfo = res.data
              })
            }
          })
          console.log(demo)
          // 设置AccessToken。
          demo.setToken({ token: this.previewInfo.AccessToken })
        })
      }
    } else {
      this.$message({
        type: 'error',
        message: '暂时不支持预览该文件类型',
        duration: 0
      })
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.iframe {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #eee;
  z-index: 10;
}
.w100 {
  width: 100%;
  height: auto;
}
.header {
  // width: 1000px;
  height: 50px;
  background-color: #fff;
  position: fixed;
  padding: 0 20px;
  font-size: 24px;
  line-height: 46px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 95;
  user-select: none;
}

.cui-viewerchrome .cui-topBar2 {
  display: none;
}
.img-box {
  position: relative;
  width: 90%;
  height: 90%;
  margin: 55px 5%;
  overflow: auto;
  background-color: #eee;
}
.img {
  position: relative;
  margin: 0 auto;
}
.img-over {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
}
.containerYx{
  width: 100%;
  height: 100%;
}
</style>
