<!--
 * @Author: kaan
 * @Date: 2022-01-05 14:05:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-29 11:19:24
 * @Version: 
 * @Description: 
-->
<template>
  <el-dialog 
    title="学员信息录入"
    width="800px"
    :visible.sync="menteeInputVisible"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <el-steps :active="stepsActive" finish-status="success" align-center class="mb10">
      <el-step title="查找学员"></el-step>
      <el-step title="学员信息编辑"></el-step>
    </el-steps>
    <div v-if="stepsActive == 0" v-loading="loading">
      <el-form :rules="rules" ref="searchForm" :model="submitData" :inline="true">
        <el-form-item label="学生或者家长微信ID/微信名" prop="wxId" label-width="220px">
          <el-input
            style="width:180px"
            size="mini"
            clearable
            v-model="submitData.wxId"
            @change="wxIdChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生学校" >
          <el-select
            size="mini"
            v-model="submitData.schoolId"
            style="width:180px"
            filterable
            default-first-option
            clearable
            placeholder="请选择学校">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
          <el-button class="ml10" size="mini" type="primary" @click="getMenteeListByWxId">GO</el-button>
        </el-form-item>
      </el-form>
      <el-card v-if="!menteeList.length" style="text-align:center">
        <el-link v-if="canAddMentee" @click="next">无数据，点击可创建新录入</el-link>
        <span v-else-if="!canAddMentee">请在上方输入微信Id查询...</span>
        <span v-else>无数据</span>
      </el-card>
      <template v-for="(menteeItem,i) in menteeList">
        <div class="box " :key="i" >
          <el-card class="mb20 yxlabelWeight_new2" shadow="never">
            <div class="mb10" style="position:relative">
              <el-button class="mentee_info_card_detail" @click="showMenteeInfo(menteeItem)" size="mini" type="primary">查看详情</el-button>
              <el-descriptions  :column="2" :contentStyle="{flex:1}" size="medium" class="mb10 mentee_info_card">
                <template slot="title">
                  <el-tag size="medium" class="mentee_info_card_tag">学生信息</el-tag>
                </template>
                <el-descriptions-item label="微信ID">{{menteeItem.wxId || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="微信名">{{menteeItem.wxName || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{menteeItem.email || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="学校">{{menteeItem.chiName || '暂无'}}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions  :column="2" :contentStyle="{flex:1}" size="medium" class="mb10 mentee_info_card">
                <template slot="title">
                  <el-tag size="medium" class="mentee_info_card_tag" type="success">家长一信息</el-tag>
                </template>
                <el-descriptions-item label="微信ID">{{menteeItem.parentWx1 || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="微信名">{{menteeItem.parentWxName1 || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="性别">{{menteeItem.parentSexName1 || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="备注">{{menteeItem.parentRemark1 || '暂无'}}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions  :column="2" :contentStyle="{flex:1}" size="medium" class="mb10 mentee_info_card">
                <template slot="title">
                  <el-tag size="medium" class="mentee_info_card_tag" type="success">家长二信息</el-tag>
                </template>
                <el-descriptions-item label="微信ID">{{menteeItem.parentWx2 || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="微信名">{{menteeItem.parentWxName2 || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="性别">{{menteeItem.parentSexName2 || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="备注">{{menteeItem.parentRemark2 || '暂无'}}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions title=" " :column="2" :contentStyle="{flex:1}" size="medium" >
                <el-descriptions-item label="创建人">{{menteeItem.createByName || '暂无'}}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{menteeItem.createTime || '暂无'}}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </div>
      </template>
    </div>
    
    <div v-if="stepsActive == 1">
      <el-form
        :inline="true"
        size="mini"
        :model="menteeDetail"
        :rules="rules2"
        ref="ruleForm"
        label-width="160px"
      >
        <el-form-item label="意向:" prop label-width="190px" class="intention_label">
          <el-checkbox-group v-model="menteeDetail.intention">
            <el-checkbox
              v-for="item in mentee_intention"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
          <div class="mentee_detail_item" shadow="never">
            <el-tag size="medium"  class="mentee_detail_item_tag">学生信息</el-tag>
            <el-form-item label="微信名"  prop="wxName">
              <el-input :style="{width:widths}" sbind v-model="menteeDetail.wxName" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="微信ID"  prop="wxId">
              <el-input :style="{width:widths}" v-model="menteeDetail.wxId" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="性别"  prop="sex">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.sex"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sex"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份"  prop="menteeType">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.menteeType"
                clearable
                filterable
                placeholder="请选择身份"
              >
                <el-option
                  v-for="item in mentee_type"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话" prop>
              <el-input :style="{width:widths}" v-model="menteeDetail.telephone" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="学校（高中）" prop="highSchool">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.highSchool"
                clearable
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
            <el-form-item label="学校（大学）" prop="school">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.school"
                clearable
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
            <el-form-item label="学校（研究生）" prop="graduateSchool">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.graduateSchool"
                clearable
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
            <el-form-item label="邮箱" prop="email">
              <el-input :style="{width:widths}" v-model="menteeDetail.email" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="学历" prop="degree">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.degree"
                clearable
                filterable
                placeholder="请选择学历"
              >
                <el-option
                  v-for="item in degree"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="毕业年份" prop="finishYear">
              <el-date-picker
                :style="{width:widths}"
                v-model="menteeDetail.finishYear"
                :clearable="false"
                :editable="false"
                type="year"
                value-format="yyyy"
                default-value="2020"
                placeholder="选择年份"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="专业" prop="major">
              <el-select
                multiple
                :style="{width:widths}"
                v-model="majorNew"
                clearable
                filterable
                placeholder="请选择专业"
                :multiple-limit="3"
              >
                <el-option
                  v-for="item in major"
                  :key="item.majorId"
                  :label="item.allName"
                  :value="item.majorId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业（研究生）" prop="graduateMajor">
              <el-select
                multiple
                :style="{width:widths}"
                v-model="menteeDetail.graduateMajor"
                clearable
                filterable
                placeholder="请选择专业"
              >
                <el-option
                  v-for="item in major"
                  :key="item.majorId"
                  :label="item.allName"
                  :value="item.majorId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家/地区" prop="country">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.country"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in country"
                  :key="item.itemId"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="当前在职公司" prop="workCompany" v-if="menteeDetail.intention && menteeDetail.intention.includes('EC')">
              <el-input :style="{width:widths}" v-model="menteeDetail.workCompany" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="简历上传" prop="" v-if="menteeDetail.intention && menteeDetail.intention.includes('EC')">
              <div v-for="(item,i) in menteeDetail.resumeArr" class="mb10" :key="i">
                <div style="display:flex" v-if="item.fileName">
                  <div class="mr10" style="width:165px;max-width:190px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" >{{item.fileName}}</div>
                  <el-button type="danger" size="mini"  @click="delResume(item.pkId)">删除</el-button>
                </div>
              </div>
              <el-upload
                :style="{width:widths}"
                action
                :http-request="uploadFileAxios"
                class="upload-btn"
                ref="elupload"
                :file-list="fileList"
              >
                <el-button
                  class="el-icon-upload"
                  slot="trigger"
                  size="mini"
                  type="success"
                  plain
                >选取文件</el-button>
              </el-upload>
            </el-form-item>
          </div>
          <div class="mentee_detail_item" shadow="never">
            <el-tag size="medium"  class="mentee_detail_item_tag" type="success">家长一信息</el-tag>
            <el-form-item label="微信名" prop="parentWxName1">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWxName1" ></el-input>
            </el-form-item>
            <el-form-item label="微信ID" prop="parentWx1">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWx1" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="parentSex1">
              <el-select :style="{width:widths}" v-model="menteeDetail.parentSex1" filterable placeholder="请选择">
                <el-option
                  v-for="item in sex"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="parentRemark1">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentRemark1" ></el-input>
            </el-form-item>
          </div>
          <div class="mentee_detail_item" shadow="never">
            <el-tag size="medium"  class="mentee_detail_item_tag" type="success">家长二信息</el-tag>
            <el-form-item label="微信名" prop="parentWxName2">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWxName2" ></el-input>
            </el-form-item>
            <el-form-item label="微信ID" prop="parentWx2">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWx2" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="parentSex2">
              <el-select :style="{width:widths}" v-model="menteeDetail.parentSex2" filterable placeholder="请选择">
                <el-option
                  v-for="item in sex"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="parentRemark2">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentRemark2" ></el-input>
            </el-form-item>
          </div>
          <div class="mb10 mentee_detail_item" shadow="never"
            v-if="menteeDetail.intention && menteeDetail.intention.includes('IV')"
          >
          <el-tag size="medium"  class="mentee_detail_item_tag" type="info">升学信息</el-tag>
          <el-form-item label="目标大学" prop="schoolTarget">
            <el-select
              :style="{width:widths}"
              v-model="menteeDetail.schoolTarget"
              clearable
              filterable
              multiple
              :multiple-limit="5"
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
          <el-form-item label="目标专业" prop="majorTarget">
            <el-select
              :style="{width:widths}"
              v-model="menteeDetail.majorTarget"
              multiple
              :multiple-limit="5"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in major"
                :key="item.majorId"
                :label="item.allName"
                :value="item.majorId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标地区" prop="regionTarget">
            <el-select
              :style="{width:widths}"
              v-model="menteeDetail.regionTarget"
              multiple
              :multiple-limit="5"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in country"
                :key="item.itemId"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成绩" prop>
            <div class="hot-button" :style="{width:'500px'}" @click="addExamination">添加新成绩</div>
          </el-form-item>
          <div v-for="(item,i) in menteeDetail.examination" :key="i">
            <el-form-item label="类型" prop>
              <el-select
                :style="{width:widths}"
                v-model="item.examination"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in iv_examination"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分数" prop>
              <el-input-number v-model="item.score" :min="0" :controls="false"></el-input-number>
              <span class="hot-button el-icon-delete ml20" @click="delExamination(i)">删除</span>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="咨询方向" prop="consultingDirection">
          <el-select :style="{width:widths}" v-model="menteeDetail.consultingDirection" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in consulting_direction"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="askFor">
          <el-input :style="{width:widths}" v-model="menteeDetail.askFor" :maxlength="99"></el-input>
        </el-form-item>
        <!-- //是否签约 -->
        <el-form-item label="签约状态" prop="signStatus">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.signStatus"
            clearable
            filterable
            disabled
            placeholder="请选择"
          >
            <el-option
              v-for="item in  mentee_sign_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为spy" >
          <el-switch
            :style="{width:widths}"
            v-model="menteeDetail.spyStatus"
            active-text="是"
            inactive-text="否"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="渠道" prop="channelId">
          <el-select :style="{width:widths}" v-model="channelId" filterable placeholder="请选择渠道">
            <el-option
              v-for="item in channelList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="来源" prop="sourceFrom">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.sourceFrom"
            clearable
            filterable
            placeholder="先选择渠道(BD渠道下需要精确搜索)"
            :loading="loading"
            remote
            @change="changeSourceFrom()"
            :remote-method="remote"
          >
            <el-option
              v-for="item in sourceList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-popover
            placement="left"
            width="170"
            v-model="visible">
            <el-form-item label="渠道Code识别" prop="searchCode" label-width="110px">
              <el-input placeholder="请输入Code" :style="{width:'160px'}" v-model="searchCode"  clearable>
                <el-button slot="append" @click="searchCodeFn" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item> 
            <i class="el-icon-guide popover_hover" slot="reference"></i>
          </el-popover>
        </el-form-item>

        <el-form-item label="合作商活动" v-if=" channelId == 'channel-cooperator' && menteeDetail.sourceFrom"  prop="channelId">
          <el-select :style="{width:widths}"  v-model="menteeDetail.activityId"  placeholder="请选择活动">
            <el-option
              v-for="item in activityList"
              :key="item.activityId"
              :label="item.activityName"
              :value="item.activityId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="首次联系日期" prop="firstAskDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="menteeDetail.firstAskDate"
            :clearable="false"
            :editable="false"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="是否分配顾问" prop="counselorStatus">
          <el-select
            :disabled="counselorStatusTo"
            :style="{width:widths}"
            v-model="menteeDetail.counselorStatus"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配部门" prop="counselorGroup" v-if="menteeDetail.counselorStatus == '1'">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.counselorGroup"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in counselorgroup" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配顾问" prop="counselorWx" v-if="menteeDetail.counselorStatus == '1' ">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.counselorWx"
            clearable
            filterable
            placeholder="请选择"
            @change = "counselorChange(0)"
          >
          <!-- 不可激活时不可编辑 -->
            <el-option
              v-for="item in counselor"
              :key="item.accountId"
              :label="item.accountInfo"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分配顾问日期"
          prop="counselorDate"
          v-if="menteeDetail.counselorStatus == '1' "
        >
          <el-date-picker
            :style="{width:widths}"
            v-model="menteeDetail.counselorDate"
            :picker-options="pickerOptions"
            :clearable="false"
            :editable="false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="推荐人姓名" prop="recommender">
          <el-input :style="{width:widths}" v-model="menteeDetail.recommender" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="导流微信号" prop="sourceWx">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.sourceWx"
            clearable
            filterable
            placeholder="请选择导流微信号"
          >
            <el-option
              v-for="item in source_wx"
              :key="item.accountId"
              :label="item.accountName"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊性质(家长/讲座等)" prop="specialNature">
          <el-input :style="{width:widths}" v-model="menteeDetail.specialNature" :maxlength="199"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否VIP同事推荐" prop="vipRecommendStatus">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.vipRecommendStatus"
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
        <el-form-item label="VIP同事推荐人" prop="vipRecommender" v-if="menteeDetail.vipRecommendStatus == 1">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.vipRecommender"
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

        <el-form-item label="帮聊" >
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.helpChat"
            placeholder="请选择帮聊"
          >
            <el-option
              v-for="item in helpChatList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="咨询进度" class="note" prop="note">
          <el-input
            style="width:570px"
            resize="none"
            :rows="3"
            type="textarea"
            v-model="menteeDetail.note"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
      <span slot="footer" class="dialog-footer" v-if="stepsActive == 1">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="validSubmit">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import api from '@/api/assistant.js'
import apiUser from '@/api/user'
import files from '@/libs/file'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'
import apiDic from '@/api/dictionary.js'
export default {
  name: 'MenteeInput',
  mixins: [
    mixins
  ],
  props:{
    menteeInputVisible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    var emailValidate = (rule, value, callback) => {
      if (this.menteeDetail.intention.includes('WST') && this.menteeDetail.counselorStatus == 1 && !value) {
        return callback(new Error('包含"求职"且分配顾问，须录入学校邮箱'));
      }else {
        callback();
      }
    }
    return {
      stepsActive:0,
      canAddMentee:false,
      loading:false,
      submitData:{
        wxId:'',
        schoolId:'',
      },
      schoolList:[],
      rules:{
        wxId:[{ required: true, message: '必填', trigger: 'blur' }]
      },
      menteeList:[],
      chooseMenteeId:"",
      chooseMenteeData:{},

      // 学生信息录入
      widths: "200px",
      menteeDetail:{
        counselorWx:'',
        // vipRecommendStatus:'',
        helpChat:'',
        // vipRecommender:'',
        email:"",
        wxId: '',
        intention: ["WST"],
        counselorStatus:"",
        counselorGroup:"",
        major: [],
        examination: [],
        schoolTarget: [],
        resumeArr:[],
        workCompany:'',
        majorTarget: [],
        regionTarget: [],
        highSchool: null,
        sourceFrom: "",
        signStatus:"0",
        spyStatus:"0"
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      helpChatList:[
        {itemName:'无',itemValue:'no'},
        {itemName:'jerry',itemValue:'jerry'},
        {itemName:'bruce',itemValue:'bruce'},
      ],
      mentee_intention:[],
      sex:[],
      mentee_type:[],
      highSchool:[],
      degree:[],
      major:[],
      country:[],
      iv_examination:[],
      consulting_direction:[],
      mentee_sign_status:[],
      channelList:[],
      channel_sourceList:[],
      sourceList:[],
      activityList:[],
      common_yes_or_no:[],
      counselorgroup:[],
      counselor:[],
      source_wx: [],
      majorNew:[],
      searchCode:"",
      channelId: null,
      counselorStatusTo: false,
      fileList:[],
      visible:false,
      
      rules2: {
        menteeType: [
          { required: true, message: "请选择身份", trigger: "blur" }
        ],
        vipRecommendStatus:[
           { required: true, message: "必填", trigger: "blur" },
        ],
        vipRecommender:[
           { required: true, message: "必填", trigger: "blur" },
        ],
        signStatus: [{ required: true, message: "必填", trigger: "blur" }],
        firstAskDate: [{ required: true, message: "必填", trigger: "blur" }],
        sourceFrom: [{ required: true, message: "必填", trigger: "blur" }],
        sourceWx: [{ required: true, message: "必填", trigger: "blur" }],
        counselorStatus: [{ required: true, message: "必填", trigger: "blur" }],
        counselorGroup: [{ required: true, message: "必填", trigger: "blur" }],
        counselorWx: [{ required: true, message: "必填", trigger: "blur" }],
        counselorWxNew: [{ required: true, message: "必填", trigger: "blur" }],
        workCompany: [{ required: true, message: "必填", trigger: "blur" }],
        email: [
          {type: "email",message: "请输入正确的邮箱地址",trigger: "blur"},
          {validator: emailValidate, trigger: 'blur' }
        ],
        wxName: [{ max: 60, message: "长度为60个字符以内", trigger: "blur" }],
        askFor: [{ max: 60, message: "长度为60个字符以内", trigger: "blur" }],
        consultingDirection: [{ required: true, message: "必填", trigger: "blur" }],
        specialNature: [
          { max: 60, message: "长度为60个字符以内", trigger: "blur" }
        ]
      },
      searchCodeType:true,
    }
  },
  // 根据学校联动国家
  computed: {
    midSchool() {
      return this.menteeDetail.school;
    },
    
  },
  watch: {
    midSchool: function(newD, old) {
      console.log(this.schoolList,'yx***********')
      let len = this.schoolList.length;
      for (let i = 0; i < len; i++) {
        if (this.schoolList[i].schoolId == newD) {
          console.log(this.schoolList[i]);
          this.menteeDetail.country = this.schoolList[i].country;
          if (this.menteeDetail.counselorStatus == "1") {
            this.menteeDetail.counselorGroup = this.school[
              i
            ].undergraduateDivision;
          }
          break;
        }
      }
    },
    menteeInputVisible: function (val) {
      if (val) {
        this.pageInit()
      }
    },
    channelId: function(val) {
      console.log(val);
      if(!this.searchCodeType){return}
      if (val == "channel-cooperator") {
        this.remote(this.menteeDetail.sourceFrom || "");
      } else if (val == "channel-ambassador") {
        this.remote(this.menteeDetail.sourceFrom || "");
      }else if (val == "channel-kol") {
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
  mounted() {
    this.pageInit()
  },
  methods:{
    async pageInit(){
      api.getOfficialAccountList().then(res => {
        console.log("导流微信号", res);
        this.source_wx = res.data.rows;
      }).catch(err => {
        console.log(err);
        alert(err.message + "，请刷新网页");
      });
      this.schoolList = await this.getSchool("school")
      this.highSchool = await this.getSchool("highSchool")
      apiUser.userList({
        pageNum: 1,
        pageSize: 10000,
        entryStatus: '1',
        sortCol: 'userName',
        sort: 'ASC',
        positionType: 'strategist,services'
      }).then((res) => {
        console.log(res, 'vip推荐人列表yx*********')
        this.vipSelect = res.data.rows
      })
      this.mentee_intention = await this.getDictionary("mentee_intention")
      this.sex = await this.getDictionary("sex")
      this.mentee_type = await this.getDictionary("mentee_type")
      this.degree = await this.getDictionary("degree")
      this.major = await this.getMajor()
      this.country = await this.getDictionary("country")
      this.iv_examination = await this.getDictionary("iv_examination")
      this.consulting_direction = await this.getDictionary("track")
      this.mentee_sign_status = await this.getDictionary("mentee_sign_status")
      this.common_yes_or_no = await this.getDictionary("common_yes_or_no")
      this.counselorgroup = await this.getCounselorgroup()
      api.getChannelSource().then(res => {
        console.log("getChannelSource", res.data);
        this.channelList = res.data.channelList;
        this.channel_sourceList = res.data.sourceList;
      });
      api.getCounselor("wst_sales").then(res => {
        console.log(res);
        this.counselor = res.data;
      });
    },
    wxIdChange() {
      this.canAddMentee = false;
    },
    getMenteeListByWxId() {
      this.$refs.searchForm.validate((valid) => {
        if(valid){
          let data = this.submitData.wxId;
          data = data.replace(/(^\s*)|(\s*$)/g, "");
          let obj = {
            search:data,
            schoolId: this.submitData.schoolId
          }
          console.log(obj)
          this.loading=true
          api.getMenteeFamilyListSearch(obj).then(res => {
            this.loading= false
            console.log(res);
            if (toString.call(res.data) !== "[object Array]") {
              this.menteeList = [];
            } else {
              this.menteeList = res.data || [];
            }
            this.canAddMentee = !this.menteeList.length;
            this.chooseMenteeId = null;
            if (this.menteeList.length === 1) {
              this.chooseMenteeId = this.menteeList[0].menteeId;
              this.chooseMenteeData = this.menteeList[0];
            }
          });
        }else{
          return false
        }
      })
    },
    showMenteeInfo(data){
      this.$emit("detail",data)
      this.$emit("close")
    },
    delResume(pkId){
      this.menteeDetail.resumeArr.map(item => {
        if(item.pkId == pkId){
          item.delFlag = 1;
          item.fileName = '';
        }
      })
    },
    addExamination() {
      console.log("添加成绩");
      this.menteeDetail.examination.push({});
    },
    delExamination(i) {
      console.log("删除成绩", i, JSON.stringify(this.menteeDetail.examination));
      this.menteeDetail.examination.splice(i, 1);
    },
    changeSourceFrom(){
      this.menteeDetail.sourceFrom = JSON.parse(JSON.stringify(this.menteeDetail.sourceFrom))
      this.initActivity()
    },
    initActivity(){
      let cooperatorId = '';
      console.log(this.sourceList,this.menteeDetail.sourceFrom)
      this.sourceList.map(item => {
        if(item.itemValue == this.menteeDetail.sourceFrom){
          cooperatorId = item.cooperatorId;
        }
      })
      let data = {
        pageNum:1,
        pageSize:999,
        cooperatorId:cooperatorId
      }
      api.getCooperatorActivityList(data).then(res => {
        this.activityList = res.data.rows;
        console.log(res)
      })
    },
    counselorChange(i){
      if(i==0){
        // old
        this.menteeDetail.counselorDate = util.fmtDate(new Date(), "yyyy-MM-dd")
      }else{
        this.menteeDetail.counselorDateNew = util.fmtDate(new Date(), "yyyy-MM-dd")
      }
    },
    searchCodeFn(){
      console.log(this.searchCode)
      if(this.searchCode){
        this.$loading()
        api.getCodeDetail(this.searchCode).then(res => {
          console.log(res.data)
          this.$loading().close()
          if(res.data && res.data.sourceId){
            this.searchCodeType = false
            this.channelId = res.data.channelId;
            this.menteeDetail.sourceFrom = res.data.sourceId;
            this.sourceList=[{itemName: res.data.sourceName,itemValue: res.data.sourceId}]
            this.visible = false
            this.$nextTick(()=> {
              this.changeSourceFrom()
              this.searchCodeType = true
            })
          }else{
            this.$message.error('未识别到可用渠道来源！！')
          }
        })
      }else{
        this.$message.error('code码必填！！')
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
        if (v) {
          this.getCooperatorSourceByName(v);
        } else {
          this.sourceList = [];
        }
      } else if (this.channelId == "channel-ambassador") {
        if (v) {
          this.getAmbassadorSourceByName(v);
        } else {
          this.sourceList = [];
        }
      } else if (this.channelId == "channel-kol") {
        if (v) {
          this.getKol(v);
        } else {
          this.sourceList = [];
        }
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
        api.getCooperatorSourceByNameFast(v).then(res => {
          toString.call(res.data) == "[object Array]" &&
            (this.sourceList = res.data);
          console.log(this.sourceList);
          this.sourceList.map((item,i) => {
            if(!item.itemName){
              this.sourceList.splice(i,1)
            }
          })
          console.log(this.sourceList);
          if (
            !this.sourceList.some(
              v => v.itemValue == this.menteeDetail.sourceFrom
            )
          ) {
            this.menteeDetail.sourceFrom = "";
          }
          this.initActivity()
          this.loading = false;
        });
      }
    },
    getKol(v){
      if (v.length >= 2) {
        this.loading = true;
        api.getKol(v || this.menteeDetail.sourceName).then(res => {
          console.log(res);
          toString.call(res.data) == "[object Array]" &&
            (this.sourceList = res.data);

          this.sourceList.forEach(item => {
            if(item.itemValue == this.menteeDetail.sourceFrom){
              this.sourceList = [];
              this.sourceList.push(item)
              console.log(this.sourceList)
              this.sourceList = JSON.parse(JSON.stringify(this.sourceList));
              this.menteeDetail.sourceFrom = res.data.sourceId;
            } 
            else{
              this.menteeDetail.sourceFrom = "";
            }
          })
          this.loading = false;
        });
      }
    },
    //已有数据查找
    selectFilter(v) {
      this.sourceList = (this.channel_sourceList && this.channel_sourceList[this.channelId]) && this.channel_sourceList[this.channelId].filter(vv =>
        vv.label && vv.label.include(v)
      );
    },
    uploadFileAxios(file, fileList) {
      this.$loading();
      console.log(file, fileList);
      files.uploadFunBySys(
        file.file,
        `resume/sales_assistant`,
        (url) => {
          this.menteeDetail.resumeArr.push({
            fileName:file.file.name,
            fileUrl:url
          })
          console.log(this.menteeDetail.resumeArr,31232131231231)
          this.fileList = [];
          this.$loading().close();
          this.$refs.elupload.clearFiles();
        }
      );
    },
    validSubmit(){
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.menteeDetail = JSON.parse(JSON.stringify(this.menteeDetail))
        console.log(this.menteeDetail)
        if(this.menteeDetail.counselorStatus == 1){
          if(!this.menteeDetail.country){
            this.$message({
              message: "学员已分配顾问时，国家/地区为必填项",
              type: "error"
            });
            return false;
          }
        }
        if(this.menteeDetail.intention.includes('EC')){
          if(this.menteeDetail.resumeArr.length < 1){
            this.$message.error('当为创业营类型时简历为必填项 ~~')
            return false;
          }
        }
        if(!(this.menteeDetail.wxId || this.menteeDetail.parentWx1 || this.menteeDetail.parentWx2 )){
          this.$message.error('学生或者家长至少输入一个微信ID ~~')
          return false
        }
        if (!this.menteeDetail.intention.length) {
          this.$message({
            message: "意向至少选一个",
            type: "error"
          });
          return;
        }
        let canot = false;
        let examinationArr = [];
        this.menteeDetail.examination.forEach(v => {
          examinationArr.push(v.examination);
          if (!v.score || !v.examination) canot = true;
        });

        if (canot) {
          this.$message({
            message: "成绩及对应分数都必填",
            type: "error"
          });
          return;
        }
        if (new Set(examinationArr).size < examinationArr.length) {
          this.$message({
            message: "成绩类型不可重复",
            type: "error"
          });
          return;
        }
        if (this.menteeDetail.counselorStatus != "1") {
          this.menteeDetail.counselorGroup = "";
          this.menteeDetail.counselorWx = "";
          this.menteeDetail.counselorDate = null;
        }
        this.menteeDetail.major = this.majorNew;
        if(this.canActivateStatus){
          this.menteeDetail.counselorWx = this.menteeDetail.counselorWxNew
          this.menteeDetail.counselorDate = this.menteeDetail.counselorDateNew
        }
        let data2 = JSON.parse(JSON.stringify(this.menteeDetail));
        data2.major = data2.major.join(",");
        data2.graduateMajor = data2.graduateMajor.length > 0?data2.graduateMajor.join(","):'';
        console.log(data2,'yx121231231212132')
        this.$loading()
        api.mentee_info2(data2).then(({ data }) => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.$loading().close();
          this.close()
          this.$emit("success");
        });
      })
    },


    next(){
      this.stepsActive = 1
    },
    clear(){
      Object.assign(this.$data, this.$options.data());
    },
    close(){
      this.clear()
      this.$emit("close")
    }
  }
}
</script>

<style lang="scss" scoped>
.intention_label ::v-deep .el-form-item__label{
  font-weight:1000;
  padding-right:20px;
}
.mentee_info_card{
  position: relative;
  padding-top:20px;
  .mentee_info_card_tag{
    position: absolute;
    top: 0px;
    left: 0;
  }
}
.mentee_info_card_detail{
  position: absolute;
  top: 0;
  right:0;
  z-index:1000;
}
.mentee_detail_item{
  position: relative;
  padding-top:30px;
  margin-bottom:20px;
  border: 1px solid #eee;
  .mentee_detail_item_tag{
    position: absolute;
    top:0;
    left:0;
  }
}
</style>