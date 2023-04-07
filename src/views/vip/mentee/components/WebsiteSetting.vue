<!--
 * @Author: 库建华
 * @Date: 2019-07-30 14:41:14
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-07 17:38:28
 * @Version:
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-drawer
      :title="`学员官网信息`"
      :visible.sync="websiteSettingVisible"
      :size="'600px'"
      :before-close="close"
    >
      <div class="website_container" v-loading="vloading">
        <!-- 官网设置 -->
        <el-form :inline="true" label-width="130px" :model="menteeData" ref="signingForm">
          <el-form-item label="学员登录官网账号: " prop="realName">
            <span v-if="hasAccount">{{account}}</span>
          </el-form-item>
          <template v-if="hasAccount">
            <el-button
              @click="resetPassword"
              v-if="roleInfo.includes(`mentee_website_setting_setPassword`)"
            >重置密码</el-button>
            <el-button type="primary" @click="showCourse">设置课程</el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              @click="accountSubmit"
              v-if="roleInfo.includes(`mentee_website_setting_createAccount`)"
            >创建账号</el-button>
          </template>
        </el-form>

        <el-divider></el-divider>

        <!-- 直播/网申 -->
        <div class="setup_subscription">
          <el-button class="subscription_edit" type="primary" @click="subscribeEdit">编辑</el-button>
          <el-descriptions title="" size="medium" :column='1' :contentStyle="{flex:1}" class="mb10" 
            v-for="(living,i) in setupSubscriptionData.living" :key="i" v-if="setupSubscriptionData.hasLive">
            <template slot="title">
              <p class="">直播 (剩余可推送次数：{{setupSubscriptionData.livingRemainingCount}})</p>
            </template>
            <el-descriptions-item label="标签">
              <el-tag v-for="(item,i) in living.liveTagList" :key="i" type="info" effect="plain" class="setup_tag">{{item}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="行业">
              <el-tag v-for="(item,i) in living.liveIndustriesList" :key="i" type="info" effect="plain" class="setup_tag ">{{item}}</el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <div class="net_application_title">网申 (剩余可推送次数：{{setupSubscriptionData.netApplicationRemainingCount}})</div>
          <el-tabs v-model="netName" type="card" size="mini">
            <el-tab-pane :label="`网申项目${j+1}`" :name="j+''" v-for="(net,j) in setupSubscriptionData.net_application" :key="j">
              <el-descriptions title="" size="medium" :column='1' :contentStyle="{flex:1}">
                <template slot="title">
                  <p class=""></p>
                </template>
                <el-descriptions-item label="申请季">
                  <el-tag v-for="(item,i) in net.applySeasonList" :key="i" type="info" effect="plain" class="setup_tag">{{item}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="国家">
                  <el-tag v-for="(item,i) in net.countryList" :key="i" type="info" effect="plain" class="setup_tag ">{{item}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="地区">
                  <el-tag v-for="(item,i) in net.locationTypeList" :key="i" type="info" effect="plain" class="setup_tag ">{{item}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="工作类型">
                  <el-tag v-for="(item,i) in net.jobTypeList" :key="i" type="info" effect="plain" class="setup_tag ">{{item}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="行业">
                  <el-tag v-for="(item,i) in net.menteeTrackList" :key="i" type="info" effect="plain" class="setup_tag ">{{item}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="学历要求">
                  <el-tag v-for="(item,i) in net.degreeList" :key="i" type="info" effect="plain" class="setup_tag ">{{item}}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </div>

        <el-divider></el-divider>
        
        <!-- 直播/网申申请列表 -->
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="直播" name="live">
            <ul>
              <li class="subscribe_item mb10" v-for="(item,i) in liveList" :key="i" @click="showSubscribe(item)">
                <div class="subscribe_date">
                  <i :class="item.readTime ? 'fa mr10 fa-envelope-open' : 'fa mr10 fa-envelope-o'" aria-hidden="true" ></i> 
                {{item.infoDate}}</div>
                <div class="subscribe_content">
                  <p>{{item.infoTitle}}</p>
                  <p class="subscribe_type">Streaming Lessons</p>
                </div>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="网申提醒" name="apply">
            <ul>
              <li class="subscribe_item mb10" v-for="(item,i) in netApplicationList" :key="i" @click="showSubscribe(item)">
                <div class="subscribe_date">
                  <i :class="item.readTime ? 'fa mr10 fa-envelope-open' : 'fa mr10 fa-envelope-o'" aria-hidden="true" ></i> 
                {{item.infoDate}}</div>
                <div class="subscribe_content">
                  <p>{{item.infoTitle}}</p>
                  <p class="subscribe_type">Application Reminder</p>
                </div>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <!-- 设置课程 -->
    <el-dialog
      title="学员课程设置"
      :close-on-click-modal="false"
      :visible.sync="courseSettingVisible"
      width="800px"
    >
      <el-tree
        v-loading="courseLoading"
        :data="courseTree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
      ></el-tree>
      <div slot="footer"  class="dialog-footer">
        <el-button size="mini" type="primary" v-if="roleInfo.includes(`mentee_website_setting_setCourse`)" @click="courseSubmit">课程提交</el-button>
      </div>
    </el-dialog>

    <!-- 直播/网申申请详情 -->
    <el-dialog
      :title="subscribeTitle"
      :close-on-click-modal="false"
      :visible.sync="subscribeVisible"
      :before-close="dialogClose"
      width="600px"
      
    >
      <div v-loading="detailLoading">
        <div v-if="activeName=='live'">
          <ul>
            <li class="subscribe_detail" v-for="(newArr,i) in subscribeInfo.newArr" :key="i">
              <el-tag class="live_status" :type="newArr.liveStatus=='0'?'info':''">{{newArr.liveStatusName}}</el-tag>
              <el-image
                style="width: 100%; height: auto"
                :src="newArr.liveCover"
                fit="contain">
                  <div slot="error" class="image_slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              <div class="subscribe_detail_content mt10">
                <div class="subscribe_detail_title mb10">{{newArr.liveTitle}}</div>
                <div>{{newArr.liveIntro}}</div>
                <el-divider></el-divider>
                <div><div class="rate_title">Difficulty Level:</div> <el-rate class="rate_level" disabled v-model="newArr.liveStatus"></el-rate> </div>
                <div>{{newArr.planTime}}</div>
              </div>
            </li>
          </ul>
          <el-card class="more_subscribe">
            <div slot="header" class="more_subscribe_title">
              <span>More Streaming Lessons</span>
            </div>
            <div v-for="(otherArr,i) in subscribeInfo.otherArr" :key="i">
              <el-descriptions :title="otherArr.liveTitle" :column='1' class="mb10">
                <el-descriptions-item label="Tags">{{otherArr.tags}}</el-descriptions-item>
                <el-descriptions-item label="Difficulty Level"><el-rate class="rate_level" disabled v-model="otherArr.liveStatus"></el-rate></el-descriptions-item>
                <el-descriptions-item label="Date">{{otherArr.planTime}} | {{otherArr.liveStatusName}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </div>
          </el-card>
        </div>
        <div v-if="activeName=='apply'">
          <ul>
            <li class="application_content" v-for="(newArr,i) in subscribeInfo.newArr" :key="i">
              <el-image v-if="newArr.logo" class="company_logo" :src="newArr.logo" fit="contain"></el-image>
              <el-descriptions :title="newArr.jobName" :column='1' class="mb10">
                <el-descriptions-item label="国家">{{newArr.countryName}}</el-descriptions-item>
                <el-descriptions-item label="公司">{{newArr.companyName}}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{newArr.createTime}}</el-descriptions-item>
                <el-descriptions-item label="截止时间">{{newArr.deadLine ? newArr.deadLine : "官方未注明"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </li>
            <li v-for="(otherArr,i) in subscribeInfo.otherArr" :key="i">
              <el-image v-if="newArr.logo" class="company_logo" :src="otherArr.logo" fit="contain"></el-image>
              <el-descriptions :title="otherArr.jobName" :column='1' class="mb10">
                <el-descriptions-item label="国家">{{otherArr.countryName}}</el-descriptions-item>
                <el-descriptions-item label="公司">{{otherArr.companyName}}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{otherArr.createTime}}</el-descriptions-item>
                <el-descriptions-item label="截止时间">{{otherArr.deadLine ? otherArr.deadLine : "官方未注明"}}</el-descriptions-item>
              </el-descriptions>
              <el-divider></el-divider>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>

    <WebsiteSettingEdit 
      :subscribeEditVisible="subscribeEditVisible" 
      :subscribeData="subscribeData" 
      @close="subscribeEditClose" 
      @submit="subscribeEditSubmit" 
    />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import WebsiteSettingEdit from './WebsiteSettingEdit.vue'
import {mapState} from 'vuex'
export default {
  components: {WebsiteSettingEdit},
  props: {
    websiteSettingVisible: {
      type: Boolean,
      default: false
    },
    menteeData: {
      type: Object
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      vloading:false,
      listData: [],
      tree: [],
      checkedKeys: [],
      account: '',
      multipleSelection: [],
      hasAccount: false,

      setupSubscriptionData:{
        hasLive:false,
        livingRemainingCount:0,
        netApplicationRemainingCount:0,
        living:[],
        net_application:[],
      },
      netName:'0',
      liveTagList:[],
      liveIndustriesList:[],
      applySeasonList:[],
      countryList:[],
      locationTypeList:[],
      jobTypeList:[],
      menteeTrackList:[],
      degreeList:[],

      activeName:"live",
      liveList:[],
      netApplicationList:[],
      
      // 课程设置
      courseSettingVisible:false,
      courseLoading:false,
      courseTree:[],
      checkedKeys: [],

      // 直播/网申申请详情
      detailLoading:false,
      subscribeVisible:false,
      subscribeTitle:"",
      subscribeInfo:{},

      // 订阅编辑
      subscribeEditVisible : false,
      subscribeData:{},
    }
  },
  watch: {
    websiteSettingVisible: function (val, old) {
      if (val) {
        this.account = this.menteeData.webAccount
        this.hasAccount = !!this.menteeData.account
        this.Topage()
      }
    }
  },
  mounted () {
    this.account = this.menteeData.webAccount
    this.hasAccount = !!this.menteeData.account
    this.Topage()
  },
  methods: {
    async Topage () {
      this.vloading = true
      await this.getMenteeSettingDetail()
      await this.getMenteeSubscribeList("living")
      await this.getMenteeSubscribeList("net_application")
      this.vloading = false
    },

    async getMenteeSettingDetail(){
      await api.getMenteeSettingDetailV2({menteeId:this.menteeData.menteeId}).then(res => {
        console.log("getMenteeSettingDetailV2",res)
        this.subscribeData = JSON.parse(JSON.stringify(res.data))
        this.setupSubscriptionData = {
          hasLive:res.data.hasLive,
          livingRemainingCount:res.data.setting.livingRemainingCount,
          netApplicationRemainingCount:res.data.setting.netApplicationRemainingCount,
          living:[],
          net_application:[],
        }
        const resLiving = res.data.setting.living
        for(let i=0; i<resLiving.length; i++){
          this.setupSubscriptionData.living[i] = {liveTagList:[],liveIndustriesList:[]}
          resLiving[i].forEach(v => {
            switch (v.subType){
              case "live_industries":
                this.setupSubscriptionData.living[i].liveIndustriesList.push(res.data.live_industries.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
              case "live_tag":
                this.setupSubscriptionData.living[i].liveTagList.push(res.data.live_tag.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
            }
          })
        }
        const resNet = res.data.setting.net_application
        for(let i=0; i<resNet.length; i++){
          this.setupSubscriptionData.net_application[i] = {applySeasonList:[],countryList:[],locationTypeList:[],jobTypeList:[],menteeTrackList:[],degreeList:[]}
          resNet[i].forEach(v => {
            switch (v.subType){
              case "apply_season":
                this.setupSubscriptionData.net_application[i].applySeasonList.push(res.data.apply_season.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
              case "country":
                this.setupSubscriptionData.net_application[i].countryList.push(res.data.country.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
              case "location_type":
                this.setupSubscriptionData.net_application[i].locationTypeList.push(res.data.location_type.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
              case "job_type":
                this.setupSubscriptionData.net_application[i].jobTypeList.push(res.data.job_type.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
              case "mentee_track":
                this.setupSubscriptionData.net_application[i].menteeTrackList.push(res.data.mentee_track.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
              case "degree":
                this.setupSubscriptionData.net_application[i].degreeList.push(res.data.degree.filter((f) => {
                  if(f.itemValue == v.subKey){return f}
                })[0].itemName)
                break
            }
          })
        }
      })
    },

    async getMenteeSubscribeList(type){
      let params = {
        menteeId:this.menteeData.menteeId,
        infoType:type,
        pageNum: 1,
        pageSize: 999,
      }
      await api.getMenteeSubscribeList(params).then(res => {
        console.log("getMenteeSubscribeList",res)
        if(type == "living"){
          this.liveList = res.data.rows
        }else if(type == "net_application"){
          this.netApplicationList =  res.data.rows
        }
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    close () {
      this.$refs.signingForm.resetFields()
      Object.assign(this.$data, this.$options.data());
      this.$emit('close')
    },
    accountSubmit () {
      if (!this.menteeData.wxId) {
        this.$message({
          type: 'warning',
          message: '创建的官网账号不可为空'
        })
        return
      }
      api.createWebsiteAccountByMenteeId(this.menteeData.menteeId, {
        menteeAcc: this.menteeData.wxId,
        nickName: this.menteeData.realName
      }).then(() => {
        // this.$message({
        //   type: 'warning',
        //   message: '账号创建成功，请确认绑定课程并提交'
        // })
        // this.courseSubmit();
        this.hasAccount = true
        this.$emit('submit')
      })
      .catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    courseSubmit () {
      if (!this.hasAccount) {
        this.$message({
          type: 'error',
          message: '请先创建账户'
        })
        return
      }
      const courseIds = this.$refs.tree.getCheckedKeys().join()
      api
        .setMenteeCourseListByMenteeId(this.menteeData.menteeId, {
          courseIds: courseIds
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.close()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败' + err
          })
        })
    },
    /**
     * @description: 重置密码
     * @param {*}
     * @return {*}
     */    
    resetPassword () {
      api.resetPasswordByMenteeId(this.menteeData.menteeId).then(() => {
        this.$message({
          type: 'success',
          message: '重置成功'
        })
      })
    },
    /**
     * @description: 编辑学员课程
     * @param {*}
     * @return {*}
     */    
    showCourse(){
      this.courseTree = []
      this.checkedKeys = []
      this.courseSettingVisible = true
      this.courseLoading = true
      api.getCourseTreeByMenteeId(this.menteeData.menteeId).then(res => {
        this.courseLoading = false
          console.log(res);
          this.courseTree = res.data.tree;
          this.checkedKeys = res.data.checkedKeys;
          var checkedKeys = res.data.checkedKeys;
          //设置不可选择，根据disableKeys
          function setDisable(tree) {
            tree.forEach(v => {
              if (checkedKeys.includes(v.id)) {
                v.disabled = true;
              }
              if (v.children) {
                setDisable(v.children);
              }
            });
          }
          //设置所有不可选择，但展示已选中的项（checkedKeys）
          function setAllDisable(tree) {
            tree.forEach(v => {
              v.disabled = true;
              if (v.children) {
                setAllDisable(v.children);
              }
            });
          }
          if (this.roleInfo.includes(`mentee_website_setting_setCourse`)) {
            setDisable(this.courseTree);
            } else {
            setAllDisable(this.courseTree);
          }
        })
        .then(() => {
          this.$nextTick().then(() => {
            this.$refs.tree.setCheckedKeys(this.checkedKeys); //设置选中的；
          });
        })
        .catch(err=>{
          this.$message({
            type:'error',
            message:'数据请求出错！！' + err
          })
        });
    },
    /**
     * @description: 学员课程提交
     * @param {*}
     * @return {*}
     */    
    courseSubmit() {
      if (!this.hasAccount) {
        this.$message({
          type: "error",
          message: "请先创建账户"
        });
        return;
      }
      let courseIds = this.$refs.tree.getCheckedKeys().join();
      api
        .setMenteeCourseListByMenteeId(this.menteeData.menteeId, {
          courseIds: courseIds
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.courseSettingVisible = false
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "提交失败"+err
          });
        });
    },
    /**
     * @description: 订阅编辑
     * @param {*}
     * @return {*}
     */    
    subscribeEdit(){
      this.subscribeEditVisible = true
    },
    subscribeEditClose(){
      this.subscribeEditVisible = false
    },
    subscribeEditSubmit(){
      this.Topage()
      this.subscribeEditVisible = false
    },
    selectable1 (row, index) {
      return !row.isDisabled
    },
    tabClick(){
      this.subscribeInfo={}
    },
    showSubscribe(item){
      this.subscribeVisible = true
      this.detailLoading = true
      api.getMenteeSubscribeDetail({pkId:item.pkId}).then(res => {
        this.detailLoading = false
        this.subscribeTitle = item.infoDate+" 详情"
        this.subscribeInfo = res.data
        this.subscribeInfo.newArr.forEach(v => {
          v.liveStatus = parseInt(v.liveStatus)
        })
        this.subscribeInfo.otherArr.forEach(v => {
          v.liveStatus = parseInt(v.liveStatus)
        })
      })
    },
    dialogClose(){
      this.subscribeVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.el-divider--horizontal{
  margin: 12px 0;
}
.website_container{
  padding:0 20px;
  .setup_subscription{
    position: relative;
    .subscription_edit{
      position:absolute;
      top:0;
      right:0;
    }
  }
  .net_application_title{
    width:100%;
    font-size: 16px;
    font-weight: bold;
    height:30px;
  }
  .setup_tag{
    margin-right:10px;
    margin-bottom:5px;
  }
  .subscribe_item{
    display: flex;
    width:100%;
    padding: 10px;
    border: 1px rgba(0, 0, 0, 0.1) solid;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .subscribe_date{
      width:30%;
      margin-right:9%;
      text-align: center;
      border-right: 1px rgba(0, 0, 0, 0.5) solid;;
    }
    .subscribe_content{
      width:60%
    }
    .subscribe_type{
      font-size:12px;
      color:rgba(0, 0, 0, 0.5)
    }
  }
}
.subscribe_detail{
  position: relative;
  margin-bottom:20px;
  .live_status{
    position: absolute;
    top:10px;
    right:10px;
    z-index: 1000;
  }
  .subscribe_detail_content{
    padding:0 20px;
  }
  .subscribe_detail_title{
    font-size:20px;
    font-weight:bold;
    color:#000;
  }
  ::v-deep .image_slot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    background: #f5f7fa;
    color: #909399;
    i{
      font-size:60px;
    }
  }
  .rate_title{
    display: inline-block;
    height:20px;
  }
  .rate_level{
    display: inline-block;
  }
  
}
::v-deep .el-card__header{
    background-color: #f5f7fa;
  }
.application_content{
  position: relative;
  .company_logo{
    position: absolute;
    width:auto;
    height:30px;
    top:0;
    right:0;
  }
}
</style>
