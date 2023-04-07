<!--
 * @Author: kaan
 * @Date: 2022-01-06 14:24:20
 * @LastEditors: Kaan
 * @LastEditTime: 2022-05-30 15:38:59
 * @Version: 
 * @Description: 
-->

<template>
  <el-drawer
    :title="`学员签约信息`"
    :visible.sync="menteeSignVisible"
    :size="widths"
    :before-close="close"
  >
    <div class="sign_container">
      <el-timeline v-if="orderListData.length">
        <el-timeline-item
          v-for="(order, index) in orderListData"
          type="primary"
          :key="index"
          placement="top"
          :timestamp="order.signDate"
        >
          <el-card style="position:relative">
            <el-tag style="position:absolute;top:20px;right:20px">{{order.payStatusName}}</el-tag>
            <div>
              <!-- 项目名: -->
              <p v-for="sign in order.signArr" :key="sign.signId">
                {{sign.programName}} [{{sign.programTypeName}}]&emsp;
                <template
                  v-if="sign.programType == 'basic'"
                >
                  <el-button size="mini" type plain @click="continual(sign,order.orderId)">续 约</el-button>
                  <el-button size="mini" type plain @click="extension(sign,order)">延长合同</el-button>
                </template>
              </p>
            </div>
            <p>&emsp;</p>
            <p>
              主联系人: {{order.contact1Name}}&emsp;&emsp;&emsp;
              <span
                v-if="order.contact2"
              >副联系人： {{order.contact2Name}}</span>
            </p>
            <p>&emsp;</p>
            <p>签约时间：{{order.signDate}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <span v-else>无签约记录</span>
      <div class="dialog_footer">
        <el-dropdown split-button type="primary" @click="setOrder('new','quick')">
          快捷下单
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ><div @click="setOrder('new','normal')">一站式下单（Beta）</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" v-if="hasRedis" @click="keepOrder">一站式下单（暂存）</el-button>
      </div>
    </div>

    <ChooseProgram
      v-if="chooseProgramVisible"
      :chooseProgramVisible="chooseProgramVisible"
      :orderType="orderType"
      :signType = "signType"
      @success="chooseProgramSubmit"
      @close="chooseProgramClose"
    />
    <SignDetailQuick
      :signDetailVisible="signDetailQuickVisible"
      :isKeepOrder="isKeepOrder"
      :menteeId="menteeId"
      :vipStatus="vipStatus"
      :offerList="offerList"
      :graduateList="graduateList"
      @success="signDetailSubmit"
      @onlineSuccess="signDetailOnlineSubmit2"
      @close="signDetailClose"
    />
    <SignDetail
      :signDetailVisible="signDetailVisible"
      :isKeepOrder="isKeepOrder"
      :menteeId="menteeId"
      :vipStatus="vipStatus"
      :offerList="offerList"
      :graduateList="graduateList"
      @success="signDetailSubmit"
      @onlineSuccess="signDetailOnlineSubmit2"
      @close="signDetailClose"
    />
    <SignDetailNoBasic
      :signDetailNoBasicVisible="signDetailNoBasicVisible"
      :isKeepOrder="isKeepOrder"
      :menteeId="menteeId"
      :internshipNum="internshipNum"
      :oralNum="oralNum"
      :cfaNum="cfaNum"
      :financeNum="financeNum"
      :graduateNum="graduateNum"
      :tutoringNum="tutoringNum"
      :programId="programId"
      :vipStatus="vipStatus"
      @success="signDetailSubmit"
      @onlineSuccess="signDetailOnlineSubmit2"
      @close="signDetailClose"
    />
    <SignUrl
      v-if="urlVisible"
      :urlVisible="urlVisible"
      :orderId="orderId"
      :contractURL="contractURL"
      :contractPDFURL="contractPDFURL"
      @close="signURLClose"
    />
    <SignUrlSupplementary
      v-if="urlSupplementaryVisible"
      :urlSupplementaryVisible="urlSupplementaryVisible"
      :orderId="orderId"
      :contractURL="contractURL"
      :contractPDFList="contractPDFList"
      @close="signURLClose"
    />
    <ChooseContinualProgram
      :chooseProgramVisible="continualVisible"
      :programType="programType"
      @close="continualClose"
      @submit="continualSubmit"
    />
    <SignDetailContinual
      v-if="signDetailContinualVisible"
      :signDetailContinualVisible="signDetailContinualVisible"
      :menteeId="menteeId"
      :signId="signId"
      :orderId="orderId"
      :programId="programId"
      :programType="programType"
      @close="signDetailContinualClose"
      @success="signDetailContinualClose"
      @onlineSuccess="signDetailOnlineSubmit"
    />
  </el-drawer>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant.js'
import apiDic from '@/api/dictionary.js'
import ChooseProgram from "@/views/sales/sign/ChooseProgram";
import SignDetailQuick from "@/views/sales/sign/SignDetailQuick";
import SignDetail from "@/views/sales/sign/SignDetail";
import SignDetailNoBasic from "@/views/sales/sign/SignDetailNobasic"
import SignUrl from '@/views/sales/sign/sign_URL'
import SignUrlSupplementary from '@/views/sales/sign/sign_URL_supplementary'
import ChooseContinualProgram from "@/views/sales/sign/ChooseContinualProgram";
import SignDetailContinual from "@/views/sales/sign/SignDetailContinual";
export default {
  name: 'MenteeSign',
  components:{ChooseProgram,SignDetailQuick,SignDetail,SignDetailNoBasic,SignUrl,SignUrlSupplementary,ChooseContinualProgram,SignDetailContinual},
  mixins: [
    mixins
  ],
  props:{
    menteeSignVisible: {
      type: Boolean,
      default: false
    },
    menteeId:{}
  },
  data: () => {
    return {
      widths:"700px",
      loading:false,

      // 签约
      orderListData:[],
      vipStatus:"",
      hasRedis: false,
      isBasic:"",
      version:"",
      orderType:"",
      chooseProgramVisible:false,
      signType:"normal",
        //非基础项目
      internshipNum: 0,
      oralNum: 0,
      cfaNum: 0,
      financeNum:0,
      graduateNum:0,
      tutoringNum:0,
        // 求职基础项目
      offerList:{},
        // 升学基础项目
      graduateList:{},
      signDetailQuickVisible:false,
      signDetailVisible:false,
      signDetailNoBasicVisible:false,
      urlVisible:false,
      urlSupplementaryVisible:false,
      programId: null,
      orderId:"",
      contractURL: "",
      contractPDFURL: "",
      contractPDFList:{},
      isKeepOrder: false,
        // 续约
      continualVisible: false,
      programType:"",
      signDetailContinualVisible: false,
    }
  },
  watch: {
    menteeSignVisible: function (val, old) {
      if (val) {
        this.pageInit()
      }
    },
  },
  mounted () {
    
  },
  methods: {
    pageInit(){
      api.getOrderListByMenteeId(this.menteeId).then(res => {
        console.log("拿order列表：", res);
        this.orderListData = res.data.orderList;
        this.vipStatus = res.data.isVIP
      });
      apiDic.getRedisByKey(this.menteeId).then(res => {
        console.log("getRedisByKey", this.menteeId, res);
        this.hasRedis = !!res.data.menteeId;
        this.version = res.data.version
        if(res.data.basic && (res.data.basic.programId || res.data.gpBasic.programId)){
          this.isBasic = 1
        }else{
          this.isBasic = 0
        }
      });
    },
    /**
     * @description: 一站式下单
     * @param {*}
     * @return {*}
     */    
    keepOrder() {
      if(this.version != 1){
        this.$message({
          message: "一站式下单版本已更新，原暂存订单已失效，请重新下单"
        });
        return
      }
      console.log('开始暂存订单')
      // this.$emit('keepOrder',this.isBasic)
    },
    /**
     * @description: 
     * @param {*} type
     * @param {*} signType 快捷签约标志quick normal
     * @return {*}
     */
    setOrder(type,signType){
      this.orderType = type
      this.signType = signType
      console.log(this.vipStatus,'是否为vip学员')
      this.chooseProgramVisible = true;
    },
    chooseProgramSubmit(orderType,offerList, graduateList, nobasicList,checkList,signType) {
      this.chooseProgramVisible = false;
      this.internshipNum = nobasicList.internshipNum;
      this.oralNum = nobasicList.oralNum;
      this.cfaNum = nobasicList.cfaNum;
      this.financeNum = nobasicList.financeNum;
      this.tutoringNum = nobasicList.tutoringNum;
      this.offerList = offerList;
      this.graduateList = graduateList;
      this.toDetail(orderType,checkList,signType);
    },
    chooseProgramClose() {
      this.chooseProgramVisible = false;
    },
    //从项目选择跳转到合同详情页
    toDetail(orderType,type,signType) {
      // 判断是否有选择项目
      if( this.offerList.programId && type.indexOf("0") >-1 && orderType == 'new'){
        if(signType == "quick"){
          this.signDetailQuickVisible = true;
        }else if(signType == "normal"){
          this.signDetailVisible = true;
        }
      }else if(this.graduateList.programId && type.indexOf("1") >-1 && orderType == 'new'){
        if(signType == "quick"){
          this.signDetailQuickVisible = true;
        }else if(signType == "normal"){
          this.signDetailVisible = true;
        }
      }else{
        if(this.internshipNum != 0 ||
          this.oralNum != 0 ||
          this.cfaNum != 0 ||
          this.financeNum != 0 || 
          this.graduateNum != 0  ||
          this.tutoringNum !=0
          ){
            console.log("signDetailNoBasicVisible")
            this.signDetailNoBasicVisible = true;
        }
      }
    },
    signDetailSubmit() {
      this.isKeepOrder = false;
      this.signDetailQuickVisible = false
      this.signDetailVisible = false
      this.signDetailNoBasicVisible = false;
      this.pageInit()
    },
    signDetailOnlineSubmit2(signUrl, data){
      console.log(signUrl, data,1111111111111111111111111111111);
      this.isKeepOrder = false;
      this.orderId = data.orderId;
      this.signDetailQuickVisible = false
      this.signDetailVisible = false;
      this.signDetailNoBasicVisible = false;
      this.urlSupplementaryVisible = true;
      this.contractURL = signUrl;
      this.contractPDFList = data;
      this.pageInit()
    },
    signDetailClose() {
      this.isKeepOrder = false;
      this.signDetailQuickVisible = false
      this.signDetailVisible = false
      this.signDetailNoBasicVisible = false
    },
    signURLClose() {
      this.urlVisible = false;
      this.urlSupplementaryVisible = false;
    },
    /**
     * @description: 续约
     * @param {*} v
     * @param {*} orderId
     * @return {*}
     */    
    continual(v, orderId) {
      this.continualVisible = true;
      this.programType = "continual";
      this.signId = v.signId;
      this.orderId = orderId;
    },
    continualClose() {
      this.continualVisible = false;
    },
    continualSubmit(programId) {
      console.log(programId,'1111111111111');
      this.continualClose();
      this.programId = programId;
      this.signDetailContinualVisible = true;
    },
    signDetailOnlineSubmit(signUrl, docUrl) {
      console.log(signUrl, docUrl,111111111111111111111);
      this.signDetailContinualVisible = false;
      this.contractURL = signUrl;
      this.contractPDFURL = docUrl.docList[0].docUrl;
    },
    signDetailContinualClose() {
      this.signDetailContinualVisible = false;
    },
    /**
     * @description: 延长合同
     * @param {*} v
     * @param {*} order
     * @return {*}
     */    
    extension(v, order) {
      this.continualVisible = true;
      this.programType = "extension";
      this.signId = v.signId;
      this.orderId = order.orderId;
    },
    close(){
      Object.assign(this.$data, this.$options.data());
      this.$emit("close")
    },
  }
}

</script>

<style lang="scss" scoped>
.mentee_detail{
  padding:10px 20px;
}
.mentee_record{
  padding:0 20px;
}
.sign_container{
  padding: 10px;
  .dialog_footer{
    padding-top: 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
}
</style>