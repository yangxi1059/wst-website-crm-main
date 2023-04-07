/*
 * @Author: 库建华
 * @Date: 2020-01-08 09:43:23
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-12 16:42:59
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {

  login (data = {}) {
    return axios({
      url: '/login/v2/login',
      method: 'post',
      data
    })
  },
  loginWx (data = {}) {
    return axios({
      url: '/login/v2/login/chkScan',
      method: 'post',
      data
    })
  },
  bindWx (data = {}) {
    return axios({
      url: '/login/v2/login/bindUser',
      method: 'post',
      data
    })
  },
  // 通知
  getNoticeData (params) {
    return axios.get('/notice/list', { params: params })
  },
  getNoticeDetailByNoticeId (noticeId) {
    return axios.get(`/notice/${noticeId}`)
  },
  setNotice (data) {
    return axios.post('/notice/save', data)
  }
}
