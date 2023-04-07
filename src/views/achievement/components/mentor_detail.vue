<!--
 * @Author: 库建华
 * @Date: 2020-03-10 10:20:19
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 09:57:49
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="'导师信息'"
      :visible.sync="mentorDetailVisible"
      width="1000px"
      :before-close="close"
    >
      <el-row class="mb10">
        <el-col :span="4" class="_item-name text-right">导师名:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.nickName}}</el-col>
        <el-col :span="4" class="_item-name text-right">性别:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.sex=='1'?'男':'女'}}</el-col>
        <el-col :span="4" class="_item-name text-right">学校（本科）:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.undergraduateSchoolName||'*'}}</el-col>
        <el-col :span="4" class="_item-name text-right">学校（研究生）:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.graduateSchoolName||'*'}}</el-col>
        <el-col :span="4" class="_item-name text-right">学校（博士）:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.phdSchoolName||'*'}}</el-col>
        <el-col :span="4" class="_item-name text-right">Company（任职）:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.companyName||'*'}}</el-col>
        <el-col :span="4" class="_item-name text-right">Location（任职）:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.locationName||'*'}}</el-col>
        <el-col :span="4" class="_item-name text-right">Division（任职）:</el-col>
        <el-col :span="4" class="_item-name text-left">{{mentorDetail.divisionName||'*'}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="mentorBusiness != 'businessFinance'">
          <el-col :span="4" class="_item-name text-right">country:</el-col>
          <el-col :span="20" class="_item-name text-left" v-if="mentorBusiness == 'businessTutoring'">{{mentorDetail.tutoringCountryName||'*'}}</el-col>
          <el-col :span="20" class="_item-name text-left" v-else-if="mentorBusiness == 'businessGp'">{{mentorDetail.gpCountryName||'*'}}</el-col>
          <el-col :span="20" class="_item-name text-left" v-else>{{mentorDetail.careerCountryName||'*'}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="mentorBusiness != 'businessFinance'">
        <el-col :span="4" class="_item-name text-right">track:</el-col>
        <el-col :span="20" class="_item-name text-left" v-if="mentorBusiness == 'businessTutoring'">{{mentorDetail.tutoringSubjectName}}</el-col>
        <el-col :span="20" class="_item-name text-left" v-else-if="mentorBusiness == 'businessGp'">{{mentorDetail.gpMajorName}}</el-col>
        <el-col :span="20" class="_item-name text-left" v-else>{{mentorDetail.trackName}}</el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="4" class="_item-name text-right">Specialties:</el-col>
        <el-col :span="20" class="_item-name text-left" v-if="mentorBusiness == 'businessFinance'">{{mentorDetail.financeProfile}}</el-col>
        <el-col :span="20" class="_item-name text-left" v-else-if="mentorBusiness == 'businessTutoring'">{{mentorDetail.tutoringProfile}}</el-col>
        <el-col :span="20" class="_item-name text-left" v-else-if="mentorBusiness == 'businessGp'">{{mentorDetail.gpProfile}}</el-col>
        <el-col :span="20" class="_item-name text-left" v-else>{{mentorDetail.specialties}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
export default {
  name: 'mentorDetail',
  props: {
    mentorDetailVisible: {
      type: Boolean,
      default: false
    },
    mentorBusiness: {},
    mentorData: {}
  },
  data () {
    return {
      mentorDetail: {}
    }
  },
  watch: {
    mentorDetailVisible: function (val) {
      if (val) {
        console.log(this.mentorBusiness)
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      api.getMentorDetailById(this.mentorData.mentorId).then(res => {
        console.log(res)
        this.mentorDetail = res.data
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.text-right {
  text-align: left;
  color: #666;
}
.text-left {
  text-align: left;
}
</style>
