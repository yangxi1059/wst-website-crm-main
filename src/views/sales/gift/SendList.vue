<template>
  <d2-container v-loading="loading">
    <div class="sale">
      <el-date-picker
        v-model="myDate"
        class="mr10"
        type="daterange"
        size="mini"
        :unlink-panels="true"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @keyup.enter.native="Topage()"
      ></el-date-picker>
      <el-select
        class="mr10"
        size="mini"
        filterable
        v-model="isSend"
        clearable
        placeholder="状态选择"
        @change="Topage(1)"
      >
        <el-option
          v-for="item in [{itemValue:'1',itemName:'已送'},{itemValue:'0',itemName:'待送'}]"
          :key="item.itemValue"
          :label="item.itemName"
          :value="item.itemValue"
        ></el-option>
      </el-select>
      <el-button @click="Topage" size="mini">GO</el-button>
      <el-button @click="edit" size="mini">编辑</el-button>
      <el-button @click="exportFile('saleTable')" size="mini">导出</el-button>
      <el-button @click="sendOut" size="mini">记录发货</el-button>
      <div class="table mt10">
        <hot-table :settings="settings" ref="saleTable" licenseKey="non-commercial-and-evaluation"></hot-table>
      </div>
    </div>
    <OrderDetail
      :orderId="orderId"
      :menteeInfo="menteeInfo"
      :detailVisible="detailVisible"
      @close="orderDetailClose"
      @submit="orderDetailSubmit"
    />
    <GiftSendOutList
      :sendOutVisible="sendOutVisible"
      :myDate="myDate"
      @close="sendOutClose"
      @submit="sendOutSubmit"
    />
  </d2-container>
</template>

<script>
import OrderDetail from "../order/components/OrderDetail";
import GiftSendOutList from "./components/GiftSendOutList";
import { HotTable } from "@handsontable/vue";
import Handsontable from "handsontable";
import axios from "@/api/sales_assistant";

const hotbutton = function(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td);
  let innerHTML = "";
  innerHTML += `<button class='hot-button' onclick='editGift(${row})' title="查看"><i class="el-icon-view"></i><span>${value}</span></button>`;
  td.innerHTML = innerHTML;
  return td;
};
const isSend = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.dom.empty(td);
  td.innerHTML = `<p class=${
    value == "已送" ? "colorG" : "colorR"
  }>${value}</p>`;
  return td;
};
// 是否收齐
const renderPayStatus = function(instance, td, row, col, prop, value) {
  Handsontable.dom.empty(td);
  if (value == "2") {
    td.innerHTML = `<span class='colorH'>未入账</span>`;
  } else if (value == "0") {
    td.innerHTML = `<span class='colorR'>部分入账</span>`;
  } else if (value == "1") {
    td.innerHTML = `<span class='colorG'>全部入账</span>`;
  } else if (value == "3") {
    td.innerHTML = `<span class='colorB'>部分入账,有退款</span>`;
  } else if (value == "4") {
    td.innerHTML = `<span class='colorB'>已收齐,有退款</span>`;
  }
  return td;
};
export default {
  name: "SalesGiftSendList",
  components: { HotTable, OrderDetail, GiftSendOutList },
  // mixins: [mixins],
  data() {
    return {
      loading:false,
      updatedData: [],
      myDate: [],
      settings: {
        // width: 584,
        data: [],
        copyable: false,
        fillHandle: false,
        height: () => {
          return document.documentElement.clientHeight - 126;
        },
        //readOnly: true,
        minSpareRows: 0, // always add 3 empty rows at the table end
        manualColumnResize: true, //可拖动列宽 as a boolean to enable column resize
        //manualColumnResize: [40, 50],//(column at 0 index has 40px and column at 1 index has 50px)
        hiddenColumns: {
          columns: [0],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: "orderId"
          },
          {
            data: "sendInfo",
            width: 40,
            renderer: isSend
          },
          {
            data: "orderId",
            renderer: hotbutton
          },
          {
            data: "programName",
            type: "text"
          },
          {
            data: "realName",
            type: "text"
          },
           {
            data: "payStatus",
            width: 110,
            // wordWrap: false,
            // className: "short-text",
            renderer: renderPayStatus
          },
          {
            data: "contact1Name",
            type: "text"
          },
          {
            data: "recipientName",
            type: "text"
          },
          {
            data: "recipientPhone",
            type: "text"
          },
          {
            data: "recipientAddr",
            type: "text"
          },
          {
            data: "remark",
            type: "text"
          },
          {
            data: "giftInfo",
            type: "text"
          },
          {
            data: "signDate",
            type: "text"
          },
          {
            data: "updateByName",
            type: "text"
          },
          {
            data: "updateTime",
            type: "text"
          },
        ],
        stretchH: "all",
        autoWrapRow: true,
        rowHeaders: true,
        colHeaders: [
          "",
          "状态",
          "订单ID",
          "项目名",
          "学员姓名",
          "是否收齐",
          "主联系人",
          "礼品收货人昵称",
          "礼品收货人电话",
          "地址",
          "备注",
          "礼品",
          "签约时间",
          "最近更新人",
          "最近更新时间",
        ],
        columnSorting: true,
        contextMenu: false,
        sortIndicator: true,

        // contextMenu: [
        //   "row_above",
        //   "row_below",
        //   "---------",
        //   "remove_row",
        //   "---------",
        //   "undo",
        //   "redo",
        //   "---------",
        //   "make_read_only",
        //   "---------",
        //   "alignment"
        // ],
        //dropdownMenu:  ['filter_by_condition', 'filter_by_value','filter_action_bar'],
        // dropdownMenu: true,
        filters: true,
        //renderAllRows : true,
        search: true
        /* cells: function (row, col, prop) {
			   var cellProperties = {};
			   cellProperties.renderer = "negativeValueRenderer";
			   return cellProperties;
                }, */
      },
      month: [],
      orderId: "",
      editOrderId: "",
      orderDetailVisible: false,
      detailVisible: false,
      sendOutVisible: false,
      menteeInfo: {},
      isSend: "0"
    };
  },
  methods: {
    orderDetailClose() {
      this.detailVisible = false;
      this.menteeInfo = {};
    },
    orderDetailSubmit() {
      this.orderDetailClose();
      this.Topage(1);
    },
    sendOutClose() {
      this.sendOutVisible = false;
    },
    sendOutSubmit() {
      this.sendOutClose();
      this.Topage(1);
    },
    editGift(row) {
      console.log(row, this.settings.data[row]);
      this.orderId = this.settings.data[row].orderId;
      this.detailVisible = true;
    },
    Topage() {
      // if (!this.myDate || !this.myDate.length) {
      //   this.$message("日期不能为空");
      //   return;
      // }
      this.loading = true;
      axios.getGiftSendList(this.myDate || [], this.isSend).then(res => {
        console.log(res);
        this.settings.data = res.data.rows;
        this.loading = false;
      });
    },
    // 导出文件

    exportFile(e) {
      let handsontable = this.$refs[e].$data.hotInstance;
      let fileName = "销售列表_";

      if (e == "saleKPITable") {
        fileName = "销售KPI列表_";
        // this.setPayData();
      } else {
        // this.setData();
      }
      let exportPlugin1 = handsontable.getPlugin("exportFile");
      exportPlugin1.downloadFile("csv", {
        bom: true,
        // columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: "csv",
        filename: fileName + "[YYYY]-[MM]-[DD]",
        mimeType: "text/csv",
        rowDelimiter: "\r\n",
        rowHeaders: true
      });
    },
    //发货记录
    sendOut() {
      this.sendOutVisible = true;
    },
    edit() {
      this.$prompt("请输入orderId", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.orderId = value;
          this.detailVisible = true;
        })
        .catch(() => {});
      // this.orderId = this.editOrderId;
    }
  },

  created() {
    // 获取当前时间（月份）
    // let month;
    // let data = new Date();
    // month =
    //   data.getMonth() + 1 > 9
    //     ? data.getMonth() + 1
    //     : "0" + (data.getMonth() + 1);
    // month = data.getFullYear() + "-" + month;
    // this.MyData.select_data = month;
    // 通过时间去拿当月销售数据
    // this.getSaleList(month);
    // 拿可查询销售数据的月份列表
    // api
    //   .salesHistoryMonth()
    //   .then(response => {
    //     console.log("销售kpi已统计月份数据：", response.data);
    //     this.month = response.data;
    //     this.month.unshift("2019-08");
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  },
  mounted() {
    window.editGift = row => this.editGift(row);
    this.Topage();
  }
};
</script>


<style scoped>
.table {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
}
.sale-revenue {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #fff;
}
.revenue-head {
  font-size: 20px;
  margin: 5px 30px;
}
.info {
  text-overflow: ellipsis;
}
</style>

