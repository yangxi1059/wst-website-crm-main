<!--
 * @Author: 库建华
 * @Date: 2020-05-26 11:12:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-20 14:29:55
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog
      :title="(followUpItem.menteeId ? '编辑' : '新增' ) + '【'+menteeData.realName+'】followUp规则'"
      :visible.sync="menteeFollowRuleVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="followUpItemClose"
    >
      <el-form
        size="medium"
        inline
        :model="followUpItem"
        :rules="rules"
        ref="followUp"
        label-width="120px"
      >
        <el-form-item label="间隔天数" prop="intervalDay">
          <el-input-number
            :controls="false"
            :style="{width:'200px'}"
            v-model="followUpItem.intervalDay"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="容错天数" prop="tolerateDay">
          <el-input-number
            :controls="false"
            :style="{width:'200px'}"
            v-model="followUpItem.tolerateDay"
          ></el-input-number>
        </el-form-item>
         <el-form-item label="更新时间" prop>
          <el-input :disabled="true" :style="{width:'200px'}" v-model="followUpItem.updateTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followUpItemClose">取 消</el-button>
        <el-button type="primary" @click="followUpItemSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";

export default {
  name: "followUpRuleList",
  props: {
    menteeFollowRuleVisible: {
      type: Boolean,
      default: false
    },
    menteeData: {
      type: Object
    }
  },
  data() {
    return {
      followUpItem: {},

      rules: {
        intervalDay: [{ required: true, message: "必填", trigger: "blur" }],
        tolerateDay: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  watch: {
    menteeFollowRuleVisible: function(val) {
      if (val) {
        this.Topage();
      }
    }
  },
  mounted(){
  },
  methods: {
    Topage() {
      api
        .getFollowUpRule({ menteeId: this.menteeData.menteeId })
        .then(res => {
          console.info(res);
          this.followUpItem = res.data || {};
        });
    },
    followUpItemClose() {
      this.$emit("close");
      this.followUpItem = {};
      this.$refs.followUp.resetFields();
    },
    followUpItemSubmit() {
      console.log(this.followUpItem);
      this.$refs.followUp.validate(valid => {
        if (!valid) return;
        let data = {
          menteeId: this.menteeData.menteeId,
          intervalDay: this.followUpItem.intervalDay,
          tolerateDay: this.followUpItem.tolerateDay
        };
        console.log(data);
        if (this.followUpItem.menteeId) {
          api
            .uptFollowUpRule(data)
            .then(res => {
              console.log(res);
              this.Topage();
              this.followUpItemClose();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
            });
        } else {
          api
            .addFollowUpRule(data)
            .then(res => {
              console.log(res);
              this.Topage();
              this.followUpItemClose();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
            });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
