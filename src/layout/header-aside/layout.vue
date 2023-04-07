<template>
  <div class="d2-layout-header-aside-group" :style="styleLayoutMainGroup" :class="{grayMode: grayActive}">
    <div class="d">
      <div class="p_item" v-for="item in 2000" :key="item">{{alertName}} - {{$version}}</div>
    </div>
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div class="d2-theme-header" :style="{ opacity: this.searchActive ? 0.5 : 1 }" flex-box="0" flex>
        <router-link
          to="/index"
          :class="{'logo-group': true, 'logo-transition': asideTransition}"
          :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
          flex-box="0">
          <img v-if="asideCollapse" :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`">
          <img v-else class="logo-all" :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`">
        </router-link>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <d2-icon name="bars"/>
        </div>
        <d2-menu-header flex-box="1"/>
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <!-- <d2-header-search @click="handleSearchClick"/> -->
          <!-- <d2-header-log/> -->
          <!-- <d2-header-fullscreen/> -->
          <!-- <d2-header-theme/> -->
          <!-- <d2-header-size/> -->
          <!-- <d2-header-locales/> -->
          <!-- <d2-header-color/> -->
          <el-button style="margin-right:20px;" @click="speechRecognition">语音识别</el-button>
          <span  style="margin-right:20px;color:#89001d;font-size:14px;border-radius:6px;border:1px solid #cfd7e5;background:#fff;height:30px;line-height:30px;width:180px;text-align:center">
            将在<span class="colorR" style="width: 35px; display: inline-block; text-align: center;color:rgb(255, 140, 0);font-size:14px">{{timeLogOut | s_ms}}</span> 后自动登出
          </span>
          <el-badge :value="notRead" style="margin-right:20px" class="item" :type="!notRead ? 'primary' : 'danger' ">
            <el-button @click="viewMessage2"  >消息</el-button>
          </el-badge>
          <d2-header-user/>
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          :class="{'d2-theme-container-aside': true, 'd2-theme-container-transition': asideTransition}"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }">
          <d2-menu-side/>
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <!-- <transition name="fade-scale">
            <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
              <d2-panel-search ref="panelSearch" @close="searchPanelClose"/>
            </div>
          </transition> -->
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="d2-theme-container-main-header" flex-box="0">
                <d2-tabs/>
              </div>
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view :key="routerViewKey" />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <el-drawer
      :visible.sync="speechRecognitionVisible"
      :before-close="speechRecognitionClose"
      size="900px"
    >
      <div style="padding:0 20px;box-sizing: border-box;">
        <div class="search_page" >
          <div class="search">
            <el-button
              icon="el-icon-refresh"
              size="mini"
              plain
              @click="speechRecognitionRefresh"
            ></el-button>
            <el-button
              icon="el-icon-microphone"
              size="mini"
              plain
              @click="speechRecognitionUp"
            ></el-button>
          </div>
          <pagination
            :total="total1"
            :current-page="pageNum1"
            :page-size="pageSize1"
            @handleSizeChange="handleSizeChange1"
            @handleCurrentChange="handleCurrentChange1"
          ></pagination>
        </div>
        <el-table style="width:100%" @row-dblclick="detail" :data="speechRecognitionData" size="mini" border highlight-current-row >
          <el-table-column prop="fileName" label="文件名称" ></el-table-column>
          <el-table-column prop="fileSize" label="文件大小" ></el-table-column>
          <el-table-column prop="createTime" label="上传时间" ></el-table-column>
          <el-table-column prop="taskStatusName" label="任务状态" ></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="msgVisible"
      :direction="'rtl'"
      :show-close="false"
      :before-close="handleClose"
      size="900px"
    >
      <div slot="title" style="display:flex">
        <div>
          <el-select
            v-model="msgFrom"
            class="mr10"
            size="mini"
            clearable
            filterable
            :style="{width:'100px'}"
            @change="viewMessage()"
            placeholder="请选择来源"
          >
            <el-option
              v-for="(item,i) in userList"
              :key="i"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-select
            v-model="isRead"
            class="mr10"
            size="mini"
            clearable
            filterable
            :style="{width:'100px'}"
            placeholder="状态"
            @change="viewMessage()"
          >
            <el-option
              v-for="(item,i) in statusList"
              :key="i"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            v-model="msgTitle"
            class="mr10"
            size="mini"
            clearable
            filterable
            :style="{width:'100px'}"
            placeholder="消息标题"
            @change="viewMessage()"
          >
            <el-option
              v-for="(item,i) in msgTitleList"
              :key="i"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-button size="mini" @click="seeAll" v-if="isRead === '0'">一键全读</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <div class="msg-box">
        <div v-for="(v,index) in msgList" @click="sure(v)" :key="index">
          <el-badge is-dot v-if="v.isRead == 0" class="dot"></el-badge>
          <el-card shadow="hover" class="mb10 ml10 mr10">
            <span class="bigText">{{v.msgTitle}}</span>
            <span>：{{v.msgContent}}</span>
            <span v-show="v.keyType" class="colorG">快捷入口</span>
            <span style="float:right;color:#808080" >{{v.createTime}}</span>
          </el-card>
        </div>
        <div v-if="!msgList.length">
          <el-card shadow="hover" class="mb10 ml10 mr10">无相关信息</el-card>
        </div>
      </div>
    </el-drawer>
     <applyAudit :recommendVisible="applyVisible" :applyData="applyData" @close="applyClose" />
    <sign-refund
      :signRefundVisible="signRefundVisible"
      :applyData="applyData"
      @close="signRefundClose"
    ></sign-refund>
    <offer-audit :offerVisible="offerVisible" :applyData="applyData" @close="offerClose" />
    <orderEntryAudit
      :orderEntryAuditVisible="orderEntryAuditVisible"
      :applyData="applyData"
      @close="orderEntryClose"
    />
    <pay-record-detail
      :payRecordDetailVisible="payRecordDetailVisible"
      :applyData="applyData"
      @close="payRecordDetailClose"
    />
    <mentor-pay-approve
      :mentorPayApproveVisible="mentorPayApproveVisible"
      :applyData="applyData"
      @close="mentorPayApproveClose"
    ></mentor-pay-approve>
    <bdExpenditure
      :recommendVisible="bdExpenditureVisible"
      :applyData="applyData"
      @close="bdExpenditureClose"
    />
    <contractFund
      :recommendVisible="contractFundVisible"
      :applyData="applyData"
      @close="contractFundClose"
    />
    <ambassadorSalary
      :recommendVisible="ambassadorSalaryVisible"
      :applyData="applyData"
      @close="ambassadorSalaryClose"
    />
    <mentorPaymentExtra
      :mentorPaymentExtraVisible="mentorPaymentExtraVisible"
      :applyData="applyData"
      @close="mentorPaymentExtraClose"
    />
    <academicMentorBonus
      :academicMentorBonusVisible="academicMentorBonusVisible"
      :applyData="applyData"
      @close="academicMentorBonusClose"
    />
    <internshipPay
      :internshipPayVisible="internshipPayVisible"
      :applyData="applyData"
      @close="internshipPayClose"
      @submit="internshipPayClose"
    />
     <menteeFile
      :menteeFileVisible="menteeFileVisible"
      :applyData="applyData"
      @close="menteeFileClose"
    />
     <cooperatorContractInfo
      :recommendVisible="cooperatorContractInfoVisible"
      :applyData="applyData"
      @close="cooperatorContractInfoClose"
    />

    <oneTooneAudit
      :oneTononeAuditVisible="oneTononeAuditVisible"
      :applyData="applyData"
      @close="oneTononeAuditClose"
    />
    <orderSupplementaryAudit
      :orderSupplementaryAuditVisible="orderSupplementaryAuditVisible"
      :applyData="applyData"
      @close="orderSupplementaryAuditClose"
    />
    <commMentorReferralFee
      :commMentorReferralVisible="commMentorReferralVisible"
      :applyData="applyData"
      @close="commMentorReferralClose"
      @submit="commMentorReferralClose"
    />
    <commMentorWithdrawal
      :commMentorWithdrawalVisible="commMentorWithdrawalVisible"
      :applyData="applyData"
      @close="commMentorWithdrawalClose"
      @submit="commMentorWithdrawalClose"
    />
    <documentReview
      :documentReviewVisible="documentReviewVisible"
      :applyData="applyData"
      @close="documentReviewClose"
      @submit="documentReviewClose"
    />
    <orderEntry
      :orderEntryVisible="orderEntryVisible"
      :orderId="orderId"
      @close="orderEntryRemindInfo"
    />
    <uploadSpeed
      :uploadSpeedVisible="uploadSpeedVisible"
      @close="uploadSpeedClose"
      @submit="uploadSpeedSubmit"
    />
    <detailSpeed
    :detailSpeedVisible="detailSpeedVisible"
    :taskId="taskId"
    @close="detailSpeedClose"
    />
  </div>
</template>

<script>
import api from '@/api/layout.js'
import d2MenuSide from './components/menu-side'
import d2MenuHeader from './components/menu-header'
import d2Tabs from './components/tabs'
import d2HeaderFullscreen from './components/header-fullscreen'
import d2HeaderLocales from './components/header-locales'
import d2HeaderSearch from './components/header-search'
import d2HeaderSize from './components/header-size'
import d2HeaderTheme from './components/header-theme'
import d2HeaderUser from './components/header-user'
import d2HeaderLog from './components/header-log'
import uploadSpeed from './components/uploadSpeed'
import detailSpeed from './components/detailSpeed'
import d2HeaderColor from './components/header-color'
import { mapState, mapGetters, mapActions } from 'vuex'
import util from '@/libs/util.js'
import { baseWSURL } from '@/plugin/axios'
import orderEntry from '../../views/apply_audit/order_entry.vue'
import applyAudit from '../../views/apply_audit/recommend/audit.vue'
import offerAudit from '../../views/apply_audit/offer/audit.vue'
import signRefund from '../../views/apply_audit/components/sign_refund.vue'
import orderEntryAudit from '../../views/apply_audit/order_entry/audit.vue'
import payRecordDetail from '../../views/apply_audit/components/pay_record_detail.vue'
import mentorPayApprove from '../../views/apply_audit/components/mentor_pay_approve.vue'
import commMentorReferralFee from '../../views/apply_audit/components/mentor_recommend_apply.vue'
import commMentorWithdrawal from '../../views/apply_audit/components/mentor_wallket_apply.vue'
import bdExpenditure from '../../views/apply_audit/bd/activity_fund_audit.vue'
import documentReview from '../../views/apply_audit/documentReview/audit.vue'
import contractFund from '../../views/apply_audit/bd/contract_fund_audit.vue'
import cooperatorContractInfo from '../../views/apply_audit/bd/contract_audit.vue'
import ambassadorSalary from '../../views/apply_audit/bd/ambassador_salary_audit.vue'
import mentorPaymentExtra from '../../views/apply_audit/mentor_payment_extra/audit.vue'
import academicMentorBonus from '../../views/apply_audit/academic_mentor_bonus/audit.vue'
import internshipPay from '../../views/apply_audit/mentor_payment_extra/internship_audit.vue'
import menteeFile from '../../views/apply_audit/mentee_file/audit.vue'
import oneTooneAudit from '../../views/apply_audit/oneToone/oneTooneAudit.vue'
import orderSupplementaryAudit from '../../views/apply_audit/order_supplementary_contract/order_supplementary_aduit.vue'
import mixinSearch from './mixins/search'
import bus from '@/libs/bus'
var validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value !== '' && value.length < 6) {
    callback(new Error('密码长度少于6位'))
  } else {
    if (this.ruleForm.password2 !== '') {
      this.$refs.ruleForm.validateField('password2')
    }
    callback()
  }
}
var validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== this.ruleForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
export default {
  name: 'd2-layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    uploadSpeed,
    detailSpeed,
    d2HeaderFullscreen,
    d2HeaderLocales,
    d2HeaderSearch,
    d2HeaderSize,
    d2HeaderTheme,
    d2HeaderLog,
    d2HeaderColor,
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderUser,
    documentReview,
    orderEntry,
    applyAudit,
    offerAudit,
    signRefund,
    orderEntryAudit,
    payRecordDetail,
    mentorPayApprove,
    bdExpenditure,
    contractFund,
    ambassadorSalary,
    mentorPaymentExtra,
    academicMentorBonus,
    internshipPay,
    cooperatorContractInfo,
    menteeFile,
    oneTooneAudit,
    orderSupplementaryAudit,
    commMentorReferralFee,
    commMentorWithdrawal
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      alertName: '',
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px',
      timeLogOut: 0,
      widths: '240px',
      visible: false,
      orderEntryVisible: false,
      orderId: '',
      refCode: util.sessions.get('userInfo').refCode,
      ruleForm: {
        password: '',
        password2: ''
      },
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      msgList: [],
      total: 0,
      notRead: 0,
      msgFrom: '',
      msgType: '',
      msgTitleList: [],
      msgTitle: '',
      pageNum: 0,
      userList: [],
      msgVisible: false,
      promoVisible: false,
      promoList: [],
      isRead: '0',
      statusList: [
        { itemName: '未读', itemValue: '0' },
        { itemName: '已读', itemValue: '1' },
        { itemName: '全部', itemValue: '' }
      ],

      expiresTime: '60:00',
      userId: util.sessions.get('userInfo').userId,
      websock: null, // 建立的连接
      lockReconnect: false, // 是否真正建立连接
      timeout: 30 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时
      speechRecognitionVisible: false,
      clipboardItem0: '',
      clipboardItem1: '',
      clipboardItem2: '',
      clipboardItem3: '',
      clipboardItem4: '',
      clipboardItem5: '',
      clipboardItem6: '',
      clipboardItem7: '',
      clipboardItem8: '',
      clipboardItem9: '',

      applyVisible: false,
      signRefundVisible: false,
      offerVisible: false,
      orderEntryAuditVisible: false,
      payRecordDetailVisible: false,
      mentorPayApproveVisible: false,
      bdExpenditureVisible: false,
      contractFundVisible: false,
      ambassadorSalaryVisible: false,
      mentorPaymentExtraVisible: false,
      academicMentorBonusVisible: false,
      internshipPayVisible: false,
      menteeFileVisible: false,
      cooperatorContractInfoVisible: false,
      oneTononeAuditVisible: false,
      orderSupplementaryAuditVisible: false,
      commMentorReferralVisible: false,
      commMentorWithdrawalVisible: false,
      documentReviewVisible: false,
      applyData: {},
      pageSize: 400,
      timeOutSet: null,
      total1: 0,
      pageSize1: 50,
      pageNum1: 1,
      speechRecognitionData: [],
      uploadSpeedVisible: false,
      detailSpeedVisible: false,
      taskId: ''
    }
  },
  created () {
    this.timeLogOut = window.timeLogOut = 5400
    clearInterval(window.a)
    window.a = setInterval(() => {
      window.timeLogOut--
      this.timeLogOut = window.timeLogOut
      if (this.timeLogOut === 2) {
        clearInterval(window.a)
      } else if (this.timeLogOut === 1) {
        this.logout()
      }
    }, 1000)
  },
  mounted () {
    // bus.$emit('message', 'hello')
    console.log(bus)
    var reg = /[\u4e00-\u9fa5]/g
    var result = this.$store.state.role.userInfo.userName.replace(reg, '')
    this.alertName = result
    this.userId = (util.sessions.get('userInfo')).userId
    this.getMsgTitle()
    this.viewMessage()
    this.initWebSocket()
    this.getUserList()
  },
  destroyed () {
    this.closeWS()
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      asideTransition: state => state.menu.asideTransition
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 用来实现带参路由的缓存
     */
    routerViewKey () {
      // 默认情况下 key 类似 __transition-n-/foo
      // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
      const stamp = this.$route.meta[`__stamp-${this.$route.path}`] || ''
      return `${stamp ? `__stamp-${stamp}-` : ''}${this.$route.path}`
    },
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return this.themeActiveSetting.backgroundImage
        ? { backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')` }
        : {}
    }
  },
  methods: {
    ...mapActions('d2admin/menu', [
      'asideCollapseToggle'
    ]),
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    },
    closeWS () {
      var that = this
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      this.websock && this.websock.close() // 离开路由之后断开websocket连接
      console.log('断开连接')
    },
    getMsgTitle () {
      api.getMsgTitle().then(({ data }) => {
        console.log('msgTitle列表', data)
        this.msgTitleList = data
      })
    },
    getUserList () {
      api.getUserList().then(({ data }) => {
        console.log('人员列表', data)
        this.userList = data
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.viewMessage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.viewMessage()
    },
    speechRecognitionRefresh () {
      const data = {
        pageNum: this.pageNum1,
        pageSize: this.pageSize1
      }
      api.speechRecognitionList(data).then(res => {
        this.total1 = res.data.total
        this.speechRecognitionData = res.data.rows
      })
    },
    speechRecognitionUp () {
      this.uploadSpeedVisible = true
      console.log('上传音频')
    },
    uploadSpeedSubmit () {
      this.speechRecognitionRefresh()
      this.uploadSpeedVisible = false
    },
    uploadSpeedClose () {
      this.uploadSpeedVisible = false
    },
    detailSpeedClose () {
      this.detailSpeedVisible = false
    },
    handleSizeChange1 (val) {
      this.pageSize1 = val
      this.speechRecognitionRefresh()
    },
    handleCurrentChange1 (val) {
      this.pageNum1 = val
      this.speechRecognitionRefresh()
    },
    handleClose () {
      console.log('关闭抽屉')
      this.msgList = []
      this.msgVisible = false
    },
    Close () {
      this.visible = false
      setTimeout(() => {
        this.$refs.ruleForm.resetFields()
        this.userId = '' // ID
        this.ruleForm = {
          password: '',
          password2: ''
        }
      }, 200)
    },
    // 我的推广码
    showPromo () {
      this.promoVisible = true
      api.getPromoMy().then(({ data }) => {
        console.log('推广码信息', data)
        this.promoList = data
      })
    },
    promoClose () {
      this.promoVisible = false
    },
    copyPromo (text, copyType) {
      const copySuccess = copyType == 0 ? '推广码' : '页面链接'
      this.$copyText(text).then(() => {
        this.$confirm(`${copySuccess}已复制成功`, '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改密码
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        api
          .uptUser({
            userId: this.userId,
            password: this.ruleForm.password
          })
          .then(() => {
            this.Close()
            this.$message({
              message: '修改成功，请重新登录！',
              type: 'success',
              onClose: () => {
                this.logout()
              }
            })
          })
      })
    },
    speechRecognition () {
      this.speechRecognitionRefresh()
      this.speechRecognitionVisible = true
    },
    speechRecognitionClose () {
      this.speechRecognitionVisible = false
    },
    viewMessage2 () {
      this.viewMessage()
      this.msgVisible = true
    },
    refreshDic () {
      util.sessions.remove('allDic')
      const allDic = {}
      util.sessions.set('allDic', allDic)
      location.reload()
    },
    viewMessage () {
      console.log(this.userId)
      api
        .getMsgList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          msgTo: this.userId,
          msgFrom: this.msgFrom,
          msgType: this.msgType,
          msgTitle: this.msgTitle,
          isRead: this.isRead
        })
        .then((res) => {
          console.log('查看信息列表', res)
          this.msgList = res.data.rows
          this.total = res.data.total
          this.notRead = res.data.notRead
        })
    },
    // 一键全读
    seeAll () {
      api.seeAll().then(() => {
        this.$message({
          type: 'success',
          message: '一键全读成功'
        })
        this.viewMessage()
      })
    },
    // 信息确认
    sure (v) {
      console.log(v)
      api.getMsgDetailByID(v.msgId).then((res) => {
        console.log('查看信息详细', res)
        this.viewMessage()
        switch (res.data.keyType) {
          case 'apply_approval':
            this.audit(res.data)
            break
          case 'bd_remind_after_order_entry':
            this.showOrder(res.data)
            break
          case '':
            break
        }
      })
    },
    audit (v) {
      console.log('audit', v, v.applyInfo.apply, v.applyInfo.apply.applyType)
      this.applyData = v.applyInfo.apply
      this.applyData.canSubmit =
        this.applyData.approverId === this.userId
      const applyMap = {
        sign_refund: 'signRefundVisible',
        offer_apply: 'offerVisible',
        entrance_offer_apply: 'offerVisible',
        order_entry: 'orderEntryAuditVisible',
        pay_record: 'payRecordDetailVisible',
        mentor_payment: 'mentorPayApproveVisible',
        bd_expenditure: 'bdExpenditureVisible',
        cooperator_contract_fund: 'contractFundVisible',
        ambassador_salary: 'ambassadorSalaryVisible',
        mentor_payment_extra: 'mentorPaymentExtraVisible',
        academic_mentor_bonus: 'academicMentorBonusVisible',
        internship_offer_payment: 'internshipPayVisible',
        application_letter: 'menteeFileVisible',
        cooperator_contract_info: 'cooperatorContractInfoVisible',
        vip_office_hour_lesson: 'oneTononeAuditVisible',
        order_supplementary_contract: 'orderSupplementaryAuditVisible',
        comm_mentor_referral_fee: 'commMentorReferralVisible',
        comm_mentor_withdrawal: 'commMentorWithdrawalVisible',
        document_review: 'documentReviewVisible'
      }
      this[applyMap[v.applyInfo.apply.applyType] || 'applyVisible'] = true
    },
    applyClose () {
      this.applyVisible = false
    },
    signRefundClose () {
      console.log('退款关闭')
      this.signRefundVisible = false
    },
    offerClose () {
      console.log('offer关闭')
      this.offerVisible = false
    },
    orderEntryClose () {
      console.log('orderEntry关闭')
      this.orderEntryAuditVisible = false
    },
    payRecordDetailClose () {
      console.log('payRecordDetail关闭')
      this.payRecordDetailVisible = false
    },
    mentorPayApproveClose () {
      console.log('审核导师酬金关闭')
      this.mentorPayApproveVisible = false
    },
    bdExpenditureClose () {
      this.bdExpenditureVisible = false
    },
    contractFundClose () {
      this.contractFundVisible = false
    },
    ambassadorSalaryClose () {
      this.ambassadorSalaryVisible = false
    },
    mentorPaymentExtraClose () {
      this.mentorPaymentExtraVisible = false
    },
    academicMentorBonusClose () {
      this.academicMentorBonusVisible = false
    },
    internshipPayClose () {
      this.internshipPayVisible = false
    },
    menteeFileClose () {
      this.menteeFileVisible = false
    },
    oneTononeAuditClose () {
      this.oneTononeAuditVisible = false
    },
    orderSupplementaryAuditClose () {
      this.orderSupplementaryAuditVisible = false
    },
    cooperatorContractInfoClose () {
      this.cooperatorContractInfoVisible = false
    },
    commMentorReferralClose () {
      this.commMentorReferralVisible = false
    },
    commMentorWithdrawalClose () {
      this.commMentorWithdrawalVisible = false
    },
    documentReviewClose () {
      this.documentReviewVisible = false
    },
    handleCommand (command) {
      if (command == 'refCode') {
        this.$copyText(this.refCode).then(() => {
          this.$confirm('推广码已复制成功', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    initWebSocket () {
      // 初始化weosocket
      const wsuri = `${baseWSURL}websocket/${util.sessions.get('token')}`
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      // 连接建立之后执行send方法发送数据
      const actions = { test: '12345' }
      this.websocketsend(JSON.stringify(actions))
      console.log('wsk连接成功')
      this.start()
    },
    websocketonerror () {
      // 连接建立失败重连
      // this.initWebSocket();
      this.reconnect()
    },
    websocketonmessage (e) {
      // 数据接收
      const redata = JSON.parse(e.data)
      // console.log('接收wsk数据：', e, redata)
      if (redata.msgType == 'system_update') {
        switch (redata.msgContent) {
          case 'wait_update':
            {
              this.$loading({
                background: 'rgba(0,0,0,.5)',
                text: '系统升级中...',
                customClass: 'fsz50'
              })
            }
            break
          case 'reload_page':
            {
              this.$alert('系统已更新完成。', {
                confirmButtonText: '确定',
                callback: (action) => {
                  this.$router.go(0)
                }
              })
            }
            break
          case 'reload_login':
            {
              this.$alert('系统已更新完成。', {
                confirmButtonText: '确定',
                callback: (action) => {
                  this.$router.replace({ path: '/login' })
                  this.$router.go(0)
                }
              })
            }
            break
          case 'finish_update': {
            this.$loading().close()
            this.$message({
              type: 'success',
              message: '更新完成，可继续使用',
              duration: 0,
              showClose: true
            })
          }
        }
      } else if (redata.msgType == 'heartCheck') {
        // 收到服务器信息，心跳重置
        this.reset()
      } else if (redata.msgType == 'logOut') {
        var that = this
        clearTimeout(that.timeoutObj)
        clearTimeout(that.serverTimeoutObj)
        this.websock.close() // 离开路由之后断开websocket连接
        this.$alert(redata.msgContent, {
          confirmButtonText: '确定',
          callback: () => {
            this.$router.replace({ path: '/login' })
            this.$router.go(0)
          }
        })
      } else if (redata.msgType == 'follow_up_num_sale') {
        this.$root.followUpNumSale = redata.msgContent
      } else if (redata.msgType == 'follow_up_num_sale_assistant') {
        this.$root.followUpNumSaleAssistant = redata.msgContent
      } else {
        this.notRead++
        console.log(3213123213123, redata.msgType)
        // this.msgList.push(e.data);
        var newThis = this
        this.$notify({
          title: redata.msgTitle,
          message: redata.msgContent,
          duration: 10000,
          onClick () {
            newThis.sure({ msgId: redata.msgId })
            this.$notify.close()
            console.log('关闭信息提示')
          }
        })
      }
      // console.log('接收wsk数据：',redata);
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
      // this.reconnect();
    },
    reconnect () {
      // 重新连接
      var that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function () {
        // 新连接
        that.initWebSocket()
        that.lockReconnect = false
      }, 5000)
    },
    reset () {
      // 重置心跳
      var that = this
      // 清除时间
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      // 重启心跳
      that.start()
    },
    start () {
      // 开启心跳
      var self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function () {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          // 如果连接正常
          // console.log('心跳，心跳消息')
          self.websock.send('heartCheck')
        } else {
          // 否则重连
          console.log('心跳，关闭并重连')
          self.websock.close()
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function () {
          // 超时关闭
          console.log('心跳，超时关闭')
          self.websock.close()
        }, self.timeout)
      }, self.timeout)
    },
    getClipboard () {
      api.getClipboard({ userId: this.userId }).then((res) => {
        console.log(res);
        [
          this.clipboardItem0,
          this.clipboardItem1,
          this.clipboardItem2,
          this.clipboardItem3,
          this.clipboardItem4,
          this.clipboardItem5,
          this.clipboardItem6,
          this.clipboardItem7,
          this.clipboardItem8,
          this.clipboardItem9
        ] = res.data
      })
    },
    saveClipboard () {
      const data = {
        userId: this.userId,
        textArr: [
          this.clipboardItem0,
          this.clipboardItem1,
          this.clipboardItem2,
          this.clipboardItem3,
          this.clipboardItem4,
          this.clipboardItem5,
          this.clipboardItem6,
          this.clipboardItem7,
          this.clipboardItem8,
          this.clipboardItem9
        ]
      }
      api.setClipboard(data).then(() => {})
    },
    copy (v) {
      console.log(v)
      this.$copyText(v)
        .then(() => {
          this.$alert('(已复制到粘贴板)')
        })
        .catch(() => {
          this.$alert('Code(需要手动复制)')
        })
    },
    downloadD (path) {
      window.open(path)
    },
    showOrder (data) {
      console.log(data)
      this.orderEntryVisible = true
      this.orderId = data.keyId
    },
    orderEntryRemindInfo () {
      this.orderEntryVisible = false
    },
    detail (v) {
      this.detailSpeedVisible = true
      this.taskId = v.taskId
      console.log('详情', v)
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '~@/assets/style/theme/register.scss';
.d {
  position: fixed;
  z-index: 100000;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  line-height: 100%;
  // text-align: center;
  font-size: 20px;
  transform: rotate(-30deg);
  opacity: 0.1;
  pointer-events: none;
  .p_item {
    margin: 50px;
    font-weight: 600;
    display: inline-block;
    color: rgba(0, 0, 0, 0.5);
  }
}
.msg-box {
  box-sizing: border-box;
  border-bottom: 120px #fff solid;
  // padding-bottom: 160px;
  position: relative;
}
.dot {
  // position: absolute;
  top: 10px;
  left: 8px;
}
.input-box {
  position: relative;
}
.btn-box {
  position: absolute;
  bottom: 3px;
  right: 13px;
}
.bigText{
  font-size: 14px;
}
.ref_name{
  font-size:16px;
  font-weight:600;
}
.ref_code{
  color:#c32e47;
  font-size:16px;
  font-weight:600;
  cursor: pointer;
}
.business_title{
  font-size:16px;
  font-weight:600;
  color:#000
}
.promo_item{
  padding:10px 5px;
}
.program_alias{
  margin-top:5px;
  font-size:18px;
  font-weight:600;
}
.promo_code{
  margin-bottom:10px;
  font-size:10px;
  color:#8590a6
}
.promo_img{
  width:100%;
  height:auto;
  margin-top:5px;
  margin-bottom:5px;
}
.promo_url{
  color:#606266;
  cursor: pointer;
}
.el-button--mini{
    padding: 5px 4px;
}
</style>
