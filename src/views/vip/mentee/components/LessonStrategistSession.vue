<!--
 * @Author: kaan
 * @Date: 2021-06-02 14:01:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-10 16:03:17
 * @Version:
 * @Description:
-->
<template>
  <div class="program-montor">
    <el-drawer
      :title="'录播系列课时记录'"
      :visible.sync="lessonStrategistSessionVisible"
      size="70%"
      :before-close="handleClose"
    >
      <el-table
        :data="lessonData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column prop="lessonName" label="课程名称	" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="lessonMentorName" label="导师名称" sortable width="120"></el-table-column>
        <el-table-column prop="lessonIntro" label="课程介绍" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="课程开始时间" sortable width="160"></el-table-column>
        <el-table-column prop="qaLength" label="QA时长" sortable width="100"></el-table-column>
        <el-table-column prop="summaryLength" label="答疑时长" sortable width="100"></el-table-column>
        <el-table-column prop="subscribeTime" label="订阅时间" sortable width="180"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import api from '@/api/vip.js'
export default {
  name: 'lessonStrategistSession',
  props: {
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    lessonStrategistSessionVisible: {
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
    lessonStrategistSessionVisible: function (newData, oldData) {
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
      api.getStrategistSessionHis({ signId: this.signId, menteeId: this.menteeId }).then(res => {
        console.log('一对多系列课时列表', res)
        this.lessonData = res.data
      })
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
 .lesson_title{
  cursor: pointer;
}
</style>
