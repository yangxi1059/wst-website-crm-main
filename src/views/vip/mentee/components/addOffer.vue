<!--
 * @Author: 库建华
 * @Date: 2019-07-24 15:11:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-07 11:33:31
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false" :withHeader="false" :visible.sync="addOfferVisible" size="650px" :before-close="close">
        <!-- 求职offer -->
        <el-form style="margin-top:20px" :rules="rules" :inline="true" v-if="programType == 'basic'" ref="form1" :model="item" label-width="130px">
          <el-form-item label="公司:" prop="company">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.company"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in company"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId + '&&' + item.companyName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门:" prop="division">
            <el-cascader
              size="small"
              :style="{width:'170px'}"
              v-model="item.division"
              filterable
              placeholder="请选择"
              :options="division"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="城市:" prop="city">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.city"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in city"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习/全职:" prop="resultApply">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.resultApply"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internship_or_full_time"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习类型:" v-if="item.resultApply == '0&&实习'" prop="internshipType">
            <el-select
              size="small"
              :style="{width:'170px'}"
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
          <el-form-item label="全职类型:" v-if="item.resultApply == '1&&全职'" prop="fullTimeType">
            <el-select
              size="small"
              :style="{width:'170px'}"
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
          <el-form-item label="薪资Base:" prop="offerBase">
            <el-input size="small" v-model="item.offerBase" :style="{width:'170px'}" placeholder="请输入" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="薪资Bonus:" prop="offerBonus">
            <el-input size="small" v-model="item.offerBonus" :style="{width:'170px'}" placeholder="请输入" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="offer年薪/万(￥):" prop="offerSalary">
            <el-input-number
              size="small"
              :controls="false"
              v-model="item.offerSalary"
              :style="{width:'170px'}"
              placeholder="请输入年薪"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="项目周期:" prop="programPeriod">
            <el-input  size="small" :style="{width:'170px'}" v-model="item.programPeriod"></el-input>
          </el-form-item>
          <el-form-item label="准备周期（月）:" prop="prepareMonth">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.prepareMonth"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 36" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获得offer日期:" prop="offerReceiveDate">
            <el-date-picker
            size="small"
              :style="{width:'170px'}"
              value-format="yyyy-MM-dd"
              v-model="item.offerReceiveDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="屏蔽学生学校:" prop="shield">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.shield"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shield"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可宣传:" prop="publicStatus">
            <el-select
              :disabled="publicStatus == '0&&否'"
              size="small"
              :style="{width:'170px'}"
              v-model="item.publicStatus"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shield"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请季:" prop="applySeason">
            <el-select
                size="small"
              :style="{width:'170px'}"
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
          </el-form-item>
          <el-form-item label="Offer类型:" prop="offerFrom">
            <el-select
            size="small"
              :style="{width:'170px'}"
              :disabled="applyStatus"
              v-model="item.offerFrom"
              filterable
              @change="changeOfferFrom(item.offerFrom)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in offer_from"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="不计Offer分导师" prop="ignoreMentors">
            <el-select size="small"  :style="{width:'170px'}"  v-model="item.ignoreMentors" clear multiple placeholder="请选择">
              <el-option
                v-for="(item,i) in optionsMentor"
                :key="item.mentorId + i"
                :label="item.mentorName"
                :value="item.mentorId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内推导师:" v-if="item.offerFrom == 'offer_from_internal'" >
            <div >
              <el-input :disabled="applyStatus" size="small" class="mr10"  v-model="item.name" :style="{width:'170px'}" placeholder="请输入精确导师名"></el-input>
              <el-button v-if="!applyStatus" size="small" type="primary" @click="searchInputMentor(item.name)">查询匹配</el-button>
            </div>
          </el-form-item>
          <el-form-item label="社团:" >
            <el-input
              size="small"
              v-model="communityNew"
              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'470px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="小故事:" prop="story">
            <el-input
              size="small"
              v-model="item.story"
              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'470px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              size="small"
              v-model="item.remark"
              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'470px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="凭证:" >
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList1"
              :on-change="change1"
              :style="{width:'320px'}"
              drag
            >
              <span class="el-icon-upload"></span>
              <el-button size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="好评图:">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList2"
              :on-change="change2"
              :style="{width:'320px'}"
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
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList3"
              :on-change="change3"
              :style="{width:'320px'}"
              drag
            >
              <span class="el-icon-upload"></span>
              <el-button size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>

          <template >
            <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
              <el-select
                :style="{width:'360px'}"
                size="small"
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
          </template>
          <el-form-item label=" ">
            <el-button
                class="el-icon-circle-check-outline"
                type="primary"
                size="small"
                @click="submit(item)"
            >提交</el-button>
          </el-form-item>
        </el-form>
        <!-- 升学offer -->
        <el-form style="margin-top:20px" :rules="rules2" :inline="true" v-else ref="form" :model="item" label-width="130px" >
          <el-form-item label="类别:" prop="entranceType">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.entranceType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in entrance_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业项目:" prop="entranceOfferProgram">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.entranceOfferProgram"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in entrance_offer_program"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="offer学校:" prop="schoolId">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.schoolId"
              filterable
              placeholder="请选择"
              @change="getAcademyBySchoolId(item)"
            >
              <el-option
                v-for="item in school"
                :key="item.schoolId"
                :label="item.chiName"
                :value="item.schoolId+'&&'+item.chiName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院:">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.instituteId"
              filterable
              @change="handleChoose()"
              placeholder="请选择"
            >
              <el-option
                v-for="item in institute"
                :key="item.instituteId"
                :label="item.instituteChiName"
                :value="item.instituteId + '&&' + item.instituteChiName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="准备周期（月）:" prop="prepareMonth">
            <el-select
              size="small"
              :style="{width:'170px'}"
              v-model="item.prepareMonth"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 36" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获得offer日期:" prop="offerReceiveDate">
            <el-date-picker
              :style="{width:'170px'}"
              size="small"
              value-format="yyyy-MM-dd"
              v-model="item.offerReceiveDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="屏蔽学生学校:" prop="shield">
            <el-select
              :style="{width:'170px'}"
              size="small"
              v-model="item.shield"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shield"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可宣传:" prop="publicStatus">
            <el-select
              :disabled="publicStatus == '0&&否'"
              :style="{width:'170px'}"
              size="small"
              v-model="item.publicStatus"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shield"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请季:" prop="applySeason">
            <el-select
              :style="{width:'170px'}"
              size="small"
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
          </el-form-item>
          <el-form-item label="小故事:" prop="story">
            <el-input
              v-model="item.story"
              size="small"
              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'470px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="item.remark"
              size="small"

              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'470px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="凭证:">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList1"
              :on-change="change1"
              :style="{width:'320px'}"
              drag
            >
              <span class="el-icon-upload"></span>
              <el-button size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="好评图:">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList2"
              :on-change="change2"
              :style="{width:'400px'}"
              drag
            >
              <span class="el-icon-upload"></span>
              <el-button size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item

            :label="item.confirmCol"
            v-for="(item,index) in eduAuditorList"
            :key="index"
          >
            <el-select
              :style="{width:'360px'}"
              size="small"
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
          <el-form-item label=" ">
            <el-button
              class="el-icon-circle-check-outline"
              type="primary"
              size="small"
              @click="eduSubmit(item)"
            >提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
      title="行业导师"
      :visible.sync="mentorListVisible"
      :close-on-click-modal="false"
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
import file, { uploadFunBySys } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  props: {
    addOfferVisible: {
      type: Boolean,
      default: false
    },
    publicStatus: {},
    signId: {
      type: String,
      default: ''
    },
    community: {
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
    programType: {},
    programPeriod: {
      type: String,
      default: ''
    },
    schoolName: {
      type: String,
      default: ''
    },
    hignSchoolName: {
      type: String,
      default: ''
    },
    menteeInfo: {},
    applyInternalData: {
      type: Object
    },
    applyStatus: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      company: [],
      division: [],
      city: [],
      internship_or_full_time: [],
      resultApply2: ['实习', '全职'],
      shield2: ['否', '是'],
      shield: [],
      apply_season: [],
      communityNew: '',
      mentorListVisible: false,
      entrance_type: [],
      entrance_offer_program: [],
      mentorSearchList: [],
      full_time_type: [],
      internship_type: [],
      school: [],
      optionsMentor: [],
      institute: [],
      applyInterviewStoryVisible: false,
      resultConfirm: ['未确认', '已确认', '审核未通过'],
      interviewData: {},
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileResume1: null,
      fileResume2: null,
      fileResume3: null,
      offer_from: [],
      pkId: 0,
      item: {
        instituteId: '',
        company: '',
        division: '',
        resultApply: '',
        resultType: '',
        applySeason: '',
        offerFrom: '',
        offerReceiveDate: '',
        programPeriod: '',
        prepareMonth: '',
        offerSalary: '',
        offerBase: '',
        offerBonus: '',
        shield: '',
        publicStatus: '',
        story: '',
        remark: '',
        fullTimeType: '',
        internshipType: '',
        resultVoucher: '',
        praiseVoucher: '',
        ignoreMentors: '',
        internalMentor: ''
      },
      approval: [],
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
      eduAuditorList: [
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
      rules: {
        city: [{ required: true, message: '必填', trigger: 'blur' }],
        offerReceiveDate: [{ required: true, message: '必填', trigger: 'blur' }],
        programPeriod: [{ required: true, message: '必填', trigger: 'blur' }],
        prepareMonth: [{ required: true, message: '必填', trigger: 'blur' }],
        offerSalary: [{ required: true, message: '必填', trigger: 'blur' }],
        offerBase: [{ required: true, message: '必填', trigger: 'blur' }],
        offerBonus: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        company: [{ required: true, message: '必填', trigger: 'blur' }],
        publicStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        shield: [{ required: true, message: '必填', trigger: 'blur' }],
        offerFrom: [{ required: true, message: '必填', trigger: 'blur' }],
        resultApply: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rules2: {
        entranceType: [{ required: true, message: '必填', trigger: 'blur' }],
        entranceOfferProgram: [{ required: true, message: '必填', trigger: 'blur' }],
        schoolId: [{ required: true, message: '必填', trigger: 'blur' }],
        prepareMonth: [{ required: true, message: '必填', trigger: 'blur' }],
        offerReceiveDate: [{ required: true, message: '必填', trigger: 'blur' }],
        shield: [{ required: true, message: '必填', trigger: 'blur' }],
        publicStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        story: [{ required: true, message: '必填', trigger: 'blur' }],
        remark: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mixins: [mixins],
  mounted () {

  },
  watch: {
    addOfferVisible: function (val) {
      if (val) {
        if (!this.company.length) {
          this.pageInit()
        }
        if (this.programType == 'basic') {
          this.addOffer()
        } else {
          this.addEduOffer()
        }
        this.item.publicStatus = this.publicStatus
        if (this.applyStatus) {
          console.log(11111, this.applyStatus, this.applyInternalData)
          const data = JSON.parse(JSON.stringify(this.applyInternalData))
          this.item.offerFrom = 'offer_from_internal'
          this.item.internalMentor = data.internalMentor
          this.item.name = data.providerType == 'mentor' ? data.providerName : ''
          this.item.internalMentor = data.providerType == 'mentor' ? data.providerId : ''
        } else {
          const data = JSON.parse(JSON.stringify(this.applyInternalData))
          this.item.offerFrom = 'offer_from_train'
          this.Topage()
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.company = await this.getCompany()
      this.school = await this.getSchool('school')
      this.city = await this.getDictionary('city')
      this.apply_season = await this.getDictionary('apply_season')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.shield = await this.getDictionary('common_yes_or_no')
      this.entrance_type = await this.getDictionary('entrance_type')
      this.entrance_offer_program = await this.getDictionary('entrance_offer_program')
      this.offer_from = await this.getDictionary('offer_from')
      this.full_time_type = await this.getDictionary('full_time_type')
      this.internship_type = await this.getDictionary('internship_type')
      apiDic.getParentAndChildrenDic({ parentDic: 'basic_division', dicLabel: 'division' }).then(res => {
        console.log('获取父子字典：', res.data)
        this.division = res.data.map(item => {
          item.children.forEach(v => {
            v.value = v.value + '&&' + v.label
          })
          return item
        })
      })
      apiDic.getAuditorListByApplyType('offer_apply').then(res => {
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
      console.log(this.signId, 11111111111)
      api.getMentorListBySignIdset(this.signId).then(res => {
        this.optionsMentor = res.data
      })
    },
    Topage () {
      console.log(this.programType, 3222222222312321)
      this.fileList1 = []
      this.fileList2 = []
      this.fileList3 = []
      this.fileResume1 = null
      this.fileResume2 = null
      this.fileResume3 = null
      this.communityNew = this.community
    },
    close () {
      this.$emit('close')
      this.approval = []
      this.item = {
        instituteId: '',
        company: '',
        division: '',
        resultApply: '',
        resultType: '',
        applySeason: '',
        offerFrom: '',
        offerReceiveDate: '',
        programPeriod: '',
        prepareMonth: '',
        offerSalary: '',
        offerBase: '',
        offerBonus: '',
        shield: '',
        publicStatus: '',
        story: '',
        remark: '',
        fullTimeType: '',
        internshipType: '',
        resultVoucher: '',
        praiseVoucher: '',
        ignoreMentors: '',
        internalMentor: ''
      }
      this.fileList1 = []
      this.fileList2 = []
      this.fileList3 = []
      this.fileResume1 = null
      this.fileResume2 = null
      this.fileResume3 = null
    },
    download (val) {
      file.preview(val)
    },
    offerClose () {
      this.applyInterviewStoryVisible = false
    },
    offerSubmit () {
      this.applyInterviewStoryVisible = false
      this.Topage()
    },
    change1 (file, fileList) {
      this.fileList1 = fileList.slice(-1)
      this.fileResume1 = file
    },
    change2 (file, fileList) {
      this.fileList2 = fileList.slice(-1)
      this.fileResume2 = file
    },
    change3 (file, fileList) {
      this.fileList3 = fileList.slice(-1)
      this.fileResume3 = file
    },
    // 录入信息，确认
    submit (item) {
      console.log('submit', item)
      this.$refs.form1.validate((valid) => {
        if (valid) {
          if (item.offerSalary == 0 || item.offerSalary) {
          } else {
            this.$message.error('offer年薪必填')
            return false
          }
          if (!item.applySeason) {
            this.$message.error('申请季必填')
            return false
          }
          if (item.name) {
            if (!item.internalMentor) {
              this.$message.error('当有内推导师输入时请点击查询匹配后选择！！')
              return false
            }
          }
          if (!this.fileResume1 || !this.fileResume2 || !this.fileResume3) {
            this.$message({
              type: 'error',
              message: '凭证/好评图/学生通知截图必填'
            })
            return
          }
          if (item.resultApply.split('&&')[0] == '0') {
            if (!item.internshipType) {
              this.$message.error('实习类型必填')
              return
            }
          } else if (item.resultApply.split('&&')[0] == '1') {
            if (!item.fullTimeType) {
              this.$message.error('全职类型必填')
              return
            }
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
          let offerFromName = ''
          for (var i in this.offer_from) {
            if (this.offer_from[i].itemValue == item.offerFrom) {
              offerFromName = this.offer_from[i].itemName
            }
          }
          let fullTimeTypeName = ''
          for (var i in this.full_time_type) {
            if (this.full_time_type[i].itemValue == item.fullTimeType) {
              fullTimeTypeName = this.full_time_type[i].itemName
            }
          }
          let internshipTypeName = ''
          for (var i in this.internship_type) {
            if (this.internship_type[i].itemValue == item.internshipType) {
              internshipTypeName = this.internship_type[i].itemName
            }
          }
          let name = ''
          let nameValue = ''
          if (item.resultApply.split('&&')[0] == '0') {
            name = '实习类型'
            nameValue = internshipTypeName
          } else if (item.resultApply.split('&&')[0] == '1') {
            name = '全职类型'
            nameValue = fullTimeTypeName
          }
          let ignoreMentorsString = ''
          const ignoreMentors2 = JSON.parse(JSON.stringify(item.ignoreMentors))
          console.log(this.optionsMentor, ignoreMentors2, 4444444444444444444444)
          for (let i = 0; i < this.optionsMentor.length; i++) {
            for (let j = 0; j < ignoreMentors2.length; j++) {
              if (ignoreMentors2[j] == this.optionsMentor[i].mentorId) {
                ignoreMentorsString += `${this.optionsMentor[i].mentorName},`
              }
            }
          }
          console.log(ignoreMentorsString, 5555555555555555555555555)
          this.$loading()
          const data = {
            applyType: 'offer_apply',
            keyId: this.signId,
            applyTitle: `学员【${this.menteeName}】(${
              item.company.split('&&')[1]
            })的求职offer审核`,
            approval: approval,
            copyTo: [],
            voucher: [],
            content: {
              file: [],
              text: [
                {
                  label: '学历',
                  value: this.menteeInfo.degreeName
                },

                {
                  label: '学校（本科）',
                  value: this.schoolName
                },
                {
                  label: '学校（高中）',
                  value: this.hignSchoolName
                },
                {
                  label: '公司',
                  value: item.company.split('&&')[1]
                },
                {
                  label: '部门',
                  value: item.division ? item.division[1].split('&&')[1] : '无'
                },
                {
                  label: '城市',
                  value: item.city.split('&&')[1]
                },
                {
                  label: '实习/全职',
                  value: item.resultApply.split('&&')[1]
                },

                {
                  label: '屏蔽学生学校',
                  value: item.shield.split('&&')[1]
                },
                {
                  label: '可宣传',
                  value: item.publicStatus.split('&&')[1]
                },
                {
                  label: '项目周期',
                  value: item.programPeriod
                },
                {
                  label: '准备周期',
                  value: item.prepareMonth + '月'
                },
                {
                  label: '获得offer日期',
                  value: item.offerReceiveDate
                },
                {
                  label: 'offer年薪/万(￥)',
                  value: item.offerSalary
                },
                {
                  label: '薪资Base',
                  value: item.offerBase
                },
                {
                  label: '薪资Bonus',
                  value: item.offerBonus
                },
                {
                  label: '申请季',
                  value: item.applySeason
                },
                {
                  label: '内推导师',
                  value: item.name || '无'
                },
                {
                  label: '不计入offer分导师',
                  value: ignoreMentorsString || '无'
                },
                {
                  label: '求职Offer类型',
                  value: offerFromName
                },
                {
                  label: '小故事',
                  value: item.story || '无'
                },
                {
                  label: '备注',
                  value: item.remark || '无'
                }
              ],
              info: {
                signId: this.signId,
                menteeInfo: {
                  menteeId: this.menteeId,
                  community: this.communityNew
                },
                menteeId: this.menteeId,
                company: item.company.split('&&')[0],
                city: item.city.split('&&')[0],
                division: item.division ? item.division[1].split('&&')[0] : '',
                resultApply: item.resultApply.split('&&')[0],
                resultType: '1',
                applySeason: item.applySeason,
                offerFrom: item.offerFrom,
                offerReceiveDate: item.offerReceiveDate,
                programPeriod: item.programPeriod,
                prepareMonth: item.prepareMonth,
                offerSalary: item.offerSalary,
                offerBase: item.offerBase,
                offerBonus: item.offerBonus,
                shield: item.shield.split('&&')[0],
                publicStatus: item.publicStatus.split('&&')[0],
                story: item.story,
                remark: item.remark || '',
                fullTimeType: item.resultApply.split('&&')[0] == '1' ? item.fullTimeType : '',
                internshipType: item.resultApply.split('&&')[0] == '0' ? item.internshipType : '',
                resultVoucher: item.resultVoucher,
                praiseVoucher: item.praiseVoucher,
                ignoreMentors: item.ignoreMentors.join(','),
                internalJobId: this.applyInternalData.jobId || '',
                internalMentor: item.name ? item.internalMentor : ''
              }
            }
          }
          if (item.resultApply.split('&&')[0] == '0' || item.resultApply.split('&&')[0] == '1') {
            data.content.text.splice(4, 0, {
              label: name,
              value: nameValue
            })
          }
          if (this.menteeInfo.graduateSchoolName) {
            data.content.text.splice(2, 0, {
              label: '学校（研究生）',
              value: this.menteeInfo.graduateSchoolName
            })
          }
          console.log(data, 33333333333333333333333)
          let canGo = 0
          if (this.fileResume1) {
            canGo++
            uploadFunBySys(
              this.fileResume1.raw,
              `voucher/offer/${this.signId}_${~~(Math.random() * 1000)}`,
              url => {
                console.log(url, data)
                data.content.file.unshift({ name: '凭证', url: url })
                data.content.info.resultVoucher = url
                data.voucher.unshift({ voucherName: '凭证', voucherPath: url })
                console.log('凭证参数', data)
                canGo--
                if (!canGo) {
                  this.submitCommon(data)
                }
              }
            )
          }
          if (this.fileResume2) {
            canGo++
            uploadFunBySys(
              this.fileResume2.raw,
              `good_figure/offer/${this.signId}_${~~(Math.random() * 1000)}`,
              url => {
                console.log(url)
                data.content.file.push({ name: '好评图', url: url })
                data.content.info.praiseVoucher = url
                data.voucher.unshift({ voucherName: '好评图', voucherPath: url })
                console.log('好评图参数', data)
                canGo--
                if (!canGo) {
                  this.submitCommon(data)
                }
              }
            )
          }
          if (this.fileResume3) {
            canGo++
            uploadFunBySys(
              this.fileResume3.raw,
              `good_figure/offer/${this.signId}_${~~(Math.random() * 1000)}`,
              url => {
                console.log(url)
                data.content.file.push({ name: '学生通知截图', url: url })
                data.content.info.menteeNoticeVoucher = url
                data.voucher.unshift({ voucherName: '学生通知截图', voucherPath: url })
                console.log('学生通知截图参数', data)
                canGo--
                if (!canGo) {
                  this.submitCommon(data)
                }
              }
            )
          }
        }
      })
    },
    // 录入信息，确认 升学offer
    eduSubmit (item) {
      console.log('eduSubmit', item)
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (
            item.entranceType == 'internal_transfer&&内部转院/学' &&
            !item.instituteId
          ) {
            this.$message({
              type: 'error',
              message: '类别为（内部转院/学）时，学院必填!'
            })
            return
          }
          if (!this.fileResume1 || !this.fileResume2) {
            this.$message({
              type: 'error',
              message: '凭证/好评图必填'
            })
            return
          }
          const approval = []
          let cannot = false
          this.eduAuditorList.forEach(aa => {
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
          this.$loading()
          const data = {
            keyId: this.signId,
            applyType: 'entrance_offer_apply',
            applyTitle: `学员【${this.menteeName}】(${
              item.schoolId.split('&&')[1]
            })的升学offer审核`,
            approval: approval,
            copyTo: [],
            voucher: [],
            content: {
              file: [],
              text: [
                {
                  label: '学历',
                  value: this.menteeInfo.degreeName
                },
                {
                  label: '学校（本科）',
                  value: this.schoolName
                },
                {
                  label: '学校（高中）',
                  value: this.hignSchoolName
                },
                {
                  label: '类别',
                  value: item.entranceType.split('&&')[1]
                },
                {
                  label: '专业项目',
                  value: item.entranceOfferProgram.split('&&')[1]
                },
                {
                  label: 'offer学校',
                  value: item.schoolId ? item.schoolId.split('&&')[1] : '无'
                },
                {
                  label: '学院',
                  value: item.instituteId ? item.instituteId.split('&&')[1] : '无'
                },
                {
                  label: '屏蔽学生学校',
                  value: item.shield.split('&&')[1]
                },
                {
                  label: '可宣传',
                  value: item.publicStatus.split('&&')[1]
                },
                {
                  label: '准备周期',
                  value: item.prepareMonth + '月'
                },
                {
                  label: '获得offer日期',
                  value: item.offerReceiveDate
                },
                {
                  label: '申请季',
                  value: item.applySeason
                },
                {
                  label: '小故事',
                  value: item.story
                },
                {
                  label: '备注',
                  value: item.remark || '无'
                }
              ],
              info: {
                signId: this.signId,
                menteeId: this.menteeId,
                entranceType: item.entranceType.split('&&')[0],
                entranceOfferProgram: item.entranceOfferProgram.split('&&')[0],
                instituteId: item.instituteId
                  ? item.instituteId.split('&&')[0]
                  : '',
                schoolId: item.schoolId ? item.schoolId.split('&&')[0] : '',
                resultType: '1',
                applySeason: item.applySeason,
                offerReceiveDate: item.offerReceiveDate,
                prepareMonth: item.prepareMonth,
                shield: item.shield.split('&&')[0],
                publicStatus: item.publicStatus.split('&&')[0],
                story: item.story,
                remark: item.remark || '',
                resultVoucher: item.resultVoucher,
                praiseVoucher: item.praiseVoucher

              }
            }
          }
          if (this.menteeInfo.graduateSchoolName) {
            data.content.text.splice(2, 0, {
              label: '学校（研究生）',
              value: this.menteeInfo.graduateSchoolName
            })
          }
          console.log(data)
          let canGo = 0
          if (this.fileResume1) {
            console.log(this.fileResume1)
            canGo++
            uploadFunBySys(
              this.fileResume1.raw,
              `voucher/offer/${this.signId}`,
              url => {
                console.log(url)
                console.log(data, 22222222222222)
                data.content.file.unshift({ name: '凭证', url: url })
                data.content.info.offerVoucher = url
                data.voucher.unshift({ voucherName: '凭证', voucherPath: url })
                console.log('凭证参数', data)
                canGo--
                if (!canGo) {
                  this.submitCommon(data)
                }
              }
            )
          }
          if (this.fileResume2) {
            console.log(this.fileResume2)
            canGo++
            uploadFunBySys(
              this.fileResume2.raw,
              `good_figure/offer/${this.signId}`,
              url => {
                console.log(url)
                data.content.file.push({ name: '好评图', url: url })
                data.content.info.praiseVoucher = url
                data.voucher.unshift({ voucherName: '好评图', voucherPath: url })
                console.log('好评图参数', data)
                canGo--
                if (!canGo) {
                  this.submitCommon(data)
                }
              }
            )
          }
        }
      })
    },

    // 利用通用接口
    submitCommon (data) {
      console.log(data, 'yx******提交升学Offer')
      api
        .addOfferApply(data)
        .then(res => {
          console.log('提交后', res)
          this.$message({
            type: 'success',
            message: '提交成功,可在申请列表查看'
          })
          this.$loading().close()
          this.$emit('submit')
          this.close()
        })
        .catch(err => {
          console.log('提交后', err)
          this.$message({
            type: 'error',
            message: '提交失败'
          })
          this.$loading().close()
          this.close()
        })
    },

    addOffer () {
      apiDic.getAuditorListByApplyType('offer_apply').then(res => {
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
    addEduOffer () {
      apiDic.getAuditorListByApplyType('entrance_offer_apply').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.eduAuditorList = [...res.data]
      })
    },
    cancel () {
      this.Topage()
    },
    changeOfferFrom (value) {
      console.log(value, 11111111111)
      if (value == 'offer_from_train') {
        this.item.name = ''
        this.item.internalMentor = ''
      }
    },
    getAcademyBySchoolId (item) {
      console.log(item)
      item.instituteId = null
      if (item.schoolId) {
        apiDic.getAcademyBySchoolId(item.schoolId.split('&&')[0]).then(res => {
          console.log(res.data)
          this.institute = res.data
        })
      }
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
      this.searchMentorVisible = false
      this.item.internalMentor = this.mentorSearchList[i].mentorId
      this.item.name = this.mentorSearchList[i].mentorName
      this.mentorListClose()
    },
    handleChoose () {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-popover--plain{
  white-space:pre !important
}
.el-form--inline .el-form-item{
  margin: 0px 0 10px 0;
}
.add-offer-btn {
  margin-left: 10px;
//   margin: 15px;
//   left: 150px;
//   position: absolute;
//   top: 0px;
}
// .add-edu-offer-btn {
//   left: 300px;
// }
.w80 {
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.w160 {
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
