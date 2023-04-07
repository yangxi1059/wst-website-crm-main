<!--
 * @Author: 库建华
 * @Date: 2020-05-12 09:32:44
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-11 10:00:20
 * @Version: 1
 * @Description:支付页提示
 -->
<template>
  <div>
    <el-alert
    v-if="name !== 'false'"
    :title="name + '--正在当前页...'"
    type="warning"
    center
    :closable="false"
    show-icon>
  </el-alert>
  </div>
</template>

<script>
import api from '@/api/dictionary.js'
export default {
  name: 'payStatus',
  props: {
    flags: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      name: 'false'
    }
  },
  watch: {
    flags: function (val, old) {
      console.log('flagsyx*************', val, this.name)
      if (val) {
        this.setPayStatus(val)
      } else if (this.name == 'false') {
        // console.log(321321321321321,old)
        // this.delPayStatus(old)
      }
    }
  },
  methods: {
    setPayStatus (val) {
      api.getPayStatus(val).then(res => {
        console.log('getPayStatus', res)
        this.name = res.data
        if (this.name !== 'false') {
          this.$alert(this.name + '--正在当前页...', '支付提示', {
            confirmButtonText: '确定'
          }, () => {})
        }
      })
    },
    delPayStatus (val) {
      console.log(val)
      api.delPayStatus(val).then(res => {
        console.log('delPayStatus3213213213123', res)
        this.name = 'false'
      }).catch(err => {
        console.log(err, 154545453)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
