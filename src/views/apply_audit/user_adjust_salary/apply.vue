<template>
  <div class="overtime">
    <el-dialog :close-on-click-modal="false"
      title="员工调薪申请"
      :visible.sync="userAdjustSalaryApplyVisible"
      width="800px"
      :before-close="close"
      :destroy-on-close="true"
    >
      <el-form :inline="true"
        label-width="150px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="所属部门" prop="groupId">
          <el-select :style="{width:'200px'}" size="mini" v-model="ruleForm.groupId" filterable placeholder="请选择">
            <el-option
              v-for="item in deptList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调薪员工" prop="menteeId">
          <el-select :style="{width:'200px'}" size="mini" v-model="ruleForm.menteeId" filterable placeholder="请选择">
            <el-option
              v-for="item in memberArr"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId  + '&&' + item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            :style="{width:'200px'}"
            size="mini"
            v-model="ruleForm.hiredate"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
            disabled
          ></el-date-picker>
        </el-form-item><br>
        <el-form-item label="部门级别（当前）">
          <el-select :style="{width:'200px'}" size="mini" v-model="ruleForm.levelIdHis" placeholder="请选择" disabled>
            <el-option
              v-for="item in levelArr"
              :key="item.levelId"
              :label="item.deptLevel"
              :value="item.levelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资（当前）">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            v-model="ruleForm.basicWageHis"
            size="mini"
            placeholder
            disabled
          ></el-input-number>
        </el-form-item>
        <el-form-item label="部门级别（调整）" prop="levelId">
          <el-select :style="{width:'200px'}" size="mini" v-model="ruleForm.levelId" placeholder="请选择">
            <el-option
              v-for="item in levelArr"
              :key="item.levelId"
              :label="item.deptLevel"
              :value="item.levelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资（调整）" prop="basicWage">
          <el-input-number
            :style="{width:'200px'}"
            :controls="false"
            v-model="ruleForm.basicWage"
            size="mini"
            placeholder
          ></el-input-number>
        </el-form-item>
        <el-form-item label="生效周期" prop="effectivePeriod">
          <el-radio v-model="ruleForm.effectivePeriod" label="immediately">立即生效</el-radio>
          <el-radio v-model="ruleForm.effectivePeriod" label="next_period">下周期生效</el-radio>
        </el-form-item>
        <el-form-item label="材料、凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            drag
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
              建议使用PDF文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :style="{width:'560px'}"
            size="mini"
            v-model="ruleForm.remark"
            maxlength="199"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'200px'}"
            v-model="item.auditor"
            size="mini"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送">
          <el-select :style="{width:'200px'}" v-model="copy" multiple filterable size="mini" placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip";
import axios from "@/api/dictionary.js";
import apiU from "@/api/user";
import util from '@/libs/util'
import { uploadFunBySys } from "@/libs/file";
export default {
  props: {
    userAdjustSalaryApplyVisible: {
      type: Boolean,
      default: false
    },
    deptList: {
      type: Array,
      default: [],
    },
  },
  data: () => {
    return {
      user: [],
      userInfo: util.sessions.get('userInfo'),
      memberArr:[],
      levelArr:[],
      groupName:"",
      ruleForm:{
        groupId: "",
        menteeId:"",
        hiredate:"",
        levelIdHis:"",
        levelId:"",
        basicWageHis:"",
        basicWage:"",
        effectivePeriod:"",
        remark:"",
      },
      fileList:[],
      auditor: [],
      copy: [],
      rules: {
        groupId: [{ required: true, message: '必填', trigger: 'change' }],
        menteeId: [{ required: true, message: '必填', trigger: 'change' }],
        levelId: [{ required: true, message: '必填', trigger: 'change' }],
        basicWage: [{ required: true, message: '必填', trigger: 'change' }],
        effectivePeriod: [{ required: true, message: '必填', trigger: 'change' }],
      },
      auditorList: [
        {
          auditor: [],
          confirmCol: "",
          confirmorArr: [
            {
              confirmorName: "",
              isDefult: "",
              confirmCol: "",
              confirmType: "",
              confirmorId: ""
            }
          ]
        }
      ]
    };
  },
  computed: {
    // overtime: function() {
    //   return this.orderPrice*this.rate/100;
    // }
  },
  watch: {
    userAdjustSalaryApplyVisible: function(val) {
      if (val) {
        this.ruleForm.groupId = this.deptList[0].groupId
        axios.getAuditorListByApplyType("user_adjust_salary").then(res => {
          console.log("getAuditorListByApplyType", res.data);
          res.data.forEach(v => {
            v.auditor = [];
            v.confirmorArr.forEach(value => {
              if (value.isDefult == 1) {
                v.auditor.push(value.confirmorId);
              }
            });
          });
          this.auditorList = [...res.data];
        });
      }
    },
    "ruleForm.groupId": function(val){
      if(!val)return
      api.getMemberInfo({groupId:this.ruleForm.groupId}).then(res => {
        console.log(res);
        this.memberArr = res.data.memberArr
        this.levelArr = res.data.levelArr
      });
    },
    "ruleForm.menteeId": function(val){
      if(val == "")return
      this.ruleForm.levelIdHis="",
      this.ruleForm.levelId="",
      this.ruleForm.basicWageHis="",
      this.ruleForm.basicWage="",
      this.memberArr.forEach(v => {
        if(v.userId == val.split("&&")[0]){
          this.ruleForm.hiredate = v.hiredate
          this.ruleForm.levelIdHis=v.levelId,
          this.ruleForm.basicWageHis=v.basicWage
        }
      });
    },
    "ruleForm.levelId": function(val){
      if(!val)return
      this.ruleForm.basicWage = this.levelArr.filter(
        (v) => val == v.levelId
      )[0].basicWage
    },
  },
  mounted() {
    apiU
      .userList({
        pageNum: 1,
        pageSize: 1000,
        entryStatus: "1"
      })
      .then(({ data }) => {
        console.log(
          "userList...........................................",
          data
        );
        this.user = data.rows;
      });
  },
  methods: {
    close() {
      this.$emit("close");
      this.clear();
    },
    clear() {
      this.groupName="",
      this.ruleForm={
        groupId: "",
        menteeId:"",
        hiredate:"",
        levelIdHis:"",
        levelId:"",
        basicWageHis:"",
        basicWage:"",
        effectivePeriod:"",
        remark:"",
      },
      this.$refs["ruleForm"].clearValidate()
      this.fileList = [],
      this.auditor = [];
      this.copyTo = [];
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    submit() {
      console.log(
        "submit",
        this.auditor,
        this.copy,
        this.orderData
      );
      // 验证
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        let approval = [];
        let cannot = false;
        this.auditorList.forEach(aa => {
          if (!aa.auditor.length) {
            cannot = true;
          }
          aa.auditor.forEach(v => {
            approval.push({ approverId: v });
          });
        });
        if (cannot) {
          this.$message({
            type: "warning",
            message: "审核人都为必填！"
          });
          return;
        }
        let copyTo = [];
        this.copy.forEach(v => {
          copyTo.push({ copyTo: v });
        });
        let period =""
        let time = '';
        if(this.ruleForm.effectivePeriod == "immediately"){
          period="立即生效"
        }else if(this.ruleForm.effectivePeriod == "next_period"){
          let date = new Date()
          let y,m,d
          if(date.getDate() >25){
            y = date.getFullYear()
            m = parseInt(date.getMonth()) + 2
            if (m == 13) {
              y = parseInt(y) + 1;
              m = 1;
            }
          }else{
            y = date.getFullYear()
            m = parseInt(date.getMonth()) + 1
          }
          if (m < 10) {
            m = '0' + m;
          }
          d = 26
          period=`下周期生效(${y}-${m}-${d})`
          time = `${y}-${m}-${d}`;
        }
        let data = {
          applyType: "user_adjust_salary",
          applyTitle: `员工【${this.ruleForm.menteeId.split("&&")[1]}】的调薪申请`,
          copyTo: copyTo,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: "所属部门",
                value: this.deptList.filter(
                  (v) => this.ruleForm.groupId === v.groupId
                )[0].groupName,
              },
              {
                label: "调薪员工",
                value: this.ruleForm.menteeId.split("&&")[1]
              },
              {
                label: "入职时间",
                value: this.ruleForm.hiredate
              },
              {
                label: "部门级别（当前）",
                value: this.levelArr.filter(
                  (v) => this.ruleForm.levelIdHis == v.levelId
                )[0].deptLevel,
              },
              {
                label: "部门级别（调整）",
                value: this.levelArr.filter(
                  (v) => this.ruleForm.levelId == v.levelId
                )[0].deptLevel,
              },
              {
                label: "薪资（当前）",
                value: this.ruleForm.basicWageHis
              },
              {
                label: "薪资（调整）",
                value: this.ruleForm.basicWage
              },
              {
                label: "生效周期",
                value: period
              },
              {
                label: "备注",
                value: this.ruleForm.remark
              },
            ],
            info: {
              userId: this.ruleForm.menteeId.split("&&")[0],
              levelId: this.ruleForm.levelId,
              effectivePeriod: this.ruleForm.effectivePeriod,
              basicWage: this.ruleForm.basicWage
            }
          }
        };
        if(time){
          data.content.info.effectiveDate = time;
        }
        console.log(data)
        this.$loading();
        if (this.fileList.length) {
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            let file = this.fileList[i];
            uploadFunBySys(file.raw, `voucher/adjustSalary`, url => {
              console.log(url);
              data.content.file.push({
                name: file.name,
                url: url
              });
              if (data.content.file.length === this.fileList.length) {
                console.log("setpurchase参数", data);
                api.saveCommApply(data).then(res => {
                  this.$loading().close();
                  this.$emit("submit");
                  this.close()
                  this.$message({
                    type: "success",
                    message: "申请成功"
                  });
                });
              }
            });
          }
        } else {
          api.saveCommApply(data).then(res => {
            this.$loading().close();
            this.$emit("submit");
            this.close()
            this.$message({
              type: "success",
              message: "申请成功"
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>