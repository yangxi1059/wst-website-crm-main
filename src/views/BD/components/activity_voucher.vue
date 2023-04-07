<!--
 * @Author: 杨曦
 * @Date: 2020-12-31 11:16:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 14:25:22
 * @Version:
 * @Description:
-->
<template>
  <div class="pay-way">
    <el-dialog :close-on-click-modal="false"
      width="600px"
      :title="'活动【' + guestData.activityName + '】凭证详情'"
      :visible.sync="voucherVisible"
      :before-close="close"
    >
        <el-table
        :data="tableData"
        size="small"
        style="width: 100%">
            <el-table-column
              prop="voucherName"
              align="center"
              label="凭证名称"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button @click="download(scope.row.voucherPath)" v-if="roleInfo.includes(`BD_cooperator_activity_voucher_view`)" size="mini">预览</el-button>
                <el-button @click="downloadD(scope.row.voucherPath)" v-if="roleInfo.includes(`BD_cooperator_activity_voucher_download`)" size="mini">下载</el-button>
              </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/bd.js'
import { downloadFun, downloadFunD } from '@/libs/file'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  name: 'payWay',
  mixins: [mixins],
  props: {
    voucherVisible: {
      type: Boolean,
      default: false
    },
    guestData: {
      type: Object
    }
  },
  computed:{
    ...mapState('role', ['roleInfo'])
  },
  data () {
    return {
      tableData: []
    }
  },
  mounted () {

  },
  watch: {
    voucherVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getVoucher(this.guestData.activityId).then(res => {
        console.log(res.data)
        this.tableData = res.data
      })
    },
    close () {
      this.$emit('close')
    },
    download (val) {
      downloadFun(val, (url) => {
        window.open(url)
      })
    },
    downloadD (val) {
      downloadFunD(val, (url) => {
        window.open(url)
      })
    }
  }
}
</script>
