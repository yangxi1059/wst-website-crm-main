/*
 * @Author: kaan
 * @Date: 2021-11-05 13:52:51
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-19 14:54:25
 * @Version:
 * @Description:
 */
import cookies from './util.cookies'
import sessions from './util.sessions'
import db from './util.db'
import log from './util.log'

const util = {
  cookies,
  sessions,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'crm_v2'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * @description: 获取URL参数
 * @param {*} name
 * @return {*}
 */
util.getQueryString = function (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * @description: 日期格式转换
 * @param {*}
 * @return {*}
 */
util.fmtDate = (date, fmtExp) => {
  date = new Date(+date)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmtExp)) {
    fmtExp = fmtExp.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmtExp)) {
      fmtExp = fmtExp.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmtExp
}

/**
 * @description: 生成随机数
 * @param {*}
 * @return {*}
 */
util.guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
// 金额加分隔符
util.priceToM = (p, type) => {
  if (!p) return ''
  // p = Number(p).toFixed(2);
  let minus = false
  if (Number(p) < 0) {
    minus = true
    p = Math.abs(p)
  }
  let point = p % 1
  point = Math.round(point * 100) / 100
  point = point.toString().substr(1) ? point.toString().substr(1) : ''
  // '.0'

  p = Math.floor(p)
  while (p > 999) {
    point = ',' + p.toString().substr(-3) + point
    p = Math.floor(p / 1000)
  }
  if (minus) {
    p = type + '-' + p + point
  } else {
    p = type + p + point
  }
  return p
}
util.fmtDate = (date, fmtExp) => {
  date = new Date(date)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmtExp)) {
    fmtExp = fmtExp.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmtExp)) {
      fmtExp = fmtExp.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmtExp
}
export default util
export const priceToM = util.priceToM
export const fmtDate = util.fmtDate
