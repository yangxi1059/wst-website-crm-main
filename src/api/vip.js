/*
 * @Author: kaan
 * @Date: 2021-11-15 16:06:43
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-10 16:05:09
 * @Version:
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  getMentorList (data = {}) {
    return axios.get('mentor/list', {
      params: data
    })
  },
  getMentorList2 (data = {}) {
    return axios.get('mentor/list2', {
      params: data
    })
  },
  setMentorData (data) {
    return axios.post('/mentor/info', data)
  },
  setMentorDataTask (data) {
    return axios.put('/mentor/entry/task/info', data)
  },
  getPayWayListByMentorId (mentorId, payStatus) {
    return axios.get(`/mentor/${mentorId}/payment/list`, {
      params: {
        pageNum: 1,
        pageSize: 10000,
        payStatus: payStatus ? '0' : ''
      }
    })
  },
  getCooperatorPaymentListByCooperatorIdNew (userId) {
    return axios.get(`/paymentAccount/list?userId=${userId}`)
  },
  setPayWayOnMentorId (mentorId, data) {
    return axios.post(`mentor/${mentorId}/payment/tableData`, data)
  },
  getMentorListByOrderId (orderId) {
    return axios.get(`/order/${orderId}/mentorList`)
  },
  getMentorListBySignIdset (signId) {
    return axios.get(`/sign/${signId}/mentorList`)
  },
  getHourListBySignId (signId) {
    return axios.get(`/sign/${signId}/mentorLessonInfo`)
  },
  setMentorListBySignId (data) {
    return axios.post('/sign/mentor', data)
  },
  getProgramList (data) {
    return axios.get('/sign/list', {
      params: data
    })
  },
  setProgramMontor (data) {
    return axios.post('/order/mentor', data)
  },
  getLessonListByOrderId (orderId) {
    return axios.get(`/order/${orderId}/lessonList`, {
      params: {
        pageNum: 1,
        pageSize: 10000
      }
    })
  },
  setLesson (data) {
    return axios.post('/sign/lesson', data)
  },
  getCourseListBySignId (signId, params) {
    return axios.get(`/sign/${signId}/lessonList`, {
      params: params
    })
  },
  getCourseListBySignIdByType (signId, lessonType) {
    return axios.get(`/sign/${signId}/lessonInfo?lessonType=${lessonType}`)
  },
  // 获取面试/offer列表
  getOfferListByOrderId (orderId, resultType) {
    return axios.get(`/order/${orderId}/resultList`, {
      params: {
        resultType: resultType
      }
    })
  },
  // // 获取面试/offer列表
  // setOfferListByOrderId(orderId, data) {
  //     return axios.post(`/order/${orderId}/saveResult`, data)
  // },
  setOfferListBySignId (signId, data) {
    return axios.post(`/sign/${signId}/saveResult`, data)
  },
  setOfferV2ListBySignId (data) {
    return axios.put('/sign/v2/result/check', data)
  },
  // 实习单位列表
  getInternshipList () {
    return axios.get('/program/internshipList', {
      params: {
        pageNum: 1,
        pageSize: 10000
      }
    })
  },
  setInternshipData (data) {
    return axios.post('/order/internship', data)
  },
  // 保存简历
  setMenteeData (data) {
    return axios.post('/mentee/info2', data)
  },
  // 获取学生列表
  getMenteeListByMentorId (mentorId) {
    return axios.get(`/mentor/${mentorId}/menteeSignList`, {
      params: {
        pageNum: 1,
        pageSize: 10000
      }
    })
  },
  // 获取学生列表
  getMenteeList (params) {
    return axios.get('mentee/signList', {
      params: params
    })
  },
  // 获取导师佣金列表
  getPaymentRecordListByMentorId (mentorId, menteeId = '') {
    return axios.get(`/mentor/${mentorId}/paymentRecordList`, {
      params: {
        pageNum: 1,
        pageSize: 10000,
        menteeId: menteeId
      }
    })
  },
  // 支付与确认行业导师的酬金支付
  setMentorPayment (data) {
    return axios.put('/apply/mentorPayment/pay', data)
  },
  uptPayType (data) {
    return axios.put('/mentor/apply/uptPayType', data)
  },
  // 导师酬金支付申请
  addMentorPayment (data) {
    return axios.post('/apply/mentorPayment', data)
  },
  // 获取某用户的申请列表
  getApplyListByUserId (userId, params) {
    return axios.get(`/apply/${userId}/applyList`, {
      params: params
    })
  },
  // 取消某个申请
  cancelApplyByApplyId (applyId) {
    return axios.put(`/apply/${applyId}`)
  },
  // 获取某一条申请记录详情
  getApplyDetailByApplyId (applyId) {
    return axios.get(`/apply/${applyId}`)
  },
  // 获取某用户待审核的列表
  getApproveListByApplyId (userId, params) {
    return axios.get(`/apply/${userId}/approveList`, {
      params: params
    })
  },
  // 审核行业导师酬金支付申请
  setApproveMentorPayment (data) {
    return axios.put('/apply/mentorPayment', data)
  },
  // 支付错误申请
  errorApproveMentorPayment (data) {
    return axios.put('/apply/pay/error', data)
  },
  // 获取某导师提交的所有offer列表
  getAuditOfferList (params) {
    return axios.get('/sign/resultCheckList', {
      params: params
    })
  },
  // 获取某导师提交的课程反馈列表
  getLessonFeedBackList (params) {
    return axios.get('/mentor/feedbackList', {
      params: params
    })
  },
  // 获取课程反馈列表
  getLessonFeedBackList2 (params) {
    return axios.get('/sign/lessonFeedBackList', {
      params: params
    })
  },
  // 获取某导师提交的课程反馈列表
  getCashierList (params) {
    return axios.get('/apply/pay', {
      params: params
    })
  },
  // 获取某导师的历史任职公司列表
  getHistoryCompanyListByMentorId (mentorId) {
    return axios.get('/mentor/companyHistory', {
      params: {
        mentorId: mentorId
      }
    })
  },
  // 获取VIP用户列表
  getVIPList () {
    return axios.get('/user/VIPList')
  },
  // 获取学员购买信息
  getMenteeDataByMenteeIdVip (menteeId) {
    return axios.get(`/sign/info/${menteeId}`)
  },
  // 更新签约信息：VIP,目标,实习
  updatedSignEdit (data) {
    return axios.put('/sign/edit', data)
  },
  waiveSignEdit (data) {
    return axios.post('/sign/internship/waive', data)
  },
  // 获取成就列表
  getResultList (signId, params) {
    return axios.get(`/sign/${signId}/resultList`, {
      params: params
    })
  },
  // 保存成就（offer,面试）
  setResultList (signId, data) {
    return axios.post(`/sign/${signId}/saveResult`, data)
  },
  // 一览
  getSummaryBySignId (signId) {
    return axios.get(`/sign/${signId}/summary`)
  },
  // 更换实习
  updatedInternship (data) {
    return axios.post('/sign/internship', data)
  },
  // 退款。获取项目
  getProgramListByOrderId (orderId) {
    return axios.get(`order/${orderId}/programList`, {
      params: {
        pageNum: '1',
        pageSize: '10000'
      }
    })
  },
  getProgramListByOrderIdNew (orderId) {
    return axios.get(`/apply/init/signRefund?orderId=${orderId}`)
  },
  setAuditRefund (data) {
    return axios.put('/apply/commAudit', data)
  },
  // 获取offer、面试公司列表
  getCompanyList () {
    return axios.get('/dic/companyDropdown')
  },
  // 获取用户管辖部门、成员，以树形式展现
  getUserList () {
    return axios.get('/group/managed')
  },
  // 线上转线下
  onLineToOffLine (signId) {
    return axios.get(`/order/${signId}/convert`)
  },
  // 获取线上签约路径
  getSignUrlByOrderId (orderId) {
    return axios.get(`/order/${orderId}/eSignUrl`)
  },
  // 获取订单详情
  getOrderDataByOrderId (orderId) {
    return axios.get(`/order/${orderId}/detail`)
  },
  // 获取订单详情(返佣)
  getOrderRebateByOrderId (orderId) {
    return axios.get(`/order/${orderId}/detailForRevenue`)
  },

  getPretalkDefault (pretalkId) {
    return axios.get(`/pretalk/payment/default?pretalkId=${pretalkId}`)
  },
  // 创建通用支付接口
  setApplyPay (data) {
    return axios.put('/apply/commPay', data)
  },
  setApplyPayV2 (data) {
    return axios.post('/apply/commPay/v2', data)
  },
  // 获取导师列表通过导师全名
  searchMentorByMentorName (params) {
    return axios.get('/mentor/search', { params: params })
  },
  // 获取导师信息通过导师ID
  getMentorDetailById (mentorId = '') {
    return axios.get(`/mentor/${mentorId}`)
  },
  getMentorDetailBySignId (signId) {
    return axios.get(`/sign/${signId}/gpMentorList`)
  },
  // offer申请
  addOfferApply (data) {
    return axios.post('/apply/commApply', data)
  },
  // 获取出纳支付详情
  getPayDetailByPayId (payId) {
    return axios.get(`/apply/pay/${payId}`)
  },
  // 出纳列表
  getCopyToList (userId, params) {
    return axios.get(`/apply/${userId}/copyToList`, {
      params: params
    })
  },
  // 调休详情
  getUserLieuS (userId) {
    return axios.get(`/user/lieu/${userId}`)
  },
  // 获取假期
  getVacation (params) {
    return axios.get('/user/vacation', {
      params: params
    })
  },
  // 获取transition
  getTransitionByOrderId (orderId) {
    return axios.get(`/order/${orderId}/transition`)
  },
  setTransitionDetail (data) {
    return axios.put('/order/transition', data)
  },
  getSignList (params) {
    return axios.get('/sign/signArray', {
      params: params
    })
  },
  // 重新分配vip
  setSignListChange (vipType, data) {
    return axios.post(`/sign/${vipType}`, data)
  },
  // 导师佣金
  getSignLessonList (params) {
    return axios.get('/sign/lessonList', {
      params: params
    })
  },
  getMentorPayedByMentorId (mentorId) {
    return axios.get(`/mentor/${mentorId}/payLessonHours`)
  },
  // 导师佣金规则
  getPriceRuleList () {
    return axios.get('/mentor/compensationRuleList')
  },
  setPriceRuleList (data) {
    return axios.post('/mentor/compensationRule', data)
  },
  getPriceRuleDetailByRuleId (ruleId) {
    return axios.get(`/mentor/${ruleId}/compensationRuleInfo`)
  },
  setPriceRuleDetail (data) {
    return axios.post('/mentor/compensationRuleInfo', data)
  },
  // 拿汇率
  getRate (data = {}) {
    return axios.get('rate/lastRate', {
      params: data
    })
  },
  // 提交导师佣金申请
  applyMentorPay (data) {
    return axios.post('/apply/mentorPayment', data)
  },
  // 更新签约信息
  updateSignData (data) {
    return axios.post('/sign/program', data)
  },
  // 更新签约信息2
  updateSignData2 (data) {
    return axios.post('/sign/program2', data)
  },
  // 获取vip导师课程记录
  getVipLessonList (params) {
    return axios.get('/sign/vipLesson', {
      params: params
    })
  },
  // 获取学员列表（问卷）
  getMenteeListInQuestion (params) {
    return axios.get('/mentee/cardList', {
      params: params
    })
  },
  // 获取某学员的目标列表
  getMenteeTargetListByMenteeId (menteeId) {
    return axios.get(`/mentee/${menteeId}/card`)
  },
  // 获取问卷答案
  getMenteeAnswerByAnswerId (answerId) {
    return axios.get(`/questionnaire/answer/${answerId}`)
  },
  // 获取行业导师酬金出账/支付记录
  getMentorPayList (params) {
    return axios.get('/apply/pay/mentorPayment', {
      params: params
    })
  },
  // 获取签约列表 课程信息 已支付 待确认
  getLessonListUnConfirm (params) {
    return axios.get('/sign/lessonListUnConfirm', {
      params: params
    })
  },
  // 获取导师批量出纳列表
  getMentorPaySList (params) {
    return axios.get('/apply/pay/mentorBatchPayment', {
      params: params
    })
  },
  // 批量获取申请详情 -- 导师酬金类型,实习单位付款
  getApplyListByApplyIds (applyIds) {
    return axios.get(`/apply/batch/${applyIds}`)
  },
  getApplyListByApplyIdsNew (data) {
    return axios.post(`/apply/mentorBatchPay/init`, data)
  },
  recordMentorPayment (applyId) {
    return axios.put(`/apply/record/${applyId}`)
  },
  getProgramInternshipList (params) {
    return axios.get('/internship/programInternshipList', {
      params: params
    })
  },
  // 获取某个实习的学生
  getMenteeListByInternshipId (internshipId) {
    return axios.get(`/internship/${internshipId}/mentee`)
  },
  // 根据学员真实姓名查询学员信息及签约实习信息
  getMenteeListByMenteeName (menteeName) {
    return axios.get('/mentee/menteeName', {
      params: {
        menteeName: menteeName
      }
    })
  },
  // 实习单位的收款账户
  getPayListByInternshipId (internshipId) {
    return axios.get(`/internship/${internshipId}/payment`)
  },
  // 获取支付、待支付申请列表 （实习单位）
  getInternshipUnitPayCashier (params) {
    return axios.get('/apply/pay/internshipPayment', {
      params: params
    })
  },
  // 更改学生实习信息
  uptInternshipData (data) {
    return axios.put('/internship/sign', data)
  },
  // 实习单位付款，合并支付
  getInternshipUnitPayListCashier (params) {
    return axios.get('/apply/pay/internshipBatchPayment', {
      params: params
    })
  },
  // 排课-导师佣金支付记录
  getCoursePayedListBySignId (signId, params) {
    return axios.get(`/sign/${signId}/payLessonInfo`, {
      params: params
    })
  },
  // 获取所有课程信息与该学生绑定关系
  getMenteeCourseListByMenteeId (menteeId) {
    return axios.get(`/mentee/${menteeId}/course`)
  },
  // 绑定学生视频课程
  setMenteeCourseListByMenteeId (menteeId, data) {
    return axios.post(`/mentee/${menteeId}/course`, data)
  },
  createWebsiteAccountByMenteeId (menteeId, data) {
    return axios.post(`/mentee/${menteeId}/account`, data)
  },
  // 导师薪资确认
  getMentorPaymentExtraListUnConfirmList (params) {
    return axios.get('/apply/mentorPaymentExtraListUnConfirm', {
      params: params
    })
  },
  getMentorConfirmList (params) {
    return axios.get('/apply/mentorPaymentConfirmList', {
      params: params
    })
  },
  // 系统-更新数据-实习数据
  STSuptInternshipData (data) {
    return axios.post('/sign/uptInternship', data)
  },
  // 求职文书上传
  setApplicationLetter (data) {
    return axios.post('/sign/applicationLetter', data)
  },
  // 求职文书文件列表
  getLetterList (signId) {
    return axios.get(`/sign/${signId}/applicationLetter`)
  },
  getQuestionnaireList (params) {
    return axios.get('/questionnaire/list', {
      params: params
    })
  },
  setQuestion (cardId, questionnaireId) {
    return axios.put(`/mentee/${cardId}/questionnaire?questionnaireId=${questionnaireId}`)
  },
  getMenteeDetailByWxId (wxId) {
    return axios.get(`/mentee/wxId/${wxId}`)
  },
  setHistoryOffer (data) {
    return axios.post('/sign/hisOffer', data)
  },
  getHistoryOfferList (params) {
    return axios.get('/sign/hisOffer/list', {
      params: params
    })
  },
  resetPasswordByMenteeId (menteeId) {
    return axios.put(`/mentee/${menteeId}/resetPassword`)
  },
  getMenteeFileList (params) {
    return axios.get('/apply/applicationLetter', {
      params: params
    })
  },
  getFileMenteeListByMenteeName (menteeName) {
    return axios.get('/sign/signInfo', {
      params: {
        menteeName: menteeName
      }
    })
  },
  getMentorListByRedis (params) {
    return axios.get('/mentor/mentorByRedis', {
      params: params
    })
  },
  getAchievementMentorList (params) {
    return axios.get('/mentor/list', {
      params: params
    })
  },
  getCourseTreeByMenteeId (menteeId) {
    return axios.get(`/mentee/${menteeId}/courseTree`)
  },
  getSignLetterCounts (params) {
    return axios.get('/sign/count/letter', {
      params: params
    })
  },
  getVipLessonCounts (params) {
    return axios.get('/sign/count/vipLesson', {
      params: params
    })
  },
  getMenteePFileListByMenteeId (menteeId) {
    return axios.get(`/mentee/${menteeId}/menteeFile`)
  },
  setMenteePFile (data) {
    return axios.post('/mentee/menteeFile', data)
  },
  getMentorLessonHoursTotal (mentorId, params) {
    return axios.get(`/mentor/${mentorId}/countLesson`, {
      params: params
    })
  },
  getOfferEduList (params) {
    return axios.get('/sign/entranceOffer', {
      params: params
    })
  },
  getOfferEduList2 (params) {
    return axios.get('/dic/entranceOfferDropdown', {
      params: params
    })
  },
  setOfferEdu (data) {
    return axios.put('/sign/entranceOffer', data)
  },
  setOfferEduV2 (data) {
    return axios.put('/sign/v2/entranceOffer/check', data)
  },
  getHistoryOfferEduList (params) {
    return axios.get('/sign/offer/entrance/history/list', {
      params: params
    })
  },
  delHistoryOfferEdu (params) {
    return axios.delete('/sign/offer/entrance/history', {
      params: params
    })
  },
  addHistoryOfferEdu (data) {
    return axios.post('/sign/offer/entrance/history', data)
  },
  uptHistoryOfferEdu (data) {
    return axios.put('/sign/offer/entrance/history', data)
  },
  getMentorFileByMentorId (mentorId) {
    return axios.get(`/mentor/${mentorId}/mentorFile`, {
      params: {
        fileType: 'ALL'
      }
    })
  },
  addMentorFile (data) {
    return axios.post('/mentor/mentorFile', data)
  },
  delMentorFile (params) {
    return axios.delete('/mentor/mentorFile', {
      params
    })
  },
  uptMentorFile (data) {
    return axios.put('/mentor/mentorFile', data)
  },

  getAllBillByOrderId (orderId) {
    return axios.get(`/order/${orderId}/allBill`)
  },
  getbillList (id, data = {}) {
    return axios.get(`order/${id}/billList`, {
      params: data
    })
  },
  getNewsLetterList (params) {
    return axios.get('/newsletter/task/list', {
      params: params
    })
  },

  getNewsLetterByTaskId (taskId) {
    return axios.get('/newsletter/task', {
      params: {
        taskId: taskId
      }
    })
  },

  addNewsLetter (data) {
    return axios.post('/newsletter/task', data)
  },
  uptNewsLetter (data) {
    return axios.put('/newsletter/task', data)
  },

  delNewsLetter (taskId) {
    return axios.delete('/newsletter/task', {
      params: {
        taskId: taskId
      }
    })
  },

  getSeminarList (params) {
    return axios.get('/seminar/list', {
      params: params
    })
  },
  getSeminarById (seminarId) {
    return axios.get('/seminar/info', {
      params: {
        seminarId: seminarId
      }
    })
  },
  addSeminar (data) {
    return axios.post('/seminar/info', data)
  },
  uptSeminar (data) {
    return axios.put('/seminar/info', data)
  },
  delSeminar (seminarId) {
    return axios.delete('/seminar/info', {
      params: {
        seminarId: seminarId
      }
    })
  },
  getSeminarSessionList (params) {
    return axios.get('/seminar/sessionList', {
      params: params
    })
  },
  getSeminarSessionById (sessionId) {
    return axios.get('/seminar/session', {
      params: {
        sessionId: sessionId
      }
    })
  },
  addSeminarSession (data) {
    return axios.post('/seminar/session', data)
  },
  uptSeminarSession (data) {
    return axios.put('/seminar/session', data)
  },
  delSeminarSession (sessionId) {
    return axios.delete('/seminar/session', {
      params: {
        sessionId: sessionId
      }
    })
  },
  getApplyListBySessionId (sessionId) {
    return axios.get('/seminar/applyList', {
      params: {
        sessionId: sessionId
      }
    })
  },
  getNewsLetterReceiptByTaskId (taskId) {
    return axios.get('/newsletter/task/receipt', {
      params: {
        taskId: taskId
      }
    })
  },
  testSendNewsletter (taskId, data) {
    return axios.post(`/newsletter/task/sendMail?taskId=${taskId}`, data)
  },
  getFollowUpRule (params) {
    return axios.get('/mentee/followRule', {
      params: params
    })
  },
  getFollowUpList (userId) {
    return axios.get('/sign/followList', {
      params: {
        userId: userId
      }
    })
  },
  getFollowedUpList (signId) {
    return axios.get(`/sign/${signId}/followList`)
  },
  getNoFollowUpALLList (params) {
    return axios.get('/sign/unfollowList', {
      params: params
    })
  },
  getFollowedUpALLList (params) {
    return axios.get('/sign/followedList', {
      params: params
    })
  },
  subordinate (id, type = null) {
    return axios.get(`group/${id}/subordinate`, {
      params: {
        positionType: type
      }
    })
  },
  getVipFollowUpList (params) {
    return axios.get('/sign/followList', {
      params: params
    })
  },
  getMentorSignLesson (params, mentorId) {
    return axios.get(`/mentor/${mentorId}/signLessonList`, {
      params: params
    })
  },
  setOfferListCheck (data) {
    return axios.post('/sign/offer/check', data)
  },
  getOfferSchool (params) {
    return axios.get('/sign/result/schoolOfferCount', { params: params })
  },
  getOfferSchoolBySchoolId (params) {
    return axios.get('/sign/result/schoolOfferList', { params: params })
  },
  getMentorBatchPayment (params) {
    return axios.get('/apply/pay/mentorBatchPaymentByType', { params: params })
  },
  getMentorBatchPaymentBank (params) {
    return axios.get('/apply/pay/mentorBatchPaymentBank', { params: params })
  },
  getPraiseListBySignId (id) {
    return axios.get('/sign/praiseList', {
      params: {
        pageNum: 1,
        pageSize: 9999,
        signId: id
      }
    })
  },
  setMenteePraise (data) {
    return axios.put('/sign/praise', data)
  },
  getOfferCompany (params) {
    return axios.get('/sign/result/companyOfferCount', { params: params })
  },
  getOfferCompanyByCompanyId (params) {
    return axios.get('/sign/result/companyOfferList', { params: params })
  },
  getCasebookByEmail (email) {
    return axios.get('/sign/result/casebook', { params: { receiver: email } })
  },
  getVipDateData (params) {
    return axios.get('/sign/count', { params: params })
  },
  getVipBonus (params) {
    return axios.get('/mentor/bonus/offer', { params: params })
  },
  getVipBonusFile (params) {
    return axios.get('/mentor/bonus/careerLesson/export', { params: params })
  },
  getInterviewBonus (params) {
    return axios.get('/mentor/bonus/interview', { params: params })
  },
  getVipDeadlineData (params) {
    return axios.get('/sign/basicProgramDeadline', { params: params })
  },
  getVipFollowData (userId) {
    return axios.get(`/sign/followUpInfo?userId=${userId}`)
  },
  // getVipInterviewList (signId, params) {
  //   return axios.get(`/sign/${signId}/resultListWithApply`, {
  //     params: params
  //   })
  // },
  saveMenteeDownload (data) {
    return axios.post('/sign/download/offerSchool/log', data)
  },
  getMentorEntry (params) {
    return axios.get('/mentor/entry/application/list', { params: params })
  },
  getMentorEntryDetail (data) {
    return axios.get(`/mentor/entry/application?pkId=${data}`)
  },
  postPayNew (data) {
    return axios.post('/apply/pay', data)
  },
  hisInterviewSave (data) {
    return axios.post('/sign/hisInterview', data)
  },
  updateMentorPaymentDetail (data) {
    return axios.put('/apply/confirm/pay/mentorPayment', data)
  },
  getRequestData (params) {
    return axios.get('/requestingSystem/list', { params: params })
  },
  getRequestDataDetail (requestId) {
    return axios.get(`/requestingSystem/${requestId}/detail`)
  },
  getHistoryList (params) {
    return axios.get('/sign/hisInterview/list', { params: params })
  },
  /**
   * @description: 生成导师小程序注册页面小程序码
   * @param {*} mentorId 导师ID
   * @return {*}
   */
  getMentorQrCode (mentorId) {
    return axios.get('/mentor/qrCode', { params: { mentorId: mentorId } })
  },
  /**
   * @description: 审核导师自助申请
   * @param {*} data
   * @return {*}
   */
  mentorAudit (data) {
    return axios.put('/mentor/entry/application/audit', data)
  },
  /**
   * @description: 获取分配升学导师列表
   * @param {*} signId
   * @return {*}
   */
  getAcademicMentorList (signId) {
    return axios.get('/sign/academicMentor', { params: { signId: signId } })
  },
  /**
   * @description: 给签约分配升学导师
   * @param {*} data
   * @return {*}
   */
  saveAcademicMentor (data) {
    return axios.post('/sign/academicMentor', data)
  },
  editAcademicMentor (data) {
    return axios.put('/sign/academicMentor', data)
  },
  delAcademicMentor (pkId) {
    return axios.delete('/sign/academicMentor', { params: { pkId: pkId } })
  },
  /**
   * @description: 创建通用申请(升学导师佣金申请)
   * @param {*} data
   * @return {*}
   */
  saveCommApply (data) {
    return axios.post('/apply/commApply', data)
  },
  /**
   * @description: 匹配导师姓名（用以滤重
   * @param {*} search
   * @return {*}
   */
  matchName (search) {
    return axios.get('/mentor/matchName', { params: { search: search } })
  },
  /**
   * @description: 修改实习offer相关信息
   * @param {*} data
   * @return {*}
   */
  uptInternshipOffer (data) {
    return axios.put('/sign/uptInternshipOffer', data)
  },
  /**
   * @description: 导师推荐人下拉项(已推荐的导师人数大于1)
   * @param {*}
   * @return {*}
   */
  getReferrerDrop () {
    return axios.get('/mentor/referrerName/dropDown')
  },
  getReferrerList (data) {
    return axios.get('/mentor/referrer/list', { params: data })
  },
  getReferrerCount (data) {
    return axios.get('/mentor/referrer/count', { params: data })
  },
  getPaymentDefault (mentorId) {
    return axios.get(`/mentor/${mentorId}/payment/default`)
  },
  getPaymentDefaultNew (mentorId) {
    return axios.get(`paymentAccount/default?userId=${mentorId}`)
  },
  geInterviewCount (data) {
    return axios.get('/mentor/bonus/interview/count', { params: data })
  },
  geInterviewList (data) {
    return axios.get('/mentor/bonus/interview/list', { params: data })
  },
  /**
   * @description: 查询学生（签约项目）直播课程订阅情况
   * @param {*} data
   * @return {*}
   */
  getLiveHis (data) {
    return axios.get('/sign/live/subHis', { params: data })
  },
  /**
   * @description: 查询学生（签约项目）视频课程订阅情况
   * @param {*} data
   * @return {*}
   */
  getSeriesHis (data) {
    return axios.get('/sign/series/subHis', { params: data })
  },
  /**
   * @description: 查询学生（签约项目）一对多课程订阅情况
   * @param {*} data
   * @return {*}
   */
  getStrategistSessionHis (data) {
    return axios.get('/sign/officeHourStrategistSession/subHis', { params: data })
  },
  getJerryHour (data) {
    return axios.get('/sign/jerryOneOnOne/subHis', { params: data })
  },
  /**
   * @description: 删除一对一导师课程
   * @param {*} data
   * @return {*}
   */
  deleteCourse (lessonId) {
    return axios.delete(`/sign/1v1Lesson?lessonId=${lessonId}`)
  },
  /**
   * @description: 重置学员评价信息
   * @param {*} data
   * @return {*}
   */
  resetFeedback (lessonId) {
    return axios.put(`/lesson/resetFeedback?lessonId=${lessonId}`)
  },
  getNewsLetterByTaskId2 (pkId) {
    return axios.get('/newsletter/info', {
      params: {
        pkId: pkId
      }
    })
  },
  delNewsLetter2 (pkId) {
    return axios.delete('/newsletter/info', {
      params: {
        pkId: pkId
      }
    })
  },
  addNewsLetter2 (data) {
    return axios.post('/newsletter/info', data)
  },
  uptNewsLetter2 (data) {
    return axios.put('/newsletter/info', data)
  },
  getNewsLetterList2 (params) {
    return axios.get('/newsletter/list', {
      params: params
    })
  },
  delImgage (pkId) {
    return axios.delete('/newsletter/image', {
      params: {
        pkId: pkId
      }
    })
  },
  addImgage (data) {
    return axios.post('/newsletter/image', data)
  },
  editImgage (data) {
    return axios.put('/newsletter/image', data)
  },
  getImgage (params) {
    return axios.get('/newsletter/image/list', {
      params: params
    })
  },
  /**
   * @description: 获取课程列表
   * @param {*} params
   * @return {*}
   */
  getLessonList (params) {
    return axios.get('/lesson/lessonList', {
      params: params
    })
  },
  /**
   * @description: vip确认学员课程记录
   * @param {*} data
   * @return {*}
   */
  lessonConfirm (lessonId) {
    return axios.put(`/lesson/vip/confirm?lessonId=${lessonId}`)
  },
  /**
   * @description: 导师针对某学员的offer标记成无效
   * @param {*} mentorId
   * @param {*} resultId
   * @return {*}
   */
  editBonusStatus (mentorId, resultId) {
    return axios.put(`/mentor/bonus/offer/ignore?mentorId=${mentorId}&resultId=${resultId}`)
  },
  /**
   * @description: 导师针对某学员的无效offer取消标记，置为有效
   * @param {*} pkId
   * @return {*}
   */
  cancelIgnoreBonusStatus (pkId) {
    return axios.put(`/mentor/bonus/offer/cancelIgnore?pkId=${pkId}`)
  },
  /**
   * @description: 所有求职offer列表（包含历史offer）
   * @return {*}
   */
  getAllOfferSelect () {
    return axios.get('/sign/job/offers/init', {
      params: {
        pageNum: 1,
        pageSize: 10000
      }
    })
  },
  /**
   * @description: 所有求职offer列表（包含历史offer）下拉初始化
   * @param {*} params
   * @return {*}
   */
  getAllOfferList (params) {
    return axios.get('/sign/job/offers/list', {
      params: params
    })
  },
  /**
   * @description: 所有求职offer列表（包含历史offer）导出excel
   * @param {*} params
   * @return {*}
   */
  getOfferDownloadExcel (params) {
    return axios.get('/sign/job/offers/downloadExcel', {
      params: params
    })
  },
  /**
   * @description: 记录"其他运营费用"支付（同时生成申请记录，免审核）
   * @param {*} data
   * @return {*}
   */
  setOtherOperateCostPay (data) {
    return axios.post('/apply/otherOperateCostPay', data)
  },
  /**
   * @description: 验证自己是不是部门leader
   * @return {*}
   */
  verifyDeptLeader () {
    return axios.get('/user/verifyDeptLeader')
  },
  orderEntryRemindInfo (orderId) {
    return axios.get(`/order/orderEntryRemindInfo?orderId=${orderId}`)
  },
  /**
   * @description: 获取部门成员信息及部门level信息，用于调薪申请
   * @param {*} params
   * @return {*}
   */
  getMemberInfo (params) {
    return axios.get('/group/memberInfoForAdjustSalary', {
      params: params
    })
  },
  getApplicationLetterTask (params) {
    return axios.get('/sign/applicationLetterTask/list', {
      params: params
    })
  },
  editApplicationLetterTask (data) {
    return axios.put('/sign/applicationLetterTask', data)
  },
  addApplicationLetterTask (data) {
    return axios.post('/sign/applicationLetterTask', data)
  },
  detailApplicationLetterTask (taskId) {
    return axios.get(`/sign/applicationLetterTask?taskId=${taskId}`)
  },
  delApplicationLetterTask (taskId) {
    return axios.put(`/sign/applicationLetterTask/cancel?taskId=${taskId}`)
  },
  getApplicationLetterAr (taskId) {
    return axios.get(`/sign/applicationLetterTask/qrCode?taskId=${taskId}`)
  },
  getUptFeedback (params) {
    return axios.put('/lesson/uptFeedback', params)
  },
  getUptTransition (params) { return axios.put('/order/transition', params) },
  /**
   * @description: 获取学员列表
   * @param {*} data
   * @return {*}
   */
  getMenteeListVip (data = {}) {
    return axios({
      url: 'mentee/list/vip',
      method: 'get',
      params: data
    })
  },
  /**
   * @description: 获取学员详情
   * @param {*} data
   * @return {*}
   */
  getMenteeDetail (data = {}) {
    return axios({
      url: 'mentee/info/vip',
      method: 'get',
      params: data
    })
  },
  /**
   * @description: 导出学生课程进度Report
   * @param {*} signId
   * @return {*}
   */
  getSignSchedule (signId = '') {
    return axios({
      url: `/sign/report?signId=${signId}`,
      method: 'get'
    })
  },
  /**
   * @description: 根据学生签约项目课时返回课程分类数据
   * @param {*} data
   * @return {*}
   */
  getLessonType (data) {
    return axios({
      url: '/sign/mentee/vip/program/lessonTypeArr',
      method: 'get',
      params: data
    })
  },
  /**
   * @description: 获取学生签约项目的某一课程类型课表信息
   * @param {*} data
   * @return {*}
   */
  getLessonInfo (data) {
    return axios({
      url: '/sign/mentee/vip/program/lessonInfo',
      method: 'get',
      params: data
    })
  },
  /**
   * @description: 新建课程(行业导师/全职导师/口语/一对多Office Hour)
   * @param {*} data
   * @return {*}
   */
  addCourse (data = {}) {
    return axios({
      url: '/sign/1v1Lesson',
      method: 'post',
      data: data
    })
  },
  /**
   * @description: 签约-添加导师
   * @param {*} data
   * @return {*}
   */
  addMentor (data = {}) {
    return axios({
      url: '/sign/v2/mentor',
      method: 'post',
      data: data
    })
  },
  /**
   * @description: 签约-更新导师
   * @param {*} data
   * @return {*}
   */
  updateMentor (data = {}) {
    return axios({
      url: '/sign/v2/mentor',
      method: 'put',
      data: data
    })
  },
  /**
   * @description: 签约-删除导师
   * @param {*} data
   * @return {*}
   */
  delMentor (data = {}) {
    return axios({
      url: '/sign/v2/mentor',
      method: 'delete',
      params: data
    })
  },
  /**
   * @description: 修改课程(行业导师/全职导师/口语/一对多Office Hour)
   * @param {*} data
   * @return {*}
   */
  updateCourse (data) {
    return axios.put('/sign/1v1Lesson', data)
  },
  uptFeedback (data) {
    return axios.put('/lesson/uptFeedback', data)
  },
  /**
   * @description: vip follow抄送人
   * @param {*} data
   * @return {*}
   */
  userList (data = {}) {
    return axios.get('user/list', {
      params: data
    })
  },
  /**
   * @description: vip follow审核人
   * @param {*} data
   * @return {*}
   */
  getAuditorListByApplyType (applyType) {
    return axios.get('/apply/confirmor', {
      params: {
        applyType: applyType
      }
    })
  },
  /**
   * @description: 提交vip follow
   * @param {*} data
   * @return {*}
   */
  setFollowUp (data) {
    return axios.post('/sign/follow', data)
  },
  /**
   * @description: 提交vip follow
   * @param {*} data
   * @return {*}
   */
  getFollowInfoBySignId (signId) {
    return axios.get(`/sign/followInfoBySignId?signId=${signId}`)
  },
  /**
   * @description: 获取项目导师列表
   * @param {*} signId
   * @return {*}
   */
  getMentorListBySignId (signId) {
    return axios.get(`/sign/${signId}/msList`)
  },
  /**
   * @description: 课程申请
   * @param {*} data
   * @return {*}
   */
  setRefund (data) {
    return axios.post('/apply/commApply', data)
  },
  /**
   * @description: 初始化导师课程佣金申请
   * @param {*} data
   * @return {*}
   */
  getPaymentApply (data = {}) {
    return axios({
      url: '/sign/v2/mentor/initPaymentApply',
      method: 'get',
      params: data
    })
  },

  // 学生文件列表
  getMenteeFileListVip (params) {
    return axios.get('/mentee/fileList', { params })
  },
  // 新增学生文件
  addMenteeFile (data) {
    return axios.post('/mentee/file', data)
  },
  // 删除学生文件
  delMenteeFile (params) {
    return axios.delete('/mentee/file', {
      params
    })
  },
  // 更新学生文件
  uptMenteeFile (data) {
    return axios.put('/mentee/file', data)
  },
  /**
   * @description: 获取学员岗位投递列表
   * @param {*} params
   * @return {*}
   */
  getMenteeJobList (params) {
    return axios.get('/internalJob/menteeList', { params: params })
  },
  getMenteeJobListNew (params) {
    return axios.get('/internalJob/listForMenteeDeliver', { params: params })
  },
  // 获取学员岗位详情
  getMenteeJobDetail (jobId) {
    return axios.get(`/internalJob/${jobId}/info`)
  },
  addFollowUpRule (data) {
    return axios.post('/mentee/followRule', data)
  },
  // 新增follow规则
  applyInternalJob (data) {
    return axios.post('/internalJob/job/apply', data)
  },
  // 更新follow规则
  uptFollowUpRule (data) {
    return axios.put('/mentee/followRule', data)
  },
  // 学员账户列表（增删改查）
  getMenteePaymentList (menteeId, payStatus) {
    return axios.get(`/mentee/payment/list?menteeId=${menteeId}`)
  },
  postMenteePaymentList (data) {
    return axios.post('/mentee/payment', data)
  },
  putMenteePaymentList (data) {
    return axios.put('/mentee/payment', data)
  },
  delMenteePaymentList (pkId) {
    return axios.delete(`/mentee/payment/${pkId}`)
  },

  // 学员事件列表
  getMenteeEventArr (menteeId) {
    return axios.get(`/mentee/eventArr?menteeId=${menteeId}`)
  },
  /**
   * @description: 上传课表
   * @param {*} data
   * @return {*}
   */
  impLessonList (data = {}, lessonType) {
    return axios({
      url: `/lesson/impLessonList?lessonType=${lessonType}`,
      method: 'post',
      data: data
    })
  },

  /**
   * @description: 获取好评图列表
   * @param {*} data
   * @return {*}
   */
  getPraiseList (data = {}) {
    return axios({
      url: '/sign/v2/praise/list',
      method: 'get',
      params: data
    })
  },
  getVipInterviewList (signId) {
    return axios.get(`/sign/v2/offer/list?signId=${signId}`)
  },
  setVipList (signId) {
    return axios.get(`/sign/v2/vip/setting?signId=${signId}`)
  },
  getVipInterviewList2 (signId, params) {
    return axios.get(`/sign/${signId}/resultListWithApply`, {
      params: params
    })
  },
  setVipMentor (data = {}) {
    return axios({
      url: '/sign/v2/vip/setting',
      method: 'post',
      data: data
    })
  },
  // 获取组内vip列表
  getUserListByUserId (userId) {
    return axios.get(`/group/${userId}/subordinate`, {
      params: {
        positionType: 'strategist'
      }
    })
  },
  updateOfferDetail (data) {
    return axios.put('/sign/result', data)
  },
  /**
   * @description: 导师列表 V2
   * @param {*}
   * @return {*}
   */
  getMentorListV2 (data = {}) {
    return axios.get('mentor/list/v2', {
      params: data
    })
  },
  /**
   * @description: 导师详情 V2
   * @param {*}
   * @return {*}
   */
  getMentorDetailV2 (data = {}) {
    return axios.get('mentor/detail/v2', {
      params: data
    })
  },
  updateOfferDetail (data) {
    return axios.put('/sign/result', data)
  },
  /**
   * @description: VIP各项统计-个人
   * @param {*} data
   * @return {*}
   */
  getStatementPersonal (data = {}) {
    return axios.get('sign/statement/vip/personal', {
      params: data
    })
  },
  /**
   * @description: VIP各项统计-面经列表
   * @param {*} data
   * @return {*}
   */
  getStatementPersonalStoryList (data = {}) {
    return axios.get('sign/statement/vip/personal/storyList', {
      params: data
    })
  },
  /**
   * @description: VIP各项统计-升学Offer列表
   * @param {*} data
   * @return {*}
   */
  getStatementPersonalEntranceOfferList (data = {}) {
    return axios.get('sign/statement/vip/personal/entranceOfferList', {
      params: data
    })
  },
  /**
   * @description: VIP各项统计-求职Offer列表
   * @param {*} data
   * @return {*}
   */
  getStatementPersonalJobOfferList (data = {}) {
    return axios.get('sign/statement/vip/personal/jobOfferList', {
      params: data
    })
  },
  /**
   * @description: VIP各项统计-面试列表
   * @param {*} data
   * @return {*}
   */
  getStatementPersonalInterviewList (data = {}) {
    return axios.get('sign/statement/vip/personal/interviewList', {
      params: data
    })
  },
  /**
   * @description: VIP各项统计-导师面试
   * @param {*} data
   * @return {*}
   */
  getStatementPersonalInterviewMentorList (data = {}) {
    return axios.get('sign/statement/vip/personal/interviewMentorList', {
      params: data
    })
  },
  /**
   * @description: VIP各项统计-文书修改
   * @param {*} data
   * @return {*}
   */
  getStatementPersonalLetterModifyList (data = {}) {
    return axios.get('sign/statement/vip/personal/letterModifyList', {
      params: data
    })
  },
  getMenteeSettingDetail (data = {}) {
    return axios.get('mentee/information/setting', {
      params: data
    })
  },
  getMenteeSettingDetailV2 (data = {}) {
    return axios.get('mentee/information/setting/v2', {
      params: data
    })
  },
  getMenteeSubscribeList (data = {}) {
    return axios.get('mentee/information/list', {
      params: data
    })
  },
  /**
   * @description: 学员订阅信息详情
   * @param {*} data
   * @return {*}
   */
  getMenteeSubscribeDetail (data = {}) {
    return axios.get('mentee/information/detail', {
      params: data
    })
  },
  setMenteeSettingV2 (data = {}) {
    return axios({
      url: 'mentee/information/setting/v2',
      method: 'post',
      data: data
    })
  },
  vipRecommenderList (userId, fromDate, toDate, groupId) {
    return axios.get(`/mentee/vipRecommender/list?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}&groupId=${groupId}`)
  },
  getApplyList (data) {
    return axios.get('/applySeason/list', { params: data })
  },
  /**
   * @description: 申请季列表
   * @param {*} data
   * @return {*}
   */
  getWaivList () {
    return axios.get('/sign/internship/waive/list')
  },
  getAccessCodeList (data) {
    return axios.get('/accessCode/code/list', { params: data })
  },
  /**
   * @description: 申请季详情
   * @param {*} data
   * @return {*}
   */
  getApplyDetail (seasonId) {
    return axios.get('/applySeason/info', { params: { seasonId: seasonId } })
  },
  /**
   * @description: 新建申请季
   * @param {*} data
   * @return {*}
   */
  addApplySeason (data) {
    return axios.post('/applySeason/info', data)
  },
  /**
   * @description: 更新申请季
   * @param {*} data
   * @return {*}
   */
  editApplySeason (data) {
    return axios.put('/applySeason/info', data)
  },
  /**
   * @description: 删除申请季
   * @param {*} data
   * @return {*}
   */
  delApplySeason (seasonId) {
    return axios.delete('/applySeason/info', { params: { seasonId: seasonId } })
  },
  /**
   * @description: VIP 学员签约申请季列表
   * @param {*} signId
   * @return {*}
   */
  getSignApplyList (signId) {
    return axios.get('/sign/v2/applySeason', { params: { signId: signId } })
  },
  /**
   * @description: 学员设置申请季
   * @param {*} data
   * @return {*}
   */
  addSignApply (data) {
    return axios.post('/sign/v2/applySeason', data)
  },
  /**
   * @description: 删除学员签约申请季
   * @param {*} pkId
   * @return {*}
   */
  delSignApply (pkId) {
    return axios.delete('/sign/v2/applySeason', { params: { pkId: pkId } })
  },
  /**
   * @description: 更新申请季准备材料
   * @param {*} data
   * @return {*}
   */
  editSignApply (data) {
    return axios.put('/sign/v2/seasonPrepare', data)
  },
  getCheckLessons (data) {
    return axios.get('/lesson/signSchedule/list', { params: data })
  },
  getMenteeOrder (data) {
    return axios.get('/order/revenueOrderList', { params: data })
  },
  detailCheckLessons (pkId) {
    return axios.get(`/lesson/signSchedule/info?pkId=${pkId}`)
  },
  detailCheckLessonsBySignId (signId) {
    return axios.get(`/lesson/signScheduleBySignId?signId=${signId}`)
  },
  checkLessonsPut (data) {
    return axios.put('/lesson/signSchedule/check', data)
  },
  /**
   * @description: 申请季未设置的求职签约列表
   * @param {*} data
   * @return {*}
   */
  getApplySeasonNotSet (data) {
    return axios.get('/sign/v2/applySeasonNotSet/list', { params: data })
  },
  /**
   * @description: 学员申请季进展列表
   * @param {*} data
   * @return {*}
   */
  getApplySeasonProgress (data) {
    return axios.get('/sign/v2/applySeasonProgress/list', { params: data })
  },
  getSurvey (signId) {
    return axios.get(`/sign/survey?signId=${signId}`)
  },
  getSurveyQrCode (signId) {
    return axios.get(`/sign/survey/qrCode?signId=${signId}`)
  },
  /**
   * @description: 订单BD返佣申请初始化
   * @param {*} orderId
   * @return {*}
   */
  getBrokerage (orderId) {
    return axios.get('/apply/init/brokerage', { params: { orderId: orderId } })
  },
  getVipCreate (data) {
    return axios.get('/sign/v2/vip/setting/list', { params: data })
  },
  getAllot () {
    return axios.get('/sign//v2/vip/allot')
  },
  getInitLessonPaymentApplyForBatch (lessonType) {
    return axios.get('/lesson/initLessonPaymentApplyForBatch')
  },
  postInitLessonPaymentApplyForBatch (data) {
    return axios.post('/apply/lessonPaymentApplyForBatch', data)
  },
  getBookShelf (shelfId) {
    return axios.get(`book/shelf/detail?shelfId=${shelfId}`)
  },
  getBookDetail (bookId) {
    return axios.get(`/book/${bookId}/preview`)
  },
  getPaidArr (mentorId) {
    return axios.get(`/apply/paidArr/mentor?mentorId=${mentorId}`)
  },
  getBookSearch (data) {
    return axios.post('/book/search', data)
  },
  getInvitationCodeList (data = {}) {
    return axios.get('seminar/invitationCode/list', {
      params: data
    })
  },
  addInvitationCode (data) {
    return axios.post('seminar/invitationCode/batch', data)
  },
  getPayIdDetail (payId) {
    return axios.get(`/apply/pay/${payId}/detail`)
  },
  getInternshipListOffer (internship) {
    return axios.get(`/internship/${internship}/offer`)
  },
  getSubHisArr (signId) {
    return axios.get(`/sign/seminar/subHis?signId=${signId}`)
  },
  addAccessCode (data) {
    return axios.post('accessCode/code', data)
  },
  getAccessCodeTree () {
    return axios.get('/accessCode/code/crm/init')
  },
  getAccessCodeInfo (accessCode) {
    return axios.get(`/accessCode/code/${accessCode}/info`)
  },
  accessCodePut (data) {
    return axios.put('/accessCode/code', data)
  },
  getBookShare (bookId) {
    return axios.get(`/book/${bookId}/share`)
  },
  addDocking (data) {
    return axios.post('/mentor/entry/task', data)
  },
  dockingDetail (mentorId) {
    return axios.get(`/mentor/entry/task/detail?mentorId=${mentorId}`)
  },
  getDockingList (data = {}) {
    return axios.get('/mentor/entry/task/list', {
      params: data
    })
  },
  checkDocking (data) {
    return axios.put('/mentor/entry/task/chk', data)
  },
  submitDocking (data) {
    return axios.put('/mentor/entry/task', data)
  },
  getVipNumInit () {
    return axios.get('/mentee/vip/numInit')
  },
  getInternalJobList (data = {}) {
    return axios.get('/internalJob/provider/list', {
      params: data
    })
  },
  searchWxForCrtInternalJobDetail (wxId) {
    return axios.get(`/internalJob/provider/searchWxForCrt?wxId=${wxId}`)
  },
  getInternalJobDetail (providerId) {
    return axios.get(`/internalJob/provider?providerId=${providerId}`)
  },
  addInternalJob (data) {
    return axios.post('/internalJob/provider', data)
  },
  upDateInternalJob (data) {
    return axios.put('/internalJob/provider', data)
  },
  deleteInternalJob (providerId) {
    return axios.delete(`/internalJob/provider?providerId=${providerId}`)
  },
  getDeliverInternalJob (menteeId) {
    return axios.get(`/internalJob/mentee/deliver?menteeId=${menteeId}`)
  },
  getCalendarList (data = {}) {
    return axios.get('/mentee/netJob/calendar', {
      params: data
    })
  },
  getCalendarCharts (data = {}) {
    return axios.get('/mentee/netJob/calendar/statistics', {
      params: data
    })
  },
  getCalendarDate (calendarDate, menteeId) {
    return axios.get(`/mentee/netJob/calendar/${calendarDate}?menteeId=${menteeId}`)
  },
  getCalendarQrCode (menteeId) {
    return axios.get(`/mentee/netJob/calendar/qrCode?menteeId=${menteeId}`)
  },
  getCalendarListIndex (data = {}) {
    return axios.get('/internalJob/netApplication/calendar', {
      params: data
    })
  },
  getCalendarDateIndex (calendarDate) {
    return axios.get(`/internalJob/netApplication/calendar/${calendarDate}`)
  },
  getNetJobIdIndex (netJobId) {
    return axios.get(`/internalJob/netApplication?netJobId=${netJobId}`)
  },
  getCooperatorPaymentListByCooperatorIdNew (userId) {
    return axios.get(`/paymentAccount/list?userId=${userId}`)
  },
  updateMentorHoursAll (data) {
    return axios.put('/sign/v2/mentorList', data)
  },
  updateInappropriate (data) {
    return axios.put('/mentee/netJob/calendar/inappropriate', data)
  },
  getMentorSearch (mentorName) {
    return axios.get(`/mentor/search?mentorName=${mentorName}`)
  },
}
