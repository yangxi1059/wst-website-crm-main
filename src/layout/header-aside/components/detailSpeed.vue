<!--
 * @Author: 杨曦
 * @Date: 2023-02-28 15:31:30
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-01 15:45:39
 * @Version:
 * @Description:
-->
<!--
 * @Author: 杨曦
 * @Date: 2020-09-23 10:20:42
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-28 15:10:32
 * @Version:
 * @Description:
-->
<template>
    <div class="fileAlert">
      <el-dialog :visible.sync="detailSpeedVisible" width="1200px" :close-on-click-modal="false" title="音频详情" :before-close="close">
        <div class="speedFlex">
          <div style="flex:1;" class="mr20 mb20">
            <div style="width:100%;height:400px;background-color: #000;">
              <!-- <video-player class="video-player vjs-custom-skin" :options="playerOptions"></video-player> -->
              <video
              v-if="detailSpeedVisible"
              id="videoPlayer"
              ref="videoPlayer"
              controls
              :src=fileUrl
              controlslist="nodownload"
              style="width: 100%; height: 100%; object-fit: contain">
              </video>
            </div>
            <div class="mt20">
              <div class="mb10">文件名：{{ taskDetail.fileName }}</div>
              <div class="mb10">状态：{{ taskDetail.taskStatusName }}</div>
              <div class="mb10">创建人：{{ taskDetail.createByName }}</div>
              <div class="mb10">创建时间：{{ taskDetail.createTime }}</div>
            </div>
          </div>
          <div style="flex:1" class="overflowBlock">
            <div class="mb20">识别结果：<el-button @click="copyAll()">一键复制</el-button></div>
            <el-timeline >
              <el-timeline-item
              v-for="(activity, index) in transData"
                :key="index"
                :hide-timestamp="true"
                >
                <div  :class="index == numberIndex?'redC':''">
                  <div>{{(activity.BeginTime) | ms_s }}</div>
                  <el-link type="primary" @click="playBySeconds(activity.BeginTime)">{{activity.Text}}</el-link>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>

<script>
import api from '@/api/dictionary.js'
export default {
  props: {
    detailSpeedVisible: {
      type: Boolean,
      default: false
    },
    taskId: {
    }
  },
  data: () => {
    return {
      taskDetail: {},
      fileUrl: '',
      transData: [],
      numberIndex: null,
      text: '',
      playerOptions: {
        height: 400,
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [],
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  watch: {
    detailSpeedVisible: function (val, old) {
      if (val) {
        this.initPage()
      }
    }
  },
  mounted () {

  },
  methods: {
    initPage () {
      api.getSpeechRecognition(this.taskId).then(res => {
        this.taskDetail = res.data
        this.transData = JSON.parse(res.data.transData)
        this.text = ''
        this.transData.forEach(item => {
          item.status = false
          this.text += `${item.Text}
          `
        })
        this.playerOptions.sources = []
        this.playerOptions.sources.push({
          src: res.data.presignedUrl
        })
        this.fileUrl = res.data.presignedUrl
        console.log(this.transData)
        const arr2 = []
        if (document.getElementById('videoPlayer')) {
          const videoPlayer = document.getElementById('videoPlayer')
          const that = this
          const arr = JSON.parse(JSON.stringify(that.transData))
          videoPlayer.addEventListener('timeupdate', function () {
            arr.forEach(item => {
              if ((item.BeginTime / 1000) < videoPlayer.currentTime) {
                item.status = true
              } else {
                item.status = false
              }
            })
            that.numberIndex = -1
            arr.forEach(item => {
              if (item.status) {
                that.numberIndex++
              }
            })
            console.log(arr)
            that.transData = arr
          }, false)
        }
      })
    },
    playBySeconds (num) {
      if (num && document.getElementById('videoPlayer')) {
        const myVideo = document.getElementById('videoPlayer')
        myVideo.play()
        myVideo.currentTime = num / 1000
      }
    },
    copyAll () {
      if (this.text) {
        this.$copyText(this.text).then(() => {
          this.$confirm('复制成功', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    close () {
      this.numberIndex = null
      this.$emit('close')
    }
  }
}
</script>

  <style >
    .redC{
      /* background-color: #409EFF; */
      /* color: #000; */
    }
    .redC .el-link.el-link--primary{
      color: #000;
    }
    .overflowBlock{
      height: 800px;
      overflow-y: auto;
    }
    .yxuploaddas .el-upload{
      width: 300px;
      height: 180px;
    }
    .speedFlex{
      display: flex;
    }
  </style>
