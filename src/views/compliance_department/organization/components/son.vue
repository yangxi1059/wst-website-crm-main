<template>
  <li class="organization_item" style="line-height:32px">
    <div class="organization_info">
      <div class="info_left" :style="{paddingLeft:`${20*count}px`}" @click.stop="toggle(model)">
        <div>
          <i
            v-if="isFolder"
            :class="open?'el-icon-caret-bottom':'el-icon-caret-right'"
          ></i>
          <i v-else class="el-icon-document"></i>
          <span class="organization_name">{{ model.name + '  ( ' + (groupKind[model.groupKind]) + ' ) ' + '  ( ' + (model.num || 0) + ' ) ' }}</span>
          <div >
            <span style="display:inline-block;margin-right:10px;line-height:24px;height:24px;font-size:12px" v-for="(item,i) in model.memberArr" :key="i">
              <span v-if="item.isLeader == 1" style="color:#c32e47">{{item.userName}}</span>
              <span v-else >{{item.userName}}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="info_right" style="height:32px">
        <el-button v-if="roleInfo.includes(`organization_new`) " type="text" @click.stop="checkOrg(model)">查看</el-button>
      </div>
    </div>
    <el-collapse-transition>
      <ul v-show="open" v-if="isFolder">
        <items
          v-for="(item, index) in model.children"
          :key="index"
          :count="count+1"
          :model="item"
          :checkOrg="checkOrg"
          :newSon="newSon"
          :editSon="editSon"
          :setmember="setmember"
          :delSon="delSon"
        />
      </ul>
    </el-collapse-transition>
  </li>
</template>

<script>
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: 'items',
  props: {
    count: {
      type: Number,
      default: 1
    },
    model: {
      type: Object
    },
    checkOrg: {
      type: Function
    },
    newSon: {
      type: Function
    },
    editSon: {
      type: Function
    },
    setmember: {
      type: Function
    },
    delSon: {
      type: Function
    }
  },
  data () {
    return {
      open: true,
      groupKind: ['公司', '部门', '小组'],
      memberArr: []
    }
  },
  mounted () {
    this.memberArr = this.model.memberArr
  },
  computed: {
    ...mapState('role', ['roleInfo']),
    isFolder () {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggle (v) {
      if (this.isFolder) {
        this.open = !this.open
        if (this.open) {
          this.initMemberList(v)
        }
      }
    },
    initMemberList (v) {
      console.log(v)
      this.memberArr = v.memberArr
    }
  }
}
</script>

<style lang='scss'>
.organization_item {
  .normal-list{
    margin-right:20px
  }
  .left-list{
    margin-left:40px
  }
  .organization_info {
    display: flex;
    // align-items: center;
    border-bottom: 1px solid #ebeef5;
    &:hover {
      background: #f5f7fa;
    }
    .info_left {
      flex: 1;
      color: #409eff;
    }
    .info_right {
      margin-right: 200px;
    }
  }
  .organization_name {
    font-size: 12px;
    color: #606266;
    margin-left: 12px;
  }
}
</style>
