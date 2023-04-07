
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
            placeholder="合作商名称/Code"
            v-if="roleInfo.includes(`BD_cooperator_search`)"
            clearable
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-select
            class="mr10"
            size="mini"
            style="width:150px"
            filterable
            v-model="cooperatorType"
            clearable
            placeholder="合作商类型"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in cooperator_type2"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            style="width:150px"
            filterable
            v-model="schoolId"
            clearable
            placeholder="学校"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in school"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            style="width:150px"
            filterable
            v-model="countryId"
            clearable
            placeholder="国家/地区"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in country"
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
            v-model="cooperatorStatus"
            clearable
            placeholder="合作状态"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in cooperator_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            style="width:100px"
            size="mini"
            filterable
            v-model="manageBy"
            clearable
            placeholder="选择用户"
            @change="Topage(1)"
            v-if="roleInfo.includes(`BD_cooperator_select`)"
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
            class="mr10 ml0"
            v-if="roleInfo.includes(`BD_cooperator_search`)"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-plus"
            class="mr10 ml0"
            v-if="roleInfo.includes(`BD_cooperator_add`)"
            size="mini"
            plain
            @click="newUser"
          >新增</el-button>
          <el-button
            class="mr10 ml0"
            v-if="roleInfo.includes(`BD_cooperator_follow_up`)"
            size="mini"
            plain
            @click="followUpNum"
          >
            follow up(
            <span :class="{'colorR':!!followUpListLength}">{{followUpListLength}}</span>
            )
          </el-button>
          
          <el-button
            class="mr10 ml0"
            size="mini"
            plain
            @click="showMenteeArr"
          >合作商转介绍学生</el-button>
          <el-badge class=" mr10" :value="showOrderArr.length" >
            <el-button
              size="mini"
              plain
              @click="showOrderArrGo"
            >合作商转介绍订单</el-button>
          </el-badge>
          <el-button
          v-if="roleInfo.includes(`BD_cooperator_dayList`)"
            class=" ml0"
            size="mini"
            plain
            @click="daySelect"
          >每日统计</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`BD_cooperator_page`)"
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
        @row-dblclick="detail"
      >
        <el-table-column
          prop="cooperatorName"
          min-width="200px"
          fixed
          align="center"
          label="合作方名称"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-popover effect="dark" placement="right" width="400" trigger="hover">
              <div :style="{background:'#fff'}" v-html="scope.row.tips"></div>
              <p slot="reference">
                <el-badge :is-dot="!!scope.row.tips">{{scope.row.cooperatorName}}</el-badge>
              </p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="uniqueCode"  min-width="100px" align="center" label="Code"></el-table-column>
        <el-table-column prop="cooperatorStatusName" min-width="100px" align="center" label="状态"></el-table-column>
        <el-table-column prop="cooperatorTypeName" min-width="100px" align="center" label="合作方类型"></el-table-column>
        <el-table-column
          prop="schoolChiName"
          min-width="100px"
          align="center"
          label="学校"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="countryName"
          min-width="100px"
          align="center"
          label="国家/地区"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="officialAccountId" min-width="100px" align="center" label="公众号ID"></el-table-column>
        <el-table-column
          prop="officialAccountName"
          min-width="100px"
          align="center"
          label="公众号名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="principal"
          min-width="100px"
          align="center"
          label="负责人名字（合作方）"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="principalPosition"
          min-width="100px"
          align="center"
          label="合作商对接人职位"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="wxId" min-width="100px" align="center" label="对接人微信"></el-table-column>
        <el-table-column prop="manageByName" min-width="100px" align="center" label="管理者姓名"></el-table-column>
        <el-table-column prop="createByName" min-width="100px" align="center" label="创建者姓名"></el-table-column>
        <el-table-column prop="updateByName" min-width="100px" align="center" label="最近更新者姓名"></el-table-column>
        <el-table-column prop="updateTime" min-width="100px" align="center" label="最近更新时间"></el-table-column>
      </el-table>
    </div>
    <!-- 新增合作商 -->
    <el-dialog :close-on-click-modal="false"
      title="新增合作商"
      :visible.sync="editChooseVisible"
      width="900px"
      :before-close="editChooseClose"
    >

      <div
      v-loading="loading2"
      class="pt10 yx_descriptions">
        <div >
          <el-input class="mb20 input-with-select"
            size="mini"
            v-model="wxId"
            clearable
            placeholder="输入微信id"
            @change="changeSearch()"
            @keyup.enter.native="searchByWxId()"
            :style="{width:'260px'}" >
            <el-button slot="append" size="mini" @click="searchByWxId()" icon="el-icon-search">检索</el-button>
          </el-input>
          <div v-if="cooperatorList.cooperatorArr && cooperatorList.cooperatorArr.length > 0 && active == 1">
            <div  v-for="(item,i) in cooperatorList.cooperatorArr" :key="i" class="mb10">
              <el-descriptions  :contentStyle="{flex:1}" class="yx_1"   direction="vertical" :column="4" border>
                <el-descriptions-item label="Code">
                  <el-tag size="small" type="success" >合作商</el-tag>{{item.uniqueCode}}</el-descriptions-item>
                <el-descriptions-item label="合作商名称">{{item.cooperatorName}}</el-descriptions-item>
                <el-descriptions-item label="合作商类型">{{item.cooperatorTypeName}}</el-descriptions-item>
                <el-descriptions-item label="状态">{{item.cooperatorStatusName}}</el-descriptions-item>
                <el-descriptions-item label="对接人">{{item.principal}}</el-descriptions-item>
                <el-descriptions-item label="当前管理人">{{item.manageByName}}</el-descriptions-item>
                <el-descriptions-item label="创建人">{{item.createByName}}</el-descriptions-item>
                <el-descriptions-item label="创建日期">{{item.createTime}}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div v-if="cooperatorList.mentorArr && cooperatorList.mentorArr.length > 0 && active == 1">
            <div  v-for="(item,i) in cooperatorList.mentorArr" :key="i" class="mb10">
              <el-descriptions  :contentStyle="{flex:1}" class="yx_2"   direction="vertical" :column="4" border>
                <el-descriptions-item label="导师">
                  <el-tag size="small" type="primary" >导师</el-tag>{{item.mentorId}}</el-descriptions-item>
                <el-descriptions-item label="导师名">{{item.mentorName}}</el-descriptions-item>
                <el-descriptions-item label="所在公司">{{item.companyName}}</el-descriptions-item>
                <el-descriptions-item label="操作">
                  <el-button type="primary" size="mini" @click="createKol('mentor',item.mentorId)">创建导师KOL</el-button>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
           <div v-if="cooperatorList.meneerArr && cooperatorList.meneerArr.length > 0 && active == 1">
            <div  v-for="(item,i) in cooperatorList.meneerArr" :key="i" class="mb10">
              <el-descriptions  :contentStyle="{flex:1}" class="yx_3"   direction="vertical" :column="4" border>
                <el-descriptions-item label="学员">
                  <el-tag size="small" type="danger" >学员</el-tag>{{item.menteeId}}</el-descriptions-item>
                <el-descriptions-item label="学员名">{{item.menteeName}}</el-descriptions-item>
                <el-descriptions-item label="微信名">{{item.wxName}}</el-descriptions-item>
                <el-descriptions-item label="学校">{{item.schoolName}}</el-descriptions-item>
                <el-descriptions-item label="毕业年份">{{item.finishYear}}</el-descriptions-item>
                <el-descriptions-item label="操作">
                  <el-button type="primary" size="mini" @click="createKol('mentee',item.menteeId)">创建学员KOL</el-button>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div v-if="active == 1">
             <el-descriptions  :contentStyle="{flex:1}" class="yx_4"   direction="vertical" :column="1" border>
                <el-descriptions-item label="合作商类型">
                  <el-select
                  :style="{width:'205px'}"
                  filterable
                  class="mr10"
                  v-model="cooperatorTypeChoose"
                  placeholder="请选择"
                  >
                    <el-option
                      v-for="item in cooperator_type"
                      :key="item.itemValue"
                      :label="item.itemName"
                      :value="item.itemValue"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="editChooseSubmit" >创建新合作商</el-button>
                </el-descriptions-item>
              </el-descriptions>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editChooseClose">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="tips" :visible.sync="tipVisible" width="500px" :before-close="tipClose">
      <el-input
        type="textarea"
        :autosize="{minRows:3}"
        v-model="tipData.tips"
        :maxlength="255"
        placeholder="限制255字符"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipClose">取 消</el-button>
        <el-button type="primary" @click="tipSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <detail
      :detailVisible="detailVisible"
      :cooperatorId="cooperatorData.cooperatorId"
      @close="detailClose"
      @submit="detailSubmit"
    />
    <editMainlandCommunity
      :editVisible="mainlandCommunityVisible"
      :cooperatorData="cooperatorData"
      @close="editClose"
      @submit="editSubmit"
    />
    <editOverseasCommunity
      :editVisible="overseasCommunityVisible"
      :cooperatorData="cooperatorData"
      @close="editClose"
      @submit="editSubmit"
    />
    <editOverseasEducation
      :editVisible="overseasEducationVisible"
      :cooperatorData="cooperatorData"
      @close="editClose"
      @submit="editSubmit"
    />
    <editOverseasMedia
      :editVisible="overseasMediaVisible"
      :cooperatorData="cooperatorData"
      @close="editClose"
      @submit="editSubmit"
    />
    <edit
      :editVisible="editVisible"
      :cooperatorData="cooperatorData"
      @close="editClose"
      @submit="editSubmit"
    />
    <followUpNum
      :followUpNumVisible="followUpNumVisible"
      @close="followUpNumClose"
      @submit="followUpNumSubmit"
    />
    <menteeBymanage
      :showMenteeArrVisible="showMenteeArrVisible"
      :manageBy="manageBy"
      @close="showMenteeArrClose"
    />
    <orderBymanage
      :showOrderArrVisible="showOrderArrVisible"
      :manageBy="manageBy"
      :showOrderArr="showOrderArr"
      @update="updateOrder"
      @close="showOrderArrClose"
    />
    <daySelect
      :daySelectVisible="daySelectVisible"
      :manageBy="manageBy"
      @close="daySelectClose"
    />
  </d2-container>
</template>
<script>
import api from '@/api/bd'
import apiUser from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import detail from './components/detail.vue'
import editMainlandCommunity from './components/edit_mainland_community.vue'
import editOverseasCommunity from './components/edit_overseas_community.vue'
import editOverseasEducation from './components/edit_overseas_education.vue'
import menteeBymanage from './components/menteeBymanage.vue'
import orderBymanage from './components/orderBymanage.vue'
import daySelect from './components/daySelect.vue'
import editOverseasMedia from './components/edit_overseas_media.vue'
import edit from './components/edit.vue'

import followUpNum from './components/follow_up_num.vue'
import { mapState } from 'vuex'
export default {
  name: 'Cooperator',
  mixins: [mixins],
  components: {
    detail,
    editMainlandCommunity,
    editOverseasCommunity,
    editOverseasEducation,
    editOverseasMedia,
    followUpNum,
    edit,
    orderBymanage,
    menteeBymanage,
    daySelect
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  data () {
    return {
      showOrderArr: [],
      pageSize: 400,
      school: [],
      country: [],
      common_yes_or_no: [],
      cooperator_status: [],
      cooperatorStatus: '',
      cooperator_type: [],
      cooperatorType: '',
      countryId: '',
      schoolId: '',

      search: '',

      manageBy: 'ALL',
      users: [],

      pageNum: 1,
      total: 0,
      showMenteeArrVisible: false,
      showOrderArrVisible: false,
      loading: false,
      loading2: false,
      rows: [],
      daySelectVisible: false,
      detailVisible: false,
      editVisible: false,
      payAccountVisible: false,
      contractVisible: false,
      tweetVisible: false,
      followUpNumVisible: false,
      milestoneVisible: false,
      cooperationContentVisible: false,
      widths: '240px',
      userId: '', // ID
      viewFileVisible: false,
      cooperator_type2: [],
      key: '',
      keyDisplay: false,
      itemData: {},

      hasAcc: '',
      userAcc: '', // 账户
      userStatus: '', // 账户

      display: false,
      editDisplay: false,
      formRule: {
        password: '',
        password2: '',
        userStatus: null
      },
      Rules: {
      },

      cooperatorData: {},
      cooperatorId: '',

      followUpListLength: 0,

      // 新增合作商
      cooperatorTypeChoose: null,
      editChooseVisible: false,
      active: 0,
      wxId: '',
      cooperatorList: {
        cooperatorArr: [],
        meneerArr: [],
        mentorArr: []
      },

      overseasEducationVisible: false,
      overseasMediaVisible: false,
      overseasCommunityVisible: false,
      mainlandCommunityVisible: false,

      tipVisible: false,
      tipData: {}
    }
  },
  created () {
    this.axios()
  },
  mounted () {
    this.initShowOrder()
    this.Topage(1)
    this.pageInit()
    this.getFollowUpNum()
  },
  methods: {
    initShowOrder () {
      api.orderArrBymanage('').then(res => {
        console.log(res.data)
        this.showOrderArr = res.data || []
      })
    },
    updateOrder () {
      this.initShowOrder()
    },
    async pageInit () {
      this.school = await this.getSchool('school')
      this.cooperator_type2 = await this.getDictionary('cooperator_type')
      this.cooperator_type = []
      this.cooperator_type2.forEach(item => {
        if (item.itemValue.indexOf('学生KOL') == '-1' && item.itemValue.indexOf('导师KOL') == '-1') {
          this.cooperator_type.push(item)
        }
      })
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.cooperator_status = await this.getDictionary('cooperator_status')
      this.country = await this.getDictionary('country')
    },
    axios () {
      this.manageBy = this.userInfo.userId
      apiUser.subordinate(this.manageBy, '').then(({ data }) => {
        const users = [
          // { userId: "ALL", userName: "ALL" },
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('ALL_VIP_Data')) {
          this.users.unshift({
            userId: 'ALL_VIP_Data',
            userName: '全VIP部门数据'
          })
        }
        if (this.roleInfo.includes('BD_cooperator_all_user')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      const data = {
        search: this.search,
        schoolId: this.schoolId,
        countryId: this.countryId,
        cooperatorType: this.cooperatorType,
        cooperatorStatus: this.cooperatorStatus,
        manageBy: this.manageBy,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.loading = true
      api
        .getCooperatorV2List(data)
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
      api.getFollowUpNumCooperator().then(res => {
        console.log('getFollowUpNumCooperator', res)
        this.followUpListLength = res.data.length || 0
      })
    },
    newUser () {
      this.cooperatorData = {}
      this.editChooseVisible = true
    },
    editClose () {
      this.editChooseClose()
      this.editVisible = false
      this.editChooseVisible = false
      this.mainlandCommunityVisible = false
      this.overseasCommunityVisible = false
      this.overseasEducationVisible = false
      this.overseasMediaVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage(1)
    },
    detail (cooperatorData) {
      this.$router.push({ name: 'cooperator_detail', query: { cooperatorId: cooperatorData.cooperatorId } })
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSubmit () {
      this.detailClose()
      this.Topage(1)
    },
    contract (cooperatorData) {
      this.cooperatorData = cooperatorData // ID
      this.contractVisible = true
    },
    contractClose () {
      this.contractVisible = false
    },
    contractSubmit () {
      this.contractClose()
      this.Topage(1)
    },
    tweet (cooperatorData) {
      this.cooperatorData = cooperatorData // ID
      this.tweetVisible = true
    },
    tweetClose () {
      this.tweetVisible = false
    },
    tweetSubmit () {
      this.tweetClose()
      this.Topage(1)
    },
    milestoneClose () {
      this.milestoneVisible = false
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
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    editChooseClose () {
      this.editChooseVisible = false
      this.cooperatorTypeChoos = null
      this.editChooseVisible = false
      this.active = 0
      this.wxId = ''
      this.cooperatorList = {
        cooperatorArr: [],
        meneerArr: [],
        mentorArr: []
      }
    },
    editChooseSubmit () {
      console.log(this.cooperatorTypeChoose)
      if (!this.cooperatorTypeChoose) {
        return
      }
      this.cooperatorData.cooperatorType = this.cooperatorTypeChoose
      this.cooperatorData.wxId = this.wxId
      switch (this.cooperatorTypeChoose) {
        case '大陆社团':
          this.mainlandCommunityVisible = true
          this.cooperatorTypeChoose = null
          break
        case '海外社团':
          this.overseasCommunityVisible = true
          this.cooperatorTypeChoose = null
          break
        case '留学机构':
          this.overseasEducationVisible = true
          this.cooperatorTypeChoose = null
          break
        case '媒体投放':
          this.overseasMediaVisible = true
          this.cooperatorTypeChoose = null
          break
        default:
          this.editVisible = true
          this.cooperatorTypeChoose = null
      }
    },
    changeSearch () {
      this.active = 0
      this.cooperatorList = {
        cooperatorArr: [],
        meneerArr: [],
        mentorArr: []
      }
    },
    searchByWxId () {
      if (this.wxId) {
        this.loading2 = true
        this.active = 0
        api.getListByManagerWxNew({ wxId: this.wxId }).then((res) => {
          this.loading2 = false
          console.log(res.data)
          if (res.code !== 200) {
            this.$message.warning(res.message)
            this.active = 0
          } else {
            this.cooperatorList = res.data
            this.active = 1
          }
        })
      } else {
        this.$message.warning('微信ID必填')
      }
    },
    next () {
      this.active = 2
    },
    dblclick (row, column, cell, event) {
      console.log(row, column, cell, event)
      this.tipVisible = true
      this.tipData = row
    },
    tipClose () {
      this.tipVisible = false
    },
    tipSubmit () {
      console.log(this.tipData)
      const data = {
        cooperatorId: this.tipData.cooperatorId,
        tips: this.tipData.tips
      }
      api
        .setCooperatorTips(data)
        .then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$loading().close()
          this.tipClose()
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '失败',
            type: 'error'
          })
          this.$loading().close()
          this.tipClose()
        })
    },
    createKol (type, id) {
      if (type == 'mentor') {
        this.editVisible = true
        this.cooperatorTypeChoose = null
        this.cooperatorData.cooperatorType = '导师KOL'
        this.cooperatorData.wxId = this.wxId
        this.cooperatorData.keyId = id
      } else {
        this.editVisible = true
        this.cooperatorTypeChoose = null
        this.cooperatorData.cooperatorType = '学生KOL'
        this.cooperatorData.wxId = this.wxId
        this.cooperatorData.keyId = id
      }
    },
    showMenteeArr () {
      this.showMenteeArrVisible = true
    },
    showOrderArrGo () {
      this.showOrderArrVisible = true
    },
    showOrderArrClose () {
      this.showOrderArrVisible = false
    },
    showMenteeArrClose () {
      this.showMenteeArrVisible = false
    },
    daySelect () {
      this.daySelectVisible = true
    },
    daySelectClose () {
      this.daySelectVisible = false
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
 .yx_descriptions .el-descriptions .is-bordered .el-descriptions-item__cell{
    width: 25%;
  }
  .yx_descriptions .my-label {
    width:100% !important
  }
  .yx_1 .el-descriptions__body,.yx_1 .is-bordered .el-descriptions-item__cell{
    background: #E1F3D8 !important;
  }
  .yx_2 .el-descriptions__body,.yx_3 .is-bordered .el-descriptions-item__cell{
    background: rgba(253, 226, 226,1) !important;
  }
  .yx_3 .el-descriptions__body,.yx_4 .is-bordered .el-descriptions-item__cell{
    background: rgba(179, 216, 225,0.5) !important;
  }
  .yx_2 .el-descriptions__body,.yx_2 .is-bordered .el-descriptions-item__cell{
    background: rgba(250, 236, 216,0.5) !important;
  }
</style>
