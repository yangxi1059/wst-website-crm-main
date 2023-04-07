<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="设置角色用户" width="600px" :visible.sync="userVisible" :before-close="userClosed">
      <el-transfer
      style="text-align: left; display: inline-block;width:700px"
        filterable
        :props="{key: 'id',label: 'name'}"
        :titles="['未选入', '已选入']"
        v-model="userId"
        :data="member"
        ref="transfer"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userClosed">取 消</el-button>
        <el-button type="primary" @click="userSubmit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/role'
import apiU from '@/api/user'
export default {
  name: 'setUser',
  props: {
    userVisible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: ''
    }
  },
  watch: {
    userVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  data () {
    return {
      member: [],
      userId: []
    }
  },
  mounted () {
    apiU.userList({
        pageNum: 1,
        pageSize: 1000,
        entryStatus: '1'
      })
      .then(({ data }) => {
        console.log('userList...........................................', data)
        this.member = data.rows
      })
  },
  methods: {
    Topage () {
      api.getMentorPayCashier(this.position).then(res => {
        console.log('userList', res)
        this.userId = []
        res.data.forEach(v => {
          this.userId.push(v.userId)
        })
      })
    },
    userClosed () {
      this.$emit('close')
      // 清除已选中
      this.$refs.transfer.$refs.rightPanel.checked = []
      this.$refs.transfer.$refs.leftPanel.checked = []
    },
    userSubmit () {
      console.log('submit', this.userId)
      const data = {
        userIdArray: [],
        paymentType: this.position
      }
      this.userId.forEach(v => {
        data.userIdArray.push({ userId: v })
      })
      console.log(this.position, data)
      api
        .setMentorPayCashier(data)
        .then(res => {
          console.log(res)
          this.$emit('close')
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
