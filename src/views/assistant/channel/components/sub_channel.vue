<!--
 * @Author: 库建华
 * @Date: 2020-06-01 16:06:18
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 14:27:40
 * @Version: 1
 * @Description:
-->
<template>
  <div v-if="subChannelVisible">
      <div class="search_page" >
        <div class="search">
          <el-select
            style="160px"
            class="mr10"
            size="mini"
            v-model="sourceStatus"
            clearable
            placeholder="是否启用"
            @change="Topage()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-plus" class="mr10" size="mini" plain @click="edit()">新增</el-button>
        </div>
      </div>
      <el-table :data="tableList" size="mini"  stripe>
        <el-table-column label="操作" prop="sourceId">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="edit(scope.row.sourceId)"
              title="编辑"
            ></el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteSubChannel(scope.row.sourceId)"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="具体来源" prop="sourceName"></el-table-column>
        <el-table-column label="是否启用" prop="sourceStatusName"></el-table-column>
        <el-table-column label="返佣" prop="brokerageStatusName"></el-table-column>
        <el-table-column label="规则数" prop="ruleNum">
          <template slot-scope="scope">
               <el-button type="text" v-if="scope.row.brokerageStatus == 'freedom_brokerage'" @click="checkAllRule(scope.row.sourceId,scope.row.sourceId)">{{scope.row.ruleNum}}</el-button>
               <span v-else>{{scope.row.ruleNum}}</span>

          </template>
        </el-table-column>
        <el-table-column label="固定返佣金额$" prop="fixedBrokerage"></el-table-column>
        <el-table-column label="来源备注" prop="sourceNote" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新人" prop="updateByName" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createByName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
      </el-table>
    <edit
      :editSubVisible="editSubVisible"
      :channelId="channelId"
      :sourceId="sourceId"
      @close="editClose"
      @submit="editSubmit"
    />
    <ruleList :channelId="channelId" :ruleVisible="ruleVisible" :sourceId="sourceId" @close="ruleClose" @submit="ruleSubmit"/>
  </div>
</template>

<script>
import edit from './edit_sub_channel'
import api from '@/api/sales_assistant.js'
import ruleList from './channel_rule.vue'
import mixins from '@/plugin/mixins'

export default {
  name: 'channel',
  mixins: [mixins],
  components: { edit, ruleList },
  props: {
    subChannelVisible: {
      type: Boolean,
      default: false
    },
    channelId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableList: [],
      editSubVisible: false,
      sourceId: '',
      sourceStatus: '',
      ruleVisible: false,
      common_yes_or_no:[]
    }
  },

  mounted () {},
  watch: {
    subChannelVisible: function (val) {
      if (val) {
        this.Topage()
        this.pageInit()
      }
    }
  },
  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    Topage () {
      const params = {
        channelId: this.channelId,
        sourceStatus: this.sourceStatus
      }
      api.getSubChannelList(params).then(res => {
        console.log('channelList', res.data)
        this.tableList = res.data
      })
    },

    edit (sourceId) {
      this.sourceId = sourceId
      this.editSubVisible = true
    },
    editClose () {
      this.editSubVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage()
    },

    deleteSubChannel (sourceId) {
      this.$confirm('此操作将彻底删除该来源，是否继续？', '提示').then(v => {
        console.log(v)
        api.delSubChannelById(sourceId).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.Topage()
        })
      })
    },
    handleClose () {
      this.$emit('close')
    },
    checkAllRule (sourceId) {
      console.log(sourceId)
      this.sourceId = sourceId
      this.ruleVisible = true
    },
    ruleClose () {
      this.ruleVisible = false
    },
    ruleSubmit () {
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
