<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="userId!==''?'编辑用户':'新增用户'"
      :visible.sync="editVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="userData"
        :rules="rules"
        ref="userData"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="userName">
          <el-input :style="{width:widths}" v-model="userData.userName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input :style="{width:widths}" @blur="getTime()" v-model="userData.idCard" ></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop>
          <el-select
            multiple
            :style="{width:widths}"
            filterable
            v-model="userData.roleIds"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-select :style="{width:widths}" filterable v-model="userData.dept" placeholder="请选择">
            <el-option
              v-for="item in wst_department"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门等级" prop="levelId">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.levelId"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,i) in levelList"
              :key="i"
              :label="item.deptLevel"
              :value="item.levelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司等级" prop>
          <el-select
            disabled
            :style="{width:widths }"
            filterable
            v-model="userData.wstLevel"
            placeholder="请选择"
          >
            <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级参考薪资" prop="basicWage">
          <el-input :style="{width:widths}" v-model="userData.deptBasicWage" disabled></el-input>
        </el-form-item>
        <el-form-item label="基础薪资" prop="basicWage">
          <el-input :style="{width:widths}" v-model="userData.basicWage"></el-input>
        </el-form-item>
        <el-form-item label="企业邮箱" prop="companyEmail">
          <el-input :style="{width:widths}" v-model="userData.companyEmail"></el-input>
        </el-form-item>
        <el-form-item label="企业微信ID" prop="qyUserId">
          <el-input :style="{width:widths}" v-model="userData.qyUserId"></el-input>
        </el-form-item>
        <el-form-item label="推广码" prop="refCode" v-if="userId">
          <el-input :style="{width:widths}" v-model="userData.refCode"  disabled></el-input>
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
        <el-form-item label="签约公司" prop="contractCompany">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.contractCompany"
            placeholder="请选择"
          >
            <el-option
              v-for="item in wst_company"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="五险基数" prop="insuranceBasic">
          <el-input :style="{width:widths}" v-model="userData.insuranceBasic"></el-input>
        </el-form-item>
        <el-form-item label="住房公积金基数	" prop="fundBasic">
          <el-input :style="{width:widths}" v-model="userData.fundBasic"></el-input>
        </el-form-item>
        <el-form-item label="个税专项扣除" prop="taxDeduction">
          <el-input :style="{width:widths}" v-model="userData.taxDeduction"></el-input>
        </el-form-item>
        <el-form-item label="office" prop="office">
          <el-select filterable :style="{width:widths}" v-model="userData.office" placeholder="请选择">
            <el-option v-for="item in ['北京','上海']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.birthday"
            :disabled="true"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="入职日期" prop="hiredate">
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.hiredate"
            :clearable="false"
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="离职日期" prop="leaveDate" v-if="userId !== ''">
          <el-date-picker
            :style="{width:widths}"
            v-model="userData.leaveDate"
            clearable
            :editable="false"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="职务状态" prop="status">
          <el-cascader
            ref="owner"
            :style="{width:widths}"
            :options="entryStatusList"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            v-model="userData.status"
            clearable
            placeholder="请选择职务状态"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="二次验证" prop="secondaryValidation">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="userData.secondaryValidation"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-button
            size="mini"
            :disabled="!(userData.unionid && secondaryValidation == 1)"
            @click="unbound"
          >解除绑定</el-button>
          <el-tooltip
            effect="dark"
            content="二次验证为：是;以及已经绑定微信;才可解绑"
            placement="top-start"
          >
            <i type="text" class="el-icon-info"></i>
          </el-tooltip>
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
import api2 from '@/api/user.js'
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userData: {
        userStatus: '1',
        dept: null,
        levelId: null
      },
      widths: '250px',
      entryStatusList: [
        {
          value: '1',
          label: '在职',
          children: [{
            value: '0',
            label: '未转正'
          }, {
            value: '1',
            label: '已转正'
          }]
        },
        { value: '2', label: '离职' }
      ],
      roleList: [],
      levelList: [],
      salesLevelList: [],
      userDataAPI: {},
      sex: [],
      rules: {
        password: [{ required: true, message: '必填', trigger: 'blur' }],
        password2: [{ required: true, message: '必填', trigger: 'blur' }],
        userAcc: [{ required: true, message: '必填', trigger: 'blur' }],
        userName: [{ required: true, message: '必填', trigger: 'blur' }],
        idCard: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请正确输入身份证格式' }
        ],
        office: [{ required: true, message: '必填', trigger: 'blur' }],
        companyEmail: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        roleIds: [{ required: true, message: '必填', trigger: 'blur' }],
        hiredate: [{ required: true, message: '必填', trigger: 'blur' }],
        dept: [{ required: true, message: '必填', trigger: 'blur' }],
        levelId: [{ required: true, message: '必填', trigger: 'blur' }],
        wstLevel: [{ required: true, message: '必填', trigger: 'blur' }],
        secondaryValidation: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        status: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      wst_department: [],
      wst_company: [],
      entry_status: [],
      common_yes_or_no: [],
      secondaryValidation: null
    }
  },
  computed: {
    dept: function () {
      return this.userData.dept
    },
    deptLevel: function () {
      return this.userData.levelId
    }
  },
  watch: {
    editVisible: function (val) {
      if (val && this.userId !== '') {
        this.Topage()
      }
    },
    dept: function (val, old) {
      if (!val) {
      } else {
        const id = this.userData.levelId
        this.userData.levelId = null
        api.getLevelList({ dept: val }).then(res => {
          this.levelList = res.data
          if (!old && id) {
            this.userData.levelId = id * 1
          }
        })
      }
      if (!old) return
      this.userData.levelId = null
    },
    deptLevel: function (val, old) {
      console.log('deptLevel', val, old, this.dept, this.levelList)
      if (this.dept) {
        let levelItem = {}
        for (let i = 0; i < this.levelList.length; i++) {
          if (this.levelList[i].levelId == val) {
            levelItem = this.levelList[i]
            console.log('levelItem', levelItem)
          }
        }
        this.userData.wstLevel = levelItem.wstLevel
        this.userData.deptBasicWage = levelItem.basicWage
      }
    }
  },
  mounted () {
    this.pageInit()
    api2.roleDropdown().then(({ data }) => {
      this.roleList = data
    })
    api2.getDeptList().then(res => {
      console.log('getDeptList', res)
      this.wst_department = res.data
    })
  },
  methods: {
    async pageInit () {
      this.entry_status = await this.getDictionary('entry_status')
      this.wst_company = await this.getDictionary('wst_company')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.sex = await this.getDictionary('sex')
    },
    Topage () {
      api.getUserDateByUserId(this.userId).then(res => {
        console.log('个人信息', res.data)
        res.data.user.roleIds = res.data.user.roleIds
          ? res.data.user.roleIds.split(',')
          : []
        this.secondaryValidation = res.data.user.secondaryValidation
        this.userData = {
          basicWage: res.data.user.basicWage,
          companyEmail: res.data.user.companyEmail,
          qyUserId: res.data.user.qyUserId,
          refCode: res.data.user.refCode,
          contractCompany: res.data.user.contractCompany,
          dept: res.data.user.dept,
          deptName: res.data.user.deptName,
          entryStatus: res.data.user.entryStatus,
          trainStatus: res.data.user.trainStatus,
          status: res.data.user.trainStatus ? [res.data.user.entryStatus, res.data.user.trainStatus] : [res.data.user.entryStatus],
          secondaryValidation: res.data.user.secondaryValidation,
          unionid: res.data.user.unionid,
          fundBasic: res.data.user.fundBasic,
          hiredate: res.data.user.hiredate,
          birthday: res.data.user.birthday,
          id: res.data.user.id,
          insuranceBasic: res.data.user.insuranceBasic,
          leaveDate: res.data.user.leaveDate,
          levelId: res.data.user.levelId || '',
          materialsNum: res.data.user.materialsNum,
          name: res.data.user.name,
          office: res.data.user.office,
          positionIds: res.data.user.positionIds,
          positionNames: res.data.user.positionNames,
          roleIds: res.data.user.roleIds,
          roleNames: res.data.user.roleNames,
          sex: res.data.user.sex,
          taxDeduction: res.data.user.taxDeduction,
          userAcc: res.data.user.userAcc,
          userId: res.data.user.userId,
          userName: res.data.user.userName,
          idCard: res.data.user.idCard,
          userStatus: res.data.user.userStatus
        }
        console.log(this.userData)
        this.userDataAPI = JSON.parse(JSON.stringify(res.data.user))
      })
    },
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      this.$refs.userData.resetFields()
    },
    clear () {
      this.userData = {
        userStatus: '1',
        dept: null,
        levelId: null
      }
      this.levelList = []
    },
    submit () {
      this.$refs.userData.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.getTime()
        if (this.userData.status[0] == 2 && !this.userData.leaveDate) {
          this.$message({
            message: '离职状态的离职时间必填',
            type: 'error'
          })
          return
        }
        if (this.userData.status[0] != 2 && !!this.userData.leaveDate) {
          this.$message({
            message: '离职时间不要瞎填',
            type: 'error'
          })
          return
        }
        this.$loading()
        console.log(this.userData.status)
        console.log(this.userData.status[0] == 1 ? this.userData.status[1] : null)
        const data = {
          user: {
            userId: this.userId,
            password: this.userData.password,
            sex: this.userData.sex,
            userAcc: this.userData.userAcc,
            userName: this.userData.userName,
            idCard: this.userData.idCard,
            basicWage: this.userData.basicWage || -1,
            companyEmail: this.userData.companyEmail,
            qyUserId: this.userData.qyUserId,
            refCode: this.userData.refCode,
            userStatus: this.userData.userStatus,
            taxDeduction: this.userData.taxDeduction,
            insuranceBasic: this.userData.insuranceBasic,
            contractCompany: this.userData.contractCompany,
            fundBasic: this.userData.fundBasic,
            office: this.userData.office,
            wstLevel: this.userData.wstLevel,
            hiredate: this.userData.hiredate,
            birthday: this.userData.birthday,
            leaveDate: this.userData.leaveDate,
            entryStatus: this.userData.status[0],
            trainStatus: this.userData.status[0] == 1 ? this.userData.status[1] : '',
            secondaryValidation: this.userData.secondaryValidation,
            dept: this.userData.dept,
            levelId: this.userData.levelId
          },
          roleList: this.userData.roleIds
        }
        console.log('个人信息提交', this.$refs.userData, data)
        api
          .setUser(data)
          .then(({ data }) => {
            this.$message({
              message: '用户更新成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '用户更新失败',
              type: 'error'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clear()
          })
      })
    },
    unbound () {
      this.$confirm('此操作将解绑该用户微信, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            user: {
              userId: this.userId,
              unionid: ''
            }
          }
          api.setUser(data)
        })
        .then(() => {
          this.$message({
            message: '微信解绑成功',
            type: 'success'
          })
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '用户更新失败',
            type: 'error'
          })
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
    },
    getTime () {
      console.log(this.userData.idCard)
      var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

      if (reg.test(this.userData.idCard)) {
        let time = ''
        time = `${this.userData.idCard.slice(6, 10)}-${this.userData.idCard.slice(10, 12)}-${this.userData.idCard.slice(12, 14)}`
        console.log(time)
        this.userData.birthday = time
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
