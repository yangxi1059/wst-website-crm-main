/*
 * @Author: kaan
 * @Date: 2021-12-02 18:03:00
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-02 18:34:10
 * @Version: 
 * @Description: 
 */

import axios from "@/plugin/axios"

export default {
  getVersionLast(data = {}) {
    return axios({
      url:'system/version/last',
      method:'get',
      params: data
    })
  },
  getVersionList(data = {}) {
    return axios({
      url:'system/version/list',
      method:'get',
      params: data
    })
  },
}
