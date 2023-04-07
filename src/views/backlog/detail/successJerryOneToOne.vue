<!--
 * @Author: 杨曦
 * @Date: 2023-01-11 16:15:38
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-11 16:17:44
 * @Version: 
 * @Description: 
-->
<!--
 * @Author: 库建华
 * @Date: 2020-06-17 15:08:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 11:04:39
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="已完成Jerry一对多课时申请" :visible.sync="auditOneToOneVisible" width="900px" :before-close="close">
        <el-card  class="mb10" v-if="mentorData.qaArr && mentorData.qaArr.length > 0 &&mentorData.qaArr[0] && mentorData.qaArr[0].menteeId">
            <el-checkbox size="medium" v-model="checked0"></el-checkbox>
            <el-form
                :inline="true"
                size="mini"
                class="yxlabelWeight"
                ref="ruleForm"
                label-width="200px"
            >
                <el-form-item label="学员名：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[0].nickName || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员微信：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[0].menteeAcc || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员报名时间：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[0].applyTime || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员QA时间段：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[0].startTime.slice(11,16) || '暂无'}} - {{mentorData.qaArr[0].endTime.slice(11,16) || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员总计时长：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{Math.round(mentorData.qaLength + mentorData.summaryLength/mentorData.applyLimit)}}（分钟）</div>
                </el-form-item>
                <div style="width:460px;margin-left:100px" v-if="checked0">
                    <el-upload
                        :http-request="uploadFileAxios0"
                        :file-list="fileList0"
                        style="margin:0 auto"
                        class="upload yxuploaddas mt20"
                        ref="elupload0"
                        :on-remove="removeFile0"
                        action
                        drag
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </div>
            </el-form>
        </el-card>
        <el-card  class="mb10" v-if="mentorData.qaArr && mentorData.qaArr.length > 0 &&mentorData.qaArr[1] && mentorData.qaArr[1].menteeId">
            <el-checkbox size="medium" v-model="checked1"></el-checkbox>
            <el-form
                :inline="true"
                size="mini"
                class="yxlabelWeight"
                ref="ruleForm"
                label-width="200px"
            >
                <el-form-item label="学员名：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[1].nickName || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员微信：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[1].menteeAcc || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员报名时间：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[1].applyTime || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员QA时间段：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[1].startTime.slice(11,16) || '暂无'}} - {{mentorData.qaArr[1].endTime.slice(11,16) || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员总计时长：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{Math.round(mentorData.qaLength + mentorData.summaryLength/mentorData.applyLimit)}}（分钟）</div>
                </el-form-item>
                <div style="width:460px;margin-left:100px" v-if="checked1">
                    <el-upload
                        :http-request="uploadFileAxios1"
                        :file-list="fileList1"
                        style="margin:0 auto"
                        class="upload yxuploaddas mt20"
                        ref="elupload1"
                        action
                        drag
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </div>
            </el-form>
        </el-card>
        <el-card  class="mb10" v-if="mentorData.qaArr && mentorData.qaArr.length > 0 &&mentorData.qaArr[2] && mentorData.qaArr[2].menteeId">
            <el-checkbox size="medium" v-model="checked2"></el-checkbox>
            <el-form
                :inline="true"
                size="mini"
                class="yxlabelWeight"
                ref="ruleForm"
                label-width="200px"
            >
                <el-form-item label="学员名：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[2].nickName || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员微信：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[2].menteeAcc || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员报名时间：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[2].applyTime || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员QA时间段：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[2].startTime.slice(11,16) || '暂无'}} - {{mentorData.qaArr[2].endTime.slice(11,16) || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员总计时长：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{Math.round(mentorData.qaLength + mentorData.summaryLength/mentorData.applyLimit)}}（分钟）</div>
                </el-form-item>
                <div style="width:460px;margin-left:100px" v-if="checked2">
                    <el-upload
                        :http-request="uploadFileAxios2"
                        :file-list="fileList2"
                        style="margin:0 auto"
                        class="upload yxuploaddas mt20"
                        ref="elupload2"
                        action
                        drag
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </div>
            </el-form>
        </el-card>
        <el-card  class="mb10" v-if="mentorData.qaArr && mentorData.qaArr.length > 0 &&mentorData.qaArr[3] && mentorData.qaArr[3].menteeId">
            <el-checkbox size="medium" v-model="checked3"></el-checkbox>
            <el-form
                :inline="true"
                size="mini"
                class="yxlabelWeight"
                ref="ruleForm"
                label-width="200px"
            >
                <el-form-item label="学员名：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[3].nickName || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员微信：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[3].menteeAcc || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员报名时间：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[3].applyTime || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员QA时间段：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[3].startTime.slice(11,16) || '暂无'}} - {{mentorData.qaArr[3].endTime.slice(11,16) || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员总计时长：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{Math.round(mentorData.qaLength + mentorData.summaryLength/mentorData.applyLimit)}}（分钟）</div>
                </el-form-item>
                <div style="width:460px;margin-left:100px" v-if="checked3">
                    <el-upload
                        :http-request="uploadFileAxios3"
                        :file-list="fileList3"
                        style="margin:0 auto"
                        class="upload yxuploaddas mt20"
                        ref="elupload3"
                        action
                        drag
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </div>
            </el-form>
        </el-card>
        <el-card  class="mb10" v-if="mentorData.qaArr && mentorData.qaArr.length > 0 &&mentorData.qaArr[4] && mentorData.qaArr[4].menteeId">
            <el-checkbox size="medium" v-model="checked4"></el-checkbox>
            <el-form
                :inline="true"
                size="mini"
                class="yxlabelWeight"
                ref="ruleForm"
                label-width="200px"
            >
                <el-form-item label="学员名：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[4].nickName || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员微信：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[4].menteeAcc || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员报名时间：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[4].applyTime || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员QA时间段：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{mentorData.qaArr[4].startTime.slice(11,16) || '暂无'}} - {{mentorData.qaArr[4].endTime.slice(11,16) || '暂无'}}</div>
                </el-form-item>
                <el-form-item label="学员总计时长：" >
                    <div :style="{width:widths}" style="padding-left:5px">{{Math.round(mentorData.qaLength + mentorData.summaryLength/mentorData.applyLimit)}}（分钟）</div>
                </el-form-item>
                <div style="width:460px;margin-left:100px" v-if="checked4">
                    <el-upload
                        :http-request="uploadFileAxios4"
                        :file-list="fileList4"
                        style="margin:0 auto"
                        class="upload yxuploaddas mt20"
                        ref="elupload4"
                        action
                        drag
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </div>
            </el-form>
        </el-card>
        <el-form>
            <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
            <el-select
                :style="{width:'180px'}"
                size="medium"
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
        <span slot="footer">
            <el-button @click="close">关 闭</el-button>
            <el-button @click="submit" type="primary">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/backlog.js'
import { uploadFun } from '@/libs/file'
import apiDic from '@/api/dictionary.js'

export default {
  name: 'mentor',
  components: {
  },
  props: {
    auditOneToOneVisible: {
      type: Boolean,
      default: false
    },
    pkId: {
    }
  },
  watch: {
    auditOneToOneVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  data () {
    return {
      widths: '130px',
      mentorData: {

      },
      pkIdNew: '',
      checked0: false,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      progress: 0,
      fileList0: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileData0: [],
      fileData1: [],
      fileData2: [],
      fileData3: [],
      fileData4: [],
      menteeText0: {},
      menteeText1: {},
      menteeText2: {},
      menteeText3: {},
      menteeText4: {},
      textData0: {},
      textData1: {},
      textData2: {},
      textData3: {},
      textData4: {},
      content: [],
      info: [],
      file: [],
      text: [],
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
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  mounted () {
    apiDic.getAuditorListByApplyType('vip_office_hour_lesson').then(res => {
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
  },
  methods: {
    initPage () {
      console.log(this.pkId)
      this.pkIdNew = JSON.parse(JSON.stringify(this.pkId))
      const data = {
        pkId: this.pkIdNew
      }
      api.getJerryOneTooneLessonsDetail(data).then(res => {
        console.log(res, 'yx46546545')
        this.mentorData = res.data
      })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.checked0 = false
      this.checked1 = false
      this.checked2 = false
      this.checked3 = false
      this.checked4 = false
      this.fileList0 = []
      this.fileList1 = []
      this.fileList2 = []
      this.fileList3 = []
      this.fileList4 = []
      this.fileData0 = []
      this.fileData1 = []
      this.fileData2 = []
      this.fileData3 = []
      this.fileData4 = []
      this.menteeText0 = {}
      this.menteeText1 = {}
      this.menteeText2 = {}
      this.menteeText3 = {}
      this.menteeText4 = {}
      this.textData0 = {}
      this.textData1 = {}
      this.textData2 = {}
      this.textData3 = {}
      this.textData4 = {}
      this.mentorData = {}
      this.info = []
      this.file = []
      this.text = []
      this.content = []
    },
    uploadFileAxios0 (file, fileList) {
      console.info(file, fileList)
      const that = this
      uploadFun(
        file.file,
        `internShip/${this.pkId}`,
        p => {
        },
        url => {
          console.log(url)
          const data = {
            label: file.file.name,
            value: url,
            uid: file.file.uid
          }
          this.fileData0.push(data)
          this.$loading().close()
        }
      )
    },
    uploadFileAxios1 (file, fileList) {
      console.info(file, fileList)
      const that = this
      uploadFun(
        file.file,
        `internShip/${this.pkId}`,
        p => {
        },
        url => {
          console.log(url)
          const data = {
            label: file.file.name,
            value: url,
            uid: file.file.uid
          }
          this.fileData1.push(data)
          this.$loading().close()
        }
      )
    },
    uploadFileAxios2 (file, fileList) {
      console.info(file, fileList)
      const that = this
      uploadFun(
        file.file,
        `internShip/${this.pkId}`,
        p => {
        },
        url => {
          console.log(url)
          const data = {
            label: file.file.name,
            value: url,
            uid: file.file.uid
          }
          this.fileData2.push(data)
          this.$loading().close()
        }
      )
    },
    uploadFileAxios3 (file, fileList) {
      console.info(file, fileList)
      const that = this
      uploadFun(
        file.file,
        `internShip/${this.pkId}`,
        p => {
        },
        url => {
          console.log(url)
          const data = {
            label: file.file.name,
            value: url,
            uid: file.file.uid
          }
          this.fileData3.push(data)
          this.$loading().close()
        }
      )
    },
    uploadFileAxios4 (file, fileList) {
      console.info(file, fileList)
      const that = this
      uploadFun(
        file.file,
        `internShip/${this.pkId}`,
        p => {
        },
        url => {
          console.log(url)
          const data = {
            label: file.file.name,
            value: url,
            uid: file.file.uid
          }
          this.fileData4.push(data)
          this.$loading().close()
        }
      )
    },
    removeFile0 (file, fileList) {
      console.log(file, fileList, this.fileData0)
      for (let i = 0; i < this.fileData0.length; i++) {
        if (file.uid == this.fileData0[i].uid) {
          this.fileData0.splice(i, 1)
        }
      }
      console.log(this.fileData0, 1111111111)
    },
    removeFile1 (file, fileList) {
      console.log(file, fileList, this.fileData1)
      for (let i = 0; i < this.fileData1.length; i++) {
        if (file.uid == this.fileData1[i].uid) {
          this.fileData1.splice(i, 1)
        }
      }
      console.log(this.fileData1, 1111111111)
    },
    removeFile2 (file, fileList) {
      console.log(file, fileList, this.fileData2)
      for (let i = 0; i < this.fileData2.length; i++) {
        if (file.uid == this.fileData2[i].uid) {
          this.fileData2.splice(i, 1)
        }
      }
      console.log(this.fileData2, 1111111111)
    },
    removeFile3 (file, fileList) {
      console.log(file, fileList, this.fileData3)
      for (let i = 0; i < this.fileData3.length; i++) {
        if (file.uid == this.fileData3[i].uid) {
          this.fileData3.splice(i, 1)
        }
      }
      console.log(this.fileData3, 1111111111)
    },
    removeFile4 (file, fileList) {
      console.log(file, fileList, this.fileData4)
      for (let i = 0; i < this.fileData4.length; i++) {
        if (file.uid == this.fileData4[i].uid) {
          this.fileData4.splice(i, 1)
        }
      }
      console.log(this.fileData4, 1111111111)
    },
    submit () {
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
      if (!(this.checked0 || this.checked1 || this.checked2 || this.checked3 || this.checked4)) {
        this.$message({
          message: '请勾选至少一个学员审核',
          type: 'warning'
        })
        return false
      }
      if (this.fileData0.length < 0 || this.fileData1.length < 0 || this.fileData2.length < 0 || this.fileData3.length < 0 || this.fileData4.length < 0) {
        this.$message({
          message: '提交审核凭证不能为空',
          type: 'warning'
        })
        return false
      }
      if ((this.checked0)) {
        if (this.fileData0.length <= 0) {
          this.$message({
            message: '已勾选提交的审核凭证不能为空（当前学员一）',
            type: 'warning'
          })
          return false
        }
      }
      console.log(this.checked1, this.fileData1.length)
      if ((this.checked1)) {
        if (this.fileData1.length <= 0) {
          this.$message({
            message: '已勾选提交的审核凭证不能为空（当前学员二）',
            type: 'warning'
          })
          return false
        }
      }
      if ((this.checked2)) {
        if (this.fileData2.length <= 0) {
          this.$message({
            message: '已勾选提交的审核凭证不能为空（当前学员三）',
            type: 'warning'
          })
          return false
        }
      }
      if ((this.checked3)) {
        if (this.fileData3.length <= 0) {
          this.$message({
            message: '已勾选提交的审核凭证不能为空（当前学员四）',
            type: 'warning'
          })
          return false
        }
      }
      if ((this.checked4)) {
        if (this.fileData4.length <= 0) {
          this.$message({
            message: '已勾选提交的审核凭证不能为空（当前学员五）',
            type: 'warning'
          })
          return false
        }
      }
      this.$loading()
      if (this.checked0) {
        const data1 = [
          { label: '学员名', value: this.mentorData.qaArr[0].nickName },
          { label: '学员微信号', value: this.mentorData.qaArr[0].menteeAcc },
          { label: '学员开始上课时间', value: this.mentorData.qaArr[0].startTime },
          { label: '学员报名时间', value: this.mentorData.qaArr[0].applyTime },
          { label: '学员PM', value: this.mentorData.qaArr[0].servicesName }
        ]
        this.textData0 = {
          qaId: this.mentorData.qaArr[0].qaId,
          settleMentee: this.mentorData.qaArr[0].menteeId,
          signId: this.mentorData.qaArr[0].signId,
          lessonHours: ((Math.round(((this.mentorData.qaLength + this.mentorData.summaryLength / this.mentorData.applyLimit) / 60) * 100)) / 100).toFixed(2),
          settleMentor: this.mentorData.lessonMentor,
          lessonDate: this.mentorData.startTime,
          lessonName: this.mentorData.lessonName
        }
        this.info.push(this.textData0)
        this.content.push({
          text: data1,
          file: this.fileData0,
          info: this.textData0
        })
      }
      if (this.checked1) {
        const data1 = [
          { label: '学员名', value: this.mentorData.qaArr[1].nickName },
          { label: '学员微信号', value: this.mentorData.qaArr[1].menteeAcc },
          { label: '学员开始上课时间', value: this.mentorData.qaArr[1].startTime },
          { label: '学员报名时间', value: this.mentorData.qaArr[1].applyTime },
          { label: '学员PM', value: this.mentorData.qaArr[1].servicesName }
        ]
        this.textData1 = {
          qaId: this.mentorData.qaArr[1].qaId,
          settleMentee: this.mentorData.qaArr[1].menteeId,
          signId: this.mentorData.qaArr[1].signId,
          lessonHours: ((Math.round(((this.mentorData.qaLength + this.mentorData.summaryLength / this.mentorData.applyLimit) / 60) * 100)) / 100).toFixed(2),
          settleMentor: this.mentorData.lessonMentor,
          lessonDate: this.mentorData.startTime,
          lessonName: this.mentorData.lessonName
        }
        this.info.push(this.textData1)
        this.content.push({
          text: data1,
          file: this.fileData1,
          info: this.textData1
        })
      }
      if (this.checked2) {
        const data1 = [
          { label: '学员名', value: this.mentorData.qaArr[2].nickName },
          { label: '学员微信号', value: this.mentorData.qaArr[2].menteeAcc },
          { label: '学员开始上课时间', value: this.mentorData.qaArr[2].startTime },
          { label: '学员报名时间', value: this.mentorData.qaArr[2].applyTime },
          { label: '学员PM', value: this.mentorData.qaArr[2].servicesName }
        ]
        this.textData2 = {
          qaId: this.mentorData.qaArr[2].qaId,
          settleMentee: this.mentorData.qaArr[2].menteeId,
          signId: this.mentorData.qaArr[2].signId,
          lessonHours: ((Math.round(((this.mentorData.qaLength + this.mentorData.summaryLength / this.mentorData.applyLimit) / 60) * 100)) / 100).toFixed(2),
          settleMentor: this.mentorData.lessonMentor,
          lessonDate: this.mentorData.startTime,
          lessonName: this.mentorData.lessonName
        }
        this.info.push(this.textData2)
        this.content.push({
          text: data1,
          file: this.fileData2,
          info: this.textData2
        })
      }
      if (this.checked3) {
        const data1 = [
          { label: '学员名', value: this.mentorData.qaArr[3].nickName },
          { label: '学员微信号', value: this.mentorData.qaArr[3].menteeAcc },
          { label: '学员开始上课时间', value: this.mentorData.qaArr[3].startTime },
          { label: '学员报名时间', value: this.mentorData.qaArr[3].applyTime },
          { label: '学员PM', value: this.mentorData.qaArr[3].servicesName }
        ]
        this.textData3 = {
          qaId: this.mentorData.qaArr[3].qaId,
          settleMentee: this.mentorData.qaArr[3].menteeId,
          signId: this.mentorData.qaArr[3].signId,
          lessonHours: ((Math.round(((this.mentorData.qaLength + this.mentorData.summaryLength / this.mentorData.applyLimit) / 60) * 100)) / 100).toFixed(2),
          settleMentor: this.mentorData.lessonMentor,
          lessonDate: this.mentorData.startTime,
          lessonName: this.mentorData.lessonName
        }
        this.info.push(this.textData3)
        this.content.push({
          text: data1,
          file: this.fileData3,
          info: this.textData3
        })
      }
      if (this.checked4) {
        const data1 = [
          { label: '学员名', value: this.mentorData.qaArr[4].nickName },
          { label: '学员微信号', value: this.mentorData.qaArr[4].menteeAcc },
          { label: '学员开始上课时间', value: this.mentorData.qaArr[4].startTime },
          { label: '学员报名时间', value: this.mentorData.qaArr[4].applyTime },
          { label: '学员PM', value: this.mentorData.qaArr[4].servicesName }
        ]
        this.textData4 = {
          qaId: this.mentorData.qaArr[4].qaId,
          settleMentee: this.mentorData.qaArr[4].menteeId,
          signId: this.mentorData.qaArr[4].signId,
          lessonHours: ((Math.round(((this.mentorData.qaLength + this.mentorData.summaryLength / this.mentorData.applyLimit) / 60) * 100)) / 100).toFixed(2),
          settleMentor: this.mentorData.lessonMentor,
          lessonDate: this.mentorData.startTime,
          lessonName: this.mentorData.lessonName
        }
        this.info.push(this.textData4)
        this.content.push({
          text: data1,
          file: this.fileData4,
          info: this.textData4
        })
      }
      const data = {
        applyType: 'jerry_one_on_one_lesson',
        keyId: this.mentorData.lessonId,
        applyTitle: `导师【${this.mentorData.lessonMentorName}】的Jerry一对多课程申请`,
        approval: approval,
        copyTo: [],
        content: {
          file: [],
          text: [
            { label: '课程名', value: this.mentorData.lessonName },
            { label: '课程介绍', value: this.mentorData.lessonIntro },
            { label: '课程ZoomId', value: this.mentorData.lessonKey },
            { label: '导师名', value: this.mentorData.lessonMentorName },
            { label: '课程开始时间', value: this.mentorData.startTime },
            { label: '单个QA时长', value: `${this.mentorData.qaLength}分钟` },
            { label: '课程总结时长', value: `${this.mentorData.summaryLength}分钟` },
            { label: '课程已完成人数', value: this.mentorData.applyNum }
          ],
          info: this.info,
          oneTooneApplyArr: this.content
        }
      }
      console.log(data, '提交申请的数据yx************')
      // this.$loading().close()
      api.oneToOneLessonsApply(data).then(res => {
        this.clear()
        console.log(res)
        this.$loading().close()
        this.$message({
          message: '申请成功，等待审核！',
          type: 'success'
        })
        this.$emit('success')
      }).catch(err => {
        this.$message({
          message: '申请失败请重新申请',
          type: 'error'
        })
        this.clear()
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
