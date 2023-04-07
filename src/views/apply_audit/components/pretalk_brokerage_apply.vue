<!--
 * @Author: 库建华
 * @Date: 2019-08-14 11:19:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:49:00
 * @Version:
 * @Description:
 -->
<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false" title="pretalk申请" :visible.sync="brokerageVisible" width="1200px" :before-close="close">
      <el-card class="mb20">
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
          <el-col :span="5" class="mentee-detail-value">
            <el-input v-model="orderId" size="mini" placeholder @keyup.enter.native="getOrder"></el-input>
          </el-col>
          <el-col :span="3" class="mentee-detail-name ml20">订单金额(￥):</el-col>
          <el-col :span="3" class="mentee-detail-value">{{orderPrice}}</el-col>
          <el-col :span="3" class="mentee-detail-value">
            <el-button size="mini" @click="getOrder">确认</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mb20">
        <el-row class="mb10">

          <template >
            <el-col :span="3" class="mentee-detail-name">货币类型</el-col>
            <el-col :span="4" class="mentee-detail-value">$(美金)</el-col>
          </template>
          <template v-if="type ==='rate'">
            <el-col :span="3" class="mentee-detail-name">返佣比例(%)</el-col>
            <el-col :span="4" class="mentee-detail-value">
              <el-input-number
                :style="{width:'100px'}"
                :controls="false"
                v-model="rate"
                size="mini"
                placeholder
              ></el-input-number>
            </el-col>
          </template>

        </el-row>
        <el-row>

        </el-row>
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">返佣金额</el-col>
          <el-col :span="4" class="mentee-detail-value">
            <el-input-number
              :controls="false"
              v-model="brokerage"
              size="mini"
              :disabled="true"
              placeholder
            ></el-input-number>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="3" class="mentee-detail-name">收款账号详情</el-col>
          <el-col :span="20" class="mentee-detail-value">
            <el-input size="mini" v-model="account" maxlength="199"></el-input>
          </el-col>
        </el-row>
      </el-card>
      <el-form :inline="true" label-width="130px">
        <el-form-item label="材料">
          <p v-for="item in uploadFileList" :key="item.url">{{item.name}}</p>
          <el-upload
            :http-request="uploadFileAxios"
            :file-list="fileList"
            class="upload"
            ref="elupload"
            :action="action"
            drag
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
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

import { uploadFunBySys } from '@/libs/file'

export default {
  props: {
    brokerageVisible: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      user: [],
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: 'cny',
      referrer: '',
      account: '',
      brokerageDate: {},
      orderId: null,
      orderPrice: 0,
      rate: 0,
      brokerage: 200,
      bill_currency_type: [
        {
          itemName: '人民币',
          itemNameAll: '人民币[人民币]',
          itemNameEng: '人民币',
          itemValue: 'cny'
        }, {
          itemName: '美金',
          itemNameAll: '美金[美金]',
          itemNameEng: '美金',
          itemValue: 'usd'
        }
      ],
      exchangeRate: 0,
      uploadFileList: [],
      action: '',
      header: {
        Authorization: ''
      },
      type: 'rate',
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
      brokerageStatusList: {
        1: '订单未全部入账',
        2: '没有基础项目',
        3: '订单金额小于3500美金',
        4: '来源：校园大使、好友推荐、导师推荐,固定返佣300美金',
        5: '返佣金额或比例可选',
        6: '本订单情况不支持返佣'
      },
      brokerageStatus: 6,
      brokerageNoChange: false,
      orderDataNew: {}
    }
  },
  computed: {
    // brokerage: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    brokerageVisible: function (val) {
      if (val) {
        this.type = 'rate',
        // console.log(this.menteeName,this.wxID)
        api.getProgramListByOrderId(this.orderId).then(res => {
          console.log(res)
          this.orderData = res.data.rows
        })
        apiDic.getAuditorListByApplyType('pretalk_brokerage').then(res => {
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
        apiDic.getRate({ currencyType: 'usd' }).then(res => {
          this.exchangeRate = res.data.exchangeRate
        })
      }
    }
  },
  mounted () {
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
  },
  methods: {
    getOrder () {
      this.changeSwitch()
      console.log(this.orderId)
      this.$loading()
      api
        .getOrderDataByOrderId(this.orderId)
        .then(res => {

        })
        .catch(err => {
          this.$message('orderID不存在')
        })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.rate = null
      this.orderId = null
      this.brokerage = 200
      this.orderPrice = 0
      this.referrer = ''
      this.account = ''
      this.fileList = []
      this.auditor = []
      this.copy = []
      this.exchangeRate = 0
      this.uploadFileList = []
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
      if (!this.brokerage) {
        this.$message('返佣金额不能为空')
        return
      }
      if (!this.orderPrice) {
        this.$message('订单不能为空')
        return
      }
      if (!this.account.length) {
        this.$message('收款账号详情不能为空')
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
      let num = 1
      if (this.currencyType === 'cny') {
        num = 1
      } else {
        num = this.exchangeRate
      }

      let keyType = ''
      let keyId = ''
      if (this.orderDataNew.brokeragePayment) {
        if (this.orderDataNew.brokeragePayment.cooperatorId) {
          keyType = 'cooperator'
          keyId = this.orderDataNew.brokeragePayment.cooperatorId
        } else if (this.orderDataNew.brokeragePayment.ambassadorId) {
          keyType = 'ambassador'
          keyId = this.orderDataNew.brokeragePayment.ambassadorId
        } else if (this.orderDataNew.brokeragePayment.mentorId) {
          keyType = 'kol-mentor'
          keyId = this.orderDataNew.brokeragePayment.mentorId
        } else if (this.orderDataNew.brokeragePayment.menteeId) {
          keyType = 'kol-mentee'
          keyId = this.orderDataNew.brokeragePayment.menteeId
        } else if (this.orderDataNew.brokeragePayment.kolId) {
          keyType = 'kol-other'
          keyId = this.orderDataNew.brokeragePayment.kolId
        }
      }

      const data = {
        applyType: 'brokerage',
        applyTitle: `订单[${this.orderId}]的返佣申请`,
        copyTo: copyTo,
        approval: approval,
        voucher: this.uploadFileList.map(v => {
          return { voucherName: v.name, voucherPath: v.url }
        }),
        content: {
          file: this.uploadFileList,
          text: [
            {
              label: '订单ID',
              value: this.orderId
            },
            {
              label: '订单金额',
              value: this.orderPrice
            },
            {
              label: '申请时汇率',
              value: this.exchangeRate
            },
            {
              label: '推荐人',
              value: this.referrer
            },
            {
              label: '申请金额',
              value: this.currencyType + this.brokerage
            },
            {
              label: '收款账户',
              value: this.account
            }
          ],
          info: {
            orderId: this.orderId,
            fundType: this.currencyType,
            exchangeRate: this.exchangeRate,
            keyType: keyType,
            keyId: keyId,
            payAccount: this.account,
            payUser: this.referrer,
            fundWage: this.brokerage
          }
        }
      }
      if (this.type === 'rate') {
        data.content.text.push({
          label: '返佣比例(%)',
          value: this.rate
        })
        data.content.info.brokerageRate = this.rate
      }
      console.log('setbrokerage', data)
      api.setRefund(data).then(res => {
        console.log('setbrokerage，', res)
        this.$emit('submit')
        this.clear()
      })
    },
    // 凭证上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, 'voucher/brokerage_apply', url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        })
        this.$loading().close()
        this.$refs.elupload.clearFiles()
        console.log(this.uploadFileList)
      })
    },
    changeSwitch () {
      this.rate = 0
      this.brokerage = 0
      this.currencyType = 'cny'
    },
    changeType () {
      if (this.rate) {
        if (this.currencyType != 'cny') {
          this.brokerage = (this.brokerage / this.exchangeRate).toFixed(2)
          console.log(this.rate, this.exchangeRate, this.brokerage)
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
