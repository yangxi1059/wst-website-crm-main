<!--
 * @Author: 库建华
 * @Date: 2019-08-13 15:00:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-10 18:01:49
 * @Version:
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
        <div class="search_page" ref="search">
          <div class="search">
              <el-input
              class="mr10"
              size="mini"
              style="width:120px"
              v-model="search"
              clearable
              placeholder="支持学员名，微信名，微信ID"
              @keyup.enter.native="Topage(1)"
              ></el-input>
              <el-select
              class="mr10"
              size="mini"
              v-model="userId"
              style="width:120px;margin-bottom:5px"
              clearable
              filterable
              placeholder="用户"
              @change="Topage(1)"
              >
              <el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
              <el-select
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="prepareMonth"
              clearable
              filterable
              placeholder="准备周期"
              @change="Topage()"
              >
              <el-option v-for="(item,i) in 36" :key="i" :label="item" :value="item"></el-option>
              </el-select>
              <el-input
              :style="{width:'120px'}"
              class="mr10"
              size="mini"
              v-model="offerSalaryFrom"
              clearable
              placeholder="最小年薪(w)"
              :controls="false"
              @change="Topage()"
              ></el-input>
              <el-input
              :style="{width:'120px'}"
              class="mr10"
              size="mini"
              v-model="offerSalaryTo"
              clearable
              placeholder="最大年薪(w)"
              :controls="false"
              @change="Topage()"
              ></el-input>
              <el-select
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="sexId"
              clearable
              filterable
              placeholder="性别"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in sex"
                  :key="i"
                  :label="item.itemName"
                  :value="item.itemValue"
              ></el-option>
              </el-select>
              <el-date-picker
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="finishYear"
              type="year"
              clearable
              value-format="yyyy"
              @change="Topage()"
              placeholder="毕业年份"
              ></el-date-picker>
              <el-select
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="degreeId"
              clearable
              filterable
              multiple
              placeholder="学历"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in degree_list"
                  :key="i"
                  :label="item.itemName"
                  :value="item.itemValue"
              ></el-option>
              </el-select>

              <el-select
              :style="{width:'120px'}"
              style="margin-bottom:5px"
              class="mr10"
              size="mini"
              v-model="schoolCountry"
              clearable
              filterable
              multiple
              placeholder="国家"
              @change="changeCountry()"
              >
              <el-option
                  v-for="(item,i) in country"
                  :key="i"
                  :label="item.countryName"
                  :value="item.countryId"
              ></el-option>
              </el-select>
              <el-select
              :style="{width:'120px'}"
              style="margin-bottom:5px"
              class="mr10"
              size="mini"
              v-model="cityId"
              clearable
              filterable
              multiple
              placeholder="城市"
              @change="changeCity()"
              >
              <el-option
                  v-for="(item,i) in city"
                  :key="i"
                  :label="item.cityName"
                  :value="item.cityId"
              ></el-option>
              </el-select>
              <el-select
              :style="{width:'120px'}"
              style="margin-bottom:5px"
              class="mr10"
              size="mini"
              v-model="schoolId"
              clearable
              filterable
              multiple
              placeholder="学校"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in schoolList"
                  :key="i"
                  :label="item.schoolName"
                  :value="item.schoolId"
              ></el-option>
              </el-select>
              <el-select
              :style="{width:'120px'}"
              style="margin-bottom:5px"
              class="mr10"
              size="mini"
              v-model="companyId"
              clearable
              filterable
              multiple
              placeholder="公司"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in company"
                  :key="i"
                  :label="item.companyName"
                  :value="item.companyId"
              ></el-option>
              </el-select>

              <el-select
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="universityType"
              clearable
              multiple
              filterable
              placeholder="大学类型"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in university_type"
                  :key="i"
                  :label="item.itemName"
                  :value="item.itemValue"
              ></el-option>
              </el-select>
              <el-select
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="majorId"
              clearable
              multiple
              filterable
              placeholder="专业"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in major"
                  :key="i"
                  :label="item.majorName"
                  :value="item.majorId"
              ></el-option>
              </el-select>
              <el-cascader
              size="mini"
              :style="{width:'120px'}"
              class="mr10"
              v-model="divisionId"
              filterable
              placeholder="部门"
              clearable
              :props="{ checkStrictly: true }"
              :options="division"
              @change="Topage()"
              >
              </el-cascader>
              <el-select
              style="width:120px;margin-bottom:5px"
              class="mr10"
              size="mini"
              v-model="resultApply"
              clearable
              multiple
              filterable
              placeholder="实习/全职"
              @change="Topage()"
              >
              <el-option
                  v-for="(item,i) in internship_or_full_time"
                  :key="i"
                  :label="item.itemName"
                  :value="item.itemValue"
              ></el-option>
              </el-select>
              <el-date-picker
              :style="{width:width}"
              class="mr10"
              size="mini"
              v-model="applySeason"
              type="year"
              clearable
              value-format="yyyy"
              @change="Topage()"
              placeholder="申请季"
              ></el-date-picker>
              <el-select
              class="mr10"
              size="mini"
              style="width:120px"
              v-model="checkStatus"
              clearable
              placeholder="状态"
              @change="Topage(1)"
              >
              <el-option
                  v-for="(item,i) in checkStatusS"
                  :key="i"
                  :label="item.itemName"
                  :value="item.itemVale"
              ></el-option>
              </el-select>
              <el-date-picker
              :style="{width:'120px'}"
              value-format="yyyy-MM-dd"
              v-model="fromDate"
              class="mr10"
              size="mini"
              type="date"
              @change="Topage()"
              placeholder="查询上传开始日期"
              ></el-date-picker>
              <el-date-picker
              :style="{width:'120px'}"
              value-format="yyyy-MM-dd"
              v-model="toDate"
              class="mr10"
              size="mini"
              @change="Topage()"
              type="date"
              placeholder="查询上传截止日期"
              ></el-date-picker>
              <el-button style="width:50px" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
              <el-button  style="margin-left:0px;width:60px" size="mini" plain v-if="roleInfo.includes('offer_list_downloadZip')" @click="downloadZip">下载</el-button>
          </div>
          <pagination
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
          ></pagination>
        </div>
        <el-table
          :data="offerList"
          size="mini"
          highlight-current-row
          :max-height="tableHeight"
          border
        >
        <el-table-column align="center" label="按钮功能区">
            <el-table-column
            align="center"
            label="序号"
            type="index"
            width="50">
            </el-table-column>
            <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="submit(scope.row)">设置</el-button>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="checkStatusName" label="审核状态">
            <template slot-scope="scope">
                <p>
                <template v-if="scope.row.checkNote">
                    <el-tooltip placement="top">
                    <div slot="content">
                        {{scope.row.checkNote}}
                    </div>
                    <el-button type="text" class="el-icon-info"></el-button>
                    </el-tooltip>
                </template>
                <span v-if="scope.row.checkStatus == 2" style="color:#c32e47">
                    {{scope.row.checkStatusName}}
                </span>
                <span v-else>
                    {{scope.row.checkStatusName}}
                </span>
                </p>
            </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" prop="resultVoucher" label="凭证(无码)">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.resultVoucher"
                @click="download(scope.row.resultVoucher)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.resultVoucher"
                @click="downloadD(scope.row.resultVoucher)"
                >下载</el-button>
            </template>
            </el-table-column>
            <el-table-column min-width="120" align="center" prop="resultVoucherMosaic" label="凭证(有码)">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.resultVoucherMosaic"
                @click="download2(scope.row.resultVoucherMosaic)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.resultVoucherMosaic"
                @click="downloadD2(scope.row.resultVoucherMosaic)"
                >下载</el-button>
                <!-- <el-upload
                v-if="roleInfo.includes('offer_list_up')"
                action
                :http-request="uploadFileAxios"
                class="upload-btn"
                ref="elupload"
                :file-list="fileList"
                >
                <el-button
                    class="el-icon-upload"
                    slot="trigger"
                    size="mini"
                    type="success"
                    plain
                    @click="signId = scope.row.signId;pkId = scope.row.pkId"
                >选取文件</el-button>
                </el-upload> -->
            </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" prop="praiseVoucher" label="好评图(无码)">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucher"
                @click="download3(scope.row.praiseVoucher)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucher"
                @click="downloadD3(scope.row.praiseVoucher)"
                >下载</el-button>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="praiseVoucherMosaic" label="好评图(有码)" min-width="120">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucherMosaic"
                @click="download4(scope.row.praiseVoucherMosaic)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucherMosaic"
                @click="downloadD4(scope.row.praiseVoucherMosaic)"
                >下载</el-button>
                <!-- <el-upload
                v-if="roleInfo.includes('offer_list_img_up')"
                action
                :http-request="uploadFileAxios1"
                class="upload-btn"
                ref="elupload"
                :file-list="fileList"
                >
                <el-button
                    class="el-icon-upload"
                    slot="trigger"
                    size="mini"
                    type="success"
                    plain
                    @click="signId = scope.row.signId;pkId = scope.row.pkId"
                >选取文件</el-button>
                </el-upload> -->
            </template>
            </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="学员信息">
            <el-table-column
            min-width="100"
            align="center"
            prop="menteeName"
            label="学员名"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
                <el-popover effect="dark" placement="right" width="300" trigger="hover">
                <div :style="{background:'#fff'}">
										<div>项目周期:       {{scope.row.programPeriod || '无'}}<br></div>
										<div>行业导师课时数: {{scope.row.mentorHour || 0}}<br></div>
										<div>准备周期:       {{scope.row.prepareMonth || '无'}} month</div>
									</div>
                <p slot="reference">{{scope.row.menteeName}}</p>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="sexName" label="学员性别" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100" align="center" prop="schoolChiName" label="学校" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="degreeName" label="学历" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100" align="center" prop="majorName" label="专业" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="offer信息">
            <el-table-column
            min-width="100"
            align="center"
            prop="companyName"
            label="公司"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column
            min-width="100"
            align="center"
            prop="cityName"
            label="城市"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="basicDivisionName" width="120px" label="一级部门信息"></el-table-column>
            <el-table-column
            min-width="100"
            align="center"
            prop="divisionName"
            label="部门"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column
            min-width="100"
            align="center"
            prop="resultApplyName"
            label="实习/全职"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center"  show-overflow-tooltip prop="fullTimeTypeName" label="全职类型"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="internshipTypeName" label="实习类型"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="applySeason" label="申请季"></el-table-column>
            <el-table-column width="120px" align="center" show-overflow-tooltip prop="prepareMonth" label="准备周期（月）" ></el-table-column>
            <el-table-column width="120px" align="center" prop="offerReceiveDate" label="offer获得日期"></el-table-column>
            <el-table-column align="center" prop="offerSalary" label="offer年薪(w)" width="120px">
              <template slot-scope="scope">
                  <div>{{scope.row.offerSalary || '无'}}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" prop="offerBase" label="薪资Base" show-overflow-tooltip></el-table-column>
					  <el-table-column min-width="100" align="center" prop="offerBonus" label="薪资Bonus" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="story" label="小故事">
            <template slot-scope="scope">
                <el-popover width="400" trigger="hover" :content="scope.row.story">
                <p class="w80" slot="reference">{{scope.row.story}}</p>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注">
            <template slot-scope="scope">
                <el-popover width="400" trigger="hover" :content="scope.row.remark">
                <p class="w80" slot="reference">{{scope.row.remark}}</p>
                </el-popover>
            </template>
            </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="工作信息">
            <el-table-column align="center" prop="shieldName" label="屏蔽学生学校" show-overflow-tooltip width="120px"></el-table-column>
            <el-table-column align="center" prop="publicStatusName" label="可宣传" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="displayStatusName" label="官网展示" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="salesUsedName" label="sales已用"></el-table-column>
            <el-table-column align="center" prop="mktUsedName" label="mkt已用"></el-table-column>
            <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="programSubdivision" label="项目类别" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="200" align="center" prop="programName" label="项目名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="programPeriod" label="项目周期"></el-table-column>
            <el-table-column align="center" prop="mentorHour" width="140px" label="签约行业导师课时数" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="contact1Name" label="主联系人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="contact2Name" label="副联系人" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100" align="center" prop="strategistName" label="VIP导师名" show-overflow-tooltip></el-table-column>
        </el-table-column>
        </el-table>
    </div>
    <settingOffer :settingVisible="settingVisible" :offerData="offerData" @close="settingOfferClose" @submit="settingOfferSubmit" ></settingOffer>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import apiAchievement from '@/api/achievement.js'
import aes from '@/plugin/aes_rsa/aes_ecb.js'
import settingOffer from './components/setOfferMsg'
import { mapState } from 'vuex'
import util from '@/libs/util'
import {
  downloadFun,
  downloadFunD,
  uploadFunBySys
} from '@/libs/file'

export default {
  mixins: [mixins],
  name: 'feedback',
  components: {
    settingOffer
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  data () {
    return {
      pageSize: 100,
      tableHeight: 'auto',
      settingVisible: false,
      offerData: {},
      degree_list: [],
      sex: [],
      company: [],
      users: [],
      city: [],
      division: [],
      country: [],
      internship_or_full_time: [],
      interview_round_no: [],
      university_type: [],
      schoolList: [],
      width: '120px',
      pageNum: 1,
      total: 0,
      search: null,
      checkStatus: null,
      finishYear: null,
      applySeason: null,
      degreeId: [],
      schoolId: [],
      schoolCountry: [],
      universityType: [],
      major: [],
      majorId: [],
      companyId: [],
      cityId: [],
      divisionId: [],
      resultApply: [],
      times: null,
      sexId: null,
      offerSalaryFrom: null,
      offerSalaryTo: null,
      prepareMonth: null,
      userId: 'ALL',
      fromDate: '',
      toDate: '',
      loading: false,
      offerList: [],
      // resultConfirmS: ["未确认", "已确认", "审核未通过"],
      checkStatusS: [
        {
          itemName: '未核验',
          itemVale: 0
        },
        {
          itemName: '已核验',
          itemVale: 1
        },
        {
          itemName: '未通过',
          itemVale: 2
        }
      ],
      fileList: [],
      signId: null,
      division1: null,
      pkId: null
    }
  },
  mounted () {
    this.init()
    this.initDropDown()
    this.Topage(1)
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.degree_list = await this.getDictionary('degree')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.interview_round_no = await this.getDictionary('interview_round_no')
      this.university_type = await this.getDictionary('university_type')
      this.sex = await this.getDictionary('sex')
      this.major = await this.getMajor()
    },
    init () {
      // 获取用户列表users
      api.getUserListByUserId(this.userInfo.userId).then(res => {
        console.log('vip列表', res)
        this.users = res.data
        this.users.unshift({ userName: 'ALL', userId: 'ALL' })
      })
      apiDic.getParentAndChildrenDic({ parentDic: 'basic_division', dicLabel: 'division' }).then(res => {
        console.log('获取部门父子字典：', res.data)
        this.division = res.data
      })
    },
    initDropDown () {
      console.log(this.schoolCountry, this.cityId)
      const countryId = this.schoolCountry.join(',')
      const cityId = this.cityId.join(',')
      const data = {
        countryId: countryId,
        cityId: cityId,
        resultType: '1'
      }
      console.log(data, 111)
      apiAchievement.getDicSignResultDic(data).then(res => {
        console.log(res, 222)
        this.country = res.data.countryDropDown
        this.city = res.data.cityDropDown
        this.schoolList = res.data.schoolDropDown
        this.company = res.data.companyDropDown
      })
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        resultConfirm: '1',
        resultType: '1',
        checkStatus: this.checkStatus,
        finishYear: this.finishYear,
        applySeason: this.applySeason,
        degree: this.degreeId.join(','),
        schoolId: this.schoolId.join(','),
        countryId: this.schoolCountry.join(','),
        universityType: this.universityType.join(','),
        major: this.majorId.join(','),
        companyId: this.companyId.join(','),
        cityId: this.cityId.join(','),
        division: this.divisionId[1],
        resultApply: this.resultApply.join(','),
        times: this.times,
        sex: this.sexId,
        offerSalaryFrom: ~~this.offerSalaryFrom,
        offerSalaryTo: ~~this.offerSalaryTo,
        prepareMonth: this.prepareMonth,
        fromDate: this.fromDate,
        basicDivision: this.divisionId[0],
        toDate: this.toDate
      }
      console.log('offer列表参数', data)
      this.loading = true
      apiAchievement.getAchievementList(data).then(res => {
        console.log('offer列表', res)
        this.offerList = res.data.rows
        this.total = res.data.total
        this.loading = false
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
    // 查看
    download (path) {
      if (!this.roleInfo.includes('offer_list_view_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      if (!this.roleInfo.includes('offer_list_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download3 (path) {
      if (!this.roleInfo.includes('offer_list_img_view_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download4 (path) {
      if (!this.roleInfo.includes('offer_list_img_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    downloadD (path) {
      if (!this.roleInfo.includes('offer_list_down_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD2 (path) {
      if (!this.roleInfo.includes('offer_list_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD3 (path) {
      if (!this.roleInfo.includes('offer_list_img_down_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD4 (path) {
      if (!this.roleInfo.includes('offer_list_img_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    // 上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(
        file.file,
        `voucher/offer_list/${this.pkId}`,
        url => {
          const data = {
            pkId: this.pkId,
            // praiseVoucherMosaic: url
            resultVoucherMosaic: url
          }
          this.submitCommon(data)
          this.fileList = []
          this.$loading().close()
          this.$refs.elupload.clearFiles()
        }
      )
    },
    // 上传
    uploadFileAxios1 (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(
        file.file,
        `good_figure/offer_list/${this.pkId}`,
        url => {
          const data = {
            pkId: this.pkId,
            praiseVoucherMosaic: url
            // resultVoucherMosaic: url
          }
          this.submitCommon(data)
          this.fileList = []
          this.$refs.elupload.clearFiles()
        }
      )
    },
    submitCommon (data) {
      api.setOfferListBySignId(this.signId, { uptList: [data] }).then(res => {
        console.log(res)
        this.Topage(1)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      })
    },
    // 重置核验状态
    submit (v) {
      this.offerData = v
      this.settingVisible = true
    },
    settingOfferClose () {
      this.settingVisible = false
    },
    settingOfferSubmit () {
      this.settingVisible = false
      this.Topage()
    },
    downloadZip () {
      const resultVoucherList = this.offerList.map(v => v.resultVoucher)
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'POST',
        `${this.$apiUrl}sign/offer/batchDownload`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      console.log(token)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = 'offer凭证包_无码.zip' // 如123.xls
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
      xhr.send(JSON.stringify(aes.encrypt(resultVoucherList)))
    },
    changeCountry () {
      console.log(this.schoolCountry, 222)
      this.companyId = []
      this.schoolId = []
      this.cityId = []
      this.initDropDown()
      this.Topage()
    },
    changeCity () {
      console.log(this.cityId, 111)
      this.companyId = []
      this.schoolId = []
      this.initDropDown()
      this.Topage()
    }
  }
}
</script>

<style lang="scss" scoped>
  .d2_container{
    width:100%;
    height:100%
  }
  .w80{
    // width:300px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
