<!--
 * @Author: 库建华
 * @Date: 2020-05-07 10:54:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-23 10:29:36
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="dictionary">
        <div class="search_page">
        <div class="search">
            <el-select style="width:150px" v-model="templateStatus" size="mini" @change="Topage()" class="mr10" placeholder="模板状态">
            <el-option
                v-for="item in templateStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue">
            </el-option>
            </el-select>
            <el-select style="width:150px" v-model="supplementaryType" @change="Topage()" size="mini" class="mr10" placeholder="协议类型">
            <el-option
                v-for="item in order_supplementary_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue">
            </el-option>
            </el-select>

            <el-button
            icon="el-icon-plus"
            class="mr10"
            v-if="roleInfo.includes(`supplementary_new`)"
            size="mini"
            plain
            @click="newdic('')"
            >新增</el-button>
        </div>
        <pagination
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table :data="tableData" @row-dblclick="toEdit" size="mini" highlight-current-row >
        <el-table-column align="center" prop="supplementaryTypeName" label="模板类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="contractName" label="模板名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="contractTitle" label="模板标题" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="templateStatusName" label="模板状态" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
        <addProgram
        :visible="visible"
        :programId="programId"
        @close="addClose"
        @submit="addSumbit"
        />
        <detailProgram
        :detailVisible="detailVisible"
        :programId="programId"
        @close="detailClose"
        @submit="detailSumbit"
        @del="detailDel"
        />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import detailProgram from './components/detail_supplementary.vue'
import addProgram from './components/add_supplementary.vue'
import { mapState } from 'vuex'

export default {
  components: { detailProgram, addProgram },
  mixins: [mixins],
  data () {
    return {
      programIdList: [],
      templateStatusList: [
        { itemName: '启用', itemValue: '1' },
        { itemName: '禁用', itemValue: '0' }
      ],
      YrN: [
        { itemName: '是', itemValue: 'Yes' },
        { itemName: '否', itemValue: 'No' }
      ],
      search: '',
      pageNum: 1,
      total: 0,
      tableData: [],
      visible: false,
      delVisible: false,
      addVisible: false,
      detailVisible: false,
      templateStatus: '',
      supplementaryType: '',
      contractList: [],
      delContractList: [],
      order_supplementary_type: [],
      programDetailVisible: false,
      editProgramType: null,
      loading: false,
      pageSize: 400,
      programId: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  created () {},
  mounted () {
    this.Topage()
    this.pageInit()
  },
  watch: {},
  methods: {
    async pageInit () {
      this.order_supplementary_type = await this.getDictionary('order_supplementary_type')
    },
    Topage () {
      this.loading = true
      const params = {
        supplementaryType: this.supplementaryType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        templateStatus: this.templateStatus,
        sortCol: this.sortCol,
        sort: this.sort
      }
      api.getSupplementary(params).then((res) => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    newdic (programId) {
      this.programId = programId
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
    toEdit (row) {
      console.log(row)
      this.programId = row.pkId
      this.detailVisible = true
    },
    detailDel () {
      this.detailVisible = false
      this.Topage()
    },
    delContinual (programId) {
      this.$confirm('此操作将永久删除该模板, 是否继续? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api
          .deleterefSupplementary(programId)
          .then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.Topage()
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    detailClose () {
      this.detailVisible = false
    },
    addClose () {
      this.visible = false
    },
    addSumbit () {
      this.visible = false
      this.Topage()
    },
    detailSumbit () {
      this.Topage()
    }
  }
}
</script>

<style lang='scss'>
</style>
