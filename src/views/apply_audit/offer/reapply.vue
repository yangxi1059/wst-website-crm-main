<!--
 * @Author: 库建华
 * @Date: 2019-10-31 14:24:02
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-29 11:26:23
 * @Version: 1
 * @Description: offer 的重新申请模块
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      title="重新申请Offer"
      :visible.sync="reapplyOfferVisible"
      width="1400px"
      :before-close="close"
    >
      <el-card class="mb20">
        <el-form :inline="true" label-width="130px">
          <el-form-item label="公司:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.company"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in company"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId + '&&' + item.companyName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.division"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in division"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.city"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in city"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习/全职:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.resultApply"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internship_or_full_time"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue + '&&' + item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习类型:" v-if="applyData.resultApply == '0&&实习'">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.internshipType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internship_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="全职类型:" v-if="applyData.resultApply == '1&&全职'" >
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.fullTimeType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in full_time_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="offer年薪/万(￥)：">
            <el-input-number :controls="false" v-model="applyData.offerSalary" :style="{width:'180px'}" placeholder="请输入年薪"></el-input-number>
          </el-form-item>
           <el-form-item label="项目周期:">
            <el-input :style="{width:'180px'}" v-model="applyData.programPeriod"></el-input>
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
          <el-form-item label="屏蔽学生学校:">
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

          <el-form-item label="Offer类型:">
            <el-select
              :style="{width:'180px'}"
              v-model="applyData.offerFrom"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in offer_from"
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
              @click="download(applyData.resultVoucher)"
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
            <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
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
                @click="submit(applyData)"
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
      full_time_type: [],
      internship_type: [],
      resultConfirm: ['未确认', '已确认', '审核未通过'],

      fileList1: [],
      fileList2: [],
      fileResume1: null,
      fileResume2: null,

      pkId: 0,
      applyData: {},
      approval: [],
      offer_from: [],
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
      menteeId: '',
      signId: '',
      rejection: ''
    }
  },
  mounted () {
    api.getCompanyList().then(res => {
      console.log('company', res)
      this.company = res.data
    })
  },
  watch: {
    reapplyOfferVisible: function (val, old) {
      if (val) {
        this.Topage()
        this.pageInit()
        apiDic.getAuditorListByApplyType('offer_apply').then(res => {
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
  methods: {
    async pageInit () {
      this.shield = await this.getDictionary('common_yes_or_no')
      this.division = await this.getDictionary('division')
      this.city = await this.getDictionary('city')
      this.apply_season = await this.getDictionary('apply_season')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.offer_from = await this.getDictionary('offer_from')
      this.full_time_type = await this.getDictionary('full_time_type')
      this.internship_type = await this.getDictionary('internship_type')
    },
    Topage () {
      api.getApplyDetailByApplyId(this.applyId).then(res => {
        const content = JSON.parse(res.data.apply.content)
        console.log(content)
        const data = content.info
        const text = content.text.filter(v => v.label == '驳回理由')
        this.rejection = text && text[0] && text[0].value
        this.menteeId = data.menteeId
        this.signId = data.signId
        this.applyData = {
          company: '',
          division: '',
          city: '',
          resultApply: '',
          internshipType: data.internshipType || '',
          fullTimeType: data.fullTimeType || '',
          shield: '',
          offerFrom: data.offerFrom,
          applySeason: data.applySeason,
          story: data.story,
          remark: data.remark,
          resultVoucher: data.resultVoucher,
          praiseVoucher: data.praiseVoucher,
          applyTypeName: res.data.apply.applyTypeName,
          applyTitle: res.data.apply.applyTitle,
          offerSalary: ~~data.offerSalary,
          prepareMonth: data.prepareMonth,
          programPeriod: data.programPeriod,
          offerReceiveDate: data.offerReceiveDate,
          publicStatus: ''
        }
        // 数据转换，对应下拉框选项
        for (let i = 0; i < this.company.length; i++) {
          if (this.company[i].companyId == data.company) {
            this.applyData.company =
              this.company[i].companyId + '&&' + this.company[i].companyName
          }
        }
        for (let i = 0; i < this.division.length; i++) {
          if (this.division[i].itemValue == data.division) {
            this.applyData.division =
              this.division[i].itemValue + '&&' + this.division[i].itemName
          }
        }
        for (let i = 0; i < this.city.length; i++) {
          if (this.city[i].itemValue == data.city) {
            this.applyData.city =
              this.city[i].itemValue + '&&' + this.city[i].itemName
          }
        }
        for (let i = 0; i < this.internship_or_full_time.length; i++) {
          if (this.internship_or_full_time[i].itemValue == data.resultApply) {
            this.applyData.resultApply =
              this.internship_or_full_time[i].itemValue +
              '&&' +
              this.internship_or_full_time[i].itemName
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
    submit (item) {
      console.log('submit', item)
      if (!item.city) {
        this.$message.error('城市必填')
        return false
      }
      if (!item.offerReceiveDate) {
        this.$message.error('获得offer日期必填')
        return false
      }
      if (!item.programPeriod) {
        this.$message.error('项目周期必填')
        return false
      }
      if (!item.prepareMonth) {
        this.$message.error('准备月份必填')
        return false
      }
      if (item.offerSalary == 0 || item.offerSalary) {
      } else {
        this.$message.error('offer年薪必填')
        return false
      }
      if (!item.applySeason) {
        this.$message.error('申请季必填')
        return false
      }
      if (!item.company) {
        this.$message.error('公司必填')
        return false
      }
      if (!item.publicStatus) {
        this.$message.error('公开状态必填')
        return false
      }
      if (!item.shield) {
        this.$message.error('可否宣传必填')
        return false
      }
      if (!item.offerFrom) {
        this.$message.error('offer类型必填')
        return false
      }
      if (!item.resultApply) {
        this.$message.error('实习全职类型必填')
        return false
      }
      // if (!this.fileResume1 || !this.fileResume2) {
      //   this.$message({
      //     type: "error",
      //     message: "凭证/好评图必填"
      //   });
      //   return;
      // }
      if (item.resultApply.split('&&')[0] == '0') {
        if (!item.internshipType) {
          this.$message.error('实习类型必填')
          return
        }
      } else if (item.resultApply.split('&&')[0] == '1') {
        if (!item.fullTimeType) {
          this.$message.error('全职类型必填')
          return
        }
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
      let offerFromName = ''
      for (var i in this.offer_from) {
        if (this.offer_from[i].itemValue == item.offerFrom) {
          offerFromName = this.offer_from[i].itemName
        }
      }
      let fullTimeTypeName = ''
      for (var i in this.full_time_type) {
        if (this.full_time_type[i].itemValue == item.fullTimeType) {
          fullTimeTypeName = this.full_time_type[i].itemName
        }
      }
      let internshipTypeName = ''
      for (var i in this.internship_type) {
        if (this.internship_type[i].itemValue == item.internshipType) {
          internshipTypeName = this.internship_type[i].itemName
        }
      }
      let name = ''
      let nameValue = ''
      if (item.resultApply.split('&&')[0] == '0') {
        name = '实习类型'
        nameValue = internshipTypeName
      } else if (item.resultApply.split('&&')[0] == '1') {
        name = '全职类型'
        nameValue = fullTimeTypeName
      }
      const data = {
        applyType: 'offer_apply',
        applyTitle: '（重申）' + this.applyData.applyTitle,
        approval: approval,
        copyTo: [],
        voucher: [],
        content: {
          file: [
            { name: '凭证', url: item.resultVoucher },
            { name: '好评图', url: item.praiseVoucher }
          ],
          text: [
            {
              label: '公司',
              value: item.company.split('&&')[1]
            },
            {
              label: '部门',
              value: item.division.split('&&')[1]
            },
            {
              label: '城市',
              value: item.city.split('&&')[1]
            },
            {
              label: '实习/全职',
              value: item.resultApply.split('&&')[1]
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
              label: '项目周期',
              value: item.programPeriod
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
              label: 'offer年薪/万(￥)',
              value: item.offerSalary
            },
            {
              label: '申请季',
              value: item.applySeason
            },
            {
              label: '求职Offer类型',
              value: offerFromName
            },
            {
              label: '小故事',
              value: item.story || '无'
            },
            {
              label: '备注',
              value: item.remark
            },
            {
              label: '上次驳回理由',
              value: this.rejection
            }
          ],
          info: {
            signId: this.signId,
            menteeId: this.menteeId,
            company: item.company.split('&&')[0],
            city: item.city.split('&&')[0],
            division: item.division ? item.division.split('&&')[0] : '',
            resultApply: item.resultApply.split('&&')[0],
            fullTimeType: item.resultApply.split('&&')[0] == '1' ? item.fullTimeType : '',
            internshipType: item.resultApply.split('&&')[0] == '0' ? item.internshipType : '',
            resultType: '1',
            applySeason: item.applySeason,
            offerFrom: item.offerFrom,
            offerReceiveDate: item.offerReceiveDate,
            programPeriod: item.programPeriod,
            prepareMonth: item.prepareMonth,
            offerSalary: item.offerSalary,
            shield: item.shield.split('&&')[0],
            publicStatus: item.publicStatus.split('&&')[0],
            story: item.story,
            remark: item.remark,
            resultVoucher: item.resultVoucher,
            praiseVoucher: item.praiseVoucher
          }
        }
      }
      if (item.resultApply.split('&&')[0] == '0' || item.resultApply.split('&&')[0] == '1') {
        data.content.text.splice(4, 0, {
          label: name,
          value: nameValue
        })
      }
      console.log(data, 33333333333333333333333)
      let canGo = 0
      if (this.fileResume1) {
        canGo++
        data.content.file[0] = {}
        uploadFunBySys(this.fileResume1.raw, 'voucher/offer_apply', url => {
          console.log(url)
          data.content.file[0] = { name: '凭证', url: url }
          data.content.info.resultVoucher = url
          data.voucher.unshift({ voucherName: '凭证', voucherPath: url })
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
          data.voucher.unshift({ voucherName: '好评图', voucherPath: url })
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
        resultApply: null,
        shield: null,
        pkId: 0,
        remark: undefined,
        story: undefined,
        applySeason: undefined,
        // interviewDate:undefined,
        city: undefined,
        division: undefined,
        company: undefined
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
