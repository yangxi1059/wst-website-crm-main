<!--
 * @Author: 库建华
 * @Date: 2019-11-12 16:35:27
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-09-11 10:09:14
 * @Version: 1
 * @Description: 
 -->
<template>
  <div class="limit">
    <el-checkbox @change="changeInput" v-model="isUnlimited">不限</el-checkbox>
    <el-input-number @change="changeInput" v-model="number" :disabled="isUnlimited" @input="handleInput" :controls="false" :style="{width:width+'px'}" :max="999999999" v-show="!isUnlimited"></el-input-number>
    <el-input-number @change="changeInput" placeholder='不限' :disabled="isUnlimited" @input="handleInput" :controls="false" :style="{width:width+'px'}" :max="999999999" v-show="isUnlimited"></el-input-number>
  </div>
</template>

<script>
export default {
  name: "inputNumber",
  props: {
    value: {
      type: Number,
      default: 0
    },
    width:{
      type: Number,
      default: 130
    }
  },
  data() {
    let is = this.value === -1;
    return {
      isUnlimited: is,
      number: this.value
    };
  },
  watch: {
    isUnlimited: function(v) {
        if (v) {
          this.number = -1;
          this.$emit("input", this.number);
          this.$emit("go", this.number);
        }else{
          this.number = 0;
          this.$emit("input", this.number);
          this.$emit("go", this.number);
        }
    },
    value:function(v){
      this.number = v;
      if(v === -1){
        this.isUnlimited = true;
      }else{
        this.isUnlimited = false;
      }
    }
  },
  mounted(){

  },
  methods: {
    handleInput() {
      this.$emit("input", this.number);
    },
    changeInput(){
      this.$emit("go", this.number);
    }
  }
};
</script>

<style lang='scss'>
</style>
