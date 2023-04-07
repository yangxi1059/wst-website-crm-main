<!--
 * @Author: 库建华
 * @Date: 2020-07-01 10:31:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:49:44
 * @Version: 1
 * @Description:
-->
<!--
 * @Author: 库建华
 * @Date: 2020-06-23 13:26:00
 * @LastEditors: 库建华
 * @LastEditTime: 2020-06-29 17:08:30
 * @Version: 1
 * @Description:
-->
<template>
  <div class="brokerage">
    <el-dialog :close-on-click-modal="false"
      title="活动进度申请"
      :visible.sync="activityApplyVisible"
      width="1200px"
      :before-close="close"
    >
      <el-form
        :model="cacheActivityData"
        :rules="rules"
        ref="cacheActivityData"
        :inline="true"
        label-width="150px"
      >
        <!-- <el-divider>反馈</el-divider> -->
        <template v-if="activityData2.activityStatus == 'execute'">
          <el-form-item label="实际参与人数" prop="participantNum">
            <el-input-number
              :controls="false"
              :style="{width:'350px'}"
              v-model="cacheActivityData.participantNum"
              :maxlength="99"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="微信群人数" prop="wxGroupNum">
            <el-input-number
              :controls="false"
              :style="{width:'350px'}"
              v-model="cacheActivityData.wxGroupNum"
              :maxlength="99"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="合作方配合程度" prop="coordination">
            <el-input :style="{width:'350px'}" v-model="cacheActivityData.coordination"></el-input>
          </el-form-item>

          <el-form-item label="导流咨询人数" prop="consultNum">
            <el-input-number
              :controls="false"
              :style="{width:'350px'}"
              v-model="cacheActivityData.consultNum"
              :maxlength="99"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="签约人数" prop="signNum">
            <el-input-number
              :controls="false"
              :style="{width:'350px'}"
              v-model="cacheActivityData.signNum"
              :maxlength="99"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="活动经验总结" prop="experience">
            <el-input
              :style="{width:'350px'}"
              type="textarea"
              v-model="cacheActivityData.experience"
              :autosize="{minRows:3}"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              :style="{width:'350px'}"
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
          </el-form-item>
        </template>
        <!-- <el-form-item label="材料">
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
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import apiU from '@/api/user'
import api from '@/api/bd.js'
import mixins from '@/plugin/mixins'
import { uploadFunBySys } from '@/libs/file'
export default {
  props: {
    activityApplyVisible: {
      type: Boolean,
      default: false
    },
    activityData: {
      type: Object
    }
  },
  data: () => {
    return {
      activityData2: {},
      user: [],
      auditor: [],
      copy: [],
      orderData: [{}, {}],
      fileList: [],
      currencyType: null,
      note: '',
      payAccountId: '',
      expenditureAmount: 0,
      exchangeRate: 0,
      bill_currency_type: [],
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
      activityStatusApplyMap: {
        not_audit: 'prepare',
        prepare: 'execute',
        execute: 'finish'
      },
      activityStatusApply: {
        not_audit: '筹备',
        prepare: '执行',
        execute: '完成'
      },
      cacheActivityData: {},
      rules: {
        participantNum: [{ required: true, message: '必填', trigger: 'blur' }],
        wxGroupNum: [{ required: true, message: '必填', trigger: 'blur' }],
        coordination: [{ required: true, message: '必填', trigger: 'blur' }],
        consultNum: [{ required: true, message: '必填', trigger: 'blur' }],
        signNum: [{ required: true, message: '必填', trigger: 'blur' }],
        experience: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    activityApplyVisible: function (val) {
      if (val) {
        this.Topage()
        if (!this.user.length) {
          this.init()
          this.pageInit()
        }
      }
    }
  },
  mounted () {},
  mixins: [mixins],
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
    },
    init () {
      apiU.userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
        .then(({ data }) => {
          console.log(
            'userList...........................................',
            data
          )
          this.user = data.rows
        })
    },
    Topage () {
      api.getCooperatorActivityById(this.activityData.activityId).then(res => {
        console.log(res.data)
        this.activityData2 = res.data
        this.guest = res.data.guestArr || []
        for (let i = 0; i < this.guest.length; i++) {
          if (!this.guest[i].guestId) {
            this.guest[i].guestId = this.guest[i].guestName
          }
        }
        this.materiel = res.data.materielArr || []
      })
      apiDic
        .getAuditorListByApplyType('cooperator_activity_status_change')
        .then(res => {
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
    getRate () {
      apiDic.getRate({ currencyType: this.currencyType }).then(res => {
        this.exchangeRate = res.data ? res.data.exchangeRate : 1
      })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.expenditureAmount = null
      this.currencyType = null
      this.exchangeRate = 0
      this.note = null
      this.fileList = []
      this.$refs.upload1 && this.$refs.upload1.clearFiles()
      this.auditor = []
      this.copyTo = []
      this.cacheActivityData = {}
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      console.log(
        'submit',
        this.fileList,
        this.auditor,
        this.copy,
        this.activityData2
      )
      this.$refs.cacheActivityData.validate(valid => {
        if (!valid) {
          return
        }
        //   if (!this.fileList.length) {
        //   this.$message("凭证材料不能为空");
        //   return;
        // }
        const approval = []
        let cannot = false
        this.auditorList.forEach(aa => {
          if (!aa.auditor.length) {
            cannot = true
          }
          aa.auditor.forEach(v => {
            approval.push({ approverId: v })
          })
        })
        this.$loading()
        if (cannot) {
          this.$message({
            type: 'warning',
            message: '审核人都为必填！'
          })
          this.$loading().close()
          return
        }
        const copyTo = []
        this.copy.forEach(v => {
          copyTo.push({ copyTo: v })
        })
        const data = {
          keyId: this.activityData2.activityId,
          applyType: 'cooperator_activity_status_change',
          applyTitle: `BD[${this.activityData2.cooperatorName}]活动(${
            this.activityData2.activityName
          })的${
            this.activityStatusApply[this.activityData2.activityStatus]
          }申请`,
          copyTo: copyTo,
          approval: approval,
          content: {
            file: [],
            text: [
              {
                label: '活动方式',
                value: this.activityData2.activityWayName || '无'
              },
              {
                label: '活动名称',
                value: this.activityData2.activityName || '无'
              },
              {
                label: '合作商名称',
                value: this.activityData2.cooperatorName || '无'
              },
              {
                label: '活动经费类型',
                value: this.activityData2.expenditureTypeName || '无'
              },
              {
                label: '活动经费',
                value: this.activityData2.expenditure || '无'
              },
              {
                label: '内部负责人',
                value: this.activityData2.activityResponsiblePersonName || '无'
              },
              {
                label: '活动日期',
                value: this.activityData2.activityDate || '无'
              },
              {
                label: '活动开始时间',
                value: this.activityData2.activityBeginTime || '无'
              },
              {
                label: '活动结束时间',
                value: this.activityData2.activityEndTime || '无'
              },
              {
                label: '活动地点',
                value: this.activityData2.activityAddr || '无'
              },
              {
                label: '合作方对接人',
                value: this.activityData2.activityPrincipal || '无'
              },
              {
                label: '对接人联系方式',
                value: this.activityData2.activityPrincipalContact || '无'
              },
              {
                label: '线上方式',
                value: this.activityData2.onlineTypeName || '无'
              },
              {
                label: '预计参与人数',
                value: this.activityData2.expectParticipantNum || '无'
              },
              {
                label: '预计微信群人数',
                value: this.activityData2.expectWxGroupNum || '无'
              },
              {
                long: true,
                label: '活动性质',
                value: this.activityData2.activityProperty || '无'
              },
              {
                long: true,
                label: '活动流程',
                value: this.activityData2.activityProcess || '无'
              },
              {
                long: true,
                label: '合同对照内容',
                value: this.activityData2.contractRelatedContent || '无'
              },
              {
                label: '活动宣传手段',
                value: this.activityData2.publicityMeans || '无'
              },
              {
                label: '各部门需要的人数及职能',
                value: this.activityData2.manpowerAndPosition || '0'
              }
            ],
            info: {
              activityStatus: this.activityStatusApplyMap[
                this.activityData2.activityStatus
              ],
              activityId: this.activityData2.activityId
            }
          }
        }
        console.log(this.activityData2.needWxGroup, this.activityData2.needWxGroupOperation, 22222222222222)
        if (this.activityData2.needWxGroup == '1') {
          data.content.text.push(
            {
              label: '是否组微信群',
              value: this.activityData2.needWxGroup ? '是' : '否'
            },
            {
              label: '微信群名',
              value: this.activityData2.wxGroupName || '无'
            },
            {
              label: '导流微信号',
              value: this.activityData2.wxAccountName || '无'
            }

          )
        }
        if (this.activityData2.needWxGroupOperation == '1') {
          data.content.text.push(
            {
              label: '是否需要群运营',
              value: this.activityData2.needWxGroupOperation ? '是' : '否'
            },
            {
              label: '群运营人',
              value: this.activityData2.wxGroupOperation || '无'
            }
          )
        }
        toString.call(this.activityData2.guestArr) == '[object Array]' && this.activityData2.guestArr.forEach(v => {
          data.content.text.push({
            label: '[嘉宾]' + v.guestName,
            value: v.guestPrepareContent + '(' + (v.guestNote || '无备注') + ')'
          })
        })
        toString.call(this.activityData2.materielArr) == '[object Array]' && this.activityData2.materielArr.forEach(v => {
          data.content.text.push({
            label: '[物料]' + v.materielName,
            value: '数量：' + v.materielNum + '(' + (v.materielNote || '无备注') + ')'
          })
        })
        if (this.activityData2.activityStatus == 'execute') {
          data.content.info = {
            activityStatus: this.activityStatusApplyMap[
              this.activityData2.activityStatus
            ],
            activityId: this.activityData2.activityId,

            consultNum: this.cacheActivityData.consultNum,
            signNum: this.cacheActivityData.signNum,
            wxGroupNum: this.cacheActivityData.wxGroupNum,
            experience: this.cacheActivityData.experience,
            note: this.cacheActivityData.note,
            coordination: this.cacheActivityData.coordination,
            participantNum: this.cacheActivityData.participantNum,
            voucher: []
          }
          data.content.text.push(
            {
              label: '实际参与人数',
              value: this.cacheActivityData.participantNum || '无'
            },
            {
              label: '微信群人数',
              value: this.cacheActivityData.wxGroupNum || '无'
            },
            {
              label: '合作方配合程度',
              value: this.cacheActivityData.coordination || '无'
            },
            {
              label: '导流咨询人数',
              value: this.cacheActivityData.consultNum || '无'
            },
            {
              label: '签约人数',
              value: this.cacheActivityData.signNum || '无'
            },
            {
              label: '活动经验总结',
              value: this.cacheActivityData.experience || '无'
            },
            {
              label: '备注',
              value: this.cacheActivityData.note || '无'
            }
          )
        }
        if (this.fileList.length) {
          for (let i = this.fileList.length - 1; i >= 0; i--) {
            const file = this.fileList[i]
            uploadFunBySys(file.raw, 'voucher/db', url => {
              console.log(url)
              data.content.info.voucher.push({
                voucherName: file.name,
                voucherPath: url
              })
              data.content.file.push({
                name: file.name,
                url: url
              })
              if (data.content.info.voucher.length === this.fileList.length) {
                console.log('bd_contract参数', data)
                api.applyContractPayment(data).then(res => {
                  console.log('bd_contract，', res)
                  this.$loading().close()
                  this.$emit('submit')
                  this.clear()
                })
              }
            })
          }
        } else {
          console.log('data', data)
          api.applyContractPayment(data).then(res => {
            console.log('bd_contract，', res)
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
