<!--
 * @Author: kaan
 * @Date: 2021-07-07 13:15:08
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 10:20:40
 * @Version:
 * @Description:
-->
<template>
  <div class="follow_up_container">
    <el-dialog
    :close-on-click-modal="false"
      title="Follow up"
      class="info"
      :visible.sync="followUpVisible"
      width="1300px"
      :before-close="followUpClose"
    >
      <div class="staff_module">
        <el-divider content-position="left">今日还需跟进人数情况汇总📝
          <el-divider direction="vertical"></el-divider>当前选中销售：<span class="staff_name">{{currentUser}}</span>
          <el-divider direction="vertical"></el-divider>待跟进数：<span class="staff_count">{{currentCount}}</span>
        </el-divider>
        <i class="more_icon" :class="boxShow==true?'el-icon-caret-top':'el-icon-caret-bottom'"  @click="showMore"></i>
        <div class="staff_content" :class="boxShow==true?'staff_content_more':'staff_content_hide'" :style="{height:staffH}">
          <ul ref="staffs" class="staff_list">
            <li class="staff_item" v-for="(v,index) in followUpMemberList">
              <el-badge :value="v.followNum" v-if="v.followNum>0">
                <el-tag
                  type="danger"
                  :effect="v.userId == currentUserId ?'dark':'plain'"
                  @click="select(v)"
                >{{v.userName}}</el-tag>
              </el-badge>
              <el-tag
                  v-else
                  type="info"
                  :effect="v.userId == currentUserId ?'dark':'plain'"
                  @click="select(v)"
                >{{v.userName}}</el-tag>
            </li>
          </ul>
        </div>
      </div>
      <div class="follow_module">
        <div class="follow_module_list">
          <el-divider content-position="left">待跟进列表 </el-divider>
          <el-table
            ref="toFollowUp"
            :data="toFollowUpList"
            size="mini"
            highlight-current-row
            @row-click="handleCurrentChangeTable"
            border
            style="width: 100%;margin-bottom:10px"
          >
            <!-- <el-table-column prop="menteeName" align="center" label="学员名"></el-table-column> -->
            <el-table-column prop="wxName" align="center" label="微信名"></el-table-column>
            <el-table-column prop="wxId" align="center" label="微信ID"></el-table-column>
            <el-table-column  align="center" label="follow起始截止时间" width="160">
              <template slot-scope="scope">
                {{scope.row.beginDate}} ~ {{scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column prop="sourceWxName" align="center" label="导流微信号"></el-table-column>
          </el-table>
          <pagination
            :total="total"
            :current-page="pageNum"
            :pageSizes="[10]"
            :page-size="10"
            @handleCurrentChange="handleCurrentChange"
          ></pagination>
        </div>
        <div class="follow_module_history">
          <el-divider content-position="left">学员历史记录</el-divider>
          <!-- <el-row class="user_info">
            <el-col class="history_list_col" :span="4">学员名</el-col>
            <el-col class="history_list_col" :span="8">{{userInfo.realName || "-"}}</el-col>
            <el-col class="history_list_col" :span="4">学员微信：</el-col>
            <el-col class="history_list_col" :span="8">{{userInfo.wxId || "-"}}</el-col>
            <el-col class="history_list_col" :span="4">微信名：</el-col>
            <el-col class="history_list_col" :span="8">{{userInfo.wxName || "-"}}</el-col>
            <el-col class="history_list_col" :span="4">导流微信号：</el-col>
            <el-col class="history_list_col" :span="8">{{userInfo.sourceWxName || "-"}}</el-col>
          </el-row> -->
          <ul class="history_list">
            <li class="history_list_item" v-for="(item,i) in followUpHistory" :key="i" @click="handleClick(item,i)">
              <div class="history_list_item_tail"></div>
              <div class="history_list_item_node"></div>
              <div class="history_list_item_wrapper">
                <el-card
                  :class="[statusBg[item.followStatus], {active:categoryIndex==i}]"
                >
                  <el-tag
                    class="follow_status"
                    :type="statusBg[item.followStatus]"
                    effect="dark"
                    size="small"
                  >
                    {{ item.achievement }}
                  </el-tag>
                  <el-form
                    :inline="true"
                    :model="item"
                    :ref="'item'+i"
                    :rules="rules"
                    label-width="110px"
                  >
                    <el-form-item label="follow时间：" size="mini">
                      <p :style="{width:widthHis}">{{item.followTime || "-"}}</p>
                    </el-form-item>
                    <el-form-item label="follow次数：" size="mini">
                      <p :style="{width:widthHis}">{{item.times || "-"}}</p>
                    </el-form-item>
                    <el-form-item label="起始日期：" size="mini">
                      <p :style="{width:widthHis}">{{item.beginDate || "-"}}</p>
                    </el-form-item>
                    <el-form-item label="截止日期：" size="mini">
                      <p :style="{width:widthHis}">{{item.endDate || "-"}}</p>
                    </el-form-item>
                    <el-form-item label="跟进内容：" size="mini" v-if="item.followStatus != 0">
                      <p :style="{width:widthTextA}">{{item.remark || "-"}}</p>
                    </el-form-item>
                    <div v-if="item.followShow">
                      <el-form-item label="跟进内容：" size="mini" prop="remark">
                        <el-input
                          v-model="item.remark"
                          clearable
                          type="textarea"
                          :rows="3"
                          maxlength="10000"
                          minlength="15"
                          placeholder="请输入跟进内容"
                          :style="{width:widthTextA}"
                          :autosize="{ minRows: 2, maxRows: 6}"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="follow结果：" size="mini" prop="newStatus">
                        <el-select v-model="item.newStatus" size="mini" filterable placeholder="请选择"
                                  :style="{width:widthHis} " :disabled="item.signStatus == 1">
                          <el-option
                            v-for="item in statusList[position]"
                            :key="item"
                            :label="item"
                            :value="item"
                          ></el-option>
                        </el-select>
                        <span style="color:#e6a23c" v-if="item.signStatus == 1">已签约follow</span>
                      </el-form-item>
                      <el-form-item label="分配部门：" size="mini" prop="counselorGroup" v-if="('已回复，已拉销售' == item.newStatus)">
                        <el-select v-model="item.counselorGroup" filterable placeholder="请选择" size="mini" :style="{width:widthHis} ">
                          <el-option
                            v-for="item in counselorgroup"
                            :key="item"
                            :label="item"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="分配顾问：" size="mini" prop="counselorWx" v-if="('已回复，已拉销售' == item.newStatus)">
                        <el-select v-model="item.counselorWx" filterable placeholder="请选择" size="mini" :style="{width:widthHis} ">
                          <el-option
                            v-for="item in counselorWx"
                            :key="item.accountId"
                            :label="item.accountInfo"
                            :value="item.accountId"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="分配日期：" size="mini" prop="counselorDate" v-if="('已回复，已拉销售' == item.newStatus)">
                        <el-date-picker
                          v-model="item.counselorDate"
                          :picker-options="pickerOptions"
                          :clearable="false"
                          :editable="false"
                          :style="{width:widthHis} "
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          size="mini"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </el-form>
                  <el-row v-if="item.followShow">
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      @click="submit(item,i)"
                      style="float:right">提交</el-button>
                  </el-row>
                </el-card>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'

export default {
  mixins: [mixins],
  name: 'followUp',
  props: {
    followUpIdList: {
      type: Array
    },
    // toFollowUpList: {
    //   type: Array,
    //   default: []
    // },
    // followUpMemberList: {
    //   type: Array
    // },
    followUpVisible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String
    }
  },
  data () {
    return {
      pagerCount: 3,
      currentUser: '无',
      currentUserId: '',
      currentCount: '',
      followUpMemberList: [],
      boxShow: false,
      staffH: '35px',

      toFollowUpList: [],
      total: 0,
      pageNum: 1,
      currentRow: {},

      // userInfo:{
      //   realName:"",
      //   wxId:"",
      //   wxName:"",
      //   sourceWxName:"",
      // },
      followUpHistory: [],
      widthHis: '170px',
      widthTextA: '470px',
      categoryIndex: -1,
      statusBg: ['warning', 'success', 'danger'],
      statusList: {
        sales_assistant: [
          '被删除',
          '未回复',
          '已回复，未拉销售',
          '已回复，已拉销售',
          'SPY'
        ],
        sales: [
          '未签约，未知是否感兴趣',
          '未签约，表明不感兴趣',
          '被删除',
          'SPY',
          '已签约'
        ],
        VIP: ['未回复', '已回复', '已结束合同']
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      rules: {
        remark: [{ message: '必填', required: true, trigger: 'blur' }],
        newStatus: [{ message: '必填', required: true, trigger: 'blur' }],
        counselorGroup: [{ message: '必填', required: true, trigger: 'blur' }],
        counselorWx: [{ message: '必填', required: true, trigger: 'blur' }],
        counselorDate: [{ message: '必填', required: true, trigger: 'blur' }]
      }

    }
  },
  watch: {
    followUpVisible: function (val) {
      if (val) this.Togage()
    }
  },
  created () {
    api.getCounselor('wst_sales').then(res => {
      console.log(res)
      this.counselorWx = res.data
    })
    // this.getListData(1);
  },
  methods: {
    select (user) {
      this.currentUser = user.userName
      this.currentUserId = user.userId
      this.currentCount = user.followNum
      this.getFollowUpList()
    },
    /**
     * @description: 跟进人数展开收缩
     * @param {*}
     * @return {*}
     */
    showMore () {
      !this.boxShow ? this.staffH = this.$refs.staffs.offsetHeight + 'px' : this.staffH = '35px'
      this.boxShow = !this.boxShow
    },
    Togage () {
      this.clear()
      this.getFollowUp()
    },
    /**
     * @description: 获取本人及下属的今日待follow数量(销售)
     * @param {*}
     * @return {*}
     */
    getFollowUp () {
      if (this.position == 'sales') {
        api.getFollowUpSales().then(res => {
          console.log(res)
          this.followUpMemberList = res.data
          this.toFollowUpList = []
          if (this.followUpMemberList.length > 0) this.select(this.followUpMemberList[0])
        })
      } else if (this.position == 'sales_assistant') {
        api.getFollowUpAssistant().then(res => {
          console.log(res)
          this.followUpMemberList = res.data
          this.toFollowUpList = []
          if (this.followUpMemberList.length > 0) this.select(this.followUpMemberList[0])
        })
      }
    },
    /**
     * @description: 获取具体某销售今日需follow列表（分页）
     * @param {*}
     * @return {*}
     */
    getFollowUpList () {
      const params = {
        pageNum: this.pageNum,
        pageSize: 10,
        userId: this.currentUserId
      }
      if (this.position == 'sales') {
        api.getFollowUpListTodaySales(params).then(res => {
          this.total = res.data.total
          this.toFollowUpList = res.data.rows
          this.followUpHistory = []
          if (this.total > 0) this.setCurrent(this.toFollowUpList[0])
        })
      } else if (this.position == 'sales_assistant') {
        api.getFollowUpListTodayAssistant(params).then(res => {
          this.total = res.data.total
          this.toFollowUpList = res.data.rows
          this.followUpHistory = []
          if (this.total > 0) this.setCurrent(this.toFollowUpList[0])
        })
      }
    },
    // 选中行
    setCurrent (row) {
      console.log(row)
      this.$refs.toFollowUp.setCurrentRow(row)
      this.getHistoryList(row.menteeId)
    },
    handleCurrentChangeTable (row) {
      console.log(row)
      this.getHistoryList(row.menteeId)
    },
    // 分页插件回调：页码，每页条数
    handleCurrentChange (val) {
      console.log(val)
      this.pageNum = val
      this.getFollowUpList()
    },
    /**
     * @description: 获取学员历史记录
     * @param {*} menteeId
     * @return {*}
     */
    getHistoryList (menteeId) {
      this.followUpHistory = []
      const data = {
        pageNum: 1,
        pageSize: 1000,
        position: this.position
      }
      console.log('position', this.position)
      api.getFollowUpListData(menteeId, data).then(res => {
        console.log('follow up数据：', res)
        const list = res.data.rows
        // if(list.length>0){
        //   this.userInfo = {
        //     realName: list[0].realName,
        //     wxId: list[0].wxId,
        //     wxName: list[0].wxName,
        //     sourceWxName: list[0].sourceWxName
        //   }
        // }
        list.forEach((v) => {
          const nowTime = new Date()
          const beginDate = new Date(v.beginDate + ' 00:00:00')
          const endDate = new Date(v.endDate + ' 23:59:59')
          if (v.followStatus == 0 && nowTime > beginDate && nowTime < endDate) {
            v.followShow = true
          } else {
            v.followShow = false
          }
          if (v.followStatus == 0 && v.signStatus == 1) {
            v.newStatus = '已签约'
          } else {
            v.newStatus = ''
          }
          v.counselorGroup = ''
          v.counselorWx = ''
          v.counselorDate = ''
        })
        this.followUpHistory = list
        console.log(this.followUpHistory)
      })
    },
    handleClick (item, index) {
      this.categoryIndex = index
    },
    submit (data, i) {
      this.$refs['item' + i][0].validate((valid) => {
        console.log(valid)
        if (!valid) return
        this.setFollowUp(data)
      })
    },
    setFollowUp (data) {
      // if(data.remark == "" || data.remark ==undefined){
      //   this.$message({
      //     message: '跟进内容不能为空',
      //     type: 'warning'
      //   });
      //   return
      // }
      // if(data.newStatus == ""){
      //   this.$message({
      //     message: 'follow结果不能为空',
      //     type: 'warning'
      //   });
      //   return
      // }
      // if(data.newStatus == "已回复，已拉销售" && data.counselorGroup == ""){
      //   this.$message({
      //     message: '分配部门不能为空',
      //     type: 'warning'
      //   });
      //   return
      // }
      // if(data.newStatus == "已回复，已拉销售" && data.counselorWx == ""){
      //   this.$message({
      //     message: '分配顾问不能为空',
      //     type: 'warning'
      //   });
      //   return
      // }
      // if(data.newStatus == "已回复，已拉销售" && data.counselorDate == ""){
      //   this.$message({
      //     message: '分配顾问日期不能为空',
      //     type: 'warning'
      //   });
      //   return
      // }
      const followUpSubmitData = {
        menteeId: data.menteeId,
        pkId: data.pkId,
        remark: data.remark,
        achievement: data.newStatus,
        counselorWx: data.counselorWx,
        counselorDate: data.counselorDate,

        beginDate: data.beginDate,
        endDate: data.endDate,
        createPosition: this.position,
        counselorGroup: data.counselorGroup
      }
      console.log(followUpSubmitData, 'yxfollow up的数据***')
      console.log(this.position)
      if (this.position == 'sales_assistant') {
        api.assistantSetFollowUp(followUpSubmitData).then(res => {
          this.$message.success(res.data)
          console.log('提交follow up数据：', res)
          this.Togage()
        })
      } else {
        api.setFollowUp(followUpSubmitData).then(res => {
          this.$message.success(res.data)
          console.log('提交follow up数据：', res)
          this.Togage()
        })
      }
    },

    clear () {
      this.currentUser = '无',
      this.currentUserId = '',
      this.currentCount = '',
      this.staffH = '35px',
      this.categoryIndex = -1
      this.followUpMemberList = []
      this.boxShow = false
      this.toFollowUpList = []
      this.total = 0
      this.pageNum = 1
      this.currentRow = {}
      this.followUpHistory = []
    },
    followUpClose () {
      this.$emit('close')
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.follow_up_container{
  position:relative;
}
.staff_module{
  position:absolute;
  width:1260px;
  height:auto;
  top:50px;
  left:20px;
  z-index:10;
  background:#FFF;
  .staff_content{
    position:relative;
    margin-top: -25px;
    padding-top:25px;
    padding-right:30px;
  }
  .staff_content_hide{
    overflow: hidden;
    transition: all 0.5s ease-in-out;
  }
  .staff_content_more{
    // height:120px;
    border-bottom: 1px solid #dcdfe6d2;
    overflow: hidden;
    box-shadow: 0 5px 5px 0 rgba(114, 113, 113, 1);
    transition: all 0.5s ease-in-out;
    border-radius: 5px;
  }
  .more_icon{
    position:absolute;
    top:55px;
    right:10px;
    font-size:20px;
    cursor: pointer;
    z-index: 100;
  }
}
.staff_item {
  cursor: pointer;
  margin: 0px 0px 15px 20px;
  display: inline-block;
  // color: darkgray;
}
.staff_name{
  font-size: 18px;
  font-weight:600;
  text-decoration:underline
}
.staff_count{
  color:red
}
.follow_module{
  margin-top:60px;
  width:100%;
  height:auto;
}
.follow_module_list{
  width:45%;
  display: inline-block;
  vertical-align:top;
}
.follow_module_history{
  width:55%;
  display: inline-block;
  vertical-align:top;
}
.history_list{
  padding-left:30px;
  .history_list_item{
    position: relative;
    padding-bottom: 20px;
    .history_list_item_tail{
      position: absolute;
      left: 4px;
      height: 100%;
      border-left: 2px solid #e4e7ed;
    }
    .history_list_item_node{
      position: absolute;
      left: -1px;
      width: 12px;
      height: 12px;
      background-color: #e4e7ed;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .history_list_item_wrapper{
      position: relative;
      padding-top:15px;
      padding-left: 28px;
      .follow_status{
        position:absolute;
        top:30px;
        right:20px;
      }
    }
    .history_list_col{
      margin-bottom:10px;
    }
  }
  .active.warning, .warning:hover{
    border:1px solid #e6a23c;
    box-shadow: 0px 0px 10px #faecd8;
  }

  .active.danger, .danger:hover{
    border:1px solid #f56c6c;
    box-shadow: 0px 0px 10px #fde2e2;
  }
  .active.success, .success:hover{
    border:1px solid #67c23a;
    box-shadow: 0px 0px 10px #e1f3d8;
  }
}
</style>
