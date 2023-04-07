<!--
 * @Author: 杨曦
 * @Date: 2020-09-28 14:22:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-14 15:41:31
 * @Version:
 * @Description:
-->
<template>
    <el-dialog :close-on-click-modal="false" title="核验" :visible.sync="checkVisible" width="600px" :before-close="close">
        <el-form
            size="mini"
            :rules="rules"
            ref="submitData"
            :model="submitData"
            label-width="160px"
        >
            <el-form-item label="核验状态" prop="passStatus">
                <el-select v-model="submitData.passStatus" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in checkList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拒绝理由" prop="refuseReason" v-if="submitData.passStatus == '0'" >
                <el-input  v-model="submitData.refuseReason" type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                maxlength="200"
                show-word-limit
                placeholder="请输入拒绝理由">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="close">关 闭</el-button>
            <el-button @click="submit" type="primary">核 验</el-button>
        </span>
        </el-dialog>
</template>

<script>
import api from '@/api/sales_assistant'

export default {
  name: 'detailSaleKpi',
  props: {
    checkVisible: {
      type: Boolean,
      default: false
    },
    pkId: {
    },
    type: {}
  },
  watch: {
    checkVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  data () {
    return {
      rules: {
        passStatus: [{ required: true, message: '必选', trigger: 'blur' }],
        refuseReason: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      checkList: [
        { itemName: '通过', itemValue: '1' },
        { itemName: '不通过', itemValue: '0' }
      ],
      submitData: {
        pkId: '',
        passStatus: '',
        refuseReason: ''
      }
    }
  },
  methods: {
    initPage () {

    },
    close () {
      this.clear()
      this.$emit('close')
    },
    submit () {
      this.$refs.submitData.validate((valid) => {
        if (!valid) return
        this.submitData.pkId = this.pkId
        const data = this.submitData
        console.log(data, 'yx提交**********************')
        if (this.type) {
          api.checkEffectiveConsulting(data).then(res => {
            this.$message({
              message: '核验成功',
              type: 'success'
            })
            console.log(res)
            this.$emit('submit')
            this.clear()
          })
        } else {
          api.spyDeleteConsulting(data).then(res => {
            this.$message({
              message: '核验成功',
              type: 'success'
            })
            console.log(res)
            this.$emit('submit')
            this.clear()
          })
        }
      })
    },
    clear () {
      this.submitData = {
        pkId: '',
        passStatus: '',
        refuseReason: ''
      }
    }
  }
}
</script>
<style  scoped>
    .weightFont{
        font-weight: 700;
    }
</style>
