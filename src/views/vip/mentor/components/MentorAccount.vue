<template>
  <div class="pay-way">
      <el-form :inline="true" label-width="120px">
        <el-form-item label="类型">
          <el-select :style="{width:'200px'}" v-model="accountType" filterable placeholder="请选择">
            <el-option v-for="item in accountTypeList" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="el-icon-circle-plus-outline" @click="addPayWay" type="text">添加账户</el-button>
      </el-form>
      <!-- mentorList -->
      <el-card class="box-card box-cardTe mb20" :class="item.payStatus == '1'?'disabled1':''"  size="mini"  v-for="(item,i) in mentorList" :key="item.pkId">
        <div class="mb20" style="display:flex;justify-content:space-between">
          <div>
            <el-tag size="" type="danger" v-if="i == '0' && item.payStatus == '0' && item.priority == '1'">默认支付方式</el-tag>
          </div>
          <div style="">
            <el-button size="mini" type="success" v-if="item.payStatus == '0' && i!= 0  " @click="defaultItem(item)">设为默认</el-button>
            <el-button size="mini" type="primary" @click="editItme(item)">编辑</el-button>
            <el-button size="mini" type="warning" v-if="item.payStatus == '0'" @click="warningItem(item)">禁用</el-button>
            <el-button size="mini" type="success" v-if="item.payStatus == '1'" @click="successItem(item)">启用</el-button>
            <el-button size="mini" type="danger" @click="deleteItme(item)">删除</el-button>
          </div>
        </div>
        <el-form :inline="true" size="mini" label-width="130px">
          <el-form-item v-if="item.paymentTypeName" label="付款类型：">
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
          <el-form-item label="RecipientAddress：" v-if="item.recipientAddress">
            <div :style="{width:'200px'}">{{item.recipientAddress}}</div>
          </el-form-item>
          <el-form-item label="Swift Code：" v-if="item.swiftCode">
            <div :style="{width:'200px'}">{{item.swiftCode}}</div>
          </el-form-item>
        </el-form>
      </el-card>

    <el-dialog
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
      width="1000px"
      title="Company Account"
      :visible.sync="usAccountVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="220px">

        <el-form-item label="Account Type：">
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
      width="1000px"
      :title="accountData.paymentType + '账户详情'"
      :visible.sync="wxPayVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="ID：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <el-form-item label="账户状态：">
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
    <MentorPayWay :list="list" :payListVisible="payListVisible" :mentorId="mentorId" @submit="updateTypeSubmit()" @close="updateTypeClose()"  />
  </div>
</template>
<script>
import api from '@/api/vip.js'
import api2 from '@/api/bd.js'
import mixins from '@/plugin/mixins'
import MentorPayWay from './MentorPayWay.vue'

export default {
  name: 'payWay',
  components: { MentorPayWay },
  props: {
    // mentorId: {}
  },
  mixins: [mixins],
  data () {
    return {
      mentorId: '',
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
      mentorList: [],
      accountData: {}
    }
  },
  mounted () {
    this.Topage()
  },
  watch: {
  },
  methods: {
    async Topage () {
      this.accountTypeList = await this.getDictionary('mentor_pay_type')
      this.mentorId = this.$route.query.mentorId
      this.getPayWayListDataByMentorId(this.mentorId)
    },
    getPayWayListDataByMentorId (mentorId) {
      console.log(mentorId)
      api2.getCooperatorPaymentListByCooperatorIdNew(mentorId).then(res => {
        this.mentorList = res.data
        console.log('导师支付账户列表', res)
      })
    },
    addPayWay () {
      console.log(this.accountType)
      if (!this.accountType) {
        this.$message({
          type: 'error',
          message: '你先把账户类型，选~了~呀~~'
        })
        return
      }
      this.accountData = { paymentType: this.accountType }
      let parentItem = ''
      this.accountTypeList.forEach(v => {
        if (v.itemValue == this.accountType) {
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
    deleteItme (row) {
      this.$confirm('此操作将永久删除此账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api2.deleteCommonPaymentNew(row.accountId).then(res => {
          console.log('提交支付账户后', res)
          this.$message({
            type: 'success',
            message: '账户删除成功'
          })
          this.Topage()
          this.check()
        })
      })
    },
    editItme (data) {
      this.accountData = data
      let parentItem = ''
      this.accountTypeList.forEach(v => {
        if (v.itemValue == this.accountData.paymentType) {
          parentItem = v.parentItem
        }
      })
      console.log(parentItem)
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
      this.accountData.userId = this.mentorId
      api2.uptCommonPaymentNew(this.accountData).then(res => {
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
      this.accountData.userId = this.mentorId
      api2.setCommonPaymentNew(this.accountData).then(res => {
        console.log(res)
        this.Topage()
        this.beforePayWayItemClose()
        this.check()
        this.$message({
          type: 'success',
          message: '账户添加成功'
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
        console.log(row)
        const data = JSON.parse(JSON.stringify(row))
        // data.userId = row.accountId
        data.priority = '1'
        api2.uptCommonPaymentNew(data).then(res => {
          console.log(res)
          this.Topage()
          this.check()
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
        // data.userId = row.accountId
        data.payStatus = '1'
        api2.uptCommonPaymentNew(data).then(res => {
          if (res.code == 200) {
            console.log(res)
            this.Topage()
            this.check()
            this.$message({
              type: 'success',
              message: '禁用成功'
            })
          } else {
            this.$message.error(res.message)
          }
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
        // data.userId = row.accountId
        data.payStatus = '0'
        api2.uptCommonPaymentNew(data).then(res => {
          console.log(res)
          this.Topage()
          this.check()
          this.$message({
            type: 'success',
            message: '启用成功'
          })
        })
      })
    },
    check () {
      api2.searchPaymentApplyList(this.mentorId).then(res => {
        console.log(res.data, 222222222222222222)
        if (res.data && res.data.length > 0) {
          this.$confirm(`该导师有${res.data.length}个相关费用申请，是否需要更新申请账户`, '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.list = res.data
            this.payListVisible = true
          })
        }
      })
    },
    updateTypeSubmit () {
      this.payListVisible = false
      this.Topage()
    },
    updateTypeClose () {
      this.payListVisible = false
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
</style>
