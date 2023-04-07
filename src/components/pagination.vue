<!--
 * @Author: 库建华
 * @Date: 2019-04-17 13:46:17
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-22 15:20:25
 * @Version: 1
 * @Description:
 -->
<template>
  <el-pagination
    background
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :pager-count="5"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>

<script>
export default {
  name: "pagination",
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSizes:{
      type : Array,
      default: function () {
        return [50, 100, 200, 300, 400, 500]
      }
    },
    pageSize: {
      type: Number,
      default: 50
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    }
  }
};
</script>

<style lang='scss'>
.pagination {
  text-align: right;
  flex: 1;
}
</style>
