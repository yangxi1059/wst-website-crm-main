/*
 * @Author: 库建华
 * @Date: 2020-07-29 09:58:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 17:18:29
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  getPromoList (params = {}) {
    return axios.get('/promo/list', {
      params: params
    })
  },
  addPromo (data) {
    return axios.post('/promo/crtForBatch', data)
  },
  userList (params = {}) {
    return axios.get('/user/list', { params: params })
  },
  getDicListByDicId (dicLabel) {
    return axios({
      url: `/dic/${dicLabel}/item`,
      method: 'get'
    })
  },
  promoList (params = {}) {
    return axios.get('/program/list', { params: params })
  },
  promoDetail (programId) {
    return axios.get(`/program/${programId}`)
  },
  getPromoMy (params = {}) {
    return axios.get('/promo/my', {
      params: params
    })
  }
}
