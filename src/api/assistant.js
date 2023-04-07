/*
 * @Author: kaan
 * @Date: 2021-12-29 15:10:01
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-06 15:05:17
 * @Version: 
 * @Description: 
 */
import axios from '@/plugin/axios'

export default {
  /**
   * @description: 获取销售助理 学生列表
   * @param {*} data
   * @return {*}
   */  
  getMenteeList(data = {}) {
    return axios.get(`mentee/list/assistant`, {
        params: data
    })
  },
  /**
   * @description: 获取销售顾问学生分配列表
   * @param {*}
   * @return {*}
   */  
  getSalesList(){
    return axios.get(`/mentee/allocate/counselor`)
  },
  /**
   * @description: 销售助理拉给顾问咨询情况
   * @param {*}
   * @return {*}
   */  
  getSalesList2(){
    return axios.get(`/mentee/assistantEffectiveConsultingNum`)
  },
  /**
   * @description: 销售助理 BD渠道
   * @param {*}
   * @return {*}
   */  
  getSalesList3(){
    return axios.get(`/mentee/bdInfo`)
  },
  /**
   * @description: 销售助理 10天内签约学生信息
   * @param {*}
   * @return {*}
   */ 
  getSalesList4(){
    return axios.get(`/mentee/signedInTenDays`)
  },
  /**
   * @description: 查询匹配符合条件的学生（家庭）记录
   * @param {*} search
   * @return {*}
   */  
  getMenteeFamilyListSearch(search){
    return axios.get(`/mentee/family/search`,{params:search})
  },
  /**
   * @description: 通过部门获取微信账号信息
   * @param {*} dept
   * @return {*}
   */  
  getCounselor(dept){
    return axios.get(`/officialAccount/list/dept`,{params:{dept:dept}})
  },
  /**
   * @description: 获取合作商活动列表
   * @param {*} params
   * @return {*}
   */  
  getCooperatorActivityList(params){
    return axios.get(`/cooperator/activity/list`,{params:params})
  },
  /**
   * @description: 通过uniqueCode获取具体来源信息
   * @param {*} uniqueCode
   * @return {*}
   */  
  getCodeDetail(uniqueCode){
    return axios.get(`/channel/uniqueCode?uniqueCode=${uniqueCode}`)
  },
  getAmbassadorSourceByName(name){
    return axios.get(`/ambassador/list`,{params:{pageNum:1,pageSize:999,ambassadorStatus:'1',ambassadorType:'',manageBy:'ALL_Data',search:name}})
  },
  getCooperatorSourceByNameFast(search){
    return axios.get(`/cooperator/search?search=${search}`)
  },
  getKol(name){
    return axios.get(`/kol/search`,{params:{search:name}})
  },
  //微信号列表
  getOfficialAccountList() {
    return axios.get(`officialAccount/list`, {
        params: {pageNum:1,pageSize:1000,userId:'ALL',status:'1'}
    });
  },
  getChannelSource(){
    return axios.get(`/channel/dropdown`)
  },
  //获取学员信息
  getMenteeDataByMenteeId(menteeId) {
    return axios.get(`/mentee/${menteeId}/info`)
  },
  mentee_info2(data = {}) {
    return axios.post(`mentee/info2`, data)
  },
  /**
   * @description: 获取本人及下属的今日待follow数量(销售助理)
   * @param {*}
   * @return {*}
   */    
  getFollowUpAssistant(){
    return axios.get(`/mentee/followUpOverview/assistant`)
  },
  //数据
  getFollowUpListData(menteeId, data) {
    return axios.get(`/mentee/${menteeId}/followUpList`, { params: data })
  },
  //提交followUp数据
  assistantSetFollowUp(data) {
    return axios.post(`/mentee/assistant/followUp`, data)
  },
  //提交followUp数据
  setFollowUp(data) {
    return axios.post(`/mentee/followUp`, data)
  },
  setSourceFormfeedback(data) {
    return axios.post(`/mentee/sales/sourceFormfeedback`, data)
  },
  /**
   * @description: 获取具体某销售助理今日需follow列表（分页）
   * @param {*} params
   * @return {*}
   */    
  getFollowUpListTodayAssistant(params){
    return axios.get(`/mentee/followUpList/assistant`,{params:params})
  },
  getMenteeInfoAndFollowList(params){
    return axios.get(`/mentee/menteeInfoAndFollowList`,{params:params})
  },
  /**
   * @description: 激活学员
   * @param {*} data
   * @return {*}
   */    
  activate(data){
    return axios.post(`/mentee/activate`,data)
  },
  getMenteeEventArr(menteeId) {
    return axios.get(`/mentee/eventArr?menteeId=${menteeId}`)
  },
}
