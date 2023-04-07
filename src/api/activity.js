/*
  * @Author: kaan
  * @Date: 2021-03-10 10:29:12
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 16:55:31
  * @Version:
  * @Description:
*/

import axios from '@/plugin/axios'

export default {
  /**
   * @description: 删除折扣活动
   * @param {*} discountId  折扣活动ID
   * @return {*}
   */
  deleteInfo (discountId) {
    return axios.delete('/discount/info', { params: { discountId: discountId } })
  },

  /**
   * @description: 获取某一个活动详情数据
   * @param {*} discountId 折扣活动ID
   * @return {*}
   */
  getInfo (discountId) {
    return axios.get('/discount/info', { params: { discountId: discountId } })
  },

  /**
   * @description: 修改折扣活动
   * @param {*} params 活动信息
   * {
        "discountId": "",主键ID
        "discountName": "",活动名称
        "beginDate": "开始日期  eg:2020-11-11",
        "endDate": "结束日期   eg:2020-11-20",
        "thresholdStatus": "是否有使用门槛 common_yes_or_no",
        "achieveAmount": "满金额cny eg:0" ,
        "discountType": "优惠类型 金额/比例",
        "discountAmount": "优惠金额cny eg:0",
        "discountPercent": "优惠比例 百分比 如10 表示10%",
        "couponNum": "优惠券数量 -1表示不限",
        "programArr": [{
          "programId": ""
        }]
      }
   * @return {*}
   */
  updateInfo (params) {
    return axios.put('/discount/info', params)
  },

  /**
   * @description: 新增折扣活动
   * @param {*} params 同updateInfo params无主键ID
   * @return {*}
   */
  addInfo (params) {
    return axios.post('/discount/info', params)
  },

  /**
   * @description: 分页获取折扣活动列表
   * @param {*} params 搜索信息
   * {
        pageNum	:"",
        pageSize	:"",
        programId	:"",
        discountStatus:"",
        activeStatus:"",
        search	:"",
        sortCol	:"",
        sort: "",
      }
   * @return {*}
   */
  getInfoList (params) {
    return axios.get('/discount/list', { params: params })
  },

  /**
   * @description: 领取优惠券
   * @param {*} params
   * {
        discountId	:"",	活动ID
        num	:"",	领取数量 不填写默认1
      }
   * @return {*}
   */
  receiveCoupon (params) {
    return axios.get('/discount/receiveCoupon', { params: params })
  },

  /**
   * @description: 通过优惠券码获取详情信息
   * @param {*} couponCode 优惠券ID
   * @return {*}
   */
  getCoupon (couponCode) {
    return axios.get('/discount/coupon', { params: { couponCode: couponCode } })
  },

  /**
   * @description: 删除已领取未使用的优惠券信息
   * @param {*} couponCode 优惠券ID
   * @return {*}
   */
  deleteCoupon (couponCode) {
    return axios.delete('/discount/coupon', { params: { couponCode: couponCode } })
  },

  /**
   * @description: 获取券详情列表
   * @param {*} params
   * {
   *  pageNum
      pageSize
      receiveBy	领券人 ALL_Data/ALL/userId
      search	活动名称 模糊搜索
      programId 项目Id
      discountId	活动ID
      discountStatus	活动状态 前端可以写死 取值“未开始” "进行中" “已结束”
      activeStatus	活动是否激活 0否 1是 字典项 common_yes_or_no
      couponStatus	券是否使用 字典项 common_yes_or_no
      sortCol
      sort
      }
   * @return {*}
   */
  getCouponList (params) {
    return axios.get('/discount/coupon/list', { params: params })
  }

}
