<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false" title="更新数据" :visible.sync="uptDataVisible" width="800px" :before-close="close">
      <el-form
        :inline="true"
        ref="signTable"
        label-width="140px"
        :rules="rules"
        :model="internshipData1"
      >
        <el-form-item label="实习" prop="internshipId">
          <el-select v-model="internshipData1.internshipId" :style="{width:'610px'}">
            <el-option
              v-for="internship in internshipList"
              :key="internship.internshipId"
              :label="internship.internshipName + '： '+ (internship.internshipTimeName || '时长为空') + '--' + (internship.internshipLocationName || '地点为空')"
              :value="internship.internshipId"
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
        <el-form-item label="学员收到Offer时间" prop="offerReceiveDate">
          <el-date-picker
            v-model="internshipData1.offerReceiveDate"
            :style="{width:'230px'}"
            type="date"
            :clearable="false"
            placeholder="选择日期"
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
import apiDic from '@/api/dictionary'
export default {
  props: {
    uptDataVisible: {
      type: Boolean,
      default: false
    },
    internshipData: {
      type: Object
    }
  },
  data: () => {
    return {
      // 实习单位列表
      internshipUnitList: [],
      internshipProps: {
        children: 'internshipArr',
        label: 'internshipName',
        value: 'internshipId'
      },
      internshipList: [],
      internshipData1: {
        internshipStartDate: '',
        internshipEndDate: '',
        offerReceiveDate: '',
        internshipId: []
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
    uptDataVisible: function (val, old) {
      if (val) {
        this.internshipData1.internshipStartDate = this.internshipData.internshipStartDate
        this.internshipData1.internshipEndDate = this.internshipData.internshipEndDate
        this.internshipData1.offerReceiveDate = this.internshipData.offerReceiveDate
        this.internshipData1.internshipId = this.internshipData.internshipId
        // this.getInternshipList();
        this.getInternshipListByInternship(this.internshipData.internship)
      }
    }
  },
  methods: {
    getInternshipList () {
      const params = {
        pageNum: 1,
        pageSize: 999,
        recordStatus: '1'
      }
      apiDic.getInternshipList(params).then(res => {
        this.internshipUnitList = res.data.rows
        this.internshipUnitList.forEach(v => {
          v.internshipArr.forEach(vv => {
            vv.internshipName =
              vv.internshipName +
              '-' +
              vv.internshipLocationName +
              '-' +
              vv.internshipTimeName
          })
        })
      })
    },
    getInternshipListByInternship (internship) {
      const params = {
        pageNum: 1,
        pageSize: 999,
        recordStatus: '1',
        internshipStatus: '1',
        internship: internship
      }
      console.log(params, 111111111111111111)
      api.getProgramInternshipList(params).then(res => {
        this.internshipList = res.data.rows
      })
    },
    close () {
      this.$emit('close')
      this.$refs.signTable.resetFields()
    },
    submit () {
      const data = {
        signId: this.internshipData.signId,
        internshipStartDate: this.internshipData1.internshipStartDate,
        internshipEndDate: this.internshipData1.internshipEndDate,
        offerReceiveDate: this.internshipData1.offerReceiveDate,
        internshipId: this.internshipData1.internshipId,
        offerId: this.internshipData.offerId
      }
      api.STSuptInternshipData(data).then(res => {
        console.log('更新', res)
        this.$emit('submit')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
