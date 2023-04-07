<!--
 * @Author: 杨曦
 * @Date: 2022-12-06 13:34:32
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-07 13:55:49
 * @Version:
 * @Description:
-->
<template>
  <el-drawer
    :visible.sync="toSourceFormfeedbackVisible"
    class="drawer_bg"
    size="80%"
    @close="close"
  >
    <div slot="title" style="display:flex">
      <div>
        <el-select
            class="mr10 "
            filterable
            v-model="userId"
            placeholder="请选择"
          >
          <el-option
            v-for="item in users"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          ></el-option>
        </el-select>
        <el-select
          v-model="feedbackStatus"
          class="mr10"
          size="mini"
          clearable
          filterable
          :style="{width:'100px'}"
          placeholder="请选择来源"
        >
          <el-option
            v-for="(item,i) in feedbackStatusList"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-button size="mini" @click="initPage" >GO</el-button>
      </div>
    </div>
    <el-table
      stripe
      :data="sourceFormfeedbackData"
      v-loading = "pictLoading"
      element-loading-text = "数据正在加载中"
      element-loading-spinner = "el-icon-loading"
    >
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.sourceFromScore" type="text" @click="tofeedBack(scope.row)" >评价</el-button>
        </template>
      </el-table-column>
      <el-table-column label="学员id" prop="menteeId" align="center"></el-table-column>
      <el-table-column label="学生微信" prop="wxId" align="center"></el-table-column>
      <el-table-column label="学生昵称" prop="wxName" align="center"></el-table-column>
      <el-table-column label="毕业年份" prop="finishYear" align="center"></el-table-column>
      <el-table-column label="首次咨询日期" prop="firstAskDate" align="center"></el-table-column>
      <el-table-column label="销售分组" prop="counselorGroup" align="center"></el-table-column>
      <el-table-column label="分配顾问" prop="counselorName" align="center"></el-table-column>
      <el-table-column label="分配顾问微信" prop="counselorWxName" align="center"></el-table-column>
      <el-table-column label="分配顾问日期" prop="counselorDate" align="center"></el-table-column>
      <el-table-column label="渠道来源" prop="sourceFromName" align="center"></el-table-column>
      <el-table-column label="渠道管理人" prop="sourceManageName" align="center"></el-table-column>
      <el-table-column label="购买力" prop="purchasingPowerScore" align="center"></el-table-column>
      <el-table-column label="求职项目意向度" prop="careerIntentionScore" align="center"></el-table-column>
      <el-table-column label="用户背景与产品契合度" prop="careerAttractionScore" align="center"></el-table-column>
      <el-table-column label="学生渠道评分" prop="sourceFromScore" align="center"></el-table-column>
      <el-table-column label="学生渠道评价" prop="sourceFromNote" align="center"></el-table-column>
    </el-table>
    <sourceFeedBack :sourceFeedBackVisible="sourceFeedBackVisible" :menteeId="menteeId" @close="sourceFeedBackClose" @submit="sourceFeedBackSubmit" />
</el-drawer>
</template>

<script>
import api from '@/api/sales_assistant.js'
import { mapState } from 'vuex'
import mixins from '@/plugin/mixins'
import apiUser from '@/api/user.js'
import sourceFeedBack from './sourceFeedBack.vue'
export default {
  mixins: [mixins],
  props: {
    toSourceFormfeedbackVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { sourceFeedBack },
  data () {
    return {
      pictLoading: false,
      menteeId: '',
      sourceFeedBackVisible: false,
      sourceFormfeedbackData: [],
      feedbackStatus: '0',
      users: [],
      userId: '',
      feedbackStatusList: [
        { itemName: '待评价', itemValue: '0' },
        { itemName: '已评价', itemValue: '1' }
      ]
    }
  },
  watch: {
    toSourceFormfeedbackVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      const userInfo = this.$store.state.role.userInfo
      apiUser.subordinate(userInfo.userId, 'sales').then(({ data }) => {
        const users = [
          { userId: 'ALL', userName: 'ALL（本人及下属）' },
          { userId: userInfo.userId, userName: userInfo.userName }
        ]
        if (this.roleInfo.includes('client_tracking_ALL_Data')) {
          users.unshift({ userId: 'ALL_Data', userName: 'ALL（全部数据）' })
        }
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
      })
    },
    initPage () {
      this.pictLoading = true
      const data = {
        userId: this.userId,
        feedbackStatus: this.feedbackStatus
      }
      api.sourceForm_feedback(data).then(res => {
        console.log(res.data)
        this.sourceFormfeedbackData = res.data
        this.pictLoading = false
      })
    },
    close () {
      this.$emit('close')
      this.sourceFormfeedbackData = []
    },
    tofeedBack (feedBack) {
      console.log(feedBack)
      this.menteeId = feedBack.menteeId
      this.sourceFeedBackVisible = true
    },
    sourceFeedBackSubmit () {
      this.sourceFeedBackVisible = false
      this.initPage()
    },
    sourceFeedBackClose () {
      this.sourceFeedBackVisible = false
    }
  }
}
</script>

<style  scoped>
.el-notification.right{
  z-index: 3000 !important;
}
</style>
