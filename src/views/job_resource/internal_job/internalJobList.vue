<!--
 * @Author: 杨曦
 * @Date: 2022-08-29 09:53:27
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-30 10:46:02
 * @Version:
 * @Description:
-->
<template>
  <div class="hr-user-edit">
    <el-drawer
      title="岗位提供人列表"
      :visible.sync="internalJobListVisible"
      size="80%"
      :before-close="close"
    >
        <div style="padding:0 20px;box-sizing:border-box" v-loading = loading>
            <div class="search_page" ref="search">
                <div class="search">
                    <el-input
                        class="mr10 mb10"
                        size="mini"
                        style="width:150px"
                        v-model="search"
                        clearable
                        placeholder="搜索"
                        @keyup.enter.native="initTable()"
                    ></el-input>
                    <el-select
                        class="mr10 mb10"
                        style="width:100px"
                        size="mini"
                        filterable
                        v-model="companyId"
                        clearable
                        placeholder="公司"
                    >
                        <el-option
                        v-for="item in companyList"
                        :key="item.companyId"
                        :label="item.companyName"
                        :value="item.companyId"
                        ></el-option>
                    </el-select>
                    <el-select
                        class="mr10 mb10"
                        style="width:100px"
                        size="mini"
                        v-model="providerType"
                        clearable
                        placeholder="提供人类型"
                    >
                        <el-option
                        v-for="item in providerTypeList"
                        :key="item.itemValue"
                        :label="item.itemName"
                        :value="item.itemValue"
                        ></el-option>
                    </el-select>
                   <el-select
                        class="mr10 mb10"
                        style="width:100px"
                        size="mini"
                        v-model="providerStatus"
                        clearable
                        placeholder="状态"
                    >
                        <el-option
                        v-for="item in providerStatusList"
                        :key="item.itemValue"
                        :label="item.itemName"
                        :value="item.itemValue"
                        ></el-option>
                    </el-select>
                    <el-button
                        class=" mb10"
                        size="mini"
                        style="margin-left:0px"
                        plain
                        @click="initable()"
                    >GO</el-button>
                    <el-button
                      icon="el-icon-plus"
                      class=" mb10"
                      size="mini"
                      plain
                      @click="add()"
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
            <el-table @row-dblclick="detail"  :data="tableList" size="mini"  style="width: 100%">
                <el-table-column  align="center"  label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" class="mr10" @click="detail(scope.row)">详情</el-button>
                    <el-button type="text" v-if="scope.row.providerType == 'other'" @click="account(scope.row)">接入账户</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="providerName" align="center" label="供应人姓名"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="providerTypeName" align="center" label="供应人类型"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="wxId" align="center" label="微信"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="email" align="center" label="邮箱"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="companyName" align="center" label="公司"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="interviewFeeType" align="center" label="面试费用货币"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="interviewFee" align="center" label="面试费用金额"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="offerFeeType" align="center" label="offer费用货币"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="offerFee" align="center" label="offer费用金额"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="providerStatusName" align="center" label="供应人状态"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="createByName" align="center" label="创建人"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" align="center" label="创建时间"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateByName" align="center" label="更新人"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" align="center" label="更新时间"  show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
      <internalJobDetail :detailVisible="detailVisible" :providerId="providerId" @close="detailClose" @delete="detailDelate" @submit="detailSubmit" />
      <internalJobAdd :addVisible="addVisible" @close="addClose" @submit="addSubmit" />
      <el-dialog :title="'内推提供人账户'" append-to-body :close-on-click-modal="false" :visible.sync="payAccountVisible" width="1280px" :before-close="closeComponents">
        <accountComponents ref="child" :payAccountVisible="payAccountVisible" :cooperatorId="cooperatorId" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeComponents">取 消</el-button>
        </span>
      </el-dialog>
    </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import internalJobDetail from './internalJobDetail.vue'
import internalJobAdd from './internalJobAdd.vue'
import accountComponents from '@/components/account_components.vue'
export default {
  name: 'internalJobList',
  mixins: [mixins],
  components: { internalJobDetail, internalJobAdd, accountComponents },
  props: {
    internalJobListVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      detailVisible: false,
      addVisible: false,
      providerId: '',
      loading: false,
      total: 0,
      pageSize: 100,
      pageNum: 1,
      search: '',
      companyId: '',
      providerType: '',
      cooperatorId: '',
      providerStatus: '',
      payAccountVisible: false,
      tableList: [],
      providerTypeList: [
        { itemName: '导师', itemValue: 'mentor' },
        { itemName: '其他', itemValue: 'other' }
      ],
      providerStatusList: [
        { itemName: '禁用', itemValue: '1' },
        { itemName: '启用', itemValue: '0' }
      ],
      companyList: []
    }
  },
  computed: {},
  watch: {
    internalJobListVisible: function (val) {
      if (val) {
        this.initable()
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.companyList = await this.getCompany()
    },
    initable () {
      this.loading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        companyId: this.companyId,
        providerType: this.providerType,
        providerStatus: this.providerStatus
      }
      console.log(data)
      api.getInternalJobList(data).then(res => {
        console.log(res.data)
        this.total = res.data.total
        this.tableList = res.data.rows
        this.loading = false
      })
    },
    close () {
      this.$emit('close')
    },
    detail (row) {
      console.log(row)
      this.providerId = row.providerId
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
    },
    detailDelate () {
      this.detailVisible = false
      this.initable()
    },
    detailSubmit () {
      this.initable()
    },
    add () {
      this.addVisible = true
    },
    addClose () {
      this.addVisible = false
    },
    addSubmit () {
      this.initable()
      this.addVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initable()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initable()
    },
    closeComponents () {
      this.$refs.child.beforePayWayClose()
      this.payAccountVisible = false
    },
    account (data) {
      this.cooperatorId = data.providerId
      this.payAccountVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.child)
        this.$refs.child.init()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
