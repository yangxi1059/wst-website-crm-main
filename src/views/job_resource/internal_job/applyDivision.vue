<template>
  <div class="brokerage lesson_pay_apply_container">
    <el-dialog :close-on-click-modal="false" title="内推Offer费用申请" :visible.sync="applyDivisionVisible" width="800px" :before-close="close">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="金额类型">
          <el-select :style="{width:'200px'}" v-model="feeType" size="mini" placeholder="请选择">
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
            v-model="fee"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>
        <el-form-item label="账户ID">
          <ul :style="{width:'360px'}" v-if="payData.paymentArr[0] !== null">
              <!-- 支付宝 -->
              <li v-for="(item,i) in payData.paymentArr" :key="i" >
                <!-- 后台的返回会存在[null]这种结构 故此处多+一处判断 -->
                <div class="pay_card_box mb10" v-if="item"
                  :class="[{active:categoryIndex==i}]" @click="payClick(item,i)"
                >
                  <div class="pay_card_default" v-if="item.priority == 1">默认账户</div>
                  <div class="pay_card_img" >
                    <img :src="`${require('@/assets/img/pay/'+item.paymentType+'.png')}`"/>
                  </div>
                  <div class="pay_card_content">
                    <p>{{item.paymentTypeName}}</p>
                    <p>账户/邮箱：{{item.payAcc}}</p>
                    <p class="pay_card_name">收款人：{{item.realName}}</p>
                  </div>
                </div>
              </li>
              <div v-if="payData.paymentArr.length < 1">
                <el-tag type="danger" size="small">未绑定收款账户,请先绑定账户后再来发起申请！！</el-tag>
              </div>
            </ul>
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
        <el-button type="primary" v-if="status" @click="submit">确 定</el-button>
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
    applyDivisionVisible: {
      type: Boolean,
      default: false
    },
    menteeDetail: {
    },
    divisionDetail: {},
    referId:{},
    providerId: {}
  },
  mixins: [mixins],
  data: () => {
    return {
      user: [],
      auditor: [],
      copy: [],
      fileList: [],
      feeType: 'cny',
      resultId: '',
      fee: 0,
      account: {},
      payData: { paymentArr: [] },
      categoryIndex: -1,
      accountId: '',
      bill_currency_type: [],
      providerName: '',
      status: false,
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
    applyDivisionVisible: function (val) {
      if (val) {
        console.log(this.menteeDetail, this.providerId)
        this.resultId = this.menteeDetail.resultId
        this.pageInit()
        this.providerDetail()
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
        axios.getAuditorListByApplyType('job_offer_fee').then(res => {
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
    },
    providerDetail () {
      console.log(this.divisionDetail,33333333333333)
      api.getInternalJobDetail(this.providerId).then(res => {
        console.log(res.data)
        this.fee = res.data.offerFee
        this.feeType = res.data.offerFeeType
        this.providerName = res.data.providerName
      })
      api.getCooperatorPaymentListByCooperatorIdNew(this.referId || this.providerId).then(res => {
        console.log('getPaymentApply1111111111111111111', res.data)
        this.payData.paymentArr = res.data
        if (this.payData.paymentArr[0] == null) {
          this.$message({
            type: 'error',
            message: '未绑定收款账户,请先绑定账户后再来发起申请'
          })
          this.status = false
        } else {
          this.account = this.payData.paymentArr[0]
          console.log(this.account)
          this.status = true
        }
      })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    payClick (item, i) {
      this.categoryIndex = i
      this.account = item
      console.log(this.account)
    },
    clear () {
      this.account = {}
      this.categoryIndex = -1
      this.status = false
      this.payData = { paymentArr: [] }
      this.feeType = null
      this.fee = null
      this.providerName = ''
      this.accountId = null
      this.resultId = null
      this.fileList = []
      this.auditor = []
      this.copyTo = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      // 验证
      if (!this.fee) {
        this.$message('金额不能为空')
        return
      }
      if (!this.feeType) {
        this.$message('类型不能为空')
        return
      }
      if (!this.account.accountId) {
        this.$message('账户ID不能为空')
        return
      }
      // if (!this.fileList.length) {
      //   this.$message('凭证材料不能为空')
      //   return
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
      const payWay = this.payData.paymentArr.filter(
        v => v.accountId == this.account.accountId
      )[0]
      let account = ''
      let payAccType = ''
      console.log(payWay,22222222222222222222)
      for (const item in payWay) {
        switch (item) {
          case 'paymentType': {
            if (payWay[item]) {
              account += '付款类型：' + payWay[item] + '  ;  '
              payAccType = payWay[item]
            }
            break
          }
          case 'payAcc': {
            if (payWay[item]) {
              account += '账户：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'bankName': {
            if (payWay[item]) {
              account += '银行：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'realName': {
            if (payWay[item]) {
              account += '收款人姓名：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'idCard': {
            if (payWay[item]) {
              account += '收款人身份证号：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'bankAddress': {
            if (payWay[item]) {
              account += 'Bank Address：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'zip': {
            if (payWay[item]) {
              account += 'ZIP：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'routingNumber': {
            if (payWay[item]) {
              account += 'Routing Number：' + payWay[item] + '  ;  '
            }
            break
          }
          case 'swiftCode': {
            if (payWay[item]) {
              account += 'Swift Code：' + payWay[item] + '  ;  '
            }
            break
          }
        }
      }
      console.log(account)
      const data = {
        keyId: this.divisionDetail.pkId,
        applyType: 'job_offer_fee',
        applyTitle: `${this.menteeDetail.menteeName}的内推Offer费用申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            { label: '学员姓名', value: this.menteeDetail.menteeName },
            { label: '公司', value: this.menteeDetail.companyName },
            { label: '岗位', value: this.menteeDetail.jobName },
            { label: '内推人', value: this.providerName },
            { label: '账户信息', value: account },
            { label: '费用', value: `${this.feeType} ${this.fee}` }

          ],
          info: {
            payAcc: account,
            payAccType: payAccType,
            resultId: this.divisionDetail.pkId,
            feeType: this.feeType,
            providerId: this.providerId,
            fee: this.fee,
            accountId: this.account.accountId,
            internalJobId: this.menteeDetail.jobId
          }
        }
      }
      console.log('setbrokerage参数', data)
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/interview', url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            if (data.content.file.length === this.fileList.length) {
              api.setRefund(data).then(res => {
                console.log('setbrokerage，', res)
                this.$emit('submit')
                this.$message.success('申请成功 ！！')
                this.clear()
              })
            }
          })
        }
      } else {
        api.setRefund(data).then(res => {
          console.log('setbrokerage，', res)
          this.$emit('submit')
          this.$message.success('申请成功 ！！')
          this.clear()
        })
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
    *{
      box-sizing: border-box;
    }
    .lesson_pay_apply_container{
      display: flex;
      height: calc(100%);
      .pay_card_box{
        position: relative;
        padding:10px 20px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        cursor: pointer;
        .pay_card_default{
          position: absolute;
          top:0;
          right:0;
          padding:0 10px;
          color:tomato;
          background: rgb(252, 207, 207);
          border-top-right-radius: 4px;
        }
        .pay_card_img{
          width:50px;
          height:50px;
          margin-right:20px;
          display: flex;
          align-items: center;
          img{
            width:100%;
            background-size:contain ;
          }
        }
        .pay_card_content{
          flex: 1;
          .pay_card_name{
            color:#999
          }
          p{
            line-height:1;
          }
        }
      }
      .pay_card_box.active{
        border:1px solid #ffa333;
        background:rgba($color: #ffa333, $alpha: 0.1)
      }
      .mentor_area{
        position: relative;
        width: 500px;
        height:100%;
        padding:10px;
        background: #FFF;
        border-radius: 10px;
        overflow: auto;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .mentor_area_btn{
          width:80%;
          line-height:1.8;
          margin-left:10%;
          bottom:10px;
        }
      }

      .lesson_area{
        flex: 1;
        height:100%;
        overflow: auto;
        background: #FFF;
        border-radius: 10px;
      }
    }

    .course_area{
      flex: 1;
      height:100%;
      margin-left:20px;
      padding:10px;
      background: #FFF;
      border-radius: 10px;
    }
    </style>
