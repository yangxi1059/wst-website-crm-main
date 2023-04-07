<!--
 * @Author: 库建华
 * @Date: 2019-11-05 15:55:59
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-11 13:57:16
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="mentor-price-rule">
        <div class="search_page">
        <div class="search">
            <el-button
            v-if="roleInfo.includes(`mentor_price_rule_add`)"
            icon="el-icon-add"
            class="mr10"
            size="mini"
            type="primary"
            plain
            @click="addRule()"
            >新增</el-button>
        </div>
        </div>
        <el-table :data="tableData" size="mini" highlight-current-row :max-height="height" stripe>
        <el-table-column align="center" label="操作" v-if="roleInfo.includes(`mentor_price_rule_edit`)">
            <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                @click="toDetail(scope.row)"
                class="el-icon-tickets"
            >编辑规则</el-button>
            <el-button
                type="text"
                size="mini"
                @click="deleteRule(scope.row,scope.$index)"
                class="el-icon-tickets"
            >删 除</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="ruleName" label="标题">
        </el-table-column>
        <el-table-column align="center" prop="ruleContent" label="概况" show-overflow-tooltip>
        </el-table-column>
        </el-table>
        <edit :ruleId="ruleId" :editVisible="editVisible" @close="editClose" @submit="editSubmit" />
    </div>
  </d2-container>
</template>

<script>
import edit from './components/price.vue'
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  name: 'mentor_price_rule',
  components: { edit },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
  },
  mixins: [mixins],
  data: () => {
    return {
      height: document.documentElement.clientHeight - 190,
      editVisible: false,
      ruleId: '',
      tableData: [],
      loading: false
    }
  },
  mounted () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.loading = true
      api.getPriceRuleList().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editClose()
      this.initTable()
    },
    addRule () {
      this.ruleId = null
      this.editVisible = true
    },
    deleteRule (v, i) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {}
          if (!v.ruleId) {
            this.tableData.splice(i, 1)
          } else {
            data = {
              uptList: [
                {
                  ruleId: v.ruleId,
                  ruleName: v.ruleName,
                  delFlag: '1'
                }
              ]
            }
          }
          api
            .setPriceRuleList(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.initTable()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toDetail (v) {
      this.ruleId = v.ruleId
      this.editVisible = true
    },
    save (v) {
      let data = {}
      if (!v.ruleId) {
        data = {
          addList: [
            {
              ruleName: v.ruleName
            }
          ]
        }
      } else {
        data = {
          uptList: [
            {
              ruleId: v.ruleId,
              ruleName: v.ruleName
            }
          ]
        }
      }
      api
        .setPriceRuleList(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.initTable()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
