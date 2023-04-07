<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-button size="mini" v-if="roleInfo.includes('sales_agreement_model_add')"  class="mr10" @click="addModel()" type="primary">新增协议</el-button>
          
          <el-select class="mr10 ml10" size="mini" filterable v-model="templateStatus" placeholder="启用状态" >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-input v-model="search" style="width:180px" placeholder="搜索内容" size="mini" class="mr10" clearable></el-input>
          <el-button type="primary" size="mini" @click="Topage(1)">GO</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        :max-height="tableHeight"
        style="width: 100%"
      >
        <el-table-column  label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="toDetail(scope.row.pkId)">详情</el-button>
                <el-button type="text" @click="toDelete(scope.row.pkId)" v-if="roleInfo.includes('sales_agreement_model_delete')">删除</el-button>

            </template>
        </el-table-column>
        <el-table-column prop="templateName" label="模板名" align="center"></el-table-column>
        <el-table-column prop="applicableScene" label="模板描述" align="center"></el-table-column>
        <el-table-column prop="templateStatusName" label="是否启用" align="center"></el-table-column>
        <el-table-column label="模板文档" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="mr10" @click="view(scope.row.filePath)">预览</el-button>
            <el-button type="text" @click="down(scope.row.filePath)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="updateByName" label="更新人" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
        <el-table-column prop="createByName" label="创建人" align="center"></el-table-column>
      </el-table>
      <Detail :detailVisible="detailVisible" :pkId="pkId" @close="detailClose" @submit="detailSubmit" />
      <Add :addVisible="addVisible" @close="addClose" @submit="addSubmit" />
    </div>
  </d2-container>
</template>

<script>
import api from "@/api/sales_assistant";
import mixins from "@/plugin/mixins";
import Detail from './components/SupplementaryDetail'
import Add from './components/SupplementaryAdd'
import { downloadFun, downloadFunD } from "@/libs/file";
import { mapState } from 'vuex'

export default {
  name:"SalesAgreementSupplementary",
  mixins: [mixins],
  components:{
    Detail, Add, 
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      loading:false,
      total: 0,
      pageNum: 1,
      tableHeight: 'auto',
      pageSize: 100,
      tableData: [],
      detailVisible:false,
      addVisible:false,
      templateStatus:'',
      search:'',
      pkId:'',
      common_yes_or_no:[
        {itemName:'否',itemValue:'0'},
        {itemName:'是',itemValue:'1'},
      ]
    };
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted() {
    this.Topage();
  },
  methods: {
    Topage() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        templateStatus: this.templateStatus,
      };
      this.loading = true
      api.getTemplateList(params).then(res => {
        this.loading = false
        console.log(res)
        this.total = res.data.total;
        this.tableData = res.data.rows;
      })
    },
    addModel(){
      this.addVisible = true;
    },
    toDetail(row){
      this.pkId = row;
      this.detailVisible = true;
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.Topage(this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.Topage(this.pageNum);
    },
    detailClose(){
        this.detailVisible = false
    },
    detailSubmit(){
        this.Topage()
    },
    addClose(){
        this.addVisible = false;
    },
    addSubmit(){
        this.addVisible = false;
        this.Topage()
    },
    view(path){
        downloadFun(path, url => {
            window.open(url);
        });
    },
    down(path){
      downloadFunD(path, (url) => {
        window.open(url);
      });
    },
    toDelete(pkId){
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delTemplateList(pkId).then(res => {
            this.$message.success('删除成功')
            this.Topage()
          })
        })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>