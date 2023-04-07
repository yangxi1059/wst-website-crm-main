<template>
  <div class="pay-way">
    <el-drawer
      size="80%"
      class="padding:20px"
      title="HR——User账户"
      :visible.sync="payAccountVisible"
      :before-close="beforePayWayClose"
    >
    <div style="padding:0 20px;">
      <el-form  :inline="true" label-width="120px">
        <el-button class="el-icon-circle-plus-outline" type="primary" @click="addPayWay" size="mini">添加账户</el-button>
      </el-form>
      <!-- 可编辑 -->
      <el-table class="" :data="rows" size="small" highlight-current-row>
        <el-table-column min-width="100px" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editItme(scope.row)"
              title="编辑"
              class="el-icon-edit"
            ></el-button>
            <el-button
              type="text"
              @click="deleteItme(scope.row)"
              title="删除"
              class="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="bankAcc" align="center" label="账户"></el-table-column>
        <el-table-column prop="bankName" align="center" label="银行"></el-table-column>
        <el-table-column prop="accName" align="center" label="收款人姓名"></el-table-column>
        <el-table-column prop="createByName" align="center" label="创建人"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
        <el-table-column prop="updateByName" align="center" label="最近更新人"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="最近更新时间"></el-table-column>
      </el-table>
    </div>
    </el-drawer>
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      title="银行卡账户详情"
      :visible.sync="bankVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" :rules="rules" ref="ruleForm" :model="accountData" label-width="120px">
        <el-form-item label="卡号：" prop="bankAcc">
          <el-input v-if="this.accountData.createTime" disabled v-model="accountData.bankAcc"></el-input>
          <el-input v-else v-model="accountData.bankAcc"></el-input>
        </el-form-item>
        <el-form-item label="开户行：" prop="bankName">
          <el-input v-model="accountData.bankName"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="accName">
          <el-input v-model="accountData.accName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayItemClose">取 消</el-button>
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.createTime">更 新</el-button>
        <el-button type="primary" @click="addPayWay2" v-else>新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      title="US Company Account"
      :visible.sync="usAccountVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="220px">
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
              v-for="item in [{itemValue:0,itemName:'启用'},{itemValue:1,itemName:'禁用'}]"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforePayWayItemClose">取 消</el-button>
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.pkId">更 新</el-button>
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
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.pkId">更 新</el-button>
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
        <el-button type="primary" @click="uptPayWay" v-if="this.accountData.pkId">更 新</el-button>
        <el-button type="primary" @click="addPayWay2" v-else>新 增</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/hr.js'
import mixins from '@/plugin/mixins'

export default {
  mixins: [mixins],
  name: 'payWay',
  props: {
    payAccountVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      payWayList: [],
      rules: {
        bankAcc: [{ required: true, message: '必填', trigger: 'blur' }],
        bankName: [{ required: true, message: '必填', trigger: 'blur' }],
        accName: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rows: [],
      // settings: {
      //   height: 150,
      //   data: [],
      //   
      //   fillHandle: false,
      //   rowHeaders: true,
      //   stretchH: 'all',
      //   manualColumnResize: true,
      //   colHeaders: [
      //     '操作',
      //     '账户',
      //     '银行',
      //     '收款人姓名',
      //     '创建人',
      //     '创建时间',
      //     '最近更新人',
      //     '最近更新时间'
      //   ],
      //   readOnly: true,
      //   columns: [
      //     {
      //       data: 'bankAcc',
      //       renderer: btn
      //     },
      //     {
      //       allowEmpty: false,
      //       data: 'bankAcc'
      //     },
      //     {
      //       data: 'bankName',
      //       type: 'text'
      //     },
      //     {
      //       data: 'accName',
      //       type: 'text'
      //     },
      //     {
      //       data: 'createByName',
      //       type: 'text'
      //     },
      //     {
      //       data: 'createTime',
      //       type: 'text'
      //     },
      //     {
      //       data: 'updateByName',
      //       type: 'text'
      //     },
      //     {
      //       data: 'updateTime',
      //       type: 'text'
      //     }
      //   ],
      //   afterChange: (change, v) => {
      //     if (!change) return
      //     change.forEach(([col, row, old, newData]) => {
      //       console.log(newData)
      //       if (
      //         old !== newData &&
      //         (row === 'currencyType' ||
      //           row === 'revenue' ||
      //           row === 'exchangeRate')
      //       ) {
      //         let totalInCny = 0
      //         if (this.settings.data[col].currencyType == '美金') {
      //           totalInCny =
      //             this.settings.data[col].revenue *
      //             this.settings.data[col].exchangeRate
      //         } else {
      //           totalInCny = this.settings.data[col].revenue
      //         }
      //         totalInCny = Math.round(totalInCny * 10) / 10
      //         this.$refs.settings.$data.hotInstance.setDataAtRowProp(
      //           col,
      //           'totalInCny',
      //           totalInCny
      //         )
      //       }

      //       // 保存更新数据
      //       if (old !== newData && !!this.settings.data[col].pkId) {
      //         // uptList
      //         let haspkId = false
      //         this.payWaySubmitList.uptList.forEach((v, i, arr) => {
      //           if (this.settings.data[col].pkId == v.pkId) {
      //             v[row] = newData
      //             haspkId = true
      //           }
      //         })
      //         if (!haspkId) {
      //           const item = {
      //             pkId: this.settings.data[col].pkId
      //           }
      //           item[row] = newData
      //           this.payWaySubmitList.uptList.push(item)
      //         }
      //       }
      //     })
      //   }
      // },
      payWaySubmitList: {
        uptList: [],
        addList: [],
        delList: []
      },
      accountType: 'bank',
      accountTypeList: [],

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
    this.pageInit()
    window.deleteItme = v => this.deleteItme(v)
    window.editItme = v => this.editItme(v)
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
      this.getPayWayListDataByUserId()
    },
    getPayWayListDataByUserId () {
      api.getPaymentList(this.userId).then(res => {
        console.log('导师支付账户列表', res)
        this.rows = []
        this.rows = res.data;
      })
    },
    beforePayWayClose () {
      this.$emit('close')
      this.rows = [];
      (this.payWaySubmitList = {
        uptList: [],
        addList: [],
        delList: []
      }),
      (this.accountType = 'bank')
    },
    addPayWay () {
      this.accountType = 'bank'
      console.log(this.accountType)
      if (!this.accountType) {
        this.$message({
          type: 'error',
          message: '你先把账户类型，选~了~呀~~'
        })
        return
      }
      console.log(this.accountType)
      switch (this.accountType) {
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
        case 'wechatpay':
          {
            this.wxPayVisible = true
          }
          break
        case 'Venmo':
          {
            this.wxPayVisible = true
          }
          break
        case 'BOA':
          {
            this.aliPayVisible = true
          }
          break
        case 'Chase':
          {
            this.aliPayVisible = true
          }
          break
        case 'PayPal':
          {
            this.aliPayVisible = true
          }
          break
        case 'Zelle':
          {
            this.aliPayVisible = true
          }
          break
        case 'U.S Company Account':
          {
            this.usAccountVisible = true
          }
          break
      }
    },
    deleteItme (row) {
      this.$loading()
      api.delPaymentList(row.bankAcc).then(res => {
        this.$loading().close()
        this.$message({
          type: 'success',
          message: '账户删除成功'
        })
        this.Topage()
      })
    },
    editItme (row) {
      this.accountData = row
      const type = 'bank'
      switch (type) {
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
        case 'wechatpay':
          {
            this.wxPayVisible = true
          }
          break
        case 'Venmo':
          {
            this.wxPayVisible = true
          }
          break
        case 'BOA':
          {
            this.aliPayVisible = true
          }
          break
        case 'Chase':
          {
            this.aliPayVisible = true
          }
          break
        case 'PayPal':
          {
            this.aliPayVisible = true
          }
          break
        case 'Zelle':
          {
            this.aliPayVisible = true
          }
          break
        case 'U.S Company Account':
          {
            this.usAccountVisible = true
          }
          break
      }
    },
    uptPayWay () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.accountData.userId = this.userId
          const data = {
            bankAcc: this.accountData.bankAcc,
            bankName: this.accountData.bankName,
            accName: this.accountData.accName
          }
          console.log(data)
          api.editPaymentList(data).then(res => {
            console.log(res)
            this.Topage()
            this.beforePayWayItemClose()
            this.$message({
              type: 'success',
              message: '账户更新成功'
            })
          })
        }
      })
    },
    addPayWay2 () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.accountData.userId = this.userId
          // let data = { addList: [this.accountData] };
          const data = JSON.parse(JSON.stringify(this.accountData))
          console.log(data)
          api.addPaymentList(data).then(res => {
            console.log(res)
            this.Topage()
            this.beforePayWayItemClose()
            this.$message({
              type: 'success',
              message: '账户添加成功'
            })
          })
        }
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
