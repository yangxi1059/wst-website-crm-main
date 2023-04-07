<!--
 * @Author: 库建华
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: kaan
 * @LastEditTime: 2022-06-10 10:36:10
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      v-loading="loading"
      :title="`学生【${menteeData.realName || '无'}】的记录`"
      :visible.sync="watchMenteeEventVisible"
      :close-on-click-modal="false"
      width="600px"
      :before-close="close"
    >
      <div >
        <el-timeline>
          <el-timeline-item v-for="(item,i) in eventArr" :key="item.pkId" :timestamp="item.eventDate" type="primary" placement="top">
            <el-card>
              <div style="display:flex;fontw-weight:600;color:#303133">
                <div style="display:flex">
                  <div style="width:110px">创建人：</div>
                  <div style="width:200px">{{item.createByName}}</div>
                </div>
                <div style="display:flex">
                  <div style="width:110px">事件类型：</div>
                  <div>{{item.eventTypeName}}</div>
                </div>
              </div>
              <div v-if="item.eventContent">
                <div style="display:flex;margin-top:10px" v-for="(detail,j) in JSON.parse(item.eventContent)" :key="j">
                  <div style="width:110px" >{{detail.label}}:</div>
                  <div >{{detail.value}}</div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip.js";
export default {
  props: {
    watchMenteeEventVisible: {
      type: Boolean,
      default: false
    },
    menteeData: {
      type: Object
    }
  },
  data() {
    return {
      loading:false,
      eventArr:[]
    };
  },
  watch: {
    watchMenteeEventVisible: function(val) {
      if (val) {
        console.log(this.menteeData)
        this.initPage()
      }
    }
  },
  mounted() {},
  methods: {
    initPage(){
      this.loading = true;
      api.getMenteeEventArr(this.menteeData.menteeId).then(res => {
        console.log(res.data)
        this.loading = false;
        this.eventArr = res.data;
      })
    },
    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss" scoped>
</style>

