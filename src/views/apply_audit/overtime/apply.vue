<template>
  <div class="overtime">
    <el-dialog :close-on-click-modal="false"
      title="加班申请"
      :visible.sync="overtimeApplyVisible"
      width="1200px"
      :before-close="close"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="加班类型">
          <el-select :style="{width:'200px'}" size="mini" v-model="workType" placeholder="请选择">
            <el-option
              v-for="item in [{itemValue:'0',itemName:'日常加班'},{itemValue:'1',itemName:'调休加班'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '$$' + item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            :style="{width:'200px'}"
            size="mini"
            v-model="overtimeBegin"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            :style="{width:'200px'}"
            size="mini"
            v-model="overtimeEnd"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="加班时长（小时）">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            v-model="overtimeDay"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>
        <el-form-item label="加班事由">
          <el-input
            :style="{width:'560px'}"
            size="mini"
            v-model="account"
            maxlength="199"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="材料、凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'200px'}"
          >
            <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'200px'}"
            v-model="item.auditor"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送">
          <el-select :style="{width:'200px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";
import axios from "@/api/dictionary.js";
import apiU from "@/api/user";
import util from '@/libs/util'
import { uploadFunBySys } from "@/libs/file";
export default {
  props: {
    overtimeApplyVisible: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      user: [],
      userInfo: util.sessions.get('userInfo'),
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: "cny",
      note: "",
      account: "",
      payUser: "",
      overtimeBegin: null,
      overtimeEnd: null,
      overtimeDay: null,
      workType: null,
      expenditureReason: null,
      overtime_type: [],
      auditorList: [
        {
          auditor: [],
          confirmCol: "",
          confirmorArr: [
            {
              confirmorName: "",
              isDefult: "",
              confirmCol: "",
              confirmType: "",
              confirmorId: ""
            }
          ]
        }
      ]
    };
  },
  computed: {
    // overtime: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    overtimeApplyVisible: function(val) {
      if (val) {
        console.log(val);
        api.getProgramListByOrderId(this.orderId).then(res => {
          console.log(res);
          this.orderData = res.data.rows;
        });
        axios.getAuditorListByApplyType("overtime_working").then(res => {
          console.log("getAuditorListByApplyType", res.data);
          res.data.forEach(v => {
            v.auditor = [];
            v.confirmorArr.forEach(value => {
              if (value.isDefult == 1) {
                v.auditor .push(value.confirmorId);
              }
            });
          });
          this.auditorList = [...res.data];
        });
      }
    }
  },
  mounted() {
    apiU
      .userList({
        pageNum: 1,
        pageSize: 1000,
        entryStatus: "1"
      })
      .then(({ data }) => {
        console.log(
          "userList...........................................",
          data
        );
        this.user = data.rows;
      });
  },
  methods: {
    getOrder() {
      console.log(this.orderId);
      api
        .getOrderDataByOrderId(this.orderId)
        .then(res => {
          this.orderPrice = res.data.orderInfo.orderPrice;
          console.log(res, this.orderPrice);
        })
        .catch(err => {
          err;
          this.$message("orderID不存在");
        });
    },
    close() {
      this.$emit("close");
      this.clear();
    },
    clear() {
      this.expenditureAmount = null;
      this.expenditureReason = null;
      this.payUser = null;
      this.account = null;
      this.note = null;
      this.fileList = [];
      this.auditor = [];
      this.copyTo = [];
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    submit() {
      console.log(
        "submit",
        this.fileList,
        this.auditor,
        this.copy,
        this.orderData
      );
      // 验证
      if (!this.overtimeBegin) {
        this.$message("开始时间不能为空");
        return;
      }
      if (!this.overtimeEnd) {
        this.$message("结束时间不能为空");
        return;
      }
      if (!this.overtimeDay) {
        this.$message("加班时长不能为空");
        return;
      }
      if (!this.workType) {
        this.$message("加班类型不能为空");
        return;
      }
      if (!this.account || !this.account.length) {
        this.$message("加班事由不能为空");
        return;
      }
      let approval = [];
      let cannot = false;
      this.auditorList.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true;
        }
        aa.auditor.forEach(v => {
          approval.push({ approverId: v });
        });
      });
      if (cannot) {
        this.$message({
          type: "warning",
          message: "审核人都为必填！"
        });
        return;
      }
      let copyTo = [];
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v });
      });
      let data = {
        applyType: "overtime_working",
        applyTitle: `[${this.userInfo.userName}]的加班申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: "加班类型",
              value: this.workType.split("$$")[1]
            },
            {
              label: "开始时间",
              value: this.overtimeBegin
            },
            {
              label: "结束时间",
              value: this.overtimeEnd
            },
            {
              label: "加班时长（小时）",
              value: this.overtimeDay
            },
            {
              label: "加班事由",
              value: this.account
            }
          ],
          info: {
            // note: this.note,
            workReason: this.account,
            beginTime: this.overtimeBegin,
            endTime: this.overtimeEnd,
            workType: this.workType.split("$$")[0],
            workHours: this.overtimeDay
          }
        }
      };
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          let file = this.fileList[i];
          uploadFunBySys(file.raw, `voucher/overtime`, url => {
            console.log(url);
            data.content.file.push({
              name: file.name,
              url: url
            });
            if (data.content.file.length === this.fileList.length) {
              console.log("setovertime参数", data);
              api.setRefund(data).then(res => {
                console.log("setovertime，", res);
                this.$emit("submit");
                this.clear();
              });
            }
          });
        }
      } else {
        api.setRefund(data).then(res => {
          console.log("setovertime，", res);
          this.$emit("submit");
          this.clear();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>