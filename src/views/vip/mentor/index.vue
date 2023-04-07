<!--
 * @Author: kaan
 * @Date: 2022-01-17 10:47:40
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-03-23 14:40:57
 * @Version:
 * @Description:
-->
<template>
  <d2-container>
    <div class="d2_container" ref="d2" >
      <div class="search_page mb10" ref="search">
        <div class="search">
          <el-input
            class="mr10 mb10"
            style="width:200px"
            v-model="search"
            size="mini"
            clearable
            placeholder="支持姓名、微信ID、城市"
            v-if="roleInfo.includes(`mentor_search`)"
            :style="{width:'160px'}"
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-button
            icon="el-icon-search"
            class=""
            plain
            @click="Topage(1)"
          >GO</el-button>
          <el-button
            class=""
            plain
            @click="addMentor()"
          >新增导师</el-button>
          <el-button
            class="mr10"
            plain
            @click="showMentor()"
          >导师筛选</el-button>
          <el-badge :value="canApplyCount"
            class="mr10"
            style="vertical-align:initial"
            v-if="roleInfo.includes(`mentor_recommend`)">
            <el-button
              class=""
              plain
              @click="mentorRecommend()"
            >导师推荐情况</el-button>
          </el-badge>
        </div>
        <el-pagination
          class="pagination mb10"
          background
          @current-change="handleCurrentChange"
          :pager-count="5"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="total,prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      <div class="user_container " v-loading="loading">
        <ul class="user_card_list mt10">
          <li class="user_card_item" v-for="(member,i) in mentorList" :key="i" @click="handleClick(member.mentorId)">
            <div class="user_card_item_border"></div>
            <div class="user_card_info_pic">
              <el-avatar :size="100" :src="member.headImage" ></el-avatar>
              <div class="sex_icon sex_icon_mars" v-if="member.sex==1">
                <d2-icon  name="mars"/>
              </div>
              <div class="sex_icon sex_icon_venus" v-if="member.sex==2">
                <d2-icon name="venus"/>
              </div>
            </div>
            <p class="user_card_info_name">{{member.mentorName}}</p>
            <span>{{member.email}}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 抽屉列表 -->
    <el-drawer
      title="导师筛选"
      size="80%"
      :visible.sync="mentorDrawer"
      :before-close="handleClose">
      <div class="drawer_container">
        <MentorList @mentorInfo="mentorInfo"/>
      </div>
    </el-drawer>

    <MentorEdit
      :mentorEditVisible="mentorEditVisible"
      :mentorData0="mentorData"
      @close="mentorEditClose"
      @success="mentorEditSubmit"
    ></MentorEdit>

    <mentor-recommend :mentorRecommendVisible="mentorRecommendVisible" @close="mentorRecommendClose" @reload="mentorRecommendReload"></mentor-recommend>
  </d2-container>
</template>

<script>
import api from '@/api/vip.js'
import mixins from '@/plugin/mixins'
import MentorEdit from './components/MentorEdit.vue'
import MentorList from './components/MentorList.vue'
import mentorRecommend from './components/MentorRecommend.vue'
import { mapState } from 'vuex'
export default {
  name: 'Mentor',
  components: { MentorEdit, MentorList, mentorRecommend },
  mixins: [
    mixins
  ],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data: () => {
    return {
      search: '',
      pageNum: 1,
      pageSize: 0,
      total: 0,
      sortCol: '',
      sort: '',
      loading: false,
      mentorList: [],
      mentorRecommendVisible: false,
      mentorEditVisible: false,
      canApplyCount: 0,
      mentorData: {
        division: [],
        company: [],
        location: [],
        country: [],
        wxId: null,
        email: null,
        linkedinPath: null
      },

      // 抽屉
      mentorDrawer: false
    }
  },
  mounted () {
    this.sizeCount()
    this.Topage(1)
    // this.drawerTopage(1)
  },
  methods: {
    sizeCount () {
      const maxH = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight
      const maxW = this.$refs.d2.offsetWidth
      const hnum = Math.round(maxH / 360)
      const wnum = parseInt(maxW / 320)
      this.pageSize = Math.round(hnum * wnum)
    },
    async Topage (i) {
      this.getReferrerCount()
      i == 1 ? this.pageNum = 1 : ''
      const params = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sortCol: '',
        sort: ''
      }
      this.loading = true
      api.getMentorListV2(params).then(res => {
        this.loading = false
        console.log(res)
        if (res.code == '200') {
          this.total = res.data.total
          this.mentorList = res.data.rows
        } else {
          this.$message.error(res.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    addMentor () {
      this.mentorData.mentorStatus = '0'
      this.mentorData.businessCareer = 0
      this.mentorData.businessGp = 0
      this.mentorData.businessOral = 0
      this.mentorData.businessCfa = 0
      this.mentorData.businessFinance = 0
      this.mentorData.businessTutoring = 0
      this.mentorData.businessLetterModify = 0
      this.mentorEditVisible = true
    },
    mentorEditClose () {
      this.mentorEditVisible = false
    },
    mentorEditSubmit () {
      this.Topage(1)
      this.mentorEditVisible = false
    },
    handleClick (id) {
      this.$router.push({ name: 'MentorDetail', query: { mentorId: id } })
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    // 抽屉
    showMentor () {
      this.mentorDrawer = true
    },
    handleClose () {
      this.mentorDrawer = false
    },
    mentorInfo (id) {
      this.handleClose()
      this.handleClick(id)
    },
    mentorRecommendReload () {
      this.getReferrerCount()
    },
    mentorRecommend () {
      this.mentorRecommendVisible = true
    },
    mentorRecommendClose () {
      this.mentorRecommendVisible = false
    },
    getReferrerCount () {
      api.getReferrerCount().then(res => {
        console.log(res.data)
        this.canApplyCount = res.data.canApplyCount
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$background-color:#F4F4F4;
.d2_container{
  width:100%;
  height:100%;
}
.user_container{
  display: flex;
  .user_card_list{
    flex:1;
    height:100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .user_card_item{
      margin-bottom:20px;
      margin-right:20px;
      width:240px;
      height:300px;
      background: #FFF;
      border-radius: 10px;
      padding:30px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      .user_card_info_pic{
        position: relative;
        margin-bottom:30px;
        .sex_icon{
          position: absolute;
          bottom:5px;
          right:0;
          width:28px;
          height:28px;
          font-size:16px;
          color:#FFF;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .sex_icon_mars{background-color: #8CC4FC;}
        .sex_icon_venus{background-color: #FFB6C1;}
      }
      .user_card_info_name{
        font-size:20px;
        font-weight:700;
      }
    }
    .user_card_item_border{
      position:absolute;
      width:270px;
      height:335px;
      border: 2px solid $background-color;
      border-radius: 10px;
    }
    .user_card_item:hover .user_card_item_border{
      border: 2px solid #FF8C00;
    }
  }
  .user_statistics_bg{
    margin-right:-20px;
    width:320px;
  }
}

.drawer_container{
  padding:20px;
}
</style>
