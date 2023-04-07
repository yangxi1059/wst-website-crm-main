<!--
 * @Author: kaan
 * @Date: 2021-11-25 15:07:10
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-17 11:37:58
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="course_detail_container">
      <div class="mentor_area">
        <el-tabs v-model="lessonType" @tab-click="getDataList">
          <el-tab-pane :label="tab.lessonTypeName" :name="tab.lessonType"
            v-for="(tab, t) in mentorTabs" :key="t" >
            <el-descriptions title="" :column="4" size="medium">
              <el-descriptions-item label="项目总课时">{{totalHour}}</el-descriptions-item>
              <el-descriptions-item label="VIP分配课时">
                  <el-link type="primary"  @click="toVipHours()">{{mentorAllocatedHour}}</el-link>
              </el-descriptions-item>
              <el-descriptions-item label="已完成课时">{{finishHour}}</el-descriptions-item>
              <el-descriptions-item label="剩余课时">{{restHour}}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
        <div class="top_status_bar mb10">
          <div v-if="roleInfo.includes(`mentee_detail_lesson_downLoad`) && lessonType == '1'" class="mr10">
            <el-button size="mini" class="mb20" @click="exportExcel" plain type="primary" >导出学生课程报告</el-button>
          </div>
          <el-button size="mini" class="mb20" @click="addMentor" plain type="primary" v-if="lessonType !=='2'">新增导师</el-button>
        </div>
        <ul class="mentor_list">
          <li class="mentor_item mb10" v-for="(item,i) in mentorData" :key="i">
            <div class="mentor_item_content">
              <!-- <div class="mentor_item_content_title">已完成进度</div> -->
              <div class="mentor_item_content_progress">
                <el-progress :text-inside="true" :stroke-width="20" :percentage="item.percentage" :format="format(item)"></el-progress>
              </div>
            </div>
            <div class="mentor_item_model_content">
              <div class="mentor_item_model">
                <div class="mentor_item_model_title">已支付/付款中课时</div>
                <div class="mentor_item_model_value can_click">{{item.paidHour}}</div>
              </div>
              <div class="mentor_item_model">
                <div class="mentor_item_model_title">申请中课时</div>
                <div class="mentor_item_model_value">{{item.appliedHour}}</div>
              </div>
              <div class="mentor_item_model">
                <div class="mentor_item_model_title">待申请课时</div>
                <div class="mentor_item_model_value can_click" @click="showApply(item.pkId)">{{item.unPaidHour}}</div>
              </div>
            </div>
            <el-tag class="mb20 ml10" @click="courseCheck()" type="danger" size="meduim" v-if="item.hasSchedule">有待完成的预排课核验</el-tag>
            <div class="mentor_item_title">
              <div class="mentor_item_title_left">
                <div class="mr10 displayFlex">
                  <div class="mr10 btnblock">
                     <el-button type="text" class="btn-center" v-if="!item.headImage"  @click="toBind(item)"><i class="el-icon-s-promotion"></i>绑定</el-button>
                     <el-avatar :size="50"  :src="item.headImage" ></el-avatar>
                  </div>
                  <div class="mentor_item_title_name">{{item.mentorName}}</div>
                  <div class="mentor_item_title_type">{{item.mentorTypeName}}</div>
                </div>
                <div >
                  <div class="mentor_tag" v-for="(tag,j) in item.mentorTrackArr" :key="j">
                    <el-tag class="mr10"  v-if="tag.isSelected">{{tag.itemName}}</el-tag>
                  </div>
                </div>
              </div>
              <div @click="editMentor(item)" v-if="lessonType !==2 ">
                <d2-icon class="mentor_item_title_icon" name="edit" />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="course_area">
        <el-button size="mini" plain type="success" @click="exportLesson" v-if="lessonType !=='1' ||lessonType !=='2'">导出课表</el-button>
        <el-button size="mini" plain type="success" @click="inputExcel" v-if="lessonType !=='2'">导入课表</el-button>
        <el-button size="mini" plain type="primary" @click="addCourse(lessonType)" v-if="lessonType !=='1' || lessonType !=='2'">新增课程</el-button>
        <!-- <el-button size="mini" plain type="danger" @click="downModel" v-if="lessonType !=='2'">下载模板</el-button> -->
        <el-table
          ref="refTable"
          :data="courseData"
          style="width: 100%"
          @row-click="expandClick">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-descriptions title="" style="padding-left:50px" :column="1" :contentStyle="{flex:1}">
                <el-descriptions-item label="课程来源">{{scope.row.createTypeName}}</el-descriptions-item>
                <el-descriptions-item label="课程类型">{{scope.row.lessonTypeName}}</el-descriptions-item>
                <el-descriptions-item label="课程内容" :span="24" >{{scope.row.lessonContent}}</el-descriptions-item>
                <el-descriptions-item label="课程材料" >
                  <el-link type="primary" v-if="scope.row.materials" @click="preview(scope.row.materials)">预览</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="课程作业" >{{scope.row.homework}}</el-descriptions-item>
                <el-descriptions-item label="课程作业预览" >
                  {{scope.row.homeworkUrl}}
                  <el-link type="primary" v-if="scope.row.homeworkUrl" @click="preview(scope.row.homeworkUrl)">预览</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="是否缺席">{{scope.row.menteeAbsentName}}</el-descriptions-item>
                <el-descriptions-item label="反馈(星级)">{{scope.row.feedbackStar}}</el-descriptions-item>
                <el-descriptions-item label="反馈内容">{{scope.row.feedbackRemark}}</el-descriptions-item>
            </el-descriptions>
            <div style="padding-left:50px">
              <el-button
                v-if="(scope.row.lessonType != 2) && !scope.row.paymentStatus && !['3','4',4,3].includes(scope.row.lessonStatus)"
                @click="editCourse(scope.row)" plain  type="primary"  size="mini"
              >编辑</el-button>
              <el-button
                v-if="(scope.row.lessonType != 2) && scope.row.lessonStatus != 2"
                @click="delectCourse(scope.row)"  plain  type="danger"  size="mini"
              >删除</el-button>
            </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程名称"  prop="lessonName" > </el-table-column>
          <el-table-column  label="上课时间"  prop="name" >
            <template slot-scope="scope">
              {{scope.row.lessonDate}}<br>{{scope.row.beginTime | fmtTime }} / {{scope.row.endTime | fmtTime }}
            </template>
          </el-table-column>
          <el-table-column  label="课时(小时)"  prop="lessonHours" width="100"></el-table-column>
          <el-table-column  label="上课老师"  prop="mentorName" :filters="filtersMentorName" :filter-method="filterMentorName" ></el-table-column>
          <el-table-column  label="状态" width="200" prop="desc">
            <template slot-scope="scope">
              <div style="display:flex">
                <div>课程：</div>
                <div>
                  <el-button style="padding:1px" v-if="scope.row.lessonStatus == '2'" type="success" icon="el-icon-check" circle></el-button>
                  <el-button v-else style="padding:1px" type="danger" icon="el-icon-close" circle></el-button>
                  {{scope.row.lessonStatusName}}
                </div>
              </div>
              <div style="display:flex">
                <div>评分：</div>
                <div>
                  <el-button style="padding:1px" v-if="scope.row.feedbackStar" type="success" icon="el-icon-check" circle></el-button>
                  <el-button v-else style="padding:1px" type="danger" icon="el-icon-close" circle></el-button>
                  {{scope.row.feedbackStar || '无'}}
                </div>
              </div>
              <div style="display:flex">
                <div>VIP确认：</div>
                <div>
                  <el-button style="padding:1px" v-if="scope.row.vipConfirm == '1'" type="success" icon="el-icon-check" circle></el-button>
                  <el-button v-else style="padding:1px" type="danger" icon="el-icon-close" circle></el-button>
                  {{scope.row.vipConfirm == '1'?'已确认':'未确认'}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程费用"  >
            <template slot-scope="scope">{{scope.row.lessonFee}}{{scope.row.lessonFeeType}}</template>
          </el-table-column>
          <el-table-column  label="课程支付状态" prop="paymentStatusName"  width="150">
            <template slot-scope="scope">
              <div>{{scope.row.paymentStatusName}} <el-link type="primary" @click.stop="toApply(scope.row.applyId)">{{scope.row.applyId}}</el-link></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增/编辑行业导师 -->
    <mentorDetail
      :mentorDetailVisible="mentorDetailVisible"
      :mentorDetailData="mentorDetailData"
      :signId="signId"
      :lessonType="lessonType"
      @close="mentorDetailClose"
      @submit="mentorDetailSubmit"
    />
    <!-- 新增/编辑行业导师课程 -->
    <mentorCourse
      :mentorCourseVisible="mentorCourseVisible"
      :courseEditData="courseEditData"
      :signId="signId"
      :mentorData="mentorData"
      :checkHours="checkHours"
      :mentorTrackEdit="mentorTrackEdit"
      @close="courseEditClose"
      @submit="courseEditSubmit"
      @check="courseCheck"
    />
    <toVipHours
      :toVipHoursVisible="toVipHoursVisible"
      :signId="signId"
      :mentorData="mentorData"
      :totalHour="totalHour"
      @close="toVipHoursClose"
      @submit="toVipHoursSubmit"
    />

    <!-- 导入课表 -->
    <uploadLessons
      :signId="signId"
      :inputExcelShow="uploadLessonsVisible"
      :mentorData="mentorData"
      :lessonType="lessonType"
      @close="inputExcelClose"
      @submit="inputExcelSubmit"
      @check="courseCheck"
    />
    <!-- 新增/编辑全职导师课程 -->
    <strategistCourse
      :strategistCourseVisible="strategistCourseVisible"
      :courseEditData="courseEditData"
      :signId="signId"
      :mentorData="mentorData"
      @close="courseEditClose"
      @submit="courseEditSubmit"
    />
    <detail :detailVisible="detailVisible" :signId="signId" @close="detailClose" @submit="detailSubmit" />
    <el-dialog
      class="yx-aa"
      :visible.sync="dialogVisible"
      width="600px"
      style="text-align:center!important"
      :before-close="handleClose">
      <div style="text-align:center">
        <el-image style="width: 320px; height: auto; "  :src="url" fit="cover"></el-image>
      </div>
      <el-button class="mt20" size="small" @click="downloadImg()">下载</el-button>
    </el-dialog>
    <mentor-pay-apply
        :mentorPayVisible="mentorPayVisible"
        :applyData="applyData"
        @close="mentorPayClose"
        @submit="mentorPaySubmit"
        @recall="mentorRecell"
      ></mentor-pay-apply>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import file from '@/libs/file'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import mentorDetail from './components/SetMentorDetail.vue'
import mentorCourse from './components/SetMentorCourse.vue'
import detail from './components/detailCheckLessons.vue'
import toVipHours from './components/toVipHours.vue'
import mentorPayApply from '../../apply_audit/components/mentor_pay_apply.vue'
import uploadLessons from './components/UploadLessons.vue'
import strategistCourse from './components/SetStrategistCourse.vue'
import FileSaver from 'file-saver'

export default {
  name: 'CourseDetail',
  mixins: [
    mixins
  ],
  components: { mentorDetail, mentorCourse, uploadLessons, strategistCourse, detail, toVipHours, mentorPayApply },
  data: () => {
    return {
      detailVisible: false,
      signId: '',
      menteeInfo: '',
      mentorPayVisible: false,
      applyData: {},
      // 1:行业导师课程 2:全职导师课程 3:口语课程 4:课业辅导课程 finance_lesson:财商课程
      lessonType: '',
      mentorTabs: [],
      totalHour: 0,
      mentorAllocatedHour: 0,
      finishHour: 0,
      restHour: 0,
      dialogVisible: false,
      url: '',
      switchType: false,
      switchTitle: '行业导师排课',

      mentorData: [],
      courseData: [],
      filtersMentorName: [],

      // 组件弹出框参数
      mentorDetailVisible: false,
      mentorDetailData: {},
      mentorCourseVisible: false,
      toVipHoursVisible: false,
      courseEditData: {},
      uploadLessonsVisible: false,
      strategistCourseVisible: false
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  filters: {
    // 上课时间过滤器
    fmtTime: function (value) {
      if (value) {
        return util.fmtDate(new Date(value), 'hh:mm')
      } else {
        return '--:--'
      }
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    /**
     * @description: 初始化获取课程分类
     * @param {*}
     * @return {*}
     */
    Topage () {
      this.signId = this.$route.query.signId
      const params = { signId: this.signId }
      api.getLessonType(params).then(res => {
        console.log('初始化获取课程分类', res)
        if (res.data.length < 1) {
          this.$message.warning('暂未安排课时')
          return
        }
        this.mentorTabs = res.data
        this.lessonType = this.mentorTabs[0].lessonType
        this.getDataList()
      })
    },
    /**
     * @description: 获取某一课程类型导师信息&课表信息
     * @param {*}
     * @return {*}
     */
    toApply (applyId) {
      api.getApplyDetailByApplyId(applyId).then(res => {
        console.log(res.data)
        this.mentorPayVisible = true
        this.applyData = {
          applyId: applyId,
          applyStatus: res.data.apply.applyStatus
        }
        console.log(this.applyData)
      })
    },
    getDataList () {
      console.log('getList')
      const params = {
        signId: this.signId,
        lessonType: this.lessonType
      }
      this.filtersMentorName = []
      api.getLessonInfo(params).then(res => {
        console.log('getLessonInfo', res.data)
        this.menteeInfo = res.data.menteeInfo
        this.mentorData = res.data.mentorList || []
        this.mentorData.forEach(v => {
          v.country = JSON.parse(v.country)
          v.track = JSON.parse(v.track)
          v.percentage = v.totalHour == 0 ? 0 : (v.finishHour / v.totalHour) * 100
          this.filtersMentorName.push({ text: v.mentorName, value: v.mentorName })
        })
        this.totalHour = res.data.totalHour || 0
        this.mentorAllocatedHour = res.data.mentorAllocatedHour || 0
        this.finishHour = res.data.finishHour || 0
        this.restHour = this.totalHour - this.finishHour
        this.courseData = res.data.lessonList
      })
    },
    /**
     * @description: table 导师筛选
     * @param {*}
     * @return {*}
     */
    filterMentorName (value, row) {
      return row.mentorName === value
    },
    /**
     * @description: 导出学生课程报告
     * @param {*}
     * @return {*}
     */
    exportExcel () {
      this.$loading()
      api.getSignSchedule(this.signId).then(res => {
        const val = res.data.relativePath
        this.$loading().close()
        file.downloadFile(val, url => {
          console.log(url)
        })
      })
    },
    /**
     * @description: 进度条组件自定义返回内容
     * @param {*} data
     * @return {*}
     */
    format (data) {
      return () => {
        return `已完成进度 ：${data.finishHour} / ${data.totalHour}`
      }
    },
    /**
     * @description: 申请课时费用
     * @param {*}
     * @return {*}
     */
    showApply (pkId) {
      this.$router.push({ name: 'LessonPayApply', query: { pkId: pkId } })
    },
    toBind (data) {
      api.getMentorQrCode(data.mentorId).then(res => {
        console.log(res)
        this.url = res.data
        this.dialogVisible = true
        // const imageHtml = `<div style="width: 100%; height: 200px;text-align:center">
        //                   <img
        //                   style="width: 200px; height: 200px"
        //                   src="${res.data}"/>
        //                 </div>
        //                 <div style="text-align:center;color:#FF8C00;margin-top:20px" >请截图后分享给导师进行绑定</div>`

        // this.$alert(imageHtml, '导师小程序绑定二维码', {
        //   showConfirmButton: false,
        //   dangerouslyUseHTMLString: true
        // })
      })
    },
    /**
     * @description: 新增导师
     * @param {*}
     * @return {*}
     */
    addMentor () {
      // 注：此处mentorData对象会多一个自定义参数
      const canUsedTotalHours = this.totalHour - this.mentorAllocatedHour
      this.mentorDetailData = {
        canUsedTotalHours: canUsedTotalHours
      }
      this.mentorDetailVisible = true
    },
    /**
     * @description:
     * @param {*} mentor
     * @return {*}
     */
    editMentor (mentor) {
      let usedTotalHours = 0
      this.mentorData.forEach(v => {
        mentor.mentorId !== v.mentorId ? usedTotalHours += v.totalHour : ''
      })
      // 注：此处mentorData对象会多一个自定义参数
      mentor.canUsedTotalHours = this.totalHour - usedTotalHours
      this.mentorDetailData = mentor
      this.mentorDetailVisible = true
    },
    mentorDetailClose () {
      this.mentorDetailVisible = false
    },
    mentorDetailSubmit () {
      this.mentorDetailClose()
      this.getDataList()
    },
    /**
     * @description: 双击table行展开
     * @param {*} row
     * @param {*} index
     * @param {*} e
     * @return {*}
     */
    expandClick (row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    /**
     * @description: 导出课表
     * @param {*}
     * @return {*}
     */
    exportLesson () {
      const fileName = '课表'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}lesson/exportLesson?signId=${this.signId}&lessonType=${this.lessonType}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = this.$store.state.role.token
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.xlsx' // 如123.xlsx
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
          a = null
        }
      }
      // 发送请求
      xhr.send()
    },
    /**
     * @description: 导入课表
     * @param {*}
     * @return {*}
     */
    inputExcel () {
      this.uploadLessonsVisible = true
    },
    inputExcelClose () {
      this.uploadLessonsVisible = false
    },
    inputExcelSubmit () {
      this.inputExcelClose()
      this.getDataList()
    },
    /**
     * @description: 新增课程
     * @param {*}
     * @return {*}
     */
    addCourse (lessonType) {
      this.courseEditData = { lessonType: this.lessonType, settleMentee: this.menteeInfo.menteeId, menteeName: this.menteeInfo.realName }
      console.log(this.courseEditData)
      if (lessonType == '2') {
        this.strategistCourseVisible = true
      } else {
        this.mentorCourseVisible = true
      }
    },
    /**
     * @description: 标记课程
     * @param {*} row
     * @return {*}
     */
    editCourse (row) {
      this.mentorCourseVisible = true
      this.courseEditData = row
    },
    toVipHours () {
      this.toVipHoursVisible = true
      console.log(this.mentorData)
    },
    toVipHoursClose () {
      this.toVipHoursVisible = false
      console.log(this.mentorData)
    },
    toVipHoursSubmit () {
      this.toVipHoursClose()
      this.getDataList()
    },
    courseEditClose () {
      this.mentorCourseVisible = false
      this.strategistCourseVisible = false
    },
    courseEditSubmit () {
      this.courseEditClose()
      this.getDataList()
    },
    courseCheck () {
      this.courseEditClose()
      this.detailVisible = true
    },
    // 删除课程
    delectCourse (row) {
      this.$confirm('此操作将永久删除该课时, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row)
          const data = { signId: this.signId }
          if (row.lessonType == 1) {
            data.mentorLessonObject = {
              delList: [row.lessonId]
            }
          } else if (row.lessonType == 2) {
            data.vipLessonObject = {
              delList: [row.lessonId]
            }
          }
          console.log('排课参数2', data)
          api
            .deleteCourse(row.lessonId)
            .then(res => {
              console.log('排课', res)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.editId = 0
              this.getDataList()
              this.$loading().close()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    /**
     * @description: 校验改导师可分配课时数
     * @param {*} mentorId
     * @param {*} lessonHours
     * @return {*}
     */
    checkHours (mentorId, lessonHours) {
      const canUsedHour = this.mentorData.filter(
        v => v.mentorId === mentorId
      )[0].signHour
      if (lessonHours * 1 > canUsedHour) {
        return false
      } else {
        return true
      }
    },
    mentorTrackEdit (mentorId) {
      console.log(this.mentorData)
      const mentorTrackTagArr = this.mentorData.filter(
        v => v.mentorId === mentorId
      )[0].mentorTrackTagArr
      return mentorTrackTagArr
    },
    // 下载模板
    downModel () {
      if (this.$apiUrl.indexOf('wallstreettequila') == '-1') {
        const url = 'https://pageguo.com/download/template/lesson-excel-template-v2.xlsx'
        window.open(url)
      } else {
        const url = 'https://wallstreettequila.com/download/template/lesson-excel-template-v2.xlsx'
        window.open(url)
      }
    },
    mentorPayClose () {
      console.log('导师酬金关闭')
      this.mentorPayVisible = false
    },
    mentorRecell () {
      console.log('导师酬金撤回')
      this.Topage(1)
      this.mentorPayClose()
    },
    mentorPaySubmit () {
      console.log('导师酬金提交')
      this.Topage(1)
      this.mentorPayClose()
    },
    // 预览
    preview (url) {
      file.preview(url)
    },
    handleClose () {
      this.dialogVisible = false
    },
    downloadImg () {
      this.down(this.url)
    },
    down (url) {
      const a = JSON.parse(JSON.stringify(url))
      const fileName = a.split('/').slice(-1)[0]
      console.log(url, fileName)
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          FileSaver.saveAs(xhr.response, fileName)
        }
      }
      xhr.send()
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSubmit () {
      this.$message.success('核验成功，请重新排课！！')
      this.detailVisible = false
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
$background-color:#F4F4F4;
*{
  box-sizing: border-box;
}
.yx-aa {
  .el-dialog__footer{
    text-align: center !important;
  }
}
.course_detail_container{
  display: flex;
}

.mentor_area{
  width: 500px;
  height:100%;
  padding:10px;
  background: #FFF;
  border-radius: 10px;
  .top_status_bar{
    display: flex;
    align-items: center;
  }
  .mentor_list{
    margin-right:-10px;
    // padding-left:20px;
    .mentor_item{
      width:100%;
      height:auto;
      margin-top:15px;
      border-radius: 5px 0 0 5px;
      box-shadow: -5px 0px 5px #c5c5c5;
      overflow: hidden;
      .mentor_item_content{
        height:40px;
        padding:10px;
        align-items: center;
        display: flex;
        .mentor_item_content_title{
          width:100px;
        }
        .mentor_item_content_progress{
          flex:1;
          ::v-deep .el-progress-bar__innerText{
            color:#000;
          }
        }
      }
      .mentor_item_model_content{
        padding:0 10px;
        display: flex;
        justify-content: space-between;
        .mentor_item_model{
          margin-bottom:20px;
          padding:10px 20px;
          width:120px;
          height:80px;
          background: $background-color;
          border-radius: 10px;
          box-sizing: border-box;
          .mentor_item_model_title{
            font-size:12px;
            margin-bottom:10px;
            color:#888
          }
          .mentor_item_model_value{
            height:24px;
            line-height:24px;
            padding-left:10px;
            font-size:20px;
            border-left: 4px solid #FF8C00
          }
          .can_click{
            cursor: pointer;
            text-decoration:underline
          }
        }
      }
      .mentor_item_title{
        padding:0 10px;
        width:100%;
        height:60px;
        background-color:#ff8c007a;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btnblock{
          position: relative;
          .btn-center{
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%,-50%);
          }
        }
        .mentor_item_title_left{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .mentor_tag{
            display: inline-block;
          }
        }
        .mentor_item_title_name{
          font-size: 20px;
          line-height: 53px;
          margin-right:10px;
        }
        .mentor_item_title_type{
          line-height: 53px;
        }
        .mentor_item_title_icon{
          font-size:18px;
          cursor: pointer;
        }
      }
    }
  }
}

.course_area{
  flex: 1;
  height:100%;
  margin-left:20px;
  padding:10px;
  background: #FFF;
  border-radius: 10px;
}
.displayFlex{
  display: flex;
}
.to_bind{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  font-size:16px;
  color:#409eff;
  cursor: pointer;
}

</style>
