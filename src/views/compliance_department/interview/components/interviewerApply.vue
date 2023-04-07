<!--
 * @Author: 杨曦
 * @Date: 2020-12-10 16:03:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 10:05:40
 * @Version:
 * @Description:
-->
<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false" title="面试人员申请" :visible.sync="interviewApplyVisible" width="500px" v-loading="loading" :before-close="close">
      <el-form :inline="true" label-width="150px">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/hr.js'
import axios from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'

export default {
  mixins: [mixins],
  props: {
    interviewApplyVisible: {
      type: Boolean,
      default: false
    },
    intervieweeId: {
      type: String
    }
  },
  data: () => {
    return {
      loading: false,
      auditor: [],
      intervieweeData: {},
      intervieweeArr: [],
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
  computed: {

  },
  watch: {
    interviewApplyVisible: function (val) {
      if (val) {
        this.Topage()
        axios.getAuditorListByApplyType('interviewee_info').then(res => {
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
      }
    }
  },
  mounted () {

  },
  methods: {
    Topage () {
      api.getIntervieweeDetailNewById(this.intervieweeId).then(res => {
        this.intervieweeData = res.data.info
        this.intervieweeArr = res.data.interviewerArr
        console.log(this.intervieweeData, this.intervieweeArr)
      })
    },
    close () {
      this.$emit('close')
    },
    submit () {
      let cannot = false
      const approval = []
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
      this.loading = true
      const arr = []
      let assess = []
      assess =
            this.intervieweeData.interviewRemark &&
            this.intervieweeData.interviewRemark.split(',')
      if (this.intervieweeData.resume) {
        arr.push({
          name: '简历',
          url: this.intervieweeData.resume
        })
      }
      let abc = 0
      if (assess) {
        for (let i = 0; i < assess.length; i++) {
          if (assess[i]) {
            abc++
            arr.push({
              name: `面试信息${abc}`,
              url: assess[i]
            })
          }
        }
      }
      if (this.intervieweeData.intervieweeResource != 'user_recommend') {
        this.intervieweeData.recommenderName = '无'
      }
      // intervieweeResource == 'user_recommend'
      const data = {
        applyType: 'interviewee_info',
        keyId: this.intervieweeData.intervieweeId,
        approval: approval,
        applyTitle: `求职者【${this.intervieweeData.intervieweeName}】的面试核验申请`,
        content: {
          file: arr,
          text: [
            { label: '姓名', value: this.intervieweeData.intervieweeName },
            { label: '电话', value: this.intervieweeData.telephone },
            { label: '微信ID', value: this.intervieweeData.wxId },
            { label: '性别', value: this.intervieweeData.sexName },
            { label: '年龄', value: this.intervieweeData.age },
            { label: '邮箱', value: this.intervieweeData.email },
            { label: '部门', value: this.intervieweeData.deptName },
            { label: '岗位', value: this.intervieweeData.position },
            { label: '期望薪资', value: this.intervieweeData.expectSalary },
            { label: 'Office', value: this.intervieweeData.office },
            { label: '到面状态', value: this.intervieweeData.interviewStatusName },
            { label: '录用状态', value: this.intervieweeData.hireStatusName },
            { label: '面试时间', value: this.intervieweeData.interviewTime },
            { label: '是否到岗', value: this.intervieweeData.arrivalStatusName },
            { label: '到岗时间预计', value: this.intervieweeData.arrivalDate },
            { label: '是否预约体检', value: this.intervieweeData.physicalExaminationStatusName },
            { label: '体检时间', value: this.intervieweeData.physicalExaminationDate },
            { label: '邀约人', value: this.intervieweeData.manageByName },
            { label: '推荐人', value: this.intervieweeData.recommenderName },
            { label: '邀约渠道', value: this.intervieweeData.intervieweeResourceName },
            { label: '备注', value: this.intervieweeData.note }
          ],
          info: {
            intervieweeId: this.intervieweeData.intervieweeId,
            intervieweeArr: this.intervieweeArr
          }
        }
      }
      // for(let i=0;i<this.intervieweeArr.length;i++){
      //     data.content.text.push({
      //         label:`面试情况${this.intervieweeArr[i].sort}`,
      //         value:`${this.intervieweeArr[i].interviewTime} ${this.intervieweeArr[i].interviewerName}第${this.intervieweeArr[i].sort}轮面试`,
      //     })
      // }
      console.log(data)
      api.applyInterview(data).then(res => {
        this.loading = false
        this.$message.success('申请成功~~~')
        this.$emit('submit')
      }).catch(err => {
        this.loading = false
        console.log(err)
        this.$message.error('申请失败~~~')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
