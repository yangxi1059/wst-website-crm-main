/*
 * @Author: kaan
 * @Date: 2021-11-15 14:57:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-18 10:39:29
 * @Version: 
 * @Description: {meta.closeChild}为true时，打开页面时将根据路由关闭所有子页面
 */
import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: '/index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      /* ---  销售助理 start --- */
      {
        path: '/assistant/channel',
        name: 'channel',
        meta: {
          title: '渠道来源',
          auth: true,
          // cache: true
        },
        component: _import('assistant/channel')
      },
      {
        path: '/assistant/assistant_follow_up',
        name: 'assistant_follow_up',
        meta: {
          title: '销售助理Follow',
          auth: true,
          // cache: true
        },
        component: _import('assistant/assistant_follow_up')
      },
      {
        path: '/assistant/assistant_followed_list',
        name: 'assistant_followed_list',
        meta: {
          title: '销售助理已Follow',
          auth: true,
          // cache: true
        },
        component: _import('assistant/assistant_followed_list')
      },
      {
        path: '/assistant/assistant_no_follow_list',
        name: 'assistant_no_follow_list',
        meta: {
          title: '销售助理未Follow',
          auth: true,
          // cache: true
        },
        component: _import('assistant/assistant_no_follow_list')
      },
      {
        path: '/assistant/allocateHis',
        name: 'allocateHis',
        meta: {
          title: '分配顾问历史',
          auth: true,
          // cache: true
        },
        component: _import('assistant/allocateHis')
      },
      {
        path: '/assistant/mentee',
        name: 'AssistantMentee',
        meta: {
          title: '学员管理(销售助理)',
          auth: true,
          // cache: true
        },
        component: _import('assistant/mentee')
      },
      {
        path: '/assistant/mentee/follow',
        name: 'AssistantFollow',
        meta: {
          title: 'Follow(销售助理)',
          auth: true,
          // cache: true
        },
        component: _import('assistant/mentee/AssistantFollow')
      },
      /* ---  销售助理 end --- */
      /* ---  销售管理 start --- */
      {
        path: '/sales/mentee/',
        name: 'SalesMentee',
        meta: {
          title: '学员管理(销售)',
          auth: true,
          // cache: true
        },
        component: _import('sales/mentee')
      },
      {
        path: '/sales/schedule/',
        name: 'SalesSchedule',
        meta: {
          title: '销售工作日',
          auth: true,
          // cache: true
        },
        component: _import('sales/schedule')
      },
      {
        path: '/sales/followUp/',
        name: 'SalesFollowUp',
        meta: {
          title: '销售Follow',
          auth: true,
          // cache: true
        },
        component: _import('sales/followUp')
      },
      {
        path: '/sales/followedList/',
        name: 'SalesFollowedList',
        meta: {
          title: '销售已Follow',
          auth: true,
          // cache: true
        },
        component: _import('sales/followUp/followedList')
      },
      {
        path: '/sales/noFollowedList/',
        name: 'SalesNoFollowedList',
        meta: {
          title: '销售未Follow',
          auth: true,
          // cache: true
        },
        component: _import('sales/followUp/noFollowedList')
      },
      {
        path: '/sales/order/',
        name: 'SalesOrder',
        meta: {
          title: '订单管理',
          auth: true,
          // cache: true
        },
        component: _import('sales/order')
      },
      {
        path: '/sales/accessCode/',
        name: 'SalesAccessCode',
        meta: {
          title: '试听码管理',
          auth: true,
          // cache: true
        },
        component: _import('sales/accessCode')
      },
      {
        path: '/sales/invoice/',
        name: 'SalesInvoice',
        meta: {
          title: '发票管理',
          auth: true,
          // cache: true
        },
        component: _import('sales/invoice')
      },
      {
        path: '/sales/pretalk/',
        name: 'SalesPretalk',
        meta: {
          title: '筛选Pretalk列表',
          auth: true,
          // cache: true
        },
        component: _import('sales/pretalk')
      },
      {
        path: '/sales/gift/',
        name: 'SalesGift',
        meta: {
          title: '礼品管理',
          auth: true,
          // cache: true
        },
        component: _import('sales/gift')
      },
      {
        path: '/sales/giftSendList/',
        name: 'SalesGiftSendList',
        meta: {
          title: '送出礼品列表',
          auth: true,
          // cache: true
        },
        component: _import('sales/gift/SendList')
      },
      {
        path: '/sales/internship/',
        name: 'SalesInternship',
        meta: {
          title: '实习一览',
          auth: true,
          // cache: true
        },
        component: _import('sales/internship')
      },
      {
        path: '/sales/agreement/supplementary',
        name: 'SalesAgreementSupplementary',
        meta: {
          title: '补充协议管理',
          auth: true,
          // cache: true
        },
        component: _import('sales/agreement/Supplementary')
      },
      {
        path: '/sales/analysis',
        name: 'SalesAnalysis',
        meta: {
          title: '数据分析',
          auth: true,
          // cache: true
        },
        component: _import('sales/analysis')
      },
      /* ---  销售管理 end --- */
      /* ---  VIP 后端 start --- */
      {
        path: '/mentor',
        name: 'Mentor',
        meta: {
          title: '导师管理',
          auth: true,
          cache: true
        },
        component: _import('vip/mentor')
      },
      {
        path: '/mentor_website_apply',
        name: 'mentor_website_apply',
        meta: {
          title: '导师申请',
          auth: true,
          cache: true
        },
        component: _import('vip/mentor_website_apply')
      },
      {
        path: '/mentor_price_rule',
        name: 'mentor_price_rule',
        meta: {
          title: '导师佣金规则',
          auth: true,
          cache: true
        },
        component: _import('vip/mentor_price_rule')
      },
      {
        path: '/feedback',
        name: 'feedback',
        meta: {
          title: '行业课程反馈',
          auth: true,
          cache: true
        },
        component: _import('vip/feedback')
      },
      {
        path: '/VIP_feedback',
        name: 'VIP_feedback',
        meta: {
          title: '学员课程反馈',
          auth: true,
          cache: true
        },
        component: _import('vip/VIP_feedback')
      },
      {
        path: '/vip_lesson',
        name: 'vip_lesson',
        meta: {
          title: 'VIP课程记录',
          auth: true,
          cache: true
        },
        component: _import('vip/vip_lesson')
      },
      {
        path: '/news_letter_new',
        name: 'news_letter_new',
        meta: {
          title: 'NewsLetter',
          auth: true,
          cache: true
        },
        component: _import('vip/news_letter_new')
      },
      {
        path: '/requesting_system',
        name: 'requesting_system',
        meta: {
          title: 'Requesting System',
          auth: true,
          cache: true
        },
        component: _import('vip/requesting_system')
      },
      {
        path: '/mentor/mentorDetail',
        name: 'MentorDetail',
        meta: {
          title: '导师详情',
          auth: true,
          // cache: true
        },
        component: _import('vip/mentor/MentorDetail')
      },
      {
        path: '/mentee',
        name: 'mentee',
        meta: {
          title: '学员管理(VIP)',
          auth: true,
          cache: true
        },
        component: _import('vip/mentee')
      },
      {
        path: '/internship_cashier',
        name: 'internship_cashier',
        meta: {
          title: '实习单位付款',
          auth: true,
          // cache: true
        },
        component: _import('vip/internship_cashier/internship_cashier')
      },
      {
        path: '/backlog',
        name: 'backlog',
        meta: {
          title: '我的待办',
          auth: true,
          // cache: true
        },
        component: _import('backlog/index')
      },
      {
        path: '/mentor_payment_extra',
        name: 'mentor_payment_extra',
        meta: {
          title: '导师到账确认',
          auth: true,
          // cache: true
        },
        component: _import('vip/mentor_payment_extra')
      },
      {
        path: '/mentor_pay_cashier',
        name: 'mentor_pay_cashier',
        meta: {
          title: '导师佣金/薪资付款',
          auth: true,
          // cache: true
        },
        component: _import('vip/mentor_pay_cashier')
      },
      {
        path: '/mentee_change',
        name: 'mentee_change',
        meta: {
          title: '学员分配',
          auth: true,
          // cache: true
        },
        component: _import('vip/mentee_change')
      },
      {
        path: '/mentee_file',
        name: 'mentee_file',
        meta: {
          title: '文书修改',
          auth: true,
          // cache: true
        },
        component: _import('vip/mentee_file')
      },
      {
        path: '/seminar',
        name: 'seminar',
        meta: {
          title: '线下课',
          auth: true,
          // cache: true
        },
        component: _import('vip/seminar')
      },
      {
        path: '/InternalJob',
        name: 'InternalJob',
        meta: {
          title: '内推机会',
          auth: true,
          // cache: true
        },
        component: _import('job_resource/InternalJob')
      },
      {
        path: '/NetApplication',
        name: 'NetApplication',
        meta: {
          title: '网申提醒',
          auth: true,
          // cache: true
        },
        component: _import('job_resource/NetApplication')
      },
      {
        path: '/VIP_follow_up',
        name: 'VIP_follow_up',
        meta: {
          title: 'VIP Follow Up',
          auth: true,
          // cache: true
        },
        component: _import('vip/vip_follow/index.vue')
      },
      {
        path: '/VIP_followed_list',
        name: 'VIP_followed_list',
        meta: {
          title: '已Follow列表',
          auth: true,
          // cache: true
        },
        component: _import('vip/vip_followed/vip_followed')
      },
      {
        path: '/VIP_no_follow_list',
        name: 'VIP_no_follow_list',
        meta: {
          title: '未Follow列表',
          auth: true,
          // cache: true
        },
        component: _import('vip/VIP_no_follow_list/VIP_no_follow_list')
      },
      {
        path: '/vip_offer_hm_list',
        name: 'vip_offer_hm_list',
        meta: {
          title: '求职offer核验',
          auth: true,
          // cache: true
        },
        component: _import('vip/vip_offer_hm_list/vip_offer_hm_list')
      },
      {
        path: '/vipRecommenderList',
        name: 'vipRecommenderList',
        meta: {
          title: '转介绍学生',
          auth: true,
          // cache: true
        },
        component: _import('vip/vipRecommenderList/index')
      },
      {
        path: '/cooperatorRecommenderList',
        name: 'cooperatorRecommenderList',
        meta: {
          title: '转介绍学生（合作商）',
          auth: true,
          // cache: true
        },
        component: _import('BD/cooperatorRecommenderList/index')
      },
      {
        path: '/vip_offer_edu_hm_list',
        name: 'vip_offer_edu_hm_list',
        meta: {
          title: '升学offer核验',
          auth: true,
          // cache: true
        },
        component: _import('vip/vip_offer_edu_hm_list/vip_offer_edu_hm_list')
      },
      {
        path: '/vip_InterviewHM',
        name: 'vip_InterviewHM',
        meta: {
          title: '面试核验',
          auth: true,
          // cache: true
        },
        component: _import('vip/vip_InterviewHM/vip_InterviewHM')
      },
      {
        path: '/reward_punishment',
        name: 'reward_punishment',
        meta: {
          title: '奖惩事件',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/reward_punishment')
      },
      {
        path: '/reward_punishment',
        name: 'reward_punishment',
        meta: {
          title: '奖惩事件',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/reward_punishment')
      },
      {
        path: '/interview_user',
        name: 'interview_user',
        meta: {
          title: '面试人员',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/interview')
      },
      {
        path: '/hr_user',
        name: 'hr_user',
        meta: {
          title: '员工管理',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/hr_user')
      },
      {
        path: '/five_one_rate',
        name: 'five_one_rate',
        meta: {
          title: '五险一金',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/five_one_rate')
      },
      {
        path: '/stream_WX',
        name: 'stream_WX',
        meta: {
          title: '微信管理',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/stream_WX')
      },
      {
        path: '/salary',
        name: 'salary',
        meta: {
          title: '薪资记录',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/salary')
      },
      {
        path: '/operate_cost_list',
        name: 'operate_cost_list',
        meta: {
          title: '运营开支',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/operate_cost_list')
      },
      {
        path: '/evaluate',
        name: 'evaluate',
        meta: {
          title: '员工评估',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/evaluate')
      },
      {
        path: '/vacation',
        name: 'vacation',
        meta: {
          title: '假期列表',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/vacation')
      },
      {
        path: '/organization',
        name: 'organization',
        meta: {
          title: '组织架构',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/organization')
      },
      {
        path: '/level',
        name: 'level',
        meta: {
          title: '等级管理',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/level')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          title: '角色管理',
          auth: true,
          // cache: true
        },
        component: _import('compliance_department/role')
      },
      {
        path: '/Notice',
        name: 'Notice',
        meta: {
          title: '通知中心',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/notice/index')
      },
      {
        path: '/keys',
        name: 'keys',
        meta: {
          title: '秘钥',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/keys/index')
      },
      {
        path: '/wst_company',
        name: 'wst_company',
        meta: {
          title: 'WST Company',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/wst_company')
      },
      {
        path: '/mentor_pay_cashier_set',
        name: 'mentor_pay_cashier_set',
        meta: {
          title: '出纳人设置',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/mentor_pay_cashier_set')
      },
      {
        path: '/rate',
        name: 'rate',
        meta: {
          title: '汇率',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/rate')
      },
      {
        path: '/account_list',
        name: 'account_list',
        meta: {
          title: '入账账户管理',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/account_list')
      },
      {
        path: '/crm_authorizationCode',
        name: 'crm_authorizationCode',
        meta: {
          title: 'CRM授权码',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/crm_authorizationCode')
      },
      {
        path: '/internship_unit',
        name: 'internship_unit',
        meta: {
          title: '实习管理',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/internship_unit')
      },
      {
        path: '/company',
        name: 'company',
        meta: {
          title: '公司管理',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/company/index')
      },
      {
        path: '/school',
        name: 'school',
        meta: {
          title: '学校管理',
          auth: true,
          // cache: true
        },
        component: _import('systemSetting/school/index')
      },
      {
        path: '/FileList',
        name: 'FileList',
        meta: {
          title: '文件管理',
          auth: true,
          // cache: true
        },
        component: _import('file_system/FileList')
      },
      {
        path: '/mentee/detail',
        name: 'UserDetail',
        meta: {
          title: '学员详情',
          closeChild: true,
          auth: true
          // // cache: true
        },
        component: _import('vip/mentee/UserDetail'),
      },
      {
        path: '/order/OrderDetailTabs',
        name: 'OrderDetailTabs',
        meta: {
          title: '订单详情',
          closeChild: true,
          auth: true
          // // cache: true
        },
        component: _import('sales/order/components/OrderDetailTabs'),
      },
      {
        path: '/Calendar',
        name: 'Calendar',
        meta: {
          title: '网申日历',
          closeChild: true,
          auth: true
          // // cache: true
        },
        component: _import('system/Calendar'),
      },
      {
        path: '/mentee/detail/course',
        name: 'CourseDetail',
        meta: {
          title: '课程详情',
          auth: true
        },
        component: _import('vip/mentee/CourseDetail'),
      },
      {
        path: '/mentee/detail/lessonPayApply',
        name: 'LessonPayApply',
        meta: {
          title: '课程费用申请',
          auth: true
        },
        component: _import('vip/mentee/LessonPayApply'),
      },
      {
        path: '/mentee/applySeasonProcess',
        name: 'ApplySeasonProcess',
        meta: {
          title: '申请季进度(VIP)',
          closeChild: true,
          auth: true
          // // cache: true
        },
        component: _import('vip/mentee/ApplySeasonProcess'),
      },
      {
        path: '/dictionaryAll',
        name: 'dictionaryAll',
        meta: {
          title: '所有字典',
          auth: true,
          // cache: true
        },
        component: _import('dictionary_system/DictionaryAll')
      },
      {
        path: '/dictionary_division',
        name: 'dictionary_division',
        meta: {
          title: '岗位字典',
          auth: true,
          // cache: true
        },
        component: _import('dictionary_system/DictionaryDivision')
      },
      {
        path: '/mentee_bd_track',
        name: 'mentee_bd_track',
        meta: {
          title: '学生课程方向标签',
          auth: true,
          // cache: true
        },
        component: _import('dictionary_system/mentee_bd_track')
      },
      // {
      //   path: '/mentee/Offer',
      //   name: 'Offer',
      //   meta: {
      //     title: 'VIP Offer',
      //     auth: true
      //   },
      //   component: _import('vip/mentee/Offer'),
      // },
      // {
      //   path: '/mentee/Interview',
      //   name: 'Interview',
      //   meta: {
      //     title: 'VIP Interview',
      //     auth: true
      //   },
      //   component: _import('vip/mentee/Interview'),
      // },
      {
        path: '/mentee/VipFollow',
        name: 'VipFollow',
        meta: {
          title: 'VIP Follow',
          auth: true
        },
        component: _import('vip/mentee/VipFollow'),
      },
      {
        path: '/internship',
        name: 'Internship',
        meta: {
          title: '实习管理',
          auth: true,
          // cache: true
        },
        component: _import('vip/internship/Internship')
      },
      {
        path: '/applySeason',
        name: 'ApplySeason',
        meta: {
          title: '申请季进度',
          auth: true,
          // cache: true
        },
        component: _import('vip/applySeason')
      },
      {
        path: '/bookshelf',
        name: 'bookshelf',
        meta: {
          title: '书架',
          auth: true,
          cache: true
        },
        component: _import('vip/bookshelf')
      },
      {
        path: '/apply_for_batch',
        name: 'apply_for_batch',
        meta: {
          title: '导师佣金申请',
          auth: true,
          // cache: true
        },
        component: _import('vip/apply_for_batch')
      },
      /* ---  VIP 后端 end --- */
      /* ---  成果展示 start --- */
      {
        path: '/achievement/OfferList',
        name: 'offer_list',
        meta: {
          title: '求职Offer列表(无码)',
          auth: true
        },
        component: _import('achievement/OfferList')
      },
      {
        path: '/achievement/OfferHmList',
        name: 'offer_hm_list',
        meta: {
          title: '求职Offer列表(有码)',
          auth: true
        },
        component: _import('achievement/OfferHmList')
      },
      {
        path: '/achievement/OfferEduList',
        name: 'OfferEduList',
        meta: {
          title: '升学Offer列表(无码)',
          auth: true
        },
        component: _import('achievement/OfferEduList')
      },
      {
        path: '/achievement/OfferEduHmList',
        name: 'OfferEduHmList',
        meta: {
          title: '升学Offer列表(有码)',
          auth: true
        },
        component: _import('achievement/OfferEduHmList')
      },
      {
        path: '/achievement/InterviewNM',
        name: 'InterviewNM',
        meta: {
          title: '面试列表(无码)',
          auth: true
        },
        component: _import('achievement/InterviewNM')
      },
      {
        path: '/achievement/InterviewHM',
        name: 'InterviewHM',
        meta: {
          title: '面试列表(有码)',
          auth: true
        },
        component: _import('achievement/InterviewHM')
      },
      {
        path: '/achievement/PraiseNM',
        name: 'PraiseNM',
        meta: {
          title: '学生好评图(无码)',
          auth: true
        },
        component: _import('achievement/PraiseNM')
      },
      {
        path: '/achievement/PraiseHM',
        name: 'PraiseHM',
        meta: {
          title: '学生好评图(有码)',
          auth: true
        },
        component: _import('achievement/PraiseHM')
      },
      {
        path: '/achievement/offer_history',
        name: 'offer_history',
        meta: {
          title: '求职Offer（历史）',
          auth: true
        },
        component: _import('achievement/offer_history.vue')
      },
      {
        path: '/achievement/offer_edu_history',
        name: 'offer_edu_history',
        meta: {
          title: '升学Offer（历史）',
          auth: true
        },
        component: _import('achievement/offer_edu_history.vue')
      },
      {
        path: '/achievement/interview_history',
        name: 'interview_history',
        meta: {
          title: '面经历史',
          auth: true
        },
        component: _import('achievement/interview_history.vue')
      },
      {
        path: '/achievement/OfferAll',
        name: 'OfferAll',
        meta: {
          title: '求职Offer（全部）',
          auth: true
        },
        component: _import('achievement/OfferAll.vue')
      },
      {
        path: '/achievement/MentorList',
        name: 'MentorList',
        meta: {
          title: '导师展示',
          auth: true
        },
        component: _import('achievement/MentorList.vue')
      },
      {
        path: '/statement/statement_sale_assistant',
        name: 'statement_sale_assistant',
        meta: {
          title: '销售助理报表',
          auth: true
        },
        component: _import('statement/statement_sale_assistant')
      },
      {
        path: '/statement/statement_sale',
        name: 'statement_sale',
        meta: {
          title: '销售报表',
          auth: true
        },
        component: _import('statement/statement_sale')
      },
      {
        path: '/statement/sales_conversion',
        name: 'sales_conversion',
        meta: {
          title: '销售转化率报表',
          auth: true
        },
        component: _import('statement/sales_conversion')
      },
      {
        path: '/statement/sales_repurchase',
        name: 'sales_repurchase',
        meta: {
          title: '复购报表',
          auth: true
        },
        component: _import('statement/sales_repurchase')
      },
      {
        path: '/statement/school_statement',
        name: 'school_statement',
        meta: {
          title: '学校统计报表',
          auth: true
        },
        component: _import('statement/school_statement')
      },
      {
        path: '/statement/hr_statement',
        name: 'hr_statement',
        meta: {
          title: 'HR统计报表',
          auth: true
        },
        component: _import('statement/hr_statement')
      },
      {
        path: '/statement/programm_statement',
        name: 'programm_statement',
        meta: {
          title: '项目统计报表',
          auth: true
        },
        component: _import('statement/programm_statement')
      },
      {
        path: '/statement/bd_consulting',
        name: 'bd_consulting',
        meta: {
          title: 'BD咨询报表',
          auth: true
        },
        component: _import('statement/bd_consulting')
      },
      {
        path: '/statement/bd_consulting2',
        name: 'bd_consulting2',
        meta: {
          title: 'BD咨询报表2.0',
          auth: true
        },
        component: _import('statement/bd_consulting2')
      },
      {
        path: '/statement/statement_mentor',
        name: 'statement_mentor',
        meta: {
          title: '行业导师报表',
          auth: true
        },
        component: _import('statement/statement_mentor')
      },
      {
        path: '/statement/time_line',
        name: 'time_line',
        meta: {
          title: '时间线',
          auth: true
        },
        component: _import('statement/time_line')
      },
      {
        path: '/statement/monthly_report',
        name: 'monthly_report',
        meta: {
          title: '销售月报',
          auth: true
        },
        component: _import('monthly_report/index')
      },
      {
        path: '/statement/bd_monthReport',
        name: 'bd_monthReport',
        meta: {
          title: 'BD月报',
          auth: true
        },
        component: _import('monthly_report/bd_monthReport')
      },
      {
        path: '/statement/money_out',
        name: 'money_out',
        meta: {
          title: '出账报表',
          auth: true
        },
        component: _import('finance/money_out')
      },
      {
        path: '/statement/order_refund',
        name: 'order_refund',
        meta: {
          title: '订单退款',
          auth: true
        },
        component: _import('finance/order_refund')
      },
      {
        path: '/statement/confirm_statement',
        name: 'confirm_statement',
        meta: {
          title: '确收统计',
          auth: true
        },
        component: _import('statement/confirm_statement')
      },
      {
        path: '/apply',
        name: 'apply',
        meta: {
          title: '我的申请',
          auth: true,
          // cache: true
        },
        component: _import('apply_audit/Apply')
      },
      {
        path: '/audit',
        name: 'audit',
        meta: {
          title: '我的审核',
          auth: true,
          // cache: true
        },
        component: _import('apply_audit/Audit')
      },
      {
        path: '/cashier',
        name: 'cashier',
        meta: {
          title: '出纳管理',
          auth: true,
          // cache: true
        },
        component: _import('apply_audit/Cashier')
      },
      {
        path: '/copy_to',
        name: 'copy_to',
        meta: {
          title: '抄送管理',
          auth: true,
          // cache: true
        },
        component: _import('apply_audit/CopyTo')
      },
      {
        path: '/all_apply_data',
        name: 'all_apply_data',
        meta: {
          title: '全部申请',
          auth: true,
          // cache: true
        },
        component: _import('apply_audit/AllApplyData')
      },
      {
        path: '/accounting_audit',
        name: 'accounting_audit',
        meta: {
          title: '入账审核',
          auth: true,
          // cache: true
        },
        component: _import('finance/Accounting_audit')
      },
      {
        path: '/auditor',
        name: 'auditor',
        meta: {
          title: '审核人管理',
          auth: true,
          // cache: true
        },
        component: _import('apply_audit/Auditor')
      },
      {
        path: '/cost_internship_list',
        name: 'cost_internship_list',
        meta: {
          title: '实习成本',
          auth: true,
          // cache: true
        },
        component: _import('cost/CostInternshipList')
      },
      {
        path: '/cost_mentor_list',
        name: 'cost_mentor_list',
        meta: {
          title: '行业导师成本',
          auth: true,
          // cache: true
        },
        component: _import('cost/CostMentorList')
      },
      {
        path: '/ActivityList',
        name: 'ActivityList',
        meta: {
          title: '活动列表',
          auth: true,
          // cache: true
        },
        component: _import('activity/ActivityList')
      },
      {
        path: '/coupon_list',
        name: 'coupon_list',
        meta: {
          title: '卡券列表',
          auth: true,
          // cache: true
        },
        component: _import('activity/coupon_list')
      },
      {
        path: '/Promo',
        name: 'Promo',
        meta: {
          title: '推广码管理',
          auth: true,
          // cache: true
        },
        component: _import('Promo/index')
      },
      {
        path: '/Cooperator',
        name: 'Cooperator',
        meta: {
          title: '合作商',
          auth: true,
          cache: true
        },
        component: _import('BD/Cooperator')
      },
      {
        path: '/cooperator_detail',
        name: 'cooperator_detail',
        meta: {
          title: '合作商详情',
          auth: true,
          cache: true
        },
        component: _import('BD/cooperator_detail')
      },
      {
        path: '/BD_cooperator_activity_list',
        name: 'BD_cooperator_activity_list',
        meta: {
          title: '合作商活动',
          auth: true,
          // cache: true
        },
        component: _import('BD/CooperatorActivityList')
      },
      {
        path: '/Ambassador',
        name: 'Ambassador',
        meta: {
          title: '校园大使',
          auth: true,
          // cache: true
        },
        component: _import('BD/Ambassador')
      },
      {
        path: '/AmbassadorCashier',
        name: 'AmbassadorCashier',
        meta: {
          title: '校园大使出纳',
          auth: true,
          // cache: true
        },
        component: _import('BD/AmbassadorCashier')
      },
      {
        path: '/kol',
        name: 'kol',
        meta: {
          title: 'KOL',
          auth: true,
          // cache: true
        },
        component: _import('BD/Kol')
      },
      {
        path: '/pretalk',
        name: 'pretalk',
        meta: {
          title: 'Pretalk',
          auth: true,
          // cache: true
        },
        component: _import('BD/Pretalk')
      },
      {
        path: '/BD_follow_up',
        name: '待follow',
        meta: {
          title: 'BD_follow_up',
          auth: true,
          // cache: true
        },
        component: _import('BD/FollowUp')
      },
      {
        path: '/BD_followed_list',
        name: 'BD_followed_list',
        meta: {
          title: '已follow',
          auth: true,
          // cache: true
        },
        component: _import('BD/FollowedList')
      },
      {
        path: '/BD_no_follow_list',
        name: 'BD_no_follow_list',
        meta: {
          title: '过期未follow',
          auth: true,
          // cache: true
        },
        component: _import('BD/NoFollowList')
      },
      /* ---  项目管理 start --- */
      {
        path: '/program/basic',
        name: 'ProgramBasic',
        meta: {
          title: '基础项目',
          auth: true,
          // cache: true
        },
        component: _import('program/basic/index.vue')
      },
      {
        path: '/program/cfa',
        name: 'ProgramCFA',
        meta: {
          title: 'CFA项目',
          auth: true,
          // cache: true
        },
        component: _import('program/cfa/index.vue')
      },
      {
        path: '/program/continual',
        name: 'ProgramContinual',
        meta: {
          title: '续课项目',
          auth: true,
          // cache: true
        },
        component: _import('program/continual/index.vue')
      },
      {
        path: '/program/extension',
        name: 'ProgramExtension',
        meta: {
          title: '延长项目',
          auth: true,
          // cache: true
        },
        component: _import('program/extension/index.vue')
      },
      {
        path: '/program/finance',
        name: 'ProgramFinance',
        meta: {
          title: '财商项目',
          auth: true,
          // cache: true
        },
        component: _import('program/finance/index.vue')
      },
      {
        path: '/program/suspend',
        name: 'ProgramSuspend',
        meta: {
          title: '暂停项目',
          auth: true,
          // cache: true
        },
        component: _import('program/suspend/index.vue')
      },
      {
        path: '/program/oral',
        name: 'ProgramOral',
        meta: {
          title: '口语项目',
          auth: true,
          // cache: true
        },
        component: _import('program/oral/index.vue')
      },
      {
        path: '/program/jc_pro',
        name: 'ProgramJc_pro',
        meta: {
          title: '杰创项目',
          auth: true,
          // cache: true
        },
        component: _import('program/jc_pro/index.vue')
      },
      {
        path: '/program/internship_program',
        name: 'ProgramInternship_program',
        meta: {
          title: '实习项目',
          auth: true,
          // cache: true
        },
        component: _import('program/internship_program/index.vue')
      },
      {
        path: '/program/graduate',
        name: 'ProgramGraduate',
        meta: {
          title: '申研项目',
          auth: true,
          // cache: true
        },
        component: _import('program/graduate/index.vue')
      },
      {
        path: '/program/tutoring',
        name: 'ProgramTutoring',
        meta: {
          title: '辅导项目',
          auth: true,
          // cache: true
        },
        component: _import('program/tutoring/index.vue')
      },
      {
        path: '/program/supplementary',
        name: 'ProgramSupplementary',
        meta: {
          title: '补充协议模板',
          auth: true,
          // cache: true
        },
        component: _import('program/supplementary/index.vue')
      },
      /* ---  项目管理 end --- */
      // 文件
      {
        path: '/file/preview',
        name: 'FilePreview',
        meta: {
          title: '文件预览',
          auth: true
        },
        component: _import('file/preview')
      },
      {
        path: '/file/preview2',
        name: 'FilePreview2',
        meta: {
          title: '视频预览',
          auth: true
        },
        component: _import('file/preview2')
      },
      // 系统 前端日志
      {
        path: '/log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: '/refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: '/redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
