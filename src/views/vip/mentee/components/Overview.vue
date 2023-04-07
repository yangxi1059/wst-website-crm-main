<template>
  <div class="mentee-detail">
    <el-dialog v-loading="loading" title="项目一览" :close-on-click-modal="false" :visible.sync="overviewVisible" width="1400px" :before-close="close">
      <el-collapse v-model="activeNames">
        <template>
          <el-collapse-item
            v-if="program.programType == 'basic' && roleInfo.includes(`base_program_information`)"
            name="1"
          >
            <template slot="title">
              <div class="mentee-detail-title">（基础项目）</div>
              <el-button
                v-if="roleInfo.includes(`mentee_base_program_finish`) && program.endStatus !=='已结束'"
                type="primary"
                size="mini"
                plain
                circle
                @click.stop="finish"
              >确认完成</el-button>
              <p v-else-if="roleInfo.includes(`mentee_base_program_finish`)">已结束</p>
            </template>
            <el-card shadow="hover">
              <el-row>
                <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.orderId||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.signDate||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.contact1Name||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.contact2Name||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.programName||'无'}}</el-col>
                <el-col
                  :span="3"
                  class="mentee-detail-name"
                  v-if="roleInfo.includes(`mentee_program_price`)"
                >金额(￥)</el-col>
                <el-col
                  :span="3"
                  class="mentee-detail-value"
                  v-if="roleInfo.includes(`mentee_program_price`)"
                >{{program.programPriceCny||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.programType||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目周期</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.programPeriod||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Strategist</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.strategistName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Program Manager</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.servicesName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.endStatus||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">行业导师</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.mentorName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">目标Track</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.trackName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">目标Location</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.locationName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Graduation Year</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.finishYear||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Jerry一对一</el-col>
                <el-col :span="3" class="mentee-detail-value">{{(program.jerryHour == -1 ? '不限' : program.jerryHour) || '无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Tequila Shot（旧）</el-col>
                <el-col :span="3" class="mentee-detail-value">{{(program.tequilaShotHour == -1 ? '不限' : program.tequilaShotHour) || '无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Strategist Sessions(旧)</el-col>
                <el-col :span="3" class="mentee-detail-value">{{(program.leadStrategistHour == -1 ? '不限' : program.leadStrategistHour) || '无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Office Hour（旧）</el-col>
                <el-col :span="3" class="mentee-detail-value">{{(program.officeHour == -1 ? '不限' : program.officeHour) || '无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">Live Lessons（新）</el-col>
                <el-col :span="3" class="mentee-detail-value">{{(program.liveLesson == -1 ? '不限' : program.liveLesson) || '无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">系列课课时</el-col>
                <el-col :span="3" class="mentee-detail-value">{{(program.seriesHour == -1 ? '不限' : program.seriesHour) || '无'}}</el-col>
                <el-col :span="5" class="mentee-detail-name">1对多Office Hour</el-col>
                <el-col :span="1" class="mentee-detail-value">{{(program.officeHourStrategistSession == -1 ? '不限' : program.officeHourStrategistSession) || '无'}} 次/月</el-col>
                <el-col :span="3" class="mentee-detail-name">购买额外课时</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.hasContinual || '无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">电子书架</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.hasEbookStore || '无'}}</el-col>
                <!-- <el-col :span="3" class="mentee-detail-name">行业导师课时</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.mentorHour||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">全职导师课时</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.vipHour||'无'}}</el-col>-->
              </el-row>
            </el-card>
          </el-collapse-item>
          <el-collapse-item
            v-else-if="program.programType == 'internship' && roleInfo.includes(`internship_program_information`)"
            name="2"
          >
            <template slot="title">
              <div class="mentee-detail-title">（实习项目）</div>
              <el-button
                v-if="roleInfo.includes(`mentee_base_program_finish`) && program.endStatus !=='已结束'"
                type="primary"
                size="mini"
                plain
                circle
                @click.stop="finish"
              >确认完成</el-button>
              <p v-else-if="roleInfo.includes(`mentee_base_program_finish`)">已结束</p>
              <el-button
                type="danger"
                size="mini"
                plain
                circle
                @click.stop="endOrder"
              >自愿放弃</el-button>
            </template>
            <el-card shadow="hover">
              <el-row>
                <el-col :span="3" class="mentee-detail-name">订单ID</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.orderId||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">签约日期</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.signDate||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">主联系人</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.contact1Name||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">副联系人</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.contact2Name||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目名</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.programName||'无'}}</el-col>
                <el-col
                  :span="3"
                  class="mentee-detail-name"
                  v-if="roleInfo.includes(`mentee_program_price`)"
                >金额(￥)</el-col>
                <el-col
                  :span="3"
                  class="mentee-detail-value"
                  v-if="roleInfo.includes(`mentee_program_price`)"
                >{{program.programPriceCny||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目类型</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.programType||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">项目状态</el-col>
                <el-col :span="3" class="mentee-detail-value">{{program.endStatus||'无'}}</el-col>
              </el-row>
              <el-card shadow="none" class="mt20">
                <el-row>
                  <el-col :span="3" class="mentee-detail-name">实习单位</el-col>
                  <el-col :span="3" class="mentee-detail-value">{{program.internshipDesc||'无'}}</el-col>
                  <el-col :span="3" class="mentee-detail-name">实习地点</el-col>
                  <el-col
                    :span="3"
                    class="mentee-detail-value"
                  >{{program.internshipLocationName||'无'}}</el-col>
                  <el-col :span="3" class="mentee-detail-name">实习时长</el-col>
                  <el-col
                    :span="3"
                    class="mentee-detail-value"
                  >{{program.internshipTimeName||'无'}}</el-col>
                  <el-col :span="3" class="mentee-detail-name">实习时间</el-col>
                  <el-col
                    :span="3"
                    class="mentee-detail-value"
                  >{{(program.internshipStartDate ||'无') + '~' + (program.internshipEndDate || '无')}}</el-col>
                  <el-col :span="3" class="mentee-detail-name">实习备注</el-col>
                  <el-col :span="3" class="mentee-detail-value">{{program.internshipNote||'无'}}</el-col>
                </el-row>
              </el-card>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="program.programType == 'basic'" name="3">
            <template slot="title">
              <div class="mentee-detail-title">面试（{{interviewArray.length}}）</div>
            </template>
            <el-card shadow="hover" class="mb20" v-for="(item,i) in interviewArray" :key="i">
              <el-row>
                <el-col :span="3" class="mentee-detail-name">公司</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.companyName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">部门</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.divisionName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">地区</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.cityName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">实习/全职</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.resultApplyName}}</el-col>
                <el-col :span="3" class="mentee-detail-name">申请季(￥)</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.applySeason||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">面试时间</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.interviewDate||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">第几轮</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.times||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">面经</el-col>
                <el-popover width="400" trigger="hover" :content="item.story||'无'">
                  <el-col :span="3" slot="reference" class="mentee-detail-value">{{item.story||'无'}}</el-col>
                </el-popover>
                <el-col :span="3" class="mentee-detail-name">备注</el-col>
                <el-popover width="400" trigger="hover" :content="item.remark||'无'">
                  <el-col
                    :span="3"
                    slot="reference"
                    class="mentee-detail-value"
                  >{{item.remark||'无'}}</el-col>
                </el-popover>
                <el-col :span="3" class="mentee-detail-name">凭证</el-col>
                <el-col :span="3" class="mentee-detail-value">
                  <el-button
                    :style="{width:'40px'}"
                    type="text"
                    @click="download(item.resultVoucher)"
                    icon="el-icon-download"
                    v-if="item.resultVoucher"
                  >预览</el-button>
                  <p v-else-if="!item.resultVoucher" :style="{width:'40px'}">无</p>
                </el-col>
              </el-row>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="program.programType == 'basic'" name="4">
            <template slot="title">
              <div class="mentee-detail-title">Offer（{{offerArray.length}}）</div>
            </template>
            <el-card shadow="hover" class="mb20" v-for="(item,i) in offerArray" :key="i">
              <el-row>
                <el-col :span="3" class="mentee-detail-name">公司</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.companyName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">部门</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.divisionName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">地区</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.cityName||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">实习/全职</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.resultApplyName}}</el-col>
                <el-col :span="3" class="mentee-detail-name">是否屏蔽该学生</el-col>
                <el-col :span="3" class="mentee-detail-value">{{shield[item.shield]}}</el-col>
                <el-col :span="3" class="mentee-detail-name">申请季(￥)</el-col>
                <el-col :span="3" class="mentee-detail-value">{{item.applySeason||'无'}}</el-col>
                <el-col :span="3" class="mentee-detail-name">小故事</el-col>
                <el-popover width="400" trigger="hover" :content="item.story||'无'">
                  <el-col :span="3" slot="reference" class="mentee-detail-value">{{item.story||'无'}}</el-col>
                </el-popover>
                <el-col :span="3" class="mentee-detail-name">备注</el-col>
                <el-popover width="400" trigger="hover" :content="item.remark||'无'">
                  <el-col
                    :span="3"
                    slot="reference"
                    class="mentee-detail-value"
                  >{{item.remark||'无'}}</el-col>
                </el-popover>
                <!-- <el-col :span="3" class="mentee-detail-value">{{item.remark||'无'}}</el-col> -->
                <el-col :span="3" class="mentee-detail-name">凭证</el-col>
                <el-col :span="3" class="mentee-detail-value">
                  <el-button
                    :style="{width:'40px'}"
                    type="text"
                    @click="download(item.resultVoucher)"
                    icon="el-icon-download"
                    v-if="item.resultVoucher"
                  >预览</el-button>
                  <p v-else-if="!item.resultVoucher" :style="{width:'40px'}">无</p>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">好评图</el-col>
                <el-col :span="3" class="mentee-detail-value">
                  <el-button
                    :style="{width:'40px'}"
                    type="text"
                    @click="download(item.praiseVoucher)"
                    icon="el-icon-download"
                    v-if="item.praiseVoucher"
                  >预览</el-button>
                  <p v-else-if="!item.praiseVoucher" :style="{width:'40px'}">无</p>
                </el-col>
                <el-col :span="3" class="mentee-detail-name">状态</el-col>
                <el-col :span="3" class="mentee-detail-value">{{resultConfirm[item.resultConfirm]}}</el-col>
              </el-row>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="program.programType == 'basic'" name="5">
            <template slot="title">
              <div class="mentee-detail-title">VIP课表</div>
            </template>
            <el-card shadow="hover">
              <el-table :data="vipLessonArray" size="mini" highlight-current-row>
                <el-table-column align="center" prop="lessonTimes" label="课号" width="80"></el-table-column>
                <el-table-column align="center" prop="lessonDate" label="上课时间" width="160"></el-table-column>
                <el-table-column align="center" prop="lessonName" label="课程内容" width="360">
                  <template slot-scope="scope">
                    <el-popover width="400" trigger="hover" :content="scope.row.lessonName  ">
                      <p class="w80 w200" slot="reference">{{scope.row.lessonName}}</p>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="lessonHours" label="课时数"></el-table-column>
                <el-table-column align="center" prop="mentorName" label="上课老师"></el-table-column>
                <el-table-column align="center" prop="lessonStatus" label="课程状态">
                  <template slot-scope="scope">
                    <p>{{showStatus[scope.row.lessonStatus]}}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="feedbackRemark" label="反馈" width="100">
                  <template slot-scope="scope">
                    <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark">
                      <p class="w80" slot="reference">{{scope.row.feedbackStar}}</p>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
          <el-collapse-item v-if="program.programType == 'basic'" name="6">
            <template slot="title">
              <div
                class="mentee-detail-title"
              >行业导师课表</div>
            </template>
            <el-card shadow="hover">
            <el-card class="mb20">
              <el-table :data="hourTableData" size="mini">
                <el-table-column align="center" prop="mentorType" label="导师类型">
                  <template
                    slot-scope="scope"
                  >{{( 'strategist' == scope.row.mentorType) ? '全职导师' : '行业导师'}}</template>
                </el-table-column>
                <el-table-column align="center" prop="mentorName" label="导师名"></el-table-column>
                <el-table-column align="center" prop="signHour" label="分配课时"></el-table-column>
                <el-table-column align="center" prop="finishHour" label="完成课时"></el-table-column>
                <el-table-column align="center" prop="paidHour" label="已支付课时">
                  <template
                    slot-scope="scope"
                  >{{( 0 > scope.row.paidHour) ? '--' : scope.row.paidHour}}</template>
                </el-table-column>
                <el-table-column align="center" prop="applyHour" label="申请中课时"></el-table-column>
                <el-table-column align="center" prop="unPayHour" label="待申请课时">
                  <template
                    slot-scope="scope"
                  >{{( 0 > scope.row.unPayHour) ? '--' : scope.row.unPayHour}}</template>
                </el-table-column>
              </el-table>
            </el-card>
              <el-table :data="mentorLessonArray" size="mini" highlight-current-row>
                <el-table-column align="center" prop="lessonTimes" label="课号" width="80"></el-table-column>
                <el-table-column align="center" prop="lessonDate" label="上课时间" width="160"></el-table-column>
                <el-table-column align="center" prop="lessonName" label="课程内容" width="360">
                  <template slot-scope="scope">
                    <el-popover width="400" trigger="hover" :content="scope.row.lessonName  ">
                      <p class="w80 w200" slot="reference">{{scope.row.lessonName}}</p>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="lessonHours" label="课时数"></el-table-column>
                <el-table-column align="center" prop="mentorName" label="上课老师"></el-table-column>
                <el-table-column align="center" prop="lessonStatus" label="课程状态">
                  <template slot-scope="scope">
                    <p>{{showStatus[scope.row.lessonStatus]}}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="feedbackRemark" label="反馈" width="100">
                  <template slot-scope="scope">
                    <el-popover width="400" trigger="hover" :content="scope.row.feedbackRemark">
                      <p slot="reference">{{scope.row.feedbackStar}}</p>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun } from "@/libs/file";
import api from "@/api/vip";
import mixins from "@/plugin/mixins";
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    overviewVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      program: { programType: "basic" },
      offerArray: [],
      interviewArray: [],
      vipLessonArray: [],
      mentorLessonArray: [],
      vipLessonTotal: 3,
      mentorLessonTotal: 3,
      activeNames: ["1", "2", "3", "4", "5", "6", "7"],
      resultConfirm: ["未确认", "已确认", "审核未通过"],
      shield: ["否", "是"],
      showStatus: ["未开始", "进行中", "已完成", "已取消", "有争议"],
      hourTableData: [],
      loading: false
    };
  },
  watch: {
    overviewVisible: function(val, old) {
      if (val) {
        this.Topage();
        this.getHourListBySignId();
      }
    }
  },
  methods: {
    Topage() {
      this.loading = true
      api.getSummaryBySignId(this.signId).then(res => {
        console.log("学员购买详情yx*******", res.data);
        this.program = res.data.signInfo;
        this.interviewArray = res.data.interviewArray;
        this.offerArray = res.data.offerArray;
        this.vipLessonArray = res.data.vipLessonArray;
        this.mentorLessonArray = res.data.mentorLessonArray;
        this.vipLessonTotal = res.data.signInfo.vipPlanHour;
        this.mentorLessonTotal = res.data.signInfo.mentorPlanHour;
        this.loading = false
      });
    },
    download(val) {
      downloadFun(val, url => {
        window.open(url);
      });
    },
    close() {
      this.$emit("close");
    },
    finish() {
      console.log("finish", this.signId);
      this.$confirm("此操作将结束该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .updatedSignEdit({ signId: this.signId, endFlag: "1" })
            .then(res => {
              console.log("结束项目", res);
              this.$emit("submit");
            });
        })
        .catch(() => {});
    },
    endOrder(){
      this.$prompt('请输入放弃原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,200}$/,
          inputErrorMessage: '放弃原因字数需在1~200个字符'
        }).then(({ value }) => {
          if(value){
            let data = {
              signId:this.signId,
              internshipNote:value
            }
            this.$confirm('是否确认放弃, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              api.waiveSignEdit(data).then(res =>{
                console.log(res);
                if(res.code == 20001){
                  this.$message.error(res.message)
                }else{
                  this.$message.success('修改成功！！')
                  this.Topage();
                }
              }).catch(err=>{
                this.$message.error(err.message)
              })
            })
          }else{
            this.$message.error('放弃原因必填！！')
          }
        })
      // waiveSignEdit
    },
    getHourListBySignId() {
      api.getHourListBySignId(this.signId).then(res => {
        console.log("项目导师课时列表", res, 99999999);
        this.hourTableData = res.data.lessonInfo;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mentee-detail-title {
  width: 250px;
}
.mentee-detail-name {
  color: #000;
  font-weight: 600;
  padding-left: 20px;
}
.mentee-detail-value {
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.w200 {
  width: 340px;
}
</style>