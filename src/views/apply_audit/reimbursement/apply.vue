<template>
  <div class="reimbursement">
    <el-dialog :close-on-click-modal="false"
      title="报销申请"
      :visible.sync="reimbursementApplyVisible"
      width="1200px"
      :before-close="close"
    >
      <!-- <el-card class="mb20"> -->
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">报销人</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-select
            v-model="reimbursementBy"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in user"
              :key="item.id"
              :label="item.name"
              :value="item.id +'$$'+item.name"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="mentee-detail-name">报销类型</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-select
            v-model="expenditureReason"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in reimbursement_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '$$' + item.itemName"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="3" class="mentee-detail-name">金额类型</el-col>
        <el-col :span="3" class="mentee-detail-value">
          <el-select :style="{width:'100px'}" v-model="currencyType" size="mini" placeholder="请选择">
             <el-option
                v-for="item in bill_currency_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
          </el-select>
        </el-col>-->
        <el-col :span="3" class="mentee-detail-name">金额</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-input-number :controls="false" v-model="expenditureAmount" placeholder></el-input-number>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">报销事由</el-col>
        <el-col :span="20" class="mentee-detail-value">
          <el-input size="mini" v-model="account" type="textarea" maxlength="199"></el-input>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">备注</el-col>
        <el-col :span="20" class="mentee-detail-value">
          <el-input size="mini" v-model="note" type="textarea" max="199"></el-input>
        </el-col>
      </el-row>
      <!-- </el-card> -->
      <el-form :inline="true" label-width="145px">
        <el-form-item label="材料、凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            drag
          >
            <i class="el-icon-upload"></i>
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
        <el-form-item label="是否为BD活动报销">
           <el-select :style="{width:'180px'}" v-model="checked" placeholder="请选择">
            <el-option v-for="item in checkedList" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="BD合作商"   v-if="checked == '1'">
           <el-select :style="{width:'180px'}" filterable v-model="Cooperator" @change="changeCooperator" placeholder="请选择">
            <el-option v-for="item in CooperatorList" :key="item.cooperatorId" :label="item.cooperatorName" :value="item.cooperatorId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="BD合作商活动"  v-if="Cooperator">
           <el-select :style="{width:'180px'}" filterable v-model="activityId" placeholder="请选择">
            <el-option v-for="item in activeList" :key="item.activityId" :label="item.activityName" :value="item.activityId"></el-option>
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
import axios from '@/api/dictionary'
import apiU from '@/api/user'
import apiBd from '@/api/bd'
import mixins from '@/plugin/mixins'

import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    reimbursementApplyVisible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      user0: [
        { id: 'cfac4a6d-a29c-48a4-aa4e-5cc511642f00', name: 'Bruce张臻' },
        { id: 'Annie', name: 'Annie Lin' }
      ],
      user: [],
      auditor: '',
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: 'cny',
      note: '',
      account: '',
      reimbursementBy: '',
      payUser: '',
      checked: '0',
      checkedList: [
        { itemName: '否', itemValue: '0' },
        { itemName: '是', itemValue: '1' }
      ],
      Cooperator: '',
      CooperatorList: [],
      activityId: '',
      activeList: [],
      expenditureAmount: 0,
      expenditureReason: null,
      reimbursement_type: [],
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
      ]

      // expenditureTimes: 0
    }
  },
  computed: {
    // reimbursement: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    reimbursementApplyVisible: function (val) {
      if (val) {
        console.log(val)
        api.getProgramListByOrderId(this.orderId).then(res => {
          console.log(res)
          this.orderData = res.data.rows
        })
        this.pageInit()
        apiU.userList({
            pageNum: 1,
            pageSize: 1000
            // entryStatus: "1"
          }).then(({ data }) => {
            console.log(
              'userList...........................................',
              data
            )
            this.user = data.rows
            this.user.forEach(v => {
              if (v.entryStatus == 2) {
                v.name += ' (离职)'
              }
            })
          })
        const data = {
          pageNum: 1,
          pageSize: 9999,
          manageBy: 'ALL_Data'
        }
        apiBd.getCooperatorV2List(data).then(res => {
          this.CooperatorList = res.data.rows
          console.log(res, 111111111111111111)
        })
        axios.getAuditorListByApplyType('reimbursement').then(res => {
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
      }
    }
  },
  mounted () {

  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.reimbursement_type = await this.getDictionary('reimbursement_type')
    },
    getOrder () {
      console.log(this.orderId)
      api
        .getOrderDataByOrderId(this.orderId)
        .then(res => {
          this.orderPrice = res.data.orderInfo.orderPrice
          console.log(res, this.orderPrice)
        })
        .catch(err => {
          err
          this.$message('orderID不存在')
        })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.activeList = []
      this.checked = '0'
      this.Cooperator = ''
      this.activityId = ''
      this.expenditureAmount = null
      this.expenditureReason = null
      this.payUser = null
      this.account = null
      this.note = null
      this.fileList = []
      this.auditor = ''
      this.copyTo = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    changeCooperator () {
      const data = {
        pageNum: 1,
        pageSize: 9999,
        cooperatorId: this.Cooperator,
        manageBy: 'ALL_Data'
      }
      apiBd.getCooperatorActivityList(data).then(res => {
        console.log(res, 22222222222222)
        this.activeList = res.data.rows
        this.activityId = ''
      })
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
      if (this.checked == '1') {
        if (!this.Cooperator) {
          this.$message('合作商不可为空')
          return
        }
        if (!this.activityId) {
          this.$message('活动不可为空')
          return
        }
      }
      if (!this.reimbursementBy) {
        this.$message('报销人不可为空')
        return
      }
      if (!this.expenditureReason) {
        this.$message('类型不能为空')
        return
      }
      if (!this.expenditureAmount) {
        this.$message('金额不能为空')
        return
      }
      if (!this.account.length) {
        this.$message('报销事由不能为空')
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
        applyType: 'reimbursement',
        keyId: '',
        applyTitle: `[${this.reimbursementBy.split('$$')[1]}]的[${
          this.expenditureReason.split('$$')[1]
        }]报销申请`,
        copyTo: copyTo,
        approval: approval,
        voucher: [],
        content: {
          file: [],
          text: [
            {
              label: '报销人',
              value: this.reimbursementBy.split('$$')[1]
            },
            {
              label: '报销类型',
              value: this.expenditureReason.split('$$')[1]
            },
            {
              label: '报销金额',
              value: this.expenditureAmount
            },
            {
              label: '报销事由',
              value: this.account
            },
            {
              label: '备注',
              value: this.note || ''
            }
          ],
          info: {
            note: this.note,
            // expenditureType: this.currencyType,
            reimbursementReason: this.account,
            // this.currencyType +
            reimbursementTotalWage: this.expenditureAmount,
            reimbursementBy: this.reimbursementBy.split('$$')[0],
            reimbursementType: this.expenditureReason.split('$$')[0],
            infoArray: []
            // expenditureTimes: this.expenditureTimes,
          }
        }
      }
      if (this.checked == '1') {
        data.content.info.bdExpenditureInfo = {
          activityId: this.activityId,
          fundWage: this.expenditureAmount
        }
        data.keyId = this.activityId
        for (let i = 0; i < this.CooperatorList.length; i++) {
          if (this.CooperatorList[i].cooperatorId == this.Cooperator) {
            data.content.text.push({
              label: 'BD合作商',
              value: this.CooperatorList[i].cooperatorName
            })
          }
        }

        for (let i = 0; i < this.activeList.length; i++) {
          if (this.activeList[i].activityId == this.activityId) {
            data.content.text.push({
              label: 'BD活动名',
              value: this.activeList[i].activityName
            })
          }
        }
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          if (file.name.length > 100) {
            this.$message({
              type: 'error',
              message: '凭证文件名不可超过100个字符'
            })
            this.$loading().close()
            return
          }
          uploadFunBySys(file.raw, 'voucher/reimbursement', url => {
            console.log(url)
            data.content.file.unshift({
              name: file.name,
              url: url
            })
            data.voucher.unshift({
              voucherName: file.name,
              voucherPath: url
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('setreimbursement参数', data)
              api.setRefund(data).then(res => {
                console.log('setreimbursement，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        api.setRefund(data).then(res => {
          console.log('setreimbursement，', res)
          this.$emit('submit')
          this.clear()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
