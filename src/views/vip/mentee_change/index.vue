<!--
 * @Author: 库建华
 * @Date: 2019-11-01 13:33:51
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-22 14:52:51
 * @Version: 1
 * @Description: 批量更换全职导师，客服
 -->
<template>
  <d2-container v-loading="loading">
    <div class="mentee-change">
        <div class="search_page">
        <div class="search">
            <el-input
            class="mr10"
            size="mini"
            style="width:160px"
            v-model="search"
            clearable
            placeholder="支持学员名"
            @keyup.enter.native="initTable()"
            ></el-input>
						<span class="mr10" style="font-size:12px">Strategist</span>
            <el-select
            style="width:160px"
            v-model="strategist"
            class="mr10"
            size="mini"
            filterable
            placeholder="导师 Strategist"
            @change="initTable()"
            >
            <el-option
                v-for="(item) in strategistList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
            </el-select>
						<span class="mr10" style="font-size:12px">Program Manager</span>
            <el-select
            v-model="services"
            style="width:160px"
            class="mr10"
            size="mini"
            filterable
            placeholder="客服 Program Manager"
            @change="initTable()"
            >
            <el-option
                v-for="(item) in servicesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
            </el-select>
            <el-button
            v-if="roleInfo.includes(`mentee_change_services`)"
            icon="el-icon-edit-outline"
            size="mini"
            plain
            @click="initTable()"
            >GO</el-button>
            <el-button
            icon="el-icon-edit-outline"
            size="mini"
            v-if="roleInfo.includes(`mentee_change_strategist`)"
            plain
            @click="changeStrategist"
            >变更Strategist</el-button>
            <el-button
            v-if="roleInfo.includes(`mentee_change_services`)"
            icon="el-icon-edit-outline"
            size="mini"
            plain
            @click="changeServices"
            >变更Program Manager</el-button>
        </div>
        </div>
        <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable align="center" prop="menteeName" label="学员名"></el-table-column>
        <el-table-column sortable align="center" prop="mentorHour" label="行业导师课时数"></el-table-column>
        <el-table-column sortable align="center" prop="vipHour" label="全职导师课时数"></el-table-column>
        <el-table-column sortable align="center" prop="strategistName" label="strategist"></el-table-column>
        <el-table-column sortable align="center" prop="servicesName" label="services"></el-table-column>
        <el-table-column sortable show-overflow-tooltip align="center" prop="programName" label="项目名"></el-table-column>
        <el-table-column sortable align="center" prop="startDate" label="项目开始时间"></el-table-column>
        <el-table-column sortable align="center" prop="endDate" label="项目结束时间"></el-table-column>
        </el-table>
    </div>
    <el-dialog title="变更" :close-on-click-modal="false" :visible.sync="changeToVisible" width="300px" :before-close="close">
    <el-form label-width="30px">
        <el-form-item>
        <el-select :style="{width:'200px'}" v-model="changeTo" filterable placeholder="请选择">
            <el-option v-for="(item) in vipList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import apiU from '@/api/user'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      tableData: [],
      search: '',
      services: 'ALL',
      strategist: 'ALL',
      strategistList: [],
      servicesList: [],
      changeToVisible: false,
      vipList: [],
      changeTo: '',
      signList: [],
      vipType: '',
			selectAllDate: true,
			loading: false
    }
  },
  computed:{
    ...mapState('role', [
      'roleInfo'
    ])
  },
  mounted () {
    apiU.userList({
        pageNum: 1,
        pageSize: 1000
      })
      .then(({ data }) => {
        console.log(
          'userList...........................................',
          data
        )
        this.strategistList = data.rows.filter(v => {
          if (v.entryStatus == 2) {
            v.name += ' (离职)'
          }
          return v.positionIds.includes('strategist')
        })
        this.strategistList.unshift({ name: 'ALL', id: 'ALL' })
        if (this.roleInfo.includes('mentee_change_all_strategist_data')) {
          this.strategistList.unshift({
            id: 'ALL_Data',
            name: '全数据'
          })
        }
        this.servicesList = data.rows.filter(v =>
          v.positionIds.includes('service')
        )
        this.servicesList.unshift({ name: 'ALL', id: 'ALL' })
        if (this.roleInfo.includes('mentee_change_all_services_data')) {
          this.servicesList.unshift({
            id: 'ALL_Data',
            name: '全数据'
          })
        }
			})
			this.initTable()
  },
  methods: {
    handleSelectionChange (val) {
      console.log(val)
      this.signList = val
    },
    initTable () {
      const params = {
        search: this.search,
        services: this.services,
        strategist: this.strategist
      }
      this.loading = true
      api.getSignList(params).then(res => {
        res.data.forEach(v => {
          v.available = false
        })
        this.tableData = res.data
        this.loading = false
      })
    },
    changeStrategist () {
      this.getAllSelected()
      if (this.signList.length) {
        this.vipType = 'strategist'
        this.vipList = this.strategistList.slice(1)
        this.changeToVisible = true
      } else {
        this.$message('请先选择学员，再进行分配')
      }
    },
    changeServices () {
      this.getAllSelected()
      if (this.signList.length) {
        this.vipType = 'services'
        this.vipList = this.servicesList.slice(1)
        this.changeToVisible = true
      } else {
        this.$message('请先选择学员，再进行分配')
      }
    },
    // 拿到所有选中项
    getAllSelected () {
    },
    close () {
      this.changeToVisible = false
      this.changeTo = ''
    },
    submit () {
      if (!this.changeTo) {
        this.$message('请先选择分配目标人')
        return
      }
      const data = this.signList.map(v => {
        return { signId: v.signId, userId: this.changeTo }
      })
      this.loading = true
      api
        .setSignListChange(this.vipType, data)
        .then(res => {
          console.log(res.data)
          this.$message({
            type: 'success',
            message: '更换成功'
          })
          this.loading = false
          this.close()
          this.initTable()
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '更换失败'
          })
          this.loading = false
          this.close()
          this.initTable()
        })
    },
    selectAll () {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
