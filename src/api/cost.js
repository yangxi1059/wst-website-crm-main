/*
 * @Author: kaan
 * @Date: 2021-09-07 15:44:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 14:00:31
 * @Version:
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  /**
   * @description: 实习学员一览信息 & 未支付数据
   * @param {*} params
   * @return {*}
   */
  getInternshipSignList (params) {
    return axios.get('/internship/signList', {
      params: params
    })
  },
  /**
   * @description: Jerry行业导师课时数据
   * @param {*} params
   * @return {*}
   */
  getJerryLessonData (params) {
    return axios.get('/sign/jerryLessonData', {
      params: params
    })
  },
  /**
   * @description: 导出Jerry行业导师课时数据
   * @param {*}
   * @return {*}
   */
  exportJerryLessonData (params) {
    return axios.get('/sign/export/jerryLessonData', {
      params: params
    })
  }
}
