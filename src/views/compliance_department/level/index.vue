<template>
  <d2-container v-loading="loading" >
    <div class="level">
        <div class="search_page">
        <div class="search">
            <el-button
            icon="el-icon-circle-plus-outline"
            class="mr10 "
            size="mini"
            plain
            @click="addLevel"
            >新增</el-button>
            <el-select
            :style="{width:widths}"
            class=" "
            filterable
            clearable
            v-model="dept"
            size="mini"
            placeholder="请选择部门"
            @change="Topage"
            >
            <el-option
                v-for="item in wst_department"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
        </div>
        </div>
        <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        style="width: 100%"
        >
        <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editItem(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="deptName" align="center" label="部门" min-width="100"></el-table-column>
        <el-table-column prop="deptLevel" align="center" label="部门等级" min-width="100"></el-table-column>
        <el-table-column prop="wstLevel" align="center" label="wst等级" min-width="100"></el-table-column>
        <el-table-column prop="basicWage" align="center" label="基础工资" min-width="100"></el-table-column>
        <el-table-column prop="brokerageRate1" align="center" label="基础提成" min-width="100"></el-table-column>
        <el-table-column prop="brokerageRate2" align="center" label="激励提成" min-width="100"></el-table-column>
        <el-table-column prop="kpiTarget" align="center" label="签约KPI目标" min-width="100"></el-table-column>
        <el-table-column prop="monthlyRevenueKpi" align="center" label="入账KPI目标" min-width="100"></el-table-column>
        <!-- <el-table-column prop="quarterlyTeamConversionKpi" align="center" label="季度团队转化率指标" min-width="100"></el-table-column>
        <el-table-column prop="quarterlyBrokerageRate" align="center" label="季度奖金比例" min-width="100"></el-table-column> -->
        <el-table-column prop="sortNo" align="center" label="排序" min-width="100"></el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false"
        :title="levelData.levelId ?'编辑':'新增'"
        :visible.sync="editVisible"
        width="380px"
        :before-close="close"
        >
        <el-form size="mini" :model="levelData" :rules="rules" ref="levelData" label-width="120px">
            <el-form-item label="部门" prop="deptId">
            <el-select :style="{width:widths}" filterable v-model="levelData.deptId" placeholder="请选择">
                <el-option
                v-for="item in wst_department"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="部门等级" prop="deptLevel">
            <el-select
                allow-create
                default-first-option
                :style="{width:widths}"
                filterable
                v-model="levelData.deptLevel"
                placeholder="请选择"
            >
                <el-option v-for="item in 10" :key="item" :label="item" :value="item+''"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="公司等级" prop="wstLevel">
            <el-select
                :style="{width:widths}"
                filterable
                v-model="levelData.wstLevel"
                placeholder="请选择"
            >
                <el-option v-for="item in 20" :key="item" :label="item" :value="item+''"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="基础薪资" prop="basicWage">
            <el-input-number :controls="false" :style="{width:widths}" v-model="levelData.basicWage"></el-input-number>
            </el-form-item>
            <el-form-item label="基础提成%" prop="brokerageRate1">
            <el-input-number
                :controls="false"
                :style="{width:widths}"
                v-model="levelData.brokerageRate1"
            ></el-input-number>
            </el-form-item>
            <el-form-item label="激励提成%" prop="brokerageRate2">
            <el-input-number
                :controls="false"
                :style="{width:widths}"
                v-model="levelData.brokerageRate2"
            ></el-input-number>
            </el-form-item>
            <el-form-item label="签约KPI目标" prop="kpiTarget">
            <el-input-number :controls="false" :style="{width:widths}" v-model="levelData.kpiTarget"></el-input-number>
            </el-form-item>
            <el-form-item label="入账KPI目标" prop="monthlyRevenueKpi">
            <el-input-number :controls="false" :style="{width:widths}" v-model="levelData.monthlyRevenueKpi"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="季度团队转化率指标" prop="quarterlyTeamConversionKpi">
            <el-input-number :controls="false" :style="{width:widths}" v-model="levelData.quarterlyTeamConversionKpi"></el-input-number>
            </el-form-item>
            <el-form-item label="季度奖金比例" prop="quarterlyBrokerageRate">
            <el-input-number :controls="false" :style="{width:widths}" v-model="levelData.quarterlyBrokerageRate"></el-input-number>
            </el-form-item> -->
            <el-form-item label="排序" prop="sortNo">
            <el-input-number :style="{width:widths}" v-model="levelData.sortNo"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </span>
        </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/hr.js'
import api2 from '@/api/user.js'
export default {
  name: 'level',
  mixins: [mixins],
  data () {
    return {
      tableData: [],
      loading: false,
      levelData: {},
      editVisible: false,
      widths: '150px',
      rules: {
        deptId: [{ required: true, message: '必填', trigger: 'blur' }],
        deptLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        wstLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        basicWage: [{ required: true, message: '必填', trigger: 'blur' }],
        monthlyRevenueKpi: [{ required: true, message: '必填', trigger: 'blur' }],
        quarterlyTeamConversionKpi: [{ required: true, message: '必填', trigger: 'blur' }],
        quarterlyBrokerageRate: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      dept: '',
      wst_department: []
    }
  },
  mounted () {
    this.Topage()
    api2.getDeptList().then(res => {
      console.log('getDeptList', res)
      this.wst_department = res.data
    })
  },
  methods: {
    Topage () {
      this.loading = true
      const params = {
        dept: this.dept,
        deptLevel: '',
        wstLevel: ''
      }
      api.getLevelList(params).then(res => {
        console.log(res)
        this.tableData = res.data
        this.loading = false
      })
    },
    addLevel () {
      this.levelData = {
        sortNo: '1'
      }
      this.editVisible = true
    },
    editItem (v) {
      this.levelData = { ...v }
      this.editVisible = true
    },
    close () {
      this.$refs.levelData.resetFields()
      this.editVisible = false
      this.levelData = {}
    },
    submit () {
      this.$refs.levelData.validate(valid => {
        console.log(valid)
        if (!valid) return
        console.log(this.levelData)
        const data = {
          addList: [],
          uptList: []
        }
        const submitData = {
          deptId: this.levelData.deptId,
          deptLevel: this.levelData.deptLevel,
          wstLevel: this.levelData.wstLevel,
          basicWage: this.levelData.basicWage,
          brokerageRate1: this.levelData.brokerageRate1,
          brokerageRate2: this.levelData.brokerageRate2,
          kpiTarget: this.levelData.kpiTarget,
          sortNo: this.levelData.sortNo,
          monthlyRevenueKpi: this.levelData.monthlyRevenueKpi,
          quarterlyTeamConversionKpi: this.levelData.quarterlyTeamConversionKpi,
          quarterlyBrokerageRate: this.levelData.quarterlyBrokerageRate
        }
        if (!this.levelData.levelId) {
          data.addList.push(submitData)
        } else {
          submitData.levelId = this.levelData.levelId
          data.uptList.push(submitData)
        }
        api.setLevel(data).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.close()
          this.Topage()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
