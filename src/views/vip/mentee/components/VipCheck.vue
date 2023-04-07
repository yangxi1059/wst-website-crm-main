<!--
 * @Author: 库建华
 * @Date: 2020-04-21 09:39:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-02 10:52:31
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-drawer
      :title="`VIP各项统计`"
      :visible.sync="vipCheckVisible"
      size="1200px"
      class="yx_my_select"
      :before-close="close"
    >
      <div style="padding:0 10px">
        <div class="search_page">
            <div class="search">
                <el-date-picker
                class="mr10"
                v-model="fromDate"
                @change="changeTime1"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                placeholder="选择起始日期">
                </el-date-picker>
                <el-date-picker
                @change="changeTime2"
                v-model="toDate"
                class="mr10"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                placeholder="选择截止日期">
                </el-date-picker>
                <mySelect
                  :role="role"
                  :showStatus="showStatus"
                  @change="changeSelect"
                />
                <el-select
                v-model="entryStatus"
                class="mr10"
                clearable
                size="mini"
                :style="{width:'160px'}"
                >
                <el-option
                    v-for="(item,i) in entryStatusList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue"
                ></el-option>
                </el-select>
                <el-button
                  icon="el-icon-search"
                  class=""
                  size="mini"
                  plain
                  @click="initPage()"
                >GO</el-button>
                <el-button
                  icon="el-icon-download"
                  size="mini"
                  plain
                  @click="exportExcel()"
                >导出</el-button>
            </div>
        </div>
        <el-table
          stripe
          size="small"
          :data="consultingData"
          border
          ref="table"
          id="export_table"
          v-loading = "pictLoading"
          show-summary
          element-loading-background = "rgba(0, 0, 0, 0.8)"
          element-loading-text = "数据正在加载中"
          element-loading-spinner = "el-icon-loading"
          style="width: 100%">
          <el-table-column
            label="VIP名"
            prop="userName"
          >
          </el-table-column>
          <el-table-column sortable
            label="升学offer"
            prop="升学offer"
          >
          </el-table-column>
          <el-table-column sortable
            label="求职offer"
            prop="求职offer"
          >
          </el-table-column>
          <el-table-column sortable
            label="面试"
            prop="面试"
          >
          </el-table-column>
          <el-table-column sortable
            label="面经数"
            prop="面经"
          >
          </el-table-column>
          <el-table-column sortable
            label="导师面试人数"
            prop="导师面试人"
          >
          </el-table-column>
          <el-table-column sortable
            label="文书修改数量"
            prop="文书修改数量"
          >
          </el-table-column>
          <el-table-column sortable
            label="VIP推荐人数"
            prop="VIP推荐人数"
          >
          </el-table-column>
          <el-table-column sortable
            label="一对一"
          >
            <template slot-scope="scope">
              <span>{{ parseFloat(scope.row['一对一']).toFixed(1) }}</span>
              <!-- <span>{{ parseFloat('1.32858').toFixed(1) }}</span> -->
            </template>
          </el-table-column>
          <el-table-column sortable
            label="一对多"
          >
            <template slot-scope="scope">
              <span>{{ parseFloat(scope.row['一对多']).toFixed(1) }}</span>
              <!-- <span>{{ parseFloat('1.32858').toFixed(1) }}</span> -->
            </template>
          </el-table-column>
          <el-table-column sortable
            label="已完成/已过期的case"
            prop="已完成/已过期的case"
          >
          </el-table-column>
          <el-table-column sortable
            label="已完成/已过期的case（单独负责）"
            prop="已完成/已过期的case（单独负责）"
          >
          </el-table-column>
          <el-table-column sortable
            label="进行中的case"
            prop="进行中的case"
          >
          </el-table-column>
          <el-table-column sortable
            label="进行中的case（单独负责）"
            prop="进行中的case（单独负责）"
          >
          </el-table-column>
          <el-table-column sortable
            label="退课"
            prop="退课"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import mySelect from '@/components/my-select.vue'
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  props: {
    vipCheckVisible: {
      type: Boolean,
      default: false
    },
    fromPage: {}
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: {
    mySelect
  },
  mixins: [mixins],
  data () {
    return {
      user: this.$store.state.role.userInfo.userId,
      fromDate: '',
      toDate: '',
      entryStatus: '1',
      entryStatusList: [
        { itemName: '在职', itemValue: '1' },
        { itemName: '离职', itemValue: '0' }
      ],
      userId: '',
      userList: [],
      showStatus: true,
      consultingData: [],
      pictLoading: false,
      role: '0',
      groupId: '',
      userValue: 'ALL'

    }
  },
  watch: {
    vipCheckVisible: function (val) {
      if (val) {
        this.fromDate = this.getCurrentMonthFirst()
        this.init()
        this.initPage()
      }
    }
  },
  mounted () {
    this.fromDate = this.getCurrentMonthFirst()
    this.init()
    this.initPage()
  },
  methods: {
    init () {
      if (this.fromPage) {
        if (this.roleInfo.includes('home_vip_allData')) {
          this.role = '1'
        } else {
          this.role = '0'
        }
      } else {
        if (this.roleInfo.includes('vip_mentee_all_mentee_data')) {
          this.role = '1'
        } else {
          this.role = '0'
        }
      }
    },
    initPage () {
      if (this.toDate) {
        if (new Date(this.fromDate) >= new Date(this.toDate)) {
          this.$message({
            type: 'warning',
            message: '起始日期不能大于截止日期'
          })
          return
        }
      }
      this.pictLoading = true
      const data = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        userId: this.user,
        entryStatus: this.entryStatus,
        groupId: this.groupId
      }
      console.log(data)
      api.getVipDateData(data).then(res => {
        console.log(res)
        const data = res.data
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].countArr.length; j++) {
            data[i][data[i].countArr[j].label] = data[i].countArr[j].value * 1
          }
        }
        this.consultingData = data
        this.pictLoading = false
      })
    },
    close () {
      this.consultingData = []
      this.user = this.$store.state.role.userInfo
      this.fromDate = ''
      this.toDate = ''
      this.entryStatus = ''
      this.userId = ''
      this.userList = []
      this.$emit('close')
    },
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      if (this.fromPage) {
        return date.getFullYear() + '-' + '01' + '-' + '01'
      } else {
        return date.getFullYear() + '-' + month + '-' + day
      }
    },
    changeSelect (data) {
      this.groupId = data.groupId
      this.user = data.user
      console.log(this.user, this.groupId, this.userValue, 666666666)
    },
    exportExcel () {
      const fileName = 'VIP各项统计_' + new Date().toLocaleDateString()
      console.log(fileName)
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#export_table')
      )
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          fileName + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    handleChange (val) {
      const tempObj = this.$refs.owner.getCheckedNodes()[0]
      console.log(tempObj, 4444444444)
      if (tempObj) {
        if (tempObj.data.groupId) {
          this.groupId = tempObj.value
          this.user = ''
        } else {
          this.groupId = ''
          this.user = tempObj.value
        }
      } else {
        this.groupId = ''
        this.user = ''
      }
    },
    changeTime1 (val) {
      if (!val) {
        this.fromDate = ''
      }
    },
    changeTime2 (val) {
      if (!val) {
        this.toDate = ''
      }
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
