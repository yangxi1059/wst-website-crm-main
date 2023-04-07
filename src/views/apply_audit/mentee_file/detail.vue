<!--
 * @Author: 库建华
 * @Date: 2020-02-10 20:01:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-17 15:12:23
 * @Version:
 * @Description:
 -->
 <template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'文书修改详情'"
      :visible.sync="menteeFileVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">申请人</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createByName}}</el-col>
        <el-col :span="4" class="_item-name">申请状态</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.applyStatusName}}</el-col>
        <el-col :span="4" class="_item-name">申请时间</el-col>
        <el-col :span="4" class="_item-value">{{refundData.apply.createTime}}</el-col>
      </el-row>
      <span v-if="refundData.content">
        <div style="width:100%;display:flex" v-for="(item,i) in refundData.content.text" :key="i">
          <el-col style="flex:4" class="_item-name">{{item.label}}</el-col>
          <el-col style="flex:20" class="_item-value">
            <span :title="item.value">{{item.value || '无'}}</span>
          </el-col>
        </div>
      </span>
      <el-row class="mb10" v-if="refundData.content">
        <span v-for="(item,i) in refundData.content.file" :key="i">
          <el-col :span="4" class="_item-name">修改前（{{i+1}}）：</el-col>
          <el-col :span="20" class="_item-value">
            <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
             <el-button
              @click="downloadD(item.url)"
              type="text"
              size="mini"
              title="下载"
              icon="el-icon-download"
              v-if="roleInfo.includes('mentee_file_audit_file_download')"
            ></el-button>
          </el-col>
        </span>
      </el-row>
      <el-row class="mb10" v-if="refundData.content">
        <span v-for="(item,i) in refundData.content.file2" :key="i">
          <el-col :span="4" class="_item-name">修改后（{{i+1}}）：</el-col>
          <el-col :span="20" class="_item-value">
            <el-button @click="download(item.url)" size="mini">{{item.name}}</el-button>
             <el-button
              @click="downloadD(item.url)"
              type="text"
              size="mini"
              title="下载"
              icon="el-icon-download"
              v-if="roleInfo.includes('mentee_file_detail_file_download')"
            ></el-button>
          </el-col>
        </span>
      </el-row>
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">审核人</el-col>
        <el-col :span="20" class="_item-value" v-html="approval">{{}}</el-col>
      </el-row>
      <el-row class="mb10" v-if="copyTo">
        <el-col :span="4" class="_item-name">抄送人</el-col>
        <el-col :span="20" class="_item-value">{{copyTo}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file'
import util from '@/libs/util'
import api from '@/api/vip.js'
import { mapState } from 'vuex'

export default {
  name: 'menteeFile',
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    applyData: {
      type: Object
    },
    menteeFileVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      USERINFO: util.sessions.get('userInfo'),

      widths: '230px',
      rules: {
        payType: [{ required: true, message: '必填', trigger: 'blur' }],
        approverid: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      refundData: {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      },
      approval: '',
      copyTo: '',
      account: '',
      totalRefund: '',
      Myclass: ['', 'colorG', 'colorR'],
      MyStatus: ['待审核', '已通过', '已拒绝'],
      canSubmit: false
    }
  },
  watch: {
    menteeFileVisible: function (newData, oldData) {
      if (newData) {
        console.log('applyData详情', this.applyData)
        this.Topage()
      }
    }
  },
  mounted () {},
  methods: {
    Topage () {
      api.getApplyDetailByApplyId(this.applyData.applyId).then(res => { //  文书修改详情弹窗
        this.refundData = {
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval
        }
        console.log('位置apply_aduit/mentee_file/detail.vue', this.refundData)
        this.account = this.refundData.content.info.vacateReason
        this.totalRefund = this.refundData.content.info.vacateTotalWage
        this.approval = ''
        let point = true
        res.data.approval.forEach(v => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${v.approveTime ||
            ''}</p>`
          if (point && v.approveStatus == 0) {
            if (v.approverId === this.USERINFO.userId || v.approverId.indexOf(this.USERINFO.userId) != '-1') {
              this.canSubmit = true
            }
            point = false
          }
        })
        this.copyTo = ''
        res.data.copyTo.forEach(v => {
          this.copyTo += v.copyToName + '; '
        })
      })
    },
    // 关闭
    handleClose () {
      // this.$refs.refundData.resetFields();
      this.$emit('close')
      this.refundData = {
        apply: {},
        content: {},
        copyTo: [],
        approval: [],
        pay: {}
      }
      this.canSubmit = false
    },
    download (val) { // 预览文件
      downloadFun(val)
    },
    downloadD (val) { // 下载文件
      downloadFunD(val, url => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
