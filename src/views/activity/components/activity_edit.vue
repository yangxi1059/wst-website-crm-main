<!--
 * @Author: kaan
 * @Date: 2021-03-09 18:29:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 16:54:49
 * @Version:
 * @Description:
-->

<template>
  <!-- 新增/编辑弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="'优惠活动设置'"
      :visible.sync="infoVisible"
      width="900px"
      :before-close="close"
    >
      <el-form ref="activityData"
        style="position:relative"
        :model="formData"
        :rules="rules"
        inline
        size="medium"
        :label-width="labelWidth"
      >
        <el-switch
          class="active-switch"
          v-model="activeStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开"
          inactive-text="激活状态：关">
        </el-switch>
        <el-form-item label="券名称" prop="discountName">
          <el-input :style="{width:widths}" v-model="formData.discountName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          如：【辞旧迎新】满30000—300元 【双十二优惠】无门槛8折
        </el-form-item>
        <el-form-item label="开始时间" prop="beginDate">
          <el-date-picker
            v-model="formData.beginDate"
            :clearable="false"
            :editable="false"
            :style="{width:widths}"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            :clearable="false"
            :editable="false"
            :style="{width:widths}"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-tabs v-model="formData.thresholdStatus" type="card" :stretch="stretch">
          <el-tab-pane label="有使用门槛" name="1">
            <div class="el-form-item__label" :style="{width:labelWidth}">优惠方式</div>
            <el-radio-group v-model="formData.discountType" class="radio-style">
              <el-radio v-for="(item,index) in discount_type" :key="index" :label="item.itemValue">{{item.itemName}}</el-radio>
            </el-radio-group>
            <el-form-item  prop="achieveAmount">
              <el-input :style="{width:widthsHalf}" class="mr20"
                v-model="formData.achieveAmount" size="mini" :placeholder="formData.amountType =='cny'?'￥':'$'"
              >
                <template slot="prepend">满{{formData.amountType =="cny"?"￥":"$"}}</template>
              </el-input>
            </el-form-item>
            <el-form-item  prop="discountAmount" v-if="formData.discountType == 'amount'">
              <el-input :style="{width:widthsHalf}"
                v-model="formData.discountAmount" size="mini" :placeholder="formData.amountType =='cny'?'￥':'$'"
              >
                <template slot="prepend">减{{formData.amountType =="cny"?"￥":"$"}}</template>
              </el-input>
            </el-form-item>
            <el-form-item  prop="discountPercent" v-else>
              <el-input :style="{width:widthsHalf}"
                v-model="formData.discountPercent" size="mini"  placeholder=""
              >
                <template slot="prepend">优惠</template>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="无使用门槛" name="0">
            <div class="el-form-item__label" :style="{width:labelWidth}">优惠方式</div>
            <el-radio-group v-model="formData.discountType" class="radio-style">
              <el-radio v-for="(item,index) in discount_type" :key="index" :label="item.itemValue">{{item.itemName}}</el-radio>
            </el-radio-group>
            <el-form-item  prop="discountAmount" v-if="formData.discountType == 'amount'">
              <el-input :style="{width:widthsHalf}"
                v-model="formData.discountAmount" size="mini" :placeholder="formData.amountType =='cny'?'￥':'$'"
              >
              </el-input>
            </el-form-item>
            <el-form-item  prop="discountPercent" v-else>
              <el-input :style="{width:widthsHalf}"
                v-model="formData.discountPercent" size="mini"  placeholder=""
              >
              </el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item label="金额类型">
          <el-radio-group v-model="formData.amountType" class="radio-style">
            <el-radio v-for="(item,index) in bill_currency_type" :key="index" :label="item.itemValue">{{item.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券数量">
          <el-radio-group v-model="limitNum" class="radio-style">
            <el-radio :label="false">无限制</el-radio>
            <el-radio :label="true">有限制</el-radio>
          </el-radio-group>
          <el-input :style="{width:widthsHalf}" v-model="formData.couponNum" size="mini" :disabled="!limitNum"></el-input>
        </el-form-item>
        <el-form-item label="适用范围">
          <el-select size="mini"
            class="mr10"
            style="width:350px"
            v-model="formData.programArr"
            filterable
            multiple
            clearable
            placeholder="全部"
          >
            <el-option
              v-for="(item,index) in programList"
              :key="index"
              :label="item.programName"
              :value="item.programId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
</template>
<script>
import mixins from '@/plugin/mixins'
import api from '@/api/activity.js'
import apiDic from '@/api/dictionary.js'
import { mapState } from 'vuex'

export default {
  name: 'activityEdit',
  mixins: [mixins],
  props: {
    infoVisible: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: ''
    },
    discountId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    var validateAchieveAmount = (rule, value, callback) => {
      if (value === '' && this.formData.thresholdStatus == 1) {
        callback(new Error('必填'))
      } else {
        callback()
      }
    }
    var validateDiscountPercent = (rule, value, callback) => {
      if (this.formData.discountType == 'percent') {
        if (value === '') {
          callback(new Error('必填'))
        } else if (value.toString().match(/[^\d^\.]/g, '') || value < 0 || value > 100) {
          callback(new Error('请输入0-100'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateDiscountAmount = (rule, value, callback) => {
      if (value === '' && this.formData.discountType == 'amount') {
        callback(new Error('必填'))
      } else {
        callback()
      }
    }
    return {
      labelWidth: '110px',
      widths: '250px',
      widthsHalf: '180px',
      stretch: true,

      activeStatus: true,
      limitNum: false,
      programList: [],
      formData: {
        discountId: '',
        discountName: '',
        beginDate: '',
        endDate: '',
        thresholdStatus: '1',
        achieveAmount: '',
        discountType: 'amount',
        amountType: 'cny',
        discountAmount: '',
        discountPercent: '',
        couponNum: 0,
        activeStatus: true,
        programArr: []
      },
      // 字典项
      discount_type: [],
      common_yes_or_no: [],
      bill_currency_type: [{
        itemName: '人民币',
        itemValue: 'cny'
      }, {
        itemName: '美金',
        itemValue: 'usd'
      }],

      rules: {
        discountName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        beginDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        achieveAmount: [
          { validator: validateAchieveAmount, trigger: 'blur' }
        ],
        discountPercent: [
          { validator: validateDiscountPercent, trigger: 'blur' }
        ],
        discountAmount: [
          { validator: validateDiscountAmount, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    infoVisible: function (val) {
      if (val && this.editType == 'edit') {
        this.resetForm()
        this.getInfo()
      }
    },
    editType: function (val) {
      if (val == 'add') {
        this.resetForm()
      }
    },
    'formData.discountType': function (val) {
      if (val == 'amount') {
        this.formData.discountPercent = ''
      } else if (val == 'percent') {
        this.formData.discountAmount = ''
      }
    }
  },
  mounted () {
    this.resetForm()
    this.pageInit()
    const params = {
      pageNum: 1,
      pageSize: 1000,
      programStatus: '1'
    }
    apiDic.getProgramDicList(params).then((res) => {
      console.log('getProgramList', res)
      this.programList = res.data.rows
    })
  },
  methods: {
    async pageInit () {
      this.discount_type = await this.getDictionary('discount_type')
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    /**
     * @description: 弹框组件重置
     * @param {*}
     * @return {*}
     */
    resetForm () {
      this.activeStatus = true,
      this.limitNum = false
      this.formData.discountId = ''
      this.formData.discountName = ''
      this.formData.beginDate = ''
      this.formData.endDate = ''
      this.formData.thresholdStatus = '1'
      this.formData.achieveAmount = ''
      this.formData.discountType = 'percent'
      this.formData.amountType = 'cny'
      this.formData.discountAmount = ''
      this.formData.discountPercent = ''
      this.formData.couponNum = 0
      this.formData.activeStatus = true
      this.formData.programArr = []
    },

    /**
     * @description: 通过优惠券码获取详情信息
     * @param {*} discountId 券id
     * @return {*}
     */
    getInfo () {
      if (this.discountId == '') {
        this.$message.error('获取券id失败')
        return
      }
      api.getInfo(this.discountId).then(res => {
        console.log('编辑券详情', res)
        this.formData = res.data
        console.log(res.data.activeStatus == 1)
        this.activeStatus = res.data.activeStatus == 1
        this.limitNum = res.data.couponNum != -1
        this.formData.couponNum = res.data.couponNum == -1 ? '' : res.data.couponNum
      })
    },

    /**
     * @description: 新增/编辑弹框关闭
     * @param {*}
     * @return {*}
     */
    close () {
      console.log('关闭')
      this.$emit('close')
    },

    /**
     * @description: 提交券信息
     * @param {*}
     * @return {*}
     */
    submit () {
      this.$refs.activityData.validate(valid => {
        if (!valid) return
        this.formData.activeStatus = this.activeStatus ? 1 : 0
        this.formData.couponNum = this.limitNum ? this.formData.couponNum : -1
        this.formData.achieveAmount = this.formData.achieveAmount !== '' ? parseFloat(this.formData.achieveAmount) : ''
        this.formData.discountAmount = this.formData.discountAmount !== '' ? parseFloat(this.formData.discountAmount) : ''
        this.formData.discountPercent = this.formData.discountPercent !== '' ? parseFloat(this.formData.discountPercent) : ''
        console.log(this.formData)
        if (this.editType == 'add') {
          api.addInfo(this.formData).then(res => {
            this.$emit('submit')
            this.close()
          })
        } else if (this.editType == 'edit') {
          api.updateInfo(this.formData).then(res => {
            this.$emit('submit')
            this.close()
          })
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.active-switch{
  position:absolute;
  top:-30px;
  right:10px
}
 .el-tabs__nav-wrap{
  text-align: center;
}
 .el-tabs__nav-scroll{
  width:240px;
  display: inline-flex;
}
 .el-tabs__nav{
  float: none;
}
 .el-input-group__append, .el-input-group__prepend{
  padding:0 10px;
}
.radio-style{
  padding-left:50px;
  margin-right:40px;
   .el-radio__input {
    line-height:40px;
  }
   .el-radio__label{
    width:66px;
    display: inline-block;
  }
}
</style>
