<!--
 * @Author: 杨曦
 * @Date: 2022-08-15 10:57:33
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-02 17:00:36
 * @Version:
 * @Description:
-->
<template>
  <div >
    <el-dialog title="创建对接任务" :append-to-body="true" :close-on-click-modal="false" :visible.sync="useDockingVisible" width="600px" :before-close="close">
      <el-steps class="mb20" :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
      </el-steps>
      <div v-if="active == 0">
        <el-form     size="mini">
          <el-form-item  label="导师名:">
            <el-input style="width:200px" placeholder="请输入内容" clearable v-model="forData.mentorName">
                <el-button slot="append" @click="next" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="mt20">
          <el-tag size="small" v-if="mentorList.length > 0">查询后的导师列表</el-tag>
          <el-tag size="small" type="danger" v-else>暂无查重导师</el-tag>
          <div class="mentorBlock" v-for="(item,i) in mentorList" :key="i">
            <div class="mentorBlock_item">导师名：{{item.mentorName}}</div>
            <div class="mentorBlock_item">微信ID：{{item.wxId}}</div>
          </div>
        </div>
        <div style="text-align:right">
          <el-button type="success" size="mini" v-if="status" @click="toCreate()">继续创建</el-button>
        </div>
      </div>
      <el-form v-if="active == 1"  label-width="100px" :rules="rules" size="mini" :model="forData" ref="tableValidate">
        <el-form-item prop="mentorName" label="导师名：">
            <el-input style="width:200px" placeholder="请输入内容" :disabled="true" v-model="forData.mentorName"></el-input>
        </el-form-item>
        <el-form-item  label="推荐导师：">
          {{forData.referrerName}}
            <el-button type="primary" @click="mentorListVisible = true">
              <span class="el-icon-edit"></span>
            </el-button>
        </el-form-item>
        <el-form-item prop="taskUserId" label="任务人：">
          <el-select style="width:200px" filterable size="mini" v-model="forData.taskUserId" clearable placeholder="请选择">
              <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="taskRemark" label="任务备注：">
          <el-input
              style="width:400px"
              type="textarea"
              maxlength="200"
              show-word-limit
              :autosize="{ minRows: 5}"
              placeholder="请输入内容"
              v-model="forData.taskRemark">
          </el-input>
        </el-form-item>
        <el-form-item  label="操作：">
          <el-button @click="submit">创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
    :append-to-body="true"
      title="推荐导师"
      :visible.sync="mentorListVisible"
      width="1000px"
      :before-close="mentorListClose"
    >
      <el-row style="margin-bottom:10px">
        <el-input
          :style="{width:'150px'}"
          v-model="referrerName"
          size="mini"
          clearable
          placeholder="注意名字中间空格"
          @keyup.enter.native="searchMentorByMentorName"
        ></el-input>
        <el-button type="primary" @click="searchMentorByMentorName" size="mini">查询</el-button>
      </el-row>
      <el-row v-for="(mentor,i) in mentorSearchList" :key="mentor.mentorId">
        <el-col :span="2">
          <el-button size="mini" @click="chooseMentor(i)" type="primary">选择</el-button>
        </el-col>
        <el-col :span="2" class="_item-name">姓名</el-col>
        <el-col :span="3" class="_item-value">{{mentor.mentorName}}</el-col>
        <el-col :span="2" class="_item-name">微信ID</el-col>
        <el-col :span="3" class="_item-value">{{mentor.wxId}}</el-col>
        <el-col :span="2" class="_item-name">Track</el-col>
        <el-col :span="4" class="_item-value">{{mentor.trackName}}</el-col>
        <el-col :span="2" class="_item-name">Country</el-col>
        <el-col :span="4" class="_item-value">{{mentor.countryName}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import apiDic from '@/api/dictionary.js'

export default {
  name: 'useDocking',
  props: {
    useDockingVisible: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      status: false,
      active: 0,
      rules: {
        taskUserId: [{ required: true, message: '必填', trigger: 'blur' }],
        taskRemark: [{ required: true, message: '必填', trigger: 'blur' }],
        mentorName: [{ required: true, message: '必填', trigger: 'blur' }],
        referrerName: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      userList: [],
      referrerName:'',
      mentorSearchList:[],
      mentorListVisible: false,
      forData: {
        taskUserId: '',
        taskRemark: '',
        mentorName: '',
        referrerName:''
      },
      mentorList: []
    }
  },
  watch: {
    useDockingVisible: function (val) {
      if (val) {}
    }
  },
  mounted () {
    const data = {
      entryStatus: 1,
      depts: 'wst_vip',
      positionTypes: ''
    }
    apiDic.userListCommon(data).then(res => {
      console.log(res)
      this.userList = res.data
    })
  },
  methods: {
    clear () {
      this.forData = {
        taskUserId: '',
        taskRemark: '',
        mentorName: '',
        referrerName:''
      }
      this.referrerName = ''
      this.status = false
      this.mentorList = []
      this.active = 0
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    toCreate () {
      if (this.forData.mentorName) {
        this.active = 1
      } else {
        this.$message.error('导师名必填！！')
      }
    },
    next () {
      if (this.forData.mentorName) {
        api.getMentorSearch(this.forData.mentorName).then(res => {
          console.log(res.data)
          this.status = true
          this.mentorList = res.data
        })
      } else {
        this.$message.error('导师名必填！！')
      }
    },
    searchMentorByMentorName () {
      if (!this.referrerName) {
        this.$message({
          type: 'warning',
          message: '别闹~~~'
        })
        return
      }
      api.searchMentorByMentorName({ mentorName: this.referrerName }).then(res => {
        console.log('searchMentorByMentorName', res.data)
        if (!res.data.length) {
          this.$message({
            type: 'warning',
            message: '无该姓名的导师'
          })
          return
        }
        this.mentorSearchList = res.data
      })
    },
    chooseMentor (i) {
      if (
        !this.mentorSearchList[i].country ||
        !this.mentorSearchList[i].countryName ||
        !this.mentorSearchList[i].track ||
        !this.mentorSearchList[i].trackName
      ) {
        this.$message({
          type: 'warning',
          message: '该导师信息不完整（country，track）'
        })
        return
      } else {
        this.forData.referrerId = this.mentorSearchList[i].mentorId
        this.forData.referrerName = this.mentorSearchList[i].mentorName
      }
      this.mentorListClose()
    },
    mentorListClose () {
      this.mentorListVisible = false
      this.mentorSearchList = []
    },
    submit () {
      this.$refs.tableValidate.validate(valid => {
        if (!valid) return
        const data = {
          mentorName: this.forData.mentorName || '',
          taskUserId: this.forData.taskUserId,
          taskRemark: this.forData.taskRemark,
          referrerId: this.forData.referrerId
        }
        console.log(data)
        api.addDocking(data).then(res => {
          this.clear()
          this.$emit('submit')
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .mentorBlock{
    display: flex;
    margin-top: 10px;
  }
  .mentorBlock_item{
    flex: 1;
    font-size: 14px;
    line-height: 24px;
  }
</style>
