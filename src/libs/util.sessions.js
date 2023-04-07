/*
 * @Author: kaan
 * @Date: 2021-11-12 15:10:43
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-21 10:35:34
 * @Version: 
 * @Description: 
 */

const sessions = {}

/**
 * @description 存储 session 值
 * @param {String} name session name
 * @param {String} value session value
 */
sessions.set = function (name = 'default', value = '') {
  sessionStorage.setItem(`crm-${name}`, JSON.stringify(value))
}

/**
 * @description 拿到 session 值
 * @param {String} name session name
 */
sessions.get = function (name = 'default') {
  let str = sessionStorage.getItem(`crm-${name}`)
  return JSON.parse(str)
}

/**
 * @description 拿到 session 全部的值
 */
sessions.getAll = function () {
  return sessions.get()
}

/**
 * @description 删除 session
 * @param {String} name session name
 */
sessions.remove = function (name = 'default') {
  return sessionStorage.removeItem(`crm-${name}`)
}

export default sessions
