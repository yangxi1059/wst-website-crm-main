<!--
 * @Author: 库建华
 * @Date: 2019-06-04 13:33:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-10 17:21:36
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="inputInformation">
    <el-dialog
      :close-on-click-modal="false"
      class="info"
      title="新增Promo"
      :visible.sync="addVisial"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="mentorData"
        :rules="rules"
        ref="mentorData"
        label-width="160px"
      >
        <el-form-item label="绑定用户" prop="userId">
          <el-cascader
            style="width:300px"
            :key="isResouceShow"
            :options="user"
            v-model="mentorData.userId"
            collapse-tags
            clearable
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select style="width:300px" v-model="mentorData.businessType" filterable placeholder="请选择" size="small">
            <el-option
              v-for="item in businessTypeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="programType">
          <el-select style="width:300px" @change="programTypeChange" v-model="mentorData.programType" filterable placeholder="请选择" size="small">
            <el-option
              v-for="item in programTypeList"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名" prop="keyId" v-if="mentorData.programType">
          <el-select style="width:300px" v-model="mentorData.keyId" filterable placeholder="请选择" size="small">
            <el-option
              v-for="item in programList"
              :key="item.programId"
              :label="item.programName + '--别名【' + (item.programAlias || '无') + '】'  + '【' + '￥' + item.priceCny + '】'"
              :value="item.programId">
            </el-option>
          </el-select>
        </el-form-item>
          <!-- <el-cascader
            style="width:300px"
            ref="sysCascader"
            :props="props"
            @change="handleChange($event)"
            clearable size="small">
          </el-cascader>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/promo.js'
import apiDic from '@/api/dictionary'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  components: { },
  name: 'mentorEdit',
  props: {
    addVisial: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rules: {
        keyId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        programType: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      cascaderProps: { multiple: true },
      isResouceShow: 0,
      user: [],
      businessTypeList: [],
      programTypeList: [],
      programList: [],
      mentorData: {
        userId: '',
        businessType: '',
        keyId: '',
        programType: ''
      },
      keyId: '',
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          setTimeout(() => {
            const { level } = node
            console.log(node)
            if (level == 0) {
              api.getDicListByDicId('program_type').then(res => {
                console.log(res.data)
                let programTypeList = []
                programTypeList = res.data.map((value, i) => ({
                  value: value.itemValue,
                  label: value.itemName,
                  leaf: node.level >= 2
                }))
                resolve(programTypeList)
              })
            }
            if (level == 1) {
              const data = {
                pageSize: 9999,
                pageNum: 1,
                programType: node.value,
                programStatus: '1',
                onlineSale: '1'
              }
              api.promoList(data).then(res => {
                console.log(res.data)
                let programTypeList2 = []
                programTypeList2 = res.data.rows.map((value, i) => ({
                  value: value.programId,
                  label: value.programName,
                  leaf: node.level >= 2
                }))
                resolve(programTypeList2)
              })
            }
            if (level == 2) {
              api.promoDetail(node.value).then(res => {
                console.log(res.data)
                let programTypeList3 = []
                programTypeList3 = [{
                  value: res.data.programId,
                  label: res.data.programName,
                  leaf: node.level >= 2
                }]
                resolve(programTypeList3)
              })
            }
          })
        }
      }
    }
  },
  watch: {
    addVisial (val) {
      if (val) {
        this.initPage()
      }
    }
    // 'mentorData.userId':function(val,oldval){
    //   let newindex =  val.indexOf('all'),oldindex =  oldval.indexOf('all');   //获取val和oldval里all的索引,如果没有则返回-1
    //   if(newindex!=-1 && oldindex==-1 && val.length>1)                       //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
    //       this.mentorData.userId=['all'];
    //   else if(newindex!=-1 && oldindex!=-1 && val.length>1)                 //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
    //       this.mentorData.userId.splice(val.indexOf('all'),1)
    // }
  },
  mounted () {
  },
  methods: {
    initPage () {
      apiDic.getUserList2().then(({ data }) => {
        ++this.isResouceShow
        console.log(data)
        this.user = data.map((value, i) => ({
          label: value.deptName,
          value: value.deptId,
          children: value.userArr.map((item, j) => ({
            value: item.userId,
            label: item.userName
          }))
        }))
        console.log(this.user)
      })
      api.getDicListByDicId('business_type').then(res => {
        console.log(res.data)
        this.businessTypeList = res.data
      })
      api.getDicListByDicId('program_type').then(res => {
        this.programTypeList = res.data
        console.log(res.data)
      })
    },
    clear () {
      this.mentorData = {
        userId: '',
        businessType: '',
        keyId: '',
        programType: ''
      }
      this.programList = []
    },
    programTypeChange () {
      const data = {
        pageSize: 9999,
        pageNum: 1,
        programType: this.mentorData.programType,
        programStatus: '1',
        onlineSale: '1'
      }
      api.promoList(data).then(res => {
        this.programList = res.data.rows
        console.log(res.data)
      })
    },
    handleClose () {
      this.clear()
      this.$emit('close')
    },
    submit () {
      this.$refs.mentorData.validate((valid) => {
        console.log(this.mentorData)
        if (valid) {
          this.$loading()
          const data = {
            businessType: this.mentorData.businessType,
            userArr: this.mentorData.userId.map((item, index) => { return item[1] }),
            keyId: this.mentorData.keyId
          }
          console.log(data)
          api.addPromo(data).then(res => {
            this.$loading().close()
            this.$message.success('新增成功')
            this.clear()
            this.$emit('submit')
          })
        }
      })
    },
    handleChange (event) {
      const pathvalue = this.$refs.sysCascader.getCheckedNodes()[0]
      this.mentorData.keyId = event[2]
      console.log(event)
      if (event.length == 1) {
        this.secondQuestionName = ''
        this.questionName = ''
        this.firstQuestionName = pathvalue.label
      } else if (event.length == 2) {
        this.firstQuestionName = ''
        this.questionName = ''
        this.secondQuestionName = pathvalue.label
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader .el-input .el-input__inner{
	height: 30px!important; //这里高度根据需求自己设定
}
.el-cascader__tags {
	display: inline-flex;
	margin-right: 60px;
	flex-wrap: nowrap;
}

</style>
