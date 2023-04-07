/*
 * @Author: 库建华
 * @Date: 2019-04-17 13:46:17
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:52:37
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
    userList(data = {}) {
        return axios.get(`user/list`, {
            params: data
        })
    },
    crtUser(data = {}) {
        return axios.post(`user/user`, data)
    },
    uptUser(data = {}) {
        return axios.put(`user/user`, data)
    },
    roleDropdown() {
        return axios.get(`dic/roleDropdown`)
    },
    getSalesLevelList() {
        return axios.get(`/salesLevel/list`, {
            params: {
                pageNum: 1,
                pageSize: 1000
            }
        })
    },
    getMsgList(data) {
        return axios.get(`/msg/list`, {
            params: data
        })
    },
    getMsgDetailByID(msgId) {
        return axios.get(`/msg/${msgId}/detail`)
    },
    //微信号列表
    getOfficialAccountList() {
        return axios.get(`officialAccount/list`, {
            params: {pageNum:1,pageSize:1000,userId:'ALL',status:'1'}
        });
    },
    logout(){
        return axios.post(`login/logout`)
    },
    getDeptList(){
        return axios.get(`/group/1/group`)
    },
    seeAll(){
        return axios.put(`/msg/allRead`);
    },
    getClipboard(params){
        return axios.get(`/system/clipboard`,{params:params})
    },
    setClipboard(data){
        return axios.put(`/system/clipboard`,data)
    },
    /**
     * @description: 获取msgTitle下拉选项字典
     * @param {*}
     * @return {*}
     */    
    getMsgTitle(){
      return axios.get(`/msg/msgTitleDropDown`)
    },
    /**
     * @description: 获取用户管理的所有成员列表
     * @param {*} userId
     * @param {*} type
     * @return {*}
     */    
    subordinate(userId, type = null) {
      return axios.get(`group/${userId}/subordinate`, {
        params: {
          positionType: type
        }
      })
    },
    creatUser (data) {
        return axios.post('/manager/info', data)
    },
    updateUser (data) {
        return axios.put('/manager/info', data)
    },
    getManagerDetail (managerId) {
        return axios.get(`/manager/${managerId}/info`)
    },
    getManagerList (params) {
        return axios.get('/manager/list', { params: params })
    },
    setManagerListUserAcc (managerId, data) {
        return axios.post(`/manager/${managerId}/roleArr`, data)
    },
    getUserByWx (params) {
        return axios.get('/user/list', { params: params })
    },
    userByWxCompanyArr (userId) {
        return axios.get(`/user/${userId}/companyArr`)
    },
    userByWxInfo (userId) {
        return axios.get(`/user/${userId}/info`)
    }
}