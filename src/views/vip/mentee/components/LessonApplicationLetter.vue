<!--
 * @Author: kaan
 * @Date: 2021-06-02 14:01:56
 * @LastEditors: Kaan
 * @LastEditTime: 2022-04-15 11:55:32
 * @Version:
 * @Description:
-->
<template>
  <div class="program-montor">
    <el-drawer
      :title="`学员【${menteeName}】文书修改记录`"
      v-loading="loading"
      :visible.sync="applicationLetterModifyDoneVisible"
      :size="widths"
      :before-close="handleClose"
    >
      <div class="letter_container">
        <div class="letter_list">
          <div class="search_page" style="margin-left:20px">
            <div class="search">
              <el-select
                v-model="taskStatus"
                class="mr10 "
                size="mini"
                filterable
                clearable
                @change="Topage()"
                placeholder="taskStatus"
                :style="{width:'120px'}"
              >
                <el-option
                  v-for="item in taskStatusList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <el-button
                class="mr10"
                size="mini"
                type="primary"
                @click="toAddMenteeFile()"
              >新增文书修改</el-button>
            </div>
          </div>
          <ul class="record_list"> 
            <li class="record_item mb10" :class="[{active:categoryIndex==i}] " v-for="(item,i) in tableData" :key="i" @click="detail(item,i)">
              <el-tag class="status_icon" size="small" :type="item.taskStatus|statusFilters">{{item.taskStatusName}}</el-tag>
              <el-descriptions title="" :column="1" :contentStyle="{flex:1,textAlign:'right'}">
                <el-descriptions-item label="导师名">{{item.mentorName}}</el-descriptions-item>
                <el-descriptions-item label="简历类型">{{item.resumeTypeName}}</el-descriptions-item>
                <el-descriptions-item label="金额">
                  <template >
                    <span>{{item.taskFundType =='usd'?'$':'￥'}}{{item.taskFundWage}}</span>
                  </template>
                </el-descriptions-item>
                <el-descriptions-item label="截止日期">{{item.deadline}}</el-descriptions-item>
            </el-descriptions>
            </li>
          </ul>
        </div>
        <div class="letter_detail" v-show="detailVisible">
          <detailApplication :taskId="taskId" :showApply="showApply" :detailVisible="detailVisible" :showApply2="showApply2"  @close="detailApplicationClose" @update="updateApplication"></detailApplication>
        </div>
      </div>
    </el-drawer>
    <add :addVisible="addVisible" :signId="signId" :menteeId="menteeId" :menteeName="menteeName" @close="addClose" @submit="addSubmit"  />
    
  </div>
</template>
<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import file from '@/libs/file.js'
import add from './Add.vue'
import { downloadFunD } from '@/libs/file'
import detailApplication from './Detail.vue'
import { mapState } from 'vuex'
import util from '@/libs/util.js'

export default {
  components: {
    detailApplication, add
  },
  name: 'lessonApplicationLetter',
  mixins: [
    mixins
  ],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    applicationLetterModifyDoneVisible: {
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
      showStatus: true,
      groupId: '',
      taskId: '',
      pageSize:999,
      detailVisible: false,
      showApply: false,
      showApply2: false,
      widths: '400px',
      tableData: [],
      categoryIndex: -1,
      pageNum: 0,
      total: 0,
      loading: false,
      addVisible: false,
      mentorId: '',
      taskStatus: '',
      sortCol: '',
      sort: '',
      taskStatusList: []
    }
  },
  filters: {
    statusFilters: function (value) {
      switch(value){
        case 'on_going':
          return 'primary'
        case 'wait_vip_audit':
          return 'danger'
        case 'wait_mentee_confirm':
          return 'danger'
        case 'done':
          return 'success'
        case 'cancel':
          return 'info'
      }
      return val
    }
  },
  watch: {
    applicationLetterModifyDoneVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  mounted () {
  },
  methods: {
    async Topage () {
      this.taskStatusList = await this.getDictionary('application_letter_task_status')
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        mentorId: this.mentorId,
        menteeId: this.menteeId,
        taskStatus: this.taskStatus,
        sortCol: this.sortCol,
        sort: this.sort,
        userId: this.$store.state.role.userInfo.userId,
        groupId: this.groupId,
        signId: this.signId
      }
      this.loading = true
      api.getApplicationLetterTask(params).then(res => {
        console.log(res)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.$forceUpdate()
        this.loading = false
      })
    },
    toAddMenteeFile () {
      this.addVisible = true
    },
    addClose () {
      this.addVisible = false
    },
    addSubmit () {
      this.Topage(this.pageNum)
      this.addClose()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    handleClose () {
      Object.assign(this.$data, this.$options.data());
      this.$emit('close')
    },
    detail (data,i) {
      this.widths = '1000px'
      this.taskId = data.taskId
      this.showApply = false
      this.showApply2 = false
      this.detailVisible = true
      this.categoryIndex = i
    },

    detailApplicationClose () {
      this.widths = "400px"
      this.taskId=""
      this.categoryIndex = -1
      this.detailVisible = false
    },
    preview (path) {
      file.preview(path)
    },
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },
    changeSelect (data) {
      this.groupId = data.groupId
    },
    updateApplication () {
      this.Topage()
    }

  }

}
</script>
<style lang="scss" scoped>
.letter_container{
  display: flex;
}
.letter_list{
  width:360px;
  .record_list{
    width:100%;
    padding-left:20px;
    .record_item{
      position: relative;
      width:300px;
      padding:30px 10px 10px 10px;
      border: 1px rgba(0, 0, 0, 0.1) solid;
      border-radius: 4px;
      .status_icon{
        position: absolute;
        top:0;
        right:0;
      }
    }
    .record_item.active{
      border:1px solid #ffa333;
    }
  }
}
.letter_detail{
  flex:1
}

</style>
