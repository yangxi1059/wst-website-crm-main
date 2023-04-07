<!--
 * @Author: 库建华
 * @Date: 2020-06-17 15:08:49
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-07 10:55:42
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="一对多课程详情" :visible.sync="detailVisible" width="900px" :before-close="close">
        <el-form :data="mentorData" >
          <div style="display:flex">
            <el-avatar style="min-width:100px" :src="mentorData.imgUrl" fit="cover" :size="100"></el-avatar>
            <div style="font-size:14px;margin-left:40px">
              <p class=""><span style="font-weight:600;color:#000;min-width:100px;display:inline-block">导师名：</span>{{mentorData.lessonMentorName}}</p>
              <p class="" style="margin-top:20px"><span style="font-weight:600;color:#000;min-width:100px;display:inline-block">课程名：</span>{{mentorData.lessonName}}</p>
              <div style="display:flex;margin-top:20px">
                <p class="" style=""><span style="font-weight:600;color:#000;min-width:100px;display:inline-block">开始时间：</span>{{mentorData.startTime}}</p>
                <p class="" style="margin-left:40px"><span style="font-weight:600;color:#000;min-width:100px;display:inline-block">总结时间：</span>{{mentorData.summaryLength}}分钟</p>
              </div>
              <p class="" style="margin-top:20px"><span style="font-weight:600;color:#000;min-width:100px;display:inline-block">课程内容：</span>{{mentorData.lessonIntro || '暂无'}}</p>
              <p class="" style="margin-top:20px"><span style="font-weight:600;color:#000;min-width:100px;display:inline-block">ZoomId：</span>{{mentorData.lessonKey || '暂无'}}</p>
            </div>
          </div>
          <el-table
            :data="mentorData.qaArr"
            stripe
            style="width: 100%;margin-top:20px">
            <el-table-column
              width="150"
              prop="startTime"
              label="QA时间"
              >
              <template slot-scope="scope">
                  <p>{{scope.row.startTime.slice(11,16)}} - {{scope.row.endTime.slice(11,16)}}</p>
                </template>
            </el-table-column>
            <el-table-column
              label="学员头像"
              >
              <template slot-scope="scope">
                <el-avatar :src="scope.row.imgUrl"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column
              label="学员微信">
                <template slot-scope="scope">
                  <p>{{scope.row.menteeAcc || '暂无报名学员'}}</p>
                </template>
            </el-table-column>
            <el-table-column
              label="学员姓名">
                <template slot-scope="scope">
                  <p v-if="!scope.row.nickName">{{'暂无报名学员'}}</p>
                  <div v-else slot="reference" style="cursor:pointer" class="name-wrapper">
                    <el-tag  size="medium" @click="menteeDetail(scope.row)">{{ scope.row.nickName }}</el-tag>
                  </div>
                </template>
            </el-table-column>
            <el-table-column
              width="160"
              label="PM">
                <template slot-scope="scope">
                  <p>{{scope.row.servicesName || '暂无报名学员'}}</p>
                </template>
            </el-table-column>
            <el-table-column
              width="180"
              label="申请时间">
                <template slot-scope="scope">
                  <p >{{scope.row.applyTime || '暂无报名学员'}}</p>
                </template>
            </el-table-column>
          </el-table>
        </el-form>
        <span slot="footer">
            <el-button @click="close">关 闭</el-button>
            <el-button v-if="!mentorData.applyId && mentorData.applyNum > 0" @click="submit" type="primary">发起申请</el-button>
            <el-button v-if="mentorData.applyId" @click="alertApply" type="info">申请详情</el-button>

        </span>
    </el-dialog>
    <menteeDetail :menteeDetailVisible="menteeDetailVisible" :menteeDetailData="menteeDetailData" @close="menteeDetailClose" />
    <auditOneToOne :auditOneToOneVisible="auditOneToOneVisible"  :pkId="pkId" @close="auditClose" @success="auditSuccess" />
    <oneTooneDetail
      :oneTooneDetailVisible="oneTooneDetailVisible"
      :applyData="applyData"
      :recall="recall"
      @close="oneTooneClose"
    />
  </div>
</template>

<script>
import menteeDetail from './menteeDetailOneToOne.vue'
import auditOneToOne from './successOneToOne.vue'
import oneTooneDetail from '../../apply_audit/oneToone/oneTooneDetail.vue'
import api from '@/api/backlog.js'
import api2 from '@/api/vip.js'

export default {
  name: 'mentor',
  components: {
    menteeDetail, auditOneToOne, oneTooneDetail
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    lessonData: {
      type: Number
    }
  },
  watch: {
    detailVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  data () {
    return {
      mentorData: {},
      pkId: '',
      applyData: {},
      reapplyList: {
        type: Array,
        default: () => { return [] }
      },
      oneTooneDetailVisible: false,
      menteeDetailVisible: false,
      auditOneToOneVisible: false,
      menteeDetailData: {}
    }
  },

  methods: {
    initPage () {
      this.pkId = JSON.parse(JSON.stringify(this.lessonData))
      const data = {
        pkId: this.pkId
      }
      api.getOneTooneLessonsDetail(data).then(res => {
        console.log(res, 'yx46546545')
        this.mentorData = res.data
      })
      // this.mentorData = JSON.parse(JSON.stringify(this.lessonData))
      // api.lessonOneToOneDetail(data).then(res => {
      //     this.mentorData = res;
      //     console.log(res)
      // })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.mentorData = {

      }
    },
    recall (v) {
      console.log('撤回', v)
      this.$confirm('此操作将撤回该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api2.cancelApplyByApplyId(v.applyId).then((res) => {
            console.log('撤回返回', res)
            this.recommendDetailVisible = false
            this.oneTooneDetailVisible = false
            this.initPage()
          })
        })
        .catch(() => {})
    },
    menteeDetail (v) {
      this.menteeDetailData = v
      this.menteeDetailVisible = true
    },
    menteeDetailClose () {
      this.menteeDetailVisible = false
    },
    auditClose () {
      this.auditOneToOneVisible = false
    },
    auditSuccess () {
      this.auditOneToOneVisible = false
      this.initPage()
    },
    submit () {
      console.log('submit')
      this.auditOneToOneVisible = true
      // this.$emit('submit')
    },
    oneTooneClose () {
      this.oneTooneDetailVisible = false
    },
    alertApply () {
      api2.getApplyDetailByApplyId(this.mentorData.applyId).then((res) => {
        console.log(res.data)
        this.applyData = res.data.apply
        this.oneTooneDetailVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
