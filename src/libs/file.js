/*
 * @Author: kaan
 * @Date: 2021-11-26 14:19:40
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-08 09:30:00
 * @Version:
 * @Description:
 */
import api from '@/api/file.js'
import FileSaver from 'file-saver'
import util from '@/libs/util'
const OSS = require('ali-oss')
const file = {}

// 时间处理
export const fmtDate = (date, fmtExp) => {
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
 * @description: 文件预览
 * @param {*} fileName
 * @return {*}
 */
file.preview = function (fileName) {
  console.log(fileName, window.vue.$router, 'file preview')
  const router = window.vue.$router.resolve({
    name: 'FilePreview'
  })
  if (util.getQueryString('mac')) {
    console.log(process.env.VUE_APP_API)
    const baseURLNew = process.env.VUE_APP_API
    let address = ''
    if (baseURLNew == 'https://www.pageguo.com/api-test/') {
      address = 'https://www.pageguo.com/file_system/index.html'
    } else if (baseURLNew == 'https://www.wallstreettequila.com/api-prod/') {
      address = 'https://wallstreettequila.com/file_system/index.html'
    }
    console.log(encodeURI(fileName), decodeURI(encodeURI(fileName)))
    window.open(`${address}?fileName=${encodeURI(fileName)}&token=${btoa(window.vue.$store.state.role.token)}&userId=${window.vue.$store.state.role.userInfo.userId || ''}`, `${fileName}`, 'toolbar=no, width=1300, height=900')
  } else {
    util.sessions.set('fileName', fileName)
    window.open(router.href, '_blank', 'toolbar=no, width=1300, height=900')
  }
}

file.preview2 = function (fileName) {
  console.log(fileName, window.vue.$router, 'file preview2')
  const router = window.vue.$router.resolve({
    name: 'FilePreview2'
  })
  if (util.getQueryString('mac')) {
    console.log(process.env.VUE_APP_API)
    const baseURLNew = process.env.VUE_APP_API
    let address = ''
    if (baseURLNew == 'https://www.pageguo.com/api-test/') {
      address = 'https://www.pageguo.com/file_system/index.html'
    } else if (baseURLNew == 'https://www.wallstreettequila.com/api-prod/') {
      address = 'https://wallstreettequila.com/file_system/index.html'
    }
    console.log(encodeURI(fileName), decodeURI(encodeURI(fileName)))
    window.open(`${address}?fileName=${encodeURI(fileName)}&token=${btoa(window.vue.$store.state.role.token)}&userId=${window.vue.$store.state.role.userInfo.userId || ''}`, `${fileName}`, 'toolbar=no, width=1300, height=900')
  } else {
    util.sessions.set('fileName', fileName)
    window.open(router.href, '_blank', 'toolbar=no, width=1300, height=900')
  }
}

/**
 * @description: 文件下载
 * @param {*}
 * @return {*}
 */
file.downloadFile = function (fileName, callback) {
  const data = util.sessions.get('upload')
  let tiem
  if (data) {
    tiem = new Date(data.expiration)
  }
  const tiem2 = new Date()
  if ((data === null || (tiem - tiem2) < 15 * 60 * 1000)) { //  超时或者失效时重新获取一次需要的凭证
    api.ossStsToken().then(({
      data
    }) => {
      const client = new OSS({
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.securityToken,
        endpoint: data.endpoint,
        // cname:true,
        bucket: data.bucketName
      })
      util.sessions.set('upload', data)
      const url = client.signatureUrl(fileName)
      // window.open(url);
      // callback(url)
      file.downloadByOnlineURL(url, fileName.split('/').slice(-1)[0])
    })
  } else {
    const client = new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      // cname:true,
      bucket: data.bucketName
    })
    const url = client.signatureUrl(fileName)
    // window.open(url);
    // callback(url)
    file.downloadByOnlineURL(url, fileName.split('/').slice(-1)[0])
  }
}

/**
 * @description: 根据文件地址，直接下载文件到本地
 * @param {*}
 * @return {*}
 */
file.downloadByOnlineURL = function (url, filename) {
  const xhr = new XMLHttpRequest()

  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = () => {
    if (xhr.status === 200) {
      FileSaver.saveAs(xhr.response, filename)
    }
  }
  xhr.send()
}
// 图片上传剪切
file.uploadImgBackUrlCropper = function (name, file, callback) {
  const file_name = name.replace(/[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/g, '_')
  const fileName = 'company_logo/' + fmtDate(new Date(), 'yyyy-MM-dd') + '-' + guid() + '/' + file_name
  api.ossStsToken().then(({
    data
  }) => {
    const client = new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      bucket: data.bucketName
    })
    async function getACL () {
      try {
        await client.putACL(fileName, 'public-read')
      } catch (e) {
        console.log(e)
      }
    }
    client.put(fileName, file).then(result => {
      getACL()
      callback(result.url)
    }).catch(err => {
      console.log(err)
      alert('网络链接超时，请检查网络状况、vpn等')
    })
  })
}
/**
 * @description: 文件上传
 * @param {*}
 * @return {*}
 */
file.uploadFunBySys = (file, path, callback) => {
  // 直接走oss上传 失败后调用系统上传
  window.vue.$loading()
  const file_name = file.name.replace(/[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/g, '_')
  if (file_name.split('.').length < 2) {
    window.vue.$loading().close()
    window.vue.$message({
      message: '上传文件无后缀名',
      type: 'error'
    })
    return
  }
  console.log(file.name, 'yx1111111111111111111', file_name, 'yx*******************文件名')
  const fileName = `${path}/${util.guid()}_${util.fmtDate(new Date(), 'yyyy-MM-dd')}/${file_name}`
  const data = util.sessions.get('upload')
  let tiem
  if (data) {
    tiem = new Date(data.expiration)
  }
  const tiem2 = new Date()
  // 判断超时
  api.ossStsToken().then(({
    data
  }) => {
    const client = () => new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      // cname:true,
      bucket: data.bucketName
    })
    var checkPoint = 0
    const ossUpload = () => {
      const option = {
        progress: function (p, checkpoint) { // 获取进度条的值
          console.log(p)
          // progress(Math.round(p * 100));
          checkPoint = checkpoint
        },
        partSize: 1000 * 1024, // 设置分片大小
        timeout: 120000 // 设置超时时间
      }
      if (checkPoint) {
        option.checkpoint = checkPoint
      }
      client().multipartUpload(
        fileName,
        file,
        option
      ).then(result => {
        // 下面是如果对返回结果再进行处理，根据项目需要
        callback(result.name)
        window.vue.$loading().close()
      }).catch(err => {
        window.vue.$loading().close()
        console.error('err:', err)
        ossUpload()
      })
    }
    ossUpload()
  })
}
// 拿照片绝对路径
file.getImgUrl = (fileName, callback) => {
  const data = util.sessions.get('upload')
  let tiem
  if (data) {
    tiem = new Date(data.expiration)
  }
  const tiem2 = new Date()
  if ((data === null || (tiem - tiem2) < 15 * 60 * 1000)) {
    api.ossStsToken().then(({
      data
    }) => {
      const client = new OSS({
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.securityToken,
        endpoint: data.endpoint,
        // cname:true,
        bucket: data.bucketName
      })
      util.sessions.set('upload', data)
      const url = client.signatureUrl(fileName)
      callback(url)
    })
  } else {
    const client = new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      // cname:true,
      bucket: data.bucketName
    })
    const url = client.signatureUrl(fileName)
    // window.open(url);
    callback(url)
  }
}
// 上传返回了进度条的
file.uploadFun = (file, path, progress, callback) => {
  window.vue.$loading()
  var fileInit = file.name.replace(/[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/g, '_')
  console.log(file, 'yx1111111111111111111', fileInit, 'yx*******************文件名')
  const fileName = `${path}/${fmtDate(new Date(), 'yyyy-MM-dd')}/${util.guid()}_${fileInit}`
  // 判断超时
  api.ossStsToken().then(({
    data
  }) => {
    const client = () => new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      bucket: data.bucketName
    })
    var checkPoint = 0
    const ossUpload = () => {
      const option = {
        progress: function (p, checkpoint) { // 获取进度条的值
          progress(Math.round(p * 100))
          checkPoint = checkpoint
        },
        partSize: 1000 * 1024, // 设置分片大小
        timeout: 120000 // 设置超时时间
      }
      if (checkPoint) {
        option.checkpoint = checkPoint
      }
      client().multipartUpload(
        fileName,
        file,
        option
      ).then(result => {
        callback(result.name)
      }).catch(err => {
        console.error('err:', err)
        ossUpload()
      })
    }
    ossUpload()
  })
}
// 上传返回了进度条的
file.uploadFunSpeed = (file, path, progress, callback) => {
  window.vue.$loading()
  var fileInit = file.name.replace(/[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/g, '_')
  var index = fileInit.lastIndexOf('.')
  var ext = `.${fileInit.substring(index + 1)}`
  const fileName = `${path}/${fmtDate(new Date(), 'yyyy-MM-dd')}/${util.guid()}${ext}`
  console.log(file, 'yx1111111111111111111', fileName, 'yx*******************文件名')
  // 判断超时
  api.ossStsToken().then(({
    data
  }) => {
    const client = () => new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      bucket: data.bucketName
    })
    var checkPoint = 0
    const ossUpload = () => {
      const option = {
        progress: function (p, checkpoint) { // 获取进度条的值
          progress(Math.round(p * 100))
          checkPoint = checkpoint
        },
        partSize: 1000 * 1024, // 设置分片大小
        timeout: 120000 // 设置超时时间
      }
      if (checkPoint) {
        option.checkpoint = checkPoint
      }
      client().multipartUpload(
        fileName,
        file,
        option
      ).then(result => {
        callback(result.name)
      }).catch(err => {
        console.error('err:', err)
        ossUpload()
      })
    }
    ossUpload()
  })
}
/**
 *
 * @param {file} file 源文件
 * @desc 限制为图片文件
 * @retutn 是图片文件返回true否则返回false
 */
file.isImageFile = (file, fileTypes) => {
  const types = fileTypes || [
    'image/png',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/bmp',
    'image/x-icon'
  ]
  const isImage = types.includes(file.type)
  if (!isImage) {
    Message.error('上传文件非图片格式，请上传png,jpg,jpeg类型的文件')
    return false
  }

  return true
}
/**
 *
 * @param {file} file 源文件
 * @param {number} fileMaxSize  图片限制大小单位（MB）
 * @desc 限制为文件上传大小
 * @retutn 在限制内返回true否则返回false
 */
file.isMaxFileSize = (file, fileMaxSize = 2) => {
  const isMaxSize = file.size / 1024 / 1024 < fileMaxSize
  if (!isMaxSize) {
    Message.error('上传头像图片大小不能超过 ' + fileMaxSize + 'MB!')
    return false
  }
  return true
}
/**
 *
 * @param {file} file 源文件
 * @desc 读取图片文件为base64文件格式
 * @retutn 返回base64文件
 */
file.readFile = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const data = e.target.result
      resolve(data)
    }
    reader.onerror = () => {
      const err = new Error('读取图片失败')
      reject(err.message)
    }

    reader.readAsDataURL(file)
  })
}

file.returnImgSrc = (imgUrl, callback) => {
  const data = util.sessions.get('upload')
  let tiem
  if (data) {
    tiem = new Date(data.expiration)
  }
  const tiem2 = new Date()
  if ((data === null || (tiem - tiem2) < 15 * 60 * 1000)) {
    api.ossStsToken().then(({ data }) => {
      const client = new OSS({
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.securityToken,
        endpoint: data.endpoint,
        bucket: data.bucketName,
        timeout: '5s'
      })
      util.sessions.set('upload', data)
      setTimeout(() => {
        util.sessions.remove('upload')
      }, 1800000)
      const url = client.signatureUrl(imgUrl)
      callback(url)
    })
  } else {
    const client = new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      bucket: data.bucketName,
      timeout: '5s'
    })
    const url = client.signatureUrl(imgUrl)
    callback(url)
  }
}
/**
 *
 * @param {string} src  图片地址
 * @desc 加载真实图片
 * @return 读取成功返回图片真实宽高对象 ag: {width:100,height:100}
 */
file.loadImage = src => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      const data = {
        width: image.width,
        height: image.height
      }
      resolve(data)
    }
    image.onerror = () => {
      const err = new Error('加载图片失败')
      reject(err)
    }
  })
}
// 系统默认私有权限，本方法更新为公开权限
file.uploadImgBackUrlCropper = (name, file, callback) => {
  const file_name = name.replace(/[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/g, '_')
  const fileName = 'company_logo/' + fmtDate(new Date(), 'yyyy-MM-dd') + '-' + util.guid() + '/' + file_name
  api.ossStsToken().then(({
    data
  }) => {
    const client = new OSS({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      endpoint: data.endpoint,
      bucket: data.bucketName
    })
    async function getACL () {
      try {
        await client.putACL(fileName, 'public-read')
      } catch (e) {
        console.log(e)
      }
    }
    client.put(fileName, file).then(result => {
      getACL()
      callback(result.url)
    }).catch(err => {
      console.log(err)
      alert('网络链接超时，请检查网络状况、vpn等')
    })
  })
}
export default file
export const uploadFunBySys = file.uploadFunBySys
export const downloadFun = file.preview
export const downloadFunD = file.downloadFile
export const uploadFun = file.uploadFun
export const uploadFunSpeed = file.uploadFunSpeed
export const getImgUrl = file.getImgUrl
export const isImageFile = file.isImageFile
export const isMaxFileSize = file.isMaxFileSize
export const uploadImgBackUrlCropper = file.uploadImgBackUrlCropper
export const readFile = file.readFile
