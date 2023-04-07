<!--
 * @Author: 杨曦
 * @Date: 2022-09-19 11:42:27
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-19 17:39:17
 * @Version:
 * @Description:
-->
<template>
  <div class="documentReview">
    <el-dialog :close-on-click-modal="false" title="文件审查申请" :visible.sync="documentReviewVisible" width="800px" :before-close="close">
      <el-form  size="mini" label-width="145px">
        <el-form-item label="申请类型：">文件审查</el-form-item>
        <el-form-item label="申请标题：">
            <el-input v-model="apply_title" placeholder="请输入内容" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="申请说明：">
            <el-input type="textarea" :autosize="{ minRows: 3}" placeholder="请输入内容" v-model="apply_intro" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="审查文件：">
            <el-upload
                drag
                class="upload-demo"
                action
                ref="upload1"
                multiple
                :auto-upload="false"
                :file-list="fileList"
                :on-change="change"
                :on-remove="change"
                :style="{width:'200px'}"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
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
        <el-form-item label="抄送">
          <el-select :style="{width:'180px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import axios from '@/api/dictionary'
import apiU from '@/api/user'
import mixins from '@/plugin/mixins'
import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    documentReviewVisible: {
      type: Boolean,
      default: false
    },
    applyData: {
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      auditor: '',
      copy: [],
      fileList: [],
      apply_intro: '',
      user: [],
      apply_title: '',
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
  watch: {
    documentReviewVisible: function (val) {
      if (val) {
        console.log(this.applyData)
        apiU.userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
          .then(({ data }) => {
            console.log(
              'userList...........................................',
              data
            )
            this.user = data.rows
          })
        axios.getAuditorListByApplyType('document_review').then(res => {
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
  mounted () {},
  methods: {
    async pageInit () {
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.fileList = []
      this.user = []
      this.auditor = ''
      this.apply_intro = ''
      this.apply_title = ''
      this.copyTo = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      console.log(
        'submit',
        this.auditor,
        this.copy
      )
      // 验证
      if (!this.apply_intro) {
        this.$message('申请说明不能为空')
        return
      }
      if (!this.apply_title) {
        this.$message('申请标题不能为空')
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
      const copyTo = []
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v })
      })
      const data = {
        applyType: 'document_review',
        applyTitle: `关于【${this.apply_title}】的文件审查申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            { label: '申请标题', value: this.apply_title },
            { label: '申请说明', value: this.apply_intro }
          ]
        }
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/documentReview', url => {
            console.log(url)
            data.content.file.push({
              name: `[申请人上传]-${file.name}`,
              url: url
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('setpurchase参数', data)
              api.setRefund(data).then(res => {
                console.log('setpurchase，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        this.$message.error('审核文件必填')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
