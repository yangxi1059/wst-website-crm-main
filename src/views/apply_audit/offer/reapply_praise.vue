<!--
 * @Author: 杨曦
 * @Date: 2020-10-29 10:27:23
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-11 13:17:24
 * @Version:
 * @Description:
-->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false" title="好评图重申" :visible.sync="applySignPraiseVisible" width="1400px" :before-close="close">
        <el-form :inline="true" :rules="rules" label-width="130px">
            <el-form-item label="好评日期:">
                <el-date-picker
                :style="{width:'1140px  '}"
                value-format="yyyy-MM-dd"
                v-model="praiseData.praiseDate"
                type="date"
                placeholder="选择日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="内容:">
                <el-input
                v-model="praiseData.praiseContent"
                type="textarea"
                :autosize="{minRows:2}"
                :style="{width:'1140px'}"
                ></el-input>
            </el-form-item>
            <el-form-item label="好评图:">
                <el-upload
                action
                class="upload-btn"
                ref="upload1"
                :auto-upload="false"
                :file-list="fileList"
                :on-change="change"
                :before-remove="beforeRemove"
                :style="{width:'400px'}"
                drag
                >
                <span class="el-icon-upload"></span>
                <el-button size="mini" type="success" plain>选取文件</el-button>
                </el-upload>
                 <div v-if="praiseVoucher.name">
                    {{praiseVoucher.name}}
                    <el-button
                        type="primary"
                        :style="{width:'180px'}"
                        @click="download(praiseVoucher.url)"
                        icon="el-icon-download"
                    >预览</el-button>
                    </div>
            </el-form-item>
            <el-form-item label="好评类型:" prop="praiseType">
                <el-select
                    :style="{width:'180px'}"
                    v-model="praiseData.praiseType"
                    placeholder="请选择"
                >
                    <el-option
                    v-for="confirmItem in praiseTypeList"
                    :key="confirmItem.itemValue"
                    :label="confirmItem.itemName"
                    :value="confirmItem.itemValue"
                    ></el-option>
                </el-select>
            </el-form-item>
            <template>
                <el-form-item v-for="(i,index) in auditorList" :label="i.confirmCol" :key="index">
                <el-select
                    :style="{width:'180px'}"
                    size="mini"
                    v-model="i.auditor"
                    multiple
                    filterable
                    placeholder="请选择"
                >
                    <el-option
                    v-for="confirmItem in i.confirmorArr"
                    :key="confirmItem.confirmorId"
                    :label="confirmItem.confirmorName"
                    :value="confirmItem.confirmorId"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label=" ">

                </el-form-item>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button  @click="close">取消</el-button>
            <el-button  type="primary" @click="submit">提交</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  props: {
    applySignPraiseVisible: {
      type: Boolean,
      default: false
    },
    applyId: {
      type: String,
      default: ''
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      praiseData: {

      },
      rules: {
        praiseType: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      fileList: [],
      fileResume: null,
      approval: [],
      praiseTypeList: [],
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
      addVisible: false,
      menteeData: {

      },
      praiseVoucher: {}
    }
  },
  mounted () {},
  watch: {
    applySignPraiseVisible: function (val) {
      if (val) {
        this.pageInit()
      }
    }
  },
  methods: {
    async pageInit () {
      this.praiseTypeList = await this.getDictionary('praise_type')
      apiDic.getAuditorListByApplyType('sign_praise').then(res => {
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
      api.getApplyDetailByApplyId(this.applyId).then(res => {
        console.log(res.data, JSON.parse(res.data.apply.content), 'yxIframe111111111111111111111111')
        this.menteeData.menteeId = JSON.parse(res.data.apply.content).info.menteeId
        this.menteeData.applyTitle = res.data.apply.applyTitle
        this.menteeData.realName = JSON.parse(res.data.apply.content).text[0].value
        this.menteeData.signId = JSON.parse(res.data.apply.content).info.signId
        this.praiseData = JSON.parse(res.data.apply.content).info
        this.praiseVoucher.url = JSON.parse(res.data.apply.content).file[0].url
        this.praiseVoucher.name = JSON.parse(res.data.apply.content).file[0].name
      })
    },
    change (file, fileList) {
      this.fileList = fileList.slice(-1)
      this.fileResume = file
      this.praiseVoucher.name = ''
      this.praiseVoucher.url = ''
    },
    clear () {
      this.praiseVoucher = {}
      this.fileResume = null
      this.fileList = []
      this.auditorList = []
      this.menteeData = {}
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    // 录入信息，确认
    submit () {
      console.log('submit', this.praiseData)
      if (!this.praiseData.praiseType) {
        this.$message({
          type: 'error',
          message: '好评类型必选'
        })
        return
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
      this.$loading()
      const data = {
        applyType: 'sign_praise',
        applyTitle: `${this.menteeData.applyTitle}`,
        approval: approval,
        copyTo: [],
        voucher: [],
        content: {
          file: [{ name: this.praiseVoucher.name, url: this.praiseVoucher.url }],
          text: [
            {
              label: '学员名',
              value: this.menteeData.realName
            },
            {
              label: '好评日期',
              value: this.praiseData.praiseDate
            },
            {
              label: '内容',
              value: this.praiseData.praiseContent
            }
          ],
          info: {
            signId: this.signId,
            menteeId: this.menteeData.menteeId,
            praiseDate: this.praiseData.praiseDate,
            praiseContent: this.praiseData.praiseContent,
            praiseVoucher: this.praiseData.praiseVoucher,
            praiseType: this.praiseData.praiseType
          }
        }
      }
      if (this.praiseData.praiseType) {
        var str = ''
        for (let i = 0; i < this.praiseTypeList.length; i++) {
          if (this.praiseData.praiseType == this.praiseTypeList[i].itemValue) {
            str = this.praiseTypeList[i].itemName
          }
        }
        data.content.text.push({
          label: '好评类型',
          value: str
        })
      }
      console.log(data)
      if (this.fileResume) {
        console.log('新凭证')
        uploadFunBySys(
          this.fileResume.raw,
          `mentee/praiseImg/${this.menteeData.signId}_` +
            Math.random()
              .toString()
              .slice(-3),
          url => {
            console.log(data.content.file)
            data.content.file = []
            data.content.file.push({
              name: '好评图',
              url: url
            })
            data.content.info.praiseVoucher = url
            data.voucher.unshift({
              voucherName: this.fileResume.name,
              voucherPath: url
            })
            console.log('凭证参数', data)
            this.submitCommon(data)
          }
        )
      } else if (this.praiseVoucher.name && this.praiseVoucher.url) {
        console.log('保留原有凭证')
        data.content.info.praiseVoucher = this.praiseVoucher.url
        data.voucher.unshift({
          voucherName: this.praiseVoucher.name,
          voucherPath: this.praiseVoucher.url
        })
        this.submitCommon(data)
      } else {
        this.$message({
          message: '请上传凭证',
          type: 'error'
        })
      }
    },

    // 利用通用接口
    submitCommon (data) {
      api
        .addOfferApply(data)
        .then(res => {
          console.log('提交后', res)
          this.$message({
            type: 'success',
            message: '提交成功,可在申请列表查看'
          })
          this.$loading().close()
          this.clear()
          this.$emit('submit')
          // this.close();
        })
        .catch(err => {
          console.log('提交后', err)
          this.$message({
            type: 'error',
            message: '提交失败'
          })
          this.$loading().close()
          // this.close();
        })
    },
    beforeRemove () {
      return false
    },
    download (val) {
      downloadFun(val)
    }
  }
}
</script>
