<!--
 * @Author: 库建华
 * @Date: 2019-09-09 17:03:50
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 09:55:52
 * @Version:
 * @Description:
 -->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" :title="'编辑'" :visible.sync="editVisible" width="900px" :before-close="close">
      <el-form
        size="medium"
        inline
        :model="userData"
        :rules="rules"
        ref="userData"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="intervieweeName">
          <el-input :style="{width:widths}" v-model="userData.intervieweeName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="telephone">
          <el-input
            :controls="false"
            :style="{width:widths}"
            v-model="userData.telephone"
            maxlength="19"
          ></el-input>
        </el-form-item>
        <el-form-item label="微信ID" prop>
          <el-input :style="{width:widths}" v-model="userData.wxId" maxlength="19"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select :style="{width:widths}"  v-model="userData.sex" placeholder="请选择">
            <el-option
              v-for="item in sex"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="userData.age"
            maxlength="9"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input :style="{width:widths}" v-model="userData.email" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-select :style="{width:widths}" v-model="userData.dept" placeholder="请选择">
            <el-option
              v-for="item in wst_department"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=求职岗位 prop="position">
          <el-input
            :controls="false"
            :style="{width:widths}"
            v-model="userData.position"
            maxlength="19"
          ></el-input>
        </el-form-item>
        <el-form-item label="期望薪资" prop="expectSalary">
          <el-input :style="{width:widths}" v-model="userData.expectSalary"></el-input>
        </el-form-item>
        <el-form-item label="office" prop="office">
          <el-select filterable :style="{width:widths}" v-model="userData.office" placeholder="请选择">
            <el-option v-for="item in ['北京','上海']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到面状态" prop="hireStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.interviewStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in interview_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否录用" prop="hireStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.hireStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in interviewee_hire_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试时间" prop="interviewTime">
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.interviewTime"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否到岗" prop="arrivalStatus">
          <el-select
            :style="{width:widths}"
            filterable
            disabled
            v-model="userData.arrivalStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计到岗日期" prop>
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.arrivalDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否预约体检" prop="physicalExaminationStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.physicalExaminationStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约体检时间" prop="physicalExaminationDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.physicalExaminationDate"
            :clearable="false"
            :editable="false"
            type="date"
            value-format="yyyy-mm-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="面试人" prop="interviewer">
          <el-select
            :style="{width:widths}"
            filterable
            multiple
            v-model="interviewer"
            placeholder="请选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="面试邀约人" prop="manageBy">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.manageBy"
            placeholder="请选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀约渠道" prop="intervieweeResource">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.intervieweeResource"
            placeholder="请选择"
          >
            <el-option
              v-for="item in interviewee_resource"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="推荐人" v-if="userData.intervieweeResource == 'user_recommend'" prop>
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.wstUserId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            :style="{width:widths}"
            v-model="userData.note"
            :maxlength="255"
            type="textarea"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <el-form-item label="简历">
          <p v-if="resume.url">{{resume.name}}</p>
          <el-upload
            :http-request="uploadFileAxios"
            class="upload"
            ref="elUpload"
            :action="action"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
              建议使用PDF文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="面试评估">
          <div v-if="assess.length" class="mb10">
            <div v-for="(v,i) in assess" :key="i" style="display:inline-block;margin-right:10px">
              <el-button v-if="v" @click="download(v)">查看</el-button>
            </div>
          </div>
          <el-upload
            :auto-upload="false"
            :file-list="fileList"
            class="upload"
            ref="elUpload2"
            :action="action"
            :on-change="change"
            :on-remove="change"
            drag
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
              建议使用PDF文件
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/hr.js'
import api2 from '@/api/user.js'
import api3 from '@/api/sales_assistant.js'

import { uploadFunBySys, downloadFun } from '@/libs/file'

export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    intervieweeId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      interviewee_hire_status: [],
      interview_status: [],
      interviewer: [],
      sex: [],
      common_yes_or_no:[],
      userData: {
        intervieweeId: '',
        intervieweeName: '',
        telephone: '',
        wxId: '',
        wxName: '',
        sex: ' ',
        email: '',
        expectSalary: '',
        age: '',
        resume: '',
        interviewTime: '',
        intervieweeResource: '',
        wstUserId: '',
        interviewRemark: '',
        note: '',
        hireStatus: '',
        arrivalStatus: '',
        arrivalDate: '',
        manageBy: '',
        office: '',
        dept: '',
        position: '',
        physicalExaminationStatus: '',
        physicalExaminationDate: '',
        interviewStatus: ''
      },
      widths: '250px',
      roleList: [],
      levelList: [],
      salesLevelList: [],
      userDataAPI: {},
      rules: {
        intervieweeName: [{ required: true, message: '必填', trigger: 'blur' }],
        wxId: [{ required: true, message: '必填', trigger: 'blur' }],
        telephone: [{ required: true, message: '必填', trigger: 'blur' }],
        sex: [{ required: true, message: '必填', trigger: 'blur' }],
        age: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [{ required: true, message: '必填', trigger: 'blur' }],
        expectSalary: [{ required: true, message: '必填', trigger: 'blur' }],
        office: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewTime: [{ required: true, message: '必填', trigger: 'blur' }],
        arrivalDate: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        position: [{ required: true, message: '必填', trigger: 'blur' }],
        dept: [{ required: true, message: '必填', trigger: 'blur' }],
        // physicalExaminationStatus:[{ required: true, message: "必填", trigger: "blur" }],
        wstUserId: [{ required: true, message: '必填', trigger: 'blur' }],
        manageBy: [{ required: true, message: '必填', trigger: 'blur' }],
        intervieweeResource: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      users: [],
      interviewee_resource: [],
      wst_department: [],

      resume: {
        name: '',
        url: ''
      },

      fileList: [],
      assess: [],
      uploadFileList: [],
      action: '',
      header: {
        Authorization: ''
      }
    }
  },
  computed: {},
  watch: {
    editVisible: function (val) {
      if (val && this.intervieweeId !== '') {
        this.Topage()
      }
    }
  },
  mounted () {
    this.pageInit()
    api3.getUserList().then(({ data }) => {
      console.log('人员列表', data)
      this.users = data
    })
    api2.getDeptList().then(res => {
      console.log('getDeptList', res)
      this.wst_department = res.data
    })
  },
  methods: {
    async pageInit () {
      this.interviewee_hire_status = await this.getDictionary('interviewee_hire_status')
      this.interview_status = await this.getDictionary('interview_status')
      this.interviewee_resource = await this.getDictionary('interviewee_resource')
      this.sex = await this.getDictionary('sex')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    Topage () {
      api.getIntervieweeDetailNewById(this.intervieweeId).then(res => {
        console.log('个人信息', res.data)
        this.userData = JSON.parse(JSON.stringify(res.data.info))
        this.assess =
          res.data.info.interviewRemark &&
          res.data.info.interviewRemark.split(',')
        this.resume.name =
          res.data.info.resume &&
          res.data.info.resume.split('/').pop()
        this.resume.url = res.data.info.resume
        this.interviewer = []
        res.data.interviewerArr.forEach(v => {
          this.interviewer.push(v.interviewerId)
        })
        console.log(this.userData, this.assess)
      })
    },
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.userData.resetFields()
    },
    clear () {
      this.interviewer = []
      this.userData = {
        intervieweeId: '',
        intervieweeName: '',
        telephone: '',
        wxId: '',
        wxName: '',
        sex: ' ',
        email: '',
        expectSalary: '',
        age: '',
        resume: '',
        interviewTime: '',
        intervieweeResource: '',
        wstUserId: '',
        interviewRemark: '',
        note: '',
        hireStatus: '',
        arrivalStatus: '',
        arrivalDate: '',
        manageBy: '',
        office: '',
        dept: '',
        position: '',
        physicalExaminationStatus: '',
        physicalExaminationDate: '',
        interviewStatus: ''
      }
      this.uploadFileList = []
      this.fileList = []
      this.assess = []
      this.resume = {
        name: '',
        url: ''
      }
      this.$refs.elUpload2.clearFiles()
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    submit () {
      if (this.fileList.length) {
        const dataFile = []
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'interview/assess', url => {
            console.log(url)
            dataFile.push(url)
            if (dataFile.length === this.fileList.length) {
              console.log('bd_contract参数', dataFile)
              this.userData.interviewRemark += ',' + dataFile.join(',')
              this.submit2()
            }
          })
        }
      } else {
        this.submit2()
      }
    },
    submit2 () {
      console.log('个人信息提交', this.userData)
      this.$refs.userData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        const data = {
          intervieweeId: this.userData.intervieweeId,
          intervieweeName: this.userData.intervieweeName,
          telephone: this.userData.telephone,
          wxId: this.userData.wxId,
          wxName: this.userData.wxName,
          sex: this.userData.sex,
          email: this.userData.email,
          expectSalary: this.userData.expectSalary,
          age: this.userData.age,
          interviewTime: this.userData.interviewTime,
          intervieweeResource: this.userData.intervieweeResource,
          wstUserId: this.userData.wstUserId,
          interviewRemark: this.userData.interviewRemark,
          note: this.userData.note,
          hireStatus: this.userData.hireStatus,
          arrivalStatus: this.userData.arrivalStatus,
          arrivalDate: this.userData.arrivalDate,
          manageBy: this.userData.manageBy,
          office: this.userData.office,
          dept: this.userData.dept,
          position: this.userData.position,
          physicalExaminationStatus: this.userData.physicalExaminationStatus,
          physicalExaminationDate: this.userData.physicalExaminationDate,
          interviewStatus: this.userData.interviewStatus,
          resume: this.resume.url
          // interviewer: []
        }
        // this.interviewer &&
        //   this.interviewer.forEach((v, i, arr) => {
        //     data.interviewer.push({
        //       intervieweeId: this.intervieweeId,
        //       interviewerId: v,
        //       sort: i
        //     });
        //   });
        console.log('提交参数', data)
        api
          .setIntervieweeDetailNew(data)
          .then(({ data }) => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '更新失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      })
    },
    // 凭证上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(file.file, 'resume/hr_interview', url => {
        this.resume.url = url
        this.resume.name = file.file.name
        this.$loading().close()
        this.$refs.elUpload.clearFiles()
      })
    },
    // 面试评估
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
