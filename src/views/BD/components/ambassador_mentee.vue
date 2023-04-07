<!--
 * @Author: 杨曦
 * @Date: 2020-10-28 10:23:45
 * @LastEditors: kaan
 * @LastEditTime: 2021-10-13 13:35:49
 * @Version: 
 * @Description: 
-->
<template>
  <div class="ambassdor_mentee">
    <el-dialog :close-on-click-modal="false"
      :title="'校园大使【'+ambassadorData.ambassadorName+'】的学员列表'"
      :visible.sync="setRateVisible"
      width="1200px"
      top="10vh"
      :before-close="handleClose"
    >
    <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="width: 100%;)"
        height="calc(80vh - 70px)">
        <el-table-column
          prop="menteeName"
          label="学员名"
        >
        </el-table-column>
        <el-table-column
            prop="wxId"
            label="微信ID"
            width="200">
        </el-table-column>
        <el-table-column
            prop="wxName"
            label="微信名"
            width="">
        </el-table-column>
        <el-table-column
            prop="parentWx1"
            label="家长1微信"
            width="">
        </el-table-column>
        <el-table-column
            prop="parentWx2"
            label="家长2微信"
            width="">
        </el-table-column>
        <el-table-column 
          align="center" 
          prop="finishYear" 
          label="学生毕业年份">
        </el-table-column>
        <el-table-column
          align="center" 
          prop="schoolChiName" 
          label="学生所在学校（中文名）" 
          min-width="150">
        </el-table-column>
        <el-table-column
            prop="effectiveConsultingName"
            label="是否有效咨询">
        </el-table-column>
        <el-table-column
            prop="signStatusName"
            label="签约状态">
        </el-table-column>
        <el-table-column
            prop="counselorName"
            label="分配顾问姓名">
        </el-table-column>
        <el-table-column
            prop="counselorDate"
            label="分配顾问日期">
        </el-table-column>
        <el-table-column
            prop="firstAskDate"
            label="首次咨询日期">
        </el-table-column>
    </el-table>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/bd.js";
export default {
  name: "applyList",
  props: {
    ambassadorData: {
      type: Object,
    },
    setRateVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading:false,
      tableData:[],
    };
  },
  watch: {
    setRateVisible: function (newData) {
      if (newData) {
          this.initPage()
      }
    },
  },
  mounted() {},
  methods: {
    initPage(){
      this.loading = true
      console.log(this.ambassadorData.ambassadorId,'yx1111111111')
      let data = {
          ambassadorId: this.ambassadorData.ambassadorId
      }
      api.getAmbassadorMenteeList(data).then(res => {
        this.loading = false
        console.log(res)
        this.tableData = res.data
      })
        
    },
    handleClose(){
      this.tableData = [];
      this.$emit('close')
    }
  },
};
</script>

<style>

</style>