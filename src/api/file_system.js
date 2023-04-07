/*
 * @Author: 库建华
 * @Date: 2019-07-09 09:32:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 10:41:38
 * @Version: 1
 * @Description:
 */
import axios from '@/plugin/axios'

export default {
  getFileList (params) {
    return axios.get('/file/fileList', { params: params })
  },
  getFileTree () {
    return axios.get('/file/tree/topNodes')
  },
  // getFileTree(){
  //     return axios.get(`/file/tree`);
  // },
  setFile (data) {
    return axios.post('/file/saveFile', data)
  },
  collectionFile (data) {
    return axios.post('/file/collection', data)
  },
  getUsersPermissionListByFileId (fileId) {
    return axios.get(`/file/${fileId}/accessList`)
  },
  setPermission (data) {
    return axios.post('/file/access', data)
  },
  getFilePreviewUrlByUrl (url) {
    return axios.get('/file/previewUrl', { params: url })
  },
  getCollectionList (params) {
    return axios.get('/file/collectionList', { params: params })
  },
  uploadFile (path, file) {
    console.log(file)
    return axios.post(`/file/upload2?path=${path}`, { source: { file }, size: file.size })
  },
  remarkFileDowload (fileId) {
    return axios.post('/file/log', { fileId: fileId, fileAction: 'download' })
  },
  getDownloadFileByIdsAndEmail (params) {
    return axios.get('/file/batchDownload', { params: params })
  },
  getPreview (data) {
    return axios.get(`/file/previewV2?filePath=${data}`)
  },
  getRefreshPreview (data) {
    return axios.get('/file/refreshPreview', { data: data })
  }
}
