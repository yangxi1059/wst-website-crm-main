<!--
 * @Author: 杨曦
 * @Date: 2021-05-24 11:07:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-10 13:52:24
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="设置权限" width="800px" :visible.sync="visibleRole" :before-close="close">
      <div>
        <el-checkbox :indeterminate="isIndeterminate" v-if="roleInfo.code != 'apply'" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="roleInfo.list" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item2,j) in roleData.children" :label="item2.code" :disabled="item2.disabled" :key="j">{{item2.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roleDetail',
  props: {
    visibleRole: {
      type: Boolean,
      default: false
    },
    roleData: {
      type: Object
    }
  },
  watch: {
    visibleRole: function (val) {
      if (val) {
        this.toPage()
      }
    }
  },
  data () {
    return {
      roleInfo: {},
      checkAll: false,
      isIndeterminate: false
    }
  },
  mounted () {

  },
  methods: {
    toPage () {
      this.roleInfo = {}
      this.roleInfo = JSON.parse(JSON.stringify(this.roleData))
      this.checkAll = this.roleInfo.list.length === this.roleInfo.children.length
      this.isIndeterminate = this.roleInfo.list.length > 0 && this.roleInfo.list.length < this.roleInfo.children.length
      console.log(this.roleInfo)
    },
    close () {
      this.$emit('close')
    },
    handleCheckedCitiesChange (value) {
      console.log(value)
      const checkedCount = value.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleInfo.children.length
      this.checkAll = checkedCount === this.roleInfo.children.length
    },
    handleCheckAllChange (val) {
      if (val) {
        this.roleInfo.list = []
        this.roleInfo.children.forEach(item => {
          this.roleInfo.list.push(item.code)
        })
      } else {
        this.roleInfo.list = []
      }
      this.isIndeterminate = false
    },
    submit () {
      const arr = []
      for (let j = 0; j < this.roleInfo.children.length; j++) {
        arr.push(this.roleInfo.children[j])
        arr[j].select = false
        if (this.roleInfo.list.length < 1) {
          arr[j].select = false
        } else {
          for (let i = 0; i < this.roleInfo.list.length; i++) {
            if (this.roleInfo.list[i] == this.roleInfo.children[j].code) {
              arr[j].select = true
            }
          }
        }
      }
      console.log(this.roleInfo)
      this.roleInfo.children = arr
      this.$emit('submit', this.roleInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
