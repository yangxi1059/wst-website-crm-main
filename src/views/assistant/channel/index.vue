<!--
 * @Author: 库建华
 * @Date: 2020-06-01 14:28:24
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-21 17:55:56
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container>
    <div>
      <div class="search_page">
        <div class="search">
          <el-select class="mr10" style="width:160px" size="mini" v-model="channelStatus" clearable placeholder="是否启用" @change="Topage()">
            <el-option
                v-for="item in common_yes_or_no"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
              icon="el-icon-plus"
              v-if="roleInfo.includes(`channel_add`)"
              class="mr10"
              size="mini"
              plain
              @click="edit()"
              >新增</el-button>
      </div>
      </div>
      <el-table :data="tableList" @expand-change="changeTable" size="mini"  stripe>
        <el-table-column  type="expand">
          <template slot-scope="scope">
            <div style="margin-left:20px">
              <el-button size="mini" type="primary"  @click="edit(scope.row.channelId)" title="编辑" v-if="roleInfo.includes(`channel_edit`)">编辑渠道</el-button>
              <el-button size="mini" type="danger"  @click="deleteChannel(scope.row.channelId)" title="删除" v-if="roleInfo.includes(`channel_delete`)">删除渠道</el-button>
              <el-button size="mini" type="primary"  @click="menteeList(scope.row)" v-if="roleInfo.includes(`channel_mentee_list`)" >学生列表</el-button>
            </div>
            <el-card style="margin:10px 20px 20px 20px">
                <div class="search_page" >
                  <div class="search">
                    <el-select
                      style="160px"
                      class="mr10"
                      size="mini"
                      v-model="scope.row.sourceStatus"
                      clearable
                      placeholder="来源是否启用"
                      @change="getDetailChannel(scope.row.channelId)"
                    >
                      <el-option
                        v-for="item in common_yes_or_no"
                        :key="item.itemValue"
                        :label="item.itemName"
                        :value="item.itemValue"
                      ></el-option>
                    </el-select>
                    <el-button icon="el-icon-plus" class="mr10" size="mini" plain @click="editSourceId(scope.row.channelId)">新增</el-button>
                  </div>
                </div>
                <el-table :data="scope.row.tableList" size="mini"  stripe>
                  <el-table-column label="操作" prop="sourceId">
                    <template slot-scope="prop">
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="editSourceId(prop.row.channelId, prop.row.sourceId)"
                        title="编辑"
                      ></el-button>
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteSubChannel(prop.row.channelId,prop.row.sourceId)"
                        title="删除"
                      ></el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="具体来源" prop="sourceName"></el-table-column>
                  <el-table-column label="是否启用" prop="sourceStatusName"></el-table-column>
                  <el-table-column label="返佣" prop="brokerageStatusName"></el-table-column>
                  <el-table-column label="规则数" prop="ruleNum">
                    <template slot-scope="prop">
                        <el-button type="text" v-if="prop.row.brokerageStatus == 'freedom_brokerage'" @click="checkAllRule(prop.row.channelId, prop.row.sourceId)">{{prop.row.ruleNum}}</el-button>
                        <span v-else>{{prop.row.ruleNum}}</span>

                    </template>
                  </el-table-column>
                  <el-table-column label="固定返佣金额$" prop="fixedBrokerage"></el-table-column>
                  <el-table-column label="来源备注" prop="sourceNote" show-overflow-tooltip></el-table-column>
                  <el-table-column label="更新人" prop="updateByName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
                  <el-table-column label="创建人" prop="createByName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                </el-table>
            </el-card>
          </template>
        </el-table-column >
        <el-table-column label="渠道名" prop="channelName"></el-table-column>
        <el-table-column label="是否启用" prop="channelStatusName"></el-table-column>
        <el-table-column label="备注" prop="channelRemark" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新人" prop="updateByName" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createByName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <edit
    :editVisible='editVisible'
    :channelId='channelId'
    @close='editClose'
    @submit="editSubmit"
    />
    <ruleList :ruleVisible="ruleVisible" :channelId="channelId" :sourceId="sourceId" @close="ruleClose" @submit="ruleSubmit"/>
    <editSource
      :editSubVisible="editSubVisible"
      :channelId="channelId"
      :sourceId="sourceId"
      @close="editSourceClose"
      @submit="editSourceSubmit"
    />
    <subChannel
    :subChannelVisible='subChannelVisible'
    :channelId='channelId'
    @close='subChannelClose'
    />
    <menteeList :menteeListVisible="menteeListVisible" :channelId="channelId" :sourceList="sourceList" @close="menteeListClose" />
  </d2-container>
</template>

<script>
import edit from './components/edit_channel'
import subChannel from './components/sub_channel'
import api from '@/api/sales_assistant.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import ruleList from './components/channel_rule.vue'
import editSource from './components/edit_sub_channel'
import menteeList from './components/mentee_list.vue'
export default {
  name: 'channel',
  mixins: [mixins],
  components: { edit, subChannel, ruleList, editSource, menteeList },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      tableList: [],
      channelStatus: null,
      channelId: null,
      editVisible: false,
      subChannelVisible: false,
      common_yes_or_no: [],
      editSubVisible: false,
      sourceId: '',
      sourceStatus: '',
      ruleVisible: false,
      menteeListVisible: false,
      sourceList: []
    }
  },
  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    Topage () {
      const params = {
        channelStatus: this.channelStatus
      }
      api.getChannelList(params).then(res => {
        console.log('channelList', res.data)
        res.data.forEach(item => {
          item.tableList = []
          item.sourceStatus = ''
        })
        this.tableList = res.data
      })
    },
    changeTable (row, type) {
      type.forEach((item) => {
        if (item.channelId == row.channelId) {
          this.getDetailChannel(item.channelId)
        }
      })
    },
    getDetailChannel (Id) {
      let indexAux = 0
      this.tableList.forEach((item, index) => {
        if (item.channelId == Id) {
          indexAux = index
        }
      })
      this.tableList[indexAux].tableList = []
      const params = {
        channelId: Id,
        sourceStatus: this.tableList[indexAux].sourceStatus
      }
      api.getSubChannelList(params).then(res => {
        this.tableList[indexAux].tableList = res.data
        console.log(this.tableList)
        this.$forceUpdate()
      })
    },
    edit (channelId) {
      this.channelId = channelId
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage()
    },
    deleteChannel (channelId) {
      this.$confirm('此操作将彻底删除该渠道，是否继续？', '提示').then(v => {
        console.log(v)
        api.delChannelById(channelId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.Topage()
        })
      })
    },
    subChannel (channelId) {
      this.channelId = channelId
      this.subChannelVisible = true
    },
    subChannelClose () {
      this.subChannelVisible = false
    },
    editSourceId (channelId, sourceId) {
      this.sourceId = sourceId
      this.channelId = channelId
      this.editSubVisible = true
    },
    editSourceClose () {
      this.editSubVisible = false
    },
    editSourceSubmit (channelId) {
      this.editSourceClose()
      console.log(21321312321, channelId)
      this.getDetailChannel(channelId)
    },
    deleteSubChannel (channelId, sourceId) {
      this.$confirm('此操作将彻底删除该来源，是否继续？', '提示').then(v => {
        api.delSubChannelById(sourceId).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getDetailChannel(channelId)
        })
      })
    },
    checkAllRule (channelId, sourceId) {
      this.sourceId = sourceId
      this.channelId = channelId
      this.ruleVisible = true
    },
    ruleClose () {
      this.ruleVisible = false
    },
    ruleSubmit (channelId) {
      this.getDetailChannel(channelId)
    },
    menteeList (data) {
      console.log(data)
      this.channelId = data.channelId
      this.sourceList = data.tableList
      this.menteeListVisible = true
    },
    menteeListClose () {
      this.menteeListVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
