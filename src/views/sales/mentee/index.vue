<!--
 * @Author: kaan
 * @Date: 2022-03-02 14:00:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-07 09:20:55
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-select
            class="mr10 mb10"
            filterable
            style="width:100px"
            v-model="userId"
            placeholder="请选择导流微信管理人"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-input
            v-if="roleInfo.includes(`client_tracking_search`)"
            class="mr10 mb10"
            style="width:200px"
            v-model="search"
            clearable
            placeholder="支持姓名、微信名、微信ID、家长微信ID"
          ></el-input>
          <el-select
            style="width:100px"
            class="mr10 mb10"
            filterable
            clearable
            v-model="signStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemName:'ALL',itemValue:''},{itemName:'未签约',itemValue:'0'},{itemName:'已签约',itemValue:'1'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-select
            style="width:100px"
            class="mr10 mb10"
            clearable
            filterable
            v-model="countryValue"
            placeholder="国家"
          >
            <el-option
              v-for="item in country"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-select
            style="width:100px"
            class="mr10 mb10"
            filterable
            clearable
            v-model="highSchoolValue"
            placeholder="高中"
          >
            <el-option
              v-for="item in highSchool"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>

          <el-select
            style="width:100px"
            class="mr10 mb10"
            size="mini"
            filterable
            v-model="schoolValue"
            clearable
            placeholder="学校"
          >
            <el-option
              v-for="item in school"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>

          <el-select
            style="width:100px"
            class="mr10 mb10"
            size="mini"
            filterable
            v-model="cooperatorType"
            clearable
            placeholder="合作商渠道"
          >
            <el-option
              v-for="item in cooperatorTypeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>

          <el-date-picker
            class="mr10 mb10"
            style="width:100px"
            v-model="finishYearValue"
            value-format="yyyy"
            type="year"
            placeholder="选择年">
          </el-date-picker>

          <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`client_tracking_search`)"
            class=" mb10"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-edit"
            v-if="roleInfo.includes(`client_tracking_entry`)"
            class=" mb10"
            plain
            @click="menteeInput"
          >录入</el-button>
          <el-button
            icon="el-icon-printer"
            v-if="roleInfo.includes(`client_tracking_outFile`)"
            class=" mb10"
            plain
            @click="exportFile('table')"
          >导出</el-button>
          <el-button
            icon="el-icon-printer"
            v-if="roleInfo.includes(`client_tracking_pretalkShow`)"
            class=" mb10"
            plain
            @click="pretalkShow()"
          >筛选Pretalk</el-button>
          <!-- <el-badge :value="pretalkFeedBack.length" class="item"> -->
            <el-button @click="toPretalk" type="primary">Pretalk评价</el-button>
            <el-button @click="toSourceFormfeedback" type="primary">渠道评价</el-button>
          <!-- </el-badge> -->
        </div>
        <pagination
          v-if="roleInfo.includes(`client_tracking_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <hot-table :settings="settings" ref="table" licenseKey="non-commercial-and-evaluation"></hot-table>
    </div>

    <MenteeInput
      v-if="menteeInputVisible"
      :menteeInputVisible="menteeInputVisible"
      @detail="toMenteeInfo"
      @close="menteeInputClose"
      @submit="menteeInputSubmit"
    />
    <MenteeInfo
      :menteeInfoVisible="menteeInfoVisible"
      :menteeInfo="menteeInfo"
      @close="menteeInfoClose"
    />
    <el-dialog  width="600px" :visible.sync="feedBackVisible">
      <div>
        <div class="mb10" v-if="pretalkFeedBack.length > 0">
          您有待完成的【Pretalk评价】
          <el-button type="success" @click="toPretalk" >立即前往</el-button>
        </div>
        <div v-if="sourceFormfeedBack.length > 0">
          您有待完成的【渠道评价】
          <el-button type="success" @click="toSourceFormfeedback" >立即前往</el-button>
        </div>
      </div>
    </el-dialog>
    <pretalkFeedBackBlock :pretalkFeedBackVisible="pretalkFeedBackVisible"  @close="pretalkFeedBackClose" />
    <sourceFormfeedback :toSourceFormfeedbackVisible="toSourceFormfeedbackVisible"  @close="toSourceFormfeedbackClose" />
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant.js'
import apiUser from '@/api/user.js'
import Handsontable from 'handsontable'
import util from '@/libs/util'
import { renderShortText } from '@/libs/tableRender.js'
import MenteeInput from './components/MenteeInput'
import MenteeInfo from './components/MenteeInfo'
import pretalkFeedBackBlock from './components/pretalkFeedBack'
import sourceFormfeedback from './components/sourceFormfeedback'

import { mapState } from 'vuex'

const roleInfo = util.sessions.get('roleInfo')
const hotbutton = function (instance, td, row) {
  Handsontable.dom.empty(td)
  let innerHTML = ''
  innerHTML += `<button class='hot-button mr10' onclick='toDetailMentee(${row})'><i class="el-icon-edit" title="详情"></i><span>详情</span></button>`
  td.innerHTML = innerHTML
  return td
}
const renderEffective = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  if (roleInfo.includes('client_tracking_changeStatus')) {
    if (value == '0') {
      td.innerHTML = '否'
    } else {
      td.innerHTML = `是 <button class='hot-button mr10' onclick='changeMenteeStatus(${row})' title="修改咨询状态为无效"><i class="el-icon-edit"></i><span></span></button>`
    }
  } else {
    if (value == '0') {
      td.innerHTML = '否'
    } else {
      td.innerHTML = '是'
    }
  }
  return td
}
export default {
  mixins: [mixins],
  name: 'SalesMentee',
  components: { MenteeInput, MenteeInfo, pretalkFeedBackBlock, sourceFormfeedback },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    return {
      loading: false,
      // 搜索条件
      users: [],
      country: [],
      school: [],
      highSchool: [],
      pretalkFeedBack: [],
      sourceFormfeedBack: [],
      cooperatorTypeList: [],
      userId: '',
      search: '',
      signStatus: '',
      countryValue: '',
      highSchoolValue: '',
      schoolValue: '',
      cooperatorType: '',
      finishYearValue: '',
      // 分页
      sort: '',
      sortCol: '',
      pageNum: 1,
      pageSize: 50,
      total: 0,
      feedBackVisible: false,
      menteeInputVisible: false,
      pretalkFeedBackVisible: false,
      toSourceFormfeedbackVisible: false,
      settingsAPIData: [],
      settings: {
        height: document.documentElement.clientHeight - 200,
        fixedColumnsLeft: 2,
        data: [],
        stretchH: 'all',
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '操作',
          '微信名',
          '微信ID',
          '学员名',
          '身份',
          '家长一微信ID',
          '家长二微信ID',
          '电话',
          '学校（高中）',
          '学校（大学）',
          '学校邮箱',
          '学历',
          '毕业年份',
          // `专业`,
          '国家',
          '是否有效咨询',
          // `意向`,
          '咨询方向',
          '推荐项目',
          '推荐实习数',
          '是否签约',
          '签约日期',
          '分配顾问',
          '分配顾问日期',
          // `顾问是否24小时内回复`,
          '来源',
          '推荐人姓名',
          '是否VIP同事推荐',
          'VIP同事推荐人',
          '拉群日期',
          '最近跟进日期',
          '导流微信号',
          '特殊性质（家长、讲座等）',
          '咨询进度',
          '创建人',
          '创建时间',
          '最近修改人',
          '最近操作时间'
        ],
        readOnly: true,
        columns: [
          {
            data: 'hotbutton',
            // width: 160,
            // width: 140,
            renderer: hotbutton
          },
          {
            data: 'wxName',
            // title: "微信名",
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'wxId',
            width: 50,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "微信ID",
          },
          {
            data: 'realName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "学员名",
          },
          {
            data: 'menteeType',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'parentWx1'
          },
          {
            data: 'parentWx2'
          },
          {
            data: 'telephone',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "学校",
          },
          {
            data: 'highSchoolName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "学校",
          },

          {
            data: 'schoolName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "学校",
          },
          {
            data: 'email',
            width: 60,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "学校邮箱",
          },
          {
            data: 'degreeName'
            // title: "学历",
          },
          {
            data: 'finishYear'
            // title: "毕业年份",
          },
          // {
          //   data: "majorName",
          //   width: 100,
          //   wordWrap: false,
          //   className: "short-text",
          //   renderer: renderShortText
          //   // title: "专业",
          // },
          {
            data: 'countryName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "国家",
          },
          {
            data: 'effectiveConsulting',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderEffective
            // title: "国家",
          },
          // {
          //   data: "intention",
          //   width: 100,
          //   wordWrap: false,
          //   className: "short-text",
          //   renderer: renderShortText
          //   // title: "意向",
          // },
          {
            data: 'askFor',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "咨询方向",
          },
          {
            data: 'recommendProgramName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'recommendInternshipNum',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'signStatusName'
            // title: "是否签约",
          },
          {
            data: 'signDate'
            // title: "签约日期",
          },

          {
            data: 'counselorName'
            // title: "分配顾问",
          },
          {
            data: 'counselorDate'
            // title: "分配顾问日期",
          },
          // {
          //   data: "counselorReplayName"
          //   // title: "顾问是否24小时内回复",
          // },
          {
            data: 'sourceFromName'
            // title: "来源",
          },
          {
            data: 'recommender',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "推荐人姓名",
          },
          {
            data: 'vipRecommendStatusName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },

          {
            data: 'vipRecommenderName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'inGroupDate'
            // title: "拉群日期",
          },
          {
            data: 'followUpDate'
            // title: "最近跟进日期",
          },
          {
            data: 'sourceWx',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "导流微信号",
          },
          {
            data: 'specialNature',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "特殊性质（家长、讲座等）",
          },

          {
            data: 'note',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "咨询进度",
          },
          {
            data: 'creater'
            // title: "创建人",
          },
          {
            data: 'createTime'
            // title: "创建时间",
          },
          {
            data: 'updater'
            // title: "最近修改人",
          },
          {
            data: 'updateTime'
            // title: "最近操作时间",
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.pageNum = 1
            this.Topage(this.pageNum)
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data
            this.sort = newVal[0].sortOrder
            this.pageNum = 1
            if (this.sortCol === 'hotbutton') return
            this.Topage(this.pageNum)
          }
        }
      },

      menteeInfoVisible: false,
      menteeInfo: {}
    }
  },
  mounted () {
    this.pageInit()
    this.feedBckInit()
  },
  methods: {
    async pageInit () {
      const userInfo = this.userInfo
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
        this.userId = 'ALL'
        this.users = users
      })
      this.cooperatorTypeList = await this.getDictionary('cooperator_type')
      this.cooperatorTypeList.unshift({
        itemName: '全部合作商',
        itemValue: 'ALL'
      })
      this.country = await this.getDictionary('country')
      this.school = await this.getSchool('school')
      this.highSchool = await this.getSchool('highSchool')
      this.Topage(1)
      window.toDetailMentee = row => this.toDetailMentee(row)
      window.changeMenteeStatus = row => this.changeMenteeStatus(row)
    },
    feedBckInit () {
      this.feedBackVisible = false
      const data = {
        userId: '',
        feedbackStatus: 0
      }
      let a = 0
      api.pretalk_feedback(data).then(res => {
        console.log(res.data, 'pretalkFeedBack')
        this.pretalkFeedBack = res.data
        if (res.data.length > 0) {
          a++
        }
        api.sourceForm_feedback(data).then(res => {
          console.log(res.data, 'sourceFormfeedBack')
          this.sourceFormfeedBack = res.data
          if (res.data.length > 0) {
            a++
          }
          if (a > 0) {
            this.feedBackVisible = true
          }
        })
      })
    },
    toPretalk () {
      this.pretalkFeedBackVisible = true
      this.feedBackVisible = false
    },
    pretalkFeedBackClose () {
      this.pretalkFeedBackVisible = false
    },
    toSourceFormfeedback () {
      this.toSourceFormfeedbackVisible = true
      this.feedBackVisible = false
    },
    toSourceFormfeedbackClose () {
      this.toSourceFormfeedbackVisible = false
    },
    /**
     * @description: 列表初始化
     * @param {*} i
     * @return {*}
     */
    Topage (i) {
      i == 1 ? this.pageNum = 1 : ''
      const data = {
        sort: this.sort,
        sortCol: this.sortCol,
        search: this.search,
        userId: this.userId,
        signStatus: this.signStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        pageType: 'sales',
        school: this.schoolValue,
        cooperatorType: this.cooperatorType,
        highSchool: this.highSchoolValue,
        country: this.countryValue,
        finishYear: this.finishYearValue
      }
      this.settings.data = []
      for (let i = 0; i < this.pageSize; i++) {
        this.settings.data.push({})
      }
      this.loading = true
      api.mentee_list_sales(data).then(({ data }) => {
        this.loading = false
        console.log(data)
        this.pageNum = data.page
        const rows = data.rows
        this.settingsAPIData = JSON.parse(JSON.stringify(data.rows))
        rows.forEach(v => {
          v.major = v.major ? v.major.split(',') : []
        })
        this.settings.data = rows
        this.total = data.total
      })
    },
    /**
     * @description: 学员录入
     * @param {*}
     * @return {*}
     */
    menteeInput () {
      this.menteeInputVisible = true
    },
    menteeInputClose () {
      this.menteeInputVisible = false
    },
    menteeInputSubmit () {
      this.menteeInputVisible = false
      this.Topage(1)
    },
    toMenteeInfo (data) {
      this.menteeInfo = data
      this.menteeInfoVisible = true
    },
    exportFile () {},
    /**
     * @description: table详情
     * @param {*} i
     * @return {*}
     */
    toDetailMentee (row) {
      this.menteeInfo = this.settingsAPIData[row]
      this.menteeInfoVisible = true
    },
    menteeInfoClose () {
      this.menteeInfoVisible = false
    },
    /**
     * @description: table中修改有效咨询
     * @param {*} row
     * @return {*}
     */
    changeMenteeStatus (row) {
      const data = this.settings.data[row]
      console.log(row, data)
      const pastTime = new Date(data.counselorDate).getTime()
      const nowTime = new Date().getTime()
      if (pastTime + 7 * 24 * 3600 * 1000 < nowTime) {
        this.$message({
          message: '距离分配顾问已超过7天，无法修改咨询状态',
          type: 'warning'
        })
        return false
      }
      // 当前状态是无效咨询时按钮点击提示
      if (this.settings.data[row].effectiveConsulting == '0') {
        this.$message({
          message: '此学员咨询状态已经为无效咨询，无法修改',
          type: 'warning'
        })
        return false
      }
      console.log(pastTime, nowTime)
      this.$confirm('是否确认修改此学员为无效咨询', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          menteeId: this.settings.data[row].menteeId
        }
        api.changeToNoeffective(this.settings.data[row].menteeId, data).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '修改咨询有效性成功！'
          })
          this.Topage(1)
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    pretalkShow () {
      this.$router.push({ name: 'SalesPretalk' })
    }
  }
}
</script>
<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column
}

</style>
