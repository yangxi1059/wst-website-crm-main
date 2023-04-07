/* eslint-disable no-use-before-define */
import {
  Message,
  MessageBox
} from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
// import { AccountLogin } from '@api/sys.login'
import api from '@api/login.js'
import { menuAside, menuHeader } from '@/menu/index'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({
      dispatch
    }, data = {}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        api.login(data)
          .then(async res => {
            console.log(res)
            if (res.code == '401' || res.code == '30002' || res.code == '30010' || res.code == '30006') {
              res.show = true
              resolve(res)
            }
            if (res.code == '200' && !res.data.token) {
              console.log(res)
              res.Fnc = 'setWxLogin'
              res.qrKey = res.data.qrKey
              resolve(res)
            }
            if (res.code == '200' && res.data.token) {
              await dispatch('role/token', res.data.token, { root: true })// 保存token
              await dispatch('d2admin/user/set', {
                name: res.data.userInfo.userName
              }, {
                root: true
              })
              let roleInfo = ''
              const arr = []
              res.data.roleInfo && res.data.roleInfo.forEach(v => { arr.push(v.roleInfo.split(',')) })
              roleInfo = [...new Set(arr)].join(',')
              util.sessions.set('appVersion', res.data.appVersion)
              util.sessions.set('token', res.data.token)
              util.sessions.set('userInfo', res.data.userInfo)
              util.sessions.set('roleInfo', roleInfo)
              console.log('menuAside', menuAside)
              const menuAsideNew = JSON.parse(JSON.stringify(menuAside))
              menuAsideNew.filter((v) => {
                if (v.children && v.children.length > 0) {
                  for (let i = 0; i < v.children.length; i++) {
                    if (!roleInfo.includes(v.children[i].role)) {
                      v.children.splice(i, 1)
                    }
                  }
                }
              })

              await dispatch('role/roleInfo', roleInfo, { root: true })// 保存权限数据
              await dispatch('role/userInfo', res.data.userInfo, { root: true })// 保存权限数据
              await dispatch('roleFilter', roleInfo)
              // todo
              // dispatch('d2admin/menu/asideSet', menuAsideNew.filter(v => roleInfo.includes(v.title)), { root: true })// 给侧边菜单栏数据赋值；
              // 用户登录后从持久化数据加载一系列的设置
              // await dispatch('load')
              // 结束
              resolve(res)
            }
            if (res.code == '30007') {
              resolve(res)
            }
            if (res.code == '30008') {
              resolve(res)
            }
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    loginWx ({
      dispatch
    }, res0 = {}) {
      return new Promise((resolve, reject) => {
        const data = {}
        data.account = res0.account
        data.password = res0.passWord
        console.log(res0)
        api.login(data)
          .then(async res => {
            console.log('rrr', res)
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            // sessionStorage.setItem('uuid', res.data.uuid)
            // 设置 vuex 用户信息
            await dispatch('role/token', res.data.token, { root: true })// 保存token
            await dispatch('d2admin/user/set', {
              name: res.data.userInfo.userName
            }, {
              root: true
            })
            let roleInfo = ''
            const arr = []

            res.data.roleInfo = util.sessions.get('roleInfo')
            res.data.token = util.sessions.get('token')
            res.data.appVersion = util.sessions.get('appVersion')

            res.data.roleInfo = JSON.parse(res.data.roleInfo)
            console.log(res.data.roleInfo, util.sessions.get('roleInfo'), util.sessions.get('token'), util.sessions.get('appVersion'), res.data.userInfo)

            res.data.roleInfo && res.data.roleInfo.forEach(v => { arr.push(v.roleInfo.split(',')) })
            roleInfo = [...new Set(arr)].join(',')
            util.sessions.set('appVersion', res.data.appVersion)
            util.sessions.set('token', res.data.token)
            util.sessions.set('userInfo', res.data.userInfo)
            util.sessions.set('roleInfo', roleInfo)

            const menuAsideNew = JSON.parse(JSON.stringify(menuAside))
            menuAsideNew.filter((v) => {
              if (v.children && v.children.length > 0) {
                for (let i = 0; i < v.children.length; i++) {
                  if (!roleInfo.includes(v.children[i].role)) {
                    v.children.splice(i, 1)
                  }
                }
              }
            })

            await dispatch('role/roleInfo', roleInfo, { root: true })// 保存权限数据
            // todo
            dispatch('roleFilter', roleInfo)
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load')
            // 结束
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    loginWxNew ({ dispatch }, res1 = {}) {
      return new Promise((resolve, reject) => {
        dispatch('role/token', res1.token, { root: true })// 保存token
        dispatch('d2admin/user/set', {
          name: res1.userInfo.userName
        }, {
          root: true
        })
        let roleInfo = ''
        const arr = []
        res1.roleInfo && res1.roleInfo.forEach(v => { arr.push(v.roleInfo.split(',')) })
        roleInfo = [...new Set(arr)].join(',')
        util.sessions.set('appVersion', res1.appVersion)
        util.sessions.set('token', res1.token)
        util.sessions.set('userInfo', res1.userInfo)
        util.sessions.set('roleInfo', roleInfo)
        console.log(roleInfo)
        console.log(menuAside, 486468748)
        dispatch('roleFilter', roleInfo)
        dispatch('role/roleInfo', roleInfo, { root: true })// 保存权限数据
        dispatch('roleFilter', roleInfo)
        // const menuAsideNew = JSON.parse(JSON.stringify(menuAside))
        // menuAsideNew.filter((v) => {
        //   if (v.children && v.children.length > 0) {
        //     for (let i = 0; i < v.children.length; i++) {
        //       if (!roleInfo.includes(v.children[i].role)) {
        //         v.children.splice(i, 1)
        //       }
        //     }
        //   }
        // })
        // // todo
        // dispatch('d2admin/menu/asideSet', menuAsideNew.filter(v => roleInfo.includes(v.title)), { root: true })// 给侧边菜单栏数据赋值；
        // // 用户登录后从持久化数据加载一系列的设置
        // dispatch('load')
        // 结束
        resolve()
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({
      commit,
      dispatch
    }, {
      confirm = false
    } = {}) {
      /**
       * @description 注销
       */
      console.log(2222222222222)
      async function logout () {
        // 删除cookie
        util.sessions.remove('token')
        util.sessions.remove('userInfo')
        util.sessions.remove('roleInfo')
        util.sessions.remove('token')
        util.sessions.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, {
          root: true
        })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, {
          root: true
        })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, {
              root: true
            })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, {
              root: true
            })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async roleFilter ({ dispatch, commit }, roleInfo) {
      roleInfo = roleInfo || util.sessions.get('roleInfo') || ''
      let arrNew1 = []
      let arrNew2 = []
      let roleInfoArr = roleInfo.split(',')
      
      const menuAsideNew = JSON.parse(JSON.stringify(menuAside))
      arrNew1 = menuAsideNew.filter(e=> roleInfoArr.includes(e.role))
      arrNew1.filter((v) => {
        if (v.children && v.children.length > 0) {
          v.children  = v.children.filter(e=> roleInfoArr.includes(e.role))
        }
      })

      const menuHeaderNew = JSON.parse(JSON.stringify(menuHeader))
      arrNew2 = menuHeaderNew.filter(e=> roleInfoArr.includes(e.role))
      arrNew2.filter((v) => {
        if (v.children && v.children.length > 0) {
          v.children  = v.children.filter(e=> roleInfoArr.includes(e.role))
        }
      })

      await commit('d2admin/menu/headerSet', arrNew2, { root: true })
      await commit('d2admin/menu/asideSet', arrNew1, { root: true })
      await dispatch('load')
    },
    load ({
      dispatch
    }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, {
          root: true
        })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, {
          root: true
        })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, {
          root: true
        })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, {
          root: true
        })
        // DB -> store 持久化数据加载侧边栏折叠状态
        // await dispatch('d2admin/menu/asideCollapseLoad', null, {
        //   root: true
        // })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, {
          root: true
        })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, {
          root: true
        })
        // end
        resolve()
      })
    },
    async loginSuccess (dispatch, res, resolve) {

    }
  }
}
