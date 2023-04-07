<!--
 * @Author: Kaan
 * @Date: 2022-04-25 15:28:06
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-25 19:06:35
 * @version: 
 * @Descripttion: 
-->
<template>
  <el-dialog 
      :close-on-click-modal="false" 
      v-loading="loading"
      :title="editTitle" 
      :visible.sync="editVisible" 
      width="950px" 
      :before-close="close"
    >
      <div class="edit_container"> 
        <ul class="edit_list">
          <li class="mb10" v-for="(item,i) in editFilesList" :key="i">
            <div class="mb10"> 
              <el-divider content-position="left">{{item.prepareTypeName}}</el-divider>
            </div>
            <div class="file_item " v-for="(file,j) in item.prepareArr" :key="j">
              <div class="icon_size">
                <d2-icon class="" :name="getFileExt(file.fileName)" />
              </div>
              <div class="file_content">
                <span>{{file.fileName}}</span>
                <p>{{file.updateByName}} {{file.updateTime}}</p>
              </div>
              <div class="file_btn">
                <el-button type="danger" icon="el-icon-delete" @click="delFile(item.prepareArr,j)" circle></el-button>
              </div>
            </div>
            <div class="upload_btn">
              <el-upload
                action
                drag
                :http-request="(file, fileList) => uploadFileAxios(file, fileList, item,i)"
                class="upload-btn mt10 mr10"
                ref="elupload"
                :file-list="fileList"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>上传本地文件</em>
                </div>
              </el-upload>
              <el-button @click="addCheckList(item)">添加右侧已选</el-button>
            </div>
          </li>
        </ul>
        <div class="mentee_file" >
          <div class="mb10"> 
            <el-divider content-position="left">学生文件</el-divider>
          </div>
          <el-table
            :data="menteeFileList"
            size="mini"
            border
            ref="menteeFileTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column align="center" label="操作" width="50">
              <template slot-scope="scope">
                <el-button type="" icon="el-icon-view" @click="preview(scope.row.fileUrl)" circle></el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fileName" label="文件名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="fileTypeName" label="类型" width="80" ></el-table-column>
          </el-table>
          <div v-for="(item,i) in applyData" :key="i">
            <div v-if="item.onlineFileList.length > 0">
              <div class="mb10"> 
                <el-divider content-position="left">{{item.title}}</el-divider>
              </div>
              <el-table
                :data="item.onlineFileList"
                size="mini"
                border
                ref="menteeFileTable2"
                @selection-change="(val) => handleSelectionChange2(val, i)"
              >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button type="" icon="el-icon-view" @click="preview(scope.row.fileUrl)" circle></el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="fileName" label="文件名" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="prepareTypeName" label="类型" width="80" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import files from '@/libs/file.js'

export default {
  name: 'ApplySeasonEdit',
  mixins: [
    mixins
  ],
  props: {
    editPkId: {},
    editVisible: {
      type: Boolean,
      default: false
    },
    editList:{},
    menteeId:{}
  },
  watch: {
    editVisible: function (newData, oldData) {
      if (newData) {
        console.log(this.editList)
        this.applyData = JSON.parse(JSON.stringify(this.editList))
        this.Topage()
      }
    }
  },
  data () {
    return {
      loading:false,
      applyData:"",
      editTitle:"",
      editData:{},
      editFilesList:[],
      fileType:[],
      fileList:[],
      
      menteeFileList:[],
      checkList:[],
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.fileType = await this.getDictionary('mentee_file_type')
    },
    Topage(){
      const params = {
        menteeId: this.menteeId,
        fileType: 'ALL'
      }
      api.getMenteeFileListVip(params).then(res => {
        this.menteeFileList = []
        this.menteeFileList = res.data
        this.menteeFileList.forEach(v=>{
          v.fileTypeName = this.fileType.filter(u=> u.itemValue == v.fileType)[0].itemName
        })
        // this.resumeFile = res.data.filter(v => v.fileType == 'resume')
        // this.otherFile = res.data.filter(v => v.fileType == 'other')
      })
      console.log(this.editPkId)
      this.editData = this.applyData.filter(v => v.pkId == this.editPkId)[0]
      this.editFilesList = this.editData.typeArr
      this.editTitle = `${this.editData.applyYear}/${this.editData.applyTypeName}/${this.editData.applyTrackName}/${this.editData.applyCountryName}/${this.editData.startMonth || "无"} 至 ${this.editData.endMonth || "无"}`
      this.applyData.forEach(v=>{
        v.title = `${v.applyYear}/${v.applyTypeName}/${v.applyTrackName}/${v.applyCountryName}`,
        v.checkList = []
        v.onlineFileList = []
        v.typeArr.forEach(u=>{
          v.onlineFileList = v.onlineFileList.concat(u.prepareArr)
        })
      })
      console.log(this.applyData)
    },
    delFile(fileList,j){
      console.log(fileList)
      fileList.splice(j,1); 
    },
    uploadFileAxios(file, fileList,item,i){
      this.loading = true
      console.log(file, fileList,item,i)
      files.uploadFunBySys(
        file.file,
        `voucher/apply_season/${this.editPkId}/${item.prepareType}`,
        url => {
          this.fileList = []
          this.checkList = []
          this.loading = false
          item.prepareArr.push({
            prepareType:item.prepareType,
            fileName:file.file.name,
            filePath:url
          })
        }
      )
    },
    submit(){
      let params={
        keyId: this.editPkId,
        prepareArr:[]
      }
      this.editFilesList.forEach(v => {
        params.prepareArr = params.prepareArr.concat(v.prepareArr) 
      })
      console.log(params)
      this.loading = true
      api.editSignApply(params).then((res) => {
        console.log(res)
        this.loading = false
        if(res.code == 200){
          this.$message.success("提交成功")
          this.$emit("submit")
        }else{
          this.$message.warning(res.message)
        }
      }).catch(err => {
        this.loading = false
        this.$message.warning(err)
        console.log(err)
      });
    },
    /**
     * @description: 根据合同后缀，处理显示
     * @param {*} filePath
     * @return {*}
     */
    getFileExt (filePath) {
      const index = filePath.lastIndexOf('.')
      const ext = filePath.substr(index + 1)
      if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
        return 'file-image-o'
      } else if (ext == 'doc' || ext == 'docx') {
        return 'file-word-o'
      } else if (ext == 'pdf') {
        return 'file-pdf-o'
      } else if (ext == 'xls' || ext == 'xlsx'){
        return 'file-excel-o'
      } else if (ext == 'ppt'){
        return 'file-powerpoint-o'
      } else {
        return 'file'
      }
    },
    handleSelectionChange(val) {
      this.checkList = val;
    },
    handleSelectionChange2(val,i) {
      console.log(i)
      this.applyData[i].checkList = val;
    },
    addCheckList(item){
      let checkType = false
      this.applyData.forEach(v=>{
        if(v.checkList.length > 0){checkType = true}
      })
      if(this.checkList.length < 1 && !checkType){
        this.$message.warning("未选择右侧已上传文件！")
      }
      this.checkList.forEach(v=>{
        item.prepareArr.push({
          prepareType:item.prepareType,
          fileName:v.fileName,
          filePath:v.fileUrl
        })
      })
      this.$refs.menteeFileTable.clearSelection();
      this.applyData.forEach(v=>{
        v.checkList.forEach(u=>{
          item.prepareArr.push({
            prepareType:item.prepareType,
            fileName:u.fileName,
            filePath:u.filePath
          })
        })
      })
      this.$refs.menteeFileTable2.forEach(v=>{
        v.clearSelection();
      })
    },
    // 预览
    preview (val) {
      files.preview(val)
    },
    close(){
      this.$emit("close")
    },
    
  }
}

</script>
<style lang="scss" scoped>
.file_item{
  padding:10px;
  margin-top:5px;
  width:100%;
  display: flex;
  align-items: center;
  border:1px solid #ededed;
  box-sizing: border-box;
  .icon_size{
    font-size:20px;
    width:40px;
    height:40px;
    border-radius: 50%;
    background-color: #FF8C00;
    color: #f4f4f5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .file_content{
    flex:1;
    margin-left:20px
  }
  .file_btn{
    width:80px;
    text-align:right;
    
  }
}
.upload_btn{
  display: flex;
  align-items: flex-end;
}
.edit_container{
  display: flex;
  .edit_list{
    width:480px;
    .upload-btn{
      display: inline-block;
    }
  }
  .mentee_file{
    padding-left:10px;
    flex:1
  }
}
</style>
