<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-11 17:02:43
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      title="(重申)小故事申请"
      :visible.sync="reapplyStoryVisible"
      width="600px"
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
import { uploadFunBySys } from '@/libs/file'
import api3 from '@/api/sales_assistant.js'

export default {
  props: {
    reapplyStoryVisible: {
      type: Boolean,
      default: false
    },
    interviewData: {}
  },
  data: () => {
    return {
      formData: {
        remark: '',
        story: ''
      },
      applyData: {},
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
    reapplyStoryVisible: function (val, old) {
      if (val) {
        this.pageInit()
        console.log(this.interviewData)
        this.applyData = JSON.parse(this.interviewData.content)
        this.formData.story = this.applyData.info.story
        this.formData.remark = this.applyData.info.remark
        this.Topage()
      }
    }
  },
  methods: {
    pageInit () {
      // applyType 为mentee_offer_story or mentee_entrance_offer_story
      apiDic.getAuditorListByApplyType(this.interviewData.applyType).then((res) => {
        console.log(this.interviewData.applyType, res.data)
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
        const conctentText = this.applyData.text
        const arr = []
        conctentText.forEach((v) => {
          if (v.label != '驳回理由') {
            arr.push(v)
          }
        })
        arr.forEach((v, i) => {
          if (v.label == '小故事') {
            v.value = this.formData.story || '无'
          } else if (v.label == '备注') {
            v.value = this.formData.remark || '无'
          }
        })
        const data = {
          applyType: this.interviewData.applyType,
          copyTo: [],
          keyId: this.applyData.info.pkId,
          applyTitle: `（重申）${this.interviewData.applyTitle}`,
          approval: approval,
          content: {
            file: [],
            text: arr,
            info: {
              pkId: this.applyData.info.pkId,
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
