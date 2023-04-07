<!--
 * @Author: kaan
 * @Date: 2022-01-06 14:24:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-10 17:15:28
 * @Version: 
 * @Description: 
-->

<template>
  <el-drawer
    :title="`学员信息`"
    :visible.sync="menteeInfoVisible"
    :size="widths"
    :before-close="close"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="学员详情" name="0">
        <div class=" mentee_detail" v-loading="loading">
          <el-descriptions  :column="2" :contentStyle="{flex:1}" class="mb10">
            <template slot="title">
              <p>基本信息<el-button type="primary" class="ml10" @click="menteeDetailEdit(0)">编辑</el-button></p>
            </template>
            <el-descriptions-item label="学生ID">{{menteeDetail.menteeId || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学生微信名">{{menteeDetail.wxName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学生微信ID">{{menteeDetail.wxId || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="性别">{{menteeDetail.sexName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="身份">{{menteeDetail.menteeType || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="电话">{{menteeDetail.telephone || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学校（高中）">{{menteeDetail.hignSchoolName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学校（大学）">{{menteeDetail.schoolName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学校（研究生）">{{menteeDetail.graduateSchoolName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{menteeDetail.email || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学历">{{menteeDetail.degreeName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="毕业年份">{{menteeDetail.finishYear || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="专业">{{menteeDetail.majorName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="研究生专业">{{menteeDetail.graduateMajorName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="国家/地区">{{menteeDetail.countryName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="当前在职公司" v-if="menteeDetail.intention && menteeDetail.intention.includes('EC')">
              {{menteeDetail.workCompany || '暂无'}}
            </el-descriptions-item>
            <el-descriptions-item label="咨询方向">{{menteeDetail.consultingDirectionName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="咨询进度">{{menteeDetail.note || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="备注">{{menteeDetail.askFor || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长1微信名">{{menteeDetail.parentWxName1 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长1微信ID">{{menteeDetail.parentWx1 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长1性别">{{menteeDetail.parentSexName1 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长1备注">{{menteeDetail.parentRemark1 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长2微信名">{{menteeDetail.parentWxName2 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长2微信ID">{{menteeDetail.parentWx2 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长2性别">{{menteeDetail.parentSexName2 || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="家长2备注">{{menteeDetail.parentRemark2 || '暂无'}}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions :column="2" :contentStyle="{flex:1}" class="mb10">
            <template slot="title">
              <p>渠道来源<el-button type="primary" class="ml10" @click="menteeDetailEdit(1)">修改</el-button></p>
            </template>
            <el-descriptions-item label="是否有效咨询">{{menteeDetail.effectiveConsultingName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="是否VIP同事推荐">{{menteeDetail.vipRecommendStatusName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="帮聊">{{menteeDetail.helpChatName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="VIP同事推荐人" v-if="menteeDetail.vipRecommendStatus == 1">
              {{menteeDetail.vipRecommenderName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="特殊性质(家长/讲座等)">{{menteeDetail.specialNature || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="购买力">{{menteeDetail.purchasingPowerScore || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="求职项目意向度">{{menteeDetail.careerIntentionScore || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="求职内容感兴趣度">{{menteeDetail.careerAttractionScore || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="用户背景与WST产品契合度">{{menteeDetail.wstIntegratingScore || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学生渠道评分">{{menteeDetail.sourceFromScore || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="学生渠道评价">{{menteeDetail.sourceFromNote || '暂无'}}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions :column="2" :contentStyle="{flex:1}" class="mb10">
            <template slot="title">
              <p>顾问分配</p>
            </template>
            <el-descriptions-item label="是否分配顾问">{{menteeDetail.counselorStatusName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="分配部门">{{menteeDetail.counselorGroup || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="分配顾问">{{menteeDetail.counselorName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="顾问微信">{{menteeDetail.counselorWxName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="分配日期">{{menteeDetail.counselorDate || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="签约状态">{{menteeDetail.signStatusName || '暂无'}}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      <el-tab-pane label="签约" name="1">
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
      </el-tab-pane>
      <el-tab-pane label="Follow Up" name="2">
        <Follow
          :followVisible="followVisible"
          :menteeData = "menteeDetail"
        />
      </el-tab-pane>
      <el-tab-pane label="文档" name="3">
        
      </el-tab-pane>
      <el-tab-pane label="学员记录" name="4">
        <el-timeline class="mentee_record">
          <el-timeline-item v-for="(item) in eventArr" :key="item.pkId" :timestamp="item.eventDate" type="primary" placement="top">
            <el-card>
              <div style="display:flex;fontw-weight:600;color:#303133">
                <div style="display:flex">
                  <div style="width:100px">创建人：</div>
                  <div style="width:200px">{{item.createByName}}</div>
                </div>
                <div style="display:flex">
                  <div style="width:100px">事件类型：</div>
                  <div>{{item.eventTypeName}}</div>
                </div>
              </div>
              <div v-if="item.eventContent">
                <div style="display:flex;margin-top:10px" v-for="(detail,j) in JSON.parse(item.eventContent)" :key="j">
                  <div style="width:100px" >{{detail.label}}:</div>
                  <div >{{detail.value}}</div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>

    <MenteeDetail 
      :menteeDetailVisible = "menteeDetailVisible" 
      :menteeEditType = "menteeEditType"
      :menteeData = "menteeDetail"
      @success="menteeDetailSuccess"
      @close="menteeDetailClose"
    />
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
import MenteeDetail from './MenteeDetail'
import ChooseProgram from "../../sign/ChooseProgram";
import SignDetailQuick from "../../sign/SignDetailQuick";
import SignDetail from "../../sign/SignDetail";
import SignDetailNoBasic from "../../sign/SignDetailNobasic"
import SignUrl from '../../sign/sign_URL'
import SignUrlSupplementary from '../../sign/sign_URL_supplementary'
import ChooseContinualProgram from "../../sign/ChooseContinualProgram";
import SignDetailContinual from "../../sign/SignDetailContinual";
import Follow from './Follow'
export default {
  name: 'MenteeInfo',
  components:{MenteeDetail,Follow,ChooseProgram,SignDetailQuick,SignDetail,SignDetailNoBasic,SignUrl,SignUrlSupplementary,ChooseContinualProgram,SignDetailContinual},
  mixins: [
    mixins
  ],
  props:{
    menteeInfoVisible: {
      type: Boolean,
      default: false
    },
    menteeInfo:{}
  },
  data: () => {
    return {
      widths:"700px",
      activeName:'0',
      menteeDetail:{activateArr:[]},
      loading:false,

      menteeDetailVisible : false,
      menteeEditType:"",
      menteeId:"",
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
      // Follow Up
      followVisible:false,
      // 学员记录
      eventArr:[],
    }
  },
  watch: {
    menteeInfoVisible: function (val, old) {
      if (val) {
        this.menteeId = this.menteeInfo.menteeId
        this.getMenteeDataByMenteeId()
        this.getMenteeEventArr()
        this.pageInit()
      }
    },
    activeName: function (val,old) {
      console.log(val)
      switch(val){
        case '0':
          this.widths = '700px'
          break;
        case '1':
          this.widths = '700px'
          break;
        case '2':
          this.widths = '1000px'
          break;
        case '3':
          this.widths = '700px'
          break;
      }
    }
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
    handleClick(){
      this.activeName == 2 ? this.followVisible = true : this.followVisible = false
    },
    /**
     * @description: 获取用户信息
     * @param {*}
     * @return {*}
     */    
    getMenteeDataByMenteeId() {
      console.log(this.menteeId)
      this.loading = true
      api.getMenteeDataByMenteeId(this.menteeId).then(res => {
        console.log("学员详情yx*****销售助理录入111111111111111111", res.data);
        this.loading = false
        let timeStamp = Date.parse(new Date(res.data.firstAskDate))
        let timeStamp2 = Date.parse(new Date())
        if(timeStamp+3600*24*1000*7 <= timeStamp2){
          this.checkTimeStatus = false;
        }else{
          this.checkTimeStatus = true;
        }
        this.menteeDetail = {};
        this.menteeDetail = res.data;
        let intention = [];
        this.menteeDetail.intention &&
          this.menteeDetail.intention.forEach(v => {
            intention.push(v.intention);
          });
        this.menteeDetail.intention = intention;
        // 学校
        let schoolTarget = [];
        this.menteeDetail.schoolTarget &&
          this.menteeDetail.schoolTarget.forEach(v => {
            schoolTarget.push(v.targetName);
          });
        this.menteeDetail.schoolTarget = schoolTarget;
        // 地区
        let regionTarget = [];
        this.menteeDetail.regionTarget &&
          this.menteeDetail.regionTarget.forEach(v => {
            regionTarget.push(v.targetName);
          });
        this.menteeDetail.regionTarget = regionTarget;
        // 专业
        let majorTarget = [];
        this.menteeDetail.majorTarget &&
          this.menteeDetail.majorTarget.forEach(v => {
            majorTarget.push(v.targetName);
          });
        this.menteeDetail.majorTarget = majorTarget;
      });
    },
    /**
     * @description: 用户信息编辑
     * @param {*} i 0基本信息 1修改渠道 2激活
     * @return {*}
     */    
    menteeDetailEdit(i){
      this.menteeEditType = i 
      this.menteeDetailVisible = true
    },
    menteeDetailSuccess(){
      this.getMenteeDataByMenteeId()
      this.menteeDetailVisible = false
    },
    menteeDetailClose(){
      this.menteeDetailVisible = false
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
    /**
     * @description: 获取学员记录
     * @param {*}
     * @return {*}
     */    
    getMenteeEventArr(){
      apiDic.getMenteeEventArr(this.menteeId).then(res => {
        this.eventArr = res.data;
      })
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