<!--
 * @Author: 库建华
 * @Date: 2020-07-03 10:55:40
 * @LastEditors: Kaan
 * @LastEditTime: 2022-05-07 11:44:56
 * @Version: 1
 * @Description:
-->
<template>
  <div>
    <el-checkbox  v-model="follow"  @change="Topage">包含follow</el-checkbox>
      <el-select class="ml10"  clearable filterable v-model="cooperatorEventType" placeholder="请选择类型" @change="Topage" size="mini">
        <el-option
          v-for="item in cooperator_event_type"
          :key="item.itemValue"
          :label="item.itemName"
          :value="item.itemValue"
        ></el-option>
      </el-select>
      <el-timeline class="mt10">
        <el-timeline-item
          v-for="(item,i) in data"
          :key="i"
          :timestamp="item.eventDate"
          placement="top"
        >
          <el-card>
            <b>{{item.eventTypeName}}</b>
            <p>{{item.eventContent}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
  </div>
</template>

<script>
import api from '@/api/bd'
import mixins from '@/plugin/mixins'
export default {
  name: 'milestone',
  mixins: [mixins],
  props: {
    cooperatorId: {
    },
    activeName: {}
  },
  data () {
    return {
      data: {},
      cooperator_event_type: [],
      cooperatorEventType: '',
      follow: true
    }
  },
  watch: {
    activeName (val) {
      if (val == 'eighth') {
        this.Topage()
        if (!this.cooperator_event_type.length) {
          this.pageInit()
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.cooperator_event_type = await this.getDictionary('cooperator_event_type')
    },
    Topage () {
      const params = {
        cooperatorId: this.cooperatorId,
        eventType: this.cooperatorEventType,
        containFollow: this.follow
      }
      api.getCooperatorMileStone(params).then(res => {
        console.log(res)
        this.data = res.data
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
