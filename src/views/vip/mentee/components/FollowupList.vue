<!--
 * @Author: 杨曦
 * @Date: 2021-12-15 15:40:09
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-20 17:07:06
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-table :data="followedUpList" size="mini" highlight-current-row style="width: 100%">
				<el-table-column
					type="expand"
				>
					<template slot-scope="props">
							<el-form label-position="left" label-width="200px" inline class="demo-table-expand" style="margin-left:20px">
									<el-form-item label="内容：">
											<el-link type="primary">{{ props.row.followResult || '无' }}</el-link>
									</el-form-item>
									<el-form-item label="申请进度：">
											<el-link type="primary">{{ props.row.applicationProgress || '无' }}</el-link>
									</el-form-item>
									<el-form-item label="课程进度：">
											<el-link type="primary">{{ props.row.lessonProgress || '无' }}</el-link>
									</el-form-item>
									<el-form-item label="导师对学生的阶段性survey：">
											<el-link type="primary">{{ props.row.mentorFeedback || '无' }}</el-link>
									</el-form-item>
									<el-form-item label="导师survey附件">
										<el-button size="mini" type="success"  v-if="props.row.mentorSurvey" @click="download(props.row.mentorSurvey)">预览</el-button>
											<el-link type="primary" v-else>{{ '无' }}</el-link>
									</el-form-item>
									<el-form-item label="学生阶段心理状态Update：">
											<el-link type="primary">{{ props.row.menteeMentality || '无' }}</el-link>
									</el-form-item>
									<el-form-item label="需要提升和改进的点：">
											<el-link type="primary">{{ props.row.improvePoint || '无' }}</el-link>
									</el-form-item>
                  <el-form-item label="其他补充的点：">
											<el-link type="primary">{{ props.row.otherRemark || '无' }}</el-link>
									</el-form-item>
									<el-form-item label="follow人：">
											<el-link type="primary">{{ props.row.followByName || '无' }}</el-link>
									</el-form-item>
							</el-form>
					</template>
				</el-table-column>
				<el-table-column
						prop="times"
						align="center"
						label="次数"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column
						prop="followStatusName"
						align="center"
						label="状态"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column align="center" label="follow时间" min-width="100" show-overflow-tooltip >
						<template slot-scope="scope">
												<span v-if="scope.row.followTime">{{ scope.row.followTime.slice(0,10)}}</span>
												<el-button type="primary" @click="followUp(scope.row)" v-if="!scope.row.followTime && scope.row.followStatus == 0">follow up</el-button>
						</template>
				</el-table-column>
				<el-table-column
						prop="beginDate"
						align="center"
						label="开始日期"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column
						prop="endDate"
						align="center"
						label="截止日期"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
		</el-table>
	</div>
</template>

<script>
import api from '@/api/vip.js'
import file from '@/libs/file'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'

import { mapState } from 'vuex'
export default {
  name: 'vipFollow33333',
  props: {
    followedUpList: {}
  },
  mixins: [
    mixins
  ],
  data: () => {
    return {
      times: '',
      signId: '',
      pkId: '',
      menteeName: '',
      menteeId: '',
      vipFollowApplyVisible: false,
      clickStatus: 33333,
      menteeId: '',
      loading: false,
      vipMenteeList: [],
      menteeInfo: {},
      orderArr: [],
    }
  },
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  filters: {
    // 上课时间过滤器
    fmtTime: function (value) {
      if (value) {
        return util.fmtDate(new Date(value), 'hh:mm')
      } else {
        return '--:--'
      }
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {

    /**
     * @description: 初始化获取课程分类
     * @param {*}
     * @return {*}
     */
    Topage () {
      api.getFollowUpList(this.userInfo.userId).then(res => {
        console.log(res.data)
        this.vipMenteeList = res.data
      })
    },
    clickStatusChange (item, i) {
      if (this.clickStatus != i) {
        this.clickStatus = i
        this.menteeId = item.menteeId
        // this.initMenteeDetail(item.signId)
        this.initFollowList(item.signId)
        this.loading = true
      }
    },
    initFollowList (signId) {
      api.getFollowInfoBySignId(signId).then(res => {
        console.log(res.data)
        this.followedUpList = res.data.followArr
        this.menteeInfo = res.data
        this.loading = false
      })
    },
    initMenteeDetail (menteeId) {

    },
    toMenteeDetail () {
      this.$router.push({ name: 'UserDetail', query: { menteeId: this.menteeId } })
    },
    followUp (item) {
      this.vipFollowApplyVisible = true
      const data = {
        pkId: item.pkId,
        signId: item.signId,
        times: item.times
      }
      this.$emit('followUp', data)
    },
    updateList () {
      this.Topage()
      this.menteeInfo = {}
      this.clickStatus = 33333
      this.followedUpList = []
      this.vipFollowApplyVisible = false
    },
    followUpItemClose () {
      this.vipFollowApplyVisible = false
    },
    download (path) {
      file.preview(path)
    }
  }
}
</script>

<style lang="scss" scoped>
	.demo-table-expand{
		padding-left: 20px;
	}
</style>
