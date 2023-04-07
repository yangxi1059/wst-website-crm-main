<template>
  <div class="follow-up">
    <div v-if="followVisible">
      <el-table :data="followUpData.list" size="mini" highlight-current-row style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-descriptions title="" :column="2" style="padding-left:100px" :contentStyle="{flex:1}">
              <el-descriptions-item label="家长一微信ID">{{scope.row.parentWx1}}</el-descriptions-item>
              <el-descriptions-item label="家长一微信名">{{scope.row.parentWxName1}}</el-descriptions-item>
              <el-descriptions-item label="家长二微信ID">{{scope.row.parentWx2}}</el-descriptions-item>
              <el-descriptions-item label="家长二微信名">{{scope.row.parentWxName2}}</el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.canFollow == '1'" @click="toFollow(scope.row)">follow</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="wxName" align="center" label="学员微信名"></el-table-column>
        <el-table-column prop="wxId" align="center" label="微信ID"></el-table-column>
        <el-table-column prop="beginDate" align="center" label="开始日期"></el-table-column>
        <el-table-column prop="endDate" align="center" label="截止日期"></el-table-column>
        <el-table-column prop="times" align="center" label="第几次follow" width="100"></el-table-column>
        <el-table-column prop="achievement" align="center" label="状态"></el-table-column>
        <el-table-column prop="remark" align="center" label="跟进内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" align="center" label="提交时间"></el-table-column>
        <el-table-column prop="updateByName" align="center" label="提交人"></el-table-column>
        <el-table-column prop="sourceWxName" align="center" label="导流微信号"></el-table-column>
      </el-table>
    </div>
    <p style="{height: '20px'}"></p>
    <el-dialog
      title="Follow Up详情"
      :visible.sync="followDetailVisible"
      append-to-body
      width="450px"
      :before-close="followDetailClose"
      :close-on-click-modal	="false"
    >
      <el-form
        :model="followUpSubmitData"
        :rules="rules"
        ref="rule"
        label-width="100px"
      >
        <el-form-item label="学员微信名" prop="">{{formData.wxName}}</el-form-item>
        <el-form-item label="微信ID" prop="">{{formData.wxId}}</el-form-item>
        <el-form-item label="开始日期" prop="">{{formData.beginDate}}</el-form-item>
        <el-form-item label="截止日期" prop="">{{formData.endDate}}</el-form-item>
        <el-form-item label="状态" prop="achievement">
          <el-select
            v-model="followUpSubmitData.achievement"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusList[position]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进内容" prop="remark">
          <el-input
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followDetailClose">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/assistant'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  name: 'followUp',
  props: {
    followVisible: {
      type: Boolean,
      default: false
    },
    menteeId: {
      type: String
    }
  },
  data () {
    return {
      followDetailVisible: false,
      position: 'sales_assistant',
      formData: {},
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
        pkId: null
      },
      rules: {
        remark: [
          { required: true, message: '必填', trigger: 'blur' },
          { message: '长度必须15～10000字符', min: 15, max: 10000, trigger: 'blur' }
        ],
        achievement: { required: true, message: '必选', trigger: 'blur' }
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
      followTypes: [
        { name: '系统业务', id: '0' },
        { name: '主动记录', id: '1' }
      ],
      counselorWx: []
    }
  },
  watch: {
    followVisible: function (newData, oldData) {
      if (newData) {
        this.getListData(this.menteeId)
        this.getBasicProgram()
      }
    }
  },
  created () {
    api.getCounselor('wst_sales').then(res => {
      console.log(res, 'dtgisauiasgfuiagfuiwgfiu')
      this.counselorWx = res.data
    })
  },
  methods: {
    getBasicProgram () {
      this.programList2 = []
      apiDic.getProgramList().then(res => {
        console.log('getProgramList', res.data)
        this.programList2 = res.data.basicProgram
      })
    },
    getListData (menteeId) {
      const data = {
        pageNum: 1,
        pageSize: 1000,
        position: this.position
      }
      api.getFollowUpListData(menteeId, data).then(res => {
        console.log('follow up数据sales：', res.data.rows)
        this.followUpData.list = res.data.rows
        this.followUpSubmitData.menteeId = this.menteeId
      }).catch(err => {
        console.log(err)
      })
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
      //  0：系统业务 1：主动记录
      if (!this.formData) {
        delete this.followUpSubmitData.pkId
        // this.followUpSubmitData.followType = 1;
      } else {
        console.log(this.formData)
        if (!this.formData.beginDate) { // 存在开始日期时yx**********************
          time1 = new Date()
        } else {
          time1 = new Date(this.formData.beginDate) // time1 == 起始日期
        }
        if (!this.formData.endDate) { // 存在截止日期时yx**********************
          time2 = new Date()
        } else {
          time2 = new Date(this.formData.endDate) // time2 == 截止日期
        }
        if (
          time1 < timeNow &&
          this.formData.followStatus &&
          this.formData.followStatus == 0
        ) {
          this.followUpSubmitData.pkId = this.formData.pkId
          this.followUpSubmitData.beginDate = this.formData.beginDate
          this.followUpSubmitData.endDate = this.formData.endDate
        } else {
          delete this.followUpSubmitData.pkId
        }
      }
      console.log(this.followUpSubmitData, '1111111111111111111111111111111111')
      this.$loading({ background: 'rgba(0,0,0,.5)' })

      api.assistantSetFollowUp(this.followUpSubmitData).then(res => {
        this.$message.success(res.data)
        console.log('提交follow数据：', res)
        this.followDetailClose()
        this.getListData(this.menteeId)
        this.$loading().close()
        this.$emit('updata')
      })
    },
    /**
     * @description: 去follow
     * @param {*} data
     * @return {*}
     */
    toFollow (data) {
      console.log(data)
      this.followDetailVisible = true
      this.formData = JSON.parse(JSON.stringify(data))
    },
    followClose () {
      this.followUpData.list = []
      this.followUpSubmitData = {
        remark: '',
        achievement: null,
        menteeId: null,
        pkId: null
      },
      this.$emit('close')
    },
    followDetailClose () {
      this.formData = {}
      this.followUpSubmitData = {
        remark: '',
        achievement: null,
        menteeId: null,
        pkId: null
      },
      this.followDetailVisible = false
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
  /* font-size: 16px; */
  color: #222;
}
</style>
