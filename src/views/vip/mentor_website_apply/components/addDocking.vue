<!--
 * @Author: 杨曦
 * @Date: 2022-08-15 10:57:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-27 09:13:26
 * @Version:
 * @Description:
-->
<template>
  <div >
    <el-dialog title="创建对接任务" :close-on-click-modal="false" :visible.sync="useDockingVisible" width="600px" :before-close="close">
        <el-form :inline="true" label-width="100px" :rules="rules" size="mini" :model="forData" ref="tableValidate">
            <el-form-item prop="taskUserId" label="任务人">
                <el-select filterable size="mini" v-model="forData.taskUserId" clearable placeholder="请选择">
                    <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="taskRemark" label="任务备注">
                <el-input
                    style="width:400px"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    :autosize="{ minRows: 5}"
                    placeholder="请输入内容"
                    v-model="forData.taskRemark">
                </el-input>
            </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button  @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'

export default {
  name: 'useDocking',
  props: {
    useDockingVisible: {
      type: Boolean,
      default: false
    },
    dockingDetail: {
      type: Object
    }
  },
  data: () => {
    return {
      rules: {
        taskUserId: [{ required: true, message: '必填', trigger: 'blur' }],
        taskRemark: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      userList:[],
      forData: {
        taskUserId: '',
        taskRemark: ''
      }
    }
  },
  watch: {
    useDockingVisible: function (val) {
      if (val) {}
    }
  },
  mounted () {
    const data = {
      entryStatus: 1,
      depts: 'wst_vip',
      positionTypes: ''
    }
    apiDic.userListCommon(data).then(res => {
      console.log(res)
      this.userList = res.data
    })
  },
  methods: {
    clear () {
      this.forData = {
        taskUserId: '',
        taskRemark: ''
      }
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    submit () {
      this.$refs.tableValidate.validate(valid => {
        if (!valid) return
        const data = {
          pkId: this.dockingDetail.pkId || '',
          mentorName: this.dockingDetail.mentorName || '',
          taskUserId: this.forData.taskUserId,
          taskRemark: this.forData.taskRemark
        }
        console.log(data)
        api.addDocking(data).then(res => {
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
