<!--
 * @Author: 库建华
 * @Date: 2020-02-10 20:01:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-24 15:42:16
 * @Version:
 * @Description:
 -->
 <template>
  <div class="mentor-pay">
    <el-dialog :close-on-click-modal="false"
      :title="'文书修改申请'"
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
        <el-row class="mb10" v-for="(item,i) in refundData.content.text" :key="i">
          <el-col :span="4" class="_item-name">{{item.label}}</el-col>
          <el-col :span="20" class="_item-value">
            <span :title="item.value">{{item.value||'无'}}</span>
          </el-col>
        </el-row>
      </span>
      <el-row class="mb10" v-if="refundData.content">
        <span v-for="(item,i) in refundData.content.file" :key="i">
          <el-col :span="4" class="_item-name _item-name1">修改前（{{i+1}}）：</el-col>
          <el-col :span="20" class="_item-value">
            <el-button @click="download(item.url)" size="mini" title="预览">{{item.name}}</el-button>
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
          <el-col :span="4" class="_item-name _item-name1">修改后（{{i+1}}）：</el-col>
          <el-col :span="20" class="_item-value">
            <el-button @click="download(item.url)" size="mini" title="预览">{{item.name}}</el-button>
            <el-button
              @click="downloadD(item.url)"
              size="mini"
              title="下载"
              type="text"
              icon="el-icon-download"
              v-if="roleInfo.includes('mentee_file_audit_file_download')"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <template v-if="canSubmit && refundData.apply.applyStatus == 1">
          <el-button type="primary" @click="reject">驳 回</el-button>
          <el-button type="primary" @click="submit">通 过</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFun, downloadFunD } from '@/libs/file'
import util from '@/libs/util'
import { mapState } from 'vuex'
import api from '@/api/vip.js'
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
      USERINFO: util.sessions.get('userInfo'),
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
      api.getApplyDetailByApplyId(this.applyData.applyId).then((res) => {
        console.log('详情数据', res)
        this.refundData = {
          apply: res.data.apply,
          content: JSON.parse(res.data.apply.content),
          copyTo: res.data.copyTo,
          approval: res.data.approval
        }
        this.account = this.refundData.content.info.vacateReason
        this.totalRefund = this.refundData.content.info.vacateTotalWage
        this.approval = ''
        // res.data.approval.forEach(v => {
        //   this.approval += v.approverName + "; ";
        // });
        let point = true
        res.data.approval.forEach((v) => {
          this.approval += `<p class='mb10'>${v.approverName} - <span class='${
            this.Myclass[v.approveStatus]
          }'>${this.MyStatus[v.approveStatus]} </span>  ${
            v.approveTime || ''
          }</p>`
          if (point && v.approveStatus == 0) {
            if (v.approverId === this.USERINFO.userId || v.approverId.indexOf(this.USERINFO.userId) != '-1') {
              this.canSubmit = true
            }
            point = false
          }
        })
        this.copyTo = ''
        res.data.copyTo.forEach((v) => {
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
        copyTo: [],
        approval: [],
        content: {},
        pay: {}
      }
      this.canSubmit = false
    },
    download (val) {
      downloadFun(val)
    },
    downloadD (path) {
      console.log(path)
      downloadFunD(path, (url) => {
        window.open(url)
      })
    },
    // 确认
    submit () {
      this.$confirm('是否确认通过此审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          applyId: this.refundData.apply.applyId,
          approveStatus: '1'
        }
        console.log(data)
        api
          .setAuditRefund(data)
          .then((res) => {
            console.log('', res)
            this.$message({
              message: '审核通过',
              type: 'success'
            })
            // if (res.data == "待支付") {
            //   this.$emit("submitToPay");
            // } else {
            //   }
            this.$emit('submit')
            this.$loading().close()
            this.handleClose()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '审核失败'
            })
            this.$loading().close()
            this.$emit('submit')
            this.handleClose()
          })
      })
    },
    // 驳回
    reject () {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '驳回理由字数需在1~200个字符'
      })
        .then(({ value }) => {
          this.$loading({ background: 'rgba(0,0,0,.5)' })
          // let p = {
          //     label: "驳回理由",
          //     value: value
          //   }
          //   this.refundData.content.text.push(p)
          const data = {
            applyId: this.refundData.apply.applyId,
            // text: this.refundData.content.text,
            approveStatus: '2',
            msg: value
          }
          console.log(data, this.refundData.content.text)
          api
            .setAuditRefund(data)
            .then((res) => {
              console.log('审核导师酬金申请', res)
              this.$message({
                message: '驳回成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.handleClose()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '驳回失败'
              })
              this.$loading().close()
              this.$emit('submit')
              this.handleClose()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消驳回'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
._item-name1{
  margin-top: 15px;
}
</style>
