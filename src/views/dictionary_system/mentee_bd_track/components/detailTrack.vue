<!--
 * @Author: 库建华
 * @Date: 2020-06-29 19:13:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-18 16:00:57
 * @Version: 1
 * @Description:
-->
<template>
  <div class="detailTrack_yx">
    <el-dialog
      title="详情"
      class="info"
      :close-on-click-modal="false"
      :visible.sync="detailVisible"
      width="550px"
      :before-close="handleClose"
    >
      <el-descriptions size="medium" :column="2">
        <el-descriptions-item label="课程方向：">{{detailTrack.trackName}}</el-descriptions-item>
        <el-descriptions-item label="课程状态：">{{detailTrack.disableStatusName}}</el-descriptions-item>
    	</el-descriptions>
      <div>
        <div>课程内容：</div>
        <div  v-for="(item) in detailTrack.typeList" :key="item.pkId">
					<div :class="item.disableStatus == '1'?'disabledClass':'ingClass'" >
						{{item.contentType}}
					</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDetail">编辑</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <edit :editVisible="editVisible" :trackId="trackId" @close="editClose" @submit="editSubmit" />
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import edit from './editTrack.vue'
export default {
  mixins: [mixins],
  name: 'detailTrack',
  components: { edit },
  props: {
    trackId: {
      type: String,
      default: ''
    },
    detailVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editVisible: false,
      detailTrack: {}
    }
  },
  mounted () {
  },
  watch: {
    detailVisible: function (newData) {
      if (newData) {
        this.toPage()
      }
    }
  },
  methods: {
    toPage () {
      apiDic.detailLessonTrackList(this.trackId).then(res => {
        this.detailTrack = res.data
        console.log(res)
      })
    },
    handleClose () {
      this.detailTrack = {}
      this.$emit('close')
    },
    editDetail () {
      this.editVisible = true
        console.log(1111)
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editVisible = false
      this.toPage()
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
  .ingClass,.disabledClass{
    width: 100%;
    line-height: 42px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, .1);
    margin-top: 10px;
    text-indent: 12px;
  }
  .ingClass{
    background-color: rgba(227,228,228);
  }
</style>
