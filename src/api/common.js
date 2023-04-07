/*
 * @Author: kaan
 * @Date: 2021-11-22 13:53:13
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:21:23
 * @Version: 
 * @Description: 
 */
import axios from "@/plugin/axios"

export default {
  /**
   * @description: 获取角色列表
   * @return {*}
   */  
  //获取用户管辖部门、成员，以树形式展现
  getUserList() {
    return axios({
      url:'/group/managed',
      method:'get',
    })
  },
  //获取VIP用户列表,非树形式展现
  getVIPList() {
    return axios.get(`/user/VIPList`)
  },
  /**
   * @description: 获取抄送列表
   * @param {*} data
   * @return {*}
   */  
  userList(data = {}) {
    return axios.get(`user/list`, {
        params: data
    })
  },
}
