<!--
 * @Author: kaan
 * @Date: 2022-03-25 17:40:49
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-25 17:47:13
 * @Version: 
 * @Description: 
-->
<template>
  <div class="send-out">
    <el-dialog title="待送礼品" :visible.sync="sendOutVisible" width="1500px" :before-close="close" :append-to-body="true" :close-on-click-modal="false">
      <el-table
        ref="multipleTable"
        :data="giftList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderId" label="订单ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="programName" label="项目名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contact1Name" label="主联系人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recipientName" label="收货人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recipientPhone" label="收货人电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recipientAddr" label="收货人地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="giftInfo" label="礼品信息" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signDate" label="签约时间" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/sales_assistant";
export default {
  name: "giftSendOutList",
  props: {
    sendOutVisible: {
      type: Boolean,
      default: false
    },
    myDate: {
      type: Array
    }
  },
  data() {
    return {
      giftList: [],
      multipleSelection: []
    };
  },
  watch: {
    sendOutVisible: function(val) {
      if (val) {
        this.Topage();
      }
    }
  },
  methods: {
    Topage() {
      api.getGiftSendList(this.myDate || [], "0").then(res => {
        console.log(res);
        this.giftList = res.data.rows;
      });
    },
    close() {
      this.$emit("close");
    },
    submit() {
      let arr = [];
      this.multipleSelection.forEach(v => {
        arr.push(v.orderId);
      });
      console.log(this.multipleSelection, arr);
      api.sendOutGift(arr).then(res => {
        console.log(res);
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.$emit("submit");
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>