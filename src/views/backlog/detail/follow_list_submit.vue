<template>
    <div class="follow-up">
        <el-dialog :close-on-click-modal="false"
        :title="positionNew + '   的follow up'"
        class="info"
        :visible.sync="followVisible"
        width="800px"
        :before-close="followClose"
        >
            <div>
                <el-form
                    v-if="positionNew == 'sales_assistant'"
                    :inline="true"
                    :model="followUpSubmitData"
                    :rules="rules"
                    ref="rule"
                    label-width="160px"
                    style="margin:30px"
                >
                    <el-form-item label="跟进内容" prop="remark" size="mini">
                        <el-input
                        size="mini"
                        v-model="followUpSubmitData.remark"
                        clearable
                        type="textarea"
                        :rows="3"
                        maxlength="10000"
                        minlength="20"
                        :autosize="{ minRows: 2, maxRows: 6}"
                        placeholder="请输入跟进内容"
                        label="跟进内容"
                        tabindex
                        style="width:300px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="achievement">
                        <el-select
                        v-model="followUpSubmitData.achievement"
                        size="mini"
                        filterable
                        placeholder="请选择"
                        >
                        <el-option
                            v-for="item in statusList[positionNew]"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                        </el-select>
                    </el-form-item>

                    <div v-if="('已回复，已拉销售' == followUpSubmitData.achievement)">
                        <el-form-item label="分配部门" prop="counselorGroup">
                            <el-select v-model="followUpSubmitData.counselorGroup" filterable placeholder="请选择">
                                <el-option v-for="item in counselorgroup" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分配顾问" prop="counselorWx">
                            <el-select v-model="followUpSubmitData.counselorWx" filterable placeholder="请选择">
                                <el-option
                                v-for="item in counselorWx"
                                :key="item.accountId"
                                :label="item.accountInfo"
                                :value="item.accountId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分配顾问日期" prop="counselorDate">
                            <el-date-picker
                                v-model="followUpSubmitData.counselorDate"
                                :picker-options="pickerOptions"
                                :clearable="false"
                                :editable="false"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </el-form-item>
                    </div>

                </el-form>
                <el-form
                    :inline="true"
                    v-if="positionNew == 'sales'"
                    :model="followUpSubmitData"
                    :rules="rules"
                    ref="rule"
                    label-width="160px"
                    style="margin:30px"
                    >
                    <el-form-item label="推荐基础项目:">
                        <el-cascader
                        expand-trigger="hover"
                        :options="programList2"
                        v-model="followUpSubmitData.recommendProgram"
                        style="width: 400px;"
                        filterable
                        size="mini"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="推荐实习次数:">
                        <el-select
                        class
                        size="mini"
                        v-model="followUpSubmitData.recommendInternshipNum"
                        placeholder="请选择次数"
                        >
                        <el-option v-for="item in 9" :key="item" :label="item-1" :value="item-1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跟进内容" prop="remark" size="mini">
                        <el-input
                        size="mini"
                        v-model="followUpSubmitData.remark"
                        clearable
                        type="textarea"
                        :rows="3"
                        maxlength="10000"
                        minlength="20"
                        :autosize="{ minRows: 2, maxRows: 6}"
                        placeholder="请输入跟进内容"
                        label="跟进内容"
                        tabindex
                        style="width:300px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="achievement">
                        <el-select
                        v-model="followUpSubmitData.achievement"
                        size="mini"
                        filterable
                        placeholder="请选择"
                        >
                        <el-option
                            v-for="item in statusList[positionNew]"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="('已回复，已拉销售' == followUpSubmitData.achievement)">
                        <el-form-item label="分配部门" prop="counselorGroup">
                        <el-select v-model="followUpSubmitData.counselorGroup" filterable placeholder="请选择">
                            <el-option v-for="item in counselorgroup" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="分配顾问" prop="counselorWx">
                        <el-select v-model="followUpSubmitData.counselorWx" filterable placeholder="请选择">
                            <el-option
                            v-for="item in counselorWx"
                            :key="item.accountId"
                            :label="item.accountInfo"
                            :value="item.accountId"
                            ></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="分配顾问日期" prop="counselorDate">
                        <el-date-picker
                            v-model="followUpSubmitData.counselorDate"
                            :picker-options="pickerOptions"
                            :clearable="false"
                            :editable="false"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                        ></el-date-picker>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="followClose">取 消</el-button>
                <el-button type="primary" v-if="positionNew == 'sales' || positionNew == 'sales_assistant'" @click="submit">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import axiosapi from '@/api/dictionary'

export default {
  mixins: [mixins],
  name: 'followUp',
  props: {
    followVisible: {
      type: Boolean,
      default: false
    },
    positionNew: String,
    detailData: Object
  },
  data () {
    return {
      programList2: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      followUpSubmitData: {
        remark: '',
        achievement: null,
        menteeId: null,
        pkId: null,
        // followType: null,
        beginDate: null,
        endDate: null,
        createPosition: '',
        recommendProgram: [],
        recommendInternshipNum: null
      },
      rules: {
        remark: [
          { required: true, message: '必填', trigger: 'blur' },
          { message: '长度必须15～10000字符', min: 15, max: 10000, trigger: 'blur' }
        ],
        achievement: { required: true, message: '必选', trigger: 'blur' },
        // followType: { required: true, message: "必选", trigger: "blur" },
        counselorGroup: { required: true, message: '必选', trigger: 'blur' },
        counselorWx: { required: true, message: '必选', trigger: 'blur' },
        counselorDate: { required: true, message: '必选', trigger: 'blur' }
      },
      followUpData: { list: [] },
      statusList: {
        sales_assistant: [
          '被删除',
          '未回复',
          '已回复，未拉销售',
          '已回复，已拉销售',
          'SPY'
        ],
        sales: [
          '未签约，未知是否感兴趣',
          '未签约，表明不感兴趣',
          '被删除',
          'SPY',
          '已签约'
        ],
        VIP: ['未回复', '已回复', '已结束合同']
      },
      counselorWx: []
    }
  },
  watch: {
    followVisible: function (newData, oldData) {
      if (newData) {
        this.initPage()
        this.getBasicProgram()
      }
    }
  },
  methods: {
    getBasicProgram () {
      this.programList2 = []
      axiosapi.getProgramList().then(res => {
        console.log('getProgramList', res.data)
        this.programList2 = res.data.basicProgram
      })
    },
    initPage () {
      console.log(this.positionNew)
      this.followUpSubmitData.createPosition = this.positionNew
      this.followUpSubmitData.menteeId = this.detailData.menteeId
      api.getCounselor('wst_sales').then(res => {
        this.counselorWx = res.data
      })
    },
    followClose () {
      this.followUpSubmitData = {
        remark: '',
        achievement: null,
        menteeId: null,
        pkId: null,
        beginDate: null,
        endDate: null,
        createPosition: '',
        recommendProgram: [],
        recommendInternshipNum: null
      }
      this.$emit('close')
    },
    submit () {
      this.$refs.rule.validate(valid => {
        if (!valid) return
        this.setFollowUp()
      })
    },
    setFollowUp () {
      const timeNow = new Date()
      let time1
      let time2
      if (!this.detailData.beginDate) { // 存在开始日期时yx**********************
        time1 = new Date()
      } else {
        time1 = new Date(this.detailData.beginDate) // time1 == 起始日期
      }
      if (!this.detailData.endDate) { // 存在截止日期时yx**********************
        time2 = new Date()
      } else {
        time2 = new Date(this.detailData.endDate) // time2 == 截止日期
      }
      if (
        time1 < timeNow
      ) {
        this.followUpSubmitData.pkId = this.detailData.pkId
        this.followUpSubmitData.beginDate = this.detailData.beginDate
        this.followUpSubmitData.endDate = this.detailData.endDate
      } else {
        delete this.followUpSubmitData.pkId
      }
      console.log(this.followUpSubmitData, '1111111111111111111111111111111111')
      this.$loading({ background: 'rgba(0,0,0,.5)' })
      api.setFollowUp(this.followUpSubmitData)
        .then(res => {
          this.$message.success(res.data)
          console.log('提交follow数据：', res)
          this.followUpSubmitData = {
            remark: '',
            achievement: null,
            menteeId: null,
            pkId: null,
            beginDate: null,
            endDate: null,
            createPosition: '',
            recommendProgram: [],
            recommendInternshipNum: null
          }
          this.$loading().close()
          this.$emit('submit')
          this.followClose()
        })
    }
  }
}
</script>
<style scoped>
.dialog-footer222 {
  text-align: center;
}
.header {
  margin-bottom: 20px;
}
.inl {
  margin: 5px 30px;
  display: inline-block;
  width: 150px;
  color: darkgray;
}
.item {
  color: red;
}
.title {
  color: #222;
}
</style>
