<!--
 * @Author: kaan
 * @Date: 2021-11-05 13:52:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-28 13:45:49
 * @Version:
 * @Description:
-->
<template>
  <div>
    <d2-container v-loading="loading" style="transform: scale(1, 1)">
      <div class="search_page mb10">
        <div class="search">
          <el-input
            class="mr10 mb10"
            style="width:200px"
            v-model="search"
            size="mini"
            clearable
            placeholder="支持姓名、微信ID"
            @keyup.enter.native="Topage(1)"
            :style="{width:'120px'}"
          ></el-input>
          <el-cascader
          :style="{width:'120px'}"
            size="mini"
            class="mr10 mb10"
            v-model="role"
            ref="role"
            :options="userList"
            :props="{ checkStrictly: true,expandTrigger:'hover' }"
            clearable
            @change="roleChange()"
          >
            <p slot-scope="{data}" @click="clickNode">{{ data.label }}</p>
          </el-cascader>
          <el-button
            size="mini"
            icon="el-icon-search"
            class=""
            plain
            @click="Topage(1)"
          >GO</el-button>
          <el-button size="mini" plain @click="menteeNew()"  v-if="roleInfo.includes(`mentee_new_search`)">学员筛选</el-button>
          <el-button
            v-if="roleInfo.includes(`mentee_sign`)"
            icon="el-icon-edit-outline"
            plain
            @click="sign"
            title="通过学员微信Id发起签约"
          >签约</el-button>
          <el-button size="mini" plain @click="toOrder()" >订单管理</el-button>
        </div>
        <el-pagination
          class="pagination mb10"
          background
          @current-change="handleCurrentChange"
          :pager-count="5"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="total,prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      <div class="user_container " >
        <ul class="user_card_list mt10" v-loading="loading1">
          <li class="user_card_item" v-for="(member,i) in menteeList" :key="i" @click="handleClick(member.menteeId)">
            <div class="tag_block" style="position:absolute;left:20px;top:20px;display:flex">
              <div class="mr10" style="margin-bottom:3px" v-for="(item,j) in member.programProgress.programTag" :key="j">
                <el-tag   size="small"  :type="item.programStatus?'success':'info'">{{item.programTypeName}}</el-tag>
              </div>
            </div>
            <div class="user_card_item_border"></div>
            <div class="user_card_info_pic">
              <el-avatar :size="80" :src="member.headImage" ></el-avatar>
              <div class="sex_icon sex_icon_mars" v-if="member.sex==1">
                <d2-icon  name="mars"/>
              </div>
              <div class="sex_icon sex_icon_venus" v-if="member.sex==2">
                <d2-icon name="venus"/>
              </div>
            </div>
            <p class="user_card_info_name">{{member.realName}}</p>
            <span>{{member.email}}</span>
            <el-popover
              placement="top-start"
              width=""
              trigger="hover"
              >
                <div v-html="member.programProgress.note"></div>
              <el-progress slot="reference" :stroke-width="20" :text-inside="true" class="user_card_info_progress"  :percentage="member.programProgress.progress" ></el-progress>
            </el-popover>
          </li>
        </ul>
        <div class="user_statistics_bg"></div>
      </div>
      <menteeNew :menteeNewVisible="menteeNewVisible"  @close="menteeNewClose" @detail="menteeNewDetail" />
      <div class="user_statistics" v-loading="loading2">
        <div class="user_statistics_header">VIP各项统计</div>
        <div class="user_statistics_body">
          <el-date-picker
            style="width:300px;"
            v-model="statisticsDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="initPersional">
          </el-date-picker>
          <!-- <div class="user_statistics_progress">
            <el-progress type="circle" :percentage="60" color="#FF8C00" :format="format" style="white-space: pre;"></el-progress>
          </div> -->
          <ul class="user_statistics_list">
            <li class="user_statistics_item" v-for="(item,i) in statisticsList" :key="i">
              <div class="user_statistics_item_title">{{item.name}}</div>
              <div class="user_statistics_item_value_show" :style="{'border-color':borderColor[i]}" @click="showStatistics(i)">{{item.value}}</div>
            </li>
          </ul>
          <el-divider></el-divider>
          <div style="text-align:left;width:100%" class="mb10"><el-button type="success" size="mini" @click="numberInit()" icon="el-icon-refresh" ></el-button></div>
          <div class="user_statistics_btn">
            <el-button type="primary" class="mb10" @click="followUp">follow up</el-button>
            <el-button type="primary" class="mb10 mr10" @click="lesson">课程列表</el-button>
            <el-badge class="mb10 mr10 item" :value="numberInitDetail.lessonScheduleNum" v-if="roleInfo.includes(`mentee_check_lessons`)" >
              <el-button type="primary"   @click="checkLessons">预排课核验</el-button>
            </el-badge>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`mentee_check_information`)" @click="checkVipTable">查看VIP各项统计</el-button>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`mentee_check_deadline_information`)" @click="checkVipDeadline">查看VIP项目到期统计</el-button>
            <el-badge class="mb10 mr10 item" :value="numberInitDetail.applySeasonNotSetNum" v-if="roleInfo.includes(`mentee_apply_season_no_set`)" >
              <el-button type="primary"  v-if="roleInfo.includes(`mentee_apply_season_no_set`)" @click="applySeasonNotSet">申请季未设置</el-button>
            </el-badge>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`mentee_apply_season_process`)" @click="applySeason">申请季进度</el-button>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`vip_to_create`)" @click="vipCreate">VIP拉群一览</el-button>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`vip_to_vipShow`)" @click="vipShow">VIP签约拉群公示栏</el-button>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`vip_to_vipRecommender`)" @click="vipRecommenderShow">转介绍学员</el-button>
            <el-button type="primary" class="mb10" v-if="roleInfo.includes(`vip_tomentee_order`)" @click="vipMenteeOrder">VIP学生订单列表</el-button>
            <el-badge class="mb10 mr10 item" :value="numberInitDetail.mentorEntryTaskNum"  >
              <el-button type="primary"   @click="dockingAssignmentShow">导师对接</el-button>
            </el-badge>
            <el-button type="primary" class="mb10"  @click="waivListShow">放弃实习名单</el-button>
          </div>
        </div>

      </div>

    </d2-container>

    <el-drawer
      :title="`升学Offer列表`"
      :visible.sync="entranceOfferVisible"
      size="900px"
      :before-close="closeStatistics"
    >
      <div class="pl10 pr10">
        <el-table
          :data="entranceOfferList"
          style="width: 100%"
          v-loading="loading3"
        >
          <el-table-column  prop="menteeName"  label="学员名" ></el-table-column>
          <el-table-column  prop="entranceTypeName"  label="类型" ></el-table-column>
          <el-table-column  prop="entranceOfferProgramName"  label="专业项目" ></el-table-column>
          <el-table-column  prop="chiName"  label="升学学校" ></el-table-column>
          <el-table-column  prop="offerReceiveDate"  label="offer获得日期" ></el-table-column>
          <el-table-column  prop="applySeason" width="60" label="申请季"></el-table-column>
          <el-table-column  prop="createByName"  label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createTime"  label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :title="`求职Offer列表`"
      :visible.sync="jobOfferVisible"
      size="900px"
      :before-close="closeStatistics"
    >
      <div class="pl10 pr10">
        <el-table
          :data="jobOfferList"
          style="width: 100%"
          v-loading="loading3"
        >
          <el-table-column  prop="menteeName"  label="学员名" ></el-table-column>
          <el-table-column  prop="companyName"  label="公司" ></el-table-column>
          <el-table-column  prop="divisionName"  label="部门" ></el-table-column>
          <el-table-column  prop="resultApplyName"  label="offer类型" ></el-table-column>
          <el-table-column  prop="offerReceiveDate"  label="offer获得日期" ></el-table-column>
          <el-table-column  prop="applySeason" width="60" label="申请季"></el-table-column>
          <el-table-column  prop="createByName"  label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createTime"  label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :title="`面试列表`"
      :visible.sync="interviewVisible"
      size="950px"
      :before-close="closeStatistics"
    >
      <div class="pl10 pr10">
        <el-table
          :data="interviewList"
          style="width: 100%"
          v-loading="loading3"
        >
          <el-table-column  prop="menteeName"  label="学员名" ></el-table-column>
          <el-table-column  prop="companyName"  label="公司" ></el-table-column>
          <el-table-column  prop="divisionName"  label="部门" ></el-table-column>
          <el-table-column  prop="applySeason" width="60" label="申请季" ></el-table-column>
          <el-table-column  prop="interviewDate"  label="面试日期" ></el-table-column>
          <el-table-column  prop="timesName" label="面试伦次"></el-table-column>
          <el-table-column  prop="difficultyLevel" label="面试难度"></el-table-column>
          <el-table-column  prop="story" label="面经" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="managerByName" width="100" label="Strategist/PM"></el-table-column>
          <el-table-column  prop="createByName"  label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createTime"  label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :title="`导师面试`"
      :visible.sync="interviewMentorVisible"
      size="600px"
      :before-close="closeStatistics"
    >
      <div class="pl10 pr10">
        <el-table
          :data="interviewMentorList"
          style="width: 100%"
          v-loading="loading3"
        >
          <el-table-column  prop="mentorName"  label="导师姓名" ></el-table-column>
          <el-table-column  prop="interviewByName"  label="面试人" ></el-table-column>
          <el-table-column  prop="createByName"  label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createTime"  label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :title="`面经列表`"
      :visible.sync="storyCountVisible"
      size="900px"
      :before-close="closeStatistics"
    >
      <div class="pl10 pr10">
        <el-table
          :data="storyCountList"
          style="width: 100%"
          v-loading="loading3"
        >
          <el-table-column  prop="menteeName"  label="学员名" ></el-table-column>
          <el-table-column  prop="companyName"  label="公司" ></el-table-column>
          <el-table-column  prop="divisionName"  label="部门" ></el-table-column>
          <el-table-column  prop="applySeason"  label="申请季" ></el-table-column>
          <el-table-column  prop="locationName"  label="地区" ></el-table-column>
          <el-table-column  prop="story"  label="面经" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="storyByName"  label="小故事创建人" ></el-table-column>
          <el-table-column  prop="createTime"  label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :title="`文书修改`"
      :visible.sync="letterModifyVisible"
      size="900px"
      :before-close="closeStatistics"
    >
      <div class="pl10 pr10">
        <el-table
          :data="letterModifyList"
          style="width: 100%"
          v-loading="loading3"
        >
          <el-table-column  prop="menteeName"  label="学员名" ></el-table-column>
          <el-table-column  prop="applicationLetterName"  label="文书名称" ></el-table-column>
          <el-table-column  prop="applicationLetterNum"  label="修改轮次" ></el-table-column>
          <el-table-column  prop="managerByName" label="Strategist/PM"></el-table-column>
          <el-table-column  prop="createByName"  label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createTime"  label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <MenteeLesson :lessonVisible="lessonVisible" @close="lessonClose" />

    <VipCheck
      v-if="vipCheckVisible"
      :vipCheckVisible="vipCheckVisible"
      @close="vipCheckClose"
    />
    <checkLessons
      :checkLessonsVisible="checkLessonsVisible"
      @close="checkLessonsClose"
    />
    <vipCreate
      :vipCreateVisible="vipCreateVisible"
      @close="vipCreateClose"
    />
    <vipShow
      :vipShowVisible="vipShowVisible"
      @close="vipShowClose"
    />
    <vipRecommenderList
      :vipRecommenderVisible="vipRecommenderVisible"
      @close="vipRecommenderClose"
    />
    <waivList
      :waivListVisible="waivListVisible"
      @close="waivListClose"
    />
    <vipMenteeOrder
      :vipMenteeOrderVisible="vipMenteeOrderVisible"
      @close="vipMenteeOrderClose"
      @toDetail="vipMenteeOrderDetail"
    />
    <VipDeadline
      v-if="vipDeadlineVisible"
      :vipDeadlineVisible="vipDeadlineVisible"
      @close="vipDeadlineClose"
    />
    <MenteeSign
      :menteeSignVisible="menteeSignVisible"
      :menteeId="menteeId"
      @close="menteeSignClose"
    />
    <dockingAssignment :dockingAssignmentVisible="dockingAssignmentVisible"  @close="dockingAssignmentClose" />
    <ApplySeasonNotSet
      :applySeasonNotSetVisible="applySeasonNotSetVisible"
      @close="applySeasonNotSetClose"
    />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import MenteeLesson from './components/MenteeLesson.vue'
import VipCheck from './components/VipCheck'
import checkLessons from './components/CheckLessons'
import vipCreate from './components/vipCreate'
import vipShow from './components/vipShow'
import vipRecommenderList from './components/vipRecommenderList'
import waivList from './components/waivList'
import vipMenteeOrder from './components/vipMenteeOrder'
import VipDeadline from './components/VipDeadline'
import menteeNew from './components/menteeNew.vue'
import MenteeSign from './components/MenteeSign.vue'
import ApplySeasonNotSet from './components/ApplySeasonNotSet.vue'
import dockingAssignment from '../docking_assignment/index.vue'

import { mapState } from 'vuex'

export default {
  name: 'mentee',
  mixins: [
    mixins
  ],
  components: { MenteeLesson, VipCheck, VipDeadline, menteeNew, checkLessons, vipCreate, MenteeSign, ApplySeasonNotSet, vipShow, vipRecommenderList, waivList, vipMenteeOrder, dockingAssignment },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      numberInitDetail: {
        lessonScheduleNum: 0,
        applySeasonNotSetNum: 0,
        mentorEntryTaskNum: 0
      },
      search: '',
      role: '',
      userId: '',
      groupId: '',
      loading: false,
      userList: [],
      lessonVisible: false,
      vipCheckVisible: false,
      checkLessonsVisible: false,
      vipCreateVisible: false,
      vipShowVisible: false,
      vipRecommenderVisible: false,
      waivListVisible: false,
      vipMenteeOrderVisible: false,
      vipDeadlineVisible: false,
      applySeasonNotSetVisible: false,
      dockingAssignmentVisible: false,
      // 分页
      pageNum: 1,
      pageSize: 0,
      total: 0,

      userInfo: '',
      options: [],
      menteeList: [],
      headimgurl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201807%2F30%2F20180730163717_gbqnc.thumb.700_0.jpg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639795149&t=2cb79c180d9c790ab77c25bdbfe47ac1',
      borderColor: ['#FF8C00', '#FF8C00', 'red', '#90EE90', '#00CED1'],

      loading1: false,
      loading2: false,
      menteeNewVisible: false,
      menteeSignVisible: false,
      menteeId: '',
      entranceOfferVisible: false,
      entranceOfferList: [],
      jobOfferVisible: false,
      jobOfferList: [],
      interviewVisible: false,
      interviewList: [],
      interviewMentorVisible: false,
      interviewMentorList: [],
      storyCountVisible: false,
      storyCountList: [],
      letterModifyVisible: false,
      letterModifyList: [],
      loading3: false,
      statisticsDate: [new Date('2022-01-01'), new Date()],
      statisticsList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '2021',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(new Date('2021-01-01'))
            end.setTime(new Date('2021-12-31'))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '2022',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(new Date('2022-01-01'))
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted () {
    this.sizeCount()
    this.init()
    this.numberInit()
  },
  methods: {
    sizeCount () {
      const maxH = document.body.clientHeight - 150
      const maxW = document.body.clientWidth - 430
      const hnum = Math.round(maxH / 288)
      const wnum = parseInt(maxW / 256)
      this.pageSize = Math.round(hnum * wnum)
    },
    async init () {
      this.userList = await this.getUserList('vip_mentee_all_mentee_data')
      this.userInfo = this.$store.state.role.userInfo
      this.role = this.userInfo.userId
      this.Topage(1)
      this.initPersional()
    },
    numberInit () {
      api.getVipNumInit().then(res => {
        this.numberInitDetail = res.data
      })
    },
    async Topage (i) {
      this.sizeCount()
      i == 1 ? this.pageNum = 1 : ''
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        groupId: this.groupId,
        sortCol: '',
        sort: ''
      }
      this.loading1 = true
      api.getMenteeListVip(params).then(res => {
        this.loading1 = false
        console.log(res)
        if (res.code == '200') {
          this.total = res.data.total
          this.menteeList = res.data.rows
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    async initPersional () {
      const params = {
        fromDate: this.statisticsDate[0],
        toDate: this.statisticsDate[1],
        userId: this.userInfo.userId
      }
      this.loading2 = true
      await api.getStatementPersonal(params).then(res => {
        console.log('res1', res)
        this.loading2 = false
        if (res.code == '200') {
          this.statisticsList =
          [{ name: '升学Offer', value: res.data.entranceOfferCount },
            { name: '求职Offer', value: res.data.jobOfferCount },
            { name: '面试', value: res.data.interviewCount },
            { name: '导师面试人数', value: res.data.interviewMentorCount },
            { name: '面经数', value: res.data.storyCount },
            { name: '文书修改量', value: res.data.lettrtModifyCount }]
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 下拉选单击选中
    clickNode ($event) {
      $event.target.parentElement.parentElement.firstElementChild.click()
    },
    // 下拉选选中时自动收起展开
    roleChange () {
      console.log(this.role)
      const tempObj = this.$refs.role.getCheckedNodes()[0]
      console.log(this.$refs.role.getCheckedNodes()[0])
      if (tempObj) {
        if (tempObj.hasChildren) {
          this.groupId = tempObj.value
          this.userId = ''
        } else {
          this.groupId = ''
          this.userId = tempObj.value
        }
      } else {
        this.groupId = ''
        this.userId = ''
      }
      this.$refs.role.dropDownVisible = false
    },
    handleClick (id) {
      console.log(id)
      this.$router.push({ name: 'UserDetail', query: { menteeId: id } })
    },
    vipMenteeOrderDetail (menteeId) {
      console.log(menteeId)
      this.$router.push({ name: 'UserDetail', query: { menteeId: menteeId } })
    },
    menteeNewDetail (id) {
      console.log(id)
      this.menteeNewVisible = false
      this.$router.push({ name: 'UserDetail', query: { menteeId: id } })
    },
    toOrder () {
      this.$router.push({ path: '/sales/order' })
    },
    format () {
      return '整体进度' + '\n' + '60%'
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    followUp () {
      this.$router.push({ name: 'VipFollow' })
    },
    lesson () {
      this.lessonVisible = true
    },
    lessonClose () {
      this.lessonVisible = false
    },
    checkVipTable () {
      this.vipCheckVisible = true
      console.log('查看vip各项统计')
    },
    checkVipDeadline () {
      this.vipDeadlineVisible = true
      console.log('查看vip到期学员统计')
    },
    vipCheckClose () {
      this.vipCheckVisible = false
    },
    vipDeadlineClose () {
      this.vipDeadlineVisible = false
    },
    showStatistics (i) {
      this.loading3 = true
      const params = {
        fromDate: this.statisticsDate[0],
        toDate: this.statisticsDate[1],
        userId: this.userInfo.userId
      }
      switch (i) {
        case 0:
          this.entranceOfferVisible = true
          api.getStatementPersonalEntranceOfferList(params).then(res => {
            console.log('VIP各项统计-升学Offer列表:', res)
            this.loading3 = false
            if (res.code == '200') {
              this.entranceOfferList = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.loading3 = false
            console.log(err)
          })
          break
        case 1:
          this.jobOfferVisible = true
          api.getStatementPersonalJobOfferList(params).then(res => {
            console.log('VIP各项统计-求职Offer列表:', res)
            this.loading3 = false
            if (res.code == '200') {
              this.jobOfferList = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.loading3 = false
            console.log(err)
          })
          break
        case 2:
          this.interviewVisible = true
          api.getStatementPersonalInterviewList(params).then(res => {
            console.log('VIP各项统计-面试列表:', res)
            this.loading3 = false
            if (res.code == '200') {
              this.interviewList = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.loading3 = false
            console.log(err)
          })
          break
        case 3:
          this.interviewMentorVisible = true
          api.getStatementPersonalInterviewMentorList(params).then(res => {
            console.log('VIP各项统计-导师面试:', res)
            this.loading3 = false
            if (res.code == '200') {
              this.interviewMentorList = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.loading3 = false
            console.log(err)
          })
          break
        case 4:
          this.storyCountVisible = true
          api.getStatementPersonalStoryList(params).then(res => {
            console.log('VIP各项统计-面经列表:', res)
            this.loading3 = false
            if (res.code == '200') {
              this.storyCountList = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.loading3 = false
            console.log(err)
          })
          break
        case 5:
          this.letterModifyVisible = true
          api.getStatementPersonalLetterModifyList(params).then(res => {
            console.log('VIP各项统计-文书修改:', res)
            this.loading3 = false
            if (res.code == '200') {
              this.letterModifyList = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.loading3 = false
            console.log(err)
          })
          break
      }
    },
    closeStatistics () {
      this.storyCountVisible = false
      this.entranceOfferVisible = false
      this.jobOfferVisible = false
      this.interviewVisible = false
      this.interviewMentorVisible = false
      this.letterModifyVisible = false
    },
    menteeNew () {
      console.log(1111)
      this.menteeNewVisible = true
    },
    menteeNewClose () {
      this.menteeNewVisible = false
    },
    checkLessons () {
      this.checkLessonsVisible = true
    },
    checkLessonsClose () {
      this.checkLessonsVisible = false
    },
    vipCreate () {
      this.vipCreateVisible = true
    },
    vipShow () {
      this.vipShowVisible = true
    },
    vipShowClose () {
      this.vipShowVisible = false
    },
    vipRecommenderShow () {
      this.vipRecommenderVisible = true
    },
    vipRecommenderClose () {
      this.vipRecommenderVisible = false
    },
    waivListShow () {
      this.waivListVisible = true
    },
    waivListClose () {
      this.waivListVisible = false
    },
    vipMenteeOrder () {
      this.vipMenteeOrderVisible = true
    },
    vipMenteeOrderClose () {
      this.vipMenteeOrderVisible = false
    },
    vipCreateClose () {
      this.vipCreateVisible = false
    },
    applySeasonNotSet () {
      this.applySeasonNotSetVisible = true
    },
    applySeasonNotSetClose () {
      this.applySeasonNotSetVisible = false
    },
    applySeason () {
      this.$router.push({ name: 'ApplySeasonProcess' })
    },
    sign () {
      if (!this.search) {
        this.$message('请输入签约人微信ID')
        return
      }
      this.loading = true
      api.getMenteeDetailByWxId(this.search).then(res => {
        this.loading = false
        console.log(res.data)
        if (!res.data) {
          this.$message('请输入正确的学员微信ID')
          return
        }
        if (res.data.sourceFrom) {
          this.menteeId = res.data.menteeId
          this.menteeSignVisible = true
        } else {
          this.$message({
            type: 'error',
            message: '当前渠道来源为空，无法签约，请销售助理补充完整渠道来源信息后重试'
          })
        }
      })
    },
    menteeSignClose () {
      this.menteeSignVisible = false
      this.menteeId = ''
    },
    dockingAssignmentShow () {
      this.dockingAssignmentVisible = true
    },
    dockingAssignmentClose () {
      this.dockingAssignmentVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
$background-color:#F4F4F4;
.search_page{
  padding-right:340px;
  background-color: rgba($color: #000000, $alpha: 0);
  display: flex;
  justify-content: space-between;
  .search{
    display: inline-block;
  }
}
.user_container{
  display: flex;
  .user_card_list{
    flex:1;
    height:100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .user_card_item{
      .tag_block{
        width: 220px;
        flex-wrap: wrap;
        z-index: 1;
      }
      position: relative;
      margin-bottom:20px;
      margin-right:20px;
      width:192px;
      height:240px;
      background: #FFF;
      border-radius: 8px;
      padding:24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      .user_card_info_pic{
        position: relative;
        .sex_icon{
          position: absolute;
          bottom:5px;
          right:0;
          width:24px;
          height:24px;
          font-size:16px;
          color:#FFF;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .sex_icon_mars{background-color: #8CC4FC;}
        .sex_icon_venus{background-color: #FFB6C1;}
      }
      .user_card_info_name{
        font-size:20px;
        font-weight:700;
      }
      .user_card_info_progress{
        margin: 0 auto;
        margin-top:20px;
        width:200px;
        ::v-deep .el-progress-bar{
        }
      }
    }
    .user_card_item_border{
      position:absolute;
      width:216px;
      height:268px;
      border: 2px solid $background-color;
      border-radius: 8px;
    }
    .user_card_item:hover .user_card_item_border{
      border: 2px solid #FF8C00;
    }
  }
  .user_statistics_bg{
    margin-right:-20px;
    width:320px;
  }
}
.user_statistics{
    overflow: auto;
  position: fixed;
  top:0px;
  right:20px;
  width:300px;
  padding:20px;
  height:calc(100%);
  background: #FFF;
  .user_statistics_header{
    font-size:20px;
    font-weight:700;
    margin-bottom:30px;
  }
  .user_statistics_body{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .user_statistics_list{
      margin-top:50px;
      width:100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .user_statistics_item{
        margin-bottom:20px;
        padding:10px;
        width:130px;
        height:80px;
        background: $background-color;
        border-radius: 10px;
        box-sizing: border-box;
        .user_statistics_item_title{
          font-size:13px;
          margin-bottom:5px;
          color:#888
        }
        .user_statistics_item_value_show{
          text-decoration: underline;
          cursor: pointer;
          height:30px;
          line-height:30px;
          padding-left:10px;
          font-size:32px;
          font-weight:700;
          border-left: 5px solid #FF8C00
        }
        .user_statistics_item_value{
          height:30px;
          line-height:30px;
          padding-left:10px;
          font-size:32px;
          font-weight:700;
          border-left: 5px solid #FF8C00
        }
      }
    }
    .user_statistics_btn{
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>
