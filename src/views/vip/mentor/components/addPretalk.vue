<!--
 * @Author: 杨曦
 * @Date: 2021-10-22 15:08:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 14:33:32
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-dialog :close-on-click-modal="false"
      v-loading = "loading"
			width="642px"
			:before-close="newClose"
			:visible.sync="addPretalkVisible"
      :append-to-body="true"
		>
			<div>
				<div>
						<el-form inline :model="addData" :rules="rules" ref="ruleForm" label-width="100px" >
							<el-form-item label="微信" prop="wxId">
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.wxId"></el-input>
							</el-form-item>
							<el-form-item label="身份">
								<el-select style="width:190px" :disabled="true" v-model="pretalkType" placeholder="请选择">
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
							<!-- <el-form-item label="微信名" prop="wxName">
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.wxName"></el-input>
							</el-form-item>
							<el-form-item label="备注" prop="note">
								<el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.note"></el-input>
							</el-form-item> -->
							<el-form-item label="管理人" prop="manageBy">
								<el-select v-model="addData.manageBy" style="width:190px" placeholder="管理人">
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
			<div slot="footer" class="dialog-footer">
				<el-button @click="newClose" >取 消</el-button>
				<el-button type="success"  @click="sumbit" >提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd'
export default {
  components: { },
  mixins: [mixins],
  name: 'addPretalk',
  props: {
    addPretalkVisible: {
      type: Boolean,
      default: false
    },
    mentorInfo:{}
  },
  data () {
    return {
      loading:false,
      options: [{
        label: '启用',
        options: []
      }, {
        label: '禁用',
        options: []
      }],
      active: 1,
      pretalkType: 'mentor',
      mentorListVisible: false,
      mentorSearchList: [],
      keyId: '',
      common_yes_or_no: [],
      addData: {
        wxName: '',
        keyId: '',
        wxId: '',
        pretalkType: 'mentor',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      },
      dataFrom: {
        wxName: '',
        keyId: '',
        wxId: '',
        pretalkType: 'mentor',
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
        manageBy: [{ required: true, message: '必填', trigger: 'blur' }],
      }
    }
  },
  created () {
  },
  watch: {
    addPretalkVisible: function (newData) {
      if (newData) {
        this.newUser()
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
    },
    newClose () {
      this.clear()
      this.$emit('close')
    },
    newUser () {
      console.log(this.mentorInfo)
      this.addData.wxId = this.mentorInfo.wxId
      this.addData.wxName = this.mentorInfo.wxName
      this.addData.note = this.mentorInfo.note
      this.addData.pretalkName = this.mentorInfo.mentorName
      this.addData.keyId = this.mentorInfo.mentorId
    },
    clear () {
      this.addData = {
        wxName: '',
        keyId: '',
        wxId: '',
        pretalkType: 'mentor',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      }
      this.dataFrom = {
        wxName: '',
        keyId: '',
        wxId: '',
        pretalkType: 'mentor',
        note: '',
        manageBy: '',
        pretalkName: '',
        pretalkStatus: '1'
      }
    },
    sumbit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.addData))
          data.pretalkType = this.pretalkType
          console.log(data)
          api.addPretalk(data).then(() => {
            this.clear()
            this.$message.success('新增成功！！')
            this.$emit('success')
          })
        }
      })
    },
  }
}
</script>
