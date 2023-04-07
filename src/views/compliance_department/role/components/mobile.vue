<!--
 * @Author: 库建华
 * @Date: 2019-04-17 13:46:17
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-20 10:39:39
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <roleDetail :visibleRole="visibleRole" :roleData="roleData" @close="roleClose" @submit="roleSubmit"/>
    <el-dialog :close-on-click-modal="false" title="酒屋小程序权限设置" :visible.sync="visible" width="800px"  @close="close">
      <div class="purviewtree">
        <el-tabs v-model="activeName" type="card" >
          <el-tab-pane label="首页" name="first">
            <div  v-for="(item,i) in privilege" :key="i">
              <el-card class="box-card" v-if="item.code != 'personal_center' && item.code != 'setting_system'">
                  <div slot="header" class="clearfix" >
                    <span>{{item.name}}模块</span>
                  </div>
                  <div  class="text" >
                    <el-checkbox :indeterminate="item.isIndeterminate" v-if="item.code != 'apply'" v-model="item.checkAll" @change="handleCheckAllChange(item.checkAll,i)">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <div style="display:flex">
                      <el-checkbox-group v-model="item.list" @change="handleCheckedCitiesChange(item.list,i)">
                        <el-checkbox v-for="(item2,j) in item.children" :label="item2.code" :disabled="item2.disabled" :key="j">{{item2.name}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="个人中心" name="second">
            <div  v-for="(item,i) in privilege" :key="i">
              <el-card class="box-card" v-if="item.code == 'personal_center' || item.code == 'setting_system'">
                  <div slot="header" class="clearfix" >
                    <span>{{item.name}}模块</span>
                  </div>
                  <div  class="text" >
                    <el-checkbox :indeterminate="item.isIndeterminate" v-if="item.code != 'apply'" v-model="item.checkAll" @change="handleCheckAllChange(item.checkAll,i)">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <div style="display:flex">
                      <el-checkbox-group v-model="item.list" @change="handleCheckedCitiesChange(item.list,i)">
                        <el-checkbox v-for="(item2,j) in item.children" :label="item2.code" :disabled="item2.disabled" :key="j">{{item2.name}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/role'
import roleDetail from './roleDetail.vue'
var aTeBie = [
  {
    name: '申请/审核',
    code: 'apply',
    isIndeterminate: false,
    checkAll: false,
    check: false,
    list: ['my_apply', 'check'],
    children: [
      {
        name: '我的申请',
        code: 'my_apply',
        select: true,
        disabled: true
      },
      {
        name: '我的审核',
        code: 'check',
        disabled: true,
        select: true
      },
      {
        name: '入账审核',
        code: 'entry_audit',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: 'Sales',
    code: 'sales',
    check: false,
    isIndeterminate: false,
    checkAll: false,
    list: [],
    children: [
      {
        name: '销售情况',
        code: 'sales_status',
        disabled: false,
        select: false
      },
      {
        name: '销售follow',
        code: 'sales_follow',
        disabled: false,
        select: false
      },
      {
        name: '订单管理',
        code: 'sales_order',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: '销售助理',
    code: 'sales_assistant',
    isIndeterminate: false,
    checkAll: false,
    list: [],
    check: false,
    children: [
      {
        name: '销售助理follow',
        code: 'sales_assistant_follow',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: 'VIP',
    check: false,
    code: 'vip_assistant',
    isIndeterminate: false,
    checkAll: false,
    list: [],
    children: [
      {
        name: 'VIP follow',
        code: 'vip_follow',
        disabled: false,
        select: false
      },
      {
        name: 'VIP 年度KPI查询',
        code: 'vip_yearKpi_check',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: 'MKT',
    isIndeterminate: false,
    checkAll: false,
    list: [],
    code: 'mkt',
    check: false,
    children: [
      {
        name: 'MKT follow',
        code: 'mkt_follow',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: '综合管理',
    isIndeterminate: false,
    checkAll: false,
    list: [],
    check: false,
    code: 'integrated_management',
    children: [
      {
        name: '我的学员(无合同权限)',
        code: 'my_mentee',
        disabled: false,
        select: false
      },
      {
        name: '我的学员(有Salse合同权限)',
        code: 'my_mentee contract_sales',
        disabled: false,
        select: false
      },
      {
        name: '我的学员(有Vip合同权限)',
        code: 'my_mentee contract_vip',
        disabled: false,
        select: false
      },
      {
        name: '导师管理',
        code: 'mentor',
        disabled: false,
        select: false
      },
      {
        name: '文件管理',
        code: 'file_management',
        disabled: false,
        select: false
      },
      {
        name: '日程表',
        code: 'calender_list',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: '个人中心',
    list: [],
    isIndeterminate: false,
    checkAll: false,
    check: false,
    code: 'personal_center',
    children: [
      {
        name: '面试训练营',
        code: 'hasSeminarsFlag',
        disabled: false,
        select: false
      },
      {
        name: '网申提醒',
        code: 'netApplicationCenterFlag',
        disabled: false,
        select: false
      },
      {
        name: '内推申请',
        code: 'internalPushCenterFlag',
        disabled: false,
        select: false
      },
      {
        name: '面试题库',
        code: 'hasInterviewFlag',
        disabled: false,
        select: false
      },
      {
        name: '电子书架',
        code: 'bookShelfFlag',
        disabled: false,
        select: false
      },
      {
        name: 'Newsletter',
        code: 'newsletterFlag',
        disabled: false,
        select: false
      }
    ]
  },
  {
    name: '系统设置',
    list: [],
    isIndeterminate: false,
    checkAll: false,
    check: false,
    code: 'setting_system',
    children: [
      {
        name: '版本管理',
        code: 'setting_Version',
        disabled: false,
        select: false
      }
    ]
  }
]
export default {
  props: {
    displayMobile: {
      type: Boolean
    },
    roleId: {
      type: String
    },
    roleInfoData: {}
  },
  components: { roleDetail },
  watch: {
    displayMobile: function (val) {
      if (this.roleInfoData) {
        const arr = JSON.parse(JSON.stringify(this.roleInfoData))
        const arr2 = JSON.parse(JSON.stringify(aTeBie))
        let arrstart = []
        // this.privilege = JSON.parse(JSON.stringify(this.roleInfoData))
        arr.forEach(item => {
          arrstart.push(item.list)
          arr2.forEach(item2 => {
            if (item2.code == item.code) {
              item2.list = item.list
            }
          })
        })
        arrstart = arrstart.flat()
        arrstart = arrstart.join(',')
        arr2.forEach(item => {
          if (item.list.length == item.children.length) {
            item.checkAll = true
            item.isIndeterminate = item.list.length > 0 && item.list.length < item.children.length
          } else {
            if (item.list.length == 0) {
              item.checkAll = false
              item.isIndeterminate = false
            } else {
              item.checkAll = false
              item.isIndeterminate = true
            }
          }
          item.children.forEach(item2 => {
            if (arrstart.indexOf(item2.code) != '-1') {
              item2.select = true
            }
          })
        })
        this.privilege = JSON.parse(JSON.stringify(arr2))
      } else {
        this.privilege = JSON.parse(JSON.stringify(aTeBie))
      }
      return (this.visible = val)
    }
  },
  data () {
    return {
      activeName: 'first',
      visible: false,
      visibleRole: false,
      resource: [],
      Index: 0,
      roleData: {},
      privilege: [
        {
          name: '申请/审核',
          code: 'apply',
          list: ['my_apply', 'check'],
          children: [
            {
              name: '我的申请',
              code: 'my_apply',
              select: true,
              disabled: true
            },
            {
              name: '我的审核',
              code: 'check',
              disabled: true,
              select: true
            }
          ]
        },
        {
          name: 'Sales',
          code: 'sales',
          list: [],
          children: [
            {
              name: '销售情况',
              code: 'sales_status',
              disabled: false,
              select: false
            },
            {
              name: '销售follow',
              code: 'sales_follow',
              disabled: false,
              select: false
            },
            {
              name: '订单管理',
              code: 'sales_order',
              disabled: false,
              select: false
            }
          ]
        },
        {
          name: '销售助理',
          code: 'sales_assistant',
          list: [],
          children: [
            {
              name: '销售助理follow',
              code: 'sales_assistant_follow',
              disabled: false,
              select: false
            }
          ]
        },
        {
          name: 'VIP',
          code: 'vip_assistant',
          list: [],
          children: [
            {
              name: 'VIP follow',
              code: 'vip_follow',
              disabled: false,
              select: false
            }
          ]
        },
        {
          name: 'MKT',
          list: [],
          code: 'mkt',
          children: [
            {
              name: 'MKT follow',
              code: 'mkt_follow',
              disabled: false,
              select: false
            }
          ]
        },
        {
          name: '综合管理',
          list: [],
          code: 'integrated_management',
          children: [
            {
              name: '文件管理',
              code: 'file_management',
              disabled: false,
              select: false
            }
          ]
        }
      ]
    }
  },
  methods: {
    submit () {
      console.log(this.privilege, 11111111111111)
      const data = {
        roleId: this.roleId,
        mpRoleInfo: JSON.stringify(this.privilege)
      }
      this.$loading()
      api
        .saveRoler(data)
        .then(({ data }) => {
          this.$message({
            type: 'success',
            message: '授权成功'
          })
          this.$loading().close()
          this.activeName = 'first'
          this.$emit('callbackFun', true)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '授权失败'
          })
          this.$loading().close()
        })
    },
    close () {
      this.activeName = 'first'
      this.$emit('callbackFun', false)
    },
    addRole (data, i) {
      this.Index = i
      this.visibleRole = true
      this.roleData = data
    },
    roleClose () {
      this.visibleRole = false
    },
    roleSubmit (data) {
      this.visibleRole = false
      this.privilege[this.Index] = data
      console.log(this.privilege[this.Index])
    },
    handleCheckedCitiesChange (value, index) {
      const checkedCount = value.length
      this.$nextTick(() => {
        this.privilege[index].isIndeterminate = checkedCount > 0 && checkedCount < this.privilege[index].children.length
        this.privilege[index].checkAll = checkedCount === this.privilege[index].children.length
      })
      console.log(this.privilege)
    },
    handleCheckAllChange (val, index) {
      console.log(val, index)
      if (val) {
        this.privilege[index].list = []
        this.privilege[index].children.forEach(item => {
          this.privilege[index].list.push(item.code)
        })
      } else {
        this.privilege[index].list = []
      }
      this.privilege[index].isIndeterminate = false
    }
  }
}
</script>

<style lang='scss'>
.purviewtree {
  display: block;
  background: #fff;
  .box-card{
    margin-top: 20px;
  }
  .modules {
    min-width: 150px;
    height: 500px;
    overflow-y: auto;
    color: #606266;
    margin-right: 10px;
    box-shadow: 0px 0px 4px 0px #d8dce6;
    border-radius: 2px;
    .module_title {
      font-size: 14px;
      text-align: center;
      padding: 15px 0 20px;
      font-weight: 600;
    }
    .module_li {
      line-height: 24px;
      padding-left: 22px;
      margin: 16px 0;
      font-size: 14px;
      position: relative;
      .el-checkbox {
        margin-right: 0;
      }
      &.active {
        color: #409eff;
      }
      &.active::before {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        height: 24px;
        width: 4px;
        background: #409eff;
      }
      .text {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  .menus {
    flex: 1;
    height: 500px;
    overflow-y: auto;
    .menus_title {
      font-size: 14px;
      color: #606266;
      text-align: center;
      padding: 15px 0 20px;
      font-weight: 600;
    }
    .menus_li {
      font-size: 14px;
      color: #606266;
      background: #fafbfc;
      padding-left: 10px;
      line-height: 44px;
      margin-bottom: 10px;
      .resources_li {
        float: left;
        margin-right: 24px;
      }
    }
  }
}
</style>
