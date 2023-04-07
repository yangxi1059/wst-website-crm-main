/* eslint-disable quotes */
<!--
 * @Author: 库建华
 * @Date: 2020-07-08 15:03:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 18:03:18
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="cacheContractData.pkId?'编辑项目合同模板':'新增项目合同模板'"
      :visible.sync="detailContractVisible"
      :before-close="close"
      width="600px"
    >
      <el-form
        :model="cacheContractData"
        size="medium"
        ref="ruleForm"
        :rules="rules"
        inline
        label-width="140px"
      >
        <el-form-item label="模板的名称：" prop="templateName">
          <el-input
            v-model="cacheContractData.templateName"
            :style="{width:'250px'}"
            maxlength="99"
            placeholder="如：有礼物，无实习..."
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="模板状态" prop="templateStatus">
            <el-select :style="{width:'250px'}" v-model="cacheContractData.templateStatus" placeholder="请选择">
                <el-option
                v-for="item in programStatus"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue">
                </el-option>
            </el-select>
        </el-form-item>
        <br>
        <el-form-item label="材料、凭证">
          <el-upload
            action
            class="upload-btn"
            ref="upload1"
            :limit=1
            :multiple="false"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="change"
            :style="{width:'200px'}"
          >
            <el-button class="el-icon-upload" slot="trigger" size="mini" type="success" plain>选取文件</el-button>
            <div slot="tip" class="el-upload__tip" style="line-height:18px;color:#F56C6C">只能上传docx文件</div>
          </el-upload>
        </el-form-item>
        <br>
         <el-form-item v-if="fileList.length <= 0 && cacheContractData.filePath" label="已上传的凭证" >
        <el-button
            type="primary"
            plain
            size="mini"
            @click="viewContract(cacheContractData.filePath)"
        >预览</el-button>
        </el-form-item>
        <br>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { uploadFunBySys, downloadFun } from '@/libs/file'

export default {
  name: 'set-contract',
  mixins: [mixins],
  props: {
    detailContractVisible: {
      type: Boolean,
      default: false
    },
    contractData: {
      type: Object
    }
  },
  data () {
    return {
      cacheContractData: {
        programId: '',
        templateName: '',
        templateStatus: '',
        filePath: ''
      },
      programStatus: [
        { itemName: '可用', itemValue: '1' },
        { itemName: '禁用', itemValue: '0' }
      ],
      fileList: [],
      rules: {
        templateName: [{ required: true, message: '必填', trigger: 'blur' }],
        templateStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted () {},
  watch: {
    detailContractVisible: function (val) {
      console.log(val)
      if (val) {
        this.$loading()
        if (this.contractData.pkId) {
          this.initPage()
        } else {
          this.$loading().close()
        }
      }
    }
  },
  methods: {
    initPage () {
      console.log(this.contractData, 'contractData')
      api.getContract(this.contractData.pkId).then(res => {
        console.log(res.data, 'res')
        this.cacheContractData = res.data
        // this.contractContent = this.cacheContractData.contractContent;
        this.$loading().close()
      })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.fileList = []
      this.cacheContractData = {
        programId: '',
        templateName: '',
        templateStatus: '',
        filePath: ''
      }
    },
    change (file, fileList) {
      if (file.name.includes('.docx')) {
        console.log(file, fileList)
        this.fileList = fileList
      } else {
        this.$message.error('请上传.docx的文件')
        this.fileList = []
      }
    },
    submit () {
      // this.cacheContractData.contractContent = this.contractContent;
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid)
        if (!valid) {
          return false
        } else {
          console.log(this.cacheContractData, this.fileList.length, this.cacheContractData.filePath)
          if (this.fileList.length || this.cacheContractData.filePath) {
            this.cacheContractData.programId = this.contractData.programId
            if (this.fileList.length) {
              for (let i = this.fileList.length - 1; i >= 0; i--) {
                const file = this.fileList[i]
                console.log(file, 'yx11111111111111111')
                if (file.name) {
                  uploadFunBySys(file.raw, 'voucher/overtime', url => {
                    console.log(url)
                    this.cacheContractData.filePath = url
                    if (this.cacheContractData.pkId) {
                      this.cacheContractData.programId = this.contractData.programId
                      api
                        .newUptContract(this.cacheContractData)
                        .then(() => {
                          this.$message({
                            type: 'success',
                            message: '更新成功'
                          })
                          this.$emit('submit')
                          this.clear()
                        })
                        .catch(err => {
                          this.$message({
                            type: 'error',
                            message: err
                          })
                        })
                    } else {
                      console.log(this.cacheContractData)
                      api
                        .addProgramContract(this.cacheContractData)
                        .then(() => {
                          this.$message({
                            type: 'success',
                            message: '新增成功'
                          })
                          this.$emit('submit')
                          this.clear()
                        })
                        .catch(err => {
                          this.$message({
                            type: 'error',
                            message: err
                          })
                        })
                    }
                  })
                }
              }
            } else {
              if (this.cacheContractData.pkId) {
                this.cacheContractData.programId = this.contractData.programId
                api
                  .newUptContract(this.cacheContractData)
                  .then(() => {
                    this.$message({
                      type: 'success',
                      message: '更新成功'
                    })
                    this.$emit('submit')
                    this.clear()
                  })
                  .catch(err => {
                    this.$message({
                      type: 'error',
                      message: err
                    })
                  })
              } else {
                console.log(this.cacheContractData)
                api
                  .addProgramContract(this.cacheContractData)
                  .then(() => {
                    this.$message({
                      type: 'success',
                      message: '新增成功'
                    })
                    this.$emit('submit')
                    this.clear()
                  })
                  .catch(err => {
                    this.$message({
                      type: 'error',
                      message: err
                    })
                  })
              }
            }
          } else {
            this.$message('文件不能为空')
            return false
          }
        }
      })
    },
    // 详情-预览
    viewContract (filePath) {
      downloadFun(filePath, (url) => {
        window.open(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
