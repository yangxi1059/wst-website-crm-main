<!--
 * @Author: 杨曦
 * @Date: 2020-09-03 16:17:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-26 10:27:31
 * @Version:
 * @Description:
-->
<!--
 * @Author: 杨曦
 * @Date: 2020-07-02 14:07:09
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-10-21 17:58:20
 * @Version:
 * @Description:
-->
<template>
    <el-dialog :close-on-click-modal="false" title="授权码详情" :visible.sync="addVisible" width="800px" :before-close="close">
        <div class="yx_elform_bottom">
            <template>
                <el-form :data="detailData" >
                    <el-form-item label="授权码:" prop="" label-width="150px">
                        <p>{{detailData.codeKey|| '无' }}</p>
                    </el-form-item>
                </el-form>
            </template>
        </div>
        <span slot="footer">
            <el-button @click="close">取 消</el-button>
            <el-button @click="submit" type="primary">提 交</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
  name: 'text-addBook',
  data () {
    return {
      detailData: {}
    }
  },
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    addVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {

    },
    clear () {

    },
    close () {
      this.clear()
      this.$emit('close')
    },
    submit () {
      this.clear()
      this.$emit('submit')
    }
  }
}
</script>

<style>
    .yx_elform_bottom .el-form-item{
        margin-bottom: 0px;
    }
</style>
