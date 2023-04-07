<template>
  <div class="purchase">
    <el-dialog :close-on-click-modal="false" title="采购申请" :visible.sync="purchaseApplyVisible" width="1200px" :before-close="close">
      <!-- <el-card class="mb20"> -->
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">采购类型</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-select
            :style="{width:'200px'}"
            v-model="expenditureReason"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in purchase_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '$$' + item.itemName"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">采购事由</el-col>
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
            :style="{width:'200px'}"
          >
            <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
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
import axios from '@/api/dictionary'
import apiU from '@/api/user'
import mixins from '@/plugin/mixins'
import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    purchaseApplyVisible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      user0: [{ id: 'cfac4a6d-a29c-48a4-aa4e-5cc511642f00', name: 'Bruce张臻' }, { id: 'Annie', name: 'Annie Lin' }],
      user: [],
      auditor: '',
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: 'cny',
      note: '',
      account: '',
      payUser: '',
      expenditureAmount: 0,
      expenditureReason: null,
      purchase_type: [],
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
    // purchase: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    purchaseApplyVisible: function (val) {
      if (val) {
        console.log(val)
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
        axios.getAuditorListByApplyType('purchase').then(res => {
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
      this.purchase_type = await this.getDictionary('purchase_type')
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
      this.auditor = ''
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
      if (!this.expenditureReason) {
        this.$message('类型不能为空')
        return
      }
      if (!this.account.length) {
        this.$message('事由不能为空')
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
        applyType: 'purchase',
        applyTitle: `[${this.expenditureReason.split('$$')[1]}]的采购申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: '采购事由',
              value: this.account
            },
            {
              label: '备注',
              value: this.note
            }
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
            purchaseReason: this.account,
            purchaseType: this.expenditureReason.split('$$')[0]
          }
        }
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/purchase', url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('setpurchase参数', data)
              api.setRefund(data).then(res => {
                console.log('setpurchase，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        api.setRefund(data).then(res => {
          console.log('setpurchase，', res)
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
