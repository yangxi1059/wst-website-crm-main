<!--
 * @Author: 杨曦
 * @Date: 2023-01-11 16:12:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-11 17:07:07
 * @Version: 
 * @Description: 
-->
<!--
 * @Author: 库建华
 * @Date: 2020-07-31 16:02:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 11:00:03
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="day+'的Jerry一对多课程'"
      :visible.sync="jerryOneTooneDetailVisible"
      width="1400px"
      :before-close="close"
    >
      <el-table
        :data="tableData"
        size="mini"
        ref="table"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column min-width="150px" align="center" prop="realName" label="Jerry一对多课程名">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">{{scope.row.lessonName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="lessonMentorName"
          label="导师名"
        ></el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="startTime"
          label="开始时间"
        ></el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          label="报名情况"
        >
            <template slot-scope="scope">
                {{scope.row.applyNum}} / {{scope.row.applyLimit}}
            </template>

        </el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="updateTime"
          label="更新时间"
        ></el-table-column>
        <el-table-column
          min-width="150px"
          align="center"
          prop="updateByName"
          label="更新人"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <detail  :detailVisible="detailVisible" :lessonData="lessonData"  @close="detailClose" @submit="detailSubmit"></detail>
  </div>
</template>

<script>
import api from '@/api/backlog.js'
import detail from './detailJerryOneToOne.vue'

export default {
  name: 'common-detail',
  components: { detail },
  props: {
    jerryOneTooneDetailVisible: Boolean,
    day: String,
    userId: String
  },
  data: () => {
    return {
      tableData: [],
      multipleSelection: [],
      menteeId: '',
      lessonData: null,
      detailVisible: false
    }
  },
  provide () {
    return {
      getMenteeId: this.getMenteeId
    }
  },
  watch: {
    jerryOneTooneDetailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    getMenteeId () {
      return this.menteeId
    },
    initPage () {
      const params = {
        backlogDate: this.day
      }
      api.getJerryOneOnOneLessonsList(params).then(res => {
        console.log(res, 'yx451345')
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    selectable (v) {
      return v.isDone == '0'
    },
    add () {
      console.log('add')
    },
    toDetail (v) {
      console.log(v)
      this.lessonData = v.pkId
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
      this.lessonData = null
    },
    detailSubmit () {
      this.detailVisible = false
      this.$emit('submit')
      this.initPage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
