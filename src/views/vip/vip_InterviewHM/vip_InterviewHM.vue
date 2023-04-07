<!--
 * @Author: kaan
 * @Date: 2021-12-24 16:47:43
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-03 16:58:19
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-input
          :style="{width:widths1}"
            class="mr10 mb10"
            v-model="search"
            clearable
            placeholder="支持学员名，微信名，微信ID"
          ></el-input>
          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="userId"
            clearable
            filterable
            placeholder="用户"
          >
            <el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
          <el-date-picker
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="finishYear"
            type="year"
            clearable
            value-format="yyyy"
            placeholder="毕业年份"
          ></el-date-picker>
          <el-select
            :style="{width:widths1}"
            class="mr10 mb10"
            v-model="degreeId"
            clearable
            filterable
            multiple
            placeholder="学历"
          >
            <el-option
              v-for="(item,i) in degreeList" :key="i" :label="item.itemName" :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="countryId"
            clearable
            filterable
            multiple
            placeholder="国家"
            @change="changeCountry()"
          >
            <el-option
              v-for="(item,i) in countryList" :key="i":label="item.countryName":value="item.countryId"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths1}"
            class="mr10 mb10"
            v-model="cityId"
            clearable
            filterable
            multiple
            placeholder="城市"
            @change="changeCity()"
          >
            <el-option
              v-for="(item,i) in cityList"
              :key="i"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
          <!-- <el-select
            :style="{width:widths1}"
            class="mr10 mb10"
            v-model="schoolId"
            clearable
            filterable
            multiple
            placeholder="学校"
          >
            <el-option
              v-for="(item,i) in schoolList"
              :key="i"
              :label="item.schoolName"
              :value="item.schoolId"
            ></el-option>
          </el-select> -->
          <el-select
            :style="{width:'120px'}"
            class="mr10 mb10"
            v-model="companyId"
            clearable
            filterable
            multiple
            placeholder="公司"
          >
            <el-option
              v-for="(item,i) in companyList"
              :key="i"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <!-- <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="universityType"
            clearable
            filterable
            multiple
            placeholder="大学类型"
          >
            <el-option
              v-for="(item,i) in universityTypeList"
              :key="i"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select> -->
          <!-- <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="majorId"
            clearable
            filterable
            multiple
            placeholder="专业"
          >
            <el-option
              v-for="(item,i) in majorList"
              :key="i"
              :label="item.majorName"
              :value="item.majorId"
            ></el-option>
          </el-select> -->
          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="divisionId"
            clearable
            filterable
            multiple
            placeholder="部门"
          >
            <el-option
              v-for="(item,i) in divisionList"
              :key="i"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="resultApply"
            clearable
            filterable
            multiple
            placeholder="实习/全职"
          >
            <el-option
              v-for="(item,i) in internshipOrFullTime"
              :key="i"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-date-picker
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="applySeason"
            type="year"
            clearable
            value-format="yyyy"
            placeholder="申请季"
          ></el-date-picker>
          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="times"
            clearable
            filterable
            placeholder="第几轮"
          >
            <el-option
              v-for="(item,i) in interviewRoundNo"
              :key="i"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="checkStatus"
            clearable
            placeholder="状态"
          >
            <el-option
              v-for="(item,i) in checkStatusList"
              :key="i"
              :label="item.itemName"
              :value="item.itemVale"
            ></el-option>
          </el-select>

          <el-select
            :style="{width:widths2}"
            class="mr10 mb10"
            v-model="basicDivision"
            clearable
            filterable
            placeholder="一级部门"
          >
            <el-option
              v-for="(item,i) in basicDivisionList"
              :key="i"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <!-- <el-date-picker
            :style="{width:widths2}"
            value-format="yyyy-MM-dd"
            v-model="fromDate"
            class="mr10 mb10"
            type="date"
            placeholder="查询上传开始日期"
          ></el-date-picker>
          <el-date-picker
            :style="{width:widths2}"
            value-format="yyyy-MM-dd"
            v-model="toDate"
            class="mr10 mb10"
            type="date"
            placeholder="查询上传截止日期"
          ></el-date-picker> -->
          <el-button icon="el-icon-search" class="mr10" plain @click="Topage(1)">GO</el-button>
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
        highlight-current-row
        :max-height="tableHeight"
        border
      >
        <el-table-column align="center" label="操作" width="80" v-if="roleInfo.includes('vip_interview_hm_list_setting')">
          <template slot-scope="scope">
            <el-button type="text" @click="setInterview(scope.row)">核验</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="checkStatusName" label="核验状态">
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
        <el-table-column align="center" prop="sexName" label="学员性别"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="学员名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
        <el-table-column align="center" prop="degreeName" label="学历"></el-table-column>
        <el-table-column align="center" prop="schoolChiName" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="majorName" label="专业" show-overflow-tooltip></el-table-column>

        <el-table-column align="center" prop="programSubdivision" label="项目类别" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="basicDivisionName" label="一级部门信息" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="displayStatusName" label="官网显示"></el-table-column>
        <el-table-column align="center" prop="shield" label="屏蔽学生学校"></el-table-column>
        <el-table-column align="center" prop="publicStatusName" label="可否宣传"></el-table-column>
        <el-table-column align="center" prop="storyByName" label="面经提供人" show-overflow-tooltip></el-table-column>

        <el-table-column align="center" label="面试信息">
          <el-table-column align="center" prop="companyName" label="公司" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="cityName" label="城市" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="divisionName" label="部门" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" width="100" prop="interviewDate" label="面试时间"></el-table-column>
          <el-table-column align="center" prop="difficultyLevel" label="面试难度"></el-table-column>
          <el-table-column align="center" prop="timesName" label="第几轮"></el-table-column>
          <el-table-column align="center" prop="resultApplyName" label="实习/全职" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="fullTimeTypeName" label="全职类型"></el-table-column>
        <el-table-column align="center" prop="internshipTypeName" label="实习类型"></el-table-column>
          <el-table-column align="center" prop="applySeason" label="申请季"></el-table-column>

          <el-table-column align="center" width="120" prop="story" label="面经是否展示">
            <template slot-scope="scope">
                {{scope.row.storyStatusName || '不展示'}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="story" label="面经" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <el-popover width="400" trigger="hover" :content="scope.row.story">
                <p class="w80" slot="reference">{{scope.row.story}}</p>
              </el-popover>
            </template> -->
          </el-table-column>
          <el-table-column min-width="180" align="center" prop="resultVoucherMosaic" label="凭证(有码)">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.resultVoucherMosaic"
                @click="preview(scope.row.resultVoucherMosaic,'vip_interview_hm_list_view_hm')"
              >查看</el-button>
              <el-button
                type="text"
                v-if="scope.row.resultVoucherMosaic"
                @click="download(scope.row,'vip_interview_hm_list_down_hm')"
              >下载</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="contact1Name" label="主联系人" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="contact2Name" label="副联系人" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <SetInterview :settingVisible="settingVisible" :interviewObjData="interviewObjData" @close="setInterviewClose" @submit="setInterviewSubmit" ></SetInterview>
    <CheckDownLoadTimes :downloadVisible="downloadVisible" :downLoadData="downLoadData"  @close="downLoadClose" />
  </d2-container>
</template>

<script>
import api from '@/api/achievement.js'
import apiUser from '@/api/user.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import files from '@/libs/file'
import SetInterview from '../../achievement/components/SetInterview'
import CheckDownLoadTimes from '../../achievement/components/CheckDownloadTimes'
export default {
  mixins: [mixins],
  name: 'InterviewHM',
  components: { SetInterview, CheckDownLoadTimes },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      // 搜索栏数据
      widths1: '120px',
      widths2: '120px',
      search: '',
      userId: '',
      users: [],
      finishYear: '',
      degreeId: '',
      loading: false,
      degreeList: [],
      countryId: '',
      countryList: [],
      cityId: '',
      cityList: [],
    //   schoolId: '',
      schoolList: [],
      companyId: '',
      companyList: [],
    //   universityType: '',
      universityTypeList: [],
    //   majorId: '',
      majorList: [],
      divisionId: '',
      divisionList: [],
      resultApply: '',
      internshipOrFullTime: [],
      applySeason: '',
      times: '',
      interviewRoundNo: [],
      checkStatus: '',
      checkStatusList: [{
        itemName: '未核验',
        itemVale: 0
      }, {
        itemName: '已核验',
        itemVale: 1
      }, {
        itemName: '未通过',
        itemVale: 2
      }],
      basicDivision: '',
      basicDivisionList: [],
      fromDate: '',
      toDate: '',
      pageNum: 1,
      total: 0,
      pageSize: 100,

      tableHeight: 'auto',
      offerList: [],
      resultConfirmS: ['未确认', '已确认', '审核未通过'],

      settingVisible: false,
      interviewObjData: {},

      // 抽屉
      downloadVisible: false,
      downLoadData: {}
    }
  },
  mounted () {
    this.pageInit()
    this.Topage(1)
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function(){
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  methods: {
    /**
     * @description: 页面初始化
     * @param {*}
     * @return {*}
     */
    async pageInit () {
      // 获取用户组内成员列表
      apiUser.subordinate(this.$store.state.role.userInfo.userId, 'strategist').then((res) => {
        this.users = res.data
        this.users.unshift({ userName: 'ALL', userId: 'ALL' })
      })
      this.degreeList = await this.getDictionary('degree')
      this.divisionList = await this.getDictionary('division')
      this.universityTypeList = await this.getDictionary('university_type')
      this.internshipOrFullTime = await this.getDictionary('internship_or_full_time')
      this.interviewRoundNo = await this.getDictionary('interview_round_no')
      this.basicDivisionList = await this.getDictionary('basic_division')
      this.majorList = await this.getMajor()
      this.initDropDown()
    },
    /**
     * @description: 获取国家，城市，学校，公司下拉选
     * @param {*}
     * @return {*}
     */
    initDropDown () {
      console.log(this.countryId, this.cityId)
      const countryId = this.countryId.join(',')
      const cityId = this.cityId.join(',')
      const data = {
        countryId: countryId,
        cityId: cityId,
        resultType: '0'
      }
      api.getDicSignResultDic(data).then(res => {
        this.countryList = res.data.countryDropDown
        this.cityList = res.data.cityDropDown
        this.schoolList = res.data.schoolDropDown
        this.companyList = res.data.companyDropDown
      })
    },
    changeCountry () {
      this.companyId = []
    //   this.schoolId = []
      this.cityId = []
      this.initDropDown()
    },
    changeCity () {
      this.companyId = []
    //   this.schoolId = []
      this.initDropDown()
    },
    Topage (i) {
      i == 1 ? this.pageNum = 1 : ''
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        resultType: '0',
        mosaic: '1',
        checkStatus: this.checkStatus,
        degree: this.degreeId.join(','),
        // schoolId: this.schoolId.join(','),
        countryId: this.countryId.join(','),
        // universityType: this.universityType.join(','),
        // major: this.majorId.join(','),
        companyId: this.companyId.join(','),
        cityId: this.cityId.join(','),
        division: this.divisionId.join(','),
        resultApply: this.resultApply.join(','),
        finishYear: this.finishYear,
        applySeason: this.applySeason,
        times: this.times,
        fromDate: this.fromDate,
        basicDivision: this.basicDivision,
        toDate: this.toDate
      }
      console.log('面试列表参数', data)
      this.loading = true
      api.getAchievementList(data).then((res) => {
        console.log('面试列表', res)
        res.data.rows.forEach((v) => {
          v.shield = v.shield == '1' ? '是' : '否'
          v.resultConfirm = this.resultConfirmS[v.resultConfirm]
        })
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
    /**
     * @description: 修改面经展示状态
     * @param {*} pkId
     * @param {*} val
     * @param {*} signId
     * @return {*}
     */
    changeStoryStatus (pkId, val, signId) {
      const data = {
        signId: signId,
        storyStatus: val,
        pkId: pkId
      }
      api.setOfferV2ListBySignId(data).then(res => {
        this.$message({
          type: 'success',
          message: '面经展示状态更新成功！'
        })
        this.Topage(this.pageNum)
      })
    },
    /**
     * @description: 预览
     * @param {*}
     * @return {*}
     */
    preview (val, role) {
      if (!this.roleInfo.includes(role)) {
        this.$message('无权限')
        return
      }
      files.preview(val)
    },
    /**
     * @description: 下载
     * @param {*} val
     * @param {*} role
     * @return {*}
     */
    download (row, role) {
      if (!this.roleInfo.includes(role)) {
        this.$message('无权限')
        return
      }
      const params = {
        keyId: row.pkId,
        downloadType: 'interview',
        contentType: 'interviewVoucherMosaic',
        content: row.resultVoucherMosaic
      }
      api.saveDownLoad(params).then(res => {
        console.log(res)
        const path = row.resultVoucherMosaic
        console.log(path)
        files.downloadFile(path, url => {
          console.log(path)
        })
      })
    },
    downLoadClose () {
      this.downloadVisible = false
    },
    checkDownLoadTimes (data, type) {
      this.downloadVisible = true
      this.downLoadData = { ...data }
      this.downLoadData.downloadType = 'interview'
      this.downLoadData.contentType = type
    },
    setInterview (v) {
      this.interviewObjData = v
      this.interviewObjData.type = 'HM'
      this.settingVisible = true
    },
    setInterviewClose () {
      this.settingVisible = false
    },
    setInterviewSubmit () {
      this.settingVisible = false
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
</style>
