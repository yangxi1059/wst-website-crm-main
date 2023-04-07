/*
 * @Author: 库建华
 * @Date: 2020-02-05 17:05:18
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-01 14:38:12
 * @Version: 
 * @Description: 
 */
import util from '@/libs/util.js'
export default {
  namespaced: true,
  state: {
    roleInfo:util.sessions.get('roleInfo') || "",
    userInfo:util.sessions.get('userInfo') || "",
    token:util.sessions.get('token') || "",
  },
  getters: {
    roleInfo: (state) => { return state.roleInfo },
    userInfo: (state) => { return state.userInfo },
    token: (state) => { return state.token },
  },
  mutations: {
    roleInfo (state, payload) {
      state.roleInfo = payload
      util.sessions.set('roleInfo', payload)
    },
    userInfo (state, payload) {
      state.userInfo = payload
      util.sessions.set('userInfo', payload)
    },
    token (state, payload) {
      state.token = payload
      util.sessions.set('token', payload)
    }
  },
  actions: {
    roleInfo ({ commit }, payload) {
      commit('roleInfo', payload)
    },
    userInfo ({ commit }, payload) {
      console.log("actions",payload)
      commit('userInfo', payload)
    },
    token ({ commit }, payload) {
      commit('token', payload)
    },
  },
}
