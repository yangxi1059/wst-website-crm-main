<!--
 * @Author: 杨曦
 * @Date: 2022-08-15 10:57:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-15 11:33:46
 * @Version:
 * @Description:
-->
<template>
  <div >
    <el-dialog title="查看对接任务" :close-on-click-modal="false" :visible.sync="checkDockingVisible" width="600px" :before-close="close">
      <el-descriptions  direction="vertical" :column="2" border>
        <el-descriptions-item label="任务人">{{taskUserName}}</el-descriptions-item>
        <el-descriptions-item label="任务备注">{{taskRemark}}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button  @click="close">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'

export default {
  name: 'useDocking',
  props: {
    checkDockingVisible: {
      type: Boolean,
      default: false
    },
    dockingDetail: {
      type: Object
    }
  },
  data: () => {
    return {
      taskUserName: '',
      taskRemark: ''
    }
  },
  watch: {
    checkDockingVisible: function (val) {
      if (val) {
        this.init()
      }
    }
  },
  mounted () {},
  methods: {
    init () {
      api.dockingDetail(this.dockingDetail.mentorId).then(res => {
        this.taskUserName = res.data.taskUserName
        this.taskRemark = res.data.taskRemark
      })
    },
    clear () {
      this.taskUserName = ''
      this.taskRemark = ''
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
