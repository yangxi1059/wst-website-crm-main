<!--
 * @Author: 库建华
 * @Date: 2020-05-12 15:49:30
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-16 15:30:46
 * @Version: 1
 * @Description:
 -->
 <template>
  <d2-container v-loading="loading">
    <div>
        <div class="search_page">
        <div class="search">
            <el-button
            v-if="roleInfo.includes(`news_letter_new_add`)"
            icon="el-icon-edit-outline"
            class="mr10"
            type="primary"
            size="mini"
            plain
            @click="add()"
            >新增</el-button>
        </div>
        <pagination
            v-if="roleInfo.includes(`news_letter_page`)"
            :total="total"
            :current-page="pageNum"
            :page-size="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        ></pagination>
        </div>
        <el-table
        :data="tableData"
        size="mini"
        :max-height="height"
        stripe
        highlight-current-row
        @row-dblclick="detail"
        >
        <el-table-column align="center" prop="title" label="标题"></el-table-column>
        <el-table-column align="center" prop="newsDate" label="新闻日期"></el-table-column>
        <el-table-column align="center" prop="recodeStatus" label="可见状态">
            <template slot-scope="scope">
            {{scope.row.recodeStatus == '1'?'可见':'不可见'}}
            </template>
        </el-table-column>
        <el-table-column align="center" prop="trackName" label="行业"></el-table-column>
        <el-table-column align="center" prop="viewCount" label="阅读次数"></el-table-column>
        <el-table-column align="center" prop="updateByName" label="更新人"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        </el-table>
        <setTask :setVisible="setVisible" :pkId="pkId" @close="setTaskClose" @submit="setTaskSubmit"/>
        <detail :detailVisible="detailVisible" :pkId="pkId" @close="detailClose" @deleteTask="deleteTaskNew" @submit="detailSubmit"/>
    </div>
  </d2-container>
</template>

<script>
import setTask from './components/set_task_new.vue'
import detail from './components/detail_new.vue'
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  name: 'newsLetter',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { setTask, detail },
  data () {
    return {
      pageNum: 1,
      total: 0,
      tableData: [],
      height: document.documentElement.clientHeight - 190,
      setVisible: false,
      detailVisible: false,
      testSendVisible: false,
      receiptVisible: false,
      loading: false,
      pageSize: 400,
      pkId: null
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.loading = true
      api.getNewsLetterList2(params).then(res => {
        console.log('getNewsLetterList', res)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    add () {
      this.pkId = ''
      this.setVisible = true
    },
    edit (pkId) {
      this.pkId = pkId
      this.setVisible = true
    },
    receipt (pkId) {
      this.pkId = pkId
      this.receiptVisible = true
    },
    detail (v) {
      console.log(v)
      this.pkId = v.pkId
      this.detailVisible = true
    },
    testSend (v) {
      console.log(v)
      this.pkId = v
      this.testSendVisible = true
    },
    testSendClose () {
      this.testSendVisible = false
    },
    detailSubmit () {
      this.Topage()
    },
    deleteTask (pkId) {
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading()
        api.delNewsLetter(pkId).then(res => {
          console.log(res)
          this.$loading().close()
          this.Topage()
        })
      })
    },
    detailClose () {
      this.detailVisible = false
    },
    deleteTaskNew () {
      this.Topage()
      this.detailVisible = false
    },
    setTaskClose () {
      this.setVisible = false
    },
    receiptClose () {
      this.receiptVisible = false
    },
    setTaskSubmit () {
      this.Topage()
      this.setTaskClose()
    }
  }
}
</script>

 <style lang="scss" scoped>
</style>
