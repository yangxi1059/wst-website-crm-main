<!--
 * @Author: 库建华
 * @Date: 2020-07-31 16:02:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 11:03:53
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="position.backlogTypeName + '列表'"
      :visible.sync="storyListVisible"
      width="600px"
      :before-close="close"
    >
        <el-table
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
          <el-table-column
            align="center"
            label="学员名"
          >
            <template slot-scope="scope">
                <el-button type="text" @click="apply(scope.row)">申请</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="menteeName"
            label="学员名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="menteeId"
            label="学员ID"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="applyTitle"
            label="申请名称"
          ></el-table-column>
        </el-table>
    </el-dialog>
    <storyAduit :applyInterviewStoryVisible="applyInterviewStoryVisible" :content="content" :menteeName="menteeName" :pkId="pkId" :interviewData="interviewData" @close="storyAduitClose" @submit="storyAduitSubmit"  />
  </div>
</template>

<script>
import api from '@/api/backlog.js'
import storyAduit from './apply_mentee_offer.vue'
export default {
  name: 'common-detail',
  components: {
    storyAduit
  },
  props: {
    storyListVisible: Boolean,
    position: Object,
    day: String,
    userId: String
  },
  data: () => {
    return {
      tableData: [],
      menteeName: '',
      interviewData: {},
      applyInterviewStoryVisible: false,
      pkId: '',
      content: {}
    }
  },
  watch: {
    storyListVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      const params = {
        userId: this.userId,
        backlogDate: this.day
      }
      api.getBacklogStory(params).then(res => {
        console.log(res, 'yx451345')
        this.tableData = res.data
      })
    },
    storyAduitClose () {
      this.applyInterviewStoryVisible = false
    },
    storyAduitSubmit () {
      this.applyInterviewStoryVisible = false
      this.initPage()
      this.$emit('submit')
    },
    apply (data) {
      console.log(JSON.parse(data.content))
      this.menteeName = data.menteeName
      this.content = JSON.parse(data.content)
      this.interviewData = data.interviewData
      this.pkId = data.pkId
      this.applyInterviewStoryVisible = true
    },
    close () {
      this.$emit('close')
      this.tableData = []
      this.interviewData = {}
      this.menteeName = ''
      this.data = {}
      this.content = {}
      this.pkId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
