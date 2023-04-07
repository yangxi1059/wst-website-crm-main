<!--
 * @Author: kaan
 * @Date: 2022-04-06 14:07:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-03 14:22:20
 * @Version:
 * @Description:
-->
<template>
<d2-container v-loading="loading">
  <div class="d2_container" ref="d2">
    <div class="search_page" ref="search">
      <div class="search">
        <el-input
          class="mr10 mb10"
          size="mini"
          style="width:200px"
          v-model="search"
          placeholder="请输入搜索内容"
          clearable
          @keyup.enter.native="Topage(1)"
        ></el-input>
        <el-select
          v-model="internshipLocation"
          placeholder="实习方式"
          class="mr10 mb10"
          size="mini"
          style="width:200px"
          clearable
          @change="Topage()"
        >
          <el-option
            v-for="item in internshipLocationList"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>

        <el-select
          placeholder="实习周期"
          v-model="internshipTime"
          class="mr10 mb10"
          size="mini"
          style="width:200px"
          clearable
          @change="Topage()"
        >
          <el-option
            v-for="item in internshipTimeList"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
        </el-select>
        <el-cascader
          size="mini"
          :style="{width:'170px'}"
          class="mr10 mb10"
          v-model="city"
          filterable
          placeholder="请选择国家/城市"
          clearable
          :props="{ checkStrictly: true }"
          :options="cityDic"
          @change="Topage()"
        >
        </el-cascader>
        <el-button
          icon="el-icon-search"
          class="mr10 mb10"
          size="mini"
          plain
          @click="Topage(1)"
        >搜索</el-button>
        <el-button
          icon="el-icon-printer"
          class="mr10 mb10"
          v-if="roleInfo.includes(`internship_down_out`)"
          size="mini"
          plain
          @click="exportFile('table')"
        >导出</el-button>
        <el-button
          icon="el-icon-setting"
          class="mr10 mb10"
          v-if="roleInfo.includes(`internship_setting`)"
          size="mini"
          plain
          @click="setting()"
        >公告设置</el-button>
      </div>
      <pagination
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagination>
    </div>
    <hot-table :settings="settings" v-if="roleInfo.includes(`sales_noVip_check`)" licenseKey="non-commercial-and-evaluation" ref="table"></hot-table>
    <hot-table :settings="settings2" v-else licenseKey="non-commercial-and-evaluation" ref="table"></hot-table>
    <SettingInternship :settingVisible="settingVisible" :settingData="settingData" @close="settingClose"></settingInternship>
    <SettingPost :settingPostVisible="settingPostVisible" :settingData="settingData" @close="settingPostClose" @submit="settingPostSubmit"/>
    <FileAlert :fileVisible="fileVisible" :internshipId2="internshipId2" @close="alertClose" ></fileAlert>
  </div>
</d2-container>
</template>

<script>
import Handsontable from 'handsontable'
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import apiDic from '@/api/dictionary.js'
import FileAlert from './components/FileAlert'
import SettingInternship from './components/Setting'
import SettingPost from './components/SettingPost'
import util from '@/libs/util'
import { mapState } from 'vuex'

const roleInfo = util.sessions.get('roleInfo')
const contract = function (instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td)
  return (td.innerHTML = `<button class='hot-button' onclick='lookContractList(${row})'><i class="el-icon-view"></i><span>查看(${value})</span></button>`)
}

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: {
    FileAlert, SettingInternship, SettingPost
  },
  data () {
    return {
      loading: false,
      search: '',
      internshipLocation: '',
      internshipTime: '',
      city: '',
      pageNum: 1,
      pageSize: 50,
      internshipLocationList: [],
      internshipTimeList: [],
      cityDic: [],
      fileVisible: false,
      settingVisible: false,
      settingPostVisible: false,
      settingData: {},
      total: 0,
      internshipId2: {},
      settings: {
        licenseKey: 'non-commercial-and-evaluation',
        height: 'auto',
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '实习单位名称',
          '实习名称',
          '实习文件',
          '实习周期',
          '实习方式',
          '所在国家',
          '所在城市',
          'VIP金额',
          'Non-VIP金额',
          '实习备注',
          '创建人',
          '更新人'
        ],
        readOnly: true,
        columns: [
          {
            data: 'internshipDesc',
            type: 'text'
          },
          {
            data: 'internshipName',
            type: 'text'
          },
          {
            data: 'fileCount',
            width: 50,
            renderer: contract
          },
          {
            data: 'internshipTimeName',
            type: 'text'
          },
          {
            data: 'internshipLocationName',
            type: 'text'
          },
          {
            data: 'countryName',
            type: 'text'
          },
          {
            data: 'cityName',
            type: 'text'
          },
          {
            data: 'priceUsd',
            type: 'text'
          },
          {
            data: 'novipPriceUsd',
            type: 'text'
          },
          {
            data: 'note',
            type: 'text'
          },
          {
            data: 'createByName',
            type: 'text'
          },
          {
            data: 'updateByName',
            type: 'text'
          }
        ]
      },
      settings2: {
        licenseKey: 'non-commercial-and-evaluation',
        height: 'auto',
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1
        },
        colHeaders: [
          '实习单位名称',
          '实习名称',
          '实习文件',
          '实习周期',
          '实习方式',
          'VIP金额（$）',
          '实习备注',
          '创建人',
          '更新人'
        ],
        readOnly: true,
        columns: [
          {
            data: 'internshipDesc',
            type: 'text'
          },
          {
            data: 'internshipName',
            type: 'text'
          },
          {
            data: 'fileCount',
            width: 50,
            renderer: contract
          },
          {
            data: 'internshipTimeName',
            type: 'text'
          },
          {
            data: 'internshipLocationName',
            type: 'text'
          },
          {
            data: 'priceUsd',
            type: 'text'
          },
          {
            data: 'note',
            type: 'text'
          },
          {
            data: 'createByName',
            type: 'text'
          },
          {
            data: 'updateByName',
            type: 'text'
          }
        ]
      }
    }
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.settings.height = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
        this.settings2.height = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  created () {

  },
  mounted () {
    window.lookContractList = row => this.lookContractList(row)
    api.getOverviewNotice().then(res => {
      if (res.data) {
        this.settingVisible = true
        this.settingData = res.data
      } else {
        this.settingData = {}
      }

      console.log(res, 22222222222)
    })
    apiDic
      .getDicDropdown('internship_duration,internship_location_type')
      .then(res => {
        console.log(res)
        this.internshipTimeList = res.data.internship_duration
        this.internshipLocationList = res.data.internship_location_type
      })
    apiDic.getParentAndChildrenDic({ parentDic: 'country', dicLabel: 'city' }).then(res => {
      console.log('获取国家城市父子字典：', res.data)
      this.cityDic = res.data
    })
    this.Topage(1)
  },
  methods: {
    Topage () {
      const Data = {
        search: this.search,
        pageNum: this.pageNum,
        internshipLocation: this.internshipLocation,
        internshipTime: this.internshipTime,
        country: this.city[0] || '',
        city: this.city[1] || '',
        pageSize: this.pageSize
      }
      api.getInternshipListNew(Data).then(({ data }) => {
        console.log('实习单位列表数据：', data)
        this.total = data.total
        data.rows.forEach(item => {
          if (item.priceType == 'usd') {
            item.priceUsd = `$ ${item.vipPrice}`
            item.novipPriceUsd = `$ ${item.novipPrice}`
          } else if (item.priceType == 'cny') {
            item.priceUsd = `￥${item.vipPrice}`
            item.novipPriceUsd = `￥ ${item.novipPrice}`
          } else {
            item.priceUsd = `${item.priceType} ${item.vipPrice}`
            item.novipPriceUsd = `${item.priceType} ${item.novipPrice}`
          }
        })
        this.settings.data = data.rows
        this.settings2.data = data.rows
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    exportFile (e) {
      // 拿handsontable实例
      console.log(this.$refs[e])
      const handsontable = this.$refs[e].$data.hotInstance
      const fileName = '实习一览_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        // columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename:
          fileName +
          this.userInfo.userName +
          '_' +
          this.userInfo.userId +
          '_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    },
    lookContractList (row) {
      this.internshipId2 = this.settings.data[row]
      this.fileVisible = true
      console.log('查看文件', this.settings.data[row])
    },
    alertClose () {
      this.fileVisible = false
    },
    setting () {
      console.log(11111111)
      this.settingPostVisible = true
    },
    settingClose () {
      this.settingVisible = false
    },
    settingPostClose () {
      this.settingPostVisible = false
    },
    settingPostSubmit () {
      this.settingPostVisible = false
      api.getOverviewNotice().then(res => {
        if (res.data) {
          this.settingData = res.data
        } else {
          this.settingData = {}
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.d2_container{
  width:100%;
  height:100%
}
</style>
