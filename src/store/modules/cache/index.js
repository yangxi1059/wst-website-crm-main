/*
 * @Author: kaan
 * @Date: 2021-11-15 16:57:34
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-06 15:02:33
 * @Version: 
 * @Description: 
 */
import util from '@/libs/util.js'

export default {
  namespaced: true,
  state: {
    // 用户部门角色
    userList: util.sessions.get('userList')
  },
  mutations: {
    userList (state, list) {
      state.userList = list
      util.sessions.set('userList', list)
    }
  },
  actions: {
    async setuserList ({ commit }, list) {
      console.log("setuserList",list)
      await commit('userList', list) 
    }
  },
}
