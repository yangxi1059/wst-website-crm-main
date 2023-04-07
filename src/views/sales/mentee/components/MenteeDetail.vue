<!--
 * @Author: kaan
 * @Date: 2022-01-07 09:23:43
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-06 14:59:18
 * @Version: 
 * @Description: 
-->
<template>
  <el-dialog 
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="menteeDetailVisible"
    width="800px"
    append-to-body
    :before-close="handleClose"
  >
    <el-form
      :inline="true"
      size="mini"
      :model="menteeDetail"
      :rules="rules2"
      ref="ruleForm"
      label-width="160px"
    >
      <div v-if="menteeEditType == 0">
        <el-form-item label="意向:" label-width="190px" class="intention_label" prop="intention">
          <el-checkbox-group v-model="menteeDetail.intention">
            <el-checkbox
              v-for="item in mentee_intention"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
          <div class="mentee_detail_item" shadow="never">
            <el-tag size="medium"  class="mentee_detail_item_tag">学生信息</el-tag>
            <el-form-item label="微信名"  prop="wxName">
              <el-input :style="{width:widths}" sbind v-model="menteeDetail.wxName" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="微信ID"  prop="wxId">
              <el-input :style="{width:widths}" v-model="menteeDetail.wxId" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="性别"  prop="sex">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.sex"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sex"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份"  prop="menteeType">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.menteeType"
                clearable
                filterable
                placeholder="请选择身份"
              >
                <el-option
                  v-for="item in mentee_type"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话" prop="telephone">
              <el-input :style="{width:widths}" v-model="menteeDetail.telephone" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="学校（高中）" prop="highSchool">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.highSchool"
                clearable
                filterable
                placeholder="请选择学校"
              >
                <el-option
                  v-for="item in highSchool"
                  :key="item.schoolId"
                  :label="item.allName"
                  :value="item.schoolId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学校（大学）" prop="school">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.school"
                clearable
                filterable
                placeholder="请选择学校"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.schoolId"
                  :label="item.allName"
                  :value="item.schoolId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学校（研究生）" prop="graduateSchool">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.graduateSchool"
                clearable
                filterable
                placeholder="请选择学校"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.schoolId"
                  :label="item.allName"
                  :value="item.schoolId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input :style="{width:widths}" v-model="menteeDetail.email" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="学历" prop="degree">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.degree"
                clearable
                filterable
                placeholder="请选择学历"
              >
                <el-option
                  v-for="item in degree"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="毕业年份" prop="finishYear">
              <el-date-picker
                :style="{width:widths}"
                v-model="menteeDetail.finishYear"
                :clearable="false"
                :editable="false"
                type="year"
                value-format="yyyy"
                default-value="2020"
                placeholder="选择年份"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="专业" prop="major">
              <el-select
                multiple
                :style="{width:widths}"
                v-model="majorNew"
                clearable
                filterable
                placeholder="请选择专业"
                :multiple-limit="3"
              >
                <el-option
                  v-for="item in major"
                  :key="item.majorId"
                  :label="item.allName"
                  :value="item.majorId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业（研究生）" prop="graduateMajor">
              <el-select
                multiple
                :style="{width:widths}"
                v-model="menteeDetail.graduateMajor"
                clearable
                filterable
                placeholder="请选择专业"
              >
                <el-option
                  v-for="item in major"
                  :key="item.majorId"
                  :label="item.allName"
                  :value="item.majorId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家/地区" prop="country">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.country"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in country"
                  :key="item.itemId"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咨询方向" prop="consultingDirection">
              <el-select :style="{width:widths}" v-model="menteeDetail.consultingDirection" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in consulting_direction"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咨询进度" class="note" prop="note">
              <el-input
                style="width:570px"
                resize="none"
                :rows="3"
                type="textarea"
                v-model="menteeDetail.note"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="askFor">
              <el-input :style="{width:'570px'}" v-model="menteeDetail.askFor" :maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="当前在职公司" prop="workCompany" v-if="menteeDetail.intention && menteeDetail.intention.includes('EC')">
              <el-input :style="{width:widths}" v-model="menteeDetail.workCompany" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="简历上传" prop="resumeArr" v-if="menteeDetail.intention && menteeDetail.intention.includes('EC')">
              <div v-for="(item,i) in menteeDetail.resumeArr" class="mb10" :key="i">
                <div style="display:flex" v-if="item.fileName">
                  <div class="mr10" style="width:165px;max-width:190px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" >{{item.fileName}}</div>
                  <el-button type="danger" size="mini"  @click="delResume(item.pkId)">删除</el-button>
                </div>
              </div>
              <el-upload
                :style="{width:widths}"
                action
                :http-request="uploadFileAxios"
                class="upload-btn"
                ref="elupload"
                :file-list="fileList"
              >
                <el-button
                  class="el-icon-upload"
                  slot="trigger"
                  size="mini"
                  type="success"
                  plain
                >选取文件</el-button>
              </el-upload>
            </el-form-item>
          </div>
          <div class="mentee_detail_item" shadow="never">
            <el-tag size="medium"  class="mentee_detail_item_tag" type="success">家长一信息</el-tag>
            <el-form-item label="微信名" prop="parentWxName1">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWxName1" ></el-input>
            </el-form-item>
            <el-form-item label="微信ID" prop="parentWx1">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWx1" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="parentSex1">
              <el-select :style="{width:widths}" v-model="menteeDetail.parentSex1" filterable placeholder="请选择">
                <el-option
                  v-for="item in sex"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="parentRemark1">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentRemark1" ></el-input>
            </el-form-item>
          </div>
          <div class="mentee_detail_item" shadow="never">
            <el-tag size="medium"  class="mentee_detail_item_tag" type="success">家长二信息</el-tag>
            <el-form-item label="微信名" prop="parentWxName2">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWxName2" ></el-input>
            </el-form-item>
            <el-form-item label="微信ID" prop="parentWx2">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentWx2" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="parentSex2">
              <el-select :style="{width:widths}" v-model="menteeDetail.parentSex2" filterable placeholder="请选择">
                <el-option
                  v-for="item in sex"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="parentRemark2">
              <el-input :style="{width:widths}" v-model="menteeDetail.parentRemark2" ></el-input>
            </el-form-item>
          </div>
          <div class="mb10 mentee_detail_item" shadow="never"
            v-if="menteeDetail.intention && menteeDetail.intention.includes('IV')"
          >
          <el-tag size="medium"  class="mentee_detail_item_tag" type="info">升学信息</el-tag>
          <el-form-item label="目标大学" prop="schoolTarget">
            <el-select
              :style="{width:widths}"
              v-model="menteeDetail.schoolTarget"
              clearable
              filterable
              multiple
              :multiple-limit="5"
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in schoolList"
                :key="item.schoolId"
                :label="item.allName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标专业" prop="majorTarget">
            <el-select
              :style="{width:widths}"
              v-model="menteeDetail.majorTarget"
              multiple
              :multiple-limit="5"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in major"
                :key="item.majorId"
                :label="item.allName"
                :value="item.majorId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标地区" prop="regionTarget">
            <el-select
              :style="{width:widths}"
              v-model="menteeDetail.regionTarget"
              multiple
              :multiple-limit="5"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in country"
                :key="item.itemId"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成绩" prop>
            <div class="hot-button" :style="{width:'500px'}" @click="addExamination">添加新成绩</div>
          </el-form-item>
          <div v-for="(item,i) in menteeDetail.examination" :key="i">
            <el-form-item label="类型" prop>
              <el-select
                :style="{width:widths}"
                v-model="item.examination"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in iv_examination"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分数" prop>
              <el-input-number v-model="item.score" :min="0" :controls="false"></el-input-number>
              <span class="hot-button el-icon-delete ml20" @click="delExamination(i)">删除</span>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 渠道 -->
      <div v-if="menteeEditType == 1">
        <el-form-item label="合作商活动" v-if=" channelId == 'channel-cooperator' && menteeDetail.sourceFrom"  prop="channelId">
          <el-select :style="{width:widths}"  v-model="menteeDetail.activityId"  placeholder="请选择活动">
            <el-option
              v-for="item in activityList"
              :key="item.activityId"
              :label="item.activityName"
              :value="item.activityId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="特殊性质(家长/讲座等)" prop="specialNature">
          <el-input :style="{width:widths}" v-model="menteeDetail.specialNature" :maxlength="199"></el-input>
        </el-form-item>
        <el-form-item label="是否VIP同事推荐" prop="vipRecommendStatus">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.vipRecommendStatus"
            placeholder="是否VIP同事推荐"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VIP同事推荐人" prop="vipRecommender" v-if="menteeDetail.vipRecommendStatus == 1">
          <el-select
            :style="{width:widths}"
            v-model="menteeDetail.vipRecommender"
            placeholder="VIP同事推荐人"
          >
            <el-option
              v-for="item in vipSelect"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帮聊" prop="helpChat">
              <el-select
                :style="{width:widths}"
                v-model="menteeDetail.helpChat"
                placeholder="请选择帮聊"
              >
                <el-option
                  v-for="item in helpChatList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="购买力" prop="purchasingPowerScore">
          <el-rate v-model="menteeDetail.purchasingPowerScore" :max="10" style="line-height:2"></el-rate>
        </el-form-item>
        <el-form-item label="求职项目意向度" prop="careerIntentionScore">
          <el-rate v-model="menteeDetail.careerIntentionScore" :max="10" style="line-height:2"></el-rate>
        </el-form-item>
        <el-form-item label="求职内容感兴趣度" prop="careerAttractionScore">
          <el-rate v-model="menteeDetail.careerAttractionScore" :max="10" style="line-height:2"></el-rate>
        </el-form-item>
        <el-form-item label="用户背景与产品契合度" prop="wstIntegratingScore">
          <el-rate v-model="menteeDetail.wstIntegratingScore" :max="10" style="line-height:2"></el-rate>
        </el-form-item>
        <el-form-item label="学生渠道评分" prop="sourceFromScore">
          <el-rate v-model="menteeDetail.sourceFromScore" :max="10" style="line-height:2"></el-rate>
        </el-form-item>
        <el-form-item label="学生渠道评价" prop="sourceFromNote">
          <el-input
            style="width:570px"
            resize="none"
            maxlength="200"
            show-word-limit
            :rows="3"
            type="textarea"
            v-model="menteeDetail.sourceFromNote"
          ></el-input>
        </el-form-item>
      </div>

    </el-form>
    <span slot="footer" class="dialog-footer" >
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="validSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/assistant.js'
import apiUser from '@/api/user'
import mixins from '@/plugin/mixins'
import util from '@/libs/util'
import AppCropper from '@/components/Cropper.vue'
export default {
  name: 'MenteeInput',
  components: { AppCropper },
  mixins: [
    mixins
  ],
  props:{
    menteeDetailVisible: {
      type: Boolean,
      default: false
    },
    menteeEditType:{},
    menteeData:{},
  },
  data() {
    return {
      widths: "200px",
      title:"学员信息编辑",
      menteeDetail:{},
      schoolList:[],
      mentee_intention:[],
      sex:[],
      mentee_type:[],
      highSchool:[],
      degree:[],
      major:[],
      country:[],
      iv_examination:[],
      helpChatList: [
        { itemName: '无', itemValue: 'no' },
        { itemName: 'jerry', itemValue: 'jerry' },
        { itemName: 'bruce', itemValue: 'bruce' }
      ],
      majorNew:[],
      rules2:{
        menteeType: [
          { required: true, message: "请选择身份", trigger: "blur" }
        ],
        vipRecommendStatus:[
           { required: true, message: "必填", trigger: "blur" },
        ],
        vipRecommender:[
           { required: true, message: "必填", trigger: "blur" },
        ],
        signStatus: [{ required: true, message: "必填", trigger: "blur" }],
        firstAskDate: [{ required: true, message: "必填", trigger: "blur" }],
        sourceFrom: [{ required: true, message: "必填", trigger: "blur" }],
        sourceWx: [{ required: true, message: "必填", trigger: "blur" }],
        counselorStatus: [{ required: true, message: "必填", trigger: "blur" }],
        counselorGroup: [{ required: true, message: "必填", trigger: "blur" }],
        counselorWx: [{ required: true, message: "必填", trigger: "blur" }],
        counselorWxNew: [{ required: true, message: "必填", trigger: "blur" }],
        workCompany: [{ required: true, message: "必填", trigger: "blur" }],
        email: [
          {type: "email",message: "请输入正确的邮箱地址",trigger: "blur"},
        ],
        wxName: [{ max: 60, message: "长度为60个字符以内", trigger: "blur" }],
        askFor: [{ max: 60, message: "长度为60个字符以内", trigger: "blur" }],
        consultingDirection: [{ required: true, message: "必填", trigger: "blur" }],
        specialNature: [
          { max: 60, message: "长度为60个字符以内", trigger: "blur" }
        ]
      },

      // 渠道
      loading:false,
      channelId:"",
      source_wx:[],
      consulting_direction:[],
      channelList:[],
      channel_sourceList:[],
      sourceList:[],
      activityList:[],
      common_yes_or_no:[],
      vipSelect:[],
      visible:false,
      searchCodeType:true,

    }
  },
  watch: {
    menteeDetailVisible: function (val) {
      if (val) {
        this.menteeDetail = JSON.parse(JSON.stringify(this.menteeData))
        if(this.menteeEditType == 0 ){this.title = "学员基本信息编辑"}
        if(this.menteeEditType == 1 ){
          this.title = "学员渠道来源编辑"
          this.channelId = this.menteeDetail.channelId;
          this.menteeDetail.sourceFrom = this.menteeDetail.sourceName;
          this.$set(this.menteeDetail,'activityId',this.menteeDetail.cooperatorActivityInfo?this.menteeDetail.cooperatorActivityInfo.activityId:'')
          this.$nextTick(()=> {
            this.menteeDetail.sourceFrom = this.menteeDetail.sourceId
          })
          if(this.menteeDetail.graduateMajor){
            this.menteeDetail.graduateMajor = this.menteeDetail.graduateMajor.split(',')
          }
        }
      }
    },
  },
  mounted() {
    this.pageInit()
  },
  methods:{
    async pageInit(){
      this.schoolList = await this.getSchool("school")
      this.highSchool = await this.getSchool("highSchool")
      this.mentee_intention = await this.getDictionary("mentee_intention")
      this.sex = await this.getDictionary("sex")
      this.mentee_type = await this.getDictionary("mentee_type")
      this.degree = await this.getDictionary("degree")
      this.major = await this.getMajor()
      this.country = await this.getDictionary("country")
      this.iv_examination = await this.getDictionary("iv_examination")
      api.getCounselor("wst_sales").then(res => {
        console.log(res);
        this.counselor = res.data;
      });
      // 渠道
      apiUser.userList({
        pageNum: 1,
        pageSize: 10000,
        entryStatus: '1',
        sortCol: 'userName',
        sort: 'ASC',
        positionType: 'strategist,services'
      }).then((res) => {
        console.log(res, 'vip推荐人列表yx*********')
        this.vipSelect = res.data.rows
      })
      api.getOfficialAccountList().then(res => {
        console.log("导流微信号", res);
        this.source_wx = res.data.rows;
      }).catch(err => {
        console.log(err);
        alert(err.message + "，请刷新网页");
      });
      this.consulting_direction = await this.getDictionary("track")
      this.common_yes_or_no = await this.getDictionary("common_yes_or_no")
      api.getChannelSource().then(res => {
        console.log("getChannelSource", res.data);
        this.channelList = res.data.channelList;
        this.channel_sourceList = res.data.sourceList;
      });

      // 激活
      this.counselorgroup = await this.getCounselorgroup()
    },
    delResume(pkId){
      this.menteeDetail.resumeArr.map(item => {
        if(item.pkId == pkId){
          item.delFlag = 1;
          item.fileName = '';
        }
      })
    },
    addExamination() {
      console.log("添加成绩");
      this.menteeDetail.examination.push({});
    },
    delExamination(i) {
      console.log("删除成绩", i, JSON.stringify(this.menteeDetail.examination));
      this.menteeDetail.examination.splice(i, 1);
    },
    validSubmit(){
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.submit()
      })
    },
    submit(){
      this.menteeDetail = JSON.parse(JSON.stringify(this.menteeDetail))
        console.log(this.menteeDetail)
        if(this.menteeDetail.intention.includes('EC')){
          if(this.menteeDetail.resumeArr.length < 1){
            this.$message.error('当为创业营类型时简历为必填项 ~~')
            return false;
          }
        }
        if(!(this.menteeDetail.wxId || this.menteeDetail.parentWx1 || this.menteeDetail.parentWx2 )){
          this.$message.error('学生或者家长至少输入一个微信ID ~~')
          return false
        }
        if (!this.menteeDetail.intention.length) {
          this.$message({
            message: "意向至少选一个",
            type: "error"
          });
          return;
        }
        let canot = false;
        let examinationArr = [];
        this.menteeDetail.examination.forEach(v => {
          examinationArr.push(v.examination);
          if (!v.score || !v.examination) canot = true;
        });

        if (canot) {
          this.$message({
            message: "成绩及对应分数都必填",
            type: "error"
          });
          return;
        }
        if (new Set(examinationArr).size < examinationArr.length) {
          this.$message({
            message: "成绩类型不可重复",
            type: "error"
          });
          return;
        }
        this.menteeDetail.major = this.majorNew;
        if(this.menteeDetail.counselorStatus == 1){
          if(!this.menteeDetail.country){
            this.$message({
              message: "学员已分配顾问时，国家/地区为必填项",
              type: "error"
            });
            return false;
          }
        }
        let data2 = JSON.parse(JSON.stringify(this.menteeDetail));
        data2.major = data2.major.join(",");
        data2.graduateMajor = data2.graduateMajor ? data2.graduateMajor.join(","):"";
        this.$loading({ background: "rgba(0,0,0,.5)" });
        console.log("data2",data2)
        api.mentee_info2(data2).then(({ data }) => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.majorNew = [];
          this.$loading().close();
          this.$emit("success");
          this.handleClose();
      });
    },
    handleClose(){
      this.clear()
      this.$emit("close")
    },
    clear(){
      this.menteeDetail = {
        major: [],
        examination: [],
        schoolTarget: [],
        majorTarget: [],
        regionTarget: [],
        highSchool: null,
        intention: []
      };
      this.activateUrl = ""
      this.$refs.ruleForm.resetFields();
    }
  },
}

</script>

<style lang="scss" scoped>
.mentee_info_card{
  position: relative;
  padding-top:20px;
  .mentee_info_card_tag{
    position: absolute;
    top: 0px;
    left: 0;
  }
}
.mentee_info_card_detail{
  position: absolute;
  top: 0;
  right:0;
  z-index:1000;
}
.intention_label ::v-deep .el-form-item__label{
  font-weight:1000;
  padding-right:20px;
}
.mentee_detail_item{
  position: relative;
  padding-top:30px;
  margin-bottom:20px;
  border: 1px solid #eee;
  .mentee_detail_item_tag{
    position: absolute;
    top:0;
    left:0;
  }
}
.activate_pic{
  position: relative;
  width:120px;
  height:120px;
  display: inline-block;
  .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: opacity .3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
}
.activate_btn{
  position: absolute;
  top:0;
  right:-80px;
}
.popover_hover{
  font-size:20px;
  cursor: pointer;
}
</style>
