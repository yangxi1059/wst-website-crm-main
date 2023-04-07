<!--
 * @Author: 库建华
 * @Date: 2019-08-14 11:19:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:02:35
 * @Version:
 * @Description:
 -->
<template>
  <div class="order_entry_info" v-loading="loading">
    <el-dialog :close-on-click-modal="false" size="mini" title="签约通知" :visible.sync="orderEntryVisible" width="800px" :before-close="close">
      <div class="title" style="text-align: center;">[{{orderEntryRemindInfo.menteeName}}]签约成功提醒</div>
      <div class="box">
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">订单ID:</div>
              <div>{{orderEntryRemindInfo.orderId}}</div>
          </div>
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">签约日期:</div>
              <div>{{orderEntryRemindInfo.signDate}}</div>
          </div>
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">订单金额:</div>
              <div>CNY {{orderEntryRemindInfo.orderPrice}}</div>
          </div>
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">主副联系人:</div>
              <div>{{orderEntryRemindInfo.contact1Name}}/{{orderEntryRemindInfo.contact2Name}}</div>
          </div>
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">签约学生:</div>
              <div>{{orderEntryRemindInfo.menteeName}}</div>
          </div>
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">签约项目:</div>
              <div>{{orderEntryRemindInfo.programNames}}</div>
          </div>
          <div class="block" style="display: flex;">
              <div class="left" style="font-weight: 600;">渠道来源:</div>
              <div>{{orderEntryRemindInfo.channelSourceName}}</div>
          </div>
      </div>
      <div class="box2">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in orderEntryRemindInfo.eventArr"
              :key="index"
              :timestamp="activity.eventDate">
              {{activity.event}}
            </el-timeline-item>
          </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
export default {
  props: {
    orderEntryVisible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      loading: false,
      orderEntryRemindInfo: {
        channelSourceName: '',
        contact1Name: '',
        contact2Name: '',
        eventArr: [],
        menteeName: '',
        orderId: '',
        orderPrice: 0,
        programNames: '',
        signDate: ''
      }
    }
  },
  watch: {
    orderEntryVisible: function (val) {
      if (val) {
        this.pageInit()
      }
    }
  },
  mounted () {

  },
  methods: {
    pageInit () {
      this.loading = true
      api.orderEntryRemindInfo(this.orderId).then(res => {
        console.log(res.data)
        this.orderEntryRemindInfo = res.data
        this.loading = true
      })
    },
    close () {
      this.$emit('close')
    }

  }
}
</script>

<style lang="scss" scoped>
    .title{
      font-size: 24px;
      font-weight: 600;
    }
    .box{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-top: 20px;
        border-radius: 5px;
    }
    .top_icon{
        margin-top: 20px;
    }
    .left{
        width: 120px;
    }
    .block{
        margin-bottom: 10px;
    }
    .box2{
        padding-left: 20px;
        margin-top: 20px;
    }

    .top_icon{
        width: 0;
        height: 0;
       box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .order_entry_info .el-dialog__body{
      padding: 0px 20px;
    }
</style>
