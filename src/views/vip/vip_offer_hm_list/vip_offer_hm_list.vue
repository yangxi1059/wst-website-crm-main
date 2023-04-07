<template>
  <d2-container v-loading="loading">
		<div class="feedback d2_container" ref="d2">
			<div class="search_page" ref="search">
				<div class="search">
					<el-input
						class="mr10"
						size="mini"
						style="width:120px;margin-bottom:10px"
						v-model="search"
						clearable
						placeholder="学员名，微信名，微信ID"
						@keyup.enter.native="Topage()"
					></el-input>
					<el-select
						class="mr10"
						size="mini"
						style="width:120px;margin-bottom:10px"
						v-model="userId"
						clearable
						filterable
						placeholder="请选择"
						@change="Topage()"
					>
						<el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
					</el-select>
					<el-select
						style="width:120px;margin-bottom:10px"
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
					<!-- <el-select
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
					></el-date-picker> -->
					<!-- <el-select
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
					</el-select> -->

					<el-select
						:style="{width:'120px'}"
						style="margin-bottom:10px"
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
						style="margin-bottom:10px"
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
						style="margin-bottom:10px"
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
						style="margin-bottom:10px"
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

					<!-- <el-select
						:style="{width:width}"
						class="mr10"
						size="mini"
						v-model="universityType"
						clearable
						filterable
						multiple
						placeholder="大学类型"
						@change="Topage()"
					>
						<el-option
							v-for="(item,i) in university_type"
							:key="i"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select> -->
					<!-- <el-select
						:style="{width:width}"
						class="mr10"
						size="mini"
						v-model="majorId"
						clearable
						filterable
						multiple
						placeholder="专业"
						@change="Topage()"
					>
						<el-option
							v-for="(item,i) in major"
							:key="i"
							:label="item.majorName"
							:value="item.majorId"
						></el-option>
					</el-select> -->

					<el-select
						:style="{width:width}"
						class="mr10"
						size="mini"
						v-model="resultApply"
						clearable
						filterable
						multiple
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
						@change="Topage()"
					>
						<el-option
							v-for="(item,i) in checkStatusS"
							:key="i"
							:label="item.itemName"
							:value="item.itemVale"
						></el-option>
					</el-select>
					<el-select
						class="mr10"
						size="mini"
						v-model="publicStatus"
						style="width:120px;margin-bottom:10px"
						clearable
						placeholder="可宣传"
						@change="Topage()"
					>
						<el-option
							v-for="(item,i) in common_yes_or_no"
							:key="i"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select>

					<!-- <el-select
						class="mr10"
						size="mini"
						v-model="shield"
						style="width:120px;margin-bottom:10px"
						clearable
						placeholder="是否屏蔽学校"
						@change="Topage()"
					>
						<el-option
							v-for="(item,i) in common_yes_or_no"
							:key="i"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select> -->

					<!-- <el-select
						:style="{width:width}"
						class="mr10"
						size="mini"
						v-model="programSubdivision"
						clearable
						placeholder="项目类型"
						@change="Topage()"
					>
						<el-option
							v-for="(item,i) in program_subdivision"
							:key="i"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select> -->

					<el-cascader
						size="mini"
						:style="{width:'120px'}"
						class="mr10"
						v-model="divisionId"
						filterable
						placeholder="部门"
						collapse-tags
						clearable
						:props="{ checkStrictly: true, multiple: true }"
						:options="division"
						@change="Topage()"
					>
					</el-cascader>

					<!-- <el-date-picker
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
					></el-date-picker> -->

					<el-button style="width:50px" class="mr10 ml100" size="mini" plain @click="Topage()">GO</el-button>
					<!-- <el-button
						class="mr10 ml100"
						size="mini"
						style="width:60px"
						plain
						v-if="roleInfo.includes('offer_hm_list_downloadZip')"
						@click="downloadZip"
					>下载</el-button>
					<el-button
						style="width:120px"
						icon="el-icon-download"
						class="mr10 ml100"
						size="mini"
						plain
						v-if="roleInfo.includes('offer_hm_list_casebook')"
						@click="casebook"
					>导出casebook</el-button>
					<el-button
						style="width:120px"
						icon="el-icon-download"
						class="ml100 mr10"
						size="mini"
						plain
						v-if="roleInfo.includes('offer_hm_list_downloadAllOffer')"
						@click="downloadAllOffer"
					>导出全部offer</el-button> -->
					<!-- <el-radio-group  v-model="sortType" size="mini" @change="Topage()">
						<el-radio-button label="VIP"></el-radio-button>
						<el-radio-button label="BD"></el-radio-button>
					</el-radio-group> -->
				</div>
				<div>
					<pagination
						:total="total"
						:current-page="pageNum"
						:page-sizes="[100, 200, 300, 400]"
						:page-size="pageSize"
						@handleSizeChange="handleSizeChange"
						@handleCurrentChange="handleCurrentChange"
					></pagination>
				</div>
			</div>
			<el-table
				:data="offerList"
				size="mini"
				highlight-current-row
				:max-height="tableHeight"
				border
			>
				<!-- @selection-change="handleSelectionChange" -->
				<el-table-column
					align="center"
					label="序号"
					type="index"
					width="50">
				</el-table-column>
				<!-- <el-table-column
					type="selection"
					width="55"
					align="center"
					v-if="roleInfo.includes('offer_hm_list_downloadZip')"
				></el-table-column> -->
				<el-table-column align="center" label="按钮功能区">
					<el-table-column align="center" width="110px" label="操作" v-if="roleInfo.includes(`vip_offer_hm_list_setting`)">
						<template slot-scope="scope">
							<div style="display:flex;justify-content:center">
								<el-button type="text" size="mini" v-if="roleInfo.includes(`vip_offer_hm_list_setting`)" @click="setting(scope.row)">核验</el-button>
								<!-- <el-button type="text" size="mini" v-if="roleInfo.includes(`offer_hm_list_audio`)" @click="applyAudio(scope.row)">音频申请</el-button> -->
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="sales已用" width="120">
						<template slot-scope="scope">
							{{scope.row.salesUsed == '1'?'是':'否'}}
							<!-- <el-switch
								:disabled="!roleInfo.includes(`offer_hm_list_set_salesUsed`)"
								v-model="scope.row.salesUsed"
								active-text="是"
								inactive-text="否"
								active-value="1"
								inactive-value="0"
								@change="setSalesUsed(scope.row)"
							></el-switch> -->
						</template>
					</el-table-column>
					<el-table-column align="center" label="mkt已用（副贴）" width="120">
						<template slot-scope="scope">
							{{scope.row.mktUsed == '1'?'是':'否'}}
							<!-- <el-switch
								:disabled="!roleInfo.includes(`offer_hm_list_set_mktUsed`)"
								v-model="scope.row.mktUsed"
								active-text="是"
								inactive-text="否"
								active-value="1"
								inactive-value="0"
								@change="setMktUsed(scope.row)"
							></el-switch> -->
						</template>
					</el-table-column>

					<el-table-column align="center" label="mkt已用（文章）" width="120">
						<template slot-scope="scope">
							{{scope.row.mktUsedArticle == '1'?'是':'否'}}
							<!-- <el-switch
								:disabled="!roleInfo.includes(`offer_hm_list_set_mktUsed`)"
								v-model="scope.row.mktUsedArticle"
								active-text="是"
								inactive-text="否"
								active-value="1"
								inactive-value="0"
								@change="setMktUsed2(scope.row)"
							></el-switch> -->
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
					<el-table-column min-width="180" align="center" prop="resultVoucherMosaic" label="凭证">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.resultVoucherMosaic"
								@click="download(scope.row.resultVoucherMosaic)"
							>查看</el-button>
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.resultVoucherMosaic"
								@click="downloadD(scope.row)"
							>下载</el-button>
							<!-- <el-button
								size="mini"
								type="text"
								v-if="roleInfo.includes(`offer_job_hm_download_list`) && scope.row.resultVoucherMosaic"
								@click="checkDownLoadTimes(scope.row,'offerVoucherMosaic')"
							>下载记录({{scope.row.offerVoucherMosaicDownloadNum}})</el-button> -->
						</template>
					</el-table-column>
					<el-table-column min-width="180" align="center" prop="praiseVoucherMosaic" label="好评图">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.praiseVoucherMosaic"
								@click="download2(scope.row.praiseVoucherMosaic)"
							>查看</el-button>
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.praiseVoucherMosaic"
								@click="downloadD2(scope.row)"
							>下载</el-button>
							<!-- <el-button
								size="mini"
								type="text"
								v-if="roleInfo.includes(`offer_job_hm_download_list`) && scope.row.praiseVoucherMosaic"
								@click="checkDownLoadTimes(scope.row,'praiseVoucherMosaic')"
							>下载记录({{scope.row.praiseVoucherMosaicDownloadNum}})</el-button> -->
						</template>
					</el-table-column>
					<el-table-column min-width="90" align="center" prop="praiseVoucherMosaic" label="音频">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.audioAnalyse"
								@click="downloadAudio(scope.row.audioAnalyse)"
							>查看</el-button>
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
						<el-table-column align="center" prop="sexName" label="学员性别"></el-table-column>
						<el-table-column min-width="100" align="center" prop="schoolChiName" label="学校" show-overflow-tooltip></el-table-column>
						<el-table-column align="center" prop="degreeName" label="学历"></el-table-column>
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
					<el-table-column align="center" prop="basicDivisionName" label="一级部门信息"></el-table-column>
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
					<el-table-column align="center" prop="fullTimeTypeName" label="全职类型"></el-table-column>
					<el-table-column align="center" prop="internshipTypeName" label="实习类型"></el-table-column>
					<el-table-column align="center" prop="applySeason" label="申请季"></el-table-column>
					<el-table-column align="center" prop="prepareMonth" label="准备周期（月）"></el-table-column>
					<el-table-column min-width="100" align="center" prop="offerReceiveDate" label="offer获得日期" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="offerSalary" label="offer年薪(w)">
						<template slot-scope="scope">
							<div>{{scope.row.offerSalary || '无'}}</div>
						</template>
					</el-table-column>
					<el-table-column min-width="100" align="center" prop="offerBase" label="薪资Base" show-overflow-tooltip></el-table-column>
					<el-table-column min-width="100" align="center" prop="offerBonus" label="薪资Bonus" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="story" label="小故事" show-overflow-tooltip>
						<!-- <template slot-scope="scope">
							<el-popover width="400" trigger="hover" :content="scope.row.story">
								<p class="w80" slot="reference">{{scope.row.story}}</p>
							</el-popover>
						</template> -->
					</el-table-column>
					<el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-popover width="400" trigger="hover" :content="scope.row.remark">
								<p class="w80" slot="reference">{{scope.row.remark}}</p>
							</el-popover>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column align="center" label="工作信息">
					<el-table-column align="center" prop="shieldName" label="屏蔽学生学校"></el-table-column>
					<el-table-column align="center" prop="publicStatusName" label="可宣传"></el-table-column>
					<el-table-column align="center" prop="displayStatusName" label="官网展示"></el-table-column>
					<el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" sortable prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="programSubdivision" label="项目类别"></el-table-column>
					<el-table-column min-width="200" align="center" prop="programName" label="项目名称" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="programPeriod" label="项目周期"></el-table-column>
					<el-table-column align="center" prop="mentorHour" label="签约行业导师课时数"></el-table-column>
					<el-table-column align="center" prop="contact1Name" label="主联系人" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="contact2Name" label="副联系人" show-overflow-tooltip></el-table-column>
					<el-table-column min-width="100" align="center" prop="strategistName" label="VIP导师名" show-overflow-tooltip></el-table-column>
				</el-table-column>
			</el-table>
		</div>
		<setting
			:settingVisible="settingVisible"
			:offerData="offerData"
			@close="settingClose"
			@submit="settingSubmit"
		/>
		<checkDownLoad
			:downLoadVisible="downLoadVisible"
			:downLoadData="downLoadData"
			@close="downLoadClose"
		/>
		<applyAudio
			:offerData="offerData"
			:offerType="offerType"
			:applyAudioVisible="applyAudioVisible"
			@close="applyAudioClose"
			@submit="applyAudioSubmit"
		/>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import aes from '@/plugin/aes_rsa/aes_ecb.js'
import { downloadFun, downloadFunD } from '@/libs/file'
import setting from '../../achievement/components/setOfferHm.vue'
import checkDownLoad from '../../achievement/components/check_download.vue'
import applyAudio from '../../achievement/components/audioApply.vue'
import { mapState } from 'vuex'
import util from '@/libs/util'
import apiAchievement from '@/api/achievement.js'

export default {
  mixins: [mixins],
  name: 'feedback',
  components: { setting, checkDownLoad, applyAudio },
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
      applyAudioVisible: false,
			tableHeight: 'auto',
			sex: [],
			major: [],
      degree_list: [],
			company: [],
			pageSize: 100,
      users: [],
      city: [],
      schoolList: [],
      offerType: '',
      country: [],
      division: [],
      shield: '',
      programSubdivision: '',
      internship_or_full_time: [],
      interview_round_no: [],
      university_type: [],
      common_yes_or_no: [],
      pageSize: 100,
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
      fromDate: '',
      toDate: '',
      userId: 'ALL',
      loading: false,
      division1: null,
      publicStatus: null,
      program_subdivision: [],
      offerList: [],
      resultConfirmS: ['未确认', '已确认', '审核未通过'],
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
      offerData: {},
      downLoadData: {},
      settingVisible: false,
      downLoadVisible: false,
      sortType: 'VIP',
      multipleSelection: []
    }
  },
  mounted () {
    this.init()
		this.initDropDown()
    this.pageInit()
    this.Topage()
  },
  methods: {
		async pageInit () {
			this.degree_list = await this.getDictionary('degree')
			this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
			this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
			this.interview_round_no = await this.getDictionary('interview_round_no')
			this.university_type = await this.getDictionary('university_type')
			this.program_subdivision = await this.getDictionary('program_subdivision')
			this.sex = await this.getDictionary('sex')
			this.major = await this.getMajor()
    },
    init () {
      // 获取用户列表users
      api.getUserListByUserId(this.userInfo.userId).then((res) => {
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
      const division = []
      const basicDivision = []
      this.divisionId.forEach(item => {
        if (item.length == 1) {
          basicDivision.push(item[0])
        } else if (item.length == 2) {
          division.push(item[1])
        }
      })
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        shield: this.shield,
        resultConfirm: '1',
        resultType: '1',
        mosaic: '1',
        programSubdivision: this.programSubdivision,
        finishYear: this.finishYear,
        applySeason: this.applySeason,
        degree: this.degreeId.join(','),
        schoolId: this.schoolId.join(','),
        countryId: this.schoolCountry.join(','),
        universityType: this.universityType.join(','),
        major: this.majorId.join(','),
        companyId: this.companyId.join(','),
        cityId: this.cityId.join(','),
        division: division && division.join(','),
        resultApply: this.resultApply.join(','),
        times: this.times,
        sex: this.sexId,
        offerSalaryFrom: ~~this.offerSalaryFrom,
        offerSalaryTo: ~~this.offerSalaryTo,
        prepareMonth: this.prepareMonth,
        checkStatus: this.checkStatus,
        publicStatus: this.publicStatus,
        fromDate: this.fromDate,
        basicDivision: basicDivision && basicDivision.join(','),
        toDate: this.toDate,
        sort: 'desc',
        sortCol: ''
      }
      if (this.sortType === 'VIP') {
        data.sortCol = 'applySeason desc,updateTime'
      } else if (this.sortType === 'BD') {
        data.sortCol = 'applySeason desc,offerReceiveDate'
      }
      console.log('offer列表参数', data)
      this.loading = true
      apiAchievement.getAchievementList(data).then((res) => {
        console.log('offer列表', res)
        this.offerList = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    checkDownLoadTimes (data, type) {
      this.downLoadVisible = true
      this.downLoadData = { ...data }
      this.downLoadData.downloadType = 'jobOffer'
      this.downLoadData.contentType = type
    },
    // 查看
    download (path) {
      if (!this.roleInfo.includes('vip_offer_hm_list_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, (url) => {
        window.open(url)
      })
    },
    downloadAudio (path) {
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      if (!this.roleInfo.includes('vip_offer_hm_list_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, (url) => {
        window.open(url)
      })
    },
    // 下载
    downloadD (data) {
      if (!this.roleInfo.includes('vip_offer_hm_list_img_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(data)
      const params = {
        keyId: data.pkId,
        downloadType: 'jobOffer',
        contentType: 'offerVoucherMosaic',
        content: data.resultVoucherMosaic
      }
      apiAchievement.saveDownLoad(params).then(res => {
        console.log(res)
        const path = data.resultVoucherMosaic
        console.log(path)
        downloadFunD(path, (url) => {
          window.open(url)
        })
      })
    },
    downloadD2 (data) {
      if (!this.roleInfo.includes('vip_offer_hm_list_img_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(data)
      const params = {
        keyId: data.pkId,
        downloadType: 'jobOffer',
        contentType: 'praiseVoucherMosaic',
        content: data.praiseVoucherMosaic
      }
      apiAchievement.saveDownLoad(params).then(res => {
        console.log(res)
        const path = data.praiseVoucherMosaic
        console.log(path)
        downloadFunD(path, (url) => {
          window.open(url)
        })
      })
    },
    setting (v) {
      this.offerData = { ...v }
      this.settingVisible = true
    },
    settingClose () {
      this.settingVisible = false
    },
    downLoadClose () {
      this.downLoadVisible = false
    },
    settingSubmit () {
      this.settingClose()
      this.Topage()
    },
    setSalesUsed (v) {
      const data = {
        pkId: v.pkId,
        salesUsed: v.salesUsed
      }
      api.setOfferListCheck(data).then((res) => {
        console.log(res)
        // this.Topage();
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      })
    },
    setMktUsed2 (v) {
      console.log(v)
      if (v.publicStatus == '1') {
        const data = {
          pkId: v.pkId,
          mktUsedArticle: v.mktUsedArticle
        }
        api.setOfferListCheck(data).then((res) => {
          console.log(res)
          // this.Topage();
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        })
      } else {
        if (v.mktUsedArticleName == '否') {
          v.mktUsedArticle = '0'
        } else {
          v.mktUsedArticle = '1'
        }
        this.$message.error('此offer不可宣传')
      }
    },
    setMktUsed (v) {
      if (v.publicStatus == '1') {
        const data = {
          pkId: v.pkId,
          mktUsed: v.mktUsed
        }
        console.log(data)
        api.setOfferListCheck(data).then(res => {
          console.log(res)
          // this.Topage(1);
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        })
      } else {
        if (v.mktUsedName == '否') {
          v.mktUsed = '0'
        } else {
          v.mktUsed = '1'
        }
        this.$message.error('此offer不可宣传')
      }
    },
    downloadZip () {
      // let resultVoucherList = this.offerList.map((v) => v.resultVoucherMosaic);
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请先勾选需要下载的内容'
        })
        return
      }
      this.$loading()
      setTimeout(() => {
        this.$loading().close()
      }, 2000)
      const resultVoucherList = this.multipleSelection.map(
        (v) => v.resultVoucherMosaic
      )
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open('POST', `${this.$apiUrl}sign/offer/batchDownload`, true)
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
          var filename = 'offer凭证包_有码.zip' // 如123.xls
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
    downloadAllOffer () {
      // let params ={
      //   kpiPeriod:this.offerList
      // }
      // axios.getMonthRevenueForJerry(params).then(res=>{
      //   console.log(res)
      // })
      // downloadALL() {
      const fileName = '所有offer'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}sign/jobOffer/downloadExcel`,
        true
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
    // },
    },
    casebook () {
      this.$prompt('请输入接收casebook的邮箱', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        api.getCasebookByEmail(value).then(() => {
          this.$message({
            type: 'success',
            message:
              '导出casebook的请求提交成功，生成时间可能较长，请耐心等待！',
            duration: 0,
            showClose: true
          })
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
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
    },
    applyAudio (data) {
      console.log(data)
      this.offerData = { ...data }
      this.offerType = 'jobOffer'
      this.applyAudioVisible = true
    },
    applyAudioClose () {
      this.applyAudioVisible = false
    },
    applyAudioSubmit () {
      this.applyAudioVisible = false
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
