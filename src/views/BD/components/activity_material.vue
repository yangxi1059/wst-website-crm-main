<!--
 * @Author: 杨曦
 * @Date: 2020-12-31 11:16:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-12-31 14:21:31
 * @Version: 
 * @Description: 
-->
<template>
  <div class="pay-way">
    <el-dialog :close-on-click-modal="false"
      width="600px"
      :title="'活动【' + guestData.activityName + '】物料详情'"
      :visible.sync="materialVisible"
      :before-close="close"
    >
        <el-table
        :data="tableData"
        size="small"
        style="width: 100%">
            <el-table-column
            prop="materielName"
            align="center"
            label="物料名称"
            >
            </el-table-column>
            <el-table-column
            prop="materielNum"
            align="center"
            label="物料数量"
            >
            </el-table-column>
            <el-table-column
            prop="materielNote"
            align="center"
            label="物料备注"
            >
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/bd.js";

export default {
  name: "payWay",
  props: {
    materialVisible: {
      type: Boolean,
      default: false
    },
    guestData:{
        type:Object
    }
  },
  data() {
    return {
        tableData:[],
    };
  },
  mounted() {
   
  },
  watch: {
    materialVisible: function(newData, oldData) {
      if (newData) {
        this.Topage();
      }
    }
  },
  methods: {
    Topage() {
        api.getMaterial(this.guestData.activityId).then(res => {
            console.log(res.data)
            this.tableData = res.data
        })
    },
    close(){
        this.$emit('close')
    },
  }
};
</script>

