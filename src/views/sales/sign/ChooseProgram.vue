<!--
 * @Author: 库建华
 * @Date: 2019-10-23 17:59:43
 * @LastEditors: Kaan
 * @LastEditTime: 2022-05-26 15:02:11
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :visible.sync="chooseProgramVisible"
      width="700px"
      :before-close="chooseProgramClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div slot="title" class="dialog-title">
        <span class="title_text" v-if="orderType=='old'">签约信息_项目选择</span>
        <span class="title_text" v-if="orderType=='new'">一站式签约_项目选择</span>
        <span class="title_version" v-if="orderType=='new'">(Beta v1)</span>
      </div>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="0">求职项目</el-checkbox>
        <el-checkbox label="1">升学项目</el-checkbox>
      </el-checkbox-group>
      <div class="create-cant-program-model" v-if="checkList.length == 0">
        <div class="program-model-title">非基础项目信息</div>
        <el-form :inline="true" :model="nobasicList" size="mini" label-width="90px">
          <el-form-item label="实习">
            <el-select class v-model="nobasicList.internshipNum" placeholder="请选择实习次数">
              <el-option v-for="item in internshipTimesList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="口语">
            <el-select class v-model="nobasicList.oralNum" placeholder="请选择口语次数">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="CFA">
            <el-select class v-model="nobasicList.cfaNum" placeholder="请选择CFA次数">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="财商">
            <el-select class v-model="nobasicList.financeNum" placeholder="请选择财商项目">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课业辅导">
            <el-select class v-model="nobasicList.tutoringNum" placeholder="请选择课业辅导项目">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="create-cant-program-model" v-if="checkList.indexOf('0')>-1">
        <div class="program-model-title">求职项目信息</div>
        <el-form :inline="true" :model="offerList" size="mini" label-width="90px">
          <el-form-item label="基础项目" style="width: 100%">
            <el-cascader
              expand-trigger="hover"
              :options="programArr"
              v-model="offerList.programArr"
              style="width: calc(200% + 100px)"
              filterable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="实习">
            <el-select class v-model="offerList.internshipNum" placeholder="请选择实习次数">
              <el-option v-for="item in internshipTimesList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="口语">
            <el-select class v-model="offerList.oralNum" placeholder="请选择口语次数">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="CFA">
            <el-select class v-model="offerList.cfaNum" placeholder="请选择CFA次数">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="财商">
            <el-select class v-model="offerList.financeNum" placeholder="请选择财商项目">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课业辅导">
            <el-select class v-model="offerList.tutoringNum" placeholder="请选择课业辅导项目">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="create-cant-program-model" v-if="checkList.indexOf('1')>-1">
        <div class="program-model-title">升学项目信息</div>
        <el-form :inline="true" :model="graduateList" size="mini" label-width="90px">
          <el-form-item label="申研项目" style="width: 100%">
            <el-select
              v-model="graduateList.programArr"
              filterable
              placeholder="请选择申研项目"
              style="width: calc(200% + 100px)"
            >
              <el-option
                v-for="item in graduateArr"
                :key="item.programId"
                :label="item.programName"
                :value="item.programId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习">
            <el-select class v-model="graduateList.internshipNum" placeholder="请选择实习次数">
              <el-option v-for="item in internshipTimesList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="口语">
            <el-select class v-model="graduateList.oralNum" placeholder="请选择口语次数">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="CFA">
            <el-select class v-model="graduateList.cfaNum" placeholder="请选择CFA次数">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="财商">
            <el-select class v-model="graduateList.financeNum" placeholder="请选择财商项目">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课业辅导">
            <el-select class v-model="graduateList.tutoringNum" placeholder="请选择课业辅导项目">
              <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseProgramClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/dictionary";
export default {
  name: "chooseProgram",
  props: {
    chooseProgramVisible: {
      type: Boolean,
      default: false
    },
    orderType:{},
    signType:{},
  },
  data: function() {
    return {
      // 项目选择
      checkList:[],
      // 合同项目列表，三级联动
      programArr: [],
      // 申研列表
      graduateArr: [],
      //实习项目列表
      internshipTimesList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      // 求职基础项目
      offerList:{
        programArr:"",
        programId:"",
        internshipNum: 0,
        oralNum: 0,
        cfaNum: 0,
        financeNum: 0,
        tutoringNum: 0,
        type:"offer"
      },
      graduateList:{
        programArr:"",
        programId:"",
        internshipNum: 0,
        oralNum: 0,
        cfaNum: 0,
        financeNum: 0,
        tutoringNum: 0,
        type:"graduate"
      },
      // 非基础项目
      nobasicList:{
        internshipNum: 0,
        oralNum: 0,
        cfaNum: 0,
        financeNum: 0,
        tutoringNum: 0,
      }
    };
  },
  computed: {},
  watch: {
    chooseProgramVisible: function(val) {
      if (val) {
        //获取签约基本项目名（三级选择）
        api.getProgramList().then(res => {
          console.log("getProgramList", res.data);
          this.programArr = res.data.basicProgram;
        });
        let params5 = {
          pageNum: 1,
          pageSize: 999,
          programType: "graduate_program",
          programStatus:1,
        };
        api.getProgramDicList(params5).then((res) => {
          console.log("获取申研列表", res);
          this.graduateArr = res.data.rows;
        });
      }
    },
    checkList:function(val) {
      if(val.indexOf(0) > -1){
        console.log(0)
        let obj1=this.$data.offerList;
        let obj2=this.$options.data().offerList;
        for(let attrName in obj1){
          if(attrName!=='rules'){
              obj1[attrName]=obj2[attrName];
          }
        }
      }else if(val.indexOf(1) > -1){
        console.log(1)
        let obj1=this.$data.graduateList;
        let obj2=this.$options.data().graduateList;
        for(let attrName in obj1){
          if(attrName!=='rules'){
              obj1[attrName]=obj2[attrName];
          }
        }
      }
    }
  },
  mounted() {
    //获取签约基本项目名（三级选择）
    api.getProgramList().then(res => {
      console.log("getProgramList", res.data);
      this.programArr = res.data.basicProgram;
    });
    let params5 = {
      pageNum: 1,
      pageSize: 999,
      programType: "graduate_program",
      programStatus:1,
    };
    api.getProgramDicList(params5).then((res) => {
      console.log("获取申研列表", res);
      this.graduateArr = res.data.rows;
    });
  },
  methods: {
    chooseProgramClose() {
      this.checkList = []
      this.offerList = {
        programArr:"",
        programId:"",
        internshipNum: 0,
        oralNum: 0,
        cfaNum: 0,
        financeNum: 0,
        tutoringNum: 0,
        type:"offer"
      }
      this.graduateList = {
        programArr:"",
        programId:"",
        internshipNum: 0,
        oralNum: 0,
        cfaNum: 0,
        financeNum: 0,
        tutoringNum: 0,
        type:"graduate"
      },
      // 非基础项目
      this.nobasicList = {
        internshipNum: 0,
        oralNum: 0,
        cfaNum: 0,
        financeNum: 0,
        tutoringNum: 0,
      }
      this.$emit("close");
    },
    submit() {
      this.offerList.programId = this.offerList.programArr[this.offerList.programArr.length - 1]
      this.graduateList.programId = this.graduateList.programArr
      console.log(this.offerList)
      console.log(this.graduateList)
      console.log(this.nobasicList)
      console.log(this.checkList)
      this.$emit("success", this.orderType,this.offerList, this.graduateList,this.nobasicList,this.checkList,this.signType);
      this.chooseProgramClose();
    }
  }
};
</script>

<style lang="scss" scoped>
.title_text{
  font-size:18px;
}
.title_version{
  font-size:18px;
  color:red
}
$color: #dcdfe6;
$margin: top;
.common {
  padding: 20px;
}
%m {
  display: block;
}
%mm {
  display: inline-block;
}
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
  display: inline-block;
  // @extend %mm;
}
.create-cant-program-model {
  @include br22(13);
  @include br5;
  @extend .common;
  @extend %m;
  // @extend %mm;
  border: 1px $color solid;
  margin-#{$margin}: 20px;
  position: relative;
}
.program-model-title {
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: #fff;
  padding: 10px;
}
</style>