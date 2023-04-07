import store from '@/store'
import axios from 'axios'
import {
  Message
} from 'element-ui'
import util from '@/libs/util'
import router from '@/router'
import aes from '../aes_rsa/aes_ecb.js'
// import {}

// 创建一个错误
function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

// 记录和显示错误
function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

const version = 'common'

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API
  // baseURL:'https://www.pageguo.com/api-test/'
  // timeout: 5000 // 请求超时时间
})

var timeOut
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    if (store.state.user) {
      store.state.user.info.name = util.sessions.get('userInfo').userName
    }
    const token = store.state.role.token
    if (!token) {
      router.push({
        name: 'login'
      })
    }

    window.timeLogOut = 5400
    // 定时登出，清除token
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
      console.log('90分钟自动登出，到时间了', new Date())
      util.sessions.remove('token')
      // 跳转路由
      router.push({
        name: 'login'
      })
    }, 1000 * 60 * 90)
    // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
    config.headers.Authorization = token
    config.headers.appId = 'crm_v2_win'
    config.headers['version'] = process.env.VUE_APP_API_VERSION // 请求头携带版本号
    // config.headers.version = version // 请求头携带版本号
    // 生成随机字符串，长度16位
    if (config.data && Object.prototype.toString.call(config.data) != '[object FormData]') {
      config.data = aes.encrypt(config.data)
    }
    // console.log(config)
    return config
  },

  error => {
    // 发送失败
    console.log(error, 'axios request error')
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // let res = JSON.parse(jsE.decryptLong(response));
    const res = response
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    if (dataAxios.data && dataAxios.key) {
      dataAxios.data = aes.decrypt(dataAxios.data, dataAxios.key)
    }
    // 这个状态码是和后端约定的
    let {
      code
    } = dataAxios
    // 根据 code 进行判断
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
      return dataAxios
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
        case 200:
          return dataAxios
        case 406:
          return dataAxios
        case 20001:
          return dataAxios
        case 30007:
          Message({
            message: dataAxios.message,
            type: 'error',
            duration: 5 * 1000
          })
          return dataAxios
        case 30008:
          Message({
            message: dataAxios.message,
            type: 'error',
            duration: 5 * 1000
          })
          return dataAxios
        case 401:
          Message({
            message: 'Token已失效，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          util.sessions.remove('token')
          util.sessions.remove('userInfo')
          util.sessions.remove('roleInfo')
          util.sessions.remove('token')
          util.sessions.remove('uuid')
          router.push({
            name: 'login'
          })
          break
        default:
          console.log("error code:" + code)
          // 不是正确的 code
          Message({
            message: dataAxios.message,
            type: 'error',
            duration: 5 * 1000
          })
          // errorCreate(`${dataAxios.msg}: ${res.config.url}`)
          return Promise.reject(dataAxios)
          break
      }
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权，请登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)

export default service
export const URL = process.env.VUE_APP_API
export const baseWSURL = (`ws` + process.env.VUE_APP_API.substr(4)).split('api')[0]
export const hostURL = process.env.VUE_APP_API.split('api')[0]

