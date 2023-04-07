/*
 * @Author: kaan
 * @Date: 2021-11-05 13:52:51
 * @LastEditors: kaan
 * @LastEditTime: 2021-11-16 13:27:40
 * @Version: 
 * @Description: 
 */
import Vue from 'vue'
import Vuex from 'vuex'

import cache from './modules/cache'
import d2admin from './modules/d2admin'
import role from './modules/role/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cache:cache,
    d2admin:d2admin,
    role:role
  }
})
