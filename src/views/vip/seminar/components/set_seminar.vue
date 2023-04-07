<!--
 * @Author: 库建华
 * @Date: 2020-05-13 10:04:53
 * @LastEditors: 库建华
 * @LastEditTime: 2020-05-14 16:12:33
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="线下课" :visible.sync="setVisible" width="900px" :before-close="close">
      <el-form
        :inline="true"
        ref="signTable"
        label-width="140px"
        :rules="rules"
        :model="seminarData"
      >
        <el-form-item label="线下课名称" prop="seminarName">
          <el-input :style="{width:'610px'}" v-model="seminarData.seminarName" :maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" :autosize="{minRows:3,maxRows:10}" :style="{width:'610px'}" v-model="seminarData.introduction" :maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="seminarStartTime">
          <el-date-picker
            v-model="seminarData.seminarStartTime"
            :style="{width:'230px'}"
            type="datetime"
            placeholder="选择开始时间"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="seminarEndTime">
          <el-date-picker
            v-model="seminarData.seminarEndTime"
            :style="{width:'230px'}"
            type="datetime"
            placeholder="选择开始时间"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadLine">
          <el-date-picker
            v-model="seminarData.deadLine"
            :style="{width:'230px'}"
            type="datetime"
            placeholder="选择开始时间"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input :style="{width:'230px'}" v-model="seminarData.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";
export default {
  props: {
    setVisible: {
      type: Boolean,
      default: false
    },
    seminarId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      seminarData: {},
      rules: {
        seminarName: [{ required: true, message: "必填", trigger: "blur" }],
        introduction: [{ required: true, message: "必填", trigger: "blur" }],
        seminarStartTime: [{ required: true, message: "必填", trigger: "blur" }],
        seminarEndTime: [{ required: true, message: "必填", trigger: "blur" }],
        deadLine: [{ required: true, message: "必填", trigger: "blur" }],
        address: [{ required: true, message: "必填", trigger: "blur" }],
      },
    };
  },
  watch: {
    setVisible: function(val) {
      if (val) {
        this.initPage();
      }
    }
  },
  methods: {
    initPage() {
      if (this.seminarId) {
        this.getSeminar();
      }
    },
    getSeminar() {
      this.$loading();
      api.getSeminarById(this.seminarId).then(res => {
        this.seminarData = res.data;
        this.text = res.data.htmlBody;
        this.$loading().close();
      });
    },
    clean() {
      this.seminarData = {};
      this.text = '';
    },
    close() {
      this.$emit("close");
      this.clean();
    },
    submit() {
      console.log(this.seminarData);
      this.$refs.signTable.validate(valid => {
        if (!valid) return;
        this.$loading();

        if (!this.seminarId) {
          api.addSeminar(this.seminarData).then(res => {
            console.log(res);
            this.$loading().close();
            this.$emit("submit");
            this.clean();
          });
        } else {
          api.uptSeminar(this.seminarData).then(res => {
            console.log(res);
            this.$loading().close();
            this.$emit("submit");
            this.clean();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>