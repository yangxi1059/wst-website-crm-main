<!--
 * @Author: 库建华
 * @Date: 2020-06-01 16:06:18
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-05 11:17:38
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer
      title="固定返佣规则列表"
      class="info"
      :visible.sync="ruleVisible"
      size="800px"
      :before-close="handleClose"
    >
      <div style="display:flex;margin-left:20px" v-if="roleInfo.includes(`channel_rule_add`)">
          <div style="margin-right:20px">
              <el-button type="primary" size="mini" @click="addRule()">新增规则</el-button>
          </div>
          <div>
              示例规则一：[3500,4999.9999]返佣350<br>
              示例规则二：[5000,9999.9999]返佣500<br>
              示例规则三：[10000,99999999.9999]返佣1000
          </div>
      </div>
      <el-table style="margin-left:20px" :data="tableList" size="mini"  stripe>
        <el-table-column label="操作" prop="sourceId">
          <template slot-scope="scope">
            <el-button
                v-if="roleInfo.includes(`channel_rule_edit`)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="edit(scope.row)"
              title="编辑"
            ></el-button>
            <el-button
                v-if="roleInfo.includes(`channel_rule_delete`)"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteSubChannel(scope.row.pkId)"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单金额大于等于（美金）" prop="ge" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单金额小于等于（美金）" prop="le" show-overflow-tooltip></el-table-column>
        <el-table-column label="固定返佣（美金）" prop="fixedBrokerage" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-drawer>
    <add :sourceId="sourceId" :addRuleVisible="addRuleVisible" @close="addClose" @submit="addSubmit" />
    <edit :sourceId="sourceId" :pkId="pkId" :dataDetail="dataDetail" :editSubVisible="editSubVisible" @close="editClose" @submit="editSubmit" />
  </div>
</template>

<script>
import api from '@/api/sales_assistant.js'
import add from './channel_rule_add.vue'
import mixins from '@/plugin/mixins'
import edit from './channel_rule_edit.vue'
import { mapState } from 'vuex'

export default {
  name: 'channel',
  mixins: [mixins],
  components: { add, edit },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    ruleVisible: {
      type: Boolean,
      default: false
    },
    channelId: {},
    sourceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableList: [],
      editSubVisible: false,
      addRuleVisible: false,
      pkId: '',
      dataDetail: {}
    }
  },

  mounted () {
    // this.init();
    // this.Topage();
  },
  watch: {
    ruleVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getRuleChannelList(this.sourceId).then(res => {
        console.log('channelList', res.data)
        this.tableList = res.data
      })
    },
    edit (data) {
      this.dataDetail = data
      this.pkId = data.pkId
      this.editSubVisible = true
    },
    editClose () {
      this.editSubVisible = false
    },
    editSubmit () {
      this.$emit('submit', this.channelId)
      this.editClose()
      this.Topage()
    },
    addRule () {
      this.addRuleVisible = true
    },
    deleteSubChannel (pkId) {
      this.$confirm('此操作将彻底删除此条规则，是否继续？', '提示').then(v => {
        console.log(v)
        api.delRuleById(pkId).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('submit', this.channelId)
          this.Topage()
        })
      })
    },
    addClose () {
      this.addRuleVisible = false
    },
    addSubmit () {
      this.addRuleVisible = false
      this.$emit('submit', this.channelId)
      this.Topage()
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
