<!--
 * @Author: 库建华
 * @Date: 2019-07-24 15:11:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-07 11:29:18
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-drawer
      :visible.sync="drawerVisble"
      direction="rtl"
      :before-close="handleClose"
      size="400px">
      <div class="course_detail_container vipMentee" v-loading="loading">
        <div class="mentor_area" v-if="programType == 'basic'" style="margin-right:20px">
          <el-button  @click="addOffer(1)" style="margin-bottom:10px" type="primary" size="mini">新增求职Offer</el-button>
          <div v-for="(item,i) in offerList" :key="i" style="margin-bottom:10px" >
            <div class="block_name"   >
              <div >
                <div class="mentee_name" >
                  <div class="label">公司:</div>
                  <div class="value" >{{item.companyName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">部门:</div>
                  <div class="value" >{{item.divisionName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">城市:</div>
                  <div class="value" >{{item.cityName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">实习/全职:</div>
                  <div class="value" >{{item.resultApplyName}}</div>
                </div>
                <div class="mentee_name" v-if="item.resultApply == '0&&实习'">
                  <div class="label">实习类型:</div>
                  <div class="value" >{{item.internshipTypeName}}</div>
                </div>
                <div class="mentee_name" v-if="item.resultApply == '1&&全职'">
                  <div class="label">全职类型:</div>
                  <div class="value" >{{item.fullTimeTypeName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">offer年薪/万(￥):</div>
                  <div class="value" >{{item.offerSalary}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">薪资Base:</div>
                  <div class="value" >{{item.offerBase}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">薪资Bonus:</div>
                  <div class="value" >{{item.offerBonus}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">项目周期:</div>
                  <div class="value" >{{item.programPeriod}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">准备周期（月）:</div>
                  <div class="value" >{{item.prepareMonth}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">获得offer日期:</div>
                  <div class="value" >{{item.offerReceiveDate}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">屏蔽学生学校:</div>
                  <div class="value" >{{shield2[item.shield]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">可宣传:</div>
                  <div class="value" >{{shield2[item.publicStatus]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">申请季:</div>
                  <div class="value" >{{item.applySeason}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">Offer类型:</div>
                  <div class="value" >{{item.offerFromName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">不计Offer分导师:</div>
                  <div class="value" >{{item.ignoreMentorNames}}</div>
                </div>
                <div class="mentee_name" v-if="item.offerFrom == 'offer_from_internal'">
                  <div class="label">内推导师:</div>
                  <div class="value" >{{item.internalMentorName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">社团:</div>
                  <div class="value" >{{item.community}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">小故事:</div>
                  <div class="value" >{{item.story}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">备注:</div>
                  <div class="value" >{{item.remark}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">核验状态:</div>
                  <div class="value" >{{item.checkStatusName}}</div>
                </div>
                <div class="mentee_name">
                  <div class="label">凭证:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.resultVoucher)" icon="el-icon-download" v-if="item.resultVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
                <div class="mentee_name">
                  <div class="label">好评图:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.praiseVoucher)" icon="el-icon-download" v-if="item.praiseVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
                <div class="mentee_name">
                  <div class="label">学生通知截图:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.menteeNoticeVoucher)" icon="el-icon-download" v-if="item.menteeNoticeVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
              </div>
              <div style="text-align:right">
                <el-button el-button  slot="reference" type="primary" @click="applyStory(item)" v-if="!item.storyApplyId" size="mini">发起小故事申请</el-button>
              </div>
            </div>
          </div>
          <div v-for="(item,i) in offerList2" :key="i +'b'" style="margin-bottom:10px" >
            <div class="block_name" v-if="programType == 'basic'"  >
              <div style="text-align:right">
                <el-tag type="danger"  size="medium " style="margin-bottom:10px;cursor:pointer;"   @click="applyToDetail(item.applyId)" disable-transitions >审核中</el-tag>
              </div>
              <div >
                <div class="mentee_name" >
                  <div class="label">公司:</div>
                  <div class="value" >{{item.companyName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">部门:</div>
                  <div class="value" >{{item.divisionName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">城市:</div>
                  <div class="value" >{{item.cityName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">实习/全职:</div>
                  <div class="value" >{{item.resultApplyName}}</div>
                </div>
                <div class="mentee_name" v-if="item.resultApply == '0&&实习'">
                  <div class="label">实习类型:</div>
                  <div class="value" >{{item.internshipTypeName}}</div>
                </div>
                <div class="mentee_name" v-if="item.resultApply == '1&&全职'">
                  <div class="label">全职类型:</div>
                  <div class="value" >{{item.fullTimeTypeName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">offer年薪/万(￥):</div>
                  <div class="value" >{{item.offerSalary}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">薪资Base:</div>
                  <div class="value" >{{item.offerBase}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">薪资Bonus:</div>
                  <div class="value" >{{item.offerBonus}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">项目周期:</div>
                  <div class="value" >{{item.programPeriod}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">准备周期（月）:</div>
                  <div class="value" >{{item.prepareMonth}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">获得offer日期:</div>
                  <div class="value" >{{item.offerReceiveDate}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">屏蔽学生学校:</div>
                  <div class="value" >{{shield2[item.shield]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">可宣传:</div>
                  <div class="value" >{{shield2[item.publicStatus]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">申请季:</div>
                  <div class="value" >{{item.applySeason}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">Offer类型:</div>
                  <div class="value" >{{item.offerFromName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">不计Offer分导师:</div>
                  <div class="value" >{{item.ignoreMentorNames}}</div>
                </div>
                <div class="mentee_name" v-if="item.offerFrom == 'offer_from_internal'">
                  <div class="label">内推导师:</div>
                  <div class="value" >{{item.internalMentorName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">社团:</div>
                  <div class="value" >{{item.community}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">小故事:</div>
                  <div class="value" >{{item.story}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">备注:</div>
                  <div class="value" >{{item.remark}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">核验状态:</div>
                  <div class="value" >{{item.checkStatusName}}</div>
                </div>
                <div class="mentee_name">
                  <div class="label">凭证:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.resultVoucher)" icon="el-icon-download" v-if="item.resultVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
                <div class="mentee_name">
                  <div class="label">好评图:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.praiseVoucher)" icon="el-icon-download" v-if="item.praiseVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
                <div class="mentee_name">
                  <div class="label">学生通知截图:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.menteeNoticeVoucher)" icon="el-icon-download" v-if="item.menteeNoticeVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mentor_area" v-if="programType != 'basic'" style="margin-right:20px">
          <el-button  @click="addOffer(2)" style="margin-bottom:10px" type="primary" size="mini">新增升学Offer</el-button>
          <div v-for="(item,i) in offerList" :key="i" style="margin-bottom:10px">
            <div class="block_name"    >
              <div >
                <div class="mentee_name" >
                  <div class="label">类别:</div>
                  <div class="value" >{{item.entranceTypeName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">专业项目:</div>
                  <div class="value" >{{item.entranceOfferProgramName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">offer学校:</div>
                  <div class="value" >{{item.schoolName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">学院:</div>
                  <div class="value" >{{item.instituteName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">准备周期（月）:</div>
                  <div class="value" >{{item.prepareMonth}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">屏蔽学生学校:</div>
                  <div class="value" >{{shield2[item.shield]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">可宣传:</div>
                  <div class="value" >{{shield2[item.publicStatus]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">申请季:</div>
                  <div class="value" >{{item.applySeason}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">小故事:</div>
                  <div class="value" >{{item.story}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">备注:</div>
                  <div class="value" >{{item.remark}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">核验状态:</div>
                  <div class="value" >{{item.checkStatusName}}</div>
                </div>
                <div class="mentee_name">
                  <div class="label">凭证:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.offerVoucher)" icon="el-icon-download" v-if="item.offerVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
                <div class="mentee_name">
                  <div class="label">好评图:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.praiseVoucher)" icon="el-icon-download" v-if="item.praiseVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
              </div>
              <div style="text-align:right">
                <el-button el-button  slot="reference" type="primary" @click="applyStory(item)" v-if="!item.storyApplyId" size="mini">发起小故事申请</el-button>
              </div>
            </div>
          </div>
          <div v-for="(item,i) in offerList2" :key="i + 'a'" style="margin-bottom:10px" >
            <div class="block_name" >
              <div style="text-align:right">
                  <el-tag type="danger"  size="medium " style="margin-bottom:10px;cursor:pointer;"   @click="applyToDetail(item.applyId)" disable-transitions >审核中</el-tag>
              </div>
              <div >
                <div class="mentee_name" >
                  <div class="label">类别:</div>
                  <div class="value" >{{item.entranceTypeName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">专业项目:</div>
                  <div class="value" >{{item.entranceOfferProgramName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">offer学校:</div>
                  <div class="value" >{{item.schoolName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">学院:</div>
                  <div class="value" >{{item.instituteName}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">准备周期（月）:</div>
                  <div class="value" >{{item.prepareMonth}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">屏蔽学生学校:</div>
                  <div class="value" >{{shield2[item.shield]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">可宣传:</div>
                  <div class="value" >{{shield2[item.publicStatus]}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">申请季:</div>
                  <div class="value" >{{item.applySeason}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">小故事:</div>
                  <div class="value" >{{item.story}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">备注:</div>
                  <div class="value" >{{item.remark}}</div>
                </div>
                <div class="mentee_name" >
                  <div class="label">核验状态:</div>
                  <div class="value" >{{item.checkStatusName}}</div>
                </div>
                <div class="mentee_name">
                  <div class="label">凭证:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.offerVoucher)" icon="el-icon-download" v-if="item.offerVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
                <div class="mentee_name">
                  <div class="label">好评图:</div>
                  <div class="value">
                    <el-button type="text" @click="download(item.praiseVoucher)" icon="el-icon-download" v-if="item.praiseVoucher">预览</el-button>
                    <div v-else>无</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </el-drawer>
    <addOfferDialog @close="closeAddOffer" @submit="submitAddOffer" :menteeInfo="menteeInfo" :addOfferVisible="addOfferVisible" :signId="signId" :community="community" :menteeId="menteeId" :menteeName="menteeName" :programPeriod="programPeriod"
    :schoolName="schoolName" :programType="programType" :hignSchoolName="hignSchoolName"  />
    <applyMenteeOffer :applyInterviewStoryVisible="applyInterviewStoryVisible" :menteeInfo="menteeInfo" :menteeName="menteeName" :interviewData="interviewData" @close="offerClose()" @submit="offerSubmit()" />
    <applyDetail :applyData="applyData" :recommendDetailVisible="recommendDetailVisible" @close="applyDetailClose" />
    <applyOfferList :publicStatus="publicStatus" :applyOfferListVisible="applyOfferListVisible" :menteeInfo="menteeInfo" :addOfferVisible="addOfferVisible" :signId="signId" :community="community" :menteeId="menteeId" :menteeName="menteeName" :programPeriod="programPeriod"
    :schoolName="schoolName" :programType="programType" :hignSchoolName="hignSchoolName" @submit="applyOfferListSubmit" @close="applyOfferListClose" />
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import file from '@/libs/file'
import applyMenteeOffer from './components/apply_mentee_offer.vue'
import applyOfferList from './components/apply_offer_list.vue'
import addOfferDialog from './components/addOffer.vue'
import applyDetail from './components/detailOffer.vue'
import mixins from '@/plugin/mixins'
export default {
  components: { applyMenteeOffer, addOfferDialog, applyDetail, applyOfferList },
  mixins: [mixins],
  data: () => {
    return {
      company: [],
      division: [],
      recommendDetailVisible: false,
      applyOfferListVisible: false,
      loading: false,
      city: [],
      internship_or_full_time: [],
      resultApply2: ['实习', '全职'],
      shield2: ['否', '是'],
      shield: [],
      apply_season: [],
      communityNew: '',
      entrance_type: [],
      applyData: {},
      entrance_offer_program: [],
      mentorSearchList: [],
      full_time_type: [],
      internship_type: [],
      addOfferVisible: false,
      applyStatusS: JSON.parse(sessionStorage.getItem('apply_status')),
      optionsMentor: [],
      institute: [],
      applyInterviewStoryVisible: false,
      resultConfirm: ['未确认', '已确认', '审核未通过'],
      interviewData: {},
      fileList1: [],
      fileList2: [],
      fileResume1: null,
      fileResume2: null,
      offer_from: [],
      pkId: 0,
      offerList: [],
      offerList2: [],
      auditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ],
      eduAuditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ]
    }
  },
  props: {
    publicStatus:{},
    drawerVisble: {},
    signId: {},
    community: {},
    menteeId: {},
    menteeName: {},
    programPeriod: {},
    programType: {},
    schoolName: {},
    hignSchoolName: {},
    menteeInfo: {}
  },
  watch: {
    drawerVisble: function (val, old) {
      if (val) {
        if (!this.company.length) {
          this.pageInit()
        }
        this.Topage()
      }
    }
  },
  mounted () {
    console.log(this.$route, 222222222222222)
  },
  methods: {
    async pageInit () {
      api.getCompanyList().then(res => {
        console.log('company', res)
        this.company = res.data
      })
      this.city = await this.getDictionary('city')
      this.apply_season = await this.getDictionary('apply_season')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.shield = await this.getDictionary('common_yes_or_no')
      this.entrance_type = await this.getDictionary('entrance_type')
      this.entrance_offer_program = await this.getDictionary('entrance_offer_program')
      this.offer_from = await this.getDictionary('offer_from')
      this.full_time_type = await this.getDictionary('full_time_type')
      this.internship_type = await this.getDictionary('internship_type')
      apiDic.getParentAndChildrenDic({ parentDic: 'basic_division', dicLabel: 'division' }).then(res => {
        console.log('获取父子字典：', res.data)
        this.division = res.data.map(item => {
          item.children.forEach(v => {
            v.value = v.value + '&&' + v.label
          })
          return item
        })
      })
      apiDic.getAuditorListByApplyType('offer_apply').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
      api.getMentorListBySignIdset(this.signId).then(res => {
        this.optionsMentor = res.data
      })
    },
    Topage () {
      this.loading = true
      api.getVipInterviewList(this.signId).then(res => {
        console.log(res)
        this.offerList = []
        this.offerList2 = []
        res.data.forEach(item => {
          if (item.pkId) {
            this.offerList.push(item)
          } else {
            this.offerList2.push(item)
          }
        })
        console.log(this.offerList, this.offerList2)
        this.loading = false
      })
    },
    close () {
      this.$emit('close')
      this.offerList = []
      this.offerList2 = []
    },
    download (val) {
      file.preview(val)
    },
    applyStory (item) {
      this.applyInterviewStoryVisible = true
      this.interviewData = item
      if (this.programType == 'basic') {
        this.interviewData.offerType = 'offer'
      } else {
        this.interviewData.offerType = 'entrance_offer'
      }
    },
    offerClose () {
      this.applyInterviewStoryVisible = false
    },
    offerSubmit () {
      this.applyInterviewStoryVisible = false
      this.Topage()
    },
    addOffer (num) {
      if (num == 1) {
        console.log('求职offer')
        this.applyOfferListVisible = true
      } else {
        console.log('升学offer')
        this.addOfferVisible = true
      }
    },
    applyOfferListClose () {
      this.applyOfferListVisible = false
    },
    applyOfferListSubmit () {
      this.applyOfferListVisible = false
      this.Topage()
    },
    closeAddOffer () {
      this.addOfferVisible = false
    },
    submitAddOffer () {
      this.addOfferVisible = false
      this.Topage()
    },
    handleClose () {
      this.$emit('close')
    },
    applyToDetail (applyId) {
      console.log(applyId)
      this.applyData = {
        applyId: applyId
      }
      this.recommendDetailVisible = true
    },
    applyDetailClose () {
      this.recommendDetailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

$background-color:#F4F4F4;
*{
  box-sizing: border-box;
}
.label{
  margin-right: 10px;
  min-width: 120px;
}
.value{
  // color: #FF8C00;
  text-align: right;
  max-width: 198px;
  min-width: 80px;
  // flex: 1;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.course_detail_container{
  background-color:#F4F4F4;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.vipMentee{
  .toProgramDetail{
    position: absolute;
    right: 0;
    top: 0;
  }
  .wait_title{
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 10px;
    color: rgb(255, 140, 0);
  }
	.add-offer-btn.set-target_yx {
		margin: 15px;
		left: 150px;
		position: absolute;
		top: 0px;
	}
	.set-target_yx .el-form-item__label{
			font-weight: 600;
			color: #222;
	}
	.el-form--inline .el-form-item{
		display: block !important;
	}
	.mentor_area{
		flex: 1;
		height:100%;
    overflow-y: auto;
		padding:10px;
		background: #FFF;
		border-radius: 10px;
		.top_status_bar{
			display: flex;
			align-items: center;
		}
		.mentor_list{
			margin-right:-10px;
			// padding-left:20px;
			.mentor_item{
				width:100%;
				height:auto;
				margin-top:15px;
				border-radius: 5px 0 0 5px;
				box-shadow: -5px 0px 5px #c5c5c5;
				overflow: hidden;
				.mentor_item_content{
					height:40px;
					padding:10px;
					align-items: center;
					display: flex;
					.mentor_item_content_title{
						width:100px;
					}
					.mentor_item_content_progress{
						flex:1;
					}
				}
				.mentor_item_model_content{
					padding:0 10px;
					display: flex;
					justify-content: space-between;
					.mentor_item_model{
						margin-bottom:20px;
						padding:10px 20px;
						width:120px;
						height:80px;
						background: $background-color;
						border-radius: 10px;
						box-sizing: border-box;
						.mentor_item_model_title{
							font-size:12px;
							margin-bottom:10px;
							color:#888
						}
						.mentor_item_model_value{
							height:24px;
							line-height:24px;
							padding-left:10px;
							font-size:20px;
							border-left: 4px solid #FF8C00
						}
						.can_click{
							cursor: pointer;
							text-decoration:underline
						}
					}
				}
				.mentor_item_title{
					padding:0 10px;
					width:100%;
					height:60px;
					background-color:#ff8c007a;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.mentor_item_title_name{
						font-size: 20px;
						margin-right:10px;
					}
					.mentor_item_title_icon{
						font-size:18px;
						cursor: pointer;
					}
				}
			}
		}
	}

	.course_area{
    overflow-y: auto;
		flex: 1;
		height:100%;
		margin-left:20px;
		padding:10px;
		background: #FFF;
		border-radius: 10px;
	}

	.block_name{
		position: relative;
		padding: 10px;
		border: 1px rgba(0, 0, 0, 0.1) solid;
		border-radius: 4px;
		margin-bottom: 10px;
		line-height: 24px;
	}
	.mentor_area .block_name:last-child{
		margin-bottom: 0px;
	}
	.hignLight{
		border-color: #FF8C00;
	}
}
.mentee_name{
    display: flex;
    justify-content: space-between;
  }
.demo-table-expand{
	padding-left: 20px;
	.el-form--inline .el-form-item{
		display: block;
	}
}
// 左侧学员个人信息
.user_detail_area{
  position: relative;
  overflow-y: auto;
	width: 300px;
	margin-left:20px;
  min-width: 300px;
  height:100%;
  background: #FFF;
  border-radius: 10px;
  // 头像姓名ID
  .user_detail_info{
    padding:30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .user_detail_info_pic{
      position: relative;
      .sex_icon{
        position: absolute;
        bottom:5px;
        right:0;
        width:28px;
        height:28px;
        font-size:16px;
        color:#FFF;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .sex_icon_mars{background-color: #8CC4FC;}
      .sex_icon_venus{background-color: #FFB6C1;}
    }
    .user_detail_info_name{
      font-size:20px;
      font-weight:700;
    }
  }

  // 按钮区
  .user_detail_info_btn_area{
    width:100%;
    height:50px;
    padding:10px 0;
    border-top:1px solid $background-color;
    border-bottom:1px solid $background-color;
    .user_detail_info_btn{
      float: left;
      width:15%;
      line-height:30px;
      text-align: center;
      font-weight:700;
      cursor: pointer;
      border-left:1px solid $background-color;
      border-right:1px solid $background-color;
    }
    .user_detail_info_btn:hover{
      color:#FFF;
      background: #FF8C00;
    }
  }
  // 基本信息
  .user_detail_info_basic{
    margin-top:20px;
    padding:0 20px;
  }
  // 联系方式
  .user_detail_info_contact{
    padding:0 20px;
    .user_detail_info_contact_title{
      font-size:18px;
      font-weight:800;
    }
    .user_detail_info_contact_list{
      padding-top:15px;
      .user_detail_info_contact_item{
        width:100%;
        padding-bottom:15px;
        display: flex;
        align-items: center;
        .icon_size{
          font-size:20px;
          width:40px;
          height:40px;
          border-radius: 50%;
          background-color: #f4f4f5;
          color: #909399;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .contact_item{
          margin-left:20px
        }
      }
    }
  }
}
</style>
