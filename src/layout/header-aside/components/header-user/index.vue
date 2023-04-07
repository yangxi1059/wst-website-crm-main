<!--
 * @Author: 杨曦
 * @Date: 2021-11-24 16:52:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-08 13:46:09
 * @Version:
 * @Description:
-->
<template>
  <el-dropdown size="small" class="d2-mr">
    <el-avatar :src="userInfo.headImage?userInfo.headImage:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
    <!-- <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span> -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
      <el-dropdown-item @click.native="refreshDic">
        <d2-icon name="refresh" class="d2-mr-5"/>
        刷新字典
      </el-dropdown-item>
      <!-- <el-dropdown-item >
        水印<el-switch
              @change="changeWater"
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
      </el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import util from '@/libs/util.js'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  data () {
    return {
      value: true
    }
  },
  mounted () {
    console.log(this.userInfo)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    changeWater(){
      console.log(this.value)
    },
    refreshDic () {
      util.sessions.remove('allDic')
      const allDic = {}
      util.sessions.set('allDic', allDic)
      this.$message({
        showClose: true,
        message: '字典重置成功，3s后获取新字典',
        type: 'success',
        duration: 3000,
        onClose: function () {
          location.reload()
        }
      })
    }
  }
}
</script>
