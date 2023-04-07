<!--
 * @Author: 库建华
 * @Date: 2020-03-18 11:34:39
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-30 15:57:32
 * @Version:
 * @Description:
 -->

<template>
  <div class="internal-edit">
    <el-dialog :close-on-click-modal="false"
      :title="internalData.jobId ?'内推编辑':'新增内推'"
      :visible.sync="internalVisible"
      width="700px"
      :before-close="close"
    >
      <el-form
        class="ml20"
        :inline="true"
        ref="signTable"
        label-width="150px"
        label-position="right"
        :rules="rules"
        :model="internalData2"
      >
        <el-form-item label="公司" prop="companyId">
          <el-select  :style="{width:'380px'}" filterable v-model="internalData2.companyId">
            <el-option
              v-for="item in company_list"
              :key="item.companyId"
              :value="item.companyId"
              :label="item.companyName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称" prop="jobName">
          <el-input :style="{width:'380px'}" v-model="internalData2.jobName"></el-input>
        </el-form-item>
        <el-form-item label="岗位介绍" prop="jobInformation">
          <el-input
            type="textarea"
            :autosize="{minRows:3}"
            :style="{width:'380px'}"
            v-model="internalData2.jobInformation"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位需求" prop="jobRequirements">
          <el-input
            type="textarea"
            :autosize="{minRows:3}"
            :style="{width:'380px'}"
            v-model="internalData2.jobRequirements"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位数量" prop="jobCount">
          <el-input-number
            :max="999"
            :controls="false"
            :style="{width:'380px'}"
            v-model="internalData2.jobCount"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="申请季" prop="applySeason">
          <el-date-picker
            :style="{width:'380px'}"
            v-model="internalData2.applySeason"
            type="year"
            value-format="yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否有截止日期" prop="hasDeadLine">
          <el-select :style="{width:'380px'}" v-model="internalData2.hasDeadLine">
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" :prop="internalData2.hasDeadLine == '1' ? 'deadLine' :''">
          <el-date-picker :style="{width:'380px'}" v-model="internalData2.deadLine" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="Track" prop="track">
          <el-select
            :style="{width:'380px'}"
            v-model="internalData2.track"
            :multiple-limit="3"
            clearable
            multiple
          >
            <el-option
              v-for="item in track_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学历要求" prop="degree">
          <el-select
            :style="{width:'380px'}"
            v-model="internalData2.degree"
            :multiple-limit="3"
            clearable
            multiple
            @change="degreeChange"
          >
            <el-option
              v-for="item in degreeList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地区" prop="country">
          <el-select
            :style="{width:'380px'}"
            v-model="internalData2.country"
            clearable
            filterable
            @change="countryChange"
          >
            <el-option
              v-for="item in country_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop>
          <el-select :style="{width:'380px'}" v-model="internalData2.city" clearable filterable>
            <el-option
              v-for="item in city_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="管理人" prop="manageBy">
          <el-select :style="{width:'380px'}" v-model="internalData2.manageBy" clearable>
            <el-option
              v-for="item in user_list"
              :key="item.userId"
              :value="item.userId"
              :label="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="状态" prop="recordStatus">
          <el-select :style="{width:'380px'}" v-model="internalData2.recordStatus">
            <el-option
              v-for="item in internal_job_status"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位类型" prop="jobType">
          <el-select :style="{width:'380px'}" v-model="internalData2.jobType">
            <el-option
              v-for="item in internship_or_full_time"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="远程/实地" prop="locationType">
          <el-select :style="{width:'380px'}" v-model="internalData2.locationType">
            <el-option
              v-for="item in internship_location_type"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="官网展示" prop="displayStatus">
          <el-select :style="{width:'380px'}" v-model="internalData2.displayStatus">
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内推提供人" >
          <el-select filterable :style="{width:'380px'}" @change="changeProviderList" v-model="internalData2.providerId">
            <el-option
              v-for="item in providerList"
              :key="item.providerId"
              :value="item.providerId"
              :label="item.providerName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试费用" prop="interviewFee" v-if="internalData2.providerId">
          <el-select :style="{width:'100px'}" v-model="internalData2.interviewFeeType"  placeholder="" class="currency-select">
            <el-option
              v-for="item in currencyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input-number
            :style="{width:'280px'}"
            :controls="false"
            v-model="internalData2.interviewFee"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="offer费用" prop="offerFee" v-if="internalData2.providerId">
          <el-select :style="{width:'100px'}" v-model="internalData2.offerFeeType"  placeholder="" class="currency-select">
            <el-option
              v-for="item in currencyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input-number
            :style="{width:'280px'}"
            :controls="false"
            v-model="internalData2.offerFee"
          >
          </el-input-number>
        </el-form-item>
        <!-- <el-form-item label="项目备注" prop="internalNote">
          <el-input
            :style="{width:'380px'}"
            type="textarea"
            :autosize="{minRows:3}"
            v-model="internalData.internalNote"
          ></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'
import apiVip from '@/api/vip'
import mixins from '@/plugin/mixins'

export default {
  props: {
    internalVisible: {
      type: Boolean,
      default: false
    },
    internalData: {
      type: Object
    },
    userInfo: {
      type: Object
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      company_list: [],
      user_list: [],
      currencyList: [
        { label: '$', value: 'usd' },
        { label: '¥', value: 'cny' }
      ],
      city_list: [],
      country_list: [],
      track_list: [],
      internship_or_full_time: [],
      internship_location_type: [],
      common_yes_or_no: [],
      internal_job_status: [],
      degreeList: [],
      rules: {
        companyId: [{ required: true, message: '必填', trigger: 'blur' }],
        jobName: [{ required: true, message: '必填', trigger: 'blur' }],
        jobInformation: [{ required: true, message: '必填', trigger: 'blur' }],
        jobRequirements: [{ required: true, message: '必填', trigger: 'blur' }],
        jobCount: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        hasDeadLine: [{ required: true, message: '必填', trigger: 'blur' }],
        deadLine: [{ required: true, message: '必填', trigger: 'blur' }],
        recordStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        displayStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        track: [{ required: true, message: '必填', trigger: 'blur' }],
        degree: [{ required: true, message: '必填', trigger: 'blur' }],
        country: [{ required: true, message: '必填', trigger: 'blur' }],
        city: [{ required: true, message: '必填', trigger: 'blur' }],
        jobType: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewFee: [{ required: true, message: '必填', trigger: 'blur' }],
        offerFee: [{ required: true, message: '必填', trigger: 'blur' }],
        locationType: [{ required: true, message: '必填', trigger: 'blur' }]
        // manageBy: [{ required: true, message: "必填", trigger: "blur" }]
      },
      providerList: [],
      internalData2: {
        providerId: '',
        interviewFeeType: '',
        interviewFee: '',
        offerFeeType: '',
        offerFee: '',
        jobId: null,
        jobName: null,
        companyId: null,
        jobInformation: null,
        jobRequirements: null,
        applySeason: null,
        hasDeadLine: null,
        jobCount: null,
        // manageBy: null,
        recordStatus: null,
        displayStatus: null,
        deadLine: null,
        track: [],
        degree: [],
        country: null,
        city: null,
        jobType: null,
        locationType: null
      }
    }
  },
  watch: {
    internalVisible: function (val) {
      if (val) {
        this.initPage()
        this.catchData()
        this.getCity()
      }
    }
  },
  methods: {
    catchData () {
      const data = {
        companyId: ''
      }
      api.getProviderDropdown(data).then(res => {
        console.log(res.data)
        this.providerList = res.data
      })
      this.internalData2.jobId = this.internalData.jobId || null
      this.internalData2.jobName = this.internalData.jobName || null
      this.internalData2.companyId = this.internalData.companyId || null
      this.internalData2.offerFeeType = this.internalData.offerFeeType || null
      this.internalData2.offerFee = this.internalData.offerFee || null
      this.internalData2.interviewFeeType = this.internalData.interviewFeeType || null
      this.internalData2.interviewFee = this.internalData.interviewFee || null
      this.internalData2.providerId = this.internalData.providerId || null
      this.internalData2.jobInformation =
        this.internalData.jobInformation || null
      this.internalData2.jobRequirements =
        this.internalData.jobRequirements || null
      this.internalData2.applySeason = this.internalData.applySeason || null
      this.internalData2.hasDeadLine = this.internalData.hasDeadLine || null
      this.internalData2.jobCount = this.internalData.jobCount || null
      // this.internalData2.manageBy =
      // this.internalData.manageBy || this.userInfo.userId;
      this.internalData2.recordStatus = this.internalData.recordStatus || null
      this.internalData2.displayStatus =
        this.internalData.displayStatus || null
      this.internalData2.deadLine = this.internalData.deadLine || null
      // this.internalData2.track = this.internalData.track || null;
      this.internalData2.country = this.internalData.country || null
      this.internalData2.city = this.internalData.city || null
      this.internalData2.jobType = this.internalData.jobType || null
      this.internalData2.locationType = this.internalData.locationType || null
      this.internalData2.track =
        (this.internalData.tracks && this.internalData.tracks.split(',')) || []
      this.internalData2.degree =
      (this.internalData.degrees && this.internalData.degrees.split(',')) || []

      // this.internalData2.country =
      //   (this.internalData.country && this.internalData.country.split()) ||
      //   [];
    },
    initPage () {
      if (!this.company_list.length) {
        api.getCompanyDropdownList().then(res => {
          this.company_list = res.data
        })
        this.pageInit()
        api.getUserList('').then(res => {
          this.user_list = res.data
        })
      }
    },
    async pageInit () {
      this.degreeList = await this.getDictionary('degree')
      this.track_list = await this.getDictionary('track')
      this.degreeList.unshift({ itemName: '不限', itemValue: 'Unlimited' })
      this.country_list = await this.getDictionary('country')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.internal_job_status = await this.getDictionary('internal_job_status')
      this.internship_location_type = await this.getDictionary('internship_location_type')
    },
    close () {
      this.$emit('close')
      this.providerList = []
      this.internalData2 = {
        interviewFeeType: '',
        interviewFee: '',
        offerFeeType: '',
        offerFee: '',
        providerId: '',
        jobId: null,
        jobName: null,
        companyId: null,
        jobInformation: null,
        jobRequirements: null,
        applySeason: null,
        hasDeadLine: null,
        jobCount: null,
        recordStatus: null,
        displayStatus: null,
        deadLine: null,
        track: [],
        degree: [],
        country: null,
        city: null,
        jobType: null,
        locationType: null
        // manageBy: null
      }
      this.$refs.signTable.resetFields()
    },
    submit () {
      console.log('submit')
      this.$refs.signTable.validate(valid => {
        if (!valid) return
        if (this.internalData2.providerId && !(this.internalData2.offerFeeType && this.internalData2.interviewFeeType)) {
          this.$message({
            type: 'warning',
            message: '面试费用，offer费用货币类型必填 ！！'
          })
          return
        }
        if (
          this.internalData2.hasDeadLine == 1 &&
          !this.internalData2.deadLine
        ) {
          this.$message({
            type: 'warning',
            message: '有截止日期时，必填！'
          })
          return
        }
        const data = {
          jobName: this.internalData2.jobName,
          companyId: this.internalData2.companyId,
          jobInformation: this.internalData2.jobInformation,
          jobRequirements: this.internalData2.jobRequirements,
          country: this.internalData2.country,
          city: this.internalData2.city,
          jobType: this.internalData2.jobType,
          providerId: this.internalData2.providerId,
          offerFee: this.internalData2.offerFee,
          offerFeeType: this.internalData2.offerFeeType,
          interviewFee: this.internalData2.interviewFee,
          interviewFeeType: this.internalData2.interviewFeeType,
          locationType: this.internalData2.locationType,
          applySeason: this.internalData2.applySeason,
          hasDeadLine: this.internalData2.hasDeadLine,
          jobCount: this.internalData2.jobCount,
          recordStatus: this.internalData2.recordStatus,
          displayStatus: this.internalData2.displayStatus,
          deadLine: this.internalData2.deadLine,
          trackList: [],
          degreeList: []
        }
        this.internalData2.track.forEach(v => {
          data.trackList.push({ track: v })
        })
        this.internalData2.degree.forEach(v => {
          data.degreeList.push({ degree: v })
        })
        console.log(data)
        if (this.internalData.jobId) {
          data.jobId = this.internalData.jobId
          api.uptInternalJob(data).then(res => {
            console.log('更新', res)
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.close()
            this.$emit('submit')
          })
        } else {
          api.addInternalJob(data).then(res => {
            console.log('新增', res)
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.close()
            this.$emit('submit')
          })
        }
      })
    },
    countryChange () {
      this.internalData2.city = null
      this.getCity()
    },
    getCity () {
      if (!this.internalData2.country) {
        return
      }
      const params = {
        parentDic: 'country',
        parentItem: this.internalData2.country
      }
      api.getDicByParent(params).then(res => {
        console.log(res.data)
        this.city_list = res.data
      })
    },
    changeProviderList () {
      apiVip.getInternalJobDetail(this.internalData2.providerId).then(res => {
        console.log(res.data)
        this.internalData2.interviewFeeType = res.data.interviewFeeType || ''
        this.internalData2.interviewFee = res.data.interviewFee || null
        this.internalData2.offerFeeType = res.data.offerFeeType || ''
        this.internalData2.offerFee = res.data.offerFee || null
      })
    },
    degreeChange () {
      console.log(this.internalData2.degree)
      if (this.internalData2.degree.indexOf('Unlimited') != '-1') {
        this.internalData2.degree = ['Unlimited']
        for (let index = 1; index < this.degreeList.length; index++) {
          this.degreeList[index].disabled = true
        }
      } else {
        this.degreeList.map(item => {
          item.disabled = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
