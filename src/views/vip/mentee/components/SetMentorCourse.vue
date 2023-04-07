<!--
 * @Author: kaan
 * @Date: 2021-12-01 15:28:08
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-10 10:51:01
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-dialog
      :title="courseData.lessonId ?'编辑课程':'新增课程' "
      :visible.sync="courseVisible"
      :before-close="close"
      :close-on-click-modal="false"
      v-if="courseVisible"
      width="850px"
      append-to-body
    >
      <el-form
        :inline="true"
        label-width="150px"
        :model="courseData"
        :rules="rules"
        ref="formVerify"
      >
        <el-form-item align="center" prop="lessonDate" label="上课时间">
          <el-date-picker
            v-model="courseData.lessonDate"
            :style="{width:widths}"
            :clearable="true"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item align="center" prop="lessonHours" label="课时">
          <el-input
            :style="{width:widths}"
            v-model="courseData.lessonHours"
            size="mini"
            placeholder="请输入课时">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
        <el-form-item align="center" prop="beginTime" label="开始时间">
          <el-time-select
            :style="{width:widths}"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
            format = 'HH:mm' value-format = 'HH:mm'
            v-model="courseData.beginTime"
            size="mini"
            arrow-control
            placeholder="开始时间/非必填">
          </el-time-select>
        </el-form-item>
        <el-form-item align="center" prop="endTime" label="结束时间">
          <el-time-select
            :style="{width:widths}"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
            format = 'HH:mm' value-format = 'HH:mm'
            v-model="courseData.endTime"
            size="mini"
            arrow-control
            placeholder="结束时间/非必填">
          </el-time-select>
        </el-form-item>
        <el-form-item align="center" prop="settleMentor" label="上课老师">
          <el-select
            size="mini"
            :style="{width:widths}"
            v-model="courseData.settleMentor"
            filterable
            placeholder="请选择"
            @change="mentorChange"
          >
            <el-option
              v-for="item in mentorData"
              :key="item.mentorId"
              :label="item.mentorName"
              :value="item.mentorId "
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态" prop="lessonStatus">
          <el-select
            :style="{width:widths}"
            size="mini"
            v-model="courseData.lessonStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item align="center" label="初始评分" v-if="courseData.lessonId">
          <div :style="{width:'180px'}" class="programName">{{courseData.hisFeedbackStar || '-'}}</div>
        </el-form-item>
        <el-form-item align="center" prop="feedbackStar" label="当前评分" v-if="courseData.lessonId">
          <div :style="{width:'125px'}" class="programName">{{courseData.lastFeedbackStar || '-'}}</div>
          <el-button type="" size="mini" @click="resetFeedback" :disabled="courseData.vipConfirm == 1">重置</el-button>
        </el-form-item>
        <el-form-item align="center" prop="feedbackStar" label="修改评分" v-if="courseData.lessonId && roleInfo.includes(`mentee_base_program_set_feedback_star`)">
          <el-input
            :style="{width:widths}"
            v-model="courseData.feedbackStar"
            size="mini"
            :disabled="courseData.vipConfirm == 1"
            placeholder="请输入评分">
          </el-input>
        </el-form-item>
        <el-form-item align="left" v-if="courseData.lessonType == '1'" prop="" label="课程组成">
          <el-button @click="trackEdit">编辑</el-button><br>
          <ul v-for="(track,i) in mentorTrackTagArr" :key="i">
            <li class="mt10" v-for="(item,j) in track.typeList" :key="j">
              <div v-if="item.checked">
                <div class="course_name">{{track.itemName}}-{{item.contentType}}</div>
                <el-input
                  :style="{width:widths}"
                  v-model="item.lessonHours"
                  size="mini"
                  placeholder="请输入课时">
                  <template slot="append">小时</template>
                </el-input>
              </div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item align="center" prop="lessonName" label="课程名称">
          <el-input
            type="textarea"
            v-model="courseData.lessonName"
            size="small"
            maxlength="50"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4}"
            :style="{width:'560px'}"
          ></el-input>
        </el-form-item>
        <el-form-item align="center" prop="" label="课程内容">
          <el-input
            type="textarea"
            v-model="courseData.lessonContent"
            size="small"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4}"
            :style="{width:'560px'}"
          ></el-input>
        </el-form-item>
        <el-form-item align="center" prop="homework" label="课程作业">
          <el-input
            type="textarea"
            v-model="courseData.homework"
            size="small"
            maxlength="255"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4}"
            :style="{width:'560px'}"
          ></el-input>
        </el-form-item>

        <br>
        <el-form-item label="材料">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'150px'}"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button> -->
          </el-upload>
          <el-button
            v-if="courseData.materials"
            @click="preview(courseData.materials)"
            size="mini"
          >预览材料</el-button>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" v-if="btnStatus" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'课程组成' "
      :visible.sync="trackVisible"
      :before-close="closeTrack"
      :close-on-click-modal="false"
      v-if="trackVisible"
      width="400px"
      append-to-body
    >
      <div>
        <ul v-for="(track,i) in mentorTrackTagArr" :key="i">
          <li class="mb10">- {{track.itemName}}：</li>
          <li class="mb10" v-for="(item,j) in track.typeList" :key="j">
            <el-checkbox v-model="item.checked">{{item.contentType}}</el-checkbox>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTrack">取 消</el-button>
        <el-button type="primary" @click="submitTrack">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import api from '@/api/vip'
import files from '@/libs/file'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  mixins: [
    mixins
  ],
  props: {
    mentorCourseVisible: {
      type: Boolean,
      default: false
    },
    courseEditData: {
      type: Object
    },
    signId: {
      type: String,
      default: ''
    },
    mentorData: {},
    checkHours: {
      type: Function
    },
    mentorTrackEdit: {
      type: Function
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    var validHours = (rule, value, callback) => {
      if (value && this.courseData.settleMentor) {
        if (!this.checkMentorHours(this.courseData.settleMentor, value)) {
          return callback(new Error('该导师课时总数不可超过分配课时数'))
        } else if (!this.checkTrackHours()) {
          return callback(new Error('该导师分配课时数与track课程总和不一致'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      btnStatus: false,
      courseVisible: false,
      widths: '200px',
      courseData: {
      },
      status: [
        { itemValue: '0', itemName: '未开始' },
        { itemValue: '1', itemName: '进行中' },
        { itemValue: '2', itemName: '已完成' },
        { itemValue: '3', itemName: '已取消' },
        { itemValue: '4', itemName: '有争议' }
      ],
      fileList: [],
      rules: {
        lessonDate: { required: true, message: '必填', trigger: 'blur' },
        lessonName: [{ required: true, message: '必填', trigger: 'blur' },
          { max: 50, message: '课程名称长度为50个字符以内', trigger: 'blur' }],
        lessonHours: [{ required: true, message: '必填', trigger: 'blur' },
          { validator: validHours, trigger: 'blur' }],
        settleMentor: { required: true, message: '必填', trigger: 'blur' },
        lessonStatus: { required: true, message: '必填', trigger: 'blur' }
      },
      trackVisible: false,
      mentorTrackTagArr: [],
      contentTypeList: []
    }
  },
  watch: {
    mentorCourseVisible: function (val) {
      this.courseVisible = JSON.parse(JSON.stringify(this.mentorCourseVisible))
      if (val) {
        this.courseData = JSON.parse(JSON.stringify(this.courseEditData))
        this.mentorChange()
        console.log(this.courseData, this.mentorData)
      }
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.$emit('close')
      this.btnStatus = false
      this.clear()
      this.fileList = []
    },
    clear () {
      this.mentorTrackTagArr = []
      this.contentTypeList = []
    },
    mentorChange () {
      this.mentorTrackTagArr = this.mentorData.filter(
        v => v.mentorId === this.courseData.settleMentor
      )
      console.log(this.courseData.settleMentor, this.mentorData, this.mentorTrackTagArr)
      this.mentorData && this.mentorData.forEach(item => {
        if (item.mentorId == this.courseData.settleMentor && item.hasSchedule) {
          this.$alert('请先核验预排课', '警告', {
            confirmButtonText: '前往核验',
            callback: action => {
              this.$emit('check')
              this.clear()
            }
          })
        } else {
          this.btnStatus = true
        }
      })
      this.contentTypeList = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
      this.courseData.materials = ''
    },
    checkMentorHours (mentorId, lessonHours) {
      return this.checkHours(mentorId, lessonHours)
    },
    checkTrackHours () {
      let trackHours = 0
      console.log(this.mentorTrackTagArr)
      this.mentorTrackTagArr.forEach(v => {
        if (!v.typeList) return
        v.typeList.forEach(u => {
          if (u.checked) {
            trackHours += parseFloat(u.lessonHours)
            this.contentTypeList.push({ contentType: u.pkId, contentHours: u.lessonHours })
          }
        })
      })
      if (trackHours == 0) { return true }
      return trackHours == this.courseData.lessonHours
    },
    trackEdit () {
      if (!this.courseData.settleMentor) { this.$message.warning('请先选择上课老师'); return }
      this.courseVisible = false
      this.trackVisible = true
    },
    closeTrack () {
      this.courseVisible = true
      this.trackVisible = false
    },
    submitTrack () {
      this.closeTrack()
    },
    submit () {
      this.$refs.formVerify.validate((v) => {
        if (!v) { return }
        const lesson = {
          signId: this.signId,
          lessonId: this.courseData.lessonId,
          lessonName: this.courseData.lessonName,
          settleMentee: this.courseData.settleMentee,
          settleMentor: this.courseData.settleMentor,
          lessonType: this.courseData.lessonType,
          lessonDate: this.courseData.lessonDate,
          lessonHours: this.courseData.lessonHours,
          lessonDifficulty: this.courseData.lessonDifficulty,
          lessonContent: this.courseData.lessonContent,
          lessonStatus: this.courseData.lessonStatus,
          homework: this.courseData.homework,
          furtherReading: this.courseData.furtherReading,
          materials: this.courseData.materials,
          feedbackStar: this.courseData.feedbackStar,
          contentTypeList: this.contentTypeList
        }
        // lesson = Object.assign(lesson, this.courseData)
        if (this.courseData.beginTime) {
          if (this.courseData.beginTime.length >= 19) {
            lesson.beginTime = `${this.courseData.beginTime}:00`
          } else {
            lesson.beginTime = `${this.courseData.lessonDate} ${this.courseData.beginTime}:00`
          }
        }
        if (this.courseData.endTime) {
          if (this.courseData.endTime.length >= 19) {
            lesson.endTime = `${this.courseData.endTime}:00`
          } else {
            lesson.endTime = `${this.courseData.lessonDate} ${this.courseData.endTime}:00`
          }
        }
        if (this.fileList.length) {
          const fileArr = []
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            files.uploadFunBySys(file.raw, `course/${this.signId}`, (url) => {
              fileArr.push({
                name: file.name,
                url: url
              })
              lesson.materials += url + ','
              if (fileArr.length === this.fileList.length) {
                lesson.materials = lesson.materials.substr(0, lesson.materials.length - 1)
                this.submitSend(lesson)
              }
            })
          }
        } else {
          this.submitSend(lesson)
        }
      })
    },
    submitSend (lesson) {
      console.log('课程参数', lesson)
      if (lesson.lessonId) {
        api.updateCourse(lesson).then((res) => {
          console.log('编辑课程参数res', res)
          if (res.code !== 200) {
            this.$message.warning(res.message)
            return
          }
          this.$emit('submit')
          this.clear()
        })
      } else {
        api.addCourse(lesson).then((res) => {
          console.log('新增课程参数res', res)
          if (res.code !== 200) {
            this.$message.warning(res.message)
            return
          }
          this.$emit('submit')
          this.clear()
        })
      }
    },
    preview (val) {
      files.preview(val)
    },
    resetFeedback () {
      api.resetFeedback(this.courseData.lessonId).then((res) => {
        this.$message('重置成功')
        this.$emit('submit')
        this.clear()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.programName{
  border-radius: 5px;
  margin-top: 5px;
  padding: 0px 9px;
  border: 1px #dcdfe6 dashed;
  height: 26px;
  line-height: 26px;
  min-width: 0;
  display: inline-block;
}
::v-deep .el-upload-dragger{
  width:560px;
  height:120px;
}
::v-deep .el-icon-upload{
  margin: 10px 0 !important;
}
.course_name{
  width:360px;
  display: inline-block;
}
</style>
