<!--
 * @Author: 库建华
 * @Date: 2019-06-04 13:33:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-23 17:33:50
 * @Version: 1
 * @Description:
 -->
<template>
  <div class="inputInformation">
    <el-dialog
      :close-on-click-modal="false"
      class="info"
      title="新增课程方向"
      :visible.sync="addVisible"
      width="550px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="mini"
        :model="trackData"
        :rules="rules"
        ref="trackData"
        label-width="110px"
      >
        <el-form-item label="课程方向" prop="trackId">
					<el-select style="width:200px" v-model="trackData.trackId" >
						<el-option
							v-for="item in trackList"
							:key="item.itemValue"
							:label="item.itemName"
							:value="item.itemValue"
						></el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="状态" prop="disableStatus">
					<el-switch
						v-model="trackData.disableStatus"
						active-color="#13ce66"
						active-value="1"
						inactive-value="0"
						inactive-color="#ff4949">
					</el-switch>
        </el-form-item>
        <div class="block">
          <div class="block1">课程内容</div>
          <div class="">
             <el-button class="ml10" type="success"  maxlength="100" show-word-limit icon="el-icon-circle-plus-outline" @click="addBlock" size="mini" circle></el-button>
          </div>
        </div>
        <div class="block block2"  v-for="(item,i) in trackData.typeList" :key="i">
          <div>
             <el-button type="danger" icon="el-icon-delete" @click="deleteBlock(i)" v-if="i != 0" size="mini" circle></el-button>
             <el-button type="danger" icon="el-icon-delete" style="opacity:0" v-else size="mini" circle></el-button>
          </div>
          <div>
            <el-input class="iptLength" v-model="item.contentType" placeholder="行业课程类型"></el-input>
          </div>
          <div>
            <el-switch
             style="margin-top:4px"
						  v-model="item.disableStatus"
              active-color="#13ce66"
              active-value="1"
              inactive-value="0"
              inactive-color="#ff4949">
            </el-switch>
          </div>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary'
import mixins from '@/plugin/mixins'
export default {
  mixins: [mixins],
  name: 'mentorEdit',
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rules: {
        trackId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        disableStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      trackData: {
        trackId: '',
        disableStatus: '1',
        typeList: [
          {
            contentType: '',
            disableStatus: '1'
          }
        ]
      },
      trackList: [],
      disableStatusList: [
        { itemName: '启用', itemValue: '1' },
        { itemName: '禁用', itemValue: '0' }
      ]
    }
  },
  watch: {
    addVisible (val) {
      if (val) {
        this.pageInit()
      }
    }
  },
  methods: {
    async pageInit () {
      this.trackList = await this.getDictionary('track')
      console.log(this.trackList)
    },
    clear () {
      this.trackData = {
        trackId: '',
        disableStatus: '1',
        typeList: [
          {
            contentType: '',
            disableStatus: '1'
          }
        ]
      }
    },
    handleClose () {
      this.clear()
      this.$emit('close')
    },
    submit () {
      this.$refs.trackData.validate((valid) => {
        console.log(this.trackData)
        if (valid) {
          let a = 0
          this.trackData.typeList.forEach(item => {
            if (!item.contentType) {
              a++
            }
          })
          if (a) {
            this.$message.error('请填入行业课程类型，必填一条，其他未输入的行业课程类型请删除！！')
          } else {
            this.$loading()
            console.log(this.trackData)
            apiDic.addLessonTrackList(this.trackData).then(res => {
              if (res.code == 20001) {
                this.$message.error(res.message)
                this.$loading().close()
              } else {
                this.$message.success('新增成功')
                this.$loading().close()
                this.clear()
                this.$emit('submit')
              }
            }).catch(err => {
            })
          }
        }
      })
    },
    addBlock () {
      this.trackData.typeList.push({ contentType: '', disableStatus: '1' })
    },
    deleteBlock (i) {
      this.trackData.typeList.splice(i, 1)
    }
  }
}

</script>

<style lang="scss" scoped>
.block{
  display: flex;
  margin-bottom: 10px;
}
.block1{
  width: 98px;
  text-align: right;
}
.block2{
  width: 430px;
  justify-content: space-between;
  margin-left: 40px;
}
.iptLength{
  width: 340px;
}
</style>
