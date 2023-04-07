<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-28 15:39:18
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      title="新增小故事申请"
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

            <el-form-item label="小故事:" prop="story">
                <el-input style="width:300px"  v-model="formData.story" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input style="width:300px"  v-model="formData.remark" type="textarea"></el-input>
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
        remark: '',
        story: ''
      },
      auditor: [],
      rules: {
        story: [
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
      ],
      shield: ['否', '是']
    }
  },
  created () {},
  watch: {
    applyInterviewStoryVisible: function (val, old) {
      if (val) {
        this.pageInit()
        console.log(this.interviewData)
        this.Topage()
      }
    }
  },
  methods: {
    pageInit () {
      let type = ''
      console.log(this.interviewData)
      if (this.interviewData.offerType == 'offer') {
        type = 'mentee_offer_story'
      } else if (this.interviewData.offerType == 'entrance_offer') {
        type = 'mentee_entrance_offer_story'
      }
      apiDic.getAuditorListByApplyType(type).then((res) => {
        console.log(type, res.data)
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
        remark: '',
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
        if (approval && approval.length < 1) {
          this.$message.error('审核人为必填项，若无审核人下拉项请联系部门领导反馈！！')
          return false
        }
        let conctentText = []
        if (this.interviewData.offerType == 'offer') {
          conctentText = [
            {
              label: '订单Id',
              value: this.interviewData.signId
            },
            {
              label: '面试公司',
              value: this.interviewData.companyName
            },
            {
              label: '面试部门',
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
              label: 'offer年薪/万￥',
              value: this.interviewData.offerSalary
            },
            {
              label: '准备周期（月）',
              value: this.interviewData.prepareMonth
            },
            {
              label: '获得offer日期',
              value: this.interviewData.offerReceiveDate
            },
            {
              label: 'offer申请季',
              value: this.interviewData.applySeason || '无'
            },
            {
              label: 'offer类型',
              value: this.interviewData.offerFromName || '无'
            },
            {
              label: '小故事内容',
              value: this.formData.story || '无'
            },
            {
              label: '备注',
              value: this.formData.remark || '无'
            },
            {
              label: '核验状态',
              value: this.interviewData.checkStatusName
            }
          ]
        } else if (this.interviewData.offerType == 'entrance_offer') {
          conctentText = [
            {
              label: '类别',
              value: this.interviewData.entranceType
            },
            {
              label: 'offer学校',
              value: this.interviewData.schoolId
            },
            {
              label: '学院',
              value: this.interviewData.instituteId
            },
            {
              label: '屏蔽学生学校',
              value: this.shield[this.interviewData.shield]
            },
            {
              label: '可宣传',
              value: this.shield[this.interviewData.publicStatus]
            },
            {
              label: '准备周期',
              value: this.interviewData.prepareMonth + '月'
            },
            {
              label: '获得offer日期',
              value: this.interviewData.offerReceiveDate
            },
            {
              label: '申请季',
              value: this.interviewData.applySeason
            },
            {
              label: '小故事',
              value: this.formData.story || '无'
            },
            {
              label: '备注',
              value: this.formData.remark || '无'
            }
          ]
        }
        const data = {
          applyType: 'mentee_' + this.interviewData.offerType + '_story',
          copyTo: [],
          keyId: this.interviewData.pkId,
          applyTitle: `学员【${this.menteeName}】(${this.interviewData.companyName})的小故事申请`,
          approval: approval,
          content: {
            file: [],
            text: conctentText,
            info: {
              pkId: this.interviewData.pkId,
              story: this.formData.story,
              remark: this.formData.remark
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
