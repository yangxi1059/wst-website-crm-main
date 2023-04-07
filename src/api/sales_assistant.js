import axios from '@/plugin/axios'

export default {
  subordinate (id, type = null) {
    return axios.get(`group/${id}/subordinate`, {
      params: {
        positionType: type
      }
    })
  },
  mentee_list (data = {}) {
    return axios.get('mentee/list/assistant', {
      params: data
    })
  },
  mentee_list_sales (data = {}) {
    return axios.get('mentee/list/sales', {
      params: data
    })
  },
  pretalk_feedback (data = {}) {
    return axios.get('/pretalk/mentee/sales/feedback', {
      params: data
    })
  },
  sourceForm_feedback (data = {}) {
    return axios.get('/mentee/sales/sourceFormfeedback', {
      params: data
    })
  },
  toPretalkFeedback (data = {}) {
    return axios.post('/pretalk/feedback', data)
  },
  mentors (id) {
    return axios.get(`mentee/${id}/mentors`)
  },
  wxId (wxId) {
    return axios.get(`mentee/wxId/${wxId}`)
  },
  school (data = {}) {
    return axios.get('school/list', {
      params: data
    })
  },
  dicDropdown (data = {}) {
    return axios.post('dic/dicDropdown', data)
  },
  allocateHisList (data = {}) {
    return axios.get('mentee/counselor/allocateHis', {
      params: data
    })
  },
  menteeTable (data = {}) {
    return axios.post('mentee/menteeTable', data)
  },
  mentee_info (data = {}) {
    return axios.post('mentee/info', data)
  },
  ossStsToken () {
    return axios.get('system/ossStsToken')
  },
  mentee_info2 (data = {}) {
    return axios.post('mentee/info2', data)
  },
  getSignList (data = {}) {
    return axios.get('sign/list', {
      params: data
    })
  },
  crtSign (data = {}) {
    return axios.post('sign/info', data)
  },
  uptSign (data = {}) {
    return axios.put('sign/info', data)
  },
  crtSign2 (data = {}) {
    return axios.post('sign/info2', data)
  },
  uptSign2 (data = {}) {
    return axios.put('sign/info2', data)
  },
  deleteMenteeByMenteeId (data = {}) {
    return axios.post('/mentee/info2', data)
  },
  getRate (data = {}) {
    return axios.get('rate/lastRate', {
      params: data
    })
  },
  getbillList (id, data = {}) {
    return axios.get(`order/${id}/billList`, {
      params: data
    })
  },
  saveFinancial (data = {}) {
    return axios.post('order/billExcelData', data)
  },
  saveExcelData (data = {}) {
    return axios.post('sign/signTable', data)
  },
  signbillList (data = {}) {
    // return axios.get(`order/billList`, {老版
    return axios.get('apply/billList', {
      params: data
    })
  },
  // 入账审核
  signbillInfo (data = {}) {
    return axios.put('sign/bill/audit', data)
  },
  // 获取项目列表
  getProgramList (data = {}) {
    return axios.get('program/list', {
      params: data
    })
  },
  // 预览合同
  preview (data = {}) {
    return axios.post('sign/preview', data)
  },
  // 修改合同：拿原合同数据
  edit (data = {}) {
    return axios.post('sign/edit', data)
  },
  // 通过signId拿合同列表
  getContractByOrderId (orderId) {
    return axios.get(`/sign/${orderId}/contract`)
  },
  // 保存签约记录的合同（新增、修改、删除）
  addContract (data) {
    return axios.post('/sign/contract', data)
  },
  // 创建签约在线签约
  createOnlineContract (data) {
    return axios.post('/order/sign/online', data)
  },
  // 创建线下签约
  createOfflineContract (data) {
    return axios.post('/order/sign/offline', data)
  },
  // 生成在线签约url
  createOnlineURL (signId) {
    return axios.get(`/sign/${signId}/refreshSignUrl`)
  },
  // 获取工作人员-类型
  userList (data = {}) {
    return axios.get('user/list', {
      params: data
    })
  },
  // 汇率
  lastRate () {
    return axios.get('/rate/lastRate')
  },
  // 线上转线下
  onLineToOffLine (signId) {
    return axios.get(`/order/${signId}/convert`)
  },
  // 获取线上签约路径
  getSignUrlByOrderId (orderId) {
    return axios.get(`/order/${orderId}/eSignUrl`)
  },
  // 微信号列表
  getOfficialAccountList (data) {
    return axios.get('officialAccount/list', {
      params: data
    })
  },
  // 获取微信号分配历史
  getAccountHistoryListByAccountId (accountId) {
    return axios.get(`officialAccount/${accountId}/history`)
  },
  // 获取微信号详情
  getAccountDetailByAccountId (accountId) {
    return axios.get(`officialAccount/${accountId}`)
  },
  // 更新导流微信号
  updateAccount (data) {
    return axios.put('officialAccount/record', data)
  },
  // 更新导流号所有者
  updateAccountManager (data) {
    return axios.post('officialAccount/manage', data)
  },
  // 创建导流微信号
  createAccount (data) {
    return axios.post('officialAccount/record', data)
  },
  // 获取凭证列表
  getSignListByBillId (billId) {
    return axios.get(`order/${billId}/voucher`)
  },
  // 获取凭证列表
  getSignListByapplyId (applyId) {
    return axios.get(`apply/${applyId}/voucher`)
  },
  // 提交凭证
  addvoucher (data) {
    return axios.post('/order/voucherInfo', data)
  },
  // 拿项目信息，通过项目id
  getProgramById (programId) {
    return axios.get(`/program/${programId}`)
  },
  // 实习单位列表
  getInternshipList () {
    return axios.get('/program/internshipList', { params: { pageNum: 1, pageSize: 10000 } })
  },
  // 获取入账账户列表（货币类型）
  getAccountList (type) {
    return axios.get('/finance/accountList', { params: { pageNum: 1, pageSize: 10000, currencyType: type } })
  },
  // 获取订单列表
  getOrderList (data,data2) {
    return axios.post(`/order/signList?pageNum=${data.pageNum}&pageSize=${data.pageSize}&search=${data.search}&pageType=${data.pageType}&userId=${data.userId}&sortCol=${data.sortCol}&sort=${data.sort}`, data2)
  },
  // 获取项目列表，通过订单Id
  getProgramListByOrderId (orderId) {
    return axios.get(`order/${orderId}/programList`, { params: { pageNum: 1, pageSize: 10000 } })
  },
  // 获取入账列表，通过订单Id
  getBillListByOrderId (orderId) {
    return axios.get(`/order/${orderId}/allBill`, { params: { pageNum: 1, pageSize: 10000 } })
  },
  // 编辑入账
  setBillItem (data) {
    return axios.post('/order/billInfo', data)
  },
  // 删除订单
  deleteOrderByOrderId (orderId) {
    return axios.delete(`/order/${orderId}`)
  },
  // 更新订单内项目信息
  uptProgramDate (data) {
    return axios.post('/sign/signTable', { signDataForUpt: data })
  },
  // 更新入账数据
  uptBillList (data) {
    return axios.post('/order/billExcelData', data)
  },
  // 数据
  getFollowUpMenteeIdListByUserId (data) {
    return axios.get('/mentee/followUpList', { params: data })
  },
  // 数据
  getFollowUpListData (menteeId, data) {
    return axios.get(`/mentee/${menteeId}/followUpList`, { params: data })
  },
  // 提交followUp数据
  setFollowUp (data) {
    return axios.post('/mentee/followUp', data)
  },
  // 提交followUp数据
  assistantSetFollowUp (data) {
    return axios.post('/mentee/assistant/followUp', data)
  },
  // 更新入账数据
  getUserList (data) {
    return axios.get('/user/dropdown', { params: { pageNum: 1, pageSize: 10000, positionType: data } })
  },
  // //获取订单列表 旧
  // getOrderListByMenteeId(menteeId) {
  //     return axios.get(`/order/${menteeId}/orderList`)
  // },
  // 获取订单列表 新
  getOrderListByMenteeId (menteeId) {
    return axios.get(`/order/${menteeId}/orderForSign`)
  },
  // 获取订单列表
  getOrderListbyWxId (wxId) {
    return axios.get(`/mentee/${wxId}/signList`)
  },
  // 获取订单信息（订单id）
  getOrderDataByOrderId (orderId) {
    return axios.get(`/order/${orderId}`)
  },
  // 获取学员信息（）
  getMenteeDataByMenteeId (menteeId) {
    return axios.get(`/mentee/${menteeId}/info`)
  },
  // 获取在线签约合同内公司列表
  getSignCompanyList () {
    return axios.get('/order/esignCompanyList')
  },
  // 获取项目类型项目总金额
  getSignBillAccount (programType) {
    return axios.get(`/statement/program/price?programType=${programType}`)
  },
  // 获取送出礼物列表
  getGiftSendList (datee = [], isSend = '') {
    return axios.get('/gift/orderList', { params: { fromDate: datee[0], toDate: datee[1], isSend: isSend } })
  },
  // 获取未按时followUp报表
  getNofollowList (params) {
    return axios.get('/mentee/unFollowUp', { params: params })
  },
  // 获取followUp记录列表
  getFollowedUpList (params) {
    return axios.get('/mentee/followedList', { params: params })
  },
  // 获取订单详情
  getOrderDetailByOrderId (orderId) {
    return axios.get(`/order/${orderId}/detail`)
  },
  // 更改礼物
  uptGift (orderId, data) {
    return axios.put(`/order/${orderId}/gift`, data)
  },
  // 送出礼物
  sendOutGift (data) {
    return axios.put('/gift/sendGift', data)
  },
  // 获取下拉框数据
  getSelectUserList (position) {
    return axios.get('/user/listByPosition', { params: { position: position } })
  },
  // 创建入账申请
  setCommApply (data) {
    return axios.post('/apply/commApply', data)
  },
  // 公用审核
  setCommAudit (data) {
    return axios.put('/apply/commAudit', data)
  },
  // 获取某一条申请记录详情
  getApplyDetailByApplyId (applyId) {
    return axios.get(`/apply/${applyId}`)
  },
  // 获取follow up也列表数据
  getFollowUpList (params) {
    return axios.get('/mentee/followUpListInfo', { params: params })
  },
  // 获取销售follow up列表数据
  getFollowUpListSales (params) {
    return axios.get('/mentee/salesFollowUpList', { params: params })
  },
  getFollowUpListSalesAssistant (params) {
    return axios.get('/mentee/assistantFollowUpList', { params: params })
  },
  getSignDetailBySignId (signId) {
    return axios.get(`/sign/${signId}`)
  },
  getMenteeListByWxId (wxId) {
    return axios.get('/mentee/wxId', { params: { wxId: wxId } })
  },
  getMenteeFamilyListSearch (search) {
    return axios.get('/mentee/family/search', { params: search })
  },
  getChannelList (params) {
    return axios.get('/channel/list', { params: params })
  },
  getChannelById (channelId) {
    return axios.get('/channel/info', { params: { channelId: channelId } })
  },
  addChannel (data) {
    return axios.post('/channel/info', data)
  },
  uptChannel (data) {
    return axios.put('/channel/info', data)
  },
  delChannelById (channelId) {
    return axios.delete('/channel/info', { params: { channelId: channelId } })
  },
  getSubChannelList (params) {
    return axios.get('/channel/sourceList', { params: params })
  },
  getRuleChannelList (sourceId) {
    return axios.get(`/channel/source/brokerage?sourceId=${sourceId}`)
  },
  editRule (data) {
    return axios.post('/channel/source/brokerage', data)
  },
  editRule2 (data) {
    return axios.put('/channel/source/brokerage', data)
  },
  getSubChannelById (sourceId) {
    return axios.get('/channel/source', { params: { sourceId: sourceId } })
  },
  addSubChannel (data) {
    return axios.post('/channel/source', data)
  },
  uptSubChannel (data) {
    return axios.put('/channel/source', data)
  },
  delSubChannelById (sourceId) {
    return axios.delete('/channel/source', { params: { sourceId: sourceId } })
  },
  delRuleById (pkId) {
    return axios.delete('/channel/source/brokerage', { params: { pkId: pkId } })
  },
  getAmbassadorSourceByName (name) {
    return axios.get('/ambassador/list', { params: { pageNum: 1, pageSize: 999, ambassadorStatus: '1', ambassadorType: '', manageBy: 'ALL_Data', search: name } })
  },
  getKol (name) {
    return axios.get('/kol/search', { params: { search: name } })
  },
  getCooperatorSourceByName (name) {
    return axios.get('/cooperator/list', { params: { pageNum: 1, pageSize: 999, manageBy: 'ALL_Data', search: name } })
  },
  getCooperatorSourceByNameFast (search) {
    return axios.get(`/cooperator/search?search=${search}`)
  },
  getInvoiceList (params) {
    return axios.get('/invoice/list', { params: params })
  },
  getInvoiceById (id) {
    return axios.get('/invoice/info', { params: { invoiceId: id } })
  },
  addInvoice (data) {
    return axios.post('/invoice/info', data)
  },
  uptInvoice (data) {
    return axios.put('/invoice/info', data)
  },
  getInvoiceDataByOrderId (orderId) {
    return axios.get(`/order/${orderId}/invoice`)
  },
  addInvoiceTitle (data) {
    return axios.post('/invoice/title', data)
  },
  uptInvoiceTitle (data) {
    return axios.put('/invoice/title', data)
  },
  uptSourceChannel (data) {
    return axios.put('/order/set/sourceChannel', data)
  },
  uptPretalk (data) {
    return axios.put('/order/set/pretalk', data)
  },
  applyInvoice (data) {
    return axios.post('/invoice/info', data)
  },
  getSalesList () {
    return axios.get('/mentee/allocate/counselor')
  },
  getSalesList2 () {
    return axios.get('/mentee/assistantEffectiveConsultingNum')
  },
  getSalesList3 () {
    return axios.get('/mentee/bdInfo')
  },
  getCounselor (dept) {
    return axios.get('/officialAccount/list/dept', { params: { dept: dept } })
  },
  getSalesListOnWork (params) {
    return axios.get('/user/list/sales', { params: params })
  },
  getSalesOverview2 (userId) {
    return axios.get(`/statement/sales/overview?userId=${userId}`)
  },
  getAllUserList (params) {
    return axios.get('/user/list', { params: params })
  },
  getSalesWeekly (params) {
    return axios.get('/user/weekday/schedule', { params: params })
  },
  uptSalesWeekly (data) {
    return axios.put('/user/weekday', data)
  },
  // 实习一览列表
  getInternshipListNew (params) {
    return axios.get('/internship/overview', {
      params: params
    })
  },
  getSalesCard () {
    return axios.get('/order/salesTipBoard')
  },
  getSalesKpiRevenue () {
    return axios.get('/group/salesKpiAndRevenue')
  },
  changeToNoeffective (menteeId, data) {
    return axios.post(`/mentee/effectiveConsulting?menteeId=${menteeId}`, data)
  },
  changeMenteeEffectiveStatus (pkId, data) {
    return axios.put(`/mentee/effectiveConsulting?pkId=${pkId}`, data)
  },
  checkEffectiveConsulting (data) {
    return axios.put('/mentee/checkEffectiveConsulting', data)
  },
  reChangeEffectiveStatus (menteeId, data) {
    return axios.put(`/mentee/reSetEffectiveConsulting?menteeId=${menteeId}`, data)
  },
  geteffectiveConsultingList (params) {
    return axios.get('/mentee/effectiveConsultingList', { params: params })
  },
  getSpyOrDeleteList (params) {
    return axios.get('/mentee/spyOrDeleteList', { params: params })
  },
  getSpyOrDelete (pkId) {
    return axios.put(`/mentee/spyOrDelete?pkId=${pkId}`)
  },
  spyDeleteConsulting (data) {
    return axios.put('/mentee/checkSpyOrDelete', data)
  },
  getSalesConversionRate (params) {
    return axios.get('/statement/salesConversionRate', { params: params })
  },
  getSalesGroupConversionRate (params) {
    return axios.get('/statement/salesGroupConversionRate', { params: params })
  },
  getVipRepurchase (params) {
    return axios.get('/statement/vipRepurchase', { params: params })
  },
  getSalesRepurchase (params) {
    return axios.get('/statement/salesRepurchase', { params: params })
  },
  getBdConsulting (params) {
    return axios.get('/statement/bdConsulting', { params: params })
  },
  getBdConsulting2 (params) {
    return axios.get('/statement/bdConsulting2', { params: params })
  },
  getHRstatement (params) {
    return axios.get('/statement/hr', { params: params })
  },
  getMenteeList (channelId, sourceId) {
    return axios.get(`/channel/mentee?sourceId=${sourceId}&channelId=${channelId}`)
  },
  getMenteeListNew (params) {
    return axios.get(`/channel/mentee/list`,{ params: params })
  },
  getOnlineAddress (orderId) {
    return axios.get(`/order/payment/url?orderId=${orderId}`)
  },
  getTemplateList (params) {
    return axios.get('/program/supplementary/template/list', { params: params })
  },
  delTemplateList (pkId) {
    return axios.delete(`/program/supplementary/template?pkId=${pkId}`)
  },
  addTemplate (data) {
    return axios.post('/program/supplementary/template', data)
  },
  infoTemplate (pkId) {
    return axios.get(`/program/supplementary/template/info?pkId=${pkId}`)
  },
  editTemplate (data) {
    return axios.put('/program/supplementary/template', data)
  },
  orderSupplementaryContract (data) {
    return axios.post('/apply/orderSupplementaryContract', data)
  },
  statementProgram (params) {
    return axios.get('/statement/program', { params: params })
  },
  orderTemplate (supplementaryType) {
    return axios.get(`/supplementary/template/enable?supplementaryType=${supplementaryType}`)
  },
  getPayUrl (orderId) {
    return axios.get(`/order/pay/url?orderId=${orderId}`)
  },
  /**
     * @description: 获取学员二次咨询记录列表
     * @param {*} menteeId
     * @return {*}
     */
  getConsultList (menteeId) {
    return axios.get('/mentee/consultList', { params: { menteeId: menteeId } })
  },
  /**
     * @description: 删除学员二次咨询记录内容
     * @param {*} menteeId
     * @return {*}
     */
  delConsultById (pkId) {
    return axios.delete('/mentee/consult', { params: { pkId: pkId } })
  },
  /**
     * @description: 保存学员二次咨询记录内容
     * @param {*} data
     * @return {*}
     */
  saveConsult (data) {
    return axios.post('/mentee/consult', data)
  },
  /**
     * @description: 激活学员
     * @param {*} data
     * @return {*}
     */
  activate (data) {
    return axios.post('/mentee/activate', data)
  },
  /**
     * @description: 获取本人及下属的今日待follow数量(销售)
     * @param {*}
     * @return {*}
     */
  getFollowUpSales () {
    return axios.get('/mentee/followUpOverview/sales')
  },
  /**
     * @description: 获取具体某销售今日需follow列表（分页
     * @param {*} params
     * @return {*}
     */
  getFollowUpListTodaySales (params) {
    return axios.get('/mentee/followUpList/sales', { params: params })
  },
  /**
     * @description: 获取本人及下属的今日待follow数量(销售助理)
     * @param {*}
     * @return {*}
     */
  getFollowUpAssistant () {
    return axios.get('/mentee/followUpOverview/assistant')
  },
  /**
     * @description: 获取具体某销售助理今日需follow列表（分页）
     * @param {*} params
     * @return {*}
     */
  getFollowUpListTodayAssistant (params) {
    return axios.get('/mentee/followUpList/assistant', { params: params })
  },
  getOverviewNotice () {
    return axios.get('/internship/overview/notice')
  },
  getCodeDetail (uniqueCode) {
    return axios.get(`/channel/uniqueCode?uniqueCode=${uniqueCode}`)
  },
  postOverviewNotice (data) {
    return axios.post('/internship/overview/notice', data)
  },
  delOverviewNotice () {
    return axios.delete('/internship/overview/notice')
  },
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
  /**
     * @description: 销售-数据分析，销售维度-总览
     * @param {*} fromDate
     * @param {*} toDate
     * @return {*}
     */
  getSalesOverview (fromDate, toDate) {
    return axios.get(`/statement/sales/person/overview?fromDate=${fromDate}&toDate=${toDate}`)
  },
  /**
     * @description: 销售-数据分析，销售维度-详情
     * @param {*} fromDate
     * @param {*} toDate
     * @param {*} userId
     * @return {*}
     */
  getSalesDetail (fromDate, toDate, userId) {
    return axios.get(`/statement/sales/person/detail?fromDate=${fromDate}&toDate=${toDate}&userId=${userId}`)
  },
  /**
     * @description: 销售-数据分析，学校维度-总览
     * @param {*} fromDate
     * @param {*} toDate
     * @param {*} schoolId
     * @return {*}
     */
  getSchoolOverview (fromDate, toDate, schoolId) {
    return axios.get(`/statement/sales/school/overview?fromDate=${fromDate}&toDate=${toDate}&schoolId=${schoolId}`)
  },
  /**
     * @description: 销售-数据分析，学校维度-详情
     * @param {*} fromDate
     * @param {*} toDate
     * @param {*} userId
     * @param {*} schoolId
     * @return {*}
     */
  getSchoolDetail (fromDate, toDate, userId, schoolId) {
    return axios.get(`/statement/sales/school/detail?fromDate=${fromDate}&toDate=${toDate}&userId=${userId}&schoolId=${schoolId}`)
  },
  getPretalkListByMenteeId (menteeId) {
    return axios.get(`/pretalk/pretalkListByMenteeId?menteeId=${menteeId}`)
  },
  saleHomeData(){
    return axios.get(`/kpi/sales/index`);
  },
  saleHomeBillList (params) {
    return axios.get('/kpi/sales/bill/list', { params: params })
  },
  /**
   * @description: 获取订单总体信息
   * @param {*} orderId
   * @return {*}
   */  
  getGeneralOrder (orderId) {
    return axios.get(`/order/${orderId}/general`)
  },
  /**
   * @description: 获取订单Pretalk返佣信息
   * @param {*} orderId
   * @return {*}
   */  
  getPretalkBrokerageOrder (orderId) {
    return axios.get(`/order/${orderId}/pretalkBrokerage`)
  },
  /**
   * @description: 订单BD返佣申请列表
   * @param {*} orderId
   * @return {*}
   */  
  getBdBrokerageOrder (orderId) {
    return axios.get(`/order/${orderId}/bdBrokerage`)
  },
  getSalesCharts (fromDate, toDate, programType) {
    return axios.get(`/statement/sales/program/overview?fromDate=${fromDate}&toDate=${toDate}&programType=${programType}`)
  },
  /**
   * @description: 初始化订单补录
   * @param {*} orderId
   * @return {*}
   */  
  getUpdateOrder (orderId) {
    return axios.get(`/order/${orderId}/initForUpdate`)
  },
  /**
   * @description: 补录订单信息
   * @param {*} data
   * @return {*}
   */  
  putUpdateOrder (data) {
    return axios.put('/order/update', data)
  },
  getSignListInite () {
    return axios.get(`/order/signList/init`)
  },
  getBDdata () {
    return axios.get(`/kpi/bd/index`)
  },
  getHomedata () {
    return axios.get(`/calendarDay/today`)
  },
  putUpTop (data) {
    return axios.put('/calendarDay/message', data)
  },
  putThumbsUpCount (messageId) {
    return axios.put(`/calendarDay/thumbsUp?messageId=${messageId}`)
  },
  postMessage (data) {
    return axios.post('/calendarDay/message', data)
  },
  delMessageList (messageId) {
    return axios.delete(`/calendarDay/message?messageId=${messageId}`)
  },
  getOrderSendHis (orderId) {
    return axios.get(`/invoice/order/voucher/list?orderId=${orderId}`)
  },
  delOrderSendHis (pkId) {
    return axios.delete(`/invoice/order/voucher?pkId=${pkId}`)
  },
  sendEmail (data) {
    return axios.post('/invoice/order/send', data)
  },
  uploadEmail (data) {
    return axios.post('/invoice/order/voucher', data)
  },
  sendEmailHistory (orderId) {
    return axios.get(`/invoice/order/sendHis?orderId=${orderId}`)
  },
  feedbackList (pretalkId) {
    return axios.get(`/pretalk/feedback/list?pretalkId=${pretalkId}`)
  },
  pretalkListMatch (data = {}) {
    return axios.get('/pretalk/list/match', {
      params: data
    })
  },
}
