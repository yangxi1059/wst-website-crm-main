<template>
  <div class="pay-way">
    <el-drawer
      size="80%"
      title="公司账户"
      :visible.sync="payWayVisible"
      :before-close="beforePayWayClose"
    >
      <accountComponents ref="child" :payAccountVisible="payWayVisible" :cooperatorId="companyData.internship" />
      <!-- <el-form :inline="true" label-width="100px">
        <el-form-item label="公司名称：">
          <el-input :style="{width:'120px'}" v-model="companyData.internshipDesc" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select :style="{width:'120px'}" v-model="accountType" filterable placeholder="请选择">
            <el-option
              v-for="item in accountTypeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button class="el-icon-circle-plus-outline" @click="addPayWay" type="text">添加账户</el-button>
      </el-form>
      <el-table style="margin-left:20px" :data="tableData" size="mini"   stripe>
        <el-table-column prop="noticeId" width="100" label="操作" >
          <template slot-scope="scope">
            <el-button type="text" @click="editItme(scope.row)">编辑</el-button>
            <el-button type="text" @click="payWaySubmit(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTypeName" width="75" label="付款类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publicOrPrivateName" width="75" label="publicOrPrivate" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payAcc" label="账户" width="75" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bankName" label="银行" width="75" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="收款人姓名" width="75" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idCard" label="收款人身份证号" width="75" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bankAddress" label="Bank Address" width="75" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zip" label="ZIP" width="75" show-overflow-tooltip></el-table-column>
        <el-table-column prop="routingNumber" width="75" label="Routing Number" show-overflow-tooltip></el-table-column>
        <el-table-column prop="swiftCode" width="75" label="Swift Code" show-overflow-tooltip></el-table-column>
        <el-table-column prop="priority" width="75" label="优先顺序" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payStatus" width="75" label="账户状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.payStatus == '0' ? '启用' : '禁用'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" width="75" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" width="75" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateByName" width="75" label="最近更新人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" width="75" label="最近更新时间" show-overflow-tooltip></el-table-column>
      </el-table> -->
      <!-- 可编辑 -->
    </el-drawer>
    <!-- <el-dialog :close-on-click-modal="false"
      width="1000px"
      title="银行卡账户详情"
      :visible.sync="bankVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="Public/Private：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.publicOrPrivate"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in payment_public_or_private"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户状态：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in pay_status"
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
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      title="Company Account"
      :visible.sync="usAccountVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="220px">
        <el-form-item label="Public/Private：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.publicOrPrivate"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in payment_public_or_private"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
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
        <el-form-item label="ZIP：">
          <el-input v-model="accountData.zip"></el-input>
        </el-form-item>
        <el-form-item label="Routing Number：">
          <el-input v-model="accountData.routingNumber"></el-input>
        </el-form-item>
        <el-form-item label="Swift Code：">
          <el-input v-model="accountData.swiftCode"></el-input>
        </el-form-item>
        <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户状态：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in pay_status"
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
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      :title="accountData.paymentType + '账户详情'"
      :visible.sync="aliPayVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="Public/Private：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.publicOrPrivate"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in payment_public_or_private"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号/邮箱：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="accountData.realName"></el-input>
        </el-form-item>
        <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户状态：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in pay_status"
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
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      :title="accountData.paymentType + '账户详情'"
      :visible.sync="wxPayVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="Public/Private：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.publicOrPrivate"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in payment_public_or_private"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID：">
          <el-input v-model="accountData.payAcc"></el-input>
        </el-form-item>
        <el-form-item label="优先级：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.priority"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户状态：">
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in pay_status"
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
    </el-dialog> -->
  </div>
</template>
<script>
import api from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import accountComponents from '@/components/account_components.vue'

export default {
  name: 'payWay',
  props: {
    payWayVisible: {
      type: Boolean,
      default: false
    },
    companyData: {
      type: Object
    }
  },
  components: { accountComponents },
  data () {
    return {
      payWayList: [],
      tableData: [],
      payWaySubmitList: {
        uptList: [],
        addList: [],
        delList: []
      },
      accountType: null,
      accountTypeList: [],

      bankVisible: false,
      aliPayVisible: false,
      wxPayVisible: false,
      venmoVisible: false,
      boaVisible: false,
      usAccountVisible: false,

      accountData: {},
      payment_public_or_private: [],
      pay_status: [
        { itemName: '启用', itemValue: '0' },
        { itemName: '禁用', itemValue: '1' }
      ]
    }
  },
  mixins: [mixins],
  mounted () {
  },
  watch: {
    payWayVisible: function (newData, oldData) {
      if (newData) {
        this.Init()
      }
    }
  },
  methods: {
    Init () {
      this.$nextTick(() => {
        console.log(this.$refs.child)
        this.$refs.child.init()
      })
    },
    beforePayWayClose () {
      console.log(this.$refs.child)
      this.$refs.child.beforePayWayClose()
      this.$emit('close')
    },
    // async pageInit () {
    //   this.payment_public_or_private = await this.getDictionary('payment_public_or_private')
    //   this.accountTypeList = await this.getDictionary('mentor_pay_type')
    // },
    // Topage () {
    //   this.getCooperatorPaymentListByCooperatorIdNew(this.companyData.internship)
    // },
    // getCooperatorPaymentListByCooperatorIdNew (internship) {
    //   api.getCooperatorPaymentListByCooperatorIdNew(internship).then(res => {
    //     console.log('导师支付账户列表', res)
    //     this.tableData = []
    //     this.tableData = res.data
    //   })
    // },
    // beforePayWayClose () {
    //   this.$emit('close')
    //   this.tableData = [];
    //   (this.payWaySubmitList = {
    //     uptList: [],
    //     addList: [],
    //     delList: []
    //   }),
    //   (this.accountType = null)
    // },
    // payWaySubmit (data) {
    //   console.log(data)
    //   api
    //     .deleteCommonPaymentNew(data.accountId)
    //     .then(res => {
    //       console.log('提交支付账户后', res)
    //       this.$message({
    //         type: 'success',
    //         message: '账户删除成功'
    //       })
    //       this.getCooperatorPaymentListByCooperatorIdNew(this.companyData.internship)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    // addPayWay () {
    //   console.log(this.accountType)
    //   if (!this.accountType) {
    //     this.$message({
    //       type: 'error',
    //       message: '你先把账户类型，选~了~呀~~'
    //     })
    //     return
    //   }
    //   this.accountData = { paymentType: this.accountType }
    //   console.log(this.accountType)
    //   switch (this.accountType) {
    //     case 'bank':
    //       {
    //         this.bankVisible = true
    //       }
    //       break
    //     case 'alipay':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'wechatpay':
    //       {
    //         this.wxPayVisible = true
    //       }
    //       break
    //     case 'Venmo':
    //       {
    //         this.wxPayVisible = true
    //       }
    //       break
    //     case 'BOA':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'Chase':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'PayPal':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'Zelle':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'U.S Company Account':
    //       {
    //         this.usAccountVisible = true
    //       }
    //       break
    //   }
    //   if (this.accountType.includes('account')) {
    //     this.usAccountVisible = true
    //   }
    // },
    // editItme (row) {
    //   this.accountData = row
    //   switch (row.paymentType) {
    //     case 'bank':
    //       {
    //         this.bankVisible = true
    //       }
    //       break
    //     case 'alipay':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'wechatpay':
    //       {
    //         this.wxPayVisible = true
    //       }
    //       break
    //     case 'Venmo':
    //       {
    //         this.wxPayVisible = true
    //       }
    //       break
    //     case 'BOA':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'Chase':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'PayPal':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'Zelle':
    //       {
    //         this.aliPayVisible = true
    //       }
    //       break
    //     case 'U.S Company Account':
    //       {
    //         this.usAccountVisible = true
    //       }
    //       break
    //   }
    // },
    // uptPayWay () {
    //   const data = this.accountData
    //   data.userId = this.companyData.internship
    //   console.log(data)
    //   api.uptCommonPaymentNew(data).then(res => {
    //     console.log(res)
    //     this.Topage()
    //     this.beforePayWayItemClose()
    //     this.$message({
    //       type: 'success',
    //       message: '账户更新成功'
    //     })
    //   })
    // },
    // addPayWay2 () {
    //   const data = this.accountData
    //   data.userId = this.companyData.internship
    //   api.setCommonPaymentNew(data).then(res => {
    //     console.log(res)
    //     this.Topage()
    //     this.beforePayWayItemClose()
    //     this.$message({
    //       type: 'success',
    //       message: '账户添加成功'
    //     })
    //   })
    // },
    // beforePayWayItemClose () {
    //   this.accountData = {}
    //   this.bankVisible = false
    //   this.wxPayVisible = false
    //   this.aliPayVisible = false
    //   this.usAccountVisible = false
    // }
  }
}
</script>
