<!--
 * @Author: 库建华
 * @Date: 2020-04-01 11:53:04
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-03 15:32:00
 * @Version: 1
 * @Description:返佣 rebate 签约时，录入返佣信息，订单入账完成后，生成返佣申请
 -->
<template>
  <div class="brokerage">
    <el-dialog title="签约信息_返佣" :visible.sync="rebateVisible" width="1200px" :before-close="close" :append-to-body="true">
      <el-card class="mb20">
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">本订单总金额</el-col>
          <el-col
            :span="4"
            class="mentee-detail-value"
          >￥{{Math.round(signData.collect.orderPrice)}} / ${{Math.round(signData.collect.orderPriceUsd)}}</el-col>
          <el-col :span="3" class="mentee-detail-name">学生来源</el-col>
          <el-col :span="4" class="mentee-detail-value">{{signData.mentee.sourceFromName}}</el-col>
          <el-col :span="3" class="mentee-detail-name">基础项目</el-col>
          <el-col :span="4" class="mentee-detail-value">{{signData.basic ? '有' : '无'}}</el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="3" class="mentee-detail-name">
            是否返佣
            <el-tooltip placement="top">
              <div slot="content">
                订单金额需超过$3500
                <br />根据渠道来源设置的返佣规则！
              </div>
              <span class="el-icon-info"></span>
            </el-tooltip>
          </el-col>
          <el-col :span="4" class="mentee-detail-value">
              <!-- @change="changeSelect(canRebate)" -->
            <el-select
              :style="{width:'100px'}"
              v-model="canRebate"
              size="mini"
              placeholder="请选择"
              :disabled="brokerageStatus == 6"
            >
              <el-option
                v-for="item in common_yes_or_no"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
      <template v-if="canRebate == 1">
        <el-card class="mb20">
          <el-row class="mb10">
            <el-col :span="3" class="mentee-detail-name">返佣基准</el-col>
            <el-col :span="4" class="mentee-detail-value">
              <el-switch
                v-model="type"
                active-color="#13ce66"
                inactive-color="#409eff"
                active-value="rate"
                inactive-value="number"
                active-text="比例"
                inactive-text="金额"
                :disabled="brokerageNoChange"
              ></el-switch>
            </el-col>
            <template v-if="type ==='rate'">
              <el-col :span="3" class="mentee-detail-name">返佣比例(%)</el-col>
              <el-col :span="4" class="mentee-detail-value">
                <el-input-number
                  :style="{width:'100px'}"
                  :controls="false"
                  v-model="rate"
                  size="mini"
                  placeholder
                ></el-input-number>
              </el-col>
            </template>
            <template v-if="type ==='number'">
              <el-col :span="3" class="mentee-detail-name">货币类型</el-col>
              <el-col :span="4" class="mentee-detail-value">
                <el-select
                  :style="{width:'100px'}"
                  v-model="currencyType"
                  size="mini"
                  placeholder="请选择"
                  :disabled="brokerageNoChange"
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
            <el-col :span="3" class="mentee-detail-name">
              返佣金额
              <el-tooltip placement="top">
                <div slot="content">
                  返佣基准为比例时，
                  <br />金额的货币类型为人民币（￥）
                </div>
                <span class="el-icon-info"></span>
              </el-tooltip>
            </el-col>
            <el-col :span="3" class="mentee-detail-value">
              <el-input-number
                :controls="false"
                v-model="brokerage"
                size="mini"
                :disabled="type ==='rate' || brokerageNoChange"
                placeholder
              ></el-input-number>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="3" class="mentee-detail-name">推荐人</el-col>
            <el-col :span="4" class="mentee-detail-value">
              <el-input size="mini" v-model="referrer"></el-input>
            </el-col>
            <!-- <el-col :span="3" class="mentee-detail-name">系统汇率</el-col>
          <el-col :span="3" class="mentee-detail-value">
            <el-input-number
              :style="{width:'100px'}"
              :controls="false"
              :disabled="true"
              v-model="exchangeRate"
              size="mini"
              placeholder
            ></el-input-number>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="3" class="mentee-detail-name">收款账号详情</el-col>
            <el-col :span="20" class="mentee-detail-value">
              <el-input size="mini" v-model="account" maxlength="199"></el-input>
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
            <el-select
              :style="{width:'180px'}"
              v-model="copy"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <el-card v-if="signData.collect && signData.collect.pretalkId" class="mb20">
        <div slot="header" class="clearfix">
          <span>pretalk申请</span>
        </div>
        <template >
          <el-card class="mb20">
            <el-row class="mb10">
              
              <template v-if="type ==='number'">
                <el-col :span="3" class="mentee-detail-name">货币类型</el-col>
                <el-col :span="4" class="mentee-detail-value">$(美金)</el-col>
              </template>
              <el-col :span="3" class="mentee-detail-name">pretalk申请金额</el-col>
              <el-col :span="3" class="mentee-detail-value">
                <el-input-number
                  :controls="false"
                  v-model="brokeragePretalk"
                  size="mini"
                  :disabled="true"
                  placeholder
                ></el-input-number>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="mentee-detail-name">收款账号详情</el-col>
              <el-col :span="20" class="mentee-detail-value">
                <el-input size="mini" v-model="accountPretalk" maxlength="199"></el-input>
              </el-col>
            </el-row>
          </el-card>
          <el-form :inline="true" label-width="130px">
            <el-form-item label="材料">
              <p v-for="item in uploadFileList1" :key="item.url">{{item.name}}</p>
              <el-upload
                :http-request="uploadFileAxios1"
                :file-list="fileList1"
                class="upload"
                ref="elupload1"
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
            <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList1" :key="index">
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
            <!-- <el-form-item label="抄送">
              <el-select
                :style="{width:'180px'}"
                v-model="copy"
                multiple
                filterable
                placeholder="请选择"
              >
                <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
        </template>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button @click="toDetail">上一步</el-button>
        <el-button type="primary"  @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";
import apiDic from "@/api/dictionary.js";
import apiU from "@/api/user";

import { uploadFunBySys } from "@/libs/file";

export default {
  props: {
    rebateVisible: {
      type: Boolean,
      default: false
    },
    signData: {
      type: Object
    }
  },
  data: () => {
    return {
      user: [],
      auditor: [],
      auditor1: [],
      copy: [],
      orderData: [{}, {}],
      brokeragePretalk:200,
      pretalkDetail:{},
      fileList: [],
      fileList1: [],
      currencyType: "cny",
      referrer: "",
      account: "",
      accountPretalk:'',
      brokerageDate: {},
      orderId: null,
      orderPrice: 0,
      rate: 0,
      brokerage: 0,
      bill_currency_type: [],
      common_yes_or_no: [],
      exchangeRate: 0,
      uploadFileList: [],
      uploadFileList1: [],
      action: "",
      pretalkBrokerage:{},
      header: {
        Authorization: ""
      },
      type: "rate",
      auditorList: [
        {
          auditor: [],
          confirmCol: "",
          confirmorArr: [
            {
              confirmorName: "",
              isDefult: "",
              confirmCol: "",
              confirmType: "",
              confirmorId: ""
            }
          ]
        }
      ],
      notePretalk:'',
      auditorList1: [
        {
          auditor: [],
          confirmCol: "",
          confirmorArr: [
            {
              confirmorName: "",
              isDefult: "",
              confirmCol: "",
              confirmType: "",
              confirmorId: ""
            }
          ]
        }
      ],
      brokerageStatusList: {
        1: "订单未全部入账",
        2: "没有基础项目",
        3: "订单金额小于3500美金",
        4: "来源：校园大使、好友推荐、导师推荐,固定返佣300美金",
        5: "返佣金额或比例可选",
        6: "本订单情况不支持返佣"
      },
      brokerageStatus: 6,
      brokerageNoChange: false,
      canRebate: "0"
    };
  },
  computed: {
    // brokerage: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    rebateVisible: function(val) {
      if (val) {
        this.orderPrice = this.signData.collect.orderPrice;
        if(this.signData.collect && this.signData.collect.pretalkId){
          api.getPretalkDefault(this.signData.collect.pretalkId).then(res => {
            console.log(res.data,12223)
            this.pretalkDetail = res.data;
            let payWay = res.data
            this.accountPretalk = this.payFn(payWay);
          })
        }
        console.log("signData", this.signData);
        this.canRebate = "0";
        this.setBrokerageStatus();
        // 判断只拿一次基本数据
        !this.user.length && this.initPage();
      }
    },
    type: function(val) {
      if (val == "rate") {
        this.currencyType = "cny";
      }
    },
    rate: function(val) {
      if (val) {
        if (!this.orderPrice) {
          this.$message("请确认订单");
          return;
        }
        this.brokerage = (val * this.orderPrice) / 100;
      }
    }
  },
  mounted() {},
  methods: {
    initPage() {
      apiDic.getAuditorListByApplyType("brokerage").then(res => {
        console.log("getAuditorListByApplyType", res.data);
        res.data.forEach(v => {
          v.auditor = [];
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId);
            }
          });
        });
        this.auditorList = [...res.data];
      });
      apiDic.getAuditorListByApplyType("pretalk_brokerage").then(res => {
        res.data.forEach(v => {
          v.auditor = [];
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId);
            }
          });
        });
        this.auditorList1 = [...res.data];
      });
      
      apiDic.getRate({ currencyType: "usd" }).then(res => {
        this.exchangeRate = res.data.exchangeRate;
      });
      apiDic.getDicDropdown("bill_currency_type,common_yes_or_no").then(res => {
        console.log("入账货币类型列表", res.data);
        this.common_yes_or_no = res.data.common_yes_or_no;
        this.bill_currency_type = res.data.bill_currency_type;
      });
      apiU
        .userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: "1"
        })
        .then(({ data }) => {
          console.log(
            "userList...........................................",
            data
          );
          this.user = data.rows;
        });

      
    },
    setBrokerageStatus() {
      console.log(this.signData.basic);
      console.log(this.signData.mentee);
      console.log(this.signData.collect.orderPriceUsd);
      this.referrer =
        (this.signData.mentee.recommender || "") +
        "(" +
        this.signData.mentee.sourceFromName +
        ")";
      if (this.signData.collect.orderPriceUsd >= 3500) {
        if (this.signData.mentee.brokerageStatus == "fixed_brokerage") {
          this.brokerageStatus = 4;
          this.canRebate = "1";
          this.changeSelect('1')
        } else if ( this.signData.mentee.brokerageStatus == "freedom_brokerage") {
          this.brokerageStatus = 5;
          this.canRebate = "1";
          this.changeSelect('1')
        }
      } else {
        this.brokerageStatus = 6;
        this.canRebate = "0";
      }
      if (this.brokerageStatus == 5) {
        // 满足返佣条件
        this.brokerageNoChange = false;
      } else if (this.brokerageStatus == 4) {
        // 满足返佣条件，只能返佣固定金额300美金；
        this.type = "number";
        this.currencyType = "usd";
        if(this.signData.mentee.brokerageRuleArr.length > 0){
          let brokerageArr = this.signData.mentee.brokerageRuleArr;
          for(let i=0;i<brokerageArr.length;i++){
            if(brokerageArr[i].ge <= this.signData.collect.orderPriceUsd && brokerageArr[i].le >= this.signData.collect.orderPriceUsd){
              this.brokerage = brokerageArr[i].fixedBrokerage;
            }
          }
        }
        if(!this.brokerage){
          this.brokerage = this.signData.mentee.fixedBrokerage || 300;
        }
        this.brokerageNoChange = true;
      } else {
        this.orderPrice = 0;
        this.orderId = "";
      }
    },
    close() {
      this.$emit("close");
      this.clear();
    },
    clear() {
      this.rate = null;
      this.brokerage = null;
      this.orderId = null;
      this.orderPrice = 0;
      this.account = "";
      this.accountPretalk = '';
      this.referrer = "";
      this.fileList = [];
      this.fileList1 = [];
      this.auditor = [];
      this.auditor1 = [];
      this.copy = [];
      this.exchangeRate = 0;
      this.uploadFileList = [];
      this.uploadFileList1 = [];
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    toDetail() {
      // this.close();
      this.$emit("backToDetail");
    },
    submit() {
      if (this.canRebate == 0) {
        this.signData.brokerage = null;
        if(this.signData.collect && this.signData.collect.pretalkId){
          this.toPretalk()
        }else{
          this.$emit("submit", this.signData);
        }
        return;
      }
      // 验证
      if (!this.brokerage) {
        this.$message("返佣金额不能为空");
        return;
      }
      if (!this.referrer.length) {
        this.$message("收款人不能为空");
        return;
      }
      if (!this.account.length) {
        this.$message("收款账号详情不能为空");
        return;
      }
      let approval = "";
      let cannot = false;
      this.auditorList.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true;
        }
        approval = aa.auditor.join(',') ;
      });
      if (cannot) {
        this.$message({
          type: "warning",
          message: "审核人都为必填！"
        });
        return;
      }
      let copyTo = "";
      copyTo = this.copy.join(',') ;
      let keyType = '';
      let keyId = '';
      if(this.signData.mentee.brokeragePayment){
        if(this.signData.mentee.brokeragePayment.cooperatorId){
          keyType = 'cooperator';
          keyId = this.signData.mentee.brokeragePayment.cooperatorId;
        }else if(this.signData.mentee.brokeragePayment.ambassadorId){
          keyType = 'ambassador';
          keyId = this.signData.mentee.brokeragePayment.ambassadorId;
        }else if(this.signData.mentee.brokeragePayment.mentorId){
          keyType = 'kol-mentor';
          keyId = this.signData.mentee.brokeragePayment.mentorId;
        }else if(this.signData.mentee.brokeragePayment.menteeId){
          keyType = 'kol-mentee';
          keyId = this.signData.mentee.brokeragePayment.menteeId;
        }else if(this.signData.mentee.brokeragePayment.kolId){
          keyType = 'kol-other';
          keyId = this.signData.mentee.brokeragePayment.kolId;
        }
      }
      let data = {
        applyTitle: `返佣申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [...this.uploadFileList],
          text: [
            {
              label: "订单ID",
              value: "orderIdReplace"
            },
            {
              label: "订单金额",
              value: this.signData.collect.orderPrice
            },
            {
              label: "申请时汇率",
              value: "exchangeRateReplace"
            },
            {
              label: "推荐人",
              value: this.referrer
            },
            {
              label: "申请金额",
              value: this.currencyType + this.brokerage
            },
            {
              label: "收款账户",
              value: this.account
            }
          ],
          info: {
            orderId: "orderIdReplace",
            fundType: this.currencyType,
            exchangeRate: "exchangeRateReplace",
            payUser: this.referrer,
            keyType:keyType,
            keyId:keyId,
            payAccount: this.account,
            fundWage: this.brokerage
          }
        }
      };
      if (this.type === "rate") {
        data.content.text.push({
          label: "返佣比例(%)",
          value: this.rate
        });
        data.content.info.brokerageRate = this.rate;
      }
      this.signData.brokerage = data;
      console.log(data);
      this.clear();
      if(this.signData.collect && this.signData.collect.pretalkId){
        this.toPretalk()
      }else{
        this.$emit("submit", this.signData);
      }
      // api.setRefund(data).then(res => {
      //   console.log("setbrokerage，", res);
      //   this.$emit("submit");
      //   this.clear();
      // });
    },
    // 凭证上传
    uploadFileAxios(file, fileList) {
      this.$loading();
      console.log(file, fileList);
      uploadFunBySys(file.file, `voucher/brokerage_apply`, url => {
        this.uploadFileList.push({
          url: url,
          name: file.file.name
        });
        this.$loading().close();
        this.$refs.elupload.clearFiles();
        console.log(this.uploadFileList);
      });
    },
    uploadFileAxios1(file, fileList1) {
      this.$loading();
      console.log(file, fileList1);
      uploadFunBySys(file.file, `voucher/pretalk_brokerage`, url => {
        this.uploadFileList1.push({
          url: url,
          name: file.file.name
        });
        this.$loading().close();
        this.$refs.elupload1.clearFiles();
        console.log(this.uploadFileList1);
      });
    },
    changeSelect(val){
      console.log(val)
      if(val == '1'){
        if(this.signData.mentee.brokeragePayment){
          let payWay =this.signData.mentee.brokeragePayment
          this.account = this.payFn(payWay);
        }else{
          this.$message.warning('暂无账户信息！！')
        }
      }
    },
    payFn(payWay){
      let account = "";
      for (let item in payWay) {
        console.log(item, payWay[item]);
        switch (item) {
          case "paymentType": {
            account += "付款类型：" + payWay[item] + "  ;  ";
            break;
          }
          case "payAcc": {
            account += " 账户：" + payWay[item] + "  ;  ";
            break;
          }
          case "bankName": {
            account += " 银行：" + payWay[item] + "  ;  ";
            break;
          }
          case "realName": {
            account += " 收款人姓名：" + payWay[item] + "  ;  ";
            break;
          }
          case "idCard": {
            account += " 收款人身份证号：" + payWay[item] + "  ;  ";
            break;
          }
          case "bankAddress": {
            account += " Bank Address：" + payWay[item] + "  ;  ";
            break;
          }
          case "zip": {
            account += " ZIP：" + payWay[item] + "  ;  ";
            break;
          }
          case "routingNumber": {
            account += " Routing Number：" + payWay[item] + "  ;  ";
            break;
          }
          case "swiftCode": {
            account += " Swift Code：" + payWay[item] + "  ;  ";
            break;
          }
        }
      }
      return account
    },
    toPretalk(){
      if (!this.accountPretalk.length) {
        this.$message("pretalk收款账号详情不能为空,请检查该学员有无默认支付账户");
        return;
      }
      let approval = "";
      let cannot = false;
      if(this.auditorList1.length < 1){
          cannot = true;
      }
      this.auditorList1.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true;
        }
        approval = aa.auditor.join(',') ;
      });
      if (cannot) {
        this.$message({
          type: "warning",
          message: "审核人都为必填！"
        });
        return;
      }
      let data = {
        applyTitle: `pretalk申请`,
        copyTo: '',
        approval: approval,
        applyType:'pretalk_brokerage',
        content: {
          file: [...this.uploadFileList1],
          text: [
            {
              label: "订单ID",
              value: "orderIdReplace"
            },
            {
              label: "订单金额",
              value: this.signData.collect.orderPrice
            },
            {
              label: "推荐人",
              value: this.referrer
            },
            {
              label: "pretalk名",
              value: this.signData.collect.pretalkName
            },
            {
              label: "学员名",
              value: this.signData.collect.realName
            },
            {
              label: "申请金额",
              value: '$200'
            },
            {
              label: "收款账户",
              value: this.accountPretalk
            }
          ],
          info: {
            orderId: "orderIdReplace",
            fundType: 'usd',
            fundWage: 200,
            pretalkId:this.signData.collect.pretalkId,
            payType: this.pretalkDetail.accountId,
          }
        }
      };
      this.signData.pretalkBrokerage = data;
      console.log(this.signData)
      this.$emit("submit", this.signData);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>