/*
 * @Author: kaan
 * @Date: 2021-12-08 10:36:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-28 15:39:51
 * @Version:
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  /**
   * @description: 获取字典项
   * @param {*} params
   * @return {*}
   */
  getDicDropdown (params) {
    return axios({
      url: '/dic/dicDropdown2',
      method: 'get',
      params: {
        dicLabels: params
      }
    })
  },
  setRedis (key, data) {
    return axios.post(`/redis/data?second=${60 * 60 * 24 * 30}&key=${key}`, data)
  },
  setGiftItem (data) {
    return axios.post('/gift/info', data)
  },
  setMenteeInternalJOb (data) {
    return axios.post('/internalJob/mentee', data)
  },
  userList (data = {}) {
    return axios.get('user/list', {
      params: data
    })
  },
  addInternalJob (data) {
    return axios.post('/internalJob', data)
  },
  uptInternalJob (data) {
    return axios.put('/internalJob', data)
  },
  deleteInternalJob (jobId) {
    return axios.delete(`/internalJob/${jobId}`)
  },
  getDicByParent (params) {
    return axios.get('/dic/dicByParent', { params: params })
  },
  getCompanyDropdownList () {
    return axios.get('/company/list')
  },
  getInternalJobStudents (params) {
    return axios.get('/internalJob/menteeList', {
      params: params
    })
  },
  getDownLoad (params) {
    return axios.get('/sign/download/log', { params: params })
  },
  getMenteeDownLoad (params) {
    return axios.get('/sign/download/offerSchool/log', { params: params })
  },
  /**
   * @description: 获取某一申请的审核人列表
   * @param {*} applyType
   * @return {*}
   */
  getAuditorListByApplyType (applyType) {
    return axios({
      url: '/apply/confirmor',
      method: 'get',
      params: { applyType: applyType }
    })
  },
  /**
   * @description: 获取用户列表（下拉框）
   * @param {*} data
   * @return {*}
   */
  getUserList (data) {
    return axios.get('/user/dropdown', {
      params: {
        pageNum: 1,
        pageSize: 10000,
        positionType: data
      }
    })
  },
  userListCommon (data) {
    return axios.get('/user/dropdown', {
      params: {
        pageSize: 10000,
        pageNum: 1,
        positionTypes: data.positionTypes,
        entryStatus: data.entryStatus,
        depts: data.depts
      }
    })
  },
  getMajor () {
    return axios.get('/dic/majorDropdown')
  },
  getSchool (schoolType) {
    return axios.get(`/dic/schoolDropdown?schoolType=${schoolType}`)
  },
  getInternshipList (params) {
    return axios.get('/internship/list', {
      params: params
    })
  },
  getRate (params) {
    return axios.get('rate/lastRate', {
      params: params
    })
  },
  // 设置某一申请的审核人列表
  setAuditorListByApplyType (applyType, data) {
    return axios.post(`/apply/confirmor?applyType=${applyType}`, data)
  },
  getMenteeFileList (params) {
    return axios.get('/mentee/fileList', { params })
  },
  /**
   * @description: 获取父子典以及子字典
   * @param {*} params {parentDic,dicLabel}
   * @return {*}
   */
  getParentAndChildrenDic (params) {
    return axios.get('/dic/dic', { params: params })
  },
  getAcademyBySchoolId (schoolId) {
    return axios.get('/school/institute', {
      params: {
        schoolId: schoolId
      }
    })
  },
  /**
   * @description: 获取公司列表
   * @param {*} params
   * @return {*}
   */
  getCompanyList () {
    return axios.get('/dic/companyDropdown')
  },
  getCompanyListSetting (params) {
    return axios.get('/company/companyList', {
      params: params
    })
  },
  /**
   * @description: 获取最新汇率
   * @param {*} params
   * @return {*}
   */
  getLatestSysRate (params) {
    return axios.get('/rate/latestSysRate', { params: params })
  },
  dicitem (dicLabel) {
    return axios.get(`dic/${dicLabel}/item`)
  },
  getUserList2 () {
    return axios.get('/user/dropdown2')
  },
  getProgramDicList (data) {
    return axios.get('/program/list', {
      params: data
    })
  },
  getPayStatus (flags) {
    return axios.get('/redis/pay', { params: { key: flags, second: 5 * 60 } })
  },
  // 获取签约项目名（三级选择）
  getProgramList () {
    return axios.get('/program/dropdown/programForSign')
  },
  // 内推列表与设置内推
  getInternalJobList (params) {
    return axios.get('/internalJob/list', {
      params: params
    })
  },
  getCompanyItem (data) {
    return axios.post('/company/info', data)
  },
  getWstCompany (params) {
    return axios.get('/sign/company/list', { params: params })
  },
  getWstCompanyById (companyId) {
    return axios.get(`/sign/company/${companyId}/info`)
  },
  getInternshipPraise (data) {
    return axios.get(`/internship/praiseArr?internshipId=${data}`)
  },
  addInternshipPraise (data) {
    return axios.post('/internship/praise', data)
  },
  deleteInternshipPraise (data) {
    return axios.delete('/internship/praise', {
      params: {
        pkId: data
      }
    })
  },
  addInternshipFile (data) {
    return axios.post('/program/internship/file', data)
  },
  getInternshipFile (data) {
    return axios.get(`/program/internship/file/list?internshipId=${data}`)
  },
  deleteInternshipFile (data) {
    return axios.delete('/program/internship/file', {
      params: {
        pkId: data
      }
    })
  },
  getCooperatorPaymentListByCooperatorIdNew (userId) {
    return axios.get(`/paymentAccount/list?userId=${userId}`)
  },
  uptCommonPaymentNew (data) {
    return axios.put('/paymentAccount', data)
  },
  setCommonPaymentNew (data) {
    return axios.post('/paymentAccount', data)
  },
  deleteCommonPaymentNew (accountId) {
    return axios.delete(`/paymentAccount/${accountId}`)
  },
  getPayListByCompanyId (companyId) {
    return axios.get(`/internship/${companyId}/payment`)
  },
  setPayWayOnCompanyId (companyId, data) {
    return axios.post(`/internship/${companyId}/payment`, data)
  },
  setInternship (data) {
    return axios.post('/internship/info', data)
  },
  getInternshipSubListByInternship (internship) {
    return axios.get(`/internship/${internship}`)
  },
  setInternshipUnitDicItem (data) {
    return axios.post('/program/internship', data)
  },
  /**
   * @description: 二级联动字典
   * @param {*} dicLabel
   * @return {*}
   */
  getCascaderDic (dicLabel) {
    return axios.get(`/dic/cascaderDic/${dicLabel}`)
  },
  getRateList (params) {
    return axios.get('/rate/list', {
      params: params
    })
  },
  getSysRateList (params) {
    return axios.get('/rate/sysRateList', { params: params })
  },
  diclist (data = {}) {
    return axios.get('dic/list', {
      params: data
    })
  },
  // 新获取字典项详情
  getDicListDetailByDicId (dicLabel) {
    return axios({
      url: `/dic/${dicLabel}/detail`,
      method: 'get'
    })
  },
  setDicList (data) {
    return axios.post('dic/info', data)
  },
  refreshDicItem (data) {
    return axios.put('/dic/item', data)
  },
  getKeysList () {
    return axios.get('/system/accessToken/list')
  },
  addKeysItem (data) {
    return axios.post('/system/accessToken', data)
  },
  setKeysItem (data) {
    return axios.put('/system/accessToken', data)
  },
  deleteKeysItemBykey (accessToken) {
    return axios.delete(`/system/accessToken?accessToken=${accessToken}`)
  },
  saveRate (data) {
    return axios.post('/rate/batchSave', data)
  },
  addRateItem (data) {
    return axios.post('/rate/info', data)
  },
  setRateItem (data) {
    return axios.put('/rate/info', data)
  },
  getRateHistoryList (params) {
    return axios.get('/rate/history', {
      params: params
    })
  },
  getPeriod (params) {
    return axios.get('/rate/nextPeriods', {
      params: params
    })
  },
  getProgramDetailById (programId) {
    return axios.get(`program/${programId}`)
  },
  getProgramCopy (programId) {
    return axios.get(`/program/${programId}/copy`)
  },
  getProgramContractListById (programId) {
    return axios.get(`/program/${programId}/contract/list`)
  },
  delContract (id) {
    return axios.delete('/program/contract', {
      params: {
        pkId: id
      }
    })
  },
  setProgramDicItem (data) {
    return axios.post('/program/info', data)
  },
  previewContract (data) {
    return axios.post('/program/previewContract', data)
  },
  downContract (data) {
    return axios.post('/program/contract/export/word', data)
  },
  getContractListByProgramId (programId) {
    return axios.get(`/program/${programId}/contract`)
  },
  getBasicProgramList (params) {
    return axios.get('/program/basicProgramList', {
      params: params
    })
  },
  getProgramDic (programType) {
    return axios.get('/program/dropDown', {
      params: {
        programType: programType
      }
    })
  },
  getFollowUpRule (params) {
    return axios.get('/program/followRule', { params: params })
  },
  addFollowUpRule (data) {
    return axios.post('/program/followRule', data)
  },
  uptFollowUpRule (data) {
    return axios.put('/program/followRule', data)
  },
  addContract (data) {
    return axios.post('/program/contract', data)
  },
  addProgramContract (data) {
    return axios.post('/program/template', data)
  },
  uptContract (data) {
    return axios.put('/program/contract', data)
  },
  /**
     * @description: 获取公共项目合同模板列表
     * @param {*} data
     * @return {*}
     */
  getCommonContractList (data) {
    return axios.get('/program/commonContract/list', {
      params: data
    })
  },
  /**
     * @description: 获取项目公共合同模板标签下拉
     * @param {*} programType
     * @return {*}
     */
  getCommonContractDropDown (programType) {
    return axios.get(`/program/commonContract/list/tagDropDown?programType=${programType}`)
  },
  getCommonContractForBind (programId) {
    return axios.get(`/program/${programId}/commonContractList/forBind`)
  },
  /**
   * @description: 绑定项目公共合同模板
   * @param {*} programId
   * @param {*} data
   * @return {*}
   */
  bindCommonContract (programId, data) {
    return axios.post(`/program/${programId}/commonContract/bind`, data)
  },
  getCommonContract (pkId) {
    return axios.get(`/program/commonContract?pkId=${pkId}`)
  },
  addCommonContract (data) {
    return axios.post('/program/commonContract', data)
  },
  /**
   * @description: 修改公共项目合同模板
   * @param {*} data
   * @return {*}
   */
  editCommonContract (data) {
    return axios.put('/program/commonContract', data)
  },
  /**
   * @description: 删除公共项目合同模板
   * @param {*} pkId
   * @return {*}
   */
  deleteCommonContract (pkId) {
    return axios.delete(`/program/commonContract?pkId=${pkId}`)
  },
  getContractDetailById (id) {
    return axios.get('/program/contract', {
      params: {
        pkId: id
      }
    })
  },
  getMainImg (programId) {
    return axios.get('/program/image/main', { params: { programId: programId } })
  },
  getDetailImg (programId) {
    return axios.get('/program/image/detail', { params: { programId: programId } })
  },
  editImage (data) {
    return axios.put('/program/image', data)
  },
  sortProgram (data) {
    return axios.post('/program/sort', data)
  },
  getLessonTrackList () {
    return axios.get('/dic/lessonTrack/list')
  },
  addLessonTrackList (data) {
    return axios.post('/dic/lessonTrack/info', data)
  },
  editLessonTrackList (data) {
    return axios.put('/dic/lessonTrack/info', data)
  },
  detailLessonTrackList (trackId) {
    return axios.get(`/dic/lessonTrack/info?trackId=${trackId}`)
  },
  getSupplementary (params) {
    return axios.get('/supplementary/template/list', { params: params })
  },
  addSupplementary (data) {
    return axios.post('/supplementary/template', data)
  },
  editSupplementary (data) {
    return axios.put('/supplementary/template', data)
  },
  addSupplementaryInfo (pkId) {
    return axios.get(`/supplementary/template/info?pkId=${pkId}`)
  },
  deleterefSupplementary (pkId) {
    return axios.delete(`/supplementary/template?pkId=${pkId}`)
  },
  getSchoolDicList (data) {
    return axios.get('/school/list', {
      params: data
    })
  },
  setSchoolDicItem (data) {
    return axios.post('/school/info', data)
  },
  delAcademy (instituteId) {
    return axios.delete(`/school/institute?instituteId=${instituteId}`)
  },
  addAcademy (data) {
    return axios.post('/school/institute', data)
  },
  uptAcademy (data) {
    return axios.put('/school/institute', data)
  },
  getMenteeEventArr (menteeId) {
    return axios.get(`/mentee/eventArr?menteeId=${menteeId}`)
  },
  getRedisByKey (key) {
    return axios.get('/redis/data', { params: { key: key } })
  },
  getDicWstCompany () {
    return axios.get('/sign/signCompanyList')
  },
  getGiftList (data) {
    return axios.get('/gift/list', {
      params: {
        giftStatus: data
      }
    })
  },
  getChannelSource () {
    return axios.get('/channel/dropdown')
  },
  getDicDropdownBc (params) {
    return axios({
      url: '/dic/dropdown',
      method: 'get',
      params: {
        dicLabel: params
      }
    })
  },
  delSpec (specId) {
    return axios.delete(`/program/spec?specId=${specId}`)
  },
  addSpec (data) {
    return axios.post('/program/spec', data)
  },
  uptSpec (data) {
    return axios.put('/program/spec', data)
  },
  getSpecList (specStatus) {
    return axios.get(`/program/spec/list?specStatus=${specStatus}`)
  },
  addAccountDicItem (data) {
    return axios.post('/finance/account', data)
  },
  setAccountDicItem (data) {
    return axios.put('/finance/account', data)
  },
  getAccountDicList (data) {
    return axios.get('/finance/accountList', {
      params: data
    })
  },
  addWstCompany (data) {
    return axios.post('/sign/company/info', data)
  },
  uptWstCompany (data) {
    return axios.put('/sign/company/info', data)
  },
  delWstCompanyById (id) {
    return axios.delete('/sign/company/info', { params: { companyId: id } })
  },
  getProviderDropdown (data) {
    return axios.get('/internalJob/provider/dropdown', {
      params: data
    })
  },
  changeSign (data) {
    return axios.post('/system/sign/setting', data)
  },
  addSpeechRecognition (data) {
    return axios.post('/speechRecognition/task', data)
  },
  getSpeechRecognition (taskId) {
    return axios.get(`/speechRecognition/${taskId}`)
  },
  getChangeSign () {
    return axios.get('/system/sign/setting')
  }
}
