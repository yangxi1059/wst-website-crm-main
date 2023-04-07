<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-08 09:57:10
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      title="新增面试申请"
      :close-on-click-modal="false"
      :visible.sync="applyInterviewVisible"
      width="680px"
      :before-close="close"
    >
        <el-form :inline="true"
         :rules="rules"
         :model="item"
         ref="ruleForm"
         label-width="130px">
          <el-form-item label="公司:" prop="company">
            <el-select
              :style="{width:'180px'}"
              v-model="item.company"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in company"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门:" prop="division">
            <el-select
              :style="{width:'180px'}"
              v-model="item.division"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in division"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市:" prop="city">
            <el-select
              :style="{width:'180px'}"
              v-model="item.city"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in city"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习/全职:" prop="resultApply">
            <el-select
              :style="{width:'180px'}"
              v-model="item.resultApply"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internship_or_full_time"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="实习类型:" prop="internshipType" v-if="item.resultApply == '0'">
            <el-select
              :style="{width:'180px'}"
              v-model="item.internshipType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internship_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="全职类型:" prop="fullTimeType"  v-if="item.resultApply == '1'">
            <el-select
              :style="{width:'180px'}"
              v-model="item.fullTimeType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in full_time_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面试时间:" prop="interviewDate">
            <el-date-picker
              :style="{width:'180px'}"
              value-format="yyyy-MM-dd"
              v-model="item.interviewDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="申请季:" prop="applySeason">
            <el-select
              :style="{width:'180px'}"
              v-model="item.applySeason"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in apply_season"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
            <!-- <el-input v-if="pkId  == item.pkId" :style="{width:'180px'}" v-model="item.applySeason"></el-input> -->
          </el-form-item>
          <el-form-item label="第几轮:" prop="times">
            <el-select
              :style="{width:'180px'}"
              v-model="item.times"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in interview_round_no"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难易度:" prop="difficultyLevel">
            <el-select
              :style="{width:'180px'}"
              v-model="item.difficultyLevel"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in difficultList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="屏蔽学生学校:" prop="shield">
              <el-select
                :style="{width:'180px'}"
                v-model="item.shield"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in common_yes_or_no"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可宣传:" prop="publicStatus">
              <el-select
                :style="{width:'180px'}"
                :disabled="publicStatus == '0'"
                v-model="item.publicStatus"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in common_yes_or_no"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>

          <el-form-item label="面经提供人:">
            <el-select
              :style="{width:'180px'}"
              filterable
              v-model="item.storyBy"
              placeholder="请选择"
            >
              <el-option
                v-for="item in users"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内推导师:" >
            <el-input placeholder="请输入精确导师名" :disabled="applyStatus" v-model="item.name" :style="{width:'180px'}" >
              <el-button slot="append" type="primary" icon="el-icon-search" v-if="!applyStatus" @click="searchInputMentor(item.name)"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="面经:" prop="story">
            <el-input style="width:500px"  v-model="item.story" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input style="width:500px"  v-model="item.remark" type="textarea"></el-input>
          </el-form-item>
          <!-- <el-form-item label="面试过程/问题:">
            <el-input style="width:800px"   v-model="item.interviewQuestion" type="textarea"></el-input>
          </el-form-item> -->

          <el-form-item label="面试凭证:">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList1"
              :on-change="change1"
              :on-remove="remove1"
              drag
            >
              <span class="el-icon-upload"></span>
              <el-button size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="学生通知截图:">
            <el-upload
              action
              class="upload-btn"
              ref="upload2"
              :auto-upload="false"
              :file-list="fileList2"
              :on-change="change2"
              :on-remove="remove2"
              drag
            >
              <span class="el-icon-upload"></span>
              <el-button size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>

            <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
                <el-select
                    :style="{width:'180px'}"
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
            <br>
            <el-form-item  >
              <el-button style="margin-left:130px" @click="close">取 消</el-button>
              <el-button type="primary" @click="submit">申 请</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
      title="行业导师"
      :close-on-click-modal="false"
      :visible.sync="mentorListVisible"
      width="700px"
      :before-close="mentorListClose"
    >
      <el-row v-for="(mentor,i) in mentorSearchList" :key="mentor.mentorId">
        <el-col :span="3">
          <el-button size="mini" @click="chooseMentor(i)" type="primary">选择</el-button>
        </el-col>
        <el-col :span="3" class="_item-name">姓名</el-col>
        <el-col :span="4" class="_item-value">{{mentor.mentorName}}</el-col>
        <el-col :span="3" class="_item-name">微信ID</el-col>
        <el-col :span="4" class="_item-value">{{mentor.wxId}}</el-col>

      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import { uploadFunBySys } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  props: {
    publicStatus: {},
    applyInterviewVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    menteeName: {
      type: String,
      default: ''
    },
    applyInternalData: {},
    applyStatus: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      users: [],
      company: [],
      division: [],
      country: [],
      city: [],
      internship_or_full_time: [],
      common_yes_or_no: [],
      apply_season: [],
      internship_type: [],
      mentorSearchList: [],
      full_time_type: [],
      auditor: [],
      mentorListVisible: false,
      rules: {
        company: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        division: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        resultApply: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        interviewDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        applySeason: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        times: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        difficultyLevel: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        shield: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        publicStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        internshipType: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        fullTimeType: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
        // story: [
        //     { required: true, message: "必填", trigger: "blur" }
        // ],
      },
      difficultList: [
        { itemName: '5', itemValue: '5' },
        { itemName: '4', itemValue: '4' },
        { itemName: '3', itemValue: '3' },
        { itemName: '2', itemValue: '2' },
        { itemName: '1', itemValue: '1' }
      ],
      item: {
        company: '',
        division: '',
        city: '',
        resultApply: '',
        interviewDate: '',
        applySeason: '',
        times: '',
        difficultyLevel: '',
        shield: '',
        publicStatus: '',
        internshipType: '',
        fullTimeType: '',
        storyBy: '',
        story: '',
        remark: '',
        companyName: '',
        divisionName: '',
        cityName: '',
        resultApplyName: ''
      },
      fileList1: [],
      fileList2: [],
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
      ],
      fileResume1: null,
      fileResume2: null,
      offerList: [],
      interview_round_no: []
    }
  },
  mixins: [mixins],
  created () {},
  watch: {
    applyInterviewVisible: function (val, old) {
      if (val) {
        if (!this.company.length) {
          this.pageInit()
        }
        this.item.publicStatus = this.publicStatus
        if (this.applyStatus) {
          console.log(11111, this.applyStatus, this.applyInternalData)
          const data = JSON.parse(JSON.stringify(this.applyInternalData))
          this.item.menteeName = data.menteeName
          this.item.company = data.companyId
          this.item.internalJobId = data.jobId || ''
          this.item.city = data.city
          this.item.division = data.division
          this.item.resultApply = data.resultApply
          this.item.applySeason = data.applySeason
          this.item.fullTimeType = data.fullTimeType
          this.item.internshipType = data.internshipType
          this.item.times = data.times
          this.item.difficultyLevel = data.difficultyLevel
          this.item.shield = data.shield
          this.item.storyBy = data.storyBy
          this.item.story = data.story
          this.item.remark = data.remark
          this.item.interviewDate = data.interviewDate
          this.item.resultVoucher = data.resultVoucher
          this.item.name = data.providerType == 'mentor' ? data.providerName : ''
          this.item.internalMentor = data.providerType == 'mentor' ? data.providerId : ''
          console.log(this.item)
          this.Topage()
        } else {
          this.Topage()
        }
      }
    }
  },
  methods: {
    async pageInit () {
      apiDic.getUserList().then(({ data }) => {
        console.log('人员列表', data)
        this.users = data
      })
      api.getCompanyList().then(res => {
        console.log('company', res)
        this.company = res.data
      })
      this.interview_round_no = await this.getDictionary('interview_round_no')
      this.apply_season = await this.getDictionary('apply_season')
      this.division = await this.getDictionary('division')
      this.country = await this.getDictionary('country')
      this.city = await this.getDictionary('city')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.internship_type = await this.getDictionary('internship_type')
      this.full_time_type = await this.getDictionary('full_time_type')
      apiDic.getAuditorListByApplyType('mentee_interview').then((res) => {
        console.log('mentee_interview', res.data)
        res.data.forEach((v) => {
          v.auditor = []
          v.confirmorArr.forEach((value) => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    Topage () {
      this.fileList1 = []
      this.fileList2 = []
      this.fileResume1 = null
      this.fileResume2 = null
    },
    close () {
      this.$emit('close')
      this.clear()
      this.fileList1 = []
      this.fileList2 = []
      this.fileResume1 = null
      this.fileResume2 = null
    },
    clear () {
      this.fileList1 = []
      this.fileList2 = []
      this.fileResume1 = null
      this.fileResume2 = null
      this.auditor = []
      this.item = {
        company: '',
        internalJobId: '',
        division: '',
        city: '',
        resultApply: '',
        interviewDate: '',
        applySeason: '',
        times: '',
        difficultyLevel: '',
        shield: '',
        publicStatus: '',
        internshipType: '',
        fullTimeType: '',
        storyBy: '',
        story: '',
        remark: '',
        companyName: '',
        divisionName: '',
        cityName: '',
        resultApplyName: ''
      }
    },
    change1 (file, fileList) {
      this.fileList1 = fileList.slice(-1)
      this.fileResume1 = file
    },
    remove1 () {
      this.fileResume1 = ''
      this.fileList1 = []
    },
    change2 (file, fileList) {
      this.fileList2 = fileList.slice(-1)
      this.fileResume2 = file
    },
    remove2 () {
      this.fileResume2 = ''
      this.fileList2 = []
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        if (!this.fileResume1 && !this.item.resultVoucher) {
          this.$message({
            type: 'error',
            message: '凭证必填'
          })
          return
        }
        if (!this.fileResume2 && !this.item.menteeNoticeVoucher) {
          this.$message({
            type: 'error',
            message: '学生通知截图必传'
          })
          return
        }
        if (this.item.name) {
          if (!this.item.internalMentor) {
            this.$message.error('当有内推导师输入时请点击查询匹配后选择！！')
            return false
          }
        }
        const approval = []
        let cannot = false
        this.auditorList.forEach((aa) => {
          if (!aa.auditor.length) {
            cannot = true
          }
          aa.auditor.forEach((v) => {
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
        const interview = {
          menteeName: this.menteeName,
          signId: this.signId,
          menteeId: this.menteeId,
          company: this.item.company,
          internalJobId: this.item.internalJobId,
          city: this.item.city,
          division: this.item.division,
          resultApply: this.item.resultApply,
          applySeason: this.item.applySeason,
          fullTimeType: this.item.resultApply == '1' ? this.item.fullTimeType : '',
          internshipType: this.item.resultApply == '0' ? this.item.internshipType : '',
          times: this.item.times,
          difficultyLevel: this.item.difficultyLevel,
          shield: this.item.shield,
          publicStatus: this.item.publicStatus,
          storyBy: this.item.storyBy,
          story: this.item.story,
          remark: this.item.remark,
          interviewDate: this.item.interviewDate,
          resultVoucher: '',
          internalMentor: this.item.name ? this.item.internalMentor : ''
        }
        for (let i = 0; i < this.internship_or_full_time.length; i++) {
          if (this.item.resultApply == this.internship_or_full_time[i].itemValue) {
            this.item.resultApplyName = this.internship_or_full_time[i].itemName
          }
        }
        for (let i = 0; i < this.company.length; i++) {
          if (this.item.company == this.company[i].companyId) {
            this.item.companyName = this.company[i].companyName
          }
        }
        for (let i = 0; i < this.division.length; i++) {
          if (this.item.division == this.division[i].itemValue) {
            this.item.divisionName = this.division[i].itemName
          }
        }
        for (let i = 0; i < this.city.length; i++) {
          if (this.item.city == this.city[i].itemValue) {
            this.item.cityName = this.city[i].itemName
          }
        }
        for (let i = 0; i < this.interview_round_no.length; i++) {
          if (this.item.times == this.interview_round_no[i].itemValue) {
            this.item.timesName = this.interview_round_no[i].itemName
          }
        }
        let fullTimeTypeName = ''
        for (var i in this.full_time_type) {
          if (this.full_time_type[i].itemValue == this.item.fullTimeType) {
            fullTimeTypeName = this.full_time_type[i].itemName
          }
        }
        let internshipTypeName = ''
        for (var i in this.internship_type) {
          if (this.internship_type[i].itemValue == this.item.internshipType) {
            internshipTypeName = this.internship_type[i].itemName
          }
        }
        let name = ''
        let nameValue = ''
        if (this.item.resultApply == '0') {
          name = '实习类型'
          nameValue = internshipTypeName
        } else if (this.item.resultApply == '1') {
          name = '全职类型'
          nameValue = fullTimeTypeName
        }
        if (this.item.storyBy) {
          console.log(1111111111111111111111111)
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].userId == this.item.storyBy) {
              console.log(22222222222222222222222222)
              this.item.storyNewName = this.users[i].userName
            }
          }
        } else {
          this.item.storyNewName = ''
        }
        const data = {
          applyType: 'mentee_interview',
          copyTo: [],
          keyId: this.signId,
          applyTitle: `学员【${this.menteeName}】(${this.item.companyName})的面试申请`,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '订单Id',
                value: this.signId
              },
              {
                label: '面试公司',
                value: this.item.companyName
              },
              {
                label: '面试部门',
                value: this.item.divisionName
              },
              {
                label: '城市',
                value: this.item.cityName
              },
              {
                label: '实习/全职',
                value: this.item.resultApplyName
              },
              {
                label: '面试时间',
                value: this.item.interviewDate
              },
              {
                label: '申请季',
                value: this.item.applySeason
              },
              {
                label: '面试轮次',
                value: this.item.timesName
              },
              {
                label: '面试难度',
                value: this.item.difficultyLevel
              },
              {
                label: '屏蔽学生学校',
                value: this.item.shield == '1' ? '是' : '否'
              },
              {
                label: '可宣传',
                value: this.item.publicStatus == '1' ? '是' : '否'
              },
              {
                label: '面经提供人',
                value: this.item.storyNewName || '无'
              },
              {
                label: '内推面试导师',
                value: this.item.name || '无'
              },
              {
                label: '面经',
                value: this.item.story
              },
              {
                label: '备注',
                value: this.item.remark
              }
            ],
            info: interview
          }
        }
        if (this.item.resultApply == '0' || this.item.resultApply == '1') {
          data.content.text.splice(5, 0, {
            label: name,
            value: nameValue
          })
        }
        console.log(data)
        let canGo = 0
        console.log(this.fileResume1, this.fileResume2)
        if (this.fileResume1) {
          canGo++
          uploadFunBySys(
            this.fileResume1.raw,
                `voucher/interview/${this.signId}`,
                url => {
                  data.content.file.push({
                    name: this.fileResume1.name,
                    url: url
                  })
                  data.content.info.resultVoucher = url
                  uploadFunBySys(
                    this.fileResume2.raw,
                    `voucher/interview_menteeNoticeVoucher/${this.signId}`,
                    url => {
                      data.content.file.push({
                        name: this.fileResume2.name,
                        url: url
                      })
                      data.content.info.menteeNoticeVoucher = url
                      canGo--
                      if (!canGo) {
                        console.log(data)
                        api.setRefund(data).then((res) => {
                          console.log('setStrategist，', res)
                          this.$message({
                            message: '发起申请成功',
                            type: 'success'
                          })
                          this.$emit('submit')
                          this.$loading().close()
                          this.clear()
                        })
                          .catch(err => {
                            this.$message({
                              message: '发起申请失败',
                              type: 'error'
                            })
                            console.log(err)
                          })
                      }
                    }
                  )
                }
          )
        }
      })
    },
    searchInputMentor (value) {
      if (!value) {
        this.$message({
          type: 'warning',
          message: '请输入导师全名~'
        })
        return
      }
      api.matchName(value).then(res => {
        console.log(res.data)
        if (!res.data.length) {
          this.$message({
            type: 'warning',
            message: '未找到匹配的导师'
          })
          return
        }
        this.mentorSearchList = res.data
        this.mentorListVisible = true
      })
      value = ''
    },
    mentorListClose () {
      this.mentorListVisible = false
      this.mentorSearchList = []
    },
    chooseMentor (i) {
      this.item.internalMentor = this.mentorSearchList[i].mentorId
      this.item.name = this.mentorSearchList[i].mentorName
      this.mentorListClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.add-offer-btn {
  margin: 15px;
  left: 150px;
  position: absolute;
  top: 0px;
}
.w80 {
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
