<template>
  <div class="pay-way">
    <el-drawer
      size="90%"
      title="账户"
      :visible.sync="payAccountVisible"
      :before-close="beforePayWayClose"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="类型">
          <el-select :style="{width:'200px'}" v-model="accountType" filterable placeholder="请选择">
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
      <!-- 可编辑 -->
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="操作" width="80" >
          <template slot-scope="scope">
            <el-button type="text" @click="editItme(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTypeName" align="center" label="付款类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payAcc" align="center" label="账户" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bankName" align="center" label="银行" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" align="center" label="收款人姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idCard" align="center" label="收款人身份证号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bankAddress" align="center" label="Bank Address" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zip" align="center" label="ZIP" show-overflow-tooltip></el-table-column>
        <el-table-column prop="routingNumber" align="center" label="Routing Number" show-overflow-tooltip></el-table-column>
        <el-table-column prop="swiftCode" align="center" label="Swift Code" show-overflow-tooltip></el-table-column>
        <el-table-column prop="priority" align="center" label="优先顺序" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" align="center" label="账户状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.payStatus == '0' ? '启用' : '禁用'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" align="center" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateByName" align="center" label="最近更新人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" align="center" label="最近更新时间" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayClose">取 消</el-button>
      </span>
    </el-drawer>
    <el-dialog :close-on-click-modal="false"
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
        <el-form-item label="优先级：">
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in payStatus"
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
    <el-dialog :close-on-click-modal="false"
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
          <el-select
            :style="{width:'180px'}"
            v-model="accountData.payStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in payStatus"
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
    <el-dialog :close-on-click-modal="false"
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
              v-for="item in payStatus"
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
              v-for="item in payStatus"
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
import util from '@/libs/util'
import api from '@/api/bd.js'
import mixins from '@/plugin/mixins'

export default {
  mixins: [mixins],
  name: 'payWay',
  props: {
    payAccountVisible: {
      type: Boolean,
      default: false
    },
    ambassadorId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      payWayList: [],
      payStatus: [
        { itemValue: '0', itemName: '启用' },
        { itemValue: '1', itemName: '禁用' }
      ],
      payWaySubmitList: {
        uptList: [],
        addList: [],
        delList: []
      },
      accountType: null,
      accountTypeList: [],
      tableData: [],
      bankVisible: false,
      aliPayVisible: false,
      wxPayVisible: false,
      venmoVisible: false,
      boaVisible: false,
      usAccountVisible: false,

      accountData: {}
    }
  },
  mounted () {
    window.deleteItme = v => this.deleteItme(v)
    window.editItme = v => this.editItme(v)
    this.pageInit()
  },
  watch: {
    payAccountVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  methods: {
    async pageInit () {
      this.accountTypeList = await this.getDictionary('mentor_pay_type')
    },
    Topage () {
      this.getPaymentListByAmbassadorId()
    },
    getPaymentListByAmbassadorId () {
      api.getCooperatorPaymentListByCooperatorIdNew(this.ambassadorId).then(res => {
        console.log('账户列表', res)
        this.tableData = []
        this.tableData = res.data
      })
    },
    beforePayWayClose () {
      this.$emit('close')
      this.tableData = [];
      (this.payWaySubmitList = {
        uptList: [],
        addList: [],
        delList: []
      }),
      (this.accountType = null)
    },
    payWaySubmit () {
      console.log('提交支付账户参数', this.payWaySubmitList)
      api
        .setPayWay(this.payWaySubmitList)
        .then(res => {
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
        .catch(err => {
          console.log(err)
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
      console.log(this.accountType)
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
      console.log(row)
      this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteCommonPaymentNew(row.accountId)
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.Topage()
        })
    },
    editItme (row) {
      this.accountData = row
      const type = row.paymentType
      console.log(row)
      let parentItem = ''
      this.accountTypeList.forEach(v => {
        if (v.itemValue == type) {
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
      this.accountData.userId = this.ambassadorId
      console.log(this.accountData)
      api.uptCommonPaymentNew(this.accountData).then(res => {
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
      this.accountData.userId = this.ambassadorId
      console.log(this.accountData)
      api.setCommonPaymentNew(this.accountData).then(res => {
        console.log(res)
        this.Topage()
        this.beforePayWayItemClose()
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
    }
  }
}
</script>
