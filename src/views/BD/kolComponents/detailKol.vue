<!--
 * @Author: 杨曦
 * @Date: 2021-10-22 15:08:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-03 14:40:08
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-dialog :close-on-click-modal="false"
		title="KOL详情"
			width="765px"
			:before-close="newClose"
			:visible.sync="detailVisible"
		>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="基本信息" name="first">
					<div>
						<el-row>
							<el-col :span="4" class="_item-name">Code:</el-col>
							<el-col :span="8" class="_item-value">{{addData.code || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">微信:</el-col>
							<el-col :span="8" class="_item-value">{{addData.wxId || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">身份:</el-col>
							<el-col :span="8" class="_item-value">{{addData.kolTypeName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">姓名:</el-col>
							<el-col :span="8" class="_item-value">{{addData.kolName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">微信名:</el-col>
							<el-col :span="8" class="_item-value">{{addData.wxName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">管理人:</el-col>
							<el-col :span="8" class="_item-value">{{addData.manageByName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">是否启用:</el-col>
							<el-col :span="8" class="_item-value">{{addData.kolStatusName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">备注:</el-col>
							<el-col :span="8" class="_item-value">{{addData.note || '暂无'}}</el-col>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane label="账户" name="second">
					<el-form :inline="true" size="mini" v-if="addData.kolType == 'other'" >
						<el-form-item label="">
							<el-select :style="{width:'200px'}" class="mr10" v-model="accountType" filterable placeholder="请选择账户类型">
								<el-option v-for="item in accountTypeList" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></el-option>
							</el-select>
							<el-button class="el-icon-circle-plus-outline" @click="addPayWay"  type="primary">添加账户</el-button>
						</el-form-item>
					</el-form>
					<el-card class="box-card box-cardTe mb20" :class="item.payStatus == '1'?'disabled':''"  size="mini"  v-for="(item,i) in menteeList" :key="item.pkId">
						<div class="mb20" style="display:flex;justify-content:space-between">
							<div>
								<el-tag size="" type="danger" v-if="i == '0' && item.payStatus == '0' && item.priority == '1'">默认支付方式</el-tag>
							</div>
							<div style="">
								<el-button size="mini" type="success" v-if="addData.kolType == 'other' && (item.payStatus == '0' && item.priority == '0' )  " @click="defaultItem(item)">设为默认</el-button>
								<el-button size="mini" type="primary" v-if="addData.kolType == 'other'" @click="editItme(i)">编辑</el-button>
								<el-button size="mini" type="warning" v-if="addData.kolType == 'other' && item.payStatus == '0'" @click="warningItem(item)">禁用</el-button>
								<el-button size="mini" type="success" v-if="addData.kolType == 'other' && item.payStatus == '1'" @click="successItem(item)">启用</el-button>
								<el-button size="mini" type="danger" v-if="addData.kolType == 'other'" @click="deleteItme(item)">删除</el-button>
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
				</el-tab-pane>
        <el-tab-pane label="转介绍学生" name="tired">
					<div>
            <el-card box-card box-cardTe size="mini" class="mb20" v-for="(item,i) in menteeArr" :key="item.menteeId">
              <el-col :span="4" class="_item-name">学员ID:</el-col>
							<el-col :span="8" class="_item-value">{{item.menteeId || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">学员名:</el-col>
							<el-col :span="8" class="_item-value">{{item.menteeName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">微信ID:</el-col>
							<el-col :span="8" class="_item-value">{{item.wxId || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">有效咨询:</el-col>
							<el-col :span="8" class="_item-value">{{item.effectiveConsultingName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">是否签约:</el-col>
							<el-col :span="8" class="_item-value">{{item.signStatusName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">专业:</el-col>
							<el-col :span="8" class="_item-value">{{item.majorName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">毕业年份:</el-col>
							<el-col :span="8" class="_item-value">{{item.finishYear || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">顾问名称:</el-col>
							<el-col :span="8" class="_item-value">{{item.counselorName || '暂无'}}</el-col>
              <el-col :span="4" class="_item-name">分配顾问日期:</el-col>
							<el-col :span="8" class="_item-value">{{item.counselorDate || '暂无'}}</el-col>
              <el-col :span="4" class="_item-name">首次联系日期:</el-col>
							<el-col :span="8" class="_item-value">{{item.firstAskDate || '暂无'}}</el-col>
            </el-card>
					</div>
				</el-tab-pane>
        <el-tab-pane label="KOL返佣申请" name="fourth">
					<div>
            <el-card box-card box-cardTe size="mini" class="mb20" v-for="(item,i) in applyArr" :key="item.applyId">
              <el-col :span="4" class="_item-name">申请ID:</el-col>
							<el-col :span="8" class="_item-value">{{item.applyId || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">申请状态:</el-col>
							<el-col :span="8" class="_item-value">{{item.applyStatusName || '暂无'}}</el-col>
							<el-col :span="4" class="_item-name">创建人:</el-col>
							<el-col :span="8" class="_item-value">{{item.createByName || '暂无'}}</el-col>
              <el-col :span="12" v-for="(itemNew,j) in JSON.parse(item.content).text" :key="j">
                <el-col :span="8" class="_item-name">{{itemNew.label}}:</el-col>
                <el-col :span="16" class="_item-value">{{itemNew.value || '暂无'}}</el-col>
              </el-col>
            </el-card>
					</div>
				</el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer">
				<div v-if="activeName == 'first'">
					<el-button @click="deleteKolDetail" type="danger">删 除</el-button>
					<el-button @click="editKol" type="primary" >编 辑</el-button>
					<el-button @click="newClose" >取 消</el-button>
				</div>
			</div>
		</el-dialog>
		</el-dialog>
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      title="Company Account"
      :visible.sync="usAccountVisible"
      :before-close="beforePayWayItemClose"
    >
      <el-form :inline="true" label-width="220px">

        <el-form-item label="Account Type：">
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
          <!-- <div :style="{width:'200px'}">{{mentorData.company}}</div> -->
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
		<editKol :editVisible="editVisible" :data="data" @close="closeKol" @submit="submitKol" />
	</div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd'
import api2 from '@/api/sales_assistant.js'
import api3 from '@/api/vip.js'
import util from '@/libs/util'
import editKol from './editKol.vue'
export default {
  components: { editKol },
  mixins: [mixins],
  name: 'addKol',
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    kolId: {}
  },
  watch: {
    detailVisible: function (newData) {
      if (newData) {
        this.toPage()
      }
    }
  },
  data () {
    return {
      addData: {},
      activeName: 'first',
      editVisible: false,
      data: {},
      settings: {
        height: 150,
        data: [],
        copyable: false,
        fillHandle: false,
        rowHeaders: true,
        stretchH: 'all',
        manualColumnResize: true,
        colHeaders: [
          '操作',
          '付款类型',
          '账户',
          '银行',
          '收款人姓名',
          '收款人身份证号',
          'Bank Address',
          'ZIP',
          'Routing Number',
          'Swift Code',
          // `备注`,
          '优先顺序',
          '账户状态',
          '创建人',
          '创建时间',
          '最近更新人',
          '最近更新时间'
        ],
        readOnly: true,
        afterChange: (change, v) => {
          if (!change) return
          change.forEach(([col, row, old, newData]) => {
            console.log(newData)
            if (
              old !== newData &&
              (row === 'currencyType' ||
                row === 'revenue' ||
                row === 'exchangeRate')
            ) {
              let totalInCny = 0
              if (this.settings.data[col].currencyType == '美金') {
                totalInCny =
                  this.settings.data[col].revenue *
                  this.settings.data[col].exchangeRate
              } else {
                totalInCny = this.settings.data[col].revenue
              }
              totalInCny = Math.round(totalInCny * 10) / 10
              this.$refs.settings.$data.hotInstance.setDataAtRowProp(
                col,
                'totalInCny',
                totalInCny
              )
            }

            // 保存更新数据
            if (old !== newData && !!this.settings.data[col].pkId) {
              // uptList
              let haspkId = false
              this.payWaySubmitList.uptList.forEach((v, i, arr) => {
                if (this.settings.data[col].pkId == v.pkId) {
                  v[row] = newData
                  haspkId = true
                }
              })
              if (!haspkId) {
                const item = {
                  pkId: this.settings.data[col].pkId
                }
                item[row] = newData
                this.payWaySubmitList.uptList.push(item)
              }
            }
          })
        }
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
      accountData: {},
      menteeArr: [],
      applyArr: []
    }
  },
  created () {
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.accountTypeList = await this.getDictionary('mentor_pay_type')
    },
    toPage () {
      api.detailKol(this.kolId).then(res => {
        console.log(res.data)
        this.addData = res.data
      })
      api.menteeArr(this.kolId).then(res => {
        console.log(res.data, 111)
        this.menteeArr = res.data
      })
      api.applyArr(this.kolId).then(res => {
        console.log(res.data, 222)
        this.applyArr = res.data
      })
    },
    newClose () {
      this.addData = {}
      this.activeName = 'first'
      this.menteeArr = []
      this.applyArr = []
      this.$emit('close')
    },
    deleteKolDetail () {
      this.$confirm('此操作将永久删除该KOL, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteKol(this.addData.kolId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.addData = {}
          this.activeName = 'first'
          this.menteeArr = []
          this.applyArr = []
          this.$emit('success')
        })
      })
    },
    editKol () {
      this.data = JSON.parse(JSON.stringify(this.addData))
      this.editVisible = true
    },
    closeKol () {
      this.activeName = 'first'
      this.data = {}
      this.menteeArr = []
      this.applyArr = []
      this.editVisible = false
    },
    submitKol () {
      this.activeName = 'first'
      this.data = {}
      this.menteeArr = []
      this.applyArr = []
      this.editVisible = false
      this.toPage()
      this.$emit('success')
    },
    handleClick (tab, event) {
      if (tab.name == 'second') {
        this.Topage()
      }
      console.log(tab, event)
    },
    Topage () {
      if (this.addData.kolType == 'other') {
        api.getKolPayList(this.addData.kolId).then(res => {
          console.log(res.data)
          this.menteeList = JSON.parse(JSON.stringify(res.data))
          console.log('学员支付账户列表', res)
          this.settings.data = []
          this.settings.data = res.data
        })
      } else if (this.addData.kolType == 'mentor') {
        api3.getCooperatorPaymentListByCooperatorIdNew(this.addData.mentorId).then(res => {
          this.menteeList = res.data.rows
          console.log('导师支付账户列表', res)
          this.settings.data = []
          this.settings.data = res.data.rows
        })
      } else if (this.addData.kolType == 'mentee') {
        api2.getMenteePaymentList(this.addData.menteeId).then(res => {
          this.menteeList = JSON.parse(JSON.stringify(res.data))
          console.log('学员支付账户列表', res)
          this.settings.data = []
          this.settings.data = res.data
        })
      }
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
      // this.settings.data.push({
      //   pkId: null
      // });
      console.log(this.accountType)
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
        api.deleteKolPay(row.pkId).then(res => {
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
          // this.check(res)
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
      data.kolId = this.kolId
      api.editKolPay(data).then(res => {
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
        data.priority = '1'
        data.kolId = this.kolId
        console.log(data)
        api.addKolPay(data).then(res => {
          console.log(res)
          this.Topage()
          this.beforePayWayItemClose()
          // this.check(res)
          this.$message({
            type: 'success',
            message: '账户添加成功'
          })
        })
      }).catch(() => {
        const data = this.accountData
        data.kolId = this.kolId
        console.log(data)
        api.addKolPay(data).then(res => {
          console.log(res)
          this.Topage()
          this.beforePayWayItemClose()
          // this.check(res)
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
        data.kolId = this.kolId
        const dataNew = data
        api.editKolPay(dataNew).then(res => {
          console.log(res)
          this.Topage()
          // this.check(res)
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
        data.kolId = this.kolId
        const dataNew = data
        console.log(dataNew)
        api.editKolPay(dataNew).then(res => {
          console.log(res)
          this.Topage()
          // this.check(res)
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
        data.kolId = this.kolId
        const dataNew = data
        console.log(dataNew)
        api.editKolPay(dataNew).then(res => {
          console.log(res)
          this.Topage()
          // this.check(res)
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
  .box-card.disabled {
    background-color: #DCDFE6;
  }
</style>
