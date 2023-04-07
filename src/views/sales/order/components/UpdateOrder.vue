<!--
 * @Author: 库建华
 * @Date: 2019-11-07 10:53:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-16 18:07:26
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      title="更新信息"
      :visible.sync="updateSignDataVisible"
      width="1000px"
      :before-close="close"
    >
      <el-form :inline="true" ref="signTable" label-width="200px" :rules="rules" :model="signData1">
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="signData1.startDate"
            :style="{width:'230px'}"
            type="date"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="signData1.endDate"
            :style="{width:'230px'}"
            type="date"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="行业导师一对一课时数" prop="mentorHour">
          <el-input-number
            :controls="false"
            :style="{width:'230px'}"
            v-model="signData1.mentorHour"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Strategist Sessions（旧）" prop="vipHour">
          <el-input-number :controls="false" :style="{width:'230px'}" v-model="signData1.vipHour"></el-input-number>
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
  name:'updateSignData',
  props: {
    updateSignDataVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ""
    },
    signData: {
      type: Object
    }
  },
  data: () => {
    return {
      signData1: {
        startDate: "",
        endDate: "",
        mentorHour: 0,
        vipHour: 0
      },
      rules: {
        startDate: [{ required: true, message: "必填", trigger: "blur" }],
        endDate: [{ required: true, message: "必填", trigger: "blur" }],
        mentorHour: [{ required: true, message: "必填", trigger: "blur" }],
        vipHour: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  watch: {
    updateSignDataVisible: function(val, old) {
      if (val) {
        console.log(this.signData)
        this.signData1.startDate = JSON.parse(JSON.stringify(this.signData.startDate));
        this.signData1.endDate = JSON.parse(JSON.stringify(this.signData.endDate));
        this.signData1.mentorHour = JSON.parse(JSON.stringify(this.signData.mentorHour));
        this.signData1.vipHour = JSON.parse(JSON.stringify(this.signData.vipHour));
      }
    }
  },
  methods: {
    close() {
      this.$emit("close");
      this.$refs.signTable.resetFields();
    },
    submit() {
      console.log("submit");
      this.$refs.signTable.validate(valid => {
        if (!valid) return;
        let data = {
          signId: this.signId,
          startDate: this.signData1.startDate,
          endDate: this.signData1.endDate,
          mentorHour: this.signData1.mentorHour,
          vipHour: this.signData1.vipHour
        };
        api.updateSignData(data).then(res => {
          if(res.code == 20001){
            this.$message.error(res.message)
          }else{
            console.log('更新', res)
            this.$emit('submit')
          }
        })
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>