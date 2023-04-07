<!--
 * @Author: kaan
 * @Date: 2021-11-25 15:07:10
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-12 15:16:48
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="course_detail_container vipMentee">
      <div class="mentor_area">
        <div class="wait_title">待FOLLOW列表(条数：{{vipMenteeList.length}})</div>
        <div class="block_name" v-for="(item,i) in vipMenteeList" :key="i" @click="clickStatusChange(item,i)" :class="clickStatus == i?'hignLight':''">
          <div class="mentee_name">
            <div class="label">学员名称：</div>
            <div class="value">{{item.menteeName}}</div>
          </div>
          <div class="mentee_name">
            <div class="label">开始日期：</div>
            <div class="value">{{item.beginDate}}</div>
          </div>
          <div class="mentee_name">
            <div class="label">截止日期：</div>
            <div class="value">{{item.endDate}}</div>
          </div>
          <div class="mentee_name">
            <div class="label">项目名称：</div>
            <div class="value">{{item.programName}}</div>
          </div>
        </div>
      </div>
			<div>

      <div class="user_detail_area" v-if="menteeInfo.menteeName" v-loading="loading" style="width:300px" >
        <el-button type="primary" class="toProgramDetail" @click="toMenteeDetail(menteeInfo.menteeId)" v-if="menteeInfo.menteeName">学员详情<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				<!-- 头像姓名模块 -->
        <div class="user_detail_info" v-if="menteeInfo.menteeName">
          <div class="user_detail_info_pic">
            <el-avatar :size="100" :src="menteeInfo.menteeHeadImage" ></el-avatar>
          </div>
        </div>
        <!-- 基本信息模块 -->
        <div class="user_detail_info_basic" >
          <el-descriptions title="基本信息：" :column="1" size="medium">
            <el-descriptions-item label="学员名">{{menteeInfo.menteeName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="微信">{{menteeInfo.wxId || "无"}}</el-descriptions-item>
            <el-descriptions-item label="微信名">{{menteeInfo.wxName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{menteeInfo.email || "无"}}</el-descriptions-item>
            <el-descriptions-item label="学校">{{menteeInfo.schoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="专业">{{menteeInfo.major || "无"}}</el-descriptions-item>
            <el-descriptions-item label="毕业年份">{{menteeInfo.finishYear || "无"}}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="项目信息：" :column="1" size="medium">
            <el-descriptions-item label="项目名称">{{menteeInfo.programName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="项目周期">{{`${menteeInfo.period}${menteeInfo.periodUnit}`}}</el-descriptions-item>
            <el-descriptions-item label="Strategist">{{menteeInfo.strategistName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="PM">{{menteeInfo.pmName || "无"}}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
			</div>
      <div class="course_area" v-if="followedUpList.length > 0"  v-loading="loading" >
				<!-- <el-button  type="primary" v-if="followedUpList.length > 0" @click="followUp">发起Follow</el-button> -->
        <followTable :followedUpList="followedUpList" @followUp="followUp" />
				<!-- <el-table :data="followedUpList" size="mini" highlight-current-row style="width: 100%">
					<el-table-column
					type="expand"
					>
						<template slot-scope="props">
							<el-form label-position="left" label-width="200px" inline class="demo-table-expand">
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
								</el-form-item>
								<el-form-item label="学生阶段心理状态Update：">
									<el-link type="primary">{{ props.row.menteeMentality || '无' }}</el-link>
								</el-form-item>
								<el-form-item label="需要提升和改进的点：">
									<el-link type="primary">{{ props.row.improvePoint || '无' }}</el-link>
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
				</el-table> -->
      </div>
    </div>
    <vipFollow :vipFollowApplyVisible="vipFollowApplyVisible" @changepage="updateList" @close="followUpItemClose" :menteeId="menteeId" :menteeName="menteeName" :pkId="pkId" :signId="signId" :times="times" ref="child"></vipFollow>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import file from '@/libs/file'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'
import vipFollow from './components/Followup.vue'
import followTable from './components/FollowupList.vue'
import { mapState } from 'vuex'
export default {
  name: 'vipFollow22',
  mixins: [
    mixins
  ],
  components: { vipFollow, followTable },
  data: () => {
    return {
      times: '',
      signId: '',
      pkId: '',
      menteeName: '',
      menteeId: '',
      vipFollowApplyVisible: false,
      clickStatus: 33333,
      menteeId:'',
      loading:false,
      vipMenteeList: [],
      menteeInfo: {},
      orderArr: [],
      followedUpList: []
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
    clickStatusChange (item,i) {
      if (this.clickStatus != i) {
        this.clickStatus = i
        this.menteeId = item.menteeId
        // this.initMenteeDetail(item.signId)
        this.initFollowList(item.signId)
        this.loading = true;
      }
    },
    initFollowList (signId) {
      api.getFollowInfoBySignId(signId).then(res => {
        console.log( res.data)
        this.followedUpList = res.data.followArr;
        this.menteeInfo = res.data
        this.loading = false;
      })
    },
    initMenteeDetail (menteeId) {
      // const params = {
      //   menteeId: menteeId
      // }
      // console.log(params)
      // api.getMenteeDetail(params).then(res => {
      //   console.log(res)
      //   if (res.code == '200') {
      //     this.menteeInfo = res.data.menteeInfo
      //     this.orderArr = res.data.orderArr
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    toMenteeDetail () {
      this.$router.push({ name: 'UserDetail', query: { menteeId: this.menteeId } })
    },
    followUp (item) {
      this.vipFollowApplyVisible = true
      this.menteeName = this.menteeInfo.menteeName
      this.menteeId = this.menteeInfo.menteeId
      this.pkId = item.pkId
      this.signId = item.signId
      this.times = item.times
      console.log(this.menteeInfo, this.vipFollowApplyVisible)
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
    download(path){
      file.preview(path)
    },
  }
}
</script>

<style lang="scss" scoped>
$background-color:#F4F4F4;
*{
  box-sizing: border-box;
}
.course_detail_container{
  height: 100%;
  overflow: hidden;
  display: flex;
}
.vipMentee{
  .toProgramDetail{
    position: absolute;
    right: 0;
    top: 0;
  }
  .wait_title{
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 10px;
    color: rgb(255, 140, 0);
  }
	.el-form--inline .el-form-item{
		display: block !important;
	}
	.mentor_area{
		width: 300px;
		min-width: 300px;
		height:100%;
    overflow-y: auto;
		padding:10px;
		background: #FFF;
		border-radius: 10px;
		.top_status_bar{
			display: flex;
			align-items: center;
		}
		.mentor_list{
			margin-right:-10px;
			// padding-left:20px;
			.mentor_item{
				width:100%;
				height:auto;
				margin-top:15px;
				border-radius: 5px 0 0 5px;
				box-shadow: -5px 0px 5px #c5c5c5;
				overflow: hidden;
				.mentor_item_content{
					height:40px;
					padding:10px;
					align-items: center;
					display: flex;
					.mentor_item_content_title{
						width:100px;
					}
					.mentor_item_content_progress{
						flex:1;
					}
				}
				.mentor_item_model_content{
					padding:0 10px;
					display: flex;
					justify-content: space-between;
					.mentor_item_model{
						margin-bottom:20px;
						padding:10px 20px;
						width:120px;
						height:80px;
						background: $background-color;
						border-radius: 10px;
						box-sizing: border-box;
						.mentor_item_model_title{
							font-size:12px;
							margin-bottom:10px;
							color:#888
						}
						.mentor_item_model_value{
							height:24px;
							line-height:24px;
							padding-left:10px;
							font-size:20px;
							border-left: 4px solid #FF8C00
						}
						.can_click{
							cursor: pointer;
							text-decoration:underline
						}
					}
				}
				.mentor_item_title{
					padding:0 10px;
					width:100%;
					height:60px;
					background-color:#ff8c007a;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.mentor_item_title_name{
						font-size: 20px;
						margin-right:10px;
					}
					.mentor_item_title_icon{
						font-size:18px;
						cursor: pointer;
					}
				}
			}
		}
	}

	.course_area{
    overflow-y: auto;
		flex: 1;
		height:100%;
		margin-left:20px;
		padding:10px;
		background: #FFF;
		border-radius: 10px;
	}

	.block_name{
		padding: 10px;
		border: 1px rgba(0, 0, 0, 0.1) solid;
		border-radius: 4px;
		margin-bottom: 10px;
		cursor: pointer;
		line-height: 24px;
	}
	.mentor_area .block_name:last-child{
		margin-bottom: 0px;
	}
	.hignLight{
		border-color: #FF8C00;
	}
}
.mentee_name{
    display: flex;
    justify-content: space-between;
  }
.demo-table-expand{
	padding-left: 20px;
	.el-form--inline .el-form-item{
		display: block;
	}
}
// 左侧学员个人信息
.user_detail_area{
  position: relative;
  overflow-y: auto;
	width: 300px;
	margin-left:20px;
  min-width: 300px;
  height:100%;
  background: #FFF;
  border-radius: 10px;
  // 头像姓名ID
  .user_detail_info{
    padding:30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .user_detail_info_pic{
      position: relative;
      .sex_icon{
        position: absolute;
        bottom:5px;
        right:0;
        width:28px;
        height:28px;
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
    .user_detail_info_name{
      font-size:20px;
      font-weight:700;
    }
  }
  
  // 按钮区
  .user_detail_info_btn_area{
    width:100%;
    height:50px;
    padding:10px 0;
    border-top:1px solid $background-color;
    border-bottom:1px solid $background-color;
    .user_detail_info_btn{
      float: left;
      width:15%;
      line-height:30px;
      text-align: center;
      font-weight:700;
      cursor: pointer;
      border-left:1px solid $background-color;
      border-right:1px solid $background-color;
    }
    .user_detail_info_btn:hover{
      color:#FFF;
      background: #FF8C00;
    }
  }
  // 基本信息
  .user_detail_info_basic{
    margin-top:20px;
    padding:0 20px;
  }
  // 联系方式
  .user_detail_info_contact{
    padding:0 20px;
    .user_detail_info_contact_title{
      font-size:18px;
      font-weight:800;
    }
    .user_detail_info_contact_list{
      padding-top:15px;
      .user_detail_info_contact_item{
        width:100%;
        padding-bottom:15px;
        display: flex;
        align-items: center;
        .icon_size{
          font-size:20px;
          width:40px;
          height:40px;
          border-radius: 50%;
          background-color: #f4f4f5;
          color: #909399;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .contact_item{
          margin-left:20px
        }
      }
    }
  }
}
</style>
