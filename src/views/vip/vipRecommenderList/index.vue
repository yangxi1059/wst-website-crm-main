<!--
 * @Author: 杨曦
 * @Date: 2022-03-17 11:44:03
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-02 11:40:41
 * @Version:
 * @Description:
-->
<template>
	<d2-container v-loading="loading">
		<div class="feedback d2_container" ref="d2">
			<div class="search_page" ref="search">
				<div class="search">
          <mySelect
            :role="role"
            @change="changeSelect"
            />
					<el-date-picker
            v-model="daterange0"
            class="mb10 mr10"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button icon="el-icon-search"  size="mini" plain @click="Topage()">GO</el-button>
				</div>
			</div>
			<el-table
					:data="tableList"
					size="mini"
					highlight-current-row
					:max-height="tableHeight"
					border
				>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
					<el-table-column align="center" prop="menteeName" label="学员名" show-overflow-tooltip min-width="80"></el-table-column>
					<el-table-column align="center"  label="微信ID" >
            <template slot-scope="scope">
              <div :title="scope.row.wxId2">{{scope.row.wxId}}</div>
            </template>
          </el-table-column>
					<el-table-column align="center" prop="wxName" label="微信名" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="finishYear" label="学生毕业年份" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="schoolChiName" label="学生所在学校（中文名）" min-width="90" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" sortable prop="signStatusName" label="签约状态" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="sourceFromName" label="渠道来源" min-width="80" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="effectiveConsultingName" label="是否有效咨询" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="firstAskDate" label="首次咨询日期" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="counselorDate" label="分配顾问日期" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="counselorName" label="顾问姓名" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="vipRecommenderName" label="VIP转介绍人" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="createByName" label="创建人" show-overflow-tooltip></el-table-column>
			</el-table>
		</div>
	</d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import { mapState } from 'vuex'
import mySelect from '@/components/my-select.vue'

export default {
  mixins: [mixins],
  name: 'feedback',
  components: { mySelect },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
    ...mapState('role', [
      'userInfo'
    ])
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
        this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
      })
    }
  },
  data () {
    return {
      role: '0',
      userId: '',
      groupId: '',
      userList: [],
      pageSize: 100,
      pageNum: 1,
      total: 0,
      tableHeight: 'auto',
      tableList: [],
      loading: false,
      daterange0: '',
      fromDate: '',
      toDate: ''
    }
  },
  mounted () {
    this.Topage()
    this.initUserList()
    this.$message.error('此页面已废弃，请勿使用')
  },
  methods: {
    initUserList () {
      this.userId = this.userInfo.userId
      if (this.roleInfo.includes('vipRecommenderList_allData')) {
        this.role = '1'
      } else {
        this.role = '0'
      }
    },
    Topage () {
      this.loading = true
      this.fromDate = this.daterange0[0] || ''
      this.toDate = this.daterange0[1] || ''
      api.vipRecommenderList(this.userId, this.fromDate, this.toDate, this.groupId).then(res => {
        console.log(res.data)
        this.loading = false
        this.tableList = res.data
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    // 下拉选单击选中
    changeSelect (data) {
      this.groupId = data.groupId
      this.userId = data.user
    }
  }
}
</script>

<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%
}
</style>
