<!--
 * @Author: 杨曦
 * @Date: 2020-08-17 10:46:26
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-09 15:47:45
 * @Version:
 * @Description:
-->
<template>
  <ul class="organizationtree">
    <son
      v-for="(item,index) in content"
      :key="index"
      :model="item"
      :checkOrg="checkOrg"
      :newSon="newSon"
      :editSon="editSon"
      :setmember="setmember"
      :delSon="delSon"
    />
  </ul>
</template>

<script>
import son from './son'
export default {
  components: { son },
  props: {
    content: {
      type: Array
    },
    checkOrg: {
      type: Function
    },
    newSon: {
      type: Function
    },
    editSon: {
      type: Function
    },
    setmember: {
      type: Function
    },
    delSon: {
      type: Function
    }
  },
  watch: {
    content: function (val) {
      console.log(val, 'yx153132453435')
    }
  }
}
</script>

<style lang='scss'>
.organizationtree {
  li {
    line-height: 50px;
  }
}
</style>
