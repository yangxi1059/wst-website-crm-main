<!--
 * @Author: 库建华
 * @Date: 2020-03-20 10:05:35
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-18 10:11:47
 * @Version:
 * @Description:
 -->
<template>
  <div class="internal-edit">
    <el-dialog :close-on-click-modal="false" title="学生投递列表" :visible.sync="studentsVisible" width="90%" :before-close="close">
      <div class="header" slot="title">
        学生投递列表
        <el-tooltip
          v-if="roleInfo.includes(`internal_job_download_all`)"
          effect="dark"
          content="一键下载‘已投HR’状态的简历"
          placement="top-start"
        >
          <el-button
            class="add-offer-btn"
            @click="downloadALL"
            type="primary"
            plain
            round
            size="small"
          >一键下载</el-button>
        </el-tooltip>
      </div>
      <el-table :data="tableData" size="mini" border stripe>
        <el-table-column
          min-width="100px"
          align="center"
          prop="menteeName"
          label="学员名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="vipName"
          label="当前VIP"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          min-width="100px"
          align="center"
          prop="recordStatusName"
          label="投递状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.recordStatus"
              placeholder="请选择"
              size="mini"
              @change="changeRecordStatus(scope.row)"
            >
              <el-option
                v-for="item in internal_job_mentee_record_status"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="graduationYear"
          label="毕业年份"
        ></el-table-column>
        <el-table-column
          min-width="100px"
          align="center"
          prop="menteeLocation"
          label="学生所在地"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="createTime" label="申请时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="arriveDaysName" label="最快入职时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="planStartDate" label="计划开始日期" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="planStartDate" label="计划结束日期" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="aspectAdjustName"
          label="能否根据公司安排调整工作时长"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="note" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="resume2" label="简历" min-width="100px">
          <template slot-scope="scope">
            <div v-for="(item,i) in scope.row.resumeArr" :key="i">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="item.resumeName"
              >
                <el-button slot="reference" size="mini" plain @click="download(item.resumeUrl)">查看</el-button>
              </el-popover>
              <el-button size="mini" plain @click="downloadD(item.resumeUrl)">下载</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="300" label="面试" >
          <template slot-scope="scope">
            <div v-for="(item,i) in scope.row.interviewArr" :key="i">
              <div v-if="item.applyId">{{item.timesName}}-<el-link @click="toApplyDetail(item.applyId)">{{item.applyId}}</el-link>-{{item.applyStatusName}}</div>
              <div v-else>{{item.timesName}} <el-button type="primary" @click="applyInterview(scope.row,item)">发起申请</el-button></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="300" label="Offer" >
          <template slot-scope="scope">
            <div v-for="(item,i) in scope.row.offerArr" :key="i">
              <div v-if="item.applyId">{{item.divisionName}}-<el-link @click="toApplyDetail(item.applyId)">{{item.applyId}}</el-link>-{{item.applyStatusName}}</div>
              <div v-else>{{item.divisionName}} <el-button type="primary" @click="applyDivision(scope.row,item)">发起申请</el-button></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <apply :jobInterviewFeeVisible="jobInterviewFeeVisible" :referId="internalData.referId || ''" :providerId=" internalData.providerId || ''" :menteeDetail="menteeDetail" :interviewDetail="interviewDetail" @close="closeApply" @submit="submitApply" />
    <applyDivision :applyDivisionVisible="applyDivisionVisible" :referId="internalData.referId || ''" :providerId="internalData.referId || internalData.providerId || ''" :menteeDetail="menteeDetail" :divisionDetail="divisionDetail" @close="closeApplyDivision" @submit="submitApplyDivision" />
    <applyDetailBlock :recommendDetailVisible="recommendDetailVisible" :applyData="applyData" @close="closeDetail" />

  </div>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file'
import api from '@/api/dictionary'
import api2 from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import util from '@/libs/util'
import apply from './apply.vue'
import applyDivision from './applyDivision.vue'
import { mapState } from 'vuex'
import applyDetailBlock from '../../apply_audit/recommend/detail.vue'

export default {
  mixins: [mixins],
  props: {
    studentsVisible: {
      type: Boolean,
      default: false
    },
    internalData: {
      type: Object
    }
  },
  components: { apply, applyDivision, applyDetailBlock },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      tableData: [],
      internal_job_mentee_record_status: [],
      jobInterviewFeeVisible: false,
      applyDivisionVisible: false,
      menteeDetail: {},
      divisionDetail: {},
      interviewDetail: {},
      recommendDetailVisible: false,
      applyData: {}
    }
  },
  watch: {
    studentsVisible: function (val) {
      if (val) {
        this.initPage()
        this.init()
      }
    }
  },
  methods: {
    init () {
      if (!this.internal_job_mentee_record_status.length) {
        this.pageInit()
      }
    },
    async pageInit () {
      this.internal_job_mentee_record_status = await this.getDictionary('internal_job_mentee_record_status')
    },
    initPage () {
      const params = {
        pageNum: 1,
        pageSize: 9999,
        jobId: this.internalData.jobId
      }
      api.getInternalJobStudents(params).then(res => {
        console.log(res.data)
        this.tableData = JSON.parse(JSON.stringify(res.data.rows))
        this.tableData.forEach(tableDataItem => {
          tableDataItem.resumeArr = []
          tableDataItem.resumeArr.push({
            resumeName: tableDataItem.fileNames,
            resumeUrl: tableDataItem.filePaths
          })
          // const nameArr =
          //   tableDataItem.fileNames && tableDataItem.fileNames.split(",");
          // const urlArr =
          //   tableDataItem.filePaths && tableDataItem.filePaths.split(",");
          // nameArr &&
          //   nameArr.forEach((v, i) => {
          //     tableDataItem.resumeArr.push({
          //       resumeName: v,
          //       resumeUrl: urlArr[i]
          //     });
          //   });
        })
      })
    },
    close () {
      this.$emit('close')
      this.tableData = []
    },
    // 查看
    download (path) {
      console.log(path)
      downloadFun(path, url => {
        window.open(url)
      })
    },
    // 下载
    downloadD (path) {
      console.log(path)
      downloadFunD(path, url => {
        window.open(url)
      })
    },
    downloadALL () {
      const fileName =
        this.internalData.companyName + '_' + this.internalData.jobName
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}internalJob/${this.internalData.jobId}/resumeZip`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.zip' // 如123.xls
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
      // api.downloadStudentsResumeZipByJobId(this.internalData.jobId).then(()=>{
      //   console.log('一键下载简历完成')
      // })
      // if (!this.tableData.length) {
      //   this.$message({
      //     type: "warning",
      //     message: "无学生简历可下载"
      //   });
      //   return;
      // }
      // let downloadList = this.tableData.filter(
      //   v => v.recordStatus == "send_hr"
      // );
      // if (!downloadList.length) {
      //   this.$message({
      //     type: "warning",
      //     message: "无学生简历可下载"
      //   });
      //   return;
      // }
      // downloadList.forEach(v => {
      //   v.resumeArr &&
      //     v.resumeArr.forEach(vv => {
      //       this.downloadD(vv.resumeUrl);
      //     });
      // });
      // console.log(downloadList);
    },
    changeRecordStatus (item) {
      console.log(item)
      const data = {
        uptList: [
          {
            pkId: item.pkId,
            recordStatus: item.recordStatus
          }
        ]
      }
      api.setMenteeInternalJOb(data).then(() => {
        this.$message({
          type: 'success',
          message: '投递状态更新成功'
        })
      })
    },
    applyInterview (data, interviewDetail) {
      if (this.internalData.providerId) {
        console.log(data)
        this.jobInterviewFeeVisible = true
        this.menteeDetail = data
        this.interviewDetail = interviewDetail
      } else {
        this.$message.warning('无内推人无法发起申请')
      }
    },
    closeApply () {
      this.jobInterviewFeeVisible = false
    },
    submitApply () {
      this.initPage()
      this.jobInterviewFeeVisible = false
    },
    applyDivision (data, divisionDetail) {
      if (this.internalData.providerId) {
        console.log(data, divisionDetail)
        this.menteeDetail = data
        this.divisionDetail = divisionDetail
        this.applyDivisionVisible = true
      } else {
        this.$message.warning('无内推人无法发起申请')
      }
    },
    closeApplyDivision () {
      this.applyDivisionVisible = false
    },
    submitApplyDivision () {
      this.initPage()
      this.applyDivisionVisible = false
    },
    toApplyDetail (applyId) {
      api2.getApplyDetailByApplyId(applyId).then(res => {
        this.recommendDetailVisible = true
        this.applyData = res.data
        this.applyData.applyStatus = res.data.apply.applyStatus
        this.applyData.applyType = res.data.apply.applyType
        this.applyData.applyId = res.data.apply.applyId
        console.log(res.data)
      })
    },
    closeDetail () {
      this.recommendDetailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
