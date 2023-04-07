<!--
 * @Author: kaan
 * @Date: 2022-01-24 17:29:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-12 10:29:12
 * @Version:
 * @Description:
-->

<template>
  <div class="mentor">
    <!-- <el-button v-copy="11111111">点击复制</el-button> -->
    <div class="search_page mentor_search">
      <div class="search">
        <el-select
          v-model="mentorStatus"
          class="mr10 mb10"
          size="mini"
          filterable
          clearable
          v-if="roleInfo.includes(`mentor_select`)"
          placeholder="导师状态"
          :style="{width:'155px'}"
        >
          <!-- @change="Topage(1)" -->
          <el-option
            v-for="item in [{itemName:'禁用',itemValue:'1'},{itemName:'启用',itemValue:'0'},]"
            :key="item.itemName"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          v-model="mentorBusiness"
          class="mr10 mb10"
          size="mini"
          @change="high"
          filterable
          clearable
          v-if="roleInfo.includes(`mentor_select`)"
          placeholder="业务类型"
          :style="{width:'155px'}"
        >
          <el-option
            v-for="item in mentorBusinessList"
            :key="item.itemName"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          class="mr10 mb10"
          :style="{width:'155px'}"
          v-model="sex"
          size="mini"
          clearable
          filterable
          placeholder="性别"
        >
          <el-option
            v-for="item in sexList"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
        v-model="school"
        class="mr10 mb10 "
        size="mini"
        filterable
        clearable
        placeholder="学校"
        :style="{width:'155px'}"
        >
        <el-option
          v-for="item in schoolList"
          :key="item.schoolId"
          :label="item.allName"
          :value="item.schoolId"
        ></el-option>
        </el-select>
        <el-select
          :style="{width:'155px'}"
          size="mini"
          class="mr10 mb10 "
          v-model="majors"
          filterable
          multiple
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in majorList"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          v-model="careerTrack"
          class="mr10 mb10"
          size="mini"
          filterable
          multiple
          collapse-tags
          @change="high"
          clearable
          v-if="roleInfo.includes(`mentor_select`) && mentorBusiness=='businessCareer'"
          placeholder="求职--Track"
          :style="{width:'320px'}"
        >
          <!-- @change="Topage(1)" -->
          <el-option
            v-for="(item,i) in trackList"
            :key="i"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          v-model="careerCountry"
          class="mr10 mb10"
          size="mini"
          filterable
          @change="high"
          multiple
          collapse-tags
          clearable
          placeholder="求职--country"
          v-if="roleInfo.includes(`mentor_select`) && mentorBusiness=='businessCareer'"
          :style="{width:'300px'}"
        >
          <!-- @change="Topage(1)" -->
          <el-option
            v-for="(item,i) in locationList"
            :key="i"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          v-model="gpMajor"
          class="mr10 mb10"
          size="mini"
          filterable
          multiple
          collapse-tags
          @change="high"
          clearable
          v-if="roleInfo.includes(`mentor_select`) && mentorBusiness=='businessGp'"
          placeholder="升学--Track"
          :style="{width:'320px'}"
        >
          <!-- @change="Topage(1)" -->
          <el-option
            v-for="(item,i) in gpList"
            :key="i"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-select
          v-model="gpCountry"
          class="mr10 mb10"
          size="mini"
          filterable
          multiple
          collapse-tags
          clearable
          @change="high"
          placeholder="升学--country"
          v-if="roleInfo.includes(`mentor_select`) && mentorBusiness=='businessGp'"
          :style="{width:'300px'}"
        >
          <!-- @change="Topage(1)" -->
          <el-option
            v-for="(item,i) in locationList"
            :key="i"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-cascader
          class="mr10 "
          size="mini"
           collapse-tags
          filterable
          multiple
          clearable
          @change="high"
          v-if="roleInfo.includes(`mentor_select`) && mentorBusiness=='businessTutoring'"
          placeholder="课业---Track"
          :style="{width:'320px'}"
          expand-trigger="hover"
          :options="tutoringSubjectCascaderDic"
          v-model="tutoringSubject"
          :props="props"
        ></el-cascader>
        <el-select
          v-model="tutoringCountry"
          class="mr10 mb10"
          size="mini"
          filterable
          collapse-tags
          multiple
          clearable
          placeholder="课业---country"
          v-if="roleInfo.includes(`mentor_select`) && mentorBusiness=='businessTutoring'"
          :style="{width:'300px'}"
        >
          <el-option
            v-for="(item,i) in locationList"
            :key="i"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-button
          icon="el-icon-search"
          v-if="roleInfo.includes(`mentor_search`)"
          class=""
          size="mini"
          plain
          @click="Topage(1)"
        >GO</el-button>
        <el-button
          icon="el-icon-download"
          v-if="roleInfo.includes(`mentor_exportExcel`)"
          class=""
          size="mini"
          plain
          @click="exportFile()"
        >导出</el-button>
      </div>
      <pagination
        v-if="roleInfo.includes(`mentor_page`)"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagination>
    </div>
    <hot-table v-loading="loading" :settings="settings" licenseKey="non-commercial-and-evaluation" ref="table"></hot-table>

  </div>
</template>

<script>
import Handsontable from 'handsontable'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import { downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import { renderShortText } from '@/libs/tableRender.js'
import util from '@/libs/util.js'
// 自动改变handsontable高度使其不出现底部滚动条 需要同一表格上部class为mentor_search
function getClientHeight () {
  var clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  }
  return clientHeight
}

function autoHight () {
  console.log(11111111111)
  const a = document.getElementsByClassName('mentor_search')[0]
  console.log(a)
  if (a) {
    const b = a.offsetHeight
    const tableHeight = getClientHeight() - 120 - b * 1
    const e = document.getElementsByClassName('handsontable')[0]
    e.style.height = tableHeight + 'px'
  }
}

export const renderName = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  const escaped = Handsontable.helper.stringify(value)
  Handsontable.renderers.DropdownRenderer.apply(this, arguments)
  td.innerHTML = `<span title="${escaped}" class="render_name" onclick='mentorEdit(${row})'>${escaped}</span>`
  return td
}

// 相对路径
const rederPath = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  return (td.innerHTML = value
    ? `<div class='hot-button' onclick='assistantdownload("${value}")'><i class="el-icon-download"></i><span>预览</span></div>`
    : '')
}
// 性别
const renderSex = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  if (value == 1) {
    td.innerHTML = '男'
  } else if (value == 2) {
    td.innerHTML = '女'
  }
  return td
}
const renderCompensationFixed = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td)
  if (value == 0) {
    td.innerHTML = '阶梯'
  } else {
    td.innerHTML = '固定'
  }
  return td
}
export default {
  components: { },
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      search: '',
      sort: '',
      sortCol: '',
      pageSize: 50,
      pageNum: 1,
      total: 0,
      canApplyCount: 0,
      canApplyCount2: 0,
      mentorBusinessList: [
        { itemName: '求职', itemValue: 'businessCareer' },
        { itemName: '升学', itemValue: 'businessGp' },
        { itemName: '口语', itemValue: 'businessOral' },
        { itemName: 'CFA', itemValue: 'businessCfa' },
        { itemName: '理财', itemValue: 'businessFinance' },
        { itemName: '课业辅导', itemValue: 'businessTutoring' },
        { itemName: '文书修改', itemValue: 'businessLetterModify' },
        { itemName: '心理学', itemValue: 'businessPsychology' },
        { itemName: '人力资源', itemValue: 'businessHumanResource' },
      ],
      settingsAPIData: [],
      settings: {
        height: document.documentElement.clientHeight - 150,
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        columnSorting: true,
        fillHandle: false,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          'Mentor Name',
          '导师昵称',
          '入职年份',
          '业务类型',
          '求职-佣金',
          '导师专业',
          '求职-Track',
          '求职-Country',
          '求职-Profile',
          '升学-专业',
          '升学-佣金',
          '升学-Country',
          '升学-Profile',
          '口语-佣金',
          '口语-Profile',
          '心理学-佣金',
          '心理学-Profile',
          '人力资源-佣金',
          '人力资源-Profile',
          'CFA-Profile',
          '理财-佣金',
          '理财-Profile',
          '课业辅导-学科',
          '课业辅导-佣金',
          '课业辅导-Country',
          '课业辅导-Profile',
          '文书修改-中文',
          '文书修改-英文',
          '文书修改-CL',
          '文书修改-备注',
          '面试人',
          '推荐导师',
          'School（undergraduate）',
          'School（graduate）',
          'School（phd）',
          'Company',
          'Location',
          'Division',
          'Year',
          'WeChat ID',
          'Email',
          'Gender',
          '职务状态',
          '本公司入职时间',
          '本公司离职时间',
          '导师状态',
          '创建人',
          '创建时间',
          '最近修改人',
          '最近操作时间'
        ],
        readOnly: true,
        columns: [
          // Mentor Name
          {
            data: 'mentorName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderName
          },
          // 导师昵称
          {
            data: 'nickName',
            wordWrap: false,
            className: 'short-text',
            render: renderShortText
          },
          // 入职年份
          {
            data: 'companyEntryDate',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 业务类型
          {
            data: 'mentorBusiness',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 求职-佣金
          {
            data: 'compensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'majorName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 求职-Track
          {
            data: 'trackName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 求职-Country
          {
            data: 'countryName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 求职-Profile
          {
            data: 'specialties',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // 升学-专业
          {
            data: 'gpMajor',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 升学-佣金
          {
            data: 'gpCompensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 升学-Country
          {
            data: 'gpCountryName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 升学-Profile
          {
            data: 'gpProfile',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // 口语-佣金
          {
            data: 'oralCompensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 口语-Profile
          {
            data: 'oralProfile',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // 心理学-佣金
          {
            data: 'psychologyCompensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 心理学-Profile
          {
            data: 'psychologyProfile',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // 热力资源-佣金
          {
            data: 'humanResourceCompensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 热力资源-Profile
          {
            data: 'humanResourceProfile',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // CFA-Profile
          {
            data: 'cfaProfile',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // 理财-佣金
          {
            data: 'financeCompensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 理财-Profile
          {
            data: 'financeProfile',
            wordWrap: false,
            width: 100,
            className: 'short-text',
            renderer: renderShortText
          },
          // 课业辅导-学科
          {
            data: 'tutoringSubject',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 课业辅导-佣金
          {
            data: 'tutoringCompensationText',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 课业辅导-Country
          {
            data: 'tutoringCountryName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 课业辅导-Profile
          {
            data: 'tutoringProfile',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 文书修改中文
          {
            data: 'letterModifyCompensationResumeZhNew',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 文书修改英文
          {
            data: 'letterModifyCompensationResumeEnNew',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 文书修改cl
          {
            data: 'letterModifyCompensationCoverLetterNew',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 文书修改备注
          {
            data: 'letterModifyProfile',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 面试人
          {
            data: 'interviewByName'
          },
          // 推荐导师
          {
            data: 'referrerName'
          },
          // School（undergraduate）
          {
            data: 'undergraduateSchoolName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // School（graduate）
          {
            data: 'graduateSchoolName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // School（phd）
          {
            data: 'phdSchoolName',
            width: 100,
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // Company
          {
            data: 'companyName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // Location
          {
            data: 'locationName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // Division
          {
            data: 'divisionName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // Year
          {
            data: 'companyEntryDate',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // WeChat ID
          {
            data: 'wxId',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // Email
          {
            data: 'email',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // Gender
          {
            data: 'sex',
            wordWrap: false,
            className: 'short-text',
            renderer: renderSex
          },
          // 职务状态
          {
            data: 'entryStatus',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 本公司入职时间
          {
            data: 'entryDate',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 本公司离职时间
          {
            data: 'leaveDate',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 导师状态
          {
            data: 'mentorStatus',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          // 创建人
          {
            data: 'createByName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
          },
          {
            data: 'createTime',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "创建时间",
          },
          {
            data: 'updateByName',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "最近修改人",
          },
          {
            data: 'updateTime',
            wordWrap: false,
            className: 'short-text',
            renderer: renderShortText
            // title: "最近操作时间",
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = ''
            this.sortCol = ''
            this.Topage(this.pageNum)
          } else {
            console.log(this.settings.columns[newVal[0].column])
            if (this.settings.columns[newVal[0].column].data == 'letterModifyCompensationResumeZhNew') {
              this.sortCol = 'letterModifyCompensationResumeZh'
            } else if (this.settings.columns[newVal[0].column].data == 'letterModifyCompensationResumeEnNew') {
              this.sortCol = 'letterModifyCompensationResumeEn'
            } else if (this.settings.columns[newVal[0].column].data == 'letterModifyCompensationCoverLetterNew') {
              this.sortCol = 'letterModifyCompensationCoverLetter'
            } else {
              this.sortCol = this.settings.columns[newVal[0].column].data
            }
            this.sort = newVal[0].sortOrder
            this.settings.data = []
            // 解决默认排序事件导致的数据闪屏
            for (let i = 0; i < this.pageSize; i++) {
              this.settings.data.push({})
            }
            this.Topage(this.pageNum)
          }
        }
      },
      // 弹框，导师数据
      mentorData: {
        division: [],
        company: [],
        location: [],
        country: [],
        wxId: null,
        email: null,
        linkedinPath: null
      },
      // 支付账户弹框
      payWayVisible: false,
      // 学生列表弹框
      studentsListVisible: false,
      // 酬金列表弹框
      rewardListVisible: false,
      // 导师编辑弹框
      mentorEditVisible: false,
      // 导师课时统计
      lessonHoursVisible: false,
      // 文档
      fileVisible: false,
      // 字典编辑
      bonusVisible: false,
      dicEditVisible: false,
      // 导师推荐情况
      mentorRecommendVisible: false,
      bonusRecommendVisible: false,
      dicProject: '',
      canEdit: false,
      schoolList: [],
      sexList: [],
      majorList: [],
      sex: '',
      school: '',
      majors: [],
      country: [],
      trackList: [],
      locationList: [],
      careerTrack: [],
      careerCountry: [],
      gpList: [],
      gpMajor: [],
      gpCountry: [],
      tutoringSubjectCascaderDic: [],
      props: { multiple: true },
      tutoringSubject: [],
      tutoringCountry: [],
      mentorStatus: '',
      mentorBusiness: '',

      loading: false
    }
  },
  // 根据学校联动国家
  watch: {},
  created () {},
  mounted () {
    window.toPayWay = row => this.toPayWay(row)
    window.toStudentsList = row => this.toStudentsList(row)
    window.toRewardList = row => this.toRewardList(row)
    window.toLessonHours = row => this.toLessonHours(row)
    window.toFile = row => this.toFile(row)
    window.toBonus = row => this.toBonus(row)
    window.toConnect = row => this.toConnect(row)
    window.mentorEdit = row => this.mentorEdit(row)
    window.assistantdownload = path => this.assistantdownload(path)
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.trackList = await this.getDictionary('track')
      this.locationList = await this.getDictionary('country')
      this.gpList = await this.getDictionary('gp_major')
      this.sexList = await this.getDictionary('sex')
      this.schoolList = await this.getSchool('school')
      this.majorList = await this.getDictionary('gp_major')
      apiDic.getCascaderDic('tutoringSubject').then(res => {
        this.tutoringSubjectCascaderDic = res.data
      })
    },
    Topage () {
      this.loading = true
      const data = {
        sort: this.sort,
        sortCol: this.sortCol,
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        careerTrack: this.careerTrack.join(','),
        careerCountry: this.careerCountry.join(','),
        gpMajor: this.gpMajor.join(','),
        gpCountry: this.gpCountry.join(','),
        tutoringSubject: this.tutoringSubject.map((item, index) => { return item[1] }).join(','),
        tutoringCountry: this.tutoringCountry.join(','),
        mentorStatus: this.mentorStatus,
        mentorBusiness: this.mentorBusiness,
        sex: this.sex,
        school: this.school,
        majors: this.majors.join(',')
      }
      console.log('获取导师列表的参数', data)
      api.getMentorList2(data).then(({ data }) => {
        console.log('导师列表数据', data)
        // return false;
        data.rows.forEach(v => {
          // v.compensation =
          //   v.compensationType == "cny"
          //     ? "￥" + (v.compensation || 0)
          //     : "＄" + (v.compensation || 0);
          function dealCompensation (businessType, compensationType, compensation, meritCompensation, compensationFixed, ruleName) {
            let compensationText = ''
            if (businessType != 1) {
              return compensationText
            }
            if (compensationFixed == 0) {
              // 阶梯
              compensationText = `阶梯-${ruleName}`
            } else {
              // 固定
              compensationText = `固定-${compensationType == 'cny' ? '￥' : '＄'}${compensation}+${meritCompensation}`
            }
            return compensationText
          }
          v.compensationText = dealCompensation(v.businessCareer, v.compensationType, v.compensation, v.meritCompensation, v.compensationFixed, v.ruleName)
          v.gpCompensationText = dealCompensation(v.businessGp, v.gpCompensationType, v.gpCompensation, v.gpMeritCompensation)
          v.oralCompensationText = dealCompensation(v.businessOral, v.oralCompensationType, v.oralCompensation, v.oralMeritCompensation)
          v.psychologyCompensationText = dealCompensation(v.businessPsychology, v.psychologyCompensationType, v.psychologyCompensation, v.psychologyMeritCompensation)
          v.humanResourceCompensationText = dealCompensation(v.businessHumanResource, v.humanResourceCompensationType, v.humanResourceCompensation, v.humanResourceMeritCompensation)
          v.financeCompensationText = dealCompensation(v.businessFinance, v.financeCompensationType, v.financeCompensation, v.financeMeritCompensation)
          v.tutoringCompensationText = dealCompensation(v.businessTutoring, v.tutoringCompensationType, v.tutoringCompensation, v.tutoringMeritCompensation)
          v.compensationType = v.compensationType == 'cny' ? '￥人民币' : '＄美元'
          v.gpCompensationType = v.gpCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.oralCompensationType = v.oralCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.psychologyCompensationType = v.psychologyCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.humanResourceCompensationType = v.humanResourceCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.financeCompensationType = v.financeCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.tutoringCompensationType = v.tutoringCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.letterModifyCompensationType = v.letterModifyCompensationType == 'cny' ? '￥人民币' : '＄美元'
          v.letterModifyCompensationCoverLetterNew = v.businessLetterModify == '1' ? `${v.letterModifyCompensationType.indexOf('美元') == '-1' ? '￥' : ' $'} ${v.letterModifyCompensationCoverLetter || 0}` : ''
          v.letterModifyCompensationResumeZhNew = v.businessLetterModify == '1' ? `${v.letterModifyCompensationType.indexOf('美元') == '-1' ? '￥' : ' $'} ${v.letterModifyCompensationResumeZh || 0}` : ''
          v.letterModifyCompensationResumeEnNew = v.businessLetterModify == '1' ? `${v.letterModifyCompensationType.indexOf('美元') == '-1' ? '￥' : ' $'} ${v.letterModifyCompensationResumeEn || 0}` : ''
        })

        const rows = data.rows

        console.log(rows)
        this.settingsAPIData = JSON.parse(JSON.stringify(rows))
        rows.forEach((v, i) => {
          v.mentorStatus = v.mentorStatus == 0 ? '启用' : '禁用'
          v.entryStatus =
            v.entryStatus == 1
              ? '在职'
              : v.entryStatus == 2
                ? '已离职'
                : 'Incoming'
        })
        this.settings.data = rows
        this.$refs.table.hotInstance.loadData(this.settings.data)
        this.total = data.total
        this.loading = false
      })
      autoHight()
    },
    // 查看简历/合同
    assistantdownload (path) {
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },

    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    addMentor () {
      this.mentorData.mentorStatus = '0'
      this.mentorData.businessCareer = 0
      this.mentorData.businessGp = 0
      this.mentorData.businessOral = 0
      this.mentorData.businessCfa = 0
      this.mentorData.businessFinance = 0
      this.mentorData.businessTutoring = 0
      this.mentorData.businessLetterModify = 0
      this.country = []
      this.mentorEditVisible = true
    },
    showDic (dicStr) {
      this.dicProject = dicStr
      this.dicEditVisible = true
    },
    dicClose () {
      this.dicEditVisible = false
    },
    // 支付账户弹框
    toPayWay (row) {
      this.mentorData = { ...this.settings.data[row] }
      // this.getMentorData(row);
      this.payWayVisible = true
    },
    payWayClose () {
      this.mentorData = {}
      this.payWayVisible = false
    },
    payWaySubmit () {
      this.Topage(this.pageNum)
      this.payWayClose()
    },
    // 导师编辑弹框
    mentorEdit (row) {
      console.log(this.settingsAPIData[row].mentorId)
      this.$emit('mentorInfo', this.settingsAPIData[row].mentorId)
    },
    mentorEditClose () {
      this.mentorData = {
        division: [],
        company: [],
        location: [],
        country: [],
        wxId: null,
        email: null,
        linkedinPath: null
      }
      this.country = []
      this.mentorEditVisible = false
    },
    mentorEditSubmit () {
      this.Topage(this.pageNum)
      this.mentorEditClose()
    },
    // 学生列表弹框
    toStudentsList (row) {
      this.mentorData = { ...this.settings.data[row] }
      this.studentsListVisible = true
    },
    studentsListClose () {
      this.mentorData = {}
      this.studentsListVisible = false
    },
    studentsListSubmit () {
      this.Topage(this.pageNum)
      this.studentsListClose()
    },
    //   酬金弹框
    toRewardList (row) {
      this.mentorData = { ...this.settings.data[row] }
      this.rewardListVisible = true
    },
    rewardListClose () {
      this.mentorData = {}
      this.rewardListVisible = false
    },
    rewardListSubmit () {
      this.Topage(this.pageNum)
      this.rewardListClose()
    },
    //   课时
    toLessonHours (row) {
      this.mentorData = { ...this.settings.data[row] }
      this.lessonHoursVisible = true
    },
    lessonHoursClose () {
      this.lessonHoursVisible = false
    },
    // 文档
    toFile (row) {
      this.mentorData = { ...this.settings.data[row] }
      this.fileVisible = true
    },
    toBonus (row) {
      this.mentorData = { ...this.settings.data[row] }
      this.bonusVisible = true
    },
    bonusClose () {
      this.bonusVisible = false
    },
    fileClose () {
      this.fileVisible = false
    },
    toConnect (row) {
      this.mentorData = { ...this.settings.data[row] }
      api.getMentorQrCode(this.mentorData.mentorId).then(res => {
        console.log(res)
        const imageHtml = `<div style="width: 100%; height: 200px;text-align:center">
                          <img
                          style="width: 200px; height: 200px"
                          src="${res.data}"/>
                        </div>
                        <div style="text-align:center;color:#409EFF;margin-top:20px" >请截图后分享给导师进行绑定</div>`

        this.$alert(imageHtml, '导师小程序绑定二维码', {
          showConfirmButton: false,
          dangerouslyUseHTMLString: true
        })
      })
    },
    // 导师推荐情况
    mentorRecommend () {
      this.mentorRecommendVisible = true
    },
    bonusRecommend () {
      this.bonusRecommendVisible = true
    },
    mentorRecommendClose () {
      this.mentorRecommendVisible = false
    },
    bonusVisibleClose () {
      this.bonusRecommendVisible = false
    },
    mentorRecommendReload () {
      this.getReferrerCount()
    },
    bonusVisibleReload () {
      this.getBonusList()
    },
    exportFile () {
      let fileName = ''
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      fileName = '导师筛选列表'
      xhr.open(
        'GET',
        `${this.$apiUrl}mentor/list2/export?sort=${this.sort}&sortCol=${this.sortCol}&search=${this.search}&pageNum=${this.pageNum}&pageSize=${this.pageSize}&careerTrack=${this.careerTrack.join(',')}&careerCountry=${this.careerCountry.join(',')}&gpMajor=${this.gpMajor.join(',')}&gpCountry=${this.gpCountry.join(',')}&tutoringSubject=${this.tutoringSubject.map((item, index) => { return item[1] }).join(',')}&tutoringCountry=${this.tutoringCountry.join(',')}&mentorStatus=${this.mentorStatus}&mentorBusiness=${this.mentorBusiness}&sex=${this.sex}&school=${this.school}&majors=${this.majors.join(',')}`, true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.xlsx' // 如123.xlsx
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
    },
    high () {
      autoHight()
    }
  }
}
</script>

<style lang="scss">
.mentor {
  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
.el-tag--small {
    height: 25px;
}
.render_name{
  color:#FF8C00;
  text-decoration: underline;
  cursor: pointer;
}
</style>
