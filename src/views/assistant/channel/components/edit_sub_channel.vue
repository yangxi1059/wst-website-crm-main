<template>
  <div class="inputInformation">
    <el-dialog
      :title="sourceId ? '编辑来源' : '新增来源'"
      class="info"
      :close-on-click-modal="false"
      :visible.sync="editSubVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="subChannelData"
        :rules="rules"
        ref="ruleForm"
        label-width="160px"
      >
        <el-form-item label="来源名" prop="sourceName">
          <el-input :style="{width:widths}" v-model="subChannelData.sourceName" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="sourceStatus">
          <el-select
            :style="{width:widths}"
            v-model="subChannelData.sourceStatus"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in  common_yes_or_no"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返佣" prop="brokerageStatus">
          <el-select
            :style="{width:widths}"
            v-model="subChannelData.brokerageStatus"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in  brokerage_status"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定返佣金额（$）" prop="fixedBrokerage">
          <el-input-number
            :controls="false"
            :style="{width:widths}"
            v-model="subChannelData.fixedBrokerage"
            type="textarea"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="来源备注" prop="sourceNote">
          <el-input
            :style="{width:widths}"
            v-model="subChannelData.sourceNote"
            type="textarea"
            :autosize="{minRows:3}"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  name: 'inputInformation',
  props: {
    channelId: {
      type: String,
      default: ''
    },
    sourceId: {
      type: String,
      default: ''
    },
    editSubVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '160px',
      rules: {
        sourceName: [{ required: true, message: '必填', trigger: 'blur' }],
        brokerageStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        sourceStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      subChannelData: {
        sourceStatus: '1'
      },
      brokerage_status: [],
      common_yes_or_no: []
    }
  },
  mounted () {
    this.pageInit()
  },
  watch: {
    editSubVisible: function (newData) {
      if (newData && this.sourceId) {
        this.getSubChannelById(this.sourceId)
      } else {
        this.subChannelData = {
          sourceStatus: '1'
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
      this.brokerage_status = await this.getDictionary('brokerage_status')
    },
    getSubChannelById (sourceId) {
      this.$loading({ background: 'rgba(0,0,0,.5)' })
      api.getSubChannelById(sourceId).then(res => {
        console.log('getChannelById', res.data)
        this.subChannelData = res.data
        this.$loading().close()
      })
    },
    // 录入信息，关闭
    handleClose () {
      this.$emit('close')
      this.clean()
    },
    clean () {
      this.subChannelData = {
        sourceStatus: '1'
      }
      this.$refs.ruleForm.resetFields()
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        if (
          this.subChannelData.brokerageStatus == 'fixed_brokerage' &&
          !this.subChannelData.fixedBrokerage
        ) {
          this.$message({
            type: 'warning',
            message: '固定返佣时，金额必填!'
          })
          return
        }
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          channelId: this.channelId,
          sourceName: this.subChannelData.sourceName,
          sourceStatus: this.subChannelData.sourceStatus,
          brokerageStatus: this.subChannelData.brokerageStatus,
          fixedBrokerage: this.subChannelData.fixedBrokerage,
          sourceNote: this.subChannelData.sourceNote
        }
        console.log(data)
        if (this.sourceId) {
          data.sourceId = this.sourceId
          api.uptSubChannel(data).then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit', this.channelId)
            this.clean()
          })
        } else {
          api.addSubChannel(data).then(() => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit', this.channelId)
            this.clean()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
