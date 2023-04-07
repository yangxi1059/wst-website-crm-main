<!--
 * @Author: kaan
 * @Date: 2021-10-20 19:17:05
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 13:57:27
 * @Version:
 * @Description:
-->
<template>
  <el-dialog :close-on-click-modal="false"
    title=""
    :visible.sync="commonChoiceVisible"
    width="width"
    :before-close="close"
  >
    <el-table
      :data="contractList"
      ref="dataTable"
      size="mini"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="contractName" label="合同模板名称"></el-table-column>
      <el-table-column align="center" prop="contractTags" label="标签"></el-table-column>
      <el-table-column align="center" prop="" label="操作">
        <template slot-scope="scope">
          <el-button
              type="primary"
              plain
              size="mini"
              @click="viewContract(scope.row.contractContent,scope.row.contractTitle)"
            >预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import api from '@/api/dictionary'
import { downloadFun } from '@/libs/file.js'
export default {
  props: {
    commonChoiceVisible: {
      type: Boolean,
      default: false
    },
    programId: {
      type: String,
      default: ''
    },
    ruleForm: {
      type: Object
    }
  },
  data () {
    return {
      contractList: [],
      multipleSelection: []
    }
  },
  watch: {
    commonChoiceVisible (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      api.getCommonContractForBind(this.programId).then(res => {
        this.contractList = res.data
        this.$refs.dataTable.clearSelection()
        const len = this.contractList.length
        this.$nextTick(() => {
          for (let i = 0; i < len; i++) {
            if (this.contractList[i].isBind == '1') {
              console.log(i)
              this.$refs.dataTable.toggleRowSelection(this.contractList[i], true)
            }
          }
        })
      })
    },
    submit () {
      const params = []
      this.multipleSelection.forEach(u => {
        params.push({ contractId: u.pkId })
      })
      api.bindCommonContract(this.programId, params).then(res => {
        this.$message({
          type: 'success',
          message: '绑定成功'
        })
        this.clear()
        this.$emit('submit')
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    viewContract (contractContent, contractTitle) {
      const submitData = {
        contractContent: contractContent,
        contractTitle: contractTitle,
        programId: this.ruleForm.programId,
        programName: this.ruleForm.programName,
        programAlias: this.ruleForm.programAlias,
        programGroup: this.ruleForm.programGroup,
        programLevel: this.ruleForm.programLevel,
        programSubdivision: this.ruleForm.programSubdivision,
        mentorHour: this.ruleForm.mentorHour,
        applicationLetterModify: this.ruleForm.applicationLetterModify,
        mentorLetterModify: this.ruleForm.mentorLetterModify,
        leadStrategistHour: this.ruleForm.leadStrategistHour,
        jerryHour: this.ruleForm.jerryHour,
        seniorStrategist: this.ruleForm.seniorStrategist,
        emergencyMentor: this.ruleForm.emergencyMentor,
        interviewMentor: this.ruleForm.interviewMentor,
        mentorCount: this.ruleForm.mentorCount,
        signVip: this.ruleForm.signVip,
        tequilaShotHour: this.ruleForm.tequilaShotHour,
        officeHour: this.ruleForm.officeHour,
        liveLesson: this.ruleForm.liveLesson,
        officeHourStrategistSession: this.ruleForm.officeHourStrategistSession,
        seriesHour: this.ruleForm.seriesHour,
        hasEnglishSeries: this.ruleForm.hasEnglishSeries,
        onlineHour: this.ruleForm.onlineHour,
        medalTokens: this.ruleForm.medalTokens,
        seminars: this.ruleForm.seminars,
        priority: this.ruleForm.priority,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        hasContinual: this.ruleForm.hasContinual,
        hasEbookStore: this.ruleForm.hasEbookStore,
        hasSeminars: this.ruleForm.hasSeminars,
        newsLetter: this.ruleForm.newsLetter,
        period: this.ruleForm.period,
        periodUnit: this.ruleForm.periodUnit,
        oneOnOneHour: this.ruleForm.oneOnOneHour,
        priceUsd: this.ruleForm.priceUsd,
        priceCny: this.ruleForm.priceCny,
        currencyType: this.ruleForm.currencyType,
        programStatus: this.ruleForm.programStatus,
        programWeight: this.ruleForm.programWeight
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
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.multipleSelection = [],
      this.contractList = []
    }
  }
}
</script>
