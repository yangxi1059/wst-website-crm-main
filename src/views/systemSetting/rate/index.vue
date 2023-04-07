<template>
  <d2-container v-loading="loading">
    <div class="rate">
        <el-divider content-position="left">系统汇率（出账）</el-divider>
        <div class="search_page">
        <div class="search">
            <el-button
            icon="el-icon-circle-plus-outline"
            class="mr10 "
            size="mini"
            plain
            @click="addRate"
            >设置</el-button>
        </div>
        </div>
        <ul>
        <li v-for="(item,i) in sysRateList" :key="i" class="li_card">
            <el-card class="box_card">
            <img class="rate_icon" :src="currencyList[item.fromCurrency]"><span>{{item.fromName}}</span> ：
            <img class="rate_icon" :src="currencyList[item.toCurrency]"><span>{{item.toName}}</span>
            <span> = 1 : {{item.rate}}</span>
            </el-card>
        </li>
        </ul>
        <el-dialog :close-on-click-modal="false"
        title="设置系统汇率"
        :visible.sync="rateVisible"
        width="900px"
        :before-close="closeRate"
        >
        <el-form size="medium"
            inline
            :model="rateData"
            ref="rateData"
            label-width="160px"
            label-position="right"
        >
            <el-checkbox-group v-model="rateCheck" class="mb20">
            <el-checkbox :label="item" v-for="(item,i) in bill_currency_type" :key="i" @change="changeRate">
                <img class="rate_icon" :src="currencyList[item.itemValue]"> {{item.itemName}}
            </el-checkbox>
            </el-checkbox-group>
            <el-form-item
            v-for="(item,index) in rateData.dataArr"
            :key="index"
            :label="`${item.fromName} to ${item.toName}`"
            :prop="`dataArr.${index}.rate`"
            :rules="rules.rate"
            >
            <el-input-number v-model="item.rate" :controls="false" :style="{width:'200px'}" size="mini"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeRate">取 消</el-button>
            <el-button type="primary" @click="submitRate">提 交</el-button>
        </span>
        </el-dialog>
        <el-divider content-position="left">项目汇率</el-divider>
        <div class="search_page">
        <div class="search">
            <el-button
            icon="el-icon-circle-plus-outline"
            class="mr10 "
            size="mini"
            plain
            @click="addKey"
            >新增</el-button>
            <el-select
            class="mr10 "
            size="mini"
            style="width:120px"
            filterable
            v-model="currencyType"
            clearable
            placeholder="货币类型"
            @change="Topage(1)"
            >
            <el-option
                v-for="item in bill_currency_type1"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
            ></el-option>
            </el-select>
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
        :data="listData"
        size="mini"
        highlight-current-row
        style="width: 100%"
        >
        <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editItem(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="kpiPeriod" align="center" label="周期" min-width="100"></el-table-column>
        <el-table-column prop="currencyTypeName" align="center" label="货币" min-width="100"></el-table-column>
        <el-table-column prop="salesRate" align="center" label="出账汇率(销售)" min-width="100"></el-table-column>
        <el-table-column prop align="center" label="销售薪资入账汇率区间" min-width="100">
            <template slot-scope="scope" style>
            <div :style="{'display':'flex','text-align':'center','justify-content': 'center'}">
                <p>{{scope.row.orderRate1||'**'}}</p>~
                <p>{{scope.row.orderRate2||'**'}}</p>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="createByName" align="center" label="创建人" min-width="100"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建日期" min-width="100"></el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false"
        :title="item.createTime?'编辑':'新增'"
        :visible.sync="editVisible"
        width="850px"
        :before-close="close"
        >
        <el-form size="medium" inline :model="item" ref="itemData" label-width="160px">
            <el-form-item label="币种">
            <el-select
                :style="{width:'300px'}"
                v-model="item.currencyType"
                :disabled="!!item.createTime"
            >
                <el-option
                v-for="item in bill_currency_type1"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="周期">
            <el-select
                :style="{width:'142px'}"
                v-model="item.kpiPeriod"
                :disabled="!!item.createTime"
            >
                <el-option v-for="item in periodList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="出账汇率(销售)">
            <el-input-number :style="{width:'300px'}" :controls="false" v-model="item.salesRate"></el-input-number>
            </el-form-item>
            <el-form-item label="销售薪资入账汇率区间">
            <el-input-number :style="{width:'300px'}" :controls="false" v-model="item.orderRate1"></el-input-number>~
            <el-input-number :style="{width:'300px'}" :controls="false" v-model="item.orderRate2"></el-input-number>
            </el-form-item>
            <el-form-item label="备注">
            <el-input
                :style="{width:'300px'}"
                type="textarea"
                :autosize="{minRows:3}"
                v-model="item.note"
            ></el-input>
            </el-form-item>
        </el-form>
        <el-table
            :data="rateHistory"
            size="mini"
            highlight-current-row
            style="width: 100%"
        >
            <el-table-column prop align="center" label="销售薪资入账汇率区间" min-width="120">
            <template slot-scope="scope" style>
                <div :style="{'display':'flex','text-align':'center','justify-content': 'center'}">
                <p>{{scope.row.orderRate1||'**'}}</p>~
                <p>{{scope.row.orderRate2||'**'}}</p>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="note"
            align="center"
            label="备注"
            min-width="100"
            show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="createByName" align="center" label="更新人" min-width="100"></el-table-column>
            <el-table-column prop="createTime" align="center" label="更新时间" min-width="100"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </span>
        </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/dictionary.js'
import { fmtDate } from '@/libs/file'
export default {
  name: 'rate',
  mixins: [mixins],
  data: function () {
    return {
      sysRateList: [],
      currencyList: {
        cny: require('@/assets/img/currency_CN.png'),
        usd: require('@/assets/img/currency_US.png'),
        gbp: require('@/assets/img/currency_UK.png'),
        hkd: require('@/assets/img/currency_HK.png'),
        cad: require('@/assets/img/currency_CA.png'),
        sgd: require('@/assets/img/currency_SG.png'),
        aud: require('@/assets/img/currency_AU.png')
      },
      rateVisible: false,
      loading: false,
      rateData: {
        dataArr: []
      },
      pageSize: 400,
      bill_currency_type: [],
      rateCheck: [],
      ratePeriod: '',

      listData: [{}],
      item: {
        kpiPeriod: '',
        currencyType: '',
        orderRate1: '',
        orderRate2: '',
        note: '',
        salesRate: '',
        exchangeRate: ''
      },
      editVisible: false,
      periodList: [],
      pageNum: 1,
      total: 0,
      bill_currency_type1: [],
      currencyType: '',
      rateHistory: [],
      rules: {
        rate: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    chooseCurrencyType: function () {
      return this.item.currencyType
    }
  },
  watch: {
    chooseCurrencyType: function (val, old) {
      console.log(val, old)
      if (val) {
        this.getPeriodByCurrencyType(val)
      }
    }
  },
  mounted () {
    this.Topage()
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.bill_currency_type = await this.getDictionary('bill_currency_type')
      this.bill_currency_type1 = this.bill_currency_type.filter(
        v => v.itemValue != 'cny'
      )
    },
    getRateHistoryList () {
      const params = {
        kpiPeriod: this.item.kpiPeriod,
        currencyType: this.item.currencyType
      }
      api.getRateHistoryList(params).then(res => {
        this.rateHistory = res.data
      })
    },
    getPeriodByCurrencyType (type) {
      console.log(type)
      const params = {
        currencyType: type,
        count: 5
      }
      api.getPeriod(params).then(res => {
        console.log(res)
        this.periodList = res.data
      })
    },
    async Topage () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        currencyType: this.currencyType
      }
      this.loading = true
      api.getRateList(params).then(res => {
        console.log(res)
        this.listData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
      const params2 = {
        pageNum: 1,
        pageSize: 100
      }
      api.getSysRateList(params2).then(res => {
        console.log('getSysRateList', res)
        this.sysRateList = res.data.rows
      })
    },
    editItem (v) {
      this.item = { ...v }
      this.getRateHistoryList()
      this.editVisible = true
    },
    addKey () {
      this.editVisible = true
    },
    close () {
      this.editVisible = false
      this.item = {
        kpiPeriod: '',
        currencyType: '',
        orderRate1: '',
        orderRate2: '',
        note: '',
        salesRate: '',
        exchangeRate: ''
      }
      this.rateHistory = []
      this.periodList = []
    },
    submit () {
      if (!this.item.createTime) {
        const data = {
          kpiPeriod: this.item.kpiPeriod,
          currencyType: this.item.currencyType,
          orderRate1: this.item.orderRate1,
          orderRate2: this.item.orderRate2,
          note: this.item.note,
          salesRate: this.item.salesRate,
          exchangeRate: this.item.exchangeRate
        }
        this.loading = true
        api
          .addRateItem(data)
          .then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.loading = false
            this.Topage()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.loading = false
          })
      } else {
        const data = {
          kpiPeriod: this.item.kpiPeriod,
          currencyType: this.item.currencyType,
          orderRate1: this.item.orderRate1,
          orderRate2: this.item.orderRate2,
          note: this.item.note,
          salesRate: this.item.salesRate,
          exchangeRate: this.item.exchangeRate
        }
        this.loading = true
        api
          .setRateItem(data)
          .then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.loading = false
            this.Topage()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.loading = false
          })
      }

      this.close()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    // 系统汇率相关
    addRate () {
      this.rateVisible = true
    },
    closeRate () {
      this.rateVisible = false
      this.rateCheck = []
      this.rateData.dataArr = []
    },
    getSysRateList () {
      const params = {
        pageNum: 1,
        pageSize: 100
      }
      api.getSysRateList(params).then(res => {
        console.log(res)
      })
    },
    changeRate () {
      this.rateData.dataArr = []
      const s = []
      console.log(this.rateCheck.length)
      for (let i = 0; i < this.rateCheck.length; i++) {
        for (let j = 0; j < s.length; j++) {
          this.rateData.dataArr.push({
            period: fmtDate(new Date(), 'yyyy-MM'),
            fromCurrency: s[j].itemValue,
            fromName: s[j].itemName,
            toCurrency: this.rateCheck[i].itemValue,
            toName: this.rateCheck[i].itemName,
            rate: '',
            note: ''
          }, {
            period: fmtDate(new Date(), 'yyyy-MM'),
            fromCurrency: this.rateCheck[i].itemValue,
            fromName: this.rateCheck[i].itemName,
            toCurrency: s[j].itemValue,
            toName: s[j].itemName,
            rate: '',
            note: ''
          })
        }
        s.push(this.rateCheck[i])
      }
      console.log(this.rateData.dataArr)
    },
    submitRate () {
      this.$refs.rateData.validate((valid) => {
        if (!valid) return
        this.loading = true
        api.saveRate(this.rateData.dataArr).then(res => {
          console.log(res)
          this.loading = false
          this.Topage()
          this.closeRate()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rate_icon{
  margin-right:5px;
  width:28px;
  height:19px;
  vertical-align:top;
}
.li_card{
  margin-right:10px;
  width:200px;
  display: inline-block;
}
.box_card{
  text-align: center;
}
</style>
