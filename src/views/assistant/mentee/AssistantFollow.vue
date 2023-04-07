<!--
 * @Author: kaan
 * @Date: 2021-11-25 15:07:10
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-13 19:24:36
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="course_detail_container assistantMentee">
      <div class="mentor_area">
        <div class="wait_title">待FOLLOW列表(条数：{{assistantMenteeList.length}})</div>
        <div class="block_name" v-for="(item,i) in assistantMenteeList" :key="i" @click="clickStatusChange(item,i)" :class="clickStatus == i?'hignLight':''">
          <div class="mentee_name">
            <div class="label">微信名：</div>
            <div class="value">{{item.wxName}}</div>
          </div>
          <div class="mentee_name">
            <div class="label">微信ID：</div>
            <div class="value">{{item.wxId}}</div>
          </div>
        </div>
      </div>
			<div>

      <div class="user_detail_area" v-if="menteeInfo.menteeId" v-loading="loading" style="width:300px" >
        <el-button type="primary" class="toProgramDetail" @click="toMenteeInfo(menteeInfo.menteeId)" v-if="menteeInfo.menteeId">学员详情<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				<!-- 头像姓名模块 -->
        <div class="user_detail_info" v-if="menteeInfo.menteeId">
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
        </div>
      </div>
			</div>
      <div class="course_area" v-if="menteeInfo.followArr.length > 0"  v-loading="loading" >
        <FollowTable :followedUpList="menteeInfo.followArr" @followUp="followUp" />
      </div>
    </div>
    <MenteeInfo
      :menteeInfoVisible="menteeInfoVisible"
      :menteeId="menteeId"
      @close="menteeInfoClose"
    />
  </d2-container>
</template>

<script>
import api from '@/api/assistant.js'
import file from '@/libs/file'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'
import FollowTable from './components/FollowupList.vue'
import MenteeInfo from './components/MenteeInfo'
import { mapState } from 'vuex'
export default {
  name: 'AssistantFollow',
  mixins: [
    mixins
  ],
  components: { MenteeInfo, FollowTable },
  data: () => {
    return {
      times: '',
      signId: '',
      pkId: '',
      menteeName: '',
      menteeId: '',
      clickStatus: 33333,
      loading:false,
      assistantMenteeList: [],
      menteeInfo: {followArr:[]},
      orderArr: [],
      
      menteeInfoVisible:false,
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
      let params = {
        pageNum: 1,
        pageSize: 9999,
        userId: this.userInfo.userId
      }
      api.getFollowUpListTodayAssistant(params).then(res => {
        console.log(res.data)
        this.assistantMenteeList = res.data.rows
        if(this.assistantMenteeList.length>0){
          this.clickStatusChange(this.assistantMenteeList[0],0)
        }
        
      })
    },
    clickStatusChange (item,i) {
      console.log(item)
      if (this.clickStatus != i) {
        this.clickStatus = i
        this.menteeId = item.menteeId
        this.getFollowUpList()
        this.loading = true;
      }
    },
    getFollowUpList () {
      let params = {
        menteeId: this.menteeId
      }
      api.getMenteeInfoAndFollowList(params).then(res => {
        console.log("getMenteeInfoAndFollowList",res)
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
    toMenteeInfo(id) {
      this.menteeId = data.menteeId
      this.menteeInfoVisible = true;
    },
    menteeInfoClose(){
      this.menteeInfoVisible = false;
    },
    followUp () {
      this.Topage()
      this.menteeInfo= {followArr:[]}
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
.assistantMentee{
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
