<!--
 * @Author: kaan
 * @Date: 2021-06-22 20:27:42
 * @LastEditors: Kaan
 * @LastEditTime: 2022-05-26 16:29:43
 * @Version: 
 * @Description: 
-->
<template>
  <div class="create-cant-program-model components-model" v-if="tutoringVisible">
    <div class="program-model-title" >课业辅导项目</div>
    <el-form
      :inline="true"
      size="mini"
      :rules="rules"
      ref="tutoringProgram"
      label-width="180px"
      :model="tutoringProgram"
    >
      <el-form-item :label="'课业辅导项目'" prop="programId">
        <el-select
          v-model="tutoringProgram.programId"
          filterable
          placeholder="请选择课业辅导项目"
          :style="{width:widthInput}"
          @change="changeTutoringOption(tutoringProgram.programId)"
        >
          <el-option
            v-for="item in tutoringList"
            :key="item.programId"
            :label="item.programName"
            :value="item.programId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Strategist"
        prop="strategist"
        v-if="(tutoringProgram.signVip == 'Strategist' || tutoringProgram.signVip == 'ALL') && signType !=='quick'"
      >
        <el-select
          :style="{width:widthInput}"
          v-model="tutoringProgram.strategist"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in vipList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Program Manager"
        prop="services"
        v-if="(tutoringProgram.signVip == 'Program_Manager' || tutoringProgram.signVip == 'ALL') && signType !=='quick'"
      >
        <el-select
          :style="{width:widthInput}"
          v-model="tutoringProgram.services"
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
      <el-form-item label="项目周期:">
        <span
          :style="{width:widthSpan}"
          class="programName"
        >{{tutoringProgram.period}}-{{tutoringProgram.periodUnit}}</span>
      </el-form-item>
      <el-form-item label="课业辅导价格(￥)" prop>
        <span class="programName" :style="{width:widthSpan}">{{tutoringProgram.priceCny}}</span>
      </el-form-item>
      <el-form-item label="官方价格($):">
        <span :style="{width:widthSpan}" class="programName">{{tutoringProgram.priceUsd}}</span>
      </el-form-item>
      <el-form-item label="课业辅导课时数:">
        <span :style="{width:widthSpan}" class="programName">{{tutoringProgram.tutoringMentorHour}}</span>
      </el-form-item>
      <el-form-item label="课业辅导合同模板" prop="contract" v-if="signOnline && needContract">
        <el-select
          v-model="tutoringProgram.contract"
          filterable
          placeholder="请选择"
          :style="{width:widthInput}"
        >
          <el-option
            v-for="a in contractList"
            :key="a.pkId"
            :label="a.contractName"
            :value="a.contractTitle + '&&&' + a.contractContent"
          ></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-form-item label="课业辅导起始日期" prop="startDate">
          <el-date-picker
            type="date"
            :style="{width:widthInput}"
            placeholder="选择日期"
            v-model="tutoringProgram.startDate"
            value-format="yyyy年MM月dd日"
            @change="dateChange(tutoringProgram,tutoringProgram.startDate)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="课业辅导结束日期" prop="endDate">
          <el-date-picker
            type="date"
            :style="{width:widthInput}"
            placeholder="选择日期"
            v-model="tutoringProgram.endDate"
            value-format="yyyy年MM月dd日"
            @change="extendedDateChange(tutoringProgram,tutoringProgram.endDate)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="课业辅导延长服务日期" prop="extendedEndDate">
          <el-date-picker
            type="date"
            :style="{width:widthInput}"
            placeholder="选择日期"
            v-model="tutoringProgram.extendedEndDate"
            value-format="yyyy年MM月dd日"
          ></el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="课业辅导备注">
        <el-input :style="{width:'570px'}" v-model="tutoringProgram.note" maxlength="99"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>  

<script>
import api from "@/api/sales_assistant";
import apiDic from "@/api/dictionary";

export default {
  props: {
    tutoringVisible: {
      type: Boolean,
      default: false,
    },
    tutoringNum: {
      type: Number,
      default: 0,
    },
    needContract: {
      type: Boolean,
    },
    signOnline: {
      type: Boolean,
    },
    vipList: {
      type: Array,
      default: () => []
    },
    servicesList:{
      type: Array,
      default: () => []
    },
    baseType:{
      type:String,
      default:"",
    },
    rate: {},
    tutoringData:{},
    signType:{
      type: String,
      default: "normal",
    }

  },
  data(){
    return{
      programData:{},
      widthSpan:'160px',
      widthInput:'190px',

      tutoringProgram:{
        programId: "",
        basePriceUsd: 0,
        tutoringMentorHour:0,
        strategist:'',
        services:'',
        priceCny: 0,
        priceUsd: 0,
        note: "",
        startDate: null,
        endDate: null,
        extendedEndDate: null,
        contract:"",
      },

      // 口语项目列表
      tutoringList:[],
      // 合同模板列表
      contractList:[],
      rules:{
        programId: [{ required: true, message: "必填", trigger: "blur" }],
        contract: [{ required: true, message: "必填", trigger: "blur" }],
        strategist: [{ required: true, message: "必填", trigger: "blur" }],
        services: [{ required: true, message: "必填", trigger: "blur" }],
        startDate: [{ required: true, message: "必填", trigger: "blur" }],
        endDate: [{ required: true, message: "必填", trigger: "blur" }],
      }
    }
  },
  computed: {
    totalPrice(){
      return this.tutoringProgram.priceUsd
    }
  },
  watch: {
    tutoringVisible: function (val) {
      if(val){
        this.reset()
        if(this.tutoringData){
          this.tutoringProgram = this.tutoringData
        }
      }
    },
    rate: function (r) {
      let price = (r && r!="") ? this.tutoringProgram.priceUsd * r: 0
      this.tutoringProgram.priceCny =  parseFloat(price.toFixed(1))
    },
    totalPrice:function (val) {
      this.$emit("getPrice",val,"tutoring",this.baseType);
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      let params = {
        pageNum: 1,
        pageSize: 999,
        programType: "tutoring",
        programStatus: 1,
      };
      apiDic.getProgramDicList(params).then((res) => {
        console.log("获取tutoring列表", res);
        this.tutoringList = res.data.rows;
      });
    },
    
    reset(){
      Object.assign(this.$data.tutoringProgram, this.$options.data().tutoringProgram)
    },
    // 选择实习单位更新其价格
    changeTutoringOption(id) {
      this.tutoringList.forEach((ve) => {
        if (ve.programId == id) {
          console.log(ve);
          let price = this.rate? ve.priceUsd*this.rate :ve.priceCny;
          this.tutoringProgram.priceCny = parseFloat(price.toFixed(1));
          this.tutoringProgram.priceUsd = ve.priceUsd;
          this.tutoringProgram.basePriceUsd = ve.priceUsd;
          this.tutoringProgram.basePriceCny = ve.priceCny;
          this.tutoringProgram.tutoringHour = ve.tutoringHour;
          // this.tutoringProgram.strategist = ve.strategist;
          // this.tutoringProgram.services = ve.services;
          this.tutoringProgram.period = ve.period;
          this.tutoringProgram.signVip = ve.signVip;
          this.tutoringProgram.periodUnit = ve.periodUnit;
          this.tutoringProgram.medalTokens = ve.medalTokens;
          this.tutoringProgram.programWeight = ve.programWeight;
          this.tutoringProgram.note = "";
          if(this.needContract){
            apiDic.getProgramDetailById(ve.programId).then((res) => {
              console.log(res.data,'获取合同模板');
              this.contractList = res.data.contractList;
            });
          }
        }
      });
      // this.changePrice(obj)
    },
    getValid(){
      return new Promise((resolve,reject)=>{
        if(!this.$refs.tutoringProgram)resolve()
        this.$refs.tutoringProgram.validate((valid) => {
          this.getData()
          resolve(valid) ;
        });
      })
    },
    getData(){
      let _this = this
      let obj = JSON.parse(JSON.stringify(this.tutoringProgram))
      this.programData = obj
      // switch(this.baseType) {
      //   case 'offer':
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`optutoring${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break;
      //   case 'graduate':  
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`gptutoring${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break;
      // }
    },
    programClose() {
      let obj1=this.$data.tutoringProgram;
      let obj2=this.$options.data().tutoringProgram;
      for(let attrName in obj1){
        if(attrName!=='rules'){
            obj1[attrName]=obj2[attrName];
        }
      }
    },
    /**
     * @description: 日期变换
     * @param {*} obj
     * @param {*} val
     * @return {*}
     */
    dateChange(obj,val){
      this.$set(obj,'endDate',this.getEndDate(
        val,
        obj.periodUnit,
        obj.period
      ))
      this.extendedDateChange(obj,obj.endDate)
    },
    dateChange2(obj,obj2,val,extra){
      obj.endDate = this.getEndDate(
        val,
        obj2.periodUnit,
        obj2.period
      );
      this.extendedDateChange(obj,obj.endDate,extra)
    },
    extendedDateChange(obj,val,extra){
      this.$set(obj,'extendedEndDate',val)
      if(extra == "extra"){
        this.changeTime()
      }
    },
    GetDateStr(data,AddDayCount) { 
      var dd = new Date(data);
      console.log(dd)
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
      var y = dd.getFullYear(); 
      var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
      var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
      return y+"年"+m+"月"+d+'日'; 
    },
    getMonthBeforeFormatAndDay(num, format, day,dateTime) {
        var date = dateTime;
        date.setMonth(date.getMonth() + (num*1), 1);
        //读取日期自动会减一，所以要加一
        var mo = date.getMonth() + 1;
        console.log("mo",mo)
        //小月
        if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
            if (day > 30) {
                day = 30
            }
        }
        //2月
        else if (mo == 2) {
            if (this.isLeapYear(date.getFullYear())) {
                if (day > 29) {
                    day = 29
                } else {
                    day = 28
                }
            }
            if (day > 28) {
                day = 28
            }
        }
        //大月
        else {
            if (day > 31) {
                day = 31
            }
        }
        console.log(date)
        var retureValue = date.format('yyyy' + '年' + 'MM' + '月' + day + '日');

        return retureValue;
    },
    isLeapYear(Year) {
      if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
          return (true);
      } else { return (false); }
    },
    changeTime(){
      let day2 = this.offerPList.collect.endDate.replace(/[^\d]/g,'/');
      let extraMonth = this.supplementary.excessTimeName !==""?this.supplementary.excessTimeName:0;
      if( day2!==''){
        day2 = new Date(day2)
        this.offerPList.collect.extendedEndDate = this.getMonthBeforeFormatAndDay(extraMonth, "-", day2.getDate(),day2);
        this.supplementary.newEndData = this.offerPList.collect.extendedEndDate
        console.log(this.supplementary.newEndData,55555555555555)
      };
    },
    /**
     * @Date: 2020-05-07 15:34:23
     * @Description: 通过开始日期，周期单位，周期值，推算出结束日期
     * @param {type} 开始日期，周期单位，周期值
     * @return: 转换后的end日期
     */
    getEndDate(val, periodUnit, period) {
      console.log("collect.startDate", val,periodUnit,period);
      if (!val) {
        return;
      }
      let arr = val.split(/[年月日]/);
      console.log(arr)
      let date = new Date();
      switch (periodUnit) {
        case "year":
          {
            date.setFullYear(arr[0] * 1 + period * 1);
            date.setMonth(arr[1] - 1,1);
            if(date.getFullYear()%4==0&&date.getFullYear()%100!=0||date.getFullYear()%400==0){
              if((arr[2] * 1) > 29){
                date.setDate(29);
              }else{
                date.setDate(arr[2] * 1);
              }
            }else{
              if((arr[2] * 1) > 28){
                date.setDate(28);
              }else{
                date.setDate(arr[2] * 1);
              }
            }
          }
          break;
        case "month":
          {
            date.setFullYear(arr[0]);
            date.setMonth(arr[1] - 1 + period,1);
            if((arr[1] - 1 + period + 1)%12 == 2){
              if(date.getFullYear()%4==0&&date.getFullYear()%100!=0||date.getFullYear()%400==0){
                if((arr[2] * 1) > 29){
                  date.setDate(29);
                }else{
                  date.setDate(arr[2] * 1);
                }
              }else{
                if((arr[2] * 1) > 28){
                  date.setDate(28);
                }else{
                  date.setDate(arr[2] * 1);
                }
              }
            }else{
              let maxDay = new Date(date.getFullYear(), date.getMonth()+1, 0)
              maxDay.getDate() > arr[2] ? date.setDate(arr[2] * 1) : date.setDate(maxDay.getDate())
            }
          }
          break;
        case "week":
          {
            date.setFullYear(arr[0]);
            date.setMonth(arr[1] - 1,1);
            date.setDate(arr[2] * 1 + period * 7);
          }
          break;
        case "day":
          {
            date.setFullYear(arr[0]);
            date.setMonth(arr[1] - 1);
            date.setDate(arr[2] * 1 + period);
          }
          break;
      }
      let day = date.getDate();
      let month = date.getMonth() + 1;
      console.log(date,day,month,'yx11111111111111111111')

      val =
        date.getFullYear() +
        "年" +
        (month > 9 ? month : "0" + month) +
        "月" +
        (day > 9 ? day : "0" + day) +
        "日";
      console.log(val);
      return val;
      // this.collect.endDate = val;
    },
  }
}
</script>

<style lang="scss" scoped>
$color: #dcdfe6;
$margin: top;
@mixin br5 {
  border-radius: 5px;
}
@mixin br22($mar: 20) {
  border-radius: 22px;
  margin-#{$margin}: double($mar) + px;
}
.programName {
  @include br5;
  padding: 0px 9px;
  border: 1px $color dashed;
  min-width: 170px;
  height: 26px;
  display: block;
  // @extend %mm;
}
.components-model{
  padding:20px 0;
}
</style>