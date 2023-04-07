<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" :title="'个人档案'" :visible.sync="viewFileVisible" width="900px" :before-close="close">
      <el-form size="medium" label-width="120px">
        <el-form-item label="文件列表">
          <div class="box" v-for="(item,i) in fileData" :key="item.pkId">
            <el-button
              class="el-icon-download"
              size="mini"
              type="primary"
              @click="download(item.materialsurl)"
            > {{item.materialsName}}</el-button>
            <el-button type="text" class="el-icon-delete" @click="deleteFile(i)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :on-remove="change"
            :style="{width:'200px'}"
            drag
          >
            <i class="el-icon-upload"></i>
            点击选取文件/拖拽上传
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/hr.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'
export default {
  name: 'edit',
  props: {
    viewFileVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fileData: [],
      rules: {},
      sys_user_type: [],
      roleList: [],
      salesLevelList: [],
      fileList: [],
      delList: []
    }
  },
  watch: {
    viewFileVisible: function (val) {
      if (val && this.userId !== '') {
        this.Togage()
      }
    }
  },
  methods: {
    Togage () {
      api.getUserFileListByUserId(this.userId).then(res => {
        console.log('档案列表', res.data)
        this.fileData = res.data
      })
    },
    deleteFile (i) {
      this.delList.push({ pkId: this.fileData[i].pkId })
      this.fileData.splice(i, 1)
    },
    download (val) {
      console.log(val)
      downloadFun(val, url => {
        window.open(url)
      })
    },
    close () {
      console.log('个人档案关闭')
      this.$emit('close')
    },
    clear () {
      this.fileList = []
      this.fileData = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    submit () {
      console.log(this.fileList)
      const data = {
        addList: [],
        delList: this.delList
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, `material/${this.userId}`, url => {
            console.log(url)
            data.addList.push({
              materialsName: file.name,
              materialsurl: url,
              userId: this.userId
            })
            if (data.addList.length === this.fileList.length) {
              console.log('档案参数', data)
              api.setUserFileList(data).then(res => {
                console.log('档案', res)
                this.$emit('submit')
                this.clear()
              })
            }
          })
        }
      } else {
        console.log('档案参数', data)
        api.setUserFileList(data).then(res => {
          console.log('档案', res)
          this.$emit('submit')
          this.clear()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
