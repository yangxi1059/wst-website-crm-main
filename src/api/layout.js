/*
 * @Author: 杨曦
 * @Date: 2021-12-21 10:55:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-28 14:25:32
 * @Version:
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  // 更新入账数据
  getUserList (data) {
    return axios.get('/user/dropdown', { params: { pageNum: 1, pageSize: 10000, positionType: data } })
  },
  getPromoMy (params = {}) {
    return axios.get('/promo/my', {
      params: params
    })
  },
  /**
     * @description: 获取msgTitle下拉选项字典
     * @param {*}
     * @return {*}
     */
  getMsgTitle () {
    return axios.get('/msg/msgTitleDropDown')
  },
  uptUser (data = {}) {
    return axios.put('user/user', data)
  },
  getMsgList (data) {
    return axios.get('/msg/list', {
      params: data
    })
  },
  seeAll () {
    return axios.put('/msg/allRead')
  },
  getMsgDetailByID (msgId) {
    return axios.get(`/msg/${msgId}/detail`)
  },
  getClipboard (params) {
    return axios.get('/system/clipboard', { params: params })
  },
  speechRecognitionList (params) {
    return axios.get('/speechRecognition/task/list', { params: params })
  },
  setClipboard (data) {
    return axios.put('/system/clipboard', data)
  }
}
