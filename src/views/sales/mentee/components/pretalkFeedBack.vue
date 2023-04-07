<!--
 * @Author: 杨曦
 * @Date: 2022-11-21 16:47:16
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-06 13:50:03
 * @Version:
 * @Description:
-->
<template>
  <el-drawer
    :visible.sync="pretalkFeedBackVisible"
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
      :data="pretalkFeedBackData"
      v-loading = "pictLoading"
      element-loading-text = "数据正在加载中"
      element-loading-spinner = "el-icon-loading"
    >
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.feedbackRemark" type="text" @click="tofeedBack(scope.row)" >评价</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Pretalk姓名" prop="pretalkName" align="center"></el-table-column> -->
      <el-table-column label="Pretalk类型" prop="pretalkTypeName" align="center"></el-table-column>
      <el-table-column label="标识码" prop="codes" align="center"></el-table-column>
      <el-table-column label="学生微信" prop="wxId" align="center"></el-table-column>
      <el-table-column label="学生昵称" prop="wxName" align="center"></el-table-column>
      <el-table-column label="签约日期" prop="signDate" align="center"></el-table-column>
      <el-table-column label="学生姓名" prop="menteeName" align="center"></el-table-column>
      <el-table-column label="分配顾问" prop="counselorName" align="center"></el-table-column>
      <el-table-column label="顾问微信" prop="counselorWxName" align="center"></el-table-column>
      <el-table-column label="分配人" prop="createByName" align="center"></el-table-column>
      <el-table-column label="分配时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="评价" prop="feedbackRemark" align="center"></el-table-column>
    </el-table>
</el-drawer>
</template>

<script>
import api from '@/api/sales_assistant.js'
import { mapState } from 'vuex'
import mixins from '@/plugin/mixins'
import apiUser from '@/api/user.js'

export default {
  mixins: [mixins],
  props: {
    pretalkFeedBackVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      pictLoading: false,
      pretalkFeedBackData: [],
      feedbackStatus: '0',
      users: [],
      userId:'',
      feedbackStatusList: [
        { itemName: '待评价', itemValue: '0' },
        { itemName: '已评价', itemValue: '1' }
      ]
    }
  },
  watch: {
    pretalkFeedBackVisible: function (val) {
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
      api.pretalk_feedback(data).then(res => {
        console.log(res.data)
        this.pretalkFeedBackData = res.data
        this.pictLoading = false
      })
    },
    close () {
      this.$emit('close')
      this.pretalkFeedBackData = []
    },
    tofeedBack (feedBack) {
      this.$prompt('请输入评价', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,50}$/,
        inputErrorMessage: '评价字数需在1~50个字符'
      })
        .then(({ value }) => {
          this.$loading({ background: 'rgba(0,0,0,.5)' })
          const data = {
            pkId: feedBack.pkId,
            feedbackRemark: value
          }
          console.log(data)
          api.toPretalkFeedback(data).then(res => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.initPage()
          })
        })
    }
  }
}
</script>

<style  scoped>
.el-notification.right{
  z-index: 3000 !important;
}
</style>
