<!--
 * @Author: kaan
 * @Date: 2021-03-25 15:53:12
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-05 09:33:37
 * @Version:
 * @Description:
-->
<template>
  <div class="set-target">
    <el-drawer title="学员岗位投递" :close-on-click-modal="false" :visible.sync="recommandVisible" size="90%" :before-close="close">
      <div class="search ml20" >
          <el-input
            class="mr10 mb10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="支持公司名 岗位名"
          ></el-input>
          <el-select
            v-model="recordStatus"
            class="mr10 mb10"
            size="mini"
            clearable
            style="width:100px"
            placeholder="状态"
          >
            <el-option
              v-for="item in internal_job_status"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="displayStatus"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            clearable
            placeholder="官网展示"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="jobType"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            clearable
            placeholder="岗位类型"
          >
            <el-option
              v-for="item in internship_or_full_time"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            v-model="locationType"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            clearable
            placeholder="远程/实地"
          >
            <el-option
              v-for="item in internship_location_type"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>
          <el-select
            class="mr10 mb10"
            style="width:100px"
            size="mini"
            filterable
            v-model="companyId"
            clearable
            placeholder="公司"
          >
            <el-option
              v-for="item in companyList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <el-select
            v-model="countrys"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="地区"
          >
            <el-option
              v-for="item in country_list"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-select
            v-model="track"
            class="mr10 mb10"
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="Track"
          >
            <el-option
              v-for="item in trackList"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-select
            v-model="degrees"
            collapse-tags
            multiple
            class="mr10 mb10 "
            size="mini"
            style="width:100px"
            filterable
            clearable
            placeholder="学历要求"
          >
            <el-option
              v-for="item in degree"
              :key="item.itemValue"
              :value="item.itemValue"
              :label="item.itemName"
            ></el-option>
          </el-select>

          <el-date-picker
            class="mr10 mb10"
            size="mini"
            v-model="applySeason"
            type="year"
            clearable
            style="width:100px"
            value-format="yyyy"
            placeholder="申请季"
          ></el-date-picker>
          <el-button
            icon="el-icon-search"
            class="mr10 mb10"
            size="mini"
            plain
            @click="toPage"
          >搜索</el-button>
      </div>
      <div class="recommand-conatainer">
        <ul class="job-list">
          <li class="list-item" :class="[item.statusBg, {active:categoryIndex==index}]" :key="index" v-for="(item, index) in jobList" @click="handleClick(item,index)">
            <el-image class="image-box" fit="contain" :src="item.logo"></el-image>
            <div class="list-content">
              <div class="list-item-line">
                <span class="fl list-item1">{{item.companyName || '-'}}</span>
              </div>
              <div class="list-item-line">
                <span class="fl list-item2">{{item.jobName || '-'}}</span>
                <el-tag size="medium" type="danger" class="fr" v-if="item.menteeApplyStatusName"> {{ item.menteeApplyStatusName }}</el-tag>
                <!-- <el-tag size="medium mr10" class="fr" > {{ item.recordStatusName }}</el-tag> -->
              </div>
              <div class="list-item-line">
               <span class="fl list-item3">{{dateFormat(item.deadLine) || '-'}} 截止</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="job-content">
          <div class="mb10">
            <el-image class="detail-image-box" fit="contain" :src="detail.logo">
              <div slot="error" :class="detail.statusBg"></div>
            </el-image>
            <div class="detail-text1">{{detail.companyName || '-'}}
                <el-tag
                  size="medium"
                  class="fr"
                  :type="detail.statusBg">
                  {{ detail.recordStatusName }}
                </el-tag>
            </div>
            <div class="detail-mark mt10">{{detail.tracksName || '-'}}&nbsp;&nbsp;&nbsp;
              <i class="el-icon-location"></i>{{detail.countryName || '-'}}</div>
          </div>
          <p class="detail-text2">{{detail.jobName || '-'}}</p>
          <el-form :model="detail" label-width="120px" label-position="left">
            <el-form-item label="Apply Season：" class="form-item-width">{{detail.applySeason || '-'}}</el-form-item>
            <el-form-item label="Job Count：" class="form-item-width">{{detail.jobCount || '-'}}</el-form-item>
            <el-form-item label="Job Type：" class="form-item-width">{{detail.jobTypeName || '-'}}</el-form-item>
            <el-form-item label="Loaction Type：" class="form-item-width">{{detail.locationTypeName || '-'}}</el-form-item>
            <el-form-item label="Track Name：" class="form-item-width">{{detail.trackName || '-'}}</el-form-item>
            <div class="clear"></div>
          </el-form>
          <el-divider content-position="left">岗位要求</el-divider>
          <div class="detail-order-text">{{detail.jobRequirements|| '-'}}</div>
          <el-divider content-position="left">岗位信息</el-divider>
          <div class="detail-order-text">{{detail.jobInformation|| '-'}}</div>
          <div class="yx_ruleform_apply">
            <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
              <el-form-item class="mb10" label="可入职时间" prop="arriveDays">
                <el-select v-model="ruleForm.arriveDays"  placeholder="请选择">
                  <el-option
                    v-for="item in internal_arrive_days"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="mb10" label="可工作时间范围" prop="myDate">
                <el-date-picker
                  v-model="ruleForm.myDate"
                  type="daterange"
                  size="mini"
                  :unlink-panels="true"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="mb10" label="是否同意公司的时间安排" prop="aspectAdjust">
                <el-select v-model="ruleForm.aspectAdjust"  placeholder="请选择">
                  <el-option
                    v-for="item in common_yes_or_no"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="mb10" label="更新文件：" >
                <el-upload
                :file-list="fileList"
                :on-change="change"
                :http-request="uploadFileAxios"
                :on-error="handleError"
                :auto-upload="false"
                class="upload upload-demo"
                ref="elupload"
                action
                drag
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">上传（可拖拽）</div>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="detail.jobId" @click="submitNet(detail)">投递内推</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
import {
  downloadFun,
  downloadFunD,
  uploadFunBySys
} from '@/libs/file'
export default {
  name: 'SetRecommand',
  mixins: [mixins],
  props: {
    recommandVisible: {
      type: Boolean,
      default: false
    },
    menteeId: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      categoryIndex: -1,
      fileList: [],
      statusBg: {
        wait_pass: 'info',
        un_pass: 'warning',
        send_hr: 'primary',
        un_hire: 'danger',
        hire: 'success'
      },
      rules: {
        myDate: { required: true, message: '必填', trigger: 'blur' },
        arriveDays: { required: true, message: '必填', trigger: 'blur' },
        planStartDate: { required: true, message: '必填', trigger: 'blur' },
        planEndDate: { required: true, message: '必填', trigger: 'blur' },
        aspectAdjust: { required: true, message: '必填', trigger: 'blur' }
      },
      ruleForm: {
        jobId: '',
        menteeId: '',
        arriveDays: '',
        planStartDate: '',
        planEndDate: '',
        aspectAdjust: '',
        myDate: [],
        fileArr: []
      },
      jobList: [],
      internal_job_status: [],
      common_yes_or_no: [],
      internship_or_full_time: [],
      internship_location_type: [],
      degrees: [],
      degree: [],
      tableData: [],
      companyList: [],
      country_list: [],
      trackList: [],
      internal_arrive_days: [],
      search: '',
      recordStatus: '',
      displayStatus: '',
      applySeason: '',
      jobType: '',
      track: '',
      locationType: '',
      countrys: '',
      companyId: '',
      detail: {}
    }
  },
  watch: {
    recommandVisible: function (val) {
      console.log(1111111111111111111111111)
      if (!this.menteeId) {
        this.$message('参数有误，请刷新后重试')
        this.close()
        return
      }
      if (val) {
        this.toPage()
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    toPage () {
      const params = {
        pageNum: 1,
        pageSize: 100,
        menteeId: this.menteeId,
        search: this.search,
        companyId: this.companyId,
        recordStatus: this.recordStatus,
        displayStatus: this.displayStatus,
        applySeason: this.applySeason,
        locationType: this.locationType,
        jobType: this.jobType,
        degrees: this.degrees.join(','),
        track: this.track,
        country: this.countrys
      }
      api.getMenteeJobListNew(params).then(res => {
        console.log('getMenteeJobList:', res)
        this.jobList = res.data.rows
        this.jobList.forEach(v => {
          v.statusBg = this.statusBg[v.recordStatus]
        })
      })
    },
    async pageInit () {
      this.companyList = await this.getCompany()
      this.degree = await this.getDictionary('degree')
      this.trackList = await this.getDictionary('track')
      this.internal_job_status = await this.getDictionary('internal_job_status')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.internship_location_type = await this.getDictionary('internship_location_type')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.country_list = await this.getDictionary('country')
      this.internal_arrive_days = await this.getDictionary('internal_arrive_days')
    },
    dateFormat (val) {
      const dt = new Date(val)
      const m = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Spt', 'Oct', 'Nov', 'Dec')
      const w = new Array('Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
      const d = new Array('st', 'nd', 'rd', 'th')
      const mn = dt.getMonth()
      const wn = dt.getDay()
      const dn = dt.getDate()
      let dns
      if (((dn % 10) < 1) || ((dn % 10) > 3)) {
        dns = d[3]
      } else {
        dns = d[(dn % 10) - 1]
        if ((dn == 11) || (dn == 12)) {
          dns = d[3]
        }
      }
      return m[mn] + ' ' + dn + dns + ' ' + w[wn - 1] + ' ' + dt.getFullYear()
    },
    handleClick (item, index) {
      this.categoryIndex = index
      this.detail = {}
      api.getMenteeJobDetail(item.jobId).then(res => {
        console.log('getMenteeJobDetail:', res)
        if (!res.data.jobInfo) {
          return
        }
        this.detail = res.data.jobInfo
        this.detail.statusBg = item.statusBg
        this.detail.recordStatusName = item.recordStatusName
        this.detail.tracksName.replace(',', '/')
      })
    },
    close () {
      this.clear()
      this.$emit('close')
      this.jobList = []
    },
    clear () {
      this.$refs.elupload.clearFiles()
      this.fileList = []
      this.ruleForm = {
        jobId: '',
        menteeId: '',
        arriveDays: '',
        planStartDate: '',
        planEndDate: '',
        aspectAdjust: '',
        myDate: [],
        fileArr: []
      }
    },
    handleError () {
      this.$message({
        type: 'error',
        message: '上传失败！！'
      })
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    uploadFileAxios () {
      console.log(this.fileList.length)
      if (this.fileList.length) {
        let arr = []
        let fileLength = 0
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, `fileInternalApply-${this.menteeId}_${~~(Math.random() * 10 ** 3)}`, (url) => {
            arr.push({
              fileName: file.name,
              filePath: url
            })
            fileLength++
            if (fileLength === this.fileList.length) {
              const obj = {
                jobId: this.detail.jobId,
                menteeId: this.menteeId,
                arriveDays: this.ruleForm.arriveDays,
                planStartDate: this.ruleForm.myDate[0],
                planEndDate: this.ruleForm.myDate[1],
                aspectAdjust: this.ruleForm.aspectAdjust
              }
              const applyData = {
                apply: obj,
                fileArr: arr
              }
              this.$loading().close()
              api.applyInternalJob(applyData).then(res => {
                this.$message.success('提交成功！！')
              })
            }
          })
          if (i === 0) {
            break
          }
        }
      } else {
        this.$message.error('文件必传！！')
      }
    },
    finallyApply () {
      const obj = {
        jobId: this.detail.jobId,
        menteeId: this.menteeId,
        arriveDays: this.ruleForm.arriveDays,
        planStartDate: this.ruleForm.myDate[0],
        planEndDate: this.ruleForm.myDate[1],
        aspectAdjust: this.ruleForm.aspectAdjust
      }
      const applyData = {
        apply: obj,
        fileArr: this.ruleForm.fileArr
      }
      console.log(applyData)
      api.applyInternalJob(applyData).then(res => {
        this.clear()
        this.$message.success('提交成功！！')
      })
    },
    submitNet (data) {
      console.log(data, this.ruleForm)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$loading()
          this.uploadFileAxios()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing:border-box;
}
.recommand-conatainer{
  display: flex;
  width:100%;
  .job-list{
    width:30%;
    height:calc(90vh - 54px);
    overflow: auto;
    padding:10px 10px 0 10px;
    display: inline-block;
  }
  .list-item{
    padding:20px 10px;
    border-bottom:1px solid #ededed;
    border-radius: 10px;
    display:flex;
    align-items: top;
  }
  .image-box{
    width:75px;
    height:75px;
    margin-right:20px;
    border-radius: 50%;
    box-shadow: 5px 5px 10px #888;
  }
  .list-content{
    flex:1;
  }
  .list-item-line{
    width:100%;
    clear: both;
    .list-item1{
      font-weight:700;
      font-size:18px;
    }
    .list-item2{
      margin-bottom:10px;
      font-size:16px;
      color:#000;
    }
    .list-item3{
      font-size:14px;
    }
  }
}
.fl{
  float:left;
}
.fr{
  float:right;
}
.active.info, .info:hover{
  background-color:#e9e9eb;
  border-bottom:1px solid #e9e9eb;
  box-shadow: 0px 0px 10px #e9e9eb;
}
.active.warning, .warning:hover{
  background-color:#faecd8;
  border-bottom:1px solid #faecd8;
  box-shadow: 0px 0px 10px #faecd8;
}
.active.primary, .primary:hover{
  background-color:#d9ecff;
  border-bottom:1px solid #d9ecff;
  box-shadow: 0px 0px 10px #d9ecff;
}
.active.danger, .danger:hover{
  background-color:#fde2e2;
  border-bottom:1px solid #fde2e2;
  box-shadow: 0px 0px 10px #fde2e2;
}
.active.success, .success:hover{
  background-color:#e1f3d8;
  border-bottom:1px solid #e1f3d8;
  box-shadow: 0px 0px 10px #e1f3d8;
}
.yx_ruleform_apply{
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
.job-content{
  width:70%;
  height:calc(90vh - 54px);
  overflow: auto;
  padding:10px 20px 0 20px;
  display: inline-block;
  .detail-image-box{
    float:left;
    width:60px;
    height:60px;
    margin-right:10px;
    border-radius: 50%;
    box-shadow: 5px 5px 10px #888;
  }
  .detail-text1{
    font-size:20px;
    font-weight:700;
    line-height:40px;
    color:#000;
  }
  .detail-text2{
    font-size:20px;
    font-weight:700;
    line-height:40px;
  }

  .form-item-width{
    float:left;
    width:50%;
  }
  .el-form-item{
    margin-bottom:0px;
  }
  .detail-order-text{
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(59,59,59,0.96);
    white-space: pre-line;
    word-wrap: break-word;
    opacity: 1;
  }
}
.clear{
  clear:both;
}
</style>
