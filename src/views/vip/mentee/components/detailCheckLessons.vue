<!--
 * @Author: 杨曦
 * @Date: 2022-03-15 16:15:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-12 10:08:58
 * @Version:
 * @Description:
-->
<template>
  <div class="inputInformation">
    <el-dialog
      title="详情"
      class="info yx_detail"
      :close-on-click-modal="false"
      :visible.sync="detailVisible"
      width="1200px"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <div v-loading="loading">
        <el-descriptions title="签约信息" class="mb20" direction="vertical" :column="3" border>
          <el-descriptions-item label="学员ID">{{lessonInfo.menteeId|| '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="学员姓名">{{lessonInfo.menteeName || '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="行业导师姓名">{{lessonInfo.mentorNames || '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="行业导师课时数">{{lessonInfo.mentorHour|| '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="签约ID">{{lessonInfo.signId|| '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="规划导师">{{lessonInfo.strategistName|| '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="PM">{{lessonInfo.serviceName|| '暂无'}}</el-descriptions-item>
          <el-descriptions-item label="项目名">{{lessonInfo.programName || '暂无'}}</el-descriptions-item>
        </el-descriptions>
        <div class="yx_block_check1" v-if="lessonInfo.mentorArr && lessonInfo.mentorArr.length > 0">
          <el-card  class="box-card yx_block_check mb20" v-for="(item,i) in lessonInfo.mentorArr" :key="i" >
            <div slot="header" class="clearfix">
              <span style="line-height:34px" v-if="item.status == 1 || item.status == 2">导师{{item.mentorName}}的{{item.status == 1?'正式课':'预排课'}}({{item.businessTypeName}})</span>
              <div style="float: right; padding: 3px 0" v-if="item.status == 2 && item.signSchedule.checkStatus == 'pending'">
                <el-button @click="success('1', item.signSchedule.pkId)" size="mini" type="primary">通过</el-button>
                <el-button @click="success('0', item.signSchedule.pkId)" size="mini" type="danger">不通过</el-button>
              </div>
            </div>
            <div  class="" >
              <el-descriptions class="yx_block_check2 mb10" direction="vertical" :column="4" border>
                <el-descriptions-item label="导师姓名" :span="1">{{item.mentorName || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="所在公司" :span="1">{{item.companyName || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="行业方向" :span="1">{{item.trackListName || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="计划课时" :span="1">{{item.signLesson || '暂无'}}</el-descriptions-item>
              </el-descriptions>
              <div class="yx_block_check3" v-if="item.lessonArr && item.lessonArr.length > 0"   >
                <el-descriptions direction="vertical" :column="4" border  v-for="(item2,k) in item.lessonArr" :key="k">
                  <el-descriptions-item label="上课日期" :span="1" >{{item2.lessonDate || '暂无'}}</el-descriptions-item>
                  <el-descriptions-item label="课程名称" :span="1" >{{item2.lessonName || '暂无'}}</el-descriptions-item>
                  <el-descriptions-item label="课时" :span="1" >{{item2.lessonHours || '暂无'}}</el-descriptions-item>
                  <el-descriptions-item label="课程状态" :span="1" >{{item2.lessonStatusName || '暂无'}}</el-descriptions-item>
                </el-descriptions>
              </div>
              <div class="yx_block_check3" v-if="(item.lessonArr && item.lessonArr.length == 0 && item.signSchedule) || (!item.lessonArr && item.signSchedule)"   >
                <div v-if="item.signSchedule.scheduleContentNew && item.signSchedule.scheduleContentNew.length > 0">
                  <el-descriptions direction="vertical" :column="4" border  v-for="(itemNew,m) in item.signSchedule.scheduleContentNew" :key="m">
                    <el-descriptions-item label="上课日期" :span="1" >{{itemNew.lessonDate || '暂无'}}</el-descriptions-item>
                    <el-descriptions-item label="内容涵盖" :span="1" >
                      <div v-if="itemNew.lessonContentTypeArr && itemNew.lessonContentTypeArr.length>0">
                        <span v-for="(itemType,n) in itemNew.lessonContentTypeArr" :key="n">{{itemType.contentType}},</span>
                      </div>
                      <div v-else>暂无</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="课时" :span="1" >{{itemNew.lessonHours || '暂无'}}</el-descriptions-item>
                    <el-descriptions-item label="核验状态" :span="1" >{{item.signSchedule.checkStatusName || '暂无'}}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import * as jsCookie from 'js-cookie'
export default {
  name: 'editUser',
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    signId: {},
    pkId: {}
  },
  data () {
    return {
      lessonInfo: {
        signId: '',
        menteeId: '',
        wxId: '',
        programName: '',
        serviceName: '',
        mentorHour: '',
        mentorNames: '',
        mentorArr: [
          {
            mentorArr: [],
            signSchedule: {
              scheduleContentNew: {
                lessonDate: '',
                lessonHours: '',
                lessonContentTypeArr: []
              },
              checkStatusName: ''
            }
          }]
      },
      lessonArr: [],
      signSchedule: {},
      loading: false
    }
  },
  mounted () {
  },
  watch: {
    detailVisible: function (newData) {
      if (newData) {
        this.topage()
      }
    }
  },
  methods: {
    topage () {
      this.loading = true
      this.lessonInfo = {
        signId: '',
        menteeId: '',
        wxId: '',
        programName: '',
        serviceName: '',
        mentorHour: '',
        mentorNames: '',
        mentorArr: [
          {
            mentorArr: [],
            signSchedule: {
              scheduleContentNew: {
                lessonDate: '',
                lessonHours: '',
                lessonContentTypeArr: []
              },
              checkStatusName: ''
            }
          }]
      }
      if (this.signId) {
        api.detailCheckLessonsBySignId(this.signId).then(res => {
          res.data.mentorArr && res.data.mentorArr.forEach(item => {
            if (item.lessonArr && item.lessonArr.length > 0) {
              item.status = 1
            } else if ((item.lessonArr && item.lessonArr.length == 0 && item.signSchedule) || (!item.lessonArr && item.signSchedule)) {
              if (item.signSchedule.scheduleContent) {
                item.signSchedule.scheduleContentNew = JSON.parse(item.signSchedule.scheduleContent)
                item.status = 2
              } else {
                item.status = 3
              }
            }
          })
          this.lessonInfo = res.data
          console.log(this.lessonInfo, 222222222)
          this.loading = false
        })
      }
      if (this.pkId) {
        api.detailCheckLessons(this.pkId).then(res => {
          res.data.mentorArr && res.data.mentorArr.forEach(item => {
            if (item.lessonArr && item.lessonArr.length > 0) {
              item.status = 1
            } else if ((item.lessonArr && item.lessonArr.length == 0 && item.signSchedule) || (!item.lessonArr && item.signSchedule)) {
              if (item.signSchedule.scheduleContent) {
                item.signSchedule.scheduleContentNew = JSON.parse(item.signSchedule.scheduleContent)
                item.status = 2
              } else {
                item.status = 3
              }
            }
          })
          this.lessonInfo = res.data
          console.log(this.lessonInfo, 222222222)
          this.loading = false
        })
      }
    },
    // 录入信息，关闭
    handleClose () {
      this.$emit('close')
      this.lessonInfo = {
        signId: '',
        menteeId: '',
        wxId: '',
        programName: '',
        serviceName: '',
        mentorHour: '',
        mentorNames: '',
        mentorArr: [
          {
            mentorArr: [],
            signSchedule: {
              scheduleContentNew: {
                lessonDate: '',
                lessonHours: '',
                lessonContentTypeArr: []
              },
              checkStatusName: ''
            }
          }]
      }
    },
    success (num, pkId) {
      console.log(num, pkId)
      this.loading = true
      if (num == '0') {
        this.$prompt('请输入不通过理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '必填'
        }).then(({ value }) => {
          if (value) {
            const data = {
              pkId: pkId,
              isPass: num,
              refuseReason: value
            }
            api.checkLessonsPut(data).then(res => {
              this.$message.success('提交成功！！')
              this.$emit('submit')
              this.loading = false
            })
          } else {
            return false
          }
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$confirm('是否确认通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            pkId: pkId,
            isPass: num
          }
          api.checkLessonsPut(data).then(res => {
            this.$message.success('提交成功！！')
            this.$emit('submit')
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style>
  .yx_block_check{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .yx_block_check .el-descriptions .is-bordered .el-descriptions-item__cell{
    width: 25%;
  }
  .yx_block_check3 .el-descriptions .is-bordered .el-descriptions-item__cell{
    width: 25%;
  }
  .yx_block_check1 .el-card__body{
    padding: 0px;
  }
  .yx_block_check2 .el-descriptions__body{
    color: #fff;
    background-color: #c32e47 !important;
  }
  .yx_block_check2 .el-descriptions-item__label.is-bordered-label{
    background-color: #c32e47 !important;
    color: #fff;
  }
   .yx_block_check2 .el-descriptions--mini{
     background-color: #c32e47;
   }
  /* .yx_block_check2 .el-descriptions .is-bordered .el-descriptions-item__cell{
    width: 20%;
  } */
</style>
