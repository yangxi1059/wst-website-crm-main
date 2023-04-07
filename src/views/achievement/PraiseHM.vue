<!--
 * @Author: kaan
 * @Date: 2021-12-22 14:07:20
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-28 14:03:18
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="search_page">
      <div class="search">
        <el-input
          class="mr10"
          size="mini"
          style="width:220px"
          v-model="search"
          clearable
          placeholder="支持学员名"
        ></el-input>
        <el-select
          class="mr10"
          clearable
          size="mini"
          :style="{width:'180px'}"
          v-model="praiseType"
          placeholder="请选择好评类型"
        >
          <el-option
            v-for="confirmItem in praiseTypeList"
            :key="confirmItem.itemValue"
            :label="confirmItem.itemName"
            :value="confirmItem.itemValue"
          ></el-option>
        </el-select>

        <el-select
          class="mr10"
          clearable
          size="mini"
          :style="{width:'180px'}"
          v-model="checkStatus"
          placeholder="请选择核验状态"
        >
          <el-option
            v-for="confirmItem in checkStatusList"
            :key="confirmItem.itemVale"
            :label="confirmItem.itemName"
            :value="confirmItem.itemVale"
          ></el-option>
        </el-select>

        <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
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
      ref="refTable"
      :data="praiseList"
      :stripe="true"
      size="mini"
      highlight-current-row
      :max-height="height"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-descriptions title="" style="padding-left:50px" :contentStyle="{flex:1}">
            <el-descriptions-item label="PM">{{scope.row.servicesName}}</el-descriptions-item>
            <el-descriptions-item label="strategist">{{scope.row.strategistName}}</el-descriptions-item>
            <el-descriptions-item label="好评图下载记录">
              <template>
                <el-link
                  size="mini"
                  type="primary"
                  v-if="roleInfo.includes(`mentee_hm_download_list`) && scope.row.praiseVoucherMosaic"
                  @click="checkDownLoadTimes(scope.row,'praiseVoucherMosaic')"
                >查看({{scope.row.praiseVoucherMosaicDownloadNum}})</el-link>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="更新人">{{scope.row.updateByName}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{scope.row.updateTime}}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{scope.row.createByName}}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{scope.row.createTime}}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" v-if="roleInfo.includes('mentee_hm_praise_up')">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="setPraise(scope.row)">核验</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center"  label="核验状态">
        <template slot-scope="scope">
          <p>
            <template v-if="scope.row.checkNote">
              <el-tooltip placement="top">
                <div slot="content">
                  {{scope.row.checkNote}}
                </div>
                <el-button type="text" class="el-icon-info"></el-button>
              </el-tooltip>
            </template>
            <span v-if="scope.row.checkStatus == 2" style="color:#c32e47">
              {{checkStatusList[scope.row.checkStatus*1].itemName}}
            </span>
            <span v-else>
              {{checkStatusList[scope.row.checkStatus*1].itemName}}
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="menteeName" label="学生名" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="schoolEngName" label="学校(本科)" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="majorName" label="专业(本科)" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="finishYear" label="毕业年份" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="programName" label="项目名" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="praiseTypeName" label="好评类型" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="praiseDate" label="好评日期" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="praiseContent" label="好评内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="praiseVoucher" label="好评图(无码)">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.praiseVoucher"
            @click="preview(scope.row.praiseVoucher,'mentee_hm_praise_view_nm')"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.praiseVoucher"
            @click="download(scope.row.praiseVoucher,'mentee_hm_praise_down_nm')"
          >下载</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="praiseVoucher" label="好评图(有码)">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.praiseVoucherMosaic"
            @click="preview(scope.row.praiseVoucherMosaic,'mentee_hm_praise_view_hm')"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.praiseVoucherMosaic"
            @click="download(scope.row,'mentee_hm_praise_down_hm')"
          >下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <SetPraise :settingVisible="settingVisible" :praiseObjData="praiseObjData" @close="settingOfferClose" @submit="settingOfferSubmit" ></SetPraise>
    <CheckDownLoadTimes :downloadVisible="downloadVisible" :downLoadData="downLoadData"  @close="downLoadClose" />
  </d2-container>
</template>

<script>
import api from '@/api/achievement.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import files from '@/libs/file'
import SetPraise from './components/SetPraise'
import CheckDownLoadTimes from './components/CheckDownloadTimes'
export default {
  mixins: [mixins],
  name: 'PraiseHM',
  components: { SetPraise, CheckDownLoadTimes },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      // 搜索栏数据
      search: '',
      praiseType: '',
      checkStatus: '',
      praiseTypeList: [],
      checkStatusList: [
        {
          itemName: '未核验',
          itemVale: '0'
        },
        {
          itemName: '已核验',
          itemVale: '1'
        },
        {
          itemName: '未通过',
          itemVale: '2'
        }
      ],
      pageNum: 1,
      total: 0,
      pageSize: 100,
      loading: false,
      // table数据
      praiseList: [],
      height: document.documentElement.clientHeight - 185,

      // 弹出框
      settingVisible: false,
      praiseObjData: {},
      // 抽屉
      downloadVisible: false,
      downLoadData: {}
    }
  },
  mounted () {
    this.pageInit()
    this.Topage(1)
  },
  methods: {
    /**
     * @description: 页面初始化
     * @param {*}
     * @return {*}
     */
    async pageInit () {
      this.praiseTypeList = await this.getDictionary('praise_type')
    },
    /**
     * @description: table数据初始化
     * @param {*} i
     * @return {*}
     */
    Topage (i) {
      i == 1 ? this.pageNum = 1 : ''
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        praiseType: this.praiseType,
        checkStatus: this.checkStatus
      }
      this.loading = true
      api.getPraiseList(params).then(res => {
        console.log('getPraiseList列表', res)
        this.praiseList = res.data.rows
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
    /**
     * @description: 预览
     * @param {*}
     * @return {*}
     */
    preview (val, role) {
      if (!this.roleInfo.includes(role)) {
        this.$message('无权限')
        return
      }
      files.preview(val)
    },
    /**
     * @description: 下载
     * @param {*} val
     * @param {*} role
     * @return {*}
     */
    download (row, role) {
      if (!this.roleInfo.includes(role)) {
        this.$message('无权限')
        return
      }
      const params = {
        keyId: row.pkId,
        downloadType: 'menteePraise',
        contentType: 'praiseVoucherMosaic',
        content: row.praiseVoucherMosaic
      }
      api.saveDownLoad(params).then(res => {
        console.log(res)
        const path = row.praiseVoucherMosaic
        console.log(path)
        files.downloadFile(path, url => {
          console.log(path)
        })
      })
    },
    downLoadClose () {
      this.downloadVisible = false
    },
    checkDownLoadTimes (data, type) {
      this.downloadVisible = true
      this.downLoadData = { ...data }
      this.downLoadData.downloadType = 'menteePraise'
      this.downLoadData.contentType = type
    },
    setPraise (v) {
      this.praiseObjData = v
      this.praiseObjData.type = 'HM'
      this.settingVisible = true
    },
    settingOfferClose () {
      this.settingVisible = false
    },
    settingOfferSubmit () {
      this.settingVisible = false
      this.Topage(1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
