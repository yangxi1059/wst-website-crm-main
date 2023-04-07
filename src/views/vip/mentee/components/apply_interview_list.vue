<!--
 * @Author: kaan
 * @Date: 2021-11-25 15:07:10
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-12-05 09:35:16
 * @Version:
 * @Description:
-->
<template>
  <div>
    <el-dialog
      :visible.sync="interviewListVisble"
      direction="rtl"
      :before-close="handleClose"
      size="400px">
      <div v-loading="loading" class="yx_descriptions recommand-conatainer">
          <ul class="job-list">
            <li class="list-item"  v-for="(item, index) in applyInternalList" :key="index" >
                <el-image class="image-box" fit="contain" :src="item.logo"></el-image>
                <div class="list-content">
                <div class="list-item-line " >
                    <span class="fl list-item1">{{item.companyName || '-'}}</span>
                    <!-- <el-tag class="fr" size="medium"  >{{ item.recordStatusName }}</el-tag> -->
                    <el-tag class="fr mr10" size="medium"  >{{ item.menteeApplyStatusName }}</el-tag>
                </div>
                <div class="block_list">
                  <div class="list-item-line">
                      <span class="fl list-item3">岗位:{{item.jobName || '-'}}</span>
                  </div>
                  <div class="list-item-line">
                    <span span class="fl list-item3">申请季:{{item.applySeason}} </span>
                  </div>
                </div>
                <div class="block_list">
                  <div class="list-item-line">
                  <span class="fl list-item3">岗位类型:{{item.jobTypeName}} </span>
                  </div>
                  <div class="list-item-line">
                  <span class="fl list-item3">远程/实地:{{item.locationTypeName}} </span>
                  </div>
                </div>
                <div class="block_list">
                  <div class="list-item-line">
                    <span class="fl list-item3">内推人:{{item.providerName}} </span>
                  </div>
                  <div class="list-item-line">
                    <span class="fl list-item3">投递时间:{{item.createTime}} </span>
                  </div>
                </div>
                <div class="list-item-line">
                <span class="fl list-item3">操作:<el-button type="success" class="ml10" size="mini" @click="submitNew(item)">快速新增</el-button></span>
                </div>
                </div>
            </li>
            </ul>
        <!-- <el-descriptions v-for="(item,i) in applyInternalList" :key="i" class="mb10"  size="mini" direction="vertical" :column="2" border>
            <el-descriptions-item label="公司logo">
                <el-image style="height: 100px" fit="contain" :src="item.logo">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
            </el-descriptions-item>
            <el-descriptions-item label="公司名">{{item.companyName}}</el-descriptions-item>
            <el-descriptions-item label="岗位">{{item.jobName}}</el-descriptions-item>
            <el-descriptions-item label="申请季">{{item.applySeason}}</el-descriptions-item>
            <el-descriptions-item label="岗位类型">{{item.jobTypeName}}</el-descriptions-item>
            <el-descriptions-item label="远程/实地">{{item.locationTypeName}}</el-descriptions-item>
            <el-descriptions-item label="状态">{{item.recordStatusName}}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{item.createTime}}</el-descriptions-item>
            <el-descriptions-item label="操作">
                <el-button type="success" size="mini" @click="submitNew(item)">快速新增</el-button>
            </el-descriptions-item>
        </el-descriptions> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">无关联内推，新建</el-button>
      </span>
    </el-dialog>
    <applyInterview :publicStatus="publicStatus" :applyInterviewVisible="applyInterviewVisible" :applyStatus="applyStatus" :applyInternalData="applyInternalData" :signId="signId" :menteeId="menteeId" :menteeName="menteeName" @close="closeApply"  @submit="submitApply"  />
  </div>
</template>

<script>
import api from '@/api/vip.js'
import applyInterview from './apply_interview.vue'
import mixins from '@/plugin/mixins'

export default {
  name: 'offer',
  components: { applyInterview },
  mixins: [mixins],
  data: () => {
    return {
      applyStatus: false,
      applyInternalData: {},
      applyInterviewVisible: false,
      applyInternalList: [],
      loading: false
    }
  },
  props: {
    publicStatus: {},
    interviewListVisble: {},
    signId: {},
    menteeId: {},
    menteeName: {}
  },
  watch: {
    interviewListVisble: function (val, old) {
      if (val) {
        this.init()
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.loading = true
      api.getDeliverInternalJob(this.menteeId).then(res => {
        this.loading = false
        if (res.data && res.data.length > 0) {
          console.log(res.data)
          this.applyInternalList = res.data
        } else {
          this.submit()
        }
      })
    },
    handleClose () {
      this.applyInternalList = []
      this.$emit('close')
    },
    submit () {
      this.applyStatus = false
      this.applyInternalData = {}
      this.applyInterviewVisible = true
    },
    submitNew (data) {
      console.log(data)
      this.applyInternalData = JSON.parse(JSON.stringify(data))
      this.applyStatus = true
      this.applyInterviewVisible = true
    },
    closeApply () {
      this.applyInterviewVisible = false
    },
    submitApply () {
      this.applyInternalList = []
      this.applyInterviewVisible = false
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing:border-box;
}
.recommand-conatainer{
  width:100%;
  .job-list{
    width:100%;
    height:calc(70vh - 54px);
    overflow: auto;
    padding:10px 10px 0 10px;
    display: inline-block;
  }
  .list-item{
    padding:20px 10px;
    border-bottom:1px solid #ededed;
    border-radius: 10px;
    display:flex;
    align-items: top;
  }
  .image-box{
    width:75px;
    height:75px;
    margin-right:20px;
    border-radius: 50%;
    box-shadow: 5px 5px 10px #888;
  }
  .list-content{
    flex:1;
    display:inline-block;
  }
  .list-item-line{
    width:50%;
    clear: both;
    .list-item1{
      font-weight:700;
      font-size:18px;
    }
    .list-item2{
      margin-bottom:10px;
      font-size:16px;
      color:#000;
    }
    .list-item3{
      font-size:14px;
      line-height: 42px;
    }
  }
}
.fl{
  float:left;
}
.fr{
  float:right;
}
.active.info, .info:hover{
  background-color:#e9e9eb;
  border-bottom:1px solid #e9e9eb;
  box-shadow: 0px 0px 10px #e9e9eb;
}
.active.warning, .warning:hover{
  background-color:#faecd8;
  border-bottom:1px solid #faecd8;
  box-shadow: 0px 0px 10px #faecd8;
}
.active.primary, .primary:hover{
  background-color:#d9ecff;
  border-bottom:1px solid #d9ecff;
  box-shadow: 0px 0px 10px #d9ecff;
}
.active.danger, .danger:hover{
  background-color:#fde2e2;
  border-bottom:1px solid #fde2e2;
  box-shadow: 0px 0px 10px #fde2e2;
}
.active.success, .success:hover{
  background-color:#e1f3d8;
  border-bottom:1px solid #e1f3d8;
  box-shadow: 0px 0px 10px #e1f3d8;
}

.job-content{
  width:50%;
  height:calc(70vh - 54px);
  overflow: auto;
  padding:10px 20px 0 20px;
  display: inline-block;
  .detail-image-box{
    float:left;
    width:60px;
    height:60px;
    margin-right:10px;
    border-radius: 50%;
    box-shadow: 5px 5px 10px #888;
  }
  .detail-text1{
    font-size:20px;
    font-weight:700;
    line-height:40px;
    color:#000;
  }
  .detail-text2{
    font-size:20px;
    font-weight:700;
    line-height:40px;
  }
  .form-item-width{
    float:left;
    width:50%;
  }
  .el-form-item{
    margin-bottom:0px;
  }
  .detail-order-text{
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(59,59,59,0.96);
    white-space: pre-line;
    word-wrap: break-word;
    opacity: 1;
  }
}
.block_list{
  display: flex;
  width: 100%;
}
.clear{
  clear:both;
}
.yx_descriptions .el-descriptions--mini.is-bordered .el-descriptions-item__cell{
    width: 50% !important;
  }
  .yx_3 .is-bordered .el-descriptions-item__cell{
    background: rgba(253, 226, 226,1) !important;
  }
  .yx_4 .is-bordered .el-descriptions-item__cell{
    background: rgba(179, 216, 225,0.5) !important;
  }
</style>
