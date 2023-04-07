<!--
 * @Author: 库建华
 * @Date: 2020-03-23 17:45:33
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-15 15:22:38
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="chooseProgramVisible"
      width="700px"
      :before-close="chooseProgramClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form :inline="true" size="medium" label-width="80px">
        <el-form-item label="项目选择">
          <el-select class size="medium" v-model="programId" placeholder="请选择">
            <el-option
              v-for="item in programList"
              :key="item.programId"
              :label="item.programName"
              :value="item.programId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="实习">
          <el-select class size="medium" v-model="internshipNum" placeholder="请选择实习次数">
            <el-option v-for="item in internshipTimesList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="口语">
          <el-select class size="medium" v-model="oralNum" placeholder="请选择口语次数">
            <el-option v-for="item in [0,1]" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
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
    programType:{
      type:String,
      default:''
    }
  },
  data: function() {
    return {
      programList: [],
      //实习项目列表
      programId: null,
      title: "签约信息_项目选择_续课"
    };
  },
  computed: {},
  watch: {
    chooseProgramVisible: function(val) {
      if (val) {
        let params = {
          pageSize: 9999,
          pageNum: 1,
          programType: this.programType,
          programStatus: 1
        };
        api.getProgramDicList(params).then(res => {
          console.log(`getProgramList 当前项目类型${this.programType}`, res.data);
          this.programList = res.data.rows;
        });
      }
    }
  },
  mounted() {},
  methods: {
    chooseProgramClose() {
      this.programId = null;
      this.$emit("close");
    },
    submit() {
      if(!this.programId){
        this.$message({
          type:'warning',
          message:'请选择项目'
        });
        return;
      }
      this.$emit("submit", this.programId);
      this.chooseProgramClose();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>