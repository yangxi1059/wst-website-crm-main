<!--
 * @Author: kaan
 * @Date: 2022-01-06 14:24:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-10 17:14:15
 * @Version: 
 * @Description: 
-->

<template>
  <el-drawer
    :visible.sync="menteeInfoVisible"
    :size="widths"
    :before-close="close"
  >
    <template slot="title" >
      <div  >
        <span>学员信息</span>
        <el-tag class="ml10" size="meduim" type="danger" v-if="menteeDetail.spyStatus == 1">是SPY</el-tag>
      </div>
    </template>
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
            <el-descriptions-item label="是否spy">
              <span v-if="menteeDetail.spyStatus == 0">{{menteeDetail.spyStatusName || '暂无'}}</span>
              <span style="color:#F56C6C" v-if="menteeDetail.spyStatus == 1">{{menteeDetail.spyStatusName || '暂无'}}</span>
            </el-descriptions-item>
            <el-descriptions-item label="是否有效咨询">{{menteeDetail.effectiveConsultingName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="渠道">{{menteeDetail.channelName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="来源">{{menteeDetail.sourceName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="合作商活动" v-if="menteeDetail.cooperatorActivityInfo && menteeDetail.cooperatorActivityInfo.activityId">
              {{menteeDetail.cooperatorActivityInfo.activityName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="推荐人姓名">{{menteeDetail.recommender || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="是否VIP同事推荐">{{menteeDetail.vipRecommendStatusName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="VIP同事推荐人" v-if="menteeDetail.vipRecommendStatus == 1">
              {{menteeDetail.vipRecommenderName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="首次联系日期">{{menteeDetail.firstAskDate || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="导流微信号">{{menteeDetail.sourceWxName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="特殊性质(家长/讲座等)">{{menteeDetail.specialNature || '暂无'}}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions :column="2" :contentStyle="{flex:1}" class="mb10">
            <template slot="title">
              <p>顾问分配<el-button type="primary" class="ml10" @click="menteeDetailEdit(2)">激活</el-button></p>
            </template>
            <el-descriptions-item label="激活人">{{menteeDetail.activateArr.length > 0 ? menteeDetail.activateArr[0].activateByName : '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="激活时间">{{menteeDetail.activateArr.length > 0 ? menteeDetail.activateArr[0].activateTime : '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="是否分配顾问">{{menteeDetail.counselorStatusName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="分配部门">{{menteeDetail.counselorGroup || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="分配顾问">{{menteeDetail.counselorName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="顾问微信">{{menteeDetail.counselorWxName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="分配日期">{{menteeDetail.counselorDate || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="签约状态">{{menteeDetail.signStatusName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="帮聊" :span="24">{{menteeDetail.helpChatName || '暂无'}}</el-descriptions-item>
            <el-descriptions-item label="激活截图">
              <el-image style="width: 120px; height: 120px" fit="contain"
                v-if="menteeDetail.activateArr.length > 0"
                :src="menteeDetail.activateArr[0].activateUrl" 
                :preview-src-list="[menteeDetail.activateArr[0].activateUrl]" ></el-image>
              <div  v-else>暂无</div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文档" name="1">
      </el-tab-pane>
      <el-tab-pane label="Follow Up" name="2">
        <Follow
          :followVisible="followVisible"
          :menteeId = "menteeId"
        />
      </el-tab-pane>
      <el-tab-pane label="学员记录" name="3">
        <el-timeline class="mentee_record">
          <el-timeline-item v-for="item in eventArr" :key="item.pkId" :timestamp="item.eventDate" type="primary" placement="top">
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

    <menteeDetail 
      :menteeDetailVisible = "menteeDetailVisible" 
      :menteeEditType = "menteeEditType"
      :menteeData = "menteeDetail"
      @success="menteeDetailSuccess"
      @close="menteeDetailClose"
    />
  </el-drawer>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/assistant.js'
import MenteeDetail from './MenteeDetail'
import Follow from './Follow'
export default {
  name: 'MenteeInfo',
  components:{MenteeDetail,Follow},
  mixins: [
    mixins
  ],
  props:{
    menteeInfoVisible: {
      type: Boolean,
      default: false
    },
    menteeId:{}
  },
  data: () => {
    return {
      widths:"700px",
      activeName:'0',
      menteeDetail:{activateArr:[]},
      loading:false,

      menteeDetailVisible : false,
      menteeEditType:"",

      followVisible:false,

      eventArr:[],
    }
  },
  watch: {
    menteeInfoVisible: function (val, old) {
      if (val) {
        this.getMenteeDataByMenteeId()
        this.getMenteeEventArr()
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
    this.pageInit()
  },
  methods: {
    pageInit(){},
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
        if(this.menteeDetail.spyStatus == '1'){
          this.$alert('此学员是SPY', '提示', {
            confirmButtonText: '确定',
          })
        }
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
     * @description: 获取学员记录
     * @param {*}
     * @return {*}
     */    
    getMenteeEventArr(){
      api.getMenteeEventArr(this.menteeId).then(res => {
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
</style>