<template>
  <div class="order-detail">
    <el-dialog :close-on-click-modal="false"
      :visible.sync="orderDetailVisible"
      :before-close="handleClose"
      :title="'订单详情'"
      width="1500px"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item v-if=" orderData.orderInfo" name="1">
          <template slot="title">
            <div class="mentee-detail-title">订单信息</div>
          </template>
          <el-card shadow="hover">
            <el-row>
              <el-col :span="3" class="_item-name">订单ID</el-col>
              <el-col
                :span="3"
                class="_item-value"
                :title="orderData.orderInfo.orderId"
              >{{orderData.orderInfo.orderId||'无'}}</el-col>
              <!-- <el-col :span="3" class="_item-name">学员ID</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.menteeId||'无'}}</el-col>-->
              <el-col :span="3" class="_item-name">学员姓名</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.realName||'无'}}</el-col>
              <el-col :span="3" class="_item-name">学校</el-col>
              <el-col
                :span="3"
                class="_item-value"
                :title="orderData.orderInfo.schoolStr"
              >{{orderData.orderInfo.schoolStr||'无'}}</el-col>
              <el-col :span="3" class="_item-name">邮箱</el-col>
              <el-col :span="3" class="_item-value">{{orderData.menteeInfo.email||'无'}}</el-col>
              <el-col :span="3" class="_item-name">联系方式</el-col>
              <el-col :span="3" class="_item-value">{{orderData.menteeInfo.telephone||'无'}}</el-col>
              <el-col :span="3" class="_item-name">订单金额</el-col>
              <el-col :span="3" class="_item-value colorR">{{orderData.orderInfo.orderPrice||'无'}}</el-col>
              <el-col :span="3" class="_item-name">签约日期</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.signDate||'无'}}</el-col>
              <el-col :span="3" class="_item-name">合同有效期</el-col>
              <el-col
                :span="3"
                class="_item-value"
              >{{orderData.orderInfo.startDate + ' ~ ' + orderData.orderInfo.endDate}}</el-col>
              <el-col :span="3" class="_item-name">订单状态</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.signStatusStr||'无'}}</el-col>
              <el-col :span="3" class="_item-name">签约方式</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.signWayStr||'无'}}</el-col>
              <el-col :span="3" class="_item-name">订单类型</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.orderTypeStr||'无'}}</el-col>

              <el-col :span="3" class="_item-name">是否VIP同事推荐</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.vipRecommendStatusName||'无'}}</el-col>
              <el-col :span="3" class="_item-name" v-if="orderData.orderInfo.vipRecommendStatus == 1">VIP同事推荐人</el-col>
              <el-col :span="3" class="_item-value" v-if="orderData.orderInfo.vipRecommendStatus == 1">{{orderData.orderInfo.vipRecommenderName||'无'}}</el-col>

              <el-col :span="3" class="_item-name">支付状态</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.payStatusStr||'无'}}</el-col>
              <el-col :span="3" class="_item-name">已确认的入账</el-col>
              <el-col
                :span="3"
                class="_item-value colorR"
              >{{orderData.orderInfo.receivedAmount||'无'}}</el-col>
              <el-col :span="3" class="_item-name">主联系人</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.contact1Str||'无'}}</el-col>
              <el-col :span="3" class="_item-name">副联系人</el-col>
              <el-col :span="3" class="_item-value">{{orderData.orderInfo.contact2Str||'无'}}</el-col>
              <br>
              <el-col :span="3" class="_item-name">合同</el-col>
              <el-col :span="15" class="_item-value">
                <p v-if="!orderData.contractInfo.length">无</p>
                <el-button
                  v-else
                  v-for="(v,j) in orderData.contractInfo"
                  :key="j"
                  type="primary"
                  size="mini"
                  plain
                  @click="download(v.contractPath)"
                >{{v.contractName}}</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>
        <el-collapse-item v-if=" orderData.transition" name="13" class="mb10">
          <template slot="title">
            <div class="mentee-detail-title">Transition</div>
          </template>
          <el-card shadow="hover">
            <el-row>
              <el-col :span="3" class="mentee-detail-name">父母职业</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.parentJob||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.parentJob||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">性格类型</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.parentPersonality||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.parentPersonality||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">父母对小孩的期望</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.parentExpectation||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.parentExpectation||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">对小孩人生的介入程度</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.parentControl||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.parentControl||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">购买力</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.parentPurchasingPower||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.parentPurchasingPower||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">对行业的了解程度</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.menteeIndustryLevel||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.menteeIndustryLevel||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">学生心理状态</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.menteeMentality||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.menteeMentality||'无'}}</span>
                </el-popover>
              </el-col>
              <el-col :span="3" class="mentee-detail-name">需要后期综合注意的点</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-popover
                  width="400"
                  trigger="hover"
                  placement="top-start"
                  :content="orderData.transition.notice||'无'"
                >
                  <span
                    size="mini"
                    type="text"
                    class="w80"
                    slot="reference"
                  >{{orderData.transition.notice||'无'}}</span>
                </el-popover>
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>
        <el-collapse-item v-else :title="'数据加载中...'"></el-collapse-item>
        <template v-for="(item,i) in orderData.programInfo">
          <el-collapse-item :key="i" v-if="item.programType == 'basic'" :name="i">
            <template slot="title">
              <div class="mentee-detail-title">已购项目 {{i++}}（基础项目）</div>
              <!-- <el-button
                v-if="roleInfo.includes(`mentee_base_program_update`)"
                type="primary"
                size="mini"
                plain
                circle
                @click.stop="updateSignData(item.signId,item)"
              >更新签约</el-button> -->
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

                <el-col :span="5" class="mentee-detail-name">1对多Office Hour</el-col>
                <el-col
                  :span="1"
                  class="mentee-detail-value"
                >{{(item.officeHourStrategistSession == -1 ? '不限' : item.officeHourStrategistSession) ||'0'}} 次/月</el-col>

                <el-col :span="3" class="mentee-detail-name">系列课课时数</el-col>
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
          <el-collapse-item :key="i" v-else-if="item.programType == 'internship'" :name="i">
            <template slot="title">
              <div class="mentee-detail-title">已购项目 {{i++}}（实习项目）</div>
            </template>
            <el-card shadow="hover">
              <el-row>
                <el-col :span="3" class="_item-name">订单ID</el-col>
                <el-col :span="3" class="_item-value">{{item.orderId||'无'}}</el-col>
                <el-col :span="3" class="_item-name">签约日期</el-col>
                <el-col :span="3" class="_item-value">{{item.signDate||'无'}}</el-col>
                <el-col :span="3" class="_item-name">合同时间</el-col>
                <el-col :span="3" class="_item-value">{{item.startDate + '~' + item.endDate}}</el-col>
                <el-col :span="3" class="_item-name">项目名</el-col>
                <el-col :span="3" class="_item-value">{{item.programName||'无'}}</el-col>
                <el-col :span="3" class="_item-name">金额($)</el-col>
                <el-col :span="3" class="_item-value">{{item.programPriceCny||'无'}}</el-col>
                <el-col :span="3" class="_item-name">项目类型</el-col>
                <el-col :span="3" class="_item-value">{{item.programType||'无'}}</el-col>
                <!-- <el-col :span="3" class="_item-name">项目状态</el-col>
                <el-col :span="3" class="_item-value">{{item.programStatus||'无'}}</el-col>-->
                <el-col :span="3" class="_item-name">实习单位</el-col>
                <el-col :span="3" class="_item-value">{{item.internshipDesc||'无'}}</el-col>
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
                <el-col :span="3" class="mentee-detail-name">课时数</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.oralLessonHour||'无'}}</el-col>
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
                <!-- <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.contact1Name||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.contact2Name||'无'}}</el-col> -->
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
              </el-row>
            </el-card>
          </el-collapse-item>
        </template>

        <el-collapse-item v-if=" orderData.billInfo.length" name="51">
          <template slot="title">
            <div class="mentee-detail-title">入账列表</div>
          </template>
          <el-card shadow="hover">
            <el-table
              :data="orderData.billInfo"
              size="mini"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column prop="revenueDate" align="center" label="入账时间" min-width="100"></el-table-column>
              <el-table-column prop="currencyType" align="center" label="收款金额类型" min-width="100"></el-table-column>
              <el-table-column prop="revenue" align="center" label="收款金额" min-width="100"></el-table-column>
              <el-table-column prop="exchangeRate" align="center" label="入账实时汇率" min-width="100"></el-table-column>
              <el-table-column prop="totalInCny" align="center" label="等值人民币 " min-width="100"></el-table-column>
              <el-table-column prop="account" align="center" label="收款账户" min-width="120"></el-table-column>
              <el-table-column prop="transfer" align="center" label="付款人姓名" min-width="100"></el-table-column>
              <el-table-column prop="remark" align="center" label="入账说明" min-width="100"></el-table-column>
              <el-table-column prop="actualAmount" align="center" label="财务审核金额" min-width="100"></el-table-column>
              <el-table-column prop="confirmStatus" align="center" label="审核状态" min-width="100"></el-table-column>
              <!-- <el-table-column prop="confirmor1" align="center" label="审核人" min-width="100"></el-table-column>
              <el-table-column prop="confirmTime1" align="center" label="审核时间" min-width="150"></el-table-column>
              <el-table-column prop="confirmor2" align="center" label="财务审核人" min-width="100"></el-table-column>
              <el-table-column prop="confirmTime2" align="center" label="财务审核时间" min-width="150"></el-table-column>-->
            </el-table>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <!-- <updateSignData
      :updateSignDataVisible="updateSignDataVisible"
      :signId="signId"
      :signData="signData"
      @close="updateSignDataClose"
      @submit="updateSignDataSubmit"
    ></updateSignData> -->
  </div>
</template>

<script>
import { downloadFun } from "@/libs/file";
import api from "@/api/sales_month_new.js";
import { mapState } from 'vuex';

export default {
  name: "orderDetail",
  props: {
    orderDetailVisible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components:{
    // updateSignData
  },
  data() {
    return {
      orderData: {
        programInfo: [],
        billInfo: [],
        orderInfo:{

        },
        menteeInfo: [],
        contractInfo: []
      },
      activeNames: [],
      signId:'',
      signData:{},
      updateSignDataVisible: false
    };
  },
  watch: {
    orderDetailVisible: function(val) {
      if (val) {
        console.log(this.orderId);
        this.Topage();
      }
    }
  },
  methods: {
    handleClose() {
      this.activeNames = [];
      (this.orderData = {
        programInfo: [],
        billInfo: [],
        menteeInfo: [],
        orderInfo: {},
        contractInfo: [],
        transition:{}
      }),
        this.$emit("close");
    },
    Topage() {
      this.$loading();
      api
        .getOrderDetailByOrderId(this.orderId)
        .then(res => {
          this.orderData = res.data;
          console.log(res.data,this.orderData.orderInfo,'yx******get');
          this.activeNames = ["51", "1", 0, 1, 2, 3, 4, 5, 6, 7,'13'];
          this.$loading().close();
        })
        .catch(err => {
          console.error(err);
        });
    },
    download(val) {
      downloadFun(val)
    },
    updateSignData(signId, data) {
      this.signId = signId;
      this.signData = data;
      this.updateSignDataVisible = true;
    },
    updateSignDataClose(){
      this.updateSignDataVisible = false;
    },
    updateSignDataSubmit(){
      this.Topage()
      this.updateSignDataVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-collapse-item__header {
  background-color: #eee;
}
.mentee-detail-name{
  overflow: hidden;
}
</style>