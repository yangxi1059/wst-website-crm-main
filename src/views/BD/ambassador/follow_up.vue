<!--
 * @Author: 库建华
 * @Date: 2020-05-25 13:30:32
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 10:10:48
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer title="followUp" :visible.sync="followUpVisible" size="90%" :before-close="close">
      <div class="header" slot="title">
        【{{ambassadorName}}】的followUp记录
        <el-button
          class="add-offer-btn"
          @click="addFollowUp"
          type="primary"
          plain
          round
          size="small"
        >新增followUp</el-button>
      </div>
      <el-table :data="listData" size="mini" highlight-current-row style="width: 100%">
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="setFollowUp(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="delFollowUp(scope.row)">删除</el-button>
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
import api from "@/api/bd.js";
import setFollowUp from "./set_follow_up.vue";

export default {
  name: "followUpList",
  components: { setFollowUp },
  props: {
    followUpVisible: {
      type: Boolean,
      default: false
    },
    ambassadorData: {
      type: Object
    }
  },
  data() {
    return {
      listData: [],
      setFollowUpVisible: false,
      followUpData: {},
      followUpId: "",
      bdApplyVisible: false,
      applyListVisible: false,
      ambassadorName:'',
      followStatus:null,
    };
  },
  watch: {
    followUpVisible: function(val) {
      if (val) {
        this.Topage();
        this.ambassadorName = this.ambassadorData.ambassadorName || '无';
      }
    }
  },
  methods: {
    Topage() {
      api.getFollowUpList({ambassadorId:this.ambassadorData.ambassadorId,followStatus:this.followStatus}).then(res => {
        console.info(res);
        this.listData = res.data;
      });
    },
    close() {
      this.$emit("close");
    },
    addFollowUp() {
      this.followUpData = {
        ambassadorId: this.ambassadorData.ambassadorId
      };
      this.setFollowUpVisible = true;
    },
    setFollowUp(v) {
      this.followUpData = v;
      this.setFollowUpVisible = true;
    },
    followUpClose() {
      this.setFollowUpVisible = false;
      this.followUpData = {};
    },
    followUpSubmit() {
      this.Topage();
      this.followUpClose();
    },
    delFollowUp(v) {
      this.$confirm("此操作将永久删除该followUp, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(
          () => {
            this.$loading();
            api.delFollowUp({ pkId: v.pkId });
          }
        )
        .then(() => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.$loading().close();
          this.Topage();
        })
        .catch(err => {
          console.log(err);
          this.$loading().close();
        });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>