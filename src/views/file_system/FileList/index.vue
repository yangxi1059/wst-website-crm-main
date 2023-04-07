<!--
 * @Author: 库建华
 * @Date: 2019-07-08 16:02:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 13:41:53
 * @Version:
 * @Description:修改注意权限判断
 -->
<template>
  <d2-container v-loading="loading">
    <div class="file-list">
      <el-card class="mb10">
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <i class="header-icon el-icon-info"></i>
              文档权限信息
            </template>
            <div>预览：{{permission.preview && permission.preview.accessGroupOwner}} {{ permission.preview && permission.preview.accessUserOwner}}</div>
            <div>只读：{{permission.readonly && permission.readonly.accessGroupOwner}} {{ permission.readonly && permission.readonly.accessUserOwner}}</div>
            <div>更新：{{permission.write && permission.write.accessGroupOwner}} {{ permission.write && permission.write.accessUserOwner}}</div>
            <div>管理：{{permission.manage && permission.manage.accessGroupOwner}} {{permission.manage && permission.manage.accessUserOwner}}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card>
        <div class="nav-select">
          <el-select style="width:150px" size="mini" v-model="navId" filterable>
            <el-option
              v-for="item in navSelect"
              :key="item.fileId"
              :label="item.fileName"
              :value="item.fileId"
            ></el-option>
          </el-select>
        </div>
        <div class="nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in fileNav" :key="item.navigateId">
              <el-button type="text" @click="Topage(item.navigateId)">{{item.navigateName}}</el-button>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="upload_file" v-if="setFileVisible == 'manage'">
          <upload-file
            :fileNav="fileNav"
            @submit="uploadSubmit"
            @setUploadFileList="setUploadFileList"
          ></upload-file>
        </div>
        <div class="change-style">
          <!-- <el-button
            size="mini"
            @click="changeStyle"
          >列表/缩略图</el-button>-->
          <el-switch
            v-if="roleInfo.includes(`file_list_reduce`)"
            v-model="style"
            active-color="#13ce66"
            inactive-color="#13ce66"
            active-text="列表"
            inactive-text="缩略图"
          ></el-switch>
        </div>
        <div class="set-file" v-if="setFileVisible == 'manage'">
          <el-tooltip content="添加文件夹" placement="top">
            <i class="el-icon-circle-plus-outline" @click="addFileBox()"></i>
          </el-tooltip>
          <el-tooltip content="删除选中文件" placement="top">
            <i class="el-icon-delete" @click="deleteF()"></i>
          </el-tooltip>
          <el-tooltip content="下载选中文件" placement="top">
            <i class="el-icon-download" @click="downloadF()"></i>
          </el-tooltip>
          <!-- <el-tooltip content="文件(夹)整理" placement="top">
            <i class="el-icon-sort" @click="fileBox()"></i>
          </el-tooltip>-->
          <el-tooltip content="权限设置" placement="top">
            <i class="el-icon-setting" @click="settingNav()"></i>
          </el-tooltip>
        </div>
        <el-table
          v-show="style"
          ref="multipleTable"
          :data="tableList"
          tooltip-effect="dark"
          style="width: 100%"
          class="mt10"
          @selection-change="handleSelectionChange"
        >
          <el-table-column sortable align="center" type="selection" width="50"></el-table-column>
          <el-table-column sortable label="文件/文件夹" show-overflow-tooltip width="400">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                v-if="scope.row.fileType == 'folder'"
                @click="Topage(scope.row.fileId)"
              >{{ scope.row.fileName }}</el-button>
              <span class="el-icon-document" v-else>{{ scope.row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable show-overflow-tooltip align="center" prop="docType" label="文件类型"></el-table-column>
          <el-table-column sortable show-overflow-tooltip align="center" prop="docSize" label="文件大小">
            <template slot-scope="scope">
              <span
                v-if="scope.row.docSize"
              >{{scope.row.docSize/1024 > 1000 ? Math.round(scope.row.docSize/1024/10.24)/100+'MB' : Math.round(scope.row.docSize/10.24)/100+'KB' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            show-overflow-tooltip
            align="center"
            prop="createName"
            label="创建人"
          ></el-table-column>
          <el-table-column
            sortable
            show-overflow-tooltip
            align="center"
            prop="createTime"
            label="创建时间"
          ></el-table-column>
          <el-table-column
            sortable
            show-overflow-tooltip
            align="center"
            prop="updateName"
            label="修改人"
          ></el-table-column>
          <el-table-column
            sortable
            show-overflow-tooltip
            align="center"
            prop="updateTime"
            label="修改时间"
          ></el-table-column>
          <el-table-column align="center" label="操作" width="200px">
            <template slot-scope="scope">
              <ul class="table-set-file">
                <li>
                  <el-tooltip
                    content="查看文件内容"
                    placement="top"
                    v-if="scope.row.fileType !== 'folder' && scope.row.accessType && /preview|readonly|write|manage/.test(scope.row.accessType)"
                  >
                    <i class="el-icon-view" @click="view(scope.row)"></i>
                  </el-tooltip>
                </li>
                <li>
                  <el-tooltip
                    content="下载文件"
                    placement="top"
                    v-if="scope.row.fileType !== 'folder' && scope.row.accessType &&  /readonly|write|manage/.test(scope.row.accessType)"
                  >
                    <i class="el-icon-download" @click="download(scope.row)"></i>
                  </el-tooltip>
                </li>
                <li>
                  <el-tooltip
                    content="更新修改文件"
                    placement="top"
                    v-if="scope.row.fileType !== 'folder' && scope.row.accessType &&  /write|manage/.test(scope.row.accessType)"
                  >
                    <i class="el-icon-upload" @click="updata(scope.row)"></i>
                  </el-tooltip>
                </li>
                <li>
                  <el-tooltip
                    content="修改文件(夹)名"
                    placement="top"
                    v-if=" scope.row.accessType &&  /write|manage/.test(scope.row.accessType)"
                  >
                    <i class="el-icon-edit-outline" @click="updataName(scope.row)"></i>
                  </el-tooltip>
                </li>
                <!-- <li>
                  <el-tooltip content="文件整理" placement="top" v-if="scope.row.accessType && scope.row.accessType.includes('manage')">
                  <i class="el-icon-d-caret" @click="fileBox(scope.row)"></i>
                  </el-tooltip>
                </li>-->
                <li>
                  <el-tooltip
                    content="设置文件（夹）权限"
                    placement="top"
                    v-if="scope.row.accessType &&  /manage/.test(scope.row.accessType) && scope.row.fileType=='folder'"
                  >
                    <i class="el-icon-setting" @click="setting(scope.row)"></i>
                  </el-tooltip>
                </li>
                <!--
                <li>
                  <el-tooltip content="取消收藏" v-if="scope.row.pkId" placement="top">
                    <i class="el-icon-star-on" @click="starOff(scope.row)"></i>
                  </el-tooltip>
                  <el-tooltip content="加入收藏" v-else placement="top">
                    <i class="el-icon-star-off" @click="starOn(scope.row)"></i>
                  </el-tooltip>
                </li>-->
              </ul>
              <!-- {{ scope.row.date }} -->
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!style" class="img-box" v-if="roleInfo.includes(`file_list_reduce`)">
          <div v-for="(tableItem,index) in tableData" :key="index">
              <el-card class="mb20"  v-if="tableItem.list.length > 0">
                <div class="img-item" v-for="item in tableItem.list" :key="item.fileId" :title="item.fileName">
                  <el-checkbox class="checkbox" v-model="item.choose"></el-checkbox>
                  <div>
                    <div
                      class="folder img-item-box"
                      type="text"
                      v-if="tableItem.type == 'folder'"
                      @click.stop="Topage(item.fileId)"
                    >
                      <img src="@/assets/img/folder.png" :alt="item.docType" />
                    </div>
                    <div v-else
                      class="img-item-box"
                      :class="uploadFileList.indexOf(item.fileUrl)>-1 ? 'highlight':''"
                      @click="toDetail(item)"
                      @dblclick="view(item)"
                    >
                      <img :src="item.reduceUrl" :alt="item.docType" />
                    </div>
                    <p><i class="el-icon-edit" @click="showFileName($event,item)"></i>  {{item.fileName}}</p>
                    <el-input class="filename_box" type="textarea" rows="3" v-model="item.fileName"
                      @keydown.enter.native="updataFileName(item,$event)"  @blur="resetFileName($event,item)"
                    ></el-input>
                  </div>
                  <!-- <el-input v-model="item.fileName" size="mini"></el-input> -->
                </div>
              </el-card>
          </div>
        </div>
        <el-drawer title="文件详情" :visible.sync="drawer" :with-header="false" :size="'500px'">
          <div class="detail-reduce-img-box">
            <img class="detail-reduce-img" :src="detailData.reduceUrl" alt />
          </div>
          <ul class="table-set-file table-set-file2">
            <li>
              <el-tooltip
                content="查看文件内容"
                placement="top"
                v-if="detailData.accessType && /preview|readonly|write|manage/.test(detailData.accessType)"
              >
                <i class="el-icon-view" @click="view(detailData)"></i>
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                content="下载文件"
                placement="top"
                v-if="detailData.accessType &&  /readonly|write|manage/.test(detailData.accessType)"
              >
                <i class="el-icon-download" @click="download(detailData)"></i>
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                content="更新修改文件"
                placement="top"
                v-if="detailData.accessType &&  /write|manage/.test(detailData.accessType)"
              >
                <i class="el-icon-upload" @click="updata(detailData)"></i>
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                content="修改文件名"
                placement="top"
                v-if=" detailData.accessType &&  /write|manage/.test(detailData.accessType)"
              >
                <i class="el-icon-edit-outline" @click="updataName(detailData)"></i>
              </el-tooltip>
            </li>
            <!-- 文件权限设置继承文件夹权限，原文件设置权限注销 -->
            <!-- <li>
              <el-tooltip
                content="设置文件权限"
                placement="top"
                v-if="detailData.accessType &&  /manage/.test(detailData.accessType)"
              >
                <i class="el-icon-setting" @click="setting(detailData)"></i>
              </el-tooltip>
            </li> -->
          </ul>
          <el-row>
            <el-col :span="8" class="_item-name">文件名：</el-col>
            <el-col :span="16" class="_item-value _item-value-name" :title="detailData.fileName">
              <div>{{detailData.fileName}}</div>
            </el-col>
            <el-col :span="8" class="_item-name">文件类型：</el-col>
            <el-col :span="16" class="_item-value">{{detailData.docType}}</el-col>
            <el-col :span="8" class="_item-name">文件大小：</el-col>
            <el-col
              :span="16"
              class="_item-value"
            >{{detailData.docSize/1024 > 1000 ? Math.round(detailData.docSize/1024/10.24)/100+'MB' : Math.round(detailData.docSize/10.24)/100+'KB'}}</el-col>
            <el-col :span="8" class="_item-name">创建人：</el-col>
            <el-col :span="16" class="_item-value">{{detailData.createName}}</el-col>
            <el-col :span="8" class="_item-name">创建时间：</el-col>
            <el-col :span="16" class="_item-value">{{detailData.createTime}}</el-col>
            <el-col :span="8" class="_item-name">修改人：</el-col>
            <el-col :span="16" class="_item-value">{{detailData.updateName}}</el-col>
            <el-col :span="8" class="_item-name">修改时间：</el-col>
            <el-col :span="16" class="_item-value">{{detailData.updateTime}}</el-col>
          </el-row>
        </el-drawer>
      </el-card>
    </div>
    <el-dialog :close-on-click-modal="false" :visible="addFolderVisible" width="390px" :title="'新增文件夹'" :before-close="addFolderClose">
      <!-- <el-form>
        <el-form-item label="文件夹名：" label-width="160px"></el-form-item>
      </el-form>-->
      <el-input
        v-model="folderName"
        class="ml20"
        size="mini"
        :style="{width:'350px'}"
        clearable
        placeholder="输入文件夹名"
        @keyup.enter.native="addFolderSubmit"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFolderClose">取 消</el-button>
        <el-button type="primary" @click="addFolderSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <updata-file
      :uploadVisible="updataVisible"
      :fileNav="fileNav"
      :updataFileData="updataFileData"
      @close="updataClose"
      @submit="updataSubmit"
    ></updata-file>
    <updata-name
      ref="updataName"
      :updataNameVisible="updataNameVisible"
      :fileNav="fileNav"
      :updataNameData="updataNameData"
      @close="updataNameClose"
      @submit="updataNameSubmit"
    ></updata-name>
    <permission
      :permissionVisible="permissionVisible"
      :fileNav="fileNav"
      :permissionData="permissionData"
      @close="permissionClose"
      @submit="permissionSubmit"
    ></permission>
    <viewFile
      :viewFileVisible="viewFileVisible"
      :url="url"
      @close="viewFileClose"
      @submit="viewFileSubmit"
    ></viewFile>
    <viewPicture
      :viewPictrueVisible="viewPictrueVisible"
      :url="url"
      @close="viewPictureClose"
      @submit="viewPictureSubmit"
    ></viewPicture>
    <dragFolder
      :dragFolderVisible="dragFolderVisible"
      :dragFolderData="dragFolderData"
      @close="dragFolderClose"
      @submit="dragFolderSubmit"
    ></dragFolder>
    <el-dialog :close-on-click-modal="false"
      :visible.sync="settingVisible"
      width="420px"
      :before-close="close"
    >
      <div class="" style="font-size:14px">请输入接收文件的邮箱</div>
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="input2">
          <template slot="append">@wallstreettequila.org</template>
        </el-input>
      </div>
      <span slot="footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">发 送</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file.js'
import uploadFile from './components/upload_file.vue'
import updataFile from './components/updata_file.vue'
import updataName from './components/updata_name.vue'
import permission from './components/permission.vue'
import viewFile from './components/view_file.vue'
import viewPicture from './components/view_picture.vue'
import dragFolder from './components/drag_folder.vue'
import api from '@/api/file_system.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

var time = null //  在这里定义time 为null 用于单击，双击判断
export default {
  name: 'fileList',
  mixins: [mixins],
  components: {
    uploadFile,
    updataFile,
    updataName,
    permission,
    viewFile,
    viewPicture,
    dragFolder
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo']),
  },
  data () {
    return {
      input1: [],
      input2: '',
      settingVisible: false,
      fileNav: [],
      filePath: '',
      permission: [{}, {}, {}],

      navId: '',
      navSelect: [],

      setFileVisible: true,

      tableList: [], /* 列表展示list */
      tableData: [], /* 缩略图展示list */
      picList: { /* 缩略图列表 */
        folder: require('@/assets/img/folder.png'),
        word: require('@/assets/img/file_word.png'),
        excel: require('@/assets/img/file_excel.png'),
        ppt: require('@/assets/img/file_ppt.png'),
        pdf: require('@/assets/img/file_pdf.png'),
        txt: require('@/assets/img/file_txt.png'),
        image: require('@/assets/img/file.png'),
        audio: require('@/assets/img/file_audio.png'),
        video: require('@/assets/img/file_video.png'),
        other: require('@/assets/img/file_other.png')
      },
      multipleSelection: [],

      updataVisible: false,
      updataFileData: {},

      updataNameVisible: false,
      updataNameData: {},

      permissionVisible: false,
      permissionData: { fileName: '' },

      viewFileVisible: false,
      viewPictrueVisible: false,
      url: '',

      dragFolderVisible: false,
      dragFolderData: {},

      folderName: null,
      addFolderVisible: false,
      loading: false,
      style: true,
      drawer: false,
      detailData: {},

      initFileName: '',
      uploadFileList: []/* 上传文件列表,用于高亮显示 */
    }
  },
  mounted () {
    console.log('this.$route.params.id', this.$route.params.id)
    // this.Topage(this.$route.params.id);
    this.initTree()
    // 单击页面取消高亮
  },
  watch: {
    navId: function (val) {
      this.Topage(val)
    }
  },
  methods: {
    Topage (id = '') {
      this.tableList = []
      const data = {
        pageNum: 1,
        pageSize: 10000,
        parentId: id,
        ownership: 'public',
        search: '',
        docType: '',
        sortCol: '',
        sort: ''
      }
      console.log('获取数据参数', data)
      this.loading = true
      api.getFileList(data).then((res) => {
        console.log('文件列表数据', res)
        this.tableData = res.data.rows.map((v) => {
          v.list.map((u) => {
            u.reduceUrl = u.reduceUrl || this.picList[v.type]
            u.choose = false
            return u
          })
          return v
        })
        this.tableData.map((v) => {
          v.list.map((u) => {
            this.tableList.push(u)
          })
        })
        console.log('tableList', this.tableList)
        this.fileNav = res.data.navigateArray
        this.filePath = ''
        res.data.navigateArray.forEach((v) => {
          this.filePath += v.navigateName + ' / '
        })
        this.permission = res.data.accessResult
        // this.navSelect = res.data.fileTree;
        this.setFileVisible = res.data.accessType
        this.loading = false
        this.drawer = false
      })
    },
    initTree () {
      this.loading = true
      api.getFileTree().then((res) => {
        this.navSelect = res.data
        this.loading = false
        console.log(res)
        if (this.navSelect.length) {
          this.navId = this.navSelect[0].fileId
          // this.Topage(this.navSelect[0].fileId);
        }
      })
    },
    downloadF () {
      console.log(
        'downloadF',
        this.style,
        this.multipleSelection,
        this.tableData
      )
      let data = []
      if (this.style) {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要下载的文件'
          })
          return
        }
        data = this.multipleSelection.map((v) => v.fileId)
      } else {
        data = this.tableList.filter((v) => v.choose).map((v) => v.fileId)
      }
      if (!data.length) {
        this.$message({
          type: 'warning',
          message: '请选择要下载的文件'
        })
        return
      }
      console.log(data)
      this.input1 = data
      this.settingVisible = true
    },
    deleteF () {
      console.log(
        'deleteF',
        this.style,
        this.multipleSelection,
        this.tableData
      )
      let data = []
      if (this.style) {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的文件'
          })
          return
        }
        // let canGo = true;
        // this.multipleSelection.forEach(v => {
        // if (v.fileType == "folder") {
        //   canGo = false;
        // }
        //   data.push(v.fileId);
        // });
        data = this.multipleSelection.map((v) => v.fileId)
      } else {
        data = this.tableList.filter((v) => v.choose).map((v) => v.fileId)
      }
      // if (!canGo) {
      //   this.$message({
      //     type: "error",
      //     message: "文件夹不可删除"
      //   });
      //   return;
      // }
      this.deleteF2(data)
    },
    deleteF2 (data) {
      console.log('删除文件参数', { delList: data })
      api.setFile({ delList: data }).then((res) => {
        console.log('删除文件', res)
        this.$message({
          type: 'success',
          message: '删除文件成功'
        })
        this.Topage(this.tableList[0].parentId)
      })
    },
    close () {
      this.input1 = []
      this.input2 = ''
      this.settingVisible = false
    },
    submit () {
      if (this.input2) {
        const data = this.input1
        const params = {
          receiver: this.input2 + '@wallstreettequila.org',
          fileIds: data.join(','),
          userId: this.userInfo.userId
        }
        console.log(params)
        this.settingVisible = false
        this.input2 = ''
        this.input1 = []
        api.getDownloadFileByIdsAndEmail(params).then(() => {
          this.$message({
            type: 'success',
            message:
              '下载文件的请求提交成功，生成时间可能较长，请耐心等待！',
            duration: 0,
            showClose: true
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message:
              '邮箱不能为空'
        })
      }
    },
    addFileBox () {
      console.log('addFileBox')
      this.addFolderVisible = true
    },
    updataName (i) {
      console.log('updataName', i)
      this.updataNameData = { ...i }
      this.updataNameVisible = true
    },
    updata (i) {
      console.log('updata', i)
      this.updataFileData = i
      this.updataVisible = true
    },
    fileBox (i) {
      console.log('fileBox', i)
      this.dragFolderVisible = true
      this.dragFolderData = {}
    },
    setting (i) {
      console.log('setting', i)
      this.permissionVisible = true
      this.permissionData = i
    },
    settingNav () {
      this.permissionVisible = true
      this.permissionData.fileId = this.fileNav[
        this.fileNav.length - 1
      ].navigateId
      this.permissionData.fileName = ''
    },
    download (i) {
      console.log('download', i)
      downloadFunD(i.fileUrl)
      this.remarkFileDownload(i.fileId)
    },
    remarkFileDownload (fileId) {
      api.remarkFileDowload(fileId).then((res) => {
        console.log(res)
      })
    },
    view (i) {
      console.log('view', i)
      clearTimeout(time) // 清除
      downloadFun(i.fileUrl)
    },
    starOff (i) {
      console.log('starOff', i)
      console.log('starOff', { delList: [{ pkId: i.pkId, fileId: i.fileId }] })
      api
        .collectionFile({ delList: [{ pkId: i.pkId, fileId: i.fileId }] })
        .then((res) => {
          console.log('取消收藏', res)
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          })
          this.Topage(this.tableData[0].parentId)
        })
    },
    starOn (i) {
      console.log('starOn ', i)
      api.collectionFile({ addList: [{ fileId: i.fileId }] }).then((res) => {
        console.log('加入收藏', res)
        this.$message({
          type: 'success',
          message: '收藏成功'
        })
        this.Topage(this.tableData[0].parentId)
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    uploadSubmit () {
      console.log(
        'uploadSubmit ',
        this.fileNav[this.fileNav.length - 1].navigateId
      )
      this.Topage(this.fileNav[this.fileNav.length - 1].navigateId)
    },
    // updata
    updataClose () {
      console.log('updataClose ')
      this.updataVisible = false
    },
    updataSubmit () {
      console.log(
        'updataSubmit ',
        this.fileNav[this.fileNav.length - 1].navigateId
      )
      this.Topage(this.fileNav[this.fileNav.length - 1].navigateId)
    },
    // updataName
    updataNameClose () {
      console.log('updataNameClose ')
      this.updataNameVisible = false
    },
    updataNameSubmit () {
      console.log(
        'updataNameSubmit ',
        this.fileNav[this.fileNav.length - 1].navigateId
      )
      this.Topage(this.fileNav[this.fileNav.length - 1].navigateId)
    },
    // permission
    permissionClose () {
      console.log('permissionClose ')
      this.permissionVisible = false
    },
    permissionSubmit () {
      console.log('permissionSubmit ')
      this.Topage(this.fileNav[this.fileNav.length - 1].navigateId)
    },
    // viewFileClose
    viewFileClose () {
      console.log('viewFileClose')
      this.viewFileVisible = false
    },
    viewFileSubmit () {
      console.log('viewFileSubmit')
      // this.Topage(this.fileNav[this.fileNav.length - 1].navigateId);
    },
    // viewPictrue
    viewPictureClose () {
      console.log('viewPictureClose')
      this.viewPictrueVisible = false
    },
    viewPictureSubmit () {
      console.log('viewPictureSubmit')
      // this.Topage(this.fileNav[this.fileNav.length - 1].navigateId);
    },
    // dragFolderClose
    dragFolderClose () {
      console.log('dragFolderClose')
      this.dragFolderVisible = false
    },
    dragFolderSubmit () {
      console.log('dragFolderSubmit')
      // this.Topage(this.fileNav[this.fileNav.length - 1].navigateId);
    },
    // folder
    addFolderClose () {
      this.addFolderVisible = false
      this.folderName = null
    },
    addFolderSubmit () {
      if (!this.folderName) {
        this.addFolderClose()
        return
      }
      console.log(this.fileNav)
      const p = this.fileNav.pop()
      const data = {
        fileName: this.folderName,
        fileType: 'folder',
        ownership: 'public',
        owner: null,
        parentId: p.navigateId,
        parentDir: this.filePath
      }
      this.loading = true
      console.log('新增文件夹参数', { addList: [data] })
      api.setFile({ addList: [data] }).then((res) => {
        console.log('新增文件夹', res)
        this.loading = false
        this.addFolderClose()
        this.Topage(p.navigateId)
      })
    },
    changeStyle () {
      console.log(this.style)
      this.style = !this.style
    },
    toDetail (v) {
      clearTimeout(time) // 首先清除计时器
      time = setTimeout(() => {
        this.detailData = { ...v }
        this.drawer = true
      }, 300) // 大概时间300ms
    },
    showFileName (e, item) {
      this.initFileName = item.fileName
      e.currentTarget.parentElement.nextElementSibling.style.display = 'block'
      e.currentTarget.parentElement.nextElementSibling.firstElementChild.focus()
    },
    updataFileName (val, e) {
      e.preventDefault()
      // 浏览器阻止默认事件兼容
      this.$refs.updataName.updataNameData = val
      this.$refs.updataName.updataNameSubmit()
      e.currentTarget.style.display = 'none'
    },
    resetFileName (e, item) {
      item.fileName = this.initFileName
      e.currentTarget.parentElement.style.display = 'none'
    },
    setUploadFileList (params) {
      this.uploadFileList.push(params.fileUrl)
      const _t = this
      document.onmousedown = function (event) {
        _t.uploadFileList = []
        document.onmousedown = null
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.el-upload-dragger .el-icon-upload{
  margin: 0px !important;
}
.header-icon {
  color: #409eff;
  margin-right: 10px;
}
.set-file {
  font-size: 18px;
  position: absolute;
  right: 60px;
  margin-top: -25px;
  color: #409eff;
  // top: 10px;
}
.set-file i {
  margin-left: 10px;
}
.table-set-file li {
  margin-left: 10px;
  width: 18px;
}
.table-set-file {
  font-size: 20px;
  color: #409eff;
  display: flex;
  width: 180px;
}
.nav-select {
  position: absolute;
}
.nav {
  margin-left: 160px;
}
.change-style {
  position: absolute;
  margin-top: -25px;
  right: 260px;
}
.img-box {
  margin-top: 20px;
  // display: flex;
}
.img-item {
  display: inline-block;
  width: 150px;
  height: 240px;
  position: relative;
  margin: 0 10px;
  .checkbox {
    position: absolute;
    top: -2px;
    left:1px;
  }
  .folder {
    width: 100%;
    height: 100%;
    color: #409eff;
    cursor: pointer;
  }
  .img-item-box {
    display: block;
    position: absolute;
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px #eef solid;
  }
  img {
    max-width: 150px;
    max-height: 150px;
  }
  p {
    position: absolute;
    top: 160px;
    width: 135px;
    word-wrap:break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    padding: 0 10px;
  }
  .filename_box{
    position: absolute;
    top: 160px;
    width: 155px;
    display: none;
  }
}
.table-set-file2 {
  padding: 0px 170px 50px;
}
.detail-reduce-img-box {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px #eef solid;
  margin: 20px 50px;
  .detail-reduce-img {
    max-width: 400px;
    max-height: 400px;
  }
}
._item-value-name {
  display: inline-block;
  word-break: keep-all;
  width: 300px;
  word-wrap: initial;
  overflow-wrap: break-word;
  white-space: normal;
}
.el-textarea .el-textarea__inner{
  resize: none;
}
.el-icon-edit{
  cursor: pointer;
}
.upload_file{
  position:absolute;
  left: calc(100% - 830px);
  margin-top:-50px;
}
.highlight{
  border:1px solid #409EFF!important;
  box-shadow: 0px 0px 25px #409eff;;
}
.el-upload-dragger{
  height: 60px;
}

.upload{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.upload_file {
    position: absolute;
    left: 50%;
    transform: translate(-50%,0);
    margin-top: -40px;
}
</style>
