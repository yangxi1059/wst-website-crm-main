<!--
 * @Author: 库建华
 * @Date: 2020-05-13 10:04:53
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-07 11:59:51
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="课程" :visible.sync="setVisible" width="900px" :before-close="close">
      <el-form
        :inline="true"
        ref="signTable"
        label-width="140px"
        :rules="rules"
        :model="sessionData"
      >
        <el-form-item label="课程主题" prop="sessionTopic">
          <el-input :style="{width:'610px'}" v-model="sessionData.sessionTopic" ::="255"></el-input>
        </el-form-item>
        <el-form-item label="课程内容" prop="sessionContent">
          <el-input
            type="textarea"
            :autosize="{minRows:3,maxRows:10}"
            :style="{width:'610px'}"
            v-model="sessionData.sessionContent"
          ></el-input>
        </el-form-item>
        <el-form-item label="主讲人" prop="speaker">
          <el-input :style="{width:'610px'}" v-model="sessionData.speaker" :maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="主讲人介绍" prop="speakerIntroduction">
          <el-input
            type="textarea"
            :autosize="{minRows:3,maxRows:10}"
            :style="{width:'610px'}"
            :maxlength="255"
            v-model="sessionData.speakerIntroduction"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程开始时间" prop="sessionTime">
          <el-date-picker
            v-model="sessionData.sessionTime"
            :style="{width:'230px'}"
            type="datetime"
            placeholder="选择开始时间"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="课程结束时间" prop>
          <el-date-picker
            v-model="endTime"
            :style="{width:'230px'}"
            type="datetime"
            placeholder="结束时间"
            :clearable="false"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="课程时长（小时）" prop="sessionHour">
          <el-select :style="{width:'230px'}" v-model="sessionData.sessionHour" placeholder="课程时长">
            <el-option v-for="item in 10" :key="item/2" :label="item/2" :value="item/2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所需课时" prop="needHour">
          <el-input-number
            :controls="false"
            :style="{width:'230px'}"
            v-model="sessionData.needHour"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="报名人数限制" prop="limitNum">
          <el-input-number
            :controls="false"
            :style="{width:'230px'}"
            v-model="sessionData.limitNum"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="课程类型" prop="sessionType">
          <!-- <el-select
            :style="{width:'230px'}"
            class="mr10"
            v-model="sessionData.sessionType"
            placeholder="课程类型"
          >
            <el-option
              v-for="item in session_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>-->
          <el-checkbox-group v-model="sessionData.sessionType">
            <el-checkbox
              v-for="item in session_type"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="允许邀请码报名" prop="invitationCodeStatus">
          <el-select :style="{width:'230px'}" v-model="sessionData.invitationCodeStatus" placeholder="">
            <el-option v-for="item in common_yes_or_no" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间二维码:" style="display:flex">
          <el-image style="width: 100px; height: auto; " v-if="showImg" fit="contain" :src="showImg"></el-image>
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-change="change"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
import files from '@/libs/file'

export default {
  props: {
    setVisible: {
      type: Boolean,
      default: false
    },
    seminarId: {
      type: String,
      default: ''
    },
    sessionId: {
      type: String,
      default: ''
    }
  },
  mixins: [mixins],
  data () {
    return {
      fileList: [],
      sessionData: {
        sessionType: [],
        invitationCodeStatus: ''
      },
      rules: {
        sessionTopic: [{ required: true, message: '必填', trigger: 'blur' }],
        sessionContent: [{ required: true, message: '必填', trigger: 'blur' }],
        sessionTime: [{ required: true, message: '必填', trigger: 'blur' }],
        sessionEndTime: [{ required: true, message: '必填', trigger: 'blur' }],
        sessionHour: [{ required: true, message: '必填', trigger: 'blur' }],
        needHour: [{ required: true, message: '必填', trigger: 'blur' }],
        speaker: [{ required: true, message: '必填', trigger: 'blur' }],
        limitNum: [{ required: true, message: '必填', trigger: 'blur' }],
        sessionType: [{ required: true, message: '必填', trigger: 'blur' }],
        invitationCodeStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        sessionStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        speakerIntroduction: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      session_type: [],
      session_status: [],
      common_yes_or_no: [],
      showImg: ''
    }
  },
  watch: {
    setVisible: function (val) {
      if (val) {
        this.initPage()
        this.pageInit()
      }
    }
  },
  computed: {
    endTime: function () {
      const tt =
        new Date(this.sessionData.sessionTime).getTime() +
        this.sessionData.sessionHour * 60 * 60 * 1000
      return tt
    }
  },
  mounted () {
  },
  methods: {
    async pageInit () {
      this.session_status = await this.getDictionary('session_status')
      this.session_type = await this.getDictionary('session_type')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      console.log(this.common_yes_or_no)
    },
    initPage () {
      if (this.sessionId) {
        this.getSeminar()
      }
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    change (file, fileList) {
      this.fileList = fileList.slice(-1)
      console.log(this.fileList, fileList)
      // this.sessionData.roomCodeName = file.name
    },
    getSeminar () {
      this.$loading()
      api.getSeminarSessionById(this.sessionId).then(res => {
        console.log(res)
        this.sessionData = res.data || {}
        if (res.data.roomCode) {
          files.returnImgSrc(res.data.roomCode, url => {
            console.log(url)
            this.showImg = url
          })
        }
        this.sessionData.sessionType = this.sessionData.sessionType.split(',')
        this.$loading().close()
      })
    },
    clean () {
      this.showImg = ''
      this.fileList = []
      this.sessionData = {
        sessionType: [],
        invitationCodeStatus: ''
      }
      this.$refs.signTable.resetFields()
    },
    close () {
      this.$emit('close')
      this.clean()
    },
    submit () {
      console.log(this.sessionData)
      this.sessionData.seminarId = this.seminarId
      this.$refs.signTable.validate(valid => {
        if (!valid) return
        this.sessionData.sessionType = this.sessionData.sessionType.join(',')
        this.sessionData.sessionEndTime = this.endTime

        this.$loading()
        if (this.fileList.length > 0) {
          files.uploadFunBySys(this.fileList[0].raw, `mentee/roomCode/${this.sessionId || this.seminarId || 'abc'}_` + Math.random().toString().slice(-3), (url) => {
            console.log(url)
            this.sessionData.roomCode = url
            this.fileList = []
            this.submitAll()
          })
        } else {
          this.fileList = []
          this.submitAll()
        }
      })
    },
    submitAll () {
      console.log(this.sessionData)
      if (!this.sessionId) {
        api.addSeminarSession(this.sessionData).then(res => {
          console.log(res)
          this.$loading().close()
          this.$emit('submit')
          this.clean()
        })
      } else {
        api.uptSeminarSession(this.sessionData).then(res => {
          console.log(res)
          this.$loading().close()
          this.$emit('submit')
          this.clean()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
