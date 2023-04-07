<!--
 * @Author: 库建华
 * @Date: 2020-04-14 09:58:43
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-25 14:37:02
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      title="重新申请升学Offer"
      :visible.sync="reapplyOfferVisible"
      width="1400px"
      :before-close="close"
    >
      <el-card class="mb20">
        <el-form :inline="true" label-width="130px">
          <el-form-item label="类别:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.entranceType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in entrance_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业项目:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.entranceOfferProgram"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in entrance_offer_program"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="offer学校:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.schoolId"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in school"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId+'&&'+item.schoolName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.instituteId"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in institute"
                :key="item.instituteId"
                :label="item.instituteChiName"
                :value="item.instituteId + '&&' + item.instituteChiName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="准备周期（月）:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.prepareMonth"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 36" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获得offer日期:">
            <el-date-picker
              :style="{width:'180px'}"
              value-format="yyyy-MM-dd"
              v-model="applyData.offerReceiveDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="是否屏蔽该学生:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.shield"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shield"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可宣传:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.publicStatus"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shield"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请季:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.applySeason"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in apply_season"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小故事:">
            <el-input
              v-model="applyData.story"
              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'1140px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              v-model="applyData.remark"
              type="textarea"
              :autosize="{minRows:2}"
              :style="{width:'1140px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="凭证:">
            <el-button
              :style="{width:'180px'}"
              type="text"
              @click="download(applyData.offerVoucher)"
              icon="el-icon-download"
            >预览</el-button>
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList1"
              :on-change="change1"
              :style="{width:'200px'}"
            >
              <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="好评图:">
            <el-button
              :style="{width:'180px'}"
              type="text"
              @click="download(applyData.praiseVoucher)"
              icon="el-icon-download"
            >预览</el-button>
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList2"
              :on-change="change2"
              :style="{width:'200px'}"
            >
              <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
          <template>
            <el-form-item
              :label="item.confirmCol"
              v-for="(item,index) in eduAuditorList"
              :key="index"
            >
              <el-select
                :style="{width:'180px'}"
                size="mini"
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
          </template>
          <el-form-item label=" ">
            <template>
              <el-button
                class="el-icon-circle-check-outline"
                type="primary"
                size="mini"
                @click="eduSubmit(applyData)"
              >提交</el-button>
              <el-button
                class="el-icon-circle-close-outline"
                type="primary"
                size="mini"
                @click="close()"
              >取消</el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-card>
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
    reapplyOfferVisible: {
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
      company: [],
      division: [],
      city: [],
      internship_or_full_time: [],
      shield2: ['否', '是'],
      shield: [],
      apply_season: [],

      entrance_type: [],
      entrance_offer_program: [],
      school: [],
      institute: [],

      resultConfirm: ['未确认', '已确认', '审核未通过'],

      fileList1: [],
      fileList2: [],
      fileResume1: null,
      fileResume2: null,

      pkId: 0,
      applyData: [],
      approval: [],
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
      eduAuditorList: [
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
      menteeId: '',
      signId: ''
    }
  },
  mounted () {
    api.getCompanyList().then(res => {
      console.log('company', res)
      this.company = res.data
    })
  },
  watch: {
    reapplyOfferVisible: function (val) {
      if (val) {
        this.Topage()
        this.pageInit()
        apiDic.getAuditorListByApplyType('entrance_offer_apply').then(res => {
          console.log('getAuditorListByApplyType', res.data)
          res.data.forEach(v => {
            v.auditor = []
            v.confirmorArr.forEach(value => {
              if (value.isDefult == 1) {
                v.auditor.push(value.confirmorId)
              }
            })
          })
          this.eduAuditorList = [...res.data]
        })
      }
    }
  },
  methods: {
    async pageInit () {
      this.school = await this.getSchool("school")
      this.shield = await this.getDictionary('common_yes_or_no')
      this.division = await this.getDictionary('division')
      this.city = await this.getDictionary('city')
      this.apply_season = await this.getDictionary('apply_season')
      this.entrance_type = await this.getDictionary('entrance_type')
      this.entrance_offer_program = await this.getDictionary('entrance_offer_program')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
    },
    Topage () {
      api.getApplyDetailByApplyId(this.applyId).then(res => {
        const data = JSON.parse(res.data.apply.content).info
        console.log(data)
        this.menteeId = data.menteeId
        this.signId = data.signId
        this.applyData = {
          entranceType: '',
          schoolId: '',
          instituteId: '',
          shield: '',
          applySeason: data.applySeason,
          story: data.story,
          remark: data.remark,
          offerVoucher: data.offerVoucher,
          praiseVoucher: data.praiseVoucher,
          applyTypeName: res.data.apply.applyTypeName,
          applyTitle: res.data.apply.applyTitle,
          entranceOfferProgram: data.entranceOfferProgram,
          prepareMonth: data.prepareMonth,
          offerReceiveDate: data.offerReceiveDate,
          publicStatus: data.publicStatus
        }
        apiDic.getAcademyBySchoolId(data.schoolId).then(res => {
          console.log(res.data)
          this.institute = res.data
          for (let i = 0; i < this.institute.length; i++) {
            if (this.institute[i].instituteId == data.instituteId) {
              this.applyData.instituteId =
                this.institute[i].instituteId + '&&' + this.institute[i].instituteChiName
            }
          }
        })

        // 数据转换，对应下拉框选项
        for (let i = 0; i < this.entrance_type.length; i++) {
          if (this.entrance_type[i].itemValue == data.entranceType) {
            this.applyData.entranceType =
              this.entrance_type[i].itemValue +
              '&&' +
              this.entrance_type[i].itemName
          }
        }
        for (let i = 0; i < this.school.length; i++) {
          if (this.school[i].schoolId == data.schoolId) {
            this.applyData.schoolId =
              this.school[i].schoolId + '&&' + this.school[i].schoolName
          }
        }

        for (let i = 0; i < this.shield.length; i++) {
          if (this.shield[i].itemValue == data.shield) {
            this.applyData.shield =
              this.shield[i].itemValue + '&&' + this.shield[i].itemName
          }
        }

        for (let i = 0; i < this.shield.length; i++) {
          if (this.shield[i].itemValue == data.publicStatus) {
            this.applyData.publicStatus =
              this.shield[i].itemValue + '&&' + this.shield[i].itemName
          }
        }

        for (let i = 0; i < this.entrance_offer_program.length; i++) {
          if (this.entrance_offer_program[i].itemValue == data.entranceOfferProgram) {
            this.applyData.entranceOfferProgram =
              this.entrance_offer_program[i].itemValue + '&&' + this.entrance_offer_program[i].itemName
          }
        }
      })
    },
    close () {
      this.$emit('close')
      this.offerList = []
      this.approval = []
      this.fileList1 = []
      this.fileList2 = []
      this.fileResume1 = null
      this.fileResume2 = null
    },
    download (val) {
      downloadFun(val)
    },
    change1 (file, fileList) {
      this.fileList1 = fileList.slice(-1)
      this.fileResume1 = file
    },
    change2 (file, fileList) {
      this.fileList2 = fileList.slice(-1)
      this.fileResume2 = file
    },
    // 录入信息，确认
    eduSubmit (item) {
      console.log('submit', item)
      for (const i in item) {
        if (i != 'instituteId') {
          if (item[i] === '' || item[i] === undefined || item[i] === null) {
            this.$message({
              type: 'error',
              message: '所有参数都为必填!'
            })
            console.log(i, item[i])
            return
          }
        }
      }
      if (
        item.entranceType == 'Internal Transfer&&内部转院/学' &&
        !item.instituteId
      ) {
        this.$message({
          type: 'error',
          message: '类别为（内部转院/学）时，学院必填!'
        })
        return
      }
      const approval = []
      let cannot = false
      this.eduAuditorList.forEach(aa => {
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
        applyType: 'entrance_offer_apply',
        applyTitle: '（重申）' + this.applyData.applyTitle,
        approval: approval,
        copyTo: [],
        content: {
          file: [
            { name: '凭证', url: item.offerVoucher },
            { name: '好评图', url: item.praiseVoucher }
          ],
          text: [
            {
              label: '类别',
              value: item.entranceType.split('&&')[1]
            },
            {
              label: '专业项目',
              value: item.entranceOfferProgram.split('&&')[1]
            },
            {
              label: 'offer学校',
              value: item.schoolId ? item.schoolId.split('&&')[1] : '无'
            },
            {
              label: '学院',
              value: item.instituteId ? item.instituteId.split('&&')[1] : '无'
            },
            {
              label: '屏蔽学生学校',
              value: item.shield.split('&&')[1]
            },
            {
              label: '可宣传',
              value: item.publicStatus.split('&&')[1]
            },
            {
              label: '准备周期',
              value: item.prepareMonth + '月'
            },
            {
              label: '获得offer日期',
              value: item.offerReceiveDate
            },
            {
              label: '申请季',
              value: item.applySeason
            },
            {
              label: '小故事',
              value: item.story
            },
            {
              label: '备注',
              value: item.remark
            }
          ],
          info: {
            signId: this.signId,
            menteeId: this.menteeId,
            entranceType: item.entranceType.split('&&')[0],
            entranceOfferProgram: item.entranceOfferProgram.split('&&')[0],
            instituteId: item.instituteId
              ? item.instituteId.split('&&')[0]
              : '',
            schoolId: item.schoolId ? item.schoolId.split('&&')[0] : '',
            prepareMonth: item.prepareMonth,
            offerReceiveDate: item.offerReceiveDate,
            resultType: '1',
            publicStatus: item.publicStatus.split('&&')[0],
            applySeason: item.applySeason,
            shield: item.shield.split('&&')[0],
            story: item.story,
            remark: item.remark,
            offerVoucher: item.offerVoucher,
            praiseVoucher: item.praiseVoucher
          }
        }
      }
      let canGo = 0
      if (this.fileResume1) {
        canGo++
        data.content.file[0] = {}
        uploadFunBySys(this.fileResume1.raw, 'voucher/offer_apply', url => {
          console.log(url)
          data.content.file[0] = { name: '凭证', url: url }
          data.content.info.offerVoucher = url
          console.log('凭证参数', data)
          canGo--
          if (!canGo) {
            this.submitCommon(data)
          }
        })
      }
      if (this.fileResume2) {
        canGo++
        data.content.file[1] = {}
        uploadFunBySys(this.fileResume2.raw, 'good_figure/offer_apply', url => {
          console.log(url)
          data.content.file[1] = { name: '好评图', url: url }
          data.content.info.praiseVoucher = url
          console.log('好评图参数', data)
          canGo--
          if (!canGo) {
            this.submitCommon(data)
          }
        })
      }
      if (!canGo) {
        this.submitCommon(data)
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
          this.close()
          this.$emit('submit')
        })
        .catch(err => {
          console.log('提交后', err)
          this.$message({
            type: 'error',
            message: '提交失败'
          })
          this.$loading().close()
          this.close()
        })
    },

    addOffer () {
      this.offerList.unshift({
        resultType: '1',
        signId: this.signId,
        menteeId: this.menteeId,
        shield: null,
        publicStatus: null,
        pkId: 0,
        remark: undefined,
        story: undefined,
        applySeason: undefined,
        // interviewDate:undefined,
        schoolId: undefined,
        instituteId: undefined,
        entranceType: undefined,
        prepareMonth: undefined,
        offerReceiveDate: undefined
      })
      this.pkId = 0
    },
    editOffer (pkId) {
      this.pkId = pkId
    },
    cancel () {
      this.Topage()
    },
    delOffer (i) {
      console.log('delOffer', i)
      this.$confirm('此操作将永久删除该offer, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('删除offer')
          const delList = [{ pkId: i, resultType: '1' }]
          console.log('删除offer', delList)
          api
            .setResultList(this.signId, { delList: delList })
            .then(res => {
              console.log('提交后', res)
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.Topage()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    getAcademyBySchoolId (item) {
      console.log(item)
      item.instituteId = null
      if (item.schoolId) {
        apiDic.getAcademyBySchoolId(item.schoolId.split('&&')[0]).then(res => {
          console.log(res.data)
          this.institute = res.data
        })
      }
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
.w160 {
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
