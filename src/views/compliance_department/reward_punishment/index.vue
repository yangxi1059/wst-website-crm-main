<!--
 * @Author: 库建华
 * @Date: 2019-11-14 14:05:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-09 16:00:55
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="notice">
      <el-button class="mb10" size="mini" v-if="roleInfo.includes('reward_punishment_add')" type="primary" @click="addEvent">添加记录</el-button>
      <el-card class="mb10">
		<div class="mb10">
			<div class="mb10" style="font-size:14px;font-weight:600">事件筛选</div>
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			<el-checkbox-group size="mini" v-model="eventTypes" @change="handleCheckedCitiesChange">
				<el-checkbox v-for="(item, i) in user_event_type" :label="item.itemValue" :key="i">{{item.itemName}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div style="display:flex">
			<div style="display:flex;flex-wrap:wrap">
				<div style="display:flex" class="mb10">
					<div class="mr10">
						部门/员工
						<el-cascader
						class="ml10"
						size="mini"
						style="width:150px"
						@change="changSelect"
						v-model="groupId_userId"
						:options="options"
						:props="{ checkStrictly: true, label:'userName',value:'userId',children:'userArr' }"
						clearable></el-cascader>
					</div>
					<div class="mr10">
						KPI周期
						<el-date-picker
							size="mini"
							class="ml10"
							style="width:150px"
							v-model="kpiPeriod"
							type="month"
							value-format="yyyy-MM"
							clearable
							placeholder="">
						</el-date-picker>
					</div>
				</div>
				<div  style="display:flex">
					<div class="mr10">事件日期
						<el-date-picker
						style="width:150px"
						class=" ml10"
						v-model="eventDateFrom"
						type="date"
						clearable
						size="mini"
						value-format="yyyy-MM-dd"
						placeholder="选择起始日期">
						</el-date-picker>
						至
						<el-date-picker
						style="width:150px"
						clearable
						v-model="eventDateTo"
						type="date"
						size="mini"
						value-format="yyyy-MM-dd"
						placeholder="选择截止日期">
						</el-date-picker>
					</div>
					<el-button style="display:block;height:28px" type="primary" size="mini" @click="initTable" >GO</el-button>
				</div>
			</div>
			<pagination
			:total="total"
			:current-page="pageNum"
			:page-size="pageSize"
			@handleSizeChange="handleSizeChange"
			@handleCurrentChange="handleCurrentChange"
			></pagination>
		</div>
      </el-card>
      <el-table :data="tableData" @row-dblclick="eventDetail" size="mini"  border stripe>
        <el-table-column sortable prop="eventTypeName" label="事件" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="eventDate" label="日期" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="kpiPeriod" label="KPI周期" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="userName" label="员工" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="eventAmount" label="奖惩金额" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="eventContent" label="奖惩说明" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="createByName" label="记录人" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="createTime" label="记录时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
	<el-dialog
		:close-on-click-modal="false"
		:visible.sync="dialogVisible"
		width="420px"
		:before-close="handleClose">
		<el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="奖惩：" prop="status">
				<el-radio @change="changeStatus" v-model="formData.status" label="1">奖励</el-radio>
  				<el-radio @change="changeStatus" v-model="formData.status" label="2">惩罚</el-radio>
  				<el-radio @change="changeStatus" v-model="formData.status" label="3">假期</el-radio>
			</el-form-item>
			<el-form-item v-if="formData.status" label="事件：" prop="eventType">
				<el-select style="width:220px" v-model="formData.eventType" placeholder="请选择事件">
					<el-option v-for="(item,i) in eventTypeList" :key="i" :label="item.itemName" :value="item.itemValue"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item  label="员工：" prop="userId">
				<el-cascader
				size="mini"
				style="width:220px"
				collapse-tags
				filterable
				v-model="formData.userId"
				:options="options"
				:props="{ multiple: true, label:'userName',value:'userId',children:'userArr',disabled:'aaaaaaa', }"
				clearable></el-cascader>
			</el-form-item>
			<el-form-item  label="日期：" prop="eventDate">
				<el-date-picker
					style="width:220px"
					v-model="formData.eventDate"
					type="date"
					size="mini"
					@change="changeTime"
					value-format="yyyy-MM-dd"
					placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item  label="KPI周期：" prop="kpiPeriod">
				<el-date-picker
					size="mini"
					style="width:220px"
					v-model="formData.kpiPeriod"
					type="month"
					value-format="yyyy-MM"
					placeholder="">
				</el-date-picker>
			</el-form-item>
			<el-form-item  label="奖惩金额：" prop="eventAmount">
				<el-input-number
					:controls="false"
					size="mini"
					v-model="formData.eventAmount"
					style="width:220px">
				</el-input-number>
			</el-form-item>
			<el-form-item  label="说明：" prop="eventContent">
				<el-input
				type="textarea"
				maxlength="200"
				size="mini"
				:autosize="{ minRows: 2}"
				v-model="formData.eventContent"
				style="width:220px">
				</el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" @click="handleSubmit">确 定</el-button>
		</span>
		</el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api/hr.js'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
import util from '@/libs/util'

export default {
  name: 'notice',
  mixins: [mixins],
  components: { },
  data: () => {
    return {
	  rules: {
        status: [{ required: true, message: '必填', trigger: 'blur' }],
        userId: [{ required: true, message: '必填', trigger: 'blur' }],
        eventType: [{ required: true, message: '必填', trigger: 'blur' }],
        kpiPeriod: [{ required: true, message: '必填', trigger: 'blur' }],
        eventContent: [{ required: true, message: '必填', trigger: 'blur' }],
        eventDate: [{ required: true, message: '必填', trigger: 'blur' }],
        eventAmount: [{ required: true, message: '必填', trigger: 'blur' }, { message: '大于等于0的整数', pattern: /^\d+$/ }]
      },
	  checkAll: true,
	  isIndeterminate: false,
      user_event_type: [],
	  loading: false,
	  groupId_userId: '',
      tableData: [],
      userId: '',
	  deptId: '',
	  dialogVisible: false,
	  options: [],
      eventTypes: [],
      kpiPeriod: '',
	  eventDateFrom: '',
      user: util.sessions.get('userInfo').userId,
	  eventDateTo: '',
	  groupId: '',
	  eventTypeList: [],
	  pageSize: 400,
	  pageNum: 1,
	  total: 0,
	  formData: {
        status: '',
        userId: [],
        eventType: '',
        kpiPeriod: '',
        eventContent: '',
        eventDate: '',
        eventAmount: 0
	  }
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mounted () {
    apiDic.getUserList2().then(res => {
      console.log(res.data)
      this.options = res.data
      this.options.forEach(item => {
        item.userName = item.deptName
        item.userId = item.deptId
        if (!item.deptId) {
          item.disabled = true
        }
	  })
	  console.log(this.options)
    })
    this.pageInit()
  },
  methods: {
    async pageInit () {
	  this.eventTypes = []
	  const arr = await this.getDictionary('user_event_type')
	  const arr1 = []
	  const arr3 = []
	  arr.forEach(item => {
        if (item.parentItem) {
          arr1.push(item)
        }
	  })
	  arr1.forEach((item) => {
        if (this.roleInfo.includes(`reward_punishment_${item.itemValue}`)) {
          arr3.push(item)
        }
	  })
	  this.user_event_type = arr3
	  this.user_event_type.forEach(item => {
        this.eventTypes.push(item.itemValue)
	  })
      this.initTable()
    },
    initTable () {
      const data = {
        userId: this.userId,
        deptId: this.groupId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        kpiPeriod: this.kpiPeriod,
        eventDateFrom: this.eventDateFrom,
        eventDateTo: this.eventDateTo,
        eventTypes: this.eventTypes.join(',')
	  }
	  console.log(data)
	  this.loading = true
	  api.eventList(data).then(res => {
        console.log(res.data)
        this.tableData = res.data.rows
		  if (this.user_event_type.length > 0) {
			  this.loading = false
		  }
		  this.total = res.data.total
	  })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.initTable()
    },
    addEvent () {
      this.dialogVisible = true
    },
    eventDetail (row) {

    },
    changeSelect (data) {
      this.groupId = data.groupId
      this.user = data.user
    },
    handleCheckAllChange (val) {
	  const arr = []
	  this.user_event_type.forEach(item => {
        arr.push(item.itemValue)
	  })
      this.eventTypes = val ? arr : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.user_event_type.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.user_event_type.length
    },
    changSelect () {
      if (this.groupId_userId.length == 1) {
        this.groupId = this.groupId_userId[0]
        this.userId = ''
      } else if (this.groupId_userId.length == 2) {
        this.groupId = ''
        this.userId = this.groupId_userId[1]
      } else {
        this.groupId = ''
        this.userId = ''
      }
      console.log(this.groupId_userId)
    },
    handleClose () {
	  this.eventTypeList = []
	  this.formData = {
        status: '',
        userId: [],
        eventType: '',
        kpiPeriod: '',
        eventContent: '',
        eventDate: '',
        eventAmount: 0
	  }
      this.dialogVisible = false
    },
    handleSubmit () {
      console.log(this.formData)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
		  this.$loading()
          const data = JSON.parse(JSON.stringify(this.formData))
          const arr = []
          data.userId.forEach(item => {
            arr.push(item[1])
          })
          data.userId = arr.join(',')
          console.log(data)
          api.addEventList(data, data.userId).then(res => {
			this.$message.success('新增成功！！')
		  	this.$loading().close()
            this.handleClose()
            this.initTable()
          })
        }
      })
    },
    changeStatus () {
	  this.formData.eventType = ''
	  console.log(this.formData.status, this.user_event_type)
	  this.eventTypeList = []
	  if (this.formData.status == 1) {
        this.user_event_type.forEach(item => {
          if (item.parentItem == 'award') {
            this.eventTypeList.push(item)
          }
        })
	  } else if (this.formData.status == 2) {
        this.user_event_type.forEach(item => {
          if (item.parentItem == 'punish') {
            this.eventTypeList.push(item)
          }
        })
	  } else if (this.formData.status == 3) {
        this.user_event_type.forEach(item => {
          if (item.parentItem == 'vacation') {
            this.eventTypeList.push(item)
          }
        })
	  }
    },
    changeTime () {
      console.log(this.formData.eventDate)
      if (this.formData.eventDate) {
        var date = new Date(this.formData.eventDate)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        console.log(year, month, day)
        let str = ''
        if (day > 23) {
          if (month == 12) {
            str = `${year + 1}-01`
          } else {
            month < 9 ? str = `${year}-0${month + 1}` : str = `${year}-${month + 1}`
          }
        } else {
		  month < 10 ? str = `${year}-0${month}` : str = `${year}-${month}`
        }
        this.formData.kpiPeriod = str
        console.log(str)
      } else {
        this.formData.kpiPeriod = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
