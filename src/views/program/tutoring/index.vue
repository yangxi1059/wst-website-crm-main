<!--
 * @Author: 库建华
 * @Date: 2020-05-07 10:54:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-23 10:17:38
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="dictionary">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            v-if="roleInfo.includes(`tutoring_search`)"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持项目名"
            @keyup.enter.native="Topage()"
            ></el-input>
            <el-button
            icon="el-icon-search"
            class=""
            v-if="roleInfo.includes(`tutoring_search`)"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
            <el-button
            icon="el-icon-plus"
            class=""
            v-if="roleInfo.includes(`tutoring_new`)"
            size="mini"
            plain
            @click="newdic"
            >新增</el-button>
            <el-button
            v-if="roleInfo.includes(`tutoring_sort`)"
            class=""
            size="mini"
            type="primary"
            @click="sortTableBtn"
            >排序</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`tutoring_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table :data="tableData" size="mini" highlight-current-row >
        <!-- @sort-change="sortTable" -->
        <el-table-column align="center" label="详情" width="200px">
            <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                v-if="roleInfo.includes(`tutoring_edit`)"
                @click="toEdit(scope.row.programId)"
                class="el-icon-tickets"
            >详情</el-button>
            <el-button
                type="text"
                size="mini"
                v-if="roleInfo.includes(`tutoring_pic`)"
                @click="toImg(scope.row.programId)"
                class="el-icon-picture-outline"
            >图片</el-button>
            <el-button
                type="text"
                v-if="roleInfo.includes(`tutoring_del`)"
                size="mini"
                @click="delContinual(scope.row.programId)"
                class="el-icon-delete"
            >删除</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="programName" label="项目名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="period" label="周期"></el-table-column>
        <el-table-column align="center" prop="periodUnit" label="周期单位"></el-table-column>
        <el-table-column align="center" prop="priceUsd" label="价格（USD）"></el-table-column>
        <el-table-column align="center" prop="priceCny" label="价格（CNY）"></el-table-column>
        <el-table-column align="center" prop="currencyType" label="项目价格类型："></el-table-column>
        <el-table-column align="center" prop="hasSeminars" label="线下课"></el-table-column>
        <el-table-column align="center" prop="internalPushCenter" label="内推中心"></el-table-column>
        <el-table-column align="center" prop="netApplicationCenter" label="系列课（英文）"></el-table-column>
        <el-table-column align="center" prop="hasEnglishSeries" label="网申中心"></el-table-column>
        <el-table-column align="center" prop="programDetail" label="项目详情" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="userAgreement" label="用户协议" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="isPopularName" label="是否热门" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="onlineSaleName" label="是否线上可售" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="programStatusName" sortable="custom" label="状态">
            <template slot-scope="scope">{{scope.row.programStatus == 1 ? '启用' :'禁用'}}</template>
        </el-table-column>
        <el-table-column align="center" prop="programWeight"  label="项目KPI权重"></el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" title="项目内容" :visible.sync="visible" width="1050px" :before-close="clone">
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
            <el-form-item label="课业辅导一对一：" prop="tutoringMentorHour">
            <input-number v-model="ruleForm.tutoringMentorHour"></input-number>
            </el-form-item>
            <el-form-item label="线下课：" prop="hasSeminars">
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
            <el-form-item label="内推中心：" prop="internalPushCenter">
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
            <el-form-item label="网申中心：" prop="netApplicationCenter">
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
                placeholder="请选择"
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="clone">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
        </el-dialog>
        <detailProgram
        :detailVisible="detailVisible"
        :programId="programId"
        @close="detailClose"
        @sumbit="detailSumbit"
        />
        <sortTable :sortableVisible="sortableVisible" :sortableData="tableData" @close="closeSort()" @submit="submitSort()" />
        <imgUpload :imgVisible="imgVisible" :programId="programId" @close="closeImg()" @submit="submitImg()" />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import detailProgram from '../continual/components/detail_programm_tutoring.vue'
import sortTable from '../continual/components/sortTable.vue'
import inputNumber from '@/components/input_number.vue'
import imgUpload from '../continual/components/img_upload.vue'
import { mapState } from 'vuex'

export default {
  components: { inputNumber, detailProgram, sortTable, imgUpload },
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
      sortableVisible: false,
      search: '',
      pageNum: 1,
      total: 0,
      loading: false,
      pageSize: 400,
      tableData: [],
      visible: false,
      delVisible: false,
      detailVisible: false,
      contractList: [],
      delContractList: [],
      ruleForm: {
        programId: null,
        programName: '',
        programAlias: '',
        period: null,
        periodUnit: null,
        priceUsd: null,
        priceCny: null,
        medalTokens: null,
        currencyType: 'usd',
        programStatus: null,
        programWeight: null,
        programDetail: '',
        userAgreement: '',
        internalPushCenter: 'No',
        netApplicationCenter: 'No',
        hasEnglishSeries: 'No',
        onlineSale: null,
        isPopular: null,
        sortNo: null,
        hasSeminars: 'No'
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
        tutoringMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
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
        medalTokens: [{ required: true, message: '必填', trigger: 'blur' }],
        programStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        programWeight: [{ required: true, message: '必填', trigger: 'blur' }],
        programDetail: [{ required: true, message: '必填', trigger: 'blur' }],
        userAgreement: [{ required: true, message: '必填', trigger: 'blur' }],
        hasSeminars: [{ required: true, message: '必填', trigger: 'blur' }],
        internalPushCenter: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        netApplicationCenter: [{ required: true, message: '必填', trigger: 'blur' }],
        hasEnglishSeries: [{ required: true, message: '必填', trigger: 'blur' }],
        onlineSale: [{ required: true, message: '必填', trigger: 'blur' }],
        isPopular: [{ required: true, message: '必填', trigger: 'blur' }],
        sortNo: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      programDetailVisible: false,
      imgVisible: false,
      editProgramType: null,
      program_type: [],
      programId: '',
      tutoring_subject: []
    }
  },
  created () {},
  mounted () {
    this.initPage()
    this.pageInit()
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  watch: {},
  methods: {
    async pageInit () {
      this.program_type = await this.getDictionary('program_type')
      this.tutoring_subject = await this.getDictionary('tutoring_subject')
    },
    initPage () {
      api.getProgramDic('tutoring').then((res) => {
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
        this.Topage()
      })
    },
    Topage () {
      this.loading = true
      const params = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        programType: 'tutoring'
      }
      api.getProgramDicList(params).then((res) => {
        console.log('getProgramList', res)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    newdic () {
      this.ruleForm.programType = 'tutoring'
      this.visible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 编辑
    toEdit (programId) {
      console.log(programId)
      this.programId = programId
      this.detailVisible = true
    },
    // 主图，详情图
    toImg (programId) {
      this.programId = programId
      this.imgVisible = true
    },
    closeImg () {
      this.imgVisible = false
    },
    submitImg () {
      this.imgVisible = false
      this.Topage()
    },
    sortTableBtn () {
      this.sortableVisible = true
    },
    submitSort () {
      this.sortableVisible = false
      this.Topage()
    },
    closeSort () {
      this.sortableVisible = false
    },
    delContinual (programId) {
      this.$confirm('此操作将永久删除该条目, 是否继续? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const submitData = {
          programId: programId,
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
            this.Topage(1)
          })
          .catch((err) => {
            console.log(err)
          })
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
          tutoringMentorHour: this.ruleForm.tutoringMentorHour,
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
          medalTokens: this.ruleForm.medalTokens,
          programStatus: this.ruleForm.programStatus,
          programWeight: this.ruleForm.programWeight,
          programDetail: this.ruleForm.programDetail,
          userAgreement: this.ruleForm.userAgreement,
          internalPushCenter: this.ruleForm.internalPushCenter,
          netApplicationCenter: this.ruleForm.netApplicationCenter,
          hasEnglishSeries: this.ruleForm.hasEnglishSeries,
          onlineSale: this.ruleForm.onlineSale,
          isPopular: this.ruleForm.isPopular,
          sortNo: this.ruleForm.sortNo,
          hasSeminars: this.ruleForm.hasSeminars,
          programType: this.ruleForm.programType,
          contractList: this.contractList.concat(this.delContractList)
        }
        console.log(submitData)
        this.loading = true
        api
          .setProgramDicItem(submitData)
          .then((res) => {
            this.loading = false
            console.log(res)
            this.clone()
            this.initPage()
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    clone () {
      this.visible = false
      this.contractList = []
      this.delContractList = []
      this.$refs.ruleForm.resetFields()
    },
    // 添加合同
    addContract () {
      console.log('addContract', this.contractList)
      this.contractList.push({})
    },
    // 删除合同
    deleteContract (i) {
      this.delContractList.push({
        pkId: this.contractList[i].pkId,
        delFlag: '1'
      })
      this.contractList.splice(i, 1)
    },
    changeClose () {
      this.programDetailVisible = false
      this.ruleForm = {
        programId: null,
        programName: '',
        programAlias: '',
        programGroup: null,
        programLevel: null,
        programSubdivision: null,
        tutoringMentorHour: 0,
        applicationLetterModify: 0,
        leadStrategistHour: 0,
        jerryHour: 0,
        seniorStrategist: null,
        emergencyMentor: null,
        interviewMentor: null,
        mentorCount: 0,
        signVip: 'ALL',
        tequilaShotHour: 0,
        officeHour: 0,
        seriesHour: 0,
        onlineHour: 0,
        certificateSubjectLiveCourseAuthority: null,
        seminars: 0,
        priority: null,
        period: null,
        periodUnit: null,
        oneOnOneHour: 0,
        priceUsd: null,
        priceCny: null,
        currencyType: 'usd',
        medalTokens: null,
        programStatus: null,
        programWeight: null,
        programDetail: '',
        userAgreement: '',
        internalPushCenter: 'No',
        netApplicationCenter: 'No',
        hasEnglishSeries: 'No',
        onlineSale: null,
        isPopular: null,
        sortNo: null,
        hasSeminars: 'No'
      }
      this.contractList = []
    },
    editProgram () {
      console.log(this.programId)
    },
    changeSubmit () {
      this.ruleForm.programType = 'tutoring'
      this.visible = true
      this.changeClose()
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSumbit () {
      console.log(313123113131231)
      this.Topage()
    }
  }
}
</script>

<style lang='scss'>
</style>
