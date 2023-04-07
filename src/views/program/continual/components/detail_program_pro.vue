<template>
  <div class="dictionary">
     <el-drawer
      title="项目详情"
      :visible.sync="detailVisible"
      size="700px"
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
          <el-col :span="4" class="_item-name">系列课（英文）：</el-col>
          <el-col :span="8" class="_item-value">{{ruleForm.hasEnglishSeries || '无'}}</el-col>
          <el-col :span="4" class="_item-name">线上可售状态：</el-col>
          <el-col :span="8" class="_item-value">{{ruleForm.onlineSale == 1 ? '可售' :'不可售'}}</el-col>
          <el-col :span="4" class="_item-name">是否热门项目：</el-col>
          <el-col :span="8" class="_item-value">{{ruleForm.isPopular == 1 ? '热门' :'非热门'}}</el-col>
          <el-col :span="4" class="_item-name">项目启用状态：</el-col>
          <el-col :span="8" class="_item-value">{{ruleForm.programStatus == 1 ? '启用' :'禁用'}}</el-col>
          <el-col :span="4" class="_item-name">项目KPI权重：</el-col>
          <el-col :span="8" class="_item-value">
            <span >{{ruleForm.programWeight || '无'}}</span>
          </el-col>
          <el-col :span="4" class="_item-name" v-if="ruleForm.programType =='jcxy'">固定提成比例(%):</el-col>
          <el-col :span="8" class="_item-value" v-if="ruleForm.programType =='jcxy'">
            <span v-if="ruleForm.brokerageRate == '0'">非固定</span>
            <span v-else>固定{{ruleForm.brokerageRate}}%</span>
          </el-col>
          <el-col :span="4" class="_item-name">项目详情：</el-col>
          <el-col :span="20" class="_item-value" style="white-space:pre-wrap;">{{ruleForm.programDetail || '无'}}</el-col>
          <el-col :span="4" class="_item-name">用户协议：</el-col>
          <el-col :span="20" class="_item-value" style="white-space:pre-wrap;">{{ruleForm.userAgreement || ''}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="_item-name">
            合同模板：
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
        <el-button type="primary" @click="editProgram">编 辑</el-button>
     </div>
    </el-drawer>
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
  </div>
</template>

<script>
import api from '@/api/dictionary'
import { downloadFun } from '@/libs/file.js'
import mixins from '@/plugin/mixins'
import setContract from '../../basic/components/set_contract'
import editProgram from './edit_program.vue'
import detailContractProgram from './set_contractProgram.vue'

export default {
  components: { setContract, editProgram, detailContractProgram },
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
      contractList: [],
      delContractList: [],
      contractData: {},
      ruleForm: {
        programId: null,
        programName: '',
        programAlias: '',
        mentorHour: 0,
        period: null,
        periodUnit: null,
        priceUsd: null,
        priceCny: null,
        currencyType: '',
        programStatus: null,
        sortNo: null,
        onlineSale: null,
        hasEnglishSeries: null,
        isPopular: null,
        hasSeminars: 'No',
        internalPushCenter: 'No',
        netApplicationCenter: 'No'
      },
      editProgramType: null,
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
      const a = api.getProgramDetailById(this.programId).then((res) => {
        console.log(res)
        this.ruleForm = res.data
        this.editProgramType = this.ruleForm.programType
        this.contractList = res.data.contractList
      })
      this.$loading()
      Promise.all([a])
        .then(() => {
          this.$loading().close()
        })
        .catch((err) => {
          alert('请求出错：' + err)
          this.$loading().close()
        })
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
        liveLesson: this.ruleForm.liveLesson,
        officeHourStrategistSession: this.ruleForm.officeHourStrategistSession,
        seriesHour: this.ruleForm.seriesHour,
        onlineHour: this.ruleForm.onlineHour,
        medalTokens: this.ruleForm.medalTokens,
        seminars: this.ruleForm.seminars,
        priority: this.ruleForm.priority,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        hasContinual: this.ruleForm.hasContinual,
        hasEbookStore: this.ruleForm.hasEbookStore,
        hasSeminars: this.ruleForm.hasSeminars,
        period: this.ruleForm.period,
        periodUnit: this.ruleForm.periodUnit,
        oneOnOneHour: this.ruleForm.oneOnOneHour,
        priceUsd: this.ruleForm.priceUsd,
        priceCny: this.ruleForm.priceCny,
        currencyType: this.ruleForm.currencyType,
        programStatus: this.ruleForm.programStatus,
        programWeight: this.ruleForm.programWeight,
        brokerageRate: this.ruleForm.brokerageRate
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
      this.programId = programId
      const a = api.getProgramDetailById(programId).then((res) => {
        console.log(res)
        this.ruleForm = res.data
        this.editProgramType = this.ruleForm.programType
      })

      this.$loading()
      const b = api.getContractListByProgramId(programId).then((res) => {
        console.log(res)
        this.contractList = res.data
      })
      Promise.all([a, b])
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
