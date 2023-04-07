<!--
 * @Author: kaan
 * @Date: 2021-12-10 19:09:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-20 14:30:47
 * @Version: 
 * @Description: 
-->
<template>
  <el-dialog
    title="全职导师课程申请"
    v-if="strategistCourseVisible"
    :visible.sync="strategistCourseVisible"
    width="1200px"
    :close-on-click-modal="false"
    :before-close="close"
    append-to-body
  >
    <el-form
      :inline="true"
      label-width="150px"
      :model="courseData"
      :rules="rules"
      ref="formVerify"
    >
      <el-form-item align="center" prop="lessonDate" label="上课时间">
        <el-date-picker
          v-model="courseData.lessonDate"
          :style="{width:'200px'}"
          :clearable="false"
          :editable="false"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          placeholder="日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item align="center" prop="lessonHours" label="课时">
        <div>
        <el-slider :style="{width:'560px'}" v-model="courseData.lessonHours" :step="5" :min="15" :max="120" show-stops></el-slider>
        </div>{{courseData.lessonHours}} 分钟
      </el-form-item>
      <el-form-item align="center" prop="settleMentor" label="上课老师">
        <el-select
          size="mini"
          :style="{width:'200px'}"
          v-model="courseData.settleMentor"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in mentorList"
            :key="item.mentorId"
            :label="item.mentorName"
            :value="item.mentorId + '&&'+ item.mentorName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item align="center" prop="lessonName" label="课程名称">
        <el-input
          type="textarea"
          autosize
          v-model="courseData.lessonName"
          size="small"
          :style="{width:'560px'}"
        ></el-input>
      </el-form-item>
      <el-form-item align="center" prop="lessonContent" label="课程内容">
        <el-input
          type="textarea"
          autosize
          v-model="courseData.lessonContent"
          size="small"
          :style="{width:'560px'}"
        ></el-input>
      </el-form-item>
      <br>
      <el-form-item label="材料">
        <el-upload
          action
          class="upload-btn"
          ref="upload1"
          multiple
          :auto-upload="false"
          :file-list="fileList"
          :on-change="change"
          :on-remove="change"
          :style="{width:'200px'}"
          drag
        >
          <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
        </el-upload>
      </el-form-item>
      <br>
      <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
        <el-select
          :style="{width:'200px'}"
          v-model="item.auditor"
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
        <el-select :style="{width:'200px'}" v-model="copy" multiple filterable placeholder="请选择">
          <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "@/api/vip";
import files from '@/libs/file'
import apiDic from "@/api/dictionary.js";
import apiCom from "@/api/common.js";
export default {
  // inject: ["getMenteeId"],
  props: {
    strategistCourseVisible: {
      type: Boolean,
      default: false,
    },
    courseEditData: {
      type: Object,
    },
    signId:{
      type: String,
      default: "",
    },
    mentorData:{},
  },
  data: () => {
    return {
      menteeId: "",
      user: [],
      auditor: [],
      copy: [],
      fileList: [],
      currencyType: "cny",
      note: "",
      account: "",
      payUser: "",
      expenditureAmount: 0,
      expenditureReason: null,
      bd_expenditure_type: [],
      bill_currency_type: [],
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
              confirmorId: "",
            },
          ],
        },
      ],
      courseData: {
        lessonDate: "",
        lessonName: "",
        lessonContent:"",
        lessonHours: 0,
        settleMentor: "",
      },
      mentorList: [],
      rules: {
        lessonDate: { required: true, message: "必填", trigger: "blur" },
        lessonName: { required: true, message: "必填", trigger: "blur" },
        lessonContent: { required: true, message: "必填", trigger: "blur" },
        lessonHours: { required: true, message: "必填", trigger: "blur" },
        settleMentor: { required: true, message: "必填", trigger: "blur" },
      },
    };
  },
  computed: {},
  watch: {
    strategistCourseVisible: function (val) {
      if (val) {
        if (!this.user.length) {
          this.pageInit();
        }
        this.menteeId = this.courseEditData.settleMentee;
        console.log(this.menteeId);
        apiDic.getAuditorListByApplyType("vip_lesson").then((res) => {
          console.log("getAuditorListByApplyType", res.data);
          res.data.forEach((v) => {
            v.auditor = [];
            v.confirmorArr.forEach((value) => {
              if (value.isDefult == 1) {
                v.auditor.push(value.confirmorId);
              }
            });
          });
          this.auditorList = [...res.data];
        });
        this.getMentorListBySignId();
      }
    },
  },
  mounted() {},
  methods: {
    pageInit() {
      apiCom
        .userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: "1",
        })
        .then(({ data }) => {
          console.log(
            "userList...........................................",
            data
          );
          this.user = data.rows;
        });
    },
    getMentorListBySignId() {
      api.getMentorListBySignId(this.signId).then((res) => {
        console.log("项目导师列表", res);
        this.mentorListAPI = res.data;
        res.data.forEach((v) => {
          if (v.mentorType != 1) {
            //   list1.options.push(v);
            // } else {
            this.mentorList.push(v);
            // list2.options.push(v);
          }
        });
        let m = new Map();
        this.mentorList.forEach((v) => {
          m.set(v.mentorId, v);
        });
        console.log(m);
        this.mentorList = [];
        m.forEach((v) => {
          this.mentorList.push(v);
        });
        console.log(this.mentorList);
      });
      apiDic.getUserList("common_strategist").then((res) => {
        console.log(res.data);
        res.data.forEach((v) => {
          this.mentorList.push({
            mentorId: v.userId,
            mentorName: v.userName + "(公共)",
          });
          let m = new Map();
          this.mentorList.forEach((v) => {
            m.set(v.mentorId, v);
          });
          this.mentorList = [];
          m.forEach((v) => {
            this.mentorList.push(v);
          });
        });
      });
      //
    },
    close() {
      this.$emit("close");
      this.clear();
    },
    clear() {
      this.expenditureAmount = null;
      this.expenditureReason = null;
      this.payUser = null;
      this.account = null;
      this.note = null;
      this.fileList = [];
      this.auditor = [];
      this.copyTo = [];
      this.courseData = {
        lessonDate: "",
        lessonName: "",
        lessonContent:"",
        lessonHours: 0,
        settleMentor: "",
      };
      this.$refs.formVerify.resetFields();
      this.mentorList = [];
      // this.$loading().close();
    },
    change(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    submit() {
      this.$refs.formVerify.validate((v) => {
        if (!v) {
          return;
        } else {
          this.submitApply();
        }
      });
    },
    submitApply() {
      console.log("submit", this.fileList, this.auditor, this.copy);
      // 验证
      // if (!this.fileList.length) {
      //   this.$message("凭证材料不能为空");
      //   return;
      // }
      let approval = [];
      let cannot = false;
      this.auditorList.forEach((aa) => {
        if (!aa.auditor.length) {
          cannot = true;
        }
        aa.auditor.forEach((v) => {
          approval.push({ approverId: v });
        });
      });
      if (cannot) {
        this.$message({
          type: "warning",
          message: "审核人都为必填！",
        });
        return;
      }
      let copyTo = [];
      this.copy.forEach((v) => {
        copyTo.push({ copyTo: v });
      });
      
      let lesson = {
        lessonName: this.courseData.lessonName,
        lessonContent: this.courseData.lessonContent,
        signId: this.signId,
        settleMentee: this.menteeId,
        settleMentor: this.courseData.settleMentor.split("&&")[0],
        lessonHours: this.courseData.lessonHours / 60,
        realDate: this.courseData.lessonDate,
        lessonDate: this.courseData.lessonDate,
        materials: "",
      };
      let data = {
        applyType: "vip_lesson",
        applyTitle: `全职导师【${
          this.courseData.settleMentor.split("&&")[1]
        }】的课程申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: "学员名",
              value: this.courseData.menteeName,
            },
            {
              label: "上课时间",
              value: this.courseData.lessonDate,
            },
            {
              label: "课程名称",
              value: this.courseData.lessonName,
            },
            {
              label: "上课内容",
              value: this.courseData.lessonContent,
            },
            {
              label: "上课时长",
              value: this.courseData.lessonHours/60,
            },
            {
              label: "上课人",
              value: this.courseData.settleMentor.split("&&")[1],
            },
          ],
          info: lesson,
        },
        lesson: lesson,
      };
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          let file = this.fileList[i];
          files.uploadFunBySys(file.raw, `materials/vip_lesson`, (url) => {
            data.content.file.push({
              name: file.name,
              url: url,
            });
            lesson.materials += url + ",";
            if (data.content.file.length === this.fileList.length) {
              lesson.materials = lesson.materials.substr(
                0,
                lesson.materials.length - 1
              );
              console.log("setStrategist参数", data);
              this.$loading()
              api.setRefund(data).then((res) => {
                console.log("setStrategist，", res);
                this.$loading().close();
                 if (res.code == '200') {
                  this.$message.success("申请成功")
                  this.$emit("submit");
                  this.clear();
                } else {
                  this.$message.error(res.message)
                }
              });
            }
          });
        }
      } else {
        this.$loading()
        api.setRefund(data).then((res) => {
          console.log("setStrategist，", res);
          this.$loading().close();
            if (res.code == '200') {
            this.$message.success("申请成功")
            this.$emit("submit");
            this.clear();
          } else {
            this.$message.error(res.message)
          }
        });
      }
    },
  },
};
</script>