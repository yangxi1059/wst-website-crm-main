<!--
 * @Author: 杨曦
 * @Date: 2022-08-09 09:09:38
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-15 16:51:22
 * @Version:
 * @Description:
-->
<template>
  <div class="send-out">
    <el-dialog title="新增Code" :visible.sync="addCodeVisible" width="800px" :before-close="close" :append-to-body="true" :close-on-click-modal="false">
      <el-form :model="templateDate" label-width="100px" ref="tableForm" :rules="rules">
        <el-form-item label="有效日期:" prop="expirationDate">
            <el-date-picker
              v-model="templateDate.expirationDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="可用模式:" prop="codeType">
          <el-radio-group v-model="templateDate.codeType">
            <el-radio label="single">单人</el-radio>
            <el-radio label="multi">多人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程:">
            <div>
                <div v-for="(item,i) in lessonList" :key="i + '1'">
                    <div class="text_block">{{item.courseTitle}}</div>
                    <div class="ml20" v-for="(item2,k) in item.sectionList" :key="k+'1'">
                        <div class="text_block">{{item2.sectionName}}</div>
                        <div class="ml20 flex_block"  v-for="(item3,j) in item2.lessonList" :key="j+'1'">
                            <el-checkbox @change="checked=>checkRow(checked,item3.lessonId)" class="mr20" v-model="item3.checked"></el-checkbox>
                            <span class="text_block">{{item3.videoTitle}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
export default {
  name: 'accessCode_add',
  props: {
    addCodeVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      lessonList: [],
      templateDate: {
        expirationDate: '',
        codeType:''
      },
      rules: {
        expirationDate: [{ required: true, message: '必填', trigger: 'blur' }],
        codeType: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    addCodeVisible: function (val) {
      if (val) {
        this.Topage()
      }
    }
  },
  methods: {
    Topage () {
      api.getAccessCodeTree().then(res => {
        this.lessonList = res.data.courseTree
        this.lessonList.forEach(item => {
          item.sectionList.forEach(item2 => {
            item2.lessonList.forEach(item3 => {
              item3.checked = false
            })
          })
        })
        console.log(this.lessonList)
      })
    },
    checkRow (checked, lessonId) {
      let arr = []
      arr = JSON.parse(JSON.stringify(this.lessonList))
      arr.forEach(item => {
        item.sectionList.forEach(item2 => {
          item2.lessonList.forEach(item3 => {
            if (item3.lessonId === lessonId) {
              item3.checked = checked
            }
          })
        })
      })
      this.lessonList = arr
      console.log(checked, lessonId, this.lessonList)
    },
    close () {
      this.clear()
      this.$emit('close')
    },
    clear () {
      this.lessonList = []
      this.templateDate = {
        expirationDate: '',
        codeType: ''
      }
    },
    submit () {
      let canGo = true
      this.$refs.tableForm.validate(val => {
        canGo = val
      })
      if (!canGo) {
        return
      }
      const lessonIdList = []
      this.lessonList.forEach(item => {
        item.sectionList.forEach(item2 => {
          item2.lessonList.forEach(item3 => {
            if (item3.checked) {
              lessonIdList.push(item3.lessonId)
            }
          })
        })
      })
      if (lessonIdList.length < 1) {
        this.$message.error('请选择code所包含的课程')
      } else if (lessonIdList.length > 3) {
        this.$message.error('code所包含最大课程数量为3，请重新选择！！')
      } else {
        const data = {
          expirationDate: this.templateDate.expirationDate,
          codeType: this.templateDate.codeType,
          lessonIdList: lessonIdList
        }
        console.log(data)
        this.$loading()
        api.addAccessCode(data).then(res => {
          this.$loading().close()
          this.$message.success('新增成功！！')
          this.clear()
          this.$emit('submit')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text_block{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 25px;
  max-height: 25px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.flex_block{
  display: flex;
}
</style>
