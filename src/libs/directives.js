/*
 * @Author: 杨曦
 * @Date: 2020-12-15 10:42:36
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-13 14:29:46
 * @Version:
 * @Description:
 */
import copy from './copy'
// 自定义指令
const directives = {
  copy
}
export default {
  install (Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
