<!--
 * @Author: Kaan
 * @Date: 2022-04-11 14:40:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-08 15:16:55
 * @version:
 * @Descripttion:
-->
<template>
  <d2-container class="yx_white" v-loading="loading">
    <div class="d2_container "  ref="d2">
      <div class="header-shelf-main">
        <div class="main-shelf">
            <div class="main-shelf-right">
                <div class="bookShelfUrl">
                    <ul class="bookShelfUrl-ul" v-if="!searchVisible">
                      <li class="bookShelfUrl-li" v-for="(item,i) in htmlPath" :key="i">
                          <div class="bookShelfUrl-header" @click="clickShelf(item.shelfId)" >{{item.shelfName}}</div>
                          <div class="bookShelfUrl-icon">></div>
                      </li>
                    </ul>
                    <ul class="bookShelfUrl-ul" v-else>
                      内容为<span class="msgAlert">&nbsp&nbsp{{searchStr}}&nbsp&nbsp</span>的搜索结果&nbsp&nbsp<span class="msgAlert2" @click="returnSearch">返回</span>
                    </ul>
                    <div class="OFaPaO">
                        <div class="wlv03D" node-type="txvrpM">
                            <input node-type="kovBMk eiNWbM" data-key="SEARCH_QUERY" placeholder="搜索您的文件" autocomplete="off" class="meNE4J" name="q" v-model="search"  spellchecking="off" type="text">
                        </div>
                        <div class="icon-btn_block" @click="searchFile()">
                            <i class="icon-btn_search" ></i>
                        </div>
                    </div>
                    <i class="grid-btn" v-if="showGrid" @click="clickChange()"></i>
                    <i class="menu-btn" v-else @click="clickChange()"></i>
                    <div class="bookNum-show" v-if="!searchVisible">已全部加载，共{{total}}</div>
                    <div class="bookNum-show" v-else>{{stringMsg}}</div>
                </div>
                <div class="noGrid-main" v-if="showGrid">
                    <div class="kongFolder">
                        <div class="kongFolder-next">
                            <img src="../../../assets/img/emptyfile_intro_2c07710.png" alt="">
                            <div class="kongFolder-text">此文件夹暂无文件</div>
                        </div>
                    </div>
                    <div class="kongFolder2" v-if="kongFolder2">
                        <div class="kongFolder-next">
                            <img src="../../../assets/img/wx_chat_empty.png" alt="">
                        </div>
                    </div>
                    <div class="bookShilf-list" v-if="bookShilf_list">
                      <div class="QxJxtg" style="display: block;">
                          <div class="xGLMIab">
                              <ul class="QAfdwP tvPMvPb" node-type="tvPMvPb" style="display: flex;">
                                  <li data-key="name" class="fufHyA yfHIsP" style="flex:1">
                                      <span class="text">文件名</span>
                                  </li>
                                  <li data-key="size" class="fufHyA" style="width:11%;">
                                      <span class="text">大小</span>
                                  </li>
                                  <li data-key="time" class="fufHyA gObdAzb MCGAxG" style="width:38%;">
                                      <span class="text textTe">{{textTe}}</span>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <ul class="bookShelfDetail" v-if="!searchVisible">
                        <li v-for="(item,i) in bookShelfHtml" :key="i+'n'" @click="clickShelf(item.shelfId)" class="g-clearfix g-clearfix2 AuPKyz open-enable"  _position="0" _cmd_installed="1" _installed="1">
                          <ul class="QAfdwP tvPMvPb" node-type="tvPMvPb" style="display: flex;">
                              <li data-key="name" class="fufHyA yfHIsP" style="flex:1">
                                  <i class="icon-fold"></i>
                                  <span class="text text-color">{{item.shelfName}}</span>
                              </li>
                              <li data-key="size" class="fufHyA" style="width:11%;">
                                  <span class="text">-</span>
                              </li>
                              <li data-key="time" class="fufHyA gObdAzb MCGAxG" style="width:38%;">
                                  <span class="text">-</span>
                              </li>
                          </ul>
                        </li>
                        <li v-for="(item,i) in bookHtml" :key="i+'m'" class="g-clearfix g-clearfixBook AuPKyz open-enable" _position="0" _cmd_installed="1" _installed="1">
                          <ul class="QAfdwP tvPMvPb" node-type="tvPMvPb" style="display: flex;">
                            <li data-key="name" class="fufHyA yfHIsP" style="flex:1">
                              <i class="icon-img" :class="item.fileType.slice(1)" ></i>
                              <span class="text textTeYx">{{item.bookName}}</span>
                              <span class="text text-color text-preview preview-btn" @click="clickJump(item.bookId,item.fileUrl,item.fileType.slice(1))">预览</span>
                              <span class="text text-color text-preview preview-btn1 preview-btn2" @click="clickJump2(item.bookId)">分享</span>
                            </li>
                            <li data-key="size" class="fufHyA" style="width:11%;">
                              <span class="text ">{{item.fileSize / 1024 > 1000 ? Math.round(item.fileSize / 1024 / 10.24) / 100 + 'MB' : Math.round(item.fileSize / 10.24) / 100 + 'KB'}}</span>
                            </li>
                            <li data-key="time" class="fufHyA fufHyATe gObdAzb MCGAxG MCGAxGTe" style="width:38%;">
                              <span class="text">{{item.updateTime}}</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul class="bookShelfDetail" v-else>
                        <li v-for="(item,i) in searchData" :key="i+'l'" class="g-clearfix g-clearfixBook AuPKyz open-enable" _position="0" _cmd_installed="1" _installed="1">
                          <ul class="QAfdwP tvPMvPb" node-type="tvPMvPb" style="display: flex;">
                            <li data-key="name" class="fufHyA yfHIsP" style="flex:1">
                              <i class="icon-img" :class="item.fileType.slice(1)" ></i>
                              <span class="text textTeYx textPosttionTe">
                                {{item.bookName.substring(0, item.searchIndex)}}<span class="yangxiBg">{{item.bookName.substring(item.searchIndex, item.searchIndex + searchStr.length)}}</span>{{item.bookName.substring(item.searchIndex + searchStr.length)}}
                              </span>
                              <span class="text text-color text-preview preview-btn" @click="clickJump(item.bookId,item.fileUrl,item.fileType.slice(1))">预览</span>
                              <span class="text text-color text-preview preview-btn1 preview-btn2" @click="clickJump2(item.bookId)">分享</span>
                            </li>
                            <li data-key="size" class="fufHyA" style="width:11%;">
                                <span class="text ">{{item.fileSize / 1024 > 1000 ? Math.round(item.fileSize / 1024 / 10.24) / 100 + 'MB' : Math.round(item.fileSize / 10.24) / 100 + 'KB'}}</span>
                            </li>
                            <li data-key="time" class="fufHyA fufHyATe gObdAzb MCGAxG" style="width:38%;">
                              <span class="text textSearch">
                                <span v-if="item.status" class="shelf_search" @click="clickShelf(item.newShelfId)" >{{item.newShelfName}}</span>
                                <span v-else class="shelf_search" @click="clickShelf(item.newShelfId)" >{{item.newShelfName}}/ </span>
                                <br>
                              </span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                </div>
                <div class="Grid-main" v-else>
                    <div class="kongFolder" v-if="kongFolder">
                        <div class="kongFolder-next">
                            <img src="../../../assets/img/emptyfile_intro_2c07710.png" alt="">
                            <div class="kongFolder-text">此文件夹暂无文件</div>
                        </div>
                    </div>
                    <div class="bookShilf-list_grid" v-if="bookShilf_list_grid">
                        <ul class="bookShelfDetail-grid" v-if="!searchVisible">
                          <li  class="box-gridMain box-gridMain2" v-for="(item,i) in bookShelfHtml" :key="i+'h'" @click="clickShelf(item.shelfId)">
                              <div class="grid-img_box fold-grid"></div>
                              <div class="grid-img_name">{{item.shelfName}}</div>
                          </li>
                          <li class="box-gridMain"  v-for="(item,i) in bookHtml" :key="i+'j'">
                            <div v-if="item.bookCover" :class="`${item.fileType.slice(1)}-grid`" class="grid-img_box2 " :style="{backgroundImage:'url('+item.bookCover+')'}"></div>
                            <div v-else class="grid-img_box" :class="`${item.fileType.slice(1)}-grid`"  ></div>
                            <div class="maskShow">
                              <div class="preview-btn showFirst" @click="clickJump(item.bookId,item.fileUrl,item.fileType.slice(1))">预览</div>
                              <div class="preview-btn1 showSecond" @click="clickJump2(item.bookId)">分享</div>
                            </div>
                            <div class="grid-img_name ">{{item.bookName}}</div>
                          </li>
                        </ul>
                        <ul class="bookShelfDetail-grid" v-else>
                          <li class="box-gridMain" v-for="(item,i) in searchData" :key="i+'k'">
                            <div v-if="item.bookCover" class="grid-img_box2" :class="`${item.fileType.slice(1)}-grid`" :style="{backgroundImage:'url('+item.bookCover+')'}" ></div>
                            <div class="maskShow">
                              <div class="preview-btn showFirst" @click="clickJump(item.bookId,item.fileUrl,item.fileType.slice(1))">预览</div>
                              <div class="preview-btn1 showSecond" @click="clickJump2(item.bookId)">分享</div>
                            </div>
                            <div class="grid-img_name "> {{item.bookName.substring(0, item.searchIndex)}}<span class="yangxiBg">{{item.bookName.substring(item.searchIndex, item.searchIndex + searchStr.length)}}</span>{{item.bookName.substring(item.searchIndex + searchStr.length)}}</div>
                          </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <el-dialog
        width="800px"
        :visible.sync="shareVisible"
        :before-close="close"
        :close-on-click-modal="false"
      >
        <div style="text-align:center" class="mb20">链接：{{shareDetail.webPathUrl}}
          <el-button class="ml20" type="primary" size="mini" @click="copyCode(shareDetail.webPathUrl)" >复制</el-button>
        </div>
        <div style="text-align:center" v-if="shareDetail.codeImageUrl">
            <el-image  style="width: 300px; height: auto; " :preview-src-list="[shareDetail.codeImageUrl || '']" :src="shareDetail.codeImageUrl || ''" fit="cover"></el-image>
            <div>
              <el-button type="primary" @click="downImg(shareDetail.codeImageUrl)">下载</el-button>
            </div>
        </div>
      </el-dialog>
      <el-dialog
        width="1200px"
        v-if="playerVisible"
        :destroy-on-close="true"
        :visible.sync="playerVisible"
        :before-close="closePlayer"
        :close-on-click-modal="false"
      >
        <div style="width:1000px;height:700px;position:relative">
          <fileDialog />
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import fileDialog from '../../file/preview2.vue'
import { mapState } from 'vuex'
import file from '@/libs/file'

export default {
  mixins: [mixins],
  name: 'bookShelf',
  components: { fileDialog },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      playerVisible: false,
      loading: false,
      kongFolder2: false,
      bonfire_pageloader: false,
      showGrid: true,
      textTe: '修改日期',
      stringMsg: '',
      kongFolder: false,
      shareVisible: false,
      bookShilf_list_grid: false,
      bookShilf_list: false,
      htmlPath: [],
      bookShelfHtml: [],
      bookHtml: [],
      bookShelfGridHtml: [],
      bookGridHtml: [],
      searchStr: '',
      shareDetail: {
        webPathUrl: '',
        codeImageUrl: ''
      },
      searchData: [],
      total: 0,
      searchVisible: false,
      search: ''
    }
  },
  watch: {},
  mounted () {
    this.init()
  },
  methods: {
    init (shelfId, type, searchData, searchVal) {
      if (!shelfId) {
        shelfId = 'root'
      }
      if (!type) {
        this.kongFolder2 = false
        this.loading = true
        this.textTe = '修改日期'
        this.searchVisible = false
        api.getBookShelf(shelfId).then(res => {
          res.data.shelfPathArr = res.data.shelfPathArr.reverse()
          this.htmlPath = res.data.shelfPathArr
          this.bookShelfHtml = res.data.subShelfArr
          this.bookHtml = res.data.subBookArr
          this.total = res.data.subShelfArr.length + res.data.subBookArr.length
          this.loading = false
          console.log(this.bookShelfHtml.length, this.bookHtml.length)
          console.log(this.bookShelfHtml, 'bookShelfHtml')
          console.log(this.bookHtml, 'subBookArr')
          if (this.bookShelfHtml.length > 0 || this.bookHtml.length > 0) {
            this.bookShilf_list_grid = true
            this.bookShilf_list = true
            this.kongFolder = false
          } else {
            this.kongFolder = true
            this.bookShilf_list_grid = false
            this.bookShilf_list = false
          }
          this.total = res.data.subShelfArr.length + res.data.subBookArr.length
        })
      } else {
        this.searchVisible = true
        this.kongFolder = false
        this.textTe = '文件目录'
        let val = searchVal
        val = val.toLowerCase()
        this.searchStr = searchVal
        for (let i = 0; i < this.searchData.length; i++) {
          if (this.searchData[i].shelfPathArr.length) {
            this.searchData[i].shelfPathArr = this.searchData[i].shelfPathArr.slice(0, 2)
            for (let j = 0; j < this.searchData[i].shelfPathArr.length; j++) {
              if (this.searchData[i].shelfPathArr[j].length) {
                this.searchData[i].shelfPathArr[j] = this.searchData[i].shelfPathArr[j].reverse()
                for (let m = 0; m < this.searchData[i].shelfPathArr[j].length; m++) {
                  if (this.searchData[i].shelfPathArr[j][m]) {
                    this.searchData[i].newShelfId = this.searchData[i].shelfPathArr[j][m].shelfId
                    this.searchData[i].newShelfName = this.searchData[i].shelfPathArr[j][m].shelfName
                    if (m == this.searchData[i].shelfPathArr[j].length - 1) {
                      this.searchData[i].status = true
                    } else {
                      this.searchData[i].status = false
                    }
                  }
                }
              }
            }
          }
        }
        this.searchData = searchData
        this.searchData.forEach(item => {
          item.searchIndex = item.bookName.toLowerCase().indexOf(val)
        })
        const total = searchData.length
        if (searchData.length > 0) {
          this.bookShilf_list_grid = true
          this.bookShilf_list = true
          this.kongFolder2 = false
        } else {
          this.kongFolder2 = true
          this.bookShilf_list = false
          this.bookShilf_list_grid = false
        }
        if (total < 20) {
          this.stringMsg = `已全部加载，共${total}个`
        } else {
          this.stringMsg = '最多搜索20个匹配度较高的'
        }
      }
    },
    closePlayer () {
      this.playerVisible = false
    },
    clickShelf (shelfId) {
      this.init(shelfId)
    },
    clickJump (bookId, fileUrl, fileType) {
      api.getBookDetail(bookId).then(res => {
        console.log(res, fileType)
        if (res.data.previewInfo) {
          this.previewInfo = res.data.previewInfo
          const baseURLNew = process.env.VUE_APP_API
          let address = ''
          if (baseURLNew == 'https://www.pageguo.com/api-test/') {
            address = `https://www.pageguo.com/file_system_rms/BookDetail.html?PreviewURL=${this.previewInfo.PreviewURL}&AccessToken=${this.previewInfo.AccessToken}`
          } else {
            address = `http://wallstreettequila.com/file_system_rms/BookDetail.html?PreviewURL=${this.previewInfo.PreviewURL}&AccessToken=${this.previewInfo.AccessToken}`
          }
          window.open(`${address}`, 'toolbar=no, width=1300, height=900')
        } else {
          if (fileType == 'mp3' || fileType == 'mp4' || fileType == 'mp5' || fileType == 'mov' || fileType == 'mkv' || fileType == 'm4a' || fileType == 'flv') {
            sessionStorage.setItem('fileUrl', res.data.fileUrl)
            this.playerVisible = true
            // file.preview2(res.data.fileUrl)
          } else {
            this.$message({
              type: 'warning',
              message: '此文件类型不支持预览 ！！！'
            })
          }
        }
        // if (res.data.previewUrl) {
        //   window.open(res.data.previewUrl || res.data.fileUrl)
        //   sessionStorage.setItem('previewInfo', JSON.stringify(res.data.previewInfo))
        // } else {
        //   sessionStorage.setItem('fileUrl', res.data.fileUrl)
        //   file.preview2(res.data.fileUrl)
        // }
      })
    },
    clickJump2 (bookId) {
      api.getBookShare(bookId).then(res => {
        console.log(res.data)
        this.shareVisible = true
        this.shareDetail = res.data
      })
    },
    copyCode (code) {
      this.$copyText(code).then(() => {
        this.$confirm('链接已复制成功', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    close () {
      this.shareVisible = false
      this.shareDetail = {
        webPathUrl: '',
        codeImageUrl: ''
      }
    },
    searchFile () {
      console.log(11, this.search)
      const val = this.search
      if (val) {
        this.loading = true
        const data = { search: val }
        api.getBookSearch(data).then(res => {
          this.init('', true, res.data, val)
          this.loading = false
        })
      }
    },
    returnSearch () {
      this.init()
    },
    downImg (url) {
      window.open(url)
    },
    clickChange () {
      this.showGrid = !this.showGrid
      console.log(this.showGrid)
    }
  }
}
</script>
<style >
  .yx_white  .d2-container-full__body{
    background: #fff !important;
  }
</style>
<style lang="scss" scoped>

  html,body{
    width: 100%;
    /* height: 100%; */
    min-width: 1440px !important;
  }
  body{
      background-size: cover;
      background-position: center;
      position: relative;
      box-sizing: border-box;
  }
  .return-book{
      position: absolute;
      left: 50px;
      top: 50px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #409EFF;
      color: #fff;
      line-height: 100px;
      font-size: 16px;
      text-align: center;
      transition: all ease-in 200ms;
  }
  .return-book a{
      color: #fff !important;
  }
  .bookShelfUrl-header{
      color: #409EFF;
      cursor: pointer;
  }
  .bookShelfUrl-ul .bookShelfUrl-li:last-child .bookShelfUrl-header{
      cursor: default;
      color: #666;
  }
  .bookShilf-list{
      box-sizing: border-box;
      padding: 0 20px;
  }
  .bookShelfUrl{
      position: relative;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      line-height: 16px;
      color: #666;
  }
  .bookShelfUrl-ul{
      display: flex;
      line-height: 30px;
      position: relative;
  }
  .bookShelfUrl-li{
      display: flex;
  }

  .bookShelfUrl-icon{
      margin-left: 5px;
      margin: 0 10px;
      color: #409EFF;
  }
  .bookShelfUrl-ul .bookShelfUrl-li:last-child .bookShelfUrl-icon{
      display: none;
  }
  .kongFolder2{
      text-align: center;
      min-height: 400px;
      position: relative;
  }
  .kongFolder{
      text-align: center;
      min-height: 400px;
      display: none;
      position: relative;
  }
  .kongFolder-next{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
  }
  .kongFolder-text{
      color: #424e67;
      margin: 20px 0;
      font-weight: 200;
  }
  .bookShelfDetail{
      text-align: center;
      min-height: 400px;
  }
  .bookShelfDetail-li {
      background-color: #898989;
      margin-right: 20px;
  }
  .bookShelfDetail-li:hover{
      cursor: pointer;
  }
  .bookShelfDetail{
  }
  .bookShelfDetailUl-shelfName{
      padding: 0px 10px;
      font-size: 14px;
      line-height: 18px;
      background-color: #409EFF;
      color: #fff;
  }
  .KPDwCE .QxJxtg {
      height: 36px;
  }
  .KPDwCE .QxJxtg {
      z-index: 3;
  }
  .KPDwCE .QxJxtg {
      position: relative;
      z-index: 1;
      height: 52px;
      font-size: 12px;
  }
  .text{
      font-size: 12px;
  }
  .grid-img_box{
      position: relative;
      margin: 9px auto 0;
      width: 84px;
      height: 84px;
      background-repeat: no-repeat;
      overflow: hidden;
      background-position: center;
      background-image: url('../../../assets/icon/wenjian.png');
  }
  .icon-fold{
      width: 26px;
      min-height: 26px;
      display: inline-block;
      background-image: url('../../../assets/icon/Folder_24_35f88d9 (2).png');
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 10px;
      margin-left: 40px;
      background-size: 100%,auto;
  }
  .icon-img{
      background-image: url('../../../assets/icon/wenjian.png');
      width: 26px;
      min-height: 26px;
      max-height: 32px;
      display: inline-block;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 10px;
      margin-left: 40px;
      background-size: 100%,100%;
  }
  .fufHyA{
      display: flex;
      position: relative;
  }
  .fufHyATe{
      min-height: 30px;
  }

  .yfHIsP{
  }
  .bookShelfDetail > li{
      border-bottom: 1px solid #f2f6fd;
      line-height: 30px;
      min-height: 30px;
      padding: 7px 0px;
      font-size: 12px;
      text-align: left;
      width: 100%;
  }
  .bookShelfDetail > li:hover{
      background-color: #f4fbff;
      cursor: pointer;
  }
  .text-color:hover{
      color: #3794ff;
  }
  .NHcGw .AuPKyz{
  }
  .text-preview{
      display: none;
      position: absolute;
      top: 50%;
      right: 68px;
      transform: translate(0%,-50%);
      transition: all ease-in 200ms;
      font-weight: 500;
  }
  .preview-btn2{
      // display: none !important;
      right: 20px;
  }
  .text-preview {
      color: #222;
  }
  .text-preview:hover {
      color: #3794ff;
  }
  .g-clearfixBook:hover .text-preview{
      display: block;
  }
  .pptx-grid,.ppt-grid,.PPT-grid{
      background-image: url('../../../assets/icon/PPT_54_0eb8805.png');
  }
  .docx-grid,.doc-grid,.word-grid{
      background-image: url('../../../assets/icon/Word_54_661a5bf.png');
  }
  .xlsx-grid,.xls-grid,.xlsm-grid{
      background-image: url('../../../assets/icon/Excel_54_a923c0a.png');
  }
  .pdf-grid,.PDF-grid{
      background-image: url('../../../assets/icon/PDF_54_85c3cb5.png');
  }
  .mp4-grid,.avi-grid,.mp3-grid,.mkv-grid,.m4a-grid,.mov-grid,.wmv-grid,.flv-grid{
      background-image: url('../../../assets/icon/Video_24_94bee9e.png');
      background-size: 56px, auto;
      background-position: center;
  }

  .pptx,.ppt,.PPT{
      background-image: url('../../../assets/icon/PPT_24_4112bb0.png');
  }
  .docx,.doc,.word{
      background-image: url('../../../assets/icon/Word_24_b91d37e.png');
  }
  .xlsx,.xls,.xlsm{
      background-image: url('../../../assets/icon/Excel_24_aa33358.png');
  }
  .pdf,.PDF{
      background-image: url('../../../assets/icon/PDF_24_928dc9a.png');
  }
  .mp4,.avi,.mp3,.mkv,.m4a,.mov,.wmv,.flv{
      background-image: url('../../../assets/icon/Video_24_94bee9e2.png');
  }
  .grid-btn{
      opacity: 0.8;
      position: absolute;
      width: 24px;
      display: block;
      height: 24px;
      background-image: url('../../../assets/icon/grid.png');
      background-size: cover;
      right: 175px;
      top: 50%;
      transition: all ease-in 100ms;
      transform: translate(0,-50%);
  }
  .menu-btn{
      opacity: 0.8;
      position: absolute;
      width: 24px;
      display: block;
      height: 24px;
      background-image: url('../../../assets/icon/menu-two.png');
      background-size: cover;
      right: 175px;
      top: 50%;
      transition: all ease-in 100ms;
      transform: translate(0,-50%);
  }
  .menu-btn:hover{
      cursor: pointer;
      opacity: 1;
  }
  .grid-btn:hover{
      cursor: pointer;
      opacity: 1;
  }
  .header-shelf{
      height: 60px;
      background-color: #fff;
      position: relative;
      box-shadow: 0 2px 6px 0 rgba(0,0,0,.05);
  }
  .main-shelf{
      display: flex;
  }
  .main-shelf-left{
      width: 100px;
      background-color: rgba(247,247,247);
  }
  .main-shelf-right::-webkit-scrollbar {
      width: 8px;
      height: 6px;
  }
  .main-shelf-right::-webkit-scrollbar-thumb {
      border-radius: 10px;
      border: 0.5px solid rgba(255,255,255,0.3);
      /* background:  rgba(195,46,71,0.8); */
      /* background:  rgba(64,158,255,0.8); */
      background:  rgba(0,0,0,0.4);

  }
  .main-shelf-right::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
      border-radius: 10px;
      background: #ccc;
  }
  .main-shelf-right{
      flex: 1;
      padding-bottom: 50px;
      box-sizing: border-box;
  }
  .header-shelf-main{
      height: 100%;
  }
  .noGrid-main{
      border-top: 1px solid #f2f6fd;
      margin-top: 30px;
  }
  .Grid-main{
      margin-top: 30px;
      border-top: 1px solid #f2f6fd;
  }
  .bookShelfDetail-grid{
      display: flex;
      overflow: hidden;
      flex-wrap: wrap;
  }
  .box-gridMain{
      border-radius: 4px;
      overflow: hidden;
      width: 120px;
      height: 127px;
      float: left;
      margin: 4px 0 0 6px;
      text-align: center;
      border: 1px solid #fff;
      position: relative;
  }
  .showFirst,.showSecond{
      font-size: 14px;
      color: #fff;
      flex: 1;
      height: 127px;
      line-height: 127px;
  }
  .showFirst:hover,.showSecond:hover{
      color: #409EFF;
  }
  .maskShow{
      display: flex;
      opacity: 0;
      transition: all ease-in 100ms;
  }
  .box-gridMain:hover .maskShow{
      opacity: 1;
  }
  .box-gridMain a{
      color: #222222 ;
  }

  .grid-img_box2{
      position: relative;
      margin: 9px auto 0;
      width: 84px;
      height: 84px;
      background-repeat: no-repeat;
      overflow: hidden;
      background-size: 100%,100%;
      background-position: center;
  }
  .grid-img_name{
      margin: 0 5px;
      margin-top: 5px;
      font-size: 12px;
      line-height: 16px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
  }
  .box-gridMain:hover a{
      color: #409EFF;
  }
  .box-gridMain:hover{
      cursor: pointer;
      border: 1px solid #f1f5fa;
      border-radius: 5px;
      background-color: #f1f5fa;
      color: #409EFF;
  }
  .fold-grid{
      background-image: url('../../../assets/icon/Folder_24_35f88d9.png');
  }
  .return-history{
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translate(0,-50%);
      width: 98px;
      height: 40px;
      border-radius: 6px;
      background-color: #409EFF;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
  }
  .return-history:hover{
      cursor: pointer;
      background-color: #66b1ff;
      border-color: #66b1ff;
  }
  .return-history a{
      display: block;

      color: #fff;
  }
  .xGLMIab ul{
      padding: 15px 0px;
  }
  .msgAlert{
      color: #409EFF;
      font-weight: 600;
  }
    .mask-pre{
      z-index: 999;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .mask-imgPre{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      border-radius: 6px;
      width: 400px;
      height: 240px;
      background-image: url('../../../assets/icon/errorPre.png');
    }
    .bookNum-show,.bookShelfUrl-header,.bookShelfUrl-icon{
        line-height: 30px;
    }
  .OFaPaO {
      position: absolute;
      right: 210px;
      top: 50%;
      transform: translate(0,-50%);
      width: 165px;
      min-width: 165px;
      max-width: 315px;
      height: 30px;
  }
  .OFaPaO .jfqNO8K {
      display: none;
      position: absolute;
      bottom: -34px;
      left: 11px;
      height: 20px;
      cursor: pointer;
  }
  .OFaPaO .wlv03D {
      padding-left: 15px;
      padding-right: 54px;
      background: #f1f2f4;
      border-radius: 33px;
  }
  .OFaPaO .meNE4J {
      color: #666;
      width: 100%;
      height: 30px;
      background: 0 0;
      border: 0;
      outline: 0;
      line-height: 30px!important;
      position: relative;
      font-size: 12px;
  }
  .gdvDpO {
      position: absolute;
      font-size: 13px;
      right: 32px;
      top: 9px;
      color: #c1c2c3;
      cursor: pointer;
  }
  .DxdbeCb .OFaPaO .gHHsaL {
      display: block;
      width: 15px;
      height: 15px;
      border: 0;
      position: absolute;
      top: 6px;
      font-size: 14px;
      outline: 0;
      cursor: pointer;
      right: 13px;
      color: #666;
      *top: 8px;
  }
  .DxdbeCb .OFaPaO .bqYV3O {
      position: absolute;
      top: 6px;
      left: 15px;
      color: #929292;
  }
  .icon-btn_search{
      width: 14px;
      display: block;
      background-image: url('../../../assets/icon/icon_search.png');
      background-size: cover;
      background-position: center;
      position: absolute;
      height: 14px;
      top: 50%;
      left:50%;
      transform: translate(-50%,-50%);
  }

  .icon-btn_block:hover{
      opacity: 0.8;
      cursor: pointer;
  }
  .icon-btn_block{
      position: absolute;
      width: 30px;
      height: 30px;
      right: 10px;
      top: 0px;
  }
  .msgAlert2{
      color: #fff;
      position: absolute;
      top: 16px;
      right: -50px;
      line-height: 14px;
      transform: translate(0,-50%);
      display: block;
      padding: 5px 10px;
      background-color: #409EFF;
      border-radius: 3px;
  }
  .msgAlert2:hover{
      cursor: pointer;
      opacity: 0.8;
  }
  #bonfire-pageloader{
      position: fixed;
      top:0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
  }
  .textSearch{
      overflow: hidden;
      line-height: 14px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0,-50%);
      text-indent: 0px !important;
  }
  .shelf_search{
      opacity: 0.8;
  }
  .shelf_search:hover{
      color: #409EFF;
      opacity: 1;
      text-decoration: underline;
  }
  .textTe,.MCGAxGTe{
      text-indent: 0px !important;
  }
  .yangxiBg{
      display: inline-block;
      background-color: rgba(255,215,0,0.6);
      text-indent: 0px !important;
  }
  .tvPMvPb{
      display: flex;
  }
  .textTeYx{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      max-width:70%;
      width: 70%;
      display: inline-block;
  }
  .maskShow{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
  }

</style>
