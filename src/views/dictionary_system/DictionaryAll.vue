<template>
  <d2-container v-loading="loading">
    <div class="dictionary">
      <div class="search_page"  >
        <div class="search">
          <el-input
            class="mr10"
            size="mini"
            style="width:150px"
            v-model="search"
            clearable
            placeholder="请输入内容"
            @keyup.enter.native="Topage(1)"
          ></el-input>
          <el-button
            icon="el-icon-search"
            class="mr10"
            size="mini"
            plain
            @click="Topage(1)"
          >搜索</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
          :data="dicData"
          size="mini"
          highlight-current-row
          style="width: 100%"
          row-key="sortNo"
          ref="dicData"
          @row-dblclick="dicedit"
        >
          <el-table-column prop="dicLabel" align="center" label="字典名称" min-width="90px"></el-table-column>
          <el-table-column prop="dicName" align="center" label="字典标识" min-width="90px"></el-table-column>
          <el-table-column prop="parentDicName" align="center" label="父字典" min-width="90px"></el-table-column>
          <el-table-column prop="updateByName" align="center" label="更新人" min-width="90px"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="更新时间" min-width="90px"></el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" :title="'字典项'" :visible.sync="visible" width="1050px" top="10vh" :before-close="clone">
        <el-form
          :model="ruleForm"
          :rules="rules"
          :inline="true"
          size="mini"
          ref="ruleForm"
          label-width="95px"
        >
          <el-form-item label="字典标识：" prop="dicLabel" style="width:45%">
            <span v-if="!isedit" >{{ruleForm.dicLabel}}</span>
            <el-input v-else style="width:350px" v-model="ruleForm.dicLabel"></el-input>
          </el-form-item>
          <el-form-item label="字典名称：" prop="dicName" style="width:45%">
            <span v-if="!isedit">{{ruleForm.dicName}}</span>
            <el-input v-else style="width:350px" v-model="ruleForm.dicName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="父字典：" prop style="width:45%">
            <span v-if="!isedit">{{parentDicName}}</span>
            <el-select v-else style="width:350px" v-model="parentDic" clearable filterable>
              <el-option
                v-for="item in dicData "
                :key="item.dicLabel"
                :label="item.dicName"
                :value="item.dicLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字典描述：" prop="remark" style="width:45%">
            <span v-if="!isedit">{{ruleForm.remark}}</span>
            <el-input v-else style="width:350px" v-model="ruleForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="操作：" v-if="isedit">
            <el-button icon="el-icon-circle-plus-outline" class="ml10" type="primary" size="mini" @click="newdicitem">添加字典项</el-button>
          </el-form-item>
        </el-form>

        <div ref="vxeTable" :style="{maxHeight:maxHeight,overflow:'auto'}">
          <vxe-table
            :data="settingsdic.data"
            size="mini"
            highlight-current-row
            show-overflow
            show-header-overflow
            :scroll-y="settingsScorllY"
            :keep-source="true"
            style="width: 100%"
            ref="dragTable"
            :edit-config=" {trigger: 'click', mode: 'cell', showStatus: true,enabled:isedit} "
            :edit-rules="rules"
            @edit-closed="editClosedEvent"
          >
            <vxe-table-column field="itemNameEng" align="left"  title="字典英文值" min-width="240" sortable :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="itemName" align="left"  title="字典中文值" min-width="240px" sortable :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="itemRemark" align="left"  title="字典备注" min-width="240px" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="dicStatus" align="left" title="状态" width="100" sortable :edit-render="{name: '$select', options: dicStatusList}"></vxe-table-column>
            <vxe-table-column field="parentItem" align="left" title="父字典" min-width="80" :edit-render="{name: '$select', options: parentDicItemList}"></vxe-table-column>
          </vxe-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clone" v-if="isedit">取 消</el-button>
          <el-button type="primary" @click="submit" v-if="isedit">确 定</el-button>
          <el-button type="primary" @click="edit" v-if="roleInfo.includes(`dic_${ruleForm.dicLabel}_edit`) && !isedit">编 辑</el-button>
        </span>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import apiDic from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import Sortable from 'sortablejs'
import { mapState } from 'vuex'

let _this
export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ]),
  },
  data () {
    _this = this
    return {
      loading: false,
      maxHeight: 'calc(90vh - 420px)',
      settingsScorllY: { enabled: false },
      search: '',
      pageSize: 100,
      pageNum: 1,
      total: 0,
      dicData: [],
      visible: false,
      isedit: false,
      ruleForm: {
        dicName: '',
        dicLabel: '',
        remark: ''
      },
      parentDic: null,
      parentDicName: null,
      rules: {
        dicName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dicLabel: [
          { required: true, message: '请输入字典标识', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '字典Value不可为空' }
        ],
        itemNameEng: [
          { required: true, message: '字典英文Value不可为空' }
        ]
      },
      settingsdic: {
        data: []
      },
      dicStatusList: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ],
      parentDicItemList: []
    }
  },
  watch: {
    parentDic: function (val) {
      console.log(val)
      this.parentDicItemList = []
      if (val) {
        apiDic.dicitem(val).then(({ data }) => {
          console.log(data, 111111111111111111111)
          data.forEach(v => {
            const u = { label: v.itemName, value: v.itemValue }
            this.parentDicItemList.push(u)
          })
        })
        this.settingsdic.data.forEach((v) => {
          v.parentItem = ''
        })
      }
    }
  },
  filters: {
    // 支付状态过滤器
    filterDicStatus (value) {
      switch (value) {
        case '0':
          // 通过
          return '启用'
        case '1':
          // 拒绝
          return '禁用'
      }
    },
    filterParentItem (value) {
      const a = _this.parentDicItemList.filter((v) => {
        return v.itemValue == value
      })
      return a.length > 0 ? a[0].itemName : ''
    }
  },
  mounted () {
    this.Topage(1)
    window.dicedit = row => this.dicedit(row)
  },
  methods: {
    Topage () {
      const Data = {
        search: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      apiDic.diclist(Data).then(({ data }) => {
        console.log(data)
        this.pageNum = data.page
        this.dicData = data.rows
        this.total = data.total
      })
    },
    newdic () {
      this.visible = true
      this.isedit = false
    },
    newdicitem () {
      this.$refs.vxeTable.scrollTop = 0
      this.settingsdic.data.unshift({
        itemName: '',
        itemNameEng: '',
        itemValue: '',
        itemRemark: '',
        parentItem: '',
        parentItemName: '',
        sortNo: null,
        dicStatus: '0'
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.Topage(this.pageNum)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.Topage(this.pageNum)
    },
    changeSort (a, b, c) {
      console.log(a, b, c)
      if (this.$refs.dragTable.tableData && this.$refs.dragTable.tableData.length > 0) {
        console.log(this.$refs.dragTable.tableData)
        this.settingsdic.data = this.$refs.dragTable.tableData
      }
    },
    dicedit (row) {
      let item = row
      console.log(item)
      item = JSON.parse(JSON.stringify(item))
      this.ruleForm = {
        dicName: item.dicName,
        dicLabel: item.dicLabel,
        remark: item.remark
      }
      this.parentDic = item.parentDicLabel
      this.parentDicName = item.parentDicName
      this.loading = true
      this.getdicitem(item.dicLabel)
    },
    getdicitem (dicLabel) {
      apiDic.getDicListDetailByDicId(dicLabel).then(res => {
        console.log(res.data)
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.settingsdic.data = res.data.itemArr
          this.setSort()
        })
      })
    },
    setSort () {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.settingsdic.data.splice(evt.oldIndex, 1)[0]
          this.settingsdic.data.splice(evt.newIndex, 0, targetRow)

          console.log(this.settingsdic.data)
        }
      })
    },
    clone () {
      this.$refs.dragTable.clearSort()
      this.visible = false
      this.parentDic = ''
      this.parentDicItemList = []
      this.parentDicName = ''
      this.isedit = false
      setTimeout(() => {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {
          dicName: '',
          dicLabel: '',
          remark: ''
        }
      }, 200)
    },
    submit () {
      // this.settingsdic.data = this.$refs.dragTable.tableData
      console.log(this.settingsdic.data)
      const len = this.settingsdic.data.length
      for (let i = 0; i < len; i++) {
        this.settingsdic.data[i].sortNo = i + 1
        if (this.parentDic) {
          this.settingsdic.data[i].parentDic = this.parentDic
        } else {
          this.settingsdic.data[i].parentDic = ''
          this.settingsdic.data[i].parentItem = ''
        }
        if (this.settingsdic.data[i].itemName == '') {
          this.$message({
            message: '字典Value不可为空',
            type: 'error'
          })
          return
        }
        if (this.settingsdic.data[i].itemNameEng == '') {
          this.$message({
            message: '字典英文Value不可为空',
            type: 'error'
          })
          return
        }
        if (!this.settingsdic.data[i].sortNo) {
          this.$message({
            message: '排序不可为空',
            type: 'error'
          })
          return
        }
      }
      const submitData = JSON.parse(JSON.stringify(this.ruleForm))
      submitData.itemList = this.settingsdic.data
      if (this.parentDic) {
        submitData.parentDic = this.parentDic
      } else {
        submitData.parentDic = ''
      }
      this.loading = true
      apiDic
        .setDicList(submitData)
        .then(res => {
          console.log(res)
          this.$refs.ruleForm.validate(valid => {
            if (!valid) return
            this.clone()
          })
          this.loading = false
          this.Topage(this.pageNum)
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    edit () {
      this.isedit = true
    },
    editClosedEvent () {},
    deleteNewDic (row) {
      console.log(row)
      this.settingsdic.data = this.settingsdic.data.filter(
        v => v.itemValue !== row.itemValue
      )
    }
  }
}
</script>

<style lang='scss'>
.vxe-select--panel{
  z-index:9998!important;
}
</style>
