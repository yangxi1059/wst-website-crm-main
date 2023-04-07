<!--
 * @Author: kaan
 * @Date: 2022-01-18 18:54:05
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-02 16:46:46
 * @Version:
 * @Description:
-->

<template>
  <div class="inputInformation">
    <el-dialog
      class="info"
      :title="!mentorData.mentorId ? '新增导师' : '编辑导师信息'"
      :visible.sync="mentorEditVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="mentorData"
        :rules="rules"
        ref="mentorData"
        label-width="160px"
      >
        <div class="create-cant-program-model" v-if="editType ==0 || editType ==1 ">
          <div class="program-model-title">基本信息</div>
          <el-form-item label="Alias导师昵称" prop="nickName">
            <el-input :style="{width:widths}" v-model="mentorData.nickName"></el-input>
          </el-form-item>
          <el-form-item label="Full Name 导师姓名" prop="mentorName">
            <el-input v-if="mentorData.mentorId" :style="{width:widths}" v-model="mentorData.mentorName"></el-input>
            <el-autocomplete
              v-else
              :style="{width:widths}"
              v-model="mentorData.mentorName"
              :fetch-suggestions="querySearch"
              placeholder="请输入导师姓名"
              :trigger-on-focus="false"
              @select=""
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="Wechat ID 微信ID" prop="wxId">
            <el-input :style="{width:widths}" v-model="mentorData.wxId"></el-input>
          </el-form-item>
          <el-form-item label="Gender 性别" prop="sex">
            <el-select
              :style="{width:widths}"
              v-model="mentorData.sex"
              filterable
              placeholder="请选择性别"
            >
              <el-option
                v-for="item in sex"
                :key="item.itemName"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input :style="{width:widths}" v-model="mentorData.email"></el-input>
          </el-form-item>
          <el-form-item label="Linkedin 领英" prop="linkedinPath">
            <el-input :style="{width:widths}" v-model="mentorData.linkedinPath"></el-input>
          </el-form-item>
          <el-form-item  prop="undergraduateSchool">
            <span slot="label">School(Undergraduate)<br>学校（本科）</span>
            <el-select
              :style="{width:widths}"
              v-model="mentorData.undergraduateSchool"
              filterable
              clearable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in school"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="graduateSchool">
            <span slot="label">School（Graduate）<br>学校（研究生）</span>
            <el-select
              :style="{width:widths}"
              v-model="mentorData.graduateSchool"
              filterable
              clearable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in school"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phdSchool">
            <span slot="label">School（PhD）<br>学校（博士）</span>
            <el-select
              :style="{width:widths}"
              v-model="mentorData.phdSchool"
              filterable
              clearable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in school"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="本科专业" prop="">
            <el-select
              :style="{width:widths}"
              v-model="mentorData.undergradMajor"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in gp_major"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="研究生专业" prop="">
            <el-select
              :style="{width:widths}"
              v-model="mentorData.masterMajor"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in gp_major"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="PhD专业" prop="">
            <el-select
              :style="{width:widths}"
              v-model="mentorData.phdMajor"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in gp_major"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="PTA" prop="pta">
            <el-input :style="{width:widths}" v-model="mentorData.pta"></el-input>
          </el-form-item>
          <el-form-item label="职务状态" prop="entryStatus">
            <el-select
              :style="{width:widths}"
              v-model="mentorData.entryStatus"
              filterable
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in [{itemName:'Incoming',itemValue:'0'},{itemName:'在职',itemValue:'1'},{itemName:'已离职',itemValue:'2'},]"
                :key="item.itemName"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="companyEntryDate">
            <span slot="label">当下公司入职年份<br>Onboarding Year</span>
            <el-date-picker
              :style="{width:widths}"
              v-model="mentorData.companyEntryDate"
              :editable="false"
              type="year"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="Company（任职）" prop="company">
            <el-cascader
              :style="{width:widths}"
              expand-trigger="hover"
              :options="companyCascaderDic"
              v-model="mentorData.company"
              clearable
              @change="change2()"
              filterable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="Location（任职）" prop="location">
            <el-cascader
              :style="{width:widths}"
              expand-trigger="hover"
              :options="cityCascaderDic"
              v-model="mentorData.location"
              filterable
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="Division（任职）" prop="division">
            <el-cascader
              :style="{width:widths}"
              expand-trigger="hover"
              :options="trackCascaderDic"
              clearable
              v-model="mentorData.division"
              filterable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="添加曾任职公司" prop>
            <el-button type="primary" @click="addCompany">
              <span class="el-icon-circle-plus-outline"></span>
            </el-button>
          </el-form-item>
          <el-card class="mb10" v-if="oldCompany && oldCompany.length">
            <template v-for="(item,i) in oldCompany">
              <el-form-item label="Company（曾任职）:" :key="(i + 'company')">
                <p v-if="item.companyName" :style="{width:widths2}">{{item.companyName || '无'}}</p>
                <el-cascader
                  v-else
                  :style="{width:widths2}"
                  expand-trigger="hover"
                  :options="companyCascaderDic"
                  v-model="item.company"
                  filterable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="Location（曾任职）:" :key="(i + 'location')">
                <p v-if="item.locationName" :style="{width:widths2}">{{item.locationName || '无'}}</p>
                <el-cascader
                  v-else
                  :style="{width:widths2}"
                  expand-trigger="hover"
                  :options="cityCascaderDic"
                  v-model="item.location"
                  filterable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="Division（曾任职）" :key="(i + 'division')">
                <p v-if="item.divisionName" :style="{width:widths2}">{{item.divisionName || '无'}}</p>
                <el-cascader
                  v-else
                  :style="{width:widths2}"
                  expand-trigger="hover"
                  :options="trackCascaderDic"
                  v-model="item.division"
                  filterable
                ></el-cascader>
                <!-- <el-select
                  :style="{width:widths2}"
                  v-model="item.division"
                  filterable
                  allow-create
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in division"
                    :key="item.itemName"
                    :label="item.itemName"
                    :value="item.itemValue"
                  ></el-option>
                </el-select>-->
              </el-form-item>
              <el-button @click="deleteOldCompany(i)" size="mini" :key="(i + 'delete')">
                <span class="el-icon-delete"></span>
              </el-button>
            </template>
          </el-card>
        </div>
        <div class="create-cant-program-model" v-if="editType ==0 || editType ==2 ">
          <div class="program-model-title">业务类型</div>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessCareer" class="mentor_check">求职基础项目</el-checkbox>
          </el-form-item>
          <br>
          <div class="w_100" v-if="businessCareer">
            <el-form-item label="佣金模式" prop="compensationFixed" >
              <el-select
                :style="{width:widths}"
                v-model="mentorData.compensationFixed"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [{itemName:'固定金额',itemValue:'1'},{itemName:'阶梯金额',itemValue:'0'}]"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基本佣金" prop="compensation" v-if="mentorData.compensationFixed == 1">
              <el-input
                :style="{width:widths}"
                v-model="mentorData.compensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.compensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="meritCompensation" v-if="mentorData.compensationFixed == 1">
              <el-input
                :style="{width:widths}"
                v-model="mentorData.meritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.compensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item v-else label="酬金规则" prop="ruleId">
              <el-select
                :style="{width:widths}"
                v-model="mentorData.ruleId"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ruleIdList"
                  :key="item.ruleId"
                  :label="item.ruleName"
                  :value="item.ruleId"
                ></el-option>
              </el-select>
              <el-button type="text" icon="el-icon-info" circle :title="ruleContent" class="info-position"></el-button>
            </el-form-item>
            <el-form-item label="Track（可带专业）" prop >
              <el-cascader
                v-model="mentorData.careerTrack"
                :options="trackCascaderDic"
                :props="props"
                collapse-tags
                clearable></el-cascader>
            </el-form-item>
            <el-form-item label="Country(可带)" prop >
              <el-select
                :style="{width:'550px'}"
                v-model="mentorData.careerCountry"
                filterable
                multiple
                placeholder="请选择国家"
              >
                <el-option
                  v-for="item in country"
                  :key="item.itemId"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Profile 导师介绍" prop="specialties">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.specialties"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessGp" class="mentor_check">升学基础项目</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessGp">
            <el-form-item label="专业" prop="gpMajor">
              <el-select
                :style="{width:widths}"
                v-model="mentorData.gpMajor"
                filterable
                multiple
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gp_major"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基本佣金" prop="gpCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.gpCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.gpCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="gpMeritCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.gpMeritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.gpCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="Country(可带)" prop >
              <el-select
                :style="{width:'550px'}"
                v-model="mentorData.gpCountry"
                filterable
                multiple
                placeholder="请选择国家"
              >
                <el-option
                  v-for="item in country"
                  :key="item.itemId"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <!-- <el-button
                :style="{width:widths,'text-overflow':'ellipsis',overflow:'hidden'}"
                size="mini"
                @click="checkcity"
              >{{city||'无'}}</el-button>-->
            </el-form-item>
            <el-form-item label="Profile 导师介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.gpProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessOral" class="mentor_check">口语</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessOral">
            <el-form-item label="基本佣金" prop="oralCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.oralCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.oralCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="oralMeritCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.oralMeritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.oralCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="Profile 口语介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.oralProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessCfa" class="mentor_check">CFA</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessCfa">
            <el-form-item label="Profile CFA介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.cfaProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessFinance" class="mentor_check">理财</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessFinance">
            <el-form-item label="基本佣金" prop="financeCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.financeCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.financeCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="financeMeritCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.financeMeritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.financeCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="Profile 理财介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.financeProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessTutoring" class="mentor_check">课业辅导项目</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessTutoring">
            <el-form-item label="学科" prop="tutoringSubject">
              <el-cascader
                :style="{width:widths}"
                expand-trigger="hover"
                :options="tutoringSubjectCascaderDic"
                v-model="mentorData.tutoringSubject"
                filterable
                :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="基本佣金" prop="tutoringCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.tutoringCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.tutoringCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="tutoringMeritCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.tutoringMeritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.tutoringCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="Country(可带)" prop >
              <el-select
                :style="{width:'550px'}"
                v-model="mentorData.tutoringCountry"
                filterable
                multiple
                placeholder="请选择国家"
              >
                <el-option
                  v-for="item in country"
                  :key="item.itemId"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <!-- <el-button
                :style="{width:widths,'text-overflow':'ellipsis',overflow:'hidden'}"
                size="mini"
                @click="checkcity"
              >{{city||'无'}}</el-button>-->
            </el-form-item>
            <el-form-item label="Profile 导师介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.tutoringProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessLetterModify" class="mentor_check">文书修改</el-checkbox>
            </el-form-item>
            <div class="w_100" v-if="businessLetterModify">
              <el-form-item label="中文简历" prop="letterModifyCompensationResumeZh">
                <el-input
                  :style="{width:widths}"
                  v-model="mentorData.letterModifyCompensationResumeZh"
                  placeholder="请输入金额"
                >
                  <el-select v-model="mentorData.letterModifyCompensationType" slot="prepend" placeholder="" class="currency-select">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="英文简历" prop="letterModifyCompensationResumeEn" >
                <el-input
                  :style="{width:widths}"
                  v-model="mentorData.letterModifyCompensationResumeEn"
                  placeholder="请输入金额"
                >
                  <el-select v-model="mentorData.letterModifyCompensationType" slot="prepend" placeholder="" class="currency-select">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="Cover Letter" prop="letterModifyCompensationCoverLetter" >
                <el-input
                  :style="{width:widths}"
                  v-model="mentorData.letterModifyCompensationCoverLetter"
                  placeholder="请输入金额"
                >
                  <el-select v-model="mentorData.letterModifyCompensationType" slot="prepend" placeholder="" class="currency-select">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="备注" prop="letterModifyProfile" >
                <el-input :style="{width:widths}" v-model="mentorData.letterModifyProfile" placeholder="备注"></el-input>
              </el-form-item>
            </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessPsychology" class="mentor_check">心理学</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessPsychology">
            <el-form-item label="基本佣金" prop="psychologyCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.psychologyCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.psychologyCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="psychologyMeritCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.psychologyMeritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.psychologyCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="Profile 心理学介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.psychologyProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="" prop="">
            <el-checkbox v-model="businessHumanResource" class="mentor_check">人力资源</el-checkbox>
          </el-form-item>
          <div class="w_100" v-if="businessHumanResource">
            <el-form-item label="基本佣金" prop="humanResourceCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.humanResourceCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.humanResourceCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="绩效佣金" prop="humanResourceMeritCompensation" >
              <el-input
                :style="{width:widths}"
                v-model="mentorData.humanResourceMeritCompensation"
                placeholder="请输入金额"
              >
                <el-select v-model="mentorData.humanResourceCompensationType" slot="prepend" placeholder="" class="currency-select">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="Profile 人力资源介绍" prop="">
              <el-input
                type="textarea"
                :style="{width:'910px'}"
                rows="4"
                v-model="mentorData.humanResourceProfile"
              ></el-input>
            </el-form-item>
          </div>
          <br>
        </div>
         <div class="create-cant-program-model" v-if="editType ==0 || editType ==1 ">
          <div class="program-model-title">WST相关信息</div>

          <el-form-item label="可否内推面试" prop>
            <!-- <el-input :style="{width:widths}" v-model="mentorData.provideInterview"></el-input> -->
            <el-select
              :style="{width:widths}"
              v-model="mentorData.provideInterview"
              filterable
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in [{itemName:'否',itemValue:'0'},{itemName:'是',itemValue:'1'},]"
                :key="item.itemName"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内推成本" prop="provideCost">
            <el-input :style="{width:widths}" v-model="mentorData.provideCost"></el-input>
          </el-form-item>
          <el-form-item label="可推岗位" prop="provideJob">
            <el-input :style="{width:widths}" v-model="mentorData.provideJob"></el-input>
          </el-form-item>

          <el-form-item label="入职WST日期" prop="entryDate">
            <el-date-picker
              :style="{width:widths}"
              v-model="mentorData.entryDate"
              :clearable="false"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="离职WST日期" prop="leaveDate">
            <el-date-picker
              :style="{width:widths}"
              v-model="mentorData.leaveDate"
              :clearable="false"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="导师状态" prop="mentorStatus">
            <el-select
              :style="{width:widths}"
              v-model="mentorData.mentorStatus"
              filterable
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in [{itemName:'禁用',itemValue:'1'},{itemName:'启用',itemValue:'0'},]"
                :key="item.itemName"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="WST公司" prop="wstCompany" v-if="roleInfo.includes(`mentor_edit_wstComapny`)" >
            <el-select
              :style="{width:widths}"
              v-model="mentorData.wstCompany"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in wst_company"
                :key="item.itemName"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面试人" prop="interviewBy"  >
            <el-select
              :style="{width:widths}"
              v-model="mentorData.interviewBy"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in interviewByList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐导师" prop="referrerId"  >
            {{mentorData.referrerName}}
            <el-button type="primary" @click="mentorListVisible = true">
              <span class="el-icon-edit"></span>
            </el-button>
          </el-form-item>
         </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="推荐导师"
      :visible.sync="mentorListVisible"
      width="1000px"
      :before-close="mentorListClose"
    >
      <el-row style="margin-bottom:10px">
        <el-input
          :style="{width:'150px'}"
          v-model="referrerName"
          size="mini"
          clearable
          placeholder="注意名字中间空格"
          @keyup.enter.native="searchMentorByMentorName"
        ></el-input>
        <el-button type="primary" @click="searchMentorByMentorName" size="mini">查询</el-button>
      </el-row>
      <el-row v-for="(mentor,i) in mentorSearchList" :key="mentor.mentorId">
        <el-col :span="2">
          <el-button size="mini" @click="chooseMentor(i)" type="primary">选择</el-button>
        </el-col>
        <el-col :span="2" class="_item-name">姓名</el-col>
        <el-col :span="3" class="_item-value">{{mentor.mentorName}}</el-col>
        <el-col :span="2" class="_item-name">微信ID</el-col>
        <el-col :span="3" class="_item-value">{{mentor.wxId}}</el-col>
        <el-col :span="2" class="_item-name">Track</el-col>
        <el-col :span="4" class="_item-value">{{mentor.trackName}}</el-col>
        <el-col :span="2" class="_item-name">Country</el-col>
        <el-col :span="4" class="_item-value">{{mentor.countryName}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// import llSelect from "./el-select.vue";
import apiUser from '@/api/user.js'

import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  components: { },
  name: 'mentorEdit',
  props: {
    mentorData0: {
      type: Object
    },
    editType: {
      type: Number,
      default: 0
    },
    mentorEditVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 上传文件的文件
      resumeFilt: null,
      contractFilt: null,
      widths: '190px',
      widths2: '170px',
      props: { multiple: true },
      wst_company: [],
      interviewByList: [],
      sex: [],
      school: [],
      country: [],
      currencyList: [
        { label: '$', value: 'usd' },
        { label: '¥', value: 'cny' }
      ],
      referrerName: '',
      mentorSearchList: [],
      mentorListVisible: false,
      rules: {
        compensationFixed: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        interviewBy: [{ required: true, message: '必填', trigger: 'blur' }],
        ruleId: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorName: [{ required: true, message: '必填', trigger: 'blur' }],
        nickName: [{ required: true, message: '必填', trigger: 'blur' }],
        compensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        meritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        gpCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        gpMeritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        tutoringCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        tutoringMeritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        letterModifyCompensationResumeZh: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        letterModifyCompensationResumeEn: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        letterModifyCompensationCoverLetter: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        oralCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        psychologyCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        psychologyMeritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        oralMeritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        humanResourceCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        humanResourceMeritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        financeCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        financeMeritCompensation: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^\d{1,4}$/,
            message: '求检查(⇀‸↼‶)',
            trigger: 'blur'
          }
        ],
        gpMajor: [{ required: true, message: '必填', trigger: 'blur' }],
        tutoringSubject: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      track: '',
      city: '',

      selectVisible: false,
      selectVisibleType: '',
      selectChecked: [],
      selectResource: [],
      trackCascaderDic: [],
      cityCascaderDic: [],
      companyCascaderDic: [],
      tutoringSubjectCascaderDic: [],
      oldCompany: [],
      ruleIdList: [],
      mentorData: {
      },
      // ruleContent:'ruleContent',

      tutoring_subject: [],
      gp_major: []

    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ruleContent: function () {
      let ruleContent = ''
      if (this.mentorData.ruleId) {
        this.ruleIdList.forEach(v => {
          if (v.ruleId === this.mentorData.ruleId) {
            ruleContent = v.ruleContent
          }
        })
      }
      return ruleContent
    },
    businessCareer: {
      get () {
        this.mentorData.businessCareer ? this.mentorData.businessCareer : this.mentorData.businessCareer = 0
        return this.mentorData.businessCareer == 1
      },
      set (val) {
        val ? this.mentorData.businessCareer = '1' : this.mentorData.businessCareer = '0'
      }
    },
    businessGp: {
      get () {
        return this.mentorData.businessGp == 1
      },
      set (val) {
        val ? this.mentorData.businessGp = '1' : this.mentorData.businessGp = '0'
      }
    },
    businessOral: {
      get () {
        return this.mentorData.businessOral == 1
      },
      set (val) {
        val ? this.mentorData.businessOral = '1' : this.mentorData.businessOral = '0'
      }
    },
    businessPsychology: {
      get () {
        return this.mentorData.businessPsychology == 1
      },
      set (val) {
        val ? this.mentorData.businessPsychology = '1' : this.mentorData.businessPsychology = '0'
      }
    },
    businessHumanResource: {
      get () {
        return this.mentorData.businessHumanResource == 1
      },
      set (val) {
        val ? this.mentorData.businessHumanResource = '1' : this.mentorData.businessHumanResource = '0'
      }
    },
    businessCfa: {
      get () {
        return this.mentorData.businessCfa == 1
      },
      set (val) {
        val ? this.mentorData.businessCfa = '1' : this.mentorData.businessCfa = '0'
      }
    },
    businessFinance: {
      get () {
        return this.mentorData.businessFinance == 1
      },
      set (val) {
        val ? this.mentorData.businessFinance = '1' : this.mentorData.businessFinance = '0'
      }
    },
    businessTutoring: {
      get () {
        return this.mentorData.businessTutoring == 1
      },
      set (val) {
        val ? this.mentorData.businessTutoring = '1' : this.mentorData.businessTutoring = '0'
      }
    },
    businessLetterModify: {
      get () {
        return this.mentorData.businessLetterModify == 1
      },
      set (val) {
        val ? this.mentorData.businessLetterModify = '1' : this.mentorData.businessLetterModify = '0'
      }
    }
  },
  watch: {
    mentorEditVisible: function (newData) {
      if (newData) {
        this.mentorData = { ...this.mentorData0 }
        console.log('mentorData', this.mentorData)
        this.track = this.mentorData.careerTrack
          ? this.mentorData.careerTrackName.join()
          : ''
        this.mentorData.company &&
          this.companyCascaderDic.forEach(e => {
            e.children.forEach(v => {
              if (v.value == this.mentorData.company[0]) {
                this.mentorData.company.unshift(e.value)
              }
            })
          })
        this.mentorData.location &&
          this.cityCascaderDic.forEach(e => {
            e.children.forEach(v => {
              if (v.value == this.mentorData.location[0]) {
                this.mentorData.location.unshift(e.value)
              }
            })
          })
        this.mentorData.division &&
          this.trackCascaderDic.forEach(e => {
            e.children.forEach(v => {
              if (v.value == this.mentorData.division[0]) {
                this.mentorData.division.unshift(e.value)
              }
            })
          })
        const tutoringArr = []
        this.mentorData.tutoringSubject && this.mentorData.tutoringSubject.forEach(i => {
          this.tutoringSubjectCascaderDic.forEach(e => {
            e.children.forEach(v => {
              if (v.value == i) {
                tutoringArr.push([e.value, i])
              }
            })
          })
        })
        console.log(this.trackCascaderDic, this.mentorData.careerTrack)
        const arr = []
        this.trackCascaderDic.forEach(item => {
          item.children && item.children.forEach(item2 => {
            arr.push({ label: item.value, value: item2.value })
          })
        })
        const arr2 = []
        this.mentorData.careerTrack && this.mentorData.careerTrack.forEach(item => {
          arr && arr.forEach(item2 => {
            if (item == item2.value) {
              arr2.push([item2.label, item])
            }
          })
        })
        this.mentorData.careerTrack = arr2
        console.log(arr2)
        this.mentorData.tutoringSubject = tutoringArr
        this.getHistoryCompanyListByMentorId()
        this.getPriceRuleList()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      apiUser.userList({
        pageNum: 1,
        pageSize: 10000,
        entryStatus: '1',
        sortCol: 'userName',
        sort: 'ASC',
        positionType: 'strategist,services'
      })
        .then((res) => {
          console.log(res, 22222222222222)
          this.interviewByList = res.data.rows
        })
      apiDic.getCascaderDic('track').then(res => {
        this.trackCascaderDic = res.data
      })
      apiDic.getCascaderDic('city').then(res => {
        this.cityCascaderDic = res.data
      })
      apiDic.getCascaderDic('company').then(res => {
        this.companyCascaderDic = res.data
      })
      apiDic.getCascaderDic('tutoringSubject').then(res => {
        this.tutoringSubjectCascaderDic = res.data
      })
      this.school = await this.getSchool('school')
      this.sex = await this.getDictionary('sex')
      this.wst_company = await this.getDictionary('wst_company')
      this.tutoring_subject = await this.getDictionary('tutoring_subject')
      this.gp_major = await this.getDictionary('gp_major')
      this.country = await this.getDictionary('country')
    },
    getPriceRuleList () {
      api.getPriceRuleList().then(res => {
        this.ruleIdList = res.data
      })
    },
    getHistoryCompanyListByMentorId () {
      console.log('导师历史任职公司参数', this.mentorData.mentorId)
      if (!this.mentorData.mentorId) {
        return
      }
      api
        .getHistoryCompanyListByMentorId(this.mentorData.mentorId)
        .then(res => {
          console.log('导师历史任职公司', res)
          this.oldCompany = []
          res.data.forEach(v => {
            const item = {
              company: [v.company],
              location: [v.location],
              division: [v.division],
              mentorId: this.mentorData.mentorId
            }
            this.companyCascaderDic.forEach(e => {
              e.children.forEach(v => {
                if (v.value == item.company[0]) {
                  item.company.unshift(e.value)
                }
              })
            })
            this.cityCascaderDic.forEach(e => {
              e.children.forEach(v => {
                if (v.value == item.location[0]) {
                  item.location.unshift(e.value)
                }
              })
            })
            this.trackCascaderDic.forEach(e => {
              e.children.forEach(v => {
                if (v.value == item.division[0]) {
                  item.division.unshift(e.value)
                }
              })
            })

            this.oldCompany.push(item)
          })
          console.log('导师历史任职公司', this.oldCompany)
        })
    },
    // 编辑弹框-查看简历
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    change2 () {
      // this.mentorData.company = [];
    },
    callbackfile (val) {
      console.log('callbackfile', val)
      this.resumeFilt = val
    },
    upLoadF (v) {
      console.log('upLoadF', v)
      this.resumeFilt = v
    },
    callbackfile2 (val) {
      console.log('callbackfile2', val)
      this.contractFilt = val
    },
    upLoadF2 (v) {
      console.log('upLoadF2', v)
      this.contractFilt = v
    },
    // 录入信息，关闭
    handleClose () {
      this.$refs.mentorData.resetFields()
      this.oldCompany = []
      this.mentorSearchList = []
      // this.$refs.upload.clearFiles();
      // this.$refs.upload2.clearFiles();
      this.$emit('close')
    },
    // 录入信息，确认
    submit () {
      console.log(this.mentorData, this.oldCompany, this.mentorData.company)
      this.$refs.mentorData.validate(valid => {
        if (!valid) return
        const arr = []
        if (this.mentorData.careerTrack.length > 0) {
          this.mentorData.careerTrack.forEach(item => {
            arr.push(item[1])
          })
        }
        console.log(arr, 'track1111111111111111111')
        const data = {
          company: this.mentorData.company.length > 0
            ? this.mentorData.company[1]
            : '',
          email: this.mentorData.email,
          entryStatus: this.mentorData.entryStatus,
          entryDate: this.mentorData.entryDate,
          leaveDate: this.mentorData.leaveDate,
          undergraduateSchool: this.mentorData.undergraduateSchool,
          undergradMajorList: this.mentorData.undergradMajor,
          masterMajorList: this.mentorData.masterMajor,
          phdMajorList: this.mentorData.phdMajor,
          graduateSchool: this.mentorData.graduateSchool,
          phdSchool: this.mentorData.phdSchool,
          linkedinPath: this.mentorData.linkedinPath,
          location: this.mentorData.location.length > 0
            ? this.mentorData.location[1]
            : '',
          division: this.mentorData.division.length > 0
            ? this.mentorData.division[1]
            : '',
          mentorId: this.mentorData.mentorId,
          mentorName: this.mentorData.mentorName,
          nickName: this.mentorData.nickName,
          mentorStatus: this.mentorData.mentorStatus,
          wstCompany: this.mentorData.wstCompany,
          interviewBy: this.mentorData.interviewBy,
          referrerId: this.mentorData.referrerId,
          provideInterview: this.mentorData.provideInterview,
          provideCost: this.mentorData.provideCost,
          provideJob: this.mentorData.provideJob,
          pta: this.mentorData.pta,
          sex: this.mentorData.sex,
          specialties: this.mentorData.specialties,
          gpProfile: this.mentorData.gpProfile,
          oralProfile: this.mentorData.oralProfile,
          psychologyProfile: this.mentorData.psychologyProfile,
          humanResourceProfile: this.mentorData.humanResourceProfile,
          cfaProfile: this.mentorData.cfaProfile,
          financeProfile: this.mentorData.financeProfile,
          tutoringProfile: this.mentorData.tutoringProfile,
          wxId: this.mentorData.wxId,
          companyEntryDate: this.mentorData.companyEntryDate,
          companyHistoryList: [],
          trackList: arr,
          cityList: this.mentorData.city,
          careerCountryList: this.mentorData.careerCountry,
          gpCountryList: this.mentorData.gpCountry,
          tutoringCountryList: this.mentorData.tutoringCountry,
          compensationFixed: this.mentorData.compensationFixed,
          businessCareer: this.businessCareer ? '1' : '0',
          businessGp: this.businessGp ? '1' : '0',
          businessOral: this.businessOral ? '1' : '0',
          businessPsychology: this.businessPsychology ? '1' : '0',
          businessHumanResource: this.businessHumanResource ? '1' : '0',
          businessCfa: this.businessCfa ? '1' : '0',
          businessFinance: this.businessFinance ? '1' : '0',
          businessTutoring: this.businessTutoring ? '1' : '0',
          businessLetterModify: this.businessLetterModify ? '1' : '0',
          gpMajorList: this.mentorData.gpMajor,
          tutoringSubjectList: this.mentorData.tutoringSubject.map((item, index) => { return item[1] })
        }
        if (this.businessCareer && this.mentorData.compensationFixed == 1) {
          data.compensationType = this.mentorData.compensationType
          const rate1 = Number(this.mentorData.compensation)
          const rate2 = Number(this.mentorData.meritCompensation)
          if (!this.checkCompensation(this.mentorData.compensationType, rate1, rate2)) return
          data.compensation = rate1
          data.meritCompensation = rate2
        } else if (this.businessCareer) {
          data.ruleId = this.mentorData.ruleId
        }
        if (this.businessGp) {
          // 不需要验证佣金大小
          if (this.mentorData.gpCompensationType == undefined) {
            this.$message({
              type: 'error',
              message: '请选择佣金币种'
            })
            return
          }
          const rate1 = Number(this.mentorData.gpCompensation)
          const rate2 = Number(this.mentorData.gpMeritCompensation)
          data.gpCompensationType = this.mentorData.gpCompensationType
          data.gpCompensation = rate1
          data.gpMeritCompensation = rate2
        }
        if (this.businessOral) {
          const rate1 = Number(this.mentorData.oralCompensation)
          const rate2 = Number(this.mentorData.oralMeritCompensation)
          if (!this.checkCompensation(this.mentorData.oralCompensationType, rate1, rate2)) return
          data.oralCompensationType = this.mentorData.oralCompensationType
          data.oralCompensation = rate1
          data.oralMeritCompensation = rate2
        }
        if (this.businessPsychology) {
          const rate1 = Number(this.mentorData.psychologyCompensation)
          const rate2 = Number(this.mentorData.psychologyMeritCompensation)
          if (!this.checkCompensation(this.mentorData.psychologyCompensationType, rate1, rate2)) return
          data.psychologyCompensationType = this.mentorData.psychologyCompensationType
          data.psychologyCompensation = rate1
          data.psychologyMeritCompensation = rate2
        }
        if (this.businessHumanResource) {
          const rate1 = Number(this.mentorData.humanResourceCompensation)
          const rate2 = Number(this.mentorData.humanResourceMeritCompensation)
          if (!this.checkCompensation(this.mentorData.humanResourceCompensationType, rate1, rate2)) return
          data.humanResourceCompensationType = this.mentorData.humanResourceCompensationType
          data.humanResourceCompensation = rate1
          data.humanResourceMeritCompensation = rate2
        }
        if (this.businessCfa) {
          // 暂时只有profile
        }
        if (this.businessFinance) {
          const rate1 = Number(this.mentorData.financeCompensation)
          const rate2 = Number(this.mentorData.financeMeritCompensation)
          if (!this.checkCompensation(this.mentorData.financeCompensationType, rate1, rate2)) return
          data.financeCompensationType = this.mentorData.financeCompensationType
          data.financeCompensation = rate1
          data.financeMeritCompensation = rate2
        }
        if (this.businessTutoring) {
          const rate1 = Number(this.mentorData.tutoringCompensation)
          const rate2 = Number(this.mentorData.tutoringMeritCompensation)
          if (!this.checkCompensation(this.mentorData.tutoringCompensationType, rate1, rate2)) return
          data.tutoringCompensationType = this.mentorData.tutoringCompensationType
          data.tutoringCompensation = rate1
          data.tutoringMeritCompensation = rate2
        }

        if (this.businessLetterModify) {
          const rate1 = Number(this.mentorData.letterModifyCompensationResumeZh)
          const rate2 = Number(this.mentorData.letterModifyCompensationResumeEn)
          const rate3 = Number(this.mentorData.letterModifyCompensationCoverLetter)
          if (!this.checkCompensation(this.mentorData.letterModifyCompensationType, rate1, rate2, rate3)) return
          data.letterModifyCompensationType = this.mentorData.letterModifyCompensationType
          data.letterModifyCompensationResumeZh = rate1
          data.letterModifyCompensationResumeEn = rate2
          data.letterModifyCompensationCoverLetter = rate3
          data.letterModifyProfile = this.mentorData.letterModifyProfile || ''
        }
        let canGo = true
        if (this.oldCompany) {
          this.oldCompany.forEach(v => {
            if (!v.company.length || !v.location.length || !v.division.length) {
              canGo = false
            }
            const item = {
              mentorId: v.mentorId,
              company: v.company[1],
              location: v.location[1],
              division: v.division[1]
            }
            data.companyHistoryList.push(item)
          })
        }
        if (!canGo) {
          this.$message({
            type: 'error',
            message: '"Company（曾任职）" 、 "Location（曾任职）" 、 "Location（曾任职）"都为必传'
          })
          return
        }
        console.log('提交导师信息', data)
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        api.setMentorData(data).then(({ data }) => {
          console.log('提交导师信息', data)
          this.mentorData.mentorId = data
          if (
            (this.resumeFilt === '' || !this.resumeFilt) &&
            (this.contractFilt === '' || !this.contractFilt)
          ) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$loading().close()
            this.handleClose()
            this.$emit('success')
          } else {
            let upEnd = 0
            if (this.resumeFilt) {
              upEnd++
              const mentorId = this.mentorData.mentorId
              uploadFunBySys(this.resumeFilt, `resume/${mentorId}`, url => {
                console.log(url)
                api
                  .setMentorData({
                    mentorId: mentorId,
                    resumePath: url
                  })
                  .then(({ data }) => {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                    this.resumeFilt = null
                    upEnd--
                    if (upEnd == 0) {
                      this.handleClose()
                      this.$loading().close()
                      this.$emit('success')
                    }
                  })
              })
            }
            if (this.contractFilt) {
              upEnd++
              const mentorId = this.mentorData.mentorId
              uploadFunBySys(this.contractFilt, `contract/${mentorId}`, url => {
                api
                  .setMentorData({
                    mentorId: mentorId,
                    contractPath: url
                  })
                  .then(({ data }) => {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                    this.contractFilt = null
                    upEnd--
                    if (upEnd == 0) {
                      this.handleClose()
                      this.$loading().close()
                      this.$emit('success')
                    }
                  })
              })
            }
          }
        })
      })
    },
    addCompany () {
      console.log('添加任职公司')
      this.oldCompany.push({
        mentorId: this.mentorData.mentorId,
        company: [],
        location: [],
        division: []
      })
    },
    selectClose () {
      this.selectVisible = false
    },
    checkcity () {
      console.log('checkcity')
      this.selectVisible = true
      this.selectVisibleType = 'city'
      this.selectChecked = this.mentorData.city
      this.selectResource = this.cityCascaderDic
    },
    deleteOldCompany (i) {
      this.oldCompany.splice(i, 1)
    },
    querySearch (queryString, cb) {
      api.matchName(queryString).then(({ data }) => {
        console.log(data)
        const results = []
        data.forEach(v => {
          results.push({ value: v.mentorName })
        })
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    searchMentorByMentorName () {
      if (!this.referrerName) {
        this.$message({
          type: 'warning',
          message: '别闹~~~'
        })
        return
      }
      api.searchMentorByMentorName({ mentorName: this.referrerName }).then(res => {
        console.log('searchMentorByMentorName', res.data)
        if (!res.data.length) {
          this.$message({
            type: 'warning',
            message: '无该姓名的导师'
          })
          return
        }
        this.mentorSearchList = res.data
      })
    },
    chooseMentor (i) {
      if (
        !this.mentorSearchList[i].country ||
        !this.mentorSearchList[i].countryName ||
        !this.mentorSearchList[i].track ||
        !this.mentorSearchList[i].trackName
      ) {
        this.$message({
          type: 'warning',
          message: '该导师信息不完整（country，track）'
        })
        return
      } else {
        this.mentorData.referrerId = this.mentorSearchList[i].mentorId
        this.mentorData.referrerName = this.mentorSearchList[i].mentorName
      }
      this.mentorListClose()
    },
    // 验证佣金
    checkCompensation (compensationType, compensation, meritCompensation) {
      if (compensationType == undefined) {
        this.$message({
          type: 'error',
          message: '请选择佣金币种'
        })
        return false
      }
      if (
        (compensationType == 'cny' && (compensation > 1400 || meritCompensation > 1400)) ||
        (compensationType == 'usd' && (compensation > 200 || meritCompensation > 200))
      ) {
        this.$message({
          type: 'error',
          message: `超过美金200，或者人民币1400，都是极端值
        ——bruce`
        })
        return false
      } else {
        return true
      }
    },
    mentorListClose () {
      this.mentorListVisible = false
      this.mentorSearchList = []
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
.common {
  padding: 20px;
}

%m {
  display: block;
}
.currency-select ::v-deep .el-input {
    width: 60px;
  }
.mentor_check{
  padding-left:20px;
  padding-right:12px;
  width:160px;
  text-align:left;
  box-sizing: border-box;
  display: inline-block;
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
.program-model-title {
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: #fff;
  padding: 10px;
}
.info-position{
  position:absolute;
  top:0;
  right:-30px;
}
</style>
