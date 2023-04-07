<!--
 * @Author: 库建华
 * @Date: 2020-06-18 13:54:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-11 11:11:02
 * @Version: 1
 * @Description:
-->

<template>
  <d2-container v-loading="loading">
    <div>
        <div class="search_page">
        <div class="search">
            <mySelect
            :role="role"
            @change="changeSelect"
            />
            <el-button
            icon="el-icon-search"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
            <el-button
            v-if="followUpIdNum === 0"
            class="mr10"
            size="mini"
            plain
            @click="followUp()"
            >今天需跟进({{followUpIdNum}})</el-button>
            <el-button v-else class="mr10" size="mini" plain @click="followUp()">
            今天需跟进
            <span class="redBlod">({{followUpIdNum}})</span>
            </el-button>
        </div>
        </div>
        <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        style="width: 100%"

        >
        <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
            <el-button type="text" size="mini" @click="follow(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="orderId" align="center" label="订单ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menteeName" align="center" label="学员姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="programName" align="center" label="项目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="times" align="center" label="第几次" show-overflow-tooltip></el-table-column>
        <el-table-column
            prop="followByName"
            align="center"
            label="跟进人姓名"
            min-width="100"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="beginDate" align="center" label="开始follow日期" min-width="100"></el-table-column>
        <el-table-column prop="endDate" align="center" label="截止follow日期" min-width="100"></el-table-column>
        </el-table>
        <VipFollowUserDetail
            :followVisible="followVisible"
            :menteeInfo="menteeInfo"
            :signId="signId"
            :refresh="refresh"
            @close="followClose"
            @submit="followUpSubmit"
        ></VipFollowUserDetail>
        
        <!-- <follow-up
        :followUpMemberList="followUpMemberList"
        :followUpIdList="followUpIdList"
        :toFollowUpList="toFollowUpList"
        :followUpVisible="followUpVisible"
        @close="followUpClose2"
        @updata="followUpUpdata2"
        ></follow-up> -->
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
// import followUp from './components/follow_up.vue'
import mySelect from '@/components/my-select.vue'
import VipFollowUserDetail from '../mentee/components/VipFollowUserDetail.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { VipFollowUserDetail, mySelect },
  data: () => {
    return {
      myDate: [],
      userId: '',
      groupId: '',
      users: [],
      role: '0',
      tableData: [],
      followUpIdList: [],
      refresh: true,
      toFollowUpList: [],
      followUpMemberList: [],
      followUpIdNum: 0,
      followVisible: false,
      followUpVisible: false,
      loading: false,
      menteeInfo: {},
      signId: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  mounted () {
    this.userId = this.userInfo.userId
    if (this.roleInfo.includes('VIP_follow_up_ALL_Data')) {
      this.role = '1'
    } else {
      this.role = '0'
    }

    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      const params = {
        userId: this.userId,
        groupId: this.groupId
      }
      api.getVipFollowUpList(params).then(res => {
        this.loading = false
        console.log('getVipFollowUpList follow列表', res.data)
        this.tableData = res.data
      })
      this.followUpUpdata()
    },
    follow (v) {
      console.log(v, 'yx1111111111111111111111111')
      this.menteeInfo = {
        realName: v.menteeName,
        menteeId: v.menteeId
      }
      this.signId = v.signId
      this.followVisible = true
    },
    followUpClose () {
      this.followVisible = false
      this.signId = ''
    },
    followUpUpdata () {
      this.getFollowUpMenteeIdListByUserId()
    },
    followUpUpdata2 () {
      this.followUpVisible = false
      this.Topage()
    },
    getFollowUpMenteeIdListByUserId () {
      api
        .getVipFollowData(this.userInfo.userId).then(res => {
          console.log('拿follow up menteeId list 数据', res)
          let number = 0
          res.data.member.forEach(v => {
            number += v.userCount
          })
          this.followUpIdNum = number
          this.followUpIdList = []
          this.toFollowUpList = []
          this.followUpMemberList = res.data.member
          res.data.list.forEach(v => {
            this.followUpIdList.push(v.signId)
          })
          console.log(this.followUpIdList, 'yx*********************')
          res.data.member.forEach(v => {
            v.userFollowUpList &&
              this.toFollowUpList.push(...v.userFollowUpList)
          })
          console.log(this.toFollowUpList)
        })
        .catch(err => {
          console.log('拿follow up 数据', err)
        })
    },
    followUpSubmit () {
      this.followUpClose()
      this.Topage()
    },
    followUp () {
      this.$router.push({ name: 'VipFollow' })
    //   this.followUpVisible = true
    },
    followUpClose2 () {
      this.followUpVisible = false
    },
    changeSelect (data) {
      this.groupId = data.groupId
      this.userId = data.user
    },
    followClose () {
      console.log('followClose')
      this.followVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
