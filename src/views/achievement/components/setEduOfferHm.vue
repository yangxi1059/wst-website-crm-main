<!--
 * @Author: 库建华
 * @Date: 2020-03-09 16:06:07
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-28 17:44:45
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :title="'升学Offer有码设置'"
      :visible.sync="settingVisible"
      :close-on-click-modal="false"
      width="1190px"
      :before-close="close"
    >

      <div class="set_container">
        <div class="set_list_content">
          <el-descriptions title="" :column="1" :contentStyle="{flex:1}" size="medium">
            <el-descriptions-item label="学员名">{{offerData2.menteeName}}</el-descriptions-item>
            <el-descriptions-item label="升学学校">{{offerData2.chiName}}</el-descriptions-item>
            <el-descriptions-item label="专业">{{offerData2.majorName}}</el-descriptions-item>
            <el-descriptions-item label="sales已用">{{offerData2.salesUsed == '1'?'是':'否'}}</el-descriptions-item>
            <el-descriptions-item label="mkt已用（副贴）">{{offerData2.mktUsed == '1'?'是':'否'}}</el-descriptions-item>
            <el-descriptions-item label="mkt已用（文章）">{{offerData2.mktUsedArticle == '1'?'是':'否'}}</el-descriptions-item>
          </el-descriptions>
          <ul class="set_img_content">
            <li class="set_img_item">
              <div class="mb10">Offer凭证（有码）</div>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="resultVoucherMosaic"
                :preview-src-list="resultVoucherMosaicList"
              >
                <div slot="error" class="image_slot">
                  未上传Offer凭证（有码）
                </div>
              </el-image>
            </li>
            <li class="set_img_item">
              <div class="mb10">Offer凭证（无码）</div>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="resultVoucher"
                :preview-src-list="resultVoucherList"
              >
                <div slot="error" class="image_slot">
                  未上传Offer凭证（无码）
                </div>
              </el-image>
            </li>
            <li class="set_img_item">
              <div class="mb10">好评图（有码）</div>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="praiseVoucherMosaic"
                :preview-src-list="praiseVoucherMosaicList"
              >
                <div slot="error" class="image_slot">
                  未上传好评图（有码）
                </div>
              </el-image>
            </li>
            <li class="set_img_item">
              <div class="mb10">好评图（无码）</div>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="praiseVoucher"
                :preview-src-list="praiseVoucherList"
              >
                <div slot="error" class="image_slot">
                  未上传好评图（无码）
                </div>
              </el-image>
            </li>
          </ul>
        </div>
        <div class="set_form_content">
          <el-form :inline="true" label-width="130px" ref="form" :model="offerData2" :rules="rules">
            <el-form-item label="审核" prop="checkStatus">
              <el-select :style="{width:'160px'}" v-model="offerData2.checkStatus" placeholder="请选择">
                <el-option
                  v-for="item in checkStatusS"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="官网显示" prop="displayStatus">
              <el-select :style="{width:'160px'}" v-model="offerData2.displayStatus" placeholder="请选择" v-if="roleInfo.includes('vip_offer_hm_edu_list_settingPcWatch')" >
                <el-option
                  v-for="item in displayStatusS"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <el-select :style="{width:'160px'}" v-model="offerData2.displayStatus" placeholder="请选择" v-else disabled>
                <el-option
                  v-for="item in displayStatusS"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业项目:" prop="entranceOfferProgram">
              <el-select
                :style="{width:'160px'}"
                v-model="offerData2.entranceOfferProgram"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in entrance_offer_program"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目周期:" prop="programPeriod">
              <el-input v-model="offerData2.programPeriod" :style="{width:'160px'}" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="准备周期（月）:" prop="prepareMonth">
              <el-select
                :style="{width:'160px'}"
                v-model="offerData2.prepareMonth"
                filterable
                placeholder="请选择"
              >
                <el-option v-for="item in 36" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="获得offer日期:" prop="offerReceiveDate">
              <el-date-picker
                :style="{width:'160px'}"
                value-format="yyyy-MM-dd"
                v-model="offerData2.offerReceiveDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="屏蔽学生学校:" prop="shield">
              <el-select
                :style="{width:'160px'}"
                v-model="offerData2.shield"
                filterable
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
            <el-form-item label="可宣传:" prop="publicStatus">
              <el-select
                :style="{width:'160px'}"
                v-model="offerData2.publicStatus"
                filterable
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
            <el-form-item label="申请季:" prop="applySeason">
              <el-select
                :style="{width:'160px'}"
                v-model="offerData2.applySeason"
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
            <el-form-item label="小故事" prop="story">
              <el-input
                :style="{width:'460px'}"
                type="textarea"
                :autosize="{minRows:3}"
                v-model="offerData2.story"
              ></el-input>
            </el-form-item>
            <el-form-item label="Offer备注">
              <el-input
                :style="{width:'460px'}"
                type="textarea"
                :autosize="{minRows:3}"
                v-model="offerData2.remark"
              ></el-input>
            </el-form-item>
            <el-form-item label="核验备注">
              <el-input
                :style="{width:'460px'}"
                type="textarea"
                :autosize="{minRows:3}"
                v-model="offerData2.checkNote"
              ></el-input>
            </el-form-item>
            <div v-if="offerData2.mktUsedArticle == '1' || offerData2.mktUsed == '1'">
              <div class="colorR mb10 remark">MKT标记已用，Offer修改需要经过审核</div>
              <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
                <el-select
                  :style="{width:'160px'}"
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
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import { getImgUrl } from '@/libs/file'
import { mapState } from 'vuex'

export default {
  name: 'setting',
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
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      company: [],
      division: [],
      city: [],
      apply_season: [],
      resultVoucherMosaic: '',
      praiseVoucherMosaic: '',
      resultVoucher: '',
      praiseVoucher: '',
      resultVoucherMosaicList: [],
      praiseVoucherMosaicList: [],
      resultVoucherList: [],
      praiseVoucherList: [],
      internship_or_full_time: [],
      entrance_offer_program: [],
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
      offerData2: {},
      checkStatusS: [
        {
          itemName: '未核验',
          itemValue: '0'
        },
        {
          itemName: '已核验',
          itemValue: '1'
        },
        {
          itemName: '未通过',
          itemValue: '2'
        }
      ],
      displayStatusS: [
        {
          itemName: '不显示',
          itemValue: '0'
        },
        {
          itemName: '显示',
          itemValue: '1'
        }
      ],
      common_yes_or_no: [
        {
          itemName: '是',
          itemValue: '1'
        },
        {
          itemName: '否',
          itemValue: '0'
        }
      ],
      rules: {
        checkStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        displayStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        programPeriod: [{ required: true, message: '必填', trigger: 'blur' }],
        entranceOfferProgram: [{ required: true, message: '必填', trigger: 'blur' }],
        resultApply: [{ required: true, message: '必填', trigger: 'blur' }],
        offerSalary: [{ required: true, message: '必填', trigger: 'blur' }],
        prepareMonth: [{ required: true, message: '必填', trigger: 'blur' }],
        offerReceiveDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        shield: [{ required: true, message: '必填', trigger: 'blur' }],
        company: [{ required: true, message: '必填', trigger: 'blur' }],
        division: [{ required: true, message: '必填', trigger: 'blur' }],
        city: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        story: [{ required: true, message: '必填', trigger: 'blur' }],
        publicStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    settingVisible: function (val) {
      if (val) {
        this.offerData2 = JSON.parse(JSON.stringify(this.offerData))
        this.checkStatus = this.offerData2.checkStatus
        this.displayStatus = this.offerData2.displayStatus
        this.checkNote = this.offerData2.checkNote
        this.initPage()
        if (!this.company.length) {
          this.init()
          this.pageInit()
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.division = await this.getDictionary('division')
      this.city = await this.getDictionary('city')
      this.apply_season = await this.getDictionary('apply_season')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.entrance_offer_program = await this.getDictionary('entrance_offer_program')
      this.company = await this.getCompany()
      apiDic.getAuditorListByApplyType('entrance_offer_edit').then(res => {
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
    init () {
     
    },
    initPage () {
      this.offerData2.resultVoucher =
        this.offerData2.resultVoucher || this.offerData2.offerVoucher
      this.offerData2.resultVoucherMosaic =
        this.offerData2.resultVoucherMosaic || this.offerData2.offerVoucherMosaic
      if (
        !(
          this.offerData2.resultVoucher &&
          this.offerData2.resultVoucherMosaic &&
          this.offerData2.praiseVoucher &&
          this.offerData2.praiseVoucherMosaic
        )
      ) {
        this.$message({
          type: 'error',
          message: '凭证或好评图不全'
        })
        this.close()
        return
      }
      getImgUrl(
        this.offerData2.resultVoucher,
        url => (this.resultVoucher = url,
        this.resultVoucherList = [url])
      )
      getImgUrl(
        this.offerData2.praiseVoucher,
        url => (this.praiseVoucher = url,
        this.praiseVoucherList = [url])
      )
      getImgUrl(
        this.offerData2.resultVoucherMosaic,
        url => (this.resultVoucherMosaic = url,
        this.resultVoucherMosaicList = [url]
        )
      )
      getImgUrl(
        this.offerData2.praiseVoucherMosaic,
        url => (this.praiseVoucherMosaic = url,
        this.praiseVoucherMosaicList = [url])
      )
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (!this.offerData2.offerVoucher && this.offerData2.offerSalary == null) {
          this.$message({
            type: 'error',
            message: '求职offer,请填写年薪'
          })
          return
        }
        if (this.offerData2.mktUsedArticle == '1' || this.offerData2.mktUsed == '1') {
          this.submitMKT()
          // this.$message.error('此记录为MKT已用，请联系MKT同事取消已用状态后再提交')
          return
        }
        const subData =
          {
            pkId: this.offerData2.pkId,
            checkStatus: this.offerData2.checkStatus,
            displayStatus: this.offerData2.displayStatus,
            entranceOfferProgram: this.offerData2.entranceOfferProgram,
            programPeriod: this.offerData2.programPeriod,
            resultApply: this.offerData2.resultApply,
            offerSalary: this.offerData2.offerSalary,
            prepareMonth: this.offerData2.prepareMonth,
            offerReceiveDate: this.offerData2.offerReceiveDate,
            shield: this.offerData2.shield,
            publicStatus: this.offerData2.publicStatus,
            company: this.offerData2.company,
            division: this.offerData2.division,
            city: this.offerData2.city,
            applySeason: this.offerData2.applySeason,
            story: this.offerData2.story,
            checkNote: this.offerData2.checkNote,
            remark: this.offerData2.remark
          }
        if (this.offerData2.checkStatus == '1' && this.offerData2.checkNote) {
          this.$confirm('此操作将会使Offer状态变为已核验，是否需要清空备注?', '提示', {
            confirmButtonText: '清空备注',
            cancelButtonText: '保留备注',
            distinguishCancelAndClose: true,
            type: 'warning'
          }).then(() => {
            subData.checkNote = ''
            console.log(subData)
            if (this.offerData2.offerVoucher) {
              api.setOfferEduV2(subData).then(res => {
                console.log(res)
                this.$emit('submit')
                this.clear()
                this.$message({
                  type: 'success',
                  message: '升学offer更新成功'
                })
              })
            } else {
              subData.menteeInfo = {
                menteeId: this.offerData2.menteeId,
                community: this.offerData2.community
              }
              const data = {
                uptList: [subData]
              }
              console.log(data)
              api.setOfferV2ListBySignId(subData).then(res => {
                console.log(res)
                this.$emit('submit')
                this.clear()
                this.$message({
                  type: 'success',
                  message: '求职offer更新成功'
                })
              })
            }
          }).catch((action) => {
            console.log(subData)
            if (action == 'cancel') {
              if (this.offerData2.offerVoucher) {
                api.setOfferEduV2(subData).then(res => {
                  console.log(res)
                  this.$emit('submit')
                  this.clear()
                  this.$message({
                    type: 'success',
                    message: '升学offer更新成功'
                  })
                })
              } else {
                subData.menteeInfo = {
                  menteeId: this.offerData2.menteeId,
                  community: this.offerData2.community
                }
                const data = {
                  uptList: [subData]
                }
                console.log(data)
                api.setOfferV2ListBySignId(subData).then(res => {
                  console.log(res)
                  this.$emit('submit')
                  this.clear()
                  this.$message({
                    type: 'success',
                    message: '求职offer更新成功'
                  })
                })
              }
            } else {
              console.log('单纯的关闭')
            }
          })
        } else {
          if (this.offerData2.offerVoucher) {
            console.log(subData)
            api.setOfferEduV2(subData).then(res => {
              console.log(res)
              this.$emit('submit')
              this.clear()
              this.$message({
                type: 'success',
                message: '升学offer更新成功'
              })
            })
          } else {
            subData.menteeInfo = {
              menteeId: this.offerData2.menteeId,
              community: this.offerData2.community
            }
            const data = {
              uptList: [subData]
            }
            console.log(data)
            api.setOfferV2ListBySignId(subData).then(res => {
              console.log(res)
              this.$emit('submit')
              this.clear()
              this.$message({
                type: 'success',
                message: '求职offer更新成功'
              })
            })
          }
        }
      })
    },
    submitMKT(){
      let approval = []
      let cannot = false
      this.auditorList.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true
        }
        aa.auditor.forEach(v => {
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
      let uploadFileList = [
        {name:"Offer凭证（有码）",url:this.offerData.resultVoucherMosaic},
        {name:"Offer凭证（无码）",url:this.offerData.resultVoucher},
        {name:"好评图（有码）",url:this.offerData.praiseVoucherMosaic},
        {name:"好评图（无码）",url:this.offerData.praiseVoucher}
      ]
      let data = {}
      data = {
        applyType: 'entrance_offer_edit',
        applyTitle: `学员${this.offerData2.menteeName}的升学offer修改`,
        approval: approval,
        keyId: this.offerData2.pkId,
        voucher: uploadFileList.map(v => {
          return { voucherName: v.name, voucherPath: v.url }
        }),
        content: {
          file: uploadFileList,
          text: [
            {
              label: '学员名',
              value: this.offerData2.menteeName
            },
            {
              label: '升学学校',
              value: this.offerData2.schoolChiName
            },
            {
              label: '专业',
              value: this.offerData2.majorName
            },
            {
              label: 'sales已用',
              value: this.offerData2.salesUsed == '1'?'是':'否'
            },
            {
              label: 'mkt已用（副贴）',
              value: this.offerData2.mktUsed == '1'?'是':'否'
            },
            {
              label: 'mkt已用（文章）',
              value: this.offerData2.mktUsedArticle == '1'?'是':'否'
            }
          ],
          info: {
            pkId: this.offerData2.pkId,
            taskId: this.offerData2.pkId,
            checkStatus: this.offerData2.checkStatus,
            displayStatus: this.offerData2.displayStatus,
            entranceOfferProgram: this.offerData2.entranceOfferProgram,
            programPeriod: this.offerData2.programPeriod,
            prepareMonth: this.offerData2.prepareMonth,
            offerReceiveDate: this.offerData2.offerReceiveDate,
            shield: this.offerData2.shield,
            publicStatus: this.offerData2.publicStatus,
            applySeason: this.offerData2.applySeason,
            story: this.offerData2.story,
            remark: this.offerData2.remark,
            checkNote: this.offerData2.checkNote,
          }
        }
      }
      let updateList = []
      if(this.offerData2.checkStatus == this.offerData.checkStatus){
        updateList.push({
          label:"审核",
          value:this.checkStatusS.filter((v) => v.itemValue == this.offerData2.checkStatus)[0].itemName
        })
      }else{
        let vb = this.checkStatusS.filter((v) => v.itemValue == this.offerData.checkStatus)[0]
        updateList.push({
          label:"审核（修改前）",
          value:vb ? vb.itemName :''
        })
        updateList.push({
          label:"审核（修改后）",
          value:this.checkStatusS.filter((v) => v.itemValue == this.offerData2.checkStatus)[0].itemName
        })
      }
      if(this.offerData2.displayStatus == this.offerData.displayStatus){
        updateList.push({
          label:"官网显示",
          value:this.displayStatusS.filter((v) => v.itemValue == this.offerData2.displayStatus)[0].itemName
        })
      }else{
        let vb = this.displayStatusS.filter((v) => v.itemValue == this.offerData.displayStatus)[0]
        updateList.push({
          label:"官网显示（修改前）",
          value:vb ? vb.itemName :''
        })
        updateList.push({
          label:"官网显示（修改后）",
          value:this.displayStatusS.filter((v) => v.itemValue == this.offerData2.displayStatus)[0].itemName
        })
      }
      if(this.offerData2.entranceOfferProgram == this.offerData.entranceOfferProgram){
        updateList.push({
          label:"专业项目",
          value:this.entrance_offer_program.filter((v) => v.itemValue == this.offerData2.entranceOfferProgram)[0].itemName
        })
      }else{
        let vb = this.entrance_offer_program.filter((v) => v.itemValue == this.offerData.entranceOfferProgram)[0]
        updateList.push({
          label:"专业项目（修改前）",
          value:vb ? vb.itemName :''
        })
        updateList.push({
          label:"专业项目（修改后）",
          value:this.entrance_offer_program.filter((v) => v.itemValue == this.offerData2.entranceOfferProgram)[0].itemName
        })
      }
      if(this.offerData2.programPeriod == this.offerData.programPeriod){
        updateList.push({
          label:"项目周期",
          value:this.offerData2.programPeriod
        })
      }else{
        updateList.push({
          label:"项目周期（修改前）",
          value:this.offerData.programPeriod
        })
        updateList.push({
          label:"项目周期（修改后）",
          value:this.offerData2.programPeriod
        })
      }
      if(this.offerData2.prepareMonth == this.offerData.prepareMonth){
        updateList.push({
          label:"准备周期（月）",
          value:this.offerData2.prepareMonth
        })
      }else{
        updateList.push({
          label:"准备周期（月）（修改前）",
          value:this.offerData.prepareMonth
        })
        updateList.push({
          label:"准备周期（月）（修改后）",
          value:this.offerData2.prepareMonth
        })
      }
      if(this.offerData2.offerReceiveDate == this.offerData.offerReceiveDate){
        updateList.push({
          label:"获得offer日期",
          value:this.offerData2.offerReceiveDate
        })
      }else{
        updateList.push({
          label:"获得offer日期（修改前）",
          value:this.offerData.offerReceiveDate
        })
        updateList.push({
          label:"获得offer日期（修改后）",
          value:this.offerData2.offerReceiveDate
        })
      }
      if(this.offerData2.shield == this.offerData.shield){
        updateList.push({
          label:"屏蔽学生学校",
          value:this.common_yes_or_no.filter((v) => v.itemValue == this.offerData2.shield)[0].itemName
        })
      }else{
        let vb = this.common_yes_or_no.filter((v) => v.itemValue == this.offerData.shield)[0]
        updateList.push({
          label:"屏蔽学生学校（修改前）",
          value:vb ? vb.itemName :''
        })
        updateList.push({
          label:"屏蔽学生学校（修改后）",
          value:this.common_yes_or_no.filter((v) => v.itemValue == this.offerData2.shield)[0].itemName
        })
      }
      if(this.offerData2.publicStatus == this.offerData.publicStatus){
        updateList.push({
          label:"可宣传",
          value:this.common_yes_or_no.filter((v) => v.itemValue == this.offerData2.publicStatus)[0].itemName
        })
      }else{
        let vb = this.common_yes_or_no.filter((v) => v.itemValue == this.offerData.publicStatus)[0]
        updateList.push({
          label:"可宣传（修改前）",
          value:vb ? vb.itemName :''
        })
        updateList.push({
          label:"可宣传（修改后）",
          value:this.common_yes_or_no.filter((v) => v.itemValue == this.offerData2.publicStatus)[0].itemName
        })
      }
      if(this.offerData2.applySeason == this.offerData.applySeason){
        updateList.push({
          label:"申请季",
          value:this.apply_season.filter((v) => v.itemValue == this.offerData2.applySeason)[0].itemName
        })
      }else{
        let vb = this.apply_season.filter((v) => v.itemValue == this.offerData.applySeason)[0]
        updateList.push({
          label:"申请季（修改前）",
          value:vb ? vb.itemName :''
        })
        updateList.push({
          label:"申请季（修改后）",
          value:this.apply_season.filter((v) => v.itemValue == this.offerData2.applySeason)[0].itemName
        })
      }
      if(this.offerData2.story == this.offerData.story){
        updateList.push({
          label:"小故事",
          value:this.offerData2.story
        })
      }else{
        updateList.push({
          label:"小故事（修改前）",
          value:this.offerData.story
        })
        updateList.push({
          label:"小故事（修改后）",
          value:this.offerData2.story
        })
      }
      if(this.offerData2.remark == this.offerData.remark){
        updateList.push({
          label:"Offer备注",
          value:this.offerData2.remark
        })
      }else{
        updateList.push({
          label:"Offer备注（修改前）",
          value:this.offerData.remark
        })
        updateList.push({
          label:"Offer备注（修改后）",
          value:this.offerData2.remark
        })
      }
      if(this.offerData2.checkNote == this.offerData.checkNote){
        updateList.push({
          label:"核验备注",
          value:this.offerData2.checkNote
        })
      }else{
        updateList.push({
          label:"核验备注（修改前）",
          value:this.offerData.checkNote
        })
        updateList.push({
          label:"核验备注（修改后）",
          value:this.offerData2.checkNote
        })
      }
      data.content.text = data.content.text.concat(updateList)
      console.log(data)
      api.setRefund(data).then(res => {
        this.$message.success('申请成功！！')
        this.$emit('submit')
        this.clear()
      })
    },
    clear () {
      this.resultVoucherMosaic = ''
      this.praiseVoucherMosaic = ''
      this.resultVoucher = ''
      this.praiseVoucher = ''
      // this.$refs.form && this.$refs.form.resetFields()
      this.resultVoucherMosaicList = []
      this.praiseVoucherMosaicList = []
      this.resultVoucherList = []
      this.praiseVoucherList = []
      this.offerData2 = {}
    },
    close () {
      this.clear()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.set_container{
  display: flex;
  .set_list_content{
    width:550px;
  }
  .set_img_content{
    width:100%;
    .set_img_item{
      position: relative;
      width:50%;
      display: inline-block;
      ::v-deep .image_slot{
        width:100%;
        height:100%;
        background: #eee;
        text-align: center;
        padding-top:45%
      }
    }
    .set_img_btn{
      position:absolute;
      top:0;
      right:15px;
    }
  }
  .set_form_content{
    flex: 1;
  }
}
.remark{
  width:100%;
  text-align:center
}
</style>