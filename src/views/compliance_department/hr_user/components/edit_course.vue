<!--
 * @Author: 杨曦
 * @Date: 2020-12-31 11:16:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 10:49:06
 * @Version:
 * @Description:
-->
<template>
  <div class="pay-way">
    <el-dialog :close-on-click-modal="false"
      width="1400px"
      title="居酒屋权限设置"
      :visible.sync="courseDetailVisible"
      :before-close="close"
    >
        <el-table
        :data="tableData"
        size="small"
        :loading="loading"
        ref="table"
        :max-height="'560px'"
        style="width: 100%">
            <el-table-column prop="userName" align="center" fixed  width="180" label="用户名" ></el-table-column>
            <el-table-column prop="userAcc" align="center" width="100" label="账号" ></el-table-column>
            <el-table-column prop="deptName" align="center" label="部门" width="80"></el-table-column>
            <el-table-column align="center" label="录播课">
                <el-table-column
                    :render-header="renderHeaderLessons"
                    align="center"
                    width="160"
                >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.courseToken" size="small" @change="changeCourseAll(scope.$index)" :controls="false"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="courseTokenUsed"
                    label="已用课时数"
                    width="80"
                    >
                </el-table-column>
                <el-table-column
                    :render-header="renderHeaderLessonsResult"
                    align="center"
                    width="160"
                 >
                     <template slot-scope="scope">
                        <el-input-number v-model="scope.row.name6" size="small" @change="changeCourseResult(scope.$index)" :controls="false"></el-input-number>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="直播课">
                <el-table-column
                    :render-header="renderHeaderLive"
                    align="center"
                    width="160"
                >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.liveToken" @change="changeliveAll(scope.$index)" size="small" :controls="false"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                    width="80"
                    prop="liveTokenUsed"
                    align="center"
                    label="已用课时数"
                    >
                </el-table-column>
                <el-table-column
                    :render-header="renderHeaderLiveResult"
                    align="center"
                    width="160"
                    >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.name3" size="small" @change="changeliveResult(scope.$index)" :controls="false"></el-input-number>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
                align="center" :render-header="renderOrderStatus2"  width="130"
            >
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.hasEbookStoreStatus"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderOrderStatus"
                align="center"
                width="130"
                >
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.netApplicationCenterStatus"></el-checkbox>
                </template>
            </el-table-column>
           <el-table-column
                :render-header="renderOrderStatus3"
                align="center"
                width="130"
                >
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.internalPushCenterStatus"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderOrderStatus4"
                align="center"
                width="130"
                >
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.hasSeminarsStatus"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderOrderStatus5"
                align="center"
                width="130"
                >
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.hasInterviewStatus"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderOrderStatus6"
                align="center"
                width="160"
                >
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.hasSalesInfoStatus"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">提交修改</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/hr.js'
export default {
  name: 'payWay',
  props: {
    courseDetailVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      dataList: [],
      loading: false,
      checkAll: true,
      statusAll: false,
      statusAll2: false,
      statusAll3: false,
      statusAll4: false,
      statusAll5: false,
      statusAll6: false
    }
  },
  mounted () {

  },
  watch: {
    courseDetailVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },

  methods: {
    renderHeaderLive (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">已有课时数</span>
        </div>
      )
    },
    renderHeaderLiveResult (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">剩余课时数</span>
          <el-button on-click={() => this.addCourseResultLive(h, col, index)} type="primary" size="mini" title="新增一课时" icon="el-icon-plus" circle></el-button>
          <el-button on-click={() => this.removeCourseResultLive(h, col, index)} type="warning" size="mini" title="减少一课时" icon="el-icon-minus" circle></el-button>
        </div>
      )
    },
    renderHeaderLessons (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">已有课时数</span>
        </div>
      )
    },
    renderHeaderLessonsResult (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">剩余课时数</span>
          <el-button on-click={() => this.addCourseResultLessons(h, col, index)} type="primary" size="mini" title="新增一课时" icon="el-icon-plus" circle></el-button>
          <el-button on-click={() => this.removeCourseResultLessons(h, col, index)} type="warning" size="mini" title="减少一课时" icon="el-icon-minus" circle></el-button>
        </div>
      )
    },
    renderOrderStatus2 (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">电子书架权限</span>
          <el-checkbox on-change={() => this.changeAll2(h, col, index)} v-model={this.statusAll2}></el-checkbox>
        </div>
      )
    },
    renderOrderStatus (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">网申权限</span>
          <el-checkbox on-change={() => this.changeAll(h, col, index)} v-model={this.statusAll}></el-checkbox>
        </div>
      )
    },
    renderOrderStatus3 (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">内推权限</span>
          <el-checkbox on-change={() => this.changeAll3(h, col, index)} v-model={this.statusAll3}></el-checkbox>
        </div>
      )
    },
    renderOrderStatus4 (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">线下课权限</span>
          <el-checkbox on-change={() => this.changeAll4(h, col, index)} v-model={this.statusAll4}></el-checkbox>
        </div>
      )
    },
    renderOrderStatus5 (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">面经权限</span>
          <el-checkbox on-change={() => this.changeAll5(h, col, index)} v-model={this.statusAll5}></el-checkbox>
        </div>
      )
    },
    renderOrderStatus6 (h, { col, index }) {
      return (
        <div>
          <span style="margin-right:10px">首页销售信息权限</span>
          <el-checkbox on-change={() => this.changeAll6(h, col, index)} v-model={this.statusAll6}></el-checkbox>
        </div>
      )
    },
    Topage () {
      this.loading = true
      api.getUserTokenArr().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].name3 = res.data[i].liveToken - res.data[i].liveTokenUsed
          res.data[i].name6 = res.data[i].courseToken - res.data[i].courseTokenUsed
          if (res.data[i].hasEbookStore == '1') {
            res.data[i].hasEbookStoreStatus = true
          } else {
            res.data[i].hasEbookStoreStatus = false
          }
          if (res.data[i].netApplicationCenter == '1') {
            res.data[i].netApplicationCenterStatus = true
          } else {
            res.data[i].netApplicationCenterStatus = false
          }
          if (res.data[i].internalPushCenter == '1') {
            res.data[i].internalPushCenterStatus = true
          } else {
            res.data[i].internalPushCenterStatus = false
          }
          if (res.data[i].hasSeminars == '1') {
            res.data[i].hasSeminarsStatus = true
          } else {
            res.data[i].hasSeminarsStatus = false
          }
          if (res.data[i].hasInterview == '1') {
            res.data[i].hasInterviewStatus = true
          } else {
            res.data[i].hasInterviewStatus = false
          }
          if (res.data[i].hasSalesInfo == '1') {
            res.data[i].hasSalesInfoStatus = true
          } else {
            res.data[i].hasSalesInfoStatus = false
          }
        }
        if (res.data.length > 0) {
          this.tableData = res.data
          console.log(this.tableData)
          // 网申权限
          this.statusAll = true
          // 电子书架权限
          this.statusAll2 = true
          // 内推权限
          this.statusAll3 = true
          // 线下课权限
          this.statusAll4 = true
          // 面经权限
          this.statusAll5 = true
          // 首页销售权限
          this.statusAll6 = true
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].hasEbookStore == '0') {
              this.statusAll2 = false
            }
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].netApplicationCenter == '0') {
              this.statusAll = false
            }
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].internalPushCenter == '0') {
              this.statusAll3 = false
            }
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].hasSeminars == '0') {
              this.statusAll4 = false
            }
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].hasInterview == '0') {
              this.statusAll5 = false
            }
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].hasSalesInfo == '0') {
              this.statusAll6 = false
            }
          }
        }
      })
    },
    close () {
      this.checkAll = true
      this.$emit('close')
    },
    submit () {
      this.$loading()
      const a = JSON.parse(JSON.stringify(this.tableData))
      const arr = []
      for (let i = 0; i < a.length; i++) {
        if (a[i].hasEbookStoreStatus) {
          a[i].hasEbookStore = '1'
        } else {
          a[i].hasEbookStore = '0'
        }
        if (a[i].netApplicationCenterStatus) {
          a[i].netApplicationCenter = '1'
        } else {
          a[i].netApplicationCenter = '0'
        }
        if (a[i].internalPushCenterStatus) {
          a[i].internalPushCenter = '1'
        } else {
          a[i].internalPushCenter = '0'
        }
        if (a[i].hasSeminarsStatus) {
          a[i].hasSeminars = '1'
        } else {
          a[i].hasSeminars = '0'
        }
        if (a[i].hasInterviewStatus) {
          a[i].hasInterview = '1'
        } else {
          a[i].hasInterview = '0'
        }
        if (a[i].hasSalesInfoStatus) {
          a[i].hasSalesInfo = '1'
        } else {
          a[i].hasSalesInfo = '0'
        }
        arr.push({
          userId: a[i].userId,
          courseToken: a[i].courseToken,
          liveToken: a[i].liveToken,
          hasEbookStore: a[i].hasEbookStore,
          netApplicationCenter: a[i].netApplicationCenter,
          internalPushCenter: a[i].internalPushCenter,
          hasSeminars: a[i].hasSeminars,
          hasInterview: a[i].hasInterview,
          hasSalesInfo: a[i].hasSalesInfo
        })
      }
      console.log(arr)
      api.upDateTokenArr(arr).then(res => {
        this.$loading().close()
        console.log(res)
        this.checkAll = true
        this.$emit('submit')
      })
    },

    changeAll () {
      if (this.statusAll) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].netApplicationCenterStatus = true
          this.tableData[i].netApplicationCenter = 1
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].netApplicationCenterStatus = false
          this.tableData[i].netApplicationCenter = 0
        }
      }
    },
    changeAll2 () {
      if (this.statusAll2) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasEbookStoreStatus = true
          this.tableData[i].hasEbookStore = 1
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasEbookStoreStatus = false
          this.tableData[i].hasEbookStore = 0
        }
      }
    },
    changeAll3 () {
      if (this.statusAll3) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].internalPushCenterStatus = true
          this.tableData[i].internalPushCenter = 1
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].internalPushCenterStatus = false
          this.tableData[i].internalPushCenter = 0
        }
      }
    },
    changeAll4 () {
      if (this.statusAll4) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasSeminarsStatus = true
          this.tableData[i].hasSeminars = 1
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasSeminarsStatus = false
          this.tableData[i].hasSeminars = 0
        }
      }
    },
    changeAll5 () {
      if (this.statusAll5) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasInterviewStatus = true
          this.tableData[i].hasInterview = 1
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasInterviewStatus = false
          this.tableData[i].hasInterview = 0
        }
      }
    },
    changeAll6 () {
      if (this.statusAll6) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasSalesInfoStatus = true
          this.tableData[i].hasSalesInfo = 1
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].hasSalesInfoStatus = false
          this.tableData[i].hasSalesInfo = 0
        }
      }
    },
    addCourseResultLive () {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].liveToken += 1
        this.tableData[i].name3 += 1
      }
    },
    addCourseResultLessons () {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].courseToken += 1
        this.tableData[i].name6 += 1
      }
    },
    changeliveAll (val) {
      console.log(val)
      this.tableData[val].name3 = this.tableData[val].liveToken - this.tableData[val].liveTokenUsed
    },
    changeliveResult (val) {
      this.tableData[val].liveToken = this.tableData[val].name3 + this.tableData[val].liveTokenUsed
    },
    changeCourseAll (val) {
      this.tableData[val].name6 = this.tableData[val].courseToken - this.tableData[val].courseTokenUsed
    },
    changeCourseResult (val) {
      this.tableData[val].courseToken = this.tableData[val].name6 + this.tableData[val].courseTokenUsed
    },
    removeCourseResultLive () {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name3 > 0) {
          this.tableData[i].liveToken -= 1
          this.tableData[i].name3 -= 1
        }
      }
    },
    removeCourseResultLessons () {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name6 > 0) {
          this.tableData[i].courseToken -= 1
          this.tableData[i].name6 -= 1
        }
      }
    }
  }
}
</script>
