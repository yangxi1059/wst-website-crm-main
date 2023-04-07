<!--
 * @Author: kaan
 * @Date: 2021-10-20 10:44:21
 * @LastEditors: kaan
 * @LastEditTime: 2022-02-16 17:09:13
 * @Version:
 * @Description: 设置公共模板列表
-->

<template>
  <div>
    <el-drawer 
      :title="`公共模板列表`"
      :visible.sync="commonVisible"
      size="900px"
      :before-close="close"
    >
      <div class="drawer_container">
        <el-input v-model="search" class="mr10 mb10" :style="{width:'180px'}" size="mini" placeholder="请输入内容"></el-input>
        <el-select
          :style="{width:'180px'}"
          class="mr10 mb10"
          v-model="contractStatus"
          filterable
          clearable
          size="mini"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in [{itemName:'禁用',itemValue:'0'},{itemName:'启用',itemValue:'1'},]"
            :key="item.itemName"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          :style="{width:'180px'}"
          v-model="contractTag"
          class="mr10 mb10"
          filterable
          multiple
          clearable
          size="mini"
          placeholder="请选择标签"
        >
          <el-option
            v-for="item in contractTagList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          icon="el-icon-search"
          size="mini"
          plain
          @click="Topage(1)"
        >GO</el-button>
        <el-button
          icon="el-icon-plus"
          class="mr10"
          size="mini"
          type="primary"
          @click="addContract"
        >新增模板</el-button>

        <el-table
          :data="contractList"
          size="mini"
          highlight-current-row
          @row-dblclick="editContract"
        >
          <el-table-column align="center" prop="contractName" label="合同模板名称"></el-table-column>
          <el-table-column align="center" prop="contractTags" label="标签"></el-table-column>
          <el-table-column align="center" prop="contractStatusName" label="模板状态"></el-table-column>
          <el-table-column align="center" prop="programCount" label="关联项目">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.programCount !== 0" effect="dark" :content="scope.row.programNames" placement="top-start">
                <span>{{scope.row.programCount}}</span>
              </el-tooltip>
              <span v-else>{{scope.row.programCount}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="updateByName" label="更新人"></el-table-column>
          <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
        </el-table>
      </div>
      

    </el-drawer>
    <setCommonContract
      :setContractVisible="setContractVisible"
      :programType="programType"
      :contractTagList="contractTagList"
      :contractData="contractData"
      @close="setContractClose"
      @submit="setContractSubmit"
    />
  </div>
</template>

<script>

import api from '@/api/dictionary'
import setCommonContract from './set_common_contract.vue'
export default {
  components: { setCommonContract },
  props: {
    commonVisible: {
      type: Boolean,
      default: false
    },
    programType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      search: '',
      contractStatus: '',
      contractTag: '',
      contractTagList: [],
      contractList: [],

      setContractVisible: false,
      contractData: {}
    }
  },
  watch: {
    commonVisible (val) {
      if (val) {
        this.init()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      api.getCommonContractDropDown(this.programType).then((res) => {
        this.contractTagList = []
        console.log('获取项目公共合同模板标签下拉:', res)
        res.data.forEach(u => {
          this.contractTagList.push({ label: u.contractTag, value: u.contractTag })
        })
      })
      this.Topage()
    },
    Topage () {
      const params = {
        programType: this.programType,
        search: this.search,
        contractStatus: this.contractStatus,
        contractTag: this.contractTag
      }
      api.getCommonContractList(params).then((res) => {
        console.log('获取公共项目合同模板列表:', res)
        this.contractList = res.data
      })
    },
    // 添加合同
    addContract () {
      this.setContractVisible = true
    },
    editContract (row) {
      console.log(row)
      this.contractData = row
      this.setContractVisible = true
    },
    setContractSubmit () {
      this.setContractVisible = false
      this.Topage()
    },
    setContractClose () {
      this.setContractVisible = false
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.drawer_container{
  padding: 0 20px;
}
</style>
