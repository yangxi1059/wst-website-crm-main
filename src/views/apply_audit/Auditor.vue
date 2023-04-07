<template>
  <d2-container>
    <div class="auditor">
      <el-table :data="tableDate" size="mini" highlight-current-row style="width: 100%">
        <el-table-column prop="itemName" align="center" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" size="mini">设置审核人</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="itemName" align="center" label="类型名" min-width="100"></el-table-column>
        <el-table-column prop="itemValue" align="center" label="类型ID" min-width="100"></el-table-column>
        <el-table-column prop="dicStatus" align="center" label="状态" min-width="100">
          <template slot-scope="scope">
            <span :class="MyClass[scope.row.dicStatus]">{{dicStatus[scope.row.dicStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortNo" align="center" label="排序" min-width="100"></el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" title="设置审核人" :visible.sync="auditorVisible" width="1100px" :before-close="close">
        {{applyTypeName}}
        <el-button @click="addAuditor">添加审核人</el-button>
        <el-button @click="save">保存</el-button>
        <el-card v-for="(item,index) in listDate" :key="index" class="mt20">
          审核人称谓：
          <el-input
            :style="{width:'160px'}"
            v-model="item.confirmCol"
            size="mini"
            placeholder="如：第一审核人，财务审核人..."
            class="mr20"
          ></el-input>
          <span title="以数值大小排序第一第二审核人，可为负">排序：</span>
          <el-input-number
            size="mini"
            :controls="false"
            v-model="item.sort"
            class="mr20"
            :style="{width:'60px'}"
          ></el-input-number>
          <el-select size="mini"  v-model="item.addAuditor" filterable>
            <el-option
              v-for="item in user"
              :key="item.id"
              :disabled="item.disable"
              :value="item.id + '&&' + item.name"
              :label="item.name"
            ></el-option>
          </el-select>
          <el-button size="mini"  @click="addAuditorToList(item)" class="mr20">添加备选人</el-button>
          <!-- <el-select size="mini" multiple v-model="item.addAuditorGroup" filterable>
            <el-option
              v-for="item in user"
              :key="item.id"
              :disabled="item.disable"
              :value="item.id + '&&' + item.name"
              :label="item.name"
            ></el-option>
          </el-select>
          -->
          <el-button size="mini"  @click="addAuditorGroupToList(item)" class="mr20">添加备选组</el-button>
          <i class="el-icon-delete " @click="deleteAuditorBox(index)" title="删除"></i>
          <div class="list-box mt20">
            <div v-for="(auditorItem,index) in item.confirmorArr" :key="index" class="">
              <div class="auditor-list" v-if="auditorItem.confirmMode == 'user'">
                <p class="auditor-item">姓名：{{auditorItem.confirmorName}}</p>
                <p>
                  <span title="以数值大小排序审核候选人，可为负">排序：</span>
                  <el-input-number :controls="false" v-model="auditorItem.sort"></el-input-number>
                </p>
                <p>
                  <el-checkbox v-model="auditorItem.isDefult" true-label='1' false-label='0'>默认选中</el-checkbox>
                  <i class="el-icon-delete ml20" title="删除" @click="deleteAuditor(item.confirmorArr,index)"></i>
                </p>
              </div>
              <div v-else class="auditor-list4">
                <div class="auditor-list2" >
                  <p class="auditor-item">分组：
                    <el-select size="mini"  v-model="auditorItem.addAuditor" filterable>
                      <el-option
                        v-for="item in user"
                        :key="item.id"
                        :disabled="item.disable"
                        :value="item.id + '&&' + item.name"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                    <el-button size="mini"  @click="addAuditorToList2(item,auditorItem)" class="">添加备选人</el-button>
                  </p>
                  <p>
                    <span title="以数值大小排序审核候选人，可为负">排序：</span>
                    <el-input-number :controls="false" v-model="auditorItem.sort"></el-input-number>
                  </p>
                  <p>
                    <el-checkbox v-model="auditorItem.isDefult" true-label='1' false-label='0'>默认选中</el-checkbox>
                    <i class="el-icon-delete ml20" title="删除" @click="deleteAuditor(item.confirmorArr,index)"></i>
                  </p>
                </div>
                <div v-for="(confirmorNameGroupDetail,a) in auditorItem.userGroup" :key="a+'321'" class="auditor-list3">
                  <p>
                    <p class="p_te">组员名：{{confirmorNameGroupDetail.userName}}</p>
                    <i class="el-icon-delete detele_te" title="删除" @click="deleteAuditor2(item.confirmorArr[index],a)"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api/dictionary.js'
import apiU from '@/api/user'
import mixins from '@/plugin/mixins'

export default {
  name: 'auditor',
  mixins: [mixins],
  data () {
    return {
      tableDate: [],
      MyClass: ['colorG', 'colorR'],
      dicStatus: ['启用', '禁用'],
      auditorVisible: false,
      applyTypeName: '',
      applyType: '',
      user: [],
      listDate: [
        {
          confirmCol: '',
          addAuditor: '',
          addAuditorGroup: [],
          isDefult: '',
          sort: '',
          confirmorArr: [
            {
              confirmorName: '',
              confirmorId: '',
              isDefult: '',
              sort: ''
            }
          ]
        }
      ]
    }
  },
  mounted () {
    apiU.userList({
      pageNum: 1,
      pageSize: 9999,
      entryStatus: '1'
    })
      .then(({ data }) => {
        console.log(
          'userList...........................................',
          data
        )
        this.user = data.rows
      })
    this.Topage()
  },
  methods: {
    Topage () {
      api.dicitem('apply_type').then(res => {
        console.log(res)
        this.tableDate = res.data
      })
    },
    // 设置某类型审核人
    edit (item) {
      this.applyTypeName = item.itemName
      this.applyType = item.itemValue
      api.getAuditorListByApplyType(item.itemValue).then(res => {
        this.user.forEach(userItem => {
          userItem.disable = false
        })
        console.log(res)
        const data = res.data
        data.forEach((v, i) => {
          v.sort = i * 2
          v.confirmorArr &&
            v.confirmorArr.forEach((value, index) => {
              value.sort = index * 2
            })
        })
        this.listDate = data
        this.auditorVisible = true
      })
    },
    close () {
      this.auditorVisible = false
    },
    save () {
      console.log(this.listDate)
      const data = [...this.listDate]
      data.sort((a, b) => a.sort - b.sort)
      let cannot = false
      let cannot2 = true
      data.forEach(v => {
        if (!v.confirmCol) {
          cannot = true
        }
        console.log('this.listDate', v.confirmorArr)
        v.confirmorArr.sort((a, b) => a.sort - b.sort)
        console.log('this.listDate1', v)
      })
      this.listDate.forEach(item => {
        item.confirmorArr.forEach(item2 => {
          console.log(item2)
          if (!item2.confirmorId && item2.userGroup.length < 1) {
            this.$message.error('组别成员必填 ！！')
            cannot2 = false
          }
        })
      })
      console.log(cannot2)
      if (!cannot2) {
        this.$message({
          type: 'warning',
          message: '组别成员必填！！'
        })
        return
      }
      if (cannot) {
        this.$message({
          type: 'warning',
          message: '审核人称谓，必填'
        })
      }
      console.log(data)
      this.$loading()
      api.setAuditorListByApplyType(this.applyType, data).then(res => {
        console.log(res)
        this.close()
        this.$loading().close()
      })
    },
    // 添加审核人
    addAuditor () {
      this.listDate.unshift({
        confirmCol: '',
        addAuditor: '',
        addAuditorGroup: [],
        sort: this.listDate.length * 2,
        confirmorArr: [
        ]
      })
    },
    // 删除审核人
    deleteAuditorBox (index) {
      this.listDate.splice(index, 1)
    },
    // 添加备选人
    addAuditorToList (item) {
      if (!item.addAuditor) {
        return
      }
      // 判断重复添加
      let cannot = false
      item.confirmorArr.forEach(v => {
        if (v.confirmorId === item.addAuditor.split('&&')[0]) {
          this.$message({
            type: 'error',
            message: '不可重复添加同一备选人'
          })
          cannot = true
        }
      })
      if (cannot) {
        return
      }
      this.user.forEach(v => {
        if (v.id == item.addAuditor.split('&&')[0]) {
          v.disable = true
        }
      })

      item.confirmorArr.push({
        confirmMode: 'user',
        confirmorName: item.addAuditor.split('&&')[1],
        confirmorId: item.addAuditor.split('&&')[0],
        isDefult: '',
        sort: item.confirmorArr.length * 2
      })
    },
    addAuditorGroupToList (item) {
      item.confirmorArr.push({
        confirmorName: '',
        confirmorId: '',
        confirmMode: 'group',
        userGroup: [],
        isDefult: '',
        sort: item.confirmorArr.length * 2
      })
    },
    addAuditorToList2 (item, auditorItem) {
      if (!auditorItem.addAuditor) {
        return
      }
      let cannot = false
      item.confirmorArr.forEach(v => {
        if (v.confirmorId === auditorItem.addAuditor.split('&&')[0]) {
          this.$message({ type: 'error', message: '不可重复添加同一备选人' })
          cannot = true
        }
      })
      auditorItem.userGroup.forEach(item => {
        if (item.userId == auditorItem.addAuditor.split('&&')[0]) {
          this.$message({ type: 'error', message: '不可重复添加同一备选人' })
          cannot = true
        }
      })
      if (cannot) {
        return
      }
      this.user.forEach(v => {
        if (v.id == auditorItem.addAuditor.split('&&')[0]) {
          v.disable = true
        }
      })

      auditorItem.userGroup.push({ userId: auditorItem.addAuditor.split('&&')[0], userName: auditorItem.addAuditor.split('&&')[1] })
    },
    // 删除备选人
    deleteAuditor (list, index) {
      list.splice(index, 1)
    },
    deleteAuditor2 (data, index) {
      data.userGroup.splice(index, 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.auditor .auditor-item {
  width: 400px;
}
.auditor .auditor-list {
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px #eee solid;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}

.auditor .auditor-list2{
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}
.auditor  .auditor-list3{
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 0 20px 0 100px;
  height: 50px;
  line-height: 50px;
}
.auditor-list4{
  width: 100%;
  border-bottom: 1px #eee solid;
}
.detele_te{
  margin-top: 17px;
  margin-left: 20px;
}
.auditor .list-box {
  border-top: 1px #eee solid;
}
.mr20{
  margin-right: 20px;
}
.ml20{
  margin-left: 20px;
}
.mt20{
  margin-top: 20px;
}
</style>
