<!--
 * @Author: kaan
 * @Date: 2021-03-12 14:14:45
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 16:47:27
 * @Version:
 * @Description:
-->
<template>
  <!-- 领券弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="'领取优惠券'"
      :visible.sync="couponVisible"
      width="400px"
      :before-close="close"
    >
      <div style="width:100%; text-align:center">
        <span class="mr10">领取</span>
        <el-input-number v-model="num" :min="1" :max="(restNum > 99 || couponNum == -1) ? 99: restNum" size="mini"></el-input-number>
        <span class="ml10">张</span><br><br>
        <span v-if="couponNum == -1 ">可用 ∞ 张(单次领取上限99张)</span>
        <span v-else class="mt10">可用 {{restNum}} 张 / 限量 {{couponNum}} 张(单次领取上限99张)</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit">确 定</el-button></el-button>
      </span>
    </el-dialog>
</template>
<script>
import mixins from '@/plugin/mixins'
import api from '@/api/activity.js'
import { mapState } from 'vuex'

export default {
  name: 'activityEdit',
  mixins: [mixins],
  props: {
    couponVisible: {
      type: Boolean,
      default: false
    },
    discountId: {
      type: String,
      default: ''
    },
    restNum: {
      type: Number,
      default: 1
    },
    couponNum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      num: 1
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  watch: {
    couponVisible: function (val) {
      if (val) {
      }
    }
  },
  methods: {
    close () {
      console.log('关闭')
      this.$emit('close')
    },
    submit () {
      const params = {
        discountId: this.discountId,
        num: this.num
      }
      api.receiveCoupon(params).then(res => {
        this.$emit('submit')
        this.close()
      })
    }
  }
}
</script>
