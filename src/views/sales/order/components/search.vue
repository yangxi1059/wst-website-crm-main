<template>
  <div class="reimbursement">
    <el-drawer
      title="更多筛选"
      :visible.sync="showSearchVisible"
      :before-close="close"
      :close-on-click-modal="true"
      :size="'900px'"
    >
      <div class="demo-input-suffix ml20 mb20">
        <div class="demo-input-suffix2">搜索：</div>
        <el-input
          style="width:190px"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="search">
        </el-input>
      </div>
      <div class="demo-input-suffix ml20 mb20">
        <div class="demo-input-suffix2">联系人：</div>
        <el-select
            class="mr10"
            size="mini"
            filterable
            v-model="userId2"
            placeholder="请选择"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
      </div>
      <div class="mb20 ml20">
        <div class="demo-input-suffix2 mb20">订单包含项目:</div>
        <div class="mb20" v-for="(item,i) in programTypeArr" :key="i">
          <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item,i)">{{item.itemName}}</el-checkbox>
          <div style="margin: 5px 0;"></div>
          <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item,i)">
            <el-checkbox v-for="city in item.programArr" :label="city.programId" :key="city.programId">{{city.programName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="mb20 ml20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitTo">筛 选</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import api from "@/api/sales_assistant";

export default {
  props: {
    showSearchVisible: {
      type: Boolean,
      default: false
    },
    users:{},
    userId:{}
  },
  data: () => {
    return {
      search:'',
      userId2: '',
      options: [],
      programTypeArr: []
    };
  },

  watch: {
     showSearchVisible: function(val) {
      if (val) {
        console.log(this.users)
        this.initPage()
        this.userId2 = JSON.parse(JSON.stringify(this.userId))
      }
    },
  },
  mounted() {},
  methods: {
    initPage(){
      console.log(111111111)
      api.getSignListInite().then(res => {
        console.log(2222222222222)
        res.data.programTypeArr.forEach(item => {
          item.selected = []
          item.isIndeterminate = false
          item.checkAll = false
          item.checkedCities = []
          item.programIds = []
          item.programArr.forEach(item2 => {
            item.programIds.push(item2.programId)
          })
        })
        this.programTypeArr = res.data.programTypeArr
        console.log(res)
      })
    },
    handleCheckAllChange(data) {
      console.log(data)
      data.checkedCities =  data.checkAll ? data.programIds : [];
      data.isIndeterminate = false;
    },
    handleCheckedCitiesChange(data) {
      console.log(data)
      let checkedCount = data.checkedCities.length;
      data.checkAll = checkedCount === data.programArr.length;
      data.isIndeterminate = checkedCount > 0 && checkedCount < data.programArr.length;
    },
    submitTo(){
      let arr = []
      console.log(this.programTypeArr)
      this.programTypeArr.forEach(item => {
        if(item.checkedCities.length > 0){
          arr = arr.concat(item.checkedCities)
        }
      })
      let programIds = arr.join(',')
      let data = {
        programIds: programIds,
        search: this.search,
        userId: this.userId2,
      }
      this.$emit('submit',data)
      this.clear()
      console.log(programIds,this.search,this.userId2)
    },
    close(){
      this.$emit('close')
      this.clear()
    },
    clear(){
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-input-suffix{
  display:flex
}
.demo-input-suffix2{
  width: 150px;
}
</style>