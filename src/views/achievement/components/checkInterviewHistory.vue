<!--
 * @Author: 库建华
 * @Date: 2020-03-09 16:06:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-12-21 15:56:04
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="applyData.menteeName?'编辑面经历史':'新增面经历史'"
      :visible.sync="settingVisible"
      width="1200px"
      :before-close="close"
    >
      <el-form :inline="true" label-width="150px" ref="form" :model="applyData" :rules="rules">
        <el-form-item label="学生名:" prop="menteeName">
            <el-input v-model="applyData.menteeName" :style="{width:'200px'}" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="学校:" prop="school">
          <el-select
            :style="{width:'200px'}"
            v-model="applyData.school"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item,i) in school"
              :key="i"
              :label="item.chiName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请季:" prop="applySeason">
          <el-select
            :style="{width:'200px'}"
            v-model="applyData.applySeason"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in apply_season"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试日期:" prop="interviewDate">
          <el-date-picker
            :style="{width:'200px'}"
            v-model="applyData.interviewDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="难易度:" prop="difficultyLevel">
          <el-select
            :style="{width:'200px'}"
            v-model="applyData.difficultyLevel"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in difficultyLevelList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习/全职:" prop="resultApply">
            <el-select
              :style="{width:'200px'}"
              v-model="applyData.resultApply"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internship_or_full_time"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="第几轮:" prop="times">
          <el-select
            :style="{width:'200px'}"
            v-model="applyData.times"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in interview_round_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司:" prop="company">
          <el-select
            :style="{width:'200px'}"
            v-model="applyData.company"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in company"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门:" prop="division">
          <el-select
            :style="{width:'200px'}"
            v-model="applyData.division"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in division"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:" prop="city">
          <el-select :style="{width:'200px'}" v-model="applyData.city" filterable placeholder="请选择">
            <el-option
              v-for="item in city"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面经显示" prop="storyStatus">
            <el-select :style="{width:'200px'}" v-model="applyData.storyStatus" placeholder="请选择"  >
              <el-option
                v-for="item in displayStatusS"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <br>
        <el-form-item label="面经" prop="story">
          <el-input
            :style="{width:'560px'}"
            type="textarea"
            :autosize="{minRows:3}"
            v-model="applyData.story"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from "@/plugin/mixins";
import apiDic from "@/api/dictionary.js";
import api from "@/api/vip.js";

export default {
  name: "setting",
  mixins: [mixins],
  props: {
    settingVisible: {
      type: Boolean,
      default: false
    },
    offerData: {
      type: Object
    }
  },
  data() {
    return {
      company: [],
      division: [],
      city: [],
      displayStatusS: [
        {
          itemName: "不显示",
          itemValue: "0"
        },
        {
          itemName: "显示",
          itemValue: "1"
        }
      ],
      apply_season: [],
      school: [],
      applyData:{},
      resultVoucherMosaic: "",
      internship_or_full_time:[],
      interview_round_no: [],
      difficultyLevelList:[
        {itemName:'难度一',itemValue:'1'},
        {itemName:'难度二',itemValue:'2'},
        {itemName:'难度三',itemValue:'3'},
        {itemName:'难度四',itemValue:'4'},
        {itemName:'难度五',itemValue:'5'},
      ],
      rules: {
        menteeName:[{ required: true, message: "必填", trigger: "blur" }],
        storyStatus:[{ required: true, message: "必填", trigger: "blur" }],
        school:[{ required: true, message: "必填", trigger: "blur" }],
        interviewDate:[{ required: true, message: "必填", trigger: "blur" }],
        resultApply: [{ required: true, message: "必填", trigger: "blur" }],
        company: [{ required: true, message: "必填", trigger: "blur" }],
        division: [{ required: true, message: "必填", trigger: "blur" }],
        city: [{ required: true, message: "必填", trigger: "blur" }],
        difficultyLevel: [{ required: true, message: "必填", trigger: "blur" }],
        times: [{ required: true, message: "必填", trigger: "blur" }],
        applySeason: [{ required: true, message: "必填", trigger: "blur" }],
        story: [{ required: true, message: "必填", trigger: "blur" }],
      }
    };
  },
  watch: {
    settingVisible: function(val) {
      if (val) {
        console.log(this.offerData,'yx************')
        this.applyData = JSON.parse(JSON.stringify(this.offerData))
        this.initPage();
        if(!this.company.length){
          this.init();
          this.pageInit()
        }
      }
    }
  },
  methods: {
    init(){
       api.getCompanyList().then(res => {
        console.log("company", res);
        this.company = res.data;
      });
    },
    async pageInit () {
      // 获取用户组内成员列表
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.apply_season = await this.getDictionary('apply_season')
      this.city = await this.getDictionary('city')
      this.division = await this.getDictionary('division')
      this.interview_round_no = await this.getDictionary('interview_round_no')
    },
    initPage() {
      let params = {
        pageNum: 1,
        pageSize: 9999
      };
      apiDic.getSchoolDicList(params).then(res => {
        console.log(res);
        this.school = res.data.rows;
      });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        let data = JSON.parse(JSON.stringify(this.applyData));
        let submitData = {
          menteeName:data.menteeName,
          school:data.school,
          company:data.company,
          city:data.city,
          division:data.division,
          applySeason:data.applySeason,
          interviewDate:data.interviewDate,
          difficultyLevel:data.difficultyLevel,
          times:data.times,
          resultApply:data.resultApply,
          story:data.story,
          storyStatus:data.storyStatus
        }
        if(data.pkId){
          submitData.pkId = data.pkId
        }
        console.log(submitData)
        api.hisInterviewSave(submitData).then(res => {
          this.$message.success('保存成功')
          this.$emit('submit')
          this.close()
        })
      });
    },
    clear() {},
    close() {
      this.$refs.form.resetFields();
      this.applyData = {};
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.w400-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 960px;
  margin-bottom: 30px;
}
.w400-content {
  position: absolute;
  top: 84px;
  right: 40px;
  width: 350px;
  border: 1px #eff solid;
  border-radius: 10px;
}
.w400 {
  width: 478px;
  height: 478px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px #eff solid;
  border-radius: 10px;
}
.w400-text {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #89001d;
  font-size: 20px;
}
.img {
  max-width: 100%;
  max-height: 100%;
}
._item-value1 {
  padding-left: 20px;
}
</style>