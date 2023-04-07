<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="cacheActivityData.activityId ? '编辑活动':'新增活动'"
      :visible.sync="setActivityVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheActivityData"
        :rules="rules"
        ref="cacheActivityData"
        label-width="120px"
      >
        <el-form-item label="活动方式" prop="activityWay">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.activityWay"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sign_way_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-input
            :disabled="cacheActivityData.activityStatus != 'not_audit'"
            :style="{width:widths}"
            v-model="cacheActivityData.activityName"
            :maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="经费货币" prop="expenditureType">
          <el-select
            :style="{width:widths}"
            :disabled="cacheActivityData.activityStatus != 'not_audit'"
            filterable
            v-model="cacheActivityData.expenditureType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动经费" prop="expenditure">
          <el-input-number
            :controls="false"
            :disabled="cacheActivityData.activityStatus != 'not_audit'"
            :style="{width:widths}"
            v-model="cacheActivityData.expenditure"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="内部负责人" prop>
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.activityResponsiblePerson"
            :disabled="cacheActivityData.activityStatus != 'not_audit'"
            placeholder="请选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期" prop="activityDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheActivityData.activityDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动开始时间" prop="activityBeginTime">
          <!-- <el-time-picker
            :style="{width:widths}"
            v-model="cacheActivityData.activityBeginTime"
            placeholder="设置时间"
          ></el-time-picker>-->
          <el-time-select
            :style="{width:widths}"
            placeholder="结束时间"
            v-model="cacheActivityData.activityBeginTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:00',
            }"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="活动结束时间" prop="activityEndTime">
          <!-- <el-time-picker
            :style="{width:widths}"
            v-model="cacheActivityData.activityEndTime"
            placeholder="设置时间"
          ></el-time-picker>-->
          <el-time-select
            :style="{width:widths}"
            placeholder="结束时间"
            v-model="cacheActivityData.activityEndTime"
            :picker-options="{
              start: '00:30',
              step: '00:15',
              end: '24:00',
              minTime: cacheActivityData.activityBeginTime
            }"
          ></el-time-select>
        </el-form-item>
        <!-- <el-form-item label="活动时间" prop="activityDuration">
          <el-time-picker
            :style="{width:widths}"
            is-range
            v-model="cacheActivityData.activityDuration"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>-->
        <el-form-item
          label="活动地点"
          prop="activityAddr"
          v-if="cacheActivityData.activityWay == 'offline'"
        >
          <el-input
            :style="{width:widths}"
            v-model="cacheActivityData.activityAddr"
            :maxlength="199"
          ></el-input>
        </el-form-item>
        <el-form-item label="合作方对接人" prop>
          <el-input
            :style="{width:widths}"
            v-model="cacheActivityData.activityPrincipal"
            :maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="对接人联系方式" prop>
          <el-input
            :style="{width:widths}"
            v-model="cacheActivityData.activityPrincipalContact"
            :maxlength="199"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="线上方式"
          prop="onlineType"
          v-if="cacheActivityData.activityWay == 'online'"
        >
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.onlineType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in activity_online_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计参与人数" prop>
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheActivityData.expectParticipantNum"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="预计微信群人数" prop="expectWxGroupNum">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheActivityData.expectWxGroupNum"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>-->
        <el-form-item label="活动性质" prop>
          <el-input
            :style="{width:widths}"
            type="textarea"
            :autosize="{minRows:3}"
            v-model="cacheActivityData.activityProperty"
            :disabled="cacheActivityData.activityStatus != 'not_audit'"
            :maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动流程" prop="activityProcess">
          <el-input
            :style="{width:widths}"
            type="textarea"
            :autosize="{minRows:3}"
            v-model="cacheActivityData.activityProcess"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同对照内容" prop="contractRelatedContent">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheActivityData.contractRelatedContent"
            :disabled="cacheActivityData.activityStatus != 'not_audit'"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动宣传手段" prop="publicityMeans">
          <el-input
            :style="{width:widths}"
            v-model="cacheActivityData.publicityMeans"
            :maxlength="99"
            type="textarea"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <el-form-item label="各部门需要的人数及职能" prop>
          <el-input
            type="textarea"
            :autosize="{minRows:3}"
            :style="{width:widths}"
            v-model="cacheActivityData.manpowerAndPosition"
            :maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否组微信群" prop>
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.needWxGroup"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="cacheActivityData.needWxGroup == 1">
          <el-form-item label="微信群名" prop="wxGroupName">
            <el-input
              :style="{width:widths}"
              v-model="cacheActivityData.wxGroupName"
              :maxlength="199"
            ></el-input>
          </el-form-item>
          <el-form-item label="导流微信号" prop="wxAccount">
            <!-- <el-input
              :style="{width:widths}"
              v-model="cacheActivityData.wxAccount"
              :maxlength="199"
            ></el-input>-->
            <el-select
              :style="{width:widths}"
              v-model="cacheActivityData.wxAccount"
              clearable
              filterable
              placeholder="请选择导流微信号"
            >
              <el-option
                v-for="item in source_wx"
                :key="item.accountId"
                :label="item.accountInfo"
                :value="item.accountId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="是否需要群运营" prop>
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.needWxGroupOperation"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="cacheActivityData.needWxGroupOperation == 1">
          <el-form-item label="群运营人" prop="wxGroupOperation">
            <el-input
              :style="{width:widths}"
              v-model="cacheActivityData.wxGroupOperation"
              :maxlength="199"
            ></el-input>
          </el-form-item>
        </template>
        <el-form-item label="是否需要物料" prop>
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.needMateriel"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料是否有现成" prop>
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheActivityData.materielStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label=" ">
          <el-button @click="addGuest">添加嘉宾</el-button>
        </el-form-item>
        <el-card v-if="guest.length" class="mb20">
          <template v-for="(item,i) in guest">
            <div :key="i">
              <el-form-item :label="'嘉宾'+ (1+i)" prop>
                <el-select
                  :style="{width:widths}"
                  v-model="item.guestId"
                  filterable
                  allow-create
                  default-first-option
                  @change="changeSelected(i)"
                  placeholder="非公司员工时请手动输入">
                  <el-option-group
                    v-for="group in userAdd"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
                    </el-option>
                  </el-option-group>
                  </el-option>
                </el-select>
                <!-- <el-input :style="{width:widths}" v-model="item.guestName" :maxlength="200"></el-input> -->
              </el-form-item>
              <el-form-item label="嘉宾所需要准备" prop>
                <el-input :style="{width:widths}" v-model="item.guestPrepareContent"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop>
                <el-input :style="{width:widths}" v-model="item.guestNote" :maxlength="255"></el-input>
              </el-form-item>
              <el-form-item label prop>
                <el-button size="mini" class="el-icon-delete" @click="deleteGuest(i)" title="删除"></el-button>
              </el-form-item>
            </div>
          </template>
        </el-card>
        <el-form-item label=" ">
          <el-button @click="addMateriel">添加物料</el-button>
        </el-form-item>
        <el-card v-if="materiel.length" class="mb20">
          <template v-for="(item,i) in materiel">
            <div :key="i">
              <el-form-item :label="'物料'+ (1+i)" prop>
                <el-input :style="{width:widths}" v-model="item.materielName" :maxlength="200"></el-input>
              </el-form-item>
              <el-form-item label="物料数量" prop>
                <el-input-number
                  :controls="false"
                  :style="{width:widths}"
                  v-model="item.materielNum"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注" prop>
                <el-input :style="{width:widths}" v-model="item.materielNote" :maxlength="255"></el-input>
              </el-form-item>
              <el-form-item label prop>
                <el-button size="mini" class="el-icon-delete" @click="deleteMateriel(i)" title="删除"></el-button>
              </el-form-item>
            </div>
          </template>
        </el-card>

        <!-- <el-divider>反馈</el-divider>
        <el-form-item label="实际参与人数" prop="participantNum">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheActivityData.participantNum"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="微信群人数" prop="wxGroupNum">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheActivityData.wxGroupNum"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="合作方配合程度" prop="coordination">
          <el-input :style="{width:widths}" v-model="cacheActivityData.coordination"></el-input>
        </el-form-item>

        <el-form-item label="导流咨询人数" prop="consultNum">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheActivityData.consultNum"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="签约人数" prop="signNum">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheActivityData.signNum"
            :maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="活动经验总结" prop="experience">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheActivityData.experience"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheActivityData.note"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动完成凭证" prop="voucher">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'500px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import api3 from '@/api/sales_assistant'

import { uploadFunBySys } from '@/libs/file'
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    setActivityVisible: {
      type: Boolean,
      default: false
    },
    activityData: {
      type: Object
    }
  },
  data () {
    return {
      cacheActivityData: {
        activityId: null,
        activityWay: null,
        activityName: null,
        expenditureType: null,
        expenditure: null,
        activityResponsiblePerson: null,
        activityDate: null,
        activityBeginTime: null,
        activityEndTime: null,
        activityAddr: null,
        activityPrincipal: null,
        activityPrincipalContact: null,
        onlineType: null,
        expectParticipantNum: null,
        // expectWxGroupNum: null,
        activityProperty: null,
        activityProcess: null,
        contractRelatedContent: null,
        publicityMeans: null,
        manpowerAndPosition: null,
        needWxGroup: null,
        needWxGroupOperation: null,
        wxGroupOperation: null,
        wxGroupName: null,
        wxAccount: null,
        needMateriel: null,
        materielStatus: null,
        participantNum: null,
        wxGroupNum: null,
        coordination: null,
        consultNum: null,
        signNum: null,
        experience: null,
        activityStatus: 'not_audit'
      },

      bill_currency_type: [],
      activity_online_type: [],
      sign_way_type: [],
      common_yes_or_no: [],
      users: [],
      userAdd: [],
      widths: '250px',
      rules: {
        activityWay: [{ required: true, message: '必填', trigger: 'blur' }],
        activityName: [{ required: true, message: '必填', trigger: 'blur' }],
        expenditureType: [{ required: true, message: '必填', trigger: 'blur' }],
        expenditure: [{ required: true, message: '必填', trigger: 'blur' }],
        activityResponsiblePerson: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        activityDate: [{ required: true, message: '必填', trigger: 'blur' }],
        activityBeginTime: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        activityEndTime: [{ required: true, message: '必填', trigger: 'blur' }],
        activityAddr: [{ required: true, message: '必填', trigger: 'blur' }],
        activityPrincipal: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        activityPrincipalContact: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        onlineType: [{ required: true, message: '必填', trigger: 'blur' }],
        expectParticipantNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        // expectWxGroupNum: [
        //   { required: true, message: "必填", trigger: "blur" }
        // ],
        activityProperty: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        activityProcess: [{ required: true, message: '必填', trigger: 'blur' }],
        contractRelatedContent: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        publicityMeans: [{ required: true, message: '必填', trigger: 'blur' }],
        manpowerAndPosition: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        needWxGroup: [{ required: true, message: '必填', trigger: 'blur' }],
        needWxGroupOperation: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        wxGroupOperation: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        wxGroupName: [{ required: true, message: '必填', trigger: 'blur' }],
        wxAccount: [{ required: true, message: '必填', trigger: 'blur' }],
        needMateriel: [{ required: true, message: '必填', trigger: 'blur' }],
        materielStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        participantNum: [{ required: true, message: '必填', trigger: 'blur' }],
        wxGroupNum: [{ required: true, message: '必填', trigger: 'blur' }],
        coordination: [{ required: true, message: '必填', trigger: 'blur' }],
        consultNum: [{ required: true, message: '必填', trigger: 'blur' }],
        signNum: [{ required: true, message: '必填', trigger: 'blur' }],
        experience: [{ required: true, message: '必填', trigger: 'blur' }]
      },

      fileList: [],

      guest: [
        // {
        //   guestName: "",
        //   guestPrepareContent: "",
        //   guestNote: ""
        // }
      ],
      materiel: [
        // {
        //   materielName: "",
        //   materielNum: "",
        //   materielNote: ""
        // }
      ],
      source_wx: []
    }
  },
  computed: {},
  watch: {
    setActivityVisible: function (val) {
      if (val) {
        this.initUserList()
      }
      if (val && this.activityData.activityId) {
        this.initPage()
      }
    }
  },
  // [cacheActivityData.activityBeginTime,cacheActivityData.activityEndTime]
  mounted () {
    this.init()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.sign_way_type = await this.getDictionary('sign_way_type')
      this.activity_online_type = await this.getDictionary('activity_online_type')
    },
    init () {
      api3.getSelectUserList('sales_assistant').then(res => {
        console.log(res.data)
        this.users = res.data
      })

      api3
        .getCounselor('group-2019090003')
        .then(res => {
          console.log('导流微信号', res)
          this.source_wx = res.data
        })
        .catch(err => {
          console.log(err)
          alert(err.message + '，请刷新网页')
        })
    },
    initPage () {
      api.getCooperatorActivityById(this.activityData.activityId).then(res => {
        console.log(res.data)
        this.cacheActivityData = res.data
        this.guest = res.data.guestArr || []
        for (let i = 0; i < this.guest.length; i++) {
          if (!this.guest[i].guestId) {
            this.guest[i].guestId = this.guest[i].guestName
          }
        }
        this.materiel = res.data.materielArr || []
      })
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    async initUserList () {
      console.log(321312312)
      const data = {
        pageNum: 1,
        pageSize: 9999,
        entryStatus: 1
      }
      this.userAdd = await this.userListCommon('', '', 'wst_sales,wst_vip')
      // console.log(a ,2222222223213123122)
      // this.userAdd = a
      // api.getUserList(data).then(res => {
      //   for (let i = 0; i < res.data.rows.length; i++) {
      //     if (res.data.rows[i].dept == 'wst_sales' || res.data.rows[i].dept == 'wst_vip') {
      //       this.userAdd.push(res.data.rows[i])
      //     }
      //   }
        console.log(this.userAdd, 'yx1231231212313212313213')
      // })
    },
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.cacheActivityData.resetFields()
      this.fileList = []
      // this.$refs.upload1.clearFiles();
    },
    clear () {
      this.userAdd = []
      this.guest = []
      this.materiel = []
      this.cacheActivityData = {
        activityId: null,
        activityWay: null,
        activityName: null,
        expenditureType: null,
        expenditure: null,
        activityResponsiblePerson: null,
        activityDate: null,
        activityBeginTime: null,
        activityEndTime: null,
        activityAddr: null,
        activityPrincipal: null,
        activityPrincipalContact: null,
        onlineType: null,
        expectParticipantNum: null,
        // expectWxGroupNum: null,
        activityProperty: null,
        activityProcess: null,
        contractRelatedContent: null,
        publicityMeans: null,
        manpowerAndPosition: null,
        needWxGroup: null,
        needWxGroupOperation: null,
        wxGroupOperation: null,
        wxGroupName: null,
        wxAccount: null,
        needMateriel: null,
        materielStatus: null,
        participantNum: null,
        wxGroupNum: null,
        coordination: null,
        consultNum: null,
        signNum: null,
        experience: null,
        activityStatus: 'not_audit'
      }
    },
    changeSelected (i) {
      if (this.guest.length > 0) {
        for (let j = 0; j < this.userAdd.length; j++) {
          if (this.guest[i].guestId == this.userAdd[j].userId) {
            this.guest[i].guestName = this.userAdd[j].userName
            return false
          } else {
            this.guest[i].guestName = this.guest[i].guestId
          }
        }
      }
      console.log(i, this.guest)
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheActivityData,
        this.cacheActivityData
      )
      this.$refs.cacheActivityData.validate(valid => {
        if (!valid) {
          return
        }
        if (this.fileList.length) {
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            uploadFunBySys(file.raw, 'voucher/db', url => {
              console.log(url)
              this.cacheActivityData.voucher.push({
                voucherName: file.name,
                voucherPath: url
              })
              if (
                this.cacheActivityData.voucher.length ===
                this.fileList.length + 1
              ) {
                console.log('bd_contract参数', this.cacheActivityData)
                this.submit2()
              }
            })
          }
        } else {
          this.submit2()
        }
      })
    },
    submit2 () {
      const guestList = JSON.parse(JSON.stringify(this.guest))
      for (let i = 0; i < guestList.length; i++) {
        if (guestList[i].guestName == guestList[i].guestId) {
          guestList[i].guestId = ''
        }
      }
      this.cacheActivityData.guest = guestList
      this.cacheActivityData.materiel = this.materiel
      this.cacheActivityData.cooperatorId = this.activityData.cooperatorId
      console.log('cacheActivityData', this.cacheActivityData)
      if (!this.cacheActivityData.activityId) {
        api
          .addCooperatorActivity(this.cacheActivityData)
          .then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      } else {
        api
          .uptCooperatorActivity(this.cacheActivityData)
          .then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      }
    },
    addGuest () {
      this.guest.push({
        guestId: '',
        guestName: '',
        guestPrepareContent: '',
        guestNote: ''
      })
    },
    deleteGuest (i) {
      console.table(this.guest)
      // this.guest = this.guest.slice(0, i).concat(this.guest.slice(i + 1));
      this.guest.splice(i, 1)
    },
    addMateriel () {
      this.materiel.push({
        materielName: '',
        materielNum: '',
        materielNote: ''
      })
    },
    deleteMateriel (i) {
      this.materiel.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
