<!--
 * @Author: 库建华
 * @Date: 2020-07-29 15:22:21
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 11:08:44
 * @Version: 1
 * @Description:
-->
<template>
  <div class="overtime">
    <el-dialog :close-on-click-modal="false"
      title="创建待办"
      :visible.sync="addBacklogCommonVisible"
      width="900px"
      :before-close="close"
    >
      <el-form :inline="true" label-width="150px" :rules="rules" :model="backlogData" ref="form">
        <el-form-item label="待办类型" prop="backlogType">
          <el-select
            :style="{width:'200px'}"
            size="mini"
            v-model="backlogData.backlogType"
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in backlog_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="待办人" prop="userId">
          <el-select
            :style="{width:'200px'}"
            size="mini"
            v-model="backlogData.userId"
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in user"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="待办描述" prop="reminderMsg">
          <el-input
            :style="{width:'560px'}"
            size="mini"
            v-model="backlogData.reminderMsg"
            :maxlength="99"
            type="textarea"
            :autosize="{minRows:3}"
            placeholder="限制100字符"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/backlog.js'
import mixins from '@/plugin/mixins'
import apiU from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'add-backlog',
  mixins: [mixins],
  props: {
    addBacklogCommonVisible: {
      type: Boolean,
      default: false
    },
    day: String
  },
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  data: () => {
    return {
      backlogData: {
        backlogType: 'common',
        reminderMsg: '',
        userId: ''
      },
      user: [],
      backlog_type: [],
      rules: {
        reminderMsg: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    addBacklogCommonVisible: function (val) {
      if (val) {
        this.backlogData.userId = this.userInfo.userId
        if (!this.user.length) {
          this.init()
        }
      }
    }
  },
  mounted () {
    this.backlogData.userId = this.userInfo.userId
    if (!this.user.length) {
      this.pageInit()
    }
  },
  methods: {
    async pageInit () {
      apiU
        .userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
        .then(({ data }) => {
          console.log('userList.........................', data)
          this.user = data.rows
        })
      this.backlog_type = await this.getDictionary('backlog_type')
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.backlogData = {
        backlogType: 'common',
        reminderMsg: '',
        userId: this.userInfo.userId
      }
    },
    submit () {
      this.$refs.form.validate(v => {
        if (!v) return
        const data = {
          backlogType: this.backlogData.backlogType,
          backlogDate: this.day,
          reminderMsg: this.backlogData.reminderMsg,
          userId: this.backlogData.userId
        }

        console.log('addBacklogCommonItem data', data)
        api.addBacklogCommonItem(data).then(res => {
          console.log('addBacklogCommonItem', res)
          this.$emit('submit')
          this.close()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
