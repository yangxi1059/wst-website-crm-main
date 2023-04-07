<!--
 * @Author: kaan
 * @Date: 2021-11-15 14:57:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-12 16:53:36
 * @Version:
 * @Description:
-->
<template>
  <div id="app">
    <router-view/>
    <el-dialog
      class="header_none"
      :visible.sync="dialogVisible"
      customClass="version_dialog"
      width="650px"
      :close-on-click-modal="showClose"
      :close-on-press-escape="showClose"
      :show-close="showClose"
      center
    >
      <div class="version_title">
        <img class="version_logo" src="./assets/img/login-logo.png" alt="logo" />
        <div class="version_text">发现新版本!</div>
      </div>
      <el-form class="version_form" label-width="82px">
        <el-form-item label="当前版本：">v{{curV}}</el-form-item>
        <el-form-item label="更新版本："><span class="reqV">v{{reqV}}</span></el-form-item>
        <el-form-item label="更新内容：">
          <ul class="">
            <li class="version_update" v-for="(item,index) in versionInfo" :key="index">{{item}}</li>
          </ul>
        </el-form-item>
      </el-form>

      <div class="version_progress" >
        <el-progress
          status="success"
          :text-inside="true"
          :stroke-width="20"
          :percentage="percentage"
          :width="strokeWidth"
          :show-text="true"
          :color="'#FF8C00'"
        ></el-progress>
      </div>
      <div>{{percentage >= 100?'下载新版本成功,即将将关闭此项目,重新启动！！':'正在更新新版本,请勿关闭程序以免出现异常...'}}</div>
      <el-button class="d_btn" type="text" @click="downloadEXE">手动下载安装</el-button>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/libs/util'
import api from '@/api/system'
import { FindInPage } from 'electron-find'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      dialogVisible: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false,
      percentage: 0,
      strokeWidth: 200,
      percent: 0,
      isMac: /macintosh|mac os x/i.test(navigator.userAgent),
      curV: '',
      reqV: '',
      versionInfo: ''
    }
  },
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  computed: {
    ...mapState('d2admin', {
      userName: state => (state.userName || '')
    })
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  mounted () {
    const os = this.isMac ? 'crm_v2_mac' : 'crm_v2_win'
    if (util.getQueryString('mac')) {
      const ipcRenderer = require('electron').ipcRenderer
      api.getVersionLast({ appId: os }).then(res => {
        console.log(res)
        this.curV = this.$version
        this.reqV = res.data.versionId
        if (this.Version(this.curV, res.data.versionId)) {
          ipcRenderer.send('checkForUpdate', '')
          this.dialogVisible = true
          this.versionInfo = res.data.versionInfo.split('\n')
        } else {
          this.$message.success('当前已是最新版本')
        }
      })
      ipcRenderer.on('downloadProgress', (event, data) => {
        this.percentage = (data.percent).toFixed(0) * 1
      })
      ipcRenderer.on('message', (event, data) => {
        console.log('ipcRenderer-message', data)
        if (data == '下载完成即将关闭并自动更新！！') {
          this.percentage = 100
        }
        switch (data.status) {
          case -1:
            this.$message.error(data.msg)
            break
          case 0:
            this.$message.warning(data.msg)
            break
          case -2:
            this.$message.success(data.msg)
            break
          case 1:
            this.$message.success(data.msg)
            break
        }
      })
      // 加载crtl+F搜索框组件
      const findInPage = new FindInPage(
        require('@electron/remote').getCurrentWebContents(),
        {
          preload: true,
          parentElement: document.body,
          duration: 200,
          offsetTop: 20,
          offsetRight: 30
        }
      )
      ipcRenderer.on('on-find', (e, args) => {
        findInPage.openFindWindow()
      })
      this.clearFindInput()
    }
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    },
    ...mapActions({
      sizeSet: 'd2admin/size/set'
    }),
    /**
     * @description:  Enter回车使crtl+F的搜索框失去焦点继而开始检索页面
     * @param {*}
     * @return {*}
     */
    clearFindInput () {
      window.onload = function () {
        document.onkeydown = function (ev) {
          var oEvent = ev || window.event
          if (oEvent.keyCode == '13') {
            var input = document.getElementsByClassName('find-input')
            input[0].blur()
          }
        }
      }
    },
    /**
     * @description: 版本号判断
     * @param {*} curV  当前版本
     * @param {*} reqV  服务器版本
     * @return {*} 返回为 true 需要更新
     */
    Version (curV, reqV) {
      var arr1 = curV.split('.')
      var arr2 = reqV.split('.')
      // 将两个版本号拆成数字
      var minL = Math.min(arr1.length, arr2.length)
      var pos = 0 // 当前比较位
      var diff = 0 // 当前为位比较是否相等
      // 逐个比较如果当前位相等则继续比较下一位
      while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos])
        if (diff != 0) {
          break
        }
        pos++
      }
      return diff < 0
    },
    downloadEXE () {
      let feedUrl = ''
      if (process.env.VUE_APP_API == 'https://www.pageguo.com/api-test/') {
        feedUrl = `https://www.pageguo.com/version.html` // 更新包位置
      } else {
        feedUrl = `https://www.wallstreettequila.com/version.html` // 更新包位置
      }
      window.open(feedUrl)
      // const shell = require('electron').shell
      // shell.openExternal(feedUrl)
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';

</style>
<style lang="scss" scoped>
::v-deep .version_dialog{
  max-width:650px;
}
.header_none ::v-deep .el-dialog__header{
  display:none;
}
.version_title{
  position: relative;
  width:650px;
  height:90px;
  margin: -25px -25px 30px;
  background:#FF8C00;
}
.version_logo{
  margin-top:25px;
  margin-left:25px;
  width:150px;
}
.version_text{
  position:absolute;
  top:35px;
  right:25px;
  font-size: 20px;
  font-weight: 700;
  color:#FFF;
}
::v-deep .version_form .el-form-item{
  margin-bottom:10px;
}
::v-deep .version_form .el-form-item__content, ::v-deep .version_form .el-form-item__label{
  line-height:25px;
}
.version_update{
  line-height:25px;
  word-wrap:break-word;
  word-break: normal;
	overflow: hidden;
}
.reqV{
  font-size:18px;
  color:#FF8C00;
}
.version_progress{
  position: relative;
  margin:30px 0;
  width:100%;
  height:auto;
  line-height:20vh;
  text-align:center
}
.d_btn{
  position: absolute;
  bottom:20px;
  right:20px;
}
</style>
