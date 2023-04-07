<!--
 * @Author: Kaan
 * @Date: 2022-05-25 18:00:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-07 10:18:44
 * @version:
 * @Descripttion:
-->

<template>
    <div class="sign-detail">
      <el-dialog
        :title="'签约信息_详情'"
        class="info"
        :visible.sync="signDetailNewVisible"
        :close-on-click-modal="false"
        width="1250px"
        :before-close="signDetailClose"
        :append-to-body="true"
      >
        <div style="position: absolute;top: 23px;left: 140px; color:red;font-size:18px;">(bate v1.0)</div>
        <el-switch
          style="display: block;position: absolute;top: 20px;right: 100px;"
          v-model="signOnline"
          active-color="#13ce66"
          inactive-color="#409EFF"
          active-text="线上"
          inactive-text="线下"
        ></el-switch>
  
        <!-- 个人信息 -->
        <div class="create-cant-program-model">
          <div class="program-model-title">个人信息</div>
          <el-form
            :inline="true"
            size="mini"
            :model="menteeDetail"
            :rules="rules"
            ref="menteeDetail"
            label-width="180px"
          >
            <el-form-item label="微信ID：">
              <span :style="{width:widthSpan}" class="programName">{{menteeDetail.wxId}}</span>
            </el-form-item>
            <el-form-item label="姓名（拼音）：" prop="realName">
              <el-input :style="{width:widthInput}" v-model="menteeDetail.realName" maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="姓名（中文/法定名）：" prop="chiName">
              <!-- 合同上姓名 -->
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
            <el-form-item label="学校（高中）：">
              <el-select
                :style="{width:widthInput}"
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
              <el-select
                :style="{width:widthInput}"
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
            <el-form-item label="渠道来源：">
              <span :style="{width:widthSpan}" class="programName">{{menteeDetail.sourceFromName}}</span>
            </el-form-item>
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
        <!-- 求职项目信息 start 沿用旧版-->
        <div class="create-cant-program-model" v-show="offerPList.programId">
          <div class="program-model-title">求职项目信息</div>
          <div style="text-align: right;" v-if="specList.length > 0">
            <el-select style="margin-bottom:18px;margin-right: 35px;" :disabled="isKeepOrder" multiple size="mini" @change="specChange()" v-model="specId" filterable placeholder="规格">
              <el-option
                v-for="item in specList"
                :key="item.specId"
                :label="item.specName"
                :value="item.specId">
              </el-option>
            </el-select>
          </div>
          <el-form
            v-if="offerPList.programId"
            :inline="true"
            size="mini"
            :model="baseProgram"
            :rules="rules"
            ref="baseProgram"
            label-width="180px"
          >
          <Internship
            ref="internshipOffer"
            :internshipVisible="internshipOfferVisible"
            :internshipNum="offerPList.internshipNum"
            :rate="collect.rate"
            :vipStatus="true"
            :baseType="'offer'"
            :internshipData="opInternship"
            @getPrice="getItemPrice"
          />
          <Oral
            ref="oralOffer"
            :oralVisible="oralOfferVisible"
            :oralNum="offerPList.oralNum"
            :signOnline="signOnline"
            :needContract="false"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'offer'"
            :oralData="opOral"
            @getPrice="getItemPrice"
          />
          <Cfa
            ref="cfaOffer"
            :cfaVisible="cfaOfferVisible"
            :cfaNum="offerPList.cfaNum"
            :signOnline="signOnline"
            :needContract="false"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'offer'"
            :cfaData="opCfa"
            @getPrice="getItemPrice"
          />
          <Finance
            ref="financeOffer"
            :financeVisible="financeOfferVisible"
            :financeNum="offerPList.financeNum"
            :signOnline="signOnline"
            :needContract="false"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'offer'"
            :financeData="opFinance"
            @getPrice="getItemPrice"
          />
          <Tutoring
            ref="tutoringOffer"
            :tutoringVisible="tutoringOfferVisible"
            :tutoringNum="offerPList.tutoringNum"
            :signOnline="signOnline"
            :needContract="false"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'offer'"
            :tutoringData="opTutoring"
            :signType="'quick'"
            @getPrice="getItemPrice"
          />
         <Supplementary
            ref="supplementaryOffer"
            :programId="programId"
            :internshipNum="offerPList.internshipNum"
            :baseType="'offer'"
            :rate="collect.rate"
            :cfaType="cfaOfferVisible"
            @getPriceOff="getPriceOff"
            @changeGiftSupplementary="changeGiftSupplementary"
            @getDiscountId="getDiscountId"
            @getDiscountNum="getDiscountNum"
            @changeTime="changeTime"
          />
          <el-form
          v-if="offerPList.programId"
            :inline="true"
            size="mini"
            :model="offerPList.collect"
            :rules="rules"
            ref="collectOffer"
            label-width="180px"
            style="margin-top:20px"
          >
            <el-form-item label="合同起始日期:" prop="startDate" >
              <el-date-picker
                type="date"
                :style="{width:widthInput}"
                placeholder="选择日期"
                v-model="offerPList.collect.startDate"
                value-format="yyyy年MM月dd日"
                @change="dateChange2(offerPList.collect,baseProgram,offerPList.collect.startDate,'extra')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="合同结束日期:" prop="endDate">
              <el-date-picker
                type="date"
                :style="{width:widthInput}"
                placeholder="选择日期"
                v-model="offerPList.collect.endDate"
                value-format="yyyy年MM月dd日"
                @change="extendedDateChange(offerPList.collect,offerPList.collect.endDate)"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="合同延长服务日期:" prop="extendedEndDate">
              <el-date-picker
                type="date"
                :style="{width:widthInput}"
                placeholder="选择日期"
                v-model="offerPList.collect.extendedEndDate"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="求职项目总金额:">
              <span class="programName" :style="{width:widthSpan}">{{offerPList.collect.originalPriceCny}}(￥) / {{offerPList.collect.originalPriceUsd}}($)</span>
            </el-form-item>
            <el-form-item label="折后合同总金额:">
              <span class="programName" :style="{width:widthSpan}">{{offerPList.collect.totalPriceCny}}(￥) / {{offerPList.collect.totalPriceUsd}}($)</span>
            </el-form-item>
            <el-form-item label="求职合同模板:" prop="contract" v-if="signOnline">
              <el-select
                v-model="offerPList.collect.contract"
                filterable
                placeholder="请选择"
                :style="{width:widthInput}"
              >
                <el-option-group
                  v-for="group in offerProgramContractList"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.pkId"
                    :label="item.contractName"
                    :value="item.contractTitle + '&&&' + item.contractContent">
                  </el-option>
                </el-option-group>
                <!-- <el-option
                  v-for="a in offerProgramContractList"
                  :key="a.pkId"
                  :label="a.contractName"
                  :value="a.contractTitle + '&&&' + a.contractContent"
                ></el-option> -->
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!-- 求职项目信息 end 沿用旧版-->
  
        <!-- 升学项目信息 -->
        <div class="create-cant-program-model" v-show="graduatePList.programId">
          <div class="program-model-title">升学项目信息</div>
          <div class="create-cant-program-model components-model" v-if="graduatePList.programId">
            <div class="program-model-title">申研项目</div>
              <el-form
                :inline="true"
                size="mini"
                :rules="rules"
                ref="graduateProgram"
                label-width="180px"
                :model="graduateProgram"
              >
                <!-- <el-input v-model="graduatePrice0" style="display:none"></el-input> -->
                <el-form-item :label="'申研项目:'" prop="programId">
                  <span
                    :style="{width:widthSpan}"
                    class="programName w80"
                    :title="graduateProgram.programName"
                  >{{graduateProgram.programName}}</span>
                </el-form-item>
                <el-form-item label="官方价格:" prop>
                  <span class="programName" :style="{width:widthSpan}">
                    {{'￥' + (graduateProgram.basePriceCny||'无') + '; $' + (graduateProgram.basePriceUsd||'无')}}
                  </span>
                </el-form-item>
                <el-form-item label="等值人民币(￥):">
                  <span :style="{width:widthSpan}" class="programName">{{graduateProgram.priceCny}}</span>
                </el-form-item>
                <el-form-item label="项目周期:">
                  <span
                    :style="{width:widthSpan}"
                    class="programName"
                  >{{graduateProgram.period}}-{{graduateProgram.periodUnit}}</span>
                </el-form-item>
                <el-form-item label="Live lesson:">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.liveLesson == -1?'不限':graduateProgram.liveLesson}}</span>
              </el-form-item>
              <el-form-item label="一对一导师课时:">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.mentorHour == -1?'不限':graduateProgram.mentorHour}}</span>
              </el-form-item>
              <el-form-item label="申请年份:" prop="gpApplyYear">
                <el-date-picker
                  :style="{width:widthInput}"
                  v-model="graduateProgram.gpApplyYear"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="申研申请季:" prop="gpApplySeason">
                <el-select :style="{width:widthInput}" v-model="graduateProgram.gpApplySeason" clearable placeholder="请选择">
                  <el-option
                    v-for="item in [{label:'春',value:'春'},{label:'秋',value:'秋'},{label:'春秋',value:'春秋'}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请国家:" prop="gpApplyCountry">
                <el-select :style="{width:widthInput}" clearable v-model="graduateProgram.gpApplyCountry" multiple placeholder="请选择">
                  <el-option
                    v-for="item in gp_country"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="背景提升数量:">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.gpBackgroundPromotionQuantity}}</span>
              </el-form-item>
              <el-form-item label="背景提升价格(￥):">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.gpBackgroundPromotionPriceCny}}</span>
              </el-form-item>
              <el-form-item label="背景提升价格($):">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.gpBackgroundPromotionPriceUsd}}</span>
              </el-form-item>
              <el-form-item label="专业大类数量:">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.gpMajorQuantity}}</span>
              </el-form-item>
              <el-form-item label="项目申请数量:">
                <span :style="{width:widthSpan}" class="programName">{{graduateProgram.gpProgramApplyQuantity}}</span>
              </el-form-item>
              <el-form-item label="申研备注:">
                <el-input :style="{width:'570px'}" v-model="graduateProgram.note" maxlength="99"></el-input>
              </el-form-item>
  
            </el-form>
            <Internship
              style="margin-bottom:20px;"
              ref="internshipGraduate"
              :internshipVisible="internshipGraduateVisible"
              :internshipNum="graduatePList.internshipNum"
              :rate="collect.rate"
              :vipStatus="true"
              :needContract="true"
              :baseType="'graduate'"
              :internshipData="gpInternship"
              @getPrice="getItemPrice"
            />
            <el-form
              :inline="true"
              size="mini"
              :model="graduatePList.collect"
              :rules="rules"
              ref="collectGraduate"
              label-width="180px"
            >
              <el-form-item label="合同起始日期:" prop="startDate" >
                <el-date-picker
                  type="date"
                  :style="{width:widthInput}"
                  placeholder="选择日期"
                  v-model="graduatePList.collect.startDate"
                  value-format="yyyy年MM月dd日"
                  @change="dateChange2(graduatePList.collect,graduateProgram,graduatePList.collect.startDate)"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="合同结束日期:" prop="endDate">
                <el-date-picker
                  type="date"
                  :style="{width:widthInput}"
                  placeholder="选择日期"
                  v-model="graduatePList.collect.endDate"
                  value-format="yyyy年MM月dd日"
                  @change="extendedDateChange(graduatePList.collect,graduatePList.collect.endDate)"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="合同延长服务日期:" prop="extendedEndDate">
                <el-date-picker
                  type="date"
                  :style="{width:widthInput}"
                  placeholder="选择日期"
                  v-model="graduatePList.collect.extendedEndDate"
                  value-format="yyyy年MM月dd日"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="升学项目总金额:">
                <span class="programName" :style="{width:widthSpan}">{{graduatePList.collect.originalPriceCny}}(￥) / {{graduatePList.collect.originalPriceUsd}}($)</span>
              </el-form-item>
              <el-form-item label="折后合同总金额:">
                <span class="programName" :style="{width:widthSpan}">{{graduatePList.collect.totalPriceCny}}(￥) / {{graduatePList.collect.totalPriceUsd}}($)</span>
              </el-form-item>
              <el-form-item label="申研合同模板:" prop="contract" v-if="signOnline">
                <el-select
                  v-model="graduatePList.collect.contract"
                  filterable
                  placeholder="请选择"
                  :style="{width:widthInput}"
                >
                  <el-option-group
                    v-for="group in graduateProgramContractList"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.pkId"
                      :label="item.contractName"
                      :value="item.contractTitle + '&&&' + item.contractContent">
                    </el-option>
                  </el-option-group>
                  <!-- <el-option
                    v-for="a in graduateProgramContractList"
                    :key="a.pkId"
                    :label="a.contractName"
                    :value="a.contractTitle + '&&&' + a.contractContent"
                  ></el-option> -->
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <Oral
            ref="oralGraduate"
            :oralVisible="oralGraduateVisible"
            :oralNum="graduatePList.oralNum"
            :signOnline="signOnline"
            :needContract="true"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'graduate'"
            :oralData="gpOral"
            @getPrice="getItemPrice"
          />
          <Cfa
            ref="cfaGraduate"
            :cfaVisible="cfaGraduateVisible"
            :cfaNum="graduatePList.cfaNum"
            :signOnline="signOnline"
            :needContract="true"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'graduate'"
            :cfaData="gpCfa"
            @getPrice="getItemPrice"
          />
          <Finance
            ref="financeGraduate"
            :financeVisible="financeGraduateVisible"
            :financeNum="graduatePList.financeNum"
            :signOnline="signOnline"
            :needContract="true"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'graduate'"
            :financeData="gpFinance"
            @getPrice="getItemPrice"
          />
          <Tutoring
            ref="tutoringGraduate"
            :tutoringVisible="tutoringGraduateVisible"
            :tutoringNum="graduatePList.tutoringNum"
            :signOnline="signOnline"
            :needContract="true"
            :vipList="VIPList"
            :servicesList="servicesList"
            :rate="collect.rate"
            :baseType="'graduate'"
            :tutoringData="gpTutoring"
            :signType="'quick'"
            @getPrice="getItemPrice"
          />
          <Supplementary
            ref="supplementaryGraduate"
            :programId="programId"
            :baseType="'graduate'"
            :rate="collect.rate"
            :cfaType="cfaGraduateVisible"
            @getPriceOff="getPriceOff"
            @changeGiftSupplementary="changeGiftSupplementary"
            @getDiscountId="getDiscountId"
            @getDiscountNum="getDiscountNum"
          />
        </div>
  
       <Supplementary
            ref="supplementaryCommon"
            :programId="programId"
            :baseType="'common'"
            :rate="collect.rate"
            @getPriceOff="getPriceOff"
            @changeGiftSupplementary="changeGiftSupplementary"
            @getDiscountId="getDiscountId"
            @getDiscountNum="getDiscountNum"
          />
        <!-- 委托确认书 -->
        <div class="create-cant-program-model" v-if="signOnline">
          <div class="program-model-title">委托确认书</div>
          <el-form
            :inline="true"
            size="mini"
            :model="entrust"
            :rules="rules"
            ref="entrust"
            label-width="180px"
          >
            <el-checkbox-group v-model="entrust.checkList" style="padding-left:20px">
              <el-form-item label="" prop="">
                <el-checkbox label="allograph">本合同是否存在代签：</el-checkbox>
              </el-form-item>
              <br>
              <div v-if="entrust.checkList.indexOf('allograph')>-1">
                <el-form-item label="代签人姓名" prop="allographName" >
                  <el-input :style="{width: widthInput}" v-model="entrust.allographName" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="与被代签人关系" prop="relationship">
                  <el-select
                    v-model="entrust.relationship"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择"
                    :style="{width:widthInput}"
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
                  <span class="programName" :style="{width:widthSpan}">是</span>
                </el-form-item>
              </div>
              <el-form-item label="" prop="">
                <el-checkbox label="paying">本合同是否存在费用代付：</el-checkbox>
              </el-form-item>
              <div v-if="entrust.checkList.indexOf('paying')>-1">
                <el-form-item label="代付人姓名" prop="payingName" >
                  <el-input :style="{width: widthInput}" v-model="entrust.payingName" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="代付金额" prop="entrustPrice">
                  <el-input :style="{width: widthInput}" v-model="entrust.entrustPrice" :maxlength="100"></el-input>
                </el-form-item>
              </div>
            </el-checkbox-group>
          </el-form>
        </div>
  
        <!-- 礼物 -->
        <div class="create-cant-program-model">
          <div class="program-model-title">礼物</div>
          <el-form
            :inline="true"
            size="mini"
            :model="gift"
            :rules="rules"
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
                <el-input :style="{width: widthInput}" v-model="gift.recipientName" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="收货人电话" prop="recipientPhone">
                <el-input :style="{width: widthInput}" v-model="gift.recipientPhone" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="收货人地址" prop="recipientAddr">
                <el-input :style="{width: '570px'}" v-model="gift.recipientAddr" :maxlength="199"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input :style="{width: '570px'}" v-model="gift.remark" :maxlength="199"></el-input>
              </el-form-item>
              <br />
              <el-form-item label=" " prop>
                <el-button @click="addGift" size="mini">添加礼物</el-button>
              </el-form-item>
            </div>
            <el-form-item label="礼物" prop v-for="(gift,i) in gift.gifts" :key="i" >
              <el-form-item :prop="`gifts.${i}.gift`" :rules="rules.gift">
                <el-select v-model="gift.gift" filterable placeholder="请选择">
                  <el-option
                    v-for="item in giftList"
                    :key="item.giftId"
                    :label="item.giftName +' (库存:' + item.inventory + ')[价格：￥'+item.giftPrice +']'"
                    :disabled="!item.inventory"
                    :value="item.giftId + '&&' + item.giftName + '&&' + item.giftPrice"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :prop="`gifts.${i}.giftNum`" :rules="rules.giftNum">
                <el-input-number :min="0" :style="{width:'100px',margin:'0px 10px'}" v-model="gift.giftNum"></el-input-number>
              </el-form-item>
              <el-button type="warning" plain round @click="deleteGift(i)" class="el-icon-delete"></el-button>
            </el-form-item>
          </el-form>
        </div>
  
        <!-- 发票 -->
        <div class="create-cant-program-model">
          <div class="program-model-title">发票</div>
          <el-form
            :inline="true"
            size="mini"
            :model="invoice"
            :rules="rules"
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
              <el-form-item label="发票类型" prop="invoiceType">
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
              <el-form-item label="公司抬头/个人姓名" prop="invoiceTitle">
                <el-input :style="{width: widthInput}" v-model="invoice.invoiceTitle" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="税号/身份证号" prop="invoiceAccount">
                <el-input :style="{width: widthInput}" v-model="invoice.invoiceAccount" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="发票地址" prop="invoiceAddr">
                <el-input :style="{width: widthInput}" v-model="invoice.invoiceAddr" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="发票电话" prop="invoicePhone">
                <el-input :style="{width: widthInput}" v-model="invoice.invoicePhone" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="开户行" prop="invoiceBank">
                <el-input :style="{width: widthInput}" v-model="invoice.invoiceBank" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="开户行账号" prop="invoiceBankAccount">
                <el-input
                  :style="{width: widthInput}"
                  v-model="invoice.invoiceBankAccount"
                  :maxlength="100"
                ></el-input>
              </el-form-item>
              <br />
              <el-form-item label="收货人名" prop="recipientName">
                <el-input :style="{width: widthInput}" v-model="invoice.recipientName" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="收货人电话" prop="recipientPhone">
                <el-input :style="{width: widthInput}" v-model="invoice.recipientPhone" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="收货人地址" prop="recipientAddr">
                <el-input :style="{width: '650px'}" v-model="invoice.recipientAddr" :maxlength="100"></el-input>
              </el-form-item>
              <!-- <el-form-item label="备注" prop="">
                <el-input :style="{width: '650px'}" v-model="invoice.remark" :maxlength="199"></el-input>
              </el-form-item>-->
            </div>
          </el-form>
        </div>
  
        <!-- 订单汇总 -->
        <div class="create-cant-program-model">
          <div class="program-model-title">订单汇总</div>
          <el-form
            :inline="true"
            size="mini"
            :model="collect"
            :rules="rules"
            ref="collect"
            label-width="180px"
          >
            <el-form-item label="主联系人" prop="contact1">
              <el-select
                v-model="collect.contact1"
                :style="{width:widthInput}"
                filterable
                placeholder="请选择联系人"
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
              <el-input :style="{width:widthInput}" v-model="collect.totalPriceCny" style="display:none"></el-input>
              <span class="programName" :style="{width:widthSpan}">{{collect.originalPriceCny}}(￥) / {{collect.originalPriceUsd}}($)</span>
            </el-form-item>
            <el-form-item label="折后合同总金额">
              <el-input :style="{width:widthInput}"  v-model="collect.totalPriceCny" style="display:none"></el-input>
              <span class="programName" :style="{width:widthSpan}">{{collect.totalPriceCny}}(￥) / {{collect.totalPriceUsd}}($)</span>
            </el-form-item>
            <el-form-item label="汇率" prop="rate">
              <el-input
                :style="{width:widthInput}"
                v-model="collect.rate"
                :placeholder="'美元合理汇率不低于：'+extentRate"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="priceOff || (collect.rate && collect.rate < extentRate)"
              label="折扣说明："
              prop="discountInfo"
            >
              <el-input :style="{width:'570px'}" v-model="collect.discountInfo"></el-input>
            </el-form-item>
            <el-form-item label="签约日期" prop="signDate" v-if="!signOnline">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="collect.signDate"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
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
              :style="{width:'190px'}"
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
          </el-form>
        </div>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="signDetailClose">取 消</el-button>
          <!-- <el-button @click="saveOrderData" >暂 存</el-button> -->
          <el-button type="primary" v-if="!signOnline" @click="submitGG2">提交</el-button>
          <el-button v-show="signOnline" v-else type="primary" @click="onlineNext">下一步</el-button>
        </span>
      </el-dialog>
  
      <!-- 合同审查及修改 -->
      <el-dialog
        title="签约信息_合同"
        :visible.sync="changePDFShow"
        width="1000px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :append-to-body="true"
      >
        <el-card class="mt20" v-for="(item,index) in contractList" :key="index">
          <div slot="header" class="clearfix">
            <span>{{item.title}}</span>
          </div>
          <div class="list"  v-html="item.contract"></div>
        </el-card>
        <!-- <el-card class="mt20" v-if="contractContent19">
          <div slot="header" class="clearfix">
            <span>订单代签代付补充协议预览</span>
          </div>
          <div class="list" id="list19" v-html="contractContent19"></div>
        </el-card> -->
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
  import mixins from '@/plugin/mixins'
  import api from '@/api/sales_assistant'
  import apiDic from '@/api/dictionary'
  import apiAct from '@/api/activity'
  
  import Internship from './components/Internship'
  import Oral from './components/Oral'
  import Cfa from './components/Cfa'
  import Finance from './components/Finance'
  import Tutoring from './components/Tutoring'
  
  import Supplementary from './components/Supplementary'
  import Rebate from './Rebate.vue'
  export default {
    mixins: [mixins],
    components: { Internship, Oral, Cfa, Finance, Tutoring, Supplementary, Rebate },
    props: {
      signDetailVisible: {
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
      programId: {
        type: String,
        default: ''
      },
      offerList: {
        type: Object
      },
      graduateList: {
        type: Object
      }
    },
    data () {
      var checkChiName = (rule, value, callback) => {
        if (/^[a-z]|\s[a-z]/.test(value)) {
          return callback(new Error('请检查法定名输入规范'))
        } else {
          callback()
        }
      }
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else {
          const reg = /^1[3-9][0-9]\d{8}$/
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
        internshipUnitList: [],
        internship_duration: [],
        priceModify: false,
        lessonHourModify: false,
        specId: [],
        specList: [],
        checkSpecStatus: true,
        copyBaseProgram: {},
        programData: {},
        signDetailNewVisible: false,
        signOnline: true,
        widthSpan: '160px',
        widthInput: '190px',
        widthHalf: '380px',
        gpCountryList: [],
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
        pretalkList: [],
        // 基本项目信息
        baseProgram: {
          programName: '',
          basePriceCny: 0,
          basePriceUsd: 0,
          currencyType: '',
          priceCny: '',
          priceUsd: '',
          programPriceNote: '',
          strategist: '',
          seriesHour: '',
          mentorHour: '',
          freeMentorHour: '',
          basicMentorHour: '',
          leadStrategistHour: '',
          applicationLetterModify: '',
          mentorLetterModify: '',
          jerryHour: '',
          seniorStrategist: '',
          hasContinual: '',
          hasEbookStore: '',
          emergencyMentor: '',
          interviewMentor: '',
          priority: '',
          hasEnglishSeries: '',
          hasOral: '',
          certificateSubjectLiveCourseAuthority: '',
          mentorCount: 0,
          tequilaShotHour: 0,
          seminars: 0,
          officeHour: null,
          liveLesson: 0,
          officeHourStrategistSession: 0
        },
        // 求职项目信息
        offerArr: [],
        offerPList: {
          supple: {
            discountId: '',
            discountNum: 1
          },
          collect: {
            startDate: '',
            endDate: '',
            extendedEndDate: '',
            originalPriceCny: 0,
            originalPriceUsd: 0,
            totalPriceCny: 0,
            totalPriceUsd: 0,
            contract: ''
          }
        },
        offerProgramContractList: [],
  
        // 升学项目信息
        graduateProgram: {
          programId: '',
          programName: '',
          priceCny: 0,
          priceUsd: 0,
          basePriceUsd: 0,
          basePriceCny: 0,
          period: '',
          periodUnit: '',
          programWeight: '',
          gpBackgroundPromotionQuantity: '',
          gpBackgroundPromotionPriceCny: '',
          gpBackgroundPromotionPriceUsd: '',
          gpMajorQuantity: '',
          gpProgramApplyQuantity: '',
          liveLesson: '',
          mentorHour: '',
          note: '',
          signVip: '',
          startDate: null,
          endDate: null,
          extendedEndDate: null
        },
        graduateArr: [],
        graduatePList: {
          supple: {
            discountId: '',
            discountNum: 1
          },
          collect: {
            startDate: '',
            endDate: '',
            extendedEndDate: '',
            originalPriceCny: 0,
            originalPriceUsd: 0,
            totalPriceCny: 0,
            totalPriceUsd: 0,
            contract: ''
          }
        },
        graduateProgramContractList: [],
        gp_country: [],
  
        // 订单汇总信息
        collect: {
          // vipRecommendStatus: '',
          // vipRecommender: '',
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
          discountInfo: '',
          originalPriceCny: '',
          originalPriceUsd: ''
        },
  
        // 委托确认书
        entrust: {
          checkList: [],
          allographName: '',
          relationship: '',
          payingName: '',
          entrustPrice: ''
        },
        relationshipList: [
          { key: '父亲', value: '父亲' },
          { key: '母亲', value: '母亲' },
          { key: '亲属', value: '亲属' },
          { key: '朋友', value: '朋友' },
          { key: '企业', value: '企业' }
        ],
  
        // 礼物信息
        gift: {
          hasGift: null,
          gifts: [],
          recipientName: '',
          recipientPhone: '',
          recipientAddr: '',
          remark: '',
          giftTotalPrice: '',
          giftName: ''
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
          recipientName: '',
          recipientPhone: '',
          recipientAddr: '',
          remark: ''
        },
  
        // 多表单验证结果汇总
        rulesVaildResult: [],
        rules: {
          // 个人信息验证规则
          realName: [{ required: true, message: '必填', trigger: 'blur' },
            { max: 50, message: '长度必须小于 50 个字符', trigger: 'blur' }],
          chiName: [{ required: true, message: '必填', trigger: 'blur' },
            { max: 50, message: '长度必须小于 50 个字符', trigger: 'blur' },
            { validator: checkChiName, message: '请输入正确的法定名', trigger: 'blur' }],
          sex: [{ required: true, message: '必填', trigger: 'blur' }],
          email: [{ required: true, message: '必填', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
          school: [{ required: true, message: '必填', trigger: 'blur' }],
          degree: [{ required: true, message: '必填', trigger: 'blur' }],
          finishYear: [{ required: true, message: '必填', trigger: 'blur' }],
          telephone: [{ required: true, message: '必填', trigger: 'blur' }],
          // 升学项目验证规则
          programId: [{ required: true, message: '必填', trigger: 'blur' }],
          strategist: [{ required: true, message: '请选择全职导师', trigger: 'blur' }],
          gpApplyYear: [{ required: true, message: '必填', trigger: 'blur' }],
          gpApplySeason: [{ required: true, message: '必填', trigger: 'blur' }],
          gpApplyCountry: [{ required: true, message: '必填', trigger: 'blur' }],
          startDate: [{ required: true, message: '必填', trigger: 'blur' }],
          endDate: [{ required: true, message: '必填', trigger: 'blur' }],
          contract: [{ required: true, message: '必填', trigger: 'blur' }],
          // 委托确认书
          allographName: [{ required: true, message: '必填', trigger: 'blur' }],
          relationship: [{ required: true, message: '必填', trigger: 'blur' }],
          payingName: [{ required: true, message: '必填', trigger: 'blur' }],
          entrustPrice: [{ required: true, message: '必填', trigger: 'blur' }],
          // 礼物
          hasGift: [{ required: true, message: '必填', trigger: 'blur' }],
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
          gift: [{ required: true, message: '必填', trigger: 'blur' }],
          giftNum: [{ required: true, message: '必填', trigger: 'blur' }],
          // 发票
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
          // 订单汇总
          contact1: [{ required: true, message: '必填', trigger: 'blur' }],
          rate: [{ required: true, message: '必填', trigger: 'blur' }],
          discountInfo: [{ required: true, message: '必填', trigger: 'blur' }],
          signDate: [{ required: true, message: '必填', trigger: 'blur' }],
          vipRecommendStatus: [{ required: true, message: '必填', trigger: 'blur' }],
          vipRecommender: [{ validator: checkVipRecommender, trigger: 'blur' }],
          signCompany: [{ required: true, message: '必填', trigger: 'blur' }]
        },
  
        /* 下拉选选项列表 */
        // 字典项
        giftList: [],
        wst_company: [],
        channel_sourceList: [],
  
        order_supplementary_type: [],
        internship_location_type: [],
        invoice_type: [],
        common_yes_or_no: [],
        sign_excess_month: [],
        schoolList: [],
        sex: [],
        highSchool: [],
        degree: [],
        // 接口返回选项
        salesList: [],
        vipSelect: [],
        VIPList: [],
        servicesList: [],
        discountList: [],
        // 汇率合理范围下限
        extentRate: '',
        // 是否折扣订单
        priceOff: false,
  
        // 实习组件
        internshipOfferVisible: false,
        internshipOfferPrice: 0,
        opInternship: [],
        internshipGraduateVisible: false,
        internshipGraduatePrice: 0,
        gpInternship: [],
  
        // 口语组件
        oralOfferVisible: false,
        oralOfferPrice: 0,
        opOral: [],
        oralGraduateVisible: false,
        oralGraduatePrice: 0,
        gpOral: [],
  
        // cfa组件
        cfaOfferVisible: false,
        cfaOfferPrice: 0,
        opCfa: {},
        cfaGraduateVisible: false,
        cfaGraduatePrice: 0,
        gpCfa: {},
  
        // finance组件
        financeOfferVisible: false,
        financeOfferPrice: 0,
        opFinance: {},
        financeGraduateVisible: false,
        financeGraduatePrice: 0,
        gpFinance: {},
  
        // tutoring组件
        tutoringOfferVisible: false,
        tutoringOfferPrice: 0,
        opTutoring: {},
        tutoringGraduateVisible: false,
        tutoringGraduatePrice: 0,
        gpTutoring: {},
  
        // 补充协议
        opSupplementary: {},
        gpSupplementary: {},
  
        // 补充协议返回折扣
        supple: {
          discountId: '',
          discountNum: 1
        },
  
        // 合同审查
        changePDFShow: false,
        contractList: [],
  
        // 返佣
        rebateVisible: false,
        signSubmitData: {
          collect: {},
          mentee: {}
        }
  
      }
    },
    computed: {
      // 汇率
      midRate () {
        return this.collect.rate
      },
      originalOfferPriceUsd () {
        // 求职项目总金额
        console.log('求职项目总金额')
        const price = this.internshipOfferPrice + this.baseProgram.basePriceUsd +
                    this.oralOfferPrice + this.cfaOfferPrice +
                    this.financeOfferPrice + this.tutoringOfferPrice
        return price
      },
      originalGraduatePriceUsd () {
        // 申研项目总金额 申研+实习
        const price = this.internshipGraduatePrice + this.graduateProgram.basePriceUsd
        return price
      },
      originalGraduateAllPriceUsd () {
        // 升学项目总金额 申研+实习+口语等其他
        const price = this.internshipGraduatePrice + this.graduateProgram.basePriceUsd +
                    this.oralGraduatePrice + this.cfaGraduatePrice +
                    this.financeGraduatePrice + this.tutoringGraduatePrice
        return price
      },
      originalPriceUsd () {
        const price = this.internshipOfferPrice + this.baseProgram.basePriceUsd +
                    this.oralOfferPrice + this.cfaOfferPrice +
                    this.financeOfferPrice + this.tutoringOfferPrice +
                    this.internshipGraduatePrice + this.graduateProgram.basePriceUsd +
                    this.oralGraduatePrice + this.cfaGraduatePrice +
                    this.financeGraduatePrice + this.tutoringGraduatePrice
        return price
      },
      opDiscountNum () {
        return this.offerPList.supple.discountNum
      },
      opDiscountId () {
        return this.offerPList.supple.discountId
      },
      gpDiscountNum () {
        return this.graduatePList.supple.discountNum
      },
      gpDiscountId () {
        return this.graduatePList.supple.discountId
      },
      offerPrice () {
        const { originalOfferPriceUsd, midRate } = this
        return { originalOfferPriceUsd, midRate }
      },
      graduatePrice () {
        const { originalGraduatePriceUsd, midRate } = this
        return { originalGraduatePriceUsd, midRate }
      },
      discountPrice () {
        const { originalPriceUsd, midRate } = this
        return { originalPriceUsd, midRate }
      },
      discountOfferPrice () {
        const {
          originalOfferPriceUsd, originalGraduatePriceUsd, originalPriceUsd, originalGraduateAllPriceUsd,
          midRate, opDiscountNum, opDiscountId, gpDiscountNum, gpDiscountId
        } = this
        return {
          originalOfferPriceUsd,
          originalGraduatePriceUsd,
          originalPriceUsd,
          originalGraduateAllPriceUsd,
          midRate,
          opDiscountNum,
          opDiscountId,
          gpDiscountNum,
          gpDiscountId
        }
      }
    },
    watch: {
      signDetailVisible: async function (val) {
        this.signDetailNewVisible = this.signDetailVisible
        if (val) {
          api.getPretalkListByMenteeId(this.menteeId).then(res => {
            console.log(res.data, 111111111111111111111111)
            this.pretalkList = res.data
          })
          console.log(this.offerList, '销售签约offerList的合同')
          this.offerPList = Object.assign(this.offerPList, this.offerList)
          console.log(this.offerPList)
          console.log(this.graduateList, '销售签约graduateList的合同')
          this.graduatePList = Object.assign(this.graduatePList, this.graduateList)
          console.log(this.isKeepOrder, '暂存状态')
          await this.initSpecList()
          await this.keepOrder(this.isKeepOrder)
          await this.initList()
          await this.init()
          this.internshipOfferVisible = this.offerPList.internshipNum > 0
          this.internshipGraduateVisible = this.graduatePList.internshipNum > 0
          this.oralOfferVisible = this.offerPList.oralNum > 0
          this.oralGraduateVisible = this.graduatePList.oralNum > 0
          this.cfaOfferVisible = this.offerPList.cfaNum > 0
          this.cfaGraduateVisible = this.graduatePList.cfaNum > 0
          this.financeOfferVisible = this.offerPList.financeNum > 0
          this.financeGraduateVisible = this.graduatePList.financeNum > 0
          this.tutoringOfferVisible = this.offerPList.tutoringNum > 0
          this.tutoringGraduateVisible = this.graduatePList.tutoringNum > 0
          apiDic.getChangeSign().then(res => {
            console.log(res, 222222222222222222)
            this.priceModify = res.data.priceModify || false
            this.lessonHourModify = res.data.lessonHourModify || false
          })
        }
      },
      discountOfferPrice (v) {
        // V:originalGraduatePriceUsd, originalPriceUsd ,midRate, discountNum, discountId
        const ocItem = this.offerPList.collect
        const gcItem = this.graduatePList.collect
        const cItem = this.collect
        let totalPriceUsd = 0
        let totalPriceCny = 0
        const disArr = [
          { type: 'offer', item: ocItem, priceUsd: v.originalOfferPriceUsd, discountId: v.opDiscountId, discountNum: v.opDiscountNum },
          { type: 'graduate', item: gcItem, priceUsd: v.originalGraduatePriceUsd, discountId: v.gpDiscountId, discountNum: v.gpDiscountNum }
        ]
        disArr.forEach((a) => {
          const d = this.discountList.find(function (obj) { return obj.discountId == a.discountId })
          console.log(d,'dddddddddddddddddddddddddd')
          if (a.discountId == '') {
            // 折扣补充协议
            // collect.totalPriceUsd*supplementary.discountNum*collect.rate
            this.$set(a.item, 'totalPriceCny', parseFloat((a.priceUsd * a.discountNum * v.midRate).toFixed(1)))
            this.$set(a.item, 'totalPriceUsd', parseFloat((a.priceUsd * a.discountNum).toFixed(1)))
            if (a.type == 'graduate') {
              totalPriceCny += parseFloat((v.originalGraduateAllPriceUsd * a.discountNum * v.midRate).toFixed(1))
              totalPriceUsd += parseFloat((v.originalGraduateAllPriceUsd * a.discountNum).toFixed(1))
            } else {
              totalPriceCny += parseFloat((a.priceUsd * a.discountNum * v.midRate).toFixed(1))
              totalPriceUsd += parseFloat((a.priceUsd * a.discountNum).toFixed(1))
            }
  
          } else if (d !== undefined) {
            // 折扣活动
            let price = d.amountType == 'usd' ? a.priceUsd : a.priceUsd * v.midRate
            let gcPrice = d.amountType == 'usd' ? v.originalGraduateAllPriceUsd : v.originalGraduateAllPriceUsd * v.midRate
            if (d.discountType == 'amount') {
              // 金额优惠
              if ((price > d.achieveAmount && d.thresholdStatus == 1) || (d.thresholdStatus == 0)) {
                // 有门槛 满减金额 or 无门槛 减金额
                price = price - d.discountAmount
                gcPrice = gcPrice - d.discountAmount
              }
            } else if (d.discountType == 'percent') {
              // 折扣优惠
              if ((price > d.achieveAmount && d.thresholdStatus == 1) || (d.thresholdStatus == 0)) {
                // 有门槛 满减折扣 or 无门槛 减金额
                price = price * (1 - d.discountPercent / 100)
                gcPrice = gcPrice * (1 - d.discountPercent / 100)
              }
            }
            if (d.amountType == 'usd') {
              this.$set(a.item, 'totalPriceCny', parseFloat((price * v.midRate).toFixed(1)))
              this.$set(a.item, 'totalPriceUsd', parseFloat((price).toFixed(1)))
              if (a.type == 'graduate') {
                totalPriceCny += parseFloat((gcPrice * v.midRate).toFixed(1))
                totalPriceUsd += parseFloat((gcPrice).toFixed(1))
              } else {
                totalPriceCny += parseFloat((price * v.midRate).toFixed(1))
                totalPriceUsd += parseFloat((price).toFixed(1))
              }
            } else if (d.amountType == 'cny') {
              this.$set(a.item, 'totalPriceCny', parseFloat((price).toFixed(1)))
              this.$set(a.item, 'totalPriceUsd', parseFloat((price / v.midRate).toFixed(1)))
              if (a.type == 'graduate') {
                totalPriceCny += parseFloat((gcPrice).toFixed(1))
                totalPriceUsd += parseFloat((gcPrice / v.midRate).toFixed(1))
              } else {
                totalPriceCny += parseFloat((price).toFixed(1))
                totalPriceUsd += parseFloat((price / v.midRate).toFixed(1))
              }
            }
          } else if (v.discountId && d == undefined) {
            this.$message({
              type: 'warning',
              message: '未获取到折扣信息'
            })
          } else {
            console.log('wu折扣')
          }
        })
        // 申研基础项目与实习总金额的单独折扣值
        this.graduatePList.dctBasePriceUsd = parseFloat((this.graduateProgram.basePriceUsd * v.gpDiscountNum).toFixed(1))
        this.graduatePList.dctBasePriceCny = parseFloat((this.graduateProgram.basePriceUsd * v.gpDiscountNum * v.midRate).toFixed(1))
        this.graduatePList.dctInternshipPriceUsd = parseFloat((this.internshipGraduatePrice * v.gpDiscountNum).toFixed(1))
        this.graduatePList.dctInternshipPriceCny = parseFloat((this.internshipGraduatePrice * v.gpDiscountNum * v.midRate).toFixed(1))
  
        cItem.originalPriceUsd = v.originalPriceUsd
        cItem.originalPriceCny = parseFloat((v.originalPriceUsd * v.midRate).toFixed(1))
        cItem.totalPriceUsd = totalPriceUsd
        cItem.totalPriceCny = totalPriceCny
        console.log(cItem,'citem22222222222222222222')
        this.entrust.entrustPrice = `${cItem.totalPriceCny}(￥) / ${cItem.totalPriceUsd}($)`
      },
      offerPrice (v) {
        this.baseProgram.priceCny = parseFloat((this.baseProgram.basePriceUsd * v.midRate).toFixed(1))
        const pItem = this.offerPList.collect
        pItem.originalPriceCny = parseFloat((v.originalOfferPriceUsd * v.midRate).toFixed(1))
        pItem.originalPriceUsd = v.originalOfferPriceUsd
        // pItem.totalPriceCny = parseFloat((v.originalOfferPriceUsd * v.midRate ).toFixed(1));
        // pItem.totalPriceUsd = v.originalOfferPriceUsd
      },
      graduatePrice (v) {
        this.graduateProgram.priceCny = parseFloat((this.graduateProgram.basePriceUsd * v.midRate).toFixed(1))
        const pItem = this.graduatePList.collect
        pItem.originalPriceCny = parseFloat((v.originalGraduatePriceUsd * v.midRate).toFixed(1))
        pItem.originalPriceUsd = v.originalGraduatePriceUsd
        // 背景提升价格修改
        this.graduateProgram.gpBackgroundPromotionPriceCny = this.graduateProgram.gpBackgroundPromotionPriceUsd * v.midRate
      }
    },
    mounted () {
  
    },
    methods: {
      getMenteeData () {
        api.getMenteeDataByMenteeId(this.menteeId).then((res) => {
          console.log('获取学员基本信息yx**112***', res.data)
          // this.collect.vipRecommendStatus = res.data.vipgp_countryRecommendStatus
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
        })
      },
      async keepOrder (ko) {
        if (!ko) return false
        await apiDic.getRedisByKey(this.menteeId).then((res) => {
          console.log('getRedisByKey', res)
          const data = JSON.parse(JSON.stringify(res.data.basic))
          this.copyBaseProgram = {
            basePriceUsd: data.priceUsd,
            basePriceCny: data.priceCny,
            mentorHour: data.mentorHour,
            freeMentorHour: data.freeMentorHour,
            basicMentorHour: data.basicMentorHour,
            priceCny: data.priceCny,
            priceUsd: data.priceUsd,
            period: data.period,
            periodUnit: data.periodUnit
          }
          this.specId = data.specId || []
          res.data.basic ? (this.baseProgram = res.data.basic, this.offerPList.programId = this.baseProgram.programId) : ''
          this.menteeDetail = res.data.mentee || this.menteeDetail
          res.data.opInternship ? (this.opInternship = res.data.opInternship, this.offerPList.internshipNum = this.opInternship.length) : ''
          res.data.opOral ? (this.opOral = [res.data.opOral], this.offerPList.oralNum = 1) : ''
          res.data.opCfa ? (this.opCfa = res.data.opCfa, this.offerPList.cfaNum = 1) : ''
          res.data.opFinance ? (this.opFinance = res.data.opFinance, this.offerPList.financeNum = 1) : ''
          res.data.opTutoring ? (this.opTutoring = res.data.opTutoring, this.offerPList.tutoringNum = 1) : ''
          res.data.gpBasic ? (this.graduateProgram = res.data.gpBasic, this.graduatePList.programId = this.graduateProgram.programId) : ''
          res.data.gpInternship ? (this.gpInternship = res.data.gpInternship, this.graduatePList.internshipNum = this.gpInternship.length) : ''
          res.data.gpOral ? (this.gpOral = [res.data.gpOral], this.graduatePList.oralNum = 1) : ''
          res.data.gpCfa ? (this.gpCfa = res.data.gpCfa, this.graduatePList.cfaNum = 1) : ''
          res.data.gpFinance ? (this.gpFinance = res.data.gpFinance, this.graduatePList.financeNum = 1) : ''
          res.data.gpTutoring ? (this.gpTutoring = res.data.gpTutoring, this.graduatePList.tutoringNum = 1) : ''
          this.gift = res.data.gift || this.gift,
          this.invoice = res.data.invoice || this.invoice,
          this.collect = res.data.collect || this.collect
        })
      },
      /**
       * @description: 组件初始化
       * @param {*}
       * @return {*}
       */
      async initList () {
        // 礼物列表
        apiDic.getGiftList('0').then(({ data }) => {
          this.giftList = data
        })
        apiDic
          .getDicDropdown(
            'internship_duration,internship_location_type,invoice_type,common_yes_or_no,order_supplementary_type,sign_excess_month'
          )
          .then((res) => {
            this.order_supplementary_type	= res.data.order_supplementary_type
            this.internship_duration = res.data.internship_duration
            this.internship_location_type = res.data.internship_location_type
            this.invoice_type = res.data.invoice_type
            this.common_yes_or_no = res.data.common_yes_or_no
            this.sign_excess_month = res.data.sign_excess_month
          })
        /* 合同公司下拉选 */
        apiDic.getDicWstCompany().then((res) => {
          this.wst_company = res.data
        })
        /* 渠道列表 */
        apiDic.getChannelSource().then((res) => {
          this.channel_sourceList = res.data.sourceList
        })
        /* 下拉联系人列表 */
        api.userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'sales'
        }).then((res) => {
          this.salesList = res.data.rows
          // 默认主联系人为当前登录用户
          this.salesList.forEach((v) => {
            if (v.userId == this.$store.state.role.userInfo.userId) {
              this.collect.contact1 = this.$store.state.role.userInfo.userId
            }
          })
        })
        // 获取折扣活动列表
        const params = {
          pageNum: 1,
          pageSize: 1000,
          programId: this.programId,
          discountStatus: '进行中',
          activeStatus: '1'
        }
        apiAct.getInfoList(params).then((res) => {
          console.log('获取折扣活动列表', res)
          this.discountList = res.data.rows
        })
        /* vip推荐人列表 */
        api.userList({
          pageNum: 1,
          pageSize: 10000,
          entryStatus: '1',
          sortCol: 'userName',
          sort: 'ASC',
          positionType: 'strategist,services'
        })
          .then((res) => {
            this.vipSelect = res.data.rows
          })
        /* Strategist列表 */
        api.userList({
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
        /* Program Manager列表 */
        api.userList({
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
        /* 获取实时汇率区间 */
        api.getRate({ currencyType: 'usd' }).then((res) => {
          console.log('getRate', res)
          this.extentRate = res.data.orderRate1
          // this.collect.rate = res.data.orderRate1
        })
      },
      async initSpecList () {
        this.specList = []
        apiDic.getSpecList('1').then(res => {
          console.log(res.data)
          this.specList = res.data
        })
      },
      /**
       * @description: 页面初始化
       * @param {*}
       * @return {*}
       */
      async init () {
        this.getMenteeData()
        if (this.offerPList.programId) {
          api.getProgramById(this.offerPList.programId).then((res) => {
            console.log(res.data, '获取求职信息')
            this.baseProgram = Object.assign(this.baseProgram, res.data)
            // 求职项目的基础价格为priceCny,priceUsd为保证页面统一,页面自义定base官方价格
            this.baseProgram.basePriceUsd = res.data.priceUsd
            this.baseProgram.basePriceCny = res.data.priceCny
            const data = JSON.parse(JSON.stringify(this.baseProgram))
            this.copyBaseProgram = {
              basePriceUsd: data.priceUsd,
              basePriceCny: data.priceCny,
              mentorHour: data.mentorHour,
              freeMentorHour: data.freeMentorHour,
              basicMentorHour: data.basicMentorHour,
              priceCny: data.priceCny,
              priceUsd: data.priceUsd,
              period: data.period,
              periodUnit: data.periodUnit
            }
          })
          apiDic.getProgramDetailById(this.offerPList.programId).then((res) => {
            this.offerProgramContractList = [{ label: '公共合同模板', options: res.data.commonContractList }, { label: '定制合同模板', options: res.data.contractList }]
          })
        }
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
        if (this.graduatePList.programId) {
          const params5 = {
            pageNum: 1,
            pageSize: 999,
            programType: 'graduate_program',
            programStatus: 1
          }
          apiDic.getProgramDicList(params5).then((res) => {
            console.log('获取申研列表', res)
            this.graduateArr = res.data.rows
            this.changeGraduateOption(this.graduatePList.programId)
          })
        }
        this.schoolList = await this.getSchool('school')
        this.highSchool = await this.getSchool('highSchool')
        this.sex = await this.getDictionary('sex')
        this.degree = await this.getDictionary('degree')
        this.gp_country = await this.getDictionary('gp_country')
      },
  
      /**
       * @description: 获取升学项目信息
       * @param {*} v
       * @return {*}
       */
      changeGraduateOption (v) {
        this.graduateArr.forEach((ve) => {
          if (ve.programId == v) {
            console.log('获取升学项目信息', ve)
            this.graduateProgram = Object.assign(this.graduateProgram, ve)
            this.graduateProgram.programId = v
            // 升学项目的基础价格为priceCny,priceUsd为保证页面统一,页面自义定base官方价格
            this.graduateProgram.basePriceCny = ve.priceCny
            this.graduateProgram.basePriceUsd = ve.priceUsd
            // 背景提升初始化
            this.graduateProgram.gpBackgroundPromotionQuantity = this.graduatePList.internshipNum
            this.graduateProgram.gpBackgroundPromotionPriceCny = 0
            this.graduateProgram.gpBackgroundPromotionPriceUsd = 0
            apiDic.getProgramDetailById(ve.programId).then((res) => {
              console.log(res.data, '获取申研项目合同模板')
              this.graduateProgramContractList = [{ label: '公共合同模板', options: res.data.commonContractList }, { label: '定制合同模板', options: res.data.contractList }]
            })
          }
        })
      },
  
      getPriceOff (val) {
        this.priceOff = val
        this.collect.discountInfo = ''
      },
      /**
       * @description: 线上-下一步
       * @param {*}
       * @return {*}
       */
      async onlineNext () {
        if (!this.checkSpecStatus) {
          this.$message.error('规格周期单位和基础项目不同无法下单 ！！')
          return false
        }
        this.rulesVaildResult = []
        const validArr = []
        // nvba needValidBaseArr
        const nvba = ['menteeDetail', 'baseProgram', 'collectOffer', 'graduateProgram', 'collectGraduate', 'gift', 'invoice', 'collect']
        for (var i = 0; i < nvba.length; i++) {
          validArr.push(new Promise((resolve, reject) => {
            if (!this.$refs[nvba[i]])resolve()
            this.$refs[nvba[i]].validate((valid) => {
              resolve(this.rulesVaildResult.push(valid))
            })
          }))
        }
        // nvca needValidComponentsArr
        const nvca = ['internshipOffer', 'internshipGraduate', 'oralOffer', 'oralGraduate', 'cfaOffer', 'cfaGraduate',
          'financeOffer', 'financeGraduate', 'tutoringOffer', 'tutoringGraduate', 'supplementaryOffer', 'supplementaryGraduate', 'supplementaryCommon']
        for (var i = 0; i < nvca.length; i++) {
          validArr.push(new Promise((resolve, reject) => {
            if (!this.$refs[nvca[i]])resolve()
            this.$refs[nvca[i]].getValid().then((valid) => {
              valid == undefined ? resolve() : resolve(this.rulesVaildResult.push(valid))
            })
          }))
        }
        Promise.all(validArr).then(() => {
          if (this.rulesVaildResult.indexOf(false) > -1) {
            console.log('验证失败')
          } else {
            console.log('验证成功')
            if (!this.discountRate()) return
            if (this.signOnline) {
              this.$message({
                type: 'warning',
                message: '请先预览合同，并确认无误'
              })
              this.contractList = []
              const collectOffer = this.offerPList.programId ? { programId: 1, contract: this.offerPList.collect.contract } : {}
              const oralOffer = this.$refs.oralOffer.oralProgram
              const cfaOffer = this.$refs.cfaOffer.cfaProgram
              const financeOffer = this.$refs.financeOffer.financeProgram
              const tutoringOffer = this.$refs.tutoringOffer.tutoringProgram
              const collectGraduate = this.graduatePList.programId ? { programId: 1, contract: this.graduatePList.collect.contract } : {}
              const oralGraduate = this.$refs.oralGraduate.oralProgram
              const cfaGraduate = this.$refs.cfaGraduate.cfaProgram
              const financeGraduate = this.$refs.financeGraduate.financeProgram
              const tutoringGraduate = this.$refs.tutoringGraduate.tutoringProgram
              const ca1 = [collectOffer, oralOffer, cfaOffer, financeOffer, tutoringOffer]
              const supplementaryOffer = this.$refs.supplementaryOffer.supplementaryArr
              const ca2 = [collectGraduate, oralGraduate, cfaGraduate, financeGraduate, tutoringGraduate]
              const supplementaryGraduate = this.$refs.supplementaryGraduate.supplementaryArr
              const supplementaryCommon = this.$refs.supplementaryCommon.supplementaryArr
              // this.dealContract(ca1.concat(supplementaryOffer).concat(ca2).concat(supplementaryGraduate).concat(supplementaryCommon).concat(entrust))
  
              let dataObj = {}
              // 求职基础项合同
              dataObj = Object.assign(
                {},
                this.baseProgram,
                this.offerPList.collect,
                {
                  internship: this.offerPList.internshipNum,
                  oralLessonHour: oralOffer.oralLessonHour
                }
              )
              if (dataObj.mentorHour == '-1') { dataObj.mentorHour = '不限' }
              if (dataObj.freeMentorHour == '-1') { dataObj.freeMentorHour = '不限' }
              if (dataObj.basicMentorHour == '-1') { dataObj.basicMentorHour = '不限' }
              if (dataObj.leadStrategistHour == '-1') { dataObj.leadStrategistHour = '不限' }
              if (dataObj.officeHourStrategistSession == '-1') { dataObj.officeHourStrategistSession = '不限' }
              if (dataObj.seriesHour == '-1') { dataObj.seriesHour = '不限' }
              if (dataObj.jerryHour == '-1') { dataObj.jerryHour = '不限' }
              if (dataObj.tequilaShotHour == '-1') { dataObj.tequilaShotHour = '不限' }
              if (dataObj.officeHour == '-1') { dataObj.officeHour = '不限' }
              if (dataObj.liveLesson == '-1') { dataObj.liveLesson = '不限' }
              if (dataObj.applicationLetterModify == '-1') { dataObj.applicationLetterModify = '不限' }
              if (dataObj.mentorLetterModify == '-1') { dataObj.mentorLetterModify = '不限' }
              if (dataObj.mentorCount == '-1') { dataObj.mentorCount = '不限' }
              if (dataObj.seminars == '-1') { dataObj.seminars = '不限' }
              this.dealContract(collectOffer, dataObj)
              console.log('求职基础项合同数据', collectOffer)
              // 求职补充协议合同
              dataObj = Object.assign(
                {},
                this.$refs.supplementaryOffer.programData,
                this.offerPList.collect
              )
              supplementaryOffer.forEach((s) => {
                if (s.programId == 'pkId_specify') {
                  this.dealSpecifyContract(s, this.$refs.internshipOffer.programData)
                } else {
                  this.dealContract(s, dataObj)
                }
              })
  
              // dataObj = Object.assign(
              //   {},
              //   this.graduateProgram,
              //   this.graduatePList.collect,
              //   {
              //     internship: this.graduatePList.internshipNum,
              //     dctBasePriceUsd: this.graduatePList.dctBasePriceUsd,
              //     dctBasePriceCny: this.graduatePList.dctBasePriceCny,
              //     dctInternshipPriceUsd: this.graduatePList.dctInternshipPriceUsd,
              //     dctInternshipPriceCny: this.graduatePList.dctInternshipPriceCny
              //   }
              // )
              if (this.internshipGraduateVisible) {
                console.log(this.$refs.internshipGraduate)
                const internshipGraduate = (this.$refs.internshipGraduate.info.internshipProgram || this.$refs.internshipGraduate.programData)
                console.log('实习项目数据', internshipGraduate)
                this.dealContractNew(internshipGraduate)
              }
  
              // 申研基础项合同
              dataObj = Object.assign(
                {},
                this.graduateProgram,
                this.graduatePList.collect,
                {
                  internship: this.graduatePList.internshipNum,
                  dctBasePriceUsd: this.graduatePList.dctBasePriceUsd,
                  dctBasePriceCny: this.graduatePList.dctBasePriceCny,
                  dctInternshipPriceUsd: this.graduatePList.dctInternshipPriceUsd,
                  dctInternshipPriceCny: this.graduatePList.dctInternshipPriceCny
                }
              )
              const countryArr = []
              dataObj.gpApplyCountry && dataObj.gpApplyCountry.forEach((c) => {
                this.gp_country.filter(function (item) {
                  if (item.itemValue == c) { countryArr.push(item.itemName) }
                })
              })
              dataObj.gpApplyCountry = countryArr.join()
              if (dataObj.liveLesson == '-1') { dataObj.liveLesson = '不限' }
              if (dataObj.mentorHour == '-1') { dataObj.mentorHour = '不限' }
              this.dealContract(collectGraduate, dataObj)
              // 申研补充协议合同
              dataObj = Object.assign(
                {},
                this.$refs.supplementaryGraduate.programData,
                this.graduatePList.collect,
                {
                  dctBasePriceUsd: this.graduatePList.dctBasePriceUsd,
                  dctBasePriceCny: this.graduatePList.dctBasePriceCny,
                  dctInternshipPriceUsd: this.graduatePList.dctInternshipPriceUsd,
                  dctInternshipPriceCny: this.graduatePList.dctInternshipPriceCny
                }
              )
              supplementaryGraduate.forEach((s) => {
                if (s.programId == 'pkId_specify') {
                  this.dealSpecifyContract(s, this.$refs.internshipGraduate.programData)
                } else {
                  this.dealContract(s, dataObj)
                }
              })
              this.dealContract(oralGraduate, this.$refs.oralGraduate.programData)
              this.dealContract(cfaGraduate, this.$refs.cfaGraduate.programData)
              this.dealContract(financeGraduate, this.$refs.financeGraduate.programData)
              this.dealContract(tutoringGraduate, this.$refs.tutoringGraduate.programData)
  
              // 总合同补充协议模板
              dataObj = Object.assign(
                {},
                this.$refs.supplementaryCommon.programData,
                this.gift,
                this.collect,
                {
                  gpPriceUsd: this.graduateProgram.priceUsd,
                  gpPriceCny: this.graduateProgram.priceCny
                }
              )
              supplementaryCommon.forEach((s) => {
                this.dealContract(s, dataObj)
              })
              this.dealEntrust()
              this.signDetailNewVisible = false
              this.changePDFShow = true
            }
          }
        })
      },
  
      discountRate (type) {
        let priceRate = 0
        // if(type=="graduate"){
        //   // 基础项目原价:nTotalP
        //   let totalP = 0;
        //   let nTotalP = this.collect.totalPriceUsd * 1;
        //   let baseP = this.graduateProgram.basePriceUsd * 1;
        //   let internshipP = this.$refs.internshipGraduate.totalPrice * 1;
        //   let oralP = this.$refs.oralGraduate.totalPrice * 1;
        //   let cfaP = this.$refs.cfaGraduate.totalPrice * 1;
        //   let financeP = this.$refs.financeGraduate.totalPrice * 1;
        //   let tutoringP = this.$refs.tutoringGraduate.totalPrice * 1;
        //   totalP = baseP + internshipP + oralP + cfaP + financeP + tutoringP
        //   priceRate = ((totalP - nTotalP) / totalP) * 100;
        // }
        const totalP = this.collect.originalPriceUsd * 1
        const nTotalP = this.collect.totalPriceUsd * 1
        priceRate = ((totalP - nTotalP) / totalP) * 100
        if (priceRate >= 5) {
          if (!this.collect.discountInfo) {
            this.$message({
              type: 'warning',
              message: '价格有折扣，请填写折扣说明'
            })
            // 折扣订单时补充协议
            this.priceOff = true
            return false
          }
        } else {
          if (this.extentRate <= this.collect.rate) {
          } else {
            priceRate = 5
          }
        }
        // 礼品价值不超过合同金额4%
        let giftTotalPriceForOrderPrice = 0
        const giftTotalName = []
        this.gift.gifts.forEach((v) => {
          if (v.gift) {
            giftTotalPriceForOrderPrice += v.gift.split('&&')[2] * 1 * v.giftNum
            giftTotalName.push(v.gift.split('&&')[1])
          } else {
            this.$message({
              type: 'warning',
              message: '请选择具体礼物'
            })
            return false
          }
        })
        if ((this.collect.totalPriceCny * 4.5) / 100 < giftTotalPriceForOrderPrice) {
          this.$message({
            type: 'warning',
            message: '礼品价值不得超过合同总金额4.5%'
          })
          return false
        }
        this.gift.giftTotalPrice = giftTotalPriceForOrderPrice
        this.gift.giftName = giftTotalName.toString()
        return true
      },
  
      dealContract (ca, dataObj) {
        if (ca.programId == '' || ca.programId == undefined || ca.contract == '' || ca.contract == undefined) return
        this.createContract(ca, dataObj)
        console.log()
      },
      dealContractNew (ca) {
        // if (ca.programId == '' || ca.programId == undefined || ca.contract == '' || ca.contract == undefined) return
        const arr = []
        ca.forEach(item => {
          if (item.contract != '0&&&0') {
            arr.push(item)
          }
        })
        this.createContractNew(arr)
        console.log()
      },
      createContract (cobject, data) {
        const programData = Object.assign({ rate: this.collect.rate }, data)
        let content = cobject.contract || ''
        const title = cobject.contractTitle || content.split('&&&')[0]
        const reg = /\$\{.+?\}/g
        const arr = []
        let r = []
        let contactHTML = ''
        while ((r = reg.exec(content))) {
          arr.push(r)
        }
        arr.forEach((v) => {
          const strReg = RegExp(/\(|\)|\+|\-|\*|\//g)
          const pArr = []
          let pStr = ''
          const param = v[0].substr(2, v[0].length - 3)
          if (!param.match(strReg)) {
            // ca[i][param]
            const word = programData[param]
            contactHTML = word || word == 0 ? `<span style="background:#afa">${word}</span>` : '<span style="background:#afa">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>'
            content = content.split(v[0]).join(contactHTML)
            return
          }
          for (let i = 0; i < param.length; i++) {
            if (param[i].match(strReg)) {
              // 包含运算符号
              pStr != '' ? pArr.push(pStr) : ''
              pStr = ''
              pArr.push(param[i])
            } else {
              pStr += param[i]
              i == param.length - 1 ? pArr.push(pStr) : ''
            }
          }
          let charStr = ''
          pArr.forEach((p) => {
            if (p.match(strReg)) {
              charStr += p
            } else {
              programData[p] ? charStr += programData[p] : (Number(p) ? charStr += Number(p) : charStr += 0)
            }
          })
          contactHTML = `<span style="background:#afa">${eval(charStr)}</span>`
          // let a = param.replace(/\(|\)|\+|\-|\*|\/|\.|[0-9]/g, " ")
          // console.log(a.split(" "))
          content = content.split(v[0]).join(contactHTML)
        })
        const contract = { title: content.split('&&&')[0], contract: content.split('&&&')[1], contractTitle: title }
        console.log(contract, 1111111111111111111)
        this.contractList.push(contract)
      },
      createContractNew (cobject) {
        const reg = /\$\{.+?\}/g
        const arr = []
        let r = []
        const contractContent4 = cobject.length > 0 ? cobject[0].contract : ''
        while ((r = reg.exec(contractContent4))) {
          arr.push(r)
        }
        const arr3 = []
        const arr2 = []
        for (let i = 0; i < cobject.length; i++) {
          for (let j = 0; j < this.internshipUnitList.length; j++) {
            for (let m = 0; m < this.internshipUnitList[j].internshipArr.length; m++) {
              if (cobject[i].internshipUnit[1] == this.internshipUnitList[j].internshipArr[m].internshipId) {
                arr3.push(`${cobject[i].internshipUnit[0]}${this.internshipUnitList[j].internshipArr[m].internshipName}`)
              }
            }
          }
        }
        for (let i = 0; i < cobject.length; i++) {
          for (let j = 0; j < this.internship_duration.length; j++) {
            if (cobject[i].internshipDuration == this.internship_duration[j].itemValue) {
              arr2.push(this.internship_duration[j].itemName)
            }
          }
        }
        const strAll = []
        for (let i = 0; i < cobject.length; i++) {
          if (cobject[i].internshipLocation) {
            let str = ''
            str = cobject[i].contract.split('&&&')[1]
            console.log(i, 2222222222222)
            arr.forEach((v) => {
              const param = v[0].substr(2, v[0].length - 3)
              console.log(v[0], param, arr3, cobject[i].internshipLocation, cobject[i].internshipLocation)
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
                      (cobject[i].internshipLocation || '空') +
                      '</span>'
                  )
              } else if (param == 'priceCny') {
                str = str
                  .split(v[0])
                  .join(
                    '<span style="background:#afa">' +
                      (cobject[i].priceCny || '空') +
                      '</span>'
                  )
              } else if (param == 'priceUsd') {
                str = str
                  .split(v[0])
                  .join(
                    '<span style="background:#afa">' +
                      (cobject[i].priceUsd || '空') +
                      '</span>'
                  )
              } else if (param == 'rate') {
                str = str
                  .split(v[0])
                  .join(
                    '<span style="background:#afa">' +
                      (this.collect.rate || '空') +
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
            strAll.push({ title: cobject[i].contract.split('&&&')[0], contract: str, contractTitle: cobject[i].contract.split('&&&')[0] })
          }
        }
        console.log(strAll, 1111111111111111111)
        strAll.forEach(item => {
          this.contractList.push(item)
        })
        console.log(strAll, 1111111111111111111)
      },
      // Specify实习合同处理
      dealSpecifyContract (cobject, data) {
        const content = cobject.contract || ''
        let strAll = ''
        const title = cobject.contractTitle || content.split('&&&')[0]
        data.forEach((d) => {
          let str = content.split('&&&')[1]
          const programData = Object.assign({ rate: this.collect.rate }, d)
          const reg = /\$\{.+?\}/g
          const arr = []
          let r = []
          let contactHTML = ''
          while ((r = reg.exec(str))) {
            arr.push(r)
          }
          arr.forEach((v) => {
            const strReg = RegExp(/\(|\)|\+|\-|\*|\//g)
            const pArr = []
            let pStr = ''
            const param = v[0].substr(2, v[0].length - 3)
            if (!param.match(strReg)) {
              // ca[i][param]
              const word = programData[param]
              contactHTML = word || word == 0 ? `<span style="background:#afa">${word}</span>` : '<span style="background:#afa">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>'
              str = str.split(v[0]).join(contactHTML)
              return
            }
            for (let i = 0; i < param.length; i++) {
              if (param[i].match(strReg)) {
                // 包含运算符号
                pStr != '' ? pArr.push(pStr) : ''
                pStr = ''
                pArr.push(param[i])
              } else {
                pStr += param[i]
                i == param.length - 1 ? pArr.push(pStr) : ''
              }
            }
            let charStr = ''
            pArr.forEach((p) => {
              if (p.match(strReg)) {
                charStr += p
              } else {
                programData[p] ? charStr += programData[p] : (Number(p) ? charStr += Number(p) : charStr += 0)
              }
            })
            contactHTML = `<span style="background:#afa">${eval(charStr)}</span>`
            str = str.split(v[0]).join(contactHTML)
          })
          strAll += `${str}
            `
        })
        const contract = { title: content.split('&&&')[0], contract: strAll, contractTitle: title }
        this.contractList.push(contract)
      },
      // 合同处理 旧 占时废弃
      dealContractLast (ca) {
        this.dealData()
        this.programData = Object.assign(
          {},
          this.programData,
          this.$refs.internshipOffer && this.$refs.internshipOffer.programData,
          this.$refs.oralOffer.programData,
          this.$refs.cfaOffer.programData,
          this.$refs.financeOffer.programData,
          this.$refs.tutoringOffer.programData,
          this.$refs.supplementaryOffer.programData,
          this.$refs.internshipGraduate && this.$refs.internshipGraduate.programData,
          this.$refs.oralGraduate.programData,
          this.$refs.cfaGraduate.programData,
          this.$refs.financeGraduate.programData,
          this.$refs.tutoringGraduate.programData,
          this.$refs.supplementaryGraduate.programData,
          this.$refs.supplementaryCommon.programData
        )
        console.log(this.programData)
        this.contractList = []
        for (var i = 0; i < ca.length; i++) {
          if (ca[i].programId == '' || ca[i].contract == '') continue
          let content = ca[i].contract || ''
          const title = ca[i].contractTitle || content.split('&&&')[0]
          const reg = /\$\{.+?\}/g
          const arr = []
          let r = []
          let contactHTML = ''
          while ((r = reg.exec(content))) {
            arr.push(r)
          }
          arr.forEach((v) => {
            const strReg = RegExp(/\(|\)|\+|\-|\*|\//g)
            const pArr = []
            let pStr = ''
            const param = v[0].substr(2, v[0].length - 3)
            if (!param.match(strReg)) {
              // ca[i][param]
              const word = this.programData[param]
              contactHTML = word || word == 0 ? `<span style="background:#afa">${word}</span>` : '<span style="background:#afa">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>'
              content = content.split(v[0]).join(contactHTML)
              return
            }
            for (let i = 0; i < param.length; i++) {
              if (param[i].match(strReg)) {
                // 包含运算符号
                pStr != '' ? pArr.push(pStr) : ''
                pStr = ''
                pArr.push(param[i])
              } else {
                pStr += param[i]
                i == param.length - 1 ? pArr.push(pStr) : ''
              }
            }
            let charStr = ''
            pArr.forEach((p) => {
              if (p.match(strReg)) {
                charStr += p
              } else {
                this.programData[p] ? charStr += this.programData[p] : (Number(p) ? charStr += Number(p) : charStr += 0)
              }
            })
            contactHTML = `<span style="background:#afa">${eval(charStr)}</span>`
            // let a = param.replace(/\(|\)|\+|\-|\*|\/|\.|[0-9]/g, " ")
            // console.log(a.split(" "))
            content = content.split(v[0]).join(contactHTML)
          })
          this.contractList.push({ title: content.split('&&&')[0], contract: content.split('&&&')[1], contractTitle: title })
        }
        this.signDetailNewVisible = false
        this.changePDFShow = true
      },
  
      // 委托确认书处理
      dealEntrust () {
        let context = ''
        if (this.entrust.checkList.indexOf('allograph') > -1) {
          context += '<p><strong>本合同存在代签：</strong></p><br />' +
          `<p>代签人姓名： <span style="background:#afa">${this.entrust.allographName}</span></p>` +
          `<p>与被代签人关系： <span style="background:#afa">${this.entrust.relationship}</span></p>` +
          '<p>是否取得被代签人授权：是</p>' +
          '<br/>'
        }
        if (this.entrust.checkList.indexOf('paying') > -1) {
          context += '<p><strong>本合同存在费用代付：</strong></p><br />' +
          `<p>代付人姓名/名称：<span style="background:#afa">${this.entrust.payingName}</span></p>` +
          `<p>代付金额： <span style="background:#afa">￥${this.entrust.entrustPrice}</span></p>`
        }
        const contract = { programId: 1, contract: `${context}`, title: '代签代付补充协议', contractTitle: 'Wall Street Tequila 咨询服务合同-补充协议' }
        context !== '' ? this.contractList.push(contract) : ''
      },
      dealData () {
        const _this = this
        let obj = JSON.parse(JSON.stringify(this.menteeDetail))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`menteeDetail${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        // 求职部分
        obj = JSON.parse(JSON.stringify(this.baseProgram))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`op${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        obj = JSON.parse(JSON.stringify(this.offerPList.collect))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`opcollect${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        // 申研部分
        obj = JSON.parse(JSON.stringify(this.graduateProgram))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`gp${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        obj = JSON.parse(JSON.stringify(this.graduatePList.collect))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`gpcollect${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        obj = JSON.parse(JSON.stringify(this.collect))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`collect${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        obj = JSON.parse(JSON.stringify(this.entrust))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`entrust${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        obj = JSON.parse(JSON.stringify(this.gift))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`gift${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        obj = JSON.parse(JSON.stringify(this.invoice))
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          _this.programData[`invoice${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
        })
        // 特殊字段处理
        if (this.programData.gpLiveLesson == '-1') { this.programData.gpLiveLesson = '不限' }
        if (this.programData.gpMentorHour == '-1') { this.programData.gpMentorHour = '不限' }
        if (this.programData.gporalOralLessonHour == '-1') { this.programData.gporalOralLessonHour = '不限' }
        const countryArr = []
        this.programData.gpGpApplyCountry && this.programData.gpGpApplyCountry.forEach((c) => {
          this.gp_country.filter(function (item) {
            if (item.itemValue == c) { countryArr.push(item.itemName) }
          })
        })
        this.programData.gpGpApplyCountry = countryArr.join()
      },
      // 返回上一步
      backSign () {
        this.changePDFShow = false
        this.signDetailNewVisible = true
      },
  
      // 页面数据集合
      submitGG2 () {
        const oralOffer = this.$refs.oralOffer.oralProgram
        const cfaOffer = this.$refs.cfaOffer.cfaProgram
        const financeOffer = this.$refs.financeOffer.financeProgram
        const tutoringOffer = this.$refs.tutoringOffer.tutoringProgram
        const oralGraduate = this.$refs.oralGraduate.oralProgram
        const cfaGraduate = this.$refs.cfaGraduate.cfaProgram
        const financeGraduate = this.$refs.financeGraduate.financeProgram
        const tutoringGraduate = this.$refs.tutoringGraduate.tutoringProgram
        //  数据结构赋值data
        const data = {
          menteeId: this.menteeId,
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
          contractArr: []
        }
        this.contractList.forEach((v) => {
          v.contract = v.contract.replace(
            /\<\/?span( style="background:#afa")?\>/g,
            ''
          )
          const reg = /(\n第.章\s)|(\n第\d\d?条\s)|(\n\d\d?\.\d\d?\s)|(\n\d\d?\.\d\d?\.\d\d?\s)|(\n\d\d?\.\s)/g
          const rarr = []
          let r = []
          while ((r = reg.exec(v.contractt))) {
            rarr.push(r)
          }
          for (let i = 0; i < rarr.length; i++) {
            const str = rarr[i][0]
            const newStr = str.substr(0, str.length - 1) + '\t'
            v.contract = v.contract.replace(str, newStr)
          }
          data.contractArr.push({
            contractContent: v.contract,
            contractTitle: v.contractTitle
          })
        })
        data.mentee.schoolName = data.mentee.school
        this.schoolList.forEach((v) => {
          if (v.schoolId == data.mentee.school) {
            data.mentee.schoolName = v.schoolName
          }
        })
        // if(this.$refs.supplementaryGraduate.checkList.indexOf('赠TequilaShot补充协议') > -1){
  
        // }
  
        if (this.offerPList.programId) {
          const basic = {
            program: this.baseProgram.programId,
            programWeight: this.baseProgram.programWeight,
            programName: this.baseProgram.programName,
            programPriceCny: this.baseProgram.priceCny,
            programPriceUsd: this.baseProgram.priceUsd,
            programPriceNote: this.baseProgram.programPriceNote,
            strategist: this.baseProgram.strategist,
            mentorHour:
              this.baseProgram.mentorHour && this.baseProgram.mentorHour > 0
                ? this.baseProgram.mentorHour
                : 0,
            freeMentorHour:
              this.baseProgram.freeMentorHour && this.baseProgram.freeMentorHour > 0
                ? this.baseProgram.freeMentorHour
                : 0,
            basicMentorHour:
              this.baseProgram.basicMentorHour && this.baseProgram.basicMentorHour > 0
                ? this.baseProgram.basicMentorHour
                : 0,
            vipHour: this.baseProgram.leadStrategistHour,
            leadStrategistHour: this.baseProgram.leadStrategistHour,
            note: this.baseProgram.note,
            program_level: this.baseProgram.program_level,
            program_type: this.baseProgram.program_type,
  
            applicationLetterModify: this.baseProgram.applicationLetterModify,
            mentorLetterModify: this.baseProgram.mentorLetterModify,
            jerryHour: this.baseProgram.jerryHour,
            seniorStrategist: this.baseProgram.seniorStrategist,
            hasContinual: this.baseProgram.hasContinual,
            hasEbookStore: this.baseProgram.hasEbookStore,
            emergencyMentor: this.baseProgram.emergencyMentor,
            interviewMentor: this.baseProgram.interviewMentor,
            priority: this.baseProgram.priority,
            hasEnglishSeries: this.baseProgram.hasEnglishSeries,
            hasOral: this.baseProgram.hasOral,
            certificateSubjectLiveCourseAuthority: this.baseProgram
              .certificateSubjectLiveCourseAuthority,
            mentorCount: this.baseProgram.mentorCount,
            tequilaShotHour: this.baseProgram.tequilaShotHour,
            seminars: this.baseProgram.seminars,
            officeHour: this.baseProgram.officeHour,
            liveLesson: this.baseProgram.liveLesson,
            seriesHour: this.baseProgram.seriesHour,
            officeHourStrategistSession: this.baseProgram.officeHourStrategistSession,
            startDate: this.offerPList.collect.startDate,
            endDate: this.offerPList.collect.endDate,
            extendedEndDate: this.offerPList.collect.extendedEndDate
          }
          if (this.offerPList.supple.discountNum == 0.9) {
            basic.discountProportion = 10
          } else if (this.graduatePList.supple.discountNum == 0.95) {
            basic.discountProportion = 5
          } else {
            basic.discountProportion = 0
          }
          if (this.$refs.supplementaryOffer.checkList.indexOf('赠一对一补充协议') > -1) {
            if (this.baseProgram.mentorHour == '-1') {
              basic.mentorHour = -1
            } else {
              basic.mentorHour = this.baseProgram.mentorHour + this.$refs.supplementaryOffer.supplementary.excessMentorHour
            }
          }
          if (this.$refs.supplementaryOffer.checkList.indexOf('赠创始团队其中一人 一对一补充协议') > -1) {
            if (this.baseProgram.jerryHour == '-1') {
              basic.jerryHour = -1
            } else {
              basic.jerryHour = this.baseProgram.jerryHour + this.$refs.supplementaryOffer.supplementary.substituteMentorHour
            }
          }
          if (this.$refs.supplementaryOffer.checkList.indexOf('赠TequilaShot补充协议') > -1) {
            if (this.baseProgram.tequilaShotHour == '-1') {
              basic.tequilaShotHour = -1
            } else {
              basic.tequilaShotHour = this.baseProgram.tequilaShotHour + this.$refs.supplementaryOffer.supplementary.excessSeriesHour
            }
          }
          data.basic = basic
        }
  
        if (this.internshipOfferVisible) {
          const internship = []
          const intership = this.$refs.internshipOffer.info.internshipProgram
          for (let i = 0; i < this.offerPList.internshipNum; i++) {
            const inter = {
              program: 3,
              programWeight: intership[i].programWeight,
              programPriceCny: intership[i].priceCny,
              programPriceUsd: intership[i].priceUsd,
              internshipId: intership[i].internshipUnit[1],
              internshipNote: intership[i].note,
              internshipFlag: intership[i].internshipFlag
            }
            internship.push(inter)
          }
          data.internship = internship
        }
        if (this.oralOfferVisible) {
          const inter = {
            program: oralOffer.programId,
            programWeight: oralOffer.programWeight,
            programPriceCny: oralOffer.priceCny,
            programPriceUsd: oralOffer.priceUsd,
            programId: oralOffer.programId,
            oralLessonHour: oralOffer.oralLessonHour,
            seriesHour: oralOffer.seriesHour,
            strategist: oralOffer.strategist,
            services: oralOffer.services,
            startDate: oralOffer.startDate,
            endDate: oralOffer.endDate,
            extendedEndDate: oralOffer.extendedEndDate,
            programPriceNote: oralOffer.note
          }
          data.oral = [inter]
        }
        if (this.cfaOfferVisible) {
          console.log('cfaOfferVisible')
          const inter = {
            programWeight: cfaOffer.programWeight,
            program: cfaOffer.programId,
            programPriceCny: cfaOffer.priceCny,
            programPriceUsd: cfaOffer.priceUsd,
            medalTokens: cfaOffer.medalTokens,
            programId: cfaOffer.programId,
            startDate: cfaOffer.startDate,
            endDate: cfaOffer.endDate,
            extendedEndDate: cfaOffer.extendedEndDate,
            note: cfaOffer.note
          }
          data.cfa = inter
        } else if (this.$refs.supplementaryOffer.giftCfaProgramData.programId && this.$refs.supplementaryOffer.giftCfaProgramData.programId != '') {
          const giftCfaOffer = this.$refs.supplementaryOffer.giftCfaProgramData
          console.log('giftCfaOffer', giftCfaOffer, this.$refs.supplementaryOffer)
          const inter = {
            programWeight: giftCfaOffer.programWeight,
            program: giftCfaOffer.programId,
            programPriceCny: giftCfaOffer.priceCny,
            programPriceUsd: giftCfaOffer.priceUsd,
            medalTokens: giftCfaOffer.medalTokens,
            programId: giftCfaOffer.programId,
            startDate: giftCfaOffer.startDate,
            endDate: giftCfaOffer.endDate,
            extendedEndDate: giftCfaOffer.extendedEndDate,
            note: giftCfaOffer.note
          }
          data.cfa = inter
        }
        if (this.financeOfferVisible) {
          const financeData = {
            programWeight: financeOffer.programWeight,
            program: financeOffer.programId,
            programPriceCny: financeOffer.priceCny,
            programPriceUsd: financeOffer.priceUsd,
            medalTokens: financeOffer.medalTokens,
            financeHour: financeOffer.financeHour,
            strategist: financeOffer.strategist,
            services: financeOffer.services,
            programId: financeOffer.programId,
            startDate: financeOffer.startDate,
            endDate: financeOffer.endDate,
            extendedEndDate: financeOffer.extendedEndDate,
            note: financeOffer.note
          }
          data.finance = financeData
        }
        if (this.tutoringOfferVisible) {
          const tutoringData = {
            programWeight: tutoringOffer.programWeight,
            program: tutoringOffer.programId,
            programPriceCny: tutoringOffer.priceCny,
            programPriceUsd: tutoringOffer.priceUsd,
            medalTokens: tutoringOffer.medalTokens,
            tutoringMentorHour: tutoringOffer.tutoringMentorHour,
            strategist: tutoringOffer.strategist,
            services: tutoringOffer.services,
            programId: tutoringOffer.programId,
            startDate: tutoringOffer.startDate,
            endDate: tutoringOffer.endDate,
            extendedEndDate: tutoringOffer.extendedEndDate,
            note: tutoringOffer.note
          }
          data.tutoring = tutoringData
        }
  
        if (this.graduatePList.programId) {
          const graduateData = {
            programWeight: this.graduateProgram.programWeight,
            program: this.graduateProgram.programId,
            programPriceCny: this.graduateProgram.basePriceCny,
            programPriceUsd: this.graduateProgram.basePriceUsd,
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
            gpApplyCountry: this.graduateProgram.gpApplyCountry,
            gpApplySeason: this.graduateProgram.gpApplySeason,
            mentorHour: this.graduateProgram.mentorHour,
            note: this.graduateProgram.note,
            startDate: this.graduatePList.collect.startDate,
            endDate: this.graduatePList.collect.endDate,
            extendedEndDate: this.graduatePList.collect.extendedEndDate,
            discountId: this.graduatePList.supple.discountId,
            discountNum: this.graduatePList.supple.discountNum
          }
          if (this.graduatePList.supple.discountNum == 0.9) {
            graduateData.discountProportion = 10
          } else if (this.graduatePList.supple.discountNum == 0.95) {
            graduateData.discountProportion = 5
          } else {
            graduateData.discountProportion = 0
          }
          data.gpBasic = graduateData
        }
        if (this.internshipGraduateVisible) {
          const internship = []
          const intership = this.$refs.internshipGraduate.info.internshipProgram
          for (let i = 0; i < this.graduatePList.internshipNum; i++) {
            const inter = {
              program: 3,
              programWeight: intership[i].programWeight,
              programPriceCny: intership[i].priceCny,
              programPriceUsd: intership[i].priceUsd,
              internshipId: intership[i].internshipUnit[1],
              internshipNote: intership[i].note,
              internshipFlag: intership[i].internshipFlag
            }
            internship.push(inter)
          }
          data.gpInternship = internship
        }
        if (this.oralGraduateVisible) {
          const inter = {
            program: oralGraduate.programId,
            programWeight: oralGraduate.programWeight,
            programPriceCny: oralGraduate.priceCny,
            programPriceUsd: oralGraduate.priceUsd,
            programId: oralGraduate.programId,
            oralLessonHour: oralGraduate.oralLessonHour,
            seriesHour: oralGraduate.seriesHour,
            strategist: oralGraduate.strategist,
            services: oralGraduate.services,
            startDate: oralGraduate.startDate,
            endDate: oralGraduate.endDate,
            extendedEndDate: oralGraduate.extendedEndDate,
            programPriceNote: oralGraduate.note
          }
          data.gpOral = [inter]
        }
        if (this.cfaGraduateVisible) {
          const inter = {
            programWeight: cfaGraduate.programWeight,
            program: cfaGraduate.programId,
            programPriceCny: cfaGraduate.priceCny,
            programPriceUsd: cfaGraduate.priceUsd,
            medalTokens: cfaGraduate.medalTokens,
            programId: cfaGraduate.programId,
            startDate: cfaGraduate.startDate,
            endDate: cfaGraduate.endDate,
            extendedEndDate: cfaGraduate.extendedEndDate,
            note: cfaGraduate.note
          }
          data.gpCfa = inter
        } else if (this.$refs.supplementaryGraduate.giftCfaProgramData.programId && this.$refs.supplementaryGraduate.giftCfaProgramData.programId != '') {
          const giftCfaGraduate = this.$refs.supplementaryGraduate.giftCfaProgramData
          console.log('giftCfaGraduate', giftCfaGraduate, this.$refs.supplementaryGraduate)
          const inter = {
            programWeight: giftCfaGraduate.programWeight,
            program: giftCfaGraduate.programId,
            programPriceCny: giftCfaGraduate.priceCny,
            programPriceUsd: giftCfaGraduate.priceUsd,
            medalTokens: giftCfaGraduate.medalTokens,
            programId: giftCfaGraduate.programId,
            startDate: giftCfaGraduate.startDate,
            endDate: giftCfaGraduate.endDate,
            extendedEndDate: giftCfaGraduate.extendedEndDate,
            note: giftCfaGraduate.note
          }
          data.cfa = inter
        }
        if (this.financeGraduateVisible) {
          const financeData = {
            programWeight: financeGraduate.programWeight,
            program: financeGraduate.programId,
            programPriceCny: financeGraduate.priceCny,
            programPriceUsd: financeGraduate.priceUsd,
            medalTokens: financeGraduate.medalTokens,
            financeHour: financeGraduate.financeHour,
            strategist: financeGraduate.strategist,
            services: financeGraduate.services,
            programId: financeGraduate.programId,
            startDate: financeGraduate.startDate,
            endDate: financeGraduate.endDate,
            extendedEndDate: financeGraduate.extendedEndDate,
            note: financeGraduate.note
          }
          data.gpFinance = financeData
        }
        if (this.tutoringGraduateVisible) {
          const tutoringData = {
            programWeight: tutoringGraduate.programWeight,
            program: tutoringGraduate.programId,
            programPriceCny: tutoringGraduate.priceCny,
            programPriceUsd: tutoringGraduate.priceUsd,
            medalTokens: tutoringGraduate.medalTokens,
            tutoringMentorHour: tutoringGraduate.tutoringMentorHour,
            strategist: tutoringGraduate.strategist,
            services: tutoringGraduate.services,
            programId: tutoringGraduate.programId,
            startDate: tutoringGraduate.startDate,
            endDate: tutoringGraduate.endDate,
            extendedEndDate: tutoringGraduate.extendedEndDate,
            note: tutoringGraduate.note
          }
          data.gpTutoring = tutoringData
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
          vipRecommender: this.collect.vipRecommender,
          orderType: this.collect.orderType,
          signDate: this.collect.signDate,
          signCompany: this.collect.signCompany,
          pretalkId: this.collect.pretalkId,
          realName: this.menteeDetail.realName,
          pretalkName: pretalkName,
          contact1: this.collect.contact1,
          contact2: this.collect.contact2,
          rate: this.collect.rate,
          orderPrice: this.collect.totalPriceCny,
          orderPriceUsd: this.collect.totalPriceUsd,
          discountId: this.supple.discountId
        }
        if (this.collect.discountInfo) {
          collect.discountStatus = 1
          collect.discountInfo = this.collect.discountInfo
        }
        data.collect = collect
  
        // 礼品数据格式
        if (this.gift.gifts.length) {
          this.gift.gifts.forEach((v) => {
            if (!v.gift) {
              this.$message('有礼物没有选！')
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
  
        // 发票
        if (this.invoice.hasInvoice == 0) {
          data.invoiceTitle = { ...this.invoice }
        }
        if (data.basic) {
          if (data.basic.startDate > data.basic.endDate) {
            this.$message('求职合同终止日期不可小于开始日期')
            return
          }
          if (!this.signOnline) {
            if (data.collect.signDate > data.basic.startDate) {
              this.$message('合同起始日期不可小于签约日期')
              return
            }
          }
        }
        console.log(this.checkSpecStatus)
  
        if (data.gpBasic) {
          if (data.gpBasic.startDate > data.gpBasic.endDate) {
            this.$message('申研合同终止日期不可小于开始日期')
            return
          }
          if (!this.signOnline) {
            if (data.collect.signDate > data.gpBasic.startDate) {
              this.$message('合同起始日期不可小于签约日期')
              return
            }
          }
        }
        console.log(data, 'yx***********提交的数据')
        if (!this.checkSpecStatus) {
          this.$message.error('规格周期单位和基础项目不同无法下单 ！！')
        } else {
          this.signSubmit(data)
        }
        // this.signSubmitData = data;
        // this.rebateVisible = true;
        // this.signDetailNewVisible = false;
      },
  
      signDetailClose () {
        this.clear()
        this.$emit('close')
      },
      specChange () {
        let cny = 0
        let usd = 0
        let mentorHour = 0
        let period = 0
        this.offerPList.collect.startDate = ''
        this.offerPList.collect.endDate = ''
        if (this.specId.length > 0) {
          this.specList.forEach(item => {
            this.specId.forEach(item2 => {
              if (item.specId == item2) {
                cny += item.priceCny
                usd += item.priceUsd
                period += item.period
                if (this.copyBaseProgram.mentorHour != '-1') {
                  mentorHour += item.mentorHour
                }
              }
            })
          })
          if (this.copyBaseProgram.periodUnit != 'month') {
            this.checkSpecStatus = false
            this.$message.warning('项目延长周期单位不同，请清空规格选择否则无法提交！！')
          } else {
            this.baseProgram.period = period + this.copyBaseProgram.period
          }
          this.baseProgram.basePriceUsd = usd + this.copyBaseProgram.priceUsd
          this.baseProgram.basePriceCny = cny + this.copyBaseProgram.priceCny
          this.baseProgram.priceCny = cny + this.copyBaseProgram.priceCny
          this.baseProgram.priceUsd = usd + this.copyBaseProgram.priceUsd
          this.baseProgram.basicMentorHour = this.copyBaseProgram.basicMentorHour == '-1' ? '-1' : this.copyBaseProgram.basicMentorHour + mentorHour
          this.baseProgram.mentorHour = this.baseProgram.basicMentorHour == '-1' || this.baseProgram.freeMentorHour == '-1' ? '-1' : this.baseProgram.basicMentorHour + this.baseProgram.freeMentorHour
          // this.baseProgram.mentorHour = this.copyBaseProgram.mentorHour == '-1' ? '-1' : this.copyBaseProgram.mentorHour + mentorHour
          this.baseProgram.specId = this.specId
        } else {
          this.baseProgram.basePriceUsd = usd + this.copyBaseProgram.priceUsd
          this.baseProgram.basePriceCny = cny + this.copyBaseProgram.priceCny
          this.baseProgram.priceCny = cny + this.copyBaseProgram.priceCny
          this.baseProgram.priceUsd = usd + this.copyBaseProgram.priceUsd
          this.baseProgram.basicMentorHour = this.copyBaseProgram.basicMentorHour
          this.baseProgram.mentorHour = this.baseProgram.basicMentorHour == '-1' || this.baseProgram.freeMentorHour == '-1' ? '-1' : this.baseProgram.basicMentorHour + this.baseProgram.freeMentorHour
          // this.baseProgram.mentorHour = this.copyBaseProgram.mentorHour
          this.baseProgram.period = this.copyBaseProgram.period
          this.baseProgram.specId = []
          this.checkSpecStatus = true
        }
        console.log(this.specId, this.baseProgram)
      },
      changeMentorHour () {
        this.baseProgram.mentorHour = this.baseProgram.basicMentorHour == '-1' || this.baseProgram.freeMentorHour == '-1' ? '-1' : this.baseProgram.basicMentorHour + this.baseProgram.freeMentorHour
      },
      clear () {
        this.checkSpecStatus = true
        this.specId = []
        this.copyBaseProgram = {}
        this.internshipOfferVisible ? this.$refs.internshipOffer.programClose() : ''
        this.oralOfferVisible ? this.$refs.oralOffer.programClose() : ''
        this.cfaOfferVisible ? this.$refs.cfaOffer.programClose() : ''
        this.financeOfferVisible ? this.$refs.financeOffer.programClose() : ''
        this.tutoringOfferVisible ? this.$refs.tutoringOffer.programClose() : ''
        this.offerPList.programId ? this.$refs.supplementaryOffer.programClose() : ''
        this.internshipGraduateVisible ? this.$refs.internshipGraduate.programClose() : ''
        this.oralGraduateVisible ? this.$refs.oralGraduate.programClose() : ''
        this.cfaGraduateVisible ? this.$refs.cfaGraduate.programClose() : ''
        this.financeGraduateVisible ? this.$refs.financeGraduate.programClose() : ''
        this.tutoringGraduateVisible ? this.$refs.tutoringGraduate.programClose() : ''
        this.graduatePList.programId ? this.$refs.supplementaryGraduate.programClose() : ''
        this.$refs.supplementaryCommon.programClose()
        console.log('signDetailClear')
        const obj1 = this.$data
        const obj2 = this.$options.data()
        for (const attrName in obj1) {
          if (attrName !== 'rules') {
            obj1[attrName] = obj2[attrName]
          }
        };
      },
      // 获取实习金额
      getItemPrice (price, itemType, baseType) {
        console.log('实习总金额', price, itemType, baseType)
        if (baseType == 'offer') {
          switch (itemType) {
            case 'internship':
              this.internshipOfferPrice = price
              break
            case 'oral':
              this.oralOfferPrice = price
              break
            case 'cfa':
              this.cfaOfferPrice = price
              break
            case 'finance':
              this.financeOfferPrice = price
              break
            case 'tutoring':
              this.tutoringOfferPrice = price
              break
          }
        } else if (baseType == 'graduate') {
          switch (itemType) {
            case 'internship':
              this.internshipGraduatePrice = price
              this.graduateProgram.gpBackgroundPromotionPriceUsd = price
              this.graduateProgram.gpBackgroundPromotionPriceCny = price * this.collect.rate
              break
            case 'oral':
              this.oralGraduatePrice = price
              break
            case 'cfa':
              this.cfaGraduatePrice = price
              break
            case 'finance':
              this.financeGraduatePrice = price
              break
            case 'tutoring':
              this.tutoringGraduatePrice = price
              break
          }
        }
      },
  
      // 是否有礼物
      changeGiftStatus (v) {
        console.log(v)
        if (v == 1) {
          this.$refs.supplementaryCommon.checkList.push('礼品补充协议')
          this.gift.gifts = [{ giftId: null, giftNum: 1 }]
        } else {
          this.giftArrDel('礼品补充协议')
          this.gift.gifts = []
        }
      },
      // 补充协议选择礼品时
      changeGiftSupplementary (v) {
        if (v) {
          this.gift.hasGift = '1'
          this.gift.gifts = [{ giftId: null, giftNum: 1 }]
        } else {
          this.gift.hasGift = '0'
          this.gift.gifts = []
        }
      },
      // 删除数组中的指定内容，用于删除补充协议中的礼品协议
      giftArrDel (text) {
        var index = this.$refs.supplementaryCommon.checkList.findIndex(item => {
          if (item == text) {
            return true
          }
        })
        this.$refs.supplementaryCommon.checkList.splice(index, 1)
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
  
      // 获取折扣
      getDiscountId (val, baseType) {
        switch (baseType) {
          case 'offer':
            this.offerPList.supple.discountId = val
            break
          case 'graduate':
            this.graduatePList.supple.discountId = val
            break
        }
      },
      getDiscountNum (val, baseType) {
        switch (baseType) {
          case 'offer':
            this.offerPList.supple.discountNum = val
            break
          case 'graduate':
            this.graduatePList.supple.discountNum = val
            break
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
        this.signDetailNewVisible = true
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
  
      saveOrderData () {
        // this.$message({
        //   type: "warning",
        //   message: "bate版该功能暂未开放",
        // });
        const data = {
          version: 1,
          menteeId: this.menteeId,
          mentee: this.menteeDetail,
          basic: this.baseProgram,
          gpBasic: this.graduateProgram,
          entrust: this.entrust,
          gift: this.gift,
          invoice: this.invoice,
          collect: this.collect
        }
        this.internshipOfferVisible ? data.opInternship = this.$refs.internshipOffer.info.internshipProgram : ''
        this.oralOfferVisible ? data.opOral = this.$refs.oralOffer.oralProgram : ''
        this.cfaOfferVisible ? data.opCfa = this.$refs.cfaOffer.cfaProgram : ''
        this.financeOfferVisible ? data.opFinance = this.$refs.financeOffer.financeProgram : ''
        this.tutoringOfferVisible ? data.opTutoring = this.$refs.tutoringOffer.tutoringProgram : ''
        this.internshipGraduateVisible ? data.gpInternship = this.$refs.internshipGraduate.info.internshipProgram : ''
        this.oralGraduateVisible ? data.gpOral = this.$refs.oralGraduate.oralProgram : ''
        this.cfaGraduateVisible ? data.gpCfa = this.$refs.cfaGraduate.cfaProgram : ''
        this.financeGraduateVisible ? data.gpFinance = this.$refs.financeGraduate.financeProgram : ''
        this.tutoringGraduateVisible ? data.gpTutoring = this.$refs.tutoringGraduate.tutoringProgram : ''
  
        console.log('setRedis暂存数据', this.menteeId, data)
        apiDic.setRedis(this.menteeId, data).then(() => {
          this.$message({
            type: 'success',
            message: '暂存成功，下次进来将自动填充暂存内容'
          })
        })
      },
  
      /**
       * @description: 日期变换
       * @param {*} obj
       * @param {*} val
       * @return {*}
       */
      async dateChange (obj, val) {
        obj.endDate = await this.getEndDate(
          val,
          obj.periodUnit,
          obj.period
        )
        this.extendedDateChange(obj, obj.endDate)
      },
      async dateChange2 (obj, obj2, val, extra) {
        obj.endDate = await this.getEndDate(
          val,
          obj2.periodUnit,
          obj2.period
        )
        this.extendedDateChange(obj, obj.endDate, extra)
      },
      extendedDateChange (obj, val, extra) {
        obj.extendedEndDate = val
        if (extra == 'extra') {
          this.changeTime()
        }
      },
      GetDateStr (data, AddDayCount) {
        var dd = new Date(data)
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
        console.log('mo', mo)
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
        let day2 = this.offerPList.collect.endDate.replace(/[^\d]/g, '/')
        const extraMonth = this.$refs.supplementaryOffer.supplementary.excessTimeName !== '' ? this.$refs.supplementaryOffer.supplementary.excessTimeName : 0
        if (day2 !== '') {
          day2 = new Date(day2)
          this.offerPList.collect.extendedEndDate = this.getMonthBeforeFormatAndDay(extraMonth, '-', day2.getDate(), day2)
          this.$refs.supplementaryOffer.supplementary.newEndData = this.offerPList.collect.extendedEndDate
        };
      },
      /**
       * @Date: 2020-05-07 15:34:23
       * @Description: 通过开始日期，周期单位，周期值，推算出结束日期
       * @param {type} 开始日期，周期单位，周期值
       * @return: 转换后的end日期
       */
      async getEndDate (val, periodUnit, period) {
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
                    date.setDate(arr[2] * 1)
                  }
                }
              } else {
                const maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
                maxDay.getDate() > arr[2] ? date.setDate(arr[2] * 1) : date.setDate(maxDay.getDate())
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
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  $color: #dcdfe6;
  $margin: top;
  @mixin br5 {
    border-radius: 5px;
  }
  @mixin br22($mar: 20) {
    border-radius: 22px;
    margin-#{$margin}: double($mar) + px;
  }
  .programName {
    @include br5;
    padding: 0px 9px;
    border: 1px $color dashed;
    min-width: 170px;
    height: 26px;
    display: block;
    // @extend %mm;
  }
  .components-model{
    padding:20px 0;
  }
  </style>
  