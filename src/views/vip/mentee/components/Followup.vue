<!--
 * @Author: 库建华
 * @Date: 2020-05-26 13:31:12
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-20 16:51:56
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog
      :title="`Follow up`"
      :append-to-body="true"
      :visible.sync="vipFollowApplyVisible"
      :close-on-click-modal="false"
      width="800px"
      :before-close="followUpItemClose">
      <el-form
        style="max-width:1290px"
        class="mt20"
        size="mini"
        inline
        :model="followUpData"
        :rules="rules"
        ref="formVerify"
        label-width="180px"
      >
        <el-form-item align="center" prop="applicationProgress" label="申请进度">
          <el-input v-model="followUpData.applicationProgress" size="mini" :style="{width:'560px'}"></el-input>
        </el-form-item>
        <el-form-item align="center" prop="lessonProgress" label="课程进度">
          <el-input v-model="followUpData.lessonProgress" size="mini" :style="{width:'560px'}"></el-input>
        </el-form-item>
        <el-form-item align="center" prop="mentorFeedback" label="导师对学生的阶段性survey">
          <el-input v-model="followUpData.mentorFeedback" size="mini" :style="{width:'560px'}"></el-input>
        </el-form-item>
        <el-form-item align="center"  label="导师survey附件">
          <el-upload
            action
            class="upload-btn"
            ref="upload2"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList2"
            :on-change="change2"
            :on-remove="change2"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
        </el-upload>
        </el-form-item>
        <el-form-item align="center" prop="improvePoint" label="需要提升和改进的点">
          <el-input v-model="followUpData.improvePoint" size="mini" :style="{width:'560px'}"></el-input>
        </el-form-item>
        <el-form-item align="center" prop="menteeMentality" label="学生阶段心理状态Update">
          <el-input v-model="followUpData.menteeMentality" size="mini" :style="{width:'560px'}"></el-input>
        </el-form-item>
        <!-- <el-form-item label="凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'400px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item> -->
        <!-- <el-form-item label prop>
          <el-checkbox v-model="checked">提交课时申请</el-checkbox>
        </el-form-item>
        <template v-if="checked">
          <el-form-item label="课时" prop="lessonHours">
            <div>
              <el-slider
                :style="{width:'560px'}"
                v-model="followUpData.lessonHours"
                :step="5"
                :min="15"
                :max="120"
                show-stops
              ></el-slider>
            </div>
            {{followUpData.lessonHours}} 分钟
          </el-form-item>
          <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
            <el-select
              :style="{width:'200px'}"
              v-model="item.auditor"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="confirmItem in item.confirmorArr"
                :key="confirmItem.confirmorId"
                :label="confirmItem.confirmorName"
                :value="confirmItem.confirmorId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抄送">
            <el-select
              :style="{width:'200px'}"
              v-model="copy"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </template> -->
        <el-form-item align="center" prop="otherRemark" label="其他补充的点">
          <el-input 
            v-model="followUpData.otherRemark" 
            :style="{width:'560px'}"
            type="textarea"
            :autosize="{minRows:3}"
            :maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followUpItemClose">取 消</el-button>
        <el-button type="primary" @click="followUpItemSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiV from '@/api/vip'
import { uploadFunBySys, fmtDate } from '@/libs/file'

export default {
  name: 'vip_follow_form',
  props: {
    menteeId: {},
    menteeName: {},
    pkId: {},
    signId: {},
    times: {},
    vipFollowApplyVisible:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      followUpId: '',
      rules: {
        lessonHours: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      followUpData: {},
      checked: false,
      fileList: [],
    	fileList2: [],
      user: [],
      copy: [],
      auditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ]
    }
  },
  watch: {
    vipFollowApplyVisible: function (val) {
      if (val) {
        this.pageInit()
      }
    }
  },
  mounted () {

  },
  methods: {
    pageInit () {
      apiV.userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
        .then(({ data }) => {
          console.log(
            'userList...........................................',
            data
          )
          this.user = data.rows
        })
      apiV.getAuditorListByApplyType('vip_lesson').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    change2 (file, fileList) {
      console.log(file, fileList)
      this.fileList2 = fileList
    },
    close () {
      this.clear()
    },
    clear () {
      this.followUpData = {}
      this.fileList = []
      this.fileList2 = []
      this.$refs.formVerify && this.$refs.formVerify.resetFields()
      this.$refs.upload1 && this.$refs.upload1.clearFiles()
      this.$refs.upload2 && this.$refs.upload2.clearFiles()
    },
    followUpItemSubmit () {
      this.$refs.formVerify.validate(valid => {
        if (!valid) return
        console.log(this.followUpData)
        this.$loading()
        if (!this.checked) {
          const data = {
            pkId: this.pkId,
            times: this.times,
            signId: this.signId,
            applicationProgress: this.followUpData.applicationProgress,
            lessonProgress: this.followUpData.lessonProgress,
            mentorFeedback: this.followUpData.mentorFeedback,
            menteeMentality: this.followUpData.menteeMentality,
            improvePoint: this.followUpData.improvePoint,
            followVoucher: '',
            otherRemark: this.followUpData.otherRemark
          }
          let length = 0
          if (!this.fileList.length) {
            if (this.fileList2.length > 0) {
              uploadFunBySys(this.fileList2[0].raw, `materials/vip_survey_${this.pkId}_${~~(
								Math.random() *
								10 ** 3
							)}`,
              (url) => {
                data.mentorSurvey = url
                console.log(data)
                apiV.setFollowUp(data).then((res) => {
                  this.$message.success('follow成功')
                  this.$emit('changepage')
                  this.$loading().close()
                  this.clear()
                })
              })
            } else {
              apiV.setFollowUp(data).then((res) => {
                this.$message.success('follow成功')
                this.$emit('changepage')
                this.$loading().close()
                this.clear()
              })
            }
          } else {
            for (let i = this.fileList.length - 1; i >= 0; i--) {
              const file = this.fileList[i]
              uploadFunBySys(
                file.raw,
                `materials/vip_lesson_${this.pkId}_${~~(
                  Math.random() *
                  10 ** 3
                )}`,
                (url) => {
                  console.log(url)
                  length++
                  data.followVoucher += url + ','
                  if (length === this.fileList.length) {
                    data.followVoucher = data.followVoucher.substr(
                      0,
                      data.followVoucher.length - 1
                    )
                    console.log('setStrategist参数', data)
                    if (this.fileList2.length > 0) {
                      uploadFunBySys(this.fileList2[0].raw, `materials/vip_survey_${this.pkId}_${~~(
                        Math.random() *
                        10 ** 3
                      )}`,
                      (url) => {
                        data.mentorSurvey = url
                        console.log(data)
                        apiV.setFollowUp(data).then((res) => {
                        	this.$message.success('follow成功')
                          this.$emit('changepage')
                          this.$loading().close()
                          this.clear()
                        })
                      })
                    } else {
                      apiV.setFollowUp(data).then((res) => {
                        this.$message.success('follow成功')
                        this.$emit('changepage')
                        this.$loading().close()
                        this.clear()
                      })
                    }
                  }
                }
              )
            }
          }
          console.log(data)
        } else {
          this.followUpItemSubmitApply()
        }
      })
    },
    followUpItemSubmitApply () {
      if (!this.fileList.length) {
        this.$message({
          type: 'warning',
          message: '凭证必填！'
        })
        this.$loading().close()
        return
      }

      const approval = []
      let cannot = false
      this.auditorList.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true
        }
        aa.auditor.forEach(v => {
          approval.push({ approverId: v })
        })
      })
      if (cannot) {
        this.$message({
          type: 'warning',
          message: '审核人都为必填！'
        })
        return
      }
      const copyTo = []
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v })
      })
      const lessonDate = fmtDate(new Date(), 'yyyy-MM-dd')
      const userInfo =  this.$store.state.role.userInfo
      console.log(userInfo)
      const lesson = {
        applicationProgress: this.followUpData.applicationProgress,
        lessonProgress: this.followUpData.lessonProgress,
        mentorFeedback: this.followUpData.mentorFeedback,
        menteeMentality: this.followUpData.menteeMentality,
        improvePoint: this.followUpData.improvePoint,
        otherRemark: this.followUpData.otherRemark,
        signId: this.signId,
        settleMentee: this.menteeId,
        settleMentor: userInfo.userId,
        lessonHours: this.followUpData.lessonHours / 60,
        realDate: lessonDate,
        lessonDate: lessonDate,
        materials: ''
      }
      const data = {
        pkId: this.pkId,
        times: this.times,
        signId: this.signId,
        applicationProgress: this.followUpData.applicationProgress,
        lessonProgress: this.followUpData.lessonProgress,
        mentorFeedback: this.followUpData.mentorFeedback,
        menteeMentality: this.followUpData.menteeMentality,
        otherRemark: this.followUpData.otherRemark,
        improvePoint: this.followUpData.improvePoint,
        followVoucher: '',
        apply: {
          applyType: 'vip_lesson',
          applyTitle: `全职导师【${userInfo.userName}】的课程申请(follow)`,
          copyTo: copyTo,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '学员名',
                value: this.menteeName
              },
              {
                label: '上课时间',
                value: lessonDate
              },
              {
                label: '申请进度',
                value: this.followUpData.applicationProgress
              },
              {
                label: '课程进度',
                value: this.followUpData.lessonProgress
              },
              {
                label: '导师对学生的阶段性survey',
                value: this.followUpData.mentorFeedback
              },
              {
                label: '需要提升和改进的点',
                value: this.followUpData.improvePoint
              },
              {
                label: '学生阶段心理状态Update',
                value: this.followUpData.menteeMentality
              },
              {
                label: '其他补充的点',
                value: this.followUpData.otherRemark
              },
              {
                label: '上课时长',
                value: this.followUpData.lessonHours / 60
              },
              {
                label: '上课人',
                value: userInfo.userName
              }
            ],
            info: lesson
          },
          lesson: lesson
        }
      }
      for (let i = this.fileList.length - 1; i >= 0; i--) {
        const file = this.fileList[i]
        uploadFunBySys(
          file.raw,
          `materials/vip_lesson_${this.pkId}_${~~(Math.random() * 10 ** 3)}`,
          (url) => {
            console.log(url)
            data.apply.content.file.push({
              name: file.name,
              url: url
            })
            lesson.materials += url + ','
            data.followVoucher += url + ','
            if (data.apply.content.file.length === this.fileList.length) {
              lesson.materials = lesson.materials.substr(
                0,
                lesson.materials.length - 1
              )
              data.followVoucher = data.followVoucher.substr(
                0,
                data.followVoucher.length - 1
              )
              if (this.fileList2.length > 0) {
                uploadFunBySys(this.fileList2[0].raw, `materials/vip_survey_${this.pkId}_${~~(
                  Math.random() *
                  10 ** 3
                )}`,
                (url) => {
                  console.log(data)
                  data.mentorSurvey = url
                  data.apply.content.file.push({
                    name: '导师反馈文件',
                    url: url
                  })
                  apiV.setFollowUp(data).then((res) => {
                    this.$message.success('follow成功')
                    this.$emit('changepage')
                    this.$loading().close()
                    this.clear()
                  })
                })
              } else {
                apiV.setFollowUp(data).then((res) => {
                  this.$message.success('follow成功')
                  this.$emit('changepage')
                  this.$loading().close()
                  this.clear()
                })
              }
            }
          }
        )
      }
    },
    followUpItemClose () {
      this.clear()
      this.$emit('close')
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
