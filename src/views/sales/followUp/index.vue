<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page" ref="search">
        <div class="search">
          <el-select
            class="mr10"
            size="mini"
            filterable
            v-model="userId"
            placeholder="请选择"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-input
            v-if="roleInfo.includes(`follow_up_search`)"
            class="mr10"
            size="mini"
            style="width:250px"
            v-model="search"
            clearable
            @keyup.enter.native="Topage(1)"
            placeholder="支持姓名、微信名、微信ID"
          ></el-input>
          <el-button
            icon="el-icon-search"
            v-if="roleInfo.includes(`follow_up_search`)"
            class="mr10"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-printer"
            v-if="roleInfo.includes(`follow_up_outFile`)"
            class="mr10"
            size="mini"
            plain
            @click="exportFile('table')"
          >导出</el-button>
          <el-button
            v-if="followUpIdNum === 0"
            class="mr10"
            size="mini"
            plain
            @click="followUp()"
          >今天需跟进({{followUpIdNum}})</el-button>
          <el-button v-else class="mr10" size="mini" plain @click="followUp()">
            今天需跟进
            <span class="redBlod">({{followUpIdNum}})</span>
          </el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`follow_up_page`)"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <hot-table :settings="settings" ref="table" licenseKey="non-commercial-and-evaluation"></hot-table>

      <FollowUp
        :followUpMemberList="followUpMemberList"
        :followUpIdList="followUpIdList"
        :toFollowUpList="toFollowUpList"
        :followUpVisible="followUpVisible"
        :position="position"
        @close="followUpClose"
        @updata="followUpUpdata"
      ></FollowUp>
      <el-drawer
        size="1000px"
        title="Follow Up详情"
        :visible.sync="followVisible"
      >
        <Follow
          :menteeData="menteeData"
          :followVisible="followVisible"
          :position="position"
          @close="followClose"
          @updata="followUpdata"
        ></Follow>
      </el-drawer>
      
      <!-- 录入信息 -->
      <!-- <inputInformation
        :ruleForm="ruleForm"
        :dialogVisible="dialogVisible"
        @success="inputInformationSuccess"
        @close="inputInformationClose"
      ></inputInformation> -->
      <!-- <add-mentee
        :ruleForm="ruleForm"
        :dialogVisible="addVisible"
        :canSubmit="canSubmit"
        @success="addMenteeSuccess"
        @close="addMenteeClose"
      /> -->
    </div>
  </d2-container>
</template>

<script>
import Handsontable from "handsontable";
import axiosapi from "@/api/dictionary";
import api from "@/api/sales_assistant";
import mixins from "@/plugin/mixins";
// import inputInformation from "./components/inputInformation.vue";
import FollowUp from "./components/follow_up_new.vue";
// import AddMentee from "./components/AddMentee.vue";
import Follow from "../mentee/components/Follow.vue";
import { downloadFun } from "@/libs/file";
import util from '@/libs/util'
import { renderShortText } from "@/libs/tableRender.js";
import { mapState } from 'vuex'
// 复制到剪切板
// import Clipboard from "clipboard";
// const btnCopy = new Clipboard(".copy");
// btnCopy.on("success", function(e) {
//   e.trigger.innerText = "复制成功";
//   e.clearSelection(); // 清除选中内容
// });

const roleInfo = util.sessions.get('roleInfo')
const hotbutton = function(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td);
  let innerHTML = "";
  // if (roleInfo.includes(`follow_up_entry`)) {
  //   innerHTML += `<button class='hot-button mr10' onclick='trackingedit(${row})'><i class="el-icon-edit" title="录入"></i><span></span></button>`;
  // }
  if (roleInfo.includes(`follow_up_follow`)) {
    innerHTML += `<button class='hot-button' onclick='follow(${row})'><i class="el-icon-phone-outline" title="跟进"></i><span></span></button>`;
  }
  td.innerHTML = innerHTML;
  return td;
};
const resume = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.dom.empty(td);
  return (td.innerHTML = value
    ? `<button class='hot-button' onclick='seeContracts(${row})'><i class="el-icon-view"></i><span>预览</span></button>`
    : ``);
};
export default {
  mixins: [mixins],
  components: { FollowUp, Follow },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3-9][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      loading:false,
      // 合同类型选择（线上/线下）
      onlineContract: false,

      contractURL: "",
      contractPDFURL: "",
      // 合同正文
      contract2: ``,
      arr: [],

      salesList: [],
      VIPList: [],
      servicesList: [],

      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      // major: MAJOR,
      // mentee_type: MENTEE_TYPE,
      // schoolList: SCHOOL,
      // PROGRAM_TYPE: PROGRAM_TYPE,
      // Program_level: Program_level,
      users: [],
      // 拿数据参数
      search: "",
      userId: "",
      total: 0,
      pageNum: 1,
      pageSize:50,
      sort: null,
      sortCol: null,
      settingsAPIData: [],

      settings: {
        height: 'auto',
        fixedColumnsLeft: 2,
        data: [],
        rowHeaders: true,
        stretchH: "all",
        // manualColumnResize: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        rowHeaders: index => {
          return (this.pageNum - 1) * this.pageSize + index + 1;
        },
        colHeaders: [
          `操作`,
          `微信名`,
          `微信ID`,
          `学员名`,
          `家长一微信ID`,
          `家长一微信名`,
          `家长二微信ID`,
          `家长二微信名`,
          `推荐项目名`,
          `推荐实习数`,
          `follow人姓名`,
          `开始follow日期`,
          `截止follow日期`,
          // `顾问姓名`,
          `分配顾问日期`,
        ],
        readOnly: true,
        columns: [
          {
            data: "hotbutton",
            renderer: hotbutton
          },
          {
            data: "wxName",
            // title: "微信名",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "wxId",
            width: 50,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
            // title: "微信ID",
          },
          {
            data: "menteeName",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
            // title: "学员名",
          },
          {
            data: "parentWx1",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "parentWxName1",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "parentWx2",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "parentWxName2",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "recommendProgramName",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "recommendInternshipNum",
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "followByName",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "beginDate",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          {
            data: "endDate",
            width: 100,
            wordWrap: false,
            className: "short-text",
            renderer: renderShortText
          },
          // {
          //   data: "followByName"
          //   // title: "分配顾问",
          // },
          {
            data: "counselorDate"
            // title: "分配顾问日期",
          },
        ],
        beforeColumnSort: (oldVal, newVal) => {
          if (!newVal.length) {
            this.sort = "";
            this.sortCol = "";
            this.pageNum = 1;
            this.Topage(this.pageNum);
          } else {
            this.sortCol = this.settings.columns[newVal[0].column].data;
            this.sort = newVal[0].sortOrder;
            this.pageNum = 1;
            if (this.sortCol === `hotbutton`) return;
            this.Topage(this.pageNum);
          }
        }
      },

      // 录入1
      display: false,
      wxIdruleForm: {
        wxId: ``
      },
      wxIdrules: {
        wxId: [{ required: true, message: "请输入微信ID", trigger: "blur" }]
      },

      // 录入2
      dialogVisible: false,
      addVisible: false,
      canSubmit: false,
      widths: `230px`,
      ruleForm: {
        menteeId: "", //ID
        wxName: "", //微信名
        wxId: "", //微信ID
        school: "", //学校
        email: "", //邮箱
        degree: "", //学历
        finishYear: "", //毕业年份
        major: "", //专业
        country: "", //国家
        askFor: "", //咨询方向
        counselor: "", //分配顾问
        counselorDate: "", //分配顾问日期
        counselorReplay: "", //顾问是否24小时回复
        sourceFrom: "", //来源
        inGroupDate: "", //拉群日期
        trackingDate: "", //最后跟进日期
        sourceWx: "", //导流微信号
        specialNature: "", //特殊性质（家长、讲座等）
        resume: "", //简历
        resume1: "", //简历流
        note: "" //咨询进度
      },

      // 上传文件
      file: "",
      file233: "",
      // table直接修改.
      updatelist: [],

      signingListVisible: false,
      // 签约弹框控制
      signingVisible: false,
      programDetailShow: false,
      urlVisible: false,

      // 签约信息
      signingForm: {
        // 个人信息
        menteeId: "", //学员ID
        realName: "", //姓名
        email: "", //email
        wxName: "", //微信名
        wxId: "", //微信ID
        sex: null,
        menteeType: "", // 身份
        school: "", // 学校
        sourceFrom: "",
        degree: "",
        finishYear: "",

        // 项目信息
        programType: "",
        programName: "", //项目名
        programId: "", //项目Id
        priceCny: "", //项目价格（人民币）
        priceUsd: "", //项目价格（美金）
        programPriceNote: "", //项目价格备注
        note: "", //项目明细
        strategist: "", //全职导师
        services: "", //全职导师
        mentorHour: "", //行业导师一对一课时数
        strategistHour: "", //全职导师一对一课时数
        leadStrategistHour: "", //全职导师一对一课时数
        contractContent: "",
        program_level: "", //项目级别
        program_type: "", //项目类型

        // 实习
        internship: [
          {
            programName: "", //项目名
            programId: "", //项目Id
            priceCny: "", //项目价格（人民币）
            priceUsd: "", //项目价格（美金）
            internshipUnit: "", //实习单位
            contractContent: "",
            note: "" //实习单位
          }
        ],

        // 汇总
        orderType: "0",
        signDate: "", //签约日期
        startDate: "", //合同有效日期1
        endDate: "", //合同有效日期2
        startAndEnd: [],
        contact1: "", //主联系人
        contact2: "", //副联系人
        totalPriceCny: "", //总价格（人民币）
        totalPriceUsd: "", //总价格（美金）
        rate: "", //
        gifts: [], //礼物
        canSubmit: false //录入弹框的修改权限
      },
      imgPDF: "",
      imgPDFShow: false,
      changePDFShow: false,
      // 合同内容
      contract: "",
      rulesig: {
        email: [
          { required: true, message: "必填", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ],

        wxId: [
          { required: true, message: "请输入微信ID", trigger: "blur" },
          { max: 60, message: "微信ID长度为60个字符以内", trigger: "blur" }
        ], //请输入微信ID
        realName: [{ required: true, message: "不能为空", trigger: "change" }],
        school: [{ required: true, message: "不能为空", trigger: "change" }],
        startDate: [{ required: true, message: "不能为空", trigger: "change" }],
        endDate: [{ required: true, message: "不能为空", trigger: "change" }],
        channel: [{ required: true, message: "请选择渠道", trigger: "change" }],
        sourceFrom: [
          { required: true, message: "请选择渠道", trigger: "change" }
        ],
        degree: [{ required: true, message: "请选择学历", trigger: "change" }],
        finishYear: [
          { required: true, message: "请选择毕业年份", trigger: "change" }
        ],
        channelNote: [
          { max: 60, message: "备注长度为60个字符以内", trigger: "blur" }
        ], //渠道备注
        program: [{ required: true, message: "请选择项目", trigger: "change" }], //项目
        priceCny: [{ required: true, message: "请输入价格", trigger: "blur" }], //项目价格
        chiName: [{ required: true, message: "必填", trigger: "blur" }],
        sex: [{ required: true, message: "必填", trigger: "blur" }],
        totalPrice: [
          { required: true, message: "请输入价格", trigger: "blur" }
        ], //项目价格
        programPriceNote: [
          { max: 60, message: "备注长度为60个字符以内", trigger: "blur" }
        ], //项目价格备注
        rate: [{ required: true, message: "必填", trigger: "change" }], //签约日期
        signDate: [
          { required: true, message: "请选择签约日期", trigger: "change" }
        ], //签约日期
        startDate: [
          { required: true, message: "请选择签约日期", trigger: "change" }
        ], //签约日期
        startAndEnd: [
          { required: true, message: "请选择合同有效日期", trigger: "change" }
        ], //合同有效日期
        contact1: [
          { required: true, message: "请选择主联系人", trigger: "change" }
        ], //主联系人
        // contact2: "", //副联系人
        // note: "", //项目明细
        strategist: [
          { required: true, message: "请选择全职导师", trigger: "change" }
        ], //全职导师
        services: [
          { required: true, message: "请选择客服", trigger: "change" }
        ],
        mentorHour: [
          // { min: 0,max:3,  message: '不能小于0', trigger: 'blur' },
          //  { type: 'number', message: '课时数必须为数字值'}
        ], //行业导师一对一课时数
        strategistHour: [
          // { min: 0,  message: '不能小于0', trigger: 'blur' },
          //  { type: 'number', message: '课时数必须为数字值'}
        ], //全职导师一对一课时数
        leadStrategistHour: [
          // { min: 0,  message: '不能小于0', trigger: 'blur' },
          //  { type: 'number', message: '课时数必须为数字值'}
        ], //全职导师一对一课时数
        programType: [
          { required: true, message: "请选择项目类别", trigger: "change" }
        ], //项目类别
        programLevel: [
          { required: true, message: "请选择项目级别", trigger: "change" }
        ], //项目级别
        signGrade: [
          { required: true, message: "请选择签约年级", trigger: "change" }
        ], //签约年级
        company: [{ required: true, message: "必填", trigger: "change" }],
        contract: [{ required: true, message: "必填", trigger: "change" }],
        recipientName: [{ required: true, message: "必填", trigger: "change" }],
        recipientPhone: [
          { required: true, message: "必填", trigger: "change" },
          {
            validator: checkPhone,
            message: "手机号格式",
            trigger: "blur"
          }
        ],
        recipientAddr: [{ required: true, message: "必填", trigger: "change" }],
        background: [{ required: true, message: "必填", trigger: "change" }],
        situation: [{ required: true, message: "必填", trigger: "change" }],
        discountInfo: [{ required: true, message: "必填", trigger: "change" }],
        notice: [{ required: true, message: "必填", trigger: "change" }]
        // internshipUnit: [
        //   { required: true, message: "请选择实习单位", trigger: "change" }
        // ], //实习单位
      },

      // 合同项目列表
      programList: [],
      programId: null,

      internshipNum: 0,
      // 用于控制表单
      internshipNum2: 0,
      // major: MAJOR,
      //实习单位列表
      internshipUnitList: [],
      // 合同项目列表，三级联动
      programList2: [],
      //实习项目列表
      internshipTimesList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      programArr: [],
      internshipArr: [],

      //follow up 弹框数据
      followUpVisible: false,
      followUpIdList: [],
      toFollowUpList: [],
      followUpMemberList: [],
      followUpIdNum: 0,
      position: "sales",
      //follow up 弹框数据
      followVisible: false,
      followMemberId: null,
      menteeData: {},

      programData: {},

      // 签约公司列表
      company: [],
      contractList: [],

      //用于计算是否折扣
      basePriceCny: 0,
      basePriceUsd: 0,
      internshipPrice: [],
      priceOff: false,
      // 汇率合理范围
      extentRate: ""
    };
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo']),
    totalPriceCny2: {
      get: function() {
        let price = 0;
        this.programId && (price += this.signingForm.priceCny * 1);
        if (this.internshipNum != 0) {
          for (let i = 0; i < this.internshipNum2; i++) {
            price += this.signingForm.internship[i].priceCny * 1;
          }
        }
        this.signingForm.totalPriceCny = price;
      },
      set: function(v) {}
    },
    totalPriceUsd2: {
      get: function() {
        let price = 0;
        this.programId && (price += this.signingForm.priceUsd * 1);
        if (this.internshipNum != 0) {
          for (let i = 0; i < this.internshipNum2; i++) {
            price += this.signingForm.internship[i].priceUsd * 1;
          }
        }
        this.signingForm.totalPriceUsd = price;
      },
      set: function(v) {}
    },
    midSchool() {
      return this.ruleForm.school;
    },
    // 用开始日期生成结束日期
    midStartDate() {
      return this.signingForm.startDate;
    },
    midRate() {
      return this.signingForm.rate;
    }
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.settings.height = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    },
    midSchool: function(newD, old) {
      let len = this.school.length;
      for (let i = 0; i < len; i++) {
        if (this.school[i].schoolId == newD) {
          let len = this.country.length;
          for (let j = 0; j < len; j++) {
            if (this.country[j].itemName == this.school[i].country) {
              this.ruleForm.country = this.country[j].itemValue;
              break;
            }
          }
          break;
        }
      }
    },
    midRate: function(newD, oldD) {
      if (this.signingForm.currencyType !== "cny") {
        this.signingForm.priceCny = Math.round(
          this.signingForm.priceUsd * newD
        );
      } else {
        this.signingForm.priceUsd = Math.round(
          this.signingForm.priceCny / newD
        );
      }
      this.signingForm.internship.forEach(v => {
        v.priceCny = Math.round(v.priceUsd * newD);
      });
    },
    // 合同开始日期，自动填充结束日期
    midStartDate: function(val, oldVal) {
      switch (this.signingForm.periodUnit) {
        case "year":
          {
            let arr = val.split(/[年月日]/);
            arr[0] += this.signingForm.period;
            val = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
          }
          break;
        case "week":
          {
            let arr = val.split(/[年月日]/);
            console.log(val);
            let date = new Date();
            date.setFullYear(arr[0]);
            date.setMonth(arr[1]);
            date.setDate(arr[2] * 1 + this.signingForm.period * 7);
            val =
              date.getFullYear() +
              "年" +
              date.getMonth() +
              "月" +
              date.getDate() +
              "日";
          }
          break;
        case "month":
          {
            let arr = val.split(/[年月日]/);
            arr[1] = arr[1] * 1 + this.signingForm.period;
            while (arr[1] > 12) {
              arr[1] -= 12;
              arr[0] = arr[0] * 1 + 1;
            }
            val = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
          }
          break;
        case "day":
          {
            let arr = val.split(/[年月日]/);
            console.log(val);
            let date = new Date();
            date.setFullYear(arr[0]);
            date.setMonth(arr[1]);
            date.setDate(arr[2] * 1 + this.signingForm.period);
            val =
              date.getFullYear() +
              "年" +
              date.getMonth() +
              "月" +
              date.getDate() +
              "日";
          }
          break;
      }
      this.signingForm.endDate = val;
    }
  },
  created() {
    if (
      !this.roleInfo.includes(`follow_up_entry`) &&
      !this.roleInfo.includes(`follow_up_follow`)
    ) {
      this.settings.colHeaders.splice(0, 1);
      this.settings.columns.splice(0, 1);
    }
    this.axios();
  },
  mounted() {
    window.seeContracts = row => this.seeContracts(row);
    window.trackingedit = row => this.trackingedit(row);
    window.trackingsigning = row => this.trackingsigning(row);
    window.follow = row => this.follow(row);
    window.trackingdel = row => this.trackingdel(row);
    this.userId = "ALL";
    this.Topage(1);
    this.getBasicProgram();
  },
  methods: {
    //获取签约基本项目名（三级选择）
    getBasicProgram() {
      this.programList2 = [];
      axiosapi.getProgramList().then(res => {
        console.log("getProgramList", res.data);
        this.programList2 = res.data.basicProgram;
      });
    },
    changeOption(v, item) {
      console.log(v, item);
      this.internshipUnitList.forEach((ve, i) => {
        if (ve.internshipName == v) {
          this.signingForm.internship[item].priceUsd = ve.priceUsd;
          this.internshipPrice[item] = ve.priceUsd;
          return;
        }
      });
    },
    onlineContractToOffline() {
      this.onlineContract = false;
    },
    // 获取人员数据列表
    axios() {
      this.userId = this.userInfo.userId;
      // this.userId = "Annie";
      api.subordinate(this.userId, "sales").then(({ data }) => {
        let users = [
          { userId: "ALL", userName: "ALL" },
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ];
        if (this.roleInfo.includes(`follow_up_all_data`)) {
          users.unshift({ userId: "ALL_Data", userName: "ALL（全部数据）" });
        }
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e);
          }
        });
        this.users = users;
      });
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: "userName",
          sort: "ASC",
          positionType: "sales"
        })
        .then(res => {
          this.salesList = res.data.rows;
        });
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: "userName",
          sort: "ASC",
          positionType: "strategist"
        })
        .then(res => {
          this.VIPList = res.data.rows;
        });
      api
        .userList({
          pageNum: 1,
          pageSize: 10000,
          sortCol: "userName",
          sort: "ASC",
          positionType: "services"
        })
        .then(res => {
          this.servicesList = res.data.rows;
        });
      api.getSignCompanyList().then(res => {
        console.log("公司列表", res.data);
        this.company = res.data;
      });
      //礼物列表
      axiosapi.getGiftList("0").then(({ data }) => {
        console.log("礼物列表", data);
        this.giftList = data;
      });
    },
    // 拿follow up 数据
    getFollowUpMenteeIdListByUserId() {
      api
        .getFollowUpMenteeIdListByUserId({
          position: "sales",
          userId: this.userInfo.userId
        })
        .then(res => {
          console.log("拿follow up menteeId list 数据", res);
          let number = 0;
          res.data.member.forEach(v => {
            number += v.userCount;
          });
          this.followUpIdNum = number;
          this.followUpIdList = [];
          this.toFollowUpList = [];
          this.followUpMemberList = res.data.member;
          res.data.list.forEach(v => {
            this.followUpIdList.push(v.menteeId);
          });
          res.data.member.forEach(v => {
            v.userFollowUpList &&
              this.toFollowUpList.push(...v.userFollowUpList);
          });
          console.log(this.toFollowUpList);
        })
        .catch(err => {
          console.log("拿follow up 数据", err);
        });
    },
    Topage() {
      this.loading =true;
      this.followUpUpdata();
      let data = {
        sort: this.sort,
        sortCol: this.sortCol,
        search: this.search,
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        pageType: "sales"
      };
      this.settings.data = [];
      for (let i = 0; i < this.pageSize; i++) {
        this.settings.data.push({});
      }
      api.getFollowUpListSales(data).then(({ data }) => {
        console.log(data,'yx11121321231');
        this.pageNum = data.page;
        let rows = data.rows;
        this.settingsAPIData = JSON.parse(JSON.stringify(data.rows));
        this.settings.data = rows;
        this.total = data.total;
        this.updatelist = [];
        this.loading = false;
      });
    },
    sortChange(params) {
      let flag = true;
      Object.keys(params).forEach(key => {
        if (params[key] !== "") {
          flag = false;
          this.sortCol = key;
          this.sort = params[key];
        }
      });
      if (flag) {
        this.sortCol = "";
        this.sort = "";
      }
      this.pageNum = 1;
      this.Topage(this.pageNum);
    },
    seeContracts(row) {
      let data = this.settings.data[row];
      console.log(data);
      downloadFun(data.resume1, url => {
        window.open(url);
      });
      // 拿合同数据
    },
    // 录入弹框
    trackingedit(row) {
      let data = this.settingsAPIData[row];
      console.log(data);
      this.ruleForm = {
        menteeId: data.menteeId, //iD
        realName: data.realName,
        wxName: data.wxName, //微信名
        wxId: data.wxId, //微信ID
        menteeType: data.menteeType,
        school: data.school, //学校
        email: data.email, //邮箱
        degree: data.degree, //学历
        finishYear: data.finishYear, //毕业年份
        major: !!data.major && data.major !== "" ? data.major.split(",") : [], //专业
        country: data.country, //国家
        askFor: data.askFor, //咨询方向
        counselor: data.counselor, //分配顾问
        counselorDate: data.counselorDate, //分配顾问日期
        counselorReplay: data.counselorReplay, //顾问是否24小时回复
        sourceFrom: data.sourceFrom, //来源
        inGroupDate: data.inGroupDate, //拉群日期
        trackingDate: data.trackingDate, //最后跟进日期
        sourceWx: data.sourceWx, //导流微信号
        specialNature: data.specialNature, //特殊性质（家长、讲座等）
        resume1: data.resume1, //简历
        resume: "", //简历
        note: data.note //咨询进度
      };
      this.dialogVisible = true;
    },

    // 抽取学员基本信息，并且显示一级合同生成页,请求项目列表
    trackingsigning(row) {
      let data = this.settingsAPIData[row];
      console.log(data,'yx*****okay');
      this.signingForm.menteeId = data.menteeId; //学员ID
      this.signingForm.realName = data.realName; //学员名
      this.signingForm.email = data.email;
      this.signingForm.wxName = data.wxName; //微信名
      this.signingForm.wxId = data.wxId; //微信ID
      this.signingForm.sex = data.sex;
      this.signingForm.school = data.school; //学校
      // this.signingForm.channel = ""; //渠道
      // this.signingForm.channelNote = ""; //渠道
      // 获取学员基本信息
      api.getMenteeDataByMenteeId(data.menteeId).then(res => {
        console.log("获取学员基本信息", res.data);
        this.signingForm.wxId = res.data.wxId; //微信ID
        this.signingForm.email = res.data.email;
        this.signingForm.sex = res.data.sex;
        this.signingForm.finishYear = res.data.finishYear;
        this.signingForm.degree = res.data.degree;
        this.signingForm.sourceFrom = res.data.sourceFrom;
      });

      this.signingListVisible = true;
    },
    //follow
    follow(row) {
      let data = this.settingsAPIData[row];
      // console.log(data);
      this.followMemberId = data.menteeId; //学员ID
      this.followVisible = true;
      this.menteeData = data;
    },
    trackingdel(row) {
      let data = this.settings.data[row];
      if (data.createBy !== this.userInfo.userId) {
        this.$message({
          type: "warning",
          message: "无法删除，你不是该录入记录创建人！"
        });
        return;
      }
      if (data.createTime) {
        let createTime = data.createTime;
        createTime = createTime.replace(/-/g, "/");
        createTime = new Date(createTime).getTime() + 604800000;
        if (createTime < new Date().getTime()) {
          this.$message({
            type: "warning",
            message: "无法删除，录入时间超过一周！"
          });
          return;
        }
      }
      this.$confirm("此操作将永久删除该录入记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .deleteMenteeByMenteeId({
              delFlag: `1`,
              menteeId: data.menteeId
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.Topage(this.pageNum);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    save() {
      if (!this.updatelist.length) return;
      api.menteeTable({ updatelist: this.updatelist }).then(e => {
        this.Topage(this.pageNum);
        this.updatelist = [];
      });
    },
    cencel() {
      // this.$refs.wxIdruleForm.resetFields();
      this.display = false;
    },
    cancelPdf() {
      this.imgPDFShow = false;
    },
    confirm() {
      this.$refs.wxIdruleForm.validate(valid => {
        if (!valid) return;
        api.wxId(this.wxIdruleForm.wxId).then(({ data }) => {
          this.ruleForm.major = [];
          if (data === null) {
            this.ruleForm.wxId = this.wxIdruleForm.wxId;
            this.canSubmit = true;
          } else {
            this.canSubmit = false;
            this.ruleForm = {
              menteeId: data.menteeId === undefined ? "" : data.menteeId, //id
              wxName: data.wxName === undefined ? "" : data.wxName, //微信名
              wxId: data.wxId === undefined ? "" : data.wxId, //微信ID
              school: data.school === undefined ? "" : data.school, //学校
              email: data.email === undefined ? "" : data.email, //邮箱
              degree: data.degree === undefined ? "" : data.degree, //学历
              finishYear: data.finishYear === undefined ? "" : data.finishYear, //毕业年份
              country: data.country === undefined ? "" : data.country, //国家
              askFor: data.askFor === undefined ? "" : data.askFor, //咨询方向
              counselor: data.counselor === undefined ? "" : data.counselor, //分配顾问
              counselorDate:
                data.counselorDate === undefined ? "" : data.counselorDate, //分配顾问日期
              counselorReplay:
                data.counselorReplay === undefined ? "" : data.counselorReplay, //顾问是否24小时回复
              sourceFrom: data.sourceFrom === undefined ? "" : data.sourceFrom, //来源
              inGroupDate:
                data.inGroupDate === undefined ? "" : data.inGroupDate, //拉群日期
              trackingDate:
                data.trackingDate === undefined ? "" : data.trackingDate, //最后跟进日期
              sourceWx: data.sourceWx === undefined ? "" : data.sourceWx, //导流微信号
              specialNature:
                data.specialNature === undefined ? "" : data.specialNature, //特殊性质（家长、讲座等）
              resume: data.resume1 === undefined ? "" : data.resume1, //简历
              resume1: "", //简历
              note: data.note === undefined ? "" : data.note //咨询进度
            };
            if (data.major) {
              major = data.major.split(","); //专业
            }
          }
          this.addVisible = true;
        });
      });
    },
    // 取消合同项目选择
    signingClose() {
      this.signingVisible = false;
      this.programId = "";
      this.internshipNum = 0;
      this.programArr = [];
      this.internshipNum2 = 0;
      this.signingForm.internship.length = 1;
      this.signingForm.programType = "";
      this.signingForm.programName = "";
      this.signingForm.programId = "";
      this.signingForm.priceCny = "";
      this.signingForm.priceUsd = "";
      this.signingForm.mentorHour = 0;
      this.signingForm.strategistHour = 0;
      this.signingForm.leadStrategistHour = 0;
      this.signingForm.period = null;
      this.signingForm.periodUnit = null;
      this.signingForm.contractContent = "";
      this.signingForm.signDate = null;
      this.signingForm.orderType = "0";
      this.signingForm.startDate = null;
      this.signingForm.endDate = null;
      this.signingForm.startAndEnd = [];
      this.signingForm.contact1 = null;
      this.signingForm.contact2 = null;
      this.signingForm.rate = null;
      this.signingForm.gifts = [];
    },
    // 从订单列表页到项目选择页
    toSign() {
      this.signingListVisible = false;
      this.signingVisible = true;
    },
    //从项目选择跳转到合同详情页
    toDetail() {
      console.log(this.internshipArr, this.programArr);
      // 判断是否有选择项目
      this.programId = this.programArr[this.programArr.length - 1];
      if (this.internshipNum != 0 || !!this.programId) {
        // 拿实习单位列表
        if (this.internshipNum != 0) {
          api.getInternshipList().then(res => {
            console.log(res);
            this.internshipUnitList = res.data.rows;
          });
        }
        // 拿汇率区间
        api.getRate({ currencyType: "usd" }).then(res => {
          console.log("拿汇率区间", res.data);
          this.extentRate = res.data.orderRate1;
        });
        this.signingForm.rate = null;
        // 个人信息
        this.signingForm;

        // 拿项目信息
        console.log(this.programArr, this.programId);
        if (this.programId) {
          api
            .getProgramById(this.programId)
            .then(res => {
              console.log("拿项目信息yxfollow_up", res.data);
              this.programData = res.data;
              let data = res.data;
              this.signingForm.programType = data.programType;
              this.signingForm.programName = data.programName;
              this.signingForm.programId = data.programId;
              this.signingForm.priceCny = data.priceCny;
              this.basePriceCny = data.priceCny;
              this.basePriceUsd = data.priceUsd;
              this.signingForm.priceUsd = data.priceUsd;
              this.signingForm.mentorHour = data.mentorHour;
              this.signingForm.strategistHour = data.strategistHour;
              this.signingForm.leadStrategistHour = data.leadStrategistHour;
              this.signingForm.period = data.period;
              this.signingForm.periodUnit = data.periodUnit;
              this.signingForm.currencyType = data.currencyType;
              this.contractList = data.contractList;
            })
            .catch(err => {
              this.$message("网络故障请刷新");
            });
        }
        // 实习信息
        this.internshipNum;
        // console.log(this.internship);
        this.signingForm.internship.length = 1;
        if (this.internshipNum) {
          this.internshipPrice = [0];
          for (let i = 1; i < this.internshipNum; i++) {
            this.signingForm.internship.push({
              ...this.signingForm.internship[0]
            });
            this.internshipPrice.push(0);
          }
          this.internshipNum2 = this.internshipNum;
        } else {
          this.internshipPrice = [];
        }
        // 默认主联系人为当前登录用户
        this.salesList.forEach(v => {
          if (v.userId == this.userInfo.userId) {
            this.signingForm.contact1 = this.userInfo.userId;
          }
        });
        this.programDetailShow = true;
      } else {
        this.signingClose();
      }
    },
    // 取消合同生成弹框
    programDetailCancel() {
      this.programDetailShow = false;
      // this.clear();
    },
    //取消签约
    cancelBoth() {
      this.programDetailCancel();
      this.signingClose();
    },
    // 生成
    createURL() {
      let canGo = true;
      if (/^[a-z]|\s[a-z]/.test(this.signingForm.chiName)) {
        this.$message({
          type: "warning",
          message: "请检查法定名输入规范"
        });
        return;
      }
      //实习单位
      if (this.internshipPrice.some(v => !v)) {
        this.$message({
          type: "warning",
          message: "请检查实习单位"
        });
        return;
      }

      this.$refs.signingForm1.validate(valid => {
        if (!valid) canGo = false;
      });

      this.$refs.signingForm2 &&
        this.$refs.signingForm2.validate(valid => {
          if (!valid) canGo = false;
        });
      // 礼物
      this.$refs.signingForm4 &&
        this.$refs.signingForm4.validate(valid => {
          if (!valid) canGo = false;
        });
      //transition
      this.$refs.signingForm5 &&
        this.$refs.signingForm5.validate(valid => {
          if (!valid) canGo = false;
        });
      this.$refs.signingForm &&
        this.$refs.signingForm.validate(valid => {
          if (!valid) canGo = false;
        });
      //确认金额是否打折
      //判断有折扣说明
      this.signingForm.currencyType; //项目货币基准
      let priceRate = offPrice(
        this.signingForm.currencyType == "cny"
          ? this.basePriceCny
          : this.basePriceUsd * this.signingForm.rate,
        this.internshipPrice,
        this.signingForm.currencyType == "cny"
          ? this.signingForm.priceCny
          : this.signingForm.priceUsd * this.signingForm.rate,
        this.signingForm.internship,
        this.signingForm.rate
      );
      if (priceRate >= 5) {
        if (!this.signingForm.discountInfo) {
          this.$message({
            type: "warning",
            message: "价格有折扣，请填写折扣说明"
          });
          this.priceOff = true;
          return;
        }
      } else {
        if (this.extentRate <= this.signingForm.rate) {
          this.priceOff = false;
          this.signingForm.discountInfo = "";
        } else {
          priceRate = 5;
        }
      }
      // 计算价格打折比例；%
      function offPrice(bp, ip, nbp, nip, r) {
        let totalP = bp * 1;
        ip.length &&
          ip.forEach(v => {
            totalP += v * r;
          });
        let nTotalP = nbp * 1;
        nip.length &&
          nip.forEach(v => {
            nTotalP += v.priceUsd * r;
            console.log(nTotalP);
          });
        console.log(nTotalP, totalP);
        return ((totalP - nTotalP) / totalP) * 100;
      }
      // console.log("合同内容", this.content2, this.onlineContract);
      if (!this.content2 && this.onlineContract) {
        this.$message({
          type: "warning",
          message: "请先预览合同，并确认无误"
        });
        return;
      }
      // 合同样式配置
      // 第*章 => \n第.章\s
      //  第*条 => \n第\d\d?条\s
      //   n.n => \n\d\d?\.\d\d?\s
      //   n.n.n => \n\d\d?\.\d\d?\.\d\d?\s
      //   n. => \n\d\d?\.\s

      let reg = /(\n第.章\s)|(\n第\d\d?条\s)|(\n\d\d?\.\d\d?\s)|(\n\d\d?\.\d\d?\.\d\d?\s)|(\n\d\d?\.\s)/g;
      let rarr = [];
      let r = [];
      while ((r = reg.exec(this.content2))) {
        rarr.push(r);
      }
      for (let i = 0; i < rarr.length; i++) {
        let str = rarr[i][0];
        let newStr = str.substr(0, str.length - 1) + "\t";
        this.content2 = this.content2.replace(str, newStr);
      }
      console.log(this.content2, this.signingForm.contract);

      if (canGo) {
        let data = {
          programName: this.signingForm.programName,
          contractTitle:
            this.signingForm.contract &&
            this.signingForm.contract.split("&&&")[0],
          mentee: {
            menteeId: this.signingForm.menteeId,
            realName: this.signingForm.realName,
            chiName: this.signingForm.chiName,
            school: this.signingForm.school, //ID
            sourceFrom: this.signingForm.sourceFrom,
            degree: this.signingForm.degree,
            finishYear: this.signingForm.finishYear,
            email: this.signingForm.email,
            sex: this.signingForm.sex
          },
          contractContent: this.content2
        };
        data.mentee.schoolName = data.mentee.school;
        this.school.forEach(v => {
          if (v.schoolId == data.mentee.school) {
            data.mentee.schoolName = v.schoolName;
          }
        });
        if (this.signingForm.programId) {
          this.signingForm.priceCny =
            this.signingForm.priceCny && this.signingForm.priceCny > 0
              ? this.signingForm.priceCny
              : this.signingForm.priceUsd * this.signingForm.rate;
          let basic = {
            program: this.signingForm.programId,
            programName: this.signingForm.programName,
            programPriceCny: this.signingForm.priceCny,
            programPriceUsd: this.signingForm.priceUsd,
            programPriceNote: this.signingForm.programPriceNote,
            strategist: this.signingForm.strategist,
            services: this.signingForm.services,
            mentorHour:
              this.signingForm.mentorHour && this.signingForm.mentorHour > 0
                ? this.signingForm.mentorHour
                : 0,
            vipHour:
              this.signingForm.leadStrategistHour +
              this.signingForm.strategistHour,
            leadStrategistHour: this.signingForm.leadStrategistHour,
            note: this.signingForm.note,
            program_level: this.signingForm.program_level,
            program_type: this.signingForm.program_type
          };
          data.basic = basic;
        }
        if (!!this.internshipNum) {
          let internship = [];
          console.log(this.signingForm.internship);
          data.internship = this.signingForm.internship;
          // 判断价格为空给0；
          data.internship.forEach(v => {
            v.priceCny = v.priceCny && v.priceCny > 0 ? v.priceCny : 0;
          });
          for (let i = 0; i < this.internshipNum; i++) {
            this.signingForm.internship[i].priceCny =
              this.signingForm.internship[i].priceUsd * this.signingForm.rate;
            let inter = {
              program: 3,
              programPriceCny: this.signingForm.internship[i].priceCny,
              programPriceUsd: this.signingForm.internship[i].priceUsd,
              internship: this.signingForm.internship[i].internshipUnit,
              note: this.signingForm.internship[i].note
            };
            internship.push(inter);
          }
          data.internship = internship;
        }
        let collect = {
          orderType: this.signingForm.orderType,
          signDate: this.signingForm.signDate,
          startDate: this.signingForm.startDate,
          endDate: this.signingForm.endDate,
          contact1: this.signingForm.contact1,
          contact2: this.signingForm.contact2,
          rate: this.signingForm.rate,
          orderPrice: this.signingForm.totalPriceCny,
          orderPriceUsd: this.signingForm.totalPriceUsd
        };
        if (this.signingForm.discountInfo) {
          collect.discountStatus = 1;
          collect.discountProportion = priceRate * 1;
          collect.discountInfo = this.signingForm.discountInfo;
        }
        data.collect = collect;
        if (this.signingForm.gifts.length) {
          this.signingForm.gifts.forEach(v => {
            v.giftId = v.gift.split("&&")[0];
          });
          let gift = {
            recipientName: this.signingForm.recipientName || "",
            recipientPhone: this.signingForm.recipientPhone || "",
            recipientAddr: this.signingForm.recipientAddr || "",
            remark: this.signingForm.remark || "",
            giftArr: this.signingForm.gifts
          };

          data.gift = gift;
        }

        if (data.collect.startDate > data.collect.endDate) {
          this.$message("合同终止日期不可小于开始日期");
          return;
        }
        console.log(data.collect.signDate, data.collect.startDate);
        if (data.collect.signDate > data.collect.startDate) {
          this.$message("合同起始日期不可小于签约日期");
          return;
        }
        //transition
        let transition = {
          background: this.signingForm.background,
          situation: this.signingForm.situation,
          notice: this.signingForm.notice,
          other: this.signingForm.other,
          locationArr: this.signingForm.locations,
          trackArr: this.signingForm.tracks
        };
        data.transition = transition;
        console.log(data);
        this.loading =true;
        // 线下/线上
        if (this.onlineContract) {
          api
            .createOnlineContract(data)
            .then(res => {
              console.log("创建签约在线签约", res);
              this.contractURL = res.data.signUrl;
              this.contractPDFURL = res.data.docUrl;
              this.signingClose();
              this.programDetailShow = false;
              this.urlVisible = true;
              this.content2 = "";
              this.loading = false,
              this.Topage(1);
              this.clear();
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.message
              });
              this.loading = false
              console.log(err);
            });
        } else {
          api
            .createOfflineContract(data)
            .then(res => {
              console.log("创建签约线下签约", res);
              this.signingClose();
              this.programDetailShow = false;
              this.content2 = "";
              this.loading = false
              this.$message({
                type: "success",
                message: "创建成功"
              });
              this.Topage(1);
              this.clear();
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "error",
                message: err.message
              });
              this.loading = false
            });
        }
      }
    },
    // 签约完成后，清空签约的信息
    clear() {
      this.signingForm = {
        // 个人信息
        menteeId: "", //学员ID
        realName: "", //姓名
        email: "", //email
        wxName: "", //微信名
        wxId: "", //微信ID
        sex: null,
        menteeType: "", // 身份
        school: "", // 学校
        sourceFrom: "",
        degree: "",
        finishYear: "",

        // 项目信息
        programType: "",
        programName: "", //项目名
        programId: "", //项目Id
        priceCny: "", //项目价格（人民币）
        priceUsd: "", //项目价格（美金）
        programPriceNote: "", //项目价格备注
        note: "", //项目明细
        strategist: "", //全职导师
        services: "", //全职导师
        mentorHour: "", //行业导师一对一课时数
        strategistHour: "", //全职导师一对一课时数
        leadStrategistHour: "", //全职导师一对一课时数
        contractContent: "",
        program_level: "", //项目级别
        program_type: "", //项目类型

        // 实习
        internship: [
          {
            programName: "", //项目名
            programId: "", //项目Id
            priceCny: "", //项目价格（人民币）
            priceUsd: "", //项目价格（美金）
            internshipUnit: "", //实习单位
            contractContent: "",
            note: "" //实习单位
          }
        ],

        // 汇总
        orderType: "0",
        signDate: "", //签约日期
        startDate: "", //合同有效日期1
        endDate: "", //合同有效日期2
        startAndEnd: [],
        contact1: "", //主联系人
        contact2: "", //副联系人
        totalPriceCny: "", //总价格（人民币）
        totalPriceUsd: "", //总价格（美金）
        rate: "", //
        gifts: [], //礼物
        canSubmit: false //录入弹框的修改权限
      };
      this.priceOff = false;
    },
    submitGG2() {
      this.content2 = document.getElementById("list").innerText;
      console.log(this.content2);
      this.changePDFShow = false;
    },
    //修改合同内容
    changePdf() {
      this.$refs.signingForm1.validate(valid => {
        if (!valid) return;
        this.$refs.signingForm.validate(valid => {
          if (!valid) return;
          console.log(this.signingForm);
          // 配置合同内容
          let contractContent =
            this.signingForm.contract &&
            this.signingForm.contract.split("&&&")[1];
          if (!contractContent) {
            this.$message("合同内容为空，请联系领导");
            return;
          }
          console.log(this.arr);
          let reg = /\$\{.+?\}/g;
          let arr = [];
          let r = [];
          while ((r = reg.exec(contractContent))) {
            arr.push(r);
          }
          // console.log(contractContent,arr);
          this.programData = Object.assign(
            {},
            this.programData,
            this.signingForm
          );
          console.log(this.programData, contractContent, arr);
          arr.forEach(v => {
            let param = v[0].substr(2, v[0].length - 3);
            console.log(v[0], param, this.programData[param]);
            if (param == "giftName") {
              let giftName = "";
              this.signingForm.gifts &&
                this.signingForm.gifts.forEach(v => {
                  giftName += v.gift.split("&&")[1] + "*" + v.giftNum + ", ";
                });
              let len = giftName.length - 2;
              contractContent = contractContent
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    (giftName.length ? giftName.substr(0, len) : "__________") +
                    "</span>"
                );
            }
            if (param == "giftTotalPrice") {
              let giftTotalPrice = 0;
              this.signingForm.gifts &&
                this.signingForm.gifts.forEach(v => {
                  giftTotalPrice += v.gift.split("&&")[2] * 1 * v.giftNum;
                });
              contractContent = contractContent
                .split(v[0])
                .join(
                  '<span style="background:#afa">' + giftTotalPrice + "</span>"
                );
            }
            if (param == "internship") {
              contractContent = contractContent
                .split(v[0])
                .join(
                  '<span style="background:#afa">' +
                    this.internshipNum +
                    "</span>"
                );
            }
            contractContent = contractContent
              .split(v[0])
              .join(
                '<span style="background:#afa">' +
                  (this.programData[param] || 0) +
                  "</span>"
              );
          });
          console.log(contractContent);
          this.arr = contractContent.split("\n");
          this.changePDFShow = true;
        });
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.Topage(this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.Topage(this.pageNum);
    },
    // 导出文件
    exportFile(e) {
      // 拿handsontable实例
      let handsontable = this.$refs[e].$data.hotInstance;
      let fileName = "客户列表_";
      let exportPlugin1 = handsontable.getPlugin("exportFile");
      exportPlugin1.downloadFile("csv", {
        bom: true,
        // columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: "csv",
        filename:
          fileName +
          this.userInfo.userName +
          "_" +
          this.userId +
          "_[YYYY]-[MM]-[DD]",
        mimeType: "text/csv",
        rowDelimiter: "\r\n",
        rowHeaders: true
      });
    },
    inputInformationSuccess() {
      console.log("录入弹框确认成功回调");
      this.Topage(this.pageNum);
      this.cencel();
    },
    inputInformationClose() {
      console.log("录入弹框关闭");
      this.dialogVisible = false;
      this.ruleForm = {
        menteeId: "", //ID
        wxName: "", //微信名
        wxId: "", //微信ID
        menteeType: "",
        school: "", //学校
        email: "", //邮箱
        degree: "", //学历
        finishYear: "", //毕业年份
        major: [], //专业
        country: "", //国家
        askFor: "", //咨询方向
        signStatus: "", //是否签约
        firstAskDate: "", //首次联系日期
        counselorStatus: "", //是否分配顾问
        counselorGroup: "", //分配部门
        counselor: "", //分配顾问
        counselorDate: "", //分配顾问日期
        counselorReplay: "", //顾问是否24小时回复
        sourceFrom: "", //来源
        sourceWx: "", //导流微信号
        storageStatus: "", //人才库
        specialNature: "", //特殊性质（家长、讲座等）
        resume: "", //简历
        resume1: "", //简历
        note: "" //咨询进度
      };
    },
    // 录入
    addMenteeSuccess() {
      console.log("录入弹框确认成功回调");
      this.Topage(this.pageNum);
      this.cencel();
    },
    addMenteeClose() {
      console.log("录入弹框关闭");
      this.addVisible = false;
      this.ruleForm = {
        menteeId: "", //ID
        wxName: "", //微信名
        wxId: "", //微信ID
        menteeType: "",
        school: "", //学校
        email: "", //邮箱
        degree: "", //学历
        finishYear: "", //毕业年份
        major: [], //专业
        country: "", //国家
        askFor: "", //咨询方向
        signStatus: "", //是否签约
        firstAskDate: "", //首次联系日期
        counselorStatus: "", //是否分配顾问
        counselorGroup: "", //分配部门
        counselor: "", //分配顾问
        counselorDate: "", //分配顾问日期
        counselorReplay: "", //顾问是否24小时回复
        sourceFrom: "", //来源
        sourceWx: "", //导流微信号
        storageStatus: "", //人才库
        specialNature: "", //特殊性质（家长、讲座等）
        resume: "", //简历
        resume1: "", //简历
        note: "" //咨询进度
      };
    },
    //followUp弹框关闭
    followUpClose() {
      this.followUpVisible = false;
    },
    //followUp弹框更新回调
    followUpUpdata() {
      this.getFollowUpMenteeIdListByUserId();
    },
    //follow弹框关闭
    followClose() {
      this.followVisible = false;
    },
    //follow弹框更新回调
    followUpdata() {
      this.Topage(1);
    },
    closeDetail () {
      this.followVisible = false
    },
    followUp() {
      this.followUpVisible = true;
    },
    //加礼物
    addGift() {
      this.signingForm.gifts.push({ giftId: null, giftNum: 1 });
    },
    //删礼物
    deleteGift(i) {
      console.log(i);
      this.signingForm.gifts.splice(i, 1);
    }
  }
};
</script>

<style lang='scss'>

.pdf-box {
  position: relative;
  width: 100%;
  height: 80vh;
  margin: 0px auto;
}
</style>
<style scoped>
.list {
  margin: 20px auto;
  width: 1000px;
}
.item2 {
  text-align: left;
  width: 800px;
  margin-bottom: 10px;
  text-indent: -3em;
  color: #000;
}
.h1 {
  margin-left: 10px;
  font-size: 24px;
  font-weight: 700;
}
.h2 {
  margin-left: 20px;
}
.h22 {
  margin-left: 20px;
  background-color: #0f0;
}
.h44 {
  margin-left: 60px;
  background-color: #0f0;
}
.h3 {
  margin-left: 40px;
}
.h4 {
  margin-left: 60px;
}
.op {
  opacity: 0;
}
.url-box {
  white-space: wrap;
  width: 300px;
  overflow: hidden;
  height: 50px;
  text-overflow: ellipsis;
}
.copy {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px #409eff solid;
  color: #409eff;
  border-radius: 5px;
  display: inline-block;
  margin-right: 20px;
}
.copy:hover {
  background-color: #409eff;
  color: #fff;
}
.programName {
  padding: 0px 10px;
  border: 1px #dcdfe6 solid;
  border-radius: 5px;
  min-width: 170px;
  height: 26px;
  display: inline-block;
}
.internshipProgramName {
  padding: 0px 10px;
  border: 1px #dcdfe6 solid;
  border-radius: 5px;
  min-width: 70px;
  height: 26px;
  display: inline-block;
}
</style>

