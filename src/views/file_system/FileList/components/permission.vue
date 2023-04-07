<template>
  <el-dialog :close-on-click-modal="false"
    :visible="permissionVisible"
    :title="'权限管理 : '+ path"
    width="1300px"
    :before-close="permissionClose"
  >
    <el-form label-width="130px" :inline="true">
      <el-form-item :label="item.name" v-for="item in groupPermission" :key="item.id">
        <el-radio-group
          :style="{width:'280px'}"
          v-model="item.accessType"
          size="mini"
          @change="GroupChange(item)"
        >
          <el-radio-button label="empty" key="empty">无</el-radio-button>
          <el-radio-button label="preview" key="preview">只读</el-radio-button>
          <el-radio-button label="readonly" key="readonly">下载</el-radio-button>
          <el-radio-button label="write" key="write">更新</el-radio-button>
          <el-radio-button label="manage" key="manage">管理</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="item.name" v-for="item in usersPermission" :key="item.id">
        <el-radio-group
          :style="{width:'280px'}"
          v-model="item.accessType"
          size="mini"
          @change="userChange(item)"
        >
          <el-radio-button label="empty" key="empty">无</el-radio-button>
          <el-radio-button label="preview" key="preview">只读</el-radio-button>
          <el-radio-button label="readonly" key="readonly">下载</el-radio-button>
          <el-radio-button label="write" key="write">更新</el-radio-button>
          <el-radio-button label="manage" key="manage">管理</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="permissionClose">取 消</el-button>
      <el-button type="primary" @click="permissionSubmit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/file_system.js'
export default {
  name: 'permission',
  props: {
    permissionVisible: {
      type: Boolean,
      default: false
    },
    fileNav: {
      type: Array
    },
    permissionData: {
      type: Object
    }
  },
  data: () => {
    return {
      usersPermission: [],
      groupPermission: [],
      usersPermissionAPI: [],
      groupPermissionAPI: [],
      uptList: []
    }
  },
  computed: {
    path: function () {
      let p = ''
      this.fileNav.forEach(v => {
        p += v.navigateName + ' / '
      })
      p += this.permissionData.fileName
      return p
    }
  },
  watch: {
    permissionVisible: function (val, old) {
      if (val) {
        console.log()
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    Topage () {
      console.log('权限数据', this.permissionData.fileId)
      api
        .getUsersPermissionListByFileId(this.permissionData.fileId)
        .then(res => {
          console.log('权限数据', res)
          this.usersPermission = res.data.user
          this.usersPermissionAPI = JSON.parse(JSON.stringify(res.data.user))
          this.groupPermission = res.data.group
          this.groupPermissionAPI = JSON.parse(JSON.stringify(res.data.group))
        })
    },
    permissionClose () {
      console.log('permissionClose')
      this.$emit('close')
    },
    permissionSubmit () {
      console.log(
        'permissionSubmit',
        this.groupPermission,
        this.usersPermission
      )
      const data = { uptList: this.uptList }
      console.log('更新权限参数', data)
      api.setPermission(data).then(res => {
        console.log('更新权限', res)
        this.uptList = []
        this.permissionClose()
        this.$emit('submit')
      })
    },
    GroupChange (item) {
      console.log(item)
      for (let i = 0; i < this.uptList.length; i++) {
        if (this.uptList[i].accessOwner == item.id) {
          this.uptList[i].accessType = item.accessType
          return
        }
      }
      this.uptList.push({
        fileId: this.permissionData.fileId,
        accessType: item.accessType,
        accessOwner: item.id,
        ownerType: 'group'
      })
    },
    userChange (item) {
      console.log(item)
      for (let i = 0; i < this.uptList.length; i++) {
        if (this.uptList[i].accessOwner == item.id) {
          this.uptList[i].accessType = item.accessType
          return
        }
      }
      this.uptList.push({
        fileId: this.permissionData.fileId,
        accessType: item.accessType,
        accessOwner: item.id,
        ownerType: 'user'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
