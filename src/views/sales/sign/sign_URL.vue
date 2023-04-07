<!--
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:26
 * @LastEditors: kaan
 * @LastEditTime: 2021-07-30 17:17:43
 * @Version: 
 * @Description: 
-->
<template>
  <div>
    <el-dialog title="签约URL" class :visible.sync="urlVisible" width="500px" :before-close="close" :append-to-body="true">
      <h2 style="color:#409EFF;font-weight: 600;">签约+支付一体化链接：</h2>
      <div style="display:flex">
        <div class="url-box mr20" style="font-weight:500;line-height:32px">{{urlNew}}</div>
        <el-button type="success" size="mini" class="fs12" @click="copyCode2">复制</el-button>
      </div>
      <div style="color:#F56C6C">客户在本链接完成线上签约之后后，自动进入支付页面。<br>
      如果客户需要线下签约，请在你的“订单管理”页面复制“支付链接”给客户、或采用线下转账的方式。</div>
      <div class="copy">
        <a :href="contractPDFURL" target="_blank">查看合同</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { URL } from '@/plugin/axios'

export default {
  props: {
    urlVisible: {
      type: Boolean,
      default: false
    },
    orderId:{

    },
    contractURL: {
      type: String,
    },
    contractPDFURL: {
      type: String,
    }
  },
  data: function() {
    return {
      urlNew:'',
    };
  },
  computed: {},
  watch: {
    urlVisible: function (val, old){
      if(val){
        if(URL.indexOf('pageguo') != '-1'){
          this.urlNew = `https://www.pageguo.com/sign_online/index.html?orderId=${this.orderId}`
        }else{
          this.urlNew = `https://www.wallstreettequila.com/sign_online/index.html?orderId=${this.orderId}`
        }
      }
    }
  },
  mounted() {
    if(URL.indexOf('pageguo') != '-1'){
      this.urlNew = `https://www.pageguo.com/sign_online/index.html?orderId=${this.orderId}`
    }else{
      this.urlNew = `https://www.wallstreettequila.com/sign_online/index.html?orderId=${this.orderId}`
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    // copyLink() {
    //   console.log(31231232)
    //   let _this = this;
    //   let clipboard = new this.clipboard(".cobyOrderSn");
    //   clipboard.on('success', function () {
    //     _this.$toast("复制成功")
    //   });
    //   clipboard.on('error', function () {
    //     _this.$toast("复制失败")
    //   });
    // },
    copyCode2() {
      this.$copyText(`${this.urlNew}`).then(
      res => {
        console.log(res)
        this.$message.success("已成功复制，可直接去粘贴");
      },
      err => {
        this.$message.success("复制失败");
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.url-box {
  white-space: wrap;
  width: 300px;
  overflow: hidden;
  height: 50px;
  text-overflow: ellipsis;
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