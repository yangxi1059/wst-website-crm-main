
<template>
  <d2-container v-loading="loading" >
    <div class="organization">
      <organizationtree
        :content="content"
        :checkOrg="checkOrg"
        :newSon="newSon"
        :editSon="editSon"
        :setmember="setmember"
        :delSon="delSon"
      />
      <el-dialog :close-on-click-modal="false"
        :title="'新增部门/小组'"
        :visible.sync="addVisible"
        width="450px"
        :before-close="closed"
      >
        <el-form size="medium" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item
            label="上级部门"
            prop="parentName"
          >{{ruleForm.parentName?ruleForm.parentName:'根部门'}}</el-form-item>
          <el-form-item :label="ruleForm.groupKind == 1 ?   '部门名称' : '小组名称'" prop="groupName">
            <el-input :style="{width:widths}" v-model="ruleForm.groupName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="groupType">
            <el-select :style="{width:widths}" v-model="ruleForm.groupType" placeholder="请选择">
              <el-option
                v-for="item in sys_user_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="团队类别" prop="groupKind">
            <el-select
              :style="{width:widths}"
              v-model="ruleForm.groupKind"
              placeholder="请选择"
            >
              <el-option
                v-for="item in [{itemName:'部门',itemValue:'1'},{itemName:'小组',itemValue:'2'}]"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closed">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑部门/小组 -->
      <el-dialog :close-on-click-modal="false"
        :title="ruleForm.groupKind=='2'?'编辑小组':'编辑部门'"
        :visible.sync="visible"
        width="450px"
        :before-close="closed"
      >
        <el-form size="medium" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item
            label="上级部门"
            prop="parentName"
          >{{ruleForm.parentName?ruleForm.parentName:'根部门'}}</el-form-item>
          <el-form-item :label="ruleForm.parentId == 1 ?   '部门名称' : '小组名称'" prop="groupName">
            <el-input :style="{width:widths}" v-model="ruleForm.groupName"></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="groupType">
            <el-select :style="{width:widths}" v-model="ruleForm.groupType" placeholder="请选择">
              <el-option
                v-for="item in sys_user_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closed">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="设置成员" :visible.sync="display" width="1200px" :before-close="dialogclosed">
        <el-form size="medium" :model="formRule" :rules="Rules" ref="formRule" label-width="100px">
          <el-form-item label="leader" prop="groupLeader">
            <el-select filterable multiple v-model="formRule.groupLeader" placeholder="请选择">
              <el-option
                v-for="item in member"
                :disabled="item.disabled"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成员" prop="userIds">
            <el-checkbox v-model="checked">ALL</el-checkbox>
            <el-checkbox-group v-model="formRule.userIds" class="member">
              <el-checkbox
                v-for="item in member"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
                :disabled="item.disabled"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogclosed">取 消</el-button>
          <el-button type="primary" @click="confirmOld">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看部门详情 -->
      <el-dialog :close-on-click-modal="false"
        :title="orgList.name+'详情'"
        :visible.sync="orgVisible"
        width="1000px"
        :before-close="checkClosed"
      >
        <el-card class="mb10">
          <el-row>
            <el-col :span="4" class="mentee-detail-name">上级部门</el-col>
            <el-col :span="4" class="mentee-detail-value">{{orgTeamData.parentName||'无'}}</el-col>
            <el-col :span="4" class="mentee-detail-name">部门名称</el-col>
            <el-col :span="4" class="mentee-detail-value">{{orgTeamData.groupName||'无'}}</el-col>
            <el-col :span="4" class="mentee-detail-name">部门类别</el-col>
            <el-col :span="4" class="mentee-detail-value">{{orgTeamData.groupKindName||'无'}}</el-col>
          </el-row>
        </el-card>
        <el-table
          title="成员信息"
          :data="orgTeamData.member"
        >
          <el-table-column align="center" min-width="120" prop="userName" label="成员名">
            <template slot-scope="scope">
              <span v-if="scope.row.isLeader==1">🚩</span><span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="120" prop="userPic" label="成员头像">
            <template slot-scope="scope">
              <el-avatar :size="50" :src="scope.row.userPic" @error="errorHandler">
                <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sex" label="性别"></el-table-column>
          <el-table-column align="center" prop="age" label="年龄"></el-table-column>
          <el-table-column align="center" prop="mainGroupName" label="主部门"></el-table-column>
          <el-table-column align="center" prop="deptLevel" label="部门级别"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="checkClosed">取 消</el-button>
          <el-button v-if="roleInfo.includes(`organization_new`) && (orgList.groupKind == '0' || orgList.groupKind == '1')" size="medium" type="primary" @click.stop="newSon(orgList)">添加部门/小组</el-button>
          <el-button v-if="roleInfo.includes(`organization_edit`)" size="medium" type="primary" @click.stop="editSon(orgList)">编辑</el-button>
          <el-button v-if="roleInfo.includes(`organization_member`)" size="medium" type="primary" @click.stop="setOrgMember(orgList)">设置成员</el-button>
          <el-button v-if="roleInfo.includes(`organization_del`)" size="medium" type="danger" @click.stop="delSon(orgList)">删除</el-button>
        </span>
      </el-dialog>
      <!-- 组员设置 -->
      <el-dialog :close-on-click-modal="false"
        :title="orgList.name+'组员设置'"
        :visible.sync="orgMemberVisible"
        width="1000px"
        top="8vh"
        :before-close="closed"
      >
        <el-steps :active="memberActive" finish-status="success" simple class="mb10" >
          <el-step title="步骤 1-设置成员" ></el-step>
          <el-step title="步骤 2-设置Leader" ></el-step>
        </el-steps>
        <!-- 步骤一 -->
        <el-transfer
          v-if = "memberActive == 0"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入组员"
          v-model="orgList.selectedMember"
          :data="orgMemberList"
          :titles="['待选人员', '已选组员']">
        </el-transfer>
        <!-- 步骤二 -->
        <div v-if = "memberActive == 1">
          <el-checkbox class="mb10" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" size="medium" border>全选</el-checkbox>
          <el-checkbox-group v-model="leaderArr" @change="handleCheckedLeadersChange">
            <el-checkbox  class="mb10" style="width:210px" v-for="u in orgList.memberArr" :label="u.key" :key="u.key" size="medium" border>{{u.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="closed">取消</el-button>
          <el-button v-if = "memberActive == 0" size="medium" @click="next">下一步</el-button>
          <el-button v-if = "memberActive == 1" size="medium" @click="last">上一步</el-button>
          <el-button v-if = "memberActive == 1" size="medium" @click="submitMember">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </d2-container>
</template>
<script>
import api from '@/api/organization'
import organizationtree from './components/organizationtree'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  computed: {
    ...mapState('role', ['roleInfo'])
  },
  components: { organizationtree },
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入部门名称'))
      } else {
        callback()
      }
    }
    return {
      sys_user_type: [],
      content: [],
      visible: false,
      widths: '240px',
      loading: false,
      ruleForm: {
        parentId: '',
        parentName: '',
        groupId: '',
        groupName: '',
        groupType: '',
        groupKind: '2'
      },
      rules: {
        groupName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ]
      },
      display: false,
      member: [],
      formRule: {
        groupId: '',
        groupLeader: [],
        userIds: []
      },
      Rules: {},
      checked: false,
      addVisible: false,

      orgList: {
        selectedMember: []
      },
      orgVisible: false,
      orgTeamData: {},

      orgMemberVisible: false,
      orgMemberList: [],

      memberActive: 0,
      checkAll: false,
      leaderArr: [],
      isIndeterminate: true
    }
  },
  watch: {
    checked: function (val) {
      if (val) {
        this.formRule.userIds = []
        this.member.forEach(v => {
          this.formRule.userIds.push(v.userName)
        })
      } else {
        this.formRule.userIds = []
      }
    }
  },
  created () {
    this.pageInit()
    this.getTree()
  },
  methods: {
    async pageInit () {
      this.sys_user_type = await this.getDictionary('sys_user_type')
    },
    getTree () {
      this.loading = true
      api.groupTree2().then(({ data }) => {
        const content = []
        this.convert(data, content)
        this.content = content
        this.loading = false
        console.log('groupTree2', data, content)
      })
    },
    convert (data, content) {
      data.forEach(e => {
        if (e.pId === '' || e.pId === undefined) {
          this.convertChild(data, e, e.id)
          content.push(e)
        }
      })
      return content
    },
    convertChild (arr, pitem, pId) {
      pitem.children = pitem.children ? pitem.children : []
      arr.forEach(item => {
        if (item.pId == pId) {
          this.convertChild(arr, item, item.id)
          pitem.children.push(item)
        }
      })
      return pitem.children
    },
    /**
     * @description: 查看部门详情(一级弹框)
     * @param {*} val 树对象
     * @return {*}
     */
    checkOrg (val) {
      this.orgList = Object.assign(this.orgList, val)
      // 获取该部门详情
      api.getGroupInfo(val.id).then(({ data }) => {
        console.log('获取该部门详情getGroupInfo:', data)
        this.orgTeamData = data
        this.orgVisible = true
      })
    },
    /**
     * @description: 查看部门详情关闭(一级弹框)
     * @param {*}
     * @return {*}
     */
    checkClosed () {
      this.orgVisible = false
    },

    /**
     * @description: 设置成员
     * @param {*} val
     * @return {*}
     */
    setOrgMember (val) {
      api.getTeamMember(val.id).then(({ data }) => {
        console.log(data)
        this.orgMemberList = []
        this.orgList.leaderArr = data.leaderArr
        data.inGroupMember.map((u) => {
          this.orgList.selectedMember.push(u.userId)
          this.orgMemberList.push({
            key: u.userId,
            label: `【${u.mainGroupName}】${u.userName}`,
            userName: u.userName,
            disaled: !!u.isMainGroup
          })
        })
        data.outGroupMember.map((u) => {
          this.orgMemberList.push({
            key: u.userId,
            label: `【${u.mainGroupName}】${u.userName}`,
            userName: u.userName,
            disaled: !!u.isMainGroup
          })
        })
        this.orgMemberVisible = true
      })
    },
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    handleCheckAllChange (val) {
      this.leaderArr = val ? this.orgList.selectedMember : []
      this.isIndeterminate = false
    },
    handleCheckedLeadersChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.orgList.memberArr.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.orgList.memberArr.length
    },

    /**
     * @description: 设置成员下一步
     * @param {*}
     * @return {*}
     */
    next () {
      this.memberActive = 1
      this.leaderArr = this.orgList.leaderArr
      this.orgList.memberArr = []
      this.orgMemberList.map((u) => {
        if (this.orgList.selectedMember.indexOf(u.key) > -1) {
          this.orgList.memberArr.push(u)
        }
      })
    },
    /**
     * @description: 设置成员上一步
     * @param {*}
     * @return {*}
     */
    last () {
      this.memberActive = 0
    },

    /**
     * @description: 设置组员提交
     * @param {*}
     * @return {*}
     */
    submitMember () {
      const member = []
      this.orgList.memberArr.forEach(e => {
        const isLeader = this.leaderArr.includes(e.key)
        // let isMember = this.formRule.userIds.includes(e.userName);
        member.push({
          isLeader: isLeader ? '1' : '0',
          isMember: '1',
          userName: e.userName,
          userId: e.key
        })
      })
      api.saveGroupMembers(this.orgList.id, member).then(({ data }) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.closed()
        this.checkClosed()
        this.getTree()
      })
    },

    /**
     * @description: 添加新部门/小组,只有公司or部门可以添加，小组为最小单位不可添加
     * @param {*} val
     * @return {*}
     */
    newSon (val) {
      console.log('选择添加的新部门/小组的父级部门对象:', val)
      this.ruleForm.parentId = val.id
      this.ruleForm.parentName = val.name
      this.ruleForm.groupKind = '1'
      this.addVisible = true
    },

    /**
     * @description: 编辑部门/小组
     * @param {*} val
     * @return {*}
     */
    editSon (val) {
      api.getGroupInfo(val.id).then(({ data }) => {
        console.log('编辑部门/小组:', data)
        this.ruleForm = {
          parentId: data.parentId === undefined ? '' : data.parentId,
          parentName: data.parentName === undefined ? '' : data.parentName,
          groupId: data.groupId === undefined ? '' : data.groupId,
          groupName: data.groupName === undefined ? '' : data.groupName,
          groupKind: data.groupKind === undefined ? '' : data.groupKind,
          groupType: data.groupType === undefined ? '' : data.groupType
        }
        this.visible = true
      })
    },

    /**
     * @description: 部门/小组详情操作弹框的关闭（2级弹框关闭）
     * @param {*}
     * @return {*}
     */
    closed () {
      if (this.addVisible) {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {
          parentId: '',
          parentName: '',
          groupKind: '',
          groupId: '',
          groupName: '',
          groupType: '',
          // 0:公司 1：部门 2：分组
          groupKind: '1'
        }
      }
      this.visible = false
      this.addVisible = false
      this.orgMemberList = []
      this.orgList.selectedMember = []
      this.memberActive = 0
      this.orgMemberVisible = false
    },

    /**
     * @description: 部门/小组 新增编辑提交
     * @param {*}
     * @return {*}
     */
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        const ruleForm = this.ruleForm
        // if (ruleForm.parentId != 1) {
        //   ruleForm.groupKind = "2";
        // } else {
        //   ruleForm.groupKind = "1";
        // }
        console.log(JSON.stringify(ruleForm))
        if (this.ruleForm.groupId === '') {
          api.savegroup(ruleForm).then(({ data }) => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.getTree()
            this.closed()
          })
        } else {
          api.savegroup(ruleForm).then(({ data }) => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.getTree()
            this.closed()
          })
        }
      })
    },
    // 设置成员弹框(旧)
    setmember (val) {
      console.log(val)
      if (val.groupKind == 2) {
        api.getGroupMember(val.id).then(({ data }) => {
          const member = data
          const groupLeader = []
          const userIds = []
          member.map((e, i, arr) => {
            if (e.isLeader === '1') {
              groupLeader.push(e.userId)
            }
            if (e.isMember === '1') {
              userIds.push(e.userName)
            }
            arr[i].userName = e.userName
            arr[i].disabled = false
          })
          this.member = member
          this.formRule = {
            groupId: val.id,
            groupLeader: groupLeader,
            userIds: userIds
          }
          this.display = true
        })
      } else if (val.groupKind == 1) {
        api.getAllGroupMember().then(({ data }) => {
          console.log('getAllGroupMember', data)
          const member = data
          const groupLeader = []
          const userIds = []
          member.map((e, i, arr) => {
            if (e.isLeader === '1' && e.groupId === val.id) {
              groupLeader.push(e.userId)
            }
            if (e.groupId === val.id) {
              userIds.push(e.userName + '(' + (e.groupName || '无部门') + ')')
            }
            arr[i].userName =
              e.userName + '(' + (e.groupName || '无部门') + ')'

            arr[i].disabled = true
            if (!e.groupId || e.groupId == val.id) {
              arr[i].disabled = false
            }
          })
          this.member = member
          this.formRule = {
            groupId: val.id,
            groupLeader: groupLeader,
            userIds: userIds
          }
          this.display = true
        })
      } else if (val.groupKind == 0) {
        api.getGroupMember(val.id).then(({ data }) => {
          const member = data
          const groupLeader = []
          const userIds = []
          member.map((e, i, arr) => {
            if (e.isLeader === '1') {
              groupLeader.push(e.userId)
            }
            if (e.isMember === '1') {
              userIds.push(e.userName)
            }
            arr[i].userName = e.userName
            arr[i].disabled = false
          })
          this.member = member
          this.formRule = {
            groupId: val.id,
            groupLeader: groupLeader,
            userIds: userIds
          }
          this.display = true
        })
      }
    },

    // 设置成员弹框关闭(旧)
    dialogclosed () {
      this.display = false
      this.checked = false
      setTimeout(() => {
        this.$refs.formRule.resetFields()
        this.formRule = {
          groupId: '',
          groupLeader: [],
          userIds: []
        }
      }, 200)
    },
    // 设置成员提交(旧)
    confirmOld () {
      this.$refs.formRule.validate(valid => {
        if (!valid) return
        const member = []
        this.member.forEach(e => {
          const isLeader = this.formRule.groupLeader.includes(e.userId)
          const isMember = this.formRule.userIds.includes(e.userName)
          if (isLeader || isMember) {
            member.push({
              isLeader: isLeader ? '1' : '0',
              isMember: isMember ? '1' : '0',
              userName: e.userName,
              userId: e.userId
            })
          }
        })
        api.saveGroupMembers(this.formRule.groupId, member).then(({ data }) => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.dialogclosed()
          this.getTree()
        })
      })
    },

    /**
     * @description: 删除团队/小组
     * @param {*} val
     * @return {*}
     */
    delSon (val) {
      this.$confirm(
        '此操作将永久删除该团队（包含下属团队）, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          console.log(val)
          const data = {
            groupId: val.id,
            delFlag: '1'
          }
          api.savegroup(data).then(res => {
            console.log(res)
            this.getTree()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    errorHandler () {
      return true
    }
  }
}
</script>
<style lang='scss' scoped>
.organization {
  .member {
    max-height: 400px;
    overflow-y: auto;
  }
}
::v-deep .el-transfer-panel__body{
  height: calc(75vh - 200px);
}
::v-deep.el-transfer-panel__list.is-filterable{
  height: calc(75vh - 250px);
}
::v-deep .el-transfer-panel{
  width: 430px !important;;
}
::v-deep .el-transfer-panel__item{
  min-width:80%;
}
::v-deep.el-checkbox.is-bordered+.el-checkbox.is-bordered{
  margin-left:0;
}
.el-checkbox-group ::v-deep.el-checkbox__label{
  width:170px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
