<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" :title="'编辑比例%'" :visible.sync="editVisible" width="900px" :before-close="close">
      <el-form
        size="medium"
        inline
        :model="editData"
        :rules="rules"
        ref="editData"
        label-width="200px"
      >
        <el-form-item label="office" prop="office">
          <el-input :style="{width:widths}" disabled v-model="editData.office"></el-input>
        </el-form-item>
        <el-form-item label="个税起征点 /元" prop="taxBasic">
          <el-input-number :controls="false" :style="{width:widths}" v-model="editData.taxBasic"></el-input-number>
        </el-form-item>
        <el-form-item label="养老保险个人缴纳比例%" prop="endowmentInsuranceUser">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.endowmentInsuranceUser"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="养老保险单位缴纳比例%" prop="endowmentInsuranceWst">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.endowmentInsuranceWst"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="医疗保险个人缴纳比例%" prop="medicalInsuranceUser">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.medicalInsuranceUser"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="医疗保险单位缴纳比例%" prop="medicalInsuranceWst">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.medicalInsuranceWst"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="失业保险个人缴纳比例%" prop="unemploymentInsuranceUser">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.unemploymentInsuranceUser"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="失业保险单位缴纳比例%" prop="unemploymentInsuranceWst">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.unemploymentInsuranceWst"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="工伤保险单位缴纳比例%" prop="injuryInsuranceWst">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.injuryInsuranceWst"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="生育保险单位缴纳比例%" prop="birthInsuranceWst">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.birthInsuranceWst"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="住房公积金 个人缴纳比例%" prop="houseFundUser">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.houseFundUser"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="住房公积金 单位缴纳比例%" prop="houseFundWst">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.houseFundWst"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="医疗保险个人额外缴纳金额" prop="medicalInsuranceUserExtra">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="editData.medicalInsuranceUserExtra"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input type="textarea" :style="{width:widths}" v-model="editData.note" maxlength="199"></el-input>
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
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    editData1: {
      type: Object
    }
  },
  data () {
    return {
      widths: '150px',
      editData: {},
      rules: {
        endowmentInsuranceUser: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        taxBasic: [{ required: true, message: '必填', trigger: 'blur' }],
        endowmentInsuranceWst: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        medicalInsuranceUser: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        medicalInsuranceWst: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        unemploymentInsuranceUser: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        unemploymentInsuranceWst: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        injuryInsuranceWst: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        birthInsuranceWst: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        houseFundUser: [{ required: true, message: '必填', trigger: 'blur' }],
        houseFundWst: [{ required: true, message: '必填', trigger: 'blur' }],
        medicalInsuranceUserExtra: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    editVisible: function (val) {
      if (val) {
        this.editData = JSON.parse(JSON.stringify(this.editData1))
      }
    }
  },
  mounted () {},
  methods: {
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.editData.resetFields()
    },
    clear () {
      this.editData = {}
    },
    submit () {
      console.log('个人信息提交', this.$refs.editData, this.editData)
      this.$refs.editData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        const data = {
          office: this.editData.office,
          endowmentInsuranceUser: this.editData.endowmentInsuranceUser,
          endowmentInsuranceWst: this.editData.endowmentInsuranceWst,
          medicalInsuranceUser: this.editData.medicalInsuranceUser,
          medicalInsuranceWst: this.editData.medicalInsuranceWst,
          unemploymentInsuranceUser: this.editData.unemploymentInsuranceUser,
          unemploymentInsuranceWst: this.editData.unemploymentInsuranceWst,
          injuryInsuranceWst: this.editData.injuryInsuranceWst,
          birthInsuranceWst: this.editData.birthInsuranceWst,
          houseFundUser: this.editData.houseFundUser,
          houseFundWst: this.editData.houseFundWst,
          medicalInsuranceUserExtra: this.editData.medicalInsuranceUserExtra,
          taxBasic: this.editData.taxBasic,
          note: this.editData.note
        }
        api
          .setRate({ uptList: [data] })
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
