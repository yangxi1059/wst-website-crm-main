<!--
 * @Author: 库建华
 * @Date: 2019-07-24 15:11:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 17:41:01
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-drawer
      :visible.sync="vipSetVisible"
      title="VIP设置"
      :before-close="handleClose"
      size="340px">
      <div class="course_detail_container vipMentee" v-loading="loading">
        <div class="mentor_area" style="margin-right:20px">
          <el-button  @click="setVip()" style="margin-bottom:10px" type="primary" size="mini">设置</el-button>
          <div class="mb10">规划导师:</div>
          <div v-for="(item,i) in vipListNew.strategistHisArr" :key="i" style="margin-bottom:10px" >
            <div class="block_name"   >
              <div >
                <div>{{item.fromDate}} 至 {{item.toDate}}</div>
                <div class="mentee_name" >
                  <div class="label" >{{item.userName || '无'}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt10 mb10">PM:</div>
          <div v-for="(item,i) in vipListNew.servicesHisArr" :key="i" style="margin-bottom:10px" >
            <div class="block_name"   >
              <div >
                <div>{{item.fromDate}} 至 {{item.toDate}}</div>
                <div class="mentee_name" >
                  <div class="label" >{{item.userName || '无'}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <addSetVip :addSetVipVisible="addSetVipVisible" :signId="signId" :vipList="vipList" :signData="signData" @close="addClsoe" @submit="addSubmit" />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import addSetVip from './addSetVip.vue'
export default {
  components: { addSetVip },
  data: () => {
    return {
      loading: false,
      vipListNew: [],
      addSetVipVisible: false,
      vipList: {}
    }
  },
  props: {
    vipSetVisible: {},
    signId: {},
    signData: {}
  },
  watch: {
    vipSetVisible: function (val, old) {
      if (val) {
        this.Topage()
        console.log(this.signData)
      }
    }
  },

  methods: {
    Topage () {
      this.loading = true
      api.setVipList(this.signId).then(res => {
        this.loading = false
        this.vipListNew = res.data
        console.log(res)
      })
    },
    handleClose () {
      this.$emit('close')
    },
    addClsoe () {
      this.addSetVipVisible = false
    },
    addSubmit () {
      this.addSetVipVisible = false
      this.Topage()
    },
    setVip () {
      this.vipList = {
        services: this.signData.services || '',
        strategist: this.signData.strategist || ''
      }
      this.addSetVipVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

$background-color:#F4F4F4;
*{
  box-sizing: border-box;
}
.label{
  margin-right: 10px;
  // min-width: 120px;
}
.value{
  // color: #FF8C00;
  text-align: right;
  // max-width: 198px;
  // min-width: 80px;
  flex: 1;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.course_detail_container{
  background-color:#F4F4F4;
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
