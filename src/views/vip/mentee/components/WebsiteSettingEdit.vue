<!--
 * @Author: kaan
 * @Date: 2022-03-01 15:57:17
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-02 18:08:35
 * @Version: 
 * @Description: 
-->
<template>
  <el-dialog
    title="订阅课程编辑"
    v-if="subscribeEditVisible"
    :visible.sync="subscribeEditVisible"
    width="800px"
    :close-on-click-modal="false"
    :before-close="close"
    append-to-body
  >
    <div v-loading="loading">
      <el-form  label-width="100px"  >
        <div class="subscribe_mark"><i class="el-icon-warning"></i> CRM上设置学生订阅不会触发小程序推送，需学生手动订阅。</div>
        <div class="subscribe_living" v-if="editData.hasLive">
          <div class="subscribe_title">直播</div>
          <div v-for="(data,i) in livingData" :key="i">
            <el-form-item label="标签">
              <el-checkbox-group v-model="data.liveTagList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.live_tag" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="行业">
              <el-checkbox-group v-model="data.liveIndustriesList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.live_industries" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
        <div class="subscribe_net">
          <div class="subscribe_title">网申</div>
          <div class="subscribe_net_card" v-for="(data,i) in netData" :key="i">
            <div class="subscribe_net_title">项目{{i+1}}</div>
            <el-button type="danger" class="subscribe_net_del" size="mini" icon="el-icon-delete" @click="netDel(i)"></el-button>
            <el-form-item label="申请季">
              <el-checkbox-group v-model="data.applySeasonList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.apply_season" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="国家">
              <el-checkbox-group v-model="data.countryList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.country" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="地区">
              <el-checkbox-group v-model="data.locationTypeList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in location_type" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="工作类型">
              <el-checkbox-group v-model="data.jobTypeList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.job_type" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="行业">
              <el-checkbox-group v-model="data.menteeTrackList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.mentee_track" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="学历要求">
              <el-checkbox-group v-model="data.degreeList" size="small">
                <el-checkbox :label="item.itemValue" border v-for="(item,j) in editData.degree" :key="item.itemValue">{{item.itemName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="dialog_footer">
        <el-button type="primary" @click="addNet">新增项目</el-button>
        <el-button type="primary" @click="submit">课程提交</el-button>
      </div>
    </div>
    
  </el-dialog>
    
</template>

<script>
import api from "@/api/vip";
import files from '@/libs/file'
export default {
  props: {
    subscribeEditVisible: {
      type: Boolean,
      default: false,
    },
    subscribeData:{
      type: Object,
    },
  },
  data: () => {
    return {
      checkList: ['选中且禁用','复选框 A'],
      loading:false,
      // 地区写死 特殊处理
      location_type:[{
        dicLabel: "internship_location_type",
        itemName: "远程",
        itemNameEng: "远程",
        itemValue: "远程",
      },{
        dicLabel: "internship_location_type",
        itemName: "实地",
        itemNameEng: "实地",
        itemValue: "实地",
      }],
      editData:{
        liveTagList:[],
        liveIndustriesList:[],
        applySeasonList:[],
        countryList:[],
        locationTypeList:[],
        jobTypeList:[],
        menteeTrackList:[],
        degreeList:[],
      },
      livingData:[{liveTagList:[],liveIndustriesList:[]}],
      netData:[],
    }
  },
  watch: {
    subscribeEditVisible: function (val) {
      if (val) {
        this.Topage(JSON.parse(JSON.stringify(this.subscribeData)))
      }
    },
  },
  methods: {
    // if(this.livingData[i].liveTagList.indexOf(v.subKey) > -1){break} 脏数据去重
    Topage(subscribeData){
      this.editData = subscribeData
      console.log(this.editData)
      const resLiving = subscribeData.setting.living
      for(let i=0; i<resLiving.length; i++){
        this.livingData = [{liveTagList:[],liveIndustriesList:[]}]
        resLiving[i].forEach(v => {
          switch (v.subType){
            case "live_tag":
              if(this.livingData[i].liveTagList.indexOf(v.subKey) > -1){break}
              this.livingData[i].liveTagList.push(subscribeData.live_tag.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
            case "live_industries":
              if(this.livingData[i].liveIndustriesList.indexOf(v.subKey) > -1){break}
              this.livingData[i].liveIndustriesList.push(subscribeData.live_industries.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
          }
        })
      }
      const resNet = subscribeData.setting.net_application
      this.netData = []
      for(let i=0; i<resNet.length; i++){
        this.netData.push ({applySeasonList:[],countryList:[],locationTypeList:[],jobTypeList:[],menteeTrackList:[],degreeList:[]})
        resNet[i].forEach(v => {
          switch (v.subType){
            case "apply_season":
              if(this.netData[i].applySeasonList.indexOf(v.subKey) > -1){break}
              this.netData[i].applySeasonList.push(subscribeData.apply_season.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
            case "country":
              if(this.netData[i].countryList.indexOf(v.subKey) > -1){break}
              this.netData[i].countryList.push(subscribeData.country.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
            case "location_type":
              if(this.netData[i].locationTypeList.indexOf(v.subKey) > -1){break}
              this.netData[i].locationTypeList.push(this.location_type.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
            case "job_type":
              if(this.netData[i].jobTypeList.indexOf(v.subKey) > -1){break}
              this.netData[i].jobTypeList.push(subscribeData.job_type.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
            case "mentee_track":
              if(this.netData[i].menteeTrackList.indexOf(v.subKey) > -1){break}
              this.netData[i].menteeTrackList.push(subscribeData.mentee_track.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
            case "degree":
              if(this.netData[i].degreeList.indexOf(v.subKey) > -1){break}
              this.netData[i].degreeList.push(subscribeData.degree.filter((f) => {
                if(f.itemValue == v.subKey){return f}
              })[0].itemValue)
              break
          }
        })
      }
      console.log(this.netData)
    },
    netDel(i){
      this.$confirm(`是否确认删除项目${i+1}？`, '提示').then(v => {
        this.netData.splice(i,1)
      })
    },
    addNet(){
      this.netData.push ({applySeasonList:[],countryList:[],locationTypeList:[],jobTypeList:[],menteeTrackList:[],degreeList:[]})
    },
    submit(){
      let params={
        menteeId:this.$route.query.menteeId,
        liveGroupArr:[],
        netApplicationGroupArr:[]
      }
      for(let i=0; i<this.livingData.length; i++){
        params.liveGroupArr.push([])
        this.livingData[i].liveTagList.forEach(v => {
          this.editData.live_tag.filter((f) => {
            if(f.itemValue == v){
              params.liveGroupArr[i].push({
                subFor:"living",
                subGroup: i+1,
                subType:"live_tag",
                subKey: v,
              })
            }
          })
        })
        this.livingData[i].liveIndustriesList.forEach(v => {
          this.editData.live_industries.filter((f) => {
            if(f.itemValue == v){
              params.liveGroupArr[i].push({
                subFor:"living",
                subGroup: i+1,
                subType:"live_industries",
                subKey: v,
              })
            }
          })
        })
      }
      for(let i=0; i<this.netData.length; i++){
        params.netApplicationGroupArr.push([])
        this.netData[i].applySeasonList.forEach(v => {
          this.editData.apply_season.filter((f) => {
            if(f.itemValue == v){
              params.netApplicationGroupArr[i].push({
                subFor:"net_application",
                subGroup: i+1,
                subType:"apply_season",
                subKey: v,
              })
            }
          })
        })
        this.netData[i].countryList.forEach(v => {
          this.editData.country.filter((f) => {
            if(f.itemValue == v){
              params.netApplicationGroupArr[i].push({
                subFor:"net_application",
                subGroup: i+1,
                subType:"country",
                subKey: v,
              })
            }
          })
        })
        this.netData[i].locationTypeList.forEach(v => {
          this.location_type.filter((f) => {
            if(f.itemValue == v){
              params.netApplicationGroupArr[i].push({
                subFor:"net_application",
                subGroup: i+1,
                subType:"location_type",
                subKey: v,
              })
            }
          })
        })
        this.netData[i].jobTypeList.forEach(v => {
          this.editData.job_type.filter((f) => {
            if(f.itemValue == v){
              params.netApplicationGroupArr[i].push({
                subFor:"net_application",
                subGroup: i+1,
                subType:"job_type",
                subKey: v,
              })
            }
          })
        })
        this.netData[i].menteeTrackList.forEach(v => {
          this.editData.mentee_track.filter((f) => {
            if(f.itemValue == v){
              params.netApplicationGroupArr[i].push({
                subFor:"net_application",
                subGroup: i+1,
                subType:"mentee_track",
                subKey: v,
              })
            }
          })
        })
        this.netData[i].degreeList.forEach(v => {
          this.editData.degree.filter((f) => {
            if(f.itemValue == v){
              params.netApplicationGroupArr[i].push({
                subFor:"net_application",
                subGroup: i+1,
                subType:"degree",
                subKey: v,
              })
            }
          })
        })
      }
      console.log(params)
      this.loading = true
      api.setMenteeSettingV2(params).then(res => {
        console.log(res)
        this.loading = false
        this.$emit('submit')
      })
    },
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.subscribe_mark{
  font-size:20px;
  color:red;
  margin-bottom:10px;
  text-align: center;
}
::v-deep .el-checkbox.is-bordered + .el-checkbox.is-bordered{
  margin-bottom:5px;
  margin-left:0
}
.subscribe_net_card{
  position: relative;
  padding-top:10px;
  border-top:1px solid #ededed;
  .subscribe_net_title{
    height: 30px;
  }
  .subscribe_net_del{
    position: absolute;
    top:10px;
    right:0;
  }
}
.subscribe_title{
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  height: 30px;
}
.dialog_footer{
  padding-top: 10px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>