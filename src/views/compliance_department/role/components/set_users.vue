<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="设置角色用户" width="800px" :visible.sync="userVisible" :before-close="userClosed">
      <el-form size="medium" ref="formRule" label-width="100px">
        <el-form-item label="成员" prop="userId">
          <el-checkbox-group v-model="userId" class="member">
            <el-checkbox v-for="item in member" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
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
    roleId: {
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
        console.log(
          'userList...........................................',
          data
        )
        this.member = data.rows
      })
  },
  methods: {
    Topage () {
      api.getUserList(this.roleId).then(res => {
        console.log('userList', res)
        this.userId = []
        res.data.forEach(v => {
          this.userId.push(v.userId)
        })
      })
    },
    userClosed () {
      this.$emit('close')
    },
    userSubmit () {
      console.log('submit', this.userId)
      const userIdList = []
      this.userId.forEach(v => {
        userIdList.push({ userId: v })
      })
      const data = {
        roleId: this.roleId,
        userIdArray: userIdList
      }
      console.log(data)
      api
        .setUserList(data)
        .then(res => {
          console.log(res)
          this.$emit('submit')
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
