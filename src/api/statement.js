/*
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 09:31:26
 * @Version: 
 * @Description: 
 */
/*
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-11-18 17:37:07
 * @Version: 
 * @Description: 
 */
import axios from '@/plugin/axios'

export default {
  getSaleAssistantStatementData(data){
    return axios.get(`/statement/assistant`,{params:data})
  },
  getUsersList(){
    return axios.get(`/user/memberList`)
  },
  getSalesDate(data){
    return axios.get(`/statement/sale`,{params:data})
  },
  getSalesUsersList(){
    return axios.get(`/user/salesGroupList`)
  },
  getTimeLine(params = {}){
    return axios.get(`/statement/overview`, {
      params: params
    })
  },
  getMentorDate(data){
    return axios.get(`/statement/mentor`,{params:data})
  },
  getSchoolDate(data){
    return axios.get(`/statement/school`,{params:data})
  },
  getSchoolDateTabel(data){
    return axios.get(`/statement/schoolOverview`,{params:data})
  },
  // getEffectConsulting(data){
  //   return axios.get(`/count/effectiveConsulting`,{params:data})
  // },
  getIncome(data){
    return axios.get(`/statement/income`,{params:data})
  },
  /**
   * @description: 销售助理报表（某渠道二级来源新增学生数）
   * @param {*} data
   * @return {*}
   */  
  getAddSource(data){
    return axios.get(`/statement/assistant/addSource`,{params:data})
  },
  /**
   * @description: 销售助理报表（某渠道二级来源咨询学生数）
   * @param {*} data
   * @return {*}
   */  
  getCounselorSource(data){
    return axios.get(`/statement/assistant/counselorSource`,{params:data})
  },
  /**
   * @description: 销售顾问报表（某渠道二级来源签约学生数
   * @param {*} data
   * @return {*}
   */  
  getSignSource(data){
    return axios.get(`/statement/sale/signSource`,{params:data})
  },
}