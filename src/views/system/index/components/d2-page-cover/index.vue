<!--
 * @Author: kaan
 * @Date: 2021-11-15 14:57:29
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-10-10 16:18:46
 * @Version:
 * @Description:
-->
<template>
  <div style="cursor:auto;background:rgba(246,240,227,1)" class="d2-page-cover">
    <div class="d2-page-cover__logo">
      <div class="ml20" style="margin-top:30px;display:flex;justify-content: space-between;">
          <div style="display:flex" class="mt10">
            <div class="mr20" v-if="roleInfo.includes(`home_change_effectStatus`)">
              <el-badge :value="effectiveNum" >
                <el-button   type="primary" @click="clickShowTable" size="mini" >查看无效咨询内容列表详情</el-button>
              </el-badge>
            </div>
            <div v-if="roleInfo.includes(`home_SPY_effectStatus`)" class="mr10">
              <el-button  type="primary" @click="showSpyOrDeleteList" size="mini" >学员SPY或删除列表</el-button>
            </div>
            <el-button  type="primary" @click="showSaleHomeData" size="mini" >查看销售概况</el-button>
            <el-button  type="primary" @click="showBDHomeData" size="mini" >查看BD提成</el-button>
            <el-button v-if="roleInfo.includes(`home_showCalendar`)"  type="primary" @click="showCalendar" size="mini" >网申日历</el-button>
          </div>
          <div>
            <el-button v-if="calendarId" class="mr20" type="success" @click="showHolidayReminder" size="medium" >节日提醒</el-button>
          </div>
        </div>
    </div>
    <ConsultingChange :consultingTableVisible="consultingTableVisible"  @close="closeConsulting" />
    <SpyOrDeleteList :spyOrDeleteListVisible="spyOrDeleteListVisible"  @close="closeSpyOrDeleteList" />
    <SaleHomeData :saleHomeDataVisible="saleHomeDataVisible"  @close="closeSaleHomeData"/>
    <holidayReminder :holidayReminderVisible="holidayReminderVisible" @close="closeHolidayReminder" />
    <saleBdData :saleBdDataVisible="saleBdDataVisible"  @close="closeSaleBdData"/>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import api from '@/api/sales_assistant'
import ConsultingChange from './components/consulting'
import SpyOrDeleteList from './components/spyOrDeleteList'
import SaleHomeData from './components/saleHomeData'
import saleBdData from './components/saleBdData'
import holidayReminder from './components/holidayReminder'
import util from '@/libs/util'
import bus from '@/libs/bus'

export default {
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  components: { ConsultingChange, SpyOrDeleteList, SaleHomeData, saleBdData, holidayReminder },
  data () {
    return {
      calendarId: '',
      effectiveNum: 0,
      consultingTableVisible: false,
      spyOrDeleteListVisible: false,
      saleHomeDataVisible: false,
      saleBdDataVisible: false,
      holidayReminderVisible: false
    }
  },
  mounted () {
    // bus.$on('message', (e) => {
    //   console.log(e, 'bus传值')
    // })
    api.getHomedata().then(res => {
      this.calendarId = res.data ? res.data.calendarId : ''
      if (util.sessions.get('times') == 'first' && res.data) {
        this.holidayReminderVisible = true
        util.sessions.set('times', 'second')
      }
    })
    if (this.roleInfo.includes('home_change_effectStatus') || this.roleInfo.includes('home_SPY_effectStatus')) {
      const data = {
        pageNum: 1,
        pageSize: 9999,
        checkStatus: 0
      }
      api.geteffectiveConsultingList(data).then(res => {
        console.log(res)
        this.effectiveNum = res.data.total
      })
    }
  },
  methods: {
    showCalendar () {
      this.$router.push({ name: 'Calendar' })
    },
    clickShowTable () {
      this.consultingTableVisible = true
    },
    closeConsulting () {
      this.consultingTableVisible = false
    },
    showSpyOrDeleteList () {
      this.spyOrDeleteListVisible = true
    },
    closeSpyOrDeleteList () {
      this.spyOrDeleteListVisible = false
    },
    showSaleHomeData () {
      this.saleHomeDataVisible = true
    },
    closeSaleHomeData () {
      this.saleHomeDataVisible = false
    },
    closeSaleBdData () {
      this.saleBdDataVisible = false
    },
    closeHolidayReminder () {
      this.holidayReminderVisible = false
    },
    showHolidayReminder () {
      this.holidayReminderVisible = true
    },
    showBDHomeData () {
      this.saleBdDataVisible = true
    }
  }
}
</script>

<style lang="scss">
.d2-page-cover {
  @extend %full;
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__logo{
    width: 100%;
    height: 100%;
    background-image: url('./image/welcome.gif');
    background-position: center;
    background-repeat:no-repeat;
  }
  .d2-page-cover__logo {
    img {
      width: 200px;
    }
  }
  .d2-page-cover__title {
    margin: 0px;
    margin-bottom: 20px;
    font-weight: bold;
    color: $color-text-main;
  }
  .d2-page-cover__sub-title {
    margin: 0px;
    margin-bottom: 5px;
    font-size:80px;
    color: $color-text-normal;
  }
  .d2-page-cover__build-time {
    margin: 0px;
    margin-bottom: 10px;
    font-size: 12px;
    color: $color-text-placehoder;
  }
}

$color: #dcdfe6;
$margin: top;
@mixin br5 {
  border-radius: 5px;
}
@mixin br22($mar: 20) {
  border-radius: 22px;
  margin-#{$margin}: double($mar) + px;
}
@function double($params) {
  @return $params * 2;
}
.common {
  padding: 20px;
}

%mm {
  display: inline-block;
}
.programName {
  @include br5;
  padding: 0px 9px;
  border: 1px $color dashed;
  min-width: 170px;
  height: 26px;
  display: inline-block;
  // @extend %mm;
}

.create-cant-program-model {
  @include br22(13);
  @include br5;
  @extend .common;
  @extend %m;
  // @extend %mm;
  border: 1px $color solid;
  margin-#{$margin}: 20px;
  position: relative;
}
.create-cant-program-model2{
  border:1px #F56C6C solid;
}
%m {
  display: block;
}
.program-model-title {
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: #fff;
  padding: 10px;
}
</style>
