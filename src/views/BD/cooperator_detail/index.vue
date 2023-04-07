<!--
 * @Author: 库建华
 * @Date: 2020-07-04 13:35:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-13 11:00:28
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container v-loading="vloading">
    <div class="user_detail_container">
        <div class="user_detail_area">
          <div class="user_detail_info_basic">
            <el-descriptions title="基本信息" :column="1" size="mini">
              <template slot="extra">
                <el-button v-if="roleInfo.includes(`BD_cooperator_edit`)" type="primary" size="mini"   @click.stop="edit">编辑</el-button>
                <el-button type="primary" @click="payAccount" v-if="roleInfo.includes(`BD_cooperator_pay`)">账户</el-button>
                <el-button type="danger" @click="deleteCooperator" v-if="roleInfo.includes(`BD_cooperator_delete`)">删除</el-button>
              </template>
              <el-descriptions-item  label="合作方名称">{{data.cooperatorName||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="针对国家/地区">{{data.countryName||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="合作方电话">{{data.tel||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="合作方邮箱">{{data.email||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="对接人微信ID">{{data.wxId||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="对接人名称">{{data.principal||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="对接人职位">{{data.principalPosition||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="公众号头条平均阅读量">{{data.officialAccountAverageReading||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="头条单位阅读量价格(￥)">{{data.averageReadingPrice||'无'}}</el-descriptions-item>
              <el-descriptions-item v-if="data.cooperatorType == '媒体投放'" label="公众号次条平均阅读量">{{data.officialAccountSecondAverageReading||'无'}}</el-descriptions-item>
              <el-descriptions-item v-if="data.cooperatorType == '媒体投放'" label="次条单位阅读量价格(￥)">{{data.secondAverageReadingPrice||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="公众号ID">{{data.officialAccountId||'无'}}</el-descriptions-item>
              <el-descriptions-item  label="公众号名称">{{data.officialAccountName||'无'}}</el-descriptions-item>
              <el-descriptions-item v-if="data.cooperatorType == '媒体投放'" label="公众号类型">{{data.officialAccountType||'无'}}</el-descriptions-item>
              <el-descriptions-item v-if="data.cooperatorType == '媒体投放'" label="公众号粉丝数">{{data.recommendMenteeNum||'无'}}</el-descriptions-item>
              <el-descriptions-item v-if="data.cooperatorType == '媒体投放'" :label="data.cooperatorType == '媒体投放'?'公众号+人物画像':'合作方简介'">{{data.cooperatorIntroduction||'无'}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions class="mt10" title="WST合作信息" :column="1" size="mini">
                <el-descriptions-item  style="" label="Code">{{data.uniqueCode||'无'}}<el-button style="padding:0px" @click="changeCode"  v-if="roleInfo.includes(`cooperator_changeCode`)" type="text" class="ml10" size="mini">修改code</el-button></el-descriptions-item>
                <el-descriptions-item  label="合作商类型">{{data.cooperatorTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="合作状态">{{data.cooperatorStatusName||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="管理人">{{data.manageByName||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="初次对接日期">{{data.firstDockingDate||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="是否收费">{{data.chargeStatusName||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="本次合作金额">{{data.salaryType ||''}}{{data.salary ||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="返佣规则">{{data.brokerageStatusName||'无'}}</el-descriptions-item>
                <el-descriptions-item v-if="data.brokerageStatus == 'fixed_brokerage'" label="固定返佣金额">{{data.fixedBrokerage||'无'}}($)</el-descriptions-item>
                <el-descriptions-item  label="返佣金额">{{data.brokerage||'无'}}</el-descriptions-item>
                <el-descriptions-item  label="已推荐学员">{{data.recommendMenteeNum||'无'}}</el-descriptions-item>
                <el-descriptions-item v-if="data.cooperatorType == '媒体投放'" :label="data.cooperatorType == '媒体投放'?'详细报价':'沟通进度反馈'">{{data.communicateFeedback||'暂无更多进程反馈'}}</el-descriptions-item>
                <el-descriptions-item  label="其他">{{data.other||'暂无其他信息'}}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        <div class="user_detail_operation">
          <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="一览" name="first">
              <div class="user_detail_operation_block">
                <el-card shadow="always" class="box-card" >
                  <div slot="header" class="clearfix">
                    <span>合同</span>
                    <el-button class="btn_clearfix" v-if="roleInfo.includes(`BD_cooperator_contract`)" type="primary" size="mini" @click.stop="contract">签约/续约</el-button>
                  </div>
                  <el-table :data="contractArr" size="mini" highlight-current-row>
                      <el-table-column align="center" prop="contractName" label="合同名称" min-width="80"></el-table-column>
                      <el-table-column
                      align="center"
                      prop="contractStatusName"
                      label="合同状态"
                      min-width="80"
                      ></el-table-column>
                      <el-table-column
                      align="center"
                      prop="contractStartDate"
                      label="开始日期"
                      min-width="80"
                      ></el-table-column>
                      <el-table-column align="center" prop="contractEndDate" label="结束日期" min-width="80"></el-table-column>
                      <el-table-column align="center" prop="contractDuration" label="合同周期"></el-table-column>
                      <el-table-column align="center" prop="contractSignDate" label="合同签约日期"></el-table-column>
                      <el-table-column align="center" prop="salaryTypeName" label="薪资类型"></el-table-column>
                      <el-table-column align="center" prop="salary" label="薪资"></el-table-column>
                      <el-table-column
                      align="center"
                      prop="contractIntroduction"
                      label="合同概述"
                      width="100"
                      >
                      <template slot-scope="scope">
                          <el-popover
                          width="400"
                          trigger="hover"
                          :content="scope.row.contractIntroduction"
                          >
                          <p class="w80" slot="reference">{{scope.row.contractIntroduction}}</p>
                          </el-popover>
                      </template>
                      </el-table-column>
                  </el-table>
                </el-card>
              </div>
              <div class="user_detail_operation_block">
                <el-card shadow="always" class="box-card">
                  <div slot="header" class="clearfix">
                    <span>咨询学员</span>
                    <span class="mentee-detail-title" v-if="data.menteeArr">咨询学员列表 （{{data.menteeArr.length || '0'}}个）</span>
                    <span class="mentee-detail-title" v-else>咨询学员列表 （0个）</span>
                  </div>
                  <el-table :data="menteeArr" size="mini" highlight-current-row>
                      <el-table-column type="index" width="50" label="序号"></el-table-column>
                      <!-- <el-table-column align="center" prop="cooperatorName" label="合作商名称"></el-table-column> -->
                      <el-table-column align="center" prop="menteeName" label="menteeName" min-width="80"></el-table-column>
                      <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
                      <el-table-column align="center" prop="wxName" label="微信名"></el-table-column>
                      <el-table-column align="center" prop="finishYear" label="学生毕业年份"></el-table-column>
                      <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90"></el-table-column>
                      <el-table-column align="center" prop="signStatusName" label="签约状态" min-width="80"></el-table-column>
                      <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
                      <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
                      <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
                      <el-table-column align="center" prop="counselorName" label="顾问姓名"></el-table-column>
                  </el-table>
                </el-card>
              </div>
              <div class="user_detail_operation_block">
                <el-card shadow="always" class="box-card">
                  <div slot="header" class="clearfix">
                    <span>推文</span>
                  </div>
                  <el-table :data="articleArr" size="mini" highlight-current-row>
                      <el-table-column
                      align="center"
                      prop="articleTitle"
                      label="推文标题"
                      min-width="80"
                      show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                      align="center"
                      prop="articleIntroduction"
                      label="	推文简介"
                      min-width="80"
                      show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                      align="center"
                      prop="articleUrl"
                      label="推文链接"
                      min-width="80"
                      show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                      align="center"
                      prop="pushDate"
                      label="推送日期"
                      min-width="80"
                      show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column align="center" prop="readingNum" label="阅读量" show-overflow-tooltip></el-table-column>
                      <el-table-column
                      align="center"
                      prop="consultingNum"
                      label="咨询导流数量"
                      show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column align="center" prop="note" label="note" show-overflow-tooltip></el-table-column>
                      <el-table-column align="center" prop="voucherPath" label="凭证" width="100">
                      <template slot-scope="scope">
                          <el-button
                          v-if="scope.row.voucherPath"
                          @click="download(scope.row.voucherPath)"
                          size="mini"
                          >查看</el-button>
                      </template>
                      </el-table-column>
                  </el-table>
                </el-card>
              </div>
              <div class="user_detail_operation_block" v-for="(content,i) in contentArr"  :key="i">
                <el-card shadow="always" class="box-card">
                  <div slot="header" class="clearfix">
                    <div>合作内容：<span :title="content.contentNote">{{content.contentType}}</span>(数量：{{content.contentNum}})【对应合同：{{content.contractName}}】</div>
                  </div>
                  <el-table :data="content.contentTypeArr" size="mini" highlight-current-row>
                      <el-table-column
                      align="left"
                      prop="followResult"
                      label="follow内容"
                      min-width="880"
                      show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column prop="followVoucher" align="center" label="附件" min-width="100">
                      <template slot-scope="scope">
                          <el-button
                          v-if="scope.row.followVoucher"
                          @click="download(scope.row.followVoucher)"
                          size="mini"
                          >查看</el-button>
                      </template>
                      </el-table-column>
                      <el-table-column align="center" prop="followTime" label="follow时间" min-width="120"></el-table-column>
                      <el-table-column
                      align="center"
                      prop="followByName"
                      label="follow人姓名"
                      min-width="120"
                      ></el-table-column>
                  </el-table>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="合同" v-if="roleInfo.includes(`BD_cooperator_contract`)" name="second">
              <contract2  :cooperatorData="data" :activeName="activeName"/>
            </el-tab-pane>
            <el-tab-pane label="活动" v-if="roleInfo.includes(`BD_cooperator_activity`)" name="third">
              <activityList :cooperatorData="data" :activeName="activeName"/>
            </el-tab-pane>
            <el-tab-pane label="推文" name="fouth" v-if="roleInfo.includes(`BD_cooperator_Tweet`)">
              <tweet :cooperatorData="data" :activeName="activeName"/>
            </el-tab-pane>
            <el-tab-pane label="学生" name="fifth">
              <div slot="header" class="clearfix">
                <span>咨询学员</span>
                <span class="mentee-detail-title" v-if="data.menteeArr">咨询学员列表 （{{data.menteeArr.length || '0'}}个）</span>
                <span class="mentee-detail-title" v-else>咨询学员列表 （0个）</span>
              </div>
              <el-table :data="menteeArr" size="mini" ref="menteeData" highlight-current-row>
                  <el-table-column type="index" width="50" label="序号"></el-table-column>
                  <!-- <el-table-column align="center" prop="cooperatorName" label="合作商名称"></el-table-column> -->
                  <el-table-column align="center" prop="menteeName" label="menteeName" min-width="80"></el-table-column>
                  <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
                  <el-table-column align="center" prop="wxName" label="微信名"></el-table-column>
                  <el-table-column align="center" prop="finishYear" label="学生毕业年份"></el-table-column>
                  <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90"></el-table-column>
                  <el-table-column align="center" prop="signStatusName" label="签约状态" min-width="80"
                    :filters="signStatusList"
                    :filter-method="filterTag"
                    column-key="filterStatus"
                    filter-placement="bottom-end"
                  ></el-table-column>
                  <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
                  <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
                  <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
                  <el-table-column align="center" prop="counselorName" label="顾问姓名"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="返佣" name="sixth">
              <rebateList :cooperatorData="data" :activeName="activeName"/>
            </el-tab-pane>
            <el-tab-pane v-if="roleInfo.includes(`BD_cooperator_follow_up`)" label="Follow Up" name="seventh">
              <followUp :cooperatorData="data" :activeName="activeName"/>
            </el-tab-pane>
            <el-tab-pane name="eighth" v-if="roleInfo.includes(`BD_cooperator_milestone`)" label="里程碑">
              <milestone :cooperatorId="cooperatorId"  :activeName="activeName"/>
            </el-tab-pane>
          </el-tabs>
        </div>
        <edit
        :editVisible="editVisible"
        :cooperatorData="data"
        @close="editClose"
        @submit="editSubmit"
        />
        <editMainlandCommunity
        :editVisible="mainlandCommunityVisible"
        :cooperatorData="data"
        @close="editClose"
        @submit="editSubmit"
        />
        <editOverseasCommunity
        :editVisible="overseasCommunityVisible"
        :cooperatorData="data"
        @close="editClose"
        @submit="editSubmit"
        />
        <editOverseasEducation
        :editVisible="overseasEducationVisible"
        :cooperatorData="data"
        @close="editClose"
        @submit="editSubmit"
        />
        <pay-account
        :payAccountVisible="payAccountVisible"
        :cooperatorId="data.cooperatorId"
        @close="payAccountClose"
        @submit="payAccountSubmit"
        />
        <contract
        :contractVisible="contractVisible"
        :cooperatorData="data"
        @close="contractClose"
        @submit="contractSubmit"
        />
        <cooperationStatus
        :cooperationStatusVisible="cooperationStatusVisible"
        :cooperatorData="data"
        @close="cooperationStatusClose"
        @submit="cooperationStatusSubmit"
        />
    </div>
  </d2-container>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/bd'
import mixins from '@/plugin/mixins'

import edit from '../components/edit.vue'
import editMainlandCommunity from '../components/edit_mainland_community.vue'
import editOverseasCommunity from '../components/edit_overseas_community.vue'
import editOverseasEducation from '../components/edit_overseas_education.vue'
import payAccount from '../components/pay_account.vue'
import contract from '../components/contract_list.vue'
import contract2 from '../components/contract_list2.vue'
import cooperationStatus from '../components/cooperation_status.vue'
import { mapState } from 'vuex'
import milestone from '../components/milestone.vue'
import followUp from '../components/follow_up.vue'
import activityList from '../components/activity_list.vue'
import tweet from '../components/tweet_list.vue'
import RebateList from '../components/rebate_list.vue'

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  components: {
    edit,
    editMainlandCommunity,
    editOverseasCommunity,
    editOverseasEducation,
    payAccount,
    contract,
    contract2,
    cooperationStatus,
    milestone,
    followUp,
    activityList,
    tweet,
    RebateList
  },
  data: () => {
    return {
      vloading: false,
      data: {},
      activeName: 'first',
      contractArr: [],
      menteeArr: [],
      articleArr: [],
      contentArr: [],
      activeNames: ['99', '98', '97', '96', 0, 1, 2, 3, 4, 5, 6, 7],
      cooperatorId: '',
      editVisible: false,
      overseasEducationVisible: false,
      overseasCommunityVisible: false,
      mainlandCommunityVisible: false,
      payAccountVisible: false,
      cooperationStatusVisible: false,
      contractVisible: false,
      signStatusList: []
    }
  },
  mounted () {
    this.init()
    this.Topage()
  },
  methods: {
    async init () {
      const mentee_sign_status = await this.getDictionary('mentee_sign_status')
      mentee_sign_status.forEach(v => {
        this.signStatusList.push({ text: v.itemName, value: v.itemName })
      })
    },
    async Topage () {
      this.cooperatorId = this.$route.query.cooperatorId
      this.vloading = true
      api.getCooperatorDetailById(this.cooperatorId).then(res => {
        console.log('getCooperatorDetailById', res.data)
        this.vloading = false
        this.data = res.data
        this.contractArr = res.data.contractArr
        this.menteeArr = res.data.menteeArr
        this.articleArr = res.data.articleArr
        this.contentArr = res.data.contentArr
      })
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    close () {
      const obj1 = this.$data
      const obj2 = this.$options.data()
      for (const attrName in obj1) {
        if (attrName !== 'rules') {
          obj1[attrName] = obj2[attrName]
        }
      }
    },
    finish () {
      console.log('finish', this.signId)
      this.$confirm('此操作将结束该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api
            .updatedSignEdit({ signId: this.signId, endFlag: '1' })
            .then(res => {
              console.log('结束项目', res)
              this.Topage()
            })
        })
        .catch(() => {})
    },
    submit () {},
    edit () {
      switch (this.data.cooperatorType) {
        case '大陆社团':
          this.mainlandCommunityVisible = true
          break
        case '海外社团':
          this.overseasCommunityVisible = true
          break
        case '留学机构':
          this.overseasEducationVisible = true
          break
        default:
          this.editVisible = true
      }
    },
    editClose () {
      this.editVisible = false
      this.editChooseVisible = false
      this.mainlandCommunityVisible = false
      this.overseasCommunityVisible = false
      this.overseasEducationVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage(1)
    },
    payAccount () {
      this.payAccountVisible = true
    },
    payAccountClose () {
      this.payAccountVisible = false
    },
    payAccountSubmit () {
      this.payAccountClose()
      this.Topage(1)
    },
    contract () {
      this.contractVisible = true
    },
    contractClose () {
      this.contractVisible = false
    },
    contractSubmit () {
      this.contractClose()
      this.Topage(1)
    },
    deleteCooperator () {
      this.$confirm(`您将删除该合作商【${this.data.cooperatorName}】`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          cooperatorId: this.data.cooperatorId,
          delFlag: 1
        }
        api.uptCooperator(data).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.Topage()
        })
      })
    },
    cooperationStatus () {
      this.cooperationStatusVisible = true
    },
    cooperationStatusClose () {
      this.cooperationStatusVisible = false
    },
    cooperationStatusSubmit () {
      this.cooperationStatusClose()
      this.Topage()
    },
    changeCode () {
      this.$prompt('请输入新的Code', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\w{4,20}$/,
        inputErrorMessage: 'Code格式不正确需4-20位'
      }).then(({ value }) => {
        api.uptCooperatorCode(this.data.cooperatorId, value).then(() => {
          this.$message.success('修改成功')
          this.Topage()
        }).catch(err => {
          this.$message.error(err.message)
        })
        console.log(value)
      }).catch(() => {

      })
    },
    handleClick (tab, event) {
      this.activeName = tab.name
      if (this.activeName == 'first' || this.activeName == 'fifth') {
        this.Topage()
      }
      console.log(tab)
    },
    filterTag (value, row) {
      console.log(value)
      return row.signStatusName === value
    }

  }
}
</script>

<style lang="scss" scoped>
.clearfix{
  position: relative;
}
.btn_clearfix{
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translate(0%,-50%);
}
.user_detail_operation_block{
  margin-bottom: 10px;
}
*{
  box-sizing: border-box;
}
$background-color:#F4F4F4;
.user_detail_container{
  display: flex;
}
// 顶部返回状态栏
.top_status_bar{
  height:20px;
  .back_btn{
    width:60px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  span{
    margin-left:5px
  }
}
// 左侧学员个人信息
.user_detail_area{
  width: 400px;
  min-width:400px;
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
    justify-content: space-between;
    display: flex;
    padding:10px 0;
    border-top:1px solid $background-color;
    border-bottom:1px solid $background-color;
    .user_detail_info_btn{
      padding: 0 8px;
      line-height:30px;
      text-align: center;
      font-weight:700;
      cursor: pointer;
      // border-left:1px solid $background-color;
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
// 右侧项目详情操作区
.user_detail_operation{
  overflow-x: auto;
  margin-left:20px;
  padding:20px;
  height:100%;
  flex:1;
  background: #FFF;
  border-radius: 10px;
  .order_icon{
    float: left;
    font-size:14px;
    width:24px;
    height:24px;
    border-radius: 50%;
    background-color: #f4f4f5;
    color: #909399;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .order_icon:hover{
    color:#FF8C00
  }
  .overdue{
    color:red
  }
}

</style>
