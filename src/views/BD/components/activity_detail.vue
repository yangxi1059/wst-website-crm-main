<!--
 * @Author: 库建华
 * @Date: 2020-07-03 14:33:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 14:25:06
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="活动详情" :visible.sync="detailVisible" :before-close="close" width="1300px">
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">活动状态</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityStatusName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动方式</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityWayName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动名称</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">合作商名称</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.cooperatorName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动经费</el-col>
        <el-col
          :span="8"
          class="_item-value"
        >{{(detailData.expenditureTypeName + detailData.expenditure) || '无'}}</el-col>
        <el-col :span="4" class="_item-name">内部负责人</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityResponsiblePersonName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动日期</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityDate || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动开始时间</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityBeginTime || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动结束时间</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityEndTime || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动地点</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityAddr || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">合作方对接人</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityPrincipal || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">线上方式</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.onlineTypeName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">预计参与人数</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.expectParticipantNum || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动反馈</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityFeedback || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动性质</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityProperty || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动流程</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.activityProcess || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">合同对照内容</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.contractRelatedContent || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动宣传手段</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.publicityMeans || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">各部门需要的人数及职能</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.manpowerAndPosition || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">是否组微信群</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.needWxGroupName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">是否需要群运营</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.needWxGroupOperationName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">是否需要物料</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.needMaterielName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">物料是否准备好</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.materielStatusName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">实际参与人数</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.participantNum || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">微信群人数</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.wxGroupNum || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">合作方配合程度</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.coordination || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">导流咨询人数</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.consultNum || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">签约人数</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.signNum || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">活动经验总结</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.experience || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">备注</el-col>
        <el-col :span="8" class="_item-value">
          <span>{{detailData.note || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">物料</el-col>
        <el-col :span="8" class="_item-value">
          <span><p v-for="item in detailData.materielArr" :key="item.pkId">{{item.materielName}}({{item.materielNum}})</p></span>
        </el-col>
        <el-col :span="4" class="_item-name">嘉宾</el-col>
        <el-col :span="8" class="_item-value">
          <span><p v-for="item in detailData.guestArr" :key="item.pkId">{{item.guestName}}</p></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="_item-name">活动完成凭证</el-col>
        <el-col :span="16" class="_item-value">
          <!-- <span>{{detailData.voucherArr || '无'}}</span> -->
          <el-col>
            <el-row :span="20" v-for="item in detailData.voucherArr" :key="item.pkId">
              <el-button
                v-if="roleInfo.includes(`BD_cooperator_activity_voucher_view`)"
                size="mini"
                @click="download(item.voucherPath)"
              >查看</el-button>
              <el-button
                v-if="roleInfo.includes(`BD_cooperator_activity_voucher_download`)"
                size="mini"
                @click="downloadD(item.voucherPath)"
              >下载</el-button>
              {{item.voucherName}}
            </el-row>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import { downloadFun, downloadFunD } from '@/libs/file'
import { mapState } from 'vuex'

export default {
  name: 'activity-detail',
  mixins: [mixins],
  props: {
    detailVisible: Boolean,
    activityData: Object
  },
  computed:{
    ...mapState('role', ['roleInfo'])
  },
  data: () => {
    return {
      detailData: {}
    }
  },
  computed:{
    ...mapState('role', ['roleInfo'])
  },
  watch: {
    detailVisible: function (v) {
      if (v) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      api
        .getCooperatorActivityById(this.activityData.activityId)
        .then((res) => {
          console.log(res.data)
          this.detailData = res.data
        })
    },
    close () {
      this.$emit('close')
    },
    download (val) {
      downloadFun(val, (url) => {
        window.open(url)
      })
    },
    downloadD (val) {
      downloadFunD(val, (url) => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
