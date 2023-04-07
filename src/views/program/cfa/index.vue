<!--
 * @Author: 库建华
 * @Date: 2020-04-28 14:32:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-16 11:06:16
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
            v-if="roleInfo.includes(`cfa_search`)"
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
            v-if="roleInfo.includes(`cfa_search`)"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
            <el-button
            icon="el-icon-plus"
            class=""
            v-if="roleInfo.includes(`cfa_new`)"
            size="mini"
            plain
            @click="newdic"
            >新增</el-button>
            <el-button
            v-if="roleInfo.includes(`cfa_sort`)"
            class=""
            size="mini"
            type="primary"
            @click="sortTableBtn"
            >排序</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`cfa_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table :data="tableData" size="mini" highlight-current-row >
            <el-table-column align="center" label="详情" width="200px">
                <template slot-scope="scope">
                <el-button
                    type="text"
                    size="mini"
                    v-if="roleInfo.includes(`cfa_edit`)"
                    @click="toEdit(scope.row.programId)"
                    class="el-icon-tickets"
                >详情</el-button>
                <el-button
                    type="text"
                    size="mini"
                    v-if="roleInfo.includes(`cfa_pic`)"
                    @click="toImg(scope.row.programId)"
                    class="el-icon-picture-outline"
                >图片</el-button>
                <el-button
                    type="text"
                    v-if="roleInfo.includes(`cfa_del`)"
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
            <el-table-column align="center" prop="medalTokens" label="奖牌数量"></el-table-column>
            <el-table-column align="center" prop="hasSeminars" label="线下课"></el-table-column>
            <el-table-column align="center" prop="internalPushCenter" label="内推中心"></el-table-column>
            <el-table-column align="center" prop="netApplicationCenter" label="网申中心"></el-table-column>
            <el-table-column align="center" prop="hasEnglishSeries" label="系列课（英文）"></el-table-column>
            <el-table-column align="center" prop="programDetail" label="项目详情" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="userAgreement" label="用户协议" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="isPopularName" label="是否热门" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="onlineSaleName" label="是否线上可售" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="programStatusName" sortable="custom" label="状态">
                <template slot-scope="scope">{{scope.row.programStatus == 1 ? '启用' :'禁用'}}</template>
            </el-table-column>
            <el-table-column align="center" prop="programWeight"  label="项目KPI权重"></el-table-column>
        </el-table>
        <editProgram
        :editVisible="editVisible"
        :programId="programId"
        :programType="ruleForm.programType"
        @close="editClose"
        @sumbit="editSumbit"
        />
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
import { downloadFun } from '@/libs/file.js'
import mixins from '@/plugin/mixins'
import detailProgram from '../continual/components/detail_program.vue'
import editProgram from '../continual/components/edit_program.vue'
import sortTable from '../continual/components/sortTable.vue'
import imgUpload from '../continual/components/img_upload.vue'
import { mapState } from 'vuex'

export default {
  components: { detailProgram, editProgram, sortTable, imgUpload },
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      loading: false,
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
      tableData: [],
      delVisible: false,
      editVisible: false,
      detailVisible: false,
      pageSize: 400,
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
        currencyType: '',
        programStatus: null,
        programWeight: null,
        programDetail: '',
        userAgreement: '',
        hasSeminars: 'No',
        internalPushCenter: 'No',
        netApplicationCenter: 'No',
        onlineSale: null,
        isPopular: null,
        sortNo: null
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
        programDetail: [{ required: true, message: '必填', trigger: 'blur' }],
        userAgreement: [{ required: true, message: '必填', trigger: 'blur' }],
        hasSeminars: [{ required: true, message: '必填', trigger: 'blur' }],
        internalPushCenter: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        netApplicationCenter: [{ required: true, message: '必填', trigger: 'blur' }],
        onlineSale: [{ required: true, message: '必填', trigger: 'blur' }],
        isPopular: [{ required: true, message: '必填', trigger: 'blur' }],
        sortNo: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      imgVisible: false,
      editProgramType: null,
      programId: ''
    }
  },
  created () {},
  mounted () {
    this.initPage()
    window.dicDelete = (row) => this.dicDelete(row)
  },
  watch: {},
  methods: {
    initPage () {
      api.getProgramDic('cfa').then((res) => {
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
        programType: 'cfa'
      }
      api.getProgramDicList(params).then((res) => {
        console.log('getProgramList', res)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    newdic () {
      this.ruleForm.programType = 'cfa'
      this.programId = ''
      this.editVisible = true
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
              this.Topage(1)
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
        programDetail: this.ruleForm.programDetail,
        userAgreement: this.ruleForm.userAgreement,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        onlineSale: this.ruleForm.onlineSale,
        isPopular: this.ruleForm.isPopular,
        sortNo: this.ruleForm.sortNo,
        hasSeminars: this.ruleForm.hasSeminars
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
          programDetail: this.ruleForm.programDetail,
          userAgreement: this.ruleForm.userAgreement,
          internalPushCenter: this.ruleForm.internalPushCenter,
          netApplicationCenter: this.ruleForm.netApplicationCenter,
          onlineSale: this.ruleForm.onlineSale,
          isPopular: this.ruleForm.isPopular,
          sortNo: this.ruleForm.sortNo,
          hasSeminars: this.ruleForm.hasSeminars,
          programType: this.ruleForm.programType,
          contractList: this.contractList.concat(this.delContractList)
        }
        console.log(submitData)
        api
          .setProgramDicItem(submitData)
          .then((res) => {
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
      this.ruleForm = {
        programId: null,
        programName: '',
        programAlias: '',
        programGroup: null,
        programLevel: null,
        programSubdivision: null,
        mentorHour: 0,
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
        currencyType: '',
        programStatus: null,
        programWeight: null,
        programDetail: '',
        userAgreement: '',
        internalPushCenter: 'No',
        netApplicationCenter: 'No',
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
    editClose () {
      this.editVisible = false
    },
    editSumbit () {
      this.editVisible = false
      this.Topage()
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
