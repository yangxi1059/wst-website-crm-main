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
    <el-dialog title="设置负责人" :close-on-click-modal="false" :visible.sync="addSetVipVisible" width="400px" :before-close="close">
      <el-form :inline="true" label-width="130px">
        <el-form-item label="Strategist">
          <el-select
            clearable
            :style="{width:'180px'}"
            v-model="vipList.strategist"
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
        <el-form-item label="Program Manager">
          <el-select
            clearable
            :style="{width:'180px'}"
            v-model="vipList.services"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in service" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
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
      service: []
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    addSetVipVisible: function (val) {
      if (val) {
        console.log(this.vipList)
        this.pageInit()
      }
    }
  },
  methods: {
    pageInit () {
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
          console.log(data)
          this.$forceUpdate()
          console.log('submit', this.strategist, this.service, this.vipList)
        })
    },
    close () {
      this.$emit('close')
    },
    submit () {
      if (this.vipList.strategist || this.vipList.services) {
        const data = {
          signId: this.signId,
          strategist: this.vipList.strategist,
          services: this.vipList.services
        }
        console.log(data)
        api.setVipMentor(data).then(res => {
          console.log('更新services，strategist', res)
          this.$emit('submit')
        })
      } else {
        this.$message.error('至少填入一项！！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
