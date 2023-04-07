<!--
 * @Author: 库建华
 * @Date: 2019-07-30 15:15:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 14:00:09
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog
      :close-on-click-modal="false"
      title="发起offer音频申请"
      :visible.sync="applyAudioVisible"
      width="600px"
      :before-close="close"
    >
        <el-form :inline="true"
         :rules="rules"
         :model="FormData"
         ref="ruleForm"
         label-width="130px">
            <el-form-item label="音频文件:">
                <el-upload
                    action
                    class="upload-btn"
                    ref="upload1"
                    :auto-upload="false"
                    :file-list="fileList1"
                    :on-change="change1"
                    :limit= 1
                    accept=".MP3,.WAVE,.mp3,.wave,.wma,.WMA,.aac,.AAC"
                    :on-remove="removeFile"
                    drag
                >
                <div slot="tip" class="el-upload__tip">只能上传mp3/wave/acc/wma文件</div>
                <span class="el-icon-upload"></span>
                <el-button size="mini" type="success" plain>选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input
                    style="width:360px"
                    type="textarea"
                    :autosize="{ minRows: 2}"
                    placeholder="请输入内容"
                    v-model="FormData.remark">
                </el-input>
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
    applyAudioVisible: {
      type: Boolean,
      default: false
    },
    offerData: {},
    offerType: {}
  },
  data: () => {
    return {
      auditor: [],
      rules: {
        //  remark: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      FormData: {
        remark: ''
      },
      fileList1: [],
      fileResume1: null,
      remark: '',
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
    applyAudioVisible: function (val, old) {
      if (val) {
        this.init()
        this.Topage()
      }
    }
  },
  methods: {
    init () {
      apiDic.getAuditorListByApplyType('offer_audio_analyse').then((res) => {
        console.log('offer_audio_analyse', res.data)
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
      this.fileList1 = []
      this.auditor = []
      this.FormData = {
        remark: ''
      }
    },
    change1 (file, fileList) {
      this.fileList1 = fileList.slice(-1)
      this.fileResume1 = file
      console.log(this.fileResume1, this.fileList1)
    },
    removeFile () {
      this.fileList1 = []
      this.fileResume1 = null
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        if (!this.fileResume1) {
          this.$message({
            type: 'warning',
            message: '音频文件为必传'
          })
          return false
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
        if (approval && approval.length < 1) {
          this.$message.error('审核人为必填项，若无审核人下拉项请联系部门领导反馈！！')
          return false
        }
        const data = {
          applyType: 'offer_audio_analyse',
          copyTo: [],
          keyId: this.offerType,
          voucher: [],
          applyTitle: `学员【${this.offerData.menteeName}】的Offer音频申请`,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '学员名',
                value: this.offerType == 'entranceOffer' ? this.offerData.menteeName : this.offerData.menteeName
              },
              {
                label: 'Offer类型',
                value: this.offerType == 'entranceOffer' ? '升学Offer' : '求职Offer'
              },
              {
                label: this.offerType == 'entranceOffer' ? '原学校' : '公司名',
                value: this.offerType == 'entranceOffer' ? this.offerData.schoolChiName : this.offerData.companyName
              },
              {
                label: this.offerType == 'entranceOffer' ? '升学学校' : '部门名',
                value: this.offerType == 'entranceOffer' ? this.offerData.engName : this.offerData.divisionName
              },
              {
                label: this.offerType == 'entranceOffer' ? '升学类型' : '年薪（万）',
                value: this.offerType == 'entranceOffer' ? this.offerData.entranceTypeName : this.offerData.offerSalary
              },
              {
                label: '备注',
                value: this.FormData.remark || '空'
              }
            ],
            info: {
              pkId: this.offerData.pkId,
              audioAnalyse: ''
            }
          }
        }
        let canGo = 0
        if (this.fileResume1) {
          canGo++
          uploadFunBySys(
            this.fileResume1.raw,
                `audio/offer/${this.offerData.signId}_${~~(Math.random() * 1000)}`,
                url => {
                  console.log(url, data)
                  data.content.file.unshift({ name: this.fileResume1.name, url: url })
                  data.content.info.audioAnalyse = url
                  data.voucher.unshift({ voucherName: this.fileResume1.name, voucherPath: url })
                  canGo--
                  if (!canGo) {
                    this.submitCommon(data)
                  }
                }
          )
        }
        this.$loading()
      })
    },
    submitCommon (data) {
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
