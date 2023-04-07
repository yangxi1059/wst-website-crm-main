<!--
 * @Author: 库建华
 * @Date: 2019-07-24 13:44:16
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 17:42:33
 * @Version:
 * @Description:
 -->
<template>
  <div class="set-target">
    <el-dialog title="VIP拉群设置" :close-on-click-modal="false" :visible.sync="addSetVipVisible" width="400px" :before-close="close">
      <el-form :rules="rules" :model="allData" ref="ruleForm" :inline="true" label-width="140px">
        <el-form-item label="Strategist" prop="strategist">
          <el-select
            clearable
            :style="{width:'180px'}"
            v-model="allData.strategist"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in strategist"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Program Manager" prop="services">
          <el-select
            clearable
            :style="{width:'180px'}"
            v-model="allData.services"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in service" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拉群日期" prop="vipGroupDate" >
          <el-date-picker
            :disabled="selected"
            :style="{width:'180px'}"
            v-model="allData.vipGroupDate"
            type="date"
            value-format="yyyy-mm-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import apiU from '@/api/common.js'
export default {
  props: {
    addSetVipVisible: {
      type: Boolean,
      default: false
    },
    signId: {
      type: String,
      default: ''
    },
    vipList: {
      type: Object
    }
  },
  data: () => {
    return {
      strategist: [],
      service: [],
      rules: {
        strategist: [{ required: true, message: '必填', trigger: 'blur' }],
        services: [{ required: true, message: '必填', trigger: 'blur' }],
        vipGroupDate: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      allData:{
        strategist:'',
        services:'',
        vipGroupDate:'',
      },
      selected: false
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    addSetVipVisible: function (val) {
      if (val) {
        this.allData = JSON.parse(JSON.stringify(this.vipList))
        console.log(this.allData)
        if(this.vipList.vipGroupDate){
          this.selected = true
        }else{
          this.selected = false
        }
        this.pageInit()
      }
    }
  },
  methods: {
    pageInit () {
      this.service = []
      this.strategist = []
      apiU
        .userList({
          pageNum: 1,
          pageSize: 1000,
          entryStatus: '1'
        })
        .then(({ data }) => {
          this.strategist = data.rows.filter(v =>
            v.positionIds.includes('strategist')
          )
          this.service = data.rows.filter(v =>
            v.positionIds.includes('services')
          )
          this.strategist.unshift({userName:'无',userId:'no_data'})
          this.service.unshift({userName:'无',userId:'no_data'})
          console.log(data)
          this.$forceUpdate()
          console.log('submit', this.strategist, this.service, this.allData)
        })
    },
    close () {
      this.$emit('close')
      this.selected = false
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const data = {
              signId: this.signId,
              strategist: this.allData.strategist,
              services: this.allData.services,
              vipGroupDate: this.allData.vipGroupDate,
              orderId: this.allData.orderId
            }
            console.log(data)
            api.setVipMentor(data).then(res => {
              this.$message.success('更新成功！！')
              this.$emit('submit')
            })
          }
        });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
