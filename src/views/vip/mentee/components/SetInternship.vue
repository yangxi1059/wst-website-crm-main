<template>
  <div class="set-target">
    <el-dialog
      :close-on-click-modal="false"
      title="设置实习"
      :visible.sync="setInternshipVisible"
      width="1000px"
      :before-close="close"
    >
      <el-form :inline="true" label-width="130px" :rules="rule">
        <el-form-item label="实习单位">
          <el-cascader
            expand-trigger="hover"
            :options="internshipUnitList"
            v-model="internshipData.internship"
            style="width: 230px;"
            filterable
            :props="internshipProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="实习时间">
          <el-date-picker
            :style="{width:'280px'}"
            type="daterange"
            v-model="internshipData.internshipDate"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="实习状态">
          <el-select
            v-model="internshipData.internshipStatus"
            placeholder="请选择实习时长"
            :style="{width:'230px'}"
          >
            <el-option
              v-for="item in internship_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习备注">
          <el-input :style="{width:'280px'}" v-model="internshipData.internshipNote"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="updatedInternship"
          v-if="internshipData.internshipStatus == '是'"
        >更改实习</el-button>
        <el-button type="primary" @click="submit" v-else>分配实习</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
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
      sign_internship_company: [],
      internship_status: [
        { itemName: '已安排', itemValue: '1' },
        { itemName: '未安排', itemValue: '0' }
      ],
      rule: {
        wxId: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },

      internshipProps: {
        children: 'internshipArr',
        label: 'internshipName',
        value: 'internshipId'
      },
      internshipUnitList: []
    }
  },
  watch: {
    setInternshipVisible: function (val) {
      if (val) {
        this.internshipData.internship = [
          this.internshipData.internship,
          this.internshipData.internshipId
        ]
        this.pageInit()
      }
    }
  },
  methods: {
    pageInit () {
      const params = {
        pageNum: 1,
        pageSize: 999,
        recordStatus: '1'
      }
      apiDic.getInternshipList(params).then(res => {
        console.log('获取实习单位列表', res)
        this.internshipUnitList = res.data.rows
        this.internshipUnitList.forEach(v => {
          v.internshipId = v.internship
          v.internshipArr.forEach(vv => {
            vv.internshipName += `[${vv.internshipTimeName ||
              ''}-${vv.internshipLocationName || ''} ]`
          })
        })
      })
    },
    close () {
      this.$emit('close')
    },
    submit () {
      console.log('submit', this.internshipData)
      const data = {
        signId: this.internshipData.signId,
        internshipId: this.internshipData.internship[1],
        internshipNote: this.internshipData.internshipNote,
        internshipStatus: this.internshipData.internshipStatus,
        internshipStartDate: this.internshipData.internshipDate[0],
        internshipEndDate: this.internshipData.internshipDate[1]
      }
      console.log('安排实习参数', data)
      api.updatedSignEdit(data).then(res => {
        console.log('安排实习', res)
        this.$emit('submit')
      })
    },
    updatedInternship () {
      console.log('submit', this.internshipData)
      const data1 = {
        signId: this.internshipData.signId,
        internshipId: this.internshipData.internship[1],
        internshipNote: this.internshipData.internshipNote,
        internshipStatus: this.internshipData.internshipStatus,
        internshipStartDate: this.internshipData.internshipDate[0],
        internshipEndDate: this.internshipData.internshipDate[1]
      }
      console.log('更新安排实习参数', data1)
      api.updatedInternship(data1).then(res => {
        console.log('更新安排实习', res)
        this.$emit('submit')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
