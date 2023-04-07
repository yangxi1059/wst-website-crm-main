<!--
 * @Author: 库建华
 * @Date: 2019-11-25 14:56:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-16 18:03:01
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog
      :title="'分配导师课时'"
      :close-on-click-modal="false"
      :visible.sync="toVipHoursVisible"
      width="540px"
      :before-close="handleClose"
    >
      <div v-loading="loading" >
        <el-tag class="mb20" size="small">导师配置【总课时数：{{totalHour}}】</el-tag>
        <div class="mb10" v-for="(item,i) in mentorArr" style="display:flex" :key="i">
            <div style="width:200px;text-align:right">{{item.mentorName}}-课时数：</div>
            <div style="flex:1">
                <el-input-number  v-model="item.totalHour" :min="item.allocatedHour"></el-input-number>
            </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'

export default {
  name: 'Survey',
  props: {
    signId: {},
    toVipHoursVisible: {},
    totalHour: {},
    mentorData: {}
  },
  data () {
    return {
      loading: false,
      mentorArr: []
    }
  },
  watch: {
    toVipHoursVisible: function (newData, oldData) {
      if (newData) {
        this.toPage()
      }
    }
  },
  mounted () {},
  methods: {
    toPage () {
      this.mentorArr = JSON.parse(JSON.stringify(this.mentorData))
    },
    handleClose () {
      this.$emit('close')
    },
    submit () {
      let num = 0
      let minNum = 0
      const data = []
      this.mentorArr.forEach(item => {
        num += item.totalHour
        minNum += item.appliedHour
        data.push({
          pkId: item.pkId,
          signLesson: item.totalHour
        })
      })
      console.log(this.totalHour,num,data)
      if (num > this.totalHour) {
        this.$message.error('不可超过总课时数！！')
      } else if (minNum > num) {
        this.$message.error('不可低于已完成的最少课时！！')
      } else {
        api.updateMentorHoursAll(data).then(res => {
          this.$message.success('修改成功！！')
          this.$emit('submit')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
