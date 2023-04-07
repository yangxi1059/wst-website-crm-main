<!--
 * @Author: 杨曦
 * @Date: 2021-12-06 17:29:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-07 10:56:26
 * @Version:
 * @Description:
-->
<template>
  <div class="position">
    <el-dialog :close-on-click-modal="false"
      width="600px"
      title="职位"
      :visible.sync="positionVisible"
      :before-close="close"
    >
      <div class="add-event">
        <el-timeline>
          <el-timeline-item v-for="(item,i) in events" :key="i" >
            <el-card>
              <el-tag class="mr10">身份：{{item.position}}</el-tag>
              <el-tag type="danger" v-if="item.bdBrokerageRate">提成比例：{{item.bdBrokerageRate}}</el-tag>
              <div style="text-align:right">
                <el-button size="mini" v-if="item.position == 'bd'" @click="editItem(item)" type="primary">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteItem(item.pkId)">删除</el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="add">新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
      width="480px"
      :visible.sync="addVisible"
      :before-close="closeAdd"
    >
      <div class="add-event">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="职位名称" prop="position">
            <el-select v-model="ruleForm.position" style="width:300px" placeholder="职位">
              <el-option
                v-for="item in list"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="BD提成比例" v-if="ruleForm.position == 'bd'" prop="bdBrokerageRate">
            <el-input style="width:300px" placeholder="请输入0-100数字，非必填" v-model="ruleForm.bdBrokerageRate" >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
    <setBdBrokerageRate :closeStatue="closeStatue" :bdBrokerageRate="bdBrokerageRate" :showVisible="showVisible" @close="closeShow" @submit="submitShow" />
  </div>
</template>
<script>
import api from '@/api/hr.js'
import mixins from '@/plugin/mixins'
import setBdBrokerageRate from '@/components/setBdBrokerageRate.vue'

export default {
  name: 'position',
  mixins: [mixins],
  props: {
    positionVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  components: { setBdBrokerageRate },
  data () {
    return {
      dataNew: {},
      closeStatue: true,
      events: [],
      bdBrokerageRate: '',
      showVisible: false,
      rules: {
        position: [{ required: true, message: '必填', trigger: 'blur' }],
        bdBrokerageRate: [{ pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/, message: '0-100数字,小数点保留2位', trigger: 'blur' }]
      },
      addVisible: false,
      list: [
        { name: 'sales', key: 'sales' },
        { name: 'sales_assistant', key: 'sales_assistant' },
        { name: 'strategist', key: 'strategist' },
        { name: 'services', key: 'services' },
        { name: 'bd', key: 'bd' }
      ],
      ruleForm: {
        position: ''
      }
    }
  },
  mounted () {},
  watch: {
    positionVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getPosition(this.userId).then(res => {
        console.log('职位数据', res)
        this.events = res.data
      })
    },
    close () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.events = []
    },
    add () {
      this.addVisible = true
    },
    editItem (item) {
      const data = {
        pkId: item.pkId,
        position: item.position,
        userId: item.userId,
        bdBrokerageRate: item.bdBrokerageRate
      }
      this.showVisible = true
      this.dataNew = data
      this.bdBrokerageRate = item.bdBrokerageRate
      console.log(data)
    },
    deleteItem (pkId) {
      console.log(pkId)
      this.$confirm('此操作将永久删除该职位用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delPosition(pkId).then(res => {
          this.$message.success('删除成功')
          this.Topage()
        })
      })
    },
    closeAdd () {
      this.ruleForm = {
        position: ''
      }
      this.addVisible = false
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return false
        const data = {
          position: this.ruleForm.position,
          userId: this.userId
        }
        if (this.ruleForm.bdBrokerageRate) {
          data.bdBrokerageRate = this.ruleForm.bdBrokerageRate / 100
        }
        api.addPosition(data).then(() => {
          this.$message.success('新增成功')
          this.closeAdd()
          this.Topage()
        })
      })
    },
    closeShow () {
      this.showVisible = false
    },
    submitShow (value) {
      this.showVisible = false
      const data = this.dataNew
      if (value) {
        data.bdBrokerageRate = value / 100
      } else {
        data.bdBrokerageRate = value
      }
      console.log(data)
      api.editPosition(data).then(() => {
        this.Topage()
        this.$message.success('修改成功！！')
      })
    }
  }
}
</script>
<style scoped>

</style>
