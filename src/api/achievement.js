/*
 * @Author: kaan
 * @Date: 2021-12-22 15:50:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-18 10:59:54
 * @Version: 
 * @Description: 
 */
import axios from '@/plugin/axios'

export default {
  /**
   * @description: 获取好评列表
   * @param {*} data
   * @return {*}
   */  
  getPraiseList (data = {}) {
    return axios({
      url: 'sign/praiseList',
      method: 'get',
      params: data
    })
  },
  /**
   * @description: 提交好评有码图
   * @param {*} data
   * @return {*}
   */  
  setMenteePraise(data){
    return axios.put(`/sign/praise`,data)
  },
  /**
   * @description: 获取下载记录
   * @param {*} params
   * @return {*}
   */  
  getDownload(params){
    return axios.get(`/sign/download/log`,{params:params})
  },
  /**
   * @description: 保存下载记录
   * @param {*} data
   * @return {*}
   */  
  saveDownLoad(data){
    return axios.post(`/sign/download/log`,data)
  },
  /**
   * @description: 获取学校offer下载记录
   * @param {*} params
   * @return {*}
   */  
  getMenteeDownLoad(params){
    return axios.get(`/sign/download/offerSchool/log`,{params:params})
  },
  /**
   * @description: 成果展示中下拉选项dic
   * @param {*} params
   * @return {*}
   */  
  getDicSignResultDic(params){
    return axios.get(`/dic/signResultDic`,{params:params})
  },
  // 成就-offer/面试列表
  getAchievementList (params) {
    return axios.get('/sign/result', {
      params: params
    })
  },
  /**
   * @description: 修改面试/offer信息
   * @param {*} data
   * @return {*}
   */  
  updateSignResult(data) {
    return axios.put('/sign/result', data)
  },
  setOfferV2ListBySignId (data) {
    return axios.put('/sign/v2/result/check', data)
  },
}
