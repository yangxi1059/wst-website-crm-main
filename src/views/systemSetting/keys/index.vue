<template>
  <d2-container v-loading="loading">
    <div class="keys">
        <div class="search_page">
        <div class="search">
            <el-button
            icon="el-icon-circle-plus-outline"
            class="mr10 "
            size="mini"
            plain
            @click="addKey"
            >新增</el-button>
        </div>
        </div>
        <el-table
        :data="listData"
        size="mini"
        highlight-current-row
        style="width: 100%"
        >
        <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editItem(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="accessFor" align="center" label="秘钥说明" min-width="100"></el-table-column>
        <el-table-column prop="accessToken" align="center" label="秘钥" min-width="100"></el-table-column>
        <el-table-column prop="expiresTime" align="center" label="秘钥到期时间" min-width="100"></el-table-column>
        </el-table>
        <el-dialog  :close-on-click-modal="false"
        :title="item.accessToken !==''?'编辑':'新增'"
        :visible.sync="editVisible"
        width="500px"
        :before-close="close"
        >
        <el-form size="mini" inline :model="item" ref="itemData" label-width="120px">
            <el-form-item label="秘钥说明">
            <el-input size="mini" :style="{width:'300px'}" v-model="item.accessFor" maxlength="99"></el-input>
            </el-form-item>
            <el-form-item label="秘钥">
            <el-input size="mini" :style="{width:'300px'}" v-model="item.accessToken" disabled></el-input>
            </el-form-item>
            <el-form-item label="秘钥到期时间">
            <el-date-picker
                size="mini"
                :style="{width:'300px'}"
                v-model="item.expiresTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button
            v-if="item.accessToken !==''"
            type="primary"
            @click="deleteKeyItem(item.accessToken)"
            >删 除</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </span>
        </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/dictionary.js'
export default {
  name: 'keys',
  mixins: [mixins],
  data: function () {
    return {
      listData: [],
      loading: false,
      item: {
        accessFor: '',
        accessToken: '',
        expiresTime: ''
      },
      editVisible: false
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {
    Topage () {
      api.getKeysList().then(res => {
        console.log(res)
        this.listData = res.data
      })
    },
    editItem (v) {
      this.item = { ...v }
      this.editVisible = true
    },
    addKey () {
      this.editVisible = true
    },
    close () {
      this.editVisible = false
      this.item = {
        accessFor: '',
        accessToken: '',
        expiresTime: ''
      }
    },
    submit () {
      this.loading = true
      if (!this.item.accessToken) {
        const data = {
          accessFor: this.item.accessFor,
          expiresTime: this.item.expiresTime
        }
        api
          .addKeysItem(data)
          .then(res => {
            console.log(res)
            this.loading = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.Topage()
          })
          .catch(err => {
            this.loading = false
            this.$message({
              type: 'error',
              message: '添加失败！请重试，或者联系管理员'
            })
          })
      } else {
        const data = {
          accessFor: this.item.accessFor,
          expiresTime: this.item.expiresTime,
          accessToken: this.item.accessToken
        }
        api
          .setKeysItem(data)
          .then(res => {
            console.log(res)
            this.loading = false
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.Topage()
          })
          .catch(err => {
            this.loading = false
            this.$message({
              type: 'error',
              message: '更新失败！请重试，或者联系管理员'
            })
          })
      }
      this.close()
    },
    deleteKeyItem (key) {
      this.loading = true
      api
        .deleteKeysItemBykey(key)
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loading = false
          this.Topage()
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '删除失败'
          })
          this.loading = false
        })
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
