<template>
  <d2-container v-loading="loading">
    <div class="dictionary ">
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
            style="width:150px"
            v-model="trackType"
            class="mr10"
            size="mini"
            filterable
            placeholder="请选择"
            @change="Topage()"
          >
            <el-option
              v-for="item in track_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class=""
            v-if="roleInfo.includes(`company_search`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="mr10"
            v-if="roleInfo.includes(`company_new`)"
            size="mini"
            plain
            @click="newdic"
          >新增</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`company_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        class="dictionaryImgYx"
        :data="tableData"
        size="mini"
        border
        stripe
      >
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" v-if="roleInfo.includes('company_edit')" size="mini" @click="dicedit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="roleInfo.includes('company_del')" size="mini" @click="dicDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="companyId" align="center" label="公司ID" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="公司LOGO" >
          <template slot-scope="scope">
              <img :src="scope.row.logo" alt="logo" />
          </template>
        </el-table-column>
        <el-table-column prop="companyName" align="center" label="公司名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="trackTypeName" align="center" label="公司行业" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" :title="'公司'" :visible.sync="visible" width="650px" :before-close="clone">
      <el-form
        :model="ruleForm"
        :rules="rules"
        size="medium"
        ref="ruleForm"
        inline
        label-width="95px"
      >
        <el-form-item label-width="200px" label="公司ID：" prop="companyId">
          <el-input style="width:350px" disabled v-model="ruleForm.companyId"></el-input>
        </el-form-item>
        <el-form-item label-width="200px" label="公司名称：" prop="companyName">
          <el-input style="width:350px" v-model="ruleForm.companyName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label-width="200px" label="公司行业：" prop="trackType">
          <el-select v-model="ruleForm.trackType" filterable placeholder="请选择">
            <el-option
              v-for="item in track_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="200px" label="公司LOGO:">
          <div>
            <img style="max-width:100px" v-if="ruleForm.logo" :src="ruleForm.logo" alt />
            <span v-else>暂无</span>
          </div>
          <App-cropper
            :width="300"
            :height="300"
            :fixed-number="[1,1]"
            @subUploadSucceed="getShopImages">
          </App-cropper>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clone">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>
<script>
import axios from '@/api/dictionary'
import { mapState } from 'vuex'
import mixins from '@/plugin/mixins'
import AppCropper from './components/Cropper.vue'

export default {
  mixins: [mixins],
  components: { AppCropper },
  data () {
    return {
      COUNTRY: [],
      search: '',
      pageNum: 1,
      total: 0,
      trackType: '',
      tableData: [],
      visible: false,
      pageSize: 400,
      loading: false,
      isedit: false,
      ruleForm: {
        companyId: null,
        companyName: '',
        trackType: '',
        logo: ''
      },
      rules: {
        companyName: [{ required: true, message: '必填', trigger: 'blur' }],
        trackType: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      newdicItemValue: '',
      track_type: [],
      file: null,
      file_list: []
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mounted () {
    this.Topage(1)
    this.pageInit()
    window.dicedit = row => this.dicedit(row)
    window.dicDelete = row => this.dicDelete(row)
    window.deleteNewDic = row => this.deleteNewDic(row)
  },
  methods: {
    async pageInit () {
      this.COUNTRY = await this.getDictionary('country')
      this.track_type = await this.getDictionary('track_type')
    },
    Topage () {
      this.loading = true
      const Data = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        trackType: this.trackType
      }
      axios.getCompanyListSetting(Data).then(res => {
        console.log('公司列表数据：', res)
        this.pageNum = res.data.page
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    newdic () {
      this.visible = true
    },
    change (v, file_list) {
      console.log('change', v, file_list)
      this.file = v
      this.file_list = file_list.slice(-1)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 图片上传成功
    getShopImages (url) {
      this.ruleForm.logo = url
      console.log(url)
    },
    // 编辑
    dicedit (row) {
      const item = row
      console.log(item, row)
      this.ruleForm = { ...item }
      this.visible = true
    },
    // 删除
    dicDelete (row) {
      const item = row
      console.log(item, row)
      this.ruleForm = { ...item }
      this.$confirm(
        `此操作将永久删除该条目, 是否继续?
         （${item.companyName}）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const submitData = {
            companyId: item.companyId,
            delFlag: 1
          }
          axios
            .getCompanyItem({ uptList: [submitData] })
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
        const submitData = JSON.parse(JSON.stringify(this.ruleForm))
        console.log(submitData)
        if (!this.file) {
          let data
          if (!submitData.companyId) {
            data = {
              addList: [submitData]
            }
          } else {
            data = {
              uptList: [submitData]
            }
          }
          axios
            .getCompanyItem(data)
            .then(res => {
              console.log(res)
              this.clone()
              this.Topage(1)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    clone () {
      this.visible = false
      this.ruleForm = {
        internshipId: null,
        internshipName: '',
        priceUsd: '',
        logo: ''
      }
      this.file = null
    }
  }
}
</script>

<style lang='scss'>
.dictionaryImgYx img {
  max-width: 50px;
  max-height: 20px;
}
</style>
