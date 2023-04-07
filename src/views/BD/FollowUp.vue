<!--
 * @Author: 库建华
 * @Date: 2020-06-17 11:24:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-25 16:51:32
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div>
      <div class="search_page">
        <div class="search">
          <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="userId"
            placeholder="请选择"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-switch
            class="mr10"
            v-model="followType"
            active-color="#13ce66"
            inactive-color="#409EFF"
            active-text="校园大使"
            inactive-text="合作商"
            @change="Topage()"
          ></el-switch>
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
            <el-button type="text" size="mini" @click="setFollowUp(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <template v-if="followType">
          <el-table-column prop="ambassadorId" align="center" label="校园大使ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ambassadorName" align="center" label="校园大使名称" show-overflow-tooltip></el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="cooperatorId" align="center" label="合作商ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cooperatorName" align="center" label="合作商名称" show-overflow-tooltip></el-table-column>
        </template>
        <el-table-column prop="followResult" align="center" label="follow内容" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="updateTime"
          align="center"
          label="follow时间"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateByName"
          align="center"
          label="跟进人姓名"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="manageByName"
          align="center"
          label="管理人姓名"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="beginDate" align="center" label="开始follow日期" min-width="100"></el-table-column>
        <el-table-column prop="endDate" align="center" label="截止follow日期" min-width="100"></el-table-column>
      </el-table>
    </div>
    <setFollowUp
      :setFollowUpVisible="setFollowUpVisible"
      :followUpData="followUpData"
      @close="followUpClose"
      @submit="followUpSubmit"
    />
  </d2-container>
</template>

<script>
import api from '@/api/bd'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import setFollowUp from './components/set_follow_up.vue'

export default {
  mixins: [mixins],
  components: { setFollowUp },
  data: () => {
    return {
      pageSize: 400,
      myDate: [],
      userId: 'ALL',
      users: [],
      tableData: [],
      followType: true,
      loading: false,
      setFollowUpVisible: false,
      followUpData: {}
    }
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  mounted () {
    api.subordinate(this.userInfo.userId).then(({ data }) => {
      console.log('获取用户列表', data)
      const users = [
      ]
      if (this.roleInfo.includes('BD_follow_up_ALL_Data')) {
        users.push({ userId: 'ALL_Data', userName: '全数据' })
      }
      users.push({ userId: 'ALL', userName: 'ALL' })
      data.forEach(e => {
        if (!users.some(em => em.userId == e.userId)) {
          users.push(e)
        }
      })
      this.users = users
    })
    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      const params = {
        manageBy: this.userId
      }
      if (this.followType) {
        api.getAmbassadorFollowUpList(params).then(res => {
          console.log('getAmbassadorFollowUpList follow列表', res.data)
          this.tableData = res.data
          this.loading = false
        })
      } else {
        api.getCooperatorFollowUpList(params).then(res => {
          console.log('getCooperatorFollowUpList follow列表', res.data)
          this.tableData = res.data
          this.loading = false
        })
      }
    },
    setFollowUp (v) {
      this.followUpData = { ...v }
      console.log(this.followUpData)
      this.setFollowUpVisible = true
    },
    followUpClose () {
      this.setFollowUpVisible = false
      this.followUpData = {}
    },
    followUpSubmit () {
      this.followUpClose()
      this.Topage()
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
