<!--
 * @Author: 库建华
 * @Date: 2020-05-28 16:46:32
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-12 15:20:53
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-drawer
      :visible.sync="followVisible"
      size="70%"
      :before-close="followUpItemClose2"
      title="VIP followUp记录"
    >
      <!-- <div class="header" slot="title">followUp记录</div> -->
      <followTable :followedUpList="followedUpList" @followUp="followUp" />
      <vipFollow :vipFollowApplyVisible="vipFollowApplyVisible" @changepage="updateList" @close="followUpItemClose" :menteeId="menteeId" :menteeName="menteeName" :pkId="pkId" :signId="signId" :times="times" ref="child"></vipFollow>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followUpItemClose2">取 消</el-button>
        <el-button type="primary" @click="followUpItemSubmit" v-if="pkId && canFollow">提 交</el-button>
      </span>
    </el-drawer>
  </div>
</template>

<script>
import api from '@/api/vip'
import vipFollow from './Followup.vue'
import followTable from './FollowupList.vue'
import file from '@/libs/file'

export default {
  name: 'VipFollowUserDetail',
  props: {
    followVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String
    },
    menteeInfo: {
      type: Object
    },
    refresh: {}
  },
  components: { vipFollow, followTable },
  data () {
    return {
      rules: {
        lessonHours: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      pkId: '',
      times: '',
      menteeId: '',
      menteeName: '',
      vipFollowApplyVisible: false,
      followedUpList: [],
      canFollow: false
    }
  },
  watch: {
    followVisible: function (val) {
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
        this.menteeId = data && data.menteeId
        this.menteeName = data && data.menteeName
        this.canFollow = data && new Date(data.beginDate) <= new Date()
      })
    },
    updateList () {
      this.Topage()
      this.vipFollowApplyVisible = false
      this.$loading().close()
      if (this.refresh) {
        this.$emit('submit')
      }
    },
    clear () {
      this.canFollow = false
    },
    followUpItemClose2 () {
      this.$emit('close')
      this.clear()
    },
    followUpItemSubmit () {
      this.$refs.child.followUpItemSubmit()
    },
    download (path) {
      file.preview(path)
    },
    followUp (item) {
      this.vipFollowApplyVisible = true
      this.menteeName = this.menteeInfo.menteeName
      this.menteeId = this.menteeInfo.menteeId
      this.pkId = item.pkId
      this.signId = item.signId
      this.times = item.times
      console.log(this.menteeInfo, this.vipFollowApplyVisible)
    },
    followUpItemClose () {
      this.vipFollowApplyVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
