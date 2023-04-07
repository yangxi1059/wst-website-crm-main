<!--
 * @Author: 库建华
 * @Date: 2020-01-15 14:12:16
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-11 13:48:36
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container >
    <div class="feedback" v-loading="loading">
      <div class="search_page">
        <div class="search">
          <el-date-picker
            style="width:120px"
            v-model="applySeason"
            class="mr10"
            size="mini"
            value-format="yyyy"
            type="year"
            @change="Topage(1)"
            placeholder="请选择ApplySeason"
          ></el-date-picker>
          <el-select
            style="width:120px"
            class="mr10"
            size="mini"
            v-model="division1"
            clearable
            filterable
            placeholder="请选择Division"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in division"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            style="width:120px"
            class="mr10"
            size="mini"
            v-model="location"
            clearable
            filterable
            placeholder="请选择Location"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in city"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            style="width:120px"
            class="mr10"
            size="mini"
            filterable
            v-model="school"
            placeholder="请选择学校"
          >
            <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
          <el-select
            style="width:120px"
            class="mr10"
            size="mini"
            clearable
            v-model="publicStatus"
            placeholder="是否可宣传"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            style="width:120px"
            class="mr10"
            size="mini"
            clearable
            v-model="shield"
            placeholder="是否屏蔽学生学校"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search"  size="mini" plain @click="Topage(1)">GO</el-button>
          <el-button
            v-if="roleInfo.includes('offer_history_add')"
            size="mini"
            plain
            @click="addOffer()"
          >新增</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="offerList"
        size="mini"
        highlight-current-row
      >
        <el-table-column align="center" prop="menteeName" label="编辑" min-width="50px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="el-icon-edit"
              v-if="roleInfo.includes('offer_history_edit')"
              @click="edit(scope.row)"
              title="编辑"
            ></el-button>
            <el-button
              size="mini"
              type="text"
              class="el-icon-delete"
              v-if="roleInfo.includes('offer_history_delete')"
              @click="deleteItem(scope.row)"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName" label="Mentee"></el-table-column>
        <el-table-column align="center" prop="applySeason" label="Apply Season"></el-table-column>
        <el-table-column align="center" prop="schoolName" label="Education Background"></el-table-column>
        <el-table-column align="center" prop="companyName" label="Company"></el-table-column>
        <el-table-column align="center" prop="divisionName" label="Division"></el-table-column>
        <el-table-column align="center" prop="locationName" label="Location"></el-table-column>
        <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
        <el-table-column align="center" prop="resultApplyName" label="实习/全职"></el-table-column>
        <el-table-column align="center" prop="publicStatusName" label="可宣传"></el-table-column>
        <el-table-column align="center" prop="shieldName" label="屏蔽学校"></el-table-column>
        <el-table-column align="center" prop="offerSalary" label="年薪"></el-table-column>

        <el-table-column align="center" prop="resultVoucherMosaic" label="Offer">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_history_view_review') &&scope.row.resultVoucherMosaic"
              @click="download(scope.row.resultVoucherMosaic)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_history_down_review') &&scope.row.resultVoucherMosaic"
              @click="downloadD(scope.row.resultVoucherMosaic)"
            >下载</el-button>
            <el-upload
              v-if="roleInfo.includes('offer_history_upload_review')"
              action
              :http-request="uploadFileAxios"
              class="upload-btn"
              ref="elupload"
              :file-list="fileList"
            >
              <el-button
                class="el-icon-upload"
                slot="trigger"
                size="mini"
                type="success"
                plain
                @click="signId = scope.row.signId;pkId = scope.row.pkId"
              >选取文件</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="praiseVoucherMosaic" label="Review">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_history_view_offer') &&scope.row.praiseVoucherMosaic"
              @click="download2(scope.row.praiseVoucherMosaic)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_history_down_offer') &&scope.row.praiseVoucherMosaic"
              @click="downloadD2(scope.row.praiseVoucherMosaic)"
            >下载</el-button>
            <el-upload
              v-if="roleInfo.includes('offer_history_upload_offer')"
              action
              :http-request="uploadFileAxios1"
              class="upload-btn"
              ref="elupload"
              :file-list="fileList"
            >
              <el-button
                class="el-icon-upload"
                slot="trigger"
                size="mini"
                type="success"
                plain
                @click="signId = scope.row.signId;pkId = scope.row.pkId"
              >选取文件</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" title="新增历史Offer" :visible.sync="addVisible" :before-close="close" width="900px">
        <el-form
          size="medium"
          inline
          :model="offerItemData"
          :rules="rules"
          ref="offerItemData"
          label-width="120px"
        >
          <el-form-item label="学员名" prop="menteeName">
            <el-input :style="{width:widths}" v-model="offerItemData.menteeName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="applySeason" prop="applySeason">
            <el-date-picker
              v-model="offerItemData.applySeason"
              class="mr10"
              :style="{width:widths}"
              value-format="yyyy"
              type="year"
              @change="Topage(1)"
              placeholder="请选择ApplySeason"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="school" prop="school">
            <el-select
              :style="{width:widths}"
              filterable
              allow-create
              v-model="offerItemData.school"
              placeholder="请选择"
            >
              <el-option
                v-for="item in schools"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="company" prop="company">
            <el-select
              :style="{width:widths}"
              filterable
              allow-create
              v-model="offerItemData.company"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,i) in company"
                :key="i"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="division" prop="division">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="offerItemData.division"
              allow-create
              placeholder="请选择"
            >
              <el-option
                v-for="item in division"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Location" prop>
            <el-select
              :style="{width:widths}"
              filterable
              v-model="offerItemData.city"
              placeholder="请选择"
              allow-create
            >
              <el-option
                v-for="item in city"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="毕业年份" prop>
            <el-date-picker
              :style="{width:widths}"
              v-model="offerItemData.finishYear"
              type="year"
              value-format="yyyy"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="offer年薪/万(￥)" prop>
            <el-input-number :style="{width:widths}" v-model="offerItemData.offerSalary" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="实习/全职" prop>
            <el-select
              clearable
              :style="{width:widths}"
              filterable
              v-model="offerItemData.resultApply"
              placeholder="请选择"
            >
              <el-option
                v-for="item in resultApplyList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可宣传" prop>
            <el-select
              clearable
              :style="{width:widths}"
              v-model="offerItemData.publicStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in common_yes_or_no"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="屏蔽学生学校" prop>
            <el-select
              :style="{width:widths}"
              clearable
              v-model="offerItemData.shield"
              placeholder="请选择"
            >
              <el-option
                v-for="item in common_yes_or_no"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submit">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import { mapState } from 'vuex'
import { downloadFun, downloadFunD, uploadFunBySys } from '@/libs/file'
export default {
  mixins: [mixins],
  name: 'feedback',
  data () {
    return {
      offerList: [],
      pageNum: 1,
      total: 0,
      applySeason: null,
      location: null,
      division1: null,
      company: [],
      schools: [],
      school: '',
      city: [],
      division: [],
      pageSize: 400,
      finishYear: '',
      offerSalary: '',
      resultApply: '',
      publicStatus: '',
      shield: '',
      resultApplyList: [],
      common_yes_or_no: [],
      loading: false,
      fileList: [],
      addVisible: false,
      offerItemData: {},
      rules: {
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'blur' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        menteeName: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        school: [{ required: true, message: '必填', trigger: 'blur' }],
        company: [{ required: true, message: '必填', trigger: 'blur' }],
        city: [{ required: true, message: '必填', trigger: 'blur' }],
        division: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      widths: '250px'
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mounted () {
    api.getCompanyList().then(res => {
      console.log('company', res)
      this.company = res.data
    })
    this.init()
    this.pageInit()
    this.Topage(1)
  },
  methods: {
    init () {
      // const params = {
      //   pageNum: 1,
      //   pageSize: 9999
      // }
      // apiDic.getSchoolDicList(params).then(res => {
      //   console.log(res)
      //   this.schools = res.data.rows
      // })
    },
    async pageInit () {
      this.schools = await this.getSchool('school')
      console.log(this.schools,222222222222222)
      this.city = await this.getDictionary('city')
      this.division = await this.getDictionary('division')
      this.resultApplyList = await this.getDictionary('internship_or_full_time')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applySeason: this.applySeason,
        location: this.location,
        division: this.division1,
        shield: this.shield,
        publicStatus: this.publicStatus,
        school: this.school
      }
      console.log('offer列表参数', this.division, params)
      this.loading = true
      api.getHistoryOfferList(params).then(res => {
        console.log('offer列表', res)
        this.offerList = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 查看
    download (path) {
      // if (!this.roleInfo.includes(`offer_hm_list_view_hm`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      // if (!this.roleInfo.includes(`offer_hm_list_down_hm`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    // 下载
    downloadD (path) {
      // if (!this.roleInfo.includes(`offer_hm_list_img_view_hm`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD2 (path) {
      // if (!this.roleInfo.includes(`offer_hm_list_img_down_hm`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    // 上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, `temp/offer_his/${this.pkId}/voucher`, url => {
        const data = {
          pkId: this.pkId,
          resultVoucherMosaic: url
        }
        this.submitCommon(data)
        this.fileList = []
        this.$loading().close()
        this.$refs.elupload.clearFiles()
      })
    },
    // 上传
    uploadFileAxios1 (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, `temp/offer_his/${this.pkId}/review`, url => {
        const data = {
          pkId: this.pkId,
          praiseVoucherMosaic: url
        }
        this.submitCommon(data)
        this.fileList = []
        this.$refs.elupload.clearFiles()
      })
    },
    submitCommon (data) {
      api.setHistoryOffer(data).then(res => {
        console.log(res)
        this.Topage(1)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      })
    },
    addOffer () {
      this.addVisible = true
    },
    close () {
      this.offerItemData = {}
      this.addVisible = false
    },
    submit () {
      console.log(this.offerItemData)
      this.$refs.offerItemData.validate((valid) => {
        if (valid) {
          api.setHistoryOffer(this.offerItemData).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.close()
            this.Topage(1)
          })
        }
      })
    },
    edit (item) {
      this.offerItemData = { ...item }
      this.addVisible = true
    },
    deleteItem (v) {
      this.$confirm('此操作将删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            pkId: v.pkId,
            delFlag: '1'
          }
          api.setHistoryOffer(data).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.close()
            this.Topage(1)
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
