<!--
 * @Author: 杨曦
 * @Date: 2020-12-11 13:55:22
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-26 10:51:32
 * @Version:
 * @Description:
-->
<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="排序列表" :visible.sync="sortVisible" width="950px" :before-close="clone">
            <el-table
                class="yx_sortTable"
                :data="arrData"
                size="mini"
                highlight-current-row
                show-overflow
                height="600"
                @sort-change="changeSort"
                row-key="sortNo"
                style="width: 100%"
                ref="dragTable2"
            >
                <el-table-column prop="itemValue" align="center" sortable  label="字典Key(唯一)" min-width="90"></el-table-column>
                <el-table-column prop="itemName" align="center" sortable label="字典中文值" min-width="90px"></el-table-column>
                <el-table-column prop="itemNameEng"  align="center" sortable  label="字典英文值" min-width="90"></el-table-column>
                <el-table-column prop="" align="center" label="状态" min-width="50">
                    <template slot-scope="scope">
                    <div>
                        <span v-if="scope.row.dicStatus == 0">启用</span>
                        <span v-else>禁用</span>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column prop="parentItemName" align="center" sortable label="父字典" min-width="80"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clone">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data () {
    return {
      arrData: []
    }
  },
  props: {
    tableData: {
      type: Array
    },
    sortVisible: {
      type: Boolean
    }
  },
  watch: {
    sortVisible: function (val) {
      if (val) {
        this.toPage()
      }
    }
  },
  methods: {
    toPage () {
      this.arrData = JSON.parse(JSON.stringify(this.tableData))
      this.$nextTick(() => {
        this.setSort()
      })
    },
    submit () {
      this.$refs.dragTable2.clearSort()
      this.$emit('submit', this.arrData)
    },
    clone () {
      this.arrData = []
      this.$refs.dragTable2.clearSort()
      this.$emit('close')
    },
    changeSort () {
      if (this.$refs.dragTable2.tableData && this.$refs.dragTable2.tableData.length > 0) {
        this.arrData = this.$refs.dragTable2.tableData
      }
      console.log(this.arrData)
    },
    setSort () {
      const el = document.querySelectorAll('.yx_sortTable > .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.arrData.splice(evt.oldIndex, 1)[0]
          this.arrData.splice(evt.newIndex, 0, targetRow)
          console.log(this.arrData)
        }
      })
    }
  }
}
</script>
