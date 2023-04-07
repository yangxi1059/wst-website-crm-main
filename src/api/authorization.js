/*
 * @Author: 库建华
 * @Date: 2020-07-29 09:58:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-26 10:30:12
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
    getAuthorizationList(params = {}){
        return axios.get(`/authorizationCode/list`, {
            params: params
        })
    },
    addAuthorization(){
        return axios.get(`/authorizationCode/crt`)
    },
    getAuthorizationInfo(codeKey){
        return axios.get(`/authorizationCode/${codeKey}/info`)
    },
}