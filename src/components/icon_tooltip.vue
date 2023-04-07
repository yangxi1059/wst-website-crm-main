<!--
 * @Author: kaan
 * @Date: 2021-09-01 16:01:50
 * @LastEditors: kaan
 * @LastEditTime: 2021-09-01 17:12:52
 * @Version: 
 * @Description: 
-->

<template>
  <div class="limit">
    <el-tooltip :content="`字典项：${value}`" placement="top" :class="className">
      <i class="el-icon-info"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "iconTooltip",
  props: {
    value: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    },
    // 常用class ml-10 mr10
  },
  data() {
    return {
    };
  },
  watch: {
  },
  mounted(){

  },
  methods: {
  }
};
</script>

<style lang='scss'>
.limit{
  display: inline-block;
}
</style>
