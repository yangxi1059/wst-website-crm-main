<!--
 * @Author: 库建华
 * @Date: 2019-12-16 15:20:13
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-24 17:46:43
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-drawer
      title="分配实习"
      :visible.sync="searchMenteeListVisible"
      size="80%"
      :before-close="menteeListClose"
    >
      <div class="mb20" style="margin-left:20px">
        <el-input
          class="mr10"
          size="mini"
          style="width:200px"
          v-model="menteeName"
          clearable
          placeholder="仅支持学员全名，注意空格"
          @keyup.enter.native="getMenteeListByMenteeName()"
          :style="{width:'260px'}"
        ></el-input>
        <el-button
          icon="el-icon-edit-outline"
          class="mr10 ml10"
          size="mini"
          plain
          @click="getMenteeListByMenteeName()"
        >查询</el-button>
      </div>
      <template>
        <el-table
          :data="menteeList"
          stripe
          style="width: 100%">
          <el-table-column
            label="操作"
           >
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.signInternshipStatus == 0 && scope.row.endFlag != '1'" @click="chooseMentee(scope.row)" type="primary">安排实习</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="realName"
            label="学员名">
          </el-table-column>
          <el-table-column
            prop="wxId"
            label="学员微信">
          </el-table-column>
          <!-- <el-table-column
            prop="menteeId"
            label="学员ID">
          </el-table-column> -->
          <el-table-column
            prop="signDate"
            label="签约日期">
          </el-table-column>
          <el-table-column
            prop="internshipDesc"
            label="实习单位">
          </el-table-column>
          <el-table-column
            prop="internshipName"
            width="140"
            label="实习">
          </el-table-column>
          <el-table-column
            prop="internshipLocationName"
            label="远程/实地">
          </el-table-column>
          <el-table-column
            prop="internshipTimeName"
            label="实习周期">
          </el-table-column>
          <el-table-column
            prop="internshipStartDate"
            label="实习开始日期">
          </el-table-column>
          <el-table-column
            prop="internshipEndDate"
            label="实习结束日期">
          </el-table-column>
          <el-table-column
            prop="endFlagName"
            label="项目状态">
          </el-table-column>
          <el-table-column
            label="是否安排实习">
              <template slot-scope="scope">
                <div v-if="scope.row.signInternshipStatus == 1">已安排</div>
                <div v-else>未安排</div>
              </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- <el-row v-for="(mentee,i) in menteeList" :key="mentee.menteeId"> -->
        <!-- <el-col :span="2">
          <el-button size="mini" @click="chooseMentee(i)" type="primary">选择</el-button>
        </el-col> -->
        <!-- <el-col :span="2" class="_item-name">学员姓名</el-col>
        <el-col :span="3" class="_item-value">{{mentee.menteeInfo.realName}}</el-col>
        <el-col :span="2" class="_item-name">微信ID</el-col>
        <el-col :span="3" class="_item-value">{{mentee.menteeInfo.wxId}}</el-col>
        <el-col :span="2" class="_item-name">学员ID</el-col>
        <el-col :span="4" class="_item-value">{{mentee.menteeInfo.menteeId}}</el-col> -->
      <!-- </el-row> -->
    </el-drawer>
     <setInternship
      :setInternshipVisible="setInternshipVisible"
      :internshipData="internshipData"
      @close="setInternshipClose"
      @submit="setInternshipSubmit"
    />
  </div>
</template>

<script>
import setInternship from './SetInternship.vue'

import api from '@/api/vip.js'
export default {
  name: 'MenteeList',
  components: {
    setInternship
  },
  props: {
    searchMenteeListVisible: {
      type: Boolean,
      default: false
    },
    toMenteeListInternshipId: {
      type: String
    }
  },
  data () {
    return {
      menteeInternshipList: [],
      signId: '',
      menteeName: '',
      menteeList: [],
      setInternshipVisible: false,
      internshipData: {}
    }
  },
  mounted () {
  },
  methods: {
    chooseMentee: function (row) {
      console.log(row, 'uxuxuxuxux')
      let data = ''
      if (row.internship == this.toMenteeListInternshipId) {
        data = row.internshipId
      } else {
        data = ''
      }
      this.internshipData = {
        internship: this.toMenteeListInternshipId,
        signId: row.signId,
        internshipId: data,
        internshipStartDate: row.internshipStartDate,
        internshipEndDate: row.internshipEndDate
      }
      this.setInternshipVisible = true
      console.log(this.internshipData, 'yx111111111111')
    },
    menteeListClose () {
      this.menteeName = ''
      this.menteeList = []
      this.$emit('close')
    },
    getMenteeListByMenteeName () {
      api.getMenteeListByMenteeName(this.menteeName).then(res => {
        console.log(res.data)
        if (res.data.length <= 0) {
          this.$message({
            type: 'warning',
            message: '无该姓名学员，请检查'
          })
        } else {
          this.menteeList = res.data
        }
      })
    },
    setInternshipClose () {
      this.setInternshipVisible = false
    },
    setInternshipSubmit () {
      this.setInternshipClose()
      this.$emit('submit')
      this.menteeName = ''
      this.menteeList = []
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
