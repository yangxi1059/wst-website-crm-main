<!--
 * @Author: 库建华
 * @Date: 2020-02-11 12:03:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-20 15:31:10
 * @Version:
 * @Description:
 -->
<template>
  <div>
      <div class="header" slot="title">
        【{{cooperatorName}}】的推文记录
        <el-button class="add-offer-btn ml10" @click="addTweet" type="primary" size="mini">新增推文</el-button>
      </div>
      <el-table :data="listData" size="mini" highlight-current-row style="width: 100%">
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="setTweet(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="delTweet(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="articleTitle"
          align="center"
          label="推文标题"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="readingNum"
          align="center"
          label="已读量"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="consultingNum"
          align="center"
          label="咨询导流数量"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="articleUrl"
          align="center"
          label="推文链接"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="articleIntroduction"
          align="center"
          label="推文简介"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pushDate"
          align="center"
          label="推送日期"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="note"
          align="center"
          label="备注"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          align="center"
          label="更新时间"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateByName"
          align="center"
          label="更新人"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    <setTweet
      :setTweetVisible="setTweetVisible"
      :tweetData="tweetData"
      @close="tweetClose"
      @submit="tweetSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/bd.js'
import setTweet from './set_tweet.vue'
import { downloadFun } from '@/libs/file'

export default {
  name: 'tweetList',
  components: { setTweet },
  props: {
    activeName: {
    
    },
    cooperatorData: {
      type: Object
    }
  },
  data () {
    return {
      listData: [],
      setTweetVisible: false,
      tweetData: {},
      tweetId: '',
      bdApplyVisible: false,
      applyListVisible: false,
      cooperatorName: ''
    }
  },
  watch: {
    activeName: function (val) {
      if (val == 'fouth') {
        this.Topage()
        this.cooperatorName = this.cooperatorData.cooperatorName || '无'
      }
    }
  },
  methods: {
    Topage () {
      api.getTweetList(this.cooperatorData.cooperatorId).then(res => {
        console.info(res)
        this.listData = res.data
      })
    },
    close () {
      this.$emit('close')
    },
    addTweet () {
      this.tweetData = {
        cooperatorId: this.cooperatorData.cooperatorId
      }
      this.setTweetVisible = true
    },
    setTweet (v) {
      this.tweetData = v
      this.setTweetVisible = true
    },
    tweetClose () {
      this.setTweetVisible = false
      this.tweetData = {}
    },
    tweetSubmit () {
      this.Topage()
      this.tweetClose()
    },
    delTweet (v) {
      this.$confirm('此操作将永久删除该推文, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          () => {
            this.$loading()
            api.delTweet({ pkId: v.pkId })
          }
        )
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$loading().close()
          this.Topage()
        })
        .catch(err => {
          console.log(err)
          this.$loading().close()
          // this.$message({
          //   message: "失败",
          //   type: "error"
          // });
        })
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
