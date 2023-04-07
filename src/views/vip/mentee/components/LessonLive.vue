<!--
 * @Author: kaan
 * @Date: 2021-06-02 14:01:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-16 10:47:49
 * @Version:
 * @Description:
-->
<template>
  <div class="program-montor">
    <el-drawer
      :title="'直播课时记录'"
      :visible.sync="lessonLiveVisible"
      size="70%"
      :before-close="handleClose"
    >
      <el-table
        :data="lessonData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column label="直播标题" sortable >
          <template slot-scope="scope">
            <a class="lesson_title" @click="open(scope.row.liveId)">{{scope.row.liveTitle}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="liveTypeName" label="直播类型" sortable width="120"></el-table-column>
        <el-table-column prop="liveStatusName" label="直播状态" sortable width="120"></el-table-column>
        <el-table-column prop="liveBy" label="直播人" sortable width="120"></el-table-column>
        <el-table-column prop="planTime" label="直播时间	" sortable width="160"></el-table-column>
        <el-table-column prop="subscribeTime" label="订约时间" sortable width="160"></el-table-column>
        <el-table-column prop="playCount" label="播放次数" sortable width="100">
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import api from '@/api/vip.js'
import { hostURL } from '@/plugin/axios'
export default {
  name: 'lessonLive',
  props: {
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    lessonLiveVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '530px',
      lessonData: [{}]
    }
  },
  watch: {
    lessonLiveVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      api.getLiveHis({ signId: this.signId, menteeId: this.menteeId }).then(res => {
        console.log('直播课时列表', res)
        this.lessonData = res.data
      })
    },
    handleClose () {
      this.$emit('close')
    },
    open (liveId) {
      if (this.GetQueryString('mac')) {
        window.electron.shell.openExternal(`${hostURL}pc/VideoLivesDetail/VideoLivesDetail.html?liveId=${liveId}`)
      } else {
        window.open(`${hostURL}pc/VideoLivesDetail/VideoLivesDetail.html?liveId=${liveId}`)
      }
    },
    GetQueryString (name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  }
}
</script>
<style lang="scss" scoped>
 .lesson_title{
  cursor: pointer;
}
</style>
