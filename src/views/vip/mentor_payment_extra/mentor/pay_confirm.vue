<template>
  <div class="pay-way">
    <el-drawer
      size="70%"
      title="佣金列表"
      :visible.sync="payConfirmVisible"
      :before-close="beforerewardListClose"
    >
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
      >
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus == 0">
              <el-button size="mini" type="text" @click="sure(scope.row)">确认到账</el-button>
            </div>
            <div v-else>已确认</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName" label="凭证" show-overflow-tooltip>
           <template slot-scope="scope">
              <el-button size="mini" type="text" @click="download(scope.row.payVoucher)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName" label="学生姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="programName" label="项目" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="totalHours" label="项目总课时" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="lessonTimesIds" label="相应课号" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payLessonHours" label="对应课时" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="note" label="课时备注" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyTime" label="申请时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="paymentAmount" label="申请金额" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payDate" label="Paid Date" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payAmountAll" label="财务付款金额（含手续费）" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payAmountNone" label="导师到账金额" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payAcc" label="支付方式" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="paymentAccountName" label="付款账户" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="payRemark" label="支付备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import api from '@/api/vip.js'
import { downloadFun } from '@/libs/file'
import { priceToM } from '@/libs/util.js'

export default {
  name: 'rewardList',
  props: {
    payConfirmVisible: {
      type: Boolean,
      default: false
    },
    mentorId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: [],
      rewardList: [],
    }
  },
  mounted () {
  },
  watch: {
    payConfirmVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      this.getrewardListDataByMentorId(this.mentorId, this.menteeId)
    },
    getrewardListDataByMentorId (mentorId, menteeId) {
      this.$loading()
      api.getPaymentRecordListByMentorId(mentorId, menteeId).then(res => {
        console.log('导师支付账户列表', res)
        res.data.rows.forEach(v => {
          v.paymentAmount = v.compensationType == 'cny' ? '￥' + v.paymentAmountCny : '$' + v.paymentAmountUsd
          if (v.payType == 'cny') {
            v.payAmountAll = priceToM(v.payAmount, '￥')
            v.payAmountNone = priceToM(v.payAmount - (v.commissionAmount || 0), '￥')
          } else if (v.payType == 'usd') {
            v.payAmountAll = priceToM(v.payAmount, '$')
            v.payAmountNone = priceToM(v.payAmount - (v.commissionAmount || 0), '$')
          }
          v.payAcc = v.payAccType + v.payAcc
        })
        this.tableData = res.data.rows
        this.$loading().close()
      })
    },
    beforerewardListClose () {
      this.$emit('close')
      this.tableData = []
    },
    sure (row) {
      this.$confirm('是否确认到账?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          payId: row.payId,
          applyId: row.applyId
        }
        this.$loading()
        api.updateMentorPaymentDetail(data).then(res => {
          this.$message({
            type: 'success',
            message: '确认成功'
          })
          this.$loading().close()
          this.Topage()
          this.$emit('submit')
        })
      })
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    }
  }
}
</script>
