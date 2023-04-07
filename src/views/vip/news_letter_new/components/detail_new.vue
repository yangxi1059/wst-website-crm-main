<!--
 * @Author: 库建华
 * @Date: 2020-05-12 18:21:02
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-16 16:24:45
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-drawer  title="News Letter 详情" :visible.sync="detailVisible" size="1400px" :before-close="close">
      <el-row class="mb20">
        <el-col :span="2" class="_name">标题:</el-col>
        <el-col :span="6" class="_value">{{showData.title || '暂无'}}</el-col>
        <el-col :span="2" class="_name">News日期:</el-col>
        <el-col :span="6" class="_value">{{showData.newsDate}}</el-col>
        <el-col :span="2" class="_name">展示状态:</el-col>
        <el-col :span="6" class="_value">{{showData.recodeStatus=='1'?'展示':'不展示'}}</el-col>
      </el-row>
      <el-row class="mb20">
        <div class="group_track">
          <el-col :span="2"  class="_name">行业:</el-col>
          <el-col :span="22">{{showData.trackNameFull}}</el-col>
        </div>
      </el-row>
      <el-card>
        <div v-html="text"></div>
      </el-card>
      <div style="margin:20px;float:right">
        <el-button @click="viewLetter" type="success" >查看效果</el-button>
        <el-button @click="close" type="info">取 消</el-button>
        <el-button @click="editLetter" type="primary" v-if="roleInfo.includes(`news_letter_new_edit`)">编 辑</el-button>
        <el-button @click="deleteLetter" type="danger" v-if="roleInfo.includes(`news_letter_new_delete`)">删 除</el-button>
      </div>
    </el-drawer>
    <setTask
      :setVisible="setVisible"
      :pkId="pkId"
      @close="setTaskClose"
      @submit="setTaskSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/vip'
import setTask from './set_task_new.vue'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    pkId: {
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
  },
  components: { setTask },
  data () {
    return {
      text: '',
      showData: {},
      setVisible: false
    }
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      if (this.pkId) {
        this.getNewsLetter()
      }
    },
    getNewsLetter () {
      this.$loading()
      api.getNewsLetterByTaskId2(this.pkId).then(res => {
        console.log(res.data)
        this.showData = res.data
        this.text = res.data.content || '无数据'
        this.$loading().close()
      })
    },
    clean () {
      this.newsLetterData = {}
      this.text = ''
      this.showData = {}
    },
    close () {
      this.$emit('close')
      this.clean()
    },
    deleteLetter () {
      this.$confirm('此操作将永久删除此条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading()
        api.delNewsLetter2(this.pkId).then(() => {
          this.$loading().close()
          this.$emit('deleteTask')
        })
      })
    },
    editLetter () {
      this.setVisible = true
    },
    setTaskClose () {
      this.setVisible = false
    },
    setTaskSubmit () {
      this.initPage()
      this.$emit('submit')
      this.setVisible = false
    },
    viewLetter () {
      this.$message.warning('暂未开放')
    }
  }
}
</script>

<style lang="scss" scoped>
._name{
  font-weight: 600;
  text-align: right;
  padding-right: 20px;
}
.group_track{
  display: flex;
  flex-wrap: wrap;
}
</style>
