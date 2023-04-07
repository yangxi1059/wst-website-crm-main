<template>
  <div class="vacate">
    <el-dialog :close-on-click-modal="false" title="文书修改申请" :visible.sync="addVisible" width="700px" :before-close="close">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="修改前文书：">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            drag
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'360px'}"
          >
          <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="修改后文书：">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            drag
            :auto-upload="false"
            :file-list="fileList2"
            :on-change="change2"
            :on-remove="change2"
            :style="{width:'360px'}"
          >
          <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="修改备注:">
          <el-input :style="{width:'360px'}" size="mini" v-model="note" type="textarea" maxlength="199"></el-input>
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'360px'}"
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
          <el-select :style="{width:'360px'}" v-model="copy" multiple filterable placeholder="请选择">
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
import apiDic from '@/api/dictionary'
import apiU from '@/api/user'
import { mapState } from 'vuex'

import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    addVisible: {
      type: Boolean,
      default: false
    },
    menteeName: {
      type: String,
      default: ''
    },
    signId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  data: () => {
    return {
      user: [],
      auditor: [],
      copy: [],
      fileList: [],
      fileList2: [],
      note: '',
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
    addVisible: function (val) {
      if (val) {
        console.log(val)
        apiDic.getAuditorListByApplyType('application_letter').then(res => {
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
  mounted () {
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
  },
  methods: {
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.expenditureAmount = null
      this.note = null
      this.fileList = []
      this.fileList2 = []
      this.auditor = []
      this.copyTo = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    change2 (file, fileList) {
      console.log(file, fileList)
      this.fileList2 = fileList
    },
    submit () {
      console.log('submit', this.fileList, this.fileList2, this.auditor, this.copy)
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
        applyType: 'application_letter',
        applyTitle: `学员[${this.menteeName}]的文书修改申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          file2: [],
          text: [
            {
              label: '备注',
              value: this.note
            }
          ],
          info: []
        }
      }
      if (this.fileList.length && this.fileList2.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, `mentee_file/${this.menteeName}_${~~(Math.random() * 10 ** 3)}`, url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            data.content.info.push({
              signId: this.signId,
              applicationLetterModifyNote: this.note,
              applicationLetterName: file.name,
              applicationLetterVoucher: url
            })
            if (data.content.file2.length === this.fileList2.length && data.content.file.length === this.fileList.length) {
              console.log('menteeFile参数', data)
              api.setRefund(data).then(res => {
                console.log('menteeFile，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
        // } else {
        //   this.$message({
        //     type: "warning",
        //     message: "修改前文书为必传！"
        //   });
        //   return;
        // }
        // if (this.fileList2.length) {
        for (let i = this.fileList2.length - 1; i >= 0; i--) {
          const file = this.fileList2[i]
          uploadFunBySys(file.raw, `mentee_file/${this.menteeName}_${~~(Math.random() * 10 ** 3)}`, url => {
            console.log(url)
            data.content.file2.push({
              name: file.name,
              url: url
            })
            data.content.info.push({
              signId: this.signId,
              applicationLetterModifyNote: this.note,
              applicationLetterName: file.name,
              applicationLetterVoucher: url
            })
            if (data.content.file2.length === this.fileList2.length && data.content.file.length === this.fileList.length) {
              console.log('menteeFile参数', data)
              api.setRefund(data).then(res => {
                console.log('menteeFile，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '修改前后文书为必传！'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
