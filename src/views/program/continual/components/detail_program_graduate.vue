<template>
  <div class="dictionary">
     <el-drawer
      title="申研项目详情"
      :visible.sync="detailVisible"
      size="770px"
      :before-close="changeClose"
    >
     <div style="padding-left:20px">
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">项目ID：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.programName">{{ruleForm.programId || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">项目名：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.programName">{{ruleForm.programName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">项目别名：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.programAlias">{{ruleForm.programAlias || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name" >签约分配VIP：</el-col>
        <el-col :span="8" class="_item-value" >{{ruleForm.signVip || '无'}}</el-col>
        <el-col :span="4" class="_item-name">项目周期：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.period || '无'}} {{ruleForm.periodUnit}}</el-col>
        <el-col :span="4" class="_item-name">价格(USD)：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.priceUsd || '无'}}</el-col>
        <el-col :span="4" class="_item-name">价格(RMB)：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.priceCny || '无'}}</el-col>
        <el-col :span="4" class="_item-name">项目价格类型：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.currencyType?ruleForm.currencyType.toLocaleUpperCase():'无' || '无'}}</el-col>
        <el-col :span="4" class="_item-name">背景提升数量：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.gpBackgroundPromotionQuantity || '无'}}</el-col>
        <el-col :span="4" class="_item-name">背景提升价格￥</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.gpBackgroundPromotionPriceCny || '无'}}</el-col>
        <el-col :span="4" class="_item-name">背景提升价格$</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.gpBackgroundPromotionPriceUsd || '无'}}</el-col>
        <el-col :span="4" class="_item-name">专业大类数量：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.gpMajorQuantity || '无'}}</el-col>
        <el-col :span="4" class="_item-name">项目申请数量：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.gpProgramApplyQuantity || '无'}}</el-col>
        <el-col :span="4" class="_item-name">Live Lessons（新）</el-col>
        <el-col
            :span="8"
            class="_item-value"
        >{{(ruleForm.liveLesson == -1 ? '不限' : ruleForm.liveLesson) || '无'}}</el-col>
        <el-col :span="4" class="_item-name">1对多Office Hour：</el-col>
        <el-col :span="8" class="_item-value">
          <span >{{ruleForm.officeHourStrategistSession || '0'}}次/月</span>
        </el-col>
        <el-col :span="4" class="_item-name">内推中心：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.internalPushCenter || '无'}}</el-col>
        <el-col :span="4" class="_item-name">网申中心：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.netApplicationCenter || '无'}}</el-col>
        <el-col :span="4" class="_item-name">系列课：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.seriesHour || '无'}}</el-col>
        <el-col :span="4" class="_item-name">系列课（英文）：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.hasEnglishSeries || '无'}}</el-col>
        <el-col :span="4" class="_item-name">项目启用状态：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.programStatus == 1 ? '启用' :'禁用'}}</el-col>
        <el-col :span="4" class="_item-name">线上可售状态：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.onlineSale == 1 ? '可售' :'不可售'}}</el-col>
        <el-col :span="4" class="_item-name">是否热门项目：</el-col>
        <el-col :span="8" class="_item-value">{{ruleForm.isPopular == 1 ? '热门' :'非热门'}}</el-col>
        <el-col :span="4" class="_item-name">项目KPI权重：</el-col>
        <el-col :span="20" class="_item-value">
          <span >{{ruleForm.programWeight || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">项目详情：</el-col>
        <el-col :span="20" class="_item-value" style="white-space:pre-wrap;">{{ruleForm.programDetail || '无'}}</el-col>
        <el-col :span="4" class="_item-name">用户协议：</el-col>
        <el-col :span="20" class="_item-value" style="white-space:pre-wrap;">{{ruleForm.userAgreement || '无'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="_item-name">
          公共合同模板：
          <el-button
            type="primary"
            plain
            size="mini"
            class="el-icon-edit"
            circle
            @click="chooseCommon()"
          ></el-button>
        </el-col>
        <el-col :span="20" class="_item-value">
          <div class="mb10" v-for="(contract, i) in  commonContractList" :key="i">
            <p class="contract-name">{{contract.contractName}}</p>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="viewContract(contract.contractContent,contract.contractTitle)"
            >预览</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="_item-name">
          定制合同模板：
          <el-button
            type="primary"
            plain
            size="mini"
            title="新增"
            class="el-icon-plus"
            circle
            @click="addContract()"
          ></el-button>
        </el-col>
        <el-col :span="20" class="_item-value">
          <div class="mb10" v-for="(contract, i) in  contractList" :key="i">
            <p class="contract-name">{{contract.contractName}}</p>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="viewContract(contract.contractContent,contract.contractTitle)"
            >预览</el-button>
            <el-button type="primary" plain size="mini" @click="editContract(contract)">编辑</el-button>
            <el-button
              type="text"
              size="mini"
              title="删除"
              class="el-icon-delete"
              circle
              @click="deleteContract(contract)"
            ></el-button>
          </div>
        </el-col>
      </el-row>
      <el-button @click="changeClose">取 消</el-button>
      <el-button type="primary" @click="followUp">follow规则</el-button>
      <el-button type="primary" @click="editProgram">编 辑</el-button>
      <el-button type="primary" v-if="roleInfo.includes(`program_copy`)" @click="copy">项目拷贝</el-button>
     </div>
    </el-drawer>
    <commonTemplateChoice
      :commonChoiceVisible="commonChoiceVisible"
      :programId="programId"
      :ruleForm="ruleForm"
      @close="commonChoiceClose"
      @submit="commonChoiceSubmit"
    />
    <editProgram
      :editVisible="editVisible"
      :programId="programId"
      @close="editClose"
      @sumbit="editSumbit"
    />
    <detailContractProgram
      :detailContractVisible="detailContractVisible"
      :contractData="contractData"
      @close="contractClose"
      @submit="contractSumbit"
    />
    <setContract
      :setContractVisible="setContractVisible"
      :contractData="contractData"
      :ruleForm="ruleForm"
      @close="setContractClose"
      @submit="setContractSubmit"
    />
    <followUpRule
      :followUpVisible="followUpVisible"
      :programId="programId"
      @close="followUpRuleClose"
    />
  </div>
</template>

<script>
import api from '@/api/dictionary'
import { downloadFun } from '@/libs/file.js'
import mixins from '@/plugin/mixins'
import setContract from '../../basic/components/set_contract.vue'
import editProgram from './edit_program_graduate.vue'
import detailContractProgram from './set_contractProgram.vue'
import followUpRule from '../../basic/components/follow_rule.vue'
import commonTemplateChoice from '../../basic/components/common_template_choice.vue'
import { mapState } from 'vuex'

export default {
  components: { setContract, editProgram, detailContractProgram, followUpRule, commonTemplateChoice },
  mixins: [mixins],
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    programId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  data () {
    return {
      programIdList: [],
      programDic: [
        {
          label: '启用项目',
          options: [{ programName: '所有', programId: '' }]
        },
        {
          label: '禁用项目',
          options: [{ programName: '所有', programId: '' }]
        }
      ],
      YrN: [
        { itemName: '是', itemValue: 'Yes' },
        { itemName: '否', itemValue: 'No' }
      ],
      delVisible: false,
      detailContractVisible: false,
      setContractVisible: false,
      editVisible: false,
      followUpVisible: false,
      contractList: [],
      delContractList: [],
      contractData: {},
      ruleForm: {
        programId: null,
        programName: '',
        programAlias: '',
        seriesHour: 0,
        period: null,
        periodUnit: null,
        priceUsd: null,
        priceCny: null,
        gpBackgroundPromotionQuantity: null,
        gpBackgroundPromotionPriceCny: null,
        gpBackgroundPromotionPriceUsd: null,
        gpMajorQuantity: null,
        gpProgramApplyQuantity: null,
        currencyType: '',
        programStatus: null,
        sortNo: null,
        onlineSale: null,
        isPopular: null,
        internalPushCenter: 'No',
        netApplicationCenter: 'No',
        hasEnglishSeries: 'No'
      },
      editProgramType: null,
      commonVisible: false,
      commonChoiceVisible: false,
      commonContractList: []
    }
  },
  created () {},
  mounted () {
    this.initPage()
    window.detailProgram = (row) => this.detailProgram(row)
  },
  methods: {
    initPage () {
      api.getProgramDic('continual').then((res) => {
        console.log(res.data)
        this.programDic = [
          {
            label: '启用项目',
            options: res.data.enableProgramArr
          },
          {
            label: '禁用项目',
            options: res.data.disableProgramArr
          }
        ]
        res.data.enableProgramArr &&
          res.data.enableProgramArr.length &&
          (this.programIdList = [res.data.enableProgramArr[0].programId])
      })
    },
    Topage () {
      this.detailProgram(this.programId)
    },
    // 删除
    dicDelete (row) {
      const item = this.ruleForm
      console.log(item, row)
      this.$confirm(
        `此操作将永久删除该条目, 是否继续? （${item.programName}）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const submitData = {
            programId: item.programId,
            delFlag: '1'
          }
          api
            .setProgramDicItem(submitData)
            .then((res) => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
      console.log(this.contract, contractTitle, contractContent)
      this.$refs.ruleForm.validate((valid) => {
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
        programAlias: this.ruleForm.programAlias,
        programGroup: this.ruleForm.programGroup,
        programLevel: this.ruleForm.programLevel,
        programSubdivision: this.ruleForm.programSubdivision,
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
        liveLesson: this.ruleForm.liveLesson,
        officeHourStrategistSession: this.ruleForm.officeHourStrategistSession,
        seriesHour: this.ruleForm.seriesHour,
        onlineHour: this.ruleForm.onlineHour,
        medalTokens: this.ruleForm.medalTokens,
        // certificateSubjectLiveCourseAuthority: this.ruleForm
        //   .certificateSubjectLiveCourseAuthority,
        seminars: this.ruleForm.seminars,
        priority: this.ruleForm.priority,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        hasEnglishSeries: this.ruleForm.hasEnglishSeries,
        hasContinual: this.ruleForm.hasContinual,
        hasEbookStore: this.ruleForm.hasEbookStore,
        period: this.ruleForm.period,
        periodUnit: this.ruleForm.periodUnit,
        oneOnOneHour: this.ruleForm.oneOnOneHour,
        priceUsd: this.ruleForm.priceUsd,
        priceCny: this.ruleForm.priceCny,
        gpBackgroundPromotionQuantity: this.ruleForm.gpBackgroundPromotionQuantity,
        gpBackgroundPromotionPriceCny: this.ruleForm.gpBackgroundPromotionPriceCny,
        gpBackgroundPromotionPriceUsd: this.ruleForm.gpBackgroundPromotionPriceUsd,
        gpMajorQuantity: this.ruleForm.gpMajorQuantity,
        gpProgramApplyQuantity: this.ruleForm.gpProgramApplyQuantity,
        currencyType: this.ruleForm.currencyType,
        programStatus: this.ruleForm.programStatus,
        programWeight: this.ruleForm.programWeight
      }
      console.log(submitData)
      api
        .previewContract(submitData)
        .then((res) => {
          console.log(res)
          downloadFun(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    clone () {
      this.contractList = []
      this.delContractList = []
      this.$refs.ruleForm.resetFields()
    },
    editProgram () {
      this.editVisible = true
    },
    // 添加合同
    addContract () {
      this.contractData = { programId: this.programId }
      this.setContractVisible = true
    },
    editContract (contract) {
      console.log(contract)
      this.contractData = { ...contract }
      this.setContractVisible = true
    },
    // 删除合同
    deleteContract (v) {
      console.log(v)
      this.$confirm('确认删除该合同嘛？', '提示').then((vv) => {
        if (vv) {
          api.delContract(v.pkId).then((res) => {
            console.log(res)
            this.Topage(this.programId)
          })
        }
      })
    },
    changeClose () {
      this.$emit('close')
    },
    detailProgram (programId) {
      this.$loading()
      this.programId = programId
      const a = api.getProgramDetailById(programId).then((res) => {
        console.log(res)
        this.ruleForm = res.data
        this.editProgramType = this.ruleForm.programType
        this.contractList = res.data.contractList
        this.commonContractList = res.data.commonContractList
      })

      // let b = api.getContractListByProgramId(programId).then((res) => {
      //   console.log(res);
      //   this.contractList = res.data;
      // });
      Promise.all([a])
        .then(() => {
          this.$loading().close()
        })
        .catch((err) => {
          alert('请求出错：' + err)
          this.$loading().close()
        })
    },
    changeSubmit () {
      this.ruleForm.programType = 'continual'
      this.changeClose()
    },
    editClose () {
      this.editVisible = false
    },
    editSumbit () {
      this.editVisible = false
      this.$emit('sumbit')
      console.log(this.programId)
      this.Topage()
    },
    contractClose () {
      this.detailContractVisible = false
    },
    contractSumbit () {
      this.detailContractVisible = false
      this.Topage()
    },
    setContractClose () {
      this.setContractVisible = false
    },
    setContractSubmit () {
      this.Topage()
      this.setContractClose()
    },
    followUp () {
      this.followUpVisible = true
    },
    followUpRuleClose () {
      this.followUpVisible = false
    },
    chooseCommon () {
      this.commonChoiceVisible = true
    },
    commonChoiceSubmit () {
      this.commonChoiceVisible = false
      this.detailProgram(this.programId)
    },
    commonChoiceClose () {
      this.commonChoiceVisible = false
    },
    // 项目拷贝
    async copy () {
      console.log(this.ruleForm)
      if (!this.ruleForm.programId) { return }
      const item = this.ruleForm
      this.$confirm(`是否确认拷贝该项目? （${item.programName}）`, '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        api.getProgramCopy(item.programId).then(async (res) => {
          console.log('项目拷贝：', res)
          this.$message({
            type: 'success',
            message: '项目拷贝成功'
          })
          this.$emit('refresh')
          this.detailProgram(res.data)
        })
      })
    }
  }
}
</script>
<style lang='scss'>
.contract-name {
  display: inline-block;
  width: 400px;
  line-height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #409EFF;
}
.te-yangxi_ipt{
  display: flex;
}
.te-yangxi_ipt .el-form-item__content{
  display: flex;
}
</style>
