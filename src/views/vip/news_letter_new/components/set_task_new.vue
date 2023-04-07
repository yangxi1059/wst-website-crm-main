<!--
 * @Author: 库建华
 * @Date: 2020-05-12 17:21:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-16 16:44:36
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="编辑Letter" :visible.sync="setVisible" width="1200px" :before-close="close">
      <el-form
        :inline="true"
        size="mini"
        ref="signTable"
        :rules="rules"
        label-width="120px"
        :model="newsLetterData"
      >
        <el-form-item label="标题" prop="title">
          <el-input :style="{width:'150px'}" v-model="newsLetterData.title" :maxlength="255"></el-input>
        </el-form-item>

        <el-form-item label="News日期" prop="newsDate">
          <el-date-picker
           :style="{width:'150px'}"
            v-model="newsLetterData.newsDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="是否官网展示" prop="recodeStatus">
          <el-select v-model="newsLetterData.recodeStatus" :style="{width:'150px'}">
            <el-option
              v-for="item in status"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片列表" prop="">
          <el-button  type="primary" @click="viewImgList">查看图片列表</el-button>
        </el-form-item>
        <el-form-item label="行业" prop="">
          <div style="width:1000px">
            <el-checkbox  :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="menteeTrack" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(item,i) in mentee_track" :label="item.itemValue" :key="i">{{item.itemNameEng}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <vue-ueditor-wrap v-model="text" :config="myConfig"></vue-ueditor-wrap>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <imgList :imgListVisible="imgListVisible" :pkId="pkId" @close="viewImgListClose" />
  </div>
</template>

<script>
import api from '@/api/vip'
import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
import { uploadFunBySys } from '@/libs/file'
import imgList from './imgList.vue'
import mixins from '@/plugin/mixins'

export default {
  components: { VueUeditorWrap, imgList },
  mixins: [mixins],
  props: {
    setVisible: {
      type: Boolean,
      default: false
    },
    pkId: {
    }
  },
  data () {
    return {
      menteeTrack: [],
      checkAll: false,
      isIndeterminate: true,
      newsLetterData: {},
      imgListVisible: false,
      rules: {
        title: [{ required: true, message: '必填', trigger: 'blur' }],
        recodeStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        newsDate: [{ required: true, message: '必填', trigger: 'blur' }],
        menteeTrack: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      text: '',
      success_story_type: [],
      status: [
        { itemName: '展示', itemValue: '1' },
        { itemName: '不展示', itemValue: '0' }
      ],
      mentee_track: [],
      myConfig: {
        UEDITOR_HOME_URL: 'static/UE/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 700,
        // 初始容器宽度
        initialFrameWidth: '100%'
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    setVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    async pageInit () {
      this.mentee_track = await this.getDictionary('mentee_track')
      console.log(this.mentee_track)
    },
    initPage () {
      if (this.pkId) {
        this.getNewsLetter()
      }
    },
    getNewsLetter () {
      this.$loading()
      api.getNewsLetterByTaskId2(this.pkId).then(res => {
        this.newsLetterData = res.data
        const arr = []
        if (this.newsLetterData.trackList && this.newsLetterData.trackList.length > 0) {
          this.newsLetterData.trackList.forEach(item => {
            arr.push(item.trackId)
          })
        }
        this.menteeTrack = arr
        if (this.menteeTrack.length == this.mentee_track.length) {
          this.indeterminate = true
        }
        console.log(this.newsLetterData)
        this.text = res.data.content
        this.$loading().close()
      })
    },
    clean () {
      this.newsLetterData = {}
      this.menteeTrack = []
      this.text = ''
    },
    close () {
      this.$emit('close')
      this.clean()
    },
    handleCheckAllChange (val) {
      if (val) {
        this.menteeTrack = []
        this.mentee_track.forEach(item => {
          this.menteeTrack.push(item.itemValue)
        })
      } else {
        this.menteeTrack = []
      }
      this.newsLetterData.menteeTrack = this.menteeTrack
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      console.log(value)
      const checkedCount = value.length
      this.checkAll = checkedCount === this.mentee_track.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.mentee_track.length
      this.newsLetterData.menteeTrack = value
      console.log(this.newsLetterData.menteeTrack)
    },
    submit () {
      console.log(this.text.length)
      if (this.text.length > 1024 * 1024) {
        this.$message({
          type: 'error',
          message: '文本内容过长，请加以控制'
        })
        return
      }
      this.newsLetterData.content = this.text
      this.$refs.signTable.validate(valid => {
        if (!valid) return
        const arr = []
        if (this.menteeTrack.length > 0) {
          this.$loading()
          this.menteeTrack.forEach(item => {
            arr.push({ trackId: item })
          })
          this.newsLetterData.trackList = arr
          console.log(this.newsLetterData)
          if (!this.pkId) {
            api.addNewsLetter2(this.newsLetterData).then(res => {
              console.log(res)
              this.$loading().close()
              this.$emit('submit')
              this.clean()
            })
          } else {
            api.uptNewsLetter2(this.newsLetterData).then(res => {
              console.log(res)
              this.$loading().close()
              this.$emit('submit')
              this.clean()
            })
          }
        } else {
          this.$message.error('行业必填！！')
        }
      })
    },
    viewImgList () {
      this.imgListVisible = true
    },
    viewImgListClose () {
      this.imgListVisible = false
    },
    upload (file) {
      console.log(file, file.size)
      uploadFunBySys(file, 'newsLetter/img', url => {
        console.log(url)
        this.$copyText(url)
          .then(() => {
            this.$alert('图片路径[ ' + url + ' ] (已复制到粘贴板)')
          })
          .catch(() => {
            this.$alert(url, 'Code(需要手动复制)')
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
