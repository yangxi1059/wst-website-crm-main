<!--
 * @Author: 杨曦
 * @Date: 2022-09-02 09:14:14
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-25 16:44:12
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="mentee-detail accesscode-out">
        <div v-loading="loading" class="yx_calendar_block" style="text-align:center">
            <div class="calendar_block1">
                <el-calendar style="width:400px;min-width:400px;margin:0 auto;" size="mini" v-model="value">
                    <template
                        slot="dateCell"
                        slot-scope="{date, data}">
                        <div class="calendar-box" @click="view(data)">
                            <el-badge v-if="calendarList[data.day]" :value="calendarList[data.day]"  class="item">
                                {{new Date(date).getDate()}}日
                            </el-badge>
                            <div v-else>{{new Date(date).getDate()}}日</div>
                        </div>
                    </template>
                </el-calendar>
            </div>
            <div class="calendar_block2">
                <div class="calendar_block_item  mb10" @click="todetail(item)" v-for="(item,i) in calendarDate" :key="i">
                  <el-tag type="success" style="position:absolute;right:5px;top:5px" size="small" >{{item.recordStatusName}}</el-tag>
                  <div class="mb10"  style="text-align:center">
                      <el-avatar size="large" :src="item.logo"></el-avatar>
                  </div>
                  <div class="mb10" style="text-align:center">{{item.jobName}}</div>
                  <div class="mb10" style="text-align:center">{{item.companyName}}</div>
                  <div class="mb10" style="text-align:center">{{item.countryName}}</div>
                </div>
            </div>
        </div>
        <transition name="el-fade-in">
                <div class="mask-recommend_notification" v-show="detailVisible">
                    <div class="mask-click_notification" @click="handleClose3()" style="pointer-events: auto;"></div>
                    <div class="mask-recommend_block_notification" style="pointer-events: auto;">
                        <div class="maskRecommend-block" style="pointer-events: auto;">
                        <div class="maskRecommend-header" style="pointer-events: auto;">
                        <div class="maskRecommend-img" style="pointer-events: auto;">
                            <img class="bg-img"  :src="showData.logo || ''" style="pointer-events: auto;">
                        </div>
                        <div class="maskRecommend-main" style="pointer-events: auto;">
                            <div class="maskRecommend-title" style="pointer-events: auto;">{{showData.jobName}}</div>
                            <div class="maskRecommend-company" style="pointer-events: auto;">{{showData.companyName}}
                                <span class="span-linesy" style="pointer-events: auto;" v-if="showData.createTime">|</span>{{getRemainderTime(showData.createTime.slice(0,10)) == 0?'今天发布':getRemainderTime(showData.createTime.slice(0,10)) + 'days ago发布'}}
                                <span class="span-linesy" style="pointer-events: auto;">|</span><span class="iconfont iconweizhi-tianchong" style="pointer-events: auto;"></span> {{showData.countryName}}
                                <span class="span-linesy" style="pointer-events: auto;">|</span><span class="iconfont iconweizhi-tianchong" style="pointer-events: auto;"></span> {{showData.recordStatusName}}
                            </div>
                        </div>
                    </div>
                    <div class="maskRecommend-order" style="min-height: 755px; pointer-events: auto;">
                        <el-button @click="copyAddress(showData.jobUrl)" class="copyAddress" type="primary"  size="medium">复制链接</el-button>
                        <div class="maskRecommend-order_title" style="pointer-events: auto;">{{showData.jobName}}</div>
                        <div class="maskRecommend-block_msg" style="pointer-events: auto;">
                            <div class="maskRecommend-msg_season season-bg" style="pointer-events: auto;">
                                <div class="maskRecommend-detail_img1 maskRecommend-detail_img" style="pointer-events: auto;"></div>
                                <div class="maskRecommend-season_num" style="pointer-events: auto;">Apply Season：{{showData.applySeason}}</div>
                            </div>
                            <div class="maskRecommend-msg_season jobcount-bg" style="pointer-events: auto;">
                                <div class="maskRecommend-detail_img2 maskRecommend-detail_img" style="pointer-events: auto;"></div>
                                <div class="maskRecommend-season_num" style="pointer-events: auto;">Job Count：{{showData.jobCount || '暂无'}}</div>
                            </div>
                            <div class="maskRecommend-msg_season locationType-bg" style="pointer-events: auto;">
                                <div class="maskRecommend-detail_img4 maskRecommend-detail_img" style="pointer-events: auto;"></div>
                                <div class="maskRecommend-season_num" style="pointer-events: auto;">Location Type：{{showData.locationTypeName || '暂无'}}</div>
                            </div>
                            <div class="maskRecommend-msg_season jobType-bg" style="pointer-events: auto;">
                              <div class="maskRecommend-detail_img3 maskRecommend-detail_img" style="pointer-events: auto;"></div>
                                <div class="maskRecommend-season_num" style="pointer-events: auto;">Job Type：{{showData.jobTypeName || '暂无'}}</div>
                            </div>
                            <div class="maskRecommend-msg_season1 track-bg" style="pointer-events: auto;">
                                <div class="maskRecommend-detail_img5 maskRecommend-detail_img" style="pointer-events: auto;"></div>
                                <div class="maskRecommend-season_num" style="pointer-events: auto;">Track Name：{{showData.tracksName || '暂无'}}</div>
                            </div>
                            <div class="maskRecommend-msg_season1 degree-bg" style="pointer-events: auto;">
                                <div class="maskRecommend-detail_img5 maskRecommend-detail_img" style="pointer-events: auto;"></div>
                                <div class="maskRecommend-season_num" style="pointer-events: auto;">Degrees：{{showData.degreesName || '暂无'}}</div>
                            </div>
                        </div>
                    <h3 class="maskRecommend-order_header" style="pointer-events: auto;">
                        <strong class="maskRecommend-order_header3" style="pointer-events: auto;">Job Requirements:</strong>
                    </h3>
                    <div class="maskRecommend-order_text" style="pointer-events: auto;">{{showData.jobRequirements}}</div>
                    <h3 class="maskRecommend-order_header1" style="pointer-events: auto;">
                        <strong class="maskRecommend-order_header2" style="pointer-events: auto;">Job Descriptions:</strong>
                    </h3>
                    <div class="maskRecommend-order_text" style="pointer-events: auto;">{{showData.jobInformation}}</div>
                            </div>
                        </div>
                    </div>
                </div>
        </transition>
        <!-- <el-dialog
        :visible.sync="detailVisible"
        width="600px"
        :show-close="false"
        :before-close="handleClose3">
            <el-descriptions  size="mini" direction="vertical" :column="2" border>
                <el-descriptions-item label="logo"><el-avatar size="small" :src="showData.logo"></el-avatar></el-descriptions-item>
                <el-descriptions-item label="工作名">{{showData.jobName}}</el-descriptions-item>
                <el-descriptions-item label="申请季">{{showData.applySeason}}</el-descriptions-item>
                <el-descriptions-item label="公司名">{{showData.companyName}}</el-descriptions-item>
                <el-descriptions-item label="国家地区">{{showData.countryName}}</el-descriptions-item>
                <el-descriptions-item label="Location">{{showData.locationType}}</el-descriptions-item>
                <el-descriptions-item label="方向">{{showData.tracks}}</el-descriptions-item>
                <el-descriptions-item label="截止日期">{{showData.deadLine}}</el-descriptions-item>
            </el-descriptions>
        </el-dialog> -->
    </div>
  </d2-container>
</template>
<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      loading: false,
      dialogVisible: false,
      detailVisible: false,
      url: '',
      value: new Date(),
      fromDate: '',
      toDate: '',
      calendarList: {},
      calendarDate: [],
      showData: {
        createTime: '',
        logo: ''
      }
    }
  },
  mounted () {
    this.initData = []
    this.init(this.value)
  },
  watch: {
    value: function (v) {
      console.log(v, 111111111111111)
      this.init(v)
    }
  },
  methods: {
    init2 (date) {
      var nowMonth = date.getMonth() + 1
      var strDate = date.getDate()
      var seperator = '-'
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      return date.getFullYear() + seperator + nowMonth + seperator + strDate
    },
    init (date) {
      console.log(date)
      var nowMonth = date.getMonth() + 1
      var strDate = date.getDate()
      var seperator = '-'
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.fromDate = date.getFullYear() + seperator + nowMonth + seperator + '01'
      this.toDate = date.getFullYear() + seperator + nowMonth + seperator + this.getLastDay(date.getFullYear(), nowMonth)
      this.Topage()
    },
    Topage () {
      const data = {
        fromDate: this.fromDate,
        toDate: this.toDate
      }
      this.loading = true
      api.getCalendarListIndex(data).then(res => {
        this.calendarList = {}
        console.log(res.data)
        this.loading = false
        res.data.forEach(item => {
          this.calendarList[item.calendarDate] = item.jobCount
        })
      })
      this.initDetail(this.value)
    },
    close () {
      this.$emit('close')
    },
    view (data) {
      console.log(data, this.value)
    },
    initDetail (data) {
      console.log(this.init2(data))
      api.getCalendarDateIndex(this.init2(data)).then(res => {
        console.log(res.data)
        this.calendarDate = res.data
      })
    },
    getLastDay (year, month) {
      var new_year = year // 取当前的年份
      var new_month = month++// 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        new_month -= 12 // 月份减
        new_year++ // 年份增
      }
      var new_date = new Date(new_year, new_month, 1) // 取当年当月中的第一天
      return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
    },
    todetail (item) {
      api.getNetJobIdIndex(item.jobId).then(res => {
        this.showData = res.data
        console.log(res.data)
        this.detailVisible = true
      })
    },
    handleClose2 () {
      this.dialogVisible = false
    },
    handleClose3 () {
      this.showData = {
        createTime: '',
        logo: ''
      }
      this.detailVisible = false
    },
    copyAddress(item){
        console.log(item)
      this.$copyText(item).then(() => {
        this.$confirm('链接已复制成功', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success'
        })
      })
    },
    getRemainderTime (startTime) {
      var s1 = new Date(startTime.replace(/-/g, '/'))
      var s2 = new Date()
      var runTime = parseInt((s2.getTime() - s1.getTime()) / 1000)
      var year = Math.floor(runTime / 86400 / 365)
      runTime = runTime % (86400 * 365)
      var month = Math.floor(runTime / 86400 / 30)
      runTime = runTime % (86400 * 30)
      var day = Math.floor(runTime / 86400)
      runTime = runTime % 86400
      var hour = Math.floor(runTime / 3600)
      runTime = runTime % 3600
      var minute = Math.floor(runTime / 60)
      runTime = runTime % 60
      var second = runTime
      return day + month * 30
    }
  }
}
</script>

<style  scoped>
    .accesscode-out .calendar-box{
        width: 100%;
        height: 100%;
        padding: 8px  !important;
        box-sizing: border-box;
    }
    .accesscode-out .el-calendar-day{
        padding: 0px !important;
    }
    .accesscode-out .calendar_block2{
        display: flex;
        flex-wrap: wrap;
    }
    .accesscode-out .calendar_block_item{
      position: relative;
      background-color: #fff;
      height: 180px;
      width: 19%;
      margin-right: 5px;
      padding: 8px;
      box-sizing: border-box;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .accesscode-out  .el-descriptions-item__cell{
        width: 50% !important;
    }
    .accesscode-out .el-calendar-day{
      height: 36px !important;
    }
    .yx_calendar_block{
        display: flex;
    }
    .calendar_block1{
        width: 450px;
    }
    .calendar_block2{
        flex: 1;
        max-height: 790px;
        overflow-y: auto;
    }
    .mask-recommend_notification{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background:rgba(0,0,0,0.86);
        z-index: 1000;
        overflow-y:auto ;
    }
    .mask-recommend_notification::-webkit-scrollbar {
        width: 8px;
        height: 6px;
    }
    .mask-recommend_notification::-webkit-scrollbar-thumb {
        border-radius: 10px;
        border: 0.5px solid rgba(255,255,255,0.3);
        background: rgba(0,0,0,0.5);
    }
    .mask-recommend_notification::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
        border-radius: 10px;
        background: #ccc;
    }
    .mask-recommend_notification .close-maskRecommend_notification{
        z-index: 11;
        position: absolute;
        top: 40px;
        right: 40px;
        font-size: 20px;
        color: #fff;
        line-height: 30px;
        transform: rotate(45deg);
    }
    .mask-recommend_notification .close-maskRecommend_notification:hover{
        cursor: pointer;
        opacity: 0.9;
    }
    .mask-click,.mask-click_uploadResume,.mask-click_notification{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: transparent;
        z-index: -1;
    }
    .mask-recommend_block_notification{
    width: 1100px;
    margin: 0 auto;
}
.maskRecommend-block{
    width: 100%;
    margin: 0 auto;
    margin-top: 40px;
    margin-bottom: 40px;
    position: relative;
}
.maskRecommend-header{
    display: flex;
    height: 72px;
    position: relative;
}
.maskRecommend-img{
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: #fff;
    position: relative;
}
.bg-img{
    max-width: 57px;
    max-height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.maskRecommend-main{
    margin-left: 20px;
}
.maskRecommend-title{
    margin-top: 8px;
    height:22px;
    font-size:16px;

    font-weight:500;
    line-height:18px;
    color:rgba(255,255,255,1);
    opacity:1;
}
.maskRecommend-company{
    height:20px;
    font-size:14px;
    font-weight:400;
    line-height:16px;
    color:rgba(255,255,255,1);
    margin-top: 14px;
    opacity:1;
}
.span-linesy{
    margin: 0 10px;
}
.maskRecommend-order{
    box-sizing: border-box;
    position: relative;
    padding: 36px 40px 40px 40px;
    margin-top: 30px;
    border-radius: 3px;
    background: #fff;
}
.copyAddress{
    /* background-color: #fff;
    text-align: center; */
    position: absolute;
    right: -120px;
    top: 0px;
    /* border-radius: 50%;
    width:50px;
    height:50px; */
}
.maskRecommend-order_title{
    font-size:26px;
    line-height:37px;
    color:rgba(54,59,62,1);
    font-weight: bold;
    opacity:1;
}
.maskRecommend-block_msg{
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}
.maskRecommend-msg_season{
    display: flex;
    min-width: 180px;
    height: 34px;
    background-size: auto , 100%;
    background-repeat: no-repeat;
    background-position: center;
    opacity:1;
    border-radius:3px;
    margin-right: 12px;
    margin-bottom: 12px;
}
.track-bg{
    position: relative;
    margin-right: 12px;
    background-color: #809CE1;
}
.degree-bg{
    position: relative;
    background-color: #E6A23C;
}
.season-bg{
    background-color: #7082A2;
}
.jobcount-bg{
    background-color: #A3D0DB;

}
.jobType-bg{
    background-color: #F69B83;

}
.locationType-bg{
    background-color: #85A0CC;
}
.svg-block{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0,-50%);
}
.maskRecommend-detail_img1{
    width: 14px;
    background-image: url('~@/assets/icon/neituiImg1.png');
}
.maskRecommend-detail_img2{
    width: 20px;
    height: 13px;
    background-image: url('~@/assets/icon/neituiImg2.png');
}
.maskRecommend-detail_img3{
    width: 15px;
    background-image: url('~@/assets/icon/neituiImg3.png');
}
.maskRecommend-detail_img4{
    width: 14px;
    background-image: url('~@/assets/icon/neituiImg4.png');
}
.maskRecommend-detail_img5{
    width: 15px;
    background-image: url('~@/assets/icon/neituiImg5.png');
}
.maskRecommend-detail_img{
    height: 14px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin-left: 10px;
    margin-top: 10px;
}
.maskRecommend-season_num{
    margin-right: 12px;
    font-size:14px;
    font-weight:500;
    line-height:34px;
    color:rgba(255,255,255,1);
    margin-left: 7px;
    opacity:1;
}
.maskRecommend-msg_season1 .maskRecommend-season_num{
    margin-right: 25px;
}
.maskRecommend-msg_season1{
    display: flex;
    min-width: 180px;
    height: 34px;
    opacity:1;
    border-radius:3px;
    margin-bottom: 12px;
}
.maskRecommend-order_header,.maskRecommend-order_header1{
    font-size:16px;
    font-weight:500;
    line-height:22px;
    color:rgba(26,9,9,1);
    margin-top: 26px;
    opacity:1;
}
.maskRecommend-order_text{
    margin-top: 10px;
    font-size:14px;
    font-weight:400;
    line-height:24px;
    color:rgba(59,59,59,0.96);
    white-space: pre-line;
    word-wrap: break-word;
    opacity:1;
}
.maskRecommend-order_text{
    margin-top: 10px;
    font-size:14px;
    font-weight:400;
    line-height:24px;
    color:rgba(59,59,59,0.96);
    white-space: pre-line;
    word-wrap: break-word;
    opacity:1;
}
</style>
