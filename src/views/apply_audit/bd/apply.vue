<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false" title="BD经费申请" :visible.sync="bdApplyVisible" width="1200px" :before-close="close">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="种类">
          <el-select
            :style="{width:'200px'}"
            v-model="expenditureReason"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bd_expenditure_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '$$' + item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额类型">
          <el-select :style="{width:'200px'}" v-model="currencyType" size="mini" placeholder="请选择">
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            v-model="expenditureAmount"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input :style="{width:'920px'}" size="mini" v-model="payUser" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="收款账号详情">
          <el-input
            :style="{width:'920px'}"
            size="mini"
            v-model="account"
            type="textarea"
            maxlength="199"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :style="{width:'920px'}" size="mini" v-model="note" type="textarea"></el-input>
        </el-form-item>
        <!-- <el-form :inline="true" label-width="150px"> -->
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
            :style="{width:'500px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
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
          <el-select :style="{width:'200px'}" v-model="copy" multiple filterable placeholder="请选择">
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
import axios from '@/api/dictionary.js'
import apiU from '@/api/user'
import mixins from '@/plugin/mixins'

import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    bdApplyVisible: {
      type: Boolean,
      default: false
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
      currencyType: 'cny',
      note: '',
      account: '',
      payUser: '',
      expenditureAmount: 0,
      expenditureReason: null,
      bd_expenditure_type: [],
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
    }
  },
  computed: {

  },
  watch: {
    bdApplyVisible: function (val) {
      if (val) {
        // console.log(this.menteeName,this.wxID)
        api.getProgramListByOrderId(this.orderId).then(res => {
          console.log(res)
          this.orderData = res.data.rows
        })
        this.pageInit()
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
        axios.getAuditorListByApplyType('bd_expenditure').then(res => {
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
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.bd_expenditure_type = await this.getDictionary('bd_expenditure_type')
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
      this.expenditureAmount = null
      this.expenditureReason = null
      this.payUser = null
      this.account = null
      this.note = null
      this.fileList = []
      this.auditor = []
      this.copyTo = []
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
      if (!this.expenditureAmount) {
        this.$message('金额不能为空')
        return
      }
      if (!this.expenditureReason) {
        this.$message('类型不能为空')
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
      // if (!this.auditor.length) {
      //   this.$message("审核人不能为空");
      //   return;
      // }
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
        applyType: 'bd_expenditure',
        applyTitle: `BD[${this.expenditureReason.split('$$')[1]}]的经费申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: '备注',
              value: this.note
            }
            // {
            //   label: "订单金额",
            //   value: this.orderPrice
            // },
            // {
            //   label: "返佣比例(%)",
            //   value: this.rate
            // },
            // {
            //   label: "推荐人",
            //   value: this.referrer
            // }
          ],
          info: {
            note: this.note,
            expenditureType: this.currencyType,
            payAccount: this.account,
            payUser: this.payUser,
            expenditureAmount: this.expenditureAmount,
            expenditureReason: this.expenditureReason.split('$$')[0]
            // expenditureTimes: this.expenditureTimes,
          }
        }
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/db', url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('setbrokerage参数', data)
              api.setRefund(data).then(res => {
                console.log('setbrokerage，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        api.setRefund(data).then(res => {
          console.log('setbrokerage，', res)
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
