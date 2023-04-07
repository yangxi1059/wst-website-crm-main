<template>
  <d2-container  >
    <div class="confirm_conversion">
      <div class="search_page" >
        <div class="search">
          <el-date-picker
              v-model="fromDate"
              class="mr10"
              type="date"
              size="mini"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择起始日期">
          </el-date-picker>
          <el-date-picker
              v-model="toDate"
              class="mr10"
              type="date"
              size="mini"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择截止日期">
          </el-date-picker>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
        </div>
      </div>

      <ul>
        <el-tooltip placement="bottom" effect="light" v-for="(item,index) in dataList" :key="index" >
          <div slot="content">{{item.formula}}</div>
          <li class="confirm_item" >
            <div class="confirm_item_icon">
              <i :class="item.icon" :style="{color:item.iconColor}"></i>
            </div>
            <div class="confirm_item_data">
              <p class="confirm_title">{{item.title}}</p>
              <p class="confirm_value">{{item.value}}</p>
            </div>
          </li>
        </el-tooltip>
      </ul>
    </div>
  </d2-container>
</template>

<script>

import api from '@/api/statement.js'
export default {
  data () {
    return {
      fromDate: '',
      toDate: '',
      dataList: [],
      iconList: ['el-icon-money', 'el-icon-coin', 'el-icon-pie-chart', 'el-icon-data-analysis'],
      iconColor: ['#E6A23C', '#409EFF', '#67C23A', '#F56C6C']
    }
  },
  mounted () {},
  methods: {
    Topage () {
      if (!this.fromDate) {
        this.$message({
          type: 'warning',
          message: '请输入开始日期'
        })
        return
      }
      if (!this.toDate) {
        this.$message({
          type: 'warning',
          message: '请输入结束日期'
        })
        return
      }
      api.getIncome({ fromDate: this.fromDate, toDate: this.toDate }).then(res => {
        this.dataList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm_item{
  margin-right:10px;
  width:300px;
  min-height:100px;
  display: inline-flex;
  align-items:center;
  justify-content:center;
  background-color:#FFF;
  border:3px solid #e9e9eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.confirm_item_icon{
  width:100px;
  height:60px;
  font-size: 60px;
  color:#409EFF;
  text-align :center;
}
.confirm_item_data{
  height:100%;
  padding-right:20px;
  flex: 1;
  .confirm_title{
    margin-bottom:10px;
    text-align: right;
    font-size:18px;
    font-weight: 700;
    color: rgba(0,0,0,.45);
  }
  .confirm_value{
    text-align: right;
    font-size:20px;
    font-weight: 700;
    color:#666;
  }
}
</style>
