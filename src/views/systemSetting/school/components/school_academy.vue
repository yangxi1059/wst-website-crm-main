<!--
 * @Author: 库建华
 * @Date: 2020-04-10 16:44:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-28 11:29:03
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      :title="schoolData.chiName + '的学院'"
      :visible.sync="academyVisible"
      width="850px"
      :before-close="close"
    >
      <el-button class="mb10" @click="add">新增</el-button>
      <el-table class="mt10" :data="academyList" size="mini"  border stripe>
        <el-table-column prop="noticeId" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteAcademy(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="chiName" label="中文名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="engName" label="英文名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="instituteSortNo" label="排序" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="学院" :visible.sync="detailVisible" width="550px" :before-close="clone">
      <el-form
        :model="academyData"
        :rules="rules"
        size="mini"
        ref="ruleForm"
        inline
        label-width="135px"
      >
        <el-form-item label="学院名称中文名：" prop="instituteChiName">
          <el-input style="width:350px" v-model="academyData.instituteChiName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="学院名称英文名：" prop="instituteEngName">
          <el-input style="width:350px" v-model="academyData.instituteEngName" maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="instituteSortNo">
          <el-input-number :controls="false" style="width:350px" v-model="academyData.instituteSortNo" :max="999"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clone">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/dictionary'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  props: {
    academyVisible: {
      type: Boolean,
      default: false
    },
    schoolData: {
      type: Object
    }
  },
  data () {
    return {
      academyList: [],
      academyData: {},
      detailVisible: false,
      rules: {
        instituteChiName: [{ required: true, message: '必填', trigger: 'blur' }],
        instituteEngName: [{ required: true, message: '必填', trigger: 'blur' }],
        instituteSortNo: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    academyVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      this.$loading()
      api
        .getAcademyBySchoolId(this.schoolData.schoolId)
        .then(res => {
          console.log(res)
          this.academyList = res.data
          this.$loading().close()
        })
    },
    add () {
      this.detailVisible = true
      this.academyData = {
        schoolId: this.schoolData.schoolId
      }
    },
    edit (academyData) {
      console.log(academyData)
      this.academyData = academyData
      this.detailVisible = true
    },
    deleteAcademy (academyDate) {
      this.$confirm('此操作将永久删除该学院, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delAcademy(academyDate.instituteId).then(res => {
          console.log(res)
          this.initPage()
          this.clone()
        })
      })
    },
    close () {
      this.$emit('close')
    },
    clone () {
      this.detailVisible = false
      this.academyData = {}
    },
    submit () {
      console.log(this.academyData)
      if (this.academyData.instituteId) {
        api.uptAcademy(this.academyData).then(res => {
          console.log(res)
          this.initPage()
          this.clone()
        })
      } else {
        api.addAcademy(this.academyData).then(res => {
          console.log(res)
          this.initPage()
          this.clone()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
