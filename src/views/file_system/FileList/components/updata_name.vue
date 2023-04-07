<template>
  <el-dialog :close-on-click-modal="false"
    :visible="updataNameVisible"
    :title="'更名 : '+ path"
    width="800px"
    :before-close="updataNameClose"
  >
    <!-- <el-form-item label="当前文件(夹)：" label-width="160px">{{path}}</el-form-item> -->
    <el-form label-width="130px" :inline="true">
      <el-form-item label="文件（夹）名">
      </el-form-item>
    </el-form>
        <el-input :style="{width:'400px','margin-left':'50px'}" v-model="updataNameData.fileName" @keyup.enter.native="updataNameSubmit" maxlength="99"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="updataNameClose">取 消</el-button>
      <el-button type="primary" @click="updataNameSubmit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/file_system.js'
export default {
  name: 'permission',
  props: {
    updataNameVisible: {
      type: Boolean,
      default: false
    },
    fileNav: {
      type: Array
    },
    updataNameData: {
      type: Object
    }
  },
  data: () => {
    return {
    }
  },
  computed: {
    path: function () {
      let p = ''
      this.fileNav.forEach(v => {
        p += v.navigateName + ' / '
      })
      return p
    }
  },
  watch: {
  },
  mounted () {},
  methods: {
    updataNameClose () {
      console.log('updataNameClose')
      this.$emit('close')
    },
    updataNameSubmit () {
      console.log(
        'updataNameSubmit'
      )
      const uptList = {
        fileId: this.updataNameData.fileId,
        fileName: this.updataNameData.fileName
      }
      console.log('更新名参数', uptList)
      api.setFile({ uptList: [uptList] }).then(res => {
        console.log('更新名', res)
        this.updataNameClose()
        this.$emit('submit')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
