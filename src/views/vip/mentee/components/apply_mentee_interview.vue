<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-20 14:29:32
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      title="新增面经申请"
      :visible.sync="applyInterviewStoryVisible"
      width="600px"
      :close-on-click-modal="false"
      :before-close="close"
    >
        <el-form :inline="true"
         :rules="rules"
         :model="formData"
         ref="ruleForm"
         label-width="130px">
            <el-form-item label="面经提供人:" prop="storyBy">
                <el-select
                :style="{width:'180px'}"
                filterable
                v-model="formData.storyBy"
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
            <el-form-item label="面经:" prop="story">
                <el-input style="width:300px"  v-model="formData.story" type="textarea"></el-input>
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">申 请</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import { uploadFunBySys } from '@/libs/file'

export default {
  props: {
    applyInterviewStoryVisible: {
      type: Boolean,
      default: false
    },
    interviewData: {},
    menteeName: {}
  },
  data: () => {
    return {
      formData: {
        storyBy: '',
        story: ''
      },
      users: [],
      auditor: [],
      rules: {
        story: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        storyBy: [
          { required: true, message: '必填', trigger: 'blur' }
        ]

      },
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
  created () {},
  watch: {
    applyInterviewStoryVisible: function (val, old) {
      if (val) {
        this.pageInit()
        this.Topage()
      }
    }
  },
  methods: {
    pageInit () {
      apiDic.getUserList().then(({ data }) => {
        console.log('人员列表', data)
        this.users = data
      })
      apiDic.getAuditorListByApplyType('mentee_interview_story').then((res) => {
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
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.formData = {
        storyBy: '',
        story: ''
      },
      this.auditor = []
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
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
        let storyByName = ''
        for (let i = 0; i < this.users.length; i++) {
          if (this.formData.storyBy == this.users[i].userId) {
            storyByName = this.users[i].userName
          }
        }
        if (approval && approval.length < 1) {
          this.$message.error('审核人为必填项，若无审核人下拉项请联系部门领导反馈！！')
          return false
        }
        const data = {
          applyType: 'mentee_interview_story',
          copyTo: [],
          keyId: this.interviewData.pkId,
          applyTitle: `学员【${this.menteeName}】(${this.interviewData.companyName})的面经申请`,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '订单Id',
                value: this.interviewData.signId
              },
              {
                label: '公司',
                value: this.interviewData.companyName
              },
              {
                label: '部门',
                value: this.interviewData.divisionName
              },
              {
                label: '城市',
                value: this.interviewData.cityName
              },
              {
                label: '实习/全职',
                value: this.interviewData.resultApplyName
              },
              {
                label: '面试时间',
                value: this.interviewData.interviewDate
              },
              {
                label: '申请季',
                value: this.interviewData.applySeason
              },
              {
                label: '面试轮次',
                value: this.interviewData.timesName
              },
              {
                label: '面试难度',
                value: this.interviewData.difficultyLevel
              },
              {
                label: '面经提供人',
                value: storyByName || '无'
              },
              {
                label: '面经',
                value: this.formData.story
              }
            ],
            info: {
              pkId: this.interviewData.pkId,
              story: this.formData.story,
              storyBy: this.formData.storyBy
            }
          }
        }
        this.$loading()
        console.log(data)
        api.setRefund(data).then(() => {
          this.$message({
            message: '发起申请成功',
            type: 'success'
          })
          this.$loading().close()
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
      })
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
