<!--
 * @Author: kaan
 * @Date: 2021-03-18 16:48:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-02-16 09:11:15
 * @Version:
 * @Description:
-->

<template>
  <el-dialog :close-on-click-modal="false" title="图片上传" :visible="imgVisible" top="5vh" :before-close="close" width="800px" >
    <el-tabs v-model="imgTab" type="card" >
      <el-tab-pane label="主图列表" name="mainArr">
        <div class="img-container">
          <vuedraggable
            class="vue-draggable"
            v-model="mainImgArr"
            tag="ul"
            draggable=".draggable-item"
            @start="onDragStart"
            @end="onDragEnd"
          >
            <li
              v-for="(item, index) in mainImgArr"
              :key="index"
              class="draggable-item "
            >
              <el-image :src="item.imageUrl" fit="contain" :preview-src-list="[item.imageUrl]"></el-image>
              <div class="shadow" @click="remove(index)">
                <i class="el-icon-delete"></i>
              </div>
            </li>
            <App-cropper
              :width="400"
              :height="301"
              :fixed-number="[7.5,5.6]"
              :img-tab = "imgTab"
              @subUploadSucceed="getShopImages">
            </App-cropper>
          </vuedraggable>
        </div>

      </el-tab-pane>
      <el-tab-pane label="详情图列表" name="detailArr">
        <div class="detailImg-box1 img-container">
          <vuedraggable
            class="vue-draggable"
            v-model="detailImgArr"
            tag="ul"
            draggable=".draggable-item"
            @start="onDragStart"
            @end="onDragEnd"
          >
            <!-- 拖拽元素 -->
            <li
              v-for="(item, index) in detailImgArr"
              :key="index"
              class="draggable-item "
            >
              <el-image :src="item.imageUrl" fit="contain" :preview-src-list="[item.imageUrl]"></el-image>
              <div class="shadow" @click="remove(index)">
                <i class="el-icon-delete"></i>
              </div>
            </li>
            <App-cropper
              :width="400"
              :height="301"
              :fixed-number="[7.5,5.6]"
              :img-tab = "imgTab"
              @subUploadSucceed="getShopImages">
            </App-cropper>
          </vuedraggable>
        </div>
        <ul class="detailImg-box2 img-container">
            <li v-for="(item, index) in detailImgArr":key="item.imageName">
              <el-image :src="item.imageUrl" :preview-src-list="[item.imageUrl]"  style="width:600px"></el-image>
            </li>
          </ul>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AppCropper from './Cropper.vue'
import api from '@/api/dictionary'
import vuedraggable from 'vuedraggable'

export default {
  components: { AppCropper, vuedraggable },
  props: {
    programId: {
      type: String,
      default: ''
    },
    imgVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imgTab: 'mainArr',
      mainImgArr: [],
      detailImgArr: []

    }
  },
  watch: {
    imgVisible: function (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    // 图片上传成功
    getShopImages (fileName, url) {
      console.log('picObj:', fileName, url)
      const addItem = {
        imageUrl: url,
        imageName: fileName,
        sort: this.mainImgArr.length,
        displayStatus: 0
      }
      if (this.imgTab == 'mainArr') {
        this.mainImgArr.push(addItem)
      } else {
        this.detailImgArr.push(addItem)
      }
    },
    init () {
      this.mainImgArr = []
      this.detailImgArr = []
      api.getMainImg(this.programId).then((res) => {
        this.mainImgArr = res.data
      })
      api.getDetailImg(this.programId).then((res) => {
        this.detailImgArr = res.data
      })
    },
    close () {
      this.tableData = []
      this.$emit('close')
    },
    submit () {
      const params = {
        programId: this.programId,
        mainArr: [],
        detailArr: []
      }
      this.mainImgArr.forEach((v, index) => {
        params.mainArr.push({
          imageUrl: v.imageUrl,
          imageName: v.imageName,
          sort: index,
          displayStatus: 1
        })
      })
      this.detailImgArr.forEach((v, index) => {
        params.detailArr.push({
          imageUrl: v.imageUrl,
          imageName: v.imageName,
          sort: index,
          displayStatus: 1
        })
      })
      console.log(params)
      api.editImage(params).then((res) => {
        console.log(res)
      })
      this.$emit('submit')
    },
    onDragStart (e) {
      e.target.classList.add('hideShadow')
    },
    onDragEnd (e) {
      e.target.classList.remove('hideShadow')
    },
    remove (index) {
      if (this.imgTab == 'mainArr') {
        this.mainImgArr.splice(index, 1)
      } else {
        this.detailImgArr.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img-container{
  height:calc(90vh - 300px);
  overflow:auto;
}
.vue-draggable {
  display: flex;
  flex-wrap: wrap;
  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .el-image {
      height:120px;
      width:120px;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: opacity .3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
}
.detailImg-box1{
  width:130px;
  margin-right:10px;
  display: inline-block;
  vertical-align:top;
}
.detailImg-box2{
  width:610px;
  display: inline-block;
  vertical-align:top;
}
</style>
