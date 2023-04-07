<!--
 * @Author: 库建华
 * @Date: 2019-11-25 14:56:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 11:00:11
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'详情'"
      :visible.sync="orderSupplementaryVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">申请人</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createByName}}</el-col>
        <el-col :span="4" class="_item-name">申请状态</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
        <el-col :span="4" class="_item-name">申请时间</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createTime}}</el-col>
      </el-row>
      <el-card>
        <el-row class="mb10" v-if="refundData.content">
          <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
            <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
            <el-col style="flex:20" class="_item-value">
              <span :title="item.value">{{item.value || '无'}}</span>
            </el-col>
          </div>
        </el-row>
        <el-row class="mb10" v-if="refundData.content">
          <div>
            <el-col :span="4" class="_item-name">文件</el-col>
            <el-col :span="20" class="_item-value">
              <div class="mb10" v-for="(item,i) in refundData.content.file" :key="i">
                <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-card>

      <el-row class="mb10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="4" class="_item-name">抄送人</el-col>
        <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
         <el-button
            type="primary"
            v-if="applyData.applyStatus == '1' && recall"
            @click="recall(applyData)"
          >撤回</el-button>
          <el-button
            type="primary"
            v-if="applyData.applyStatus == '3' && reapplyList.includes(applyData.applyType)"
            @click="reapply(applyData)"
          >重申</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from '@/libs/file'
import api from '@/api/vip.js'
export default {
  name: 'recommend',
  props: {
    applyData: {
      type: Object
    },
    orderSupplementaryVisible: {
      type: Boolean,
      default: false
    },
    recall: Function,
    reapply: Function,
    reapplyList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        approverid: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      },
      approval: '',
      copyTo: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝']
    }
  },
  watch: {
    orderSupplementaryVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情 yx***', this.applyData)
        api.getApplyDetailByApplyId(this.applyData.applyId).then((res) => {
          this.refundData = {
            pay: res.data.pay,
            apply: res.data.apply,
            content: JSON.parse(res.data.apply.content),
            copyTo: res.data.copyTo,
            approval: res.data.approval
          }
          this.approval = ''
          res.data.approval.forEach((v) => {
            this.approval += `<p class='mb10'>${
              v.approverName
            } - <span class='${this.Myclass[v.approveStatus]}'>${
              this.MyStatus[v.approveStatus]
            } </span>  ${v.approveTime || ''}</p>`
          })
          this.copyTo = ''
          res.data.copyTo.forEach((v) => {
            this.copyTo += v.copyToName + '; '
          })
          console.log('详情数据yxdetail *****', this.refundData)
        })
      }
    }
  },
  mounted () {},
  methods: {
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.$emit('close')
      this.refundData = {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      }
    },
    download (val) {
      downloadFun(val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
