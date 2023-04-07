<!--
 * @Author: 库建华
 * @Date: 2019-11-07 10:53:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-15 16:22:20
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      class="update-dialog"
      title="更新信息"
      :visible.sync="updateSignDataVisible"
      width="600px"
      :before-close="close"
    >
      <el-form :inline="true" ref="signTable" label-width="200px" :rules="rules" :model="signData1">
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="signData1.startDate"
            :style="{width:'230px'}"
            type="date"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="signData1.endDate"
            :style="{width:'230px'}"
            type="date"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="延长服务日期" prop="extendedEndDate">
          <el-date-picker
            v-model="signData1.extendedEndDate"
            :style="{width:'230px'}"
            type="date"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="1对多Office Hour" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="officeHourStrategistSession">
          <p v-if="signData1.officeHourStrategistSession == -1">不限 次/月</p>
          <el-input
            v-else
            :style="{width:'230px'}"
            v-model="signData1.officeHourStrategistSession"
          >
            <template slot="append">次/月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="创始人课程" v-if="signData.programType == 'basic'" prop="officeHourFounderFlag">
          <el-radio v-model="signData1.officeHourFounderFlag" label="Yes">Yes</el-radio>
          <el-radio v-model="signData1.officeHourFounderFlag" label="NO">NO</el-radio>
        </el-form-item>
        <el-form-item label="Jerry一对一课时" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="jerryHour">
          <p v-if="signData1.jerryHour == -1">不限 次/月</p>
          <el-input
            v-else
            :style="{width:'230px'}"
            v-model="signData1.jerryHour"
          >
            <template slot="append">次/月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Live Lessons（新）" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="liveLesson">
          <p :style="{width:'230px'}" v-if="signData1.liveLesson == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.liveLesson"></el-input-number>
        </el-form-item>
        <el-form-item label="系列课课时数" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="seriesHour">
          <p :style="{width:'230px'}" v-if="signData1.seriesHour == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.seriesHour"></el-input-number>
        </el-form-item>
        <el-form-item label="全职导师文书修改次数" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="applicationLetterModify">
          <p :style="{width:'230px'}" v-if="signData1.applicationLetterModify == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.applicationLetterModify"></el-input-number>
        </el-form-item>
        <el-form-item label="行业导师文书修改次数" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="mentorLetterModify">
          <p :style="{width:'230px'}" v-if="signData1.mentorLetterModify == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.mentorLetterModify"></el-input-number>
        </el-form-item>
        <el-form-item label="行业导师一对一（求职）" v-if="signData.programType == 'basic' || signData.programType == 'graduate_program'" prop="mentorHour">
          <p :style="{width:'230px'}" v-if="signData1.mentorHour == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.mentorHour"></el-input-number>
        </el-form-item>
        <el-form-item label="行业导师一对一（口语）" v-if="signData.programType == 'oral'" prop="oralLessonHour">
          <p :style="{width:'230px'}" v-if="signData1.oralLessonHour == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.oralLessonHour"></el-input-number>
        </el-form-item>
        <el-form-item label="行业导师一对一（财商）" v-if="signData.programType == 'finance'" prop="financeHour">
          <p :style="{width:'230px'}" v-if="signData1.financeHour == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.financeHour"></el-input-number>
        </el-form-item>
        <el-form-item label="心理课课时" v-if="signData.programType == 'basic' " prop="psychologyHour">
          <p :style="{width:'230px'}" v-if="signData1.psychologyHour == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.psychologyHour"></el-input-number>
        </el-form-item>
        <el-form-item label="人力资源课时" v-if="signData.programType == 'basic' " prop="humanResourceHour">
          <p :style="{width:'230px'}" v-if="signData1.humanResourceHour == -1">不限</p>
          <el-input-number v-else :controls="false" :style="{width:'230px'}" v-model="signData1.humanResourceHour"></el-input-number>
        </el-form-item>
        <el-form-item label="法律咨询" v-if="signData.programType == 'basic'" prop="hasLegalConsulting">
          <el-radio v-model="signData1.hasLegalConsulting" label="Yes">Yes</el-radio>
          <el-radio v-model="signData1.hasLegalConsulting" label="NO">NO</el-radio>
        </el-form-item>
        <el-form-item label="创业" v-if="signData.programType == 'basic'" prop="hasBusinessStartup">
          <el-radio v-model="signData1.hasBusinessStartup" label="Yes">Yes</el-radio>
          <el-radio v-model="signData1.hasBusinessStartup" label="NO">NO</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
export default {
  props: {
    updateSignDataVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ''
    },
    signData: {
      type: Object
    }
  },
  data: () => {
    return {
      signData1: {
        startDate: '',
        endDate: '',
        extendedEndDate: '',
        officeHourStrategistSession: 0,
        jerryHour: 0,
        liveLesson: 0,
        seriesHour: 0,
        mentorHour: 0,
        psychologyHour: 0,
        humanResourceHour: 0,
        hasLegalConsulting: '',
        officeHourFounderFlag:'',
        hasBusinessStartup: '',
        oralLessonHour: 0,
        financeHour: 0,
        applicationLetterModify: 0,
        mentorLetterModify: 0
      },
      rules: {
        startDate: [{ required: true, message: '必填', trigger: 'blur' }],
        endDate: [{ required: true, message: '必填', trigger: 'blur' }],
        extendedEndDate: [{ required: true, message: '必填', trigger: 'blur' }],
        officeHourStrategistSession: [{ required: true, message: '必填', trigger: 'blur' }],
        jerryHour: [{ required: true, message: '必填', trigger: 'blur' }],
        liveLesson: [{ required: true, message: '必填', trigger: 'blur' }],
        seriesHour: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        psychologyHour: [{ required: true, message: '必填', trigger: 'blur' }],
        humanResourceHour: [{ required: true, message: '必填', trigger: 'blur' }],
        hasLegalConsulting: [{ required: true, message: '必填', trigger: 'blur' }],
        officeHourFounderFlag: [{ required: true, message: '必填', trigger: 'blur' }],
        hasBusinessStartup: [{ required: true, message: '必填', trigger: 'blur' }],
        oralLessonHour: [{ required: true, message: '必填', trigger: 'blur' }],
        financeHour: [{ required: true, message: '必填', trigger: 'blur' }],
        applicationLetterModify: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorLetterModify: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    updateSignDataVisible: function (val, old) {
      if (val) {
        console.log(this.signData)
        this.signData1.startDate = this.signData.startDate
        this.signData1.endDate = this.signData.endDate
        this.signData1.extendedEndDate = this.signData.extendedEndDate
        this.signData1.officeHourStrategistSession = this.signData.officeHourStrategistSession
        this.signData1.jerryHour = this.signData.jerryHour
        this.signData1.liveLesson = this.signData.liveLesson
        this.signData1.seriesHour = this.signData.seriesHour
        this.signData1.mentorHour = this.signData.mentorHour || 0
        this.signData1.psychologyHour = this.signData.psychologyHour || 0
        this.signData1.humanResourceHour = this.signData.humanResourceHour || 0
        this.signData1.hasLegalConsulting = this.signData.hasLegalConsulting || ''
        this.signData1.officeHourFounderFlag = this.signData.officeHourFounderFlag || ''
        this.signData1.hasBusinessStartup = this.signData.hasBusinessStartup || ''

        this.signData1.oralLessonHour = this.signData.oralLessonHour || 0
        this.signData1.financeHour = this.signData.financeHour || 0
        this.signData1.applicationLetterModify = this.signData.applicationLetterModify || 0
        this.signData1.mentorLetterModify = this.signData.mentorLetterModify || 0
      }
    }
  },
  mounted () {
    this.signData1.startDate = this.signData.startDate
    this.signData1.endDate = this.signData.endDate
    this.signData1.extendedEndDate = this.signData.extendedEndDate
    this.signData1.officeHourStrategistSession = this.signData.officeHourStrategistSession
    this.signData1.jerryHour = this.signData.jerryHour
    this.signData1.liveLesson = this.signData.liveLesson
    this.signData1.seriesHour = this.signData.seriesHour
    this.signData1.mentorHour = this.signData.mentorHour || 0
    this.signData1.psychologyHour = this.signData.psychologyHour || 0
    this.signData1.humanResourceHour = this.signData.humanResourceHour || 0
    this.signData1.hasLegalConsulting = this.signData.hasLegalConsulting || ''
    this.signData1.officeHourFounderFlag = this.signData.officeHourFounderFlag || ''
    this.signData1.hasBusinessStartup = this.signData.hasBusinessStartup || ''
    this.signData1.oralLessonHour = this.signData.oralLessonHour || 0
    this.signData1.financeHour = this.signData.financeHour || 0
    this.signData1.applicationLetterModify = this.signData.applicationLetterModify || 0
    this.signData1.mentorLetterModify = this.signData.mentorLetterModify || 0
  },
  methods: {
    close () {
      this.$emit('close')
      this.$refs.signTable.resetFields()
    },
    submit () {
      console.log('submit')
      this.$refs.signTable.validate(valid => {
        if (!valid) return
        const data = {
          signId: this.signId,
          startDate: this.signData1.startDate,
          endDate: this.signData1.endDate,
          extendedEndDate: this.signData1.extendedEndDate,
          officeHourStrategistSession: this.signData1.officeHourStrategistSession,
          jerryHour: this.signData1.jerryHour,
          liveLesson: this.signData1.liveLesson,
          seriesHour: this.signData1.seriesHour,
          mentorHour: this.signData1.mentorHour,
          psychologyHour: this.signData1.psychologyHour,
          humanResourceHour: this.signData1.humanResourceHour,
          hasLegalConsulting: this.signData1.hasLegalConsulting,
          officeHourFounderFlag: this.signData1.officeHourFounderFlag,
          hasBusinessStartup: this.signData1.hasBusinessStartup,
          oralLessonHour: this.signData1.oralLessonHour,
          financeHour: this.signData1.financeHour,
          applicationLetterModify: this.signData1.applicationLetterModify,
          mentorLetterModify: this.signData1.mentorLetterModify
        }
        console.log(data)
        api.updateSignData2(data).then(res => {
           if(res.code == 20001){
            this.$message.error(res.message)
          }else{
            console.log('更新', res)
            this.$emit('submit')
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.update-dialog p{
    margin: 0px !important;
}
</style>
