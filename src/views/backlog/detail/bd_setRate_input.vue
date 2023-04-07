<!--
 * @Author: 库建华
 * @Date: 2020-07-31 16:02:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:55:01
 * @Version: 1
 * @Description:
-->
<template>
    <div>
        <el-dialog :close-on-click-modal="false"
        :title="'【' +  data.cooperatorName + '】活动（' + data.activityName + '）评分' "
        :visible.sync="detailVisible"
        width="800px"
        :before-close="close"
        >
            <el-form
                :inline="true"
                size="mini"
                :model="menteeDetail"
                :rules="rules"
                ref="ruleForm"
                label-width="160px"
            >
                <el-form-item label="评分："  prop="score">
                    <div style="display:flex">
                        <el-rate
                            :max="10"
                            v-model="menteeDetail.score"
                            :show-score="true"
                            :colors="colors">
                        </el-rate>
                    </div>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input
                        style="width:400px"
                        resize="none"
                        :rows="3"
                        type="textarea"
                        v-model="menteeDetail.remark"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="close">关 闭</el-button>
                <el-button  @click="submit" type="primary">提 交</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
import api from '@/api/backlog.js'
export default {
  name: 'common-detail',
  props: {
    data: Object,
    detailVisible: Boolean
  },
  data: () => {
    return {
      menteeDetail: {
        score: 0,
        remark: ''
      },
      rules: {
        score: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  methods: {
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.menteeDetail.score = 0
      this.menteeDetail.remark = ''
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        if (this.menteeDetail.score < 1) {
          this.$message({
            message: '评分不能小于1',
            type: 'error'
          })
          return false
        }
        const params = {
          pkId: this.data.pkId,
          scoreId: this.data.scoreId,
          score: this.menteeDetail.score,
          remark: this.menteeDetail.remark
        }
        console.log(params)
        api.setRateBD(params).then(res => {
          console.log(res, 'yx451345')
          this.$message({
            message: '评分成功！！',
            type: 'success'
          })
          this.clear()
          this.$emit('submit')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
