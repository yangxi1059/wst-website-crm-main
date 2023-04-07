<!--
 * @Author: 库建华
 * @Date: 2019-08-01 15:52:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:52:53
 * @Version:
 * @Description:
 -->
<template>
  <div class="refund">
    <el-dialog :close-on-click-modal="false" title="退款" :visible.sync="refundVisible" width="1200px" :before-close="close">
      <el-card class="mb20">
        <el-alert title="小贴士：银联转账金额退款时需要扣除1%手续费" type="warning" show-icon :closable="false"></el-alert>
        <el-row v-for="(bill,i) in billList" :key="i" class="mt10">
          <!-- <el-col :span="4" class="mentee-detail-name">类型：{{bill.billTypeName}}</el-col> -->
          <!-- <el-col :span="4" class="mentee-detail-name">状态：{{bill.applyStatusStr}}</el-col> -->
          <el-col :span="4" class="mentee-detail-name">时间：{{bill.revenueDate}}</el-col>
          <el-col :span="4" class="mentee-detail-name">金额：{{bill.currencyType}}{{bill.revenue}}</el-col>
          <el-col :span="8" class="mentee-detail-value">账户：{{bill.accountTypeName}} {{bill.account}}</el-col>
        </el-row>
      </el-card>
      <el-card class="mb20">
        <el-row class="mb10">
          <el-col  :span="3" class="mentee-detail-name">退款货币</el-col>
          <el-col :span="4" class="mentee-detail-value">
            <el-select :style="{width:'100px'}" v-model="revenueType" size="mini" placeholder="请选择" >
              <el-option
                v-for="item in bill_currency_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :offset="11" :span="4" class="mentee-detail-name">退款总金额（Σ退款金额）</el-col>
          <el-col :span="2" class="mentee-detail-value">{{totalPrice}}</el-col>
        </el-row>

        <template v-for="(item,i) in orderData">
          <el-row :key="i" class="mb10">
            <el-col :span="3" class="mentee-detail-name">项目名</el-col>
            <el-col :span="7" class="mentee-detail-value">{{item.programName}} [{{item.endStatus}}]</el-col>
            <el-col :span="3" class="mentee-detail-name">
              <el-checkbox v-if="item.endStatus == '进行中'" v-model="item.endFlag">结束项目</el-checkbox>
              <span v-else>&emsp;</span>
            </el-col>
            <template v-if="roleInfo.includes(`mentee_program_price`)">
              <el-col :span="3" class="mentee-detail-name">项目金额(￥):</el-col>
              <el-col :span="2" class="mentee-detail-value">{{item.programPriceCny}}</el-col>
            </template>
            <template v-else>
              <el-col :span="2" class="mentee-detail-name">
                <span>&emsp;</span>
              </el-col>
              <el-col :span="2" class="mentee-detail-value">
                <span>&emsp;</span>
              </el-col>
            </template>
            <el-col :span="2" class="mentee-detail-name">退款金额</el-col>
            <el-col :span="3" class="mentee-detail-value">
              <el-input-number :controls="false"  v-model="item.refund" size="mini" placeholder></el-input-number>
            </el-col>
          </el-row>
        </template>

        <el-row>
          <el-col :span="3" class="mentee-detail-name">收款账号详情</el-col>
          <el-col :span="20" class="mentee-detail-value">
            <el-input size="mini" v-model="account"></el-input>
          </el-col>
        </el-row>
        <el-row class="mt10">
          <el-col :span="3" class="mentee-detail-name">退款原因</el-col>
          <el-col :span="20" class="mentee-detail-value">
            <el-input size="mini" v-model="note"></el-input>
          </el-col>
        </el-row>
      </el-card>
      <el-form :inline="true" label-width="130px">
        <el-form-item label="材料">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'850px'}"
            drag
          >
            <span class="el-icon-upload"></span>
            <el-button size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'200px'}"
            v-model="item.auditor"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送">
          <el-select :style="{width:'180px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import apiDic from '@/api/dictionary.js'
import apiU from '@/api/user'
import { mapState } from 'vuex'
import { uploadFunBySys } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {

  props: {
    refundVisible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    menteeName: {
      type: String,
      default: ''
    },
    wxID: {
      type: String,
      default: ''
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      user: [],
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      revenueType: null,
      account: '',
      note: '',
      bill_currency_type: [],
      auditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ],
      billList: []
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    totalPrice: function () {
      let p = 0
      this.orderData.forEach(v => {
        p += v.refund || 0
      })
      return p
    }
  },
  watch: {
    refundVisible: function (val) {
      if (val) {
        if (!this.user.length) {
          this.pageInit()
        }
        api.getProgramListByOrderId(this.orderId).then(res => {
          console.log(res)
          this.orderData = res.data.rows
        })
        const params = {
          pageSize: 9999,
          pageNum: 1,
          confirmStatus: 1
        }
        api.getbillList(this.orderId, params).then(res => {
          console.log(res)
          this.billList = res.data.rows
        })
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      apiU.userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
        .then(({ data }) => {
          console.log(
            'userList...........................................',
            data
          )
          this.user = data.rows
        })
      apiDic.getAuditorListByApplyType('sign_refund').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    close () {
      this.revenueType = null
      this.$emit('close')
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      console.log(
        'submit',
        this.fileList,
        this.auditor,
        this.copy,
        this.orderData
      )
      // 验证
      if (!this.totalPrice) {
        this.$message('退款金额不能为空')
        return
      }
      if (!this.account.length) {
        this.$message('收款账号详情不能为空')
        return
      }
      if (!this.fileList.length) {
        this.$message('凭证材料不能为空')
        return
      }
      const approval = []
      let cannot = false
      this.auditorList.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true
        }
        aa.auditor.forEach(v => {
          approval.push({ approverId: v })
        })
      })
      if (cannot) {
        this.$message({
          type: 'warning',
          message: '审核人都为必填！'
        })
        return
      }
      const copyTo = []
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v })
      })
      const data = {
        applyType: 'sign_refund',
        applyTitle: `学员[${this.menteeName}]的退款申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: '学员名',
              value: this.menteeName
            },
            {
              label: '学员微信',
              value: this.wxID
            },
            {
              label: '订单ID',
              value: this.orderId
            },
            {
              label: '退款账户',
              value: this.account
            },
            {
              label: '退款原因',
              value: this.note
            },
            {
              label: '退款金额',
              value: this.revenueType + this.totalPrice
            }
          ],
          info: {
            orderId: this.orderId,
            revenueType: this.revenueType,
            fundType: this.revenueType,
            fundWage: this.totalPrice,
            // 统一金额，类型 不好操作
            totalRefund: this.totalPrice,
            account: this.account,
            note: this.note,
            commisionFlag: false,
            kpiFlag: false,
            program: [],
            voucher: []
          }
        },
        note: this.note,
        keyId: this.orderId
      }
      this.orderData.forEach(v => {
        if (v.endFlag) {
          data.content.info.program.push({
            signId: v.signId,
            endFlag: 1,
            refund: v.refund
          })
        }
      })
      console.log(data)
      for (let i = this.fileList.length - 1; i >= 0; i--) {
        const file = this.fileList[i]
        uploadFunBySys(file.raw, `voucher/refund/${this.orderId}`, url => {
          console.log(url)
          data.content.file.push({
            name: file.name,
            url: url
          })
          data.content.info.voucher.push({
            voucherName: file.name,
            voucherPath: url
          })
          if (data.content.file.length === this.fileList.length) {
            console.log('setRefund参数', data)
            api.setRefund(data).then(res => {
              console.log('setRefund，', res)
              this.$loading().close()
              this.auditor = []
              this.copy = []
              this.orderData = [{}, {}]
              this.billList = [{}, {}]
              this.fileList = []
              this.revenueType = null
              this.account = ''
              this.note = ''
              this.$emit('submit')
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
