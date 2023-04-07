/*
 * @Author: 库建华
 * @Date: 2020-07-29 09:58:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-01-11 17:55:00
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  getBacklogSchedule (params = {}) {
    return axios.get('/backlog/schedule/v2', {
      params: params
    })
  },
  getBacklogReminderList (params = {}) {
    return axios.get('/backlog/reminderArr', {
      params: params
    })
  },
  getBacklogCommonItemList (params = {}) {
    return axios.get('/backlog/item/common/list', {
      params: params
    })
  },
  getBacklogSignExpirationItemList (params = {}) {
    return axios.get('/backlog/item/signExpiration/list', {
      params: params
    })
  },
  getBacklogSignEndItemList (params = {}) {
    return axios.get('/backlog/item/signEnd/list', {
      params: params
    })
  },
  setBacklogItem (data) {
    return axios.put('/backlog/item/doneForBatch', data)
  },
  addBacklogCommonItem (data) {
    return axios.post('/backlog/item/common', data)
  },
  getOneTooneLessonsList (params = {}) {
    return axios.get('/backlog/item/oneOnOneLesson/list', {
      params: params
    })
  },
  getJerryOneOnOneLessonsList (params = {}) {
    return axios.get('/backlog/item/jerryOneOnOneLesson/list', {
      params: params
    })
  },
  setRateBD (params) {
    return axios.put('/backlog/item/cooperatorActivityScore', params)
  },
  getOneTooneLessonsDetail (params = {}) {
    return axios.get('/backlog/item/oneOnOneLesson', {
      params: params
    })
  },
  getJerryOneTooneLessonsDetail (params = {}) {
    return axios.get('/backlog/item/jerryOneOnOneLesson', {
      params: params
    })
  },
  getBacklogStory (params = {}) {
    return axios.get('/backlog/item/offerStoryFix/list', {
      params: params
    })
  },
  getserRateDetail (params = {}) {
    return axios.get('/backlog/item/cooperatorActivityScore/list', {
      params: params
    })
  },
  getBackLogList (params = {}) {
    return axios.get('/backlog/followList', {
      params: params
    })
  },
  // 一对多导师课时申请
  oneToOneLessonsApply (data) {
    return axios.post('/apply/commApply', data)
  }
}
