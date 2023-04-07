<!--
 * @Author: 库建华
 * @Date: 2020-07-02 16:09:18
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-10-15 17:58:59
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      title="更新合作内容"
      :visible.sync="cooperationContentVisible"
      width="800px"
      :before-close="close"
    >
      <el-form inline label-width="100px">
        <el-form-item label="合作商:">{{cooperatorData.cooperatorName}}</el-form-item>
        <el-form-item label=" ">
          <el-button @click="addCooperation">添加合作内容</el-button>
        </el-form-item>
        <el-card v-if="cooperationArr.length" class="mb20">
          <template v-for="(item,i) in cooperationArr">
            <div :key="i">
              <el-form-item :label="'合作内容'+ (1+i)" prop>
                <el-input :style="{width:widths}" v-model="item.contentType" :maxlength="10"></el-input>
              </el-form-item>
              <el-form-item label="数量" prop>
                <el-input-number
                  :controls="false"
                  :style="{width:widths}"
                  v-model="item.contentNum"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注" prop>
                <el-input :style="{width:widths}" v-model="item.contentNote" :maxlength="255"></el-input>
              </el-form-item>
              <el-form-item label prop>
                <el-button
                  size="mini"
                  class="el-icon-delete"
                  @click="deleteCooperation(i)"
                  title="删除"
                ></el-button>
              </el-form-item>
            </div>
          </template>
        </el-card>
        <el-divider>申请配置</el-divider>
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
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from "@/api/dictionary.js";
import api from "@/api/bd";
export default {
  name: "",
  props: {
    cooperationContentVisible: {
      type: Boolean,
      default: false
    },
    cooperatorData: {
      type: Object
    }
  },
  data() {
    return {
      widths: "230px",
      cooperationArr: [],
      cacheCooperatorData: {},
      users: [],
      copy: [],
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
  watch: {
    cooperationContentVisible: function(v) {
      if (v) {
        this.initPage();
        if (!this.users.length) {
          this.init();
        }
      }
    }
  },
  methods: {
    init() {
      let params = {
        pageNum:1,
        pageSize:999
      };
      apiDic.userList(params).then(({ data }) => {
        console.log(
          "userList...........................................",
          data
        );
        this.users = data.rows;
      });
      apiDic.getAuditorListByApplyType("cooperator_content").then(res => {
        console.log("getAuditorListByApplyType", res.data);
        res.data.forEach(v => {
          v.auditor = [];
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId);
            }
          });
        });
        this.auditorList = [...res.data];
      });
    },
    initPage() {
      api
        .getCooperatorDataById(this.cooperatorData.cooperatorId)
        .then(res => {
          console.log(res.data);
          this.cacheCooperatorData = res.data;
          this.cooperationArr = res.data.contentArr || [];
        });
    },
    addCooperation() {
      this.cooperationArr.push({
        contentType: "",
        contentNum: 0,
        contentNote: ""
      });
    },
    deleteCooperation(i) {
      this.cooperationArr.splice(i, 1);
    },
    clear() {
      this.cooperationArr = [];
      this.cacheCooperatorData = {};
    },
    close() {
      this.$emit("close");
    },
    submit() {
      console.log(this.cacheCooperatorData, this.cooperationArr);
      let info = {
        cooperatorId: this.cacheCooperatorData.cooperatorId,
        contentArr: this.cooperationArr
      };

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
        applyType: "cooperator_content",
        applyTitle: `BD合作商[${this.cacheCooperatorData.cooperatorName}]的合作内容申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: "合作方名称",
              value: this.cacheCooperatorData.cooperatorName
            }
          ],
          info: info
        }
      };
      this.cooperationArr.forEach(v => {
        data.content.text.push({
          label: v.contentType,
          value: v.contentNum + "(" + v.contentNote + ")"
        });
      });
      console.log(data);
      api.applyAmbassadorPayment(data).then(res => {
        console.log(res);
        this.$message({
          type: "success",
          message: "申请成功"
        });
        this.$loading().close();
        this.$emit("submit");
        this.clear();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>