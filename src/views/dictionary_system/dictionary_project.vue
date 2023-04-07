<template>
  <d2-container v-loading="loading">
    <div class="dictionary" >
      <el-card class="mb10">
        <div>
          <div slot="header" class="clearfix">
            <span style="font-size:16px">字典项【{{ruleForm.dicLabel}}】详情</span>
            <div style="float: right; padding: 3px 0">
              <el-button
                icon="el-icon-edit"
                class="mr10"
                v-if=" !isedit && !sortable"
                size="mini"
                type="primary"
                @click="newdic"
              >编辑</el-button>
              <el-button
                icon="el-icon-remove"
                class="mr10"
                v-if=" isedit"
                size="mini"
                type="primary"
                @click="cancelNewdic"
              >取消编辑</el-button>
              <el-button
                v-if="isedit"
                icon="el-icon-success"
                class="mr10"
                size="mini"
                type="success"
                @click="submit"
              >保存</el-button>
            </div>
          </div>
          <div style="">
            <el-form
              :model="ruleForm"
              :rules="rules"
              size="medium"
              ref="ruleForm"
              inline
              label-width="100px"
            >
              <el-form-item style="margin-bottom:10px" label="字典名称：" prop="dicName">
                <el-input style="width:350px" v-if="isedit && canEdit" v-model="ruleForm.dicName" maxlength="99"></el-input>
                <div v-else style="width:350px">{{ruleForm.dicName}}</div>
              </el-form-item>
              <el-form-item style="margin-bottom:10px" label="父字典：" prop>
                <el-select v-if="isedit && canEdit" style="width:350px" v-model="parentDic" clearable filterable>
                  <el-option
                    v-for="item in settings "
                    :key="item.dicLabel"
                    :label="item.dicName"
                    :value="item.dicLabel"
                  ></el-option>
                </el-select>
                <div v-else style="width:350px">{{ruleForm.parentDicName}}</div>
              </el-form-item>
              <br>
              <el-form-item style="margin-bottom:0px" label="字典描述："  prop="remark">
                <el-input style="width:350px" v-if="isedit && canEdit" v-model="ruleForm.remark" type="textarea" rows="3"></el-input>
                <div v-else style="width:350px">{{ruleForm.remark}}</div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
      <div class="search_page">
        <div class="search">
          <el-button
            icon="el-icon-plus"
            class="mr10"
            v-if=" isedit"
            size="mini"
            type="warning"
            @click="newdicitem"
          >新增字典项</el-button>
          <el-button
            icon="el-icon-sort"
            class="mr10"
            v-if="!isedit && !sortable"
            size="mini"
            type="primary"
            @click="alertSort"
          >前往排序</el-button>
        </div>
      </div>
      <vxe-table
        :data="settingsdic.data"
        size="mini"
        highlight-current-row
        show-overflow
        show-header-overflow
        :height="height"
        :scroll-y="settingsScorllY"
        :keep-source="true"
        style="width: 100%"
        ref="dragTable"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
        :edit-rules="rules"
        @edit-closed="editClosedEvent"
      >
        <vxe-table-column align="center" title="" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="undefined === scope.row.delFlag"
              @click="deleteNewDic(scope.row)"
            >删除</el-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="itemValue" align="left"   title="字典Key(唯一)" min-width="90"></vxe-table-column>
        <vxe-table-column field="itemName" :visible="isedit" align="left"  title="字典中文值" min-width="240px">
          <template slot-scope="scope">
            <el-input  size="mini" :style="{width:'300px'}" v-model="scope.row.itemName" maxlength="99"></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="itemName" :visible="!isedit" align="left"  title="字典中文值" min-width="240px" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="itemNameEng" :visible="isedit" align="left"  title="字典英文值" min-width="240">
          <template slot-scope="scope" >
            <el-input size="mini" :style="{width:'300px'}" v-model="scope.row.itemNameEng" maxlength="99"></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="itemNameEng" :visible="!isedit" align="left"  title="字典英文值" min-width="240" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="dicStatus" :visible="isedit" align="left" title="状态" width="100">
          <template slot-scope="scope">
            <el-select
              size="mini"
              v-model="scope.row.dicStatus"
            >
              <el-option
                v-for="item in dicStatusList "
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="dicStatus" :visible="!isedit" align="left" title="状态" width="100" :edit-render="{name: '$select', options: dicStatusList}"></vxe-table-column>
        <vxe-table-column field="parentItemName" :visible="isedit" align="left" title="父字典" min-width="80">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.parentItem" filterable clearable>
              <el-option
                v-for="item in parentDicItemList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="parentItemName" :visible="!isedit" align="left" title="父字典" min-width="80" :edit-render="{name: '$select', options: parentDicItemList}"></vxe-table-column>
      </vxe-table>
      <sortAlert :sortVisible="sortVisible" :tableData="tableData" @close="sortClose" @submit="sortSubmit" />
    </div>
  </d2-container>
</template>

<script>
import axios from '@/api/dictionary'
import mixins from '@/plugin/mixins'
import sortAlert from './components/sort_dictionary.vue'

export default {
  mixins: [mixins],
  components: {
    sortAlert
  },
  props: {
    dicProject: {
      type: String
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visibleAdd: false,
      height: this.canEdit ? document.documentElement.clientHeight - 350 : document.documentElement.clientHeight - 450,
      visible: true,
      isedit: false,
      ruleForm: {
        dicName: '',
        dicLabel: '',
        remark: '',
        parentDicLabel: ''
      },
      loading: false,
      sortable: null,
      settings: [],
      settingsdic: { data: [] },
      settingsScorllY: { enabled: false },
      parentDic: null,
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
      newdicItemValue: '',
      parentDicItemList: [],
      sortVisible: false,
      tableData: [],
      dicStatusList: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ]
    }
  },
  watch: {
    parentDic: function (val) {
      console.log('parentDic', val)
      if (val) {
        axios.dicitem(val).then(({ data }) => {
          console.log(data)
          data.forEach(v => {
            const u = { label: v.itemName, value: v.itemValue }
            this.parentDicItemList.push(u)
          })
        })
      }
    },
    dicProject: function (val) {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getdicitem(this.dicProject)
      const Data = {
        search: '',
        pageNum: 1,
        pageSize: 9999
      }
      axios.diclist(Data).then(({ data }) => {
        console.log(data)
        this.settings = data.rows
      })
    },
    // 重载vxe-table组件
    reloadVxeTable () {
      this.$refs.dragTable.reloadData(this.settingsdic.data)
    },
    refreshVxeTable () {
      this.$refs.dragTable.refreshColumn()
    },
    async cancelNewdic () {
      this.settingsScorllY = { enabled: false }
      await this.reloadVxeTable()
      this.isedit = false
      this.$nextTick(() => {
        this.refreshVxeTable()
      })
      this.getdicitem(this.dicProject)
    },
    async newdic () {
      this.settingsScorllY = { gt: 40 }
      await this.reloadVxeTable()
      this.loading = true
      this.isedit = true
      this.$nextTick(() => {
        this.refreshVxeTable()
        this.loading = false
      })
    },
    alertSort () {
      this.tableData = this.settingsdic.data
      this.sortVisible = true
    },
    sortClose () {
      this.sortVisible = false
    },
    sortSubmit (data) {
      this.sortVisible = false
      this.settingsdic.data = JSON.parse(JSON.stringify(data))
      console.log(this.settingsdic.data)
      this.submit()
    },
    AddNewdic () {
      this.visibleAdd = true
    },
    moveSort () {
      this.setSort()
    },
    cancelSort () {
      if (this.sortable) {
        this.sortable.destroy()
        this.sortable = null
      }
      this.getdicitem(this.dicProject)
      this.$refs.dragTable.clearSort()
    },
    newdicitem () {
      this.$prompt('请输入新的Key(唯一)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const reg = /^\w+$/
        console.log(value)
        if (!value) {
          this.$message({
            message: '字典key不可为空',
            type: 'error'
          })
          return
        } else if (!reg.test(value)) {
          this.$message({
            message: '字典key只支持字母数字下划线',
            type: 'error'
          })
          return
        }
        const len = this.settingsdic.data.length
        const list = []
        for (let i = 0; i < len; i++) {
          list.push(this.settingsdic.data[i].itemValue)
        }
        list.push(value)
        const set = new Set(list)
        if (len + 1 != set.size) {
          this.$message({
            message: '字典key不可重复',
            type: 'error'
          })
          value = ''
          return
        }
        this.settingsdic.data.unshift({
          itemName: '',
          itemNameEng: '',
          itemValue: value,
          sortNo: null,
          dicStatus: '0'
        })
        this.$message.success('新增字典项成功，请补充输入！！')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消新增'
        })
      })
    },
    getdicitem (dicLabel) {
      this.loading = true
      axios.getDicListDetailByDicId(dicLabel).then(res => {
        console.log(res.data, 45456456456)
        this.$nextTick(() => {
          this.settingsdic.data = JSON.parse(JSON.stringify(res.data.itemArr))
          this.ruleForm = JSON.parse(JSON.stringify(res.data.dicInfo))
          this.parentDic = JSON.parse(JSON.stringify(res.data.dicInfo)).parentDicLabel
          this.loading = false
        })
      })
    },

    async clone () {
      this.$refs.dragTable.clearSort()
      this.settingsScorllY = { enabled: false }
      await this.reloadVxeTable()
      this.isedit = false
      this.$nextTick(() => {
        this.refreshVxeTable()
      })
      if (this.sortable) {
        this.sortable.destroy()
        this.sortable = null
      }
    },
    async editClosedEvent ({ row, column }) {
      const $table = this.$refs.dragTable
      const field = column.property
      const cellValue = row[field]
      // 判断单元格值是否被修改
      if ($table.isUpdateByRow(row, field)) {
        axios.refreshDicItem(row).then(({ data }) => {
          this.$message({ type: 'success', message: '更新成功！' })
        })
      }
    },
    submit () {
      const len = this.settingsdic.data.length
      for (let i = 0; i < len; i++) {
        this.settingsdic.data[i].sortNo = i + 1
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
        if (this.parentDic) {
          this.settingsdic.data[i].parentDic = this.parentDic
        } else {
          this.settingsdic.data[i].parentDic = ''
          this.settingsdic.data[i].parentItem = ''
        }
      }
      this.loading = true
      const submitData = JSON.parse(JSON.stringify(this.ruleForm))

      submitData.itemList = this.settingsdic.data
      if (this.parentDic) {
        submitData.parentDic = this.parentDic
        // submitData.itemList.forEach(v => {
        //   v.parentDic = this.parentDic;
        // });
      } else {
        submitData.parentDic = ''
        // submitData.itemList.forEach(v => {
        //   v.parentDic = "";
        //   v.parentItem = "";
        // });
      }
      const data = {
        dicName: submitData.dicName,
        dicLabel: submitData.dicLabel,
        remark: submitData.remark,
        parentDic: submitData.parentDic,
        itemList: submitData.itemList
      }
      console.log(submitData, data, 'yx12732891739182')
      axios
        .setDicList(data)
        .then(res => {
          this.loading = false
          console.log(res)
          this.$refs.ruleForm.validate(valid => {
            if (!valid) return
            this.clone()
          })
          this.getdicitem(this.dicProject)
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    deleteNewDic (row) {
      console.log(row)
      // this.settingsdic.data.splice(row, 1);
      this.settingsdic.data = this.settingsdic.data.filter(
        v => v.itemValue !== row.itemValue
      )
    }
  }
}
</script>

<style lang='scss'>
.dictionary {
}
</style>
