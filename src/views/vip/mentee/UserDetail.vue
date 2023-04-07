<!--
 * @Author: kaan
 * @Date: 2021-11-16 14:52:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-07 11:36:50
 * @Version:
 * @Description:
-->

<template>
  <d2-container>
    <div class="user_detail_container" v-loading="loading">
      <!-- 左侧学员个人信息 -->
      <div class="user_detail_area">
        <!-- 头像姓名模块 -->
        <div class="user_detail_info">
          <div class="user_detail_info_pic">
            <el-avatar :size="100" :src="menteeInfo.headImage" ></el-avatar>
            <div class="sex_icon sex_icon_mars" v-if="menteeInfo.sex==1">
              <d2-icon  name="mars"/>
            </div>
            <div class="sex_icon sex_icon_venus" v-if="menteeInfo.sex==2">
              <d2-icon name="venus"/>
            </div>
          </div>
          <p class="user_detail_info_name">{{menteeInfo.menteeName}}</p>
          <span>{{menteeInfo.menteeId}}</span>
        </div>

        <!-- 按钮区 -->
        <div class="user_detail_info_btn_area">
          <div class="user_detail_info_btn" v-if="roleInfo.includes(`mentee_website_setting`)" @click="websiteSetting">官网</div>
          <div class="user_detail_info_btn" v-if="roleInfo.includes(`mentee_information_file`)" @click="pFile">文件</div>
          <div class="user_detail_info_btn" v-if="roleInfo.includes(`mentee_information_recommand`)" @click="netApplication">内推</div>
          <div class="user_detail_info_btn" v-if="roleInfo.includes(`mentee_information_follow`)" @click="followRule" >follow规则</div>
          <div class="user_detail_info_btn" v-if="roleInfo.includes(`sales_assistant_user`)" @click="toPayWay">账户</div>
          <div class="user_detail_info_btn" v-if="roleInfo.includes(`vip_event`)" @click="watchMenteeEventShow">学员事件</div>
          <div class="user_detail_info_btn"  @click="netJobCalendar">网申</div>
        </div>
        <!-- 基本信息模块 -->
        <div class="user_detail_info_basic">
          <el-button type="primary" style="position:absolute;right:20px;top:0" v-if="roleInfo.includes(`mentee_information_edit`)" @click="editUser">编辑</el-button>
          <el-descriptions title="基本信息" :column="1" size="medium">
            <el-descriptions-item label="性别">{{menteeInfo.sexName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="学历">{{menteeInfo.degreeName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="毕业年份">{{menteeInfo.finishYear || "无"}}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{menteeInfo.email || "无"}}</el-descriptions-item>

            <el-descriptions-item label="学校(高中)">{{menteeInfo.hignSchoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="学校(本科)">{{menteeInfo.schoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="专业(本科)">{{menteeInfo.major || "无"}}</el-descriptions-item>
            <el-descriptions-item label="学校(研究生)">{{menteeInfo.graduateSchoolName || "无"}}</el-descriptions-item>
            <el-descriptions-item label="专业(研究生)">{{menteeInfo.graduateMajorName || "无"}}</el-descriptions-item>

            <el-descriptions-item label="是否STEM专业">
              <el-tag size="small" type="success" v-if="menteeInfo.isStem == 1">是</el-tag>
              <el-tag size="small" type="info" v-else>否</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="是否转学">
              <el-tag size="small" type="success" v-if="menteeInfo.isTransfer == 1">是</el-tag>
              <el-tag size="small" type="info" v-else>否</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="是否申研">
              <el-tag size="small" type="success" v-if="menteeInfo.isApplyMaster == 1">是</el-tag>
              <el-tag size="small" type="info" v-else>否</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Pretalk编号">
              <el-tag size="small" type="success" v-if="menteeInfo.menteePretalk == 1 && menteeInfo.pretalkCode">{{menteeInfo.pretalkCode}}</el-tag>
              <el-button v-else type="text" style="padding:0px" @click="newPretalk" >成为Pretalk</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="是否KOL转介绍">
              <span v-if="menteeInfo.menteeKol == '1'" >是</span>
              <el-button v-else type="text" style="padding:0px" @click="newSelect" >成为kol转介绍</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="渠道来源">{{menteeInfo.channelName || "无"}}-{{menteeInfo.sourceName || "无"}}</el-descriptions-item>

            <!-- <el-descriptions-item label="是否VIP同事推荐">
              <el-tag size="small" type="success" v-if="menteeInfo.vipRecommendStatus == 1">是</el-tag>
              <el-tag size="small" type="info" v-else>否</el-tag>
            </el-descriptions-item>
             <el-descriptions-item label="VIP同事推荐人" v-if="menteeInfo.vipRecommendStatus == 1">
              {{menteeInfo.vipRecommenderName||'无'}}
            </el-descriptions-item> -->
        </el-descriptions>
        </div>
        <!-- 联系方式模块 -->
        <div class="user_detail_info_contact">
          <p class="user_detail_info_contact_title">联系方式</p>
          <ul class="user_detail_info_contact_list">
            <li class="user_detail_info_contact_item">
              <div class="icon_size">
                <d2-icon name="phone"/>
              </div>
              <div class="contact_item">
                <span>电话</span>
                <p>{{menteeInfo.telephone}}</p>
              </div>
            </li>
            <li class="user_detail_info_contact_item">
              <div class="icon_size">
                <d2-icon name="wechat"/>
              </div>
              <div class="contact_item">
                <span>微信</span>
                <p>{{menteeInfo.wxId}}</p>
              </div>
            </li>
            <li class="user_detail_info_contact_item">
              <div class="icon_size">
                <d2-icon name="envelope"/>
              </div>
              <div class="contact_item">
                <span>邮箱</span>
                <p>{{menteeInfo.email}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="user_detail_operation">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane :label="order.orderId" :name="order.orderId" v-for="(order,i) in orderArr" :key="i">
            <el-descriptions  title="订单信息" size="medium">
              <el-descriptions-item label="订单ID">{{order.orderId || "无"}}</el-descriptions-item>
              <el-descriptions-item label="签约日期">{{order.signDate || "无"}}</el-descriptions-item>
              <el-descriptions-item label="主联系人">{{order.contactName1 || "无"}}</el-descriptions-item>
              <el-descriptions-item label="副联系人">{{order.contactName2 || "无"}}</el-descriptions-item>
              <el-descriptions-item label="入账状态">
                <span v-if="order.payStatus == '0'" style="color:#409EFF">{{order.payStatusName || "无"}}</span>
                <span v-if="order.payStatus == '1'" style="color:#67C23A">{{order.payStatusName || "无"}}</span>
                <span v-if="order.payStatus == '2'" style="color:#E6A23C">{{order.payStatusName || "无"}}</span>
                <span v-if="order.payStatus == '3'" style="color:#F56C6C">{{order.payStatusName || "无"}}</span>
                <span v-if="order.payStatus == '4'" style="color:#FF8C00">{{order.payStatusName || "无"}}</span>
              </el-descriptions-item>
              <el-descriptions-item label="vip拉群日期">{{order.vipGroupDate || "无"}}</el-descriptions-item>
              <el-descriptions-item v-if="order.publicStatus == '0'" label="实名宣传"><span style="color:#c32e47">不可宣传</span></el-descriptions-item>
              <el-descriptions-item label="合同">
                <el-button type="primary" v-if="roleInfo.includes(`mentee_program_contract_upload`)" @click="uploadContract(order)">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                <!-- <el-button type="text" size="medium" title="上传" icon="el-icon-upload2" v-if="roleInfo.includes(`mentee_program_contract_upload`)" @click="uploadContract(order)"></el-button> -->
                <div class="order_icon mr10" @click="preview(contract.contractPath)"
                  v-for="(contract, j) in order.contractArr" :key="j">
                  <d2-icon :name="getFileExt(contract.contractName)" />
                </div>
              </el-descriptions-item>
            </el-descriptions>

            <el-divider></el-divider>
            <el-descriptions title="transition"  size="medium" :contentStyle="{flex:1}">
              <el-descriptions-item label="目标Track">{{ order.transition && order.transition.tracks || "无"}}</el-descriptions-item>
              <el-descriptions-item label="目标Location">{{order.transition && order.transition.locations || "无"}}</el-descriptions-item>
              <el-descriptions-item label="背景提升">{{order.transition && order.transition.background || "无"}}</el-descriptions-item>
              <el-descriptions-item label="学生情况概述">{{order.transition && order.transition.situation || "无"}}</el-descriptions-item>
              <el-descriptions-item label="其他">{{order.transition && order.transition.other || "无"}}</el-descriptions-item>
              <el-descriptions-item label="父母职业">{{order.transition && order.transition.parentJob || "无"}}</el-descriptions-item>
              <el-descriptions-item label="性格类型">{{order.transition && order.transition.parentPersonality || "无"}}</el-descriptions-item>
              <el-descriptions-item label="父母对小孩的期望">{{order.transition && order.transition.parentExpectation || "无"}}</el-descriptions-item>
              <el-descriptions-item label="对小孩人生的介入程度">{{order.transition && order.transition.parentControl || "无"}}</el-descriptions-item>
              <el-descriptions-item label="购买力">{{order.transition && order.transition.parentPurchasingPower || "无"}}</el-descriptions-item>
              <el-descriptions-item label="对行业的了解程度">{{order.transition && order.transition.menteeIndustryLevel || "无"}}</el-descriptions-item>
              <el-descriptions-item label="对行业的了解程度">{{order.transition && order.transition.menteeIndustryLevel || "无"}}</el-descriptions-item>
              <el-descriptions-item label="学生心理状态">{{order.transition && order.transition.menteeMentality || "无"}}</el-descriptions-item>
              <el-descriptions-item label="需要后期综合注意的点">{{order.transition && order.transition.notice || "无"}}</el-descriptions-item>
            </el-descriptions>

            <div v-for="(item,i) in order.signArr" :key="i">
              <!-- 基础项目 -->
              <el-divider></el-divider>
              <el-descriptions title="" size="medium" v-if="item.programType == 'basic'">
                <template slot="title">
                  <p class="mb10">求职项目</p>
                  <el-button size="mini" @click="overview(item.signId)">一览</el-button>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="showLesson(item.signId,item.programType)">课表</el-button>
                  <el-button size="mini" @click="toInterview(item,order.publicStatus)">面试</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                  <el-button size="mini" @click="tofollow(item)">follow</el-button>
                  <el-button size="mini" @click="toOffer(item,order.publicStatus)">offer</el-button>
                  <el-button size="mini" v-if="roleInfo.includes(`mentee_base_program_update`)" @click="toUpdate(item)">更新签约</el-button>
                  <el-button size="mini" @click="showPraise(item.signId)">好评图</el-button>
                  <el-button size="mini" @click="showApplySeason(item.signId)">申请季</el-button>
                  <el-button size="mini" @click="continual(item)">续约</el-button>
                  <el-button size="mini" @click="survey(item)">问卷</el-button>
                </template>
                <el-descriptions-item label="合同时间" >
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="延长服务日期">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目周期">{{item.programPeriod||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Strategist">{{item.strategistName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Program Manager">{{item.servicesName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="行业导师">{{item.mentorNames||'无'}}</el-descriptions-item>
                <el-descriptions-item label="目标Track">{{item.targetTrackName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="目标Location">{{item.targetLocationName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="全职导师文书修改次数">{{item.applicationLetterModifyDone || '0'}} / {{(item.applicationLetterModify == -1 ? '不限' : item.applicationLetterModify) ||'0'}}</el-descriptions-item>
                <el-descriptions-item label="行业导师文书修改次数"><el-link type="primary" @click="showLessonDialog(item,'applicationLetterModifyDone')">{{item.mentorLetterModifyDone || '0'}} / {{(item.mentorLetterModify == -1 ? '不限' : item.mentorLetterModify) ||'0'}}</el-link></el-descriptions-item>
                <el-descriptions-item label="行业导师一对一课时数">{{(item.mentorHour == -1 ? '不限' : item.mentorHour) ||0}}</el-descriptions-item>
                <!-- <el-descriptions-item label="Strategist Sessions（旧）">{{(item.vipHour == -1 ? '不限' : item.vipHour) ||0}}</el-descriptions-item> -->
                <el-descriptions-item label="1对多Office Hour"><el-link type="primary"  @click="showLessonDialog(item,'1toN')">{{(item.officeHourStrategistSession == -1 ? '不限' : item.officeHourStrategistSession) ||'无'}} 次/月</el-link></el-descriptions-item>
                <el-descriptions-item label="创始人课程">{{item.officeHourFounderFlag||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Jerry一对一"><el-link type="primary"  @click="showLessonDialog(item,'jerryHour')">{{(item.jerryHour == -1 ? '不限' : item.jerryHour) ||'无'}} 次/月</el-link></el-descriptions-item>
                <!-- <el-descriptions-item label="Tequila Shot（旧）">{{item.tequilaShotHourDone ||0}}/{{(item.tequilaShotHour == -1 ? '不限' : item.tequilaShotHour) ||0}}</el-descriptions-item> -->
                <!-- <el-descriptions-item label="Office Hour（旧）">{{item.officeHourDone ||0}}/{{(item.officeHour == -1 ? '不限' : item.officeHour) ||0}}</el-descriptions-item> -->
                <el-descriptions-item label="Live Lessons（新）"><el-link type="primary" @click="showLessonDialog(item,'live')">{{item.officeHourDone||0}} / {{(item.liveLesson == -1 ? '不限' : item.liveLesson) ||'无'}}</el-link></el-descriptions-item>
                <el-descriptions-item label="系列课课时数"><el-link type="primary" @click="showLessonDialog(item,'recorded')">{{item.seriesHourDone || 0}}/{{(item.seriesHour == -1 ? '不限' : item.seriesHour) ||0}}</el-link></el-descriptions-item>
                <el-descriptions-item label="心理学课时">{{(item.psychologyHour == -1 ? '不限' : item.psychologyHour) ||0}}</el-descriptions-item>
                <el-descriptions-item label="人力资源课时">{{(item.humanResourceHour == -1 ? '不限' : item.humanResourceHour) ||0}}</el-descriptions-item>
                <el-descriptions-item label="法律咨询">{{item.hasLegalConsulting||'无'}}</el-descriptions-item>
                <el-descriptions-item label="创业">{{item.hasBusinessStartup||'无'}}</el-descriptions-item>
                <el-descriptions-item label="购买额外课时">{{item.hasContinual||'无'}}</el-descriptions-item>
                <el-descriptions-item label="电子书架">{{item.hasEbookStore||'无'}}</el-descriptions-item>
                <el-descriptions-item label="领衔导师">{{item.seniorStrategist||'无'}}</el-descriptions-item>
                <el-descriptions-item label="应急导师">{{item.emergencyMentor||'无'}}</el-descriptions-item>
                <el-descriptions-item label="证书主题直播课权限">{{item.certificateSubjectLiveCourseAuthority||'无'}}</el-descriptions-item>
                <el-descriptions-item label="专项、面试导师">{{item.interviewMentor||'无'}}</el-descriptions-item>
                <el-descriptions-item label="优先内推">{{item.priority||'无'}}</el-descriptions-item>
                <el-descriptions-item label="系列课（口语）">{{item.hasEnglishSeries||'无'}}</el-descriptions-item>
                <el-descriptions-item label="口语课程">
                  <el-link type="primary" v-if="item.hasOral && item.hasOral == 'Yes'" @click="updateOral(item)" class="redColor">{{item.hasOral}}({{item.oralLessonHour}})</el-link>
                  <span v-if="item.hasOral && item.hasOral == 'No'" >No</span>
                </el-descriptions-item>
                <el-descriptions-item label="导师数量">{{(item.mentorCount == -1 ? '不限' : item.mentorCount) ||0}}</el-descriptions-item>
                <el-descriptions-item label="线下小班课"><el-link type="primary" @click="showLessonDialog(item,'subHis')">{{item.seminarsDone ||0}}/{{(item.seminars == -1 ? '不限' : item.seminars) ||0}}</el-link></el-descriptions-item>
                <el-descriptions-item label="金额(￥)">{{item.programPriceCny||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- 申研项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'graduate_program'">
                <template slot="title">
                  <p class="mb10">申研项目</p>
                  <el-button size="mini" @click="toEducation(item)">升学导师</el-button>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                  <el-button size="mini" @click="tofollow(item)">follow</el-button>
                  <el-button size="mini" @click="toOffer(item,order.publicStatus)">offer</el-button>
                  <el-button size="mini" v-if="roleInfo.includes(`mentee_base_program_update`)" @click="toUpdate(item)">更新签约</el-button>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="延长服务日期">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programType||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目周期">{{item.programPeriod ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目申请年">{{item.gpApplyYear ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目申请季">{{item.gpApplySeason ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目申请国家">{{item.gpApplyCountry ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="背景提升数量">{{item.gpBackgroundPromotionQuantity ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="背景提升人民币价格">{{item.gpBackgroundPromotionPriceCny ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="背景提升美金价格">{{item.gpBackgroundPromotionPriceUsd ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="专业大类数量">{{item.gpMajorQuantity ||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目申请数量">{{item.gpProgramApplyQuantity ||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- 实习项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'internship'">
                <template slot="title">
                  <p class="mb10">实习项目</p>
                  <el-button size="mini" @click="overview(item.signId)">一览</el-button>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="setInternship(item)">实习</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                  <el-button size="mini" @click="showPraise(item.signId)">好评图</el-button>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}
                  <el-tag v-if="item.internshipFlag && item.internshipFlag == '1'" type="danger" size="small" >内推</el-tag>
                  <el-tag v-if="item.internshipFlag == '0'" type="danger" size="small" >直接安排</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="金额($)">{{item.programPriceUsd||'无'}}</el-descriptions-item>
                <el-descriptions-item label="实习名称">{{item.internshipName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="实习时间">{{(item.internshipStartDate||'无') + '~' + (item.internshipEndDate||'无')}}</el-descriptions-item>
                <el-descriptions-item label="实习状态">{{item.internshipStatusName }}</el-descriptions-item>
                <el-descriptions-item label="实习offer">{{item.offerId ? '有':'无'}}</el-descriptions-item>
                <el-descriptions-item label="offer凭证">
                  <d2-icon v-if="item.offerVoucher" :name="getFileExt(item.offerVoucher)" />
                  <span v-else>无</span>
                </el-descriptions-item>
                <el-descriptions-item label="实习备注">{{item.internshipNote||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- 口语项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'oral'">
                <template slot="title">
                  <p class="mb10">口语项目</p>
                  <el-button size="mini" @click="undo">口语导师</el-button>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="showLesson(item.signId,item.programType)">课表</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                  <el-button size="mini" v-if="roleInfo.includes(`mentee_base_program_update`)" @click="toUpdate(item)">更新签约</el-button>
                  <el-button size="mini" @click="showPraise(item.signId)">好评图</el-button>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="口语导师一对一课时数">{{item.oralLessonHour == -1?"不限":(item.oralLessonHour || '无')}}</el-descriptions-item>
                <el-descriptions-item label="行业导师">{{item.mentorNames||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Strategist">{{item.strategistName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Program Manager">{{item.servicesName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="金额($)">{{item.programPriceUsd||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- 杰创项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'jcxy'">
                <template slot="title">
                  <p class="mb10">杰创项目</p>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目周期">{{item.programPeriod||'无'}}</el-descriptions-item>
                <el-descriptions-item label="金额($)">{{item.programPriceUsd||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- CFA项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'cfa'">
                <template slot="title">
                  <p class="mb10">CFA项目</p>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                  <el-button size="mini" @click="showPraise(item.signId)">好评图</el-button>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目周期">{{item.programPeriod||'无'}}</el-descriptions-item>
                <el-descriptions-item label="金额($)">{{item.programPriceUsd||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- 财商项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'finance'">
                <template slot="title">
                  <p class="mb10">财商项目</p>
                  <el-button size="mini" @click="undo">财商导师</el-button>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="showLesson(item.signId,item.programType)">课表</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                  <el-button size="mini" v-if="roleInfo.includes(`mentee_base_program_update`)" @click="toUpdate(item)">更新签约</el-button>
                  <el-button size="mini" @click="showPraise(item.signId)">好评图</el-button>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="财商导师一对一课时数">{{item.financeHour == -1?"不限":(item.financeHour || '无')}}</el-descriptions-item>
                <el-descriptions-item label="Strategist">{{item.strategistName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Program Manager">{{item.servicesName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目周期">{{item.programPeriod||'无'}}</el-descriptions-item>
              </el-descriptions>

              <!-- 课业辅导项目 -->
              <el-descriptions title="" size="medium" v-else-if="item.programType == 'tutoring'">
                <template slot="title">
                  <p class="mb10">课业辅导项目</p>
                  <el-button size="mini" @click="toVip(item)">VIP</el-button>
                  <el-button size="mini" @click="showLesson(item.signId,item.programType)">课表</el-button>
                  <el-button size="mini" @click="refund(item)">退</el-button>
                </template>
                <el-descriptions-item label="合同时间">
                  <span :class="{'overdue':overdue(item.endDate)}">{{(item.startDate || '无') + '~' + (item.endDate || '无')}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="项目名">{{item.programName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{item.programTypeName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目状态">{{item.endFlagName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="课业辅导一对一课时数">{{item.tutoringMentorHour == -1?"不限":(item.tutoringMentorHour || '无')}}</el-descriptions-item>
                <el-descriptions-item label="行业导师">{{item.mentorNames == -1?"不限":(item.mentorNames || '无')}}</el-descriptions-item>
                <el-descriptions-item label="Strategist">{{item.strategistName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="Program Manager">{{item.servicesName||'无'}}</el-descriptions-item>
                <el-descriptions-item label="项目周期">{{item.programPeriod||'无'}}</el-descriptions-item>
                <el-descriptions-item label="金额($)">{{item.programPriceUsd||'无'}}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 弹框 -->
    <el-dialog :close-on-click-modal="false" title="设置负责人" :visible.sync="setVipVisible" width="500px" :before-close="closeVIP">
      <el-form :inline="true" label-width="130px">
        <el-form-item label="Strategist">
          <el-select
            v-model="vipList.strategist"
            filterable
            placeholder="请选择"
          >
            <el-option
              key="1"
              label="Bean（线上测试）"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Program Manager">
          <el-select
            v-model="vipList.service"
            filterable
            placeholder="请选择"
          >
            <el-option
              key="1"
              label="Kaan（线上测试）"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVIP">取 消</el-button>
        <el-button type="primary" @click="closeVIP">确 定</el-button>
      </span>
    </el-dialog>

    <Praise
      :praiseVisible="praiseVisible"
      :signId="signId"
      :menteeData="menteeData"
      @close="praiseClose"
    />
    <EditMentee
      :menteeData="menteeData"
      :setMenteeVisible="setMenteeVisible"
      @submit="setMenteeSubmit"
      @close="setMenteeClose"
    />
    <WebsiteSetting
      v-if="websiteSettingVisible"
      :websiteSettingVisible="websiteSettingVisible"
      :menteeData="menteeData"
      @close="websiteSettingClose"
      @submit="websiteSettingSubmit"
    />
    <MenteeFile
      :menteeFileVisible="menteeFileVisible"
      :menteeData="menteeData"
      @close="menteeFileClose"
    />
    <SetRecommand
      :recommandVisible="recommandVisible"
      :menteeId="menteeId"
      @close="SetRecommandClose"
    />
    <MenteeFollowRule
      :menteeFollowRuleVisible="menteeFollowRuleVisible"
      :menteeData="menteeData"
      @close="menteeFollowRuleClose"
    />
    <PayWayNew
      :payWayVisible="payWayVisible"
      :menteeData="menteeData"
      @close="payWayClose"
      @submit="payWaySubmit"
    ></PayWayNew>
    <WatchMenteeEvent
      :watchMenteeEventVisible="watchMenteeEventVisible"
      :menteeData="menteeData"
      @close="watchMenteeEventClose"
    />
    <SetInternship
      :setInternshipVisible="setInternshipVisible"
      :internshipData="internshipData"
      @close="setInternshipClose"
      @submit="setInternshipSubmit"
    ></SetInternship>
    <VipFollowUserDetail
      :followVisible="followVisible"
      :menteeInfo="menteeInfo"
      :signId="signId"
      @close="followClose"
    ></VipFollowUserDetail>
    <lessonLive
      v-if="lessonLiveVisible"
      :lessonLiveVisible="lessonLiveVisible"
      :menteeId="menteeId"
      :signId="signId"
      @close="lessonLiveClose"
    />
    <lessonSeries
      v-if="lessonSeriesVisible"
      :lessonSeriesVisible="lessonSeriesVisible"
      :menteeId="menteeId"
      :signId="signId"
      @close="lessonSeriesClose"
    />
    <lessonStrategistSession
      v-if="lessonStrategistSessionVisible"
      :lessonStrategistSessionVisible="lessonStrategistSessionVisible"
      :menteeId="menteeId"
      :signId="signId"
      @close="lessonStrategistSessionClose"
    />
    <jerryHour
      v-if="jerryHourVisible"
      :jerryHourVisible="jerryHourVisible"
      :menteeId="menteeId"
      :signId="signId"
      @close="jerryHourClose"
    />
    <applicationLetterModifyDone
      :applicationLetterModifyDoneVisible="applicationLetterModifyDoneVisible"
      :menteeId="menteeId"
      :signId="signId"
      :menteeName="menteeInfo.realName"
      @close="applicationLetterModifyDoneClose"
    />
    <subHis
      :subHisVisible="subHisVisible"
      :signId="signId"
      :menteeName="menteeInfo.realName"
      @close="subHisClose"
    />
    <offerComponents :drawerVisble="drawerVisble"
      :signId="signId"
      :community="community"
      :publicStatus="publicStatus"
      :menteeId="menteeId"
      :menteeName="menteeName"
      :programPeriod="programPeriod"
      :programType="programType"
      :schoolName="schoolName"
      :hignSchoolName="hignSchoolName"
      :menteeInfo="menteeInfo"
      @close="drawerClose"
     />
     <interviewComponents :interviewVisble="interviewVisble"
      :signId="signId"
      :publicStatus="publicStatus"
      :community="community"
      :menteeId="menteeId"
      :menteeName="menteeName"
      :programPeriod="programPeriod"
      :programType="programType"
      :schoolName="schoolName"
      :hignSchoolName="hignSchoolName"
      :menteeInfo="menteeInfo"
      @close="interviewClose"
     />
     <updateOrder
      :updateSignDataVisible="updateSignDataVisible"
      :signId="signId"
      :signData="signData"
      @close="updateOrderClose"
      @submit="updateOrderSubmit"
     />
     <updateOral
      :updateOralVisible="updateOralVisible"
      :signId="signId"
      :mentorHour="mentorHour"
      :oralLessonHour="oralLessonHour"
      @close="closeUpdateOral"
      @submit="submiteUpdateOral"
     />
     <setVip
      :vipSetVisible="vipSetVisible"
      :signId="signId"
      :signData="signData"
      @close="vipSetClose"
      @submit="vipSetSubmit"
     />
     <refund
      :refundVisible="refundVisible"
      :orderId="orderId"
      :menteeName="menteeInfo.realName"
      :wxID="menteeInfo.wxId  "
      @close="refundClose"
      @submit="refundSubmit"
    ></refund>
    <set-mentor
      :mentorVisible="mentorVisible"
      :signId="signId"
      :menteeId="menteeId"
      :mentorHours="mentorHours"
      :programType="programType"
      @close="setMentorClose"
    ></set-mentor>
    <AddPretalk
      :addPretalkVisible="addPretalkVisible"
      :keyIdNew="menteeId"
      :kolTypeNew="kolTypeNew"
      @close="pretalkClose"
      @success="pretalkSuccess"
    ></AddPretalk>
    <AddKol
      :addVisible="addVisible"
      :keyIdNew="menteeId"
      :kolTypeNew="kolTypeNew"
      @close="addClose"
      @success="addSuccess"
    ></AddKol>
    <ApplySeason
      :applySeasonVisible="applySeasonVisible"
      :signId="signId"
      @close="closeApplySeason"
    />
    <ChooseContinualProgram
      :chooseProgramVisible="continualVisible"
      :programType="programType"
      @close="continualClose"
      @submit="continualSubmit"
    />
    <SignDetailContinual
      v-if="signDetailContinualVisible"
      :signDetailContinualVisible="signDetailContinualVisible"
      :menteeId="menteeId"
      :signId="signId"
      :orderId="orderId"
      :programId="programId"
      :programType="programType"
      @close="signDetailContinualClose"
      @success="signDetailContinualClose"
      @onlineSuccess="signDetailOnlineSubmit"
    />
    <overview
      :overviewVisible="overviewVisible"
      :signId="signId"
      @close="overviewClose"
      @submit="overviewSubmit"
    ></overview>
    <Survey
      :SurveyVisible="SurveyVisible"
      :signId="signId"
      @close="SurveyClose"
    ></Survey>
    <netJobCalendar :netJobCalendarVisible="netJobCalendarVisible" :menteeId="menteeId" @close="netJobCalendarClose"/>
    <uploadContract
      :orderId="orderId"
      :userType="userType"
      :contractVisible="contractVisible"
      @close="contractClose"
      @submit="contractSubmit"
    />
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import file from '@/libs/file'
import EditMentee from './components/SetMentee'
import WebsiteSetting from './components/WebsiteSetting.vue'
import MenteeFile from './components/MenteeFile.vue'
import SetRecommand from './components/SetRecommand.vue'
import MenteeFollowRule from './components/MenteeFollowRule.vue'
import PayWayNew from './components/PayWayNew.vue'
import WatchMenteeEvent from './components/WatchMenteeEvent.vue'
import SetInternship from './components/SetInternship.vue'
import VipFollowUserDetail from './components/VipFollowUserDetail.vue'
import Praise from './components/Praise.vue'
import offerComponents from './Offer.vue'
import interviewComponents from './Interview.vue'
import refund from './components/refund.vue'
import lessonLive from './components/LessonLive.vue'
import lessonSeries from './components/LessonSeries.vue'
import lessonStrategistSession from './components/LessonStrategistSession.vue'
import jerryHour from './components/jerryHour.vue'
import applicationLetterModifyDone from './components/LessonApplicationLetter.vue'
import subHis from './components/subHis.vue'
import updateOrder from './components/UpdateOrder.vue'
import updateOral from './components/updateOral.vue'
import setVip from './components/setVip.vue'
import setMentor from './components/set_mentor.vue'
import AddPretalk from '@/views/BD/pretalkComponents/addPretalkNew'
import AddKol from '@/views/BD/kolComponents/addKol'
import ApplySeason from './components/ApplySeason.vue'
import ChooseContinualProgram from '@/views/sales/sign/ChooseContinualProgram'
import SignDetailContinual from '@/views/sales/sign/SignDetailContinual'
import Overview from './components/Overview'
import Survey from './components/Survey'
import netJobCalendar from './components/netJobCalendar'
import uploadContract from '../../sales/order/components/UploadContract.vue'

import { mapState } from 'vuex'

export default {
  name: 'UserDetail',
  components: {
    uploadContract,
    jerryHour,
    EditMentee,
    WebsiteSetting,
    MenteeFile,
    SetRecommand,
    MenteeFollowRule,
    PayWayNew,
    WatchMenteeEvent,
    SetInternship,
    VipFollowUserDetail,
    Praise,
    lessonLive,
    lessonSeries,
    lessonStrategistSession,
    applicationLetterModifyDone,
    subHis,
    offerComponents,
    interviewComponents,
    updateOrder,
    updateOral,
    setVip,
    refund,
    setMentor,
    AddPretalk,
    AddKol,
    ApplySeason,
    ChooseContinualProgram,
    SignDetailContinual,
    Overview,
    Survey,
    netJobCalendar
  },
  data: () => {
    return {
      publicStatus: null,
      menteeId: '',
      menteeInfo: {},
      orderArr: [],
      menteeData: {},
      loading: false,
      refundVisible: false,
      activeName: '',
      praiseVisible: false,
      applySeasonVisible: false,
      contractVisible: false,
      setVipVisible: false,
      setMenteeVisible: false,
      websiteSettingVisible: false,
      menteeFileVisible: false,
      recommandVisible: false,
      menteeFollowRuleVisible: false,
      watchMenteeEventVisible: false,
      setInternshipVisible: false,
      followVisible: false,
      lessonLiveVisible: false,
      lessonSeriesVisible: false,
      lessonStrategistSessionVisible: false,
      jerryHourVisible: false,
      overviewVisible: false,
      SurveyVisible: false,
      applicationLetterModifyDoneVisible: false,
      subHisVisible: false,
      updateSignDataVisible: false,
      vipSetVisible: false,
      netJobCalendarVisible: false,
      signData: {},
      signId: '',
      internshipData: {},
      payWayVisible: false,
      drawerVisble: false,
      interviewVisble: false,
      mentorVisible: false,
      addPretalkVisible: false,
      updateOralVisible: false,
      kolTypeNew: 'mentee',
      userType: 'vip',
      addVisible: false,
      programType: '',
      community: '',
      programPeriod: '',
      hignSchoolName: '',
      mentorHours: 0,
      schoolName: '',
      menteeName: '',
      mentorHour: 0,
      oralLessonHour: 0,
      orderId: '',
      vipList: {
        strategist: '1',
        service: '1'
      },
      continualVisible: false,
      programId: '',
      signDetailContinualVisible: false
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
      this.menteeId = this.$route.query.menteeId
      const params = {
        menteeId: this.menteeId
      }
      this.loading = true
      api.getMenteeDetail(params).then(res => {
        console.log(res)
        this.loading = false
        if (res.code == '200') {
          this.menteeInfo = res.data.menteeInfo
          this.orderArr = res.data.orderArr
          this.activeName = this.orderArr[0].orderId
        } else {
          this.$message.error(res.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    tabClick () {},
    contractClose () {
      this.contractVisible = false
    },
    contractSubmit () {
      this.contractVisible = false
      this.Topage()
    },
    // 好评图
    showPraise (signId) {
      this.signId = signId
      this.menteeData = this.menteeInfo
      this.praiseVisible = true
    },
    praiseClose () {
      this.praiseVisible = false
    },
    // 申请季
    showApplySeason (signId) {
      this.signId = signId
      this.applySeasonVisible = true
    },
    closeApplySeason () {
      this.applySeasonVisible = false
    },
    showVIP () {
      this.setVipVisible = true
    },
    closeVIP () {
      this.setVipVisible = false
    },
    /**
     * @description: 根据合同后缀，处理显示
     * @param {*} filePath
     * @return {*}
     */
    getFileExt (filePath) {
      const index = filePath.lastIndexOf('.')
      const ext = filePath.substr(index + 1)
      if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
        return 'file-image-o'
      } else if (ext == 'doc' || ext == 'docx') {
        return 'file-word-o'
      } else if (ext == 'pdf') {
        return 'file-pdf-o'
      } else {
        return 'file'
      }
    },
    // 判断时间与当前时间
    overdue (data) {
      return new Date() > new Date(data)
    },
    // 合同预览
    preview (path) {
      file.preview(path)
    },
    showLesson (signId) {
      if (this.verifyMenteeInfo()) {
        return
      }
      this.$router.push({ name: 'CourseDetail', query: { signId: signId } })
    },
    /**
     * @description: 验证个人信息
     * @param {*}
     * @return {*}
     */
    verifyMenteeInfo () {
      if (
        !this.menteeInfo.major ||
        !this.menteeInfo.sex ||
        !this.menteeInfo.finishYear
      ) {
        this.$message({
          type: 'error',
          message: '学员信息不完整，请优先补全'
        })
        return true
      }
      return false
    },
    undo () {
      this.$message.warning('该功能暂未开放')
    },
    editUser () {
      this.menteeData = {
        vipRecommendStatus: this.menteeInfo.vipRecommendStatus,
        vipRecommender: this.menteeInfo.vipRecommender,
        menteeId: this.menteeInfo.menteeId,
        school: this.menteeInfo.school,
        isStem: this.menteeInfo.isStem,
        isTransfer: this.menteeInfo.isTransfer,
        isApplyMaster: this.menteeInfo.isApplyMaster,
        selfAssessment: this.menteeInfo.selfAssessment,
        highSchool: this.menteeInfo.highSchool,
        realName: this.menteeInfo.realName,
        wxId: this.menteeInfo.wxId,
        email: this.menteeInfo.email,
        degree: this.menteeInfo.degree,
        sex: this.menteeInfo.sex,
        community: this.menteeInfo.community,
        finishYear: this.menteeInfo.finishYear,
        major: this.menteeInfo.major ? this.menteeInfo.major.split(',') : []
      }
      this.setMenteeVisible = true
    },
    setMenteeClose () {
      this.setMenteeVisible = false
    },
    setMenteeSubmit () {
      this.setMenteeClose()
      this.Topage()
    },
    websiteSetting () {
      this.menteeData.menteeId = this.menteeInfo.menteeId
      this.menteeData.account = this.menteeInfo.webAccount
      this.menteeData.realName = this.menteeInfo.realName
      this.menteeData.wxId = this.menteeInfo.wxId
      this.menteeData.webAccount = this.menteeInfo.webAccount
      this.websiteSettingVisible = true
    },
    websiteSettingClose () {
      this.websiteSettingVisible = false
    },
    websiteSettingSubmit () {
      this.Topage()
    },
    pFile () {
      this.menteeData = this.menteeInfo
      this.menteeFileVisible = true
    },
    menteeFileClose () {
      this.menteeFileVisible = false
    },
    SetRecommandClose () {
      this.recommandVisible = false
    },
    netApplication () {
      this.recommandVisible = true
      this.menteeId = this.menteeInfo.menteeId
    },
    followRule () {
      this.menteeFollowRuleVisible = true
      this.menteeData = this.menteeInfo
    },
    uploadContract (data) {
      console.log(11111111111)
      this.orderId = data.orderId
      this.contractVisible = true
    },
    menteeFollowRuleClose () {
      this.menteeFollowRuleVisible = false
    },
    toPayWay (row) {
      this.menteeData = this.menteeInfo
      // this.getMentorData(row);
      this.payWayVisible = true
    },
    payWayClose () {
      this.menteeData = {}
      this.payWayVisible = false
    },
    payWaySubmit () {
      this.Topage()
      this.payWayClose()
    },
    watchMenteeEventShow () {
      this.menteeData = this.menteeInfo
      this.watchMenteeEventVisible = true
    },
    netJobCalendar () {
      this.netJobCalendarVisible = true
    },
    netJobCalendarClose () {
      this.netJobCalendarVisible = false
    },
    watchMenteeEventClose () {
      this.watchMenteeEventVisible = false
    },
    setInternship (v) {
      this.internshipData = {
        signId: v.signId,
        internshipStatus: v.internshipStatus,
        internship: v.internship,
        internshipId: v.internshipId,
        internshipLocation: v.internshipLocation,
        internshipDate: [v.internshipStartDate, v.internshipEndDate],
        internshipDuration: v.internshipDuration,
        internshipNote: v.internshipNote
      }
      this.setInternshipVisible = true
    },
    setInternshipClose () {
      this.setInternshipVisible = false
    },
    setInternshipSubmit () {
      this.setInternshipClose()
      this.Topage()
    },
    tofollow (item) {
      this.signId = item.signId
      this.followVisible = true
    },
    followClose () {
      console.log('followClose')
      this.followVisible = false
    },
    refund (data) {
      this.orderId = data.orderId
      console.log(data, this.menteeInfo)
      this.refundVisible = true
    },
    showLessonDialog (item, type) {
      this.signId = item.signId
      switch (type) {
        case 'live':
          // 直播
          this.lessonLiveVisible = true
          break
        case 'recorded':
          // 录播
          this.lessonSeriesVisible = true
          break
        case '1toN':
          this.lessonStrategistSessionVisible = true
          // 录播
          break
        case 'jerryHour':
          this.jerryHourVisible = true
          // 录播
          break
        case 'applicationLetterModifyDone':
          this.applicationLetterModifyDoneVisible = true
          // 录播
          break
        case 'subHis':
          this.subHisVisible = true
          // 录播
          break
      }
    },
    lessonLiveClose () {
      this.lessonLiveVisible = false
    },
    lessonSeriesClose () {
      this.lessonSeriesVisible = false
    },
    lessonStrategistSessionClose () {
      this.lessonStrategistSessionVisible = false
    },
    jerryHourClose () {
      this.jerryHourVisible = false
    },
    applicationLetterModifyDoneClose () {
      this.applicationLetterModifyDoneVisible = false
    },
    subHisClose () {
      this.subHisVisible = false
    },
    toInterview (item, publicStatus) {
      console.log(item)
      this.publicStatus = publicStatus == '0' ? '0' : '1'
      this.interviewVisble = true
      this.signId = item.signId
      this.menteeId = this.menteeInfo.menteeId
      this.menteeName = this.menteeInfo.menteeName
    },
    toOffer (item, publicStatus) {
      console.log(item)
      this.publicStatus = publicStatus == '0' ? '0&&否' : '1&&是'
      this.drawerVisble = true
      this.signId = item.signId
      this.menteeId = this.menteeInfo.menteeId
      this.menteeName = this.menteeInfo.menteeName
      this.programType = item.programType
      this.community = this.menteeInfo.community
      this.programPeriod = item.programPeriod
      this.schoolName = this.menteeInfo.schoolName
      this.hignSchoolName = this.menteeInfo.hignSchoolName
    },
    drawerClose () {
      this.drawerVisble = false
    },
    interviewClose () {
      this.interviewVisble = false
    },
    updateOrderClose () {
      this.updateSignDataVisible = false
    },
    updateOrderSubmit () {
      this.updateSignDataVisible = false
      this.Topage()
    },
    toUpdate (item) {
      this.updateSignDataVisible = true
      this.signData = item
      this.signId = item.signId
    },
    toVip (item) {
      this.signId = item.signId
      this.signData = item
      this.vipSetVisible = true
    },
    vipSetClose () {
      this.vipSetVisible = false
    },
    vipSetSubmit () {
      this.vipSetVisible = false
      this.Topage()
    },
    refundClose () {
      this.refundVisible = false
    },
    refundSubmit () {
      this.refundClose()
      this.Topage()
    },
    toEducation (data) {
      this.mentorVisible = true
      this.signId = data.signId
      this.programType = data.programType
    },
    setMentorClose () {
      this.mentorVisible = false
    },
    newPretalk () {
      this.addPretalkVisible = true
    },
    pretalkSuccess () {
      this.addPretalkVisible = false
      this.Topage()
    },
    pretalkClose () {
      this.addPretalkVisible = false
    },
    newSelect () {
      this.$message.error('入口维护，暂时关闭！！')
      // this.addVisible = true
    },
    addClose () {
      this.addVisible = false
    },
    addSuccess () {
      this.addVisible = false
      this.Topage()
    },
    // 续约
    /**
     * @description: 续约
     * @param {*} v
     * @return {*}
     */
    continual (v) {
      this.continualVisible = true
      this.programType = 'continual'
      this.signId = v.signId
      this.orderId = v.orderId
    },
    survey (v) {
      this.signId = v.signId
      this.SurveyVisible = true
    },
    SurveyClose () {
      this.SurveyVisible = false
    },
    continualClose () {
      this.continualVisible = false
    },
    continualSubmit (programId) {
      console.log(programId, '1111111111111')
      this.continualClose()
      this.programId = programId
      this.signDetailContinualVisible = true
    },
    signDetailOnlineSubmit (signUrl, docUrl) {
      console.log(signUrl, docUrl, 111111111111111111111)
      this.signDetailContinualVisible = false
      // this.contractURL = signUrl;
      // this.contractPDFURL = docUrl.docList[0].docUrl;
    },
    signDetailContinualClose () {
      this.signDetailContinualVisible = false
    },
    overview (signId) {
      console.log('overview', signId)
      this.signId = signId
      this.overviewVisible = true
    },
    overviewClose () {
      this.overviewVisible = false
    },
    overviewSubmit () {
      this.overviewClose()
      this.Topage()
    },
    updateOral (item) {
      this.updateOralVisible = true
      this.signId = item.signId
      this.mentorHour = item.mentorHour
      this.oralLessonHour = item.oralLessonHour
      console.log(item)
    },
    closeUpdateOral () {
      this.updateOralVisible = false
    },
    submiteUpdateOral () {
      this.updateOralVisible = false
      this.Topage()
    }
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
    position: relative;
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
  .redColor{
    color: red;
  }
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
