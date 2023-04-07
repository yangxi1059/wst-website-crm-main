<!--
 * @Author: 杨曦
 * @Date: 2022-08-23 13:38:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-01 14:39:59
 * @Version:
 * @Description:
-->
<template>
  <div class="pay-way">
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
      <el-table :data="tableData">
        <el-table-column  width='150' prop label="操作">
          <template  slot-scope="scope">
            <el-button size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button size="mini" @click="payWaySubmit(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="publicOrPrivateName" width="75" label="publicOrPrivate" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="paymentTypeName" label="付款类型" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="payAcc" label="账户" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="bankName" label="银行" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="realName" label="收款人姓名" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="idCard" label="收款人身份证号" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="bankAddress" label="Bank Address" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="zip" label="ZIP" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="routingNumber" label="Routing Number" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="swiftCode" label="Swift Code" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="cc" label="CC" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="nationalId" label="National ID" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="iban" label="Iban" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="bsb" label="Bsb" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="priority" label="优先顺序" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="payStatus" label="账户状态" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="updateByName" label="最近更新人" show-overflow-tooltip></el-table-column>
        <el-table-column min-width='100px' prop="updateTime" label="最近更新时间" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        title="银行卡账户详情"
        :visible.sync="bankVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :model="accountData" :rules="rules" ref="ruleForm" :inline="true" label-width="120px">
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
          <el-form-item label="卡号：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="开户行：" prop="bankName">
            <el-input v-model="accountData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="身份证：" prop="idCard">
            <el-input v-model="accountData.idCard"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        title="Company Account"
        :visible.sync="usAccountVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="220px">
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
          <el-form-item label="Account Number：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="Bank Name：" prop="bankName">
            <el-input v-model="accountData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="Bank Address：" prop="bankAddress">
            <el-input v-model="accountData.bankAddress"></el-input>
          </el-form-item>
          <el-form-item label="Full Name：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="ZIP：" prop="zip">
            <el-input v-model="accountData.zip"></el-input>
          </el-form-item>
          <el-form-item label="Routing Number：" prop="routingNumber">
            <el-input v-model="accountData.routingNumber"></el-input>
          </el-form-item>
          <el-form-item label="Swift Code：" prop="swiftCode">
            <el-input v-model="accountData.swiftCode"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        title="Canada Company Account"
        :visible.sync="cAccountVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="220px">
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
          <el-form-item label="Account Number：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="Bank Name：" prop="bankName">
            <el-input v-model="accountData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="Bank Address：" prop="bankAddress">
            <el-input v-model="accountData.bankAddress"></el-input>
          </el-form-item>
          <el-form-item label="Full Name：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="ZIP：" prop="zip">
            <el-input v-model="accountData.zip"></el-input>
          </el-form-item>
          <el-form-item label="Routing Number：" prop="routingNumber">
            <el-input v-model="accountData.routingNumber"></el-input>
          </el-form-item>
          <el-form-item label="Swift Code：" prop="swiftCode">
            <el-input v-model="accountData.swiftCode"></el-input>
          </el-form-item>
          <el-form-item label="C C：" prop="cc">
            <el-input v-model="accountData.cc"></el-input>
          </el-form-item>
          <el-form-item label="National ID：" prop="nationalId">
            <el-input v-model="accountData.nationalId"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        title="UK Company Account"
        :visible.sync="ukAccountVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="220px">
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
          <el-form-item label="Account Number：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="Bank Name：" prop="bankName">
            <el-input v-model="accountData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="Bank Address：" prop="bankAddress">
            <el-input v-model="accountData.bankAddress"></el-input>
          </el-form-item>
          <el-form-item label="Full Name：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="ZIP：" prop="zip">
            <el-input v-model="accountData.zip"></el-input>
          </el-form-item>
          <el-form-item label="Routing Number：" prop="routingNumber">
            <el-input v-model="accountData.routingNumber"></el-input>
          </el-form-item>
          <el-form-item label="Swift Code：" prop="swiftCode">
            <el-input v-model="accountData.swiftCode"></el-input>
          </el-form-item>
          <el-form-item label="Iban：" prop="iban">
            <el-input v-model="accountData.iban"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        title="Australia Company Account"
        :visible.sync="aAccountVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="220px">
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
          <el-form-item label="Account Number：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="Bank Name：" prop="bankName">
            <el-input v-model="accountData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="Bank Address：" prop="bankAddress">
            <el-input v-model="accountData.bankAddress"></el-input>
          </el-form-item>
          <el-form-item label="Full Name：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="ZIP：" prop="zip">
            <el-input v-model="accountData.zip"></el-input>
          </el-form-item>
          <el-form-item label="Routing Number：" prop="routingNumber">
            <el-input v-model="accountData.routingNumber"></el-input>
          </el-form-item>
          <el-form-item label="Swift Code：" prop="swiftCode">
            <el-input v-model="accountData.swiftCode"></el-input>
          </el-form-item>
          <el-form-item label="Bsb" prop="bsb">
            <el-input v-model="accountData.bsb"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        title="Australia Company Account"
        :visible.sync="singaporeAccountVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="220px">
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
          <el-form-item label="Account Number：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="Bank Name：" prop="bankName">
            <el-input v-model="accountData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="Bank Address：" prop="bankAddress">
            <el-input v-model="accountData.bankAddress"></el-input>
          </el-form-item>
          <el-form-item label="Full Name：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="ZIP：" prop="zip">
            <el-input v-model="accountData.zip"></el-input>
          </el-form-item>
          <el-form-item label="Swift Code：" prop="swiftCode">
            <el-input v-model="accountData.swiftCode"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
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
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        :title="accountData.paymentType + '账户详情'"
        :visible.sync="aliPayVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="120px">
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
          <el-form-item label="账号/邮箱：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="realName">
            <el-input v-model="accountData.realName"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
      <el-dialog append-to-body :close-on-click-modal="false"
        width="1000px"
        :title="accountData.paymentType + '账户详情'"
        :visible.sync="wxPayVisible"
        :before-close="beforePayWayItemClose"
      >
        <el-form :inline="true" :model="accountData" :rules="rules" ref="ruleForm" label-width="120px">
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
          <el-form-item label="ID：" prop="payAcc">
            <el-input v-model="accountData.payAcc"></el-input>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select
              :style="{width:'180px'}"
              v-model="accountData.priority"
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态：" prop="payStatus">
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
import api from '@/api/bd.js'
import mixins from '@/plugin/mixins'
export default {
  name: 'payWay',
  mixins: [mixins],
  props: {
    payAccountVisible: {
      type: Boolean,
      default: false
    },
    cooperatorId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      payWayList: [],
      tableData: [],
      accountType: null,
      accountTypeList: [],
      rules: {
        publicOrPrivate: [{ required: true, message: '必填', trigger: 'blur' }],
        paymentType: [{ required: true, message: '必填', trigger: 'blur' }],
        payAcc: [{ required: true, message: '必填', trigger: 'blur' }],
        bankName: [{ required: true, message: '必填', trigger: 'blur' }],
        bankAddress: [{ required: true, message: '必填', trigger: 'blur' }],
        swiftCode: [{ required: true, message: '必填', trigger: 'blur' }],
        zip: [{ required: true, message: '必填', trigger: 'blur' }],
        cc: [{ required: true, message: '必填', trigger: 'blur' }],
        iban: [{ required: true, message: '必填', trigger: 'blur' }],
        bsb: [{ required: true, message: '必填', trigger: 'blur' }],
        nationalId: [{ required: true, message: '必填', trigger: 'blur' }],
        routingNumber: [{ required: true, message: '必填', trigger: 'blur' }],
        recipientAddress: [{ required: true, message: '必填', trigger: 'blur' }],
        realName: [{ required: true, message: '必填', trigger: 'blur' }],
        idCard: [{ required: true, message: '必填', trigger: 'blur' }],
        priority: [{ required: true, message: '必填', trigger: 'blur' }],
        payStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      bankVisible: false,
      aliPayVisible: false,
      wxPayVisible: false,
      venmoVisible: false,
      boaVisible: false,
      usAccountVisible: false,
      cAccountVisible: false,
      ukAccountVisible: false,
      aAccountVisible: false,
      payment_public_or_private: [],
      singaporeAccountVisible: false,
      accountData: {
        userId: '',
        publicOrPrivate: 'private',
        paymentType: '',
        payAcc: '',
        bankName: '',
        bankAddress: '',
        swiftCode: '',
        zip: '',
        cc: '',
        iban: '',
        bsb: '',
        nationalId: '',
        routingNumber: '',
        recipientAddress: '',
        realName: '',
        idCard: '',
        priority: '',
        payStatus: ''
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {

  },
  methods: {
    async pageInit () {
      this.payment_public_or_private = await this.getDictionary('payment_public_or_private')
      console.log(this.payment_public_or_private,3333333333333333333333333333,)
      this.accountTypeList = await this.getDictionary('mentor_pay_type')
    },
    init () {
      this.getCooperatorPaymentListByCooperatorIdNew()
    },
    getCooperatorPaymentListByCooperatorIdNew () {
      api
        .getCooperatorPaymentListByCooperatorIdNew(this.cooperatorId)
        .then((res) => {
          console.log('导师支付账户列表yx2222222222222222222', res)
          this.tableData = []
          this.tableData = res.data
        })
    },
    beforePayWayClose () {
      this.$emit('close')
      this.tableData = []
      this.accountType = null
    },
    payWaySubmit (data) {
      api
        .deleteCommonPaymentNew(data.accountId)
        .then((res) => {
          console.log('提交支付账户后', res)
          this.$message({
            type: 'success',
            message: '账户删除成功'
          })
          this.init()
        })
        .catch((err) => {
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
      this.accountData.paymentType = this.accountType 
      console.log(this.accountType,this.accountData)
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
        case 'hk_company_account':
          {
            this.usAccountVisible = true
          }
          break
        case 'uk_account':
          {
            this.ukAccountVisible = true
          }
          break
        case 'canada_account':
          {
            this.cAccountVisible = true
          }
          break
        case 'australia_account':
          {
            this.aAccountVisible = true
          }
          break
        case 'singapore-account':
          {
            this.singaporeAccountVisible = true
          }
          break
        default :
        {
          this.$message({
            type: 'warning',
            message: '暂不支持'
          })
          break
        }
      }
    },
    editItem (i) {
      console.log(i)
      this.accountData = i
      const type = i.paymentType
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
        case 'hk_company_account':
          {
            this.usAccountVisible = true
          }
          break
        case 'uk_account':
          {
            this.ukAccountVisible = true
          }
          break
        case 'canada_account':
          {
            this.cAccountVisible = true
          }
          break
        case 'australia_account':
          {
            this.aAccountVisible = true
          }
          break
        case 'singapore-account':
          {
            this.singaporeAccountVisible = true
          }
          break
      }
    },
    uptPayWay () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.accountData.userId = this.cooperatorId
          const data = this.accountData
          api.uptCommonPaymentNew(data).then((res) => {
            console.log(res)
            this.init()
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
        if (valid) {
          this.accountData.userId = this.cooperatorId
          const data = this.accountData
          console.log(data)
          api.setCommonPaymentNew(data).then((res) => {
            console.log(res)
            this.init()
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
      this.accountData = {
        userId: '',
        publicOrPrivate: 'private',
        paymentType: '',
        payAcc: '',
        bankName: '',
        bankAddress: '',
        swiftCode: '',
        zip: '',
        cc: '',
        iban: '',
        bsb: '',
        nationalId: '',
        routingNumber: '',
        recipientAddress: '',
        realName: '',
        idCard: '',
        priority: '',
        payStatus: ''
      }
      this.bankVisible = false
      this.wxPayVisible = false
      this.aliPayVisible = false
      this.usAccountVisible = false
      this.cAccountVisible = false
      this.ukAccountVisible = false
      this.aAccountVisible = false
      this.singaporeAccountVisible = false
    }
  }
}
</script>
