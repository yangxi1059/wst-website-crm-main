<!--
 * @Author: 杨曦
 * @Date: 2022-01-14 14:17:16
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-29 16:01:55
 * @Version: 
 * @Description: 
-->
<template>
  <div class="pay-way">
    <el-drawer
      size="90%"
      title="账户"
      :visible.sync="payAccountVisible"
      :before-close="beforePayWayClose"
    >
      <accountComponents ref="child" :payAccountVisible="payAccountVisible" :cooperatorId="cooperatorId" />
    </el-drawer>
  </div>
</template>
<script>
import api from '@/api/bd.js'
import mixins from '@/plugin/mixins'
import accountComponents from '@/components/account_components.vue'
export default {
  name: 'payWay',
  mixins: [mixins],
  components: { accountComponents },
  props: {
    payAccountVisible: {
      type: Boolean,
      default: false
    },
    cooperatorId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      payWayList: [],
      tableData: [],
      payWaySubmitList: {
        uptList: [],
        addList: [],
        delList: []
      },
      accountType: null,
      bankVisible: false,
      aliPayVisible: false,
      wxPayVisible: false,
      venmoVisible: false,
      boaVisible: false,
      usAccountVisible: false,
      cAccountVisible: false,
      ukAccountVisible: false,
      aAccountVisible: false,
      singaporeAccountVisible: false,
      accountData: {}
    }
  },
  mounted () {
  },
  watch: {
    payAccountVisible: function (newData, oldData) {
      if (newData) {
        this.Init()
      }
    }
  },
  methods: {
    Init () {
      this.$nextTick(() => {
        console.log(this.$refs.child)
        this.$refs.child.init()
      })
    },
    beforePayWayClose () {
      console.log(this.$refs.child)
      this.$refs.child.beforePayWayClose()
      this.$emit('close')
    },
  }
}
</script>
