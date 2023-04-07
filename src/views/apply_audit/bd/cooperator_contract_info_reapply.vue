<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      title="合同重申"
      :visible.sync="reapplyCooperatorContractInfoVisible"
      width="900px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheContractData"
        :rules="rules"
        ref="cacheContractData"
        label-width="120px"
      >
        <el-form-item label="驳回理由" prop>
          <p>{{reject}}</p>
        </el-form-item>
        <br />
        <el-form-item label="合同名称" prop="contractName">
          <el-input :style="{width:widths}" v-model="cacheContractData.contractName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="contractStartDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheContractData.contractStartDate"
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
            v-model="cacheContractData.contractEndDate"
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
            v-model="cacheContractData.contractDuration"
            maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同签订日期" prop="contractSignDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheContractData.contractSignDate"
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
            v-model="cacheContractData.contractStatus"
            :disabled="!cacheContractData.contractId"
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
            v-model="cacheContractData.salaryType"
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
            v-model="cacheContractData.salary"
            maxlength="99"
          ></el-input-number>
          <el-checkbox v-model="synchronous">同步到合作商</el-checkbox>
        </el-form-item>

        <el-form-item label="合同简介" prop="contractIntroduction">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheContractData.contractIntroduction"
            :autosize="{minRows:3}"
            placeholder="长度不超过255"
            maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop>
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheContractData.note"
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
        <el-form-item label="草拟合同">
          <el-button
            size="mini"
            type="text"
            v-if="cacheContractData.contractVoucher"
            @click="download(cacheContractData.contractVoucher)"
          >查看</el-button>
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
        <el-form-item label="正式合同">
          <el-button
            size="mini"
            type="text"
            v-if="cacheContractData.formalContractVoucher"
            @click="download(cacheContractData.formalContractVoucher)"
          >查看</el-button>
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            :auto-upload="false"
            :file-list="fileList3"
            :on-change="change3"
            :on-remove="change3"
            :style="{width:'500px'}"
            drag
          >
            <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="附件">
          <div v-for="(item,i) in attachmentArr" :key="i">
            <el-button size="mini" type="text" @click="download(item.url)">{{item.name}}</el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteItem(i)"
              icon="el-icon-delete"
              title="删除本附件"
            ></el-button>
          </div>
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
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api/bd.js'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys, downloadFun } from '@/libs/file'
import mixins from '@/plugin/mixins'

export default {
  name: 'setContract',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    reapplyCooperatorContractInfoVisible: {
      type: Boolean,
      default: false
    },
    contractData: {
      type: Object
    }
  },
  data () {
    return {
      cacheContractData: {
        cooperatorId: null,
        contractStartDate: null,
        contractEndDate: null,
        contractDuration: null,
        contractSignDate: null,
        salaryType: null,
        salary: null,
        contractName: null,
        contractIntroduction: null,
        note: null,
        contractStatus: null
      },

      cooperator_contract_status: [],
      bill_currency_type: [],
      sign_way_type: [],

      widths: '250px',
      rules: {
        contractStartDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        contractStatus: [{ required: true, message: '必填', trigger: 'blur' }],
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
      fileList3: [],
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
      contractStatusName: '无',
      reject: '无',
      cooperationArr: [
        {
          contentType: '推文',
          contentNum: 0,
          contentNote: ''
        },
        {
          contentType: '活动  ',
          contentNum: 0,
          contentNote: ''
        }
      ],
      attachmentArr: []
    }
  },
  watch: {
    reapplyCooperatorContractInfoVisible: function (val) {
      if (val) {
        this.initPage()
        this.pageInit()
      }
    }
  },
  mounted () {
  },
  methods: {
    async pageInit () {
      this.cooperator_contract_status = await this.getDictionary('cooperator_contract_status')
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.sign_way_type = await this.getDictionary('sign_way_type')
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
      apiDic
        .getAuditorListByApplyType('cooperator_contract_info')
        .then((res) => {
          console.log('getAuditorListByApplyType', res.data)
          res.data.forEach((v) => {
            v.auditor = []
            v.confirmorArr.forEach((value) => {
              if (value.isDefult == 1) {
                v.auditor.push(value.confirmorId)
              }
            })
          })
          this.auditorList = [...res.data]
        })
    },
    initPage () {
      // api
      //   .getCooperatorContractDetailById(this.contractId)
      //   .then(res => {
      //     console.log(res.data);
      this.cacheContractData = this.contractData.info
      this.cooperationArr = this.contractData.info.contentArr
      this.contractStatusName = this.contractData.info.contractStatusName
      this.reject = this.contractData.text.slice(-1)[0].value || '无'
      this.attachmentArr = this.contractData.info.attachment
        ? this.contractData.info.attachment.split(',').map((v) => {
          return { name: v.split('/').pop(), url: v }
        })
        : []
      //   });
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.$refs.cacheContractData.resetFields()
      this.cacheContractData = {
        cooperatorId: null,
        contractStartDate: null,
        contractEndDate: null,
        contractDuration: null,
        contractSignDate: null,
        salaryType: null,
        salary: null,
        contractName: null,
        contractIntroduction: null,
        note: null,
        contractStatus: null
      }
      this.fileList = []
      this.fileList2 = []
      this.fileList3 = []
      this.synchronous = false
      this.contractStatusName = '无'
      this.reject = '无'
      this.cooperationArr = [
        {
          contentType: '推文',
          contentNum: 0,
          contentNote: ''
        },
        {
          contentType: '活动  ',
          contentNum: 0,
          contentNote: ''
        }
      ]
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList.slice(-1)
    },
    change2 (file, fileList) {
      console.log(file, fileList)
      this.fileList2 = fileList
    },
    change3 (file, fileList) {
      console.log(file, fileList)
      this.fileList3 = fileList.slice(-1)
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheContractData,
        this.cacheContractData
      )
      if (!this.fileList.length && !this.cacheContractData.contractVoucher) {
        this.$message({
          message: '草拟合同必传',
          type: 'error'
        })
        return
      }
      this.$refs.cacheContractData.validate((valid) => {
        console.log(valid)
        if (!valid) return
        this.$loading()
        if (this.fileList.length) {
          const file = this.fileList[0]
          uploadFunBySys(
            file.raw,
            `cooperatorContract/${this.cacheContractData.cooperatorId}_` +
              ~~(Math.random() * 1000),
            (url) => {
              console.log(url)
              this.cacheContractData.contractVoucher = url
              this.submit3()
            }
          )
        } else {
          this.submit3()
        }
      })
    },
    submit3 () {
      if (this.fileList3.length) {
        const file = this.fileList3[0]
        uploadFunBySys(
          file.raw,
          `cooperatorFormalContract/${this.cacheContractData.cooperatorId}_` +
            ~~(Math.random() * 1000),
          (url) => {
            console.log(url)
            this.cacheContractData.formalContractVoucher = url
            this.applySubmit()
          }
        )
      } else {
        this.applySubmit()
      }
    },
    applySubmit () {
      const approval = []
      let cannot = false
      this.auditorList.forEach((aa) => {
        if (!aa.auditor.length) {
          cannot = true
        }
        aa.auditor.forEach((v) => {
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
      this.copy.forEach((v) => {
        copyTo.push({ copyTo: v })
      })
      const data = {
        keyId: this.cacheContractData.contractId,
        applyType: 'cooperator_contract_info',
        applyTitle: `(重申)BD合作商[${this.cacheContractData.cooperatorName}]的合同[${this.cacheContractData.contractName}]申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [
            { name: '草拟合同', url: this.cacheContractData.contractVoucher }
          ],
          text: [
            {
              label: '合作方名称',
              value: this.cacheContractData.cooperatorName
            },
            {
              label: '合同名称',
              value: this.cacheContractData.contractName
            },
            {
              label: '开始日期',
              value: this.cacheContractData.contractStartDate
            },
            {
              label: '结束日期',
              value: this.cacheContractData.contractEndDate
            },
            {
              label: '合同周期',
              value: this.cacheContractData.contractDuration
            },
            {
              label: '合同签订日期',
              value: this.cacheContractData.contractSignDate
            },
            {
              label: '原合同状态',
              value: this.contractStatusName
            },
            {
              label: '合同状态',
              value: this.cooperator_contract_status.filter(
                (v) => this.cacheContractData.contractStatus === v.itemValue
              )[0].itemName
            },
            {
              label: '合同金额',
              value:
                this.cacheContractData.salaryType +
                this.cacheContractData.salary
            },
            {
              long: true,
              label: '合同简介',
              value: this.cacheContractData.contractIntroduction
            },
            {
              label: '备注',
              value: this.cacheContractData.note
            },
            {
              label: '上次驳回理由',
              value: this.reject
            }
          ],
          info: this.cacheContractData
        }
      }
      data.content.info.contentArr = this.cooperationArr
      this.cooperationArr.forEach((v) => {
        data.content.text.push({
          label: '[合作内容]' + v.contentType,
          value: v.contentNum + '(' + (v.contentNote || '无备注') + ')'
        })
      })
      if (this.synchronous) {
        data.content.cooperatorInfo = {
          cooperatorId: this.cacheContractData.cooperatorId,
          salary: this.cacheContractData.salary,
          salaryType: this.cacheContractData.salaryType
        }
        data.content.text.push({
          label: '提示',
          value: '同步合同金额到合作商'
        })
      }
      if (this.cacheContractData.formalContractVoucher) {
        data.content.file.push({
          name: '正式合同',
          url: this.cacheContractData.formalContractVoucher
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
            `cooperatorFile/${this.cacheContractData.cooperatorId}_` +
              ~~(Math.random() * 1000),
            (url) => {
              files.push({
                name: file.name,
                url: url
              })
              if (files.length === this.fileList2.length) {
                // data.content.file.push(...files);
                this.attachmentArr.push(...files)
                data.content.file.push(...this.attachmentArr)
                data.content.info.attachment = this.attachmentArr
                  .map((v) => v.url)
                  .join(',')
                console.log('files', files)
                api.applyAmbassadorPayment(data).then((res) => {
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
        data.content.file.push(...this.attachmentArr)
        data.content.info.attachment = this.attachmentArr
          .map((v) => v.url)
          .join(',')
        console.log(data)
        api.applyAmbassadorPayment(data).then((res) => {
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
    download (path) {
      console.log(path)
      downloadFun(path)
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
    },
    deleteItem (i) {
      this.attachmentArr.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
