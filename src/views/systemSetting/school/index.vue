<template>
  <d2-container v-loading="loading">
    <div class="dictionary">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="Topage(1)"
            ></el-input>
            <el-select
            :style="{width:'150px'}"
            v-model="country"
            class="mr10"
            size="mini"
            filterable
            clearable
            placeholder="请选择学校地区"
            @change="Topage(1)"
            >
            <el-option
                v-for="item in COUNTRY"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-select
            :style="{width:'150px'}"
            v-model="type"
            class="mr10"
            size="mini"
            filterable
            clearable
            placeholder="请选择学校类型"
            @change="Topage(1)"
            >
            <el-option
                v-for="item in school_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
            <el-button
            icon="el-icon-search"
            class=""
            v-if="roleInfo.includes(`school_search`)"
            size="mini"
            plain
            @click="Topage(1)"
            >搜索</el-button>
            <el-button
            icon="el-icon-plus"
            class=""
            v-if="roleInfo.includes(`school_new`)"
            size="mini"
            plain
            @click="newdic"
            >新增</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`school_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table :data="tableList" size="mini" highlight-current-row stripe>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini" type="text" v-if="roleInfo.includes(`school_edit`)" @click="dicedit(scope.row)" title="编辑">编辑</el-button>
                    <el-button size="mini" type="text" @click="academy(scope.row)" title="学院" >学院</el-button>
                    <el-button size="mini" type="text" v-if="roleInfo.includes(`school_del`)" @click="dicDelete(scope.row)" title="删除" >删除</el-button>
                </template>
            </el-table-column>
            <el-table-column label="学校名称(中文)" prop="chiName" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="学校名称(英文)" prop="engName" show-overflow-tooltip></el-table-column>
            <el-table-column label="学校所在城市" prop="countryName" show-overflow-tooltip></el-table-column>
            <el-table-column label="学校类型" prop="schoolTypeName"  show-overflow-tooltip></el-table-column>
            <el-table-column label="大学类型" prop="universityTypeName" show-overflow-tooltip></el-table-column>
            <el-table-column label="负责部门--本科" prop="undergraduateDivision" show-overflow-tooltip></el-table-column>
            <el-table-column label="remark" prop="remark" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="'确认删除学校字典项'" :visible.sync="delVisible" width="650px" :before-close="clone"></el-dialog>
        <el-dialog :close-on-click-modal="false" :title="'学校字典项'" :visible.sync="visible" width="650px" :before-close="clone">
            <el-form
                :model="ruleForm"
                :rules="rules"
                size="mini"
                ref="ruleForm"
                inline
                label-width="95px"
            >
                <el-form-item label-width="200px" label="学校名称(中文)：" prop="chiName">
                <el-input style="width:350px" v-model="ruleForm.chiName" maxlength="99"></el-input>
                </el-form-item>
                <el-form-item label-width="200px" label="学校名称(英文)：" prop="engName">
                <el-input style="width:350px" v-model="ruleForm.engName" maxlength="99"></el-input>
                </el-form-item>
                <el-form-item label-width="200px" label="学校所在城市：" prop="country">
                <el-select
                    :style="{width:'350px'}"
                    v-model="ruleForm.country"
                    filterable
                    placeholder="请选择学校所在城市"
                >
                    <el-option
                    v-for="item in COUNTRY"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label-width="200px" label="学校类型：" prop="schoolType">
                <el-select
                    :style="{width:'350px'}"
                    v-model="ruleForm.schoolType"
                    filterable
                    placeholder="请选择学校类型"
                >
                    <el-option
                    v-for="item in school_type"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                    ></el-option>
                </el-select>
                </el-form-item>

                <el-form-item
                label-width="200px"
                label="大学类型："
                prop="universityType"
                v-if="ruleForm.schoolType == 'university' && ruleForm.country == 'US'"
                >
                <el-select
                    :style="{width:'350px'}"
                    v-model="ruleForm.universityType"
                    filterable
                    placeholder="请选择学校类型"
                >
                    <el-option
                    v-for="item in university_type"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label-width="200px" label="负责部门--本科：" prop="undergraduateDivision">
                <el-input style="width:350px" v-model="ruleForm.undergraduateDivision" maxlength="99"></el-input>
                </el-form-item>
                <el-form-item label-width="200px" label="备注：" prop="remark">
                <el-input
                    style="width:350px"
                    v-model="ruleForm.remark"
                    type="textarea"
                    rows="3"
                    maxlength="99"
                ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clone">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <academy :academyVisible="academyVisible" :schoolData="ruleForm" @close="academyClose" />
    </div>
  </d2-container>
</template>

<script>
import axios from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import academy from './components/school_academy.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { academy },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      COUNTRY: [],
      search: '',
      pageSize: 400,
      type: '',
      pageNum: 1,
      school_type: [],
      country: '',
      total: 0,
      loading: false,
      tableList: [],
      visible: false,
      delVisible: false,
      ruleForm: {
        schoolId: null,
        chiName: '',
        engName: '',
        country: '',
        undergraduateDivision: '',
        remark: '',
        graduateGroup: '',
        undergraduateGroup: '',
        graduateDivision: ''
      },
      rules: {
        chiName: [
          { required: true, message: '请输入中文学校名', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '请选择学校所在城市', trigger: 'blur' }
        ],
        schoolType: [
          { required: true, message: '请选择学校类型', trigger: 'blur' }
        ],
        universityType: [
          { required: true, message: '请选择大学类型', trigger: 'blur' }
        ],
        remark: [
          { max: 60, message: '备注长度不超过60个字符', trigger: 'blur' }
        ]
      },
      newdicItemValue: '',
      university_type: [],
      academyVisible: false
    }
  },
  mounted () {
    this.Topage(1)
    this.pageInit()
    window.dicedit = row => this.dicedit(row)
    window.academy = row => this.academy(row)
    window.dicDelete = row => this.dicDelete(row)
    window.deleteNewDic = row => this.deleteNewDic(row)
  },
  methods: {
    async pageInit () {
      this.COUNTRY = await this.getDictionary('country')
      this.track_type = await this.getDictionary('track_type')
      this.university_type = await this.getDictionary('university_type')
      this.school_type = await this.getDictionary('school_type')
    },
    Topage () {
      this.loading = true
      const Data = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        schoolType: this.type,
        country: this.country
      }
      axios.getSchoolDicList(Data).then(({ data }) => {
        this.pageNum = data.page
        const rows = data.rows
        this.tableList = rows
        this.total = data.total
        this.loading = false
      })
    },
    newdic () {
      this.visible = true
    },
    // 添加字典项
    newdicitem () {
      if (!this.newdicItemValue) {
        this.$message({
          message: '字典key不可为空',
          type: 'error'
        })
        return
      }
      const len = this.settingsdic.data.length
      const list = []
      for (let i = 0; i < len; i++) {
        list.push(this.settingsdic.data[i].itemValue)
      }
      list.push(this.newdicItemValue)
      const set = new Set(list)
      if (len + 1 != set.size) {
        this.$message({
          message: '字典key不可重复',
          type: 'error'
        })
        this.newdicItemValue = ''
        return
      }
      this.settingsdic.data.push({
        itemName: '',
        itemValue: this.newdicItemValue,
        sortNo: null
      })
      this.newdicItemValue = ''
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
    dicedit (row) {
      const item = row
      this.ruleForm = { ...item }
      this.visible = true
    },
    // 编辑
    academy (row) {
      const item = row
      this.ruleForm = { ...item }
      this.academyVisible = true
    },
    academyClose () {
      this.academyVisible = false
    },
    // 删除
    dicDelete (row) {
      const item = row
      console.log(item, row)
      this.ruleForm = { ...item }
      this.$confirm(
        `此操作将永久删除该条目, 是否继续? （${item.chiName}）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const submitData = {
            schoolId: item.schoolId,
            delFlag: 1
          }
          axios
            .setSchoolDicItem(submitData)
            .then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.Topage(1)
            })
            .catch(err => {
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
    // 提交
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        if (
          this.ruleForm.schoolType != 'university' ||
          this.ruleForm.country != 'US'
        ) {
          this.ruleForm.universityType = ''
        }
        const submitData = this.ruleForm
        console.log(submitData)
        axios
          .setSchoolDicItem(submitData)
          .then(res => {
            console.log(res)
            this.clone()
            this.Topage(1)
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    clone () {
      this.visible = false
      this.ruleForm = {
        schoolId: null,
        chiName: '',
        engName: '',
        country: '',
        undergraduateDivision: '',
        remark: '',
        graduateGroup: '',
        undergraduateGroup: '',
        graduateDivision: ''
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
