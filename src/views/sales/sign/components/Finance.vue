<!--
 * @Author: kaan
 * @Date: 2021-06-22 20:27:42
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-08 15:25:46
 * @Version: 
 * @Description: 
-->
<template>
  <div class="create-cant-program-model components-model" v-if="financeVisible">
    <div class="program-model-title" >财商项目</div>
    <el-form
      :inline="true"
      size="mini"
      :rules="rules"
      ref="financeProgram"
      label-width="180px"
      :model="financeProgram"
    >
      <el-form-item :label="'财商项目'" prop="programId">
        <el-select
          v-model="financeProgram.programId"
          filterable
          placeholder="请选择财商项目"
          :style="{width:widthInput}"
          @change="changeFinanceOption(financeProgram.programId)"
        >
          <el-option
            v-for="item in financeList"
            :key="item.programId"
            :label="item.programName"
            :value="item.programId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Strategist"
        prop="strategist"
        v-if="financeProgram.signVip == 'Strategist' || financeProgram.signVip == 'ALL'"
      >
        <el-select
          :style="{width:widthInput}"
          v-model="financeProgram.strategist"
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
        v-if="financeProgram.signVip == 'Program_Manager' || financeProgram.signVip == 'ALL'"
      >
        <el-select
          :style="{width:widthInput}"
          v-model="financeProgram.services"
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
        >{{financeProgram.period}}-{{financeProgram.periodUnit}}</span>
      </el-form-item>
      <el-form-item label="财商价格(￥)" prop>
        <span class="programName" :style="{width:widthSpan}">{{financeProgram.priceCny}}</span>
      </el-form-item>
      <el-form-item label="官方价格($):">
        <span :style="{width:widthSpan}" class="programName">{{financeProgram.basePriceUsd}}</span>
      </el-form-item>
      <el-form-item label="财商导师一对一课时数" prop="financeHour">
      <span
          :style="{width:widthSpan}"
          class="programName"
          v-if="financeProgram.financeHour == -1"
        >不限</span>
        <el-input-number
          v-else
          :style="{width:widthInput}"
          v-model="financeProgram.financeHour"
          :controls="false"
          size="mini"
          :min="0"
          :max="60"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="财商合同模板" prop="contract" v-if="signOnline && needContract">
        <el-select
          v-model="financeProgram.contract"
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
        <el-form-item label="财商起始日期" prop="startDate">
          <el-date-picker
            type="date"
            :style="{width:widthInput}"
            placeholder="选择日期"
            v-model="financeProgram.startDate"
            value-format="yyyy年MM月dd日"
            @change="dateChange(financeProgram,financeProgram.startDate)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="财商结束日期" prop="endDate">
          <el-date-picker
            type="date"
            :style="{width:widthInput}"
            placeholder="选择日期"
            v-model="financeProgram.endDate"
            value-format="yyyy年MM月dd日"
            @change="extendedDateChange(financeProgram,financeProgram.endDate)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="财商延长服务日期" prop="extendedEndDate">
          <el-date-picker
            type="date"
            :style="{width:widthInput}"
            placeholder="选择日期"
            v-model="financeProgram.extendedEndDate"
            value-format="yyyy年MM月dd日"
          ></el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="财商备注">
        <el-input :style="{width:'570px'}" v-model="financeProgram.note" maxlength="99"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>  

<script>
import api from "@/api/sales_assistant";
import apiDic from "@/api/dictionary";

export default {
  props: {
    financeVisible: {
      type: Boolean,
      default: false,
    },
    financeNum: {
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
    financeData:{}

  },
  data(){
    return{
      programData:{},
      widthSpan:'160px',
      widthInput:'190px',

      financeProgram:{
        programId: "",
        basePriceUsd: 0,
        financeHour:0,
        mentorHour:0,
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
      financeList:[],
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
      return this.financeProgram.priceUsd
    }
  },
  watch: {
    financeVisible: function (val) {
      if(val){
        this.init()
        if(this.financeData){
          this.programData = this.financeData
        }
      }
    },
    rate: function (r) {
      let price = (r && r!="") ? this.financeProgram.priceUsd * r: 0
      this.financeProgram.priceCny = parseFloat(price.toFixed(1))
    },
    totalPrice:function (val) {
      this.$emit("getPrice",val,"finance",this.baseType);
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
        programType: "finance",
        programStatus: 1,
      };
      apiDic.getProgramDicList(params).then((res) => {
        console.log("获取finance列表", res);
        this.financeList = res.data.rows;
      });
    },
    // 选择实习单位更新其价格
    changeFinanceOption(id) {
      this.financeList.forEach((ve) => {
        if (ve.programId == id) {
          console.log(ve);
          let price = this.rate? ve.priceUsd*this.rate :ve.priceCny;
          this.financeProgram.priceCny = parseFloat(price.toFixed(1));
          this.financeProgram.priceUsd = ve.priceUsd;
          this.financeProgram.basePriceUsd = ve.priceUsd;
          this.financeProgram.basePriceCny = ve.priceCny;
          this.financeProgram.financeHour = ve.financeHour;
          // this.financeProgram.strategist = ve.strategist;
          // this.financeProgram.services = ve.services;
          this.financeProgram.period = ve.period;
          this.financeProgram.signVip = ve.signVip;
          this.financeProgram.periodUnit = ve.periodUnit;
          this.financeProgram.note = "";
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
        if(!this.$refs.financeProgram)resolve()
        this.$refs.financeProgram.validate((valid) => {
          this.getData()
          resolve(valid) ;
        });
      })
    },
    getData(){
      let _this = this
      let obj = JSON.parse(JSON.stringify(this.financeProgram))
      this.programData = obj
      // switch(this.baseType) {
      //   case 'offer':
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`opfinance${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break;
      //   case 'graduate':  
      //     Object.getOwnPropertyNames(obj).forEach(function(key){
      //       _this.programData[`gpfinance${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key]
      //     })
      //     break;
      // }
    },
    programClose() {
      this.$emit("close");
      let obj1=this.$data.financeProgram;
      let obj2=this.$options.data().financeProgram;
      for(let attrName in obj1){
        if(attrName!=='rules'){
            obj1[attrName]=obj2[attrName];
        }
      }
      console.log("programClose",obj1)
    },
    /**
     * @description: 日期变换
     * @param {*} obj
     * @param {*} val
     * @return {*}
     */
    dateChange(obj,val){
      obj.endDate = this.getEndDate(
        val,
        obj.periodUnit,
        obj.period
      );
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
      obj.extendedEndDate = val
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