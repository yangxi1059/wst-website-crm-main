<template>
  <d2-container v-loading="loading">
    <div class="d2_container" ref="d2">
      <div class="search_page"  ref="search">
        <div class="search">
          <el-button
            v-if="roleInfo.includes(`gift_add`)"
            icon="el-icon-circle-plus-outline"
            class="mr10"
            plain
            @click="newdicitem"
          >新增</el-button>
          <el-button
            v-if="roleInfo.includes(`gift_add`)"
            icon="el-icon-circle-check"
            plain
            type="primary"
            @click="submit"
          >提 交</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        size="mini"
        highlight-current-row
        :max-height="tableHeight"
        style="width: 100%"
      >
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="undefined === scope.row.giftId"
              @click="deleteNewDic(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="giftId" align="center" label="礼品ID(唯一)" min-width="100"></el-table-column>
        <el-table-column prop="giftName" align="center" label="礼品名" min-width="100">
          <template slot-scope="scope">
            <el-input
              size="mini"
              :style="{width:'140px'}"
              v-model="scope.row.giftName"
              maxlength="99"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="inventory" align="center" label="礼品库存" min-width="100">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              size="mini"
              :style="{width:'140px'}"
              v-model="scope.row.inventory"
              maxlength="9"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="giftPrice" align="center" label="礼品价格(￥)" min-width="100">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              :style="{width:'140px'}"
              :controls="false"
              v-model="scope.row.giftPrice"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="giftOrder" align="center" label="排序" min-width="100">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              :style="{width:'60px'}"
              v-model="scope.row.giftOrder"
              :controls="false"
              maxlength="9"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="sortNo" align="center" label="状态" min-width="100">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.giftStatus">
              <el-option value="0" label="启用"></el-option>
              <el-option value="1" label="禁用"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import axios from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  name: 'gift',
  mixins: [mixins],
  data () {
    return {
      loading: false,
      tableHeight: 'auto',
      total: '',
      tableData: [],
      newdicItemValue: ''
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  watch: {
    total: function (val, old) {
      this.$nextTick(function () {
		    this.tableHeight = this.$refs.d2.offsetHeight - this.$refs.search.offsetHeight + 'px'
		  })
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      this.loading = true
      axios.getGiftList().then(({ data }) => {
        console.log(data)
        this.total = data.length
        this.tableData = data
        this.loading = false
      })
    },
    submit () {
      const len = this.tableData.length
      for (let i = 0; i < len; i++) {
        if (this.tableData[i].giftName == '') {
          this.$message({
            message: '礼品名不可为空',
            type: 'error'
          })
          return
        }
        if (!this.tableData[i].giftOrder) {
          this.$message({
            message: '排序不可为空',
            type: 'error'
          })
          return
        }
        if (!this.tableData[i].giftPrice) {
          this.$message({
            message: '礼品价格不可为空',
            type: 'error'
          })
          return
        }
      }
      const submitData = {
        dicName: '礼品',
        dicLabel: 'gift'
      }
      submitData.itemList = this.tableData
      console.log(this.tableData)
      this.loading = true
      axios
        .setGiftItem(this.tableData)
        .then(res => {
          console.log(res)
          this.loading = false
          this.Topage()
        })
        .catch(err => {
          this.$message('提交出错')
          this.loading = false
          console.log(err)
        })
    },
    newdicitem () {
      // if (!this.newdicItemValue) {
      //   this.$message({
      //     message: "字典key不可为空",
      //     type: "error"
      //   });
      //   return;
      // }
      // let len = this.tableData.length;
      // let list = [];
      // for (let i = 0; i < len; i++) {
      //   list.push(this.tableData[i].itemValue);
      // }
      // list.push(this.newdicItemValue);
      // let set = new Set(list);
      // if (len + 1 != set.size) {
      //   this.$message({
      //     message: "字典key不可重复",
      //     type: "error"
      //   });
      //   this.newdicItemValue = "";
      //   return;
      // }
      this.tableData.push({
        giftName: '',
        giftPrice: '',
        giftOrder: null,
        giftStatus: '0'
      })
      this.newdicItemValue = ''
    },
    deleteNewDic (row) {
      console.log(row)
      this.tableData = this.tableData.filter(v => v.giftName !== row.giftName)
    }
  }
}
</script>

<style lang="scss" scoped>
.d2_container{
  width:100%;
  height:100%
}
</style>
