<!--
 * @Author: 库建华
 * @Date: 2020-01-02 16:00:19
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-15 17:57:42
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="调整排序" :visible="sortableVisible" :before-close="close" width="550px">
      <el-table ref="clickTable" row-key="programId" stripe :data="tableData">
        <el-table-column prop="programName" label="名称" width="500"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="close">关 闭</el-button>
        <el-button @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import api from '@/api/dictionary'

export default {
  name: 'sortable',
  props: {

    sortableData: {
      type: Array
    },
    sortableVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  watch: {
    sortableVisible: function (val) {
      if (val) {
        this.tableData = [...this.sortableData]
        console.log(this.tableData)
        this.$nextTick(() => {
          this.setSort()
        })
      }
    }
  },
  mounted () {
  },
  methods: {
    setSort () {
      const el = this.$refs.clickTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, targetRow)
          console.log(this.tableData)
        }
      })
    },
    close () {
      this.tableData = []
      this.$emit('close')
    },
    submit () {
      const data = []
      for (let i = 0; i < this.tableData.length; i++) {
        data.push({ programId: this.tableData[i].programId, sortNo: i })
      }
      console.log(data, 333333333333333)
      api.sortProgram(data).then(res => {
        this.$emit('submit')
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
