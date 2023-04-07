<!--
 * @Author: 杨曦
 * @Date: 2022-11-14 15:51:18
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-04-06 14:27:38
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="pretalkCode"
            clearable
            placeholder="搜索标识码"
          ></el-input>
          <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            v-model="pretalkType"
            placeholder="筛选类型"
          >
            <el-option
              v-for="item in pretalkTypeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select style="width:150px" class="mr10" filterable v-model="tracks" multiple placeholder="筛选行业">
            <el-option
                v-for="item in trackList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue">
            </el-option>
          </el-select>
          <el-select class="mr10" style="width:150px"  filterable v-model="countries" multiple placeholder="筛选国家">
            <el-option
            v-for="item in countryList"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue">
            </el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            size="mini"
            plain
            @click="Topage()"
          >GO</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        class="table_white-space"
        highlight-current-row
        :max-height="tableHeight"
        style="width: 100%"
      >
        <el-table-column  align="center" label="操作" min-width="100">
            <template slot-scope="scope">
                <el-button slot="append" @click="bindMentee(scope.row.pretalkId)" type="primary">绑定学员</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="codes" align="center" label="标识码" min-width="100"></el-table-column>
        <el-table-column prop="pretalkTypeName" align="center" label="Pretalk类型" min-width="100"></el-table-column>
        <el-table-column prop="countryName"  show-overflow-tooltip align="center" label="可带国家" min-width="100"></el-table-column>
        <el-table-column prop="trackName" show-overflow-tooltip align="center" label="可带行业" min-width="100"></el-table-column>
        <el-table-column prop="menteeCount" align="center" label="分配学生" min-width="100"></el-table-column>
        <el-table-column prop="signCount" align="center" label="签约学生" min-width="100"></el-table-column>
        <el-table-column prop="feedbackCount" align="center" label="评价" min-width="100">
          <template slot-scope="scope">
            <div v-if="!scope.row.feedbackCount">0</div>
            <el-link v-else style="color:#ffa333" @click="toFeedBackDetail(scope.row.pretalkId)">{{ scope.row.feedbackCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="successRate" align="center" label="成功率" min-width="100"></el-table-column>
        <el-table-column prop="" align="center" label="备注" min-width="100">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.note">
                <span slot="reference" style="width:100px;overflow: hidden;white-space: nowrap;">{{scope.row.note}}</span>
              </el-popover>
            </template>
        </el-table-column>
      </el-table>
      <el-drawer
        :visible.sync="toFeedBackDetailVisible"
        :before-close="toFeedBackDetailClose">
        <el-table :data="tableDataFeed" size="mini" style="width: 100%">
          <el-table-column prop="feedbackRemark" align="center" label="评价内容" min-width="100"></el-table-column>
          <el-table-column prop="updateByName" align="center" label="更新人" min-width="100"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="更新时间" min-width="100"></el-table-column>
        </el-table>
      </el-drawer>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/sales_assistant'
import api2 from '@/api/bd'
import mixins from '@/plugin/mixins'

import { mapState } from 'vuex'
export default {
  name: 'SalesInvoice',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data: () => {
    return {
      loading: false,
      pretalkCode: null,
      total: 0,
      pageNum: 1,
      pageSize: 50,
      menteeId: '',
      toFeedBackDetailVisible: false,
      trackList: [],
      countries: [],
      tableData: [],
      tracks: [],
      pretalkTypeList: [],
      tableDataFeed: [],
      countryList: [],
      pretalkType: '',
      tableHeight: 'auto'
    }
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
        this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
      })
    }
  },
  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.trackList = await this.getDictionary('track')
      this.countryList = await this.getDictionary('country')
      this.pretalkTypeList = await this.getDictionary('pretalk_type')
    },
    Topage () {
      this.loading = true
      const params = {
        pretalkCode: this.pretalkCode,
        countries: this.countries.join(','),
        tracks: this.tracks.join(','),
        pretalkType: this.pretalkType
      }
      api.pretalkListMatch(params).then((res) => {
        this.loading = false
        var reg = /;/g
        res.data.forEach(item => {
          if (item.pretalkType == 'mentee') {
            if (item.note) {
              item.note = item.note.replace(reg, '\n')
            }
          }
        })
        this.tableData = res.data
        console.log(res.data)
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    toFeedBackDetail (pretalkId) {
      api.feedbackList(pretalkId).then(res => {
        this.toFeedBackDetailVisible = true
        this.tableDataFeed = res.data
      })
    },
    toFeedBackDetailClose () {
      this.toFeedBackDetailVisible = false
    },
    bindMentee (pretalkId) {
      this.$prompt('请输入绑定的学员ID（一般为mentee-xxxxxxxx格式）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '必填'
      }).then(({ value }) => {
        const data = {
          menteeId: value,
          pretalkId: pretalkId
        }
        console.log(data)
        api2.addMenteePretalk(data).then((res) => {
          if (res.code == '200') {
            this.$message.success('添加成功')
            this.newPretalk()
          } else {
            this.$message.error(res.message)
            // this.bindMentee(pretalkId)
          }
        })
      })
    }
  }
}
</script>
<style>
  .table_white-space .el-popover,.el-popover{
    white-space: pre-wrap !important;
  }
</style>
<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%
}
</style>
