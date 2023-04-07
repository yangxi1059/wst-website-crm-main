/*
 * @Author: 杨曦
 * @Date: 2021-11-24 16:52:44
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 10:25:12
 * @Version: 
 * @Description: 
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // plugins: [
  //   "jsx-v-model", 
  //   "transform-vue-jsx"
  // ],
  // 允许两种编码引入方式共存,也就是 common 规范与 es6 规范的共存处理
  sourceType: 'unambiguous'
}
