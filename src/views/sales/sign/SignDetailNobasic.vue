<!--
 * @Author: Kaan
 * @Date: 2022-03-25 20:34:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-04-06 10:15:00
 * @version:
 * @Descripttion: rebate签约不再返佣
-->
<template>
  <div class="sign-detail">
    <el-dialog
      title="签约信息_详情"
      class="info"
      :visible.sync="signDetailVisibleLocal"
      :close-on-click-modal="false"
      width="1400px"
      :before-close="signDetailClose"
      :append-to-body="true"
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
            <span :style="{width:'210px'}" class="programName">{{menteeDetail.wxId}}</span>
          </el-form-item>
          <el-form-item label="姓名（拼音）：" prop="realName">
            <el-input :style="{width:'230px'}" v-model="menteeDetail.realName" maxlength="99"></el-input>
          </el-form-item>
          <!-- 合同上姓名 -->
          <el-form-item label="姓名（中文/法定名）：" prop="chiName">
            <el-input :style="{width:'230px'}" v-model="menteeDetail.chiName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-select
              :style="{width:'230px'}"
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
            <el-input :style="{width:'230px'}" v-model="menteeDetail.email" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="学校（高中）：" prop="">
            <el-select
              :style="{width:'230px'}"
              v-model="menteeDetail.highSchool"
              filterable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in highSchool"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学校（大学）：" prop="school">
            <!-- <el-input v-model="menteeDetail.school"></el-input> -->
            <el-select
              :style="{width:'230px'}"
              v-model="menteeDetail.school"
              filterable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in schoolList"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道来源">
            <el-input
              :style="{width:'230px'}"
              v-model="menteeDetail.sourceFromName"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="学历：" prop="degree">
            <el-select
              :style="{width:'230px'}"
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
              :style="{width:'230px'}"
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
              :style="{width:'230px'}"
              v-model="menteeDetail.telephone"
              :controls="false"
              size="mini"
            ></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div class="create-cant-program-model">
        <div class="program-model-title">Transition</div>
        <el-form
          :inline="true"
          size="mini"
          :model="transition"
          :rules="rulesig"
          ref="transition"
          label-width="180px"
        >
          <div class="create-cant-program-model components-model">
            <div class="program-model-title">父母情况</div>
            <el-form-item label="职业：" prop="parentJob">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.parentJob"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明公司、职位；  没有，填无。"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="性格类型：" prop="parentPersonality">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.parentPersonality"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明  没有，填无。"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="父母对小孩的期望：" prop="parentExpectation">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.parentExpectation"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="对小孩人生的介入程度：" prop="parentControl">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.parentControl"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="购买力：" prop="parentPurchasingPower">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.parentPurchasingPower"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
          <div class="create-cant-program-model components-model">
            <div class="program-model-title">学生情况</div>
            <el-form-item label="对行业的了解程度：" prop="menteeIndustryLevel">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.menteeIndustryLevel"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="学生心理状态：" prop="menteeMentality">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.menteeMentality"
                :autosize="{ minRows: 3}"
                placeholder="属于佛系还是相对比较积极的状态，or出现极端心理问题请阐述"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="需要后期综合注意的点：" prop="notice">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                v-model="transition.notice"
                :autosize="{ minRows: 3}"
                placeholder="老师风格偏好，学生当前申请的进度和资源，付款一半上课不能超过XX节..."
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="programId">
        <div class="program-model-title">基础项目信息</div>
        <el-form
          :inline="true"
          size="mini"
          :model="baseProgram"
          :rules="rulesig"
          ref="baseProgram"
          label-width="180px"
        >
          <el-form-item label="基础项目名">
            <span
              :style="{width:'210px'}"
              class="programName w80"
              :title="baseProgram.programName"
            >{{baseProgram.programName}}</span>
          </el-form-item>
          <el-form-item label="官方价格">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{'￥' + (baseProgram.basePriceCny||'无') + '; $' + (baseProgram.basePriceUsd||'无')}}</span>
          </el-form-item>
          <el-form-item label="项目定价货币类型">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.currencyType == 'usd' ? '美金($)' : '人民币(￥)'}}</span>
          </el-form-item>
          <el-form-item label="价格备注">
            <el-input
              :style="{width:'230px'}"
              v-model="baseProgram.programPriceNote"
              maxlength="99"
            ></el-input>
          </el-form-item>
          <el-form-item label="基础项目价格(￥)" prop>
            <span
              :style="{width:'210px'}"
              class="programName"
              v-if="baseProgram.currencyType === 'usd'"
            >{{baseProgram.priceCny}}</span>
            <el-input :style="{width:'230px'}" v-model="baseProgram.priceCny" @input="basicCny()" v-else></el-input>
          </el-form-item>
          <el-form-item label="项目KPI权重">
            <span
              :style="{width:'210px'}"
              class="programName w80"
              :title="baseProgram.programWeight"
            >{{baseProgram.programWeight}}</span>
          </el-form-item>
          <!-- <el-form-item label="基础项目价格($)">
            <span
              :style="{width:'210px'}"
              class="programName"
              v-if="baseProgram.currencyType !== 'usd'"
            >{{baseProgram.priceUsd}}</span>
            <el-input :style="{width:'230px'}" v-model="baseProgram.priceUsd" @input="basicUsd()" v-else></el-input>
          </el-form-item> -->
          <el-form-item
            label="Strategist"
            prop="strategist"
            v-if="baseProgram.signVip == 'Strategist' || baseProgram.signVip == 'ALL'"
          >
            <el-select
              :style="{width:'230px'}"
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
            v-if="baseProgram.signVip == 'Program_Manager' || baseProgram.signVip == 'ALL'"
          >
            <el-select
              :style="{width:'230px'}"
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
          </el-form-item>
          <el-form-item label="行业导师一对一课时数" prop="mentorHour">
            <span
              :style="{width:'210px'}"
              class="programName"
              v-if="baseProgram.mentorHour == -1"
            >不限</span>
            <el-input-number
              v-else
              :style="{width:'230px'}"
              v-model="baseProgram.mentorHour"
              :controls="false"
              size="mini"
              :min="0"
              :max="60"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Strategist Sessions（旧）" prop="leadStrategistHour">
            <span
              :style="{width:'210px'}"
              class="programName"
              v-if="baseProgram.leadStrategistHour == -1"
            >不限</span>
            <el-input-number
              v-else
              :style="{width:'230px'}"
              v-model="baseProgram.leadStrategistHour"
              :controls="false"
              :min="0"
              :max="60"
            ></el-input-number>
          </el-form-item>
          <el-form-item  label-width="250px" label="1对多Office Hour" prop="officeHourStrategistSession">
            <span
              :style="{width:'140px'}"
              class="programName"
              v-if="baseProgram.officeHourStrategistSession == -1"
            >不限 次/月</span>
            <el-input-number
              v-else
              :style="{width:'125px'}"
              v-model="baseProgram.officeHourStrategistSession"
              :controls="false"
              :min="0"
              :max="60"
            ></el-input-number>  次/月
          </el-form-item>
          <el-form-item label="系列课课时" prop="seriesHour">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.seriesHour == -1 ? '不限' : baseProgram.seriesHour) || '无'}}</span>
          </el-form-item>
          <el-form-item label="Jerry一对一" prop="jerryHour">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.jerryHour == -1 ? '不限' : baseProgram.jerryHour) || '无'}}</span>
          </el-form-item>
          <el-form-item label="Tequila Shot（旧）" prop="tequilaShotHour">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.tequilaShotHour == -1 ? '不限' : baseProgram.tequilaShotHour) || '无'}}</span>
          </el-form-item>
          <el-form-item label="Office Hour（旧）" prop="officeHour">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.officeHour == -1 ? '不限' : baseProgram.officeHour) || '无'}}</span>
          </el-form-item>
          <el-form-item label="Live Lessons（新）" prop="liveLesson">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.liveLesson == -1 ? '不限' : baseProgram.liveLesson) || '无'}}</span>
          </el-form-item>
          <el-form-item label="求职文书修改次数" prop="applicationLetterModify">
            <span

              style="width:210px;"
              class="programName"
            >{{(baseProgram.applicationLetterModify == -1 ? '不限' : baseProgram.applicationLetterModify) || '无'}}</span>
          </el-form-item>
          <el-form-item label="购买额外课时" prop="hasContinual">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.hasContinual || '无'}}</span>
          </el-form-item>
          <el-form-item label="电子书架" prop="hasEbookStore">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.hasEbookStore || '无'}}</span>
          </el-form-item>
          <el-form-item label="领衔导师" prop="seniorStrategist">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.seniorStrategist || '无'}}</span>
          </el-form-item>
          <el-form-item label="应急导师" prop="emergencyMentor">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.emergencyMentor || '无'}}</span>
          </el-form-item>
          <el-form-item label="证书主题直播课权限" prop="certificateSubjectLiveCourseAuthority">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.certificateSubjectLiveCourseAuthority || '无'}}</span>
          </el-form-item>
          <el-form-item label="专项、面试导师" prop="interviewMentor">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{baseProgram.interviewMentor || '无'}}</span>
          </el-form-item>
          <el-form-item label="优先内推" prop="priority">
            <span :style="{width:'210px'}" class="programName">{{baseProgram.priority || '无'}}</span>
          </el-form-item>
          <el-form-item label="导师数量" prop="mentorCount">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.mentorCount == -1 ? '不限' : baseProgram.mentorCount) || '无'}}</span>
          </el-form-item>
          <el-form-item label="线下小班课" prop="seminars">
            <span
              :style="{width:'210px'}"
              class="programName"
            >{{(baseProgram.seminars == -1 ? '不限' : baseProgram.seminars) || '无'}}</span>

          </el-form-item>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="internshipNum">
        <div class="program-model-title">实习项目</div>
        <el-form
          :inline="true"
          size="mini"
          :rules="rulesig"
          ref="internshipProgram"
          label-width="180px"
        >
          <el-input v-model="internshipPrice0" style="display:none"></el-input>
          <el-input v-model="internshipPrice1" style="display:none"></el-input>
          <el-input v-model="internshipPrice2" style="display:none"></el-input>
          <el-input v-model="internshipPrice3" style="display:none"></el-input>
          <el-input v-model="internshipPrice4" style="display:none"></el-input>
          <el-input v-model="internshipPrice5" style="display:none"></el-input>
          <el-input v-model="internshipPrice6" style="display:none"></el-input>
          <el-input v-model="internshipPrice7" style="display:none"></el-input>
          <el-input v-model="internshipPrice8" style="display:none"></el-input>
          <div class="internshipIArr" v-for="(item,index) in internshipNum" :key="index">
            <el-form-item :label="'实习单位('+item + ')'">
              <el-cascader
                expand-trigger="hover"
                :options="internshipUnitList"
                v-model="internshipProgram[item-1].internshipUnit"
                style="width: 230px;"
                filterable
                :props="internshipProps"
                @change="changeInternshipId(internshipProgram[item-1].internshipUnit,item-1 )"
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="'实习时长'">
              <el-select
                v-model="internshipProgram[item-1].internshipDuration"
                placeholder="请选择实习时长"
                :style="{width:'230px'}"
                :disabled="true"
              >
                <el-option
                  v-for="item in internship_duration"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'实习方式'">
              <el-select
                v-model="internshipProgram[item-1].internshipLocation"
                placeholder="请选择实习方式"
                :style="{width:'210px'}"
                :disabled="true"
              >
                <el-option
                  v-for="item in internship_location_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`官方价格(${internshipProgram[item-1].priceType == 'usd'?'美金':'人民币'}):`">
              <span
                :style="{width:'210px'}"
                class="programName"
              >VIP价格: <span style="color:#409EFF">{{internshipProgram[item-1].VIpPriceInit}}</span> / 原价: <span style="color:#c32e47">{{internshipProgram[item-1].nonVIpPriceInit}}</span></span>
            </el-form-item>
            <el-form-item :label="`实习价格(${internshipProgram[item-1].priceType == 'usd'?'人民币':'美金'}):`">
              <span
                :style="{width:'210px'}"
                class="programName"
              >VIP价格: <span style="color:#409EFF">{{internshipProgram[item-1].VIpPriceInit2 || '?'}}</span> / 原价: <span style="color:#c32e47">{{internshipProgram[item-1].nonVIpPriceInit2 || '?'}}</span></span>
            </el-form-item>
            <el-form-item label="实习价格(￥)" prop>
              <span
                class="programName"
                :style="{width:'190px'}"
              >{{internshipProgram[item-1].priceCny}}</span>
            </el-form-item>
            <el-form-item label="安排方式" :prop="'internshipFlag' + index" >
              <el-radio-group :style="{width:'230px'}" v-model="internshipProgram[item-1].internshipFlag">
                <el-radio :label="0">直接安排</el-radio>
                <el-radio :label="1">内推</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实习合同模板" :prop="'contract' + index" v-if="signOnline">
              <el-select
                v-model="internshipProgram[item-1].contract"
                filterable
                placeholder="请选择"
                :style="{width:'230px'}"
              >
                <el-option
                  v-for="a in interShipContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实习备注" >
              <el-input
                :style="{width:'650px'}"
                v-model="internshipProgram[item-1].note"
                maxlength="99"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="oralNum">
        <div class="program-model-title">口语项目</div>
        <el-form :inline="true" size="mini"  :rules="rulesig" ref="oralProgram" label-width="180px">
          <el-input v-model="oralPrice0" style="display:none"></el-input>
          <el-input v-model="oralPrice1" style="display:none"></el-input>
          <div class="internshipIArr" v-for="(item,index) in oralNum" :key="index">
            <el-form-item :label="'口语项目('+item + ')'">
              <el-select
                v-model="oralProgram[item-1].programId"
                filterable
                placeholder="请选择口语项目"
                :style="{width:'230px'}"
                @change="changeOption(oralProgram[item-1].programId,item-1)"
              >
                <el-option
                  v-for="item in oralList"
                  :key="item.programId"
                  :label="item.programName"
                  :value="item.programId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'口语导师一对一课时数'">
              <span
                class="programName"
                :style="{width:'210px'}"
              >{{oralProgram[item-1].oralLessonHour}}</span>
            </el-form-item>
            <el-form-item :label="'系列课时数'">
              <span class="programName" :style="{width:'210px'}">{{oralProgram[item-1].seriesHour}}</span>
            </el-form-item>
            <el-form-item label="官方价格($):">
              <span
                :style="{width:'210px'}"
                class="programName"
              >{{oralProgram[item-1].basePriceUsd}}</span>
            </el-form-item>
            <el-form-item label="口语价格(￥)" prop>
              <span class="programName" :style="{width:'210px'}">{{oralProgram[item-1].priceCny}}</span>
            </el-form-item>
            <el-form-item label="口语项目周期" >
              <el-select
                :style="{width:'230px'}"
                v-model="oralProgram[item-1].oralPeriod"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [{itemName:'3个月',itemValue:'3个月'},{itemName:'6个月',itemValue:'6个月'},{itemName:'与VIP项目结束时间一致',itemValue:'与VIP项目结束时间一致'}]"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="口语结束日期" >
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="oralProgram[item-1].endDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Strategist">
              <el-select
                :style="{width:'230px'}"
                v-model="oralProgram[item-1].strategist"
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
            <el-form-item label="Program Manager">
              <el-select
                :style="{width:'230px'}"
                v-model="oralProgram[item-1].services"
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
            </el-form-item>
            <el-form-item label="口语合同模板" prop="" v-if="signOnline">
              <el-select
                v-model="oralProgram[item-1].contract"
                filterable
                placeholder="请选择"
                :style="{width:'230px'}"
              >
                <el-option
                  v-for="a in oralProgramContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="口语备注">
              <el-input :style="{width:'650px'}" v-model="oralProgram[item-1].note" maxlength="99"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="cfaNum">
        <div class="program-model-title">CFA项目</div>
        <el-form
          :inline="true"
          size="mini"
          :rules="rulesig"
          ref="cfaProgram"
          label-width="180px"
          :model="cfaProgram"
        >
          <el-input v-model="cfaPrice0" style="display:none"></el-input>
          <div class="internshipIArr">
            <el-form-item :label="'CFA项目'" prop="programId">
              <el-select
                v-model="cfaProgram.programId"
                filterable
                placeholder="请选择CFA项目"
                :style="{width:'230px'}"
                @change="changeCFAOption(cfaProgram.programId)"
              >
                <el-option
                  v-for="item in cfaList"
                  :key="item.programId"
                  :label="item.programName"
                  :value="item.programId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目周期:">
              <span
                :style="{width:'210px'}"
                class="programName"
              >{{cfaProgram.period}}-{{cfaProgram.periodUnit}}</span>
            </el-form-item>
            <el-form-item label="CFA价格(￥)" prop>
              <span class="programName" :style="{width:'210px'}">{{cfaProgram.priceCny}}</span>
            </el-form-item>
            <el-form-item label="官方价格($):">
              <span :style="{width:'210px'}" class="programName">{{cfaProgram.basePriceUsd}}</span>
            </el-form-item>
            <el-form-item label="奖牌数量:">
              <span :style="{width:'210px'}" class="programName">{{cfaProgram.medalTokens}}</span>
            </el-form-item>
            <el-form-item label="CFA起始日期" prop="startDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="cfaProgram.startDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="CFA结束日期" prop="endDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="cfaProgram.endDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="CFA延长服务日期" prop="extendedEndDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="cfaProgram.extendedEndDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="CFA合同模板" prop="" v-if="signOnline">
              <el-select
                v-model="cfaProgram.contract"
                filterable
                placeholder="请选择"
                :style="{width:'210px'}"
              >
                <el-option
                  v-for="a in cfaProgramContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="CFA备注">
              <el-input :style="{width:'650px'}" v-model="cfaProgram.note" maxlength="99"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="financeNum">
        <div class="program-model-title">财商项目</div>
        <el-form
          :inline="true"
          size="mini"
          :rules="rulesig"
          ref="financeProgram"
          label-width="180px"
          :model="financeProgram"
        >
          <el-input v-model="financePrice0" style="display:none"></el-input>
          <div class="internshipIArr">
            <el-form-item :label="'财商项目'" prop="programId">
              <el-select
                v-model="financeProgram.programId"
                filterable
                placeholder="请选择财商项目"
                :style="{width:'230px'}"
                @change="changeFinanceOption(financeProgram.programId)"
              >
                <el-option
                  v-for="item in financeList"
                  :key="item.programId"
                  :label="item.programName"
                  :value="item.programId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
            label="Strategist"
            prop="strategist"
            v-if="financeProgram.signVip == 'Strategist' || financeProgram.signVip == 'ALL'"
          >
            <el-select
              :style="{width:'230px'}"
              v-model="financeProgram.strategist"
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
            v-if="financeProgram.signVip == 'Program_Manager' || financeProgram.signVip == 'ALL'"
          >
            <el-select
              :style="{width:'230px'}"
              v-model="financeProgram.services"
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
          </el-form-item>
            <el-form-item label="项目周期:">
              <span
                :style="{width:'210px'}"
                class="programName"
              >{{financeProgram.period}}-{{financeProgram.periodUnit}}</span>
            </el-form-item>
            <el-form-item label="财商价格(￥)" prop>
              <span class="programName" :style="{width:'210px'}">{{financeProgram.priceCny}}</span>
            </el-form-item>
            <el-form-item label="官方价格($):">
              <span :style="{width:'210px'}" class="programName">{{financeProgram.basePriceUsd}}</span>
            </el-form-item>
            <el-form-item label="财商导师一对一课时数" prop="mentorHour">
            <span
                :style="{width:'210px'}"
                class="programName"
                v-if="financeProgram.financeHour == -1"
              >不限</span>
              <el-input-number
                v-else
                :style="{width:'230px'}"
                v-model="financeProgram.financeHour"
                :controls="false"
                size="mini"
                :min="0"
                :max="60"
              ></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="奖牌数量:">
              <span :style="{width:'210px'}" class="programName">{{financeProgram.medalTokens}}</span>
            </el-form-item> -->
            <el-form-item label="财商起始日期" prop="startDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="financeProgram.startDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="财商结束日期" prop="endDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="financeProgram.endDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="财商延长服务日期" prop="extendedEndDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="financeProgram.extendedEndDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="财商合同模板" prop="" v-if="signOnline">
              <el-select
                v-model="financeProgram.contract"
                filterable
                placeholder="请选择"
                :style="{width:'210px'}"
              >
                <el-option
                  v-for="a in financeProgramContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="财商备注">
              <el-input :style="{width:'650px'}" v-model="financeProgram.note" maxlength="99"></el-input>
            </el-form-item>

          </div>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="tutoringNum">
        <div class="program-model-title">课业辅导项目</div>
        <el-form
          :inline="true"
          size="mini"
          :rules="rulesig"
          ref="tutoringProgram"
          label-width="180px"
          :model="tutoringProgram"
        >
          <el-input v-model="tutoringPrice0" style="display:none"></el-input>
          <div class="internshipIArr">
            <el-form-item :label="'课业辅导项目'" prop="programId">
              <el-select
                v-model="tutoringProgram.programId"
                filterable
                placeholder="请选择课业辅导项目"
                :style="{width:'230px'}"
                @change="changeTutoringOption(tutoringProgram.programId)"
              >
                <el-option
                  v-for="item in tutoringList"
                  :key="item.programId"
                  :label="item.programName"
                  :value="item.programId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
            label="Strategist"
            prop="strategist"
            v-if="tutoringProgram.signVip == 'Strategist' || tutoringProgram.signVip == 'ALL'"
          >
            <el-select
              :style="{width:'230px'}"
              v-model="tutoringProgram.strategist"
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
            v-if="tutoringProgram.signVip == 'Program_Manager' || tutoringProgram.signVip == 'ALL'"
          >
            <el-select
              :style="{width:'230px'}"
              v-model="tutoringProgram.services"
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
          </el-form-item>
            <el-form-item label="项目周期:">
              <span
                :style="{width:'210px'}"
                class="programName"
              >{{tutoringProgram.period}}-{{tutoringProgram.periodUnit}}</span>
            </el-form-item>
            <el-form-item label="课业辅导价格(￥)" prop>
              <span class="programName" :style="{width:'210px'}">{{tutoringProgram.priceCny}}</span>
            </el-form-item>
            <el-form-item label="官方价格($):">
              <span :style="{width:'210px'}" class="programName">{{tutoringProgram.basePriceUsd}}</span>
            </el-form-item>
            <el-form-item label="课业辅导课时数:">
              <span :style="{width:'210px'}" class="programName">{{tutoringProgram.tutoringMentorHour}}</span>
            </el-form-item>
            <!-- <el-form-item label="奖牌数量:">
              <span :style="{width:'210px'}" class="programName">{{tutoringProgram.medalTokens}}</span>
            </el-form-item> -->
            <el-form-item label="课业辅导起始日期" prop="startDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="tutoringProgram.startDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="课业辅导结束日期" prop="endDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="tutoringProgram.endDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="课业辅导延长服务日期" prop="extendedEndDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="tutoringProgram.extendedEndDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="课业辅导合同模板" prop="" v-if="signOnline">
              <el-select
                v-model="tutoringProgram.contract"
                filterable
                placeholder="请选择"
                :style="{width:'230px'}"
              >
                <el-option
                  v-for="a in tutoringProgramContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课业辅导备注">
              <el-input :style="{width:'650px'}" v-model="tutoringProgram.note" maxlength="99"></el-input>
            </el-form-item>

          </div>
        </el-form>
      </div>
      <div class="create-cant-program-model" v-if="graduateNum">
        <div class="program-model-title">申研项目</div>
        <el-form
          :inline="true"
          size="mini"
          :rules="rulesig"
          ref="graduateProgram"
          label-width="180px"
          :model="graduateProgram"
        >
          <el-input v-model="graduatePrice0" style="display:none"></el-input>
          <div class="internshipIArr">
            <el-form-item :label="'申研项目'" prop="programId">
              <el-select
                v-model="graduateProgram.programId"
                filterable
                placeholder="请选择申研项目"
                :style="{width:'230px'}"
                @change="changeGraduateOption(graduateProgram.programId)"
              >
                <el-option
                  v-for="item in graduateList"
                  :key="item.programId"
                  :label="item.programName"
                  :value="item.programId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目周期:">
              <span
                :style="{width:'210px'}"
                class="programName"
              >{{graduateProgram.period}}-{{graduateProgram.periodUnit}}</span>
            </el-form-item>
            <el-form-item label="申研价格(￥)" prop>
              <span class="programName" :style="{width:'210px'}">{{graduateProgram.priceCny}}</span>
            </el-form-item>
            <el-form-item label="官方价格($):">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.basePriceUsd}}</span>
            </el-form-item>
            <el-form-item label="Live lesson:">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.liveLesson == -1?'不限':graduateProgram.liveLesson}}</span>
            </el-form-item>
            <el-form-item label="一对一导师课时:">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.mentorHour == -1?'不限':graduateProgram.mentorHour}}</span>
            </el-form-item>
            <el-form-item label="申请年份:" prop="gpApplyYear">
              <el-date-picker
                :style="{width:'230px'}"
                v-model="graduateProgram.gpApplyYear"
                type="year"
                value-format="yyyy"
                placeholder="选择年">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="申研申请季:" prop="gpApplySeason">
              <el-select :style="{width:'230px'}" v-model="graduateProgram.gpApplySeason" clearable placeholder="请选择">
                <el-option
                  v-for="item in [{label:'春',value:'春'},{label:'秋',value:'秋'},{label:'春秋',value:'春秋'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请国家:" prop="gpApplyCountry">
              <el-select :style="{width:'230px'}" clearable v-model="graduateProgram.gpApplyCountry" multiple placeholder="请选择">
                <el-option
                  v-for="item in country"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="背景提升数量:">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.gpBackgroundPromotionQuantity}}</span>
            </el-form-item>
            <el-form-item label="背景提升价格(￥):">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.gpBackgroundPromotionPriceCny}}</span>
            </el-form-item>
            <el-form-item label="背景提升价格($):">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.gpBackgroundPromotionPriceUsd}}</span>
            </el-form-item>
            <el-form-item label="专业大类数量:">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.gpMajorQuantity}}</span>
            </el-form-item>
            <el-form-item label="项目申请数量:">
              <span :style="{width:'210px'}" class="programName">{{graduateProgram.gpProgramApplyQuantity}}</span>
            </el-form-item>
            <el-form-item label="申研起始日期" prop="startDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="graduateProgram.startDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="申研结束日期" prop="endDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="graduateProgram.endDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="申研延长服务日期" prop="extendedEndDate">
              <el-date-picker
                type="date"
                :style="{width:'230px'}"
                placeholder="选择日期"
                v-model="graduateProgram.extendedEndDate"
                style="width: 80%;"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="申研合同模板" prop="" v-if="signOnline">
              <el-select
                v-model="graduateProgram.contract"
                filterable
                placeholder="请选择"
                :style="{width:'210px'}"
              >
                <el-option
                  v-for="a in graduateProgramContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申研备注">
              <el-input :style="{width:'650px'}" v-model="graduateProgram.note" maxlength="99"></el-input>
            </el-form-item>

          </div>
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
              :style="{width:'230px'}"
              placeholder="选择日期"
              v-model="collect.startDate"
              style="width: 80%;"
              value-format="yyyy年MM月dd日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同结束日期" prop="endDate">
            <el-date-picker
              type="date"
              :style="{width:'230px'}"
              placeholder="选择日期"
              v-model="collect.endDate"
              style="width: 80%;"
              value-format="yyyy年MM月dd日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="主联系人" prop="contact1">
            <el-select
              v-model="collect.contact1"
              :style="{width:'230px'}"
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
              :style="{width:'230px'}"
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
          <el-form-item label="原合同总金额">
            <el-input :style="{width:'230px'}" v-model="collect.totalPriceCny" style="display:none"></el-input>
            <span class="programName"  v-if="collect.totalPriceUsd" :style="{width:'210px'}">{{Math.round(collect.totalPriceUsd*collect.rate).toFixed(1)}}(￥) / {{collect.totalPriceUsd}}($)</span>
            <span class="programName"  v-else :style="{width:'210px'}">{{Math.round(baseProgram.basePriceUsd*collect.rate).toFixed(1)}}(￥) / {{baseProgram.basePriceUsd}}($)</span>
          </el-form-item>
          <el-form-item label="折后合同总金额">
            <el-input :style="{width:'230px'}"  v-model="collect.totalPriceCny" style="display:none"></el-input>
            <span class="programName" v-if="collect.totalPriceUsd" :style="{width:'210px'}">{{Math.round(collect.totalPriceUsd*supplementary.discountNum*collect.rate).toFixed(1)}}(￥) / {{collect.totalPriceUsd*supplementary.discountNum}}($)</span>
            <span class="programName" v-else :style="{width:'210px'}">{{Math.round(baseProgram.basePriceUsd*supplementary.discountNum*collect.rate).toFixed(1)}}(￥) / {{baseProgram.basePriceUsd*supplementary.discountNum}}($)</span>
          </el-form-item>
          <el-form-item label="汇率" prop="rate">
              <!-- @input="basicRate()" -->
            <el-input
              :style="{width:'230px'}"
              v-model="collect.rate"
              :placeholder="'美元合理汇率不低于：'+extentRate"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="priceOff || (collect.rate && collect.rate < extentRate)"
            label="折扣说明："
            prop="discountInfo"
          >
            <el-input :style="{width:'650px'}" v-model="collect.discountInfo"></el-input>
          </el-form-item>
          <!-- <el-form-item label="合同总金额(￥)">
            <el-input :style="{width:'230px'}" v-model="totalPriceCny" style="display:none"></el-input>
            <span class="programName" :style="{width:'210px'}">{{collect.totalPriceCny}}</span>
          </el-form-item>
          <el-form-item label="合同总金额($)">
            <el-input v-model="totalPriceUsd" style="display:none"></el-input>
            <span class="programName" :style="{width:'210px'}">{{collect.totalPriceUsd}}</span>
          </el-form-item> -->

          <el-form-item label="订单类型">
            <el-select
              v-model="collect.orderType"
              filterable
              placeholder="请选择订单类型"
              :style="{width:'230px'}"
            >
              <el-option
                v-for="item in [{key:'0',value:'普通订单'},{key:'1',value:'节假日订单'}]"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

        <!-- <el-form-item label="option是否VIP同事推荐" prop="vipRecommendStatus">
          <el-select
            :style="{width:'230px'}"
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
            :style="{width:'230px'}"
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

        <el-form-item label="Pretalk" v-if="pretalkList.length > 0" >
          <el-select
            :style="{width:'230px'}"
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
            :style="{width:'230px'}"
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
        <el-form-item label="签约日期" prop="signDate" v-if="!signOnline">
          <el-date-picker
            :style="{width:'230px'}"
            type="date"
            placeholder="选择日期"
            v-model="collect.signDate"
            value-format="yyyy年MM月dd日"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="合同模板" prop="contract" v-if="signOnline">
          <el-select
            v-model="collect.contract"
            filterable
            placeholder="请选择"
            :style="{width:'230px'}"
          >
            <el-option
              v-for="item in contractList"
              :key="item.pkId"
              :label="item.contractName"
              :value="item.contractTitle + '&&&' + item.contractContent"
            ></el-option>
          </el-select>
        </el-form-item> -->
        </el-form>
      </div>
      <!-- <div class="create-cant-program-model ">
        <div class="program-model-title">补充协议</div>
        <el-form
          :inline="true"
          size="mini"
          :model="supplementary"
          :rules="rulesig"
          ref="supplementary"
          label-width="180px"
        >
          <el-checkbox-group style="margin-bottom:20px" @change="changeCheckBox()"  v-model="checkList">
            <el-checkbox v-for="(item,i) in order_supplementary_type" :disabled="(internshipNum <= 0 && item.itemName == 'Specify实习')" :key="i" :label="item.itemName + '补充协议'" ></el-checkbox>
          </el-checkbox-group>
          <div v-for="(item,i) in order_supplementary_type" :key="i">
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '礼品'">
              <div class="program-model-title">礼品补充协议</div>
              <div class="" >
                <el-form-item label="礼品补充协议"  prop="pkId">
                  <el-select
                    v-model="supplementary.pkId"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="全部付清日期"  prop="payInFullDate">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '折扣'">
              <div class="program-model-title">折扣补充协议</div>
              <div class="">
                <el-form-item label="折扣补充协议"  prop="pkId2">
                  <el-select
                    v-model="supplementary.pkId2"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList2"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="折扣比例" prop="discountRate">
                  <el-select @change="changeDiscount()" :style="{width:'230px'}" v-model="supplementary.discountRate" clearable placeholder="请选择">
                    <el-option
                      v-for="item in discountRateList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="全部付清日期"  prop="payInFullDate2">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate2"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == 'Specify实习'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId3">
                  <el-select
                    v-model="supplementary.pkId3"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList3"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '实习补差价'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId4">
                  <el-select
                    v-model="supplementary.pkId4"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList4"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '不可抗力/不能继续提供服务的情况'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId5">
                  <el-select
                    v-model="supplementary.pkId5"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList5"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '关于实习内容的情况'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId6">
                  <el-select
                    v-model="supplementary.pkId6"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList6"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="实习单位官网："  prop="internshipWebsite">
                  <el-input :style="{width:'230px'}" v-model="supplementary.internshipWebsite"   ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '关于形式合同的补充说明'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId7">
                  <el-select
                    v-model="supplementary.pkId7"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList7"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="形式合同名称:"  prop="formalismContractName">
                  <el-input :style="{width:'230px'}" v-model="supplementary.formalismContractName"   ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '不可实名宣传'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId8">
                  <el-select
                    v-model="supplementary.pkId8"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList8"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠TequilaShot'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId9">
                  <el-select
                    v-model="supplementary.pkId9"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList9"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="截止签约日期"  prop="payInFullDate6">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate6"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="赠品价值(美金非礼品)："  prop="excessPriceUsd">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.excessPriceUsd"  :controls="false" ></el-input-number>
                </el-form-item>
                <el-form-item label="赠送录播系列课："  prop="excessSeriesHour">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.excessSeriesHour"  :controls="false" ></el-input-number>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠一对一'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId10">
                  <el-select
                    v-model="supplementary.pkId10"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList10"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="截止签约日期"  prop="payInFullDate3">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate3"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="一对一额外课时："  prop="excessMentorHour">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.excessMentorHour"  :controls="false" ></el-input-number>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠时长 (常规)'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId11">
                  <el-select
                    v-model="supplementary.pkId11"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList11"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="截止签约日期"  prop="payInFullDate5">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate5"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item :label="'延长月数'"  prop="excessTimeName">
                  <el-select
                    v-model="supplementary.excessTimeName"
                    filterable
                    placeholder="请选择时长"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in excessTimeNameList"
                      :key="item.itemValue"
                      :label="item.itemName"
                      :value="item.itemValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠Jerry一对一'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId12">
                  <el-select
                    v-model="supplementary.pkId12"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList12"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="截止签约付费日期"  prop="payInFullDate4">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate4"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="可替换Jerry一对一课时："  prop="substituteMentorHour">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.substituteMentorHour"  :controls="false" ></el-input-number>
                </el-form-item>
              </div>
            </div>
            <div class="create-cant-program-model create-cant-program-model2" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '分期'">
              <div class="program-model-title">{{item.itemName}}补充协议</div>
              <div class="">
                <el-form-item :label="'协议模板'"  prop="pkId13">
                  <el-select
                    v-model="supplementary.pkId13"
                    filterable
                    placeholder="请选择模板"
                    :style="{width:'230px'}"
                  >
                    <el-option
                      v-for="item in templateList13"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.pkId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="首款（美金）"  prop="depositUsd">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.depositUsd"  :controls="false" ></el-input-number>
                </el-form-item>
                <el-form-item :label="'首款（人民币）'">
                  <span class="programName" :style="{width:'210px'}">{{supplementary.depositUsd * collect.rate || '空'}}</span>
                </el-form-item>
                <el-form-item label="全部付清日期"  prop="payInFullDate7">
                  <el-date-picker
                    :style="{width:'230px'}"
                    type="date"
                    placeholder="选择日期"
                    v-model="supplementary.payInFullDate7"
                    value-format="yyyy年MM月dd日"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="尾款（美金）"  prop="retainageUsd">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.retainageUsd"  :controls="false" ></el-input-number>
                </el-form-item>
                <el-form-item :label="'尾款（人民币）'">
                  <span class="programName" :style="{width:'210px'}">{{supplementary.retainageUsd * collect.rate || '空'}}</span>
                </el-form-item>
                <el-form-item label="行业一对一临时课时"  prop="tempMentorHour2">
                  <el-input-number :style="{width:'230px'}" v-model="supplementary.tempMentorHour2"  :controls="false" ></el-input-number>
                </el-form-item>
              </div>
            </div>
          </div>
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
              :style="{width:'230px'}"
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
              <el-input :style="{width: '230px'}" v-model="gift.recipientName" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="收货人电话" prop="recipientPhone">
              <el-input :style="{width: '230px'}" v-model="gift.recipientPhone" :maxlength="100"></el-input>
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
                :label="item.giftName +' (库存:' + item.inventory + ')[价格：￥'+item.giftPrice +']'"
                :disabled="!item.inventory"
                :value="item.giftId + '&&' + item.giftName + '&&' + item.giftPrice"
              ></el-option>
            </el-select>
            <el-input-number :min="0" :style="{width:'100px',margin:'0px 10px'}" v-model="gift.giftNum"></el-input-number>
            <el-button type="warning" plain round @click="deleteGift(i)" class="el-icon-delete"></el-button>
          </el-form-item>
        </el-form>
      </div> -->
      <div class="create-cant-program-model" v-if="signOnline">
        <div class="program-model-title">委托确认书</div>
        <el-form
          :inline="true"
          size="mini"
          :model="entrust"
          :rules="rulesig"
          ref="entrust"
          label-width="180px"
        >
          <el-checkbox-group v-model="entrust.checkList">
            <el-form-item label="" prop="">
              <el-checkbox label="allograph">本合同是否存在代签：</el-checkbox>
            </el-form-item>
            <br>
            <div v-if="entrust.checkList.indexOf('allograph')>-1">
              <el-form-item label="代签人姓名" prop="allographName" label-width="160px">
                <el-input :style="{width: '230px'}" v-model="entrust.allographName" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="与被代签人关系" prop="relationship">
                <el-select
                  v-model="entrust.relationship"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择"
                  :style="{width:'230px'}"
                >
                  <el-option
                    v-for="item in relationshipList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否取得被代签人授权" prop="">
                <span class="programName" :style="{width:'210px'}">是</span>
              </el-form-item>
            </div>
            <br>
            <el-form-item label="" prop="">
              <el-checkbox label="paying">本合同是否存在费用代付：</el-checkbox>
            </el-form-item>
            <div v-if="entrust.checkList.indexOf('paying')>-1">
              <el-form-item label="代付人姓名" prop="payingName" label-width="160px">
                <el-input :style="{width: '230px'}" v-model="entrust.payingName" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="代付金额" prop="entrustPrice">
                <el-input :style="{width: '230px'}" v-model="entrust.entrustPrice" :maxlength="100"></el-input>
              </el-form-item>
            </div>
          </el-checkbox-group>
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
              :style="{width:'230px'}"
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
                :style="{width:'230px'}"
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
              <el-input :style="{width: '230px'}" v-model="invoice.invoiceTitle" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="税号/身份证号" prop>
              <el-input :style="{width: '230px'}" v-model="invoice.invoiceAccount" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="发票地址" prop>
              <el-input :style="{width: '230px'}" v-model="invoice.invoiceAddr" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="发票电话" prop>
              <el-input :style="{width: '230px'}" v-model="invoice.invoicePhone" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="开户行" prop>
              <el-input :style="{width: '230px'}" v-model="invoice.invoiceBank" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="开户行账号" prop>
              <el-input
                :style="{width: '230px'}"
                v-model="invoice.invoiceBankAccount"
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <br />
            <el-form-item label="收货人名" prop>
              <el-input :style="{width: '230px'}" v-model="invoice.recipientName" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="收货人电话" prop>
              <el-input :style="{width: '230px'}" v-model="invoice.recipientPhone" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="收货人地址" prop>
              <el-input :style="{width: '650px'}" v-model="invoice.recipientAddr" :maxlength="100"></el-input>
            </el-form-item>
            <!-- <el-form-item label="备注" prop="">
              <el-input :style="{width: '650px'}" v-model="invoice.remark" :maxlength="199"></el-input>
            </el-form-item>-->
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="signDetailClose">取 消</el-button>
        <!-- <el-button @click="saveOrderData" v-if="programId">暂 存</el-button> -->
        <el-button type="primary" v-if="!signOnline" @click="createURL">下一步</el-button>
        <el-button v-show="signOnline" v-else type="primary" @click="createURL2">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 合同审查及修改 -->
    <el-dialog
      title="签约信息_合同"
      :visible.sync="changePDFShow"
      width="1400px"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-card v-if="contractContent">
        <div slot="header" class="clearfix">
          <span>合同预览</span>
        </div>
        <div class="list" id="list" v-html="contractContent"></div>
      </el-card>
      <el-card class="mt20" v-if="contractContent2">
        <div slot="header" class="clearfix">
          <span>礼品补充协议预览</span>
        </div>
        <div class="list" id="list2" v-html="contractContent2"></div>
      </el-card>
      <el-card class="mt20" v-if="contractContent3">
        <div slot="header" class="clearfix">
          <span>折扣补充协议预览</span>
        </div>
        <div class="list" id="list3" v-html="contractContent3"></div>
      </el-card>
      <el-card class="mt20" v-if="contractContent4">
        <div slot="header" class="clearfix">
          <span>Specify实习补充协议预览</span>
        </div>
        <div class="list" id="list4" v-html="contractContent4"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent5">
        <div slot="header" class="clearfix">
          <span>实习补差价补充协议预览</span>
        </div>
        <div class="list" id="list5" v-html="contractContent5"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent6">
        <div slot="header" class="clearfix">
          <span>不可抗力/不能继续提供服务的情况补充协议预览</span>
        </div>
        <div class="list" id="list6" v-html="contractContent6"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent7">
        <div slot="header" class="clearfix">
          <span>关于实习内容的情况补充协议预览</span>
        </div>
        <div class="list" id="list7" v-html="contractContent7"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent8">
        <div slot="header" class="clearfix">
          <span>关于形式合同的补充说明补充协议预览</span>
        </div>
        <div class="list" id="list8" v-html="contractContent8"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent9">
        <div slot="header" class="clearfix">
          <span>不可实名宣传补充协议预览</span>
        </div>
        <div class="list" id="list9" v-html="contractContent9"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent10">
        <div slot="header" class="clearfix">
          <span>赠TequilaShot协议预览</span>
        </div>
        <div class="list" id="list10" v-html="contractContent10"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent11">
        <div slot="header" class="clearfix">
          <span>赠一对一补充协议预览</span>
        </div>
        <div class="list" id="list11" v-html="contractContent11"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent12">
        <div slot="header" class="clearfix">
          <span>赠时长（常规）补充协议预览</span>
        </div>
        <div class="list" id="list12" v-html="contractContent12"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent13">
        <div slot="header" class="clearfix">
          <span>赠Jerry一对一补充协议预览</span>
        </div>
        <div class="list" id="list13" v-html="contractContent13"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent14">
        <div slot="header" class="clearfix">
          <span>分期补充协议预览</span>
        </div>
        <div class="list" id="list14" v-html="contractContent14"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent15">
        <div slot="header" class="clearfix">
          <span>口语项目合同</span>
        </div>
        <div class="list" id="list15" v-html="contractContent15"></div>
      </el-card>

      <el-card class="mt20" v-if="contractContent16">
        <div slot="header" class="clearfix">
          <span>CFA项目合同</span>
        </div>
        <div class="list" id="list16" v-html="contractContent16"></div>
      </el-card>
      <el-card class="mt20" v-if="contractContent17">
        <div slot="header" class="clearfix">
          <span>财商项目合同</span>
        </div>
        <div class="list" id="list17" v-html="contractContent17"></div>
      </el-card>
      <el-card class="mt20" v-if="contractContent18">
        <div slot="header" class="clearfix">
          <span>申研项目合同</span>
        </div>
        <div class="list" id="list18" v-html="contractContent18"></div>
      </el-card>
      <el-card class="mt20" v-if="contractContent20">
        <div slot="header" class="clearfix">
          <span>课业辅导项目合同</span>
        </div>
        <div class="list" id="list20" v-html="contractContent20"></div>
      </el-card>
      <div v-for="(item,i) in internshipListAll" :key="i">
        <el-card class="mt20" v-if="item.contractContent">
          <div slot="header" class="clearfix">
            <span>实习项目合同{{i+1}}</span>
          </div>
          <div class="list contractContent" v-html="item.contractContent"></div>
        </el-card>
      </div>
      <el-card class="mt20" v-if="contractContent19">
        <div slot="header" class="clearfix">
          <span>订单代签代付补充协议预览</span>
        </div>
        <div class="list" id="list19" v-html="contractContent19"></div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="backSign">上一步</el-button>
        <el-button type="primary" @click="submitGG2">提交</el-button>
      </span>
    </el-dialog>
    <!-- 返佣 -->
    <Rebate
      :rebateVisible="rebateVisible"
      :signData="signSubmitData"
      @close="rebateClose"
      @backToDetail="backToDetail"
      @submit="rebateSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import apiVip from '@/api/vip.js'
import apiDic from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import Rebate from './Rebate.vue'
export default {
  mixins: [mixins],
  components: { Rebate },
  props: {
    signDetailNoBasicVisible: {
      type: Boolean,
      default: false
    },
    isKeepOrder: {
      type: Boolean,
      default: false
    },
    menteeId: {
      type: String,
      default: ''
    },
    internshipNum: {
      type: Number,
      default: 0
    },
    oralNum: {
      type: Number,
      default: 0
    },
    cfaNum: {
      type: Number,
      default: 0
    },
    financeNum: {
      type: Number,
      default: 0
    },
    tutoringNum: {
      type: Number,
      default: 0
    },
    graduateNum: {
      type: Number,
      default: 0
    },
    programId: {
      type: String,
      default: ''
    },
    vipStatus: {
      type: Boolean
    }
  },
  data: function () {
    Date.prototype.format = function (format) {
      var o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        S: this.getMilliseconds()
        // millisecond
      }

      if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)) }
      }
      return format
    }
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
    var checkVipRecommender = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('VIP推荐人不能为空'))
      } else if (value == this.collect.contact1 || value == this.collect.contact2) {
        return callback(new Error('VIP推荐人不可为任一联系人'))
      } else {
        callback()
      }
    }
    return {
      excessTimeNameList: [
        { itemName: '六个月', itemValue: 6 },
        { itemName: '十二个月', itemValue: 12 }
      ],
      width: 180,
      widthHalf: '380px',
      signOnline: true,
      defaultRate: null,
      giftList: [],
      schoolList: [],
      sex: [],
      highSchool: [],
      degree: [],
      checkList: [],
      salesList: [],
      VIPList: [],
      servicesList: [],
      vipStatusNew: false,
      order_supplementary_type: [],
      templateList: [],
      templateList2: [],
      templateList3: [],
      templateList4: [],
      templateList5: [],
      templateList6: [],
      templateList7: [],
      templateList8: [],
      templateList9: [],
      templateList10: [],
      templateList11: [],
      templateList12: [],
      templateList13: [],
      interShipContractList: [],
      oralProgramContractList: [],
      cfaProgramContractList: [],
      tutoringProgramContractList: [],
      financeProgramContractList: [],
      graduateProgramContractList: [],
      internshipListAll: [],
      pretalkList: [],
      internshipUnitNew: [],
      indexNew: null,
      // 验证
      rulesig: {
        email: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ],
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'blur' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        realName: [
          {
            required: true,
            message: '【项目（中文/法定名）】不能为空',
            trigger: 'blur'
          }
        ],
        school: [
          { required: true, message: '【学校大学】不能为空', trigger: 'blur' }
        ],
        endDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
        sourceFrom: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ],
        degree: [{ required: true, message: '请选择学历', trigger: 'blur' }],
        finishYear: [
          { required: true, message: '请选择毕业年份', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入联系号码', trigger: 'blur' }
        ],
        vipRecommendStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        vipRecommender: [{ validator: checkVipRecommender, trigger: 'blur' }],
        channelNote: [
          { max: 60, message: '备注长度为60个字符以内', trigger: 'blur' }
        ], // 渠道备注
        hasSupplementary: [{ required: true, message: '请选择项目', trigger: 'blur' }],
        supplementaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent2: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent3: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent4: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent5: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent6: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent7: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent8: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent9: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent10: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent11: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent12: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent13: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent14: [{ required: true, message: '必填', trigger: 'blur' }],
        gpApplyYear: [{ required: true, message: '必填', trigger: 'blur' }],
        gpApplySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        gpApplyCountry: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId2: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId3: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId4: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId5: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId6: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipWebsite: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId7: [{ required: true, message: '必填', trigger: 'blur' }],
        formalismContractName: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId8: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId9: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId10: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId11: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId12: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId13: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate2: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate3: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate4: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate5: [{ required: true, message: '必填', trigger: 'blur' }],
        excessSeriesHour: [{ required: true, message: '必填', trigger: 'blur' }],
        excessPriceUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate6: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDate7: [{ required: true, message: '必填', trigger: 'blur' }],
        tempMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        depositUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        retainageUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        excessTimeName: [{ required: true, message: '必填', trigger: 'blur' }],
        excessMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        tempMentorHour2: [{ required: true, message: '必填', trigger: 'blur' }],
        discountRate: [{ required: true, message: '必填', trigger: 'blur' }],
        program: [{ required: true, message: '请选择项目', trigger: 'blur' }], // 项目
        priceCny: [{ required: true, message: '请输入价格', trigger: 'blur' }], // 项目价格
        chiName: [{ required: true, message: '必填', trigger: 'blur' }],
        sex: [{ required: true, message: '必填', trigger: 'blur' }],
        totalPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ], // 项目价格
        programPriceNote: [
          { max: 60, message: '备注长度为60个字符以内', trigger: 'blur' }
        ], // 项目价格备注
        rate: [{ required: true, message: '必填', trigger: 'blur' }], // 签约日期
        signDate: [
          { required: true, message: '请选择签约日期', trigger: 'blur' }
        ], // 签约日期
        startDate: [{ required: true, message: '必填', trigger: 'blur' }], // 签约日期
        startAndEnd: [
          { required: true, message: '请选择合同有效日期', trigger: 'blur' }
        ], // 合同有效日期
        contact1: [
          { required: true, message: '请选择主联系人', trigger: 'blur' }
        ], // 主联系人
        strategist: [
          { required: true, message: '请选择全职导师', trigger: 'blur' }
        ], // 全职导师
        services: [{ required: true, message: '请选择客服', trigger: 'blur' }],
        mentorHour: [], // 行业导师一对一课时数
        leadStrategistHour: [
          // { min: 0,  message: '不能小于0', trigger: 'blur' },
          //  { type: 'number', message: '课时数必须为数字值'}
        ], // 全职导师一对一课时数
        programType: [
          { required: true, message: '请选择项目类别', trigger: 'blur' }
        ], // 项目类别
        programLevel: [
          { required: true, message: '请选择项目级别', trigger: 'blur' }
        ], // 项目级别
        signGrade: [
          { required: true, message: '请选择签约年级', trigger: 'blur' }
        ], // 签约年级
        company: [{ required: true, message: '必填', trigger: 'blur' }],
        signCompany: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag1: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag2: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag3: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag4: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag5: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag6: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag7: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag8: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipFlag9: [{ required: true, message: '必填', trigger: 'blur' }],
        contract: [{ required: true, message: '必填', trigger: 'blur' }],
        contract0: [{ required: true, message: '必填', trigger: 'blur' }],
        contract1: [{ required: true, message: '必填', trigger: 'blur' }],
        contract2: [{ required: true, message: '必填', trigger: 'blur' }],
        contract3: [{ required: true, message: '必填', trigger: 'blur' }],
        contract4: [{ required: true, message: '必填', trigger: 'blur' }],
        contract5: [{ required: true, message: '必填', trigger: 'blur' }],
        contract6: [{ required: true, message: '必填', trigger: 'blur' }],
        contract7: [{ required: true, message: '必填', trigger: 'blur' }],
        contract8: [{ required: true, message: '必填', trigger: 'blur' }],
        contract9: [{ required: true, message: '必填', trigger: 'blur' }],
        note0: [{ required: true, message: '必填', trigger: 'blur' }],
        note1: [{ required: true, message: '必填', trigger: 'blur' }],
        note2: [{ required: true, message: '必填', trigger: 'blur' }],
        note3: [{ required: true, message: '必填', trigger: 'blur' }],
        note4: [{ required: true, message: '必填', trigger: 'blur' }],
        note5: [{ required: true, message: '必填', trigger: 'blur' }],
        note6: [{ required: true, message: '必填', trigger: 'blur' }],
        note7: [{ required: true, message: '必填', trigger: 'blur' }],
        note8: [{ required: true, message: '必填', trigger: 'blur' }],
        note9: [{ required: true, message: '必填', trigger: 'blur' }],
        recipientName: [{ required: true, message: '必填', trigger: 'blur' }],
        recipientPhone: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: checkPhone,
            message: '手机号格式',
            trigger: 'blur'
          }
        ],
        recipientAddr: [{ required: true, message: '必填', trigger: 'blur' }],
        background: [{ required: true, message: '必填', trigger: 'blur' }],
        situation: [{ required: true, message: '必填', trigger: 'blur' }],
        discountInfo: [{ required: true, message: '必填', trigger: 'blur' }],
        notice: [{ required: true, message: '必填', trigger: 'blur' }],
        hasGift: [{ required: true, message: '必填', trigger: 'blur' }],
        programId: [{ required: true, message: '必填', trigger: 'blur' }],
        hasInvoice: [{ required: true, message: '必填', trigger: 'blur' }],
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
        allographName: [{ required: true, message: '必填', trigger: 'blur' }],
        relationship: [{ required: true, message: '必填', trigger: 'blur' }],
        payingName: [{ required: true, message: '必填', trigger: 'blur' }],
        entrustPrice: [{ required: true, message: '必填', trigger: 'blur' }],
        // Transition验证规则
        parentJob: [{ required: true, message: '必填', trigger: 'blur' }],
        parentPersonality: [{ required: true, message: '必填', trigger: 'blur' }],
        parentExpectation: [{ required: true, message: '必填', trigger: 'blur' }],
        parentControl: [{ required: true, message: '必填', trigger: 'blur' }],
        parentPurchasingPower: [{ required: true, message: '必填', trigger: 'blur' }],
        menteeIndustryLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        menteeMentality: [{ required: true, message: '必填', trigger: 'blur' }],
        notice: [{ required: true, message: '必填', trigger: 'blur' }]
      },

      // 学员基本信息
      menteeDetail: {
        wxId: '',
        menteeId: '',
        realName: '',
        email: '',
        sex: '',
        highSchool: '',
        school: '',
        telephone: '',
        finishYear: '',
        degree: '',
        sourceFrom: []
      },
      // Transition信息
      transition: {
        parentJob: '',
        parentPersonality: '',
        parentExpectation: '',
        parentControl: '',
        parentPurchasingPower: '',
        menteeIndustryLevel: '',
        menteeMentality: '',
        notice: ''
      },
      // 基本项目信息
      baseProgram: {
        programName: '',
        basePriceCny: '',
        basePriceUsd: '',
        currencyType: '',
        priceCny: '',
        priceUsd: '',
        programPriceNote: '',
        strategist: '',
        services: '',
        seriesHour: '',
        mentorHour: '',
        leadStrategistHour: '',
        applicationLetterModify: '',
        jerryHour: '',
        seniorStrategist: '',
        hasContinual: '',
        hasEbookStore: '',
        emergencyMentor: '',
        interviewMentor: '',
        priority: '',
        certificateSubjectLiveCourseAuthority: '',
        mentorCount: 0,
        tequilaShotHour: 0,
        seminars: 0,
        officeHour: null,
        liveLesson: 0,
        officeHourStrategistSession: 0
      },
      // 实习项目信息
      internshipProgram: [
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipFlag: '',
          internshipLocation: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: '',
          contract: ''
        }
      ],
      // 口语项目信息
      oralProgram: [
        {
          programId: '',
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          oralLessonHour: 0,
          seriesHour: 0,
          services: '',
          strategist: '',
          contractContent: ''
        },
        {
          programId: '',
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          oralLessonHour: 0,
          seriesHour: 0,
          services: '',
          strategist: '',
          contractContent: ''
        }
      ],
      // cfa项目信息
      cfaProgram: {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        note: '',
        startDate: null,
        endDate: null,
        extendedEndDate: null
      },
      // 财商项目信息
      financeProgram: {
        programId: '',
        basePriceUsd: 0,
        financeHour: 0,
        strategist: '',
        services: '',
        priceCny: 0,
        priceUsd: 0,
        note: '',
        startDate: null,
        endDate: null,
        extendedEndDate: null
      },
      tutoringProgram: {
        programId: '',
        basePriceUsd: 0,
        tutoringMentorHour: 0,
        strategist: '',
        services: '',
        priceCny: 0,
        priceUsd: 0,
        note: '',
        startDate: null,
        endDate: null,
        extendedEndDate: null
      },
      graduateProgram: {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        note: '',
        startDate: null,
        endDate: null,
        extendedEndDate: null
      },
      // 汇总信息
      collect: {
        // vipRecommendStatus: '',
        // vipRecommender: '',
        startDate: '',
        endDate: '',
        extendedEndDate: null,
        contact1: '',
        contact2: '',
        totalPriceCny: '',
        totalPriceUsd: '',
        rate: '',
        orderType: '0',
        signCompany: '',
        pretalkId: '',
        signDate: '',
        contract: '',
        discountInfo: ''
      },
      // 礼物信息
      gift: {
        hasGift: null,
        gifts: [],
        recipientName: '',
        recipientPhone: '',
        recipientAddr: '',
        remark: ''
      },
      // 补充协议信息
      supplementary: {
        hasSupplementary: '',
        supplementaryType: '',
        contractContent2: '',
        contractContent3: '',
        contractContent4: '',
        contractContent5: '',
        contractContent6: '',
        contractContent7: '',
        contractContent8: '',
        contractContent9: '',
        contractContent10: '',
        contractContent11: '',
        contractContent12: '',
        contractContent13: '',
        contractContent14: '',
        pkId: '',
        pkId2: '',
        pkId3: '',
        pkId4: '',
        pkId5: '',
        pkId6: '',
        internshipWebsite: '',
        pkId7: '',
        formalismContractName: '',
        pkId8: '',
        pkId9: '',
        pkId10: '',
        pkId11: '',
        pkId12: '',
        pkId13: '',
        payInFullDate: '',
        basePriceCny: '',
        basePriceUsd: '',
        discountInfo: '',
        payInFullDate2: '',
        payInFullDate3: '',
        payInFullDate4: '',
        payInFullDate5: '',
        payInFullDate6: '',
        payInFullDate7: '',
        tempMentorHour: '',
        depositUsd: '',
        retainageUsd: '',
        excessSeriesHour: '',
        excessPriceUsd: '',
        excessTimeName: '',
        newEndData: '',
        excessMentorHour: '',
        tempMentorHour2: '',
        discountRate: '',
        discountNum: 1
      },
      // 发票
      invoice: {
        hasInvoice: null,
        invoiceType: null,
        invoiceTitle: '',
        invoiceAccount: '',
        invoiceAddr: '',
        invoicePhone: '',
        invoiceBank: '',
        invoiceBankAccount: '',
        // invoiceStatus: "",
        recipientName: '',
        recipientPhone: '',
        recipientAddr: '',
        remark: ''
      },

      // 实习单位列表
      internshipUnitList: [],
      oralList: [],
      cfaList: [],
      financeList: [],
      tutoringList: [],
      graduateList: [],
      // 汇率合理范围下限
      extentRate: '',
      // 是否折扣订单
      priceOff: false,
      // 线上签约合同列表
      contractList: [],

      // 修改合同
      changePDFShow: false,
      contractContent: '',
      contractContent2: '',
      contractContent3: '',
      contractContent4: '',
      contractContent5: '',
      contractContent6: '',
      contractContent7: '',
      contractContent8: '',
      contractContent9: '',
      contractContent10: '',
      contractContent11: '',
      contractContent12: '',
      contractContent13: '',
      contractContent14: '',
      contractContent15: '',
      contractContent16: '',
      contractContent17: '',
      contractContent18: '',
      contractContent19: '',
      contractContent20: '',
      arr: [],
      // 合同正文
      contractText: '',
      // 补充协议正文
      contractText2: '',
      contractText3: '',
      contractText4: '',
      contractText5: '',
      contractText6: '',
      contractText7: '',
      contractText8: '',
      contractText9: '',
      contractText10: '',
      contractText11: '',
      contractText12: '',
      contractText13: '',
      contractText14: '',
      contractText15: '',
      contractText16: '',
      contractText17: '',
      contractText18: '',
      programData: {},

      // 实习相关下拉
      internship_duration: [],
      internship_location_type: [],
      mentee_source_from: [],
      wst_company: [],

      internshipProps: {
        children: 'internshipArr',
        label: 'internshipName',
        value: 'internshipId'
      },
      // 所有的二级实习
      internshipIdList: [],

      // 签约信息,所有信息（除返佣）
      signSubmitData: {
        collect: {},
        mentee: {}
      },
      rebateVisible: false,
      signDetailVisibleLocal: false,
      loading: false,
      channelList: [],
      channel_sourceList: [],
      invoice_type: [],
      sourceList: [],
      channelId: null,
      common_yes_or_no: [],
      vipSelect: [],

      entrust: {
        checkList: [],
        allographName: '',
        relationship: '',
        payingName: '',
        entrustPrice: '0(￥) / 0($)'
      },
      relationshipList: [
        { key: '父亲', value: '父亲' },
        { key: '母亲', value: '母亲' },
        { key: '亲属', value: '亲属' },
        { key: '朋友', value: '朋友' },
        { key: '企业', value: '企业' }
      ]
    }
  },
  computed: {
    // // 用开始日期生成结束日期
    // midStartDate() {
    //   return this.collect.startDate;
    // },
    // 计算出总金额，得使用该计算属性，内部代码才会触发
    totalPriceCny () {
      console.log(this.baseProgram, this.internshipProgram, this.cfaProgram, this.oralProgram)
      // if(this.collect.totalPriceCny){

      // }else{
      let price = 0
      this.programId && (price += this.baseProgram.priceCny * 1)
      this.cfaNum && (price += this.cfaProgram.priceCny * 1)
      this.financeNum && (price += this.financeProgram.priceCny * 1)
      this.tutoringNum && (price += this.tutoringProgram.priceCny * 1)
      this.graduateNum && (price += this.graduateProgram.priceCny * 1)
      if (this.internshipNum != 0) {
        for (let i = 0; i < this.internshipNum; i++) {
          price += this.internshipProgram[i].priceCny * 1
        }
      }
      if (this.oralNum != 0) {
        for (let i = 0; i < this.oralNum; i++) {
          price += this.oralProgram[i].priceCny * 1
        }
      }
      this.collect.totalPriceCny = parseFloat(price.toFixed(1))
      // }
    },
    totalPriceUsd () {
      let price = 0
      this.programId && (price += this.baseProgram.priceUsd * 1)
      this.cfaNum && (price += this.cfaProgram.priceUsd * 1)
      this.financeNum && (price += this.financeProgram.priceUsd * 1)
      this.tutoringNum && (price += this.tutoringProgram.priceUsd * 1)
      this.graduateNum && (price += this.graduateProgram.priceUsd * 1)
      if (this.internshipNum != 0) {
        for (let i = 0; i < this.internshipNum; i++) {
          price += this.internshipProgram[i].VIpPrice * 1
        }
      }
      if (this.oralNum != 0) {
        for (let i = 0; i < this.oralNum; i++) {
          price += this.oralProgram[i].priceUsd * 1
        }
      }
      this.collect.totalPriceUsd = parseFloat(price.toFixed(1))
    },
    // //汇率
    // midRate() {
    //   return this.collect.rate;
    // },
    internshipPrice0 () {
      if (this.internshipProgram[0].priceType == 'usd') {
        this.internshipProgram[0] && (this.internshipProgram[0].VIpPriceInit2 = (parseFloat((this.internshipProgram[0].VIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        this.internshipProgram[0] && (this.internshipProgram[0].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[0].nonVIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[0] && (this.internshipProgram[0].priceCny = (parseFloat((this.internshipProgram[0].VIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        } else {
          this.internshipProgram[0] && (this.internshipProgram[0].priceCny = (parseFloat((this.internshipProgram[0].nonVIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[0] && (this.internshipProgram[0].VIpPriceInit2 = (parseFloat((this.internshipProgram[0].VIpPriceInit / this.collect.rate)) || 0).toFixed(1))
        this.internshipProgram[0] && (this.internshipProgram[0].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[0].nonVIpPriceInit / this.collect.rate)) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[0] && (this.internshipProgram[0].priceCny = (parseFloat((this.internshipProgram[0].VIpPriceInit)) || 0).toFixed(1))
        } else {
          this.internshipProgram[0] && (this.internshipProgram[0].priceCny = (parseFloat((this.internshipProgram[0].nonVIpPriceInit)) || 0).toFixed(1))
        }
      }
    },
    internshipPrice1 () {
      if (this.internshipProgram[1].priceType == 'usd') {
        this.internshipProgram[1].VIpPriceInit2 = (parseFloat((this.internshipProgram[1].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[1].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[1].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[1] && (this.internshipProgram[1].priceCny = (parseFloat((this.internshipProgram[1].VIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        } else {
          this.internshipProgram[1] && (this.internshipProgram[1].priceCny = (parseFloat((this.internshipProgram[1].nonVIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[1].VIpPriceInit2 = (parseFloat((this.internshipProgram[1].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[1].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[1].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[1] && (this.internshipProgram[1].priceCny = (parseFloat((this.internshipProgram[1].VIpPriceInit)) || 0).toFixed(1))
        } else {
          this.internshipProgram[1] && (this.internshipProgram[1].priceCny = (parseFloat((this.internshipProgram[1].nonVIpPriceInit)) || 0).toFixed(1))
        }
      }
    },
    internshipPrice2 () {
      if (this.internshipProgram[2].priceType == 'usd') {
        this.internshipProgram[2].VIpPriceInit2 = (parseFloat((this.internshipProgram[2].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[2].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[2].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[2] && (this.internshipProgram[2].priceCny = (parseFloat((this.internshipProgram[2].VIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        } else {
          this.internshipProgram[2] && (this.internshipProgram[2].priceCny = (parseFloat((this.internshipProgram[2].nonVIpPriceInit * this.collect.rate)) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[2].VIpPriceInit2 = (parseFloat((this.internshipProgram[2].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[2].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[2].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[2] && (this.internshipProgram[2].priceCny = (parseFloat((this.internshipProgram[2].VIpPriceInit)) || 0).toFixed(1))
        } else {
          this.internshipProgram[2] && (this.internshipProgram[2].priceCny = (parseFloat((this.internshipProgram[2].nonVIpPriceInit)) || 0).toFixed(1))
        }
      }
    },
    internshipPrice3 () {
      if (this.internshipProgram[3].priceType == 'usd') {
        this.internshipProgram[3].VIpPriceInit2 = (parseFloat((this.internshipProgram[3].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[3].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[3].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[3].priceCny = (parseFloat((this.internshipProgram[3].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        }else{
          this.internshipProgram[3].priceCny = (parseFloat((this.internshipProgram[3].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[3].VIpPriceInit2 = (parseFloat((this.internshipProgram[3].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[3].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[3].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[3].priceCny = (parseFloat((this.internshipProgram[3].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[3].priceCny = (parseFloat((this.internshipProgram[3].nonVIpPriceInit) || 0).toFixed(1))
        }
      }
    },
    internshipPrice4 () {
      if (this.internshipProgram[4].priceType == 'usd') {
        this.internshipProgram[4].VIpPriceInit2 = (parseFloat((this.internshipProgram[4].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[4].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[4].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[4].priceCny = (parseFloat((this.internshipProgram[4].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        }else{
          this.internshipProgram[4].priceCny = (parseFloat((this.internshipProgram[4].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[4].VIpPriceInit2 = (parseFloat((this.internshipProgram[4].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[4].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[4].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[4].priceCny = (parseFloat((this.internshipProgram[4].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[4].priceCny = (parseFloat((this.internshipProgram[4].nonVIpPriceInit) || 0).toFixed(1))
        }
      }
    },
    internshipPrice5 () {
      if (this.internshipProgram[5].priceType == 'usd') {
        this.internshipProgram[5].VIpPriceInit2 = (parseFloat((this.internshipProgram[5].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[5].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[5].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[5].priceCny = (parseFloat((this.internshipProgram[5].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[5].priceCny = (parseFloat((this.internshipProgram[5].nonVIpPriceInit) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[5].VIpPriceInit2 = (parseFloat((this.internshipProgram[5].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[5].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[5].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[5].priceCny = (parseFloat((this.internshipProgram[5].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[5].priceCny = (parseFloat((this.internshipProgram[5].nonVIpPriceInit) || 0).toFixed(1))
        }
      }
    },
    internshipPrice6 () {
      if (this.internshipProgram[6].priceType == 'usd') {
        this.internshipProgram[6].VIpPriceInit2 = (parseFloat((this.internshipProgram[6].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[6].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[6].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[6].priceCny = (parseFloat((this.internshipProgram[6].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[6].priceCny = (parseFloat((this.internshipProgram[6].nonVIpPriceInit) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[6].VIpPriceInit2 = (parseFloat((this.internshipProgram[6].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[6].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[6].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[6].priceCny = (parseFloat((this.internshipProgram[6].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[6].priceCny = (parseFloat((this.internshipProgram[6].nonVIpPriceInit) || 0).toFixed(1))
        }
      }
    },
    internshipPrice7 () {
      if (this.internshipProgram[7].priceType == 'usd') {
        this.internshipProgram[7].VIpPriceInit2 = (parseFloat((this.internshipProgram[7].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[7].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[7].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[7].priceCny = (parseFloat((this.internshipProgram[7].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[7].priceCny = (parseFloat((this.internshipProgram[7].nonVIpPriceInit) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[7].VIpPriceInit2 = (parseFloat((this.internshipProgram[7].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[7].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[7].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[7].priceCny = (parseFloat((this.internshipProgram[7].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[7].priceCny = (parseFloat((this.internshipProgram[7].nonVIpPriceInit) || 0).toFixed(1))
        }
      }
    },
    internshipPrice8 () {
      if (this.internshipProgram[8].priceType == 'usd') {
        this.internshipProgram[8].VIpPriceInit2 = (parseFloat((this.internshipProgram[8].VIpPriceInit * this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[8].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[8].nonVIpPriceInit * this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[8].priceCny = (parseFloat((this.internshipProgram[8].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[8].priceCny = (parseFloat((this.internshipProgram[8].nonVIpPriceInit) || 0).toFixed(1))
        }
      } else {
        this.internshipProgram[8].VIpPriceInit2 = (parseFloat((this.internshipProgram[8].VIpPriceInit / this.collect.rate) || 0).toFixed(1))
        this.internshipProgram[8].nonVIpPriceInit2 = (parseFloat((this.internshipProgram[8].nonVIpPriceInit / this.collect.rate) || 0).toFixed(1))
        if (this.vipStatusNew) {
          this.internshipProgram[8].priceCny = (parseFloat((this.internshipProgram[8].VIpPriceInit) || 0).toFixed(1))
        }else{
          this.internshipProgram[8].priceCny = (parseFloat((this.internshipProgram[8].nonVIpPriceInit) || 0).toFixed(1))
        }
      }
    },
    oralPrice0 () {
      this.oralProgram[0].priceCny =
        parseFloat((this.oralProgram[0].priceUsd * this.collect.rate).toFixed(1))
    },
    oralPrice1 () {
      this.oralProgram[1].priceCny =
        parseFloat((this.oralProgram[1].priceUsd * this.collect.rate).toFixed(1))
    },
    cfaPrice0 () {
      this.cfaProgram.priceCny =
        parseFloat((this.cfaProgram.priceUsd * this.collect.rate).toFixed(1))
    },
    financePrice0 () {
      this.financeProgram.priceCny =
        parseFloat((this.financeProgram.priceUsd * this.collect.rate).toFixed(1))
    },
    tutoringPrice0 () {
      this.tutoringProgram.priceCny =
        parseFloat((this.tutoringProgram.priceUsd * this.collect.rate).toFixed(1))
    },
    graduatePrice0 () {
      this.graduateProgram.priceCny =
        parseFloat((this.graduateProgram.priceUsd * this.collect.rate).toFixed(1))
    }
  },
  watch: {
    signDetailNoBasicVisible: function (val) {
      this.priceOff = false
      console.log(val, '销售签约新的合同')
      this.signDetailVisibleLocal = val
      if (val) {
        api.getPretalkListByMenteeId(this.menteeId).then(res => {
          console.log(res.data, 111111111111111111111111)
          this.pretalkList = res.data
        })
        console.log(this.isKeepOrder, this.programId, '是否是暂存')
        if (this.isKeepOrder) {
          this.init()
          // this.getKeepOrder();
        } else {
          this.init()
          this.getMenteeData()
        }
      }
    },
    // 合同开始日期，自动填充结束日期
    'collect.startDate': function (val) {
      this.collect.endDate = this.getEndDate(
        val,
        this.baseProgram.periodUnit,
        this.baseProgram.period
      )
    },
    // 合同开始日期，自动填充结束日期
    'cfaProgram.startDate': function (val) {
      this.cfaProgram.endDate = this.getEndDate(
        val,
        this.cfaProgram.periodUnit,
        this.cfaProgram.period
      )
    },
    'cfaProgram.endDate': function (val) {
      this.cfaProgram.extendedEndDate = val
    },
    // 合同开始日期，自动填充结束日期
    'financeProgram.startDate': function (val) {
      this.financeProgram.endDate = this.getEndDate(
        val,
        this.financeProgram.periodUnit,
        this.financeProgram.period
      )
    },
    'financeProgram.endDate': function (val) {
      this.financeProgram.extendedEndDate = val
    },
    // 合同开始日期，自动填充结束日期
    'tutoringProgram.startDate': function (val) {
      this.tutoringProgram.endDate = this.getEndDate(
        val,
        this.tutoringProgram.periodUnit,
        this.tutoringProgram.period
      )
    },
    'tutoringProgram.endDate': function (val) {
      this.tutoringProgram.extendedEndDate = val
    },
    // 合同开始日期，自动填充结束日期
    'graduateProgram.startDate': function (val) {
      this.graduateProgram.endDate = this.getEndDate(
        val,
        this.graduateProgram.periodUnit,
        this.graduateProgram.period
      )
    },
    'graduateProgram.endDate': function (val) {
      this.graduateProgram.extendedEndDate = val
    },
    // 汇率变化->基础项目价格变化
    'collect.rate': function (newD) {
      console.log(this.baseProgram.priceUsd, 'this.baseProgram.priceUsd111111111111111111')
      if (this.baseProgram.currencyType !== 'cny') {
        this.baseProgram.priceCny = parseFloat((
          this.baseProgram.priceUsd * newD
        ).toFixed(1))
      } else {
        this.baseProgram.priceUsd = parseFloat((
          this.baseProgram.priceCny / newD
        ).toFixed(1))
      }
      if (this.internshipUnitNew.length > 0) {
        this.changeInternshipId(this.internshipUnitNew, this.indexNew)
      }
    },
    channelId: function (val) {
      console.log(val)
      if (val == 'channel-cooperator') {
        this.remote(this.menteeDetail.sourceFrom || '')
      } else if (val == 'channel-ambassador') {
        this.remote(this.menteeDetail.sourceFrom || '')
      } else if (val) {
        this.sourceList = this.channel_sourceList[val]
        if (
          this.sourceList.some(
            (v) => v.itemValue == this.menteeDetail.sourceFrom
          )
        ) {
          console.log(this.menteeDetail.sourceFrom)
        } else {
          this.menteeDetail.sourceFrom = ''
        }
        console.log(this.sourceList, this.channel_sourceList)
      } else {
        this.sourceList = []
      }
    }
  },
  mounted () {},
  methods: {
    basicRate () {
      if (this.collect.rate) {
        this.collect.totalPriceCny = parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1))
      } else {
        // this.baseProgram.priceUsd = 0;
      }
    },
    basicCny () {
      if (this.collect.rate) {
        this.baseProgram.priceUsd = parseFloat((this.baseProgram.priceCny / this.collect.rate).toFixed(1))
      } else {
        // this.baseProgram.priceUsd = 0;
      }
    },
    basicUsd () {
      console.log(this.collect.rate)
      if (this.collect.rate) {
        this.baseProgram.priceCny = parseFloat((this.baseProgram.priceUsd * this.collect.rate).toFixed(1))
      } else {
        // this.baseProgram.priceCny = 0;
      }
    },
    // 下拉框搜索
    remote (v) {
      if (!this.channelId) {
        this.$message({
          type: 'warning',
          message: '请先选择渠道'
        })
      } else if (this.channelId == 'channel-cooperator') {
        this.getCooperatorSourceByName(v)
      } else if (this.channelId == 'channel-ambassador') {
        this.getAmbassadorSourceByName(v)
      } else {
        this.selectFilter(v)
      }
    },
    // api搜索
    getAmbassadorSourceByName (v) {
      if (v.length >= 2) {
        this.loading = true
        api.getAmbassadorSourceByName(v).then((res) => {
          console.log(res)
          toString.call(res.data.rows) == '[object Array]' &&
            (this.sourceList = res.data.rows)
          if (
            !this.sourceList.some(
              (v) => v.itemValue == this.menteeDetail.sourceFrom
            )
          ) {
            this.menteeDetail.sourceFrom = ''
          }
          this.loading = false
        })
      }
    },
    // api搜索
    getCooperatorSourceByName (v) {
      if (v.length >= 2) {
        this.loading = true
        api.getCooperatorSourceByName(v).then((res) => {
          console.log(res)
          toString.call(res.data.rows) == '[object Array]' &&
            (this.sourceList = res.data.rows)
          if (
            !this.sourceList.some(
              (v) => v.itemValue == this.menteeDetail.sourceFrom
            )
          ) {
            this.menteeDetail.sourceFrom = ''
          }
          this.loading = false
        })
      }
    },
    // 已有数据查找
    selectFilter (v) {
      this.sourceList = this.channel_sourceList[this.channelId].filter((vv) =>
        vv.label.include(v)
      )
    },
    //  补充协议模板类型获取详情下拉
    changeSupplementary () {
      api.orderTemplate('gift').then(res => {
        this.templateList = res.data
      })
      api.orderTemplate('discount').then(res => {
        this.templateList2 = res.data
      })
      api.orderTemplate('specify').then(res => {
        console.log(res.data, 44444444444444444)
        this.templateList3 = res.data
      })
      api.orderTemplate('internship_fill').then(res => {
        this.templateList4 = res.data
      })
      api.orderTemplate('disclaimer').then(res => {
        this.templateList5 = res.data
      })
      api.orderTemplate('job_description').then(res => {
        this.templateList6 = res.data
      })
      api.orderTemplate('formalism').then(res => {
        this.templateList7 = res.data
      })
      api.orderTemplate('privacy').then(res => {
        this.templateList8 = res.data
      })
      api.orderTemplate('tequila_shot').then(res => {
        this.templateList9 = res.data
      })
      api.orderTemplate('mentor_hour').then(res => {
        this.templateList10 = res.data
      })
      api.orderTemplate('program_length').then(res => {
        this.templateList11 = res.data
      })
      api.orderTemplate('jerry_hour').then(res => {
        this.templateList12 = res.data
      })
      api.orderTemplate('installment').then(res => {
        this.templateList13 = res.data
      })
    },
    /**
     * @Date: 2020-05-07 15:34:23
     * @Description: 通过开始日期，周期单位，周期值，推算出结束日期
     * @param {type} 开始日期，周期单位，周期值
     * @return: 转换后的end日期
     */
    getEndDate (val, periodUnit, period) {
      console.log('collect.startDate', val, periodUnit, period)
      if (!val) {
        return
      }
      const arr = val.split(/[年月日]/)
      console.log(arr)
      const date = new Date()
      switch (periodUnit) {
        case 'year':
          {
            date.setFullYear(arr[0] * 1 + period * 1)
            date.setMonth(arr[1] - 1, 1)
            if (date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0 || date.getFullYear() % 400 == 0) {
              if ((arr[2] * 1) > 29) {
                date.setDate(29)
              } else {
                date.setDate(arr[2] * 1)
              }
            } else {
              if ((arr[2] * 1) > 28) {
                date.setDate(28)
              } else {
                date.setDate(arr[2] * 1)
              }
            }
          }
          break
        case 'month':
          {
            date.setFullYear(arr[0])
            date.setMonth(arr[1] - 1 + period, 1)
            if ((arr[1] - 1 + period + 1) % 12 == 2) {
              if (date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0 || date.getFullYear() % 400 == 0) {
                if ((arr[2] * 1) > 29) {
                  date.setDate(29)
                } else {
                  date.setDate(arr[2] * 1)
                }
              } else {
                if ((arr[2] * 1) > 28) {
                  date.setDate(28)
                } else {
                  const maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
                  maxDay.getDate() > arr[2] ? date.setDate(arr[2] * 1) : date.setDate(maxDay.getDate())
                }
              }
            } else {
              date.setDate(arr[2] * 1)
            }
          }
          break
        case 'week':
          {
            date.setFullYear(arr[0])
            date.setMonth(arr[1] - 1, 1)
            date.setDate(arr[2] * 1 + period * 7)
          }
          break
        case 'day':
          {
            date.setFullYear(arr[0])
            date.setMonth(arr[1] - 1)
            date.setDate(arr[2] * 1 + period)
          }
          break
      }
      const day = date.getDate()
      const month = date.getMonth() + 1
      console.log(date, day, month, 'yx11111111111111111111')

      val =
        date.getFullYear() +
        '年' +
        (month > 9 ? month : '0' + month) +
        '月' +
        (day > 9 ? day : '0' + day) +
        '日'
      console.log(val)
      return val
      // this.collect.endDate = val;
    },
    getMenteeData () {
      api.getMenteeDataByMenteeId(this.menteeId).then((res) => {
        console.log('获取学员基本信息yx**112***', res.data)
        // this.collect.vipRecommendStatus = res.data.vipRecommendStatus
        // this.collect.vipRecommender = res.data.vipRecommender
        this.menteeDetail.wxId = res.data.wxId // 微信ID
        this.menteeDetail.menteeId = res.data.menteeId
        this.menteeDetail.realName = res.data.realName
        this.menteeDetail.email = res.data.email
        this.menteeDetail.sex = res.data.sex
        this.menteeDetail.highSchool = res.data.highSchool
        this.menteeDetail.school = res.data.school
        this.menteeDetail.finishYear = res.data.finishYear
        this.menteeDetail.degree = res.data.degree
        this.menteeDetail.telephone = res.data.telephone
        this.menteeDetail.sourceFrom = res.data.sourceFrom
        this.menteeDetail.brokerageStatus = res.data.brokerageStatus
        this.menteeDetail.fixedBrokerage = res.data.fixedBrokerage
        this.menteeDetail.recommender = res.data.recommender
        this.menteeDetail.kolBrokerageStatus = res.data.kolBrokerageStatus
        this.menteeDetail.brokeragePayment = res.data.brokeragePayment
        this.menteeDetail.brokerageRuleArr = res.data.brokerageRuleArr
        this.menteeDetail.sourceFromName =
          res.data.channelName + '/' + res.data.sourceName
        this.$nextTick().then(() => {
          this.channelId = res.data.channelId
        })
      })
    },
    async init () {
      this.vipStatusNew = JSON.parse(JSON.stringify(this.vipStatus))
      if (this.programId) {
        this.vipStatusNew = true
      }
      // 礼物列表
      apiDic.getGiftList('0').then(({ data }) => {
        console.log('礼物列表', data)
        this.giftList = data
      })
      const params = {
        pageNum: 1,
        pageSize: 9999
      }
      this.changeSupplementary()
      this.schoolList = await this.getSchool('school')
      this.highSchool = await this.getSchool('highSchool')
      this.sex = await this.getDictionary('sex')
      this.degree = await this.getDictionary('degree')
      apiDic
        .getDicDropdown(
          'internship_duration,internship_location_type,invoice_type,common_yes_or_no,order_supplementary_type'
        )
        .then((res) => {
          console.log(res.data.order_supplementary_type, 1111111111111111111111)
          this.order_supplementary_type	= res.data.order_supplementary_type
          this.internship_duration = res.data.internship_duration
          this.internship_location_type = res.data.internship_location_type
          this.invoice_type = res.data.invoice_type
          this.common_yes_or_no = res.data.common_yes_or_no
        })
      apiDic.getDicWstCompany().then((res) => {
        this.wst_company = res.data
      })
      apiDic.getChannelSource().then((res) => {
        console.log(',getChannelSource', res.data)
        this.channelList = res.data.channelList
        this.channel_sourceList = res.data.sourceList
      })

      // 下拉框选人
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'sales'
        })
        .then((res) => {
          this.salesList = res.data.rows
          // 默认主联系人为当前登录用户
          this.salesList.forEach((v) => {
            if (v.userId == this.userInfo.userId) {
              this.collect.contact1 = this.userInfo.userId
            }
          })
        })
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          entryStatus: '1',
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'strategist,services'
        })
        .then((res) => {
          console.log(res, 'vip推荐人列表yx*********')
          this.vipSelect = res.data.rows
        })
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          entryStatus: '1',
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'strategist'
        })
        .then((res) => {
          this.VIPList = res.data.rows
        })
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          entryStatus: '1',
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'services'
        })
        .then((res) => {
          this.servicesList = res.data.rows
        })
      api.getSignCompanyList().then((res) => {
        console.log('线上签约公司列表', res.data)
        this.company = res.data
      })
      console.log(this.collect.rate, '当前的汇率yx111111111111111111111111111111')

      // if (this.internshipNum != 0) {
      const params1 = {
        pageNum: 1,
        pageSize: 999,
        recordStatus: '1'
      }
      apiDic.getInternshipList(params1).then((res) => {
        console.log('获取实习单位列表', res)
        this.internshipUnitList = res.data.rows
        this.internshipUnitList.forEach((v) => {
          v.internshipId = v.internshipName
          v.internshipArr.forEach((vv) => {
            vv.internshipName += `[${vv.internshipTimeName || ''}-${
              vv.internshipLocationName || ''
            } ]`
          })
          this.internshipIdList.push(...v.internshipArr)
        })
      })
      apiDic.getProgramDetailById('3').then((res) => {
        console.log(res.data, '获取实习项目合同模板')
        this.interShipContractList = res.data.contractList
      })

      // }
      // if (this.oralNum != 0) {
      // let params2 = {
      //   pageNum: 1,
      //   pageSize: 999,
      //   oralStatus: "0"
      // };
      // apiDic.getOralList(params2).then(res => {
      //   console.log("获取口语列表", res);
      //   this.oralList = res.data.rows;
      // });
      const params2 = {
        pageNum: 1,
        pageSize: 999,
        programType: 'oral',
        programStatus: 1
      }
      apiDic.getProgramDicList(params2).then((res) => {
        console.log('获取口语列表', res)
        this.oralList = res.data.rows
      })
      // }
      // if (this.cfaNum != 0) {
      const params3 = {
        pageNum: 1,
        pageSize: 999,
        programType: 'cfa',
        programStatus: 1
      }
      apiDic.getProgramDicList(params3).then((res) => {
        console.log('获取CFA列表', res)
        this.cfaList = res.data.rows
      })
      const params4 = {
        pageNum: 1,
        pageSize: 999,
        programType: 'finance',
        programStatus: 1
      }
      apiDic.getProgramDicList(params4).then((res) => {
        console.log('获取Finance列表', res)
        this.financeList = res.data.rows
      })
      const params6 = {
        pageNum: 1,
        pageSize: 999,
        programType: 'tutoring',
        programStatus: 1
      }
      apiDic.getProgramDicList(params6).then((res) => {
        console.log('获取tutoring列表', res)
        this.tutoringList = res.data.rows
      })
      const params5 = {
        pageNum: 1,
        pageSize: 999,
        programType: 'graduate_program',
        programStatus: 1
      }
      apiDic.getProgramDicList(params5).then((res) => {
        console.log('获取申研列表', res)
        this.graduateList = res.data.rows
      })
      api.getRate({ currencyType: 'usd' }).then((res) => {
        console.log('拿汇率区间', res.data)
        this.extentRate = res.data.orderRate1
      })

      console.log(this.menteeId, 'ghreuigheuirgheruih')
      if (this.isKeepOrder) {
        apiDic.getRedisByKey(this.menteeId).then((res) => {
          console.log(res, 'yx4444444444444444444')
          this.programId = res.data.programId || ''
          if (this.programId) {
            api
              .getProgramById(this.programId)
              .then((res) => {
                console.log('拿项目信息********************************', res.data)
                this.programData = res.data
                const data = res.data
                this.baseProgram.programType = data.programType
                this.baseProgram.programName = data.programName
                this.baseProgram.programWeight = data.programWeight
                this.baseProgram.programId = data.programId
                this.baseProgram.priceCny = data.priceCny
                this.baseProgram.basePriceCny = data.priceCny
                this.baseProgram.basePriceUsd = data.priceUsd
                this.baseProgram.priceUsd = data.priceUsd
                this.baseProgram.mentorHour = data.mentorHour
                this.baseProgram.leadStrategistHour = data.leadStrategistHour
                this.baseProgram.period = data.period
                this.baseProgram.periodUnit = data.periodUnit
                this.baseProgram.currencyType = data.currencyType
                this.baseProgram.officeHourStrategistSession = data.officeHourStrategistSession
                this.baseProgram.liveLesson = data.liveLesson
                this.baseProgram.seriesHour = data.seriesHour
                this.baseProgram.programDetail = data.programDetail
                this.baseProgram.applicationLetterModify =
                data.applicationLetterModify
                this.baseProgram.jerryHour = data.jerryHour
                this.baseProgram.seniorStrategist = data.seniorStrategist
                this.baseProgram.hasContinual = data.hasContinual
                this.baseProgram.hasEbookStore = data.hasEbookStore
                this.baseProgram.emergencyMentor = data.emergencyMentor
                this.baseProgram.interviewMentor = data.interviewMentor
                this.baseProgram.priority = data.priority
                this.baseProgram.certificateSubjectLiveCourseAuthority =
                data.certificateSubjectLiveCourseAuthority
                this.baseProgram.mentorCount = data.mentorCount
                this.baseProgram.tequilaShotHour = data.tequilaShotHour
                this.baseProgram.seminars = data.seminars
                this.baseProgram.officeHour = data.officeHour
                this.baseProgram.signVip = data.signVip

                this.contractList = data.contractList
              }).then(() => {
                if (this.isKeepOrder) {
                  this.getKeepOrder()
                }
              })
              .catch((err) => {
                this.$message('网络故障请刷新')
              })
          }
        })
      } else {
        if (this.programId) {
          api
            .getProgramById(this.programId)
            .then((res) => {
              console.log('拿项目信息********************************', res.data)
              this.programData = res.data
              const data = res.data
              this.baseProgram.programType = data.programType
              this.baseProgram.programName = data.programName
              this.baseProgram.programWeight = data.programWeight
              this.baseProgram.programId = data.programId
              this.baseProgram.priceCny = data.priceCny
              this.baseProgram.basePriceCny = data.priceCny
              this.baseProgram.basePriceUsd = data.priceUsd
              this.baseProgram.priceUsd = data.priceUsd
              this.baseProgram.mentorHour = data.mentorHour
              this.baseProgram.leadStrategistHour = data.leadStrategistHour
              this.baseProgram.period = data.period
              this.baseProgram.periodUnit = data.periodUnit
              this.baseProgram.currencyType = data.currencyType
              this.baseProgram.officeHourStrategistSession = data.officeHourStrategistSession
              this.baseProgram.liveLesson = data.liveLesson
              this.baseProgram.seriesHour = data.seriesHour
              // this.baseProgram.programDetail = data.programDetail;
              this.baseProgram.applicationLetterModify =
                data.applicationLetterModify
              this.baseProgram.jerryHour = data.jerryHour
              this.baseProgram.seniorStrategist = data.seniorStrategist
              this.baseProgram.hasContinual = data.hasContinual
              this.baseProgram.hasEbookStore = data.hasEbookStore
              this.baseProgram.emergencyMentor = data.emergencyMentor
              this.baseProgram.interviewMentor = data.interviewMentor
              this.baseProgram.priority = data.priority
              this.baseProgram.certificateSubjectLiveCourseAuthority =
                data.certificateSubjectLiveCourseAuthority
              this.baseProgram.mentorCount = data.mentorCount
              this.baseProgram.tequilaShotHour = data.tequilaShotHour
              this.baseProgram.seminars = data.seminars
              this.baseProgram.officeHour = data.officeHour
              this.baseProgram.signVip = data.signVip

              this.contractList = data.contractList
            }).then(() => {
              if (this.isKeepOrder) {
                this.getKeepOrder()
              }
            })
            .catch((err) => {
              this.$message('网络故障请刷新')
            })
        }
      }
    },
    signDetailClose () {
      this.$emit('close')
      this.sourceList = []
      this.channelId = null
      this.clear()
    },
    // 加礼物
    addGift () {
      this.gift.gifts.push({ giftId: null, giftNum: 1 })
    },
    // 删礼物
    deleteGift (i) {
      console.log(i)
      this.gift.gifts.splice(i, 1)
      if (!this.gift.gifts.length) {
        this.gift.hasGift = '0'
      }
    },
    // 选择实习单位更新其价格
    changeOption (v, item) {
      this.oralList.forEach((ve) => {
        if (ve.programId == v) {
          console.log(ve)
          this.oralProgram[item].priceUsd = ve.priceUsd
          this.oralProgram[item].basePriceUsd = ve.priceUsd
          this.oralProgram[item].oralLessonHour = ve.oralLessonHour
          this.oralProgram[item].seriesHour = ve.seriesHour
          this.oralProgram[item].programWeight = ve.programWeight
          this.oralProgram[item].note = ''
          apiDic.getProgramDetailById(ve.programId).then((res) => {
            console.log(res.data, '获取口语项目合同模板')
            this.oralProgramContractList = res.data.contractList
          })
        }
      })
      this.changePrice()
    },
    // 选择实习单位更新其价格
    changeCFAOption (v) {
      console.log(v)
      this.cfaList.forEach((ve) => {
        if (ve.programId == v) {
          console.log(ve, this.cfaProgram)
          this.cfaProgram.priceCny = ve.priceCny
          this.cfaProgram.priceUsd = ve.priceUsd
          this.cfaProgram.basePriceUsd = ve.priceUsd
          this.cfaProgram.basePriceCny = ve.priceCny
          this.cfaProgram.period = ve.period
          this.cfaProgram.periodUnit = ve.periodUnit
          this.cfaProgram.medalTokens = ve.medalTokens
          this.cfaProgram.programWeight = ve.programWeight
          this.cfaProgram.note = ''
          apiDic.getProgramDetailById(ve.programId).then((res) => {
            console.log(res.data, '获取cfa项目合同模板')
            this.cfaProgramContractList = res.data.contractList
          })
        }
      })
      this.changePrice()
    },
    // 选择实习单位更新其价格
    changeFinanceOption (v) {
      console.log(v)
      this.financeList.forEach((ve) => {
        if (ve.programId == v) {
          this.financeProgram.priceCny = ve.priceCny
          this.financeProgram.priceUsd = ve.priceUsd
          this.financeProgram.basePriceUsd = ve.priceUsd
          this.financeProgram.basePriceCny = ve.priceCny
          this.financeProgram.financeHour = ve.financeHour
          this.financeProgram.strategist = ve.strategist
          this.financeProgram.services = ve.services
          this.financeProgram.period = ve.period
          this.financeProgram.signVip = ve.signVip
          this.financeProgram.periodUnit = ve.periodUnit
          this.financeProgram.medalTokens = ve.medalTokens
          this.financeProgram.programWeight = ve.programWeight
          this.financeProgram.note = ''
          apiDic.getProgramDetailById(ve.programId).then((res) => {
            console.log(res.data, '获取财商项目合同模板')
            this.financeProgramContractList = res.data.contractList
          })
        }
      })
      this.changePrice()
    },
    // 选择课业辅导更新其价格
    changeTutoringOption (v) {
      console.log(v)
      this.tutoringList.forEach((ve) => {
        if (ve.programId == v) {
          this.tutoringProgram.priceCny = ve.priceCny
          this.tutoringProgram.priceUsd = ve.priceUsd
          this.tutoringProgram.basePriceUsd = ve.priceUsd
          this.tutoringProgram.basePriceCny = ve.priceCny
          this.tutoringProgram.tutoringMentorHour = ve.tutoringMentorHour
          this.tutoringProgram.strategist = ve.strategist
          this.tutoringProgram.services = ve.services
          this.tutoringProgram.period = ve.period
          this.tutoringProgram.signVip = ve.signVip
          this.tutoringProgram.periodUnit = ve.periodUnit
          this.tutoringProgram.medalTokens = ve.medalTokens
          this.tutoringProgram.programWeight = ve.programWeight
          this.tutoringProgram.note = ''
          apiDic.getProgramDetailById(ve.programId).then((res) => {
            console.log(res.data, '获取课业辅导项目合同模板')
            this.tutoringProgramContractList = res.data.contractList
          })
        }
      })
      this.changePrice()
    },
    changeGraduateOption (v) {
      this.graduateList.forEach((ve) => {
        if (ve.programId == v) {
          console.log(ve)
          this.graduateProgram.priceCny = ve.priceCny
          this.graduateProgram.priceUsd = ve.priceUsd
          this.graduateProgram.basePriceUsd = ve.priceUsd
          this.graduateProgram.basePriceCny = ve.priceCny
          this.graduateProgram.period = ve.period
          this.graduateProgram.periodUnit = ve.periodUnit
          this.graduateProgram.programWeight = ve.programWeight
          this.graduateProgram.gpBackgroundPromotionQuantity = ve.gpBackgroundPromotionQuantity
          this.graduateProgram.gpBackgroundPromotionPriceCny = ve.gpBackgroundPromotionPriceCny
          this.graduateProgram.gpBackgroundPromotionPriceUsd = ve.gpBackgroundPromotionPriceUsd
          this.graduateProgram.gpMajorQuantity = ve.gpMajorQuantity
          this.graduateProgram.gpProgramApplyQuantity = ve.gpProgramApplyQuantity
          this.graduateProgram.liveLesson = ve.liveLesson
          this.graduateProgram.mentorHour = ve.mentorHour
          this.graduateProgram.note = ''
          apiDic.getProgramDetailById(ve.programId).then((res) => {
            console.log(res.data, '获取申研项目合同模板')
            this.graduateProgramContractList = res.data.contractList
          })
        }
      })
      this.changePrice()
    },
    changePrice () {
      let a = 0
      console.log(this.internshipProgram, this.oralProgram, this.cfaProgram, this.financeProgram, this.tutoringProgramContractList)
      for (let i = 0; i < this.internshipProgram.length; i++) {
        if (this.internshipProgram[i].internshipUnit && this.internshipProgram[i].internshipUnit.length > 0) {
          if (this.internshipProgram[i].priceType == 'usd') {
            if (this.vipStatusNew) {
              this.internshipProgram[i].basePriceUsd = this.internshipProgram[i].VIpPriceInit * 1 || 0
            } else {
              this.internshipProgram[i].basePriceUsd = this.internshipProgram[i].nonVIpPriceInit * 1 || 0
            }
            a += this.internshipProgram[i].basePriceUsd
          } else {
            if (this.internshipProgram[i].VIpPriceInit2 == 'Infinity') {
              this.internshipProgram[i].basePriceUsd = 0
            } else {
              if (this.vipStatusNew) {
                this.internshipProgram[i].basePriceUsd = this.internshipProgram[i].VIpPriceInit2 * 1
              } else {
                this.internshipProgram[i].basePriceUsd = this.internshipProgram[i].nonVIpPriceInit2 * 1
              }
            }
            a += this.internshipProgram[i].basePriceUsd
          }
        }
      }
      for (let i = 0; i < this.oralProgram.length; i++) {
        if (this.oralProgram[i].basePriceUsd) {
          a += this.oralProgram[i].basePriceUsd
        }
      }
      a += this.cfaProgram.basePriceUsd
      a += this.financeProgram.basePriceUsd
      a += this.tutoringProgram.basePriceUsd
      a += this.graduateProgram.basePriceUsd
      this.supplementary.basePriceUsd = a + this.baseProgram.basePriceUsd * 1
      if (this.collect.rate) {
        this.supplementary.basePriceCny = (this.supplementary.basePriceUsd * this.collect.rate).toFixed(1)
      } else {
        this.supplementary.basePriceCny = 0
      }
      this.collect.totalPriceUsd = this.supplementary.basePriceUsd
      console.log(this.supplementary, this.collect, 444444444444444)
    },
    changeDiscount () {
      console.log(this.supplementary.discountRate)
      if (this.supplementary.discountRate == '9折') {
        this.supplementary.discountNum = 0.9
      } else if (this.supplementary.discountRate == '95折') {
        this.supplementary.discountNum = 0.95
      } else {
        this.supplementary.discountNum = 1
      }
    },
    // 选择实习单位更新其价格
    changeInternshipId (internshipUnit, index) {
      this.internshipUnitNew = internshipUnit
      this.indexNew = index
      const internshipId = internshipUnit[1]
      const item = this.internshipIdList.filter(
        (v) => v.internshipId == internshipId
      )[0]
      this.internshipProgram[index].internshipLocation =
        item.internshipLocation
      this.internshipProgram[index].internshipDuration = item.internshipTime
      this.internshipProgram[index].priceType = item.priceType
      if (item.priceType != 'usd') {
        if (this.vipStatusNew) {
          this.internshipProgram[index].priceUsd = (item.vipPrice / this.collect.rate).toFixed(1)
          this.internshipProgram[index].basePriceUsd = (item.vipPrice / this.collect.rate).toFixed(1)
          this.internshipProgram[index].nonVIpPrice = (item.novipPrice / this.collect.rate).toFixed(1)
          this.internshipProgram[index].VIpPrice = (item.vipPrice / this.collect.rate).toFixed(1)

          this.internshipProgram[index].VIpPriceInit = item.vipPrice
          this.internshipProgram[index].VIpPriceInit2 = (item.vipPrice / this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].nonVIpPriceInit = item.novipPrice
          this.internshipProgram[index].nonVIpPriceInit2 = (item.novipPrice / this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].programWeight = 1
          this.internshipProgram[index].internshipName = `${item.internshipDesc}/${item.internshipName}`
          this.internshipProgram[index].internshipTimeName = `${item.internshipTimeName}`
        } else {
          this.internshipProgram[index].priceUsd = (item.novipPrice / this.collect.rate).toFixed(1)
          this.internshipProgram[index].basePriceUsd = (item.novipPrice / this.collect.rate).toFixed(1)
          this.internshipProgram[index].nonVIpPrice = (item.novipPrice / this.collect.rate).toFixed(1)
          this.internshipProgram[index].VIpPrice = (item.vipPrice / this.collect.rate).toFixed(1)

          this.internshipProgram[index].VIpPriceInit = item.vipPrice
          this.internshipProgram[index].VIpPriceInit2 = (item.vipPrice / this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].nonVIpPriceInit = item.novipPrice
          this.internshipProgram[index].nonVIpPriceInit2 = (item.novipPrice / this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].programWeight = 1
          this.internshipProgram[index].internshipName = `${item.internshipDesc}/${item.internshipName}`
          this.internshipProgram[index].internshipTimeName = `${item.internshipTimeName}`
        }
        this.$set(this.internshipProgram, index, this.internshipProgram[index])
        this.changePrice()
      } else {
        if (this.vipStatusNew) {
          this.internshipProgram[index].priceUsd = (item.vipPrice).toFixed(1)
          this.internshipProgram[index].basePriceUsd = (item.vipPrice).toFixed(1)
          this.internshipProgram[index].nonVIpPrice = (item.novipPrice).toFixed(1)
          this.internshipProgram[index].VIpPrice = (item.vipPrice).toFixed(1)

          this.internshipProgram[index].VIpPriceInit = item.vipPrice
          this.internshipProgram[index].VIpPriceInit2 = (item.vipPrice * this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].nonVIpPriceInit = item.novipPrice
          this.internshipProgram[index].nonVIpPriceInit2 = (item.novipPrice * this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].programWeight = 1
          this.internshipProgram[index].internshipName = `${item.internshipDesc}/${item.internshipName}`
          this.internshipProgram[index].internshipTimeName = `${item.internshipTimeName}`
        } else {
          this.internshipProgram[index].priceUsd = (item.novipPrice).toFixed(1)
          this.internshipProgram[index].basePriceUsd = (item.novipPrice).toFixed(1)
          this.internshipProgram[index].nonVIpPrice = (item.novipPrice).toFixed(1)
          this.internshipProgram[index].VIpPrice = (item.vipPrice).toFixed(1)

          this.internshipProgram[index].VIpPriceInit = item.vipPrice
          this.internshipProgram[index].VIpPriceInit2 = (item.vipPrice * this.collect.rate).toFixed(1) || 0
          this.internshipProgram[index].nonVIpPriceInit = item.novipPrice
          this.internshipProgram[index].nonVIpPriceInit2 = (item.novipPrice * this.collect.rate).toFixed(1) || 0

          this.internshipProgram[index].programWeight = 1
          this.internshipProgram[index].internshipName = `${item.internshipDesc}/${item.internshipName}`
          this.internshipProgram[index].internshipTimeName = `${item.internshipTimeName}`
        }
        this.$set(this.internshipProgram, index, this.internshipProgram[index])
        this.changePrice()
      }
      console.log(this.internshipProgram[index], item, 'yx1111111111111111111111111111')
    },
    // 生成
    createURL () {
      console.log(this.checkList, this.supplementary, 3333333333333333)
      let canGo = true
      if (/^[a-z]|\s[a-z]/.test(this.menteeDetail.chiName)) {
        this.$message({
          type: 'warning',
          message: '请检查法定名输入规范'
        })
        return
      }
      for (let i = 0; i < this.schoolList.length; i++) {
        if (this.schoolList[i].schoolId == this.menteeDetail.school) {
          if (this.schoolList[i].engName) {
            if (this.schoolList[i].engName.indexOf('Other') != '-1') {
              this.$message({
                type: 'warning',
                message: '请选择具体的学校，若无匹配学校请联系销售助理添加学校后继续录入'
              })
              return
            }
          }
        }
      }
      for (let i = 0; i < this.internshipNum; i++) {
        if (!this.internshipProgram[i].internshipUnit[1]) {
          this.$message({
            type: 'warning',
            message: '请检查实习单位'
          })
          return
        }
      }
      for (let i = 0; i < this.internshipNum; i++) {
        if (this.internshipProgram[i].internshipFlag != '0' && this.internshipProgram[i].internshipFlag != '1') {
          this.$message({
            type: 'warning',
            message: '请检查实习安排方式'
          })
          return
        }
      }
      for (let i = 0; i < this.oralNum; i++) {
        if (!this.oralProgram[i].programId) {
          this.$message({
            type: 'warning',
            message: '请检查口语项目'
          })
          return
        }
      }
      if (this.cfaNum && !this.cfaProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查CFA项目'
        })
        return
      }
      if (this.financeNum && !this.financeProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查财商项目'
        })
        return
      }
      if (this.tutoringNum && !this.tutoringProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查财商项目'
        })
        return
      }
      if (this.graduateNum && !this.graduateProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查申研项目'
        })
        return
      }
      if (this.supplementary.discountRate == '9折' || this.supplementary.discountRate == '95折') {
        this.priceOff = true
        if (this.collect.discountInfo) {
        } else {
          this.$message.error('当为折扣订单时，折扣说明为必填项！！')
          canGo = false
          return false
        }
      } else {
        this.priceOff = false
      }
      this.$refs.menteeDetail.validate((valid) => {
        if (!valid) canGo = false
      })
      // transition
      this.$refs.transition.validate((valid) => {
        if (!valid) canGo = false
      })
      //  this.$refs.oralProgram.validate((valid) => {
      //   if (!valid) canGo = false;
      // });
      this.$refs.cfaProgram &&
        this.$refs.cfaProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.financeProgram &&
        this.$refs.financeProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.tutoringProgram &&
        this.$refs.tutoringProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.graduateProgram &&
        this.$refs.graduateProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.baseProgram &&
        this.$refs.baseProgram.validate((valid) => {
          if (!valid) canGo = false
        })

      this.$refs.internshipProgram &&
        this.$refs.internshipProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.collect.validate((valid) => {
        if (!valid) {
          canGo = false
        } else {
          this.changeTime()
        }
      })
      // 礼物
      // this.$refs.gift &&
      // this.$refs.gift.validate((valid) => {
      //   if (!valid) {
      //     canGo = false
      //   }else{
      //     if(this.gift.hasGift == '1'){
      //       if(this.checkList.length <= 0 || !(this.checkList.indexOf('礼品补充协议') > -1)){
      //         this.$message.error('当有礼品时必须有礼品补充协议！！')
      //         canGo = false
      //       }
      //     }
      //   }
      // });
      // 补充协议  折扣协议时需要为折扣订单
      this.$refs.supplementary &&
        this.$refs.supplementary.validate((valid) => {
          if (!valid) {
            canGo = false
          } else {
            if (this.checkList.indexOf('礼品补充协议') > -1) {
              if (this.gift.hasGift != '1') {
                this.$message.error('当有礼品类型的补充协议时，礼品为必选项！！')
                canGo = false
              }
            }
          }
        })
      // 发票
      this.$refs.invoice &&
        this.$refs.invoice.validate((valid) => {
          if (!valid) canGo = false
        })
      // 确认金额是否打折
      // 判断有折扣说明
      this.baseProgram.currencyType // 项目货币基准
      // 计算价格打折比例；%
      let priceRate = offPrice(
        this.baseProgram.currencyType == 'cny'
          ? this.baseProgram.basePriceCny
          : this.baseProgram.basePriceUsd * this.collect.rate,
        this.baseProgram.currencyType == 'cny'
          ? this.baseProgram.priceCny
          : this.baseProgram.priceUsd * this.collect.rate,
        this.internshipProgram,
        this.oralProgram,
        this.cfaProgram,
        this.financeProgram,
        this.tutoringProgram,
        this.graduateProgram,
        this.collect.rate
      )
      if (priceRate >= 5) {
        if (!this.collect.discountInfo) {
          this.$message({
            type: 'warning',
            message: '价格有折扣，请填写折扣说明'
          })
          // 折扣订单时补充协议
          this.priceOff = true
          return
        }
      } else {
        if (this.extentRate <= this.collect.rate) {
        } else {
          priceRate = 5
        }
      }
      // 计算价格打折比例；%,(基础项目原件，基础项目现价，实习项目，口语项目，汇率)
      function offPrice (bp, nbp, internship, oral, cfa, r) {
        let totalP = bp * 1
        let nTotalP = nbp * 1
        internship.length &&
          internship.forEach((v) => {
            totalP += v.basePriceUsd * r
            nTotalP += v.priceUsd * r
          })
        oral.length &&
          oral.forEach((v) => {
            totalP += v.basePriceUsd * r
            nTotalP += v.priceUsd * r
          })
        if (cfa.programId) {
          totalP += cfa.basePriceUsd * r
          nTotalP += cfa.priceUsd * r
        }
        console.log(nTotalP, totalP)
        return ((totalP - nTotalP) / totalP) * 100
      }
      // 礼品价值不超过合同金额5%
      let giftTotalPriceForOrderPrice = 0
      this.gift.gifts.forEach((v) => {
        if (v.gift) {
          giftTotalPriceForOrderPrice += v.gift.split('&&')[2] * 1 * v.giftNum
        } else {
          this.$message({
            type: 'warning',
            message: '请选择具体礼物'
          })
        }
      })
      console.log(this.collect.totalPriceCny)
      console.log(this.baseProgram.basePriceUsd * this.collect.rate, 44444444444444444)
      if (!this.collect.totalPriceUsd) {
        this.collect.totalPriceCny = this.baseProgram.basePriceUsd * this.collect.rate
      } else {
        this.collect.totalPriceCny = this.collect.totalPriceUsd * this.collect.rate
      }
      if (
        (this.collect.totalPriceCny * 5) / 100 <
        giftTotalPriceForOrderPrice
      ) {
        this.$message({
          type: 'warning',
          message: '礼品价值不得超过合同总金额5%'
        })
        return
      }
      // if (!this.contractText && this.signOnline) {
      //   this.$message({
      //     type: "warning",
      //     message: "请先预览合同，并确认无误",
      //   });
      //   return;
      // }
      const reg = /(\n第.章\s)|(\n第\d\d?条\s)|(\n\d\d?\.\d\d?\s)|(\n\d\d?\.\d\d?\.\d\d?\s)|(\n\d\d?\.\s)/g
      const rarr = []
      let r = []

      while ((r = reg.exec(this.contractText))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText = this.contractText.replace(str, newStr)
      }

      while ((r = reg.exec(this.contractText2))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText2 = this.contractText2.replace(str, newStr)
      }

      while ((r = reg.exec(this.contractText3))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText3 = this.contractText3.replace(str, newStr)
      }

      while ((r = reg.exec(this.contractText4))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText4 = this.contractText4.replace(str, newStr)
      }

      while ((r = reg.exec(this.contractText5))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText5 = this.contractText5.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText6))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText6 = this.contractText6.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText7))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText7 = this.contractText7.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText8))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText8 = this.contractText8.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText9))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText9 = this.contractText9.replace(str, newStr)
      }
      //
      while ((r = reg.exec(this.contractText10))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText10 = this.contractText10.replace(str, newStr)
      }
      //
      while ((r = reg.exec(this.contractText11))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText11 = this.contractText11.replace(str, newStr)
      }
      //
      while ((r = reg.exec(this.contractText12))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText12 = this.contractText12.replace(str, newStr)
      }
      //
      while ((r = reg.exec(this.contractText13))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText13 = this.contractText13.replace(str, newStr)
      }
      //
      while ((r = reg.exec(this.contractText14))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText14 = this.contractText14.replace(str, newStr)
      }

      while ((r = reg.exec(this.contractText15))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText15 = this.contractText15.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText16))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText16 = this.contractText16.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText17))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText17 = this.contractText17.replace(str, newStr)
      }
      while ((r = reg.exec(this.contractText18))) {
        rarr.push(r)
      }
      for (let i = 0; i < rarr.length; i++) {
        const str = rarr[i][0]
        const newStr = str.substr(0, str.length - 1) + '\t'
        this.contractText18 = this.contractText18.replace(str, newStr)
      }
      for (let j = 0; j < this.internshipListAll.length; j++) {
        for (let i = 0; i < rarr.length; i++) {
          const str = rarr[i][0]
          const newStr = str.substr(0, str.length - 1) + '\t'
          this.internshipListAll[j].contractText = this.internshipListAll[j].contractText.replace(str, newStr)
        }
      }
      //  数据结构赋值data
      if (canGo) {
        const data = {
          programName: this.baseProgram.programName,
          // contractTitle:
          //   this.collect.contract && this.collect.contract.split("&&&")[0],
          mentee: {
            menteeId: this.menteeDetail.menteeId,
            realName: this.menteeDetail.realName,
            chiName: this.menteeDetail.chiName,
            highSchool: this.menteeDetail.highSchool,
            school: this.menteeDetail.school, // ID
            sourceFrom: this.menteeDetail.sourceFrom,
            sourceFromName: this.menteeDetail.sourceFromName,
            brokerageStatus: this.menteeDetail.brokerageStatus,
            fixedBrokerage: this.menteeDetail.fixedBrokerage,
            degree: this.menteeDetail.degree,
            finishYear: this.menteeDetail.finishYear,
            wxId: this.menteeDetail.wxId,
            telephone: this.menteeDetail.telephone,
            email: this.menteeDetail.email,
            sex: this.menteeDetail.sex,
            recommender: this.menteeDetail.recommender,
            brokerageRuleArr: this.menteeDetail.brokerageRuleArr,
            kolBrokerageStatus: this.menteeDetail.kolBrokerageStatus,
            brokeragePayment: this.menteeDetail.brokeragePayment
          },
          contractArr: [
            // {contractContent:this.contractText,contractTitle:this.collect.contract && this.collect.contract.split("&&&")[0]},
          ]
        }
        data.contractArr = []

        // if(this.contractContent2){
        //   for(let i=0;i<this.templateList.length;i++){
        //     if(this.supplementary.pkId == this.templateList[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText2,
        //         contractTitle:this.templateList[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent3){
        //   for(let i=0;i<this.templateList2.length;i++){
        //     if(this.supplementary.pkId2 == this.templateList2[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText3,
        //         contractTitle:this.templateList2[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent4){
        //   for(let i=0;i<this.templateList3.length;i++){
        //     if(this.supplementary.pkId3 == this.templateList3[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText4,
        //         contractTitle:this.templateList3[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent5){
        //   for(let i=0;i<this.templateList4.length;i++){
        //     if(this.supplementary.pkId4 == this.templateList4[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText5,
        //         contractTitle:this.templateList4[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent6){
        //   for(let i=0;i<this.templateList5.length;i++){
        //     if(this.supplementary.pkId5 == this.templateList5[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText6,
        //         contractTitle:this.templateList5[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent7){
        //   for(let i=0;i<this.templateList6.length;i++){
        //     if(this.supplementary.pkId6 == this.templateList6[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText7,
        //         contractTitle:this.templateList6[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent8){
        //   for(let i=0;i<this.templateList7.length;i++){
        //     if(this.supplementary.pkId7 == this.templateList7[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText8,
        //         contractTitle:this.templateList7[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent9){
        //   for(let i=0;i<this.templateList8.length;i++){
        //     if(this.supplementary.pkId8 == this.templateList8[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText9,
        //         contractTitle:this.templateList8[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent10){
        //   for(let i=0;i<this.templateList9.length;i++){
        //     if(this.supplementary.pkId9 == this.templateList9[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText10,
        //         contractTitle:this.templateList9[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent11){
        //   for(let i=0;i<this.templateList10.length;i++){
        //     if(this.supplementary.pkId10 == this.templateList10[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText11,
        //         contractTitle:this.templateList10[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent12){
        //   for(let i=0;i<this.templateList11.length;i++){
        //     if(this.supplementary.pkId11 == this.templateList11[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText12,
        //         contractTitle:this.templateList11[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent13){
        //   for(let i=0;i<this.templateList12.length;i++){
        //     if(this.supplementary.pkId12 == this.templateList12[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText13,
        //         contractTitle:this.templateList12[i].contractTitle
        //       })
        //     }
        //   }
        // }
        // if(this.contractContent14){
        //   for(let i=0;i<this.templateList13.length;i++){
        //     if(this.supplementary.pkId13 == this.templateList13[i].pkId){
        //       data.contractArr.push({
        //         contractContent:this.contractText14,
        //         contractTitle:this.templateList13[i].contractTitle
        //       })
        //     }
        //   }
        // }
        if (this.signOnline) {
          if (this.contractContent15) {
            for (let i = 0; i < this.oralList.length; i++) {
              if (this.oralProgram[0].programId == this.oralList[i].programId) {
                data.contractArr.push({
                  contractContent: this.contractText15,
                  contractTitle: this.oralProgram[0].contract && this.oralProgram[0].contract.split('&&&')[0]
                })
              }
            }
          }
          if (this.contractContent16) {
            data.contractArr.push({
              contractContent: this.contractText16,
              contractTitle: this.cfaProgram.contract && this.cfaProgram.contract.split('&&&')[0]
            })
          }
          if (this.contractContent17) {
            data.contractArr.push({
              contractContent: this.contractText17,
              contractTitle: this.financeProgram.contract && this.financeProgram.contract.split('&&&')[0]
            })
          }
          if (this.contractContent18) {
            data.contractArr.push({
              contractContent: this.contractText18,
              contractTitle: this.graduateProgram.contract && this.graduateProgram.contract.split('&&&')[0]
            })
          }
          if (this.contractContent20) {
            data.contractArr.push({
              contractContent: this.contractText19,
              contractTitle: this.tutoringProgram.contract && this.tutoringProgram.contract.split('&&&')[0]
            })
          }
          for (let i = 0; i < this.internshipListAll.length; i++) {
            data.contractArr.push({
              contractContent: this.internshipListAll[i].contractText,
              contractTitle: this.internshipListAll[i].contractContentTitle
            })
          }
          if (this.contractContent19) {
            data.contractArr.push({
              contractContent: this.contractText19,
              contractTitle: 'Wall Street Tequila 咨询服务合同-补充协议'
            })
          }
        }
        data.mentee.schoolName = data.mentee.school
        this.schoolList.forEach((v) => {
          if (v.schoolId == data.mentee.school) {
            data.mentee.schoolName = v.schoolName
          }
        })
        if (this.programId) {
          const basic = {
            program: this.baseProgram.programId,
            programWeight: this.baseProgram.programWeight,
            programName: this.baseProgram.programName,
            programPriceCny: this.baseProgram.priceCny,
            programPriceUsd: this.baseProgram.priceUsd,
            programPriceNote: this.baseProgram.programPriceNote,
            strategist: this.baseProgram.strategist,
            services: this.baseProgram.services,
            mentorHour:
              this.baseProgram.mentorHour && this.baseProgram.mentorHour > 0
                ? this.baseProgram.mentorHour
                : 0,
            vipHour: this.baseProgram.leadStrategistHour,
            leadStrategistHour: this.baseProgram.leadStrategistHour,
            note: this.baseProgram.note,
            program_level: this.baseProgram.program_level,
            program_type: this.baseProgram.program_type,

            applicationLetterModify: this.baseProgram.applicationLetterModify,
            jerryHour: this.baseProgram.jerryHour,
            seniorStrategist: this.baseProgram.seniorStrategist,
            hasContinual: this.baseProgram.hasContinual,
            hasEbookStore: this.baseProgram.hasEbookStore,
            emergencyMentor: this.baseProgram.emergencyMentor,
            interviewMentor: this.baseProgram.interviewMentor,
            priority: this.baseProgram.priority,
            certificateSubjectLiveCourseAuthority: this.baseProgram
              .certificateSubjectLiveCourseAuthority,
            mentorCount: this.baseProgram.mentorCount,
            tequilaShotHour: this.baseProgram.tequilaShotHour,
            seminars: this.baseProgram.seminars,
            officeHour: this.baseProgram.officeHour,
            liveLesson: this.baseProgram.liveLesson,
            seriesHour: this.baseProgram.seriesHour,
            officeHourStrategistSession: this.baseProgram.officeHourStrategistSession
          }
          if (this.checkList.indexOf('赠一对一补充协议') > -1) {
            if (this.baseProgram.mentorHour == '-1') {
              basic.mentorHour = -1
            } else {
              basic.mentorHour = this.baseProgram.mentorHour + this.supplementary.excessMentorHour
            }
          }
          if (this.checkList.indexOf('赠Jerry一对一补充协议') > -1) {
            if (this.baseProgram.jerryHour == '-1') {
              basic.jerryHour = -1
            } else {
              basic.jerryHour = this.baseProgram.jerryHour + this.supplementary.substituteMentorHour
            }
          }
          if (this.checkList.indexOf('赠TequilaShot补充协议') > -1) {
            console.log(this.baseProgram.tequilaShotHour, this.supplementary.excessSeriesHour)
            if (this.baseProgram.tequilaShotHour == '-1') {
              basic.tequilaShotHour = -1
            } else {
              basic.tequilaShotHour = this.baseProgram.tequilaShotHour + this.supplementary.excessSeriesHour
            }
          }
          data.basic = basic
        }
        console.log(this.internshipProgram, 44444444444444)
        if (this.internshipNum) {
          const internship = []
          for (let i = 0; i < this.internshipNum; i++) {
            const inter = {
              program: 3,
              programWeight: this.internshipProgram[i].programWeight,
              programPriceCny: this.internshipProgram[i].priceCny,
              programPriceUsd: this.internshipProgram[i].priceUsd,
              internshipFlag: this.internshipProgram[i].internshipFlag,
              internshipId: this.internshipProgram[i].internshipUnit[1],
              internshipNote: this.internshipProgram[i].note
              // internshipStartDate: this.internshipProgram[i].this.collect.startDate || '',
              // internshipEndDate: this.getEndDate(this.internshipProgram[i].this.collect.startDate,this.internshipProgram[i].periodUnit,this.internshipProgram[i].period),
            }
            internship.push(inter)
          }
          data.internship = internship
        }
        if (this.oralNum) {
          const oral = []
          for (let i = 0; i < this.oralNum; i++) {
            const inter = {
              program: this.oralProgram[i].programId,
              programWeight: this.oralProgram[i].programWeight,
              programPriceCny: this.oralProgram[i].priceCny,
              programPriceUsd: this.oralProgram[i].priceUsd,
              programId: this.oralProgram[i].programId,
              oralLessonHour: this.oralProgram[i].oralLessonHour,
              seriesHour: this.oralProgram[i].seriesHour,
              strategist: this.oralProgram[i].strategist,
              services: this.oralProgram[i].services,
              oralPeriod: this.oralProgram[i].oralPeriod,
              endDate: this.oralProgram[i].endDate,
              programPriceNote: this.oralProgram[i].note
            }
            oral.push(inter)
          }
          data.oral = oral
        }
        if (this.cfaNum) {
          const inter = {
            programWeight: this.cfaProgram.programWeight,
            program: this.cfaProgram.programId,
            programPriceCny: this.cfaProgram.priceCny,
            programPriceUsd: this.cfaProgram.priceUsd,
            medalTokens: this.cfaProgram.medalTokens,
            programId: this.cfaProgram.programId,
            startDate: this.cfaProgram.startDate,
            endDate: this.cfaProgram.endDate,
            extendedEndDate: this.cfaProgram.extendedEndDate,
            note: this.cfaProgram.note
          }
          data.cfa = inter
        }
        if (this.financeNum) {
          const financeData = {
            programWeight: this.financeProgram.programWeight,
            program: this.financeProgram.programId,
            programPriceCny: this.financeProgram.priceCny,
            programPriceUsd: this.financeProgram.priceUsd,
            medalTokens: this.financeProgram.medalTokens,
            financeHour: this.financeProgram.financeHour,
            strategist: this.financeProgram.strategist,
            services: this.financeProgram.services,
            programId: this.financeProgram.programId,
            startDate: this.financeProgram.startDate,
            endDate: this.financeProgram.endDate,
            extendedEndDate: this.financeProgram.extendedEndDate,
            note: this.financeProgram.note
          }
          data.finance = financeData
        }
        if (this.tutoringNum) {
          const tutoringData = {
            programWeight: this.tutoringProgram.programWeight,
            program: this.tutoringProgram.programId,
            programPriceCny: this.tutoringProgram.priceCny,
            programPriceUsd: this.tutoringProgram.priceUsd,
            medalTokens: this.tutoringProgram.medalTokens,
            tutoringMentorHour: this.tutoringProgram.tutoringMentorHour,
            strategist: this.tutoringProgram.strategist,
            services: this.tutoringProgram.services,
            programId: this.tutoringProgram.programId,
            startDate: this.tutoringProgram.startDate,
            endDate: this.tutoringProgram.endDate,
            extendedEndDate: this.tutoringProgram.extendedEndDate,
            note: this.tutoringProgram.note
          }
          data.tutoring = tutoringData
        }
        if (this.graduateNum) {
          const graduateData = {
            programWeight: this.graduateProgram.programWeight,
            program: this.graduateProgram.programId,
            programPriceCny: this.graduateProgram.priceCny,
            programPriceUsd: this.graduateProgram.priceUsd,
            programId: this.graduateProgram.programId,
            startDate: this.graduateProgram.startDate,
            endDate: this.graduateProgram.endDate,
            extendedEndDate: this.graduateProgram.extendedEndDate,
            liveLesson: this.graduateProgram.liveLesson,
            gpBackgroundPromotionQuantity: this.graduateProgram.gpBackgroundPromotionQuantity,
            gpBackgroundPromotionPriceCny: this.graduateProgram.gpBackgroundPromotionPriceCny,
            gpBackgroundPromotionPriceUsd: this.graduateProgram.gpBackgroundPromotionPriceUsd,
            gpMajorQuantity: this.graduateProgram.gpMajorQuantity,
            gpProgramApplyQuantity: this.graduateProgram.gpProgramApplyQuantity,
            gpApplyYear: this.graduateProgram.gpApplyYear,
            gpApplySeason: this.graduateProgram.gpApplySeason,
            gpApplyCountry: this.graduateProgram.gpApplyCountry.join('/'),
            mentorHour: this.graduateProgram.mentorHour,
            note: this.graduateProgram.note
          }
          data.graduateProgram = graduateData
        }
        if (!this.collect.totalPriceUsd) {
          this.collect.totalPriceUsd = this.baseProgram.basePriceUsd
          this.collect.totalPriceCny = this.collect.totalPriceUsd * this.collect.rate
        } else {
          this.collect.totalPriceCny = this.collect.totalPriceUsd * this.collect.rate
        }
        let pretalkName = ''
        if (this.collect.pretalkId) {
          this.pretalkList.forEach(item => {
            if (this.collect.pretalkId == item.pretalkId) {
              pretalkName = item.pretalkName
            }
          })
        }
        const collect = {
          // vipRecommendStatus: this.collect.vipRecommendStatus,
          // vipRecommender: this.collect.vipRecommender,
          orderType: this.collect.orderType,
          signDate: this.collect.signDate,
          signCompany: this.collect.signCompany,
          pretalkId: this.collect.pretalkId,
          realName: this.menteeDetail.realName,
          pretalkName: pretalkName,
          startDate: this.collect.startDate,
          endDate: this.checkList.indexOf('赠时长 (常规)补充协议') > -1 ? this.supplementary.newEndData : this.collect.endDate,
          contact1: this.collect.contact1,
          contact2: this.collect.contact2,
          rate: this.collect.rate,
          orderPrice: this.collect.totalPriceCny * this.supplementary.discountNum || this.collect.totalPriceCny,
          orderPriceUsd: this.collect.totalPriceUsd * this.supplementary.discountNum || this.collect.totalPriceUsd
        }
        // if(){

        // }
        if (this.collect.discountInfo) {
          collect.discountStatus = 1
          if (this.supplementary.discountRate == '9折') {
            collect.discountProportion = 10
          } else if (this.supplementary.discountRate == '95折') {
            collect.discountProportion = 5
          } else {
            collect.discountProportion = 0
          }
          collect.discountInfo = this.collect.discountInfo
        }
        data.collect = collect
        // 礼品数据格式
        let giftCan = true
        if (this.gift.gifts.length) {
          this.gift.gifts.forEach((v) => {
            if (!v.gift) {
              this.$message('有礼物没有选！')
              giftCan = false
              return
            }
            v.giftId = v.gift.split('&&')[0]
          })
          const gift = {
            recipientName: this.gift.recipientName || '',
            recipientPhone: this.gift.recipientPhone || '',
            recipientAddr: this.gift.recipientAddr || '',
            remark: this.gift.remark || '',
            giftArr: this.gift.gifts
          }

          data.gift = gift
        }
        if (!giftCan) {
          return
        }
        // transition
        const transition = {
          parentJob: this.transition.parentJob,
          parentPersonality: this.transition.parentPersonality,
          parentExpectation: this.transition.parentExpectation,
          parentControl: this.transition.parentControl,
          parentPurchasingPower: this.transition.parentPurchasingPower,
          menteeIndustryLevel: this.transition.menteeIndustryLevel,
          menteeMentality: this.transition.menteeMentality,
          notice: this.transition.notice
        }
        data.transition = transition
        //  补充协议数据
        // data.supplementary = this.supplementary;
        // 发票
        if (this.invoice.hasInvoice == 0) {
          data.invoiceTitle = { ...this.invoice }
        }
        if (data.collect.startDate > data.collect.endDate) {
          this.$message('合同终止日期不可小于开始日期')
          this.internshipListAll = []
          return false
        } else {
          if (!this.signOnline) {
            if (data.collect.signDate > data.collect.startDate) {
              this.$message('合同起始日期不可小于签约日期')
              return false
            }
          }
          console.log(data, 'yx***********提交的数据')
          this.signSubmit(data)
          // this.signSubmitData = data;
          // this.rebateVisible = true;
          // this.signDetailVisibleLocal = false;
        }
      }
    },
    createURL2 () {
      let canGo = true
      if (/^[a-z]|\s[a-z]/.test(this.menteeDetail.chiName)) {
        this.$message({
          type: 'warning',
          message: '请检查法定名输入规范'
        })
        return
      }
      for (let i = 0; i < this.schoolList.length; i++) {
        if (this.schoolList[i].schoolId == this.menteeDetail.school) {
          if (this.schoolList[i].engName) {
            if (this.schoolList[i].engName.indexOf('Other') != '-1') {
              this.$message({
                type: 'warning',
                message: '请选择具体的学校，若无匹配学校请联系销售助理添加学校后继续录入'
              })
              return
            }
          }
        }
      }
      for (let i = 0; i < this.internshipNum; i++) {
        if (!this.internshipProgram[i].internshipUnit[1]) {
          this.$message({
            type: 'warning',
            message: '请检查实习单位'
          })
          return
        }
        if (!this.internshipProgram[i].contract) {
          this.$message({
            type: 'warning',
            message: '实习合同为必选请检查'
          })
          return
        }
        if (this.internshipProgram[i].internshipFlag != '0' && this.internshipProgram[i].internshipFlag != '1') {
          this.$message({
            type: 'warning',
            message: '实习安排方式为必选请检查'
          })
          return
        }
        if (!this.internshipProgram[i].note) {
          this.$message({
            type: 'warning',
            message: '实习备注为必填项请检查'
          })
          return
        }
      }
      for (let i = 0; i < this.oralNum; i++) {
        if (!this.oralProgram[i].programId) {
          this.$message({
            type: 'warning',
            message: '请检查口语项目'
          })
          return
        }
        if (!this.oralProgram[i].contract) {
          this.$message({
            type: 'warning',
            message: '口语项目合同为必选请检查'
          })
          return
        }
        if (!this.oralProgram[i].endDate) {
          this.$message({
            type: 'warning',
            message: '口语项目结束日期必填'
          })
          return
        }
        if (!this.oralProgram[i].oralPeriod) {
          this.$message({
            type: 'warning',
            message: '口语项目周期必填'
          })
          return
        }
      }
      if (this.cfaNum && !this.cfaProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查CFA项目'
        })
        return
      } else {
        if (this.cfaNum && !this.cfaProgram.contract) {
          this.$message({
            type: 'warning',
            message: 'CFA项目合同为必选请检查'
          })
          return
        }
      }
      if (this.financeNum && !this.financeProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查申研项目'
        })
        return
      } else {
        if (this.financeNum && !this.financeProgram.contract) {
          this.$message({
            type: 'warning',
            message: '财商项目合同为必选请检查'
          })
          return
        }
      }
      if (this.tutoringNum && !this.tutoringProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查课业度辅导项目'
        })
        return
      } else {
        if (this.tutoringNum && !this.tutoringProgram.contract) {
          this.$message({
            type: 'warning',
            message: '业度辅导项目合同为必选请检查'
          })
          return
        }
      }
      if (this.graduateNum && !this.graduateProgram.programId) {
        this.$message({
          type: 'warning',
          message: '请检查申研项目'
        })
        return
      } else {
        if (this.graduateNum && !this.graduateProgram.contract) {
          this.$message({
            type: 'warning',
            message: '申研项目合同为必选请检查'
          })
          return
        }
      }
      this.$refs.menteeDetail.validate((valid) => {
        if (!valid) canGo = false
      })
      if (this.supplementary.discountRate == '9折' || this.supplementary.discountRate == '95折') {
        this.priceOff = true
        if (this.collect.discountInfo) {
        } else {
          this.$message.error('当为折扣订单时，折扣说明为必填项！！')
          canGo = false
          return false
        }
      } else {
        this.priceOff = false
      }
      // transition
      this.$refs.transition.validate((valid) => {
        if (!valid) canGo = false
      })
      // this.$refs.oralProgram.validate((valid) => {
      //   if (!valid) canGo = false;
      // });
      this.$refs.cfaProgram &&
        this.$refs.cfaProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.financeProgram &&
        this.$refs.financeProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.tutoringProgram &&
        this.$refs.tutoringProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.graduateProgram &&
        this.$refs.graduateProgram.validate((valid) => {
          if (!valid) canGo = false
        })
      this.$refs.baseProgram &&
        this.$refs.baseProgram.validate((valid) => {
          if (!valid) canGo = false
        })

      this.$refs.internshipProgram &&
        this.$refs.internshipProgram.validate((valid) => {
          if (!valid) {
            canGo = false
          }
          // else{
          //   for(let i=0;i<this.internshipNum;i++){
          //     if(!this.internshipProgram[i].contract){
          //       this.$message.error('每个实习都要对应的实习模板为必填项')
          //       canGo = false;
          //     }
          //   }
          // }
        })
      this.$refs.collect.validate((valid) => {
        if (!valid) {
          canGo = false
        } else {
          this.changeTime()
        }
      })
      // 礼物
      // this.$refs.gift &&
      //   this.$refs.gift.validate((valid) => {
      //     if (!valid) {
      //       canGo = false
      //     }else{
      //       if(this.gift.hasGift == '1'){
      //         if(this.checkList.length <= 0 || !(this.checkList.indexOf('礼品补充协议') > -1)){
      //           this.$message.error('当有礼品时必须有礼品补充协议！！')
      //           canGo = false
      //         }
      //       }
      //     }
      //   });

      // 补充协议  折扣协议时需要为折扣订单
      this.$refs.supplementary &&
        this.$refs.supplementary.validate((valid) => {
          if (!valid) {
            canGo = false
          } else {
            if (this.checkList.indexOf('礼品补充协议') > -1) {
              if (this.gift.hasGift != '1') {
                this.$message.error('当有礼品类型的补充协议时，礼品为必选项！！')
                canGo = false
              }
            }
          }
        })
      // 发票
      this.$refs.invoice &&
        this.$refs.invoice.validate((valid) => {
          if (!valid) canGo = false
        })
      // 确认金额是否打折
      // 判断有折扣说明
      this.baseProgram.currencyType // 项目货币基准
      // 计算价格打折比例；%
      let priceRate = offPrice(
        this.baseProgram.currencyType == 'cny'
          ? this.baseProgram.basePriceCny
          : this.baseProgram.basePriceUsd * this.collect.rate,
        this.baseProgram.currencyType == 'cny'
          ? this.baseProgram.priceCny
          : this.baseProgram.priceUsd * this.collect.rate,
        this.internshipProgram,
        this.oralProgram,
        this.cfaProgram,
        this.financeProgram,
        this.tutoringProgram,
        this.graduateProgram,
        this.collect.rate
      )
      if (priceRate >= 5) {
        if (!this.collect.discountInfo) {
          this.$message({
            type: 'warning',
            message: '价格有折扣，请填写折扣说明'
          })
          this.priceOff = true
          return
        }
      } else {
        if (this.extentRate <= this.collect.rate) {
        } else {
          priceRate = 5
        }
      }
      // 计算价格打折比例；%,(基础项目原件，基础项目现价，实习项目，口语项目，汇率)
      function offPrice (bp, nbp, internship, oral, cfa, r) {
        let totalP = bp * 1
        let nTotalP = nbp * 1
        internship.length &&
          internship.forEach((v) => {
            totalP += v.basePriceUsd * r
            nTotalP += v.priceUsd * r
          })
        oral.length &&
          oral.forEach((v) => {
            totalP += v.basePriceUsd * r
            nTotalP += v.priceUsd * r
          })
        if (cfa.programId) {
          totalP += cfa.basePriceUsd * r
          nTotalP += cfa.priceUsd * r
        }
        console.log(nTotalP, totalP)
        return ((totalP - nTotalP) / totalP) * 100
      }
      // 礼品价值不超过合同金额5%
      let giftTotalPriceForOrderPrice = 0
      this.gift.gifts.forEach((v) => {
        if (v.gift) {
          giftTotalPriceForOrderPrice += v.gift.split('&&')[2] * 1 * v.giftNum
        } else {
          this.$message({
            type: 'warning',
            message: '请选择具体礼物'
          })
        }
      })
      console.log(this.collect.totalPriceCny, this.baseProgram.basePriceUsd * this.collect.rate, canGo, 44444444444444444)
      if (!this.collect.totalPriceUsd) {
        this.collect.totalPriceCny = this.baseProgram.basePriceUsd * this.collect.rate
      } else {
        this.collect.totalPriceCny = this.collect.totalPriceUsd * this.collect.rate
      }
      if (
        (this.collect.totalPriceCny * 5) / 100 <
        giftTotalPriceForOrderPrice
      ) {
        this.$message({
          type: 'warning',
          message: '礼品价值不得超过合同总金额5%'
        })
        return
      }
      if (canGo) {
        this.changePdf()
      }
    },
    rebateClose () {
      this.rebateVisible = false
      this.signSubmitData = {
        collect: {},
        mentee: {}
      }
      this.signDetailClose()
    },
    backToDetail () {
      this.rebateVisible = false
      this.signSubmitData = {
        collect: {},
        mentee: {}
      }
      this.internshipListAll = []
      this.signDetailVisibleLocal = true
    },
    rebateSubmit (data) {
      this.signSubmit(data)
      this.rebateClose()
    },
    signSubmit (data) {
      // 线下/线上
      this.$loading()
      console.log('创建签约在线签约参数yx***********', data)
      if (this.signOnline) {
        api
          .createOnlineContract(data)
          .then((res) => {
            console.log('创建签约在线签约', res)
            this.$loading().close()
            this.$emit('onlineSuccess', res.data.pageUrl, res.data)
            this.clear()
          })
          .catch((err) => {
            this.$message({
              type: 'warning',
              message: err.message
            })
            this.$loading().close()
            console.log(err)
          })
      } else {
        api
          .createOfflineContract(data)
          .then((res) => {
            console.log('创建签约线下签约', res)
            this.$loading().close()
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.$emit('success')
            this.clear()
          })
          .catch((err) => {
            console.log(err)
            this.$message({
              type: 'error',
              message: err.message
            })
            this.$loading().close()
          })
      }
    },
    clear () {
      this.programId = null
      this.contractList = []
      this.templateList = []
      this.contractText = ''
      this.contractContent = ''
      this.contractContent2 = ''
      this.contractContent3 = ''
      this.contractContent4 = ''
      this.contractContent5 = ''
      this.contractContent6 = ''
      this.contractContent7 = ''
      this.contractContent8 = ''
      this.contractContent9 = ''
      this.contractContent10 = ''
      this.contractContent11 = ''
      this.contractContent12 = ''
      this.contractContent13 = ''
      this.contractContent14 = ''
      this.contractContent15 = ''
      this.contractContent16 = ''
      this.contractContent17 = ''
      this.contractContent18 = ''
      this.contractContent19 = ''
      this.contractContent20 = ''
      this.internshipListAll = []
      this.contractText2 = ''
      this.contractText3 = ''
      this.contractText4 = ''
      this.contractText5 = ''
      this.contractText6 = ''
      this.contractText7 = ''
      this.contractText8 = ''
      this.contractText9 = ''
      this.contractText10 = ''
      this.contractText11 = ''
      this.contractText12 = ''
      this.contractText13 = ''
      this.contractText14 = ''
      this.contractText15 = ''
      this.contractText16 = ''
      this.contractText17 = ''
      this.contractText18 = ''
      this.checkList = []
      // 学员基本信息
      this.menteeDetail = {
        wxId: '',
        menteeId: '',
        realName: '',
        email: '',
        sex: '',
        highSchool: '',
        school: '',
        telephone: '',
        finishYear: '',
        degree: '',
        sourceFrom: []
      }
      // Transition信息
      this.transition = {
        parentJob: '',
        parentPersonality: '',
        parentExpectation: '',
        parentControl: '',
        parentPurchasingPower: '',
        menteeIndustryLevel: '',
        menteeMentality: '',
        notice: ''
      }
      // 基本项目信息
      this.baseProgram = {
        programName: '',
        basePriceCny: '',
        basePriceUsd: '',
        currencyType: '',
        priceCny: '',
        priceUsd: '',
        programPriceNote: '',
        strategist: '',
        services: '',
        mentorHour: 0,
        leadStrategistHour: 0,
        applicationLetterModify: 0,
        jerryHour: 0,
        seniorStrategist: '',
        hasContinual: '',
        hasEbookStore: '',
        emergencyMentor: '',
        interviewMentor: '',
        priority: '',
        certificateSubjectLiveCourseAuthority: '',
        mentorCount: 0,
        tequilaShotHour: 0,
        seminars: 0,
        officeHour: 0,
        seriesHour: 0,
        liveLesson: 0,
        officeHourStrategistSession: 0
      }
      // 实习项目信息
      this.internshipProgram = [
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        },
        {
          internshipUnit: [],
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          internshipLocation: '',
          internshipFlag: '',
          internshipDuration: ''
        }
      ]
      this.oralProgram = [
        {
          programId: '',
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          oralLessonHour: 0,
          seriesHour: 0,
          services: '',
          strategist: ''
        },
        {
          programId: '',
          basePriceUsd: 0,
          priceCny: 0,
          priceUsd: 0,
          note: '',
          oralLessonHour: 0,
          seriesHour: 0,
          services: '',
          strategist: ''
        }
      ]
      this.cfaProgram = {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        medalTokens: 0,
        note: '',
        startDate: '',
        endDate: '',
        extendedEndDate: ''
      }
      this.financeProgram = {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        financeHour: 0,
        strategist: '',
        services: '',
        medalTokens: 0,
        note: '',
        startDate: '',
        endDate: '',
        extendedEndDate: ''
      }
      this.tutoringProgram = {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        tutoringMentorHour: 0,
        strategist: '',
        services: '',
        medalTokens: 0,
        note: '',
        startDate: '',
        endDate: '',
        extendedEndDate: ''
      }
      this.graduateProgram = {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        note: '',
        startDate: '',
        endDate: '',
        extendedEndDate: ''
      }
      // 汇总信息
      this.collect = {
        // vipRecommendStatus: '',
        // vipRecommender: '',
        startDate: '',
        endDate: '',
        extendedEndDate: '',
        contact1: '',
        contact2: '',
        totalPriceCny: '',
        totalPriceUsd: '',
        rate: '',
        orderType: '0',
        signDate: '',
        contract: '',
        signCompany: '',
        pretalkId: '',
        discountInfo: ''
      }
      // 礼物信息
      this.gift = {
        hasGift: null,
        gifts: [],
        recipientName: '',
        recipientPhone: '',
        recipientAddr: '',
        remark: ''
      }
      this.supplementary = {
        discountInfo: '',
        hasSupplementary: '',
        supplementaryType: '',
        contractContent2: '',
        contractContent3: '',
        contractContent4: '',
        contractContent5: '',
        contractContent6: '',
        contractContent7: '',
        contractContent8: '',
        contractContent9: '',
        contractContent10: '',
        contractContent11: '',
        contractContent12: '',
        contractContent13: '',
        contractContent14: '',
        pkId: '',
        pkId2: '',
        pkId3: '',
        pkId4: '',
        pkId5: '',
        pkId6: '',
        internshipWebsite: '',
        pkId7: '',
        formalismContractName: '',
        pkId8: '',
        pkId9: '',
        pkId10: '',
        pkId11: '',
        pkId12: '',
        pkId13: '',
        payInFullDate: '',
        payInFullDate2: '',
        payInFullDate3: '',
        payInFullDate4: '',
        payInFullDate5: '',
        payInFullDate6: '',
        payInFullDate7: '',
        tempMentorHour: '',
        depositUsd: '',
        retainageUsd: '',
        excessSeriesHour: '',
        excessPriceUsd: '',
        excessTimeName: '',
        newEndData: '',
        excessMentorHour: '',
        tempMentorHour2: '',
        basePriceCny: '',
        basePriceUsd: '',
        discountRate: '',
        discountNum: 1
      }
      // 发票信息
      this.invoice = {
        hasInvoice: null,
        invoiceType: null,
        invoiceTitle: '',
        invoiceAccount: '',
        invoiceAddr: '',
        invoicePhone: '',
        invoiceBank: '',
        invoiceBankAccount: '',
        // invoiceStatus: "",
        recipientName: '',
        recipientPhone: '',
        recipientAddr: '',
        remark: ''
      }
      this.entrust = {
        checkList: [],
        allographName: '',
        relationship: '',
        payingName: '',
        entrustPrice: '0(￥) / 0($)'
      },
      this.$refs.menteeDetail && this.$refs.menteeDetail.resetFields()
      this.$refs.transition && this.$refs.transition.resetFields()
      this.$refs.baseProgram && this.$refs.baseProgram.resetFields()
      this.$refs.internshipProgram && this.$refs.internshipProgram.resetFields()
      this.$refs.oralProgram && this.$refs.oralProgram.resetFields()
      this.$refs.cfaProgram && this.$refs.cfaProgram.resetFields()
      this.$refs.financeProgram && this.$refs.financeProgram.resetFields()
      this.$refs.tutoringProgram && this.$refs.tutoringProgram.resetFields()
      this.$refs.graduateProgram && this.$refs.graduateProgram.resetFields()
      // this.$refs.gift && this.$refs.gift.resetFields();
      this.$refs.supplementary && this.$refs.supplementary.resetFields()
      this.$refs.invoice && this.$refs.invoice.resetFields()
      console.log(22222222222222222222, this.$refs.collect)
      this.$refs.collect && this.$refs.collect.resetFields()
      console.log(111111111111111, 33333333333333)
    },
    // 修改合同内容
    changePdf () {
      // this.$refs.gift &&
      // this.$refs.gift.validate((valid) => {
      //   console.log(valid)
      //   if (!valid){
      //       this.$message({
      //       message: '请填写完整信息并检查手机号格式是否正确~~',
      //       type: 'error'
      //     });
      //     return false
      //   }else{
      this.$refs.menteeDetail.validate((valid) => {
        if (!valid) return
        // 富文本拼接
        this.$refs.collect.validate((valid) => {
          if (!valid) return
          if (!this.collect.totalPriceUsd) {
            this.collect.totalPriceUsd = this.baseProgram.basePriceUsd
            this.collect.totalPriceCny = this.collect.totalPriceUsd * this.collect.rate
          } else {
            this.collect.totalPriceCny = this.collect.totalPriceUsd * this.collect.rate
          }
          if (this.supplementary && this.checkList.indexOf('礼品补充协议') > -1) {
            this.supplementaryPdf()
          } else {
            this.contractContent2 = ''
          }
          if (this.supplementary && this.checkList.indexOf('折扣补充协议') > -1) {
            this.dicountPdf()
          } else {
            this.contractContent3 = ''
          }
          if (this.supplementary && this.checkList.indexOf('Specify实习补充协议') > -1) {
            this.nextPdf()
          } else {
            this.contractContent4 = ''
          }

          if (this.supplementary && this.checkList.indexOf('实习补差价补充协议') > -1) {
            this.nextPdf2()
          } else {
            this.contractContent5 = ''
          }
          if (this.supplementary && this.checkList.indexOf('不可抗力/不能继续提供服务的情况补充协议') > -1) {
            this.nextPdf3()
          } else {
            this.contractContent6 = ''
          }
          if (this.supplementary && this.checkList.indexOf('关于实习内容的情况补充协议') > -1) {
            this.nextPdf4()
          } else {
            this.contractContent7 = ''
          }
          if (this.supplementary && this.checkList.indexOf('关于形式合同的补充说明补充协议') > -1) {
            this.nextPdf5()
          } else {
            this.contractContent8 = ''
          }
          if (this.supplementary && this.checkList.indexOf('不可实名宣传补充协议') > -1) {
            this.nextPdf6()
          } else {
            this.contractContent9 = ''
          }
          if (this.supplementary && this.checkList.indexOf('赠TequilaShot补充协议') > -1) {
            this.nextPdf7()
          } else {
            this.contractContent10 = ''
          }
          if (this.supplementary && this.checkList.indexOf('赠一对一补充协议') > -1) {
            this.nextPdf8()
          } else {
            this.contractContent11 = ''
          }
          if (this.supplementary && this.checkList.indexOf('赠时长 (常规)补充协议') > -1) {
            this.nextPdf9()
          } else {
            this.contractContent12 = ''
          }
          if (this.supplementary && this.checkList.indexOf('赠Jerry一对一补充协议') > -1) {
            this.nextPdf10()
          } else {
            this.contractContent13 = ''
          }
          if (this.supplementary && this.checkList.indexOf('分期补充协议') > -1) {
            this.nextPdf11()
          } else {
            this.contractContent14 = ''
          }
          if (!this.programId && this.oralProgram[0].programId) {
            this.nextPdf12()
          } else {
            this.contractContent15 = ''
          }
          if (!this.programId && this.cfaProgram.programId) {
            this.nextPdf13()
          } else {
            this.contractContent16 = ''
          }
          if (!this.programId && this.financeProgram.programId) {
            this.nextPdf14()
          } else {
            this.contractContent17 = ''
          }
          if (!this.programId && this.graduateProgram.programId) {
            this.nextPdf16()
          } else {
            this.contractContent18 = ''
          }
          if (!this.programId && this.tutoringProgram.programId) {
            this.nextPdf20()
          } else {
            this.contractContent20 = ''
          }
          if (!this.programId && this.internshipProgram[0].contract) {
            this.nextPdf15()
          } else {
            this.internshipListAll = []
          }
          if (this.entrust.checkList.length > 0) {
            this.$refs.entrust.validate((valid) => {
              if (!valid) {
                this.$message.error('请填写完整信息~~')
                return false
              } else {
                this.nextPdf17()
              }
            })
          }
          this.changePDFShow = true
        })
      })
      //   }
      // });
    },
    supplementaryPdf () {
      let contractContent2 = ''
      for (let i = 0; i < this.templateList.length; i++) {
        if (this.supplementary.pkId == this.templateList[i].pkId) {
          contractContent2 = this.templateList[i].contractContent
          this.supplementary.contractContent2 = contractContent2
        }
      }
      if (!contractContent2) {
        this.$message('补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent2))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'payInFullDate') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.supplementary.payInFullDate || '空') +
                '</span>'
            )
        }
        if (param == 'giftName') {
          let giftName = ''
          this.gift.gifts &&
            this.gift.gifts.forEach((v) => {
              giftName += v.gift.split('&&')[1] + '*' + v.giftNum + ', '
            })
          const len = giftName.length - 2
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (giftName.length ? giftName.substr(0, len) : '__________') +
                '</span>'
            )
        } else if (param == 'giftTotalPrice') {
          let giftTotalPrice = 0
          this.gift.gifts &&
            this.gift.gifts.forEach((v) => {
              giftTotalPrice += v.gift.split('&&')[2] * 1 * v.giftNum
            })
          giftTotalPrice = parseFloat(giftTotalPrice.toFixed(1))
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' + giftTotalPrice + '</span>'
            )
        } else if (param == 'totalPriceCny') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent2 = contractContent2
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent2)
      this.contractContent2 = contractContent2
    },
    dicountPdf () {
      let contractContent3 = ''
      for (let i = 0; i < this.templateList2.length; i++) {
        if (this.supplementary.pkId2 == this.templateList2[i].pkId) {
          contractContent3 = this.templateList2[i].contractContent
          this.supplementary.contractContent3 = contractContent3
        }
      }
      if (!contractContent3) {
        this.$message('补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent3))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'payInFullDate') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.supplementary.payInFullDate2 || '空') +
                '</span>'
            )
        }
        if (param == 'totalPriceCny') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent3 = contractContent3
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent3)
      this.contractContent3 = contractContent3
    },
    nextPdf () {
      let contractContent4 = ''
      for (let i = 0; i < this.templateList3.length; i++) {
        if (this.supplementary.pkId3 == this.templateList3[i].pkId) {
          contractContent4 = this.templateList3[i].contractContent
          this.supplementary.contractContent4 = contractContent4
        }
      }
      if (!contractContent4) {
        this.$message('Specify实习补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent4))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        if (param == 'totalPriceCny') {
          contractContent4 = contractContent4
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent4 = contractContent4
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent4 = contractContent4
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent4 = contractContent4
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        }
      })
      const arr3 = []
      const arr2 = []
      for (let i = 0; i < this.internshipProgram.length; i++) {
        for (let j = 0; j < this.internshipUnitList.length; j++) {
          for (let m = 0; m < this.internshipUnitList[j].internshipArr.length; m++) {
            if (this.internshipProgram[i].internshipUnit[1] == this.internshipUnitList[j].internshipArr[m].internshipId) {
              arr3.push(`${this.internshipProgram[i].internshipUnit[0]}${this.internshipUnitList[j].internshipArr[m].internshipName}`)
            }
          }
        }
      }
      for (let i = 0; i < this.internshipProgram.length; i++) {
        for (let j = 0; j < this.internship_duration.length; j++) {
          if (this.internshipProgram[i].internshipDuration == this.internship_duration[j].itemValue) {
            arr2.push(this.internship_duration[j].itemName)
          }
        }
      }
      let strAll = ''
      for (let i = 0; i < this.internshipProgram.length; i++) {
        if (this.internshipProgram[i].internshipLocation) {
          let str = ''
          str = contractContent4
          console.log(i, 2222222222222)
          arr.forEach((v) => {
            const param = v[0].substr(2, v[0].length - 3)
            console.log(v[0], param, arr3, this.internshipProgram[i].internshipLocation, this.internshipProgram[i].internshipLocation)
            if (param == 'internshipName') {
              str = str
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    (arr3[i] || '空') +
                    '</span>'
                )
            } else if (param == 'internshipLocationName') {
              str = str
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    (this.internshipProgram[i].internshipLocation || '空') +
                    '</span>'
                )
            } else if (param == 'internshipTimeName') {
              str = str
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    (arr2[i] || '空') +
                    '</span>'
                )
            }
          })
          strAll += `${str}
          `
        }
      }
      console.log(strAll)
      this.contractContent4 = strAll
    },
    nextPdf2 () {
      let contractContent5 = ''
      for (let i = 0; i < this.templateList4.length; i++) {
        if (this.supplementary.pkId4 == this.templateList4[i].pkId) {
          contractContent5 = this.templateList4[i].contractContent
          this.supplementary.contractContent5 = contractContent5
        }
      }
      if (!contractContent5) {
        this.$message('实习补差价补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent5))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'totalPriceCny') {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent5 = contractContent5
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent5)
      this.contractContent5 = contractContent5
    },
    nextPdf3 () {
      let contractContent6 = ''
      for (let i = 0; i < this.templateList5.length; i++) {
        if (this.supplementary.pkId5 == this.templateList5[i].pkId) {
          contractContent6 = this.templateList5[i].contractContent
          this.supplementary.contractContent6 = contractContent6
        }
      }
      if (!contractContent6) {
        this.$message('不可抗力/不能继续提供服务的情况补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent6))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'totalPriceCny') {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        }
        if (param == 'internship') {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent6 = contractContent6
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent6)
      this.contractContent6 = contractContent6
    },
    nextPdf4 () {
      let contractContent7 = ''
      for (let i = 0; i < this.templateList6.length; i++) {
        if (this.supplementary.pkId6 == this.templateList6[i].pkId) {
          contractContent7 = this.templateList6[i].contractContent
          this.supplementary.contractContent7 = contractContent7
        }
      }
      if (!contractContent7) {
        this.$message('关于实习内容的情况补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent7))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'internshipWebsite') {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.internshipWebsite +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent7 = contractContent7
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent7)
      this.contractContent7 = contractContent7
    },
    nextPdf5 () {
      let contractContent8 = ''
      for (let i = 0; i < this.templateList7.length; i++) {
        if (this.supplementary.pkId7 == this.templateList7[i].pkId) {
          contractContent8 = this.templateList7[i].contractContent
          this.supplementary.contractContent8 = contractContent8
        }
      }
      if (!contractContent8) {
        this.$message('关于形式合同的补充说明补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent8))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'formalismContractName') {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.formalismContractName +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent8 = contractContent8
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent8)
      this.contractContent8 = contractContent8
    },
    nextPdf6 () {
      let contractContent9 = ''
      for (let i = 0; i < this.templateList8.length; i++) {
        if (this.supplementary.pkId8 == this.templateList8[i].pkId) {
          contractContent9 = this.templateList8[i].contractContent
          this.supplementary.contractContent9 = contractContent9
        }
      }
      if (!contractContent9) {
        this.$message('不可实名宣传补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent9))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'totalPriceCny') {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent9 = contractContent9
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent9)
      this.contractContent9 = contractContent9
    },
    nextPdf7 () {
      let contractContent10 = ''
      for (let i = 0; i < this.templateList9.length; i++) {
        if (this.supplementary.pkId9 == this.templateList9[i].pkId) {
          contractContent10 = this.templateList9[i].contractContent
          this.supplementary.contractContent10 = contractContent10
        }
      }
      if (!contractContent10) {
        this.$message('不可实名宣传补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent10))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'payInFullDate') {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
               this.supplementary.payInFullDate6 +
                '</span>'
            )
        } else if (param == 'excessPriceUsd') {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.excessPriceUsd +
                '</span>'
            )
        } else if (param == 'excessSeriesHour') {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.excessSeriesHour +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent10 = contractContent10
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      this.contractContent10 = contractContent10
    },
    nextPdf8 () {
      let contractContent11 = ''
      for (let i = 0; i < this.templateList10.length; i++) {
        if (this.supplementary.pkId10 == this.templateList10[i].pkId) {
          contractContent11 = this.templateList10[i].contractContent
          this.supplementary.contractContent11 = contractContent11
        }
      }
      if (!contractContent11) {
        this.$message('不可实名宣传补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent11))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'payInFullDate') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.payInFullDate3 +
                '</span>'
            )
        } else if (param == 'excessMentorHour') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.excessMentorHour +
                '</span>'
            )
        } else if (param == 'tempMentorHour') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.tempMentorHour +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent11 = contractContent11
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent11)
      this.contractContent11 = contractContent11
    },
    nextPdf9 () {
      let contractContent12 = ''
      for (let i = 0; i < this.templateList11.length; i++) {
        if (this.supplementary.pkId11 == this.templateList11[i].pkId) {
          contractContent12 = this.templateList11[i].contractContent
          this.supplementary.contractContent12 = contractContent12
        }
      }
      if (!contractContent12) {
        this.$message('不可实名宣传补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent12))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'payInFullDate') {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.payInFullDate5 +
                '</span>'
            )
        } else if (param == 'excessTimeName') {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.excessTimeName +
                '</span>'
            )
        } else if (param == 'endDate') {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.newEndData +
                '</span>'
            )
        } else if (param == 'originalEndDate') {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.collect.endDate +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent12 = contractContent12
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent12)
      this.contractContent12 = contractContent12
    },
    nextPdf10 () {
      let contractContent13 = ''
      for (let i = 0; i < this.templateList12.length; i++) {
        if (this.supplementary.pkId12 == this.templateList12[i].pkId) {
          contractContent13 = this.templateList12[i].contractContent
          this.supplementary.contractContent13 = contractContent13
        }
      }
      if (!contractContent13) {
        this.$message('不可实名宣传补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent13))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'totalPriceCny') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceCny * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'payInFullDate') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.payInFullDate4 +
                '</span>'
            )
        } else if (param == 'substituteMentorHour') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.substituteMentorHour +
                '</span>'
            )
        } else if (param == 'totalPriceUsd') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.supplementary.discountNum).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceCny') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat((this.collect.totalPriceUsd * this.collect.rate).toFixed(1)) +
                '</span>'
            )
        } else if (param == 'originalPriceUsd') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                parseFloat(this.collect.totalPriceUsd.toFixed(1)) +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent13 = contractContent13
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent13)
      this.contractContent13 = contractContent13
    },
    nextPdf11 () {
      let contractContent14 = ''
      for (let i = 0; i < this.templateList13.length; i++) {
        if (this.supplementary.pkId13 == this.templateList13[i].pkId) {
          contractContent14 = this.templateList13[i].contractContent
          this.supplementary.contractContent14 = contractContent14
        }
      }
      if (!contractContent14) {
        this.$message('不可实名宣传补充协议内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent14))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'payInFullDate') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.payInFullDate7 +
                '</span>'
            )
        } else if (param == 'depositUsd') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.depositUsd +
                '</span>'
            )
        } else if (param == 'depositCny') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' + this.supplementary.depositUsd * this.collect.rate + '</span>'
            )
        } else if (param == 'retainageUsd') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.retainageUsd +
                '</span>'
            )
        } else if (param == 'retainageCny') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.retainageUsd * this.collect.rate +
                '</span>'
            )
        } else if (param == 'tempMentorHour') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.supplementary.tempMentorHour2 +
                '</span>'
            )
        } else if (param == 'internship') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.internshipNum +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.oralProgram[0].oralLessonHour || '空') +
                '</span>'
            )
        } else {
          contractContent14 = contractContent14
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent14)
      this.contractContent14 = contractContent14
    },
    nextPdf12 () {
      // 口语项目合同
      let contractContent15 =
        this.oralProgram[0].contract && this.oralProgram[0].contract.split('&&&')[1]
      if (!contractContent15) {
        this.$message('合同内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent15))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'priceCny') {
          contractContent15 = contractContent15
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.oralProgram[0].priceCny +
                '</span>'
            )
        } else if (param == 'priceUsd') {
          contractContent15 = contractContent15
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.oralProgram[0].priceUsd +
                '</span>'
            )
        } else if (param == 'endDate') {
          contractContent15 = contractContent15
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.oralProgram[0].endDate +
                '</span>'
            )
        } else if (param == 'oralPeriod') {
          contractContent15 = contractContent15
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.oralProgram[0].oralPeriod +
                '</span>'
            )
        } else if (param == 'oralLessonHour') {
          contractContent15 = contractContent15
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.oralProgram[0].oralLessonHour +
                '</span>'
            )
        } else {
          contractContent15 = contractContent15
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent15)
      this.contractContent15 = contractContent15
    },
    nextPdf13 () {
      let contractContent16 =
        this.cfaProgram.contract && this.cfaProgram.contract.split('&&&')[1]
      if (!contractContent16) {
        this.$message('合同内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent16))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'priceCny') {
          contractContent16 = contractContent16
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.cfaProgram.priceCny +
                '</span>'
            )
        } else if (param == 'priceUsd') {
          contractContent16 = contractContent16
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.cfaProgram.priceUsd +
                '</span>'
            )
        } else {
          contractContent16 = contractContent16
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent16)
      this.contractContent16 = contractContent16
    },
    nextPdf14 () {
      // 财商项目合同
      let contractContent17 =
        this.financeProgram.contract && this.financeProgram.contract.split('&&&')[1]
      if (!contractContent17) {
        this.$message('合同内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent17))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'priceCny') {
          contractContent17 = contractContent17
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.financeProgram.priceCny +
                '</span>'
            )
        } else if (param == 'priceUsd') {
          contractContent17 = contractContent17
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.financeProgram.priceUsd +
                '</span>'
            )
        } else if (param == 'financeHour') {
          contractContent17 = contractContent17
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.financeProgram.financeHour +
                '</span>'
            )
        } else if (param == 'startDate') {
          contractContent17 = contractContent17
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.financeProgram.startDate +
                '</span>'
            )
        } else if (param == 'endDate') {
          contractContent17 = contractContent17
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.financeProgram.endDate +
                '</span>'
            )
        } else {
          contractContent17 = contractContent17
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent17)
      this.contractContent17 = contractContent17
    },
    nextPdf15 () {
      console.log(this.internshipProgram)
      for (let i = 0; i < this.internshipProgram.length; i++) {
        if (this.internshipProgram[i].contract) {
          var contractContent17 =
            this.internshipProgram[i].contract && this.internshipProgram[i].contract.split('&&&')[1]
          if (!contractContent17) {
            this.$message('合同内容为空，请联系管理员')
            return
          }
          const reg = /\$\{.+?\}/g
          const arr = []
          let r = []
          while ((r = reg.exec(contractContent17))) {
            arr.push(r)
          }
          this.programData = Object.assign(
            {},
            this.programData,
            this.menteeDetail,
            this.baseProgram,
            this.collect,
            this.gift,
            this.supplementary
          )
          arr.forEach((v) => {
            const param = v[0].substr(2, v[0].length - 3)
            console.log(v[0], param, this.programData[param])
            if (param == 'priceCny') {
              contractContent17 = contractContent17
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    this.internshipProgram[i].priceCny +
                    '</span>'
                )
            } else if (param == 'priceUsd') {
              contractContent17 = contractContent17
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    this.internshipProgram[i].priceUsd +
                    '</span>'
                )
            } else if (param == 'internshipName') {
              contractContent17 = contractContent17
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    this.internshipProgram[i].internshipName +
                    '</span>'
                )
            } else if (param == 'internshipTimeName') {
              contractContent17 = contractContent17
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    this.internshipProgram[i].internshipTimeName +
                    '</span>'
                )
            } else {
              contractContent17 = contractContent17
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    (this.programData[param] == -1
                      ? '不限'
                      : this.programData[param] || 0) +
                    '</span>'
                )
            }
          })
          console.log(contractContent17)
          this.internshipListAll.push({
            contractContent: contractContent17,
            contractContentTitle: this.internshipProgram[i].contract && this.internshipProgram[i].contract.split('&&&')[0]
          })
          // this.internshipProgram[i].contractContent = contractContent17;
          // this.internshipProgram[i].contractContentTitle = this.internshipProgram[i].contract && this.internshipProgram[i].contract.split("&&&")[0];
        }
      }
    },
    nextPdf16 () {
      let contractContent18 =
        this.graduateProgram.contract && this.graduateProgram.contract.split('&&&')[1]
      if (!contractContent18) {
        this.$message('合同内容为空，请联系管理员')
        return
      }
      let str = []
      for (var value of this.graduateProgram.gpApplyCountry) {
        for (var value2 of this.country) {
          if (value == value2.itemValue) {
            str.push(value2.itemName)
          }
        }
      }
      str = str.join('/')
      console.log(str, 77777777777)
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent18))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary,
        this.graduateProgram
      )
      console.log(this.programData)
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'priceCny') {
          contractContent18 = contractContent18
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.graduateProgram.priceCny +
                '</span>'
            )
        } else if (param == 'priceUsd') {
          contractContent18 = contractContent18
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.graduateProgram.priceUsd +
                '</span>'
            )
        } else if (param == 'gpApplyCountry') {
          console.log(param, str)
          contractContent18 = contractContent18
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                str +
                '</span>'
            )
        } else {
          contractContent18 = contractContent18
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      this.contractContent18 = contractContent18
    },
    nextPdf17 () {
      let contractContent19 = ''
      if (this.entrust.checkList.indexOf('allograph') > -1) {
        contractContent19 += '<p><strong>本合同存在代签：</strong></p><br />' +
        `<p>代签人姓名： <span style="background:#afa">${this.entrust.allographName}</span></p>` +
        `<p>与被代签人关系： <span style="background:#afa">${this.entrust.relationship}</span></p>` +
        '<p>是否取得被代签人授权：是</p>' +
        '<br/>'
      }
      if (this.entrust.checkList.indexOf('paying') > -1) {
        contractContent19 += '<p><strong>本合同存在费用代付：</strong></p><br />' +
        `<p>代付人姓名/名称：<span style="background:#afa">${this.entrust.payingName}</span></p>` +
        `<p>代付金额： <span style="background:#afa">￥${this.entrust.entrustPrice}</span></p>`
      }
      this.contractContent19 = contractContent19
    },
    nextPdf20 () {
      let contractContent20 =
        this.tutoringProgram.contract && this.tutoringProgram.contract.split('&&&')[1]
      if (!contractContent20) {
        this.$message('合同内容为空，请联系管理员')
        return
      }
      const reg = /\$\{.+?\}/g
      const arr = []
      let r = []
      while ((r = reg.exec(contractContent20))) {
        arr.push(r)
      }
      this.programData = Object.assign(
        {},
        this.programData,
        this.menteeDetail,
        this.baseProgram,
        this.collect,
        this.gift,
        this.supplementary
      )
      arr.forEach((v) => {
        const param = v[0].substr(2, v[0].length - 3)
        console.log(v[0], param, this.programData[param])
        if (param == 'priceCny') {
          contractContent20 = contractContent20
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.tutoringProgram.priceCny +
                '</span>'
            )
        } else if (param == 'priceUsd') {
          contractContent20 = contractContent20
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.tutoringProgram.priceUsd +
                '</span>'
            )
        } else if (param == 'tutoringMentorHour') {
          contractContent20 = contractContent20
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                this.tutoringProgram.tutoringMentorHour +
                '</span>'
            )
        } else {
          contractContent20 = contractContent20
            .split(v[0])
            .join(
              '<span style="background:#afa">' +
                (this.programData[param] == -1
                  ? '不限'
                  : this.programData[param] || 0) +
                '</span>'
            )
        }
      })
      console.log(contractContent20)
      this.contractContent20 = contractContent20
    },
    // 返回上一步
    backSign () {
      this.internshipListAll = []
      this.changePDFShow = false
      this.signDetailVisibleLocal = true
    },
    changeCheckBox () {
      console.log(this.checkList, 33333333333)
      if (this.checkList.indexOf('折扣补充协议') > -1) {

      } else {
        this.priceOff = false
        this.supplementary.payInFullDate2 = ''
        this.collect.discountInfo = ''
        this.supplementary.discountRate = ''
        this.supplementary.discountNum = 1
      }
    },
    // 确认修改后合同内容
    submitGG2 () {
      if (document.getElementById('list')) {
        this.contractText = document.getElementById('list').outerHTML
        this.contractText = this.contractText.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list2')) {
        this.contractText2 = document.getElementById('list2').outerHTML
        this.contractText2 = this.contractText2.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list3')) {
        this.contractText3 = document.getElementById('list3').outerHTML
        this.contractText3 = this.contractText3.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list4')) {
        this.contractText4 = document.getElementById('list4').outerHTML
        this.contractText4 = this.contractText4.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list5')) {
        this.contractText5 = document.getElementById('list5').outerHTML
        this.contractText5 = this.contractText5.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list6')) {
        this.contractText6 = document.getElementById('list6').outerHTML
        this.contractText6 = this.contractText6.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list7')) {
        this.contractText7 = document.getElementById('list7').outerHTML
        this.contractText7 = this.contractText7.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list8')) {
        this.contractText8 = document.getElementById('list8').outerHTML
        this.contractText8 = this.contractText8.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list9')) {
        this.contractText9 = document.getElementById('list9').outerHTML
        this.contractText9 = this.contractText9.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list10')) {
        this.contractText10 = document.getElementById('list10').outerHTML
        this.contractText10 = this.contractText10.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list11')) {
        this.contractText11 = document.getElementById('list11').outerHTML
        this.contractText11 = this.contractText11.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list12')) {
        this.contractText12 = document.getElementById('list12').outerHTML
        this.contractText12 = this.contractText12.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list13')) {
        this.contractText13 = document.getElementById('list13').outerHTML
        this.contractText13 = this.contractText13.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list14')) {
        this.contractText14 = document.getElementById('list14').outerHTML
        this.contractText14 = this.contractText14.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list15')) {
        this.contractText15 = document.getElementById('list15').outerHTML
        this.contractText15 = this.contractText15.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list16')) {
        this.contractText16 = document.getElementById('list16').outerHTML
        this.contractText16 = this.contractText16.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list17')) {
        this.contractText17 = document.getElementById('list17').outerHTML
        this.contractText17 = this.contractText17.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list18')) {
        this.contractText18 = document.getElementById('list18').outerHTML
        this.contractText18 = this.contractText18.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list19')) {
        this.contractText19 = document.getElementById('list19').outerHTML
        this.contractText19 = this.contractText19.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      if (document.getElementById('list20')) {
        this.contractText19 = document.getElementById('list20').outerHTML
        this.contractText19 = this.contractText19.replace(
          /\<\/?span( style="background:#afa")?\>/g,
          ''
        )
      }
      var contractTextTe = ''
      if (document.querySelectorAll('.contractContent')) {
        for (let i = 0; i < document.querySelectorAll('.contractContent').length; i++) {
          contractTextTe = document.querySelectorAll('.contractContent')[i].outerHTML
          contractTextTe = contractTextTe.replace(
            /\<\/?span( style="background:#afa")?\>/g,
            ''
          )
          this.internshipListAll[i].contractText = contractTextTe
        }
      }
      this.changePDFShow = false
      this.createURL()
    },
    // 是否有礼物
    changeGiftStatus (v) {
      console.log(v)
      if (v == 1) {
        this.gift.gifts = [{ giftId: null, giftNum: 1 }]
      } else {
        this.gift.gifts = []
      }
    },
    changeSignType () {
      this.collect.signCompany = null
    },
    getKeepOrder () {
      apiDic.getRedisByKey(this.menteeId).then((res) => {
        console.log('getRedisByKeyyx*******************', res)
        this.signOnline = res.data.signOnline || false
        this.menteeId = res.data.menteeId || ''
        this.transition = res.data.transition || {}
        this.invoice = res.data.invoice || {}
        this.gift = res.data.gift || {}
        this.collect = res.data.collect || {}
        this.cfaNum = res.data.cfaNum || 0
        this.oralNum = res.data.oralNum || 0
        this.internshipNum = res.data.internshipNum || 0
        this.programId = res.data.programId || ''
        this.cfaProgram = res.data.cfa || {}
        this.financeProgram = res.data.finance || {}
        this.tutoringProgram = res.data.tutoring || {}
        this.graduateProgram = res.data.graduateProgram || {}
        this.oralProgram = res.data.oralProgram || {}
        this.internshipProgram = res.data.internshipProgram || {}
        this.baseProgram = res.data.baseProgram || {}
        this.menteeDetail = res.data.menteeDetail || {}
        this.vipStatusNew = res.data.vipStatusNew
        this.priceOff = res.data.priceOff
        this.checkList = res.data.checkList || []
        this.supplementary = res.data.supplementary || {}
        if (this.supplementary.supplementaryType) {
          this.changeSupplementary()
        }
      })
    },
    saveOrderData () {
      const data = {
        signOnline: this.signOnline,
        menteeId: this.menteeId,
        transition: this.transition,
        invoice: this.invoice,
        gift: this.gift,
        supplementary: this.supplementary,
        collect: this.collect,
        cfaNum: this.cfaNum,
        oralNum: this.oralNum,
        internshipNum: this.internshipNum,
        programId: this.programId,
        cfa: this.cfaProgram,
        finance: this.financeProgram,
        tutoring: this.tutoringProgram,
        graduateProgram: this.graduateProgram,
        oralProgram: this.oralProgram,
        internshipProgram: this.internshipProgram,
        baseProgram: this.baseProgram,
        menteeDetail: this.menteeDetail,
        vipStatusNew: this.vipStatusNew,
        priceOff: this.priceOff,
        checkList: this.checkList
      }
      console.log('setRedis', this.menteeId, data)
      apiDic.setRedis(this.menteeId, data).then(() => {
        this.$message({
          type: 'success',
          message: '暂存成功，下次进来将自动填充暂存内容'
        })
      })
    },
    GetDateStr (data, AddDayCount) {
      var dd = new Date(data)
      console.log(dd)
      dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
      var y = dd.getFullYear()
      var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
      var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
      return y + '年' + m + '月' + d + '日'
    },
    getMonthBeforeFormatAndDay (num, format, day, dateTime) {
      var date = dateTime
      date.setMonth(date.getMonth() + (num * 1), 1)
      // 读取日期自动会减一，所以要加一
      var mo = date.getMonth() + 1
      // 小月
      if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
        if (day > 30) {
          day = 30
        }
      }
      // 2月
      else if (mo == 2) {
        if (this.isLeapYear(date.getFullYear())) {
          if (day > 29) {
            day = 29
          } else {
            day = 28
          }
        }
        if (day > 28) {
          day = 28
        }
      }
      // 大月
      else {
        if (day > 31) {
          day = 31
        }
      }
      console.log(date)
      var retureValue = date.format('yyyy' + '年' + 'MM' + '月' + day + '日')

      return retureValue
    },
    isLeapYear (Year) {
      if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
        return (true)
      } else { return (false) }
    },
    changeTime () {
      let day2 = this.collect.endDate.replace(/[^\d]/g, '/')
      day2 = new Date(day2)
      console.log(day2, this.supplementary.newEndData)
      this.supplementary.newEndData = this.getMonthBeforeFormatAndDay(this.supplementary.excessTimeName, '-', day2.getDate(), day2)
      console.log(this.supplementary.newEndData, 55555555555555)
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '@/styles/reset.scss';
$color: #dcdfe6;
$margin: top;
@mixin br5 {
  border-radius: 5px;
}
@mixin br22($mar: 20) {
  border-radius: 22px;
  margin-#{$margin}: double($mar) + px;
}
@function double($params) {
  @return $params * 2;
}
.common {
  padding: 20px;
}

%mm {
  display: inline-block;
}
.programName {
  @include br5;
  padding: 0px 9px;
  border: 1px $color dashed;
  min-width: 170px;
  height: 26px;
  display: inline-block;
  // @extend %mm;
}

.create-cant-program-model {
  @include br22(13);
  @include br5;
  @extend .common;
  @extend %m;
  // @extend %mm;
  border: 1px $color solid;
  margin-#{$margin}: 20px;
  position: relative;
}
.create-cant-program-model2{
  border:1px #F56C6C solid;
}
%m {
  display: block;
}
.program-model-title {
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: #fff;
  padding: 10px;
}
</style>
