<!--
 * @Author: 库建华
 * @Date: 2020-07-08 15:03:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 16:30:52
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :visible.sync="setContractVisible"
      :before-close="close"
      width="1000px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        size="medium"
        ref="ruleForm"
        inline
        label-width="140px"
      >
        <el-form-item label="选择合同时的名称：">
          <el-input
            v-model="cacheContractData.contractName"
            :style="{width:'250px'}"
            maxlength="99"
            placeholder="如：有礼物，无实习..."
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="合同标题：" label-width="140px">
          <el-input
            v-model="cacheContractData.contractTitle"
            :style="{width:'800px'}"
            maxlength="99"
            placeholder="签约的合同上的标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同正文内容：">
          <ckeditor
            :style="{'width':'800px'}"
            :config="editorConfig"
            v-model="cacheContractData.contractContent"
          ></ckeditor>
          <!-- <el-input
            style="width:710px"
            v-model="cacheContractData.contractContent"
            type="textarea"
            rows="13"
            placeholder="签约的合同里的内容"
          ></el-input>-->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          @click="previewContract(cacheContractData.contractContent,cacheContractData.contractTitle)"
        >预 览</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { downloadFun } from '@/libs/file.js'
export default {
  name: 'set-contract',
  mixins: [mixins],
  props: {
    setContractVisible: {
      type: Boolean,
      default: false
    },
    contractData: {
      type: Object
    },
    ruleForm: {
      type: Object
    }
  },
  data () {
    return {
      cacheContractData: {},
      rules: {},
      editorConfig: {
        toolbar: [
          ['Bold', 'Italic'],
          ['Undo', 'Redo'],
          ['Source'],
          ['Maximize']
        ]
      }
    }
  },
  mounted () {},
  watch: {
    setContractVisible: function (val) {
      console.log(val)
      if (val) {
        this.$loading()
        if (this.contractData.pkId) {
          this.initPage()
        } else {
          this.$loading().close()
        }
      }
    }
  },
  methods: {
    initPage () {
      console.log(this.contractData, 'contractData')
      api.getContractDetailById(this.contractData.pkId).then(res => {
        console.log(res, 'res')
        this.cacheContractData = res.data
        this.$loading().close()
      })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.cacheContractData = {}
    },
    submit () {
      console.log(this.cacheContractData)
      this.cacheContractData.programId = this.contractData.programId
      if (this.cacheContractData.pkId) {
        api
          .uptContract(this.cacheContractData)
          .then(() => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      } else {
        console.log(this.cacheContractData)
        api
          .addContract(this.cacheContractData)
          .then(() => {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      }
    },
    // 编辑-预览
    previewContract (contractContent, contractTitle) {
      if (!contractTitle || !contractContent) {
        this.$message({
          type: 'warning',
          message: '合同标题与正文必填！'
        })
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.viewContract(contractContent, contractTitle)
      })
    },
    // 详情-预览
    viewContract (contractContent, contractTitle) {
      const submitData = {
        contractContent: contractContent,
        contractTitle: contractTitle,
        programId: this.ruleForm.programId,
        programName: this.ruleForm.programName,
        programGroup: this.ruleForm.programGroup,
        programLevel: this.ruleForm.programLevel,
        programSubdivision: this.ruleForm.programSubdivision,
        mentorHour: this.ruleForm.mentorHour,
        applicationLetterModify: this.ruleForm.applicationLetterModify,
        leadStrategistHour: this.ruleForm.leadStrategistHour,
        jerryHour: this.ruleForm.jerryHour,
        seniorStrategist: this.ruleForm.seniorStrategist,
        emergencyMentor: this.ruleForm.emergencyMentor,
        interviewMentor: this.ruleForm.interviewMentor,
        mentorCount: this.ruleForm.mentorCount,
        signVip: this.ruleForm.signVip,
        tequilaShotHour: this.ruleForm.tequilaShotHour,
        officeHour: this.ruleForm.officeHour,
        seriesHour: this.ruleForm.seriesHour,
        onlineHour: this.ruleForm.onlineHour,
        certificateSubjectLiveCourseAuthority: this.ruleForm
          .certificateSubjectLiveCourseAuthority,
        seminars: this.ruleForm.seminars,
        priority: this.ruleForm.priority,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        hasSeminars: this.ruleForm.hasSeminars,
        period: this.ruleForm.period,
        periodUnit: this.ruleForm.periodUnit,
        oneOnOneHour: this.ruleForm.oneOnOneHour,
        priceUsd: this.ruleForm.priceUsd,
        priceCny: this.ruleForm.priceCny,
        currencyType: this.ruleForm.currencyType,
        programStatus: this.ruleForm.programStatus
      }
      console.log(submitData)
      api
        .previewContract(submitData)
        .then(res => {
          console.log(res)
          downloadFun(res.data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
