<!--
 * @Author: 库建华
 * @Date: 2020-05-28 16:46:32
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-17 10:11:10
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :visible.sync="followVisibleVip"
      width="1000px"
      :before-close="followUpItemClose"
      title="VIP Follow Up"
    >
      <vipFollow v-if="pkId && canFollow" @changepage="updateList"  :menteeId="menteeId" :menteeName="menteeName" :pkId="pkId" :signId="signId" :times="times" ref="child"></vipFollow>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followUpItemClose">取 消</el-button>
        <el-button type="primary" @click="followUpItemSubmit" v-if="pkId && canFollow">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import vipFollow from '../../vip/mentee/components/FollowupForm'

export default {
  name: 'follow',
  props: {
    followVisibleVip: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String
    },
    menteeInfo: {
      type: Object
    }
  },
  components: {
    vipFollow
  },
  data () {
    return {
      rules: {
        lessonHours: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      pkId: '',
      times: '',
      menteeId: '',
      menteeName: '',
      followUpData: {},
      followedUpList: [],
      fileList: [],
      canFollow: false,

      checked: false,
      user: [],
      copy: []
    }
  },
  watch: {
    followVisibleVip: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  mounted () {

  },
  methods: {
    Topage () {
      api.getFollowedUpList(this.signId).then((res) => {
        console.log(res)
        this.followedUpList = res.data
        const data = res.data.filter((v) => v.followStatusName == '待follow')[0]
        console.log(data)
        this.pkId = data && data.pkId
        this.times = data && data.times
        this.signId = data && data.signId
        this.menteeId = data && data.menteeId
        this.menteeName = data && data.menteeName
        this.canFollow = data && new Date(data.beginDate) <= new Date()
      })
    },
    clear () {
      this.canFollow = false
    },
    updateList () {
      console.log(31222222222)
      this.clear()
      this.$emit('submit')
      this.followUpItemClose()
    },
    followUpItemClose () {
      this.$emit('close')
      this.clear()
    },
    followUpItemSubmit () {
      this.$refs.child.followUpItemSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
