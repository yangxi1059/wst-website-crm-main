<!--
 * @Author: 库建华
 * @Date: 2019-09-09 17:03:50
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-12-11 09:04:21
 * @Version:
 * @Description:
 -->
<template>
  <div class="hr-user-edit">
    <el-dialog :close-on-click-modal="false"  :visible.sync="interviewerVisible" width="900px" :before-close="close">
        <template slot="title">
            <div style="display:flex;">
                <div style="margin-right:40px;font-size:18px;line-height:32px;font-weight:500">面试信息列表</div>
                <el-button type="primary" size="small" @click="addInterviewMsg">新增</el-button>
            </div>
        </template>
            <div>
                <el-table
                    class="yx_sortTable"
                    :data="tableData"
                    size="mini"
                    v-loading="loading"
                    highlight-current-row
                    style="width: 100%"
                    ref="dragTable"
                    row-key="sort"
                >
                    <el-table-column align="center"  label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button
                            type="text"
                            size="mini"
                            @click="deleteInterview(scope.$index)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" align="center"   label="第几轮" min-width="20">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="interviewerName" align="center"   label="面试官姓名" min-width="90">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.interviewerId" size="mini" placeholder="请选择">
                                <el-option
                                v-for="item in users"
                                :key="item.userId"
                                :label="item.userName"
                                :value="item.userId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="interviewTime" align="center"   label="面试时间" min-width="90">
                        <template slot-scope="scope">
                            <el-date-picker
                                size="mini"
                                v-model="scope.row.interviewTime"
                                type="datetime"
                                placeholder="选择面试时间">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="remark" align="center"   label="面试评价" min-width="90">
                        <template slot-scope="scope">
                            <el-input
                            size="mini"
                            type="textarea"
                            :rows="2"
                            placeholder="面试评价"
                            v-model="scope.row.remark">
                            </el-input>
                        </template>
                    </el-table-column> -->
                </el-table>
                <div class="mt20">
                    <el-form label-width="95px">
                        <el-form-item label="录用状态：">
                            <el-select v-model="hireStatus" placeholder="请选择">
                                <el-option
                                v-for="item in interviewee_hire_status"
                                :key="item.itemValue"
                                :label="item.itemName"
                                :value="item.itemValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">关 闭</el-button>
                <el-button @click="submit" type="primary">保 存</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/hr.js'
import Sortable from 'sortablejs'
import api3 from '@/api/sales_assistant.js'

export default {
  name: 'edit',
  mixins: [mixins],
  props: {
    interviewerVisible: {
      type: Boolean,
      default: false
    },
    intervieweeData: {
      type: Object
    }
  },
  data () {
    return {
      tableData: [],
      hireStatus: '',
      interviewee_hire_status: [],
      users: [],
      loading: false
    }
  },
  computed: {},
  watch: {
    interviewerVisible: function (val) {
      if (val) {
        this.hireStatus = JSON.parse(JSON.stringify(this.intervieweeData)).hireStatus
        this.toPage()
      }
    }
  },
  mounted () {
    this.pageInit()
    api3.getUserList().then(({ data }) => {
      this.users = data
    })
    console.log(this.intervieweeData)
  },
  methods: {
    async pageInit () {
      this.interviewee_hire_status = await this.getDictionary('interviewee_hire_status')
    },
    toPage () {
      this.loading = true
      api.getInterviewerList(this.intervieweeData.intervieweeId).then(res => {
        this.$nextTick(() => {
          this.tableData = res.data
          console.log(res.data)
          this.setSort()
          this.loading = false
        })
      })
    },
    setSort () {
      const el = document.querySelectorAll('.yx_sortTable > .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    submit () {
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].interviewTime || !this.tableData[i].interviewerId) {
          this.$message.error('面试人和面试时间为必填项，请检查输入内容后提交')
          return false
        }
        this.tableData[i].sort = i + 1
      }
      const interviewerArr = []
      for (let i = 0; i < this.tableData.length; i++) {
        interviewerArr.push({
          interviewTime: this.tableData[i].interviewTime,
          sort: this.tableData[i].sort,
          remark: this.tableData[i].remark,
          interviewerId: this.tableData[i].interviewerId
        })
      }
      const data = {
        intervieweeId: this.intervieweeData.intervieweeId,
        hireStatus: this.hireStatus,
        interviewerArr: interviewerArr
      }
      console.log(this.tableData, data)
      api.editInterviewerList(data).then(res => {
        this.$message.success('保存成功！！！')
        console.log(res)
        this.$emit('submit')
      })
    },
    addInterviewMsg () {
      for (let i = 0; i < this.tableData.length; i++) {
        console.log(this.tableData[i].interviewTime, this.tableData[i].interviewerId)
        if (!this.tableData[i].interviewTime || !this.tableData[i].interviewerId) {
          this.$message.error('请先补充原有面试信息后才可新增')
          return false
        }
      }
      this.tableData.push({
        interviewerId: '',
        sort: null,
        remark: '',
        interviewTime: ''
      })
    },
    close () {
      this.hireStatus = ''
      this.tableData = []
      this.$emit('close')
    },
    deleteInterview (index) {
      console.log(2313122, index)
      this.tableData.splice(index, 1)
    }
  }
}
</script>
