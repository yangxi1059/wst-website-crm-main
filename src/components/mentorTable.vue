<!--
 * @Author: 杨曦
 * @Date: 2021-04-21 13:14:19
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 09:57:10
 * @Version: 1
 * @Description: 
 -->
<template>
    <div>
      <el-table
          :data="offerList"
          size="mini"
          :v-loading="loading"
          highlight-current-row
          :max-height="height"
          @row-dblclick="mentorDetail"
        >
          <el-table-column align="center" prop="nickName" label="导师名">
            <template slot-scope="scope">
              <span>{{scope.row.nickName?scope.row.nickName.substring(scope.row.nickName.indexOf(' '),scope.row.nickName.length):''}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sex" label="性别">
            <template slot-scope="scope">
              <span>{{scope.row.sex=='1'?'男':'女'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="undergraduateSchoolName" label="学校（本科）"></el-table-column>
          <el-table-column align="center" prop="graduateSchoolName" label="学校（研究生）"></el-table-column>
          <el-table-column align="center" prop="phdSchoolName" label="学校（博士）"></el-table-column>
          <el-table-column align="center" prop="companyName" label="Company（任职）"></el-table-column>
          <el-table-column align="center" prop="locationName" label="Location（任职）"></el-table-column>
          <el-table-column align="center" prop="divisionName" label="Division（任职）"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  name: "cascader",
  props: {
    offerList:{},
    mentorBusiness:{}
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 120,
      loading: false,
    };
  },
  watch: {
   
  },
  mounted(){
      
  },
  methods: {
   mentorDetail(v){
     console.log(v)
     let a = v;
     this.$emit('closeMain',a)
   }
  }
};
</script>

<style lang='scss'>
</style>
