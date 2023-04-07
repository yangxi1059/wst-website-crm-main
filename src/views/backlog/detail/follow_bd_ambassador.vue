
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"
      :title="'校园大使follow up'"
      :visible.sync="setFollowUpAmbassadorVisible"
      width="500px"
      :before-close="close"
    >
      <el-form
        size="medium"
        inline
        :model="cacheFollowUpData"
        :rules="rules"
        ref="followUp"
        label-width="120px"
      >
        <el-form-item label="开始日期" prop="beginDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheFollowUpData.beginDate"
            :clearable="false"
            :disabled="!!cacheFollowUpData.pkId"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="endDate">
          <el-date-picker
            :style="{width:widths}"
            v-model="cacheFollowUpData.endDate"
            :clearable="false"
            :disabled="!!cacheFollowUpData.pkId"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <template v-if="setFollowUpContent">
          <el-form-item label="followUp状态" prop="followStatus">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="cacheFollowUpData.followStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in bd_follow_status"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="followUp内容" prop="followResult">
            <el-input
              :style="{width:widths}"
              type="textarea"
              :autosize="{minRows:3}"
              v-model="cacheFollowUpData.followResult"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/bd.js'

export default {
  name: 'setFollowUp',
  mixins: [mixins],
  props: {
    setFollowUpAmbassadorVisible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    }
  },
  data () {
    return {
      cacheFollowUpData: {
        pkId: null,
        ambassadorId: null,
        beginDate: null,
        endDate: null,
        followStatus: null,
        followResult: null
      },

      widths: '250px',
      rules: {
        beginDate: [{ required: true, message: '必填', trigger: 'blur' }],
        endDate: [{ required: true, message: '必填', trigger: 'blur' }],
        followStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        followResult: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      bd_follow_status: [],
      setFollowUpContent: false
    }
  },
  computed: {},
  watch: {
    setFollowUpAmbassadorVisible: function (val) {
      if (val) {
        this.cacheFollowUpData = { ...this.detailData }
        this.setFollowUpContent = !!this.cacheFollowUpData.pkId
      }
    },
    'cacheFollowUpData.beginDate': function (val) {
      console.log(val, new Date(val) < new Date())
      if (!this.cacheFollowUpData.pkId) {
        this.setFollowUpContent = new Date(val) < new Date()
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.bd_follow_status = await this.getDictionary('bd_follow_status')
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.cacheFollowUpData = {
        pkId: null,
        ambassadorId: null,
        beginDate: null,
        endDate: null,
        followStatus: null,
        followResult: null
      }
      this.$refs.followUp.resetFields()
    },
    submit () {
      console.log(
        '个人信息提交',
        this.$refs.cacheFollowUpData,
        this.cacheFollowUpData
      )
      // this.cacheFollowUpData.ambassadorId = this.detailData.ambassadorId;
      this.$refs.followUp.validate(valid => {
        if (!valid) return
        console.log(this.cacheFollowUpData)
        if (this.cacheFollowUpData.pkId) {
          api
            .uptFollowUp(this.cacheFollowUpData)
            .then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.close()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: '失败',
                type: 'error'
              })
              this.$loading().close()
              this.$emit('submit')
              this.close()
            })
        } else {
          api
            .addFollowUp(this.cacheFollowUpData)
            .then(() => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: '失败',
                type: 'error'
              })
              this.$loading().close()
              this.$emit('submit')
              this.clear()
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
