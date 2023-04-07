<!--
 * @Author: 杨曦
 * @Date: 2020-10-28 10:23:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-10-29 13:54:23
 * @Version: 
 * @Description: 
-->
<template>
  <div class="set-Rate">
    <el-dialog :close-on-click-modal="false"
      :title="'评分详情'"
      :visible.sync="setRateVisible"
      width="1400px"
      :before-close="handleClose"
    >
      <div class="yx-card_setRate" v-if="setRateList.length > 0" style="display:flex" >
        <div class="yx-setRate_li" style="font-weight:600">
            <div class="yx-div">部门</div>
            <div class="yx-setRate_div2 yx-div">参与人</div>
            <div class="yx-setRate_div3 yx-div">部门 Leader</div>
            <div class="yx-div">BD Leader</div>
        </div>
        <div style="flex:1">
            <ul style="display:flex;" class="yx-setRate_ul">
                <li v-for="(item,i) in setRateList" :key="i" class="yx-setRate_li" >
                    <div class="yx-div" >{{item.deptName}}</div>
                    <div class="yx-div yx-setRate_div2">
                        <div>
                          <span class="yx-div_span">
                            <el-popover
                              placement="top-start"
                              title="评分详情"
                              width="600"
                              trigger="hover"
                              :disabled="item.scoreStatus != 1"
                             >
                              <div v-if="item.score" class="popover-content" style="font-weight:600">
                                <div>评分分数：<span class="yx-div_span">{{item.score || '暂无'}}</span></div>
                                <div>评分日期：<span class="yx-div_span">{{item.scoreDate || '暂无'}}</span></div>
                                <div>评分内容：<span class="yx-div_span">{{item.remark || '暂无'}}</span></div>
                              </div>
                              <el-badge slot="reference" v-if="item.scoreStatus == 1" value="已评分" >
                                  <el-tag type="success">{{item.scorerName}}</el-tag>
                              </el-badge>
                              <el-badge slot="reference" v-else value="未评分" >
                                  <el-tag type="info">{{item.scorerName}}</el-tag>
                              </el-badge>
                            </el-popover>
                          </span>
                        </div>
                        <!-- <div v-if="item.score">评分分数：<span class="yx-div_span">{{item.score}}</span></div>
                        <div v-if="item.scoreDate">评分日期：<span class="yx-div_span">{{item.scoreDate}}</span></div>
                        <div v-if="item.remark">评分内容：<span class="yx-div_span">{{item.remark}}</span></div> -->
                    </div>
                    <div class="yx-div" v-if="item.deptName == '销售'">
                      <div >
                        <span class="yx-div_span">
                          <el-popover
                              placement="top-start"
                              title="评分详情"
                              width="600"
                              trigger="hover"
                              :disabled="(!setRate.salesLeader || setRate.salesLeader.scoreStatus == 0)"
                             >
                              <div v-if="setRate.salesLeader" class="popover-content" style="font-weight:600">
                                <div>评分分数：<span class="yx-div_span">{{setRate.salesLeader.score || '暂无'}}</span></div>
                                <div>评分日期：<span class="yx-div_span">{{setRate.salesLeader.scoreDate || '暂无'}}</span></div>
                                <div>评分内容：<span class="yx-div_span">{{setRate.salesLeader.remark || '暂无'}}</span></div>
                              </div>
                              <el-badge slot="reference" v-if="setRate.salesLeader && setRate.salesLeader.scoreStatus == 1" value="已评分" >
                                  <el-tag type="success">Daisy</el-tag>
                              </el-badge>
                              <el-badge slot="reference" v-else value="未评分" >
                                  <el-tag type="info">Daisy</el-tag>
                              </el-badge>
                          </el-popover>
                        </span>
                      </div>
                      <!-- <div v-if="setRate.salesLeader&&setRate.salesLeader.score">评分分数：<span class="yx-div_span">{{setRate.salesLeader.score}}</span></div>
                      <div v-if="setRate.salesLeader&&setRate.salesLeader.scoreDate">评分日期：<span class="yx-div_span">{{setRate.salesLeader.scoreDate}}</span></div>
                      <div v-if="setRate.salesLeader&&setRate.salesLeader.remark">评分内容：<span class="yx-div_span">{{setRate.salesLeader.remark}}</span></div> -->
                    </div>
                    <div class="yx-div" v-else-if="item.deptName == 'VIP'">
                      <div >
                        <span class="yx-div_span">
                          <el-popover
                            placement="top-start"
                            title="评分详情"
                            width="600"
                            trigger="hover"
                            :disabled="(!setRate.vipLeader || setRate.vipLeader.scoreStatus == 0)"
                            >
                            <div v-if="setRate.vipLeader" class="popover-content" style="font-weight:600">
                              <div>评分分数：<span class="yx-div_span">{{setRate.vipLeader.score || '暂无'}}</span></div>
                              <div>评分日期：<span class="yx-div_span">{{setRate.vipLeader.scoreDate || '暂无'}}</span></div>
                              <div>评分内容：<span class="yx-div_span">{{setRate.vipLeader.remark || '暂无'}}</span></div>
                            </div>
                            <el-badge slot="reference" v-if="setRate.vipLeader && setRate.vipLeader.scoreStatus == 1" value="已评分" >
                                <el-tag type="success">Sabrina</el-tag>
                            </el-badge>
                            <el-badge slot="reference" v-else value="未评分" >
                                <el-tag type="info">Sabrina</el-tag>
                            </el-badge>
                          </el-popover>
                        </span>
                      </div>
                      <!-- <div v-if="setRate.vipLeader&&setRate.vipLeader.score"><span class="yx-div_span">评分分数：{{setRate.vipLeader.score}}</span></div>
                      <div v-if="setRate.vipLeader&&setRate.vipLeader.scoreDate"><span class="yx-div_span">评分日期：{{setRate.vipLeader.scoreDate}}</span></div>
                      <div v-if="setRate.vipLeader&&setRate.vipLeader.remark"><span class="yx-div_span">评分内容：{{setRate.vipLeader.remark}}</span></div> -->
                    </div>
                    <div class="yx-div" v-else>暂无</div>
                </li>  
            </ul>
            <div class="yx-setRate_bd" style="text-align:center">
              <div >
                <span class="yx-div_span">
                   <el-popover
                    placement="top-start"
                    title="评分详情"
                    width="600"
                    trigger="hover"
                    :disabled="(!setRate.bdLeader || setRate.bdLeader.scoreStatus == 0)"
                    >
                    <div v-if="setRate.bdLeader" class="popover-content" style="font-weight:600">
                      <div>评分分数：<span class="yx-div_span">{{setRate.bdLeader.score || '暂无'}}</span></div>
                      <div>评分日期：<span class="yx-div_span">{{setRate.bdLeader.scoreDate || '暂无'}}</span></div>
                      <div>评分内容：<span class="yx-div_span">{{setRate.bdLeader.remark || '暂无'}}</span></div>
                    </div>
                    <el-badge slot="reference" v-if="setRate.bdLeader && setRate.bdLeader.scoreStatus == 1" value="已评分" >
                        <el-tag type="success">Winnie</el-tag>
                    </el-badge>
                    <el-badge slot="reference" v-else value="未评分" >
                        <el-tag type="info">Winnie</el-tag>
                    </el-badge>
                   </el-popover>
                </span>
              </div>
                  <!-- <div v-if="setRate.bdLeader&&setRate.bdLeader.score"><span class="yx-div_span">评分分数：{{setRate.bdLeader.score}}</span></div>
                  <div v-if="setRate.bdLeader&&setRate.bdLeader.scoreDate"><span class="yx-div_span">评分日期：{{setRate.bdLeader.scoreDate}}</span></div>
                  <div v-if="setRate.bdLeader&&setRate.bdLeader.remark"><span class="yx-div_span">评分内容：{{setRate.bdLeader.remark}}</span></div> -->
            </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/bd.js";
export default {
  name: "applyList",
  props: {
    activityData: {
      type: Object,
    },
    setRateVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      setRateList:[],
      setRate:{}
    };
  },
  watch: {
    setRateVisible: function (newData) {
        if (newData) {
            this.initPage()
        }
    },
  },
  mounted() {},
  methods: {
      initPage(){
          let data = {
            activityId:this.activityData.activityId
          }
          api.getSetRateScore(data).then(res => {
              console.log(res)
              this.setRateList = res.data.scoreArr;
              if(this.setRateList.length < 1){
                this.$message({
                  message: '当前合作商活动无评分',
                  type: 'error'
                });
              }
              this.setRate = res.data
          })
      },
      handleClose(){
          this.setRateList = [];
          this.$emit('close')
      }
  },
};
</script>

<style>
    .yx-card_setRate{
        font-size: 14px;
        line-height: 32px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .yx-setRate_li{
        border-right: 1px solid #503f3f3d;
    }
    .yx-setRate_li .yx-div{
        padding: 20px 40px;
        font-weight:600;
        min-height: 34px;
    }
    .yx-div_span{
      font-weight: 400;
    }
    .yx-setRate_ul{
        border-bottom: 1px solid #503f3f3d;
    }
    .yx-setRate_div2{
        border-bottom: 1px solid #503f3f3d;
        border-top: 1px solid #503f3f3d;
    }
    .yx-setRate_div3{
        border-bottom: 1px solid #503f3f3d;
    }
    .yx-setRate_bd{
        padding: 20px 0px;
        font-weight: 600;
    }
</style>