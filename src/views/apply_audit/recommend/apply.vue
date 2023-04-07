<!--
 * @Author: 库建华
 * @Date: 2019-08-14 11:19:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:49:14
 * @Version:
 * @Description:
 -->
<template>
  <div class="recommend_bonus">
    <el-dialog :close-on-click-modal="false"
      title="推荐奖励"
      :visible.sync="recommendApplyVisible"
      width="1200px"
      :before-close="close"
    >
      <el-card class="mb20">
        <el-row class="mb10">
          <template>
            <el-col :span="3" class="mentee-detail-name">货币类型</el-col>
            <el-col :span="4" class="mentee-detail-value">
              <el-select
                :style="{width:'100px'}"
                v-model="currencyType"
                size="mini"
                placeholder="请选择"
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
          <el-col :span="3" class="mentee-detail-name">奖励金额</el-col>
          <el-col :span="3" class="mentee-detail-value">
            <el-input-number :controls="false" v-model="bonus" size="mini" placeholder></el-input-number>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">推荐人</el-col>
          <el-col :span="3" class="mentee-detail-value">
            <el-input size="mini" v-model="referrer"></el-input>
          </el-col>
          <el-col :span="3" :offset="1" class="mentee-detail-name">系统汇率</el-col>
          <el-col :span="3" class="mentee-detail-value">
            <el-input-number
              :controls="false"
              :disabled="true"
              v-model="exchangeRate"
              size="mini"
              placeholder
            ></el-input-number>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">收款账号详情</el-col>
          <el-col :span="20" class="mentee-detail-value">
            <el-input size="mini" v-model="account" maxlength="199"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="mentee-detail-name">备注</el-col>
          <el-col :span="20" class="mentee-detail-value">
            <el-input size="mini" v-model="note" maxlength="199"></el-input>
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
import mixins from '@/plugin/mixins'
import { uploadFunBySys } from '@/libs/file'

export default {
  props: {
    recommendApplyVisible: {
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
      referrer: '',
      account: '',
      note: '',
      brokerageDate: {},
      orderId: null,
      orderPrice: 0,
      rate: 0,
      bonus: 0,
      bill_currency_type: [],
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
      ]
    }
  },
  computed: {
    // brokerage: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    recommendApplyVisible: function (val) {
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
        apiDic.getAuditorListByApplyType('recommend_bonus').then(res => {
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
      }
    }
  },
  mounted () {

  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.rate = null
      this.brokerage = null
      this.orderId = null
      this.exchangeRate = 0
      this.orderPrice = 0
      this.account = ''
      this.note = ''
      this.referrer = ''
      this.fileList = []
      this.auditor = []
      this.copy = []
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
      if (!this.bonus) {
        this.$message('金额不能为空')
        return
      }
      if (!this.referrer) {
        this.$message('推荐人不能为空')
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
      const data = {
        applyType: 'recommend_bonus',
        applyTitle: `[${this.referrer}]的推荐奖励申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: this.uploadFileList,
          text: [
            {
              label: '奖励金额',
              value: this.currencyType + this.bonus
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
              label: '收款账号详情',
              value: this.account
            }
          ],
          info: {
            note: this.note,
            fundType: this.currencyType,
            payAccount: this.account,
            recommendUser: this.referrer,
            exchangeRate: this.exchangeRate,
            fundWage: this.bonus
          }
        }
      }
      if (this.note) {
        data.content.text.push({
          label: '备注',
          value: this.note
        })
      }
      api.setRefund(data).then(res => {
        console.log('recommend', res)
        this.$emit('submit')
        this.clear()
      })
    },
    // 凭证上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, 'voucher/recommend_apply', url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        })
        this.$loading().close()
        this.$refs.elupload.clearFiles()
        console.log(this.uploadFileList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
