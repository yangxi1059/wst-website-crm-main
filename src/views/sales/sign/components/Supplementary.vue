<!--
 * @Author: kaan
 * @Date: 2021-06-24 17:05:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-07 10:56:07
 * @Version:
 * @Description:
-->

<template>
<div>
  <div class="create-cant-program-model components-model">
    <div class="program-model-title" >
      {{baseType=='offer'?'求职':''}}{{baseType=='graduate'?'申研':''}}{{baseType=='common'?'订单':''}}补充协议
    </div>
    <el-form
      :inline="true"
      size="mini"
      :model="supplementary"
      :rules="rules"
      ref="supplementary"
      label-width="180px"
      style="padding:0 20px;"
    >
      <el-checkbox-group style="margin-bottom:20px" @change="changeCheckBox()"  v-model="checkList">
        <el-checkbox v-for="(item,i) in supplementary_type"
          :disabled="(internshipNum <= 0 && item.itemName == 'Specify实习') || (discount.discountId !== '' && item.itemName == '折扣') ||
            (cfaType && item.itemName == '赠CFA')"
          :key="i" :label="item.itemName + '补充协议'" ></el-checkbox>
      </el-checkbox-group>
      <div v-for="(item,i) in supplementary_type" :key="i">
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '礼品'">
          <div class="program-model-title">礼品补充协议</div>
          <div class="supplementary-model" >
            <el-form-item label="礼品补充协议"  prop="pkId_gift">
              <el-select
                v-model="supplementary.pkId_gift"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="全部付清日期"  prop="payInFullDateGift">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateGift"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '折扣'">
          <div class="program-model-title">折扣补充协议</div>
          <div class="supplementary-model">
            <el-form-item label="折扣补充协议"  prop="pkId_discount">
              <el-select
                v-model="supplementary.pkId_discount"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="折扣比例" prop="discountRate">
              <el-select @change="changeDiscount()" :style="{width:widthInput}" v-model="supplementary.discountRate" clearable placeholder="请选择">
                <el-option
                  v-for="item in discountRateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="全部付清日期"  prop="payInFullDateDiscount">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateDiscount"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == 'Specify实习'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_specify">
              <el-select
                v-model="supplementary.pkId_specify"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '实习补差价'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_internship_fill">
              <el-select
                v-model="supplementary.pkId_internship_fill"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠Office Hour'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_office_hour">
              <el-select
                v-model="supplementary.pkId_office_hour"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '不可抗力/不能继续提供服务的情况'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_disclaimer">
              <el-select
                v-model="supplementary.pkId_disclaimer"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '关于实习内容的情况'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_job_description">
              <el-select
                v-model="supplementary.pkId_job_description"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实习单位官网："  prop="internshipWebsite">
              <el-input :style="{width:widthInput}" v-model="supplementary.internshipWebsite"   ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '关于形式合同的补充说明'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_formalism">
              <el-select
                v-model="supplementary.pkId_formalism"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="形式合同名称:"  prop="formalismContractName">
              <el-input :style="{width:widthInput}" v-model="supplementary.formalismContractName"   ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '不可实名宣传'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_privacy">
              <el-select
                v-model="supplementary.pkId_privacy"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠LiveLesson'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_live_lesson">
              <el-select
                v-model="supplementary.pkId_live_lesson"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止签约日期"  prop="payInFullDateLive">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateLive"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="赠品价值(美金非礼品)："  prop="excessLivePriceUsd">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.excessLivePriceUsd"  :controls="false" ></el-input-number>
            </el-form-item>
            <el-form-item label="赠送直播课："  prop="excessLiveHour">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.excessLiveHour"  :controls="false" ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠TequilaShot'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_tequila_shot">
              <el-select
                v-model="supplementary.pkId_tequila_shot"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止签约日期"  prop="payInFullDateTequila">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateTequila"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="赠品价值(美金非礼品)："  prop="excessPriceUsd">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.excessPriceUsd"  :controls="false" ></el-input-number>
            </el-form-item>
            <el-form-item label="赠送录播系列课："  prop="excessSeriesHour">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.excessSeriesHour"  :controls="false" ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '分期'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_installment">
              <el-select
                v-model="supplementary.pkId_installment"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首款（美金）"  prop="depositUsd">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.depositUsd"  :controls="false" ></el-input-number>
            </el-form-item>
            <el-form-item :label="'首款（人民币）'">
              <span class="programName" :style="{width:widthSpan}">{{supplementary.depositCny}}</span>
            </el-form-item>
            <el-form-item label="全部付清日期"  prop="payInFullDateInstallment">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateInstallment"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="尾款（美金）"  prop="retainageUsd">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.retainageUsd"  :controls="false" ></el-input-number>
            </el-form-item>
            <el-form-item :label="'尾款（人民币）'">
              <span class="programName" :style="{width:widthSpan}">{{supplementary.retainageCny}}</span>
            </el-form-item>
            <el-form-item label="行业一对一临时课时"  prop="tempMentorHour2">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.tempMentorHour2"  :controls="false" ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠一对一'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_mentor_hour">
              <el-select
                v-model="supplementary.pkId_mentor_hour"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止签约日期"  prop="payInFullDateMentorHour">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateMentorHour"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="一对一额外课时："  prop="excessMentorHour">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.excessMentorHour"  :controls="false" ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠创始团队其中一人 一对一'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_jerry_hour">
              <el-select
                v-model="supplementary.pkId_jerry_hour"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止签约付费日期"  prop="payInFullDateJerryHour">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateJerryHour"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="可替换Jerry一对一课时："  prop="substituteMentorHour">
              <el-input-number :style="{width:widthInput}" v-model="supplementary.substituteMentorHour"  :controls="false" ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠时长 (常规)'">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item :label="'协议模板'"  prop="pkId_program_length">
              <el-select
                v-model="supplementary.pkId_program_length"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止签约日期"  prop="payInFullDateProgramLength">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateProgramLength"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="'延长月数'"  prop="excessTimeName">
              <el-select
                v-model="supplementary.excessTimeName"
                filterable
                placeholder="请选择时长"
                :style="{width:widthInput}"
                @change="changeTime"
              >
                <el-option
                  v-for="item in sign_excess_month"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="create-cant-program-model" v-if="checkList.indexOf(`${item.itemName}补充协议`) > -1 && item.itemName == '赠CFA' && !cfaType">
          <div class="program-model-title">{{item.itemName}}补充协议</div>
          <div class="supplementary-model">
            <el-form-item label="截止签约日期"  prop="payInFullDateGiftCfa">
              <el-date-picker
                :style="{width:widthInput}"
                type="date"
                placeholder="选择日期"
                v-model="supplementary.payInFullDateGiftCfa"
                value-format="yyyy年MM月dd日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="'赠送CFA项目'"  prop="giftCfaProgramId">
              <el-select
                v-model="supplementary.giftCfaProgramId"
                filterable
                placeholder="请选择CFA项目"
                :style="{width:widthInput}"
                @change="changeCFAOption(supplementary.giftCfaProgramId)"
              >
                <el-option
                  v-for="item in cfaList"
                  :key="item.programId"
                  :label="item.programName"
                  :value="item.programId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'赠品价值（美金非礼品）'"  prop="giftCfaPriceUsd">
              <el-input :style="{width:widthInput}" v-model="supplementary.giftCfaPriceUsd" :disabled="true" ></el-input>
            </el-form-item>
            <el-form-item :label="'协议模板'"  prop="pkId_gift_item_cfa">
              <el-select
                v-model="supplementary.pkId_gift_item_cfa"
                filterable
                placeholder="请选择模板"
                :style="{width:widthInput}"
              >
                <el-option
                  v-for="item in item.templateList"
                  :key="item.pkId"
                  :label="item.contractName"
                  :value="item.pkId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

      </div>
    </el-form>
  </div>
  <div class="create-cant-program-model components-model" v-if="baseType!=='common'">
    <div class="program-model-title">折扣活动</div>
    <el-form
      :inline="true"
      size="mini"
      :model="discount"
      ref="discount"
      label-width="180px"
    >
      <el-form-item label="活动列表">
        <el-select v-model="discount.discountId"
          filterable
          clearable
          placeholder="请选择"
          :style="{width:widthInput}"
          :disabled="(checkList.indexOf(`折扣补充协议`) > -1)"
        >
          <el-option
            v-for="item in discountList"
            :key="item.discountId"
            :label="item.discountName"
            :value="item.discountId"
          ></el-option>
        </el-select>
        <span class="discount-remark">*<折扣活动>与<折扣补充协议>只可二选一</span>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import api from '@/api/sales_assistant'
import apiDic from '@/api/dictionary'
import apiAct from '@/api/activity'

export default {
  props: {
    programId: {
      type: String,
      default: ''
    },
    internshipNum: {
      type: Number,
      default: 0
    },
    baseType: {
      type: String,
      default: ''
    },
    rate: {},
    cfaType: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      programData: {},
      widthSpan: '160px',
      widthInput: '190px',
      // 页面显示的协议
      supplementary_type: [],
      // 求职，申研，订单协议
      order_supplementary_type: [],
      gporder_supplementary_type: [],
      common_order_supplementary_type: [],
      discountRateList: [
        { label: '99折', value: '99折' },
        { label: '98折', value: '98折' },
        { label: '97折', value: '97折' },
        { label: '96折', value: '96折' },
        { label: '95折', value: '95折' },
        { label: '9折(特殊客户)', value: '9折' }
      ],
      // 补充协议信息
      supplementary: {
        pkId_gift: '',
        pkId_discount: '',
        pkId_specify: '',
        pkId_internship_fill: '',
        pkId_office_hour: '',
        pkId_disclaimer: '',
        pkId_job_description: '',
        pkId_formalism: '',
        pkId_privacy: '',
        pkId_tequila_shot: '',
        pkId_live_lesson: '',
        pkId_installment: '',
        pkId_mentor_hour: '',
        pkId_jerry_hour: '',
        pkId_program_length: '',
        pkId_gift_item_cfa: '',
        payInFullDateGift: '',
        payInFullDateDiscount: '',
        payInFullDateTequila: '',
        payInFullDateLive: '',
        excessLivePriceUsd: '',
        excessLiveHour: '',
        excessPriceUsd: '',
        excessSeriesHour: '',
        discountRate: '',
        internshipWebsite: '',
        formalismContractName: '',
        payInFullDateInstallment: '',
        depositUsd: 0,
        depositCny: 0,
        retainageUsd: 0,
        retainageCny: 0,
        tempMentorHour2: '',
        payInFullDateMentorHour: '',
        excessMentorHour: '',
        payInFullDateJerryHour: '',
        substituteMentorHour: '',
        payInFullDateProgramLength: '',
        payInFullDateGiftCfa: '',
        cfaList: [],
        giftCfaProgramId: '',
        giftCfaPriceUsd: '',
        giftCfaProgramName: '',
        excessTimeName: '',
        newEndData: '',
        discountNum: 1
      },
      giftCfaProgram: {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        period: '',
        periodUnit: '',
        medalTokens: '',
        note: '',
        startDate: null,
        endDate: null,
        extendedEndDate: null,
        contract: ''
      },
      giftCfaProgramData: {},
      checkList: [],
      supplementaryArr: [],
      // 所有协议对象
      // checkNameList:["礼品补充协议","折扣补充协议","Specify实习补充协议","实习补差价补充协议",
      //                 "不可抗力/不能继续提供服务的情况","关于实习内容的情况补充协议","关于形式合同的补充说明补充协议",
      //                 "不可实名宣传补充协议","赠TequilaShot补充协议"],
      sign_excess_month: [],
      // 折扣
      discountList: [],
      discount: {
        discountId: ''
      },

      rules: {
        pkId_gift: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_discount: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_specify: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_internship_fill: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_office_hour: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_disclaimer: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_job_description: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipWebsite: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_formalism: [{ required: true, message: '必填', trigger: 'blur' }],
        formalismContractName: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_privacy: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_tequila_shot: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_live_lesson: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateGift: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateDiscount: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateTequila: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateJerryHour: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateProgramLength: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_installment: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateInstallment: [{ required: true, message: '必填', trigger: 'blur' }],
        depositUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        retainageUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        tempMentorHour2: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_mentor_hour: [{ required: true, message: '必填', trigger: 'blur' }],
        excessMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_jerry_hour: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateJerryHour: [{ required: true, message: '必填', trigger: 'blur' }],
        substituteMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_program_length: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateProgramLength: [{ required: true, message: '必填', trigger: 'blur' }],
        excessTimeName: [{ required: true, message: '必填', trigger: 'blur' }],
        pkId_gift_item_cfa: [{ required: true, message: '必填', trigger: 'blur' }],
        payInFullDateGiftCfa: [{ required: true, message: '必填', trigger: 'blur' }],
        giftCfaProgramId: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'discount.discountId': function (val) {
      this.$emit('getDiscountId', val, this.baseType)
    },
    'supplementary.discountNum': function (val) {
      this.$emit('getDiscountNum', val, this.baseType)
    },
    'supplementary.retainageUsd': function (val) {
      this.supplementary.retainageCny = parseFloat(val * this.rate).toFixed(1)
    },
    'supplementary.depositUsd': function (val) {
      this.supplementary.depositCny = parseFloat(val * this.rate).toFixed(1)
    },
    rate: function (val) {
      this.supplementary.depositCny = parseFloat(this.supplementary.depositUsd * this.rate).toFixed(1)
      this.supplementary.retainageCny = parseFloat(this.supplementary.retainageUsd * this.rate).toFixed(1)
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    initList () {
      apiDic.getDicDropdown(
        'order_supplementary_type,gporder_supplementary_type,common_order_supplementary_type,sign_excess_month'
      ).then((res) => {
        // this.order_supplementary_type	= res.data.order_supplementary_type;
        // this.gporder_supplementary_type = res.data.gporder_supplementary_type;
        // this.gporder_supplementary_type.forEach((s) => {
        //   api.orderTemplate(s.itemValue).then(res => {
        //     s.templateList = res.data;
        //   })
        // })
        // this.common_order_supplementary_type = res.data.common_order_supplementary_type;
        this.sign_excess_month = res.data.sign_excess_month
        switch (this.baseType) {
          case 'offer':
            this.supplementary_type = res.data.order_supplementary_type
            break
          case 'graduate':
            this.supplementary_type = res.data.gporder_supplementary_type
            break
          case 'common':
            this.supplementary_type = res.data.common_order_supplementary_type
            break
        }
        console.log(this.supplementary_type, 222211133333)
        this.supplementary_type.forEach((s) => {
          api.orderTemplate(s.itemValue).then(res => {
            s.templateList = res.data
          })
        })
      })
      this.getDiscountList()
      this.getCfaList()
    },
    changeDiscount () {
      if (this.supplementary.discountRate == '9折') {
        this.supplementary.discountNum = 0.9
        this.$emit('getPriceOff', true)
      } else if (this.supplementary.discountRate == '95折') {
        this.supplementary.discountNum = 0.95
        this.$emit('getPriceOff', true)
      } else if (this.supplementary.discountRate == '99折') {
        this.supplementary.discountNum = 0.99
        this.$emit('getPriceOff', false)
      } else if (this.supplementary.discountRate == '98折') {
        this.supplementary.discountNum = 0.98
        this.$emit('getPriceOff', false)
      } else if (this.supplementary.discountRate == '97折') {
        this.supplementary.discountNum = 0.97
        this.$emit('getPriceOff', false)
      } else if (this.supplementary.discountRate == '96折') {
        this.supplementary.discountNum = 0.96
        this.$emit('getPriceOff', false)
      } else {
        this.supplementary.discountNum = 1
        this.$emit('getPriceOff', false)
      }
    },
    // 获取折扣活动列表
    getDiscountList () {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        programId: this.programId,
        discountStatus: '进行中',
        activeStatus: '1'
      }
      apiAct.getInfoList(params).then((res) => {
        this.discountList = res.data.rows
      })
    },
    // cfa补充协议下拉选
    getCfaList () {
      const params = {
        pageNum: 1,
        pageSize: 999,
        programType: 'cfa',
        programStatus: 1
      }
      apiDic.getProgramDicList(params).then((res) => {
        console.log('获取cfa列表', res)
        this.cfaList = res.data.rows
      })
    },
    changeCFAOption (id) {
      this.cfaList.forEach((ve) => {
        if (ve.programId == id) {
          console.log(ve)
          this.supplementary.giftCfaPriceUsd = ve.priceUsd
          this.supplementary.giftCfaProgramName = ve.programName
          // let price = this.rate? ve.priceUsd*this.rate :ve.priceCny
          this.giftCfaProgram.programId = id
          this.giftCfaProgram.priceCny = 0
          this.giftCfaProgram.priceUsd = 0
          this.giftCfaProgram.basePriceUsd = ve.priceUsd
          this.giftCfaProgram.basePriceCny = ve.priceCny
          this.giftCfaProgram.period = ve.period
          this.giftCfaProgram.periodUnit = ve.periodUnit
          this.giftCfaProgram.medalTokens = ve.medalTokens
          this.giftCfaProgram.note = ''
        }
      })
    },
    /**
     * @description: 选择补充协议
     * @param {*}
     * @return {*}
     */
    changeCheckBox () {
      console.log(this.checkList, 33333333333)
      if (this.checkList.indexOf('折扣补充协议') > -1) {

      } else if (this.checkList.indexOf('礼品补充协议') > -1) {
        this.$emit('changeGiftSupplementary', true)
      } else if (this.checkList.indexOf('赠CFA') > -1) {
        this.giftCfaProgram.programId = ''
      } else {
        if (this.checkList.indexOf('不可实名宣传补充协议') > -1) {
          console.log(11111)
          this.$emit('changePublicStatus', 0)
        } else {
          console.log(2222)
          this.$emit('changePublicStatus', 1)
        }
        this.$emit('getPriceOff', false)
        this.$emit('changeGiftSupplementary', false)
        this.supplementary.payInFullDateDiscount = ''
        // this.collect.discountInfo = '';
        this.supplementary.discountRate = ''
        this.supplementary.discountNum = 1
        this.supplementary.excessTimeName = ''
        this.changeTime()
      }
    },
    changeTime () {
      this.$emit('changeTime')
    },
    getValid () {
      return new Promise((resolve, reject) => {
        if (!this.$refs.supplementary)resolve()
        this.$refs.supplementary.validate((valid) => {
          this.getData()
          resolve(valid)
        })
      })
    },
    getData () {
      const supplementaryArr = []
      for (let i = 0; i < this.checkList.length; i++) {
        let name, templateList
        this.supplementary_type.forEach(v => {
          console.log(this.checkList[i], `${v.itemName}补充协议`)
          if (this.checkList[i] == `${v.itemName}补充协议`) {
            name = v.itemValue
            templateList = v.templateList
          }
        })
        templateList.forEach(v => {
          if (v.pkId == this.supplementary[`pkId_${name}`]) {
            supplementaryArr.push({ programId: `pkId_${name}`, contract: `${v.supplementaryTypeName}补充协议&&&${v.contractContent}`, contractTitle: v.contractTitle })
          }
        })
      }
      console.log(supplementaryArr)
      this.supplementaryArr = supplementaryArr

      const obj = JSON.parse(JSON.stringify(this.supplementary))
      this.programData = obj
      const obj2 = JSON.parse(JSON.stringify(this.giftCfaProgram))
      this.giftCfaProgramData = obj2
      // switch(this.baseType) {
      //   case 'offer':
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`opsupplementary${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break ;
      //   case 'graduate':
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`gpsupplementary${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break ;
      //   case 'common':
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`supplementary${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break ;
      // }
    },
    programClose () {
      this.$emit('close')
      this.supplementary = {
        pkId_gift: '',
        pkId_discount: '',
        pkId_specify: '',
        pkId_internship_fill: '',
        pkId_office_hour: '',
        pkId_disclaimer: '',
        pkId_job_description: '',
        pkId_formalism: '',
        pkId_privacy: '',
        pkId_tequila_shot: '',
        pkId_live_lesson: '',
        pkId_installment: '',
        pkId_mentor_hour: '',
        pkId_jerry_hour: '',
        pkId_program_length: '',
        pkId_gift_item_cfa: '',
        payInFullDateGift: '',
        payInFullDateDiscount: '',
        payInFullDateTequila: '',
        excessPriceUsd: '',
        excessSeriesHour: '',
        payInFullDateLive: '',
        excessLivePriceUsd: '',
        excessLiveHour: '',
        discountRate: '',
        internshipWebsite: '',
        formalismContractName: '',
        payInFullDateInstallment: '',
        depositUsd: 0,
        depositCny: 0,
        retainageUsd: 0,
        retainageCny: 0,
        tempMentorHour2: '',
        payInFullDateMentorHour: '',
        excessMentorHour: '',
        payInFullDateJerryHour: '',
        substituteMentorHour: '',
        payInFullDateProgramLength: '',
        payInFullDateGiftCfa: '',
        giftCfaProgramId: '',
        giftCfaPriceUsd: '',
        giftCfaProgramName: '',
        excessTimeName: '',
        newEndData: '',
        discountNum: 1
      }
      this.checkList = []
      this.giftCfaProgram = {
        programId: '',
        basePriceUsd: 0,
        priceCny: 0,
        priceUsd: 0,
        period: '',
        periodUnit: '',
        medalTokens: '',
        note: '',
        startDate: null,
        endDate: null,
        extendedEndDate: null,
        contract: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.supplementary-model{
  margin:0 -40px;
}
.components-model-need{
  margin:20px -20px;
}
.discount-remark{
  margin-left:10px;
  color:#E6A23C;
}
.components-model{
  padding:20px 0;
}
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
</style>
