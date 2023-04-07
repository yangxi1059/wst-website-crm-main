<template>
  <div class="dictionary">
    <el-dialog :close-on-click-modal="false" title="项目内容" :visible.sync="editVisible" width="1050px" :before-close="clone">
      <el-form
        :model="ruleForm"
        :rules="rules"
        size="medium"
        ref="ruleForm"
        inline
        label-width="240px"
      >
        <el-form-item label="项目ID：" prop="programId">
          <el-input :style="{width:'180px'}" :disabled="true" v-model="ruleForm.programId"></el-input>
        </el-form-item>
        <el-form-item label="项目名：" prop="programName">
          <el-input :style="{width:'180px'}" v-model="ruleForm.programName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="项目别名：" prop="programAlias">
          <el-input :style="{width:'180px'}" v-model="ruleForm.programAlias" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="行业导师一对一（合计）：" prop="mentorHour"
          v-if="ruleForm.programType != 'jcxy' && ruleForm.programType !='oral'  && ruleForm.programType !='finance' ">
          <input-number v-model="ruleForm.mentorHour"></input-number>
        </el-form-item>
        <el-form-item label="财商导师一对一：" prop="financeHour" v-if="ruleForm.programType == 'finance'">
          <input-number v-model="ruleForm.financeHour"></input-number>
        </el-form-item>
        <el-form-item label="口语导师一对一：" prop="oralLessonHour" v-if="ruleForm.programType == 'oral'">
          <input-number v-model="ruleForm.oralLessonHour"></input-number>
        </el-form-item>
        <el-form-item label="签约分配VIP：" prop="signVip">
          <el-select
            v-model="ruleForm.signVip"
            :style="{width:'180px'}"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemName:'不分配VIP',itemValue:'No'},{itemName:'Strategist + Program Manager',itemValue:'ALL'},{itemName:'Strategist',itemValue:'Strategist'},{itemName:'Program Manager',itemValue:'Program_Manager'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目周期：" prop="period">
          <el-input :style="{width:'180px'}" v-model="ruleForm.period" maxlength="9"></el-input>
        </el-form-item>
        <el-form-item label="周期单位：" prop="periodUnit">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.periodUnit"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemName:'年',itemValue:'year'},{itemName:'月',itemValue:'month'},{itemName:'周',itemValue:'week'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格(USD)：" prop="priceUsd">
          <el-input :style="{width:'180px'}" v-model="ruleForm.priceUsd"></el-input>
        </el-form-item>
        <el-form-item label="价格(RMB)：" prop="priceCny">
          <el-input :style="{width:'180px'}" v-model="ruleForm.priceCny"></el-input>
        </el-form-item>
        <el-form-item label="项目价格类型：" prop="currencyType">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.currencyType"
            filterable
            placeholder="请选择价格类型"
          >
            <el-option
              v-for="item in [{itemName:'美金',itemValue:'usd'},{itemName:'人民币',itemValue:'cny'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线下课：" prop="hasSeminars"  v-if="ruleForm.programType != 'jcxy'">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.hasSeminars"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in YrN"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内推中心：" prop="internalPushCenter"  v-if="ruleForm.programType != 'jcxy'">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.internalPushCenter"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in YrN"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网申中心：" prop="netApplicationCenter"  v-if="ruleForm.programType != 'jcxy'">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.netApplicationCenter"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in YrN"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="系列课（英文）" prop="hasEnglishSeries">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.hasEnglishSeries"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in YrN"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否线上可售：" prop="onlineSale">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.onlineSale"
            filterable
            placeholder="请选择是否启用"
          >
            <el-option
              v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否热门项目：" prop="isPopular">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.isPopular"
            filterable
            placeholder="请选择是否启用"
          >
            <el-option
              v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用：" prop="programStatus">
          <el-select
            :style="{width:'180px'}"
            v-model="ruleForm.programStatus"
            filterable
            placeholder="请选择是否启用"
          >
            <el-option
              v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目KPI权重：" prop="programWeight">
          <el-input-number :style="{width:'180px'}" v-model="ruleForm.programWeight" :controls="false" :precision="2" ></el-input-number>
        </el-form-item>
        <el-form-item label="项目固定提成比例(%)：" v-if="ruleForm.programType =='finance' || ruleForm.programType =='jcxy'" prop="brokerageRate">
          <div>
            <el-radio v-model="radio" label="1">非固定</el-radio>
            <el-radio v-model="radio" label="2">固定提成比例</el-radio>
          </div>
          <el-input-number :style="{width:'180px'}" v-if="radio == '2'" v-model="ruleForm.brokerageRate" :controls="false" :precision="2" ></el-input-number>
        </el-form-item>
        <el-form-item label="项目详情：" prop="programDetail">
          <el-input
            type="textarea"
            :style="{width:'610px'}"
            placeholder="请输入内容"
            :autosize="{ minRows: 2 }"
            v-model="ruleForm.programDetail"
            maxlength="255"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="用户协议：" prop="userAgreement">
          <el-input
            type="textarea"
            :style="{width:'610px'}"
            placeholder="请输入内容"
            :autosize="{ minRows: 5 }"
            maxlength="500"
            v-model="ruleForm.userAgreement"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-row>
      </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clone">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import inputNumber from '@/components/input_number.vue'

export default {
  components: { inputNumber },
  mixins: [mixins],
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
      setContractVisible: false,
      search: '',
      pageNum: 1,
      total: 0,
      radio: '1',
      tableData: [],
      delVisible: false,
      contractList: [],
      delContractList: [],
      contractData: {},
      ruleForm: {
        programId: null,
        programName: '',
        programAlias: '',
        mentorHour: 0,
        signVip: '',
        period: null,
        periodUnit: null,
        priceUsd: null,
        priceCny: null,
        currencyType: '',
        programStatus: null,
        programWeight: null,
        brokerageRate: null,
        onlineSale: null,
        isPopular: null,
        sortNo: null,
        programDetail: '',
        userAgreement: '',
        hasSeminars: 'No',
        financeHour: null,
        oralLessonHour: null,
        internalPushCenter: 'No',
        netApplicationCenter: 'No',
        hasEnglishSeries: 'No'
      },
      rules: {
        programName: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        programAlias: [
          { required: true, message: '项目别名不能为空', trigger: 'blur' }
        ],
        programGroup: [{ required: true, message: '必填', trigger: 'blur' }],
        programLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        programSubdivision: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        mentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        applicationLetterModify: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        leadStrategistHour: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        jerryHour: [{ required: true, message: '必填', trigger: 'blur' }],
        seniorStrategist: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        emergencyMentor: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewMentor: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorCount: [{ required: true, message: '必填', trigger: 'blur' }],
        signVip: [{ required: true, message: '必填', trigger: 'blur' }],
        tequilaShotHour: [{ required: true, message: '必填', trigger: 'blur' }],
        officeHour: [{ required: true, message: '必填', trigger: 'blur' }],
        seriesHour: [{ required: true, message: '必填', trigger: 'blur' }],
        onlineHour: [{ required: true, message: '必填', trigger: 'blur' }],
        certificateSubjectLiveCourseAuthority: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        seminars: [{ required: true, message: '必填', trigger: 'blur' }],
        priority: [{ required: true, message: '必填', trigger: 'blur' }],
        period: [{ required: true, message: '必填', trigger: 'blur' }],
        periodUnit: [{ required: true, message: '必填', trigger: 'blur' }],
        oneOnOneHour: [{ required: true, message: '必填', trigger: 'blur' }],
        priceUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        priceCny: [{ required: true, message: '必填', trigger: 'blur' }],
        currencyType: [{ required: true, message: '必填', trigger: 'blur' }],
        programStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        programWeight: [{ required: true, message: '必填', trigger: 'blur' }],
        brokerageRate: [{ required: true, message: '必填', trigger: 'blur' }],
        onlineSale: [{ required: true, message: '必填', trigger: 'blur' }],
        isPopular: [{ required: true, message: '必填', trigger: 'blur' }],
        sortNo: [{ required: true, message: '必填', trigger: 'blur' }],
        programDetail: [{ required: true, message: '必填', trigger: 'blur' }],
        userAgreement: [{ required: true, message: '必填', trigger: 'blur' }],
        hasSeminars: [{ required: true, message: '必填', trigger: 'blur' }],
        financeHour: [{ required: true, message: '必填', trigger: 'blur' }],
        oralLessonHour: [{ required: true, message: '必填', trigger: 'blur' }],
        internalPushCenter: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        netApplicationCenter: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        hasEnglishSeries: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      programDetailVisible: false,
      editProgramType: null,
    }
  },
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    programId: {
      type: String,
      default: ''
    },
    programType: {
      type: String,
      default: ''
    }
  },
  watch: {
    editVisible: function (val) {
      if (val) {
        this.toPage()
      }
    }
  },
  created () {},
  mounted () {
  },
  methods: {
    // 编辑
    toPage () {
      if (this.programId == '') {
        this.ruleForm.programType = this.programType
        return
      }
      console.log(this.programId)
      api.getProgramDetailById(this.programId).then((res) => {
        console.log(res)
        this.ruleForm = res.data
        if (this.ruleForm.brokerageRate) {
          this.radio = '2'
        } else {
          this.radio = '1'
        }
        this.editProgramType = this.ruleForm.programType
      })
    },
    // 提交
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        const submitData = {
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
          seriesHour: this.ruleForm.seriesHour,
          onlineHour: this.ruleForm.onlineHour,
          certificateSubjectLiveCourseAuthority: this.ruleForm
            .certificateSubjectLiveCourseAuthority,
          seminars: this.ruleForm.seminars,
          priority: this.ruleForm.priority,
          period: this.ruleForm.period,
          periodUnit: this.ruleForm.periodUnit,
          oneOnOneHour: this.ruleForm.oneOnOneHour,
          priceUsd: this.ruleForm.priceUsd,
          priceCny: this.ruleForm.priceCny,
          currencyType: this.ruleForm.currencyType,
          programStatus: this.ruleForm.programStatus,
          programWeight: this.ruleForm.programWeight,
          brokerageRate: this.radio == '1' ? 0 : this.ruleForm.brokerageRate,
          onlineSale: this.ruleForm.onlineSale,
          isPopular: this.ruleForm.isPopular,
          sortNo: this.ruleForm.sortNo,
          programDetail: this.ruleForm.programDetail,
          userAgreement: this.ruleForm.userAgreement,
          internalPushCenter: this.ruleForm.internalPushCenter,
          netApplicationCenter: this.ruleForm.netApplicationCenter,
          hasEnglishSeries: this.ruleForm.hasEnglishSeries,
          hasSeminars: this.ruleForm.hasSeminars,
          financeHour: this.ruleForm.financeHour,
          oralLessonHour: this.ruleForm.oralLessonHour,
          programType: this.ruleForm.programType,
          contractList: this.contractList.concat(this.delContractList)
        }
        console.log(submitData)
        api
          .setProgramDicItem(submitData)
          .then((res) => {
            console.log(res)
            this.clone()
            this.$emit('sumbit')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    clone () {
      this.$emit('close')
      this.contractList = []
      this.delContractList = []
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style lang='scss'>
.contract-name {
  display: inline-block;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.te-yangxi_ipt{
  display: flex;
}
.te-yangxi_ipt .el-form-item__content{
  display: flex;
}
</style>
