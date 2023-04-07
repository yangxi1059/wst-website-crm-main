<!--
 * @Author: kaan
 * @Date: 2021-06-17 15:39:41
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-03-06 10:18:42
 * @Version:
 * @Description:
-->
<template>
  <div class="create-cant-program-model components-model" :class="baseType =='graduate'?'components-model-inside':''" v-if="internshipVisible">
    <div class="program-model-title" >实习项目</div>
    <el-form
      class="components-model-need"
      :inline="true"
      size="mini"
      :rules="rules"
      ref="internshipProgram"
      label-width="180px"
      :model="info"
    >
      <!-- <el-input v-model="internshipPrice0" style="display:none"></el-input>
      <el-input v-model="internshipPrice1" style="display:none"></el-input>
      <el-input v-model="internshipPrice2" style="display:none"></el-input>
      <el-input v-model="internshipPrice3" style="display:none"></el-input>
      <el-input v-model="internshipPrice4" style="display:none"></el-input>
      <el-input v-model="internshipPrice5" style="display:none"></el-input>
      <el-input v-model="internshipPrice6" style="display:none"></el-input>
      <el-input v-model="internshipPrice7" style="display:none"></el-input>
      <el-input v-model="internshipPrice8" style="display:none"></el-input> -->
      <div v-for="(item,index) in info.internshipProgram" :key="index">
        <el-form-item :label="`实习单位-${index+1}`"
          :prop="`internshipProgram.${index}.internshipUnit`"
          :rules="rules.internshipUnit">
          <el-cascader
            :style="{width:widthInput}"
            expand-trigger="hover"
            :options="internshipUnitList"
            v-model="item.internshipUnit"
            style="width: 230px;"
            filterable
            :props="internshipProps"
            @change="changeInternshipId(item.internshipUnit,index )"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="'实习时长'">
          <el-select
            v-model="item.internshipDuration"
            placeholder="请选择实习时长"
            :style="{width:widthInput}"
            :disabled="true"
          >
            <el-option
              v-for="item in internship_duration"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'实习方式'">
          <el-select
            v-model="item.internshipLocation"
            placeholder="请选择实习方式"
            :style="{width:widthInput}"
            :disabled="true"
          >
            <el-option
              v-for="item in internship_location_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`官方价格(${item.priceType == 'usd'?'美金':'人民币'}):`">
          <span
            :style="{width:widthSpan}"
            class="programName"
          >VIP价格: <span style="color:#409EFF">{{item.VIpPriceInit || '?'}}</span> / 原价: <span style="color:#c32e47">{{item.nonVIpPriceInit || '?'}}</span></span>
        </el-form-item>
        <el-form-item :label="`初始实习价格(${item.priceType == 'usd'?'人民币':'美金'}):`">
          <span
            :style="{width:widthSpan}"
            class="programName"
          >VIP价格: <span style="color:#409EFF">{{item.VIpPriceInit2 || '?'}}</span> / 原价: <span style="color:#c32e47">{{item.nonVIpPriceInit2 || '?'}}</span></span>
        </el-form-item>
        <el-form-item label="自定义价格($)" prop v-show="item.internshipUnit[0] == '待定公司'">
          <el-input
            :style="{width:'190px' }"
            v-model="item.basePriceUsd"
            @change="changePriceUsdCustom"
          ></el-input>
        </el-form-item>
        <el-form-item label="实习价格(￥)" prop>
          <span
            class="programName"
            :style="{width:widthSpan}"
          >{{item.priceCny}}</span>
        </el-form-item>
        <el-form-item label="安排方式" :prop="`internshipProgram.${index}.internshipFlag`" :rules="rules.internshipFlag">
          <el-radio-group v-model="item.internshipFlag">
            <el-radio :label="0">直接安排</el-radio>
            <el-radio :label="1">内推</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实习合同模板" :prop="`internshipProgram.${index}.contract`" :rules="rules.contract" v-if="needContract">
          <el-select
            v-model="item.contract"
            filterable
            placeholder="请选择"
            :style="{width:'190px'}"
          >
            <el-option
              v-for="a in interShipContractList"
              :key="a.pkId"
              :label="a.contractName"
              :value="a.contractTitle + '&&&' + a.contractContent"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习备注" :prop="`internshipProgram.${index}.note`" :rules="rules.note">
          <el-input
            :style="{width:'570px'}"
            v-model="item.note"
            maxlength="99"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import apiDic from '@/api/dictionary'

export default {
  props: {
    internshipVisible: {
      type: Boolean,
      default: false
    },
    internshipNum: {
      type: Number,
      default: 0
    },
    internshipList: {
      type: Array
    },
    // 有基础项目进入时必为true
    vipStatus: {
      type: Boolean
    },
    needContract: {},
    baseType: {
      type: String,
      default: ''
    },
    rate: {},
    internshipData: {
      type: Array
    }
  },
  data () {
    return {
      programData: [],
      widthSpan: '160px',
      widthInput: '190px',
      // 实习项目信息
      info: {
        internshipProgram: []
      },
      // 实习相关下拉
      interShipContractList: [],
      internshipUnitList: [],
      internship_duration: [],
      internship_location_type: [],
      wst_company: [],
      // 所有的二级实习
      internshipIdList: [],

      internshipProps: {
        children: 'internshipArr',
        label: 'internshipName',
        value: 'internshipId'
      },
      rules: {
        internshipUnit: { required: true, message: '必填', trigger: 'blur' },
        note: { required: true, message: '必填', trigger: 'blur' },
        contract: { required: true, message: '必填', trigger: 'blur' },
        internshipFlag: { required: true, message: '必填', trigger: 'blur' }
      }
    }
  },
  computed: {
    totalPrice () {
      let price = 0
      const pItem = this.info.internshipProgram
      for (let i = 0; i < pItem.length; i++) {
        console.log(pItem[i].basePriceUsd)
        price += pItem[i].basePriceUsd * 1
      }
      return price
    }
  },
  watch: {
    internshipVisible: function (val) {
      if (val) {
        this.init()
        this.info.internshipProgram = []
        if (this.internshipData.length > 0) {
          // 暂存数据
          this.info.internshipProgram = this.internshipData
        } else {
          for (let i = 0; i < this.internshipNum; i++) {
            this.info.internshipProgram.push(
              {
                internshipUnit: [],
                basePriceUsd: 0,
                priceCny: 0,
                priceUsd: 0,
                VIpPrice: 0,
                note: '',
                contract: '',
                internshipFlag: '',
                internshipLocation: ''
              }
            )
          }
        }
      }
    },
    rate: function (r) {
      if (this.info.internshipProgram.length < 1) return
      this.info.internshipProgram.forEach((v) => {
        if (v.priceType == 'usd') {
          const price = (r && r != '') ? v.VIpPriceInit * r : 0
          const price2 = (r && r != '') ? v.VIpPriceInit * r : 0
          const price3 = (r && r != '') ? v.nonVIpPriceInit * r : 0
          v.priceCny = parseFloat(price.toFixed(1))
          v.VIpPriceInit2 = parseFloat(price2.toFixed(1))
          v.nonVIpPriceInit2 = parseFloat(price3.toFixed(1))
        } else {
          const price = (r && r != '') ? v.VIpPriceInit : 0
          const price2 = (r && r != '') ? v.VIpPriceInit / r : 0
          const price3 = (r && r != '') ? v.nonVIpPriceInit / r : 0
          v.priceCny = parseFloat(price.toFixed(1))
          v.VIpPriceInit2 = parseFloat(price2.toFixed(1))
          v.nonVIpPriceInit2 = parseFloat(price3.toFixed(1))
        }
      })
    },
    totalPrice: function (val) {
      this.$emit('getPrice', val, 'internship', this.baseType)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      apiDic.getDicDropdown('internship_duration,internship_location_type').then((res) => {
        this.internship_duration = res.data.internship_duration
        this.internship_location_type = res.data.internship_location_type
      })
      apiDic.getProgramDetailById('3').then((res) => {
        console.log(res.data, '获取实习项目合同模板')
        this.interShipContractList = res.data.contractList
        this.interShipContractList.unshift({
          contractName: '无',
          contractTitle: '0',
          contractContent: '0'
        })
      })
      const params1 = {
        pageNum: 1,
        pageSize: 999,
        recordStatus: '1'
      }
      apiDic.getInternshipList(params1).then((res) => {
        console.log('获取实习单位列表', res)
        this.internshipUnitList = res.data.rows
        this.internshipUnitList.forEach((v) => {
          v.internshipId = v.internshipName
          // v.internshipArr.forEach((vv) => {
          //   vv.internshipName += `[${vv.internshipTimeName || ""}-${
          //     vv.internshipLocationName || ""
          //   } ]`;
          // });
          this.internshipIdList.push(...v.internshipArr)
        })
      })
      apiDic.getDicWstCompany().then((res) => {
        this.wst_company = res.data
      })
    },
    // 选择实习单位更新其价格
    changeInternshipId (internshipUnit, index) {
      console.log(internshipUnit)
      console.log(index)
      const internshipId = internshipUnit[1]
      const item = this.internshipIdList.filter(
        (v) => v.internshipId == internshipId
      )[0]
      const internshipItem = this.info.internshipProgram
      internshipItem[index].internshipLocation =
        item.internshipLocation
      internshipItem[index].internshipDuration = item.internshipTime
      internshipItem[index].priceType = item.priceType
      console.log(item, 2222222222222222)
      if (item.priceType != 'usd') {
        if (this.vipStatus) {
          internshipItem[index].priceUsd = Math.round(item.vipPrice / this.rate)
          internshipItem[index].basePriceUsd = Math.round(item.vipPrice / this.rate)
          internshipItem[index].nonVIpPrice = Math.round(item.novipPrice / this.rate)
          internshipItem[index].VIpPrice = Math.round(item.vipPrice / this.rate)

          internshipItem[index].VIpPriceInit = item.vipPrice
          internshipItem[index].VIpPriceInit2 = Math.round(item.vipPrice / this.rate)
          internshipItem[index].nonVIpPriceInit = item.novipPrice
          internshipItem[index].nonVIpPriceInit2 = Math.round(item.novipPrice / this.rate)
          internshipItem[index].programWeight = 1
        } else {
          internshipItem[index].priceUsd = Math.round(item.novipPrice / this.rate)
          internshipItem[index].basePriceUsd = Math.round(item.novipPrice / this.rate)
          internshipItem[index].nonVIpPrice = Math.round(item.novipPrice / this.rate)
          internshipItem[index].VIpPrice = Math.round(item.vipPrice / this.rate)

          internshipItem[index].VIpPriceInit = item.vipPrice
          internshipItem[index].VIpPriceInit2 = Math.round(item.vipPrice / this.rate)
          internshipItem[index].nonVIpPriceInit = item.novipPrice
          internshipItem[index].nonVIpPriceInit2 = Math.round(item.novipPrice / this.rate)
          internshipItem[index].programWeight = 1
        }
        internshipItem[index].priceCny = parseFloat((internshipItem[index].VIpPriceInit).toFixed(1))
        this.$set(this.info, 'internshipProgram', internshipItem)
        this.$set(this.info.internshipProgram, index, internshipItem[index])
      } else {
        if (this.vipStatus) {
          internshipItem[index].priceUsd = Math.round(item.vipPrice)
          internshipItem[index].basePriceUsd = Math.round(item.vipPrice)
          internshipItem[index].nonVIpPrice = Math.round(item.novipPrice)
          internshipItem[index].VIpPrice = Math.round(item.vipPrice)

          internshipItem[index].VIpPriceInit = item.vipPrice
          internshipItem[index].VIpPriceInit2 = Math.round(item.vipPrice * this.rate)
          internshipItem[index].nonVIpPriceInit = item.novipPrice
          internshipItem[index].nonVIpPriceInit2 = Math.round(item.novipPrice * this.rate)
          internshipItem[index].programWeight = 1
        } else {
          internshipItem[index].priceUsd = Math.round(item.novipPrice)
          internshipItem[index].basePriceUsd = Math.round(item.novipPrice)
          internshipItem[index].nonVIpPrice = Math.round(item.novipPrice)
          internshipItem[index].VIpPrice = Math.round(item.vipPrice)
          internshipItem[index].VIpPriceInit = item.vipPrice
          internshipItem[index].VIpPriceInit2 = Math.round(item.vipPrice * this.rate)
          internshipItem[index].nonVIpPriceInit = item.novipPrice
          internshipItem[index].nonVIpPriceInit2 = Math.round(item.novipPrice * this.rate)
          internshipItem[index].programWeight = 1
        }
        internshipItem[index].priceCny = parseFloat((internshipItem[index].VIpPriceInit * this.rate).toFixed(1))
        this.$set(this.info, 'internshipProgram', internshipItem)
        this.$set(this.info.internshipProgram, index, internshipItem[index])
        console.log(this.info.internshipProgram,88888888888888888)
      }
    },
    getValid () {
      return new Promise((resolve, reject) => {
        if (!this.$refs.internshipProgram)resolve()
        this.$refs.internshipProgram.validate((valid) => {
          // for (let i = 0; i < this.info.internshipProgram.length; i++) {
          //   if (!this.info.internshipProgram[i].note) {
          //     this.$message({
          //       type: 'warning',
          //       message: '实习备注为必填项请检查'
          //     })
          //     return
          //   }
          // }
          if (this.info.internshipProgram) { this.getData() }
          resolve(valid)
        })
      })
    },
    getData () {
      this.programData = []
      const pItem = this.info.internshipProgram
      for (let i = 0; i < pItem.length; i++) {
        let internship = {}
        let internshipName = ''
        let internshipLocationName = ''
        let internshipTimeName = ''
        for (let j = 0; j < this.internshipUnitList.length; j++) {
          for (let m = 0; m < this.internshipUnitList[j].internshipArr.length; m++) {
            if (pItem[i].internshipUnit[1] == this.internshipUnitList[j].internshipArr[m].internshipId) {
              internshipName = `${pItem[i].internshipUnit[0]}/${this.internshipUnitList[j].internshipArr[m].internshipName}`
            }
          }
        }
        for (let j = 0; j < this.internship_duration.length; j++) {
          if (pItem[i].internshipDuration == this.internship_duration[j].itemValue) {
            internshipTimeName = this.internship_duration[j].itemName
          }
        }
        for (let j = 0; j < this.internship_location_type.length; j++) {
          if (pItem[i].internshipLocation == this.internship_location_type[j].itemValue) {
            internshipLocationName = this.internship_location_type[j].itemName
          }
        }
        internship = {
          internshipName: internshipName,
          internshipLocationName: internshipLocationName,
          internshipTimeName: internshipTimeName
        }
        this.programData.push(internship)
      }
      // for (let i = 0; i < pItem.length; i++) {
      //   nameArr.push(pItem[i].internshipUnit[0])
      // }
      // switch(this.baseType) {
      //   case 'offer':
      //     this.programData={
      //       opIntershipPrice:this.totalPrice,
      //       opIntershipCompany:nameArr.join()
      //     }
      //     break;
      //   case 'graduate':
      //     this.programData={
      //       gpIntershipPrice:this.totalPrice,
      //       gpIntershipCompany:nameArr.join()
      //     }
      //     break;
      // }
    },
    // 自定义价格改变时
    changePriceUsdCustom () {
      const r = this.rate
      if (this.info.internshipProgram.length < 1) return
      this.info.internshipProgram.forEach((v) => {
        console.log(v)
        if (v.priceType == 'usd') {
          const price = (r && r != '') ? v.basePriceUsd * r : 0
          v.priceCny = parseFloat(price.toFixed(1))
        } else {
          const price = (r && r != '') ? v.basePriceUsd : 0
          v.priceCny = parseFloat(price.toFixed(1))
        }
      })
      console.log(this.info.internshipProgram)
      // this.$set(this.info, 'internshipProgram', internshipItem)
      // this.$set(this.info.internshipProgram, index, internshipItem[index])
    },
    programClose () {
      this.$emit('close')
      this.programData = []
      const obj1 = this.$data.info
      const obj2 = this.$options.data().info
      for (const attrName in obj1) {
        if (attrName !== 'rules') {
          obj1[attrName] = obj2[attrName]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$color: #dcdfe6;
$margin: top;
@mixin br5 {
  border-radius: 5px;
}
@mixin br22($mar: 20) {
  border-radius: 22px;
  margin-#{$margin}: double($mar) + px;
}
.programName {
  @include br5;
  padding: 0px 9px;
  border: 1px $color dashed;
  min-width: 170px;
  height: 26px;
  display: block;
  // @extend %mm;
}
.components-model{
  padding:20px 0;
}
.components-model-inside{
  margin:0 20px;
}
.components-model-need{
  margin:0 -20px;
}
</style>
