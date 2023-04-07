<!--
 * @Author: 库建华
 * @Date: 2020-07-02 20:45:35
 * @LastEditors: 库建华
 * @LastEditTime: 2020-07-06 10:03:43
 * @Version: 1
 * @Description:
-->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="'更新合作状态为：正在合作'"
      :visible.sync="cooperationStatusVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheCooperatorData"
        :rules="rules"
        ref="cacheCooperatorData"
        label-width="120px"
      >
        <!-- <el-form-item label="合作状态" prop="cooperatorStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.cooperatorStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cooperator_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- v-if="cacheCooperatorData.cooperatorStatus == 'doing_cooperator'" -->
        <template>
          <el-form-item label="合同名称" prop="contractName">
            <el-input
              :style="{width:widths}"
              v-model="cacheCooperatorData.contractName"
              maxlength="99"
            ></el-input>
          </el-form-item>
          <el-form-item label="开始日期" prop="contractStartDate">
            <el-date-picker
              :style="{width:widths}"
              v-model="cacheCooperatorData.contractStartDate"
              :clearable="false"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="contractEndDate">
            <el-date-picker
              :style="{width:widths}"
              v-model="cacheCooperatorData.contractEndDate"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :editable="false"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同周期" prop="contractDuration">
            <el-input
              :style="{width:widths}"
              v-model="cacheCooperatorData.contractDuration"
              maxlength="99"
            ></el-input>
          </el-form-item>
          <el-form-item label="合同签订日期" prop="contractSignDate">
            <el-date-picker
              :style="{width:widths}"
              v-model="cacheCooperatorData.contractSignDate"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :editable="false"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同状态" prop="contractStatus">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="cacheCooperatorData.contractStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in cooperator_contract_status"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同金额类型" prop="salaryType">
            <el-select
              :style="{width:widths}"
              filterable
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
          <el-form-item label="合同金额" prop="salary">
            <el-input-number
              :controls="false"
              :style="{width:widths}"
              v-model="cacheCooperatorData.salary"
              maxlength="99"
            ></el-input-number>
            <el-checkbox v-model="synchronous">同步到合作商</el-checkbox>
          </el-form-item>
          <el-form-item label="合同简介" prop="contractIntroduction">
            <el-input
              :style="{width:widths}"
              type="textarea"
              v-model="cacheCooperatorData.contractIntroduction"
              :autosize="{minRows:3}"
              placeholder="长度不超过255"
              maxlength="255"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop>
            <el-input
              :style="{width:widths}"
              type="textarea"
              v-model="cacheCooperatorData.note"
              :autosize="{minRows:3}"
              placeholder="长度不超过255"
              maxlength="255"
            ></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button @click="addCooperation">添加合作内容</el-button>
          </el-form-item>
          <el-card v-if="cooperationArr.length" class="mb20">
            <template v-for="(item,i) in cooperationArr">
              <div :key="i">
                <el-form-item :label="'合作内容'+ (1+i)" prop>
                  <el-input :style="{width:widths}" v-model="item.contentType" :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop>
                  <el-input-number
                    :controls="false"
                    :style="{width:widths}"
                    v-model="item.contentNum"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop>
                  <el-input :style="{width:widths}" v-model="item.contentNote" :maxlength="255"></el-input>
                </el-form-item>
                <el-form-item label prop>
                  <el-button
                    size="mini"
                    class="el-icon-delete"
                    @click="deleteCooperation(i)"
                    title="删除"
                  ></el-button>
                </el-form-item>
              </div>
            </template>
          </el-card>
          <el-form-item label="合同上传">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="change"
              :on-remove="change"
              :style="{width:'500px'}"
              drag
            >
              <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              action
              class="upload-btn"
              ref="upload2"
              :auto-upload="false"
              :file-list="fileList2"
              :on-change="change2"
              :on-remove="change2"
              multiple
              :style="{width:'500px'}"
              drag
            >
              <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
            </el-upload>
          </el-form-item>
        </template>
        <el-divider>申请配置</el-divider>
        <el-form-item :label="item.confirmCol" v-for="(item,index) in auditorList" :key="index">
          <el-select
            :style="{width:'200px'}"
            v-model="item.auditor"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="confirmItem in item.confirmorArr"
              :key="confirmItem.confirmorId"
              :label="confirmItem.confirmorName"
              :value="confirmItem.confirmorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送">
          <el-select :style="{width:'200px'}" v-model="copy" multiple filterable placeholder="请选择">
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">申请为正在合作</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys } from '@/libs/file'

export default {
  name: 'setContract',
  mixins: [mixins],
  props: {
    cooperationStatusVisible: {
      type: Boolean,
      default: false
    },
    cooperatorData: {
      type: Object
    }
  },
  data () {
    return {
      cacheCooperatorData: {
        cooperatorId: null,
        contractStartDate: null,
        contractEndDate: null,
        contractDuration: null,
        contractSignDate: null,
        salaryType: null,
        salary: null,
        contractName: null,
        contractIntroduction: null,
        contractStatus: null
      },

      cooperator_status: [],
      cooperator_contract_status: [],
      bill_currency_type: [],
      sign_way_type: [],

      widths: '250px',
      rules: {
        contractStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        contractStartDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        contractEndDate: [{ required: true, message: '必填', trigger: 'blur' }],
        contractDuration: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        contractSignDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        salaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        salary: [{ required: true, message: '必填', trigger: 'blur' }],
        contractName: [{ required: true, message: '必填', trigger: 'blur' }],
        contractIntroduction: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      fileList: [],
      fileList2: [],
      users: [],
      copy: [],
      auditorList: [
        {
          auditor: [],
          confirmCol: '',
          confirmorArr: [
            {
              confirmorName: '',
              isDefult: '',
              confirmCol: '',
              confirmType: '',
              confirmorId: ''
            }
          ]
        }
      ],
      synchronous: false,
      cooperatorStatusName: '',
      cooperationArr: []
    }
  },
  computed: {},
  watch: {
    cooperationStatusVisible: function (val) {
      if (val) {
        // if (this.cooperatorData.contractId) {
        //   this.initPage();
        // } else {
        this.cacheCooperatorData = {
          cooperatorId: this.cooperatorData.cooperatorId,
          cooperatorName: this.cooperatorData.cooperatorName,
          cooperatorStatus: 'doing_cooperator',
          contractStartDate: null,
          contractEndDate: null,
          contractDuration: null,
          contractSignDate: null,
          salaryType: null,
          salary: null,
          contractName: null,
          contractIntroduction: null,
          contractStatus: null
        }
        this.cooperatorStatusName = this.cooperatorData.cooperatorStatusName
        // }
      }
    }
  },
  mounted () {
    this.pageInit()
    this.init()
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.sign_way_type = await this.getDictionary('sign_way_type')
      this.cooperator_contract_status = await this.getDictionary('cooperator_contract_status')
      this.cooperator_status = await this.getDictionary('cooperator_status')
    },
    init () {
      const params = {
        pageNum: 1,
        pageSize: 999
      }
      apiDic.userList(params).then(({ data }) => {
        console.log(
          'userList...........................................',
          data
        )
        this.users = data.rows
      })
      apiDic.getAuditorListByApplyType('cooperator_status_change').then(res => {
        console.log('getAuditorListByApplyType', res.data)
        res.data.forEach(v => {
          v.auditor = []
          v.confirmorArr.forEach(value => {
            if (value.isDefult == 1) {
              v.auditor.push(value.confirmorId)
            }
          })
        })
        this.auditorList = [...res.data]
      })
    },
    // initPage() {
    //   api
    //     .getCooperatorDetailById(this.cooperatorData.cooperatorId)
    //     .then(res => {
    //       console.log(res.data);
    //       this.cacheCooperatorData = res.data;
    //     });
    // },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.$refs.cacheCooperatorData.resetFields()
      this.cacheCooperatorData = {
        cooperatorId: null,
        contractStartDate: null,
        contractEndDate: null,
        contractDuration: null,
        contractSignDate: null,
        salaryType: null,
        salary: null,
        contractName: null,
        contractIntroduction: null,
        contractStatus: null
      }
      this.fileList = []
      this.fileList2 = []
      this.synchronous = false
      this.cooperationArr = []
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList.slice(-1)
    },
    change2 (file, fileList) {
      console.log(file, fileList)
      this.fileList2 = fileList
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheCooperatorData,
        this.cacheCooperatorData
      )
      if (
        !this.fileList.length &&
        this.cacheCooperatorData.cooperatorStatus == 'doing_cooperator'
      ) {
        this.$message({
          message: '合同必传',
          type: 'error'
        })
        return
      }
      this.$refs.cacheCooperatorData.validate(valid => {
        console.log(valid)
        if (!valid) return
        if (this.fileList.length) {
          const file = this.fileList[0]
          this.$loading()
          uploadFunBySys(
            file.raw,
            `cooperatorContract/${this.cacheCooperatorData.cooperatorId}`,
            url => {
              console.log(url)
              this.cacheCooperatorData.contractVoucherName = file.name
              this.cacheCooperatorData.contractVoucher = url
              this.applySubmit()
            }
          )
        } else {
          this.applySubmit()
        }
      })
    },
    applySubmit () {
      const approval = []
      let cannot = false
      this.auditorList.forEach(aa => {
        if (!aa.auditor.length) {
          cannot = true
        }
        aa.auditor.forEach(v => {
          approval.push({ approverId: v })
        })
      })
      if (cannot) {
        this.$message({
          type: 'warning',
          message: '审核人都为必填！'
        })
        this.$loading().close()
        return
      }
      const copyTo = []
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v })
      })
      const data = {
        keyId: this.cacheCooperatorData.cooperatorId,
        applyType: 'cooperator_status_change',
        applyTitle: `BD合作商[${
          this.cacheCooperatorData.cooperatorName
        }]的合作状态(${
          this.cooperator_status.filter(
            v => v.itemValue == this.cacheCooperatorData.cooperatorStatus
          )[0].itemName
        })申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [
            {
              name: this.cacheCooperatorData.contractVoucherName,
              url: this.cacheCooperatorData.contractVoucher
            }
          ],
          text: [
            {
              label: '合作方名称',
              value: this.cacheCooperatorData.cooperatorName
            },
            {
              label: '合作状态',
              value: this.cooperator_status.filter(
                v => v.itemValue == this.cacheCooperatorData.cooperatorStatus
              )[0].itemName
            }
          ],
          info: {
            cooperatorId: this.cacheCooperatorData.cooperatorId,
            cooperatorStatus: this.cacheCooperatorData.cooperatorStatus
          }
        }
      }
      if (this.cacheCooperatorData.cooperatorStatus == 'doing_cooperator') {
        data.content.text.push(
          {
            label: '合同名称',
            value: this.cacheCooperatorData.contractName
          },
          {
            label: '开始日期',
            value: this.cacheCooperatorData.contractStartDate
          },
          {
            label: '结束日期',
            value: this.cacheCooperatorData.contractEndDate
          },
          {
            label: '合同周期',
            value: this.cacheCooperatorData.contractDuration
          },
          {
            label: '合同签订日期',
            value: this.cacheCooperatorData.contractSignDate
          },
          {
            label: '合同状态',
            value: this.cooperator_contract_status.filter(
              v => this.cacheCooperatorData.contractStatus == v.itemValue
            )[0].itemName
          },
          {
            label: '合同金额',
            value:
              this.cacheCooperatorData.salaryType +
              this.cacheCooperatorData.salary
          },
          {
            label: '合同简介',
            value: this.cacheCooperatorData.contractIntroduction
          },
          {
            label: '备注',
            value: this.cacheCooperatorData.note
          }
        )
        this.cooperationArr.forEach(v => {
          data.content.text.push({
            label: v.contentType,
            value: v.contentNum + '[' + (v.contentNote || '无备注') + ']'
          })
        })
        data.content.info.contractInfo = this.cacheCooperatorData
        data.content.info.contentArr = this.cooperationArr
      }
      if (this.synchronous) {
        data.content.info.salary = this.cacheCooperatorData.salary
        data.content.info.salaryType = this.cacheCooperatorData.salaryType
        data.content.text.push({
          label: '提示',
          value: '合同金额将同步到合作商'
        })
      }
      console.log(data)
      if (this.fileList2.length) {
        const files = []
        for (let i = 0; i < this.fileList2.length; i++) {
          const file = this.fileList2[i]
          this.$loading()
          uploadFunBySys(
            file.raw,
            `cooperatorFile/${this.cacheCooperatorData.cooperatorId}`,
            url => {
              files.push({
                name: file.name,
                url: url
              })
              if (files.length === this.fileList2.length) {
                data.content.file.push(...files)
                console.log(files)
                api.applyAmbassadorPayment(data).then(res => {
                  console.log(res)
                  this.$message({
                    type: 'success',
                    message: '申请成功'
                  })
                  this.$loading().close()
                  this.$emit('submit')
                  this.clear()
                })
              }
            }
          )
        }
      } else {
        api.applyAmbassadorPayment(data).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '申请成功'
          })
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
      }
    },
    addCooperation () {
      this.cooperationArr.push({
        contentType: '',
        contentNum: 0,
        contentNote: ''
      })
    },
    deleteCooperation (i) {
      this.cooperationArr.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
