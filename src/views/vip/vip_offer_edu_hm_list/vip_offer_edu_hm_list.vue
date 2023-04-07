<!--
 * @Author: 库建华
 * @Date: 2020-04-13 17:16:47
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-25 14:40:15
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
		<div class="feedback d2_container" ref="d2">
			<div class="search_page" ref="search">
				<div class="search">
					<el-input
						class="mr10"
						size="mini"
						style="width:120px"
						v-model="search"
						clearable
						placeholder="学员名，微信名，微信ID"
						@keyup.enter.native="Topage(1)"
					></el-input>
					<el-select
						class="mr10"
						size="mini"
						style="width:120px"
						v-model="userId"
						clearable
						filterable
						placeholder="用户"
						@change="Topage(1)"
					>
						<el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
					</el-select>
					<el-select
						class="mr10"
						style="width:120px"
						size="mini"
						v-model="entranceType"
						clearable
						filterable
						placeholder="类型"
						@change="Topage(1)"
					>
						<el-option
							v-for="item in entrance_type"
							:key="item.itemValue"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select>
					<el-select
						class="mr10"
						size="mini"
						style="width:120px"
						v-model="schoolId"
						clearable
						filterable
						placeholder="学校"
						@change="Topage(1)"
					>
						<el-option
							v-for="(item,i) in school"
							:key="i"
							:label="item.chiName"
							:value="item.schoolId"
						></el-option>
					</el-select>
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
					<el-select
						class="mr10"
						size="mini"
						v-model="publicStatus"
						style="width:120px"
						clearable
						placeholder="可宣传"
						@change="Topage(1)"
					>
						<el-option
							v-for="(item) in common_yes_or_no"
							:key="item.itemVale"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select>

					<!-- <el-select
						class="mr10"
						size="mini"
						v-model="shield"
						style="width:120px;"
						clearable
						placeholder="是否屏蔽学校"
						@change="Topage(1)"
					>
						<el-option
							v-for="(item,i) in common_yes_or_no"
							:key="i"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select> -->

					<el-date-picker
						class="mr10"
						size="mini"
						v-model="applySeason"
						type="year"
						clearable
						style="width:120px"
						value-format="yyyy"
						@change="Topage(1)"
						placeholder="申请季"
					></el-date-picker>
					<el-button icon="el-icon-search" class="mr10 ml0" size="mini" plain @click="Topage(1)">GO</el-button>
					<!-- <el-button
						icon="el-icon-download"
						class="ml0"
						size="mini"
						plain
						v-if="roleInfo.includes('offer_edu_hm_list_downloadZip')"
						@click="downloadZip"
					>下载</el-button> -->
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
				<!-- @selection-change="handleSelectionChange" -->
				<!-- <el-table-column align="center" type="selection" width="41" v-if="roleInfo.includes('offer_edu_hm_list_downloadZip')"></el-table-column> -->
				<el-table-column align="center" label="按钮功能区">
					<el-table-column
						align="center"
						label="操作"
						width="110"
						v-if="roleInfo.includes(`vip_offer_edu_hm_list_setting`)"
					>
						<template slot-scope="scope">
							<div style="display:flex;justify-content:center">
								<el-button type="text" size="mini" v-if="roleInfo.includes(`vip_offer_edu_hm_list_setting`)" @click="setting(scope.row)">核验</el-button>
								<!-- <el-button type="text" size="mini" v-if="roleInfo.includes(`offer_edu_hm_list_audio`)" @click="applyAudio(scope.row)">音频申请</el-button> -->
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="sales已用" width="120">
						<template slot-scope="scope">
							{{scope.row.salesUsed == '1'?'是':'否'}}

							<!-- <el-switch
								:disabled="!roleInfo.includes(`offer_edu_hm_list_set_salesUsed`)"
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
								:disabled="!roleInfo.includes(`offer_edu_hm_list_set_mktUsed`)"
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
							<div class="colorR" v-if="scope.row.checkStatusName == '未通过'">
								<el-popover
									placement="top-start"
									width="200"
									trigger="hover"
									:content="scope.row.checkNote || '无'"
								>
									<p slot="reference">
										<i class="el-icon-info"></i>未通过
									</p>
								</el-popover>
							</div>
							<div v-else>{{scope.row.checkStatusName}}</div>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column align="center" label="学员信息">
					<el-table-column min-width="100" align="center" prop="menteeName" label="学员名" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="sex" label="学员性别"></el-table-column>
					<el-table-column min-width="100" align="center" prop="schoolChiName" label="学校" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="degreeName" label="学历"></el-table-column>
					<el-table-column min-width="100" align="center" prop="majorName" label="专业" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
				</el-table-column>
				<el-table-column align="center" label="offer信息">
					<el-table-column min-width="100" align="center" prop="entranceTypeName" label="类型" show-overflow-tooltip></el-table-column>
					<el-table-column min-width="100" align="center" prop="entranceOfferProgramName" label="专业项目" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="prepareMonth" label="准备周期（月）"></el-table-column>
					<el-table-column min-width="100" align="center" prop="offerReceiveDate" label="offer获得日期"></el-table-column>
					<el-table-column min-width="100" align="center" prop="chiName" label="升学学校" show-overflow-tooltip></el-table-column>
					<el-table-column min-width="100" align="center" prop="instituteChiName" label="学院" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="applySeason" label="申请季"></el-table-column>
					<el-table-column align="center" prop="story" label="小故事">
						<template slot-scope="scope">
							<el-popover width="400" trigger="hover" :content="scope.row.story">
								<p class="w80" slot="reference">{{scope.row.story}}</p>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column min-width="180" align="center" prop="offerVoucherMosaic" label="凭证">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.offerVoucherMosaic"
								@click="download(scope.row.offerVoucherMosaic)"
							>查看</el-button>
							<el-button
								size="mini"
								type="text"
								v-if="scope.row.offerVoucherMosaic"
								@click="downloadD(scope.row)"
							>下载</el-button>
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
					<!-- <el-table-column align="center" prop="resultConfirm" label="状态"></el-table-column> -->
					<el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" sortable prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				</el-table-column>
				<el-table-column align="center" label="工作信息">
					<el-table-column align="center" prop="shieldName" label="屏蔽学生学校"></el-table-column>
					<el-table-column align="center" prop="publicStatusName" label="可宣传"></el-table-column>
					<el-table-column align="center" prop="displayStatusName" label="官网展示"></el-table-column>
				</el-table-column>
				<el-table-column align="center" label="项目信息">
					<el-table-column align="center" prop="mentorHour" label="签约行业导师课时数"></el-table-column>
					<el-table-column min-width="200" align="center" prop="programName" label="项目名称" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="programPeriod" label="项目周期"></el-table-column>
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
import api from '@/api/vip.js'
import apiAchievement from '@/api/achievement.js'
import { downloadFun, downloadFunD } from '@/libs/file'
import aes from '@/plugin/aes_rsa/aes_ecb.js'
import setting from '../../achievement/components/setEduOfferHm.vue'
import checkDownLoad from '../../achievement/components/check_download.vue'
import applyAudio from '../../achievement/components/audioApply.vue'
import { mapState } from 'vuex'
import util from '@/libs/util'
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
			tableHeight: 'auto',
      applyAudioVisible: false,
      offerList: [],
      pageNum: 1,
      total: 0,
      search: null,
      pageSize: 100,
      schoolId: null,
      school: [],
      userId: 'ALL',
      users: [],
      loading: false,
      entranceType: null,
      entrance_type: [],
      common_yes_or_no: [],
      downLoadVisible: false,
      checkStatus: null,
      publicStatus: null,
      shield: null,
      applySeason: null,
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
      displayStatusS: [
        {
          itemName: '不显示',
          itemVale: 0
        },
        {
          itemName: '显示',
          itemVale: 1
        }
      ],
      offerData: {},
      offerType: '',
      downLoadData: {},
      settingVisible: false,

      multipleSelection: []

    }
  },
  mounted () {
    this.pageInit()
    api.getUserListByUserId(this.userInfo.userId).then(res => {
      console.log('vip列表', res)
      this.users = res.data
      this.users.unshift({ userName: 'ALL', userId: 'ALL' })
    })
    this.Topage(1)
  },
  methods: {
		async pageInit () {
			this.entrance_type = await this.getDictionary('entrance_type')
			this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
			this.school = await this.getSchool("school")
    },
    Topage () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        mosaic: '1',
        checkStatus: this.checkStatus,
        publicStatus: this.publicStatus,
        shield: this.shield,
        applySeason: this.applySeason,
        entranceType: this.entranceType,
        schoolId: this.schoolId
      }
      console.log('offer列表参数', data)
      this.loading = true
      api.getOfferEduList(data).then(res => {
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
      if (!this.roleInfo.includes('vip_offer_edu_hm_list_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    downloadAudio (path) {
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      if (!this.roleInfo.includes('vip_offer_edu_hm_list_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    // 下载
    downloadD (data) {
      if (!this.roleInfo.includes('vip_offer_edu_hm_list_img_view_hm')) {
        this.$message('无权限')
        return
      }
      const params = {
        keyId: data.pkId,
        downloadType: 'entranceOffer',
        contentType: 'offerVoucherMosaic',
        content: data.offerVoucherMosaic
      }
      apiAchievement.saveDownLoad(params).then(res => {
        const path = data.offerVoucherMosaic
        console.log(path)
        downloadFunD(path, url => {
          window.open(url)
        })
      })
    },
    downloadD2 (data) {
      if (!this.roleInfo.includes('vip_offer_edu_hm_list_img_down_hm')) {
        this.$message('无权限')
        return
      }
      const params = {
        keyId: data.pkId,
        downloadType: 'entranceOffer',
        contentType: 'praiseVoucherMosaic',
        content: data.praiseVoucherMosaic
      }
      apiAchievement.saveDownLoad(params).then(res => {
        const path = data.praiseVoucherMosaic
        console.log(path)
        downloadFunD(path, url => {
          window.open(url)
        })
      })
    },
    setting (v) {
      this.offerData = { ...v }
      this.settingVisible = true
    },
    downLoadClose () {
      this.downLoadVisible = false
    },
    checkDownLoadTimes (data, type) {
      this.downLoadVisible = true
      this.downLoadData = { ...data }
      this.downLoadData.downloadType = 'entranceOffer'
      this.downLoadData.contentType = type
    },
    settingClose () {
      this.settingVisible = false
    },
    settingSubmit () {
      this.settingClose()
      this.Topage(1)
    },
    setSalesUsed (v) {
      console.log(v)
      const data = {
        pkId: v.pkId,
        salesUsed: v.salesUsed
      }
      console.log(data)
      api.setOfferEduV2(data).then(res => {
        console.log(res)
        // this.Topage(1);
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      })
    },

    downloadZip () {
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
      const resultVoucherList = this.multipleSelection.map((v) => v.offerVoucherMosaic)
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open('POST', `${this.$apiUrl}sign/offer/batchDownload`, true)
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
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
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    applyAudio (data) {
      console.log(data)
      this.offerData = { ...data }
      this.offerType = 'entranceOffer'
      this.applyAudioVisible = true
    },
    applyAudioClose () {
      this.applyAudioVisible = false
    },
    applyAudioSubmit () {
      this.applyAudioVisible = false
      this.Topage()
    },
    setMktUsed2 (v) {
      console.log(v)
      if (v.publicStatus == '1') {
        const data = {
          pkId: v.pkId,
          mktUsedArticle: v.mktUsedArticle
        }
        api.setOfferEduV2(data).then((res) => {
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
        api.setOfferEduV2(data).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.w80{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 100%;
}
.d2_container{
  width:100%;
  height:100%
}
</style>
