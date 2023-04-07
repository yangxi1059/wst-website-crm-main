<!--
 * @Author: kaan
 * @Date: 2021-11-23 14:44:01
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-08 15:14:53
 * @Version:
 * @Description: 文件预览
-->

<template>
  <!-- <div class="view-file-new-window"> -->
    <div class="iframe" >
      <ali-player ref="player" :source="fileUrl"></ali-player>
    </div>
  <!-- </div> -->
</template>

<script>
import api from '@/api/file.js'
import Cookies from 'js-cookie'
// 阿里云预览

import aliyun from '@/plugin/aliyun-web-office-sdk.min.js'
import util from '@/libs/util.js'
import VueAliplayer from '@/components/aliplayer'
const OSS = require('ali-oss')
export default {
  components: { 'ali-player': VueAliplayer },
  data: () => {
    return {
      fileUrl: ''
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
    if (sessionStorage.getItem('fileUrl')) {
      this.fileUrl = sessionStorage.getItem('fileUrl')
      this.$loading().close()
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.iframe {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  background-color: #eee;
  z-index: 10;
}
  html,body{
      position: relative;
      margin: 0;
      width: 100%;
      height: 100%;
      background-color:rgb(0, 0, 0);
      text-align: center;
      overflow: hidden;
  }
  video{
      background-color:rgb(0, 0, 0);
      max-height: 100vh;
      height: 100%;
  }
  body:-webkit-full-page-media {
      background-color: rgb(0, 0, 0);
  }
  video:-webkit-full-page-media {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      max-height: 100%;
      max-width: 100%;
      margin: auto;
  }
  .prism-player{
      height: 100% !important;
      width: 100%;
  }
  video {
      object-fit: contain;
  }
  .prism-big-play-btn{
      left: 50% !important;
      bottom: 50% !important;
      transform: translate(-50%,50%);
  }
</style>
