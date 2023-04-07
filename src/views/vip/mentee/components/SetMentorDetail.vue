<!--
 * @Author: kaan
 * @Date: 2021-12-07 16:15:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-11 10:05:46
 * @Version:
 * @Description:
-->
<template>
  <el-dialog
    :title="`${mentorTypeName}配置【此导师可分配最大课时数：${canUsedTotalHours}】`"
    v-if="mentorDetailVisible"
    :visible.sync="mentorDetailVisible"
    append-to-body
    width="450px"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="mentorInfo" label-width="110px" :model="mentorList" :rules="rules">
       <el-form-item label="导师名:" v-if="editType =='add'">
        <el-autocomplete
          :style="{width:widths}"
          v-model="searchName"
          :fetch-suggestions="querySearchAsync"
          placeholder="注意名字中间空格"
          @select="monterSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="导师名:"  v-if="editType =='edit'">
        <span>{{mentorList.mentorName}}</span>
      </el-form-item>
      <el-form-item label="课时数:" prop="totalHour">
        <el-input-number class="mr20" :style="{width:widths}" v-model="mentorList.totalHour" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="country:" v-if="lessonType == '1'">
        <el-select
          :style="{width:widths}"
          v-model="mentorList.country"
          filterable
          clearable
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(country,i) in mentorList.mentorCountryArr"
            :key="i"
            :label="country.itemName"
            :value="country.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="track:" v-if="lessonType == '1'">
        <el-select
          :style="{width:widths}"
          v-model="mentorList.track"
          filterable
          multiple
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(track,i) in mentorList.mentorTrackArr"
            :key="i"
            :label="track.itemName"
            :value="track.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" >
        <el-input  :style="{width:widths}" type="textarea" v-model="mentorList.remark" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button class="mentor_submit_btn" @click="delMentor()" type="danger">删除</el-button>
        <el-button @click="close">取 消</el-button>
        <el-button class="mentor_submit_btn" @click="saveList()" type="primary">提交</el-button>
      </span>
  </el-dialog>
</template>

<script>
import api from '@/api/vip'
import mixins from '@/plugin/mixins'
export default {
  mixins: [
    mixins
  ],
  props: {
    mentorDetailVisible: {
      type: Boolean,
      default: false
    },
    lessonType: {},
    mentorDetailData: {}
  },
  data () {
    var validHours = (rule, value, callback) => {
      if (value > this.canUsedTotalHours) {
        return callback(new Error('该导师课时总数不可超过分配课时数'))
      } else {
        callback()
      }
    }
    return {
      editType: '',
      widths: '250px',
      mentorTypeName: '',
      canUsedTotalHours: '',
      mentorList: {},
      searchName: '',
      rules: {
        totalHour: [{ required: true, message: '必填', trigger: 'blur' },
          { validator: validHours, trigger: 'blur' }]
      }
    }
  },
  watch: {
    mentorDetailVisible: function (val) {
      if (val) {
        this.mentorDetailData.mentorId == undefined ? this.editType = 'add' : this.editType = 'edit'
        this.mentorList = JSON.parse(JSON.stringify(this.mentorDetailData))
        this.mentorTypeName = this.editType == 'edit' ? this.mentorDetailData.mentorTypeName : '新增导师'
        this.canUsedTotalHours = this.mentorDetailData.canUsedTotalHours
        console.log(this.mentorList)
      }
    }
  },
  methods: {
    /**
     * @description: 新增筛选导师下拉选
     * @param {*} queryString
     * @param {*} cb
     * @return {*}
     */
    querySearchAsync (queryString, cb) {
      let businessType = ''
      switch (this.lessonType) {
        case '1':
          businessType = 'mentor_career'
          break
        case '3':
          businessType = 'mentor_oral'
          break
        case '4':
          businessType = 'mentor_tutoring'
          break
        case 'finance_lesson':
          businessType = 'mentor_finance'
          break
        case 'psychology_lesson':
          businessType = 'psychology'
          break
        case 'human_resource_lesson':
          businessType = 'human_resource'
          break
      }
      const params = {
        mentorName: queryString,
        businessType: businessType
      }
      api.searchMentorByMentorName(params).then(res => {
        if (res.code == '200') {
          res.data.forEach(v => {
            v.value = v.mentorName
            v.totalHour = 0
          })
          cb(res.data)
          res.data.length > 0 ? this.monterSelect(res.data[0]) : ''
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    /**
     * @description: 新增下拉选选择导师
     * @param {*} item
     * @return {*}
     */
    monterSelect (item) {
      this.mentorList = item
      this.mentorList.country = []
      this.mentorList.track = []
    },
    /**
     * @description: 保存导师信息
     * @param {*}
     * @return {*}
     */
    saveList () {
      this.$refs.mentorInfo.validate(valid => {
        if (!valid) return
        console.log(this.mentorList)
        let businessType = ''
        switch (this.lessonType) {
          case '1':
            businessType = 'mentor_career'
            break
          case '3':
            businessType = 'mentor_oral'
            break
          case '4':
            businessType = 'mentor_tutoring'
            break
          case 'finance_lesson':
            businessType = 'mentor_finance'
            break
          case 'psychology_lesson':
            businessType = 'psychology'
            break
          case 'human_resource_lesson':
            businessType = 'human_resource'
            break
        }
        const mentor = {
          signId: this.$route.query.signId,
          mentorId: this.mentorList.mentorId,
          track: JSON.stringify(this.mentorList.track),
          country: JSON.stringify(this.mentorList.country),
          signLesson: this.mentorList.totalHour || 0,
          remark: this.mentorList.remark,
          businessType: businessType
        }
        if (this.editType == 'add') {
          // 新增导师
          this.$loading()
          api.addMentor(mentor).then(res => {
            this.$loading().close()
            console.log('新增行业导师', res)
            if (res.code == '200') {
              this.$message({ type: 'success', message: '新增成功' })
              this.clear()
              this.$emit('submit')
            } else {
              this.$message({ type: 'warning', message: res.message })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (this.editType == 'edit') {
          // 编辑导师
          mentor.pkId = this.mentorList.pkId
          this.$loading()
          api.updateMentor(mentor).then(res => {
            this.$loading().close()
            console.log('更新行业导师', res)
            if (res.code == '200') {
              this.$message({ type: 'success', message: '更新成功' })
              this.clear()
              this.$emit('submit')
            } else {
              this.$message({ type: 'warning', message: res.message })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    /**
     * @description: 删除导师
     * @param {*} i
     * @return {*}
     */
    delMentor () {
      this.$confirm('此操作将删除该导师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading()
        if (this.mentorList.pkId) {
          api.delMentor({ pkId: this.mentorList.pkId }).then(res => {
            this.$loading().close()
            if (res.code == '200') {
              this.$message({ type: 'success', message: '删除成功' })
              this.clear()
              this.$emit('submit')
            } else {
              this.$message({ type: 'warning', message: res.message })
            }
          })
        }
      })
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style scoped>

</style>
