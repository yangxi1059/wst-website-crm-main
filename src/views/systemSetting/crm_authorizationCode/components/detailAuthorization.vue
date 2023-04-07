<!--
 * @Author: 杨曦
 * @Date: 2020-09-03 16:17:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-26 10:28:13
 * @Version:
 * @Description:
-->
<!--
 * @Author: 杨曦
 * @Date: 2020-07-02 14:07:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-10-21 17:58:20
 * @Version:
 * @Description:
-->
<template>
    <el-dialog :close-on-click-modal="false" title="授权码详情" :visible.sync="detailVisible" width="800px" :before-close="close">
        <div class="yx_elform_bottom">
            <template>
                <el-form :data="detailData" >
                    <el-form-item label="授权码:" label-width="150px">
                        <p>{{detailData.codeKey|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="授权码状态:" label-width="150px">
                        <p>{{detailData.codeStatusName|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="绑定时间:" label-width="150px">
                        <p>{{detailData.bindTime|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="过期时间:" label-width="150px">
                        <p>{{detailData.expirationTime|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="绑定用户:" label-width="150px">
                        <p>{{detailData.userName|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="机器码:" label-width="150px">
                        <p>{{detailData.machineCode|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="机器系统:" label-width="150px">
                        <p>{{detailData.machineOs|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="机器名:" label-width="150px">
                        <p>{{detailData.machineName|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="创建人:" label-width="150px">
                        <p>{{detailData.createByName|| '无' }}</p>
                    </el-form-item>
                    <el-form-item label="创建时间:" label-width="150px">
                        <p>{{detailData.createTime|| '无' }}</p>
                    </el-form-item>
                </el-form>
            </template>
        </div>
        <span slot="footer">
            <el-button @click="close">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import api from '@/api/authorization.js'

export default {
  name: 'text-addBook',
  data () {
    return {
      detailData: {}
    }
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    codeKey: {
      type: String
    }
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      api.getAuthorizationInfo(this.codeKey).then(res => {
        this.detailData = JSON.parse(JSON.stringify(res.data))
        console.log(res.data)
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style>
    .yx_elform_bottom .el-form-item{
        margin-bottom: 0px;
    }
</style>
