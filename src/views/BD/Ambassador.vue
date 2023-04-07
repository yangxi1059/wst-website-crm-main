<!--
 * @Author: 库建华
 * @Date: 2020-04-22 15:57:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-08 17:24:50
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="user">
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            placeholder="请输入内容/Code"
            v-if="roleInfo.includes(`ambassador_search`)"
            clearable
            @keyup.enter.native="Topage()"
          ></el-input>
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="ambassadorType"
            clearable
            placeholder="校园大使类型"
            @change="Topage()"
          >
            <el-option
              v-for="item in ambassador_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-date-picker
            :style="{width:'150px'}"
            v-model="finishYear"
            size="mini"
            class="mr10"
            clearable
            :editable="false"
            type="year"
            value-format="yyyy"
            placeholder="毕业年份"
            @change="Topage()"
          ></el-date-picker>
          <!-- <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="finishYear"
            clearable
            placeholder="毕业年份"
            @change="Topage()"
          >
            <el-option
              v-for="item in ambassador_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>-->
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="ambassadorStatus"
            clearable
            placeholder="是否在合作"
            @change="Topage()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="signMenteeStatus"
            clearable
            placeholder="是否有学生签约"
            @change="Topage()"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="manageBy"
            clearable
            placeholder="选择用户"
            @change="Topage()"
            v-if="roleInfo.includes(`ambassador_select`)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class="ml0 mr10"
            v-if="roleInfo.includes(`ambassador_search`)"
            size="mini"
            plain
            @click="Topage()"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="ml0 mr10"
            v-if="roleInfo.includes(`ambassador_add`)"
            size="mini"
            plain
            @click="newSelect"
          >新增</el-button>
          <el-button
            class="ml0"
            v-if="roleInfo.includes(`ambassador_follow_up`)"
            size="mini"
            plain
            @click="followUpNum"
          >
            follow up(
            <span :class="{'colorR':!!followUpListLength}">{{followUpListLength}}</span>)
          </el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`ambassador_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="rows"
        size="mini"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column min-width="100px" align="center" label="操作" fixed="left" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`ambassador_edit`)"
              size="mini"
              type="text"
              @click="editor(scope.row)"
              title="编辑"
              class="el-icon- edit"
            >编辑</el-button>
            <el-button
              v-if="roleInfo.includes(`ambassador_pay`)"
              size="mini"
              type="text"
              @click="payAccount(scope.row.ambassadorId)"
              class="el-icon-bank- card"
              title="支付账号"
            >账户</el-button>
            <el-button
              v-if="roleInfo.includes(`ambassador_contract`)"
              size="mini"
              type="text"
              @click="contract(scope.row.ambassadorId)"
              class="el-icon-s- check"
              title="合同/续约"
            >合同</el-button>
            <el-button
              v-if="roleInfo.includes(`ambassador_applyList`)"
              size="mini"
              type="text"
              @click="applyList(scope.row)"
              class="el-icon- receiving"
              title="薪资申请列表"
            >薪资</el-button>
            <el-button
              v-if="roleInfo.includes(`ambassador_follow_up`)"
              size="mini"
              type="text"
              @click="followUp(scope.row)"
              class="el-icon-phone- outline"
              title="Follow Up"
            >follow</el-button>
            <el-button
              v-if="roleInfo.includes(`ambassador_mentee_list`)"
              size="mini"
              type="text"
              @click="getMentee(scope.row)"
              title="学生名单"
            >咨询学生</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="uniqueCode" min-width="100px" align="center" label="Code" fixed="left">
          <template slot-scope="scope">
            <span>{{scope.row.uniqueCode || '暂无'}}</span>
            <el-button type="text" size="mini" v-if="roleInfo.includes(`ambassador_changeCode`)" @click="changeCode(scope.row)">修改Code</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ambassadorName" min-width="200px" align="center" fixed="left" label="校园大使名称"></el-table-column>
        <el-table-column prop="ambassadorTypeName" min-width="100px" align="center" fixed="left" label="校园大使类型"></el-table-column>
        <el-table-column prop="menteeCount" min-width="100px" align="center" label="咨询学生数"></el-table-column>
        <el-table-column prop="signMenteeCount" min-width="100px" align="center" label="签约学生数"></el-table-column>
        <el-table-column
          prop="latestFollowTime"
          min-width="100px"
          align="center"
          label="最近一次follow时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="latestFollowResult"
          min-width="100px"
          align="center"
          label="最近一次follow内容"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="schoolChiName" min-width="100px" align="center" label="学校"></el-table-column>
        <el-table-column prop="majorChiName" min-width="100px" align="center" label="专业"></el-table-column>
        <el-table-column prop="finishYear" min-width="100px" align="center" label="毕业年份"></el-table-column>
        <el-table-column
          prop="communicateRecord"
          min-width="100px"
          align="center"
          label="沟通记录"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="onboardStatusName" min-width="100px" align="center" label="是否onboard"></el-table-column>
        <el-table-column prop="wxId" min-width="100px" align="center" label="微信ID"></el-table-column>
        <el-table-column prop="consultStatusName" min-width="100px" align="center" label="是否已咨询"></el-table-column>
        <el-table-column
          prop="ambassadorIntroduction"
          min-width="100px"
          align="center"
          label="校园大使简介"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="tel" min-width="100px" align="center" label="tel"></el-table-column>
        <el-table-column prop="firstDockingDate" min-width="100px" align="center" label="初次对接日期"></el-table-column>
        <el-table-column prop="onboardDate" min-width="100px" align="center" label="onboard日期"></el-table-column>
        <el-table-column prop="email" min-width="100px" align="center" label="email"></el-table-column>
        <el-table-column prop="salaryTypeName" min-width="100px" align="center" label="薪资类型"></el-table-column>
        <el-table-column prop="salary" min-width="100px" align="center" label="薪资"></el-table-column>
        <el-table-column prop="salaryDay" min-width="100px" align="center" label="薪资发放日"></el-table-column>
        <el-table-column prop="manageByName" min-width="100px" align="center" label="管理者姓名"></el-table-column>
        <el-table-column prop="createByName" min-width="100px" align="center" label="创建者姓名"></el-table-column>
        <el-table-column prop="updateByName" min-width="100px" align="center" label="最近更新者姓名"></el-table-column>
        <el-table-column prop="updateTime" min-width="100px" align="center" label="最近更新时间"></el-table-column>
      </el-table>
    </div>
    <edit
      :editVisible="editVisible"
      :ambassadorData="ambassadorData"
      @close="editClose"
      @submit="editSubmit"
    />
    <pay-account
      :payAccountVisible="payAccountVisible"
      :ambassadorId="ambassadorId"
      @close="payAccountClose"
      @submit="payAccountSubmit"
    />
    <contract
      :contractVisible="contractVisible"
      :ambassadorId="ambassadorId"
      @close="contractClose"
      @submit="contractSubmit"
    />
    <applyList
      :applyListVisible="applyListVisible"
      :ambassadorData="ambassadorData"
      @close="applyListClose"
      @submit="applyListSubmit"
    />
    <followUp
      :followUpVisible="followUpVisible"
      :ambassadorData="ambassadorData"
      @close="followUpClose"
    />
    <followUpNum
      :followUpNumVisible="followUpNumVisible"
      @close="followUpNumClose"
      @submit="followUpNumSubmit"
    />
    <ambassadorMentee
      :setRateVisible="setRateVisible"
      :ambassadorData="ambassadorData"
      @close="setRateClose"
    />
    <el-dialog :close-on-click-modal="false" title="大使是否为VIP学员"
      width="360px"
      :before-close="newClose"
      :visible.sync="newVisible"
    >
      <el-radio v-model="isVIP" label="0" class="radio">否</el-radio><br>
      <el-radio v-model="isVIP" label="1" class="radio">是</el-radio>
      <el-input v-model="vipMenteeId" size="mini" :style="{width:'250px'}" placeholder="学员ID（学员管理页获取，非微信ID）" :disabled="isVIP=='0'"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="newUser" size="mini">下一步</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import api from '@/api/bd'
import apiUser from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import edit from './ambassador/edit.vue'
import payAccount from './ambassador/pay_account.vue'
import contract from './ambassador/contract_list.vue'
import applyList from './ambassador/apply_list.vue'
import followUp from './ambassador/follow_up.vue'
import followUpNum from './ambassador/follow_up_num.vue'
import ambassadorMentee from './components/ambassador_mentee.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  components: { edit, payAccount, contract, applyList, followUp, followUpNum, ambassadorMentee },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  data () {
    return {
      pageSize: 400,
      common_yes_or_no: [],
      ambassadorStatus: '',
      signMenteeStatus: '',
      ambassador_type: [],
      ambassadorType: '',
      search: '',
      finishYear: null,
      manageBy: 'ALL',
      users: [],
      pageNum: 1,
      total: 0,
      loading: false,
      rows: [],
      setRateVisible: false,
      editVisible: false,
      payAccountVisible: false,
      contractVisible: false,
      applyListVisible: false,
      followUpVisible: false,
      followUpNumVisible: false,
      userId: '', // ID
      viewFileVisible: false,
      key: '',
      keyDisplay: false,
      itemData: {},
      ambassadorData: {},
      ambassadorId: '',
      followUpListLength: 0,
      newVisible: false,
      isVIP: '0',
      vipMenteeId: ''
    }
  },
  created () {
    this.axios()
  },
  mounted () {
    this.Topage()
    this.getFollowUpNum()
  },
  methods: {
    axios () {
      apiUser
        .dicDropdown(['ambassador_type', 'common_yes_or_no'])
        .then(({ data }) => {
          this.ambassador_type = data.ambassador_type
          this.common_yes_or_no = data.common_yes_or_no
        })
      this.manageBy = this.userInfo.userId
      apiUser.subordinate(this.manageBy, '').then(({ data }) => {
        const users = [
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('ambassador_all_user')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      const data = {
        finishYear: this.finishYear,
        search: this.search,
        ambassadorType: this.ambassadorType,
        ambassadorStatus: this.ambassadorStatus,
        signMenteeStatus: this.signMenteeStatus,
        manageBy: this.manageBy,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.loading = true
      api
        .getAmbassadorList(data)
        .then(({ data }) => {
          console.log(data)
          this.pageNum = data.page
          this.total = data.total
          this.rows = data.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getFollowUpNum () {
      api.getFollowUpNumAmbassador().then(res => {
        console.log('getFollowUpNumAmbassador', res)
        this.followUpListLength = res.data.length || 0
      })
    },
    newSelect () {
      this.newVisible = true
    },
    newClose () {
      this.newVisible = false
      this.isVIP = '0'
      this.vipMenteeId = ''
    },
    newUser () {
      this.ambassadorData = {}
      if (this.isVIP == '1') {
        if (this.vipMenteeId == '') {
          this.$message.warning('请输入学员Id')
        } else {
          apiUser.getMenteeDataByMenteeId(this.vipMenteeId).then(res => {
            console.log(res)
            this.ambassadorData.menteeId = this.vipMenteeId
            this.ambassadorData = res.data
            this.ambassadorData.ambassadorName = res.data.realName
            this.ambassadorData.schoolId = res.data.school
            this.ambassadorData.tel = res.data.telephone
            this.ambassadorData.major = res.data.major.substring(0, res.data.major.indexOf(','))
            this.newClose()
            this.editVisible = true
          })
        }
      } else {
        this.newClose()
        this.editVisible = true
      }
    },
    editor (ambassadorData) {
      this.ambassadorData = ambassadorData // ID
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage()
    },
    payAccount (ambassadorId) {
      this.ambassadorId = ambassadorId // ID
      this.payAccountVisible = true
    },
    payAccountClose () {
      this.payAccountVisible = false
    },
    payAccountSubmit () {
      this.payAccountClose()
      this.Topage()
    },
    contract (ambassadorId) {
      this.ambassadorId = ambassadorId // ID
      this.contractVisible = true
    },
    contractClose () {
      this.contractVisible = false
    },
    contractSubmit () {
      this.contractClose()
      this.Topage()
    },
    applyList (ambassadorData) {
      this.ambassadorData = ambassadorData // ID
      this.applyListVisible = true
    },
    applyListClose () {
      this.applyListVisible = false
    },
    applyListSubmit () {
      this.applyListClose()
      this.Topage()
    },
    followUp (ambassadorData) {
      this.ambassadorData = ambassadorData // ID
      this.followUpVisible = true
    },
    followUpClose () {
      this.followUpVisible = false
      this.getFollowUpNum()
    },

    followUpNum () {
      this.followUpNumVisible = true
    },
    followUpNumClose () {
      this.followUpNumVisible = false
      this.getFollowUpNum()
    },
    followUpNumSubmit () {
      this.getFollowUpNum()
    },

    reset (row) {
      console.log(row)
      this.itemData = { ...row }
      this.keyDisplay = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    viewFile (userId) {
      this.userId = userId
      this.viewFileVisible = true
    },
    viewFileClose () {
      this.viewFileVisible = false
    },
    viewFileSubmit () {
      this.viewFileClose()
      this.Topage()
    },
    getMentee (val) {
      this.ambassadorData = val // ID
      console.log(val)
      this.setRateVisible = true
    },
    setRateClose () {
      this.setRateVisible = false
    },
    changeCode (item) {
      console.log(item)
      this.$prompt('请输入新的Code', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\w{4,20}$/,
        inputErrorMessage: 'Code格式不正确需4-20位'
      }).then(({ value }) => {
        api.uptAmbassadorCode(item.ambassadorId, value).then(() => {
          this.$message.success('修改成功')
          this.Topage()
        }).catch(err => {
          this.$message.error(err.message)
        })
        console.log(value)
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang='scss'>
.user {
  .el-table--mini td {
    padding: 0;
  }
}
.radio{
  line-height:50px;
}
</style>
