<template>
  <div class="mentor_payment_extra">
    <el-dialog :close-on-click-modal="false"
      title="导师薪资申请"
      :visible.sync="mentorPaymentExtraApplyVisible"
      width="1200px"
      :before-close="close"
    >
      <div class="mb20" :style="{'margin-left':'150px'}">
        <el-input
          :style="{width:'150px'}"
          v-model="mentorNameSearch"
          size="mini"
          clearable
          placeholder="注意名字中间空格"
          @keyup.enter.native="searchMentorByMentorName"
        ></el-input>
        <el-button type="primary" @click="searchMentorByMentorName" size="mini">查询导师</el-button>
      </div>
      <el-form :inline="true" label-width="150px">
        <el-form-item label="导师名">
          <el-input size="mini" :style="{width:'200px'}" v-model="mentorName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="导师收款账户">
          <el-select
            :style="{width:'200px'}"
            v-model="expenditureReason"
            size="mini"
            placeholder="请选择"
            @change="choosePayWay"
          >
            <el-option
              v-for="item in payWayList"
              :key="item.accountId"
              :label="item.paymentTypeName + ':' + item.payAcc"
              :value="item.accountId + '&&' + item.paymentType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额类型">
          <el-select :style="{width:'200px'}" v-model="fundType" size="mini" placeholder="请选择">
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
            v-model="fundWage"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="系统汇率">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            :disabled="true"
            v-model="exchangeRate"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input :style="{width:'920px'}" size="mini" v-model="note" type="textarea"></el-input>
        </el-form-item>
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

    <el-dialog :close-on-click-modal="false"
      title="行业导师"
      :visible.sync="mentorListVisible"
      width="700px"
      :before-close="mentorListClose"
    >
      <el-row v-for="(mentor,i) in mentorSearchList" :key="mentor.mentorId">
        <el-col :span="2">
          <el-button size="mini" @click="chooseMentor(i)" type="primary">选择</el-button>
        </el-col>
        <el-col :span="4" class="_item-name">姓名</el-col>
        <el-col :span="6" class="_item-value">{{mentor.mentorName}}</el-col>
        <el-col :span="4" class="_item-name">微信ID</el-col>
        <el-col :span="6" class="_item-value">{{mentor.wxId}}</el-col>
      </el-row>
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
    mentorPaymentExtraApplyVisible: {
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
      fileList: [],
      expenditureReason: '',
      payType: '',
      fundType: '',
      note: '',
      exchangeRate: 0,
      fundWage: 0,
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

      mentorNameSearch: '',
      mentorName: '',
      mentorId: '',
      mentorListVisible: false,
      mentorSearchList: [],
      payWayList: []
    }
  },
  computed: {
    // mentor_payment_extra: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    mentorPaymentExtraApplyVisible: function (val) {
      if (val) {
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
        axios.getAuditorListByApplyType('mentor_payment_extra').then(res => {
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
        axios.getRate({ currencyType: 'usd' }).then(res => {
          this.exchangeRate = res.data.exchangeRate
        })
      }
    }
  },
  mounted () {},
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.mentorName = null
      this.payType = null
      this.fundWage = null
      this.expenditureReason = null
      this.exchangeRate = 0
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
      console.log('submit', this.fileList, this.auditor, this.copy)
      // 验证
      if (!this.payType) {
        this.$message('账户不能为空')
        return
      }
      if (!this.fundWage) {
        this.$message('金额不能为空')
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
        applyType: 'mentor_payment_extra',
        applyTitle: `导师[${this.mentorName}]的薪资申请`,
        keyId: this.mentorId,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: '导师名',
              value: this.mentorName
            },
            {
              label: '收款账户',
              value: ''
              // this.payType
            },
            {
              label: '申请金额',
              value: this.fundType + ':' + this.fundWage
            },
            // {
            //   label: "汇率",
            //   value: "exchangeRateReplace"
            // },
            {
              label: '备注',
              value: this.note
            }
          ],
          info: {
            note: this.note,
            fundType: this.fundType,
            fundWage: this.fundWage,
            payType: this.payType,
            // exchangeRate: "exchangeRateReplace",
            mentorId: this.mentorId
          }
        }
      }
      // if (this.fundType == "sud") {
      //   data.content.text.push({
      //     label: "对应人民币金额",
      //     value: "cnyReplace"
      //   });
      // }
      const payWay = this.payWayList.filter(v => v.accountId == this.payType)[0]
      let account = ''
      for (const item in payWay) {
        console.log(item, payWay[item])
        switch (item) {
          case 'paymentType': {
            if (payWay[item]) {
              account += '付款类型：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'payAcc': {
            if (payWay[item]) {
              account += ' 账户：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'bankName': {
            if (payWay[item]) {
              account += ' 银行：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'realName': {
            if (payWay[item]) {
              account += ' 收款人姓名：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'idCard': {
            if (payWay[item]) {
              account += ' 收款人身份证号：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'bankAddress': {
            if (payWay[item]) {
              account += ' Bank Address：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'zip': {
            if (payWay[item]) {
              account += ' ZIP：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'routingNumber': {
            if (payWay[item]) {
              account += ' Routing Number：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'swiftCode': {
            if (payWay[item]) {
              account += ' Swift Code：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'cc': {
            if (payWay[item]) {
              account += ' C C：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'bsb': {
            if (payWay[item]) {
              account += ' Bsb：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'iban': {
            if (payWay[item]) {
              account += ' Iban：' + payWay[item] + '  ;  '
            }
            break
          }
        }
      }
      data.content.text[1].value = account

      this.$loading()
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/mentor_payment_extra', url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('setmentor_payment_extra参数', data)
              api.setRefund(data).then(res => {
                console.log('setmentor_payment_extra，', res)
                this.$loading().close()
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        api.setRefund(data).then(res => {
          console.log('setmentor_payment_extra，', res)
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
      }
    },

    searchMentorByMentorName () {
      if (!this.mentorNameSearch) {
        this.$message({
          type: 'warning',
          message: '别闹~~~'
        })
        return
      }
      api.searchMentorByMentorName({ mentorName: this.mentorNameSearch }).then(res => {
        console.log(res.data)
        if (!res.data.length) {
          this.$message({
            type: 'warning',
            message: '无该姓名的导师'
          })
          return
        }
        this.mentorSearchList = res.data
        this.mentorListVisible = true
      })
      this.mentorNameSearch = ''
    },
    chooseMentor (i) {
      this.mentorId = this.mentorSearchList[i].mentorId
      this.mentorName = this.mentorSearchList[i].mentorName
      this.addMentorF()
      this.mentorListClose()
    },
    mentorListClose () {
      this.mentorListVisible = false
      this.mentorSearchList = []
    },
    addMentorF () {
      console.log(this.mentorId)
      api.getCooperatorPaymentListByCooperatorIdNew(this.mentorId, true).then(res => {
        console.log(res.data)
        this.payWayList = res.data
        // 自动填充
        this.expenditureReason =
          res.data[0].accountId + '&&' + res.data[0].paymentType
        this.payType = res.data[0].accountId
        if (
          ['alipay', 'bank', 'wechatpay'].includes(res.data[0].paymentType)
        ) {
          this.fundType = 'cny'
        } else {
          this.fundType = 'usd'
        }
      })
    },
    choosePayWay (v) {
      console.log(v)
      this.payType = v.split('&&')[0]
      const type = v.split('&&')[1]
      if (['alipay', 'bank', 'wechatpay'].includes(type)) {
        this.fundType = 'cny'
      } else {
        this.fundType = 'usd'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
