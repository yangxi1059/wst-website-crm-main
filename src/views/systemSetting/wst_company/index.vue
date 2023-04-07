<!--
 * @Author: 库建华
 * @Date: 2020-06-01 14:28:24
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-13 09:39:27
 * @Version: 1
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
		<div>
			<div class="search_page">
				<div class="search">
					<el-button
							icon="el-icon-plus"
							class="mr10"
							size="mini"
							plain
							@click="edit()"
							>新增</el-button>
				</div>
			</div>
			<el-table :data="tableList" size="mini" highlight-current-row stripe>
				<el-table-column label="操作" prop="companyId">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-edit" @click="edit(scope.row.companyId)" title="编辑"></el-button>
						<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteCompany(scope.row.companyId)" title="删除" ></el-button>
					</template>
				</el-table-column>
				<el-table-column label="公司名" prop="companyName" min-width="200" show-overflow-tooltip></el-table-column>
				<el-table-column label="签约公司id" prop="companyId" show-overflow-tooltip></el-table-column>
				<el-table-column label="联系人" prop="principal" show-overflow-tooltip></el-table-column>
				<el-table-column label="联系电话" prop="tel"  show-overflow-tooltip></el-table-column>
				<el-table-column label="联系邮箱" prop="email" show-overflow-tooltip></el-table-column>
				<el-table-column label="易签宝签章id" prop="sealNumber" show-overflow-tooltip></el-table-column>
				<el-table-column label="易签宝公司id" prop="accountId" show-overflow-tooltip></el-table-column>
				<el-table-column label="微信商户号" prop="mchId" show-overflow-tooltip></el-table-column>
				<el-table-column label="支付宝商铺号" prop="appId" show-overflow-tooltip></el-table-column>
				<el-table-column label="是否可用" prop="companyStatusName"></el-table-column>
				<el-table-column label="更新人" prop="updateByName" show-overflow-tooltip></el-table-column>
				<el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
				<el-table-column label="创建人" prop="createByName" show-overflow-tooltip></el-table-column>
				<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
			</el-table>
		</div>
		<edit
		:editVisible='editVisible'
		:companyId='companyId'
		@close='editClose'
		@submit="editSubmit"
		/>
  </d2-container>
</template>

<script>
import edit from './components/edit_wst_company'
import apiDic from '@/api/dictionary.js'
import mixins from '@/plugin/mixins'

export default {
  name: 'wst_company',
  mixins: [mixins],
  components: { edit },
  data () {
    return {
      tableList: [],
      companyStatus: null,
      companyId: null,
      editVisible: false,
			common_yes_or_no: [],
			loading: false
    }
  },

  mounted () {
    this.pageInit()
    this.Topage()
  },

  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    Topage () {
			this.loading = true
      const params = {
        pageNum: 1,
        pageSize: 999
      }
      apiDic.getWstCompany(params).then(res => {
        console.log('channelList', res.data)
				this.tableList = res.data.rows
				this.loading = false
      })
    },

    edit (companyId) {
      this.companyId = companyId
      this.editVisible = true
    },
    editClose () {
      this.editVisible = false
    },
    editSubmit () {
      this.editClose()
      this.Topage()
    },
    deleteCompany (companyId) {
      this.$confirm('此操作将彻底删除该公司，是否继续？', '提示').then(v => {
        console.log(v)
        apiDic.delWstCompanyById(companyId).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.Topage()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
