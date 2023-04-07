<!--
 * @Author: 库建华
 * @Date: 2020-04-07 16:33:40
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-26 11:21:49
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="dictionary">
        <div class="search_page">
        <div class="search">
            <el-select
            :style="{width:'500px'}"
            v-model="programIdList"
            class="mr10 mb10"
            filterable
            multiple
            clearable
            size="mini"
            placeholder="请选择项目"
            >
            <el-option-group v-for="group in programDic" :key="group.label" :label="group.label">
                <el-option
                v-for="item in group.options"
                :key="item.programId"
                :label="item.programName"
                :value="item.programId"
                ></el-option>
            </el-option-group>
            </el-select>
            <el-button
            icon="el-icon-search"
            class=""
            v-if="roleInfo.includes(`program_search`)"
            size="mini"
            plain
            @click="Topage(1)"
            >GO</el-button>
            <el-button
            icon="el-icon-plus"
            class=""
            v-if="roleInfo.includes(`program_new`)"
            size="mini"
            plain
            @click="newdic"
            >新增</el-button>
            <el-button
            icon="el-icon-plus"
            class=""
            v-if="roleInfo.includes(`program_common_set`)"
            size="mini"
            plain
            @click="commonSet"
            >公共模板设置</el-button>
            <el-button size="mini" @click="specListShow()">附加规格设置</el-button>
            <el-button size="mini" @click="changeSign()">签约课时金额修改</el-button>
        </div>
        </div>
        <hot-table ref="hotTable" :settings="settings" licenseKey="non-commercial-and-evaluation"></hot-table>
        <el-drawer :close-on-click-modal="false"
          title="项目详情"
          :visible.sync="programDetailVisible"
          size="1200px"
          :before-close="changeClose"
        >
          <div class="drawer_container">
            <el-row class="mb10">
              <el-card class="box-card">
                <el-col :span="4" class="_item-name">项目名：</el-col>
                <el-col :span="4" class="_item-value">
                <span :title="ruleForm.programName">{{ruleForm.programName || '无'}}</span>
                </el-col>
                <el-col :span="4" class="_item-name">项目别名：</el-col>
                <el-col :span="4" class="_item-value">
                <span :title="ruleForm.programAlias">{{ruleForm.programAlias || '无'}}</span>
                </el-col>
                <el-col :span="4" class="_item-name">项目Group：</el-col>
                <el-col :span="4" class="_item-value">
                <span :title="ruleForm.programGroup">{{ruleForm.programGroup||'无'}}</span>
                </el-col>
                <el-col :span="4" class="_item-name">项目Level：</el-col>
                <el-col :span="4" class="_item-value">
                <span :title="ruleForm.programLevel">{{ruleForm.programLevel||'无'}}</span>
                </el-col>
                <el-col :span="4" class="_item-name">项目细分：</el-col>
                <el-col :span="4" class="_item-value">
                <span :title="ruleForm.programSubdivision">{{ruleForm.programSubdivision ||'无'}}</span>
                </el-col>
                <el-col :span="4" class="_item-name">长度：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.period || '无'}} {{ruleForm.periodUnit}}</el-col>
                <el-col :span="4" class="_item-name">价格(USD)：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.priceUsd || '无'}}</el-col>
                <el-col :span="4" class="_item-name">价格(RMB)：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.priceCny || '无'}}</el-col>
                <el-col :span="4" class="_item-name">项目价格类型：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.currencyType.toLocaleUpperCase() || '无'}}</el-col>
                <el-col :span="4" class="_item-name">项目启用状态：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.programStatus == 1 ? '启用' :'禁用'}}</el-col>
              </el-card>
              <el-card style="margin-top:20px">
                <el-col :span="4" class="_item-name">Strategist（旧） ：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.leadStrategistHour == -1 ? '不限' : ruleForm.leadStrategistHour}}</el-col>
                <el-col :span="4" class="_item-name">Jerry一对一：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.jerryHour == -1 ? '不限' : ruleForm.jerryHour}}</el-col>

                <el-col :span="4" class="_item-name">Live Lessons（新）</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.liveLesson == -1 ? '不限' : ruleForm.liveLesson}}</el-col>

                <el-col :span="4" class="_item-name">1对多Office Hour</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.officeHourStrategistSession == -1 ? '不限' : ruleForm.officeHourStrategistSession}} 次/月</el-col>

                <el-col :span="4" class="_item-name">系列课课时数：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.seriesHour == -1 ? '不限' : ruleForm.seriesHour}}</el-col>

                <el-col :span="4" class="_item-name">系列课（英文）：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.hasEnglishSeries || '无'}}</el-col>
                <el-col :span="4" class="_item-name">行业导师一对一（基础）：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.basicMentorHour == -1 ? '不限' : ruleForm.basicMentorHour}}</el-col>
                <el-col :span="4" class="_item-name">行业导师一对一（赠送）：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.freeMentorHour == -1 ? '不限' : ruleForm.freeMentorHour}}</el-col>
                <el-col :span="4" class="_item-name">行业导师一对一（合计）：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.mentorHour == -1 ? '不限' : ruleForm.mentorHour}}</el-col>
                
                <el-col :span="4" class="_item-name">线下小班课：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.seminars == -1 ? '不限' : ruleForm.seminars}}</el-col>
              </el-card>
              <el-card style="margin-top:20px">
                <el-col :span="4" class="_item-name">线下课：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.hasSeminars || '无'}}</el-col>
                <el-col :span="4" class="_item-name">电子书架：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.hasEbookStore || '无'}}</el-col>
                <el-col :span="4" class="_item-name">优先内推：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.priority || '无'}}</el-col>
                <el-col :span="4" class="_item-name">内推中心：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.internalPushCenter || '无'}}</el-col>
                <el-col :span="4" class="_item-name">网申中心：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.netApplicationCenter || '无'}}</el-col>
                <el-col :span="4" class="_item-name">口语课程：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.hasOral || '无'}}</el-col>
              </el-card>
              <el-card style="margin-top:20px">
                <el-col :span="4" class="_item-name">全职导师文书修改次数：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.applicationLetterModify == -1 ? '不限' : ruleForm.applicationLetterModify}}</el-col>
                <el-col :span="4" class="_item-name">行业导师文书修改次数：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.mentorLetterModify == -1 ? '不限' : ruleForm.mentorLetterModify}}</el-col>
                <el-col :span="4" class="_item-name">导师数量：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.mentorCount == -1 ? '不限' : ruleForm.mentorCount}}</el-col>
                <el-col :span="4" class="_item-name">签约分配VIP：</el-col>
                <el-col :span="4" class="_item-value">{{ruleForm.signVip || '无'}}</el-col>
                <!-- <el-col :span="4" class="_item-name">Online线上直播课时数：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.onlineHour == -1 ? '不限' : ruleForm.onlineHour}}</el-col> -->
                <el-col :span="4" class="_item-name">小时数：</el-col>
                <el-col
                :span="4"
                class="_item-value"
                >{{ruleForm.oneOnOneHour == -1 ? '不限' : ruleForm.oneOnOneHour}}</el-col>
              </el-card>
            </el-row>
            <el-row>
              <el-col :span="4" class="_item-name">
              公共合同模板：
              <el-button
                  type="primary"
                  plain
                  size="mini"
                  class="el-icon-edit"
                  circle
                  @click="chooseCommon()"
              ></el-button>
              </el-col>
              <el-col :span="20" class="_item-value">
              <div class="mb10" v-for="(contract, i) in  commonContractList" :key="i">
                  <p class="contract-name">{{contract.contractName}}</p>
                  <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="downContract(contract.contractContent,contract.contractTitle)"
                  >下载</el-button>
                  <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="viewContract(contract.contractContent,contract.contractTitle)"
                  >预览</el-button>
              </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="_item-name">
              定制合同模板：
              <el-button
                  type="primary"
                  plain
                  size="mini"
                  title="新增"
                  class="el-icon-plus"
                  circle
                  @click="addContract()"
              ></el-button>
              </el-col>
              <el-col :span="20" class="_item-value">
              <div class="mb10" v-for="(contract, i) in  contractList" :key="i">
                  <p class="contract-name">{{contract.contractName}}</p>
                  <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="downContract(contract.contractContent,contract.contractTitle)"
                  >下载</el-button>
                  <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="viewContract(contract.contractContent,contract.contractTitle)"
                  >预览</el-button>
                  <el-button type="primary" plain size="mini" @click="editContract(contract)">编辑</el-button>
                  <el-button
                  type="text"
                  size="mini"
                  title="删除"
                  class="el-icon-delete"
                  circle
                  @click="deleteContract(contract)"
                  ></el-button>
              </div>
              </el-col>
            </el-row>
            <div class="drawer_footer">
              <el-button type="primary" @click="dicDelete">删 除</el-button>
              <el-button type="primary" @click="followUp">follow规则</el-button>
              <el-button type="primary" @click="editProgram">编 辑</el-button>
              <el-button type="primary" v-if="roleInfo.includes(`program_copy`)" @click="copy">项目拷贝</el-button>
            </div>
          </div>
        </el-drawer>
        <el-dialog :close-on-click-modal="false" title="项目内容基础项目" :visible.sync="visible" width="1050px" :before-close="clone">
        <el-form
            :model="ruleForm"
            :rules="rules"
            size="medium"
            ref="ruleForm"
            inline
            label-width="240px"
        >
            <el-form-item label="项目ID：" prop="programId">
            <el-input :style="{width:'180px'}" :disabled="true" v-model="ruleForm.programId"></el-input>
            </el-form-item>
            <el-form-item label="项目名：" prop="programName">
            <el-input :style="{width:'180px'}" v-model="ruleForm.programName" maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="项目别名：" prop="programAlias">
            <el-input :style="{width:'180px'}" v-model="ruleForm.programAlias" maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="项目Group：" prop="programGroup">
            <!-- <el-input :style="{width:'180px'}" v-model="ruleForm.programGroup" maxlength="99"></el-input> -->
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.programGroup"
                filterable
                allow-create
                placeholder="请选择(可键入)"
            >
                <el-option
                v-for="item in program_group"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="项目Level：" prop="programLevel">
            <!-- <el-input :style="{width:'180px'}" v-model="ruleForm.programLevel" maxlength="99"></el-input> -->
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.programLevel"
                filterable
                allow-create
                placeholder="请选择(可键入)"
            >
                <el-option
                v-for="item in program_level"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="项目细分：" prop="programSubdivision">
            <!-- <el-input :style="{width:'180px'}" v-model="ruleForm.programSubdivision" maxlength="99"></el-input> -->
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.programSubdivision"
                filterable
                allow-create
                placeholder="请选择(可键入)"
            >
                <el-option
                v-for="item in program_subdivision"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="行业导师一对一（基础）：" prop="basicMentorHour">
            <input-number @go="changeNum1()" v-model="ruleForm.basicMentorHour"></input-number>
            </el-form-item>
            <el-form-item label="行业导师一对一（赠送）：" prop="freeMentorHour">
            <input-number @go="changeNum2()" v-model="ruleForm.freeMentorHour"></input-number>
            </el-form-item>
            <el-form-item label="行业导师一对一（合计）：" prop="mentorHour">
            <input-number :disabled="true" v-model="ruleForm.mentorHour"></input-number>
            </el-form-item>
            
            
            <el-form-item label="全职导师文书修改次数：" prop="applicationLetterModify">
            <input-number v-model="ruleForm.applicationLetterModify"></input-number>
            </el-form-item>
            <el-form-item label="行业导师文书修改次数：" prop="mentorLetterModify">
            <input-number v-model="ruleForm.mentorLetterModify"></input-number>
            </el-form-item>
            <el-form-item label="Strategist Sessions（旧） ：" prop="leadStrategistHour">
            <input-number v-model="ruleForm.leadStrategistHour"></input-number>
            </el-form-item>
            <el-form-item label="Jerry一对一：" prop="jerryHour">
            <input-number v-model="ruleForm.jerryHour"></input-number>
            </el-form-item>
            <div style="display:flex">
            <el-form-item label="Live Lessons（新）：" prop="liveLesson">
                <input-number v-model="ruleForm.liveLesson"></input-number>
            </el-form-item>

            <el-form-item class="te-yangxi_ipt" style="display:flex" label="1对多Office Hour："  prop="officeHourStrategistSession">
                <input-number class="" style="display:flex" v-model="ruleForm.officeHourStrategistSession"></input-number>&nbsp; 次/月
                <!-- <span> </span> -->
            </el-form-item>
            </div>

            <el-form-item label="导师数量：" prop="mentorCount">
            <input-number v-model="ruleForm.mentorCount"></input-number>
            </el-form-item>
            <el-form-item label="签约分配VIP：" prop="signVip">
            <el-select
                v-model="ruleForm.signVip"
                :style="{width:'180px'}"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in [{itemName:'ALL',itemValue:'ALL'},{itemName:'Strategist',itemValue:'Strategist'},{itemName:'Program Manager',itemValue:'Program_Manager'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="系列课课时数：" prop="seriesHour">
            <input-number v-model="ruleForm.seriesHour"></input-number>
            </el-form-item>

            <el-form-item label="系列课（英文）" prop="hasEnglishSeries">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.hasEnglishSeries"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in YrN"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <!-- <el-form-item label="Online线上直播课时数：" prop="onlineHour">
            <input-number v-model="ruleForm.onlineHour"></input-number>
            </el-form-item> -->
            <el-form-item label="线下课：" prop="hasSeminars">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.hasSeminars"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in YrN"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="线下小班课：" prop="seminars">
            <input-number v-model="ruleForm.seminars"></input-number>
            </el-form-item>
            <el-form-item label="电子书架：" prop="hasEbookStore">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.hasEbookStore"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in hasEbookStoreList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="优先内推：" prop="priority">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.priority"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in YrN"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <!-- <el-col :span="4" class="_item-name">内推中心：</el-col>
            <el-col :span="4" class="_item-value">{{ruleForm.internalPushCenter || '无'}}</el-col>
            <el-col :span="4" class="_item-name">网申中心：</el-col>
            <el-col :span="4" class="_item-value">{{ruleForm.netApplicationCenter || '无'}}</el-col>
            <el-col :span="4" class="_item-name">线下课：</el-col>
            <el-col :span="4" class="_item-value">{{ruleForm.hasSeminars || '无'}}</el-col>-->
            <el-form-item label="内推中心：" prop="internalPushCenter">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.internalPushCenter"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in YrN"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="网申中心：" prop="netApplicationCenter">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.netApplicationCenter"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in YrN"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="口语课程：" prop="hasOral">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.hasOral"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in YrN"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="项目周期：" prop="period">
            <el-input :style="{width:'180px'}" v-model="ruleForm.period" maxlength="9"></el-input>
            </el-form-item>
            <el-form-item label="周期单位：" prop="periodUnit">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.periodUnit"
                filterable
                placeholder="请选择"
            >
                <el-option
                v-for="item in [{itemName:'年',itemValue:'year'},{itemName:'月',itemValue:'month'},{itemName:'周',itemValue:'week'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="小时数：" prop="oneOnOneHour">
            <input-number v-model="ruleForm.oneOnOneHour"></input-number>
            </el-form-item>
            <el-form-item label="价格(USD)：" prop="priceUsd">
            <el-input :style="{width:'180px'}" v-model="ruleForm.priceUsd"></el-input>
            </el-form-item>
            <el-form-item label="价格(RMB)：" prop="priceCny">
            <el-input :style="{width:'180px'}" v-model="ruleForm.priceCny"></el-input>
            </el-form-item>
            <el-form-item label="项目价格类型：" prop="currencyType">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.currencyType"
                filterable
                placeholder="请选择价格类型"
            >
                <el-option
                v-for="item in [{itemName:'美金',itemValue:'usd'},{itemName:'人民币',itemValue:'cny'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="是否启用：" prop="programStatus">
            <el-select
                :style="{width:'180px'}"
                v-model="ruleForm.programStatus"
                filterable
                placeholder="请选择是否启用"
            >
                <el-option
                v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="clone">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
        </el-dialog>

        <el-drawer
          title="附加规格列表"
          size="70%"
          :visible.sync="specListShowVisible"
          :before-close="specListClose">
          <div v-loading="loadingSpec" style="padding:0 20px;box-sizing:border-box">
            <div class="mb20">
              <el-select
                class="mr20"
                :style="{width:'120px'}"
                @change="toPage()"
                v-model="specStatus"
                clearable=""
                placeholder="请选择是否启用"
              >
                <el-option
                v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
              </el-select>
              <el-button type="primary" plain size="mini" title="新增" class="el-icon-plus" circle @click="addNew()"></el-button>
            </div>
            <el-table :data="specList" size="mini" highlight-current-row style="width: 100%">
              <el-table-column align="center" label="操作" >
                <template slot-scope="scope">
                  <el-button type="text" @click="editSpec(scope.row)">编辑</el-button>
                  <el-button type="text" @click="deleteSpec(scope.row.specId)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="specName" label="规格名" width="180"></el-table-column>
              <el-table-column align="center" prop="basicMentorHour" label="行业导师一对一（基础）：" >
                <template slot-scope="scope">
                  <span>{{scope.row.basicMentorHour == '-1'?'不限':scope.row.basicMentorHour}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="freeMentorHour" label="行业导师一对一（赠送）：" >
                <template slot-scope="scope">
                  <span>{{scope.row.freeMentorHour == '-1'?'不限':scope.row.freeMentorHour}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="mentorHour" label="行业导师一对一（合计）：" >
                <template slot-scope="scope">
                  <span>{{scope.row.mentorHour == '-1'?'不限':scope.row.mentorHour}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="period" label="项目延长(month)" ></el-table-column>
              <el-table-column align="center" prop="priceUsd" label="价格(USD)" ></el-table-column>
              <el-table-column align="center" prop="priceCny" label="价格(RMB)：" ></el-table-column>
              <el-table-column align="center" prop="specStatus" label="启用状态" >
                <template slot-scope="scope">
                  <span>{{scope.row.specStatus == '0'?'禁用':'启用'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-drawer>
        <commonTemplate
        :commonVisible="commonVisible"
        :programType="`basic`"
        @close="commonClose"
        />
        <commonTemplateChoice
        :commonChoiceVisible="commonChoiceVisible"
        :programId="programId"
        :ruleForm="ruleForm"
        @close="commonChoiceClose"
        @submit="commonChoiceSubmit"
        />
        <followUpRule
        :followUpVisible="followUpVisible"
        :programId="programId"
        @close="followUpRuleClose"
        />
        <addNewEdit
        :contractData="ruleForm"
        :addNewtVisible="addNewtVisible"
        :programId="programId"
        @close="closeNew"
        @submit="setNewSubmit"
        />
        <setContract
        :setContractVisible="setContractVisible"
        :contractData="contractData"
        :ruleForm="ruleForm"
        @close="setContractClose"
        @submit="setContractSubmit"
        />
        <specEdit
        :editSpecVisible="editSpecVisible"
        :SpecDetail="SpecDetail"
        @close="editSpecClose"
        @submit="editSpecSubmit"
        />
        <changeSign
        :changeSignVisible="changeSignVisible"
        @close="changeSignClose"
        @submit="changeSignClose"
        />
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/dictionary'
import files, { downloadFun } from '@/libs/file'
import addNewEdit from './components/addNewEdit.vue'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import inputNumber from '@/components/input_number.vue'
import followUpRule from './components/follow_rule.vue'
import setContract from './components/set_contract.vue'
import commonTemplate from './components/common_template.vue'
import specEdit from './components/specEdit.vue'
import changeSign from './components/changeSign.vue'
import commonTemplateChoice from './components/common_template_choice.vue'

export default {
  components: { inputNumber, followUpRule, setContract, commonTemplate, commonTemplateChoice, addNewEdit, specEdit, changeSign },
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      programIdList: [],
      programDic: [
        {
          label: '启用项目',
          options: [{ programName: '所有', programId: '' }]
        },
        {
          label: '禁用项目',
          options: [{ programName: '所有', programId: '' }]
        }
      ],
      YrN: [
        { itemName: 'Yes', itemValue: 'Yes' },
        { itemName: 'No', itemValue: 'No' }
      ],
      search: '',
      pageNum: 1,
      pageSize: 400,
      total: 0,
      page: 400,
      loading: false,
      settings: {
        licenseKey: 'non-commercial-and-evaluation',
        height: document.documentElement.clientHeight - 220,
        data: [],
        fixedColumnsLeft: 1,
        stretchH: 'all',
        manualColumnResize: true,
        readOnly: true,
        rowHeaders: (index) => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
        ],
        columns: []
      },
      visible: false,
      commonVisible: false,
      commonChoiceVisible: false,
      delVisible: false,
      changeSignVisible: false,
      commonContractList: [],
      contractList: [],
      specList: [],
      delContractList: [],
      ruleForm: {
        programId: null,
        programName: '',
        programAlias: '',
        programGroup: null,
        programLevel: null,
        programSubdivision: null,
        mentorHour: 0,
        freeMentorHour: 0,
        basicMentorHour: 0,
        applicationLetterModify: 0,
        mentorLetterModify: 0,
        leadStrategistHour: 0,
        jerryHour: 0,
        mentorCount: 0,
        signVip: 'ALL',
        seriesHour: 0,
        hasEnglishSeries: null,
        onlineHour: 0,
        seminars: 0,
        priority: null,
        internalPushCenter: null,
        netApplicationCenter: null,
        hasOral: null,
        hasEbookStore: null,
        hasSeminars: null,
        period: null,
        periodUnit: null,
        oneOnOneHour: 0,
        priceUsd: null,
        priceCny: null,
        currencyType: '',
        programStatus: null
      },
      rules: {
        programName: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        programAlias: [
          { required: true, message: '项目别名不能为空', trigger: 'blur' }
        ],
        programGroup: [{ required: true, message: '必填', trigger: 'blur' }],
        programLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        programSubdivision: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        mentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        freeMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        basicMentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        applicationLetterModify: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        mentorLetterModify: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        leadStrategistHour: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        jerryHour: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorCount: [{ required: true, message: '必填', trigger: 'blur' }],
        signVip: [{ required: true, message: '必填', trigger: 'blur' }],
        seriesHour: [{ required: true, message: '必填', trigger: 'blur' }],
        hasEnglishSeries: [{ required: true, message: '必填', trigger: 'blur' }],
        onlineHour: [{ required: true, message: '必填', trigger: 'blur' }],
        seminars: [{ required: true, message: '必填', trigger: 'blur' }],
        priority: [{ required: true, message: '必填', trigger: 'blur' }],
        internalPushCenter: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        netApplicationCenter: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        hasOral: [{ required: true, message: '必填', trigger: 'blur' }],
        hasSeminars: [{ required: true, message: '必填', trigger: 'blur' }],
        hasEbookStore: [{ required: true, message: '必填', trigger: 'blur' }],
        period: [{ required: true, message: '必填', trigger: 'blur' }],
        periodUnit: [{ required: true, message: '必填', trigger: 'blur' }],
        oneOnOneHour: [{ required: true, message: '必填', trigger: 'blur' }],
        priceUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        priceCny: [{ required: true, message: '必填', trigger: 'blur' }],
        currencyType: [{ required: true, message: '必填', trigger: 'blur' }],
        programStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      specStatus: '',
      loadingSpec: false,
      programDetailVisible: false,
      specListShowVisible: false,
      followUpVisible: false,
      setContractVisible: false,
      addNewtVisible: false,
      editSpecVisible: false,
      SpecDetail: {},
      contractData: {},
      editProgramType: null,
      program_type: [],
      program_group: [],
      program_level: [],
      program_subdivision: [],
      programId: '',
      hasEbookStoreList: [
        { itemName: '是', itemValue: 'Yes' },
        { itemName: '否', itemValue: 'No' }
      ]
    }
  },
  created () {},
  mounted () {
    this.initPage()
    this.pageInit()
    window.dicEdit = (row) => this.dicEdit(row)
    window.detailProgram = (row) => this.detailProgram(row)
    window.setCourse = (row) => this.setCourse(row)
    window.dicDelete = (row) => this.dicDelete(row)
  },
  watch: {},
  methods: {
    async pageInit () {
      this.track_type = await this.getDictionary('program_type')
      this.program_level = await this.getDictionary('program_level')
      this.program_group = await this.getDictionary('program_group')
      this.program_subdivision = await this.getDictionary('program_subdivision')
    },
    async initPage () {
      api.getProgramDic('basic').then((res) => {
        this.programDic = [
          {
            label: '启用项目',
            options: res.data.enableProgramArr
          },
          {
            label: '禁用项目',
            options: res.data.disableProgramArr
          }
        ]
        if (!this.programIdList.length) {
          this.programIdList = [res.data.enableProgramArr[0].programId]
        }
        this.Topage()
      })
    },
    Topage () {
      this.settings.data = [{}, {}, {}, {}]
      const len = this.settings.columns.length || 999
      this.settings.columns = []
      for (let i = 0; i < len; i++) {
        this.settings.columns.push({})
      }
      this.loading = true
      const params = { programIds: this.programIdList.join() }
      api.getBasicProgramList(params).then(({ data }) => {
        console.log(data, 'yx获取项目列表*********')
        this.settings.columns = []
        const item = {
          data: 'programId',
          type: 'text',
          width: 200,
          renderer: (hot) => {
            hot.view.wt.update('onCellDblClick', function (row, cell) {
              if (cell.col) {
                console.log(data.programIdArr[cell.col])
                detailProgram(data.programIdArr[cell.col])
              }
            })
          }
        }
        data.programIdArr.forEach((v, index) => {
          item.data = v
          this.settings.columns.push({ ...item })
        })
        this.settings.data = data.dataArr
        console.log(this.settings)
        this.loading = false
      })
    },
    newdic () {
      this.ruleForm.programType = 'basic'
      this.visible = true
    },
    commonSet () {
      this.commonVisible = true
    },
    commonClose () {
      this.commonVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 编辑
    dicEdit (programId) {
      console.log(programId)
      const a = api.getProgramDetailById(programId).then((res) => {
        console.log(res)
        this.ruleForm = res.data
        this.editProgramType = this.ruleForm.programType
      })

      this.loading = true
      const b = api.getContractListByProgramId(programId).then((res) => {
        console.log(res)
        this.contractList = res.data
        this.visible = true
      })
      Promise.all([a, b])
        .then(() => {
          this.loading = false
        })
        .catch((err) => {
          alert('请求出错：' + err)
          this.loading = false
        })
    },
    // 删除
    dicDelete (row) {
      const item = this.ruleForm
      console.log(item, row)
      this.$confirm(
        `此操作将永久删除该条目, 是否继续? （${item.programName}）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const submitData = {
            programId: item.programId,
            delFlag: '1'
          }
          api
            .setProgramDicItem(submitData)
            .then((res) => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.Topage(1)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑-预览
    previewContract (contractContent, contractTitle) {
      if (!contractTitle || !contractContent) {
        this.$message({
          type: 'warning',
          message: '合同标题与正文必填！'
        })
        return
      }
      console.log(this.contract, contractTitle, contractContent)
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.viewContract(contractContent, contractTitle)
      })
    },
    // 详情-预览
    viewContract (contractContent, contractTitle) {
      const submitData = {
        contractContent: contractContent,
        contractTitle: contractTitle,
        programId: this.ruleForm.programId,
        programName: this.ruleForm.programName,
        programAlias: this.ruleForm.programAlias,
        programGroup: this.ruleForm.programGroup,
        programLevel: this.ruleForm.programLevel,
        programSubdivision: this.ruleForm.programSubdivision,
        mentorHour: this.ruleForm.mentorHour,
        freeMentorHour: this.ruleForm.freeMentorHour,
        basicMentorHour: this.ruleForm.basicMentorHour,
        applicationLetterModify: this.ruleForm.applicationLetterModify,
        mentorLetterModify: this.ruleForm.mentorLetterModify,
        leadStrategistHour: this.ruleForm.leadStrategistHour,
        jerryHour: this.ruleForm.jerryHour,
        mentorCount: this.ruleForm.mentorCount,
        signVip: this.ruleForm.signVip,
        liveLesson: this.ruleForm.liveLesson,
        officeHourStrategistSession: this.ruleForm.officeHourStrategistSession,
        seriesHour: this.ruleForm.seriesHour,
        hasEnglishSeries: this.ruleForm.hasEnglishSeries,
        onlineHour: this.ruleForm.onlineHour,
        seminars: this.ruleForm.seminars,
        priority: this.ruleForm.priority,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        hasOral: this.ruleForm.hasOral,
        hasEbookStore: this.ruleForm.hasEbookStore,
        hasSeminars: this.ruleForm.hasSeminars,
        period: this.ruleForm.period,
        periodUnit: this.ruleForm.periodUnit,
        oneOnOneHour: this.ruleForm.oneOnOneHour,
        priceUsd: this.ruleForm.priceUsd,
        priceCny: this.ruleForm.priceCny,
        currencyType: this.ruleForm.currencyType,
        programStatus: this.ruleForm.programStatus
      }
      console.log(submitData)
      api
        .previewContract(submitData)
        .then((res) => {
          console.log(res)
          downloadFun(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    downContract (contractContent, contractTitle) {
      const submitData = {
        contractContent: contractContent,
        contractTitle: contractTitle,
        programId: this.ruleForm.programId,
        programName: this.ruleForm.programName,
        programAlias: this.ruleForm.programAlias,
        programGroup: this.ruleForm.programGroup,
        programLevel: this.ruleForm.programLevel,
        programSubdivision: this.ruleForm.programSubdivision,
        mentorHour: this.ruleForm.mentorHour,
        freeMentorHour: this.ruleForm.freeMentorHour,
        basicMentorHour: this.ruleForm.basicMentorHour,
        applicationLetterModify: this.ruleForm.applicationLetterModify,
        mentorLetterModify: this.ruleForm.mentorLetterModify,
        leadStrategistHour: this.ruleForm.leadStrategistHour,
        jerryHour: this.ruleForm.jerryHour,
        mentorCount: this.ruleForm.mentorCount,
        signVip: this.ruleForm.signVip,
        liveLesson: this.ruleForm.liveLesson,
        officeHourStrategistSession: this.ruleForm.officeHourStrategistSession,
        seriesHour: this.ruleForm.seriesHour,
        hasEnglishSeries: this.ruleForm.hasEnglishSeries,
        onlineHour: this.ruleForm.onlineHour,
        seminars: this.ruleForm.seminars,
        priority: this.ruleForm.priority,
        internalPushCenter: this.ruleForm.internalPushCenter,
        netApplicationCenter: this.ruleForm.netApplicationCenter,
        hasOral: this.ruleForm.hasOral,
        hasEbookStore: this.ruleForm.hasEbookStore,
        hasSeminars: this.ruleForm.hasSeminars,
        period: this.ruleForm.period,
        periodUnit: this.ruleForm.periodUnit,
        oneOnOneHour: this.ruleForm.oneOnOneHour,
        priceUsd: this.ruleForm.priceUsd,
        priceCny: this.ruleForm.priceCny,
        currencyType: this.ruleForm.currencyType,
        programStatus: this.ruleForm.programStatus
      }
      console.log(submitData)
      api
        .downContract(submitData)
        .then((res) => {
          console.log(res)
          files.downloadByOnlineURL(res.data, contractTitle)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 提交
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        const submitData = {
          programId: this.ruleForm.programId,
          programName: this.ruleForm.programName,
          programAlias: this.ruleForm.programAlias,
          programGroup: this.ruleForm.programGroup,
          programLevel: this.ruleForm.programLevel,
          programSubdivision: this.ruleForm.programSubdivision,
          mentorHour: this.ruleForm.mentorHour,
          freeMentorHour: this.ruleForm.freeMentorHour,
          basicMentorHour: this.ruleForm.basicMentorHour,
          applicationLetterModify: this.ruleForm.applicationLetterModify,
          mentorLetterModify: this.ruleForm.mentorLetterModify,
          leadStrategistHour: this.ruleForm.leadStrategistHour,
          jerryHour: this.ruleForm.jerryHour,
          mentorCount: this.ruleForm.mentorCount,
          signVip: this.ruleForm.signVip,
          seriesHour: this.ruleForm.seriesHour,
          hasEnglishSeries: this.ruleForm.hasEnglishSeries,
          onlineHour: this.ruleForm.onlineHour,
          // certificateSubjectLiveCourseAuthority: this.ruleForm
          //   .certificateSubjectLiveCourseAuthority,
          seminars: this.ruleForm.seminars,
          priority: this.ruleForm.priority,
          internalPushCenter: this.ruleForm.internalPushCenter,
          netApplicationCenter: this.ruleForm.netApplicationCenter,
          hasOral: this.ruleForm.hasOral,
          hasSeminars: this.ruleForm.hasSeminars,
          hasEbookStore: this.ruleForm.hasEbookStore,
          period: this.ruleForm.period,
          periodUnit: this.ruleForm.periodUnit,
          oneOnOneHour: this.ruleForm.oneOnOneHour,
          priceUsd: this.ruleForm.priceUsd,
          priceCny: this.ruleForm.priceCny,
          currencyType: this.ruleForm.currencyType,
          programStatus: this.ruleForm.programStatus,
          programType: this.ruleForm.programType,
          liveLesson: this.ruleForm.liveLesson,
          officeHourStrategistSession: this.ruleForm.officeHourStrategistSession
          // contractList: this.contractList.concat(this.delContractList)
        }
        console.log(submitData, 'yx编辑的基本项目信息提交yux***********************')
        api
          .setProgramDicItem(submitData)
          .then((res) => {
            console.log(res, 'yx*******获取项目信息')
            this.clone()
            if (submitData.programId) {
              this.detailProgram(submitData.programId)
            } else {
              this.$message({
                type: 'warning',
                message: '新增基础项目，请设置follow规则，或者联系相关负责人',
                duration: 0,
                showClose: true
              })
            }
            this.initPage()
            // this.Topage(1);
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    clone () {
      this.visible = false
      this.delContractList = []
      this.$refs.ruleForm.resetFields()
    },
    // 删除合同
    deleteContract (v) {
      console.log(v)
      this.$confirm('确认删除该合同嘛？', '提示').then((vv) => {
        if (vv) {
          api.delContract(v.pkId).then((res) => {
            console.log(res)
            this.detailProgram(this.programId)
          })
        }
      })
    },
    deleteSpec (specId) {
      this.$confirm('确认删除该规格？', '提示').then((vv) => {
        if (vv) {
          api.delSpec(specId).then((res) => {
            this.toPage()
          })
        }
      })
    },
    editSpec (data) {
      console.log(data)
      this.editSpecVisible = true
      this.SpecDetail = data
    },
    editSpecClose (data) {
      this.editSpecVisible = false
    },
    editSpecSubmit (data) {
      this.toPage()
      this.editSpecVisible = false
    },
    specListShow () {
      this.specListShowVisible = true
      this.toPage()
    },
    toPage () {
      this.loadingSpec = true
      api.getSpecList(this.specStatus).then(res => {
        console.log(res.data)
        this.loadingSpec = false
        this.specList = res.data
      })
    },
    specListClose () {
      this.specListShowVisible = false
      this.specList = []
      this.specStatus = ''
    },
    changeSign(){
      this.changeSignVisible = true
      console.log('change')
    },
    changeSignClose(){
      this.changeSignVisible = false
    },
    changeClose () {
      this.programDetailVisible = false
      this.ruleForm = {
        programId: null,
        programName: '',
        programAlias: '',
        programGroup: null,
        programLevel: null,
        programSubdivision: null,
        mentorHour: 0,
        freeMentorHour: 0,
        basicMentorHour: 0,
        applicationLetterModify: 0,
        mentorLetterModify: 0,
        leadStrategistHour: 0,
        jerryHour: 0,
        mentorCount: 0,
        signVip: 'ALL',
        seriesHour: 0,
        hasEnglishSeries: 0,
        onlineHour: 0,
        // certificateSubjectLiveCourseAuthority: null,
        seminars: 0,
        priority: null,
        internalPushCenter: null,
        netApplicationCenter: null,
        hasOral: null,
        hasEbookStore: null,
        hasSeminars: null,
        period: null,
        periodUnit: null,
        oneOnOneHour: 0,
        priceUsd: null,
        priceCny: null,
        currencyType: '',
        programStatus: null
      }
      this.contractList = []
    },
    detailProgram (programId) {
      this.programId = programId
      const a = api.getProgramDetailById(programId).then((res) => {
        console.log('获取此项目的项目信息', res)
        this.ruleForm = res.data
        this.editProgramType = this.ruleForm.programType
        this.commonContractList = res.data.commonContractList
      })

      this.loading = true
      const b = api.getProgramContractListById(programId).then((res) => {
        console.log(res, '111111111111111111111')
        this.contractList = res.data
      })
      Promise.all([a, b])
        .then(() => {
          this.programDetailVisible = true
          this.loading = false
        })
        .catch((err) => {
          alert('请求出错：' + err)
          this.loading = false
        })
    },
    editProgram () {
      console.log(this.programId)
      this.dicEdit(this.programId)
    },
    changeSubmit () {
      this.ruleForm.programType = 'basic'
      this.visible = true
      this.changeClose()
    },
    followUp () {
      this.followUpVisible = true
    },
    followUpRuleClose () {
      this.followUpVisible = false
    },
    addContract () {
      this.contractData = { programId: this.programId }
      this.setContractVisible = true
    },
    closeNew () {
      this.addNewtVisible = false
    },
    setNewSubmit () {
      this.toPage()
      this.closeNew()
    },
    addNew () {
      this.addNewtVisible = true
    },
    editContract (contract) {
      console.log(contract)
      this.contractData = { ...contract }
      this.setContractVisible = true
    },
    setContractClose () {
      this.setContractVisible = false
    },
    setContractSubmit () {
      this.detailProgram(this.programId)
      this.setContractClose()
    },
    chooseCommon () {
      this.commonChoiceVisible = true
    },
    commonChoiceSubmit () {
      this.commonChoiceVisible = false
      this.detailProgram(this.programId)
    },
    commonChoiceClose () {
      this.commonChoiceVisible = false
    },
    changeNum1(data){
      console.log(data,this.ruleForm.basicMentorHour,222222222)
      if(this.ruleForm.basicMentorHour != '-1' && this.ruleForm.freeMentorHour != '-1'){
        this.ruleForm.mentorHour = this.ruleForm.basicMentorHour + this.ruleForm.freeMentorHour
      }else{
        this.ruleForm.mentorHour = -1
      }
    },
    changeNum2(data){
      console.log(data,this.ruleForm.freeMentorHour,222222222)
      if(this.ruleForm.basicMentorHour != '-1' && this.ruleForm.freeMentorHour != '-1'){
        this.ruleForm.mentorHour = this.ruleForm.basicMentorHour + this.ruleForm.freeMentorHour
      }else{
        this.ruleForm.mentorHour = -1
      }
    },
    // 项目拷贝
    async copy () {
      console.log(this.ruleForm)
      if (!this.ruleForm.programId) { return }
      const item = this.ruleForm
      this.$confirm(`是否确认拷贝该项目? （${item.programName}）`, '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        api.getProgramCopy(item.programId).then(async (res) => {
          console.log('项目拷贝：', res)
          this.$message({
            type: 'success',
            message: '项目拷贝成功'
          })
          this.changeClose()
          await this.initPage()
          this.programIdList.push(res.data)
          this.Topage()
          this.detailProgram(res.data)
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.contract-name {
  display: inline-block;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.te-yangxi_ipt{
  display: flex;
}
.te-yangxi_ipt .el-form-item__content{
  display: flex;
}
.drawer_container{
  padding:0 20px;
  .drawer_footer{
    padding: 20px;
    padding-top: 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
}
</style>
