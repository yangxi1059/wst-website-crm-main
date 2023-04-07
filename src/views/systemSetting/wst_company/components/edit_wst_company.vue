<!--
 * @Author: 库建华
 * @Date: 2020-06-29 19:13:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-18 14:43:36
 * @Version: 1
 * @Description:
-->
<template>
  <div class="inputInformation">
    <el-dialog
      :title="companyId ? '编辑公司' : '新增公司'"
      class="info"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="550px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="companyData"
        :rules="rules"
        ref="ruleForm"
        label-width="160px"
      >
        <el-form-item label="公司名" prop="companyName">
          <el-input :style="{width:widths}" v-model="companyData.companyName" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="principal">
          <el-input :style="{width:widths}" v-model="companyData.principal" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input :style="{width:widths}" v-model="companyData.tel" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input :style="{width:widths}" v-model="companyData.email" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="companyStatus">
          <el-select
            :style="{width:widths}"
            v-model="companyData.companyStatus"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in  common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线下支付方式" prop="offlineTransaction">
          <el-input :style="{width:widths}" v-model="companyData.offlineTransaction" type="textarea" :autosize="{ minRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="已接服务">
          <div class="logo-item" v-if="companyData.accountId">
            <el-popover
              class="pay-popver"
              placement="right-start"
              title="易签宝公司id"
              trigger="hover"
              :content="companyData.accountId">
              <el-button slot="reference"><el-image class="logo-image" :src="require(`@/assets/img/esign_logo.png`)"></el-image></el-button>
            </el-popover>
          </div>
          <div class="logo-item" v-if="companyData.mchId">
            <el-popover
              class="pay-popver"
              placement="right-start"
              title="微信商户号"
              trigger="hover"
              :content="companyData.mchId">
              <el-button slot="reference"><el-image class="logo-image" :src="require(`@/assets/img/wechat_logo.png`)"></el-image></el-button>
            </el-popover>
          </div>
          <div class="logo-item" v-if="companyData.appId">
            <el-popover
              class="pay-popver"
              placement="right-start"
              title="支付宝商铺号"
              trigger="hover"
              :content="companyData.appId">
              <el-button slot="reference"><el-image class="logo-image" :src="require(`@/assets/img/alipay_logo.png`)"></el-image></el-button>
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  name: 'inputInformation',
  props: {
    companyId: {
      type: String,
      default: ''
    },
    editVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        companyName: [{ required: true, message: '必填', trigger: 'blur' }],
        companyStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        principal: [{ required: true, message: '必填', trigger: 'blur' }],
        tel: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [{ required: true, message: '必填', trigger: 'blur' }],
        offlineTransaction: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      common_yes_or_no:[],
      companyData: {
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    editVisible: function (newData) {
      if (newData && this.companyId) {
        this.getWstCompanyById(this.companyId)
      } else {
        this.companyData = {
          companyStatus: '1'
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    getWstCompanyById (companyId) {
      this.$loading({ background: 'rgba(0,0,0,.5)' })
      apiDic.getWstCompanyById(companyId).then(res => {
        console.log('getWstCompanyById', res.data)
        this.companyData = res.data
        this.$loading().close()
      })
    },
    // 录入信息，关闭
    handleClose () {
      this.$emit('close')
      this.clean()
    },
    clean () {
      this.companyData = {
        companyStatus: '1'
      }
      this.$refs.ruleForm.resetFields()
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          companyName: this.companyData.companyName,
          companyStatus: this.companyData.companyStatus,
          principal: this.companyData.principal,
          tel: this.companyData.tel,
          email: this.companyData.email,
          offlineTransaction: this.companyData.offlineTransaction
        }
        if (this.companyId) {
          data.companyId = this.companyId
          apiDic.uptWstCompany(data).then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clean()
          })
        } else {
          apiDic.addWstCompany(data).then(() => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clean()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-item{
  width:100%;
  margin-bottom:10px;
}
.logo-image{
  margin-right:10px;
  width:100px;
  height:auto;
  vertical-align:middle;
}
</style>
