<!--
 * @Author: 库建华
 * @Date: 2019-11-14 15:12:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 11:32:43
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="this.noticeId ? '更新通知' : '新增通知'"
      :visible="noticeVisible"
      :before-close="close"
    >
      <el-form :model="noticeData" size="mini" ref="fromVerify" :rules="rules">
        <el-form-item prop="noticeTitle" label="通知标题">
          <el-input v-model="noticeData.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item prop="noticeContent" label="通知内容">
          <el-input type="textarea" :autosize="{min:2}" v-model="noticeData.noticeContent"></el-input>
        </el-form-item>
        <el-form-item prop="noticeStatus" label="通知状态">
          <el-select v-model="noticeData.noticeStatus">
            <el-option
              v-for="item in notice_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/login.js'
import mixins from '@/plugin/mixins'

export default {
  props: {
    noticeId: {
      type: Number,
      default: ''
    },
    noticeVisible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      noticeData: {
        noticeId: null,
        noticeTitle: null,
        noticeContent: null,
        noticeStatus: '1'
      },
      notice_status: [],
      rules: {
        noticeTitle: [{ required: true, message: '必填', trigger: 'blur' }],
        noticeContent: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    noticeVisible: function (v) {
      this.pageInit()
      if (v && this.noticeId) {
        this.initFrom()
      }
    }
  },
  methods: {
    async pageInit () {
      this.notice_status = await this.getDictionary('notice_status')
    },
    initFrom () {
      this.$loading()
      api.getNoticeDetailByNoticeId(this.noticeId).then(res => {
        console.log(res.data)
        this.noticeData = res.data
        this.$loading().close()
      })
    },
    close () {
      this.noticeData = {
        noticeId: null,
        noticeTitle: null,
        noticeContent: null,
        noticeStatus: '1'
      }
      this.$refs.fromVerify.resetFields()
      this.$emit('close')
    },
    submit () {
      this.$refs.fromVerify.validate(v => {
        if (!v) return
        this.setNotice()
      })
    },
    setNotice () {
      console.log(this.noticeData)
      const data = {}
      if (this.noticeId) {
        data.uptList = [
          {
            noticeId: this.noticeData.noticeId,
            noticeTitle: this.noticeData.noticeTitle,
            noticeContent: this.noticeData.noticeContent,
            noticeStatus: this.noticeData.noticeStatus
          }
        ]
      } else {
        data.addList = [
          {
            noticeTitle: this.noticeData.noticeTitle,
            noticeContent: this.noticeData.noticeContent,
            noticeStatus: this.noticeData.noticeStatus
          }
        ]
      }
      api
        .setNotice(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.close()
          this.$emit('submit')
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
