/*
 * @Author: 库建华
 * @Date: 2020-01-13 18:36:13
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-27 11:33:29
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  getCooperatorList (params = {}) {
    return axios.get('/cooperator/list', {
      params: params
    })
  },
  getCooperatorV2List (params = {}) {
    return axios.get('/cooperator/v2/list', {
      params: params
    })
  },
  addCooperator (data) {
    return axios.post('/cooperator/info', data)
  },
  uptCooperator (data) {
    return axios.put('/cooperator/info', data)
  },
  getCooperatorPaymentListByCooperatorIdNew (userId) {
    return axios.get(`/paymentAccount/list?userId=${userId}`)
  },
  getCooperatorPaymentListByCooperatorId (cooperatorId) {
    return axios.get(`/cooperator/${cooperatorId}/payment`)
  },
  searchPaymentApplyList (mentorId) {
    return axios.get(`/mentor/apply/paymentApplyList?mentorId=${mentorId}`)
  },
  setCooperatorPayment (data) {
    return axios.post('/cooperator/payment', data)
  },
  uptCommonPaymentNew (data) {
    return axios.put('/paymentAccount', data)
  },
  setCommonPaymentNew (data) {
    return axios.post('/paymentAccount', data)
  },
  deleteCommonPaymentNew (accountId) {
    return axios.delete(`/paymentAccount/${accountId}`)
  },
  getActivityListByCooperatorId (cooperatorId) {
    return axios.get(`/cooperator/${cooperatorId}/activity`)
  },
  setCooperatorActivity (data) {
    return axios.post('/cooperator/activity', data)
  },
  getActivityPayApplyListByActivityId (activityId) {
    return axios.get(`/cooperator/${activityId}/apply`)
  },
  getContractByCooperatorId (cooperatorId) {
    return axios.get(`/cooperator/${cooperatorId}/contract`)
  },
  getContractByCooperatorIdV2 (cooperatorId) {
    return axios.get(`/cooperator/${cooperatorId}/contract/v2`)
  },
  setCooperatorContract (data) {
    return axios.post('/cooperator/contract', data)
  },
  getSalaryList (params) {
    return axios.get('/cooperator/salary', {
      params: params
    })
  },
  setCooperatorSalary (data) {
    return axios.post('/cooperator/salary', data)
  },
  getTweetList (cooperatorId) {
    return axios.get(`/cooperator/${cooperatorId}/article`)
  },
  getBrokerageList (cooperatorId) {
    return axios.get('/cooperator/brokerage/list', {
      params: { cooperatorId: cooperatorId }
    })
  },
  addTweet (data) {
    return axios.post('/cooperator/article', data)
  },
  uptTweet (data) {
    return axios.put('/cooperator/article', data)
  },
  delTweet (params) {
    return axios.delete('/cooperator/article', {
      params
    })
  },
  getAmbassadorList (params) {
    return axios.get('/ambassador/list', {
      params: params
    })
  },
  getAmbassadorMenteeList (params) {
    return axios.get('/ambassador/menteeArr', {
      params: params
    })
  },
  addAmbassador (data) {
    return axios.post('/ambassador/info', data)
  },
  uptAmbassador (data) {
    return axios.put('/ambassador/info', data)
  },
  delAmbassador (params) {
    return axios.delete('/ambassador/info', {
      params: params
    })
  },
  getContractByAmbassadorId (ambassadorId) {
    return axios.get('/ambassador/contract', {
      params: {
        ambassadorId: ambassadorId
      }
    })
  },
  addAmbassadorContract (data) {
    return axios.post('/ambassador/contract', data)
  },
  uptAmbassadorContract (data) {
    return axios.put('/ambassador/contract', data)
  },
  delAmbassadorContract (pkId) {
    return axios.delete('/ambassador/contract', {
      params: {
        pkId: pkId
      }
    })
  },
  getPaymentByAmbassadorId (ambassadorId) {
    return axios.get('/ambassador/payment', {
      params: {
        ambassadorId: ambassadorId
      }
    })
  },
  addAmbassadorPayment (data) {
    return axios.post('/ambassador/payment', data)
  },
  uptAmbassadorPayment (data) {
    return axios.put('/ambassador/payment', data)
  },
  delAmbassadorPayment (pkId) {
    return axios.delete('/ambassador/payment', {
      params: {
        pkId: pkId
      }
    })
  },
  getContractPayApplyListByContractId (contractId) {
    return axios.get('/cooperator/contract/apply', {
      params: {
        contractId: contractId
      }
    })
  },
  applyContractPayment (data) {
    return axios.post('/apply/commApply', data)
  },
  getAmbassadorPayApplyListByAmbassadorId (ambassadorId) {
    return axios.get('/ambassador/salary/apply', {
      params: {
        ambassadorId: ambassadorId
      }
    })
  },
  applyAmbassadorPayment (data) {
    return axios.post('/apply/commApply', data)
  },
  getFollowUpList (params) {
    return axios.get('/ambassador/follow', {
      params: params
    })
  },
  addFollowUp (data) {
    return axios.post('/ambassador/follow', data)
  },
  uptFollowUp (data) {
    return axios.put('/ambassador/follow', data)
  },
  uptCooperatorCode (cooperatorId, uniqueCode) {
    return axios.put(`/cooperator/uniqueCode?cooperatorId=${cooperatorId}&uniqueCode=${uniqueCode}`)
  },
  uptAmbassadorCode (ambassadorId, uniqueCode) {
    return axios.put(`/ambassador/uniqueCode?ambassadorId=${ambassadorId}&uniqueCode=${uniqueCode}`)
  },
  delFollowUp (params) {
    return axios.delete('/ambassador/follow', {
      params: params
    })
  },
  getFollowUpListCooperator (params) {
    return axios.get('/cooperator/follow', {
      params: params
    })
  },
  addFollowUpCooperator (data) {
    return axios.post('/cooperator/follow', data)
  },
  uptFollowUpCooperator (data) {
    return axios.put('/cooperator/follow', data)
  },
  delFollowUpCooperator (params) {
    return axios.delete('/cooperator/follow', {
      params: params
    })
  },
  getFollowUpNumCooperator () {
    return axios.get('/cooperator/followList')
  },
  getFollowUpNumAmbassador () {
    return axios.get('/ambassador/followList')
  },
  subordinate (id, type = null) {
    return axios.get(`group/${id}/subordinate`, {
      params: {
        positionType: type
      }
    })
  },
  getCooperatorFollowedUpList (params) {
    return axios.get('/cooperator/followedList', { params: params })
  },
  getAmbassadorFollowedUpList (params) {
    return axios.get('/ambassador/followedList', { params: params })
  },
  getCooperatorNoFollowUpList (params) {
    return axios.get('/cooperator/unfollowList', { params: params })
  },
  getAmbassadorNoFollowUpList (params) {
    return axios.get('/ambassador/unfollowList', { params: params })
  },
  getCooperatorFollowUpList (params) {
    return axios.get('/cooperator/followList', { params: params })
  },
  getAmbassadorFollowUpList (params) {
    return axios.get('/ambassador/followList', { params: params })
  },
  getCooperatorDataById (id) {
    return axios.get('/cooperator/info', {
      params: { cooperatorId: id }
    })
  },
  getAmbassadorDataById (id) {
    return axios.get('/ambassador/info', {
      params: { ambassadorId: id }
    })
  },
  getTweetById (id) {
    return axios.get('/cooperator/article', { params: { pkId: id } })
  },
  getTemp (id) {
    return axios.get('/ambassador/salary/tempApply', { params: { ambassadorId: id } })
  },
  setTemp (data) {
    return axios.post('/apply/temp', data)
  },
  getCooperatorActivityList (params) {
    return axios.get('/cooperator/activity/list', { params: params })
  },
  addCooperatorActivity (data) {
    return axios.post('/cooperator/activity', data)
  },
  uptCooperatorActivity (data) {
    return axios.put('/cooperator/activity', data)
  },
  getCooperatorActivityById (activityId) {
    return axios.get('/cooperator/activity', { params: { activityId: activityId } })
  },
  getCalendarData (params) {
    return axios.get('/cooperator/activity/schedule', { params: params })
  },
  getCooperatorDetailById (id) {
    return axios.get('/cooperator/overview', {
      params: {
        cooperatorId: id
      }
    })
  },
  getCooperatorContractDetailById (id) {
    return axios.get('/cooperator/contract', { params: { contractId: id } })
  },
  getCooperatorContentTypeById (id) {
    return axios.get('/cooperator/contentType', { params: { cooperatorId: id } })
  },
  getCooperatorMileStone (params) {
    return axios.get('/cooperator/event', { params: params })
  },
  getSetRateScore (params) {
    return axios.get('/cooperator/score', { params: params })
  },
  setCooperatorTips (data) {
    return axios.put('/cooperator/info/tips', data)
  },
  getUserList (params = {}) {
    return axios.get('/user/list', { params: params })
  },
  getGuest (activityId) {
    return axios.get(`/cooperator/activity/guest?activityId=${activityId}`)
  },
  getVoucher (activityId) {
    return axios.get(`/cooperator/activity/voucher?activityId=${activityId}`)
  },
  getMaterial (activityId) {
    return axios.get(`/cooperator/activity/material?activityId=${activityId}`)
  },
  getKolList (params) {
    return axios.get('/kol/list', { params: params })
  },
  addKol (data) {
    return axios.post('/kol/info', data)
  },
  editKol (data) {
    return axios.put('/kol/info', data)
  },
  deleteKol (kolId) {
    return axios.delete(`/kol/info/${kolId}`)
  },
  detailKol (kolId) {
    return axios.get(`/kol/info?kolId=${kolId}`)
  },
  getKolPayList (kolId) {
    return axios.get(`/kol/payment/list?kolId=${kolId}`)
  },
  userListVip (entryStatus) {
    return axios.get(`/user/list/vip?entryStatus=${entryStatus}`)
  },
  deleteKolPay (pkId) {
    return axios.delete(`/kol/payment/${pkId}`)
  },
  editKolPay (data) {
    return axios.put('/kol/payment', data)
  },
  addKolPay (data) {
    return axios.post('/kol/payment', data)
  },
  menteeArr (kolId) {
    return axios.get(`/kol/menteeArr?kolId=${kolId}`)
  },
  applyArr (kolId) {
    return axios.get(`/kol/applyArr?kolId=${kolId}`)
  },

  getPretalkListMentor (params) {
    return axios.get('/pretalk/list/mentor', { params: params })
  },
  getPretalkListMentee (params) {
    return axios.get('/pretalk/list/mentee', { params: params })
  },
  getPretalkList (params) {
    return axios.get('/pretalk/list', { params: params })
  },
  addPretalk (data) {
    return axios.post('/pretalk/info', data)
  },
  editPretalk (data) {
    return axios.put('/pretalk/info', data)
  },
  deletePretalk (pkId) {
    return axios.delete(`/pretalk/info/${pkId}`)
  },
  detailPretalk (pretalkId) {
    return axios.get(`/pretalk/info?pretalkId=${pretalkId}`)
  },
  getPretalkPayList (pretalkId) {
    return axios.get(`/pretalk/payment/list?pretalkId=${pretalkId}`)
  },
  deletePretalkPay (pkId) {
    return axios.delete(`/pretalk/payment/${pkId}`)
  },
  editPretalkPay (data) {
    return axios.put('/pretalk/payment', data)
  },
  addPretalkPay (data) {
    return axios.post('/pretalk/payment', data)
  },
  menteeArrPretalk (pretalkId) {
    return axios.get(`/pretalk/menteeListByPretalkId?pretalkId=${pretalkId}`)
  },
  addMenteePretalk (data) {
    return axios.post('/pretalk/mentee', data)
  },
  searchMenteeMatch (search) {
    return axios.get(`/mentee/match?search=${search}`)
  },
  searchMentorMatch (search) {
    return axios.get(`/mentor/match?search=${search}`)
  },
  getListByManagerWx (params = {}) {
    return axios.get('/cooperator/listByManagerWx', {
      params: params
    })
  },
  getListByManagerWxNew (params = {}) {
    return axios.get('/cooperator/searchWxForCrt', {
      params: params
    })
  },
  menteeArrBymanageNew (params = {}) {
    return axios.get('/cooperator/mentee/list', {
      params: params
    })
  },
  menteeArrBymanage (manageBy, manageGroup) {
    return axios.get(`/cooperator/manage/menteeArr?manageBy=${manageBy}&manageGroup=${manageGroup}`)
  },
  orderArrBymanage (manageBy) {
    return axios.get(`/cooperator/manage/orderArr?manageBy=${manageBy}`)
  },
  statisticsDaliy (params = {}) {
    return axios.get('/cooperator/statistics/daliy/list', {
      params: params
    })
  },
}
