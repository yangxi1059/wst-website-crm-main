/*
 * @Author: 杨曦
 * @Date: 2022-01-04 14:09:43
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-24 18:17:44
 * @Version: 
 * @Description: 
 */
import Handsontable from 'handsontable'
import { priceToM } from './util.js'

// 用于缩短单元格文件长度...
export const renderShortText = function (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  const escaped = Handsontable.helper.stringify(value)
  Handsontable.renderers.DropdownRenderer.apply(this, arguments)
  td.innerHTML = `<span title="${escaped}">${escaped}</span>`
  return td
}

// 时间处理后展示
export const renderTime = function (instance, td, row, col, prop, value, cellProperties) {
  if (!value) return td
  const escaped = Handsontable.helper.stringify(value)
  // Handsontable.renderers.textRenderer.apply(this, arguments);
  if (!escaped) {
    td.innerHTML = ''
    return td
  }
  const date = new Date(escaped)
  td.innerHTML = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()},${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return td
}
// 金额展示

export const priceCny = function (
  instance,
  td,
  row,
  col,
  prop,
  value
) {
  Handsontable.dom.empty(td)
  if (!value) return (td.innerHTML = '')
  return (td.innerHTML = priceToM(value, '￥'))
}
