<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      v-loading = loading
      :title="cacheCooperatorData.cooperatorId ? '编辑合作商':'新增合作商'"
      :visible.sync="editVisible"
      width="900px"
      :before-close="close"
    >
      <!-- <el-tooltip content="[新增为正在合作]适用于无合同合作商" placement="top-start" effect="dark">
        <el-switch
          v-if="!cacheCooperatorData.cooperatorId"
          style="display: block;position: absolute;top: 20px;right: 100px;"
          v-model="needApply"
          active-color="#13ce66"
          inactive-color="#409EFF"
          active-text="新增为正在合作"
          inactive-text="新增合作商"
        ></el-switch>
      </el-tooltip>-->
      <el-form
        size="medium"
        inline
        :model="cacheCooperatorData"
        :rules="rules"
        ref="cacheCooperatorData"
        label-width="160px"
      >
        <el-form-item label="合作方名称" prop="cooperatorName">
          <el-input
            :style="{width:widths}"
            v-model="cacheCooperatorData.cooperatorName"
            :maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="合作状态" prop="cooperatorStatus" v-if="!needApply">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.cooperatorStatus"
            placeholder="请选择"
            :disabled="cacheCooperatorData.cooperatorStatus == 'doing_cooperator'"
          >
            <el-option
              v-for="(item,i) in cooperator_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
              :disabled="i>1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方国家/地区" prop="countryId">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.countryId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in country"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合作方电话" prop>
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.tel" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合作方邮箱" prop>
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.email" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="对接人微信ID" prop="wxId">
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.wxId" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合作对接人名称" prop="principal">
          <el-input :style="{width:widths}" v-model="cacheCooperatorData.principal" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="合作对接人职位" prop="principalPosition">
          <el-input
            :style="{width:widths}"
            v-model="cacheCooperatorData.principalPosition"
            maxlength="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="返佣规则" prop="brokerageStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.brokerageStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in brokerage_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定返佣美金($)" prop="fixedBrokerage" v-if="cacheCooperatorData.brokerageStatus == 'fixed_brokerage'">
          <el-input-number placeholder="请输入整数" :controls="false" :style="{width:widths}" v-model="cacheCooperatorData.fixedBrokerage"   ></el-input-number>
        </el-form-item>
        <el-form-item label="初次对接日期" prop="firstDockingDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheCooperatorData.firstDockingDate"
            :clearable="false"
            :editable="false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否收费" prop="chargeStatus">
          <el-select
            :style="{width:widths}"
            filterable
            v-model="cacheCooperatorData.chargeStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="cacheCooperatorData.chargeStatus == 1">
          <el-form-item label="本次合作金额类型" prop="salaryType">
            <el-select
              :style="{width:widths}"
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
          <el-form-item label="本次合作金额" prop="salary">
            <el-input-number
              :controls="false"
              :style="{width:widths}"
              v-model="cacheCooperatorData.salary"
              maxlength="99"
            ></el-input-number>
          </el-form-item>
        </template>
        <el-form-item label="管理人" prop="manageBy">
          <el-select
            :style="{width:widths}"
            v-model="cacheCooperatorData.manageBy"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公众号平均阅读量" prop="officialAccountAverageReading">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheCooperatorData.officialAccountAverageReading"
            maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="单位阅读量价格(￥)" prop="averageReadingPrice">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="cacheCooperatorData.averageReadingPrice"
            maxlength="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="沟通进度反馈" prop="communicateFeedback">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.communicateFeedback"
            :autosize="{minRows:3}"
            :maxlength="255"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="合作内容" prop="cooperationContent">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.cooperationContent"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="合作方简介" prop="cooperatorIntroduction">
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.cooperatorIntroduction"
            :autosize="{minRows:3}"
            :maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="其他" prop>
          <el-input
            :style="{width:widths}"
            type="textarea"
            v-model="cacheCooperatorData.other"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label=" " v-if="!cacheCooperatorData.cooperatorId">
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
        </el-card>-->
        <template v-if="!cacheCooperatorData.cooperatorId && needApply">
          <el-form-item label="文件" prop="voucher">
            <el-upload
              action
              class="upload-btn"
              ref="upload1"
              multiple
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
            <el-select
              :style="{width:'200px'}"
              v-model="copy"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </template>
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
import api from '@/api/bd.js'
import apiDic from '@/api/dictionary.js'
import { uploadFunBySys } from '@/libs/file'
import util from '@/libs/util'
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    cooperatorData: {
      type: Object
    }
  },
  data () {
    //  var checkPhone = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("手机号不能为空"));
    //   } else {
    //     const reg = /^1[3-9][0-9]\d{8}$/;
    //     console.log(reg.test(value));
    //     if (reg.test(value)) {
    //       callback();
    //     } else {
    //       return callback(new Error("请输入正确的手机号"));
    //     }
    //   }
    // };
    return {
      cacheCooperatorData: {
        cooperatorId: null,
        cooperatorName: null,
        cooperatorStatus: null,
        cooperatorType: null,
        cooperationContent: null,
        countryId: null,
        tel: null,
        fixedBrokerage: null,
        brokerageStatus: null,
        email: null,
        principal: null,
        wxId: null,
        firstDockingDate: null,
        completedCooperation: null,
        communicateFeedback: null,
        chargeStatus: null,
        salary: null,
        salaryType: null,
        manageBy: null,
        cooperatorIntroduction: null,
        principalPosition: null,
        officialAccountAverageReading: null,
        averageReadingPrice: null,
        other: null
      },
      loading: false,
      cooperator_type: [],
      common_yes_or_no: [],
      cooperator_status: [],
      brokerage_status: [],
      country: [],
      school: [],

      widths: '230px',
      rules: {
        wxId: [
          { required: true, message: '请输入微信ID', trigger: 'blur' },
          { max: 60, message: '微信ID长度为60个字符以内', trigger: 'blur' }
        ], // 请输入微信ID
        email: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ],
        brokerageStatus: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        fixedBrokerage: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'integer', message: '请输入整数', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '必填', trigger: 'blur' }
          // {
          //   validator: checkPhone,
          //   message: "手机号格式",
          //   trigger: "blur"
          // }
        ],
        cooperatorName: [{ required: true, message: '必填', trigger: 'blur' }],
        cooperatorStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cooperatorType: [{ required: true, message: '必填', trigger: 'blur' }],
        cooperationContent: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        countryId: [{ required: true, message: '必填', trigger: 'blur' }],
        principal: [{ required: true, message: '必填', trigger: 'blur' }],
        firstDockingDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        communicateFeedback: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        chargeStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        salaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        salary: [{ required: true, message: '必填', trigger: 'blur' }],
        manageBy: [{ required: true, message: '必填', trigger: 'blur' }],
        cooperatorIntroduction: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        principalPosition: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        officialAccountAverageReading: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        averageReadingPrice: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      users: [],

      needApply: false,
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
      fileList: []

      // cooperationArr: []
    }
  },
  computed: {},
  watch: {
    editVisible: function (val) {
      if (val) {
        this.cacheCooperatorData.cooperatorId = this.cooperatorData.cooperatorId
        if (this.cooperatorData.cooperatorId) {
          this.getCooperatorDataById(this.cooperatorData.cooperatorId)
        } else {
          this.cacheCooperatorData = { ...this.cooperatorData }
        }
      }
    }
  },
  mounted () {
    this.init()
    this.pageInit()
  },
  methods: {
    getCooperatorDataById () {
      this.loading = true
      api.getCooperatorDataById(this.cooperatorData.cooperatorId).then(res => {
        this.loading = false
        this.cacheCooperatorData = res.data
      })
    },
    async pageInit () {
      this.school = await this.getSchool("school")
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.cooperator_type = await this.getDictionary('cooperator_type')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.cooperator_status = await this.getDictionary('cooperator_status')
      this.brokerage_status = await this.getDictionary('brokerage_status')
      this.country = await this.getDictionary('country')
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
      apiDic.getAuditorListByApplyType('cooperator_info').then(res => {
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
    close () {
      console.log('个人信息关闭')
      this.$emit('close')
      this.clear()
      // this.$refs.cacheCooperatorData && this.$refs.cacheCooperatorData.resetFields();
    },
    change (file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    clear () {
      this.cacheCooperatorData = {
        cooperatorId: null,
        cooperatorName: null,
        cooperatorStatus: null,
        cooperatorType: null,
        cooperationContent: null,
        countryId: null,
        tel: null,
        fixedBrokerage: null,
        brokerageStatus: null,
        email: null,
        principal: null,
        wxId: null,
        firstDockingDate: null,
        completedCooperation: null,
        communicateFeedback: null,
        chargeStatus: null,
        salary: null,
        salaryType: null,
        manageBy: null,
        cooperatorIntroduction: null,
        principalPosition: null,
        officialAccountAverageReading: null,
        averageReadingPrice: null,
        other: null
      }
      this.fileList = []
      this.$refs.upload1 && this.$refs.upload1.clearFiles()

      // this.cooperationArr = [];
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheCooperatorData,
        this.cacheCooperatorData
      )
      if (this.cacheCooperatorData.fixedBrokerage) {
        if (this.cacheCooperatorData.brokerageStatus == 'fixed_brokerage') {
          if ((this.cacheCooperatorData.fixedBrokerage).toString().indexOf('.') != -1) {
            this.$message({
              message: '固定返佣金额不能为小数',
              type: 'error'
            })
            return false
          }
        } else {
          this.cacheCooperatorData.fixedBrokerage = null
        }
      }
      if (this.cacheCooperatorData.chargeStatus == '0') {
        this.cacheCooperatorData.salaryType = null
        this.cacheCooperatorData.salary = 0
      }
      this.$refs.cacheCooperatorData.validate(valid => {
        if (!valid) return
        this.$loading()
        // this.cacheCooperatorData.contentArr = this.cooperationArr;
        if (this.cacheCooperatorData.cooperatorId) {
          api
            .uptCooperator(this.cacheCooperatorData)
            .then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: '失败',
                type: 'error'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
        } else if (this.needApply) {
          this.applySubmit()
        } else {
          console.log(this.cacheCooperatorData, 'yx11231212123132')
          api
            .addCooperator(this.cacheCooperatorData)
            .then(() => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: '失败',
                type: 'error'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
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
        return
      }
      const copyTo = []
      this.copy.forEach(v => {
        copyTo.push({ copyTo: v })
      })
      const data = {
        applyType: 'cooperator_info',
        applyTitle: `BD合作商[${this.cacheCooperatorData.cooperatorName}]的录入申请`,
        copyTo: copyTo,
        approval: approval,
        content: {
          file: [],
          text: [
            {
              label: '合作方名称',
              value: this.cacheCooperatorData.cooperatorName
            },
            // {
            //   label: "合作方状态",
            //   value: this.cacheCooperatorData.cooperatorStatus
            // },
            {
              label: '合作方类型',
              value: this.cacheCooperatorData.cooperatorType
            },
            {
              label: '合作方国家/地区',
              value: this.country.filter(
                v => v.itemValue == this.cacheCooperatorData.countryId
              )[0].itemName
            },
            {
              label: '合作方电话',
              value: this.cacheCooperatorData.tel || '无'
            },
            {
              label: '合作方邮箱',
              value: this.cacheCooperatorData.email || '无'
            },
            {
              label: '对接人微信ID',
              value: this.cacheCooperatorData.wxId
            },
            {
              label: '合作对接人名称',
              value: this.cacheCooperatorData.principal
            },
            {
              label: '合作对接人职位',
              value: this.cacheCooperatorData.principalPosition
            },
            {
              label: '初次对接日期',
              value: this.cacheCooperatorData.firstDockingDate
            },
            {
              label: '是否收费',
              value: this.common_yes_or_no.filter(
                v => v.itemValue == this.cacheCooperatorData.chargeStatus
              )[0].itemName
            },
            {
              label: '本次合作金额',
              value:
                this.cacheCooperatorData.chargeStatus == '0'
                  ? '无'
                  : this.cacheCooperatorData.salaryType +
                    this.cacheCooperatorData.salary
            },
            {
              label: '管理人',
              value: this.users.filter(
                v => v.userId == this.cacheCooperatorData.manageBy
              )[0].userName
            },

            {
              label: '公众号平均阅读量',
              value: this.cacheCooperatorData.officialAccountAverageReading
            },
            {
              label: '单位阅读量价格(￥)',
              value: this.cacheCooperatorData.averageReadingPrice
            },
            {
              label: '沟通进度反馈',
              value: this.cacheCooperatorData.communicateFeedback
            },
            {
              label: '合作方简介',
              value: this.cacheCooperatorData.cooperatorIntroduction
            },
            {
              label: '其他',
              value: this.cacheCooperatorData.other || '无'
            }
          ],
          info: this.cacheCooperatorData
        }
      }
      if (this.fileList.length) {
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          const file = this.fileList[i]
          data.content.info.voucher = []
          uploadFunBySys(file.raw, 'voucher/db/cooperator', url => {
            console.log(url)
            data.content.info.voucher.push({
              voucherName: file.name,
              voucherPath: url
            })
            data.content.file.push({
              name: file.name,
              url: url
            })
            if (data.content.info.voucher.length === this.fileList.length) {
              console.log('bd_contract参数', data)
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
          })
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
    }
    // addCooperation() {
    //   this.cooperationArr.push({
    //     contentType: "",
    //     contentNum: 0,
    //     contentNote: ""
    //   });
    // },
    // deleteCooperation(i) {
    //   this.cooperationArr.splice(i, 1);
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
