<!--
 * @Author: 杨曦
 * @Date: 2023-02-02 16:07:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-02 16:10:34
 * @Version: 
 * @Description: 
-->
<template>
	<div>
		<el-dialog :close-on-click-modal="false"
      v-loading = "loading"
			width="642px"
			:before-close="newClose"
			:visible.sync="addNewPretalkVisible"
      :append-to-body="true"
		>
			<div>
				<el-steps :active="active" size="mini" simple style="margin-top: 20px">
					<el-step title="步骤 1 - 选择类型" ></el-step>
					<el-step title="步骤 2 - 录入信息" ></el-step>
				</el-steps>
				<div class="" style="margin-top:40px">
					<div v-if="active == 1" style="display:flex;justify-content:center">
						<div class="mr20" >
							<div class="mb10" v-if="pretalkType == 'mentee'">
								<el-radio  v-model="pretalkType" label="mentee" border>学员</el-radio>
							</div>
							<div class="mb10" v-if="pretalkType == 'mentor'">
								<el-radio v-model="pretalkType" label="mentor" border>导师</el-radio>
							</div>
							<div class="mb10" v-if="pretalkType == 'other'">
								<el-radio v-model="pretalkType" label="other" border>其他</el-radio>
							</div>
						</div>
						<div style="">
							<el-input v-if="pretalkType == 'mentee'" v-model="keyId" placeholder="学员ID，微信名，微信ID"></el-input>
							<el-input v-if="pretalkType == 'mentor'" v-model="keyId" placeholder="导师ID，微信名，微信ID"></el-input>
							<el-input v-if="pretalkType == 'other'" v-model="keyId" placeholder="无须输入" :disabled="true" ></el-input>
						</div>
					</div>
					<div v-if="active == 2">
						<el-form inline :model="addData" :rules="rules" ref="ruleForm" label-width="100px" >
							<el-form-item label="微信" prop="wxId">
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.wxId"></el-input>
							</el-form-item>
							<el-form-item label="身份">
								<el-select style="width:180px" :disabled="true" v-model="pretalkType" placeholder="请选择">
									<el-option
										v-for="item in kolTypeList"
										:key="item.itemValue"
										:label="item.itemName"
										:value="item.itemValue">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="姓名" prop="pretalkName">
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.pretalkName"></el-input>
							</el-form-item>
							<el-form-item label="微信名" prop="wxName">
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.wxName"></el-input>
							</el-form-item>
              <el-form-item label="可带行业" prop="trackList" v-if="pretalkType != 'mentor'">
                <el-select style="width:180px" filterable v-model="addData.trackList" multiple placeholder="请选择">
                  <el-option
                    v-for="item in trackList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
								<!-- <el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.trackList"></el-input> -->
							</el-form-item>
							<el-form-item label="可带地区" prop="countryList" v-if="pretalkType != 'mentor'">
                <el-select style="width:180px" filterable v-model="addData.countryList" multiple placeholder="请选择">
                  <el-option
                    v-for="item in countryList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
								<!-- <el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.countryList"></el-input> -->
							</el-form-item>
							<el-form-item label="备注" prop="note" >
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.note"></el-input>
							</el-form-item>
							<el-form-item label="管理人" prop="manageBy">
								<el-select v-model="addData.manageBy" style="width:180px" placeholder="管理人">
									<el-option-group
											v-for="group in options"
											:key="group.label"
											:label="group.label">
										<el-option
											v-for="item in group.options"
											:key="item.userId"
											:disabled="item.disabled"
											:label="item.userName"
											:value="item.userId">
										</el-option>
									</el-option-group>
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
		<!-- <el-dialog :close-on-click-modal="false"
			:title="pretalkType == 'mentee'?'学员':'导师'"
			:visible.sync="mentorListVisible"
			width="700px"
			:before-close="mentorListClose"
      :append-to-body="true"
			>
			<el-row v-for="(mentor) in mentorSearchList" :key="mentor.mentorId">
				<el-col :span="3">
				<el-button size="mini" style="margin-top:5px" @click="chooseMentor(mentor)" type="primary">选择</el-button>
				</el-col>
				<el-col :span="3" class="_item-name">姓名</el-col>
				<el-col :span="4" class="_item-value">{{mentor.mentorName||mentor.menteeName}}</el-col>
				<el-col :span="3" class="_item-name">微信ID</el-col>
				<el-col :span="4" class="_item-value">{{mentor.wxId}}</el-col>

			</el-row>
		</el-dialog> -->
	</div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd'
import apiVip from '@/api/vip'
import apiUser from '@/api/sales_assistant'
import util from '@/libs/util'
export default {
  components: { },
  mixins: [mixins],
  name: 'addPretalk',
  props: {
    addNewPretalkVisible: {
      type: Boolean,
      default: false
    },
    kolTypeNew: {},
    keyIdNew: {},
    pretalkTypeNew: {}
  },
  data () {
    return {
      loading: false,
      options: [{
        label: '启用',
        options: []
      }, {
        label: '禁用',
        options: []
      }],
      active: 1,
      pretalkType: '',
      mentorListVisible: false,
      mentorSearchList: [],
      keyId: '',
      common_yes_or_no: [],
      trackList: [],
      countryList: [],
      addData: {
        wxName: '',
        trackList: [],
        countryList: [],
        keyId: '',
        wxId: '',
        pretalkType: '',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      },
      dataFrom: {
        trackList: [],
        countryList: [],
        wxName: '',
        keyId: '',
        wxId: '',
        pretalkType: '',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      },
      kolTypeList: [
        { itemName: '学员', itemValue: 'mentee' },
        { itemName: '导师', itemValue: 'mentor' },
        { itemName: '其他', itemValue: 'other' }
      ],
      rules: {
        pretalkStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        wxId: [{ required: true, message: '必填', trigger: 'blur' }],
        trackList: [{ required: true, message: '必填', trigger: 'blur' }],
        countryList: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created () {
  },
  watch: {
    addNewPretalkVisible: function (newData) {
      if (newData) {
        console.log(this.kolTypeNew, this.keyIdNew)
        this.pretalkType = this.kolTypeNew || ''
        this.keyId = this.keyIdNew || ''
        this.active = this.kolTypeNew ? 2 : 1
        if (this.kolTypeNew) {
          this.newUser()
        }
        if (this.pretalkTypeNew && this.pretalkTypeNew == 'other') {
          this.pretalkType = 'other'
          this.active = 2
          this.keyId = ''
        } else if (this.pretalkTypeNew && this.pretalkTypeNew != 'other') {
          this.pretalkType = this.pretalkTypeNew
        }
      }
    }
  },
  mounted () {
    this.pageInit()
    api.userListVip('').then(({ data }) => {
      data.map(item => {
        if (item.entryStatus == 1) {
          this.options[0].options.push(item)
        } else {
          item.disabled = true
          this.options[1].options.push(item)
        }
      })
      console.log(this.options)
    })
  },
  methods: {
	  async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.trackList = await this.getDictionary('track')
      this.countryList = await this.getDictionary('country')
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
      if ((this.pretalkType == 'mentee' || this.pretalkType == 'mentor') && this.keyId) {
        if (this.pretalkType == 'mentee') {
          let data = {
            menteeId: this.keyIdNew
          }
          this.chooseMentor(data)
          // api.searchMenteeMatch(this.keyId).then(res => {
          //   console.log(res.data)
          //   if (res.data.length > 0) {
          //     this.mentorSearchList = res.data
          //     this.mentorListVisible = true
          //   } else {
          //     this.$message.error('未找到对应学员！！')
          //   }
          //   this.loading = false
          // })
        } else {
          let data = {
            mentorId: this.keyIdNew
          }
          this.chooseMentor(data)
          // api.searchMentorMatch(this.keyId).then(res => {
          //   console.log(res.data)
          //   if (res.data.length > 0) {
          //     this.mentorSearchList = res.data
          //     this.mentorListVisible = true
          //   } else {
          //     this.$message.error('未找到对应导师！！')
          //   }
          //   this.loading = false
          // })
        }
      } else if (this.pretalkType == 'other') {
        this.active = 2
        this.keyId = ''
      } else {
        this.$message.error('请选择Pretalk类型，并且补充完整信息！！')
      }
    },
    clear () {
      this.active = 1
      this.addData = {
        wxName: '',
        trackList: [],
        countryList: [],
        keyId: '',
        wxId: '',
        pretalkType: '',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      }
      this.dataFrom = {
        trackList: [],
        countryList: [],
        wxName: '',
        keyId: '',
        wxId: '',
        pretalkType: '',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      }
      // this.keyId = '';
      // this.pretalkType = '';
    },
    sumbit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.addData))
          data.pretalkType = this.pretalkType
          console.log(data)
          if (this.pretalkType == 'mentor') {
            data.countryList = []
            data.trackList = []
          }
          api.addPretalk(data).then(() => {
            this.clear()
            this.$message.success('新增成功！！')
            this.$emit('success')
          })
          // .catch(err => {
          // 	this.$message.error(err.message)
          // })
        }
      })
    },
    mentorListClose () {
      this.mentorListVisible = false
    },
    chooseMentor (data) {
      this.mentorListClose()
      if (this.pretalkType == 'mentee') {
        apiUser.getMenteeDataByMenteeId(data.menteeId).then(res => {
          console.log(res.data)
          this.active = 2
          this.dataFrom.wxName = res.data.wxName || ''
          this.dataFrom.trackList = res.data.trackList || []
          this.dataFrom.countryList = res.data.countryList || ''
          this.dataFrom.wxId = res.data.wxName || ''
          this.dataFrom.note = res.data.wxName || ''
          this.dataFrom.pretalkName = res.data.wxName || ''
          this.addData.keyId = res.data.menteeId
          this.addData.wxName = res.data.wxName
          this.addData.wxId = res.data.wxId
          this.addData.note = res.data.note
          this.addData.pretalkName = res.data.realName
          this.addData.trackList = res.data.trackList || []
          this.addData.countryList = res.data.countryList || ''
        })
      } else {
        apiVip.getMentorDetailById(data.mentorId).then(res => {
          this.active = 2
          this.dataFrom.wxName = res.data.wxName || ''
          this.dataFrom.trackList = res.data.trackList || []
          this.dataFrom.countryList = res.data.countryList || ''
          this.dataFrom.wxId = res.data.wxId || ''
          this.dataFrom.note = res.data.note || ''
          this.dataFrom.pretalkName = res.data.mentorName || ''
          this.addData.keyId = res.data.mentorId
          this.addData.wxName = res.data.wxName
          this.addData.wxId = res.data.wxId
          this.addData.note = res.data.note
          this.addData.pretalkName = res.data.mentorName
          this.addData.trackList = res.data.trackList || []
          this.addData.countryList = res.data.countryList || ''
        })
      }
    }
  }
}
</script>
