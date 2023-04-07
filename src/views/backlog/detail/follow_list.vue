<!--
 * @Author: 库建华
 * @Date: 2020-07-31 16:02:22
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-20 17:05:21
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="position.backlogTypeName + '列表'"
      :visible.sync="followSetRateDetailVisible"
      width="1050px"
      :before-close="close"
    >
        <el-table
          v-if="position.backlogType == 'bd_cooperator_follow'"
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toDetail(scope.row)">follow</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="cooperatorName"
            label="合作商名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="beginDate"
            label="follow up开始日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="endDate"
            label="follow up截止日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="position.backlogType == 'vip_follow'"
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
        <el-table-column align="center" width="80" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toDetail(scope.row)">follow</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="menteeName"
            label="学员名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="times"
            label="第几次"
            width="80"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="programName"
            label="项目名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="orderId"
            label="订单号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="beginDate"
            label="follow up开始日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="endDate"
            label="follow up截止日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-else-if="position.backlogType == 'bd_ambassador_follow'"
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toDetail(scope.row)">follow</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="ambassadorName"
            label="校园大使名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="beginDate"
            label="follow up开始日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="endDate"
            label="follow up截止日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="position.backlogType == 'sales_assistant_follow'"
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toDetail(scope.row)">follow</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="menteeName"
            label="学员名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="wxId"
            label="学员微信"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="wxName"
            label="学员微信名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="sourceWxName"
            label="导流微信号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="firstAskDate"
            label="首次咨询日期"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="beginDate"
            label="follow up开始日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="endDate"
            label="follow up截止日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="position.backlogType == 'sales_follow'"
          :data="tableData"
          size="mini"
          ref="table"
          highlight-current-row
        >
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toDetail(scope.row)">follow</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="menteeName"
            label="学员名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="wxId"
            label="学员微信"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="wxName"
            label="学员微信名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="counselorWxName"
            label="顾问名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="firstAskDate"
            label="首次咨询日期"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="beginDate"
            label="follow up开始日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="endDate"
            label="follow up截止日期"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
    </el-dialog>

    <followListSumbit
        :followVisible="followVisible"
        :positionNew="positionNew"
        :detailData="detailData"
        @close="followClose"
        @submit="followSubmit"
    />
    <followListSumbitBD
        :setFollowUpVisible="setFollowUpVisible"
        :detailData="detailData"
        @close="followBdClose"
        @submit="followBdSubmit"
    />
    <setFollowUpAmbassador
      :setFollowUpAmbassadorVisible="setFollowUpAmbassadorVisible"
      :detailData="detailData"
      @close="followAmbassadorClose"
      @submit="followAmbassadorSubmit"
    />
    <followListVipSumbit
      :followVisibleVip="followVisibleVip"
      :signId="signId"
      :menteeInfo="menteeInfo"
      @close="followVipClose"
      @submit="followVipSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/backlog.js'
import followListSumbit from './follow_list_submit.vue'
import followListSumbitBD from './bd_coopeRator.vue'
import setFollowUpAmbassador from './follow_bd_ambassador.vue'
import followListVipSumbit from './follow_vip.vue'

export default {
  name: 'common-detail',
  components: {
    followListSumbit, followListSumbitBD, setFollowUpAmbassador, followListVipSumbit
  },
  props: {
    followSetRateDetailVisible: Boolean,
    position: Object,
    day: String,
    userId: String
  },
  data: () => {
    return {
      tableData: [],
      detailData: {},
      positionNew: '',
      signId: '',
      data: {},
      name: '',
      menteeInfo: {},
      followVisible: false,
      followVisibleVip: false,
      setFollowUpVisible: false,
      setFollowUpAmbassadorVisible: false
    }
  },
  watch: {
    followSetRateDetailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      const params = {
        backlogType: this.position.backlogType,
        userId: this.userId,
        backlogDate: this.day
      }
      api.getBackLogList(params).then(res => {
        console.log(res, 'yx451345')
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
      this.tableData = []
      this.data = {}
    },
    toDetail (val) {
      console.log(val)
      this.detailData = val
      if (this.position.backlogType == 'sales_assistant_follow') {
        this.positionNew = 'sales_assistant'
        this.followVisible = true
      }
      if (this.position.backlogType == 'sales_follow') {
        this.positionNew = 'sales'
        this.followVisible = true
      }
      if (this.position.backlogType == 'bd_cooperator_follow') {
        this.setFollowUpVisible = true
      }
      if (this.position.backlogType == 'bd_ambassador_follow') {
        this.setFollowUpAmbassadorVisible = true
      }
      if (this.position.backlogType == 'vip_follow') {
        this.signId = val.signId
        this.menteeInfo = {
          menteeId: val.menteeId,
          realName: val.menteeName
        }
        this.followVisibleVip = true
      }
    },
    followVipClose () {
      this.followVisibleVip = false
    },
    followAmbassadorClose () {
      this.setFollowUpAmbassadorVisible = false
    },
    followBdClose () {
      this.setFollowUpVisible = false
    },
    followClose () {
      this.followVisible = false
    },
    followAmbassadorSubmit () {
      this.$emit('submit')
      this.initPage()
    },
    followVipSubmit () {
      this.$emit('submit')
      this.initPage()
    },
    followBdSubmit () {
      this.$emit('submit')
      this.initPage()
    },
    followSubmit () {
      this.$emit('submit')
      this.initPage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
