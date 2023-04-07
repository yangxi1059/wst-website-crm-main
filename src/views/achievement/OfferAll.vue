<!--
 * @Author: 库建华
 * @Date: 2020-01-15 14:12:16
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-25 15:23:50
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container >
    <div class="feedback">
      <div class="search_page">
        <div class="search">
          <el-date-picker
            v-model="applySeason"
            class="mr10 mb10"
            style="width:120px"
            size="mini"
            value-format="yyyy"
            type="year"
            @change="Topage(1)"
            placeholder="请选择ApplySeason"
          ></el-date-picker>
          <el-select
            class="mr10 mb10"
            style="width:120px"
            size="mini"
            v-model="company"
            clearable
            filterable
            placeholder="请选择Company"
            @change="Topage(1)"
          >
            <el-option-group
              v-for="group in companyDic"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
          <el-cascader
            size="mini"
            :style="{width:'120px'}"
            class="mr10 mb10"
            v-model="division"
            filterable
            placeholder="请选择Division"
            clearable
            :props="{ checkStrictly: true }"
            :options="divisionDic"
            @change="Topage(1)"
          >
          </el-cascader>
          <el-cascader
            size="mini"
            :style="{width:'120px'}"
            class="mr10 mb10"
            v-model="location"
            filterable
            placeholder="请选择Location"
            clearable
            :props="{ checkStrictly: true }"
            :options="locationDic"
            @change="Topage(1)"
          >
          </el-cascader>
          <el-select
            class="mr10 mb10"
            :style="{width:'120px'}"
            size="mini"
            v-model="school"
            clearable
            filterable
            placeholder="请选择School"
            @change="Topage(1)"
          >
            <el-option-group
              v-for="group in schoolDic"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
          <el-select v-model="userId" clearable class="mr10 mb10" :style="{width:'120px'}" @change="Topage(1)" placeholder="相关销售" size="mini">
            <el-option-group
              v-for="group in optionsSelect"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
              </el-option>
            </el-option-group>
          </el-select>
          <el-button icon="el-icon-search" class="mr10 "  size="mini" plain @click="Topage(1)">GO</el-button>
          <el-button
            class=""
            style="margin-left:0px"
            icon="el-icon-download"
            size="mini"
            plain
            v-if="roleInfo.includes('offer_all_list_downloadAllOffer')"
            @click="downloadAllOffer"
          >导出</el-button>
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
        :v-loading="loading"
        highlight-current-row
        @sort-change="sortTable"
      >
        <el-table-column align="center" prop="menteeName" label="Mentee" sortable></el-table-column>
        <el-table-column align="center" prop="applySeason" label="Apply Season" sortable></el-table-column>
        <el-table-column align="center" prop="schoolName" label="Education Background" sortable></el-table-column>
        <el-table-column align="center" prop="companyName" label="Company" sortable></el-table-column>
        <el-table-column align="center" prop="division" label="Division" sortable></el-table-column>
        <el-table-column align="center" prop="location" label="Location" sortable></el-table-column>
        <el-table-column align="center" prop="resultVoucherMosaic" label="Offer">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_all_view_review') &&scope.row.resultVoucherMosaic"
              @click="download(scope.row.resultVoucherMosaic)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_all_down_review') &&scope.row.resultVoucherMosaic"
              @click="downloadD(scope.row.resultVoucherMosaic)"
            >下载</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="praiseVoucherMosaic" label="Review">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_all_view_offer') &&scope.row.praiseVoucherMosaic"
              @click="download2(scope.row.praiseVoucherMosaic)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_all_down_offer') &&scope.row.praiseVoucherMosaic"
              @click="downloadD2(scope.row.praiseVoucherMosaic)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import api2 from '@/api/sales_assistant'
import util from '@/libs/util'
import { downloadFun, downloadFunD } from '@/libs/file'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: 'feedback',
  data () {
    return {
      offerList: [],
      pageNum: 1,
      total: 0,
      userId: '',
      applySeason: '',
      companyDic: [],
      company: '',
      divisionDic: [],
      division: '',
      locationDic: [],
      location: '',
      schoolDic: [],
      school: '',
      optionsSelect: [{
        label: '在职',
        options: []
      }, {
        label: '离职',
        options: []
      }],
      sort: '',
      sortCol: '',
      pageSize: 100,
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
    this.init()
    this.Topage(1)
  },
  methods: {
    init () {
      api2.getSalesListOnWork().then(res => {
        res.data.forEach(item => {
          if (item.entryStatus == '1') {
            this.optionsSelect[0].options.push(item)
          } else {
            this.optionsSelect[1].options.push(item)
          }
        })
        console.log(res)
      })
      api.getAllOfferSelect().then(res => {
        console.log('初始化下拉选', res)
        this.companyDic = res.data.companyDic
        this.divisionDic = res.data.divisionDic
        this.locationDic = res.data.locationDic
        this.schoolDic = res.data.schoolDic
      })
    },
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applySeason: this.applySeason,
        country: this.location[0] || '',
        location: this.location[1] || '',
        school: this.school,
        company: this.company,
        contactId: this.userId,
        basicDivision: this.division[0] || '',
        division: this.division[1] || '',
        sort: this.sort,
        sortCol: this.sortCol
      }
      console.log('offer列表参数', this.division, params)
      this.loading = true
      api.getAllOfferList(params).then(res => {
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
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      downloadFun(path, url => {
        window.open(url)
      })
    },
    // 下载
    downloadD (path) {
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD2 (path) {
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    close () {
      this.offerItemData = {}
      this.addVisible = false
    },
    sortTable (v) {
      console.log(v.order, v.prop)
      const orderToSort = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.sort = orderToSort[v.order] || null
      this.sortCol = v.prop
      this.Topage()
    },
    downloadAllOffer () {
      const fileName = '所有offer'
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}sign/job/offers/downloadExcel?applySeason=${this.applySeason}&country=${this.location[0] || ''}&location=${this.location[1] || ''}` +
        `&school=${this.school}&company=${this.company}&basicDivision=${this.division[0] || ''}&division=${this.division[1] || ''}&sort=${this.sort}&sortCol=${this.sortCol}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.xlsx' // 如123.xlsx
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
