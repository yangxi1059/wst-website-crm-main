<!--
 * @Author: 库建华
 * @Date: 2020-05-28 14:09:39
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-21 13:38:34
 * @Version: 1
 * @Description:留学机构
-->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
    v-loading = loading
      :title="cacheCooperatorData.cooperatorId ? '编辑合作商':'新增合作商'"
      :visible.sync="editVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheCooperatorData"
        :rules="rules"
        ref="cacheCooperatorData"
        label-width="160px"
      >
        <el-form-item label="合作方名称" prop="cooperatorName">
          <el-input
            :style="{width:widths}"
            v-model="cacheCooperatorData.cooperatorName"
            :maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="合作状态" prop="cooperatorStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.cooperatorStatus"
            :disabled="cacheCooperatorData.cooperatorStatus == 'doing_cooperator'"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,i) in cooperator_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
              :disabled="i>1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方国家/地区" prop="countryId">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.countryId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in country"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合作方电话" prop>
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.tel" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合作方邮箱" prop>
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.email" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="对接人微信ID" prop="wxId">
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.wxId" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合作对接人名称" prop="principal">
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.principal" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合作对接人职位" prop="principalPosition">
          <el-input
            :style="{width:widths}"
            v-model="cacheCooperatorData.principalPosition"
            maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="返佣规则" prop="brokerageStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.brokerageStatus"
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
        <el-form-item label="固定返佣美金($)" prop="fixedBrokerage" v-if="cacheCooperatorData.brokerageStatus == 'fixed_brokerage'">
          <el-input-number placeholder="请输入整数" :controls="false" :style="{width:widths}" v-model="cacheCooperatorData.fixedBrokerage"   ></el-input-number>
        </el-form-item>
        <el-form-item label="初次对接日期" prop="firstDockingDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheCooperatorData.firstDockingDate"
            :clearable="false"
            :editable="false"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="已完成合作记录" prop="completedCooperation">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.completedCooperation"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="是否收费" prop="chargeStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.chargeStatus"
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
        <template v-if="cacheCooperatorData.chargeStatus == 1">
          <el-form-item label="本次合作金额类型" prop="salaryType">
            <el-select
              :style="{width:widths}"
              v-model="cacheCooperatorData.salaryType"
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
          <el-form-item label="本次合作金额" prop="salary">
            <el-input-number
              :controls="false"
              :style="{width:widths}"
              v-model="cacheCooperatorData.salary"
              maxlength="99"
            ></el-input-number>
          </el-form-item>
        </template>
        <el-form-item label="管理人" prop="manageBy">
          <el-select
            :style="{width:widths}"
            v-model="cacheCooperatorData.manageBy"
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
        <el-form-item label="公众号平均阅读量" prop>
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheCooperatorData.officialAccountAverageReading"
            maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="单位阅读量价格(￥)" prop>
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheCooperatorData.averageReadingPrice"
            maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="已推荐学生数量" >
          <el-input-number
            :disabled="true"
            :controls="false"
            :style="{width:widths}"
            v-model="cacheCooperatorData.recommendMenteeNum"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="返佣金额" >
          <el-input
            :disabled="true"
            :style="{width:widths}"
            v-model="cacheCooperatorData.brokerage"
          ></el-input>
        </el-form-item>
        <el-form-item label="沟通进度反馈" prop="communicateFeedback">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.communicateFeedback"
            :autosize="{minRows:3}"
            :maxlength="255"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="合作内容" prop="cooperationContent">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.cooperationContent"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="合作方简介" prop="cooperatorIntroduction">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.cooperatorIntroduction"
            :autosize="{minRows:3}"
            :maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="其他" prop>
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.other"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <!--
        <el-form-item label="学校" prop="schoolId">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.schoolId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in school"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否目标学校" prop="chargeStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.chargeStatus"
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
        <el-form-item label="附件" prop="principalPosition">
          <el-input
            :style="{width:widths}"
            v-model="cacheCooperatorData.principalPosition"
            maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="公众号名称" prop="principalPosition">
          <el-input
            :style="{width:widths}"
            v-model="cacheCooperatorData.principalPosition"
            maxlength="99"
          ></el-input>
        </el-form-item>
        -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button @click="tipsTo" type="primary">小贴士</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <tips :tipVisible="tipVisible" :tipData="cooperatorData" @close="tipClose"  />
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import apiDic from '@/api/dictionary.js'
import tips from './tips.vue'
import util from '@/libs/util'
export default {
  name: 'edit',
  mixins: [mixins],
  components: { tips },
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    cooperatorData: {
      type: Object
    }
  },
  data () {
    return {
      tipVisible: false,
      cacheCooperatorData: {
        cooperatorId: null,
        cooperatorName: null,
        cooperatorStatus: null,
        cooperatorType: null,
        cooperationContent: null,
        countryId: null,
        tel: null,
        fixedBrokerage: null,
        brokerageStatus: null,
        email: null,
        principal: null,
        wxId: null,
        firstDockingDate: null,
        completedCooperation: null,
        communicateFeedback: null,
        chargeStatus: null,
        salary: null,
        salaryType: null,
        manageBy: null,
        cooperatorIntroduction: null,
        principalPosition: null,
        officialAccountAverageReading: null,
        averageReadingPrice: null,
        recommendMenteeNum: null,
        brokerageRecord: null,
        other: null
      },
      loading: false,
      cooperator_type: [],
      common_yes_or_no: [],
      cooperator_status: [],
      brokerage_status: [],
      country: [],
      school: [],

      widths: '230px',
      rules: {
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'blur' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        email: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ],
        tel: [
          { required: true, message: '必填', trigger: 'blur' }
          // {
          //   validator: checkPhone,
          //   message: "手机号格式",
          //   trigger: "blur"
          // }
        ],
        cooperatorName: [{ required: true, message: '必填', trigger: 'blur' }],
        cooperatorStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cooperatorType: [{ required: true, message: '必填', trigger: 'blur' }],
        cooperationContent: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        countryId: [{ required: true, message: '必填', trigger: 'blur' }],
        principal: [{ required: true, message: '必填', trigger: 'blur' }],
        firstDockingDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        communicateFeedback: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        brokerageStatus: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        fixedBrokerage: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'integer', message: '请输入整数', trigger: 'blur' }
        ],
        chargeStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        salaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        salary: [{ required: true, message: '必填', trigger: 'blur' }],
        manageBy: [{ required: true, message: '必填', trigger: 'blur' }],
        cooperatorIntroduction: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        principalPosition: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        officialAccountAverageReading: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        averageReadingPrice: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        brokerageRecord: [{ required: true, message: '必填', trigger: 'blur' }],
        recommendMenteeNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      users: []
    }
  },
  computed: {},
  watch: {
    editVisible: function (val) {
      if (val) {
        console.log('yx留学机构 **********************', this.cooperatorData)
        if (this.cooperatorData.cooperatorId) {
          this.getCooperatorDataById(this.cooperatorData.cooperatorId)
        } else {
          this.cacheCooperatorData = { ...this.cooperatorData }
        }
      }
    }
  },
  mounted () {
    this.pageInit()
    this.init()
  },
  methods: {
    getCooperatorDataById () {
      this.loading = true
      api.getCooperatorDataById(this.cooperatorData.cooperatorId).then(res => {
        this.loading = false
        this.cacheCooperatorData = res.data
      })
    },
    async pageInit () {
      this.school = await this.getSchool("school")
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.cooperator_type = await this.getDictionary('cooperator_type')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.cooperator_status = await this.getDictionary('cooperator_status')
      this.brokerage_status = await this.getDictionary('brokerage_status')
      this.country = await this.getDictionary('country')
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
      this.$refs.cacheCooperatorData.resetFields()
    },
    clear () {
      this.cacheCooperatorData = {
        cooperatorId: null,
        cooperatorName: null,
        cooperatorStatus: null,
        cooperatorType: null,
        cooperationContent: null,
        countryId: null,
        tel: null,
        fixedBrokerage: null,
        brokerageStatus: null,
        email: null,
        principal: null,
        wxId: null,
        firstDockingDate: null,
        completedCooperation: null,
        communicateFeedback: null,
        chargeStatus: null,
        salary: null,
        salaryType: null,
        manageBy: null,
        cooperatorIntroduction: null,
        principalPosition: null,
        officialAccountAverageReading: null,
        recommendMenteeNum: null,
        averageReadingPrice: null,
        brokerageRecord: null,
        other: null
      }
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheCooperatorData,
        this.cacheCooperatorData
      )
      if (this.cacheCooperatorData.fixedBrokerage) {
        if (this.cacheCooperatorData.brokerageStatus == 'fixed_brokerage') {
          if ((this.cacheCooperatorData.fixedBrokerage).toString().indexOf('.') != -1) {
            this.$message({
              message: '固定返佣金额不能为小数',
              type: 'error'
            })
            return false
          }
        } else {
          this.cacheCooperatorData.fixedBrokerage = null
        }
      }
      if (this.cacheCooperatorData.chargeStatus == '0') {
        this.cacheCooperatorData.salaryType = null
        this.cacheCooperatorData.salary = 0
      }
      this.$refs.cacheCooperatorData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        const data = {}
        if (this.cacheCooperatorData.cooperatorId) {
          api
            .uptCooperator(this.cacheCooperatorData)
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
            .addCooperator(this.cacheCooperatorData)
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
              this.$message({
                message: '失败',
                type: 'error'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
        }
      })
    },
    tipsTo () {
      this.tipVisible = true
    },
    tipClose () {
      this.tipVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
