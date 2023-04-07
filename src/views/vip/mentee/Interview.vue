<!--
 * @Author: kaan
 * @Date: 2021-11-25 15:07:10
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-18 15:22:58
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-drawer
      :visible.sync="interviewVisble"
      direction="rtl"
      :before-close="handleClose"
      size="400px">
      <div class="course_detail_container vipMentee" v-loading="loading">
        <div class="mentor_area" style="margin-right:20px">
          <el-button  @click="addOffer" style="margin-bottom:10px" type="primary" size="mini">新增面试</el-button>
          <div class="block_name"  v-for="(item,i) in applyOfferList" :key="i" >
            <div style="text-align:right;margin-bottom:10px">
              <el-tag type="danger" size="medium "  disable-transitions @click="applyToDetail(item.applyId)" style="cursor:pointer;">待审核{{item.applyId}}</el-tag>
            </div>
            <div class="mentee_name" v-for="(item,i) in item.contentNew.text" :key="i">
              <div class="label">{{item.label + ':'}}</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.value">
                  <div slot="reference">{{item.value}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name">
              <div class="label">凭证:</div>
              <div class="value">
                <el-button type="text" @click="download(item.contentNew.info.resultVoucher)" icon="el-icon-download" v-if="item.contentNew.info.resultVoucher">预览</el-button>
                <div v-else>无</div>
              </div>
            </div>
            <div class="mentee_name">
              <div class="label">学生通知截图:</div>
              <div class="value">
                <el-button type="text" @click="download(item.contentNew.info.menteeNoticeVoucher)" icon="el-icon-download" v-if="item.contentNew.info.menteeNoticeVoucher">预览</el-button>
                <div v-else>无</div>
              </div>
            </div>
          </div>
          <div class="block_name" v-for="(item,i) in offerList" :key="'info2-'+i" >
            <div style="text-align:right;margin-bottom:10px">
              <el-tag type="success" size="medium " disable-transitions >已通过</el-tag>
            </div>
            <div class="mentee_name" >
              <div class="label">面试公司：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.companyName">
                  <div slot="reference">{{item.companyName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">面试部门：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.divisionName">
                  <div slot="reference">{{item.divisionName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">城市：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.cityName">
                  <div slot="reference">{{item.cityName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">实习/全职：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.resultApplyName">
                  <div slot="reference">{{item.resultApplyName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" v-if="item.internshipTypeName">
              <div class="label">实习类型：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.internshipTypeName">
                  <div slot="reference">{{item.internshipTypeName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" v-if="item.fullTimeTypeName">
              <div class="label">全职类型：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.fullTimeTypeName">
                  <div slot="reference">{{item.fullTimeTypeName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">面试时间：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.interviewDate">
                  <div slot="reference">{{item.interviewDate || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">申请季：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.applySeason">
                  <div slot="reference">{{item.applySeason || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">面试轮次：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.timesName">
                  <div slot="reference">{{item.timesName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">面试难度：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.difficultyLevel">
                  <div slot="reference">{{item.difficultyLevel || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">面经提供人：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.storyByName">
                  <div slot="reference">{{item.storyByName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">内推面试导师：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.internalMentorName">
                  <div slot="reference">{{item.internalMentorName || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name" >
              <div class="label">面经：</div>
              <div class="value">
                <div>
                  <el-popover
                    placement="left"
                    width="200"
                    trigger="hover"
                    :content="item.story">
                    <div slot="reference"><div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden; ">{{item.story || '无'}}</div></div>
                  </el-popover>
                </div>
                <div>
                  <el-button  @click="applyMenteeInterview(item)" v-if="!item.storyApplyId"  type="text" size="mini">更新面经申请</el-button>
                  <el-button  @click="toApplyDetail(item)" v-else  type="text" size="mini">待审核</el-button>
                </div>
              </div>
              <!-- <div class="label">面经：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.story">l
                  <div slot="reference">{{item.story || '无'}}</div>
                </el-popover>
              </div> -->
            </div>
            <div class="mentee_name" >
              <div class="label">备注：</div>
              <div class="value" >
                <el-popover
                  placement="left"
                  width="200"
                  trigger="hover"
                  :content="item.remark">
                  <div slot="reference">{{item.remark || '无'}}</div>
                </el-popover>
              </div>
            </div>
            <div class="mentee_name">
              <div class="label">凭证:</div>
              <div class="value">
                <el-button type="text" @click="download(item.resultVoucher)" icon="el-icon-download" v-if="item.resultVoucher">预览</el-button>
                <div v-else>无</div>
              </div>
            </div>
            <!-- <div style="text-align:right">
              <el-button  @click="applyMenteeInterview(item)" v-if="!(item.inApplyNum > 0)" style="margin-bottom:10px" type="success" size="mini">更新面经申请</el-button>
            </div> -->
          </div>
        </div>
      </div>
    </el-drawer>
    <applyDetail :applyData="applyData" :recommendDetailVisible="recommendDetailVisible" @close="applyDetailClose" />
    <applyInterview  :applyInterviewVisible="applyInterviewVisible" :applyStatus="applyStatus" :applyInternalData="applyInternalData" :signId="signId" :menteeId="menteeId" :menteeName="menteeName" @close="closeApply"  @submit="submitApply"  />
    <applyInterviewStory :applyInterviewStoryVisible="applyInterviewStoryVisible" @close="closeApplyInterviewStory" :menteeName="menteeName" :interviewData="interviewData" @submit="submitApplyInterviewStory" />
    <applyInterviewList :publicStatus="publicStatus" :interviewListVisble="interviewListVisble"  :signId="signId" :menteeId="menteeId" :menteeName="menteeName" @close="closeList"  @submit="submitList"  />
    <recommend-detail
      :recommendDetailVisible="recommendDetail2Visible"
      :applyData="applyData"
      @close="recommendDetailClose"
    />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import file, { uploadFunBySys } from '@/libs/file'
import applyInterview from './components/apply_interview.vue'
import applyInterviewList from './components/apply_interview_list.vue'
import applyDetail from './components/detailOffer.vue'
import applyInterviewStory from './components/apply_mentee_interview.vue'
import recommendDetail from '../../apply_audit/recommend/detail.vue'

import mixins from '@/plugin/mixins'

export default {
  name: 'offer',
  components: { applyInterview, applyDetail, applyInterviewStory, applyInterviewList, recommendDetail },
  mixins: [mixins],
  data: () => {
    return {
      clickStatus: 999,
      company: [],
      division: [],
      country: [],
      city: [],
      internship_or_full_time: [],
      shield: [],
      apply_season: [],
      resultConfirm: ['未确认', '已确认', '审核未通过'],
      recommendDetailVisible: false,
      applyInterviewStoryVisible: false,
      interviewListVisble: false,
      applyData: {},
      interviewData: {},
      applyStatus: false,
      applyInternalData: {},
      fileList1: [],
      fileList2: [],
      fileResume1: null,
      fileResume2: null,
      pkId: 0,
      offerList: [],
      recommendDetail2Visible: false,
      applyOfferList: [],
      interview_round_no: [],
      applyInterviewVisible: false,
      loading: false
    }
  },
  props: {
    publicStatus:{},
    interviewVisble: {},
    signId: {},
    menteeId: {},
    menteeName: {}
  },
  watch: {
    interviewVisble: function (val, old) {
      if (val) {
        this.pageInit()
        this.Topage()
      }
    }
  },
  mounted () {
  },
  methods: {
    async pageInit () {
      api.getCompanyList().then(res => {
        console.log('company', res)
        this.company = res.data
      })
      this.interview_round_no = await this.getDictionary('interview_round_no')
      this.apply_season = await this.getDictionary('apply_season')
      this.division = await this.getDictionary('division')
      this.country = await this.getDictionary('country')
      this.city = await this.getDictionary('city')
      this.shield = await this.getDictionary('shield')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
    },
    recommendDetailClose(){
      this.recommendDetail2Visible = false
    },
    Topage () {
      this.fileList1 = []
      this.fileList2 = []
      this.fileResume1 = null
      this.fileResume2 = null
      this.loading = true
      api.getVipInterviewList2(this.signId, { resultType: 0 }).then(res => {
        console.log(res, 'yx111111111111111')
        this.pkId = 0
        this.offerList = res.data.resultArr
        if (res.data.applyArr.length > 0) {
          for (let i = 0; i < res.data.applyArr.length; i++) {
            res.data.applyArr[i].contentNew = JSON.parse(res.data.applyArr[i].content)
            res.data.applyArr[i].contentNew.text.splice(0, 1)
          }
          this.applyOfferList = res.data.applyArr
        }
        console.log(this.applyOfferList, 'yx12152454445454')
        this.loading = false
      })
    },
    close () {
      this.$emit('close')
      this.fileList1 = []
      this.fileList2 = []
      this.applyOfferList = []
      this.offerList = []
      this.fileResume1 = null
      this.fileResume2 = null
    },
    applyToDetail (Id) {
      this.applyData = {
        applyId: Id
      }
      this.recommendDetailVisible = true
    },
    applyDetailClose () {
      this.recommendDetailVisible = false
    },
    change1 (file, fileList) {
      this.fileList1 = fileList.slice(-1)
      this.fileResume1 = file
    },
    change2 (file, fileList) {
      this.fileList2 = fileList.slice(-1)
      this.fileResume2 = file
    },
    // 录入信息，确认
    submit (item) {
      console.log('submit', item)
      for (const i in item) {
        if (i != 'division') {
          if (item[i] === '' || item[i] === undefined || item[i] === null) {
            this.$message({
              type: 'error',
              message: '除部门外，所有参数都为必填!'
            })
            return
          }
        }
      }
      if (!this.fileResume1 && !item.resultVoucher) {
        this.$message({
          type: 'error',
          message: '凭证必填'
        })
        return
      }
      const data = {}
      if (!item.pkId) {
        data.addList = [item]
        delete data.addList[0].pkId
      } else {
        data.uptList = [item]
      }
      let canGo = 0
      if (this.fileResume1) {
        canGo++
        uploadFunBySys(
          this.fileResume1.raw,
          `voucher/interview/${this.signId}`,
          url => {
            console.log(url)
            if (!item.pkId) {
              data.addList[0].resultVoucher = url
            } else {
              data.uptList[0].resultVoucher = url
            }
            console.log('凭证参数', data)
            canGo--
            if (!canGo) {
              api
                .setResultList(this.signId, data)
                .then(res => {
                  console.log('提交后', res)
                  this.$message({
                    type: 'success',
                    message: '提交成功'
                  })
                  this.Topage()
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        )
      }
      if (this.fileResume2) {
        canGo++
        uploadFunBySys(
          this.fileResume2.raw,
          `good_figure/interview/${this.signId}`,
          this.signId,
          url => {
            console.log(url)
            if (!item.pkId) {
              data.addList[0].praiseVoucher = url
            } else {
              data.uptList[0].praiseVoucher = url
            }
            console.log('好评图参数', data)
            canGo--
            if (!canGo) {
              api
                .setResultList(this.signId, data)
                .then(res => {
                  console.log('提交后', res)
                  this.$message({
                    type: 'success',
                    message: '提交成功'
                  })
                  this.Topage()
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        )
      }
      console.log('提交参数', data)
      if (!this.fileResume2 && !this.fileResume1) {
        api
          .setResultList(this.signId, data)
          .then(res => {
            console.log('提交后', res)
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.Topage()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    addOffer () {
      api.getDeliverInternalJob(this.menteeId).then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.interviewListVisble = true
        } else {
          this.applyInterviewVisible = true
        }
      })
    },
    toApplyDetail (item){
      api.getApplyDetailByApplyId(item.storyApplyId).then(res => {
        this.recommendDetail2Visible = true
        this.applyData = res.data
        this.applyData.applyStatus = res.data.apply.applyStatus
        this.applyData.applyType = res.data.apply.applyType
        this.applyData.applyId = res.data.apply.applyId
        console.log(res.data)
      })
    },
    applyMenteeInterview (item) {
      this.interviewData = item
      this.applyInterviewStoryVisible = true
      console.log(item, 1111111111)
    },
    closeApplyInterviewStory () {
      this.applyInterviewStoryVisible = false
    },
    submitApplyInterviewStory () {
      this.applyInterviewStoryVisible = false
      this.Topage()
    },
    closeApply () {
      this.applyInterviewVisible = false
    },
    submitApply () {
      this.applyInterviewVisible = false
      this.Topage()
    },
    editOffer (pkId) {
      this.pkId = pkId
    },
    cancel () {
      this.Topage()
    },
    delOffer (i) {
      console.log('delOffer', i)
      this.$confirm('此操作将永久删除该offer, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('删除offer')
          const delList = [{ pkId: i, resultType: '0' }]
          console.log('删除offer', delList)
          api
            .setResultList(this.signId, { delList: delList })
            .then(res => {
              console.log('提交后', res)
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.Topage()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    clickStatusChange (item, i) {
      if (this.clickStatus != i) {
        this.clickStatus = i
      }
    },
    download (path) {
      file.preview(path)
    },
    handleClose () {
      this.$emit('close')
    },
    closeList () {
      this.interviewListVisble = false
    },
    submitList () {
      this.interviewListVisble = false
      this.Topage()
    }
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
.label{
  margin-right: 10px;
  min-width: 120px;
}
.value{
  // color: #FF8C00;
  text-align: right;
  min-width: 80px;
  max-width: 198px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
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
	.add-offer-btn.set-target_yx {
		margin: 15px;
		left: 150px;
		position: absolute;
		top: 0px;
	}
	.set-target_yx .el-form-item__label{
			font-weight: 600;
			color: #222;
	}
	.el-form--inline .el-form-item{
		display: block !important;
	}
	.mentor_area{
		flex: 1;
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
		position: relative;
		padding: 10px;
		border: 1px rgba(0, 0, 0, 0.1) solid;
		border-radius: 4px;
		margin-bottom: 10px;
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
