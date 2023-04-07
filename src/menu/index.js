/*
 * @Author: kaan
 * @Date: 2021-11-05 13:52:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-29 13:35:46
 * @Version:
 * @Description:
 */
import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home', role: 'index' },
  { path: '/backlog', title: '我的待办', icon: 'calendar-o', role: 'backlog' },
  {
    title: '申请审核',
    icon: 'calendar-check-o',
    role: 'apply_audit',
    children: [
      { path: '/apply', title: '我的申请', role: 'apply' },
      { path: '/audit', title: '我的审核', role: 'audit' }
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home', role: 'index' },
  { path: '/backlog', title: '我的待办', icon: 'calendar-o', role: 'backlog' },
  {
    title: '销售助理',
    icon: 'address-card-o',
    role: 'sales_assistant',
    children: [
      { path: '/assistant/mentee', title: '学员管理(销售助理)', role: 'sales_assistant' },
      { path: '/assistant/channel', title: '渠道来源', role: 'channel' },
      { path: '/assistant/assistant_follow_up', title: '销售助理Follow', role: 'assistant_follow_up' },
      { path: '/assistant/assistant_followed_list', title: '销售助理已Follow', role: 'assistant_followed_list' },
      { path: '/assistant/assistant_no_follow_list', title: '销售助理未Follow', role: 'assistant_no_follow_list' },
      { path: '/assistant/allocateHis', title: '分配顾问历史', role: 'allocateHis' }
    ]
  },
  {
    title: '销售管理',
    icon: 'graduation-cap',
    role: 'sales',
    children: [
      { path: '/sales/mentee', title: '学员管理(销售)', role: 'client_tracking' },
      { path: '/sales/schedule', title: '销售工作日', role: 'sales_list' },
      { path: '/sales/followUp', title: '销售Follow', role: 'follow_up' },
      { path: '/sales/followedList', title: '销售已follow', role: 'sales_followed_list' },
      { path: '/sales/noFollowedList', title: '销售未follow', role: 'sales_no_follow_list' },
      { path: '/sales/order', title: '订单管理', role: 'order' },
      { path: '/sales/invoice', title: '发票管理', role: 'invoice' },
      { path: '/sales/accessCode', title: '试听码管理', role: 'accessCode' },
      { path: '/sales/gift', title: '礼品管理', role: 'gift' },
      { path: '/sales/giftSendList', title: '送出礼品列表', role: 'gift_send_list' },
      { path: '/sales/internship', title: '实习一览', role: 'internship_sales' },
      { path: '/sales/agreement/supplementary', title: '补充协议管理', role: 'sales_agreement_model' },
      { path: '/sales/analysis', title: '数据分析', role: 'sales_data_analysis' },
    ]
  },
  {
    title: 'VIP后端',
    icon: 'diamond',
    role: 'VIP',
    children: [
      { path: '/mentor', title: '导师管理', role: 'mentor' },
      { path: '/mentee', title: '学员管理(VIP)', role: 'mentee' },
      { path: '/vipRecommenderList', title: '转介绍学生', role: 'vipRecommenderList' },
      { path: '/mentor_website_apply', title: '导师申请', role: 'mentor_website_apply' },
      { path: '/Internship', title: '实习管理', role: 'internship' },
      { path: '/mentor_payment_extra', title: '导师到账确认', role: 'mentor_payment_extra' },
      { path: '/mentor_pay_cashier', title: '导师佣金/薪资付款', role: 'mentor_pay_cashier' },
      { path: '/apply_for_batch', title: '导师佣金申请', role: 'apply_for_batch' },
      { path: '/internship_cashier', title: '实习单位付款', role: 'internship_cashier' },
      { path: '/mentor_price_rule', title: '导师佣金规则', role: 'mentor_price_rule' },
      { path: '/feedback', title: '行业课程反馈', role: 'feedback' },
      { path: '/VIP_feedback', title: '学员课程反馈', role: 'VIP_feedback' },
      { path: '/vip_lesson', title: 'VIP课程记录', role: 'vip_lesson' },
      { path: '/mentee_change', title: '学员分配', role: 'mentee_change' },
      { path: '/mentee_file', title: '文书修改', role: 'mentee_file' },
      { path: '/seminar', title: '线下课', role: 'seminar' },
      { path: '/VIP_follow_up', title: 'VIP Follow Up', role: 'VIP_follow_up' },
      { path: '/VIP_followed_list', title: '已Follow列表', role: 'VIP_followed_list' },
      { path: '/VIP_no_follow_list', title: '未Follow列表', role: 'VIP_no_follow_list' },
      { path: '/vip_offer_hm_list', title: '求职Offer核验', role: 'vip_offer_hm_list' },
      { path: '/vip_offer_edu_hm_list', title: '升学Offer核验', role: 'vip_offer_edu_hm_list' },
      { path: '/vip_InterviewHM', title: '面试核验', role: 'vip_InterviewHM' },
      { path: '/news_letter_new', title: 'NewsLetter', role: 'news_letter_new' },
      { path: '/requesting_system', title: 'Requesting System', role: 'requesting_system' },
      { path: '/applySeason', title: '申请季进度', role: 'vip_apply_season' },
      { path: '/bookshelf', title: '书架', role: 'bookshelf' },
    ]
  },
  {
    title: '项目管理',
    icon: 'cubes',
    role: 'program',
    children: [
      { path: '/program/basic', title: '基础项目', role: 'program' },
      { path: '/program/continual', title: '续课项目', role: 'program' },
      { path: '/program/extension', title: '延长项目', role: 'extension' },
      { path: '/program/suspend', title: '暂停项目', role: 'suspend' },
      { path: '/program/cfa', title: 'CFA项目', role: 'cfa' },
      { path: '/program/oral', title: '口语项目', role: 'oral' },
      { path: '/program/finance', title: '财商项目', role: 'finance' },
      { path: '/program/jc_pro', title: '杰创项目', role: 'jc_pro' },
      { path: '/program/internship_program', title: '实习项目', role: 'internship_program' },
      { path: '/program/graduate', title: '申研项目', role: 'graduate' },
      { path: '/program/tutoring', title: '辅导项目', role: 'tutoring' },
      { path: '/program/supplementary', title: '补充协议模板', role: 'supplementary' },
    ]
  },
  {
    title: 'BD',
    icon: 'glass',
    role: 'BD',
    children: [
      { path: '/Cooperator', title: '合作商', role: 'cooperator' },
      { path: '/cooperatorRecommenderList', title: '转介绍学生（合作商）', role: 'cooperatorRecommenderList' },
      { path: '/BD_cooperator_activity_list', title: '合作商活动', role: 'BD_cooperator_activity_list' },
      { path: '/Ambassador', title: '校园大使', role: 'ambassador' },
      { path: '/AmbassadorCashier', title: '校园大使出纳', role: 'ambassador_cashier' },
      // { path: '/kol', title: 'KOL', role: 'kol' },
      { path: '/pretalk', title: 'Pretalk', role: 'pretalk' },
      { path: '/BD_follow_up', title: '待follow', role: 'BD_follow_up' },
      { path: '/BD_followed_list', title: '已Follow列表', role: 'BD_followed_list' },
      { path: '/BD_no_follow_list', title: '未Follow列表', role: 'BD_no_follow_list' }
    ]
  },
  {
    title: '成果展示',
    icon: 'thumbs-o-up',
    role: 'achievement',
    children: [
      { path: '/achievement/OfferList', title: '求职Offer列表(无码)', role: 'offer_list' },
      { path: '/achievement/OfferHmList', title: '求职Offer列表(有码)', role: 'offer_hm_list' },
      { path: '/achievement/OfferEduList', title: '升学Offer列表(无码)', role: 'offer_edu_list' },
      { path: '/achievement/OfferEduHmList', title: '升学Offer列表(有码)', role: 'offer_edu_hm_list' },
      { path: '/achievement/InterviewNM', title: '面试列表(无码)', role: 'interview_list' },
      { path: '/achievement/InterviewHM', title: '面试列表(有码)', role: 'interview_hm_list' },
      { path: '/achievement/PraiseNM', title: '学生好评图(无码)', role: 'mentee_praise' },
      { path: '/achievement/PraiseHM', title: '学生好评图(有码)', role: 'mentee_hm_praise' },
      { path: '/achievement/offer_history', title: '求职Offer(历史)', role: 'offer_history' },
      { path: '/achievement/offer_edu_history', title: '升学Offer(历史)', role: 'offer_edu_history' },
      { path: '/achievement/interview_history', title: '面经历史', role: 'interview_history' },
      { path: '/achievement/OfferAll', title: '求职Offer(全部)', role: 'offer_all' },
      { path: '/achievement/MentorList', title: '导师展示', role: 'mentor_list' }
    ]
  },
  {
    title: '系统报表',
    icon: 'table',
    role: 'statement',
    children: [
      { path: '/statement/statement_sale_assistant', title: '销售助理报表', role: 'statement_sale_assistant' },
      { path: '/statement/statement_sale', title: '销售报表', role: 'statement_sale' },
      { path: '/statement/sales_conversion', title: '销售转化率报表', role: 'sales_conversion' },
      { path: '/statement/sales_repurchase', title: '复购报表', role: 'sales_repurchase' },
      { path: '/statement/school_statement', title: '学校统计报表', role: 'school_statement' },
      { path: '/statement/hr_statement', title: 'HR统计报表', role: 'hr_statement' },
      { path: '/statement/programm_statement', title: '项目统计报表', role: 'programm_statement' },
      { path: '/statement/bd_consulting', title: 'BD咨询报表', role: 'bd_consulting' },
      { path: '/statement/bd_consulting2', title: 'BD咨询报表2.0', role: 'bd_consulting2' },
      { path: '/statement/statement_mentor', title: '行业导师报表', role: 'statement_mentor' },
      { path: '/statement/time_line', title: '时间线', role: 'time_line' },
      { path: '/statement/monthly_report', title: '销售月报', role: 'monthly_report' },
      { path: '/statement/bd_monthReport', title: 'BD月报', role: 'bd_monthReport' },
      { path: '/statement/money_out', title: '出账报表', role: 'money_out' },
      { path: '/statement/order_refund', title: '订单退款', role: 'order_refund' },
      { path: '/statement/confirm_statement', title: '确收统计', role: 'confirm_statement' }
    ]
  },
  {
    title: '申请审核',
    icon: 'calendar-check-o',
    role: 'apply_audit',
    children: [
      { path: '/apply', title: '我的申请', role: 'apply' },
      { path: '/audit', title: '我的审核', role: 'audit' },
      { path: '/cashier', title: '出纳管理', role: 'cashier' },
      { path: '/copy_to', title: '抄送管理', role: 'copy_to' },
      { path: '/all_apply_data', title: '全部申请', role: 'all_apply_data' },
      { path: '/accounting_audit', title: '入账审核', role: 'accounting_audit' },
      { path: '/auditor', title: '审核人管理', role: 'auditor' }
    ]
  },
  // {
  //   title: '合规部门',
  //   icon: 'users',
  //   role: 'compliance_department',
  //   children: [
  //   ]
  // },
  {
    title: '合规部门',
    icon: 'users',
    role: 'HR',
    children: [
      { path: '/reward_punishment', title: '奖惩事件', role: 'reward_punishment' },
      { path: '/interview_user', title: '面试人员', role: 'interview_user' },
      { path: '/hr_user', title: '员工管理', role: 'hr_user' },
      { path: '/five_one_rate', title: '五险一金', role: 'five_one_rate' },
      { path: '/stream_WX', title: '微信管理', role: 'stream_WX' },
      { path: '/salary', title: '薪资记录', role: 'salary' },
      { path: '/operate_cost_list', title: '运营开支', role: 'operate_cost_list' },
      { path: '/evaluate', title: '员工评估', role: 'evaluate' },
      { path: '/vacation', title: '假期列表', role: 'vacation' },
      { path: '/organization', title: '组织架构', role: 'organization' },
      { path: '/level', title: '等级管理', role: 'level' },
      { path: '/role', title: '角色管理', role: 'role' },
    ]
  },
  {
    title: '岗位资源',
    icon: 'desktop',
    role: 'job',
    children: [
      { path: '/InternalJob', title: '内推机会', role: 'internal_job' },
      { path: '/NetApplication', title: '网申提醒', role: 'net_application' }
    ]
  },
  { path: '/Promo', title: '推广码管理', icon: 'paper-plane-o', role: 'Promo' },
  {
    title: '文件系统',
    icon: 'folder-open-o',
    role: 'file_system',
    children: [
      { path: '/FileList', title: '文件管理', role: 'file_list' }
    ]
  },
  {
    title: '成本一览',
    icon: 'credit-card',
    role: 'file_system',
    children: [
      { path: '/cost_internship_list', title: '实习成本', role: 'cost_internship_list' },
      { path: '/cost_mentor_list', title: '行业导师成本', role: 'cost_mentor_list' }
    ]
  },
  {
    title: '系统管理',
    icon: 'cog',
    role: 'system',
    children: [
      { path: '/Notice', title: '通知中心', role: 'notice' },
      { path: '/school', title: '学校管理', role: 'school' },
      // { path: '/select_data', title: '下拉项管理', role: 'select_data' },
      { path: '/internship_unit', title: '实习管理', role: 'internship_unit' },
      { path: '/wst_company', title: 'WST Company', role: 'wst_company' },
      { path: '/company', title: '公司管理', role: 'company' },
      { path: '/account_list', title: '入账账户管理', role: 'account_list' },
      // { path: '/refCodeList', title: 'RefCode', role: 'refCodeList' },
      { path: '/keys', title: '秘钥', role: 'keys' },
      { path: '/rate', title: '汇率', role: 'rate' },
      { path: '/mentor_pay_cashier_set', title: '出纳人管理', role: 'mentor_pay_cashier_set' },
      { path: '/crm_authorizationCode', title: 'CRM授权码', role: 'crm_authorizationCode' },
    ]
  },
  {
    title: '数据字典',
    icon: 'book',
    role: 'dictionary_system',
    children: [
      { path: '/dictionaryAll', title: '所有字典', role: 'dictionary' },
      { path: '/dictionary_division', title: '岗位字典', role: 'dictionary_division' },
      { path: '/mentee_bd_track', title: '学生课程方向标签', role: 'mentee_bd_track' },
    ]
  },
  {
    title: '活动管理',
    icon: 'magic',
    role: 'activity_manage',
    children: [
      { path: '/ActivityList', title: '活动列表', role: 'activity_list' }
    ]
  }
])
