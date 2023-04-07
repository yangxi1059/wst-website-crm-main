<!--
 * @Author: 杨曦
 * @Date: 2022-02-18 10:30:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-18 14:07:45
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="dictionary ">
      <el-button class="mb10" type="primary" size="mini" @click="addTrack">新增方向</el-button>
      <el-table
        :data="tableData"
        size="mini"
        border
        stripe
        @cell-dblclick="dblclick"
      >
        <el-table-column prop="trackName" align="center" label="课程方向" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeCount" align="center" label="内容数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="disableStatusName" align="center" label="状态" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <detail :detailVisible="detailVisible" :trackId="trackId" @close="closeDetail" @submit="closeSubmit" />
    <add :addVisible="addVisible"  @close="closeAdd" @submit="submitAdd" />

  </d2-container>
</template>
<script>
import axios from '@/api/dictionary'
import { mapState } from 'vuex'
import mixins from '@/plugin/mixins'
import detail from './components/detailTrack.vue'
import add from './components/addTrack.vue'

export default {
  mixins: [mixins],
  components: { detail, add },
  data () {
    return {
      tableData: [],
      loading: false,
      detailVisible: false,
      addVisible: false,
      trackId: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      axios.getLessonTrackList().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    addTrack () {
      this.addVisible = true
    },
    closeAdd () {
      this.addVisible = false
    },
    submitAdd () {
      this.addVisible = false
      this.Topage()
    },
    dblclick (row) {
      console.log(row)
      this.detailVisible = true
      this.trackId = row.trackId
    },
    closeDetail () {
      this.detailVisible = false
    },
    closeSubmit () {
      this.Topage()
    }
  }
}
</script>

<style lang='scss'>

</style>
