<!--
 * @Author: kaan
 * @Date: 2021-07-21 17:40:08
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-06 13:57:26
 * @Version:
 * @Description:
-->

<template>
  <div>
    <el-drawer
      :title="`课程列表`"
      :visible.sync="lessonVisible"
      size="1200px"
      :before-close="close"
    >
      <div class="pl10">
        <div class="search_page">
            <div class="search">
              <el-select
                v-model="programType"
                class="mr10 mb10"
                clearable
                placeholder="项目类型"
                :style="{width:'120px'}"
              >
                <el-option
                  v-for="(item,i) in programList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <!-- <el-select
                v-model="lessonStatus"
                class="mr10 mb10"

                clearable
                placeholder="课程状态"
                :style="{width:'120px'}"
              >
                <el-option
                  v-for="(item,i) in lessonList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select> -->
              <el-select
                v-model="operation"
                class="mr10 mb10"

                clearable
                placeholder="操作筛选"
                :style="{width:'120px'}"
              >
                <el-option
                  v-for="(item,i) in operationList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <el-select
                v-model="userId"
                class="mr10"

              >
                <el-option
                  v-for="(item,i) in userList"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                class="mr10 mb10"

                v-model="search"
                clearable
                placeholder="学生姓名"
                :style="{width:'120px'}"
              ></el-input>
              <el-button
                icon="el-icon-search"
                class="mr10"

                plain
                @click="initPage(1)"
              >GO</el-button>
            </div>
            <pagination
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></pagination>
        </div>
        <el-table
          stripe
          :data="consultingData"

          v-loading = "pictLoading"
          element-loading-background = "rgba(255, 255, 255, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">

          <el-table-column
            align="center"
            label="课程状态"
            width="100px"
          >
            <template slot-scope="scope">
              {{scope.row.lessonStatusName}}
              <el-tooltip v-if="scope.row.needAttention == 1" effect="dark" content="7天内该导师针对此学员排课超过3课时数" placement="right">
                <el-button  type="text" class="el-icon-warning" style="color:#409EFF"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="课程来源"
            prop="createTypeName"
            width="100px"
          >
          </el-table-column>

          <el-table-column
            align="center"
            label="创建人"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{scope.row.createByMentor == '0'?'VIP创建':'行业导师创建'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="课程日期"
            prop="lessonDate"
            width="100px"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="课时"
            width="50"
            prop="lessonHours"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="课程名"
          >
            <template slot-scope="scope">
              {{scope.row.lessonName}}
              <el-tooltip v-if="scope.row.lessonContent" effect="dark" :content="scope.row.lessonContent" placement="top">
                <el-button  type="text" class="el-icon-warning" style="color:#409EFF"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="学员"
            prop="menteeName"
          >
          </el-table-column>
           <el-table-column
            align="center"
            label="导师"
            prop="mentorName"
          >
            <template slot-scope="scope">
              <el-button  type="text" v-if="scope.row.mentorBindApp == '1'" class="el-icon-mobile-phone" style="color:#409EFF"></el-button>
              {{scope.row.mentorName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="项目类型"
            prop="programTypeName"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="评分"
            width="50"
          >
            <template slot-scope="scope">
              <el-tooltip  effect="light" :content="scope.row.feedbackRemark" placement="top-start">
                <div>{{scope.row.feedbackStar}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="评分时间"
            prop="feedbackTime"
            width="160"
          >
          </el-table-column>
          <el-table-column
            align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary"  @click="setRate(scope.row)" v-if="scope.row.operation == 'wait_evaluated'">学员待评价</el-button>
              <el-button
                type="primary"

                @click="resetFeedback(scope.row.lessonId)"
                v-else-if="scope.row.operation == 'rest'"
              >重 置</el-button>
              <el-button
                type="primary"

                @click="confirm(scope.row)"
                v-else-if="scope.row.operation == 'vip_wait_confirmed'"
              >VIP待确认</el-button>
              <span v-else-if="scope.row.operation == 'vip_confirmed'"
              >VIP已确认</span>
              <el-button
                type="primary"

                @click="lowScoreUpdate(scope.row)"
                v-else-if="scope.row.operation == 'low_score_modify'"
              >低分修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'

var _this = ''
export default {
  props: {
    lessonVisible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    mixins
  ],
  data () {
    _this = this
    return {
      pageNum: 1,
      pageSize: 50,
      total: 0,
      userId: 'ALL',
      operation: 'vip_wait_confirmed',
      programType: '',
      search: '',
      lessonStatus: '',
      programList: [],
      lessonList: [],
      operationList: [
        { itemName: 'VIP待确认', itemValue: 'vip_wait_confirmed' },
        { itemName: '低分处理', itemValue: 'low_score_handle' },
        { itemName: '学员待评价', itemValue: 'wait_evaluated' }
      ],
      userList: [],
      consultingData: [],
      pictLoading: false
    }
  },
  watch: {
    lessonVisible: function (val) {
      if (val) {
        this.initPage(1)
        this.pageInit()
      }
    }
  },
  filters: {
    lessonStatusFilters: function (value) {
      let val = ''
      _this.lessonList.forEach(v => {
        if (v.itemValue == value) val = v.itemName
      })
      return val
    }
  },
  mounted () {
  },
  methods: {
    async pageInit () {
      this.userList = await this.getUserListVip('lesson_all_data')
      console.log(this.userList)
    },
    initPage (pageNum) {
      this.pictLoading = true
      const data = {
        pageNum: pageNum || this.pageNum,
        pageSize: this.pageSize,
        userId: this.userId,
        operation: this.operation,
        programType: this.programType,
        search: this.search,
        lessonStatus: this.lessonStatus
      }
      console.log(data)
      api.getLessonList(data).then(res => {
        console.log(res.data)
        this.consultingData = res.data.rows
        this.total = res.data.total
        this.pageNum = res.data.page
        this.pictLoading = false
      })
    },
    confirm (row) {
      console.log(row)
      if (row.feedbackStar < 6) {
        this.$confirm('课程评分小于6分，导师无法获取课程佣金，是否确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.lessonConfirm(row.lessonId).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '确认成功'
              })
              this.initPage()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        })
      } else if (row.feedbackStar >= 6 && row.feedbackStar < 8) {
        this.$confirm('课程评分在[6~8)区间，导师只能获取基础课程佣金，是否确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.lessonConfirm(row.lessonId).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '确认成功'
              })
              this.initPage()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        })
      } else if (row.feedbackStar >= 8) {
        api.lessonConfirm(row.lessonId).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '确认成功'
            })
            this.initPage()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
      }
    },
    lowScoreUpdate (row) {
      this.$prompt('请输入二次评分', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^([1-9]|10)$/,
        inputErrorMessage: '仅能输入1-10的数字 ！！'
      }).then(({ value }) => {
        this.$loading()
        const lesson = {
          lessonId: row.lessonId,
          feedbackStar: value
        }
        api.uptFeedback(lesson).then((res) => {
          this.$loading().close()
          this.$message({
            type: 'success',
            message: '修改成功 '
          })
          this.initPage()
        })
      }).catch(() => {})
    },
    close () {
      this.pageNum = 1
      this.pageSize = 50
      this.total = 0
      this.userId = 'ALL'
      this.operation = 'vip_wait_confirmed'
      this.programType = ''
      this.search = ''
      this.lessonStatus = ''
      this.consultingData = []
      this.$emit('close')
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.initPage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initPage()
    },
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    resetFeedback (id) {
      api.resetFeedback(id).then((res) => {
        this.$message({
          type: 'success',
          message: '重置成功'
        })
        this.initPage()
      })
    },
    setRate (data) {
      this.$prompt('请输入新的评分', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^([1-9]|10)$/,
        inputErrorMessage: '仅能输入1-10的数字 ！！'
      }).then(({ value }) => {
        api.uptFeedback({ lessonId: data.lessonId, feedbackStar: value }).then((res) => {
          console.log(res)
          if (res.code == 200) {
            this.$message.success('修改成功！！')
            this.initPage()
          } else {
            this.$message.warning(res.message)
            this.initPage()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
