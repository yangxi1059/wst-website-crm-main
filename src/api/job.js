/*
 * @Author: 库建华
 * @Date: 2020-04-26 13:35:11
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-12 15:44:31
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  // 内推列表与设置内推
  getNetApplicationList (params) {
    return axios.get('/internalJob/netApplication/list', {
      params: params
    })
  },
  addNetApplication (data) {
    return axios.post('/internalJob/netApplication', data)
  },
  uptNetApplication (data) {
    return axios.put('/internalJob/netApplication', data)
  },
  delNetApplication (params) {
    return axios.delete('/internalJob/netApplication', { params: params })
  }
}
