<!--
 * @Author: 库建华
 * @Date: 2020-07-04 13:35:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-21 14:09:36
 * @Version: 1
 * @Description:
-->
<template>
  <div class="mentee-detail">
    <el-dialog :close-on-click-modal="false" title="合作商一览" :visible.sync="detailVisible" width="1400px" :before-close="close" v-loading="vloading">
      <el-collapse v-model="activeNames">
        <template>
          <el-collapse-item name="99">
            <template slot="title">
              <div class="mentee-detail-title">合作商基本信息</div>
              <el-button
                v-if="roleInfo.includes(`BD_cooperator_edit`)"
                type="primary"
                size="mini"
                plain
                circle
                @click.stop="edit"
              >编辑</el-button>
            </template>
             <el-card v-if="data.cooperatorType == '媒体投放'" shadow="hover">
              <el-row>
                <el-col :span="3" class="mentee-detail-name">合作方名称</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.cooperatorName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作状态</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.cooperatorStatusName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">针对国家/地区</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.countryName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作方电话</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.tel||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作方邮箱</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.email||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">对接人微信ID</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.wxId||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">对接人名称</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.principal||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">对接人职位</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.principalPosition||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">初次对接日期</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.firstDockingDate||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">返佣规则</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.brokerageStatusName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name" v-if="data.brokerageStatus == 'fixed_brokerage'">固定返佣金额</el-col>
                <el-col :span="20" class="mentee-detail-value" v-if="data.brokerageStatus == 'fixed_brokerage'">
                  <pre>{{data.fixedBrokerage||'无'}}($)</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">是否收费</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.chargeStatusName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">本次合作金额</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.salaryType ||''}}{{data.salary ||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">管理人</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.manageByName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号头条平均阅读量</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountAverageReading||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">头条单位阅读量价格(￥)</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.averageReadingPrice||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号次条平均阅读量</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountSecondAverageReading||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">次条单位阅读量价格(￥)</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.secondAverageReadingPrice||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号ID</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountId||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号名称</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountName||'无'}}</pre>
                </el-col>
                 <el-col :span="3" class="mentee-detail-name">公众号类型</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountType||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号粉丝数</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountFansNum||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">已推荐学员</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.recommendMenteeNum||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">返佣金额</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.brokerage||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">详细报价</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.communicateFeedback||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号+人物画像</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.cooperatorIntroduction||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">Code</el-col>
                <el-col :span="20" class="mentee-detail-value" style="display:flex">
                  <pre>{{data.uniqueCode||'无'}}</pre>
                  <el-button @click="changeCode"  v-if="roleInfo.includes(`cooperator_changeCode`)" type="primary" class="ml20" size="mini">修改code</el-button>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">其他</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.other||'无'}}</pre>
                </el-col>
              </el-row>
            </el-card>
            <el-card v-else shadow="hover">
              <el-row>
                <el-col :span="3" class="mentee-detail-name">合作方名称</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.cooperatorName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作状态</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.cooperatorStatusName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作方国家/地区</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.countryName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作方电话</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.tel||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作方邮箱</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.email||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">对接人微信ID</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.wxId||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作对接人名称</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.principal||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作对接人职位</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.principalPosition||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">初次对接日期</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.firstDockingDate||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">返佣规则</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.brokerageStatusName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name" v-if="data.brokerageStatus == 'fixed_brokerage'">固定返佣金额</el-col>
                <el-col :span="20" class="mentee-detail-value" v-if="data.brokerageStatus == 'fixed_brokerage'">
                  <pre>{{data.fixedBrokerage||'无'}}($)</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">是否收费</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.chargeStatusName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">本次合作金额</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.salaryType ||''}}{{data.salary ||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">管理人</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.manageByName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号平均阅读量</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountAverageReading||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">单位阅读量价格(￥)</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.averageReadingPrice||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号ID</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountId||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">公众号名称</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.officialAccountName||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">已推荐学生数量</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.recommendMenteeNum||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">返佣金额</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.brokerage||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">沟通进度反馈</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.communicateFeedback||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">合作方简介</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.cooperatorIntroduction||'无'}}</pre>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">Code</el-col>
                <el-col :span="20" class="mentee-detail-value" style="display:flex">
                  <pre>{{data.uniqueCode||'无'}}</pre>
                  <el-button @click="changeCode" v-if="roleInfo.includes(`cooperator_changeCode`)" type="primary" class="ml20" size="mini">修改code</el-button>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">其他</el-col>
                <el-col :span="20" class="mentee-detail-value">
                  <pre>{{data.other||'无'}}</pre>
                </el-col>
              </el-row>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="true" name="98">
            <template slot="title">
              <div class="mentee-detail-title">合同</div>
              <el-button
                v-if="roleInfo.includes(`BD_cooperator_contract`)"
                type="primary"
                size="mini"
                plain
                circle
                @click.stop="contract"
              >签约/续约</el-button>
            </template>
            <el-card shadow="hover">
              <el-table :data="contractArr" size="mini" highlight-current-row>
                <el-table-column align="center" prop="contractName" label="合同名称" min-width="80"></el-table-column>
                <el-table-column
                  align="center"
                  prop="contractStatusName"
                  label="合同状态"
                  min-width="80"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="contractStartDate"
                  label="开始日期"
                  min-width="80"
                ></el-table-column>
                <el-table-column align="center" prop="contractEndDate" label="结束日期" min-width="80"></el-table-column>
                <el-table-column align="center" prop="contractDuration" label="合同周期"></el-table-column>
                <el-table-column align="center" prop="contractSignDate" label="合同签约日期"></el-table-column>
                <el-table-column align="center" prop="salaryTypeName" label="薪资类型"></el-table-column>
                <el-table-column align="center" prop="salary" label="薪资"></el-table-column>
                <el-table-column
                  align="center"
                  prop="contractIntroduction"
                  label="合同概述"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-popover
                      width="400"
                      trigger="hover"
                      :content="scope.row.contractIntroduction"
                    >
                      <p class="w80" slot="reference">{{scope.row.contractIntroduction}}</p>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="true" name="96">
            <template slot="title">
              <div class="mentee-detail-title" v-if="data.menteeArr">咨询学员列表 （{{data.menteeArr.length || '0'}}个）</div>
              <div class="mentee-detail-title" v-else>咨询学员列表 （0个）</div>
            </template>
            <el-card shadow="hover">
              <el-table :data="menteeArr" size="mini" highlight-current-row>
                <el-table-column align="center" prop="menteeName" label="menteeName" min-width="80"></el-table-column>
                <el-table-column align="center" prop="wxId" label="微信ID"></el-table-column>
                <el-table-column align="center" prop="wxName" label="微信名"></el-table-column>
                <el-table-column align="center" prop="finishYear" label="学生毕业年份"></el-table-column>
                <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90"></el-table-column>
                <el-table-column align="center" prop="signStatusName" label="签约状态" min-width="80"></el-table-column>
                <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
                <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
                <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
                <el-table-column align="center" prop="counselorName" label="顾问姓名"></el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="true" name="97">
            <template slot="title">
              <div class="mentee-detail-title">推文</div>
            </template>
            <el-card shadow="hover">
              <el-table :data="articleArr" size="mini" highlight-current-row>
                <el-table-column
                  align="center"
                  prop="articleTitle"
                  label="推文标题"
                  min-width="80"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="articleIntroduction"
                  label="	推文简介"
                  min-width="80"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="articleUrl"
                  label="推文链接"
                  min-width="80"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="pushDate"
                  label="推送日期"
                  min-width="80"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column align="center" prop="readingNum" label="阅读量" show-overflow-tooltip></el-table-column>
                <el-table-column
                  align="center"
                  prop="consultingNum"
                  label="咨询导流数量"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column align="center" prop="note" label="note" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="voucherPath" label="凭证" width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.voucherPath"
                      @click="download(scope.row.voucherPath)"
                      size="mini"
                    >查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-for="(content,i) in contentArr" :name="i" :key="i">
            <template slot="title">
              <div class="mentee-detail-title">
                合作内容：
                <span :title="content.contentNote">{{content.contentType}}</span>
                (数量：{{content.contentNum}})
                【对应合同：{{content.contractName}}】
              </div>
            </template>
            <el-card shadow="hover">
              <el-table :data="content.contentTypeArr" size="mini" highlight-current-row>
                <el-table-column
                  align="left"
                  prop="followResult"
                  label="follow内容"
                  min-width="880"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="followVoucher" align="center" label="附件" min-width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.followVoucher"
                      @click="download(scope.row.followVoucher)"
                      size="mini"
                    >查看</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="followTime" label="follow时间" min-width="120"></el-table-column>
                <el-table-column
                  align="center"
                  prop="followByName"
                  label="follow人姓名"
                  min-width="120"
                ></el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
        </template>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <!-- <el-button type="primary" @click="cooperationStatus" v-if="data.cooperatorStatus != 'doing_cooperator'">合作状态</el-button> -->
        <el-button
          type="primary"
          @click="payAccount"
          v-if="roleInfo.includes(`BD_cooperator_pay`)"
        >账户</el-button>
        <el-button
          type="primary"
          @click="deleteCooperator"
          v-if="roleInfo.includes(`BD_cooperator_delete`)"
        >删除</el-button>
      </span>
    </el-dialog>
    <edit
      :editVisible="editVisible"
      :cooperatorData="data"
      @close="editClose"
      @submit="editSubmit"
    />
    <editMainlandCommunity
      :editVisible="mainlandCommunityVisible"
      :cooperatorData="data"
      @close="editClose"
      @submit="editSubmit"
    />
    <editOverseasCommunity
      :editVisible="overseasCommunityVisible"
      :cooperatorData="data"
      @close="editClose"
      @submit="editSubmit"
    />
    <editOverseasEducation
      :editVisible="overseasEducationVisible"
      :cooperatorData="data"
      @close="editClose"
      @submit="editSubmit"
    />
    <pay-account
      :payAccountVisible="payAccountVisible"
      :cooperatorId="data.cooperatorId"
      @close="payAccountClose"
      @submit="payAccountSubmit"
    />
    <contract
      :contractVisible="contractVisible"
      :cooperatorData="data"
      @close="contractClose"
      @submit="contractSubmit"
    />
    <cooperationStatus
      :cooperationStatusVisible="cooperationStatusVisible"
      :cooperatorData="data"
      @close="cooperationStatusClose"
      @submit="cooperationStatusSubmit"
    />
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/bd'
import mixins from '@/plugin/mixins'

import edit from './edit.vue'
import editMainlandCommunity from './edit_mainland_community.vue'
import editOverseasCommunity from './edit_overseas_community.vue'
import editOverseasEducation from './edit_overseas_education.vue'
import payAccount from './pay_account.vue'
import contract from './contract_list.vue'
import cooperationStatus from './cooperation_status.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  computed:{
    ...mapState('role', ['roleInfo'])
  },
  components: {
    edit,
    editMainlandCommunity,
    editOverseasCommunity,
    editOverseasEducation,
    payAccount,
    contract,
    cooperationStatus
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    cooperatorId: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      vloading: false,
      data: {},
      contractArr: [],
      menteeArr: [],
      articleArr: [],
      contentArr: [],
      activeNames: ['99', '98', '97', '96', 0, 1, 2, 3, 4, 5, 6, 7],

      editVisible: false,
      overseasEducationVisible: false,
      overseasCommunityVisible: false,
      mainlandCommunityVisible: false,
      payAccountVisible: false,
      cooperationStatusVisible: false,
      contractVisible: false
    }
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      this.vloading = true
      api.getCooperatorDetailById(this.cooperatorId).then(res => {
        console.log('getCooperatorDetailById', res.data)
        this.vloading = false
        this.data = res.data
        this.contractArr = res.data.contractArr
        this.menteeArr = res.data.menteeArr
        this.articleArr = res.data.articleArr
        this.contentArr = res.data.contentArr
      })
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    close () {
      this.$emit('close')
      const obj1 = this.$data
      const obj2 = this.$options.data()
      for (const attrName in obj1) {
        if (attrName !== 'rules') {
          obj1[attrName] = obj2[attrName]
        }
      }
    },
    finish () {
      console.log('finish', this.signId)
      this.$confirm('此操作将结束该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api
            .updatedSignEdit({ signId: this.signId, endFlag: '1' })
            .then(res => {
              console.log('结束项目', res)
              this.$emit('submit')
            })
        })
        .catch(() => {})
    },
    submit () {},
    edit () {
      switch (this.data.cooperatorType) {
        case '大陆社团':
          this.mainlandCommunityVisible = true
          break
        case '海外社团':
          this.overseasCommunityVisible = true
          break
        case '留学机构':
          this.overseasEducationVisible = true
          break
        default:
          this.editVisible = true
      }
    },
    editClose () {
      this.editVisible = false
      this.editChooseVisible = false
      this.mainlandCommunityVisible = false
      this.overseasCommunityVisible = false
      this.overseasEducationVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage(1)
    },
    payAccount () {
      this.payAccountVisible = true
    },
    payAccountClose () {
      this.payAccountVisible = false
    },
    payAccountSubmit () {
      this.payAccountClose()
      this.Topage(1)
    },
    contract () {
      this.contractVisible = true
    },
    contractClose () {
      this.contractVisible = false
    },
    contractSubmit () {
      this.contractClose()
      this.Topage(1)
    },
    deleteCooperator () {
      this.$confirm(`您将删除该合作商【${this.data.cooperatorName}】`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          cooperatorId: this.data.cooperatorId,
          delFlag: 1
        }
        api.uptCooperator(data).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.Topage()
        })
      })
    },
    cooperationStatus () {
      this.cooperationStatusVisible = true
    },
    cooperationStatusClose () {
      this.cooperationStatusVisible = false
    },
    cooperationStatusSubmit () {
      this.cooperationStatusClose()
      this.Topage()
    },
    changeCode () {
      this.$prompt('请输入新的Code', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\w{4,20}$/,
        inputErrorMessage: 'Code格式不正确需4-20位'
      }).then(({ value }) => {
        api.uptCooperatorCode(this.data.cooperatorId, value).then(() => {
          this.$message.success('修改成功')
          this.Topage()
        }).catch(err => {
          this.$message.error(err.message)
        })
        console.log(value)
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mentee-detail-title {
  width: 1200px;
}
.mentee-detail-name {
  color: #000;
  font-weight: 600;
  padding-left: 20px;
}
.mentee-detail-value {
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.w200 {
  width: 340px;
}
.el-loading-mask{ margin:auto !important; z-index: 9999 !important; }
</style>
