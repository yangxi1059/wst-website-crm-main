<!--
 * @Author: 库建华
 * @Date: 2020-05-13 10:58:46
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-20 14:25:10
 * @Version: 1
 * @Description:
 -->
 <template>
  <div>
    <el-drawer  title="详情" :visible.sync="sessionVisible" size="90%" :before-close="close">
      <div class="header" slot="title">
        课程列表：
        <el-button
          class="add-offer-btn mr10"
          @click="add"
          type="primary"
          plain
          round
          size="small"
        >新增</el-button>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
      >
        <el-table-column width="200" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="roleInfo.includes(`seminar_edit`)"
              type="text"
              size="mini"
              @click="edit(scope.row.sessionId)"
              class="el-icon-tickets"
            >编辑</el-button>
            <el-button
              v-if="roleInfo.includes(`seminar_session`)"
              type="text"
              size="mini"
              @click="applyList(scope.row.sessionId)"
              class="el-icon-tickets"
            >报名</el-button>
            <el-button
              v-if="roleInfo.includes(`seminar_delete`)"
              type="text"
              size="mini"
              @click="deleteSeminarSession(scope.row.sessionId)"
              class="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sessionTopic" label="课程主题" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="sessionContent" label="课程内容" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="speaker" label="主讲人" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="speakerIntroduction"
          label="主讲人介绍"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="sessionTypeName" label="课程类型"></el-table-column>
        <!-- <el-table-column align="center" prop="sessionStatusName" label="课程状态"></el-table-column> -->
        <el-table-column align="center" prop="needHour" label="所需课时数"></el-table-column>
        <el-table-column align="center" prop="sessionTime" label="课程开始时间"></el-table-column>
        <el-table-column align="center" prop="sessionEndTime" label="课程结束时间"></el-table-column>
        <el-table-column align="center" prop="sessionHour" label="课程时长（小时）"></el-table-column>
        <el-table-column align="center" prop="limitNum" label="报名限制人数"></el-table-column>
        <el-table-column align="center" prop="applyNum" label="已报名人数"></el-table-column>
        <el-table-column align="center" prop="invitationCodeStatusName" label="允许邀请码报名"></el-table-column>
        <el-table-column align="center" prop="codeApplyNum" label="邀请码已报名人数"></el-table-column>
        <el-table-column align="center" prop="updateByName" label="更新人"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="createByName" label="创建人"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      </el-table>
    </el-drawer>
    <setSeminarSession
      :setVisible="setVisible"
      :sessionId="sessionId"
      :seminarId="sessionSeminarId"
      @close="setSeminarSessionClose"
      @submit="setSeminarSessionSubmit"
    />
    <apply-list
      :applyVisible="applyVisible"
      :sessionId="sessionId"
      @close="applyListClose"
    />
  </div>
</template>

<script>
import setSeminarSession from './set_seminar_session.vue'
import applyList from './apply_list.vue'

import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  name: 'seminarSession',
  mixins: [mixins],
  components: { setSeminarSession, applyList },
  props: {
    sessionVisible: {
      type: Boolean,
      default: false
    },
    seminarId: {
      type: String,
      default: ''
    }
  },
  computed:{
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      sessionId: '',
      sessionSeminarId: '',
      sessionStatus: '',
      sessionType: '',
      tableData: [],
      setVisible: false,
      applyVisible: false,
      session_status: [],
      session_type: []
    }
  },
  watch: {
    sessionVisible: function (val) {
      this.sessionSeminarId = this.seminarId
      if (val) {
        this.Topage()
        this.pageInit()
      }
    }
  },
  mounted () {
  },
  methods: {
    async pageInit () {
      this.session_status = await this.getDictionary('session_status')
      this.session_type = await this.getDictionary('session_type')
    },
    Topage () {
      const params = {
        sessionStatus: this.sessionStatus,
        sessionType: this.sessionType,
        seminarId: this.seminarId
      }
      this.$loading()
      api.getSeminarSessionList(params).then(res => {
        console.log('getSeminarSessionList', res)
        this.tableData = res.data
        // this.tableData.forEach(v => {
        //   v.actualNum = v.actualNum !== undefined ? v.actualNum : "--";
        //   v.successNum = v.successNum !== undefined ? v.successNum : "--";
        // });
        this.$loading().close()
      })
    },
    close () {
      this.tableData = []
      this.$emit('close')
    },
    add () {
      this.sessionId = ''
      this.setVisible = true
    },
    edit (sessionId) {
      this.sessionId = sessionId
      this.setVisible = true
    },
    session (sessionId) {
      this.sessionId = sessionId
      this.sessionVisible = true
    },
    applyList (v) {
      console.log(v)
      this.sessionId = v
      this.applyVisible = true
    },
    deleteSeminarSession (sessionId) {
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading()
        api.delSeminarSession(sessionId).then(res => {
          console.log(res)
          this.$loading().close()
          this.Topage()
        })
      })
    },
    applyListClose () {
      this.applyVisible = false
    },
    setSeminarSessionClose () {
      this.setVisible = false
    },
    setSeminarSessionSubmit () {
      this.Topage()
      this.setSeminarSessionClose()
    },
    seminarSessionClose () {
      this.sessionVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
