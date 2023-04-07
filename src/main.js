/*
 * @Author: kaan
 * @Date: 2021-11-15 14:57:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-23 15:43:03
 * @Version:
 * @Description:
 */
// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'
import pagination from '@/components/pagination'

import './assets/style/element-variables.scss'

// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'
import s_ms from '@/libs/filter/s_ms.js'
import ms_s from '@/libs/filter/ms_s.js'
import payStatus from '@/components/pay_status'
import iconTooltip from '@/components/icon_tooltip'

// 引入editor富文本
import '../public/static/UE/themes/default/css/ueditor.css'
import '../public/static/UE/ueditor.config.js'
import '../public/static/UE/ueditor.all.js'
import '../public/static/UE/lang/zh-cn/zh-cn.js'
// 引入ckeditor4富文本编辑器
import CKEditor from 'ckeditor4-vue'
// 引入echarts
import * as echarts from 'echarts'

// 复制到粘贴板
import VueClipboards from 'vue-clipboard2'
import Directives from './libs/directives.js'
// 引入vxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '../node_modules/handsontable/dist/handsontable.full.css'
import { HotTable } from '@handsontable/vue'

Vue.use(CKEditor)
Vue.use(Directives)
Vue.component(iconTooltip.name, iconTooltip)
Vue.component(payStatus.name, payStatus)
Vue.prototype.$echarts = echarts
Vue.filter('s_ms', s_ms)
Vue.filter('ms_s', ms_s)


// 核心插件
Vue.use(d2Admin)
Vue.component(pagination.name, pagination)
Vue.use(VueClipboards)
Vue.use(VXETable)
Vue.component(HotTable.name, HotTable)

window.vue = new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    // this.$store.commit('d2admin/menu/asideSet', menuAside)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/roleFilter')
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')
