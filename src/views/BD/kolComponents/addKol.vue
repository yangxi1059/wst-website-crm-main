<!--
 * @Author: 杨曦
 * @Date: 2021-10-22 15:08:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 09:51:33
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-dialog :close-on-click-modal="false"
			width="642px"
			:before-close="newClose"
			:visible.sync="addVisible"
		>
			<div>
				<el-steps :active="active" size="mini" simple style="margin-top: 20px">
					<el-step title="步骤 1 - 选择类型" ></el-step>
					<el-step title="步骤 2 - 录入信息" ></el-step>
				</el-steps>
				<div class="" style="margin-top:40px">
					<div v-if="active == 1" style="display:flex;justify-content:center">
						<div class="mr20" >
							<div class="mb10">
								<el-radio  v-model="kolType" label="mentee" border>学员</el-radio>
							</div>
							<div class="mb10">
								<el-radio v-model="kolType" label="mentor" border>导师</el-radio>
							</div>
							<div class="mb10">
								<el-radio v-model="kolType" label="other" border>其他</el-radio>
							</div>
						</div>
						<div style="">
							<el-input v-if="kolType == 'mentee'" v-model="keyId" placeholder="请输入学员ID"></el-input>
							<el-input v-if="kolType == 'mentor'" v-model="keyId" placeholder="请输入导师ID"></el-input>
							<el-input v-if="kolType == 'other'" v-model="keyId" placeholder="无须输入" :disabled="true" ></el-input>
						</div>
					</div>
					<div v-if="active == 2">
						<el-form inline :model="addData" :rules="rules" ref="ruleForm" label-width="100px" >
							<el-form-item label="微信" prop="wxId">
								<el-input :disabled="kolType != 'other'?true:false" v-model="addData.wxId"></el-input>
							</el-form-item>
							<el-form-item label="身份">
								<el-select style="width:190px" :disabled="true" v-model="kolType" placeholder="请选择">
									<el-option
										v-for="item in kolTypeList"
										:key="item.itemValue"
										:label="item.itemName"
										:value="item.itemValue">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="姓名" prop="kolName">
								<el-input :disabled="kolType != 'other'?true:false" v-model="addData.kolName"></el-input>
							</el-form-item>
							<el-form-item label="微信名" prop="wxName">
								<el-input :disabled="kolType != 'other'?true:false" v-model="addData.wxName"></el-input>
							</el-form-item>
							<el-form-item label="备注" prop="note">
								<el-input :disabled="kolType != 'other'?true:false" v-model="addData.note"></el-input>
							</el-form-item>
							<el-form-item label="管理人" prop="manageBy">
								<el-select
									style="width:190px"
									v-model="addData.manageBy"
									clearable
									placeholder="管理人"
								>
									<el-option
										v-for="item in users"
										:key="item.userId"
										:label="item.userName"
										:value="item.userId"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="是否启用" prop="kolStatus">
								<el-select style="width:190px"  v-model="addData.kolStatus" placeholder="请选择">
									<el-option
										v-for="item in common_yes_or_no"
										:key="item.itemValue"
										:label="item.itemName"
										:value="item.itemValue">
									</el-option>
								</el-select>
							</el-form-item>

						</el-form>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="newClose" >取 消</el-button>
				<el-button type="primary" v-if="active == 2 && !kolTypeNew" @click="newUserUp" >上一步</el-button>
				<el-button type="primary" v-if="active == 1" @click="newUser" >下一步</el-button>
				<el-button type="success" v-if="active == 2" @click="sumbit" >提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd'
import apiVip from '@/api/vip'
import apiUser from '@/api/sales_assistant'
import { mapState } from 'vuex'
import util from '@/libs/util'
export default {
  components: { },
  mixins: [mixins],
  name: 'addKol',
  props: {
    addVisible: {
      type: Boolean,
      default: false
    },
    kolTypeNew: {},
    keyIdNew: {}
  },
  data () {
    return {
      active: 1,
      kolType: '',
      keyId: '',
      common_yes_or_no: [],
      addData: {
        wxName: '',
        keyId: '',
        wxId: '',
        kolType: '',
        note: '',
        manageBy: '',
        kolName: '',
        kolStatus: ''
      },
      dataFrom: {
        wxName: '',
        keyId: '',
        wxId: '',
        kolType: '',
        note: '',
        manageBy: '',
        kolName: '',
        kolStatus: ''
      },
      kolTypeList: [
        { itemName: '学员', itemValue: 'mentee' },
        { itemName: '导师', itemValue: 'mentor' },
        { itemName: '其他', itemValue: 'other' }
      ],
      rules: {
        kolStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        wxId: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('role', ['userInfo'])
  },
  created () {
  },
  watch: {
    addVisible: function (newData) {
      if (newData) {
        console.log(this.kolTypeNew, this.keyIdNew)
        this.kolType = this.kolTypeNew || ''
        this.keyId = this.keyIdNew || ''
        this.active = this.kolTypeNew ? 2 : 1
        if (this.kolTypeNew) {
          this.newUser()
        }
      }
    }
  },
  mounted () {
    this.pageInit()
    apiUser.subordinate(this.manageBy, '').then(({ data }) => {
      const users = [
        { userId: this.userInfo.userId, userName: this.userInfo.userName }
      ]
      data.forEach(e => {
        if (!users.some(em => em.userId == e.userId)) {
          users.push(e)
        }
      })
      this.users = users
    })
  },
  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    newClose () {
      this.clear()
      this.$emit('close')
    },
    newUserUp () {
      this.active = 1
      this.clear()
    },
    newUser () {
      if ((this.kolType == 'mentee' || this.kolType == 'mentor') && this.keyId) {
        if (this.kolType == 'mentee') {
          apiUser.getMenteeDataByMenteeId(this.keyId).then(res => {
            console.log(res.data)
            this.active = 2
            this.dataFrom.wxName = res.data.wxName || ''
            this.dataFrom.wxId = res.data.wxName || ''
            this.dataFrom.note = res.data.wxName || ''
            this.dataFrom.kolName = res.data.wxName || ''

            this.addData.wxName = res.data.wxName
            this.addData.wxId = res.data.wxId
            this.addData.note = res.data.note
            this.addData.kolName = res.data.realName
            console.log(this.dataFrom)
          })
        } else {
          apiVip.getMentorDetailById(this.keyId).then(res => {
            this.active = 2
            this.dataFrom.wxName = res.data.wxName || ''
            this.dataFrom.wxId = res.data.wxId || ''
            this.dataFrom.note = res.data.note || ''
            this.dataFrom.kolName = res.data.mentorName || ''

            this.addData.wxName = res.data.wxName
            this.addData.wxId = res.data.wxId
            this.addData.note = res.data.note
            this.addData.kolName = res.data.mentorName
            console.log(this.dataFrom)
          })
        }
      } else if (this.kolType == 'other') {
        this.active = 2
        this.keyId = ''
      } else {
        this.$message.error('请选择KOL类型，并且补充完整信息！！')
      }
    },
    clear () {
      this.active = 1
      this.addData = {
        wxName: '',
        keyId: '',
        wxId: '',
        kolType: '',
        note: '',
        manageBy: '',
        kolName: '',
        kolStatus: ''
      }
      this.dataFrom = {
        wxName: '',
        keyId: '',
        wxId: '',
        kolType: '',
        note: '',
        manageBy: '',
        kolName: '',
        kolStatus: ''
      }
      this.keyId = ''
      this.kolType = ''
    },
    sumbit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.addData))
          data.keyId = this.keyId
          data.kolType = this.kolType
          console.log(data)
          api.addKol(data).then(() => {
            this.clear()
            this.$emit('success')
          })
        }
      })
    }
  }
}
</script>
