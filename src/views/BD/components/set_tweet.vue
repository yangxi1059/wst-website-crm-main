<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="cacheTweetData.pkId ? '编辑' : '新增'"
      :visible.sync="setTweetVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheTweetData"
        :rules="rules"
        ref="cacheTweetData"
        label-width="120px"
      >
        <el-form-item label="推文标题" prop="articleTitle">
          <el-input :style="{width:widths}" v-model="cacheTweetData.articleTitle" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="推文简介" prop="articleIntroduction">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheTweetData.articleIntroduction"
            :autosize="{minRows:3}"
            maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="推文链接" prop="articleUrl">
          <el-input :style="{width:widths}" v-model="cacheTweetData.articleUrl" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="推送日期" prop="pushDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheTweetData.pushDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="阅读量" prop="readingNum">
          <el-input-number
            :style="{width:widths}"
            v-model="cacheTweetData.readingNum"
            :controls="false"
            :min="0"
            :max="99999"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="咨询导流数量" prop="consultingNum">
          <el-input-number
            :style="{width:widths}"
            v-model="cacheTweetData.consultingNum"
            :controls="false"
            :min="0"
            :max="99999"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input :style="{width:widths}" v-model="cacheTweetData.note" :maxlength="199"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <div v-if="cacheTweetData.voucherPath">
            <el-button
              v-for="(item,i) in cacheTweetData.voucherPath.split(',')"
              :key="i"
              size="mini"
              icon="el-icon-view"
              @click="download(item)"
            >附件{{++i}}</el-button>
          </div>
          <el-upload
            action
            class="upload-btn mt20"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'500px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
// import apiDic from "@/api/dictionary.js";
import { uploadFunBySys, downloadFun } from '@/libs/file'

export default {
  name: 'setTweet',
  mixins: [mixins],
  props: {
    setTweetVisible: {
      type: Boolean,
      default: false
    },
    tweetData: {
      type: Object
    }
  },
  data () {
    return {
      cacheTweetData: {
        pkId: null,
        cooperatorId: null,
        articleTitle: null,
        articleIntroduction: null,
        articleUrl: null,
        pushDate: null,
        readingNum: null,
        consultingNum: null,
        voucherPath: null,
        note: null
      },

      widths: '250px',
      rules: {
        articleTitle: [{ required: true, message: '必填', trigger: 'blur' }],
        articleUrl: [{ required: true, message: '必填', trigger: 'blur' }],
        pushDate: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  computed: {},
  watch: {
    setTweetVisible: function (val) {
      if (val && this.tweetData.pkId) {
        // this.cacheTweetData = { ...this.tweetData };
        this.initPage()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    initPage () {
      api.getTweetById(this.tweetData.pkId).then(res => {
        console.log(res)
        this.cacheTweetData = res.data
      })
    },
    init () {

    },
    close () {
      this.$emit('close')
      this.clear()
      this.$refs.cacheTweetData.resetFields()
    },
    clear () {
      this.cacheTweetData = {
        pkId: null,
        cooperatorId: null,
        articleTitle: null,
        articleIntroduction: null,
        articleUrl: null,
        pushDate: null,
        readingNum: null,
        consultingNum: null,
        voucherPath: null,
        note: null
      }
      this.fileList = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheTweetData,
        this.cacheTweetData
      )
      // this.cacheTweetData.cooperatorId = this.tweetData.cooperatorId;
      this.$refs.cacheTweetData.validate(valid => {
        console.log(valid)
        if (!valid) return
        console.log(this.cacheTweetData)
        this.cacheTweetData.cooperatorId = this.tweetData.cooperatorId
        const data = []
        if (!this.fileList.length) {
          this.submit2()
          return
        }
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'BD_tweet/voucher', url => {
            console.log(url)
            data.push(url)
            if (data.length === this.fileList.length) {
              console.log('voucherPath参数', data)
              this.cacheTweetData.voucherPath = this.cacheTweetData.voucherPath
                ? this.cacheTweetData.voucherPath + ',' + data.join()
                : data.join()
              this.submit2()
            }
          })
        }
      })
    },
    submit2 () {
      if (this.cacheTweetData.pkId) {
        api
          .uptTweet(this.cacheTweetData)
          .then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      } else {
        api
          .addTweet(this.cacheTweetData)
          .then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      }
    },
    download (v) {
      downloadFun(v)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
