<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="cacheAmbassadorData.ambassadorId ? '编辑校园大使':'新增校园大使'"
      :visible.sync="editVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheAmbassadorData"
        :rules="rules"
        ref="cacheAmbassadorData"
        label-width="140px"
      >
        <el-form-item label="校园大使名称" prop="ambassadorName">
          <el-input
            :style="{width:widths}"
            v-model="cacheAmbassadorData.ambassadorName"
            maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用合作" prop="ambassadorStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheAmbassadorData.ambassadorStatus"
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
        <el-form-item label="校园大使类型" prop="ambassadorType">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheAmbassadorData.ambassadorType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ambassador_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="schoolId">
          <el-select
            :style="{width:widths}"
            v-model="cacheAmbassadorData.schoolId"
            clearable
            filterable
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
        <el-form-item label="专业" prop="major">
          <el-select
            :style="{width:widths}"
            v-model="cacheAmbassadorData.major"
            clearable
            filterable
            placeholder="请选择专业"
          >
            <el-option
              v-for="item in major"
              :key="item.majorId"
              :label="item.allName"
              :value="item.majorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业年份" prop="finishYear">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheAmbassadorData.finishYear"
            :clearable="false"
            :editable="false"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="校园大使电话" prop>
          <el-input :style="{width:widths}" v-model="cacheAmbassadorData.tel" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="校园大使邮箱" prop="email">
          <el-input :style="{width:widths}" v-model="cacheAmbassadorData.email" maxlength="99"></el-input>
        </el-form-item>

        <el-form-item label="返佣规则" prop="brokerageStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheAmbassadorData.brokerageStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in brokerage_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定返佣美金($)" prop="fixedBrokerage" v-if="cacheAmbassadorData.brokerageStatus == 'fixed_brokerage'">
          <el-input-number placeholder="请输入整数" :controls="false" :style="{width:widths}" v-model="cacheAmbassadorData.fixedBrokerage"   ></el-input-number>
        </el-form-item>

        <el-form-item label="微信ID" prop="wxId">
          <el-input :style="{width:widths}" v-model="cacheAmbassadorData.wxId" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="初次对接日期" prop="firstDockingDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheAmbassadorData.firstDockingDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否咨询" prop="consultStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheAmbassadorData.consultStatus"
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
        <el-form-item label="是否onboard" prop="onboardStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheAmbassadorData.onboardStatus"
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
        <el-form-item label="onboard日期" prop="onboardDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheAmbassadorData.onboardDate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="沟通进度" prop="communicateRecord">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheAmbassadorData.communicateRecord"
            :autosize="{minRows:3}"
            :maxlength="255"
          ></el-input>
        </el-form-item>

        <el-form-item label="发薪日" prop="salaryDay">
          <el-select
            :style="{width:widths}"
            v-model="cacheAmbassadorData.salaryDay"
            placeholder="请选择"
          >
            <el-option v-for="item in 31" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资类型" prop="salaryType">
          <el-select
            :style="{width:widths}"
            v-model="cacheAmbassadorData.salaryType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bill_currency_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资金额" prop="salary">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheAmbassadorData.salary"
            maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="管理人" prop="manageBy">
          <el-select
            :style="{width:widths}"
            v-model="cacheAmbassadorData.manageBy"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校园大使简介" prop="ambassadorIntroduction">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheAmbassadorData.ambassadorIntroduction"
            :autosize="{minRows:3}"
            :maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheAmbassadorData.note"
            :autosize="{minRows:3}"
            :maxlength="255"
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
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import apiDic from '@/api/dictionary.js'
import util from '@/libs/util'
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    ambassadorData: {
      type: Object
    }
  },
  data () {
    return {
      cacheAmbassadorData: {
        ambassadorId: null,
        ambassadorName: null,
        ambassadorStatus: null,
        ambassadorType: null,
        brokerageStatus: null,
        tel: null,
        fixedBrokerage: null,
        email: null,
        firstDockingDate: null,
        communicateRecord: null,
        salaryDay: null,
        salaryType: null,
        salary: null,
        manageBy: null,
        ambassadorIntroduction: null,
        schoolId: null,
        major: null,
        finishYear: null,
        wxId: null,
        consultStatus: null,
        onboardStatus: null,
        onboardDate: null
      },
      bill_currency_type:[],
      brokerage_status: [],
      ambassador_type: [],
      common_yes_or_no: [],
      country: [],
      major: [], // 专业
      school: [],

      widths: '250px',
      rules: {
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'blur' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        ambassadorName: [{ required: true, message: '必填', trigger: 'blur' }],
        ambassadorStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        brokerageStatus: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        fixedBrokerage: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'integer', message: '请输入整数', trigger: 'blur' }
        ],
        ambassadorType: [{ required: true, message: '必填', trigger: 'blur' }],
        tel: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        firstDockingDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        communicateRecord: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        salaryDay: [{ required: true, message: '必填', trigger: 'blur' }],
        salaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        salary: [{ required: true, message: '必填', trigger: 'blur' }],
        manageBy: [{ required: true, message: '必填', trigger: 'blur' }],
        ambassadorIntroduction: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        schoolId: [{ required: true, message: '必填', trigger: 'blur' }],
        major: [{ required: true, message: '必填', trigger: 'blur' }],
        finishYear: [{ required: true, message: '必填', trigger: 'blur' }],
        onboardStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        consultStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      users: []
    }
  },
  computed: {},
  watch: {
    editVisible: function (val) {
      if (val) {
        if (this.ambassadorData.ambassadorId) {
          this.getAmbassadorDataById(this.ambassadorData.ambassadorId)
        } else {
          this.cacheAmbassadorData = { ...this.ambassadorData }
        }
      }
    }
  },
  mounted () {
    this.pageInit()
    this.init()
  },
  methods: {
    getAmbassadorDataById (id) {
      api.getAmbassadorDataById(id).then(res => {
        console.log(res.data, 'get校园大使的请求')
        this.cacheAmbassadorData = res.data
      })
    },
    async pageInit () {
      this.ambassador_type = await this.getDictionary('ambassador_type')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.brokerage_status = await this.getDictionary('brokerage_status')
      this.country = await this.getDictionary('country')
      this.school = await this.getSchool("school")
      this.major = await this.getMajor()
    },
    init () {
      apiDic.getUserList('').then(({ data }) => {
        console.log(
          'userList...........................................',
          data
        )
        this.users = data
      })
    },
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.cacheAmbassadorData.resetFields()
    },
    clear () {
      this.cacheAmbassadorData = {
        ambassadorId: null,
        ambassadorName: null,
        ambassadorStatus: null,
        ambassadorType: null,
        tel: null,
        fixedBrokerage: null,
        brokerageStatus: null,
        email: null,
        firstDockingDate: null,
        consultStatus: null,
        onboardStatus: null,
        onboardDate: null,
        communicateRecord: null,
        salaryDay: null,
        salaryType: null,
        salary: null,
        manageBy: null,
        ambassadorIntroduction: null,
        schoolId: null,
        major: null,
        finishYear: null,
        wxId: null,
        consultStatus: null,
        onboardStatus: null,
        onboardDate: null
      }
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheAmbassadorData,
        this.cacheAmbassadorData
      )
      if (this.cacheAmbassadorData.fixedBrokerage) {
        if (this.cacheAmbassadorData.brokerageStatus == 'fixed_brokerage') {
          if ((this.cacheAmbassadorData.fixedBrokerage).toString().indexOf('.') != -1) {
            this.$message({
              message: '固定返佣金额不能为小数',
              type: 'error'
            })
            return false
          }
        } else {
          this.cacheAmbassadorData.fixedBrokerage = null
        }
      }
      this.$refs.cacheAmbassadorData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        console.log(this.cacheAmbassadorData)
        if (this.cacheAmbassadorData.ambassadorId) {
          api
            .uptAmbassador(this.cacheAmbassadorData)
            .then(() => {
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
                message: '失败',
                type: 'error'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
        } else {
          api
            .addAmbassador(this.cacheAmbassadorData)
            .then(() => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
            .catch(err => {
              console.log(err)
              this.$loading().close()
              // this.$emit("submit");
              // this.clear();
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
