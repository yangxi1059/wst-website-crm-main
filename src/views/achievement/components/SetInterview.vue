<!--
 * @Author: kaan
 * @Date: 2021-12-22 17:47:33
 * @LastEditors: kaan
 * @LastEditTime: 2022-03-11 17:21:11
 * @Version:
 * @Description:
-->
<template>
  <el-dialog
    :title="`学员【${interviewData.menteeName}】面试凭证有码${interviewData.type =='NM' ? '设置':'审核'}`"
    v-if="settingVisible"
    :visible.sync="settingVisible"
    :before-close="close"
    :close-on-click-modal="false"
    :width="interviewData.type =='NM' ? '550px':'1150px' "
  >
    <div class="set_container">
      <div class="set_list_content">
        <el-descriptions title="" :column="1" :contentStyle="{flex:1}" size="medium">
          <el-descriptions-item label="毕业于">{{interviewData.finishYear}}</el-descriptions-item>
          <el-descriptions-item label="学历">{{interviewData.degreeName}}</el-descriptions-item>
          <el-descriptions-item label="学校">{{interviewData.schoolChiName}}</el-descriptions-item>
          <el-descriptions-item label="专业">{{interviewData.majorName}}</el-descriptions-item>
        </el-descriptions>
        <ul class="set_img_content">
          <li class="set_img_item">
            <div class="mb10">面试凭证（有码）</div>
            <el-upload
              class="set_img_btn"
              v-if="(roleInfo.includes('vip_offer_list_img_up') || roleInfo.includes('interview_list_up')) && interviewData.type =='NM'"
              action
              :http-request="uploadFileAxios1"
              ref="elupload"
              :limit="1"
              :file-list="interviewFileList"
            >
              <el-button
              class="el-icon-upload"
              slot="trigger"
              size="mini"
              type="primary"
              plain
              >上传图片</el-button>
            </el-upload>
            <el-image
              style="width: 240px; height: 240px"
              fit="contain"
              :src="interviewVoucherHM"
              :preview-src-list="interviewHMList"
            >
              <div slot="error" class="image_slot">
                未上传面试凭证（有码）
              </div>
            </el-image>
          </li>
          <li class="set_img_item">
            <div class="mb10">面试凭证（无码）</div>
            <el-image
              style="width: 240px; height: 240px"
              fit="contain"
              :src="interviewVoucherNM"
              :preview-src-list="interviewNMList"
            >
              <div slot="error" class="image_slot">
                未上传面试凭证（无码）
              </div>
            </el-image>
          </li>
        </ul>
      </div>

      <div class="set_form_content" v-if="interviewData.type =='HM'">
        <el-form ref="form" :model="interviewData" :rules="rules" label-width="100px" :inline="true">
          <el-form-item label="审核" prop="checkStatus">
            <el-select :style="{width:widths}"  v-model="interviewData.checkStatus" placeholder="请选择">
              <el-option
                v-for="item in checkStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="官网显示" prop="displayStatus">
            <el-select :style="{width:widths}" v-model="interviewData.displayStatus" placeholder="请选择" :disabled="!(roleInfo.includes('vip_interView_hm_list_settingPcWatch') || roleInfo.includes('interView_hm_list_settingPcWatch')) " >
              <el-option
                v-for="item in displayStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习/全职:" prop="resultApply">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.resultApply"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internshipOrFullTime"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实习类型:" prop="internshipType" v-if="interviewData.resultApply == 0">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.internshipType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in internshipTypeList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="全职类型:" prop="fullTimeType" v-if="interviewData.resultApply == 1">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.fullTimeType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in fullTimeTypeList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="屏蔽学校:" prop="shield">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.shield"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in commonYesOrNo"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可宣传:" prop="publicStatus">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.publicStatus"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in commonYesOrNo"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司:" prop="company">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.company"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in companyList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门:" prop="division">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.division"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in divisionList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市:" prop="city">
            <el-select :style="{width:widths}" v-model="interviewData.city" filterable placeholder="请选择">
              <el-option
                v-for="item in cityList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-form-item>
            <el-form-item label="申请季:" prop="applySeason">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.applySeason"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in applySeasonList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="难易度:" prop="difficultyLevel">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.difficultyLevel"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in difficultyLevelList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="第几轮:" prop="times">
            <el-select
              :style="{width:widths}"
              v-model="interviewData.times"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in interviewRoundNo"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="面经提供人:" prop="storyBy">
             <el-select
              :style="{width:widths}"
              filterable
              v-model="interviewData.storyBy"
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
          <el-form-item label="面经显示" prop="displayStatus">
            <el-select :style="{width:widths}" v-model="interviewData.storyStatus"
            placeholder="请选择" :disabled="!(roleInfo.includes('vip_interview_hm_list_changeStoryStatus') || roleInfo.includes('interview_hm_list_changeStoryStatus'))" >
              <el-option
                v-for="item in displayStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <br>

          <el-form-item label="面经" prop="story">
            <el-input
              :style="{width:'430px'}"
              type="textarea"
              :autosize="{minRows:3}"
              v-model="interviewData.story"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              :style="{width:'430px'}"
              type="textarea"
              :autosize="{minRows:3}"
              v-model="interviewData.checkNote"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/achievement.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import files from '@/libs/file'
import { mapState } from 'vuex'
export default {
  name: 'setting',
  mixins: [mixins],
  props: {
    settingVisible: {
      type: Boolean,
      default: false
    },
    interviewObjData: {
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
      interviewData: {},
      interviewFileList: [],
      interviewUrlHM: '',
      interviewVoucherHM: '',
      interviewHMList: [],
      interviewVoucherNM: '',
      interviewNMList: [],

      widths: '160px',
      internshipOrFullTime: [],
      interviewTypeList: [],
      internshipTypeList: [],
      fullTimeTypeList: [],
      commonYesOrNo: [],
      companyList: [],
      divisionList: [],
      cityList: [],
      applySeasonList: [],
      interviewRoundNo: [],
      users: [],
      checkStatusList: [
        { itemName: '未核验', itemValue: '0' },
        { itemName: '已核验', itemValue: '1' },
        { itemName: '未通过', itemValue: '2' }
      ],
      displayStatusList: [
        { itemName: '不显示', itemValue: '0' },
        { itemName: '显示', itemValue: '1' }
      ],
      difficultyLevelList: [
        { itemName: '难度一', itemValue: '1' },
        { itemName: '难度二', itemValue: '2' },
        { itemName: '难度三', itemValue: '3' },
        { itemName: '难度四', itemValue: '4' },
        { itemName: '难度五', itemValue: '5' }
      ],
      rules: {
        checkStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        resultApply: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipType: [{ required: true, message: '必填', trigger: 'blur' }],
        fullTimeType: [{ required: true, message: '必填', trigger: 'blur' }],
        shield: [{ required: true, message: '必填', trigger: 'blur' }],
        company: [{ required: true, message: '必填', trigger: 'blur' }],
        division: [{ required: true, message: '必填', trigger: 'blur' }],
        city: [{ required: true, message: '必填', trigger: 'blur' }],
        difficultyLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        times: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        // story: [{ required: true, message: "必填", trigger: "blur" }],
        // storyBy: [{ required: true, message: "必填", trigger: "blur" }],
        // displayStatus: [{ required: true, message: "必填", trigger: "blur" }],
        publicStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    settingVisible: async function (val) {
      if (val) {
        this.interviewData = JSON.parse(JSON.stringify(this.interviewObjData))
        console.log(this.interviewData)
        if (this.interviewData.resultVoucher) {
          files.getImgUrl(this.interviewData.resultVoucher, url => (
            this.interviewVoucherNM = url,
            this.interviewNMList = [url]
          ))
        }
        if (this.interviewData.resultVoucherMosaic) {
          files.getImgUrl(this.interviewData.resultVoucherMosaic, url => (
            this.interviewUrlHM = this.interviewData.resultVoucherMosaic,
            this.interviewVoucherHM = url,
            this.interviewHMList = [url]
          ))
        }
        if (this.interviewData.type == 'HM') {
          this.interviewTypeList = await this.getDictionary('interview_type')
        }
        this.pageInit()
      }
    }
  },
  methods: {
    async pageInit () {
      apiDic.getUserList().then(({ data }) => {
        console.log('人员列表', data)
        this.users = data
      })
      this.internshipOrFullTime = await this.getDictionary('internship_or_full_time')
      this.internshipTypeList = await this.getDictionary('internship_type')
      this.fullTimeTypeList = await this.getDictionary('full_time_type')
      this.commonYesOrNo = await this.getDictionary('common_yes_or_no')
      this.companyList =  await this.getCompany()
      this.divisionList = await this.getDictionary('division')
      this.cityList = await this.getDictionary('city')
      this.applySeasonList = await this.getDictionary('apply_season')
      this.interviewRoundNo = await this.getDictionary('interview_round_no')
    },
    /**
     * @description: 好评图有码上传
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    uploadFileAxios1 (file, fileList) {
      var testmsg = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: '上传文件只能是图片（png,jpg,jpeg）!',
          type: 'warning'
        })
        this.$refs.elupload.clearFiles()
        return false
      }
      this.interviewFileList = []
      files.uploadFunBySys(file.file, `voucher/interview_list_hm/${this.interviewData.pkId}`,
        url => {
          this.interviewUrlHM = url
          files.getImgUrl(url, url => (
            this.interviewVoucherHM = url,
            this.interviewHMList = [url]
          ))
          this.$refs.elupload.clearFiles()
        }
      )
    },
    submit () {
      if (this.interviewUrlHM == '' || !this.interviewData.resultVoucher) {
        this.$message.warning('请上传面试凭证')
        return
      }
      const data = {
        pkId: this.interviewData.pkId,
        signId: this.interviewData.signId
      }
      if (this.interviewData.type == 'HM') {
        // CRM1.0中Offer状态变为已核验，是否需要清空备注，保留备注时需要添加menteeInfo{menteeId,community}对象更新社区
        this.$refs.form.validate(valid => {
          if (!valid) return
          const hmData = {
            checkStatus: this.interviewData.checkStatus,
            displayStatus: this.interviewData.displayStatus,
            resultApply: this.interviewData.resultApply,
            internshipType: this.interviewData.resultApply == '0' ? this.interviewData.internshipType : '',
            fullTimeType: this.interviewData.resultApply == '1' ? this.interviewData.fullTimeType : '',
            times: this.interviewData.times,
            storyBy: this.interviewData.storyBy,
            storyStatus: this.interviewData.storyStatus,
            difficultyLevel: this.interviewData.difficultyLevel,
            shield: this.interviewData.shield,
            publicStatus: this.interviewData.publicStatus,
            company: this.interviewData.company,
            division: this.interviewData.division,
            city: this.interviewData.city,
            applySeason: this.interviewData.applySeason,
            story: this.interviewData.story,
            checkNote: this.interviewData.checkNote
          }
          Object.assign(data, data, hmData)
        })
      }
      if (this.interviewData.type == 'NM') {
        data.resultVoucherMosaic = this.interviewUrlHM
      }
      console.log(data)
      api.setOfferV2ListBySignId(data).then(res => {
        if (res.code == '200') {
          this.$message.success('提交成功')
          this.clear()
          this.$emit('submit')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      Object.assign(this.$data, this.$options.data())
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
</style>
