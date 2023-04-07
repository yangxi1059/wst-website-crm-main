<!--
 * @Author: kaan
 * @Date: 2021-09-07 15:16:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-08-17 18:04:37
 * @Version:
 * @Description:
-->
<template>
  <d2-container v-loading="loading">
    <div class="container">
      <div class="search_page">
        <div class="search">
          <el-select
            class="mr10"
            size="mini"
            filterable
            style="width:150px"
            v-model="internship"
            @change="Topage()"
            clearable
            placeholder="请选择实习单位">
            <el-option
              v-for="item in internshipUnitList"
              :key="item.internship"
              :label="item.internshipName"
              :value="item.internship"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            style="width:150px"
            size="mini"
            filterable
            v-model="arrangeStatus"
            placeholder="是否安排"
            clearable
            @change="Topage()"
          >
            <el-option
              key="0"
              label="未安排"
              value="0"
            ></el-option>
            <el-option
              key="1"
              label="已安排"
              value="1"
            ></el-option>
          </el-select>
          <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="offerStatus"
            placeholder="是否获得Offer"
            clearable
            @change="Topage()"
          >
            <el-option
              key="0"
              label="未获得"
              value="0"
            ></el-option>
            <el-option
              key="1"
              label="已获得"
              value="1"
            ></el-option>
          </el-select>
          <el-select
            style="width:150px"
            class="mr10"
            size="mini"
            filterable
            v-model="payStatus"
            placeholder="是否支付 "
            clearable
            @change="Topage()"
          >
            <el-option
              key="0"
              label="未支付"
              value="0"
            ></el-option>
            <el-option
              key="1"
              label="已支付"
              value="1"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" size="mini" plain @click="Topage(1)">GO</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <div class="mb10">
        <el-tag type="warning" title="所有未支付实习成本折算人民币金额（未知成本按1300美金计算）" size="medium" class="mr10" >未支付金额: ￥{{unPayCny}}</el-tag>
        <el-tag type="danger" title="系统内所有未付款实习数量（包含已过期）" class="mr10" size="medium" >未支付实习数: {{unPayNum}}</el-tag>
        <el-tag type="primary" title="未过期且未安排的实习数量" class="mr10" size="medium" >待安排实习数: {{unPayWithUnSetAndNotExpireNum}}</el-tag>
        <el-tag type="info" title="已安排但未付款的实习数量" size="medium" >待付款实习数: {{unPayWithIsSetNum}}</el-tag>
      </div>
      <el-table
        :data="dataList"
        size="mini"
        @sort-change="sortTable"
        highlight-current-row
      >
        <el-table-column align="center" prop="menteeName" label="学员姓名"></el-table-column>
        <el-table-column align="center" sortable="extendedEndDate" prop="extendedEndDate" label="项目到期时间"></el-table-column>
        <el-table-column align="center" prop="internshipDesc" label="实习单位"></el-table-column>
        <el-table-column align="center" prop="internshipName" label="具体实习岗位"></el-table-column>
        <el-table-column align="center" prop="internshipLocationName" label="实习地点"></el-table-column>
        <el-table-column align="center" prop="internshipTimeName" label="实习时长"></el-table-column>
        <el-table-column align="center" prop="costType" label="成本类型"></el-table-column>
        <el-table-column align="center" prop="costPrice" label="实习成本"></el-table-column>
        <el-table-column align="center" prop="costCnyPrice" label="实习成本 等值CNY"></el-table-column>
        <el-table-column align="center" prop="arrangeStatusName" label="是否安排"></el-table-column>
        <el-table-column align="center" prop="offerStatusName" label="是否获得offer"></el-table-column>
        <el-table-column align="center" prop="offerReceiveDate" label="获得offer日期"></el-table-column>
        <el-table-column align="center" prop="payStatusName" label="是否支付"></el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import apiDic from '@/api/dictionary'
import api from '@/api/cost'
export default {
  name: 'intership_list',
  data () {
    return {
      internshipUnitList: [],
      internship: '',
      arrangeStatus: '',
      offerStatus: '',
      payStatus: '',
      unSetPriceNum: '',
      unPayCny: '',
      unPayNum: '',
      unPayWithUnSetAndNotExpireNum: '',
      unPayWithIsSetNum: '',
      dataList: [],
      total: 0,
      pageNum: 1,
      sort:'',
      sortCol:'',
      pageSize: 400,
      loading: false
    }
  },
  mounted () {
    const params = {
      pageNum: 1,
      pageSize: 999,
      recordStatus: '1'
    }
    apiDic.getInternshipList(params).then((res) => {
      console.log('获取实习单位列表', res)
      this.internshipUnitList = res.data.rows
    })
    this.Topage()
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage()
    },
    sortTable (v) {
      console.log(v.order, v.prop)
      const orderToSort = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.sort = orderToSort[v.order] || null
      this.sortCol = v.prop
      this.Topage()
    },
    Topage () {
      const data = {
        internship: this.internship,
        arrangeStatus: this.arrangeStatus,
        offerStatus: this.offerStatus,
        payStatus: this.payStatus,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        sort: this.sort,
        sortCol: this.sortCol
      }
      this.loading = true
      api.getInternshipSignList(data).then(res => {
        this.loading = false
        console.log('getInternshipSignList', res)
        this.dataList = res.data.rows
        this.total = res.data.total
        this.unSetPriceNum = res.data.unPayInfo.unSetPriceNum
        this.unPayCny = res.data.unPayInfo.unPayCny
        this.unPayNum = res.data.unPayInfo.unPayNum
        this.unPayWithUnSetAndNotExpireNum = res.data.unPayInfo.unPayWithUnSetAndNotExpireNum
        this.unPayWithIsSetNum = res.data.unPayInfo.unPayWithIsSetNum
      })
    }
  }
}
</script>
