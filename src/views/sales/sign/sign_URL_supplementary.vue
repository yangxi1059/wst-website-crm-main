<!--
 * @Author: 杨曦
 * @Date: 2021-01-28 15:18:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-12-22 09:33:26
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" :visible.sync="urlSupplementaryVisible" width="1200px" :before-close="close" :append-to-body="true">
      <div slot="title">
        <div style="display:flex">
          <div style="font-size:18px;font-weight:500;">签约URL</div>

        </div>
      </div>
      <h2 style="color:#409EFF;font-weight: 600;">签约+支付一体化链接：</h2>
      <div style="display:flex">
        <div class="url-box mr20" style="font-weight:500;line-height:32px">{{urlNew}}</div>
        <el-button type="success" size="mini" class="fs12" @click="copyCode2">复制</el-button>
      </div>
      <div style="color:#F56C6C">客户在本链接完成线上签约之后后，自动进入支付页面。<br>
      如果客户需要线下签约，请在你的“订单管理”页面复制“支付链接”给客户、或采用线下转账的方式。</div>
      <el-tabs type="border-card" style="height:600px" class="mt20"  :tab-position="'left'">
        <el-tab-pane :label="'合同'+(i+1)" v-for="(item,i) in contractPDFList.docList" :key="i"  style="position:relative">
            <el-button @click="downLoad(item.ossPath)" icon="el-icon-download" style="position:absolute;top:0;left:0" type="primary" size="small">下载</el-button>
            <iframe :src="item.previewUrl" style="width:100%" frameborder="0" class="main-iframe" height='580px'></iframe>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/sales_assistant.js'
import { downloadFun, downloadFunD } from '@/libs/file'
import { URL } from '@/plugin/axios'
export default {
  props: {
    urlSupplementaryVisible: {
      type: Boolean,
      default: false
    },
    orderId: {

    },
    contractURL: {
    },
    contractPDFList: {
    }
  },
  data: function () {
    return {
      urlNew: ''
    }
  },
  computed: {},
  watch: {
    urlSupplementaryVisible: function (val, old) {
      if (val) {
        console.log(URL)
        if (URL.indexOf('pageguo') != '-1') {
          this.urlNew = `https://www.pageguo.com/sign_online/index.html?orderId=${this.orderId}`
        } else {
          this.urlNew = `https://www.wallstreettequila.com/sign_online/index.html?orderId=${this.orderId}`
        }
      }
    }
  },
  mounted () {
    if (URL.indexOf('pageguo') != '-1') {
      this.urlNew = `https://www.pageguo.com/sign_online/index.html?orderId=${this.orderId}`
    } else {
      this.urlNew = `https://www.wallstreettequila.com/sign_online/index.html?orderId=${this.orderId}`
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    downLoad (path) {
      downloadFunD(path, (url) => {
        window.open(url)
      })
    },
    // copyLink () {
    //   console.log(31231232)
    //   const _this = this
    //   const clipboard = new this.clipboard('.cobyOrderSn')
    //   clipboard.on('success', function () {
    //     _this.$message.success('复制成功')
    //   })
    //   clipboard.on('error', function () {
    //     _this.$message.success('复制失败')
    //   })
    // },
    copyCode () {
      this.$copyText(`${this.contractURL}`).then(
        res => {
          console.log(res)
          this.$message.success('已成功复制，可直接去粘贴')
        },
        err => {
          this.$message.success('复制失败')
        })
    },
    copyCode2 () {
      this.$copyText(`${this.urlNew}`).then(
        res => {
          console.log(res)
          this.$message.success('已成功复制，可直接去粘贴')
        },
        err => {
          this.$message.success('复制失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.url-box {
  white-space: wrap;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
}
.copy {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px #409eff solid;
  color: #409eff;
  border-radius: 5px;
  display: inline-block;
  margin-right: 20px;
}

.copy:hover {
  background-color: #409eff;
  color: #fff;
}
</style>
