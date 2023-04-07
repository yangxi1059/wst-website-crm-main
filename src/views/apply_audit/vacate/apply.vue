<template>
  <div class="vacate">
    <el-dialog :close-on-click-modal="false" title="请假申请" :visible.sync="vacateApplyVisible" width="1200px" :before-close="close">
      <!-- <el-card class="mb20"> -->
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">请假类型</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-select
            :style="{width:'200px'}"
            size="mini"
            v-model="expenditureReason"
            placeholder="请选择"
          >
            <el-option
              v-for="item in vacate_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue + '$$' + item.itemName"
            ></el-option>
          </el-select>
        </el-col>
        <el-col
          :span="3"
          class="mentee-detail-name"
          v-if="is_annual_leave"
        >剩余年假{{annual_leave_day}}天</el-col>
        <el-col :span="3" class="mentee-detail-name" v-if="!is_lieu_leave">请假时长（天）</el-col>
        <el-col :span="3" class="mentee-detail-name" v-else>请假时长（小时）</el-col>
        <el-col :span="3" class="mentee-detail-value">
          <el-input-number :controls="false" v-model="vacateDay" size="mini" placeholder></el-input-number>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">开始时间</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-date-picker
            :style="{width:'200px'}"
            size="mini"
            v-model="vacateBegin"
            type="datetime"
            placeholder="选择日期时间"
            default-time="09:00:00"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-col>
        <el-col :span="3" class="mentee-detail-name">结束时间</el-col>
        <el-col :span="5" class="mentee-detail-value">
          <el-date-picker
            :style="{width:'200px'}"
            size="mini"
            v-model="vacateEnd"
            type="datetime"
            placeholder="选择日期时间"
            default-time="09:00:00"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="3" class="mentee-detail-name">请假事由</el-col>
        <el-col :span="18" class="mentee-detail-value">
          <el-input size="mini" v-model="account" type="textarea" maxlength="199"></el-input>
        </el-col>
      </el-row>
      <!-- </el-card> -->
      <el-form :inline="true" label-width="150px">
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
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        style="width: 100%"
        v-if="is_lieu_leave"
      >
        <el-table-column prop="beginTime" align="center" label="加班开始时间" min-width="100"></el-table-column>
        <el-table-column prop="endTime" align="center" label="加班结束时间" min-width="100"></el-table-column>
        <el-table-column prop="workHours" align="center" label="加班总时长" min-width="100"></el-table-column>
        <el-table-column prop="lieuHours" align="center" label="剩余未调休时长" min-width="100"></el-table-column>
        <el-table-column prop="lieuStatus" align="center" label="调休状态" min-width="100">
          <template slot-scope="scope">
            <span :class="MyClass[scope.row.lieuStatus]">{{lieuStatusS[scope.row.lieuStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lieuTime" align="center" label="有效截止时间" min-width="100"></el-table-column>
      </el-table>
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
import util from '@/libs/util'
import { uploadFunBySys } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  props: {
    vacateApplyVisible: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      user: [],
      userInfo: util.sessions.get('userInfo'),
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: 'cny',
      note: '',
      account: '',
      payUser: '',
      vacateBegin: null,
      vacateEnd: null,
      vacateDay: null,
      expenditureReason: '',
      vacate_type: [],
      tableData: [],
      bill_currency_type: [],
      MyClass: ['colorB', '', 'colorG'],
      lieuStatusS: ['未调休', '已调休', '部分调休'],
      total_lieu_leave: 0,
      is_lieu_leave: false,
      is_annual_leave: false,
      annual_leave_day: 0,
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
  mixins: [mixins],
  computed: {
    // vacate: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    vacateApplyVisible: function (val) {
      if (val) {
        console.log(val, 'yx请假申请*************')
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
        axios.getAuditorListByApplyType('vacate').then(res => {
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
    },
    expenditureReason: function (val) {
      this.is_annual_leave = false
      this.is_lieu_leave = false
      if (val.split('$$')[0] === 'lieu_leave') {
        api.getUserLieuS(this.userInfo.userId).then(res => {
          console.log('', res.data)
          this.tableData = res.data.lieuArray
          this.total_lieu_leave = res.data.lieuHours
          this.is_lieu_leave = true
        })
      } else if (val.split('$$')[0] === 'annual_leave') {
        const params = {
          pageNum: 1,
          pageSize: 1,
          userId: this.userInfo.userId,
          recordStatus: '0'
        }
        api.getVacation(params).then(res => {
          console.log(res)
          this.annual_leave_day =
            res.data.rows[0].vacationDay - res.data.rows[0].vacationUseDay
          this.is_annual_leave = true
        })
      }
    }
  },
  mounted () {

  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.vacate_type = await this.getDictionary('vacate_type')
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
      this.expenditureReason = ''
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
      if (
        this.expenditureReason.split('$$')[0] === 'lieu_leave' &&
        this.total_lieu_leave < this.vacateDay
      ) {
        this.$message('可调休时间不够')
        return
      }
      if (
        this.expenditureReason.split('$$')[0] === 'annual_leave' &&
        this.annual_leave_day < this.vacateDay
      ) {
        this.$message('年假时间不够')
        return
      }
      if (!this.vacateBegin) {
        this.$message('开始时间不能为空')
        return
      }
      if (!this.vacateEnd) {
        this.$message('结束时间不能为空')
        return
      }
      if (!this.vacateDay) {
        this.$message('请假时长不能为空')
        return
      }
      if (!this.expenditureReason) {
        this.$message('类型不能为空')
        return
      }
      if (!this.account || !this.account.length) {
        this.$message('请假事由不能为空')
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
        applyType: 'vacate',
        applyTitle: `[${this.userInfo.userName}]的[${
          this.expenditureReason.split('$$')[1]
        }]的请假申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: '请假类型',
              value: this.expenditureReason.split('$$')[1]
            },
            {
              label: '开始时间',
              value: this.vacateBegin
            },
            {
              label: '结束时间',
              value: this.vacateEnd
            },
            {
              label: '请假时长（天）',
              value: this.vacateDay
            },
            {
              label: '请假事由',
              value: this.account
            }
          ],
          info: {
            // note: this.note,
            // expenditureType: this.currencyType,
            reason: this.account,
            vacateBegin: this.vacateBegin,
            vacateEnd: this.vacateEnd,
            vacateDay: this.vacateDay,
            // this.currencyType +
            vacateType: this.expenditureReason.split('$$')[0],
            voucher: []
            // expenditureTimes: this.expenditureTimes,
          }
        }
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'voucher/vacate', url => {
            console.log(url)
            data.content.file.push({
              name: file.name,
              url: url
            })
            if (data.content.file.length === this.fileList.length) {
              console.log('setvacate参数', data)
              api.setRefund(data).then(res => {
                console.log('setvacate，', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        api.setRefund(data).then(res => {
          console.log('setvacate，', res)
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
