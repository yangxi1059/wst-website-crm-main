<!--
 * @Author: Kaan
 * @Date: 2022-04-13 17:00:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-17 14:04:22
 * @version: 
 * @Descripttion: 
-->
<template>
  <el-dialog 
    :title="title"
    width="800px"
    v-loading = "loading"
    :visible.sync="detailVisible"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      size="mini"
      :model="applyDetail"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
    >
      <el-form-item label="年份"  prop="applyYear">
        <el-select
          :style="{width:widths}"
          v-model="applyDetail.applyYear"
          filterable
          :disabled="!canEdit"
        >
          <el-option
            v-for="(year) in yearList" :key="year" :label="year" :value="year"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型"  prop="applyType">
        <el-select
          :style="{width:widths}"
          v-model="applyDetail.applyType"
          filterable
          :disabled="!canEdit"
        >
          <el-option
            v-for="item in typeList"
            :key="item.itemValue"
            :value="item.itemValue"
            :label="item.itemName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业"  prop="applyTrack">
        <el-select
          :style="{width:widths}"
          v-model="applyDetail.applyTrack"
          filterable
          :disabled="!canEdit"
        >
          <el-option
            v-for="item in trackList"
            :key="item.itemValue"
            :value="item.itemValue"
            :label="item.itemNameAll"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区"  prop="applyCountry">
        <el-select
          :style="{width:widths}"
          v-model="applyDetail.applyCountry"
          filterable
          :disabled="!canEdit"
        >
          <el-option
            v-for="item in countryList"
            :key="item.itemValue"
            :value="item.itemValue"
            :label="item.itemName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始月份"  prop="startMonth">
        <el-date-picker
          v-model="applyDetail.startMonth"
          :style="{width:widths}"
          :value-format="'yyyy-MM'"
          type="month"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束月份"  prop="endMonth">
        <el-date-picker
          v-model="applyDetail.endMonth"
          :style="{width:widths}"
          :value-format="'yyyy-MM'"
          type="month"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="需要准备的内容"  prop="prepareArr">
        <el-checkbox-group v-model="applyDetail.prepareArr" style="width:550px">
          <el-checkbox v-for="item in prepareList" :key="item.itemValue" 
            :label="item.itemValue" >{{item.itemName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/vip.js'

import mixins from '@/plugin/mixins'
export default {
  name: 'ApplyInput',
  mixins: [
    mixins
  ],
  props:{
    detailVisible: {
      type: Boolean,
      default: false
    },
    seasonId:{
      type: String,
      default: ""
    }
  },
  watch:{
    detailVisible: function (val) {
      if (val) {
        console.log(this.seasonId)
        if(this.seasonId!==""){
          this.canEdit = false
          this.title="申请季更新"
          this.getDetail()
        }else{
          this.canEdit = true
          this.title="新增申请季"
        }
      }
    },
  },
  data() {
    return {
      loading:false,
      canEdit:true,
      title:"",
      widths: "220px",
      yearList: ['2022','2023','2024','2025','2026'],
      typeList:[],
      trackList:[],
      countryList:[],
      prepareList:[],
      applyDetail:{
        applyYear:"",
        applyType:"",
        applyTrack:"",
        applyCountry:"",
        startMonth:'',
        endMonth:'',
        prepareArr:[],
      },
      rules:{
        applyYear:[{ required: true, message: '必填', trigger: 'blur' }],
        applyType:[{ required: true, message: '必填', trigger: 'blur' }],
        applyTrack:[{ required: true, message: '必填', trigger: 'blur' }],
        applyCountry:[{ required: true, message: '必填', trigger: 'blur' }],
        prepareArr:[{ required: true, message: '必填', trigger: 'blur' }],
      },
    }
  },
  mounted () {
    this.pageInit()
  },
  methods:{
    async pageInit () {
      this.trackList = await this.getDictionary('mentee_track')
      console.log(this.trackList,2222222222222222222222222)
      this.countryList = await this.getDictionary('country')
      this.prepareList = await this.getDictionary('apply_season_prepare')
      this.typeList = await this.getDictionary('internship_or_full_time')
    },
    getDetail(){
      this.loading = true
      api.getApplyDetail(this.seasonId).then((res)  => {
        this.loading = false
        if(res.code == 200){
          Object.assign(this.applyDetail, res.data);
          this.applyDetail.typeArr.forEach(v => {
            this.applyDetail.prepareArr.push(v.prepareType)
          });
          console.log(this.applyDetail)
        }else{
          this.$message.warning(res.message)
        }
      }).catch(err => {
        this.loading = false
        this.$message.warning(err)
      });
    },
    validSubmit(){
      if(this.applyDetail.endMonth !==""){
        if(this.applyDetail.startMonth == "" || this.applyDetail.startMonth == null){
          this.$message.warning('开始日期不能为空');
          return
        }
        if(new Date(this.applyDetail.startMonth) >= new Date(this.applyDetail.endMonth)){
          this.$message.warning('开始日期不能大于结束日期');
          return
        }
      }
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.loading = true
        if(this.seasonId!==""){
          // 编辑
          let params = {
            seasonId: this.seasonId,
            startMonth: this.applyDetail.startMonth,
            endMonth: this.applyDetail.endMonth,
            typeArr: this.applyDetail.prepareArr
          }
          console.log(params)
          api.editApplySeason(params).then((res) => {
            this.loading = false
            if(res.code == 200){
              this.$message.success("更新成功")
              this.clear()
              this.$emit("success");
            }else{
              this.$message.warning(res.message)
            }
          }).catch(err => {
            this.loading = false
            this.$message.warning(err)
          });
        }else{
          // 新增
          let params = {
            applyYear: this.applyDetail.applyYear,
            applyType: this.applyDetail.applyType,
            applyTrack: this.applyDetail.applyTrack,
            applyCountry: this.applyDetail.applyCountry,
            startMonth: this.applyDetail.startMonth,
            endMonth: this.applyDetail.endMonth,
            typeArr: this.applyDetail.prepareArr
          }
          console.log(params)
          api.addApplySeason(params).then((res) => {
            this.loading = false
            if(res.code == 200){
              this.$message.success("新增成功")
              this.clear()
              this.$emit("success");
            }else{
              this.$message.warning(res.message)
            }
          }).catch(err => {
            this.loading = false
            this.$message.warning(err)
          });
        }
      })
    },
    clear(){
      Object.assign(this.applyDetail, this.$options.data().applyDetail);
    },
    close(){
      this.clear()
      this.$emit("close")
    },
  },
}
</script>


<style lang="scss" scoped>

</style>