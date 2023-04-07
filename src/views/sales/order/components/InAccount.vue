<!--
 * @Author: Kaan
 * @Date: 2022-05-09 09:20:27
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-02 16:45:56
 * @version:
 * @Descripttion:
-->

<template>
  <div >
    <el-drawer
      title="入账申请"
      v-loading = "loading"
      v-if="roleInfo.includes(`order_account`)"
      :visible.sync="accountVisible"
      :before-close="close"
      :close-on-click-modal="true"
      :size="'1200px'"
    >
      <div class="in_account">
        <el-descriptions title="订单信息一览" :column="3">
          <el-descriptions-item label="订单号">{{Account.orderId}}</el-descriptions-item>
          <el-descriptions-item label="学员">{{Account.realName}}</el-descriptions-item>
          <el-descriptions-item label="签约日期">{{Account.signDate}}</el-descriptions-item>
          <el-descriptions-item label="订单金额">{{Account.orderPrice}}</el-descriptions-item>
          <el-descriptions-item label="确认到账">{{Account.receivedAmount}}</el-descriptions-item>
          <el-descriptions-item label="订单付款">{{Account.payStatusStr}}</el-descriptions-item>
          <el-descriptions-item label="BD渠道">{{Account.cooperatorName}}<el-button style="padding:0px" class="ml10" v-if="roleInfo.includes(`order_setSourceChannel`)" @click="setSourceChannel" type="text">设置</el-button></el-descriptions-item>
          <el-descriptions-item v-if="Account.pretalkId" label="Pretalk">
            <span v-if="Account.pretalkId">{{Account.codes}}({{Account.pretalkTypeName}})</span>
            <span v-else>无</span>
            <el-button class="ml10"  style="padding:0px" v-if="roleInfo.includes(`order_setPretalk`)" @click="setPretalk" type="text">设置</el-button></el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="in_account">
        <el-tabs v-model="accountTab" type="card" @tab-click="handleClick">
          <el-tab-pane label="入账/退款" name="1">
            <div class="mb10">
              <el-button class="el-icon-circle-plus-outline" @click="perfectOrder">入账申请</el-button>
              <el-button
                class="el-icon-circle-plus-outline"
                @click="refund"
                v-if="Account.receivedAmount"
              >退款申请</el-button>
            </div>
            <el-card
              :class="{mb20:true, bgcG:item.billType === 'entry', bgcR:item.billType === 'refund'}"
              v-for="(item,i) in inAccountList"
              :key="i"
            >
              <el-descriptions title="" :column="3">
                <el-descriptions-item :label="`${item.billType === 'refund' ? '出账' : '入账'}时间`">
                  {{item.revenueDate || '无'}}</el-descriptions-item>
                <el-descriptions-item label="收款金额类型">
                  {{item.revenueType || '无'}}</el-descriptions-item>
                <el-descriptions-item label="收款金额">
                  {{item.receivedAmount || '无'}}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <span class="bgcW">{{item.applyStatusStr || '无'}}</span></el-descriptions-item>
                <el-descriptions-item :label="`${item.billType === 'refund' ? '出账' : '入账'}账号`">
                  {{item.account || '无'}}</el-descriptions-item>
                <el-descriptions-item label="付款人姓名">
                  {{item.transfer || '无'}}</el-descriptions-item>
                <el-descriptions-item label="确认到账金额" v-if="item.actualAmount">
                  {{(item.currencyType||'') + ' ' +item.actualAmount}}</el-descriptions-item>
                <el-descriptions-item :label="`${item.billType === 'refund' ? '出账' : '入账'}说明`">
                  {{item.remark || '无'}}</el-descriptions-item>
                <el-descriptions-item :label="`此笔${item.billType === 'refund' ? '出账' : '入账'}实时汇率`">
                  {{item.exchangeRate || '无'}}</el-descriptions-item>
                <el-descriptions-item label="等额人民币 （￥）">
                  {{item.totalInCny || '无'}}</el-descriptions-item>
                <el-descriptions-item label="审核人" :span="2">
                  <p v-for="(v,j) in item.approvalList" :key="j">
                    {{v.approverName}}
                    <span
                      :class="{'colorG':v.approveStatus==1,'colorR':v.approveStatus==2}"
                    >{{v.approveStatusStr}}</span>
                    {{v.approveTime}}
                    {{v.msg}}
                  </p>
                </el-descriptions-item>
                <el-descriptions-item label="凭证">
                  <el-button
                    size="mini"
                    v-for="(v,j) in item.voucher"
                    :key="j"
                    @click="download(v.voucherPath)"
                  >{{v.voucherName}}</el-button>
                </el-descriptions-item>
                <!-- <el-descriptions-item label="申请中" v-if="item.confirmStatus === '申请中'">
                  <el-button size="mini" @click="recall">撤回</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="未通过" v-if="item.confirmStatus === '未通过'">
                  <el-button size="mini" @click="reapply">重新申请</el-button>
                </el-descriptions-item> -->
              </el-descriptions>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="发票" name="2">
            <el-card class="mb20">
              <el-form
                size="mini"
                :model="invoiceTitle"
                :rules="rules"
                ref="invoiceTitle"
                label-width="140px"
              >
                <el-form-item label="发票类型：" prop="invoiceType">
                  <el-radio-group @change="changeInvoiceType" :disabled="setInvoice" v-model="invoiceTitle.invoiceType">
                    <el-radio v-for="item in invoice_type"
                      :key="item.itemValue"
                      :label="item.itemValue"
                    >{{item.itemName}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="开票方式" prop="invoiceMode">
                  <el-radio-group :disabled="setInvoice || invoiceTitle.invoiceType == 'VAT_special_invoice'" v-model="invoiceTitle.invoiceMode">
                    <el-radio  v-for="item in invoice_mode"
                    :key="item.itemValue"
                    :label="item.itemValue"
                  >{{item.itemName}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="姓名/公司抬头：" prop="invoiceTitle">
                  <el-input
                    :disabled="setInvoice"
                    :style="{width: widths}"
                    v-model="invoiceTitle.invoiceTitle"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="身份证号/税号：" prop="invoiceAccount">
                  <el-input
                    :disabled="setInvoice"
                    :style="{width: widths}"
                    v-model="invoiceTitle.invoiceAccount"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="发票地址：" prop="invoiceAddr">
                  <el-input
                    :disabled="setInvoice"
                    :style="{width: widths}"
                    v-model="invoiceTitle.invoiceAddr"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="发票电话：" prop="invoicePhone">
                  <el-input
                    :disabled="setInvoice"
                    :style="{width: widths}"
                    v-model="invoiceTitle.invoicePhone"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item label="开户行：" prop="invoiceBank">
                  <el-input
                    :disabled="setInvoice"
                    :style="{width: widths}"
                    v-model="invoiceTitle.invoiceBank"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="开户行账号：" prop="invoiceBankAccount">
                  <el-input
                    :disabled="setInvoice"
                    :style="{width: widths}"
                    v-model="invoiceTitle.invoiceBankAccount"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="invoiceTitle.invoiceMode == 'paper'" label="收件人名：" prop="recipientName">
                  <el-input :disabled="setInvoice" :style="{width: widths}" v-model="invoiceTitle.recipientName"></el-input>
                </el-form-item>
                <el-form-item v-if="invoiceTitle.invoiceMode == 'paper'" label="收件人电话：" prop="recipientPhone">
                  <el-input :disabled="setInvoice" :style="{width: widths}" v-model="invoiceTitle.recipientPhone"></el-input>
                </el-form-item>
                <el-form-item v-if="invoiceTitle.invoiceMode == 'paper'" label="收件人地址：" prop="recipientAddr">
                  <el-input :disabled="setInvoice" :style="{width: widths}" v-model="invoiceTitle.recipientAddr"></el-input>
                </el-form-item>
                 <el-form-item v-if="invoiceTitle.invoiceMode == 'electronic'" label="收件邮箱：" prop="recipientEmail">
                  <el-input :disabled="setInvoice" :style="{width: widths}" v-model="invoiceTitle.recipientEmail"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button v-if="setInvoice" class="el-icon-edit" @click="setInvoice = false" type="primary" >编辑发票抬头</el-button>
                  <el-button v-if="!setInvoice"  @click="setInvoice = true" type="danger" >取消</el-button>
                  <el-button v-if="!setInvoice" class="el-icon-edit" @click="submitInvoiceTitle" type="primary">提交发票抬头</el-button>
                  <template v-if="setInvoice">
                    <el-button class="el-icon-circle-plus-outline" @click="chooseApplyRecipient" v-if="!applyInvoice" type="primary" >发票申请</el-button>
                    <el-button class="el-icon-circle-plus-outline" v-else @click="toApplyRecipient" type="primary" >确认选择</el-button>
                  </template>
                </el-form-item>
              </el-form>
              <el-card class="mt20" v-for="(item,i) in invoiceList" :key="i">
                <el-row>
                  <el-col :span="3" class="_item-name">发票类型：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceTypeName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">开票公司：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceCompanyName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">开票方式：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceModeName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">姓名/公司抬头：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceTitle || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">身份证号/税号：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceAccount || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">发票地址：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceAddr || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">发票电话：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoicePhone || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">开户行：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceBank || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">开户行账号：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceBankAccount || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">发票金额：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceFund || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">是否开票：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceStatusName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">是否寄出：</el-col>
                  <el-col :span="3" class="_item-value">{{item.isSendName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">开票人：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceByName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">开票时间：</el-col>
                  <el-col :span="3" class="_item-value">{{item.invoiceTime || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">收件人姓名：</el-col>
                  <el-col :span="3" class="_item-value">{{item.recipientName || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">收件人电话：</el-col>
                  <el-col :span="3" class="_item-value">{{item.recipientPhone || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">收件地址：</el-col>
                  <el-col :span="3" class="_item-value">{{item.recipientAddr || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">收件邮箱：</el-col>
                  <el-col :span="3" class="_item-value">{{item.recipientEmail || '无'}}</el-col>
                  <el-col :span="3" class="_item-name">备注：</el-col>
                  <el-col :span="3" class="_item-value">{{item.remark || '无'}}</el-col>
                  <el-col :span="3" :offset="15">
                    <el-button size="mini" type="primary" @click="editInvoice(item.invoiceStatus)">编辑</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-card>
            <div v-if="applyInvoice">
              <el-card
                :class="{mb20:true, bgcG:item.billType === 'entry', bgcR:item.billType === 'refund'}"
                v-for="(item,i) in inAccountList"
                :key="i"
              >
                <div >
                  <el-checkbox
                    v-model="item.choose"
                    :disabled="item.applyStatus !== '2'|| item.billType === 'refund' || item.revenueType !== 'cny' || !!item.invoiceId"
                  ></el-checkbox>
                  <el-tag type="warning" style="margin-left:20px" v-if="item.invoiceId">已开过此发票</el-tag>
                  <el-tag type="warning" style="margin-left:20px" v-else-if="item.applyStatus !== '2'">审核待通过</el-tag>
                  <el-tag type="warning" style="margin-left:20px" v-else-if="item.billType === 'refund'">入账类型不支持开票</el-tag>
                  <el-tag type="warning" style="margin-left:20px" v-else-if="item.revenueType.toLowerCase() !== 'cny'">入账货币类型不支持开票</el-tag>
                </div>
                <el-descriptions title="" :column="3">
                  <el-descriptions-item :label="`${item.billType === 'refund' ? '出账' : '入账'}时间`">
                    {{item.revenueDate || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="收款金额类型">
                    {{item.revenueType || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="收款金额">
                    {{item.receivedAmount || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <span class="bgcW">{{item.applyStatusStr || '无'}}</span></el-descriptions-item>
                  <el-descriptions-item :label="`${item.billType === 'refund' ? '出账' : '入账'}账号`">
                    {{item.account || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="付款人姓名">
                    {{item.transfer || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="确认到账金额" v-if="item.actualAmount">
                    {{(item.currencyType||'') + ' ' +item.actualAmount}}</el-descriptions-item>
                  <el-descriptions-item :label="`${item.billType === 'refund' ? '出账' : '入账'}说明`">
                    {{item.remark || '无'}}</el-descriptions-item>
                  <el-descriptions-item :label="`此笔${item.billType === 'refund' ? '出账' : '入账'}实时汇率`">
                    {{item.exchangeRate || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="等额人民币 （￥）">
                    {{item.totalInCny || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="审核人" :span="2">
                    <p v-for="(v,j) in item.approvalList" :key="j">
                      {{v.approverName}}
                      <span
                        :class="{'colorG':v.approveStatus==1,'colorR':v.approveStatus==2}"
                      >{{v.approveStatusStr}}</span>
                      {{v.approveTime}}
                      {{v.msg}}
                    </p>
                  </el-descriptions-item>
                  <el-descriptions-item label="凭证">
                    <el-button
                      size="mini"
                      v-for="(v,j) in item.voucher"
                      :key="j"
                      @click="download(v.voucherPath)"
                    >{{v.voucherName}}</el-button>
                  </el-descriptions-item>
                  <!-- <el-descriptions-item label="申请中" v-if="item.confirmStatus === '申请中'">
                    <el-button size="mini" @click="recall">撤回</el-button>
                  </el-descriptions-item>
                  <el-descriptions-item label="未通过" v-if="item.confirmStatus === '未通过'">
                    <el-button size="mini" @click="reapply">重新申请</el-button>
                  </el-descriptions-item> -->
                </el-descriptions>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="BD返佣" name="3">
            <el-button type="primary" class="mb10" @click="bd">返佣申请</el-button>
            <el-card v-for="(bItem ,i) in bdBrokerageList" :key="i" >
              <div @click="showBdDetail(bItem)">
                <el-descriptions :column="3">
                  <template slot="title">
                    <p>{{bItem.applyTitle}}</p>
                  </template>
                  <el-descriptions-item label="学员姓名">
                    {{bItem.menteeName || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="货币类型">
                    {{bItem.fundType || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="返佣金额">
                    {{bItem.fundWage || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="申请人">
                    {{bItem.applyBy || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="申请状态">
                    {{bItem.applyStatus || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="申请时间">
                    {{bItem.applyTime || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="签约日期">
                    {{bItem.signDate || '无'}}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Pretalk返佣" name="4">
            <div v-if="Account.pretalkId">
              <el-button type="primary" class="mb10" @click="pretalk">返佣申请</el-button>
              <div v-for="(pItem ,i) in pretalkBrokerageList" :key="i">
                <el-descriptions :column="3">
                  <template slot="title">
                    <p>{{pItem.applyTitle}}</p>
                  </template>
                  <el-descriptions-item label="学员姓名">
                    {{pItem.menteeName || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="签约时间">
                    {{pItem.signDate || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="金额">
                    {{pItem.fundType}}{{pItem.fundWage}}</el-descriptions-item>
                  <el-descriptions-item label="审核状态">
                    {{pItem.applyStatus || '无'}}</el-descriptions-item>
                  <el-descriptions-item label="审核人">
                    {{pItem.applyBy}}</el-descriptions-item>
                  <el-descriptions-item label="审核时间">
                    {{pItem.applyTime}}</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <el-dialog
      :title="'完善订单信息'"
      :visible.sync="orderDetailVisible"
      :before-close="orderDetailClose"
      :close-on-click-modal="false"
      v-loading = "loading2"
      width="950px"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="orderDetail"
        :rules="rules"
        ref="orderDetail"
        label-width="180px"
      >
        <el-form-item label="拉群日期：" prop="vipGroupDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            :style="{width:widthHalf}"
            v-model="orderDetail.vipGroupDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <div class="create-cant-program-model components-model">
          <div class="program-model-title">父母情况</div>
          <el-form-item label="职业：" prop="transition.parentJob">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.parentJob"
              :autosize="{ minRows: 3}"
              placeholder="有，请注明公司、职位；  没有，填无。"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="性格类型：" prop="transition.parentPersonality">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.parentPersonality"
              :autosize="{ minRows: 3}"
              placeholder="有，请注明  没有，填无。"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="父母对小孩的期望：" prop="transition.parentExpectation">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.parentExpectation"
              :autosize="{ minRows: 3}"
              placeholder="有，请注明；  没有，填无。"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="对小孩人生的介入程度：" prop="transition.parentControl">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.parentControl"
              :autosize="{ minRows: 3}"
              placeholder="有，请注明；  没有，填无。"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="购买力：" prop="transition.parentPurchasingPower">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.parentPurchasingPower"
              :autosize="{ minRows: 3}"
              placeholder="有，请注明；  没有，填无。"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="create-cant-program-model components-model">
          <div class="program-model-title">学生情况</div>
          <el-form-item label="对行业的了解程度：" prop="transition.menteeIndustryLevel">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.menteeIndustryLevel"
              :autosize="{ minRows: 3}"
              placeholder="有，请注明；  没有，填无。"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="学生心理状态：" prop="transition.menteeMentality">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.menteeMentality"
              :autosize="{ minRows: 3}"
              placeholder="属于佛系还是相对比较积极的状态，or出现极端心理问题请阐述"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="需要后期综合注意的点：" prop="transition.notice">
            <el-input
              :style="{width:widthHalf}"
              type="textarea"
              v-model="orderDetail.transition.notice"
              :autosize="{ minRows: 3}"
              placeholder="老师风格偏好，学生当前申请的进度和资源，付款一半上课不能超过XX节..."
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="create-cant-program-model components-model" v-for="(item,i) in orderDetail.signArr" :key="i">
          <div class="program-model-title">{{item.programName}}</div>
          <el-form-item
            label="Strategist"
            :prop="'signArr.'+i+'.strategist'"
            :rules="rules.strategist"
            v-if="item.signVip == 'Strategist' || item.signVip == 'ALL'"
          >
            <el-select
              :style="{width:widthHalf}"
              v-model="item.strategist"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in VIPList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Program Manager"
            :prop="'signArr.'+i+'.services'"
            :rules="rules.services"
            v-if="item.signVip == 'Program_Manager' || item.signVip == 'ALL'"
          >
            <el-select
              :style="{width:widthHalf}"
              v-model="item.services"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in servicesList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="create-cant-program-model components-model">
          <div class="program-model-title">订单Pretalk</div>
          <div>
            <el-form-item label="" prop="pretalkId">
              <el-radio label="9999" style="" v-model="orderDetail.pretalkId">不绑定</el-radio>
            </el-form-item>
          </div>
          <div v-if="orderDetail.pretalkArr && orderDetail.pretalkArr.length > 0">
            <div style="display:flex" v-for="(item,i) in orderDetail.pretalkArr" :key="i+item.pretalkId">
              <el-form-item  prop="pretalkId">
                <el-radio :style="{width:'420px'}"  :label="item.pretalkId"  v-model="orderDetail.pretalkId">{{item.codes}}【{{item.createByName}} {{item.createTime}}设置】</el-radio>
              </el-form-item>
              <el-form-item label="评价："  :rules="rules.feedbackRemark" :prop="'pretalkArr.'+i+'.feedbackRemark'">
                <el-input
                  :style="{width:widthHalf}"
                  type="textarea"
                  :disabled="!!orderCopy.pretalkArr[i].feedbackRemark"
                  v-model="item.feedbackRemark"
                  :autosize="{ minRows: 2}"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDetailClose">取 消</el-button>
        <el-button type="primary" @click="orderDetailSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="!accountData.pkId?'添加入账':'重新申请'"
      v-if="roleInfo.includes(`order_account`)"
      :visible.sync="addAccountVisible"
      :before-close="addAccountclose"
      :close-on-click-modal="false"
      width="1100px"
    >
      <el-form :inline="true" label-width="130px" :model="accountData" :rules="rules" ref="rule">
        <el-form-item label="入账时间" prop="revenueDate">
          <!-- <div >{{accountData.orderId}}</div> -->
          <el-date-picker
            :style="{width:'180px'}"
            size="mini"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="accountData.revenueDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收款金额类型" prop="revenueType">
          <el-select
            :style="{width:'180px'}"
            size="mini"
            v-model="accountData.revenueType"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'收款金额:' + (accountData.revenueType||'')" prop="revenue">
          <el-input-number
            :style="{width:'180px'}"
            :controls="false"
            size="mini"
            v-model="accountData.revenue"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="入账账号" prop="account">
          <el-select
            :style="{width:'180px'}"
            size="mini"
            v-model="accountData.account"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in accountList"
              :disabled="item.accountStatus == '0'"
              :key="item.accountName"
              :label="item.accountName"
              :value="item.accountName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款人姓名" prop="transfer">
          <el-input :style="{width:'180px'}" size="mini" v-model="accountData.transfer"></el-input>
        </el-form-item>
        <el-form-item label="入账说明" prop="remark">
          <el-select
            :style="{width:'180px'}"
            size="mini"
            v-model="accountData.remark"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['全款',
              '第一笔',
              '第二笔',
              '第三笔',
              '第四笔',
              '第五笔',
              '第六笔',
              '第七笔',
              '第八笔',
              '第九笔',
              '第十笔',
              '尾款']"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="此入账实时汇率" prop="exchangeRate">
          <el-input :style="{width:'180px'}" size="mini" v-model="accountData.exchangeRate"></el-input>
          <div style="font-size:12px;color:#c32e47;line-height:16px" v-if="rateData" >此货币参考入账区间：<span style="color:#c32e47">{{rateData.orderRate1 || '暂无'}}~{{rateData.orderRate2 || '暂无'}}</span></div>
          <!-- <div style="font-size:12px;color:#c32e47;line-height:16px" v-else >此货币参考入账区间：<span style="color:#c32e47">1</span></div> -->
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'180px'}"
            size="mini"
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
        <el-form-item label="等额人民币" :style="{width:'800px'}">
          <el-input-number
            :controls="false"
            :style="{width:'180px'}"
            size="mini"
            v-text="totalPrice"
            disabled
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="已有凭证"
          :style="{width:'800px'}"
          v-if="accountData.voucher && accountData.voucher.length"
        >
          <el-button
            type="text"
            :style="{width:'600px','text-align':'left','margin-left':'180px'}"
            icon="el-icon-download"
            v-for="item in accountData.voucher"
            :key="item.id"
            @click="download(item.voucherPath)"
          >{{item.voucherName}}</el-button>
        </el-form-item>
        <el-form-item label="上传凭证">
          <el-upload
            :http-request="uploadFileAxios"
            :file-list="fileList"
            :action="action"
            class="upload"
            ref="elupload"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAccountclose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'开发票'"
      :visible.sync="applyInvoiceVisible"
      :before-close="applyInvoiceClose"
      :close-on-click-modal="false"
      width="850px"
    >
      <el-form
        :inline="true"
        label-width="140px"
        :model="applyInvoiceTitle"
        :rules="rules"
        size="mini"
        ref="rule"
      >
        <el-form-item label="发票类型：" prop="invoiceType">
          <el-radio-group @change="changeInvoiceType2"  v-model="applyInvoiceTitle.invoiceType">
            <el-radio v-for="item in invoice_type"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票方式：" prop="invoiceMode">
          <el-radio-group :disabled="applyInvoiceTitle.invoiceType == 'VAT_special_invoice'" v-model="applyInvoiceTitle.invoiceMode">
            <el-radio v-for="item in invoice_mode"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票公司：" prop="invoiceCompany">
          <el-select
            v-model="applyInvoiceTitle.invoiceCompany"
            filterable
            placeholder="请选择"
            :style="{width:widths}"
          >
            <el-option
              v-for="item in wst_company"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票金额：" prop="invoiceFund">
          <el-input-number
            :controls="false"
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoiceFund"
            :maxlength="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="姓名/公司抬头：" prop="invoiceTitle">
          <el-input
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoiceTitle"
            :maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号/税号：" prop="invoiceAccount">
          <el-input
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoiceAccount"
            :maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票地址：" prop="invoiceAddr">
          <el-input
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoiceAddr"
            :maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票电话：" prop="invoicePhone">
          <el-input
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoicePhone"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行：" prop="invoiceBank">
          <el-input
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoiceBank"
            :maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行账号：" prop="invoiceBankAccount">
          <el-input
            :style="{width: widths}"
            v-model="applyInvoiceTitle.invoiceBankAccount"
            :maxlength="100"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item v-if="applyInvoiceTitle.invoiceMode == 'paper'" label="收件人名：" prop="recipientName">
          <el-input :style="{width: widths}" v-model="applyInvoiceTitle.recipientName"></el-input>
        </el-form-item>
        <el-form-item v-if="applyInvoiceTitle.invoiceMode == 'paper'" label="收件人电话：" prop="recipientPhone">
          <el-input :style="{width: widths}" v-model="applyInvoiceTitle.recipientPhone"></el-input>
        </el-form-item>
        <el-form-item v-if="applyInvoiceTitle.invoiceMode == 'paper'" label="收件人地址：" prop="recipientAddr">
          <el-input :style="{width: widths}" v-model="applyInvoiceTitle.recipientAddr"></el-input>
        </el-form-item>
        <el-form-item v-if="applyInvoiceTitle.invoiceMode == 'electronic'" label="收件人邮箱：" prop="recipientEmail">
          <el-input :style="{width: widths}" v-model="applyInvoiceTitle.recipientEmail"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop>
          <el-input :style="{width: widths}" v-model="applyInvoiceTitle.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyInvoiceClose">取 消</el-button>
        <el-button type="primary" @click="applyInvoiceSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <Refund
      :refundVisible="refundVisible"
      :orderId="Account.orderId"
      :menteeName="Account.realName"
      :wxID="Account.wxId"
      @close="refundClose"
      @submit="refundSubmit"
    />
    <Rebate
      :brokerageVisible="rebateVisible"
      :orderId="orderId"
      :pretalk="pretalkData"
      @close="rebateClose"
      @submit="rebateSubmit"
    />
    <RecommendDetail
      :recommendDetailVisible="recommendDetailVisible"
      :applyData="applyData"
      :recall="recall"
      :reapply="reapply"
      :reapplyList="reapplyList"
      @close="recommendDetailClose"
    />
  </div>
</template>

<script>
import api from '@/api/sales_assistant.js'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'
import RecommendDetail from '@/views/apply_audit/recommend/detail.vue'
import Refund from '@/views/vip/mentee/components/refund.vue'
import Rebate from './RebateApply'
import { mapState } from 'vuex'
export default {
  name: 'inAccount',
  mixins: [mixins],
  components: { Refund, Rebate, RecommendDetail },
  props: {
    accountVisible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      accountTab: '1',
      loading: false,
      loading2: true,
      widths: '610px',
      widthHalf: '240px',
      Account: {},
      invoice_mode: [],
      /* 入账/退款 */
      inAccountList: [
        {
          choose: false
        }
      ],

      addAccountVisible: false,
      accountData: {
        revenueType: null,
        account: null,
        orderId: null,
        billId: null,
        confirmStatus: null,
        confirmTime: null,
        confirmTime1: null,
        confirmTime2: null,
        confirmor1: null,
        confirmor2: null,
        exchangeRate: null,
        menteeId: null,
        menteeName: null,
        revenueDate: null,
        revenue: null,
        totalInCny: null,
        transfer: null,
        remark: null,
        voucherNum: 0,
        voucher: []
      },
      rules: {
        revenueDate: { required: true, message: '必填', trigger: 'blur' },
        revenueType: { required: true, message: '必填', trigger: 'blur' },
        transfer: { required: true, message: '必填', trigger: 'blur' },
        revenue: { required: true, message: '必填', trigger: 'blur' },
        account: { required: true, message: '必填', trigger: 'blur' },
        exchangeRate: { required: true, message: '必填', trigger: 'blur' },
        // voucher: { required: true, message: "必填", trigger: "blur" },
        confirmor1: { required: true, message: '必填', trigger: 'blur' },
        confirmor2: { required: true, message: '必填', trigger: 'blur' },
        remark: { required: true, message: '必填', trigger: 'blur' },
        invoiceType: { required: true, message: '必填', trigger: 'blur' },
        invoiceCompany: { required: true, message: '必填', trigger: 'blur' },
        invoiceFund: { required: true, message: '必填', trigger: 'blur' },
        invoiceTitle: { required: true, message: '必填', trigger: 'blur' },
        invoiceAccount: { required: true, message: '必填', trigger: 'blur' },
        recipientName: { required: true, message: '必填', trigger: 'blur' },
        // voucher: { required: true, message: "必填", trigger: "blur" },
        recipientPhone: { required: true, message: '必填', trigger: 'blur' },
        recipientAddr: { required: true, message: '必填', trigger: 'blur' },
        recipientEmail: { required: true, message: '必填', trigger: 'blur' },
        invoiceMode: { required: true, message: '必填', trigger: 'blur' },
        // Transition验证规则
        'pretalk.status': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.parentJob': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.parentPersonality': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.parentExpectation': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.parentControl': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.parentPurchasingPower': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.menteeIndustryLevel': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.menteeMentality': [{ required: true, message: '必填', trigger: 'blur' }],
        'transition.notice': [{ required: true, message: '必填', trigger: 'blur' }],
        vipGroupDate: [{ required: true, message: '必填', trigger: 'blur' }],
        strategist: [{ required: true, message: '必填', trigger: 'blur' }],
        services: [{ required: true, message: '必填', trigger: 'blur' }],
        feedbackRemark: [{ required: true, message: '必填', trigger: 'blur' }],
        pretalkId: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      fileList: [],
      action: '',
      // 完善订单信息
      orderDetailVisible: false,
      VIPList: [],
      servicesList: [],
      orderDetail: {
        transition: {
          parentJob: '',
          parentPersonality: '',
          parentExpectation: '',
          parentControl: '',
          parentPurchasingPower: '',
          menteeIndustryLevel: '',
          menteeMentality: '',
          notice: ''
        },
        pretalkArr: [],
        pretalkId: ''
      },
      // 入账账号
      accountList: [],
      bill_currency_type: [],
      invoice_type: [],
      wst_company: [],
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
      refundVisible: false,
      /* 发票 */
      setInvoice: true,
      applyInvoice: false,
      invoiceList: [{}],
      applyInvoiceVisible: false,
      chooseInAccount: [],
      invoiceTitle: {
        invoiceType: '',
        invoiceMode: ''
      },
      applyInvoiceTitle: {
        invoiceType: '',
        invoiceMode: ''
      },
      rateData: {},
      /* BD */
      bdBrokerageList: [],
      orderCopy: {},
      recommendDetailVisible: false,
      applyData: {},
      reapplyList: [],
      /* pretalk */
      pretalkBrokerageList: {},
      pretalkData: {},
      rebateVisible: false
    }
  },
  watch: {
    accountVisible: function (val) {
      if (val) {
        this.accountTab = '1'
        this.loading = true
        this.initFirst()
        this.Topage('1')
        this.Topage('2')
        if (this.isCompleted) {
          this.perfectOrder()
        }
      }
    },
    accountType: function (val, old) {
      if (val !== old) {
        this.accountList = []
        this.accountData.account = null
        this.getAccountList(val)
      }
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    totalPrice: {
      get: function () {
        return Math.round(
          this.accountData.revenue * this.accountData.exchangeRate * 100
        ) / 100
      }
    },
    accountType: function () {
      return this.accountData.revenueType
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      apiDic.getAuditorListByApplyType('order_entry').then(res => {
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
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.invoice_type = await this.getDictionary('invoice_type')
      this.wst_company = await this.getDictionary('wst_company')
      this.invoice_mode = await this.getDictionary('invoice_mode')
      /* Strategist列表 */
      api.userList({
        pageNum: 1,
        pageSize: 10000,
        entryStatus: '1',
        sortCol: 'userName',
        sort: 'ASC',
        positionType: 'strategist'
      })
        .then((res) => {
          this.VIPList = res.data.rows
        })
      /* Program Manager列表 */
      api.userList({
        pageNum: 1,
        pageSize: 10000,
        entryStatus: '1',
        sortCol: 'userName',
        sort: 'ASC',
        positionType: 'services'
      })
        .then((res) => {
          this.servicesList = res.data.rows
        })
    },
    initFirst () {
      api.getGeneralOrder(this.orderId).then(res => {
        console.log(res.data)
        this.loading = false
        this.Account = res.data
        this.accountData.orderId = res.data.orderId
        this.accountData.exchangeRate = res.data.rate
      })
    },
    Topage (i) {
      console.log(i)
      switch (i) {
        case '1':
          api.getBillListByOrderId(this.orderId).then(res => {
            console.log(res.data, this.Account)
            this.inAccountList = res.data.map(v => {
              v.choose = false
              return v
            })
          })
          break
        case '2':
          this.applyInvoice = false
          api.getInvoiceDataByOrderId(this.orderId).then(res => {
            console.log('getInvoiceDataByOrderId', res.data)
            this.invoiceTitle = res.data.invoiceTitle || this.invoiceTitle
            this.invoiceTitle.orderId = this.orderId
            this.invoiceList = res.data.invoiceArr || []
          })
          break
        case '3':
          api.getBdBrokerageOrder(this.orderId).then(res => {
            console.log(res.data)
            this.bdBrokerageList = res.data
          })
          break
        case '4':
          if (!this.Account.pretalkId) {
            this.$message.warning('未设置Pretalk，无法申请')
            return
          }
          api.getPretalkBrokerageOrder(this.orderId).then(res => {
            console.log(res.data)
            this.pretalkBrokerageList = res.data
          })
          break
      }
    },
    close () {
      this.$emit('close')
      this.invoiceTitle = {
        invoiceType: '',
        invoiceMode: ''
      }
      this.applyInvoiceTitle = {
        invoiceType: '',
        invoiceMode: ''
      }
    },
    handleClick () {
      this.Topage(this.accountTab)
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    // 凭证上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, `voucher/in_account/${this.orderId}`, url => {
        this.accountData.voucher.push({
          voucherPath: url,
          voucherName: file.file.name
        })
        this.$loading().close()
      })
    },
    // 入账账户列表
    getAccountList (type) {
      if (type) {
        apiDic.getRate({ currencyType: type }).then(res => {
          console.log(res)
          this.rateData = res.data
        })
      } else {
        this.rateData = {}
      }
      console.log(type, 'yx******')
      api.getAccountList(type).then(res => {
        console.log('入账账户列表', res.data.rows)
        this.accountList = res.data.rows
      })
    },
    perfectOrder () {
      this.loading = true
      api.getUpdateOrder(this.orderId).then(res => {
        this.loading = false
        this.orderCopy = JSON.parse(JSON.stringify(res.data))
        this.orderDetail = res.data
        // this.orderDetail = Object.assign(this.orderDetail, res.data)
        if (this.orderDetail.vipGroupDate && this.orderDetail.vipGroupDate !== '') {
          this.booked()
        } else {
          this.$message.warning('请先完善订单信息')
          this.orderDetailVisible = true
        }
      })
    },
    orderDetailClose () {
      this.orderDetailVisible = false
      if (this.isCompleted) {
        this.close()
      }
    },
    orderDetailSubmit () {
      this.$refs.orderDetail.validate(valid => {
        if (!valid) return
        this.loading2 = true
        const obj = JSON.parse(JSON.stringify(this.orderDetail))
        const obj2 = JSON.parse(JSON.stringify(this.orderDetail))
        const arr = []
        obj.pretalkArr.forEach((item, i) => {
          if (item.feedbackRemark === this.orderCopy.pretalkArr[i].feedbackRemark) {
          } else {
            arr.push(item)
          }
        })

        obj2.pretalkArr = arr
        if (obj2.pretalkId == '9999') {
          obj2.pretalkId = ''
        }
        console.log(obj2)
        api.putUpdateOrder(obj2).then(res => {
          this.loading2 = false
          if (res.code == '200') {
            this.$message.success('提交成功')
            if (this.isCompleted) {
              this.orderDetailClose()
              this.$emit('hasCompleted')
            } else {
              this.booked()
            }
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 添加入账
    booked () {
      this.orderDetailClose()
      console.log('添加入账', this.Account)
      this.accountData = {
        revenueType: null,
        account: null,
        orderId: this.Account.orderId,
        billId: null,
        confirmStatus: null,
        confirmTime: null,
        confirmTime1: null,
        confirmTime2: null,
        confirmor1: null,
        confirmor2: null,
        exchangeRate: this.Account.rate,
        menteeId: null,
        menteeName: null,
        revenueDate: null,
        revenue: null,
        totalInCny: null,
        transfer: null,
        remark: null,
        voucherNum: 0,
        voucher: []
      }
      this.addAccountVisible = true
    },
    submit () {
      this.$refs.rule.validate(valid => {
        if (!valid) return
        if (!(this.accountData.voucher && this.accountData.voucher.length)) {
          this.$message({
            type: 'error',
            message: '凭证必填'
          })
          return
        }
        if ((this.rateData.orderRate1 && this.rateData.orderRate1 > this.accountData.exchangeRate) ||
            (this.rateData.orderRate2 && this.rateData.orderRate2 < this.accountData.exchangeRate)) {
          this.$message({
            type: 'error',
            message: '入账实时汇率未在参考区间内'
          })
          return
        }
        if (/^[a-z]|\s[a-z]/.test(this.accountData.transfer)) {
          this.$message({
            type: 'warning',
            message: '注意付款人姓名格式'
          })
          return
        }

        this.submit2()
      })
    },

    submit2 () {
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

      let revenueTypeName = ''
      this.bill_currency_type.forEach(v => {
        if (v.itemValue === this.accountData.revenueType) {
          revenueTypeName = v.itemName
        }
      })
      // console.log("submit",revenueTypeName);

      const data = {
        applyType: 'order_entry',
        applyTitle: `订单[${this.orderId}]的入账申请`,
        keyId: this.orderId,
        approval: approval,
        copyTo: [],
        content: {
          file: [],
          text: [
            // {label:'订单ID',value:this.orderId},
            { label: '入账日期', value: this.accountData.revenueDate },
            {
              label: '货币类型',
              value: revenueTypeName
            },
            { label: '金额', value: this.accountData.revenue },
            {
              label: '公司入账账户',
              value: this.accountData.account
            },
            { label: '入账说明', value: this.accountData.remark },
            { label: '转账人', value: this.accountData.transfer },
            { label: '汇率', value: this.accountData.exchangeRate },
            { label: '总金额（￥）', value: this.totalPrice }
          ],
          info: {
            orderId: this.orderId,
            revenueDate: this.accountData.revenueDate,
            revenueType: this.accountData.revenueType,
            transfer: this.accountData.transfer,
            revenue: this.accountData.revenue,
            account: this.accountData.account,
            exchangeRate: this.accountData.exchangeRate,
            totalInCny: this.totalPrice,
            voucher: this.accountData.voucher,
            remark: this.accountData.remark
          }
        }
      }

      this.accountData.voucher.forEach(v => {
        data.content.file.push({ name: v.voucherName, url: v.voucherPath })
      })

      this.$loading()
      console.log(data, 'yx 提交的数据')
      api
        .setCommApply(data)
        .then(res => {
          console.log(res, this.accountData.remark)
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.$loading().close()
          if (
            /第一笔|全款/.test(this.accountData.remark) &&
            !this.invoiceTitle.invoiceAccount
          ) {
            this.$confirm('建议添加发票抬头')
              .then(() => {
                this.accountTab = '2'
                this.handleClick()
              })
              .catch(() => {})
          }
          this.inAccount()
          this.addAccountclose()
          this.Topage('1')
          this.Topage('2')
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          this.$loading().close()
        })
    },
    addAccountclose () {
      this.addAccountVisible = false
      this.$refs.elupload.clearFiles()
    },
    // 首次入账 返佣
    inAccount () {
      if (this.accountData.remark == '全款' || this.accountData.remark == '尾款') {
        this.$confirm('是否返佣').then(() => {
          this.rebateVisible = true
        }).catch(() => {})
      }
    },
    refund () {
      console.log('退款')
      this.refundVisible = true
    },
    refundClose () {
      console.log('refundClose')
      this.refundVisible = false
    },
    refundSubmit () {
      this.refundClose()
      this.Topage('1')
    },
    pretalk (obj) {
      this.pretalkData = this.Account
      this.rebateVisible = true
    },
    rebateSubmit () {
      this.rebateVisible = false
    },
    rebateClose () {
      this.rebateVisible = false
    },
    changeInvoiceType () {
      if (this.invoiceTitle.invoiceType == 'VAT_special_invoice') {
        this.invoiceTitle.invoiceMode = 'paper'
      } else {
        this.invoiceTitle.invoiceMode = ''
      }
      console.log(this.invoiceTitle)
    },
    changeInvoiceType2 () {
      if (this.applyInvoiceTitle.invoiceType == 'VAT_special_invoice') {
        this.applyInvoiceTitle.invoiceMode = 'paper'
      } else {
        this.applyInvoiceTitle.invoiceMode = ''
      }
    },
    bd () {
      this.pretalkData = {}
      this.rebateVisible = true
    },
    showBdDetail (v) {
      this.applyData = v
      this.recommendDetailVisible = true
    },
    reapply () {
      // bd暂无重申
    },
    recall (v) {
      console.log('撤回', v)
      this.$confirm('此操作将撤回该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.cancelApplyByApplyId(v.applyId).then((res) => {
            console.log('撤回返回', res)
            this.recommendDetailVisible = false
            this.Topage('3')
          })
        })
        .catch(() => {})
    },
    recommendDetailClose () {
      this.recommendDetailVisible = false
    },
    /* 开票 */
    chooseApplyRecipient () {
      this.applyInvoice = true
      this.inAccountList.forEach(v => {
        v.choose = !(
          v.applyStatus !== '2' ||
          v.billType === 'refund' ||
          v.revenueType.toLowerCase() !== 'cny' ||
          !!v.invoiceId
        )
      })
      this.$message('已选择所有可开票的入账')
    },

    toApplyRecipient () {
      this.chooseInAccount = this.inAccountList.filter(v => v.choose)

      if (!this.chooseInAccount.length) {
        this.$message({
          type: 'warning',
          message: '请选择需要开票的入账'
        })
        return
      }

      let invoiceFund = 0
      this.chooseInAccount.forEach(v => {
        invoiceFund += v.revenue * 1
      })

      this.applyInvoiceTitle = { ...this.invoiceTitle }
      console.log(this.chooseInAccount, this.applyInvoiceTitle)
      this.applyInvoiceTitle.invoiceFund = invoiceFund
      this.applyInvoiceVisible = true
    },
    setSourceChannel () {
      this.$prompt('请输入渠道编码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '必填'
      }).then(({ value }) => {
        const data = {
          orderId: this.orderId,
          uniqueCode: value
        }
        api.uptSourceChannel(data).then(res => {
          console.log(res)
          if (res.code == '20001') {
            this.$message.error(res.message)
          } else {
            this.$message.success('更新成功')
            this.initFirst()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      })
    },
    setPretalk () {
      this.$prompt('请输入Pretalk标识码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '必填'
      }).then(({ value }) => {
        const data = {
          orderId: this.orderId,
          pretalkCode: value
        }
        api.uptPretalk(data).then(res => {
          if (res.code == '20001') {
            this.$message.error(res.message)
          } else {
            this.$message.success('更新成功')
            this.initFirst()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      })
    },
    submitInvoiceTitle () {
      this.$refs.invoiceTitle.validate((valid) => {
        if (valid) {
          this.invoiceTitle.orderId = this.orderId
          api.uptInvoiceTitle(this.invoiceTitle).then(res => {
            console.log(res)
            this.setInvoice = true
          })
        }
      })
    },
    applyInvoiceClose () {
      this.applyInvoiceVisible = false
    },

    applyInvoiceSubmit () {
      this.$refs.rule.validate(valid => {
        if (!valid) return
        if (
          this.applyInvoiceTitle.invoiceType == 'VAT_special_invoice' &&
          (!this.applyInvoiceTitle.invoiceAddr ||
            !this.applyInvoiceTitle.invoicePhone ||
            !this.applyInvoiceTitle.invoiceBank ||
            !this.applyInvoiceTitle.invoiceBankAccount)
        ) {
          this.$message({
            type: 'error',
            message: '增值专用发票时:地址，电话，开户行，账户都为必填!'
          })
          return
        }

        const data = {
          ...this.applyInvoiceTitle,
          billList: this.chooseInAccount.map(v => {
            return { applyId: v.applyId }
          })
        }
        this.$loading()
        api.applyInvoice(data).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '发票申请成功'
          })
          this.$loading().close()
          this.applyInvoice = false
          this.applyInvoiceClose()
          this.Topage('1')
          this.Topage('2')
        })
      })
    },
    editInvoice (v) {
      if (v == 0) {
        this.$alert('当前发票未开，请联系财务修改。')
      } else {
        this.$alert('当前发票已开，不可修改。')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.in_account{
  padding:10px
}
.el-form-item {
  margin-bottom: 10px;
}
.bgcG , ::v-deep .bgcG .el-descriptions__body{
  background-color: #f7fff6;
}
.bgcR , :v-deep .bgcG .el-descriptions__body{
  background-color: #ffd8d3;
}
.bgcW , :v-deep .bgcG .el-descriptions__body{
  background-color: #fff;
  padding: 10px;
  // border: 10px #111 solid;
}
</style>
