/*
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-09 14:02:50
 * @Version: 
 * @Description: 
 */
import axios from "@/plugin/axios"


export default {
    ossStsToken() {
        return axios.get(`system/ossStsToken`)
    }
}