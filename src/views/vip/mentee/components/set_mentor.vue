<template>
  <div class="program-montor_ux">
    <el-dialog
      :title="programType=='graduate_program'? `${businessTypeName[programType]}导师配置`
              :`${businessTypeName[programType]}导师配置【课时数：${mentorHours}】`"
      :visible.sync="mentorVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-form ref="mentorList" label-width="130px" size="mini">
        <el-button
          size="small"
          style="margin-bottom:10px"
          @click="addTab()"
        >新增导师
        </el-button>
        <el-tabs v-model="editableTabsValue" type="border-card"  @tab-remove="removeTab" v-if="mentorList.length>0">
          <el-tab-pane
            v-for="(item, i) in mentorList"
            :key="item.mentorId"
            :label="item.mentorName"
            :name="item.mentorId"
          >
            <!-- 升学导师 -->
            <div v-if="programType == 'graduate_program'" class="mentor_content">
              <el-form-item label="导师名：">
                <p class="mr20" :style="{width:'300px',display:'inline-block'}">{{item.mentorName}}</p>
                <div class="del" @click="delGraduateMentor(i)" v-if="!item.gpFirstDraftApplyStatus && !item.gpOfferApplyStatus && !item.gpBonusApplyStatus">
                  <i class="el-icon-delete icon-del"></i>
                </div>
              </el-form-item>
              <el-form-item label="备注：">
                <el-input type="textarea" class="mr20" :style="{width:'500px'}" v-model="item.remark" :min="0"></el-input>
              </el-form-item>
              <div style="text-align:center" class="mt10">
                <el-button type="primary" size="small" @click="saveList(i)">保 存</el-button>
              </div>
              <el-form-item label="初稿费用：">
                <el-button class="" type="primary" size="mini" plain @click="createApply(i,1)" v-if="!item.gpFirstDraftApplyStatus || item.gpFirstDraftApplyStatus == '0' || item.gpFirstDraftApplyStatus == '3' || item.gpFirstDraftApplyStatus == '6'">申请</el-button>
                <div v-else>
                  <el-link :underline="false" type="primary">{{item.priceStr1}}</el-link>
                  <el-tag class="ml10" type="danger"> {{item.gpFirstDraftApplyStatusName}}</el-tag>
                </div>
              </el-form-item>
              <el-form-item label="Offer费用：">
                <el-button class="" type="primary" size="mini" plain @click="createApply(i,2)" v-if="!item.gpOfferApplyStatus || item.gpOfferApplyStatus == '0' || item.gpOfferApplyStatus == '3' || item.gpOfferApplyStatus == '6'">申请</el-button>
                <div v-else>
                  <el-link :underline="false" type="primary">{{item.priceStr2}}</el-link>
                  <el-tag class="ml10" type="danger"> {{item.gpOfferApplyStatusName}}</el-tag>
                </div>
              </el-form-item>
              <el-form-item  label="Bonus费用：">
                <el-button class="" type="primary" size="mini" plain @click="createApply(i,3)" v-if="!item.gpBonusApplyStatus || item.gpBonusApplyStatus == '0' || item.gpBonusApplyStatus == '3' || item.gpBonusApplyStatus == '6'">申请</el-button>
                <div v-else>
                  <el-link :underline="false" type="primary">{{item.priceStr3}}</el-link>
                  <el-tag class="ml10" type="danger"> {{item.gpBonusApplyStatusName}}</el-tag>
                </div>
              </el-form-item>

              <el-card v-if="item.apply" class="mt10 card-bg">
                <el-form :model="item.applyList" :inline="true" label-width="110px" :rules="rules" :ref="'applyList'+i">
                  <el-form-item label="申请类型：" prop="applyType">
                    <el-select v-model="item.applyList.applyType" disabled size="mini" placeholder="" @change="createTitle(item,i)">
                      <el-option v-for="item in academicList"
                        :key="item.itemValue"
                        :label="item.itemName "
                        :value="item.itemValue + '&&' + item.itemName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="申请标题：">
                    <div style="width:500px;">{{item.applyList.applyTitle}}</div>
                  </el-form-item>
                  <el-form-item  v-if="item.applyList.applyType != 'first_draft&&首稿（文书）'" label="升学offer：" prop="entranceOfferId">
                    <el-select v-model="item.applyList.entranceOfferId" size="mini" filterable placeholder="请选择">
                      <el-option v-for="item in offerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="凭证：" prop="fileList">
                    <el-upload
                      action
                      class="upload-btn"
                      ref="upload1"
                      :auto-upload="false"
                      :file-list="item.applyList.fileList"
                      :on-remove="(file, fileList) => {remove(fileList, item.applyList)}"
                      :on-change="(file, fileList) => {change(file, fileList, item.applyList)}"
                      drag
                    >
                      <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="收款账户：" prop="payType">
                    <el-select
                      v-model="item.applyList.payType"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in item.applyList.payWayList"
                        :key="item.accountId"
                        :label="item.paymentTypeName + ':' + item.payAcc"
                        :value="item.accountId + '&&' + item.paymentType"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="`申请金额${item.gpCompensationType == 'cny'?'￥':'$'}：`" prop="paymentAmountUsd">
                    <el-input-number
                      size="mini"
                      style="width:190px"
                      v-model="item.applyList.paymentAmountUsd"
                      placeholder="请输入"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="抄送人：">
                    <el-select v-model="item.applyList.copy" size="mini" multiple filterable placeholder="请选择">
                      <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-for="(p,j) in auditorList" :label='`${p.confirmCol}：`' :key="j">
                    <el-select
                      v-model="item.auditor[j]"
                      multiple
                      filterable
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="confirmItem in p.confirmorArr"
                        :key="confirmItem.confirmorId"
                        :label="confirmItem.confirmorName"
                        :value="confirmItem.confirmorId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <div class="apply-footer">
                    <el-button type="" size="small" @click="closeApply(i)">取消</el-button>
                    <el-button type="" size="small" @click="submitMentor(item,i)">提交申请</el-button>
                  </div>
                </el-form>
              </el-card>
            </div>
            <!-- 其他导师 -->
            <div v-else class="mentor_content">
              <el-form-item label="导师名：">
                <p class="mr20" :style="{width:'200px',display:'inline-block'}">{{item.mentorName}}</p>
                <div class="del" @click="delMentor(i)">
                  <i class="el-icon-delete icon-del"></i>
                </div>
              </el-form-item>
              <el-form-item label="课时数：">
                <el-input-number class="mr20" v-model="item.signLesson" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="country:" v-if="programType == 'basic'">
                <el-select
                  :style="{width:'200px'}"
                  v-model="item.mentorCountry"
                  filterable
                  clearable
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item1,i) in item.mentorCountryList.id"
                    :key="i"
                    :label="item.mentorCountryList.name[i]"
                    :value="item1"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="track:" v-if="programType == 'basic'">
                <el-select
                  :style="{width:'200px'}"
                  v-model="item.mentorTrack"
                  filterable
                  multiple
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item1,i) in item.mentorTrackList.id"
                    :key="item1"
                    :label="item.mentorTrackList.name[i]"
                    :value="item1"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注:" >
                <el-input style="width:200px" type="textarea" v-model="item.remark" ></el-input>
              </el-form-item>
              <el-button class="mentor_submit_btn" @click="saveList(i)" type="primary" size="mini">提交</el-button>
            </div>

          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">关 闭</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      :title="`搜索${businessTypeName[programType]}导师`"
      :visible.sync="searchMentorVisible"
      width="800px"
      :before-close="searchMentoClose"
    >
      <div class="mb20">
        <el-input
          :style="{width:'150px'}"
          v-model="mentorName"
          size="mini"
          clearable
          placeholder="注意名字中间空格"
          @keyup.enter.native="searchMentorByMentorName"
        ></el-input>
        <el-button type="primary" @click="searchMentorByMentorName" size="mini">查询</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="programType == 'tutoring'?'课业辅导导师':`行业导师`"
      :visible.sync="mentorListVisible"
      width="1000px"
      :before-close="mentorListClose"
    >
      <el-row v-for="(mentor,i) in mentorSearchList" :key="mentor.mentorId">
        <el-col :span="2">
          <el-button size="mini" @click="chooseMentor(i)" type="primary">选择</el-button>
        </el-col>
        <el-col :span="2" class="_item-name">姓名</el-col>
        <el-col :span="2" class="_item-value">{{mentor.mentorName}}</el-col>
        <el-col :span="2" class="_item-name">微信ID</el-col>
        <el-col :span="2" class="_item-value">{{mentor.wxId}}</el-col>
        <el-col :span="3" class="_item-name" v-if="programType == 'tutoring'">课业辅导学科</el-col>
        <el-col :span="3" class="_item-name" v-else-if="programType == 'graduate_program'">专业</el-col>
        <el-col :span="3" class="_item-name" v-else>Track</el-col>
        <el-col :span="4" class="_item-value" v-if="programType == 'tutoring'">{{mentor.tutoringSubjectName}}</el-col>
        <el-col :span="4" class="_item-value" v-else-if="programType == 'graduate_program'">{{mentor.gpMajorName}}</el-col>
        <el-col :span="4" class="_item-value" v-else>{{mentor.trackName}}</el-col>
        <el-col :span="2" class="_item-name">Country</el-col>
        <el-col :span="4" class="_item-value">{{mentor.countryName}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import apiU from '@/api/user'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import { uploadFunBySys, downloadFun } from '@/libs/file'
export default {
  mixins: [mixins],
  name: 'programSetMentor',
  props: {
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    mentorHours: {
      type: Number,
      default: 0
    },
    programType: {
      type: String,
      default: ''
    },
    mentorVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var validateOffer = (rule, value, callback) => {
      console.log(value)
      const nVal = this.mentorList[this.vNum].applyList.applyType.split('&&')[0]
      if ((nVal == 'final_payment' || nVal == 'incentive_payment') && value == '') {
        callback(new Error('请选择升学offer'))
      } else {
        callback()
      }
    }
    var validateFile = (rule, value, callback) => {
      const nVal = this.mentorList[this.vNum].applyList.applyType.split('&&')[0]
      if (nVal == 'first_draft' && value == '') {
        callback(new Error('请上传初稿文件'))
      } else if (nVal == 'final_payment' && value == '') {
        callback(new Error('请上传升学offer'))
      } else if (nVal == 'incentive_payment' && value == '') {
        callback(new Error('请上传升学offer'))
      } else {
        callback()
      }
    }
    return {
      editableTabsValue: '',
      widths: '530px',
      vNum: 0,

      activeNames: [],
      userList: [],
      academicList: [],
      auditorList: [],
      offerList: [],
      mentorList: [],
      payWayList: [],
      searchMentorVisible: false,
      addMentor: null,
      mentorName: '',
      mentorSearchList: [],
      mentorListVisible: false,
      businessType: {
        basic: 'businessCareer',
        graduate_program: 'businessGp',
        cfa: 'businessCfa',
        oral: 'businessOral',
        finance: 'businessFinance',
        tutoring: 'businessTutoring'
      },
      businessTypeName: {
        basic: '求职',
        graduate_program: '升学',
        cfa: 'CFA',
        oral: '口语',
        finance: '理财',
        tutoring: '课业辅导'
      },

      rules: {
        applyType: [{ required: true, message: '请选择申请类型', trigger: 'change' }],
        entranceOfferId: [{ validator: validateOffer, trigger: 'change' }],
        payType: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        paymentAmountUsd: [{ required: true, message: '请输入申请金额', trigger: 'change' }],
        fileList: [{ validator: validateFile, trigger: 'change' }]
      }
    }
  },
  filters: {
    // 支付状态过滤器
    filterTitle (value) {
      switch (value) {
        case '2':
          // 通过
          return 'success'
        case '3':
          // 拒绝
          return 'danger'
        case '5':
          // 已支付
          return ''
        case '6':
          // 已取消
          return 'warning'
        case '7':
          // 支付异常
          return 'danger'
        default:
          return 'info'
      }
    }
  },
  watch: {
    mentorVisible: function (newData, oldData) {
      if (newData) {
        console.log(this.programType, this.academicList)
        this.editableTabsValue = ''
        this.Topage()
      }
    }
  },
  mounted () {
    // 获取审核类型列表
    apiDic.getDicDropdown('academic_mentor_bonus').then((res) => {
      console.log('getAcademicList', res.data)
      this.academicList = res.data.academic_mentor_bonus
    })
    // 获取抄送人列表
    apiU.userList({
      pageNum: 1,
      pageSize: 1000,
      entryStatus: '1'
    }).then(({ data }) => {
      console.log(
        'userList...........................................',
        data
      )
      this.userList = data.rows
    })
    // 获取审核人列表
    apiDic.getAuditorListByApplyType('academic_mentor_bonus').then(res => {
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
  },
  beforeDestroy () {
    console.log('组件销毁')
    this.editableTabsValue = null
    this.widths = null
    this.vNum = null
    this.activeNames = null
    this.userList = null
    this.academicList = null
    this.auditorList = null
    this.offerList = null
    this.mentorList = null
    this.payWayList = null
    this.searchMentorVisible = null
    this.addMentor = null
    this.mentorName = null
    this.mentorSearchList = null
    this.mentorListVisible = null
    this.businessType = null
    this.businessTypeName = null
  },
  methods: {
    /**
     * @description: 获取升学导师列表
     * @param {*}
     * @return {*}
     */
    Topage () {
      if (this.programType == 'graduate_program') {
        api.getMentorDetailBySignId(this.signId).then(res => {
          console.log(this.editableTabsValue, res.data.length > 0)
          console.log('分配升学导师列表', res)
          this.$loading().close()
          if ((!this.editableTabsValue || this.editableTabsValue == 0) && res.data.length > 0) {
            this.editableTabsValue = res.data[0].mentorId
          }
          res.data.forEach(v => {
            // console.log(JSON.parse(v.gpFirstDraftApplyContent))
            if (v.gpFirstDraftApplyContent) {
              if (JSON.parse(v.gpFirstDraftApplyContent).text[4]) {
                v.priceStr1 = `申请金额：${JSON.parse(v.gpFirstDraftApplyContent).text[4].value}`
              } else {
                v.priceStr1 = `申请金额：${JSON.parse(v.gpFirstDraftApplyContent).text[3].value}`
              }
              console.log(v.priceStr1)
            }
            if (v.gpOfferApplyContent) {
              v.priceStr2 = `申请金额：${JSON.parse(v.gpOfferApplyContent).text[4].value}`
              console.log(v.priceStr2)
            }
            if (v.gpBonusApplyContent) {
              v.priceStr3 = `申请金额：${JSON.parse(v.gpBonusApplyContent).text[4].value}`
              console.log(v.priceStr3)
            }
            v.apply = false,
            v.applyList = {
              applyType: '',
              applyTitle: '',
              entranceOfferId: '',
              payWayList: [],
              payType: '',
              paymentAmountUsd: 0,
              copy: [],
              fileList: []
            }
            v.auditor = []
            this.auditorList.forEach(u => {
              v.auditor.push(u.auditor)
            })
          })
          this.mentorList = res.data
        })
      } else {
        api.getMentorListBySignIdset(this.signId).then(res => {
          console.log('项目行业导师列表', res)
          this.$loading().close()
          if ((!this.editableTabsValue || this.editableTabsValue == 0) && res.data.length > 0) {
            this.editableTabsValue = res.data[0].mentorId
          }
          res.data.forEach(v => {
            v.mentorCountry = v.country ? JSON.parse(v.country) : []
            v.mentorTrack = v.track ? JSON.parse(v.track) : []
            v.mentorCountryList = {
              id: v.countryList ? v.countryList.split(',') : [],
              name: v.countryListName ? v.countryListName.split(',') : []
            }
            v.mentorTrackList = {
              id: v.trackList ? v.trackList.split(',') : [],
              name: v.trackListName ? v.trackListName.split(',') : []
            }
          })
          this.mentorList = res.data
        })
      }
    },

    /**
     * @description: 录入信息，关闭
     * @param {*}
     * @return {*}
     */
    handleClose () {
      this.mentorName = ''
      this.$emit('close')
      this.editableTabsValue = ''
      // this.$refs.mentorList.resetFields();
    },

    /**
     * @description: 添加导师
     * @param {*} i
     * @return {*}
     */
    addMentorF (i) {
      for (let i = 0; i < this.mentorList.length; i++) {
        if (this.mentorList[i].mentorId == this.addMentor.split('&&')[0]) {
          this.$message({
            type: 'error',
            message: '你看看，被选中的导师是不是已经存在了？'
          })
          return
        }
      }
      let mentorItem = {}
      console.log(this.addMentor,2222222222222)
      if (this.programType == 'graduate_program') {
        mentorItem = {
          mentorName: this.addMentor.split('&&')[1],
          mentorId: this.addMentor.split('&&')[0],
          remark: '',
          apply: false,
          applyList: {
            applyType: '',
            applyTitle: '',
            entranceOfferId: '',
            payWayList: [],
            payType: '',
            paymentAmountUsd: 0,
            copy: [],
            fileList: []
          }
        }
        this.addMentor = mentorItem
        this.addList(i)
      } else {
        console.log(this.mentorSearchList[i], this.mentorSearchList[i].trackName)
        mentorItem = {
          mentorName: this.addMentor.split('&&')[1],
          mentorId: this.addMentor.split('&&')[0],
          signId: this.signId,
          mentorCountryList: {
            id: this.mentorSearchList[i].country ? (this.mentorSearchList[i].country.split(',') || []) : [],
            name: this.mentorSearchList[i].countryName ? (this.mentorSearchList[i].countryName.split(',') || []) : []
          },
          mentorTrackList: {
            id: this.mentorSearchList[i].track ? (this.mentorSearchList[i].track.split(',') || []) : [],
            name: this.mentorSearchList[i].trackName ? (this.mentorSearchList[i].trackName.split(',') || []) : []
          }
        }
        // tutoringSubjectName
        this.mentorList.push(mentorItem)
        this.editableTabsValue = mentorItem.mentorId
        console.log(this.mentorList, this.addMentor)
        this.addMentor = null
      }

      // this.mentorList.push(mentorItem);
    },
    addList (i) {
      const params = {
        signId: this.signId,
        mentorId: this.addMentor.mentorId,
        remark: ''
      }
      console.log(params)
      api.saveAcademicMentor(params).then(res => {
        this.Topage()
        this.editableTabsValue = this.addMentor.mentorId
        this.$message({
          type: 'success',
          message: '新增成功'
        })
      })
    },
    /**
     * @description: 删除升学导师
     * @param {*} i 选择的导师序号
     * @return {*}
     */
    delGraduateMentor (i) {
      this.$confirm('此操作将删除该导师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.mentorList[i].pkId) {
          api.delAcademicMentor(this.mentorList[i].pkId).then(res => {
            this.editableTabsValue = ''
            this.Topage()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        }
      })
    },
    /**
     * @description: 删除导师
     * @param {*} i
     * @return {*}
     */
    delMentor (i) {
      this.$confirm(
        `此操作将永久删除<${this.mentorList[i].mentorName}>导师, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          console.log(i)
          if (this.mentorList[i].pkId) {
            const data = {
              delList: [this.mentorList[i].pkId],
              signId: this.mentorList[i].signId
            }
            console.log('删除行业导师参数', data)
            api
              .setMentorListBySignId(data)
              .then(res => {
                console.log('删除行业导师', res)
                if (res.data.msg == '保存成功') {
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                  this.Topage()
                  this.$emit('update')
                } else {
                  this.$message({
                    type: 'error',
                    message: '导师已有排课，本次操作无效',
                    showClose: true,
                    duration: 10000
                  })
                  this.Topage()
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
          this.mentorList.splice(i, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * @description: 创建佣金申请
     * @param {*} i 选择的导师序号
     * @return {*}
     */
    createApply (i, num) {
      const obj = this.mentorList[i]
      api.getCooperatorPaymentListByCooperatorIdNew(obj.mentorId.split('&&')[0], true).then(res => {
        console.log(res.data)
        if (res.data.length < 1) {
          this.$message.error('此导师未配置收款方式')
          return false
        }
        console.log(res)
        obj.applyList.payWayList = res.data
        this.initDrop(obj)
        obj.applyList.payType = res.data[0].accountId + '&&' + res.data[0].paymentType
      })
      api.getMentorDetailById(obj.mentorId).then(res => {
        obj.gpCompensationType = res.data.gpCompensationType
        obj.gpCompensation = res.data.gpCompensation
        obj.gpMeritCompensation = res.data.gpMeritCompensation
        if (num == 1) {
          obj.applyList.applyType = 'first_draft&&首稿（文书）'
          obj.applyList.paymentAmountUsd = (obj.gpCompensation * 0.2).toFixed(2)
        } else if (num == 2) {
          obj.applyList.applyType = 'final_payment&&尾款（offer）'
          obj.applyList.paymentAmountUsd = (obj.gpCompensation * 0.8).toFixed(2)
        } else if (num == 3) {
          obj.applyList.applyType = 'incentive_payment&&激励（offer）'
          obj.applyList.paymentAmountUsd = obj.gpMeritCompensation * 1
        }
        obj.applyList.applyTitle = `升学导师【${obj.mentorName}】- ${obj.applyList.applyType.split('&&')[1]}的薪资申请`
        // 获取该导师的支付类型
        this.$set(obj, 'apply', true)
      })
    },

    /**
     * @description: 取消佣金申请
     * @param {*} i
     * @return {*}
     */
    closeApply (i) {
      this.$set(this.mentorList[i], 'apply', false)
    },

    /**
     * @description: 选择类型后自动生成标题
     * @param {*} obj 导师对象
     * @return {*}
     */
    createTitle (obj, i) {
      console.log(obj, obj.applyList.applyType)
      if (obj.applyList.applyType.split('&&')[0] == 'first_draft') {
        obj.applyList.paymentAmountUsd = (obj.gpCompensation * 0.2).toFixed(2)
      } else if (obj.applyList.applyType.split('&&')[0] == 'final_payment') {
        obj.applyList.paymentAmountUsd = (obj.gpCompensation * 0.8).toFixed(2)
      } else if (obj.applyList.applyType.split('&&')[0] == 'incentive_payment') {
        obj.applyList.paymentAmountUsd = obj.gpMeritCompensation * 1
      }
      obj.applyList.applyTitle = `升学导师【${obj.mentorName}】- ${obj.applyList.applyType.split('&&')[1]}的薪资申请`
    },

    /**
     * @description: 提交佣金申请
     * @param {*} obj 导师佣金申请对象
     * @param {*} i 导师序号
     * @return {*}
     */
    submitMentor (obj, i) {
      this.$loading()
      console.log(this.menteeId)
      this.vNum = i
      const refName = 'applyList' + i
      this.$refs[refName][0].validate((valid) => {
        if (valid) {
          const copyTo = []
          obj.applyList.copy.forEach((v) => {
            copyTo.push({ copyTo: v })
          })
          const approval = []
          let cannot = false
          obj.auditor.forEach(aa => {
            if (!aa.length) {
              cannot = true
            }
            aa.forEach(v => {
              approval.push({ approverId: v })
            })
          })
          if (cannot) {
            this.$message({
              type: 'warning',
              message: '审核人都为必填！'
            })
            return
          }
          const params = {
            applyType: 'academic_mentor_bonus',
            applyTitle: obj.applyList.applyTitle,
            keyId: this.signId,
            copyTo: copyTo,
            approval: approval,
            content: {
              file: [],
              text: [{
                label: '申请类型',
                value: obj.applyList.applyType.split('&&')[1]
              }, {
                label: '申请标题',
                value: obj.applyList.applyTitle
              }, {
                label: '收款账户',
                value: ''
              }, {
                label: '升学offer',
                value: obj.applyList.entranceOfferId ? obj.applyList.entranceOfferId.split('&&')[1] : ''
              }, {
                label: '申请金额',
                value: `${obj.gpCompensationType == 'cny' ? '￥' : '$'}` + obj.applyList.paymentAmountUsd
              }],
              info: {
                pkId: obj.pkId,
                signId: this.signId,
                mentorId: obj.mentorId,
                menteeId: this.menteeId,
                bonusApplyType: obj.applyList.applyType.split('&&')[0],
                fundWage: obj.applyList.paymentAmountUsd,
                fundType: obj.gpCompensationType,
                // "paymentAmountCny":"cnyReplace",
                // "rate":"exchangeRateReplace",
                payType: obj.applyList.payType.split('&&')[0],
                entranceOfferId: obj.applyList.entranceOfferId ? obj.applyList.entranceOfferId.split('&&')[0] : '',
                voucherUrl: '',
                voucherName: ''
              }
            }
          }
          const payWay = obj.applyList.payWayList.filter(v => v.pkId == obj.applyList.payType.split('&&')[0])[0]
          let account = ''
          for (const item in payWay) {
            switch (item) {
              case 'paymentType': {
                account += '付款类型：' + payWay[item] + '  ;  '
                break
              }
              case 'payAcc': {
                account += ' 账户：' + payWay[item] + '  ;  '
                break
              }
              case 'bankName': {
                account += ' 银行：' + payWay[item] + '  ;  '
                break
              }
              case 'realName': {
                account += ' 收款人姓名：' + payWay[item] + '  ;  '
                break
              }
              case 'idCard': {
                account += ' 收款人身份证号：' + payWay[item] + '  ;  '
                break
              }
              case 'bankAddress': {
                account += ' Bank Address：' + payWay[item] + '  ;  '
                break
              }
              case 'zip': {
                account += ' ZIP：' + payWay[item] + '  ;  '
                break
              }
              case 'routingNumber': {
                account += ' Routing Number：' + payWay[item] + '  ;  '
                break
              }
              case 'swiftCode': {
                account += ' Swift Code：' + payWay[item] + '  ;  '
                break
              }
            }
          }
          params.content.text[2].value = account
          if (!obj.applyList.entranceOfferId) {
            params.content.text.splice(3, 1)
            delete params.content.info.entranceOfferId
          }
          console.log(params, this.offerList)

          this.$loading()
          if (obj.applyList.fileList.length) {
            for (let i = obj.applyList.fileList.length - 1; i >= 0; i--) {
              const file = obj.applyList.fileList[i]
              uploadFunBySys(file.raw, 'voucher/edu_mentor_payment_extra', url => {
                console.log(url)
                params.content.file.push({
                  name: file.name,
                  url: url
                })
                // params.content.info.voucherUrl = url
                // params.content.info.voucherName = file.name
                if (params.content.file.length == obj.applyList.fileList.length) {
                  console.log(params)
                  api.saveCommApply(params).then(res => {
                    console.log('升学导师佣金申请结果：', res)
                    this.$loading().close()
                    this.Topage()
                    this.$message({
                      type: 'success',
                      message: '申请成功'
                    })
                  }).catch(() => {
                    this.$loading().close()
                  })
                }
              })
            }
          } else {
            api.saveCommApply(params).then(res => {
              console.log('升学导师佣金申请结果：', res)
              this.$loading().close()
              this.Topage()
              this.$message({
                type: 'success',
                message: '申请成功'
              })
            }).catch(() => {
              this.$loading().close()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /**
     * @description: 根据导师姓名搜索导师
     * @param {*}
     * @return {*}
     */
    searchMentorByMentorName () {
      if (!this.mentorName) {
        this.$message({
          type: 'warning',
          message: '请输入导师全名~'
        })
        return
      }
      const params = {
        mentorName: this.mentorName,
        businessType: this.businessType[this.programType]
      }
      api.searchMentorByMentorName(params).then(res => {
        console.log(res.data)
        // res.data = [{
        //     country: "US",
        //     letterModifyCompensationResumeZh: 0,
        //     mentorName: "Hao Yuan",
        //     letterModifyCompensationCoverLetter: 0,
        //     businessTutoring: "1",
        //     letterModifyCompensationResumeEn: 0,
        //     nickName: "Hao",
        //     sex: "1",
        //     businessOral: "0",
        //     wxId: "yuanhao0217",
        //     businessFinance: "0",
        //     businessLetterModify: "0",
        //     tutoringSubjectName: "微积分入门,微积分进阶,基础物理,统计入门,多元微积分",
        //     businessCareer: "0",
        //     businessCfa: "0",
        //     businessGp: "0",
        //     countryName: "美国",
        //     mentorId: "mentor-2021050018"
        // }]
        if (!res.data.length) {
          this.$message({
            type: 'warning',
            message: `未找到符合条件的${this.businessTypeName[this.programType]}导师`
          })
          return
        }
        res.data.forEach(item => {
          item.gpMajorName = ''
          item.mentorGpMajorArr.forEach(mentorGpMajor => {
            item.gpMajorName += (`${mentorGpMajor.itemName},` || '')
          })
        })
        this.mentorSearchList = res.data
        this.mentorListVisible = true
      })
      this.mentorName = ''
    },

    /**
     * @description: 选择导师
     * @param {*} i
     * @return {*}
     */
    chooseMentor (i) {
      this.addMentor =
        this.mentorSearchList[i].mentorId +
        '&&' +
        this.mentorSearchList[i].mentorName
      if (this.programType != 'tutoring' && this.programType != 'graduate_program') {
        if (
          !this.mentorSearchList[i].country ||
          !this.mentorSearchList[i].countryName ||
          !this.mentorSearchList[i].track ||
          !this.mentorSearchList[i].trackName
        ) {
          this.$message({
            type: 'warning',
            message: '该导师信息不完整（country，track）'
          })
          return
        }
      } else {
        console.log('课时辅导')
      }
      console.log(i)
      this.addMentorF(i)
      this.searchMentorVisible = false
      this.mentorListClose()
    },

    /**
     * @description: 升学导师弹框关闭
     * @param {*}
     * @return {*}
     */
    mentorListClose () {
      this.mentorListVisible = false
      this.mentorSearchList = []
    },

    /**
     * @description: 设置申请凭证
     * @param {*} file
     * @param {*} fileList
     * @param {*} obj
     * @return {*}
     */
    change (file, fileList, obj) {
      this.$set(obj, 'fileList', fileList)
    },
    remove (fileList, obj) {
      console.log(fileList)
      this.$set(obj, 'fileList', fileList)
    },
    /**
     * @description: 保存导师列表
     * @param {*}
     * @return {*}
     */
    saveList (i) {
      if (this.programType == 'graduate_program') {
        const params = {
          pkId: this.mentorList[i].pkId,
          remark: this.mentorList[i].remark
        }
        console.log(params)
        this.$loading()
        api.editAcademicMentor(params).then(res => {
          console.log(res.data)
          this.Topage()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      } else {
        let total = 0
        this.mentorList.forEach(v => {
          total += v.signLesson
        })
        if (total > this.mentorHours) {
          this.$message({
            type: 'error',
            message: '行业导师分配的课时超了总课时'
          })
          return
        }
        if (this.programType == 'basic') {
          if (
            !this.mentorList[i].mentorTrack.length ||
            !this.mentorList[i].mentorCountry.length
          ) {
            this.$message({
              type: 'error',
              message: '你是不是有什么忘填了？'
            })
            return
          }
        }
        let a = ''
        console.log(this.programType)
        if (this.programType == 'basic') {
          a = 'mentor_career'
        } else if (this.programType == 'oral') {
          a = 'mentor_oral'
        } else if (this.programType == 'finance') {
          a = 'mentor_finance'
        } else if (this.programType == 'tutoring') {
          a = 'mentor_tutoring'
        }
        let data = {}
        if (this.programType == 'tutoring') {
          data = {
            signId: this.mentorList[i].signId,
            uptList: [
              {
                signId: this.mentorList[i].signId,
                mentorId: this.mentorList[i].mentorId,
                signLesson: this.mentorList[i].signLesson || 0,
                remark: this.mentorList[i].remark,
                businessType: a
              }
            ]
          }
        } else {
          data = {
            signId: this.mentorList[i].signId,
            uptList: [
              {
                signId: this.mentorList[i].signId,
                mentorId: this.mentorList[i].mentorId,
                track: this.mentorList[i].mentorTrack,
                country: this.mentorList[i].mentorCountry,
                signLesson: this.mentorList[i].signLesson || 0,
                remark: this.mentorList[i].remark,
                businessType: a

              }
            ]
          }
        }
        if (this.mentorList[i].pkId) {
          data.uptList[0].pkId = this.mentorList[i].pkId
        }
        console.log('更新行业导师参数', data)
        this.$loading()
        api
          .setMentorListBySignId(data)
          .then(res => {
            console.log('更新行业导师', res)
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.Topage()
            this.$emit('update')
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    addTab () {
      this.searchMentorVisible = true
    },
    searchMentoClose () {
      this.searchMentorVisible = false
    },
    /**
     * @description: 打开申请凭证
     * @param {*} val
     * @return {*}
     */
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    removeTab (targetName) {
      const tabs = this.mentorList
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.mentorId === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.mentorId
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.mentorList = tabs.filter(tab => tab.mentorId !== targetName)
    },
    initDrop (obj) {
      // 获取升学offer列表
      api.getOfferEduList2({ menteeId: this.menteeId, signId: this.signId, mentorId: obj.mentorId }).then(res => {
        this.offerList = []
        console.log('offer列表', res)
        res.data.forEach(v => {
          const item = {
            id: v.pkId + `&&${v.entranceTypeName}-${v.engName}${v.instituteEngName !== undefined ? ('-' + v.instituteEngName) : ''}`,
            name: `${v.menteeName}-${v.entranceTypeName}-${v.engName}${v.instituteEngName !== undefined ? ('-' + v.instituteEngName) : ''}`
          }
          this.offerList.push(item)
        })
        this.offerList.unshift({
          id: '0&&不保offer',
          name: '不保offer'
        })
        console.log(this.offerList, 333333333333333)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fr{
  float:right;
}
.del{
  position:absolute;
  top:0;
  right:0;
  width: 35px;
  height: 35px;
  background: #F56C6C;
  border-radius: 0px 0px 0px 100px;
  cursor: pointer;
}
.del:hover{
  background: #f78989;
}
.del:active{
  background: #dd6161;
}
.icon-del{
  margin-left:15px;
  color:#FFF
}
.card-bg{
  background-color:#F4F4F5;
  border-color:#DCDFE6
}
.apply-footer{
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.program-montor_ux .upload-btn{
  width:500px !important;
}
.program-montor_ux .el-upload-dragger{
  width:100px !important;
  height:40px !important;
}
.program-montor_ux .el-upload-list{
  display:inline-block !important
}
.program-montor_ux .el-collapse-item__header{
  background-color:#FFF!important;
}
.mentor_content{
  position: relative;
}
.mentor_submit_btn{
  position: absolute;
  right:0;
  bottom:5px;
}
</style>
