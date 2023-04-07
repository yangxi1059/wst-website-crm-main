<template>
  <d2-container v-loading="loading">
    <div class="vip_lesson">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持学员姓名，导师姓名"
            v-if="roleInfo.includes(`vip_lesson_search`)"
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            v-model="userId"
            clearable
            filterable
            placeholder="请选择"
            @change="Topage(1)"
            >
            <el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
            <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            v-model="lessonStatus"
            clearable
            filterable
            placeholder="请选择"
            @change="Topage(1)"
            >
            <el-option
                v-for="(item,i) in lessonStatusList"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`vip_lesson_search`)"
            class="mr10"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
            <el-button
            v-if="roleInfo.includes(`vip_lesson_statistics`)"
            class="ml0"
            size="mini"
            plain
            @click="statistics"
            >统计</el-button>
        </div>
        <pagination
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            v-if="roleInfo.includes(`vip_lesson_page`)"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table
        :data="lessonList"
        size="mini"
        highlight-current-row
        :max-height="height"
        @sort-change="sortChange"
        >
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="strategistName"
            label="VIP导师名"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="menteeName"
            label="学员名"
        ></el-table-column>
        <!-- <el-table-column min-width="200px" align="center" prop="programName" label="项目" show-overflow-tooltip></el-table-column> -->
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="lessonTimes"
            label="课号"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="lessonHours"
            label="上课时长"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            min-width="200px"
            align="center"
            prop="lessonName"
            label="课程内容"
        >
            <template slot-scope="scope">
            <el-popover
                width="400"
                trigger="hover"
                placement="top-start"
                :content="scope.row.lessonName"
            >
                <span size="mini" type="text" class="w80" slot="reference">{{scope.row.lessonName}}</span>
            </el-popover>
            </template>
        </el-table-column>
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="lessonDate"
            label="上课日期"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="lessonStatus"
            label="课程状态"
        ></el-table-column>
        <el-table-column
            sortable="custom"
            min-width="100px"
            align="center"
            prop="feedbackStar"
            label="反馈星级"
        >
            <template slot-scope="scope">
            <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark">
                <span slot="reference">{{scope.row.feedbackStar || '无反馈'}}</span>
            </el-popover>
            </template>
        </el-table-column>
        </el-table>
        <statistics :statisticsVisible="statisticsVisible" @close="statisticsClose"></statistics>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import statistics from './components/statistics.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: 'vip_lesson',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ]),
  },
  components: {
    statistics
  },
  data () {
    return {
      height: document.documentElement.clientHeight - 190,
      lessonList: [],
      pageNum: 1,
      sortCol: '',
      pageSize: 400,
      sort: '',
      total: 0,
      loading: false,
      search: null,
      userId: '',
      users: [],
      lessonStatus: '',
      lessonStatusS: ['未开始', '进行中', '已完成', '已取消', '有争议'],
      lessonStatusList: [
        { itemName: 'ALL', itemValue: '' },
        { itemName: '未开始', itemValue: '0' },
        { itemName: '进行中', itemValue: '1' },
        { itemName: '已完成', itemValue: '2' },
        { itemName: '已取消', itemValue: '3' },
        { itemName: '有争议', itemValue: '4' }
      ],
      statisticsVisible: false
    }
  },
  mounted () {
    // 获取用户列表users
    api.getUserListByUserId(this.userInfo.userId).then(res => {
      console.log('vip列表', res)
      this.users = res.data
      this.users.unshift({ userName: 'ALL', userId: '' })
    })
    this.Topage(1)
  },
  methods: {
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        lessonStatus: this.lessonStatus,
        userId: this.userId,
        sortCol: this.sortCol,
        sort: this.sort
      }
      console.log('课程列表参数', data)
      this.loading = true
      api.getVipLessonList(data).then(res => {
        console.log('课程列表', res)
        res.data.rows.forEach(v => {
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
    },
    sortChange (sort) {
      console.log(sort)
      const order = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.sortCol = sort.prop
      this.sort = order[sort.order]
      this.Topage()
    },
    statistics () {
      this.statisticsVisible = true
    },
    statisticsClose () {
      this.statisticsVisible = false
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
