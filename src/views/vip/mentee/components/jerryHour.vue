<!--
 * @Author: 杨曦
 * @Date: 2023-01-10 16:02:48
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-11 10:38:37
 * @Version: 
 * @Description: 
-->
<!--
 * @Author: kaan
 * @Date: 2021-06-02 14:01:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-16 10:20:58
 * @Version:
 * @Description:
-->
<template>
  <div class="program-montor">
    <el-drawer
      :title="'Jerry一对一'"
      :visible.sync="jerryHourVisible"
      size="70%"
      :before-close="handleClose"
    >
      <el-table
        :data="lessonData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column prop="lessonName" label="课程名称" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="lessonMentorName" label="导师名称" sortable ></el-table-column>
        <el-table-column prop="lessonIntro" label="课程介绍" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="课程开始时间" sortable></el-table-column>
        <el-table-column prop="qaLength" label="QA时长" sortable ></el-table-column>
        <el-table-column prop="summaryLength" label="答疑时长" sortable ></el-table-column>
        <el-table-column prop="subscribeTime" label="订阅时间" sortable ></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-avatar :src="scope.row.imgUrl"></el-avatar>
          </template>
        </el-table-column>
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
    jerryHourVisible: {
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
    jerryHourVisible: function (newData, oldData) {
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
      api.getJerryHour({ signId: this.signId, menteeId: this.menteeId }).then(res => {
        console.log(res,3333333333333333333)
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
