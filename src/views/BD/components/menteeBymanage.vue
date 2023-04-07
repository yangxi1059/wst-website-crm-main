<!--
 * @Author: 库建华
 * @Date: 2020-05-25 15:04:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-05 10:41:56
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer title="followUp" :visible.sync="showMenteeArrVisible" size="90%" :before-close="close">
      <div class="header" slot="title">合作商转介绍学生</div>
      <el-tag class="ml20" type="warnning" size="medium">仅展示近60条数据</el-tag>
      <el-tag class=""  type="danger" size="medium">列表学生签约须满足BD管理提成规则方可得到提成</el-tag>
      <el-table style="margin:0 20px;" :data="showMenteeArr" size="mini" highlight-current-row >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="cooperatorName" label="合作商名称"></el-table-column>
        <el-table-column align="center" prop="menteeName" label="menteeName" min-width="80"></el-table-column>
        <el-table-column align="center"  label="微信ID">
          <template slot-scope="scope">
            <div :title="scope.row.wxId2">{{scope.row.wxId}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wxName" label="微信名"></el-table-column>
        <el-table-column align="center" prop="finishYear" label="学生毕业年份"></el-table-column>
        <el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90"></el-table-column>
        <el-table-column align="center" prop="signStatusName" label="签约状态" min-width="80"
          :filters="signStatusList"
          :filter-method="filterTag"
          column-key="filterStatus"
          filter-placement="bottom-end"
        ></el-table-column>
        <el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询"></el-table-column>
        <el-table-column align="center" prop="firstAskDate" label="首次咨询日期"></el-table-column>
        <el-table-column align="center" prop="counselorDate" label="分配顾问日期"></el-table-column>
        <el-table-column align="center" prop="counselorName" label="顾问姓名"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import api from '@/api/bd'
import mixins from '@/plugin/mixins'

export default {
  name: 'showMenteeArr',
  mixins: [mixins],
  props: {
    showMenteeArrVisible: {
      type: Boolean,
      default: false
    },
    manageBy: {}
  },
  data () {
    return {
      showMenteeArr: [],
      signStatusList: []
    }
  },
  watch: {
    showMenteeArrVisible: function (val) {
      if (val) {
        this.init()
        this.Topage()
      }
    }
  },
  methods: {
    async init () {
      this.signStatusList = []
      const mentee_sign_status = await this.getDictionary('mentee_sign_status')
      mentee_sign_status.forEach(v => {
        this.signStatusList.push({ text: v.itemName, value: v.itemName })
      })
    },
    Topage () {
      api.menteeArrBymanage('', '').then(res => {
        this.showMenteeArr = res.data || []
      })
    },
    close () {
      this.$emit('close')
    },
    filterTag (value, row) {
      console.log(value)
      return row.signStatusName === value
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
