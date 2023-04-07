<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" :title="'考评'" :visible.sync="editVisible" width="900px" :before-close="close">
      <el-form
        size="medium"
        inline
        :model="userData"
        :rules="rules"
        ref="userData"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="userId">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.userId"
            clearable
            placeholder="员工选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="考评类型" prop="evaluateType">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.evaluateType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in evaluate_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考评等级" prop="evaluateLevel">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.evaluateLevel"
            placeholder="请选择"
          >
            <el-option
              v-for="item in evaluate_level"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考评周期" prop="evaluatePeriod">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.evaluatePeriod"
            placeholder="请选择"
          >
            <el-option
              v-for="item in timeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考评金额" prop="evaluateAmount">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="userData.evaluateAmount"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="考评时间" prop="evaluateDate">
          <el-date-picker
            v-model="userData.evaluateDate"
            type="date"
            :style="{width:widths}"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="考评人" prop="evaluator">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.evaluator"
            clearable
            placeholder="考评人选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考评状态" prop="evaluateStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.evaluateStatus"
            clearable
            placeholder="选择"
          >
           <el-option
            v-for="item in [{itemValue:'1',itemName:'已考评'},{itemValue:'0',itemName:'待考评'}]"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考评内容" prop="evaluateContent">
          <el-input
            type="textarea"
            :style="{width:'600px'}"
            v-model="userData.evaluateContent"
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
import mixins from '@/plugin/mixins'
import api2 from '@/api/sales_assistant.js'
import api from '@/api/hr.js'
function getMonthBetween (start, end) { // 传入的格式YYYY-MM
  var betweenMonth = []
  var result = []
  var s = start.split('-')
  var e = end.split('-')
  var min = new Date()
  var max = new Date()
  min.setFullYear(s[0], s[1])
  max.setFullYear(e[0], e[1])
  var curr = min
  while (curr <= max) {
    var month = curr.getMonth()
    var str = curr.getFullYear() + '-' + (month)
    var s = curr.getFullYear() + '-0'
    if (str == s) {
      str = (curr.getFullYear() - 1) + '-12'
    }
    result.push(str)
    curr.setMonth(month + 1)
  }
  for (let i = 0; i < result.length; i++) {
    var monthX = result[i].split('-')
    if (monthX[1] < 10) {
      var month = monthX[0] + '-0' + monthX[1]
      betweenMonth.push(month)
    } else {
      betweenMonth.push(result[i])
    }
  }
  return betweenMonth
}
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    userData1: {
      type: Object
    }
  },
  data () {
    return {
      widths: '250px',
      rules: {
        userId: [{ required: true, message: '必填', trigger: 'blur' }],
        evaluateType: [{ required: true, message: '必填', trigger: 'blur' }],
        evaluatePeriod: [{ required: true, message: '必填', trigger: 'blur' }],
        evaluateAmount: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      evaluate_level: [],
      evaluate_type: [],
      userData: {},
      users: [],
      timeList: []
    }
  },
  computed: {},
  watch: {
    editVisible: function (val) {
      this.userData = { ...this.userData1 }
    }
  },
  mounted () {
    this.pageInit()
    api2.getUserList().then(({ data }) => {
      console.log('人员列表', data)
      this.users = data
    })
    var myDate = new Date()
    var time = myDate.toLocaleDateString().split('/').join('-')
    time = time.slice(0, 7)
    console.log(time)
    var dataList = getMonthBetween('2019-01', time)
    const dataTime = []
    for (let i = 0; i < dataList.length; i++) {
      dataTime.push({
        itemName: dataList[i],
        itemValue: dataList[i]
      })
    }
    this.timeList = dataTime
    console.log(this.timeList, 3333333333)
  },
  methods: {
    async pageInit () {
      this.evaluate_type = await this.getDictionary('evaluate_type')
      this.evaluate_level = await this.getDictionary('evaluate_level')
    },
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.userData.resetFields()
    },
    clear () {
      this.userData = {}
    },
    submit () {
      console.log('个人信息提交', this.$refs.userData, this.userData)
      this.$refs.userData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        let subData = {}
        if (!this.userData.pkId) {
          const data = {
            userId: this.userData.userId,
            evaluateType: this.userData.evaluateType,
            evaluatePeriod: this.userData.evaluatePeriod,
            evaluateContent: this.userData.evaluateContent,
            evaluateLevel: this.userData.evaluateLevel,
            evaluator: this.userData.evaluator,
            evaluateDate: this.userData.evaluateDate,
            evaluateAmount: this.userData.evaluateAmount,
            evaluateStatus: this.userData.evaluateStatus
          }
          subData = { addList: [data] }
        } else {
          const data = {
            userId: this.userData.userId,
            evaluateType: this.userData.evaluateType,
            evaluatePeriod: this.userData.evaluatePeriod,
            evaluateContent: this.userData.evaluateContent,
            evaluateLevel: this.userData.evaluateLevel,
            evaluator: this.userData.evaluator,
            evaluateDate: this.userData.evaluateDate,
            evaluateAmount: this.userData.evaluateAmount,
            evaluateStatus: this.userData.evaluateStatus
          }
          data.pkId = this.userData.pkId
          subData = { uptList: [data] }
        }
        api
          .setEvaluateItem(subData)
          .then(({ data }) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '提交失败',
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
