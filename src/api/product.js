/*
 * @Author: 杨曦
 * @Date: 2021-12-08 10:36:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-15 16:12:50
 * @Version:
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  productList (data = {}) {
    return axios.get('/product/list', { params: data })
  },
  productInfo (productId) {
    return axios.get(`/product/${productId}/info`)
  },
  checkProduct (productId, data) {
    return axios.put(`/product/${productId}/audit`, data)
  }
}
