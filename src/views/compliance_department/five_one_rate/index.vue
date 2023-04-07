<template>
  <d2-container v-loading="loading">
    <div class="five-one-rate">
        <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        style="width: 100%"
        >
        <el-table-column min-width="100px" align="center" label="操作" width="100">
            <template slot-scope="scope">
            <el-button type="text" @click="editor(scope.row)" title="编辑" class="el-icon-edit"></el-button>
            </template>
        </el-table-column>
        <el-table-column prop="office" min-width="100px" align="center" label="office"></el-table-column>
        <el-table-column
            prop="endowmentInsuranceUser"
            min-width="100px"
            align="center"
            label="养老保险个人缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.endowmentInsuranceUser+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="endowmentInsuranceWst"
            min-width="100px"
            align="center"
            label="养老保险单位缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.endowmentInsuranceWst+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="medicalInsuranceUser"
            min-width="100px"
            align="center"
            label="医疗保险个人缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.medicalInsuranceUser+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="medicalInsuranceWst"
            min-width="100px"
            align="center"
            label="医疗保险单位缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.medicalInsuranceWst+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="unemploymentInsuranceUser"
            min-width="100px"
            align="center"
            label="失业保险个人缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.unemploymentInsuranceUser+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="unemploymentInsuranceWst"
            min-width="100px"
            align="center"
            label="失业保险单位缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.unemploymentInsuranceWst+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="injuryInsuranceWst"
            min-width="100px"
            align="center"
            label="工伤保险单位缴纳比例"
        >
            <template slot-scope="scope">{{scope.row.injuryInsuranceWst+'%'}}</template>
        </el-table-column>
        <el-table-column prop="birthInsuranceWst" min-width="100px" align="center" label="生育保险单位缴纳比例">
            <template slot-scope="scope">{{scope.row.birthInsuranceWst+'%'}}</template>
        </el-table-column>
        <el-table-column prop="houseFundUser" min-width="100px" align="center" label="住房公积金 个人缴纳比例">
            <template slot-scope="scope">{{scope.row.houseFundUser+'%'}}</template>
        </el-table-column>
        <el-table-column prop="houseFundWst" min-width="100px" align="center" label="住房公积金 单位缴纳比例">
            <template slot-scope="scope">{{scope.row.houseFundWst+'%'}}</template>
        </el-table-column>
        <el-table-column
            prop="medicalInsuranceUserExtra"
            min-width="100px"
            align="center"
            label="医疗保险个人额外缴纳金额 RMB"
        ></el-table-column>
        <el-table-column prop="taxBasic" min-width="100px" align="center" label="个税起征点 元"></el-table-column>
        <el-table-column prop="note" min-width="100px" align="center" label="备注"></el-table-column>
        </el-table>
        <editor
        :editVisible="editVisible"
        :editData1="editData"
        @close="editClose"
        @submit="editSubmit"
        />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/hr'
import editor from './components/rate_edit.vue'
export default {
  name: 'five_one_rate',
  components: { editor },
  data () {
    return {
      tableData: [],
      loading: false,
      editVisible: false,
      editData: {}
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      api.getRate().then(res => {
        console.log(res.data)
        this.loading = false
        this.tableData = res.data
      })
    },
    editor (item) {
      this.editData = item
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
      this.editData = {}
    },
    editSubmit () {
      this.editClose()
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
