<!--
 * @Author: 库建华
 * @Date: 2020-03-10 09:24:48
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-14 13:52:53
 * @Version:
 * @Description:
 -->
<template>
  <d2-container v-loading="loading">
    <div class="feedback">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item) in arr" :key="item.name" :label="item.label" :name="item.name">
          <div class="search_page">
            <div class="search">
              <el-input
                class="mr10"
                size="mini"
                style="width:150px"
                v-model="search"
                clearable
                placeholder="学员名，微信名，微信ID"
                @keyup.enter.native="Topage(1)"
              ></el-input>

              <el-select
                class="mr10"
                style="width:150px"
                size="mini"
                v-model="company1"
                clearable
                filterable
                placeholder="请选择Company"
              >
                <el-option
                  v-for="(item,i) in company"
                  :key="i"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>

              <el-select
                v-if="mentorBusiness != 'businessFinance' "
                class="mr10"
                style="width:150px"
                size="mini"
                v-model="track1"
                multiple
                clearable
                filterable
                placeholder="请选择Track"
              >
                <el-option
                  v-for="(item,i) in trackList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>

              <el-select
                class="mr10"
                size="mini"
                style="width:150px"
                v-model="country1"
                multiple
                clearable
                filterable
                v-if="mentorBusiness != 'businessFinance'"
                placeholder="请选择Country"
              >
                <el-option
                  v-for="(item,i) in locationList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
            </div>
            <pagination
              v-if="roleInfo.includes(`mentor_list_page`)"
              :total="total"
              :current-page="pageNum"
              :page-size="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></pagination>
          </div>
          
          <mentorTable :offerList="offerList" :mentorBusiness="mentorBusiness" @closeMain="closeMain" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <mentorDetail
      :mentorBusiness="mentorBusiness"
      :mentorDetailVisible="mentorDetailVisible"
      :mentorData="mentorData"
      @close="mentorDetailClose"
      @submit="mentorDetailSubmit"
    />
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/vip.js'
import mentorDetail from './components/mentor_detail.vue'
import mentorTable from '@/components/mentorTable.vue'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: 'feedback',
  components: { mentorDetail, mentorTable },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data () {
    return {
      activeName: 'businessCareer',
      offerList: [],
      pageNum: 1,
      total: 0,
      arr: [
        { label: '求职导师', name: 'businessCareer' },
        { label: '申研导师', name: 'businessGp' },
        { label: '课业辅导导师', name: 'businessTutoring' },
        { label: '财商导师', name: 'businessFinance' }
      ],
      search: null,
      userId: 'ALL',
      users: [],
      loading: false,
      mentorBusiness: 'businessCareer',
      pageSize: 100,
      trackList: [],
      locationList: [],
      track1: [],
      company1: '',
      country1: [],
      mentorData: {},
      mentorDetailVisible: false,
      company: []
    }
  },
  mounted () {
    api.getCompanyList().then(res => {
      console.log('company', res)
      this.company = res.data
    })
    this.pageInit()
    this.Topage(1)
  },
  methods: {
    async pageInit () {
      this.trackList = await this.getDictionary('track')
      this.locationList = await this.getDictionary('country')
    },
    Topage () {
      this.offerList = []
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        userId: this.userId,
        mentorBusiness: this.mentorBusiness,
        entryStatus: '1', // 入职状态--0:未入职 1:在职 2:已离职
        mentorStatus: '0', // 导师状态--0：启用 1：禁用
        companyId: this.company1
      }
      switch (this.mentorBusiness) {
        case 'businessCareer':
          data.careerTrack = this.track1.join()
          data.careerCountry = this.country1.join()
          break
        case 'businessGp':
          data.gpMajor = this.track1.join()
          data.gpCountry = this.country1.join()
          break
        case 'businessTutoring':
          data.tutoringSubject = this.track1.join()
          data.tutoringCountry = this.country1.join()
          break
        default:
      }

      console.log('getAchievementMentorList', data)
      this.loading = true
      api.getMentorList2(data).then(res => {
        console.log('getAchievementMentorList', res)
        this.offerList = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    mentorDetail (v) {
      this.mentorData = { ...v }
      this.mentorDetailVisible = true
    },
    closeMain (v) {
      console.log(v)
      this.mentorData = { ...v }
      this.mentorDetailVisible = true
    },
    mentorDetailClose () {
      this.mentorDetailVisible = false
    },
    mentorDetailSubmit () {
      this.mentorDetailClose()
      this.Topage(1)
    },
    handleClick (tab, event) {
      this.track1 = []
      this.country1 = []
      this.company1 = ''
      this.$forceUpdate()
      console.log(this.track1, this.company1)
      this.mentorBusiness = tab.name
      this.Topage('321')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
