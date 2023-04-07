<!--
 * @Author: 杨曦
 * @Date: 2020-04-13 17:16:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 09:36:34
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="feedback d2_container" ref="d2">
        <div class="search_page" ref="search">
            <div class="search">
                <el-input
                class="mr10"
                size="mini"
                style="width:120px"
                v-model="search"
                clearable
                placeholder="支持学员名，微信名，微信ID"
                @keyup.enter.native="Topage(1)"
                ></el-input>
                <el-select
                style="width:120px"
                class="mr10"
                size="mini"
                v-model="userId"
                clearable
                filterable
                placeholder="用户"
                @change="Topage(1)"
                >
                <el-option v-for="(item,i) in users" :key="i" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
                <el-select
                class="mr10"
                style="width:120px"
                size="mini"
                v-model="entranceType"
                clearable
                filterable
                placeholder="类型"
                @change="Topage(1)"
                >
                <el-option
                    v-for="item in entrance_type"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                ></el-option>
                </el-select>
                <el-select
                style="width:120px"
                class="mr10"
                size="mini"
                v-model="schoolId"
                clearable
                filterable
                placeholder="学校"
                @change="Topage(1)"
                >
                <el-option
                    v-for="(item,i) in school"
                    :key="i"
                    :label="item.chiName"
                    :value="item.schoolId"
                ></el-option>
                </el-select>
                <el-select
                class="mr10"
                size="mini"
                style="width:120px"
                v-model="checkStatus"
                clearable
                placeholder="状态"
                @change="Topage(1)"
                >
                <el-option
                    v-for="(item,i) in checkStatusS"
                    :key="i"
                    :label="item.itemName"
                    :value="item.itemVale"
                ></el-option>
                </el-select>
                <el-date-picker
                class="mr10"
                size="mini"
                v-model="applySeason"
                type="year"
                clearable
                style="width:120px"
                value-format="yyyy"
                @change="Topage(1)"
                placeholder="申请季"
                ></el-date-picker>
                <el-button icon="el-icon-search" class="ml0" size="mini" plain @click="Topage(1)">GO</el-button>
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
        :max-height="tableHeight"
        border
        >
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
            <el-button type="text" size="mini" @click="submit(scope.row)">提交</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="checkStatusName" label="审核状态">
            <template slot-scope="scope">
            <div class="colorR" v-if="scope.row.checkStatusName == '未通过'">
                <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.checkNote || '无'"
                >
                <p slot="reference">
                    <i class="el-icon-info"></i>未通过
                </p>
                </el-popover>
            </div>
            <div v-else>{{scope.row.checkStatusName}}</div>
            </template>
        </el-table-column>
        <el-table-column align="center" label="学员信息">
            <el-table-column min-width="100" align="center" prop="menteeName" label="学员名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="sex" label="学员性别"></el-table-column>
            <el-table-column min-width="100" align="center" prop="schoolChiName" label="学校" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="degreeName" label="学历"></el-table-column>
            <el-table-column min-width="100" align="center" prop="majorName" label="专业" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="finishYear" label="毕业年份"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="offer信息">
            <el-table-column
            min-width="100"
            align="center"
            prop="entranceTypeName"
            label="类型"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column
            min-width="100"
            align="center"
            prop="entranceOfferProgramName"
            label="专业项目"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column
            min-width="100"
            align="center"
            prop="chiName"
            label="升学学校"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column
            min-width="100"
            align="center"
            prop="instituteChiName"
            label="学院"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="prepareMonth" label="准备周期（月）" width="120px" ></el-table-column>
            <el-table-column min-width="100" align="center" prop="offerReceiveDate" label="offer获得日期"></el-table-column>
            <el-table-column align="center" prop="applySeason" label="申请季"></el-table-column>
            <el-table-column align="center" prop="story" label="小故事">
            <template slot-scope="scope">
                <el-popover width="400" trigger="hover" :content="scope.row.story">
                <p class="w80" slot="reference">{{scope.row.story}}</p>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注">
            <template slot-scope="scope">
                <el-popover width="400" trigger="hover" :content="scope.row.remark">
                <p class="w80" slot="reference">{{scope.row.remark}}</p>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" prop="offerVoucher" label="凭证(无码)">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.offerVoucher"
                @click="download(scope.row.offerVoucher)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.offerVoucher"
                @click="downloadD(scope.row.offerVoucher)"
                >下载</el-button>
            </template>
            </el-table-column>
            <el-table-column min-width="120" align="center" prop="offerVoucherMosaic" label="凭证(有码)">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.offerVoucherMosaic"
                @click="download2(scope.row.offerVoucherMosaic)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.offerVoucherMosaic"
                @click="downloadD2(scope.row.offerVoucherMosaic)"
                >下载</el-button>
                <el-upload
                v-if="roleInfo.includes(`offer_edu_list_up`)"
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
            <el-table-column min-width="100" align="center" prop="praiseVoucher" label="好评图(无码)">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucher"
                @click="download3(scope.row.praiseVoucher)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucher"
                @click="downloadD3(scope.row.praiseVoucher)"
                >下载</el-button>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="praiseVoucherMosaic" label="好评图(有码)" min-width="120">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucherMosaic"
                @click="download4(scope.row.praiseVoucherMosaic)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.praiseVoucherMosaic"
                @click="downloadD4(scope.row.praiseVoucherMosaic)"
                >下载</el-button>
                <el-upload
                v-if="roleInfo.includes(`offer_edu_list_img_up`)"
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
            <el-table-column align="center" prop="updateByName" label="更新人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="工作信息">
            <el-table-column align="center" prop="shieldName" label="屏蔽学生学校" width="120px" ></el-table-column>
            <el-table-column align="center" prop="publicStatusName" label="可宣传"></el-table-column>
            <el-table-column align="center" prop="displayStatusName" label="官网展示"></el-table-column>
            <el-table-column align="center" prop="salesUsedName" label="sales已用"></el-table-column>
            <el-table-column align="center" prop="mktUsedName" label="mkt已用"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="项目信息">
            <el-table-column min-width="200" align="center" prop="programName" label="项目名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="programPeriod" label="项目周期"></el-table-column>
            <el-table-column align="center" prop="mentorHour" label="签约行业导师课时数" width="180px" ></el-table-column>
            <el-table-column min-width="100" align="center" prop="strategistName" label="VIP导师名">
            <template slot-scope="scope">
                <p :title="scope.row.strategistName  " class="w80">{{scope.row.strategistName }}</p>
            </template>
            </el-table-column>
        </el-table-column>
        </el-table>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import {
  downloadFun,
  downloadFunD,
  uploadFunBySys
} from '@/libs/file'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: 'feedback',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  watch: {
    total: function (val, old) {
      	this.$nextTick(function () {
        this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
      })
    }
  },
  data () {
    return {
      tableHeight: 'auto',
      offerList: [],
      pageNum: 1,
      total: 0,
      search: null,
      userId: 'ALL',
      schoolId: null,
      checkStatus: null,
      applySeason: null,
      pageSize: 100,
      users: [],
      loading: false,
      checkStatusS: [
        {
          itemName: '未核验',
          itemVale: 0
        },
        {
          itemName: '已核验',
          itemVale: 1
        },
        {
          itemName: '未通过',
          itemVale: 2
        }
      ],
      school: [],
      fileList: [],
      signId: null,
      entranceType: null,
      entrance_type: [],
      pkId: null
    }
  },
  mounted () {
    this.pageInit()
    // 获取用户列表users
    api.getUserListByUserId(this.userInfo.userId).then(res => {
      console.log('vip列表', res)
      this.users = res.data
      this.users.unshift({ userName: 'ALL', userId: 'ALL' })
    })
    this.Topage(1)
  },
  methods: {
    async pageInit () {
      this.entrance_type = await this.getDictionary('entrance_type')
      this.school = await this.getSchool("school")
    },
    Topage () {
      this.total = 0
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        resultType: '1',
        entranceType: this.entranceType,
        schoolId: this.schoolId,
        checkStatus: this.checkStatus,
        applySeason: this.applySeason
      }
      console.log('offer列表参数', data)
      this.loading = true
      api.getOfferEduList(data).then(res => {
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
      if (!this.roleInfo.includes('offer_edu_list_view_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      if (!this.roleInfo.includes('offer_edu_list_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download3 (path) {
      if (!this.roleInfo.includes('offer_edu_list_img_view_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download4 (path) {
      if (!this.roleInfo.includes('offer_edu_list_img_view_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    downloadD (path) {
      if (!this.roleInfo.includes('offer_edu_list_down_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD2 (path) {
      if (!this.roleInfo.includes('offer_edu_list_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD3 (path) {
      if (!this.roleInfo.includes('offer_edu_list_img_down_nm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadD4 (path) {
      if (!this.roleInfo.includes('offer_edu_list_img_down_hm')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    // 上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(
        file.file,
        `voucher/offer_list/${this.pkId}`,
        url => {
          const data = {
            pkId: this.pkId,
            offerVoucherMosaic: url
          }
          this.submitCommon(data)
          this.fileList = []
          this.$loading().close()
          this.$refs.elupload.clearFiles()
        }
      )
    },
    // 上传
    uploadFileAxios1 (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(
        file.file,
        `good_figure/offer_list/${this.pkId}`,
        url => {
          const data = {
            pkId: this.pkId,
            praiseVoucherMosaic: url
            // resultVoucherMosaic: url
          }
          this.submitCommon(data)
          this.fileList = []
          this.$refs.elupload.clearFiles()
        }
      )
    },

    submitCommon (data) {
      api.setOfferEduV2(data).then(res => {
        console.log(res)
        this.Topage(1)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      })
    },
    // 重置核验状态
    submit (v) {
      const data = {
        pkId: v.pkId,
        checkStatus: '0',
        checkNote: ''
      }
      api.setOfferEduV2(data).then(res => {
        console.log(res)
        this.Topage(1)
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.w80{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 100%;
}
.d2_container{
  width:100%;
  height:100%
}
</style>
