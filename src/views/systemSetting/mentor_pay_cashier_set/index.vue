<!--
 * @Author: 库建华
 * @Date: 2019-11-26 17:01:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-10 14:38:32
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="role">
        <el-table
        :data="rows"
        size="mini"
        v-loading="loading"
        highlight-current-row
        :max-height="height"
        border
        style="width: 100%"
        >
        <el-table-column prop="itemName" align="center" label="收款账户类型" min-width="200"></el-table-column>
        <el-table-column prop="itemValue" align="center" label="ID" min-width="180"></el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
            <template slot-scope="scope">
            <el-button
                type="text"
                @click="setUser(scope.row)"
            >设置出纳人</el-button>
            </template>
        </el-table-column>
        <el-table-column align label min-width="1" fixed="right"></el-table-column>
        </el-table>
        <set-users
        :position="position"
        :userVisible="userVisible"
        @close="setUserClose"
        @submit="setUserSubmit"
        />
    </div>
  </d2-container>
</template>

<script>
import setUsers from './components/mentor_pay_cashier_set_user.vue'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  components: { setUsers },
  data () {
    return {
      height: document.documentElement.clientHeight - 190,
      loading: false,
      rows: [],
      widths: '240px',
      userVisible: false,
      position: null
    }
  },
  created () {
    this.loading = true
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.rows = await this.getDictionary('mentor_pay_type')
      this.loading = false
    },
    setUser (row) {
      this.position = row.itemValue
      this.userVisible = true
    },
    setUserClose () {
      console.log('setUserClose')
      this.userVisible = false
    },
    setUserSubmit () {
      console.log('setUserSubmit')
      this.setUserClose()
    }
  }
}
</script>

<style lang='scss'>
.role {
  .el-table--mini td {
    padding: 0;
  }
}
.el-transfer-panel {
  width: 300px;
}
</style>
