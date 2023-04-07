/*
 * @Author: 杨曦
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 09:57:58
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  eventList (data = {}) {
    return axios.get('user/eventList', {
      params: data
    })
  },
  delEventList (pkId) {
    return axios.delete(`/user/event?pkId=${pkId}`)
  },
  uptEventList (data) {
    return axios.put('/user/event', data)
  },
  addEventList (data, userId) {
    return axios.post(`/user/event?userId=${userId}`, data)
  },
  getUserList (params = {}) {
    return axios.get('/user/list', { params: params })
  },
  // 档案
  getUserFileListByUserId (userId) {
    return axios.get(`/user/${userId}/materials`)
  },
  // 档案
  setUserFileList (data) {
    return axios.post('/user/materials', data)
  },
  // 个人信息
  getUserDateByUserId (userId) {
    return axios.get(`/user/${userId}/info`)
  },
  setUser (data) {
    return axios.post('/user/info', data)
  },
  getPayWayListByUserId (userId) {
    return axios.get(`/user/${userId}/payments`)
  },
  setPayWay (data) {
    return axios.post('/user/payments', data)
  },
  // 获取里程碑
  getEventsListByUserId (userId) {
    return axios.get(`/user/${userId}/events`)
  },
  setEvents (data) {
    return axios.post('/user/events', data)
  },
  getLevelList (params) {
    return axios.get('/wst/level', { params: params })
  },
  setLevel (data) {
    return axios.post('/wst/level', data)
  },
  // 面试列表
  getInterviewList (params) {
    return axios.get('/user/interviewee', { params: params })
  },
  getInterviewListNew (params) {
    return axios.get('/interviewee/intervieweeList', { params: params })
  },
  // 面试详情
  getIntervieweeDetailById (intervieweeId) {
    return axios.get(`/user/${intervieweeId}/interviewee`)
  },
  // hr 面试员工详情
  getIntervieweeDetailNewById (intervieweeId) {
    return axios.get(`/interviewee/interviewee?intervieweeId=${intervieweeId}`)
  },
  setIntervieweeDetail (data) {
    return axios.post('/user/interviewee', data)
  },
  // 修改求职者信息
  setIntervieweeDetailNew (data) {
    return axios.put('/interviewee/interviewee', data)
  },
  // 新增求职者信息
  addIntervieweeDetailNew (data) {
    return axios.post('/interviewee/interviewee', data)
  },
  // 薪资
  getSalaryList (params) {
    return axios.get('/user/salaryList', { params: params })
  },
  setSalary (data) {
    return axios.post('/user/salary', data)
  },
  // 获取office缴纳五险一金比例
  getRate () {
    return axios.get('/user/office/rate')
  },
  setRate (data) {
    return axios.put('/user/office/rate', data)
  },
  setIntervieweeActive (data) {
    return axios.put('interviewee/arrive', data)
  },
  // 录用，正式成为WST员工
  toBeWSTOnes (intervieweeId) {
    return axios.put(`/user/${intervieweeId}/hire`)
  },
  // 评估列表
  getEvaluateList (params) {
    return axios.get('user/evaluateList', { params: params })
  },
  setEvaluateItem (data) {
    return axios.post('/user/evaluate', data)
  },
  checkUserAcc (userAcc) {
    return axios.get('/login/chkUserAcc', { params: { userAcc: userAcc } })
  },
  verifyAccessToken (key) {
    return axios.get('/system/verifyAccessToken', { params: { accessToken: key } })
  },
  interviewToBeWorker (intervieweeId, arriveDate) {
    return axios.put(`/user/${intervieweeId}/arrive?arriveDate=${arriveDate}`)
  },

  // 获取假期列表
  getVacationList (params) {
    return axios.get('/user/vacation', { params: params })
  },
  // 编辑年假
  setVacationItem (data) {
    return axios.post('/user/vacation', data)
  },
  getUserSummary () {
    return axios.get('/user/summary')
  },
  getInterviewerList (intervieweeId) {
    return axios.get(`/interviewee/interviewer?intervieweeId=${intervieweeId}`)
  },
  editInterviewerList (data) {
    return axios.put('/interviewee/interviewer', data)
  },
  applyInterview (data) {
    return axios.post('/apply/commApply', data)
  },
  //  获取用户支付方式
  getPaymentList (userId) {
    return axios.get(`/user/payment?userId=${userId}`)
  },
  // 新增用户银行卡信息
  addPaymentList (data) {
    return axios.post('/user/payment', data)
  },
  // 修改用户账户信息
  editPaymentList (data) {
    return axios.put('/user/payment', data)
  },
  // 删除用户账户信息
  delPaymentList (paymentAcc) {
    return axios.delete(`/user/payment?paymentAcc=${paymentAcc}`)
  },
  //  获取用户支付方式
  getSalaryDeduct (salaryId) {
    return axios.get(`/user/salary/deduct?salaryId=${salaryId}`)
  },
  //  获取用户课时情况
  getUserTokenArr () {
    return axios.get('/user/tokenArr')
  },
  // 更新crm用户录播直播token
  upDateTokenArr (data) {
    return axios.post('/user/tokenArr', data)
  },
  getPosition (userId) {
    return axios.get(`/user/position?userId=${userId}`)
  },
  delPosition (pkId) {
    return axios.delete(`/user/position?pkId=${pkId}`)
  },
  addPosition (data) {
    return axios.post('/user/position', data)
  },
  editPosition (data) {
    return axios.put('/user/position', data)
  }
}
