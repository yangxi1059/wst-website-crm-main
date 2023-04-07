<!--
 * @Author: 库建华
 * @Date: 2019-09-09 17:03:50
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:50:24
 * @Version:
 * @Description:
 -->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" :title="'新增'" :visible.sync="addVisible" width="900px" :before-close="close">
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
          <el-select :style="{width:widths}" filterable v-model="userData.sex" placeholder="请选择">
            <el-option
              v-for="item in sex"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年" prop="year">
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="年龄" prop="age">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="userData.age"
            maxlength="9"
          ></el-input-number>
        </el-form-item>-->
        <!-- <el-form-item label="工龄" prop="seniority">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="userData.seniority"
            maxlength="9"
          ></el-input-number>
        </el-form-item>-->
        <el-form-item label="邮箱" prop="email">
          <el-input :style="{width:widths}" v-model="userData.email" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <!-- <el-input :style="{width:widths}" v-model="dept"></el-input> -->
          <el-select :style="{width:widths}" filterable multiple v-model="dept" placeholder="请选择">
            <el-option
              v-for="item in wst_department"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望薪资" prop="expectSalary">
          <el-input :style="{width:widths}" v-model="userData.expectSalary"></el-input>
        </el-form-item>
        <el-form-item label="office" prop="office">
          <el-select filterable :style="{width:widths}" v-model="userData.office" placeholder="请选择">
            <el-option v-for="item in ['北京','上海']" :key="item" :label="item" :value="item"></el-option>
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
              v-for="item in common_yes_or_no"
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
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预计到岗日期" prop>
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.arrivalDate"
            :clearable="false"
            :editable="false"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="推荐人" prop>
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
        <el-form-item label="面试人" prop="interviewer">
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
        </el-form-item>
        <!-- <el-form-item label="面试评估" prop="interviewRemark">
          <el-input :style="{width:widths}" v-model="userData.interviewRemark" maxlength="199"></el-input>
        </el-form-item>-->
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
          <!-- :http-request="uploadFileAxios" -->
          <div v-if="assess.length" class="mb10">
            <el-button v-for="(v,i) in assess" :key="i" @click="download(v)">查看</el-button>
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
        <br />
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            v-model="item.auditor"
            :style="{width:widths}"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送">
          <el-select :style="{width:widths}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in user" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
import apiU from '@/api/user.js'
import api3 from '@/api/sales_assistant.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'

export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: [],
      auditor: [],
      copy: [],
      dept: [],
      interviewer: [],
      sex: [],
      common_yes_or_no:[],
      userData: {
        intervieweeName: null,
        telephone: null,
        wxId: null,
        sex: null,
        year: '1998',
        email: null,
        seniority: null,
        expectSalary: null,
        interviewTime: null,
        intervieweeResource: null,
        note: null,
        manageBy: null,
        wstUserId: null,
        interviewRemark: null,
        hireStatus: '0',
        // arrivalStatus: "0",
        arrivalDate: null,
        office: null
      },
      widths: '250px',
      // sys_user_type: [],
      roleList: [],
      levelList: [],
      salesLevelList: [],
      userDataAPI: {},
      rules: {
        // wxId: [
        //   { required: true, message: "请输入微信ID", trigger: "blur" },
        //   { max: 60, message: "微信ID长度为60个字符以内", trigger: "blur" }
        // ], //请输入微信ID
        intervieweeName: [{ required: true, message: '必填', trigger: 'blur' }],
        wxId: [{ required: true, message: '必填', trigger: 'blur' }],
        telephone: [{ required: true, message: '必填', trigger: 'blur' }],
        sex: [{ required: true, message: '必填', trigger: 'blur' }],
        year: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [{ required: true, message: '必填', trigger: 'blur' }],
        // dept: [{ required: true, message: "必填", trigger: "blur" }],
        expectSalary: [{ required: true, message: '必填', trigger: 'blur' }],
        office: [{ required: true, message: '必填', trigger: 'blur' }],
        interviewTime: [{ required: true, message: '必填', trigger: 'blur' }],
        arrivalDate: [{ required: true, message: '必填', trigger: 'blur' }],
        wstUserId: [{ required: true, message: '必填', trigger: 'blur' }],
        // interviewer: [{ required: true, message: "必填", trigger: "blur" }],
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
      },
      auditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {
    addVisible: function (val) {
      if (val && !this.user.length) {
        this.init()
      }
    }
  },
  mounted () {
    this.pageInit()
    api3.getUserList().then(({ data }) => {
      console.log('人员列表', data)
      this.users = data
    })
    apiU.getDeptList().then(res => {
      console.log('getDeptList', res)
      this.wst_department = res.data
    })
  },
  methods: {
    async pageInit () {
      this.interviewee_resource = await this.getDictionary('interviewee_resource')
      this.sex = await this.getDictionary('sex')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    init () {
      apiU.userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
        .then(({ data }) => {
          console.log(
            'userList...........................................',
            data
          )
          this.user = data.rows
        })
      apiDic.getAuditorListByApplyType('interviewee_info').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    // Topage() {
    //   api.getIntervieweeDetailById(this.intervieweeId).then(res => {
    //     console.log("个人信息", res.data);
    //     this.userData = res.data.interviewee;
    //     this.assess = res.data.interviewee.interviewRemark.split(',');
    //     this.resume.name = res.data.interviewee.resume.split("/").pop();
    //     this.resume.url = res.data.interviewee.resume;
    //     let dept = [];
    //     res.data.deptArray.forEach(v => {
    //       dept.push(v.dept);
    //     });
    //     this.dept = dept;
    //     this.interviewer = [];
    //     res.data.interviewerArray.forEach(v => {
    //       this.interviewer.push(v.interviewerId);
    //     });
    //     console.log(this.userData,this.assess);
    //   });
    // },
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.userData.resetFields()
    },
    clear () {
      this.interviewer = []
      this.dept = []
      this.userData = {
        intervieweeName: null,
        telephone: null,
        wxId: null,
        sex: null,
        year: '1998',
        seniority: null,
        email: null,
        expectSalary: null,
        office: null,
        hireStatus: '0',
        // arrivalStatus: "0",
        interviewTime: null,
        arrivalDate: null,
        wstUserId: null,
        interviewRemark: null,
        manageBy: null,
        intervieweeResource: null,
        note: null
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
      this.$refs.userData.validate(valid => {
        console.log(valid)
        if (!valid) return
        const approval = []
        let cannot = false
        if (!this.interviewer.length) {
          this.$message({
            type: 'warning',
            message: '面试人必填！'
          })
          return
        }
        if (!this.dept.length) {
          this.$message({
            type: 'warning',
            message: '部门必填！'
          })
          return
        }
        if (!this.resume.url.length) {
          this.$message({
            type: 'warning',
            message: '简历必填！'
          })
          return
        }
        if (!this.fileList.length) {
          this.$message({
            type: 'warning',
            message: '面试评估为必填！'
          })
          return
        }
        this.auditorList.forEach(aa => {
          if (!aa.auditor.length) {
            cannot = true
          }
          aa.auditor.forEach(v => {
            approval.push({ approverId: v })
          })
        })
        if (cannot) {
          this.$message({
            type: 'warning',
            message: '审核人都为必填！'
          })
          return
        }
        const copyTo = []
        this.copy.forEach(v => {
          copyTo.push({ copyTo: v })
        })
        const year = new Date().getFullYear()
        this.userData.age = year - ~~this.userData.year
        const data = {
          applyType: 'interviewee_info',
          applyTitle: `HR[${this.userData.intervieweeName}]的面试人员录入申请`,
          copyTo: copyTo,
          approval: approval,
          content: {
            file: [{ name: '简历', url: this.resume.url }],
            text: [
              {
                label: '面试者姓名',
                value: this.userData.intervieweeName
              },
              {
                label: '电话',
                value: this.userData.telephone
              },
              {
                label: '微信ID',
                value: this.userData.wxId
              },
              {
                label: '性别',
                value: this.sex.filter(v => v.itemValue == this.userData.sex)[0]
                  .itemName
              },
              {
                label: '年龄',
                value: this.userData.age
              },
              {
                label: '邮箱',
                value: this.userData.email
              },
              {
                label: '期待薪资',
                value: this.userData.expectSalary
              },
              {
                label: '面试时间',
                value: this.userData.interviewTime
              },
              {
                label: '到岗日期',
                value: this.userData.arrivalDate
              },
              {
                label: '邀约渠道',
                value: this.interviewee_resource.filter(
                  v => v.itemValue == this.userData.intervieweeResource
                )[0].itemName
              },
              // {
              //   label: "推荐人",
              //   value: this.users.filter(
              //     v => v.userId == this.userData.wstUserId
              //   )[0].userName
              // },
              {
                label: '邀约人',
                value: this.users.filter(
                  v => v.userId == this.userData.manageBy
                )[0].userName
              },
              {
                label: '是否录用',
                value: this.common_yes_or_no.filter(
                  v => v.itemValue == this.userData.hireStatus
                )[0].itemName
              },
              {
                label: '备注',
                value: this.userData.note || '无'
              }
              // {
              //   label: "是否到岗",
              //   value: this.userData.arrivalStatus
              // }
            ],
            info: {
              intervieweeName: this.userData.intervieweeName,
              telephone: this.userData.telephone,
              wxId: this.userData.wxId,
              sex: this.userData.sex,
              email: this.userData.email,
              age: this.userData.age,
              seniority: this.userData.seniority,
              expectSalary: this.userData.expectSalary,
              interviewTime: this.userData.interviewTime,
              intervieweeResource: this.userData.intervieweeResource,
              note: this.userData.note,
              manageBy: this.userData.manageBy,
              wstUserId: this.userData.wstUserId,
              interviewRemark: this.userData.interviewRemark,
              hireStatus: this.userData.hireStatus,
              arrivalDate: this.userData.arrivalDate,
              office: this.userData.office,
              resume: this.resume.url,
              deptArr: [
                // {
                //   intervieweeId: "",
                //   dept: "",
                //   deptNote: ""
                // }
              ],
              interviewerArr: [
                // {
                //   intervieweeId: "",
                //   interviewerId: "",
                //   sort: "",
                //   interviewTime: "",
                //   remark: ""
                // }
              ]
            }
          }
        }
        this.interviewer &&
          this.interviewer.forEach((v, i) => {
            data.content.info.interviewerArr.push({
              // intervieweeId: this.intervieweeId,
              interviewerId: v,
              sort: i
            })
          })
        this.dept &&
          this.dept.forEach(v => {
            data.content.info.deptArr.push({
              // intervieweeId: this.intervieweeId,
              dept: v
            })
          })

        const dataFile = []
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          uploadFunBySys(file.raw, 'interview/assess', url => {
            console.log(url)
            data.content.file.push({ name: '面试评估', url: url })
            dataFile.push(url)
            if (dataFile.length === this.fileList.length) {
              console.log('bd_contract参数', dataFile)
              this.userData.interviewRemark = dataFile.join(',')
              data.content.info.interviewRemark = this.userData.interviewRemark
              console.log('setCommApply', data)
              api3.setCommApply(data).then(res => {
                console.log('bd_contract，', res)
                this.$loading().close()
                this.$emit('submit')
                this.clear()
              })
              // this.submit2();
            }
          })
        }
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
