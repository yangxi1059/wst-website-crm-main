<!--
 * @Author: 杨曦
 * @Date: 2021-04-21 13:14:19
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-06 14:32:11
 * @Version: 1
 * @Description:
 -->
<template>
    <div class="select_limit" style="display:inline-block">
        <el-cascader
            :style="{width:'160px'}"
            v-model="number"
            ref="owner"
            class="mr10"
            :options="userList"
            size="mini"
            filterable
            @change="handleChange"
            :props="{ checkStrictly: true }"
        ></el-cascader>
    </div>
</template>

<script>
import api from '@/api/vip.js'
import { mapState } from 'vuex'
export default {
  name: 'cascader',
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  props: {
    // userList:{},
    role: {},
    showStatus: {
      default: false
    },
    userId: {}
  },
  data () {
    return {
      number: '',
      user: '',
      groupId: '',
      userList: []
    }
  },
  watch: {

  },
  mounted () {
    this.number = this.userInfo.userId
    api.getUserList().then(res => {
      console.log(res.data, 22222222222)
      this.userList = res.data
      this.userList.unshift({ value: this.userInfo.userId, label: '本人数据' })
      if (this.role == '1') {
        this.userList.unshift({
          value: 'ALL_Data',
          label: 'ALL（全数据）'
        })
      }
    })
  },
  methods: {
    handleChange () {
      const tempObj = this.$refs.owner.getCheckedNodes()[0]
      if (this.showStatus) {
        document.querySelector('.yx_my_select .select_limit .el-icon-arrow-down').click()
      } else {
        document.querySelector('.select_limit .el-icon-arrow-down').click()
      }
      if (tempObj) {
        if (tempObj.data.groupId) {
          this.groupId = tempObj.value
          this.user = ''
        } else {
          this.groupId = ''
          this.user = tempObj.value
        }
      } else {
        this.groupId = ''
        this.user = ''
      }
      const data = {
        groupId: this.groupId,
        user: this.user
      }
      this.$emit('change', data)
    },
    test () {
      console.log(this.userId)
      this.number = this.userId
    }
  }
}
</script>

<style lang='scss'>
</style>
