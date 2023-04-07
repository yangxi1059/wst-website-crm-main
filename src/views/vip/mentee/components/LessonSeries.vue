<!--
 * @Author: kaan
 * @Date: 2021-06-02 14:01:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-16 10:20:38
 * @Version:
 * @Description:
-->
<template>
  <div class="program-montor">
    <el-drawer
      :title="'录播系列课时记录'"
      :visible.sync="lessonSeriesVisible"
      size="70%"
      :before-close="handleClose"
    >
      <el-table
        :data="lessonData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column label="系列课名称" sortable >
          <template slot-scope="scope">
            <a class="lesson_title" @click="open(scope.row.courseId)">{{scope.row.courseTitle}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="courseTypeName" label="系列课类型" sortable width="180"></el-table-column>
        <el-table-column prop="authorName" label="导师" sortable width="120"></el-table-column>
        <el-table-column prop="difficultyLevel" label="系列课难度" sortable width="120"></el-table-column>
        <el-table-column prop="subscribeTime" label="订阅时间" sortable width="180"></el-table-column>
        <el-table-column label="课程进度" sortable width="100">
          <template slot-scope="scope">
            {{scope.row.playCount}} / {{scope.row.lessonCount}}
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import api from '@/api/vip.js'
import { hostURL } from '@/plugin/axios'
export default {
  name: 'lessonSeries',
  props: {
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    lessonSeriesVisible: {
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
    lessonSeriesVisible: function (newData, oldData) {
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
      api.getSeriesHis({ signId: this.signId, menteeId: this.menteeId }).then(res => {
        console.log('录播系列课时列表', res)
        this.lessonData = res.data
      })
    },
    handleClose () {
      this.$emit('close')
    },
    open (courseId) {
      if (this.GetQueryString('mac')) {
        window.electron.shell.openExternal(`${hostURL}pc/VideoLessonsDetail/VideoLessonsDetail.html?courseId=${courseId}`)
      } else {
        window.open(`${hostURL}pc/VideoLessonsDetail/VideoLessonsDetail.html?courseId=${courseId}`)
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
