<!--
 * @Author: 杨曦
 * @Date: 2020-11-20 13:17:08
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-11 11:40:08
 * @Version:
 * @Description:
-->
<template>
  <div class="follow-up">
    <el-dialog :close-on-click-modal="false"
        title="request 详情"
        class="info"
        :visible.sync="followUpVisible"
        width="1200px"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :before-close="followUpItemClose"
    >
       <div style="display:flex;justify-content:space-between" >
            <el-card class="box-card" style="width:48%">
                <div slot="header" class="clearfix">
                    <span style="line-height:32px">Request申请详情</span>
                    <el-tag v-if="requestData.requestStatus == 'pending'" style="float: right;" type="warning">待确认</el-tag>
                    <el-tag v-if="requestData.requestStatus == 'confirmed'" style="float: right;" type="primary">已确认</el-tag>
                    <el-tag v-if="requestData.requestStatus == 'completed'" style="float: right;" type="success">已完成</el-tag>
                    <el-tag v-if="requestData.requestStatus == 'cancel'" style="float: right;" type="error">已取消</el-tag>
                </div>
                <div class="text" >
                   <el-row id="yx_height">
                        <el-col :span='6' class="itemNameYx">学员名：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.realName|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">申请行业名：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.requestTrackName|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">已发邮件数：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.inviteCount || '0'}}</el-col>
                        <el-col :span='6' class="itemNameYx">已接受导师数：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.acceptCount || '0'}}</el-col>
                        <el-col :span='6' class="itemNameYx">发起Request时间：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.requestTime|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">Request截止时间：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.requestDeadLine|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">学校名：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.schoolName|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">地区名：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.locationNames || '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">申请公司名：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.companyNames|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">申请公司备注：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.requestCompanyRemark|| '暂无'}}</el-col>
                        <el-col :span='6' class="itemNameYx">申请详情：</el-col>
                        <el-col :span='18' class="itemValueYx">{{requestData.requestDetail|| '暂无'}}</el-col>
                   </el-row>
                   <el-row >
                   </el-row>
                </div>
            </el-card>

            <el-card class="box-card" style="width:48%">
                <div slot="header" class="clearfix">
                    <span style="line-height:32px">邀请导师名单</span>
                </div>
                <div class="text" >
                    <el-table
                        :data="requestData.inviteList"
                        :stripe="true"
                        size="small"
                        highlight-current-row
                        :max-height="height"
                    >
                        <el-table-column align="center" label="状态">
                            <template slot-scope="scope">
                                <el-tag size="small" v-if="scope.row.inviteStatus == 'pending'" type="warning">待确认</el-tag>
                                <el-tag size="small" v-if="scope.row.inviteStatus == 'confirmed'"  type="primary">已确认</el-tag>
                                <el-tag size="small" v-if="scope.row.inviteStatus == 'completed'"  type="success">已完成</el-tag>
                                <el-tag size="small" v-if="scope.row.inviteStatus == 'cancel'" type="error">已取消</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="mentorName" show-overflow-tooltip label="导师名"></el-table-column>
                        <el-table-column align="center" prop="countryNames" show-overflow-tooltip label="国家"></el-table-column>
                        <el-table-column align="center" prop="companyName" show-overflow-tooltip label="公司"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip label="毕业院校">
                            <template slot-scope="scope">
                                <span v-if="scope.row.underSchoolChiName">{{scope.row.underSchoolChiName}} / {{scope.row.underSchoolEngName}}</span>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="countryNames" show-overflow-tooltip label="博士院校">
                             <template slot-scope="scope">
                                <span v-if="scope.row.phdSchoolChiName">{{scope.row.phdSchoolChiName}} / {{scope.row.phdSchoolEngName}}</span>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="trackNames" show-overflow-tooltip label="可带方向"></el-table-column>
                        <el-table-column align="center" prop="inviteTime" show-overflow-tooltip label="邀约时间"></el-table-column>

                    </el-table>
                </div>
            </el-card>
       </div>
      <span slot="footer" class="dialog-footer222">
        <el-button @click="followUpItemClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'

export default {
  mixins: [mixins],
  name: 'followUp',
  props: {
    followUpVisible: {
      type: Boolean
    },
    requestId: {}
  },
  data () {
    return {
      requestData: {},
      loading: false,
      height: document.documentElement.clientHeight - 190
    }
  },
  watch: {
    followUpVisible: function (newData, oldData) {
      this.Togage()
    }
  },
  created () {
  },
  mounted () {},
  methods: {
    Togage () {
      this.loading = true
      api.getRequestDataDetail(this.requestId).then(res => {
        this.requestData = res.data
        console.log(res.data)
        this.$nextTick(() => {
          this.height = document.getElementById('yx_height').offsetHeight
          this.loading = false
        })
      })
    },
    followUpItemClose () {
      this.requestData = {}
      this.height = document.documentElement.clientHeight - 190
      this.$emit('close')
    }
  }
}
</script>
<style>
    .itemNameYx,.itemValueYx{
        line-height: 28px;
        white-space: pre-wrap;
        padding: 8px 0px;
        font-size: 14px;
    }
    .itemNameYx{
        font-weight: 600;
    }
</style>
