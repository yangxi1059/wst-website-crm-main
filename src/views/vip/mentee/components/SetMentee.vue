<!--
 * @Author: 库建华
 * @Date: 2019-07-30 14:41:14
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-28 16:26:24
 * @Version:
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog title="学员信息" :close-on-click-modal="false" :visible.sync="setMenteeVisible" width="1000px" :before-close="close">
      <el-form
        :inline="true"
        label-width="130px"
        :rules="rulesig"
        :model="menteeData1"
        ref="signingForm"
      >
        <el-form-item label="学员姓名" prop="realName">
          <el-input :style="{width:'180px'}" v-model="menteeData1.realName"></el-input>
        </el-form-item>
        <el-form-item label="微信ID" prop="realName">
          <el-input :style="{width:'180px'}" v-model="menteeData1.wxId"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.sex"
            clearable
            filterable
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in sex"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学历" prop="degree">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.degree"
            clearable
            filterable
            placeholder="请选择学历"
          >
            <el-option
              v-for="item in degree"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业年份" prop="finishYear">
          <el-select
            v-model="menteeData1.finishYear"
            clearable
            placeholder="选择年份"
            :style="{width:'180px'}"
          >
            <el-option v-for="(item) in 100" :key="item" :label="item+1990" :value="item+1990"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input :style="{width:'180px'}" v-model="menteeData1.email"></el-input>
        </el-form-item>
        <el-form-item label="学校（高中）" prop="highSchool">
          <el-select
            v-model="menteeData1.highSchool"
             :style="{width:'180px'}"
            filterable
            placeholder="请选择学校"
          >
            <el-option
              v-for="item in highSchool"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>

        <el-form-item label="学校（本科）" prop="school">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.school"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in school"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业（本科）" prop="major">
          <el-select
            multiple
            :style="{width:'500px'}"
            v-model="menteeData1.major"
            clearable
            filterable
            placeholder="请选择专业"
            :multiple-limit="3"
          >
            <el-option
              v-for="item in major"
              :key="item.majorId"
              :label="item.allName"
              :value="item.majorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="学校（研究生）" prop="graduateSchool">
          <el-select
            v-model="menteeData1.graduateSchool"
             :style="{width:'180px'}"
            filterable
            clearable
            placeholder="请选择学校"
          >
            <el-option
              v-for="item in school"
              :key="item.schoolId"
              :label="item.allName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业（研究生）" prop="graduateMajor">
          <el-select
            multiple
            :style="{width:'500px'}"
            v-model="menteeData1.graduateMajor"
            clearable
            filterable
            placeholder="请选择专业"
            :multiple-limit="3"
          >
            <el-option
              v-for="item in major"
              :key="item.majorId"
              :label="item.allName"
              :value="item.majorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="是否STEM专业" prop="isStem">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.isStem"
            placeholder="是否STEM专业"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否转学" prop="isTransfer">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.isTransfer"
            placeholder="是否转学"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否申研" prop="isApplyMaster">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.isApplyMaster"
            placeholder="是否申研"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否VIP同事推荐" prop="vipRecommendStatus">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.vipRecommendStatus"
            placeholder="是否VIP同事推荐"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VIP同事推荐人" prop="vipRecommender" v-if="menteeData1.vipRecommendStatus == 1">
          <el-select
            :style="{width:'180px'}"
            v-model="menteeData1.vipRecommender"
            placeholder="VIP同事推荐人"
          >
            <el-option
              v-for="item in vipSelect"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>

        <el-form-item label="社团">
          <el-input :style="{width:'820px'}" type="textarea" :rows="3" v-model="menteeData1.community" placeholder="请按“xxx社团（xx职务）”格式输入，多个社团情换行"></el-input>
        </el-form-item>

        <!-- <el-form-item label="最新简历">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            drag
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :style="{width:'200px'}"
          >
            <span class="el-icon-upload"></span>
            <el-button size="mini" type="text" plain>拖拽、点击上传文件</el-button>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFunBySys } from '@/libs/file'
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
import apiDic from '@/api/dictionary.js'
import apiSalesAssistent from '@/api/sales_assistant.js'

export default {
  props: {
    setMenteeVisible: {
      type: Boolean,
      default: false
    },
    menteeData: {
      type: Object
    }
  },
  watch: {
    setMenteeVisible: function (val, old) {
      if (val) {
        this.Topage()
      }
    }
  },
  mixins: [mixins],
  data: () => {
    return {
      common_yes_or_no: [],
      vipSelect: [],
      menteeData1: {},
      school: '',
      major: [],
      sex: [],
      degree: [],
      highSchool: [],
      fileList: [],
      fileResume: '',
      rulesig: {
        email: [
          { required: true, message: '必填', trigger: 'change' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ],
        highSchool: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        vipRecommendStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        isStem: [{ required: true, message: '必填', trigger: 'blur' }],
        isTransfer: [{ required: true, message: '必填', trigger: 'blur' }],
        isApplyMaster: [{ required: true, message: '必填', trigger: 'blur' }],
        vipRecommender: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'change' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        realName: [{ required: true, message: '不能为空', trigger: 'change' }],
        school: [{ required: true, message: '不能为空', trigger: 'change' }],
        major: [{ required: true, message: '不能为空', trigger: 'change' }],
        sex: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      console.log('highSchool')
      this.school = await this.getSchool('school')
      console.log(this.school)
      this.highSchool = await this.getSchool('highSchool')
      console.log(this.highSchool)
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.sex = await this.getDictionary('sex')
      this.degree = await this.getDictionary('degree')
      this.major = await this.getMajor()
      this.vipSelect = await this.userListCommon('1', 'strategist,services', '')
      console.log(this.vipSelect)
    },
    Topage () {
      // api.userList({
      //   pageNum: 1,
      //   pageSize: 10000,
      //   entryStatus: '1',
      //   sortCol: 'userName',
      //   sort: 'ASC',
      //   positionType: 'strategist,services'
      // })
      //   .then((res) => {
      //     console.log(res, 'vip推荐人列表yx*********')
      //     this.vipSelect = res.data.rows
      //   })
      apiSalesAssistent.getMenteeDataByMenteeId(this.menteeData.menteeId).then(res => {
        res.data.major = res.data.major ? res.data.major.split(',') : []
        res.data.graduateMajor = res.data.graduateMajor ? res.data.graduateMajor.split(',') : []
        this.menteeData1 = res.data
        console.log(this.menteeData1)
      })
    },
    change (file, fileList) {
      this.fileList = fileList.slice(-1)
      this.fileResume = file
    },
    close () {
      this.$refs.signingForm.resetFields()
      this.$emit('close')
    },
    submit () {
      this.$refs.signingForm.validate(valid => {
        if (!valid) return
        console.log('submit', this.menteeData1.graduateMajor)
        let graduateMajor = ''
        if (this.menteeData1.graduateMajor.length > 0) {
          graduateMajor = this.menteeData1.graduateMajor.join(',')
        } else {
          graduateMajor = ''
        }
        const data = {
          highSchool: this.menteeData1.highSchool,
          vipRecommendStatus: this.menteeData1.vipRecommendStatus,
          isStem: this.menteeData1.isStem,
          isTransfer: this.menteeData1.isTransfer,
          isApplyMaster: this.menteeData1.isApplyMaster,
          vipRecommender: this.menteeData1.vipRecommender,
          menteeId: this.menteeData1.menteeId,
          school: this.menteeData1.school,
          realName: this.menteeData1.realName,
          wxId: this.menteeData1.wxId,
          email: this.menteeData1.email,
          sex: this.menteeData1.sex,
          degree: this.menteeData1.degree,
          finishYear: this.menteeData1.finishYear,
          community: this.menteeData1.community,
          major: this.menteeData1.major.length > 0 ? this.menteeData1.major.join(',') : '',
          graduateSchool: this.menteeData1.graduateSchool,
          graduateMajor: graduateMajor
        }
        // this.$loading()
        if (this.fileResume) {
          uploadFunBySys(
            this.fileResume.raw,
            `resume/${this.menteeData1.menteeId}`,
            url => {
              console.log(url)
              data.resume2 = url
              console.log('更新学员信息参数yx*/486486468486468', data)
              api.setMenteeData(data).then(res => {
                console.log('更新学员信息', res)
                this.fileList = []
                this.fileResume = null
                // this.$loading().close()
                this.$emit('submit')
              })
            }
          )
        } else {
          console.log('更新学员信息参数486486468486468', data)
          api.setMenteeData(data).then(res => {
            console.log('更新学员信息', res)
            this.fileList = []
            this.fileResume = null
            // this.$loading().close()
            this.$emit('submit')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__header{
  display: block;
}
</style>
