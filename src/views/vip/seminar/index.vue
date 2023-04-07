<!--
 * @Author: 库建华
 * @Date: 2020-05-13 09:57:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-06-29 17:23:43
 * @Version: 1
 * @Description:
 -->
 <template>
  <d2-container v-loading="loading" >
    <div>
      <div class="search_page">
        <div class="search">
          <el-input
            class="mr10"
            :style="{width:'150px'}"
            size="mini"
            v-model="search"
            clearable
            placeholder="支持名称"
            v-if="roleInfo.includes(`seminar_search`)"
          ></el-input>
          <el-button size="mini" plain @click="Topage()">GO</el-button>
          <el-button
            v-if="roleInfo.includes(`seminar_add`)"
            icon="el-icon-edit-outline"
            class="mr10"
            size="mini"
            plain
            @click="add()"
          >新增</el-button>
        </div>
        <pagination
          v-if="roleInfo.includes(`seminar_page`)"
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
        highlight-current-row
      >
        <el-table-column width="300" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`seminar_edit`)"
              type="text"
              size="mini"
              @click="edit(scope.row.seminarId)"
              class="el-icon-tickets"
            >编辑</el-button>
            <el-button
              v-if="roleInfo.includes(`seminar_session`)"
              type="text"
              size="mini"
              @click="session(scope.row.seminarId)"
              class="el-icon-tickets"
            >课程</el-button>
            <el-button
              v-if="roleInfo.includes(`seminar_invitation_code`)"
              type="text"
              size="mini"
              @click="invitation(scope.row.seminarId)"
              class="el-icon-tickets"
            >邀请码</el-button>
            <el-button
              v-if="roleInfo.includes(`seminar_delete`)"
              type="text"
              size="mini"
              @click="deleteSeminar(scope.row.seminarId)"
              class="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="seminarName" label="线下课名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="introduction" label="线下课简介" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="seminarStartTime" label="开始时间"></el-table-column>
        <el-table-column align="center" prop="seminarEndTime" label="结束时间"></el-table-column>
        <el-table-column align="center" prop="deadLine" label="截止时间"></el-table-column>
        <el-table-column align="center" prop="address" label="地址"></el-table-column>
        <el-table-column align="center" prop="seminarStatusName" label="状态"></el-table-column>
        <el-table-column align="center" prop="updateByName" label="更新人"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <setSeminar
        :setVisible="setVisible"
        :seminarId="seminarId"
        @close="setSeminarClose"
        @submit="setSeminarSubmit"
      />
      <seminarSession
        :sessionVisible="sessionVisible"
        :seminarId="seminarId"
        @close="seminarSessionClose"
      />
      <invitation
        :invitationVisible="invitationVisible"
        :seminarId="seminarId"
        @close="invitationClose"
      />
      <detail :detailVisible="detailVisible" :seminarId="seminarId" @close="detailClose" />
    </div>
  </d2-container>
</template>

<script>
import setSeminar from './components/set_seminar.vue'
import seminarSession from './components/seminar_session.vue'
import invitation from './components/invitation.vue'
import detail from './components/detail.vue'

import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  name: 'seminar',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { setSeminar, detail, seminarSession, invitation },
  data () {
    return {
      pageNum: 1,
      total: 0,
      search: '',
      seminarStatus: '',
      tableData: [],
      setVisible: false,
      sessionVisible: false,
      invitationVisible: false,
      detailVisible: false,
      seminarId: '',
      seminar_status: [],
      loading: false,
      pageSize: 400
    }
  },
  mounted () {
    this.Topage()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.seminar_status = await this.getDictionary('seminar_status')
    },
    Topage () {
      this.loading = true
      const params = {
        search: this.search,
        seminarStatus: this.seminarStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      api.getSeminarList(params).then(res => {
        console.log('getSeminarList', res)
        this.tableData = res.data.rows
        this.tableData.forEach(v => {
          v.actualNum = v.actualNum !== undefined ? v.actualNum : '--'
          v.successNum = v.successNum !== undefined ? v.successNum : '--'
        })
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
      this.seminarId = ''
      this.setVisible = true
    },
    edit (seminarId) {
      this.seminarId = seminarId
      this.setVisible = true
    },
    session (seminarId) {
      this.seminarId = seminarId
      this.sessionVisible = true
    },
    invitation (seminarId) {
      this.seminarId = seminarId
      this.invitationVisible = true
    },
    detail (v) {
      console.log(v)
      this.seminarId = v.seminarId
      this.detailVisible = true
    },
    deleteSeminar (seminarId) {
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api.delSeminar(seminarId).then(res => {
          console.log(res)
          this.Topage()
        })
      })
    },
    detailClose () {
      this.detailVisible = false
    },
    setSeminarClose () {
      this.setVisible = false
    },
    setSeminarSubmit () {
      this.Topage()
      this.setSeminarClose()
    },
    seminarSessionClose () {
      this.sessionVisible = false
    },
    invitationClose () {
      this.invitationVisible = false
    }
  }
}
</script>

 <style lang="scss" scoped>
</style>
