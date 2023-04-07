<!--
 * @Author: 杨曦
 * @Date: 2020-09-28 14:22:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-14 15:41:39
 * @Version:
 * @Description:
-->
<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="被删除或者spy列表" size="mini" :visible.sync="spyOrDeleteListVisible" width="1400px" :before-close="close">
            <div class="search_page">
                <div class="search">
                    <el-select
                        class="mr10"
                        size="mini"
                        filterable
                        v-model="checkStatus"
                        placeholder="请选择"
                        @change="initPage(1)"
                        >
                        <el-option
                            v-for="item in [{itemName:'未核验',itemValue:'0'},{itemName:'已核验',itemValue:'1'}]"
                            :key="item.itemValue"
                            :label="item.itemName"
                            :value="item.itemValue"
                        ></el-option>
                    </el-select>
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
                stripe
                :data="consultingData"
                style="width: 100%">
                <el-table-column
                    width="80"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.checkStatus == '0'"  size="mini" :underline="false" type="primary" @click="changeEffectiveStatus(scope.row)">核验</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="核验状态" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.checkStatus == '0'">未核验</span>
                        <span v-else>已核验</span>
                    </template>
                </el-table-column>
                <el-table-column label="学员名" prop="menteeName"></el-table-column>
                <el-table-column label="是否核验通过" prop="passStatusName" width="110">
                    <template slot-scope="scope">
                        <template v-if="scope.row.refuseReason">
                            <el-tooltip placement="top">
                                <div slot="content">
                                    拒绝理由：{{scope.row.refuseReason}}
                                </div>
                                <el-button  type="text" class="el-icon-info">{{scope.row.passStatusName}}</el-button>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <span>{{scope.row.passStatusName}}</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="学员名" prop="menteeName"></el-table-column>
                <el-table-column  label="学员ID" prop="menteeId"></el-table-column>
                <el-table-column  label="学员微信" prop="wxId"></el-table-column>
                <el-table-column label="是否是SPY" prop="spyStatusName" ></el-table-column>
                <el-table-column  label="是否被删除" prop="delStatusName"></el-table-column>
                <el-table-column  label="助理名称" prop="assistantName"></el-table-column>
                <el-table-column  label="发起人" prop="createByName"></el-table-column>
                <el-table-column  label="发起时间" prop="createTime"></el-table-column>
            </el-table>
            <span slot="footer">
                <el-button @click="close">关 闭</el-button>
            </span>

        </el-dialog>
        <changeEffect :checkVisible="checkVisible" :type="type" :pkId="pkId" @close="checkClose" @submit="checkSubmit" />
    </div>
</template>

<script>
import api from '@/api/sales_assistant'
import changeEffect from './changeEffect.vue'

export default {
  name: 'detailSaleKpi',
  props: {
    spyOrDeleteListVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    changeEffect
  },
  watch: {
    spyOrDeleteListVisible: function (val) {
      if (val) {
        this.checkStatus = '0'
        this.initPage()
      }
    },
    salesData: function () {

    }
  },
  data () {
    return {
      consultingData: [],
      pageNum: 1,
      pageSize: 100,
      checkStatus: '0',
      total: 0,
      pkId: '',
      checkVisible: false,
      type: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    initPage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        checkStatus: this.checkStatus
      }
      api.getSpyOrDeleteList(data).then(res => {
        console.log(res)
        this.total = res.data.total
        this.consultingData = res.data.rows
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initPage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initPage()
    },
    changeEffectiveStatus (data) {
      console.log(data)
      this.pkId = data.pkId
      this.checkVisible = true
    },
    checkClose () {
      this.checkVisible = false
      this.pkId = ''
    },
    checkSubmit () {
      this.checkVisible = false
      this.pkId = ''
      this.initPage()
    }
  }
}
</script>
<style  scoped>
    .weightFont{
        font-weight: 700;
    }
</style>
