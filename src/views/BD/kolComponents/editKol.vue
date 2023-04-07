<!--
 * @Author: 杨曦
 * @Date: 2021-10-22 15:08:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 15:01:11
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-dialog :close-on-click-modal="false"
			width="642px"
			title="编辑KOL"
			:before-close="newClose"
			:visible.sync="editVisible"
		>
			<div>
				<div>
					<el-form inline :model="addData" :rules="rules" ref="ruleForm" label-width="100px" >
						<el-form-item label="微信" prop="wxId">
							<el-input :disabled="data.kolType != 'other'?true:false" v-model="addData.wxId"></el-input>
						</el-form-item>
						<el-form-item label="身份">
							<el-select style="width:190px" :disabled="true" v-model="addData.kolType" placeholder="请选择">
								<el-option
									v-for="item in kolTypeList"
									:key="item.itemValue"
									:label="item.itemName"
									:value="item.itemValue">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="姓名" prop="kolName">
							<el-input :disabled="data.kolType != 'other'?true:false" v-model="addData.kolName"></el-input>
						</el-form-item>
						<el-form-item label="微信名" prop="wxName">
							<el-input :disabled="data.kolType != 'other'?true:false" v-model="addData.wxName"></el-input>
						</el-form-item>
						<el-form-item label="备注" prop="note">
							<el-input :disabled="data.kolType != 'other'?true:false" v-model="addData.note"></el-input>
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
			<div slot="footer" class="dialog-footer">
				<el-button @click="newClose" >取 消</el-button>
				<el-button type="success"  @click="sumbit" >更 新</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd'
import apiUser from '@/api/sales_assistant'
import { mapState } from 'vuex'
import util from '@/libs/util'
export default {
  components: { },
  mixins: [mixins],
  name: 'addKol',
  computed: {
    ...mapState('role', ['userInfo'])
  },
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    data: {}
  },
  data () {
    return {
      active: 1,
      kolType: '',
      users: [],
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
      		manageBy: 'ALL',
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
  created () {
  },
  watch: {
    editVisible: function (newData) {
      if (newData) {
        this.toPage()
      }
    }
  },
  mounted () {
    this.pageInit()
    apiUser.subordinate(this.manageBy, '').then(({ data }) => {
      console.log(data)
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
    toPage () {
      console.log(this.data)
      this.addData = this.data
    },
    newClose () {
      this.$emit('close')
    },
    sumbit () {
      const a = {
        kolId: this.addData.kolId,
        wxId: this.addData.wxId,
        wxName: this.addData.wxName,
        note: this.addData.note,
        kolName: this.addData.kolName,
        code: this.addData.code,
        manageBy: this.addData.manageBy,
        kolStatus: this.addData.kolStatus
      }
      api.editKol(a).then(res => {
        this.$message.success('更新成功')
        this.$emit('submit')
      })
    }
  }
}
</script>
