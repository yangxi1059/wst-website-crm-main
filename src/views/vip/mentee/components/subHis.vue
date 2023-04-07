<!--
 * @Author: kaan
 * @Date: 2021-06-02 14:01:56
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-05 16:29:26
 * @Version:
 * @Description:
-->
<template>
  <div class="program-montor">
    <el-drawer
      :title="`学员【${menteeName}线下课订阅情况`"
      v-loading="loading"
      :visible.sync="subHisVisible"
      :size="'70%'"
      :before-close="handleClose"
    >
      <div class="letter_container">
        <el-table
          :data="tableData"
          size="mini"
          highlight-current-row
        >
          <el-table-column align="center" prop="seminarName" label="线下课名称"></el-table-column>
          <el-table-column align="center" prop="sessionTopic" label="课程主题"></el-table-column>
          <el-table-column align="center" prop="sessionTime" label="课程时间"></el-table-column>
          <el-table-column align="center" prop="needHour" label="所需课时"></el-table-column>
          <el-table-column align="center" prop="sessionApplyStatusName" label="申请状态"></el-table-column>
          <el-table-column align="center" prop="createTime" label="申请时间"></el-table-column>
        </el-table>
      </div>
    </el-drawer>

  </div>
</template>
<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'

export default {
  components: {},
  name: 'subHis',
  mixins: [
    mixins
  ],
  computed: {},
  props: {
    signId: {
      type: String,
      default: ''
    },
    subHisVisible: {
      type: Boolean,
      default: false
    },
    menteeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  watch: {
    subHisVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  mounted () {
  },
  methods: {
    async Topage () {
      this.loading = true
      api.getSubHisArr(this.signId).then(res => {
        console.log(res)
        this.tableData = res.data
        this.loading = false
      })
    },
    handleClose () {
      this.tableData = []
      this.$emit('close')
    }
  }

}
</script>
<style lang="scss" scoped>
.letter_container{
  box-sizing: border-box;
  padding: 0 20px;
}
</style>
