<!--
 * @Author: 库建华
 * @Date: 2020-03-26 15:22:35
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-18 16:15:29
 * @Version:
 * @Description:后续更改
 -->
<template>
  <div class="sign-detail">
    <el-dialog
      title="签约信息_详情" 
      class="info"
      :visible.sync="signDetailContinualVisible"
      width="1250px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :before-close="signDetailClose"
    >
      <el-switch
        style="display: block;position: absolute;top: 20px;right: 100px;"
        v-model="signOnline"
        active-color="#13ce66"
        inactive-color="#409EFF"
        active-text="线上"
        inactive-text="线下"
        @change="changeSignType"
      ></el-switch>
      <div class="create-cant-program-model">
        <div class="program-model-title">个人信息</div>
        <el-form
          :inline="true"
          size="mini"
          :model="menteeDetail"
          :rules="rulesig"
          ref="menteeDetail"
          label-width="180px"
        >
          <el-form-item label="微信ID：">
            <span :style="{width:widthSpan}" class="programName">{{menteeDetail.wxId}}</span>
          </el-form-item>
          <el-form-item label="姓名（拼音）：" prop="realName">
            <el-input :style="{width:widthInput}" v-model="menteeDetail.realName" maxlength="99"></el-input>
          </el-form-item>
          <!-- 合同上姓名 -->
          <el-form-item label="姓名（中文/法定名）：" prop="chiName">
            <el-input :style="{width:widthInput}" v-model="menteeDetail.chiName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-select
              :style="{width:widthInput}"
              v-model="menteeDetail.sex"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in sex"
                :key="item.itemName"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="School Email：" prop="email">
            <el-input :style="{width:widthInput}" v-model="menteeDetail.email" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="学校：" prop="school">
            <!-- <el-input v-model="menteeDetail.school"></el-input> -->
            <el-select
              :style="{width:widthInput}"
              v-model="menteeDetail.school"
              filterable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in schoolList"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道来源">
            <el-input
              :style="{width:widthInput}"
              v-model="menteeDetail.sourceFromName"
              :disabled="true"
            ></el-input>
            <!-- <el-select :style="{width:widthInput}" v-model="channelId" filterable placeholder="请选择渠道">
              <el-option
                v-for="item in channelList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <!-- <el-form-item label="来源" prop="sourceFrom">
            <el-select
              :style="{width:widthInput}"
              v-model="menteeDetail.sourceFrom"
              clearable
              filterable
              placeholder="先选择渠道(BD渠道下需要精确搜索)"
              :loading="loading"
              remote
              :remote-method="remote"
            >
              <el-option
                v-for="item in sourceList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="学历：" prop="degree">
            <el-select
              :style="{width:widthInput}"
              v-model="menteeDetail.degree"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in degree"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="毕业年份：" prop="finishYear">
            <el-date-picker
              :style="{width:widthInput}"
              v-model="menteeDetail.finishYear"
              :clearable="false"
              :editable="false"
              type="year"
              value-format="yyyy"
              placeholder="选择年份"
              default-value="2020"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="联系电话：" prop="telephone">
            <el-input
              :style="{width:widthInput}"
              v-model="menteeDetail.telephone"
              :controls="false"
              size="mini"
            ></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">原项目信息</div>
        <!-- <el-card shadow="hover"> -->
        <el-descriptions title="" :column="3" :contentStyle="{flex:1}" size="medium" labelClassName="program_item">
          <el-descriptions-item label="订单ID">{{basicProgram.orderId||'无'}}</el-descriptions-item>
          <el-descriptions-item label="签约日期">{{basicProgram.signDate||'无'}}</el-descriptions-item>
          <el-descriptions-item label="合同时间">{{basicProgram.startDate + '~' + basicProgram.endDate}}</el-descriptions-item>
          <el-descriptions-item label="主联系人">{{basicProgram.contact1Name||'无'}}</el-descriptions-item>
          <el-descriptions-item label="副联系人">{{basicProgram.contact2Name||'无'}}</el-descriptions-item>
          <el-descriptions-item label="项目名">{{basicProgram.programName||'无'}}</el-descriptions-item>
          <el-descriptions-item label="项目类型">{{basicProgram.programTypeName||'无'}}</el-descriptions-item>
          <el-descriptions-item label="项目周期">{{basicProgram.programPeriod||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Strategist">{{basicProgram.strategistName||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Program Manager">{{basicProgram.servicesName||'无'}}</el-descriptions-item>
          <el-descriptions-item label="项目状态">{{basicProgram.programStatus||'无'}}</el-descriptions-item>
          <el-descriptions-item label="行业导师">{{basicProgram.mentorNames||'无'}}</el-descriptions-item>
          <el-descriptions-item label="目标Track">{{basicProgram.targetTrackName||'无'}}</el-descriptions-item>
          <el-descriptions-item label="目标Location">{{basicProgram.targetLocationName||'无'}}</el-descriptions-item>
          <el-descriptions-item label="求职文书修改次数">{{(basicProgram.applicationLetterModify == -1 ? '不限' : basicProgram.applicationLetterModify) ||'0'}}</el-descriptions-item>
          <el-descriptions-item label="行业导师一对一课时数">{{(basicProgram.mentorHour == -1 ? '不限' : basicProgram.mentorHour) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Strategist Sessions（旧）">{{(basicProgram.vipHour == -1 ? '不限' : basicProgram.vipHour) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="1对多Office Hour">{{(basicProgram.officeHourStrategistSession == -1 ? '不限' : basicProgram.officeHourStrategistSession) ||'0'}} 次/月</el-descriptions-item>
          <el-descriptions-item label="系列课课时数">{{(basicProgram.seriesHour == -1 ? '不限' : basicProgram.seriesHour) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Jerry一对一：">{{(basicProgram.jerryHour == -1 ? '不限' : basicProgram.jerryHour) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Tequila Shot（旧）">{{(basicProgram.tequilaShotHour == -1 ? '不限' : basicProgram.tequilaShotHour) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Office Hour（旧）">{{(basicProgram.officeHour == -1 ? '不限' : basicProgram.officeHour) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="Live Lessons（新）">{{(basicProgram.liveLesson == -1 ? '不限' : basicProgram.liveLesson) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="购买额外课时">{{basicProgram.hasContinual||'无'}}</el-descriptions-item>
          <el-descriptions-item label="电子书架">{{basicProgram.hasEbookStore||'无'}}</el-descriptions-item>
          <el-descriptions-item label="领衔导师">{{basicProgram.seniorStrategist||'无'}}</el-descriptions-item>
          <el-descriptions-item label="应急导师">{{basicProgram.emergencyMentor||'无'}}</el-descriptions-item>
          <el-descriptions-item label="证书主题直播课权限">{{basicProgram.certificateSubjectLiveCourseAuthority||'无'}}</el-descriptions-item>
          <el-descriptions-item label="专项、面试导师">{{basicProgram.interviewMentor||'无'}}</el-descriptions-item>
          <el-descriptions-item label="优先内推">{{basicProgram.priority||'无'}}</el-descriptions-item>
          <el-descriptions-item label="导师数量">{{(basicProgram.mentorCount == -1 ? '不限' : basicProgram.mentorCount) ||'无'}}</el-descriptions-item>
          <el-descriptions-item label="线下小班课">{{(basicProgram.seminars == -1 ? '不限' : basicProgram.seminars) ||'0'}}</el-descriptions-item>
          <el-descriptions-item label="实习数">{{basicProgram.internshipNum||'无'}}</el-descriptions-item>
          <el-descriptions-item label="金额(￥)" v-if="roleInfo.includes(`mentee_program_price`)">
            {{basicProgram.programPriceCny||'无'}}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="create-cant-program-model" v-if="programId">
        <div class="program-model-title" v-if="programType == 'continual'">续课项目信息</div>
        <div class="program-model-title" v-else-if="programType == 'extension'">延长项目信息</div>
        <div class="program-model-title" v-else-if="programType == 'suspend'">暂停项目信息</div>
        <el-form
          :inline="true"
          size="mini"
          :model="baseProgram"
          :rules="rulesig"
          ref="baseProgram"
          label-width="180px"
        >
          <el-form-item label="项目名">
            <span
              :style="{width:widthSpan}"
              class="programName w80"
              :title="baseProgram.programName"
            >{{baseProgram.programName}}</span>
          </el-form-item>
          <el-form-item label="官方价格">
            <span
              :style="{width:widthSpan}"
              class="programName"
            >{{'￥' + (baseProgram.basePriceCny||'无') + '; $' + (baseProgram.basePriceUsd||'无')}}</span>
          </el-form-item>
          <el-form-item label="项目定价货币类型">
            <span
              :style="{width:widthSpan}"
              class="programName"
            >{{baseProgram.currencyType == 'usd' ? '美金($)' : '人民币(￥)'}}</span>
          </el-form-item>
          <el-form-item label="价格备注">
            <el-input
              :style="{width:widthInput}"
              v-model="baseProgram.programPriceNote"
              maxlength="99"
            ></el-input>
          </el-form-item>
          <el-form-item label="基础项目价格(￥)" prop>
            <span
              :style="{width:widthSpan}"
              class="programName"
              v-if="baseProgram.currencyType === 'usd'"
            >{{baseProgram.priceCny}}</span>
            <el-input :style="{width:widthInput}" v-model="baseProgram.priceCny" @input="basicCny()" v-else></el-input>
          </el-form-item>
          <el-form-item label="项目KPI权重">
            <span
              :style="{width:widthSpan}"
              class="programName w80"
              :title="baseProgram.programWeight"
            >{{baseProgram.programWeight}}</span>
          </el-form-item>
          <el-form-item label="基础项目价格($)">
            <span
              :style="{width:widthSpan}"
              class="programName"
              v-if="baseProgram.currencyType !== 'usd'"
            >{{baseProgram.priceUsd}}</span>
            <el-input :style="{width:widthInput}" v-model="baseProgram.priceUsd" @input="basicUsd()" v-else></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="Strategist"
            prop="strategist"
            v-if="baseProgram.signVip !== 'Program_Manager'"
          >
            <el-select
              :style="{width:widthInput}"
              v-model="baseProgram.strategist"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in VIPList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Program Manager"
            prop="services"
            v-if="baseProgram.signVip !== 'Strategist'"
          >
            <el-select
              :style="{width:widthInput}"
              v-model="baseProgram.services"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in servicesList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="行业导师一对一课时数" prop="mentorHour" v-if="programType == 'continual'">
            <span
              :style="{width:widthSpan}"
              class="programName"
              v-if="baseProgram.mentorHour == -1"
            >不限</span>
            <el-input-number
              v-else
              :style="{width:widthInput}"
              v-model="baseProgram.mentorHour"
              :controls="false"
              size="mini"
              :min="0"
              :max="60"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="长度" prop="mentorHour" v-else>
            <span
              :style="{width:widthSpan}"
              class="programName"
            >{{baseProgram.period + '-' + baseProgram.periodUnit}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">汇总</div>
        <el-form
          :inline="true"
          size="mini"
          :model="collect"
          :rules="rulesig"
          ref="collect"
          label-width="180px"
        >
          <el-form-item label="合同起始日期" prop="startDate">
            <el-date-picker
              type="date"
              :style="{width:widthInput}"
              placeholder="选择日期"
              v-model="collect.startDate"
              style="width: 80%;"
              value-format="yyyy年MM月dd日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同结束日期" prop="endDate">
            <el-date-picker
              type="date"
              :style="{width:widthInput}"
              placeholder="选择日期"
              v-model="collect.endDate"
              style="width: 80%;"
              value-format="yyyy年MM月dd日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="主联系人" prop="contact1">
            <el-select
              v-model="collect.contact1"
              :style="{width:widthInput}"
              filterable
              placeholder="请选择联系人"
              style="width: 80%;"
            >
              <el-option
                v-for="item in salesList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="副联系人">
            <el-select
              :style="{width:widthInput}"
              v-model="collect.contact2"
              filterable
              placeholder="请选择副联系人"
              style="width: 80%;"
            >
              <el-option
                v-for="item in salesList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同总金额(￥)">
            <el-input :style="{width:widthInput}" v-model="totalPriceCny" style="display:none"></el-input>
            <span class="programName" :style="{width:widthSpan}">{{collect.totalPriceCny}}</span>
          </el-form-item>
          <el-form-item label="合同总金额($)">
            <el-input v-model="totalPriceUsd" style="display:none"></el-input>
            <span class="programName" :style="{width:widthSpan}">{{collect.totalPriceUsd}}</span>
          </el-form-item>
          <el-form-item label="汇率" prop="rate">
            <el-input
              :style="{width:widthInput}"
              v-model="collect.rate"
              :placeholder="'美元合理汇率不低于：'+extentRate"
            ></el-input>
          </el-form-item>

          <el-form-item label="订单类型">
            <el-select
              v-model="collect.orderType"
              filterable
              placeholder="请选择订单类型"
              :style="{width:widthInput}"
            >
              <el-option
                v-for="item in [{key:'0',value:'普通订单'},{key:'1',value:'节假日订单'}]"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="是否VIP同事推荐" prop="vipRecommendStatus">
          <el-select
            :style="{width:widthInput}"
            v-model="collect.vipRecommendStatus"
            placeholder="是否VIP同事推荐"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VIP同事推荐人" prop="vipRecommender" v-if="collect.vipRecommendStatus == 1">
          <el-select
            :style="{width:widthInput}"
            v-model="collect.vipRecommender"
            placeholder="VIP同事推荐人"
          >
            <el-option
              v-for="item in vipSelect"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="Pretalk" v-if="pretalkList.length > 0">
          <el-select
            :style="{width:widthInput}"
            v-model="collect.pretalkId"
            filterable
            placeholder="请选择"
            style="width: 80%;"
          >
            <el-option
              v-for="item in pretalkList"
              :key="item.pretalkId"
              :label="item.pretalkName"
              :value="item.pretalkId"
            ></el-option>
          </el-select>
        </el-form-item>

          <el-form-item label="合同公司" prop="signCompany">
            <el-select
              :style="{width:widthInput}"
              v-model="collect.signCompany"
              filterable
              placeholder="请选择"
              style="width: 80%;"
            >
              <el-option
                v-for="item in wst_company"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
                :disabled="!item.accountId && signOnline"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="签约合同公司" prop="company" v-if="signOnline">
            <el-select
              :style="{width:widthInput}"
              v-model="collect.company"
              filterable
              placeholder="请选择"
              style="width: 80%;"
            >
              <el-option
                v-for="item in company"
                :key="item.accountId"
                :label="item.companyName"
                :value="item.accountId"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="签约日期" prop="signDate" v-if="!signOnline">
            <el-date-picker
              :style="{width:widthInput}"
              type="date"
              placeholder="选择日期"
              v-model="collect.signDate"
              value-format="yyyy年MM月dd日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同模板" prop="contract" v-if="signOnline">
            <el-select
              v-model="collect.contract"
              filterable
              placeholder="请选择"
              :style="{width:widthInput}"
            >
              <el-option
                v-for="item in contractList"
                :key="item.pkId"
                :label="item.contractName"
                :value="item.contractTitle + '&&&' + item.contractContent"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="priceOff || (collect.rate && collect.rate < extentRate)"
            label="折扣说明："
            prop="discountInfo"
          >
            <el-input :style="{width:'650px'}" v-model="collect.discountInfo"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">礼物</div>
        <el-form
          :inline="true"
          size="mini"
          :model="gift"
          :rules="rulesig"
          ref="gift"
          label-width="180px"
        >
          <el-form-item label="是否有礼物" prop="hasGift">
            <el-select
              v-model="gift.hasGift"
              filterable
              placeholder="请选择"
              :style="{width:widthInput}"
              @change="changeGiftStatus"
            >
              <el-option
                v-for="item in [{key:'0',value:'无礼物'},{key:'1',value:'有礼物'}]"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="gift.gifts.length">
            <el-form-item label="收货人名" prop="recipientName">
              <el-input :style="{width: '190px'}" v-model="gift.recipientName" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="收货人电话" prop="recipientPhone">
              <el-input :style="{width: '190px'}" v-model="gift.recipientPhone" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="收货人地址" prop="recipientAddr">
              <el-input :style="{width: '650px'}" v-model="gift.recipientAddr" :maxlength="199"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input :style="{width: '650px'}" v-model="gift.remark" :maxlength="199"></el-input>
            </el-form-item>
            <br />
            <el-form-item label=" " prop>
              <el-button @click="addGift" size="mini">添加礼物</el-button>
            </el-form-item>
          </div>

          <el-form-item label="礼物" prop v-for="(gift,i) in gift.gifts" :key="i">
            <el-select v-model="gift.gift" filterable placeholder="请选择">
              <el-option
                v-for="item in giftList"
                :key="item.giftId"
                :label="item.giftName +' (库存:' + item.inventory + ')'"
                :disabled="!item.inventory"
                :value="item.giftId + '&&' + item.giftName + '&&' + item.giftPrice"
              ></el-option>
            </el-select>
            <el-input-number :min="0" :style="{width:'100px'}" v-model="gift.giftNum"></el-input-number>
            <el-button type="warning" plain round @click="deleteGift(i)" class="el-icon-delete"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">发票</div>
        <el-form
          :inline="true"
          size="mini"
          :model="invoice"
          :rules="rulesig"
          ref="invoice"
          label-width="180px"
        >
          <el-form-item label="是否开发票" prop="hasInvoice">
            <el-select
              v-model="invoice.hasInvoice"
              filterable
              placeholder="请选择"
              :style="{width:widthInput}"
            >
              <el-option
                v-for="item in [{key:'0',value:'开发票'},{key:'1',value:'不开发票'}]"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="invoice.hasInvoice == '0'">
            <el-form-item label="发票类型" prop>
              <el-select
                v-model="invoice.invoiceType"
                filterable
                placeholder="请选择"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in invoice_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司抬头/个人姓名" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.invoiceTitle" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="税号/身份证号" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.invoiceAccount" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="发票地址" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.invoiceAddr" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="发票电话" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.invoicePhone" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="开户行" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.invoiceBank" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="开户行账号" prop>
              <el-input
                :style="{width: '190px'}"
                v-model="invoice.invoiceBankAccount"
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <br />
            <el-form-item label="收货人名" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.recipientName" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="收货人电话" prop>
              <el-input :style="{width: '190px'}" v-model="invoice.recipientPhone" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="收货人地址" prop>
              <el-input :style="{width: '650px'}" v-model="invoice.recipientAddr" :maxlength="100"></el-input>
            </el-form-item>
            <!-- <el-form-item label="备注" prop="remark">
              <el-input :style="{width: '650px'}" v-model="invoice.remark" :maxlength="199"></el-input>
            </el-form-item>-->
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" v-show="signOnline">
        <el-button @click="signDetailClose">取 消</el-button>
        <!-- <el-button type="primary" @click="changePdf">预 览</el-button> -->
        <el-button type="primary" @click="createURL2">下一步</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-show="!signOnline">
        <el-button @click="signDetailClose">取 消</el-button>
        <el-button type="primary" @click="createURL">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 合同审查及修改 -->
    <el-dialog
      title="签约信息_合同"
      :visible.sync="changePDFShow"
      width="1100px"
      :fullscreen="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div class="list" id="list">
        <div class="item2" v-for="(item,i) in arr" :key="i">
          <div
            contenteditable="false"
            class="h1"
            v-if="item[0] === '第' &&  !Number.isInteger(item[1]*1)"
            v-html="item"
          ></div>
          <div
            contenteditable="false"
            class="h2"
            v-else-if="item[0] === '第' &&  Number.isInteger(item[1]*1)"
            v-html="item"
          ></div>
          <div contenteditable="false" class="h4" v-else-if="/\.\d\./.test(item)" v-html="item"></div>
          <div contenteditable="false" class="h3" v-else v-html="item"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="signBack">上一步</el-button>
        <el-button type="primary" @click="submitGG2">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/sales_assistant";
import apiDic from "@/api/dictionary";
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex';
export default {
  mixins: [mixins],
  props: {
    signDetailContinualVisible: {
      type: Boolean,
      default: false
    },
    menteeId: {
      type: String,
      default: ""
    },
    // internshipNum: {
    //   type: Number,
    //   default: 0
    // },
    // oralNum: {
    //   type: Number,
    //   default: 0
    // },
    programId: {
      type: String,
      default: null
    },
    signId: {
      type: String,
      default: null
    },
    orderId: {
      type: String,
      default: null
    },
    programType: {
      type: String,
      default: ""
    }
  },
  data: function() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3-9][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      width: 180,
      widthSpan:'160px',
      widthInput:'190px',
      signOnline: false,

      common_yes_or_no:[],
      wst_company: [],
      giftList: [], 
      pretalkList:[],
      schoolList: [],
      sex: [],
      degree: [],
      salesList: [],
      VIPList: [],
      servicesList: [],
      // 验证
      rulesig: {
        email: [
          { required: true, message: "必填", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ],
        wxId: [
          { required: true, message: "请输入微信ID", trigger: "blur" },
          { max: 60, message: "微信ID长度为60个字符以内", trigger: "blur" }
        ], //请输入微信ID
        realName: [{ required: true, message: "不能为空", trigger: "blur" }],
        school: [{ required: true, message: "不能为空", trigger: "blur" }],
        startDate: [{ required: true, message: "不能为空", trigger: "blur" }],
        endDate: [{ required: true, message: "不能为空", trigger: "blur" }],
        channel: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        sourceFrom: [
          { required: true, message: "请选择渠道", trigger: "blur" }
        ],
        degree: [{ required: true, message: "请选择学历", trigger: "blur" }],
        finishYear: [
          { required: true, message: "请选择毕业年份", trigger: "blur" }
        ],
        telephone:[
          { required: true, message: "请输入联系号码", trigger: "blur" },
        ],
        vipRecommendStatus:[
           { required: true, message: "必填", trigger: "blur" },
        ],
        vipRecommender:[
           { required: true, message: "必填", trigger: "blur" },
        ],
        channelNote: [
          { max: 60, message: "备注长度为60个字符以内", trigger: "blur" }
        ], //渠道备注
        program: [{ required: true, message: "请选择项目", trigger: "blur" }], //项目
        priceCny: [{ required: true, message: "请输入价格", trigger: "blur" }], //项目价格
        chiName: [{ required: true, message: "必填", trigger: "blur" }],
        sex: [{ required: true, message: "必填", trigger: "blur" }],
        totalPrice: [
          { required: true, message: "请输入价格", trigger: "blur" }
        ], //项目价格
        programPriceNote: [
          { max: 60, message: "备注长度为60个字符以内", trigger: "blur" }
        ], //项目价格备注
        rate: [{ required: true, message: "必填", trigger: "blur" }], //签约日期
        signDate: [
          { required: true, message: "请选择签约日期", trigger: "blur" }
        ], //签约日期
        startDate: [
          { required: true, message: "请选择签约日期", trigger: "blur" }
        ], //签约日期
        startAndEnd: [
          { required: true, message: "请选择合同有效日期", trigger: "blur" }
        ], //合同有效日期
        contact1: [
          { required: true, message: "请选择主联系人", trigger: "blur" }
        ], //主联系人
        strategist: [
          { required: true, message: "请选择全职导师", trigger: "blur" }
        ], //全职导师
        services: [{ required: true, message: "请选择客服", trigger: "blur" }],
        mentorHour: [], //行业导师一对一课时数
        strategistHour: [], //全职导师一对一课时数
        leadStrategistHour: [
          // { min: 0,  message: '不能小于0', trigger: 'blur' },
          //  { type: 'number', message: '课时数必须为数字值'}
        ], //全职导师一对一课时数
        programType: [
          { required: true, message: "请选择项目类别", trigger: "blur" }
        ], //项目类别
        programLevel: [
          { required: true, message: "请选择项目级别", trigger: "blur" }
        ], //项目级别
        signGrade: [
          { required: true, message: "请选择签约年级", trigger: "blur" }
        ], //签约年级
        company: [{ required: true, message: "必填", trigger: "blur" }],
        signCompany: [{ required: true, message: "必填", trigger: "blur" }],
        contract: [{ required: true, message: "必填", trigger: "blur" }],
        recipientName: [{ required: true, message: "必填", trigger: "blur" }],
        recipientPhone: [
          { required: true, message: "必填", trigger: "blur" },
          {
            validator: checkPhone,
            message: "手机号格式",
            trigger: "blur"
          }
        ],
        recipientAddr: [{ required: true, message: "必填", trigger: "blur" }],
        background: [{ required: true, message: "必填", trigger: "blur" }],
        situation: [{ required: true, message: "必填", trigger: "blur" }],
        discountInfo: [{ required: true, message: "必填", trigger: "blur" }],
        notice: [{ required: true, message: "必填", trigger: "blur" }],
        hasGift: [{ required: true, message: "必填", trigger: "blur" }],
        programId: [{ required: true, message: "必填", trigger: "blur" }],
        hasInvoice: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceType: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceTitle: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceAccount: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceAddr: [{ required: true, message: "必填", trigger: "blur" }],
        invoicePhone: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceBank: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceBankAccount: [
          { required: true, message: "必填", trigger: "blur" }
        ],
        invoiceStatus: [{ required: true, message: "必填", trigger: "blur" }]
      },

      // 学员基本信息
      menteeDetail: {
        wxId: "",
        menteeId: "",
        realName: "",
        email: "",
        sex: "",
        school: "",
        finishYear: "",
        degree: "",
        telephone: "",
        sourceFrom: ""
      },
      //Transition信息
      transition: {
        tracks: [],
        locations: [],
        background: "",
        situation: "",
        notice: "",
        other: ""
      },
      //基本项目信息
      baseProgram: {
        programName: "",
        basePriceCny: "",
        basePriceUsd: "",
        currencyType: "",
        priceCny: "",
        priceUsd: "",
        programPriceNote: "",
        strategist: "",
        services: "",
        mentorHour: "",
        strategistHour: "",
        leadStrategistHour: "",
        applicationLetterModify: "",
        jerryHour: "",
        onlinePrimaryMiddleHour: "",
        onlineHighHour: "",
        seminars: "",
        officeHour: null,
        liveLesson: 0,
        officeHourStrategistSession: 0
      },
      //实习项目信息
      internshipProgram: [
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        }
      ],
      //口语项目信息
      oralProgram: [
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        }
      ],
      // 汇总信息
      collect: {
        // vipRecommendStatus: "",
        // vipRecommender: "",
        startDate: "",
        endDate: "",
        contact1: "",
        contact2: "",
        totalPriceCny: "",
        totalPriceUsd: "",
        rate: "",
        orderType: "0",
        company: "",
        signCompany: "",
        pretalkId:'',
        signDate: "",
        contract: "",
        discountInfo: ""
      },
      // 礼物信息
      gift: {
        hasGift: null,
        gifts: [],
        recipientName: "",
        recipientPhone: "",
        recipientAddr: "",
        remark: ""
      },
      // 发票
      invoice: {
        hasInvoice: null,
        invoiceType: null,
        invoiceTitle: "",
        invoiceAccount: "",
        invoiceAddr: "",
        invoicePhone: "",
        invoiceBank: "",
        invoiceBankAccount: "",
        // invoiceStatus: "",
        recipientName: "",
        recipientPhone: "",
        recipientAddr: "",
        remark: ""
      },

      //实习单位列表
      internshipUnitList: [],
      oralList: [],
      // 汇率合理范围下限
      extentRate: "",
      //是否折扣订单
      priceOff: false,
      // 线上签约合同列表
      contractList: [],

      //修改合同
      changePDFShow: false,
      arr: [],
      // 合同正文
      contractText: ``,
      programData: {},

      // 实习相关下拉
      internship_duration: [],
      internship_location_type: [],
      mentee_source_from: [],

      internshipProps: {
        children: "internshipArr",
        label: "internshipName",
        value: "internshipId"
      },
      //所有的二级实习
      internshipIdList: [],
      oralNum: 0,
      internshipNum: 0,

      basicProgram: {},

      loading: false,
      channelList: [],
      channel_sourceList: [],
      invoice_type: [],
      sourceList: [],
      channelId: null,
      vipSelect: []
    };
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    // 用开始日期生成结束日期
    midStartDate() {
      return this.collect.startDate;
    },
    //计算出总金额，得使用该计算属性，内部代码才会触发
    totalPriceCny() {
      let price = 0;
      this.programId && (price += this.baseProgram.priceCny * 1);
      if (this.internshipNum != 0) {
        for (let i = 0; i < this.internshipNum; i++) {
          price += this.internshipProgram[i].priceCny * 1;
        }
      }
      if (this.oralNum != 0) {
        for (let i = 0; i < this.oralNum; i++) {
          price += this.oralProgram[i].priceCny * 1;
        }
      }
      this.collect.totalPriceCny = price;
    },
    totalPriceUsd() {
      let price = 0;
      this.programId && (price += this.baseProgram.priceUsd * 1);
      if (this.internshipNum != 0) {
        for (let i = 0; i < this.internshipNum; i++) {
          price += this.internshipProgram[i].priceUsd * 1;
        }
      }
      if (this.oralNum != 0) {
        for (let i = 0; i < this.oralNum; i++) {
          price += this.oralProgram[i].priceUsd * 1;
        }
      }
      this.collect.totalPriceUsd = price;
    },
    //汇率
    midRate() {
      return this.collect.rate;
    },
    internshipPrice0() {
      this.internshipProgram[0].priceCny =
        this.internshipProgram[0].priceUsd * this.collect.rate;
    },
    internshipPrice1() {
      this.internshipProgram[1].priceCny =
        this.internshipProgram[1].priceUsd * this.collect.rate;
    },
    internshipPrice2() {
      this.internshipProgram[2].priceCny =
        this.internshipProgram[2].priceUsd * this.collect.rate;
    },
    internshipPrice3() {
      this.internshipProgram[3].priceCny =
        this.internshipProgram[3].priceUsd * this.collect.rate;
    },
    internshipPrice4() {
      this.internshipProgram[4].priceCny =
        this.internshipProgram[4].priceUsd * this.collect.rate;
    },
    internshipPrice5() {
      this.internshipProgram[5].priceCny =
        this.internshipProgram[5].priceUsd * this.collect.rate;
    },
    internshipPrice6() {
      this.internshipProgram[6].priceCny =
        this.internshipProgram[6].priceUsd * this.collect.rate;
    },
    internshipPrice7() {
      this.internshipProgram[7].priceCny =
        this.internshipProgram[7].priceUsd * this.collect.rate;
    },
    internshipPrice8() {
      this.internshipProgram[8].priceCny =
        this.internshipProgram[8].priceUsd * this.collect.rate;
    },
    oralPrice0() {
      this.oralProgram[0].priceCny =
        this.oralProgram[0].priceUsd * this.collect.rate;
    },
    oralPrice1() {
      this.oralProgram[1].priceCny =
        this.oralProgram[1].priceUsd * this.collect.rate;
    },
    oralPrice2() {
      this.oralProgram[2].priceCny =
        this.oralProgram[2].priceUsd * this.collect.rate;
    },
    oralPrice3() {
      this.oralProgram[3].priceCny =
        this.oralProgram[3].priceUsd * this.collect.rate;
    },
    oralPrice4() {
      this.oralProgram[4].priceCny =
        this.oralProgram[4].priceUsd * this.collect.rate;
    },
    oralPrice5() {
      this.oralProgram[5].priceCny =
        this.oralProgram[5].priceUsd * this.collect.rate;
    },
    oralPrice6() {
      this.oralProgram[6].priceCny =
        this.oralProgram[6].priceUsd * this.collect.rate;
    },
    oralPrice7() {
      this.oralProgram[7].priceCny =
        this.oralProgram[7].priceUsd * this.collect.rate;
    },
    oralPrice8() {
      this.oralProgram[8].priceCny =
        this.oralProgram[8].priceUsd * this.collect.rate;
    }
  },
  watch: {
    signDetailContinualVisible: function(val) {
      if (val) {
        api.getPretalkListByMenteeId(this.menteeId).then(res => {
          console.log(res.data,111111111111111111111111)
          this.pretalkList = res.data;
        })
        this.priceOff = false;
        console.log('销售签约下订单,来源续签,11111111111111111111111')
        this.init();
      }
    },
    // 合同开始日期，自动填充结束日期
    midStartDate: function(val, oldVal) {
      if (!val) {
        return;
      }
      let arr = val.split(/[年月日-]/);
      let date = new Date();
      switch (this.baseProgram.periodUnit) {
        case "year":
          {
            date.setFullYear(arr[0] * 1 + this.baseProgram.period * 1);
            date.setMonth(arr[1] - 1);
            if(date.getFullYear()%4==0&&date.getFullYear()%100!=0||date.getFullYear()%400==0){
              if((arr[2] * 1) > 29){
                date.setDate(29);
              }else{
                date.setDate(arr[2] * 1);
              }
            }else{
              if((arr[2] * 1) > 28){
                date.setDate(28);
              }else{
                date.setDate(arr[2] * 1);
              }
            }
          }
          break;
        case "month":
          {
            date.setFullYear(arr[0]);
            date.setMonth(arr[1] - 1 + this.baseProgram.period);
            if((arr[1] - 1 + this.baseProgram.period + 1)%12 == 2){
              if(date.getFullYear()%4==0&&date.getFullYear()%100!=0||date.getFullYear()%400==0){
                if((arr[2] * 1) > 29){
                  date.setDate(29);
                }else{
                  date.setDate(arr[2] * 1);
                }
              }else{
                if((arr[2] * 1) > 28){
                  date.setDate(28);
                }else{
                  date.setDate(arr[2] * 1);
                }
              }
            }else{
              date.setDate(arr[2] * 1);
            }
          }
          break;
        case "week":
          {
            date.setFullYear(arr[0]);
            date.setMonth(arr[1] - 1);
            date.setDate(arr[2] * 1 + this.baseProgram.period * 7);
          }
          break;
        case "day":
          {
            date.setFullYear(arr[0]);
            date.setMonth(arr[1] - 1);
            date.setDate(arr[2] * 1 + this.baseProgram.period);
          }
          break;
      }
      let day = date.getDate();
      let month = date.getMonth() + 1;
      val =
        date.getFullYear() +
        "年" +
        (month > 9 ? month : "0" + month) +
        "月" +
        (day > 9 ? day : "0" + day) +
        "日";
      console.log(val);
      this.collect.endDate = val;
    },
    //汇率变化->基础项目价格变化
    midRate: function(newD, oldD) {
      if (this.baseProgram.currencyType !== "cny") {
        this.baseProgram.priceCny = Math.round(
          this.baseProgram.priceUsd * newD
        );
      } else {
        this.baseProgram.priceUsd = Math.round(
          this.baseProgram.priceCny / newD
        );
      }
    },
    channelId: function(val) {
      console.log(val);
      if (val == "channel-cooperator") {
        this.remote(this.menteeDetail.sourceFrom || "");
      } else if (val == "channel-ambassador") {
        this.remote(this.menteeDetail.sourceFrom || "");
      } else if (val) {
        this.sourceList = this.channel_sourceList[val];
        if (
          this.sourceList && this.sourceList.some(v => v.itemValue == this.menteeDetail.sourceFrom)
        ) {
          console.log(this.menteeDetail.sourceFrom);
        } else {
          this.menteeDetail.sourceFrom = "";
        }
        console.log(this.sourceList, this.channel_sourceList);
      } else {
        this.sourceList = [];
      }
    }
  },
  mounted(){
    this.priceOff = false;
    console.log('销售签约下订单,来源续签,11111111111111111111111')
    this.init();
  },
  methods: {
    basicCny(){
      if(this.collect.rate){
        this.baseProgram.priceUsd = Math.round(this.baseProgram.priceCny/this.collect.rate);
      }else{
        // this.baseProgram.priceUsd = 0;
      }
    },
    basicUsd(){
      if(this.collect.rate){
        this.baseProgram.priceCny = Math.round(this.baseProgram.priceUsd * this.collect.rate);
      } else{
        // this.baseProgram.priceCny = 0;
      }
    },
    // 下拉框搜索
    remote(v) {
      if (!this.channelId) {
        this.$message({
          type: "warning",
          message: "请先选择渠道"
        });
      } else if (this.channelId == "channel-cooperator") {
        this.getCooperatorSourceByName(v);
      } else if (this.channelId == "channel-ambassador") {
        this.getAmbassadorSourceByName(v);
      } else {
        this.selectFilter(v);
      }
    },
    // api搜索
    getAmbassadorSourceByName(v) {
      if (v.length >= 2) {
        this.loading = true;
        api.getAmbassadorSourceByName(v).then(res => {
          console.log(res);
          toString.call(res.data.rows) == "[object Array]" &&
            (this.sourceList = res.data.rows);
          if (
            !this.sourceList.some(
              v => v.itemValue == this.menteeDetail.sourceFrom
            )
          ) {
            this.menteeDetail.sourceFrom = "";
          }
          this.loading = false;
        });
      }
    },
    // api搜索
    getCooperatorSourceByName(v) {
      if (v.length >= 2) {
        this.loading = true;
        api.getCooperatorSourceByName(v).then(res => {
          console.log(res);
          toString.call(res.data.rows) == "[object Array]" &&
            (this.sourceList = res.data.rows);
          if (
            !this.sourceList.some(
              v => v.itemValue == this.menteeDetail.sourceFrom
            )
          ) {
            this.menteeDetail.sourceFrom = "";
          }
          this.loading = false;
        });
      }
    },
    //已有数据查找
    selectFilter(v) {
      this.sourceList = (this.channel_sourceList && this.channel_sourceList[this.channelId]) && this.channel_sourceList[this.channelId].filter(vv =>
        vv.label.include(v)
      );
    },
    async init() {
      this.$loading();
      //礼物列表
      api.userList({
          pageNum: 1,
          pageSize: 10000,
          entryStatus: "1",
          sortCol: "userName",
          sort: "ASC",
          positionType: "strategist,services",
        })
        .then((res) => {
          console.log(res,'vip推荐人列表yx*********')
          this.vipSelect = res.data.rows;
        });
        this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
        this.schoolList = await this.getSchool("school")
        this.sex = await this.getDictionary("sex")
        this.degree = await this.getDictionary("degree")

      // let params = {
      //   pageNum: 1,
      //   pageSize: 9999
      // };
      // apiDic.getSchoolDicList(params).then(res => {
      //   console.log(res.data.rows,'yx学校列表*****************')
      //   this.schoolList = res.data.rows;
      // });
      apiDic.getGiftList("0").then(({ data }) => {
        console.log("礼物列表", data);
        this.giftList = data;
      });
      apiDic
        .getDicDropdown(
          "internship_duration,internship_location_type,invoice_type"
        )
        .then(res => {
          this.internship_duration = res.data.internship_duration;
          this.internship_location_type = res.data.internship_location_type;
          this.invoice_type = res.data.invoice_type;
        });
      apiDic.getDicWstCompany().then(res => {
        this.wst_company = res.data;
      });
      apiDic.getChannelSource().then(res => {
        console.log(",getChannelSource", res.data);
        this.channelList = res.data.channelList;
        this.channel_sourceList = res.data.sourceList;
      });
      //下拉框选人
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: "userName",
          sort: "ASC",
          positionType: "sales"
        })
        .then(res => {
          this.salesList = res.data.rows;
          // 默认主联系人为当前登录用户
          this.salesList.forEach(v => {
            if (v.userId == this.$store.state.role.userInfo.userId) {
              this.collect.contact1 = this.$store.state.role.userInfo.userId;
            }
          });
        });
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: "userName",
          sort: "ASC",
          positionType: "strategist"
        })
        .then(res => {
          this.VIPList = res.data.rows;
        });
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: "userName",
          sort: "ASC",
          positionType: "services"
        })
        .then(res => {
          this.servicesList = res.data.rows;
        });
      api.getSignCompanyList().then(res => {
        console.log("线上签约公司列表", res.data);
        this.company = res.data;
      });
      api.getMenteeDataByMenteeId(this.menteeId).then(res => {
        console.log("获取学员基本信息", res.data);
        // this.collect.vipRecommendStatus = res.data.vipRecommendStatus;
        // this.collect.vipRecommender = res.data.vipRecommender;
        this.menteeDetail.wxId = res.data.wxId; //微信ID
        this.menteeDetail.menteeId = res.data.menteeId;
        this.menteeDetail.realName = res.data.realName;
        this.menteeDetail.email = res.data.email;
        this.menteeDetail.sex = res.data.sex;
        this.menteeDetail.school = res.data.school;
        this.menteeDetail.finishYear = res.data.finishYear;
        this.menteeDetail.degree = res.data.degree;
        this.menteeDetail.telephone = res.data.telephone;
        this.menteeDetail.sourceFrom = res.data.sourceFrom;
        this.menteeDetail.sourceFromName =
          res.data.channelName + "/" + res.data.sourceName;
        this.$nextTick().then(() => {
          this.channelId = res.data.channelId;
        });
        this.$loading().close();
      });
      api.getSignDetailBySignId(this.signId).then(res => {
        console.log("getSignDetailBySignId", res, res.data.signInfo.endDate);
        this.basicProgram = res.data.signInfo;
        let arr = res.data.signInfo.endDate.split(/-/);
        let date = new Date();
        date.setFullYear(arr[0]);
        date.setMonth(arr[1] - 1);
        date.setDate(arr[2] * 1 + 1);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let val =
          date.getFullYear() +
          "年" +
          (month > 9 ? month : "0" + month) +
          "月" +
          (day > 9 ? day : "0" + day) +
          "日";
        this.collect.startDate = val;
      });
      api.getRate({ currencyType: "usd" }).then(res => {
        console.log("拿汇率区间", res.data);
        this.extentRate = res.data.orderRate1;
      });
      if (this.programId) {
        api
          .getProgramById(this.programId)
          .then(res => {
            this.programData = res.data;
            let data = res.data;
            this.baseProgram.programType = data.programType;
            this.baseProgram.programName = data.programName;
            this.baseProgram.programWeight = data.programWeight;
            this.baseProgram.programId = data.programId;
            this.baseProgram.priceCny = data.priceCny;
            this.baseProgram.basePriceCny = data.priceCny;
            this.baseProgram.basePriceUsd = data.priceUsd;
            this.baseProgram.priceUsd = data.priceUsd;
            this.baseProgram.mentorHour = data.mentorHour;
            this.baseProgram.strategistHour = data.strategistHour;
            this.baseProgram.leadStrategistHour = data.leadStrategistHour;
            this.baseProgram.period = data.period;
            this.baseProgram.periodUnit = data.periodUnit;
            this.baseProgram.currencyType = data.currencyType;
            this.baseProgram.applicationLetterModify = data.applicationLetterModify;
            this.baseProgram.jerryHour = data.jerryHour;
            this.baseProgram.onlinePrimaryMiddleHour = data.onlinePrimaryMiddleHour;
            this.baseProgram.onlineHighHour = data.onlineHighHour;
            this.baseProgram.seminars = data.seminars;
            this.baseProgram.officeHour = data.officeHour;
            this.baseProgram.signVip = data.signVip;
            this.contractList = data.contractList;
            this.baseProgram.officeHourStrategistSession = data.officeHourStrategistSession;
            this.baseProgram.liveLesson = data.liveLesson;
            console.log("拿项目信息 continual续费的Yx***********", data,this.programId);
          })
          .catch(err => {
            this.$message("网络故障请刷新");
          });
      }
    },
    signDetailClose() {
      this.clear();
      this.sourceList = [];
      this.channelId = null;
      this.contractList = []
      this.$emit("close");
    },
    //加礼物
    addGift() {
      this.gift.gifts.push({ giftId: null, giftNum: 1 });
    },
    //删礼物
    deleteGift(i) {
      console.log(i);
      this.gift.gifts.splice(i, 1);
      if (!this.gift.gifts.length) {
        this.gift.hasGift = "0";
      }
    },

    // 选择实习单位更新其价格
    changeOption(v, item) {
      console.log(v, item);
      this.oralList.forEach(ve => {
        if (ve.oralId == v) {
          this.oralProgram[item].priceUsd = ve.oralPriceUsd;
          this.oralProgram[item].basePriceUsd = ve.oralPriceUsd;
          this.oralProgram[item].oralLessonHour = ve.oralLessonHour;
          this.oralProgram[item].note = "";
          return;
        }
      });
    },
    //选择实习单位更新其价格
    changeInternshipId(internshipUnit, index) {
      let internshipId = internshipUnit[1];
      let item = this.internshipIdList.filter(
        v => v.internshipId == internshipId
      )[0];
      this.internshipProgram[index].internshipLocation =
        item.internshipLocation;
      this.internshipProgram[index].internshipDuration = item.internshipTime;
      this.internshipProgram[index].priceUsd = item.priceUsd;
      this.internshipProgram[index].basePriceUsd = item.priceUsd;
      console.log(this.internshipProgram[index], item);
    },
    // 生成
    createURL() {
      let canGo = true;
      if (/^[a-z]|\s[a-z]/.test(this.menteeDetail.chiName)) {
        this.$message({
          type: "warning",
          message: "请检查法定名输入规范"
        });
        return;
      }
      //实习单位
      for(let i=0;i<this.schoolList.length;i++){
        if(this.schoolList[i].schoolId == this.menteeDetail.school){
          if(this.schoolList[i].engName){
            if(this.schoolList[i].engName.indexOf('Other') != '-1'){
              this.$message({
                type: "warning",
                message: "请选择具体的学校，若无匹配学校请联系销售助理添加学校后继续录入"
              });
              return;
            }
          }
        }
      }
      // if (this.internshipProgram.some(v => !v.internshipUnit)) {
      //   this.$message({
      //     type: "warning",
      //     message: "请检查实习单位"
      //   });
      //   return;
      // }
      for (let i = 0; i < this.internshipNum; i++) {
        if (!this.internshipProgram[i].internshipUnit[1]) {
          this.$message({
            type: "warning",
            message: "请检查实习单位"
          });
          return;
        }
      }
      for (let i = 0; i < this.oralNum; i++) {
        if (!this.oralProgram[i].oralId) {
          this.$message({
            type: "warning",
            message: "请检查口语项目"
          });
          return;
        }
      }

      this.$refs.menteeDetail.validate(valid => {
        if (!valid) canGo = false;
      });
      //transition
      // this.$refs.transition.validate(valid => {
      //   if (!valid) canGo = false;
      // });

      this.$refs.baseProgram &&
        this.$refs.baseProgram.validate(valid => {
          if (!valid) canGo = false;
        });

      this.$refs.internshipProgram &&
        this.$refs.internshipProgram.validate(valid => {
          if (!valid) canGo = false;
        });
      this.$refs.collect.validate(valid => {
        if (!valid) canGo = false;
      });
      // 礼物
      this.$refs.gift &&
        this.$refs.gift.validate(valid => {
          if (!valid) canGo = false;
        });
      // 发票
      this.$refs.invoice &&
        this.$refs.invoice.validate(valid => {
          if (!valid) canGo = false;
        });
      //确认金额是否打折
      //判断有折扣说明
      this.baseProgram.currencyType; //项目货币基准
      // 计算价格打折比例；%
      let priceRate = offPrice(
        this.baseProgram.currencyType == "cny"
          ? this.baseProgram.basePriceCny
          : this.baseProgram.basePriceUsd * this.collect.rate,
        this.baseProgram.currencyType == "cny"
          ? this.baseProgram.priceCny
          : this.baseProgram.priceUsd * this.collect.rate,
        this.internshipProgram,
        this.oralProgram,
        this.collect.rate
      );
      if (priceRate >= 5) {
        if (!this.collect.discountInfo) {
          this.$message({
            type: "warning",
            message: "价格有折扣，请填写折扣说明"
          });
          this.priceOff = true;
          return;
        }
      } else {
        if (this.extentRate <= this.collect.rate) {
          this.priceOff = false;
          this.collect.discountInfo = "";
        } else {
          priceRate = 5;
        }
      }
      // 计算价格打折比例；%,(基础项目原件，基础项目现价，实习项目，口语项目，汇率)
      function offPrice(bp, nbp, internship, oral, r) {
        let totalP = bp * 1;
        let nTotalP = nbp * 1;
        internship.length &&
          internship.forEach(v => {
            totalP += v.basePriceUsd * r;
            nTotalP += v.priceUsd * r;
          });
        oral.length &&
          oral.forEach(v => {
            totalP += v.basePriceUsd * r;
            nTotalP += v.priceUsd * r;
          });
        console.log(nTotalP, totalP);
        return ((totalP - nTotalP) / totalP) * 100;
      }
      //礼品价值不超过合同金额5%
      let giftTotalPriceForOrderPrice = 0;
      this.gift.gifts.forEach(v => {
        if (v.gift) {
          giftTotalPriceForOrderPrice += v.gift.split("&&")[2] * 1 * v.giftNum;
        } else {
          this.$message({
            type: "warning",
            message: "请选择具体礼物"
          });
          return;
        }
      });
      console.log(
        "项目总金额，礼品，礼品总金额",
        this.collect.totalPriceCny,
        this.gift.gifts,
        giftTotalPriceForOrderPrice
      );
      if (
        (this.collect.totalPriceCny * 5) / 100 <
        giftTotalPriceForOrderPrice
      ) {
        this.$message({
          type: "warning",
          message: "礼品价值不得超过合同总金额5%"
        });
        return;
      }

      // console.log("合同内容", this.contractText, this.onlineContract);
      if (!this.contractText && this.signOnline) {
        this.$message({
          type: "warning",
          message: "请先预览合同，并确认无误"
        });
        return;
      }
      // 合同样式配置
      // 第*章 => \n第.章\s
      //  第*条 => \n第\d\d?条\s
      //   n.n => \n\d\d?\.\d\d?\s
      //   n.n.n => \n\d\d?\.\d\d?\.\d\d?\s
      //   n. => \n\d\d?\.\s

      let reg = /(\n第.章\s)|(\n第\d\d?条\s)|(\n\d\d?\.\d\d?\s)|(\n\d\d?\.\d\d?\.\d\d?\s)|(\n\d\d?\.\s)/g;
      let rarr = [];
      let r = [];
      while ((r = reg.exec(this.contractText))) {
        rarr.push(r);
      }
      for (let i = 0; i < rarr.length; i++) {
        let str = rarr[i][0];
        let newStr = str.substr(0, str.length - 1) + "\t";
        this.contractText = this.contractText.replace(str, newStr);
      }
      console.log(this.contractText, this.collect.contract);

      if (canGo) {
        let data = {
          programName: this.baseProgram.programName,
          mentee: {
            menteeId: this.menteeDetail.menteeId,
            realName: this.menteeDetail.realName,
            chiName: this.menteeDetail.chiName,
            school: this.menteeDetail.school, //ID
            sourceFrom: this.menteeDetail.sourceFrom,
            degree: this.menteeDetail.degree,
            telephone: this.menteeDetail.telephone,
            wxId: this.menteeDetail.wxId,
            finishYear: this.menteeDetail.finishYear,
            email: this.menteeDetail.email,
            sex: this.menteeDetail.sex
          },
          contractArr: [{
            contractContent:this.contractText,
            contractTitle:this.collect.contract && this.collect.contract.split("&&&")[0],
          }]
        };
        data.mentee.schoolName = data.mentee.school;
        this.schoolList.forEach(v => {
          if (v.schoolId == data.mentee.school) {
            data.mentee.schoolName = v.schoolName;
          }
        });
        if (this.programId) {
          if (this.programType == "continual") {
            let continual = {
              basicSignId: this.signId, //关联原项目id
              program: this.baseProgram.programId,
              programName: this.baseProgram.programName,
              programWeight: this.baseProgram.programWeight,
              programPriceCny: this.baseProgram.priceCny,
              programPriceUsd: this.baseProgram.priceUsd,
              programPriceNote: this.baseProgram.programPriceNote,
              // strategist: this.baseProgram.strategist,
              // services: this.baseProgram.services,
              mentorHour:
                this.baseProgram.mentorHour && this.baseProgram.mentorHour > 0
                  ? this.baseProgram.mentorHour
                  : 0,
              vipHour:
                this.baseProgram.leadStrategistHour +
                this.baseProgram.strategistHour,
              leadStrategistHour: this.baseProgram.leadStrategistHour,
              note: this.baseProgram.note,
              program_level: this.baseProgram.program_level,
              // program_type: this.baseProgram.program_type,
              program_type: this.baseProgram.programType,
              applicationLetterModify: this.baseProgram.applicationLetterModify,
              jerryHour: this.baseProgram.jerryHour,
              onlinePrimaryMiddleHour: this.baseProgram.onlinePrimaryMiddleHour,
              onlineHighHour: this.baseProgram.onlineHighHour,
              seminars: this.baseProgram.seminars,
              period: this.baseProgram.period,
              periodUnit: this.baseProgram.periodUnit,
              officeHour: this.baseProgram.officeHour
            };
            data.continual = continual;
          } else if (this.programType == "extension") {
            let extension = {
              basicSignId: this.signId, //关联原项目id
              program: this.baseProgram.programId,
              programName: this.baseProgram.programName,
              programWeight: this.baseProgram.programWeight,
              programPriceCny: this.baseProgram.priceCny,
              programPriceUsd: this.baseProgram.priceUsd,
              programPriceNote: this.baseProgram.programPriceNote,
              // strategist: this.baseProgram.strategist,
              // services: this.baseProgram.services,
              mentorHour:
                this.baseProgram.mentorHour && this.baseProgram.mentorHour > 0
                  ? this.baseProgram.mentorHour
                  : 0,
              vipHour:
                this.baseProgram.leadStrategistHour +
                this.baseProgram.strategistHour,
              leadStrategistHour: this.baseProgram.leadStrategistHour,
              note: this.baseProgram.note,
              program_level: this.baseProgram.program_level,
              // program_type: this.baseProgram.program_type,
              program_type: this.baseProgram.programType,

              applicationLetterModify: this.baseProgram.applicationLetterModify,
              jerryHour: this.baseProgram.jerryHour,
              onlinePrimaryMiddleHour: this.baseProgram.onlinePrimaryMiddleHour,
              onlineHighHour: this.baseProgram.onlineHighHour,
              seminars: this.baseProgram.seminars,
              period: this.baseProgram.period,
              periodUnit: this.baseProgram.periodUnit,
              officeHour: this.baseProgram.officeHour
            };
            data.extension = extension;
          } else if (this.programType == "suspend") {
            let suspend = {
              basicSignId: this.signId, //关联原项目id
              program: this.baseProgram.programId,
              programName: this.baseProgram.programName,
              programWeight: this.baseProgram.programWeight,
              programPriceCny: this.baseProgram.priceCny,
              programPriceUsd: this.baseProgram.priceUsd,
              programPriceNote: this.baseProgram.programPriceNote,
              // strategist: this.baseProgram.strategist,
              // services: this.baseProgram.services,
              mentorHour:
                this.baseProgram.mentorHour && this.baseProgram.mentorHour > 0
                  ? this.baseProgram.mentorHour
                  : 0,
              vipHour:
                this.baseProgram.leadStrategistHour +
                this.baseProgram.strategistHour,
              leadStrategistHour: this.baseProgram.leadStrategistHour,
              note: this.baseProgram.note,
              program_level: this.baseProgram.program_level,
              // program_type: this.baseProgram.program_type,
              program_type: this.baseProgram.programType,

              applicationLetterModify: this.baseProgram.applicationLetterModify,
              jerryHour: this.baseProgram.jerryHour,
              onlinePrimaryMiddleHour: this.baseProgram.onlinePrimaryMiddleHour,
              onlineHighHour: this.baseProgram.onlineHighHour,
              seminars: this.baseProgram.seminars,
              period: this.baseProgram.period,
              periodUnit: this.baseProgram.periodUnit,
              officeHour: this.baseProgram.officeHour
            };
            data.suspend = suspend;
          }
        }
        if (this.internshipNum) {
          let internship = [];
          for (let i = 0; i < this.internshipNum; i++) {
            let inter = {
              program: 3,
              programPriceCny: this.internshipProgram[i].priceCny,
              programPriceUsd: this.internshipProgram[i].priceUsd,
              internshipId: this.internshipProgram[i].internshipUnit[1],
              internshipNote: this.internshipProgram[i].note
            };
            internship.push(inter);
          }
          data.internship = internship;
        }
        if (this.oralNum) {
          let oral = [];
          for (let i = 0; i < this.oralNum; i++) {
            let inter = {
              program: 0,
              programPriceCny: this.oralProgram[i].priceCny,
              programPriceUsd: this.oralProgram[i].priceUsd,
              oralId: this.oralProgram[i].oralId,
              oralLessonHour: this.oralProgram[i].oralLessonHour,
              // strategist: this.oralProgram[i].strategist,
              // services: this.oralProgram[i].services,
              programPriceNote: this.oralProgram[i].note
            };
            oral.push(inter);
          }
          data.oral = oral;
        }
        let pretalkName = '';
        if(this.collect.pretalkId){
          this.pretalkList.forEach(item => {
            if(this.collect.pretalkId == item.pretalkId){
              pretalkName = item.pretalkName
            }
          })
        }
        let collect = {
          // vipRecommendStatus: this.collect.vipRecommendStatus,
          // vipRecommender: this.collect.vipRecommender,
          basicOrderId: this.orderId, //关联原orderId
          orderType: this.collect.orderType,
          signDate: this.collect.signDate,
          signCompany: this.collect.signCompany,
          pretalkId: this.collect.pretalkId,
          realName: this.menteeDetail.realName,
          pretalkName: pretalkName,
          startDate: this.collect.startDate,
          endDate: this.collect.endDate,
          contact1: this.collect.contact1,
          contact2: this.collect.contact2,
          rate: this.collect.rate,
          orderPrice: this.collect.totalPriceCny,
          orderPriceUsd: this.collect.totalPriceUsd
        };
        if (this.collect.discountInfo) {
          collect.discountStatus = 1;
          collect.discountProportion = priceRate * 1;
          collect.discountInfo = this.collect.discountInfo;
        }
        data.collect = collect;
        // 发票
        let giftCan = true;
        if (this.gift.gifts.length) {
          this.gift.gifts.forEach(v => {
            if (!v.gift) {
              this.$message("有礼物没有选！");
              giftCan = false;
              return;
            }
            v.giftId = v.gift.split("&&")[0];
          });
          let gift = {
            recipientName: this.gift.recipientName || "",
            recipientPhone: this.gift.recipientPhone || "",
            recipientAddr: this.gift.recipientAddr || "",
            remark: this.gift.remark || "",
            giftArr: this.gift.gifts
          };

          data.gift = gift;
        }
        if (!giftCan) {
          return;
        }
        //发票
        if (this.invoice.hasInvoice == 0) {
          data.invoiceTitle = { ...this.invoice };
          // if (this.invoice.invoiceStatus == "1" && !this.invoice.invoiceBy) {
          //   data.invoice.invoiceBy = this.userInfo.userId;
          //   data.invoice.invoiceTime = new Date();
          // }
        }
        if (data.collect.startDate > data.collect.endDate) {
          this.$message("合同终止日期不可小于开始日期");
          return;
        }
        console.log(data.collect.signDate, data.collect.startDate,'yx111111111111111111111111');
        if(!this.signOnline){
          if (data.collect.signDate > data.collect.startDate) {
            this.$message("合同起始日期不可小于签约日期");
            return;
          }
        }
        //transition
        // let transition = {
        //   background: this.transition.background,
        //   situation: this.transition.situation,
        //   notice: this.transition.notice,
        //   other: this.transition.other,
        //   locationArr: this.transition.locations,
        //   trackArr: this.transition.tracks
        // };
        // data.transition = transition;
        console.log(data);
        this.$loading();
        // 线下/线上
        if (this.signOnline) {
          api
            .createOnlineContract(data)
            .then(res => {
              console.log("创建签约在线签约", res);
              // this.contractURL = res.data.signUrl;
              // this.contractPDFURL = res.data.docUrl;
              // this.urlVisible = true;
              // this.contractText = "";
              this.$loading().close();
              this.$emit("onlineSuccess", res.data.pageUrl, res.data);
              this.clear();
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.message
              });
              this.$loading().close();
              console.log(err);
            });
        } else {
          api
            .createOfflineContract(data)
            .then(res => {
              console.log("创建签约线下签约", res);
              this.$loading().close();
              this.$message({
                type: "success",
                message: "创建成功"
              });
              this.$emit("success");
              this.clear();
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "error",
                message: err.message
              });
              this.$loading().close();
            });
        }
      }
    },
    clear() {
      this.contractText = "";
      // 学员基本信息
      this.menteeDetail = {
        wxId: "",
        menteeId: "",
        realName: "",
        email: "",
        sex: "",
        school: "",
        telephone: "",
        finishYear: "",
        degree: "",
        sourceFrom: ""
      };
      //Transition信息
      this.transition = {
        tracks: [],
        locations: [],
        background: "",
        situation: "",
        notice: "",
        other: ""
      };
      //基本项目信息
      this.baseProgram = {
        programName: "",
        basePriceCny: "",
        basePriceUsd: "",
        currencyType: "",
        priceCny: "",
        priceUsd: "",
        programPriceNote: "",
        strategist: "",
        services: "",
        mentorHour: 0,
        strategistHour: 0,
        leadStrategistHour: 0,
        applicationLetterModify: 0,
        jerryHour: 0,
        onlinePrimaryMiddleHour: 0,
        onlineHighHour: 0,
        seminars: 0,
        officeHour: 0,
        liveLesson: 0,
        officeHourStrategistSession: 0
      };
      //实习项目信息
      this.internshipProgram = [
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          internshipLocation: "",
          internshipDuration: ""
        }
      ];
      this.oralProgram = [
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        },
        {
          oralId: "",
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: "",
          oralLessonHour: 0,
          services: "",
          strategist: ""
        }
      ];
      // 汇总信息
      this.collect = {
        // vipRecommendStatus:'',
        // vipRecommender:'',
        startDate: "",
        endDate: "",
        contact1: "",
        contact2: "",
        totalPriceCny: "",
        totalPriceUsd: "",
        rate: "",
        orderType: "0",
        company: "",
        signCompany: "",
        pretalkId:'',
        signDate: "",
        contract: "",
        discountInfo: ""
      };
      // 礼物信息
      this.gift = {
        hasGift: null,
        gifts: [],
        recipientName: "",
        recipientPhone: "",
        recipientAddr: "",
        remark: ""
      };
      // 发票信息
      this.invoice = {
        hasInvoice: null,
        invoiceType: null,
        invoiceTitle: "",
        invoiceAccount: "",
        invoiceAddr: "",
        invoicePhone: "",
        invoiceBank: "",
        invoiceBankAccount: "",
        // invoiceStatus: "",
        recipientName: "",
        recipientPhone: "",
        recipientAddr: "",
        remark: ""
      };
      this.basicProgram = {};
      this.$refs.menteeDetail.resetFields();
      // this.$refs.transition.resetFields();
      this.$refs.baseProgram && this.$refs.baseProgram.resetFields();
      this.$refs.internshipProgram &&
        this.$refs.internshipProgram.resetFields();
      this.$refs.oralProgram && this.$refs.oralProgram.resetFields();
      this.$refs.collect.resetFields();
      this.$refs.gift && this.$refs.gift.resetFields();
      this.$refs.invoice && this.$refs.invoice.resetFields();
    },
    createURL2() {
      let canGo = true;
      if (/^[a-z]|\s[a-z]/.test(this.menteeDetail.chiName)) {
        this.$message({
          type: "warning",
          message: "请检查法定名输入规范"
        });
        return;
      }
      //实习单位
      for(let i=0;i<this.schoolList.length;i++){
        if(this.schoolList[i].schoolId == this.menteeDetail.school){
          if(this.schoolList[i].engName){
            if(this.schoolList[i].engName.indexOf('Other') != '-1'){
              this.$message({
                type: "warning",
                message: "请选择具体的学校，若无匹配学校请联系销售助理添加学校后继续录入"
              });
              return;
            }
          }
        }
      }
      // if (this.internshipProgram.some(v => !v.internshipUnit)) {
      //   this.$message({
      //     type: "warning",
      //     message: "请检查实习单位"
      //   });
      //   return;
      // }
      for (let i = 0; i < this.internshipNum; i++) {
        if (!this.internshipProgram[i].internshipUnit[1]) {
          this.$message({
            type: "warning",
            message: "请检查实习单位"
          });
          return;
        }
      }
      for (let i = 0; i < this.oralNum; i++) {
        if (!this.oralProgram[i].oralId) {
          this.$message({
            type: "warning",
            message: "请检查口语项目"
          });
          return;
        }
      }

      this.$refs.menteeDetail.validate(valid => {
        if (!valid) canGo = false;
      });
      //transition
      // this.$refs.transition.validate(valid => {
      //   if (!valid) canGo = false;
      // });

      this.$refs.baseProgram &&
        this.$refs.baseProgram.validate(valid => {
          if (!valid) canGo = false;
        });

      this.$refs.internshipProgram &&
        this.$refs.internshipProgram.validate(valid => {
          if (!valid) canGo = false;
        });
      this.$refs.collect.validate(valid => {
        if (!valid) canGo = false;
      });
      // 礼物
      this.$refs.gift &&
        this.$refs.gift.validate(valid => {
          if (!valid) canGo = false;
        });
      // 发票
      this.$refs.invoice &&
        this.$refs.invoice.validate(valid => {
          if (!valid) canGo = false;
        });
      //确认金额是否打折
      //判断有折扣说明
      this.baseProgram.currencyType; //项目货币基准
      // 计算价格打折比例；%
      let priceRate = offPrice(
        this.baseProgram.currencyType == "cny"
          ? this.baseProgram.basePriceCny
          : this.baseProgram.basePriceUsd * this.collect.rate,
        this.baseProgram.currencyType == "cny"
          ? this.baseProgram.priceCny
          : this.baseProgram.priceUsd * this.collect.rate,
        this.internshipProgram,
        this.oralProgram,
        this.collect.rate
      );
      if (priceRate >= 5) {
        if (!this.collect.discountInfo) {
          this.$message({
            type: "warning",
            message: "价格有折扣，请填写折扣说明"
          });
          this.priceOff = true;
          return;
        }
      } else {
        if (this.extentRate <= this.collect.rate) {
          this.priceOff = false;
          this.collect.discountInfo = "";
        } else {
          priceRate = 5;
        }
      }
      // 计算价格打折比例；%,(基础项目原件，基础项目现价，实习项目，口语项目，汇率)
      function offPrice(bp, nbp, internship, oral, r) {
        let totalP = bp * 1;
        let nTotalP = nbp * 1;
        internship.length &&
          internship.forEach(v => {
            totalP += v.basePriceUsd * r;
            nTotalP += v.priceUsd * r;
          });
        oral.length &&
          oral.forEach(v => {
            totalP += v.basePriceUsd * r;
            nTotalP += v.priceUsd * r;
          });
        console.log(nTotalP, totalP);
        return ((totalP - nTotalP) / totalP) * 100;
      }
      //礼品价值不超过合同金额5%
      let giftTotalPriceForOrderPrice = 0;
      this.gift.gifts.forEach(v => {
        if (v.gift) {
          giftTotalPriceForOrderPrice += v.gift.split("&&")[2] * 1 * v.giftNum;
        } else {
          this.$message({
            type: "warning",
            message: "请选择具体礼物"
          });
          return;
        }
      });
      console.log(
        "项目总金额，礼品，礼品总金额",
        this.collect.totalPriceCny,
        this.gift.gifts,
        giftTotalPriceForOrderPrice
      );
      if (
        (this.collect.totalPriceCny * 5) / 100 <
        giftTotalPriceForOrderPrice
      ) {
        this.$message({
          type: "warning",
          message: "礼品价值不得超过合同总金额5%"
        });
        return;
      }

      // 合同样式配置
      // 第*章 => \n第.章\s
      //  第*条 => \n第\d\d?条\s
      //   n.n => \n\d\d?\.\d\d?\s
      //   n.n.n => \n\d\d?\.\d\d?\.\d\d?\s
      //   n. => \n\d\d?\.\s

      let reg = /(\n第.章\s)|(\n第\d\d?条\s)|(\n\d\d?\.\d\d?\s)|(\n\d\d?\.\d\d?\.\d\d?\s)|(\n\d\d?\.\s)/g;
      let rarr = [];
      let r = [];
      while ((r = reg.exec(this.contractText))) {
        rarr.push(r);
      }
      for (let i = 0; i < rarr.length; i++) {
        let str = rarr[i][0];
        let newStr = str.substr(0, str.length - 1) + "\t";
        this.contractText = this.contractText.replace(str, newStr);
      }
      console.log(this.contractText, this.collect.contract);
      if (canGo) {
        this.changePdf()
      }
    },
    //修改合同内容
    changePdf() {
      this.$refs.gift &&
        this.$refs.gift.validate((valid) => {
          console.log(valid)
          if (!valid){
            return false
          }else{
            this.$refs.menteeDetail.validate(valid => {
              if (!valid) return;
              this.$refs.collect.validate(valid => {
                if (!valid) return;
                // 配置合同内容
                let contractContent =
                  this.collect.contract && this.collect.contract.split("&&&")[1];
                if (!contractContent) {
                  this.$message("合同内容为空，请联系管理员");
                  return;
                }
                console.log(this.arr);
                let reg = /\$\{.+?\}/g;
                let arr = [];
                let r = [];
                while ((r = reg.exec(contractContent))) {
                  arr.push(r);
                }
                // console.log(contractContent,arr);
                this.programData = Object.assign(
                  {},
                  this.programData,
                  this.menteeDetail,
                  this.baseProgram,
                  this.collect,
                  this.gift
                );
                console.log(this.programData, contractContent, arr);
                arr.forEach(v => {
                  let param = v[0].substr(2, v[0].length - 3);
                  console.log(v[0], param, this.programData[param]);
                  if (param == "giftName") {
                    let giftName = "";
                    this.gift.gifts &&
                      this.gift.gifts.forEach(v => {
                        giftName += v.gift.split("&&")[1] + "*" + v.giftNum + ", ";
                      });
                    let len = giftName.length - 2;
                    contractContent = contractContent
                      .split(v[0])
                      .join(
                        '<span style="background:#afa">' +
                          (giftName.length ? giftName.substr(0, len) : "__________") +
                          "</span>"
                      );
                  } else if (param == "giftTotalPrice") {
                    let giftTotalPrice = 0;
                    this.gift.gifts &&
                      this.gift.gifts.forEach(v => {
                        giftTotalPrice += v.gift.split("&&")[2] * 1 * v.giftNum;
                      });
                    contractContent = contractContent
                      .split(v[0])
                      .join(
                        '<span style="background:#afa">' + giftTotalPrice + "</span>"
                      );
                  } else if (param == "internship") {
                    contractContent = contractContent
                      .split(v[0])
                      .join(
                        '<span style="background:#afa">' +
                          this.internshipNum +
                          "</span>"
                      );
                  } else if (param == "oralLessonHour") {
                    contractContent = contractContent
                      .split(v[0])
                      .join(
                        '<span style="background:#afa">' +
                          (this.oralProgram[0].oralLessonHour || "空") +
                          "</span>"
                      );
                  } else {
                    contractContent = contractContent
                      .split(v[0])
                      .join(
                        '<span style="background:#afa">' +
                          (this.programData[param] == -1
                            ? "不限"
                            : this.programData[param] || 0) +
                          "</span>"
                      );
                  }
                });
                console.log(contractContent);
                this.arr = contractContent.split("\n");
                this.changePDFShow = true;
              });
            });
          }
        });
    
    },
    //确认修改后合同内容
    signBack(){
      this.changePDFShow = false;
    },
    submitGG2() {
      this.contractText = document.getElementById("list").innerText;
      console.log(this.contractText);
      this.changePDFShow = false;
      this.createURL()
    },
    // 是否有礼物
    changeGiftStatus(v) {
      console.log(v);
      if (v == 1) {
        this.gift.gifts = [{ giftId: null, giftNum: 1 }];
      } else {
        this.gift.gifts = [];
      }
    },
    changeSignType() {
      this.collect.signCompany = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.programName {
  padding: 0px 9px;
  border: 1px #dcdfe6 dashed;
  border-radius: 5px;
  min-width: 170px;
  height: 26px;
  display: inline-block;
}
.create-cant-program-model {
  border: 1px #dcdfe6 solid;
  margin-top: 20px;
  border-radius: 5px;
  position: relative;
  padding: 20px;
}
::v-deep .program_item{
  color: #000;
  font-weight: 600;
}
</style>