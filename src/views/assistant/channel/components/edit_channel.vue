<template>
  <div class="inputInformation">
    <el-dialog
      :title="channelId ? '编辑渠道' : '新增渠道'"
      class="info"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="channelData"
        :rules="rules"
        ref="ruleForm"
        label-width="160px"
      >
        <el-form-item label="渠道名" prop="channelName">
          <el-input :style="{width:widths}" v-model="channelData.channelName" :maxlength="99"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="channelStatus">
          <el-select
            :style="{width:widths}"
            v-model="channelData.channelStatus"
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
        <el-form-item label="渠道备注" prop="channelRemark">
          <el-input
            :style="{width:widths}"
            v-model="channelData.channelRemark"
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
    editVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widths: '230px',
      rules: {
        channelName: [{ required: true, message: '必填', trigger: 'blur' }],
        channelStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      channelData: {
        channelStatus: '1'
      },
      common_yes_or_no: []
    }
  },
  mounted () {},
  watch: {
    editVisible: function (newData) {
      this.pageInit()
      if (newData && this.channelId) {
        this.getChannelById(this.channelId)
      } else {
        this.channelData = {
          channelStatus: '1'
        }
      }
    }
  },
  methods: {
    async pageInit () {
      this.common_yes_or_no = await this.getDictionary('common_yes_or_no')
    },
    getChannelById (channelId) {
      this.$loading({ background: 'rgba(0,0,0,.5)' })
      api.getChannelById(channelId).then(res => {
        console.log('getChannelById', res.data)
        this.channelData = res.data
        this.$loading().close()
      })
    },
    // 录入信息，关闭
    handleClose () {
      this.$emit('close')
      this.clean()
    },
    clean () {
      this.channelData = {
        channelStatus: '1'
      }
      this.$refs.ruleForm.resetFields()
    },
    // 录入信息，确认
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.$loading({ background: 'rgba(0,0,0,.5)' })
        const data = {
          channelName: this.channelData.channelName,
          channelStatus: this.channelData.channelStatus,
          channelRemark: this.channelData.channelRemark
        }
        if (this.channelId) {
          data.channelId = this.channelId
          api.uptChannel(data).then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
            this.clean()
          })
        } else {
          api.addChannel(data).then(() => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.$loading().close()
            this.$emit('submit')
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
