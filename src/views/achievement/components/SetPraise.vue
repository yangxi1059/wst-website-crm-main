<!--
 * @Author: kaan
 * @Date: 2021-12-22 17:47:33
 * @LastEditors: kaan
 * @LastEditTime: 2021-12-23 18:30:52
 * @Version: 
 * @Description: 
-->
<template>
  <el-dialog 
    :title="`学员【${praiseData.menteeName}】好评图有码${praiseData.type =='NM' ? '设置':'审核'}`"
    v-if="settingVisible"
    :visible.sync="settingVisible"
    :before-close="close"
    :close-on-click-modal="false"
    :width="praiseData.type =='NM' ? '550px':'950px' "
  >
    <div class="set_container">
      <div class="set_list_content">
        <el-descriptions title="" :column="1" :contentStyle="{flex:1}" size="medium">
          <el-descriptions-item label="毕业于">{{praiseData.finishYear}}</el-descriptions-item>
          <el-descriptions-item label="学校">{{praiseData.schoolChiName}}</el-descriptions-item>
          <el-descriptions-item label="专业">{{praiseData.majorName}}</el-descriptions-item>
        </el-descriptions>
        <ul class="set_img_content">
          <li class="set_img_item">
            <div class="mb10">好评图（有码）</div>
            <el-upload
              class="set_img_btn"
              v-if="roleInfo.includes('offer_list_img_up') && praiseData.type =='NM'"
              action
              :http-request="uploadFileAxios1"
              ref="elupload"
              :limit="1"
              :file-list="praiseFileList"
            >
              <el-button
              class="el-icon-upload"
              slot="trigger"
              size="mini"
              type="primary"
              plain
              >上传图片</el-button>
            </el-upload>
            <el-image 
              style="width: 240px; height: 240px"
              fit="contain"
              :src="praiseVoucherHM" 
              :preview-src-list="praiseHMList"
            >
              <div slot="error" class="image_slot">
                未上传好评图（有码）
              </div>
            </el-image>
          </li>
          <li class="set_img_item">
            <div class="mb10">好评图（无码）</div>
            <el-image 
              style="width: 240px; height: 240px"
              fit="contain"
              :src="praiseVoucherNM" 
              :preview-src-list="praiseNMList"
            >
              <div slot="error" class="image_slot">
                未上传好评图（无码）
              </div>
            </el-image>
          </li>
        </ul>
      </div>

      <div class="set_form_content" v-if="praiseData.type =='HM'">
        <el-form ref="form" :model="praiseData" :rules="rules" label-width="100px">
          <el-form-item label="审核" prop="checkStatus">
            <el-select :style="{width:widths}"  v-model="praiseData.checkStatus" placeholder="请选择">
              <el-option
                v-for="item in checkStatusList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="好评图类型" prop="praiseType">
            <el-select :style="{width:widths}"   v-model="praiseData.praiseType" placeholder="请选择">
              <el-option
                v-for="item in praiseTypeList"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="好评日期:" prop="praiseDate">
            <el-date-picker
              :style="{width:widths}"
              value-format="yyyy-MM-dd"
              v-model="praiseData.praiseDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input
              :style="{width:widths}"
              type="textarea"
              :autosize="{minRows:4}"
              v-model="praiseData.checkNote"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/achievement.js'
import mixins from '@/plugin/mixins'
import files from '@/libs/file'
import { mapState } from 'vuex';
export default {
  name: "setting",
  mixins: [mixins],
  props: {
    settingVisible: {
      type: Boolean,
      default: false
    },
    praiseObjData: {
      type: Object
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data() {
    return {
      praiseData:{},
      praiseFileList:[],
      praiseUrlHM:"",
      praiseVoucherHM:"",
      praiseHMList:[],
      praiseVoucherNM:"",
      praiseNMList:[],

      widths:'250px',
      praiseTypeList:[],
      checkStatusList: [
        {
          itemName: "未核验",
          itemValue: "0"
        },
        {
          itemName: "已核验",
          itemValue: "1"
        },
        {
          itemName: "未通过",
          itemValue: "2"
        }
      ],
      rules: {
        checkStatus: [{ required: true, message: "必填", trigger: "blur" }],
        praiseType: [{ required: true, message: "必填", trigger: "blur" }],
        praiseDate: [{ required: true, message: "必填", trigger: "blur" }],
        checkNote: [{ required: true, message: "必填", trigger: "blur" }]
      }
    }
  },
  watch: {
    settingVisible: async function(val) {
      if (val) {
        this.praiseData = JSON.parse(JSON.stringify(this.praiseObjData))
        if(this.praiseData.praiseVoucher){
          files.getImgUrl(this.praiseData.praiseVoucher,url => (
            this.praiseVoucherNM = url,
            this.praiseNMList = [url]
          ));
        }
        if(this.praiseData.praiseVoucherMosaic){
          files.getImgUrl(this.praiseData.praiseVoucherMosaic,url => (
            this.praiseUrlHM = this.praiseData.praiseVoucherMosaic,
            this.praiseVoucherHM = url,
            this.praiseHMList = [url]
          ));
        }
        if(this.praiseData.type=="HM"){
          this.praiseTypeList = await this.getDictionary("praise_type")
        }
      }
    }
  },
  methods: {
    /**
     * @description: 好评图有码上传
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */    
    uploadFileAxios1(file, fileList) {
      var testmsg=file.file.name.substring(file.file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if(!extension && !extension2 && !extension3) {
          this.$message({
              message: '上传文件只能是图片（png,jpg,jpeg）!',
              type: 'warning'
          });
        this.$refs.elupload.clearFiles();
        return false;
      }
      this.praiseFileList = [];
      files.uploadFunBySys(file.file, `good_figure/offer_list/${this.praiseData.pkId}`,
        url => {
          this.praiseUrlHM = url
          files.getImgUrl(url,url => (
            this.praiseVoucherHM = url,
            this.praiseHMList = [url]
          ) );
          this.$refs.elupload.clearFiles();
        }
      );
    },
    submit(){
      if(this.praiseUrlHM == "" || !this.praiseData.praiseVoucher){
        this.$message.warning("请上传好评图") 
        return;
      }
      if(this.praiseData.type =='HM'){
        this.$refs.form.validate(valid => {
          if (!valid) return;
        })
      }
      let data = {
        pkId: this.praiseData.pkId,
        praiseDate: this.praiseData.praiseDate,
        checkStatus: this.praiseData.checkStatus,
        checkNote: this.praiseData.checkNote,
        praiseType: this.praiseData.praiseType,
      }
      if(this.praiseData.type=="NM"){
        data.praiseVoucherMosaic = this.praiseUrlHM
      }
      console.log(data)
      api.setMenteePraise(data).then(res => {
        if(res.code =="200"){
          this.$message.success("提交成功") 
          this.clear()
          this.$emit('submit')
        }else{
          this.$message.error(res.message) 
        }
          
      })
    },
    close() {
      this.clear()
      this.$emit("close");
    },
    clear(){
      Object.assign(this.$data, this.$options.data());
    },
  }
}
</script>

<style lang="scss" scoped>
.set_container{
  display: flex;
  .set_list_content{
    width:550px;
  }
  .set_img_content{
    width:100%;
    .set_img_item{
      position: relative;
      width:50%;
      display: inline-block;
      ::v-deep .image_slot{
        margin-top:50%;
        text-align: center;
      }
    }
    .set_img_btn{
      position:absolute;
      top:0;
      right:15px;
    }
  }
  .set_form_content{
    flex: 1;
  }
}
</style>