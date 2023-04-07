<!--
 * @Author: 库建华
 * @Date: 2019-11-05 16:12:31
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-06 10:28:09
 * @Version: 1
 * @Description:
 -->
 <template>
  <div class="mentor-price-rule-edit">
    <el-dialog title="规则详情" :visible.sync="editVisible" width="1400px" :before-close="close">
      <div class="search_page">
        <div class="search">
          <el-form :inline="true" label-width="150px" :rules="rules" :model="submitData" ref="tableValidate">
            <el-form-item>
              <el-input-number v-model="middle" placeholder="分割位" :controls="false" size="mini"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button class="mr20" size="mini" plain @click="addRuleItem()">新增分割位</el-button>
            </el-form-item>
            <el-form-item label=" ">
              <span></span>
            </el-form-item>
            <el-form-item label="佣金规则标题" prop="ruleName">
              <el-input :style="{width:'500px'}" v-model="submitData.ruleName"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" size="mini" highlight-current-row >
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="deleteRuleItem(scope.row,scope.$index)"
              v-if="!!scope.$index"
              class="el-icon-tickets"
            >删 除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fromHour" label="开始位">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              :controls="false"
              v-model="scope.row.fromHour"
              :disabled="true"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="toHour" label="结束位">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              :controls="false"
              v-model="scope.row.toHour"
              :disabled="true"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="compensationType" label="货币类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.compensationType" size="mini">
              <el-option value="cny" label="人民币"></el-option>
              <el-option value="usd" label="美金"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="compensation" label="基本佣金">
          <template slot-scope="scope">
            <el-input-number size="mini" :controls="false" v-model="scope.row.compensation"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="meritCompensation" label="绩效佣金">
          <template slot-scope="scope">
            <el-input-number size="mini" :controls="false" v-model="scope.row.meritCompensation"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button class="mr10" @click="close">取 消</el-button>
        <el-button class="mr10" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip.js'
export default {
  name: 'edit',
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    ruleId: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      tableData: [
        {
          compensationType: 'usd',
          fromHour: 0,
          toHour: Infinity,
          compensation: 0,
          meritCompensation: 0
        }
      ],
      middle: '',
      submitData: { ruleName: '' },
      rules: {
        ruleName: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    editVisible: function (val) {
      if (val && !!this.ruleId) {
        this.initTable()
      }
    }
  },
  methods: {
    initTable () {
      api.getPriceRuleDetailByRuleId(this.ruleId).then(res => {
        this.tableData = res.data
        this.tableData[this.tableData.length - 1].toHour = Infinity
        this.submitData.ruleName = res.data[0].ruleName
      })
    },
    close () {
      this.tableData = [
        {
          compensationType: 'usd',
          fromHour: 0,
          toHour: Infinity,
          compensation: 0,
          meritCompensation: 0
        }
      ]
      this.submitData = { ruleName: '' },
      this.middle = null
      this.$emit('close')
    },
    submit () {
      this.$refs.tableValidate.validate(valid => {
        if (!valid) return
        console.log(this.tableData)
        delete this.tableData[this.tableData.length - 1].toHour
        this.submitData.addList = this.tableData
        this.submitData.ruleId = this.ruleId
        this.submitData.ruleContent = ''
        // JSON.stringify(this.tableData,['fromHour','toHour','compensation']);
        this.tableData.forEach(v => {
          const currency = v.compensationType == 'usd' ? '$' : '¥'
          this.submitData.ruleContent += v.fromHour + ' ~ ' + (v.toHour || '∞') + '课时 : ' +
          currency + v.compensation + '基本 + ' + currency + v.meritCompensation + '绩效'
        })
        api
          .setPriceRuleDetail(this.submitData)
          .then(res => {
            this.$emit('submit')
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      })
    },
    addRuleItem () {
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.middle || this.middle === this.tableData[i].toHour) {
          this.$message('该分割位已存在')
          this.middle = null
          return
        } else if (this.middle < this.tableData[i].toHour) {
          const item = {
            compensationType: 'usd',
            fromHour: this.middle + 1,
            toHour: this.tableData[i].toHour,
            compensation: 0,
            meritCompensation: 0
          }
          this.tableData[i].toHour = this.middle
          this.tableData.splice(i + 1, 0, item)
          this.middle = null
          return
        }
      }
    },
    deleteRuleItem (v, i) {
      if (i == 0) {
        this.$message({
          type: 'warning',
          message: '首位不可删除'
        })
        return
      }
      this.tableData[i - 1].toHour = this.tableData[i].toHour
      this.tableData.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
