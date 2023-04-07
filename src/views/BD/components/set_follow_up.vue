<!--
 * @Author: 库建华
 * @Date: 2020-05-25 13:36:23
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-11-27 09:23:24
 * @Version: 1
 * @Description:
-->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="cacheFollowUpData.pkId ? '编辑' : '新增'"
      :visible.sync="setFollowUpVisible"
      width="700px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheFollowUpData"
        :rules="rules"
        ref="followUp"
        label-width="120px"
      >
        <!-- <el-form-item label="开始日期" prop="beginDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheFollowUpData.beginDate"
            :clearable="false"
            :disabled="!!cacheFollowUpData.pkId"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="endDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheFollowUpData.endDate"
            :clearable="false"
            :disabled="!!cacheFollowUpData.pkId"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <template v-if="setFollowUpContent">
          <el-form-item label="followUp状态" prop="followStatus">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="cacheFollowUpData.followStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in bd_follow_status"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        <br />-->
        <el-form-item label="followUp内容" prop="followResult">
          <el-input
            :style="{width:widths}"
            type="textarea"
            :autosize="{minRows:3}"
            v-model="cacheFollowUpData.followResult"
            placeholder="不得少于15个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联" prop="contentType">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheFollowUpData.contentType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in content_type"
              :key="item.contentType"
              :label="item.contentType"
              :value="item.contentType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action
            class="upload-btn"
            ref="upload"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            multiple
            :style="{width:'500px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
        <!-- </template> -->
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
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys } from '@/libs/file'

export default {
  name: 'setFollowUp',
  mixins: [mixins],
  props: {
    setFollowUpVisible: {
      type: Boolean,
      default: false
    },
    followUpData: {
      type: Object
    }
  },
  data () {
    return {
      cacheFollowUpData: {
        pkId: null,
        cooperatorId: null,
        // beginDate: null,
        // endDate: null,
        // followStatus: null,
        followResult: null,
        contentType: null
      },

      widths: '360px',
      rules: {
        // beginDate: [{ required: true, message: "必填", trigger: "blur" }],
        // endDate: [{ required: true, message: "必填", trigger: "blur" }],
        // followStatus: [{ required: true, message: "必填", trigger: "blur" }],
        followResult: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      content_type: [],
      bd_follow_status: [],
      setFollowUpContent: false,
      fileList: []
    }
  },
  computed: {},
  watch: {
    setFollowUpVisible: function (val) {
      if (val) {
        console.log(this.followUpData)
        this.cacheFollowUpData = { ...this.followUpData };
        (this.setFollowUpContent = !!this.cacheFollowUpData.pkId),
        this.getCooperatorContentType()
      }
    }
    // 'cacheFollowUpData.beginDate':function(val){
    //   console.log(val, new Date(val) < new Date());
    //   if(!this.cacheFollowUpData.pkId){
    //     this.setFollowUpContent = new Date(val) < new Date();
    //   }
    // }
  },
  mounted () {
    this.init()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.bd_follow_status = await this.getDictionary('bd_follow_status')
    },
    init () {
    },
    getCooperatorContentType () {
      api
        .getCooperatorContentTypeById(this.cacheFollowUpData.cooperatorId)
        .then(res => {
          this.content_type = res.data || []
        })
    },
    close () {
      this.$emit('close')
      this.clear()
      this.fileList = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList.slice(-1)
    },
    clear () {
      this.cacheFollowUpData = {
        pkId: null,
        cooperatorId: null,
        followVoucher: null,
        followVoucherName: null,
        // followStatus: null,
        followResult: null,
        contentType: null
      }
      this.$refs.followUp.resetFields()
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheFollowUpData,
        this.cacheFollowUpData
      )
      // this.cacheFollowUpData.cooperatorId = this.followUpData.cooperatorId;
      this.$refs.followUp.validate(valid => {
        if (!valid) return
        if (this.cacheFollowUpData.followResult.length < 15) {
          this.$message({
            type: 'warning',
            message: 'followUp内容不得少于15个字符'
          })
          return
        }
        if (this.fileList.length) {
          const file = this.fileList[0]
          this.$loading()
          uploadFunBySys(
            file.raw,
            `cooperatorFollow/${this.cacheFollowUpData.cooperatorId}`,
            url => {
              console.log(url)
              this.cacheFollowUpData.followVoucherName = file.name
              this.cacheFollowUpData.followVoucher = url
              this.submit2()
            }
          )
        } else {
          this.submit2()
        }
      })
    },
    submit2 () {
      console.log(this.cacheFollowUpData)
      if (this.cacheFollowUpData.pkId) {
        api
          .uptFollowUpCooperator(this.cacheFollowUpData)
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
          .addFollowUpCooperator(this.cacheFollowUpData)
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
