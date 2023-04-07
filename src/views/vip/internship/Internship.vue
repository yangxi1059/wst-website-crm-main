<!--
 * @Author: 库建华
 * @Date: 2019-12-13 16:46:19
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-01 13:07:35
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container>
    <div class="course_detail_container vipMentee" v-loading="loading">
      <div class="course_detail_container">
        <div class="mentor_area">
          <div class="search">
            <el-input
              class="mr10"
              v-if="roleInfo.includes(`internship_search`)"
              size="mini"
              v-model="search"
              clearable
              placeholder="支持实习单位名"
              @keyup.enter.native="Topage(1)"
              :style="{width:'192px'}"
            ></el-input>
            <el-button
              v-if="roleInfo.includes(`internship_search`)"
              icon="el-icon-edit-outline"
              class=" "
              size="mini"
              plain
              @click="Topage()"
            >GO</el-button>
          </div>
          <div class="block_name" v-for="(item,i) in tableData" :key="i" @click="clickStatusChange(item,i)" :class="clickStatus == i?'hignLight':''">
            <div class="mentee_name">
              <div class="label">实习单位：</div>
              <div class="value">{{item.internshipDesc}}</div>
            </div>
            <div class="mentee_name">
              <div class="label">实习单位状态：</div>
              <div class="value">{{item.recordStatusName}}</div>
            </div>
            <div class="mentee_name">
              <div class="label">已安排实习：</div>
              <div class="value">{{item.arrangeNum}} / {{item.totalNum}}</div>
            </div>
            <div class="mentee_name">
              <div class="label">已支付实习：</div>
              <div class="value">{{item.payNum}} / {{item.totalNum}}</div>
            </div>
          </div>
        </div>
        <div class="detail_block" style="overflow-y: auto;">
          <mentee-list
            ref="child"
            :toMenteeListInternshipId="toMenteeListInternshipId"
            @close="menteeListClose"
            @submit="menteeListSubmit"
          />
        </div>
      </div>
      
      
    </div>
  </d2-container>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import menteeList from './components/MenteeList.vue'
import { mapState } from 'vuex'

export default {
  name: 'internship',
  components: { menteeList },
  data () {
    return {
      height: document.documentElement.clientHeight - 120,
      pageNum: 0,
      total: 0,
      pageSize:9999,
      search: '',
      internship: '',
      clickStatus:9999,
      internshipList: [],
      tableData: [],
      toMenteeListInternshipId: '',
      menteeListVisible: false,
      loading:false,
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        internship: this.internship,
        search: this.search,
        sortCol: this.sortCol,
        sort: this.sort
      }
      this.loading = true;
      apiDic
        .getInternshipList(params)
        .then(res => {
          console.log(res, 'yx实习列表数据***************')
          this.total = res.data.total
          this.tableData = res.data.rows
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '数据请求出错'
          })
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
    // 排序--全局
    sortTable (v) {
      const orderToSort = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.sort = orderToSort[v.order] || null
      this.sortCol = v.prop
      console.log(this.sortCol)
      this.Topage()
    },
    toMenteeList (internshipId) {
      this.toMenteeListInternshipId = internshipId.toString()
      this.$refs.child.Topage(this.toMenteeListInternshipId);
      console.log(this.toMenteeListInternshipId)
    },
    menteeListClose () {
      this.menteeListVisible = false
    },
    menteeListSubmit () {
      this.Topage()
    },
    clickStatusChange (item,i) {
      if (this.clickStatus != i) {
        console.log(item)
        this.clickStatus = i
        this.toMenteeList(item.internship)
      }
    },
    initFollowList(){
      
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
    margin-right: 20px;
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
  .mentee_name{
    display: flex;
    justify-content: space-between;
    .label{
      min-width: 100px;
    }
    .value{
      flex: 1;
      text-align: right;
    }
  }
	.block_name{
		padding: 10px;
		border: 1px rgba(0, 0, 0, 0.1) solid;
		border-radius: 4px;
		margin-top: 10px;
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
  .search_page{
    display: inline-block;
  }
  .detail_block{
    height: 100%;
    overflow-y: auto;
  }
  .search{
    margin-bottom: 20px;
  }
}
</style>

