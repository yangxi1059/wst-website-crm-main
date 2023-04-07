<template>
  <div class="set-target">
    <el-dialog 
      title="实习信息"
      :visible.sync="setInternshipVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <el-form
        :inline="true"
        ref="signTable"
        label-width="140px"
        :rules="rules"
        :model="internshipData1"
      >
        <el-form-item label="实习" prop="internshipId">
          <el-select v-model="internshipData1.internshipId" placeholder="请选择"   :style="{width:'610px'}">
            <el-option
              v-for="internship in internshipList"
              :key="internship.internshipId"
              :label="internship.internshipName + '： '+ (internship.internshipTimeName || '时长为空') + '--' + (internship.internshipLocationName || '地点为空')"
              :value="internship.internshipId"
              :disabled="internship.internshipStatus != 1 || internshipList[0].recordStatus == 0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="internshipStartDate">
          <el-date-picker
            v-model="internshipData1.internshipStartDate"
            :style="{width:'230px'}"
            type="date"
            placeholder="选择开始日期"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="internshipEndDate">
          <el-date-picker
            v-model="internshipData1.internshipEndDate"
            :style="{width:'230px'}"
            type="date"
            :clearable="false"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
export default {
  props: {
    setInternshipVisible: {
      type: Boolean,
      default: false
    },
    internshipData: {
      type: Object
    }
  },
  data: () => {
    return {
      internshipList: [],
      internshipData1: {
        internshipStartDate: '',
        internshipEndDate: '',
        internshipId: ''
      },
      rules: {
        // internshipStartDate: [{ required: true, message: "必填", trigger: "blur" }],
        // internshipEndDate: [{ required: true, message: "必填", trigger: "blur" }],
        internshipId: [{ required: true, message: '必填', trigger: 'blur' }],
        internshipLocation: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    setInternshipVisible: function (val, old) {
      if (val) {
        console.log(this.internshipData, 'yx/***8*8*8*8*8*8*8')
        this.internshipData1.internshipStartDate = this.internshipData.internshipStartDate
        this.internshipData1.internshipEndDate = this.internshipData.internshipEndDate
        this.internshipData1.internshipId = this.internshipData.internshipId
        this.getInternshipListByInternship(this.internshipData.internship)
      }
    }
  },
  methods: {
    getInternshipListByInternship (internship) { // 学员名对应实习下拉列表
      const params = {
        pageNum: 1,
        pageSize: 999,
        // recordStatus: "1",
        // internshipStatus: "1",
        internship: internship
      }
      console.log(params)
      api.getProgramInternshipList(params).then(res => {
        this.internshipList = res.data.rows
        console.log(this.internshipList, 'yx实习列表下拉项y**********')
      })
    },
    close () {
      this.$emit('close')
      this.internshipData1 = {
        internshipStartDate: '',
        internshipEndDate: '',
        internshipId: ''
      }
      this.$refs.signTable.resetFields()
    },
    submit () {
      console.log('submit')
      this.$refs.signTable.validate(valid => {
        if (!valid) return
        const data = {
          signId: this.internshipData.signId,
          internshipStartDate: this.internshipData1.internshipStartDate,
          internshipEndDate: this.internshipData1.internshipEndDate,
          internshipId: this.internshipData1.internshipId,
          offerId: this.internshipData.offerId
        }
        console.log(data)
        api.uptInternshipData(data).then(res => {
          console.log('更新', res)
          this.$emit('submit')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
