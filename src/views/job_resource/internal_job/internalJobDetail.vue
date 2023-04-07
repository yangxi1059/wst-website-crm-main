<!--
 * @Author: 杨曦
 * @Date: 2022-08-29 10:34:47
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-24 11:32:15
 * @Version:
 * @Description:
-->
<template>
  <div class="internal-edit">
    <el-dialog v-loading="loading" :title="'内推提供人详情'" append-to-body :close-on-click-modal="false" :visible.sync="detailVisible" size="800px" :before-close="close">
      <div>
        <el-descriptions title="" :column="2" border :contentStyle="{flex:1}" size="medium">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" @click="deleteInternal" >删 除</el-button>
        <el-button type="primary" @click="submit" >编 辑</el-button>
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
    detailVisible: {
      type: Boolean,
      default: false
    },
    providerId: {
      type: String
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
      formVisible: false,
      internalData: {
        createByName: '',
        updateByName: '',
        interviewFee: '',
        updateTime: '',
        wxId: '',
        providerType: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        providerTypeName: '',
        providerId: '',
        offerFeeType: '',
        offerFee: '',
        interviewFeeType: '',
        providerStatusname: '',
        email: '',
        providerStatus: ''
      }
    }
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.initDetail()
      }
    }
  },
  methods: {
    initDetail () {
      this.loading = true
      api.getInternalJobDetail(this.providerId).then(res => {
        console.log(res.data)
        this.loading = false
        this.internalData = res.data
      })
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.internalData = {
        createByName: '',
        updateByName: '',
        interviewFee: '',
        updateTime: '',
        wxId: '',
        providerType: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        providerTypeName: '',
        providerId: '',
        offerFeeType: '',
        offerFee: '',
        interviewFeeType: '',
        providerStatusname: '',
        email: '',
        providerStatus: ''
      }
    },
    delete () {
      this.clear()
      this.$emit('delete')
    },
    submit () {
      this.formVisible = true
    },
    formClose () {
      this.formVisible = false
    },
    formSubmit () {
      this.formVisible = false
      this.initDetail()
      this.$emit('submit')
    },
    deleteInternal () {
      this.$confirm('此操作将永久删除该内推提供人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteInternalJob(this.providerId).then(res => {
          this.delete()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
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
</style>
