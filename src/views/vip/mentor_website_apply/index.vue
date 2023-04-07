<!--
 * @Author: 杨曦
 * @Date: 2020-11-12 13:21:02
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-15 13:30:21
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading" >
    <div class="mentor_apply">
        <div class="search_page">
        <div class="search">
            <el-select
            v-model="auditStatus"
            class="mr10"
            size="mini"
            clearable
            :style="{width:'150px'}"
            @change="Topage(1)"
            >
            <el-option
                v-for="(item,i) in auditStatusList"
                :key="i"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
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
        :data="tableList"
        :stripe="true"
        size="mini"
        highlight-current-row
        :max-height="height"
        >
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="view(scope.row)"
            >详情</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
            <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.auditStatus == 'wait_audit'" type="info">{{scope.row.auditStatusName}}</el-tag>
            <el-tag size="mini" v-else-if="scope.row.auditStatus == 'pass'" type="success">{{scope.row.auditStatusName}}</el-tag>
            <el-tag size="mini" v-else-if="scope.row.auditStatus == 'not_pass'" type="danger">{{scope.row.auditStatusName}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="mentorName" label="申请导师名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="mentorName" label="导师对接" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.mentorId && scope.row.auditStatus == 'pass'" type="success" @click="checkDocking(scope.row)">查看对接任务</el-button>
            <el-button size="mini" v-if="!scope.row.mentorId && scope.row.auditStatus == 'pass'" @click="useDocking(scope.row)" type="info" >分配对接任务</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wxId" label="导师微信ID" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="email" label="导师E-mail" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="coachingSpecialties" show-overflow-tooltip label="擅长辅导模块"></el-table-column>
        <el-table-column align="center" label="简历">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.resumePath"
                @click="download(scope.row.resumePath)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.resumePath"
                @click="downloadD(scope.row.resumePath)"
                >下载</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center" label="在职凭证">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.certificate"
                @click="download2(scope.row.certificate)"
                >查看</el-button>
                <el-button
                size="mini"
                type="text"
                v-if="scope.row.certificate"
                @click="downloadD2(scope.row.certificate)"
                >下载</el-button>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="申请时间"></el-table-column>
        </el-table>
        <mentorApplyDetail :purchaseDetailVisible="purchaseDetailVisible" :pkId="pkId" @close="mentorApplyClose()" @submit="mentorApplySubmit()"></mentorApplyDetail>
        <addDocking :useDockingVisible="useDockingVisible" :dockingDetail="dockingDetail" @close="dockingDetailClose" @submit="dockingDetailSubmit" />
        <dockingDetail :checkDockingVisible="checkDockingVisible" :dockingDetail="dockingDetail" @close="checkDockingClose" />

    </div>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { downloadFun, downloadFunD } from '@/libs/file'
import mentorApplyDetail from './components/vip_mentor_entry.vue'
import addDocking from './components/addDocking.vue'
import dockingDetail from './components/dockingDetail.vue'
import { mapState } from 'vuex'

export default {
  components: { mentorApplyDetail, addDocking, dockingDetail },
  mixins: [mixins],
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  data () {
    return {
      auditStatusList: [],
      auditStatus: '',
      search: '',
      sort: '',
      dockingDetail: {},
      useDockingVisible: false,
      checkDockingVisible: false,
      sortCol: '',
      pageSize: 100,
      pageNum: 1,
      pkId: '',
      total: 0,
      loading: false,
      purchaseDetailVisible: false,
      height: document.documentElement.clientHeight - 190,
      tableList: []
    }
  },
  // 根据学校联动国家
  watch: {},
  created () {},
  mounted () {
    this.pageInit()
    this.Topage()
  },
  methods: {
    async pageInit () {
      this.auditStatusList = await this.getDictionary('audit_status')
    },
    Topage () {
      this.loading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        auditStatus: this.auditStatus
      }
      api.getMentorEntry(data).then(res => {
        this.loading = false
        this.tableList = res.data.rows
        console.log(this.tableList)
        this.total = res.data.total
      })
    },
    download (path) {
      if (!this.roleInfo.includes('mentor_apply_preview')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    download2 (path) {
      if (!this.roleInfo.includes('mentor_apply_preview')) {
        this.$message('无权限')
        return
      }
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    downloadD2 (data) {
      if (!this.roleInfo.includes('mentor_apply_download')) {
        this.$message('无权限')
        return
      }
      const path = data
      downloadFunD(path)
    },
    downloadD (data) {
      if (!this.roleInfo.includes('mentor_apply_download')) {
        this.$message('无权限')
        return
      }
      const path = data
      downloadFunD(path)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    view (val) {
      this.pkId = val.pkId
      this.purchaseDetailVisible = true
    },
    mentorApplyClose () {
      this.purchaseDetailVisible = false
    },
    mentorApplySubmit () {
      this.purchaseDetailVisible = false
      this.Topage()
    },
    checkDocking (detail) {
      this.checkDockingVisible = true
      this.dockingDetail = detail
    },
    checkDockingClose () {
      this.checkDockingVisible = false
    },
    useDocking (detail) {
      this.useDockingVisible = true
      this.dockingDetail = detail
    },
    dockingDetailClose () {
      this.useDockingVisible = false
    },
    dockingDetailSubmit () {
      this.useDockingVisible = false
      this.Topage()
    }
  }
}
</script>

<style lang="scss">
.mentor {
  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
</style>
