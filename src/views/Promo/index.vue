<!--
 * @Author: 杨曦
 * @Date: 2021-02-24 18:29:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 16:04:01
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="role">
      <div class="search_page">
        <div class="search">
          <el-select
            :style="{width:'150px'}"
            v-model="userId"
            class="mr10"
            size="mini"
            filterable
            clearable
            placeholder="请选择用户"
          >
            <el-option-group
              v-for="group in user"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>

          <el-select
            :style="{width:'150px'}"
            v-model="businessType"
            class="mr10"
            size="mini"
            filterable
            clearable
            placeholder="请选择业务类型"
          >
            <el-option
              v-for="item in businessTypeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-cascader :props="props"
            :style="{width:'150px'}"
            v-model="programType"
            class="mr10"
            size="mini"
            filterable
            clearable
            placeholder="请选择项目"
          >
          </el-cascader>
          <el-button
            icon="el-icon-search"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="mr10"
            v-if="roleInfo.includes(`role_new`)"
            size="mini"
            plain
            @click="addPromo"
          >新增</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`role_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="rows"
        size="mini"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="codeId" align="center" label="推广码"></el-table-column>
        <el-table-column prop="businessTypeName" align="center" label="业务类型名称" ></el-table-column>
        <el-table-column align="center" label="项目名(别名)" >
          <template slot-scope="scope">
            {{scope.row.programName}}<br>({{scope.row.programAlias}})
          </template>
        </el-table-column>
        <el-table-column prop="sourceType" align="center" label="小程序码图片" >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.sourceType"
              fit="cover"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="codeSource" align="center" label="PC推广页地址" ></el-table-column>
        <el-table-column prop="userName" align="center" label="绑定用户" ></el-table-column>
        <el-table-column prop="updateByName" align="center" label="更新人" ></el-table-column>
        <el-table-column prop="updateTime" align="center" label="更新时间" ></el-table-column>
        <el-table-column prop="createByName" align="center" label="创建人" ></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" ></el-table-column>
      </el-table>
      <add :addVisial="addVisial" @close="addClose" @submit="addSubmit" />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/promo'
import apiDic from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import add from './components/add.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { add },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      search: '',
      pageNum: 1,
      loading: false,
      pageSize: 100,
      total: 0,
      rows: [],
      user: [],
      businessTypeList: [],
      businessType: '',
      programType: '',
      sortCol: '',
      sort: '',
      userId: '',
      addVisial: false,
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          setTimeout(() => {
            const { level } = node
            console.log(node)
            if (level == 0) {
              api.getDicListByDicId('program_type').then(res => {
                console.log(res.data)
                let programTypeList = []
                programTypeList = res.data.map((value, i) => ({
                  key: value.itemValue,
                  value: value.itemValue,
                  label: value.itemName,
                  leaf: node.level >= 1
                }))
                resolve(programTypeList)
              })
            }
            if (level == 1) {
              const data = {
                pageSize: 9999,
                pageNum: 1,
                programType: node.value,
                programStatus: '1',
                onlineSale: '1'
              }
              api.promoList(data).then(res => {
                console.log(res.data)
                let programTypeList2 = []
                programTypeList2 = res.data.rows.map((value, i) => ({
                  key: value.programId,
                  value: value.programId,
                  label: value.programName + '--别名【' + (value.programAlias || '无') + '】' + '【' + '￥' + value.priceCny + '】',
                  leaf: node.level >= 1
                }))
                resolve(programTypeList2)
              })
            }
          })
        }
      }
    }
  },
  created () {
    this.initPage()
    this.Topage(1)
  },
  methods: {
    initPage () {
      apiDic.getUserList2().then(({ data }) => {
        console.log(data)
        this.user = data.map((value, i) => ({
          label: value.deptName,
          options: value.userArr.map((item, j) => ({
            value: item.userId,
            label: item.userName
          }))
        }))
      })
      api.getDicListByDicId('business_type').then(res => {
        console.log(res.data)
        this.businessTypeList = res.data
      })
    },
    Topage () {
      this.loading = true
      console.log(this.programType)
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        businessType: this.businessType,
        userId: this.userId,
        keyId: this.programType[1],
        sortCol: this.sortCol,
        sort: this.sort
      }
      api.getPromoList(data).then(res => {
        this.loading = false
        console.log(res)
        this.rows = res.data.rows
        this.total = res.data.total
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    addPromo () {
      this.addVisial = true
    },
    addSubmit () {
      this.addVisial = false
      this.Topage()
    },
    addClose () {
      this.addVisial = false
    }
  }
}
</script>

<style lang='scss'>
.role {
  .el-table--mini td {
    padding: 0;
  }
}
</style>
