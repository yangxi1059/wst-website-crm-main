<!--
 * @Author: 库建华
 * @Date: 2020-05-12 17:21:28
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-11 11:14:56
 * @Version: 1
 * @Description:
 -->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="图片管理" :visible.sync="imgListVisible" width="800px" :before-close="close">
      <div>
        <el-upload action :before-upload="upload" accept="image/*">
            <el-tooltip class="item" effect="dark" content="请注意文件名，避免重名" placement="top-start">
                <el-button type="primary" size="small">点击上传图片</el-button>
            </el-tooltip>
        </el-upload>
        <div style="display:flex;flex-wrap:wrap;margin-top:20px">
            <div v-for="(item,i) in imgList" :key="item.pkId" style="margin-right:20px;margin-bottom:20px;position:relative;">
                  <div class="block" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);position:relative;">
                      <div class="blcok2" style="">
                        <div class="block3">
                          <el-button class="block4" title="编辑" type="primary" size="small" @click="ediImg(item.pkId,item.imageUrl,item.imageName)"   icon="el-icon-edit" circle ></el-button>
                        </div>
                        <div class="block3">
                          <el-button class="block4" title="复制地址" type="success" size="small" @click="copyImg()"  v-copy="item.imageUrl" icon="el-icon-copy-document" circle ></el-button>
                        </div>
                        <div class="block3">
                          <el-button class="block4" title="删除" type="danger" size="small" @click="deleteImg(item.pkId)" icon="el-icon-delete" circle ></el-button>
                        </div>
                      </div>
                      <el-image fit="contain" :preview-src-list="[item.imageUrl]" style="width: 150px; height: 150px" :src="item.imageUrl"></el-image>
                  </div>
                <div style="text-align:center">{{item.imageName}}</div>
            </div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"  :visible.sync="imgListVisible2" width="420px" :before-close="close2">
      <div class="title2">请输入新的图片名称</div>
      <div>
        <el-input v-model="imageNameNew" ></el-input>
      </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close2" size="mini">取 消</el-button>
          <el-button type="primary" size="mini" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/vip'
import { uploadFunBySys } from '@/libs/file'
export default {
  components: { },
  props: {
    imgListVisible: {
      type: Boolean,
      default: false
    },
    pkId: {}
  },
  data () {
    return {
      imgList: [],
      imgListVisible2: false,
      pkIdNew: null,
      imageUrlNew: '',
      imageNameNew: ''
    }
  },
  watch: {
    imgListVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  methods: {
    initPage () {
      // 初始化图片列表
      const data = {
        pageNum: '1',
        pageSize: 9999
      }
      this.$loading()
      api.getImgage(data).then(res => {
        console.log(res)
        this.$loading().close()
        this.imgList = res.data.rows
      })
    },
    close () {
      this.$emit('close')
    },
    deleteImg (pkId) {
      this.$confirm('此操作将永久删除此图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delImgage(pkId).then(() => {
          this.$message.success('删除成功')
          this.initPage()
        })
      })
    },
    close2 () {
      this.imgListVisible2 = false
      this.imageNameNew = ''
    },
    submit () {
      this.$loading()
      const data = {
        imageUrl: this.imageUrlNew,
        imageName: this.imageNameNew,
        pkId: this.pkIdNew
      }
      console.log(data)
      api.editImgage(data).then(res => {
        console.log(res)
        this.$message.success('修改成功')
        this.$loading().close()
        this.initPage()
        this.close2()
      })
    },
    upload (file) {
      console.log(file, file.size)
      let data = {}
      uploadFunBySys(file, 'newsLetter/img', url => {
        console.log(url)
        this.$copyText(url)
          .then(() => {
            this.$alert('图片路径[ ' + url + ' ] (已复制到粘贴板)')
            data = {
              imageName: file.name,
              imageUrl: url
            }
            api.addImgage(data).then(() => {
              this.initPage()
            })
          })
          .catch(() => {
            this.$alert(url, 'Code(需要手动复制)')
            data = {
              imageName: file.name,
              imageUrl: url
            }
            api.addImgage(data).then(() => {
              this.initPage()
            })
          })
      })
    },
    copyImg () {
      this.$message.success('复制成功')
    },
    ediImg (pkId, imageUrl, imageName) {
      this.imgListVisible2 = true
      this.pkIdNew = pkId
      this.imageUrlNew = imageUrl
      this.imageNameNew = imageName
    }
  }
}
</script>

<style lang="scss" scoped>
.blcok2{
  position:absolute;
  z-index: 9999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: none;
}
.block:hover .blcok2{
  display: flex;
}
.block3{
  width:33%;
  position: relative;
}
.block4{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.title2{
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
  margin-bottom: 10px;
}
</style>
