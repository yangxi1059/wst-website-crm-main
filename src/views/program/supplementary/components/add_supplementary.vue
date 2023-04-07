<!--
 * @Author: 杨曦
 * @Date: 2021-01-27 16:17:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-23 10:27:43
 * @Version:
 * @Description:
-->
<template>
  <div class="dictionary">
     <el-dialog :close-on-click-modal="false" :title="programId?'编辑补充协议模板':'新增补充协议模板'" :visible.sync="visible" width="830px" :before-close="clone">
      <el-form
        :model="ruleForm"
        :rules="rules"
        size="medium"
        ref="ruleForm"
        inline
        label-width="120px"
      >
        <el-form-item label="协议类型：" prop="supplementaryType">
          <el-select :style="{width:'240px'}" v-model="ruleForm.supplementaryType" placeholder="请选择">
            <el-option
              v-for="item in order_supplementary_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议名称:" prop="contractName">
          <el-input :style="{width:'240px'}"  v-model="ruleForm.contractName"></el-input>
        </el-form-item>
        <el-form-item label="协议标题：" prop="contractTitle">
          <el-input :style="{width:'240px'}" v-model="ruleForm.contractTitle"></el-input>
        </el-form-item>
        <el-form-item label="协议状态：" prop="templateStatus">
          <el-select :style="{width:'240px'}" v-model="ruleForm.templateStatus" placeholder="请选择">
            <el-option
              v-for="item in templateStatusList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议条款内容："  prop="contractContent">
            <ckeditor
                :style="{'width':'610px'}"
                :config="editorConfig"
                v-model="ruleForm.contractContent"
            ></ckeditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="viewContract(ruleForm.contractContent,ruleForm.contractTitle)">预 览</el-button>
        <el-button @click="clone">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { downloadFun } from '@/libs/file.js'
import { mapState } from 'vuex'

export default {
  components: { },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mixins: [mixins],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    programId: {

    }

  },
  watch: {
    visible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  data () {
    return {
      editorConfig: {
        toolbar: [
          ['Bold', 'Italic'],
          ['Undo', 'Redo'],
          ['Source'],
          ['Maximize']
        ]
      },
      order_supplementary_type: [],
      templateStatusList: [
        { itemName: '启用', itemValue: '1' },
        { itemName: '禁用', itemValue: '0' }
      ],
      ruleForm: {

      },
      rules: {
        supplementaryType: [{ required: true, message: '必填', trigger: 'blur' }],
        contractName: [{ required: true, message: '必填', trigger: 'blur' }],
        contractTitle: [{ required: true, message: '必填', trigger: 'blur' }],
        templateStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        contractContent: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      setContractVisible: false,
      contractData: {}
    }
  },
  created () {},
  mounted () {

  },
  methods: {
    Topage () {
      if (this.programId) {
        api.addSupplementaryInfo(this.programId).then((res) => {
          console.log(res)
          this.ruleForm = res.data
        })
      } else {
        this.ruleForm = {}
      }
      api.getDicDropdown(
        'order_supplementary_type,gporder_supplementary_type,common_order_supplementary_type'
      ).then((res) => {
        console.log(res.data)
        const typeArr = res.data.order_supplementary_type.concat(res.data.gporder_supplementary_type).concat(res.data.common_order_supplementary_type)
        this.order_supplementary_type = this.distinct(typeArr)
      })
    },
    distinct (arr) {
      const newArr = []
      arr.forEach(function (item) {
        let hasPush = false
        newArr.forEach((item2, index, thisArr) => {
          if (item.itemValue == item2.itemValue) {
            hasPush = true
            thisArr[index] = { ...item, ...item2 }
          }
        })
        !hasPush && newArr.push(item)
      })
      return newArr
    },
    viewContract (contractContent, contractTitle) {
      const submitData = {
        contractContent: contractContent,
        contractTitle: contractTitle,
        programId: this.ruleForm.programId,
        supplementaryTypeName: this.ruleForm.supplementaryTypeName,
        contractName: this.ruleForm.contractName
      }
      console.log(submitData)
      api
        .previewContract(submitData)
        .then((res) => {
          console.log(res)
          downloadFun(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        if (!this.programId) {
          const submitData = {
            supplementaryType: this.ruleForm.supplementaryType,
            contractName: this.ruleForm.contractName,
            contractTitle: this.ruleForm.contractTitle,
            templateStatus: this.ruleForm.templateStatus,
            contractContent: this.ruleForm.contractContent
          }
          console.log(submitData)
          this.$loading()
          api
            .addSupplementary(submitData)
            .then((res) => {
              this.$emit('submit')
              this.$loading().close()
              console.log(res)
              this.clone()
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          const submitData = {
            pkId: this.programId,
            supplementaryType: this.ruleForm.supplementaryType,
            contractName: this.ruleForm.contractName,
            contractTitle: this.ruleForm.contractTitle,
            templateStatus: this.ruleForm.templateStatus,
            contractContent: this.ruleForm.contractContent
          }
          console.log(submitData)
          this.$loading()
          api
            .editSupplementary(submitData)
            .then((res) => {
              this.$emit('submit')
              this.$loading().close()
              console.log(res)
              this.clone()
            })
            .catch((err) => {
              console.log(err)
            })
          console.log(32131)
        }
      })
    },
    clone () {
      this.$emit('close')
      this.ruleForm = {}
      this.$refs.ruleForm.resetFields()
    },
    editContract (contract) {
      this.contractData = { ...contract }
      this.setContractVisible = true
    },
    setContractClose () {
      this.setContractVisible = false
    },
    setContractSubmit () {
      this.Topage()
      this.setContractClose()
    }
  }
}
</script>
<style lang='scss'>
.contract-name {
  display: inline-block;
  width: 400px;
  line-height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #409EFF;
}
.te-yangxi_ipt{
  display: flex;
}
.te-yangxi_ipt .el-form-item__content{
  display: flex;
}
</style>
