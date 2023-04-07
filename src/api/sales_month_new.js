/*
 * @Author: 库建华
 * @Date: 2019-04-19 15:59:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-12-17 13:44:47
 * @Version: 1
 * @Description:
 */

import axios from '@/plugin/axios'

export default {
    getSaleList(data = {}) {
        return axios.get(`kpi/sales`, {params: data})
    },
    getBDList(data = {}) {
        return axios.get(`kpi/bd`, {params: data})
    },
    salesHistoryMonth(data = {}) {
        return axios.get(`kpi/salesHistoryMonth`, {params: data})
    },
    salesRevenue(userId,data = {}) {
        return axios.get(`kpi/sales/${userId}/orderRevenue`, {params: data})
    },
    bdRevenue(userId,data = {}) {
        return axios.get(`kpi/bd/${userId}/orderRevenue`, {params: data})
    },
    getOrderDetailByOrderId(orderId){
        return axios.get(`/order/${orderId}/detail`)
    },
    getPayList(params){
        return axios.get(`/apply/pay/list`,{params:params})
    },
    addMoneyOut(data){
        return axios.post(`/apply/pay/crtPay`, data)
    },
    getTotalPrice(params){
        return axios.get(`/apply/pay/summary`,{params:params})
    },
    salesRevenue2(userId,data = {}) {
        return axios.get(`kpi/sales/${userId}/orderRevenue2`, {params: data})
    },
    bdRevenue2(userId,data = {}) {
        return axios.get(`kpi/bd/${userId}/orderRevenue2`, {params: data})
    },
    getMentorPaymentList(params){
        return axios.get(`/apply/pay/mentorPaymentList`,{params:params})
    },
    getInternshipPaymentList(params){
        return axios.get(`/apply/pay/internshipPaymentList`,{params:params})
    },
    getweightedAverageRate(params){
        return axios.get(`/order/revenue/weightedAverageRate`,{params:params})
    },
    getOperateCostList(params){
        return axios.get(`/finance/operateCostList`,{params:params})
    },
}