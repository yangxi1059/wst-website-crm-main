<!--
 * @Author: 库建华
 * @Date: 2020-05-25 15:04:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 10:11:44
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer title="followUp" :visible.sync="followUpNumVisible" size="90%" :before-close="close">
      <div class="header" slot="title">
        待followUp
      </div>
      <el-table :data="followUpList" size="mini" highlight-current-row style="width: 100%">
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="setFollowUp(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="ambassadorName"
          align="center"
          label="校园大使"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
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
    </el-drawer>
    <setFollowUp
      :setFollowUpVisible="setFollowUpVisible"
      :followUpData="followUpData"
      @close="followUpClose"
      @submit="followUpSubmit"
    />
  </div>
</template>

<script>
import setFollowUp from "./set_follow_up.vue";
import api from "@/api/bd";

export default {
  name: "followUpNum",
  components: { setFollowUp },
  props: {
    followUpNumVisible: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      setFollowUpVisible: false,
      followUpData: {},
      followUpId: "",
      followUpList:[],
    };
  },
  watch: {
    followUpNumVisible: function(val) {
      if (val) {
        this.Topage();
      }
    }
  },
  methods: {
    Topage() {
     api.getFollowUpNumAmbassador().then(res=>{
        console.log('getFollowUpNumAmbassador',res);
        this.followUpList = res.data || [];
      })
    },
    close() {
      this.$emit("close");
    },
    setFollowUp(v) {
      this.followUpData = {...v};
      this.setFollowUpVisible = true;
    },
    followUpClose() {
      this.setFollowUpVisible = false;
      this.followUpData = {};
    },
    followUpSubmit() {
      this.followUpClose();
      this.Topage();
      this.$emit('submit')
    },
  }
};
</script>

<style lang="scss" scoped>
</style>