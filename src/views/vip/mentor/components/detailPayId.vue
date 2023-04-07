<!--
 * @Author: 杨曦
 * @Date: 2021-10-22 15:08:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-06 16:10:45
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-dialog
			:close-on-click-modal="false"
			width="740px"
			:before-close="newClose"
			:visible.sync="detailVisible"
		>
			<div class="yx_dialog_block" v-loading = "loading">
				<el-descriptions title="支付详情" :column="2" border>
					<el-descriptions-item label-class-name="my-label_yx" label="交易平台">{{detailData.payAccType}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="收款账户">{{detailData.payAcc}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="支付日期">{{detailData.payDate}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="货币类型">{{detailData.payTypeName}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="支付金额">{{detailData.payAmount}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="付款账户">{{detailData.paymentAccountName}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="付款备注" :span="2">{{detailData.payRemark}}</el-descriptions-item>
					<el-descriptions-item label-class-name="my-label_yx" label="交易凭证" :span="2">
						<div style="text-align:center">
              <div v-if="detailData.fileArr.length < 1">暂无</div>
              <div v-else>
                <el-carousel @change="changeVal" :autoplay="false" :interval="12000" indicator-position="outside">
                  <el-carousel-item v-for="item in detailData.fileArr" :key="item">
                    <el-image :preview-src-list="[item]" style="width: auto; height:120px; "  fit="contain" :src="item"></el-image>
                  </el-carousel-item>
                </el-carousel>
                <el-button type="primary" @click="downloadD()">下载</el-button>
              </div>
						</div>
					</el-descriptions-item>
				</el-descriptions>
      </div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="newClose" >取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip'
import files, { downloadFunD } from '@/libs/file'

export default {
  components: { },
  mixins: [mixins],
  name: 'payIdDetail',
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    payId: {}
  },
  data () {
    return {
      loading: false,
      detailData: {
        payAccType: '',
        payAcc: '',
        payDate: '',
        payTypeName: '',
        payAmount: '',
        paymentAccountName: '',
        fileArr: [],
        fileArr2: [],
        payRemark: '',
        payVoucher: ''
      },
      showImg: '',
      index: 0
    }
  },
  created () {
  },
  watch: {
    detailVisible: function (newData) {
      if (newData) {
        this.newUser()
      }
    }
  },
  mounted () {},
  methods: {
    newUser () {
      api.getPayIdDetail(this.payId).then(res => {
        console.log(res.data)
        this.detailData = res.data
      })
    },
    downloadD () {
      downloadFunD(this.detailData.fileArr2[this.index], url => {
        window.open(url)
      })
    },
    newClose () {
      this.showImg = ''
      this.detailData = {
        payAccType: '',
        payAcc: '',
        payDate: '',
        payTypeName: '',
        payAmount: '',
        paymentAccountName: '',
        payRemark: '',
        fileArr: [],
        fileArr2: [],
        payVoucher: ''
      }
      this.$emit('close')
    },
    changeVal (data) {
      this.index = data
      console.log(data)
    }
  }
}
</script>
<style >
  .yx_dialog_block .my-label_yx {
    min-width: 100px !important;
    width: 100px !important;
  }
  .yx_dialog_block .el-carousel__item  {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 120px;
    background-color: #99a9bf;
    margin: 0;
  }
  .yx_dialog_block .el-carousel__container{
    height: 120px !important;
  }
</style>
