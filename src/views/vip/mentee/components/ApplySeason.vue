<!--
 * @Author: Kaan
 * @Date: 2022-04-15 10:22:23
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-17 14:02:05
 * @version: 
 * @Descripttion: 
-->
<template>
  <div>
    <el-drawer
      :title="`申请季进度`"
      v-loading="loading"
      :visible.sync="applySeasonVisible"
      :size="`450px`"
      :before-close="handleClose"
    >
      <div class="apply_season">
        <el-button class="mb10" type="primary" v-if="roleInfo.includes(`vip_sign_apply_add`)" @click="applyNew">新增</el-button>
        <ul>
          <li class="apply_item mb10" v-for="(item,i) in signList" :key="i">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix card_header">
                <span>{{item.applyYear}}/{{item.applyTypeName}}/{{item.applyTrackName}}/{{item.applyCountryName}}/
                  {{item.startMonth || "无"}} 至 {{item.endMonth || "无"}}
                </span>
                <el-button v-if="roleInfo.includes(`vip_sign_apply_edit`)"
                  class="header_btn" type="primary" icon="el-icon-edit" @click="applyEdit(item)"></el-button>
                <el-button v-if="roleInfo.includes(`vip_sign_apply_delete`)"
                  class="header_btn mr10" type="danger" icon="el-icon-delete" @click="applyDel(item.pkId)"></el-button>
              </div>
              <div class="mb10" v-for="(item,v) in item.typeArr" :key="v">
                <div v-if="item.prepareArr.length>0">
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
                      <el-button type="info" icon="el-icon-view" @click="preview(file.filePath)" circle></el-button>
                      <el-button type="info" icon="el-icon-download" @click="downloadD(file.filePath)" circle></el-button>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="mb10">
                    <el-divider content-position="left">{{item.prepareTypeName}}</el-divider>
                  </div>
                  <div class="mb10"> 暂无</div>
                </div>
              </div>
            </el-card>
          </li>
        </ul>
      </div>
    </el-drawer>

    <!-- 新增申请季 -->
    <el-dialog 
      :close-on-click-modal="false" 
      v-loading="loading2"
      title="新增申请季" 
      :visible.sync="newVisible" 
      width="750px" 
      :before-close="closeNew"
    >
      <div class="search_page" ref="search">
        <div class="search">
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyYear"
            clearable
            filterable
            placeholder="年份"
          >
            <el-option
              v-for="(year) in yearList" :key="year" :label="year" :value="year"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyType"
            clearable
            filterable
            placeholder="类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyTrack"
            clearable
            filterable
            placeholder="行业"
          >
            <el-option
              v-for="item in trackList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemNameAll"
            ></el-option>
          </el-select>
          <el-select
            :style="{width:widths}"
            class="mr10 mb10"
            v-model="applyCountry"
            clearable
            filterable
            placeholder="地区"
          >
            <el-option
              v-for="item in countryList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            class="mr10 mb10"
            size="mini"
            plain
            @click="search()"
          >搜索</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        border
        highlight-current-row 
        @row-click="rowClick"
      >
        <el-table-column align="center" label="" width="40">
          <template slot-scope="scope">
            <el-radio :label="scope.row.seasonId" v-model="seasonId">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="applyYear" label="年份" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyTypeName" label="类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyTrackName" label="行业" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyCountryName" label="地区" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="申请季时间" width="140">
          <template slot-scope="scope">
            {{scope.row.startMonth|| "无"}} 至 {{scope.row.endMonth || "无"}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeNew">取 消</el-button>
        <el-button type="primary" @click="submitNew">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑申请季上传文件 -->
    <ApplySeasonEdit
      :editVisible="editVisible"
      :menteeId="menteeId"
      :editPkId="editPkId"
      :editList="editList"
      @close="closeEdit"
      @submit="submitEdit"
    />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import files from '@/libs/file.js'
import { mapState } from 'vuex'
import ApplySeasonEdit from './ApplySeasonEdit'

export default {
  name: 'MenteeApplySeason',
  mixins: [
    mixins
  ],
  components:{ApplySeasonEdit},
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    signId: {
      type: String,
      default: ''
    },
    applySeasonVisible: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    applySeasonVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  data () {
    return {
      loading:false,
      menteeId:"",
      signList:[],

      newVisible:false,
      loading2:false,
      widths: "120px",
      applyYear: "",
      applyType: "",
      applyTrack: "",
      applyCountry: "",
      yearList: ['2022','2023','2024','2025','2026'],
      typeList:[],
      trackList:[],
      countryList:[],
      tableData:[],
      seasonId:"",

      editVisible:false,
      editList:[],
      editPkId:"",
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.menteeId = this.$route.query.menteeId
      this.trackList = await this.getDictionary('mentee_track')
      console.log(this.trackList,1111111111111111111111111111)
      this.countryList = await this.getDictionary('country')
      // this.prepareList = await this.getDictionary('apply_season_prepare')
      this.fileType = await this.getDictionary('mentee_file_type')
      this.typeList = await this.getDictionary('internship_or_full_time')
    },
    async Topage () {
      this.loading = true
      api.getSignApplyList(this.signId).then(res => {
        console.log(res)
        this.loading = false
        this.signList = res.data
      })
      const params = {
        menteeId: this.menteeId,
        fileType: 'ALL'
      }
      api.getMenteeFileListVip(params).then(res => {
        this.menteeFileList = []
        console.log(res)
        this.menteeFileList = res.data
        this.menteeFileList.forEach(v=>{
          v.fileTypeName = this.fileType.filter(u=> u.itemValue == v.fileType)[0].itemName
        })
        // this.resumeFile = res.data.filter(v => v.fileType == 'resume')
        // this.otherFile = res.data.filter(v => v.fileType == 'other')
      })
    },
    applyNew(){
      this.newVisible = true
    },
    closeNew(){
      this.newVisible = false
      this.applyYear= ""
      this.applyType= ""
      this.applyTrack= ""
      this.applyCountry= ""
      this.seasonId= ""
      this.tableData= []
    },
    submitNew(){
      let seasonIdType = true
      // 判断申请季是否已添加过
      this.signList.forEach(v=>{
        if(v.seasonId == this.seasonId){
          seasonIdType = false
          return
        }
      })
      if(!seasonIdType){
        this.$message.warning("该申请季已添加！")
        return
      }
      if(this.seasonId !==""){
        let params = {
          signId: this.signId,
          seasonId:this.seasonId
        }
        this.loading2 = true
        api.addSignApply(params).then(res => {
          this.loading2 = false
          if(res.code = 200){
            this.$message.success("提交成功")
            this.Topage()
            this.closeNew()
          }else{
            this.$message.warning(res.message)
          }
        }).catch(err => {
          this.loading2 = false
          this.$message.warning(err)
          console.log(err)
        });
      }
    },
    search(){
      let params={
        pageNum: 1,
        pageSize: 100,
        applyYear: this.applyYear,
        applyType: this.applyType,
        applyTrack: this.applyTrack,
        applyCountry: this.applyCountry,
      }
      this.loading2 = true
      api.getApplyList(params).then(res => {
        console.log(res.data.rows)
        this.tableData = res.data.rows
        this.loading2 = false
      }).catch(err => {
        this.loading2 = false
        this.$message.warning(err)
        console.log(err)
      });
    },
    rowClick(row){
      this.seasonId=row.seasonId;
    },

    applyEdit(item){
      this.editPkId = item.pkId
      this.editList = JSON.parse(JSON.stringify(this.signList))
      this.editVisible = true
    },
    closeEdit(){
      this.editVisible = false
    },
    submitEdit(){
      this.Topage()
      this.editVisible = false
    },
    
    applyDel(pkId){
      this.$confirm('确认删除该记录嘛？', '提示').then((vv) => {
        if (vv) {
          this.loading = true
          api.delSignApply(pkId).then((res) => {
            console.log(res)
            this.$message.success("删除成功")
            this.loading = false
            this.Topage()
          }).catch(err => {
            this.loading = false
            this.$message.warning(err)
            console.log(err)
          });
        }
      })
    },
    handleClose(){
      this.$emit("close")
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
    // 预览
    preview (val) {
      files.preview(val)
    },
    // 下载
    downloadD (val) {
      files.downloadFile(val, url => {
        window.open(url)
      })
    },
  }

}
</script>

<style lang="scss" scoped>
.apply_season{
  padding:10px;
  .apply_item{
    position: relative;
    ::v-deep .el-card__header{
      padding:8px 18px;
      background-color:#ededed;
    }
    ::v-deep .el-card__body{
      padding:10px
    }
    .header_btn{
      float: right; 
      padding: 3px 
    }
  }
}
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
</style>