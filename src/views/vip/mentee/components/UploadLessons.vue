<template>
  <el-dialog class="yx_upload_new"
    width="1150px"
    :visible="inputExcelShow"
    :title="'导入课表文件'"
    :close-on-click-modal="false"
    :before-close="uploadFileClose"
  >
    <el-steps :active="stepsActive" finish-status="success" align-center class="mb10">
      <el-step title="上传文件"></el-step>
      <el-step title="课表编辑"></el-step>
    </el-steps>
    <div class="upload_form" v-if="stepsActive == 0">
      <div style="display:flex">
        <div style="flex:1">
          <div class="mb20">
            <el-radio v-model="radio" label="1">模板一</el-radio>
            <el-radio v-model="radio" label="2">模板二</el-radio>
          </div>
          <div v-if="radio == '1'" style="">
            <el-image  style="width: 100%;text-align:center " :src="`${require('@/assets/img/template_xlsx1.png')}`" :fit="'cover'"></el-image>
            <div style="width:100%;text-align:center">
              <el-button  size="mini" plain type="danger" @click="downModel1" >下载模板一</el-button>
            </div>
          </div>
          <div v-if="radio == '2'" style="text-align:center">
            <el-image  style="width: 100%;text-align:center " :src="`${require('@/assets/img/template_xlsx2.png')}`" :fit="'cover'"></el-image>
            <div  style="width:100%;text-align:center">
              <el-button size="mini" plain type="danger" @click="downModel2" >下载模板二</el-button>
            </div>
          </div>
        </div>
        <div style="flex:1">
          <el-form ref="formTable"
            :rules="rules"
            :model="ruleForm"
          >
            <el-form-item prop="mentorId" label="课程导师：" label-width="100px">
              <el-select v-model="ruleForm.mentorId" @change="mentorChange" placeholder="请选择" :style="{width:'360px'}">
                <el-option
                  v-for="item in mentorData"
                  :key="item.mentorId"
                  :label="item.mentorName"
                  :value="item.mentorId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文 件：" label-width="100px">
              <!-- :http-request="Upload" -->
              <el-upload
                :http-request="uploadFileAxios"
                :file-list="fileList"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :headers="header"
                class="upload"
                ref="elupload"
                :action="action"
                drag
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__text">只能上传xlsx格式文件</div>
              </el-upload>
            </el-form-item>
            <div style="text-align:center">
                <i class="el-icon-warning" type="danger"></i>
                课表不可二次上传，后续通过CRM或导师端录入
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div style="max-height:300px;overflow:auto" v-if="stepsActive == 1">
      <vxe-table
        :data="settingsdic.data"
        size="mini"
        highlight-current-row
        :scroll-y="{enabled:false}"
        :keep-source="true"
        style="width: 100%"
        ref="dragTable"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
        @edit-closed="editClosedEvent"
      >
        <vxe-table-column field="" align="left"  title="操作" min-width="80">
          <template v-slot="{ row, rowIndex }">
            <el-button type="text" @click="deleteLine(row,rowIndex)">删除</el-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="lessonName" align="left"  title="课程名称" min-width="180" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="lessonContent" align="left"  title="课程内容" min-width="240px" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="lessonDate" align="left"  title="课程日期" width="100" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="lessonHours" align="left" title="课程时长" width="100" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="beginTime" align="left" title="开始时间" width="100" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="endTime" align="left" title="结束时间" width="100" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="homework" align="left" title="家庭作业" min-width="80" :edit-render="{name: 'input'}"></vxe-table-column>
      </vxe-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="uploadFileClose">取 消</el-button>
      <el-button type="primary" @click="uploadXlsx" v-if="stepsActive == 0 && btnStatus">下一步</el-button>
      <el-button type="primary" @click="submitXlsx" v-if="stepsActive == 1">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import aes from '@/plugin/aes_rsa/aes_ecb.js'
import api from '@/api/vip.js'

export default {
  name: 'uploadFile',
  props: {
    inputExcelShow: {
      type: Boolean,
      default: false
    },
    signId: {},
    lessonType: {},
    mentorData: {}
  },
  data () {
    var dateExp = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/
    var timeExp = /^((?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9])$/
    return {
      radio: '2',
      btnStatus: false,
      stepsActive: 0,
      fileList: [],
      fileData: {},
      rules: {
        mentorId: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      ruleForm: {
        mentorId: ''
      },
      data: null,
      uploadFile: null,
      action: '',
      header: {
        Authorization: ''
      },
      mentorList: [],

      settingsdic: {
        data: []
      },
      validRules: {
        lessonName: [{ required: true, message: '请输入课程名称' }],
        lessonDate: [{ required: true, message: '请输入课程日期' }, { pattern: dateExp, message: '日期格式XXXX-XX-XX' }],
        beginTime: [{ pattern: timeExp, message: '时间格式XX:XX' }],
        endTime: [{ pattern: timeExp, message: '时间格式XX:XX' }],
        lessonHours: [{ required: true, message: '请输入课程时长' }]
      }
    }
  },
  computed: {},
  mounted () {
    this.header.Authorization = this.$store.state.role.token
  },
  watch: {
  },
  methods: {
    Upload ({ file }) {
      console.log(file)
      this.fileData.file = file
      this.fileData.size = file.size
      this.fileData.type = file.type
      this.fileData.name = file.name
    },
    handleChange (file, fileList) {
      this.fileData.file = file
      this.fileData.size = file.size
      this.fileData.type = file.type
      this.fileData.name = file.name
      this.fileList = fileList.slice(-1)
    },
    handleRemove (file, fileList) {
      if (!fileList.length) {
        this.fileData = {}
      }
    },
    uploadFileClose () {
      this.btnStatus = false
      console.log('uploadClose')
      this.data = null
      this.uploadFile = null
      this.ruleForm.mentorId = ''
      this.$refs.elupload ? this.$refs.elupload.clearFiles() : ''
      this.$refs.dragTable ? this.$refs.dragTable.clearSort() : ''
      this.fileList = []
      this.stepsActive = 0
      this.$emit('close')
    },

    uploadXlsx () {
      if (!this.data) {
        this.$message.error('文件为必传~~')
        return false
      }
      this.$refs.formTable.validate((valid) => {
        if (valid) {
          let str = ''
          if (this.radio == '1') {
            str = 'lesson/impLessonAndReturn'
          } else {
            str = 'lesson/impLessonAndReturnV3'
          }
          this.action = this.$apiUrl + `${str}?lessonType=${this.lessonType}`
          const formData = {
            uploadFile: this.data
          }
          if (!/\.xlsx$/.test(this.data.get('uploadFile').name)) {
            this.$message({
              type: 'error',
              message: '格式不支持，请先另存为xlsx格式文件'
            })
            this.$refs.elupload.clearFiles()
            this.fileList = []
            return
          }
          this.$loading()
          axios
            .post(
              this.action,
              this.data,
              // { source: data },
              {
                headers: {
                  Authorization: this.$store.state.role.token,
                  version: this.$apiVersion,
                  'Content-Type': 'multipart/form-data'
                }
              }
            )
            .then(res => {
              if (res.data.code == 200) {
                // todo
                this.data = null
                this.uploadFile = null
                this.$refs.elupload.clearFiles()
                this.fileList = []
                this.$loading().close()
                this.settingsdic.data = aes.decrypt(res.data.data, res.data.key)
                this.stepsActive++
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
                this.data = null
                this.uploadFile = null
                this.$refs.elupload.clearFiles()
                this.fileList = []
                this.$loading().close()
              }
            }).catch(err => {
              this.$message({
                type: 'error',
                message: err.message
              })
            })
        }
      })
    },
    uploadFileAxios (file, fileList) {
      this.data = new FormData()
      this.data.append('uploadFile', file.file)
      this.uploadFile = file.file
      // data.append("file", file.file);
      console.log(file, this.data, this.data.get('uploadFile'))
    },
    // 下载模板
    downModel1 () {
      if (this.$apiUrl.indexOf('wallstreettequila') == '-1') {
        const url = 'https://pageguo.com/download/template/lesson-excel-template-v2.xlsx'
        window.open(url)
      } else {
        const url = 'https://wallstreettequila.com/download/template/lesson-excel-template-v2.xlsx'
        window.open(url)
      }
    },
    downModel2 () {
      if (this.$apiUrl.indexOf('wallstreettequila') == '-1') {
        const url = 'https://pageguo.com/download/template/lesson-excel-template-v3.xlsx'
        window.open(url)
      } else {
        const url = 'https://wallstreettequila.com/download/template/lesson-excel-template-v3.xlsx'
        window.open(url)
      }
    },
    editClosedEvent () {},
    /**
     * @description: table验证
     * @param {*}
     * @return {*}
     */
    async fullValidEvent () {
      const $table = this.$refs.dragTable
      const errMap = await $table.validate(true).catch(errMap => errMap)
      if (errMap) {
        const msgList = []
        Object.values(errMap).forEach(errList => {
          errList.forEach(params => {
            const { rowIndex, column, rules } = params
            rules.forEach(rule => {
              msgList.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
            })
          })
        })
        this.$message({
          type: 'error',
          message: h('div', {
            style: {
              maxHeight: '400px',
              overflow: 'auto'
            }
          }, [
            h('div', { style: { color: 'red' } }, msgList.map(msg => <div>{ msg }</div>))
          ])
        })
        return false
      } else {
        this.$message({ type: 'success', message: '校验成功！' })
        return true
      }
    },
    async submitXlsx () {
      if (!await this.fullValidEvent()) { return }
      const lessonData = JSON.parse(JSON.stringify(this.settingsdic.data))
      lessonData.forEach(v => {
        if (v.beginTime) { v.beginTime = `${v.lessonDate} ${v.beginTime}:00` }
        if (v.endTime) { v.endTime = `${v.lessonDate} ${v.endTime}:00` }
        v.settleMentor = this.ruleForm.mentorId
        v.signId = this.signId
      })
      api.impLessonList(lessonData, this.lessonType).then((res) => {
        if (res.code == '200') {
          this.$message({ type: 'success', message: '上传成功' })
          this.uploadFileClose()
          this.$emit('submit')
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    deleteLine (row, rowIndex) {
      this.settingsdic.data.splice(rowIndex, 1)
    },
    mentorChange () {
      this.mentorData && this.mentorData.forEach(item => {
        if (item.mentorId == this.ruleForm.mentorId && item.hasSchedule) {
          this.$alert('请先核验预排课', '警告', {
            confirmButtonText: '前往核验',
            callback: action => {
              this.$emit('check')
              this.uploadFileClose()
            }
          })
        } else {
          this.btnStatus = true
        }
      })
    }
  }
}
</script>

<style lang="scss">
.upload_form{
  display: flex;
  justify-content: center;
}
.upload {
  align-items: center;
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
}
.yx_upload_new{
    .el-upload{
        display: block;
        width: 400px;
    }
}
.vxe-table--tooltip-wrapper{
  z-index: 2200!important;
}
</style>
