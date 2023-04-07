<!--
 * @Author: 库建华
 * @Date: 2020-04-27 13:27:39
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-12 16:25:06
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="internal-edit">
    <el-drawer :title="'岗位详情'" :visible.sync="detailVisible" size="800px" :before-close="close">
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
        <el-form-item label="岗位链接" prop="jobUrl">
          <a :href="internalData.jobUrl" target="_blank">{{internalData.jobUrl}}</a>
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
        <el-form-item label="学历要求" prop="degree">
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
      <div style="display:flex;justify-content:right;width:700px">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" @click="deleteInternal" v-if="roleInfo.includes(`net_application_del`)">删 除</el-button>
        <el-button type="primary" @click="submit" v-if="roleInfo.includes(`net_application_edit`)">编 辑</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/job.js'
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
  data: () => {
    return {
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
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
      this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            netJobId: this.internalData.netJobId
          }
          console.log(params)
          api.delNetApplication(params)
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
