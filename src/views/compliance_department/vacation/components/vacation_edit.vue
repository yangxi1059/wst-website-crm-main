<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" :title="'年假详情'" :visible.sync="editVisible" width="660px" :before-close="close">
      <el-form
        size="mini"
        inline
        :model="itemData"
        :rules="rules"
        ref="itemData"
        label-width="220px"
      >
        <el-form-item label="员工姓名:" prop="userName">
          <el-input v-model="itemData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="周期状态:" prop="recordStatus">
          <p>{{itemData.recordStatus == 0 ? '本期' : '往期'}}</p>
        </el-form-item>
        <el-form-item label="本周期开始日期:" prop="fromDate">
          <el-input v-model="itemData.fromDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="本周期结束日期:" prop="toDate">
          <el-input v-model="itemData.toDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="年假总天数:" prop="vacationDay">
          <el-input v-model="itemData.vacationDay"></el-input>
        </el-form-item>
        <el-form-item label="本周期内已经使用的年假天数" prop="vacationUseDay">
          <el-input v-model="itemData.vacationUseDay"></el-input>
        </el-form-item>
        <el-form-item label="带薪病假天数:" prop="paidSickDay">
          <el-input v-model="itemData.paidSickDay"></el-input>
        </el-form-item>
        <el-form-item label="本周期已经使用的带薪病假天数" prop="paidSickUseDay">
          <el-input v-model="itemData.paidSickUseDay"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="note">
          <el-input
            type="textarea"
            :style="{width:'300px'}"
            v-model="itemData.note"
            maxlength="200"
          ></el-input>
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
import api from '@/api/hr.js'
export default {
  name: 'vacation-edit',
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object
    }
  },
  data () {
    return {
      widths: '250px',
      rules: {
        vacationDay: [{ required: true, message: '必填', trigger: 'blur' }],
        vacationUseDay: [{ required: true, message: '必填', trigger: 'blur' }],
        paidSickDay: [{ required: true, message: '必填', trigger: 'blur' }],
        paidSickUseDay: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.itemData.resetFields()
    },
    clear () {},
    submit () {
      console.log(this.itemData)
      if (parseFloat(this.itemData.vacationUseDay) > parseFloat(this.itemData.vacationDay)) {
        this.$message({
          type: 'error',
          message: '年假天数超了！'
        })
        return
      }
      if (parseFloat(this.itemData.paidSickUseDay) > parseFloat(this.itemData.paidSickDay)) {
        this.$message({
          type: 'error',
          message: '带薪病假天数超了！'
        })
        return
      }
      const data = {
        pkId: this.itemData.pkId,
        vacationDay: this.itemData.vacationDay,
        vacationUseDay: this.itemData.vacationUseDay,
        paidSickDay: this.itemData.paidSickDay,
        paidSickUseDay: this.itemData.paidSickUseDay,
        note: this.itemData.note
      }
      this.$loading()
      api.setVacationItem({ uptList: [data] }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.$loading().close()
        this.$emit('submit')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
