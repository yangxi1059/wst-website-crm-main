<!--
 * @Author: 杨曦
 * @Date: 2019-07-25 14:59:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-02 15:05:47
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="set-course">
    <el-drawer  :visible.sync="internshipVisible" size="90%" :before-close="close">
      <div class="header" style="position:relative" slot="title">
        实习单位：
        <el-button
          class="add-offer-btn"
          @click="addPeriod"
          type="primary"
          plain
          round
          size="mini"
        >新增周期</el-button>
      </div>
      <el-card class="mb20">
        <el-form
          :model="internshipData"
          class="yx_noBottom_form"
          :rules="rules"
          size="mini"
          ref="ruleForm"
          inline
          label-width="120px"
        >
          <el-form-item label="实习单位ID：" prop="internship">
            <el-input
              style="width:180px"
              v-model="internshipData.internship"
              maxlength="99"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="实习单位名称：" prop="internshipDesc">
            <el-input style="width:150px" v-model="internshipData.internshipDesc" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="是否启用：" prop="recordStatus">
            <el-select style="width:150px" v-model="internshipData.recordStatus" filterable placeholder="请选择是否启用">
              <el-option
                v-for="item in [{itemName:'是',itemValue:'1'},{itemName:'否',itemValue:'0'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="ml20" @click="saveI" size="mini">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        :row-class-name="tableRowClassName"
      >
        <el-table-column align="center" prop="internshipName" label="Title">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.internshipId == editId"
              v-model="scope.row.internshipName"
              size="mini"
              placeholder="如：待定-4周"
            ></el-input>
            <el-popover v-else width="400" trigger="hover" :content="scope.row.internshipName">
              <p size="mini" type="text" slot="reference">{{scope.row.internshipName}}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="internshipTime" label="实习周期" :width="colWidth">
          <template slot-scope="scope">
            <div v-if="scope.row.internshipId == editId">
              <el-select
                size="mini"
                v-model="scope.row.internshipTime"
                filterable
                placeholder="请选择"
                :style="{width:selectWidth}"
                :disabled="!!scope.row.internshipTime"
              >
                <el-option
                  v-for="item in internship_duration"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <iconTooltip value="internship_duration"></iconTooltip>
            </div>
            <p v-else class>{{scope.row.internshipTimeName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="costType" label="实习方式" :width="colWidth">
          <template slot-scope="scope">
            <div v-if="scope.row.internshipId == editId">
              <el-select
                size="mini"
                v-model="scope.row.internshipLocation"
                filterable
                placeholder="请选择"
                :style="{width:selectWidth}"
                :disabled="!!scope.row.internshipLocation"
              >
                <el-option
                  v-for="item in internship_location_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <iconTooltip value="internship_location_type"></iconTooltip>
            </div>
            <p v-else class>{{scope.row.internshipLocationName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="city" label="所在城市" :width="colWidth">
          <template slot-scope="scope">
            <div v-if="scope.row.internshipId == editId">
              <el-select
                size="mini"
                v-model="scope.row.city"
                filterable
                placeholder="请选择"
                :style="{width:selectWidth}"
                :disabled="!!scope.row.city"
              >
                <el-option
                  v-for="item in internship_city"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <iconTooltip value="city"></iconTooltip>
            </div>
            <p v-else class>{{scope.row.cityName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="costType" label="实习成本类型" :width="colWidth">
          <template slot-scope="scope">
            <div v-if="scope.row.internshipId == editId">
              <el-select
                @change="changeProfitMargin2(scope.row,scope.$index)"
                size="mini"
                v-model="scope.row.costType"
                filterable
                placeholder="请选择"
                :style="{width:selectWidth}"
              >
                <el-option
                  v-for="item in bill_currency_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <iconTooltip value="bill_currency_type"></iconTooltip>
            </div>
            <p v-else class>{{scope.row.costTypeName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="costPrice" label="实习成本">
          <template slot-scope="scope">
            <el-input
              @input="changeProfitMargin(scope.row,scope.$index)"
              type="number"
              size="mini"
              v-if="scope.row.internshipId == editId"
              :controls="false"
              v-model="scope.row.costPrice"
              :style="{width:'100px'}"
            ></el-input>
            <p v-else class>{{scope.row.costPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="priceType" label="价格货币" :width="colWidth">
          <template slot-scope="scope">
            <div v-if="scope.row.internshipId == editId">
              <el-select
                @change="changeProfitMargin(scope.row,scope.$index)"
                size="mini"
                v-model="scope.row.priceType"
                filterable
                placeholder="请选择"
                :style="{width:selectWidth}"
              >
                <el-option
                  v-for="item in bill_currency_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
              <iconTooltip value="bill_currency_type"></iconTooltip>
            </div>
            <p v-else class>{{scope.row.priceTypeName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="vipPrice" label="VIP价格">
          <template slot-scope="scope">
            <el-input
              class="deal"
              type="number"
              @input="changeProfitMargin(scope.row,scope.$index)"
              size="mini"
              v-if="scope.row.internshipId == editId"
              :controls="false"
              v-model="scope.row.vipPrice"
              :style="{width:'100px'}"
            ></el-input>
            <p v-else class>{{scope.row.vipPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" style="width:120px"  prop="novipPrice" label="Non-VIP价格">
          <template slot-scope="scope">
            <el-input
              class="deal"
              type="number"
              size="mini"
              v-if="scope.row.internshipId == editId"
              :controls="false"
              v-model="scope.row.novipPrice"
              :style="{width:'100px'}"
            ></el-input>
            <p v-else class>{{scope.row.novipPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="利润率">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.profitRateNote" placement="top">
              <p class="123" v-if="scope.row.profitMargin < 20" style="color:#c32e47">{{scope.row.profitMargin || '?'}}%</p>
              <p class="234" v-else >{{scope.row.profitMargin || '?'}}%</p>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="center"  label="备注">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-if="scope.row.internshipId == editId"
              :controls="false"
              v-model="scope.row.note"
              :style="{width:'100px'}"
            ></el-input>
            <p v-else class>{{scope.row.note}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="internshipStatus" label="是否启用">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.internshipId == editId"
              size="mini"
              v-model="scope.row.internshipStatus"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in status"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
            <p v-else class>{{showStatus[scope.row.internshipStatus]}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="internshipStatus" label="介绍文件">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.internshipId && scope.row.internshipId != -1" size="mini" style="padding:0 15px" @click="fileAlert(scope.row)">{{scope.row.fileCount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="好评图">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.internshipId && scope.row.internshipId != -1" size="mini" style="padding:0 15px" @click="praiseAlert(scope.row)">{{scope.row.praiseCount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" prop="latestSignDate" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.internshipId !== editId">
              <el-button @click="copyInternship(scope.row)" type="text" size="mini">复制</el-button>
              <el-button @click="edit(scope.row.internshipId,scope.row)" type="text" size="mini">编辑</el-button>
              <el-button
                v-if="scope.row.internshipId !== -1"
                @click="delect(scope.row)"
                type="text"
                size="mini"
              >删除</el-button>
            </div>
            <div v-else>
              <el-button @click="save(scope.row)" type="text" size="mini">保存</el-button>
              <el-button @click="cancel" type="text" size="mini">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <fileAlert :fileVisible="fileVisible" :internshipId2="internshipId2" @close="fileAlertClose" @submit="fileAlertSubmit"></fileAlert>
    <praiseAlert :praiseVisible="praiseVisible" :internshipId2="internshipId2" @close="praiseAlertClose" @submit="praiseAlertSubmit"></praiseAlert>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import fileAlert from './fileAlert.vue'
import praiseAlert from './pariseAlert.vue'
import mixins from '@/plugin/mixins'

export default {
  props: {
    internshipVisible: {
      type: Boolean,
      default: false
    },
    internshipData: {
      type: Object
    }
  },
  mixins: [mixins],
  components: {
    fileAlert, praiseAlert
  },
  data: () => {
    return {
      status: [
        { itemValue: '1', itemName: '启用' },
        { itemValue: '0', itemName: '禁用' }
      ],
      showStatus: ['禁用', '启用'],
      internshipDataOld: 0,
      tableData: [],
      colWidth: '140px',
      selectWidth: '100px',
      editId: 0,
      rules: {},
      internshipId: null,
      internshipId2: {},
      bill_currency_type: [],
      internship_location_type: [],
      internship_duration: [],
      internship_city: [],
      rate: '',
      praiseVoucherMosaic: '',
      fileVisible: false,
      praiseVisible: false
    }
  },
  watch: {
    internshipVisible: function (val, old) {
      if (val) {
        this.Topage()
      }
    }
  },
  mounted () {
    this.internshipDataOld = 0
    this.pageInit()
    apiDic.getRate({
      currencyType: 'Usd'
    }).then(res => {
      console.log(res, 'yx**********45645')
      this.rate = res.data.orderRate1
    })
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.internship_location_type = await this.getDictionary('internship_location_type')
      this.internship_duration = await this.getDictionary('internship_duration')
      this.internship_city = await this.getDictionary('city')
    },
    Topage () {
      apiDic
        .getInternshipSubListByInternship(this.internshipData.internship)
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].profitRate < 20) {
              res.data[i].color = '#c32e47'
            }
            res.data[i].profitMargin = res.data[i].profitRate
          }
          this.tableData = res.data
          console.log(res.data, '1111111111111111111')
        })
    },
    close () {
      this.editId = 0
      this.internshipId2 = {}
      this.praiseVoucherMosaic = ''
      this.$emit('close')
    },
    changeProfitMargin2 (data,index) {
      if (data.costType == data.priceType) {
        console.log(((data.vipPrice / data.costPrice - 1)).toFixed(2) * 100)
        if (((data.vipPrice / data.costPrice - 1)).toFixed(2) * 100 < 20) {
          data.color = '#c32e47'
        }
        data.profitMargin = ((data.vipPrice / data.costPrice - 1) * 100).toFixed(2)
        data.profitMarginNew = ((data.vipPrice / data.costPrice - 1) * 100)
      } else {
        apiDic.getLatestSysRate({ fromCurrency: data.priceType, toCurrency: data.costType }).then((res) => {
          if (res.data.rate) {
            const rate = res.data.rate
            if (((data.vipPrice * rate / data.costPrice - 1)).toFixed(2) * 100 < 20) {
              data.color = '#c32e47'
            }
            data.profitMargin = (((data.vipPrice * rate) / data.costPrice - 1)).toFixed(2) * 100
            this.$set(this.tableData,index,data)
          } else {
            this.$message.error('此两种货币之间无法换算！！')
          }
        })
      }
      console.log(data)
    },
    changeProfitMargin (data,index) {
      if (data.costType == data.priceType) {
        console.log(((data.vipPrice / data.costPrice - 1)).toFixed(2) * 100)
        if (((data.vipPrice / data.costPrice - 1)).toFixed(2) * 100 < 20) {
          data.color = '#c32e47'
        }
        data.profitMargin = ((data.vipPrice / data.costPrice - 1) * 100).toFixed(2)
      } else {
        apiDic.getLatestSysRate({ fromCurrency: data.priceType, toCurrency: data.costType }).then((res) => {
          if (res.data.rate) {
            const rate = res.data.rate
            if ((((data.vipPrice * rate) / data.costPrice - 1)).toFixed(2) * 100 < 20) {
              data.color = '#c32e47'
            }
            data.profitMargin = (((data.vipPrice * rate) / data.costPrice - 1)).toFixed(2) * 100
            this.$set(this.tableData,index,data)
            console.log(data, 3333333333)
          } else {
            this.$message.error('此两种货币之间无法换算！！')
          }
        })
      }
      console.log(data)
    },
    addPeriod () {
      this.internshipDataOld = 0
      console.log(
        this.tableData,
        this.tableData.filter(v => v.internshipId == -1)
      )
      if (this.editId == 0) {
        if (!this.internshipData.internshipDesc) {
          this.$message({
            type: 'error',
            message: '请先填写实习单位名称'
          })
          return
        }
        this.editId = -1
        this.tableData.push({
          internshipId: -1,
          costType: 'usd',
          priceType: 'usd',
          internshipStatus: '1'
        })
      } else {
        this.$message({
          type: 'error',
          message: '你有一个项目未编辑完成'
        })
      }
    },
    fileAlert (row) {
      console.log(row, 'xy1454654564*********')
      this.fileVisible = true
      this.internshipId2 = row
    },
    edit (internship, internshipDataOld) {
      console.log(internship, internshipDataOld)
      if (!this.editId) {
        this.internshipDataOld = internshipDataOld.costPrice
        this.editId = internship
      } else {
        this.$message({
          type: 'error',
          message: '你有一个课程编辑还未保存'
        })
      }
    },
    cancel () {
      this.editId = 0
      this.Topage()
    },
    save (row) {
      console.log(row, this.tableData, this.internshipDataOld)
      if (this.internshipDataOld != row.costPrice) {
        if (this.internshipDataOld) {
          this.$confirm(`实习成本由${this.internshipDataOld}调整为${row.costPrice}，请确认是否继续保存？`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (
              !row.internshipName ||
              !row.internshipTime ||
              !row.internshipLocation ||
              !row.priceType ||
              !row.costType
            ) {
              this.$message({
                type: 'warning',
                message: '除备注外，所有项都必填'
              })
              return
            }
            const data = {
              internship: {
                internship: this.internshipData.internship,
                internshipDesc: this.internshipData.internshipDesc,
                recordStatus: this.internshipData.recordStatus
              }
            }
            if (row.internshipId === -1) {
              data.addList = [
                {
                  internshipName: row.internshipName,
                  internshipTime: row.internshipTime,
                  internshipLocation: row.internshipLocation,
                  city: row.city,
                  vipPrice: row.vipPrice,
                  priceType: row.priceType,
                  novipPrice: row.novipPrice,
                  note: row.note,
                  internshipStatus: row.internshipStatus,
                  costType: row.costType,
                  costPrice: row.costPrice || 0
                }
              ]
            } else {
              data.uptList = [
                {
                  internshipId: row.internshipId,
                  internshipName: row.internshipName,
                  internshipTime: row.internshipTime,
                  internshipLocation: row.internshipLocation,
                  city: row.city,
                  vipPrice: row.vipPrice,
                  priceType: row.priceType,
                  novipPrice: row.novipPrice,
                  note: row.note,
                  internshipStatus: row.internshipStatus,
                  costType: row.costType,
                  costPrice: row.costPrice
                }
              ]
            }
            this.$loading()
            console.log(data)
            apiDic.setInternship(data).then(res => {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.editId = 0
              this.internshipData.internship = res.data
              this.Topage()
              this.$emit('submit')
              this.$loading().close()
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
          })
        } else {
          if (
            !row.internshipName ||
                !row.internshipTime ||
                !row.internshipLocation ||
                !row.costType ||
                !row.priceType
          ) {
            this.$message({
              type: 'warning',
              message: '除备注外，所有项都必填'
            })
            return
          }
          const data = {
            internship: {
              internship: this.internshipData.internship,
              internshipDesc: this.internshipData.internshipDesc,
              recordStatus: this.internshipData.recordStatus
            }
          }
          if (row.internshipId === -1) {
            data.addList = [
              {
                internshipName: row.internshipName,
                internshipTime: row.internshipTime,
                internshipLocation: row.internshipLocation,
                city: row.city,
                vipPrice: row.vipPrice,
                priceType: row.priceType,
                novipPrice: row.novipPrice,
                note: row.note,
                internshipStatus: row.internshipStatus,
                costType: row.costType,
                costPrice: row.costPrice || 0
              }
            ]
          } else {
            data.uptList = [
              {
                internshipId: row.internshipId,
                internshipName: row.internshipName,
                internshipTime: row.internshipTime,
                internshipLocation: row.internshipLocation,
                city: row.city,
                vipPrice: row.vipPrice,
                priceType: row.priceType,
                novipPrice: row.novipPrice,
                note: row.note,
                internshipStatus: row.internshipStatus,
                costType: row.costType,
                costPrice: row.costPrice
              }
            ]
          }
          this.$loading()
          apiDic.setInternship(data).then(res => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.editId = 0
            this.internshipData.internship = res.data
            this.Topage()
            this.$emit('submit')
            this.$loading().close()
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        if (
          !row.internshipName ||
            !row.internshipTime ||
            !row.internshipLocation ||
            !row.costType ||
            !row.priceType
        ) {
          this.$message({
            type: 'warning',
            message: '除备注外，所有项都必填'
          })
          return
        }
        const data = {
          internship: {
            internship: this.internshipData.internship,
            internshipDesc: this.internshipData.internshipDesc,
            recordStatus: this.internshipData.recordStatus
          }
        }
        if (row.internshipId === -1) {
          data.addList = [
            {
              internshipName: row.internshipName,
              internshipTime: row.internshipTime,
              internshipLocation: row.internshipLocation,
              city: row.city,
              vipPrice: row.vipPrice,
              novipPrice: row.novipPrice,
              priceType: row.priceType,
              note: row.note,
              internshipStatus: row.internshipStatus,
              costType: row.costType,
              costPrice: row.costPrice || 0
            }
          ]
        } else {
          data.uptList = [
            {
              internshipId: row.internshipId,
              internshipName: row.internshipName,
              internshipTime: row.internshipTime,
              internshipLocation: row.internshipLocation,
              city: row.city,
              vipPrice: row.vipPrice,
              novipPrice: row.novipPrice,
              priceType: row.priceType,
              note: row.note,
              internshipStatus: row.internshipStatus,
              costType: row.costType,
              costPrice: row.costPrice
            }
          ]
        }
        this.$loading()
        console.log('提交：', data)
        apiDic.setInternship(data).then(res => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.editId = 0
          this.internshipData.internship = res.data
          this.Topage()
          this.$emit('submit')
          this.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    delect (row) {
      this.$confirm('此操作将永久删除该实习, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row)
          const data = {
            internship: {
              internship: this.internshipData.internship,
              internshipDesc: this.internshipData.internshipDesc,
              recordStatus: this.internshipData.recordStatus
            }
          }
          data.uptList = [
            {
              internshipId: row.internshipId,
              delFlag: '1'
            }
          ]
          apiDic
            .setInternship(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.editId = 0
              this.Topage()
              this.$emit('submit')
              this.$loading().close()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    saveI () {
      const data = {
        internship: {
          internship: this.internshipData.internship,
          internshipDesc: this.internshipData.internshipDesc,
          recordStatus: this.internshipData.recordStatus
        }
      }
      apiDic
        .setInternship(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.editId = 0
          this.praiseVoucherMosaic = ''
          this.Topage()
          this.$emit('submit')
          this.$loading().close()
        })
        .catch(err => {
          console.log(err)
        })
    },
    internshipTimeChange (item) {
      console.log(item)
      item.internshipName =
        this.internshipData.internshipDesc +
        '-' +
        this.internship_duration.filter(
          v => v.itemValue == item.internshipTime
        )[0].itemName
    },
    tableRowClassName ({ row }) {
      if (row.internshipStatus == 0) {
        return 'colorR'
      }
    },
    fileAlertClose () {
      this.fileVisible = false
    },
    praiseAlertClose () {
      this.praiseVisible = false
    },
    fileAlertSubmit () {
      this.Topage()
    },
    praiseAlertSubmit () {
      this.Topage()
    },
    praiseAlert (data) {
      this.praiseVisible = true
      this.internshipId2 = data
      console.log(data)
    },
    copyInternship (row) {
      this.internshipDataOld = 0
      console.log(
        this.tableData,
        this.tableData.filter(v => v.internshipId == -1)
      )
      if (this.editId == 0) {
        if (!this.internshipData.internshipDesc) {
          this.$message({
            type: 'error',
            message: '请先填写实习单位名称'
          })
          return
        }
        this.editId = -1
        this.tableData.push({
          internshipId: -1,
          costType: row.costType || 'usd',
          internshipStatus: row.internshipStatus || '1',
          internshipName: row.internshipName,
          internshipTime: row.internshipTime,
          internshipLocation: row.internshipLocation,
          city: row.city,
          vipPrice: row.vipPrice,
          novipPrice: row.novipPrice,
          priceType: row.priceType,
          note: row.note,
          costPrice: row.costPrice || 0
        })
      } else {
        this.$message({
          type: 'error',
          message: '你有一个项目未编辑完成'
        })
      }
    }
  }
}
</script>

<style>
  .deal .el-input__inner::-webkit-outer-spin-button::-webkit-outer-spin-button,
  .deal .el-input__inner::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
    }
  .deal .el-input__inner[type="number"]{
      -webkit-appearance: textfield !important;
  }
  .yx_noBottom_form .el-form-item--mini.el-form-item{
    margin-bottom: 0px;
  }
</style>
