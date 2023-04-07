<!--
 * @Author: 库建华
 * @Date: 2020-05-27 15:05:57
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-21 13:33:24
 * @Version: 1
 * @Description:大陆社团Mainland community
-->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false" title="tips" :visible.sync="tipVisible" width="500px" :before-close="tipClose">
      <el-input
        type="textarea"
        :autosize="{minRows:3}"
        v-model="tipData.tips"
        :maxlength="255"
        placeholder="限制255字符"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipClose">取 消</el-button>
        <el-button type="primary" @click="tipSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'
export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    tipVisible: {
      type: Boolean,
      default: false
    },
    tipData: {}
  },
  data () {
    return {
    }
  },
  computed: {},
  watch: {
    tipVisible: function (val) {
      if (val) {
      }
    }
  },
  mounted () {
  },
  methods: {
    tipClose () {
      this.$emit('close')
    },
    tipSubmit () {
      console.log(this.tipData)
      const data = {
        cooperatorId: this.tipData.cooperatorId,
        tips: this.tipData.tips
      }
      console.log(data)
      api
        .setCooperatorTips(data)
        .then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$loading().close()
          this.tipClose()
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '失败',
            type: 'error'
          })
          this.$loading().close()
          this.$emit('close')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
