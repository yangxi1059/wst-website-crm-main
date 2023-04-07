<template>
  <div class="voucher-view">
    <el-dialog
      title="凭证"
      class="info account"
      :visible.sync="voucherViewVisible"
      width="900px"
      :before-close="voucherViewClose"
    >
      <el-form :inline="true" size="mini" ref="ruleForm" label-width="180px">
        <el-form-item label="合同" :style="{width:'800px'}" prop="voucher">
          <el-button
            type="text"
            :style="{width:'600px','text-align':'left','margin-left':'180px'}"
            icon="el-icon-download"
            v-for="item in voucherData.contractlist"
            :key="item.contractName"
            @click="download(item.contractPath)"
          >{{item.contractName}} 时间：{{item.createTime}}</el-button>
        </el-form-item>
        <el-form-item label="凭证" :style="{width:'800px'}" prop="voucher">
          <el-button
            type="text"
            :style="{width:'600px','text-align':'left','margin-left':'180px'}"
            icon="el-icon-download"
            v-for="item in voucherData.list"
            :key="item.id"
            @click="download(item.voucherPath)"
          >{{item.voucherName}} 时间：{{item.createTime}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/sales_assistant";
import { downloadFun } from "@/libs/file";
import { close } from "fs";
export default {
  name: "voucherView",
  props: {
    voucherViewData: {
      type: Object
    },
    voucherViewVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      voucherData: {
        contractlist: [],
        list: []
      }
    };
  },
  watch: {
    voucherViewVisible: function(newData, oldData) {
      if (newData) {
        this.getVoucherListData();
      }
    }
  },
  created() {},
  methods: {
    getVoucherListData() {
      console.log(this.voucherViewData);
      api.getSignListByapplyId(this.voucherViewData.applyId).then(res => {
        (this.voucherData.list = res.data), console.log(res);
      });
      // api.getSignListByBillId(this.voucherViewData.billId).then(res => {
      //   if(!this.voucherData.list.length) this.voucherData.list = res.data;
      //    console.log(res);
      // });
      api.getContractByOrderId(this.voucherViewData.orderId).then(res => {
        (this.voucherData.contractlist = res.data), console.log(res);
      });
    },
    voucherViewClose() {
      this.$emit("close");
    },
    download(val) {
      downloadFun(val, url => {
        window.open(url);
      });
    }
  }
};
</script>
