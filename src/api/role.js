/*
 * @Author: 库建华
 * @Date: 2019-04-17 13:46:17
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-10 13:47:42
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  roleList (data = {}) {
    return axios.get('role/list', { params: data })
  },
  saveRoler (data = {}) {
    return axios.post('role/role', data)
  },
  getUserList (roleId) {
    return axios.get('/user/listByRole', { params: { roleId: roleId } })
  },
  setUserList (data) {
    return axios.post('/user/role', data)
  },
  getSelectUserList (position) {
    return axios.get('/user/listByPosition', { params: { position: position } })
  },
  setSelectUserList (position, data) {
    return axios.post('/user/position', { position: position, userIdArray: data })
  },
  getPositionList (params) {
    return axios.get('/position/list', { params: params })
  },
  setPosition (data) {
    return axios.post('/position/position', data)
  },
  getMentorPayCashier (paymentType) {
    return axios.get('/user/listByMentorPaymentType', { params: { paymentType: paymentType } })
  },
  setMentorPayCashier (data) {
    return axios.post('/user/mentorPaymentType', data)
  },
  setSelectUserList2 (data) {
    return axios.post('/user/position', data)
  },
  deleteSelectUserList (position, userId) {
    return axios.delete(`/user/delPositionByUserIdAndPosition?position=${position}&userId=${userId}`)
  }
}
