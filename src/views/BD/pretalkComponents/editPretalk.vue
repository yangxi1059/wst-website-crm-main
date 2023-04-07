<!--
 * @Author: 杨曦
 * @Date: 2021-10-22 15:08:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-14 14:12:26
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-dialog :close-on-click-modal="false"
			width="642px"
			title="编辑Pretalk"
			:before-close="newClose"
			:visible.sync="editVisible"
		>
			<div>
				<div>
					<el-form inline :model="addData" :rules="rules" ref="ruleForm" label-width="100px" >
						<el-form-item label="微信" prop="wxId">
							<el-input :disabled="data.pretalkType != 'other'?true:false" v-model="addData.wxId"></el-input>
						</el-form-item>
						<el-form-item label="身份">
							<el-select style="width:190px" :disabled="true" v-model="addData.pretalkType" placeholder="请选择">
								<el-option
									v-for="item in kolTypeList"
									:key="item.itemValue"
									:label="item.itemName"
									:value="item.itemValue">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="姓名" prop="pretalkName">
							<el-input :disabled="data.pretalkType != 'other'?true:false" v-model="addData.pretalkName"></el-input>
						</el-form-item>
						<el-form-item label="微信名" prop="wxName">
							<el-input :disabled="data.pretalkType != 'other'?true:false" v-model="addData.wxName"></el-input>
						</el-form-item>
            <el-form-item label="可带行业" prop="trackList" v-if="data.pretalkType != 'mentor'">
                <el-select style="width:180px" v-model="addData.trackList" multiple placeholder="请选择">
                  <el-option
                    v-for="item in trackList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
								<!-- <el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.trackList"></el-input> -->
							</el-form-item>
							<el-form-item label="可带地区" prop="countryList" v-if="data.pretalkType != 'mentor'">
                <el-select style="width:180px" v-model="addData.countryList" multiple placeholder="请选择">
                  <el-option
                    v-for="item in countryList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                  </el-option>
                </el-select>
								<!-- <el-input :disabled="pretalkType != 'other'?true:false" v-model="addData.countryList"></el-input> -->
							</el-form-item>
						<el-form-item label="备注" prop="note">
							<el-input :disabled="data.pretalkType != 'other'?true:false" v-model="addData.note"></el-input>
						</el-form-item>
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
						<el-form-item label="是否启用" prop="pretalkStatus">
							<el-select style="width:190px"  v-model="addData.pretalkStatus" placeholder="请选择">
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
import util from '@/libs/util'
export default {
  components: { },
  mixins: [mixins],
  name: 'addKol',
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
      pretalkType: '',
      users: [],
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
        pretalkStatus: ''
      },
      options: [{
        label: '启用',
        options: []
      }, {
        label: '禁用',
        options: []
      }],
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
        pretalkStatus: ''
      },
      manageBy: 'ALL',
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
    editVisible: function (newData) {
      if (newData) {
        this.toPage()
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
    toPage () {
      this.addData = this.data
    },
    newClose () {
      this.$emit('close')
    },
    sumbit () {
      const a = {
        pretalkId: this.addData.pretalkId,
        wxId: this.addData.wxId,
        wxName: this.addData.wxName,
        note: this.addData.note,
        pretalkName: this.addData.pretalkName,
        code: this.addData.code,
        manageBy: this.addData.manageBy,
        trackList: this.addData.trackList,
        countryList: this.addData.countryList,
        pretalkStatus: this.addData.pretalkStatus
      }
      api.editPretalk(a).then(res => {
        this.$message.success('更新成功')
        this.$emit('submit')
      })
    }
  }
}
</script>
