/*
 * @Author: 杨曦
 * @Date: 2021-12-08 10:36:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-11 10:10:11
 * @Version:
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  companyList (data = {}) {
    return axios.get('/company/list', { params: data })
  },
  getCompanyMember (companyId) {
    return axios.get(`/company/${companyId}/member`)
  },
  getCompanyFactory (companyId) {
    return axios.get(`/company/${companyId}/factory`)
  },
  getCompanyFactoryInfo (factoryId) {
    return axios.get(`/factory/${factoryId}/info`)
  },
  setCompany (data) {
    return axios.post('/company/info', data)
  },
  editCompany (data) {
    return axios.put('/company/info', data)
  }
  
}
