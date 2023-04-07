<!--
 * @Author: 库建华
 * @Date: 2020-05-12 18:21:02
 * @LastEditors: 库建华
 * @LastEditTime: 2020-05-13 10:59:18
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="detailVisible" width="1500px" :before-close="close">
      <div v-html="text"></div>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";
export default {
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      text: "",
    };
  },
  watch: {
    detailVisible: function(val) {
      if (val) {
        this.initPage();
      }
    }
  },
  methods: {
    initPage() {
      if (this.taskId) {
        this.getNewsLetter();
      }
    },
    getNewsLetter() {
      this.$loading();
      api.getNewsLetterByTaskId(this.taskId).then(res => {
        this.text = res.data.htmlBody || '无数据';
        this.$loading().close();
      });
    },
    clean() {
      this.newsLetterData = {};
      this.text = '';
    },
    close() {
      this.$emit("close");
      this.clean();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>