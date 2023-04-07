<!--
 * @Author: 杨曦
 * @Date: 2022-08-29 10:34:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-30 17:32:37
 * @Version:
 * @Description:
-->
<template>
  <div class="internal-edit ">
    <el-dialog v-loading="loading" :title="'内推提供人详情'" append-to-body :close-on-click-modal="false" :visible.sync="addVisible" width="640px" :before-close="close">
      <div v-loading="loading2">
        <div >
          <el-input class="mb20 mr10 input-with-select"
            size="mini"
            v-model="wxId"
            clearable
            placeholder="输入微信id"
            @change="changeSearch()"
            @keyup.enter.native="searchByWxId()"
            :style="{width:'260px'}" >
            <el-button slot="append" size="mini" @click="searchByWxId()" icon="el-icon-search">检索</el-button>
          </el-input>
          <el-button @click="addOther()" v-if="status" type="success">创建其他内推提供人</el-button>
        </div>
        <div class="yx_descriptions"  v-if="providerArr.length > 0">
          <el-descriptions class="mb10 yx_4" direction="vertical" v-for="(internalData,i) in providerArr" :key="i" size="mini" :column="2" border>
            <el-descriptions-item label="供应人姓名">{{internalData.providerName}}</el-descriptions-item>
            <el-descriptions-item label="供应人类型">{{internalData.providerTypeName}}</el-descriptions-item>
            <el-descriptions-item label="微信">{{internalData.wxId}}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{internalData.email}}</el-descriptions-item>
            <el-descriptions-item label="公司名">{{internalData.companyName}}</el-descriptions-item>
            <el-descriptions-item label="供应人状态">{{internalData.providerStatusName}}</el-descriptions-item>
            <el-descriptions-item label="面试费用货币">{{internalData.interviewFeeType}}</el-descriptions-item>
            <el-descriptions-item label="面试费用">{{internalData.interviewFee}}</el-descriptions-item>
            <el-descriptions-item label="offer费用货币">{{internalData.offerFeeType}}</el-descriptions-item>
            <el-descriptions-item label="offer费用金额">{{internalData.offerFee}}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{internalData.createTime}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{internalData.updateTime}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="yx_descriptions"  v-if="mentorArr.length > 0">
          <el-descriptions class="mb10 yx_3" direction="vertical" v-for="(internalData,i) in mentorArr" :key="i" size="mini" :column="2" border>
            <el-descriptions-item label="导师ID">{{internalData.mentorId}}</el-descriptions-item>
            <el-descriptions-item label="导师名">{{internalData.mentorName}}</el-descriptions-item>
            <el-descriptions-item label="公司名">{{internalData.companyName}}</el-descriptions-item>
            <el-descriptions-item label="微信">{{internalData.wxId}}</el-descriptions-item>
            <el-descriptions-item label="操作">
              <el-button type="primary" size="mini" @click="addMentor(internalData)">新增导师内推提供人</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
    <formAddInternalJob :formVisible="formVisible" :internalData1="internalData" @close="formClose" @submit="formSubmit" />
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import formAddInternalJob from './formAddInternalJob.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { formAddInternalJob },
  data: () => {
    return {
      loading: false,
      loading2: false,
      providerArr: [],
      status: false,
      mentorArr: [],
      rules: {
        providerType: [{ required: true, message: '必填', trigger: 'blur' }],
        wxId: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [{ required: true, message: '必填', trigger: 'blur' }],
        companyId: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewFeeType: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewFee: [{ required: true, message: '必填', trigger: 'blur' }],
        offerFeeType: [{ required: true, message: '必填', trigger: 'blur' }],
        offerFee: [{ required: true, message: '必填', trigger: 'blur' }],
        providerStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      formVisible: false,
      feeType: [
        { itemName: '人民币', itemValue: 'cny' },
        { itemName: '美金', itemValue: 'usd' }
      ],
      providerTypeList: [
        { itemName: '导师', itemValue: 'mentor' },
        { itemName: '其他', itemValue: 'other' }
      ],
      providerStatusList: [
        { itemName: '禁用', itemValue: '1' },
        { itemName: '启用', itemValue: '0' }
      ],
      companyList: [],
      wxId: '',
      internalData: {
        providerType: '',
        referId: '',
        providerName: '',
        wxId: '',
        email: '',
        companyId: '',
        interviewFeeType: '',
        interviewFee: '',
        offerFeeType: '',
        offerFee: '',
        providerStatus: ''
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    addVisible: function (val) {
      if (val) {
      }
    }
  },
  methods: {
    async pageInit () {
      this.companyList = await this.getCompany()
    },
    searchByWxId () {
      if (this.wxId) {
        this.loading2 = true
        this.status = false
        api.searchWxForCrtInternalJobDetail(this.wxId).then((res) => {
          this.loading2 = false
          console.log(res.data)
          if (res.code !== 200) {
            this.$message.warning(res.message)
          } else {
            this.status = true
            this.providerArr = res.data.providerArr
            this.mentorArr = res.data.mentorArr
          }
        })
      } else {
        this.$message.warning('微信ID必填')
      }
    },
    changeSearch () {
      this.status = false
      this.providerArr = []
      this.mentorArr = []
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.status = false
      this.wxId = ''
      this.providerArr = []
      this.mentorArr = []
      this.internalData = {
        providerType: '',
        referId: '',
        providerName: '',
        wxId: '',
        email: '',
        companyId: '',
        interviewFeeType: '',
        interviewFee: '',
        offerFeeType: '',
        offerFee: '',
        providerStatus: ''
      }
    },
    addOther () {
      this.formVisible = true
      this.internalData.providerType = 'other'
    },
    addMentor (data) {
      this.internalData.providerType = 'mentor'
      this.internalData.referId = data.mentorId
      this.internalData.providerName = data.mentorName
      this.internalData.wxId = data.wxId
      this.internalData.companyId = data.companyId
      this.internalData.email = data.email
      this.formVisible = true
    },
    formClose () {
      this.formVisible = false
    },
    formSubmit () {
      this.formVisible = false
      this.clear()
      this.searchByWxId()
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form_yx{
  display: flex;
  flex-wrap: wrap;
}
.el-form_yx .el-form-item--mini.el-form-item{
  width: 50%;
}
 .yx_descriptions .el-descriptions--mini.is-bordered .el-descriptions-item__cell{
    width: 50% !important;
  }
  .yx_3 .is-bordered .el-descriptions-item__cell{
    background: rgba(253, 226, 226,1) !important;
  }
  .yx_4 .is-bordered .el-descriptions-item__cell{
    background: rgba(179, 216, 225,0.5) !important;
  }
</style>
