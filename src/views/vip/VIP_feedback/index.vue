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
            placeholder="支持学员姓名，导师姓名"
            v-if="roleInfo.includes(`VIP_feedback_search`)"
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            v-model="userId"
            clearable
            filterable
            placeholder="请选择"
            @change="Topage(1)"
            >
            <el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
            <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`VIP_feedback_search`)"
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
            v-if="roleInfo.includes(`VIP_feedback_page`)"
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
        <el-table-column show-overflow-tooltip align="center" prop="programName" label="项目">
            <!-- <template slot-scope="scope">
            <span :title="scope.row.programName" class="w80">{{scope.row.programName}}</span>
            </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="menteeName" label="学员名"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lessonType" label="导师类型"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="mentorName" label="导师名">
            <!-- <template slot-scope="scope">
            <p :title="scope.row.mentorName" class="w80">{{scope.row.mentorName}}</p>
            </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lessonTimes" label="课号"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lessonHours" label="上课时长"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lessonName" label="课程内容">
            <!-- <template slot-scope="scope">
            <el-popover
                width="400"
                trigger="hover"
                placement="top-start"
                :content="scope.row.lessonName"
            >
                <span size="mini" type="text" class="w80" slot="reference">{{scope.row.lessonName}}</span>
            </el-popover>
            </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lessonDate" label="上课日期"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lessonStatus" label="课程状态"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="feedbackStar" label="反馈星级"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="feedbackTime" label="反馈时间">
            <!-- <template slot-scope="scope">
            <p :title="scope.row.feedbackTime" class="w80">{{scope.row.feedbackTime}}</p>
            </template> -->
        </el-table-column>
        </el-table>
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
      pageSize: 400,
      userId: 'ALL',
      users: [],
      loading: false,
      lessonStatusS: ['未开始', '进行中', '已完成', '已取消', '有争议'],
      feedbackStarVisible: false,
      feedback: {}
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
        search: this.search,
        lessonType: '2',
        userId: this.userId
      }
      this.loading = true
      api.getLessonFeedBackList2(data).then(res => {
        res.data.rows.forEach(v => {
          v.lessonType = v.lessonType == '1' ? '行业导师' : '全职导师'
          v.lessonStatus = this.lessonStatusS[v.lessonStatus]
        })
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
