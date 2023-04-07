/*
 * @Author: kaan
 * @Date: 2021-03-02 09:26:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-09 15:50:17
 * @Version: 
 * @Description: 
 */
import axios from '@/plugin/axios'

export default {
    groupTree(data = {}) {
        return axios.get(`group/groupTree`, { params: data })
    },
    groupTree2(data = {}) {
        return axios.get(`group/groupTree2`, { params: data })
    },
    getGroupInfo(id) {
        return axios.get(`group/${id}`)
    },
    getGroupMember(id) {
        return axios.get(`group/${id}/member`)
    },
    savegroup(data = {}) {
        return axios.post(`group/group`, data)
    },
    saveGroupMembers(id,data = {}) {
        return axios.post(`group/${id}/member`, data)
    },
    getAllGroupMember(){
        return axios.get(`/group/members`)
    },
    /**
     * @description: 初始化分组成员设置
     * @param {*} id
     * @return {*}
     */    
    getTeamMember(id) {
      return axios.get(`group/${id}/initMemberSetting`)
  },
}