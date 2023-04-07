<!--
 * @Author: 杨曦
 * @Date: 2021-01-27 16:17:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-23 10:30:27
 * @Version:
 * @Description:
-->
<template>
  <div class="dictionary">
     <el-drawer
      title="模板详情"
      :visible.sync="detailVisible"
      size="900px"
      :before-close="changeClose"
    >
     <div style="padding-left:20px">
      <el-row class="mb10">
        <el-col :span="4" class="_item-name">模板类型：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.programName">{{ruleForm.supplementaryTypeName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">模板名：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.contractName">{{ruleForm.contractName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">模板标题：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.contractTitle">{{ruleForm.contractTitle || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">是否启用：</el-col>
        <el-col :span="8" class="_item-value">
          <span :title="ruleForm.templateStatusName">{{ruleForm.templateStatusName || '无'}}</span>
        </el-col>
        <el-col :span="4" class="_item-name">模板内容：</el-col>
        <el-col :span="20" class="_item-value">
          <el-card class="d2-mt">
            <div style="white-space: pre-wrap;max-height:40vh;overflow-y:auto;padding:0 10px" v-html="ruleForm.contractContent"></div>
          </el-card>
        </el-col>
      </el-row>
       <el-row>
      </el-row>
      <el-button type="danger" @click="delContinual(programId)" v-if="roleInfo.includes(`supplementary_del`)">删除</el-button>
      <el-button type="success" @click="viewContract(ruleForm.contractContent,ruleForm.contractTitle)">预览</el-button>
      <el-button @click="changeClose">取 消</el-button>
      <el-button type="primary" @click="editProgram" v-if="roleInfo.includes(`supplementary_edit`)">编 辑</el-button>
     </div>
    </el-drawer>
    <edit :programId="programId" :visible="visible" @close="editClose()" @submit="editSubmit()" />
  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { downloadFun } from '@/libs/file.js'
import edit from './add_supplementary.vue'
import { mapState } from 'vuex'

export default {
  components: { edit },
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    programId: {

    }
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  data () {
    return {
      ruleForm: {},
      str: '',
      visible: false,
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
  created () {},
  mounted () {

  },
  methods: {
    Topage () {
      api.addSupplementaryInfo(this.programId).then((res) => {
        console.log(res)
        this.ruleForm = res.data
      })
    },
    changeClose () {
      this.$emit('close')
    },
    editProgram () {
      this.visible = true
    },
    editClose () {
      this.visible = false
    },
    delContinual (programId) {
      this.$confirm('此操作将永久删除该模板, 是否继续? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api
          .deleterefSupplementary(programId)
          .then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$emit('del')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    editSubmit () {
      this.visible = false
      this.Topage()
      this.$emit('submit')
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
    }
  }
}
</script>
<style lang='scss'>
.d2-mt p{
 word-break:break-all !important;
}
// .contract-name {
//   display: inline-block;
//   width: 400px;
//   line-height: 100%;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   color: #409EFF;
// }
// .te-yangxi_ipt{
//   display: flex;
// }
// .te-yangxi_ipt .el-form-item__content{
//   display: flex;
// }
</style>
