/*
 * @Author: kaan
 * @Date: 2021-11-19 15:26:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-28 16:49:44
 * @Version:
 * @Description:
 */

import api from '@/api/common.js'
import apiDic from '@/api/dictionary.js'
import { utils } from 'sortablejs'
import util from '@/libs/util'
import store from '@/store'

var roleInfo = ''
export default {
  name: 'mixins',
  data () {
    return {
    }
  },
  mounted () {
    this.mixInit()
  },
  methods: {
    mixInit () {
      roleInfo = this.$store.state.role.roleInfo || util.sessions.get('roleInfo')
    },
    /**
     * @description: 获取用户管辖部门、成员，以树形式展现
     * @param {*}
     * @return {*}
     */
    async getUserList (roleMsg) {
      let userList = []
      // 判断角色是否有全部数据权限
      if (roleInfo.includes(roleMsg)) {
        userList.push({
          value: 'ALL_Data',
          label: 'ALL（全数据）'
        })
      }
      // 添加本人数据选项
      userList.push({ value: this.$store.state.role.userInfo.userId, label: '本人数据' })
      // 获取过部门角色列表则从状态管理器中直接获取
      if (this.$store.state.cache.userList) {
        return userList.concat(this.$store.state.cache.userList)
      } else {
        await api.getUserList().then(async (res) => {
          userList = userList.concat(res.data)
          await this.$store.dispatch('cache/setuserList', res.data)
          return userList.concat(res.data)
        })
          .catch(err => {
            return userList
          })
        return userList
      }
    },
    async getUserListVip (roleMsg, FncName) {
      roleInfo || (roleInfo = util.sessions.get('roleInfo'))
      const userList = []
      // 判断角色是否有全部数据权限
      if (roleInfo.includes(roleMsg)) {
        userList.push({
          value: 'ALL_Data',
          label: 'ALL（全数据）'
        })
      }
      // 添加本人数据选项
      userList.push({ value: this.$store.state.role.userInfo.userId, label: '本人数据' })
      // 获取过部门角色列表则从状态管理器中直接获取
      await api.getVIPList().then(async (res) => {
        res.data.forEach(item => {
          userList.push({
            value: item.userId,
            label: item.userName
          })
        })
      })
      return userList
    },
    /**
     * @description: 获取字典项
     * @param {*} dictionaryName
     * @return {*}
     */
    async getDictionary (dictionaryName) {
      let data = util.sessions.get('allDic') && util.sessions.get('allDic')[dictionaryName]
      if (data) {
        return data
      } else {
        await apiDic.getDicDropdown(dictionaryName).then(async (res) => {
          data = res.data[dictionaryName]
          const allDic = util.sessions.get('allDic')
          allDic[dictionaryName] = res.data[dictionaryName]
          util.sessions.set('allDic', allDic)
        })
        return data
      }
    },
    async getCascaderDic (dictionaryName) {
      let data = []
      await apiDic.getCascaderDic(dictionaryName).then(async (res) => {
        data = res.data
      })
      return data
    },
    /**
     * @description: 获取专业
     * @param {*}
     * @return {*}
     */
    async getMajor () {
      let data = util.sessions.get('allDic') && util.sessions.get('allDic').major
      if (data) {
        return data
      } else {
        await apiDic.getMajor().then(async (res) => {
          const allDic = util.sessions.get('allDic')
          allDic.major = res.data
          util.sessions.set('allDic', allDic)
          data = res.data
        })
        return data
      }
    },
    async getCompany () {
      let data = util.sessions.get('allDic') && util.sessions.get('allDic').company
      if (data) {
        return data
      } else {
        await apiDic.getCompanyList().then(async (res) => {
          const allDic = util.sessions.get('allDic')
          allDic.company = res.data
          util.sessions.set('allDic', allDic)
          data = res.data
        })
        return data
      }
    },
    async getSchool (name) {
      // school/highSchool
      let data = util.sessions.get('allDic') && util.sessions.get('allDic')[name]
      if (data) {
        return data
      } else {
        let param = 'university'
        if (name == 'highSchool') { param = 'high_school' }
        await apiDic.getSchool(param).then(async (res) => {
          const school = res.data
          school.forEach(e => {
            e.schoolName =
              e.engName === undefined
                ? `${e.chiName}[${e.country}]`
                : `${e.chiName}/${e.engName}[${e.country}]`
          })
          const allDic = util.sessions.get('allDic')
          allDic[name] = school
          util.sessions.set('allDic', allDic)
          data = school
        })
        return data
      }
    },
    async getCounselorgroup () {
      return ['一部', '二部']
    },
    // user/dropdown 数据处理后的返回
    async userListCommon (entryStatus, positionTypes, depts) {
      if (!entryStatus) {
        const data = [{
          label: '在职',
          options: []
        }, {
          label: '离职',
          options: []
        }]
        const query = {
          entryStatus: entryStatus,
          positionTypes: positionTypes,
          depts: depts
        }
        await apiDic.userListCommon(query).then(res => {
          res.data.forEach(item => {
            if (item.entryStatusName == '在职') {
              data[0].options.push({ userName: item.userName, userId: item.userId })
            } else {
              data[1].options.push({ userName: item.userName, userId: item.userId })
            }
          })
        })
        return data
      } else {
        let data = []
        const query = {
          entryStatus: entryStatus,
          positionTypes: positionTypes,
          depts: depts
        }
        await apiDic.userListCommon(query).then(res => {
          data = res.data
        })
        return data
      }
    }
  }
}
