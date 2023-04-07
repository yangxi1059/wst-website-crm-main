<!--
 * @Author: 库建华
 * @Date: 2020-05-26 09:40:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-11 13:55:52
 * @Version: 1
 * @Description:
-->
<template>
  <div>
  <el-dialog :close-on-click-modal="false"
    title="新增规格"
    :visible.sync="addNewtVisible"
    width="1050px"
    :before-close="addNewClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      inline
      label-width="240px"
    >
      <el-form-item label="规格名：" prop="specName">
        <el-input :style="{width:'180px'}" maxlength="20" show-word-limit v-model="ruleForm.specName" ></el-input>
      </el-form-item>
      <el-form-item label="是否启用：" prop="specStatus">
        <el-select
          :style="{width:'180px'}"
          v-model="ruleForm.specStatus"
          filterable
          placeholder="请选择是否启用"
        >
          <el-option
          v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
          :key="item.itemValue"
          :label="item.itemName"
          :value="item.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业导师一对一（合计）：" prop="mentorHour">
        <el-input-number :style="{width:'180px'}" v-model="ruleForm.mentorHour" :controls="false" size="mini" :min="0" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="项目延长(month)：" prop="period">
        <el-input-number :style="{width:'180px'}" v-model="ruleForm.period" :controls="false" size="mini" :min="0" :max="100"></el-input-number>
      </el-form-item>
      <!-- <div style="display:flex">
        <el-form-item label="Live Lessons（新）：" prop="liveLesson">
          <input-number v-model="ruleForm.liveLesson"></input-number>
        </el-form-item>
        <el-form-item class="te-yangxi_ipt" style="display:flex" label="1对多Office Hour：（次/月）"  prop="oneOnOneHour">
          <input-number class="" style="display:flex" v-model="ruleForm.oneOnOneHour"></input-number>
        </el-form-item>
      </div> -->
      <!-- <el-form-item label="系列课课时数：" prop="seriesHour">
        <input-number v-model="ruleForm.seriesHour"></input-number>
      </el-form-item> -->
      <el-form-item label="价格(USD)：" prop="priceUsd">
        <el-input :style="{width:'180px'}" v-model="ruleForm.priceUsd"></el-input>
      </el-form-item>
      <el-form-item label="价格(RMB)：" prop="priceCny">
        <el-input :style="{width:'180px'}" v-model="ruleForm.priceCny"></el-input>
      </el-form-item>
      <!-- <el-form-item label="项目价格类型：" prop="currencyType">
        <el-select
          :style="{width:'180px'}"
          v-model="ruleForm.currencyType"
          filterable
          placeholder="请选择价格类型"
        >
          <el-option
          v-for="item in [{itemName:'美金',itemValue:'usd'},{itemName:'人民币',itemValue:'cny'}]"
          :key="item.itemValue"
          :label="item.itemName"
          :value="item.itemValue"
          ></el-option>
        </el-select>
      </el-form-item> -->
      
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addNewClose">取 消</el-button>
    <el-button type="primary" @click="addNewItemSubmit">提 交</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import inputNumber from '@/components/input_number.vue'
import api from '@/api/dictionary'

export default {
  name: 'addNew',
  components: { inputNumber },
  props: {
    addNewtVisible: {
      type: Boolean,
      default: false
    },
    contractData: {
      type: Object
    },
    programId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ruleForm: {
        specName: '',
        mentorHour: null,
        period: null,
        // seriesHour: null,
        // liveLesson: null,
        // oneOnOneHour: null,
        priceUsd: null,
        priceCny: null,
        // currencyType: null,
        specStatus: ''
      },
      contractDataNew: {},
      rules: {
        specName: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorHour: [{ required: true, message: '必填', trigger: 'blur' }],
        period: [{ required: true, message: '必填', trigger: 'blur' }],
        // seriesHour: [{ required: true, message: '必填', trigger: 'blur' }],
        // liveLesson: [{ required: true, message: '必填', trigger: 'blur' }],
        // oneOnOneHour: [{ required: true, message: '必填', trigger: 'blur' }],
        priceUsd: [{ required: true, message: '必填', trigger: 'blur' }],
        priceCny: [{ required: true, message: '必填', trigger: 'blur' }],
        // currencyType: [{ required: true, message: '必填', trigger: 'blur' }],
        specStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    addNewtVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      // this.contractDataNew = JSON.parse(JSON.stringify(this.contractData))
      // this.ruleForm = {
      //   specName: '',
      //   mentorHour: this.contractDataNew.mentorHour,
      //   seriesHour: this.contractDataNew.seriesHour,
      //   liveLesson: this.contractDataNew.liveLesson,
      //   oneOnOneHour: this.contractDataNew.oneOnOneHour,
      //   priceUsd: this.contractDataNew.priceUsd,
      //   priceCny: this.contractDataNew.priceCny,
      //   currencyType: this.contractDataNew.currencyType,
      //   specStatus: ''
      // }
      // console.log(this.ruleForm)
    },
    clear () {
      this.contractDataNew = {}
      this.ruleForm = {
        specName: '',
        mentorHour: null,
        period: null,
        // seriesHour: null,
        // liveLesson: null,
        // oneOnOneHour: null,
        priceUsd: null,
        priceCny: null,
        // currencyType: null,
        specStatus: ''
      }
    },
    addNewItemSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        // this.ruleForm.programId = this.programId
        this.$loading()
        api.addSpec(this.ruleForm).then(res => {
          this.clear()
          this.$loading().close()
          this.$message.success('新增成功')
          this.$emit('submit')
        })
      })
    },
    addNewClose () {
      this.clear()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .contract-name {
    display: inline-block;
    width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .te-yangxi_ipt{
    display: flex;
  }
  .te-yangxi_ipt .el-form-item__content{
    display: flex;
  }
  .drawer_container{
    padding:0 20px;
    .drawer_footer{
      padding: 20px;
      padding-top: 10px;
      text-align: right;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
</style>
