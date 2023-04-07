/* eslint-disable no-sequences */
<template>
  <div class="pay-way">
    <el-dialog
      :close-on-click-modal="false"
      width="765px"
      title="学员账户"
      :visible.sync="payWayVisible"
      :before-close="beforePayWayClose"
    >
      <el-form :inline="true" size="mini" >
        <el-form-item label="">
          <el-select :style="{width:'200px'}" class="mr10" v-model="accountType" filterable placeholder="请选择账户类型">
            <el-option v-for="item in accountTypeList" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
          <el-button class="el-icon-circle-plus-outline" @click="addPayWay"  type="primary">添加账户</el-button>
        </el-form-item>
      </el-form>
      <!-- 可编辑 -->
      <!-- <hot-table :settings="settings" ref="settings" licenseKey="non-commercial-and-evaluation"></hot-table> -->
      <!-- menteeList -->
      <el-card class="box-card box-cardTe mb20" :class="item.payStatus == '1'?'disabled1':''"  size="mini"  v-for="(item,i) in menteeList" :key="item.pkId">
        <div class="mb20" style="display:flex;justify-content:space-between">
          <div>
            <el-tag size="" type="danger" v-if="i == '0' && item.payStatus == '0' && item.priority == '1'">默认支付方式</el-tag>
          </div>
          <div style="">
            <el-button size="mini" type="success" v-if="item.payStatus == '0' && i!= 0  " @click="defaultItem(item)">设为默认</el-button>
            <el-button size="mini" type="primary" @click="editItme(i)">编辑</el-button>
            <el-button size="mini" type="warning" v-if="item.payStatus == '0'" @click="warningItem(item)">禁用</el-button>
            <el-button size="mini" type="success" v-if="item.payStatus == '1'" @click="successItem(item)">启用</el-button>
            <el-button size="mini" type="danger" @click="deleteItme(item)">删除</el-button>
          </div>
        </div>
        <el-form :inline="true" size="mini" label-width="130px">
          <el-form-item label="付款类型：" v-if="item.paymentType">
            <div :style="{width:'200px'}">{{item.paymentTypeName}}</div>
          </el-form-item>
          <el-form-item label="账户：" v-if="item.payAcc">
            <div :style="{width:'200px'}">{{item.payAcc}}</div>
          </el-form-item>
          <el-form-item label="银行：" v-if="item.bankName">
            <div :style="{width:'200px'}">{{item.bankName}}</div>
          </el-form-item>
          <el-form-item label="收款人姓名：" v-if="item.realName">
            <div :style="{width:'200px'}">{{item.realName}}</div>
          </el-form-item>
          <el-form-item label="收款人身份证号：" v-if="item.idCard">
            <div :style="{width:'200px'}">{{item.idCard}}</div>
          </el-form-item>
          <el-form-item label="Bank Address：" v-if="item.bankAddress">
            <div :style="{width:'200px'}">{{item.bankAddress}}</div>
          </el-form-item>
          <el-form-item label="ZIP：" v-if="item.zip">
            <div :style="{width:'200px'}">{{item.zip}}</div>
          </el-form-item>
          <el-form-item label="Routing Number：" v-if="item.routingNumber">
            <div :style="{width:'200px'}">{{item.routingNumber}}</div>
          </el-form-item>
          <el-form-item label="Swift Code：" v-if="item.swiftCode">
            <div :style="{width:'200px'}">{{item.swiftCode}}</div>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayClose">取 消</el-button>
        <!-- <el-button type="primary" @click="payWaySubmit">提交删除</el-button> -->
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="1000px"
      title="银行卡账户详情"
      :visible.sync="bankVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="卡号：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <el-form-item label="开户行：">
          <el-input v-model="accountData.bankName"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="accountData.realName"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input v-model="accountData.idCard"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="账户状态：">
          <!-- <div :style="{width:'200px'}">{{menteeData.company}}</div> -->
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemValue:'0',itemName:'启用'},{itemValue:'1',itemName:'禁用'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
            <!-- <el-option v-for="item in ['启用','禁用']" :key="item" :label="item" :value="item"></el-option> -->
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayItemClose">取 消</el-button>
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.accountId">更 新</el-button>
        <el-button type="primary" @click="addPayWay2" v-else>新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="1000px"
      title="Company Account"
      :visible.sync="usAccountVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="220px">

        <el-form-item label="Account Type：">
          <!-- <div :style="{width:'200px'}">{{menteeData.company}}</div> -->
          <el-select :style="{width:'180px'}" v-model="accountData.paymentType" filterable placeholder="请选择">
            <el-option v-for="item in accountTypeList" v-if="item.parentItem=='company_account'" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Account Number：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <el-form-item label="Bank Name：">
          <el-input v-model="accountData.bankName"></el-input>
        </el-form-item>
        <el-form-item label="Bank Address：">
          <el-input v-model="accountData.bankAddress"></el-input>
        </el-form-item>
        <el-form-item label="Full Name：">
          <el-input v-model="accountData.realName"></el-input>
        </el-form-item>
        <el-form-item label="Routing Number：">
          <el-input v-model="accountData.routingNumber"></el-input>
        </el-form-item>
        <el-form-item label="Swift Code：">
          <el-input v-model="accountData.swiftCode"></el-input>
        </el-form-item>
        <el-form-item label="Recipient Address：">
          <el-input v-model="accountData.recipientAddress"></el-input>
        </el-form-item>

        <el-form-item label="ZIP：">
          <el-input v-model="accountData.zip"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优先级：">
          <el-select
            :style="{width:'182px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="账户状态：">
          <!-- <div :style="{width:'200px'}">{{menteeData.company}}</div> -->
          <el-select
            :style="{width:'182px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemValue:'0',itemName:'启用'},{itemValue:'1',itemName:'禁用'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
            <!-- <el-option v-for="item in ['启用','禁用']" :key="item" :label="item" :value="item"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="Remark：">
          <el-input  type="textarea" :style="{width:'490px'}"  :autosize="{ minRows: 6}" v-model="accountData.remark" ></el-input>
          <el-button size="small" type="primary" @click="changeRemark()" class="ml20">识别文字</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayItemClose">取 消</el-button>
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.accountId">更 新</el-button>
        <el-button type="primary" @click="addPayWay2" v-else>新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="1000px"
      :title="accountData.paymentType + '账户详情'"
      :visible.sync="aliPayVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="账号/邮箱：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="accountData.realName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="账户状态：">
          <!-- <div :style="{width:'200px'}">{{menteeData.company}}</div> -->
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemValue:'0',itemName:'启用'},{itemValue:'1',itemName:'禁用'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayItemClose">取 消</el-button>
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.accountId">更 新</el-button>
        <el-button type="primary" @click="addPayWay2" v-else>新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="1000px"
      :title="accountData.paymentType + '账户详情'"
      :visible.sync="wxPayVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="ID：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="账户状态：">
          <!-- <div :style="{width:'200px'}">{{menteeData.company}}</div> -->
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{itemValue:'0',itemName:'启用'},{itemValue:'1',itemName:'禁用'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayItemClose">取 消</el-button>
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.accountId">更 新</el-button>
        <el-button type="primary" @click="addPayWay2" v-else>新 增</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/vip.js'
import api2 from '@/api/bd.js'
import mixins from '@/plugin/mixins'

export default {
  name: 'payWay',
  mixins: [mixins],
  props: {
    payWayVisible: {
      type: Boolean,
      default: false
    },
    menteeData: {
      type: Object
    }
  },
  data () {
    return {
      settings: {
        data: []
      },
      payWayList: [],
      payWaySubmitList: {
        uptList: [],
        addList: [],
        delList: []
      },
      accountType: null,
      accountTypeList: [],
      list: [],
      payListVisible: false,
      bankVisible: false,
      aliPayVisible: false,
      wxPayVisible: false,
      venmoVisible: false,
      boaVisible: false,
      usAccountVisible: false,
      menteeList: [],
      accountData: {}
    }
  },
  mounted () {},
  watch: {
    payWayVisible: function (newData, oldData) {
      if (newData) {
        console.log(this.menteeData)
        this.Topage()
        this.pageInit()
      }
    }
  },
  methods: {
    async pageInit () {
      this.accountTypeList = await this.getDictionary('mentor_pay_type')
    },
    Topage () {
      this.getCooperatorPaymentListByCooperatorIdNew(this.menteeData.menteeId)
    },
    getCooperatorPaymentListByCooperatorIdNew (menteeId) {
      api2.getCooperatorPaymentListByCooperatorIdNew(menteeId).then(res => {
        this.menteeList = JSON.parse(JSON.stringify(res.data))
        console.log('学员支付账户列表', res)
        this.settings.data = []
        this.settings.data = res.data
      })
    },
    beforePayWayClose () {
      this.$emit('close')
      this.settings.data = []
      this.menteeList = [];
      (this.payWaySubmitList = {
        uptList: [],
        addList: [],
        delList: []
      }),
      (this.accountType = null)
    },
    addPayWay () {
      console.log(this.accountType, this.accountTypeList)
      if (!this.accountType) {
        this.$message({
          type: 'error',
          message: '你先把账户类型，选~了~呀~~'
        })
        return
      }
      this.accountData = { paymentType: this.accountType }
      // this.settings.data.push(this.accountData);
      let parentItem = ''
      this.accountTypeList.forEach(v => {
        if (v.itemValue == this.accountType) {
          parentItem = v.parentItem
          console.log(11111, v)
        }
      })
      console.log(parentItem)
      switch (parentItem) {
        case 'bank':
          {
            this.bankVisible = true
            console.log(this.bankVisible)
          }
          break
        case 'alipay':
          {
            this.aliPayVisible = true
          }
          break
        case 'wechat':
          {
            this.wxPayVisible = true
          }
          break
        case 'venmo':
          {
            this.wxPayVisible = true
          }
          break
        case 'boa':
          {
            this.aliPayVisible = true
          }
          break
        case 'chase':
          {
            this.aliPayVisible = true
          }
          break
        case 'payPal':
          {
            this.aliPayVisible = true
          }
          break
        case 'zelle':
          {
            this.aliPayVisible = true
          }
          break
        case 'company_account':
          {
            this.usAccountVisible = true
          }
          break
      }
    },
    deleteItme (row) {
      this.$confirm('此操作将永久删除此账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api2
          .deleteCommonPaymentNew(row.accountId)
          .then((res) => {
            console.log('提交支付账户后', res)
            this.$message({
              type: 'success',
              message: '账户删除成功'
            })
            this.payWaySubmitList = {
              uptList: [],
              addList: [],
              delList: []
            }
            this.Topage()
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    editItme (i) {
      console.log(i, this.settings.data[i])
      this.accountData = this.settings.data[i]
      let parentItem = ''
      this.accountTypeList.forEach(v => {
        if (v.itemValue == this.accountData.paymentType) {
          parentItem = v.parentItem
        }
      })
      switch (parentItem) {
        case 'bank':
          {
            this.bankVisible = true
          }
          break
        case 'alipay':
          {
            this.aliPayVisible = true
          }
          break
        case 'wechat':
          {
            this.wxPayVisible = true
          }
          break
        case 'venmo':
          {
            this.wxPayVisible = true
          }
          break
        case 'boa':
          {
            this.aliPayVisible = true
          }
          break
        case 'chase':
          {
            this.aliPayVisible = true
          }
          break
        case 'payPal':
          {
            this.aliPayVisible = true
          }
          break
        case 'zelle':
          {
            this.aliPayVisible = true
          }
          break
        case 'company_account':
          {
            this.usAccountVisible = true
          }
          break
      }
    },
    uptPayWay () {
      const data = this.accountData
      data.userId = this.menteeData.menteeId
      api2.uptCommonPaymentNew(data).then(res => {
        console.log(res)
        this.Topage()
        this.beforePayWayItemClose()
        this.$message({
          type: 'success',
          message: '账户更新成功'
        })
      })
    },
    addPayWay2 () {
      this.$confirm('是否设置为默认账户 ？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        const data = this.accountData
        data.userId = this.menteeData.menteeId
        data.priority = '1'
        console.log(data)
        api2.setCommonPaymentNew(data).then(res => {
          console.log(res)
          this.Topage()
          this.beforePayWayItemClose()
          this.$message({
            type: 'success',
            message: '账户添加成功'
          })
        })
      }).catch(() => {
        const data = this.accountData
        data.userId = this.menteeData.menteeId
        console.log(data)
        api2.setCommonPaymentNew(data).then(res => {
          console.log(res)
          this.Topage()
          this.beforePayWayItemClose()
          this.$message({
            type: 'success',
            message: '账户添加成功'
          })
        })
      })
    },
    beforePayWayItemClose () {
      this.accountData = {}
      this.bankVisible = false
      this.wxPayVisible = false
      this.aliPayVisible = false
      this.usAccountVisible = false
      this.list = []
    },
    changeRemark () {
      this.accountData.realName = ''
      this.accountData.recipientAddress = ''
      this.accountData.routingNumber = ''
      this.accountData.payAcc = ''
      this.accountData.bankName = ''
      this.accountData.swiftCode = ''
      this.accountData.bankAddress = ''
      if (this.accountData.remark) {
        const a = JSON.parse(JSON.stringify(this.accountData.remark.split(/[(\r\n)\r\n]+/)))
        const b = []
        let m = ''
        let n = ''
        console.log(a)
        a.forEach(item => {
          b.push({
            label: item.slice(0, item.indexOf('：')),
            value: item.slice(item.indexOf('：') + 1)
          })
        })
        b.forEach(item => {
          if (item.label == 'Account First Name') {
            m = item.value || ''
          }
          if (item.label == 'Account Last Name') {
            n = item.value || ''
            this.accountData.realName = `${this.accountData.realName}${item.value}`
          }
          if (item.label == 'Recipient Address') {
            this.accountData.recipientAddress = `${item.value}`
          }
          if (item.label == 'Routing Number') {
            this.accountData.routingNumber = `${item.value}`
          }
          if (item.label == 'Account Number') {
            this.accountData.payAcc = `${item.value}`
          }
          if (item.label == 'Which Bank is it') {
            this.accountData.bankName = `${item.value}`
          }
          if (item.label == 'Swift Code') {
            this.accountData.swiftCode = `${item.value}`
          }
          if (item.label == 'Bank Address') {
            this.accountData.bankAddress = `${item.value}`
          }
          this.accountData.realName = `${m}${n}`
        })
        this.accountData = Object.assign({}, this.accountData)
        console.log(this.accountData)
      } else {
        this.$message.error('识别文字不可为空，且需要按照固定格式字眼')
      }
    },
    defaultItem (row) {
      this.$confirm('此操作将此账户设为默认支付方式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = JSON.parse(JSON.stringify(row))
        data.priority = '1'
        data.userId = this.menteeData.menteeId
        const dataNew = data
        api2.uptCommonPaymentNew(dataNew).then(res => {
          console.log(res)
          this.Topage()
          this.$message({
            type: 'success',
            message: '设置成功'
          })
        })
      })
    },
    warningItem (row) {
      console.log(row)
      this.$confirm('此操作将禁用此账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = JSON.parse(JSON.stringify(row))
        data.payStatus = '1'
        data.userId = this.menteeData.menteeId
        const dataNew = data
        console.log(dataNew)
        api2.uptCommonPaymentNew(dataNew).then(res => {
          console.log(res)
          this.Topage()
          this.$message({
            type: 'success',
            message: '禁用成功'
          })
        })
      })
    },
    successItem (row) {
      this.$confirm('此操作将启用此账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = JSON.parse(JSON.stringify(row))
        data.payStatus = '0'
        data.userId = this.menteeData.menteeId
        const dataNew = data
        console.log(dataNew)
        api2.uptCommonPaymentNew(dataNew).then(res => {
          console.log(res)
          this.Topage()
          this.$message({
            type: 'success',
            message: '启用成功'
          })
        })
      })
    },
    check (data) {
      console.log(data)
      if (data.data && data.data.applyList.length > 0) {
        this.$confirm(`该导师有${data.data.applyList.length}个相关费用申请，是否需要更新申请账户`, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.list = data.data.applyList
          this.payListVisible = true
        })
      }
    }
  }
}
</script>

<style lang='scss'>
  .box-cardTe .el-form-item{
    margin-bottom: 0px;
  }
  .box-card.disabled1 {
    background-color: #DCDFE6;
  }
  .mb20{
    margin-bottom: 20px;
  }
</style>
