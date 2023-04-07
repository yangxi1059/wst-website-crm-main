<!--
 * @Author: 库建华
 * @Date: 2020-04-27 13:27:39
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-31 15:18:41
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="internal-edit">
    <el-drawer :title="'内推岗位详情'" :visible.sync="detailVisible" size="800px" :before-close="close">
      <el-form
        class="mr20 el-form_yx"
        ref="signTable"
        label-width="130px"
        label-position="right"
        :model="internalData"
      >
        <el-form-item label="公司" prop="companyId">
          <p>{{internalData.companyName}}</p>
        </el-form-item>
        <el-form-item label="岗位名称" prop="jobName">
          {{internalData.jobName}}
        </el-form-item>
        <el-form-item label="岗位介绍" prop="jobInformation">
          {{internalData.jobInformation}}
        </el-form-item>
        <el-form-item label="岗位要求" prop="jobRequirements">
          {{internalData.jobRequirements}}
        </el-form-item>
        <el-form-item label="岗位数量" prop="jobCount">
          {{internalData.jobCount}}
        </el-form-item>
        <el-form-item label="申请季" prop="applySeason">
          {{internalData.applySeason}}
        </el-form-item>
        <el-form-item label="是否有截止日期" prop="deadLine">
          {{internalData.hasDeadLineName}}
        </el-form-item>
        <el-form-item label="截止日期" prop="deadLine">
          {{internalData.deadLine||"无"}}
        </el-form-item>
        <el-form-item label="Track" prop="track">
          {{internalData.tracksName}}
        </el-form-item>
        <el-form-item label="学历要求" >
          {{internalData.degreesName}}
        </el-form-item>
        <el-form-item label="地区" prop="country">
          {{internalData.countryName}}
        </el-form-item>
        <el-form-item label="城市" prop="city">
          {{internalData.cityName||'无'}}
        </el-form-item>
        <el-form-item label="状态" prop="recordStatus">
          {{internalData.recordStatusName}}
        </el-form-item>
        <el-form-item label="岗位类型" prop="jobType">
          {{internalData.jobTypeName}}
        </el-form-item>
        <el-form-item label="远程/实地" prop="locationType">
         {{internalData.locationTypeName}}
        </el-form-item>
        <el-form-item label="官网展示" prop="displayStatus">
          {{internalData.displayStatusName}}
        </el-form-item>
        <el-form-item label="面试费用" v-if="internalData.providerId" prop="locationType">
          {{internalData.interviewFeeType}} {{internalData.interviewFee}}
        </el-form-item>
        <el-form-item label="offer费用" v-if="internalData.providerId">
          {{internalData.offerFeeType}} {{internalData.offerFee}}
        </el-form-item>
        <el-form-item label="创建人" prop="createByName">
          {{internalData.createByName}}
        </el-form-item>
         <el-form-item label="创建时间" prop="createTime">
          {{internalData.createTime}}
        </el-form-item>
        <el-form-item label="更新人" prop="updateByName">
          {{internalData.updateByName}}
        </el-form-item>
         <el-form-item label="更新时间" prop="updateTime">
          {{internalData.updateTime}}
        </el-form-item>
      </el-form>
      <div style="display:flex;justify-content:right;width:700px;padding-left: 75px;">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" @click="deleteInternal" v-if="roleInfo.includes(`internal_job_del`)">删 除</el-button>
        <el-button type="info" @click="students" v-if="roleInfo.includes(`internal_job_student`)">学 员</el-button>
        <el-button type="primary" @click="submit" v-if="roleInfo.includes(`internal_job_edit`)">编 辑</el-button>
      </div>
    </el-drawer>
    <students
      :studentsVisible="studentsVisible"
      :internalData="internalData"
      @close="studentsClose"
      @submit="studentsSubmit"
    />
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/dictionary.js'
import students from './internal_job_students.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    internalData: {
      type: Object
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { students },
  data: () => {
    return {
      studentsVisible: false
    }
  },
  watch: {
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$emit('submit')
    },
    deleteInternal () {
      const v = this.internalData
      this.$confirm('此操作将永久删除该内推, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteInternalJob(v.jobId)
        })
        .then(res => {
          console.log('更新', res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('success')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    students () {
      console.log(this.internalData)
      this.studentsVisible = true
    },
    studentsClose () {
      this.studentsVisible = false
    },
    studentsSubmit () {
      this.studentsClose()
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
