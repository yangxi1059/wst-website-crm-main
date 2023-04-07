<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:52:41
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      title="发起小故事申请"
      :visible.sync="applyInterviewStoryVisible"
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

export default {
  props: {
    applyInterviewStoryVisible: {
      type: Boolean,
      default: false
    },
    menteeName: {},
    pkId: {},
    content: {}
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
      ]
    }
  },
  created () {},
  watch: {
    applyInterviewStoryVisible: function (val, old) {
      if (val) {
        this.init()
        this.Topage()
      }
    }
  },
  methods: {
    init () {
      apiDic.getAuditorListByApplyType('mentee_offer_story').then((res) => {
        console.log('mentee_offer_story', res.data)
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
        let companyName = ''
        for (let i = 0; i < this.content.text.length; i++) {
          if (this.content.text[i].label == '公司') {
            companyName = this.content.text[i].value
          }
        }
        const data = {
          applyType: 'mentee_offer_story',
          copyTo: [],
          keyId: this.pkId,
          applyTitle: `学员【${this.menteeName}】(${companyName})的小故事申请`,
          approval: approval,
          content: {
            file: [],
            text: this.content.text,
            info: {
              pkId: this.pkId,
              story: this.formData.story,
              remark: this.formData.remark
            }
          }
        }
        for (let i = 0; i < this.content.text.length; i++) {
          if (this.content.text[i].label == '小故事') {
            this.content.text[i].value = this.formData.story
          }
          if (this.content.text[i].label == '备注') {
            this.content.text[i].value = this.formData.remark
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
