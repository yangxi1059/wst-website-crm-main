<!--
 * @Author: 杨曦
 * @Date: 2022-02-11 11:15:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-16 17:12:54
 * @Version: 1
 * @Description:
 -->
 <template>
    <div>
        <el-drawer
            :visible.sync="dockingAssignmentVisible"
            size="90%"
            :before-close="dockingAssignmentClose"
            title="导师对接任务"
        >
            <div style="padding:0 20px;box-sizing:border-box" v-loading="loading">
                <div>
                    <div class="search_page">
                        <div class="search">
                            <el-input
                                class="mr10"
                                size="mini"
                                style="width:150px"
                                placeholder="请输入"
                                v-model="search"
                                clearable
                                @keyup.enter.native="Topage()"
                                ></el-input>
                            <el-cascader
                              size="mini"
                              class="mr10 mb10"
                              v-model="role"
                              ref="role"
                              :options="userList"
                              :props="{ checkStrictly: true,expandTrigger:'hover' }"
                              clearable
                              @change="roleChange()"
                            >
                              <p slot-scope="{data}" @click="clickNode">{{ data.label }}</p>
                            </el-cascader>
                            <!-- <el-select style="width:150px" class="mr10" size="mini" v-model="userId" clearable placeholder="请选择">
                                <el-option
                                v-for="item in userList"
                                :key="item.userId"
                                :label="item.userName"
                                :value="item.userId">
                                </el-option>
                            </el-select> -->
                            <el-select style="width:150px" class="mr10" placeholder="任务状态" clearable size="mini" v-model="taskStatus">
                                <el-option
                                v-for="item in mentor_entry_task_status"
                                :key="item.itemValue"
                                :label="item.itemName"
                                :value="item.itemValue"
                                ></el-option>
                            </el-select>
                            <el-button @click="Topage()" size="mini">GO</el-button>
                            <el-button @click="addDocking()" v-if="roleInfo.includes(`vip_docking_add`)" type="primary">新增</el-button>
                        </div>
                        <pagination
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
                    >
                    <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="detail(scope.row)" class="mr10" size="mini" >详情</el-button>
                        <el-button type="text" v-if="scope.row.taskStatus == 'pending_check' && roleInfo.includes(`vip_docking_check`)" @click="check(scope.row)"  size="mini" >核验</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="mentorName" label="导师姓名"></el-table-column>
                    <el-table-column align="center" prop="wxId" show-overflow-tooltip label="导师微信"></el-table-column>
                    <el-table-column align="center" prop="email" show-overflow-tooltip label="导师邮箱"></el-table-column>
                    <el-table-column align="center" prop="taskStatusName" label="任务状态"></el-table-column>
                    <el-table-column align="center" prop="taskUserName" label="任务对接人"></el-table-column>
                    <el-table-column align="center" prop="createByName" label="创建人"></el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column align="center" prop="updateByName" label="更新人"></el-table-column>
                    <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
                    </el-table>
                    <detail :detailVisible="detailVisible" :dockingType="dockingType" :mentorId="mentorId" :taskDetail="taskDetail" @close="detailClose" @submit="detailSubmit"  />
                    <add :useDockingVisible="useDockingVisible" @close="addClose" @submit="addSubmit" />
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import util from '@/libs/util.js'
import { mapState } from 'vuex'
import detail from './components/detail.vue'
import add from './components/addDocking.vue'

export default {
  name: 'dockingAssignment',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    dockingAssignmentVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dockingAssignmentVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  components: { detail, add },
  data () {
    return {
      pageNum: 1,
      total: 0,
      dockingType: 0,
      tableData: [],
      taskDetail: {},
      height: document.documentElement.clientHeight - 190,
      detailVisible: false,
      useDockingVisible: false,
      mentor_entry_task_status: [],
      mentorId: '',
      loading: false,
      pageSize: 400,
      search: '',
      taskStatus: '',
      role: '',
      userId: '',
      groupId: '',
      userInfo: {},
      sortCol: 'createTime',
      userList: [],
      sort: 'desc'
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        taskStatus: this.taskStatus,
        userId: this.userId,
        groupId: this.groupId,
        sortCol: this.sortCol,
        sort: this.sort
      }
      this.loading = true
      console.log(params)
      api.getDockingList(params).then(res => {
        console.log('getNewsLetterList', res.data.rows)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    async pageInit () {
      this.userList = await this.getUserList('_')
      this.userInfo = this.$store.state.role.userInfo
      this.role = this.userInfo.userId
      const trackCascaderDic = await this.getCascaderDic('track')
      const cityCascaderDic = await this.getCascaderDic('city')
      const companyCascaderDic = await this.getCascaderDic('company')
      util.sessions.set('trackCascaderDic', trackCascaderDic)
      util.sessions.set('cityCascaderDic', cityCascaderDic)
      util.sessions.set('companyCascaderDic', companyCascaderDic)
      this.mentor_entry_task_status = await this.getDictionary('mentor_entry_task_status')
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
    detail (v) {
      console.log(v)
      this.mentorId = v.mentorId
      this.taskDetail = v
      this.dockingType = 0
      this.detailVisible = true
    },
    check (v) {
      this.mentorId = v.mentorId
      this.taskDetail = v
      this.dockingType = 1
      this.detailVisible = true
    },
    detailClose () {
      this.detailVisible = false
    },
    // 下拉选单击选中
    clickNode ($event) {
      $event.target.parentElement.parentElement.firstElementChild.click()
    },
    roleChange () {
      console.log(this.role)
      const tempObj = this.$refs.role.getCheckedNodes()[0]
      console.log(this.$refs.role.getCheckedNodes()[0])
      if (tempObj) {
        if (tempObj.hasChildren) {
          this.groupId = tempObj.value
          this.userId = ''
        } else {
          this.groupId = ''
          this.userId = tempObj.value
        }
      } else {
        this.groupId = ''
        this.userId = ''
      }
      this.$refs.role.dropDownVisible = false
    },
    detailSubmit () {
      this.detailVisible = false
      this.Topage()
    },
    dockingAssignmentClose () {
      this.$emit('close')
    },
    addDocking () {
      this.useDockingVisible = true
    },
    addSubmit () {
      this.useDockingVisible = false
      this.Topage()
    },
    addClose () {
      this.useDockingVisible = false
    }
  }
}
</script>

 <style lang="scss" scoped>
</style>
