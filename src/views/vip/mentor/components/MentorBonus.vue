<!--
 * @Author: kaan
 * @Date: 2022-01-25 15:23:58
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-01 16:43:39
 * @Version:
 * @Description:
-->

<template>
  <div>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Offer" name="first">
            <div class="search mb20" >
              <el-select size="mini" @change="initPage()" class="mr10" clear v-model="timeSelect" placeholder="请选择">
                <el-option
                  v-for="item in timeSelectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-button
                icon="el-icon-search"
                class="mr10"
                size="mini"
                plain
                @click="initPage()"
              >GO</el-button> -->
            </div>
            <div class="mb20">
              <el-tag class="mr10" type="primary">Offer Mark: {{offerDataObj.offerScore}}</el-tag>
              <el-tag class="mr10" type="primary">总收入: ${{offerDataObj.usdTotal || 0}} 和 ￥{{offerDataObj.cnyTotal || 0}}</el-tag>
              <el-tag class="mr10" type="primary">Payment rate: {{offerDataObj.bonusRate*100}}%</el-tag>
              <el-tag class="mr10" type="primary">Bonus(Offer): ${{toDecimal(((offerDataObj.usdTotal || 0)*offerDataObj.bonusRate))}} 和 ￥{{toDecimal(((offerDataObj.cnyTotal || 0)*offerDataObj.bonusRate))}}</el-tag>
              <el-button type="success" size="mini" :disabled="offerDataObj.canApplyStatus !== '1'" @click="applyOffer">申请</el-button>
              <el-button type="info" size="mini"  @click="downLoad()">导出行业课表</el-button>
            </div>
            <div class="mb20" style="border-radius:5px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);white-space: pre-line;padding:20px;display:flex;">
              <div style="flex:1;white-space:pre-wrap">
                <div>Bonus计算规则： </div>
                <div>Score&lt;1分：年终奖为0</div>
                <div>1≤Score≤5:年终奖=WST年总收入*5%</div>
                <div>5&lt;Score≤10:年终奖=WST年总收入*8%</div>
                <div>10&lt;Score≤15：年终奖=WST年总收入*12%</div>
                <div>15&lt;Score≤20：年终奖=WST年总收入*16%</div>
                <div>20&lt;Score≤25：年终奖=WST年总收入*20%</div>
                <div>25&lt;Score：年终奖=WST年总收入*30%</div>
              </div>
              <div style="flex:1;white-space:pre-wrap">
                <div>offer分评判规则：当学生拿到offer时，导师与学生进行课程时数</div>
                <div>10≤Hour，评定为1分</div>
                <div>5≤Hour&lt;10，评定为1/2分 </div>
                <div>1≤Hour&lt;5，评定为1/3分 </div>
                <div>Hour&lt;1，无分 </div>
                <div>如果有多名导师，则该offer分别计算分给对应导师</div>
              </div>
            </div>
            <el-tag style="100%" type="danger">课程培训Offer</el-tag>
            <el-table
              stripe
              class="mb20"
              size="small"
              :data="trainOfferArr"
              align="center"
              border
              v-loading = "pictLoading"
              element-loading-background = "rgba(0, 0, 0, 0.8)"
              element-loading-text = "数据正在加载中"
              element-loading-spinner = "el-icon-loading"
              style="width: 100%">
              <el-table-column
                width="80"
                label="设置"
              >
                <template slot-scope="scope">
                  <el-tooltip :content="'设置: ' + (scope.row.ignoreStatus=='0'?'有效':'无效')" placement="top">
                    <div class="padRight" @click="setCancle(scope.row)">
                      <el-switch
                        v-if="offerDataObj.canApplyStatus == '1'"
                        v-model="scope.row.ignoreStatus"
                        active-color="#ff4949"
                        inactive-color="#13ce66"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="是否计入Offer分"
                prop="ignoreStatus"
              >
                <template slot-scope="scope">
                  <span  >{{scope.row.ignoreStatus == '0'?'计入':'不计入'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="获得offer日期"
                prop="offerReceiveDate"
                sortable
              >
              </el-table-column>
              <el-table-column
                label="学员名"
                prop="menteeName"
                sortable
              >
              </el-table-column>
              <el-table-column
                label="offer得分"
                prop="offerScore"
              >
              </el-table-column>
              <el-table-column
                label="公司"
                prop="companyName"
              >
              </el-table-column>

              <el-table-column
                label="部门"
                prop="divisionName"
              >
              </el-table-column>

              <el-table-column
                label="城市"
                prop="cityName"
              >
              </el-table-column>

              <el-table-column
                label="凭证"
                prop="resultVoucher"
              >
                <template slot-scope="scope">
                  <el-button size="mini" @click="preview(scope.row.resultVoucher)">预览</el-button>
                </template>
              </el-table-column>

            </el-table>
            <el-tag style="100%" type="danger">内推面试Offer</el-tag>
            <el-table
              stripe
              size="small"
              align="center"
              :data="internalOfferArr"
              border
              v-loading = "pictLoading"

              element-loading-background = "rgba(0, 0, 0, 0.8)"
              element-loading-text = "数据正在加载中"
              element-loading-spinner = "el-icon-loading"
              style="width: 100%">
              <el-table-column
                label="获得offer日期"
                prop="offerReceiveDate"
                sortable
              >
              </el-table-column>
              <el-table-column
                label="学员名"
                prop="menteeName"
                sortable
              >
              </el-table-column>
              <el-table-column
                label="offer得分"
                prop=""
              >
                <template>
                  <span>1</span>
                </template>
              </el-table-column>
              <el-table-column
                label="公司"
                prop="companyName"
              >
              </el-table-column>

              <el-table-column
                label="部门"
                prop="divisionName"
              >
              </el-table-column>

              <el-table-column
                label="城市"
                prop="cityName"
              >
              </el-table-column>

              <el-table-column
                label="凭证"
                prop="resultVoucher"
              >
                <template slot-scope="scope">
                  <el-button size="mini" @click="preview(scope.row.resultVoucher)">预览</el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
          <el-tab-pane label="面试（次）" name="second">
            <div class="mb20">
              <el-tag class="mr10" type="primary">Interview: {{interviewArr.length}} times</el-tag>
              <el-tag class="mr10" type="primary">Bonus(interview): ${{interviewObj.bonus}}</el-tag>
              <el-button
                icon="el-icon-search"
                class="mr10"
                size="mini"
                plain
                @click="initPage()"
              >GO</el-button>
            </div>
            <div class="mb20" style="border-radius:5px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);white-space: pre-line;padding:20px">内推奖金规则：
              导师（不局限于是学员的课程导师）帮助WST学员拿到
              面试（非笔试），不限轮次，每次均可获得100USD</div>
            <el-table
              stripe
              class="mb20"
              size="small"
              :data="interviewArr"
              align="center"
              border
              v-loading = "pictLoading"

              element-loading-background = "rgba(0, 0, 0, 0.8)"
              element-loading-text = "数据正在加载中"
              element-loading-spinner = "el-icon-loading"
              style="width: 100%">
              <el-table-column
                label="面试时间"
                prop="interviewDate"
                sortable
              >
              </el-table-column>
              <el-table-column
                label="学员名"
                prop="menteeName"
                sortable
              >
              </el-table-column>
              <el-table-column
                label="轮次"
                prop="timesName"
              >
              </el-table-column>
              <el-table-column
                label="公司"
                prop="companyName"
              >
              </el-table-column>
              <el-table-column
                label="申请季"
                prop="applySeason"
              >
              </el-table-column>

              <el-table-column
                label="部门"
                prop="divisionName"
              >
              </el-table-column>

              <el-table-column
                label="城市"
                prop="cityName"
              >
              </el-table-column>

              <el-table-column
                label="凭证"
                prop="resultVoucher"
              >
                <template slot-scope="scope">
                  <el-button size="mini" @click="preview(scope.row.resultVoucher)">预览</el-button>
                  <el-button type="success" size="mini" v-if="scope.row.canApplyStatus == '1'" @click="applyInterview(scope.row)">申请</el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
        </el-tabs>

        <ApplyBonus :applyOfferVisible="applyOfferVisible" :offerDataObj="offerDataObj" :applyData="applyData" :mentorData="mentorData" @submit="applyOfferSubmit" @close="applyOfferClose" />
        <ApplyBonusInterview :applyBonusInterviewVisible="applyBonusInterviewVisible" :interviewObj="interviewObj" :applyData2="applyData2" :mentorData="mentorData" @submit="applyBonusInterviewSubmit" @close="applyBonusInterviewClose" />
    </div>
  </div>
</template>

<script>

import mixins from '@/plugin/mixins'
import file from '@/libs/file'
import ApplyBonus from './ApplyBonus'
import ApplyBonusInterview from './ApplyBonusInterview.vue'
import apiDic from '@/api/dictionary.js'
import util from '@/libs/util'
import api from '@/api/vip.js'
export default {
  props: {
    mentorData: {}
  },
  components: { ApplyBonus, ApplyBonusInterview },
  mixins: [mixins],
  data () {
    return {
      applyBonusInterviewVisible: false,
      activeName: 'first',
      fromDate: '',
      toDate: '',
      applyData: {},
      applyData2: {},
      trainOfferArr: [],
      internalOfferArr: [],
      interviewArr: [],
      offerDataObj: {},
      interviewObj: {},
      pictLoading: false,
      timeSelect: `${new Date().getFullYear() - 1}&${new Date().getFullYear()}`,
      num: 1,
      applyOfferVisible: false,
      applyOInterviewVisible: false,
      timeSelectList: [
        {
          label: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`,
          value: `${new Date().getFullYear()}&${new Date().getFullYear() + 1}`
        },
        {
          label: `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`,
          value: `${new Date().getFullYear() - 1}&${new Date().getFullYear()}`
        },
        {
          label: `${new Date().getFullYear() - 2} - ${new Date().getFullYear() - 1}`,
          value: `${new Date().getFullYear() - 2}&${new Date().getFullYear() - 1}`
        }
      ]

    }
  },
  watch: {
    mentorData: function (val) {
      if (val) {
        this.timeSelect = `${new Date().getFullYear() - 1}&${new Date().getFullYear()}`
        // this.init()
        this.initPage()
      }
    }
  },
  mounted () {
    // this.init()
    // this.initPage();
  },
  methods: {
    init () {

    },
    initPage () {
      console.log(this.timeSelect)
      if (this.num == 1) {
        this.pictLoading = true
        const data = {
          fromDate: `${this.timeSelect.split('&')[0]}-09-01`,
          toDate: `${this.timeSelect.split('&')[1]}-08-31`,
          mentorId: this.mentorData.mentorId
        }
        api.getVipBonus(data).then(res => {
          console.log(res)
          this.offerDataObj = res.data
          this.internalOfferArr = res.data.internalOfferArr
          this.trainOfferArr = res.data.trainOfferArr
          this.pictLoading = false
          this.$forceUpdate()
        })
      } else {
        this.pictLoading = true
        const data = {
          fromDate: '',
          toDate: '',
          mentorId: this.mentorData.mentorId
        }
        api.getInterviewBonus(data).then(res => {
          console.log(res)
          this.$nextTick(() => {
            this.interviewObj = res.data
            this.interviewArr = res.data.interviewArr
          })
          this.pictLoading = false
        })
      }
    },
    close () {
      this.activeName = 'first'
      this.trainOfferArr = []
      this.internalOfferArr = []
      this.interviewArr = []
      this.offerDataObj = {}
      this.interviewObj = {}
      this.timeSelect = ''
      this.num = 1
      this.$emit('close')
    },
    preview (path) {
      file.preview(path)
      //  downloadFun(path, url => {
      //   window.open(url);
      // });
    },
    toDecimal (x) {
      var f = parseFloat(x)

      if (isNaN(f)) {
        return false
      }
      var f = Math.round(x * 100) / 100
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    },
    handleClick (tab, event) {
      console.log(tab, event)
      if (tab.name == 'first') {
        this.num = 1
        this.initPage()
      } else {
        this.num = 2
        this.initPage()
      }
    },
    async applyOffer () {
      if (!this.timeSelect) {
        this.$message.error('请选择具体周期~~')
        return false
      } else {
        console.log(this.offerDataObj.usdTotal && this.offerDataObj.cnyTotal)
        if (this.offerDataObj.usdTotal && !this.offerDataObj.cnyTotal) {
          this.applyData = {
            fundType: 'usd',
            fundWage: ((this.offerDataObj.usdTotal || 0) * this.offerDataObj.bonusRate).toFixed(2) * 1,
            period: `${this.timeSelect.split('&')[0]}-${this.timeSelect.split('&')[1]}`,
            bonusType: 'offer',
            singleType: true
          }
          this.applyOfferVisible = true
        } else if (!this.offerDataObj.usdTotal && this.offerDataObj.cnyTotal) {
          this.applyData = {
            fundType: 'cny',
            fundWage: ((this.offerDataObj.cnyTotal || 0) * this.offerDataObj.bonusRate).toFixed(2) * 1,
            period: `${this.timeSelect.split('&')[0]}-${this.timeSelect.split('&')[1]}`,
            bonusType: 'offer',
            singleType: true
          }
          this.applyOfferVisible = true
        } else if (this.offerDataObj.usdTotal && this.offerDataObj.cnyTotal) {
          this.applyData = {
            fundType: 'cny',
            period: `${this.timeSelect.split('&')[0]}-${this.timeSelect.split('&')[1]}`,
            bonusType: 'offer',
            singleType: false
          }
          await apiDic.getLatestSysRate({ fromCurrency: 'usd', toCurrency: 'cny' }).then(res => {
            console.log(res)
            this.applyData.fundWageCny = ((this.offerDataObj.usdTotal || 0) * this.offerDataObj.bonusRate * res.data.rate + (this.offerDataObj.cnyTotal || 0) * this.offerDataObj.bonusRate).toFixed(2) * 1
            this.applyData.fundWage = this.applyData.fundWageCny
          })
          await apiDic.getLatestSysRate({ fromCurrency: 'cny', toCurrency: 'usd' }).then(res => {
            console.log(res)
            this.applyData.fundWageUsd = ((this.offerDataObj.usdTotal || 0) * this.offerDataObj.bonusRate + (this.offerDataObj.cnyTotal || 0) * this.offerDataObj.bonusRate * res.data.rate).toFixed(2) * 1
          })
          this.applyOfferVisible = true
        } else {
          this.$message.error('无可申请金额~~')
        }
      }
    },
    applyInterview (row) {
      console.log(row)
      if (!this.timeSelect) {
        this.$message.error('请选择具体周期~~')
        return false
      } else {
        if (this.interviewObj.bonus) {
          this.applyData2 = {
            fundType: 'usd',
            fundWage: 100,
            // period:`${this.timeSelect.split('&')[0]}-${this.timeSelect.split('&')[1]}`,
            bonusType: 'interview',
            menteeName: row.menteeName,
            timesName: row.timesName,
            companyName: row.companyName,
            divisionName: row.divisionName,
            applySeason: row.applySeason,
            cityName: row.cityName,
            resultId: row.pkId
          }
          this.applyBonusInterviewVisible = true
        } else {
          this.$message.error('无可申请金额~~')
        }
      }
    },
    applyOfferSubmit () {
      this.applyOfferVisible = false
      this.initPage()
    },
    applyOfferClose () {
      this.applyOfferVisible = false
    },
    applyBonusInterviewSubmit () {
      this.applyBonusInterviewVisible = false
      this.initPage()
    },
    applyBonusInterviewClose () {
      this.applyBonusInterviewVisible = false
    },
    downLoad () {
      // let params ={
      //   kpiPeriod:this.MyData.select_data
      // }
      // axios.getMonthRevenueForJerry(params).then(res=>{
      //   console.log(res)
      // })
      // downloadALL() {
      const fileName = '行业课表_' + this.mentorData.mentorName
      var xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open(
        'GET',
        `${this.$apiUrl}mentor/bonus/careerLesson/export?fromDate=${this.timeSelect.split('&')[0]}-09-01&toDate=${this.timeSelect.split('&')[1]}-08-31&mentorId=${this.mentorData.mentorId}`,
        true
      )
      // 设置请求头参数的方式,如果没有可忽略此行代码
      const token = util.sessions.get('token')
      xhr.setRequestHeader('Authorization', token)
      xhr.setRequestHeader('version', this.$apiVersion)
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        // 如果请求执行成功
        if (this.status == 200) {
          var blob = this.response
          var filename = fileName + '.xlsx' // 如123.xlsx
          var a = document.createElement('a')
          // blob.type = "multipart/form-data";
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
    // },
    },
    setCancle (row) {
      console.log(row)
      if (row.ignoreStatus == '1') {
        this.$confirm('此操作将使此节课不记录bonus奖金?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.editBonusStatus(this.mentorData.mentorId, row.pkId).then(res => {
            this.initPage()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          row.ignoreStatus == '0'
        })
      } else if (row.ignoreStatus == '0') {
        api.cancelIgnoreBonusStatus(row.ignoreId).then(res => {
          this.initPage()
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
