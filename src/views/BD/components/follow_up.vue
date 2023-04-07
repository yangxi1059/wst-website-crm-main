<!--
 * @Author: 库建华
 * @Date: 2020-05-25 13:30:32
 * @LastEditors: Kaan
 * @LastEditTime: 2022-05-07 11:45:28
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <div class="header" slot="title">
      【{{cooperatorName}}】的followUp记录
      <el-button class="add-offer-btn ml10" @click="addFollowUp" type="primary" size="mini">主动followUp</el-button>
    </div>
    <el-table :data="listData" size="mini" highlight-current-row style="width: 100%">
      <div slot="empty" style="height:50px;line-height: 50px;">
        <i class="el-icon-warning-outline"></i>暂无数据
      </div>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="setFollowUp(scope.row)" v-if="scope.row.followStatus == 0">follow</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="beginDate"
        align="center"
        label="开始时间"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="endDate"
        align="center"
        label="截止时间"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="followStatusName"
        align="center"
        label="followUp状态"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="followResult"
        align="center"
        label="followUp内容"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="contentType"
        align="center"
        label="关联"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="followVoucher"
        align="center"
        label="附件"
        min-width="100"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.followVoucher" @click="download(scope.row.followVoucher)" size="mini">查看</el-button>
        </template>
      </el-table-column>
        <el-table-column
        prop="followTime"
        align="center"
        label="follow时间"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="followByName"
        align="center"
        label="follow人"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="updateByName"
        align="center"
        label="更新人"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createByName"
        align="center"
        label="创建人"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <setFollowUp
      :setFollowUpVisible="setFollowUpVisible"
      :followUpData="followUpData"
      @close="followUpClose"
      @submit="followUpSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/bd.js'
import setFollowUp from './set_follow_up.vue'
import { downloadFun } from '@/libs/file'

export default {
  name: 'followUpList',
  components: { setFollowUp },
  props: {
    activeName: {
    },
    cooperatorData: {
      type: Object
    }
  },
  data () {
    return {
      listData: [],
      setFollowUpVisible: false,
      followUpData: {},
      followUpId: '',
      bdApplyVisible: false,
      applyListVisible: false,
      cooperatorName: '',
      followStatus: null
    }
  },
  watch: {
    activeName: function (val) {
      if (val == 'seventh') {
        this.Topage()
        console.log(this.cooperatorData)
        this.cooperatorName = this.cooperatorData.cooperatorName || '无'
      }
    }
  },
  methods: {
    Topage () {
      api.getFollowUpListCooperator({ cooperatorId: this.cooperatorData.cooperatorId, followStatus: this.followStatus }).then(res => {
        console.info(res)
        this.listData = res.data
      })
    },
    close () {
      this.$emit('close')
    },
    addFollowUp () {
      this.followUpData = {
        cooperatorId: this.cooperatorData.cooperatorId
      }
      this.setFollowUpVisible = true
    },
    setFollowUp (v) {
      this.followUpData = v
      this.setFollowUpVisible = true
    },
    followUpClose () {
      this.setFollowUpVisible = false
      this.followUpData = {}
    },
    followUpSubmit () {
      this.Topage()
      this.followUpClose()
    },
    delFollowUp (v) {
      this.$confirm('此操作将永久删除该followUp, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          () => {
            this.$loading()
            api.delFollowUpCooperator({ pkId: v.pkId })
          }
        )
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$loading().close()
          this.Topage()
        })
        .catch(err => {
          console.log(err)
          this.$loading().close()
        })
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
