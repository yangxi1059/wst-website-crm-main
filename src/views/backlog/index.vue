<!--
 * @Author: 库建华
 * @Date: 2020-07-29 09:18:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-11 16:21:08
 * @Version: 1
 * @Description:
-->

<template>
  <d2-container  v-loading="loading">
    <div class="backlog">
      <div class="calendar">
        <el-calendar v-model="selectDate">
          <template slot="dateCell" slot-scope="{date, data}">
            <div class="calendar-box" @click="view(data.day)">
              {{new Date(date).getDate()}}日 <span v-if="workDay[data.day] && workDay[data.day].backlogCount">(<span class="backlog-count">{{workDay[data.day].backlogCount}}</span>个待办)</span>
              <div class="activity-item" v-if="workDay[data.day]" >
                <p
                  v-if="workDay[data.day][0]"
                >{{workDay[data.day][0].backlogTypeName}}
                  (<span v-if="workDay[data.day][0].backlogType != 'sign_end' && workDay[data.day][0].backlogType != 'one_on_one_lesson' && workDay[data.day][0].backlogType != 'bd_cooperator_follow' && workDay[data.day][0].backlogType != 'bd_ambassador_follow' && workDay[data.day][0].backlogType != 'sales_follow' && workDay[data.day][0].backlogType != 'sales_assistant_follow' && workDay[data.day][0].backlogType != 'vip_follow'">{{workDay[data.day][0].doneCount}}/</span>{{workDay[data.day][0].totalCount}})
                </p>
                <p
                  v-if="workDay[data.day][1]"
                >{{workDay[data.day][1].backlogTypeName}}
                  (<span v-if="workDay[data.day][1].backlogType != 'sign_end' && workDay[data.day][1].backlogType != 'one_on_one_lesson' && workDay[data.day][1].backlogType != 'bd_cooperator_follow' && workDay[data.day][1].backlogType != 'bd_ambassador_follow' && workDay[data.day][1].backlogType != 'sales_follow' && workDay[data.day][1].backlogType != 'sales_assistant_follow' && workDay[data.day][0].backlogType != 'vip_follow'">{{workDay[data.day][1].doneCount}}/</span>{{workDay[data.day][1].totalCount}})
                </p>
                <p
                  v-if="workDay[data.day][2]"
                >{{workDay[data.day][2].backlogTypeName}}
                  (<span v-if="workDay[data.day][2].backlogType != 'sign_end' && workDay[data.day][2].backlogType != 'one_on_one_lesson' && workDay[data.day][2].backlogType != 'bd_cooperator_follow' && workDay[data.day][2].backlogType != 'bd_ambassador_follow' && workDay[data.day][2].backlogType != 'sales_follow' && workDay[data.day][2].backlogType != 'sales_assistant_follow' && workDay[data.day][0].backlogType != 'vip_follow'">{{workDay[data.day][2].doneCount}}/</span>{{workDay[data.day][2].totalCount}})
                </p>
                <p v-if="workDay[data.day].length > 3">...</p>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
    <el-drawer size="400px" :visible.sync="detailVisibleDrawer">
        <div style="margin:0 auto;position:relative" class="drawerBlock">
          <p class="backlog-title">{{day}}的待办</p>
          <el-button
            icon="el-icon-plus"
            circle
            class="btn"
            size="mini"
            @click="addBacklog"
            title="新增待办"
          ></el-button>
          <div>
            <transition name="el-zoom-in-top">
              <el-row v-show="itemData.length">
                <el-col :span="20" class="_item-name" v-for="item in itemData" :key="item.backlogId">
                  <div @click.stop="backlogDetail(item)" v-if="item.backlogType == 'sign_end' || item.backlogType == 'bd_cooperator_follow' || item.backlogType == 'bd_ambassador_follow' || item.backlogType == 'sales_follow' || item.backlogType == 'sales_assistant_follow' || item.backlogType == 'vip_follow'">
                    <i class="el-icon-finished mr10"></i>
                    {{item.backlogTypeName}} ({{item.totalCount}})
                  </div>

                  <div @click.stop="backlogDetail(item)" v-else-if="item.backlogType == 'one_on_one_lesson'">
                    <i class="el-icon-finished mr10"></i>
                    {{item.backlogTypeName}} ({{item.totalCount}})
                  </div>
                  <div @click.stop="backlogDetail(item)" v-else-if="item.backlogType == 'jerry_one_on_one_lesson'">
                    <i class="el-icon-finished mr10"></i>
                    {{item.backlogTypeName}} ({{item.totalCount}})
                  </div>
                  <div @click.stop="backlogDetail(item)" v-else-if="item.backlogType == 'offer_story_fix'">
                    <i class="el-icon-finished mr10"></i>
                    {{item.backlogTypeName}} ({{item.totalCount}})
                  </div>
                  <div @click.stop="backlogDetail(item)" v-else>
                    <i class="el-icon-finished mr10"></i>
                    {{item.backlogTypeName}} ({{item.doneCount}}/{{item.totalCount}})
                  </div>
                </el-col>
              </el-row>
            </transition>
          </div>
        </div>
    </el-drawer>
    <addBacklog
      v-if="addBacklogCommonVisible"
      :addBacklogCommonVisible="addBacklogCommonVisible"
      :day="day"
      @close="addBacklogCommonClose"
      @submit="addBacklogCommonSubmit"
    />
    <common
      v-if="commonDetailVisible"
      :commonDetailVisible="commonDetailVisible"
      :day="day"
      :userId="userInfo.userId"
      @close="commonClose"
      @submit="commonSubmit"
    />
    <signExpiration
      v-if="signExpirationDetailVisible"
      :signExpirationDetailVisible="signExpirationDetailVisible"
      :day="day"
      :userId="userInfo.userId"
      @close="signExpirationClose"
      @submit="signExpirationSubmit"
    />
    <signEnd
      v-if="signEndDetailVisible"
      :signEndDetailVisible="signEndDetailVisible"
      :day="day"
      :userId="userInfo.userId"
      @close="signEndClose"
      @submit="signEndSubmit"
    />
    <oneToone
      v-if="oneTooneDetailVisible"
      :oneTooneDetailVisible="oneTooneDetailVisible"
      :day="day"
      :userId="userInfo.userId"
      @close="oneTooneClose"
      @submit="oneTooneSubmit"
    />
    <jerryOneToone
      v-if="jerryOneTooneDetailVisible"
      :jerryOneTooneDetailVisible="jerryOneTooneDetailVisible"
      :day="day"
      :userId="userInfo.userId"
      @close="jerryOneTooneClose"
      @submit="jerryOneTooneSubmit"
    />
    <bdSetRate
      v-if="bdSetRateDetailVisible"
      :bdSetRateDetailVisible="bdSetRateDetailVisible"
      :day="day"
      :userId="userInfo.userId"
      @close="bdSetRateClose"
      @submit="bdSetRateSubmit"
    />
    <followList
      v-if="followSetRateDetailVisible"
      :followSetRateDetailVisible="followSetRateDetailVisible"
      :position="position"
      :day="day"
      :userId="userInfo.userId"
      @close="followSetRateClose"
      @submit="followSetRateSubmit"
    />
    <storyList
      v-if="storyListVisible"
      :storyListVisible="storyListVisible"
      :position="position"
      :day="day"
      :userId="userInfo.userId"
      @close="storyListClose"
      @submit="storyListSubmit"
    />
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/backlog.js'
import { mapState } from 'vuex'

import common from './detail/common.vue'
import signExpiration from './detail/sign_expiration.vue'
import signEnd from './detail/sign_end.vue'
import addBacklog from './add/index.vue'
import oneToone from './detail/one_to_one.vue'
import jerryOneToone from './detail/jerry_one_to_one.vue'
import bdSetRate from './detail/bd_set_rate.vue'
import followList from './detail/follow_list.vue'
import storyList from './detail/storyList.vue'
export default {
  components: { common, signExpiration, addBacklog, signEnd, oneToone, jerryOneToone, bdSetRate, followList, storyList },
  mixins: [mixins],
  name: 'backlog',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    return {
      loading: false,
      commonDetailVisible: false,
      signExpirationDetailVisible: false,
      signEndDetailVisible: false,
      addBacklogCommonVisible: false,
      storyListVisible: false,
      detailVisibleDrawer: false,
      itemData: [],
      workDay: {},
      widths: '250px',
      size: '750px',
      direction: 'rtl',
      month: '',
      fromDate: '',
      toDate: '',
      position: {},
      day: '',
      list: [],
      selectDate: new Date(),
      backlogData: {},
      oneTooneDetailVisible: false,
      jerryOneTooneDetailVisible: false,
      bdSetRateDetailVisible: false,
      followSetRateDetailVisible: false
    }
  },
  filters: {
    count: function (v) {
      if (!v) {
        return 0
      }
      return eval(v.map(v => v.totalCount - v.doneCount).join('+')) || 0
    }
  },
  watch: {
    selectDate: function (v) {
      console.log(v, 111111111111111)
      const dd = new Date(v)
      const month =
        dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2)
      // if (dd.getMonth() == 0) {
      //   this.fromDate =
      //    (dd.getFullYear() - 1) + '-' + '12' + '-13'
      // } else {
      //   this.fromDate =
      //     dd.getFullYear() + '-' + ('0' + dd.getMonth()).slice(-2) + '-13'
      // }
      // if (dd.getMonth() == 11) {
      //   this.toDate =
      //     (dd.getFullYear() + 1) + '-' + '01' + '-13'
      // } else {
      //   this.toDate =
      //     dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 2)).slice(-2) + '-13'
      // }
      this.month = month
      this.Topage()
    }
  },
  mounted () {
    
    const date = new Date()
    let dayNow = ''
    if (date.getDate() < 10) {
      dayNow = `0${date.getDate()}`
    } else {
      dayNow = `${date.getDate()}`
    }
    this.day =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      dayNow
    console.log(date, this.day, dayNow, 1111111111111)

    this.month =
      date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
    // if (date.getMonth() == 0) {
    //   this.fromDate = (date.getFullYear() - 1) + '-' + '12' + '-13'
    // } else {
    //   this.fromDate = date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-13'
    // }
    // if (date.getMonth() == 11) {
    //   this.toDate = (date.getFullYear() + 1) + '-' + '01' + '-13'
    // } else {
    //   this.toDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 2)).slice(-2) + '-13'
    // }
    this.Topage()
  },
  methods: {
    Topage () {
      const params = {
        userId: this.userInfo.userId,
        month: this.month
      }
      console.log('params', params, 144654654534)
      this.$loading()
      api.getBacklogSchedule(params).then(res => {
        console.log('workDay', res)
        this.workDay = res.data
        for (const i in this.workDay) {
          this.workDay[i].backlogCount = 0
          if (this.workDay[i].length) {
            this.workDay[i].forEach(v => {
              if (v.doneCount == 0 || v.doneCount > 0) {
                console.log(v.doneCount)
              } else {
                v.doneCount = v.totalCount
              }
              v.backlogCount = v.totalCount - v.doneCount
              this.workDay[i].backlogCount += v.backlogCount * 1
            })
          }
        }
        console.log(this.workDay)
        this.$loading().close()
        let dayNow = ''
        if (this.selectDate.getDate() < 10) {
          dayNow = `0${this.selectDate.getDate()}`
        } else {
          dayNow = `${this.selectDate.getDate()}`
        }
        const day =
            this.selectDate.getFullYear() +
            '-' +
            ('0' + (this.selectDate.getMonth() + 1)).slice(-2) +
            '-' +
            dayNow
        this.view(day)
      })
    },
    close () {
      this.itemData = []
      this.commonDetailVisible = false
    },
    view (v) {
      console.log(v, this.day, '现在看的日期的代办事件列表')
      if (!v) {
        return
      }
      this.itemData = []
      this.day = JSON.parse(JSON.stringify(v))
      const params = {
        userId: this.userInfo.userId,
        backlogDate: this.day
      }
      api.getBacklogReminderList(params).then(res => {
        console.log(res.data, 'yx******************')
        this.detailVisibleDrawer = true
        this.itemData = res.data
      })
    },
    backlogDetail (v) {
      console.log('backlogDetail', v, this.day)
      this.backlogData = { ...v }
      if (this.backlogData.backlogType == 'common') {
        this.commonDetailVisible = true
      } else if (this.backlogData.backlogType == 'sign_expiration') {
        this.signExpirationDetailVisible = true
      } else if (this.backlogData.backlogType == 'sign_end') {
        this.signEndDetailVisible = true
      } else if (this.backlogData.backlogType == 'one_on_one_lesson' ) {
        console.log('一对多课程yx*-*-***')
        this.oneTooneDetailVisible = true
      } else if (this.backlogData.backlogType == 'jerry_one_on_one_lesson') {
        this.jerryOneTooneDetailVisible = true
      } else if (this.backlogData.backlogType == 'cooperator_activity_score') {
        console.log('bd评分')
        this.bdSetRateDetailVisible = true
      } else if (this.backlogData.backlogType == 'offer_story_fix') {
        this.position = this.backlogData
        this.storyListVisible = true
      } else if (this.backlogData.backlogType == 'bd_cooperator_follow' || this.backlogData.backlogType == 'bd_ambassador_follow' || this.backlogData.backlogType == 'sales_follow' || this.backlogData.backlogType == 'sales_assistant_follow' || this.backlogData.backlogType == 'vip_follow') {
        console.log('follow', this.backlogData)
        this.position = this.backlogData
        this.followSetRateDetailVisible = true
      }
    },
    commonClose () {
      this.commonDetailVisible = false
    },
    commonSubmit () {
      this.Topage()
    },
    signExpirationClose () {
      this.signExpirationDetailVisible = false
    },
    signExpirationSubmit () {
      this.Topage()
    },
    transformTimestamp (timestamp) {
      const date = timestamp
      const year = date.getFullYear()
      const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      const day = date.getDate() + 1 > 9 ? date.getDate() + 1 : '0' + (date.getDate() + 1)
      return year + month + day
    },
    signEndClose () {
      this.signEndDetailVisible = false
    },
    oneTooneClose () {
      this.oneTooneDetailVisible = false
    },
    jerryOneTooneClose () {
      this.jerryOneTooneDetailVisible = false
    },
    bdSetRateClose () {
      this.bdSetRateDetailVisible = false
    },
    followSetRateClose () {
      this.followSetRateDetailVisible = false
    },
    storyListClose () {
      this.storyListVisible = false
    },
    followSetRateSubmit () {
      this.Topage()
    },
    storyListSubmit () {
      this.Topage()
    },
    bdSetRateSubmit () {
      this.Topage()
    },
    oneTooneSubmit () {
      this.Topage()
    },
    jerryOneTooneSubmit () {
      this.Topage()
    },
    signEndSubmit () {
      this.Topage()
    },
    addBacklog () {
      this.addBacklogCommonVisible = true
    },
    addBacklogCommonClose () {
      this.addBacklogCommonVisible = false
    },
    addBacklogCommonSubmit () {
      this.Topage()
    },
    getTime (dateStr) {
      var date = new Date(dateStr)
      var Month = date.getMonth() + 1
      var Day = date.getDate()
      var Y = date.getFullYear() + '-'
      var M = Month < 10 ? '0' + Month + '-' : Month + '-'
      var D = Day + 1 < 10 ? '0' + Day : Day
      return Y + M + D
    },
    getWeek (data, year, month) {
      let newYear = null
      let newMonth = null
      if (month * 1 > 10) {
        newMonth = month * 1 - 1
      } else {
        if (month * 1 - 1 == 0) {
          newMonth = 12
        } else {
          newMonth = `0${month * 1 - 1}`
        }
      }
      if (month == '01') {
        newYear = year - 1
      } else {
        newYear = year
      }
      var week // 存储星期几
      switch (data.getDay()) {
        case 0:
          week = `${newYear}-${newMonth}-${31 - 6}`
          break
        case 1:
          week = `${newYear}-${newMonth}-${31 - 0}`
          break
        case 2:
          week = `${newYear}-${newMonth}-${31 - 1}`
          break
        case 3:
          week = `${newYear}-${newMonth}-${31 - 2}`
          break
        case 4:
          week = `${newYear}-${newMonth}-${31 - 3}`
          break
        case 5:
          week = `${newYear}-${newMonth}-${31 - 4}`
          break
        case 6:
          week = `${newYear}-${newMonth}-${31 - 5}`
          break
        default:
          week = `${newYear}-${newMonth}-${31 - 6}`
          break
      }
      return week
    },
    getLast (data, year, month) {
      let newYear = null
      let newMonth = null
      if (month * 1 > 10) {
        newMonth = month * 1 - 1
      } else {
        if (month * 1 - 1 == 0) {
          newMonth = 12
        } else {
          newMonth = `0${month * 1 - 1}`
        }
      }
      if (month == '01') {
        newYear = year - 1
      } else {
        newYear = year
      }
      var week // 存储星期几
      var a
      switch (data.getDay()) {
        case 0:
          a = `${newYear}-${newMonth}-${31 - 6}`
          a = new Date(a)
          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        case 1:
          a = `${newYear}-${newMonth}-${31 - 0}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        case 2:
          a = `${newYear}-${newMonth}-${31 - 1}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        case 3:
          a = `${newYear}-${newMonth}-${31 - 2}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        case 4:
          a = `${newYear}-${newMonth}-${31 - 3}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        case 5:
          a = `${newYear}-${newMonth}-${31 - 4}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        case 6:
          a = `${newYear}-${newMonth}-${31 - 5}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
        default:
          a = `${newYear}-${newMonth}-${31 - 6}`
          a = new Date(a)

          week = new Date(a.getTime() + 3600 * 24 * 1000 * 42)
          break
      }
      let monthNow = null
      if (week.getMonth() + 1 >= 10) {
        monthNow = week.getMonth() + 1
      } else {
        monthNow = `0${week.getMonth() + 1}`
      }
      if (week.getDate >= 10) {
        monthNow = week.getDate()
      } else {
        monthNow = `0${week.getDate()}`
      }
      const returnValue = `${week.getFullYear()}-${monthNow}-${week.getDate()}`
      console.log(returnValue)
      return returnValue
    }
  }
}
</script>
<style scoped>
.activity-item {
  height: 55px;
  overflow: hidden;
}
.backlog-count {
  font-size: 18px;
  font-weight: 700;
  color: blue;
}
.backlog {
  display: flex;
  height: 100%;
  font-size: 12px;
}
.calendar {
  flex: 1;
}
.el-calendar{
  height: 100%;
}
.backlog-list {
  width: 280px;
  min-width: 280px;
  position: relative;
}
.backlog-title {
  font-size: 20px;
  margin-bottom: 20px;
}
.btn {
  position: absolute;
  top: 0px;
  right: 15px;
}
._item-name {
  cursor: pointer;
  margin-top: 10px;
}
.drawerBlock{
  width: 300px;
}
</style>
