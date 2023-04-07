<template>
  <d2-container v-loading="loading">
    <div class="feedback">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            v-if="roleInfo.includes(`feedback_search`)"
            placeholder="支持学员姓名，导师姓名"
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="feedbackStatus"
            filterable
            placeholder="请选择"
            @change="Topage(1)"
            >
            <el-option v-for="(item,i) in feedbackStatusList" :key="i" :label="item.itemName" :value="item.itemValue"></el-option>
            </el-select>
            <el-button
            v-if="roleInfo.includes(`feedback_search`)"
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
        </div>
        <pagination
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            v-if="roleInfo.includes(`feedback_page`)"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table
        :data="lessonList"
        size="mini"
        highlight-current-row
        :max-height="height"
        >
        <el-table-column min-width="100px" align="center" prop="menteeName" label="学员名"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="mentorName" label="行业导师名"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="createByName" label="申请人"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="lessonHours" label="上课时长"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="feedbackHelpScore" label="导师是否有帮助得分"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="feedbackAttitudeScore" label="导师态度得分"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="feedbackSatisfactionScore" label="对导师满意度得分"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="feedbackRemark" label="反馈备注"></el-table-column>
        <el-table-column min-width="100px" align="center" prop="feedbackDate" label="学员反馈时间">
        </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" title="反馈" :visible.sync="feedbackRemarkVisible">
        反馈内容
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="feedback.feedbackRemark"></el-input>反馈星级
        <el-rate
            v-model="feedback.feedbackStar"
            show-score
            :max="10"
            :low-threshold="4"
            :high-threshold="8"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        ></el-rate>
        <span slot="footer" class="dialog-footer">
            <el-button @click="feedbackRemarkVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitFeedbackRemark">提 交</el-button>
        </span>
        </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: 'feedback',
  data () {
    return {
      height: document.documentElement.clientHeight - 190,
      lessonList: [],
      pageNum: 1,
      total: 0,
      search: null,
      feedbackStatus: 'ALL',
      users: [],
      loading: false,
      pageSize: 400,
      lessonStatusS: ['未开始', '进行中', '已完成', '已取消', '有争议'],
      feedbackRemarkVisible: false,
      feedbackStarVisible: false,
      feedback: {},
      feedbackStatusList: [{ itemValue: 'ALL', itemName: '全部' }, { itemValue: '0', itemName: '无反馈' }, { itemValue: '1', itemName: '有反馈' }]
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ]),
  },
  mounted () {
    // 获取用户列表users
    api.getUserListByUserId(this.userInfo.userId).then(res => {
      console.log('vip列表', res)
      this.users = res.data
      this.users.unshift({ userName: 'ALL', userId: 'ALL' })
    })
    this.Topage(1)
  },
  methods: {
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        feedbackStatus: this.feedbackStatus,
        search: this.search,
        sortCol: this.sortCol,
        sort: this.sort
      }
      this.loading = true
      api.getLessonFeedBackList(data).then(res => {
        console.log('课程反馈列表', res)
        this.lessonList = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    setFeedbackRemark (v) {
      console.log('反馈内容', v)
      this.feedbackRemarkVisible = true
      this.feedback = { ...v }
    },
    submitFeedbackRemark () {
      if (
        this.feedback.feedbackRemark &&
        this.feedback.feedbackRemark.length > 200
      ) {
        this.$message({
          type: 'error',
          message: '反馈内容不得超过200字符'
        })
        return
      }
      console.log('反馈内容', this.feedback)
      const data = { signId: this.feedback.signId }
      if (this.feedback.lessonType == '行业导师') {
        data.mentorLessonObject = {
          uptList: [
            {
              lessonId: this.feedback.lessonId,
              feedbackRemark: this.feedback.feedbackRemark,
              feedbackStar: this.feedback.feedbackStar
            }
          ]
        }
      } else {
        data.vipLessonObject = {
          uptList: [
            {
              lessonId: this.feedback.lessonId,
              feedbackRemark: this.feedback.feedbackRemark,
              feedbackStar: this.feedback.feedbackStar
            }
          ]
        }
      }
      console.log('提交反馈内容参数', data)
      api.setLesson(data).then(res => {
        console.log('提交反馈内容', res)
        this.Topage(1)
        this.feedbackRemarkVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.w80 {
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
