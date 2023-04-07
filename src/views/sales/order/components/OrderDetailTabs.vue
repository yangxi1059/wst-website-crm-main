<!--
 * @Author: 杨曦
 * @Date: 2022-11-18 10:34:53
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-18 10:36:30
 * @Version: 
 * @Description: 
-->
<template>
  <d2-container v-loading="loading">
      <div class="d2_container" ref="d2">
        <div class="mentee-detail">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="11" class="mb10">
                <template slot="title">
                  <div class="mentee-detail-title">学员信息</div>
                </template>
                <el-card shadow="hover">
                  <el-row>
                    <el-col :span="3" class="mentee-detail-name">学员ID</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{menteeInfo.menteeId||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">学员姓名</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{menteeInfo.realName||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">微信ID</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{menteeInfo.wxId||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">邮箱</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{menteeInfo.email||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">电话号码</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{menteeInfo.telephone||'无'}}</el-col>
                  </el-row>
                </el-card>
              </el-collapse-item>
              <el-collapse-item name="12" class="mb10">
                <template slot="title">
                  <div class="mentee-detail-title">订单信息</div>
                </template>
                <el-card shadow="hover">
                  <el-row>
                    <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.orderId||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.signDate||'无'}}</el-col>
                    <!-- <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                    <el-col
                      :span="3"
                      class="mentee-detail-value"
                    >{{orderInfo.startDate + '~' + orderInfo.endDate}}</el-col> -->
                    <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.contact1Str||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.contact2Str||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">支付状态</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.payStatusStr||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">KPI周期</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.kpiPeriod||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">订单类型</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.orderTypeStr||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">订单合作商</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.cooperatorName||'无'}}</el-col>
                    <!-- <el-col :span="3" class="mentee-detail-name">是否VIP同事推荐</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.vipRecommendStatusName||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name" v-if="orderInfo.vipRecommendStatus == 1">VIP同事推荐人</el-col>
                    <el-col :span="3" class="mentee-detail-value" v-if="orderInfo.vipRecommendStatus == 1">{{orderInfo.vipRecommenderName||'无'}}</el-col> -->
                    <el-col :span="3" class="mentee-detail-name">BD管理人</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.bdManageByName||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">BD提成比例</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.bdBrokerageRate||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name">订单折扣</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.discountStatusName||'无'}}</el-col>
                    <el-col :span="3" class="mentee-detail-name" v-if="orderInfo.publicStatus == '0'">实名宣传</el-col>
                    <el-col :span="3" class="mentee-detail-value" style="color:#c32e47" v-if="orderInfo.publicStatus == '0'">不可宣传</el-col>
                    <el-col :span="3" class="mentee-detail-name">合同公司</el-col>
                    <el-col :span="3" class="mentee-detail-value">{{orderInfo.signCompanyName||'无'}}</el-col>
                    <template v-if="orderInfo.discountInfo">
                      <el-col :span="3" class="mentee-detail-name">折扣说明</el-col>
                      <el-col :span="3" class="mentee-detail-value">
                        <el-popover
                          width="400"
                          trigger="hover"
                          placement="top-start"
                          :content="orderInfo.discountInfo||'无'"
                        >
                          <span
                            size="mini"
                            type="text"
                            class="w80"
                            slot="reference"
                          >{{orderInfo.discountInfo||'无'}}</span>
                        </el-popover>
                      </el-col>
                    </template>
                      <el-col
                        :span="3"
                        class="mentee-detail-name"
                        v-if="orderInfo.signWay == 'online' && orderInfo.signStatus == '0'"
                      >线上签约</el-col>
                        <el-col
                          style="display:inline-block;"
                          class="mentee-detail-value mr10"
                        >
                          <el-button v-if="orderInfo.signWay == 'online' && orderInfo.signStatus == '0'" @click="getSignUrlByOrderId" size="mini">获取线上签约URL</el-button>
                          <el-button type="warning" v-if="orderInfo.signWay == 'online' && orderInfo.signStatus == '0'" @click="offLine(orderInfo.orderId)" size="mini">转为线下签约</el-button>
                          <el-button type="primary" @click="getPayLine(orderInfo.orderId)" size="mini">获取线上支付链接</el-button>
                        </el-col>
                  </el-row>
                </el-card>
              </el-collapse-item>
              <el-collapse-item name="13" class="mb10">
                <template slot="title">
                  <div class="mentee-detail-title">Transition</div>
                  <el-button plain circle type="primary"  size="mini" @click.stop="updateTransition(orderInfo.payStatus)">更新</el-button>
                </template>
                <el-card shadow="hover">
                  <el-row>
                    <el-col :span="3" class="mentee-detail-name">父母职业</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.parentJob||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.parentJob||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">性格类型</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.parentPersonality||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.parentPersonality||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">父母对小孩的期望</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.parentExpectation||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.parentExpectation||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">对小孩人生的介入程度</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.parentControl||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.parentControl||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">购买力</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.parentPurchasingPower||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.parentPurchasingPower||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">对行业的了解程度</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.menteeIndustryLevel||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.menteeIndustryLevel||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">学生心理状态</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.menteeMentality||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.menteeMentality||'无'}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="3" class="mentee-detail-name">需要后期综合注意的点</el-col>
                    <el-col :span="3" class="mentee-detail-value">
                      <el-popover
                        width="400"
                        trigger="hover"
                        placement="top-start"
                        :content="transition.notice||'无'"
                      >
                        <span
                          size="mini"
                          type="text"
                          class="w80"
                          slot="reference"
                        >{{transition.notice||'无'}}</span>
                      </el-popover>
                    </el-col>
                  </el-row>
                </el-card>
              </el-collapse-item>
              <el-collapse-item v-if="!projectList.length" :title="'数据加载中...'"></el-collapse-item>
              <template v-for="(item,i) in projectList">
                <el-collapse-item v-if="item.programType == 'basic'" :key="i" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（基础项目）</div>
                    <el-button
                      v-if="roleInfo.includes(`aduit_update_orderInfo`)"
                      type="primary"
                      size="mini"
                      plain
                      circle
                      @click.stop="updateSignData(item.signId,item)"
                    >更新签约</el-button>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">金额(￥)</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPriceCny||'无'}}</el-col>
                      <!-- <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col> -->
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">延长服务日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">行业导师一对一课时数</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.mentorHour == -1 ? '不限' : item.mentorHour) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">Strategist Sessions（旧）</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.vipHour == -1 ? '不限' : item.vipHour) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">1对多Office Hour</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.officeHourStrategistSession == -1 ? '不限' : item.officeHourStrategistSession) ||'0'}} 次/月</el-col>

                      <el-col :span="3" class="mentee-detail-name">系列课课时：</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.seriesHour == -1 ? '不限' : item.seriesHour) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">Jerry一对一：</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.jerryHour == -1 ? '不限' : item.jerryHour) ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Tequila Shot（旧）</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.tequilaShotHour == -1 ? '不限' : item.tequilaShotHour) ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Office Hour（旧）</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.officeHour == -1 ? '不限' : item.officeHour) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">Live Lessons（新）</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.liveLesson == -1 ? '不限' : item.liveLesson) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">全职导师文书修改次数</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.applicationLetterModify == -1 ? '不限' : item.applicationLetterModify) ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">行业导师文书修改次数</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.mentorLetterModify == -1 ? '不限' : item.mentorLetterModify) ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">购买额外课时</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.hasContinual||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">电子书架</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.hasEbookStore||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">领衔导师</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.seniorStrategist||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">应急导师</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.emergencyMentor||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">证书主题直播课权限</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.certificateSubjectLiveCourseAuthority||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">专项、面试导师</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.interviewMentor||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">优先内推</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.priority||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">系列课（口语）</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.hasEnglishSeries||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">口语课程</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.hasOral||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">导师数量</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.mentorCount == -1 ? '不限' : item.mentorCount) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">线下小班课</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{(item.seminars == -1 ? '不限' : item.seminars) ||'无'}}</el-col>

                      <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPeriod||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.strategistName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.servicesName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'internship'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（实习项目）</div>
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      circle
                      @click.stop="overview(item.signId)"
                    >一览</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="item.internshipStatus == 0"
                      plain
                      circle
                      @click.stop="setInternship(item)"
                    >实习</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      circle
                      @click.stop="refund(item.orderId)"
                    >退</el-button>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}
                        <el-tag v-if="item.internshipFlag && item.internshipFlag == '1'" type="danger" size="small" >内推</el-tag>
                        <el-tag v-if="item.internshipFlag == '0'" type="danger" size="small" >直接安排</el-tag>
                      </el-col>
                      <el-col :span="3" class="mentee-detail-name">金额($)</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPriceUsd||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                    </el-row>
                    <el-card shadow="none" class="mt20">
                      <el-row>
                        <el-col :span="3" class="mentee-detail-name">实习单位</el-col>
                        <el-col :span="3" class="mentee-detail-value">{{item.internshipDesc||'无'}}</el-col>
                        <el-col :span="3" class="mentee-detail-name">实习地点</el-col>
                        <el-col :span="3" class="mentee-detail-value">{{item.internshipLocationName||'无'}}</el-col>
                        <el-col :span="3" class="mentee-detail-name">实习时长</el-col>
                        <el-col :span="3" class="mentee-detail-value">{{item.internshipTimeName ||'无'}}</el-col>
                        <el-col :span="3" class="mentee-detail-name">实习时间</el-col>
                        <el-col
                          :span="3"
                          class="mentee-detail-value"
                        >{{(item.internshipStartDate||'无') + '~' + (item.internshipEndDate||'无')}}</el-col>
                        <el-col :span="3" class="mentee-detail-name">实习状态</el-col>
                        <el-col :span="3" class="mentee-detail-value">{{item.internshipStatus == 0 ? '未安排':'已安排'}}</el-col>
                        <el-col :span="3" class="mentee-detail-name">实习备注</el-col>
                        <el-col :span="15" class="mentee-detail-value">{{item.internshipNote||'无'}}</el-col>
                      </el-row>
                    </el-card>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'oral'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（口语项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.orderId||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.signDate||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.contact1Name||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.contact2Name||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">口语导师一对一课时数</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.oralLessonHour == -1?"不限":(item.oralLessonHour || '无')}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">行业导师</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                        :title="item.mentorNames"
                      >{{item.mentorNames||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.strategistName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.servicesName||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'cfa'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（CFA项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.orderId||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.signDate||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">延长服务日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-col>
                      <!-- <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.contact1Name||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.contact2Name||'无'}}</el-col>-->
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPeriod ||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'finance'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（财商项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.orderId||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.signDate||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">延长服务日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">财商导师一对一课时数</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.financeHour == -1?"不限":(item.financeHour || '无')}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.servicesName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.strategistName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPeriod ||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'jcxy'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（杰创项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.orderId||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">延长服务日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPeriod ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">金额(￥)</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPriceCny||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'tutoring'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（课业辅导项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.orderId||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.signDate||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">延长服务日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{(item.extendedEndDate == item.endDate || !item.extendedEndDate) ? '无延长' :item.extendedEndDate}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">课业辅导1对1课时数</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.tutoringMentorHour||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.servicesName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.strategistName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPeriod ||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'continual'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（续课项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">金额(￥)</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPriceCny||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name" v-if="item.mentorHour">行业导师一对一课时数</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                        v-if="item.mentorHour"
                      >{{(item.mentorHour == -1 ? '不限' : item.mentorHour) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.vipHour" class="mentee-detail-name">Strategist Sessions（旧）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.vipHour"
                        class="mentee-detail-value"
                      >{{(item.vipHour == -1 ? '不限' : item.vipHour) ||'无'}}</el-col>

                      <el-col :span="5" v-if="item.officeHourStrategistSession" class="mentee-detail-name">1对多Office Hour</el-col>
                      <el-col
                        :span="1"
                        v-if="item.officeHourStrategistSession"
                        class="mentee-detail-value"
                      >{{(item.officeHourStrategistSession == -1 ? '不限' : item.officeHourStrategistSession) ||'0'}} 次/月</el-col>

                      <el-col :span="3" v-if="item.seriesHour" class="mentee-detail-name">系列课课时数</el-col>
                      <el-col
                        :span="3"
                        v-if="item.seriesHour"
                        class="mentee-detail-value"
                      >{{(item.seriesHour == -1 ? '不限' : item.seriesHour) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.jerryHour" class="mentee-detail-name">Jerry一对一：</el-col>
                      <el-col
                        :span="3"
                        v-if="item.jerryHour"
                        class="mentee-detail-value"
                      >{{(item.jerryHour == -1 ? '不限' : item.jerryHour) ||'无'}}</el-col>
                      <el-col :span="3" v-if="item.tequilaShotHour" class="mentee-detail-name">Tequila Shot（旧）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.tequilaShotHour"
                        class="mentee-detail-value"
                      >{{(item.tequilaShotHour == -1 ? '不限' : item.tequilaShotHour) ||'无'}}</el-col>
                      <el-col v-if="item.officeHour" :span="3" class="mentee-detail-name">Office Hour（旧）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.officeHour"
                        class="mentee-detail-value"
                      >{{(item.officeHour == -1 ? '不限' : item.officeHour) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.liveLesson" class="mentee-detail-name">Live Lessons（新）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.liveLesson"
                        class="mentee-detail-value"
                      >{{(item.liveLesson == -1 ? '不限' : item.liveLesson) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.applicationLetterModify" class="mentee-detail-name">全职导师文书修改次数</el-col>
                      <el-col
                        :span="3"
                        v-if="item.applicationLetterModify"
                        class="mentee-detail-value"
                      >{{(item.applicationLetterModify == -1 ? '不限' : item.applicationLetterModify) ||'无'}}</el-col>
                      <el-col :span="3" v-if="item.mentorLetterModify" class="mentee-detail-name">行业导师文书修改次数</el-col>
                      <el-col
                        :span="3"
                        v-if="item.mentorLetterModify"
                        class="mentee-detail-value"
                      >{{(item.mentorLetterModify == -1 ? '不限' : item.mentorLetterModify) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.hasContinual" class="mentee-detail-name">购买额外课时</el-col>
                      <el-col :span="3" v-if="item.hasContinual" class="mentee-detail-value">{{item.hasContinual||'无'}}</el-col>
                      <el-col :span="3" v-if="item.hasEbookStore" class="mentee-detail-name">电子书架</el-col>
                      <el-col :span="3" v-if="item.hasEbookStore" class="mentee-detail-value">{{item.hasEbookStore||'无'}}</el-col>
                      <el-col :span="3" v-if="item.seniorStrategist" class="mentee-detail-name">领衔导师</el-col>
                      <el-col :span="3" v-if="item.seniorStrategist" class="mentee-detail-value">{{item.seniorStrategist||'无'}}</el-col>
                      <el-col :span="3" v-if="item.emergencyMentor" class="mentee-detail-name">应急导师</el-col>
                      <el-col :span="3" v-if="item.emergencyMentor" class="mentee-detail-value">{{item.emergencyMentor||'无'}}</el-col>
                      <el-col :span="3" v-if="item.certificateSubjectLiveCourseAuthority" class="mentee-detail-name">证书主题直播课权限</el-col>
                      <el-col
                        :span="3"
                        v-if="item.certificateSubjectLiveCourseAuthority"
                        class="mentee-detail-value"
                      >{{item.certificateSubjectLiveCourseAuthority||'无'}}</el-col>
                      <el-col :span="3" v-if="item.interviewMentor" class="mentee-detail-name">专项、面试导师</el-col>
                      <el-col :span="3" v-if="item.interviewMentor" class="mentee-detail-value">{{item.interviewMentor||'无'}}</el-col>
                      <el-col :span="3" v-if="item.priority" class="mentee-detail-name">优先内推</el-col>
                      <el-col :span="3" v-if="item.priority" class="mentee-detail-value">{{item.priority||'无'}}</el-col>
                      <el-col :span="3" v-if="item.mentorCount" class="mentee-detail-name">导师数量</el-col>
                      <el-col
                        :span="3"
                        v-if="item.mentorCount"
                        class="mentee-detail-value"
                      >{{(item.mentorCount == -1 ? '不限' : item.mentorCount) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.seminars" class="mentee-detail-name">线下小班课</el-col>
                      <el-col
                        :span="3"
                        v-if="item.seminars"
                        class="mentee-detail-value"
                      >{{(item.seminars == -1 ? '不限' : item.seminars) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.programPeriod" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" v-if="item.programPeriod" class="mentee-detail-value">{{item.programPeriod||'无'}}</el-col>
                      <el-col :span="3" v-if="item.strategistName" class="mentee-detail-name">Strategist</el-col>
                      <el-col :span="3" v-if="item.strategistName" class="mentee-detail-value">{{item.strategistName||'无'}}</el-col>
                      <el-col :span="3" v-if="item.servicesName" class="mentee-detail-name">Program Manager</el-col>
                      <el-col :span="3" v-if="item.servicesName" class="mentee-detail-value">{{item.servicesName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                    </el-row>
                    <template v-if="item.basicProgramInfo">
                      <el-card  class="mt20" shadow="hover">
                        <el-row>
                          <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programName||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">金额(￥)</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programPriceCny||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programType||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">行业导师一对一课时数</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.mentorHour == -1 ? '不限' : item.basicProgramInfo.mentorHour) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">Strategist Sessions（旧）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.vipHour == -1 ? '不限' : item.basicProgramInfo.vipHour) ||'无'}}</el-col>

                          <el-col :span="5" class="mentee-detail-name">1对多Office Hour</el-col>
                          <el-col
                            :span="1"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.officeHourStrategistSession == -1 ? '不限' : item.basicProgramInfo.officeHourStrategistSession) ||'0'}} 次/月</el-col>

                          <el-col :span="3" class="mentee-detail-name">系列课课时：</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.seriesHour == -1 ? '不限' : item.basicProgramInfo.seriesHour) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">Jerry一对一：</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.jerryHour == -1 ? '不限' : item.basicProgramInfo.jerryHour) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Tequila Shot（旧）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.tequilaShotHour == -1 ? '不限' : item.basicProgramInfo.tequilaShotHour) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Office Hour（旧）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.officeHour == -1 ? '不限' : item.basicProgramInfo.officeHour) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">Live Lessons（新）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.liveLesson == -1 ? '不限' : item.basicProgramInfo.liveLesson) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">全职导师文书修改次数</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.applicationLetterModify == -1 ? '不限' : item.basicProgramInfo.applicationLetterModify) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">行业导师文书修改次数</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.mentorLetterModify == -1 ? '不限' : item.basicProgramInfo.mentorLetterModify) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">购买额外课时</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.hasContinual||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">电子书架</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.hasEbookStore||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">领衔导师</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.seniorStrategist||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">应急导师</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.emergencyMentor||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">证书主题直播课权限</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{item.basicProgramInfo.certificateSubjectLiveCourseAuthority||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">专项、面试导师</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.interviewMentor||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">优先内推</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.priority||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">导师数量</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.mentorCount == -1 ? '不限' : item.basicProgramInfo.mentorCount) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">线下小班课</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.seminars == -1 ? '不限' : item.basicProgramInfo.seminars) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programPeriod||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.strategistName||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.servicesName||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.endStatus||'无'}}</el-col>
                        </el-row>
                      </el-card>
                    </template>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item :key="i" v-else-if="item.programType == 'extension'" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（延长合同）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">金额(￥)</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPriceCny||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name" v-if="item.mentorHour">行业导师一对一课时数</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                        v-if="item.mentorHour"
                      >{{(item.mentorHour == -1 ? '不限' : item.mentorHour) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.vipHour" class="mentee-detail-name">Strategist Sessions（旧）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.vipHour"
                        class="mentee-detail-value"
                      >{{(item.vipHour == -1 ? '不限' : item.vipHour) ||'无'}}</el-col>

                      <el-col :span="5" v-if="item.officeHourStrategistSession" class="mentee-detail-name">1对多Office Hour</el-col>
                      <el-col
                        :span="1"
                        v-if="item.officeHourStrategistSession"
                        class="mentee-detail-value"
                      >{{(item.officeHourStrategistSession == -1 ? '不限' : item.officeHourStrategistSession) ||'0'}} 次/月</el-col>

                      <el-col :span="3" v-if="item.seriesHour" class="mentee-detail-name">系列课课时数</el-col>
                      <el-col
                        :span="3"
                        v-if="item.seriesHour"
                        class="mentee-detail-value"
                      >{{(item.seriesHour == -1 ? '不限' : item.seriesHour) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.jerryHour" class="mentee-detail-name">Jerry一对一：</el-col>
                      <el-col
                        :span="3"
                        v-if="item.jerryHour"
                        class="mentee-detail-value"
                      >{{(item.jerryHour == -1 ? '不限' : item.jerryHour) ||'无'}}</el-col>
                      <el-col :span="3" v-if="item.tequilaShotHour" class="mentee-detail-name">Tequila Shot（旧）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.tequilaShotHour"
                        class="mentee-detail-value"
                      >{{(item.tequilaShotHour == -1 ? '不限' : item.tequilaShotHour) ||'无'}}</el-col>
                      <el-col v-if="item.officeHour" :span="3" class="mentee-detail-name">Office Hour（旧）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.officeHour"
                        class="mentee-detail-value"
                      >{{(item.officeHour == -1 ? '不限' : item.officeHour) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.liveLesson" class="mentee-detail-name">Live Lessons（新）</el-col>
                      <el-col
                        :span="3"
                        v-if="item.liveLesson"
                        class="mentee-detail-value"
                      >{{(item.liveLesson == -1 ? '不限' : item.liveLesson) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.applicationLetterModify" class="mentee-detail-name">全职导师文书修改次数</el-col>
                      <el-col
                        :span="3"
                        v-if="item.applicationLetterModify"
                        class="mentee-detail-value"
                      >{{(item.applicationLetterModify == -1 ? '不限' : item.applicationLetterModify) ||'无'}}</el-col>
                      <el-col :span="3" v-if="item.mentorLetterModify" class="mentee-detail-name">行业导师文书修改次数</el-col>
                      <el-col
                        :span="3"
                        v-if="item.mentorLetterModify"
                        class="mentee-detail-value"
                      >{{(item.mentorLetterModify == -1 ? '不限' : item.mentorLetterModify) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.hasContinual" class="mentee-detail-name">购买额外课时</el-col>
                      <el-col :span="3" v-if="item.hasContinual" class="mentee-detail-value">{{item.hasContinual||'无'}}</el-col>
                      <el-col :span="3" v-if="item.hasEbookStore" class="mentee-detail-name">电子书架</el-col>
                      <el-col :span="3" v-if="item.hasEbookStore" class="mentee-detail-value">{{item.hasEbookStore||'无'}}</el-col>
                      <el-col :span="3" v-if="item.seniorStrategist" class="mentee-detail-name">领衔导师</el-col>
                      <el-col :span="3" v-if="item.seniorStrategist" class="mentee-detail-value">{{item.seniorStrategist||'无'}}</el-col>
                      <el-col :span="3" v-if="item.emergencyMentor" class="mentee-detail-name">应急导师</el-col>
                      <el-col :span="3" v-if="item.emergencyMentor" class="mentee-detail-value">{{item.emergencyMentor||'无'}}</el-col>
                      <el-col :span="3" v-if="item.certificateSubjectLiveCourseAuthority" class="mentee-detail-name">证书主题直播课权限</el-col>
                      <el-col
                        :span="3"
                        v-if="item.certificateSubjectLiveCourseAuthority"
                        class="mentee-detail-value"
                      >{{item.certificateSubjectLiveCourseAuthority||'无'}}</el-col>
                      <el-col :span="3" v-if="item.interviewMentor" class="mentee-detail-name">专项、面试导师</el-col>
                      <el-col :span="3" v-if="item.interviewMentor" class="mentee-detail-value">{{item.interviewMentor||'无'}}</el-col>
                      <el-col :span="3" v-if="item.priority" class="mentee-detail-name">优先内推</el-col>
                      <el-col :span="3" v-if="item.priority" class="mentee-detail-value">{{item.priority||'无'}}</el-col>
                      <el-col :span="3" v-if="item.mentorCount" class="mentee-detail-name">导师数量</el-col>
                      <el-col
                        :span="3"
                        v-if="item.mentorCount"
                        class="mentee-detail-value"
                      >{{(item.mentorCount == -1 ? '不限' : item.mentorCount) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.seminars" class="mentee-detail-name">线下小班课</el-col>
                      <el-col
                        :span="3"
                        v-if="item.seminars"
                        class="mentee-detail-value"
                      >{{(item.seminars == -1 ? '不限' : item.seminars) ||'无'}}</el-col>

                      <el-col :span="3" v-if="item.programPeriod" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" v-if="item.programPeriod" class="mentee-detail-value">{{item.programPeriod||'无'}}</el-col>
                      <el-col :span="3" v-if="item.strategistName" class="mentee-detail-name">Strategist</el-col>
                      <el-col :span="3" v-if="item.strategistName" class="mentee-detail-value">{{item.strategistName||'无'}}</el-col>
                      <el-col :span="3" v-if="item.servicesName" class="mentee-detail-name">Program Manager</el-col>
                      <el-col :span="3" v-if="item.servicesName" class="mentee-detail-value">{{item.servicesName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                    </el-row>
                    <template v-if="item.basicProgramInfo">
                      <el-card  class="mt20" shadow="hover">
                        <el-row>
                          <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programName||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">金额(￥)</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programPriceCny||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programType||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">行业导师一对一课时数</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.mentorHour == -1 ? '不限' : item.basicProgramInfo.mentorHour) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">Strategist Sessions（旧）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.vipHour == -1 ? '不限' : item.basicProgramInfo.vipHour) ||'无'}}</el-col>

                          <el-col :span="5" class="mentee-detail-name">1对多Office Hour</el-col>
                          <el-col
                            :span="1"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.officeHourStrategistSession == -1 ? '不限' : item.basicProgramInfo.officeHourStrategistSession) ||'0'}} 次/月</el-col>

                          <el-col :span="3" class="mentee-detail-name">系列课课时：</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.seriesHour == -1 ? '不限' : item.basicProgramInfo.seriesHour) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">Jerry一对一：</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.jerryHour == -1 ? '不限' : item.basicProgramInfo.jerryHour) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Tequila Shot（旧）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.tequilaShotHour == -1 ? '不限' : item.basicProgramInfo.tequilaShotHour) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Office Hour（旧）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.officeHour == -1 ? '不限' : item.basicProgramInfo.officeHour) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">Live Lessons（新）</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.liveLesson == -1 ? '不限' : item.basicProgramInfo.liveLesson) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">全职导师文书修改次数</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.applicationLetterModify == -1 ? '不限' : item.basicProgramInfo.applicationLetterModify) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">行业导师文书修改次数</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.mentorLetterModify == -1 ? '不限' : item.basicProgramInfo.mentorLetterModify) ||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">购买额外课时</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.hasContinual||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">电子书架</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.hasEbookStore||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">领衔导师</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.seniorStrategist||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">应急导师</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.emergencyMentor||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">证书主题直播课权限</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{item.basicProgramInfo.certificateSubjectLiveCourseAuthority||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">专项、面试导师</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.interviewMentor||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">优先内推</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.priority||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">导师数量</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.mentorCount == -1 ? '不限' : item.basicProgramInfo.mentorCount) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">线下小班课</el-col>
                          <el-col
                            :span="3"
                            class="mentee-detail-value"
                          >{{(item.basicProgramInfo.seminars == -1 ? '不限' : item.basicProgramInfo.seminars) ||'无'}}</el-col>

                          <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.programPeriod||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.strategistName||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.servicesName||'无'}}</el-col>
                          <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                          <el-col :span="3" class="mentee-detail-value">{{item.basicProgramInfo.endStatus||'无'}}</el-col>
                        </el-row>
                      </el-card>
                    </template>
                  </el-card>
                </el-collapse-item>
              <el-collapse-item v-else-if="item.programType == 'graduate_program'" :key="i" :name="i" class="mb10">
                  <template slot="title">
                    <div class="mentee-detail-title">已购项目 {{i++}}（申研项目）</div>
                  </template>
                  <el-card shadow="hover">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.orderId||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.signDate||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">合同时间</el-col>
                      <el-col
                        :span="3"
                        class="mentee-detail-value"
                      >{{item.startDate + '~' + item.endDate}}</el-col>
                      <!-- <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.contact1Name||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.contact2Name||'无'}}</el-col>-->
                      <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programType||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endStatus||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.programPeriod ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目申请年</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpApplyYear ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目申请季</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpApplySeason ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目申请国家</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpApplyCountry ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">背景提升数量</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpBackgroundPromotionQuantity ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">背景提升人民币价格</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpBackgroundPromotionPriceCny ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">背景提升美金价格</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpBackgroundPromotionPriceUsd ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">专业大类数量</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpMajorQuantity ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">项目申请数量</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.gpProgramApplyQuantity ||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">开始时间</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.startDate||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">结束时间</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{item.endDate||'无'}}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
              </template>
              <el-collapse-item name="22" class="mb10">
                <template slot="title">
                  <div class="mentee-detail-title">礼品信息</div>
                  <el-button
                    v-if="roleInfo.includes('modify_gift') && !modifyGiftVisible"
                    type="primary"
                    size="mini"
                    plain
                    circle
                    @click.stop="modity"
                  >礼品修改</el-button>
                  <el-button
                    v-if="roleInfo.includes('modify_gift') && modifyGiftVisible"
                    type="primary"
                    size="mini"
                    plain
                    circle
                    @click.stop="submitModity"
                  >提交修改</el-button>
                  <p class="ml20" v-if="giftArr.length">{{{1:'已发送',0:'未发送'}[this.gift.isSend]}}</p>
                </template>
                <el-card shadow="hover" v-if="!modifyGiftVisible">
                  <el-card shadow="none" class="mb20" v-if="giftArr.length">
                    <el-row>
                      <el-col :span="3" class="mentee-detail-name">收货人名</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{gift.recipientName||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">收货人电话</el-col>
                      <el-col :span="3" class="mentee-detail-value">{{gift.recipientPhone||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">收货人地址</el-col>
                      <el-col
                        :span="9"
                        class="mentee-detail-value"
                        :title="gift.recipientAddr"
                      >{{gift.recipientAddr||'无'}}</el-col>
                      <el-col :span="3" class="mentee-detail-name">备注</el-col>
                      <el-col
                        :span="9"
                        class="mentee-detail-value"
                        :title="gift.remark"
                      >{{gift.remark||'无'}}</el-col>
                    </el-row>
                  </el-card>
                  <el-row v-for="(gift1,j) in giftArr" :key="j">
                    <el-col :span="2" class="mentee-detail-name">礼品名{{++j}}</el-col>
                    <el-col :span="6" class="mentee-detail-value">
                      <span :title="gift1.giftName">{{gift1.giftName||'无'}}</span>
                    </el-col>
                    <el-col :span="2" class="mentee-detail-name">礼品数量</el-col>
                    <el-col :span="1" class="mentee-detail-value">{{gift1.giftNum||'无'}}</el-col>
                  </el-row>
                </el-card>
                <el-card shadow="hover" v-else>
                  <el-form
                    :inline="true"
                    size="mini"
                    :model="gift"
                    ref="signingForm4"
                    label-width="120px"
                  >
                    <el-card v-if="gift" class="mb20">
                      <el-form-item label="收货人名" prop>
                        <el-input :style="{width: '230px'}" v-model="gift.recipientName"></el-input>
                      </el-form-item>
                      <el-form-item label="收货人电话" prop>
                        <el-input :style="{width: '220px'}" v-model="gift.recipientPhone"></el-input>
                      </el-form-item>
                      <el-form-item label="收货人地址" prop>
                        <el-input :style="{width: '580px'}" v-model="gift.recipientAddr"></el-input>
                      </el-form-item>
                      <el-form-item label="备注" prop>
                        <el-input :style="{width: '580px'}" v-model="gift.remark"></el-input>
                      </el-form-item>
                    </el-card>
                    <el-button @click="addGift" size="mini" plain>添加</el-button>
                    <template v-for="(gift1,i) in giftArr">
                      <el-form-item label="礼物" prop :key="i" v-if="giftArr[i].giftNum">
                        <el-select v-model="giftArr[i].giftId" filterable placeholder="请选择">
                          <el-option
                            v-for="item in giftList"
                            :key="item.giftId"
                            :label="item.giftName +' (库存:' + item.inventory + ')'"
                            :disabled="!item.inventory"
                            :value="item.giftId"
                          ></el-option>
                        </el-select>
                        <el-input-number :min="1" :style="{width:'100px'}" v-model="giftArr[i].giftNum"></el-input-number>
                        <el-button
                          type="warning"
                          plain
                          round
                          @click="deleteGift(i)"
                          class="el-icon-delete"
                        ></el-button>
                      </el-form-item>
                    </template>
                  </el-form>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          <overview
            :overviewVisible="overviewVisible"
            :signId="signId"
            @close="overviewClose"
            @submit="overviewSubmit"
          ></overview>
          <set-internship
            :setInternshipVisible="setInternshipVisible"
            :internshipData="internshipData"
            @close="setInternshipClose"
            @submit="setInternshipSubmit"
          ></set-internship>
          <refund
            :refundVisible="refundVisible"
            :orderId="orderId"
            :menteeName="menteeInfo.realName"
            :wxID="menteeInfo.wxId  "
            @close="refundClose"
            @submit="refundSubmit"
          ></refund>
          <updateSignData
            :updateSignDataVisible="updateSignDataVisible"
            :signId="signId"
            :signData="signData"
            @close="updateSignDataClose"
            @submit="updateSignDataSubmit"
          ></updateSignData>

          <signUrlSupplementary
            :urlSupplementaryVisible="urlSupplementaryVisible"
            :orderId="orderId"
            :contractURL="contractURL"
            :contractPDFList="contractPDFList"
            @close="signURLClose"
          />
          <transtionUpdate
            :orderId="orderId"
            :order="true"
            :transitionVisible="transitionVisible"
            @submit="submitTransition"
            @close="closeTransition"
          />
        </div>
      </div>
  </d2-container>
</template>

<script>
import api from '@/api/sales_assistant.js'
import apiDic from '@/api/dictionary'
import overview from './Overview'
import setInternship from '@/views/vip/mentee_components/set_internship.vue'
import refund from '@/views/vip/mentee/components/refund.vue'
import updateSignData from './UpdateOrder'
import signUrlSupplementary from '../../sign/sign_URL_supplementary'
import { downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'
import transtionUpdate from '@/views/vip/mentee_components/transition.vue'
import { mapState } from 'vuex'
export default {
  name:"Order",
  components: {
    overview,
    setInternship,
    refund,
    updateSignData,
    signUrlSupplementary,
    transtionUpdate
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mixins: [mixins],
  data: () => {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3-9][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      orderId:'',
      loading: false,
      transitionVisible: false,
      activeNames: [],
      signId: '',
      contractURL: '',
      contractURL2: '',
      contractPDFList: {},
      signData: {},
      projectList: [],
      gift: { giftArr: [] },
      giftArr: [],
      overviewVisible: false,
      urlSupplementaryVisible: false,
      setTargetVisible: false,
      targetList: { track: [], location: [], finishYear: '' },

      setVipVisible: false,
      vipList: { strategist: '', service: '' },

      setOfferVisible: false,

      setInterviewVisible: false,
      updateSignDataVisible: false,
      setCourseVisible: false,

      mentorVisible: false,
      mentorHours: 0,
      vipHours: 0,

      setMenteeVisible: false,
      menteeData: {},

      setInternshipVisible: false,
      internshipData: {},

      refundVisible: false,

      signUrl: '',
      copy2: '学生线上签约',
      giftList: [],
      modifyGiftVisible: false,
      menteeInfo: {},
      orderInfo: {},
      transition: {},
      deleteGiftList: [],

      // invoice: {},
      invoiceVisible: false,
      invoice_type: [],
      rules: {
        invoiceType: [{ required: true, message: '必填', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '必填', trigger: 'blur' }],
        invoiceAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        invoiceAddr: [{ required: true, message: '必填', trigger: 'blur' }],
        invoicePhone: [{ required: true, message: '必填', trigger: 'blur' }],
        invoiceBank: [{ required: true, message: '必填', trigger: 'blur' }],
        invoiceBankAccount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        invoiceStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        recipientName: [{ required: true, message: '必填', trigger: 'blur' }],
        recipientPhone: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: checkPhone,
            message: '手机号格式',
            trigger: 'blur'
          }
        ],
        recipientAddr: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.Topage()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      if (!this.invoice_type.length) {
        this.invoice_type = await this.getDictionary('invoice_type')
      }
    },
    Topage () {
      this.orderId = this.$route.query.orderId
      this.loading = true
      api
        .getOrderDetailByOrderId(this.orderId)
        .then(res => {
          console.log('学员购买详情yx*****销售订单', res.data)
          // console.log("学员购买详情yx**********", res.data.transition);

          // let sc = this.school.filter(
          //   v => v.schoolId == res.data.menteeInfo.school
          // )[0];
          // res.data.menteeInfo.schoolName = sc ? sc.schoolName :res.data.menteeInfo.school ;
          // this.menteeInfo = res.data.menteeInfo;
          this.activeNames = ['11', '12', '13', '22', '23', 0, 1, 2, 3, 4, 5, 6, 7]

          this.projectList = res.data.programInfo
          if (res.data.gift) {
            this.giftArr = res.data.gift.giftArr
            this.gift = res.data.gift
          } else {
            this.giftArr = []
            // this.gift = {}
          }
          // if (res.data.invoice) {
          //   this.invoice = res.data.invoice;
          // } else {
          //   this.invoice = {};
          // }
          this.menteeInfo = res.data.menteeInfo
          this.orderInfo = res.data.orderInfo
          this.transition = res.data.transition || {}
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '订单ID有误'
          })
          this.loading = false
          this.close()
        })
      // 礼物列表
      apiDic.getGiftList('0').then(({ data }) => {
        console.log('礼物列表', data)
        this.giftList = data
      })
    },
    // accountEntry(orderId){
    //   api.getOnlineAddress(orderId).then(res => {
    //       console.log(res)
    //       this.$alert(`学员在线签约地址为【${res.data.paymentUrl}】,登录所需Code为【${res.data.code}】`, `【${res.data.orderId}】的在线支付信息`, {
    //           confirmButtonText: '确定',
    //         });
    //   })
    // },
    close () {
      this.$emit('close')
      this.activeNames = []
      this.projectList = []
      this.gift = { giftArr: [] }
      this.invoiceVisible = false
      // this.invoice = {};
      this.giftArr = []
      this.copy2 = '学生线上签约'
    },
    menteeDatail (v) {
      console.log('menteeDatail')
      this.menteeData = {
        menteeId: v.menteeId,
        school: v.school,
        email: v.email,
        finishYear: v.finishYear
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
    setInternship (v) {
      console.log('internship', v)
      this.internshipData = {
        signId: v.signId,
        internshipStatus: v.internshipStatus,
        internship: v.internship,
        internshipLocation: v.internshipLocation,
        internshipDate: [v.internshipStartDate, v.internshipEndDate],
        internshipMonth: v.internshipMonth,
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
    setTarget (signId, track, location) {
      console.log('setTarget', signId, track, location)
      this.signId = signId
      this.targetList = {
        track: track ? track.split(',') : [],
        location: location ? location.split(',') : []
        // finishYear: ""
      }
      this.setTargetVisible = true
    },
    setTargetClose () {
      this.setTargetVisible = false
      this.targetList = {
        track: [],
        location: [],
        finishYear: ''
      }
    },

    setTargetSubmit () {
      this.setTargetClose()
      this.Topage()
    },
    setVip (signId, strategist, service) {
      console.log(setVip, strategist, service)
      this.signId = signId
      this.vipList = {
        strategist: strategist,
        service: service
      }
      this.setVipVisible = true
    },
    setVipClose () {
      this.setVipVisible = false
      this.vipList = {
        strategist: '',
        service: ''
      }
    },
    setVipSubmit () {
      this.setVipClose()
      this.Topage()
    },
    setOffer (signId) {
      console.log('setOffer')
      this.signId = signId
      this.setOfferVisible = true
    },
    setOfferClose () {
      this.setOfferVisible = false
    },
    refund (orderId) {
      console.log('refund', orderId)
      this.orderId = orderId
      this.refundVisible = true
    },
    refundClose () {
      console.log('refundClose')
      this.refundVisible = false
    },
    refundSubmit () {
      this.refundClose()
      this.Topage()
    },
    setInterview (signId) {
      console.log('Interview')
      this.signId = signId
      this.setInterviewVisible = true
    },
    setInterviewClose () {
      this.setInterviewVisible = false
    },
    setCourse (signId, vipHours, mentorHours) {
      console.log('setCourse')
      this.signId = signId
      this.mentorHours = mentorHours
      this.vipHours = vipHours
      this.setCourseVisible = true
    },
    setCourseClose () {
      this.setCourseVisible = false
    },
    setMentor (signId, vipHours, mentorHours) {
      console.log('setMentor', mentorHours)
      this.mentorVisible = true
      this.signId = signId
      this.mentorHours = mentorHours
      this.vipHours = vipHours
    },
    setMentorClose () {
      this.mentorVisible = false
    },
    seeContracts (names, paths) {
      console.log(names, paths)
    },
    download (val) {
      downloadFun(val)
    },
    // 转线下合同
    offLine (signId) {
      this.$confirm(`确认将${signId}转为下线？`)
        .then(_ => {
          api.onLineToOffLine(signId).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '合同已转为线下签约'
            })
            // this.Topage(this.pageNum);
            this.$emit('submit')
          })
        })
        .catch(_ => {})
    },
    // 获取线上签约路径
    getSignUrlByOrderId () {
      api
        .getSignUrlByOrderId(this.orderId)
        .then(res => {
          console.log(res.data)
          this.contractURL = res.data.pageUrl
          this.contractPDFList = res.data
          this.urlSupplementaryVisible = true
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          console.log('线上签约路径', err)
          this.loading = false
        })
    },
    signURLClose () {
      this.urlSupplementaryVisible = false
    },
    // 加礼物
    addGift () {
      this.giftArr.push({ giftId: null, giftNum: 1 })
    },
    // 删礼物
    deleteGift (i) {
      console.log(i, this.deleteGiftList)
      this.deleteGiftList.push(this.giftArr[i])
      // this.giftArr.splice(i, 1);
      this.giftArr[i].giftNum = 0
    },
    modity () {
      console.log(this.gift)
      if (this.gift.isSend == '1') {
        this.$message({
          type: 'warning',
          message: '礼品已发送，不可编辑'
        })
        return
      }
      this.modifyGiftVisible = true
    },
    submitModity () {
      console.log(this.gift, this.giftArr)
      const data = {
        gift: {
          recipientName: this.gift.recipientName || '',
          recipientPhone: this.gift.recipientPhone || '',
          recipientAddr: this.gift.recipientAddr || '',
          remark: this.gift.remark || '',
          giftArr: []
        }
      }
      let pass = true
      this.giftArr.forEach(v => {
        if (!v.giftNum) {
          if (v.pkId) {
            data.gift.giftArr.push({
              pkId: v.pkId,
              delFlag: 1
            })
          }
        } else {
          if (!v.giftId) {
            this.$message({
              type: 'warning',
              message: '请选定具体礼物'
            })
            pass = false
          }
          data.gift.giftArr.push(v)
        }
      })
      if (!pass) {
        return
      }
      if (data.gift.giftArr.every(v => v.delFlag)) {
        data.gift.delFlag = 1
      }
      console.log('礼品更新参数', data)
      this.loading = true
      api
        .uptGift(this.orderId, data)
        .then(res => {
          console.log('礼品更新', res)
          this.$message({
            type: 'success',
            message: '礼品更新成功'
          })
          this.modifyGiftVisible = false
          this.loading = false
          this.Topage()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          this.loading = false
        })
    },
    // 更新签约
    updateSignData (signId, data) {
      this.signId = signId
      this.signData = data
      this.updateSignDataVisible = true
    },
    updateSignDataClose () {
      this.updateSignDataVisible = false
    },
    updateSignDataSubmit () {
      this.Topage()
      this.updateSignDataVisible = false
    },
    getPayLine (orderId) {
      api.getPayUrl(orderId).then(res => {
        console.log(res)
        this.contractURL2 = res.data
        this.$copyText(this.contractURL2)
        this.$confirm(`此线上支付地址为 【${this.contractURL2}】`, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {

        })
      })
    },
    updateTransition (item) {
      if (item == '2') {
        console.log(this.orderInfo, this.menteeInfo)
        this.transitionVisible = true
      } else {
        this.$message.error('请在入账前更新！！')
      }
    },
    closeTransition () {
      this.transitionVisible = false
    },
    submitTransition () {
      this.Topage()
      this.transitionVisible = false
    }
    // setInvoice() {
    //   this.invoiceVisible = true;
    // },
    // submitInvoice() {
    //   console.log(this.invoice);
    //   this.$refs.invoice.validate(v => {
    //     if (!v) return;
    //     // if (this.invoice.invoiceStatus == "1" && !this.invoice.invoiceBy) {
    //     //   this.invoice.invoiceBy = this.userInfo.userId;
    //     //   this.invoice.invoiceTime = new Date();
    //     // }
    //     if (this.invoice.invoiceId) {
    //       api.uptInvoice(this.invoice).then(() => {
    //         this.$message({
    //           type: "success",
    //           message: "发票更新成功"
    //         });
    //         this.invoiceVisible = false;
    //         this.Topage();
    //         this.$emit("submit");
    //       });
    //     } else {
    //       this.invoice.orderId = this.orderId;
    //       api.addInvoice(this.invoice).then(() => {
    //         this.$message({
    //           type: "success",
    //           message: "添加发票成功"
    //         });
    //         this.invoiceVisible = false;
    //         this.Topage();
    //         this.$emit("submit");
    //       });
    //     }
    //   });
    // }
  }
}
</script>

<style lang="scss">
.mentee-detail-title {
  width: 180px;
  margin-left: 20px;
}
.mentee-detail-name {
  color: #000;
  font-weight: 600;
  padding-left: 20px;
}
.mentee-detail-name{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mentee-detail-value {
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-collapse-item__header {
  background-color: #eee;
}
</style>
