<!--
 * @Author: kaan
 * @Date: 2022-01-17 17:47:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-02 16:01:01
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="user_detail_container" v-loading="loading">
      <!-- 左侧学员个人信息 -->
      <div class="user_detail_area">
        <el-button type="primary" class="edit_btn" icon="el-icon-edit" @click="mentorEdit(1)">编辑</el-button>
        <!-- 头像姓名模块 -->
        <div class="user_detail_info">
          <div class="user_detail_info_pic">
            <el-button type="text" v-if="!mentorInfo.headImage" class="to_bind" @click="toBind"><i class="el-icon-s-promotion"></i>绑定</el-button>
            <el-avatar :size="100" :src="mentorInfo.headImage" ></el-avatar>
            <div class="sex_icon sex_icon_mars" v-if="mentorInfo.sex==1">
              <d2-icon  name="mars"/>
            </div>
            <div class="sex_icon sex_icon_venus" v-if="mentorInfo.sex==2">
              <d2-icon name="venus"/>
            </div>
          </div>
          <p class="user_detail_info_name">{{mentorInfo.mentorName}}</p>
          <span>{{mentorInfo.mentorId}}</span>
        </div>
        <el-divider></el-divider>
        <div class="user_detail_info_basic">
          <el-descriptions title="基本信息" :column="1" :contentStyle="{flex:1,'text-align': 'right'}">
            <el-descriptions-item label="导师昵称">{{mentorInfo.nickName || "无"}}</el-descriptions-item>
            <!-- <el-descriptions-item label="导师姓名">{{mentorInfo.mentorName || "无"}}</el-descriptions-item> -->
            <el-descriptions-item label="微信号">{{mentorInfo.wxId || "无"}}</el-descriptions-item>
            <el-descriptions-item label="性别">{{mentorInfo.sexName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{mentorInfo.email || "无"}}</el-descriptions-item>
            <el-descriptions-item label="领英">{{mentorInfo.linkedinPath || "无"}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="user_detail_info_basic">
          <el-descriptions title="教育信息" :column="1" :contentStyle="{flex:1,'text-align': 'right'}">
            <el-descriptions-item label="学校(本科)">{{mentorInfo.undergraduateSchoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="专业(本科)">{{mentorInfo.undergradMajorName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="学校(研究生)">{{mentorInfo.graduateSchoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="专业(研究生)">{{mentorInfo.masterMajorName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="学校(博士)">{{mentorInfo.phdSchoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="专业(博士)">{{mentorInfo.phdMajorName || "无"}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="user_detail_info_basic">
          <el-descriptions title="职业信息" :column="1" :contentStyle="{flex:1,'text-align': 'right'}">
            <el-descriptions-item label="Pretalk编号">
              <span v-if="mentorInfo.pretalkCode">{{mentorInfo.pretalkCode}}</span>
              <el-button v-else type="text" style="padding:0px" @click="addNewPretalk" >成为Pretalk</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="PTA">{{mentorInfo.ptaName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="Company(任职)">{{mentorInfo.companyName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="Division(任职)">{{mentorInfo.divisionName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="Location(任职)">{{mentorInfo.locationName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="职务状态">{{mentorInfo.entryStatusName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="入职年份">{{mentorInfo.companyEntryDate || "无"}}</el-descriptions-item>
            <el-descriptions-item label="曾任职公司"></el-descriptions-item>
          </el-descriptions>
          <div class="user_detail_company_list">
            <el-row class="mb10">
              <el-col class="user_detail_company" :span="8">Company(曾任职)</el-col>
              <el-col class="user_detail_company" :span="8">Division(曾任职)</el-col>
              <el-col class="user_detail_company" :span="8">Location(曾任职)</el-col>
            </el-row>
            <el-row class="mb10" v-for="(item,i) in mentorInfo.oldCompany" :key="i">
              <el-col class="user_detail_company" :span="8">{{item.companyName || '无'}}</el-col>
              <el-col class="user_detail_company" :span="8">{{item.divisionName || '无'}}</el-col>
              <el-col class="user_detail_company" :span="8">{{item.locationName || '无'}}</el-col>
            </el-row>
          </div>
        </div>
        <div class="user_detail_info_basic">
          <el-descriptions title="WST信息" :column="1" :contentStyle="{flex:1,'text-align': 'right'}">
            <el-descriptions-item label="导师状态">{{mentorInfo.mentorStatus ==0 ?"启用" :"禁用"}}</el-descriptions-item>
            <el-descriptions-item label="WST公司">{{mentorInfo.wstCompanyName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="入职WST日期">{{mentorInfo.entryDate || "无"}}</el-descriptions-item>
            <el-descriptions-item label="离职WST日期">{{mentorInfo.leaveDate || "无"}}</el-descriptions-item>
            <el-descriptions-item label="推荐导师">{{mentorInfo.referrerName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="面试人">{{mentorInfo.interviewByName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="可否内推面试">{{mentorInfo.provideInterview ==1 ?"是" :"否"}}</el-descriptions-item>
            <el-descriptions-item label="内推成本">{{mentorInfo.provideCost || "无"}}</el-descriptions-item>
            <el-descriptions-item label="可推岗位">{{mentorInfo.provideJob || "无"}}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="user_detail_operation">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="可带业务" name="0">
            <el-button type="primary" class="edit_btn mb10" icon="el-icon-edit" @click="mentorEdit(2)">编辑</el-button>
            <div v-if="mentorInfo.businessCareer == 1">
              <el-descriptions title="求职" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="Track(可带行业)">{{mentorInfo.careerTrackName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="Country(可带行业)">{{mentorInfo.careerCountryName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="佣金模式">{{mentorInfo.compensationFixedName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="酬金规则">{{mentorInfo.ruleContent || "无"}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.specialties || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessGp == 1">
              <el-descriptions title="申研" :colon="false" :column="2" :contentStyle="{flex:1}">
                <el-descriptions-item label="专业">{{mentorInfo.gpMajorName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="Country(可带行业)">{{mentorInfo.gpCountryName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="基本佣金">{{mentorInfo.gpCompensationType}}{{mentorInfo.gpCompensation}}</el-descriptions-item>
                <el-descriptions-item label="绩效佣金">{{mentorInfo.gpCompensationType}}{{mentorInfo.gpMeritCompensation}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.gpProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessOral == 1">
              <el-descriptions title="口语" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="基本佣金">{{mentorInfo.oralCompensationType}}{{mentorInfo.oralCompensation}}</el-descriptions-item>
                <el-descriptions-item label="绩效佣金">{{mentorInfo.oralCompensationType}}{{mentorInfo.oralMeritCompensation}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.oralProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessCfa == 1">
              <el-descriptions title="CFA" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.cfaProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessFinance == 1">
              <el-descriptions title="理财" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="基本佣金">{{mentorInfo.financeCompensationType}}{{mentorInfo.financeCompensation}}</el-descriptions-item>
                <el-descriptions-item label="绩效佣金">{{mentorInfo.financeCompensationType}}{{mentorInfo.financeMeritCompensation}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.financeProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessTutoring == 1">
              <el-descriptions title="课业辅导" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="学科">{{mentorInfo.tutoringSubjectName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="Country(可带行业)">{{mentorInfo.tutoringCountryName || "无"}}</el-descriptions-item>
                <el-descriptions-item label="基本佣金">{{mentorInfo.tutoringCompensationType}}{{mentorInfo.tutoringCompensation}}</el-descriptions-item>
                <el-descriptions-item label="绩效佣金">{{mentorInfo.tutoringCompensationType}}{{mentorInfo.tutoringMeritCompensation}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.tutoringProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessLetterModify == 1">
              <el-descriptions title="文书修改" :colon="false" :column="2" :contentStyle="{flex:1}">
                <el-descriptions-item label="中文简历">{{mentorInfo.letterModifyCompensationType}}{{mentorInfo.letterModifyCompensationResumeZh}}</el-descriptions-item>
                <el-descriptions-item label="英文简历">{{mentorInfo.letterModifyCompensationType}}{{mentorInfo.letterModifyCompensationResumeEn}}</el-descriptions-item>
                <el-descriptions-item label="Cover Letter">{{mentorInfo.letterModifyCompensationType}}{{mentorInfo.letterModifyCompensationCoverLetter}}</el-descriptions-item>
                <el-descriptions-item label="备注">{{mentorInfo.letterModifyProfile}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessPsychology == 1">
              <el-descriptions title="心理学" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="基本佣金">{{mentorInfo.psychologyCompensationType}}{{mentorInfo.psychologyCompensation}}</el-descriptions-item>
                <el-descriptions-item label="绩效佣金">{{mentorInfo.psychologyCompensationType}}{{mentorInfo.psychologyMeritCompensation}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.psychologyProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

            <div v-if="mentorInfo.businessHumanResource == 1">
              <el-descriptions title="人力资源" :colon="false" :column="2" :contentStyle="{flex:1}" >
                <el-descriptions-item label="基本佣金">{{mentorInfo.humanResourceCompensationType}}{{mentorInfo.humanResourceCompensation}}</el-descriptions-item>
                <el-descriptions-item label="绩效佣金">{{mentorInfo.humanResourceCompensationType}}{{mentorInfo.humanResourceMeritCompensation}}</el-descriptions-item>
                <el-descriptions-item label="Profile导师介绍" :span="24">{{mentorInfo.humanResourceProfile || "无"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>

          </el-tab-pane>

          <el-tab-pane label="学员列表" name="1">
            <el-button size="mini" @click="exportFile(1)" class="mb10" title="导出学生列表" v-if="roleInfo.includes('vip_mentor_export_mentee')">导出学生列表</el-button>
            <el-table :data="menteeList" border v-loading="loading1">
              <el-table-column align="center" prop="realName" label="学生姓名"  width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="strategistName" label="Strategist" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="pmName" label="PM" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="programName" label="项目" width="" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="totalHours" label="项目总课时" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="mentorHours" label="Mentor Total Session" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="vipTotalHours" label="Strategist Total Session" width="110" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="mentorFinishHour" label="已上课时" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="mentorpayHour" label="已付课时" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="mentorWaitPayHour" label="待付款课时" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="mentorWaitApplyHour" label="待申请课时" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="allotTime" label="分配时间" width="100" show-overflow-tooltip ></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="导师账户" name="2">
            <MentorAccount />
          </el-tab-pane>

          <el-tab-pane label="支付记录" name="8">
            <el-table highlight-current-row @row-dblclick="detail" :data="paidArr" border v-loading="loading8">
              <el-table-column align="center" prop="payAccType" label="付款方式"  width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payAcc" label="收款账户" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payType" label="支付货币" width="80" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payAmount" label="支付金额" width="80" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payDate" label="付款日期" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="paymentAccountName" label="付款账户" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payRemark" label="付款说明" width="110" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="commissionAmount" label="手续费金额" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="commissionFor" label="手续费说明"  show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payerName" label="付款上传人"  show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payRecordCreateTime" label="付款上传时间" show-overflow-tooltip ></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="佣金记录" name="3">
            <el-button size="mini" @click="exportFile(3)" class="mb10" title="导出佣金列表" v-if="roleInfo.includes('vip_mentor_reward_export')">导出佣金列表</el-button>
            <el-table :data="paymentList" border v-loading="loading3">
              <el-table-column align="center" prop="menteeName" label="学生姓名" fixed="left" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="programName" label="项目" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="totalHours" label="项目总课时" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="lessonTimesIds" label="相应课号" width="" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payLessonHours" label="对应课时" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="applyTime" label="申请时间" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="paymentAmount2" label="申请金额" width="110" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payDate" label="Paid Date" width="90" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payAmount" label="财务付款金额" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="paymentAmount" label="本笔支付金额" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payAcc" label="支付方式" width="100" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payRemark" label="支付备注" width="300" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" prop="payVoucher" label="凭证" width="70" >
                <template slot-scope="scope">
                  <el-button type="text" @click="preview(scope.row.payVoucher)">预览</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="payStatusName" label="操作" width="90" >
                <template slot-scope="scope">
                  <el-button type="text" @click="sure(scope.row)" v-if="scope.row.payStatusName=='确认到账'">确认到账</el-button>
                  <span v-else>已确认</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="课时统计" name="4">
            <el-form label-width="80px" inline>
              <el-date-picker
                v-model="myDate"
                class="mb10 mr10"
                type="daterange"
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <el-button type="primary" @click="initTab4">GO</el-button>
              <el-button @click="exportFile(4)" v-if="roleInfo.includes('vip_mentor_export_lesson')" title="导出课表">导出课表</el-button>
            </el-form>
            <div v-loading="loading4">
              <el-card class="mb20">
                <el-row class="">
                  <el-col :span="4" class="_item-name">已完成课时数：</el-col>
                  <el-col :span="4" class="_item-value">{{lessonHoursData.finishHours}}</el-col>
                  <el-col :span="4" class="_item-name">已支付课时数:</el-col>
                  <el-col :span="4" class="_item-value">{{lessonHoursData.payHours}}</el-col>
                  <el-col :span="4" class="_item-name">已确认课时数:</el-col>
                  <el-col :span="4" class="_item-value">{{lessonHoursData.confirmHours}}</el-col>
                </el-row>
              </el-card>
              <el-table :data="lessonList" size="mini" id="export_table">
                <el-table-column align="center" prop="mentorName" label="导师名称" min-width="80"></el-table-column>
                <el-table-column align="center" prop="menteeName" label="学生名称" min-width="80"></el-table-column>
                <el-table-column align="center" prop="signId" label="签约id" min-width="80"></el-table-column>
                <el-table-column align="center" prop="programName" label="项目名称" min-width="80"></el-table-column>
                <el-table-column align="center" prop="lessonTimes" label="课程序号" min-width="80"></el-table-column>
                <el-table-column align="center" prop="lessonDate" label="上课日期" min-width="80"></el-table-column>
                <el-table-column align="center" prop="lessonName" label="课程名称" min-width="80"></el-table-column>
                <el-table-column align="center" prop="lessonHour" label="课时" min-width="80"></el-table-column>
                <el-table-column align="center" prop="lessonStatusName" label="课程状态" min-width="80"></el-table-column>
                <el-table-column align="center" prop="paymentStatusName" label="支付状态" min-width="80"></el-table-column>
                <el-table-column align="center" prop="createByName" label="创建人姓名" min-width="80"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="导师文档" name="5">
            <MentorFile />
          </el-tab-pane>
          <el-tab-pane label="Bonus" name="6">
            <MentorBonus :mentorData="mentorInfo"/>
          </el-tab-pane>

          <el-tab-pane label="Pretalk" name="7">
            <el-button v-if="!mentorInfo.pretalkId" type="primary" @click="addPretalkClick" size="mini">成为pretalk</el-button>
            <el-form v-if="mentorInfo.pretalkId" :inline="true" size="mini"  >
              <el-form-item label="">
                <el-input clearable :style="{width:'200px'}" class="mr10" v-model="menteeId" filterable placeholder="请输入学员ID"></el-input>
                <el-button class="el-icon-circle-plus-outline" @click="newUser"  type="success">添加学员</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="menteeArr"
              size="small"
              highlight-current-row
              style="width: 100%"
             v-if="mentorInfo.pretalkId">
              <el-table-column prop="menteeId" align="center"  label="学员ID"></el-table-column>
              <el-table-column prop="menteeName" align="center"  label="学员名"></el-table-column>
              <el-table-column prop="wxId" align="center"  label="微信ID"></el-table-column>
              <el-table-column prop="wxName" align="center"  label="微信名"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <MentorEdit
      :mentorEditVisible="mentorEditVisible"
      :editType = "editType"
      :mentorData0="mentorData"
      @close="mentorEditClose"
      @success="mentorEditSubmit"
    ></MentorEdit>
    <el-dialog
      class="yx-aa"
      :visible.sync="dialogVisible"
      width="600px"
      style="text-align:center!important"
      :before-close="handleClose">
      <div style="text-align:center">
        <el-image style="width: 320px; height: auto; "  :src="url" fit="cover"></el-image>
      </div>
      <el-button class="mt20" size="small" @click="downloadImg()">下载</el-button>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
			:title="'学员'"
			:visible.sync="mentorListVisible"
			width="700px"
			:before-close="mentorListClose"
			>
			<el-row v-for="(mentor,i) in mentorSearchList" :key="i">
				<el-col :span="3">
				<el-button size="mini" style="margin-top:5px" @click="chooseMentor(mentor)" type="primary">添加</el-button>
				</el-col>
				<el-col :span="3" class="_item-name">姓名</el-col>
				<el-col :span="4" class="_item-value">{{mentor.mentorName||mentor.menteeName}}</el-col>
				<el-col :span="3" class="_item-name">微信ID</el-col>
				<el-col :span="4" class="_item-value">{{mentor.wxId}}</el-col>
        <el-col :span="3" class="_item-name">微信名</el-col>
				<el-col :span="4" class="_item-value">{{mentor.wxName}}</el-col>

			</el-row>
		</el-dialog>
    <AddPretalk
      :addNewPretalkVisible="addNewPretalkVisible"
      :keyIdNew="mentorId"
      :kolTypeNew="kolTypeNew"
      @close="pretalkNewClose"
      @success="pretalkNewSuccess"
    ></AddPretalk>
    <addPretalk :addPretalkVisible="addPretalkVisible" :mentorInfo="mentorInfo" @close="addPretalkClose" @success="addPretalkSubmit" />
    <detail :detailVisible="detailVisible" :payId="payId" @close="closeDetail" />
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import api2 from '@/api/bd'
import apiUser from '@/api/sales_assistant'
import detail from './components/detailPayId'
import file from '@/libs/file'
import util from '@/libs/util.js'
import FileSaver from 'file-saver'
import MentorAccount from './components/MentorAccount.vue'
import MentorFile from './components/MentorFile.vue'
import MentorEdit from './components/MentorEdit.vue'
import AddPretalk from '@/views/BD/pretalkComponents/addPretalkNewMentor'
import MentorBonus from './components/MentorBonus.vue'
import { mapState } from 'vuex'
import addPretalk from './components/addPretalk.vue'
export default {
  name: 'UserDetail',
  components: { MentorAccount, MentorFile, MentorEdit, MentorBonus, addPretalk, detail, AddPretalk },
  data: () => {
    return {
      mentorSearchList: [],
      mentorListVisible: false,
      menteeId: '',
      addPretalkVisible: false,
      loading: false,
      menteeArr: [],
      mentorId: '',
      mentorInfo: {},
      dialogVisible: false,
      mentorEditVisible: false,
      editType: 0,
      mentorData: {},
      url: '',
      payId: '',
      activeName: 0,
      detailVisible: false,
      loading1: false,
      menteeList: [],
      kolTypeNew: 'mentor',
      loading3: false,
      paymentList: [],
      addNewPretalkVisible: false,
      loading4: false,
      loading8: false,
      paidArr: [],
      myDate: null,
      fromDate: '',
      toDate: '',
      lessonHoursData: {
        finishHours: 0,
        payHours: 0,
        confirmHours: 0
      },
      lessonList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted () {
    this.Topage()
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  methods: {
    Topage () {
      this.mentorId = this.$route.query.mentorId
      this.initInfo()
      this.initTab1()
      this.initTab3()
      this.initTab8()
    },
    initInfo () {
      const params = {
        mentorId: this.mentorId
      }
      this.loading = true
      api.getMentorDetailV2(params).then(res => {
        console.log('可带业务：', res)
        this.loading = false
        if (res.code == '200') {
          this.mentorInfo = res.data
          if (this.mentorInfo.pretalkId) {
            this.newPretalk()
          }
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @description: 学员列表初始化
     * @param {*}
     * @return {*}
     */
    initTab1 () {
      this.loading1 = true
      api.getMenteeListByMentorId(this.mentorId).then(res => {
        this.loading1 = false
        console.log('导师的学生列表', res)
        this.menteeList = res.data.rows
      })
    },
    initTab3 () {
      const payStatusName = {
        0: '确认到账',
        1: '已确认'
      }
      this.loading3 = true
      api.getPaymentRecordListByMentorId(this.mentorId).then(res => {
        this.loading3 = false
        console.log('导师支付账户列表', res)
        res.data.rows.forEach(v => {
          v.paymentAmount2 =
            '￥' + v.paymentAmountCny + '/$' + v.paymentAmountUsd
          if (v.payType == 'cny') {
            v.payAmount = util.priceToM(v.payAmount, '￥')
            v.paymentAmount = util.priceToM(v.paymentAmount, '￥')
          } else if (v.payType == 'usd') {
            v.payAmount = util.priceToM(v.payAmount, '$')
            v.paymentAmount = util.priceToM(v.paymentAmount, '$')
          }
          v.payAcc = v.payAccType + v.payAcc
          v.payStatusName = payStatusName[v.payStatus]
        })
        this.paymentList = res.data.rows
      })
    },
    initTab4 () {
      const params = {
        fromDate: this.myDate && this.myDate[0],
        toDate: this.myDate && this.myDate[1]
      }
      this.loading4 = true
      api.getMentorLessonHoursTotal(this.mentorId, params).then(res => {
        console.log(res)
        this.lessonHoursData = res.data || {}
      })
      const params2 = {
        pageNum: 1,
        pageSize: 999,
        fromDate: this.myDate && this.myDate[0],
        toDate: this.myDate && this.myDate[1]
      }
      api.getMentorSignLesson(params2, this.mentorId).then(res => {
        this.loading4 = false
        console.log(res)
        this.lessonList = res.data.rows
      })
    },
    initTab8 () {
      this.loading8 = true
      api.getPaidArr(this.mentorId).then(res => {
        this.loading8 = false
        console.log(res)
        this.paidArr = res.data
      })
    },
    detail (row, column, event) {
      console.log(row, column, event)
      this.payId = row.payId
      this.detailVisible = true
    },
    closeDetail () {
      this.detailVisible = false
    },
    /**
     * @description: 去绑定导师
     * @param {*}
     * @return {*}
     */
    toBind () {
      api.getMentorQrCode(this.mentorId).then(res => {
        console.log(res)
        this.url = res.data
        this.dialogVisible = true
        // console.log(res)
        // const imageHtml = `<div style="width: 100%; height: 200px;text-align:center">
        //                   <img
        //                   style="width: 200px; height: 200px"
        //                   src="${res.data}"/>
        //                 </div>
        //                 <div style="text-align:center;color:#FF8C00;margin-top:20px" >请截图后分享给导师进行绑定</div>`

        // this.$alert(imageHtml, '导师小程序绑定二维码', {
        //   showConfirmButton: false,
        //   dangerouslyUseHTMLString: true
        // })
      })
    },
    preview (path) {
      file.preview(path)
    },
    sure (row) {
      const data = {
        payId: row.payId,
        applyId: row.applyId
      }
      console.log('确认酬金参数', data)
      this.loading3 = true
      api.updateMentorPaymentDetail(data).then(res => {
        console.log('确认酬金', res)
        this.$message({
          type: 'success',
          message: '确认成功'
        })
        this.initTab3()
      })
    },
    mentorEdit (i) {
      this.editType = i
      this.mentorData = JSON.parse(JSON.stringify(this.mentorInfo))
      this.mentorData.compensationFixed = this.mentorData.compensationFixed || '1'
      if (this.mentorData.meritCompensation == undefined) { this.mentorData.meritCompensation = 0 }
      console.log('getMentorDetailById', this.mentorData)
      this.mentorData.careerTrackName = this.mentorData.careerTrackName
        ? this.mentorData.careerTrackName.split(',')
        : []
      this.mentorData.careerTrack = this.mentorData.careerTrack
        ? this.mentorData.careerTrack.split(',')
        : []
      this.mentorData.track = this.mentorData.track
        ? this.mentorData.track.split(',')
        : []
      this.mentorData.trackName = this.mentorData.trackName
        ? this.mentorData.trackName.split(',')
        : []
      this.mentorData.careerCountry = this.mentorData.careerCountry
        ? this.mentorData.careerCountry.split(',')
        : []
      this.mentorData.gpCountry = this.mentorData.gpCountry
        ? this.mentorData.gpCountry.split(',')
        : []
      this.mentorData.tutoringCountry = this.mentorData.tutoringCountry
        ? this.mentorData.tutoringCountry.split(',')
        : []
      this.country = this.mentorData.country
        ? this.mentorData.country.split(',')
        : []
      this.mentorData.countryName = this.mentorData.countryName
        ? this.mentorData.countryName.split(',')
        : []
      this.mentorData.location = this.mentorData.location
        ? this.mentorData.location.split(',')
        : []
      this.mentorData.company = this.mentorData.company
        ? this.mentorData.company.split(',')
        : []
      this.mentorData.division = this.mentorData.division
        ? this.mentorData.division.split(',')
        : []
      this.mentorData.gpMajor = this.mentorData.gpMajor
        ? this.mentorData.gpMajor.split(',')
        : []
      this.mentorData.gpMajorName = this.mentorData.gpMajorName
        ? this.mentorData.gpMajorName.split(',')
        : []
      this.mentorData.tutoringSubject = this.mentorData.tutoringSubject
        ? this.mentorData.tutoringSubject.split(',')
        : []
      this.mentorData.undergradMajor = this.mentorData.undergradMajor
        ? this.mentorData.undergradMajor.split(',')
        : []
      this.mentorData.masterMajor = this.mentorData.masterMajor
        ? this.mentorData.masterMajor.split(',')
        : []
      this.mentorData.phdMajor = this.mentorData.phdMajor
        ? this.mentorData.phdMajor.split(',')
        : []
      this.mentorEditVisible = true
    },
    mentorEditClose () {
      this.mentorEditVisible = false
    },
    mentorEditSubmit () {
      this.initInfo()
      this.initTab1()
      this.mentorEditVisible = false
    },
    exportFile (name) {
      let fileName = ''
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      if (name == 1) {
        fileName = '导师管理学员列表'
        xhr.open(
          'GET',
          `${this.$apiUrl}mentor/${this.mentorId}/menteeSignList/export`
        )
      } else if (name == 3) {
        fileName = '导师佣金记录'
        xhr.open(
          'GET',
          `${this.$apiUrl}mentor/${this.mentorId}/paymentRecordList/export`
        )
      } else if (name == 4) {
        console.log(this.myDate)
        fileName = 'VIP导师上课课表'
        if (this.myDate == null) {
          xhr.open(
            'GET',
            `${this.$apiUrl}mentor/${this.mentorId}/signLessonList/export`
          )
        } else {
          xhr.open(
            'GET',
            `${this.$apiUrl}mentor/${this.mentorId}/signLessonList/export?fromDate=${this.myDate && this.myDate[0]}&toDate=${this.myDate && this.myDate[1]}`
          )
        }
      }
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
    },
    handleClose () {
      this.dialogVisible = false
    },
    downloadImg () {
      this.down(this.url)
    },
    down (url) {
      const a = JSON.parse(JSON.stringify(url))
      const fileName = a.split('/').slice(-1)[0]
      console.log(url, fileName)
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          FileSaver.saveAs(xhr.response, fileName)
        }
      }
      xhr.send()
    },
    addPretalkClose () {
      this.addPretalkVisible = false
    },
    addPretalkSubmit () {
      this.addPretalkVisible = false
      this.initInfo()
    },
    addNewPretalk () {
      this.addNewPretalkVisible = true
    },
    pretalkNewSuccess () {
      this.addNewPretalkVisible = false
      this.Topage()
    },
    pretalkNewClose () {
      this.addNewPretalkVisible = false
    },
    addPretalkClick () {
      this.addPretalkVisible = true
    },
    newPretalk () {
      api2.menteeArrPretalk(this.mentorInfo.pretalkId).then(res => {
        console.log(res.data, 111)
        this.menteeArr = res.data
      })
    },
    newUser () {
      this.$loading()
      api2.searchMenteeMatch(this.menteeId).then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.mentorSearchList = res.data
          this.mentorListVisible = true
        } else {
          this.$message.error('未找到对应学员！！')
        }
        this.$loading().close()
      })
    },
    mentorListClose () {
      this.mentorListVisible = false
    },
    chooseMentor (data) {
      console.log(data)
      this.mentorListClose()
      this.addPretalk(data.menteeId)
    },
    addPretalk (menteeId) {
      if (menteeId) {
        apiUser.getMenteeDataByMenteeId(menteeId).then(() => {
          const data = {
            menteeId: menteeId,
            pretalkId: this.mentorInfo.pretalkId
          }
          console.log(data)
          api2.addMenteePretalk(data).then(() => {
            this.$message.success('添加成功')
            this.newPretalk()
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      } else {
        this.$message.error('学员ID不能为空！')
      }
    },
    tabClick () {}
  }
}

</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
$background-color:#F4F4F4;
.user_detail_container{
  display: flex;
}
// 左侧导师个人信息
.user_detail_area{
  position: relative;
  width: 400px;
  min-width:400px;
  height:100%;
  background: #FFF;
  border-radius: 10px;
  .edit_btn{
    position: absolute;
    right: 0;
    top: 0;
  }
  // 头像姓名ID
  .user_detail_info{
    padding:30px 30px 0 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .user_detail_info_pic{
      position: relative;
      .to_bind{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        font-size:16px;
        color:#409eff;
        cursor: pointer;
      }
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
    .user_detail_company_list{
      position: relative;
      .user_detail_company{
      display: block;
      font-size: 12px;
      line-height:1;
      color: #606266;
    }
    }
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
}
</style>
