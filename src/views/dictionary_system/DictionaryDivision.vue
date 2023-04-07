<!--
 * @Author: kaan
 * @Date: 2021-05-06 09:40:30
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-26 10:47:14
 * @Version:
 * @Description:
-->

<template>
  <dictionaryProject
    :dicProject="dicProject"
    :canEdit="canEdit"
  ></dictionaryProject>
</template>

<script>
import dictionaryProject from './dictionary_project.vue'

export default {
  components: {
    dictionaryProject
  },
  data () {
    return {
      dicProject: 'division',
      canEdit: true
    }
  }
}
</script>
