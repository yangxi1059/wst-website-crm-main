<!--
 * @Author: 库建华
 * @Date: 2019-12-13 16:46:19
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-28 14:13:09
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="internship--mentee-list" v-loading="loading" >
    <div >
      <div class="mb20" v-if="toMenteeListInternshipId">
        <el-button type="primary" style="margin:10px 0 0 20px" size="small" @click="searchMenteeList()">分配实习</el-button>
        <el-button type="primary" style="margin:10px 0 0 10px" size="small" @click="jobOfferList()">相关求职Offer</el-button>
      </div>
      <el-table :data="tableData"   size="mini" highlight-current-row >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          type="expand"
          width="40px"
        >
          <template slot-scope="props">
            <el-form label-position="left" label-width="95px" inline class="demo-table-expand">
              <el-form-item label="开始日期：">
                <el-link type="primary">{{ props.row.internshipStartDate || '无' }}</el-link>
              </el-form-item>
              <el-form-item label="结束日期：">
                <el-link type="primary">{{ props.row.internshipEndDate || '无' }}</el-link>
              </el-form-item>
              <el-form-item label="实习备注：">
                <el-link type="primary">{{ props.row.internshipNote || '无' }}</el-link>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详情" width="60px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.signInternshipStatus != '1'"
              type="text"
              size="mini"
              @click="setInternship(scope.row)"
              class="el-icon-tickets"
            >编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="实习名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.internshipFlag && scope.row.internshipFlag == '1'" type="danger" size="small" >内推</el-tag>
              <el-tag v-if="scope.row.internshipFlag == '0'" type="danger" size="small" >直接安排</el-tag>
              {{scope.row.internshipName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName"  label="学员名" show-overflow-tooltip></el-table-column>
        <el-table-column
          width="80px"
          align="center"
          prop="internshipTimeName"
          label="实习时长"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
        width="80px"
          align="center"
          prop="internshipLocationName"
          label="实习方式 "
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="signInternshipStatusName"
          label="实习状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="scope.row.signInternshipStatus == '1'">
              <span >已安排</span>
            </div>
            <el-button
              v-else
              type="text"
              size="mini"
              @click="setSignInternshipStatus(scope.row.signId)"
            >确认安排</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="internshipOfferStatus"
          label="实习Offer"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.internshipOfferStatus == '0'">已收到Offer</span>
            <div v-else-if="scope.row.signInternshipStatus == '1' && !scope.row.internshipOfferStatus">
              <el-button
                type="text"
                size="mini"
                @click="setSignInternshipOfferApply(scope.row)"
              >收到Offer</el-button>
              <el-button  size="mini" type="text"  @click="deleteSignInternshipStatus(scope.row.signId)">取消安排</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="80px"
          align="center"
          prop="offerReceiveDate"
          label="Offer日期"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="offerVoucher" label="Offer凭证">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.internshipOfferStatus && scope.row.offerVoucher"
              @click="download(scope.row.offerVoucher)"
            >查看</el-button>
            <el-upload
              v-if="roleInfo.includes('internship_voucher_update') && scope.row.internshipOfferStatus == '0'"
              action
              :http-request="uploadFileAxios"
              class="upload-btn"
              ref="elupload"
              :file-list="fileList"
              :show-file-list="false"
            >
              <el-button
                slot="trigger"
                size="mini"
                type="text"
                @click="offerId = scope.row.offerId; offerReceiveDate = scope.row.offerReceiveDate"
              >更新</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column
          width="80px"
          align="center"
          prop="offerPaymentStatusName"
          label="实习付款"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span v-if="scope.row.offerPaymentStatus == '1'">已付款</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <search-mentee
      :searchMenteeListVisible="searchMenteeListVisible"
      :toMenteeListInternshipId="toMenteeListInternshipId"
      @close="searchMenteeClose"
      @submit="searchMenteeSubmit"
    ></search-mentee>
      <!-- :menteeList="menteeList" -->
      <!-- @internship="searchMenteeInternship" -->
    <uptData
      :uptDataVisible="uptDataVisible"
      :internshipData="internshipData"
      @close="uptDataClose"
      @submit="uptDataSubmit"
    />
    <setInternship
      :setInternshipVisible="setInternshipVisible"
      :internshipData="internshipData"
      @close="setInternshipClose"
      @submit="setInternshipSubmit"
    />
    <internshipOfferApply
      :internshipOfferApplyVisible="internshipOfferApplyVisible"
      :internshipData="internshipData"
      @close="internshipOfferApplyClose"
      @submit="internshipOfferApplySubmit"
    />
    <el-drawer
      title="该实习学生求职Offer列表"
      :visible.sync="jobOfferVisible"
      size="80%"
      :before-close="jobOfferClose"
    >
      <template>
        <div v-loading="loading2" style="padding:0 20px;box-sizing:border-box">
          <el-table :data="InternshipListOffer" stripe style="width: 100%">
            <el-table-column align="center" prop="menteeName"  label="学员姓名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="programName"  label="项目名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="applySeason"  label="申请季" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="companyName"  label="offer公司" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="division"  label="offer部门" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="city"  label="offer城市" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="internshipType"  label="offer类型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="offerFrom"  label="offer来源" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="offerReceiveDate"  label="offer收到日期" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="vipName"  label="Strategist/PM" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="internshipInfo"  label="实习信息" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import api from '@/api/vip.js'
import file, {
  uploadFunBySys
} from '@/libs/file.js'

import searchMentee from './SearchMentee.vue'
import setInternship from './SetInternship.vue'
import uptData from './UptData.vue'
import internshipOfferApply from './OfferApply.vue'
import { mapState } from 'vuex'

export default {
  components: { searchMentee, setInternship, internshipOfferApply, uptData },
  name: 'internship',
  props: {
    menteeListVisible: {
      type: Boolean,
      default: false
    },
    toMenteeListInternshipId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      pageNum: 0,
      total: 0,
      search: '',
      internship: '',
      internshipList: [],
      tableData: [],
      menteeName: '',
      InternshipListOffer: [],
      loading2: false,
      searchMenteeListVisible: false,
      menteeList: [],
      setInternshipVisible: false,
      uptDataVisible: false,
      internshipData: {},
      internshipOfferApplyVisible: false,
      jobOfferVisible: false,
      offerId: '',
      offerReceiveDate: '',
      fileList: [],
      loading: false
    }
  },
  watch: {
    menteeListVisible: function (val, old) {
      if (val) {
        this.Topage(this.toMenteeListInternshipId)
      }
    }
  },
  mounted () {},

  methods: {
    Topage (internshipId) {
      this.loading = true
      api
        .getMenteeListByInternshipId(internshipId)
        .then(res => {
          console.log('位置 vip/internship/MenteeList.vue', res.data)
          this.tableData = res.data
          this.loading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '数据请求出错'
          })
        })
    },
    // //排序--全局
    // sortTable(v) {
    //   const orderToSort = {
    //     ascending: "asc",
    //     descending: "desc"
    //   };
    //   this.sort = orderToSort[v.order] || null;
    //   this.sortCol = v.prop;
    //   this.Topage();
    // },

    close () {
      this.$emit('close')
    },
    getMenteeListByMenteeName () {
      api.getMenteeListByMenteeName(this.menteeName).then(res => {
        if (!res.data) {
          this.$message({
            type: 'warning',
            message: '无该姓名学员，请检查'
          })
        } else {
          this.searchMenteeListVisible = true
          this.menteeList = res.data
        }
      })
    },
    searchMenteeClose () {
      this.searchMenteeListVisible = false
    },
    searchMenteeSubmit () {
      this.searchMenteeClose()
      this.Topage(this.toMenteeListInternshipId)
    },
    searchMenteeInternship (signId) {
      this.searchMenteeClose()
      // this.uptDataVisible = true;
      this.setInternshipVisible = true
      this.internshipData = {
        internship: this.toMenteeListInternshipId,
        signId: signId
      }
    },
    jobOfferList () {
      this.loading2 = true
      this.jobOfferVisible = true
      api.getInternshipListOffer(this.toMenteeListInternshipId).then(res => {
        this.InternshipListOffer = res.data
        this.loading2 = false
      })
    },
    jobOfferClose () {
      this.jobOfferVisible = false
      this.InternshipListOffer = false
    },
    // 安排实习
    setSignInternshipStatus (signId) {
      this.$confirm('此操作将确认安排该实习, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            signId: signId,
            internshipStatus: '1'
          }
          api.updatedSignEdit(data).then(res => {
            this.$message({
              type: 'success',
              message: '确认安排实习，成功！'
            })
            this.Topage(this.toMenteeListInternshipId)
            this.$emit('submit')
          })
        })
    },
    deleteSignInternshipStatus (signId) {
      this.$confirm('此操作将取消此安排, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            signId: signId,
            internshipStatus: '0'
          }
          api.updatedSignEdit(data).then(res => {
            this.$message({
              type: 'success',
              message: '取消成功！'
            })
            this.Topage(this.toMenteeListInternshipId)
            this.$emit('submit')
          })
        })
    },
    // 编辑实习信息
    setInternship (item) {
      this.setInternshipVisible = true
      this.internshipData = item
    },
    setInternshipClose () {
      this.setInternshipVisible = false
    },
    searchMenteeList () {
      this.searchMenteeListVisible = true
    },
    setInternshipSubmit () {
      this.setInternshipClose()
      this.Topage(this.toMenteeListInternshipId)
    },
    // 更新数据
    uptData (item) {
      this.uptDataVisible = true
      this.internshipData = item
    },
    uptDataClose () {
      this.uptDataVisible = false
    },
    uptDataSubmit () {
      this.uptDataClose()
      this.Topage(this.toMenteeListInternshipId)
    },
    setSignInternshipOfferApply (item) {
      this.internshipData = item
      this.internshipOfferApplyVisible = true
    },
    internshipOfferApplyClose () {
      this.internshipOfferApplyVisible = false
    },
    internshipOfferApplySubmit () {
      this.internshipOfferApplyClose()
      this.Topage(this.toMenteeListInternshipId)
    },
    // 查看
    download (path) {
      console.log(path)
      if (!path) {
        this.$message({
          type: 'warning',
          message: '暂无凭证，请去上传'
        })
        return
      }
      file.preview(path)
    },
    // 上传
    uploadFileAxios (file, fileList) {
      this.$loading()
      console.log(file, fileList)
      uploadFunBySys(
        file.file,
        `voucher/internship_offer/${this.offerId}`,
        url => {
          const data = {
            offerId: this.offerId,
            offerVoucher: url,
            offerReceiveDate: this.offerReceiveDate
          }
          this.submitCommon(data)
          this.fileList = []
          this.$loading().close()
          this.$refs.elupload.clearFiles()
        }
      )
    },
    submitCommon (data) {
      api.uptInternshipOffer(data).then(res => {
        console.log(res)
        this.Topage(1)
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-btn{
  margin-left:10px;
  display:inline-block
}
.demo-table-expand{
	padding-left: 20px;
	.el-form--inline .el-form-item{
		display: block;
	}
}
.detail_block{

}
</style>
