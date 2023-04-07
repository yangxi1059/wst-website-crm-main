<!--
 * @Author: 库建华
 * @Date: 2020-04-22 15:57:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-14 16:45:29
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="user">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="学员" name="first">
          <div class="search_page">
            <div class="search">
              <el-input
                class="mr10"
                size="mini"
                style="width:150px"
                v-model="search"
                placeholder="请输入内容"
                clearable
                @keyup.enter.native="Topage()"
              ></el-input>
              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="manageBy"

                placeholder="选择用户"
                @change="Topage()"
              >
                <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="pretalkStatus"
                clearable
                placeholder="是否启用"
                @change="Topage()"
              >
                <el-option
                  v-for="item in common_yes_or_no"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="schoolId"
                clearable
                placeholder="学校"
                @change="Topage()"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.schoolId"
                  :label="item.allName"
                  :value="item.schoolId"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="companyId"
                clearable
                placeholder="公司"
                @change="Topage()"
              >
                <el-option
                  v-for="item in company"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="divisionId"
                clearable
                placeholder="部门"
                @change="Topage()"
              >
                <el-option
                  v-for="item in division"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="cityId"
                clearable
                placeholder="城市"
                @change="Topage()"
              >
                <el-option
                  v-for="item in city"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="resultApply"
                clearable
                placeholder="offer类型"
                @change="Topage()"
              >
                <el-option
                  v-for="item in internship_or_full_time"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-button
                icon="el-icon-search"
                class="mr10 ml0"
                size="mini"
                plain
                @click="Topage()"
              >搜索</el-button>
              <el-button
                icon="el-icon-plus"
                class="ml0"
                size="mini"
                plain
                @click="newSelect"
              >新增</el-button>
            </div>
            <pagination
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></pagination>
          </div>
          <el-table
            :data="rows"
            size="small"
            highlight-current-row
            style="width: 100%"
            @cell-dblclick="dblclick"
          >
            <el-table-column prop="pretalkId" align="center"  label="pretalk编号"></el-table-column>
            <el-table-column prop="codes" align="center"  label="标识码"></el-table-column>
            <el-table-column prop="pretalkTypeName" align="center"  label="pretalk类型"></el-table-column>
            <el-table-column prop="pretalkName" align="center"  label="姓名"></el-table-column>
            <el-table-column prop="wxName" align="center"  label="微信名"></el-table-column>
            <el-table-column prop="wxId" align="center"  label="微信ID"></el-table-column>
            <el-table-column prop="trackName" align="center"  label="可带行业"></el-table-column>
            <el-table-column prop="countryName" align="center"  label="可带地区"></el-table-column>
            <el-table-column prop="major" align="center"  label="专业"></el-table-column>
            <el-table-column prop="schoolName" align="center"  label="学校"></el-table-column>
            <el-table-column prop="basicProgramNames" show-overflow-tooltip align="center"  label="基础项目"></el-table-column>
            <el-table-column prop="offerName" show-overflow-tooltip align="center"  label="Offer名"></el-table-column>
            <el-table-column prop="note" align="center"  label="简介"></el-table-column>
            <el-table-column prop="pretalkStatus" align="center"  label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.pretalkStatus == '1'?'启用':'禁用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="manageByName" align="center"  label="管理者"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="导师" name="second">
          <div class="search_page">
            <div class="search">
              <el-input
                class="mr10"
                size="mini"
                style="width:150px"
                v-model="search"
                placeholder="请输入内容"
                clearable
                @keyup.enter.native="Topage()"
              ></el-input>
              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="manageBy"

                placeholder="选择用户"
                @change="Topage()"
              >
                <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="pretalkStatus"
                clearable
                placeholder="是否启用"
                @change="Topage()"
              >
                <el-option
                  v-for="item in common_yes_or_no"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="countryId"
                clearable
                placeholder="国家"
                @change="Topage()"
              >
                <el-option
                  v-for="item in country"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="trackId"
                clearable
                placeholder="Track"
                @change="Topage()"
              >
                <el-option
                  v-for="item in track"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-button
                icon="el-icon-search"
                class="mr10"
                size="mini"
                plain
                @click="Topage()"
              >搜索</el-button>
              <el-button
                icon="el-icon-plus"
                class="mr10"
                size="mini"
                plain
                @click="newSelect"
              >新增</el-button>
            </div>
            <pagination
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></pagination>
          </div>
          <el-table
            :data="rows"
            size="small"
            highlight-current-row
            style="width: 100%"
            @cell-dblclick="dblclick"
          >
            <el-table-column prop="pretalkId" align="center"  label="pretalk编号"></el-table-column>
            <el-table-column prop="codes" align="center"  label="标识码"></el-table-column>
            <el-table-column prop="pretalkTypeName" align="center"  label="pretalk类型"></el-table-column>
            <el-table-column prop="pretalkName" align="center"  label="姓名"></el-table-column>
            <el-table-column prop="wxName" align="center"  label="微信名"></el-table-column>
            <el-table-column prop="wxId" align="center"  label="微信ID"></el-table-column>
            <el-table-column prop="trackName" align="center"  label="可带行业"></el-table-column>
            <el-table-column prop="countryName" align="center"  label="可带地区"></el-table-column>
            <el-table-column prop="countryNames" align="center"  label="求职国家"></el-table-column>
            <el-table-column prop="profile" align="center"  label="求职profile"></el-table-column>
            <el-table-column prop="trackNames" show-overflow-tooltip align="center"  label="求职方向"></el-table-column>
            <el-table-column prop="note" align="center"  label="简介"></el-table-column>
            <el-table-column prop="pretalkStatus" align="center"  label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.pretalkStatus == '1'?'启用':'禁用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="manageByName" align="center"  label="管理者"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他" name="third">
          <div class="search_page">
            <div class="search">
              <el-input
                class="mr10"
                size="mini"
                style="width:150px"
                v-model="search"
                placeholder="请输入内容"
                clearable
                @keyup.enter.native="Topage()"
              ></el-input>
              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="manageBy"

                placeholder="选择用户"
                @change="Topage()"
              >
                <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                filterable
                v-model="pretalkStatus"
                clearable
                placeholder="是否启用"
                @change="Topage()"
              >
                <el-option
                  v-for="item in common_yes_or_no"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-button
                icon="el-icon-search"
                class="mr10"
                size="mini"
                plain
                @click="Topage()"
              >搜索</el-button>
              <el-button
                icon="el-icon-plus"
                class="mr10"
                size="mini"
                plain
                @click="newSelect"
              >新增</el-button>
            </div>
            <pagination
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></pagination>
          </div>
          <el-table
            :data="rows"
            size="small"
            highlight-current-row
            style="width: 100%"
            @cell-dblclick="dblclick"
          >
            <el-table-column prop="pretalkId" align="center"  label="pretalk编号"></el-table-column>
            <el-table-column prop="codes" align="center"  label="标识码"></el-table-column>
            <el-table-column prop="pretalkTypeName" align="center"  label="pretalk类型"></el-table-column>
            <el-table-column prop="pretalkName" align="center"  label="姓名"></el-table-column>
            <el-table-column prop="wxName" align="center"  label="微信名"></el-table-column>
            <el-table-column prop="wxId" align="center"  label="微信ID"></el-table-column>
            <el-table-column prop="trackName" align="center"  label="可带行业"></el-table-column>
            <el-table-column prop="countryName" align="center"  label="可带地区"></el-table-column>
            <el-table-column prop="note" align="center"  label="简介"></el-table-column>
            <el-table-column prop="pretalkStatus" align="center"  label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.pretalkStatus == '1'?'启用':'禁用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="manageByName" align="center"  label="管理者"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <addKol :addPretalkVisible="addPretalkVisible" :pretalkTypeNew="pretalkTypeNew" @close="addClose()" @success="success()" />
    <detailKol :detailVisible="detailVisible" :pretalkId="pretalkId" @close="detailClose()" @success="detailSuccess()" />
  </d2-container>
</template>
<script>
import api from '@/api/bd'
import apiVip from '@/api/vip'
import apiUser from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import addKol from './pretalkComponents/addPretalk.vue'
import detailKol from './pretalkComponents/detailPretalk.vue'
import { mapState } from 'vuex'
export default {
  mixins: [mixins],
  components: { addKol, detailKol },
  data () {
    return {
      pageSize: 400,
      pretalkTypeNew: '',
      activeName: 'first',
      common_yes_or_no: [],
      search: '',
      manageBy: 'ALL',
      users: [],
      pageNum: 1,
      total: 0,
      loading: false,
      pretalkStatus: '',
      schoolList: [],
      rows: [],
      userId: '', // ID
      pretalkId: '',
      addPretalkVisible: false,
      detailVisible: false,
      school: [],
      company: [],
      division: [],
      city: [],
      trackId: '',
      countryId: '',
      track: [],
      country: [],
      internship_or_full_time: [],
      schoolId: '',
      companyId: '',
      divisionId: '',
      cityId: '',
      resultApply: ''
    }
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    ...mapState('role', ['userInfo'])
  },
  created () {
    this.axios()
  },
  mounted () {
    this.pageInit()
    this.Topage()
    apiVip.getCompanyList().then((res) => {
      console.log('company', res)
      this.company = res.data
    })
  },
  methods: {
    async pageInit () {
      this.company = await this.getCompany()
      this.division = await this.getDictionary('division')
      this.city = await this.getDictionary('city')
      this.internship_or_full_time = await this.getDictionary('internship_or_full_time')
      this.schoolList = await this.getSchool('school')
      this.track = await this.getDictionary('track')
      this.country = await this.getDictionary('country')
    },
    axios () {
      apiUser
        .dicDropdown(['common_yes_or_no'])
        .then(({ data }) => {
          this.common_yes_or_no = data.common_yes_or_no
        })
      this.manageBy = this.userInfo.userId
      apiUser.subordinate(this.manageBy, '').then(({ data }) => {
        const users = [
          { userId: this.userInfo.userId, userName: this.userInfo.userName }
        ]
        data.forEach(e => {
          if (!users.some(em => em.userId == e.userId)) {
            users.push(e)
          }
        })
        this.users = users
        this.users.unshift({ userId: 'ALL', userName: 'ALL（本人及下属）' })
        if (this.roleInfo.includes('pretalk_cashier_ALL_Data')) {
          this.users.unshift({
            userId: 'ALL_Data',
            userName: '全数据'
          })
        }
      })
    },
    Topage () {
      if (this.activeName == 'third') {
        const data = {
          search: this.search,
          manageBy: this.manageBy,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pretalkStatus: this.pretalkStatus,
          pretalkType: 'other'
        }
        this.loading = true
        api
          .getPretalkList(data)
          .then(({ data }) => {
            console.log(data)
            this.pageNum = data.page
            this.total = data.total
            this.rows = data.rows
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.activeName == 'first') {
        const data = {
          search: this.search,
          manageBy: this.manageBy,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pretalkStatus: this.pretalkStatus,
          schoolId: this.schoolId,
          companyId: this.companyId,
          divisionId: this.divisionId,
          cityId: this.cityId,
          resultApply: this.resultApply
        }
        this.loading = true
        api
          .getPretalkListMentee(data)
          .then(({ data }) => {
            console.log(data)
            this.pageNum = data.page
            this.total = data.total
            this.rows = data.rows
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.activeName == 'second') {
        const data = {
          search: this.search,
          manageBy: this.manageBy,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pretalkStatus: this.pretalkStatus,
          track: this.trackId,
          country: this.countryId
        }
        this.loading = true
        api
          .getPretalkListMentor(data)
          .then(({ data }) => {
            console.log(data)
            this.pageNum = data.page
            this.total = data.total
            this.rows = data.rows
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    newSelect () {
      if (this.activeName == 'first') {
        this.pretalkTypeNew = 'mentee'
      } else if (this.activeName == 'second') {
        this.pretalkTypeNew = 'mentor'
      } else {
        this.pretalkTypeNew = 'other'
      }
      this.addPretalkVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    dblclick (row) {
      this.pretalkId = row.pretalkId
      this.detailVisible = true
      console.log(row)
    },
    addClose () {
      this.addPretalkVisible = false
    },
    success () {
      this.addPretalkVisible = false
      this.Topage()
    },
    detailClose () {
      this.detailVisible = false
    },
    detailSuccess () {
      this.detailVisible = false
      this.Topage()
    },
    handleClick (tab) {
      this.pageNum = 1
      this.pretalkStatus = ''
      this.schoolId = ''
      this.companyId = ''
      this.divisionId = ''
      this.cityId = ''
      this.resultApply = ''
      this.search = ''
      this.trackId = ''
      this.countryId = ''
      console.log(tab.name)
      this.activeName = tab.name
      this.rows = []
      this.Topage()
    }
  }
}
</script>
<style lang='scss'>
.user {
  .el-table--mini td {
    padding: 0;
  }
}
.radio{
  line-height:50px;
}
</style>
