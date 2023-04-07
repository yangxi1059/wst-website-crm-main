<!--
 * @Author: 库建华
 * @Date: 2019-08-14 11:19:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-21 11:31:30
 * @Version:
 * @Description:
 -->
<template>
  <div class="brokerage">
    <el-dialog
      :close-on-click-modal="false"
      title="返佣申请"
      :visible.sync="brokerageVisible" width="1000px"
      :before-close="close"
      :append-to-body = "true"
      v-loading = "loading"
    >
      <el-card v-if="pretalk && pretalk.pretalkId" class="mb20">
        <div slot="header" class="clearfix">
          <span>pretalk申请</span>
        </div>
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
          <el-col :span="5" class="mentee-detail-value">{{orderId}}</el-col>
          <el-col :span="3" class="mentee-detail-name ml20">订单金额(￥):</el-col>
          <el-col :span="5" class="mentee-detail-value">{{orderPrice}}</el-col>
        </el-row>
        <template >
          <el-card class="mb20">
            <el-row class="mb10">

              <template v-if="type ==='number'">
                <el-col :span="3" class="mentee-detail-name">货币类型</el-col>
                <el-col :span="4" class="mentee-detail-value">$(美金)</el-col>
              </template>
              <el-col :span="5" class="mentee-detail-name">pretalk申请金额</el-col>
              <el-col :span="18" class="mentee-detail-value">
                <el-input-number
                  :controls="false"
                  v-model="brokeragePretalk"
                  size="mini"
                  :disabled="true"
                  placeholder
                ></el-input-number>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5" class="mentee-detail-name">收款账号详情</el-col>
              <el-col :span="18" class="mentee-detail-value">
                <el-input size="mini" v-model="accountPretalk" maxlength="199"></el-input>
              </el-col>
            </el-row>
          </el-card>
          <el-form :inline="true" label-width="130px">
            <el-form-item label="材料">
              <p v-for="item in uploadFileList1" :key="item.url">{{item.name}}</p>
              <el-upload
                :http-request="uploadFileAxios1"
                :file-list="fileList1"
                class="upload"
                ref="elupload1"
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
            <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList1" :key="index">
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
        </template>
      </el-card>
      <el-card v-else class="mb20">
        <!-- 旧bd返佣逻辑
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">返佣基准</el-col>
          <el-col :span="4" class="mentee-detail-value">
            <el-switch
              v-model="type"
              active-color="#13ce66"
              @change="changeSwitch()"
              inactive-color="#409eff"
              active-value="rate"
              inactive-value="number"
              active-text="比例"
              inactive-text="金额"
              :disabled="brokerageNoChange"
            ></el-switch>
          </el-col>
          <template >
            <el-col :span="3" class="mentee-detail-name">货币类型</el-col>
            <el-col :span="4" class="mentee-detail-value">
              <el-select
                :style="{width:'100px'}"
                v-model="currencyType"
                size="mini"
                placeholder="请选择"
                @change="changeType"
                :disabled="brokerageNoChange"
              >
                <el-option
                  v-for="item in bill_currency_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-col>
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
              :disabled="type ==='rate' || brokerageNoChange"
              placeholder
            ></el-input-number>
          </el-col>
          <el-col :span="3" class="mentee-detail-name">系统汇率</el-col>
          <el-col :span="4" class="mentee-detail-value">
            <el-input-number
              :style="{width:'100px'}"
              :controls="false"
              :disabled="true"
              v-model="exchangeRate"
              size="mini"
              placeholder
            ></el-input-number>
          </el-col>
          <el-col :span="3" class="mentee-detail-name">推荐人</el-col>
          <el-col :span="6" class="mentee-detail-value">
            <el-input size="mini" v-model="referrer"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="mentee-detail-name">收款账号详情</el-col>
          <el-col :span="20" class="mentee-detail-value">
            <el-input size="mini" v-model="account" maxlength="199"></el-input>
          </el-col>
        </el-row>
        旧bd返佣逻辑 -->

        <el-descriptions title="" :column="2">
          <el-descriptions-item label="订单id">
            {{orderId || '无'}}</el-descriptions-item>
          <el-descriptions-item label="学员姓名">
            {{bdOrderData.menteeName || '无'}}</el-descriptions-item>
          <el-descriptions-item label="首次咨询日期">
            {{bdOrderData.firstAskDate || '无'}}</el-descriptions-item>
          <el-descriptions-item label="签约日期">
            {{bdOrderData.signDate || '无'}}</el-descriptions-item>
          <el-descriptions-item label="订单金额">
            {{bdOrderData.orderPrice || '无'}}</el-descriptions-item>
          <el-descriptions-item label="返佣渠道">
            {{bdOrderData.sourceName || '无'}}</el-descriptions-item>
          <el-descriptions-item label="返佣规则">
            {{bdOrderData.brokerageModel || '无'}}</el-descriptions-item>
          <el-descriptions-item label="返佣金额（美金）">
            <div v-if="bdOrderAmountDisabled">{{bdOrderData.brokerageAmount}}</div>
            <el-input-number v-else v-model="bdOrderData.brokerageAmount" />
          </el-descriptions-item>
          <el-descriptions-item label="返佣账户" :span="2">
            <el-input v-model="account" style="width:300px"/>
          </el-descriptions-item>
          <el-descriptions-item label="材料" :span="2">
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
          </el-descriptions-item>
          <el-descriptions-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
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
          </el-descriptions-item>
          <el-descriptions-item label="抄送人">
            <el-select :style="{width:'200px'}" v-model="copy" multiple filterable placeholder="请选择">
              <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
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
    },
    orderId: {},
    pretalk: { type: Object }
  },
  data: () => {
    return {
      loading: false,
      user: [],
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      brokeragePretalk: 200,
      pretalkDetail: {},
      fileList: [],
      fileList1: [],
      currencyType: 'cny',
      referrer: '',
      account: '',
      accountPretalk: '',
      brokerageDate: {},
      orderPrice: 0,
      rate: 0,
      brokerage: 0,
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
      uploadFileList1: [],
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
      auditorList1: [
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
      orderDataNew: {},
      bdOrderData: {},
      bdOrderAmountDisabled: false
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
        apiDic.getAuditorListByApplyType('brokerage').then(res => {
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
        apiDic.getRate({ currencyType: 'usd' }).then(res => {
          this.exchangeRate = res.data.exchangeRate
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
          this.auditorList1 = [...res.data]
        })
        this.getOrder()
      }
    },
    rate: function (val) {
      if (val) {
        if (!this.orderPrice) {
          this.$message('请确认订单')
          return
        }
        if (this.currencyType != 'cny') {
          this.brokerage = (val * this.orderPrice) / 100
          this.brokerage = (this.brokerage / this.exchangeRate).toFixed(2)
          console.log(this.rate, this.exchangeRate, this.brokerage)
        } else {
          this.brokerage = (val * this.orderPrice) / 100
        }
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
      this.loading = true
      if (this.pretalk && this.pretalk.pretalkId) {
        this.orderPrice = this.pretalk.orderPrice
        api.getPretalkDefault(this.pretalk.pretalkId).then(res => {
          console.log(res.data, 12223)
          this.loading = false
          this.pretalkDetail = res.data
          const payWay = res.data
          this.accountPretalk = this.payFn(payWay)
        })
      } else {
        api.getBrokerage(this.orderId).then(res => {
          console.log('getBrokerage', res)
          this.loading = false
          if (res.code != '200') {
            this.$message.warning(res.message)
            this.close()
          } else {
            this.bdOrderData = res.data
            res.data.brokerageAmount > 0 ? this.bdOrderAmountDisabled = true : this.bdOrderAmountDisabled = false
            if (res.data.paymentInfo) {
              const payWay = res.data.paymentInfo
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
              this.account = account
            }
          }
        }).catch((err) => {
          this.loading = false
          this.close()
          console.error(err)
        })
        return
        // 旧bd返佣
        api.getOrderRebateByOrderId(this.orderId).then(res => {
          this.orderDataNew = res.data
          if (res.data.brokeragePayment) {
            const payWay = res.data.brokeragePayment
            let account = ''
            for (const item in payWay) {
              console.log(item, payWay[item])
              switch (item) {
                case 'paymentType': {
                  account += '付款类型：' + payWay[item] + '  ;  '
                  break
                }
                case 'payAcc': {
                  account += ' 账户：' + payWay[item] + '  ;  '
                  break
                }
                case 'bankName': {
                  account += ' 银行：' + payWay[item] + '  ;  '
                  break
                }
                case 'realName': {
                  account += ' 收款人姓名：' + payWay[item] + '  ;  '
                  break
                }
                case 'idCard': {
                  account += ' 收款人身份证号：' + payWay[item] + '  ;  '
                  break
                }
                case 'bankAddress': {
                  account += ' Bank Address：' + payWay[item] + '  ;  '
                  break
                }
                case 'zip': {
                  account += ' ZIP：' + payWay[item] + '  ;  '
                  break
                }
                case 'routingNumber': {
                  account += ' Routing Number：' + payWay[item] + '  ;  '
                  break
                }
                case 'swiftCode': {
                  account += ' Swift Code：' + payWay[item] + '  ;  '
                  break
                }
              }
            }
            this.account = account
          }

          this.loading = false
          console.log('getOrderDataByOrderId', res)
          this.referrer =
            (res.data.menteeInfo.recommender || '') +
            '(' +
            (res.data.menteeInfo.channelName +
              '-' +
              res.data.menteeInfo.sourceName || '无来源') +
            ')'
          this.orderPrice = res.data.orderInfo.orderPrice
          this.brokerageStatus = res.data.brokerageStatus
          this.brokerage = res.data.fixedBrokerage || 300
          const confirmText = ['Tips', '1.订单需全部入账', '2.订单总金额大于等于3500美金', '3.该学生渠道来源需设置对应返佣规则', `此笔订单不满足返佣条件原因为：${res.data.brokerageStatusMsg}`]
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          if (res.data.brokerageStatusMsg == '自定义返佣' || res.data.brokerageStatusMsg == '固定返佣' || res.data.brokerageStatusMsg == '返佣金额或比例可选') {
            if (this.brokerageStatus == 5) {
              // 满足返佣条件
              this.brokerageNoChange = false
            } else if (this.brokerageStatus == 4) {
              // 满足返佣条件，只能返佣固定金额300美金；
              this.type = 'number'
              this.currencyType = 'usd'
              // this.brokerage = res.data.fixedBrokerage || 300;
              this.brokerageNoChange = true
            } else {
              this.orderPrice = 0
              // this.orderId = ''
            }
          } else {
            this.$confirm('提示', {
              message: h('div', null, newDatas),
              confirmButtonText: '确定',
              type: 'warning'
            })
              .then(() => {
                // if (this.brokerageStatus == 5) {
                //   // 满足返佣条件
                //   this.brokerageNoChange = false;
                // } else if (this.brokerageStatus == 4) {
                //   // 满足返佣条件，只能返佣固定金额300美金；
                //   this.type = "number";
                //   this.currencyType = "usd";
                //   // this.brokerage = res.data.fixedBrokerage || 300;
                //   this.brokerageNoChange = true;
                // } else {
                //   this.orderPrice = 0;
                //   this.orderId = "";
                // }
                this.brokerage = null
                this.orderPrice = 0
                this.referrer = ''
                this.$emit('close')
              })
              .catch(() => {
                this.brokerage = null
                this.orderPrice = 0
                this.referrer = ''
                this.$emit('close')
              })
          }
        })
          .catch(err => {
            err
            this.$message('orderID不存在')
          })
      }
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.rate = null
      // this.orderId = null
      this.brokerage = null
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
      if (this.pretalk && this.pretalk.pretalkId) {
        this.toPretalk()
        return
      }
      // 验证
      if (!this.bdOrderData.brokerageAmount) {
        this.$message('返佣金额不能为空')
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

      const data = {
        applyType: 'brokerage',
        applyTitle: `订单[${this.orderId}]的返佣申请`,
        copyTo: copyTo,
        approval: approval,
        voucher: this.uploadFileList.map(v => {
          return { voucherName: v.name, voucherPath: v.url }
        }),
        keyId: this.orderId,
        content: {
          file: this.uploadFileList,
          text: [
            {
              label: '订单ID',
              value: this.orderId
            },
            {
              label: '学员姓名',
              value: this.bdOrderData.menteeName
            },
            {
              label: '首次咨询日期',
              value: this.bdOrderData.firstAskDate
            },
            {
              label: '签约日期',
              value: this.bdOrderData.signDate
            },
            {
              label: '订单金额',
              value: this.bdOrderData.orderPrice
            },
            {
              label: '返佣渠道',
              value: this.bdOrderData.sourceName
            },
            {
              label: '返佣规则',
              value: this.bdOrderData.brokerageModel
            },
            {
              label: '返佣金额',
              value: 'USD（默认美金）' + this.bdOrderData.brokerageAmount
            },
            {
              label: '返佣账户',
              value: this.account
            }
          ],
          info: {
            orderId: this.orderId,
            fundType: 'USD',
            // exchangeRate: this.exchangeRate,
            // keyType: keyType,
            // keyId: orderId,
            payAccount: this.account,
            payUser: this.bdOrderData.sourceName,
            fundWage: this.bdOrderData.brokerageAmount
          }
        }
      }
      console.log('setbrokerage', data)
      api.setRefund(data).then(res => {
        console.log('setbrokerage，', res)
        if (res.code == '200') {
          this.$message.success('提交成功')
          this.$emit('submit')
          this.clear()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 凭证上传
    uploadFileAxios (file, fileList) {
      this.loading = true
      console.log(file, fileList)
      uploadFunBySys(file.file, 'voucher/brokerage_apply', url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        })
        this.loading = false
        this.$refs.elupload.clearFiles()
        console.log(this.uploadFileList)
      })
    },
    uploadFileAxios1 (file, fileList1) {
      this.loading = true
      console.log(file, fileList1)
      uploadFunBySys(file.file, 'voucher/pretalk_brokerage', url => {
        this.uploadFileList1.push({
          url: url,
          name: file.file.name
        })
        this.loading = false
        this.$refs.elupload1.clearFiles()
        console.log(this.uploadFileList1)
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
    },
    changeSelect (val) {
      console.log(val)
      if (val == '1') {
        if (this.signData.mentee.brokeragePayment) {
          const payWay = this.signData.mentee.brokeragePayment
          this.account = this.payFn(payWay)
        } else {
          this.$message.warning('暂无账户信息！！')
        }
      }
    },
    payFn (payWay) {
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
      return account
    },
    toPretalk () {
      if (!this.accountPretalk.length) {
        this.$message('pretalk收款账号详情不能为空,请检查该学员有无默认支付账户')
        return
      }
      const approval = []
      let cannot = false
      if (this.auditorList1.length < 1) {
        cannot = true
      }
      this.auditorList1.forEach(aa => {
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
      const data = {
        applyTitle: 'pretalk申请',
        copyTo: '',
        approval: approval,
        keyId: this.orderId,
        applyType: 'pretalk_brokerage',
        content: {
          file: [...this.uploadFileList1],
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
              label: '推荐人',
              value: this.referrer
            },
            {
              label: 'pretalk名',
              value: this.pretalk.pretalkName
            },
            {
              label: '学员名',
              value: this.pretalk.realName
            },
            {
              label: '申请金额',
              value: '$200'
            },
            {
              label: '收款账户',
              value: this.accountPretalk
            }
          ],
          info: {
            orderId: this.orderId,
            keyId: this.orderId,
            fundType: 'usd',
            fundWage: 200,
            pretalkId: this.pretalk.pretalkId,
            payType: this.pretalkDetail.accountId
          }
        }
      }
      console.log(data)
      api.setRefund(data).then(res => {
        console.log('setbrokeragePretalk，', res)
        if (res.code == '200') {
          this.$message.success('提交成功')
          this.$emit('submit')
          this.clear()
        } else {
          this.$message.warning(res.message)
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
// .upload{
//   ::v-deep .el-upload-dragger{
//     width:300px;
//   }
// }
</style>
