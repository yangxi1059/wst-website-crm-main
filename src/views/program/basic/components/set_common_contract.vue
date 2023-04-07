<!--
 * @Author: kaan
 * @Date: 2021-10-20 15:14:15
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 13:58:52
 * @Version:
 * @Description: 公共模板新增/编辑
-->

<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="contractData.pkId ? `公共模板编辑`:`公共模板新增`"
      :visible.sync="setContractVisible"
      :before-close="close"
      width="1000px"
    >
      <el-form
        :model="cacheContractData"
        :rules="rules"
        size="medium"
        ref="cacheContractData"
        label-width="140px"
      >
        <el-form-item label="选择合同时的名称：">
          <el-input
            v-model="cacheContractData.contractName"
            :style="{width:'250px'}"
            maxlength="99"
            placeholder="如：有礼物，无实习..."
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="合同标题：" label-width="140px">
          <el-input
            v-model="cacheContractData.contractTitle"
            :style="{width:'800px'}"
            maxlength="99"
            placeholder="签约的合同上的标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch
            v-model="cacheContractData.contractStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="标签：">
           <el-select
            v-model="contractTag"
            :style="{width:'250px'}"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择模板标签"
          >
            <el-option
              v-for="item in tagList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="合同正文内容：">
          <ckeditor
            ref="ck"
            :style="{'width':'800px'}"
            :config="editorConfig"
            v-model="cacheContractData.contractContent"
          ></ckeditor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          @click="previewContract(cacheContractData.contractContent,cacheContractData.contractTitle)"
        >预 览</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
        <el-button type="danger" v-if="contractData.pkId" @click="deleteContract">删 除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { downloadFun } from '@/libs/file.js'
export default {
  name: 'set-common-contract',
  mixins: [mixins],
  props: {
    setContractVisible: {
      type: Boolean,
      default: false
    },
    contractData: {
      type: Object
    },
    programType: {
      type: String,
      default: ''
    },
    contractTagList: {
      type: Array,
      default: ''
    }
  },
  data () {
    return {
      tagList: [],
      contractTag: [],
      cacheContractData: {},
      rules: {},
      editorConfig: {
        toolbar: [
          ['Bold', 'Italic'],
          ['Undo', 'Redo'],
          ['Source'],
          ['Maximize']
        ]
      }
    }
  },
  mounted () {},
  watch: {
    setContractVisible: function (val) {
      if (val) {
        this.$loading()
        if (this.contractData.pkId) {
          this.initPage()
        } else {
          this.$loading().close()
        }
        this.tagList = this.contractTagList
      }
    }
  },
  methods: {
    initPage () {
      console.log(this.contractData, 'contractData')
      api.getCommonContract(this.contractData.pkId).then(res => {
        console.log('获取公共项目合同模板详情:', res)
        this.cacheContractData = res.data
        res.data.tagList.forEach(u => {
          this.contractTag.push(u.contractTag)
        })
        this.$loading().close()
      })
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.contractTag = []
      this.cacheContractData = {}
    },
    submit () {
      this.cacheContractData.programType = this.programType
      this.cacheContractData.tagList = []
      this.contractTag.forEach(u => {
        this.cacheContractData.tagList.push({ contractTag: u })
      })
      this.cacheContractData.programId = this.contractData.programId
      console.log(this.cacheContractData)
      if (this.cacheContractData.pkId) {
        // 编辑公共模板
        api.editCommonContract(this.cacheContractData).then(() => {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.clear()
          this.$emit('submit')
        })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      } else {
        // 新增公共模板
        api.addCommonContract(this.cacheContractData).then(() => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.clear()
          this.$emit('submit')
        })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      }
    },
    // 编辑-预览
    previewContract (contractContent, contractTitle) {
      if (!contractTitle || !contractContent) {
        this.$message({
          type: 'warning',
          message: '合同标题与正文必填！'
        })
        return
      }
      this.$refs.cacheContractData.validate(valid => {
        if (!valid) return
        this.viewContract(contractContent, contractTitle)
      })
    },
    deleteContract () {
      this.$confirm('是否确认删除该公共模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteCommonContract(this.contractData.pkId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('submit')
        })
      }).catch(() => {})
    },
    // 详情-预览
    viewContract (contractContent, contractTitle) {
      const submitData = {
        contractContent: contractContent,
        contractTitle: contractTitle
      }
      console.log(submitData)
      api
        .previewContract(submitData)
        .then(res => {
          console.log(res)
          downloadFun(res.data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
